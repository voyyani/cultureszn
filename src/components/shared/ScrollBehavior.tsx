/**
 * ScrollToTop Component
 * 
 * Scrolls to top of page on route changes and page reloads.
 * Also handles hash-based navigation for section jumping.
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to top on route change (but not for hash links)
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, let ScrollToHash handle it
    if (hash) return

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

/**
 * Handles hash-based navigation (e.g., /#members, /#sznals)
 * Scrolls to the element with the matching ID
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // On initial load without hash, scroll to top
    if (!hash && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    if (hash) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const elementId = hash.replace('#', '')
        const element = document.getElementById(elementId)
        
        if (element) {
          // Get header height for offset
          const header = document.querySelector('header')
          const headerHeight = header?.getBoundingClientRect().height || 80
          
          // Calculate position with offset
          const elementPosition = element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - headerHeight - 20

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [pathname, hash])

  return null
}

/**
 * Combined scroll behavior component
 * Use this in your App component
 */
export function ScrollBehavior() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Handle page reload - always start at top unless there's a hash
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, []) // Only on mount (page load/reload)

  useEffect(() => {
    if (hash) {
      // Handle hash navigation
      const timeoutId = setTimeout(() => {
        const elementId = hash.replace('#', '')
        const element = document.getElementById(elementId)
        
        if (element) {
          const header = document.querySelector('header')
          const headerHeight = header?.getBoundingClientRect().height || 80
          const elementPosition = element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - headerHeight - 20

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    } else {
      // Scroll to top on route change (not hash change)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}
