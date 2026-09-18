/**
 * ArtistHero Component
 * 
 * Cinematic hero section for artist profiles with:
 * - Centered artist photo (4:5 aspect ratio)
 * - Animated name reveal with pronunciation tooltip
 * - Location & genre badges
 * - Aliases display
 * - Platform-specific verified social icons
 * - Scroll-driven parallax background
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Mic2, BadgeCheck, Info } from 'lucide-react'
import { Button, Badge, Text } from '@/components/ui'
import { PlatformLinks } from './PlatformLinks'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { useHeroParallax } from '@/hooks'
import type { NormalizedArtist } from '@/types'

interface ArtistHeroProps {
  artist: NormalizedArtist
}

// Character-by-character animation for the name
const nameVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const letterVariants = {
  initial: { opacity: 0, y: 50, rotateX: -90 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring' as const,
      damping: 12,
      stiffness: 200,
    },
  },
}

export function ArtistHero({ artist }: ArtistHeroProps) {
  const [showPronunciation, setShowPronunciation] = useState(false)
  const { backgroundStyle } = useHeroParallax(0.4)
  const locationLabel =
    artist.location && artist.country && artist.location.toLowerCase() !== artist.country.toLowerCase()
      ? `${artist.location}, ${artist.country}`
      : artist.country || artist.location

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Layer */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={backgroundStyle}
      >
        {/* Background Gradient Orbs with breathing animation */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-burnt-orange/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sunset-purple/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-deep-purple/10 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container-szn relative z-10 py-32">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          {/* Back Button */}
          <motion.div variants={fadeInUp} className="self-start mb-12">
            <Link to="/artists">
              <Button variant="ghost" size="sm" className="group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Artists
              </Button>
            </Link>
          </motion.div>

          {/* Artist Photo */}
          <motion.div
            variants={fadeInUp}
            className="relative mb-8"
          >
            {/* Glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-burnt-orange via-sunset-purple to-deep-purple rounded-2xl blur-lg opacity-50" />
            
            {/* Photo container with 4:5 aspect ratio */}
            <div className="relative w-48 h-60 sm:w-56 sm:h-70 md:w-64 md:h-80 rounded-2xl overflow-hidden border-2 border-white/10">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback gradient if image fails
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.classList.add('bg-gradient-to-br', 'from-burnt-orange/30', 'to-sunset-purple/30')
                }}
              />
              
              {/* Verified badge on image */}
              {artist.isVerified && (
                <div className="absolute top-3 right-3 bg-burnt-orange/90 backdrop-blur-sm rounded-full p-1.5">
                  <BadgeCheck size={16} className="text-white" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Name with character animation */}
          <motion.h1
            variants={nameVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] font-bold mb-3 flex items-center gap-2"
          >
            <span className="text-burnt-orange">✦</span>
            {artist.stylization.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            <span className="text-burnt-orange">✦</span>
          </motion.h1>

          {/* Pronunciation with tooltip */}
          {artist.pronunciation && (
            <motion.div
              variants={fadeInUp}
              className="relative mb-6"
              onMouseEnter={() => setShowPronunciation(true)}
              onMouseLeave={() => setShowPronunciation(false)}
            >
              <button className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors group">
                <span className="text-lg">pronounced "{artist.pronunciation}"</span>
                <Info size={14} className="opacity-50 group-hover:opacity-100" />
              </button>
              
              <AnimatePresence>
                {showPronunciation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/10 whitespace-nowrap"
                  >
                    <span className="text-burnt-orange font-mono">/{artist.pronunciation}/</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Location & Genre Pills */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <MapPin size={14} className="text-burnt-orange" />
              <span className="text-sm text-text-secondary">
                {locationLabel}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Mic2 size={14} className="text-sunset-purple" />
              <span className="text-sm text-text-secondary">
                {artist.genres.join(' / ')}
              </span>
            </div>
          </motion.div>

          {/* Aliases */}
          {artist.aliases.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-8">
              <Text color="muted" size="sm" className="mb-3">
                also known as
              </Text>
              <div className="flex flex-wrap justify-center gap-2">
                {artist.aliases.map((alias) => (
                  <Badge
                    key={alias}
                    variant="outline"
                    size="md"
                    className="bg-white/[0.02] hover:bg-burnt-orange/10 hover:border-burnt-orange/30 transition-all cursor-default"
                  >
                    {alias}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Affiliations */}
          {artist.affiliations.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-center gap-2">
                {artist.affiliations.map((affiliation) => (
                  <Badge
                    key={affiliation}
                    variant="gradient"
                    size="md"
                  >
                    {affiliation}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Platform Links */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <PlatformLinks 
              links={artist.social} 
              verified={['youtube', 'instagram']} 
              size="lg" 
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-matte-black to-transparent z-10 pointer-events-none" />
    </section>
  )
}
