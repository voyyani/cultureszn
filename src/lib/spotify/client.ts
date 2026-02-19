/**
 * Spotify Client Service
 * 
 * Main Spotify API client using Client Credentials flow for server-side requests.
 * Handles authentication, token management, and API calls with caching.
 */

import SpotifyWebApi from 'spotify-web-api-node'
import { spotifyCache, cacheKeys, CACHE_TTL } from './cache'

/**
 * Get Spotify credentials (lazy evaluation to allow env loading)
 */
function getCredentials() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

  return { clientId, clientSecret }
}

/**
 * Spotify Track Interface
 */
export interface SpotifyTrack {
  id: string
  title: string
  artists: Array<{ id: string; name: string }>
  album: {
    id: string
    name: string
    coverArt?: string
    releaseDate: string
    type: string
  }
  durationMs: number
  previewUrl?: string
  popularity: number
  explicit: boolean
  availableMarkets: string[]
  externalUrl: string
  isrc?: string
}

/**
 * Spotify Artist Interface
 */
export interface SpotifyArtist {
  id: string
  name: string
  images: Array<{ url: string; height: number; width: number }>
  genres: string[]
  popularity: number
  followers: number
  externalUrl: string
}

/**
 * Spotify Album Interface
 */
export interface SpotifyAlbum {
  id: string
  name: string
  artists: Array<{ id: string; name: string }>
  images: Array<{ url: string; height: number; width: number }>
  releaseDate: string
  type: string
  tracks: SpotifyTrack[]
  externalUrl: string
}

class SpotifyClient {
  private api: SpotifyWebApi
  private tokenExpiry: number = 0

  constructor() {
    const { clientId, clientSecret } = getCredentials()
    
    if (!clientId || !clientSecret) {
      console.warn('⚠️  Spotify credentials not found. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET')
    }

    this.api = new SpotifyWebApi({
      clientId,
      clientSecret,
    })
  }

  /**
   * Get application access token (Client Credentials flow)
   */
  private async ensureToken(): Promise<string> {
    // Check if token is still valid (with 5-minute buffer)
    if (Date.now() < this.tokenExpiry - 5 * 60 * 1000) {
      return this.api.getAccessToken() || ''
    }

    try {
      const data = await this.api.clientCredentialsGrant()
      this.api.setAccessToken(data.body.access_token)
      this.tokenExpiry = Date.now() + data.body.expires_in * 1000
      
      console.log('✅ Spotify access token refreshed')
      return data.body.access_token
    } catch (error) {
      console.error('❌ Failed to get Spotify access token:', error)
      throw new Error('Failed to authenticate with Spotify')
    }
  }

  /**
   * Get track by ID with caching
   */
  async getTrack(trackId: string): Promise<SpotifyTrack | null> {
    // Check cache first
    const cacheKey = cacheKeys.track(trackId)
    const cached = spotifyCache.get<SpotifyTrack>(cacheKey)
    if (cached) return cached

    try {
      await this.ensureToken()
      const response = await this.api.getTrack(trackId)
      const track = this.transformTrack(response.body)

      // Cache for 6 hours
      spotifyCache.set(cacheKey, track, CACHE_TTL.TRACK)

      return track
    } catch (error) {
      console.error(`Failed to fetch track ${trackId}:`, error)
      return null
    }
  }

  /**
   * Get multiple tracks in one request (up to 50)
   */
  async getTracks(trackIds: string[]): Promise<SpotifyTrack[]> {
    // Filter out IDs we already have cached
    const uncachedIds: string[] = []
    const tracks: SpotifyTrack[] = []

    for (const id of trackIds) {
      const cached = spotifyCache.get<SpotifyTrack>(cacheKeys.track(id))
      if (cached) {
        tracks.push(cached)
      } else {
        uncachedIds.push(id)
      }
    }

    // Fetch uncached tracks
    if (uncachedIds.length > 0) {
      try {
        await this.ensureToken()
        const response = await this.api.getTracks(uncachedIds)
        
        const newTracks = response.body.tracks
          .filter(t => t !== null)
          .map(t => this.transformTrack(t))

        // Cache each track
        newTracks.forEach(track => {
          spotifyCache.set(cacheKeys.track(track.id), track, CACHE_TTL.TRACK)
          tracks.push(track)
        })
      } catch (error) {
        console.error('Failed to fetch tracks:', error)
      }
    }

    return tracks
  }

