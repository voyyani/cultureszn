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
    return (
      <p role="status" className="flex items-center gap-3 font-display text-lg">
        <span className="led w-10 shrink-0" aria-hidden />You're in. Watch your inbox for the next SZN.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <label htmlFor={`${id}-email`} className="label block text-sm text-board">Email</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input id={`${id}-email`} type="email" autoComplete="email" inputMode="email" required placeholder="you@example.co.ke"
               aria-invalid={state === 'invalid' || undefined} aria-describedby={state === 'invalid' || state === 'error' ? `${id}-msg` : undefined}
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="primary" size="md" disabled={state === 'submitting'} className="sm:shrink-0">
          {state === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>
      <div className="sr-only" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {state === 'invalid' && <p id={`${id}-msg`} role="alert" className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-mark" aria-hidden />Enter a valid email address.</p>}
      {state === 'error' && <p id={`${id}-msg`} role="alert" className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-mark" aria-hidden />Couldn't subscribe right now — please try again.</p>}
    </form>
  )
}
