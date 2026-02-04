import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, ExternalLink } from 'lucide-react'
import { Button, Text, Badge } from '@/components/ui'
import { getReleaseBySlug } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

const streamingPlatforms = [
  { key: 'spotify', name: 'Spotify', color: '#1DB954' },
  { key: 'appleMusic', name: 'Apple Music', color: '#FA2D48' },
  { key: 'youtube', name: 'YouTube', color: '#FF0000' },
  { key: 'soundcloud', name: 'SoundCloud', color: '#FF5500' },
  { key: 'audiomack', name: 'Audiomack', color: '#FFA500' },
  { key: 'boomplay', name: 'Boomplay', color: '#00D4FF' },
] as const

export function Release() {
  const { slug } = useParams<{ slug: string }>()
  const release = getReleaseBySlug(slug!)

  if (!release) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-4">
            Release Not Found
          </h1>
          <Text color="secondary" className="mb-8">
            The release you're looking for doesn't exist or has been moved.
          </Text>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft size={20} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const availablePlatforms = streamingPlatforms.filter(
    (platform) => release.streamingLinks[platform.key as keyof typeof release.streamingLinks]
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Back Button */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Link to="/#releases">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} />
                Back to Releases
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Album Art */}
            <motion.div variants={fadeInUp}>
              <div className="aspect-square rounded-[var(--radius-szn)] overflow-hidden shadow-card">
                <img
                  src={release.coverArt}
                  alt={release.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Release Info */}
            <motion.div variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold mb-4"
              >
                {release.title}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-burnt-orange font-medium mb-2"
              >
                {release.artist}
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-text-muted mb-8"
              >
                Released{' '}
                {new Date(release.releaseDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </motion.p>

              {release.description && (
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-text-secondary leading-relaxed mb-10"
                >
                  {release.description}
                </motion.p>
              )}

              {/* Streaming Links */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-4">
                  Stream Now
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availablePlatforms.map((platform) => (
                    <a
                      key={platform.key}
                      href={release.streamingLinks[platform.key as keyof typeof release.streamingLinks]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 
                                   rounded-full text-text-primary font-medium transition-all
                                   hover:border-white/30 hover:bg-white/10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play size={16} />
                        {platform.name}
                        <ExternalLink size={14} className="opacity-50" />
                      </motion.button>
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </div>
  )
}
