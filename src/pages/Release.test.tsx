import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from '@/test/render'
import { getAllReleases } from '@/data'
import { PLATFORMS } from '@/config/platforms'

describe('Release detail', () => {
  const withTracks = getAllReleases().find((r) => r.tracks && r.tracks.length > 0)!
  it('shows title, artist link, platform buttons and the track list', async () => {
    renderAt(`/releases/${withTracks.slug}`)
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(withTracks.title)
    expect(screen.getByRole('link', { name: withTracks.artist })).toHaveAttribute('href', `/artists/${withTracks.artistSlug}`)
    for (const key of Object.keys(withTracks.streamingLinks) as (keyof typeof PLATFORMS)[])
      if (withTracks.streamingLinks[key]) expect(screen.getByRole('link', { name: new RegExp(PLATFORMS[key].label, 'i') })).toBeInTheDocument()
    const tracks = within(screen.getByRole('region', { name: /tracks/i }))
    for (const t of withTracks.tracks!) expect(tracks.getByText(t.name)).toBeInTheDocument()
  })
  it('loads no iframe before a tap, and one after', async () => {
    const { container } = renderAt(`/releases/${withTracks.slug}`)
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /play/i }))
    expect(container.querySelector('iframe')).not.toBeNull()
  })
  it('unknown release is not a dead end', async () => {
    renderAt('/releases/nope')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('link', { name: /all releases/i })).toHaveAttribute('href', '/releases')
  })
})

describe('Releases index', () => {
  it('lists every release grouped by year', async () => {
    renderAt('/releases')
    await screen.findByRole('heading', { level: 1 })
    for (const r of getAllReleases()) expect(screen.getAllByText(r.title).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '2026' })).toBeInTheDocument()
  })
})
