import { describe, it, expect } from 'vitest'
import { slugify, truncate, cn } from './utils'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('6 AM')).toBe('6-am')
  })
  it('strips punctuation', () => {
    expect(slugify('ALL DAY (feat. 3 PVNCH)')).toBe('all-day-feat-3-pvnch')
  })
})

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('SIXXTAPE', 20)).toBe('SIXXTAPE')
  })
  it('trims then appends an ellipsis', () => {
    expect(truncate('Nairobi creative ecosystem', 7)).toBe('Nairobi...')
  })
})

describe('cn', () => {
  it('merges tailwind classes with the last one winning', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
