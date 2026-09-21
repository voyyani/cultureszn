import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'

describe('lazy routes', () => {
  it('renders the artist page after the chunk resolves', async () => {
    renderAt('/artists/xiix')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XiiX')
  })
  it('renders the join page after the chunk resolves', async () => {
    renderAt('/join')
    expect(await screen.findByRole('heading', { name: /join szn/i })).toBeInTheDocument()
  })
})
