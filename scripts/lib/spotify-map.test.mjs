import { describe, it, expect } from 'vitest'
import { mapAlbum, mapPlaylist, stripVolatile } from './spotify-map.mjs'

const rawAlbum = {
  id: '5EC55CH3Tybf6kNJS0415L', name: 'SIXXTAPE', album_type: 'album', release_date: '2025-05-29',
  total_tracks: 2, external_urls: { spotify: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L' },
  images: [{ url: 'big.jpg', width: 640 }, { url: 'small.jpg', width: 64 }],
  tracks: { items: [
    { id: 't1', name: 'INTRO', duration_ms: 1000, track_number: 2, external_urls: { spotify: 'u1' }, artists: [{ name: 'XiiX' }] },
    { id: 't0', name: 'OPEN', duration_ms: 2000, track_number: 1, external_urls: { spotify: 'u0' }, artists: [{ name: 'XiiX' }, { name: 'Pipí' }] },
  ] },
}

describe('mapAlbum', () => {
  it('picks the largest image and sorts tracks by number', () => {
    const a = mapAlbum(rawAlbum)
    expect(a.coverUrl).toBe('big.jpg')
    expect(a.tracks.map((t) => t.name)).toEqual(['OPEN', 'INTRO'])
    expect(a.tracks[0].artists).toEqual(['XiiX', 'Pipí'])
    expect(a.albumType).toBe('album')
  })
})

describe('mapPlaylist', () => {
  it('flattens playlist items and drops null tracks', () => {
    const p = mapPlaylist({
      id: 'p1', name: 'SZN Radio', description: 'x', external_urls: { spotify: 'pu' }, images: [{ url: 'c.jpg', width: 300 }],
      tracks: { total: 2, items: [{ track: null }, { track: { id: 'a', name: 'A', duration_ms: 5, external_urls: { spotify: 'au' }, artists: [{ name: 'W' }] } }] },
    })
    expect(p.trackCount).toBe(2)
    expect(p.tracks).toEqual([{ id: 'a', name: 'A', artists: ['W'], durationMs: 5, url: 'au' }])
  })
})

describe('stripVolatile', () => {
  it('removes syncedAt so unchanged catalogs compare equal', () => {
    expect(stripVolatile({ syncedAt: '2026-01-01', artists: {}, playlists: [] }))
      .toEqual(stripVolatile({ syncedAt: '2026-02-02', artists: {}, playlists: [] }))
  })
})
