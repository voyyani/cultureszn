/**
 * useSpotifyAuth Hook
 * 
 * Manages Spotify OAuth authentication state and provides login/logout functions.
 * Handles token refresh automatically and provides user profile information.
 */

import { useState, useEffect, useCallback } from 'react'

export interface SpotifyUser {
  id: string
  displayName: string
  email?: string
  images?: Array<{ url: string }>
  product?: 'premium' | 'free'
  country?: string
}

interface UseSpotifyAuthResult {
  isAuthenticated: boolean
  user: SpotifyUser | null
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
}

/**
 * Parse cookies client-side
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

/**
 * Hook for Spotify authentication
 * 
 * @returns Authentication state, user info, and auth functions
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useSpotifyAuth()
 * 
 * if (!isAuthenticated) {
 *   return <button onClick={login}>Connect Spotify</button>
 * }
 * 
 * return (
 *   <div>
 *     <p>Hello, {user?.displayName}!</p>
 *     <button onClick={logout}>Disconnect</button>
 *   </div>
 * )
 * ```
 */
export function useSpotifyAuth(): UseSpotifyAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<SpotifyUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Check authentication status from cookies
   */
  const checkAuth = useCallback(() => {
    const connected = getCookie('spotify_connected') === 'true'
    const userId = getCookie('spotify_user_id')
    const userName = getCookie('spotify_user_name')

    setIsAuthenticated(connected && !!userId)
    
    if (connected && userId) {
      setUser({
        id: userId,
        displayName: userName ? decodeURIComponent(userName) : userId,
      })
    } else {
      setUser(null)
    }
    
    setIsLoading(false)
  }, [])

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuth()

    // Check for auth callback success/error in URL
    const params = new URLSearchParams(window.location.search)
    
    if (params.get('spotify_connected') === 'true') {
      checkAuth()
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    
    if (params.has('spotify_error')) {
      console.error('Spotify auth error:', params.get('spotify_error'))
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }

    // Listen for popup auth success messages
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return
      
      if (event.data?.type === 'spotify_auth_success') {
        console.log('✓ Spotify auth successful via popup')
        
        // Re-check auth state
        setTimeout(() => {
          checkAuth()
          
          // Track successful auth
          if (window.gtag) {
            window.gtag('event', 'spotify_login_success', {
              event_category: 'Spotify',
              event_label: 'Auth Completed',
            })
          }
        }, 100)
      }
    }

    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [checkAuth])

  /**
   * Initiate Spotify login with popup (no page redirect)
   * Provides seamless UX without losing page state
   */
  const login = useCallback(() => {
    // Store current scroll position
    const scrollY = window.scrollY
    sessionStorage.setItem('scroll_position', scrollY.toString())

    // Open Spotify auth in popup window
    const width = 600
    const height = 700
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2
    
    const popup = window.open(
      '/api/spotify/auth/login',
      'spotify-auth',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0`
    )

    if (!popup) {
      // Fallback to full page redirect if popup blocked
      console.warn('Popup blocked, falling back to redirect')
      window.location.href = '/api/spotify/auth/login'
      return
    }

    // Track auth initiation
    if (window.gtag) {
      window.gtag('event', 'spotify_login_initiated', {
        event_category: 'Spotify',
        event_label: 'Auth Started',
      })
    }

    // Poll for popup close and check auth status
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer)
        
        // Check if auth was successful
        setTimeout(() => {
          checkAuth()
          
          // Restore scroll position
          const savedScroll = sessionStorage.getItem('scroll_position')
          if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll, 10))
            sessionStorage.removeItem('scroll_position')
          }
        }, 100)
      }
    }, 500)
  }, [checkAuth])

  /**
   * Logout from Spotify
   */
  const logout = useCallback(async () => {
    try {
      await fetch('/api/spotify/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setUser(null)
      
      // Track logout event
      if (window.gtag) {
        window.gtag('event', 'spotify_logout', {
          event_category: 'Spotify',
          event_label: 'User Logout',
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/spotify/auth/refresh', {
        method: 'POST',
      })

      if (!response.ok) {
        console.error('Token refresh failed')
        setIsAuthenticated(false)
        setUser(null)
        return false
      }

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      setIsAuthenticated(false)
      setUser(null)
      return false
    }
  }, [])

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refreshToken,
  }
}
