import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// Lazy route chunks are transformed on first import; give findBy* room for a cold start.
configure({ asyncUtilTimeout: 5000 })

afterEach(() => cleanup())

// jsdom lacks these browser APIs; framer-motion `whileInView` and Layout need them
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
if (!('IntersectionObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'IntersectionObserver', { value: IntersectionObserverStub, writable: true })
}
// jsdom's own scrollTo logs "Not implemented" — always replace it
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
