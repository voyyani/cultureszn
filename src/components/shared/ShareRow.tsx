import { useState } from 'react'
import { shareLinks, type ShareData } from '@/lib/share'
import { Button, AnchorButton } from '@/components/ui'

/* WhatsApp first — it is where the audience shares — then native share when it exists, then copy. */
export function ShareRow({ data, className }: { data: ShareData; className?: string }) {
  const links = shareLinks(data)
  const [copied, setCopied] = useState(false)
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const canCopy = typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function'

  async function copy() {
    try {
      await navigator.clipboard.writeText(links.copy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard denied — the link is still in the address bar */
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3" aria-label="Share">
        <AnchorButton href={links.whatsapp} variant="primary">Share on WhatsApp</AnchorButton>
        {canNative && <Button variant="secondary" onClick={() => navigator.share(data).catch(() => {})}>Share…</Button>}
        {canCopy && <Button variant="ghost" onClick={copy}>Copy link</Button>}
      </div>
      <p role="status" aria-live="polite" className="label mt-2 min-h-5 text-sm text-accent">{copied ? 'Link copied' : ''}</p>
    </div>
  )
}
