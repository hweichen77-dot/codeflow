import React, { useState } from "react";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";

const TRACKS = [
  { key: "apcsp", label: "AP CSP", title: "Computer Science Principles", lang: "Python · pseudocode",
    blurb: "The five Big Ideas of computing — creative development, data, algorithms & programming, systems & networks, and the impact of computing. Runnable Python plus exam-style practice." },
  { key: "apcsa", label: "AP CSA", title: "Computer Science A", lang: "Java",
    blurb: "Object-oriented Java across all ten units — from primitive types to recursion. Every concept comes with autograded Java drills and FRQ-style practice." },
];

const DIFF_COLOR = {
  beginner: { color: "#E8A33C", border: "#E8A33C33", bg: "#E8A33C10" },
  intermediate: { color: "#E0B341", border: "#E0B34133", bg: "#E0B34110" },
  advanced: { color: "#FF6B5C", border: "#FF6B5C33", bg: "#FF6B5C10" },
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

  const units = [];
  const byUnit = new Map();
  for (const p of trackProjects) {
    const u = p.unit || "Modules";
    if (!byUnit.has(u)) { byUnit.set(u, []); units.push(u); }
    byUnit.get(u).push(p);
  }

  return (
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-12" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: "#FFFFFF" }}>AP COMPUTER SCIENCE</div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 20px" }}>
            Pass the AP exam.<br />
            <span style={{ WebkitTextStroke: "1.5px #E8A33C", color: "transparent" }}>Not just cram it.</span>
          </h1>
          <p className="font-display text-base max-w-prose" style={{ color: "#C9C1B2", fontWeight: 400 }}>
            CSP in Python, CSA in Java. Both follow the real AP exam, and you write actual code the whole way. Plus practice with the multiple choice and FRQs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-10">
        <div className="flex gap-2 mb-2">
          {TRACKS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTrack(t.key)}
              className="font-sans text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
              style={{
                color: track === t.key ? "#15130E" : "#C9C1B2",
                background: track === t.key ? "#E8A33C" : "transparent",
                border: `1px solid ${track === t.key ? "#E8A33C" : "#262219"}`,
                fontWeight: 700,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="font-display text-sm mt-4 mb-1" style={{ color: "#C9C1B2" }}>
          <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "#E8A33C" }}>{active.lang}</span>
          &nbsp;·&nbsp; {active.blurb}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 space-y-12">
        {trackProjects.length === 0 ? (
          <div className="font-sans text-sm py-20 text-center" style={{ color: "#6E665A" }}>
            {active.label} curriculum is coming soon.
          </div>
        ) : (
          units.map((unit) => (
            <div key={unit}>
              <div className="font-sans text-xs tracking-widest uppercase mb-5" style={{ color: "#E8A33C" }}>
                {unit}
              </div>
              <div style={{ borderTop: "1px solid #262219" }}>
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
                        style={{ gridTemplateColumns: "3rem 1fr auto", borderBottom: "1px solid #1C1A14" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#131009"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                      >
                        <div className="flex items-center" style={{ minWidth: "3rem" }}>
                          {pct > 0 ? (
                            <ProgressRing percent={pct} size={38} color="#E8A33C" />
                          ) : (
                            <span className="font-sans font-bold" style={{ fontSize: "1.5rem", color: "#ECE7DC", letterSpacing: "-0.05em" }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-display font-bold text-base" style={{ color: done ? "#E8A33C" : "#C2BAAA", letterSpacing: "-0.02em" }}>
                              {p.title}
                            </span>
                            {done && (
                              <span className="font-sans text-xs px-2 py-0.5" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
                                DONE
                              </span>
                            )}
                          </div>
                          <p className="font-display text-sm mb-3" style={{ color: "#C9C1B2", fontWeight: 400 }}>
                            {p.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(p.tags || []).slice(0, 4).map((c) => (
                              <span key={c} className="font-sans text-xs px-2 py-0.5" style={{ color: "#BBB3A4", border: "1px solid #34302A" }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span
                            className="font-sans text-xs tracking-widest uppercase px-2.5 py-1"
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
