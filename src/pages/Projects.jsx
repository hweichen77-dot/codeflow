import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/categories";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { Stagger, StaggerItem } from "@/lib/motion";

const DIFFICULTY_LABEL = {
  beginner: "00",
  intermediate: "01",
  advanced: "02",
};

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
  const projects = allProjects.filter((p) => (p.track || "ai") === "ai");

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
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <div
        className="relative px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #262219" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-6 mb-2">
            <span className="font-sans text-xs tracking-widest" style={{ color: "#FFFFFF" }}>PROJECTS</span>
          </div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 16px" }}
          >
            Choose your module.
          </h1>
          <p className="font-display text-base" style={{ color: "#FFFFFF", fontWeight: 400 }}>
            Each project is a chapter. New here? Start at the top and work down, each one builds on the last.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-xs pointer-events-none"
              style={{ color: "#FFFFFF" }}
            >
              /search
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="filter projects..."
              className="w-full font-sans text-sm py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{
                border: "1px solid #262219",
                color: "#ECE7DC",
                caretColor: "#E8A33C",
              }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${category === cat.value ? "#E8A33C" : "#262219"}`,
                  color: category === cat.value ? "#E8A33C" : "#C9C1B2",
                  background: category === cat.value ? "#E8A33C10" : "transparent",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="h-24 animate-pulse"
                style={{ background: "#131009", border: "1px solid #262219" }}
              />
            ))}
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-3 mb-px"
              style={{ borderBottom: "1px solid #262219" }}
            >
              {["LVL", "PROJECT", "LESSONS", "STATUS"].map(h => (
                <div key={h} className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>
                  {h}
                </div>
              ))}
            </div>

            {sections.map((section) => (
              <div key={section.id} className="mb-12 last:mb-0">
                <div
                  className="flex items-baseline gap-3 px-6 pt-8 pb-3"
                  style={{ borderBottom: "1px solid #1F1C15" }}
                >
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>
                    {section.label}
                  </span>
                  <span className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
                    {section.items.length}
                  </span>
                </div>

                <Stagger as="div">
                  {section.items.map((project) => {
                    const status = getStatus(project);
                    const pct = getProgress(project);
                    const gated = isModuleGated({
                      finished: foundationsFinished,
                      done: status === "completed",
                      difficulty: project.difficulty,
                    });
                    const rowInner = (
                        <div
                          className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-6 transition-all duration-200"
                          style={{ borderBottom: "1px solid #262219", opacity: gated ? 0.55 : 1 }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "#131009";
                            e.currentTarget.style.paddingLeft = "1.75rem";
                            if (gated) e.currentTarget.style.opacity = "0.8";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "";
                            e.currentTarget.style.paddingLeft = "1.5rem";
                            if (gated) e.currentTarget.style.opacity = "0.55";
                          }}
                        >
                          <div
                            className="font-sans font-bold"
                            style={{
                              fontSize: "1.5rem",
                              color: "#ECE7DC",
                              letterSpacing: "-0.05em",
                            }}
                          >
                            {DIFFICULTY_LABEL[project.difficulty] || "00"}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <div
                                className="font-display font-bold text-lg leading-snug transition-colors duration-200 group-hover:text-white"
                                style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
                              >
                                {project.title}
                              </div>
                              {gated && (
                                <span
                                  className="font-sans text-xs tracking-widest uppercase px-2 py-0.5 whitespace-nowrap"
                                  style={{ color: "#E0B341", border: "1px solid #E0B34133", background: "#E0B34110" }}
                                >
                                  Finish Foundations first
                                </span>
                              )}
                            </div>
                            {project.description && (
                              <div
                                className="font-display text-sm line-clamp-1"
                                style={{ color: "#FFFFFF", fontWeight: 400 }}
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
                                      className="w-1.5 h-1.5 transition-all duration-200"
                                      style={{
                                        background: di < Math.round(pct / 10) ? "#E8A33C" : "#262219",
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>
                                  {pct}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className="font-sans text-sm text-right"
                            style={{ color: "#FFFFFF" }}
                          >
                            {project.lessons_count ? `${project.lessons_count}` : ", "}
                            {project.estimated_time ? (
                              <div className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
                                {project.estimated_time}min
                              </div>
                            ) : null}
                          </div>

                          <div>
                            {gated && (
                              <span
                                className="font-sans text-xs tracking-widest uppercase px-3 py-1"
                                style={{ color: "#E0B341", border: "1px solid #E0B34133", background: "#E0B34110" }}
                              >
                                LOCKED
                              </span>
                            )}
                            {!gated && status === "completed" && (
                              <span
                                className="font-sans text-xs tracking-widest uppercase px-3 py-1"
                                style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}
                              >
                                DONE
                              </span>
                            )}
                            {!gated && status === "in_progress" && (
                              <span
                                className="font-sans text-xs tracking-widest uppercase px-3 py-1"
                                style={{ color: "#FFFFFF", border: "1px solid #34302A", background: "#131009" }}
                              >
                                ACTIVE
                              </span>
                            )}
                            {!gated && status === "not_started" && (
                              <span
                                className="font-sans text-xs tracking-widest uppercase px-3 py-1"
                                style={{ color: "#FFFFFF", border: "1px solid #34302A" }}
                              >
                                START
                              </span>
                            )}
                          </div>
                        </div>
                    );

                    return (
                      <StaggerItem key={project.id} as="div">
                        {gated ? (
                          <div
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
                            to={createPageUrl(`ProjectDetail?id=${project.id}`)}
                            className="group block"
                          >
                            {rowInner}
                          </Link>
                        )}
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div
                  className="font-sans text-xs tracking-widest uppercase mb-4"
                  style={{ color: "#FFFFFF" }}
                  >
                   NO RESULTS
                </div>
                <p className="font-display text-base" style={{ color: "#FFFFFF" }}>
                  No projects match your filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {nudge && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 font-sans text-xs tracking-widest uppercase px-5 py-3 shadow-lg"
          style={{ color: "#E0B341", border: "1px solid #E0B34155", background: "#1a1407" }}
          role="status"
        >
          Finish the Foundations modules to unlock "{nudge}"
        </div>
      )}
    </div>
  );
}