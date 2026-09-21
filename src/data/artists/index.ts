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
  ArtistSummary,
  NormalizedArtist,
  NormalizedRelease,
  NormalizedProject,
  NormalizedCollaboration,
} from '@/types/artist'
import { ARTIST_SUMMARIES } from './summaries'

/* ============================================
   Artist Registry — full profiles load on demand, one chunk per artist
   ============================================ */

const loaders: Record<string, () => Promise<ArtistProfile>> = {
  xiix: () => import('./xiix.json').then((m) => m.default as unknown as ArtistProfile),
  wavy: () => import('./wavyProfile').then((m) => m.default),
  pipi: () => import('./pipiProfile').then((m) => m.default),
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

/** Every artist slug, in roster order. */
export function getArtistSlugs(): string[] {
  return ARTIST_SUMMARIES.map((a) => a.slug)
}

export function artistExists(slug: string): boolean {
  return slug in loaders
}

/** The lightweight index: what Home, the Artists page, cards and share previews read. */
export function getAllArtists(): ArtistSummary[] {
  return ARTIST_SUMMARIES
}

export function getArtistSummary(slug: string): ArtistSummary | undefined {
  return ARTIST_SUMMARIES.find((a) => a.slug === slug)
}

/** Find the on-site artist a collaborator name refers to, if any (case-insensitive). */
export function findArtistByName(name: string): ArtistSummary | undefined {
  const n = name.trim().toLowerCase()
  return ARTIST_SUMMARIES.find((a) => a.name.toLowerCase() === n)
}

/** Full normalized profile; resolves null for an unknown slug. */
export async function getArtistProfileAsync(slug: string): Promise<NormalizedArtist | null> {
  const load = loaders[slug]
  if (!load) return null
  return normalizeArtist(await load())
}

/** Normalize a raw profile (exported for the summaries consistency test). */
export { normalizeArtist }

// Export types for consumers
export type { ArtistProfile, ArtistSummary, NormalizedArtist, NormalizedRelease, NormalizedProject }
