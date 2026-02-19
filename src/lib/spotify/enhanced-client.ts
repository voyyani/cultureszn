/**
 * Enhanced Spotify Client with Performance Monitoring & Resilience
 * 
 * World-class implementation with:
 * - Performance monitoring
 * - Rate limiting
 * - Retry with exponential backoff
 * - Circuit breaker pattern
 * - Comprehensive error handling
 */

import { spotifyCache, cacheKeys, CACHE_TTL } from './cache'
import { performanceMonitor, measureAsync } from './performance'
import { spotifyRateLimiter, withRateLimit } from './rate-limiter'
import { retryWithBackoff, spotifyCircuitBreaker } from './retry'
import type { SpotifyTrack } from './client'

interface EnhancedAPIResponse<T> {
  data: T
  cached: boolean
  responseTime: number
  fromCache: boolean
}

class EnhancedSpotifyClient {
  private baseUrl = 'https://api.spotify.com/v1'
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  /**
   * Get access token with caching
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    return measureAsync('get_access_token', async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            btoa(
              `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
                import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
              }`
            ),
        },
        body: 'grant_type=client_credentials',
      })

      if (!response.ok) {
        throw new Error(`Token fetch failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000

      return this.accessToken!
    })
  }

  /**
   * Make API request with all resilience patterns
   */
  private async makeRequest<T>(
    endpoint: string,
    cacheKey: string,
    cacheTTL: number,
    priority: 'high' | 'normal' = 'normal'
  ): Promise<EnhancedAPIResponse<T>> {
    const startTime = Date.now()

    // Check cache first
    const cached = spotifyCache.get<T>(cacheKey)
    if (cached) {
      const responseTime = Date.now() - startTime
      performanceMonitor.recordOperation(endpoint, startTime, true, true)

      return {
        data: cached,
        cached: true,
        responseTime,
        fromCache: true,
      }
    }

    // Make request with rate limiting, retry, and circuit breaker
    const data = await withRateLimit(
      () =>
        retryWithBackoff(
          () =>
            spotifyCircuitBreaker.execute(async () => {
              const token = await this.getAccessToken()

              const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              if (!response.ok) {
                const error: any = new Error(
                  `Spotify API error: ${response.status}`
                )
                error.status = response.status
                error.headers = Object.fromEntries(response.headers.entries())
                throw error
              }

              return response.json()
            }),
          {
            maxRetries: 3,
            onRetry: (attempt, error) => {
              console.warn(`[SpotifyClient] Retry ${attempt} for ${endpoint}`, error)
            },
          }
        ),
      priority
    )

    // Cache the result
    spotifyCache.set(cacheKey, data, cacheTTL)

    const responseTime = Date.now() - startTime
    performanceMonitor.recordOperation(endpoint, startTime, true, false)

    return {
      data,
      cached: false,
      responseTime,
      fromCache: false,
    }
  }

  /**
   * Get track by ID with enhanced reliability
   */
  async getTrack(trackId: string): Promise<EnhancedAPIResponse<SpotifyTrack>> {
    return this.makeRequest<any>(
      `/tracks/${trackId}`,
      cacheKeys.track(trackId),
      CACHE_TTL.TRACK,
      'normal'
    ).then((response) => ({
      ...response,
      data: this.transformTrack(response.data),
    }))
  }

  /**
   * Get multiple tracks (batch request)
   */
  async getTracks(trackIds: string[]): Promise<EnhancedAPIResponse<SpotifyTrack[]>> {
    if (trackIds.length === 0) {
      return {
        data: [],
        cached: false,
        responseTime: 0,
        fromCache: false,
      }
    }

    // Check cache for each track
    const cachedTracks: SpotifyTrack[] = []
    const uncachedIds: string[] = []

    for (const id of trackIds) {
      const cached = spotifyCache.get<any>(cacheKeys.track(id))
      if (cached) {
        cachedTracks.push(this.transformTrack(cached))
      } else {
        uncachedIds.push(id)
      }
    }

    // If all cached, return immediately
    if (uncachedIds.length === 0) {
      return {
        data: cachedTracks,
        cached: true,
        responseTime: 0,
        fromCache: true,
      }
    }

    // Fetch uncached tracks (max 50 at a time)
    const response = await this.makeRequest<any>(
      `/tracks?ids=${uncachedIds.slice(0, 50).join(',')}`,
      cacheKeys.tracks(uncachedIds),
      CACHE_TTL.TRACK,
      'normal'
    )

    const uncachedTracks = response.data.tracks
      .filter((t: any) => t !== null)
      .map(this.transformTrack)

    // Cache individual tracks
    uncachedTracks.forEach((track: SpotifyTrack) => {
      spotifyCache.set(cacheKeys.track(track.id), track, CACHE_TTL.TRACK)
    })

    return {
      data: [...cachedTracks, ...uncachedTracks],
      cached: cachedTracks.length > 0,
      responseTime: response.responseTime,
      fromCache: false,
    }
  }

  /**
   * Get artist top tracks with caching
   */
  async getArtistTopTracks(
    artistId: string,
    market: string = 'US'
  ): Promise<EnhancedAPIResponse<SpotifyTrack[]>> {
    return this.makeRequest<any>(
      `/artists/${artistId}/top-tracks?market=${market}`,
      cacheKeys.topTracks(artistId, market),
      CACHE_TTL.TOP_TRACKS,
      'high' // Higher priority for user-facing requests
    ).then((response) => ({
      ...response,
      data: response.data.tracks.map(this.transformTrack),
    }))
  }

  /**
   * Transform Spotify track to our format
   */
  private transformTrack(spotifyTrack: any): SpotifyTrack {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artists: spotifyTrack.artists.map((a: any) => ({
        id: a.id,
        name: a.name,
      })),
      album: {
        id: spotifyTrack.album.id,
        name: spotifyTrack.album.name,
        coverArt: spotifyTrack.album.images[0]?.url,
        releaseDate: spotifyTrack.album.release_date,
        type: spotifyTrack.album.album_type || 'album',
      },
      durationMs: spotifyTrack.duration_ms,
      previewUrl: spotifyTrack.preview_url,
      popularity: spotifyTrack.popularity,
      explicit: spotifyTrack.explicit,
      availableMarkets: spotifyTrack.available_markets || [],
      externalUrl: spotifyTrack.external_urls.spotify,
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      performance: performanceMonitor.getSummary(),
      rateLimit: spotifyRateLimiter.getStatus(),
      circuitBreaker: spotifyCircuitBreaker.getState(),
      cache: spotifyCache.getStats(),
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getAccessToken()
      return performanceMonitor.isHealthy()
    } catch {
      return false
    }
  }
}

// Export enhanced client
export const enhancedSpotifyClient = new EnhancedSpotifyClient()
