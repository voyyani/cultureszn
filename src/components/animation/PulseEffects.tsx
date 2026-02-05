/**
 * PulseEffects Components
 * 
 * Attention-grabbing pulse and breathing animations for CTAs and indicators.
 */

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

/**
 * Button with pulsing glow effect
 */
interface PulseButtonProps {
  children: ReactNode
  className?: string
  pulseColor?: string
  pulseIntensity?: number
  onClick?: () => void
  disabled?: boolean
}

export function PulseButton({
  children,
  className = '',
  pulseColor = 'rgba(255, 107, 53, 0.6)',
  pulseIntensity = 1,
  onClick,
  disabled = false,
}: PulseButtonProps) {
  const pulseVariants: Variants = {
    initial: {
      boxShadow: `0 0 0 0 ${pulseColor}`,
    },
    animate: {
      boxShadow: [
        `0 0 0 0 ${pulseColor}`,
        `0 0 0 ${20 * pulseIntensity}px transparent`,
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.button
      className={`relative ${className}`}
      variants={pulseVariants}
      initial="initial"
      animate={!disabled ? 'animate' : 'initial'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

/**
 * Attention indicator dot with pulse
 */
interface AttentionIndicatorProps {
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function AttentionIndicator({
  className = '',
  color = '#FF6B35',
  size = 'md',
  label,
}: AttentionIndicatorProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const pulseSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Pulse ring */}
      <motion.span
        className={`absolute ${pulseSizes[size]} rounded-full`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 2],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      
      {/* Core dot */}
      <span
        className={`relative ${sizes[size]} rounded-full`}
        style={{ backgroundColor: color }}
      />
      
      {/* Label */}
      {label && (
        <span className="ml-2 text-sm font-medium">{label}</span>
      )}
    </div>
  )
}

/**
 * Breathing glow effect for ambient backgrounds
 */
interface BreathingGlowProps {
  children?: ReactNode
  className?: string
  color?: string
  size?: number
  duration?: number
}

export function BreathingGlow({
  children,
  className = '',
  color = 'rgba(255, 107, 53, 0.3)',
  size = 300,
  duration = 4,
}: BreathingGlowProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Breathing orb */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}

/**
 * Play button with continuous pulse animation
 */
interface PulsingPlayButtonProps {
  onClick?: () => void
  isPlaying?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulsingPlayButton({
  onClick,
  isPlaying = false,
  size = 'md',
  className = '',
}: PulsingPlayButtonProps) {
  const sizes = {
    sm: { button: 'w-12 h-12', icon: 16, pulse: 48 },
    md: { button: 'w-16 h-16', icon: 24, pulse: 64 },
    lg: { button: 'w-20 h-20', icon: 32, pulse: 80 },
  }

  const config = sizes[size]

  return (
    <motion.button
      className={`relative ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse rings */}
      {!isPlaying && (
        <>
          <motion.span
            className="absolute rounded-full bg-[#1DB954]"
            style={{
              width: config.pulse,
              height: config.pulse,
              left: '50%',
              top: '50%',
              marginLeft: -config.pulse / 2,
              marginTop: -config.pulse / 2,
            }}
            animate={{
              scale: [1, 1.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.span
            className="absolute rounded-full bg-[#1DB954]"
            style={{
              width: config.pulse,
              height: config.pulse,
              left: '50%',
              top: '50%',
              marginLeft: -config.pulse / 2,
              marginTop: -config.pulse / 2,
            }}
            animate={{
              scale: [1, 1.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
          />
        </>
      )}
      
      {/* Button */}
      <span
        className={`relative flex items-center justify-center ${config.button} rounded-full bg-[#1DB954] shadow-lg shadow-[#1DB954]/30`}
      >
        {isPlaying ? (
          <svg 
            width={config.icon} 
            height={config.icon} 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg 
            width={config.icon} 
            height={config.icon} 
            viewBox="0 0 24 24" 
            fill="white"
            style={{ marginLeft: 2 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
    </motion.button>
  )
}

/**
 * Ripple effect on click
 */
interface RippleButtonProps {
  children: ReactNode
  className?: string
  rippleColor?: string
  onClick?: () => void
}

export function RippleButton({
  children,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  onClick,
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(0);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: ${rippleColor};
      animation: ripple 0.6s ease-out forwards;
      pointer-events: none;
    `
    
    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
    
    onClick?.()
  }

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      style={{ position: 'relative' }}
    >
      {children}
      <style>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

/**
 * Floating animation for elements
 */
interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 3,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
