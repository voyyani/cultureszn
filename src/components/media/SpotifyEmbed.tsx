import { useState } from 'react'
import { PlayButton } from './PlayButton'
import { cn } from '@/lib/utils'

/** Spotify embed behind a facade; height 152 for a track, 352 for album/playlist. */
export function SpotifyEmbed({ type, id, title, poster, className, startActive = false }:
  { type: 'album' | 'track' | 'playlist'; id: string; title: string; poster?: string; className?: string; startActive?: boolean }) {
  const [active, setActive] = useState(startActive)
  const height = type === 'track' ? 152 : 352
  if (active) {
    return (
      <iframe
        className={className}
        src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`}
        title={title}
        width="100%"
        height={height}
        loading="lazy"
        allow="encrypted-media"
        style={{ border: 0, borderRadius: 'var(--radius)' }}
      />
    )
  }
  return (
    <div className={cn('relative overflow-hidden rounded-szn bg-bg-raised', className)} style={{ height }}>
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />}
      <PlayButton label={`Play ${title} on Spotify`} onClick={() => setActive(true)} />
    </div>
  )
}
