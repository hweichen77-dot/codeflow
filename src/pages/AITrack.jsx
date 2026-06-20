import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";

const CAPSTONES = [
  {
    level: "Beginner",
    title: "Personal AI Writing Assistant",
    description: "A web page with tone controls — formal, shorter, funnier — that rewrites text using an LLM. First real deployed app.",
    skills: ["Frontend", "API security", "Prompt chaining"],
  },
  {
    level: "Intermediate",
    title: "AI Flashcard Generator",
    description: "Paste any text, get spaced-repetition flashcards. Uses embeddings to group related concepts.",
    skills: ["Embeddings", "Prompt engineering", "Structured output"],
  },
  {
    level: "Advanced",
    title: "AI Code Reviewer",
    description: "Paste code, get structured feedback on bugs, style, security, and performance. Handles multiple languages.",
    skills: ["Structured output", "Multi-language", "Evaluation"],
  },
];

const DIFF_COLOR = {
  Beginner: { color: "#b8ff00", border: "#b8ff0033", bg: "#b8ff0010" },
  Intermediate: { color: "#ffb300", border: "#ffb30033", bg: "#ffb30010" },
  Advanced: { color: "#ff6b6b", border: "#ff6b6b33", bg: "#ff6b6b10" },
};

export default function AITrack() {
  // Per-module progress: completed lessons / total lessons for that project.
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

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "Beginner");
  // Build the curriculum straight from content so every module is listed.
  const trackItems = projects.map((p, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: p.title,
    difficulty: cap(p.difficulty),
    time: p.estimated_time ? `${p.estimated_time} min` : "—",
    description: p.description,
    concepts: (p.tags || []).slice(0, 3),
    projectId: p.id,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Hero */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#c4c4c4" }}>§ AI TRACK</div>
          <h1
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: "0 0 20px" }}
          >
            Learn to build<br />
            <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>with AI.</span>
          </h1>
          <p className="font-display text-base max-w-prose" style={{ color: "#d4d4d4", fontWeight: 400 }}>
            Not just theory. A full progression from "what is a model" to building and deploying real AI-powered applications — with working code at every step.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 space-y-20">

        {/* Curriculum */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#c4c4c4" }}>
            CURRICULUM — {trackItems.length} MODULES
          </div>

          {/* Table header */}
          <div
            className="grid gap-8 px-6 py-3 mb-px"
            style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #1a1a1a" }}
          >
            {["MOD", "PROJECT", "LEVEL", "TIME"].map(h => (
              <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#c4c4c4" }}>{h}</div>
            ))}
          </div>

          {trackItems.map((item) => {
            const dc = DIFF_COLOR[item.difficulty] || DIFF_COLOR.Beginner;
            const pct = modulePct(item.projectId);
            const done = pct === 100;
            return (
              <Link
                key={item.projectId}
                to={createPageUrl(`ProjectDetail?id=${item.projectId}`)}
                className="group block"
              >
                <div
                  className="grid gap-8 px-6 py-6 transition-all duration-200"
                  style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #111" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                >
                  <div className="flex items-center" style={{ minWidth: "3rem" }}>
                    {pct > 0 ? (
                      <ProgressRing percent={pct} size={38} color="#b8ff00" />
                    ) : (
                      <span className="font-mono font-bold" style={{ fontSize: "1.5rem", color: "#e8e8e8", letterSpacing: "-0.05em" }}>
                        {item.number}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-base transition-colors duration-150 group-hover:text-white" style={{ color: done ? "#b8ff00" : "#ccc", letterSpacing: "-0.02em" }}>
                        {item.title}
                      </span>
                      {done && (
                        <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                          DONE
                        </span>
                      )}
                    </div>
                    <p className="font-display text-sm mb-3" style={{ color: "#d4d4d4", fontWeight: 400 }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.concepts.map(c => (
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
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-right" style={{ color: "#d4d4d4" }}>
                    {item.time}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Capstone projects */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#c4c4c4" }}>
            CAPSTONE PROJECTS — WHAT YOU WILL BUILD
          </div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "1px solid #1a1a1a" }}>
            {CAPSTONES.map((cap, i) => {
              const dc = DIFF_COLOR[cap.level];
              return (
                <div
                  key={cap.title}
                  className="p-8"
                  style={{ borderRight: i < 2 ? "1px solid #1a1a1a" : "none" }}
                >
                  <span
                    className="inline-block font-mono text-xs tracking-widest uppercase px-2.5 py-1 mb-5"
                    style={{ color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg }}
                  >
                    {cap.level}
                  </span>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{ color: "#e8e8e8", letterSpacing: "-0.03em" }}
                  >
                    {cap.title}
                  </h3>
                  <p className="font-display text-sm leading-relaxed mb-5" style={{ color: "#d4d4d4", fontWeight: 400 }}>
                    {cap.description}
                  </p>
                  <div className="space-y-1.5">
                    {cap.skills.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>→</span>
                        <span className="font-mono text-xs" style={{ color: "#d4d4d4" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12" style={{ border: "1px solid #1a1a1a" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: "#c4c4c4" }}>READY?</div>
          <h2
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", margin: "0 0 16px" }}
          >
            Start building with AI.
          </h2>
          <p className="font-display text-base mb-8" style={{ color: "#d4d4d4", fontWeight: 400 }}>
            The projects are in the Projects section. Filter by category "AI/ML".
          </p>
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{ background: "#b8ff00", color: "#0a0a0a", border: "1px solid #b8ff00", fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(184,255,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Browse Projects →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}