// Runs every challenge's reference solution_code against its test_cases and
// asserts stdout matches expected_output. Safety net for content edits.
// Usage: node scripts/verify-solutions.mjs [--py module-03,module-19]  (filter)
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

// index.js exports named, not default — load LESSONS directly.
const mod = await import('../src/content/index.js')
const LESSONS = mod.LESSONS

// match pyRunner norm(): rstrip each line, strip single trailing newline, keep leading ws
const norm = (s) => String(s).replace(/[ \t]+$/gm, '').replace(/\n+$/,'')

const dir = mkdtempSync(join(tmpdir(), 'cfverify-'))
let total = 0, passed = 0, failed = 0
const failures = []

for (const l of LESSONS) {
  const sol = l.challenge_solution_code
  const cases = l.challenge_test_cases
  if (!sol || !Array.isArray(cases) || cases.length === 0) continue
  const id = l.id || l.challenge_title || 'unknown'
  const lang = sol.includes('#include') ? 'cpp' : 'py'
  if (lang === 'cpp') continue // curriculum is python; competitive handled separately
  const file = join(dir, `${String(id).replace(/[^a-z0-9-]/gi,'_')}.py`)
  writeFileSync(file, sol)
  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i]
    if (tc == null || tc.expected_output == null) continue
    total++
    try {
      const out = execFileSync('python3', [file], {
        input: (tc.input ?? '') + '\n',
        timeout: 8000,
        encoding: 'utf8',
      })
      if (norm(out) === norm(tc.expected_output)) { passed++ }
      else {
        failed++
        failures.push({ id, case: i, input: (tc.input||'').slice(0,60), expected: norm(tc.expected_output).slice(0,80), got: norm(out).slice(0,80) })
      }
    } catch (e) {
      failed++
      failures.push({ id, case: i, error: String(e.message || e).slice(0,120) })
    }
  }
}

console.log(`Solution verification: ${passed}/${total} test cases pass (${failed} failed).`)
if (failures.length) {
  console.log(`\nFAILURES (first 40):`)
  for (const f of failures.slice(0,40)) {
    if (f.error) console.log(`  ${f.id} case ${f.case}: ERROR ${f.error}`)
    else console.log(`  ${f.id} case ${f.case}: in="${f.input}" exp="${f.expected}" got="${f.got}"`)
  }
}
process.exit(failed ? 1 : 0)
