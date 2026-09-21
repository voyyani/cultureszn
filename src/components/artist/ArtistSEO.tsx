import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { cloudinary } from '@/lib/cloudinary'
import type { NormalizedArtist } from '@/types/artist'

/** Title, description, canonical, Open Graph and MusicGroup JSON-LD for an artist page. Renders nothing. */
export function ArtistSEO({ artist }: { artist: NormalizedArtist }) {
  const url = `${SITE.url}/artists/${artist.slug}`
  const image = artist.image?.includes('res.cloudinary.com') ? cloudinary(artist.image, { w: 1200, ar: '1.91' }) : artist.image
  const description = artist.seo?.description || artist.shortBio
  const sameAs = Object.values(artist.social).filter((v): v is string => Boolean(v))

  useDocumentHead({
    title: artist.seo?.title || `${artist.name} | ${SITE.name}`,
    description,
    canonical: url,
    meta: [
      { property: 'og:type', content: 'profile' },
      { property: 'og:title', content: `${artist.name} | ${SITE.name}` },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${artist.name} | ${SITE.name}` },
      { name: 'twitter:image', content: image },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      '@id': url,
      name: artist.name,
      alternateName: artist.aliases,
      description: artist.shortBio,
      genre: artist.genres,
      url,
      image,
      sameAs,
      foundingLocation: { '@type': 'Place', name: artist.location, address: { '@type': 'PostalAddress', addressCountry: artist.country } },
      affiliation: artist.affiliations.map((name) => ({ '@type': 'Organization', name })),
    },
  })
  return null
}
