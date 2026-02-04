import { motion } from 'framer-motion'
import { Text } from '@/components/ui'
import { StatCounter } from '@/components/shared'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { MOVEMENT_STATS } from '@/lib/constants'

export function MovementSection() {
  return (
    <section
      id="movement"
      className="section-szn relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')`,
          }}
        />
      </div>

      <div className="container-szn relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold mb-4">
              The Movement
            </h2>
            <Text size="xl" color="secondary">
              More than a collective—we're Nairobi's creative nervous system.
            </Text>
          </motion.div>

          {/* Quote */}
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <blockquote className="relative">
              {/* Opening quote */}
              <span className="absolute -top-6 -left-4 text-6xl text-burnt-orange opacity-50 font-serif">
                "
              </span>

              <p className="text-xl sm:text-2xl md:text-3xl font-[family-name:var(--font-heading)] italic leading-relaxed text-text-primary px-8">
                We're not here to follow global trends—we're here to set them from Nairobi outward.
              </p>

              {/* Closing quote */}
              <span className="absolute -bottom-10 -right-4 text-6xl text-burnt-orange opacity-50 font-serif">
                "
              </span>
            </blockquote>
          </motion.div>

          {/* Philosophy */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <Text size="lg" color="secondary" className="leading-relaxed">
              Culture SZN exists at the intersection of music, design, and cultural
              commentary. We're building an ecosystem where Nairobi's underground
              talent can develop, collaborate, and reach global audiences without
              compromising their authentic voice.
            </Text>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-12 md:gap-20"
          >
            {MOVEMENT_STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                className="text-center"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
