/**
 * useScrollParallax Hook
 * 
 * Scroll-driven parallax effects using native scroll events
 * and CSS transforms for optimal performance.
 */

import { useEffect, useRef, useState, useCallback } from 'react'

interface ParallaxConfig {
  /** Speed factor: 0 = stationary, 1 = moves with scroll, <1 = slower, >1 = faster */
  speed?: number
  /** Direction of parallax movement */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Maximum distance to move (in pixels) */
  maxDistance?: number
  /** Easing function for movement */
  easing?: 'linear' | 'easeOut' | 'easeInOut'
  /** Only activate when element is in viewport */
  inViewOnly?: boolean
  /** Scale effect range [min, max] - e.g., [0.9, 1.1] */
  scale?: [number, number]
  /** Opacity effect range [min, max] - e.g., [0, 1] */
  opacity?: [number, number]
  /** Rotation effect range [min, max] in degrees */
  rotation?: [number, number]
}

interface ParallaxState {
  y: number
  x: number
  scale: number
  opacity: number
  rotation: number
  progress: number // 0 to 1 based on scroll position
}

// Easing functions
const easings = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

// Interpolate between two values based on progress
function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

/**
 * Hook for scroll-driven parallax effects
 */
export function useScrollParallax<T extends HTMLElement = HTMLDivElement>(
  config: ParallaxConfig = {}
) {
  const {
    speed = 0.5,
    direction = 'up',
    maxDistance = 200,
    easing = 'easeOut',
    inViewOnly = true,
    scale,
    opacity,
    rotation,
  } = config

  const ref = useRef<T>(null)
  const [state, setState] = useState<ParallaxState>({
    y: 0,
    x: 0,
    scale: scale ? scale[0] : 1,
    opacity: opacity ? opacity[0] : 1,
    rotation: rotation ? rotation[0] : 0,
    progress: 0,
  })

  const calculateTransform = useCallback(() => {
    if (!ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Calculate how far through the viewport the element is
    // 0 = element just entered at bottom, 1 = element just left at top
    const elementCenter = rect.top + rect.height / 2
    const viewportProgress = 1 - (elementCenter / windowHeight)
    
    // Clamp progress to 0-1 range
    const clampedProgress = Math.max(0, Math.min(1, viewportProgress))
    
    // Check if element is in viewport
    const isInView = rect.bottom > 0 && rect.top < windowHeight

    if (inViewOnly && !isInView) {
      return
    }

    // Apply easing
    const easedProgress = easings[easing](clampedProgress)

    // Calculate movement based on direction
    let x = 0
    let y = 0
    const distance = maxDistance * speed * (easedProgress - 0.5) * 2

    switch (direction) {
      case 'up':
        y = -distance
        break
      case 'down':
        y = distance
        break
      case 'left':
        x = -distance
        break
      case 'right':
        x = distance
        break
    }

    // Calculate scale, opacity, and rotation based on progress
    const currentScale = scale 
      ? lerp(scale[0], scale[1], clampedProgress)
      : 1
    const currentOpacity = opacity
      ? lerp(opacity[0], opacity[1], clampedProgress)
      : 1
    const currentRotation = rotation
      ? lerp(rotation[0], rotation[1], clampedProgress)
      : 0

    setState({
      y,
      x,
      scale: currentScale,
      opacity: currentOpacity,
      rotation: currentRotation,
      progress: clampedProgress,
    })
  }, [speed, direction, maxDistance, easing, inViewOnly, scale, opacity, rotation])

  useEffect(() => {
    // Use requestAnimationFrame for smooth updates
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateTransform()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial calculation
    calculateTransform()

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [calculateTransform])

  // Generate CSS transform string
  const transform = `
    translate3d(${state.x}px, ${state.y}px, 0)
    scale(${state.scale})
    rotate(${state.rotation}deg)
  `.trim()

  return {
    ref,
    style: {
      transform,
      opacity: state.opacity,
      willChange: 'transform, opacity',
    },
    state,
  }
}

/**
 * Hook for hero parallax background effect
 */
export function useHeroParallax(intensity: number = 0.3) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Background moves slower than scroll (parallax effect)
  const backgroundY = scrollY * intensity
  
  // Opacity fades as user scrolls
  const opacity = Math.max(0, 1 - scrollY / 500)
  
  // Slight scale increase as user scrolls
  const scale = 1 + scrollY * 0.0002

  return {
    backgroundStyle: {
      transform: `translate3d(0, ${backgroundY}px, 0) scale(${scale})`,
      opacity,
      willChange: 'transform, opacity',
    },
    scrollY,
    progress: Math.min(1, scrollY / 500),
  }
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollTrigger(threshold: number = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isTriggered, setIsTriggered] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTriggered(true)
          }
          // Calculate how much of the element is visible
          setProgress(entry.intersectionRatio)
        })
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 to 1 in 0.01 increments
        rootMargin: '0px',
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isTriggered, progress }
}
