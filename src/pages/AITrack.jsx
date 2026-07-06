import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";

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
  Beginner: { color: "#E8A33C", border: "#E8A33C33", bg: "#E8A33C10" },
  Intermediate: { color: "#E0B341", border: "#E0B34133", bg: "#E0B34110" },
  Advanced: { color: "#FF6B5C", border: "#FF6B5C33", bg: "#FF6B5C10" },
};

export default function AITrack() {
  const [nudge, setNudge] = useState(null);
  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(null), 3200);
    return () => clearTimeout(t);
  }, [nudge]);

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

  const aiProjects = projects.filter((p) => (p.track || "ai") === "ai");

  const beginnerProjects = aiProjects.filter((p) => p.difficulty === "beginner");
  const foundationsFinished = foundationsAreFinished(
    beginnerProjects,
    (p) => modulePct(p.id) === 100
  );

  const trackItems = aiProjects.map((p, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: p.title,
    difficulty: cap(p.difficulty),
    rawDifficulty: p.difficulty,
    time: p.estimated_time ? `${p.estimated_time} min` : "—",
    description: p.description,
    concepts: (p.tags || []).slice(0, 3),
    projectId: p.id,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: "#FFFFFF" }}>AI TRACK</div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 20px" }}
          >
            Learn to build<br />
            <span style={{ WebkitTextStroke: "1.5px #E8A33C", color: "transparent" }}>with AI.</span>
          </h1>
          <p className="font-display text-base max-w-prose" style={{ color: "#C9C1B2", fontWeight: 400 }}>
            Not just theory. A full progression from "what is a model" to building and deploying real AI-powered applications — with working code at every step.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 space-y-20">

        <div>
          <div className="font-sans text-xs tracking-widest uppercase mb-8" style={{ color: "#FFFFFF" }}>
            CURRICULUM — {trackItems.length} MODULES
          </div>

          <div
            className="grid gap-8 px-6 py-3 mb-px"
            style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #262219" }}
          >
            {["MOD", "PROJECT", "LEVEL", "TIME"].map(h => (
              <div key={h} className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>{h}</div>
            ))}
          </div>

          {trackItems.map((item) => {
            const dc = DIFF_COLOR[item.difficulty] || DIFF_COLOR.Beginner;
            const pct = modulePct(item.projectId);
            const done = pct === 100;
            const gated = isModuleGated({
              finished: foundationsFinished,
              done,
              difficulty: item.rawDifficulty,
            });
            const rowInner = (
                <div
                  className="grid gap-8 px-6 py-6 transition-all duration-200"
                  style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #1C1A14", opacity: gated ? 0.55 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#131009"; e.currentTarget.style.paddingLeft = "1.75rem"; if (gated) e.currentTarget.style.opacity = "0.8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; if (gated) e.currentTarget.style.opacity = "0.55"; }}
                >
                  <div className="flex items-center" style={{ minWidth: "3rem" }}>
                    {pct > 0 ? (
                      <ProgressRing percent={pct} size={38} color="#E8A33C" />
                    ) : (
                      <span className="font-sans font-bold" style={{ fontSize: "1.5rem", color: "#ECE7DC", letterSpacing: "-0.05em" }}>
                        {item.number}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-base transition-colors duration-150 group-hover:text-white" style={{ color: done ? "#E8A33C" : "#C2BAAA", letterSpacing: "-0.02em" }}>
                        {item.title}
                      </span>
                      {done && (
                        <span className="font-sans text-xs px-2 py-0.5" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
                          DONE
                        </span>
                      )}
                      {gated && (
                        <span className="font-sans text-xs tracking-widest uppercase px-2 py-0.5 whitespace-nowrap" style={{ color: "#E0B341", border: "1px solid #E0B34133", background: "#E0B34110" }}>
                          Finish Foundations first
                        </span>
                      )}
                    </div>
                    <p className="font-display text-sm mb-3" style={{ color: "#C9C1B2", fontWeight: 400 }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.concepts.map(c => (
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
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="font-sans text-sm text-right" style={{ color: "#C9C1B2" }}>
                    {item.time}
                  </div>
                </div>
            );

            return gated ? (
              <div
                key={item.projectId}
                role="button"
                tabIndex={0}
                aria-disabled="true"
                title="Finish the Foundations modules to unlock this"
                className="group block cursor-not-allowed"
                onClick={() => setNudge(item.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setNudge(item.title);
                  }
                }}
              >
                {rowInner}
              </div>
            ) : (
              <Link
                key={item.projectId}
                to={createPageUrl(`ProjectDetail?id=${item.projectId}`)}
                className="group block"
              >
                {rowInner}
              </Link>
            );
          })}
        </div>

        <div>
          <div className="font-sans text-xs tracking-widest uppercase mb-8" style={{ color: "#FFFFFF" }}>
            CAPSTONE PROJECTS — WHAT YOU WILL BUILD
          </div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "1px solid #262219" }}>
            {CAPSTONES.map((cap, i) => {
              const dc = DIFF_COLOR[cap.level];
              return (
                <div
                  key={cap.title}
                  className="p-8"
                  style={{ borderRight: i < 2 ? "1px solid #262219" : "none" }}
                >
                  <span
                    className="inline-block font-sans text-xs tracking-widest uppercase px-2.5 py-1 mb-5"
                    style={{ color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg }}
                  >
                    {cap.level}
                  </span>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{ color: "#ECE7DC", letterSpacing: "-0.03em" }}
                  >
                    {cap.title}
                  </h3>
                  <p className="font-display text-sm leading-relaxed mb-5" style={{ color: "#C9C1B2", fontWeight: 400 }}>
                    {cap.description}
                  </p>
                  <div className="space-y-1.5">
                    {cap.skills.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>→</span>
                        <span className="font-sans text-xs" style={{ color: "#C9C1B2" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center py-12" style={{ border: "1px solid #262219" }}>
          <div className="font-sans text-xs tracking-widest uppercase mb-5" style={{ color: "#FFFFFF" }}>READY?</div>
          <h2
            style={{ fontFamily: font.display, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", margin: "0 0 16px" }}
          >
            Start building with AI.
          </h2>
          <p className="font-display text-base mb-8" style={{ color: "#C9C1B2", fontWeight: 400 }}>
            The projects are in the Projects section. Filter by category "AI/ML".
          </p>
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-sans text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{ background: "#E8A33C", color: "#15130E", border: "1px solid #E8A33C", fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,163,60,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Browse Projects →
            </button>
          </Link>
        </div>
      </div>

      {nudge && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 font-sans text-xs tracking-widest uppercase px-5 py-3 shadow-lg"
          style={{ color: "#E0B341", border: "1px solid #E0B34155", background: "#1a1407" }}
          role="status"
        >
          Finish the Foundations modules to unlock “{nudge}”
        </div>
      )}
    </div>
  );
}