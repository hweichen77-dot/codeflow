// One-off: swap inline fontFamily strings from the old stack (Georgia / Space Mono
// / IBM Plex / Syne) to the new one (Bricolage Grotesque / Hanken Grotesk /
// Spline Sans Mono). The CSS utilities already point at the new fonts; this fixes
// the many inline `fontFamily: "..."` literals across components/pages.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = join(process.cwd(), 'src')
const SKIP_DIRS = new Set(['content'])

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif"
const BODY = "'Hanken Grotesk', system-ui, sans-serif"
const MONO = "'Spline Sans Mono', ui-monospace, monospace"

const MAP = [
  ["Georgia, 'Times New Roman', serif", DISPLAY],
  ['Georgia, "Times New Roman", serif', DISPLAY],
  ["'IBM Plex Serif', Georgia, serif", DISPLAY],
  ['"IBM Plex Serif", Georgia, serif', DISPLAY],
  ["'IBM Plex Sans', system-ui, sans-serif", BODY],
  ['"IBM Plex Sans", system-ui, sans-serif', BODY],
  ["'Space Mono', monospace", MONO],
  ['"Space Mono", monospace', MONO],
  ["'IBM Plex Mono', ui-monospace, monospace", MONO],
  ["'IBM Plex Mono', monospace", MONO],
  ["'Space Mono', 'Courier New', monospace", MONO],
  ["'Syne', system-ui, sans-serif", DISPLAY],
  ['"Syne", system-ui, sans-serif', DISPLAY],
  ["'Syne', Georgia, serif", DISPLAY],
  ["'Syne', sans-serif", DISPLAY],
  ['"Syne", sans-serif', DISPLAY],
  ["'IBM Plex Mono', 'Courier New', monospace", MONO],
  ["Georgia, serif", DISPLAY],
]

let files = 0
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name); const st = statSync(p)
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p); continue }
    if (!['.js', '.jsx', '.ts', '.tsx'].includes(extname(p))) continue
    let s = readFileSync(p, 'utf8'); const before = s
    for (const [from, to] of MAP) s = s.split(from).join(to)
    if (s !== before) { writeFileSync(p, s); files++ }
  }
}
walk(ROOT)
console.log(`Font-swapped ${files} files.`)
