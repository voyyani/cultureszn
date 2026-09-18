/**
 * PlatformLinks Component
 * 
 * Social/streaming platform links with:
 * - Platform-specific icons with brand colors
 * - Verified badge indicators
 * - Hover animations
 * - Tooltip labels
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCheck, Instagram, Twitter, Music2 } from 'lucide-react'
import { PLATFORMS, PLATFORM_ORDER, type PlatformKey } from '@/config/platforms'
import { BrandIcon } from '@/components/icons'

interface PlatformLinksProps {
  links: Partial<Record<LinkKey, string>>
  verified?: string[] // List of verified platform keys
  size?: 'sm' | 'md' | 'lg'
}

// Streaming platforms come from the single registry; socials are the only local entries.
type LinkKey = PlatformKey | 'instagram' | 'twitter' | 'tiktok'

const SOCIAL: Record<'instagram' | 'twitter' | 'tiktok', { name: string; color: string; icon: React.ReactNode }> = {
  instagram: { name: 'Instagram', color: '#E4405F', icon: <Instagram className="w-full h-full" /> },
  twitter: { name: 'X (Twitter)', color: '#FFFFFF', icon: <Twitter className="w-full h-full" /> },
  tiktok: { name: 'TikTok', color: '#FFFFFF', icon: <Music2 className="w-full h-full" /> },
}

const LINK_ORDER: LinkKey[] = [...PLATFORM_ORDER, 'instagram', 'twitter', 'tiktok']

function describe(key: LinkKey): { name: string; color: string; icon: React.ReactNode } {
  if (key in PLATFORMS) {
    const k = key as PlatformKey
    return { name: PLATFORMS[k].label, color: PLATFORMS[k].color, icon: <BrandIcon platform={k} size={20} className="w-full h-full" /> }
  }
  return SOCIAL[key as keyof typeof SOCIAL]
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function PlatformLinks({ links, verified = [], size = 'md' }: PlatformLinksProps) {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

  const availableLinks = LINK_ORDER.flatMap((key): Array<[LinkKey, string]> => (links[key] ? [[key, links[key]]] : []))

  return (
    <div className="flex flex-wrap items-center gap-3">
      {availableLinks.map(([key, url]) => {
        const platform = describe(key)
        if (!url) return null

        const isVerified = verified.includes(key)

        return (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => setHoveredPlatform(key)}
            onMouseLeave={() => setHoveredPlatform(null)}
          >
            <motion.a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex items-center justify-center
                ${sizeClasses[size]}
                rounded-full bg-white/5 border border-white/10
                hover:bg-white/10 hover:border-white/20
                transition-colors duration-300
                group
              `}
              style={{
                ['--platform-color' as string]: platform.color,
              }}
            >
              {/* Icon */}
              <span 
                className={`${iconSizes[size]} text-text-secondary group-hover:text-white transition-colors`}
                style={{ color: hoveredPlatform === key ? platform.color : undefined }}
              >
                {platform.icon}
              </span>

              {/* Verified badge */}
              {isVerified && (
                <span 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: platform.color }}
                >
                  <BadgeCheck size={10} className="text-white" />
                </span>
              )}
            </motion.a>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredPlatform === key && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white/10 backdrop-blur-lg rounded-lg border border-white/10 whitespace-nowrap z-20"
                >
                  <span className="text-sm text-white flex items-center gap-1.5">
                    {platform.name}
                    {isVerified && (
                      <BadgeCheck size={12} style={{ color: platform.color }} />
                    )}
                  </span>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
