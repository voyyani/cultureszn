import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getRecentReleases, getAllArtists } from '@/data'

describe('Home', () => {
  it('leads with the newest release and a play action', () => {
    renderAt('/')
    const newest = getRecentReleases(1)[0]
    expect(screen.getAllByText(newest.title)[0]).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /play/i }).length + screen.queryAllByRole('link', { name: /youtube|spotify|audiomack|boomplay/i }).length).toBeGreaterThan(0)
  })
  it('lists every artist and links to their page', () => {
    renderAt('/')
    for (const a of getAllArtists()) expect(screen.getAllByRole('link', { name: new RegExp(a.name, 'i') })[0]).toHaveAttribute('href', `/artists/${a.slug}`)
  })
  it('has exactly one h1', () => {
    renderAt('/')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
  it('loads no third-party iframe on first render', () => {
    const { container } = renderAt('/')
    expect(container.querySelector('iframe')).toBeNull()
  })
  it('invites the visitor to join', () => {
    renderAt('/')
    expect(screen.getAllByRole('link', { name: /join szn/i }).length).toBeGreaterThan(0)
  })
})
