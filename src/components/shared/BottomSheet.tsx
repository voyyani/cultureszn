/**
 * BottomSheet Component
 * 
 * Mobile-first modal that slides up from the bottom.
 * Supports drag-to-dismiss and snap points.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[] // Percentages of viewport height
  initialSnap?: number // Index of initial snap point
  showHandle?: boolean
  showCloseButton?: boolean
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.5, 0.9], // 50% and 90% of viewport
  initialSnap = 0,
  showHandle = true,
  showCloseButton = true,
  className = '',
}: BottomSheetProps) {
  const controls = useAnimation()
  const sheetRef = useRef<HTMLDivElement>(null)
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)

  // Get viewport height
  const getViewportHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerHeight
    }
    return 800
  }

  // Calculate sheet height from snap point
  const getSheetHeight = (snapIndex: number) => {
    return getViewportHeight() * snapPoints[snapIndex]
  }

  // Handle drag end
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    const velocity = info.velocity.y
    const offset = info.offset.y

    // Fast swipe down = close
    if (velocity > 500 || (offset > 100 && currentSnap === 0)) {
      onClose()
      return
    }

    // Fast swipe up = max snap
    if (velocity < -500) {
      setCurrentSnap(snapPoints.length - 1)
      controls.start({ 
        y: -getSheetHeight(snapPoints.length - 1),
        transition: { type: 'spring', damping: 30, stiffness: 300 }
      })
      return
    }

    // Find nearest snap point based on current position
    const currentY = Math.abs(offset)
    const viewportHeight = getViewportHeight()
    const currentPercentage = (getSheetHeight(currentSnap) - currentY) / viewportHeight

    let nearestSnap = 0
    let nearestDistance = Math.abs(snapPoints[0] - currentPercentage)

    snapPoints.forEach((snap, index) => {
      const distance = Math.abs(snap - currentPercentage)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestSnap = index
      }
    })

    // If dragged below minimum, close
    if (currentPercentage < snapPoints[0] * 0.5) {
      onClose()
      return
    }

    setCurrentSnap(nearestSnap)
    controls.start({ 
      y: -getSheetHeight(nearestSnap),
      transition: { type: 'spring', damping: 30, stiffness: 300 }
    })
  }

  // Animate when opening/closing or snap changes
  useEffect(() => {
    if (isOpen) {
      controls.start({ 
        y: -getSheetHeight(currentSnap),
        transition: { type: 'spring', damping: 30, stiffness: 300 }
      })
    }
  }, [isOpen, currentSnap, controls])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: getViewportHeight() }}
            animate={controls}
            exit={{ y: getViewportHeight() }}
            drag="y"
            dragConstraints={{ top: -getSheetHeight(snapPoints.length - 1), bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] rounded-t-3xl shadow-2xl touch-none ${className}`}
            style={{ 
              height: getSheetHeight(snapPoints.length - 1) + 100, // Extra for overscroll
              paddingBottom: 100 // Safe area for iOS
            }}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
                {title && (
                  <h2 className="text-lg font-[family-name:var(--font-heading)] font-semibold">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors ml-auto"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div 
              className={`overflow-y-auto px-6 py-4 ${isDragging ? 'pointer-events-none' : ''}`}
              style={{ maxHeight: getSheetHeight(snapPoints.length - 1) - 100 }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook for managing bottom sheet state
 */
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [title, setTitle] = useState<string | undefined>()

  const open = (options: { content: React.ReactNode; title?: string }) => {
    setContent(options.content)
    setTitle(options.title)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    // Delay clearing content for exit animation
    setTimeout(() => {
      setContent(null)
      setTitle(undefined)
    }, 300)
  }

  return { isOpen, content, title, open, close }
}
