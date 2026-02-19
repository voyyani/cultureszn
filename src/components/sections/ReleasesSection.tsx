import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ChevronDown, ChevronUp, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { ReleaseCard, ReleaseCardSkeleton } from '@/components/shared'
import { SpotifyQuickPlay } from '@/components/spotify'
import { useLatestReleases } from '@/hooks'
import { staggerContainer, fadeInUp } from '@/lib/motion'

/**
 * Format relative time for last synced display
 */
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  return `${diffDays}d ago`
}

export function ReleasesSection() {
  const [showTracklist, setShowTracklist] = useState(false)

  // Use the new hook to fetch latest releases
  const {
    releases,
    isLoading,
    isRefreshing,
    error,
    isFallback,
    lastSynced,
    refetch,
    source,
  } = useLatestReleases({ limit: 10 })

  // Debug logging
  console.log('[ReleasesSection] Render state:', {
    releasesCount: releases.length,
    isLoading,
    isFallback,
    source,
    releases: releases.map(r => ({ id: r.id, title: r.title, featured: r.featured }))
  })

  const featuredRelease = releases.find((r) => r.featured)
  const recentReleases = releases
    .filter((r) => r.id !== featuredRelease?.id)
    .slice(0, 3)

  console.log('[ReleasesSection] Display data:', {
    featuredRelease: featuredRelease ? { id: featuredRelease.id, title: featuredRelease.title } : null,
    recentReleasesCount: recentReleases.length
  })

  return (
    <section id="releases" className="section-szn bg-gradient-subtle">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header with Sync Status */}
          <motion.div variants={fadeInUp}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
              <div className="flex-1">
                <SectionHeader
                  title="Latest Releases"
                  subtitle="Immersive projects that define our sonic and visual direction."
                />
              </div>

              {/* Sync Status & Button */}
              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-sm">
                  {source === 'spotify' && (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-text-muted">Live</span>
                    </>
                  )}
                  {source === 'cache' && (
                    <>
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <span className="text-text-muted">Cached</span>
                    </>
                  )}
                  {source === 'fallback' && (
                    <>
                      <WifiOff className="w-4 h-4 text-orange-500" />
                      <span className="text-text-muted">Offline</span>
                    </>
                  )}
                </div>

                {/* Sync Button */}
                <button
                  onClick={() => refetch()}
                  disabled={isRefreshing}
                  className="group relative p-2 rounded-lg bg-white/5 border border-white/10 
                           hover:border-burnt-orange/50 hover:bg-white/10 
                           transition-all duration-300 disabled:opacity-50 
                           disabled:cursor-not-allowed"
                  title={lastSynced ? `Last synced: ${formatRelativeTime(lastSynced)}` : 'Sync now'}
                  aria-label="Sync releases from Spotify"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-text-secondary group-hover:text-burnt-orange 
                               transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                  />

                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full right-0 mb-2 hidden group-hover:block 
                              bg-black/90 text-white text-xs px-3 py-2 rounded whitespace-nowrap 
                              pointer-events-none z-10"
                  >
                    {isRefreshing ? 'Syncing...' : 'Refresh from Spotify'}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Error Banner (if fallback due to error) */}
          {isFallback && error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 
                       flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="text-orange-100 font-medium">
                  Using offline data - Spotify connection unavailable
                </p>
                <p className="text-orange-200/70 text-xs mt-1">
                  {error.message}. Displaying {releases.length} releases from local data.
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ReleaseCardSkeleton variant="featured" />
              <div className="space-y-5">
                <ReleaseCardSkeleton variant="compact" />
                <ReleaseCardSkeleton variant="compact" />
                <ReleaseCardSkeleton variant="compact" />
              </div>
            </div>
          )}

          {/* Releases Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Featured Release */}
              {featuredRelease && (
                <motion.div
                  variants={fadeInUp}
                  className="relative bg-black/30 rounded-[var(--radius-szn)] p-8 md:p-10 border border-white/10 overflow-hidden"
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
                    style={{ backgroundImage: `url(${featuredRelease.coverArt})` }}
                  />
                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/50 to-black/70 z-0" />

                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-burnt-orange/80 mb-3">
                      XiiX New Album
                    </p>
                    <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-6 text-text-primary">
                      {featuredRelease.title}
                    </h3>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {/* Quick Play Button (if authenticated and has Spotify URI) */}
                      {featuredRelease.spotifyUri ? (
                        <SpotifyQuickPlay
                          trackUri={featuredRelease.spotifyUri}
                          trackName={featuredRelease.title}
                          variant="default"
                        />
                      ) : (
                        <>
                          {featuredRelease.streamingLinks.spotify && (
                            <Button
                              variant="primary"
                              size="lg"
                              onClick={() => {
                                window.open(featuredRelease.streamingLinks.spotify, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              <Play size={20} />
                              Spotify
                            </Button>
                          )}
                        </>
                      )}

                      {featuredRelease.streamingLinks.appleMusic && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            window.open(featuredRelease.streamingLinks.appleMusic, '_blank', 'noopener,noreferrer')
                          }}
                        >
                          <Play size={20} />
                          Apple Music
                        </Button>
                      )}
                    </div>

                    {featuredRelease.tracks && featuredRelease.tracks.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowTracklist(!showTracklist)}
                          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                          aria-label="Toggle tracklist"
                        >
                          {showTracklist ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        <motion.div
                          initial={false}
                          animate={{ height: showTracklist ? 'auto' : 0, opacity: showTracklist ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-2">
                            {featuredRelease.tracks.map((track, index) => (
                              <div
                                key={`${featuredRelease.id}-track-${index}`}
                                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 text-text-secondary"
                              >
                                <span className="w-5 text-xs text-text-muted font-mono">
                                  {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <span className="text-sm">{track}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Ambient glow */}
                  <div className="absolute inset-0 bg-gradient-sunset opacity-10 z-0" />
                </motion.div>
              )}

              {/* Recent Releases List */}
              <motion.div variants={staggerContainer} className="space-y-5">
                {recentReleases.map((release) => (
                  <motion.div key={release.id} variants={fadeInUp}>
                    <ReleaseCard 
                      release={release} 
                      variant="compact"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
