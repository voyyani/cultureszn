/**
 * Spotify Cache Service
 * 
 * In-memory caching layer for Spotify API responses.
 * Browser-compatible Map-based cache with TTL support.
 */

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  TRACK: 6 * 60 * 60,        // 6 hours
  ALBUM: 6 * 60 * 60,        // 6 hours  
  ARTIST: 24 * 60 * 60,      // 24 hours
  TOP_TRACKS: 1 * 60 * 60,   // 1 hour
  SEARCH: 30 * 60,           // 30 minutes
  LATEST_RELEASES: 30 * 60,  // 30 minutes
}

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class SpotifyCache {
  private cache: Map<string, CacheEntry<any>>
  private defaultTTL: number
  private hits: number = 0
  private misses: number = 0
  private sets: number = 0

  constructor() {
    this.cache = new Map()
    this.defaultTTL = CACHE_TTL.TRACK

    // Clean up expired entries every 2 minutes
    setInterval(() => this.cleanExpired(), 2 * 60 * 1000)
  }

  /**
   * Get cached value
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.misses++
      console.log(`[Cache MISS] ${key}`)
      return undefined
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.misses++
      console.log(`[Cache EXPIRED] ${key}`)
      return undefined
    }

    this.hits++
    console.log(`[Cache HIT] ${key}`)
    return entry.value as T
  }

  /**
   * Set cached value with custom TTL
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    const ttlSeconds = ttl !== undefined ? ttl : this.defaultTTL
    const expiresAt = Date.now() + (ttlSeconds * 1000)

    this.cache.set(key, {
      value,
      expiresAt
    })

    this.sets++
    console.log(`[Cache SET] ${key} (TTL: ${ttlSeconds}s)`)
    return true
  }

  /**
   * Delete cached value
   */
  delete(key: string): number {
    const deleted = this.cache.delete(key)
    return deleted ? 1 : 0
  }

  /**
   * Flush all cache
   */
  flush(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    this.sets = 0
    console.log('[Cache] Flushed all entries')
  }

  /**
   * Clean up expired entries
   */
  private cleanExpired(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries`)
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate = this.hits + this.misses > 0 
      ? (this.hits / (this.hits + this.misses)) * 100 
      : 0

    return {
      keys: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      ksize: this.cache.size,
      vsize: this.cache.size,
      hitRate: hitRate.toFixed(2) + '%'
    }
  }
}

// Cache key generators
export const cacheKeys = {
  track: (id: string) => `spotify:track:${id}`,
  tracks: (ids: string[]) => `spotify:tracks:${ids.join(',')}`,
  album: (id: string) => `spotify:album:${id}`,
  artist: (id: string) => `spotify:artist:${id}`,
  topTracks: (artistId: string, market = 'US') => `spotify:top-tracks:${artistId}:${market}`,
  artistAlbums: (artistId: string) => `spotify:artist-albums:${artistId}`,
  search: (query: string, type: string) => `spotify:search:${type}:${query}`,
  latestReleases: (limit: number, artistSlug?: string) => 
    `spotify:latest-releases:${limit}:${artistSlug || 'all'}`,
}

// Export singleton instance
export const spotifyCache = new SpotifyCache()
export { CACHE_TTL }
