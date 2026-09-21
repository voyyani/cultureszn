import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button, LinkButton } from '@/components/ui'
import { ShareRow, CloudinaryImage, ReleaseCard } from '@/components/shared'
import { YouTubeFacade, SpotifyEmbed } from '@/components/media'
import { TrackList } from '@/components/releases'
import { BrandIcon } from '@/components/icons'
import { getReleaseBySlug, getReleasesByArtist, artistExists } from '@/data'
import { platformLinks } from '@/config/platforms'
import { primaryPlayback } from '@/lib/playback'
import { formatDate } from '@/lib/format'
import { cloudinary } from '@/lib/cloudinary'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

/* The sound-system stack: cover panel, LED strip with the primary Play, the numbered display,
   a row of chrome switches for every platform, the story, share, more from the artist. */
export function Release() {
  const { slug = '' } = useParams<{ slug: string }>()
  const release = getReleaseBySlug(slug)
  const [open, setOpen] = useState(false)

  const url = `${SITE.url}/releases/${slug}`
  const ogImage = release?.coverArt?.includes('res.cloudinary.com') ? cloudinary(release.coverArt, { w: 1200, ar: '1.91' }) : release?.coverArt
  useDocumentHead({
    title: release ? `${release.title} — ${release.artist} | ${SITE.name}` : `Release | ${SITE.name}`,
    description: release?.description ?? (release ? `${release.title} by ${release.artist}. Listen on YouTube, Spotify, Audiomack and more.` : undefined),
    canonical: release ? url : undefined,
    meta: release ? [
      { property: 'og:type', content: 'music.album' },
      { property: 'og:title', content: `${release.title} — ${release.artist}` },
      { property: 'og:image', content: ogImage ?? '' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ] : [],
    jsonLd: release ? {
      '@context': 'https://schema.org', '@type': 'MusicAlbum', name: release.title,
      byArtist: { '@type': 'MusicGroup', name: release.artist }, datePublished: release.releaseDate, image: ogImage, url,
      ...(release.tracks?.length ? { numTracks: release.tracks.length, track: release.tracks.map((t, i) => ({ '@type': 'MusicRecording', name: t.name, position: i + 1 })) } : {}),
    } : undefined,
  })

  if (!release) {
    return (
      <section className="section-szn" aria-labelledby="nf-heading">
        <div className="container-szn">
          <p className="label text-lg text-board">Not on this route</p>
          <h1 id="nf-heading" className="mt-3 text-[clamp(2.5rem,8vw,5.5rem)]">No release here.</h1>
          <p className="mt-6 max-w-md text-lg text-fg-muted">Every drop is on the releases page.</p>
          <div className="mt-8"><LinkButton to="/releases" variant="primary" size="lg">All releases</LinkButton></div>
        </div>
      </section>
    )
  }

  const playback = primaryPlayback(release)
  const platforms = platformLinks(release.streamingLinks)
  const more = getReleasesByArtist(release.artistSlug).filter((r) => r.id !== release.id).slice(0, 4)
  const hasArtistPage = artistExists(release.artistSlug)
  const title = `${release.title} — ${release.artist}`
  const share = { title: `${title} | ${SITE.name}`, text: title, url }

  return (
    <>
      <section aria-labelledby="release-heading">
        <div className="container-szn grid gap-6 py-8 sm:grid-cols-[minmax(200px,420px)_1fr] sm:items-end sm:py-10">
          <div className="overflow-hidden rounded-szn border border-line bg-bg-raised" style={{ aspectRatio: '1 / 1' }}>
            {release.coverArt ? (
              <CloudinaryImage src={release.coverArt} alt={`${release.title} cover art`} width={640} ar="1:1" sizes="(min-width: 640px) 420px, 100vw" priority className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden className="flex h-full items-center justify-center p-6 text-center font-display text-4xl text-chrome">{release.title}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="label text-lg text-board">{release.type} · {formatDate(release.releaseDate)}</p>
            <h1 id="release-heading" className="mt-2 text-[clamp(2.5rem,9vw,6.5rem)]">{release.title}</h1>
            <p className="mt-3 font-display text-xl sm:text-2xl">
              {hasArtistPage ? <Link to={`/artists/${release.artistSlug}`} className="text-board hover:text-fg">{release.artist}</Link> : release.artist}
            </p>
          </div>
        </div>

        <div className="led" aria-hidden />

        <div className="container-szn py-5">
          {open && (
            <div className="mb-5">
              {playback.kind === 'youtube' && <YouTubeFacade url={playback.url} title={title} startActive className="overflow-hidden rounded-szn" />}
              {playback.kind === 'spotify' && <SpotifyEmbed type={playback.type} id={playback.id} title={title} startActive />}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {playback.kind !== 'links' && !open && (
              <Button variant="primary" size="lg" onClick={() => setOpen(true)} aria-label={`Play ${release.title}`}>
                <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                Play
              </Button>
            )}
            {platforms.map((p) => (
              <a key={p.key} href={p.url} target="_blank" rel="noopener noreferrer"
                 className="label inline-flex min-h-11 items-center gap-2 rounded-szn border-2 border-chrome px-4 text-sm text-fg transition-colors hover:border-fg">
                <span style={{ color: p.color }}><BrandIcon platform={p.key} size={16} /></span>{p.label}
              </a>
            ))}
            {platforms.length === 0 && playback.kind === 'links' && <p className="text-fg-muted">Streaming links coming — see the artist's page.</p>}
          </div>
        </div>
      </section>

      <div className="container-szn grid gap-10 py-8 md:grid-cols-[3fr_2fr] sm:py-12">
        <div>
          {release.tracks && release.tracks.length > 0 && (
            <section aria-labelledby="tracks-heading">
              <h2 id="tracks-heading" className="mb-4 text-2xl">Tracks</h2>
              <TrackList tracks={release.tracks} primaryArtist={release.artist} />
            </section>
          )}
          {release.description && (
            <section aria-labelledby="about-heading" className="mt-10">
              <h2 id="about-heading" className="text-2xl">About</h2>
              <p className="measure mt-4 text-lg text-fg-muted">{release.description}</p>
            </section>
          )}
        </div>
        <div>
          <h2 className="label text-sm text-chrome">Share</h2>
          <ShareRow data={share} className="mt-3" />
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="border-t border-line">
          <div className="container-szn py-10 sm:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="more-heading" className="text-2xl">More from {release.artist}</h2>
              {hasArtistPage && <LinkButton to={`/artists/${release.artistSlug}`} variant="secondary">Artist page</LinkButton>}
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {more.map((r) => <li key={r.id}><ReleaseCard release={r} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
