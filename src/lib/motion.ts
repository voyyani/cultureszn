import type { Variants, Transition } from 'framer-motion'

/* The nganya's motion grammar, authored once. Three moves and nothing else:
   - pullIn: panels arrive from the right, the bus pulling into the stage (staggered)
   - switchOn: an LED element reveals left→right as if powered up (CSS `.switch-on`; used via Reveal)
   - pageTransition: a short cut between routes */

export const easeOut: Transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] }

export const pullIn: Variants = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0, transition: easeOut },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}
