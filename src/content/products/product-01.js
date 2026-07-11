export default {
  project: {
    id: "prod-01",
    title: "AI Text Summarizer",
    description:
      "Build a command-line tool that turns any article or pasted text into a tight, faithful summary. You'll learn the summarize prompt, how to control length and format, how to chunk text that's too long to send at once, and a map-reduce pass for very long documents.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 120,
    lessons_count: 8,
    tags: ["summarization", "prompting", "chunking", "map-reduce", "python", "anthropic"],
    order: 101,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-01-1",
      project_id: "prod-01",
      order: 1,
      title: "The Summarize Prompt",
      concept: "the summarize prompt",
      explanation: `Every summarizer is the same three-move loop: read the source, ask the model for the gist, print the result. This first lesson builds the one piece everything else hangs on, the **summarize prompt**.

## What we're building

By lesson 8 you'll have a command-line tool: paste an article or pipe in a text file, get back a tight summary. Under the hood it's the loop from the playbook, input then prompt then call then parse then ship, doing one job: compress long text into short text without inventing anything.

The heart of it is the prompt. A summary prompt is not "summarize this please." It's a precise instruction set the model follows every run, on articles you'll never read yourself.

## The prompt has two channels

The Anthropic Messages API takes the standing rules and the actual input on separate channels:

- **system** carries who the model is and exactly what to return. You write it once.
- **messages** carries the article to summarize, as a single user turn.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = """You are a precise summarizer.
Summarize the user's text in 3 short sentences.
Rules:
- Keep only the main points.
- Add no opinions and no new facts."""

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=SYSTEM,
    messages=[{"role": "user", "content": article}],
)
print(resp.content[0].text)
\`\`\`

Notice the article rides in \`messages\`, never in \`system\`. The system prompt is the config; the article is the data. Keeping them apart means you write the rules once and only swap the input each call.

## Why the wording matters

Vague prompts fail quietly. "Be concise" hands you something plausible that's still three paragraphs. Three rules fix most bad summaries:

1. **Name the length exactly.** "3 short sentences" beats "brief."
2. **Forbid invention.** "Add no new facts" stops the model from hallucinating details that were never in the source, the number-one summarizer bug.
3. **Constrain scope.** "Only the main points" tells it what to drop.

## The mental model

A summarizer is a plain program with one unusual function call in the middle. The model is a very capable, slightly unreliable \`compress()\` function, and the system prompt is its configuration. Get the prompt shape right first; the network call is the easy part.

Below, build the request payload by hand with no network, so you own the exact structure every later lesson extends.`,
      starter_code: `# Build the summarizer request by hand (no API call yet).
# system holds the rules; messages holds the article as one user turn.

SYSTEM = """You are a precise summarizer.
Summarize the user's text in 3 short sentences.
Rules:
- Keep only the main points.
- Add no opinions and no new facts."""

def build_summary_request(article):
    # TODO: return a dict with keys: model, max_tokens, system, messages
    #       messages must be a list with ONE user turn holding the article.
    pass

article = "The council approved three new parks. Work starts in spring. They open next year."
req = build_summary_request(article)
print("keys:", sorted(req.keys()))
`,
      solution_code: `# Build the summarizer request by hand (no API call yet).
# system holds the rules; messages holds the article as one user turn.

SYSTEM = """You are a precise summarizer.
Summarize the user's text in 3 short sentences.
Rules:
- Keep only the main points.
- Add no opinions and no new facts."""

def build_summary_request(article):
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 300,
        "system": SYSTEM,
        "messages": [{"role": "user", "content": article}],
    }

article = "The council approved three new parks. Work starts in spring. They open next year."
req = build_summary_request(article)

print("keys:", sorted(req.keys()))
print("roles:", [m["role"] for m in req["messages"]])
print("rule lines:", SYSTEM.count("\\n- "))
print("article chars:", len(req["messages"][0]["content"]))
`,
      hints: [
        "Return a plain dict; the article goes inside messages, never inside system.",
        "messages is a list with exactly one item: {\"role\": \"user\", \"content\": article}.",
        "Use model 'claude-sonnet-4-6' and a max_tokens like 300.",
      ],
      challenge_title: "Summarize or Keep",
      challenge_description:
        "Decide whether a block of text is long enough to bother summarizing by counting its sentences against a target.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    target = int(lines[0].strip())
    article = lines[1] if len(lines) > 1 else ""
    # parse done: 'target' is the max sentences to leave alone; 'article' is the text.

    # TODO: count sentences (each '.', '!' or '?' ends one).
    # TODO: print "SUMMARIZE" if the count is greater than target, else "KEEP".
    # TODO: on the second line, print the sentence count.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    target = int(lines[0].strip())
    article = lines[1] if len(lines) > 1 else ""

    count = sum(article.count(ch) for ch in ".!?")
    print("SUMMARIZE" if count > target else "KEEP")
    print(count)

main()
`,
      challenge_test_cases: [
        {
          input: "2\nA. B. C.",
          expected_output: "SUMMARIZE\n3",
          description: "Three sentences beats the target of two, so it should be summarized.",
        },
        {
          input: "3\nOne thing happened.",
          expected_output: "KEEP\n1",
          description: "One sentence is under the target, so it is short enough to keep.",
        },
        {
          input: "0\nHi! Bye?",
          expected_output: "SUMMARIZE\n2",
          description: "Two sentences with '!' and '?' terminators exceed a zero target.",
        },
      ],
    },

    {
      id: "prod-01-2",
      project_id: "prod-01",
      order: 2,
      title: "Your First Real Summary",
      concept: "call the model and clean the reply",
      explanation: `You have the request shape. Now make the call and pull a clean summary out of what comes back. This is the smallest thing that actually works: text in, summary out.

## Reading the reply

The Anthropic API doesn't hand you a bare string. It returns a message whose \`content\` is a list of blocks, and the text lives in the first block:

\`\`\`python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=SYSTEM,
    messages=[{"role": "user", "content": article}],
)
summary = resp.content[0].text
\`\`\`

That \`resp.content[0].text\` is the line beginners miss. Print \`resp\` directly and you get an object repr, not your summary.

## Models add junk you didn't ask for

Ask for three sentences and you'll often get exactly three sentences, wrapped in polite scaffolding:

\`\`\`
Here is a summary of the text:

The council approved three new parks...
\`\`\`

Or fenced in markdown code blocks. That preamble and those fences are fine for a human reading a chat, but your tool is a program, and the next step (printing, saving, counting words) wants the summary alone. So you **clean** the reply before using it:

\`\`\`python
def clean(text):
    lines = [ln for ln in text.splitlines() if ln.strip() != "\`\`\`"]
    if lines and lines[0].rstrip().endswith(":"):
        lines = lines[1:]
    while lines and lines[0].strip() == "":
        lines.pop(0)
    while lines and lines[-1].strip() == "":
        lines.pop()
    return "\\n".join(lines)
\`\`\`

Three defensive moves: drop lone code-fence lines, drop a leading label line that ends in a colon ("Here is the summary:"), and trim blank lines top and bottom. None of this is fancy; it's the difference between a demo and a tool whose output you can pipe into the next command.

## Why clean instead of prompt harder

You can also tell the model "no preamble, output only the summary," and you should. But models still slip, so a tiny cleaning pass is cheap insurance. Prompt for the format you want, then defensively strip what you don't. Belt and suspenders.

## The mental model

The model returns a rough draft in an envelope. Your job is to open the envelope (\`content[0].text\`) and throw away the packaging (preamble, fences, blank lines) before anyone downstream touches it. Below, practice the cleaning pass on a realistic messy reply, no network needed.`,
      starter_code: `# The model's raw reply often carries a preamble and code fences.
# Clean it down to just the summary text.

raw_reply = """Here is a summary:
\`\`\`
The council approved three new parks.
Construction begins in spring.
\`\`\`"""

def clean(text):
    # TODO: drop lines that are just a code fence (\`\`\`).
    # TODO: if the first remaining line ends with ':', drop it.
    # TODO: strip leading and trailing blank lines, then join with newlines.
    pass

print(clean(raw_reply))
`,
      solution_code: `# The model's raw reply often carries a preamble and code fences.
# Clean it down to just the summary text.

raw_reply = """Here is a summary:
\`\`\`
The council approved three new parks.
Construction begins in spring.
\`\`\`"""

def clean(text):
    lines = [ln for ln in text.splitlines() if ln.strip() != "\`\`\`"]
    if lines and lines[0].rstrip().endswith(":"):
        lines = lines[1:]
    while lines and lines[0].strip() == "":
        lines.pop(0)
    while lines and lines[-1].strip() == "":
        lines.pop()
    return "\\n".join(lines)

cleaned = clean(raw_reply)
print(cleaned)
print("---")
print("lines:", len(cleaned.splitlines()))
`,
      hints: [
        "splitlines() turns the reply into a list you can filter and slice.",
        "A code-fence line is one whose stripped value equals three backticks.",
        "Check the first line with .rstrip().endswith(':') before dropping it.",
      ],
      challenge_title: "Clean the Model's Reply",
      challenge_description:
        "Strip the preamble and code fences a model wraps around a summary so only the summary text remains.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read().splitlines()
    # 'raw' is the model's reply, split into lines.

    # TODO: remove any line that is exactly a code fence (three backticks).
    # TODO: if the first remaining line ends with ':', drop it.
    # TODO: drop leading and trailing blank lines.
    # TODO: print the remaining lines, one per line.

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read().splitlines()

    lines = [ln for ln in raw if ln.strip() != "\`\`\`"]
    if lines and lines[0].rstrip().endswith(":"):
        lines = lines[1:]
    while lines and lines[0].strip() == "":
        lines.pop(0)
    while lines and lines[-1].strip() == "":
        lines.pop()

    for ln in lines:
        print(ln)

main()
`,
      challenge_test_cases: [
        {
          input: "Here is the summary:\nThe team won.\nThey celebrated.",
          expected_output: "The team won.\nThey celebrated.",
          description: "A leading label line ending in ':' is dropped.",
        },
        {
          input: "\`\`\`\nCats sleep a lot.\n\`\`\`",
          expected_output: "Cats sleep a lot.",
          description: "Both code-fence lines are removed, leaving the summary.",
        },
        {
          input: "Just a summary.",
          expected_output: "Just a summary.",
          description: "Clean input passes through unchanged.",
        },
      ],
    },

    {
      id: "prod-01-3",
      project_id: "prod-01",
      order: 3,
      title: "Controlling the Length",
      concept: "length control",
      explanation: `A summary you can't size is barely a summary. Sometimes you want a one-line headline; sometimes a five-bullet digest. This lesson is about steering the length reliably.

## Two knobs, one right answer

There are two ways to make output shorter, and only one of them is good:

- **max_tokens** is a hard ceiling on how many tokens the model may generate. Set it too low and the model gets cut off mid-sentence, leaving a mangled fragment. It's a **safety cap**, not a length control.
- **The prompt** is where you actually specify length: "in 2 sentences," "in about 40 words," "in 3 bullet points." The model plans its answer to fit.

So the rule is: **say the length in the prompt, and set max_tokens comfortably above it** as a guardrail.

\`\`\`python
def summarize(article, sentences=3):
    system = f"""You are a precise summarizer.
Summarize the user's text in exactly {sentences} sentences.
Add no opinions and no new facts."""
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        system=system,
        messages=[{"role": "user", "content": article}],
    )
    return resp.content[0].text
\`\`\`

Now the length is a parameter of your function, wired straight into the prompt. Callers pick 1 sentence for a headline or 6 for a digest.

## Verify, don't trust

Models are good at "about 40 words," not exact counts. When a limit is genuinely hard (a UI field, an SMS, a tweet), don't rely on the prompt alone: measure the result and enforce the cap yourself.

\`\`\`python
def cap_words(text, limit):
    words = text.split()
    if len(words) <= limit:
        return text
    return " ".join(words[:limit]) + " ..."
\`\`\`

Prompt for the length, then trim as a backstop. That trailing \`...\` signals truncation so nobody mistakes a cut-off summary for a complete one.

## Why this matters

Length control is where a summarizer becomes reusable. The same code produces a tweet, a paragraph, or a briefing just by changing one number. And the trim backstop means a downstream field never overflows, no matter how chatty the model gets on a weird input.

## The mental model

The prompt asks for a length; \`max_tokens\` prevents runaway cost; your own word-cap enforces the hard limit. Three layers, each doing one job. Below, build the enforcement layer in pure Python.`,
      starter_code: `# Enforce a hard word budget on a summary the model returned.

def cap_words(text, limit):
    # TODO: split the text into words.
    # TODO: if it's within the limit, return it unchanged.
    # TODO: otherwise keep the first 'limit' words and append " ..." to mark the cut.
    pass

summary = "The council approved three new parks and construction begins in spring."
print(cap_words(summary, 5))
print(cap_words(summary, 100))
`,
      solution_code: `# Enforce a hard word budget on a summary the model returned.

def cap_words(text, limit):
    words = text.split()
    if len(words) <= limit:
        return text
    return " ".join(words[:limit]) + " ..."

summary = "The council approved three new parks and construction begins in spring."

print(cap_words(summary, 5))
print(cap_words(summary, 100))
print("word count:", len(summary.split()))
`,
      hints: [
        "text.split() with no argument splits on any whitespace into words.",
        "Compare len(words) to the limit before deciding to trim.",
        "Join the first 'limit' words with spaces and add ' ...' to signal truncation.",
      ],
      challenge_title: "Trim to the Word Budget",
      challenge_description:
        "Enforce a hard word cap on a summary, trimming and marking it when it runs over.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    text = lines[1] if len(lines) > 1 else ""
    # 'n' is the max words allowed; 'text' is the summary.

    # TODO: if the text is within n words, print it unchanged.
    # TODO: otherwise print the first n words followed by " ..." to mark the cut.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    text = lines[1] if len(lines) > 1 else ""

    words = text.split()
    if len(words) <= n:
        print(text)
    else:
        print(" ".join(words[:n]) + " ...")

main()
`,
      challenge_test_cases: [
        {
          input: "3\none two three four five",
          expected_output: "one two three ...",
          description: "Five words over a three-word budget are trimmed and marked.",
        },
        {
          input: "5\nshort and sweet",
          expected_output: "short and sweet",
          description: "Three words are within the budget, so nothing changes.",
        },
        {
          input: "2\nalpha beta gamma",
          expected_output: "alpha beta ...",
          description: "The cut keeps exactly the first two words plus the marker.",
        },
      ],
    },

    {
      id: "prod-01-4",
      project_id: "prod-01",
      order: 4,
      title: "Controlling the Format",
      concept: "format control",
      explanation: `Same article, different shapes: a flowing paragraph, a bullet list, or structured fields your program can read. Format is a first-class dial on a summarizer, and you set it the same way you set length, in the prompt, plus a little parsing on your side.

## Formats you'll actually want

- **Paragraph** for reading: 2 to 4 sentences of prose.
- **Bullets** for scanning: 3 to 5 short lines, one idea each.
- **Structured** for programs: JSON with fixed keys, so downstream code can pull fields out.

The first two are prompt-only. Ask and you receive:

\`\`\`python
SYSTEM_BULLETS = """You are a summarizer.
Summarize the user's text as 3 to 5 bullet points.
Each bullet is one short line starting with "- ".
No preamble, output only the bullets."""
\`\`\`

## Structured output is different

When you want the summary as data, ask for JSON and say the keys exactly:

\`\`\`python
SYSTEM_JSON = """You are a summarizer.
Return ONLY a JSON object, no prose, with these keys:
- "headline": a 6-word title
- "points": a list of 3 short strings
Do not wrap it in code fences."""
\`\`\`

Then parse defensively. Models sometimes wrap JSON in chatty text or a code fence, so pull out the object before \`json.loads\`:

\`\`\`python
import json

def parse_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])
\`\`\`

Slicing from the first \`{\` to the last \`}\` throws away any preamble or fence and hands \`json.loads\` a clean object. If parsing still fails, that's your signal to retry (a later lesson wires that up).

## Why format control matters

A summarizer that only makes paragraphs is a toy. The one that also emits \`{"headline": ..., "points": [...]}\` plugs into a UI, an email digest, or a database. Same model call, same article; the format is just another instruction plus a matching parser.

One more habit pays off: when you ask for JSON, ask for a **fixed** set of keys and say each one. "Return name, email, phone" is reliable; "return the relevant fields" invites the model to invent a different shape every run, and your parser breaks. Pin the schema in the prompt and your parsing code can trust it.

## The mental model

Prompt decides the shape; parser trusts the shape but verifies it. Prose formats need no parsing. Structured formats need a defensive extractor because the model's "JSON" occasionally arrives gift-wrapped. Below, build the formatter that turns summary points into either bullets or a numbered list on demand.`,
      starter_code: `# Render a list of summary points in the requested format.

def render(points, style):
    # style is "bullets" or "numbered".
    # TODO: for "numbered", print "1. point", "2. point", ...
    # TODO: for anything else, print "- point" for each.
    pass

points = ["Parks approved", "Work starts in spring", "Opening next year"]
render(points, "numbered")
`,
      solution_code: `# Render a list of summary points in the requested format.

def render(points, style):
    for i, p in enumerate(points, start=1):
        if style == "numbered":
            print(f"{i}. {p}")
        else:
            print(f"- {p}")

points = ["Parks approved", "Work starts in spring", "Opening next year"]

render(points, "numbered")
print("---")
render(points, "bullets")
`,
      hints: [
        "enumerate(points, start=1) gives you the 1-based index for numbering.",
        "An f-string like f\"{i}. {p}\" builds the numbered line.",
        "Default anything that isn't 'numbered' to bullet style.",
      ],
      challenge_title: "Format the Summary",
      challenge_description:
        "Render a set of summary points as either a bullet list or a numbered list, controlled by a format flag.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    style = lines[0].strip()
    k = int(lines[1].strip())
    points = lines[2:2 + k]
    # 'style' is "bullets" or "numbered"; 'points' are the k summary lines.

    # TODO: for "numbered", print "1. point", "2. point", ...
    # TODO: otherwise print "- point" for each point.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    style = lines[0].strip()
    k = int(lines[1].strip())
    points = lines[2:2 + k]

    for i, p in enumerate(points, start=1):
        if style == "numbered":
            print(f"{i}. {p}")
        else:
            print(f"- {p}")

main()
`,
      challenge_test_cases: [
        {
          input: "bullets\n2\nParks approved\nOpening next year",
          expected_output: "- Parks approved\n- Opening next year",
          description: "Bullet style prefixes each point with '- '.",
        },
        {
          input: "numbered\n3\nA\nB\nC",
          expected_output: "1. A\n2. B\n3. C",
          description: "Numbered style uses a 1-based counter.",
        },
        {
          input: "numbered\n1\nOnly one",
          expected_output: "1. Only one",
          description: "A single point still numbers correctly.",
        },
      ],
    },

    {
      id: "prod-01-5",
      project_id: "prod-01",
      order: 5,
      title: "Chunking Long Inputs",
      concept: "chunking",
      explanation: `Paste a whole book into one API call and you hit a wall: the **context window**. The model can only read so much text at once, and even when a huge input technically fits, you pay for every token you send. The fix is **chunking**, splitting a long input into pieces small enough to handle.

## The context window, briefly

The context window is the maximum text, measured in **tokens**, the model can read in one call. A token is roughly 4 characters of English, so a rough estimate is \`len(text) // 4\`. A 100,000-character article is about 25,000 tokens: often fine to send, but slow and not free, and some documents blow past any limit. Either way, the professional move on long input is to break it up.

## Split on boundaries, not mid-word

The naive split, "every 2,000 characters," slices words and sentences in half and produces garbled chunks. Split on natural boundaries instead, packing whole units (paragraphs, or at least whole words) into each chunk until it's nearly full:

\`\`\`python
def chunk_words(text, max_chars=2000):
    chunks, current = [], ""
    for word in text.split():
        if not current:
            current = word
        elif len(current) + 1 + len(word) <= max_chars:
            current += " " + word
        else:
            chunks.append(current)
            current = word
    if current:
        chunks.append(current)
    return chunks
\`\`\`

This greedily fills each chunk up to \`max_chars\` and starts a new one only when the next word won't fit, so no word is ever cut. Real tools chunk on paragraphs first and fall back to sentences, but the packing logic is identical: add whole units while they fit, then roll over.

## What you do with the chunks

Once split, you summarize each chunk on its own, then decide how to combine the pieces. That combine step, turning many chunk summaries into one, is the next lesson (map-reduce). For now the job is clean, boundary-respecting chunks of a predictable size.

A subtle knob you'll meet later: **overlap**. Repeating a sentence or two between adjacent chunks keeps an idea that straddles a boundary from being lost. Start without it; add it if summaries feel like they drop the seams.

## The mental model

Chunking is portioning a meal too big for one plate. You don't split it mid-bite; you serve whole spoonfuls onto each plate until it's full, then reach for the next plate. Below, implement the word-safe chunker exactly.`,
      starter_code: `# Split text into chunks no longer than max_chars, never cutting a word.

def chunk_words(text, max_chars):
    chunks, current = [], ""
    for word in text.split():
        # TODO: if current is empty, start it with this word.
        # TODO: elif this word still fits (with a joining space), append it.
        # TODO: else push current to chunks and start a new chunk with this word.
        pass
    # TODO: don't forget the final non-empty chunk.
    return chunks

print(chunk_words("the quick brown fox jumps", 10))
`,
      solution_code: `# Split text into chunks no longer than max_chars, never cutting a word.

def chunk_words(text, max_chars):
    chunks, current = [], ""
    for word in text.split():
        if not current:
            current = word
        elif len(current) + 1 + len(word) <= max_chars:
            current += " " + word
        else:
            chunks.append(current)
            current = word
    if current:
        chunks.append(current)
    return chunks

result = chunk_words("the quick brown fox jumps", 10)
print("chunks:", len(result))
for c in result:
    print(repr(c), "->", len(c), "chars")
`,
      hints: [
        "Track a 'current' string; add whole words to it until the next one won't fit.",
        "The fit test is len(current) + 1 + len(word) <= max_chars (the +1 is the space).",
        "After the loop, append 'current' if it still holds a chunk.",
      ],
      challenge_title: "Chunk Without Splitting Words",
      challenge_description:
        "Pack words greedily into chunks no longer than a character budget, never cutting a word in half.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    k = int(lines[0].strip())
    text = lines[1] if len(lines) > 1 else ""
    # 'k' is the max characters per chunk; 'text' is the input.

    # TODO: greedily pack whole words into chunks of at most k characters
    #       (a single space joins words within a chunk).
    # TODO: print the number of chunks, then each chunk on its own line.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    k = int(lines[0].strip())
    text = lines[1] if len(lines) > 1 else ""

    chunks, current = [], ""
    for word in text.split():
        if not current:
            current = word
        elif len(current) + 1 + len(word) <= k:
            current += " " + word
        else:
            chunks.append(current)
            current = word
    if current:
        chunks.append(current)

    print(len(chunks))
    for c in chunks:
        print(c)

main()
`,
      challenge_test_cases: [
        {
          input: "10\nthe quick brown fox jumps",
          expected_output: "3\nthe quick\nbrown fox\njumps",
          description: "Words pack two-per-chunk until the budget forces a new chunk.",
        },
        {
          input: "5\naa bb cc",
          expected_output: "2\naa bb\ncc",
          description: "'aa bb' is exactly 5 chars; 'cc' rolls to a second chunk.",
        },
        {
          input: "3\nhello world",
          expected_output: "2\nhello\nworld",
          description: "Words longer than the budget still each get their own chunk.",
        },
      ],
    },

    {
      id: "prod-01-6",
      project_id: "prod-01",
      order: 6,
      title: "Map-Reduce for Very Long Docs",
      concept: "map-reduce summarization",
      explanation: `You chunked a 200-page report into 60 pieces. Now what? You can't just paste 60 chunk summaries back together, that's still a wall of text. The pattern that scales to any length is **map-reduce**.

## The two phases

- **Map:** summarize each chunk independently. 60 chunks become 60 short summaries. These calls are independent, so the model sees one chunk at a time and never needs the whole document at once.
- **Reduce:** combine those summaries into one. If they all fit in a single call, summarize the summaries and you're done. If there are still too many, group them, summarize each group, and repeat, a tree that collapses toward a single summary.

\`\`\`python
def map_reduce(text):
    chunks = chunk_words(text, max_chars=6000)
    summaries = [summarize(c) for c in chunks]        # map
    while len(summaries) > 1:                          # reduce
        groups = [summaries[i:i + 5] for i in range(0, len(summaries), 5)]
        summaries = [summarize("\\n".join(g)) for g in groups]
    return summaries[0]
\`\`\`

Read the reduce loop carefully: each pass groups the current summaries (here 5 at a time), summarizes each group down to one, and loops until a single summary remains. Ten summaries become two, then one. A hundred become twenty, then four, then one.

## Why not just summarize once?

Because a single chunk summary already loses detail, and stacking 60 of them re-creates the length problem you started with. The reduce phase compresses again with the model actively synthesizing, spotting the through-line across chunks rather than concatenating. The result reads like one summary, not a pile of fragments.

## The cost you're signing up for

Map-reduce trades calls for capacity. Sixty chunks is sixty map calls plus a handful of reduce calls. That's the price of summarizing something that could never fit in one window. Two levers keep it sane: bigger chunks (fewer map calls) and a bigger reduce group size (fewer reduce passes). You'll count these calls exactly in the drill, because on a big document, calls are dollars.

## The mental model

Map-reduce is a tournament bracket for text. Every chunk plays its first round (map). Winners, the chunk summaries, get grouped and play again (reduce), round after round, until one champion summary is left standing. The document's length just adds early rounds. Below, count the total calls a map-reduce run costs.`,
      starter_code: `# Count the total API calls a map-reduce summary makes.
# Map: one call per chunk. Reduce: group by 'g', one call per group, repeat to 1.

import math

def total_calls(n, g):
    calls = n            # map phase: one per chunk
    level = n
    # TODO: while more than one summary remains, group by g,
    #       add ceil(level / g) reduce calls, and shrink 'level' to that many.
    return calls

print(total_calls(5, 2))
`,
      solution_code: `# Count the total API calls a map-reduce summary makes.
# Map: one call per chunk. Reduce: group by 'g', one call per group, repeat to 1.

import math

def total_calls(n, g):
    calls = n
    level = n
    while level > 1:
        groups = math.ceil(level / g)
        calls += groups
        level = groups
    return calls

print("5 chunks, group 2:", total_calls(5, 2))
print("1 chunk:", total_calls(1, 2))
print("10 chunks, group 3:", total_calls(10, 3))
`,
      hints: [
        "Start calls at n for the map phase, one summary call per chunk.",
        "Each reduce pass makes ceil(level / g) calls, then that becomes the new level.",
        "Stop the loop when only one summary is left.",
      ],
      challenge_title: "Count the Map-Reduce Calls",
      challenge_description:
        "Given the chunk count and reduce group size, count every API call a full map-reduce summary makes.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import math

def main():
    n, g = map(int, sys.stdin.read().split())
    # 'n' chunks; reduce combines 'g' summaries per call until one remains.

    # TODO: map phase is n calls (one per chunk).
    # TODO: each reduce pass adds ceil(level / g) calls and shrinks level to that.
    # TODO: print the total number of calls.

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    n, g = map(int, sys.stdin.read().split())

    calls = n
    level = n
    while level > 1:
        groups = math.ceil(level / g)
        calls += groups
        level = groups

    print(calls)

main()
`,
      challenge_test_cases: [
        {
          input: "5 2",
          expected_output: "11",
          description: "5 map + (3 + 2 + 1) reduce = 11 calls.",
        },
        {
          input: "1 2",
          expected_output: "1",
          description: "A single chunk needs only its one map call, no reduce.",
        },
        {
          input: "4 4",
          expected_output: "5",
          description: "4 map calls collapse to one reduce call in a single pass.",
        },
      ],
    },

    {
      id: "prod-01-7",
      project_id: "prod-01",
      order: 7,
      title: "Hardening: Errors, Empties, and Cost",
      concept: "robustness and cost",
      explanation: `Your summarizer works on the article you tested. A tool works on the article you didn't: an empty file, a network blip, a document so long the bill matters. This lesson is the boring, crucial layer that turns a script into something you'd let a stranger run.

## Guard the input before you spend a cent

The cheapest call is the one you never make. Blank or trivially short input needs no model at all:

\`\`\`python
def summarize_safe(text):
    text = text.strip()
    if not text:
        return ""
    if len(text.split()) < 40:
        return text            # already short enough; don't pay to "summarize" it
    ...
\`\`\`

Every early return here is money saved and a crash avoided.

## Assume the network will flinch

Calls time out and rate-limit. Wrap them and retry with a short backoff instead of dying on the first hiccup:

\`\`\`python
import time

def call_with_retry(fn, tries=3):
    for attempt in range(tries):
        try:
            return fn()
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(2 ** attempt)   # 1s, 2s, 4s...
\`\`\`

Three attempts with growing waits ride out most transient failures. On the last attempt you re-raise, because failing loudly beats returning a silent lie.

## Watch the bill, especially on retries

Every attempt costs tokens, even the failed ones, because you paid to send the input. On a map-reduce over a long document, a few retries per chunk add up fast. A useful habit is to tally what you actually spent:

\`\`\`python
billed = attempts * input_tokens + output_tokens
\`\`\`

The final successful attempt adds output tokens; every attempt (including the failures) re-bills the input. Sum that across chunks and you know the true cost of a run, not the optimistic one.

## Fail one chunk, not the whole document

On a long run, one bad chunk shouldn't sink everything. Catch a chunk that fails all its retries, substitute a placeholder like "[section could not be summarized]", and keep going. A summary missing one section out of sixty still beats a crash on section fifty-nine that throws away the other fifty-eight.

## Why this matters

Summarizers eat unpredictable input by nature: whatever a user pastes. Hardening is what keeps a weird input from crashing the tool, an empty input from wasting a call, and a flaky network from taking down a batch job halfway through. The difference between a demo and a tool is entirely in this layer. Below, tally the real token bill of a run where some chunks needed retries.`,
      starter_code: `# Tally the true token bill of a run where some calls were retried.
# Each attempt re-bills input tokens; only the successful call adds output tokens.

def total_billed(calls):
    # calls is a list of (input_tokens, output_tokens, attempts) tuples.
    total = 0
    for inp, out, attempts in calls:
        # TODO: add attempts * inp + out to the running total.
        pass
    return total

runs = [(100, 50, 1), (200, 30, 3)]
print(total_billed(runs))
`,
      solution_code: `# Tally the true token bill of a run where some calls were retried.
# Each attempt re-bills input tokens; only the successful call adds output tokens.

def total_billed(calls):
    total = 0
    for inp, out, attempts in calls:
        total += attempts * inp + out
    return total

runs = [(100, 50, 1), (200, 30, 3)]

print("total tokens billed:", total_billed(runs))
for inp, out, attempts in runs:
    print(f"in={inp} out={out} tries={attempts} -> {attempts * inp + out}")
`,
      hints: [
        "A failed attempt still spends its input tokens, so multiply input by attempts.",
        "Only the final successful attempt produces output tokens, so add out once.",
        "Per call the bill is attempts * input + output; sum it across every call.",
      ],
      challenge_title: "Tally the Real Bill with Retries",
      challenge_description:
        "Compute the true token cost of a summarization run where failed attempts still bill their input tokens.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    # Each of the next n lines: input_tokens output_tokens attempts

    total = 0
    for i in range(1, n + 1):
        inp, out, attempts = map(int, lines[i].split())
        # TODO: add attempts * inp + out to total.

    # TODO: print total.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())

    total = 0
    for i in range(1, n + 1):
        inp, out, attempts = map(int, lines[i].split())
        total += attempts * inp + out

    print(total)

main()
`,
      challenge_test_cases: [
        {
          input: "2\n100 50 1\n200 30 3",
          expected_output: "780",
          description: "150 for the clean call plus 630 for the thrice-tried call.",
        },
        {
          input: "1\n10 5 2",
          expected_output: "25",
          description: "Two attempts re-bill input (20) and one success adds output (5).",
        },
        {
          input: "3\n50 10 1\n50 10 1\n50 10 1",
          expected_output: "180",
          description: "Three clean calls at 60 tokens each total 180.",
        },
      ],
    },

    {
      id: "prod-01-8",
      project_id: "prod-01",
      order: 8,
      title: "Ship the Summarizer",
      concept: "shipping the tool",
      explanation: `Time to make it a real command-line tool: text in from a file or a pipe, a summary out, with the right strategy chosen automatically by length. Finish this lesson and the build lands in your **Portfolio**.

## Pick the strategy by size

You've built three ways to summarize. A finished tool chooses among them based on how big the input is:

- **Short** input: one call, done.
- **Medium** input: chunk it, summarize each chunk, stitch the parts.
- **Very long** input: full map-reduce.

\`\`\`python
def summarize_any(text):
    text = text.strip()
    if not text:
        return ""
    n = len(text)
    if n <= 2000:
        return summarize(text)
    if n <= 20000:
        parts = [summarize(c) for c in chunk_words(text, 6000)]
        return summarize("\\n".join(parts))
    return map_reduce(text)
\`\`\`

The thresholds are yours to tune; the point is the tool decides, so the user just hands it text.

## Wrap it in a CLI

Read from a file argument or standard input, so it works both ways:

\`\`\`python
import sys

def main():
    if len(sys.argv) > 1:
        text = open(sys.argv[1], encoding="utf-8").read()
    else:
        text = sys.stdin.read()
    print(summarize_any(text))

if __name__ == "__main__":
    main()
\`\`\`

Now \`python summarize.py article.txt\` and \`cat article.txt | python summarize.py\` both work. That's a real tool: one command, any input, a summary out.

## What "shipped" means here

Three tests, borrowed from the playbook: it runs from a clean start with one command, it survives an empty or weird input without crashing (your lesson-7 guards handle that), and someone else could use it from a one-line description. Hit those and it's a deliverable, not a demo.

## Into your Portfolio

Finishing this lesson records the AI Text Summarizer in your **Portfolio** tab: title, what it does, and that it's built. It joins the shelf of working tools you're assembling across the track. Keep an example input and its summary next to it as proof it works.

## The mental model

A shipped tool hides its own complexity. The user types one command; inside, your code measures the input and quietly picks single-shot, chunked, or map-reduce. Below, build that dispatcher, the last piece, then it's done.`,
      starter_code: `# The dispatcher: choose the summarization strategy from the input size.

def choose_strategy(length, single_max, chunk_max):
    # TODO: length <= single_max -> "single-shot"
    # TODO: length <= chunk_max  -> "chunked"
    # TODO: otherwise            -> "map-reduce"
    pass

for n in [500, 8000, 50000]:
    print(n, "->", choose_strategy(n, 2000, 20000))
`,
      solution_code: `# The dispatcher: choose the summarization strategy from the input size.

def choose_strategy(length, single_max, chunk_max):
    if length <= single_max:
        return "single-shot"
    if length <= chunk_max:
        return "chunked"
    return "map-reduce"

for n in [500, 8000, 50000]:
    print(n, "->", choose_strategy(n, 2000, 20000))

print("Summarizer built. Saved to your Portfolio.")
`,
      hints: [
        "Check the smallest threshold first and return early.",
        "The boundaries are inclusive: length == single_max is still single-shot.",
        "Anything past chunk_max falls through to map-reduce.",
      ],
      challenge_title: "Pick the Summarization Strategy",
      challenge_description:
        "Route an input to single-shot, chunked, or map-reduce summarization based on its length and two thresholds.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    single_max, chunk_max = map(int, lines[0].split())
    length = int(lines[1].strip())
    # Thresholds are inclusive.

    # TODO: length <= single_max -> print "single-shot"
    # TODO: length <= chunk_max  -> print "chunked"
    # TODO: otherwise            -> print "map-reduce"

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    single_max, chunk_max = map(int, lines[0].split())
    length = int(lines[1].strip())

    if length <= single_max:
        print("single-shot")
    elif length <= chunk_max:
        print("chunked")
    else:
        print("map-reduce")

main()
`,
      challenge_test_cases: [
        {
          input: "2000 20000\n500",
          expected_output: "single-shot",
          description: "A short input goes straight to one call.",
        },
        {
          input: "2000 20000\n8000",
          expected_output: "chunked",
          description: "A medium input is chunked and stitched.",
        },
        {
          input: "2000 20000\n50000",
          expected_output: "map-reduce",
          description: "A very long input triggers the map-reduce pass.",
        },
        {
          input: "2000 20000\n2000",
          expected_output: "single-shot",
          description: "The threshold is inclusive, so exactly 2000 is single-shot.",
        },
      ],
    },
  ],
};
