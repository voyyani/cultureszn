/**
 * useDocumentHead Hook
 * 
 * Manages document head elements (title, meta, JSON-LD) for SEO.
 * Works with React 19 without external dependencies.
 */

import { useEffect } from 'react'

interface MetaTag {
  name?: string
  property?: string
  content: string
}

interface DocumentHeadOptions {
  title: string
  description?: string
  canonical?: string
  meta?: MetaTag[]
  jsonLd?: object
}

export function useDocumentHead({
  title,
  description,
  canonical,
  meta = [],
  jsonLd,
}: DocumentHeadOptions) {
  // Serialise object deps so a new-but-equal array/object doesn't re-run the effect (F16)
  const metaKey = JSON.stringify(meta)
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    // Store original title for cleanup
    const originalTitle = document.title

    // Set document title
    document.title = title

    // Track created elements for cleanup
    const createdElements: Element[] = []

    // Set description meta
    if (description) {
      let descMeta = document.querySelector('meta[name="description"]')
      if (!descMeta) {
        descMeta = document.createElement('meta')
        descMeta.setAttribute('name', 'description')
        document.head.appendChild(descMeta)
        createdElements.push(descMeta)
      }
      descMeta.setAttribute('content', description)
    }

    // Set canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
        createdElements.push(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonical)
    }

    // Set additional meta tags
    meta.forEach((tag) => {
      const selector = tag.property
        ? `meta[property="${tag.property}"]`
        : `meta[name="${tag.name}"]`
      
      let element = document.querySelector(selector)
      
      if (!element) {
        element = document.createElement('meta')
        if (tag.property) {
          element.setAttribute('property', tag.property)
        } else if (tag.name) {
          element.setAttribute('name', tag.name)
        }
        document.head.appendChild(element)
        createdElements.push(element)
      }
      
      element.setAttribute('content', tag.content)
    })

    // Set JSON-LD structured data
    if (jsonLd) {
      const scriptId = 'json-ld-structured-data'
      let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null
      
      if (!scriptElement) {
        scriptElement = document.createElement('script')
        scriptElement.id = scriptId
        scriptElement.type = 'application/ld+json'
        document.head.appendChild(scriptElement)
        createdElements.push(scriptElement)
      }
      
      scriptElement.textContent = JSON.stringify(jsonLd)
    }

    // Cleanup on unmount
    return () => {
      document.title = originalTitle
      createdElements.forEach((el) => el.remove())
    }
  }, [title, description, canonical, metaKey, jsonLdKey]) // eslint-disable-line react-hooks/exhaustive-deps
}
