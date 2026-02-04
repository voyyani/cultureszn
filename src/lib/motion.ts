import type { Variants, Transition } from 'framer-motion'

/**
 * Default transition timing
 */
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94],
}

/**
 * Spring transition for interactive elements
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
}

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: { opacity: 0 },
}

/**
 * Fade in with upward movement
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: { opacity: 0, y: -20 },
}

/**
 * Fade in with downward movement
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: { opacity: 0, y: 20 },
}

/**
 * Slide in from left
 */
export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: { opacity: 0, x: -50 },
}

/**
 * Slide in from right
 */
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: { opacity: 0, x: 50 },
}

/**
 * Scale up animation
 */
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * Stagger container for child animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Stagger container with faster timing
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

/**
 * Hover scale effect
 */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springTransition,
}

/**
 * Hover lift effect (scale + shadow)
 */
export const hoverLift = {
  whileHover: { 
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  whileTap: { scale: 0.98 },
}

/**
 * Card hover animation
 */
export const cardHover: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Image zoom on hover (for container)
 */
export const imageZoom = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/**
 * Text reveal animation (for headlines)
 */
export const textReveal: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
}

/**
 * Page transition
 */
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

/**
 * Navbar animation
 */
export const navbarVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

/**
 * Mobile menu animation
 */
export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

/**
 * Counter animation settings
 */
export const counterAnimation = {
  duration: 2,
  ease: 'easeOut' as const,
}
