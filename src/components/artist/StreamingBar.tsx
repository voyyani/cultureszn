/**
 * StreamingBar Component
 *
 * One-tap access to every streaming platform an artist is on, in the
 * Kenya-first order from the platform registry.
 */

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import { platformLinks, type PlatformKey } from '@/config/platforms'
import { BrandIcon } from '@/components/icons'

interface StreamingBarProps {
  links: Partial<Record<PlatformKey, string>>
  artistName?: string
}

export function StreamingBar({ links, artistName }: StreamingBarProps) {
  const ordered = platformLinks(links)
  if (ordered.length === 0) return null

  return (
    <section className="py-6 border-y border-white/5 bg-gradient-to-r from-white/[0.02] via-white/[0.04] to-white/[0.02]">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-text-muted text-sm mb-4 uppercase tracking-widest"
          >
            Stream {artistName}
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full">
            <div className="flex flex-col md:flex-row justify-center gap-3 px-4 md:px-0">
              {ordered.map((link, index) => (
                <motion.a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 px-5 py-3 min-h-11 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/30 transition-colors duration-300"
                >
                  <span style={{ color: link.color }}>
                    <BrandIcon platform={link.key} size={20} />
                  </span>
                  <span className="font-medium text-text-primary group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink size={14} className="opacity-40 group-hover:opacity-70 transition-opacity" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
