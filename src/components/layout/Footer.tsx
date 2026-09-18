import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Youtube, Music2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Text } from '@/components/ui'
import { FOOTER_LINKS } from '@/lib/constants'
import { SITE } from '@/config/site'

const SOCIAL_META: Record<keyof typeof SITE.socials, { name: string; icon: LucideIcon }> = {
  instagram: { name: 'Instagram', icon: Instagram },
  youtube: { name: 'YouTube', icon: Youtube },
  spotify: { name: 'Spotify', icon: Music2 },
  tiktok: { name: 'TikTok', icon: Music2 },
}

const socialLinks = (Object.keys(SOCIAL_META) as Array<keyof typeof SITE.socials>)
  .filter((key) => Boolean(SITE.socials[key]))
  .map((key) => ({ key, href: SITE.socials[key] as string, ...SOCIAL_META[key] }))

export function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/5">
      <div className="container-szn py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-heading)] font-bold text-3xl text-gradient">
                CULTURE SZN
              </span>
            </Link>
            <Text color="secondary" className="mb-8 leading-relaxed">
              {SITE.description}
            </Text>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center
                             text-text-secondary hover:text-white transition-colors"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Site Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-6 text-text-primary">
              Explore
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-burnt-orange hover:pl-1 transition-all duration-300 flex items-center gap-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-6 text-text-primary">
              Join The SZN
            </h4>
            <Text color="secondary" className="mb-6">
              Stay connected with Nairobi's creative pulse.
            </Text>
            <Link to="/join" className="inline-block">
              <Button variant="primary">Join SZN</Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-text-secondary mt-2">
            Crafted by{' '}
            <a
              href="https://voyani.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors underline font-medium"
            >
              VOYANI
            </a>{' '}
            for the Culture SZN team.
          </p>
        </div>
      </div>
    </footer>
  )
}
