import { LinkButton, SectionHeader } from '@/components/ui'
import { SZNalList } from '@/components/shared'
import { getAllSZNals, getDraftSZNals } from '@/content/sznals'

export function SZNalsSection() {
  const published = getAllSZNals().slice(0, 3)
  const items = published.length > 0 ? published : getDraftSZNals().slice(0, 3)
  const isTeaser = published.length === 0
  if (items.length === 0) return null
  return (
    <section id="sznals" className="section-szn" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <SectionHeader
          id="sznals-heading"
          title="SZNals"
          subtitle={isTeaser ? 'The journal is being written. These are the first pieces in the works.' : 'Culture, process and creative philosophy from Nairobi.'}
          action={<LinkButton to="/sznals" variant="secondary">All SZNals</LinkButton>}
        />
        <SZNalList items={items} />
      </div>
    </section>
  )
}
