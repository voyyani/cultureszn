import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* The controls of the bus: LED-green for the one action, chrome-edged for the rest. */
export const buttonVariants = cva(
  'label inline-flex items-center justify-center gap-2 rounded-szn border-2 text-[0.95rem] transition-[background-color,color,border-color,transform] duration-200 ease-out select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-px',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-fg border-accent hover:bg-fg hover:border-fg',
        secondary: 'bg-transparent text-fg border-chrome hover:border-fg hover:bg-bg-raised',
        ghost: 'bg-transparent text-fg-muted border-transparent hover:text-fg hover:bg-bg-raised',
      },
      size: {
        md: 'min-h-11 px-5',
        lg: 'min-h-14 px-7 text-[1.1rem]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
export const buttonClasses = (v: ButtonVariants & { className?: string }) => cn(buttonVariants(v), v.className)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, type = 'button', children, ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
    {children}
  </button>
))
Button.displayName = 'Button'

/** Internal navigation styled as a control — a real <a>, never a button inside a link. */
export function LinkButton({ className, variant, size, children, ...props }: LinkProps & ButtonVariants & { children: ReactNode }) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  )
}

/** External link styled as a control. */
export function AnchorButton({ className, variant, size, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants & { children: ReactNode }) {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export { Button }
