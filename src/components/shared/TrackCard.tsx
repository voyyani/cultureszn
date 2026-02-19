/**
 * TrackCard Component
 * 
 * Display Spotify track with metadata, album art, and embedded player.
 * Supports loading states, error handling, and responsive design.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ExternalLink, Clock, Music2, AlertCircle } from 'lucide-react'
import { useSpotifyTrack } from '@/hooks'
import { SpotifyEmbed } from './SpotifyEmbed'
import { Text } from '@/components/ui'

interface TrackCardProps {
  /** Spotify track ID */
  trackId: string
  /** Show embedded player */
  showPlayer?: boolean
  /** Card variant */
  variant?: 'default' | 'compact' | 'minimal'
  /** Custom className */
  className?: string
}

/**
 * Spotify Track Card with live data
 * 
 * Fetches and displays track metadata from Spotify API with caching.
 * Includes album art, artist info, duration, and optional embedded player.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <TrackCard trackId="3n3Ppam7vgaVa1iaRUc9Lp" />
 * 
 * // With player
 * <TrackCard trackId="3n3Ppam7vgaVa1iaRUc9Lp" showPlayer />
 * 
 * // Compact variant
 * <TrackCard trackId="3n3Ppam7vgaVa1iaRUc9Lp" variant="compact" />
 * ```
 */
export function TrackCard({ 
  trackId, 
  showPlayer = false,
  variant = 'default',
  className = '' 
}: TrackCardProps) {
  const { track, isLoading, error } = useSpotifyTrack(trackId)
  const [isExpanded, setIsExpanded] = useState(false)

  // Format duration from milliseconds to MM:SS
  const formatDuration = (ms: number | undefined): string => {
    if (!ms) return '0:00'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden ${className}`}>
        <div className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="h-3 bg-white/10 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !track) {
    return (
      <div className={`bg-white/[0.03] rounded-xl border border-red-500/20 overflow-hidden ${className}`}>
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-lg flex-shrink-0 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1">
            <Text color="muted" size="sm">
              {error?.message || 'Track not found'}
            </Text>
            <Text color="muted" size="xs" className="mt-1">
              ID: {trackId}
            </Text>
          </div>
        </div>
      </div>
    )
  }

  // Minimal variant - just track info, no album art
  if (variant === 'minimal') {
    return (
      <motion.div
        className={`flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5 
                   hover:bg-white/[0.05] transition-all ${className}`}
        whileHover={{ x: 4 }}
      >
        <Music2 className="w-4 h-4 text-text-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {track.title}
          </p>
          <p className="text-xs text-text-muted truncate">
            {track.artists.map(a => a.name).join(', ')}
          </p>
        </div>
        {track.durationMs && (
          <div className="flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
            <Clock className="w-3 h-3" />
            {formatDuration(track.durationMs)}
          </div>
        )}
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DB954] hover:text-[#1ed760] transition-colors flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        className={`flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/10 
                   hover:bg-white/[0.05] transition-all ${className}`}
        whileHover={{ x: 6 }}
      >
        {track.album?.coverArt && (
          <img 
            src={track.album.coverArt}
            alt={track.album.name}
            className="w-16 h-16 rounded-lg shadow-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm truncate">
            {track.title}
          </h4>
          <Text color="secondary" size="sm" className="truncate">
            {track.artists.map(a => a.name).join(', ')}
          </Text>
          <div className="flex items-center gap-3 mt-1">
            {track.album && (
              <Text color="muted" size="xs" className="truncate">
                {track.album.name}
              </Text>
            )}
            {track.durationMs && (
              <div className="flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatDuration(track.durationMs)}
              </div>
            )}
          </div>
        </div>
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DB954] hover:text-[#1ed760] transition-colors flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    )
  }

  // Default variant - full card with optional player
  return (
    <motion.div
      className={`bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl border border-white/10 
                 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Track Header */}
      <div className="flex items-start gap-4 p-5">
        {track.album?.coverArt && (
          <div className="relative group flex-shrink-0">
            <img 
              src={track.album.coverArt}
              alt={track.album.name}
              className="w-24 h-24 rounded-lg shadow-lg"
            />
            {track.previewUrl && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isExpanded ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {/* Track Title */}
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-white mb-1 truncate">
            {track.title}
            {track.explicit && (
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">
                E
              </span>
            )}
          </h3>
          
          {/* Artists */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {track.artists.map((artist, index) => (
              <span key={artist.id} className="text-text-muted text-sm">
                {artist.name}
                {index < track.artists.length - 1 && ','}
              </span>
            ))}
          </div>
          
          {/* Album & Metadata */}
          {track.album && (
            <div className="space-y-1">
              <Text color="secondary" size="sm">
                {track.album.name}
              </Text>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                {track.album.releaseDate && (
                  <span>
                    {new Date(track.album.releaseDate).getFullYear()}
                  </span>
                )}
                {track.durationMs && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(track.durationMs)}
                  </span>
                )}
                {track.popularity !== undefined && (
                  <span className="flex items-center gap-1">
                    <Music2 className="w-3 h-3" />
                    {track.popularity}% popularity
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Spotify Link */}
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DB954] hover:text-[#1ed760] transition-colors flex-shrink-0"
          title="Open in Spotify"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
      </div>

      {/* Embedded Player (expandable) */}
      <AnimatePresence>
        {(showPlayer || isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4">
              <SpotifyEmbed 
                trackId={track.id} 
                track={track}
                preview={!!track.previewUrl}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
