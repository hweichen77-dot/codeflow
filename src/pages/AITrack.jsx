import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const TRACK = [
  {
    number: "01",
    title: "How AI Actually Works",
    difficulty: "Beginner",
    time: "45 min",
    description: "Models, training vs inference, what a prediction actually is. The mental model before touching any API.",
    concepts: ["Neural networks", "Training data", "Inference"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5bc",
  },
  {
    number: "02",
    title: "Your First API Call",
    difficulty: "Beginner",
    time: "60 min",
    description: "What an API is, JSON, API keys, rate limits. Build a Python script that calls an AI model.",
    concepts: ["REST APIs", "JSON", "Authentication"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5bd",
  },
  {
    number: "03",
    title: "Prompt Engineering",
    difficulty: "Beginner",
    time: "90 min",
    description: "System prompts, temperature, tokens, few-shot prompting. The marketable skill most CS courses skip.",
    concepts: ["System prompts", "Temperature", "Few-shot"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5be",
  },
  {
    number: "04",
    title: "Build a Chatbot",
    difficulty: "Intermediate",
    time: "2 hr",
    description: "Message history, context windows, streaming. Build a character chatbot that stays in-persona.",
    concepts: ["Context windows", "Role arrays", "Streaming"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5bf",
  },
  {
    number: "05",
    title: "Computer Vision Basics",
    difficulty: "Intermediate",
    time: "2 hr",
    description: "Image classification, CNNs conceptually, vision APIs. Feed images, get structure back.",
    concepts: ["Image classification", "CNNs", "Vision APIs"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5c0",
  },
  {
    number: "06",
    title: "Embeddings & Semantic Search",
    difficulty: "Intermediate",
    time: "2.5 hr",
    description: "Vectors, cosine similarity, what embeddings capture. Build a movie recommender from scratch.",
    concepts: ["Vector embeddings", "Cosine similarity", "Semantic search"],
    type: "project",
    projectId: "69c9b0173a255fc470d7c5c1",
  },
  {
    number: "07",
    title: "Build a RAG System",
    difficulty: "Advanced",
    time: "3 hr",
    description: "Why LLMs hallucinate, retrieval-augmented generation, chunking. Build a document Q&A tool.",
    concepts: ["RAG", "Document chunking", "Retrieval"],
    type: "capstone",
    projectId: "69c9b0173a255fc470d7c5c2",
  },
  {
    number: "08",
    title: "Fine-Tuning & Evals",
    difficulty: "Advanced",
    time: "3 hr",
    description: "When to fine-tune vs prompt, what an eval is, measuring model quality. Write a real eval suite.",
    concepts: ["Fine-tuning", "Evaluation", "Model quality"],
    type: "capstone",
    projectId: "69c9b0173a255fc470d7c5c3",
  },
];

const CAPSTONES = [
  {
    level: "Beginner",
    title: "Personal AI Writing Assistant",
    description: "A web page with tone controls — formal, shorter, funnier — that rewrites text using an LLM. First real deployed app.",
    skills: ["Frontend", "API security", "Prompt chaining"],
  },
  {
    level: "Intermediate",
    title: "AI Flashcard Generator",
    description: "Paste any text, get spaced-repetition flashcards. Uses embeddings to group related concepts.",
    skills: ["Embeddings", "Prompt engineering", "Structured output"],
  },
  {
    level: "Advanced",
    title: "AI Code Reviewer",
    description: "Paste code, get structured feedback on bugs, style, security, and performance. Handles multiple languages.",
    skills: ["Structured output", "Multi-language", "Evaluation"],
  },
];

const DIFF_COLOR = {
  Beginner: { color: "#b8ff00", border: "#b8ff0033", bg: "#b8ff0010" },
  Intermediate: { color: "#ffb300", border: "#ffb30033", bg: "#ffb30010" },
  Advanced: { color: "#ff6b6b", border: "#ff6b6b33", bg: "#ff6b6b10" },
};

export default function AITrack() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Hero */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#2a2a2a" }}>§ AI TRACK</div>
          <h1
            className="font-display font-black leading-none mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05, color: "#e8e8e8" }}
          >
            Learn to build<br />
            <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>with AI.</span>
          </h1>
          <p className="font-display text-base max-w-prose" style={{ color: "#555", fontWeight: 400 }}>
            Not just theory. A full progression from "what is a model" to building and deploying real AI-powered applications — with working code at every step.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 space-y-20">

        {/* Curriculum */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#2a2a2a" }}>
            CURRICULUM — 8 MODULES
          </div>

          {/* Table header */}
          <div
            className="grid gap-8 px-6 py-3 mb-px"
            style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #1a1a1a" }}
          >
            {["MOD", "PROJECT", "LEVEL", "TIME"].map(h => (
              <div key={h} className="font-mono text-xs tracking-widest uppercase" style={{ color: "#2a2a2a" }}>{h}</div>
            ))}
          </div>

          {TRACK.map((item) => {
            const dc = DIFF_COLOR[item.difficulty];
            return (
              <Link
                key={item.number}
                to={createPageUrl(`ProjectDetail?id=${item.projectId}`)}
                className="group block"
              >
                <div
                  className="grid gap-8 px-6 py-6 transition-all duration-200"
                  style={{ gridTemplateColumns: "3rem 1fr auto auto", borderBottom: "1px solid #111" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                >
                  <div className="font-mono font-bold" style={{ fontSize: "1.5rem", color: "#1e1e1e", letterSpacing: "-0.05em" }}>
                    {item.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-base transition-colors duration-150 group-hover:text-white" style={{ color: "#ccc", letterSpacing: "-0.02em" }}>
                        {item.title}
                      </span>
                      {item.type === "capstone" && (
                        <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                          CAPSTONE
                        </span>
                      )}
                    </div>
                    <p className="font-display text-sm mb-3" style={{ color: "#444", fontWeight: 400 }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.concepts.map(c => (
                        <span key={c} className="font-mono text-xs px-2 py-0.5" style={{ color: "#333", border: "1px solid #1e1e1e" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span
                      className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
                      style={{ color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg }}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-right" style={{ color: "#333" }}>
                    {item.time}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Capstone projects */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: "#2a2a2a" }}>
            CAPSTONE PROJECTS — WHAT YOU WILL BUILD
          </div>
          <div className="grid md:grid-cols-3 gap-0" style={{ border: "1px solid #1a1a1a" }}>
            {CAPSTONES.map((cap, i) => {
              const dc = DIFF_COLOR[cap.level];
              return (
                <div
                  key={cap.title}
                  className="p-8"
                  style={{ borderRight: i < 2 ? "1px solid #1a1a1a" : "none" }}
                >
                  <span
                    className="inline-block font-mono text-xs tracking-widest uppercase px-2.5 py-1 mb-5"
                    style={{ color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg }}
                  >
                    {cap.level}
                  </span>
                  <h3
                    className="font-display font-bold text-xl mb-3"
                    style={{ color: "#e8e8e8", letterSpacing: "-0.03em" }}
                  >
                    {cap.title}
                  </h3>
                  <p className="font-display text-sm leading-relaxed mb-5" style={{ color: "#555", fontWeight: 400 }}>
                    {cap.description}
                  </p>
                  <div className="space-y-1.5">
                    {cap.skills.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>→</span>
                        <span className="font-mono text-xs" style={{ color: "#444" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12" style={{ border: "1px solid #1a1a1a" }}>
          <div className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: "#2a2a2a" }}>READY?</div>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "#e8e8e8" }}
          >
            Start building with AI.
          </h2>
          <p className="font-display text-base mb-8" style={{ color: "#555", fontWeight: 400 }}>
            The projects are in the Projects section. Filter by category "AI/ML".
          </p>
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{ background: "#b8ff00", color: "#0a0a0a", border: "1px solid #b8ff00", fontWeight: 700 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(184,255,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Browse Projects →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}