export default {
  project: {
    id: "prod-09",
    title: "FAQ Support Bot",
    description:
      "Build a support bot that answers only from a small FAQ document you provide, refuses anything the docs don't cover, and always points back to the exact line it used. You'll stuff a doc into context, ground every answer in it, and harden the whole thing against cost blowups and bad output.",
    difficulty: "intermediate",
    category: "chatbots_agents",
    estimated_time: 130,
    lessons_count: 8,
    tags: ["rag", "grounding", "faq-bot", "citations", "prompting", "anthropic"],
    order: 109,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-09-1",
      project_id: "prod-09",
      order: 1,
      title: "Load the FAQ into Numbered Lines",
      concept: "loading and numbering the docs",
      explanation: `A support bot that "knows your product" doesn't actually know anything on its own. The model has never seen your FAQ. Every answer it gives has to come from text you hand it, in the same call, every single time. This lesson builds the first piece: turning a plain FAQ file into something the model can point back to.

## What we're building

By lesson 8 you'll have a bot that answers strictly from your own docs and says "I don't know" when the docs don't cover it. The whole system rests on one trick: instead of dumping the FAQ as one blob of text, you **number every line** before it goes anywhere near the model. A blob is just words; a numbered blob is an address book. Line 7 can be cited. Line 7 of an unnumbered wall of text cannot.

## Numbering the source

\`\`\`python
def load_faq(text):
    lines = text.strip().split("\\n")
    return [(i + 1, line) for i, line in enumerate(lines) if line.strip()]

faq_text = """Q: What are your hours?
A: We're open 9am-5pm Monday through Friday.
Q: Do you ship internationally?
A: No, we currently only ship within the US."""

faq = load_faq(faq_text)
for num, line in faq:
    print(num, line)
\`\`\`

Each entry is now a \`(line_number, text)\` pair. That's the whole trick for this lesson: nothing fancy, just an index. Later lessons will feed these numbered lines into the prompt and ask the model to name the line it used, which only works because you numbered them first.

## Why numbering instead of raw text

If you hand the model a raw FAQ and ask "cite your source," it will happily invent a plausible-sounding citation, a page number, a heading, anything, none of it checkable. A line number is different: it's a fact you control, not a story the model makes up. You can verify a cited line number in one line of Python: check it's in range and print what's actually there. That verifiability is the entire point of grounding a bot in your own docs instead of trusting it to "just know."

## Keeping the doc small on purpose

This project deliberately works with a **small** FAQ, a handful to a few dozen lines. That's not a limitation to work around later; it's the right scope for this build. Once a knowledge base grows past what comfortably fits in one prompt, you'd reach for a search step to pick the relevant chunk first (that's a different, larger project). Here, the whole FAQ fits in context every time, so there's no retrieval to get wrong, only grounding and refusal, which is what this project is actually teaching.

## The mental model to keep

Think of the FAQ as a numbered exhibit list before a trial. Nobody testifies from memory; every claim points at "Exhibit 7." Your job over the next few lessons is building the bot that only ever testifies from the exhibit list, and says "not in evidence" when it isn't there.`,
      starter_code: `# Turn a raw FAQ string into numbered (line_number, text) entries.
# No API call here, just the data shape the rest of the bot depends on.

def load_faq(text):
    # TODO: split text into lines, drop blank lines, and return a list of
    #       (line_number, line_text) tuples. Line numbers start at 1 and
    #       count ALL non-blank lines in order, including blanks skipped.
    pass

faq_text = """Q: What are your hours?
A: We're open 9am-5pm Monday through Friday.

Q: Do you ship internationally?
A: No, we currently only ship within the US."""

faq = load_faq(faq_text)
print("Entries:", len(faq))
`,
      solution_code: `# Turn a raw FAQ string into numbered (line_number, text) entries.
# No API call here, just the data shape the rest of the bot depends on.

def load_faq(text):
    lines = text.strip().split("\\n")
    numbered = []
    for i, line in enumerate(lines):
        if line.strip():
            numbered.append((i + 1, line.strip()))
    return numbered

faq_text = """Q: What are your hours?
A: We're open 9am-5pm Monday through Friday.

Q: Do you ship internationally?
A: No, we currently only ship within the US."""

faq = load_faq(faq_text)
print("Entries:", len(faq))
for num, line in faq:
    print(f"{num}: {line}")
`,
      hints: [
        "Split on '\\n', keep the original 1-based position from enumerate even for lines you skip.",
        "Use `if line.strip():` to skip blank lines without renumbering the ones you keep.",
        "Each kept entry is a tuple `(line_number, line_text)`, appended in order.",
      ],
      challenge_title: "Number the Exhibit List",
      challenge_description:
        "Parse a raw FAQ block into numbered non-blank lines, matching the exact line numbers a citation system would need.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    text = sys.stdin.read()
    lines = text.split("\\n")
    # parse done: 'lines' is every raw line from stdin, in order, 1-indexed by position

    # TODO: for each non-blank line (after stripping), print "N: text"
    #       where N is its 1-based position in 'lines' (blank lines keep
    #       their position but are not printed).
    # TODO: on the final line, print the total count of non-blank lines.

main()
`,
      challenge_solution_code: `import sys

def main():
    text = sys.stdin.read()
    lines = text.split("\\n")

    count = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped:
            print(f"{i + 1}: {stripped}")
            count += 1

    print(count)

main()
`,
      challenge_test_cases: [
        {
          input: "Q: hours?\nA: 9-5\n\nQ: ship?\nA: US only",
          expected_output: "1: Q: hours?\n2: A: 9-5\n4: Q: ship?\n5: A: US only\n4",
          description: "Blank line 3 is skipped but doesn't shift the numbering of later lines.",
        },
        {
          input: "single line",
          expected_output: "1: single line\n1",
          description: "Edge: one non-blank line, count is 1.",
        },
        {
          input: "\n\n",
          expected_output: "0",
          description: "Edge: only blank lines, count is 0 and nothing else prints.",
        },
      ],
    },
    {
      id: "prod-09-2",
      project_id: "prod-09",
      order: 2,
      title: "The Grounded-Answer Prompt",
      concept: "stuffing docs into context",
      explanation: `Now that the FAQ is numbered, wire it into a real prompt: the smallest version of the bot that answers a question using only the FAQ text you hand it. This is "stuffing" in the plain sense, you're literally stuffing the whole document into the system prompt.

## What context stuffing means

**Context stuffing** is the simplest way to ground a model in your own data: paste the entire source document into the prompt, then ask the question. There's no search step, no database, no embeddings, you just hand over everything and trust the model to read it. It only works because your FAQ is small enough to fit comfortably in one call. That's exactly the scope of this project.

## Building the system prompt

The system prompt carries two things: the numbered FAQ text, and strict instructions about how to use it.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def build_system_prompt(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    return f"""You are a support bot. Answer ONLY using the FAQ below.
FAQ:
{doc_block}

Rules:
- Base your answer only on the FAQ lines above.
- If the answer isn't in the FAQ, say so, don't guess.
"""

system = build_system_prompt(faq)

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=system,
    messages=[{"role": "user", "content": "What are your hours?"}],
)
print(resp.content[0].text)
\`\`\`

The FAQ lives in \`system\` because it's the standing reference material for every question in this session, not a one-off message. The user's actual question goes in \`messages\`, same split you've used in every project so far: config on one channel, live input on the other.

## Why the wording of the rules matters

"Answer using the FAQ" alone is too soft, the model will still reach for its general knowledge if the FAQ is thin. Two things tighten it:

1. **"ONLY"** in the system prompt, repeated in the rules. Redundancy here is deliberate; a single soft instruction gets ignored more often than a rule stated twice.
2. **An explicit instruction for the "not covered" case.** Without it, the model fills gaps with plausible-sounding invented answers instead of admitting the FAQ is silent. Lesson 4 turns this into a real, checkable refusal; for now the point is just to plant the instruction.

## The mental model to keep

Picture handing someone a single-page reference sheet and saying "answer questions using only this page." That's the entire system prompt: FAQ text plus a leash. Every later lesson tightens the leash, adding a strict refusal (lesson 4) and a citation requirement (lesson 5), but the shape you're building right now, doc in the system prompt, question in messages, never changes.`,
      starter_code: `# Build the system prompt that stuffs a numbered FAQ into context.
# No API call, just the string construction the real bot depends on.

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

def build_system_prompt(numbered_faq):
    # TODO: join each (num, line) into "num: line" strings, one per row,
    #       joined by "\\n", then wrap in a system prompt string that:
    #       - tells the model it's a support bot
    #       - includes the doc block under a "FAQ:" heading
    #       - says to answer ONLY from the FAQ and to say so if it's missing
    pass

system = build_system_prompt(faq)
print("FAQ" in system)
print("ONLY" in system)
print(system.count("\\n"))
`,
      solution_code: `# Build the system prompt that stuffs a numbered FAQ into context.
# No API call, just the string construction the real bot depends on.

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

def build_system_prompt(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    return f"""You are a support bot. Answer ONLY using the FAQ below.
FAQ:
{doc_block}

Rules:
- Base your answer only on the FAQ lines above.
- If the answer isn't in the FAQ, say so, don't guess.
"""

system = build_system_prompt(faq)
print("FAQ" in system)
print("ONLY" in system)
print(system.count("\\n"))
`,
      hints: [
        "Build the doc_block first with a join over f'{num}: {line}' for each entry.",
        "Use an f-string or .format for the outer template so doc_block drops cleanly into the middle.",
        "Both 'FAQ' and 'ONLY' need to literally appear in the returned string for the checks to pass.",
      ],
      challenge_title: "Stuff the Context Budget",
      challenge_description:
        "Decide whether a numbered FAQ fits inside a fixed character budget once wrapped in the system prompt template.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    lines = data[2:2 + n]
    # parse done: 'budget' is the max allowed system prompt length in chars,
    #             'lines' are the n raw FAQ lines in order (already non-blank)

    # TODO: number the lines starting at 1, join as "num: line" with "\\n"
    #       between them to form doc_block.
    # TODO: wrap it as: "FAQ:\\n" + doc_block  (this is the full stuffed text)
    # TODO: print "FITS" if len(wrapped) <= budget else "OVERFLOW"
    # TODO: on the next line print len(wrapped)

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    lines = data[2:2 + n]

    doc_block = "\\n".join(f"{i + 1}: {line}" for i, line in enumerate(lines))
    wrapped = "FAQ:\\n" + doc_block

    print("FITS" if len(wrapped) <= budget else "OVERFLOW")
    print(len(wrapped))

main()
`,
      challenge_test_cases: [
        {
          input: "40\n2\nQ: hours?\nA: 9-5",
          expected_output: "FITS\n27",
          description: "'FAQ:\\n1: Q: hours?\\n2: A: 9-5' is 27 chars, under the 40 budget.",
        },
        {
          input: "10\n2\nQ: hours?\nA: 9-5",
          expected_output: "OVERFLOW\n27",
          description: "Same 27-char doc, but the budget of 10 is too small.",
        },
        {
          input: "5\n0\n",
          expected_output: "FITS\n5",
          description: "Edge: no FAQ lines, wrapped text is just 'FAQ:\\n' at 5 chars.",
        },
      ],
    },
    {
      id: "prod-09-3",
      project_id: "prod-09",
      order: 3,
      title: "Matching a Question to a Line",
      concept: "keyword grounding check",
      explanation: `Before you trust the model's answer, you need a way to check it yourself: does this question actually connect to something in the FAQ, or is it about to answer from thin air? This lesson builds a plain-Python grounding check that runs *before* you ever call the model, a first line of defense that costs nothing and catches the obvious misses.

## Why check before calling the model

The model can be told "only use the FAQ" and still occasionally wander. Rather than relying on instructions alone, you build a **pre-check**: a keyword overlap test between the user's question and each FAQ line. If nothing overlaps, you already know the FAQ doesn't cover this, and you can skip the call entirely or flag the answer as unsupported before it even ships. This is the same instinct as lesson 5 in the playbook module, verify before you trust, applied specifically to grounding.

## A simple overlap score

\`\`\`python
import re

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = None, 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score
\`\`\`

\`best_match\` returns the line number with the most overlapping keywords, and the score itself. A score of 0 means no FAQ line shares a single meaningful word with the question, a strong signal the FAQ simply doesn't cover it.

## What this buys you

This isn't a substitute for the model reading the FAQ, it's a cheap, deterministic sanity check that runs in pure Python with no network call. Three things fall out of it:

- **A candidate citation.** Whatever line scores highest is your best guess at "the line this question is about," useful for lesson 5's citation requirement.
- **An early refusal signal.** Score of 0 across every line means you can refuse before spending a single token on an API call.
- **A tie-breaker for ambiguous questions.** If two lines tie, you know the question is genuinely ambiguous and might need a different reply than a single confident answer.

## The mental model to keep

Think of this as the bouncer who checks a list before the client (the model) even talks to the customer. The bouncer isn't perfect, it works on keyword overlap, not real understanding, but it stops the cheapest, most obvious mismatches before they cost you a call or an invented answer. Real grounding will always be the model reading the actual FAQ text; this keyword check is the fast, free layer in front of it.`,
      starter_code: `# Score how well a question overlaps with each FAQ line, pure Python.
import re

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    # TODO: compute keywords(question), then for each (num, line) compute
    #       the size of the intersection with keywords(line). Return the
    #       (line_number, score) of the highest-scoring line. If all scores
    #       are 0, still return the top entry's number with score 0.
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

print(best_match("When are you open?", faq))
`,
      solution_code: `# Score how well a question overlaps with each FAQ line, pure Python.
import re

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

print(best_match("When are you open?", faq))
print(best_match("Do you have a store in France?", faq))
`,
      hints: [
        "Reuse keywords() on both the question and each FAQ line, then take the set intersection length as the score.",
        "Track the running best as (num, score) and only replace it on a strictly greater score.",
        "Default to the first FAQ line's number with score 0 so the function never returns None.",
      ],
      challenge_title: "Best-Match Line Finder",
      challenge_description:
        "Find which FAQ line shares the most keywords with a question, pure set-overlap scoring with no model call.",
      challenge_language: "python",
      challenge_starter_code: `import sys, re

STOP = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we", "does"}

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {w for w in words if w not in STOP and len(w) > 2}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    faq_lines = data[1:1 + n]
    question = data[1 + n]
    # parse done: faq_lines are n FAQ lines (1-indexed by position), question is the query

    # TODO: score each faq_lines[i] against the question using keyword overlap size.
    # TODO: print the 1-based line number of the best match, then its score,
    #       space-separated on one line. On ties, print the EARLIEST line number.
    #       If every score is 0, still print line 1 and score 0.

main()
`,
      challenge_solution_code: `import sys, re

STOP = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we", "does"}

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {w for w in words if w not in STOP and len(w) > 2}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    faq_lines = data[1:1 + n]
    question = data[1 + n]

    q_words = keywords(question)
    best_num, best_score = 1, 0
    for i, line in enumerate(faq_lines):
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = i + 1, score

    print(best_num, best_score)

main()
`,
      challenge_test_cases: [
        {
          input: "4\nQ: What are your hours?\nA: We're open 9am-5pm Monday through Friday.\nQ: Do you ship internationally?\nA: No, we currently only ship within the US.\nWhen are you open?",
          expected_output: "2 1",
          description: "'open' overlaps with line 2's answer wording, best score 1 at line 2.",
        },
        {
          input: "2\nQ: Do you ship internationally?\nA: No, only within the US.\nWhat is your refund policy?",
          expected_output: "1 0",
          description: "No keyword overlap anywhere; defaults to line 1 with score 0.",
        },
        {
          input: "2\nship ship ship\nship ship ship\nWe ship things",
          expected_output: "1 1",
          description: "Edge: a tie between two equal-scoring lines resolves to the earliest line number.",
        },
      ],
    },
    {
      id: "prod-09-4",
      project_id: "prod-09",
      order: 4,
      title: "Refusing What's Not There",
      concept: "refusing unsupported questions",
      explanation: `The single most important behavior of this bot isn't answering well, it's knowing when to say **no**. A support bot that confidently answers a question your FAQ never covered is worse than useless, it's actively misleading. This lesson builds the refusal path: a strict, checkable rule for when the bot should decline.

## What "refusal" means here

**Refusal** is the bot recognizing a question falls outside its FAQ and returning a fixed, honest "I don't have that in my docs" response instead of guessing. This has to be reliable in two places at once:

1. **In the prompt.** Tell the model explicitly what to say when it's not covered, and give it an exact phrase to use.
2. **In your own code.** Don't just trust the model's judgment, use the keyword pre-check from lesson 3 as a second layer that can force a refusal even if the model tries to answer anyway.

## Prompting for a strict refusal

\`\`\`python
REFUSAL = "I don't have that information in my FAQ."

def build_system_prompt(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    return f"""You are a support bot. Answer ONLY using the FAQ below.
FAQ:
{doc_block}

Rules:
- Base your answer only on the FAQ lines above.
- If the FAQ does not cover the question, reply with EXACTLY this sentence
  and nothing else: "{REFUSAL}"
- Never guess, never use outside knowledge, never apologize at length.
"""
\`\`\`

Giving the model an **exact string** to use for refusal, instead of "say you don't know," does two things: it makes refusals recognizable in code (\`if reply == REFUSAL\`), and it removes room for the model to hedge with a half-answer that sounds like a refusal but sneaks in a guess.

## Backing it up in code

The prompt alone is a soft guarantee, models sometimes ignore instructions. So you layer the lesson-3 keyword check as a hard guarantee:

\`\`\`python
def answer(question, numbered_faq, model_reply):
    _, score = best_match(question, numbered_faq)
    if score == 0:
        return REFUSAL
    return model_reply
\`\`\`

If the keyword overlap is zero, you **override** whatever the model said and force the refusal yourself. This is defense in depth: the prompt asks nicely, the code enforces it. Even a model that ignores the system prompt entirely can't get an unsupported answer past this check.

## Why this is the core of the whole product

Everything else in this project, numbering, stuffing, citing, is in service of this one behavior: never say something your docs don't back up. A bot that answers 80% of questions correctly and confidently makes up the other 20% is unusable in support, because a user can't tell which 20% to distrust. A bot that answers correctly or clearly says "I don't know" is trustworthy even when it can't help, which is the actual bar for shipping something like this.

## The mental model to keep

Think of the refusal as a circuit breaker, it isn't there to prevent every possible mistake, it's there to fail safe. The keyword check trips the breaker on the obvious misses; the model's own instructions catch subtler ones. Both exist because either one alone would eventually let something through.`,
      starter_code: `# Combine a model reply with a keyword grounding check to enforce refusal.
import re

REFUSAL = "I don't have that information in my FAQ."

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def answer(question, numbered_faq, model_reply):
    # TODO: if best_match's score is 0, return REFUSAL regardless of
    #       model_reply. Otherwise return model_reply unchanged.
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(answer("When are you open?", faq, "We're open 9am-5pm Mon-Fri."))
print(answer("Do you sell gift cards?", faq, "Yes! We offer $25 and $50 gift cards."))
`,
      solution_code: `# Combine a model reply with a keyword grounding check to enforce refusal.
import re

REFUSAL = "I don't have that information in my FAQ."

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def answer(question, numbered_faq, model_reply):
    _, score = best_match(question, numbered_faq)
    if score == 0:
        return REFUSAL
    return model_reply

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(answer("When are you open?", faq, "We're open 9am-5pm Mon-Fri."))
print(answer("Do you sell gift cards?", faq, "Yes! We offer $25 and $50 gift cards."))
`,
      hints: [
        "Reuse best_match exactly as before; you only need its score, so unpack with `_, score =`.",
        "The override is a single if: score == 0 means force REFUSAL no matter what model_reply says.",
        "Don't try to inspect model_reply's wording, the enforcement is purely based on the keyword score.",
      ],
      challenge_title: "Force the Circuit Breaker",
      challenge_description:
        "Given a proposed model reply and a grounding score, decide whether to trust the reply or force the fixed refusal string.",
      challenge_language: "python",
      challenge_starter_code: `import sys

REFUSAL = "I don't have that information in my FAQ."

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    results = []
    for i in range(n):
        score_str, reply = data[1 + i].split(" ", 1)
        score = int(score_str)
        # TODO: if score == 0, the final answer is REFUSAL; otherwise it's reply.
        # TODO: append the final answer for this case to results.
    for r in results:
        print(r)

main()
`,
      challenge_solution_code: `import sys

REFUSAL = "I don't have that information in my FAQ."

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    results = []
    for i in range(n):
        score_str, reply = data[1 + i].split(" ", 1)
        score = int(score_str)
        results.append(REFUSAL if score == 0 else reply)
    for r in results:
        print(r)

main()
`,
      challenge_test_cases: [
        {
          input: "2\n3 We're open 9am-5pm.\n0 Yes we sell gift cards!",
          expected_output: "We're open 9am-5pm.\nI don't have that information in my FAQ.",
          description: "First has grounding score 3, kept; second scores 0, forced refusal.",
        },
        {
          input: "1\n5 Ships within the US only.",
          expected_output: "Ships within the US only.",
          description: "Positive score always passes the reply through unchanged.",
        },
        {
          input: "1\n0 Confident but ungrounded guess.",
          expected_output: "I don't have that information in my FAQ.",
          description: "Edge: score of exactly 0 always forces the refusal string.",
        },
      ],
    },
    {
      id: "prod-09-5",
      project_id: "prod-09",
      order: 5,
      title: "Citing the Source Line",
      concept: "citing the source line",
      explanation: `An answer without a citation asks the user to trust you. An answer with a citation lets them check you. This lesson adds the last core piece: every non-refused answer names the exact FAQ line it came from, and you verify that line number is real before showing it to anyone.

## What we're adding

You'll change the prompt to require a citation in a fixed, parseable format, then write a Python check that confirms the cited line actually exists and is one of the lines the model was shown. A citation the model invents (a line number that doesn't exist) is exactly as dangerous as an invented fact, so it gets the same treatment: verify, don't trust.

## Prompting for a structured citation

\`\`\`python
def build_system_prompt(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    return f"""You are a support bot. Answer ONLY using the FAQ below.
FAQ:
{doc_block}

Rules:
- Answer in ONE sentence, then a citation on its own line: "Source: line N"
  where N is the FAQ line number your answer came from.
- If the FAQ does not cover the question, reply with EXACTLY:
  "I don't have that information in my FAQ."
"""

# Expected model reply shape:
# "We're open 9am-5pm Monday through Friday.\\nSource: line 2"
\`\`\`

Asking for a fixed literal format, \`"Source: line N"\`, is what makes this checkable at all. If you instead asked "cite your source" with no format, you'd get free-text citations in a dozen different phrasings, impossible to parse reliably.

## Parsing and verifying the citation

\`\`\`python
import re

def parse_citation(reply):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return None
    return int(match.group(1))

def verify_citation(reply, numbered_faq):
    cited = parse_citation(reply)
    valid_numbers = {num for num, _ in numbered_faq}
    if cited is None:
        return False, "no citation found"
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited
\`\`\`

\`verify_citation\` returns a clean pass/fail plus either the verified line number or why it failed. Two distinct failure modes matter here: **no citation at all** (the model ignored the format) and **a citation to a line that doesn't exist** (the model hallucinated a number). Both are bugs worth catching before the answer reaches a user, and both are now one function call to detect.

## Why citation-checking, not just citation-asking

Asking the model to cite is a prompting trick; verifying the citation is a code guarantee. The distinction matters because a model under load, or given an ambiguous question, will sometimes cite line 12 when line 12 doesn't exist in a 9-line FAQ. Catching that with one \`in\` check is nearly free, and it's the difference between a bot that merely *looks* trustworthy and one that actually is.

## The mental model to keep

Every non-refused answer now carries a receipt. You don't have to re-read the whole FAQ to trust the bot, you check the receipt: does this line number exist, and does it say roughly what the bot claimed? That receipt is what turns "the bot said so" into "the bot said so, and here's exactly where."`,
      starter_code: `# Parse and verify a "Source: line N" citation against the real FAQ.
import re

def parse_citation(reply):
    # TODO: use re.search to find "Source: line N" and return N as an int,
    #       or None if the pattern isn't found.
    pass

def verify_citation(reply, numbered_faq):
    # TODO: call parse_citation. If None, return (False, "no citation found").
    #       If the number isn't among numbered_faq's line numbers, return
    #       (False, f"line {cited} doesn't exist in this FAQ").
    #       Otherwise return (True, cited).
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

reply = "We're open 9am-5pm Monday through Friday.\\nSource: line 2"
print(verify_citation(reply, faq))

bad_reply = "We're open every day.\\nSource: line 9"
print(verify_citation(bad_reply, faq))
`,
      solution_code: `# Parse and verify a "Source: line N" citation against the real FAQ.
import re

def parse_citation(reply):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return None
    return int(match.group(1))

def verify_citation(reply, numbered_faq):
    cited = parse_citation(reply)
    valid_numbers = {num for num, _ in numbered_faq}
    if cited is None:
        return False, "no citation found"
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

reply = "We're open 9am-5pm Monday through Friday.\\nSource: line 2"
print(verify_citation(reply, faq))

bad_reply = "We're open every day.\\nSource: line 9"
print(verify_citation(bad_reply, faq))

no_cite = "We're open 9am-5pm Monday through Friday."
print(verify_citation(no_cite, faq))
`,
      hints: [
        "The regex r'Source: line (\\\\d+)' with re.search captures the digits in group(1).",
        "Build valid_numbers as a set comprehension over numbered_faq before checking membership.",
        "Check `cited is None` before checking `cited not in valid_numbers`, order matters for correctness.",
      ],
      challenge_title: "Verify the Receipt",
      challenge_description:
        "Parse a 'Source: line N' citation out of a reply and check it against the real FAQ line count.",
      challenge_language: "python",
      challenge_starter_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    faq_size = int(data[0].strip())
    reply = data[1]
    # parse done: faq_size is how many lines exist (numbered 1..faq_size), reply is the model text

    # TODO: search reply for "Source: line N" using a regex.
    # TODO: if not found, print "NO_CITATION".
    # TODO: if found but N is not in 1..faq_size, print "INVALID N".
    # TODO: if found and valid, print "VALID N".

main()
`,
      challenge_solution_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    faq_size = int(data[0].strip())
    reply = data[1]

    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        print("NO_CITATION")
        return

    n = int(match.group(1))
    if n < 1 or n > faq_size:
        print("INVALID", n)
    else:
        print("VALID", n)

main()
`,
      challenge_test_cases: [
        {
          input: "4\nWe're open weekdays.\\nSource: line 2",
          expected_output: "VALID 2",
          description: "Line 2 exists within the 4-line FAQ, so the citation is valid.",
        },
        {
          input: "4\nWe ship worldwide.\\nSource: line 9",
          expected_output: "INVALID 9",
          description: "Line 9 doesn't exist in a 4-line FAQ; citation is out of range.",
        },
        {
          input: "3\nWe're open weekdays, trust me.",
          expected_output: "NO_CITATION",
          description: "Edge: no 'Source: line N' pattern present at all.",
        },
      ],
    },
    {
      id: "prod-09-6",
      project_id: "prod-09",
      order: 6,
      title: "Off-Topic and Malformed Input",
      concept: "handling off-topic and malformed replies",
      explanation: `Real users don't ask clean questions. They ask about the weather, paste in three questions at once, submit an empty string, or the model itself replies in a shape you didn't ask for. This lesson hardens the bot against the messy middle: inputs and outputs that aren't wrong exactly, just not what you planned for.

## Three categories of mess

1. **Off-topic input.** "What's your favorite movie?" isn't a support question at all. The keyword check from lesson 3 already scores this near zero against a real FAQ, so it naturally routes to refusal, but it's worth being explicit that off-topic and unsupported-but-on-topic get the same treatment: refuse.
2. **Empty or junk input.** A blank question, or one that's just whitespace or punctuation, has no keywords at all. \`keywords("")\` returns an empty set, which means every score against it is 0, safe by construction, but only if you check for it before doing anything expensive.
3. **Malformed model output.** The model is supposed to answer in one sentence plus a citation line. Sometimes it won't: it might skip the citation, add extra commentary, or wrap the answer in markdown. Your citation-parsing code from lesson 5 already treats "no citation found" as a distinct, handleable case rather than crashing.

## A guarded answer function

\`\`\`python
def guarded_answer(question, numbered_faq, model_reply):
    if not question or not question.strip():
        return REFUSAL, None

    _, score = best_match(question, numbered_faq)
    if score == 0:
        return REFUSAL, None

    ok, result = verify_citation(model_reply, numbered_faq)
    if not ok:
        return REFUSAL, result  # treat an unverifiable citation as unsupported
    return model_reply, result
\`\`\`

Notice the shape: every failure path, empty input, zero keyword overlap, bad or missing citation, converges on the same \`REFUSAL\` output. There's exactly one way to say "I can help" and several distinct ways to say "I can't," and all of them are explicit checks rather than places where the code might silently do the wrong thing.

## Why converge on one refusal path

A bot with five different failure messages ("hmm", "unclear", "error", "not sure", "invalid") looks broken. A bot with one clean, consistent refusal message looks intentional, like it's designed to say "no" cleanly rather than accidentally producing garbage. Users trust a firm, consistent "I don't know" far more than an inconsistent one that sometimes glitches.

## Logging the reason, even if the user doesn't see it

The second return value in \`guarded_answer\`, the reason or citation, isn't shown to the user, it's for you. When you're debugging why the bot refused something it should have answered, "score was 0" versus "citation was invalid" versus "input was empty" are three very different bugs to chase. Keep that detail even though the user-facing message stays identical.

## The mental model to keep

Hardening isn't adding more ways to answer, it's making every way to *not* answer converge on one calm, predictable response. The bot should never look confused. It should look like it made a decision, because it did.`,
      starter_code: `# Guard the answer path against empty input, low grounding, and bad citations.
import re

REFUSAL = "I don't have that information in my FAQ."

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def verify_citation(reply, numbered_faq):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return False, "no citation found"
    cited = int(match.group(1))
    valid_numbers = {num for num, _ in numbered_faq}
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited

def guarded_answer(question, numbered_faq, model_reply):
    # TODO: if question is empty/whitespace, return (REFUSAL, None)
    # TODO: if best_match's score is 0, return (REFUSAL, None)
    # TODO: verify_citation on model_reply; if it fails, return (REFUSAL, reason)
    # TODO: otherwise return (model_reply, cited_line_number)
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(guarded_answer("", faq, "irrelevant"))
print(guarded_answer("What's your favorite color?", faq, "Blue, obviously."))
print(guarded_answer("When are you open?", faq, "We're open 9-5.\\nSource: line 2"))
`,
      solution_code: `# Guard the answer path against empty input, low grounding, and bad citations.
import re

REFUSAL = "I don't have that information in my FAQ."

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def verify_citation(reply, numbered_faq):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return False, "no citation found"
    cited = int(match.group(1))
    valid_numbers = {num for num, _ in numbered_faq}
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited

def guarded_answer(question, numbered_faq, model_reply):
    if not question or not question.strip():
        return REFUSAL, None

    _, score = best_match(question, numbered_faq)
    if score == 0:
        return REFUSAL, None

    ok, result = verify_citation(model_reply, numbered_faq)
    if not ok:
        return REFUSAL, result
    return model_reply, result

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(guarded_answer("", faq, "irrelevant"))
print(guarded_answer("What's your favorite color?", faq, "Blue, obviously."))
print(guarded_answer("When are you open?", faq, "We're open 9-5.\\nSource: line 2"))
`,
      hints: [
        "Check empty input FIRST, before touching keyword scoring, so best_match never runs on ''.",
        "The three guard checks are independent ifs, each one that fails returns immediately.",
        "Only the final success path returns (model_reply, cited_number); every other path returns REFUSAL plus a reason or None.",
      ],
      challenge_title: "One Clean Refusal Path",
      challenge_description:
        "Route a question through empty-check, grounding-score-check, and citation-check, converging every failure on one refusal string.",
      challenge_language: "python",
      challenge_starter_code: `import sys

REFUSAL = "REFUSED"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(n):
        parts = data[1 + i].split("|")
        question = parts[0]
        score = int(parts[1])
        citation_ok = parts[2]  # "OK" or "BAD"
        # TODO: if question is empty/whitespace -> print REFUSAL, continue
        # TODO: elif score == 0 -> print REFUSAL, continue
        # TODO: elif citation_ok != "OK" -> print REFUSAL, continue
        # TODO: else -> print "ANSWERED"

main()
`,
      challenge_solution_code: `import sys

REFUSAL = "REFUSED"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(n):
        parts = data[1 + i].split("|")
        question = parts[0]
        score = int(parts[1])
        citation_ok = parts[2]

        if not question.strip():
            print(REFUSAL)
        elif score == 0:
            print(REFUSAL)
        elif citation_ok != "OK":
            print(REFUSAL)
        else:
            print("ANSWERED")

main()
`,
      challenge_test_cases: [
        {
          input: "3\n|2|OK\nWhat time?|0|OK\nWhen open?|3|BAD",
          expected_output: "REFUSED\nREFUSED\nREFUSED",
          description: "Empty question, zero score, and bad citation each independently force refusal.",
        },
        {
          input: "1\nWhen open?|3|OK",
          expected_output: "ANSWERED",
          description: "Non-empty question, positive score, and a good citation all pass through.",
        },
        {
          input: "1\n   |5|OK",
          expected_output: "REFUSED",
          description: "Edge: whitespace-only question counts as empty and refuses.",
        },
      ],
    },
    {
      id: "prod-09-7",
      project_id: "prod-09",
      order: 7,
      title: "Watching Cost as the FAQ Grows",
      concept: "cost and token budget",
      explanation: `Context stuffing works beautifully at 10 FAQ lines and gets expensive fast at 500. Because every question resends the *entire* FAQ, the cost of this bot scales with how big your docs are, not how big the question is. This lesson builds the budget check that catches an FAQ before it grows past what's sane to stuff.

## Why cost scales with the doc, not the question

Every single call to this bot sends the full numbered FAQ in the system prompt, then a short question in messages. A one-word question and a ten-word question cost almost the same, because the FAQ dominates the token count. That means the lever you actually control is **how big the FAQ is allowed to get**, not how you phrase questions.

## Estimating the cost per call

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

def estimate_call_cost(numbered_faq, question, system_template_overhead=60):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    faq_tokens = estimate_tokens(doc_block)
    question_tokens = estimate_tokens(question)
    return faq_tokens + question_tokens + system_template_overhead
\`\`\`

\`system_template_overhead\` accounts for the fixed wording around the FAQ, the rules, the "You are a support bot" framing, tokens that exist on every call regardless of doc size. Add it in explicitly rather than pretending the template is free.

## Setting a hard ceiling

\`\`\`python
FAQ_TOKEN_BUDGET = 2000

def check_faq_budget(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    tokens = estimate_tokens(doc_block)
    if tokens > FAQ_TOKEN_BUDGET:
        raise ValueError(
            f"FAQ is {tokens} tokens, over the {FAQ_TOKEN_BUDGET} budget. "
            "Split it or switch to a retrieval-based design."
        )
    return tokens
\`\`\`

This check runs once when the FAQ loads, not on every question, since the doc size doesn't change per call. If it fails, that's not a bug to patch, it's a signal you've outgrown context stuffing and need the retrieval step this project deliberately left out (see lesson 1). Raising loudly here is better than silently sending an enormous, expensive prompt on every single question forever.

## Why a hard ceiling instead of a soft warning

A warning gets ignored. A raised exception forces a decision at the moment the FAQ is edited, right when a human is looking at it, rather than surfacing as a slow-creeping bill three weeks later. Cost bugs are uniquely bad because nothing looks broken, the bot still answers correctly, it just quietly costs ten times what it should. Catching it at load time, loudly, is the cheap fix.

## The mental model to keep

Every call to this bot is billed for the whole reference sheet, not just the question asked. That's fine at FAQ size 20; it becomes a real problem at FAQ size 2000. The budget check is a smoke alarm for that specific failure mode: cheap to install, easy to ignore until it matters, and the one check standing between "small doc, small bill" and a bill nobody predicted.`,
      starter_code: `# Estimate token cost per call and enforce a hard FAQ size budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

FAQ_TOKEN_BUDGET = 50

def estimate_call_cost(numbered_faq, question, system_template_overhead=10):
    # TODO: build doc_block by joining "num: line" entries with "\\n",
    #       then return estimate_tokens(doc_block) + estimate_tokens(question)
    #       + system_template_overhead.
    pass

def check_faq_budget(numbered_faq):
    # TODO: build doc_block the same way, estimate its tokens, and raise
    #       ValueError if tokens > FAQ_TOKEN_BUDGET. Otherwise return the
    #       token count.
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(estimate_call_cost(faq, "When are you open?"))
print(check_faq_budget(faq))
`,
      solution_code: `# Estimate token cost per call and enforce a hard FAQ size budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

FAQ_TOKEN_BUDGET = 50

def estimate_call_cost(numbered_faq, question, system_template_overhead=10):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    return estimate_tokens(doc_block) + estimate_tokens(question) + system_template_overhead

def check_faq_budget(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    tokens = estimate_tokens(doc_block)
    if tokens > FAQ_TOKEN_BUDGET:
        raise ValueError(
            f"FAQ is {tokens} tokens, over the {FAQ_TOKEN_BUDGET} budget. "
            "Split it or switch to a retrieval-based design."
        )
    return tokens

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
]

print(estimate_call_cost(faq, "When are you open?"))
print(check_faq_budget(faq))

big_faq = [(i, "x" * 40) for i in range(1, 20)]
try:
    check_faq_budget(big_faq)
except ValueError as e:
    print("Blocked:", e)
`,
      hints: [
        "Both functions share the same doc_block construction, build it identically in each.",
        "estimate_call_cost sums three token estimates: doc_block, question, and the fixed overhead.",
        "check_faq_budget compares tokens to FAQ_TOKEN_BUDGET with a strict `>` before raising.",
      ],
      challenge_title: "Enforce the FAQ Token Ceiling",
      challenge_description:
        "Estimate a numbered FAQ's token cost and decide whether it fits a hard budget before it's ever sent to the model.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    lines = data[2:2 + n]
    # parse done: 'budget' is the token ceiling, 'lines' are n raw FAQ lines in order

    # TODO: build doc_block as "num: line" entries (1-indexed) joined by "\\n"
    # TODO: compute tokens = estimate_tokens(doc_block)
    # TODO: print "OK" then tokens if tokens <= budget, else print "BLOCKED" then tokens

main()
`,
      challenge_solution_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    lines = data[2:2 + n]

    doc_block = "\\n".join(f"{i + 1}: {line}" for i, line in enumerate(lines))
    tokens = estimate_tokens(doc_block)

    if tokens <= budget:
        print("OK")
    else:
        print("BLOCKED")
    print(tokens)

main()
`,
      challenge_test_cases: [
        {
          input: "20\n2\nQ: hours?\nA: 9-5",
          expected_output: "OK\n5",
          description: "'1: Q: hours?\\n2: A: 9-5' is 21 chars -> 21//4 = 5 tokens, within budget 20.",
        },
        {
          input: "3\n2\nQ: hours?\nA: 9-5",
          expected_output: "BLOCKED\n5",
          description: "Same 5-token doc, but the budget of 3 is too small.",
        },
        {
          input: "1\n0\n",
          expected_output: "OK\n1",
          description: "Edge: empty FAQ gives an empty doc_block, floor of 1 token, still fits any budget >= 1.",
        },
      ],
    },
    {
      id: "prod-09-8",
      project_id: "prod-09",
      order: 8,
      title: "Ship the Support Bot",
      concept: "shipping the finished bot",
      explanation: `Every piece is built: numbering, stuffing, keyword grounding, strict refusal, citation verification, and a cost ceiling. This lesson wires them into one function you'd actually run, and closes out the project.

## The full pipeline, in order

\`\`\`python
import os, re
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
REFUSAL = "I don't have that information in my FAQ."

def answer_question(question, numbered_faq):
    check_faq_budget(numbered_faq)           # lesson 7: cost ceiling, raises if too big

    if not question or not question.strip(): # lesson 6: empty input guard
        return REFUSAL, None

    _, score = best_match(question, numbered_faq)  # lesson 3: keyword pre-check
    if score == 0:
        return REFUSAL, None

    system = build_system_prompt(numbered_faq)      # lesson 2: context stuffing
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=system,
        messages=[{"role": "user", "content": question}],
    )
    reply = resp.content[0].text

    ok, result = verify_citation(reply, numbered_faq)  # lesson 5: citation check
    if not ok:
        return REFUSAL, result
    return reply, result
\`\`\`

Read it top to bottom and you can see the whole project as one straight line: check the budget once, guard the input, pre-check grounding cheaply before spending a token, call the model with the stuffed FAQ, then verify what came back before trusting it. Nothing here is new, lesson 8 is assembly, not invention.

## What "done" means for this bot

- It runs from a clean start: load an FAQ file, call \`answer_question\` in a loop reading from stdin.
- It never answers from outside the FAQ, verified twice over, once by keyword pre-check, once by citation verification.
- Every real answer names its line; every refusal is the identical, calm string.
- A too-large FAQ fails loudly at load time instead of quietly ballooning your bill.

If those four hold, this is a shippable support bot, not a demo that happens to work on the examples you tried.

## Where this fits, and where it doesn't

This design is right for a small, stable FAQ: a handful to a few dozen entries that don't change every day. It is intentionally the wrong tool for a large, growing knowledge base, that's a retrieval system's job, picking the relevant few chunks out of thousands before ever touching the model. Knowing the boundary of what you built is as much a part of shipping as the code itself: this bot is honest about what it can answer, and just as honest about the fact that it wasn't built to scale past a small FAQ.

## Your Portfolio

Finishing this lesson saves **FAQ Support Bot** to your Portfolio, alongside anything else you've built in this track. You now have a working example of the pattern underneath every "chat with your docs" product you'll ever see: stuff, ground, cite, refuse. Every fancier version, embeddings, vector search, multi-document retrieval, is the same four moves with a smarter first step. You already know the last three.`,
      starter_code: `# Assemble the full guarded pipeline, pure Python simulation (no network call).
import re

REFUSAL = "I don't have that information in my FAQ."
FAQ_TOKEN_BUDGET = 200

def estimate_tokens(text):
    return max(1, len(text) // 4)

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def verify_citation(reply, numbered_faq):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return False, "no citation found"
    cited = int(match.group(1))
    valid_numbers = {num for num, _ in numbered_faq}
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited

def check_faq_budget(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    tokens = estimate_tokens(doc_block)
    if tokens > FAQ_TOKEN_BUDGET:
        raise ValueError(f"FAQ is {tokens} tokens, over budget {FAQ_TOKEN_BUDGET}")
    return tokens

def answer_question(question, numbered_faq, fake_model_reply):
    # TODO: 1. check_faq_budget(numbered_faq) first (lets it raise if too big)
    # TODO: 2. if question empty/whitespace -> return (REFUSAL, None)
    # TODO: 3. best_match; if score == 0 -> return (REFUSAL, None)
    # TODO: 4. verify_citation(fake_model_reply, numbered_faq); if not ok ->
    #          return (REFUSAL, reason)
    # TODO: 5. otherwise return (fake_model_reply, cited_number)
    pass

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

print(answer_question("When are you open?", faq, "We're open 9-5.\\nSource: line 2"))
print(answer_question("What's your favorite band?", faq, "Queen, obviously."))
`,
      solution_code: `# Assemble the full guarded pipeline, pure Python simulation (no network call).
import re

REFUSAL = "I don't have that information in my FAQ."
FAQ_TOKEN_BUDGET = 200

def estimate_tokens(text):
    return max(1, len(text) // 4)

def keywords(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    stop = {"a", "an", "the", "is", "are", "do", "you", "your", "what", "we"}
    return {w for w in words if w not in stop and len(w) > 2}

def best_match(question, numbered_faq):
    q_words = keywords(question)
    best_num, best_score = numbered_faq[0][0], 0
    for num, line in numbered_faq:
        score = len(q_words & keywords(line))
        if score > best_score:
            best_num, best_score = num, score
    return best_num, best_score

def verify_citation(reply, numbered_faq):
    match = re.search(r"Source: line (\\d+)", reply)
    if not match:
        return False, "no citation found"
    cited = int(match.group(1))
    valid_numbers = {num for num, _ in numbered_faq}
    if cited not in valid_numbers:
        return False, f"line {cited} doesn't exist in this FAQ"
    return True, cited

def check_faq_budget(numbered_faq):
    doc_block = "\\n".join(f"{num}: {line}" for num, line in numbered_faq)
    tokens = estimate_tokens(doc_block)
    if tokens > FAQ_TOKEN_BUDGET:
        raise ValueError(f"FAQ is {tokens} tokens, over budget {FAQ_TOKEN_BUDGET}")
    return tokens

def answer_question(question, numbered_faq, fake_model_reply):
    check_faq_budget(numbered_faq)

    if not question or not question.strip():
        return REFUSAL, None

    _, score = best_match(question, numbered_faq)
    if score == 0:
        return REFUSAL, None

    ok, result = verify_citation(fake_model_reply, numbered_faq)
    if not ok:
        return REFUSAL, result
    return fake_model_reply, result

faq = [
    (1, "Q: What are your hours?"),
    (2, "A: We're open 9am-5pm Monday through Friday."),
    (3, "Q: Do you ship internationally?"),
    (4, "A: No, we currently only ship within the US."),
]

print(answer_question("When are you open?", faq, "We're open 9-5.\\nSource: line 2"))
print(answer_question("What's your favorite band?", faq, "Queen, obviously."))
print(answer_question("Do you ship internationally?", faq, "No, US only.\\nSource: line 99"))
`,
      hints: [
        "Call check_faq_budget first, unguarded, so a too-large FAQ fails loudly before any other check runs.",
        "Order matters: empty-input guard, then keyword score, then citation check, each an early return.",
        "The success path is the only one returning fake_model_reply itself; every other path returns REFUSAL.",
      ],
      challenge_title: "Full Pipeline Trace",
      challenge_description:
        "Trace multiple questions through the complete guard order: budget, empty-check, grounding score, citation, in that priority.",
      challenge_language: "python",
      challenge_starter_code: `import sys

REFUSAL = "REFUSED"

def main():
    data = sys.stdin.read().split("\\n")
    over_budget = data[0].strip() == "1"
    n = int(data[1].strip())
    for i in range(n):
        parts = data[2 + i].split("|")
        question = parts[0]
        score = int(parts[1])
        citation_ok = parts[2]
        # TODO: if over_budget is True, print "BUDGET_ERROR" for every case
        #       (the FAQ never even loads, so nothing else matters).
        # TODO: else if question is empty/whitespace, print REFUSAL
        # TODO: else if score == 0, print REFUSAL
        # TODO: else if citation_ok != "OK", print REFUSAL
        # TODO: else print "ANSWERED"

main()
`,
      challenge_solution_code: `import sys

REFUSAL = "REFUSED"

def main():
    data = sys.stdin.read().split("\\n")
    over_budget = data[0].strip() == "1"
    n = int(data[1].strip())
    for i in range(n):
        parts = data[2 + i].split("|")
        question = parts[0]
        score = int(parts[1])
        citation_ok = parts[2]

        if over_budget:
            print("BUDGET_ERROR")
        elif not question.strip():
            print(REFUSAL)
        elif score == 0:
            print(REFUSAL)
        elif citation_ok != "OK":
            print(REFUSAL)
        else:
            print("ANSWERED")

main()
`,
      challenge_test_cases: [
        {
          input: "0\n3\nWhen open?|2|OK\n|5|OK\nWhen open?|0|OK",
          expected_output: "ANSWERED\nREFUSED\nREFUSED",
          description: "Not over budget: first passes all checks, second is empty, third has zero grounding score.",
        },
        {
          input: "1\n2\nWhen open?|2|OK\nAnything|3|OK",
          expected_output: "BUDGET_ERROR\nBUDGET_ERROR",
          description: "Over-budget FAQ blocks every question before any other check runs.",
        },
        {
          input: "0\n1\nWhen open?|2|BAD",
          expected_output: "REFUSED",
          description: "Edge: passes empty and grounding checks but fails citation verification.",
        },
      ],
    },
  ],
};
