import { getAllArtists } from '@/data'
import { ArtistPanel } from '@/components/shared/ArtistPanel'
import { Reveal } from '@/components/shared/Reveal'
import { NowPlayingStrip } from './NowPlayingStrip'

/* The first viewport: the fascia, the side of the bus (one panel per artist), the sound system. */
export function Hero() {
  const artists = getAllArtists()
  return (
    <div className="flex min-h-[calc(100svh-4rem-3px)] flex-col">
      <div className="container-szn pt-5 pb-3 sm:pt-7 sm:pb-4">
        <h1 className="text-[clamp(2rem,5.5vw,4.25rem)]">
          Made in <span className="text-board">Nairobi</span>.
        </h1>
        <p className="label mt-3 text-base text-fg-muted sm:text-lg">
          Culture SZN · A music &amp; design collective · Every drop, one tap
        </p>
      </div>

      <Reveal stagger className="panel-row container-szn flex-1 pb-4" as="ul">
        {artists.map((a, i) => (
          <Reveal.Item key={a.slug} as="li" className="list-none">
            <ArtistPanel artist={a} index={i} priority={i === 0} className="h-full" />
          </Reveal.Item>
        ))}
      </Reveal>

      <NowPlayingStrip />
    </div>
  )
}
