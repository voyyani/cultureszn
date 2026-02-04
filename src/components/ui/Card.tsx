import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
  hover?: boolean
  children: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const cardVariants = {
      default: 'bg-white/[0.03]',
      elevated: 'bg-white/[0.03] shadow-card',
      bordered: 'bg-transparent border border-white/5',
      glass: 'bg-white/[0.03] backdrop-blur-lg border border-white/5',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-szn)] transition-all duration-300 overflow-hidden',
          cardVariants[variant],
          hover && 'hover:border-burnt-orange/30',
          className
        )}
        whileHover={hover ? { y: -8, boxShadow: '0 0 30px rgba(255, 107, 53, 0.2)' } : undefined}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('overflow-hidden', className)} {...props}>
      <motion.div
        className="w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  )
)

CardImage.displayName = 'CardImage'

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export { Card, CardImage, CardContent }
