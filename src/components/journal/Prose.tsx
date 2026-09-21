import type { ComponentType, ReactNode } from 'react'
import { mdxComponents } from './mdx-components'

/** The reading column: the contract's measure, generous line-height, the MDX component map. */
export function Prose({ Body, children }: { Body?: ComponentType<{ components?: typeof mdxComponents }>; children?: ReactNode }) {
  return (
    <div className="measure">
      {Body ? <Body components={mdxComponents} /> : children}
    </div>
  )
}
