import { slugify } from '@/lib/utils'
import type { Release } from '@/types'
import type { NormalizedRelease } from '@/types/artist'

/** A stop on the route: a site release (linked) or a profile highlight without a page (external). */
export interface Stop {
  key: string
  title: string
  type: string
  date: string
  coverArt?: string
  href?: string
  external?: string
  release?: Release
}

/** Site releases first (they have pages); then profile highlights that are not on the site yet. */
export function buildStops(releases: Release[], highlights: NormalizedRelease[]): Stop[] {
  const stops: Stop[] = releases.map((r) => ({ key: r.id, title: r.title, type: r.type, date: r.releaseDate, coverArt: r.coverArt, href: `/releases/${r.slug}`, release: r }))
  const seen = new Set(releases.map((r) => slugify(r.title)))
  for (const h of highlights) {
    if (seen.has(slugify(h.title))) continue
    seen.add(slugify(h.title))
    stops.push({ key: `h-${h.id}`, title: h.title, type: h.type, date: h.releaseDate, coverArt: h.coverArt, external: h.links.youtube ?? h.links.spotify ?? h.links.apple ?? h.links.soundcloud })
  }
  return stops.sort((a, b) => b.date.localeCompare(a.date))
}

