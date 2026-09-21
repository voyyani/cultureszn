import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReleasesSection } from './ReleasesSection'
import { getRecentReleases } from '@/data'

describe('ReleasesSection', () => {
  it('renders the newest releases from static data without any network', () => {
    const newest = getRecentReleases(1)[0]
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /latest releases/i })).toBeInTheDocument()
    expect(screen.getAllByText(newest.title).length).toBeGreaterThan(0)
  })
  it('shows no sync/offline UI', () => {
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.queryByText(/offline/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /refresh|sync/i })).toBeNull()
  })
})
