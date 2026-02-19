/**
 * Latest Releases API Endpoint
 * 
 * GET /api/spotify/latest-releases
 * 
 * Fetches the latest releases with live Spotify metadata.
 * Falls back to static data if Spotify API fails.
 * 
 * Features:
 * - Batch fetching from Spotify API (up to 50 tracks)
 * - Smart merging of Spotify data with static metadata
 * - Multi-layer caching (30min TTL)
 * - Graceful fallback to static data
 * - Rate limiting protection
 * - Performance monitoring
 * 
 * Query Parameters:
 * - limit: number (default: 10) - Number of releases to return
 * - artistSlug: string (optional) - Filter by specific artist
 * - includeMetadata: boolean (default: true) - Include full Spotify metadata
 * 
 * Response:
 * {
 *   success: boolean
 *   data: EnrichedRelease[]
 *   cached: boolean
 *   fallback: boolean
 *   syncedAt: string (ISO timestamp)
 *   meta: {
 *     limit: number
 *     total: number
 *     spotifyApiCalled: boolean
 *     cacheHit: boolean
 *     responseTime: number
 *   }
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { spotifyClient } from '../../src/lib/spotify/client'
import { spotifyCache, cacheKeys, CACHE_TTL } from '../../src/lib/spotify/cache'
import { extractSpotifyId, isValidSpotifyId } from '../../src/lib/spotify/utils'
import { performanceMonitor } from '../../src/lib/spotify/performance'
import { spotifyRateLimiter } from '../../src/lib/spotify/rate-limiter'
import {
  validateLatestReleasesParams,
  logError,
  LatestReleasesErrorCode,
  createErrorResponse,
} from '../../src/lib/spotify/latest-releases-errors'

// Import static data
import { getRecentReleases, getReleasesByArtist } from '../../src/data/releases'
import type { Release } from '../../src/types'
// Import SpotifyTrack type
import type { SpotifyTrack } from '../../src/lib/spotify/client'

/**
 * Enriched Release Interface
 * Combines static data with live Spotify metadata
 */
export interface EnrichedRelease {
  // Static data (always present)
  id: string
  slug: string
  artistSlug: string
  artist: string
  type: 'single' | 'ep' | 'album' | 'visual-album' | 'instrumental'
  featured: boolean
  description?: string
  
  // Merged data (Spotify > Static)
  title: string
  coverArt: string
  releaseDate: string
  
  // Spotify-only data (may be null)
  spotifyId?: string
  spotifyUri?: string // For playback
  durationMs?: number
  explicit?: boolean
  popularity?: number
  previewUrl?: string
  availableMarkets?: string[]
  tracks?: string[] // For albums
  
  // Computed metadata
  isPlayable: boolean
  source: 'spotify' | 'static' | 'mixed'
  
  // Streaming links
  streamingLinks: {
    spotify?: string
    appleMusic?: string
    soundcloud?: string
    youtube?: string
  }
}

/**
 * API Response Interface
 */
interface LatestReleasesResponse {
  success: boolean
  data: EnrichedRelease[]
  cached: boolean
  fallback: boolean
  syncedAt: string
  meta: {
    limit: number
    total: number
    spotifyApiCalled: boolean
    cacheHit: boolean
    responseTime: number
  }
}

/**
 * Transform static release to enriched format (fallback)
 */
function enrichStaticRelease(staticRelease: Release): EnrichedRelease {
  const spotifyId = extractSpotifyId(staticRelease.streamingLinks.spotify)
  
  return {
    // Static data
    id: staticRelease.id,
    slug: staticRelease.slug,
    artistSlug: staticRelease.artistSlug,
    artist: staticRelease.artist,
    type: staticRelease.type,
    featured: staticRelease.featured || false,
    description: staticRelease.description,
    
    // Use static values
    title: staticRelease.title,
    coverArt: staticRelease.coverArt,
    releaseDate: staticRelease.releaseDate,
    
    // Spotify data (if ID available)
    spotifyId: spotifyId || undefined,
    spotifyUri: spotifyId ? `spotify:track:${spotifyId}` : undefined,
    tracks: staticRelease.tracks,
    
    // Computed
    isPlayable: false, // No Spotify data
    source: 'static',
    
    // Streaming links
    streamingLinks: staticRelease.streamingLinks,
  }
}

