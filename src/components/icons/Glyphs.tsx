/* Authored glyphs in one stroke weight (matches the Play triangle and the menu bars). */
type P = { size?: number; className?: string }

export function ArrowRight({ size = 16, className }: P) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowOut({ size = 16, className }: P) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className={className}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

export function PlayGlyph({ size = 18, className }: P) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M7 4v16l13-8z" /></svg>
  )
}

/** A lit LED: a bright core with its bleed, drawn so it reads at 12px. */
export function LedDot({ size = 12, className }: P) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 12 12" className={className}>
      <circle cx="6" cy="6" r="5.5" fill="currentColor" opacity="0.25" />
      <circle cx="6" cy="6" r="3" fill="currentColor" />
    </svg>
  )
}
