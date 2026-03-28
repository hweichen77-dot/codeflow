import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const DIFFICULTY_MARK = { easy: "▲", medium: "▲▲", hard: "▲▲▲" };
const DIFFICULTY_COLOR = { easy: "#b8ff00", medium: "#ffb300", hard: "#ff5555" };

const CATEGORY_LABELS = {
  html_css: "HTML/CSS",
  javascript: "JavaScript",
  react: "React",
  python: "Python",
  general: "General",
};

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => base44.entities.Challenge.list("order"),
  });

  const filtered = challenges.filter((c) => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "all" || c.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Page header */}
      <div
        className="relative px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <span className="font-mono text-xs tracking-widest" style={{ color: "#2a2a2a" }}>§ CHALLENGES</span>
          <h1
            className="font-display font-black leading-none mb-4 mt-2"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.04em", color: "#e8e8e8" }}
          >
            Daily reps.
          </h1>
          <p className="font-display text-base" style={{ color: "#555", fontWeight: 400 }}>
            Short, focused coding exercises. Sharpen a specific skill in 15–30 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
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
              placeholder="filter challenges..."
              className="w-full font-mono text-sm py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{ border: "1px solid #1e1e1e", color: "#e8e8e8", caretColor: "#b8ff00" }}
            />
          </div>

          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${difficulty === d ? (DIFFICULTY_COLOR[d] || "#b8ff00") : "#1e1e1e"}`,
                  color: difficulty === d ? (DIFFICULTY_COLOR[d] || "#b8ff00") : "#444",
                  background: difficulty === d ? `${(DIFFICULTY_COLOR[d] || "#b8ff00")}10` : "transparent",
                }}
              >
                {d === "all" ? "all" : DIFFICULTY_MARK[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge list */}
        {isLoading ? (
          <div className="space-y-px">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 animate-pulse" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#2a2a2a" }}>
              NO RESULTS
            </div>
          </div>
        ) : (
          <div>
            {/* Headers */}
            <div
              className="hidden md:grid grid-cols-[2.5rem_1fr_auto_auto_auto] gap-8 px-6 py-3 mb-px"
              style={{ borderBottom: "1px solid #1a1a1a" }}
            >
              {["#", "CHALLENGE", "CATEGORY", "DIFF", "XP"].map(h => (
                <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#2a2a2a" }}>
                  {h}
                </div>
              ))}
            </div>

            {filtered.map((challenge, i) => (
              <Link
                key={challenge.id}
                to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}
                className="group block"
              >
                <div
                  className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_1fr_auto_auto_auto] gap-4 md:gap-8 px-6 py-5 transition-all duration-200"
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                >
                  <span className="font-mono text-xs" style={{ color: "#2a2a2a" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      className="font-display font-bold text-base leading-snug mb-1 transition-colors group-hover:text-white"
                      style={{ color: "#aaa", letterSpacing: "-0.02em" }}
                    >
                      {challenge.title}
                    </div>
                    {challenge.description && (
                      <div className="font-display text-xs line-clamp-1" style={{ color: "#444" }}>
                        {challenge.description}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block font-mono text-xs tracking-widest uppercase text-right" style={{ color: "#333" }}>
                    {CATEGORY_LABELS[challenge.category] || challenge.category}
                  </div>
                  <div className="hidden md:block text-right">
                    <span
                      className="font-mono text-xs"
                      style={{ color: DIFFICULTY_COLOR[challenge.difficulty] || "#888" }}
                    >
                      {DIFFICULTY_MARK[challenge.difficulty] || "—"}
                    </span>
                  </div>
                  <div className="hidden md:block text-right font-mono text-xs" style={{ color: "#333" }}>
                    {challenge.xp_reward ? `+${challenge.xp_reward}` : "—"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}