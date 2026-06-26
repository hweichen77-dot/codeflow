const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const EXEC_TIMEOUT_MS = 5000;
const LOAD_TIMEOUT_MS = 45000;

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

  // Runtime is loaded — tell the main thread to stop the cold-load timer and
  // start the strict execution timer for the actual run below.
  self.postMessage({ id, ready: true });

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
let pending = null;
let ready = false;
let runChain = Promise.resolve();

function spawnWorker() {
  const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  URL.revokeObjectURL(url);
  w.onmessage = (e) => {
    const msg = e.data || {};
    if (!pending || msg.id !== pending.id) return;
    if (msg.ready) { pending.onReady?.(); return; }
    const p = pending;
    pending = null;
    p.resolve(msg);
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

export function runPython(code, stdin = "") {
  const run = runChain.then(() => execOnce(code, stdin));
  runChain = run.then(() => {}, () => {});
  return run;
}

function execOnce(code, stdin) {
  return new Promise((resolve) => {
    const w = getWorker();
    const id = nextId++;
    let settled = false;
    let execTimer = null;

    const kill = (output) => {
      if (settled) return;
      settled = true;
      clearTimeout(loadTimer);
      if (execTimer) clearTimeout(execTimer);
      pending = null;
      try { w.terminate(); } catch (_) {}
      worker = null;
      resolve({ output, isError: true, empty: false });
    };

    const loadTimer = setTimeout(
      () => kill("Error: The Python runtime took too long to load. Check your connection and try again."),
      LOAD_TIMEOUT_MS,
    );

    pending = {
      id,
      onReady: () => {
        clearTimeout(loadTimer);
        execTimer = setTimeout(
          () => kill(`Error: Execution timed out (${EXEC_TIMEOUT_MS / 1000}s limit)`),
          EXEC_TIMEOUT_MS,
        );
      },
      resolve: (msg) => {
        if (settled) return;
        settled = true;
        clearTimeout(loadTimer);
        if (execTimer) clearTimeout(execTimer);
        resolve(msg);
      },
    };

    w.postMessage({ id, code, stdin: String(stdin == null ? "" : stdin) });
  });
}

const norm = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+(?=\n)/g, "")
    .replace(/[ \t]+$/, "")
    .replace(/\n$/, "");

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
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: shown });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
