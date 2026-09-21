import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const index = readFileSync('src/index.css', 'utf8')

describe('design tokens', () => {
  it('defines every role token', () => {
    for (const t of ['--bg', '--bg-raised', '--fg', '--fg-muted', '--accent', '--accent-fg', '--line', '--font-display', '--font-body', '--radius', '--measure'])
      expect(tokens, t).toContain(`${t}:`)
  })
  it('does not carry the old template palette or faces', () => {
    for (const bad of ['#FF6B35', '#6A11CB', '#2575FC', 'Space Grotesk', 'Inter', 'gradient-sunset'])
      expect(tokens + index, bad).not.toContain(bad)
  })
  it('keeps a visible focus style', () => {
    expect(index).toMatch(/:focus-visible/)
  })
  it('honours prefers-reduced-motion globally', () => {
    expect(index).toMatch(/prefers-reduced-motion: reduce/)
  })
})
