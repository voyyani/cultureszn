import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSZNalBySlug, getAllSZNals, loadSZNal } from '@/content/sznals'
import { ArticleHeader, Prose } from '@/components/journal'
import { ShareRow, SZNalCard } from '@/components/shared'
import { LinkButton, LoadingSpinner } from '@/components/ui'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function SZNal() {
  const { slug = '' } = useParams<{ slug: string }>()
  const meta = getSZNalBySlug(slug)
  const published = meta?.status === 'published'
  const [loaded, setLoaded] = useState<{ slug: string; Body: ComponentType | null } | null>(null)

  useEffect(() => {
    if (!published) return
    let alive = true
    loadSZNal(slug).then((C) => alive && setLoaded({ slug, Body: C })).catch(() => alive && setLoaded({ slug, Body: null }))
    return () => { alive = false }
  }, [slug, published])

  useDocumentHead({ title: `${meta?.title ?? 'SZNal'} | ${SITE.name}`, description: meta?.excerpt, canonical: published ? `${SITE.url}/sznals/${slug}` : undefined })

  if (!meta || !published) {
    return (
      <section className="section-szn" aria-labelledby="nf-heading">
        <div className="container-szn">
          <p className="label text-lg text-board">{meta ? 'In the works' : 'Not on this route'}</p>
          <h1 id="nf-heading" className="mt-3 text-[clamp(2.5rem,8vw,5.5rem)]">{meta ? "This SZNal isn't out yet." : 'No SZNal here.'}</h1>
          {meta && <p className="measure mt-6 text-lg text-fg-muted">{meta.excerpt}</p>}
          <div className="mt-8"><LinkButton to="/sznals" variant="primary" size="lg">Back to SZNals</LinkButton></div>
        </div>
      </section>
    )
  }

  const state = loaded?.slug === slug ? loaded : null
  const more = getAllSZNals().filter((s) => s.slug !== slug).slice(0, 3)
  const share = { title: `${meta.title} | ${SITE.name}`, text: meta.title, url: `${SITE.url}/sznals/${slug}` }

  return (
    <article>
      <ArticleHeader meta={meta} />
      <div className="container-szn py-8 sm:py-12">
        {state === null && <LoadingSpinner label="Loading the piece" />}
        {state?.Body === null && (
          <p role="alert" className="measure text-lg">Couldn't load this piece. <Link to="/sznals" className="text-board underline underline-offset-4">Back to SZNals</Link></p>
        )}
        {state?.Body && <Prose Body={state.Body} />}
        <div className="chrome-rule mt-12" aria-hidden />
        <div className="mt-6">
          <h2 className="label text-sm text-chrome">Share</h2>
          <ShareRow data={share} className="mt-3" />
        </div>
      </div>
      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="border-t border-line">
          <div className="container-szn py-10 sm:py-14">
            <h2 id="more-heading" className="text-2xl">More SZNals</h2>
            <ul className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-3">
              {more.map((s) => <li key={s.slug}><SZNalCard sznal={s} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </article>
  )
}
