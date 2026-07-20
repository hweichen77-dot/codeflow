import React, { useState, useEffect } from "react";
import "@/styles/landing.css";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { Stagger, StaggerItem } from "@/lib/motion";
import { PrimaryButton } from "@/components/ui/kit";
import { Reveal, GlowCard } from "@/components/landing/primitives";

const eyebrow = { color: "#7FE0B0", fontFamily: font.mono, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 };

const CAPSTONES = [
  {
    level: "Beginner",
    title: "Personal AI Writing Assistant",
    description: "A web page with tone controls, formal, shorter, funnier, that rewrites text using an LLM. First real deployed app.",
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
  Beginner: { color: "#5ED29C", border: "#5ED29C33", bg: "#5ED29C10" },
  Intermediate: { color: "#7FE0B0", border: "#7FE0B033", bg: "#7FE0B010" },
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

  const aiProjects = projects.filter((p) => (p.track || "ai") === "ai" && p.kind !== "product");

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
    time: p.estimated_time ? `${p.estimated_time} min` : ", ",
    description: p.description,
    concepts: (p.tags || []).slice(0, 3),
    projectId: p.id,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#050807" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #17201C" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div style={{ ...eyebrow, marginBottom: 14 }}>AI TRACK</div>
            <h1
              style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ECF3EF", lineHeight: 1.08, margin: "0 0 20px" }}
            >
              Learn to build<br />
              <span className="cl-grad">with AI.</span>
            </h1>
            <p style={{ fontFamily: font.body, color: "#B7C6BE", fontSize: 18, maxWidth: 560, lineHeight: 1.55 }}>
              A full progression from "what is a model" to building and deploying AI-powered applications, with working code at every step.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-2" style={{ border: "1px solid #17201C", background: "#0C1210", borderRadius: 10 }}>
              <span style={{ ...eyebrow, fontSize: 11 }}>Prerequisite</span>
              <span style={{ fontFamily: font.body, fontSize: 13, color: "#ECF3EF" }}>
                Assumes a basic understanding of Python (variables, loops, functions). New to Python? Start with AP CS Principles.
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 space-y-20">

        <div>
          <Reveal><div style={{ ...eyebrow, marginBottom: 28 }}>CURRICULUM, {trackItems.length} MODULES</div></Reveal>

          <div
            className="grid gap-8 px-6 py-3 mb-px"
            style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #17201C" }}
          >
            {["MOD", "PROJECT", "LEVEL", "TIME"].map(h => (
              <div key={h} style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7C8D85" }}>{h}</div>
            ))}
          </div>

          <Stagger as="div">
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
                  style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #0C1210", opacity: gated ? 0.55 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0C1210"; e.currentTarget.style.paddingLeft = "1.75rem"; if (gated) e.currentTarget.style.opacity = "0.8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; if (gated) e.currentTarget.style.opacity = "0.55"; }}
                >
                  <div className="flex items-center" style={{ minWidth: "3rem" }}>
                    {pct > 0 ? (
                      <ProgressRing percent={pct} size={38} color="#5ED29C" />
                    ) : (
                      <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "1.5rem", color: "#7C8D85", letterSpacing: "-0.05em" }}>
                        {item.number}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-base transition-colors duration-150 group-hover:text-white" style={{ color: done ? "#5ED29C" : "#ECF3EF", letterSpacing: "-0.02em" }}>
                        {item.title}
                      </span>
                      {done && (
                        <span style={{ fontFamily: font.mono, fontSize: 11, color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10", padding: "1px 8px", borderRadius: 6 }}>
                          DONE
                        </span>
                      )}
                      {gated && (
                        <span style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7FE0B0", border: "1px solid #7FE0B033", background: "#7FE0B010", padding: "1px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>
                          Finish Foundations first
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: font.body, fontSize: 14, color: "#B7C6BE", marginBottom: 12, lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.concepts.map(c => (
                        <span key={c} style={{ fontFamily: font.mono, fontSize: 11, color: "#B7C6BE", border: "1px solid #17201C", borderRadius: 6, padding: "1px 8px" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg, borderRadius: 6, padding: "3px 10px" }}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="text-right" style={{ fontFamily: font.mono, fontSize: 13, color: "#7C8D85" }}>
                    {item.time}
                  </div>
                </div>
            );

            return gated ? (
              <StaggerItem key={item.projectId} as="div">
              <div
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
              </StaggerItem>
            ) : (
              <StaggerItem key={item.projectId} as="div">
              <Link
                to={createPageUrl(`ProjectDetail?id=${item.projectId}`)}
                className="group block"
              >
                {rowInner}
              </Link>
              </StaggerItem>
            );
          })}
          </Stagger>
        </div>

        <div>
          <Reveal><div style={{ ...eyebrow, marginBottom: 28 }}>CAPSTONE PROJECTS, WHAT YOU WILL BUILD</div></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5" as="div">
            {CAPSTONES.map((cap) => {
              const dc = DIFF_COLOR[cap.level];
              return (
                <StaggerItem key={cap.title} as="div">
                <GlowCard style={{ height: "100%", background: "#0C1210", border: "1px solid #17201C", borderRadius: 16, padding: 28 }}>
                  <span
                    style={{ display: "inline-block", fontFamily: font.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg, borderRadius: 6, padding: "3px 10px", marginBottom: 20 }}
                  >
                    {cap.level}
                  </span>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{ color: "#ECF3EF", letterSpacing: "-0.02em" }}
                  >
                    {cap.title}
                  </h3>
                  <p style={{ fontFamily: font.body, fontSize: 14, lineHeight: 1.55, color: "#B7C6BE", marginBottom: 20 }}>
                    {cap.description}
                  </p>
                  <div className="space-y-1.5">
                    {cap.skills.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span style={{ color: "#5ED29C", fontFamily: font.mono, fontSize: 12 }}>&rarr;</span>
                        <span style={{ fontFamily: font.mono, fontSize: 12, color: "#B7C6BE" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        <Reveal>
        <div className="text-center py-12 px-6" style={{ background: "#0C1210", border: "1px solid #17201C", borderRadius: 16 }}>
          <div style={{ ...eyebrow, marginBottom: 18 }}>READY?</div>
          <h2
            style={{ fontFamily: font.display, fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "#ECF3EF", margin: "0 0 16px" }}
          >
            Start building with AI.
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 16, color: "#B7C6BE", marginBottom: 32 }}>
            The projects are in the Projects section. Filter by category "AI/ML".
          </p>
          <div className="flex justify-center">
            <PrimaryButton to={createPageUrl("Projects")}>Browse Projects</PrimaryButton>
          </div>
        </div>
        </Reveal>
      </div>

      {nudge && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 shadow-lg"
          style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7FE0B0", border: "1px solid #7FE0B055", background: "#0C1210", borderRadius: 10 }}
          role="status"
        >
          Finish the Foundations modules to unlock "{nudge}"
        </div>
      )}
    </div>
  );
}
