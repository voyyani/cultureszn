import type { Release } from '@/types'
import { youtubeId } from '@/lib/youtube'
import { extractSpotifyId, extractSpotifyType } from '@/lib/spotify-links'

export type Playback =
  | { kind: 'youtube'; url: string }
  | { kind: 'spotify'; type: 'album' | 'track'; id: string }
  | { kind: 'links' }

/** YouTube first (the surface everyone has), then a Spotify embed, else platform buttons only. */
export function primaryPlayback(release: Pick<Release, 'streamingLinks' | 'spotifyAlbumId'>): Playback {
  const yt = release.streamingLinks.youtube
  if (yt && youtubeId(yt)) return { kind: 'youtube', url: yt }
  if (release.spotifyAlbumId) return { kind: 'spotify', type: 'album', id: release.spotifyAlbumId }
  const id = extractSpotifyId(release.streamingLinks.spotify)
  const type = extractSpotifyType(release.streamingLinks.spotify)
  if (id && (type === 'album' || type === 'track')) return { kind: 'spotify', type, id }
  return { kind: 'links' }
}

const PLACEHOLDER = '/images/artists/placeholder.svg'
/** A real image URL, or null when the profile still carries the placeholder. */
export function realImage(url?: string): string | null {
  if (!url || url === PLACEHOLDER || url.endsWith('placeholder.svg')) return null
  return url
}
