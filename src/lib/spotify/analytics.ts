/**
 * Spotify Analytics Utility
 * 
 * Tracks Spotify-related events for analytics.
 * Integrates with Google Analytics 4 and custom analytics.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export type SpotifyEvent = 
  | 'spotify_auth_initiated'
  | 'spotify_auth_success'
  | 'spotify_auth_failed'
  | 'spotify_logout'
  | 'spotify_player_ready'
  | 'spotify_play'
  | 'spotify_pause'
  | 'spotify_skip_next'
  | 'spotify_skip_previous'
  | 'spotify_track_complete'
  | 'spotify_save_track'
  | 'spotify_remove_track'
  | 'spotify_recommendations_fetched'
  | 'spotify_playback_error'

interface SpotifyEventData {
  event_category?: string
  event_label?: string
  track_id?: string
  track_name?: string
  artist_name?: string
  device_id?: string
  user_id?: string
  error_message?: string
  [key: string]: any
}

/**
 * Track Spotify event
 */
export function trackSpotifyEvent(
  event: SpotifyEvent,
  data?: SpotifyEventData
) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', event, {
      event_category: 'Spotify',
      ...data,
    })
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, data)
  }

  // Custom analytics (if needed)
  sendToCustomAnalytics(event, data)
}

/**
 * Track page view
 */
export function trackSpotifyPageView(pagePath: string, pageTitle: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_category: 'Spotify',
    })
  }
}

/**
 * Track user timing (performance)
 */
export function trackSpotifyTiming(
  name: string,
  value: number,
  category = 'Spotify'
) {
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value,
      event_category: category,
    })
  }
}

/**
 * Send to custom analytics endpoint (optional)
 */
async function sendToCustomAnalytics(
  _event: SpotifyEvent,
  _data?: SpotifyEventData
) {
  try {
    // Implement custom analytics if needed
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event: _event, data: _data, timestamp: Date.now() }),
    // })
  } catch (error) {
    // Silently fail - don't break app for analytics
    if (import.meta.env.DEV) {
      console.error('Custom analytics error:', error)
    }
  }
}

/**
 * Initialize Spotify analytics
 */
export function initSpotifyAnalytics() {
  // Add any initialization logic
  if (import.meta.env.DEV) {
    console.log('[Analytics] Spotify analytics initialized')
  }
}
