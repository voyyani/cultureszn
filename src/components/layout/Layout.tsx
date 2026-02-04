import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { ModeSwitch } from '@/components/shared/ModeSwitch'
import { pageTransition } from '@/lib/motion'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        className="flex-1"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <ModeSwitch />
    </div>
  )
}
