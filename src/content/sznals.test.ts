import { describe, it, expect } from 'vitest'
import { getAllSZNals, getDraftSZNals, getSZNalBySlug, loadSZNal } from './sznals'

describe('sznals content', () => {
  it('derives slugs from filenames and sorts published newest first', () => {
    const all = getAllSZNals()
    for (let i = 1; i < all.length; i++) expect(all[i - 1].publishedDate >= all[i].publishedDate).toBe(true)
    for (const s of all) expect(s.slug).toMatch(/^[a-z0-9-]+$/)
  })
  it('separates drafts from published', () => {
    for (const d of getDraftSZNals()) expect(d.status).toBe('draft')
    for (const p of getAllSZNals()) expect(p.status).toBe('published')
  })
  it('loads a component for a known slug', async () => {
    const first = [...getAllSZNals(), ...getDraftSZNals()][0]
    expect(first).toBeDefined()
    expect(getSZNalBySlug(first.slug)?.title).toBe(first.title)
    const Comp = await loadSZNal(first.slug)
    expect(typeof Comp).toBe('function')
  })
})
