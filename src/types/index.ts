export interface Member {
  id: string
  slug: string
  name: string
  role: string
  bio: string
  image: string
  coverImage?: string
  tags: string[]
  social: {
    instagram?: string
    twitter?: string
    spotify?: string
    soundcloud?: string
    youtube?: string
  }
  joinedDate: string
}

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

/**
 * Enriched Release Interface
 * Combines static data with live Spotify metadata
 */
export interface EnrichedRelease {
  // Static data (always present)
  id: string
  slug: string
  artistSlug: string
  artist: string
  type: 'single' | 'ep' | 'album' | 'visual-album' | 'instrumental'
  featured: boolean
  description?: string
  
  // Merged data (Spotify > Static)
  title: string
  coverArt: string
  releaseDate: string
  
  // Spotify-only data (may be null)
  spotifyId?: string
  spotifyUri?: string // For playback
  durationMs?: number
  explicit?: boolean
  popularity?: number
  previewUrl?: string
  availableMarkets?: string[]
  tracks?: string[] // For albums
  
  // Computed metadata
  isPlayable: boolean
  source: 'spotify' | 'static' | 'mixed'
  
  // Streaming links
  streamingLinks: {
    spotify?: string
    appleMusic?: string
    soundcloud?: string
    youtube?: string
    audiomack?: string
    boomplay?: string
  }
}

/**
 * Latest Releases API Response
 */
export interface LatestReleasesResponse {
  success: boolean
  data: EnrichedRelease[]
  cached: boolean
  fallback: boolean
  syncedAt: string // ISO 8601 timestamp
  meta: {
    limit: number
    total: number
    spotifyApiCalled: boolean
    cacheHit: boolean
    responseTime: number // milliseconds
  }
}

/**
 * Cached Releases Data
 */
export interface CachedReleases {
  data: EnrichedRelease[]
  timestamp: Date
  source: 'spotify' | 'cache' | 'fallback'
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

// Re-export XiiX profile types
export type {
  XiiXProfileV2,
  ProfileStats,
  SongV2,
  ProjectV2,
  SongCredits,
} from './xiix-profile'
