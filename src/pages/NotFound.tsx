import { LinkButton } from '@/components/ui'
import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function NotFound() {
  useDocumentHead({ title: `Wrong route | ${SITE.name}` })
  return (
    <section className="section-szn" aria-labelledby="nf-heading">
      <div className="container-szn">
        <h1 id="nf-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">Wrong stage.</h1>
        <p className="mt-4"><span className="label plate text-sm">Route 404</span></p>
        <p className="mt-6 max-w-md text-lg text-fg-muted">This stop doesn't exist. Board again from the front, or go straight to the music.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to="/" variant="primary" size="lg">Home</LinkButton>
          <LinkButton to="/releases" variant="secondary" size="lg">Releases</LinkButton>
        </div>
      </div>
    </section>
  )
}
