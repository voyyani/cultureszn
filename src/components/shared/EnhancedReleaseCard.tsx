/**
 * EnhancedReleaseCard Component
 * 
 * Release card with Spotify integration - displays live metadata when available.
 * Falls back to static data when Spotify ID is not available.
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music2, Calendar, ExternalLink } from 'lucide-react'
import { Card, CardImage, CardContent, Text } from '@/components/ui'
import { useSpotifyTrack } from '@/hooks'
import { extractSpotifyId, extractSpotifyType } from '@/lib/spotify/utils'
import type { Release } from '@/types'

interface EnhancedReleaseCardProps {
  release: Release
  variant?: 'default' | 'compact'
  /** Use live Spotify data if available */
  useLiveData?: boolean
}

/**
 * Enhanced Release Card with Spotify Integration
 * 
 * Automatically fetches live Spotify metadata when a Spotify URL is available.
 * Falls back to static data for releases without Spotify integration.
 * 
 * @example
 * ```tsx
 * // With Spotify integration
 * <EnhancedReleaseCard release={release} useLiveData />
 * 
 * // Compact variant
 * <EnhancedReleaseCard release={release} variant="compact" useLiveData />
 * 
 * // Static data only
 * <EnhancedReleaseCard release={release} />
 * ```
 */
export function EnhancedReleaseCard({ 
  release, 
  variant = 'default',
  useLiveData = true 
}: EnhancedReleaseCardProps) {
  // Extract Spotify ID from streaming links
  const spotifyId = useLiveData ? extractSpotifyId(release.streamingLinks.spotify) : null
  const spotifyType = extractSpotifyType(release.streamingLinks.spotify)
  
  // Fetch live Spotify data for tracks only (albums are less commonly embedded)
  const { track, isLoading } = useSpotifyTrack(
    spotifyType === 'track' ? spotifyId || undefined : undefined,
    { enabled: !!spotifyId && spotifyType === 'track' }
  )

  // Use Spotify data if available, otherwise fallback to static data
  const coverArt = track?.album?.coverArt || release.coverArt
  const title = track?.title || release.title
  const artist = track?.artists[0]?.name || release.artist
  const releaseDate = track?.album?.releaseDate || release.releaseDate

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link to={`/releases/${release.slug}`}>
        <motion.div
          className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-[var(--radius-szn)] 
                     border border-white/5 hover:bg-white/[0.07] transition-all duration-300"
          whileHover={{ x: 10 }}
        >
          {/* Album Art */}
          <div className="w-[70px] h-[70px] rounded-lg overflow-hidden flex-shrink-0 relative">
            {isLoading ? (
              <div className="w-full h-full bg-white/10 animate-pulse" />
            ) : (
              <img
                src={coverArt}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
            {spotifyId && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#1DB954] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="white">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0">
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-text-primary truncate">
              {title}
            </h4>
            <Text color="secondary" size="sm">
              {artist} • {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
            </Text>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-text-muted" />
              <Text color="muted" size="sm">
                {new Date(releaseDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              {track?.popularity && (
                <>
                  <span className="text-text-muted">•</span>
                  <Music2 className="w-3 h-3 text-text-muted" />
                  <Text color="muted" size="sm">
                    {track.popularity}% popularity
                  </Text>
                </>
              )}
            </div>
          </div>

          {/* Spotify Link */}
          {release.streamingLinks.spotify && (
            <a
              href={release.streamingLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1DB954] hover:text-[#1ed760] transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link to={`/releases/${release.slug}`}>
      <Card variant="bordered" className="h-full border border-white/5 group">
        <CardImage className="h-[250px] relative overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full bg-white/10 animate-pulse" />
          ) : (
            <>
              <img
                src={coverArt}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 
                         group-hover:scale-110"
              />
              {/* Spotify Badge */}
              {spotifyId && (
                <div className="absolute top-3 right-3 bg-[#1DB954] text-white px-3 py-1.5 
                              rounded-full flex items-center gap-2 text-xs font-medium shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Live
                </div>
              )}
            </>
          )}
        </CardImage>
        
        <CardContent>
          <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold mb-1 text-text-primary 
                       group-hover:text-orange-500 transition-colors">
            {title}
          </h3>
          <Text color="orange" weight="medium" size="sm" className="mb-2">
            {artist}
          </Text>
          <div className="flex items-center justify-between">
            <Text color="muted" size="sm">
              {new Date(releaseDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            {track?.popularity && (
              <div className="flex items-center gap-1">
                <Music2 className="w-3.5 h-3.5 text-text-muted" />
                <Text color="muted" size="xs">
                  {track.popularity}%
                </Text>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
