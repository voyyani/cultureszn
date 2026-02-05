/**
 * XiiX Enhanced Profile Types
 * 
 * TypeScript interfaces for the comprehensive xiix2.json data structure.
 * Features deep credit attribution, release tracking, and verification status.
 * 
 * @version 2.0.0
 * @author Culture SZN
 */

/* ============================================
   Meta & Methodology
   ============================================ */

export interface ProfileMeta {
  version: string
  generatedAt: string
  methodology: {
    sourcePriority: string[]
    dataIntegrity: string[]
  }
}

/* ============================================
   Artist Identity
   ============================================ */

export interface VerificationInfo {
  status: string
  source?: string
  note?: string
}

export interface TaglineField {
  value: string
  verification: VerificationInfo
}

export interface HomeBaseField {
  city: string
  country: string
  verification: VerificationInfo
}

export interface ProbableRightsNameField {
  value: string
  verification: VerificationInfo
}

export interface ArtistIdentityV2 {
  stageName: string
  creditedNameVariants: string[]
  homeBase: HomeBaseField | string
  tagline: TaglineField | string
  probableRightsNameFromCredits: ProbableRightsNameField | string
}

/* ============================================
   Biography
   ============================================ */

export interface CareerMilestone {
  date: string
  title: string
  verification: {
    status: 'verified_release' | 'unverified' | 'partial'
    source: string
  }
}

export interface BiographyV2 {
  shortBio: string
  longBio: string | null
  careerMilestones: CareerMilestone[]
}

/* ============================================
   Culture SZN Affiliation
   ============================================ */

export interface CultureSznAffiliation {
  affiliationConfidence: 'high' | 'medium' | 'low'
  basis: string[]
}

/* ============================================
   Discography
   ============================================ */

export interface ProjectV2 {
  title: string
  type: 'ep' | 'album' | 'mixtape'
  releaseDate: string
  trackCount: number
  label: string
  status: 'released' | 'upcoming'
  links: {
    qobuz?: string
    appleMusic?: string
    spotify?: string
    soundcloud?: string
  }
}

export interface SongCredits {
  writers: string[]
  producers: string[]
  beatMakers: string[]
  engineers: string[]
  executiveProducers: string[]
  rawCreditLine?: string
  status?: string
  note?: string
}

export interface SongLinks {
  qobuz?: string | null
  appleMusic?: string | null
  spotify?: string | null
  soundcloud?: string | null
  youtube?: string | null
  qobuzDiscographyListing?: string
}

export interface SongV2 {
  title: string
  canonicalReleaseDate: string
  length: string | null
  label: string
  designation: ('single' | 'album_track' | 'single_listing')[]
  projects: string[]
  featuredArtists: string[]
  credits: SongCredits
  links: SongLinks
}

export interface SoundCloudOnlyTrack {
  title: string
  publishedAt: string
  length: string | null
  status: string
  soundcloudProfileEvidence?: string
  notes?: string[]
  links?: {
    soundcloud?: string
    appleMusicArtistPage?: string
  }
}

export interface DiscographyV2 {
  projects: ProjectV2[]
  songs: SongV2[]
  soundcloudOnlyNotVerifiedOnDSPs: SoundCloudOnlyTrack[]
}

/* ============================================
   Collaborations
   ============================================ */

export interface FeaturedOnTrack {
  title: string
  primaryArtist: string
  releaseDate: string
  verification: {
    status: string
    note?: string
  }
  links: Record<string, string>
}

export interface CollaborationsV2 {
  asFeaturedArtist: FeaturedOnTrack[]
}

/* ============================================
   Quick Reference
   ============================================ */

export interface SongTableEntry {
  title: string
  length: string | null
  releaseDate: string
  primaryLink: string
}

export interface ReleaseTimelineEntry {
  date: string
  title: string
}

export interface ChartDataEntry {
  year: number
  count: number
}

export interface QuickReference {
  songTable: SongTableEntry[]
  releaseTimeline: ReleaseTimelineEntry[]
  chartData: {
    songsPerYearVerifiedInDSPMetadata: ChartDataEntry[]
    asciiBar: string[]
  }
}

/* ============================================
   External Links
   ============================================ */

export interface ExternalLinksV2 {
  appleMusicArtistPage: string
  qobuzArtistPage: string
  soundcloudArtistPage: string
  spotifyKnownAlbumLink: string
  verification: Record<string, string>
}

/* ============================================
   Sources
   ============================================ */

export interface Source {
  id: string
  type: string
  url: string
  accessedAtLocalDate: string
}

/* ============================================
   Full Profile
   ============================================ */

export interface XiiXProfileV2 {
  meta: ProfileMeta
  artist: ArtistIdentityV2
  biography: BiographyV2
  cultureSzn: CultureSznAffiliation
  discography: DiscographyV2
  collaborations: CollaborationsV2
  livePerformances: {
    items: unknown[]
    status: string
    todo: string[]
  }
  awardsAndNominations: {
    items: unknown[]
    status: string
    todo: string[]
  }
  pressAndMedia: {
    interviews: unknown[]
    pressArticles: unknown[]
    status: string
    todo: string[]
  }
  externalLinks: ExternalLinksV2
  quickReference: QuickReference
  sources: Source[]
}

/* ============================================
   Computed Stats
   ============================================ */

export interface ProfileStats {
  totalTracks: number
  totalProjects: number
  totalCollaborators: number
  yearsActive: number
  latestRelease: string
  topProducers: string[]
  topCollaborators: string[]
  tracksPerYear: { year: number; count: number }[]
}
