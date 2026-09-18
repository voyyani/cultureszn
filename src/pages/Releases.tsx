import { getAllReleases } from '@/data'
import { ReleaseCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Releases() {
  useDocumentHead({ title: `Releases | ${SITE.name}`, description: 'Every Culture SZN release.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="releases-heading">
      <div className="container-szn">
        <h1 id="releases-heading" className="text-4xl font-bold mb-10">Releases</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getAllReleases().map((r) => <ReleaseCard key={r.id} release={r} />)}
        </div>
      </div>
    </section>
  )
}
