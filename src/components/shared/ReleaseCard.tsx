import { Link } from 'react-router-dom'
import { CloudinaryImage } from './CloudinaryImage'
import { formatDate } from '@/lib/format'
import type { Release } from '@/types'

/* A release as a panel: square cover, title on a plate, artist and date as a route-board line. */
export function ReleaseCard({ release, priority = false, isNew = false }: { release: Release; priority?: boolean; isNew?: boolean }) {
  return (
    <Link to={`/releases/${release.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-szn border border-line bg-bg-raised" style={{ aspectRatio: '1 / 1' }}>
        {release.coverArt ? (
          <CloudinaryImage src={release.coverArt} alt="" width={480} ar="1:1" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" priority={priority}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center p-4 text-center font-display text-3xl leading-none text-chrome">{release.title}</span>
        )}
        {isNew && (
          <span className="absolute left-0 top-3 flex items-center">
            <span className="tape h-7 w-3" aria-hidden />
            <span className="label bg-mark px-2 py-1.5 text-xs text-fg">New</span>
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-lg leading-tight text-fg group-hover:text-board sm:text-xl">{release.title}</p>
      <p className="label mt-1 text-sm text-fg-muted">{release.artist} · {release.type} · {formatDate(release.releaseDate, { day: undefined })}</p>
    </Link>
  )
}
