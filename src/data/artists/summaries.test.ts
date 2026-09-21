import { describe, it, expect } from 'vitest'
import { ARTIST_SUMMARIES } from './summaries'
import { getArtistProfileAsync } from './index'

describe('artist summaries', () => {
  it.each(ARTIST_SUMMARIES.map((a) => [a.slug, a] as const))('%s matches its full profile', async (slug, summary) => {
    const full = await getArtistProfileAsync(slug)
    expect(full).not.toBeNull()
    for (const key of Object.keys(summary) as (keyof typeof summary)[]) expect(summary[key], key).toEqual(full![key])
  })
  it('has a unique slug per entry', () => {
    expect(new Set(ARTIST_SUMMARIES.map((a) => a.slug)).size).toBe(ARTIST_SUMMARIES.length)
  })
})
