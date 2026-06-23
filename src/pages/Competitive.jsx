import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { COMPETITIVE, COMPETITIVE_TOPICS, COMPETITIVE_DIFFICULTIES } from "@/content";

const DIFF_NUM = { easy: "01", medium: "02", hard: "03" };
const TOPIC_LABEL = Object.fromEntries(COMPETITIVE_TOPICS.map((t) => [t.key, t.label]));

export default function Competitive() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  // Only show topic tabs that actually have problems.
  const presentTopics = COMPETITIVE_TOPICS.filter((t) =>
    COMPETITIVE.some((p) => p.topic === t.key)
  );

  const filtered = COMPETITIVE.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.algorithm_focus?.toLowerCase().includes(search.toLowerCase());
    const matchTopic = topic === "all" || p.topic === topic;
    const matchDiff = difficulty === "all" || p.difficulty === difficulty;
    return matchSearch && matchTopic && matchDiff;
  });

  return (
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      {/* Header */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-6 mb-2">
            <span className="font-mono text-xs tracking-widest" style={{ color: "#BBB3A4" }}>§ COMPETITIVE</span>
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 16px" }}>
            Implement the algorithm.
          </h1>
          <p className="font-display text-base" style={{ color: "#C9C1B2", fontWeight: 400 }}>
            USACO/Codeforces-style problems in C++ — each one builds an algorithm behind modern AI.
          </p>
          <div
            className="mt-6 flex items-start gap-3 px-4 py-3 max-w-2xl"
            style={{ border: "1px solid #34302A", background: "#E8A33C08", borderRadius: "4px" }}
          >
            <span className="font-mono text-xs tracking-widest uppercase mt-px" style={{ color: "#E8A33C" }}>
              Optional · Advanced
            </span>
            <p className="font-display text-xs leading-relaxed" style={{ color: "#BBB3A4", fontWeight: 400 }}>
              Not part of the beginner flow. These are challenging C++ algorithm problems for learners
              already comfortable with programming — a deliberate switch from the Python AI track.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs pointer-events-none" style={{ color: "#BBB3A4" }}>/search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="filter problems..."
              className="w-full font-mono text-sm py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{ border: "1px solid #262219", color: "#ECE7DC", caretColor: "#E8A33C" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...COMPETITIVE_DIFFICULTIES].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
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
        </div>

        {/* Topic tabs */}
        <div className="flex gap-2 flex-wrap mb-12">
          {[{ key: "all", label: "All" }, ...presentTopics].map((t) => (
            <button
              key={t.key}
              onClick={() => setTopic(t.key)}
              className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
              style={{
                border: `1px solid ${topic === t.key ? "#E8A33C" : "#262219"}`,
                color: topic === t.key ? "#E8A33C" : "#C9C1B2",
                background: topic === t.key ? "#E8A33C10" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table header */}
        {filtered.length > 0 && (
          <div className="grid items-center gap-8 px-6 py-3 mb-px" style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #262219" }}>
            {["LVL", "PROBLEM", "TOPIC", "LANG"].map((h) => (
              <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#BBB3A4" }}>{h}</div>
            ))}
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#BBB3A4" }}>NO RESULTS</div>
            <p className="font-display text-base" style={{ color: "#C9C1B2" }}>No problems match your filter.</p>
          </div>
        ) : (
          <div>
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={createPageUrl(`CompetitiveDetail?id=${p.id}`)}>
                  <div
                    className="grid items-center gap-8 px-6 py-5 transition-all duration-200 group"
                    style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #1C1A14" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#131009"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                  >
                    <div className="font-mono font-bold" style={{ fontSize: "1.25rem", color: "#ECE7DC", letterSpacing: "-0.05em" }}>
                      {DIFF_NUM[p.difficulty] || "01"}
                    </div>
                    <div>
                      <div className="font-display font-bold text-base leading-snug mb-0.5 transition-colors duration-150 group-hover:text-white" style={{ color: "#C2BAAA", letterSpacing: "-0.02em" }}>
                        {p.title}
                      </div>
                      <div className="font-display text-xs line-clamp-1" style={{ color: "#C9C1B2", fontWeight: 400 }}>
                        {p.algorithm_focus}
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-xs tracking-widest uppercase px-2.5 py-1" style={{ color: "#C9C1B2", border: "1px solid #34302A" }}>
                        {TOPIC_LABEL[p.topic] || p.topic}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs" style={{ color: "#E8A33C" }}>C++</span>
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
