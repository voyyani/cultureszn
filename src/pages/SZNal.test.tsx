import { screen } from '@testing-library/react'
import { renderAt } from '@/test/render'
import { getAllSZNals, getDraftSZNals } from '@/content/sznals'

describe('SZNals', () => {
  it('index lists drafts as non-links and published as links', async () => {
    renderAt('/sznals')
    await screen.findByRole('heading', { level: 1 })
    for (const d of getDraftSZNals()) expect(screen.queryByRole('link', { name: new RegExp(d.title, 'i') })).toBeNull()
    for (const p of getAllSZNals()) expect(screen.getByRole('link', { name: new RegExp(p.title, 'i') })).toHaveAttribute('href', `/sznals/${p.slug}`)
  })
  it('a draft slug is not a dead end', async () => {
    const d = getDraftSZNals()[0]
    renderAt(`/sznals/${d.slug}`)
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('link', { name: /back to sznals/i })).toHaveAttribute('href', '/sznals')
  })
  it('article page has one h1 and a prose region when published', async () => {
    const p = getAllSZNals()[0]
    if (!p) return // nothing published yet — see docs/ASSETS-NEEDED.md
    renderAt(`/sznals/${p.slug}`)
    expect(await screen.findByRole('article')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
