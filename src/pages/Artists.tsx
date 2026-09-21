import { getAllArtists } from '@/data'
import { ArtistPanel } from '@/components/shared/ArtistPanel'
import { Reveal } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Artists() {
  useDocumentHead({ title: `Artists | ${SITE.name}`, description: "The artists of Culture SZN — Nairobi's next-generation creatives.", canonical: `${SITE.url}/artists` })
  const artists = getAllArtists()
  return (
    <section className="section-szn" aria-labelledby="artists-heading">
      <div className="container-szn">
        <h1 id="artists-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">Artists</h1>
        <p className="label mt-3 text-lg text-fg-muted">{artists.length} on the roster · Nairobi</p>
        <div className="led mt-6 mb-8" aria-hidden />
        <Reveal stagger as="ul" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {artists.map((a, i) => (
            <Reveal.Item key={a.slug} as="li" className="list-none">
              <ArtistPanel artist={a} index={i} priority={i === 0} />
              <p className="mt-3 text-fg-muted">{a.shortBio}</p>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
