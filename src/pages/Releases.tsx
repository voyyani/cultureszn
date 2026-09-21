import { getAllReleases, getPlaylists } from '@/data'
import { ReleaseCard, Reveal } from '@/components/shared'
import { PlaylistCard } from '@/components/releases'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

/* Every release, newest first, grouped by year — each year a stop on the route. Playlists follow when any exist. */
export function Releases() {
  useDocumentHead({ title: `Releases | ${SITE.name}`, description: 'Every Culture SZN release, plus curated playlists.', canonical: `${SITE.url}/releases` })
  const releases = getAllReleases()
  const years = [...new Set(releases.map((r) => r.releaseDate.slice(0, 4)))]
  const playlists = getPlaylists()
  return (
    <>
      <section className="section-szn" aria-labelledby="releases-heading">
        <div className="container-szn">
          <h1 id="releases-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">Releases</h1>
          <p className="label mt-3 text-lg text-fg-muted">{releases.length} drops · newest first</p>
          <div className="led mt-6" aria-hidden />
          {years.map((year) => (
            <section key={year} aria-labelledby={`year-${year}`} className="mt-10">
              <h2 id={`year-${year}`} className="label mb-5 text-2xl text-board">{year}</h2>
              <Reveal stagger as="ul" className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {releases.filter((r) => r.releaseDate.startsWith(year)).map((r, i) => (
                  <Reveal.Item key={r.id} as="li" className="list-none">
                    <ReleaseCard release={r} priority={year === years[0] && i < 2} isNew={r.id === releases[0].id} />
                  </Reveal.Item>
                ))}
              </Reveal>
            </section>
          ))}
        </div>
      </section>
      {playlists.length > 0 && (
        <section className="section-szn border-t border-line" aria-labelledby="playlists-heading">
          <div className="container-szn">
            <h2 id="playlists-heading" className="text-3xl">Playlists</h2>
            <p className="mt-3 text-fg-muted">Curated by the collective, refreshed from Spotify every day.</p>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {playlists.map((p) => <li key={p.id}><PlaylistCard playlist={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
