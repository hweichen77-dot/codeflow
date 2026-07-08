#!/usr/bin/env node

import { PROJECTS, LESSONS, CHALLENGES, COMPETITIVE } from "../src/content/index.js";

const checkLinks = process.argv.includes("--check-links");

const PLACEHOLDER_PATTERNS = [
  { re: /\bTODO\b/, sev: "high", note: "TODO marker" },
  { re: /\bFIXME\b/, sev: "high", note: "FIXME marker" },
  { re: /\bTBD\b/, sev: "high", note: "TBD marker" },
  { re: /lorem ipsum/i, sev: "high", note: "lorem ipsum filler" },
  { re: /coming soon/i, sev: "high", note: "'coming soon'" },
  { re: /your (?:text|answer) here/i, sev: "high", note: "fill-in stub" },
  { re: /\bwrite (?:your )?explanation here\b/i, sev: "high", note: "authoring stub" },
  { re: /\basdf\b|\bqwerty\b/i, sev: "low", note: "keyboard-mash filler" },
];

const LINK_RE = /\[([^\]]*)\]\(([^)]*)\)/g;
const BARE_URL_RE = /https?:\/\/[^\s)"'<>]+/g;

const STUB_FIELD_RE = /starter_(code|cpp)/i;

const findings = [];
const links = new Set();

function walk(value, path, ctx) {
  if (typeof value === "string") {
    if (!STUB_FIELD_RE.test(path)) for (const p of PLACEHOLDER_PATTERNS) {
      const m = value.match(p.re);
      if (m) {
        findings.push({ sev: p.sev, kind: ctx.kind, id: ctx.id, field: path, note: p.note, snippet: snippet(value, m.index) });
      }
    }
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(value))) {
      const href = (m[2] || "").trim();
      if (!href || href === "#" || href.startsWith("javascript:")) {
        findings.push({ sev: "high", kind: ctx.kind, id: ctx.id, field: path, note: `empty/placeholder link href "${href}"`, snippet: m[0].slice(0, 80) });
      } else if (/^https?:\/\//.test(href)) {
        links.add(href);
      }
    }
    BARE_URL_RE.lastIndex = 0;
    while ((m = BARE_URL_RE.exec(value))) links.add(m[0]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, ctx));
    return;
  }
  if (value && typeof value === "object") {
    for (const k of Object.keys(value)) walk(value[k], path ? `${path}.${k}` : k, ctx);
  }
}

function snippet(s, idx) {
  const start = Math.max(0, idx - 25);
  return s.slice(start, idx + 45).replace(/\s+/g, " ").trim();
}

const sets = [
  { kind: "project", rows: PROJECTS },
  { kind: "lesson", rows: LESSONS },
  { kind: "challenge", rows: CHALLENGES },
  { kind: "problem", rows: COMPETITIVE },
];

let scanned = 0;
for (const { kind, rows } of sets) {
  for (const row of rows) {
    scanned++;
    walk(row, "", { kind, id: row.id || row.challenge_title || "(no id)" });
  }
}

const deadLinks = [];
if (checkLinks && links.size) {
  console.log(`Checking ${links.size} external link(s)…`);
  await Promise.all([...links].map(async (url) => {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
      clearTimeout(t);
      if (res.status >= 400) deadLinks.push({ url, status: res.status });
    } catch (e) {
      deadLinks.push({ url, status: e.name === "AbortError" ? "timeout" : "unreachable" });
    }
  }));
}

const high = findings.filter((f) => f.sev === "high");
const low = findings.filter((f) => f.sev === "low");

console.log(`\nScanned ${scanned} items · ${links.size} external links found.\n`);

const printGroup = (title, list) => {
  if (!list.length) return;
  console.log(`${title} (${list.length}):`);
  for (const f of list) console.log(`  [${f.kind}] ${f.id} · ${f.field}\n      ${f.note} — "${f.snippet}"`);
  console.log("");
};

printGroup("HIGH — likely unfinished content", high);
printGroup("LOW — review", low);

if (deadLinks.length) {
  console.log(`DEAD/UNREACHABLE LINKS (${deadLinks.length}):`);
  for (const d of deadLinks) console.log(`  [${d.status}] ${d.url}`);
  console.log("");
}

if (!findings.length && !deadLinks.length) console.log("No placeholder text or broken links found. Content clean.\n");

const failed = high.length > 0 || deadLinks.length > 0;
process.exit(failed ? 1 : 0);
