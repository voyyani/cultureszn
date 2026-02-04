import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export function ModeSwitch() {
  const [isNairobiMode, setIsNairobiMode] = useState(true)

  const handleToggle = () => {
    setIsNairobiMode(!isNairobiMode)
    // Could dispatch to context/state management for theme changes
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-8 right-8 z-50 bg-gradient-sunset text-white 
                 rounded-full px-6 py-3 font-semibold shadow-soft
                 flex items-center gap-3 cursor-pointer"
      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Globe size={20} />
      <span className="font-[family-name:var(--font-heading)]">
        {isNairobiMode ? 'Nairobi Mode' : 'Global Mode'}
      </span>
    </motion.button>
  )
}
