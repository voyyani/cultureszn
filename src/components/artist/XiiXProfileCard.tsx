/**
 * XiiX Profile Card Component
 * 
 * Premium, dense artist identity card showcasing:
 * - Artist identity & verification
 * - Career stats with animated counters
 * - Release timeline visualization
 * - Top collaborators & producers
 * - Platform links
 * - Latest releases quick view
 * 
 * @version 1.0.0
 * @author Culture SZN
 */

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { 
  Music, 
  Disc3, 
  Users, 
  Calendar, 
  ExternalLink, 
  Play,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Clock,
  Mic2
} from 'lucide-react'
import type { XiiXProfileV2, ProfileStats } from '@/types/xiix-profile'

// Import the JSON data
import xiixData from '@/data/artists/xiix2.json'

/* ============================================
   Helper Functions
   ============================================ */

function computeStats(profile: XiiXProfileV2): ProfileStats {
  const songs = profile.discography.songs
  const projects = profile.discography.projects
  
  // Count unique collaborators
  const collaboratorSet = new Set<string>()
  const producerCount: Record<string, number> = {}
  const collaboratorCount: Record<string, number> = {}
  
  songs.forEach(song => {
    song.featuredArtists.forEach(artist => {
      collaboratorSet.add(artist)
      collaboratorCount[artist] = (collaboratorCount[artist] || 0) + 1
    })
    song.credits.producers.forEach(producer => {
      producerCount[producer] = (producerCount[producer] || 0) + 1
    })
    song.credits.beatMakers.forEach(beatmaker => {
      producerCount[beatmaker] = (producerCount[beatmaker] || 0) + 1
    })
  })
  
  // Sort by frequency
  const topProducers = Object.entries(producerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)
  
  const topCollaborators = Object.entries(collaboratorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)
  
  // Years active
  const dates = songs.map(s => new Date(s.canonicalReleaseDate).getFullYear())
  const minYear = Math.min(...dates)
  const maxYear = Math.max(...dates)
  
  // Latest release
  const sortedSongs = [...songs].sort((a, b) => 
    new Date(b.canonicalReleaseDate).getTime() - new Date(a.canonicalReleaseDate).getTime()
  )
  
  return {
    totalTracks: songs.length,
    totalProjects: projects.length,
    totalCollaborators: collaboratorSet.size,
    yearsActive: maxYear - minYear + 1,
    latestRelease: sortedSongs[0]?.title || '',
    topProducers,
    topCollaborators,
    tracksPerYear: profile.quickReference.chartData.songsPerYearVerifiedInDSPMetadata
  }
}

function formatDuration(duration: string | null): string {
  if (!duration) return '--:--'
  return duration
}

/* ============================================
   Animated Counter Component
   ============================================ */

function AnimatedCounter({ 
  value, 
  duration = 2,
  suffix = ''
}: { 
  value: number
  duration?: number
  suffix?: string 
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.floor(v))
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const controls = animate(count, value, { 
      duration,
      ease: 'easeOut'
    })
    
    const unsubscribe = rounded.on('change', v => setDisplayValue(v))
    
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, count, rounded, duration])
  
  return <span>{displayValue}{suffix}</span>
}

/* ============================================
   Stat Card Component
   ============================================ */

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '',
  delay = 0,
  accent = false
}: { 
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  delay?: number
  accent?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        relative p-4 rounded-xl border backdrop-blur-sm
        ${accent 
          ? 'bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 border-accent-primary/30' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
        }
        transition-colors duration-300
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`
          p-2 rounded-lg 
          ${accent ? 'bg-accent-primary/30' : 'bg-white/10'}
        `}>
          <Icon size={18} className={accent ? 'text-accent-primary' : 'text-white/70'} />
        </div>
        <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      </div>
      <div className={`
        text-3xl font-[family-name:var(--font-heading)] font-bold
        ${accent ? 'text-white' : 'text-white/90'}
      `}>
        <AnimatedCounter value={value} suffix={suffix} duration={2} />
      </div>
    </motion.div>
  )
}

