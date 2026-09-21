import { getAllSZNals, getDraftSZNals } from '@/content/sznals'
import { SZNalCard, Reveal } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function SZNals() {
  useDocumentHead({ title: `SZNals | ${SITE.name}`, description: 'The Culture SZN journal — culture, process, and creative philosophy from Nairobi.', canonical: `${SITE.url}/sznals` })
  const published = getAllSZNals()
  const drafts = getDraftSZNals()
  return (
    <section className="section-szn" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <h1 id="sznals-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">SZNals</h1>
        <p className="label mt-3 text-lg text-fg-muted">The journal · culture, process, philosophy</p>
        <div className="led mt-6 mb-10" aria-hidden />

        {published.length > 0 ? (
          <Reveal stagger as="ul" className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {published.map((s) => <Reveal.Item key={s.slug} as="li" className="list-none"><SZNalCard sznal={s} /></Reveal.Item>)}
          </Reveal>
        ) : (
          <p className="measure text-lg text-fg-muted">The first SZNals are being written. Until they land, here is what's in the works.</p>
        )}

        {drafts.length > 0 && (
          <section aria-labelledby="drafts-heading" className="mt-14">
            <h2 id="drafts-heading" className="label mb-5 text-2xl text-board">In the works</h2>
            <ul className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((s) => <li key={s.slug}><SZNalCard sznal={s} asLink={false} /></li>)}
            </ul>
          </section>
        )}
      </div>
    </section>
  )
}
