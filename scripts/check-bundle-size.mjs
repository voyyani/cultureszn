#!/usr/bin/env node
// Fails when the largest initial JS chunk exceeds the gzip budget (see plan C1).
import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const BUDGET_GZIP = Number(process.env.BUNDLE_BUDGET_GZIP ?? 100_000)
const assetsDir = path.resolve('dist/assets')

let entries
try {
  entries = await readdir(assetsDir)
} catch {
  console.error('✗ dist/assets not found. Run `vite build` first.')
  process.exit(1)
}

const measured = []
for (const file of entries.filter((f) => f.endsWith('.js'))) {
  const buf = await readFile(path.join(assetsDir, file))
  measured.push({ file, raw: buf.length, gzip: gzipSync(buf).length })
}
if (measured.length === 0) {
  console.error('✗ No JS chunks in dist/assets.')
  process.exit(1)
}
measured.sort((a, b) => b.gzip - a.gzip)
const kb = (n) => `${(n / 1024).toFixed(1)} KB`
for (const m of measured) console.log(`  ${m.file.padEnd(40)} ${kb(m.raw).padStart(10)} raw ${kb(m.gzip).padStart(10)} gzip`)
const largest = measured[0]
console.log(`\n  largest: ${largest.file} ${kb(largest.gzip)} gzip / budget ${kb(BUDGET_GZIP)}`)
if (largest.gzip > BUDGET_GZIP) {
  console.error(`✗ Over budget by ${kb(largest.gzip - BUDGET_GZIP)}`)
  process.exit(1)
}
console.log('✓ Within bundle budget')
