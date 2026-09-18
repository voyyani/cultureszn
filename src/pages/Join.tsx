import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'
import { NewsletterForm } from '@/components/join/NewsletterForm'
import { Button } from '@/components/ui'

export function Join() {
  useDocumentHead({ title: `Join SZN | ${SITE.name}`, description: 'Join the Culture SZN community on WhatsApp and get releases first by email.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="join-heading">
      <div className="container-szn max-w-2xl">
        <h1 id="join-heading" className="text-4xl font-bold mb-4">Join SZN</h1>
        <p className="text-lg mb-10">Be first to every drop, show, and SZNal.</p>
        {SITE.whatsappCommunityUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-3">WhatsApp community</h2>
            <a href={SITE.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">Join on WhatsApp</Button>
            </a>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold mb-3">Newsletter</h2>
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
