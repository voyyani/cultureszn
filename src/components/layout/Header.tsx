import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'py-4 bg-matte-black/90 backdrop-blur-lg shadow-lg'
          : 'py-6 bg-matte-black/50 backdrop-blur-sm'
      )}
    >
      <div className="container-szn">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <motion.span
              className="font-[family-name:var(--font-heading)] font-bold text-2xl text-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              CULTURE<span className="font-light">SZN</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'font-medium text-base relative py-2 transition-colors',
                    'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5',
                    'after:bg-gradient-sunset after:transition-all after:duration-300',
                    'hover:after:w-full hover:text-text-primary',
                    isActive ? 'text-burnt-orange after:w-full' : 'text-text-secondary'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
            <Link to="/join" className="inline-block">
              <Button variant="outline" size="md">
                Join SZN
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="lg:hidden relative z-10 p-2 text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-matte-black border-t border-white/5 absolute top-full left-0 w-full"
          >
            <nav className="container-szn py-8 flex flex-col gap-6">
              {NAV_LINKS.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-text-secondary hover:text-text-primary transition-colors block py-2"
                  >
                    {item.name}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
              >
                <Link to="/join" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full mt-4">
                    Join SZN
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
