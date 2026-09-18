import { useParams, Link } from 'react-router-dom'
import { getSZNalBySlug } from '@/data'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { formatDate } from '@/lib/format'

export function SZNal() {
  const { slug } = useParams<{ slug: string }>()
  const sznal = slug ? getSZNalBySlug(slug) : undefined
  useDocumentHead({ title: `${sznal?.title ?? 'SZNal'} | ${SITE.name}`, description: sznal?.excerpt })
  if (!sznal) {
    return (
      <section className="section-szn pt-32"><div className="container-szn">
        <h1 className="text-4xl font-bold mb-4">SZNal not found</h1>
        <Link to="/sznals">Back to SZNals</Link>
      </div></section>
    )
  }
  return (
    <article className="section-szn pt-32"><div className="container-szn max-w-3xl">
      <p className="uppercase tracking-wider text-sm mb-3">{sznal.category}</p>
      <h1 className="text-4xl font-bold mb-4">{sznal.title}</h1>
      <p className="text-sm mb-8">{sznal.author} · {formatDate(sznal.publishedDate)} · {sznal.readTime}</p>
      <p className="text-lg">{sznal.excerpt}</p>
    </div></article>
  )
}
