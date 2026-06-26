import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const mod = await import('../src/content/index.js')
const LESSONS = mod.LESSONS

const norm = (s) => String(s).replace(/[ \t]+$/gm, '').replace(/\n+$/, '')

const langOf = (l, sol) =>
  l.challenge_language || l.language ||
  (sol.includes('#include') ? 'cpp' : sol.includes('public class') ? 'java' : 'py')

let javaAvailable = false
try {
  execFileSync('javac', ['-version'], { stdio: 'ignore' })
  javaAvailable = true
} catch {  }

const dir = mkdtempSync(join(tmpdir(), 'cfverify-'))
let total = 0, passed = 0, failed = 0, javaSkipped = 0
const failures = []

const runPy = (sol, input) => {
  const file = join(dir, `sol_${total}.py`)
  writeFileSync(file, sol)
  return execFileSync('python3', [file], { input: (input ?? '') + '\n', timeout: 8000, encoding: 'utf8' })
}

const compileJava = (sol) => {
  const file = join(dir, 'Main.java')
  writeFileSync(file, sol)
  execFileSync('javac', [file], { cwd: dir, timeout: 30000, stdio: 'pipe' })
}
const runJava = (input) =>
  execFileSync('java', ['-cp', dir, 'Main'], { input: (input ?? '') + '\n', timeout: 10000, encoding: 'utf8' })

for (const l of LESSONS) {
  const sol = l.challenge_solution_code
  const cases = l.challenge_test_cases
  if (!sol || !Array.isArray(cases) || cases.length === 0) continue
  const id = l.id || l.challenge_title || 'unknown'
  const lang = langOf(l, sol)

  if (lang === 'cpp') continue

  if (lang === 'java') {
    if (!javaAvailable) { javaSkipped += cases.length; continue }
    try {
      compileJava(sol)
    } catch (e) {
      failed += cases.length
      failures.push({ id, case: 'compile', error: String(e.stderr || e.message || e).slice(0, 160) })
      continue
    }
  }

  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i]
    if (tc == null || tc.expected_output == null) continue
    total++
    try {
      const out = lang === 'java' ? runJava(tc.input) : runPy(sol, tc.input)
      if (norm(out) === norm(tc.expected_output)) { passed++ }
      else {
        failed++
        failures.push({ id, case: i, input: (tc.input || '').slice(0, 60), expected: norm(tc.expected_output).slice(0, 80), got: norm(out).slice(0, 80) })
      }
    } catch (e) {
      failed++
      failures.push({ id, case: i, error: String(e.message || e).slice(0, 120) })
    }
  }
}

const skipNote = javaSkipped ? ` (${javaSkipped} Java case${javaSkipped === 1 ? '' : 's'} skipped — no local JDK)` : ''
console.log(`Solution verification: ${passed}/${total} test cases pass (${failed} failed)${skipNote}.`)
if (failures.length) {
  console.log(`\nFAILURES (first 40):`)
  for (const f of failures.slice(0, 40)) {
    if (f.error) console.log(`  ${f.id} case ${f.case}: ERROR ${f.error}`)
    else console.log(`  ${f.id} case ${f.case}: in="${f.input}" exp="${f.expected}" got="${f.got}"`)
  }
}
process.exit(failed ? 1 : 0)
