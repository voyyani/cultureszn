export interface Release {
  id: string
  slug: string
  title: string
  artist: string
  artistSlug: string
  type: 'single' | 'ep' | 'album' | 'visual-album' | 'instrumental'
  releaseDate: string
  coverArt: string
  description?: string
  tracks?: string[]
  streamingLinks: {
    spotify?: string
    appleMusic?: string
    youtube?: string
    soundcloud?: string
    audiomack?: string
    boomplay?: string
  }
  featured?: boolean
}

export interface SZNal {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  publishedDate: string
  readTime: string
}

export interface NavLink {
  name: string
  href: string
}

export interface SocialLink {
  name: string
  href: string
  icon: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

// Re-export artist types
export type {
  ArtistProfile,
  NormalizedArtist,
  NormalizedRelease,
  NormalizedProject,
  NormalizedCollaboration,
  ArtistIdentity,
  ArtistProfiles,
  ArtistGenres,
  ArtistBio,
  ArtistDiscography,
  ArtistBranding,
  ArtistSEO,
} from './artist'
