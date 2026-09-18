import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, SectionHeader } from '@/components/ui'
import { ArtistCard } from '@/components/shared'
import { getAllArtists } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function MembersSection() {
  const artists = getAllArtists()

  return (
    <section id="members" className="section-szn">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <SectionHeader
              title="The Creative Core"
              subtitle="Meet the multidisciplinary makers defining Nairobi's contemporary avant-garde."
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {artists.map((artist) => (
              <motion.div key={artist.slug} variants={fadeInUp}>
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <Link to="/artists" className="inline-block">
              <Button variant="outline" size="lg">
                <Users size={20} />
                View All Creatives
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
