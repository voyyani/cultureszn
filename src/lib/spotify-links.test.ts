import { describe, it, expect } from 'vitest'
import { extractSpotifyId, extractSpotifyType, isValidSpotifyId, buildSpotifyEmbedUrl, formatDuration } from './spotify-links'

describe('extractSpotifyId', () => {
  it('reads an id from a web album URL', () => {
    expect(extractSpotifyId('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L')).toBe('5EC55CH3Tybf6kNJS0415L')
  })
  it('reads an id from a spotify: URI', () => {
    expect(extractSpotifyId('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp')).toBe('3n3Ppam7vgaVa1iaRUc9Lp')
  })
  it('returns null for undefined', () => {
    expect(extractSpotifyId(undefined)).toBeNull()
  })
})

describe('isValidSpotifyId', () => {
  it('accepts a 22-char base62 id', () => expect(isValidSpotifyId('5EC55CH3Tybf6kNJS0415L')).toBe(true))
  it('rejects fabricated ids', () => {
    expect(isValidSpotifyId('concretedreams')).toBe(false)
    expect(isValidSpotifyId('cultureszn')).toBe(false)
  })
})

describe('extractSpotifyType', () => {
  it('detects album', () => expect(extractSpotifyType('https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L')).toBe('album'))
})

describe('buildSpotifyEmbedUrl', () => {
  it('builds an embed URL', () => expect(buildSpotifyEmbedUrl('album', 'abc')).toContain('/embed/album/abc'))
})

describe('formatDuration', () => {
  it('formats M:SS', () => expect(formatDuration(154000)).toBe('2:34'))
})
