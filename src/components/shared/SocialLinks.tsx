import { motion } from 'framer-motion'
import { Instagram, Twitter, ExternalLink } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BrandIcon } from '@/components/icons'
import type { PlatformKey } from '@/config/platforms'

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  links: {
    instagram?: string
    twitter?: string
    spotify?: string
    soundcloud?: string
    youtube?: string
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
}
const BRAND: Partial<Record<string, PlatformKey>> = { spotify: 'spotify', soundcloud: 'soundcloud', youtube: 'youtube' }

const sizeMap = {
  sm: { wrapper: 'w-8 h-8', icon: 16 },
  md: { wrapper: 'w-10 h-10', icon: 18 },
  lg: { wrapper: 'w-12 h-12', icon: 22 },
}

export function SocialLinks({ links, size = 'md', className }: SocialLinksProps) {
  const socialLinks: SocialLink[] = Object.entries(links)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({ platform, url: url! }))

  if (socialLinks.length === 0) return null

  const { wrapper, icon } = sizeMap[size]

  return (
    <div className={`flex gap-3 ${className}`}>
      {socialLinks.map(({ platform, url }) => {
        const brand = BRAND[platform]
        const Icon = iconMap[platform] || ExternalLink

        return (
          <motion.a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${wrapper} rounded-full bg-white/5 flex items-center justify-center
                       text-text-secondary hover:text-white transition-colors`}
            whileHover={{
              y: -3,
              background: 'linear-gradient(135deg, #FF6B35 0%, #6A11CB 50%, #2575FC 100%)',
            }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Visit ${platform}`}
          >
            {brand ? <BrandIcon platform={brand} size={icon} /> : <Icon size={icon} />}
          </motion.a>
        )
      })}
    </div>
  )
}
