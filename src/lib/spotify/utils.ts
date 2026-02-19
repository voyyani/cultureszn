/**
 * Spotify Utilities
 * 
 * Helper functions for working with Spotify URLs, IDs, and data.
 */

/**
 * Extract Spotify ID from a Spotify URL
 * 
 * @param url - Spotify URL (open.spotify.com or spotify: URI)
 * @returns Extracted ID or null if invalid
 * 
 * @example
 * extractSpotifyId('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp')
 * // => '3n3Ppam7vgaVa1iaRUc9Lp'
 * 
 * extractSpotifyId('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp')
 * // => '3n3Ppam7vgaVa1iaRUc9Lp'
 */
export function extractSpotifyId(url: string | undefined): string | null {
  if (!url) return null

  // Handle Spotify URI format: spotify:track:ID or spotify:album:ID
  if (url.startsWith('spotify:')) {
    const parts = url.split(':')
    return parts[2] || null
  }

  // Handle Spotify web URL: https://open.spotify.com/track/ID or /album/ID
  const match = url.match(/\/(?:track|album|artist)\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

/**
 * Extract Spotify type (track, album, artist) from URL
 * 
 * @param url - Spotify URL
 * @returns Type string or null
 */
export function extractSpotifyType(url: string | undefined): 'track' | 'album' | 'artist' | null {
  if (!url) return null

  if (url.includes('track') || url.includes(':track:')) return 'track'
  if (url.includes('album') || url.includes(':album:')) return 'album'
  if (url.includes('artist') || url.includes(':artist:')) return 'artist'

  return null
}

/**
 * Build Spotify embed URL
 * 
 * @param type - Spotify content type
 * @param id - Spotify ID
 * @returns Embed URL
 */
export function buildSpotifyEmbedUrl(type: 'track' | 'album' | 'artist', id: string): string {
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
}

/**
 * Build Spotify web URL
 * 
 * @param type - Spotify content type
 * @param id - Spotify ID
 * @returns Web URL
 */
export function buildSpotifyUrl(type: 'track' | 'album' | 'artist', id: string): string {
  return `https://open.spotify.com/${type}/${id}`
}

/**
 * Validate Spotify ID format
 * 
 * @param id - Potential Spotify ID
 * @returns True if valid format (22 alphanumeric characters)
 */
export function isValidSpotifyId(id: string | undefined): boolean {
  if (!id) return false
  return /^[a-zA-Z0-9]{22}$/.test(id)
}

/**
 * Format duration from milliseconds to human readable
 * 
 * @param ms - Duration in milliseconds
 * @returns Formatted string (MM:SS or H:MM:SS)
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Get Spotify brand color
 * 
 * @returns Spotify green hex code
 */
export function getSpotifyColor(): string {
  return '#1DB954'
}

/**
 * Parse streaming links from Release data
 * 
 * @param streamingLinks - Release streaming links object
 * @returns Object with extracted Spotify ID and type
 */
export function parseStreamingLinks(streamingLinks: Record<string, string | undefined>): {
  spotifyId: string | null
  spotifyType: 'track' | 'album' | null
} {
  const spotifyUrl = streamingLinks.spotify
  const spotifyId = extractSpotifyId(spotifyUrl)
  const spotifyType = extractSpotifyType(spotifyUrl)

  return {
    spotifyId,
    spotifyType: spotifyType as 'track' | 'album' | null,
  }
}
