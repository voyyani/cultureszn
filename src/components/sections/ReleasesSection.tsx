import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Button, SectionHeader, Text, Badge } from '@/components/ui'
import { ReleaseCard } from '@/components/shared'
import { getFeaturedRelease, getRecentReleases } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function ReleasesSection() {
  const featuredRelease = getFeaturedRelease()
  const recentReleases = getRecentReleases(3).filter(
    (r) => r.id !== featuredRelease?.id
  )

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
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-sunset opacity-5 z-0" />

                <div className="relative z-10">
                  <Badge variant="gradient" className="mb-6">
                    Featured Release
                  </Badge>

                  <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4 text-text-primary">
                    {featuredRelease.title}
                  </h3>

                  <Text color="orange" size="lg" weight="medium" className="mb-6">
                    {featuredRelease.artist}
                  </Text>

                  <Text color="secondary" className="mb-8 leading-relaxed">
                    {featuredRelease.description}
                  </Text>

                  <Button variant="primary" size="lg">
                    <Play size={20} />
                    Stream Now
                  </Button>
                </div>

                {/* Cover art background */}
                <div
                  className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${featuredRelease.coverArt})` }}
                />
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
