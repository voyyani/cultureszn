import { formatDuration } from '@/lib/format'
import type { ReleaseTrack } from '@/types'

/* The deck's numbered display: rank on the left, duration right-aligned in tabular digits. */
export function TrackList({ tracks, primaryArtist }: { tracks: ReleaseTrack[]; primaryArtist: string }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {tracks.map((t, i) => {
        const features = (t.artists ?? []).filter((a) => a.toLowerCase() !== primaryArtist.toLowerCase())
        return (
          <li key={`${t.name}-${i}`} className="flex min-h-12 items-center gap-4 py-2">
            <span className="label tabular w-8 shrink-0 text-board">{String(i + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base leading-tight sm:text-lg">{t.name}</span>
              {features.length > 0 && <span className="label block text-sm text-fg-muted">feat. {features.join(', ')}</span>}
            </span>
            {typeof t.durationMs === 'number' && <span className="label tabular text-sm text-fg-muted">{formatDuration(t.durationMs)}</span>}
          </li>
        )
      })}
    </ol>
  )
}
