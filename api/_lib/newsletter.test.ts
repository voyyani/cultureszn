import { describe, it, expect, vi } from 'vitest'
import { isValidEmail, subscribeContact } from './newsletter'

describe('isValidEmail', () => {
  it('accepts normal addresses and rejects junk', () => {
    expect(isValidEmail('fan@example.co.ke')).toBe(true)
    expect(isValidEmail('nope')).toBe(false)
    expect(isValidEmail('a@b')).toBe(false)
  })
})

describe('subscribeContact', () => {
  const env = { apiKey: 'k', audienceId: 'aud' }
  it('posts to the audience contacts endpoint', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('ok')
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('https://api.resend.com/audiences/aud/contacts')
    expect(init.headers.Authorization).toBe('Bearer k')
    expect(JSON.parse(init.body)).toEqual({ email: 'fan@example.co.ke', unsubscribed: false })
  })
  it('treats a 409 duplicate as ok', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 409 })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('ok')
  })
  it('reports upstream failure', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    expect(await subscribeContact('fan@example.co.ke', env, f as unknown as typeof fetch)).toBe('upstream_error')
  })
})
