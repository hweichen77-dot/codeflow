/**
 * Real sandboxed JavaScript execution using a hidden iframe.
 * This replaces the LLM-simulated execution approach.
 */

export function runCodeInSandbox(code, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox = "allow-scripts";
    document.body.appendChild(iframe);

    const logs = [];
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        resolve({ output: "Error: Execution timed out (5s limit)", isError: true });
      }
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };

    const onMessage = (event) => {
      if (event.source !== iframe.contentWindow) return;
      const { type, data } = event.data || {};
      if (type === "log") {
        logs.push(data);
      } else if (type === "error") {
        if (!settled) {
          settled = true;
          cleanup();
          resolve({ output: `Error: ${data}`, isError: true });
        }
      } else if (type === "done") {
        if (!settled) {
          settled = true;
          cleanup();
          resolve({ output: logs.join("\n") || "(no output)", isError: false });
        }
      }
    };

    window.addEventListener("message", onMessage);

    const src = `
      <script>
        const _parent = window.parent;
        const _log = (...args) => _parent.postMessage({ type: 'log', data: args.map(a => {
          if (typeof a === 'object') { try { return JSON.stringify(a); } catch(e) { return String(a); } }
          return String(a);
        }).join(' ') }, '*');
        const _err = (msg) => _parent.postMessage({ type: 'error', data: msg }, '*');
        const _done = () => _parent.postMessage({ type: 'done' }, '*');
        console.log = _log;
        console.error = (...args) => _log('[error]', ...args);
        console.warn = (...args) => _log('[warn]', ...args);
        window.onerror = (msg, src, line, col, err) => { _err((err && err.message) || msg); return true; };
        try {
          ${code}
          _done();
        } catch(e) {
          _err(e.message || String(e));
        }
      <\/script>
    `;

    iframe.srcdoc = src;
  });
}