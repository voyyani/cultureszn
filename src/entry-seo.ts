import { SITE } from '@/config/site'
import { getAllArtists, getAllReleases, getAllSZNals } from '@/data'
import { cloudinary } from '@/lib/cloudinary'

export interface RouteMeta { path: string; title: string; description: string; image: string; canonical: string; jsonLd?: object }

// Replaced by a real share image when the team supplies one (docs/ASSETS-NEEDED.md).
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dph79ptoz/image/upload/f_auto,q_auto,w_1200,ar_1.91,c_fill/v1770308654/ChatGPT_Image_Feb_5_2026_07_23_10_PM_hr3z6w.png'
const og = (url?: string) => (url && url.includes('res.cloudinary.com') ? cloudinary(url, { w: 1200, ar: '1.91' }) : url && /^https?:\/\//.test(url) ? url : DEFAULT_IMAGE)
const canonical = (path: string) => `${SITE.url}${path === '/' ? '' : path}`
const t = (s: string) => `${s} | ${SITE.name}`

/** One entry per route the site serves; `scripts/prerender.mjs` writes a static HTML head for each. */
export function getRouteMeta(): RouteMeta[] {
  const out: RouteMeta[] = [
    { path: '/', title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description, image: DEFAULT_IMAGE, canonical: canonical('/'),
      jsonLd: { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, url: SITE.url, sameAs: Object.values(SITE.socials).filter(Boolean) } },
    { path: '/artists', title: t('Artists'), description: "The artists of Culture SZN — Nairobi's next-generation creatives.", image: DEFAULT_IMAGE, canonical: canonical('/artists') },
    { path: '/releases', title: t('Releases'), description: 'Every Culture SZN release, plus curated playlists.', image: DEFAULT_IMAGE, canonical: canonical('/releases') },
    { path: '/sznals', title: t('SZNals'), description: 'The Culture SZN journal — culture, process, and creative philosophy from Nairobi.', image: DEFAULT_IMAGE, canonical: canonical('/sznals') },
    { path: '/join', title: t('Join SZN'), description: 'Join the Culture SZN community on WhatsApp and hear about every drop first by email.', image: DEFAULT_IMAGE, canonical: canonical('/join') },
  ]
  for (const a of getAllArtists()) {
    const path = `/artists/${a.slug}`
    out.push({ path, title: t(a.name), description: a.shortBio, image: og(a.coverImage ?? a.image), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'MusicGroup', name: a.name, url: canonical(path), sameAs: Object.values(a.social).filter(Boolean) } })
  }
  for (const r of getAllReleases()) {
    const path = `/releases/${r.slug}`
    out.push({ path, title: t(`${r.title} — ${r.artist}`), description: r.description ?? `${r.title} by ${r.artist}. Listen on YouTube, Spotify, Audiomack and more.`, image: og(r.coverArt), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'MusicAlbum', name: r.title, byArtist: { '@type': 'MusicGroup', name: r.artist }, datePublished: r.releaseDate, image: og(r.coverArt), url: canonical(path) } })
  }
  for (const s of getAllSZNals()) {
    const path = `/sznals/${s.slug}`
    out.push({ path, title: t(s.title), description: s.excerpt, image: og(s.cover), canonical: canonical(path),
      jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, datePublished: s.publishedDate, author: { '@type': 'Organization', name: s.author } } })
  }
  return out
}
