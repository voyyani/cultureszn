/**
 * useSpotifyPlayer Hook
 * 
 * Manages Spotify Web Playback SDK integration for full playback control.
 * Handles player initialization, state management, and playback controls.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSpotifyAuth } from './useSpotifyAuth'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

export interface PlayerTrack {
  id: string
  uri: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
}

export interface PlayerState {
  paused: boolean
  position: number
  duration: number
  track_window: {
    current_track: PlayerTrack | null
    previous_tracks: PlayerTrack[]
    next_tracks: PlayerTrack[]
  }
  shuffle: boolean
  repeat_mode: number
}

interface UseSpotifyPlayerResult {
  player: any | null
  deviceId: string | null
  isReady: boolean
  isActive: boolean
  currentTrack: PlayerTrack | null
  isPaused: boolean
  position: number
  duration: number
  play: (options?: { uris?: string[]; contextUri?: string }) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  seek: (positionMs: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  togglePlay: () => Promise<void>
}

/**
 * Load Spotify Web Playback SDK script
 */
function loadSpotifySDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve()
      return
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)
  })
}

/**
 * Hook for Spotify Web Playback SDK
 * 
 * Only works for Spotify Premium users. Provides full playback control.
 * 
 * @returns Player instance, state, and control functions
 * 
 * @example
 * ```tsx
 * const { 
 *   isReady, 
 *   currentTrack, 
 *   isPaused, 
 *   play, 
 *   pause, 
 *   nextTrack 
 * } = useSpotifyPlayer()
 * 
 * if (!isReady) return <Loading />
 * 
 * return (
 *   <div>
 *     <p>Now Playing: {currentTrack?.name}</p>
 *     <button onClick={() => play({ uris: ['spotify:track:xyz'] })}>
 *       Play Track
 *     </button>
 *     <button onClick={isPaused ? play : pause}>
 *       {isPaused ? 'Play' : 'Pause'}
 *     </button>
 *   </div>
 * )
 * ```
 */
export function useSpotifyPlayer(): UseSpotifyPlayerResult {
  const { isAuthenticated, refreshToken } = useSpotifyAuth()
  const [player, setPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const playerRef = useRef<any>(null)

  /**
   * Get access token for SDK
   */
  const getAccessToken = useCallback(async (callback: (token: string) => void) => {
    // Try to get token from cookie (already decrypted by browser)
    // In production, you'd call an endpoint that returns the decrypted token
    try {
      const response = await fetch('/api/spotify/auth/token')
      const data = await response.json()
      
      if (data.access_token) {
        callback(data.access_token)
      } else {
        // Token expired, try refresh
        const refreshed = await refreshToken()
        if (refreshed) {
          const retryResponse = await fetch('/api/spotify/auth/token')
          const retryData = await retryResponse.json()
          callback(retryData.access_token)
        }
      }
    } catch (error) {
      console.error('Failed to get access token:', error)
    }
  }, [refreshToken])

  /**
   * Initialize Spotify Player
   */
  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true

    const initPlayer = async () => {
      await loadSpotifySDK()

      if (!isMounted) return

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Culture SZN Web Player',
        getOAuthToken: getAccessToken,
        volume: 0.7,
      })

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('🎵 Spotify Player Ready:', device_id)
        setDeviceId(device_id)
        setIsReady(true)

        // Track initialization
        if (window.gtag) {
          window.gtag('event', 'spotify_player_ready', {
            event_category: 'Spotify',
            event_label: 'Player Initialized',
            device_id,
          })
        }
      })

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.warn('🎵 Device offline:', device_id)
        setIsReady(false)
      })

      // Player State Changed
      spotifyPlayer.addListener('player_state_changed', (state: PlayerState | null) => {
        if (!state) {
          setIsActive(false)
          return
        }

        setIsActive(true)
        setCurrentTrack(state.track_window.current_track)
        setIsPaused(state.paused)
        setPosition(state.position)
        setDuration(state.duration)

        // Track playback events
        if (window.gtag) {
          window.gtag('event', state.paused ? 'spotify_pause' : 'spotify_play', {
            event_category: 'Spotify',
            track_id: state.track_window.current_track?.id,
            track_name: state.track_window.current_track?.name,
          })
        }
      })

      // Errors
      spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Spotify initialization error:', message)
      })

      spotifyPlayer.addListener('authentication_error', async ({ message }: { message: string }) => {
        console.error('Spotify authentication error:', message)
        await refreshToken()
      })

      spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Spotify account error:', message)
        // Likely not a Premium user
      })

      spotifyPlayer.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Spotify playback error:', message)
      })

      // Connect player
      const connected = await spotifyPlayer.connect()
      
      if (connected && isMounted) {
        console.log('✅ Player connected successfully')
        setPlayer(spotifyPlayer)
        playerRef.current = spotifyPlayer
      }
    }

    initPlayer()

    return () => {
      isMounted = false
      if (playerRef.current) {
        playerRef.current.disconnect()
      }
    }
  }, [isAuthenticated, getAccessToken, refreshToken])

  /**
   * Play tracks
   */
  const play = useCallback(async (options?: { uris?: string[]; contextUri?: string }) => {
    if (!deviceId) return

    try {
      const response = await fetch(`/api/spotify/player/control?action=play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          uris: options?.uris,
          contextUri: options?.contextUri,
        }),
      })

      if (!response.ok) {
        throw new Error('Play failed')
      }
    } catch (error) {
      console.error('Play error:', error)
    }
  }, [deviceId])

  /**
   * Pause playback
   */
  const pause = useCallback(async () => {
    if (player) {
      await player.pause()
    }
  }, [player])

  /**
   * Resume playback
   */
  const resume = useCallback(async () => {
    if (player) {
      await player.resume()
    }
  }, [player])

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(async () => {
    if (player) {
      await player.togglePlay()
    }
  }, [player])

  /**
   * Skip to next track
   */
  const nextTrack = useCallback(async () => {
    if (player) {
      await player.nextTrack()
    }
  }, [player])

  /**
   * Skip to previous track
   */
  const previousTrack = useCallback(async () => {
    if (player) {
      await player.previousTrack()
    }
  }, [player])

  /**
   * Seek to position
   */
  const seek = useCallback(async (positionMs: number) => {
    if (player) {
      await player.seek(positionMs)
    }
  }, [player])

  /**
   * Set volume (0.0 to 1.0)
   */
  const setVolume = useCallback(async (volume: number) => {
    if (player) {
      await player.setVolume(volume)
    }
  }, [player])

  return {
    player,
    deviceId,
    isReady,
    isActive,
    currentTrack,
    isPaused,
    position,
    duration,
    play,
    pause,
    resume,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    togglePlay,
  }
}
