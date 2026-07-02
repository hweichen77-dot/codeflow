// Post-build prerender: after `vite build`, stamp a static HTML file for every
// lesson at dist/learn/<projectSlug>/<lessonSlug>/index.html with a correct
// <title>, description, canonical + OG/Twitter tags and real (crawlable) lesson
// text inside #root. The SPA mounts over #root and replaces the placeholder.
// Also regenerates dist/sitemap.xml with every lesson URL.
//
// SPA-only apps are invisible to search engines; this gives each lesson its own
// indexable page without a headless browser.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LESSON_ROUTES } from '../src/content/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const ORIGIN = 'https://hweichen77-dot.github.io/codeflow'
const BASE = '/codeflow'

const TOP_PAGES = ['/', '/AITrack', '/Playground', '/Projects', '/Challenges', '/Competitive', '/APCS', '/Privacy', '/Terms']

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

// Markdown → plain text, trimmed for meta/description use.
const stripMd = (s) =>
  String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function replaceHead(html, { title, description, url }) {
  const t = esc(`${title} · CodeFlow`)
  const d = esc(description)
  const u = esc(url)
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${d}" />`)
    .replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${u}" />`)
    .replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${u}" />`)
    .replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/, `<meta name="twitter:description" content="${d}" />`)
}

function seoBlock(r) {
  const intro = stripMd(r.explanation).slice(0, 1200)
  const parts = [
    `<h1>${esc(r.title)}</h1>`,
    r.concept ? `<p>${esc(stripMd(r.concept))}</p>` : '',
    r.projectTitle ? `<p><strong>Part of:</strong> ${esc(r.projectTitle)}</p>` : '',
    intro ? `<p>${esc(intro)}</p>` : '',
    r.challengeTitle ? `<p><strong>Challenge:</strong> ${esc(r.challengeTitle)}</p>` : '',
  ]
  // Inside #root so it shows pre-hydration and is replaced when the SPA mounts.
  return `<article style="max-width:720px;margin:64px auto;padding:0 24px;font-family:system-ui,sans-serif;color:#e8e2d5;line-height:1.6">${parts.join('')}</article>`
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.error('[prerender] dist/ not found — run `vite build` first')
    process.exit(1)
  }
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  const routes = LESSON_ROUTES.filter((r) => r.path)
  let written = 0

  for (const r of routes) {
    const url = `${ORIGIN}${r.path}`
    const description = stripMd(r.concept || r.explanation).slice(0, 155)
    let html = replaceHead(template, { title: r.title, description, url })
    html = html.replace('<div id="root"></div>', `<div id="root">${seoBlock(r)}</div>`)
    const outDir = path.join(DIST, r.path.replace(/^\//, ''))
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
    written++
  }

  // Sitemap: top pages + every lesson.
  const urls = [
    ...TOP_PAGES.map((p) => `${BASE}${p === '/' ? '/' : p}`),
    ...routes.map((r) => `${BASE}${r.path}`),
  ]
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>https://hweichen77-dot.github.io${u}</loc></url>`)
      .join('\n') +
    `\n</urlset>\n`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)

  console.log(`[prerender] wrote ${written} lesson pages + sitemap (${urls.length} urls)`)
}

run()
