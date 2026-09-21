import { Link } from 'react-router-dom'
import { CloudinaryImage } from './CloudinaryImage'
import { realImage } from '@/lib/playback'
import { cn } from '@/lib/utils'
import type { NormalizedArtist } from '@/types/artist'

/* One painted panel on the side of the bus. Real cover art when the artist has it;
   otherwise the name painted at sign scale on a colour panel — never a stand-in photo. */
const FILLS = ['bg-band text-fg', 'bg-board text-bg', 'bg-bg-raised text-fg'] as const

export function ArtistPanel({ artist, index = 0, priority = false, className }:
  { artist: Pick<NormalizedArtist, 'slug' | 'name' | 'role' | 'image' | 'location'>; index?: number; priority?: boolean; className?: string }) {
  const image = realImage(artist.image)
  const fill = FILLS[index % FILLS.length]
  return (
    <Link
      to={`/artists/${artist.slug}`}
      className={cn('group relative block overflow-hidden rounded-szn border border-line', image ? 'bg-bg' : fill, className)}
      style={{ aspectRatio: '4 / 5' }}
    >
      {image ? (
        <CloudinaryImage
          src={image}
          alt=""
          width={640}
          ar="4:5"
          sizes="(min-width: 768px) 33vw, 86vw"
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 flex items-end p-4 font-display text-[clamp(3rem,14vw,7rem)] leading-[0.85] opacity-90 sm:p-6">
          {artist.name}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-4 sm:p-5">
        <span className={cn('plate font-display text-[1.35rem] leading-none sm:text-2xl', !image && 'bg-bg text-fg')}>{artist.name}</span>
        <span className={cn('label text-sm', image ? 'plate bg-bg text-fg' : 'plate bg-bg text-board')}>{artist.role} · {artist.location}</span>
      </span>
    </Link>
  )
}
