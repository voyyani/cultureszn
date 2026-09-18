import { describe, it, expect } from 'vitest'
import { mergeReleases } from './catalog'
import { fixtureCatalog } from '@/test/fixtures/catalog'
import type { Release } from '@/types'

const staticReleases: Release[] = [
  {
    id: 'sixxtape', slug: 'sixxtape', title: 'SIXXTAPE', artist: 'XiiX', artistSlug: 'xiix', type: 'album',
    releaseDate: '2025-05-29', coverArt: 'https://res.cloudinary.com/x/sixx.png',
    streamingLinks: { spotify: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L', youtube: 'https://youtu.be/abc' },
    featured: true, source: 'static',
  },
]
const names = { xiix: 'XiiX' }

describe('mergeReleases', () => {
  const merged = mergeReleases(staticReleases, fixtureCatalog, names)

  it('keeps curated fields and fills tracks from the catalog', () => {
    const sixx = merged.find((r) => r.slug === 'sixxtape')!
    expect(sixx.source).toBe('merged')
    expect(sixx.featured).toBe(true)
    expect(sixx.streamingLinks.youtube).toBe('https://youtu.be/abc')
    expect(sixx.coverArt).toBe('https://res.cloudinary.com/x/sixx.png') // curated art wins
    expect(sixx.tracks?.map((t) => t.name)).toEqual(['INTRO', 'SABAKI'])
    expect(sixx.spotifyAlbumId).toBe('5EC55CH3Tybf6kNJS0415L')
  })

  it('synthesizes releases for catalog albums not in static data', () => {
    const drop = merged.find((r) => r.spotifyAlbumId === 'NEWDROP00000000000000A')!
    expect(drop.source).toBe('catalog')
    expect(drop.slug).toBe('new-drop')
    expect(drop.artist).toBe('XiiX')
    expect(drop.type).toBe('single')
    expect(drop.streamingLinks.spotify).toContain('NEWDROP00000000000000A')
    expect(drop.coverArt).toBe('https://i.scdn.co/image/new.jpg')
  })

  it('sorts newest first', () => {
    expect(merged[0].slug).toBe('new-drop')
  })

  it('never produces duplicate slugs', () => {
    const slugs = merged.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('returns static data untouched when the catalog is empty', () => {
    const out = mergeReleases(staticReleases, { syncedAt: null, artists: {}, playlists: [] }, names)
    expect(out).toHaveLength(1)
    expect(out[0].source).toBe('static')
  })
})
