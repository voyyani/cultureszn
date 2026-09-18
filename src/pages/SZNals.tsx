import { getAllSZNals } from '@/data'
import { SZNalCard } from '@/components/shared'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function SZNals() {
  useDocumentHead({ title: `SZNals | ${SITE.name}`, description: 'The Culture SZN journal.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <h1 id="sznals-heading" className="text-4xl font-bold mb-10">SZNals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getAllSZNals().map((s) => <SZNalCard key={s.id} sznal={s} />)}
        </div>
      </div>
    </section>
  )
}
