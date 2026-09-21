export { releases } from './releases'
export { getAllReleases, getReleaseBySlug, getFeaturedRelease, getRecentReleases, getReleasesByArtist, getPlaylists } from '@/lib/catalog'
export { getAllSZNals, getDraftSZNals, getSZNalBySlug } from '@/content/sznals'

// Artist profile system (JSON-driven source of truth; full profiles load on demand)
export { getAllArtists, getArtistSummary, getArtistSlugs, artistExists, findArtistByName, getArtistProfileAsync } from './artists'

export type { ArtistProfile, ArtistSummary, NormalizedArtist, NormalizedRelease, NormalizedProject } from './artists'
