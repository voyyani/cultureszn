import { Link } from 'react-router-dom'
import type { SZNalMeta } from '@/content/sznals'
import { formatDate } from '@/lib/format'

/* A journal entry as a panel: category plate, title in signage, the excerpt, a route-board footer line. */
export function SZNalCard({ sznal, asLink = true }: { sznal: SZNalMeta; asLink?: boolean }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="label plate text-xs">{sznal.category}</span>
        {!asLink && <span className="label text-xs text-chrome">In the works</span>}
      </div>
      <h3 className="mt-4 text-xl leading-tight group-hover:text-board sm:text-2xl">{sznal.title}</h3>
      <p className="mt-3 line-clamp-3 text-fg-muted">{sznal.excerpt}</p>
      <p className="label mt-5 border-t border-line pt-4 text-sm text-fg-muted">
        {formatDate(sznal.publishedDate, { month: 'short' })} · {sznal.readTime}
      </p>
    </>
  )
  const cls = 'group flex h-full flex-col rounded-szn border border-line bg-bg-raised p-5'
  if (!asLink) return <article className={cls}>{body}</article>
  return <Link to={`/sznals/${sznal.slug}`} className={cls}>{body}</Link>
}
