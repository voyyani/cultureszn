/**
 * useLatestReleases Hook
 * 
 * Fetches latest releases with live Spotify data and fallback support.
 * Provides manual refresh capability and loading states.
 * 
 * Features:
 * - Automatic caching (memory + localStorage)
 * - Fallback to static data on API failure
 * - Manual refresh with sync button
 * - Real-time loading states
 * - Error recovery
 * - Auto-refresh support (optional)
 * 
 * @example
 * ```tsx
 * const { 
 *   releases, 
 *   isLoading, 
 *   error, 
 *   isFallback, 
 *   lastSynced, 
 *   refetch,
 *   source 
 * } = useLatestReleases({ limit: 10 })
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { EnrichedRelease, LatestReleasesResponse, Release } from '@/types'
import { getCachedReleases, cacheReleases, clearCache } from '@/lib/releases-cache'
import { getRecentReleases, getReleasesByArtist } from '@/data'

export interface UseLatestReleasesOptions {
  limit?: number
  artistSlug?: string
  enabled?: boolean
  refetchInterval?: number // Auto-refresh interval (ms)
}

export interface UseLatestReleasesResult {
  releases: EnrichedRelease[]
  isLoading: boolean
  isRefreshing: boolean // For sync button state
  error: Error | null
  isFallback: boolean // True if using static data
  lastSynced: Date | null
  refetch: () => Promise<void> // Manual sync
  source: 'spotify' | 'cache' | 'fallback'
}

/**
 * Convert static Release to EnrichedRelease
 */
function enrichStaticRelease(release: Release): EnrichedRelease {
  return {
    ...release,
    featured: release.featured ?? false,
    isPlayable: false,
    source: 'static' as const,
  }
}

/**
 * Convert static releases to enriched releases
 */
function enrichStaticReleases(releases: Release[]): EnrichedRelease[] {
  return releases.map(enrichStaticRelease)
}

/**
 * Hook for fetching latest releases with live Spotify data
 * 
 * @param options - Configuration options
 * @returns Latest releases state and control functions
 */
export function useLatestReleases(
  options: UseLatestReleasesOptions = {}
): UseLatestReleasesResult {
  const {
    limit = 10,
    artistSlug,
    enabled = true,
    refetchInterval,
  } = options

  // State
  const [releases, setReleases] = useState<EnrichedRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [source, setSource] = useState<'spotify' | 'cache' | 'fallback'>('cache')

  // Refs
  const fetchControllerRef = useRef<AbortController | null>(null)

  /**
   * Fetch releases from API with fallback logic
   */
  const fetchReleases = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (isRefreshing && !forceRefresh) {
      console.log('[useLatestReleases] Fetch already in progress')
      return
    }

    try {
      setIsRefreshing(forceRefresh)
      if (!forceRefresh) {
        setIsLoading(true)
      }
      setError(null)

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = getCachedReleases(limit, artistSlug)
        if (cached) {
          console.log('[useLatestReleases] Using cached data')
          setReleases(cached.data)
          setLastSynced(cached.timestamp)
          setSource('cache')
          setIsFallback(cached.source === 'fallback')
          setIsLoading(false)
          setIsRefreshing(false)
          return
        }
      } else {
        // Clear cache on force refresh
        clearCache(limit, artistSlug)
      }

      // Cancel previous fetch if exists
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort()
      }

      // Create new abort controller
      fetchControllerRef.current = new AbortController()

      // Build API URL
      const params = new URLSearchParams({
        limit: limit.toString(),
        includeMetadata: 'true',
      })
      if (artistSlug) {
        params.append('artistSlug', artistSlug)
      }

      // Fetch from API
      console.log('[useLatestReleases] Fetching from API:', `/api/spotify/latest-releases?${params}`)
      const response = await fetch(`/api/spotify/latest-releases?${params}`, {
        signal: fetchControllerRef.current.signal,
      })

      // Check if response is OK
      if (!response.ok) {
        // In development, API endpoints don't exist - this is expected
        const isDev = import.meta.env.DEV
        if (isDev && response.status === 404) {
          console.log('[useLatestReleases] API not available in dev mode - using static data')
        } else {
          console.error('[useLatestReleases] API error:', response.status, response.statusText)
        }
        throw new Error(`API unavailable (${response.status})`)
      }

      // Verify Content-Type is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.log('[useLatestReleases] API returned non-JSON response - using static data')
        throw new Error('API returned non-JSON response')
      }

      // Parse JSON with error handling
      let data: LatestReleasesResponse
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('[useLatestReleases] JSON parse error:', jsonError)
        throw new Error('Failed to parse API response')
      }

      if (data.success) {
        console.log('[useLatestReleases] API success:', {
          count: data.data.length,
          cached: data.cached,
          fallback: data.fallback,
          source: data.fallback ? 'fallback' : 'spotify',
        })

        setReleases(data.data)
        setIsFallback(data.fallback)
        setLastSynced(new Date(data.syncedAt))
        setSource(data.fallback ? 'fallback' : 'spotify')

        // Cache the result
        cacheReleases(
          data.data,
          limit,
          artistSlug,
          data.fallback ? 'fallback' : 'spotify'
        )
      } else {
        throw new Error('API returned success: false')
      }
    } catch (err) {
      const isDev = import.meta.env.DEV
      
      // Handle abort errors - fall back to static data if aborted
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[useLatestReleases] Fetch aborted - falling back to static data')
        // Fall through to fallback logic below
      } else if (err instanceof Error) {
        // In dev mode, API unavailable is expected - don't treat as error
        const isExpectedDevError = isDev && err.message.includes('API unavailable')
        
        if (!isExpectedDevError) {
          console.error('[useLatestReleases] Fetch error:', err)
          setError(err as Error)
        }
      }

      // Fallback to static data
      if (isDev) {
        console.log('[useLatestReleases] Using static data (dev mode)')
      } else {
        console.log('[useLatestReleases] Falling back to static data')
      }
      
      const staticReleases = artistSlug
        ? getReleasesByArtist(artistSlug).slice(0, limit)
        : getRecentReleases(limit)
      
      const enrichedStatic = enrichStaticReleases(staticReleases)
      
      setReleases(enrichedStatic)
      setIsFallback(true)
      setSource('fallback')

      // Cache fallback data (short TTL)
      cacheReleases(enrichedStatic, limit, artistSlug, 'fallback')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      fetchControllerRef.current = null
    }
  }, [limit, artistSlug, isRefreshing])

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    console.log('[useLatestReleases] Manual refetch triggered')
    await fetchReleases(true)
  }, [fetchReleases])

  /**
   * Initial fetch on mount and when dependencies change
   */
  useEffect(() => {
    if (!enabled) return

    fetchReleases(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, limit, artistSlug]) // Only re-run when these change, not fetchReleases

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (fetchControllerRef.current) {
        console.log('[useLatestReleases] Component unmounting - aborting fetch')
        fetchControllerRef.current.abort()
      }
    }
  }, [])

  /**
   * Auto-refresh interval (optional)
   */
  useEffect(() => {
    if (!refetchInterval || !enabled) return

    console.log('[useLatestReleases] Setting up auto-refresh:', refetchInterval, 'ms')
    const intervalId = setInterval(() => {
      console.log('[useLatestReleases] Auto-refresh triggered')
      fetchReleases(false)
    }, refetchInterval)

    return () => {
      clearInterval(intervalId)
    }
  }, [refetchInterval, enabled, fetchReleases])

  return {
    releases,
    isLoading,
    isRefreshing,
    error,
    isFallback,
    lastSynced,
    refetch,
    source,
  }
}
