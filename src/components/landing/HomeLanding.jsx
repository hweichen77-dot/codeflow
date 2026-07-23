import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import {
  GridBackdrop,
  HeroGlow,
  GradientText,
  Typewriter,
  CountUp,
  Reveal,
  Stagger,
  Item,
  MagneticButton,
  BentoGrid,
  BentoCard,
  SpotlightCard,
  CodeWindow,
  Marquee,
} from "@/components/kit";
import LivePlayground from "@/components/landing/LivePlayground";

const MUX = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

const V = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "";
const DOWNLOAD_MAC = `https://github.com/hweichen77-dot/compilearn/releases/download/v${V}/Compilearn_${V}_universal.dmg`;
const DOWNLOAD_WIN = `https://github.com/hweichen77-dot/compilearn/releases/download/v${V}/Compilearn_${V}_x64-setup.exe`;

function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#070B0A]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "h-14" : "h-[68px]"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-md u-mono text-sm font-bold"
            style={{ color: "#5ED29C", background: "rgba(94,210,156,0.10)", border: "1px solid rgba(94,210,156,0.28)" }}
          >
            &gt;_
          </span>
          <span className="u-display text-[17px] font-extrabold tracking-tight text-white">
            Compilearn
          </span>
        </Link>
        <div className="flex items-center gap-7">
          <a href="#tracks" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block">
            Tracks
          </a>
          <a href="#playground" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block">
            Playground
          </a>
          <MagneticButton
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#5ED29C] px-5 py-2 text-[13px] font-bold text-[#070B0A] shadow-[0_8px_30px_-10px_rgba(94,210,156,.7)]"
          >
            Start a track
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}

function HeroVisual() {
  return (
    <CodeWindow file="tutor.py" className="w-full">
      <code className="block">
        <span className="text-white/45">from</span> <span className="text-[#34D0C4]">compilearn</span>{" "}
        <span className="text-white/45">import</span> <span className="text-[#5ED29C]">ai</span>
        {"\n\n"}
        <span className="text-[#5ED29C]">reply</span> <span className="text-white/45">=</span> ai.<span className="text-[#34D0C4]">chat</span>(
        {"\n"}    system=<span className="text-[#F5A524]">"You are a patient tutor."</span>,
        {"\n"}    user=<span className="text-[#F5A524]">"Why is my loop off by one?"</span>,
        {"\n"})
        {"\n"}
        <span className="text-[#5ED29C]">print</span>(reply)
        {"\n\n"}
        <span className="text-[var(--run)]">▸ running on a real model…</span>
        {"\n"}
        <span className="text-white/70">Your range stops one short, so use</span>
        {"\n"}
        <span className="text-white/70">range(len(x)+1). Here's why…</span>
      </code>
    </CodeWindow>
  );
}

const TRACKS = [
  {
    key: "ai",
    label: "AI Track",
    body: "From your first API call to shipping real apps in production, built to be done in order.",
    tag: "AI Track",
    span: "md:col-span-4 md:row-span-2",
    big: true,
    to: "AITrack",
    modules: ["Your First API Call", "Prompt Engineering", "Build a Chatbot", "Embeddings & Semantic Search", "Build a RAG System", "AI Agents & Tool Use", "Shipping to production"],
  },
  {
    key: "projects",
    label: "AI Projects",
    body: "Build real things you can show off, one guided step at a time.",
    tag: "22 projects",
    span: "md:col-span-2",
    to: "Projects",
    chips: ["Chatbot", "Essay grader", "RAG search", "Vision app", "+18 more"],
  },
  {
    key: "csp",
    label: "AP CSP",
    body: "Full AP Computer Science Principles curriculum plus Create Task practice.",
    tag: "48 lessons",
    span: "md:col-span-2",
    to: "APCS",
    chips: ["Big Ideas 1–5", "Create Task", "MCQ practice"],
  },
  {
    key: "csa",
    label: "AP CSA",
    body: "Java from the ground up, with MCQ drills and free-response prep for the exam.",
    tag: "80 lessons",
    span: "md:col-span-6",
    to: "APCS",
    chips: ["Java basics", "OOP & classes", "Arrays & ArrayList", "2D arrays", "Recursion", "Sorting & searching", "MCQ drills", "FRQ prep", "Labs", "Exam review"],
  },
];

function TrackChip({ children }) {
  return (
    <span className="u-mono text-[11px] rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/70">
      {children}
    </span>
  );
}

