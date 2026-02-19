/**
 * RecommendationsSection Component
 * 
 * Displays personalized track recommendations based on Culture SZN artists.
 */

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Play } from 'lucide-react'
import { useSpotifyRecommendations } from '@/hooks/useSpotifyRecommendations'
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'

/**
 * Culture SZN artist IDs for seed recommendations
 */
const CULTURE_SZN_ARTISTS = [
  '4JwhMRnhXNf44gaWN2VlDO', // XiiX (example - replace with actual IDs)
  // Add more artist IDs
]

/**
 * Format duration
 */
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function RecommendationsSection() {
  const { isAuthenticated } = useSpotifyAuth()
  const { recommendations, isLoading, fetchRecommendations } = useSpotifyRecommendations()
  const { play, isReady } = useSpotifyPlayer()

  /**
   * Fetch recommendations on mount
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations({
        seedArtists: CULTURE_SZN_ARTISTS,
        seedGenres: ['afrobeats', 'hip-hop', 'african'],
        limit: 10,
      })
    }
  }, [isAuthenticated, fetchRecommendations])

  /**
   * Play track
   */
  const handlePlay = (trackUri: string) => {
    if (isReady) {
      play({ uris: [trackUri] })
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-b from-black/40 to-transparent">
        <div className="container-szn">
          <div className="text-center max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-burnt-orange mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Discover More Like This
            </h2>
            <p className="text-text-secondary mb-6">
              Connect your Spotify account to get personalized recommendations
              based on Culture SZN artists and your listening history.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-szn">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-burnt-orange" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-white/10 rounded mb-3" />
                <div className="h-4 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black/40 to-transparent">
      <div className="container-szn">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-burnt-orange" />
            Recommended for You
          </h2>
          <button
            onClick={() => fetchRecommendations({
              seedArtists: CULTURE_SZN_ARTISTS,
              seedGenres: ['afrobeats', 'hip-hop', 'african'],
              limit: 10,
            })}
            className="text-sm text-burnt-orange hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recommendations.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
            >
              {/* Cover Art */}
              <div className="relative aspect-square mb-3 overflow-hidden rounded">
                {track.album.coverArt ? (
                  <img
                    src={track.album.coverArt}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-burnt-orange/20 to-deep-purple/20" />
                )}

                {/* Play Button Overlay */}
                {isReady && (
                  <button
                    onClick={() => handlePlay(`spotify:track:${track.id}`)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 bg-burnt-orange rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                    </div>
                  </button>
                )}
              </div>

              {/* Track Info */}
              <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1 group-hover:text-burnt-orange transition-colors">
                {track.title}
              </h3>
              <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                {track.artists.map(a => a.name).join(', ')}
              </p>
              <p className="text-xs text-text-muted">
                {formatDuration(track.durationMs)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
