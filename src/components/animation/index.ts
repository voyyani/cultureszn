/**
 * Animation Components & Hooks
 * 
 * Export all animation-related components and utilities.
 */

// Text animations
export { 
  AnimatedText, 
  ShimmerText, 
  TypewriterText,
  SplitReveal,
} from './AnimatedText'

// Page transitions
export {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  SharedElementProvider,
  SharedElement,
  RouteOverlay,
  useSharedElement,
} from './PageTransition'

// Hover effects
export {
  HoverCard,
  HoverGlow,
  MagneticButton,
  TiltCard,
  useMousePosition,
} from './HoverEffects'

// Pulse and attention animations
export {
  PulseButton,
  AttentionIndicator,
  BreathingGlow,
} from './PulseEffects'
