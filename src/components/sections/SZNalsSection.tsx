import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { SZNalCard } from '@/components/shared'
import { getRecentSZNals } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function SZNalsSection() {
  const recentSZNals = getRecentSZNals(3)

  return (
    <section id="sznals" className="section-szn">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeInUp}>
            <SectionHeader
              title="SZNals"
              subtitle="Our digital journal exploring culture, process, and creative philosophy."
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {recentSZNals.map((sznal) => (
              <motion.div key={sznal.id} variants={fadeInUp}>
                <SZNalCard sznal={sznal} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <Link to="/sznals" className="inline-block">
              <Button variant="outline" size="lg">
                <BookOpen size={20} />
                Explore All SZNals
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
