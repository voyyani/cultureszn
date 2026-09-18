import type { VercelRequest, VercelResponse } from '@vercel/node'

export function json(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).json(body)
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]): void {
  res.setHeader('Allow', allowed.join(', '))
  json(res, 405, { error: 'Method not allowed' })
}

export function readJsonBody<T>(req: VercelRequest): T | null {
  const body: unknown = req.body
  if (body && typeof body === 'object') return body as T
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T
    } catch {
      return null
    }
  }
  return null
}
