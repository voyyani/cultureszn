/**
 * ArtistSEO Component
 * 
 * Comprehensive SEO management for artist profile pages.
 * Includes Open Graph, Twitter Cards, and JSON-LD structured data.
 */

import { useDocumentHead } from '@/hooks'
import type { NormalizedArtist } from '@/types/artist'

interface ArtistSEOProps {
  artist: NormalizedArtist
  baseUrl?: string
}

/**
 * Generate MusicGroup JSON-LD structured data
 * Following schema.org specifications for music artists
 */
function generateJsonLd(artist: NormalizedArtist, baseUrl: string) {
  const sameAs: string[] = []
  
  // Add all social/platform links
  if (artist.social.spotify) sameAs.push(artist.social.spotify)
  if (artist.social.apple) sameAs.push(artist.social.apple)
  if (artist.social.youtube) sameAs.push(artist.social.youtube)
  if (artist.social.soundcloud) sameAs.push(artist.social.soundcloud)
  if (artist.social.instagram) sameAs.push(artist.social.instagram)
  if (artist.social.twitter) sameAs.push(artist.social.twitter)
  if (artist.social.tiktok) sameAs.push(artist.social.tiktok)

  // Build album/track list for discography
  const albums = artist.releases
    .filter(r => r.type === 'album' || r.type === 'ep')
    .map(r => ({
      '@type': 'MusicAlbum',
      'name': r.title,
      'datePublished': r.releaseDate,
      ...(r.links.spotify && { 'url': r.links.spotify }),
    }))

  const tracks = artist.releases
    .filter(r => r.type === 'single')
    .map(r => ({
      '@type': 'MusicRecording',
      'name': r.title,
      'datePublished': r.releaseDate,
      ...(r.links.spotify && { 'url': r.links.spotify }),
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${baseUrl}/artists/${artist.slug}`,
    'name': artist.name,
    'alternateName': artist.aliases,
    'description': artist.shortBio,
    'genre': artist.genres,
    'foundingLocation': {
      '@type': 'Place',
      'name': artist.location,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': artist.country,
      },
    },
    ...(artist.image && {
      'image': {
        '@type': 'ImageObject',
        'url': artist.image,
        'caption': `${artist.name} - Culture SZN Artist`,
      },
    }),
    'sameAs': sameAs,
    'url': `${baseUrl}/artists/${artist.slug}`,
    'member': {
      '@type': 'Person',
      'name': artist.name,
      'alternateName': artist.aliases,
    },
    ...(albums.length > 0 && { 'album': albums }),
    ...(tracks.length > 0 && { 'track': tracks }),
    'affiliation': artist.affiliations.map(aff => ({
      '@type': 'Organization',
      'name': aff,
    })),
    // BreadcrumbList for navigation
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/artists/${artist.slug}`,
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Culture SZN',
            'item': baseUrl,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Artists',
            'item': `${baseUrl}/artists`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': artist.name,
            'item': `${baseUrl}/artists/${artist.slug}`,
          },
        ],
      },
    },
  }
}

export function ArtistSEO({ artist, baseUrl = 'https://cultureszn.com' }: ArtistSEOProps) {
  const pageUrl = `${baseUrl}/artists/${artist.slug}`
  const ogImage = artist.image || `${baseUrl}/og-default.png`
  
  // Generate title with proper formatting
  const pageTitle = artist.seo?.title || `${artist.name} | Culture SZN`
  
  // Generate description
  const pageDescription = artist.seo?.description || 
    `Official Culture SZN profile for ${artist.name} — ${artist.genres.join(', ')} artist from ${artist.location}, ${artist.country}. Stream music, explore releases, and connect.`

  // Build meta tags array
  const metaTags = [
    // Open Graph
    { property: 'og:type', content: 'music.musician' },
    { property: 'og:title', content: `${artist.name} — ${artist.country} ${artist.genres[0]} Artist` },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: `${artist.name} - Culture SZN Artist` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'Culture SZN' },
    { property: 'og:locale', content: 'en_US' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${artist.name} — ${artist.genres[0]} Artist` },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: `${artist.name} - Culture SZN Artist` },
    
    // Music-specific meta
    { property: 'music:musician', content: pageUrl },
    
    // Additional SEO
    { name: 'author', content: artist.name },
    { name: 'keywords', content: [
      artist.name,
      ...artist.aliases,
      ...artist.genres,
      ...artist.tags,
      artist.location,
      artist.country,
      'Culture SZN',
      'African Hip-Hop',
      'Kenyan Music',
    ].join(', ') },
    
    // Robots
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    
    // Theme color
    { name: 'theme-color', content: '#FF6B35' },
  ]

  // Add Spotify-specific meta if available
  if (artist.platformIds.spotifyArtistId) {
    metaTags.push({
      property: 'music:musician:spotify',
      content: `https://open.spotify.com/artist/${artist.platformIds.spotifyArtistId}`,
    })
  }

  // Generate JSON-LD
  const jsonLd = generateJsonLd(artist, baseUrl)

  // Apply to document head
  useDocumentHead({
    title: pageTitle,
    description: pageDescription,
    canonical: pageUrl,
    meta: metaTags,
    jsonLd,
  })

  // This component doesn't render anything visible
  return null
}

/**
 * Pre-render hints for performance
 * Can be used in index.html or added dynamically
 */
export function generatePreconnectLinks(): string[] {
  return [
    'https://open.spotify.com',
    'https://music.apple.com',
    'https://i.scdn.co', // Spotify CDN
    'https://is1-ssl.mzstatic.com', // Apple Music CDN
  ]
}

/**
 * Generate Open Graph image URL
 * For use with dynamic OG image generation services
 */
export function generateOgImageUrl(artist: NormalizedArtist, baseUrl: string): string {
  // This would integrate with Vercel OG or similar service
  const params = new URLSearchParams({
    title: artist.name,
    subtitle: `${artist.genres[0]} Artist from ${artist.country}`,
    image: artist.image || '',
    theme: 'dark',
  })
  
  return `${baseUrl}/api/og?${params.toString()}`
}
