import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from '@/test/render'

describe('Layout shell', () => {
  it('has landmarks and a skip link', async () => {
    renderAt('/join')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
    await screen.findByRole('heading', { level: 1 })
  })
  it('marks the current nav item', async () => {
    renderAt('/join')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getAllByRole('link', { name: /join szn/i })[0]).toHaveAttribute('aria-current', 'page')
  })
  it('toggles the mobile menu accessibly', async () => {
    renderAt('/')
    const btn = screen.getByRole('button', { name: /menu/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })
  it('404 offers a way back', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/')
  })
})
