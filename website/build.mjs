import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const version = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')).version
const htmlPath = join(here, 'index.html')

let html = readFileSync(htmlPath, 'utf8')
html = html
  .replace(/releases\/download\/v\d+\.\d+\.\d+\//g, `releases/download/v${version}/`)
  .replace(/CodeFlow_\d+\.\d+\.\d+_/g, `CodeFlow_${version}_`)
writeFileSync(htmlPath, html)
console.log(`Download links pinned to v${version}.`)
