# CodeFlow growth: launch kit

The wedge is the **prompt-security playground**: a free, no-signup place to write a
defensive system prompt and see if it survives a battery of live attacks (prompt
injection, jailbreaks, hallucination, RAG grounding), with a shareable held/broken
score. Lead with *this one thing*, not "learn to code."

One-liner (use everywhere): **"Practice defending LLMs against real attacks. Free, no signup. Can your prompt survive?"**

Deep-link any challenge with `?lab=<id>` (e.g. `/Playground?lab=defuse-injection`) so shared links open that exact attack.

---

## The acquisition loop

1. Someone tries a challenge (no signup) → gets a score ("held 7/8 attacks").
2. Score has a **Share** button → posts "my prompt held 7/8, can you beat it? <link>".
3. Their followers click the link → land on the exact challenge → try it → share.

This only works if you seed round 1. The posts below are round 1.

---

## Show HN

**Title:** Show HN: A free playground to practice defending LLMs against prompt injection

**Body:**
I built a small tool for practicing prompt security. You get a scenario (a support
bot that keeps inventing order statuses, an assistant users try to jailbreak, a RAG
answer step that must not go outside its facts), you write a system prompt, and it
runs against a live model over a set of adversarial inputs. You get a held/broken
score per attack, not a "looks good" — it checks the model's actual output.

No signup, no API key, runs in the browser. Free.

I made it because every prompt-engineering course I tried explains prompts but never
puts yours under attack. The interesting part of shipping LLM features is whether
your prompt holds when someone tries to break it.

Link: <your URL>/Playground

Would love feedback on the scenarios and the grading — what attacks should I add?

---

## Reddit

**r/LocalLLaMA / r/MachineLearning / r/PromptEngineering**

**Title:** I made a free, no-signup playground to test if your system prompt survives prompt injection

**Body:**
Pick a scenario, write a defensive system prompt, and it runs against a live model
over a battery of attacks (injection, jailbreak, "ignore previous instructions",
hallucination, staying grounded in provided facts). You get a held/broken score for
each attack based on the model's real output.

No account, no API key. Curious how many of these you can get to hold on the first
try. The injection one ("defuse the prompt injection") is the fun one.

<your URL>/Playground?lab=defuse-injection

If you have a favorite injection technique that beats it, I want to add it as a new
attack.

---

## X / Twitter thread

1/ Most prompt-engineering practice is "write a prompt, looks fine." That's not how
it breaks in production. So I built a free playground where your system prompt gets
attacked by a live model and scored held/broken. No signup.

2/ Example: write a support-bot prompt that refuses to invent order info it doesn't
have. It runs 3 adversarial messages trying to make it hallucinate a tracking
number. You either hold all 3 or you don't.

3/ There's a prompt-injection one, a jailbreak one, a RAG-grounding one. Each gives
you a shareable score. Try to beat mine: <your URL>/Playground

4/ It's the practice I wanted when learning to ship LLM features. Feedback + new
attack ideas welcome.

---

## SEO targets

Pages already set meta for these; keep building content around them:
- "prompt injection practice"
- "LLM security exercises"
- "test system prompt against jailbreak"
- "prompt engineering practice free"
- "how to defend against prompt injection"

Consider one indexable page per lab (`/Playground?lab=<id>` → prerender a per-lab
title/description) so each attack ranks on its own.

---

## What NOT to say
- Don't claim "no one grades against live model behavior" — Anthropic's tutorial and
  Coddy already do. It's disprovable in one link and hurts credibility.
- Don't lead with "learn to code" or the AP CS / competitive tracks. That's the
  crowded, undifferentiated market. Lead with prompt security; the rest is depth
  someone discovers after they're in.
