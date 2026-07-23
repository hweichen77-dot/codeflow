import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, RefreshCw, ArrowRight, Check, X } from "lucide-react";

import StepThrough from "@/components/lesson/blocks/StepThrough";
import InteractiveTokenizer from "@/components/lesson/blocks/InteractiveTokenizer";
import WorkedExample from "@/components/lesson/blocks/WorkedExample";
import ComparisonTable from "@/components/lesson/blocks/ComparisonTable";
import Reflection from "@/components/lesson/blocks/Reflection";

const PART_1 = `Type the word **"unbelievable"** into a model and it never sees that word. It sees three pieces, roughly \`un\`, \`believ\`, \`able\`. Those pieces are **tokens**, and they are the real units a language model reads and writes. Every limit, every bill, and a surprising number of bugs trace straight back to them.

## What a token actually is

A token is a *common chunk of text*. The tokenizer learned its vocabulary by scanning huge amounts of text and asking one question over and over: **which chunks show up often enough to deserve their own symbol?** Frequent chunks earn a slot; rare ones get assembled from smaller slots.

That single rule produces everything you see:

- whole common words, \`cat\`, \`the\`, \` model\` (the leading space is part of the token)
- word-pieces for longer words, \`token\` + \`izer\`
- punctuation and digits, \`,\`  \`.\`  \`2\`  \`025\`

A typical model carries **50,000–100,000 tokens** in its vocabulary. Nothing outside that set exists to the model; unknown text is just rebuilt from the pieces it *does* have.`;

const PART_2 = `## Why you should care

Tokens are not trivia. They quietly control three things that matter every single day:

1. **Cost.** APIs bill *per token*, input **and** output. A wordy prompt and a rambling answer both cost real money.
2. **Context limits.** A model can only hold so many tokens at once, its **context window**. Overflow it and the oldest text silently falls off the edge.
3. **Strange failures.** Ask a model to count the *r*'s in "strawberry" and it often misses. It is not looking at letters, it is looking at a couple of tokens.

## The rule of thumb

For English: **1 token ≈ 4 characters ≈ ¾ of a word.** So 100 words is roughly 130 tokens. The intuition is what matters: *common, plain text is cheap; rare, messy text is expensive.*`;

