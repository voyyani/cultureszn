import { describe, it, expect } from 'vitest'
import { SITE } from './site'

describe('SITE', () => {
  it('uses Kenyan locale settings', () => {
    expect(SITE.locale).toBe('en-KE')
    expect(SITE.timeZone).toBe('Africa/Nairobi')
  })
  it('contains no unsplash or placeholder URLs', () => {
    expect(JSON.stringify(SITE)).not.toMatch(/unsplash|example\.com|placeholder/i)
  })
  it('only lists https social URLs', () => {
    for (const url of Object.values(SITE.socials)) expect(url).toMatch(/^https:\/\//)
  })
})
