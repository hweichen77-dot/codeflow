import React, { useState } from "react";
import "@/styles/landing.css";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Stagger, StaggerItem } from "@/lib/motion";
import { Reveal } from "@/components/landing/primitives";
import { COMPETITIVE, COMPETITIVE_TOPICS, COMPETITIVE_DIFFICULTIES } from "@/content";

const eyebrow = { color: "#7FE0B0", fontFamily: font.mono, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 };

const DIFF_NUM = { easy: "01", medium: "02", hard: "03" };
const TOPIC_LABEL = Object.fromEntries(COMPETITIVE_TOPICS.map((t) => [t.key, t.label]));

export default function Competitive() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

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

  const chipStyle = (activeSel) => ({
    fontFamily: font.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
    padding: "8px 16px", borderRadius: 8,
    border: `1px solid ${activeSel ? "#5ED29C" : "#17201C"}`,
    color: activeSel ? "#5ED29C" : "#B7C6BE",
    background: activeSel ? "#5ED29C10" : "transparent",
  });

  return (
    <div className="min-h-screen" style={{ background: "#050807" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #17201C" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div style={{ ...eyebrow, marginBottom: 12 }}>COMPETITIVE</div>
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ECF3EF", lineHeight: 1.08, margin: "0 0 16px" }}>
              Write the <span className="cl-grad">algorithm</span> yourself.
            </h1>
            <p style={{ fontFamily: font.body, color: "#B7C6BE", fontSize: 18, maxWidth: 620, lineHeight: 1.55 }}>
              Hard C++ problems, like the ones on USACO and Codeforces. A lot of them are the algorithms that make AI work.
            </p>
            <div
              className="mt-6 flex items-start gap-3 px-4 py-3 max-w-2xl"
              style={{ border: "1px solid #17201C", background: "#0C1210", borderRadius: 12 }}
            >
              <span style={{ ...eyebrow, color: "#5ED29C", fontSize: 11, marginTop: 1, whiteSpace: "nowrap" }}>
                Optional · Advanced
              </span>
              <p style={{ fontFamily: font.body, fontSize: 13, lineHeight: 1.55, color: "#B7C6BE" }}>
                Not for beginners. These are hard C++ problems for people who can already code. It's a big
                jump from the Python AI track.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontFamily: font.mono, fontSize: 12, color: "#7C8D85" }}>/search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="filter problems..."
              className="w-full py-3 pl-16 pr-4 bg-transparent outline-none"
              style={{ fontFamily: font.mono, fontSize: 14, border: "1px solid #17201C", borderRadius: 10, color: "#ECF3EF", caretColor: "#5ED29C" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...COMPETITIVE_DIFFICULTIES].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className="transition-all duration-150"
                style={chipStyle(difficulty === d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-12">
          {[{ key: "all", label: "All" }, ...presentTopics].map((t) => (
            <button
              key={t.key}
              onClick={() => setTopic(t.key)}
              className="transition-all duration-150"
              style={chipStyle(topic === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="grid items-center gap-8 px-6 py-3 mb-px" style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #17201C" }}>
            {["LVL", "PROBLEM", "TOPIC", "LANG"].map((h) => (
              <div key={h} style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7C8D85" }}>{h}</div>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7C8D85", marginBottom: 16 }}>NO RESULTS</div>
            <p style={{ fontFamily: font.body, fontSize: 16, color: "#B7C6BE" }}>No problems match your filter.</p>
          </div>
        ) : (
          <Stagger as="div">
            {filtered.map((p) => (
              <StaggerItem key={p.id} as="div">
                <Link to={createPageUrl(`CompetitiveDetail?id=${p.id}`)}>
                  <div
                    className="grid items-center gap-8 px-6 py-5 transition-all duration-200 group"
                    style={{ gridTemplateColumns: "2.5rem 1fr auto auto", borderBottom: "1px solid #0C1210" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#0C1210"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                  >
                    <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "1.25rem", color: "#7C8D85", letterSpacing: "-0.05em" }}>
                      {DIFF_NUM[p.difficulty] || "01"}
                    </div>
                    <div>
                      <div className="font-display font-bold text-base leading-snug mb-0.5 group-hover:text-white transition-colors duration-150" style={{ color: "#ECF3EF", letterSpacing: "-0.02em" }}>
                        {p.title}
                      </div>
                      <div className="line-clamp-1" style={{ fontFamily: font.body, fontSize: 13, color: "#B7C6BE" }}>
                        {p.algorithm_focus}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B7C6BE", border: "1px solid #17201C", borderRadius: 6, padding: "3px 10px" }}>
                        {TOPIC_LABEL[p.topic] || p.topic}
                      </span>
                    </div>
                    <div className="text-right">
                      <span style={{ fontFamily: font.mono, fontSize: 13, color: "#5ED29C" }}>C++</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
