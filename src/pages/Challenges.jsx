import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";

const categoryLabels = {
  html_css: "HTML/CSS",
  javascript: "JS",
  react: "React",
  python: "Python",
  general: "General",
};

const DIFF_NUM = { easy: "01", medium: "02", hard: "03" };

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => base44.entities.Challenge.list("order"),
  });

  const filtered = challenges.filter((c) => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficulty === "all" || c.difficulty === difficulty;
    return matchSearch && matchDifficulty;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <div
        className="relative px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-6 mb-2">
            <span className="font-mono text-xs tracking-widest" style={{ color: "#666" }}>§ CHALLENGES</span>
          </div>
          <h1
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: "0 0 16px" }}
          >
            Sharpen the blade.
          </h1>
          <p className="font-display text-base" style={{ color: "#aaa", fontWeight: 400 }}>
            Focused problems. No setup. Pure coding.
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
          <div className="flex gap-2 flex-wrap">
            {["all", "easy", "medium", "hard"].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${difficulty === d ? "#b8ff00" : "#1e1e1e"}`,
                  color: difficulty === d ? "#b8ff00" : "#444",
                  background: difficulty === d ? "#b8ff0010" : "transparent",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        {!isLoading && filtered.length > 0 && (
          <div
            className="grid items-center gap-8 px-6 py-3 mb-px"
            style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #1a1a1a" }}
          >
            {["LVL", "CHALLENGE", "TOPIC", "XP"].map(h => (
              <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#666" }}>
                {h}
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 animate-pulse" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#666" }}>NO RESULTS</div>
            <p className="font-display text-base" style={{ color: "#888" }}>No challenges match your filter.</p>
          </div>
        ) : (
          <div>
            {filtered.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}>
                  <div
                    className="grid items-center gap-8 px-6 py-5 transition-all duration-200 group"
                    style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #111" }}
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
                      style={{ fontSize: "1.25rem", color: "#1e1e1e", letterSpacing: "-0.05em" }}
                    >
                      {DIFF_NUM[challenge.difficulty] || "01"}
                    </div>

                    {/* Title */}
                    <div>
                      <div
                        className="font-display font-bold text-base leading-snug mb-0.5 transition-colors duration-150 group-hover:text-white"
                        style={{ color: "#ccc", letterSpacing: "-0.02em" }}
                      >
                        {challenge.title}
                      </div>
                      {challenge.description && (
                        <div
                          className="font-display text-xs line-clamp-1"
                          style={{ color: "#888", fontWeight: 400 }}
                        >
                          {challenge.description}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <span
                        className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
                        style={{ color: "#888", border: "1px solid #2a2a2a" }}
                      >
                        {categoryLabels[challenge.category] || challenge.category}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      {challenge.xp_reward ? (
                        <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>
                          +{challenge.xp_reward}xp
                        </span>
                      ) : (
                        <span className="font-mono text-xs" style={{ color: "#555" }}>—</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}