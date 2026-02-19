/**
 * ReleaseCardSkeleton Component
 * 
 * Loading skeleton for release cards with shimmer animation.
 * Supports different variants to match ReleaseCard layouts.
 * 
 * @example
 * ```tsx
 * // Featured release skeleton
 * <ReleaseCardSkeleton variant="featured" />
 * 
 * // Compact release skeleton
 * <ReleaseCardSkeleton variant="compact" />
 * ```
 */

import { motion } from 'framer-motion'

export interface ReleaseCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

/**
 * Skeleton loader for release cards
 */
export function ReleaseCardSkeleton({ 
  variant = 'default',
  className = '',
}: ReleaseCardSkeletonProps) {
  // Shimmer animation
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  }

  // Compact variant (for horizontal list items)
  if (variant === 'compact') {
    return (
      <div 
        className={`
          flex items-center gap-5 p-5 bg-white/[0.03] rounded-[var(--radius-szn)] 
          border border-white/5 ${className}
        `}
      >
        {/* Cover art skeleton */}
        <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-white/5 relative">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'linear' 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        </div>

        {/* Text content skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 bg-white/5 rounded w-3/4 relative overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: 'linear',
                delay: 0.1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>

          {/* Artist and type */}
          <div className="h-4 bg-white/5 rounded w-1/2 relative overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: 'linear',
                delay: 0.2,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>

          {/* Date */}
          <div className="h-4 bg-white/5 rounded w-1/3 relative overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: 'linear',
                delay: 0.3,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>
        </div>
      </div>
    )
  }

  // Featured variant (large card with background)
  if (variant === 'featured') {
    return (
      <div 
        className={`
          relative bg-black/30 rounded-[var(--radius-szn)] p-8 md:p-10 
          border border-white/10 overflow-hidden ${className}
        `}
      >
        {/* Background skeleton */}
        <div className="absolute inset-0 bg-white/5 z-0">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: 'linear' 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Label */}
          <div className="h-3 bg-burnt-orange/20 rounded w-32 relative overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: 'linear',
                delay: 0.1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-burnt-orange/20 to-transparent"
            />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 bg-white/5 rounded w-2/3 relative overflow-hidden">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: 'linear',
                  delay: 0.2,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <div className="h-10 bg-burnt-orange/20 rounded-lg w-32 relative overflow-hidden">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: 'linear',
                  delay: 0.3,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-burnt-orange/20 to-transparent"
              />
            </div>
            <div className="h-10 bg-white/5 rounded-lg w-32 relative overflow-hidden">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: 'linear',
                  delay: 0.4,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant (card with image)
  return (
    <div 
      className={`
        bg-white/[0.03] rounded-[var(--radius-szn)] border border-white/5 
        overflow-hidden ${className}
      `}
    >
      {/* Image skeleton */}
      <div className="h-[250px] bg-white/5 relative overflow-hidden">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: 'linear' 
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-5 bg-white/5 rounded w-3/4 relative overflow-hidden">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'linear',
              delay: 0.1,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        </div>

        {/* Artist */}
        <div className="h-4 bg-burnt-orange/10 rounded w-1/2 relative overflow-hidden">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'linear',
              delay: 0.2,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-burnt-orange/10 to-transparent"
          />
        </div>

        {/* Date */}
        <div className="h-4 bg-white/5 rounded w-1/3 relative overflow-hidden">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'linear',
              delay: 0.3,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
