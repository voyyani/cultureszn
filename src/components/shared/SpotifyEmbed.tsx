/**
 * SpotifyEmbed Component
 * 
 * Embedded Spotify player for tracks and albums with fallback states.
 * Supports both iframe embed and preview player modes.
 */

import { useState } from 'react'
import { ExternalLink, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SpotifyTrack } from '@/lib/spotify'

interface SpotifyEmbedProps {
  /** Spotify URI (spotify:track:ID or spotify:album:ID) */
  uri?: string
  /** Track ID (alternative to URI) */
  trackId?: string
  /** Album ID (alternative to URI) */
  albumId?: string
  /** Track data for preview player mode */
  track?: SpotifyTrack
  /** Embed type */
  type?: 'track' | 'album'
  /** Compact mode (smaller height) */
  compact?: boolean
  /** Show preview player instead of iframe */
  preview?: boolean
  /** Custom className */
  className?: string
}

/**
 * Spotify Embed Player Component
 * 
 * Renders an embedded Spotify player using iframe or HTML5 audio preview.
 * Automatically handles missing preview URLs and provides fallback UI.
 * 
 * @example
 * ```tsx
 * // Using track ID
 * <SpotifyEmbed trackId="3n3Ppam7vgaVa1iaRUc9Lp" />
 * 
 * // Using album ID
 * <SpotifyEmbed albumId="5EC55CH3Tybf6kNJS0415L" type="album" />
 * 
 * // Using track data with preview
 * <SpotifyEmbed track={trackData} preview />
 * 
 * // Compact mode
 * <SpotifyEmbed trackId="..." compact />
 * ```
 */
export function SpotifyEmbed({
  uri,
  trackId,
  albumId,
  track,
  type = 'track',
  compact = false,
  preview = false,
  className = '',
}: SpotifyEmbedProps) {
  const [audioError, setAudioError] = useState(false)

  // Construct Spotify URI
  const spotifyUri = uri || 
    (trackId ? `spotify:track:${trackId}` : '') ||
    (albumId ? `spotify:album:${albumId}` : '')

  // Extract ID from URI
  const embedId = spotifyUri.split(':')[2]
  const embedType = spotifyUri.split(':')[1] || type

  // Spotify embed URL
  const embedUrl = embedId 
    ? `https://open.spotify.com/embed/${embedType}/${embedId}?utm_source=generator&theme=0`
    : null

  // Preview mode with HTML5 audio player
  if (preview && track?.previewUrl) {
    return (
      <div className={`relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl border border-white/10 overflow-hidden ${className}`}>
        {/* Track Info Header */}
        <div className="flex items-center gap-4 p-4">
          {track.album?.coverArt && (
            <img 
              src={track.album.coverArt}
              alt={track.album.name}
              className="w-16 h-16 rounded-lg shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">
              {track.title}
            </h4>
            <p className="text-text-muted text-xs truncate">
              {track.artists.map(a => a.name).join(', ')}
            </p>
            {track.album && (
              <p className="text-text-muted text-xs truncate">
                {track.album.name}
              </p>
            )}
          </div>
        </div>

        {/* Audio Player */}
        <audio 
          controls 
          className="w-full h-12 bg-black/20"
          onError={() => setAudioError(true)}
        >
          <source src={track.previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Open in Spotify Link */}
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-2 bg-[#1DB954] hover:bg-[#1ed760] 
                     text-white text-xs font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Open in Spotify
          <ExternalLink className="w-3 h-3" />
        </a>

        {audioError && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center p-4">
              <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-white">Preview unavailable</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // No preview available fallback
  if (preview && track && !track.previewUrl) {
    return (
      <div className={`relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl border border-white/10 overflow-hidden ${className}`}>
        <div className="flex items-center gap-4 p-6">
          {track.album?.coverArt && (
            <img 
              src={track.album.coverArt}
              alt={track.album.name}
              className="w-20 h-20 rounded-lg shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">
              {track.title}
            </h4>
            <p className="text-text-muted text-sm">
              {track.artists.map(a => a.name).join(', ')}
            </p>
            <p className="text-text-muted text-xs mt-1">
              Preview not available
            </p>
          </div>
        </div>
        
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-[#1DB954] hover:bg-[#1ed760] 
                     text-white text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Listen on Spotify
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  // Standard iframe embed
  if (!embedUrl) {
    return (
      <div className={`flex items-center justify-center p-8 bg-white/[0.03] rounded-xl border border-white/10 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-text-muted">
            No Spotify content available
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <iframe 
        src={embedUrl}
        width="100%" 
        height={compact ? '152' : '352'}
        frameBorder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
        className="rounded-xl"
        title={`Spotify ${embedType}`}
      />
    </motion.div>
  )
}
