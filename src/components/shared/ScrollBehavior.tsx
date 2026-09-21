import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to the top on route change; honour `#hash` targets with the header's height as offset. */
export function ScrollBehavior() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(hash.slice(1))
      if (!element) return
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 64
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - headerHeight - 16, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [pathname, hash])

  return null
}
