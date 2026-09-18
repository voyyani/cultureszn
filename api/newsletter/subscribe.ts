import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json, methodNotAllowed, readJsonBody } from '../_lib/http'
import { isValidEmail, subscribeContact } from '../_lib/newsletter'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  const body = readJsonBody<{ email?: string; website?: string }>(req)
  if (body?.website) return json(res, 200, { ok: true }) // honeypot: pretend success
  const email = (body?.email ?? '').trim().toLowerCase()
  if (!isValidEmail(email)) return json(res, 400, { error: 'invalid_email' })

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) return json(res, 502, { error: 'upstream' })

  const result = await subscribeContact(email, { apiKey, audienceId })
  return result === 'ok' ? json(res, 200, { ok: true }) : json(res, 502, { error: 'upstream' })
}
