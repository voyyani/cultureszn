import { describe, it, expect } from 'vitest'
import { releases, getAllSZNals, getDraftSZNals } from '@/data'
import { extractSpotifyId, isValidSpotifyId } from '@/lib/spotify-links'

describe('data honesty', () => {
  it('has no stock placeholder images', () => {
    for (const r of releases) expect(r.coverArt).not.toMatch(/unsplash/)
    for (const s of [...getAllSZNals(), ...getDraftSZNals()]) expect(s.cover ?? '').not.toMatch(/unsplash/)
  })
  it('has only real Spotify ids', () => {
    for (const r of releases) {
      if (r.streamingLinks.spotify) expect(isValidSpotifyId(extractSpotifyId(r.streamingLinks.spotify) ?? '')).toBe(true)
    }
  })
})
