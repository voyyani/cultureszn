import { useId, useState, type FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import { subscribe } from '@/lib/newsletter-client'

type State = 'idle' | 'submitting' | 'success' | 'invalid' | 'error'

export function NewsletterForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<State>('idle')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (website) { setState('success'); return }
    setState('submitting')
    const result = await subscribe(email.trim())
    setState(result === 'ok' ? 'success' : result)
  }

  if (state === 'success') {
    return <p role="status">You're in. Watch your inbox for the next SZN.</p>
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <label htmlFor={`${id}-email`} className="block">Email</label>
      <Input id={`${id}-email`} type="email" autoComplete="email" inputMode="email" required
             value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="sr-only" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {state === 'invalid' && <p role="alert">Enter a valid email address.</p>}
      {state === 'error' && <p role="alert">Couldn't subscribe right now — please try again.</p>}
      <Button type="submit" variant="primary" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </Button>
      <p className="text-sm">One email when something drops. Unsubscribe any time.</p>
    </form>
  )
}
