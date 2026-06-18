/**
 * C++ execution for the Competitive Coding section. Mirrors pyRunner.js.
 *
 * Two transports, same normalized result:
 *  1. If Supabase is configured, route through the `run-cpp` Edge Function
 *     (server-side proxy — lets you rate-limit / swap compiler centrally).
 *  2. Otherwise call the Compiler Explorer (godbolt.org) execute API DIRECTLY
 *     from the browser. Godbolt returns `Access-Control-Allow-Origin: *`, so
 *     this works on the static site with NO backend at all.
 *
 * Either way C++ judging is live. Python challenges are independent (Pyodide).
 */
import { supabase, auth } from "../api/supabaseClient";

const COMPILER = "g132"; // gcc 13.2 on Compiler Explorer
const GODBOLT_URL = `https://godbolt.org/api/compiler/${COMPILER}/compile`;

// Godbolt returns stdout/stderr as arrays of { text } lines.
function joinLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.map((l) => (l && typeof l === "object" ? l.text ?? "" : String(l))).join("\n");
}

// Call Compiler Explorer directly and return the same shape the Edge Function does.
async function runViaGodbolt(source, stdin) {
  const resp = await fetch(GODBOLT_URL, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      source,
      lang: "c++",
      allowStoreCodeDebug: true,
      options: {
        userArguments: "-O2 -std=c++17",
        executeParameters: { args: [], stdin: String(stdin || "") },
        filters: { execute: true, binary: true },
        tools: [],
        libraries: [],
      },
    }),
  });
  if (!resp.ok) throw new Error(`godbolt ${resp.status}`);
  const data = await resp.json();
  const compileCode = data?.code ?? 0;
  const exec = data?.execResult ?? {};
  return {
    compile_output: joinLines(data?.stderr).trim(),
    compile_code: compileCode,
    stdout: joinLines(exec.stdout),
    stderr: joinLines(exec.stderr),
    code: exec.code ?? (compileCode !== 0 ? compileCode : 0),
  };
}

// Turn the raw { compile_output, compile_code, stdout, stderr, code } into
// { output, isError, compileError }.
function normalize(data) {
  if (data?.error) return { output: `Runner error: ${data.error}`, isError: true };
  const compileOut = String(data?.compile_output || "").trim();
  if ((data?.compile_code ?? 0) !== 0 && compileOut) {
    return { output: compileOut, isError: true, compileError: true };
  }
  const stdout = String(data?.stdout || "");
  const stderr = String(data?.stderr || "").trim();
  const ran = (data?.code ?? 0) === 0;
  const output = (stdout || (stderr ? "" : "(no output)")) + (stderr ? `\n${stderr}` : "");
  return { output: output.replace(/\n+$/, "") || "(no output)", isError: !ran };
}

/**
 * Compile + run C++ source with optional stdin.
 * Returns { output, isError, compileError }.
 */
export async function runCpp(source, stdin = "") {
  try {
    let data;
    if (auth.isConfigured) {
      const { data: d, error } = await supabase.functions.invoke("run-cpp", {
        body: { source, stdin: String(stdin || "") },
      });
      if (error) throw error;
      data = d;
    } else {
      data = await runViaGodbolt(source, stdin);
    }
    return normalize(data);
  } catch (e) {
    // If the Edge Function path failed, fall back to a direct browser call.
    if (auth.isConfigured) {
      try {
        return normalize(await runViaGodbolt(source, stdin));
      } catch {
        /* fall through */
      }
    }
    return { output: "Couldn't reach the C++ compiler. Check your connection and try again.", isError: true };
  }
}

const norm = (s) => String(s ?? "").replace(/\r/g, "").trim().replace(/[ \t]+\n/g, "\n");

/**
 * Grade C++ against test cases. Same return shape as gradePython:
 * { output, passed, results: [{ ok, expected, got }], ran, isError }.
 * A compile error fails every case and surfaces the compiler message once.
 */
export async function gradeCpp(source, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runCpp(source);
    return { output: r.output, passed: !r.isError, results: [], ran: true, isError: r.isError };
  }

  const results = [];
  let firstOutput = "";
  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const r = await runCpp(source, tc.input && tc.input !== "(no input)" ? tc.input : "");
    if (i === 0) firstOutput = r.output;
    // A compile error fails the whole submission — no point running more cases.
    if (r.compileError) {
      for (let j = i; j < cases.length; j++) {
        results.push({ ok: false, expected: cases[j].expected_output, got: r.output });
      }
      return { output: firstOutput, passed: false, results, ran: true, isError: true };
    }
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: r.output });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
