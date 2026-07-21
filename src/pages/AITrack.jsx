import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { Reveal } from "@/components/kit";
import {
  CatalogPage, CatalogHero, CardGrid, CourseCard, TRACK_ACCENT,
} from "@/components/catalog/CatalogKit";

const ACCENT = TRACK_ACCENT.ai;

const CAPSTONES = [
  {
    level: "Beginner",
    title: "Personal AI Writing Assistant",
    description: "A web page with tone controls (formal, shorter, funnier) that rewrites text using an LLM. First real deployed app.",
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

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "Beginner");

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

  const aiProjects = projects.filter((p) => (p.track || "ai") === "ai" && p.kind !== "product");
  const beginnerProjects = aiProjects.filter((p) => p.difficulty === "beginner");
  const foundationsFinished = foundationsAreFinished(beginnerProjects, (p) => modulePct(p.id) === 100);

  return (
    <CatalogPage>
      <CatalogHero
        title="Learn to build with AI."
        lead={'A full progression from "what is a model" to building and deploying AI-powered applications, with working code at every step.'}
        note="Assumes a basic understanding of Python (variables, loops, functions). New to Python? Start with AP CS Principles."
        accent={ACCENT}
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10 space-y-16">
        <section>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="u-display t-strong" style={{ fontSize: 20, margin: 0 }}>Curriculum</h2>
            <span className="u-mono t-muted" style={{ fontSize: 12 }}>{aiProjects.length} modules</span>
          </div>
          <CardGrid>
            {aiProjects.map((p, i) => {
              const pct = modulePct(p.id);
              const done = pct === 100;
              const gated = isModuleGated({ finished: foundationsFinished, done, difficulty: p.difficulty });
              return (
                <CourseCard
                  key={p.id}
                  to={createPageUrl(`ProjectDetail?id=${p.id}`)}
                  accent={ACCENT}
                  index={String(i + 1).padStart(2, "0")}
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  status={done ? "completed" : pct > 0 ? "in_progress" : "not_started"}
                  progressPct={pct}
                  gated={gated}
                  onClick={() => setNudge(p.title)}
                  meta={[cap(p.difficulty), p.estimated_time ? `${p.estimated_time}min` : null]}
                />
              );
            })}
          </CardGrid>
        </section>

        <section>
          <h2 className="u-display t-strong mb-6" style={{ fontSize: 20, margin: "0 0 24px" }}>What you'll build</h2>
          <CardGrid>
            {CAPSTONES.map((c) => (
              <Reveal key={c.title}>
                <div
                  className="h-full flex flex-col"
                  style={{ background: "var(--bg-raised)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: 22 }}
                >
                  <span className="u-mono t-muted" style={{ fontSize: 12, marginBottom: 10 }}>{c.level}</span>
                  <h3 className="u-display t-strong" style={{ fontSize: 18, margin: "0 0 8px" }}>{c.title}</h3>
                  <p className="t-muted" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{c.description}</p>
                  <div className="mt-auto space-y-1.5">
                    {c.skills.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span style={{ color: ACCENT }} className="u-mono text-xs">→</span>
                        <span className="u-mono t-muted" style={{ fontSize: 12 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </CardGrid>
        </section>

        <Reveal>
          <div
            className="text-center py-12 px-6"
            style={{ background: "var(--bg-raised)", border: "1px solid var(--border-subtle)", borderRadius: 16 }}
          >
            <h2 className="u-display t-strong" style={{ fontSize: 26, margin: "0 0 12px" }}>Start building with AI.</h2>
            <p className="t-muted" style={{ fontSize: 15, marginBottom: 24 }}>
              The projects are in the Projects section. Filter by category "AI/ML".
            </p>
            <Link
              to={createPageUrl("Projects")}
              className="u-mono inline-flex items-center gap-2 px-6 h-11 text-xs"
              style={{ color: "var(--bg-base)", background: ACCENT, borderRadius: 10, fontWeight: 700, letterSpacing: "0.04em" }}
            >
              Browse Projects →
            </Link>
          </div>
        </Reveal>
      </div>

      {nudge && (
        <div
          className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[60] u-mono px-5 py-3"
          style={{ fontSize: 12, color: "var(--accent)", border: "1px solid var(--accent)", background: "var(--bg-surface)", borderRadius: 12 }}
          role="status"
        >
          Finish the Foundations modules to unlock "{nudge}"
        </div>
      )}
    </CatalogPage>
  );
}
