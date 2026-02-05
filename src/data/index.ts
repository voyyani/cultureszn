export { members, getMemberBySlug, getAllMembers } from './members'
export { releases, getReleaseBySlug, getAllReleases, getFeaturedRelease, getRecentReleases, getReleasesByArtist } from './releases'
export { sznals, getSZNalBySlug, getAllSZNals, getRecentSZNals, getSZNalsByCategory } from './sznals'

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
