/**
 * useSpotifyRecommendations Hook
 * 
 * Fetches personalized track recommendations from Spotify.
 * Based on seed artists, tracks, and genres.
 */

import { useState, useCallback } from 'react'
import { useSpotifyAuth } from './useSpotifyAuth'

interface RecommendedTrack {
  id: string
  title: string
  artists: Array<{ id: string; name: string }>
  album: {
    id: string
    name: string
    coverArt?: string
    releaseDate: string
  }
  durationMs: number
  explicit: boolean
  popularity: number
  previewUrl?: string
  externalUrl: string
}

interface UseSpotifyRecommendationsOptions {
  seedArtists?: string[]
  seedTracks?: string[]
  seedGenres?: string[]
  limit?: number
  market?: string
}

interface UseSpotifyRecommendationsResult {
  recommendations: RecommendedTrack[]
  isLoading: boolean
  error: Error | null
  fetchRecommendations: (options?: UseSpotifyRecommendationsOptions) => Promise<void>
}

/**
 * Hook for fetching personalized recommendations
 * 
 * @returns Recommendations and fetch function
 * 
 * @example
 * ```tsx
 * const { recommendations, isLoading, fetchRecommendations } = useSpotifyRecommendations()
 * 
 * useEffect(() => {
 *   fetchRecommendations({
 *     seedArtists: ['artistId1', 'artistId2'],
 *     limit: 20
 *   })
 * }, [])
 * 
 * return (
 *   <div>
 *     {recommendations.map(track => (
 *       <TrackCard key={track.id} track={track} />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useSpotifyRecommendations(): UseSpotifyRecommendationsResult {
  const { isAuthenticated, refreshToken } = useSpotifyAuth()
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetch recommendations
   */
  const fetchRecommendations = useCallback(async (options: UseSpotifyRecommendationsOptions = {}) => {
    if (!isAuthenticated) {
      setError(new Error('Not authenticated'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      if (options.seedArtists && options.seedArtists.length > 0) {
        params.append('seed_artists', options.seedArtists.slice(0, 5).join(','))
      }
      
      if (options.seedTracks && options.seedTracks.length > 0) {
        params.append('seed_tracks', options.seedTracks.slice(0, 5).join(','))
      }
      
      if (options.seedGenres && options.seedGenres.length > 0) {
        params.append('seed_genres', options.seedGenres.slice(0, 5).join(','))
      }
      
      if (options.limit) {
        params.append('limit', options.limit.toString())
      }
      
      if (options.market) {
        params.append('market', options.market)
      }

      const response = await fetch(`/api/spotify/me/recommendations?${params.toString()}`)
      
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry request
          const retryResponse = await fetch(`/api/spotify/me/recommendations?${params.toString()}`)
          const data = await retryResponse.json()
          
          if (data.success) {
            setRecommendations(data.recommendations)
          }
        }
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.recommendations)

        // Track event
        if (window.gtag) {
          window.gtag('event', 'spotify_recommendations_fetched', {
            event_category: 'Spotify',
            event_label: 'Recommendations Loaded',
            count: data.recommendations.length,
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('Recommendations fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshToken])

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
  }
}
