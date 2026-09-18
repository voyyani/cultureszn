export type PlatformKey = 'youtube' | 'spotify' | 'audiomack' | 'boomplay' | 'appleMusic' | 'soundcloud'

export const PLATFORM_ORDER: PlatformKey[] = ['youtube', 'spotify', 'audiomack', 'boomplay', 'appleMusic', 'soundcloud']

export const PLATFORMS: Record<PlatformKey, { label: string; color: string; iconSlug: string }> = {
  youtube: { label: 'YouTube', color: '#FF0000', iconSlug: 'youtube' },
  spotify: { label: 'Spotify', color: '#1DB954', iconSlug: 'spotify' },
  audiomack: { label: 'Audiomack', color: '#FFA200', iconSlug: 'audiomack' },
  boomplay: { label: 'Boomplay', color: '#00A3FF', iconSlug: 'boomplay' },
  appleMusic: { label: 'Apple Music', color: '#FA243C', iconSlug: 'applemusic' },
  soundcloud: { label: 'SoundCloud', color: '#FF5500', iconSlug: 'soundcloud' },
}

export function platformLinks(links: Partial<Record<PlatformKey, string>>) {
  return PLATFORM_ORDER.flatMap((key) => {
    const url = links[key]
    return url ? [{ key, url, label: PLATFORMS[key].label, color: PLATFORMS[key].color }] : []
  })
}
