export interface ReleaseTrack { name: string; durationMs?: number; artists?: string[] }

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
  tracks?: ReleaseTrack[]
  streamingLinks: { spotify?: string; appleMusic?: string; youtube?: string; soundcloud?: string; audiomack?: string; boomplay?: string }
  featured?: boolean
  spotifyAlbumId?: string
  source: 'static' | 'catalog' | 'merged'
}


// Re-export artist types
export type {
  ArtistProfile,
  NormalizedArtist,
  ArtistSummary,
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
