/**
 * Java execution for the AP Computer Science A track. Mirrors cppRunner.js.
 *
 * Two transports, same normalized result:
 *  1. If Supabase is configured, route through the `run-java` Edge Function
 *     (server-side proxy → reliable stdin-driven execution via a real judge,
 *     central rate-limiting). This is the PRIMARY path for CSA.
 *  2. Otherwise call the Compiler Explorer (godbolt.org) OpenJDK execute API
 *     DIRECTLY from the browser (no backend). Godbolt returns
 *     `Access-Control-Allow-Origin: *`, so the static site can grade Java with
 *     no server — with the constraint that the public class must be `Main`.
 *
 * Reference solutions are additionally compiled+run with real javac/java in CI
 * (scripts/verify-solutions.mjs), so content correctness never depends on the
 * browser transport.
 */
import { supabase, auth } from "../api/supabaseClient";

// OpenJDK on Compiler Explorer. Configurable; Java executor runs the `Main` class.
const COMPILER = "java2100";
const GODBOLT_URL = `https://godbolt.org/api/compiler/${COMPILER}/compile`;

// Godbolt returns stdout/stderr as arrays of { text } lines.
function joinLines(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.map((l) => (l && typeof l === "object" ? l.text ?? "" : String(l))).join("\n");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Distinct sentinel thrown when the judge service is overloaded/unreachable
// after retries. The grader treats this as "could not grade — retry", NOT as a
// wrong answer, so a flaky upstream never produces a false FAIL verdict.
class InfraError extends Error {
  constructor(message) {
    super(message);
    this.name = "InfraError";
    this.infra = true;
  }
}

// Call Compiler Explorer (OpenJDK) directly and return the same shape the Edge
// Function does. Retries 429/503 with exponential backoff honoring Retry-After;
// a persistent overload surfaces as an InfraError.
async function runViaGodbolt(source, stdin) {
  const MAX_ATTEMPTS = 4;
  let lastStatus = 0;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const resp = await fetch(GODBOLT_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        source,
        lang: "java",
        allowStoreCodeDebug: true,
        options: {
          userArguments: "",
          executeParameters: { args: [], stdin: String(stdin || "") },
          filters: { execute: true },
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
  throw new InfraError(`java judge overloaded (${lastStatus})`);
}

// Turn the raw { compile_output, compile_code, stdout, stderr, code, timed_out }
// into { output, isError, compileError, timedOut, runtimeError, empty }.
function normalize(data) {
  if (data?.error) return { output: `Runner error: ${data.error}`, isError: true, empty: false };

  const compileOut = String(data?.compile_output || "").trim();
  if ((data?.compile_code ?? 0) !== 0 && compileOut) {
    return { output: compileOut, isError: true, compileError: true, empty: false };
  }

  if (data?.timed_out) {
    return { output: "Time Limit Exceeded", isError: true, timedOut: true, empty: false };
  }

  const stdout = String(data?.stdout || "");
  const stderr = String(data?.stderr || "").trim();
  const exitCode = data?.code ?? 0;
  const ran = exitCode === 0;

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
 * Compile + run Java source with optional stdin. Source should declare
 * `public class Main` with a `main` method.
 * Returns { output, isError, compileError, timedOut, runtimeError, empty }.
 */
export async function runJava(source, stdin = "") {
  try {
    let data;
    if (auth.isConfigured) {
      const { data: d, error } = await supabase.functions.invoke("run-java", {
        body: { source, stdin: String(stdin || "") },
      });
      if (error) throw error;
      data = d;
    } else {
      data = await runViaGodbolt(source, stdin);
    }
    return normalize(data);
  } catch (e) {
    if (auth.isConfigured) {
      try {
        return normalize(await runViaGodbolt(source, stdin));
      } catch (e2) {
        if (e2 && e2.infra) {
          return { output: "Java judge is busy. Please try again in a moment.", isError: true, infra: true, empty: false };
        }
        /* fall through */
      }
    }
    if (e && e.infra) {
      return { output: "Java judge is busy. Please try again in a moment.", isError: true, infra: true, empty: false };
    }
    return { output: "Couldn't reach the Java runner. Check your connection and try again.", isError: true, empty: false };
  }
}

// Same normalization as the other runners (preserve leading whitespace).
const norm = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+(?=\n)/g, "")
    .replace(/[ \t]+$/, "")
    .replace(/\n$/, "");

/**
 * Grade Java against test cases. Same return shape as gradePython/gradeCpp:
 * { output, passed, results: [{ ok, expected, got }], ran, isError }.
 */
export async function gradeJava(source, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runJava(source);
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
    const r = await runJava(source, tc.input && tc.input !== "(no input)" ? tc.input : "");
    const shown = r.empty ? "(no output)" : r.output;
    if (i === 0) firstOutput = shown;

    if (r.infra) {
      return { output: r.output, passed: false, results, ran: false, isError: true, infra: true };
    }

    if (r.compileError) {
      for (let j = i; j < cases.length; j++) {
        results.push({ ok: false, expected: cases[j].expected_output, got: r.output });
      }
      return { output: firstOutput, passed: false, results, ran: true, isError: true };
    }

    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: shown });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
