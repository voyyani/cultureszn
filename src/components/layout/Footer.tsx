import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, Music2, ExternalLink } from 'lucide-react'
import { Button, Input, Text } from '@/components/ui'
import { FOOTER_LINKS, SITE_CONFIG } from '@/lib/constants'

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/cultureszn' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/cultureszn' },
  { name: 'Spotify', icon: Music2, href: 'https://open.spotify.com/artist/cultureszn' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@cultureszn' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="bg-black/50 border-t border-white/5">
      <div className="container-szn py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-[family-name:var(--font-heading)] font-bold text-3xl text-gradient">
                CULTURE SZN
              </span>
            </Link>
            <Text color="secondary" className="mb-8 leading-relaxed">
              {SITE_CONFIG.description.slice(0, 150)}...
            </Text>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center
                           text-text-secondary hover:text-white transition-colors"
                  whileHover={{
                    y: -3,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #6A11CB 50%, #2575FC 100%)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Collective Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-6 text-text-primary">
              Collective
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.collective.map((link) => (
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

          {/* Platform Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-6 text-text-primary">
              Platform
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-burnt-orange hover:pl-1 transition-all duration-300 flex items-center gap-2"
                  >
                    {link.name}
                    {link.href.startsWith('http') && <ExternalLink size={12} />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-6 text-text-primary">
              Join The SZN
            </h4>
            <Text color="secondary" className="mb-6">
              Stay connected with Nairobi's creative pulse.
            </Text>
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-[var(--radius-szn)] text-green-400"
              >
                Welcome to the SZN! 🎉
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  variant="primary"
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
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
