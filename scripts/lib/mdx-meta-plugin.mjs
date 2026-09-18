// Vite plugin: `import x from './post.mdx?meta'` resolves to a module that exports ONLY the
// `export const meta = {...}` block from the MDX file. Lets the journal index read every
// article's meta eagerly while each article body stays in its own lazy chunk.
import { readFile } from 'node:fs/promises'

const SUFFIX = '?meta'

export default function mdxMeta() {
  return {
    name: 'cultureszn:mdx-meta',
    enforce: 'pre',
    async load(id) {
      if (!id.endsWith(`.mdx${SUFFIX}`)) return null
      const file = id.slice(0, -SUFFIX.length)
      const source = await readFile(file, 'utf8')
      const match = source.match(/export\s+const\s+meta\s*=\s*(\{[\s\S]*?\n\})/)
      if (!match) this.error(`${file}: missing \`export const meta = { ... }\` block`)
      return `export const meta = ${match[1]}\nexport default meta\n`
    },
  }
}
