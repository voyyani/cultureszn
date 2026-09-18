const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(s: string): boolean {
  return EMAIL.test(s) && s.length <= 254
}

export async function subscribeContact(
  email: string,
  env: { apiKey: string; audienceId: string },
  fetchImpl: typeof fetch = fetch,
): Promise<'ok' | 'upstream_error'> {
  const res = await fetchImpl(`https://api.resend.com/audiences/${env.audienceId}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  })
  if (res.ok || res.status === 409) return 'ok'
  return 'upstream_error'
}
