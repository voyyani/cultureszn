/**
 * Spotify Library Exports
 * 
 * Central export point for all Spotify-related functionality.
 * Includes Phase 4 enhancements: Performance monitoring, resilience patterns, and analytics.
 */

export { spotifyClient } from './client'
export { spotifyCache, cacheKeys, CACHE_TTL } from './cache'
export { spotifySyncService, SpotifySyncService } from './sync'
export * from './utils'

// Phase 4: Performance & Monitoring
export { performanceMonitor, measureAsync } from './performance'

// Phase 4: Resilience Patterns
export { spotifyRateLimiter, withRateLimit } from './rate-limiter'
export { retryWithBackoff, spotifyCircuitBreaker } from './retry'

// Phase 4: Enhanced Client
export { enhancedSpotifyClient } from './enhanced-client'

// Latest Releases Integration
export * from './latest-releases'
export * from './latest-releases-errors'

export type { SpotifyTrack, SpotifyArtist, SpotifyAlbum } from './client'

