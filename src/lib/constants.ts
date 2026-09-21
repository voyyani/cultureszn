/**
 * Navigation links (only surfaces that exist). On the route board these are destinations.
 */
export const NAV_LINKS = [
  { name: 'Artists', href: '/artists' },
  { name: 'Releases', href: '/releases' },
  { name: 'SZNals', href: '/sznals' },
  { name: 'Join SZN', href: '/join' },
] as const
export const FOOTER_LINKS = NAV_LINKS
