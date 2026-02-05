/**
 * StreamingBar Component
 * 
 * One-tap access to all streaming platforms with:
 * - Platform-specific branding and icons
 * - Horizontal scroll on mobile, grid on desktop
 * - Deep link support for native apps
 * - Hover animations and visual feedback
 */

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'

interface StreamingLink {
  platform: string
  url: string
  label: string
}

interface StreamingBarProps {
  links: StreamingLink[]
  artistName?: string
}

// Platform configuration with colors and icons
const platformConfig: Record<string, { 
  icon: React.ReactNode
  color: string
  hoverBg: string
  hoverBorder: string
}> = {
  spotify: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: '#1DB954',
    hoverBg: 'hover:bg-[#1DB954]/10',
    hoverBorder: 'hover:border-[#1DB954]/50',
  },
  apple: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.997 6.124a9.23 9.23 0 0 0-.24-2.19C23.407 2.186 21.815.596 20.07.246a9.23 9.23 0 0 0-2.19-.24C16.5 0 15.93 0 12 0S7.5 0 6.12.006a9.23 9.23 0 0 0-2.19.24C2.185.596.596 2.186.246 3.934a9.23 9.23 0 0 0-.24 2.19C0 7.5 0 8.07 0 12s0 4.5.006 5.88a9.23 9.23 0 0 0 .24 2.19c.35 1.748 1.94 3.338 3.69 3.688a9.23 9.23 0 0 0 2.19.24C7.5 24 8.07 24 12 24s4.5 0 5.88-.006a9.23 9.23 0 0 0 2.19-.24c1.748-.35 3.338-1.94 3.688-3.69a9.23 9.23 0 0 0 .24-2.19C24 16.5 24 15.93 24 12s0-4.5-.003-5.876zM12 18.75a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5zm7.125-12.188a1.688 1.688 0 1 1 0-3.375 1.688 1.688 0 0 1 0 3.375z"/>
        <circle cx="12" cy="12" r="4.5"/>
      </svg>
    ),
    color: '#FA2D48',
    hoverBg: 'hover:bg-[#FA2D48]/10',
    hoverBorder: 'hover:border-[#FA2D48]/50',
  },
  soundcloud: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899 1.05c-.05 0-.09.04-.099.1l-.199 1.104.199 1.05c.009.06.049.1.099.1.05 0 .09-.04.099-.1l.249-1.05-.249-1.104c-.009-.06-.049-.1-.099-.1zm1.798-.799c-.06 0-.105.05-.105.1l-.21 1.854.21 1.754c0 .06.045.1.105.1.05 0 .095-.04.105-.1l.249-1.754-.249-1.854c-.01-.05-.055-.1-.105-.1zm.9-.65c-.065 0-.115.055-.125.115l-.199 2.504.199 2.354c.01.06.06.11.125.11.06 0 .105-.05.115-.11l.225-2.354-.225-2.504c-.01-.06-.055-.115-.115-.115zm.9-.5c-.07 0-.12.06-.13.12l-.179 3.004.179 2.754c.01.065.06.115.13.115.065 0 .115-.05.125-.115l.2-2.754-.2-3.004c-.01-.06-.06-.12-.125-.12zm.899-.4c-.075 0-.125.065-.135.125l-.16 3.404.16 2.854c.01.07.06.12.135.12.07 0 .12-.05.13-.12l.18-2.854-.18-3.404c-.01-.06-.06-.125-.13-.125zm.9-.399c-.08 0-.135.07-.145.14l-.14 3.803.14 2.904c.01.07.065.125.145.125.075 0 .13-.055.14-.125l.16-2.904-.16-3.803c-.01-.07-.065-.14-.14-.14zm.9-.25c-.085 0-.14.075-.155.15l-.12 4.053.12 2.904c.015.08.07.13.155.13.08 0 .135-.05.15-.13l.135-2.904-.135-4.053c-.015-.075-.07-.15-.15-.15zm1.799-1.6c-.1 0-.165.085-.175.175l-.095 5.653.095 2.854c.01.085.075.15.175.15.095 0 .16-.065.175-.15l.105-2.854-.105-5.653c-.015-.09-.08-.175-.175-.175zm.9.65c-.105 0-.17.09-.185.19l-.075 5.003.075 2.804c.015.09.08.16.185.16.1 0 .165-.07.18-.16l.085-2.804-.085-5.003c-.015-.1-.08-.19-.18-.19zm.899-.2c-.11 0-.18.095-.195.2l-.055 5.203.055 2.754c.015.1.085.17.195.17.105 0 .175-.07.19-.17l.065-2.754-.065-5.203c-.015-.105-.085-.2-.19-.2zm1.8-.85c-.12 0-.195.105-.21.215l-.035 6.053.035 2.704c.015.105.09.18.21.18.115 0 .19-.075.21-.18l.04-2.704-.04-6.053c-.02-.11-.095-.215-.21-.215zm.899.5c-.125 0-.2.11-.22.22l-.015 5.553.015 2.654c.02.11.095.185.22.185.12 0 .195-.075.215-.185l.02-2.654-.02-5.553c-.02-.11-.095-.22-.215-.22z"/>
      </svg>
    ),
    color: '#FF5500',
    hoverBg: 'hover:bg-[#FF5500]/10',
    hoverBorder: 'hover:border-[#FF5500]/50',
  },
  youtube: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/10',
    hoverBorder: 'hover:border-[#FF0000]/50',
  },
}

// Default config for unknown platforms
const defaultConfig = {
  icon: <span className="text-lg">🎧</span>,
  color: '#FF6B35',
  hoverBg: 'hover:bg-burnt-orange/10',
  hoverBorder: 'hover:border-burnt-orange/50',
}

export function StreamingBar({ links, artistName }: StreamingBarProps) {
  if (links.length === 0) return null

  return (
    <section className="py-6 border-y border-white/5 bg-gradient-to-r from-white/[0.02] via-white/[0.04] to-white/[0.02]">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          {/* Section label */}
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-sm mb-4 uppercase tracking-widest"
          >
            Stream {artistName}
          </motion.p>

          {/* Platform links - horizontal scroll on mobile */}
          <motion.div
            variants={fadeInUp}
            className="w-full overflow-x-auto scrollbar-hide"
          >
            <div className="flex justify-center gap-3 min-w-max px-4 md:px-0">
              {links.map((link, index) => {
                const config = platformConfig[link.platform] || defaultConfig

                return (
                  <motion.a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      boxShadow: `0 10px 40px -10px ${config.color}40`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      group flex items-center gap-3 px-5 py-3 
                      rounded-xl bg-white/[0.03] 
                      border border-white/10 
                      ${config.hoverBg} ${config.hoverBorder}
                      transition-colors duration-300
                      backdrop-blur-sm
                    `}
                    style={{
                      // Add subtle glow on hover via CSS custom property
                      ['--glow-color' as string]: config.color,
                    }}
                  >
                    {/* Platform icon with color and pulse on hover */}
                    <motion.span 
                      className="transition-colors duration-300"
                      style={{ color: config.color }}
                      whileHover={{
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.3 },
                      }}
                    >
                      {config.icon}
                    </motion.span>

                    {/* Label */}
                    <span className="font-medium text-text-primary group-hover:text-white transition-colors">
                      {link.label}
                    </span>

                    {/* External link indicator with entrance animation */}
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      <ExternalLink 
                        size={12} 
                        className="text-text-muted group-hover:text-white/60 transition-colors ml-1" 
                      />
                    </motion.span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Deep link hint on mobile */}
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-xs mt-4 md:hidden"
          >
            Opens in app if installed
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
