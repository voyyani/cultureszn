import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { ReleaseCard } from '@/components/shared'
import { getFeaturedRelease, getRecentReleases } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function ReleasesSection() {
  const featuredRelease = getFeaturedRelease()
  const recentReleases = getRecentReleases(10)
    .filter((r) => r.id !== featuredRelease?.id)
    .slice(0, 3)
  const [showTracklist, setShowTracklist] = useState(false)

  return (
    <section id="releases" className="section-szn bg-gradient-subtle">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <SectionHeader
              title="Latest Releases"
              subtitle="Immersive projects that define our sonic and visual direction."
            />
          </motion.div>

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
                  <ReleaseCard release={release} variant="compact" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
