import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 font-[family-name:var(--font-heading)] font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-sunset text-white shadow-soft hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:-translate-y-0.5',
        outline:
          'bg-transparent text-text-primary border-2 border-white/10 hover:border-burnt-orange hover:bg-burnt-orange/5',
        ghost: 'bg-transparent text-text-primary hover:bg-white/5',
        link: 'bg-transparent text-burnt-orange underline-offset-4 hover:underline p-0',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-base rounded-[var(--radius-szn)]',
        lg: 'h-14 px-8 text-lg rounded-[var(--radius-szn)]',
        xl: 'h-16 px-10 text-xl rounded-[var(--radius-szn)]',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
