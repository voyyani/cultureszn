/**
 * HoverEffects Components
 * 
 * Interactive hover effects for cards, buttons, and interactive elements.
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Hook to track mouse position relative to an element
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

/**
 * Card with hover lift and glow effect
 */
interface HoverCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  liftAmount?: number
  glowIntensity?: number
}

export function HoverCard({
  children,
  className = '',
  glowColor = 'rgba(255, 107, 53, 0.3)',
  liftAmount = 8,
  glowIntensity = 0.3,
}: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -liftAmount : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        style={{
          background: glowColor,
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: isHovered ? glowIntensity : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/**
 * Glow effect that follows mouse
 */
interface HoverGlowProps {
  children: ReactNode
  className?: string
  glowColor?: string
  glowSize?: number
}

export function HoverGlow({
  children,
  className = '',
  glowColor = 'rgba(255, 107, 53, 0.15)',
  glowSize = 200,
}: HoverGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow circle that follows mouse */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          left: mousePosition.x - glowSize / 2,
          top: mousePosition.y - glowSize / 2,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  )
}

/**
 * Magnetic button that moves toward cursor
 */
interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  radius = 100,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 300, damping: 20 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
    
    if (distance < radius) {
      x.set(distanceX * strength)
      y.set(distanceY * strength)
    }
  }, [x, y, strength, radius])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

/**
 * 3D tilt card effect
 */
interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  perspective?: number
  glare?: boolean
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 15,
  scale = 1.02,
  perspective = 1000,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const springConfig = { stiffness: 300, damping: 20 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const percentX = mouseX / (rect.width / 2)
    const percentY = mouseY / (rect.height / 2)
    
    rotateX.set(-percentY * maxTilt)
    rotateY.set(percentX * maxTilt)
    
    // Glare position
    glareX.set(50 + percentX * 30)
    glareY.set(50 + percentY * 30)
  }, [rotateX, rotateY, glareX, glareY, maxTilt])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }, [rotateX, rotateY, glareX, glareY])

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? scale : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {children}
        
        {/* Glare overlay */}
        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-inherit"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) => 
                  `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
              ),
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

/**
 * Spotlight effect that follows mouse across entire section
 */
interface SpotlightProps {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}

export function Spotlight({
  children,
  className = '',
  color = 'rgba(255, 107, 53, 0.1)',
  size = 400,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          left: position.x - size / 2,
          top: position.y - size / 2,
          mixBlendMode: 'screen',
        }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {children}
    </div>
  )
}