/* ============================================
   Platform Badge Component
   ============================================ */

function PlatformBadge({ 
  name, 
  url, 
  delay 
}: { 
  name: string
  url: string
  delay: number 
}) {
  const platformIcons: Record<string, string> = {
    'Spotify': '🟢',
    'Apple Music': '🍎',
    'Qobuz': '🎵',
    'SoundCloud': '🔶',
    'YouTube': '▶️'
  }
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center gap-2 px-4 py-2 rounded-full
        bg-white/5 border border-white/10 hover:border-white/30
        text-sm text-white/80 hover:text-white
        transition-all duration-300
      "
    >
      <span>{platformIcons[name] || '🎧'}</span>
      <span>{name}</span>
      <ExternalLink size={12} className="opacity-50" />
    </motion.a>
  )
}

/* ============================================
   Timeline Bar Component
   ============================================ */

function TimelineBar({ 
  data, 
  maxCount 
}: { 
  data: { year: number; count: number }[]
  maxCount: number 
}) {
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          className="flex items-center gap-3"
        >
          <span className="text-sm text-white/50 w-12 font-mono">{item.year}</span>
          <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / maxCount) * 100}%` }}
              transition={{ duration: 1, delay: 1 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-end pr-3"
            >
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {item.count}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ============================================
   Collaborator Chip Component
   ============================================ */

function CollaboratorChip({ 
  name, 
  index 
}: { 
  name: string
  index: number 
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
      whileHover={{ scale: 1.1 }}
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-gradient-to-r from-white/10 to-white/5
        border border-white/10 hover:border-accent-primary/50
        text-sm text-white/80 hover:text-white
        transition-all duration-300 cursor-default
      "
    >
      <Users size={12} className="text-accent-primary" />
      {name}
    </motion.span>
  )
}

/* ============================================
   Latest Release Card
   ============================================ */

function LatestReleaseCard({ 
  song, 
  index 
}: { 
  song: { title: string; length: string | null; releaseDate: string; primaryLink: string }
  index: number 
}) {
  return (
    <motion.a
      href={song.primaryLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="
        group flex items-center gap-4 p-3 rounded-xl
        bg-white/5 hover:bg-white/10
        border border-transparent hover:border-accent-primary/30
        transition-all duration-300
      "
    >
      <div className="
        w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/30 to-accent-secondary/20
        flex items-center justify-center
        group-hover:from-accent-primary/50 group-hover:to-accent-secondary/30
        transition-all duration-300
      ">
        <Play size={16} className="text-white ml-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-accent-primary transition-colors">
          {song.title}
        </p>
        <p className="text-xs text-white/50">
          {new Date(song.releaseDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
      <div className="flex items-center gap-2 text-white/40">
        <Clock size={12} />
        <span className="text-xs font-mono">{formatDuration(song.length)}</span>
      </div>
    </motion.a>
  )
}

/* ============================================
   Main Profile Card Component
   ============================================ */

export function XiiXProfileCard() {
  const profile = xiixData as unknown as XiiXProfileV2
  const stats = computeStats(profile)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const maxCount = Math.max(...stats.tracksPerYear.map(t => t.count))
  const latestReleases = profile.quickReference.songTable.slice(-5).reverse()
  
  // Extract tagline (handle both object and string formats)
  const tagline = typeof profile.artist.tagline === 'object' && profile.artist.tagline !== null
    ? (profile.artist.tagline as { value: string }).value
    : String(profile.artist.tagline || '')
  
  // Extract homeBase (handle both object and string formats)
  const homeBase = typeof profile.artist.homeBase === 'object' && profile.artist.homeBase !== null
    ? `${(profile.artist.homeBase as { city: string; country: string }).city}, ${(profile.artist.homeBase as { city: string; country: string }).country}`
    : String(profile.artist.homeBase || '')
  
  // Platform links
  const platforms = [
    { name: 'Spotify', url: profile.externalLinks.spotifyKnownAlbumLink },
    { name: 'Apple Music', url: profile.externalLinks.appleMusicArtistPage },
    { name: 'Qobuz', url: profile.externalLinks.qobuzArtistPage },
    { name: 'SoundCloud', url: profile.externalLinks.soundcloudArtistPage },
  ]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 2}deg)`,
      }}
      className="
        relative w-full max-w-5xl mx-auto
        bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]
        rounded-3xl overflow-hidden
        border border-white/10
        shadow-2xl shadow-black/50
      "
    >
      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px]"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
        />
        <div 
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent-secondary/15 rounded-full blur-[100px]"
          style={{ transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)` }}
        />
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="space-y-4">
            {/* Verified Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/20 border border-accent-primary/30"
            >
              <CheckCircle2 size={14} className="text-accent-primary" />
              <span className="text-xs font-medium text-accent-primary uppercase tracking-wider">
                Verified Artist
              </span>
            </motion.div>
            
            {/* Artist Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] font-black tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                {profile.artist.stageName}
              </span>
            </motion.h1>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-white/60 max-w-md"
            >
              {tagline}
            </motion.p>
            
            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-white/40"
            >
              <span className="text-lg">📍</span>
              <span>{homeBase}</span>
              <span className="mx-2">•</span>
              <span>Culture SZN</span>
              <Sparkles size={12} className="text-accent-primary ml-1" />
            </motion.div>
          </div>
          
          {/* Right side: Quick Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats.totalTracks} />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Tracks</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter value={stats.totalProjects} />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Projects</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary">
                <AnimatedCounter value={stats.yearsActive} />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Years</div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard 
            icon={Music} 
            label="Total Tracks" 
            value={stats.totalTracks} 
            delay={0.2}
            accent
          />
          <StatCard 
            icon={Disc3} 
            label="Projects" 
            value={stats.totalProjects} 
            delay={0.3}
          />
          <StatCard 
            icon={Users} 
            label="Collaborators" 
            value={stats.totalCollaborators} 
            delay={0.4}
          />
          <StatCard 
            icon={TrendingUp} 
            label="Growth 2025" 
            value={25}
            suffix=" tracks"
            delay={0.5}
          />
        </div>
        
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          
          {/* Left: Release Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-accent-primary" />
              <h3 className="text-lg font-semibold text-white">Release Timeline</h3>
            </div>
            <TimelineBar data={stats.tracksPerYear} maxCount={maxCount} />
          </motion.div>
          
          {/* Right: Latest Releases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Play size={18} className="text-accent-primary" />
              <h3 className="text-lg font-semibold text-white">Latest Releases</h3>
            </div>
            <div className="space-y-2">
              {latestReleases.map((song, index) => (
                <LatestReleaseCard key={song.title} song={song} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Collaborators Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mic2 size={18} className="text-accent-primary" />
            <h3 className="text-lg font-semibold text-white">Top Collaborators</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.topCollaborators.map((name, index) => (
              <CollaboratorChip key={name} name={name} index={index} />
            ))}
            {stats.topProducers.slice(0, 3).map((name, index) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-gradient-to-r from-accent-secondary/20 to-accent-secondary/10
                  border border-accent-secondary/20 hover:border-accent-secondary/40
                  text-sm text-white/80 hover:text-white
                  transition-all duration-300 cursor-default
                "
              >
                <Disc3 size={12} className="text-accent-secondary" />
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
        
        {/* Platform Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink size={18} className="text-accent-primary" />
            <h3 className="text-lg font-semibold text-white">Listen Now</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform, index) => (
              <PlatformBadge 
                key={platform.name} 
                name={platform.name} 
                url={platform.url} 
                delay={0.8 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/30"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-500" />
            <span>Data verified via Qobuz, Apple Music, SoundCloud</span>
          </div>
          <div>
            Last updated: {new Date(profile.meta.generatedAt).toLocaleDateString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default XiiXProfileCard
