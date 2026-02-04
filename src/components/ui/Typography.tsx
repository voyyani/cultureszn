import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Heading Component */
interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  gradient?: boolean
  children: ReactNode
  className?: string
}

export function Heading({
  as,
  size = 'h2',
  gradient = false,
  children,
  className,
}: HeadingProps) {
  const Component = as || size

  const sizes = {
    h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
    h2: 'text-3xl sm:text-4xl md:text-5xl',
    h3: 'text-2xl sm:text-3xl',
    h4: 'text-xl sm:text-2xl',
    h5: 'text-lg sm:text-xl',
    h6: 'text-base sm:text-lg',
  }

  return (
    <Component
      className={cn(
        'font-[family-name:var(--font-heading)] font-bold leading-tight',
        sizes[size],
        gradient && 'text-gradient',
        className
      )}
    >
      {children}
    </Component>
  )
}

/* Text Component */
interface TextProps {
  as?: 'p' | 'span' | 'div'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: 'primary' | 'secondary' | 'muted' | 'orange' | 'purple'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Text({
  as = 'p',
  size = 'base',
  color = 'primary',
  weight = 'normal',
  children,
  className,
  style,
}: TextProps) {
  const Component = as

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const colors = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    orange: 'text-burnt-orange',
    purple: 'text-deep-purple',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Component
      className={cn(
        'font-[family-name:var(--font-body)]',
        sizes[size],
        colors[color],
        weights[weight],
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
}

/* SectionHeader Component */
interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-16', className)}>
      <Heading size="h2" className="mb-4">
        {title}
      </Heading>
      {subtitle && (
        <Text size="xl" color="secondary" className="max-w-2xl mx-auto">
          {subtitle}
        </Text>
      )}
    </div>
  )
}
