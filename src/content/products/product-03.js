const project = {
  id: "prod-03",
  title: "Flashcard Maker",
  description:
    "Build a command-line tool that turns a block of messy study notes into a clean deck of question/answer flashcards. It extracts facts with the model, dedupes them, and exports the deck to a CSV file that imports straight into Anki.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["flashcards", "extraction", "json-output", "dedup", "csv-export", "anki"],
  order: 103,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-03-1",
    project_id: "prod-03",
    order: 1,
    title: "Notes In, One Card Out",
    concept: "the flashcard loop",
    explanation: `You're going to build a tool that eats your messy class notes and hands back a clean deck of study flashcards, then exports them so they drop straight into Anki. By lesson 8 it's a real command-line tool. This lesson builds the smallest slice that works: notes in, one question/answer card out.

## The whole build in one sentence

Take a block of notes, ask the model to pull the key facts out as question/answer pairs, clean up the result, and write it to a CSV file. That's the entire product. Every lesson from here adds exactly one piece: chunking long notes, getting clean JSON, removing duplicates, controlling cost, validating, and exporting.

## The card is the unit

A flashcard is just two strings: a **question** and an **answer**. In Python that's a dict:

\`\`\`python
card = {"question": "What year did WWII end?", "answer": "1945"}
\`\`\`

A deck is a list of those dicts. Everything the tool does is turn text into a list of these dicts, then write that list to disk. Keep the shape in mind: \`str\` in, \`list[dict]\` out, a file at the end.

## The smallest thing that works

Give the model one fact and ask for one card. The prompt carries the rules:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."
reply = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=200,
    system=SYSTEM,
    messages=[{"role": "user", "content": note}],
).content[0].text
print(reply)
\`\`\`

The model replies with two lines. You parse them into a dict:

\`\`\`python
lines = reply.strip().splitlines()
question = lines[0].removeprefix("Q:").strip()
answer = lines[1].removeprefix("A:").strip()
card = {"question": question, "answer": answer}
\`\`\`

## Why force the reply into this shape

We told the model to answer in a rigid \`Q:\`/\`A:\` layout so parsing is trivial: split the lines, strip the labels, done. Later we switch to JSON so we can pull many cards at once, but the idea stays the same. Constrain the output so your code can read it. Ask vaguely for "some flashcards" and you get chatty prose no parser can touch.

## The runnable drill

The sandbox has no network, so below you build the same messages list and parse a *sample* reply string exactly as the real code would, with no API call. Get the parse right here and the live version is the same three lines.`,
    starter_code: `# Build the request, then parse the model's reply into a card dict.
# No network here: we parse a sample reply string instead.

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."

def build_messages(note_text):
    # TODO: return the messages list: a single user turn holding note_text
    pass

sample_reply = "Q: What is the powerhouse of the cell?\\nA: The mitochondria"

def parse_card(reply):
    # TODO: split into lines, strip the "Q:" and "A:" labels,
    #       return {"question": ..., "answer": ...}
    pass

print("messages:", build_messages(note))
print("card:", parse_card(sample_reply))
`,
    solution_code: `# Build the request, then parse the model's reply into a card dict.
# No network here: we parse a sample reply string instead.

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."

def build_messages(note_text):
    return [{"role": "user", "content": note_text}]

sample_reply = "Q: What is the powerhouse of the cell?\\nA: The mitochondria"

def parse_card(reply):
    lines = reply.strip().splitlines()
    question = lines[0].removeprefix("Q:").strip()
    answer = lines[1].removeprefix("A:").strip()
    return {"question": question, "answer": answer}

messages = build_messages(note)
print("messages:", messages)

card = parse_card(sample_reply)
print("question:", card["question"])
print("answer:", card["answer"])
`,
    hints: [
      "build_messages just returns [{\"role\": \"user\", \"content\": note_text}].",
      "splitlines() turns the reply into a list of its two lines.",
      "str.removeprefix(\"Q:\") drops the label; follow it with .strip() to clean the spaces.",
    ],
    challenge_title: "Count Well-Formed Cards",
    challenge_description:
      "Given candidate flashcards in question|answer form, count how many are well-formed (exactly one pipe, both sides non-empty).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # TODO: a card is well-formed if splitting on "|" gives EXACTLY two parts
    #       and both parts are non-empty after .strip(). Count and print them.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    count = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) == 2 and parts[0].strip() and parts[1].strip():
            count += 1
    print(count)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nWhat is 2+2?|4\n|missing question\nCapital of France?|Paris",
        expected_output: "2",
        description: "Two valid cards; the middle one has an empty question.",
      },
      {
        input: "2\nx|\n|y",
        expected_output: "0",
        description: "Both sides must be non-empty, so neither card counts.",
      },
      {
        input: "1\nno pipe here",
        expected_output: "0",
        description: "A line with no pipe cannot split into a question and answer.",
      },
    ],
  },

  {
    id: "prod-03-2",
    project_id: "prod-03",
    order: 2,
    title: "Chunking the Notes",
    concept: "splitting notes into study-sized pieces",
    explanation: `Real notes aren't one tidy sentence. They're a wall of text: a whole lecture, a textbook chapter, pages of bullet points. If you paste all of it into one call and ask for cards, two things go wrong: the model skims and misses facts, and long inputs cost more tokens per call. The fix is **chunking**: break the notes into smaller pieces and feed them in one at a time.

## Why chunk at all

A model reading a short, focused chunk pays attention to every line. A model reading ten pages tends to summarize the highlights and drop the details, exactly the small facts you want on flashcards. Smaller inputs also mean each call is cheaper and easier to retry when something fails. Chunking is the single change that most improves flashcard *coverage*.

## A chunk is just a slice of text under a size limit

Pick a maximum size, say a few hundred characters, and pack text into chunks that stay under it without ever splitting in the middle of a sentence. Cutting on sentence boundaries keeps each card's context intact:

\`\`\`python
def chunk_notes(text, max_chars=280):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        candidate = (current + " " + s).strip() if current else s
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks
\`\`\`

This is a **greedy packer**: keep adding sentences to the current chunk until the next one would blow the limit, then start a fresh chunk. Each chunk is a self-contained bundle of a few sentences.

## How it fits the build

The loop becomes: chunk the notes, then run the lesson-1 extraction on each chunk, then collect every card into one deck:

\`\`\`python
all_cards = []
for chunk in chunk_notes(raw_notes):
    reply = extract_cards(chunk)   # the API call from lesson 1
    all_cards.extend(parse(reply))
\`\`\`

More chunks means more API calls, which means more cost and time, so you don't want chunks that are too tiny either. A few hundred characters per chunk is a sane default: big enough to hold real context, small enough that the model reads it carefully.

## The runnable drill

No network needed to practice this, chunking is pure text handling. Below you implement the greedy packer and run it on a sample note. Getting the boundary logic right (never exceed the limit, never lose a sentence) is the whole skill.`,
    starter_code: `# Split a block of notes into chunks that each stay under a size limit,
# packing whole sentences greedily. Pure text work, no API.

def chunk_notes(text, max_chars=40):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        # TODO: build 'candidate' by adding s to 'current' (with a space if needed)
        # TODO: if candidate fits in max_chars, keep it as 'current';
        #       otherwise push 'current' to chunks and start a new one from s
        pass
    # TODO: don't forget the last 'current' if it's non-empty
    return chunks

notes = "The sky is blue. Water boils at 100C. Cells have a nucleus."
for i, c in enumerate(chunk_notes(notes)):
    print(i, "->", c)
`,
    solution_code: `# Split a block of notes into chunks that each stay under a size limit,
# packing whole sentences greedily. Pure text work, no API.

def chunk_notes(text, max_chars=40):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        candidate = (current + " " + s).strip() if current else s
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks

notes = "The sky is blue. Water boils at 100C. Cells have a nucleus."
result = chunk_notes(notes)
print("chunks:", len(result))
for i, c in enumerate(result):
    print(i, "->", c, "(", len(c), "chars )")
`,
    hints: [
      "Build candidate as (current + ' ' + s).strip() when current is non-empty, else just s.",
      "If candidate fits within max_chars, that becomes the new current; otherwise flush current to chunks and restart from s.",
      "After the loop, append the leftover current if it isn't empty, that's the final chunk.",
    ],
    challenge_title: "Pack Notes into Chunks",
    challenge_description:
      "Greedily pack space-separated words into lines no longer than a character limit, and report how many chunks result.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0])
    words = data[1].split() if len(data) > 1 else []
    # TODO: pack words into chunks joined by single spaces so each chunk's
    #       length stays <= max_chars. Each word fits alone. Print the chunk count.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0])
    words = data[1].split() if len(data) > 1 else []

    chunks = 0
    current = ""
    for w in words:
        candidate = (current + " " + w) if current else w
        if len(candidate) <= max_chars:
            current = candidate
        else:
            chunks += 1
            current = w
    if current:
        chunks += 1
    print(chunks)

main()
`,
    challenge_test_cases: [
      {
        input: "10\nthe quick brown fox",
        expected_output: "2",
        description: "\"the quick\" (9) then \"brown fox\" (9), two chunks under 10 chars.",
      },
      {
        input: "5\na b c d e",
        expected_output: "2",
        description: "\"a b c\" (5) fills the limit, then \"d e\" (3).",
      },
      {
        input: "3\n",
        expected_output: "0",
        description: "Empty notes produce no chunks.",
      },
    ],
  },

  {
    id: "prod-03-3",
    project_id: "prod-03",
    order: 3,
    title: "The Extraction Prompt: Ask for JSON",
    concept: "structured extraction into a JSON array",
    explanation: `One card per call is fine for a demo, but real notes hold many facts per chunk. You want the model to read a chunk and hand back *several* cards at once, in a shape your code can loop over. The tool for that is **structured extraction**: instruct the model to return a JSON array of card objects.

## Why JSON instead of the Q:/A: format

The \`Q:\`/\`A:\` layout worked for exactly one card. For many cards you'd invent separators and count blank lines, brittle. JSON is the standard, well-defined format for a list of objects, and Python's \`json\` module parses it in one line. When you want many structured items back from a model, you ask for JSON.

## The extraction prompt

The system prompt has real work to do here. It names the task, pins the exact schema, and sets rules that keep garbage out:

\`\`\`python
SYSTEM = """You extract study flashcards from notes.
Read the note and produce every distinct fact worth memorizing.
Return ONLY a JSON array. Each element must be an object with exactly
two string keys: "question" and "answer".

Rules:
- One clear fact per card. No trivia, no duplicates.
- The question must be answerable from the note alone.
- If the note contains no facts worth a card, return [].
Example: [{"question": "What year did WWII end?", "answer": "1945"}]"""
\`\`\`

A few details carry the reliability here. **"Return ONLY a JSON array"** discourages the chatty "Sure! Here are your cards:" preamble that breaks parsing. **The exact keys** (\`question\`, \`answer\`) mean your loop can rely on them. **The example** shows the shape better than any description can. One line of sample output is worth a paragraph of rules.

## The call

\`\`\`python
import json

reply = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=SYSTEM,
    messages=[{"role": "user", "content": chunk}],
).content[0].text

cards = json.loads(reply)          # list[dict] with question/answer keys
for c in cards:
    print(c["question"], "->", c["answer"])
\`\`\`

That \`json.loads\` is why you asked for JSON in the first place. The text becomes a real Python list you can loop over and count. (The next lesson hardens the parse, since models sometimes wrap the JSON in extra text.)

## The runnable drill

Below you don't call the API. Instead you take a *sample* parsed list of cards and validate it against the schema: every element must be a dict with non-empty \`question\` and \`answer\` strings. Counting the valid cards is the check every extraction step needs before trusting the model's output.`,
    starter_code: `# Validate a parsed extraction result against the card schema.
# 'cards' stands in for json.loads(model_reply) so no network is needed.

cards = [
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "", "answer": "missing question"},
    {"question": "Capital of France?", "answer": "Paris"},
    {"question": "No answer here?"},
]

def is_valid_card(card):
    # TODO: return True only if card is a dict with non-empty string
    #       "question" and "answer" values
    pass

valid = [c for c in cards if is_valid_card(c)]
print("valid cards:", len(valid))
`,
    solution_code: `# Validate a parsed extraction result against the card schema.
# 'cards' stands in for json.loads(model_reply) so no network is needed.

cards = [
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "", "answer": "missing question"},
    {"question": "Capital of France?", "answer": "Paris"},
    {"question": "No answer here?"},
]

def is_valid_card(card):
    if not isinstance(card, dict):
        return False
    q = card.get("question")
    a = card.get("answer")
    return isinstance(q, str) and isinstance(a, str) and q.strip() != "" and a.strip() != ""

valid = [c for c in cards if is_valid_card(c)]
print("valid cards:", len(valid))
for c in valid:
    print("-", c["question"], "->", c["answer"])
`,
    hints: [
      "Use card.get(\"question\") so a missing key returns None instead of raising KeyError.",
      "A field is good only if it's a str and non-empty after .strip().",
      "isinstance(card, dict) guards against the model returning a stray string or number in the array.",
    ],
    challenge_title: "Cards Per Note",
    challenge_description:
      "The extractor makes one card per sentence that has at least K words. Count how many cards a note produces.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k = int(data[0])
    note = data[1] if len(data) > 1 else ""
    # TODO: split the note into sentences on ".", strip each, and count how many
    #       have at least k words. Print that count.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k = int(data[0])
    note = data[1] if len(data) > 1 else ""

    count = 0
    for sentence in note.split("."):
        words = sentence.split()
        if len(words) >= k:
            count += 1
    print(count)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nThe sky is blue. Yes. Water boils at one hundred degrees.",
        expected_output: "2",
        description: "\"Yes\" has one word, below the 3-word threshold, so only two cards.",
      },
      {
        input: "1\nHi. Bye.",
        expected_output: "2",
        description: "With K=1 both single-word sentences qualify.",
      },
      {
        input: "5\nShort note here.",
        expected_output: "0",
        description: "Three words falls short of the 5-word minimum.",
      },
    ],
  },

  {
    id: "prod-03-4",
    project_id: "prod-03",
    order: 4,
    title: "Parsing Messy JSON Safely",
    concept: "extracting JSON from a noisy reply",
    explanation: `You asked for "ONLY a JSON array." Most of the time you get one. But models are not vending machines: sometimes the reply is \\\`\\\`\\\`json ... \\\`\\\`\\\` wrapped in a code fence, sometimes it opens with "Here are your flashcards:", sometimes it adds a friendly "Hope that helps!" at the end. A bare \`json.loads(reply)\` then crashes on the very first surprise. This lesson makes the parse survive reality.

## The failure you're defending against

\`json.loads\` needs the string to be *pure* JSON. Any extra character before or after the array throws \`JSONDecodeError\`, and a crashed parse means the whole chunk's cards are gone. Parsing failures are the number-one way an extraction pipeline breaks, so you harden this one spot and everything downstream steadies out.

## The extract-then-parse trick

The JSON array itself always lives between the first \`[\` and the last \`]\`. So instead of parsing the whole reply, you slice out just that span and parse *that*:

\`\`\`python
import json

def parse_cards(reply):
    try:
        start = reply.index("[")
        end = reply.rindex("]") + 1
    except ValueError:
        return []                 # no array at all, return an empty deck
    snippet = reply[start:end]
    try:
        cards = json.loads(snippet)
    except json.JSONDecodeError:
        return []                 # malformed JSON, don't crash the run
    return cards if isinstance(cards, list) else []
\`\`\`

\`index\` finds the first \`[\`; \`rindex\` finds the last \`]\`. Slicing between them strips any preamble, any trailing chatter, and the code-fence backticks in one move. Two \`try/except\` guards mean a weird reply yields an **empty deck**, never a traceback. Returning \`[]\` on failure is the right default here: one bad chunk shouldn't sink the other twenty.

## Pair it with a retry

Because the whole thing is wrapped safely, you can retry a failed chunk once before giving up:

\`\`\`python
def extract_with_retry(chunk, tries=2):
    for _ in range(tries):
        cards = parse_cards(call_model(chunk))
        if cards:
            return cards
    return []
\`\`\`

Often a second call returns clean JSON when the first didn't. This "extract, and retry if empty" shape is the same defensive pattern you'll reuse across every AI product.

## The runnable drill

Below you implement \`parse_cards\` and run it against several messy replies, one clean, one fenced, one with chatter, one with no array at all, and confirm each returns a sensible list without crashing. The \`json\` module works offline, so this drill exercises the real parse logic end to end.`,
    starter_code: `import json

# Pull the JSON array out of a noisy model reply and parse it safely.
# json works offline, so this is the real logic, no network.

def parse_cards(reply):
    # TODO: find the first "[" and last "]"; if either is missing, return []
    # TODO: slice that span and json.loads it inside a try/except; on any
    #       failure return []. Only return the result if it's a list.
    pass

replies = [
    '[{"question": "Q1?", "answer": "A1"}]',
    'Here are your cards:\\n[{"question": "Q2?", "answer": "A2"}]\\nHope that helps!',
    'Sorry, I could not find any facts.',
]
for r in replies:
    print(len(parse_cards(r)), "cards")
`,
    solution_code: `import json

# Pull the JSON array out of a noisy model reply and parse it safely.
# json works offline, so this is the real logic, no network.

def parse_cards(reply):
    try:
        start = reply.index("[")
        end = reply.rindex("]") + 1
    except ValueError:
        return []
    try:
        cards = json.loads(reply[start:end])
    except json.JSONDecodeError:
        return []
    return cards if isinstance(cards, list) else []

replies = [
    '[{"question": "Q1?", "answer": "A1"}]',
    'Here are your cards:\\n[{"question": "Q2?", "answer": "A2"}]\\nHope that helps!',
    'Sorry, I could not find any facts.',
]
for r in replies:
    cards = parse_cards(r)
    print(len(cards), "cards ->", cards)
`,
    hints: [
      "str.index raises ValueError when the character is absent, catch it and return [].",
      "reply.rindex(\"]\") finds the LAST closing bracket; add 1 so the slice includes it.",
      "Guard json.loads with except json.JSONDecodeError so malformed JSON returns [] instead of crashing.",
    ],
    challenge_title: "Strip the Fence and Extract",
    challenge_description:
      "Given a noisy line, print the substring from the first '[' to the last ']' inclusive, or NONE if there's no array.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    text = sys.stdin.read().rstrip("\\n")
    # TODO: find the first "[" and the last "]". If both exist, print the
    #       substring spanning them (inclusive). Otherwise print "NONE".

main()
`,
    challenge_solution_code: `import sys

def main():
    text = sys.stdin.read().rstrip("\\n")
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end < start:
        print("NONE")
    else:
        print(text[start:end + 1])

main()
`,
    challenge_test_cases: [
      {
        input: "Sure! [1, 2, 3] done.",
        expected_output: "[1, 2, 3]",
        description: "Chatter on both sides is stripped away.",
      },
      {
        input: "no brackets here",
        expected_output: "NONE",
        description: "With no array present, the parse reports NONE.",
      },
      {
        input: "text [a] more [b] end",
        expected_output: "[a] more [b]",
        description: "First '[' to last ']' spans across both bracketed pieces.",
      },
    ],
  },

  {
    id: "prod-03-5",
    project_id: "prod-03",
    order: 5,
    title: "Deduping the Deck",
    concept: "removing duplicate cards",
    explanation: `Chunk your notes into ten pieces and the same fact often turns up in three of them, so your deck ends up with three near-identical cards for "What is the powerhouse of the cell?". Studying the same card three times wastes your time, and a deck full of repeats feels sloppy. This lesson strips the repeats before export.

## Why exact matching isn't enough

You can't just check if two question strings are identical. The model phrases the same fact slightly differently each time:

- \`"What is the powerhouse of the cell?"\`
- \`"What is the powerhouse of the cell"\`  (no question mark)
- \`"what is the POWERHOUSE of the cell?"\`  (different casing)

These are the same card to a human but three different strings to \`==\`. The fix is to compare a **normalized** form of each question, not the raw text.

## Normalize, then dedup

Normalizing means squashing away the differences that don't matter, so equivalent questions collapse to one key:

\`\`\`python
def normalize(question):
    q = question.strip().lower()
    q = q.rstrip("?.!")          # drop trailing punctuation
    q = " ".join(q.split())      # collapse runs of whitespace to single spaces
    return q

def dedup(cards):
    seen = set()
    unique = []
    for card in cards:
        key = normalize(card["question"])
        if key not in seen:
            seen.add(key)
            unique.append(card)
    return unique
\`\`\`

The pattern is the classic **seen-set dedup**: walk the deck once, compute each card's normalized key, and keep a card only the first time its key appears. Using a \`set\` makes the "have I seen this?" check instant even for a big deck. Keeping the *first* occurrence preserves the order the cards were extracted in.

## How aggressive to be

Normalization is a dial. Lowercasing and trimming punctuation is safe, it only merges cards that are truly the same question. You *could* go further (strip filler words, compare meaning with embeddings), but that risks merging two genuinely different cards into one and silently losing a fact. For a flashcard tool, conservative normalization is the right call: better a rare duplicate slips through than a real card disappears.

## The runnable drill

Below you implement \`normalize\` and \`dedup\` and run them on a deck with obvious repeats. Confirm the near-duplicates collapse while distinct cards survive. This is pure Python, no model needed, and it's the last cleaning step before the deck is export-ready.`,
    starter_code: `# Remove duplicate cards by comparing a normalized form of each question.

def normalize(question):
    # TODO: lowercase, strip, remove trailing ? . !, and collapse whitespace
    pass

def dedup(cards):
    # TODO: keep each card only the first time its normalized question appears
    pass

deck = [
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
    {"question": "what is the POWERHOUSE of the cell", "answer": "Mitochondria"},
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
]
print("unique:", len(dedup(deck)))
`,
    solution_code: `# Remove duplicate cards by comparing a normalized form of each question.

def normalize(question):
    q = question.strip().lower()
    q = q.rstrip("?.!")
    q = " ".join(q.split())
    return q

def dedup(cards):
    seen = set()
    unique = []
    for card in cards:
        key = normalize(card["question"])
        if key not in seen:
            seen.add(key)
            unique.append(card)
    return unique

deck = [
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
    {"question": "what is the POWERHOUSE of the cell", "answer": "Mitochondria"},
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
]
result = dedup(deck)
print("unique:", len(result))
for c in result:
    print("-", c["question"])
`,
    hints: [
      "normalize should chain .strip().lower(), then .rstrip(\"?.!\"), then \" \".join(q.split()).",
      "\" \".join(q.split()) collapses any run of spaces or tabs into single spaces.",
      "Track seen keys in a set and append a card only when its key is new, preserving first-seen order.",
    ],
    challenge_title: "Count Unique Cards",
    challenge_description:
      "Given a list of questions, normalize each (lowercase, trim, drop trailing ? and .) and count the distinct ones.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    questions = data[1:1 + n]
    # TODO: normalize each question (strip, lower, rstrip("?."), collapse spaces)
    #       and print how many DISTINCT normalized questions there are.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    questions = data[1:1 + n]

    seen = set()
    for q in questions:
        key = " ".join(q.strip().lower().rstrip("?.").split())
        seen.add(key)
    print(len(seen))

main()
`,
    challenge_test_cases: [
      {
        input: "4\nWhat is Python?\nwhat is python\nA dog barks.\nWhat is Python?",
        expected_output: "2",
        description: "The three Python phrasings collapse to one; the dog fact is the other.",
      },
      {
        input: "1\nHello",
        expected_output: "1",
        description: "A single card is trivially unique.",
      },
      {
        input: "3\nHi\nhi\nHI ",
        expected_output: "1",
        description: "Case and trailing space differences normalize to the same key.",
      },
    ],
  },

  {
    id: "prod-03-6",
    project_id: "prod-03",
    order: 6,
    title: "Watching the Cost",
    concept: "token budgets and batching calls",
    explanation: `Your tool works. Now run it on a 40-page study guide and watch the bill. Every chunk is a separate API call, every call sends tokens in and gets tokens out, and tokens are money. Before shipping, you need a feel for what a run costs and a lever to keep it sane. That lever is **batching**.

## Tokens are the unit of cost

A **token** is a chunk of text, roughly 4 characters of English. You pay for tokens sent (your chunks) and tokens received (the cards). A rough estimator is enough for budgeting:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

To predict a run's input cost, sum the estimate over every chunk plus the system prompt, which you resend on *every* call. That last part is the trap: a 300-token system prompt sent across 50 chunks is 15,000 tokens spent on the prompt alone.

## Batching: fewer calls, less repeated overhead

Instead of one call per chunk, pack several small chunks into a single call, up to a token budget, and extract from all of them at once. Fewer calls means the fixed system-prompt overhead is paid fewer times:

\`\`\`python
def batch_chunks(chunks, budget):
    batches, current, used = [], [], 0
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if current and used + cost > budget:
            batches.append(current)
            current, used = [], 0
        current.append(chunk)
        used += cost
    if current:
        batches.append(current)
    return batches
\`\`\`

This is the greedy packer again, now measured in tokens instead of characters. Each batch stays under \`budget\`; when the next chunk would overflow, you close the batch and open a new one. Ten chunks that once cost ten calls might now fit in three, cutting repeated-prompt overhead by more than half.

## The tradeoff to hold in mind

Batching trades attention for cost. A batch that's too big is back to the lesson-2 problem: the model skims and misses facts. So batch *small related* chunks together, not the whole document. A budget of a few hundred to a couple thousand tokens per batch is a reasonable middle: cheaper than one-call-per-chunk, still small enough to extract carefully. Don't hunt for a magic number. *Measure* a run before you ship, so the cost shows up in your terminal and not on your billing dashboard.

## The runnable drill

Below you estimate tokens for a set of chunks and pack them into batches under a budget, then report the batch count and total tokens. Seeing the call count drop as the budget rises is the whole intuition. Pure Python, no API required.`,
    starter_code: `# Estimate token cost and batch chunks under a per-call token budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def batch_chunks(chunks, budget):
    # TODO: greedily pack chunks into batches so each batch's total estimated
    #       tokens stays <= budget; start a new batch when the next would overflow
    pass

chunks = ["a" * 40, "b" * 40, "c" * 40, "d" * 40]  # ~10 tokens each
batches = batch_chunks(chunks, 25)
print("batches:", len(batches))
`,
    solution_code: `# Estimate token cost and batch chunks under a per-call token budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def batch_chunks(chunks, budget):
    batches, current, used = [], [], 0
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if current and used + cost > budget:
            batches.append(current)
            current, used = [], 0
        current.append(chunk)
        used += cost
    if current:
        batches.append(current)
    return batches

chunks = ["a" * 40, "b" * 40, "c" * 40, "d" * 40]  # ~10 tokens each
batches = batch_chunks(chunks, 25)
print("chunks:", len(chunks))
print("batches (calls):", len(batches))
for i, b in enumerate(batches):
    print(i, "->", len(b), "chunks,", sum(estimate_tokens(c) for c in b), "tokens")
`,
    hints: [
      "estimate_tokens(chunk) is just len(chunk) // 4 (with a floor of 1).",
      "Close the current batch when it's non-empty AND adding the next chunk would exceed budget.",
      "After the loop, append the leftover current batch if it has any chunks.",
    ],
    challenge_title: "Count the API Calls",
    challenge_description:
      "Greedily pack note token-sizes into batches under a budget and report how many API calls that takes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    sizes = list(map(int, data[2].split())) if n > 0 else []
    # TODO: greedily pack sizes into batches so each batch sum stays <= budget
    #       (each size fits alone). Print the number of batches (API calls).

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    sizes = list(map(int, data[2].split())) if n > 0 else []

    batches = 0
    used = 0
    for size in sizes:
        if used and used + size > budget:
            batches += 1
            used = 0
        used += size
    if used:
        batches += 1
    print(batches)

main()
`,
    challenge_test_cases: [
      {
        input: "100\n5\n30 40 50 20 60",
        expected_output: "3",
        description: "Batches [30,40], [50,20], [60] each stay within 100.",
      },
      {
        input: "50\n3\n50 50 50",
        expected_output: "3",
        description: "Each note fills the whole budget, so every one is its own call.",
      },
      {
        input: "100\n0\n",
        expected_output: "0",
        description: "No notes means no API calls.",
      },
    ],
  },

  {
    id: "prod-03-7",
    project_id: "prod-03",
    order: 7,
    title: "Keeping Only Good Cards",
    concept: "validating and repairing the deck",
    explanation: `Even with clean JSON and no duplicates, the model occasionally hands you a card that shouldn't exist: an empty answer, a "question" that's actually a statement, or a card where the question and answer are the same string. Studying junk cards trains bad habits, so the last gate before export is a **validator** that drops anything not worth memorizing.

## What makes a card bad

A few failure modes cover almost all of it:

- **Empty fields.** A missing or blank question or answer, useless.
- **Question equals answer.** \`{"question": "Photosynthesis", "answer": "Photosynthesis"}\` teaches nothing.
- **Runaway length.** A "card" that's a whole paragraph is the model dumping the note instead of extracting a fact. Cap the length.
- **Wrong type.** A stray number or null where a string should be, guard against it so a bad element can't crash the run.

## The validator

Encode those rules as one predicate and filter the deck through it:

\`\`\`python
def is_good(card, max_len=200):
    if not isinstance(card, dict):
        return False
    q, a = card.get("question"), card.get("answer")
    if not isinstance(q, str) or not isinstance(a, str):
        return False
    q, a = q.strip(), a.strip()
    if not q or not a:
        return False
    if q.lower() == a.lower():
        return False
    if len(q) > max_len or len(a) > max_len:
        return False
    return True

good = [c for c in cards if is_good(c)]
dropped = len(cards) - len(good)
\`\`\`

Notice the order: cheapest, most-likely checks first (type, emptiness), then the subtler ones. Each rule is one line, and together they turn "the model probably behaved" into a guarantee your export step can trust.

## Report, don't hide

Print how many cards you dropped. A run that quietly discards half its cards is telling you the notes were thin or a chunk failed, and you want to *see* that, not wonder why your deck is short. A validator that shows what it threw away earns your trust in a way a silent one never will:

\`\`\`python
print(f"Kept {len(good)} cards, dropped {dropped}.")
\`\`\`

## The runnable drill

Below you implement \`is_good\` and run a deck containing each failure mode past it, then report kept versus dropped. This is the production-readiness step: the same "validate every item, count what you rejected" pattern hardens every AI pipeline you'll build. Pure Python, no model needed.`,
    starter_code: `# Keep only cards worth studying; report how many you dropped.

def is_good(card, max_len=200):
    # TODO: reject non-dicts, non-string or empty question/answer,
    #       cards where question == answer (case-insensitive),
    #       and cards where either field is longer than max_len
    pass

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": "Photosynthesis", "answer": "Photosynthesis"},
    {"question": "", "answer": "no question"},
    {"question": "Capital of Japan?", "answer": "Tokyo"},
]
good = [c for c in deck if is_good(c)]
print("kept:", len(good), "dropped:", len(deck) - len(good))
`,
    solution_code: `# Keep only cards worth studying; report how many you dropped.

def is_good(card, max_len=200):
    if not isinstance(card, dict):
        return False
    q, a = card.get("question"), card.get("answer")
    if not isinstance(q, str) or not isinstance(a, str):
        return False
    q, a = q.strip(), a.strip()
    if not q or not a:
        return False
    if q.lower() == a.lower():
        return False
    if len(q) > max_len or len(a) > max_len:
        return False
    return True

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": "Photosynthesis", "answer": "Photosynthesis"},
    {"question": "", "answer": "no question"},
    {"question": "Capital of Japan?", "answer": "Tokyo"},
]
good = [c for c in deck if is_good(c)]
print("kept:", len(good), "dropped:", len(deck) - len(good))
for c in good:
    print("-", c["question"], "->", c["answer"])
`,
    hints: [
      "Check the cheap conditions first: isinstance(card, dict), then the field types, then emptiness.",
      "Compare q.lower() == a.lower() so \"Cell\" and \"cell\" still count as identical.",
      "dropped is just len(deck) - len(good); print it so thin runs are visible.",
    ],
    challenge_title: "Keep Valid Cards",
    challenge_description:
      "Given question|answer cards, keep those with both fields non-empty and question != answer, and print kept and dropped counts.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # TODO: split each line on "|". A card is valid if it has exactly two parts,
    #       both non-empty after strip, and the two parts differ (case-insensitive).
    #       Print "kept dropped".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    kept = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 2:
            continue
        q, a = parts[0].strip(), parts[1].strip()
        if q and a and q.lower() != a.lower():
            kept += 1
    print(kept, n - kept)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nWhat is 2+2?|4\nsame|same\n|empty q",
        expected_output: "1 2",
        description: "Only the first card survives; the others repeat or are empty.",
      },
      {
        input: "1\nQ|A",
        expected_output: "1 0",
        description: "A single well-formed card is kept.",
      },
      {
        input: "2\na|a\nb|",
        expected_output: "0 2",
        description: "Identical fields and an empty answer are both dropped.",
      },
    ],
  },

  {
    id: "prod-03-8",
    project_id: "prod-03",
    order: 8,
    title: "Export to CSV and Ship",
    concept: "writing an Anki-ready CSV",
    explanation: `The deck is extracted, deduped, and validated. Now make it *usable*: write it to a CSV file that imports straight into Anki, Quizlet, or a spreadsheet. Getting the file format exactly right is what turns your script into a tool someone else can actually run.

## Why CSV, and why it's trickier than it looks

Anki imports a plain CSV: one row per card, question in the first column, answer in the second. The catch is that flashcard text is full of the characters CSV uses as control codes, commas, quotes, and newlines. A question like \`Say "hi", then wave\` naively written as \`Say "hi", then wave,answer\` has a stray comma that splits it into the wrong columns. You must **escape** those fields.

The rule (RFC 4180): if a field contains a comma, a double-quote, or a newline, wrap the whole field in double-quotes and double any interior quotes. Python's \`csv\` module does this correctly so you never hand-roll it:

\`\`\`python
import csv

def export_csv(cards, path="deck.csv"):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for card in cards:
            writer.writerow([card["question"], card["answer"]])
\`\`\`

\`csv.writer\` handles every escaping edge case, quotes, commas, newlines inside a field, so \`Say "hi", then wave\` lands in exactly one column. The \`newline=""\` argument is required on the \`open\` call; without it you get blank rows between cards on some platforms.

## The finished pipeline

Every piece from the last seven lessons now lines up into one flow:

\`\`\`python
raw = load_notes("notes.txt")
chunks = chunk_notes(raw)                       # lesson 2
batches = batch_chunks(chunks, budget=1500)     # lesson 6
cards = []
for batch in batches:
    reply = call_model("\\n\\n".join(batch))      # lessons 1, 3
    cards.extend(parse_cards(reply))            # lesson 4
cards = dedup(cards)                             # lesson 5
cards = [c for c in cards if is_good(c)]         # lesson 7
export_csv(cards, "deck.csv")                    # this lesson
print(f"Wrote {len(cards)} cards to deck.csv")
\`\`\`

Notes in one end, an Anki-ready deck out the other. That's the whole product.

## What "shipped" means here

It's shipped when it runs from a clean start with one command, survives an empty or junk notes file without crashing (you return \`[]\` and write a header-only file instead of throwing), and someone else could run it from your README. Keep a sample \`notes.txt\` and the \`deck.csv\` it produces as proof it works.

## It lands in your Portfolio

Finishing this lesson saves **Flashcard Maker** to your **Portfolio** tab, with the title and what you built: a notes-to-flashcards tool with structured extraction, dedup, cost batching, validation, and CSV export. You walk away with something you can show off. The runnable drill below builds the escaped CSV text in memory (using the same \`csv\` module, which works offline) so you can see the exact bytes your file will contain.`,
    starter_code: `import csv, io

# Turn the finished deck into Anki-ready CSV text, correctly escaped.
# csv works offline; we write to an in-memory buffer instead of a file.

def to_csv(cards):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    # TODO: write one row per card: [question, answer]
    return buffer.getvalue()

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": 'Say "hi", ok?', "answer": "Greeting"},
]
print(to_csv(deck))
`,
    solution_code: `import csv, io

# Turn the finished deck into Anki-ready CSV text, correctly escaped.
# csv works offline; we write to an in-memory buffer instead of a file.

def to_csv(cards):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    for card in cards:
        writer.writerow([card["question"], card["answer"]])
    return buffer.getvalue()

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": 'Say "hi", ok?', "answer": "Greeting"},
]
print(to_csv(deck), end="")
print("cards exported:", len(deck))
`,
    hints: [
      "Loop the cards and call writer.writerow([card[\"question\"], card[\"answer\"]]) for each.",
      "csv.writer handles all the escaping; never build the comma-joined line yourself.",
      "io.StringIO() gives csv.writer a file-like buffer so you can capture the text with getvalue().",
    ],
    challenge_title: "Escape the CSV Row",
    challenge_description:
      "Turn question|answer cards into properly escaped CSV rows: quote any field containing a comma or quote, doubling interior quotes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def escape(field):
    # TODO: if field contains a comma or a double-quote, wrap it in double-quotes
    #       and double any interior double-quotes; otherwise return it unchanged
    pass

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for line in data[1:1 + n]:
        q, a = line.split("|")
        print(escape(q) + "," + escape(a))

main()
`,
    challenge_solution_code: `import sys

def escape(field):
    if "," in field or '"' in field:
        return '"' + field.replace('"', '""') + '"'
    return field

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for line in data[1:1 + n]:
        q, a = line.split("|")
        print(escape(q) + "," + escape(a))

main()
`,
    challenge_test_cases: [
      {
        input: '2\nWhat is 2+2?|4\nSay "hi", ok?|Greeting',
        expected_output: 'What is 2+2?,4\n"Say ""hi"", ok?",Greeting',
        description: "The plain card passes through; the one with a comma and quotes is escaped.",
      },
      {
        input: "1\na|b",
        expected_output: "a,b",
        description: "Fields with no special characters need no quoting.",
      },
      {
        input: "1\nhas,comma|plain",
        expected_output: '"has,comma",plain',
        description: "A field containing a comma gets wrapped in double-quotes.",
      },
    ],
  },
];

export default { project, lessons };
