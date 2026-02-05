import type { ArtistProfile, Collaboration, DiscographyHighlight } from '@/types/artist'
import pipiSource from './pipi.json'

interface PipiIdentityVariant {
  name?: string | null
}

interface PipiVerifiedTrack {
  title?: string
  role?: string
  primary_artist?: string
  credited_as?: string[]
  credited_artists?: string[]
  duration?: string
  release_year?: number
  release_date?: string
  cover_art?: string
  links?: {
    soundcloud?: string
    apple_music?: string
    youtube?: string
  }
}

interface PipiProfileSource {
  schema_version?: string
  generated_at?: string
  identity?: {
    display_name?: string
    slug?: string
    name_variants?: PipiIdentityVariant[]
    origin?: { place?: string; country?: string }
    primary_roles?: string[]
    role_labels_for_ui?: { primary?: string; secondary?: string[] }
  }
  positioning?: {
    one_liner?: string
    elevator_pitch?: string
    keywords?: string[]
  }
  bios?: {
    short?: string
    website?: string
  }
  disciplines?: {
    fashion?: {
      design_signature?: string[]
    }
    music?: {
      primary_genres?: Array<{ name?: string }>
      verified_tracks?: PipiVerifiedTrack[]
      platform_profiles?: {
        apple_music?: { artist_url?: string }
        soundcloud?: { artist_tracks_url?: string }
      }
    }
  }
  culture_szn_relationship?: {
    summary?: string
    related_entities?: Array<{ name?: string }>
  }
  links?: {
    profiles?: {
      apple_music_artist?: string
      soundcloud_artist_tracks?: string
    }
  }
  seo?: {
    title?: string
    meta_description?: string
  }
  media_assets?: {
    hero_image?: {
      url?: string | null
      alt?: string | null
    }
  }
}

const pipiData = pipiSource as PipiProfileSource

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function parseAppleMusicArtistId(url?: string | null): string | null {
  if (!url) return null
  const cleaned = url.split('?')[0].replace(/\/$/, '')
  const match = cleaned.match(/\/artist\/[^/]+\/(\d+)$/)
  if (match) return match[1]
  const fallback = cleaned.split('/').pop()
  return fallback || null
}

function uniqueList(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>()
  return values
    .map((value) => (value ? value.trim() : ''))
    .filter(Boolean)
    .filter((value) => {
      const normalized = value.toLowerCase()
      if (seen.has(normalized)) return false
      seen.add(normalized)
      return true
    })
}

function buildFeatureTitle(title: string, credited: string[], fallbackName: string): string {
  if (title.toLowerCase().includes('feat.')) return title
  if (credited.length > 0) {
    return `${title} (feat. ${credited.join(', ')})`
  }
  return `${title} (feat. ${fallbackName})`
}

const displayName = pipiData.identity?.display_name || 'Pipi Ciagi'
const originPlace = pipiData.identity?.origin?.place || 'Sabaki'
const originCountry = pipiData.identity?.origin?.country || 'Kenya'

const nameVariants = uniqueList([
  displayName,
  ...(pipiData.identity?.name_variants || []).map((variant) => variant.name || ''),
])
const normalizedVariants = new Set(nameVariants.map(normalizeName))
const isPipiName = (value: string) => normalizedVariants.has(normalizeName(value))

const appleMusicUrl =
  pipiData.links?.profiles?.apple_music_artist ||
  pipiData.disciplines?.music?.platform_profiles?.apple_music?.artist_url
const soundcloudUrl =
  pipiData.links?.profiles?.soundcloud_artist_tracks ||
  pipiData.disciplines?.music?.platform_profiles?.soundcloud?.artist_tracks_url

const appleMusicId = parseAppleMusicArtistId(appleMusicUrl || null)

