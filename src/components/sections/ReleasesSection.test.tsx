import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReleasesSection } from './ReleasesSection'
import { getFeaturedRelease } from '@/data'

describe('ReleasesSection', () => {
  it('renders the featured release title from static data without any network', () => {
    const featured = getFeaturedRelease()
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /latest releases/i })).toBeInTheDocument()
    expect(screen.getAllByText(featured!.title).length).toBeGreaterThan(0)
  })
  it('shows no sync/offline UI', () => {
    render(<MemoryRouter><ReleasesSection /></MemoryRouter>)
    expect(screen.queryByText(/offline/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /refresh|sync/i })).toBeNull()
  })
})
