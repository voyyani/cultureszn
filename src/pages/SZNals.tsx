import { getAllSZNals, getDraftSZNals } from '@/content/sznals'
import { SZNalCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function SZNals() {
  useDocumentHead({ title: `SZNals | ${SITE.name}`, description: 'The Culture SZN journal.' })
  const published = getAllSZNals()
  const drafts = getDraftSZNals()
  return (
    <section className="section-szn pt-32" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <h1 id="sznals-heading" className="text-4xl font-bold mb-10">SZNals</h1>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {published.map((s) => <SZNalCard key={s.slug} sznal={s} />)}
          </div>
        ) : (
          <p className="text-lg text-text-secondary mb-12">First SZNals dropping soon.</p>
        )}

        {drafts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">In the works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {drafts.map((s) => <SZNalCard key={s.slug} sznal={s} asLink={false} />)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
