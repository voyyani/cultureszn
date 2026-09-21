import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LinkButton, LoadingSpinner } from '@/components/ui'
import { ShareRow, CloudinaryImage } from '@/components/shared'
import { ArtistSEO, DiscographyList } from '@/components/artist'
import { buildStops } from '@/lib/stops'
import { BrandIcon } from '@/components/icons'
import { getArtistProfileAsync, getReleasesByArtist, findArtistByName, artistExists } from '@/data'
import { platformLinks, type PlatformKey } from '@/config/platforms'
import { realImage } from '@/lib/playback'
import { SITE } from '@/config/site'
import type { NormalizedArtist } from '@/types/artist'

const SOCIAL_TO_PLATFORM: Partial<Record<keyof NormalizedArtist['social'], PlatformKey>> = { youtube: 'youtube', spotify: 'spotify', apple: 'appleMusic', soundcloud: 'soundcloud' }

/* The route-board profile: the name is the destination painted across the top,
   the discography is the numbered list of stops, bio and collaborators are side plates. */
export function Artist() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [loaded, setLoaded] = useState<{ slug: string; artist: NormalizedArtist | null } | null>(null)

  useEffect(() => {
    let alive = true
    getArtistProfileAsync(slug)
      .then((artist) => alive && setLoaded({ slug, artist }))
      .catch(() => alive && setLoaded({ slug, artist: null }))
    return () => { alive = false }
  }, [slug])

  if (!artistExists(slug)) return <NotOnRoute />
  const artist = loaded?.slug === slug ? loaded.artist : undefined
  if (artist === null) return <NotOnRoute />
  if (artist === undefined) return <LoadingSpinner label={`Loading ${slug}`} />

  const links: Partial<Record<PlatformKey, string>> = {}
  for (const [k, p] of Object.entries(SOCIAL_TO_PLATFORM) as [keyof NormalizedArtist['social'], PlatformKey][]) {
    const url = artist.social[k]
    if (url) links[p] = url
  }
  const platforms = platformLinks(links)
  const stops = buildStops(getReleasesByArtist(slug), artist.releases)
  const paragraphs = artist.longBio.split('\n\n').map((p) => p.trim()).filter(Boolean)
  const notAPerson = new Set([artist.name, SITE.name, 'culture szn'].map((n) => n.toLowerCase()))
  const collaborators = [...new Set(artist.collaborations.flatMap((c) => c.artists))].filter((n) => !notAPerson.has(n.toLowerCase()))
  const image = realImage(artist.image)
  const share = { title: `${artist.name} | ${SITE.name}`, text: `${artist.name} on Culture SZN`, url: `${SITE.url}/artists/${artist.slug}` }

  return (
    <>
      <ArtistSEO artist={artist} />

      <section aria-labelledby="artist-heading" className="border-b border-line">
        <div className="container-szn grid gap-6 py-8 sm:py-10 md:grid-cols-[1fr_minmax(220px,320px)] md:items-end">
          <div className="min-w-0">
            <p className="label text-lg text-board">{artist.role} · {artist.location}, {artist.country}</p>
            <h1 id="artist-heading" className="mt-2 text-[clamp(3rem,11vw,8rem)]">{artist.name}</h1>
            {artist.pronunciation && <p className="label mt-2 text-sm text-fg-muted">Say it: {artist.pronunciation}</p>}
            {platforms.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${artist.name} on streaming platforms`}>
                {platforms.map((p) => (
                  <li key={p.key}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                       className="label inline-flex min-h-11 items-center gap-2 rounded-szn border-2 border-chrome px-4 text-sm text-fg transition-colors hover:border-fg">
                      <span style={{ color: p.color }}><BrandIcon platform={p.key} size={16} /></span>{p.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {image && (
            <CloudinaryImage src={image} alt={artist.name} width={640} ar="4:5" sizes="(min-width: 768px) 320px, 100vw" priority
              className="w-full rounded-szn border border-line object-cover md:justify-self-end" />
          )}
        </div>
        <div className="led" aria-hidden />
      </section>

      <section aria-labelledby="discography-heading" className="section-szn">
        <div className="container-szn">
          <h2 id="discography-heading" className="mb-6 text-3xl">Discography</h2>
          <DiscographyList stops={stops} artistName={artist.name} />
        </div>
      </section>

      <section aria-labelledby="about-heading" className="border-t border-line">
        <div className="container-szn grid gap-10 py-12 md:grid-cols-[2fr_1fr] sm:py-16">
          <div>
            <h2 id="about-heading" className="text-3xl">About</h2>
            <div className="measure mt-5 space-y-5 text-lg text-fg-muted">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {artist.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
                {artist.tags.map((t) => <li key={t} className="label plate text-xs">{t}</li>)}
              </ul>
            )}
          </div>
          <div className="space-y-8">
            {collaborators.length > 0 && (
              <div>
                <h3 className="label text-sm text-chrome">With</h3>
                <ul className="mt-3 space-y-2">
                  {collaborators.map((name) => {
                    const on = findArtistByName(name)
                    return (
                      <li key={name} className="font-display text-lg">
                        {on ? <Link to={`/artists/${on.slug}`} className="text-board hover:text-fg">{on.name}</Link> : <span>{name}</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {artist.affiliations.length > 0 && (
              <div>
                <h3 className="label text-sm text-chrome">Part of</h3>
                <p className="mt-3 font-display text-lg">{artist.affiliations.join(' · ')}</p>
              </div>
            )}
            <div>
              <h3 className="label text-sm text-chrome">Share</h3>
              <ShareRow data={share} className="mt-3" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function NotOnRoute() {
  return (
    <section className="section-szn" aria-labelledby="nf-heading">
      <div className="container-szn">
        <p className="label text-lg text-board">Not on this route</p>
        <h1 id="nf-heading" className="mt-3 text-[clamp(2.5rem,8vw,5.5rem)]">No artist here.</h1>
        <p className="mt-6 max-w-md text-lg text-fg-muted">The roster is short and every name is on it.</p>
        <div className="mt-8"><LinkButton to="/artists" variant="primary" size="lg">All artists</LinkButton></div>
      </div>
    </section>
  )
}
