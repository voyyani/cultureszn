import type { ArtistProfile, Collaboration, DiscographyHighlight } from '@/types/artist'
import wavySource from './wavy.json'

interface WavyTrack {
  title?: string
  display_title?: string
  primary_artist?: string
  featured_artists?: string[]
  release?: {
    release_date?: { value?: string | null }
    release_year?: { value?: number | null }
    release_type?: { value?: string | null }
  }
  credits?: {
    producers?: { value?: string[] }
    beat_makers?: { value?: string[] }
    writers?: { value?: string[] }
  }
  platforms?: {
    spotify?: { url?: string | null }
    apple_music?: { url?: string | null }
    soundcloud?: { url?: string | null }
    youtube?: { url?: string | null }
  }
}

interface WavyProfileSource {
  schema?: {
    version?: string
    generated_at?: string
    purpose?: string
  }
  embedded_report?: {
    executive_summary?: string
  }
  artist?: {
    name?: string
    known_aliases?: Array<{ name?: string | null }>
    biography?: {
      summary?: { value?: string | null }
      nationality?: { value?: string | null }
      hometown?: { value?: string | null }
      place_of_birth?: { value?: string | null }
      genres?: { value?: string[] | null }
    }
    verified_source_pages?: {
      apple_music_artist?: { url?: string | null }
      spotify_artist?: { url?: string | null }
    }
  }
  culture_szn_affiliation?: {
    collective_name?: string
  }
  tracks?: WavyTrack[]
  media_assets?: {
    hero_image?: {
      url?: string | null
      alt?: string | null
    }
  }
}

const wavyData = wavySource as WavyProfileSource

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/)
  return match ? match[0].trim() : text.trim()
}

