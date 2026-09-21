import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { NewsletterForm } from '@/components/join/NewsletterForm'
import { AnchorButton } from '@/components/ui'

/* Join SZN: narrow, two doors. WhatsApp leads when a community URL exists; the newsletter is always there. */
export function Join() {
  useDocumentHead({ title: `Join SZN | ${SITE.name}`, description: 'Join the Culture SZN community on WhatsApp and hear about every drop first by email.', canonical: `${SITE.url}/join` })
  const whatsapp = SITE.whatsappCommunityUrl
  return (
    <section className="section-szn" aria-labelledby="join-heading">
      <div className="container-szn max-w-3xl">
        <h1 id="join-heading" className="text-[clamp(2.5rem,8vw,5.5rem)]">Join SZN</h1>
        <p className="mt-4 max-w-xl text-lg text-fg-muted">One message when something drops — a release, a SZNal, a show. No accounts. No noise.</p>
        <div className="led mt-6" aria-hidden />

        {whatsapp && (
          <section aria-labelledby="wa-heading" className="mt-10 rounded-szn border border-line bg-bg-raised p-5 sm:p-7">
            <h2 id="wa-heading" className="text-2xl">WhatsApp community</h2>
            <p className="mt-2 text-fg-muted">Where the drops land first. Join, mute if you like, share what you like.</p>
            <div className="mt-5"><AnchorButton href={whatsapp} variant="primary" size="lg">Join on WhatsApp</AnchorButton></div>
          </section>
        )}

        <section aria-labelledby="nl-heading" className="mt-10 rounded-szn border border-line bg-bg-raised p-5 sm:p-7">
          <h2 id="nl-heading" className="text-2xl">Email</h2>
          <p className="mt-2 text-fg-muted">One email per drop. Unsubscribe any time.</p>
          <div className="mt-5"><NewsletterForm /></div>
        </section>
      </div>
    </section>
  )
}
