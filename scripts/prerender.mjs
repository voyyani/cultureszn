#!/usr/bin/env node
// Writes dist/<route>.html with a route-specific <head> for share previews. The SPA hydrates on top.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { getRouteMeta } = await import(pathToFileURL(path.resolve('dist-seo/entry-seo.js')).href)
const template = await readFile('dist/index.html', 'utf8')
if (!/<!-- seo:start -->[\s\S]*<!-- seo:end -->/.test(template)) {
  console.error('✗ dist/index.html has no <!-- seo:start --> … <!-- seo:end --> block')
  process.exit(1)
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function apply(html, m) {
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Culture SZN" />`,
    `<meta property="og:locale" content="en_KE" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')
  return html.replace(/<!-- seo:start -->[\s\S]*<!-- seo:end -->/, `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`)
}

let count = 0
for (const m of getRouteMeta()) {
  const file = m.path === '/' ? 'dist/index.html' : `dist${m.path}.html`
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, apply(template, m))
  count++
}
console.log(`✓ prerendered <head> for ${count} routes`)
