/**
 * useSpotifyLibrary Hook
 * 
 * Manages user's Spotify library (saved tracks).
 * Provides functions to save, remove, and check saved tracks.
 */

import { useState, useCallback, useEffect } from 'react'
import { useSpotifyAuth } from './useSpotifyAuth'

interface SavedTrack {
  addedAt: string
  track: {
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
}

interface UseSpotifyLibraryResult {
  savedTracks: SavedTrack[]
  isLoading: boolean
  error: Error | null
  isSaved: (trackId: string) => boolean
  saveTrack: (trackId: string) => Promise<void>
  removeTrack: (trackId: string) => Promise<void>
  checkSaved: (trackIds: string[]) => Promise<Record<string, boolean>>
  refreshLibrary: () => Promise<void>
}

/**
 * Hook for managing Spotify library
 * 
 * @returns Library tracks, save/remove functions, and loading state
 * 
 * @example
 * ```tsx
 * const { savedTracks, isSaved, saveTrack, removeTrack } = useSpotifyLibrary()
 * 
 * const handleToggleSave = async (trackId: string) => {
 *   if (isSaved(trackId)) {
 *     await removeTrack(trackId)
 *   } else {
 *     await saveTrack(trackId)
 *   }
 * }
 * 
 * return (
 *   <button onClick={() => handleToggleSave('track-id')}>
 *     {isSaved('track-id') ? 'Saved' : 'Save'}
 *   </button>
 * )
 * ```
 */
export function useSpotifyLibrary(): UseSpotifyLibraryResult {
  const { isAuthenticated, refreshToken } = useSpotifyAuth()
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([])
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetch user's saved tracks
   */
  const refreshLibrary = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/spotify/me/library?limit=50')
      
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry request
          const retryResponse = await fetch('/api/spotify/me/library?limit=50')
          const data = await retryResponse.json()
          
          if (data.success) {
            setSavedTracks(data.tracks)
            setSavedTrackIds(new Set(data.tracks.map((t: SavedTrack) => t.track.id)))
          }
        }
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch library')
      }

      const data = await response.json()
      
      if (data.success) {
        setSavedTracks(data.tracks)
        setSavedTrackIds(new Set(data.tracks.map((t: SavedTrack) => t.track.id)))
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('Library fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, refreshToken])

  /**
   * Load library on mount
   */
  useEffect(() => {
    if (isAuthenticated) {
      refreshLibrary()
    }
  }, [isAuthenticated, refreshLibrary])

  /**
   * Check if track is saved
   */
  const isSaved = useCallback((trackId: string): boolean => {
    return savedTrackIds.has(trackId)
  }, [savedTrackIds])

  /**
   * Save track to library
   */
  const saveTrack = useCallback(async (trackId: string) => {
    try {
      const response = await fetch(`/api/spotify/me/library?trackId=${trackId}`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to save track')
      }

      // Update local state
      setSavedTrackIds(prev => new Set(prev).add(trackId))

      // Track event
      if (window.gtag) {
        window.gtag('event', 'spotify_save_track', {
          event_category: 'Spotify',
          event_label: 'Track Saved',
          track_id: trackId,
        })
      }

      // Optionally refresh full library
      // await refreshLibrary()
    } catch (err) {
      console.error('Save track error:', err)
      throw err
    }
  }, [])

  /**
   * Remove track from library
   */
  const removeTrack = useCallback(async (trackId: string) => {
    try {
      const response = await fetch(`/api/spotify/me/library?trackId=${trackId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove track')
      }

      // Update local state
      setSavedTrackIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(trackId)
        return newSet
      })

      // Track event
      if (window.gtag) {
        window.gtag('event', 'spotify_remove_track', {
          event_category: 'Spotify',
          event_label: 'Track Removed',
          track_id: trackId,
        })
      }

      // Optionally refresh full library
      // await refreshLibrary()
    } catch (err) {
      console.error('Remove track error:', err)
      throw err
    }
  }, [])

  /**
   * Check multiple tracks at once
   */
  const checkSaved = useCallback(async (trackIds: string[]): Promise<Record<string, boolean>> => {
    try {
      const response = await fetch('/api/spotify/me/library?action=check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to check saved tracks')
      }

      const data = await response.json()
      return data.saved || {}
    } catch (err) {
      console.error('Check saved error:', err)
      return {}
    }
  }, [])

  return {
    savedTracks,
    isLoading,
    error,
    isSaved,
    saveTrack,
    removeTrack,
    checkSaved,
    refreshLibrary,
  }
}
