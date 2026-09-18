import { describe, it, expect } from 'vitest'
import { formatDate, formatDuration } from './format'

describe('formatDate', () => {
  it('renders in en-KE with the Nairobi time zone', () => {
    expect(formatDate('2026-01-31')).toBe('31 January 2026')
  })
  it('accepts overrides', () => {
    expect(formatDate('2026-01-31', { month: 'short' })).toBe('31 Jan 2026')
  })
})

describe('formatDuration', () => {
  it('formats M:SS', () => expect(formatDuration(154000)).toBe('2:34'))
  it('pads seconds', () => expect(formatDuration(61000)).toBe('1:01'))
})
