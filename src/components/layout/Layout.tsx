import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { LoadingSpinner } from '@/components/ui'
import { pageTransition } from '@/lib/motion'
import { useReducedMotion } from '@/hooks'

export function Layout() {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      {reduced ? (
        <main id="main" className="flex-1"><Suspense fallback={<LoadingSpinner label="Loading" />}><Outlet /></Suspense></main>
      ) : (
        <motion.main key={pathname} id="main" className="flex-1" variants={pageTransition} initial="initial" animate="animate">
          <Suspense fallback={<LoadingSpinner label="Loading" />}><Outlet /></Suspense>
        </motion.main>
      )}
      <Footer />
    </div>
  )
}
