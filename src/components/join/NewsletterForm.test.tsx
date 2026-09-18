import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { NewsletterForm } from './NewsletterForm'

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }))
}

describe('NewsletterForm', () => {
  it('shows success after a 200', async () => {
    mockFetch(200, { ok: true })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'fan@example.co.ke')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('status')).toHaveTextContent(/you're in/i)
  })
  it('shows an inline error on a 400', async () => {
    mockFetch(400, { error: 'invalid_email' })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'bad')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i)
  })
  it('shows a retryable error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<NewsletterForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'fan@example.co.ke')
    await userEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/try again/i)
  })
})
