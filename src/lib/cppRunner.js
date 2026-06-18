/**
 * C++ execution for the Competitive Coding section. Mirrors pyRunner.js but runs
 * server-side: the `run-cpp` Supabase Edge Function compiles + runs via the
 * Compiler Explorer (godbolt.org) execution API.
 *
 * Live only when Supabase is configured (VITE_SUPABASE_URL/ANON_KEY set and the
 * run-cpp function deployed). Otherwise returns { unavailable: true } and the UI
 * shows a friendly message — the app never crashes. Python challenges are
 * independent and keep working offline via Pyodide.
 */
import { supabase, auth } from "../api/supabaseClient";

const UNAVAILABLE_MSG =
  "C++ judging needs the cloud compiler, which isn't configured on this build. " +
  "Python challenges still run fully offline.";

/**
 * Compile + run C++ source with optional stdin.
 * Returns { output, isError, unavailable, compileError }.
 */
export async function runCpp(source, stdin = "") {
  if (!auth.isConfigured) {
    return { output: UNAVAILABLE_MSG, isError: true, unavailable: true };
  }
  try {
    const { data, error } = await supabase.functions.invoke("run-cpp", {
      body: { source, stdin: String(stdin || "") },
    });
    if (error) {
      return { output: "Couldn't reach the C++ runner. Try again in a moment.", isError: true };
    }
    if (data?.error) {
      return { output: `Runner error: ${data.error}`, isError: true };
    }

    const compileOut = String(data?.compile_output || "").trim();
    const compileFailed = (data?.compile_code ?? 0) !== 0 && compileOut;
    if (compileFailed) {
      return { output: compileOut, isError: true, compileError: true };
    }

    const stdout = String(data?.stdout || "");
    const stderr = String(data?.stderr || "").trim();
    const ran = (data?.code ?? 0) === 0;
    const output = (stdout || (stderr ? "" : "(no output)")) + (stderr ? `\n${stderr}` : "");
    return { output: output.replace(/\n+$/, "") || "(no output)", isError: !ran };
  } catch (e) {
    return { output: "Error: " + String(e?.message || e), isError: true };
  }
}

const norm = (s) => String(s ?? "").replace(/\r/g, "").trim().replace(/[ \t]+\n/g, "\n");

/**
 * Grade C++ against test cases. Same return shape as gradePython:
 * { output, passed, results: [{ ok, expected, got }], ran, isError, unavailable }.
 * A compile error fails every case and surfaces the compiler message once.
 */
export async function gradeCpp(source, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runCpp(source);
    return { output: r.output, passed: !r.isError, results: [], ran: true, isError: r.isError, unavailable: r.unavailable };
  }

  const results = [];
  let firstOutput = "";
  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const r = await runCpp(source, tc.input && tc.input !== "(no input)" ? tc.input : "");
    if (i === 0) firstOutput = r.output;
    // Short-circuit on compile error or unavailable backend: fail all remaining.
    if (r.compileError || r.unavailable) {
      for (let j = i; j < cases.length; j++) {
        results.push({ ok: false, expected: cases[j].expected_output, got: r.output });
      }
      return { output: firstOutput, passed: false, results, ran: true, isError: true, unavailable: r.unavailable };
    }
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: r.output });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
