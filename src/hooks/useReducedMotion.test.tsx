import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
}

describe('useReducedMotion', () => {
  it('reflects the media query', () => {
    mockMatchMedia(true)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
    mockMatchMedia(false)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
  })
  it('honours ?motion=off', () => {
    mockMatchMedia(false)
    window.history.pushState({}, '', '/?motion=off')
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
    window.history.pushState({}, '', '/')
  })
})
