export async function subscribe(email: string): Promise<'ok' | 'invalid' | 'error'> {
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) return 'ok'
    if (res.status === 400) return 'invalid'
    return 'error'
  } catch {
    return 'error'
  }
}
