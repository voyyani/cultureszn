import { AnchorButton, LinkButton } from '@/components/ui'
import { SITE } from '@/config/site'

/* The close: one line, two doors. WhatsApp only when a community URL exists. */
export function JoinSection() {
  return (
    <section className="bg-bg-raised" aria-labelledby="join-heading">
      <div className="led led--band" aria-hidden />
      <div className="container-szn py-14 sm:py-20">
        <h2 id="join-heading" className="text-[clamp(2rem,6vw,4.5rem)]">Hear it first.</h2>
        <p className="mt-4 max-w-xl text-lg text-fg-muted">One message when something drops — on WhatsApp or by email. No accounts, no noise.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {SITE.whatsappCommunityUrl && <AnchorButton href={SITE.whatsappCommunityUrl} variant="primary" size="lg">Join on WhatsApp</AnchorButton>}
          <LinkButton to="/join" variant={SITE.whatsappCommunityUrl ? 'secondary' : 'primary'} size="lg">Join SZN</LinkButton>
        </div>
      </div>
    </section>
  )
}