/**
 * Merge Spotify data with static release
 * Priority: Spotify API > Static Data
 */
function mergeWithSpotifyData(
  staticRelease: Release,
  spotifyTrack: SpotifyTrack
): EnrichedRelease {
  return {
    // Static data (always present)
    id: staticRelease.id,
    slug: staticRelease.slug,
    artistSlug: staticRelease.artistSlug,
    artist: staticRelease.artist,
    type: staticRelease.type,
    featured: staticRelease.featured || false,
    description: staticRelease.description,
    
    // Spotify data (preferred)
    title: spotifyTrack.title,
    coverArt: spotifyTrack.album.coverArt || staticRelease.coverArt,
    releaseDate: spotifyTrack.album.releaseDate || staticRelease.releaseDate,
    
    // Spotify-only data
    spotifyId: spotifyTrack.id,
    spotifyUri: `spotify:track:${spotifyTrack.id}`,
    durationMs: spotifyTrack.durationMs,
    explicit: spotifyTrack.explicit,
    popularity: spotifyTrack.popularity,
    previewUrl: spotifyTrack.previewUrl,
    availableMarkets: spotifyTrack.availableMarkets,
    tracks: staticRelease.tracks, // Keep static track listing for albums
    
    // Computed
    isPlayable: true,
    source: 'spotify',
    
    // Streaming links (merge both)
    streamingLinks: {
      ...staticRelease.streamingLinks,
      spotify: spotifyTrack.externalUrl,
    },
  }
}

/**
 * Extract Spotify IDs from releases
 */
function extractSpotifyIds(releases: Release[]): string[] {
  const ids: string[] = []
  
  for (const release of releases) {
    const spotifyId = extractSpotifyId(release.streamingLinks.spotify)
    if (spotifyId && isValidSpotifyId(spotifyId)) {
      ids.push(spotifyId)
    }
  }
  
  return ids
}

/**
 * Enrich releases with Spotify data
 */
async function enrichReleasesWithSpotify(
  staticReleases: Release[]
): Promise<{ releases: EnrichedRelease[]; spotifyApiCalled: boolean }> {
  // Extract Spotify IDs
  const spotifyIds = extractSpotifyIds(staticReleases)
  
  // If no Spotify IDs, return static data
  if (spotifyIds.length === 0) {
    console.log('[Latest Releases] No Spotify IDs found, using static data')
    return {
      releases: staticReleases.map(enrichStaticRelease),
      spotifyApiCalled: false,
    }
  }
  
  try {
    // Batch fetch from Spotify (with rate limiting)
    console.log(`[Latest Releases] Fetching ${spotifyIds.length} tracks from Spotify`)
    
    const spotifyTracks = await spotifyRateLimiter.execute(
      () => spotifyClient.getTracks(spotifyIds),
      'high' // High priority for latest releases
    )
    
    // Create a map for quick lookup
    const spotifyTrackMap = new Map(
      spotifyTracks.map(track => [track.id, track])
    )
    
    // Merge with static data
    const enrichedReleases = staticReleases.map(staticRelease => {
      const spotifyId = extractSpotifyId(staticRelease.streamingLinks.spotify)
      
      if (spotifyId && spotifyTrackMap.has(spotifyId)) {
        const spotifyTrack = spotifyTrackMap.get(spotifyId)!
        return mergeWithSpotifyData(staticRelease, spotifyTrack)
      }
      
      // No Spotify data available, use static
      return enrichStaticRelease(staticRelease)
    })
    
    console.log(`[Latest Releases] Enriched ${enrichedReleases.filter(r => r.source === 'spotify').length}/${staticReleases.length} releases with Spotify data`)
    
    return {
      releases: enrichedReleases,
      spotifyApiCalled: true,
    }
  } catch (error) {
    console.error('[Latest Releases] Spotify API error:', error)
    
    // Fallback to static data
    return {
      releases: staticReleases.map(enrichStaticRelease),
      spotifyApiCalled: false,
    }
  }
}

