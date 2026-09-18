import { describe, it, expect, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json, methodNotAllowed, readJsonBody } from './http'

function mockRes() {
  const res = { status: vi.fn(), setHeader: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  return res as unknown as VercelResponse & typeof res
}

describe('json', () => {
  it('sets status and body', () => {
    const res = mockRes()
    json(res, 201, { ok: true })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })
})

describe('methodNotAllowed', () => {
  it('sets Allow header and 405', () => {
    const res = mockRes()
    methodNotAllowed(res, ['POST'])
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.status).toHaveBeenCalledWith(405)
  })
})

describe('readJsonBody', () => {
  it('returns parsed object bodies', () => {
    expect(readJsonBody<{ a: number }>({ body: { a: 1 } } as unknown as VercelRequest)).toEqual({ a: 1 })
  })
  it('parses string bodies and returns null on garbage', () => {
    expect(readJsonBody({ body: '{"a":1}' } as unknown as VercelRequest)).toEqual({ a: 1 })
    expect(readJsonBody({ body: '{nope' } as unknown as VercelRequest)).toBeNull()
  })
})
