import React, { useState } from "react";
import { createPageUrl } from "../utils";
import { Reveal } from "@/components/kit";
import { COMPETITIVE, COMPETITIVE_TOPICS, COMPETITIVE_DIFFICULTIES } from "@/content";
import {
  CatalogPage, CatalogHero, FilterToolbar, SearchInput, Facet, TagChips,
  CardGrid, CourseCard, EmptyState, TRACK_ACCENT,
} from "@/components/catalog/CatalogKit";

const TOPIC_LABEL = Object.fromEntries(COMPETITIVE_TOPICS.map((t) => [t.key, t.label]));
const ACCENT = TRACK_ACCENT.competitive;

export default function Competitive() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(null);
  const [difficulty, setDifficulty] = useState("all");

  const presentTopics = COMPETITIVE_TOPICS.filter((t) =>
    COMPETITIVE.some((p) => p.topic === t.key)
  );

  const filtered = COMPETITIVE.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.algorithm_focus?.toLowerCase().includes(search.toLowerCase());
    const matchTopic = !topic || p.topic === topic;
    const matchDiff = difficulty === "all" || p.difficulty === difficulty;
    return matchSearch && matchTopic && matchDiff;
  });

  const levels = [{ value: "all", label: "All levels" }, ...COMPETITIVE_DIFFICULTIES.map((d) => ({ value: d, label: d }))];

  return (
    <CatalogPage>
      <CatalogHero
        title="Write the algorithm yourself."
        lead="Hard C++ problems, like the ones on USACO and Codeforces. A lot of them are the algorithms that make AI work."
        note="Not for beginners. These are hard C++ problems for people who can already code, a big jump from the Python AI track."
        accent={ACCENT}
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10">
        <FilterToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Filter problems…" />
          <Facet label="Level" options={levels} value={difficulty} onChange={setDifficulty} />
        </FilterToolbar>
        {presentTopics.length > 0 && (
          <div className="mb-8">
            <TagChips
              tags={presentTopics.map((t) => t.label)}
              active={topic ? TOPIC_LABEL[topic] : null}
              onToggle={(label) => {
                if (!label) return setTopic(null);
                const found = presentTopics.find((t) => t.label === label);
                setTopic(found?.key || null);
              }}
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState>No problems match your filters.</EmptyState>
        ) : (
          <Reveal>
            <CardGrid>
              {filtered.map((p, i) => (
                <CourseCard
                  key={p.id}
                  to={createPageUrl(`CompetitiveDetail?id=${p.id}`)}
                  accent={ACCENT}
                  index={String(i + 1).padStart(2, "0")}
                  title={p.title}
                  description={p.algorithm_focus}
                  tags={[TOPIC_LABEL[p.topic] || p.topic].filter(Boolean)}
                  meta={[p.difficulty, "C++17", p.time_limit_ms ? `${p.time_limit_ms}ms` : null]}
                />
              ))}
            </CardGrid>
          </Reveal>
        )}
      </div>
    </CatalogPage>
  );
}
