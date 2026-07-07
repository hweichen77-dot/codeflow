import React, { useState, useMemo } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { CATEGORY_LABELS } from "@/content/categories";

const DIFF_NUM = { beginner: "01", easy: "01", intermediate: "02", medium: "02", advanced: "03", hard: "03" };
const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];

const SORTS = [
  { key: "difficulty", label: "Easiest first" },
  { key: "order", label: "Curriculum order" },
];

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
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <style>{`
        .challenge-row {
          grid-template-columns: 2.5rem 1fr auto;
        }
        @media (min-width: 640px) {
          .challenge-row {
            grid-template-columns: 2.5rem 1fr auto auto;
          }
        }
        .challenge-row-link:hover {
          background: #131009;
          padding-left: 1.75rem;
        }
        @media (min-width: 640px) {
          .challenge-row-link:hover {
            padding-left: 1.75rem;
          }
        }
      `}</style>
      <div
        className="relative px-4 sm:px-8 lg:px-16 pt-28 pb-16"
        style={{ borderBottom: "1px solid #262219" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-6 mb-2">
            <span className="font-sans text-xs tracking-widest" style={{ color: "#FFFFFF" }}>CHALLENGES</span>
          </div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 16px" }}
          >
            One problem at a time.
          </h1>
          <p className="font-display text-base" style={{ color: "#FFFFFF", fontWeight: 400 }}>
            Focused problems. No setup. Pure coding.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
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
              placeholder="filter challenges..."
              className="w-full font-sans text-sm py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{ border: "1px solid #262219", color: "#ECE7DC", caretColor: "#E8A33C" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${difficulty === d ? "#E8A33C" : "#262219"}`,
                  color: difficulty === d ? "#E8A33C" : "#BBB3A4",
                  background: difficulty === d ? "#E8A33C10" : "transparent",
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
                className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                style={{
                  border: `1px solid ${sort === s.key ? "#E8A33C" : "#262219"}`,
                  color: sort === s.key ? "#E8A33C" : "#BBB3A4",
                  background: sort === s.key ? "#E8A33C10" : "transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div
            className="grid items-center gap-4 sm:gap-8 px-4 sm:px-6 py-3 mb-px challenge-row"
            style={{ borderBottom: "1px solid #262219" }}
          >
            {["LVL", "CHALLENGE", "TOPIC", "XP"].map(h => (
              <div
                key={h}
                className={`font-sans text-xs tracking-widest uppercase${h === "TOPIC" ? " hidden sm:block" : ""}`}
                style={{ color: "#FFFFFF" }}
              >
                {h}
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 animate-pulse" style={{ background: "#131009", border: "1px solid #262219" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "#FFFFFF" }}>NO RESULTS</div>
            <p className="font-display text-base" style={{ color: "#FFFFFF" }}>No challenges match your filter.</p>
          </div>
        ) : (
          <div>
            {filtered.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 12) * 0.025, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}>
                  <div
                    className="challenge-row challenge-row-link grid items-center gap-4 sm:gap-8 px-4 sm:px-6 py-5 transition-all duration-200 group"
                    style={{ borderBottom: "1px solid #1C1A14" }}
                  >
                    <div
                      className="font-sans font-bold"
                      style={{ fontSize: "1.25rem", color: "#ECE7DC", letterSpacing: "-0.05em" }}
                    >
                      {DIFF_NUM[challenge.difficulty] || "01"}
                    </div>

                    <div>
                      {challenge.project_title && (
                        <div
                          className="font-sans text-xs tracking-wide mb-1"
                          style={{ color: "#FFFFFF" }}
                        >
                          {challenge.project_title}
                        </div>
                      )}
                      <div
                        className="font-display font-bold text-base leading-snug mb-0.5 transition-colors duration-150 group-hover:text-white"
                        style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
                      >
                        {challenge.title}
                      </div>
                      {challenge.description && (
                        <div
                          className="font-display text-xs line-clamp-1"
                          style={{ color: "#FFFFFF", fontWeight: 400 }}
                        >
                          {challenge.description}
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:block">
                      <span
                        className="font-sans text-xs tracking-widest uppercase px-2.5 py-1"
                        style={{ color: "#FFFFFF", border: "1px solid #34302A" }}
                      >
                        {CATEGORY_LABELS[challenge.topic] || challenge.topic || challenge.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>
                        +{challenge.xp || 15}xp
                      </span>
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