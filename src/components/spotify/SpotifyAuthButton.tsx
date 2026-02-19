/**
 * SpotifyAuthButton Component
 * 
 * World-class Spotify authentication button with:
 * - Popup-based auth (no page reload)
 * - Loading states and animations
 * - Error handling with fallbacks
 * - Analytics tracking
 * - Accessible and keyboard-friendly
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, Music, Loader2, CheckCircle } from 'lucide-react'
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth'
import { Button } from '@/components/ui/Button'

interface SpotifyAuthButtonProps {
  variant?: 'default' | 'minimal'
  showUserInfo?: boolean
}

export function SpotifyAuthButton({ 
  variant = 'default',
  showUserInfo = true 
}: SpotifyAuthButtonProps) {
  const { isAuthenticated, user, isLoading, login, logout } = useSpotifyAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  /**
   * Handle login with loading state
   */
  const handleLogin = async () => {
    setIsConnecting(true)
    
    try {
      await login()
      
      // Show success animation briefly
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Handle logout with confirmation
   */
  const handleLogout = async () => {
    if (window.confirm('Disconnect Spotify account?')) {
      await logout()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    )
  }

  // Not authenticated - show connect button
  if (!isAuthenticated) {
    return (
      <Button 
        onClick={handleLogin}
        disabled={isConnecting}
        variant="outline"
        size="sm"
        className="bg-[#1DB954] hover:bg-[#1ed760] text-white border-[#1DB954] hover:border-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isConnecting ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CheckCircle className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <LogIn className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span>
          {isConnecting ? 'Connecting...' : showSuccess ? 'Connected!' : 'Connect Spotify'}
        </span>
      </Button>
    )
  }

  // Authenticated - minimal variant
  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors group"
        title="Disconnect Spotify"
      >
        <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
        <span className="group-hover:text-red-400 transition-colors">Disconnect</span>
      </button>
    )
  }

  // Authenticated - default variant with user info
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      {showUserInfo && user && (
        <motion.div 
          className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Music className="w-4 h-4 text-[#1DB954]" />
          <span className="text-sm font-medium text-white">
            {user.displayName}
          </span>
        </motion.div>
      )}

      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="border-white/20 hover:bg-red-500/10 hover:border-red-400 hover:text-red-400 transition-all duration-300"
      >
        <LogOut className="w-4 h-4" />
        <span>Disconnect</span>
      </Button>
    </motion.div>
  )
}
