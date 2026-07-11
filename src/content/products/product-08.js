const project = {
  id: "prod-08",
  title: "Persona Chatbot",
  description:
    "Build a stateful character chatbot that keeps the whole conversation in memory and stays in character while it streams replies token by token. By lesson 8 you have a runnable chat session that trims its own history to stay in budget and survives bad input and flaky network calls.",
  difficulty: "intermediate",
  category: "chatbots_agents",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["chatbot", "message-history", "persona", "streaming", "context-window", "anthropic"],
  order: 108,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-08-1",
    project_id: "prod-08",
    order: 1,
    title: "The Model Has Amnesia",
    concept: "message history",
    explanation: `A chatbot's whole trick is remembering what was said. The catch: the model itself remembers nothing. You send "My name is Sam," it replies "Nice to meet you, Sam," you ask "What's my name?" on a fresh call, and it can't answer. There is no database behind the model holding your name. Each API call is a clean slate.

## The model is stateless

**Stateless** means every call is independent: the model keeps nothing between calls. So a chatbot that "remembers" is an illusion *you* build. The tool you build it with is **message history**, a running list of everything said so far that you resend on every call. The model re-reads the whole list each turn and answers as if it remembered. The memory is just a Python list you keep appending to.

## The shape of history

The Messages API takes a list where each item is a dict with a \`role\` and \`content\`:

\`\`\`python
messages = [
    {"role": "user", "content": "My name is Sam."},
    {"role": "assistant", "content": "Nice to meet you, Sam."},
    {"role": "user", "content": "What's my name?"},
]
\`\`\`

\`role\` labels who spoke: **user** for the human, **assistant** for the model. The list must start with a user turn and the roles alternate. A working chatbot is four steps in a loop:

1. Read what the user typed.
2. Append it as a \`user\` turn.
3. Call the API with the **whole list**, not just the newest line.
4. Append the reply as an \`assistant\` turn, print it, repeat.

Every loop the list grows by two. That growing list *is* the memory.

## Why it matters

Most broken beginner bots send only the latest message and wonder why the bot is goldfish-brained. Once you own the list, three things follow. **You pay for it:** resending 40 turns on turn 41 costs tokens for all 40 again, which is why a later lesson trims. **You can edit it:** delete a bad turn, inject a fact, or clear the list to reset. **Order matters:** two user turns in a row, or starting with an assistant turn, gets rejected.

Build the list by hand first and get the data shape right. The network call is the easy part.

## The mental model

The model has amnesia but can read a whiteboard. Each turn you hand it the entire whiteboard, it reads top to bottom and writes one more line. Lose the whiteboard, lose the memory.`,
    starter_code: `# Build the conversation by hand (no API yet).
# Each turn is a dict with a role and content.

messages = []

# TODO: append a user turn saying "My name is Sam."
# TODO: append an assistant turn replying "Nice to meet you, Sam."
# TODO: append a user turn asking "What's my name?"

print("Turns:", len(messages))
`,
    solution_code: `# Build the conversation by hand (no API yet).
# Each turn is a dict with a role and content.

messages = []

def add(role, content):
    messages.append({"role": role, "content": content})

add("user", "My name is Sam.")
add("assistant", "Nice to meet you, Sam.")
add("user", "What's my name?")

print("Turns:", len(messages))
for m in messages:
    print(f"{m['role']}: {m['content']}")

last_user = [m for m in messages if m["role"] == "user"][-1]
print("Last user said:", last_user["content"])
`,
    hints: [
      "Use messages.append({\"role\": ..., \"content\": ...}) for each turn.",
      "A tiny helper like add(role, content) keeps the appends clean.",
      "To grab the last user turn, filter the list for role == 'user' and take [-1].",
    ],
    challenge_title: "Validate the Transcript",
    challenge_description:
      "The Messages API rejects a history that doesn't start with a user turn or that repeats a role. Build the guard that validates a transcript and reports the last thing the user said.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    turns = [data[1 + i].split(" ", 1) for i in range(n)]
    # turns is a list of [role, content] pairs in order

    # TODO: valid if it starts with "user" and roles strictly alternate.
    # TODO: if invalid, print "INVALID".
    # TODO: if valid, print "VALID", then n, then the last user turn's content.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    turns = [data[1 + i].split(" ", 1) for i in range(n)]

    valid = turns[0][0] == "user"
    expected = "user"
    for t in turns:
        if t[0] != expected:
            valid = False
            break
        expected = "assistant" if expected == "user" else "user"

    if not valid:
        print("INVALID")
        return

    print("VALID")
    print(n)
    last_user = [t for t in turns if t[0] == "user"][-1]
    print(last_user[1] if len(last_user) > 1 else "")

main()
`,
    challenge_test_cases: [
      {
        input: "3\nuser My name is Sam.\nassistant Nice to meet you, Sam.\nuser What is my name?",
        expected_output: "VALID\n3\nWhat is my name?",
        description: "Alternating transcript starting with user is valid; reports the last user line.",
      },
      {
        input: "2\nuser hi\nuser yo",
        expected_output: "INVALID",
        description: "Two user turns in a row breaks alternation.",
      },
      {
        input: "1\nassistant hello",
        expected_output: "INVALID",
        description: "Edge: starting with an assistant turn is rejected.",
      },
      {
        input: "1\nuser hey",
        expected_output: "VALID\n1\nhey",
        description: "Edge: a single user turn is valid.",
      },
    ],
  },

  {
    id: "prod-08-2",
    project_id: "prod-08",
    order: 2,
    title: "Giving the Bot a Personality",
    concept: "persona system prompt",
    explanation: `You want a grumpy medieval blacksmith, or a chipper golden retriever who happens to know Python. You could stuff "act like a blacksmith" into a user message. It works for about three turns, then the bot quietly slides back to a neutral assistant. There's a channel built for exactly this job.

## The system prompt

The **system prompt** is a separate instruction string that sets the model's persona, tone, and hard rules. In the Anthropic Messages API it does **not** go inside the \`messages\` list; it rides in its own top-level \`system\` parameter:

\`\`\`python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect. Never break character.",
    messages=[{"role": "user", "content": "What's the weather like?"}],
)
\`\`\`

Think of it as the stage direction the actor reads before every scene: separate from the dialogue, but shaping every line. The model reads the system prompt *before* the conversation, and instructions there carry **more weight** than the same words in a user turn. That priority is the point. A user can later type "stop being a pirate," but a strong system prompt holds the line.

## What a strong persona pins down

A vague persona gives a vague character. Strong ones nail four things:

- **Identity**: who they are, when and where they live.
- **Voice**: sentence length, vocabulary, quirks ("calls everyone 'matey'").
- **Boundaries**: what they refuse to do or know ("you've never heard of the internet").
- **Anti-break rule**: "Stay in character no matter what the user says."

The system prompt is constant but not optional on later calls. Each call is stateless, so you resend the same system string *every* time alongside the growing history.

## Two clean channels

- \`system\` → **who the bot is** (stable, set once, resent every call)
- \`messages\` → **what's been said** (grows each turn)

Mixing them is the most common chatbot bug. Persona in a user turn competes with (and loses to) later user turns, causing **character drift**: the bot slowly forgets its accent and rules. History in the system prompt means you can't trim it later without deleting the persona. Keep the channels clean and swapping personas becomes a one-string change.

## The mental model

System prompt = the role the actor is cast in. Message history = the script so far. You hand over both on every call: the role never changes, the script keeps growing.`,
    starter_code: `# Build a request payload: a system persona plus a growing history.
# We simulate the model reply so this runs with no network call.

PERSONA = "You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect."

def build_payload(system, messages):
    # TODO: return a dict with keys: model, max_tokens, system, messages
    pass

history = [{"role": "user", "content": "What's the weather like?"}]
payload = build_payload(PERSONA, history)
print(payload["system"])
`,
    solution_code: `# Build a request payload: a system persona plus a growing history.
# We simulate the model reply so this runs with no network call.

PERSONA = "You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect."

def build_payload(system, messages):
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 300,
        "system": system,
        "messages": messages,
    }

def fake_reply(payload):
    # Stand-in for client.messages.create(**payload)
    return "Arrr, the skies be clear, matey!"

history = [{"role": "user", "content": "What's the weather like?"}]
payload = build_payload(PERSONA, history)

print(payload["system"])
print("model:", payload["model"])
print("messages:", len(payload["messages"]))

reply = fake_reply(payload)
history.append({"role": "assistant", "content": reply})
print("Reddbeard:", reply)
print("messages:", len(history))
`,
    hints: [
      "build_payload just returns a dict with model, max_tokens, system, and messages keys.",
      "The persona is one string; the history is a separate list. Keep them apart.",
      "After a reply, append {'role':'assistant','content':reply} before the next user turn.",
    ],
    challenge_title: "Persona Lint",
    challenge_description:
      "A strong persona defines four things: identity, voice, boundary, and antibreak. Given the categories a persona actually covers, report which required ones are missing.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    present = set(data[1 + i].strip() for i in range(n))

    required = ["identity", "voice", "boundary", "antibreak"]
    # TODO: find required categories not in present, keeping required order.
    # TODO: print "COMPLETE" if none missing, else one missing category per line.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    present = set(data[1 + i].strip() for i in range(n))

    required = ["identity", "voice", "boundary", "antibreak"]
    missing = [r for r in required if r not in present]

    if not missing:
        print("COMPLETE")
    else:
        for m in missing:
            print(m)

main()
`,
    challenge_test_cases: [
      {
        input: "2\nidentity\nvoice",
        expected_output: "boundary\nantibreak",
        description: "Two categories present; the other two are missing in required order.",
      },
      {
        input: "4\nidentity\nvoice\nboundary\nantibreak",
        expected_output: "COMPLETE",
        description: "All four categories covered.",
      },
      {
        input: "1\nvoice",
        expected_output: "identity\nboundary\nantibreak",
        description: "Only voice present; three missing.",
      },
    ],
  },

  {
    id: "prod-08-3",
    project_id: "prod-08",
    order: 3,
    title: "The Chat Loop",
    concept: "the conversation loop",
    explanation: `You have the two ingredients: a persona string and a message list. Now wire them into the loop that turns them into a real conversation. This is the loop every chatbot runs on, and it's smaller than you'd think.

## One turn, end to end

A single turn does five things in order:

1. Read the user's text.
2. Append it as a \`user\` turn to \`history\`.
3. Call the API with the **same** system prompt and the **whole** history.
4. Read the reply text off the response object.
5. Append it as an \`assistant\` turn, print it, and go back to step 1.

Here's the real thing with the SDK:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
SYSTEM = "You are Captain Reddbeard, a 1600s pirate. Stay in character."
history = []

while True:
    user_text = input("you> ")
    if user_text.strip() == "/quit":
        break
    history.append({"role": "user", "content": user_text})
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=SYSTEM,
        messages=history,
    )
    reply = resp.content[0].text
    history.append({"role": "assistant", "content": reply})
    print("bot>", reply)
\`\`\`

## The invariant that keeps it alive

The loop only works if you **always append the assistant reply before the next user turn**. Miss that append and you get two user turns in a row, which the API rejects, or worse, the model never sees its own last answer and repeats itself. The rule to burn in: *every user append is eventually matched by an assistant append.* History stays balanced, roles stay alternating.

## Reading the reply

The response isn't a plain string. It's an object; the text lives at \`resp.content[0].text\`. Pull it out once, then work with the string. Storing the whole response object in history would break the next call, which expects \`{"role", "content"}\` dicts.

## Why it matters

This loop is the product. Everything after this lesson, budgets, streaming, error handling, wraps around these five steps without changing them. Get the append discipline right here and the hard lessons become additions, not rewrites.

## The drill below

You'll simulate the loop with a deterministic stand-in reply (no network), so you can watch the history stay balanced and alternating turn after turn.`,
    starter_code: `# Simulate the chat loop with a deterministic stand-in reply.
# Real bots call the API here; we fake it so it runs offline.

def bot_reply(user_text):
    # Deterministic stand-in for a model call.
    return f"You said {len(user_text)} characters."

history = []
user_turns = ["Ahoy!", "Tell me a story.", "Bye"]

# TODO: for each user_turn: append it as a user turn, get bot_reply,
#       append that as an assistant turn.

print("Turns:", len(history))
`,
    solution_code: `# Simulate the chat loop with a deterministic stand-in reply.
# Real bots call the API here; we fake it so it runs offline.

def bot_reply(user_text):
    # Deterministic stand-in for a model call.
    return f"You said {len(user_text)} characters."

history = []
user_turns = ["Ahoy!", "Tell me a story.", "Bye"]

for text in user_turns:
    history.append({"role": "user", "content": text})
    reply = bot_reply(text)
    history.append({"role": "assistant", "content": reply})
    print("bot>", reply)

print("Turns:", len(history))

roles = [m["role"] for m in history]
alternating = all(roles[i] != roles[i + 1] for i in range(len(roles) - 1))
print("Alternating:", alternating)
`,
    hints: [
      "Append the user turn first, then the assistant turn, every iteration.",
      "The history grows by exactly two per loop; check len(history) == 2 * len(user_turns).",
      "Roles alternate only if you never skip the assistant append.",
    ],
    challenge_title: "Echo Loop",
    challenge_description:
      "Run the chat loop with an echo bot whose reply is the user's message reversed. Report the final turn count and the bot's last reply.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    msgs = [data[1 + i] for i in range(n)]

    history = []
    # TODO: for each message: append a user turn, then an assistant turn whose
    #       content is the message reversed (text[::-1]).
    # TODO: print the number of turns, then the last assistant reply.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    msgs = [data[1 + i] for i in range(n)]

    history = []
    for u in msgs:
        history.append(("user", u))
        history.append(("assistant", u[::-1]))

    print(len(history))
    print(history[-1][1] if history else "")

main()
`,
    challenge_test_cases: [
      {
        input: "2\nhello\nworld",
        expected_output: "4\ndlrow",
        description: "Two user turns produce four total turns; last reply is 'world' reversed.",
      },
      {
        input: "1\nSam",
        expected_output: "2\nmaS",
        description: "One exchange, two turns.",
      },
      {
        input: "3\nab\ncd\nef",
        expected_output: "6\nfe",
        description: "Three exchanges keep the history balanced at six turns.",
      },
    ],
  },

  {
    id: "prod-08-4",
    project_id: "prod-08",
    order: 4,
    title: "The Context Window Fills Up",
    concept: "context window and tokens",
    explanation: `Your bot works great for ten turns. By turn fifty it either throws an error or the bill quietly triples. You've hit the wall every chatbot hits: the **context window**.

## What the context window is

The **context window** is the maximum amount of text, measured in tokens, that the model can read in a single call. Everything shares that one budget: the system prompt, the full history you resend, *and* the reply the model is about to write all have to fit together. Claude's window is large (hundreds of thousands of tokens) but not infinite, and you pay per token on every call. Resending a 50-turn history on turn 51 bills you for all 50 old turns again.

## How tokens add up

A **token** is a chunk of text, often a word or part of a word. A rule of thumb for English is about 4 characters per token. "Hello there friend" is roughly 4 tokens. Don't memorize exact counts; estimate, then measure with the real tokenizer when money's on the line.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

def conversation_tokens(system, messages):
    total = estimate_tokens(system)
    for m in messages:
        total += estimate_tokens(m["content"])
    return total
\`\`\`

That total is what each call costs and what must fit in the window. When you want the real number before spending real money, the SDK's \`client.messages.count_tokens(...)\` gives an exact count for a given system + messages payload.

## Why you measure

Before you can trim (next lesson), you have to *see* the size. A bot that resends a huge document on every turn is a bot with a big bill, and the fix starts with a number. Watching total tokens per call turns "the bill crept up" into "turn 30 crossed 1,000 tokens, time to trim."

One rule that saves you later: the system prompt counts too, but you never drop it. It's small and it holds the persona. Budget around it; trim the conversation.

## The mental model

The context window is the model's **desk, not a warehouse**. Everything it needs to answer must fit on the desk at once. A bigger desk helps, but a long enough chat still runs out of room. This lesson is the tape measure; the next one is where you clear the desk.

## The drill below

You'll sum estimated tokens across a system prompt and a conversation, exactly the number you'd check before every real call.`,
    starter_code: `# Estimate how many tokens a conversation will cost per call.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def conversation_tokens(system, messages):
    # TODO: return estimate_tokens(system) plus the sum over each
    #       message's content.
    pass

system = "You are Captain Reddbeard, a 1600s pirate."
messages = [
    {"role": "user", "content": "Tell me a story about the sea"},
    {"role": "assistant", "content": "Arrr, gather round, matey"},
]
print("Total tokens:", conversation_tokens(system, messages))
`,
    solution_code: `# Estimate how many tokens a conversation will cost per call.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def conversation_tokens(system, messages):
    total = estimate_tokens(system)
    for m in messages:
        total += estimate_tokens(m["content"])
    return total

system = "You are Captain Reddbeard, a 1600s pirate."
messages = [
    {"role": "user", "content": "Tell me a story about the sea"},
    {"role": "assistant", "content": "Arrr, gather round, matey"},
]

print("System tokens:", estimate_tokens(system))
for m in messages:
    print(m["role"], "->", estimate_tokens(m["content"]), "tokens")
print("Total tokens:", conversation_tokens(system, messages))
`,
    hints: [
      "estimate_tokens divides length by 4 but never returns less than 1.",
      "conversation_tokens starts from the system estimate, then adds each message.",
      "Sum over m['content'] for every message in the list.",
    ],
    challenge_title: "Budget the Call",
    challenge_description:
      "Compute the token cost of one API call: the system prompt plus every message, using the 4-characters-per-token rule.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    system = lines[0]
    n = int(lines[1])
    msgs = lines[2:2 + n]

    def est(t):
        return max(1, len(t) // 4)

    # TODO: total = est(system) + sum of est over each message.
    # TODO: print the total.

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    system = lines[0]
    n = int(lines[1])
    msgs = lines[2:2 + n]

    def est(t):
        return max(1, len(t) // 4)

    total = est(system) + sum(est(m) for m in msgs)
    print(total)

main()
`,
    challenge_test_cases: [
      {
        input: "You are a bot.\n2\nHello there friend\nHi",
        expected_output: "8",
        description: "System 3 + 4 + 1 (the 2-char 'Hi' rounds up to 1) = 8.",
      },
      {
        input: "Bot\n1\nhello",
        expected_output: "2",
        description: "Short system and message both round up to 1 each.",
      },
      {
        input: "You are Captain Reddbeard, a pirate.\n3\nAhoy\nTell me a story about the sea\nAye",
        expected_output: "18",
        description: "System 9 + 1 + 7 + 1 = 18.",
      },
    ],
  },

  {
    id: "prod-08-5",
    project_id: "prod-08",
    order: 5,
    title: "Trimming and Summarizing Old Turns",
    concept: "keeping history in budget",
    explanation: `Now that you can measure a conversation, you can keep it from blowing the budget. When history grows too big, you have two tools: **trim** it or **summarize** it. Real chatbots use both.

## Strategy 1: sliding window

The simplest fix: keep only the most recent turns and drop the oldest. It's cheap, predictable, and the cost is bounded, you always know your worst case. The bot forgets old details but recent context stays sharp, which is what most questions need.

\`\`\`python
def trim_to_budget(messages, budget, est):
    kept = list(messages)
    while len(kept) > 1 and sum(est(m["content"]) for m in kept) > budget:
        kept.pop(0)   # drop the OLDEST turn
    return kept
\`\`\`

Two guardrails live in that loop. \`len(kept) > 1\` keeps at least one turn so you never send an empty history. And you only ever pop from the front, never touch the system prompt, which lives in its own channel and is never in this list.

## Strategy 2: summarize-and-drop

A sliding window throws old details away. When those details still matter over a long chat, **summarize** instead: when history gets long, ask the model to compress the oldest turns into a short paragraph, then replace those turns with a single summary turn.

\`\`\`python
summary = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=150,
    system="Summarize this conversation in 3 sentences, keeping names and facts.",
    messages=old_turns,
).content[0].text

history = [{"role": "user", "content": f"[Earlier summary]: {summary}"}] + recent_turns
\`\`\`

It costs an extra API call and a little latency, but a 100-turn conversation collapses to a paragraph plus the last few turns and still remembers your name.

## When to use which

Start with a sliding window: it's free and bounded, the right default for most bots. Reach for summarize-and-drop only when losing old facts actually hurts, a long support thread, a tutoring session. Many production bots combine them: slide most of the time, summarize once the dropped turns would lose something important.

## Never trim the persona

The system prompt is not in the history list and never gets dropped. Trim it and your pirate turns into a generic assistant mid-conversation. Trim the oldest *conversation* turns only; keep enough recent turns that the current question still makes sense.

## The drill below

You'll implement summarize-and-drop as pure arithmetic: keep the last K turns verbatim, and if anything older was dropped, replace it with one fixed-cost summary turn. Then report the resulting token total.`,
    starter_code: `# Summarize-and-drop as arithmetic: keep the last K turns, replace
# everything older with one summary turn of a fixed cost.

def compress(costs, keep_recent, summary_cost):
    if len(costs) <= keep_recent:
        return ("NOSUMMARY", sum(costs))
    # TODO: kept = sum of the last keep_recent costs.
    # TODO: total = summary_cost + kept (older turns became one summary).
    # TODO: return ("SUMMARY", total)
    pass

print(compress([30, 30, 30, 30, 30], 2, 10))
`,
    solution_code: `# Summarize-and-drop as arithmetic: keep the last K turns, replace
# everything older with one summary turn of a fixed cost.

def compress(costs, keep_recent, summary_cost):
    if len(costs) <= keep_recent:
        return ("NOSUMMARY", sum(costs))
    kept = sum(costs[-keep_recent:]) if keep_recent > 0 else 0
    total = summary_cost + kept
    return ("SUMMARY", total)

for costs, k, sc in [([30, 30, 30, 30, 30], 2, 10),
                     ([30, 30], 2, 10),
                     ([10, 20, 30, 40], 1, 5)]:
    label, total = compress(costs, k, sc)
    print(label, total)
`,
    hints: [
      "If there are keep_recent turns or fewer, nothing is dropped, so no summary.",
      "costs[-keep_recent:] slices the most recent turns to keep verbatim.",
      "When turns were dropped, the total is summary_cost plus the kept turns.",
    ],
    challenge_title: "Summarize-and-Drop",
    challenge_description:
      "Keep the K most recent turns verbatim and, if any older turns exist, collapse them into a single summary turn of fixed cost. Report whether a summary was made and the resulting token total.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n, keep_recent, summary_cost = map(int, lines[0].split())
    costs = list(map(int, lines[1].split())) if n > 0 else []

    # TODO: if n <= keep_recent, print "NOSUMMARY" then sum(costs).
    # TODO: else print "SUMMARY" then summary_cost + sum of the last keep_recent costs.

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n, keep_recent, summary_cost = map(int, lines[0].split())
    costs = list(map(int, lines[1].split())) if n > 0 else []

    if n <= keep_recent:
        print("NOSUMMARY")
        print(sum(costs))
    else:
        kept = sum(costs[-keep_recent:]) if keep_recent > 0 else 0
        print("SUMMARY")
        print(summary_cost + kept)

main()
`,
    challenge_test_cases: [
      {
        input: "5 2 10\n30 30 30 30 30",
        expected_output: "SUMMARY\n70",
        description: "Keep last 2 (60) plus a 10-token summary of the 3 dropped turns.",
      },
      {
        input: "2 2 10\n30 30",
        expected_output: "NOSUMMARY\n60",
        description: "Nothing older than the kept window, so no summary is created.",
      },
      {
        input: "4 1 5\n10 20 30 40",
        expected_output: "SUMMARY\n45",
        description: "Keep only the newest turn (40) plus a 5-token summary.",
      },
      {
        input: "3 0 8\n5 5 5",
        expected_output: "SUMMARY\n8",
        description: "Edge: keep zero turns, so everything becomes the summary.",
      },
    ],
  },

  {
    id: "prod-08-6",
    project_id: "prod-08",
    order: 6,
    title: "Streaming the Reply",
    concept: "streaming output",
    explanation: `Watch Claude in a browser: words appear one chunk at a time, like live typing. That's **streaming**, and it's the difference between a user thinking "is this thing broken?" and "it's thinking, and I can read along."

## What streaming is

**Streaming** means receiving and displaying the reply in small chunks *as it's generated*, instead of waiting for the whole thing. Without it, you call the API and stare at a blank screen for several seconds, then the full reply dumps at once. With it, the first words show up almost immediately and keep flowing.

The subtle part: streaming barely changes the **total** time. What it changes is **time-to-first-token**, how long until *something* appears. Time-to-first-token is what humans perceive as speed.

## How it works with the SDK

The SDK gives you a streaming **context manager**. You loop over text chunks from \`stream.text_stream\` as they arrive:

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=SYSTEM,
    messages=history,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()

reply = final.content[0].text
history.append({"role": "assistant", "content": reply})
\`\`\`

Two details make this work. \`print(text, end="", flush=True)\` prints each chunk with no newline and forces it to the screen immediately; without \`flush\`, Python buffers stdout and you lose the live effect. And \`get_final_message()\` hands you the complete assembled reply once the stream ends.

## Stream to show, store to remember

Streaming is about **display**. It does not change the memory rules from lesson 1. The chunks you print are for the human's eyes; they aren't stored anywhere automatically. After the stream finishes, you take the full assembled reply and append it as an \`assistant\` turn so the next call has the context:

- **Stream to show**: print chunks live so it feels responsive.
- **Store to remember**: capture the final reply and append it to history.

Skip the store step and your bot streams beautifully but forgets every reply the instant it finishes, back to goldfish-brain.

## Assembling chunks yourself

If you accumulate chunks by hand (say, to send them somewhere else), you concatenate them **with no separator**: chunks already include their own spacing. \`"".join(chunks)\` reconstructs the exact reply. And watch for a stop marker, some pipelines end a stream on a sentinel chunk you must not include in the stored text.

## The drill below

You'll reassemble a stream: concatenate chunks in order, stop at an end marker, and report the assembled message, exactly the "store to remember" half of the loop.`,
    starter_code: `# Reassemble a streamed reply from its chunks.
# Concatenate in order (no separator); stop at the "[END]" marker.

def assemble(chunks):
    out = []
    for c in chunks:
        # TODO: stop the loop when c == "[END]" (do not include it).
        # TODO: otherwise add c to out.
        pass
    return "".join(out)

chunks = ["Arr", "matey", "[END]", "ignored"]
print(assemble(chunks))
`,
    solution_code: `# Reassemble a streamed reply from its chunks.
# Concatenate in order (no separator); stop at the "[END]" marker.

def assemble(chunks):
    out = []
    for c in chunks:
        if c == "[END]":
            break
        out.append(c)
    return "".join(out)

chunks = ["Arr", "matey", "[END]", "ignored"]
reply = assemble(chunks)
print("Chunks kept:", 2)
print("Reply:", reply)

history = []
history.append({"role": "assistant", "content": reply})
print("Stored turns:", len(history))
`,
    hints: [
      "Break out of the loop as soon as you see the '[END]' marker.",
      "Chunks join with no separator: ''.join(out) rebuilds the reply exactly.",
      "The stored assistant turn uses the assembled string, not the raw chunks.",
    ],
    challenge_title: "Reassemble the Stream",
    challenge_description:
      "Concatenate streamed chunks in order, stopping at the '[END]' sentinel. Report how many chunks you kept and the assembled reply.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    chunks = lines[1:1 + n]

    out = []
    # TODO: append chunks until you hit "[END]" (exclusive); stop there.
    # TODO: print len(out), then the concatenated reply.

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    chunks = lines[1:1 + n]

    out = []
    for c in chunks:
        if c == "[END]":
            break
        out.append(c)

    print(len(out))
    print("".join(out))

main()
`,
    challenge_test_cases: [
      {
        input: "5\nArr\nmatey\n[END]\nextra\nstuff",
        expected_output: "2\nArrmatey",
        description: "Keeps the two chunks before the sentinel and joins them.",
      },
      {
        input: "3\nHello\nWorld\n!",
        expected_output: "3\nHelloWorld!",
        description: "No sentinel means every chunk is kept.",
      },
      {
        input: "4\nA\nB\n[END]\nC",
        expected_output: "2\nAB",
        description: "Chunks after [END] are dropped.",
      },
    ],
  },

  {
    id: "prod-08-7",
    project_id: "prod-08",
    order: 7,
    title: "Surviving Bad Input and Flaky Networks",
    concept: "errors, retries, and cost caps",
    explanation: `Your bot works on your machine, on your inputs, with your Wi-Fi. A real bot faces empty messages, network blips, and a cost ceiling it must not blow through. This lesson is the unglamorous armor that turns a demo into a tool.

## Three things that will go wrong

1. **Empty or junk input.** The user hits enter on a blank line. Don't append an empty user turn and don't call the API; just reprompt.
2. **The network fails.** Calls time out or return a transient error. Wrap them and retry a bounded number of times.
3. **It costs money.** Every call spends tokens. A runaway loop or a giant history can rack up a bill fast, so you cap it.

## A bounded retry

The key word is *bounded*. You retry, but never forever, otherwise a persistent outage becomes an infinite loop that spends money on every attempt.

\`\`\`python
import time
from anthropic import APIError

def call_with_retry(client, **kwargs):
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            return client.messages.create(**kwargs)
        except APIError:
            if attempt == max_retries:
                raise          # give up after the budget is spent
            time.sleep(2 ** attempt)   # back off: 1s, 2s, ...
\`\`\`

You get \`max_retries + 1\` total attempts. Each attempt costs tokens whether it succeeds or fails, so the retry budget *is* a cost decision. Exponential backoff (\`2 ** attempt\`) spaces the tries out so you don't hammer a struggling server.

## Guard the input

\`\`\`python
user_text = input("you> ").strip()
if not user_text:
    print("(say something)")
    continue
\`\`\`

One \`if not user_text\` before you touch history saves a whole class of "why did the API 400" bugs. Validate at the boundary, before the request, not after.

## Cap the cost

Before sending, check the estimated tokens (lesson 4) against a ceiling. Over it? Trim harder or refuse. And cap attempts, as above. The mindset: assume the model will occasionally return garbage and the network will occasionally drop. The bots people rely on fail politely and recover.

## Why it matters

Every \`try/except\` and every input guard is the difference between a bot that dies on the first weird input and one someone can actually rely on. That hardening is most of what "production" means.

## The drill below

You'll simulate the retry loop: given a fixed attempt budget and the outcome of each attempt, decide whether the call ultimately succeeds and how many tokens it burned, so the retry budget's cost is visible.`,
    starter_code: `# Simulate a bounded retry loop. Each attempt costs 'cost' tokens.
# outcomes is a list of "F" (fail) / "S" (success) in attempt order.

def run(max_retries, cost, outcomes):
    attempts_allowed = max_retries + 1
    spent = 0
    ok = False
    # TODO: try up to attempts_allowed times (or until outcomes runs out).
    #       Each attempt adds 'cost' to spent. Stop with ok=True on "S".
    return ok, spent

print(run(2, 10, ["F", "F", "S"]))
`,
    solution_code: `# Simulate a bounded retry loop. Each attempt costs 'cost' tokens.
# outcomes is a list of "F" (fail) / "S" (success) in attempt order.

def run(max_retries, cost, outcomes):
    attempts_allowed = max_retries + 1
    spent = 0
    ok = False
    for i in range(min(attempts_allowed, len(outcomes))):
        spent += cost
        if outcomes[i] == "S":
            ok = True
            break
    return ok, spent

for mr, cost, outs in [(2, 10, ["F", "F", "S"]),
                       (2, 10, ["F", "F", "F"]),
                       (1, 7, ["F", "F", "S"])]:
    ok, spent = run(mr, cost, outs)
    print(("OK" if ok else "FAIL"), spent)
`,
    hints: [
      "Total attempts allowed is max_retries + 1, not max_retries.",
      "Every attempt costs tokens, even the ones that fail.",
      "A success that would arrive after the budget is exhausted still counts as a failure.",
    ],
    challenge_title: "Bounded Retry Budget",
    challenge_description:
      "You retry a flaky call up to R times (R+1 attempts total), each costing a fixed number of tokens. Given the outcome of each attempt, report whether the call succeeds and the tokens spent.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    R, cost = map(int, lines[0].split())
    outcomes = lines[1].split()

    attempts_allowed = R + 1
    spent = 0
    ok = False
    # TODO: iterate up to attempts_allowed attempts (or until outcomes runs out).
    #       Each attempt spends 'cost'. Set ok=True and stop on "S".
    # TODO: print "OK <spent>" or "FAIL <spent>".

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    R, cost = map(int, lines[0].split())
    outcomes = lines[1].split()

    attempts_allowed = R + 1
    spent = 0
    ok = False
    for i in range(min(attempts_allowed, len(outcomes))):
        spent += cost
        if outcomes[i] == "S":
            ok = True
            break

    print(("OK" if ok else "FAIL"), spent)

main()
`,
    challenge_test_cases: [
      {
        input: "2 10\nF F S",
        expected_output: "OK 30",
        description: "Two fails then a success within the 3-attempt budget; 3 attempts billed.",
      },
      {
        input: "2 10\nF F F",
        expected_output: "FAIL 30",
        description: "All three allowed attempts fail.",
      },
      {
        input: "0 5\nS",
        expected_output: "OK 5",
        description: "Edge: zero retries means one attempt, which succeeds.",
      },
      {
        input: "1 7\nF F S",
        expected_output: "FAIL 14",
        description: "Only 2 attempts allowed, so the success at attempt 3 is never reached.",
      },
    ],
  },

  {
    id: "prod-08-8",
    project_id: "prod-08",
    order: 8,
    title: "Ship the Persona Chatbot",
    concept: "assembling and shipping",
    explanation: `Every piece is built: message history, a persona system prompt, token budgeting, summarize-and-drop trimming, streaming, and error handling. This lesson bolts them into one runnable object and ships it. Finish this and the project lands in your **Portfolio**.

## The whole thing, assembled

A chat session is just the loop from lesson 3 wrapped around the guards from lessons 4-7. Here's the shape:

\`\`\`python
class ChatSession:
    def __init__(self, client, persona, budget=1000):
        self.client = client
        self.system = persona          # never trimmed
        self.history = []
        self.budget = budget

    def _trim(self):
        while len(self.history) > 2 and self._tokens() > self.budget:
            self.history.pop(0)

    def _tokens(self):
        t = max(1, len(self.system) // 4)
        for m in self.history:
            t += max(1, len(m["content"]) // 4)
        return t

    def say(self, text):
        text = text.strip()
        if not text:
            return None
        self.history.append({"role": "user", "content": text})
        self._trim()
        reply = ""
        with self.client.messages.stream(
            model="claude-sonnet-4-6", max_tokens=300,
            system=self.system, messages=self.history,
        ) as stream:
            for chunk in stream.text_stream:
                print(chunk, end="", flush=True)
                reply += chunk
        self.history.append({"role": "assistant", "content": reply})
        return reply
\`\`\`

Read it top to bottom and every lesson is there: \`system\` is the persona (lesson 2), \`history\` is the memory (lesson 1), \`_tokens\` and \`_trim\` are the budget and sliding window (lessons 4-5), the \`stream\` block is streaming (lesson 6), and the empty-input guard is the hardening (lesson 7). The loop discipline, append user, get reply, append assistant, is lesson 3, untouched.

## What "shipped" means

You don't need a fancy deployment. Shipped means three things are true:

1. It runs from a clean start with one command and your API key in the environment.
2. It handles an empty or weird input without crashing.
3. Someone else could use it from your instructions alone.

Run it, chat with your character for a dozen turns, watch it stay in persona and stream, then feed it a blank line and a very long message to prove the guards hold.

## Your Portfolio

Completing this final lesson records the project in your **Portfolio** with its title and what you built: a stateful, streaming, in-character chatbot. That shelf of working products is the point of this track. Keep a one-line description ("a pirate chatbot that remembers your name and streams its replies") and one saved example exchange as proof it works.

## The drill below

You'll build a ship-readiness check: given the session's persona, memory, streaming flag, and token usage, decide if the bot is ready to ship or list exactly what's missing.`,
    starter_code: `# Ship-readiness check for the finished chatbot.
# persona: the system string ("NONE" means no persona set)
# assistant_turns: how many replies are stored (memory)
# streaming: 1 if streaming is on, else 0
# tokens, budget: current usage vs the ceiling

def ship_check(persona, assistant_turns, streaming, tokens, budget):
    fails = []
    # TODO: "persona" if persona is "NONE" or empty.
    # TODO: "memory" if assistant_turns < 1.
    # TODO: "streaming" if streaming != 1.
    # TODO: "budget" if tokens > budget.
    return fails

print(ship_check("You are Reddbeard.", 3, 1, 400, 1000))
`,
    solution_code: `# Ship-readiness check for the finished chatbot.

def ship_check(persona, assistant_turns, streaming, tokens, budget):
    fails = []
    if persona == "NONE" or persona == "":
        fails.append("persona")
    if assistant_turns < 1:
        fails.append("memory")
    if streaming != 1:
        fails.append("streaming")
    if tokens > budget:
        fails.append("budget")
    return fails

cases = [
    ("You are Reddbeard.", 3, 1, 400, 1000),
    ("NONE", 0, 0, 2000, 1000),
    ("You are a bot.", 2, 0, 500, 400),
]
for persona, at, st, tok, bud in cases:
    fails = ship_check(persona, at, st, tok, bud)
    print("READY" if not fails else ",".join(fails))
`,
    hints: [
      "Check the four conditions in a fixed order: persona, memory, streaming, budget.",
      "An empty or 'NONE' persona fails the persona check.",
      "No failures means the bot is READY to ship.",
    ],
    challenge_title: "Ship Checklist",
    challenge_description:
      "Given the finished chatbot's persona, stored memory, streaming flag, and token usage, print READY or list every failing check in order (persona, memory, streaming, budget).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    persona = lines[0]
    assistant_turns, streaming, tokens, budget = map(int, lines[1].split())

    fails = []
    # TODO: append "persona" if persona is "NONE" or empty.
    # TODO: append "memory" if assistant_turns < 1.
    # TODO: append "streaming" if streaming != 1.
    # TODO: append "budget" if tokens > budget.
    # TODO: print "READY" if no fails, else each failing check on its own line.

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    persona = lines[0]
    assistant_turns, streaming, tokens, budget = map(int, lines[1].split())

    fails = []
    if persona == "NONE" or persona == "":
        fails.append("persona")
    if assistant_turns < 1:
        fails.append("memory")
    if streaming != 1:
        fails.append("streaming")
    if tokens > budget:
        fails.append("budget")

    if not fails:
        print("READY")
    else:
        for f in fails:
            print(f)

main()
`,
    challenge_test_cases: [
      {
        input: "You are Reddbeard.\n3 1 400 1000",
        expected_output: "READY",
        description: "All four checks pass.",
      },
      {
        input: "NONE\n0 0 2000 1000",
        expected_output: "persona\nmemory\nstreaming\nbudget",
        description: "Everything fails; all four checks reported in order.",
      },
      {
        input: "You are a bot.\n2 0 500 400",
        expected_output: "streaming\nbudget",
        description: "Streaming off and over budget; persona and memory pass.",
      },
    ],
  },
];

export default { project, lessons };
