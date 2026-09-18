/**
 * Navigation links (only surfaces that exist)
 */
export const NAV_LINKS = [
  { name: 'Artists', href: '/artists' },
  { name: 'Releases', href: '/releases' },
  { name: 'SZNals', href: '/sznals' },
  { name: 'Join SZN', href: '/join' },
] as const
export const FOOTER_LINKS = NAV_LINKS

/**
 * Breakpoints (matching Tailwind)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * Animation settings
 */
export const ANIMATION_CONFIG = {
  reducedMotion: false, // Will be updated based on user preference
  defaultDuration: 0.5,
  staggerDelay: 0.1,
} as const
