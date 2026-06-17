/**
 * Real in-browser Python execution via Pyodide (lazy-loaded from CDN, cached).
 * Replaces the LLM-simulated "run" so challenges give real, deterministic output
 * and pass/fail — works offline once Pyodide has been fetched once.
 */
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.dataset.pyodide = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("network"));
    document.head.appendChild(s);
  });
}

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScriptOnce(`${PYODIDE_BASE}pyodide.js`);
      // eslint-disable-next-line no-undef
      const py = await loadPyodide({ indexURL: PYODIDE_BASE });
      return py;
    })();
  }
  return pyodidePromise;
}

export function isPyReady() {
  return Boolean(pyodidePromise);
}

/**
 * Run Python source, capturing stdout. Optional `stdin` is fed to input().
 * Returns { output, isError, unavailable }.
 */
export async function runPython(code, stdin = "") {
  let py;
  try {
    py = await getPyodide();
  } catch {
    return {
      output: "Couldn't load the Python runtime. Check your connection and try again.",
      isError: true,
      unavailable: true,
    };
  }

  let out = "";
  try {
    py.setStdout({ batched: (s) => { out += s + "\n"; } });
    py.setStderr({ batched: (s) => { out += s + "\n"; } });

    // Feed canned stdin lines to input() if provided.
    if (stdin) {
      const lines = JSON.stringify(String(stdin).split("\n"));
      await py.runPythonAsync(
        `import builtins\n__cf_in = iter(${lines})\nbuiltins.input = lambda *a: next(__cf_in, "")`
      );
    }

    await py.runPythonAsync(code);
    return { output: out.replace(/\n+$/, "") || "(no output)", isError: false };
  } catch (e) {
    // Surface a clean Python traceback tail.
    const msg = String(e?.message || e);
    const tail = msg.split("\n").filter(Boolean).slice(-4).join("\n");
    return { output: (out ? out + "\n" : "") + tail, isError: true };
  }
}

const norm = (s) => String(s ?? "").replace(/\r/g, "").trim().replace(/[ \t]+\n/g, "\n");

/**
 * Run code against test cases and grade deterministically.
 * Each case: { input?, expected_output }. Cases with no expected_output are skipped.
 * Returns { output, passed, results: [{ ok, expected, got }], ran }.
 */
export async function gradePython(code, testCases = []) {
  const cases = (testCases || []).filter((t) => t && t.expected_output != null);

  if (cases.length === 0) {
    const r = await runPython(code);
    return { output: r.output, passed: !r.isError, results: [], ran: true, isError: r.isError };
  }

  const results = [];
  let firstOutput = "";
  for (let i = 0; i < cases.length; i++) {
    const tc = cases[i];
    const r = await runPython(code, tc.input && tc.input !== "(no input)" ? tc.input : "");
    if (i === 0) firstOutput = r.output;
    const ok = !r.isError && norm(r.output) === norm(tc.expected_output);
    results.push({ ok, expected: tc.expected_output, got: r.output });
  }
  const passed = results.every((r) => r.ok);
  return { output: firstOutput, passed, results, ran: true };
}
