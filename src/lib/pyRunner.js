/**
 * Real in-browser Python execution via Pyodide (lazy-loaded from CDN, cached).
 * Replaces the LLM-simulated "run" so challenges give real, deterministic output
 * and pass/fail — works offline once Pyodide has been fetched once.
 *
 * Execution runs inside a dedicated Web Worker. This is what lets us enforce a
 * hard wall-clock timeout: Pyodide runs synchronously once `runPythonAsync`
 * hands control to CPython, so a `while True:` on the main thread would freeze
 * the whole tab and a JS-side timeout could never fire. By isolating the
 * interpreter in a worker we can `terminate()` it on timeout and respawn a fresh
 * one for the next run — the tab stays responsive no matter what the user wrote.
 */
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const EXEC_TIMEOUT_MS = 5000;

// ---------------------------------------------------------------------------
// Worker source. Built as a Blob so we don't need a separate file in the bundle.
// Each message: { id, code, stdin }. Each reply: { id, output, isError, empty }.
// A fresh `globals` dict per run prevents state leaking across graded cases.
// ---------------------------------------------------------------------------
const WORKER_SRC = `
self.language = "python";
let pyReady = null;

function getPy() {
  if (!pyReady) {
    pyReady = (async () => {
      importScripts("${PYODIDE_BASE}pyodide.js");
      return await loadPyodide({ indexURL: "${PYODIDE_BASE}" });
    })();
  }
  return pyReady;
}

self.onmessage = async (e) => {
  const { id, code, stdin } = e.data || {};
  let py;
  try {
    py = await getPy();
  } catch (err) {
    self.postMessage({
      id,
      output: "Couldn't load the Python runtime. Check your connection and try again.",
      isError: true,
      unavailable: true,
      empty: false,
    });
    return;
  }

  let out = "";
  try {
    py.setStdout({ batched: (s) => { out += s + "\\n"; } });
    py.setStderr({ batched: (s) => { out += s + "\\n"; } });

    // Feed canned stdin so BOTH input() and sys.stdin work. Many problems read
    // via sys.stdin.read()/sys.stdin loops, not just input(), so we back stdin
    // with a fresh StringIO each run (also prevents leftover input leaking
    // between graded test cases) and route input() through it.
    const payload = JSON.stringify(String(stdin == null ? "" : stdin));
    await py.runPythonAsync(
      "import sys, io, builtins\\n" +
      "sys.stdin = io.StringIO(" + payload + ")\\n" +
      "def __cf_input(*_a):\\n" +
      "    line = sys.stdin.readline()\\n" +
      "    if line == \\"\\":\\n" +
      "        raise EOFError(\\"EOF when reading a line\\")\\n" +
      "    return line.rstrip(\\"\\\\n\\")\\n" +
      "builtins.input = __cf_input\\n"
    );

    // Fresh globals dict per submission → no leaked names across runs.
    const globals = py.toPy({});
    try {
      await py.runPythonAsync(code, { globals });
    } finally {
      try { globals.destroy(); } catch (_) {}
    }

    const raw = out.replace(/\\n+$/, "");
    self.postMessage({ id, output: raw, isError: false, empty: raw.length === 0 });
  } catch (err) {
    const msg = String((err && err.message) || err);
    const tail = msg.split("\\n").filter(Boolean).slice(-4).join("\\n");
    self.postMessage({
      id,
      output: (out ? out + "\\n" : "") + tail,
      isError: true,
      empty: false,
    });
  }
};
`;

let worker = null;
let nextId = 1;
let pending = null; // { id, resolve } for the in-flight run
let ready = false; // has a worker ever been spawned (for isPyReady)
let runChain = Promise.resolve(); // mutex: serialize runs so they can't interleave

function spawnWorker() {
  const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  w.onmessage = (e) => {
    const msg = e.data || {};
    if (pending && msg.id === pending.id) {
      const p = pending;
      pending = null;
      p.resolve(msg);
    }
  };
  return w;
}

function getWorker() {
  if (!worker) {
    worker = spawnWorker();
    ready = true;
  }
  return worker;
}

export function isPyReady() {
  return ready;
}

/**
 * Run Python source, capturing stdout. Optional `stdin` is fed to input().
 * Returns { output, isError, unavailable, empty }. `empty` flags genuinely
 * empty stdout so callers can distinguish it from a literal "(no output)".
 *
 * A hard 5s wall-clock limit is enforced: if user code (e.g. `while True:`)
 * never yields, the worker is terminated and respawned, and a clean timeout
 * result is returned instead of freezing the tab.
 */
export function runPython(code, stdin = "") {
  // Serialize behind the mutex: the single worker / shared interpreter can only
  // run one submission at a time, and concurrent grades must not interleave.
  const run = runChain.then(() => execOnce(code, stdin));
  // Keep the chain alive even if a run rejects (it shouldn't, but be safe).
  runChain = run.then(() => {}, () => {});
  return run;
}

function execOnce(code, stdin) {
  return new Promise((resolve) => {
    const w = getWorker();
    const id = nextId++;
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      pending = null;
      // Hard-kill the runaway interpreter and respawn for the next run.
      try { w.terminate(); } catch (_) {}
      worker = null;
      resolve({
        output: `Error: Execution timed out (${EXEC_TIMEOUT_MS / 1000}s limit)`,
        isError: true,
        empty: false,
      });
    }, EXEC_TIMEOUT_MS);

    pending = {
      id,
      resolve: (msg) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(msg);
      },
    };

    w.postMessage({ id, code, stdin: String(stdin == null ? "" : stdin) });
  });
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
 * Run code against test cases and grade deterministically.
 * Each case: { input?, expected_output }. Cases with no expected_output are skipped.
 * Returns { output, passed, results: [{ ok, expected, got }], ran }.
 */
export async function gradePython(code, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runPython(code);
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
    const r = await runPython(code, tc.input && tc.input !== "(no input)" ? tc.input : "");
    const shown = r.empty ? "(no output)" : r.output;
    if (i === 0) firstOutput = shown;
    // Compare raw stdout, never the "(no output)" sentinel.
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: shown });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
