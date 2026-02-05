/**
 * ReleaseCard Component
 * 
 * Premium release card with cover art, metadata, embedded player,
 * and multi-platform streaming links.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Music, 
  Play, 
  Pause, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Users
} from 'lucide-react'
import { Text } from '@/components/ui'
import type { NormalizedRelease } from '@/types/artist'

interface ReleaseCardProps {
  release: NormalizedRelease
  index: number
}

// Platform configuration with brand colors and icons
const platformConfig = {
  spotify: {
    name: 'Spotify',
    color: '#1DB954',
    hoverBg: 'hover:bg-[#1DB954]/10',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  apple: {
    name: 'Apple Music',
    color: '#FA2D48',
    hoverBg: 'hover:bg-[#FA2D48]/10',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  soundcloud: {
    name: 'SoundCloud',
    color: '#FF5500',
    hoverBg: 'hover:bg-[#FF5500]/10',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.099-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094.051 0 .089-.037.104-.09l.21-1.319-.21-1.334c-.015-.057-.054-.09-.09-.09zm1.83-1.229c-.061 0-.104.044-.12.104l-.21 2.563.225 2.458c.009.06.045.104.12.104.074 0 .119-.044.135-.104l.255-2.458-.27-2.563c-.016-.06-.061-.104-.135-.104zm.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.135.149.135.075 0 .135-.061.15-.135l.241-2.544-.241-2.64c-.016-.075-.061-.135-.135-.135zm1.065.45c-.09 0-.149.061-.15.149l-.179 2.193.194 2.505c0 .09.061.15.149.15.09 0 .15-.061.15-.15l.21-2.505-.21-2.193c0-.089-.061-.149-.15-.149zm.93-1.95c-.09 0-.165.075-.165.164l-.165 4.193.18 2.49c0 .09.075.164.165.164s.165-.074.165-.164l.195-2.49-.195-4.193c0-.089-.075-.164-.165-.164zm.976-.428c-.105 0-.18.074-.18.179l-.15 4.575.165 2.459c0 .104.074.18.18.18.104 0 .18-.075.18-.18l.18-2.459-.195-4.575c0-.105-.075-.18-.18-.18zm1.02.15c-.12 0-.195.075-.195.195l-.135 4.5.135 2.43c.015.12.09.195.195.195.12 0 .195-.075.21-.195l.165-2.43-.165-4.5c-.015-.12-.09-.195-.21-.195zm.99-.615c-.12 0-.21.089-.21.209l-.135 5.1.15 2.401c0 .119.09.209.21.209.119 0 .209-.09.209-.209l.165-2.401-.165-5.1c0-.12-.09-.21-.21-.21zm1.095.39c-.135 0-.225.09-.24.226l-.12 4.695.135 2.369c.015.136.105.227.24.227.119 0 .224-.091.224-.227l.15-2.369-.15-4.695c0-.136-.104-.226-.225-.226zm.93-.539c-.15 0-.255.105-.255.254l-.091 4.635.105 2.34c.015.149.105.254.255.254.135 0 .24-.105.255-.255l.12-2.339-.12-4.635c-.015-.15-.12-.255-.255-.255zm1.17-.405c-.165 0-.285.12-.285.285l-.09 4.649.105 2.325c0 .165.12.284.285.284.165 0 .285-.119.3-.284l.105-2.325-.12-4.649c0-.165-.12-.285-.285-.285zm2.25 2.94c-.285 0-.555.045-.81.135-.105-1.155-1.08-2.07-2.265-2.07-.3 0-.585.06-.855.165-.105.045-.135.091-.135.181v4.949c0 .09.074.165.164.18h3.9c1.006 0 1.83-.824 1.83-1.83s-.824-1.71-1.83-1.71z"/>
      </svg>
    ),
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/10',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
}

// Get relative time string
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Get formatted date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Extract Spotify track ID from URL
function getSpotifyTrackId(url: string): string | null {
  const match = url.match(/track\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

type ReleaseLinks = NormalizedRelease['links']

function getPrimaryLink(links: ReleaseLinks): { url: string | undefined; platform: keyof ReleaseLinks | null } {
  if (links.youtube) return { url: links.youtube, platform: 'youtube' }
  if (links.soundcloud) return { url: links.soundcloud, platform: 'soundcloud' }
  if (links.spotify) return { url: links.spotify, platform: 'spotify' }
  if (links.apple) return { url: links.apple, platform: 'apple' }
  return { url: undefined, platform: null }
}

export function ReleaseCard({ release, index }: ReleaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)

  const { url: primaryLink, platform: primaryPlatform } = getPrimaryLink(release.links)
  const spotifyTrackId =
    primaryPlatform === 'spotify' && release.links.spotify
      ? getSpotifyTrackId(release.links.spotify)
      : null
  const hasMultiplePlatforms = Object.values(release.links).filter(Boolean).length > 1
  const hasPlayableLink = Boolean(primaryLink)

  // Type badge color mapping
  const typeBadgeConfig: Record<string, { bg: string; text: string }> = {
    single: { bg: 'bg-burnt-orange/20', text: 'text-burnt-orange' },
    ep: { bg: 'bg-sunset-purple/20', text: 'text-sunset-purple' },
    album: { bg: 'bg-deep-purple/20', text: 'text-deep-purple' },
    feature: { bg: 'bg-white/10', text: 'text-text-secondary' },
    mixtape: { bg: 'bg-green-500/20', text: 'text-green-400' },
    project: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  }

  const typeConfig = typeBadgeConfig[release.type] || typeBadgeConfig.single

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ 
        y: -12,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="group relative bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden hover:border-burnt-orange/30 transition-colors duration-300"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 53, 0.2) 0%, transparent 50%)',
          filter: 'blur(20px)',
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Cover Art Section */}
      <div className="relative aspect-square overflow-hidden">
        {/* Cover Image or Gradient Placeholder */}
        {release.coverArt ? (
          <img
            src={release.coverArt}
            alt={release.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-burnt-orange/30 via-sunset-purple/20 to-deep-purple/30 flex items-center justify-center">
            <Music size={64} className="text-white/20" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button Overlay with Pulse Animation */}
        {hasPlayableLink && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            {spotifyTrackId ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowEmbed(!showEmbed)
                  setIsPlaying(!isPlaying)
                }}
                className="relative w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center shadow-2xl shadow-[#1DB954]/30"
              >
                {/* Pulse rings */}
                {!isPlaying && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#1DB954]"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#1DB954]"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.4, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.5,
                      }}
                    />
                  </>
                )}
                {isPlaying ? (
                  <Pause size={28} className="relative text-white" />
                ) : (
                  <Play size={28} className="relative text-white ml-1" />
                )}
              </motion.button>
            ) : (
              <motion.a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-16 rounded-full bg-burnt-orange flex items-center justify-center shadow-2xl"
              >
                {/* Pulse ring for non-Spotify */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-burnt-orange"
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                <Play size={28} className="relative text-white ml-1" />
              </motion.a>
            )}
          </div>
        )}

        {/* Type Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${typeConfig.bg} ${typeConfig.text} backdrop-blur-sm`}>
            {release.type}
          </span>
        </div>

        {/* Index Badge - Top Left */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-white/70">{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold mb-2 line-clamp-2 group-hover:text-burnt-orange transition-colors">
          {release.title}
        </h3>

        {/* Release Date with Relative Time */}
        <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
          <Calendar size={14} />
          <span>{formatDate(release.releaseDate)}</span>
          <span className="text-text-muted/50">•</span>
          <span className="text-burnt-orange/80">{getRelativeTime(release.releaseDate)}</span>
        </div>

        {/* Featured Artists */}
        {release.featuredArtists.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-sunset-purple" />
            <Text color="secondary" size="sm">
              feat. {release.featuredArtists.join(', ')}
            </Text>
          </div>
        )}

        {/* Primary Streaming Link */}
        <div className="flex gap-2 mb-3">
          {release.links.spotify && (
            <a
              href={release.links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors text-sm font-medium"
            >
              {platformConfig.spotify.icon}
              Play on Spotify
            </a>
          )}
        </div>

        {/* Expandable Multi-Platform Links */}
        {hasMultiplePlatforms && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-2 text-text-muted hover:text-text-secondary transition-colors text-sm"
            >
              <span>{isExpanded ? 'Hide platforms' : 'More platforms'}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-white/5 mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(release.links).map(([platform, url]) => {
                      if (!url || platform === 'spotify') return null
                      const config = platformConfig[platform as keyof typeof platformConfig]
                      if (!config) return null

                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-text-secondary`}
                          style={{ '--platform-color': config.color } as React.CSSProperties}
                        >
                          <span style={{ color: config.color }}>{config.icon}</span>
                          <span>{config.name}</span>
                          <ExternalLink size={12} className="ml-auto opacity-50" />
                        </a>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Embedded Player (Hidden by default) */}
      <AnimatePresence>
        {showEmbed && spotifyTrackId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <iframe
              src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-b-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
