import { Link } from 'react-router-dom'
import type { SZNalMeta } from '@/content/sznals'
import { formatDate } from '@/lib/format'
import { ArrowRight } from '@/components/icons/Glyphs'

/* A journal entry as a stop on the route: number, title in signage, category plate, and — only once
   published — the date and read time. Drafts carry status alone; nothing is claimed for an unwritten piece. */
export function SZNalRow({ sznal, index }: { sznal: SZNalMeta; index: number }) {
  const published = sznal.status === 'published'
  const inner = (
    <>
      <span className="label tabular w-8 shrink-0 pt-1 text-lg text-board">{String(index).padStart(2, '0')}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl leading-tight group-hover:text-board sm:text-2xl">{sznal.title}</span>
        <span className="mt-2 block max-w-2xl text-fg-muted">{sznal.excerpt}</span>
        <span className="mt-3 flex flex-wrap items-center gap-2">
          <span className="label plate text-xs">{sznal.category}</span>
          {published ? (
            <span className="label text-xs text-fg-muted">
              <time dateTime={sznal.publishedDate}>{formatDate(sznal.publishedDate, { month: 'short' })}</time> · {sznal.readTime}
            </span>
          ) : (
            <span className="label plate bg-bg-raised text-xs text-fg">In the works</span>
          )}
        </span>
      </span>
      {published && <span className="pt-1 text-chrome group-hover:text-fg"><ArrowRight /></span>}
    </>
  )
  const cls = 'group flex items-start gap-4 py-5'
  if (!published) return <article className={cls}>{inner}</article>
  return <Link to={`/sznals/${sznal.slug}`} className={cls}>{inner}</Link>
}

export function SZNalList({ items, start = 1 }: { items: SZNalMeta[]; start?: number }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((s, i) => <li key={s.slug}><SZNalRow sznal={s} index={start + i} /></li>)}
    </ol>
  )
}
