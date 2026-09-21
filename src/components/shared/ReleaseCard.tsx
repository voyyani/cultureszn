import { Link } from 'react-router-dom'
import { CloudinaryImage } from './CloudinaryImage'
import { Tape } from './Tape'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Release } from '@/types'

/* A release as a panel: square cover, title on a plate, artist and date as a route-board line. */
export function ReleaseCard({ release, priority = false, isNew = false }: { release: Release; priority?: boolean; isNew?: boolean }) {
  return (
    <Link to={`/releases/${release.slug}`} className="group block">
      <div className="relative rounded-szn border border-line bg-bg-raised" style={{ aspectRatio: '1 / 1' }}>
        {release.coverArt ? (
          <CloudinaryImage src={release.coverArt} alt="" width={480} ar="1:1" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" priority={priority}
            className="h-full w-full rounded-szn object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center p-4 text-center font-display text-3xl leading-none text-chrome">{release.title}</span>
        )}
        {isNew && (
          /* tape straddles the panel's bottom edge, half outside the frame, so it never covers the artwork's title */
          <span className="absolute inset-x-3 -bottom-4 flex h-8 items-stretch">
            <span className="w-full overflow-hidden" aria-hidden><Tape className="h-full w-full" /></span>
            <span className="label absolute right-2 top-1/2 -translate-y-1/2 bg-bg px-2.5 py-1.5 text-xs text-fg">New</span>
          </span>
        )}
      </div>
      <p className={cn('mt-3 font-display text-lg leading-tight text-fg group-hover:text-board sm:text-xl', isNew && 'mt-7')}>{release.title}</p>
      <p className="label mt-1 text-sm text-fg-muted">{release.artist} · {release.type} · {formatDate(release.releaseDate, { day: undefined })}</p>
    </Link>
  )
}
