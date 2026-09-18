import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-[var(--radius-szn)]',
          'text-text-primary font-[family-name:var(--font-body)] placeholder:text-text-muted',
          'transition-all duration-300 outline-none',
          'focus:border-burnt-orange focus:ring-2 focus:ring-burnt-orange/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
