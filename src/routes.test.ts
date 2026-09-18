import { describe, it, expect } from 'vitest'
import { matchesRoute, ROUTES } from './routes'
import { NAV_LINKS, FOOTER_LINKS } from '@/lib/constants'
import { renderAt } from '@/test/render'
import { getAllArtists, releases, sznals } from '@/data'

describe('matchesRoute', () => {
  it('matches declared routes and rejects unknown ones', () => {
    expect(matchesRoute('/artists/xiix')).toBe(true)
    expect(matchesRoute('/events')).toBe(false)
    expect(matchesRoute('/merch')).toBe(false)
  })
})

describe('link integrity', () => {
  it('every nav and footer link resolves', () => {
    for (const l of [...NAV_LINKS, ...FOOTER_LINKS]) expect(matchesRoute(l.href), l.href).toBe(true)
  })

  const pages = [
    '/',
    '/artists',
    '/releases',
    '/sznals',
    '/join',
    ...getAllArtists().map((a) => `/artists/${a.slug}`),
    ...releases.map((r) => `/releases/${r.slug}`),
  ]

  it.each(pages)('every internal <a> on %s resolves to a route', (path) => {
    const { container, unmount } = renderAt(path)
    const hrefs = Array.from(container.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href')!)
    for (const href of hrefs) expect(matchesRoute(href), `${path} → ${href}`).toBe(true)
    unmount()
  })

  it('the declared route list covers every content type', () => {
    expect(ROUTES.map((r) => r.path)).toEqual(expect.arrayContaining(['/sznals/:slug', '/join']))
    expect(sznals.length).toBeGreaterThan(0)
  })
})
