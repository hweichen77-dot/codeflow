import { namespacedKey } from "./progressStats";

// Tracks which playground labs the learner has solved (held all attacks).
// Per-user namespaced localStorage, mirrors the lesson/challenge progress model.

const KEY = () => namespacedKey("codeflow_playground_solved");
export const PLAYGROUND_CHANGED_EVENT = "codeflow:playground-changed";

export function getSolvedLabs() {
  if (typeof window === "undefined") return [];
  try {
    const arr = JSON.parse(localStorage.getItem(KEY()) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function isLabSolved(id) {
  return getSolvedLabs().includes(id);
}

// Returns true if this is a NEW solve (was not already solved), so callers can
// celebrate only the first time.
export function markLabSolved(id) {
  if (typeof window === "undefined" || !id) return false;
  const solved = getSolvedLabs();
  if (solved.includes(id)) return false;
  solved.push(id);
  try { localStorage.setItem(KEY(), JSON.stringify(solved)); } catch { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent(PLAYGROUND_CHANGED_EVENT, { detail: { id } })); } catch { /* ignore */ }
  return true;
}
