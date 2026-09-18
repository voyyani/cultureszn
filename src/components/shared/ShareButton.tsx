/**
 * ShareButton Component
 * 
 * Native share functionality using Web Share API with fallback.
 * Supports sharing artist profiles, tracks, and custom content.
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Check, 
  X,
  Twitter,
  Facebook,
  Link2,
  MessageCircle
} from 'lucide-react'
import { Button, Text } from '@/components/ui'

interface ShareData {
  title: string
  text: string
  url: string
}

interface ShareButtonProps {
  data: ShareData
  variant?: 'button' | 'icon' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Check if Web Share API is available
const canShare = typeof navigator !== 'undefined' && 'share' in navigator

// Fallback share links
const getShareLinks = (data: ShareData) => ({
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`,
  telegram: `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`,
})

export function ShareButton({ 
  data, 
  variant = 'button', 
  size = 'md',
  className = '' 
}: ShareButtonProps) {
  const [showFallback, setShowFallback] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Native share handler
  const handleNativeShare = useCallback(async () => {
    if (!canShare) {
      setShowFallback(true)
      return
    }

    setIsSharing(true)
    
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      })
    } catch (err) {
      // User cancelled or error - show fallback
      if ((err as Error).name !== 'AbortError') {
        setShowFallback(true)
      }
    } finally {
      setIsSharing(false)
    }
  }, [data])

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(data.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = data.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [data.url])

  const shareLinks = getShareLinks(data)

  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          disabled={isSharing}
          className={`${sizeClasses[size]} rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ${className}`}
          aria-label="Share"
        >
          <Share2 size={iconSizes[size]} className="text-white" />
        </motion.button>

        {/* Fallback Modal */}
        <ShareFallbackModal
          isOpen={showFallback}
          onClose={() => setShowFallback(false)}
          shareLinks={shareLinks}
          url={data.url}
          onCopy={handleCopy}
          copied={copied}
        />
      </>
    )
  }

  // Render floating variant (FAB style)
  if (variant === 'floating') {
    return (
      <>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          disabled={isSharing}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-burnt-orange to-sunset-purple shadow-lg shadow-burnt-orange/30 flex items-center justify-center ${className}`}
          aria-label="Share"
        >
          <Share2 size={24} className="text-white" />
        </motion.button>

        <ShareFallbackModal
          isOpen={showFallback}
          onClose={() => setShowFallback(false)}
          shareLinks={shareLinks}
          url={data.url}
          onCopy={handleCopy}
          copied={copied}
        />
      </>
    )
  }

  // Default button variant
  return (
    <>
      <Button
        variant="ghost"
        size={size}
        onClick={handleNativeShare}
        disabled={isSharing}
        className={className}
      >
        <Share2 size={iconSizes[size]} />
        <span>Share</span>
      </Button>

      <ShareFallbackModal
        isOpen={showFallback}
        onClose={() => setShowFallback(false)}
        shareLinks={shareLinks}
        url={data.url}
        onCopy={handleCopy}
        copied={copied}
      />
    </>
  )
}

// Fallback share modal for browsers without Web Share API
interface ShareFallbackModalProps {
  isOpen: boolean
  onClose: () => void
  shareLinks: ReturnType<typeof getShareLinks>
  url: string
  onCopy: () => void
  copied: boolean
}

function ShareFallbackModal({
  isOpen,
  onClose,
  shareLinks,
  url,
  onCopy,
  copied,
}: ShareFallbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal - Bottom Sheet on mobile */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] rounded-t-3xl p-6 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-full md:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Text size="lg" className="font-semibold">Share</Text>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <ShareOption
                href={shareLinks.twitter}
                icon={<Twitter size={24} />}
                label="Twitter"
                color="#1DA1F2"
              />
              <ShareOption
                href={shareLinks.facebook}
                icon={<Facebook size={24} />}
                label="Facebook"
                color="#1877F2"
              />
              <ShareOption
                href={shareLinks.whatsapp}
                icon={<MessageCircle size={24} />}
                label="WhatsApp"
                color="#25D366"
              />
              <ShareOption
                onClick={onCopy}
                icon={copied ? <Check size={24} /> : <Link2 size={24} />}
                label={copied ? 'Copied!' : 'Copy'}
                color={copied ? '#10B981' : '#6B7280'}
              />
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 bg-transparent text-sm text-text-secondary outline-none truncate"
              />
              <button
                onClick={onCopy}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-burnt-orange/20 text-burnt-orange hover:bg-burnt-orange/30'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Handle bar for mobile */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full md:hidden" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Individual share option button
interface ShareOptionProps {
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  label: string
  color: string
}

function ShareOption({ href, onClick, icon, label, color }: ShareOptionProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <Text size="xs" color="secondary">{label}</Text>
    </motion.div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  )
}
