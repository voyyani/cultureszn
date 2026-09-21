import { describe, it, expect } from 'vitest'
import { getRouteMeta } from './entry-seo'
import { getAllReleases, getAllArtists } from '@/data'

describe('getRouteMeta', () => {
  const metas = getRouteMeta()
  it('covers every artist and release', () => {
    for (const a of getAllArtists()) expect(metas.find((m) => m.path === `/artists/${a.slug}`)).toBeDefined()
    for (const r of getAllReleases()) expect(metas.find((m) => m.path === `/releases/${r.slug}`)).toBeDefined()
  })
  it('gives every route a title, description, absolute image and canonical', () => {
    for (const m of metas) {
      expect(m.title.length).toBeGreaterThan(3)
      expect(m.description.length).toBeGreaterThan(20)
      expect(m.image).toMatch(/^https:\/\//)
      expect(m.canonical).toBe(`https://cultureszn.com${m.path === '/' ? '' : m.path}`)
    }
  })
  it('uses 1200x630 cloudinary transforms for release images', () => {
    const r = getAllReleases().find((x) => x.coverArt.includes('res.cloudinary.com'))!
    const m = metas.find((x) => x.path === `/releases/${r.slug}`)!
    expect(m.image).toContain('w_1200,ar_1.91,c_fill')
  })
})