function parseSpotifyArtistId(url?: string | null): string | null {
  if (!url) return null
  const match = url.match(/artist\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

function parseAppleMusicArtistId(url?: string | null): string | null {
  if (!url) return null
  const cleaned = url.split('?')[0].replace(/\/$/, '')
  const match = cleaned.match(/\/artist\/[^/]+\/(\d+)$/)
  if (match) return match[1]
  const fallback = cleaned.split('/').pop()
  return fallback || null
}

function normalizeReleaseType(value?: string | null, isPrimaryArtist?: boolean): DiscographyHighlight['type'] {
  if (!value) return isPrimaryArtist ? 'single' : 'feature'
  const normalized = value.toLowerCase()
  if (normalized.includes('single')) return 'single'
  if (normalized.includes('ep')) return 'ep'
  if (normalized.includes('album')) return 'album'
  if (normalized.includes('mixtape')) return 'mixtape'
  if (normalized.includes('project')) return 'project'
  return isPrimaryArtist ? 'single' : 'feature'
}

function buildHighlights(tracks: WavyTrack[], isWavyName: (name: string) => boolean, fallbackArtist: string): DiscographyHighlight[] {
  return tracks
    .map((track) => {
      const releaseDate = track.release?.release_date?.value
      if (!releaseDate || !releaseDate.includes('-')) return null

      const title = track.display_title || track.title
      if (!title) return null

      const featuredArtists = (track.featured_artists || []).filter((artist) => !isWavyName(artist))
      const producers = [
        ...(track.credits?.producers?.value || []),
        ...(track.credits?.beat_makers?.value || []),
      ].filter(Boolean)
      const writers = [...(track.credits?.writers?.value || [])].filter(Boolean)

      const primaryArtist = track.primary_artist || fallbackArtist
      const isPrimaryArtist = isWavyName(primaryArtist)

      const links = {
        spotify_track: track.platforms?.spotify?.url || undefined,
        apple_music: track.platforms?.apple_music?.url || undefined,
        soundcloud: track.platforms?.soundcloud?.url || undefined,
        youtube: track.platforms?.youtube?.url || undefined,
      }

      const credits: DiscographyHighlight['credits'] = {
        primary_artist: primaryArtist,
      }

      if (featuredArtists.length > 0) credits.featured_artists = featuredArtists
      if (producers.length > 0) credits.producers = producers
      if (writers.length > 0) credits.writers = writers

      return {
        title,
        type: normalizeReleaseType(track.release?.release_type?.value, isPrimaryArtist),
        release_date: releaseDate,
        credits,
        links,
      }
    })
    .filter((item): item is DiscographyHighlight => Boolean(item))
}

function buildCollaborations(tracks: WavyTrack[], isWavyName: (name: string) => boolean): Collaboration[] {
  const collabMap = new Map<string, Set<string>>()

  tracks.forEach((track) => {
    const title = track.display_title || track.title
    if (!title) return

    const collaborators = new Set<string>()
    if (track.primary_artist && !isWavyName(track.primary_artist)) {
      collaborators.add(track.primary_artist)
    }
    ;(track.featured_artists || []).forEach((artist) => {
      if (artist && !isWavyName(artist)) {
        collaborators.add(artist)
      }
    })

    collaborators.forEach((artist) => {
      const existing = collabMap.get(artist) || new Set<string>()
      existing.add(title)
      collabMap.set(artist, existing)
    })
  })

  return Array.from(collabMap.entries())
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 8)
    .map(([artist, titles]) => ({
      with: artist,
      evidence: Array.from(titles).slice(0, 3),
    }))
}

const name = wavyData.artist?.name || 'Wavy Srf'
const aliasNames = (wavyData.artist?.known_aliases || [])
  .map((alias) => alias.name)
  .filter((alias): alias is string => Boolean(alias))

const nameVariants = new Set([name, ...aliasNames, 'Wavy'])
const normalizedVariants = new Set(Array.from(nameVariants).map(normalizeName))

const isWavyName = (value: string) => normalizedVariants.has(normalizeName(value))

const wavySpotlightBio =
  "Wavy Srf moves through Culture SZN like a signature: a featured voice and writer threading the XiiX-era releases. " +
  'From "YOU WANT IT" to "GAS N GO," the credits keep returning to Marcel Adala Owen - proof of a collaborator who shapes the catalog’s pulse.'

const shortBio = firstSentence(wavySpotlightBio)
const longBio = wavySpotlightBio

const appleUrl = wavyData.artist?.verified_source_pages?.apple_music_artist?.url || undefined
const spotifyUrl = wavyData.artist?.verified_source_pages?.spotify_artist?.url || undefined

const appleId = parseAppleMusicArtistId(appleUrl)
const spotifyId = parseSpotifyArtistId(spotifyUrl)

const country = wavyData.artist?.biography?.nationality?.value || 'Unknown'
const locationName =
  wavyData.artist?.biography?.hometown?.value ||
  wavyData.artist?.biography?.place_of_birth?.value ||
  country

const genres = wavyData.artist?.biography?.genres?.value || []
const primaryGenres = genres.length > 0 ? genres : ['Hip-Hop/Rap']

const tracks = Array.isArray(wavyData.tracks) ? wavyData.tracks : []
const highlights = buildHighlights(tracks, isWavyName, name)
const collaborations = buildCollaborations(tracks, isWavyName)

const wavyProfile: ArtistProfile = {
  schema_version: wavyData.schema?.version || '1.0.0',
  entity_type: 'music_artist',
  source_of_truth_policy: {
    canonical_id_priority: ['spotify_artist_id', 'apple_music_artist_id'],
    notes: [wavyData.schema?.purpose || 'Profile derived from DSP-verified credits.'],
  },
  identity: {
    display_name: name,
    stylization: name,
    country,
    base_location: {
      name: locationName || country,
      country,
    },
    also_known_as: aliasNames,
  },
  profiles: {
    ...(spotifyUrl && spotifyId ? { spotify: { artist_id: spotifyId, url: spotifyUrl } } : {}),
    ...(appleUrl && appleId ? { apple_music: { artist_id: appleId, url: appleUrl } } : {}),
  },
  affiliations: wavyData.culture_szn_affiliation?.collective_name
    ? [
        {
          name: wavyData.culture_szn_affiliation.collective_name,
          type: 'collective',
          relationship: 'collaborator',
        },
      ]
    : [],
  genres: {
    primary: primaryGenres,
    secondary: [],
    tags: primaryGenres,
  },
  bio: {
    short: shortBio,
    long: longBio,
  },
  discography: {
    highlights,
    projects: [],
  },
  collaborations,
  branding: {
    primary_slug: 'wavy',
    image: wavyData.media_assets?.hero_image?.url || undefined,
    cover_image: wavyData.media_assets?.hero_image?.url || undefined,
  },
  seo: {
    title: `${name} | Culture SZN`,
    meta_description: `Official Culture SZN artist profile for ${name} — featured collaborator on releases including YOU WANT IT, LUCY DREAMS, TOXICC, SENSEI STATE, STORY OF MY LIFE, MOTO, and GAS N GO.`,
  },
  audit: {
    verified_fields_by_owner: [],
    last_updated: wavyData.schema?.generated_at || '2026-02-05',
    maintainer: 'Culture SZN',
  },
}

export default wavyProfile
