import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, Clock, RefreshCw } from "lucide-react";

import { Stagger, StaggerItem, HoverCard } from "@/lib/motion";
import StepThrough from "@/components/lesson/blocks/StepThrough";
import InteractiveTokenizer from "@/components/lesson/blocks/InteractiveTokenizer";
import DragToBin from "@/components/lesson/blocks/DragToBin";
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

A typical model carries **50,000, 100,000 tokens** in its vocabulary. Nothing outside that set exists to the model; unknown text is just rebuilt from the pieces it *does* have.`;

const PART_2 = `## Why you should care

Tokens are not trivia. They quietly control three things that matter every single day:

1. **Cost.** APIs bill *per token*, input **and** output. A wordy prompt and a rambling answer both cost real money.
2. **Context limits.** A model can only hold so many tokens at once, its **context window**. Overflow it and the oldest text silently falls off the edge.
3. **Strange failures.** Ask a model to count the *r*'s in "strawberry" and it often misses. It is not looking at letters, it is looking at a couple of tokens. The letters are *inside* a chunk it treats as one unit.

## The rule of thumb

For English: **1 token ≈ 4 characters ≈ ¾ of a word.** So 100 words is roughly 130 tokens. Don't memorize it, you'll reach for a real counter when money is on the line. The intuition is what matters: *common, plain text is cheap; rare, messy text is expensive.*`;

function InlineCheck({ question, options, correct, explain }) {
  const [pick, setPick] = useState(null);
  const done = pick !== null;
  return (
    <div className="my-7" style={{ border: "1px solid #262219", background: "#131009" }}>
      <div className="px-5 py-3" style={{ borderBottom: "1px solid #262219" }}>
        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#C2643C" }}>CHECK YOURSELF</span>
      </div>
      <div className="p-5">
        <p className="font-display text-sm mb-4" style={{ color: "#FFFFFF", fontWeight: 500 }}>{question}</p>
        <div className="space-y-2">
          {options.map((o, i) => {
            const isPick = pick === i;
            const isAns = i === correct;
            let border = "#2A261E", color = "#C2BAAA", bg = "#1C1A14";
            if (done && isAns) { border = "#E8A33C"; color = "#E8A33C"; bg = "#E8A33C10"; }
            else if (done && isPick) { border = "#ff6b35"; color = "#ff6b35"; bg = "#ff6b3510"; }
            return (
              <button
                key={i}
                onClick={() => !done && setPick(i)}
                disabled={done}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 font-display text-sm transition-all"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: done ? "default" : "pointer" }}
              >
                <span className="font-sans text-xs" style={{ opacity: 0.6 }}>{String.fromCharCode(65 + i)}</span>
                {o}
              </button>
            );
          })}
        </div>
        {done && (
          <p className="font-display text-sm mt-4 px-4 py-3" style={{ color: "#FFFFFF", background: "#15130E", border: "1px solid #262219" }}>{explain}</p>
        )}
      </div>
    </div>
  );
}

function ReadingBox({ children }) {
  return (
    <div className="lesson-doc px-7 py-6" style={{ background: "#ffffff", color: "#262219" }}>
      <style>{`
        .lesson-doc h2 { font-family:'Bricolage Grotesque Variable', system-ui, sans-serif; font-weight:800; font-size:1.35rem; letter-spacing:-0.02em; margin:1.6rem 0 0.7rem; color:#15130E; }
        .lesson-doc p { font-size:0.95rem; line-height:1.7; margin:0 0 0.9rem; color:#34302A; }
        .lesson-doc ul,.lesson-doc ol { margin:0 0 0.9rem 1.2rem; }
        .lesson-doc li { font-size:0.95rem; line-height:1.6; margin-bottom:0.35rem; color:#34302A; }
        .lesson-doc strong { color:#15130E; font-weight:700; }
        .lesson-doc code { font-family:'JetBrains Mono',monospace; font-size:0.82rem; background:#F2EDE2; padding:1px 5px; border-radius:3px; color:#9333ea; }
      `}</style>
      <ReactMarkdown remarkGfm={remarkGfm} remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="font-sans text-xs tracking-widest uppercase mt-12 mb-3" style={{ color: "#FFFFFF" }}>
      <span style={{ color: "#E8A33C" }}>//</span> {children}
    </div>
  );
}

export default function LessonDemo() {
  return (
    <div className="min-h-screen px-6 lg:px-10 pt-24 pb-24" style={{ background: "#15130E" }}>
      <Stagger className="max-w-3xl mx-auto" as="div">
        <StaggerItem as="div" className="mb-6 px-4 py-2 font-sans text-xs tracking-widest uppercase" style={{ background: "#cc66ff14", border: "1px solid #cc66ff44", color: "#cc66ff" }}>
          PROTOTYPE, proposed lesson content style (not yet rolled out)
        </StaggerItem>

        <StaggerItem as="div">
          <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#E8A33C" }}>MODULE 1 · LESSON 2 · CONCEPT: TOKENS</div>
          <h1 className="font-display font-black mb-3" style={{ fontSize: "2.3rem", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#f5f5f5" }}>
            Tokens: The Model Doesn't See Words
          </h1>
          <div className="flex flex-wrap items-center gap-4 font-sans text-xs mb-8" style={{ color: "#FFFFFF" }}>
            <span className="flex items-center gap-1.5"><Clock size={12} /> 12 min read</span>
            <span className="flex items-center gap-1.5"><RefreshCw size={12} /> Updated Jun 2026</span>
            <span style={{ color: "#E8A33C" }}>+10 XP</span>
          </div>
        </StaggerItem>

        <StaggerItem as="div" className="px-5 py-4 mb-8" style={{ border: "1px solid #262219", background: "#131009", borderLeft: "2px solid #E8A33C" }}>
          <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#E8A33C" }}>WHAT YOU'LL LEARN</div>
          <ul className="space-y-1 font-display text-sm" style={{ color: "#FFFFFF" }}>
            <li>, What a token is and why models use them instead of words or letters</li>
            <li>, How tokenization drives cost, context limits, and weird failures</li>
            <li>, How to estimate token counts and API spend in your head</li>
          </ul>
        </StaggerItem>

        <StaggerItem as="div">
          <SectionLabel>Read</SectionLabel>
          <ReadingBox>{PART_1}</ReadingBox>
        </StaggerItem>

        <StaggerItem as="div">
          <SectionLabel>Try the tool</SectionLabel>
          <InteractiveTokenizer />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Watch it happen</SectionLabel>
        <StepThrough
          title="text → tokens → bill"
          steps={[
            { label: "You write a prompt", detail: "A plain string of characters, what you typed.", code: '"The model sees tokens."' },
            { label: "The tokenizer splits it", detail: "Each chunk is matched against the model's fixed vocabulary. Common words stay whole; rare ones shatter.", code: '["The", " model", " sees", " tokens", "."]  →  5 tokens' },
            { label: "Tokens become IDs", detail: "Every token maps to an integer. The model only ever does math on these numbers.", code: "[464, 2746, 7224, 16326, 13]" },
            { label: "You get billed + limited", detail: "Token count drives the API bill (in and out) and must fit inside the context window.", code: "5 tokens · $3 / 1M in  →  $0.000015" },
          ]}
        />
        </StaggerItem>

        <StaggerItem as="div">
          <SectionLabel>Read</SectionLabel>
          <ReadingBox>{PART_2}</ReadingBox>
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Worked examples</SectionLabel>
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
        <WorkedExample
          number={2}
          difficulty="medium"
          prompt={"You send a 1,000-token prompt and get a 600-token answer.\nInput: $3 / 1M tokens.  Output: $15 / 1M tokens.\nWhat does the call cost?"}
          steps={[
            "Input cost = 1000 / 1,000,000 × $3 = $0.003.",
            "Output cost = 600 / 1,000,000 × $15 = $0.009.",
            "Output tokens cost 5× more, answers, not prompts, usually dominate the bill.",
            "Total = $0.003 + $0.009 = $0.012.",
          ]}
          output={"$0.012000 per call"}
        />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Compare the approaches</SectionLabel>
        <ComparisonTable
          title="three ways to split text"
          columns={["Granularity", "Vocab size", "Tokens for 'unbelievable'", "Trade-off"]}
          rows={[
            { cells: ["Character", "~100", "12 (one per letter)", "Tiny vocab, but sequences get very long"] },
            { cells: ["Word", "millions", "1, if seen, else unknown", "Short sequences, but chokes on rare/new words"] },
            { cells: ["Subword (BPE)", "~50, 100k", "3 (un · believ · able)", "The sweet spot every modern LLM uses"], highlight: true },
          ]}
        />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Sort it</SectionLabel>
        <DragToBin
          title="few tokens vs many tokens"
          bins={[
            { id: "few", label: "Few tokens (cheap)" },
            { id: "many", label: "Many tokens (expensive)" },
          ]}
          items={[
            { id: "i1", text: '"the cat sat"', bin: "few" },
            { id: "i2", text: '"pneumonoultramicroscopic"', bin: "many" },
            { id: "i3", text: '"hello there"', bin: "few" },
            { id: "i4", text: '"x9f3!! Zq"', bin: "many" },
            { id: "i5", text: '"good morning"', bin: "few" },
          ]}
        />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Check yourself</SectionLabel>
        <InlineCheck
          question="Why is counting the letters in 'strawberry' hard for an LLM?"
          options={["The word is too long for the context window", "It sees a couple of tokens, not individual letters", "Counting is disabled in most models"]}
          correct={1}
          explain="The model operates on tokens (chunks). The individual letters live inside a chunk it treats as one unit, so they aren't directly visible to it."
        />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Reflect</SectionLabel>
        <Reflection
          prompt="In one or two sentences: why does rare or messy text cost more tokens than plain English?"
          sampleAnswer="The tokenizer only has whole-chunk symbols for text it saw often. Rare or messy text isn't in that set, so it gets rebuilt from many tiny pieces, and more pieces means more tokens, which means more cost."
        />
        </StaggerItem>

        <StaggerItem as="div">
        <SectionLabel>Keep going</SectionLabel>
        <Stagger className="grid sm:grid-cols-2 gap-3" as="div">
          {[
            { k: "NEXT LESSON", t: "Training vs Inference", c: "#E8A33C" },
            { k: "PRACTICE", t: "Challenge: Estimate an API bill", c: "#C2643C" },
            { k: "RELATED", t: "Context Windows & Memory", c: "#cc66ff" },
            { k: "RELATED", t: "Why LLMs Make Things Up", c: "#cc66ff" },
          ].map((x) => (
            <StaggerItem key={x.t} as="div">
              <HoverCard className="flex items-center justify-between px-4 py-3 group cursor-pointer transition-all" style={{ border: "1px solid #262219", background: "#131009" }} as="div">
                <div>
                  <div className="font-sans text-xs tracking-widest uppercase mb-0.5" style={{ color: x.c }}>{x.k}</div>
                  <div className="font-display text-sm font-medium" style={{ color: "#FFFFFF" }}>{x.t}</div>
                </div>
                <ArrowRight size={15} style={{ color: "#FFFFFF" }} />
              </HoverCard>
            </StaggerItem>
          ))}
        </Stagger>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
