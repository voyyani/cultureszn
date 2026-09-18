import { getAllArtists } from '@/data'
import { ArtistCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Artists() {
  useDocumentHead({ title: `Artists | ${SITE.name}`, description: 'The artists of Culture SZN.' })
  const artists = getAllArtists()
  return (
    <section className="section-szn pt-32" aria-labelledby="artists-heading">
      <div className="container-szn">
        <h1 id="artists-heading" className="text-4xl font-bold mb-10">Artists</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((a) => <ArtistCard key={a.slug} artist={a} />)}
        </div>
      </div>
    </section>
  )
}
