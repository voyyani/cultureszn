import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { SITE } from '@/config/site'

describe('Join page', () => {
  it('renders the newsletter form, and the WhatsApp CTA only when a community URL is configured', async () => {
    renderAt('/join')
    expect(await screen.findByRole('heading', { name: /join szn/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    const wa = screen.queryByRole('link', { name: /join on whatsapp/i })
    if (SITE.whatsappCommunityUrl) expect(wa).toHaveAttribute('href', SITE.whatsappCommunityUrl)
    else expect(wa).toBeNull()
  })
})
