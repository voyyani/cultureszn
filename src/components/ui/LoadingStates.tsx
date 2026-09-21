import { cn } from '@/lib/utils'

/* Loading is an LED strip warming up, not a spinner. */
export function LoadingSpinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('flex flex-col items-center gap-3 py-16', className)}>
      <span className="label text-fg-muted text-sm">{label}…</span>
      <span className="led led--loading w-40" aria-hidden />
    </div>
  )
}

export function LoadingSkeleton({ className, width = '100%', height = '1rem' }: { className?: string; width?: string | number; height?: string | number }) {
  return <div aria-hidden className={cn('bg-bg-raised rounded-szn', className)} style={{ width, height }} />
}

export function EmptyState({ title, description, action, className }: { title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border border-line rounded-szn px-6 py-10 text-center', className)}>
      <p className="label text-board text-lg">{title}</p>
      {description && <p className="text-fg-muted mt-3 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

export function ErrorMessage({ message, action, className }: { message: string; action?: React.ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn('border-2 border-mark rounded-szn px-4 py-3 flex flex-wrap items-center justify-between gap-3', className)}>
      <p>{message}</p>
      {action}
    </div>
  )
}
