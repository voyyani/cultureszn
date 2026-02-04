import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Button, SectionHeader } from '@/components/ui'
import { MemberCard } from '@/components/shared'
import { getAllMembers } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function MembersSection() {
  const members = getAllMembers().slice(0, 3) // Show first 3 members

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
            {members.map((member) => (
              <motion.div key={member.id} variants={fadeInUp}>
                <MemberCard member={member} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center">
            <Button variant="outline" size="lg">
              <Users size={20} />
              View All Creatives
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
