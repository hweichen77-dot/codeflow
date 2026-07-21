import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/categories";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { Reveal } from "@/components/kit";
import {
  CatalogPage, CatalogHero, FilterToolbar, SearchInput, Facet, TagChips,
  CardGrid, CourseCard, EmptyState, CardSkeleton, TRACK_ACCENT,
} from "@/components/catalog/CatalogKit";

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [tag, setTag] = useState(null);
  const [user, setUser] = useState(null);
  const [nudge, setNudge] = useState(null);

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(null), 3200);
    return () => clearTimeout(t);
  }, [nudge]);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const projects = allProjects.filter((p) => p.kind === "product");

  const { data: progress = [] } = useQuery({
    queryKey: ["progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email, completed: true }),
    enabled: !!user,
  });

  const getStatus = (project) => {
    const pp = progress.filter((p) => p.project_id === project.id);
    if (pp.length === 0) return "not_started";
    if (project.lessons_count && pp.length >= project.lessons_count) return "completed";
    return "in_progress";
  };
  const getProgress = (project) => {
    const pp = progress.filter((p) => p.project_id === project.id);
    return project.lessons_count ? Math.round((pp.length / project.lessons_count) * 100) : 0;
  };

  const presentCats = CATEGORY_ORDER.filter((c) => projects.some((p) => p.category === c));
  const CATEGORIES = [
    { value: "all", label: "All" },
    ...presentCats.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ];

  const allTags = useMemo(() => {
    const counts = new Map();
    projects.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [projects]);

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    const matchLevel = level === "all" || p.difficulty === level;
    const matchTag = !tag || (p.tags || []).includes(tag);
    return matchSearch && matchCat && matchLevel && matchTag;
  });

  const beginnerProjects = projects.filter((p) => p.difficulty === "beginner");
  const foundationsFinished = foundationsAreFinished(
    beginnerProjects,
    (p) => getStatus(p) === "completed"
  );

  const grouped = CATEGORY_ORDER.map((c) => ({
    id: c,
    label: CATEGORY_LABELS[c],
    items: filtered.filter((p) => p.category === c),
  }));
  const uncategorized = filtered.filter((p) => !CATEGORY_ORDER.includes(p.category));
  const sections = [
    ...grouped,
    ...(uncategorized.length ? [{ id: "_other", label: "More", items: uncategorized }] : []),
  ].filter((s) => s.items.length > 0);

  const renderCard = (project, i) => {
    const status = getStatus(project);
    const pct = getProgress(project);
    const gated = isModuleGated({
      finished: foundationsFinished,
      done: status === "completed",
      difficulty: project.difficulty,
    });
    return (
      <CourseCard
        key={project.id}
        to={createPageUrl(`ProjectDetail?id=${project.id}`)}
        accent={TRACK_ACCENT.projects}
        index={String(i + 1).padStart(2, "0")}
        title={project.title}
        description={project.description}
        tags={project.tags}
        status={status}
        progressPct={pct}
        gated={gated}
        onClick={() => setNudge(project.title)}
        meta={[
          project.lessons_count ? `${project.lessons_count} lessons` : null,
          project.difficulty,
          project.estimated_time ? `${project.estimated_time}min` : null,
        ]}
      />
    );
  };

  return (
    <CatalogPage>
      <CatalogHero
        title="Choose your module."
        lead="Each project is a chapter. New here? Start at the top and work down, each one builds on the last."
        accent={TRACK_ACCENT.projects}
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10">
        <FilterToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Filter projects…" />
          <Facet label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
          <Facet label="Level" options={LEVELS} value={level} onChange={setLevel} />
        </FilterToolbar>
        {allTags.length > 0 && (
          <div className="mb-8">
            <TagChips tags={allTags} active={tag} onToggle={setTag} />
          </div>
        )}

        {isLoading ? (
          <CardSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState>No projects match your filters.</EmptyState>
        ) : (
          sections.map((section) => (
            <Reveal key={section.id} className="mb-12 last:mb-0">
              <div className="flex items-baseline gap-3 mb-5">
                <h2 className="u-display t-strong" style={{ fontSize: 15, margin: 0 }}>{section.label}</h2>
                <span className="u-mono t-muted" style={{ fontSize: 12 }}>{section.items.length}</span>
              </div>
              <CardGrid>
                {section.items.map((project, i) => renderCard(project, i))}
              </CardGrid>
            </Reveal>
          ))
        )}
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
