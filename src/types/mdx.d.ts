declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const meta: import('@/content/sznals').SZNalMeta
  const Component: ComponentType<{ components?: Record<string, ComponentType<unknown>> }>
  export default Component
}
