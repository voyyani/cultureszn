import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderAt } from '@/test/render'

describe('Join page', () => {
  it('hides the WhatsApp CTA when no community URL is configured', async () => {
    vi.doMock('@/config/site', async (orig) => {
      const m = await orig<typeof import('@/config/site')>()
      return { SITE: { ...m.SITE, whatsappCommunityUrl: '' } }
    })
    renderAt('/join')
    expect(screen.queryByRole('link', { name: /whatsapp/i })).toBeNull()
    expect(screen.getByRole('heading', { name: /join szn/i })).toBeInTheDocument()
  })
})
