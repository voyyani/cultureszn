import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button, Text } from '@/components/ui'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="text-center px-6"
      >
        {/* 404 Number */}
        <motion.h1
          variants={fadeInUp}
          className="text-8xl sm:text-9xl font-[family-name:var(--font-heading)] font-bold text-gradient mb-4"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={fadeInUp}
          className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.div variants={fadeInUp}>
          <Text color="secondary" size="lg" className="mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </Text>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home size={20} />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
