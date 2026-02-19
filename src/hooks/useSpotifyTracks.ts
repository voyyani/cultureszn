/**
 * useSpotifyTracks Hook
 * 
 * Fetches multiple Spotify tracks in a single batch request.
 * More efficient than calling useSpotifyTrack multiple times.
 */

import { useState, useEffect, useCallback } from 'react'
import { spotifyClient } from '@/lib/spotify'
import type { SpotifyTrack } from '@/lib/spotify'

interface UseSpotifyTracksResult {
  tracks: SpotifyTrack[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseSpotifyTracksOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  onSuccess?: (tracks: SpotifyTrack[]) => void
  onError?: (error: Error) => void
}

/**
 * Hook to fetch multiple Spotify tracks in a batch
 * 
 * @param trackIds - Array of Spotify track IDs (up to 50)
 * @param options - Configuration options
 * @returns Array of tracks, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const trackIds = ['3n3Ppam7vgaVa1iaRUc9Lp', '1301WleyT98MSxVHPZCA6M']
 * const { tracks, isLoading, error } = useSpotifyTracks(trackIds)
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * 
 * return (
 *   <div>
 *     {tracks.map(track => (
 *       <TrackCard key={track.id} track={track} />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useSpotifyTracks(
  trackIds: string[] | undefined,
  options: UseSpotifyTracksOptions = {}
): UseSpotifyTracksResult {
  const {
    enabled = true,
    refetchOnMount = false,
    onSuccess,
    onError,
  } = options

  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchTracks = useCallback(async () => {
    if (!trackIds || trackIds.length === 0 || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await spotifyClient.getTracks(trackIds)
      
      setTracks(data)
      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tracks')
      setError(error)
      onError?.(error)
      console.error('[useSpotifyTracks] Error:', error)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }, [trackIds, enabled, onSuccess, onError])

  useEffect(() => {
    if (!enabled || (hasFetched && !refetchOnMount)) return

    fetchTracks()
  }, [fetchTracks, enabled, hasFetched, refetchOnMount])

  const refetch = useCallback(async () => {
    await fetchTracks()
  }, [fetchTracks])

  return { tracks, isLoading, error, refetch }
}
