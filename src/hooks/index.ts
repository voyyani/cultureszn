/**
 * Hooks Index
 * 
 * Centralized exports for custom React hooks.
 */

export { useDocumentHead } from './useDocumentHead'
export { 
  useScrollParallax, 
  useHeroParallax, 
  useScrollTrigger,
} from './useScrollParallax'

// Spotify hooks
export { useSpotifyTrack } from './useSpotifyTrack'
export { useSpotifyArtist } from './useSpotifyArtist'
export { useSpotifyTopTracks } from './useSpotifyTopTracks'
export { useSpotifyTracks } from './useSpotifyTracks'

// Phase 3: Advanced Spotify Features
export { useSpotifyAuth } from './useSpotifyAuth'
export { useSpotifyPlayer } from './useSpotifyPlayer'
export { useSpotifyLibrary } from './useSpotifyLibrary'
export { useSpotifyRecommendations } from './useSpotifyRecommendations'

// Latest Releases Integration
export { useLatestReleases } from './useLatestReleases'
export type { UseLatestReleasesOptions, UseLatestReleasesResult } from './useLatestReleases'
