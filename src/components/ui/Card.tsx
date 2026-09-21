import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* A panel of the bus: black, chrome-edged, square-cornered vinyl. No blur, no halo. */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'panel' | 'outline'
  children: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'panel', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-szn overflow-hidden border',
      variant === 'panel' ? 'bg-bg-raised border-line' : 'bg-transparent border-chrome',
      className,
    )}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = 'Card'

const CardImage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-hidden bg-bg', className)} {...props}>
    {children}
  </div>
))
CardImage.displayName = 'CardImage'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 sm:p-5', className)} {...props}>
    {children}
  </div>
))
CardContent.displayName = 'CardContent'

export { Card, CardImage, CardContent }
