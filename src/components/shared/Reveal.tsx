import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'
import { pullIn, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Move = 'pull-in' | 'switch-on'

/**
 * The single entrance primitive. `pull-in` slides children in from the right (the bus pulling in);
 * `switch-on` reveals an LED element left→right. Under reduced motion it renders a plain element.
 * With `stagger`, direct children wrapped in <Reveal.Item> arrive one after another.
 */
export function Reveal({ children, move = 'pull-in', stagger = false, once = true, className, as = 'div' }:
  { children: ReactNode; move?: Move; stagger?: boolean; once?: boolean; className?: string; as?: 'div' | 'section' | 'ul' | 'li' }) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  if (move === 'switch-on') {
    const Tag = as
    return <Tag className={cn('switch-on', className)}>{children}</Tag>
  }
  const M = motion[as]
  return (
    <M
      className={className}
      variants={stagger ? staggerContainer : pullIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount: 0.15 }}
    >
      {children}
    </M>
  )
}

function Item({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduced = useReducedMotion()
  const Tag = as
  if (reduced) return <Tag className={className}>{children}</Tag>
  const M = motion[as]
  return <M className={className} variants={pullIn}>{children}</M>
}
Reveal.Item = Item
