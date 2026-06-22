import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";

// AP Computer Science hub — lists the two exam-aligned tracks built on the same
// lesson player as the AI track. CSP = Big Ideas (Python/pseudocode); CSA = Units
// (Java). Modules are grouped by their `unit` label.
const TRACKS = [
  { key: "apcsp", label: "AP CSP", title: "Computer Science Principles", lang: "Python · pseudocode",
    blurb: "The five Big Ideas of computing — creative development, data, algorithms & programming, systems & networks, and the impact of computing. Runnable Python plus exam-style practice." },
  { key: "apcsa", label: "AP CSA", title: "Computer Science A", lang: "Java",
    blurb: "Object-oriented Java across all ten units — from primitive types to recursion. Every concept comes with autograded Java drills and FRQ-style practice." },
];

const DIFF_COLOR = {
  beginner: { color: "#b8ff00", border: "#b8ff0033", bg: "#b8ff0010" },
  intermediate: { color: "#ffb300", border: "#ffb30033", bg: "#ffb30010" },
  advanced: { color: "#ff6b6b", border: "#ff6b6b33", bg: "#ff6b6b10" },
};

export default function APCS() {
  const [track, setTrack] = useState("apcsp");

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me().catch(() => null),
  });
  const { data: lessons = [] } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: () => api.entities.Lesson.list("order"),
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  const modulePct = (projectId) => {
    const ls = lessons.filter((l) => l.project_id === projectId);
    if (ls.length === 0) return 0;
    const done = ls.filter((l) => completedIds.has(l.id)).length;
    return Math.round((done / ls.length) * 100);
  };

  const active = TRACKS.find((t) => t.key === track);
  const trackProjects = projects.filter((p) => p.track === track);

  // Group modules by their `unit` label, preserving first-seen order.
  const units = [];
  const byUnit = new Map();
  for (const p of trackProjects) {
    const u = p.unit || "Modules";
    if (!byUnit.has(u)) { byUnit.set(u, []); units.push(u); }
    byUnit.get(u).push(p);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Hero */}
      <div className="relative px-8 lg:px-16 pt-28 pb-12" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#c4c4c4" }}>§ AP COMPUTER SCIENCE</div>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: "0 0 20px" }}>
            Pass the exam.<br />
            <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>Actually learn it.</span>
          </h1>
          <p className="font-display text-base max-w-prose" style={{ color: "#d4d4d4", fontWeight: 400 }}>
            Two College-Board-aligned tracks with real code execution at every step — CSP in Python, CSA in Java — plus exam-style multiple choice and free-response practice.
          </p>
        </div>
      </div>

      {/* Track tabs */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-10">
        <div className="flex gap-2 mb-2">
          {TRACKS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTrack(t.key)}
              className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
              style={{
                color: track === t.key ? "#0a0a0a" : "#d4d4d4",
                background: track === t.key ? "#b8ff00" : "transparent",
                border: `1px solid ${track === t.key ? "#b8ff00" : "#1e1e1e"}`,
                fontWeight: 700,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="font-display text-sm mt-4 mb-1" style={{ color: "#d4d4d4" }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "#b8ff00" }}>{active.lang}</span>
          &nbsp;·&nbsp; {active.blurb}
        </p>
      </div>

      {/* Curriculum grouped by unit */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 space-y-12">
        {trackProjects.length === 0 ? (
          <div className="font-mono text-sm py-20 text-center" style={{ color: "#666" }}>
            {active.label} curriculum is coming soon.
          </div>
        ) : (
          units.map((unit) => (
            <div key={unit}>
              <div className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: "#b8ff00" }}>
                {unit}
              </div>
              <div style={{ borderTop: "1px solid #1a1a1a" }}>
                {byUnit.get(unit).map((p, i) => {
                  const dc = DIFF_COLOR[p.difficulty] || DIFF_COLOR.beginner;
                  const pct = modulePct(p.id);
                  const done = pct === 100;
                  return (
                    <Link
                      key={p.id}
                      to={createPageUrl(`ProjectDetail?id=${p.id}`)}
                      className="group block"
                    >
                      <div
                        className="grid gap-8 px-6 py-6 transition-all duration-200"
                        style={{ gridTemplateColumns: "3rem 1fr auto", borderBottom: "1px solid #111" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                      >
                        <div className="flex items-center" style={{ minWidth: "3rem" }}>
                          {pct > 0 ? (
                            <ProgressRing percent={pct} size={38} color="#b8ff00" />
                          ) : (
                            <span className="font-mono font-bold" style={{ fontSize: "1.5rem", color: "#e8e8e8", letterSpacing: "-0.05em" }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-display font-bold text-base" style={{ color: done ? "#b8ff00" : "#ccc", letterSpacing: "-0.02em" }}>
                              {p.title}
                            </span>
                            {done && (
                              <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                                DONE
                              </span>
                            )}
                          </div>
                          <p className="font-display text-sm mb-3" style={{ color: "#d4d4d4", fontWeight: 400 }}>
                            {p.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(p.tags || []).slice(0, 4).map((c) => (
                              <span key={c} className="font-mono text-xs px-2 py-0.5" style={{ color: "#c4c4c4", border: "1px solid #2a2a2a" }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span
                            className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
                            style={{ color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg }}
                          >
                            {p.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
