import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Heading: Bungee signage lettering. The scale is the only hierarchy — no eyebrows, no kickers. */
interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
  className?: string
  id?: string
}

const HEADING_SIZES = {
  display: 'text-[clamp(2.75rem,9vw,6rem)]',
  h1: 'text-[clamp(2.25rem,6vw,4.5rem)]',
  h2: 'text-[clamp(1.75rem,4vw,3rem)]',
  h3: 'text-[clamp(1.25rem,2.5vw,1.75rem)]',
  h4: 'text-[1.1rem]',
} as const

export function Heading({ as, size = 'h2', children, className, id }: HeadingProps) {
  const Component = as ?? (size === 'display' ? 'h1' : size)
  return (
    <Component id={id} className={cn('font-display uppercase', HEADING_SIZES[size], className)}>
      {children}
    </Component>
  )
}

interface TextProps {
  as?: 'p' | 'span' | 'div'
  size?: 'sm' | 'base' | 'lg' | 'xl'
  color?: 'primary' | 'muted' | 'board' | 'accent'
  children: ReactNode
  className?: string
}

export function Text({ as = 'p', size = 'base', color = 'primary', children, className }: TextProps) {
  const Component = as
  const sizes = { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' }
  const colors = { primary: 'text-fg', muted: 'text-fg-muted', board: 'text-board', accent: 'text-accent' }
  return <Component className={cn(sizes[size], colors[color], className)}>{children}</Component>
}

/* A section's route-board: the heading on the left, the LED rule beneath, an optional action on the right. */
interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  id?: string
}

export function SectionHeader({ title, subtitle, action, className, id }: SectionHeaderProps) {
  return (
    <div className={cn('mb-8 sm:mb-10', className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <Heading id={id} size="h2">{title}</Heading>
        {action}
      </div>
      <div className="led mt-4" aria-hidden />
      {subtitle && <Text color="muted" className="mt-4 max-w-2xl">{subtitle}</Text>}
    </div>
  )
}
