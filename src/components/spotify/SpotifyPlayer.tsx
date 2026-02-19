/**
 * SpotifyPlayer Component
 * 
 * Persistent bottom player with full playback controls.
 * Uses Web Playback SDK for premium users.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  Heart,
  ExternalLink
} from 'lucide-react'
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer'
import { useSpotifyLibrary } from '@/hooks/useSpotifyLibrary'

/**
 * Format milliseconds to MM:SS
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function SpotifyPlayer() {
  const {
    isReady,
    isActive,
    currentTrack,
    isPaused,
    position,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  } = useSpotifyPlayer()

  const { isSaved, saveTrack, removeTrack } = useSpotifyLibrary()

  const [volume, setVolumeState] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-hide player when no track is playing
  const shouldShow = isReady && isActive && currentTrack

  /**
   * Handle volume change
   */
  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume)
    setVolume(newVolume / 100)
    if (newVolume > 0) setIsMuted(false)
  }

  /**
   * Toggle mute
   */
  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(volume / 100)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  /**
   * Handle seek
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newPosition = Math.floor(percentage * duration)
    seek(newPosition)
  }

  /**
   * Toggle save track
   */
  const handleToggleSave = async () => {
    if (!currentTrack) return

    try {
      if (isSaved(currentTrack.id)) {
        await removeTrack(currentTrack.id)
      } else {
        await saveTrack(currentTrack.id)
      }
    } catch (error) {
      console.error('Toggle save error:', error)
    }
  }

  if (!shouldShow) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10"
      >
        {/* Progress Bar */}
        <div 
          className="h-1 bg-white/10 cursor-pointer group relative"
          onClick={handleSeek}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-burnt-orange to-sunset-purple"
            style={{ width: `${(position / duration) * 100}%` }}
            initial={false}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${(position / duration) * 100}%` }}
          />
        </div>

        <div className="container-szn py-3">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0">
              {currentTrack.album.images[0] && (
                <motion.img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.name}
                  className="w-14 h-14 rounded shadow-lg"
                  layoutId={`track-${currentTrack.id}`}
                />
              )}
              
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white truncate hover:underline cursor-pointer">
                  {currentTrack.name}
                </h4>
                <p className="text-sm text-text-secondary truncate">
                  {currentTrack.artists.map(a => a.name).join(', ')}
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleToggleSave}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={isSaved(currentTrack.id) ? 'Remove from library' : 'Save to library'}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isSaved(currentTrack.id) 
                      ? 'fill-burnt-orange text-burnt-orange' 
                      : 'text-text-muted hover:text-white'
                  }`}
                />
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={previousTrack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Previous track"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                  title={isPaused ? 'Play' : 'Pause'}
                >
                  {isPaused ? (
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  ) : (
                    <Pause className="w-6 h-6 fill-black" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Next track"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Time Display */}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{formatTime(position)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume & Actions */}
            <div className="flex items-center justify-end gap-4">
              {/* Volume Control */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                           [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* External Link */}
              <a
                href={`https://open.spotify.com/track/${currentTrack.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Open in Spotify"
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </a>

              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5 text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Expanded View */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted">Album</p>
                    <p className="text-white">{currentTrack.album.name}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Duration</p>
                    <p className="text-white">{formatTime(currentTrack.duration_ms)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
