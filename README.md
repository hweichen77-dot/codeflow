# Compilearn

Learn to code in your browser. It's free and there's nothing to install. You write and run real programs, a live AI tutor tells you why your code broke, and the LLM Playground lets you build with AI by actually doing it.

Runs on the web and as a desktop app (macOS, Windows, Linux via Tauri).

## The LLM Playground

This is the part you won't find on other learn-to-code sites. You write a prompt, run it against a real language model, and your output gets graded against a goal. It's the same loop AI engineers work in all day: write a prompt, run it, check the result, adjust. Here you're learning that loop, with no API keys and nothing to configure. Change the prompt and the grade changes with it, and that's usually the moment prompting starts to click.

## Live AI tutor

Every lesson comes with a tutor that reads your actual code and explains, in plain English, why it failed. It's what you'd want at 11pm when there's no one else to ask.

## Tracks

Four project-based tracks:

- AI Engineering: build with LLMs, APIs, and modern AI tooling (Python)
- AP Computer Science Principles: the full AP CSP curriculum (Python and pseudocode)
- AP Computer Science A: the full AP CSA curriculum (Java)
- Competitive Coding: algorithmic problem solving (C++)

Together they cover 22 projects, 300+ lessons, and 300+ coding challenges. Every challenge has a runnable reference solution that's verified in CI.

## In-browser code runners

Your code runs for real, right inside the lesson:

- Python runs in the browser via Pyodide
- Java runs on a remote OpenJDK judge
- C++ runs on Compiler Explorer

## Pricing

Free. No paid tier.

## Tech stack

- React 18 + Vite
- Tailwind CSS + Radix UI (shadcn/ui)
- Tauri (desktop builds)
- Supabase (optional account sync)
- Groq (LLM Playground and AI tutor)

## Getting started

```bash
npm install
npm run dev
```

To build the desktop app:

```bash
npm run tauri build
```

## Authoring content

See CONTENT_AUTHORING.md for the lesson data model, the track conventions, and the verify:solutions CI gate that compiles and runs every reference solution against its tests.
