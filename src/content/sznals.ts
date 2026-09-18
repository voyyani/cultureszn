import type { ComponentType } from 'react'

export interface SZNalMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedDate: string
  readTime: string
  status: 'draft' | 'published'
  cover?: string
}

type Loader = () => Promise<{ default: ComponentType }>
const loaders = import.meta.glob<{ default: ComponentType }>('/content/sznals/*.mdx')
// `?meta` is served by scripts/lib/mdx-meta-plugin.mjs — meta only, bodies stay lazy.
const metas = import.meta.glob<Omit<SZNalMeta, 'slug'>>('/content/sznals/*.mdx', { eager: true, import: 'meta', query: '?meta' })

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.mdx(\?.*)?$/, '')

const ALL: SZNalMeta[] = Object.entries(metas)
  .map(([path, meta]) => ({ ...meta, slug: slugOf(path) }))
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))

export const getAllSZNals = () => ALL.filter((s) => s.status === 'published')
export const getDraftSZNals = () => ALL.filter((s) => s.status === 'draft')
export const getSZNalBySlug = (slug: string) => ALL.find((s) => s.slug === slug)

export async function loadSZNal(slug: string): Promise<ComponentType> {
  const entry = Object.entries(loaders).find(([path]) => slugOf(path) === slug)
  if (!entry) throw new Error(`Unknown SZNal: ${slug}`)
  return ((await (entry[1] as Loader)()).default)
}
