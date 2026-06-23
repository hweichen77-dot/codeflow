# CodeFlow

Learn to code by building real things. CodeFlow is a free educational platform
where you write and run actual programs in the browser — no setup, no toy
sandboxes — while a tutor walks you through the why, not just the answer.

Available on the web and as a desktop app (macOS/Windows/Linux via Tauri).

## Tracks

CodeFlow spans four tracks of project-based curriculum:

- **AI Engineering** — build with LLMs, APIs, and modern AI tooling (Python)
- **AP Computer Science Principles** — the full AP CSP curriculum (Python + pseudocode)
- **AP Computer Science A** — the full AP CSA curriculum (Java)
- **Competitive Coding** — algorithmic problem solving (C++)

Across the tracks: **38 projects**, **300+ lessons**, and **300+ coding
challenges**, each with a runnable reference solution verified in CI.

## In-browser code runners

Your code runs for real, right in the lesson:

- **Python** — in-browser via Pyodide
- **Java** — remote OpenJDK judge
- **C++** — Compiler Explorer

## Pricing

Free at launch. No paid tier.

## Tech Stack

- React 18 + Vite
- Tailwind CSS + Radix UI (shadcn/ui)
- Tauri (desktop builds)
- Supabase (optional account sync)

## Getting Started

```bash
npm install
npm run dev
```

To build the desktop app:

```bash
npm run tauri build
```

## Authoring content

See [CONTENT_AUTHORING.md](CONTENT_AUTHORING.md) for the lesson data model,
track conventions, and the `verify:solutions` CI gate that compiles and runs
every reference solution against its test cases.
