import { Hero, ReleasesSection, PlaylistsSection, SZNalsSection, JoinSection } from '@/components/sections'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Home() {
  useDocumentHead({ title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description, canonical: SITE.url })
  return (
    <>
      <Hero />
      <ReleasesSection />
      <PlaylistsSection />
      <SZNalsSection />
      <JoinSection />
    </>
  )
}
