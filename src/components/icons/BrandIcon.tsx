import { siYoutube, siSpotify, siAudiomack, siApplemusic, siSoundcloud } from 'simple-icons'
import type { PlatformKey } from '@/config/platforms'

// simple-icons has no Boomplay glyph at the time of writing; render a lettermark.
const PATHS: Partial<Record<PlatformKey, string>> = {
  youtube: siYoutube.path,
  spotify: siSpotify.path,
  audiomack: siAudiomack.path,
  appleMusic: siApplemusic.path,
  soundcloud: siSoundcloud.path,
}

export function BrandIcon({ platform, size = 20, className }: { platform: PlatformKey; size?: number; className?: string }) {
  const d = PATHS[platform]
  if (!d) {
    return (
      <span aria-hidden className={className} style={{ width: size, height: size, fontSize: size * 0.7, lineHeight: `${size}px`, textAlign: 'center', fontWeight: 700, display: 'inline-block' }}>B</span>
    )
  }
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={d} />
    </svg>
  )
}
