import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, Check, Compass, Dot } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/categories";
import { createPageUrl } from "../../utils";
import { estProjectXp } from "./rank";
import XpReward from "./XpReward";

const EASE = [0.16, 1, 0.3, 1];
const C = {
  panel: "#0C1210",
  panelHi: "#111917",
  border: "#17201C",
  green: "#5ED29C",
  teal: "#34D0C4",
  text: "#fff",
  t92: "rgba(255,255,255,.92)",
  t62: "rgba(255,255,255,.62)",
};

function nodeState(proj, lessons, completedIds) {
  const ls = lessons.filter((l) => l.project_id === proj.id);
  const total = ls.length || proj.lessons_count || 0;
  const done = ls.filter((l) => completedIds.has(l.id)).length;
  if (total > 0 && done >= total) return { key: "completed", done, total, pct: 100 };
  if (done > 0) return { key: "in_progress", done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  return { key: "available", done, total, pct: 0 };
}

export default function SkillMap({ projects = [], lessons = [], completedLessonIds = new Set() }) {
  const reduce = useReducedMotion();

  const byCategory = new Map();
  for (const p of projects) {
    const cat = p.category || "foundations";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(p);
  }
  const cats = CATEGORY_ORDER.filter((c) => byCategory.has(c));
  for (const c of byCategory.keys()) if (!cats.includes(c)) cats.push(c);

  let prevUnitTouched = true;
  const units = cats.map((cat) => {
    const list = byCategory
      .get(cat)
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const unlocked = prevUnitTouched;
    const states = list.map((p) => {
      const base = nodeState(p, lessons, completedLessonIds);
      return { proj: p, ...base, key: unlocked ? base.key : "locked" };
    });
    const touched = states.some((s) => s.key === "completed" || s.key === "in_progress");
    prevUnitTouched = touched;
    const doneCount = states.filter((s) => s.key === "completed").length;
    return { cat, label: CATEGORY_LABELS[cat] || cat, states, unlocked, doneCount, total: list.length };
  });

  return (
    <div className="flex flex-col gap-8">
      {units.map((u, ui) => (
        <div key={u.cat}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-1 rounded-full" style={{ background: u.unlocked ? C.green : C.border }} />
            <h3 className="u-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: u.unlocked ? C.text : C.t62, letterSpacing: "-0.01em", margin: 0 }}>
              {u.label}
            </h3>
            <span className="u-mono ml-auto" style={{ fontSize: "0.72rem", color: C.t62 }}>
              {u.doneCount}/{u.total}
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 16, marginLeft: 3 }}
          >
            {u.states.map((s, i) => (
              <Node key={s.proj.id} s={s} delay={reduce ? 0 : (ui * 0.02 + i * 0.03)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Node({ s, delay }) {
  const locked = s.key === "locked";
  const completed = s.key === "completed";
  const inProgress = s.key === "in_progress";
  const accent = completed ? C.green : inProgress ? C.teal : locked ? C.border : C.green;
  const title = s.proj.title || s.proj.name || "Project";

  const body = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      whileHover={locked ? {} : { y: -3 }}
      className="relative h-full rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: locked ? "transparent" : C.panel,
        border: `1px solid ${inProgress || completed ? accent + "55" : C.border}`,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="inline-flex items-center justify-center rounded-md shrink-0"
          style={{ width: 22, height: 22, background: completed ? C.green : locked ? "transparent" : `${accent}18`, border: locked ? `1px solid ${C.border}` : `1px solid ${accent}55` }}
        >
          {completed ? (
            <Check size={13} color="#070B0A" strokeWidth={3} />
          ) : locked ? (
            <Lock size={12} color={C.t62} />
          ) : inProgress ? (
            <Compass size={13} color={accent} />
          ) : (
            <Dot size={20} color={accent} />
          )}
        </span>
        <span className="u-display flex-1" style={{ fontSize: "0.9rem", fontWeight: 600, color: locked ? C.t62 : C.t92, lineHeight: 1.3 }}>
          {title}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        {locked ? (
          <span className="u-mono" style={{ fontSize: "0.68rem", color: C.t62 }}>Locked</span>
        ) : (
          <XpReward xp={estProjectXp(s.proj)} />
        )}
        {!locked && s.total > 0 && (
          <span className="u-mono" style={{ fontSize: "0.68rem", color: completed ? C.green : C.t62 }}>
            {completed ? "Done" : `${s.done}/${s.total}`}
          </span>
        )}
      </div>

      {!locked && inProgress && (
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "#050807" }}>
          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: accent }} />
        </div>
      )}
    </motion.div>
  );

  if (locked) return body;
  return (
    <Link to={`${createPageUrl("ProjectDetail")}?id=${s.proj.id}`} className="block h-full">
      {body}
    </Link>
  );
}
