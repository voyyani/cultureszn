/**
 * SpotifyQuickPlay Component
 * 
 * Displays a play button that starts playback immediately for signed-in users.
 * Shows sign-in prompt for unauthenticated users.
 * 
 * Features:
 * - Instant playback for authenticated users
 * - Auth prompt for unauthenticated users
 * - Responsive to current playback state
 * - Multiple display variants
 * - Smooth animations
 * 
 * @example
 * ```tsx
 * <SpotifyQuickPlay 
 *   trackUri="spotify:track:abc123"
 *   trackName="Song Name"
 *   variant="compact"
 * />
 * ```
 */

import { Play, Pause, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'

export interface SpotifyQuickPlayProps {
  trackUri: string // spotify:track:abc123
  trackName: string
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}

/**
 * Quick Play Button Component
 * 
 * Provides instant Spotify playback for authenticated users
 */
export function SpotifyQuickPlay({ 
  trackUri, 
  trackName,
  variant = 'default',
  className = '',
}: SpotifyQuickPlayProps) {
  const { isAuthenticated, login } = useSpotifyAuth()
  const { currentTrack, isPaused, play, pause } = useSpotifyPlayer()

  const isCurrentTrack = currentTrack?.uri === trackUri
  const isPlaying = isCurrentTrack && !isPaused

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      login()
      return
    }

    try {
      if (isPlaying) {
        await pause()
      } else {
        await play({ uris: [trackUri] })
      }
    } catch (error) {
      console.error('[SpotifyQuickPlay] Playback error:', error)
    }
  }

  // Compact variant for in-card playback
  if (variant === 'compact') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${isAuthenticated 
            ? 'bg-burnt-orange hover:bg-burnt-orange/80 shadow-burnt-orange/20' 
            : 'bg-white/10 hover:bg-white/20'
          }
          ${className}
        `}
        title={isAuthenticated ? trackName : 'Sign in to play'}
        aria-label={isAuthenticated 
          ? `${isPlaying ? 'Pause' : 'Play'} ${trackName}` 
          : `Sign in to play ${trackName}`
        }
      >
        {!isAuthenticated && <Lock className="w-4 h-4 text-white/70" />}
        {isAuthenticated && !isPlaying && (
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        )}
        {isAuthenticated && isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Pause className="w-5 h-5 text-white fill-white" />
          </motion.div>
        )}
      </motion.button>
    )
  }

  // Inline variant for text flow
  if (variant === 'inline') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
          font-medium text-sm transition-all duration-300
          ${isAuthenticated 
            ? 'bg-burnt-orange/20 text-burnt-orange hover:bg-burnt-orange/30' 
            : 'bg-white/5 text-text-secondary hover:bg-white/10'
          }
          ${className}
        `}
        aria-label={isAuthenticated 
          ? `${isPlaying ? 'Pause' : 'Play'} ${trackName}` 
          : `Sign in to play ${trackName}`
        }
      >
        {!isAuthenticated && <Lock className="w-3.5 h-3.5" />}
        {isAuthenticated && !isPlaying && (
          <Play className="w-3.5 h-3.5 fill-current" />
        )}
        {isAuthenticated && isPlaying && (
          <Pause className="w-3.5 h-3.5 fill-current" />
        )}
        <span>{isPlaying ? 'Playing' : 'Play'}</span>
      </motion.button>
    )
  }

  // Default variant (full button)
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-300
        flex items-center gap-2 shadow-lg
        ${isAuthenticated 
          ? 'bg-burnt-orange hover:bg-burnt-orange/80 text-white shadow-burnt-orange/20' 
          : 'bg-white/10 hover:bg-white/20 text-text-secondary'
        }
        ${className}
      `}
      aria-label={isAuthenticated 
        ? `${isPlaying ? 'Pause' : 'Play'} ${trackName}` 
        : `Sign in to play ${trackName}`
      }
    >
      {!isAuthenticated && (
        <>
          <Lock className="w-4 h-4" />
          <span>Sign in to play</span>
        </>
      )}
      {isAuthenticated && !isPlaying && (
        <>
          <Play className="w-4 h-4 fill-current" />
          <span>Play</span>
        </>
      )}
      {isAuthenticated && isPlaying && (
        <>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Pause className="w-4 h-4 fill-current" />
          </motion.div>
          <span>Pause</span>
        </>
      )}
    </motion.button>
  )
}
