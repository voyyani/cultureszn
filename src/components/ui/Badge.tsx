import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A vinyl-cut caption plate. `mark` is the reflective red used for NEW. */
interface BadgeProps {
  children: ReactNode
  variant?: 'plate' | 'outline' | 'mark'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'plate', size = 'md', className }: BadgeProps) {
  const variants = {
    plate: 'bg-board text-bg',
    outline: 'bg-transparent border border-chrome text-fg',
    mark: 'bg-mark text-fg',
  }
  const sizes = { sm: 'px-1.5 py-1 text-[0.7rem]', md: 'px-2 py-1.5 text-[0.8rem]' }
  return <span className={cn('label inline-flex items-center rounded-szn', variants[variant], sizes[size], className)}>{children}</span>
}
