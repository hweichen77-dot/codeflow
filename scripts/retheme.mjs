// One-off: warm-shift every hardcoded hex in src/ from the cold lime/black palette
// to the warm amber identity. Skips data (content/) and the already-edited token
// sources (index.css, trace/theme.js).
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = join(process.cwd(), 'src')
const SKIP_DIRS = new Set(['content'])
const SKIP_FILES = new Set([join(ROOT, 'index.css'), join(ROOT, 'components/lesson/trace/theme.js')])

// Ordered: 8-digit alpha and 6-digit before 3-digit; specific colors before grays.
const REPLACEMENTS = [
  // lime -> amber (preserve any 2-hex alpha suffix)
  [/#b8ff00([0-9a-fA-F]{2})/gi, '#E8A33C$1'],
  [/#b8ff00(?![0-9a-fA-F])/gi, '#E8A33C'],
  [/rgba\(\s*184\s*,\s*255\s*,\s*0\s*,/gi, 'rgba(232,163,60,'],
  [/#9fd80a/gi, '#C78A2E'],
  // lime-ish greens -> amber/dim
  [/#4d7c0f/gi, '#9A6A1F'], [/#65a30d/gi, '#C78A2E'], [/#166534/gi, '#9A6A1F'],
  [/#059669/gi, '#C2643C'], [/#2d7a3a/gi, '#9A6A1F'], [/#4ade80/gi, '#E0B341'],
  // cold blues -> warm clay
  [/#2563eb/gi, '#C2643C'], [/#60a5fa/gi, '#C2643C'], [/#7cc4ff/gi, '#C2643C'],
  [/#3b82f6/gi, '#C2643C'], [/#0ea5e9/gi, '#C2643C'],
  // warn / fail
  [/#ffb300/gi, '#E0B341'], [/#ff6b6b/gi, '#FF6B5C'], [/#ef4444/gi, '#FF6B5C'],
  [/#fca5a5/gi, '#F3B0A6'],
  // dark surfaces (6-digit)
  [/rgba\(\s*10\s*,\s*10\s*,\s*10\s*,/gi, 'rgba(21,19,14,'],
  [/#0a0a0a/gi, '#15130E'], [/#0d0d0d/gi, '#131009'], [/#0f0f0f/gi, '#161309'],
  [/#111111/gi, '#1C1A14'], [/#161616/gi, '#221F18'], [/#141414/gi, '#1F1C15'],
  [/#1a1a1a/gi, '#262219'], [/#1e1e1e/gi, '#262219'], [/#1f1f1f/gi, '#2A261E'],
  [/#222222/gi, '#2A261E'], [/#2a2a2a/gi, '#34302A'], [/#333333/gi, '#3A352D'],
  // dark surfaces (3-digit) — guard against being part of a longer hex
  [/#111(?![0-9a-fA-F])/gi, '#1C1A14'], [/#222(?![0-9a-fA-F])/gi, '#2A261E'],
  [/#333(?![0-9a-fA-F])/gi, '#3A352D'],
  // warm text neutrals (6-digit)
  [/#f0f0f0/gi, '#F2EDE2'], [/#f4f4f5/gi, '#F2EDE2'], [/#e8e8e8/gi, '#ECE7DC'],
  [/#e4e4e7/gi, '#E0D9CA'], [/#e0e0e0/gi, '#D8D1C2'], [/#d4d4d4/gi, '#C9C1B2'],
  [/#cccccc/gi, '#C2BAAA'], [/#c4c4c4/gi, '#BBB3A4'], [/#bbbbbb/gi, '#A8A092'],
  [/#aaaaaa/gi, '#A39B8C'], [/#999999/gi, '#8F8779'], [/#888888/gi, '#8F8779'],
  [/#777777/gi, '#7A7264'], [/#666666/gi, '#6E665A'], [/#555555/gi, '#5A554B'],
  [/#444444/gi, '#4A453C'], [/#3f3f46/gi, '#46413A'], [/#52525b/gi, '#5A554B'],
  [/#71717a/gi, '#7A7264'], [/#6b7280/gi, '#756C5C'], [/#9ca3af/gi, '#A39B8C'],
  // warm text neutrals (3-digit)
  [/#ccc(?![0-9a-fA-F])/gi, '#C2BAAA'], [/#bbb(?![0-9a-fA-F])/gi, '#A8A092'],
  [/#aaa(?![0-9a-fA-F])/gi, '#A39B8C'], [/#999(?![0-9a-fA-F])/gi, '#8F8779'],
  [/#888(?![0-9a-fA-F])/gi, '#8F8779'], [/#777(?![0-9a-fA-F])/gi, '#7A7264'],
  [/#666(?![0-9a-fA-F])/gi, '#6E665A'], [/#555(?![0-9a-fA-F])/gi, '#5A554B'],
  [/#444(?![0-9a-fA-F])/gi, '#4A453C'],
]

let files = 0, edits = 0
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p); continue }
    if (!['.js', '.jsx', '.ts', '.tsx', '.css'].includes(extname(p))) continue
    if (SKIP_FILES.has(p)) continue
    let src = readFileSync(p, 'utf8')
    const before = src
    for (const [re, to] of REPLACEMENTS) src = src.replace(re, to)
    if (src !== before) { writeFileSync(p, src); files++; edits++ }
  }
}
walk(ROOT)
console.log(`Re-themed ${files} files.`)
