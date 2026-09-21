import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from '@/lib/button-variants'

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
export function AnchorButton({ className, variant, size, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants & { children: ReactNode }) {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export { Button }
