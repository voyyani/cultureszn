import { LinkButton, SectionHeader } from '@/components/ui'
import { ReleaseCard } from '@/components/shared'
import { Reveal } from '@/components/shared/Reveal'
import { getRecentReleases } from '@/data'

export function ReleasesSection() {
  const recent = getRecentReleases(4)
  return (
    <section id="releases" className="section-szn" aria-labelledby="releases-heading">
      <div className="container-szn">
        <SectionHeader id="releases-heading" title="Latest releases" action={<LinkButton to="/releases" variant="secondary">All releases</LinkButton>} />
        <Reveal stagger as="ul" className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {recent.map((release, i) => (
            <Reveal.Item key={release.id} as="li" className="list-none">
              <ReleaseCard release={release} isNew={i === 0} />
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
