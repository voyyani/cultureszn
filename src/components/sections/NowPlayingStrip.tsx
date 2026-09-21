import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecentReleases } from '@/data'
import { primaryPlayback } from '@/lib/playback'
import { platformLinks } from '@/config/platforms'
import { YouTubeFacade, SpotifyEmbed } from '@/components/media'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { BrandIcon } from '@/components/icons'
import { Button } from '@/components/ui'
import { formatDate } from '@/lib/format'

/* The sound system. Pinned along the bottom of the first viewport; tapping Play switches it on
   and the strip expands upward into the player. No iframe until that tap. */
export function NowPlayingStrip() {
  const release = getRecentReleases(1)[0]
  const [open, setOpen] = useState(false)
  if (!release) return null
  const playback = primaryPlayback(release)
  const links = platformLinks(release.streamingLinks)
  const title = `${release.title} — ${release.artist}`

  return (
    <section aria-labelledby="now-playing" className="bg-bg">
      <div className="led" aria-hidden />
      {open && (
        <div className="container-szn pt-4">
          {playback.kind === 'youtube' && <YouTubeFacade url={playback.url} title={title} startActive className="rounded-szn overflow-hidden" />}
          {playback.kind === 'spotify' && <SpotifyEmbed type={playback.type} id={playback.id} title={title} startActive />}
        </div>
      )}
      <div className="container-szn flex flex-wrap items-center gap-x-5 gap-y-3 py-3">
        <span className="tape h-14 w-2.5 shrink-0 rounded-szn" aria-hidden />
        <Link to={`/releases/${release.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
          {release.coverArt && (
            <CloudinaryImage src={release.coverArt} alt="" width={128} ar="1:1" sizes="56px" priority className="h-14 w-14 shrink-0 rounded-szn object-cover" />
          )}
          <span className="min-w-0">
            <span id="now-playing" className="label block text-sm text-board">{open ? 'Playing' : 'Now playing'}<span className="hidden sm:inline"> · {formatDate(release.releaseDate, { day: undefined })}</span></span>
            <span className="block truncate font-display text-lg leading-tight sm:text-xl">{release.title}</span>
            <span className="label block text-sm text-fg-muted">{release.artist} · {release.type}</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {playback.kind !== 'links' && !open && (
            <Button variant="primary" size="lg" onClick={() => setOpen(true)} aria-label={`Play ${release.title}`}>
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
              Play
            </Button>
          )}
          {(playback.kind === 'links' || open) && links.map((p) => (
            <a key={p.key} href={p.url} target="_blank" rel="noopener noreferrer"
               className="label inline-flex min-h-11 items-center gap-2 rounded-szn border-2 border-chrome px-4 text-sm text-fg transition-colors hover:border-fg">
              <span style={{ color: p.color }}><BrandIcon platform={p.key} size={16} /></span>{p.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
