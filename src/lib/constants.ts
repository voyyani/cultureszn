/**
 * Site configuration
 */
export const SITE_CONFIG = {
  name: 'Culture SZN',
  tagline: "Nairobi's Creative Ecosystem",
  description:
    "Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's next-generation creatives. We're the city's creative nervous system—where music, design, and cultural expression converge.",
  url: 'https://cultureszn.com',
  image: '/og-image.jpg',
  twitter: '@cultureszn',
  locale: 'en_US',
}

/**
 * Navigation links
 */
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Members', href: '/#members' },
  { name: 'Releases', href: '/#releases' },
  { name: 'Movement', href: '/#movement' },
  { name: 'SZNals', href: '/#sznals' },
] as const

/**
 * Social links
 */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/cultureszn',
  twitter: 'https://twitter.com/cultureszn',
  spotify: 'https://open.spotify.com/artist/cultureszn',
  youtube: 'https://youtube.com/@cultureszn',
  soundcloud: 'https://soundcloud.com/cultureszn',
} as const

/**
 * Footer links
 */
export const FOOTER_LINKS = {
  collective: [
    { name: 'Members', href: '/#members' },
    { name: 'Releases', href: '/#releases' },
    { name: 'SZNals', href: '/#sznals' },
    { name: 'Events', href: '/events' },
    { name: 'Collaborate', href: '/collaborate' },
  ],
  platform: [
    { name: 'SZN Hub', href: '/hub' },
    { name: 'Community', href: '/community' },
    { name: 'Merchandise', href: '/merch' },
    { name: 'Live Sessions', href: '/sessions' },
    { name: 'Archives', href: '/archives' },
  ],
} as const

/**
 * Hero stats
 */
export const HERO_STATS = [
  { value: 5, suffix: '', label: 'Creative Members' },
  { value: 35, suffix: '+', label: 'Tracks Released' },
  { value: 3, suffix: '', label: 'Projects Dropped' },
] as const

/**
 * Movement stats
 */
export const MOVEMENT_STATS = [
  { value: 12, suffix: '+', label: 'Collaborative Projects' },
  { value: 6, suffix: '', label: 'Countries Reached' },
  { value: 50, suffix: 'K+', label: 'Community Members' },
] as const

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
