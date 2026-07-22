import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE = path.join(ROOT, 'website')
const DIST = path.join(ROOT, 'dist')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://compilearn.vercel.app').replace(/\/+$/, '')
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version

const HTML_PAGES = ['index.html', 'teachers.html']
const COPY_AS_IS = ['styles.css', 'hls.min.js']

fs.mkdirSync(DIST, { recursive: true })

for (const page of HTML_PAGES) {
  const src = path.join(SITE, page)
  if (!fs.existsSync(src)) continue
  const html = fs.readFileSync(src, 'utf8').replaceAll('__SITE_URL__', SITE_URL).replaceAll('__VERSION__', VERSION)
  if (html.includes('codeflow.app')) {
    throw new Error(`${page} still references the retired codeflow.app domain`)
  }
  fs.writeFileSync(path.join(DIST, page), html)
}

for (const asset of COPY_AS_IS) {
  const src = path.join(SITE, asset)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, asset))
}

const ROOT_ASSETS = ['og-image.png', 'sitemap.xml', 'favicon.svg', 'manifest.json']
for (const asset of ROOT_ASSETS) {
  const src = path.join(DIST, 'app', asset)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, asset))
  else console.warn(`[marketing] ${asset} missing from the app build`)
}

fs.cpSync(path.join(SITE, 'fonts'), path.join(DIST, 'fonts'), { recursive: true })
fs.copyFileSync(path.join(DIST, 'app', 'index.html'), path.join(DIST, '404.html'))

fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

console.log(`[marketing] built ${HTML_PAGES.length} pages against ${SITE_URL}`)
