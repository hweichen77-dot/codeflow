export default {
  project: {
    id: "ai-04",
    title: "Build a Chatbot",
    description: "Build a character chatbot that remembers the conversation, stays in persona, and streams its replies token by token.",
    difficulty: "intermediate",
    category: "ai_ml",
    estimated_time: 120,
    lessons_count: 4,
    tags: ["chatbot", "message-history", "context-window", "streaming", "persona", "anthropic"],
    order: 4,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-04-l1",
      project_id: "ai-04",
      order: 1,
      title: "The Model Has Amnesia",
      concept: "Message History",
      xp_reward: 10,
      explanation: `Here's the thing nobody tells you when you first call an LLM: the model forgets everything the instant it finishes replying.

You send "My name is Sam." It says "Nice to meet you, Sam." You send "What's my name?" and it shrugs. Why? Because each API call is a fresh start. The model didn't store your name anywhere. It can't. There's no database behind the scenes remembering you.

## Memory is your job

A chatbot that remembers is an illusion you build. The trick is simple: every time you call the API, you resend the **entire conversation so far**. The model re-reads the whole thing each turn and answers as if it remembered.

The Messages API takes a list. Each item has a \`role\` and \`content\`:

\`\`\`python
messages = [
    {"role": "user", "content": "My name is Sam."},
    {"role": "assistant", "content": "Nice to meet you, Sam."},
    {"role": "user", "content": "What's my name?"},
]
\`\`\`

Roles alternate: user, assistant, user, assistant. The \`user\` turns are what the human typed. The \`assistant\` turns are what the model said before. You append both as the chat grows.

## The loop

A working chatbot is basically four steps in a loop:

1. Read what the user typed.
2. Append it to \`messages\` as a \`user\` turn.
3. Call the API with the whole list.
4. Append the reply as an \`assistant\` turn, print it, repeat.

That's it. The "memory" is just a Python list you keep adding to. Lose the list, lose the memory. Most beginner chatbots feel broken because they only send the latest message and wonder why the bot is goldfish-brained.

Build the message list by hand first and simulate the back-and-forth, no real API yet. Get the data shape right. The network call is the easy part.`,
      key_terms: [
        { term: "Message history", definition: "The running list of user and assistant turns you resend on every API call so the model appears to remember." },
        { term: "Role", definition: "A label on each message — 'user' for the human, 'assistant' for the model — that tells the API who said what." },
        { term: "Statelessness", definition: "The fact that each API call is independent; the model retains nothing between calls unless you resend it." }
      ],
      callouts: [
        { type: "analogy", title: "The whiteboard", content: "Imagine talking to someone with no short-term memory, but they can read a whiteboard. Each turn you wipe nothing — you just hand them the whole whiteboard, they read it top to bottom, and write their next line. That whiteboard is your messages list.", position: "before" },
        { type: "warning", title: "Roles must alternate", content: "The API expects user/assistant to alternate and the list to start with a user turn. Two user turns in a row will get rejected. Always append the assistant reply before the next user turn.", position: "after" }
      ],
      concept_diagram: {
        title: "How a chatbot fakes memory",
        steps: [
          { label: "User types", desc: "Capture the text the human entered." },
          { label: "Append user turn", desc: "Add {role:'user', content:text} to the list." },
          { label: "Send whole list", desc: "Call the API with every turn so far, not just the newest." },
          { label: "Append reply", desc: "Add {role:'assistant', content:reply} back to the list." },
          { label: "Loop", desc: "Repeat; the growing list IS the memory." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does an LLM 'forget' your name between two separate API calls?",
          options: [
            "Each call is stateless — the model keeps nothing unless you resend it",
            "The model is too small to store names",
            "Names are filtered out for privacy"
          ],
          correct_index: 0,
          explanation: "API calls are independent. The only memory is the message list you resend each time."
        }
      ],
      quiz_questions: [
        {
          question: "What is the correct shape of one message in the Messages API?",
          options: [
            "{ \"role\": \"user\", \"content\": \"hi\" }",
            "{ \"speaker\": \"human\", \"text\": \"hi\" }",
            "{ \"from\": \"user\", \"message\": \"hi\" }",
            "\"user: hi\""
          ],
          correct_index: 0,
          explanation: "Each message is a dict with a 'role' key and a 'content' key."
        },
        {
          question: "To make a chatbot remember earlier turns, what do you send on each new call?",
          options: [
            "The entire conversation list so far",
            "Only the latest user message",
            "A summary the model wrote last time",
            "Just the assistant's previous reply"
          ],
          correct_index: 0,
          explanation: "You resend the full history every call. The model re-reads it to appear to remember."
        },
        {
          question: "Which sequence of roles is valid to send to the API?",
          options: [
            "user, assistant, user",
            "user, user, assistant",
            "assistant, user, assistant",
            "assistant, assistant, user"
          ],
          correct_index: 0,
          explanation: "The list should start with user and alternate. user/assistant/user is fine."
        }
      ],
      participation_activities: [
        {
          activity_title: "Memory sanity check",
          questions: [
            { question: "An LLM stores your previous messages on its own server between calls.", type: "true_false", correct_answer: "false", explanation: "It doesn't. You resend the history yourself; the model is stateless." },
            { question: "The Python structure you grow to hold the chat is a ____.", type: "fill_in", correct_answer: "list", explanation: "A list of message dicts is the standard way to hold history." }
          ]
        }
      ],
      starter_code: `# Build the conversation by hand (no API yet).
# Each turn is a dict with a role and content.

messages = []

# TODO: append a user turn saying "My name is Sam."
# TODO: append an assistant turn replying "Nice to meet you, Sam."
# TODO: append a user turn asking "What's my name?"

# Print how many turns we have and the last user message.
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
      expected_output: `Turns: 3
user: My name is Sam.
assistant: Nice to meet you, Sam.
user: What's my name?
Last user said: What's my name?`,
      hints: [
        "Use messages.append({\"role\": ..., \"content\": ...}) for each turn.",
        "A small helper like add(role, content) keeps it clean.",
        "To grab the last user turn, filter the list for role == 'user' and take [-1]."
      ],
      challenge_title: "Turn counter by role",
      challenge_description: "Write count_turns(messages) that returns a dict with how many 'user' and how many 'assistant' turns are in the list.",
      challenge_starter_code: `def count_turns(messages):
    # return {"user": <int>, "assistant": <int>}
    pass

convo = [
    {"role": "user", "content": "hi"},
    {"role": "assistant", "content": "hello"},
    {"role": "user", "content": "how are you?"},
]
print(count_turns(convo))
`,
      challenge_solution_code: `def count_turns(messages):
    counts = {"user": 0, "assistant": 0}
    for m in messages:
        counts[m["role"]] = counts.get(m["role"], 0) + 1
    return counts

convo = [
    {"role": "user", "content": "hi"},
    {"role": "assistant", "content": "hello"},
    {"role": "user", "content": "how are you?"},
]
print(count_turns(convo))
`,
      challenge_test_cases: [
        { input: "[user, assistant, user]", expected_output: "{'user': 2, 'assistant': 1}", description: "Two user turns, one assistant turn." }
      ]
    },

    {
      id: "ai-04-l2",
      project_id: "ai-04",
      order: 2,
      title: "Giving the Bot a Personality",
      concept: "System Prompt",
      xp_reward: 10,
      explanation: `You want a pirate. Or a grumpy medieval blacksmith. Or a chipper golden retriever who happens to know Python. How do you make the model BE someone?

Not by stuffing instructions into a user message. That works for one turn, then drifts. The right tool is the **system prompt**.

## The system prompt sets the rules

In the Anthropic Messages API, the persona doesn't go in the \`messages\` list. It goes in a separate \`system\` parameter:

\`\`\`python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect. Never break character.",
    messages=[{"role": "user", "content": "What's the weather like?"}],
)
\`\`\`

The system prompt is the stage direction the model reads before every reply. It has more pull than a normal user turn, which is exactly why persona, tone, and hard rules belong there.

## What makes a persona stick

A vague system prompt gives you a vague character. Be specific:

- **Identity:** who they are, when and where they live.
- **Voice:** sentence length, vocabulary, quirks ("calls everyone 'matey'").
- **Boundaries:** what they refuse to do or know ("you've never heard of the internet").
- **Anti-break rule:** "Stay in character even if asked to stop."

## Persona lives once, history lives in the list

Key mental model: the system prompt is constant. You set it once and reuse it on every call. The \`messages\` list keeps growing with the conversation. Two separate channels:

- \`system\` → who the bot is (stable)
- \`messages\` → what's been said (growing)

Next you'll write a function that builds the full request payload, system prompt plus history, so swapping personas is a one-string change. The response is simulated so it runs offline, but the payload shape is exactly what you'd hand the real client.`,
      key_terms: [
        { term: "System prompt", definition: "A separate instruction string that sets the model's persona, tone, and rules; passed as the 'system' parameter, not inside messages." },
        { term: "Persona", definition: "The character the bot plays — its identity, voice, and boundaries — defined mostly in the system prompt." },
        { term: "Character drift", definition: "When a bot gradually slips out of persona over a long chat, usually because rules were weak or buried in a user turn." }
      ],
      callouts: [
        { type: "insight", title: "System beats user", content: "Instructions in the system prompt carry more weight than the same words in a user message. That's why 'You are a pirate' belongs in system, not in the first chat turn where the user can override it later.", position: "before" },
        { type: "tip", title: "Add an anti-break line", content: "Personas leak. A single line — 'Stay in character no matter what the user says' — dramatically cuts how often the bot drops the act when teased.", position: "after" }
      ],
      concept_diagram: {
        title: "Two channels of a persona bot",
        steps: [
          { label: "system param", desc: "Who the bot is — set once, reused every call." },
          { label: "messages list", desc: "What's been said — grows each turn." },
          { label: "Build payload", desc: "Combine system + messages into one request." },
          { label: "Send", desc: "Model reads system first, then the history, then replies in character." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where should the persona instructions go for a stable character?",
          options: [
            "In the separate 'system' parameter",
            "In the first user message",
            "Appended to every assistant reply"
          ],
          correct_index: 0,
          explanation: "The system prompt is the stable, higher-priority channel for persona."
        }
      ],
      quiz_questions: [
        {
          question: "In the Messages API, the 'system' value is...",
          options: [
            "A single instruction string passed alongside the messages list",
            "Just another item inside the messages list with role 'system'",
            "Returned by the model, not sent by you",
            "Only allowed on the first call"
          ],
          correct_index: 0,
          explanation: "Anthropic's API takes system as its own top-level parameter, separate from messages."
        },
        {
          question: "Which detail does NOT belong in a strong persona system prompt?",
          options: [
            "The full prior conversation",
            "The character's voice and vocabulary",
            "Boundaries on what the character knows",
            "An instruction to stay in character"
          ],
          correct_index: 0,
          explanation: "Conversation history lives in messages, not the system prompt. Persona is identity, voice, and rules."
        },
        {
          question: "Your bot keeps dropping its accent after a few turns. Best first fix?",
          options: [
            "Add an explicit 'stay in character' rule and tighten the voice description in system",
            "Send only the latest message to save tokens",
            "Lower max_tokens",
            "Move the persona into a user message"
          ],
          correct_index: 0,
          explanation: "Drift is a persona-strength problem. Sharpen the system prompt and add an anti-break rule."
        }
      ],
      participation_activities: [
        {
          activity_title: "Persona placement",
          questions: [
            { question: "The system prompt should be resent on every API call, not just the first.", type: "true_false", correct_answer: "true", explanation: "Yes — each call is stateless, so the persona must ride along every time." },
            { question: "The API parameter that holds the bot's personality is called ____.", type: "fill_in", correct_answer: "system", explanation: "Anthropic exposes persona via the top-level 'system' parameter." }
          ]
        }
      ],
      starter_code: `# Build a request payload: a system persona + a growing history.
# We simulate the model reply so this runs without a network call.

PERSONA = "You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect."

def build_payload(system, messages):
    # TODO: return a dict with keys: model, max_tokens, system, messages
    pass

history = [{"role": "user", "content": "What's the weather like?"}]
payload = build_payload(PERSONA, history)
print(payload["system"])
print("messages:", len(payload["messages"]))
`,
      solution_code: `# Build a request payload: a system persona + a growing history.
# We simulate the model reply so this runs without a network call.

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
      expected_output: `You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect.
model: claude-sonnet-4-6
messages: 1
Reddbeard: Arrr, the skies be clear, matey!
messages: 2`,
      hints: [
        "build_payload just returns a dict with model, max_tokens, system, and messages keys.",
        "Use model 'claude-sonnet-4-6' and a max_tokens like 300.",
        "After getting a reply, append {'role':'assistant','content':reply} to history before the next turn."
      ],
      challenge_title: "Persona factory",
      challenge_description: "Write make_persona(name, era, quirk) that returns a system prompt string including the name, era, a voice quirk, and a 'stay in character' rule.",
      challenge_starter_code: `def make_persona(name, era, quirk):
    # return a single system-prompt string
    pass

print(make_persona("Reddbeard", "1600s", "calls everyone matey"))
`,
      challenge_solution_code: `def make_persona(name, era, quirk):
    return (
        f"You are {name}, from the {era}. "
        f"Voice: {quirk}. "
        "Stay in character no matter what the user says."
    )

print(make_persona("Reddbeard", "1600s", "calls everyone matey"))
`,
      challenge_test_cases: [
        { input: "make_persona('Reddbeard', '1600s', 'calls everyone matey')", expected_output: "You are Reddbeard, from the 1600s. Voice: calls everyone matey. Stay in character no matter what the user says.", description: "Combines all three fields plus the anti-break rule." }
      ]
    },

    {
      id: "ai-04-l3",
      project_id: "ai-04",
      order: 3,
      title: "The Context Window Fills Up",
      concept: "Context Window",
      xp_reward: 10,
      explanation: `Your chatbot works great. Then, after a long session, the API throws an error or the bill spikes. You hit the **context window**.

The context window is the maximum amount of text — measured in tokens — the model can read in one call. System prompt, full history, and the reply it's about to write all have to fit. Claude's window is large (hundreds of thousands of tokens), but it's not infinite, and you pay per token on every single call. Resending a 50-turn history each time gets expensive fast.

## Tokens, roughly

A token is a chunk of text — often a word or part of a word. A handy rule of thumb: **~4 characters per token** in English, or about 0.75 words per token. "Hello there friend" is roughly 4 tokens. Don't memorize exact counts; estimate, then measure with the real tokenizer when it matters.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

## Two ways to keep history in budget

When the history grows too big, you trim it. Two common strategies:

1. **Sliding window** — keep only the last N turns. Cheap, simple. The bot forgets old details, but recent context stays sharp. Good default.
2. **Summarize-and-drop** — when history gets long, ask the model to compress old turns into a short summary, then replace them with that summary. More work, but preserves the gist of a long chat.

Most production chatbots start with a sliding window because it's trivial and predictable.

## The trap

Never blindly trim the **system prompt** — that's your persona, drop it and the bot becomes a stranger. Trim the oldest *conversation* turns, keep system intact, and always keep enough recent turns that the current question still makes sense.

Next you'll estimate token usage for a conversation and write a sliding-window trimmer that keeps the most recent turns under a token budget.`,
      key_terms: [
        { term: "Context window", definition: "The maximum number of tokens the model can process in one call — system prompt, history, and reply combined." },
        { term: "Token", definition: "A unit of text the model reads, roughly 4 characters or 0.75 words in English." },
        { term: "Sliding window", definition: "A trimming strategy that keeps only the most recent N turns of history to stay under the token budget." }
      ],
      callouts: [
        { type: "analogy", title: "A desk, not a warehouse", content: "The context window is the model's desk. Everything it needs to answer has to fit on the desk at once. A bigger desk helps, but a long enough conversation still runs out of room — so you clear off the oldest papers.", position: "before" },
        { type: "warning", title: "Don't trim the persona", content: "When you cut history to save tokens, cut the oldest chat turns — never the system prompt. Drop the persona and your pirate turns back into a generic assistant.", position: "after" }
      ],
      concept_diagram: {
        title: "Keeping a chat inside the budget",
        steps: [
          { label: "Estimate tokens", desc: "Add up system + history (~4 chars per token)." },
          { label: "Over budget?", desc: "Compare total to your token limit." },
          { label: "Drop oldest turns", desc: "Remove from the front of the history list." },
          { label: "Keep system", desc: "Never trim the persona prompt." },
          { label: "Send trimmed payload", desc: "Recent turns + persona fit comfortably." }
        ]
      },
      inline_quizzes: [
        {
          question: "Roughly how many tokens is a 400-character English message?",
          options: [
            "About 100 tokens",
            "About 400 tokens",
            "About 4 tokens"
          ],
          correct_index: 0,
          explanation: "~4 characters per token, so 400 / 4 ≈ 100 tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What must fit inside the context window on a single call?",
          options: [
            "The system prompt, the full history sent, and the reply being generated",
            "Only the newest user message",
            "Only the assistant's reply",
            "Just the system prompt"
          ],
          correct_index: 0,
          explanation: "Everything the model reads and writes in that call shares the window budget."
        },
        {
          question: "Why trim history even though Claude's window is huge?",
          options: [
            "You pay per token every call, so resending huge histories is costly and slow",
            "The model refuses any history over 5 turns",
            "Old turns corrupt new ones",
            "Trimming is required by the API on every call"
          ],
          correct_index: 0,
          explanation: "Cost and latency scale with tokens sent. Trimming keeps long chats affordable."
        },
        {
          question: "When applying a sliding window, which part do you NEVER drop?",
          options: [
            "The system prompt",
            "The oldest user turn",
            "The oldest assistant turn",
            "Any turn older than the last 5"
          ],
          correct_index: 0,
          explanation: "The system prompt holds the persona. Drop history turns, keep system."
        }
      ],
      participation_activities: [
        {
          activity_title: "Budgeting tokens",
          questions: [
            { question: "A bigger context window means you never need to trim history.", type: "true_false", correct_answer: "false", explanation: "Even with a big window, cost and latency push you to trim long chats." },
            { question: "Keeping only the last N turns of a conversation is called a sliding ____.", type: "fill_in", correct_answer: "window", explanation: "The sliding window strategy keeps recent turns and drops older ones." }
          ]
        }
      ],
      starter_code: `# Estimate tokens and trim a chat with a sliding window.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def total_tokens(messages):
    # TODO: sum estimate_tokens over each message's content
    pass

def trim_to_budget(messages, budget):
    # TODO: drop OLDEST turns until total is <= budget; keep order
    pass

history = [
    {"role": "user", "content": "a" * 40},
    {"role": "assistant", "content": "b" * 40},
    {"role": "user", "content": "c" * 40},
]
print("Total:", total_tokens(history))
`,
      solution_code: `# Estimate tokens and trim a chat with a sliding window.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def total_tokens(messages):
    return sum(estimate_tokens(m["content"]) for m in messages)

def trim_to_budget(messages, budget):
    trimmed = list(messages)
    while len(trimmed) > 1 and total_tokens(trimmed) > budget:
        trimmed.pop(0)  # drop the oldest turn
    return trimmed

history = [
    {"role": "user", "content": "a" * 40},       # 10 tokens
    {"role": "assistant", "content": "b" * 40},  # 10 tokens
    {"role": "user", "content": "c" * 40},       # 10 tokens
]

print("Total:", total_tokens(history))

kept = trim_to_budget(history, 20)
print("Kept turns:", len(kept))
print("Kept total:", total_tokens(kept))
for m in kept:
    print(m["role"], "->", estimate_tokens(m["content"]), "tokens")
`,
      expected_output: `Total: 30
Kept turns: 2
Kept total: 20
assistant -> 10 tokens
user -> 10 tokens`,
      hints: [
        "total_tokens is a sum over estimate_tokens(m['content']) for each message.",
        "trim_to_budget should pop(0) — the oldest turn — until you're under budget.",
        "Keep at least one turn so you never return an empty history."
      ],
      challenge_title: "Last-N sliding window",
      challenge_description: "Write last_n(messages, n) that returns only the most recent n turns of the history, preserving order.",
      challenge_starter_code: `def last_n(messages, n):
    # return the last n turns, in order
    pass

convo = [
    {"role": "user", "content": "1"},
    {"role": "assistant", "content": "2"},
    {"role": "user", "content": "3"},
    {"role": "assistant", "content": "4"},
]
print([m["content"] for m in last_n(convo, 2)])
`,
      challenge_solution_code: `def last_n(messages, n):
    return messages[-n:] if n > 0 else []

convo = [
    {"role": "user", "content": "1"},
    {"role": "assistant", "content": "2"},
    {"role": "user", "content": "3"},
    {"role": "assistant", "content": "4"},
]
print([m["content"] for m in last_n(convo, 2)])
`,
      challenge_test_cases: [
        { input: "last_n(convo, 2)", expected_output: "['3', '4']", description: "Returns the two most recent turns in order." }
      ]
    },

    {
      id: "ai-04-l4",
      project_id: "ai-04",
      order: 4,
      title: "Streaming the Reply",
      concept: "Streaming",
      xp_reward: 10,
      explanation: `Watch ChatGPT or Claude in a browser: words appear one chunk at a time, like someone typing. That's not a cosmetic trick. It's **streaming**, and it changes how the wait feels.

Without streaming, you call the API, then stare at nothing for several seconds while the whole reply generates, then it dumps all at once. With streaming, the first words show up almost immediately and keep flowing. Same total time, far less perceived wait. For a chatbot, that's the difference between "is this thing broken?" and "it's thinking, and I can read along."

## How it works with the SDK

The Anthropic SDK gives you a streaming context manager. You loop over text chunks as they arrive:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You are Captain Reddbeard, a 1600s pirate.",
    messages=[{"role": "user", "content": "Tell me a sea story."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()
\`\`\`

Two things matter here. \`print(text, end="", flush=True)\` prints each chunk with no newline and forces it to the screen immediately — without \`flush\`, Python buffers and you lose the live effect. And \`get_final_message()\` gives you the complete assembled reply at the end, which you append to your history.

## Don't forget the history

Streaming is about *display*. It doesn't change the memory rules from lesson 1. After the stream finishes, you still take the full reply and append it as an \`assistant\` turn so the next call has the context. Stream to the user, then store the result.

## Putting it together

A complete character chatbot is now in reach: a system-prompt persona, a growing message list, a sliding window to stay in budget, and streamed output so it feels alive. Below you'll simulate streaming by yielding chunks of a reply and assembling them back into the full message you'd store.`,
      key_terms: [
        { term: "Streaming", definition: "Receiving and displaying the model's reply in small chunks as it's generated, instead of waiting for the whole thing." },
        { term: "text_stream", definition: "The SDK iterator that yields text chunks of the reply as they arrive over the connection." },
        { term: "flush", definition: "Forcing buffered output to the screen immediately (print(..., flush=True)) so chunks appear live." }
      ],
      callouts: [
        { type: "insight", title: "Same time, better feel", content: "Streaming rarely makes the total response faster. It makes the FIRST token arrive sooner, which is what users actually perceive as speed. Time-to-first-token beats total time for how responsive a chat feels.", position: "before" },
        { type: "tip", title: "Stream to show, store to remember", content: "Print chunks for the human, but capture the final assembled message and append it to your history. Streaming changes display, not the memory rules.", position: "after" }
      ],
      concept_diagram: {
        title: "Streaming a chatbot reply",
        steps: [
          { label: "Open stream", desc: "Call messages.stream with system + history." },
          { label: "Loop chunks", desc: "Iterate text_stream, print each piece with flush=True." },
          { label: "Assemble", desc: "Concatenate chunks into the full reply." },
          { label: "Store", desc: "Append the final reply as an assistant turn." },
          { label: "Next turn", desc: "History now includes the reply for the following call." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does streaming mainly improve?",
          options: [
            "Perceived responsiveness — the first words appear sooner",
            "The total compute time of the reply",
            "The model's accuracy",
            "The size of the context window"
          ],
          correct_index: 0,
          explanation: "Streaming lowers time-to-first-token, which is what feels fast. Total time is about the same."
        }
      ],
      quiz_questions: [
        {
          question: "Why include flush=True in print(text, end=\"\", flush=True) during streaming?",
          options: [
            "To push each chunk to the screen immediately instead of buffering",
            "To add a newline after each chunk",
            "To re-send the chunk to the API",
            "To convert the chunk to lowercase"
          ],
          correct_index: 0,
          explanation: "Without flush, Python buffers stdout and the live typing effect is lost."
        },
        {
          question: "After a streamed reply finishes, what should you do for memory?",
          options: [
            "Append the full assembled reply as an assistant turn in history",
            "Nothing — streaming stores it automatically",
            "Clear the history to save tokens",
            "Resend each chunk individually"
          ],
          correct_index: 0,
          explanation: "Streaming only affects display. You still append the final reply to keep memory working."
        },
        {
          question: "Which SDK method gives you the complete reply after streaming?",
          options: [
            "stream.get_final_message()",
            "stream.text_stream.all()",
            "client.messages.complete()",
            "stream.flush()"
          ],
          correct_index: 0,
          explanation: "get_final_message() returns the assembled final message object once the stream ends."
        }
      ],
      participation_activities: [
        {
          activity_title: "Streaming reality check",
          questions: [
            { question: "Streaming makes the model generate the full reply in less total time.", type: "true_false", correct_answer: "false", explanation: "It improves time-to-first-token and perceived speed, not total generation time." },
            { question: "The iterator you loop over to get reply chunks from the SDK is called ____.", type: "fill_in", correct_answer: "text_stream", explanation: "stream.text_stream yields the text chunks as they arrive." }
          ]
        }
      ],
      starter_code: `# Simulate streaming: yield chunks, print them live, then assemble + store.

def stream_chunks(reply):
    # Pretend each word arrives separately from the API.
    for word in reply.split(" "):
        yield word + " "

history = [{"role": "user", "content": "Tell me a sea story."}]
full_reply = "Arrr, once I sailed past a kraken."

# TODO: loop over stream_chunks(full_reply), print each with end="" and flush=True,
#       build up the assembled text, then append it to history as an assistant turn.
`,
      solution_code: `# Simulate streaming: yield chunks, print them live, then assemble + store.

def stream_chunks(reply):
    # Pretend each word arrives separately from the API.
    for word in reply.split(" "):
        yield word + " "

history = [{"role": "user", "content": "Tell me a sea story."}]
full_reply = "Arrr, once I sailed past a kraken."

assembled = ""
for chunk in stream_chunks(full_reply):
    print(chunk, end="", flush=True)
    assembled += chunk

print()  # newline after the streamed line
assembled = assembled.strip()
history.append({"role": "assistant", "content": assembled})

print("Stored reply:", history[-1]["content"])
print("Turns now:", len(history))
`,
      expected_output: `Arrr, once I sailed past a kraken. 
Stored reply: Arrr, once I sailed past a kraken.
Turns now: 2`,
      hints: [
        "Iterate stream_chunks(full_reply); print each chunk with end=\"\" and flush=True.",
        "Concatenate chunks into 'assembled' as you go, then .strip() the trailing space.",
        "After the loop, append {'role':'assistant','content':assembled} to history."
      ],
      challenge_title: "Collect a stream",
      challenge_description: "Write collect(chunks) that consumes an iterable of text chunks and returns the full assembled string with no leading/trailing whitespace.",
      challenge_starter_code: `def collect(chunks):
    # join all chunks and strip surrounding whitespace
    pass

def fake_stream():
    for w in ["Hello ", "there ", "matey "]:
        yield w

print(collect(fake_stream()))
`,
      challenge_solution_code: `def collect(chunks):
    return "".join(chunks).strip()

def fake_stream():
    for w in ["Hello ", "there ", "matey "]:
        yield w

print(collect(fake_stream()))
`,
      challenge_test_cases: [
        { input: "collect(fake_stream())", expected_output: "Hello there matey", description: "Joins chunks and trims the trailing space." }
      ]
    }
  ]
};
