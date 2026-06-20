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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Distinct sentinel thrown when the compiler service is overloaded/unreachable
// after retries. The grader treats this as "could not grade — retry", NOT as a
// wrong answer, so a flaky upstream never produces a false FAIL verdict.
class InfraError extends Error {
  constructor(message) {
    super(message);
    this.name = "InfraError";
    this.infra = true;
  }
}

// Call Compiler Explorer directly and return the same shape the Edge Function
// does (plus `timed_out`). Retries 429/503 with exponential backoff honoring
// Retry-After; a persistent overload surfaces as an InfraError.
async function runViaGodbolt(source, stdin) {
  const MAX_ATTEMPTS = 4;
  let lastStatus = 0;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
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

    if (resp.ok) {
      const data = await resp.json();
      const compileCode = data?.code ?? 0;
      const exec = data?.execResult ?? {};
      return {
        compile_output: joinLines(data?.stderr).trim(),
        compile_code: compileCode,
        stdout: joinLines(exec.stdout),
        stderr: joinLines(exec.stderr),
        code: exec.code ?? (compileCode !== 0 ? compileCode : 0),
        timed_out: Boolean(exec.timedOut || data?.timedOut),
      };
    }

    lastStatus = resp.status;
    // Only 429/503 are worth retrying — everything else is a hard failure.
    if (resp.status !== 429 && resp.status !== 503) {
      throw new Error(`godbolt ${resp.status}`);
    }
    if (attempt < MAX_ATTEMPTS - 1) {
      const retryAfter = Number(resp.headers.get("retry-after"));
      const backoff = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 500 * Math.pow(2, attempt); // 500ms, 1s, 2s
      await sleep(backoff);
    }
  }
  throw new InfraError(`godbolt overloaded (${lastStatus})`);
}

// Turn the raw { compile_output, compile_code, stdout, stderr, code, timed_out }
// into { output, isError, compileError, timedOut, runtimeError, empty }.
function normalize(data) {
  if (data?.error) return { output: `Runner error: ${data.error}`, isError: true, empty: false };

  const compileOut = String(data?.compile_output || "").trim();
  if ((data?.compile_code ?? 0) !== 0 && compileOut) {
    return { output: compileOut, isError: true, compileError: true, empty: false };
  }

  // Time Limit Exceeded — surface explicitly, never as a wrong answer.
  if (data?.timed_out) {
    return { output: "Time Limit Exceeded", isError: true, timedOut: true, empty: false };
  }

  const stdout = String(data?.stdout || "");
  const stderr = String(data?.stderr || "").trim();
  const exitCode = data?.code ?? 0;
  const ran = exitCode === 0;

  // Nonzero exit = runtime error/crash. Prefix it so an empty-stdout crash is
  // distinguishable from a program that legitimately printed nothing.
  if (!ran) {
    const prefix = `Runtime error (exit ${exitCode})`;
    const detail = stderr || stdout;
    return {
      output: detail ? `${prefix}\n${detail}` : prefix,
      isError: true,
      runtimeError: true,
      empty: false,
    };
  }

  const combined = stdout + (stderr ? `${stdout ? "\n" : ""}${stderr}` : "");
  const raw = combined.replace(/\n+$/, "");
  return { output: raw, isError: false, empty: raw.length === 0 };
}

/**
 * Compile + run C++ source with optional stdin.
 * Returns { output, isError, compileError, timedOut, runtimeError, empty }.
 * May also return { isError, infra } when the compiler service is unreachable.
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
      } catch (e2) {
        if (e2 && e2.infra) {
          return { output: "Compiler service is busy. Please try again in a moment.", isError: true, infra: true, empty: false };
        }
        /* fall through */
      }
    }
    if (e && e.infra) {
      return { output: "Compiler service is busy. Please try again in a moment.", isError: true, infra: true, empty: false };
    }
    return { output: "Couldn't reach the C++ compiler. Check your connection and try again.", isError: true, empty: false };
  }
}

// Normalize for comparison: strip trailing whitespace per line and a single
// trailing newline, but PRESERVE leading whitespace and internal blank lines so
// indentation- and ASCII-art-sensitive problems grade correctly.
const norm = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+(?=\n)/g, "") // rstrip each line
    .replace(/[ \t]+$/, "")       // rstrip final line (no trailing \n)
    .replace(/\n$/, "");          // drop exactly one trailing newline

/**
 * Grade C++ against test cases. Same return shape as gradePython:
 * { output, passed, results: [{ ok, expected, got }], ran, isError }.
 * A compile error fails every case and surfaces the compiler message once.
 * A TLE fails the submission explicitly; an infra error aborts grading as a
 * distinct "could not grade — retry" result rather than a wrong-answer verdict.
 */
export async function gradeCpp(source, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runCpp(source);
    return {
      output: r.empty ? "(no output)" : r.output,
      passed: !r.isError,
      results: [],
      ran: true,
      isError: r.isError,
    };
  }

  const results = [];
  let firstOutput = "";
  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const r = await runCpp(source, tc.input && tc.input !== "(no input)" ? tc.input : "");
    const shown = r.empty ? "(no output)" : r.output;
    if (i === 0) firstOutput = shown;

    // Compiler service unreachable: abort without a wrong-answer verdict.
    if (r.infra) {
      return { output: r.output, passed: false, results, ran: false, isError: true, infra: true };
    }

    // A compile error fails the whole submission — no point running more cases.
    if (r.compileError) {
      for (let j = i; j < cases.length; j++) {
        results.push({ ok: false, expected: cases[j].expected_output, got: r.output });
      }
      return { output: firstOutput, passed: false, results, ran: true, isError: true };
    }

    // Compare raw stdout, never the "(no output)" sentinel.
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: shown });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
