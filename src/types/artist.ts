/**
 * Artist Profile Type Definitions
 * 
 * Comprehensive TypeScript interfaces for Culture SZN artist profiles.
 * Source of truth: JSON files in /src/data/artists/
 * 
 * @version 1.0.0
 * @author Culture SZN
 */

/* ============================================
   Source of Truth Policy
   ============================================ */

export interface SourceOfTruthPolicy {
  canonical_id_priority: string[]
  notes: string[]
}

/* ============================================
   Identity & Location
   ============================================ */

export interface Location {
  name: string
  country: string
}

export interface DisambiguationEntry {
  name: string
  country: string
  note: string
}

export interface Disambiguation {
  not_the_same_as: DisambiguationEntry[]
}

export interface ArtistIdentity {
  display_name: string
  stylization: string
  country: string
  base_location: Location
  also_known_as: string[]
  disambiguation?: Disambiguation
}

/* ============================================
   Platform Profiles
   ============================================ */

export interface SpotifyProfile {
  artist_id: string
  url: string
}

export interface AppleMusicProfile {
  artist_id: string
  url: string
}

export interface SoundCloudProfile {
  handle: string
  url: string
}

export interface YouTubeProfile {
  handle: string
  url: string
}

export interface InstagramProfile {
  handle: string
  url: string
}

export interface TwitterProfile {
  handle: string
  url: string
}

export interface TikTokProfile {
  handle: string
  url: string
}

export interface ArtistProfiles {
  spotify?: SpotifyProfile
  apple_music?: AppleMusicProfile
  soundcloud?: SoundCloudProfile
  youtube?: YouTubeProfile
  instagram?: InstagramProfile
  twitter?: TwitterProfile
  tiktok?: TikTokProfile
}

/* ============================================
   Affiliations
   ============================================ */

export type AffiliationType = 'collective' | 'label' | 'management' | 'publisher'
export type AffiliationRelationship = 'member' | 'collaborator' | 'signed' | 'affiliated'

export interface Affiliation {
  name: string
  type: AffiliationType
  relationship: AffiliationRelationship
}

/* ============================================
   Genres & Tags
   ============================================ */

export interface ArtistGenres {
  primary: string[]
  secondary: string[]
  tags: string[]
}

/* ============================================
   Bio
   ============================================ */

export interface ArtistBio {
  short: string
  long: string
}

/* ============================================
   Discography
   ============================================ */

export type ReleaseType = 'single' | 'ep' | 'album' | 'mixtape' | 'project' | 'feature'
export type ReleaseStatus = 'released' | 'upcoming' | 'listed_on_platforms'

export interface ReleaseCredits {
  primary_artist: string
  featured_artists?: string[]
  producers?: string[]
  writers?: string[]
}

export interface ReleaseLinks {
  spotify_track?: string
  spotify_album?: string
  apple_music?: string
  soundcloud?: string
  youtube?: string
  audiomack?: string
  bandcamp?: string
}

export interface DiscographyHighlight {
  title: string
  type: ReleaseType
  release_date: string
  cover_art?: string
  credits: ReleaseCredits
  links: ReleaseLinks
}

export interface DiscographyProject {
  title: string
  type: ReleaseType
  status: ReleaseStatus
  release_date?: string
  cover_art?: string
  tracks?: string[]
  notes?: string[]
  links?: {
    spotify_album?: string | null
    apple_music?: string | null
  }
}

export interface ArtistDiscography {
  highlights: DiscographyHighlight[]
  projects: DiscographyProject[]
}

/* ============================================
   Collaborations
   ============================================ */

export interface Collaboration {
  with: string | string[]
  evidence: string[]
}

/* ============================================
   Branding
   ============================================ */

export interface ImageRequirements {
  recommended_aspect_ratio: string
  min_resolution_px: [number, number]
  safe_zone_notes?: string
}

export interface ArtistBranding {
  cover_image: string
  image: string
  primary_slug: string
  display_pronunciation?: string
  accent_color?: string
  image_requirements?: {
    hero?: ImageRequirements
    thumbnail?: ImageRequirements
  }
}

/* ============================================
   SEO
   ============================================ */

export interface ArtistSEO {
  title: string
  meta_description: string
  keywords?: string[]
  og_image?: string
}

/* ============================================
   Audit
   ============================================ */

export interface ArtistAudit {
  verified_fields_by_owner: string[]
  last_updated: string
  maintainer: string
}

/* ============================================
   Main Artist Profile Interface
   ============================================ */

export interface ArtistProfile {
  schema_version: string
  entity_type: 'music_artist'
  source_of_truth_policy: SourceOfTruthPolicy
  identity: ArtistIdentity
  profiles: ArtistProfiles
  affiliations: Affiliation[]
  genres: ArtistGenres
  bio: ArtistBio
  discography: ArtistDiscography
  collaborations: Collaboration[]
  branding: ArtistBranding
  seo: ArtistSEO
  audit: ArtistAudit
}

/* ============================================
   Normalized Artist (for UI consumption)
   ============================================ */

export interface NormalizedArtist {
  // Core identity
  slug: string
  name: string
  stylization: string
  pronunciation?: string
  aliases: string[]
  
  // Location
  location: string
  country: string
  
  // Media
  image: string
  coverImage?: string
  
  // Bio
  shortBio: string
  longBio: string
  
  // Classification
  role: string
  genres: string[]
  tags: string[]
  
  // Social links (normalized for SocialLinks component)
  social: {
    spotify?: string
    apple?: string
    soundcloud?: string
    youtube?: string
    instagram?: string
    twitter?: string
    tiktok?: string
  }
  
  // Platform IDs (for embeds & API calls)
  platformIds: {
    spotifyArtistId?: string
    appleMusicArtistId?: string
  }
  
  // Discography
  releases: NormalizedRelease[]
  projects: NormalizedProject[]
  
  // Collaborations
  collaborations: NormalizedCollaboration[]
  
  // Affiliations
  affiliations: string[]
  
  // SEO
  seo: {
    title: string
    description: string
  }
  
  // Meta
  lastUpdated: string
  isVerified: boolean
}

export interface NormalizedRelease {
  id: string
  title: string
  type: ReleaseType
  releaseDate: string
  coverArt?: string
  primaryArtist: string
  featuredArtists: string[]
  fromAlbum?: string  // Album name if this is an album track
  links: {
    spotify?: string
    apple?: string
    soundcloud?: string
    youtube?: string
  }
}

export interface NormalizedProject {
  id: string
  title: string
  type: ReleaseType
  status: ReleaseStatus
  releaseDate?: string
  coverArt?: string
  trackCount?: number
  tracks?: string[]  // Track titles in order
  links?: {
    spotify?: string
    apple?: string
    soundcloud?: string
  }
}

export interface NormalizedCollaboration {
  artists: string[]
  tracks: string[]
  isCultureSZN: boolean
}
