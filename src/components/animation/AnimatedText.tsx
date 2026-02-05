/**
 * AnimatedText Component
 * 
 * Character-by-character text reveal with stagger animation.
 * Supports multiple animation styles and triggers.
 */

import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'

type AnimationStyle = 
  | 'fadeUp'       // Characters fade in and move up
  | 'fadeDown'     // Characters fade in and move down
  | 'scale'        // Characters scale in from 0
  | 'rotate'       // Characters rotate in
  | 'blur'         // Characters unblur
  | 'glitch'       // Glitch effect with random offsets
  | 'typewriter'   // Classic typewriter effect
  | 'wave'         // Wave-like animation

interface AnimatedTextProps {
  text: string
  /** Element type to render */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  /** Animation style */
  style?: AnimationStyle
  /** Delay before animation starts (in seconds) */
  delay?: number
  /** Duration per character (in seconds) */
  duration?: number
  /** Stagger delay between characters (in seconds) */
  stagger?: number
  /** Trigger animation when in view */
  triggerOnView?: boolean
  /** Repeat animation when entering view again */
  repeatOnView?: boolean
  /** Custom class name */
  className?: string
  /** Callback when animation completes */
  onComplete?: () => void
  /** Whether to split by word instead of character */
  splitBy?: 'character' | 'word'
  /** Cursor effect for typewriter */
  showCursor?: boolean
}

// Animation variants for different styles
const getCharacterVariants = (style: AnimationStyle): Variants => {
  switch (style) {
    case 'fadeUp':
      return {
        hidden: { 
          opacity: 0, 
          y: 50,
          rotateX: -90,
        },
        visible: { 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          transition: {
            type: 'spring',
            damping: 12,
            stiffness: 200,
          },
        },
      }
    case 'fadeDown':
      return {
        hidden: { opacity: 0, y: -50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            damping: 12,
            stiffness: 200,
          },
        },
      }
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: {
            type: 'spring',
            damping: 10,
            stiffness: 300,
          },
        },
      }
    case 'rotate':
      return {
        hidden: { opacity: 0, rotate: 180, scale: 0 },
        visible: { 
          opacity: 1, 
          rotate: 0, 
          scale: 1,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 200,
          },
        },
      }
    case 'blur':
      return {
        hidden: { opacity: 0, filter: 'blur(20px)' },
        visible: { 
          opacity: 1, 
          filter: 'blur(0px)',
          transition: {
            duration: 0.4,
          },
        },
      }
    case 'glitch':
      return {
        hidden: { 
          opacity: 0, 
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 400,
          },
        },
      }
    case 'typewriter':
      return {
        hidden: { opacity: 0, width: 0 },
        visible: { 
          opacity: 1, 
          width: 'auto',
          transition: {
            duration: 0.05,
          },
        },
      }
    case 'wave':
      return {
        hidden: { y: 0 },
        visible: (i: number) => ({
          y: [0, -20, 0],
          transition: {
            delay: i * 0.05,
            duration: 0.5,
            repeat: 0,
            ease: 'easeInOut',
          },
        }),
      }
    default:
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }
  }
}

// Container variants for staggering
const getContainerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

export function AnimatedText({
  text,
  as: Component = 'span',
  style = 'fadeUp',
  delay = 0,
  stagger = 0.03,
  triggerOnView = true,
  repeatOnView = false,
  className = '',
  onComplete,
  splitBy = 'character',
  showCursor = false,
}: AnimatedTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: !repeatOnView, 
    margin: '-10% 0px -10% 0px' 
  })
  const [shouldAnimate, setShouldAnimate] = useState(!triggerOnView)

  useEffect(() => {
    if (triggerOnView && isInView) {
      setShouldAnimate(true)
    } else if (!triggerOnView) {
      setShouldAnimate(true)
    }
  }, [isInView, triggerOnView])

  // Split text into characters or words
  const elements = useMemo(() => {
    if (splitBy === 'word') {
      return text.split(' ').map((word, i, arr) => ({
        content: word + (i < arr.length - 1 ? '\u00A0' : ''),
        key: `word-${i}`,
      }))
    }
    return text.split('').map((char, i) => ({
      content: char === ' ' ? '\u00A0' : char,
      key: `char-${i}`,
    }))
  }, [text, splitBy])

  const characterVariants = getCharacterVariants(style)
  const containerVariants = getContainerVariants(stagger, delay)

  const handleAnimationComplete = () => {
    onComplete?.()
  }

  const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.span

  return (
    <MotionComponent
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      onAnimationComplete={handleAnimationComplete}
      className={`inline-flex flex-wrap ${className}`}
      style={{ perspective: '1000px' }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={element.key}
          variants={characterVariants}
          custom={index}
          className="inline-block"
          style={{ 
            display: 'inline-block',
            whiteSpace: 'pre',
            transformOrigin: 'center bottom',
          }}
        >
          {element.content}
        </motion.span>
      ))}
      {showCursor && style === 'typewriter' && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[3px] h-[1em] bg-current ml-1"
        />
      )}
    </MotionComponent>
  )
}

/**
 * Animated gradient text that shimmers
 */
interface ShimmerTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  colors?: string[]
  duration?: number
}

export function ShimmerText({
  text,
  as: Component = 'span',
  className = '',
  colors = ['#FF6B35', '#FF8F65', '#FFB347', '#FF6B35'],
  duration = 3,
}: ShimmerTextProps) {
  return (
    <Component className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      <span 
        aria-hidden="true"
        className="relative"
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: `shimmerText ${duration}s linear infinite`,
        }}
      >
        {text}
      </span>
      <style>{`
        @keyframes shimmerText {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Component>
  )
}

/**
 * Typing effect that types out text character by character
 */
interface TypewriterTextProps {
  text: string
  speed?: number // Characters per second
  delay?: number
  className?: string
  showCursor?: boolean
  onComplete?: () => void
}

export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  className = '',
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let currentIndex = 0
    const intervalMs = 1000 / speed

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, intervalMs)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, isInView, onComplete])

  return (
    <span ref={ref} className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[2px] h-[1em] bg-burnt-orange ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

/**
 * Split text reveal - reveals text line by line or word by word
 */
interface SplitRevealProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  duration?: number
}

export function SplitReveal({
  children,
  as: Component = 'p',
  className = '',
  delay = 0,
  duration = 0.6,
}: SplitRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const words = children.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  }

  const word: Variants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    },
  }

  const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.p

  return (
    <MotionComponent
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          className="inline-block mr-[0.25em]"
          style={{ transformOrigin: 'center bottom' }}
        >
          {w}
        </motion.span>
      ))}
    </MotionComponent>
  )
}