function TrackCard({ t, modules }) {
  const navigate = useNavigate();
  const mods = modules && modules.length ? modules : t.modules;
  const shown = t.big ? (mods || []).slice(0, 12) : [];
  const extra = t.big ? (mods || []).length - shown.length : 0;
  return (
    <BentoCard span={t.span} className="cursor-pointer" >
      <div onClick={() => navigate(createPageUrl(t.to))} className="flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#5ED29C]/25 bg-[#5ED29C]/10 u-mono text-xs font-semibold text-[#5ED29C]">
            {t.key === "ai" ? ">_" : t.key === "projects" ? "◍" : t.key === "csp" ? "CSP" : "CSA"}
          </span>
          <h3 className="u-display text-lg font-bold text-white">{t.label}</h3>
        </div>
        <p className={`mt-3 text-sm leading-relaxed text-white/70 ${t.big ? "max-w-md" : "max-w-xs"}`}>
          {t.body}
        </p>

        {t.big ? (
          <ol className="mt-6 flex flex-1 flex-col justify-between border-l border-white/10 py-2 pl-5">
            {shown.map((m, i) => (
              <li key={m + i} className="flex items-baseline gap-3 u-mono text-[12.5px] text-white/80">
                <span className="text-[#5ED29C]">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 truncate">{m}</span>
              </li>
            ))}
            {extra > 0 && (
              <li className="u-mono text-[12.5px] text-white/50 pl-8">+ {extra} more modules</li>
            )}
          </ol>
        ) : (
          <div className="mt-4 flex flex-1 flex-wrap content-start gap-2">
            {t.chips.map((c) => (
              <TrackChip key={c}>{c}</TrackChip>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <span className="u-mono text-xs text-[#5ED29C]">{t.big && mods && mods.length ? `${mods.length} modules` : t.tag}</span>
          <ArrowRight size={14} className="text-white/60 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </BentoCard>
  );
}

const STEPS = [
  ["01", "Write a prompt", "Open a lesson and write your instructions. No install, no account to begin."],
  ["02", "Run on a real LLM", "Your code and prompts execute against an actual language model, live in the browser."],
  ["03", "Get auto-graded", "Challenges and the playground score your work against real rubrics. A win is a real win."],
  ["04", "Level up", "Build a streak, climb the tracks, and ship projects you can actually show off."],
];

const STATS = [
  [480, "+", "lessons & challenges"],
  [128, "", "AP CS lessons"],
  [3, "", "languages run in-browser"],
];

const MARQUEE_ITEMS = ["Python", "Java", "C++", "Real LLMs", "AP CSP", "AP CSA", "Prompting", "RAG & Search", "Agents", "Vision"];

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  );
}

export default function HomeLanding() {
  const navigate = useNavigate();
  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const aiTitles = projects
    .filter((p) => (p.track || "ai") === "ai" && p.kind !== "product")
    .map((p) => p.title);
  const vref = useRef(null);
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const tryPlay = () => { const p = v.play(); if (p) p.catch(() => {}); };
    v.addEventListener("canplay", tryPlay);
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.loadSource(MUX);
      hls.attachMedia(v);
      return () => { v.removeEventListener("canplay", tryPlay); hls.destroy(); };
    }
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = MUX;
    }
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070B0A] text-white" style={{ fontFamily: "var(--font-display)" }}>
      <Nav />

      <section className="relative overflow-hidden">
        <video
          ref={vref}
          muted
          autoPlay
          loop
          playsInline
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-60"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(85%_78%_at_50%_36%,rgba(7,11,10,.5)_0%,rgba(7,11,10,.3)_55%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(0deg,#070B0A_3%,rgba(7,11,10,.3)_34%,transparent_70%)]" />
        <GridBackdrop />
        <HeroGlow color="#5ED29C" />

        <div className="relative z-10 mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-6 pt-12 pb-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Reveal>
              <h1 className="u-display text-[clamp(40px,6.2vw,68px)] font-extrabold leading-[0.98] tracking-tight text-white">
                Write the prompt. <GradientText brand>Survive the attacks</GradientText>.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="measure mt-6 text-lg leading-relaxed text-white/70">
                Learn how AI works by defending one. You write the system prompt that
                guards a rule, then real attacks try to break it. Beat the playground,
                then build real projects. No signup to start.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-6 text-base text-white/92">
                Build{" "}
                <Typewriter
                  className="u-mono text-white"
                  words={["a chatbot", "a RAG search app", "a prompt that resists injection", "an AI code reviewer"]}
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <MagneticButton
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ED29C] px-7 py-3.5 text-[15px] font-bold text-[#070B0A] shadow-[0_10px_34px_-12px_rgba(94,210,156,.7)]"
                >
                  Start building free <ArrowRight size={18} strokeWidth={2.4} />
                </MagneticButton>
                <a
                  href="#playground"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/40"
                >
                  <Play size={15} /> Try the playground
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-6">
                <div className="u-mono text-[12.5px] text-white/55">Or get the desktop app:</div>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={DOWNLOAD_MAC}
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:border-[#5ED29C]/60 whitespace-nowrap"
                  >
                    Download for macOS
                  </a>
                  <a
                    href={DOWNLOAD_WIN}
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:border-[#5ED29C]/60 whitespace-nowrap"
                  >
                    Download for Windows
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      <div className="border-y border-white/10 bg-black/20 py-2.5">
        <Marquee speed={34}>
          {MARQUEE_ITEMS.map((t) => (
            <span key={t} className="u-mono text-[15px] text-white">
              {t}
              <span className="ml-6 text-[#5ED29C]/60">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Reveal>
        <LivePlayground />
      </Reveal>

      <Section id="tracks" className="py-24">
        <Reveal>
          <h2 className="u-display text-[clamp(28px,3.8vw,44px)] font-extrabold leading-tight tracking-tight text-white">
            Start with AI. The rest is here when you want it.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure mt-4 text-lg text-white/70">
            Pick a lane or wander across all four. From your first line of Python to
            shipping with AI and prepping for the AP exam.
          </p>
        </Reveal>
        <div className="mt-12">
          <BentoGrid>
            {TRACKS.map((t) => (
              <TrackCard key={t.key} t={t} modules={t.key === "ai" ? aiTitles : null} />
            ))}
          </BentoGrid>
        </div>
      </Section>

      <Section className="py-24">
        <Reveal>
          <h2 className="u-display text-[clamp(28px,3.8vw,44px)] font-extrabold leading-tight tracking-tight text-white">
            Write a prompt. Run it live. Know it stuck.
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-4" gap={0.08}>
          {STEPS.map(([n, t, d]) => (
            <Item key={n}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="u-mono text-sm tracking-widest text-[#5ED29C]">step {n}</div>
                <h3 className="u-display mt-4 text-xl font-bold text-white">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{d}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </Section>

      <Section className="grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal>
          <SpotlightCard className="border-white/10">
            <div className="flex flex-col gap-3">
              <div className="self-end rounded-2xl border border-[#5ED29C]/25 bg-[#5ED29C]/10 px-4 py-3 u-mono text-[13px] text-white/80">
                for i in range(len(nums)):
                <br />
                &nbsp;&nbsp;total =+ nums[i]
              </div>
              <div className="self-start rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/92">
                <span className="u-mono mb-2 block text-[11px] uppercase tracking-widest text-[#5ED29C]">
                  tutor
                </span>
                Your total never adds up because{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">=+</code>{" "}
                isn't what you think. Python reads it as{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">total = (+nums[i])</code>
                , so each loop overwrites total. You meant{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">+=</code>. Flip
                the two characters and it accumulates.
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h2 className="u-display text-[clamp(28px,3.6vw,42px)] font-extrabold leading-tight tracking-tight text-white">
              A tutor that reads your actual code.
            </h2>
            <p className="measure mt-4 text-lg text-white/70">
              When something breaks, the tutor looks at the exact code you wrote,
              explains the failure in plain English, then points at the one line to
              change. No forum, no waiting. The teacher who's there when nobody else is.
            </p>
          </div>
        </Reveal>
      </Section>

      <div className="border-y border-white/10 bg-[radial-gradient(700px_300px_at_50%_0%,rgba(94,210,156,.06),transparent_70%)]">
        <Section className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          {STATS.map(([v, suffix, label], i) => (
            <Reveal key={label} delay={i * 0.07}>
              <b className="u-display block text-[clamp(34px,4.4vw,52px)] font-extrabold leading-none tracking-tight text-white">
                <CountUp to={v} suffix={suffix} />
              </b>
              <span className="u-mono mt-2 block text-[12.5px] text-white/60">{label}</span>
            </Reveal>
          ))}
          <Reveal delay={0.21}>
            <b className="u-display block text-[clamp(34px,4.4vw,52px)] font-extrabold leading-none tracking-tight text-white">
              $0
            </b>
            <span className="u-mono mt-2 block text-[12.5px] text-white/60">to start, no card</span>
          </Reveal>
        </Section>
      </div>

      <Section className="py-24">
        <div className="grid items-start gap-14 md:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <figure className="m-0">
              <span className="u-display block text-5xl leading-[0.6] text-white/15">&ldquo;</span>
              <blockquote className="u-display mt-2 text-[clamp(24px,2.6vw,34px)] font-semibold leading-snug tracking-tight text-white">
                Most people who try to learn to code never ship anything. Compilearn is
                where you learn by{" "}
                <span className="italic text-[#5ED29C]">building real things</span>.
              </blockquote>
              <figcaption className="mt-6 u-mono text-xs tracking-wide text-white/60">
                the Compilearn mission
              </figcaption>
            </figure>
          </Reveal>
          <div className="flex flex-col gap-8">
            {[
              ["A tutor that makes you think it through instead of handing over the answer. That's the difference between learning and copying.", "how we teach"],
              ["Run real Python, Java, and C++ right in the browser. No setup, no toy sandboxes. The same code you'd write for a real project.", "what you'll use"],
            ].map(([q, who], i) => (
              <Reveal key={who} delay={0.08 + i * 0.08}>
                <figure className="m-0 border-t border-white/10 pt-6">
                  <blockquote className="text-[17px] leading-relaxed text-white/92">{q}</blockquote>
                  <figcaption className="mt-4 u-mono text-xs tracking-wide text-white/60">{who}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-28 text-center">
        <Reveal>
          <h2 className="u-display mx-auto max-w-[16ch] text-[clamp(38px,6.4vw,78px)] font-extrabold leading-none tracking-tight text-white">
            Start coding in the next 30 seconds.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-[46ch] text-lg text-white/70">
            Free, runs in your browser, no signup to begin. Open a lesson and run your
            first line.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <MagneticButton
            onClick={() => navigate("/login")}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#5ED29C] px-8 py-4 text-[17px] font-bold text-[#070B0A] shadow-[0_10px_34px_-12px_rgba(94,210,156,.7)]"
          >
            Start learning free <ArrowRight size={18} strokeWidth={2.4} />
          </MagneticButton>
        </Reveal>
      </Section>

      <SiteFooter />
    </div>
  );
}

function FooterLink({ to, href, children }) {
  const cls = "block text-sm text-white/70 transition-colors hover:text-[#5ED29C]";
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 pb-24 pt-16">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="u-mono text-[#F5A524] text-lg font-semibold">&gt;_</span>
            <span className="u-display text-lg font-extrabold tracking-tight text-white">Compilearn</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Built for people who learn by doing. Real code execution and an AI tutor
            that won't hand you the answer.
          </p>
        </div>
        <div>
          <h4 className="u-mono mb-4 text-xs uppercase tracking-widest text-[#2E8B7A]">Product</h4>
          <div className="space-y-2">
            <FooterLink to={createPageUrl("AITrack")}>AI track</FooterLink>
            <FooterLink to={createPageUrl("APCS")}>AP CS</FooterLink>
            <FooterLink to={createPageUrl("Challenges")}>Compete</FooterLink>
            <FooterLink to={createPageUrl("Projects")}>Projects</FooterLink>
          </div>
        </div>
        <div>
          <h4 className="u-mono mb-4 text-xs uppercase tracking-widest text-[#2E8B7A]">About</h4>
          <div className="space-y-2">
            <FooterLink href="https://github.com/hweichen77-dot/compilearn">GitHub</FooterLink>
            <FooterLink href="mailto:jason.huang317235@gmail.com">Contact</FooterLink>
            <FooterLink to={createPageUrl("Privacy")}>Privacy</FooterLink>
            <FooterLink to={createPageUrl("Terms")}>Terms</FooterLink>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/60">
        © 2026 Compilearn. Learn by building.
        <p className="mt-2 leading-relaxed text-white/60">
          Independent project, not affiliated with or endorsed by the College Board. AP®
          and Advanced Placement® are registered trademarks of the College Board. AI
          output can be inaccurate, so verify before relying on it.
        </p>
      </div>
    </footer>
  );
}
