export default {
  project: {
    id: "ai-04",
    title: "Build a Chatbot",
    description: "Build a character chatbot that remembers the conversation, stays in persona, and streams its replies token by token.",
    difficulty: "intermediate",
    category: "chatbots_agents",
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
      explanation: `Here's the thing nobody tells you when you first call an LLM: the model forgets everything the instant it finishes replying. You send "My name is Sam." It says "Nice to meet you, Sam." You send "What's my name?" and it shrugs. The world's most advanced AI just failed a test a goldfish would pass.

## What message history is

Each API call is a fresh start. The model didn't store your name anywhere — it *can't*. There's no database behind the scenes remembering you. This property has a name: the model is **stateless**. It keeps nothing between calls.

So a chatbot that remembers is an illusion *you* build. The tool you build it with is **message history**: the running list of everything said so far, which you resend on every single call. The model re-reads the whole thing each turn and answers as if it remembered. The "memory" is just a Python list you keep adding to.

## How it works

The Messages API takes a list. Each item is a dict with two keys — a \`role\` and \`content\`:

\`\`\`python
messages = [
    {"role": "user", "content": "My name is Sam."},
    {"role": "assistant", "content": "Nice to meet you, Sam."},
    {"role": "user", "content": "What's my name?"},
]
\`\`\`

The \`role\` labels who said it: **user** for the human, **assistant** for the model. Roles **alternate** — user, assistant, user, assistant — and the list must start with a user turn. A working chatbot is four steps in a loop:

1. Read what the user typed.
2. Append it as a \`user\` turn.
3. Call the API with the **whole list**, not just the newest line.
4. Append the reply as an \`assistant\` turn, print it, repeat.

Every loop the list grows by two. That growing list *is* the memory.

## Why it matters

Most beginner chatbots feel broken because they only send the latest message and wonder why the bot is goldfish-brained. Once you see that memory is your job, three things follow:

- **You pay for it.** Resending the whole history every turn means a 40-turn chat sends all 40 turns on turn 41. Long conversations get expensive — which is why a later lesson trims history.
- **You can edit it.** Because *you* own the list, you can delete a bad turn, inject a fact, or reset the chat by clearing the list. The model never objects.
- **Order and roles matter.** Two user turns in a row, or starting with an assistant turn, gets rejected by the API. Always append the assistant reply before the next user turn.

Build the message list by hand first and simulate the back-and-forth, no real API yet. Get the data shape right; the network call is the easy part.

## The mental model to keep

The model has amnesia, but it can read a whiteboard. Each turn you hand it the **entire whiteboard** of the conversation, it reads top to bottom, and writes one more line. Lose the whiteboard, lose the memory.`,
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
      step_throughs: [
        {
          title: "Two turns, and the list becomes memory",
          steps: [
            { label: "Start empty", detail: "Before anyone speaks, the history is just an empty list. The bot knows nothing.", code: "messages = []" },
            { label: "User speaks → append", detail: "Capture the human's text and append it as a user turn. The list now has one item.", code: 'messages.append({"role": "user", "content": "My name is Sam."})' },
            { label: "Send the whole list → model replies", detail: "Call the API with every turn so far. The reply comes back as a string; you append it as an assistant turn.", code: 'messages.append({"role": "assistant", "content": "Nice to meet you, Sam."})' },
            { label: "Next question reads the history", detail: 'When the user asks "What\'s my name?", you send all three turns. The model re-reads "My name is Sam." and answers correctly.', code: 'messages.append({"role": "user", "content": "What\'s my name?"})  # model now sees Sam' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'After this code runs, how many turns are in the list?\nmessages = []\nmessages.append({"role": "user", "content": "hi"})\nmessages.append({"role": "assistant", "content": "hello"})',
          steps: [
            "Start: the list is empty, length 0.",
            "First append adds a user turn → length 1.",
            "Second append adds an assistant turn → length 2."
          ],
          output: "2 turns"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A bot only ever sends the latest user message, never the history.\nThe user says "My name is Sam," then later asks "What\'s my name?"\nWhat happens, and why?',
          steps: [
            'On the second call, only "What\'s my name?" is sent — the "My name is Sam" turn was never resent.',
            "The model is stateless, so it has no record of the earlier turn from any previous call.",
            "With no context, the model can only guess or admit it does not know.",
            "Fix: resend the full history each call so the earlier turn is visible."
          ],
          output: 'The bot fails: it never saw "Sam" because the history was not resent.'
        }
      ],
      comparison_tables: [
        {
          title: "send latest message vs send full history",
          columns: ["Approach", "What's sent on call 2", "Does the bot remember?", "Cost"],
          rows: [
            { cells: ["Latest message only", 'Just "What\'s my name?"', "No — goldfish-brained", "Cheapest, but broken"] },
            { cells: ["Full message history", "All turns so far", "Yes — appears to remember", "Grows each turn, but works"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "valid vs invalid message lists",
          bins: [
            { id: "valid", label: "Valid to send" },
            { id: "invalid", label: "Rejected by API" }
          ],
          items: [
            { id: "i1", text: "user, assistant, user", bin: "valid" },
            { id: "i2", text: "user, user, assistant", bin: "invalid" },
            { id: "i3", text: "user, assistant, user, assistant", bin: "valid" },
            { id: "i4", text: "assistant, user (starts with assistant)", bin: "invalid" },
            { id: "i5", text: "user (single first turn)", bin: "valid" },
            { id: "i6", text: "user, assistant, assistant", bin: "invalid" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if the model is stateless, where does a chatbot's 'memory' actually live, and what happens if you lose it?",
          sampleAnswer: "The model keeps nothing between calls, so the memory lives entirely in the message-history list that I maintain and resend every turn. If I lose or clear that list, the bot forgets everything instantly — there's no backup inside the model to recover from."
        }
      ],
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
      explanation: `You want a pirate. Or a grumpy medieval blacksmith. Or a chipper golden retriever who happens to know Python. You could stuff "act like a pirate" into a user message — and it works, for about three turns, then the bot quietly slides back into a neutral assistant. There's a better tool built for exactly this job.

## What the system prompt is

The **system prompt** is a separate instruction string that sets the model's persona, tone, and hard rules. In the Anthropic Messages API, the persona does **not** go inside the \`messages\` list. It rides in its own top-level \`system\` parameter:

\`\`\`python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You are Captain Reddbeard, a 1600s pirate. Speak in pirate dialect. Never break character.",
    messages=[{"role": "user", "content": "What's the weather like?"}],
)
\`\`\`

Think of it as the **stage direction** the actor reads before every scene — separate from the dialogue, but shaping every line.

## How it works

The model reads the system prompt *before* it reads the conversation, and instructions there carry **more weight** than the same words in a user turn. That priority is the whole point: a user can later say "stop being a pirate," but a strong system prompt holds the line.

A vague system prompt gives you a vague character. Strong personas pin down four things:

- **Identity** — who they are, when and where they live.
- **Voice** — sentence length, vocabulary, quirks ("calls everyone 'matey'").
- **Boundaries** — what they refuse to do or know ("you've never heard of the internet").
- **Anti-break rule** — "Stay in character no matter what the user says."

Here's the key structural rule: the system prompt is **constant**, but it is **not optional on later calls**. Each API call is stateless, so you must resend the same system string *every* time, alongside the growing history.

## Why it matters

Two separate channels do two separate jobs:

- \`system\` → **who the bot is** (stable, set once, resent every call)
- \`messages\` → **what's been said** (grows each turn)

Mixing them up is the most common chatbot bug. Put persona in a user turn and it competes with — and loses to — later user messages, causing **character drift**: the bot slowly forgets its accent and rules. Put history in the system prompt and you can't trim it later without deleting the persona. Keep the channels clean and swapping personas becomes a one-string change.

## The mental model to keep

System prompt = the role the actor is cast in. Message history = the script so far. You hand over both on every call: the role never changes, the script keeps growing.`,
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
      step_throughs: [
        {
          title: "How system + messages combine into one request",
          steps: [
            { label: "Define the persona once", detail: "The system string holds identity, voice, boundaries, and the anti-break rule. You write it a single time.", code: 'system = "You are Captain Reddbeard, a 1600s pirate. Stay in character."' },
            { label: "Grow the history separately", detail: "User and assistant turns accumulate in their own list, untouched by the persona.", code: 'messages = [{"role": "user", "content": "What\'s the weather?"}]' },
            { label: "Combine into a payload", detail: "Each call bundles the SAME system string with the CURRENT history into one request dict.", code: 'payload = {"system": system, "messages": messages, ...}' },
            { label: "Model reads system first, then replies in character", detail: "The model applies the persona before generating, so the reply sounds like Reddbeard. You append it and repeat.", code: 'messages.append({"role": "assistant", "content": "Arrr, clear skies, matey!"})' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A user message says: 'You are a pirate.' Then later the user says: 'Stop being a pirate, talk normally.'\nWhere should the persona have gone to resist this?",
          steps: [
            "Persona placed in a user turn has the same priority as any other user turn.",
            "The later 'stop' user turn competes directly and often wins → the bot drops the act.",
            "Putting the persona in the system prompt gives it higher priority than user turns.",
            "From system, the 'stay in character' rule holds even when the user pushes back."
          ],
          output: "Put it in the system prompt, not a user message."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You want to switch your bot from a pirate to a medieval blacksmith mid-project, keeping the same conversation code.\nWhat is the minimal change if persona and history are cleanly separated?",
          steps: [
            "History lives in the messages list; persona lives in the system string.",
            "Because they are separate channels, the conversation loop never references the persona text directly.",
            "Swapping personas means replacing only the system string passed into build_payload.",
            "No change to message handling, the loop, or appends is needed."
          ],
          output: "Change one string: the system prompt. Everything else stays."
        }
      ],
      comparison_tables: [
        {
          title: "persona in system prompt vs in a user message",
          columns: ["Placement", "Priority", "Survives long chats?", "User can override?"],
          rows: [
            { cells: ["First user message", "Same as any user turn", "No — drifts after a few turns", "Yes, easily"] },
            { cells: ["system parameter", "Higher than user turns", "Yes — stable across the chat", "Much harder"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "system prompt content vs message history content",
          bins: [
            { id: "system", label: "Belongs in system prompt" },
            { id: "messages", label: "Belongs in messages list" }
          ],
          items: [
            { id: "i1", text: '"You are Captain Reddbeard, a 1600s pirate."', bin: "system" },
            { id: "i2", text: '"Stay in character no matter what."', bin: "system" },
            { id: "i3", text: 'The user asking "What\'s the weather?"', bin: "messages" },
            { id: "i4", text: '"Speak in pirate dialect, call everyone matey."', bin: "system" },
            { id: "i5", text: "The bot's last reply, kept for context", bin: "messages" },
            { id: "i6", text: "The user's follow-up question", bin: "messages" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain why putting 'you are a pirate' in the system prompt resists character drift better than putting it in the first user message.",
          sampleAnswer: "The system prompt is read before every reply and carries more weight than user turns, so its rules stay in force across the whole chat. A persona in the first user message has only normal user-turn priority, so a later user message can override it and the bot drifts out of character."
        }
      ],
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
      explanation: `Your chatbot works great for ten turns. By turn fifty it either throws an error or the bill quietly triples. You've hit the wall every chatbot eventually hits: the **context window**.

## What the context window is

The **context window** is the maximum amount of text — measured in **tokens** — the model can read in a single call. And everything shares that one budget: the system prompt, the full history you resend, *and* the reply the model is about to write all have to fit together. Claude's window is large (hundreds of thousands of tokens), but it is not infinite, and here's the part that bites first: you pay **per token on every single call**. Resending a 50-turn history on turn 51 means you're billed for all 50 old turns again.

## How tokens add up

A **token** is a chunk of text — often a word or part of a word. A handy rule of thumb for English: **~4 characters per token**, or about 0.75 words per token. "Hello there friend" is roughly 4 tokens. Don't memorize exact counts; estimate, then measure with the real tokenizer when money is on the line.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

To budget a whole conversation, sum the estimate over every message's content, then add the system prompt. That total is what each call costs and what must fit in the window.

## Why it matters: keeping history in budget

When the history grows too big, you **trim** it. Two common strategies:

1. **Sliding window** — keep only the last N turns. Cheap, predictable, two lines of code. The bot forgets ancient details, but recent context stays sharp. The right default.
2. **Summarize-and-drop** — when history gets long, ask the model to compress old turns into a short summary, then replace those turns with the summary. More work and an extra API call, but it preserves the gist of a very long chat.

Most production chatbots **start** with a sliding window because it's trivial and the cost is bounded — you always know your worst-case token count.

But there's a trap. Never blindly trim the **system prompt**. That's your persona — drop it and your pirate turns back into a generic assistant mid-conversation. Trim the oldest *conversation* turns only, keep \`system\` intact, and always keep enough recent turns that the current question still makes sense.

## The mental model to keep

The context window is the model's **desk, not a warehouse**. Everything it needs to answer must fit on the desk at once. A bigger desk helps, but a long enough chat still runs out of room — so you clear off the oldest papers and keep the persona note taped to the corner.`,
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
      tools: [{ type: "tokenizer" }],
      step_throughs: [
        {
          title: "A sliding window trims the oldest turns",
          steps: [
            { label: "Measure the whole chat", detail: "Sum estimated tokens over every turn, plus the system prompt. Suppose the total is 30 tokens and the budget is 20.", code: "total_tokens(history)  # 30  > budget 20" },
            { label: "Over budget → drop the front", detail: "The oldest turn sits at index 0. Remove it; that frees its tokens. Never touch the system prompt.", code: "history.pop(0)  # drop oldest, total now 20" },
            { label: "Re-check against the budget", detail: "After each drop, recompute. Stop as soon as the total fits — and always keep at least one turn.", code: "total_tokens(history) <= budget  # True, stop" },
            { label: "Send the trimmed payload", detail: "The recent turns plus the persona now fit comfortably, so the call is cheaper and the question still makes sense.", code: "kept = trim_to_budget(history, 20)  # 2 recent turns" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Roughly how many tokens is a 400-character English message, using the ~4-chars-per-token rule?',
          steps: [
            "The rule of thumb: about 4 characters make up 1 token in English.",
            "Divide the character count by 4: 400 / 4.",
            "That gives the estimate."
          ],
          output: "About 100 tokens"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A chat has a 200-token system prompt and 50 turns averaging 80 tokens each.\nYour budget per call is 1,000 tokens.\nUsing a sliding window, how many recent turns can you keep?",
          steps: [
            "The system prompt is fixed and never trimmed: 200 tokens reserved.",
            "Tokens left for history = 1000 - 200 = 800.",
            "Each turn averages 80 tokens, so 800 / 80 = 10 turns fit.",
            "Keep the 10 most recent turns; drop the older 40."
          ],
          output: "About 10 recent turns (system + 10 turns ≈ 1,000 tokens)."
        }
      ],
      comparison_tables: [
        {
          title: "sliding window vs summarize-and-drop",
          columns: ["Strategy", "Keeps", "Cost / effort", "Best for"],
          rows: [
            { cells: ["Sliding window", "Last N turns verbatim", "Trivial, no extra call", "Most chatbots, predictable budgets"], highlight: true },
            { cells: ["Summarize-and-drop", "A summary of old turns", "Extra API call to compress", "Long chats where old details still matter"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "trim it vs never trim it",
          bins: [
            { id: "trim", label: "Safe to trim" },
            { id: "keep", label: "Never trim" }
          ],
          items: [
            { id: "i1", text: "The system prompt (persona)", bin: "keep" },
            { id: "i2", text: "The oldest user turn from 40 messages ago", bin: "trim" },
            { id: "i3", text: "The oldest assistant turn", bin: "trim" },
            { id: "i4", text: "The current user question", bin: "keep" },
            { id: "i5", text: "A turn from earlier this session that's no longer referenced", bin: "trim" },
            { id: "i6", text: "The most recent assistant reply", bin: "keep" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Claude's context window is huge. In your own words, why would you still trim a long conversation's history?",
          sampleAnswer: "Even if everything technically fits, I pay per token on every call and resend the entire history each time, so a long chat gets expensive and slow. Trimming the oldest turns with a sliding window caps the cost and keeps responses fast while preserving the recent context that matters."
        }
      ],
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
      explanation: `Watch Claude in a browser: words appear one chunk at a time, like someone typing live. That's not a cosmetic flourish. It's **streaming**, and it's the difference between a user thinking "is this thing broken?" and "it's thinking, and I can read along."

## What streaming is

**Streaming** means receiving and displaying the model's reply in small chunks *as it's generated*, instead of waiting for the whole thing. Without it, you call the API and stare at a blank screen for several seconds while the entire reply generates, then it dumps all at once. With it, the first words show up almost immediately and keep flowing.

Here's the subtle part: streaming barely changes the **total** time. What it changes is **time-to-first-token** — how long until *something* appears. And time-to-first-token is what humans actually perceive as speed.

## How it works with the SDK

The Anthropic SDK gives you a streaming **context manager**. You loop over text chunks from \`stream.text_stream\` as they arrive over the connection:

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

Two details make this work. \`print(text, end="", flush=True)\` prints each chunk with no newline and **forces it to the screen immediately** — without \`flush\`, Python buffers stdout and you lose the live typing effect entirely. And \`get_final_message()\` hands you the complete assembled reply once the stream ends.

## Why it matters: don't forget the history

Streaming is about **display**. It does not change the memory rules from lesson 1. The chunks you print are for the human's eyes; they are not stored anywhere automatically. After the stream finishes, you still take the full assembled reply and append it as an \`assistant\` turn so the next call has the context:

- **Stream to show** — print chunks live so it feels responsive.
- **Store to remember** — capture the final reply and append it to history.

Skip the store step and your bot streams beautifully but forgets every reply the instant it finishes — back to goldfish-brain.

## The mental model to keep

You're now holding all four pieces of a real character chatbot: a **system-prompt persona**, a **growing message list**, a **sliding window** to stay in budget, and **streamed output** so it feels alive. Stream to the user, then store the result. Below you'll simulate streaming by yielding chunks and reassembling them into the message you'd save.`,
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
      step_throughs: [
        {
          title: "Stream to show, then store to remember",
          steps: [
            { label: "Open the stream", detail: "Call messages.stream with the same system + history as a normal call. It returns a context manager.", code: "with client.messages.stream(...) as stream:" },
            { label: "Loop chunks, print live", detail: "Iterate text_stream. Print each piece with end='' and flush=True so it appears immediately, building the live typing effect.", code: 'for text in stream.text_stream:\\n    print(text, end="", flush=True)' },
            { label: "Assemble the full reply", detail: "Once the stream ends, get the complete message. The chunks you printed are NOT stored anywhere on their own.", code: "final = stream.get_final_message()" },
            { label: "Store it in history", detail: "Append the assembled reply as an assistant turn so the next call remembers it. Streaming changed display, not memory.", code: 'messages.append({"role": "assistant", "content": reply})' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Two bots take exactly 4 seconds to generate a 200-word reply. Bot A waits then dumps it; Bot B streams.\nWhich feels faster to the user, and why?",
          steps: [
            "Both finish the full reply at the same 4-second mark — total time is identical.",
            "Bot A shows nothing for 4 seconds, then everything at once.",
            "Bot B shows the first words almost immediately and keeps flowing.",
            "Users judge speed by time-to-first-token, so Bot B feels much faster."
          ],
          output: "Bot B (streaming) feels faster, despite equal total time."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A developer streams replies with print(chunk, end="", flush=True) but never appends the final reply to history.\nThe bot looks great but fails on the user\'s next question. Why?',
          steps: [
            "Streaming only prints chunks to the screen; it stores nothing in the messages list.",
            "Because the assistant reply was never appended, the next call's history is missing it.",
            "The stateless model re-reads a history with a gap and can't recall what it just said.",
            "Fix: capture get_final_message() (or the assembled string) and append it as an assistant turn."
          ],
          output: "Display worked, but memory broke — the reply was shown but never stored."
        }
      ],
      comparison_tables: [
        {
          title: "no streaming vs streaming",
          columns: ["Behavior", "First words appear", "Total time", "Feels"],
          rows: [
            { cells: ["No streaming", "After the whole reply finishes", "Same", 'Slow — "is it broken?"'] },
            { cells: ["Streaming", "Almost immediately, then flows", "Same", 'Fast and alive'], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what streaming changes vs what it doesn't",
          bins: [
            { id: "changes", label: "Streaming affects this" },
            { id: "same", label: "Unchanged by streaming" }
          ],
          items: [
            { id: "i1", text: "When the first words appear on screen", bin: "changes" },
            { id: "i2", text: "Perceived responsiveness", bin: "changes" },
            { id: "i3", text: "Total time to finish the reply", bin: "same" },
            { id: "i4", text: "The need to append the reply to history", bin: "same" },
            { id: "i5", text: "The model's accuracy", bin: "same" },
            { id: "i6", text: "How the wait feels to the user", bin: "changes" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Streaming makes a chatbot feel faster but doesn't reduce total time. In your own words, explain that, and why you still must append the reply to history.",
          sampleAnswer: "Streaming sends the reply in chunks so the first words appear almost instantly; total generation time is the same, but users judge speed by time-to-first-token, so it feels faster. Streaming only controls display, so I still have to capture the full assembled reply and append it as an assistant turn — otherwise the stateless model has no record of what it just said on the next call."
        }
      ],
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