const roleLabelPrimary = pipiData.identity?.role_labels_for_ui?.primary
const musicGenres = uniqueList(
  (pipiData.disciplines?.music?.primary_genres || []).map((genre) => genre.name || '')
)
const secondaryGenres = uniqueList(pipiData.identity?.role_labels_for_ui?.secondary || [])
const primaryGenres = uniqueList(
  roleLabelPrimary ? [roleLabelPrimary] : musicGenres.length > 0 ? musicGenres : ['Multidisciplinary Creator']
)
const secondaryTags = uniqueList([
  ...secondaryGenres,
  ...(pipiData.identity?.primary_roles || []),
  ...(pipiData.disciplines?.fashion?.design_signature || []).slice(0, 4),
  ...musicGenres,
  ...(pipiData.positioning?.keywords || []).slice(0, 6),
])

const tags = uniqueList([...primaryGenres, ...secondaryTags]).slice(0, 9)

const verifiedTracks = pipiData.disciplines?.music?.verified_tracks || []
const highlights: DiscographyHighlight[] = verifiedTracks
  .map((track, index) => {
    const title = track.title
    if (!title) return null

    const credited = uniqueList([...(track.credited_artists || []), ...(track.credited_as || [])])
    const creditedWithoutPipi = credited.filter((artist) => !isPipiName(artist))
    const creditedForTitle = creditedWithoutPipi.length > 0 ? creditedWithoutPipi : [displayName]
    const releaseDate = track.release_date || (track.release_year ? `${track.release_year}-01-01` : null)
    if (!releaseDate) return null

    return {
      title: buildFeatureTitle(title, creditedForTitle, displayName),
      type: 'single',
      release_date: releaseDate,
      cover_art: track.cover_art || undefined,
      credits: {
        primary_artist: track.primary_artist || 'Culture SZN',
        ...(creditedWithoutPipi.length > 0 ? { featured_artists: creditedWithoutPipi } : {}),
      },
      links: {
        soundcloud: track.links?.soundcloud,
        apple_music: track.links?.apple_music,
        youtube: track.links?.youtube,
      },
    }
  })
  .filter((item): item is DiscographyHighlight => Boolean(item))

const collaborations: Collaboration[] = uniqueList(
  (pipiData.culture_szn_relationship?.related_entities || []).map((entity) => entity.name || '')
).map((entity) => ({
  with: entity,
  evidence: highlights.slice(0, 2).map((track) => track.title),
}))

const pipiProfile: ArtistProfile = {
  schema_version: pipiData.schema_version || '2.0.0',
  entity_type: 'music_artist',
  source_of_truth_policy: {
    canonical_id_priority: ['apple_music_artist_id'],
    notes: [pipiData.positioning?.one_liner || 'Profile derived from Culture SZN creator dossier.'],
  },
  identity: {
    display_name: displayName,
    stylization: displayName,
    country: originCountry,
    base_location: {
      name: originPlace,
      country: originCountry,
    },
    also_known_as: nameVariants.filter((variant) => variant !== displayName),
  },
  profiles: {
    ...(appleMusicUrl && appleMusicId ? { apple_music: { artist_id: appleMusicId, url: appleMusicUrl } } : {}),
    ...(soundcloudUrl ? { soundcloud: { handle: 'pipi_ciagi', url: soundcloudUrl } } : {}),
  },
  affiliations: [
    {
      name: 'Culture SZN',
      type: 'collective',
      relationship: 'collaborator',
    },
  ],
  genres: {
    primary: primaryGenres.length > 0 ? primaryGenres : ['Multidisciplinary Creator'],
    secondary: secondaryGenres,
    tags,
  },
  bio: {
    short: pipiData.bios?.short || pipiData.positioning?.one_liner || displayName,
    long: pipiData.bios?.website || pipiData.positioning?.elevator_pitch || displayName,
  },
  discography: {
    highlights,
    projects: [],
  },
  collaborations,
  branding: {
    primary_slug: 'pipi',
    image: pipiData.media_assets?.hero_image?.url || undefined,
    cover_image: pipiData.media_assets?.hero_image?.url || undefined,
  },
  seo: {
    title: pipiData.seo?.title || `${displayName} | Culture SZN`,
    meta_description: pipiData.seo?.meta_description || pipiData.positioning?.one_liner || displayName,
  },
  audit: {
    verified_fields_by_owner: [],
    last_updated: pipiData.generated_at || '2026-02-05',
    maintainer: 'Culture SZN',
  },
}

export default pipiProfile
