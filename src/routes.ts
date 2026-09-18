import { matchPath } from 'react-router-dom'

export const ROUTES = [
  { path: '/' },
  { path: '/artists' },
  { path: '/artists/:slug' },
  { path: '/members/:slug' },
  { path: '/releases' },
  { path: '/releases/:slug' },
  { path: '/sznals' },
  { path: '/sznals/:slug' },
  { path: '/join' },
] as const

/** True when an internal href (path + optional #hash) matches a declared route. */
export function matchesRoute(href: string): boolean {
  if (!href.startsWith('/')) return false
  const [pathname] = href.split(/[?#]/)
  return ROUTES.some((r) => matchPath({ path: r.path, end: true }, pathname) !== null)
}
