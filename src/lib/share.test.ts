import { describe, it, expect } from 'vitest'
import { shareLinks } from './share'

describe('shareLinks', () => {
  it('puts text and url in the WhatsApp payload', () => {
    const l = shareLinks({ title: '6 AM', text: 'XiiX — 6 AM', url: 'https://cultureszn.com/releases/6-am' })
    expect(l.whatsapp).toBe('https://wa.me/?text=' + encodeURIComponent('XiiX — 6 AM https://cultureszn.com/releases/6-am'))
    expect(l.copy).toBe('https://cultureszn.com/releases/6-am')
  })
})
