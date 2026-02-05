/**
 * Artist Data Loader
 * 
 * Centralized data access layer for artist profiles.
 * Loads from JSON source of truth files and normalizes for UI consumption.
 * 
 * @version 1.0.0
 */

import type {
  ArtistProfile,
  NormalizedArtist,
  NormalizedRelease,
  NormalizedProject,
  NormalizedCollaboration,
} from '@/types/artist'

// Import artist JSON files
import xiixData from './xiix.json'
import wavyProfile from './wavyProfile'
import pipiProfile from './pipiProfile'

/* ============================================
   Artist Registry
   ============================================ */

// Type assertion helper for JSON imports
const artistRegistry: Record<string, ArtistProfile> = {
  xiix: xiixData as unknown as ArtistProfile,
  wavy: wavyProfile,
  pipi: pipiProfile,
}

/* ============================================
   Slug Generation
   ============================================ */

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* ============================================
   Normalization Functions
   ============================================ */

function normalizeRelease(
  highlight: ArtistProfile['discography']['highlights'][0],
  index: number
): NormalizedRelease {
  return {
    id: generateSlug(highlight.title) || `release-${index}`,
    title: highlight.title,
    type: highlight.type,
    releaseDate: highlight.release_date,
    coverArt: highlight.cover_art,
    primaryArtist: highlight.credits.primary_artist,
    featuredArtists: highlight.credits.featured_artists || [],
    links: {
      spotify: highlight.links.spotify_track || highlight.links.spotify_album,
      apple: highlight.links.apple_music,
      soundcloud: highlight.links.soundcloud,
      youtube: highlight.links.youtube,
    },
  }
}

function normalizeProject(
  project: ArtistProfile['discography']['projects'][0],
  index: number
): NormalizedProject {
  return {
    id: generateSlug(project.title) || `project-${index}`,
    title: project.title,
    type: project.type,
    status: project.status,
    releaseDate: project.release_date,
    coverArt: project.cover_art,
    trackCount: project.tracks?.length,
    tracks: project.tracks,
    links: project.links ? {
      spotify: project.links.spotify_album || undefined,
      apple: project.links.apple_music || undefined,
    } : undefined,
  }
}

function normalizeCollaboration(
  collab: ArtistProfile['collaborations'][0]
): NormalizedCollaboration {
  const artists = Array.isArray(collab.with) ? collab.with : [collab.with]
  return {
    artists,
    tracks: collab.evidence,
    isCultureSZN: artists.some(
      (a) => a.toLowerCase().includes('culture') || a.toLowerCase().includes('szn')
    ),
  }
}

function normalizeArtist(profile: ArtistProfile): NormalizedArtist {
  const { identity, profiles, bio, genres, discography, collaborations, branding, seo, affiliations, audit } = profile

  // Build social links object
  const social: NormalizedArtist['social'] = {}
  if (profiles.spotify?.url) social.spotify = profiles.spotify.url
  if (profiles.apple_music?.url) social.apple = profiles.apple_music.url
  if (profiles.soundcloud?.url) social.soundcloud = profiles.soundcloud.url
  if (profiles.youtube?.url) social.youtube = profiles.youtube.url
  if (profiles.instagram?.url) social.instagram = profiles.instagram.url
  if (profiles.twitter?.url) social.twitter = profiles.twitter.url
  if (profiles.tiktok?.url) social.tiktok = profiles.tiktok.url

  // Build platform IDs
  const platformIds: NormalizedArtist['platformIds'] = {}
  if (profiles.spotify?.artist_id) platformIds.spotifyArtistId = profiles.spotify.artist_id
  if (profiles.apple_music?.artist_id) platformIds.appleMusicArtistId = profiles.apple_music.artist_id

  // Determine primary role from genres
  const baseRole = genres.primary[0] || 'Artist'
  const role = /artist|creator/i.test(baseRole) ? baseRole : `${baseRole} Artist`

  return {
    // Core identity
    slug: branding.primary_slug,
    name: identity.display_name,
    stylization: identity.stylization,
    pronunciation: branding.display_pronunciation,
    aliases: identity.also_known_as || [],

    // Location
    location: identity.base_location.name,
    country: identity.country,

    // Media (use from branding if available, otherwise placeholder)
    image: branding.image || `/images/artists/${branding.primary_slug}.jpg`,
    coverImage: branding.cover_image || `/images/artists/${branding.primary_slug}-cover.jpg`,

    // Bio
    shortBio: bio.short,
    longBio: bio.long,

    // Classification
    role,
    genres: [...genres.primary, ...genres.secondary],
    tags: genres.tags,

    // Social
    social,
    platformIds,

    // Discography
    releases: discography.highlights.map(normalizeRelease),
    projects: discography.projects.map(normalizeProject),

    // Collaborations
    collaborations: collaborations.map(normalizeCollaboration),

    // Affiliations
    affiliations: affiliations.map((a) => a.name),

    // SEO
    seo: {
      title: seo.title,
      description: seo.meta_description,
    },

    // Meta
    lastUpdated: audit.last_updated,
    isVerified: audit.verified_fields_by_owner.length > 0,
  }
}

