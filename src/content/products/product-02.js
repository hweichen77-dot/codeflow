export default {
  project: {
    id: "prod-02",
    title: "Smart Reply Generator",
    description:
      "Build a tool that drafts email and message replies in your own voice. Feed it an incoming message and a few of your past replies. It measures how you write, produces a handful of drafts, and returns the one that sounds most like you.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 120,
    lessons_count: 8,
    tags: ["smart-reply", "tone-matching", "few-shot", "email", "drafting", "prompting"],
    order: 102,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-02-1",
      project_id: "prod-02",
      order: 1,
      title: "Frame a Reply, Not a Chat",
      concept: "reply generation as a shaped request",
      explanation: `A Smart Reply Generator does one job. You paste in a message someone sent you, and it hands back a reply you could actually send. Before any tone-matching or draft-picking, build the smallest thing that works: take an incoming message and turn it into a request the model can answer.

## Reply drafting is not chatting

A chatbot talks *with* you. A reply generator writes *as* you, to a third person. That difference changes how you build the request. The model is not your conversation partner here. It is a ghostwriter. The incoming message is not something you reply to; it is data the model reads to draft *your* reply.

To express that, put a short instruction and the incoming message into one \`user\` turn.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

incoming = "Hey, are we still on for lunch Friday?"

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You draft a reply to the message below in the user's voice. Return only the reply.",
    messages=[{"role": "user", "content": f"Incoming message:\\n{incoming}\\n\\nWrite a reply."}],
)
print(resp.content[0].text)
\`\`\`

## Why the framing matters

Two rules save you from the most common beginner bug: the model answering the message *to you* instead of drafting a reply *for you*.

- **The system prompt names the job**: "draft a reply in the user's voice." Without it, the model chats back.
- **"Return only the reply"** stops it from wrapping the draft in a "Sure! Here's a reply you could send:" preamble that you would then have to strip.

The rest of this product (tone capture, few-shot examples, picking among drafts) hangs off this skeleton. Get the request shape right first and the smart parts slot in later.

## Keep this in mind

Treat the incoming message as the subject line on a task, not a turn in a conversation. Your program reads the incoming message, wraps it in one clear instruction, and asks for exactly one thing back: a reply. In the drill below you build that request by hand. No network, just the messages list. Getting the data shape right is the part that actually matters.`,
      starter_code: `# Turn an incoming message into a draft-reply request (no API yet).
# We build the messages list by hand so it runs offline.

SYSTEM = "You draft a reply to the message below in the user's voice. Return only the reply."

def build_messages(incoming):
    # TODO: return a messages list with ONE user turn.
    #       The content should frame the incoming message and ask for a reply,
    #       e.g. "Incoming message:\\n<incoming>\\n\\nWrite a reply."
    pass

incoming = "Hey, are we still on for lunch Friday?"
messages = build_messages(incoming)
print("turns:", len(messages))
print(messages[0]["role"], "->", messages[0]["content"])
`,
      solution_code: `# Turn an incoming message into a draft-reply request (no API yet).
# We build the messages list by hand so it runs offline.

SYSTEM = "You draft a reply to the message below in the user's voice. Return only the reply."

def build_messages(incoming):
    prompt = f"Incoming message:\\n{incoming}\\n\\nWrite a reply."
    return [{"role": "user", "content": prompt}]

incoming = "Hey, are we still on for lunch Friday?"
messages = build_messages(incoming)

print("turns:", len(messages))
print(messages[0]["role"], "->", messages[0]["content"])
`,
      hints: [
        "The messages list holds one dict: {\"role\": \"user\", \"content\": ...}.",
        "Build the content with an f-string that includes the incoming message.",
        "Use \\n inside the string to put the instruction on its own line.",
      ],
      challenge_title: "Which Messages Need a Reply?",
      challenge_description:
        "Before drafting, sort a batch of incoming messages: questions need a reply, statements are just FYI.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # data[1..n] are the incoming messages, one per line.

    # TODO: for each incoming message, print "REPLY NEEDED: <msg>" if it ends
    #       with a "?" (after stripping trailing spaces), otherwise "FYI: <msg>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for i in range(1, n + 1):
        msg = data[i]
        if msg.rstrip().endswith("?"):
            print("REPLY NEEDED: " + msg)
        else:
            print("FYI: " + msg)

main()
`,
      challenge_test_cases: [
        {
          input: "3\nAre we on for lunch?\nThanks so much\nCan you send the file?",
          expected_output: "REPLY NEEDED: Are we on for lunch?\nFYI: Thanks so much\nREPLY NEEDED: Can you send the file?",
          description: "Two questions need replies; the thank-you is FYI.",
        },
        {
          input: "1\nGreat, thanks!",
          expected_output: "FYI: Great, thanks!",
          description: "A single statement is FYI only.",
        },
        {
          input: "2\nWhen?\nSee you.",
          expected_output: "REPLY NEEDED: When?\nFYI: See you.",
          description: "Short question still counts; the sign-off does not.",
        },
      ],
    },

    {
      id: "prod-02-2",
      project_id: "prod-02",
      order: 2,
      title: "Get One Clean Draft Back",
      concept: "extracting and cleaning the reply text",
      explanation: `You sent the request; now the model sends something back. The smallest working version of this product has to pull one clean draft string out of that response, ready to drop into an email box. This lesson is that step.

## Where the text actually lives

The Messages API does not return a bare string. It returns a response object whose text sits inside a content list:

\`\`\`python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You draft a reply in the user's voice. Return only the reply.",
    messages=[{"role": "user", "content": "Incoming message:\\nLunch Friday?\\n\\nWrite a reply."}],
)
draft = resp.content[0].text
\`\`\`

\`resp.content\` is a list of content blocks. For a plain text reply you want \`content[0].text\`. That is the raw draft.

## Raw is not the same as clean

Even when you say "return only the reply," models sometimes lead with a throat-clear: "Sure, here's a reply:" on its own line, then the actual draft. Paste that straight into an email and you have shipped the model's stage directions. The smallest useful fix is a tiny cleaner that drops a leading preamble line.

One heuristic works well: if the first line ends with a colon, it is almost always a preamble ("Here's a draft:", "Sure, here you go:"). Strip it and keep the rest.

\`\`\`python
def extract_draft(raw):
    text = raw.strip()
    lines = text.split("\\n")
    if lines[0].rstrip().endswith(":"):
        text = "\\n".join(lines[1:]).strip()
    return text
\`\`\`

## Why bother this early

You might want to skip cleaning until the harden lessons. But a draft with a preamble line looks fine in a print statement and breaks the moment a real user copies it. Parsing the reply into exactly the string you would send is part of the core loop, not a nicety. Later lessons add more cleaning for empty checks, length caps, and stray quotes. This is the first and most common case.

## Keep this in mind

The model hands you a package, not a note. Open the package (response object to content block to text), then peel off any wrapper the model added. What is left is the draft. In the drill you write that peeler against a few realistic raw outputs, so a stray "Here's a reply:" never reaches the user.`,
      starter_code: `# Pull a clean draft out of a raw model reply (simulated, no API).

RAW = "Here is a draft:\\n\\nSounds good, Friday works!"

def extract_draft(raw):
    text = raw.strip()
    lines = text.split("\\n")
    # TODO: if the first line ends with ":", it's a preamble.
    #       Drop it and keep the rest, then return the stripped text.
    return text

print(extract_draft(RAW))
`,
      solution_code: `# Pull a clean draft out of a raw model reply (simulated, no API).

def extract_draft(raw):
    text = raw.strip()
    lines = text.split("\\n")
    if lines[0].rstrip().endswith(":"):
        text = "\\n".join(lines[1:]).strip()
    return text

samples = [
    "Here is a draft:\\n\\nSounds good, Friday works!",
    "Friday works for me!",
    "Sure, here you go:\\nSee you then.",
]
for raw in samples:
    print(extract_draft(raw))
`,
      hints: [
        "Split the text on \\n so you can inspect the first line.",
        "lines[0].rstrip().endswith(\":\") tells you it's a preamble.",
        "Rejoin lines[1:] with \\n and .strip() the result before returning.",
      ],
      challenge_title: "Strip the Preamble",
      challenge_description:
        "Take a raw model reply from stdin and print only the draft, dropping any leading preamble line that ends with a colon.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read().strip()
    lines = raw.split("\\n")
    # TODO: if the first line ends with ":" (after rstrip), drop it.
    #       Print the remaining lines joined by \\n, stripped.

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read().strip()
    lines = raw.split("\\n")
    if lines and lines[0].rstrip().endswith(":"):
        lines = lines[1:]
    result = "\\n".join(lines).strip()
    print(result)

main()
`,
      challenge_test_cases: [
        {
          input: "Sure, here's a reply:\nThanks for the update, I'll take a look.",
          expected_output: "Thanks for the update, I'll take a look.",
          description: "Preamble line ending in a colon is removed.",
        },
        {
          input: "Friday works for me!",
          expected_output: "Friday works for me!",
          description: "No preamble means the text passes through unchanged.",
        },
        {
          input: "Here you go:\n\nHappy to help.",
          expected_output: "Happy to help.",
          description: "Preamble plus a blank line both get cleaned away.",
        },
      ],
    },

    {
      id: "prod-02-3",
      project_id: "prod-02",
      order: 3,
      title: "Capture the User's Tone",
      concept: "building a tone profile from sample replies",
      explanation: `A generic reply is useless. "Thank you for your message. I would be delighted to attend." is technically correct and sounds nothing like how you text a friend. Making the draft sound like *you* is the core of this product, and it starts by measuring how you actually write.

## Tone is a set of measurable habits

You can't hand the model a vibe, but you can hand it observable habits pulled from your past replies:

- **Length**: do you write 4-word replies or 40-word ones?
- **Greeting**: do you open with "Hey" / "Hi", or dive straight in?
- **Sign-off**: do you close with "Thanks" / "Cheers", or just stop?
- **Energy**: exclamation marks and emoji, or flat and dry?

Compute those from a handful of sample replies and you have a **tone profile**: a small dict that captures your writing fingerprint. You then feed it to the model as explicit instructions:

\`\`\`python
profile = build_profile(user_samples)   # e.g. {"avg_words": 6, "greeting": True, ...}

system = (
    "You draft a reply in the user's voice. Match this style:\\n"
    f"- about {profile['avg_words']} words\\n"
    f"- {'open with a greeting' if profile['greeting'] else 'no greeting'}\\n"
    f"- {'use an exclamation' if profile['exclaim'] else 'keep it flat'}"
)
\`\`\`

## Why measure instead of guess

Write "casual and friendly" in the prompt and the model picks its own idea of casual, which drifts toward chirpy customer-service English. Numbers leave no room for that. "About 6 words" is a target the model can hit; "be concise" is not. It is the same lesson as prompt-writing everywhere: specific beats vague, and measured beats specific.

## What we build in the drill

A \`build_profile\` function that walks the sample replies and returns the profile dict:

- \`avg_words\`: the rounded average word count across samples.
- \`greeting\`: True if any sample opens with hi/hey/hello.
- \`signoff\`: True if any sample contains thanks/cheers/best/regards.
- \`exclaim\`: True if any sample uses "!".

No API call. This is pure text analysis, and it is the piece that does the most to make replies feel personal.

## Keep this in mind

You are not asking the model to guess your style. You are sampling it from evidence and stating it as rules. The tone profile turns "how this person writes" into instructions a model can follow exactly. The few-shot examples and draft-picking downstream both lean on this profile to keep drafts on-voice.`,
      starter_code: `# Build a tone profile from a user's past replies (pure text analysis).

samples = [
    "Hey! Sounds great, see you then.",
    "Thanks so much, works for me!",
    "Sure, I'll be there.",
]

def build_profile(replies):
    # TODO: return a dict with:
    #   avg_words -> rounded average word count across replies
    #   greeting  -> True if any reply starts with hi/hey/hello (case-insensitive)
    #   signoff   -> True if any reply contains thanks/cheers/best/regards
    #   exclaim   -> True if any reply contains "!"
    pass

profile = build_profile(samples)
print("avg_words:", profile["avg_words"])
print("greeting:", profile["greeting"])
print("signoff:", profile["signoff"])
print("exclaim:", profile["exclaim"])
`,
      solution_code: `# Build a tone profile from a user's past replies (pure text analysis).

samples = [
    "Hey! Sounds great, see you then.",
    "Thanks so much, works for me!",
    "Sure, I'll be there.",
]

def build_profile(replies):
    total_words = sum(len(r.split()) for r in replies)
    avg_words = round(total_words / len(replies))
    greeting = any(r.lower().startswith(("hi", "hey", "hello")) for r in replies)
    signoff = any(
        any(w in r.lower() for w in ("thanks", "cheers", "best", "regards"))
        for r in replies
    )
    exclaim = any("!" in r for r in replies)
    return {
        "avg_words": avg_words,
        "greeting": greeting,
        "signoff": signoff,
        "exclaim": exclaim,
    }

profile = build_profile(samples)
print("avg_words:", profile["avg_words"])
print("greeting:", profile["greeting"])
print("signoff:", profile["signoff"])
print("exclaim:", profile["exclaim"])
`,
      hints: [
        "len(reply.split()) counts words in one reply; average over all of them.",
        "reply.lower().startswith((\"hi\", \"hey\", \"hello\")) checks the greeting.",
        "any(...) collapses a per-reply check into one True/False for the profile.",
      ],
      challenge_title: "Tone Fingerprint",
      challenge_description:
        "Read a batch of the user's replies and report three tone signals: how many use a greeting, how many use an exclamation, and the average word count.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    replies = [data[i] for i in range(1, n + 1)]

    # TODO: print three lines:
    #   greetings=<count of replies starting with hi/hey/hello, case-insensitive>
    #   exclaims=<count of replies containing "!">
    #   avgwords=<rounded average word count across the replies>

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    replies = [data[i] for i in range(1, n + 1)]

    greetings = sum(1 for r in replies if r.lower().startswith(("hi", "hey", "hello")))
    exclaims = sum(1 for r in replies if "!" in r)
    total_words = sum(len(r.split()) for r in replies)
    avg = round(total_words / n) if n else 0

    print("greetings=" + str(greetings))
    print("exclaims=" + str(exclaims))
    print("avgwords=" + str(avg))

main()
`,
      challenge_test_cases: [
        {
          input: "3\nHey! see you then\nThanks so much\nSure, I'll be there.",
          expected_output: "greetings=1\nexclaims=1\navgwords=4",
          description: "One greeting, one exclamation, 11 words over 3 replies rounds to 4.",
        },
        {
          input: "2\nHi there\nHello!",
          expected_output: "greetings=2\nexclaims=1\navgwords=2",
          description: "Both open with a greeting; only the second has an exclamation.",
        },
      ],
    },

    {
      id: "prod-02-4",
      project_id: "prod-02",
      order: 4,
      title: "Show, Don't Tell: Few-Shot Examples",
      concept: "steering tone with example reply pairs",
      explanation: `Describing your tone in rules gets you close. The most direct way to make the model write like you is to *show* it you writing: a couple of real (incoming message, your reply) pairs. This is **few-shot prompting**, and it is the biggest quality jump in this product.

## What few-shot means

Zero-shot is asking with instructions only. Few-shot is asking with a handful of worked examples first, so the model pattern-matches off your actual replies instead of its own defaults. You express the examples as prior \`user\`/\`assistant\` turns: the incoming message as a user turn, *your* real reply as the assistant turn. Then you append the *new* incoming message as the final user turn.

\`\`\`python
examples = [
    ("Lunch Friday?", "Sounds good, see you then!"),
    ("Can you review the doc?", "Sure, I'll take a look today."),
]

messages = []
for incoming, reply in examples:
    messages.append({"role": "user", "content": incoming})
    messages.append({"role": "assistant", "content": reply})
messages.append({"role": "user", "content": "Are you free Monday?"})
\`\`\`

The model reads two rounds where "you" answered short, warm, and exclamation-friendly, then sees the new question and continues the pattern. It is imitation, not instruction, and imitation is what tone actually is.

## Why this beats a longer rulebook

You could write a paragraph describing your voice, but the model still has to interpret it. An example removes the interpretation. It shows the target output directly: shape, length, warmth. Two good examples usually outperform ten lines of rules. It also composes with the tone profile from the last lesson, examples for feel and profile numbers for guardrails.

## The shape rule that trips people up

The turns must alternate user/assistant/user/assistant and start with a user turn, which is the Messages API rule. Each example is one user turn plus one assistant turn, so pairs keep the alternation intact. The final, real incoming message is one more user turn, leaving the model to produce the next assistant turn: your draft.

## Keep this in mind

You are building a fake transcript where past-you already answered a few messages in your own voice, then handing the model the newest message mid-conversation. The model does not know the earlier turns were staged. It just keeps writing in the established style. In the drill you assemble that few-shot messages list from example pairs plus a new incoming message.`,
      starter_code: `# Assemble a few-shot messages list from example (incoming, reply) pairs.

examples = [
    ("Lunch Friday?", "Sounds good, see you then!"),
    ("Can you review the doc?", "Sure, I'll take a look today."),
]
new_incoming = "Are you free Monday?"

def build_few_shot(examples, incoming):
    messages = []
    # TODO: for each (incoming, reply) pair, append a user turn then an
    #       assistant turn. Then append the NEW incoming as a final user turn.
    return messages

messages = build_few_shot(examples, new_incoming)
print("turns:", len(messages))
print("roles:", " ".join(m["role"] for m in messages))
print("last:", messages[-1]["content"])
`,
      solution_code: `# Assemble a few-shot messages list from example (incoming, reply) pairs.

examples = [
    ("Lunch Friday?", "Sounds good, see you then!"),
    ("Can you review the doc?", "Sure, I'll take a look today."),
]
new_incoming = "Are you free Monday?"

def build_few_shot(examples, incoming):
    messages = []
    for ex_incoming, ex_reply in examples:
        messages.append({"role": "user", "content": ex_incoming})
        messages.append({"role": "assistant", "content": ex_reply})
    messages.append({"role": "user", "content": incoming})
    return messages

messages = build_few_shot(examples, new_incoming)
print("turns:", len(messages))
print("roles:", " ".join(m["role"] for m in messages))
print("last:", messages[-1]["content"])
`,
      hints: [
        "Each example contributes two turns: a user turn then an assistant turn.",
        "Loop the pairs first, then append the real incoming message last.",
        "n examples plus the new message gives 2*n + 1 turns.",
      ],
      challenge_title: "Assemble the Few-Shot Prompt",
      challenge_description:
        "Given example (incoming, reply) pairs and a new incoming message, print the turn count and each turn's role in order.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    idx = 1
    turns = []
    # data[1..2n] alternate incoming, reply, incoming, reply, ...
    # data[1 + 2n] is the new incoming message.

    # TODO: build 'turns' as (role, content) tuples: each example is a user
    #       turn then an assistant turn; finish with the new incoming as user.
    # TODO: print "turns: <count>", then each role on its own line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    idx = 1
    turns = []
    for _ in range(n):
        incoming = data[idx]; idx += 1
        reply = data[idx]; idx += 1
        turns.append(("user", incoming))
        turns.append(("assistant", reply))
    new_incoming = data[idx]
    turns.append(("user", new_incoming))

    print("turns:", len(turns))
    for role, _ in turns:
        print(role)

main()
`,
      challenge_test_cases: [
        {
          input: "2\nLunch Friday?\nSounds good!\nReview doc?\nOn it.\nFree Monday?",
          expected_output: "turns: 5\nuser\nassistant\nuser\nassistant\nuser",
          description: "Two example pairs plus one new incoming gives five alternating turns.",
        },
        {
          input: "1\nHey?\nHi!\nBye?",
          expected_output: "turns: 3\nuser\nassistant\nuser",
          description: "One example pair plus the new incoming gives three turns.",
        },
      ],
    },

    {
      id: "prod-02-5",
      project_id: "prod-02",
      order: 5,
      title: "Generate Several, Pick the Best",
      concept: "scoring multiple drafts against the tone profile",
      explanation: `A single draft is a coin flip. Sometimes the model nails your voice; sometimes it lands a touch too formal or three words too long. The fix is to generate *several* drafts and automatically keep the one that best matches your tone. This is where the tone profile pays off a second time.

## Why more than one draft

Language models are non-deterministic, especially with a little \`temperature\`. Ask for the same reply twice and you get two different phrasings. Rather than fight that, use it: request a few candidates, then rank them and surface the best. The user still sees one clean reply. You improved your odds behind the scenes.

\`\`\`python
drafts = []
for _ in range(3):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        temperature=0.9,
        system=system_from_profile,
        messages=few_shot_messages,
    )
    drafts.append(resp.content[0].text.strip())

best = min(drafts, key=lambda d: tone_distance(d, profile))
\`\`\`

## Scoring is just measuring the gap

You already know how to measure tone (lesson 3). To pick, measure how far each draft sits from the profile and take the smallest gap. One distance that works:

- Start with the absolute difference between the draft's word count and your \`avg_words\`.
- Add a penalty when the draft's energy disagrees with your profile (it has no "!" but you use them, or the reverse).

Lower score means closer to your voice. On ties, keep the first draft so the result stays deterministic.

\`\`\`python
def tone_distance(draft, profile):
    score = abs(len(draft.split()) - profile["avg_words"])
    if ("!" in draft) != profile["exclaim"]:
        score += 3
    return score
\`\`\`

## Why this matters

Picking among drafts is a general reliability pattern, not a one-off. Any time output quality varies, generate a few and select with a cheap scorer you control. You add a judgment step your program owns instead of trusting a single roll of the dice. The scorer here is deliberately simple; you can make it richer later.

## Keep this in mind

Generation is creative and noisy. Selection is strict and yours. Let the model brainstorm several replies, then be the editor who keeps the one that sounds most like you. In the drill you score a set of candidate drafts against a target and return the best index, which is the selection half of this pattern.`,
      starter_code: `# Score candidate drafts against a tone target and pick the closest.

target = {"avg_words": 6, "exclaim": True}
drafts = [
    "Sure, sounds great, I'll be there!",
    "Yes.",
    "Absolutely, that works perfectly for me!",
]

def tone_distance(draft, target):
    # TODO: absolute gap between word count and target["avg_words"],
    #       plus 3 if the draft's use of "!" disagrees with target["exclaim"].
    pass

def pick_best(drafts, target):
    # TODO: return the draft with the smallest tone_distance (first on ties).
    pass

for i, d in enumerate(drafts):
    print("draft", i, "score", tone_distance(d, target))
print("best:", pick_best(drafts, target))
`,
      solution_code: `# Score candidate drafts against a tone target and pick the closest.

target = {"avg_words": 6, "exclaim": True}
drafts = [
    "Sure, sounds great, I'll be there!",
    "Yes.",
    "Absolutely, that works perfectly for me!",
]

def tone_distance(draft, target):
    score = abs(len(draft.split()) - target["avg_words"])
    if ("!" in draft) != target["exclaim"]:
        score += 3
    return score

def pick_best(drafts, target):
    best = drafts[0]
    best_score = tone_distance(best, target)
    for d in drafts[1:]:
        s = tone_distance(d, target)
        if s < best_score:
            best_score = s
            best = d
    return best

for i, d in enumerate(drafts):
    print("draft", i, "score", tone_distance(d, target))
print("best:", pick_best(drafts, target))
`,
      hints: [
        "Word count is len(draft.split()); compare it to target[\"avg_words\"].",
        "(\"!\" in draft) != target[\"exclaim\"] is True when the energy disagrees.",
        "Track the lowest score as you scan; keep the first draft on ties by using strict <.",
      ],
      challenge_title: "Pick the On-Tone Draft",
      challenge_description:
        "Given a target word count and several candidate drafts, print the index and text of the draft whose length is closest to the target (first on ties).",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    target = int(data[0])
    n = int(data[1])
    drafts = [data[2 + i] for i in range(n)]

    # TODO: score each draft by abs(word_count - target); pick the smallest.
    #       On ties keep the earliest draft. Print the index, then the draft.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    target = int(data[0])
    n = int(data[1])
    drafts = [data[2 + i] for i in range(n)]

    best_i = 0
    best_score = None
    for i, d in enumerate(drafts):
        score = abs(len(d.split()) - target)
        if best_score is None or score < best_score:
            best_score = score
            best_i = i

    print(best_i)
    print(drafts[best_i])

main()
`,
      challenge_test_cases: [
        {
          input: "6\n3\nYes.\nSure, sounds great, I'll be there!\nAbsolutely that works perfectly for me!",
          expected_output: "1\nSure, sounds great, I'll be there!",
          description: "Draft 1 hits 6 words exactly; draft 2 also scores 0 but loses the tie.",
        },
        {
          input: "3\n2\nHi there friend\nHey",
          expected_output: "0\nHi there friend",
          description: "Three words matches the target better than one.",
        },
        {
          input: "2\n2\nOne two\nThree four",
          expected_output: "0\nOne two",
          description: "Exact tie on length keeps the earliest draft.",
        },
      ],
    },

    {
      id: "prod-02-6",
      project_id: "prod-02",
      order: 6,
      title: "When the Draft Comes Back Broken",
      concept: "validating and repairing model output",
      explanation: `Your generator works on the happy path. Now make it survive the ugly one. Models occasionally return an empty string, a novel three paragraphs long, or a draft wrapped in "quotation marks" as if quoting itself. A tool that copies those straight into someone's inbox is not finished. This is the hardening lesson.

## The three failure shapes

Almost every bad reply is one of these:

1. **Empty or whitespace**: the model returned nothing usable. Catch this and fall back; never send a blank reply.
2. **Wrapped in quotes**: it returned \`"Sounds good!"\` with literal quote marks, because it treated the reply as a quotation. Strip the surrounding quotes.
3. **Too long**: a one-line question got a five-sentence essay. Cap the length so it stays reply-sized.

A single cleaner handles all three:

\`\`\`python
def clean_draft(raw, max_words):
    text = raw.strip().strip('"').strip()
    if not text:
        return None                       # signal: unusable, fall back
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words])
    return text
\`\`\`

Note the order: strip whitespace, then quotes, then whitespace again, since a leading space can hide inside the quotes. \`None\` is a deliberate signal that this draft is unusable. The caller can then try the next candidate or a safe default.

## Fallbacks, not crashes

Robustness here means degrading gracefully. If every candidate cleans to \`None\`, don't raise. Return a safe generic reply like "Thanks, I'll get back to you." A tool that always produces something sendable beats one that occasionally explodes. This is the same retry-and-repair pattern used across the whole track: assume the model will misbehave sometimes, and design the surrounding code to absorb it.

\`\`\`python
def choose_reply(candidates, max_words, fallback="Thanks, I'll get back to you."):
    cleaned = [clean_draft(c, max_words) for c in candidates]
    usable = [c for c in cleaned if c]
    return usable[0] if usable else fallback
\`\`\`

## Why this matters

The gap between a demo and a tool is exactly this code. The demo shows the model doing something clever once. The tool keeps working when the model returns garbage on a Tuesday. Each guard you add (empty check, quote strip, length cap) is the difference between "cool" and "I actually use this."

## Keep this in mind

Treat every draft as untrusted input, because it came from a probabilistic system. Clean it, validate it, and keep a fallback in your back pocket. In the drill you build the cleaner that rejects empty drafts and trims overlong ones.`,
      starter_code: `# Clean and validate raw drafts; reject the unusable ones.

drafts = [
    '  "Sounds good!"  ',
    '',
    'Yes I would absolutely love to join you all for the big lunch on Friday afternoon downtown',
]
MAX_WORDS = 8

def clean_draft(raw, max_words):
    text = raw.strip().strip('"').strip()
    # TODO: if text is empty, return "" (unusable).
    # TODO: if it has more than max_words words, keep only the first max_words.
    return text

for d in drafts:
    print("[" + clean_draft(d, MAX_WORDS) + "]")
`,
      solution_code: `# Clean and validate raw drafts; reject the unusable ones.

drafts = [
    '  "Sounds good!"  ',
    '',
    'Yes I would absolutely love to join you all for the big lunch on Friday afternoon downtown',
]
MAX_WORDS = 8

def clean_draft(raw, max_words):
    text = raw.strip().strip('"').strip()
    if not text:
        return ""
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words])
    return text

for d in drafts:
    print("[" + clean_draft(d, MAX_WORDS) + "]")
`,
      hints: [
        "strip().strip('\"').strip() removes outer whitespace, then quotes, then whitespace again.",
        "An empty result after stripping means the draft is unusable.",
        "\" \".join(words[:max_words]) truncates an overlong draft cleanly.",
      ],
      challenge_title: "Reject or Clean",
      challenge_description:
        "Clean each raw draft from stdin: strip whitespace and surrounding quotes, print INVALID if it's empty, and truncate to the word cap otherwise.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_words = int(data[0])
    n = int(data[1])

    # TODO: for each of the n raw drafts (data[2..]):
    #   - strip whitespace and surrounding double quotes
    #   - if it's empty, print "INVALID"
    #   - else if longer than max_words, keep only the first max_words words
    #   - print the cleaned draft

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_words = int(data[0])
    n = int(data[1])
    for i in range(n):
        raw = data[2 + i]
        text = raw.strip().strip('"').strip()
        if not text:
            print("INVALID")
            continue
        words = text.split()
        if len(words) > max_words:
            text = " ".join(words[:max_words])
        print(text)

main()
`,
      challenge_test_cases: [
        {
          input: "5\n3\n  \"Sounds good!\"  \n\nokay sure I will be there on friday for lunch",
          expected_output: "Sounds good!\nINVALID\nokay sure I will be",
          description: "Quotes stripped, blank rejected, overlong draft cut to five words.",
        },
        {
          input: "8\n2\nThanks so much\nSee you Friday!",
          expected_output: "Thanks so much\nSee you Friday!",
          description: "Both drafts are short and clean, so they pass unchanged.",
        },
        {
          input: "3\n2\n\"Yes\"\n   ",
          expected_output: "Yes\nINVALID",
          description: "Quoted single word is cleaned; whitespace-only draft is INVALID.",
        },
      ],
    },

    {
      id: "prod-02-7",
      project_id: "prod-02",
      order: 7,
      title: "Fit the Examples in the Budget",
      concept: "selecting few-shot examples under a token budget",
      explanation: `Few-shot examples make replies sound like you, but every example is text you resend and pay for on every call. As your library of past replies grows, you can't cram them all in. The hardening question is which examples you keep and how many fit. This lesson bounds your cost without wrecking your tone.

## Tokens are money, examples are tokens

Each example (an incoming message plus your reply) costs tokens, and you pay for the whole prompt every call. Left unchecked, a user with 200 saved replies would send a small novel on every draft. So you set a **token budget** for examples and select the best-fitting subset.

Estimate tokens the usual rough way, about 4 characters per token:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

## Newest-first is a good default

Which examples to keep? Recency is a cheap, reliable heuristic: your most recent replies best reflect how you write now. Walk your examples newest-first and greedily include each while it still fits the budget. Stop at the first one that would overflow.

\`\`\`python
def select_examples(costs, budget, max_examples):
    used, kept = 0, 0
    for cost in reversed(costs):          # newest first
        if kept < max_examples and used + cost <= budget:
            used += cost
            kept += 1
        else:
            break
    return kept, used
\`\`\`

Two knobs guard cost: a **token budget** (a hard ceiling on size) and a **max count** (few-shot rarely improves past 3 to 5 examples, and each one still adds latency). Whichever limit you hit first stops the selection.

## Why bound it two ways

A token budget alone could still pack in a dozen tiny examples, adding latency for little benefit. A count cap alone could still blow past your budget on long examples. Together they give you a predictable worst case: you always know the most this prompt can cost, which is what you want before shipping.

## Keep this in mind

Few-shot examples are like a carry-on bag with fixed space. You pack the most useful items and leave the rest. Newest replies go in first, you stop when the bag is full or you have hit your item limit, and your cost stays bounded no matter how big the user's history grows. In the drill you build that greedy, newest-first selector.`,
      starter_code: `# Select few-shot examples newest-first under a token budget and a count cap.

def estimate_tokens(text):
    return max(1, len(text) // 4)

examples = [
    "Sounds good, see you then!",          # oldest
    "Thanks, I'll take a look today.",
    "Yes that works for me, appreciate it.",  # newest
]
BUDGET = 15
MAX_EXAMPLES = 5

def select_examples(examples, budget, max_examples):
    costs = [estimate_tokens(e) for e in examples]
    used, kept = 0, 0
    # TODO: walk costs NEWEST-first (reversed); include each while
    #       kept < max_examples and used + cost <= budget; stop at the first miss.
    return kept, used

kept, used = select_examples(examples, BUDGET, MAX_EXAMPLES)
print("kept:", kept)
print("total_tokens:", used)
`,
      solution_code: `# Select few-shot examples newest-first under a token budget and a count cap.

def estimate_tokens(text):
    return max(1, len(text) // 4)

examples = [
    "Sounds good, see you then!",          # oldest
    "Thanks, I'll take a look today.",
    "Yes that works for me, appreciate it.",  # newest
]
BUDGET = 15
MAX_EXAMPLES = 5

def select_examples(examples, budget, max_examples):
    costs = [estimate_tokens(e) for e in examples]
    used, kept = 0, 0
    for cost in reversed(costs):
        if kept < max_examples and used + cost <= budget:
            used += cost
            kept += 1
        else:
            break
    return kept, used

kept, used = select_examples(examples, BUDGET, MAX_EXAMPLES)
print("kept:", kept)
print("total_tokens:", used)
`,
      hints: [
        "reversed(costs) walks the examples newest-first.",
        "Include an example only while kept < max_examples AND used + cost <= budget.",
        "Break at the first example that doesn't fit; don't skip ahead to a smaller one.",
      ],
      challenge_title: "Budget the Examples",
      challenge_description:
        "Given a token budget, a count cap, and each example's token cost (oldest first), greedily keep the newest examples that fit and report how many were kept, dropped, and the tokens used.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget, max_examples = map(int, data[0].split())
    n = int(data[1])
    costs = list(map(int, data[2].split())) if n > 0 else []
    # 'costs' holds each example's token cost, oldest first.

    # TODO: walk costs newest-first, keeping each while kept < max_examples
    #       and used + cost <= budget; stop at the first that doesn't fit.
    # TODO: print "kept dropped" (space-separated), then the total tokens used.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget, max_examples = map(int, data[0].split())
    n = int(data[1])
    costs = list(map(int, data[2].split())) if n > 0 else []

    kept = 0
    used = 0
    for c in reversed(costs):
        if kept < max_examples and used + c <= budget:
            used += c
            kept += 1
        else:
            break

    print(kept, n - kept)
    print(used)

main()
`,
      challenge_test_cases: [
        {
          input: "15 5\n3\n6 7 9",
          expected_output: "1 2\n9",
          description: "Newest example (9) fits; adding the next (7) would reach 16 over the 15 budget.",
        },
        {
          input: "100 2\n4\n5 5 5 5",
          expected_output: "2 2\n10",
          description: "Budget is generous, so the count cap of 2 stops selection first.",
        },
        {
          input: "20 3\n0\n",
          expected_output: "0 0\n0",
          description: "Edge: no examples means nothing kept and zero tokens used.",
        },
      ],
    },

    {
      id: "prod-02-8",
      project_id: "prod-02",
      order: 8,
      title: "Ship the Smart Reply Generator",
      concept: "assembling the full pipeline",
      explanation: `Time to wire the pieces into one tool. You built tone capture, few-shot prompting, multi-draft generation, output cleaning, and cost control as separate parts. Shipping connects them into a single flow that turns an incoming message into one sendable, on-voice reply. Finishing this lesson saves the build to your Portfolio.

## The pipeline, end to end

Every run of the finished tool is the same ordered flow:

1. **Capture tone** from the user's sample replies (lesson 3) to get a target profile.
2. **Build the few-shot prompt** from a budgeted set of examples (lessons 4 and 7) plus the incoming message.
3. **Generate several drafts** with the model (lesson 5).
4. **Clean every draft** and drop the unusable ones (lesson 6).
5. **Pick the best** surviving draft by tone distance (lesson 5).
6. **Return one reply**: or a safe fallback if nothing survived.

\`\`\`python
def smart_reply(incoming, samples, examples):
    profile = build_profile(samples)
    system = system_from_profile(profile)
    messages = build_few_shot(select_examples(examples), incoming)

    raw_drafts = [generate(system, messages) for _ in range(3)]
    cleaned = [clean_draft(d, max_words=profile["avg_words"] * 2) for d in raw_drafts]
    usable = [c for c in cleaned if c]
    if not usable:
        return "Thanks, I'll get back to you."
    return min(usable, key=lambda d: tone_distance(d, profile))
\`\`\`

Read top to bottom, it is the whole product: measure the voice, show examples, brainstorm, clean, choose. Each function is a lesson you already wrote.

## What "shipped" means here

Shipped does not require a server. It means the tool runs from a clean start, handles a weird input like an empty draft or no examples without crashing, and always returns something sendable. Those properties turn a pile of functions into a real deliverable, one you would trust with an actual inbox.

## It lands in your Portfolio

Completing this lesson records the Smart Reply Generator in your **Portfolio** tab, with a note on what it does: drafts on-tone replies from a message plus a few samples. That is the point of the whole track, a shelf of working tools you built rather than a score. Keep an example input and its output next to it as proof it works.

## Keep this in mind

A finished AI product is a plain pipeline with one clever function in the middle. You own every stage around that function now, so you can trust, tune, and ship the result. In the drill you run the assembled pipeline on a sample: capture tone, score candidates, and print the final reply, which is what the shipped tool does on every message.`,
      starter_code: `# Run the full Smart Reply pipeline on a sample (pure Python, no API).

samples = ["Hey! Sounds great, see you then.", "Thanks, works for me!"]
candidates = [
    "Sure, Friday works for me!",
    "Yes.",
    '  "Sounds perfect, see you Friday then!"  ',
]

def target_words(samples):
    total = sum(len(s.split()) for s in samples)
    return round(total / len(samples))

def clean_draft(raw, max_words):
    text = raw.strip().strip('"').strip()
    if not text:
        return ""
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words])
    return text

def smart_reply(samples, candidates):
    target = target_words(samples)
    # TODO: clean every candidate (max_words = 12), drop empties,
    #       then pick the survivor whose word count is closest to target
    #       (first on ties). Return the chosen reply, or a safe fallback.
    return "Thanks, I'll get back to you."

print("final reply:", smart_reply(samples, candidates))
print("Saved to Portfolio: Smart Reply Generator")
`,
      solution_code: `# Run the full Smart Reply pipeline on a sample (pure Python, no API).

samples = ["Hey! Sounds great, see you then.", "Thanks, works for me!"]
candidates = [
    "Sure, Friday works for me!",
    "Yes.",
    '  "Sounds perfect, see you Friday then!"  ',
]

def target_words(samples):
    total = sum(len(s.split()) for s in samples)
    return round(total / len(samples))

def clean_draft(raw, max_words):
    text = raw.strip().strip('"').strip()
    if not text:
        return ""
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words])
    return text

def smart_reply(samples, candidates):
    target = target_words(samples)
    cleaned = [clean_draft(c, 12) for c in candidates]
    usable = [c for c in cleaned if c]
    if not usable:
        return "Thanks, I'll get back to you."
    best = usable[0]
    best_score = abs(len(best.split()) - target)
    for c in usable[1:]:
        s = abs(len(c.split()) - target)
        if s < best_score:
            best_score = s
            best = c
    return best

target = target_words(samples)
print("tone avg words:", target)
for i, c in enumerate(candidates):
    cleaned = clean_draft(c, 12)
    score = abs(len(cleaned.split()) - target) if cleaned else "-"
    print(f"candidate {i}: {cleaned} (score {score})")
print("final reply:", smart_reply(samples, candidates))
print("Saved to Portfolio: Smart Reply Generator")
`,
      hints: [
        "Clean every candidate first, then filter out the empty ones.",
        "target_words rounds the average word count of the samples.",
        "Pick the usable draft whose word count is closest to target, keeping the first on ties.",
      ],
      challenge_title: "Run the Pipeline",
      challenge_description:
        "From the user's sample replies and a set of candidate drafts, compute the target word count and print it plus the candidate closest to it (first on ties).",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    samples = [data[1 + i] for i in range(n)]
    idx = 1 + n
    m = int(data[idx]); idx += 1
    candidates = [data[idx + i] for i in range(m)]

    # TODO: target = rounded average word count of the samples.
    # TODO: print "target <target>", then the candidate whose word count is
    #       closest to target (earliest on ties).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    samples = [data[1 + i] for i in range(n)]
    idx = 1 + n
    m = int(data[idx]); idx += 1
    candidates = [data[idx + i] for i in range(m)]

    total_words = sum(len(s.split()) for s in samples)
    target = round(total_words / n) if n else 0

    best_i = 0
    best_score = None
    for i, c in enumerate(candidates):
        score = abs(len(c.split()) - target)
        if best_score is None or score < best_score:
            best_score = score
            best_i = i

    print("target", target)
    print(candidates[best_i])

main()
`,
      challenge_test_cases: [
        {
          input: "2\nHey! Sounds great, see you then.\nThanks, works for me!\n3\nSure, Friday works for me!\nYes.\nSounds perfect, see you Friday then!",
          expected_output: "target 5\nSure, Friday works for me!",
          description: "Samples average 5 words; the 5-word candidate matches best.",
        },
        {
          input: "1\nSure.\n2\nHello there my friend how are you\nOk",
          expected_output: "target 1\nOk",
          description: "A one-word sample sets a terse target, so the shortest candidate wins.",
        },
      ],
    },
  ],
};
