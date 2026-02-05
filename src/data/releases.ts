import type { Release } from '@/types'

export const releases: Release[] = [
  // SIXXTAPE - Featured Album
  {
    id: 'sixxtape',
    slug: 'sixxtape',
    title: 'SIXXTAPE',
    artist: 'XiiX',
    artistSlug: 'xiix',
    type: 'album',
    releaseDate: '2025-05-29',
    coverArt: 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770294878/SaveClip.App_324837469_1204419686827882_3608251730568902880_n_uwulvm.jpg',
    description: "XiiX's second studio album featuring 7 tracks of raw, poetic rap. A journey through introspection, faith, and the Nairobi hustle. Includes collaborations with Culture Szn, Wavy SRF, Sire, Wakanema, and LA 7AY.",
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L',
      appleMusic: 'https://music.apple.com/us/album/sixxtape/1817687168',
    },
    featured: true,
  },
  // XiiX Latest Singles
  {
    id: 'okay',
    slug: 'okay',
    title: 'OKAY (feat. Uncle Sliqè)',
    artist: 'XiiX',
    artistSlug: 'xiix',
    type: 'single',
    releaseDate: '2026-01-09',
    coverArt: 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770296050/SaveClip.App_618534492_18106822660673313_4488624986590919646_n_s4t6zp.jpg',
    description: "XiiX teams up with Uncle Sliqè for this introspective track about resilience and self-acceptance.",
    streamingLinks: {
      youtube: 'https://www.youtube.com/watch?v=JhOVIyWeqLM',
    },
    featured: false,
  },
  {
    id: 'unforgettable',
    slug: 'unforgettable',
    title: 'UNFORGETTABLE',
    artist: 'XiiX',
    artistSlug: 'xiix',
    type: 'single',
    releaseDate: '2026-01-09',
    coverArt: 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770295415/SaveClip.App_588181846_18102610495673313_1503356049576872472_n_btwvlw.jpg',
    description: "A melodic reflection on moments and memories that stay with us forever.",
    streamingLinks: {},
    featured: false,
  },
  {
    id: '6-again',
    slug: '6-again',
    title: '6 AGAIN',
    artist: 'XiiX',
    artistSlug: 'xiix',
    type: 'single',
    releaseDate: '2025-11-14',
    coverArt: 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770287296/SaveClip.App_621681944_18107153134673313_6513464581845031078_n_qdthcw.jpg',
    description: "XiiX reflects on cycles, growth, and returning to familiar places with new perspective. Produced by Zare.",
    streamingLinks: {},
    featured: false,
  },
  // Legacy releases kept for other artists
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
