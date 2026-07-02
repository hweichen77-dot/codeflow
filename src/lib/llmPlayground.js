import { supabase } from '@/api/supabaseClient'

// Calls the llm-playground edge function: runs the learner's system prompt
// against a set of test inputs on a live model and returns each real output.
// Grading happens client-side against the scenario rules (see gradePlayground).
export async function runPlayground({ systemPrompt, inputs, maxTokens = 200 }) {
  if (!supabase) {
    return { ok: false, configured: false, error: 'Live grading needs a Supabase connection (not configured in this build).' }
  }
  if (!systemPrompt?.trim()) return { ok: false, error: 'Write a system prompt first.' }
  if (!Array.isArray(inputs) || inputs.length === 0) return { ok: false, error: 'No test inputs.' }

  try {
    const { data, error } = await supabase.functions.invoke('llm-playground', {
      body: { systemPrompt, inputs, maxTokens },
    })
    if (error) {
      // Function not deployed yet / unreachable → show the friendly "not live
      // yet" state rather than a raw fetch error.
      const msg = error.message || 'Request failed.'
      if (/failed to send|edge function|not found|404/i.test(msg)) {
        return { ok: false, configured: false, error: 'Live grading is being switched on — check back soon.' }
      }
      return { ok: false, error: msg }
    }
    if (data?.configured === false) return { ok: false, configured: false, error: data.error }
    if (data?.error) return { ok: false, error: data.error }
    return { ok: true, results: data.results || [], model: data.model }
  } catch (e) {
    return { ok: false, error: String(e?.message || e) }
  }
}

// Rule-based grader. Rules are plain data so they live in lesson content:
//   { mustInclude: [...], mustExclude: [...], includeAny: [...] }
// Matching is case-insensitive. Returns { pass, reasons[] } per output.
export function gradeOutput(output, rules = {}) {
  const text = String(output || '').toLowerCase()
  const reasons = []
  let pass = true

  for (const term of rules.mustInclude || []) {
    if (!text.includes(String(term).toLowerCase())) { pass = false; reasons.push(`missing “${term}”`) }
  }
  for (const term of rules.mustExclude || []) {
    if (text.includes(String(term).toLowerCase())) { pass = false; reasons.push(`should not contain “${term}”`) }
  }
  if (rules.includeAny && rules.includeAny.length) {
    const hit = rules.includeAny.some((t) => text.includes(String(t).toLowerCase()))
    if (!hit) { pass = false; reasons.push(`expected one of: ${rules.includeAny.join(', ')}`) }
  }
  return { pass, reasons }
}

// Grade a whole run. `cases` aligns with the scenario inputs (same order).
export function gradePlayground(results, cases) {
  const graded = results.map((r, i) => {
    const rules = cases[i]?.rules || cases[i] || {}
    return { ...r, ...gradeOutput(r.output, rules) }
  })
  const passed = graded.filter((g) => g.pass).length
  return { graded, passed, total: graded.length, allPass: passed === graded.length && graded.length > 0 }
}
