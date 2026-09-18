import { motion } from 'framer-motion'
import { Headphones } from 'lucide-react'
import { Button } from '@/components/ui'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-sunset opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/50 to-transparent" />
      </div>

      <div className="container-szn relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-6 leading-tight"
          >
            Where Nairobi's{' '}
            <span className="text-gradient">Underground</span>{' '}
            Becomes World-Class
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl"
          >
            Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's
            next-generation creatives. We're the city's creative nervous system—
            where music, design, and cultural expression converge.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-4"
          >
            <a href="#releases" className="inline-block">
              <Button variant="outline" size="lg">
                <Headphones size={20} />
                Latest Releases
              </Button>
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
