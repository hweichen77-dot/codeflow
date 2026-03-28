import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "html_css", label: "HTML/CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "python", label: "Python" },
];

const DIFFICULTY_LABEL = {
  beginner: "00",
  intermediate: "01",
  advanced: "02",
};

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("order"),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["progress", user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email, completed: true }),
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

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Page header */}
      <div
        className="relative px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        {/* Horizontal accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-6 mb-2">
            <span className="font-mono text-xs tracking-widest" style={{ color: "#2a2a2a" }}>§ PROJECTS</span>
          </div>
          <h1
            className="font-display font-black leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.04em", color: "#e8e8e8" }}
          >
            Choose your module.
          </h1>
          <p className="font-display text-base" style={{ color: "#555", fontWeight: 400 }}>
            Each project is a chapter. Work through them in order, or jump to what interests you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1 min-w-48 max-w-xs">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs pointer-events-none"
              style={{ color: "#444" }}
            >
              /search
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="filter projects..."
              className="w-full font-mono text-sm py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{
                border: "1px solid #1e1e1e",
                color: "#e8e8e8",
                caretColor: "#b8ff00",
              }}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${category === cat.value ? "#b8ff00" : "#1e1e1e"}`,
                  color: category === cat.value ? "#b8ff00" : "#444",
                  background: category === cat.value ? "#b8ff0010" : "transparent",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project list */}
        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="h-24 animate-pulse"
                style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
              />
            ))}
          </div>
        ) : (
          <div>
            {/* Column headers */}
            <div
              className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-3 mb-px"
              style={{ borderBottom: "1px solid #1a1a1a" }}
            >
              {["LVL", "PROJECT", "LESSONS", "STATUS"].map(h => (
                <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#2a2a2a" }}>
                  {h}
                </div>
              ))}
            </div>

            <div>
              {filtered.map((project, i) => {
                const status = getStatus(project);
                const pct = getProgress(project);

                return (
                  <Link
                    key={project.id}
                    to={createPageUrl(`ProjectDetail?id=${project.id}`)}
                    className="group block"
                  >
                    <div
                      className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-8 px-6 py-6 transition-all duration-200"
                      style={{ borderBottom: "1px solid #1a1a1a" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#0d0d0d";
                        e.currentTarget.style.paddingLeft = "1.75rem";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.paddingLeft = "1.5rem";
                      }}
                    >
                      {/* Level */}
                      <div
                        className="font-mono font-bold"
                        style={{
                          fontSize: "1.5rem",
                          color: "#1e1e1e",
                          letterSpacing: "-0.05em",
                        }}
                      >
                        {DIFFICULTY_LABEL[project.difficulty] || "00"}
                      </div>

                      {/* Title + meta */}
                      <div>
                        <div
                          className="font-display font-bold text-lg leading-snug mb-1 transition-colors duration-200 group-hover:text-white"
                          style={{ color: "#cccccc", letterSpacing: "-0.02em" }}
                        >
                          {project.title}
                        </div>
                        {project.description && (
                          <div
                            className="font-display text-sm line-clamp-1"
                            style={{ color: "#444", fontWeight: 400 }}
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
                                    background: di < Math.round(pct / 10) ? "#b8ff00" : "#1e1e1e",
                                  }}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>
                              {pct}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Lessons count */}
                      <div
                        className="font-mono text-sm text-right"
                        style={{ color: "#333" }}
                      >
                        {project.lessons_count ? `${project.lessons_count}` : "—"}
                        {project.estimated_time ? (
                          <div className="font-mono text-xs" style={{ color: "#2a2a2a" }}>
                            {project.estimated_time}min
                          </div>
                        ) : null}
                      </div>

                      {/* Status */}
                      <div>
                        {status === "completed" && (
                          <span
                            className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                            style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                          >
                            DONE
                          </span>
                        )}
                        {status === "in_progress" && (
                          <span
                            className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                            style={{ color: "#888", border: "1px solid #2a2a2a", background: "#0d0d0d" }}
                          >
                            ACTIVE
                          </span>
                        )}
                        {status === "not_started" && (
                          <span
                            className="font-mono text-xs tracking-widest uppercase px-3 py-1"
                            style={{ color: "#333", border: "1px solid #1e1e1e" }}
                          >
                            START
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div
                  className="font-mono text-xs tracking-widest uppercase mb-4"
                  style={{ color: "#2a2a2a" }}
                >
                  NO RESULTS
                </div>
                <p className="font-display text-base" style={{ color: "#444" }}>
                  No projects match your filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}