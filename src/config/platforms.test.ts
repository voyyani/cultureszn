import { describe, it, expect } from 'vitest'
import { platformLinks, PLATFORM_ORDER } from './platforms'

describe('platformLinks', () => {
  it('orders Kenya-first and drops missing links', () => {
    const out = platformLinks({ spotify: 's', youtube: 'y', soundcloud: 'sc' })
    expect(out.map((p) => p.key)).toEqual(['youtube', 'spotify', 'soundcloud'])
  })
  it('puts YouTube first in the canonical order', () => {
    expect(PLATFORM_ORDER[0]).toBe('youtube')
  })
})
