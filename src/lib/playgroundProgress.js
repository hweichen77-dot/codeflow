import { namespacedKey, touchStreak } from "./progressStats";
import { recordActivity } from "./retention";

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

export function markLabSolved(id) {
  if (typeof window === "undefined" || !id) return false;
  const solved = getSolvedLabs();
  if (solved.includes(id)) return false;
  solved.push(id);
  try { localStorage.setItem(KEY(), JSON.stringify(solved)); } catch {  }
  try { touchStreak(); } catch {  }
  try { recordActivity("lab"); } catch {  }
  try { window.dispatchEvent(new CustomEvent(PLAYGROUND_CHANGED_EVENT, { detail: { id } })); } catch {  }
  return true;
}
