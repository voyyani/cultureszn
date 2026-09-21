import { LinkButton, SectionHeader } from '@/components/ui'
import { SZNalCard } from '@/components/shared'
import { Reveal } from '@/components/shared/Reveal'
import { getAllSZNals, getDraftSZNals } from '@/content/sznals'

export function SZNalsSection() {
  const published = getAllSZNals().slice(0, 3)
  const teasers = published.length > 0 ? published : getDraftSZNals().slice(0, 3)
  const isTeaser = published.length === 0
  if (teasers.length === 0) return null
  return (
    <section id="sznals" className="section-szn" aria-labelledby="sznals-heading">
      <div className="container-szn">
        <SectionHeader
          id="sznals-heading"
          title="SZNals"
          subtitle={isTeaser ? 'The journal is being written. These are the first pieces in the works.' : 'Culture, process and creative philosophy from Nairobi.'}
          action={<LinkButton to="/sznals" variant="secondary">All SZNals</LinkButton>}
        />
        <Reveal stagger as="ul" className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {teasers.map((sznal) => (
            <Reveal.Item key={sznal.slug} as="li" className="list-none">
              <SZNalCard sznal={sznal} asLink={!isTeaser} />
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
