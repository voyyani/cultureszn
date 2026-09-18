import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSZNalBySlug, loadSZNal } from '@/content/sznals'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { formatDate } from '@/lib/format'

export function SZNal() {
  const { slug } = useParams<{ slug: string }>()
  const meta = slug ? getSZNalBySlug(slug) : undefined
  const published = meta?.status === 'published'
  const [Body, setBody] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!slug || !published) return
    let alive = true
    loadSZNal(slug).then((C) => alive && setBody(() => C)).catch(() => alive && setFailed(true))
    return () => { alive = false }
  }, [slug, published])

  useDocumentHead({ title: `${meta?.title ?? 'SZNal'} | ${SITE.name}`, description: meta?.excerpt })

  if (!meta || !published) {
    return (
      <section className="section-szn pt-32"><div className="container-szn">
        <h1 className="text-4xl font-bold mb-4">This SZNal isn't out yet</h1>
        <Link to="/sznals">Back to SZNals</Link>
      </div></section>
    )
  }
  return (
    <article className="section-szn pt-32"><div className="container-szn max-w-3xl">
      <p className="uppercase tracking-wider text-sm mb-3">{meta.category}</p>
      <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
      <p className="text-sm mb-8">{meta.author} · {formatDate(meta.publishedDate)} · {meta.readTime}</p>
      {failed && <p role="alert">Couldn't load this piece. <Link to="/sznals">Back to SZNals</Link></p>}
      {Body ? <div className="prose-szn"><Body /></div> : !failed && <p aria-busy="true">Loading…</p>}
    </div></article>
  )
}
