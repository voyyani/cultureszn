export { releases } from './releases'
export { getAllReleases, getReleaseBySlug, getFeaturedRelease, getRecentReleases, getReleasesByArtist, getPlaylists } from '@/lib/catalog'
export { getAllSZNals, getDraftSZNals, getSZNalBySlug } from '@/content/sznals'

// Artist profile system (JSON-driven source of truth)
export {
  getArtistProfile,
  getArtistProfileRaw,
  getAllArtists,
  getArtistSlugs,
  artistExists,
  searchArtists,
  getSpotifyEmbedId,
  getStreamingLinks,
  validateArtistProfile,
} from './artists'

export type { ArtistProfile, NormalizedArtist, NormalizedRelease, NormalizedProject } from './artists'
