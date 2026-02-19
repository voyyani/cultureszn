/**
 * Latest Releases Utilities
 * 
 * Helper functions for transforming and enriching release data
 * with Spotify metadata.
 */

import type { Release } from '@/types'
import type { SpotifyTrack } from './client'
import { extractSpotifyId, isValidSpotifyId } from './utils'

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
 * Transform static release to enriched format (fallback)
 * 
 * @param staticRelease - Release from static data
 * @returns Enriched release with static data only
 */
export function enrichStaticRelease(staticRelease: Release): EnrichedRelease {
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
 * 
 * @param staticRelease - Release from static data
 * @param spotifyTrack - Track data from Spotify API
 * @returns Enriched release with merged data
 */
export function mergeWithSpotifyData(
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
 * 
 * @param releases - Array of static releases
 * @returns Array of valid Spotify IDs
 */
export function extractSpotifyIds(releases: Release[]): string[] {
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
 * Batch enrich releases with Spotify data
 * 
 * @param staticReleases - Array of static releases
 * @param spotifyTracks - Array of Spotify track data
 * @returns Array of enriched releases
 */
export function batchEnrichReleases(
  staticReleases: Release[],
  spotifyTracks: SpotifyTrack[]
): EnrichedRelease[] {
  // Create a map for quick lookup
  const spotifyTrackMap = new Map(
    spotifyTracks.map(track => [track.id, track])
  )
  
  return staticReleases.map(staticRelease => {
    const spotifyId = extractSpotifyId(staticRelease.streamingLinks.spotify)
    
    if (spotifyId && spotifyTrackMap.has(spotifyId)) {
      const spotifyTrack = spotifyTrackMap.get(spotifyId)!
      return mergeWithSpotifyData(staticRelease, spotifyTrack)
    }
    
    // No Spotify data available, use static
    return enrichStaticRelease(staticRelease)
  })
}

/**
 * Check if release has valid Spotify data
 * 
 * @param release - Enriched release
 * @returns True if release has Spotify data
 */
export function hasSpotifyData(release: EnrichedRelease): boolean {
  return release.source === 'spotify' && !!release.spotifyUri
}

/**
 * Sort releases by release date (newest first)
 * 
 * @param releases - Array of enriched releases
 * @returns Sorted array
 */
export function sortByReleaseDate(releases: EnrichedRelease[]): EnrichedRelease[] {
  return [...releases].sort((a, b) => {
    const dateA = new Date(a.releaseDate).getTime()
    const dateB = new Date(b.releaseDate).getTime()
    return dateB - dateA
  })
}

/**
 * Filter releases by artist
 * 
 * @param releases - Array of enriched releases
 * @param artistSlug - Artist slug to filter by
 * @returns Filtered array
 */
export function filterByArtist(
  releases: EnrichedRelease[],
  artistSlug: string
): EnrichedRelease[] {
  return releases.filter(r => r.artistSlug === artistSlug)
}

/**
 * Get release statistics
 * 
 * @param releases - Array of enriched releases
 * @returns Statistics object
 */
export function getReleaseStats(releases: EnrichedRelease[]) {
  const total = releases.length
  const withSpotify = releases.filter(r => r.source === 'spotify').length
  const playable = releases.filter(r => r.isPlayable).length
  const explicit = releases.filter(r => r.explicit).length
  
  return {
    total,
    withSpotify,
    playable,
    explicit,
    spotifyDataPercentage: total > 0 ? (withSpotify / total) * 100 : 0,
    playablePercentage: total > 0 ? (playable / total) * 100 : 0,
  }
}
