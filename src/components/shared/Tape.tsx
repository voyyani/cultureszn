import { useId } from 'react'
import { cn } from '@/lib/utils'

/* Reflective chevron tape — the nganya's hazard tape, used as the NEW mark. Real chevrons, authored SVG.
   `direction="down"` for a vertical strip on a leading edge; `"right"` for a horizontal band. */
export function Tape({ direction = 'right', className }: { direction?: 'right' | 'down'; className?: string }) {
  const id = useId()
  const vertical = direction === 'down'
  return (
    <svg
      aria-hidden
      className={cn('block shrink-0', className)}
      preserveAspectRatio="none"
      viewBox={vertical ? '0 0 16 64' : '0 0 64 16'}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width={vertical ? 16 : 16} height={vertical ? 16 : 16}>
          <rect width="16" height="16" fill="var(--fg)" />
          {vertical ? (
            <path d="M0 0l8 8-8 8zM8 0l8 8-8 8z" fill="var(--mark)" />
          ) : (
            <path d="M0 0l8 8 8-8v8l-8 8-8-8z" fill="var(--mark)" />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
