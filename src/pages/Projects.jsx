import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/categories";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { Reveal, GlowCard } from "@/components/landing/primitives";
import "@/styles/landing.css";

const DIFFICULTY_LABEL = {
  beginner: "00",
  intermediate: "01",
  advanced: "02",
};

function Label({ children, color = "#7C8D85", className = "", style }) {
  return (
    <span
      className={`text-[11px] tracking-[0.18em] uppercase ${className}`}
      style={{ fontFamily: font.mono, color, ...style }}
    >
      {children}
    </span>
  );
}

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
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

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
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

  return (
    <div className="min-h-screen" style={{ background: "#050807" }}>
      <style>{`
        .cl-row { transition: transform .25s cubic-bezier(.16,1,.3,1), border-color .25s, box-shadow .25s; }
        .cl-row:hover { border-color: #26302B !important; box-shadow: 0 14px 44px -14px rgba(94,210,156,0.35); }
        @media (prefers-reduced-motion: reduce) { .cl-row { transition: none; } }
      `}</style>
      <div
        className="relative px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #17201C" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <Label color="#5ED29C">Projects</Label>
          </div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#ECF3EF", lineHeight: 1.12, margin: "0 0 16px" }}
          >
            Choose your module.
          </h1>
          <p className="text-base" style={{ fontFamily: font.body, color: "#B7C6BE", fontWeight: 400 }}>
            Each project is a chapter. New here? Start at the top and work down, each one builds on the last.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
              style={{ fontFamily: font.mono, color: "#7C8D85" }}
            >
              /search
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="filter projects..."
              className="w-full text-sm py-3 pl-16 pr-4 bg-transparent outline-none transition-colors duration-150"
              style={{
                fontFamily: font.body,
                border: "1px solid #17201C",
                borderRadius: "12px",
                background: "#0C1210",
                color: "#ECF3EF",
                caretColor: "#5ED29C",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#5ED29C")}
              onBlur={e => (e.currentTarget.style.borderColor = "#17201C")}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  fontFamily: font.mono,
                  borderRadius: "10px",
                  border: `1px solid ${category === cat.value ? "#5ED29C" : "#17201C"}`,
                  color: category === cat.value ? "#7FE0B0" : "#B7C6BE",
                  background: category === cat.value ? "rgba(94,210,156,0.10)" : "transparent",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="h-24 animate-pulse"
                style={{ background: "#0C1210", border: "1px solid #17201C", borderRadius: "16px" }}
              />
            ))}
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-3 mb-2"
              style={{ borderBottom: "1px solid #17201C" }}
            >
              {["LVL", "PROJECT", "LESSONS", "STATUS"].map(h => (
                <Label key={h}>{h}</Label>
              ))}
            </div>

            {sections.map((section) => (
              <Reveal as="div" key={section.id} className="mb-12 last:mb-0">
                <div
                  className="flex items-baseline gap-3 px-6 pt-8 pb-3 mb-3"
                  style={{ borderBottom: "1px solid #1F1C15" }}
                >
                  <Label color="#B7C6BE">{section.label}</Label>
                  <span className="text-xs" style={{ fontFamily: font.mono, color: "#7C8D85" }}>
                    {section.items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {section.items.map((project) => {
                    const status = getStatus(project);
                    const pct = getProgress(project);
                    const gated = isModuleGated({
                      finished: foundationsFinished,
                      done: status === "completed",
                      difficulty: project.difficulty,
                    });
                    const rowInner = (
                      <GlowCard
                        className="cl-row grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-6"
                        style={{ background: "#0C1210", border: "1px solid #17201C", borderRadius: "16px", opacity: gated ? 0.55 : 1 }}
                      >
                        <div
                          className="font-bold"
                          style={{
                            fontFamily: font.mono,
                            fontSize: "1.5rem",
                            color: "#7C8D85",
                            letterSpacing: "-0.05em",
                          }}
                        >
                          {DIFFICULTY_LABEL[project.difficulty] || "00"}
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <div
                              className="font-display font-bold text-lg leading-snug transition-colors duration-200 group-hover:text-white"
                              style={{ color: "#ECF3EF", letterSpacing: "-0.02em" }}
                            >
                              {project.title}
                            </div>
                            {gated && (
                              <Label
                                color="#7FE0B0"
                                className="px-2 py-0.5 whitespace-nowrap"
                                style={{ border: "1px solid rgba(94,210,156,0.25)", background: "rgba(94,210,156,0.08)", borderRadius: "8px" }}
                              >
                                Finish Foundations first
                              </Label>
                            )}
                          </div>
                          {project.description && (
                            <div
                              className="text-sm line-clamp-1"
                              style={{ fontFamily: font.body, color: "#B7C6BE", fontWeight: 400 }}
                            >
                              {project.description}
                            </div>
                          )}
                          {status === "in_progress" && (
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex gap-1">
                                {Array.from({ length: 10 }).map((_, di) => (
                                  <div
                                    key={di}
                                    className="w-1.5 h-1.5 rounded-sm transition-all duration-200"
                                    style={{
                                      background: di < Math.round(pct / 10) ? "#5ED29C" : "#17201C",
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs" style={{ fontFamily: font.mono, color: "#7FE0B0" }}>
                                {pct}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div
                          className="text-sm text-right"
                          style={{ fontFamily: font.mono, color: "#B7C6BE" }}
                        >
                          {project.lessons_count ? `${project.lessons_count}` : ", "}
                          {project.estimated_time ? (
                            <div className="text-xs" style={{ fontFamily: font.mono, color: "#7C8D85" }}>
                              {project.estimated_time}min
                            </div>
                          ) : null}
                        </div>

                        <div>
                          {gated && (
                            <Label color="#7FE0B0" className="px-3 py-1" style={{ border: "1px solid rgba(94,210,156,0.25)", background: "rgba(94,210,156,0.08)", borderRadius: "8px" }}>
                              LOCKED
                            </Label>
                          )}
                          {!gated && status === "completed" && (
                            <Label color="#5fbf7e" className="px-3 py-1" style={{ border: "1px solid rgba(95,191,126,0.3)", background: "rgba(95,191,126,0.08)", borderRadius: "8px" }}>
                              DONE
                            </Label>
                          )}
                          {!gated && status === "in_progress" && (
                            <Label color="#5ED29C" className="px-3 py-1" style={{ border: "1px solid rgba(94,210,156,0.3)", background: "rgba(94,210,156,0.08)", borderRadius: "8px" }}>
                              ACTIVE
                            </Label>
                          )}
                          {!gated && status === "not_started" && (
                            <Label color="#B7C6BE" className="px-3 py-1" style={{ border: "1px solid #17201C", borderRadius: "8px" }}>
                              START
                            </Label>
                          )}
                        </div>
                      </GlowCard>
                    );

                    return gated ? (
                      <div
                        key={project.id}
                        role="button"
                        tabIndex={0}
                        aria-disabled="true"
                        title="Finish the Foundations modules to unlock this"
                        className="group block cursor-not-allowed"
                        onClick={() => setNudge(project.title)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setNudge(project.title);
                          }
                        }}
                      >
                        {rowInner}
                      </div>
                    ) : (
                      <Link
                        key={project.id}
                        to={createPageUrl(`ProjectDetail?id=${project.id}`)}
                        className="group block"
                      >
                        {rowInner}
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <Label className="block mb-4">No results</Label>
                <p className="font-display text-base" style={{ color: "#B7C6BE" }}>
                  No projects match your filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {nudge && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-xs tracking-widest uppercase px-5 py-3 shadow-lg"
          style={{ fontFamily: font.mono, color: "#7FE0B0", border: "1px solid rgba(94,210,156,0.4)", background: "#0C1210", borderRadius: "12px" }}
          role="status"
        >
          Finish the Foundations modules to unlock "{nudge}"
        </div>
      )}
    </div>
  );
}
