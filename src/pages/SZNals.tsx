import { getAllSZNals, getDraftSZNals } from '@/content/sznals'
import { SZNalList } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

/* The journal as a route: published pieces are stops you can board; drafts are listed as in the works. */
export function SZNals() {
  useDocumentHead({ title: `SZNals | ${SITE.name}`, description: 'The Culture SZN journal — culture, process, and creative philosophy from Nairobi.', canonical: `${SITE.url}/sznals` })
  const published = getAllSZNals()
  const drafts = getDraftSZNals()
  return (
    <section className="section-szn" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <h1 id="sznals-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">SZNals</h1>
        <p className="mt-4"><span className="label plate text-sm">The journal · culture, process, philosophy</span></p>
        <div className="led mt-6 mb-10" aria-hidden />

        {published.length > 0 ? (
          <SZNalList items={published} />
        ) : (
          <p className="measure text-lg text-fg-muted">The first SZNals are being written. Until they land, here is what's in the works.</p>
        )}

        {drafts.length > 0 && (
          <section aria-labelledby="drafts-heading" className="mt-14">
            <h2 id="drafts-heading" className="mb-5 text-2xl">In the works</h2>
            <SZNalList items={drafts} start={published.length + 1} />
          </section>
        )}
      </div>
    </section>
  )
}
