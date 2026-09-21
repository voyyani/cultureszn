import { Link } from 'react-router-dom'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { YouTubeFacade, SpotifyEmbed } from '@/components/media'
import { primaryPlayback } from '@/lib/playback'
import { formatDate } from '@/lib/format'
import { type Stop } from '@/lib/stops'
import { ArrowRight, ArrowOut } from '@/components/icons/Glyphs'

/* The numbered stops. The first stop carries the player inline; every other row is one tap to its page. */
export function DiscographyList({ stops, artistName }: { stops: Stop[]; artistName: string }) {
  if (stops.length === 0) {
    return <p className="text-fg-muted">No releases listed yet.</p>
  }
  const [first, ...rest] = stops
  const playback = first.release ? primaryPlayback(first.release) : { kind: 'links' as const }
  const title = `${first.title} — ${artistName}`
  return (
    <ol className="divide-y divide-line border-y border-line">
      <li className="py-5">
        <Row stop={first} index={1} />
        {playback.kind === 'youtube' && <YouTubeFacade url={playback.url} title={title} poster={first.coverArt} className="mt-4 overflow-hidden rounded-szn" />}
        {playback.kind === 'spotify' && <div className="mt-4"><SpotifyEmbed type={playback.type} id={playback.id} title={title} poster={first.coverArt} /></div>}
      </li>
      {rest.map((s, i) => (
        <li key={s.key}><Row stop={s} index={i + 2} /></li>
      ))}
    </ol>
  )
}

function Row({ stop, index }: { stop: Stop; index: number }) {
  const inner = (
    <>
      <span className="label tabular w-8 shrink-0 text-lg text-board">{String(index).padStart(2, '0')}</span>
      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-szn bg-bg-raised">
        {stop.coverArt && <CloudinaryImage src={stop.coverArt} alt="" width={128} ar="1:1" sizes="56px" className="h-full w-full object-cover" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-lg leading-tight group-hover:text-board sm:text-xl">{stop.title}</span>
        <span className="label block text-sm text-fg-muted">{stop.type} · {formatDate(stop.date, { day: undefined })}</span>
      </span>
      <span className="text-chrome group-hover:text-fg">{stop.href ? <ArrowRight /> : <ArrowOut />}</span>
    </>
  )
  const cls = 'group flex min-h-16 items-center gap-4 py-3'
  if (stop.href) return <Link to={stop.href} className={cls}>{inner}</Link>
  if (stop.external) return <a href={stop.external} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  return <div className={cls}>{inner}</div>
}
