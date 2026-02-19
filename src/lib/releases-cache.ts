/**
 * Releases Caching Utilities
 * 
 * Provides multi-layer caching for latest releases:
 * 1. Memory cache (Map) - 5 minutes
 * 2. LocalStorage - 30 minutes
 * 3. API fetch (last resort)
 * 
 * Features:
 * - Automatic expiration
 * - Safe localStorage access (handles quota errors)
 * - Type-safe cache operations
 * - Cache invalidation utilities
 */

import type { EnrichedRelease, CachedReleases } from '@/types'

// Cache TTL (Time To Live)
export const CACHE_CONFIG = {
  memory: 5 * 60 * 1000,        // 5 minutes (Map)
  localStorage: 30 * 60 * 1000,  // 30 minutes
} as const

// In-memory cache
const memoryCache = new Map<string, CachedReleases>()

/**
 * Generate cache key
 */
function getCacheKey(limit: number, artistSlug?: string): string {
  return artistSlug 
    ? `latest-releases:${artistSlug}:${limit}`
    : `latest-releases:all:${limit}`
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: Date, ttl: number): boolean {
  const now = Date.now()
  const cacheTime = timestamp.getTime()
  return (now - cacheTime) < ttl
}

/**
 * Get cached releases from memory cache
 */
function getMemoryCached(key: string): CachedReleases | null {
  const cached = memoryCache.get(key)
  
  if (!cached) return null
  
  if (!isCacheValid(cached.timestamp, CACHE_CONFIG.memory)) {
    memoryCache.delete(key)
    return null
  }
  
  return cached
}

/**
 * Get cached releases from localStorage
 */
function getLocalStorageCached(key: string): CachedReleases | null {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    const parsed = JSON.parse(stored) as CachedReleases
    
    // Convert timestamp string to Date
    parsed.timestamp = new Date(parsed.timestamp)
    
    if (!isCacheValid(parsed.timestamp, CACHE_CONFIG.localStorage)) {
      localStorage.removeItem(key)
      return null
    }
    
    return parsed
  } catch (error) {
    console.error('[releases-cache] LocalStorage read error:', error)
    // Clear corrupted cache
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore cleanup errors
    }
    return null
  }
}

/**
 * Set memory cache
 */
function setMemoryCache(key: string, data: CachedReleases): void {
  memoryCache.set(key, data)
}

/**
 * Set localStorage cache
 */
function setLocalStorageCache(key: string, data: CachedReleases): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('[releases-cache] LocalStorage write error:', error)
    // Don't throw - cache failure is non-critical
  }
}

/**
 * Get cached releases (checks all cache layers)
 * 
 * @param limit - Number of releases
 * @param artistSlug - Optional artist filter
 * @returns Cached data or null
 */
export function getCachedReleases(
  limit: number, 
  artistSlug?: string
): CachedReleases | null {
  const key = getCacheKey(limit, artistSlug)
  
  // Check memory cache first (fastest)
  const memCached = getMemoryCached(key)
  if (memCached) {
    console.log('[releases-cache] Memory cache hit:', key)
    return memCached
  }
  
  // Check localStorage (slower but persists)
  const lsCached = getLocalStorageCached(key)
  if (lsCached) {
    console.log('[releases-cache] LocalStorage cache hit:', key)
    // Promote to memory cache
    setMemoryCache(key, lsCached)
    return lsCached
  }
  
  console.log('[releases-cache] Cache miss:', key)
  return null
}

/**
 * Cache releases data (writes to all cache layers)
 * 
 * @param data - Enriched releases to cache
 * @param limit - Number of releases
 * @param artistSlug - Optional artist filter
 * @param source - Data source
 */
export function cacheReleases(
  data: EnrichedRelease[],
  limit: number,
  artistSlug?: string,
  source: 'spotify' | 'cache' | 'fallback' = 'spotify'
): void {
  const key = getCacheKey(limit, artistSlug)
  const cached: CachedReleases = {
    data,
    timestamp: new Date(),
    source,
  }
  
  // Write to both caches
  setMemoryCache(key, cached)
  setLocalStorageCache(key, cached)
  
  console.log('[releases-cache] Cached:', key, `(${data.length} releases)`)
}

/**
 * Clear all caches for a specific query
 * 
 * @param limit - Number of releases
 * @param artistSlug - Optional artist filter
 */
export function clearCache(limit?: number, artistSlug?: string): void {
  if (limit !== undefined) {
    const key = getCacheKey(limit, artistSlug)
    memoryCache.delete(key)
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore errors
    }
    console.log('[releases-cache] Cleared cache:', key)
  } else {
    // Clear all caches
    memoryCache.clear()
    try {
      // Clear all localStorage keys starting with 'latest-releases:'
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('latest-releases:')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch {
      // Ignore errors
    }
    console.log('[releases-cache] Cleared all caches')
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats() {
  return {
    memorySize: memoryCache.size,
    localStorageKeys: (() => {
      try {
        const keys: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith('latest-releases:')) {
            keys.push(key)
          }
        }
        return keys
      } catch {
        return []
      }
    })(),
  }
}
