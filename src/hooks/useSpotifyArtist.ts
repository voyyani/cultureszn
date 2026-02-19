/**
 * useSpotifyArtist Hook
 * 
 * Fetches Spotify artist data with caching, loading states, and error handling.
 */

import { useState, useEffect, useCallback } from 'react'
import { spotifyClient } from '@/lib/spotify'
import type { SpotifyArtist } from '@/lib/spotify'

interface UseSpotifyArtistResult {
  artist: SpotifyArtist | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseSpotifyArtistOptions {
  enabled?: boolean
  refetchOnMount?: boolean
  onSuccess?: (artist: SpotifyArtist) => void
  onError?: (error: Error) => void
}

/**
 * Hook to fetch and cache Spotify artist data
 * 
 * @param artistId - Spotify artist ID (22-character string)
 * @param options - Configuration options
 * @returns Artist data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { artist, isLoading, error } = useSpotifyArtist('4JwhMRnhXNf44gaWN2VlDO')
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * if (!artist) return null
 * 
 * return (
 *   <div>
 *     <h1>{artist.name}</h1>
 *     <p>{artist.followers.toLocaleString()} followers</p>
 *     <p>Popularity: {artist.popularity}/100</p>
 *   </div>
 * )
 * ```
 */
export function useSpotifyArtist(
  artistId: string | undefined,
  options: UseSpotifyArtistOptions = {}
): UseSpotifyArtistResult {
  const {
    enabled = true,
    refetchOnMount = false,
    onSuccess,
    onError,
  } = options

  const [artist, setArtist] = useState<SpotifyArtist | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchArtist = useCallback(async () => {
    if (!artistId || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await spotifyClient.getArtist(artistId)
      
      if (data) {
        setArtist(data)
        onSuccess?.(data)
      } else {
        const notFoundError = new Error(`Artist not found: ${artistId}`)
        setError(notFoundError)
        onError?.(notFoundError)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch artist')
      setError(error)
      onError?.(error)
      console.error('[useSpotifyArtist] Error:', error)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }, [artistId, enabled, onSuccess, onError])

  useEffect(() => {
    if (!enabled || (hasFetched && !refetchOnMount)) return

    fetchArtist()
  }, [fetchArtist, enabled, hasFetched, refetchOnMount])

  const refetch = useCallback(async () => {
    await fetchArtist()
  }, [fetchArtist])

  return { artist, isLoading, error, refetch }
}
