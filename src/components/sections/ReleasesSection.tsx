import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { ReleaseCard } from '@/components/shared'
import { getFeaturedRelease, getRecentReleases } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function ReleasesSection() {
  const featured = getFeaturedRelease()
  const recent = getRecentReleases(4).filter((r) => r.id !== featured?.id).slice(0, 3)

  return (
    <section id="releases" className="section-szn" aria-labelledby="releases-heading">
      <div className="container-szn">
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={fadeInUp}>
            <SectionHeader
              id="releases-heading"
              title="Latest Releases"
              subtitle="Projects that define our sonic and visual direction."
            />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {featured && (
              <motion.div variants={fadeInUp}>
                <ReleaseCard release={featured} />
              </motion.div>
            )}
            <motion.div variants={staggerContainer} className="flex flex-col gap-4">
              {recent.map((release) => (
                <motion.div key={release.id} variants={fadeInUp}>
                  <ReleaseCard release={release} variant="compact" />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} className="text-center">
            <Link to="/releases">
              <Button variant="outline" size="lg">All releases <ArrowRight size={18} /></Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
