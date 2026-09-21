import { cn } from '@/lib/utils'

/* The play control: an LED-green plate with a cut-vinyl triangle. 56px, centred over the poster. */
export function PlayButton({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-szn bg-accent text-accent-fg',
        'shadow-[var(--led-glow)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95',
        className,
      )}
    >
      <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
    </button>
  )
}
