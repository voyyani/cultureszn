import { describe, it, expect } from 'vitest'
import wavyProfile from './wavyProfile'
import pipiProfile from './pipiProfile'

describe.each([
  ['wavy', wavyProfile],
  ['pipi', pipiProfile],
])('%s profile', (slug, profile) => {
  it('has non-empty branding images', () => {
    expect(profile.branding.image.length).toBeGreaterThan(0)
    expect(profile.branding.cover_image.length).toBeGreaterThan(0)
  })
  it('uses the expected primary slug', () => {
    expect(profile.branding.primary_slug).toBe(slug)
  })
  it('contains no null discography highlights', () => {
    expect(profile.discography.highlights.every(Boolean)).toBe(true)
  })
  it('gives every highlight a title and ISO release date', () => {
    for (const h of profile.discography.highlights) {
      expect(h.title).toBeTruthy()
      expect(h.release_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
