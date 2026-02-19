/**
 * useSpotifyTrack Hook
 * 
 * Fetches Spotify track data with caching, loading states, and error handling.
 * Implements a SWR-like pattern for optimal performance.
 */

import { useState, useEffect, useCallback } from 'react'
import { spotifyClient } from '@/lib/spotify'
import type { SpotifyTrack } from '@/lib/spotify'

interface UseSpotifyTrackResult {
  track: SpotifyTrack | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseSpotifyTrackOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  onSuccess?: (track: SpotifyTrack) => void
  onError?: (error: Error) => void
}

/**
 * Hook to fetch and cache Spotify track data
 * 
 * @param trackId - Spotify track ID (22-character string)
 * @param options - Configuration options
 * @returns Track data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { track, isLoading, error } = useSpotifyTrack('3n3Ppam7vgaVa1iaRUc9Lp')
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * if (!track) return null
 * 
 * return <TrackCard track={track} />
 * ```
 */
export function useSpotifyTrack(
  trackId: string | undefined,
  options: UseSpotifyTrackOptions = {}
): UseSpotifyTrackResult {
  const {
    enabled = true,
    refetchOnMount = false,
    onSuccess,
    onError,
  } = options

  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchTrack = useCallback(async () => {
    if (!trackId || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await spotifyClient.getTrack(trackId)
      
      if (data) {
        setTrack(data)
        onSuccess?.(data)
      } else {
        const notFoundError = new Error(`Track not found: ${trackId}`)
        setError(notFoundError)
        onError?.(notFoundError)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch track')
      setError(error)
      onError?.(error)
      console.error('[useSpotifyTrack] Error:', error)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }, [trackId, enabled, onSuccess, onError])

  useEffect(() => {
    // Skip if disabled or already fetched (unless refetchOnMount is true)
    if (!enabled || (hasFetched && !refetchOnMount)) return

    fetchTrack()
  }, [fetchTrack, enabled, hasFetched, refetchOnMount])

  const refetch = useCallback(async () => {
    await fetchTrack()
  }, [fetchTrack])

  return { track, isLoading, error, refetch }
}
