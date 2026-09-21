import { useState } from 'react'
import { youtubeId, youtubeThumb } from '@/lib/youtube'
import { PlayButton } from './PlayButton'
import { cn } from '@/lib/utils'

/** Poster + play; the iframe loads only after a tap. Renders nothing for a non-YouTube URL. */
export function YouTubeFacade({ url, title, className, poster, startActive = false }:
  { url?: string; title: string; className?: string; poster?: string; startActive?: boolean }) {
  const id = youtubeId(url)
  const [active, setActive] = useState(startActive)
  if (!id) return null
  if (active) {
    return (
      <div className={cn('bg-bg', className)} style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    )
  }
  return (
    <div className={cn('relative bg-bg', className)} style={{ aspectRatio: '16 / 9' }}>
      <img src={poster ?? youtubeThumb(id)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      <PlayButton label={`Play ${title} on YouTube`} onClick={() => setActive(true)} />
    </div>
  )
}
