import React, { useState, useMemo } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CATEGORY_LABELS } from "@/content/categories";
import { Reveal, GlowCard } from "@/components/landing/primitives";
import "@/styles/landing.css";

const DIFF_NUM = { beginner: "01", easy: "01", intermediate: "02", medium: "02", advanced: "03", hard: "03" };
const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];

const SORTS = [
  { key: "difficulty", label: "Easiest first" },
  { key: "order", label: "Curriculum order" },
];

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

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("difficulty");

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges", sort],
    queryFn: () => api.entities.Challenge.list(sort),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return challenges.filter((c) => {
      const matchSearch = !search || c.title?.toLowerCase().includes(q);
      const matchDifficulty = difficulty === "all" || c.difficulty === difficulty;
      return matchSearch && matchDifficulty;
    });
  }, [challenges, search, difficulty]);

  return (
    <div className="min-h-screen" style={{ background: "#050807" }}>
      <style>{`
        .challenge-row {
          grid-template-columns: 2.5rem 1fr auto;
        }
        @media (min-width: 640px) {
          .challenge-row {
            grid-template-columns: 2.5rem 1fr auto auto;
          }
        }
        .cl-row { transition: transform .25s cubic-bezier(.16,1,.3,1), border-color .25s, box-shadow .25s; }
        .cl-row:hover { border-color: #26302B !important; box-shadow: 0 14px 44px -14px rgba(94,210,156,0.35); }
        @media (prefers-reduced-motion: reduce) { .cl-row { transition: none; } }
      `}</style>
      <div
        className="relative px-4 sm:px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #17201C" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <Label color="#5ED29C">Challenges</Label>
          </div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#ECF3EF", lineHeight: 1.12, margin: "0 0 16px" }}
          >
            One problem at a time.
          </h1>
          <p className="text-base" style={{ fontFamily: font.body, color: "#B7C6BE", fontWeight: 400 }}>
            Focused problems. No setup. Pure coding.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
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
              placeholder="filter challenges..."
              className="w-full text-sm py-3 pl-16 pr-4 bg-transparent outline-none transition-colors duration-150"
              style={{ fontFamily: font.body, border: "1px solid #17201C", borderRadius: "12px", background: "#0C1210", color: "#ECF3EF", caretColor: "#5ED29C" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#5ED29C")}
              onBlur={e => (e.currentTarget.style.borderColor = "#17201C")}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  fontFamily: font.mono,
                  borderRadius: "10px",
                  border: `1px solid ${difficulty === d ? "#5ED29C" : "#17201C"}`,
                  color: difficulty === d ? "#7FE0B0" : "#B7C6BE",
                  background: difficulty === d ? "rgba(94,210,156,0.10)" : "transparent",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap sm:ml-auto">
            {SORTS.map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className="text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  fontFamily: font.mono,
                  borderRadius: "10px",
                  border: `1px solid ${sort === s.key ? "#5ED29C" : "#17201C"}`,
                  color: sort === s.key ? "#7FE0B0" : "#B7C6BE",
                  background: sort === s.key ? "rgba(94,210,156,0.10)" : "transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div
            className="grid items-center gap-4 sm:gap-8 px-4 sm:px-6 py-3 mb-2 challenge-row"
            style={{ borderBottom: "1px solid #17201C" }}
          >
            {["LVL", "CHALLENGE", "TOPIC", "XP"].map(h => (
              <Label key={h} className={h === "TOPIC" ? "hidden sm:block" : ""}>
                {h}
              </Label>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 animate-pulse" style={{ background: "#0C1210", border: "1px solid #17201C", borderRadius: "16px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Label className="block mb-4">No results</Label>
            <p className="font-display text-base" style={{ color: "#B7C6BE" }}>No challenges match your filter.</p>
          </div>
        ) : (
          <Reveal as="div" className="space-y-2">
            {filtered.map((challenge) => (
              <Link key={challenge.id} to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)} className="group block">
                <GlowCard
                  className="challenge-row cl-row grid items-center gap-4 sm:gap-8 px-4 sm:px-6 py-5"
                  style={{ background: "#0C1210", border: "1px solid #17201C", borderRadius: "16px" }}
                >
                  <div
                    className="font-bold"
                    style={{ fontFamily: font.mono, fontSize: "1.25rem", color: "#7C8D85", letterSpacing: "-0.05em" }}
                  >
                    {DIFF_NUM[challenge.difficulty] || "01"}
                  </div>

                  <div>
                    {challenge.project_title && (
                      <div
                        className="text-xs tracking-wide mb-1"
                        style={{ fontFamily: font.mono, color: "#7C8D85" }}
                      >
                        {challenge.project_title}
                      </div>
                    )}
                    <div
                      className="font-display font-bold text-base leading-snug mb-0.5 transition-colors duration-150 group-hover:text-white"
                      style={{ color: "#ECF3EF", letterSpacing: "-0.02em" }}
                    >
                      {challenge.title}
                    </div>
                    {challenge.description && (
                      <div
                        className="text-xs line-clamp-1"
                        style={{ fontFamily: font.body, color: "#B7C6BE", fontWeight: 400 }}
                      >
                        {challenge.description}
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <Label color="#B7C6BE" className="px-2.5 py-1" style={{ border: "1px solid #17201C", borderRadius: "8px" }}>
                      {CATEGORY_LABELS[challenge.topic] || challenge.topic || challenge.category}
                    </Label>
                  </div>

                  <div className="text-right">
                    <span className="text-xs" style={{ fontFamily: font.mono, color: "#7FE0B0" }}>
                      +{challenge.xp || 15}xp
                    </span>
                  </div>
                </GlowCard>
              </Link>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
}
