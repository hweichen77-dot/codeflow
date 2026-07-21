import React, { useState } from "react";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import {
  CatalogPage, CatalogHero, Facet, CardGrid, CourseCard, TRACK_ACCENT,
} from "@/components/catalog/CatalogKit";

const ACCENT = TRACK_ACCENT.apcsp;

const TRACKS = [
  { key: "apcsp", label: "AP CSP", lang: "Python · pseudocode",
    blurb: "The five Big Ideas of computing: creative development, data, algorithms and programming, systems and networks, and the impact of computing. Runnable Python plus exam-style practice." },
  { key: "apcsa", label: "AP CSA", lang: "Java",
    blurb: "Object-oriented Java across all ten units, from primitive types to recursion. Every concept comes with autograded Java drills and FRQ-style practice." },
];

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

  return (
    <CatalogPage>
      <CatalogHero
        title="Pass the AP exam. And understand it."
        lead="CSP in Python, CSA in Java. Both follow the AP exam, and you write code the whole way, with practice on the multiple choice and FRQs."
        note="Compilearn is an independent project, not affiliated with or endorsed by the College Board. AP® and Advanced Placement® are registered trademarks of the College Board."
        accent={ACCENT}
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Facet
            label="Course"
            options={TRACKS.map((t) => ({ value: t.key, label: t.label }))}
            value={track}
            onChange={setTrack}
          />
        </div>
        <p className="t-body mb-10" style={{ fontSize: 14, lineHeight: 1.55, maxWidth: "70ch" }}>
          <span className="u-mono" style={{ color: ACCENT, fontSize: 12 }}>{active.lang}</span>
          &nbsp;·&nbsp; {active.blurb}
        </p>

        {trackProjects.length === 0 ? (
          <div className="text-center py-24 t-muted" style={{ fontSize: 15 }}>
            {active.label} curriculum is coming soon.
          </div>
        ) : (
          <CardGrid>
            {trackProjects.map((p, i) => {
              const pct = modulePct(p.id);
              const done = pct === 100;
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
                  meta={[p.unit || p.difficulty, active.label]}
                />
              );
            })}
          </CardGrid>
        )}
      </div>
    </CatalogPage>
  );
}
