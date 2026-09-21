import { formatDate } from '@/lib/format'
import type { SZNalMeta } from '@/content/sznals'

export function ArticleHeader({ meta }: { meta: SZNalMeta }) {
  return (
    <header className="border-b border-line">
      <div className="container-szn py-8 sm:py-12">
        <p className="label text-lg text-board">{meta.category}</p>
        <h1 className="measure mt-3 text-[clamp(2rem,6vw,4.5rem)]">{meta.title}</h1>
        <p className="measure mt-5 text-lg text-fg-muted">{meta.excerpt}</p>
        <p className="label mt-6 text-sm text-fg-muted">
          {meta.author} · <time dateTime={meta.publishedDate}>{formatDate(meta.publishedDate)}</time> · {meta.readTime}
        </p>
      </div>
      <div className="led" aria-hidden />
    </header>
  )
}
