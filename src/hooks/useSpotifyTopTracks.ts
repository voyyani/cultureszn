/**
 * useSpotifyTopTracks Hook
 * 
 * Fetches an artist's top tracks from Spotify with caching and error handling.
 */

import { useState, useEffect, useCallback } from 'react'
import { spotifyClient } from '@/lib/spotify'
import type { SpotifyTrack } from '@/lib/spotify'

interface UseSpotifyTopTracksResult {
  tracks: SpotifyTrack[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseSpotifyTopTracksOptions {
  market?: string
  enabled?: boolean
  refetchOnMount?: boolean
  onSuccess?: (tracks: SpotifyTrack[]) => void
  onError?: (error: Error) => void
}

/**
 * Hook to fetch an artist's top tracks from Spotify
 * 
 * @param artistId - Spotify artist ID
 * @param options - Configuration options
 * @returns Array of top tracks (up to 10), loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { tracks, isLoading, error } = useSpotifyTopTracks('4JwhMRnhXNf44gaWN2VlDO', {
 *   market: 'US'
 * })
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * if (!tracks.length) return <EmptyState />
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
export function useSpotifyTopTracks(
  artistId: string | undefined,
  options: UseSpotifyTopTracksOptions = {}
): UseSpotifyTopTracksResult {
  const {
    market = 'US',
    enabled = true,
    refetchOnMount = false,
    onSuccess,
    onError,
  } = options

  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchTopTracks = useCallback(async () => {
    if (!artistId || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await spotifyClient.getArtistTopTracks(artistId, market)
      
      setTracks(data)
      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch top tracks')
      setError(error)
      onError?.(error)
      console.error('[useSpotifyTopTracks] Error:', error)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }, [artistId, market, enabled, onSuccess, onError])

  useEffect(() => {
    if (!enabled || (hasFetched && !refetchOnMount)) return

    fetchTopTracks()
  }, [fetchTopTracks, enabled, hasFetched, refetchOnMount])

  const refetch = useCallback(async () => {
    await fetchTopTracks()
  }, [fetchTopTracks])

  return { tracks, isLoading, error, refetch }
}
