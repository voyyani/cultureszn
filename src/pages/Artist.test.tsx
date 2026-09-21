import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getAllArtists, getReleasesByArtist } from '@/data'

describe('Artist profile', () => {
  const artists = getAllArtists()
  it.each(artists.map((a) => [a.slug, a.name]))('%s renders name, discography and share', async (slug, name) => {
    renderAt(`/artists/${slug}`)
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(name)
    for (const r of getReleasesByArtist(slug).slice(0, 3)) expect(screen.getAllByText(r.title)[0]).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
  })
  it('renders the diacritics in Pipí Ciagi correctly', async () => {
    renderAt('/artists/pipi')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Pipí')
  })
  it('loads no iframe before a tap', async () => {
    const { container } = renderAt('/artists/xiix')
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelector('iframe')).toBeNull()
  })
  it('handles an unknown artist without a dead end', async () => {
    renderAt('/artists/nobody')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('link', { name: /all artists/i })).toHaveAttribute('href', '/artists')
  })
  it('old member URLs redirect', async () => {
    renderAt('/members/xiix')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XiiX')
  })
})