/* ============================================
   Public API
   ============================================ */

/**
 * Get all available artist slugs
 */
export function getArtistSlugs(): string[] {
  return Object.keys(artistRegistry)
}

/**
 * Check if an artist exists by slug
 */
export function artistExists(slug: string): boolean {
  return slug in artistRegistry
}

/**
 * Get raw artist profile data by slug
 */
export function getArtistProfileRaw(slug: string): ArtistProfile | null {
  return artistRegistry[slug] || null
}

/**
 * Get normalized artist data by slug (for UI consumption)
 */
export function getArtistProfile(slug: string): NormalizedArtist | null {
  const profile = artistRegistry[slug]
  if (!profile) return null
  return normalizeArtist(profile)
}

/**
 * Get all artists (normalized)
 */
export function getAllArtists(): NormalizedArtist[] {
  return Object.values(artistRegistry).map(normalizeArtist)
}

/**
 * Search artists by name or alias
 */
export function searchArtists(query: string): NormalizedArtist[] {
  const normalizedQuery = query.toLowerCase()
  return getAllArtists().filter((artist) => {
    const matchesName = artist.name.toLowerCase().includes(normalizedQuery)
    const matchesAlias = artist.aliases.some((alias) =>
      alias.toLowerCase().includes(normalizedQuery)
    )
    return matchesName || matchesAlias
  })
}

/**
 * Get artist's platform embed data for Spotify
 */
export function getSpotifyEmbedId(slug: string): string | null {
  const artist = getArtistProfile(slug)
  return artist?.platformIds.spotifyArtistId || null
}

/**
 * Get artist's streaming links for quick access bar
 */
export function getStreamingLinks(slug: string): { platform: string; url: string; label: string }[] {
  const artist = getArtistProfile(slug)
  if (!artist) return []

  const links: { platform: string; url: string; label: string }[] = []

  if (artist.social.spotify) {
    links.push({ platform: 'spotify', url: artist.social.spotify, label: 'Spotify' })
  }
  if (artist.social.apple) {
    links.push({ platform: 'apple', url: artist.social.apple, label: 'Apple Music' })
  }
  if (artist.social.soundcloud) {
    links.push({ platform: 'soundcloud', url: artist.social.soundcloud, label: 'SoundCloud' })
  }
  if (artist.social.youtube) {
    links.push({ platform: 'youtube', url: artist.social.youtube, label: 'YouTube' })
  }

  return links
}

/**
 * Validate artist data integrity
 */
export function validateArtistProfile(slug: string): { valid: boolean; errors: string[] } {
  const profile = artistRegistry[slug]
  const errors: string[] = []

  if (!profile) {
    return { valid: false, errors: ['Artist not found'] }
  }

  // Required fields validation
  if (!profile.identity?.display_name) errors.push('Missing display_name')
  if (!profile.branding?.primary_slug) errors.push('Missing primary_slug')
  if (!profile.bio?.short) errors.push('Missing short bio')
  if (!profile.profiles) errors.push('Missing profiles')
  if (!profile.seo?.title) errors.push('Missing SEO title')

  // Disambiguation check
  if (profile.identity.disambiguation?.not_the_same_as?.length) {
    // Log disambiguation for awareness
    console.info(
      `[Artist ${slug}] Disambiguation active:`,
      profile.identity.disambiguation.not_the_same_as.map((d) => d.name).join(', ')
    )
  }

  return { valid: errors.length === 0, errors }
}

// Export types for consumers
export type { ArtistProfile, NormalizedArtist, NormalizedRelease, NormalizedProject }