function Prose({ children }) {
  return (
    <div className="lesson-prose">
      <style>{`
        .lesson-prose p, .lesson-prose li { font-family: 'Inter', system-ui, sans-serif; font-size: 18px; line-height: 1.67; color: var(--text-primary); margin: 0 0 1rem; }
        .lesson-prose h2 { font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; letter-spacing: -0.02em; color: var(--text-strong); margin: 2rem 0 0.8rem; }
        .lesson-prose ul, .lesson-prose ol { margin: 0 0 1rem 1.2rem; }
        .lesson-prose li { margin-bottom: 0.4rem; }
        .lesson-prose strong { color: var(--text-strong); font-weight: 700; }
        .lesson-prose em { color: var(--text-primary); }
        .lesson-prose code { font-family: 'Spline Sans Mono Variable', ui-monospace, monospace; font-size: 0.85em; background: var(--bg-surface); padding: 1px 6px; border-radius: 4px; color: var(--accent-2); }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

function CheckStep({ question, options, pick, setPick }) {
  return (
    <div>
      <p className="u-display t-strong" style={{ fontSize: 20, lineHeight: 1.4, margin: "0 0 20px" }}>{question}</p>
      <div className="space-y-2.5">
        {options.map((o, i) => {
          const chosen = pick === i;
          return (
            <button
              key={i}
              onClick={() => setPick(i)}
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors"
              style={{
                borderRadius: 12,
                border: `1px solid ${chosen ? "var(--accent)" : "var(--border-subtle)"}`,
                background: chosen ? "rgba(94,210,156,0.10)" : "var(--bg-raised)",
                color: chosen ? "var(--text-strong)" : "var(--text-primary)",
                fontSize: 16,
              }}
            >
              <span className="u-mono" style={{ fontSize: 12, color: chosen ? "var(--accent)" : "var(--text-muted)" }}>
                {String.fromCharCode(65 + i)}
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const STEPS = [
  { kind: "prose", render: () => <Prose>{PART_1}</Prose> },
  {
    kind: "tool",
    render: () => (
      <div className="space-y-5">
        <p className="t-body" style={{ fontSize: 18, lineHeight: 1.67 }}>Type anything and watch it split into tokens in real time.</p>
        <InteractiveTokenizer />
      </div>
    ),
  },
  {
    kind: "tool",
    render: () => (
      <StepThrough
        title="text → tokens → bill"
        steps={[
          { label: "You write a prompt", detail: "A plain string of characters, what you typed.", code: '"The model sees tokens."' },
          { label: "The tokenizer splits it", detail: "Each chunk is matched against the model's fixed vocabulary. Common words stay whole; rare ones shatter.", code: '["The", " model", " sees", " tokens", "."]  →  5 tokens' },
          { label: "Tokens become IDs", detail: "Every token maps to an integer. The model only ever does math on these numbers.", code: "[464, 2746, 7224, 16326, 13]" },
          { label: "You get billed + limited", detail: "Token count drives the API bill (in and out) and must fit inside the context window.", code: "5 tokens · $3 / 1M in  →  $0.000015" },
        ]}
      />
    ),
  },
  {
    kind: "check",
    question: "Why is counting the letters in 'strawberry' hard for an LLM?",
    options: [
      "The word is too long for the context window",
      "It sees a couple of tokens, not individual letters",
      "Counting is disabled in most models",
    ],
    correct: 1,
    hint: "The model operates on tokens (chunks). The individual letters live inside a chunk it treats as one unit, so they aren't directly visible to it.",
  },
  { kind: "prose", render: () => <Prose>{PART_2}</Prose> },
  {
    kind: "tool",
    render: () => (
      <div className="space-y-4">
        <WorkedExample
          number={1}
          difficulty="easy"
          prompt={'How many tokens is "hello world"?'}
          steps={[
            'Both words are extremely common, so each stays a single token.',
            'The space before "world" rides along with it as part of that token.',
            'Count the chunks: ["hello"] + [" world"] = 2.',
          ]}
          output={"2 tokens"}
        />
        <ComparisonTable
          title="three ways to split text"
          columns={["Granularity", "Vocab size", "Tokens for 'unbelievable'", "Trade-off"]}
          rows={[
            { cells: ["Character", "~100", "12 (one per letter)", "Tiny vocab, but sequences get very long"] },
            { cells: ["Word", "millions", "1, if seen, else unknown", "Short sequences, but chokes on rare/new words"] },
            { cells: ["Subword (BPE)", "~50–100k", "3 (un · believ · able)", "The sweet spot every modern LLM uses"], highlight: true },
          ]}
        />
      </div>
    ),
  },
  {
    kind: "check",
    question: "You send a 1,000-token prompt and get a 600-token answer. Input costs $3/1M, output $15/1M. Which part dominates the bill?",
    options: [
      "The input prompt, because it has more tokens",
      "The output answer, because output tokens cost 5× more",
      "They cost exactly the same",
    ],
    correct: 1,
    hint: "Input = 1000/1M × $3 = $0.003. Output = 600/1M × $15 = $0.009. Fewer output tokens, but at 5× the price the answer dominates.",
  },
  {
    kind: "tool",
    render: () => (
      <Reflection
        prompt="In one or two sentences: why does rare or messy text cost more tokens than plain English?"
        sampleAnswer="The tokenizer only has whole-chunk symbols for text it saw often. Rare or messy text isn't in that set, so it gets rebuilt from many tiny pieces, and more pieces means more tokens, which means more cost."
      />
    ),
  },
];

export default function LessonDemo() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [checked, setChecked] = useState(false);
  const step = STEPS[i];
  const isCheck = step.kind === "check";
  const last = i === STEPS.length - 1;
  const correct = isCheck && pick === step.correct;

  const advance = () => {
    if (last) return;
    setI((n) => n + 1);
    setPick(null);
    setChecked(false);
  };

  const onPrimary = () => {
    if (isCheck && !checked) { setChecked(true); return; }
    advance();
  };

  const primaryLabel = isCheck && !checked ? "Check" : last ? "Finish" : "Continue";
  const primaryDisabled = isCheck && !checked && pick === null;
  const showFooter = isCheck && checked;

  return (
    <div className="min-h-screen" style={{ background: "transparent", paddingBottom: 140 }}>
      <div className="fixed top-[50px] left-0 right-0 lg:left-[208px] z-30" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto px-6 py-3" style={{ maxWidth: 760 }}>
          <div className="flex gap-1.5" role="progressbar" aria-valuenow={i + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Lesson progress">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-full transition-colors duration-300"
                style={{ height: 3, background: idx < i ? "var(--accent)" : idx === i ? "var(--accent-2)" : "var(--border-subtle)" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 pt-24" style={{ maxWidth: 720 }}>
        {i === 0 && (
          <header className="mb-10">
            <div className="u-mono t-muted mb-3" style={{ fontSize: 12, letterSpacing: "0.06em" }}>
              Module 1 · Lesson 2 · <span style={{ color: "var(--accent)" }}>Concept: Tokens</span>
            </div>
            <h1 className="u-display t-strong" style={{ fontSize: "2.4rem", lineHeight: 1.05, margin: "0 0 14px" }}>
              Tokens: the model doesn't see words
            </h1>
            <div className="flex flex-wrap items-center gap-4 u-mono t-muted" style={{ fontSize: 12 }}>
              <span className="flex items-center gap-1.5"><Clock size={12} /> 12 min read</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={12} /> Updated Jun 2026</span>
              <span style={{ color: "var(--amber)" }}>+10 XP</span>
            </div>
          </header>
        )}

        <div className="measure" style={{ maxWidth: 720 }}>
          {step.kind === "check" ? (
            <CheckStep {...step} pick={pick} setPick={checked ? () => {} : setPick} />
          ) : (
            step.render()
          )}
        </div>
      </div>

      <div className="fixed bottom-[68px] lg:bottom-4 left-0 right-0 lg:left-[208px] z-40 px-4">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          {showFooter && (
            <div
              className="flex items-start gap-3 px-4 py-3.5 mb-2"
              style={{
                borderRadius: 12,
                border: `1px solid ${correct ? "var(--run)" : "#FF6B5C"}`,
                background: correct ? "rgba(86,189,91,0.12)" : "rgba(255,107,92,0.12)",
              }}
            >
              <span style={{ color: correct ? "var(--run)" : "#FF6B5C", flexShrink: 0, marginTop: 2 }}>
                {correct ? <Check size={17} strokeWidth={3} /> : <X size={17} strokeWidth={3} />}
              </span>
              <p className="t-body" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: correct ? "var(--run)" : "#FF6B5C" }}>{correct ? "Correct. " : "Not quite. "}</strong>
                {step.hint}
              </p>
            </div>
          )}
          <div
            className="flex items-center justify-between gap-4 px-4 py-3"
            style={{ borderRadius: 14, border: "1px solid var(--border-default)", background: "var(--bg-surface)", boxShadow: "0 12px 40px -12px rgba(0,0,0,0.6)" }}
          >
            <span className="u-mono t-muted" style={{ fontSize: 12 }}>{i + 1} / {STEPS.length}</span>
            <button
              onClick={onPrimary}
              disabled={primaryDisabled}
              className="u-mono inline-flex items-center gap-2 px-6 h-11 text-sm transition-transform"
              style={{
                borderRadius: 10, fontWeight: 700, letterSpacing: "0.02em",
                color: "var(--bg-base)",
                background: primaryDisabled ? "var(--border-default)" : "var(--accent)",
                cursor: primaryDisabled ? "not-allowed" : "pointer",
                opacity: primaryDisabled ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!primaryDisabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {primaryLabel}
              {!primaryDisabled && !last && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