/**
 * Main handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const startTime = Date.now()
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
    return
  }
  
  try {
    // Parse query parameters
    const limit = Math.min(
      parseInt(req.query.limit as string) || 10,
      50 // Max 50 releases
    )
    
    const artistSlug = req.query.artistSlug as string | undefined
    const includeMetadata = req.query.includeMetadata !== 'false'
    
    // Validate parameters
    const validation = validateLatestReleasesParams({ limit: req.query.limit, artistSlug })
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: validation.error?.message,
        code: validation.error?.code,
      })
      return
    }
    
    // Generate cache key
    const cacheKey = cacheKeys.latestReleases(limit, artistSlug)
    
    // Check cache first
    const cached = spotifyCache.get<{
      releases: EnrichedRelease[]
      syncedAt: string
    }>(cacheKey)
    
    if (cached) {
      console.log('[Latest Releases] Cache HIT')
      
      const responseTime = Date.now() - startTime
      
      // Track performance
      performanceMonitor.recordOperation(
        'api.latestReleases',
        startTime,
        true,
        true
      )
      
      res.status(200).json({
        success: true,
        data: cached.releases,
        cached: true,
        fallback: false,
        syncedAt: cached.syncedAt,
        meta: {
          limit,
          total: cached.releases.length,
          spotifyApiCalled: false,
          cacheHit: true,
          responseTime,
        },
      })
      return
    }
    
    // Get static releases
    const staticReleases = artistSlug
      ? getReleasesByArtist(artistSlug).slice(0, limit)
      : getRecentReleases(limit)
    
    if (staticReleases.length === 0) {
      const errorResponse = createErrorResponse(
        LatestReleasesErrorCode.NO_RELEASES_FOUND,
        artistSlug 
          ? `No releases found for artist: ${artistSlug}`
          : 'No releases found'
      )
      
      res.status(404).json({
        success: false,
        error: errorResponse.message,
        code: errorResponse.code,
      })
      return
    }
    
    // Enrich with Spotify data
    const { releases: enrichedReleases, spotifyApiCalled } = includeMetadata
      ? await enrichReleasesWithSpotify(staticReleases)
      : { releases: staticReleases.map(enrichStaticRelease), spotifyApiCalled: false }
    
    const syncedAt = new Date().toISOString()
    const responseTime = Date.now() - startTime
    
    // Cache the result (30 minutes)
    spotifyCache.set(
      cacheKey,
      { releases: enrichedReleases, syncedAt },
      CACHE_TTL.LATEST_RELEASES
    )
    
    // Determine if we fell back to static data
    const fallback = !spotifyApiCalled || enrichedReleases.every((r: EnrichedRelease) => r.source === 'static')
    
    // Track performance
    performanceMonitor.recordOperation(
      'api.latestReleases',
      startTime,
      true,
      false
    )
    
    // Build response
    const response: LatestReleasesResponse = {
      success: true,
      data: enrichedReleases,
      cached: false,
      fallback,
      syncedAt,
      meta: {
        limit,
        total: enrichedReleases.length,
        spotifyApiCalled,
        cacheHit: false,
        responseTime,
      },
    }
    
    res.status(200).json(response)
    
    console.log(`[Latest Releases] ✅ Success - ${enrichedReleases.length} releases in ${responseTime}ms`)
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    logError('Latest Releases API', error, {
      limit: req.query.limit,
      artistSlug: req.query.artistSlug,
      responseTime,
    })
    
    performanceMonitor.recordOperation(
      'api.latestReleases',
      startTime,
      false,
      false,
      String(error)
    )
    
    // Fallback to static data on any error
    const limit = parseInt(req.query.limit as string) || 10
    const artistSlug = req.query.artistSlug as string | undefined
    
    const staticReleases = artistSlug
      ? getReleasesByArtist(artistSlug).slice(0, limit)
      : getRecentReleases(limit)
    
    const enrichedReleases = staticReleases.map(enrichStaticRelease)
    
    res.status(200).json({
      success: true,
      data: enrichedReleases,
      cached: false,
      fallback: true,
      syncedAt: new Date().toISOString(),
      meta: {
        limit,
        total: enrichedReleases.length,
        spotifyApiCalled: false,
        cacheHit: false,
        responseTime,
      },
    })
  }
}
