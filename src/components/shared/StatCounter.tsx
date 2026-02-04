import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Stat } from '@/types'

interface StatCounterProps extends Stat {
  className?: string
}

export function StatCounter({ value, suffix, label, className }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepValue = value / steps
    const stepDuration = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(stepValue * currentStep))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h3 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-gradient mb-2">
        {count}
        {suffix}
      </h3>
      <p className="text-sm text-text-secondary uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  )
}
