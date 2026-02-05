/**
 * PageTransition Component
 * 
 * Smooth page transitions with shared element animations.
 * Wraps route content for enter/exit animations.
 */

import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Transition types
type TransitionType = 
  | 'fade'
  | 'slide'
  | 'slideUp'
  | 'slideDown'
  | 'scale'
  | 'blur'
  | 'morph'

interface PageTransitionProps {
  children: ReactNode
  type?: TransitionType
  duration?: number
  className?: string
}

// Transition variants
const getVariants = (type: TransitionType): Variants => {
  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    case 'slide':
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
      }
    case 'slideUp':
      return {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 },
      }
    case 'slideDown':
      return {
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 50, opacity: 0 },
      }
    case 'scale':
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.1, opacity: 0 },
      }
    case 'blur':
      return {
        initial: { opacity: 0, filter: 'blur(20px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(20px)' },
      }
    case 'morph':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.95,
          borderRadius: '50%',
        },
        animate: { 
          opacity: 1, 
          scale: 1,
          borderRadius: '0%',
        },
        exit: { 
          opacity: 0, 
          scale: 1.05,
          borderRadius: '50%',
        },
      }
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
  }
}

/**
 * Main page transition wrapper
 */
export function PageTransition({ 
  children, 
  type = 'slideUp',
  duration = 0.4,
  className = '',
}: PageTransitionProps) {
  const location = useLocation()
  const variants = getVariants(type)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1], // Custom easing
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Stagger container for child element animations
 */
interface StaggerContainerProps {
  children: ReactNode
  stagger?: number
  delay?: number
  className?: string
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className = '',
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger item - must be child of StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}: StaggerItemProps) {
  const offsets = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0,
      ...offsets[direction],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * Shared element transition context
 * For hero image / element morphing between pages
 */
interface SharedElementContextType {
  registerElement: (id: string, rect: DOMRect) => void
  getElement: (id: string) => DOMRect | undefined
  clearElement: (id: string) => void
}

const SharedElementContext = createContext<SharedElementContextType | null>(null)

export function SharedElementProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<Map<string, DOMRect>>(new Map())

  const registerElement = useCallback((id: string, rect: DOMRect) => {
    setElements((prev) => new Map(prev).set(id, rect))
  }, [])

  const getElement = useCallback((id: string) => {
    return elements.get(id)
  }, [elements])

  const clearElement = useCallback((id: string) => {
    setElements((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  return (
    <SharedElementContext.Provider value={{ registerElement, getElement, clearElement }}>
      {children}
    </SharedElementContext.Provider>
  )
}

export function useSharedElement() {
  const context = useContext(SharedElementContext)
  if (!context) {
    throw new Error('useSharedElement must be used within SharedElementProvider')
  }
  return context
}

/**
 * Shared element that morphs between pages
 */
interface SharedElementProps {
  id: string
  children: ReactNode
  className?: string
}

export function SharedElement({ id, children, className = '' }: SharedElementProps) {
  // Context available for future shared element morphing
  useSharedElement()
  
  return (
    <motion.div
      layoutId={id}
      className={className}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 120,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Route overlay for modal-style page transitions
 */
interface RouteOverlayProps {
  children: ReactNode
  onClose?: () => void
}

export function RouteOverlay({ children, onClose }: RouteOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
        }}
        className="absolute inset-x-0 bottom-0 top-12 bg-matte-black rounded-t-3xl overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Scroll-linked page progress indicator
 */
export function PageProgressBar() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-burnt-orange z-50 origin-left"
      style={{
        scaleX: 0,
      }}
      // This would need to be hooked up to scroll progress
    />
  )
}