  /**
   * Get artist by ID
   */
  async getArtist(artistId: string): Promise<SpotifyArtist | null> {
    const cacheKey = cacheKeys.artist(artistId)
    const cached = spotifyCache.get<SpotifyArtist>(cacheKey)
    if (cached) return cached

    try {
      await this.ensureToken()
      const response = await this.api.getArtist(artistId)
      const artist = this.transformArtist(response.body)

      spotifyCache.set(cacheKey, artist, CACHE_TTL.ARTIST)
      return artist
    } catch (error) {
      console.error(`Failed to fetch artist ${artistId}:`, error)
      return null
    }
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId: string, market = 'US'): Promise<SpotifyTrack[]> {
    const cacheKey = cacheKeys.topTracks(artistId, market)
    const cached = spotifyCache.get<SpotifyTrack[]>(cacheKey)
    if (cached) return cached

    try {
      await this.ensureToken()
      const response = await this.api.getArtistTopTracks(artistId, market)
      const tracks = response.body.tracks.map(t => this.transformTrack(t))

      spotifyCache.set(cacheKey, tracks, CACHE_TTL.TOP_TRACKS)
      return tracks
    } catch (error) {
      console.error(`Failed to fetch top tracks for ${artistId}:`, error)
      return []
    }
  }

  /**
   * Get artist's albums
   */
  async getArtistAlbums(artistId: string, options = {}): Promise<any[]> {
    const cacheKey = cacheKeys.artistAlbums(artistId)
    const cached = spotifyCache.get<any[]>(cacheKey)
    if (cached) return cached

    try {
      await this.ensureToken()
      const response = await this.api.getArtistAlbums(artistId, {
        limit: 50,
        include_groups: 'album,single',
        ...options,
      })
      
      const albums = response.body.items
      spotifyCache.set(cacheKey, albums, CACHE_TTL.ARTIST)
      return albums
    } catch (error) {
      console.error(`Failed to fetch albums for ${artistId}:`, error)
      return []
    }
  }

  /**
   * Search for tracks
   */
  async searchTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
    const cacheKey = cacheKeys.search(query, 'track')
    const cached = spotifyCache.get<SpotifyTrack[]>(cacheKey)
    if (cached) return cached

    try {
      await this.ensureToken()
      const response = await this.api.searchTracks(query, { limit })
      const tracks = response.body.tracks?.items.map(t => this.transformTrack(t)) || []

      spotifyCache.set(cacheKey, tracks, CACHE_TTL.SEARCH)
      return tracks
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  /**
   * Transform Spotify API track response to our format
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
        type: spotifyTrack.album.album_type,
      },
      durationMs: spotifyTrack.duration_ms,
      previewUrl: spotifyTrack.preview_url || undefined,
      popularity: spotifyTrack.popularity,
      explicit: spotifyTrack.explicit,
      availableMarkets: spotifyTrack.available_markets || [],
      externalUrl: spotifyTrack.external_urls.spotify,
      isrc: spotifyTrack.external_ids?.isrc,
    }
  }

  /**
   * Transform Spotify API artist response to our format
   */
  private transformArtist(spotifyArtist: any): SpotifyArtist {
    return {
      id: spotifyArtist.id,
      name: spotifyArtist.name,
      images: spotifyArtist.images || [],
      genres: spotifyArtist.genres || [],
      popularity: spotifyArtist.popularity,
      followers: spotifyArtist.followers?.total || 0,
      externalUrl: spotifyArtist.external_urls.spotify,
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return spotifyCache.getStats()
  }

  /**
   * Clear cache
   */
  clearCache() {
    spotifyCache.flush()
  }
}

// Export singleton instance
export const spotifyClient = new SpotifyClient()
