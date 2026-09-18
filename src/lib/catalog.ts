import catalogJson from '@/data/generated/spotify-catalog.json'
import { releases as staticReleases } from '@/data/releases'
import { getAllArtists } from '@/data/artists'
import { extractSpotifyId } from '@/lib/spotify-links'
import { slugify } from '@/lib/utils'
import type { Release } from '@/types'

export interface CatalogTrack { id: string; name: string; durationMs: number; trackNumber: number; url: string; artists: string[] }
export interface CatalogAlbum {
  id: string; name: string; albumType: 'album' | 'single' | 'compilation'; releaseDate: string
  coverUrl: string; url: string; totalTracks: number; tracks: CatalogTrack[]
}
export interface CatalogPlaylist {
  id: string; name: string; description: string; coverUrl: string; url: string; trackCount: number
  tracks: { id: string; name: string; artists: string[]; durationMs: number; url: string }[]
}
export interface SpotifyCatalog {
  syncedAt: string | null
  artists: Record<string, { spotifyArtistId: string; albums: CatalogAlbum[] }>
  playlists: CatalogPlaylist[]
}

const toTracks = (album: CatalogAlbum) => album.tracks.map((t) => ({ name: t.name, durationMs: t.durationMs, artists: t.artists }))
const albumType = (a: CatalogAlbum): Release['type'] => (a.albumType === 'single' ? 'single' : 'album')

export function mergeReleases(statics: Release[], catalog: SpotifyCatalog, artistNames: Record<string, string>): Release[] {
  const byAlbumId = new Map<string, CatalogAlbum & { artistSlug: string }>()
  for (const [artistSlug, entry] of Object.entries(catalog.artists)) {
    for (const album of entry.albums) byAlbumId.set(album.id, { ...album, artistSlug })
  }

  const merged: Release[] = statics.map((r) => {
    const id = extractSpotifyId(r.streamingLinks.spotify)
    const album = id ? byAlbumId.get(id) : undefined
    if (!album) return r
    byAlbumId.delete(album.id)
    return {
      ...r,
      spotifyAlbumId: album.id,
      coverArt: r.coverArt || album.coverUrl,
      releaseDate: r.releaseDate || album.releaseDate,
      tracks: r.tracks?.length ? r.tracks : toTracks(album),
      source: 'merged',
    }
  })

  const used = new Set(merged.map((r) => r.slug))
  for (const album of byAlbumId.values()) {
    let slug = slugify(album.name)
    if (used.has(slug)) slug = `${slug}-${album.id.slice(0, 6).toLowerCase()}`
    used.add(slug)
    merged.push({
      id: `sp-${album.id}`, slug, title: album.name,
      artist: artistNames[album.artistSlug] ?? album.artistSlug, artistSlug: album.artistSlug,
      type: albumType(album), releaseDate: album.releaseDate, coverArt: album.coverUrl,
      tracks: toTracks(album), streamingLinks: { spotify: album.url },
      spotifyAlbumId: album.id, source: 'catalog',
    })
  }

  return merged.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
}

export function getCatalog(): SpotifyCatalog {
  return catalogJson as SpotifyCatalog
}

let cache: Release[] | null = null
export function getAllReleases(): Release[] {
  if (!cache) {
    const names = Object.fromEntries(getAllArtists().map((a) => [a.slug, a.name]))
    cache = mergeReleases(staticReleases, getCatalog(), names)
  }
  return cache
}
export const getReleaseBySlug = (slug: string) => getAllReleases().find((r) => r.slug === slug)
export const getFeaturedRelease = () => getAllReleases().find((r) => r.featured) ?? getAllReleases()[0]
export const getRecentReleases = (n: number) => getAllReleases().slice(0, n)
export const getReleasesByArtist = (slug: string) => getAllReleases().filter((r) => r.artistSlug === slug)
export const getPlaylists = (): CatalogPlaylist[] => getCatalog().playlists
