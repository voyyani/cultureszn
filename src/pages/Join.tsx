import { useDocumentHead } from '@/hooks'
import { SITE } from '@/config/site'

export function Join() {
  useDocumentHead({ title: `Join SZN | ${SITE.name}`, description: 'Join the Culture SZN community.' })
  return (
    <section className="section-szn pt-32" aria-labelledby="join-heading">
      <div className="container-szn max-w-2xl">
        <h1 id="join-heading" className="text-4xl font-bold mb-4">Join SZN</h1>
        <p className="text-lg">Community links and newsletter arrive in Task 15.</p>
      </div>
    </section>
  )
}
