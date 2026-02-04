import type { Release } from '@/types'

export const releases: Release[] = [
  {
    id: '1',
    slug: 'nairobi-nights',
    title: 'Nairobi Nights',
    artist: 'Xiix & Wavy',
    artistSlug: 'xiix',
    type: 'ep',
    releaseDate: '2025-11-15',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "A sonic journey through Nairobi's nocturnal landscape, blending ambient textures with hypnotic rhythms and introspective lyricism. This collaborative EP captures the essence of the city after dark—the pulse of nightlife, quiet moments of reflection, and the dreams that emerge in the small hours.",
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/nairobinight',
      appleMusic: 'https://music.apple.com/album/nairobi-nights',
      youtube: 'https://youtube.com/watch?v=nairobinight',
      soundcloud: 'https://soundcloud.com/cultureszn/sets/nairobi-nights',
    },
    featured: true,
  },
  {
    id: '2',
    slug: 'concrete-dreams',
    title: 'Concrete Dreams',
    artist: 'Wavy',
    artistSlug: 'wavy',
    type: 'ep',
    releaseDate: '2025-08-20',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "Wavy's introspective solo EP exploring themes of ambition, love, and identity in modern Nairobi. The project weaves together R&B sensibilities with East African musical traditions.",
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/concretedreams',
      appleMusic: 'https://music.apple.com/album/concrete-dreams',
      youtube: 'https://youtube.com/watch?v=concretedreams',
    },
    featured: false,
  },
  {
    id: '3',
    slug: 'patterns-of-light',
    title: 'Patterns of Light',
    artist: 'Pipi',
    artistSlug: 'pipi',
    type: 'visual-album',
    releaseDate: '2025-06-10',
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "A groundbreaking visual album where design meets music. Pipi collaborates with various SZN producers to create an immersive audiovisual experience exploring light, shadow, and Nairobi's urban geometry.",
    streamingLinks: {
      youtube: 'https://youtube.com/watch?v=patternsoflight',
    },
    featured: false,
  },
  {
    id: '4',
    slug: 'urban-frequencies',
    title: 'Urban Frequencies',
    artist: 'Xiix',
    artistSlug: 'xiix',
    type: 'instrumental',
    releaseDate: '2025-04-05',
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "An instrumental journey through Nairobi's soundscape. Xiix captures field recordings from across the city—markets, matatus, construction sites, and quiet neighborhoods—and weaves them into atmospheric electronic compositions.",
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/urbanfrequencies',
      soundcloud: 'https://soundcloud.com/xiix/sets/urban-frequencies',
    },
    featured: false,
  },
  {
    id: '5',
    slug: 'street-gospel',
    title: 'Street Gospel',
    artist: 'Kevo',
    artistSlug: 'kevo',
    type: 'album',
    releaseDate: '2025-02-14',
    coverArt: 'https://images.unsplash.com/photo-1571974599782-87624638275e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "Kevo's debut album is a raw, unfiltered look at Nairobi street life. Hard-hitting bars meet soulful production, creating a sonic document of resilience, ambition, and community.",
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/streetgospel',
      appleMusic: 'https://music.apple.com/album/street-gospel',
      audiomack: 'https://audiomack.com/kevo-szn/album/street-gospel',
    },
    featured: false,
  },
  {
    id: '6',
    slug: 'midnight-sessions-vol-1',
    title: 'Midnight Sessions Vol. 1',
    artist: 'Luna',
    artistSlug: 'luna',
    type: 'ep',
    releaseDate: '2024-12-01',
    coverArt: 'https://images.unsplash.com/photo-1571266028243-d220c6a9bd3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: "A curated mix capturing the energy of Luna's legendary late-night sets. Features exclusive tracks and remixes from the Culture SZN collective and guest producers from across Africa.",
    streamingLinks: {
      soundcloud: 'https://soundcloud.com/lunaszn/sets/midnight-sessions-vol-1',
    },
    featured: false,
  },
]

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((release) => release.slug === slug)
}

export function getAllReleases(): Release[] {
  return releases
}

export function getFeaturedRelease(): Release | undefined {
  return releases.find((release) => release.featured)
}

export function getRecentReleases(count: number = 5): Release[] {
  return [...releases]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, count)
}

export function getReleasesByArtist(artistSlug: string): Release[] {
  return releases.filter((release) => release.artistSlug === artistSlug)
}
