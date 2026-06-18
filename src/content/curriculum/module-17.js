export default {
  project: {
    id: "ai-17",
    title: "Chat Roles & Messages",
    description: "Learn how a chat request is really an ordered list of role-tagged messages, and how apps assemble that list to drive a conversation.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 90,
    lessons_count: 8,
    tags: ["messages", "system-prompt", "roles", "conversation", "fundamentals"],
    order: 17,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-17-l1",
      project_id: "ai-17",
      order: 1,
      title: "The Message List",
      concept: "Messages",
      xp_reward: 10,
      explanation: `Open the developer console while chatting with an AI app and you won't see a paragraph being sent. You'll see a list — a few labeled boxes, each tagged with who said it. That list *is* the request. Once you see chat as a list of messages instead of a stream of text, the whole API stops feeling like magic.

## What it is

A chat request is an **ordered list of messages**. Each message is a small object with two parts: a **role** (who is speaking) and **content** (what they said). There are three roles you'll use constantly:

- **system** — instructions that set up how the assistant should behave.
- **user** — what the human typed.
- **assistant** — what the model said back.

The model reads the *entire list*, top to bottom, and predicts one thing: the next **assistant** message. That's the whole contract. You hand it a labeled transcript; it writes the next assistant line.

## How it works

A message is just structured data. In Python it's a dictionary, and the conversation is a list of them:

\`\`\`python
messages = [
    {"role": "system", "content": "You are a helpful tutor."},
    {"role": "user", "content": "What is a token?"},
]
\`\`\`

You send that list. The model treats it as one big input — the **context** from the prediction lessons — and continues it with an assistant turn:

\`\`\`python
reply = {"role": "assistant", "content": "A token is a chunk of text..."}
\`\`\`

Order matters. The roles tell the model who said what, but the *sequence* tells it how the conversation flowed. Shuffle the list and you change the meaning, exactly like scrambling lines in a script.

## Why it matters

Thinking in messages instead of one big string unlocks everything else:

- **Roles separate instructions from input.** The system role is for rules; the user role is for the actual request. Mixing them is a common beginner mistake.
- **The output is just another message.** The assistant's reply is a message of the same shape — which is why you can append it back and keep going.
- **It's all one prediction.** No matter how many messages you send, the model still does one job: predict the next assistant message over the whole list.

## The mental model to keep

A chat request is a **script with labeled speakers**, and the model is an actor hired to write the very next assistant line. It reads every line above, then delivers one.`,
      key_terms: [
        { term: "Message", definition: "A small object with a role and content; the basic unit of a chat request." },
        { term: "Role", definition: "A label on a message saying who is speaking: system, user, or assistant." },
        { term: "Content", definition: "The actual text of a message — the words attached to a role." }
      ],
      callouts: [
        { type: "analogy", title: "It's a script with named speakers", content: "Picture a screenplay: each line is tagged SYSTEM, USER, or ASSISTANT. The model reads the whole script and writes the next ASSISTANT line. Roles are the speaker names; content is the dialogue.", position: "before" },
        { type: "insight", title: "The reply is just another message", content: "The model's output has the exact same shape as the input messages — role 'assistant', plus content. That sameness is what lets you append it and continue the conversation later.", position: "after" }
      ],
      concept_diagram: {
        title: "From a message list to the next reply",
        steps: [
          { label: "Build the list", desc: "Assemble messages, each with a role and content." },
          { label: "Send it all", desc: "The whole ordered list becomes the model's input." },
          { label: "Predict the next turn", desc: "The model reads top to bottom and writes one assistant message." },
          { label: "Get a message back", desc: "The reply is an assistant message of the same shape." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a single chat message always contain?",
          options: ["A token count and a price", "A role and content", "A username and a timestamp"],
          correct_index: 1,
          explanation: "Every message pairs a role (who is speaking) with content (what was said)."
        }
      ],
      quiz_questions: [
        {
          question: "What is the model's job when you send a list of messages?",
          options: [
            "Reorder the messages by importance",
            "Predict the next assistant message over the whole list",
            "Translate every message into tokens and stop",
            "Reply to each user message separately"
          ],
          correct_index: 1,
          explanation: "The model reads the entire ordered list and produces one thing: the next assistant message."
        },
        {
          question: "Which three roles make up a standard chat request?",
          options: [
            "input, output, error",
            "human, robot, admin",
            "system, user, assistant",
            "prompt, response, memory"
          ],
          correct_index: 2,
          explanation: "system sets behavior, user is the human's text, and assistant is the model's reply."
        },
        {
          question: "Why does the order of messages matter?",
          options: [
            "The API sorts them alphabetically anyway",
            "Only the last message is ever read",
            "Sequence tells the model how the conversation flowed, like lines in a script",
            "Order changes the price but not the meaning"
          ],
          correct_index: 2,
          explanation: "The model reads top to bottom; rearranging messages changes the meaning of the conversation."
        }
      ],
      participation_activities: [
        {
          activity_title: "Message basics check",
          questions: [
            { question: "The model's reply is a message with the same role/content shape as the inputs.", type: "true_false", correct_answer: "true", explanation: "The assistant reply is just another message object, which is why it can be appended back." },
            { question: "Each message in a chat request has a role and ______.", type: "fill_in", correct_answer: "content", explanation: "Role says who is speaking; content holds the actual text." }
          ]
        }
      ],
      starter_code: `# A chat request is a list of message dicts. Print who said what.
messages = [
    {"role": "system", "content": "You are a helpful tutor."},
    {"role": "user", "content": "What is a token?"},
]

# TODO: loop over the messages and print "ROLE: content" for each one.
print(len(messages), "messages")
`,
      solution_code: `messages = [
    {"role": "system", "content": "You are a helpful tutor."},
    {"role": "user", "content": "What is a token?"},
]

print(len(messages), "messages")
for m in messages:
    print(f"{m['role']}: {m['content']}")
`,
      expected_output: `2 messages
system: You are a helpful tutor.
user: What is a token?`,
      step_throughs: [
        {
          title: "one reply, built from a labeled list",
          steps: [
            { label: "Start the list", detail: "Begin with a system message that sets up behavior. Nothing has been said by the user yet.", code: 'messages = [{"role": "system", "content": "You are a tutor."}]' },
            { label: "Add the user turn", detail: "Append what the human typed as a user message. The list now has two entries.", code: 'messages.append({"role": "user", "content": "Define a token."})' },
            { label: "Send the whole list", detail: "The model receives all messages in order as one input and reads them top to bottom.", code: "reply = model(messages)  # reads every message" },
            { label: "Get an assistant message", detail: "The model returns one new message, role 'assistant', with its answer as content.", code: '{"role": "assistant", "content": "A token is a chunk of text."}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You have messages = [{"role": "user", "content": "Hi"}]. What role will the model\'s reply have?',
          steps: [
            "The model's single job is to write the next assistant message.",
            "It reads the user message and continues the conversation as the assistant.",
            "So the reply object's role is always 'assistant'."
          ],
          output: '"assistant"'
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A beginner puts their actual question inside the system message and leaves the user message empty. Why is that a problem?',
          steps: [
            "The system role is meant for behavior and rules, not for the specific request.",
            "The user role is where the model expects the actual task or question to live.",
            "With the question misplaced and the user message empty, the model has weak signal about what to actually answer.",
            "Fix: keep setup in system, put the real request in a user message."
          ],
          output: "Setup belongs in system; the actual request belongs in a user message — separating them gives clearer signal."
        }
      ],
      comparison_tables: [
        {
          title: "the three message roles",
          columns: ["Role", "Who it represents", "Typical use"],
          rows: [
            { cells: ["system", "The app/developer", "Set persona, rules, and format up front"] },
            { cells: ["user", "The human", "The actual question or instruction"] },
            { cells: ["assistant", "The model", "Replies the model wrote (now or earlier)"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "is it a message field or not?",
          bins: [
            { id: "part", label: "Part of a message" },
            { id: "notpart", label: "NOT part of a message" }
          ],
          items: [
            { id: "i1", text: '"role" (who is speaking)', bin: "part" },
            { id: "i2", text: '"content" (the text)', bin: "part" },
            { id: "i3", text: "The WiFi password", bin: "notpart" },
            { id: "i4", text: "A value like 'system', 'user', or 'assistant'", bin: "part" },
            { id: "i5", text: "Your screen brightness", bin: "notpart" },
            { id: "i6", text: "The words the speaker said", bin: "part" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is it more useful to think of a chat request as a list of labeled messages than as one big block of text?",
          sampleAnswer: "A labeled list keeps the pieces separate and meaningful: the system rules are distinct from the user's question, and each turn is tagged with who said it. That structure lets the model tell instructions from input and lets the app append the model's reply and keep going. One big block would blur all of that together and lose the conversation's shape."
        }
      ],
      hints: [
        "messages is a list of dicts; loop with 'for m in messages'.",
        "Each dict has keys 'role' and 'content' — access them with m['role'] and m['content'].",
        "An f-string like f\"{m['role']}: {m['content']}\" prints them on one line."
      ],
      challenge_title: "Transcript Renderer",
      challenge_description: "Turn a raw message list into a labeled, numbered transcript — the view every chat-debugging tool ships — and report how many messages each role contributed.",
      challenge_story: "You're building the request inspector for an AI chat platform. When a conversation misbehaves, support engineers paste the raw message list and need to *see* it: who spoke, in what order, and how the back-and-forth flows. Your renderer takes the ordered list of \`{role, content}\` messages and prints a clean transcript. The **system** message is setup, not a turn, so it gets a \`[setup]\` tag. Every **user** and **assistant** message is a real turn and gets a sequential turn number. Finally you print a one-line role tally so engineers can spot a malformed request (say, two system messages, or a missing assistant reply) at a glance.",
      challenge_statement: "You are given an ordered list of chat messages. Render a transcript:\n\n1. For each message in order, print one line.\n2. A message with role \`system\` is setup: print \`[setup] System: <content>\`.\n3. A message with role \`user\` or \`assistant\` is a **turn**. Number turns starting at 1 in the order they appear (system messages do **not** advance the turn counter). Print \`[<turn>] <Role>: <content>\`, where \`<Role>\` is the role capitalized (\`User\`, \`Assistant\`).\n4. After all messages, print one summary line: \`system=<s> user=<u> assistant=<a>\` with the count of each role.",
      challenge_input_format: "The first line is an integer `n`: the number of messages.\n\nEach of the next `n` lines is one message: a role (`system`, `user`, or `assistant`), a single space, then the content (which may contain spaces).",
      challenge_output_format: "Print `n` transcript lines as described, then one summary line `system=<s> user=<u> assistant=<a>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "Each role is exactly one of `system`, `user`, `assistant`.",
        "Content is non-empty and may contain spaces but no newline.",
      ],
      challenge_examples: [
        { input: "4\nsystem Be concise.\nuser Hello\nassistant Hi there.\nuser Bye", output: "[setup] System: Be concise.\n[1] User: Hello\n[2] Assistant: Hi there.\n[3] User: Bye\nsystem=1 user=2 assistant=1", explanation: "The system line is tagged `[setup]` and never advances the turn counter; the three user/assistant turns are numbered 1, 2, 3." },
        { input: "1\nsystem You are a router.", output: "[setup] System: You are a router.\nsystem=1 user=0 assistant=0", explanation: "A request can be system-only; there are no turns, so the tally shows zero user and zero assistant messages." },
      ],
      challenge_notes: "Splitting each line on the *first* space separates the role from content that may itself contain spaces — `line.split(' ', 1)` does exactly that. Keeping the turn counter independent of system messages mirrors how real APIs treat the system prompt as configuration, not conversation.",
      challenge_hints: [
        "Read `n`, then loop `n` times; split each line once on the first space into `role` and `content`.",
        "Keep a separate `turn` counter that you increment only for `user`/`assistant` messages.",
        "Track three integer counts as you go, then print the summary line after the loop.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: for each of the next n lines, split once on the first space into
    #       role and content. Print [setup] for system, [turn] for user/assistant
    #       (capitalize the role), then print the role tally.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    counts = {"system": 0, "user": 0, "assistant": 0}
    lines = []
    turn = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        role, content = line.split(" ", 1)
        counts[role] += 1
        if role in ("user", "assistant"):
            turn += 1
            lines.append(f"[{turn}] {role.capitalize()}: {content}")
        else:
            lines.append(f"[setup] {role.capitalize()}: {content}")
    print("\\n".join(lines))
    print(f"system={counts['system']} user={counts['user']} assistant={counts['assistant']}")

main()
`,
      challenge_test_cases: [
        { input: "4\nsystem Be concise.\nuser Hello\nassistant Hi there.\nuser Bye", expected_output: "[setup] System: Be concise.\n[1] User: Hello\n[2] Assistant: Hi there.\n[3] User: Bye\nsystem=1 user=2 assistant=1", description: "Setup tag plus numbered turns and a correct role tally." },
        { input: "1\nsystem You are a router.", expected_output: "[setup] System: You are a router.\nsystem=1 user=0 assistant=0", description: "System-only request: no turns, zero user/assistant counts." },
        { input: "3\nuser ping\nassistant pong\nuser ping again", expected_output: "[1] User: ping\n[2] Assistant: pong\n[3] User: ping again\nsystem=0 user=2 assistant=1", description: "Edge: no system message; turns start at 1 and content with spaces is preserved." }
      ]
    },
    {
      id: "ai-17-l2",
      project_id: "ai-17",
      order: 2,
      title: "System Prompts: Setting Behavior",
      concept: "System prompt",
      xp_reward: 10,
      explanation: `Hand the same model two different first lines and you get two different assistants. "You are a terse senior engineer" produces clipped, technical answers. "You are a warm kindergarten teacher" produces gentle, simple ones. Same model, same question — the only difference is one message at the top. That message is the **system prompt**, and it's the cheapest, most powerful lever you have.

## What it is

The **system prompt** is the first message in the list, with role \`system\`. It's not part of the back-and-forth chatter — it's the setup. It tells the model *who it is* and *how it should behave* for the entire conversation that follows. The user never sees it; the app supplies it.

Think of it as the director's note to an actor before the scene starts: persona, tone, rules, and the format of the lines they should deliver.

## How it works

A system prompt is just content on a message with role \`system\`, placed first:

\`\`\`python
messages = [
    {"role": "system", "content": "You are a SQL expert. Answer only with a single SQL query, no explanation."},
    {"role": "user", "content": "Get all users created today."},
]
\`\`\`

Because the model reads top to bottom, the system message colors how it interprets and answers everything below it. A good system prompt usually covers a few things:

- **Persona** — who the assistant is ("a careful legal assistant").
- **Rules** — what it must or must not do ("never give medical advice").
- **Format** — how the answer should look ("reply in one sentence", "return JSON").

Keep it specific. Vague setup ("be helpful") barely steers anything; concrete setup ("reply in under 20 words, no emojis") steers a lot.

## Why it matters

The system prompt is where most behavior problems get fixed:

- **Consistency.** It applies to every turn, so the persona doesn't drift halfway through the chat.
- **Cheaper than fine-tuning.** You can completely change the assistant's behavior by editing one string — no retraining, no code changes elsewhere.
- **It's still just text.** A determined user *can* push against it, and the model can still ignore parts of it. It's strong guidance, not an unbreakable law.

## The mental model to keep

The system prompt is the **director's note** delivered before the scene: it sets the role, the rules, and the style, and it stays in effect for the whole conversation.`,
      key_terms: [
        { term: "System prompt", definition: "The first message (role 'system') that sets the assistant's persona, rules, and output format for the whole conversation." },
        { term: "Persona", definition: "The character or role the assistant adopts, defined in the system prompt." },
        { term: "Output format", definition: "The shape the answer should take (length, structure, style), often specified in the system prompt." }
      ],
      callouts: [
        { type: "analogy", title: "A director's note before the scene", content: "Before an actor performs, the director says: you're a nervous detective, keep it short, no slang. The system prompt is that note — it shapes every line the assistant delivers afterward.", position: "before" },
        { type: "tip", title: "Be concrete, not vague", content: "'Be helpful' steers almost nothing. 'Reply in under 20 words, no emojis, plain English' steers a lot. Specific rules and formats are what actually change behavior.", position: "after" }
      ],
      concept_diagram: {
        title: "How a system prompt shapes replies",
        steps: [
          { label: "Write the setup", desc: "Define persona, rules, and format in a system message." },
          { label: "Place it first", desc: "It goes at the top of the message list, before any user turn." },
          { label: "Model reads it first", desc: "Every later message is interpreted under that setup." },
          { label: "Replies follow the rules", desc: "Tone, content, and format match the system prompt across all turns." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where does the system prompt go in the message list?",
          options: ["Last, after the final user message", "First, before any user message", "It can go anywhere; position doesn't matter"],
          correct_index: 1,
          explanation: "The system message goes first so its setup applies to everything the model reads after it."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main purpose of a system prompt?",
          options: [
            "To store the user's password securely",
            "To set the assistant's persona, rules, and output format for the whole chat",
            "To count how many tokens the conversation uses",
            "To translate the conversation into another language"
          ],
          correct_index: 1,
          explanation: "The system prompt is the setup message that shapes how the assistant behaves across the conversation."
        },
        {
          question: "Which system prompt is most likely to produce predictable output?",
          options: [
            "\"Be a good assistant.\"",
            "\"Help the user.\"",
            "\"Reply with exactly one sentence, plain English, no emojis.\"",
            "\"Do your best.\""
          ],
          correct_index: 2,
          explanation: "Concrete rules and a specified format steer behavior far more than vague encouragement."
        },
        {
          question: "Which statement about the system prompt is TRUE?",
          options: [
            "It is an unbreakable rule the model can never ignore",
            "Users can see and edit it by default",
            "It is strong guidance the model usually follows, but not a guarantee",
            "It must be the last message in the list"
          ],
          correct_index: 2,
          explanation: "A system prompt is influential text, not an absolute law — the model can still deviate or be pushed against it."
        }
      ],
      participation_activities: [
        {
          activity_title: "System prompt check",
          questions: [
            { question: "A vague system prompt like 'be helpful' steers the model just as strongly as a specific one.", type: "true_false", correct_answer: "false", explanation: "Specific rules and formats steer behavior much more than vague instructions." },
            { question: "The first message that sets the assistant's behavior has the role ______.", type: "fill_in", correct_answer: "system", explanation: "The setup message uses the 'system' role and goes at the top of the list." }
          ]
        }
      ],
      starter_code: `# Build a messages list that starts with a system prompt.
system_prompt = "You are a SQL expert. Reply with only a SQL query."
user_question = "Get all users created today."

# TODO: build a messages list: system message first, then the user message.
# Then print the role of the FIRST message to confirm it's the system prompt.
messages = []
print("built", len(messages), "messages")
`,
      solution_code: `system_prompt = "You are a SQL expert. Reply with only a SQL query."
user_question = "Get all users created today."

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_question},
]

print("built", len(messages), "messages")
print("first role:", messages[0]["role"])
`,
      expected_output: `built 2 messages
first role: system`,
      step_throughs: [
        {
          title: "writing setup that actually steers behavior",
          steps: [
            { label: "Pick a persona", detail: "Decide who the assistant is. This frames its tone and knowledge.", code: '"You are a careful legal assistant."' },
            { label: "Add rules", detail: "State hard constraints — what it must or must not do. These prevent unwanted behavior.", code: '"Never give medical advice. Cite the source clause."' },
            { label: "Specify the format", detail: "Tell it the shape of the answer so output is predictable and parseable.", code: '"Reply in one sentence, no emojis."' },
            { label: "Place it first", detail: "Put it as the system message at the top so it governs every later turn.", code: 'messages = [{"role": "system", "content": setup}, ...]' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You want every reply to be short. Which message should carry the rule "answer in one sentence"?',
          steps: [
            "A rule that should apply to the whole conversation belongs in the setup.",
            "The setup message is the system prompt, placed first.",
            "Put 'answer in one sentence' in the system message so it governs every turn."
          ],
          output: "Put it in the system prompt (the first, role 'system' message)."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'Your assistant starts polite but turns blunt after a few turns. The system prompt says only "be nice." How do you fix the drift?',
          steps: [
            "'Be nice' is vague — it gives the model little concrete behavior to lock onto.",
            "Replace it with specific, testable rules: tone, banned phrasing, and a format.",
            "For example: 'Always use a warm, encouraging tone. Never use sarcasm. End with one supportive sentence.'",
            "Because the system prompt applies to every turn, concrete rules keep the persona consistent instead of drifting."
          ],
          output: "Make the system prompt concrete and rule-based so the persona stays consistent across all turns."
        }
      ],
      comparison_tables: [
        {
          title: "weak vs strong system prompts",
          columns: ["Aspect", "Weak prompt", "Strong prompt"],
          rows: [
            { cells: ["Persona", "\"Be helpful\"", "\"You are a terse senior engineer\""] },
            { cells: ["Rules", "None stated", "\"Never guess; say 'unsure' instead\""] },
            { cells: ["Format", "Unspecified", "\"Reply in under 20 words\""] },
            { cells: ["Result", "Inconsistent, drifts", "Predictable, consistent across turns"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "belongs in the system prompt vs not",
          bins: [
            { id: "system", label: "Good for the system prompt" },
            { id: "notsystem", label: "Does NOT belong there" }
          ],
          items: [
            { id: "i1", text: '"You are a friendly cooking assistant"', bin: "system" },
            { id: "i2", text: '"Reply in under 30 words"', bin: "system" },
            { id: "i3", text: '"How do I boil an egg?" (the actual question)', bin: "notsystem" },
            { id: "i4", text: '"Never recommend unsafe food handling"', bin: "system" },
            { id: "i5", text: '"Here is my grocery list for today"', bin: "notsystem" },
            { id: "i6", text: '"Always answer in plain English, no jargon"', bin: "system" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can editing one system prompt change an assistant's behavior more easily than changing the model itself?",
          sampleAnswer: "The model's weights are frozen and expensive to change, but the system prompt is just text fed in at the top of every request. Because the model reads it first and lets it color every reply, swapping that one string reshapes persona, rules, and format instantly — no retraining, no code changes elsewhere. It's the cheapest place to steer behavior."
        }
      ],
      hints: [
        "Build the list with the system message first, then the user message.",
        "Each message is a dict: {\"role\": ..., \"content\": ...}.",
        "messages[0] is the first message; check its 'role' key to confirm it's 'system'."
      ],
      challenge_title: "The System-Prompt Router",
      challenge_description: "Build the dispatcher that reads an incoming user message, picks the right persona's system prompt by keyword, and falls back to a default — the routing layer behind every multi-skill AI assistant.",
      challenge_story: "Your company runs one chat endpoint that wears many hats: billing questions need a calm **billing specialist**, broken-checkout reports need a **senior engineer**, and greetings get a **friendly greeter**. The model is the same every time — only the **system prompt** changes. You're writing the router that sits in front of the model: it scans each incoming user message for trigger keywords and selects the matching system prompt. If several rules match, the **highest-priority** rule wins (rules are listed in priority order, first = highest). If nothing matches, the message gets the **default** system prompt so no request goes unanswered.",
      challenge_statement: "You are given a set of routing rules and a batch of incoming user messages. For each message, choose its system prompt:\n\n1. Each rule is a **keyword** plus the **system prompt** to use when that keyword appears. Rules are given in **priority order** (the first rule is highest priority).\n2. A rule matches a message if its keyword appears as a **case-insensitive substring** of the message.\n3. If one or more rules match a message, use the system prompt of the **highest-priority** matching rule (the one appearing earliest in the rule list).\n4. If no rule matches, use the **default** system prompt.\n\nPrint the chosen system prompt for each message, one per line, in input order.",
      challenge_input_format: "The first line has two integers `n q`: the number of rules and the number of incoming messages.\n\nEach of the next `n` lines is one rule: a keyword (no spaces), a single space, then the system prompt text (which may contain spaces).\n\nThe next line is the default system prompt.\n\nEach of the final `q` lines is one incoming user message.",
      challenge_output_format: "Print `q` lines: the chosen system prompt for each message, in order.",
      challenge_constraints: [
        "1 ≤ n ≤ 500",
        "1 ≤ q ≤ 500",
        "Keywords contain no spaces; matching is case-insensitive.",
        "Messages and prompts may contain spaces but no newline.",
      ],
      challenge_examples: [
        { input: "3 4\nrefund You are a billing specialist.\nbug You are a senior engineer.\nhello You are a friendly greeter.\nYou are a general assistant.\nI need a refund please\nThere is a bug in checkout\nhello there\nWhat is the weather", output: "You are a billing specialist.\nYou are a senior engineer.\nYou are a friendly greeter.\nYou are a general assistant.", explanation: "Each of the first three messages hits exactly one keyword; the last matches nothing and falls back to the default." },
        { input: "1 1\ncode You are a coder.\nYou are default.\nNothing matches here", output: "You are default.", explanation: "The keyword `code` does not appear in the message, so the default prompt is used." },
      ],
      challenge_notes: "Routing by keyword is the simplest form of *intent classification* — real systems use a small model or embeddings, but the dispatch pattern is identical: classify the request, then swap in the matching system prompt. Lowercasing both the keyword and the message before checking `in` makes the match case-insensitive.",
      challenge_hints: [
        "Store rules in a list so their index encodes priority; lower index = higher priority.",
        "For each message, scan rules in order and take the first whose keyword is a substring of the lowercased message.",
        "If the scan finds no match, emit the default prompt.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, q = map(int, data[0].split())
    # TODO: read n rules (keyword + prompt), then the default prompt, then q
    #       messages. For each message print the highest-priority matching
    #       rule's prompt, or the default if none match.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, q = map(int, data[idx].split()); idx += 1
    routes = []  # (keyword_lower, prompt) in priority order
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        keyword = parts[0]
        prompt = " ".join(parts[1:])
        routes.append((keyword.lower(), prompt))
    default = data[idx]; idx += 1
    out = []
    for _ in range(q):
        msg = data[idx]; idx += 1
        low = msg.lower()
        chosen = default
        for keyword, prompt in routes:
            if keyword in low:
                chosen = prompt
                break
        out.append(chosen)
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3 4\nrefund You are a billing specialist.\nbug You are a senior engineer.\nhello You are a friendly greeter.\nYou are a general assistant.\nI need a refund please\nThere is a bug in checkout\nhello there\nWhat is the weather", expected_output: "You are a billing specialist.\nYou are a senior engineer.\nYou are a friendly greeter.\nYou are a general assistant.", description: "Single-keyword matches plus a default fallback." },
        { input: "1 1\ncode You are a coder.\nYou are default.\nNothing matches here", expected_output: "You are default.", description: "No rule matches, so the default prompt is used." },
        { input: "2 2\nbug You are tier-2 support.\nbug You are tier-1 support.\nDefault helper.\nThe app has a BUG today\nall good", expected_output: "You are tier-2 support.\nDefault helper.", description: "Two rules share a keyword and casing differs; the earlier (higher-priority) rule wins, second message falls back." }
      ]
    },
    {
      id: "ai-17-l3",
      project_id: "ai-17",
      order: 3,
      title: "Multi-Turn Conversations",
      concept: "Conversation history",
      xp_reward: 10,
      explanation: `You tell a chatbot "my name is Sam." Five messages later it still calls you Sam — so it clearly remembers, right? Wrong. The model forgot you the instant it finished replying. The app remembered. Every single turn, it quietly resends the entire conversation so far. Understanding this trick is the difference between using chat and building chat.

## What it is

A **multi-turn conversation** is back-and-forth: user, assistant, user, assistant. But the model is **stateless** — from the prediction lessons, it keeps nothing between requests. So how does turn five know about turn one?

The answer: the app stores the **conversation history** — the full list of messages — and resends *all of it* on every request. Each turn isn't "continue where we left off." It's a brand-new prediction over the whole transcript, including the model's own past replies.

## How it works

The crucial insight is that **assistant messages become part of the input**. When the model replies, the app appends that reply to the history, then on the next user turn sends everything:

\`\`\`python
history = [
    {"role": "system", "content": "You are a friendly assistant."},
    {"role": "user", "content": "My name is Sam."},
    {"role": "assistant", "content": "Nice to meet you, Sam!"},  # the model's own past reply
    {"role": "user", "content": "What's my name?"},
]
# The whole list is sent. The model "knows" the name only because it's right there in the input.
\`\`\`

The list grows every turn: append the user's new message, send everything, get a reply, append the reply, repeat. The model never "remembers" — the *list* carries the memory, and the model re-reads it from scratch each time.

## Why it matters

This re-send mechanism explains a lot of real behavior:

- **"Memory" is resent text.** The bot doesn't store your name. The app puts it back in the input every time. Start a fresh conversation and it's gone.
- **History costs tokens, every turn.** Because the whole list is resent each time, long conversations get more expensive per turn — you're paying to re-read the entire transcript repeatedly.
- **Old turns can fall off.** When the history outgrows the context window, the app must drop or summarize the oldest messages — and then the model genuinely "forgets" them.

## The mental model to keep

The model has **amnesia after every reply**. The conversation feels continuous only because the app hands it the entire transcript — including the model's own previous lines — at the start of every single turn.`,
      key_terms: [
        { term: "Multi-turn conversation", definition: "A back-and-forth exchange of user and assistant messages over several turns." },
        { term: "Conversation history", definition: "The full list of past messages the app stores and resends on each new turn." },
        { term: "Stateless", definition: "The model keeps nothing between requests; each call is a fresh prediction over the messages it's given." }
      ],
      callouts: [
        { type: "analogy", title: "An actor with no memory between takes", content: "Imagine an actor who forgets everything the moment 'cut' is called. To shoot the next take, the director hands them the full script — including their own past lines — every time. That re-handing is the app resending history.", position: "before" },
        { type: "warning", title: "Memory is an illusion, and it isn't free", content: "The model stores nothing. The app resends the whole transcript each turn, so longer chats cost more tokens per turn, and very old messages eventually get dropped to fit the context window.", position: "after" }
      ],
      concept_diagram: {
        title: "How one back-and-forth turn works",
        steps: [
          { label: "Append the user turn", desc: "Add the human's new message to the stored history." },
          { label: "Resend everything", desc: "The whole list — including past assistant replies — goes to the model." },
          { label: "Model predicts fresh", desc: "Stateless, it re-reads the full transcript and writes the next reply." },
          { label: "Append the reply", desc: "Add the assistant message to history, ready for the next turn." }
        ]
      },
      inline_quizzes: [
        {
          question: "How does a chatbot 'remember' something you said earlier in the conversation?",
          options: ["The model stores it in its weights", "The app resends the earlier messages as part of each new request", "It saves it to a separate memory file the model reads"],
          correct_index: 1,
          explanation: "The model is stateless; the app resends the full history every turn, so earlier text is back in the input."
        }
      ],
      quiz_questions: [
        {
          question: "Why does the model 'know' your name several turns later?",
          options: [
            "It permanently stored your name in its weights",
            "Your name is in the resent history, so it's right there in the input",
            "It guessed your name from your writing style",
            "The API caches it on a server for you"
          ],
          correct_index: 1,
          explanation: "The app resends the whole transcript each turn, so the earlier message containing your name is part of the new input."
        },
        {
          question: "What happens to the model's own replies in a multi-turn chat?",
          options: [
            "They are discarded and never seen again",
            "They are appended to history and resent as part of the input on later turns",
            "They are stored only on the user's device",
            "They are summarized into the system prompt automatically"
          ],
          correct_index: 1,
          explanation: "Assistant messages become part of the input; the app appends them and resends them so the model can build on them."
        },
        {
          question: "Why do long conversations cost more per turn?",
          options: [
            "The model charges a late fee",
            "The whole history is resent each turn, so more tokens are read every time",
            "Older models are slower",
            "Each new message doubles the price automatically"
          ],
          correct_index: 1,
          explanation: "Because the entire transcript is resent on every turn, you pay to re-read all of it repeatedly as it grows."
        }
      ],
      participation_activities: [
        {
          activity_title: "Multi-turn check",
          questions: [
            { question: "The model stores your conversation in its own memory between requests.", type: "true_false", correct_answer: "false", explanation: "The model is stateless; the app resends the history each turn." },
            { question: "On each new turn, the app resends the full conversation ______ to the model.", type: "fill_in", correct_answer: "history", explanation: "The stored history (all past messages) is resent so the model has context." }
          ]
        }
      ],
      starter_code: `# Simulate one turn: append a reply to history, then resend everything.
history = [
    {"role": "system", "content": "You are friendly."},
    {"role": "user", "content": "My name is Sam."},
]

# Pretend the model replied:
reply = {"role": "assistant", "content": "Hi Sam!"}

# TODO: append the reply to history, then print how many messages
# would be RESENT on the next turn.
print("history length:", len(history))
`,
      solution_code: `history = [
    {"role": "system", "content": "You are friendly."},
    {"role": "user", "content": "My name is Sam."},
]

reply = {"role": "assistant", "content": "Hi Sam!"}
history.append(reply)

print("history length:", len(history))
print("messages resent next turn:", len(history))
`,
      expected_output: `history length: 3
messages resent next turn: 3`,
      step_throughs: [
        {
          title: "why turn five remembers turn one",
          steps: [
            { label: "Turn 1: user speaks", detail: "The user says their name. The app appends it to history.", code: 'history = [{"role": "user", "content": "I am Sam."}]' },
            { label: "Turn 1: append the reply", detail: "The model replies; the app appends that assistant message so it's saved too.", code: 'history.append({"role": "assistant", "content": "Hi Sam!"})' },
            { label: "Turn 2: resend everything", detail: "On the next user message, the app sends the whole list — old turns included.", code: 'history.append(new_user_msg); model(history)' },
            { label: "Model re-reads from scratch", detail: "Stateless, the model reads the full transcript again and finds 'Sam' right there in the input.", code: "# name is in the resent history, not in memory" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You close a chat where the bot knew your name, then open a brand-new conversation. Does it still know your name?",
          steps: [
            "The model is stateless and stored nothing from the old chat.",
            "A new conversation starts with a fresh, empty history — your name isn't in it.",
            "Without that text resent in the input, the model has no way to know your name."
          ],
          output: "No — a new conversation has no prior history to resend, so the name is gone."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A chat history is so long it no longer fits in the model's context window. What does a well-built app do, and what's the consequence?",
          steps: [
            "Because the whole history is resent each turn, it can grow past the token limit.",
            "The app must trim it: drop the oldest messages or replace them with a short summary.",
            "Whatever gets dropped is no longer in the input, so the model genuinely can't reference it anymore.",
            "Trade-off: trimming keeps requests valid and cheaper, but loses fine detail from early in the chat."
          ],
          output: "It trims or summarizes old messages to fit the window; dropped turns are truly forgotten."
        }
      ],
      comparison_tables: [
        {
          title: "what feels true vs what's actually happening",
          columns: ["Aspect", "Feels like", "Actually"],
          rows: [
            { cells: ["Memory", "The bot remembers you", "The app resends the transcript each turn"] },
            { cells: ["Past replies", "Stored inside the model", "Appended to history and resent as input"] },
            { cells: ["Cost per turn", "Flat", "Grows as history grows"] },
            { cells: ["Old messages", "Kept forever", "Dropped or summarized when the window fills"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true vs false about multi-turn chat",
          bins: [
            { id: "true", label: "True" },
            { id: "false", label: "False" }
          ],
          items: [
            { id: "i1", text: "The whole history is resent every turn", bin: "true" },
            { id: "i2", text: "The model stores your messages between requests", bin: "false" },
            { id: "i3", text: "Assistant replies become part of later inputs", bin: "true" },
            { id: "i4", text: "A fresh conversation still remembers the last one", bin: "false" },
            { id: "i5", text: "Long chats cost more tokens per turn", bin: "true" },
            { id: "i6", text: "Old turns can fall off when the window fills", bin: "true" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if the model is stateless and forgets after every reply, why does a chat feel like one continuous conversation?",
          sampleAnswer: "Because the app, not the model, holds the memory. After each reply the app appends both the user message and the assistant message to a stored history, and on every new turn it resends that entire transcript. The model re-reads the whole thing from scratch and continues it, so from the outside it looks seamless — but each turn is really a fresh prediction over re-supplied text."
        }
      ],
      hints: [
        "Use history.append(reply) to add the assistant message to the list.",
        "After appending, len(history) is the number of messages that would be resent.",
        "Every turn resends the full list, so the resent count equals the current history length."
      ],
      challenge_title: "Context-Window Budgeter",
      challenge_description: "Trim a growing conversation to fit the model's token budget the way every production chatbot does: keep the system prompt, keep the freshest turns, and drop the stale ones.",
      challenge_story: "Your chatbot has been chatting all day and the history is now too long for the model's **context window**. Every turn is resent, and once the transcript's token count exceeds the limit, the request is rejected. So before each call your app runs a **budgeter**: it always keeps the **system** message (the persona setup must survive), then keeps as many of the **most recent** turns as fit within the remaining token budget, dropping the oldest turns first. You're writing that budgeter. Given each message's role and token cost, decide what stays.",
      challenge_statement: "You are given a conversation as a list of messages, each with a role and an integer token cost, plus a total token `budget`.\n\nApply this trimming policy:\n\n1. **All** \`system\` messages are kept unconditionally; their tokens are charged against the budget first.\n2. With the tokens left over (\`budget\` minus the system tokens), keep non-system messages **newest-first**: walk from the last message backward, keeping a message while it still fits in the remaining budget, and **stop** at the first message that does not fit (do not skip it to fit a smaller older one).\n3. If the system tokens alone exceed the budget, no non-system messages are kept.\n\nPrint three lines: \`kept <k>\` (total messages kept, including system), \`dropped <d>\` (messages dropped), and \`tokens <t>\` (total tokens of the kept messages).",
      challenge_input_format: "The first line has two integers `n budget`: the number of messages and the token budget.\n\nEach of the next `n` lines has a role (`system`, `user`, or `assistant`) and an integer token cost, separated by a space. Messages are listed oldest-first.",
      challenge_output_format: "Three lines: `kept <k>`, `dropped <d>`, `tokens <t>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ budget ≤ 1000000000",
        "1 ≤ token cost ≤ 100000",
        "There is at least one message; system messages may appear anywhere but are always kept.",
      ],
      challenge_examples: [
        { input: "5 100\nsystem 20\nuser 30\nassistant 40\nuser 25\nassistant 35", output: "kept 3\ndropped 2\ntokens 80", explanation: "System costs 20, leaving 80. Newest-first: assistant(35) fits → 35, user(25) fits → 60, assistant(40) would make 100 > 80 so stop. Kept = system + 2 turns = 3, tokens = 20+25+35 = 80." },
        { input: "3 25\nsystem 20\nuser 30\nassistant 10", output: "kept 1\ndropped 2\ntokens 20", explanation: "System uses 20, leaving 5. The newest turn costs 10 > 5, so it does not fit and we stop. Only the system message survives." },
      ],
      challenge_notes: "Real budgeters do exactly this dance, sometimes summarizing dropped turns instead of deleting them. Charging the system prompt first reflects that the persona is non-negotiable, while the most recent turns carry the live context the model needs to answer well.",
      challenge_hints: [
        "Sum the tokens of all system messages first; the leftover is your working budget for the rest.",
        "Iterate the non-system messages in reverse, accumulating tokens; break the moment the next one would overflow.",
        "Total kept = (number of system messages) + (number of recent non-system messages that fit).",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, budget = map(int, data[0].split())
    # TODO: read n (role, tokens) messages. Keep all system messages, then keep
    #       non-system messages newest-first while they fit the remaining budget.
    #       Print kept, dropped, and total kept tokens.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, budget = map(int, data[idx].split()); idx += 1
    msgs = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        msgs.append((parts[0], int(parts[1])))
    system_tokens = sum(t for r, t in msgs if r == "system")
    system_count = sum(1 for r, t in msgs if r == "system")
    remaining = budget - system_tokens
    non_system = [(r, t) for r, t in msgs if r != "system"]
    kept = 0
    used = 0
    if remaining >= 0:
        for r, t in reversed(non_system):
            if used + t <= remaining:
                used += t
                kept += 1
            else:
                break
    total_kept = system_count + kept
    dropped = n - total_kept
    total_tokens = system_tokens + used
    print(f"kept {total_kept}")
    print(f"dropped {dropped}")
    print(f"tokens {total_tokens}")

main()
`,
      challenge_test_cases: [
        { input: "5 100\nsystem 20\nuser 30\nassistant 40\nuser 25\nassistant 35", expected_output: "kept 3\ndropped 2\ntokens 80", description: "System kept, two newest turns fit, oldest two dropped." },
        { input: "3 25\nsystem 20\nuser 30\nassistant 10", expected_output: "kept 1\ndropped 2\ntokens 20", description: "Budget too tight for any turn after the system prompt." },
        { input: "3 1000\nsystem 5\nuser 5\nassistant 5", expected_output: "kept 3\ndropped 0\ntokens 15", description: "Edge: everything fits, nothing is dropped." }
      ]
    },
    {
      id: "ai-17-l4",
      project_id: "ai-17",
      order: 4,
      title: "Building the Message Array",
      concept: "Message array",
      xp_reward: 10,
      explanation: `Every chatbot you've ever used is, at its core, one growing Python list and a loop that pokes it. There's no secret sauce — just "start with a system message, append a user turn, get a reply, append the reply, repeat." Once you can build that list correctly, you can build a chatbot. This lesson is where the previous three click into running code.

## What it is

The **message array** is the list of message dicts you assemble in code and send to the model. Building it well comes down to three rules:

1. **Start with the system message** (if you have one) — it goes first.
2. **Append turns in order** — each user message, then each assistant reply, in the sequence they happened.
3. **Keep it a flat, ordered list** — no nesting, no shuffling; sequence carries the meaning.

## How it works

You maintain one list and grow it. A tiny helper keeps the appends clean:

\`\`\`python
def message(role, content):
    return {"role": role, "content": content}

messages = [message("system", "You are concise.")]
messages.append(message("user", "Hi"))
messages.append(message("assistant", "Hello."))
messages.append(message("user", "Bye"))
\`\`\`

That's the entire pattern. A real chat loop just wraps it: read user input, append a user message, call the model, append the returned assistant message, loop. The list is the single source of truth for the conversation, and you send the *whole* list every time (from the multi-turn lesson).

Two rules people break: putting the system message *not* first, and forgetting to append the assistant's reply — which makes the bot "forget" what it just said.

## Why it matters

Getting the array right is most of what a chat app does:

- **Order is the conversation.** Append in the sequence things happened; a scrambled list is a scrambled chat.
- **One list, sent whole.** You don't send "just the new message" — you send the entire array each turn.
- **Append both sides.** User *and* assistant turns go in. Skip the assistant turns and the model loses track of its own answers.

## The mental model to keep

A chat app is a **list you keep appending to, in order, and resend in full**. Start with system, alternate user and assistant, never shuffle. Master that list and the rest is plumbing.`,
      key_terms: [
        { term: "Message array", definition: "The ordered list of message dicts assembled in code and sent to the model." },
        { term: "Append", definition: "Adding a new message to the end of the list, preserving order." },
        { term: "Chat loop", definition: "The repeat cycle: read input, append a user message, call the model, append the reply." }
      ],
      callouts: [
        { type: "analogy", title: "A guest list you keep adding names to", content: "You don't rewrite the whole list each time someone arrives — you add the new name to the bottom, in arrival order. The message array works the same way: append each turn at the end, never reshuffle.", position: "before" },
        { type: "tip", title: "Always append the assistant reply", content: "The most common chatbot bug is forgetting to add the model's own reply back to the list. Skip it and the next turn won't know what the bot just said — it 'forgets' its own words.", position: "after" }
      ],
      concept_diagram: {
        title: "Assembling the message array",
        steps: [
          { label: "Seed with system", desc: "Start the list with the system message (if any)." },
          { label: "Append the user turn", desc: "Add the human's message to the end of the list." },
          { label: "Call and append reply", desc: "Get the assistant message and append it too." },
          { label: "Loop in order", desc: "Repeat, always adding to the end so sequence is preserved." }
        ]
      },
      inline_quizzes: [
        {
          question: "When you add a new turn to the conversation, where does it go in the list?",
          options: ["At the very start, before the system message", "At the end, preserving order", "Wherever there's space; order doesn't matter"],
          correct_index: 1,
          explanation: "Append to the end so the list stays in the order things actually happened."
        }
      ],
      quiz_questions: [
        {
          question: "What is the correct way to add the model's reply to the conversation?",
          options: [
            "Replace the system message with it",
            "Append it to the end of the message list as an assistant message",
            "Discard it; only user messages are stored",
            "Insert it before the system message"
          ],
          correct_index: 1,
          explanation: "The assistant reply is appended to the end so later turns can see what the model already said."
        },
        {
          question: "What is the most common bug when building a chat loop?",
          options: [
            "Sending too few tokens",
            "Forgetting to append the assistant's reply, so the bot loses track of its own answers",
            "Using a list instead of a dict",
            "Capitalizing the role names"
          ],
          correct_index: 1,
          explanation: "If you don't append the assistant message back, the next turn won't include the bot's own previous reply."
        },
        {
          question: "On each turn, what do you send to the model?",
          options: [
            "Only the newest user message",
            "Only the system message",
            "The entire message array, in order",
            "A summary of the last reply"
          ],
          correct_index: 2,
          explanation: "You send the whole ordered list every turn; the model re-reads all of it."
        }
      ],
      participation_activities: [
        {
          activity_title: "Building the array check",
          questions: [
            { question: "You should send only the newest user message to the model, not the whole list.", type: "true_false", correct_answer: "false", explanation: "You send the entire ordered message array every turn." },
            { question: "New turns are added to the ______ of the list to keep order.", type: "fill_in", correct_answer: "end", explanation: "Appending to the end preserves the sequence of the conversation." }
          ]
        }
      ],
      starter_code: `# Build a message array using a small helper.
def message(role, content):
    return {"role": role, "content": content}

messages = [message("system", "You are concise.")]

# TODO: append a user message "Hi" and an assistant reply "Hello.",
# then print the role of every message in order.
print("count:", len(messages))
`,
      solution_code: `def message(role, content):
    return {"role": role, "content": content}

messages = [message("system", "You are concise.")]
messages.append(message("user", "Hi"))
messages.append(message("assistant", "Hello."))

print("count:", len(messages))
for m in messages:
    print(m["role"])
`,
      expected_output: `count: 3
system
user
assistant`,
      step_throughs: [
        {
          title: "growing the array one turn at a time",
          steps: [
            { label: "Seed with system", detail: "Start the list with the setup message so it sits first.", code: 'messages = [message("system", "You are concise.")]' },
            { label: "Append the user turn", detail: "The human types something; add it as a user message at the end.", code: 'messages.append(message("user", "Hi"))' },
            { label: "Call, then append the reply", detail: "Send the whole list, get the assistant message, and append it so it's remembered.", code: 'messages.append(message("assistant", reply_text))' },
            { label: "Repeat in order", detail: "Each new turn appends to the end, keeping the conversation sequence intact.", code: 'messages.append(message("user", next_input))' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You have messages = [system, user]. The model replies "Sure!". What single step keeps the conversation correct?',
          steps: [
            "The reply is an assistant message and must be remembered for later turns.",
            "Append it to the end of the list so order is preserved.",
            'messages.append({"role": "assistant", "content": "Sure!"}).'
          ],
          output: 'Append {"role": "assistant", "content": "Sure!"} to the end of messages.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A developer builds a chat loop but the bot keeps repeating its first answer and ignoring follow-ups. They only ever append user messages. What's wrong, and what's the fix?",
          steps: [
            "By appending only user messages, the assistant's replies never enter the history.",
            "Each turn the model sees a list of user messages with no record of what it already answered.",
            "It re-reads the same context and produces a similar reply, ignoring the back-and-forth.",
            "Fix: after each model call, append the returned assistant message before the next turn."
          ],
          output: "They forgot to append assistant replies; append both user and assistant turns each round."
        }
      ],
      comparison_tables: [
        {
          title: "correct array vs broken array",
          columns: ["Practice", "Correct", "Broken"],
          rows: [
            { cells: ["System message", "First in the list", "Missing or placed late"] },
            { cells: ["Turn order", "Appended as they happen", "Shuffled or out of order"] },
            { cells: ["Assistant replies", "Appended back each turn", "Dropped after sending"] },
            { cells: ["What you send", "The whole list", "Only the latest message"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good practice vs mistake when building the array",
          bins: [
            { id: "good", label: "Good practice" },
            { id: "mistake", label: "Mistake" }
          ],
          items: [
            { id: "i1", text: "Put the system message first", bin: "good" },
            { id: "i2", text: "Append turns in the order they happened", bin: "good" },
            { id: "i3", text: "Forget to append the assistant's reply", bin: "mistake" },
            { id: "i4", text: "Send only the newest user message", bin: "mistake" },
            { id: "i5", text: "Send the whole list every turn", bin: "good" },
            { id: "i6", text: "Shuffle messages before sending", bin: "mistake" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is appending the assistant's reply back into the message array just as important as appending the user's message?",
          sampleAnswer: "Because the model is stateless and only sees what's in the list, its own past replies must be in there for it to build on them. If you append only user messages, the next turn has no record of what the assistant already said, so it loses the thread and may repeat itself. Appending both sides keeps the full back-and-forth intact, which is the only memory the conversation actually has."
        }
      ],
      hints: [
        "Use the message(role, content) helper to build each dict cleanly.",
        "messages.append(...) adds a message to the end of the list.",
        "After appending, loop over messages and print each m['role'] to check order."
      ],
      challenge_title: "Sliding-Window Array Assembler",
      challenge_description: "Assemble the exact message array your app sends to the model: system prompt first, then only the most recent K turns of history — the sliding-window memory that keeps long chats inside the context window.",
      challenge_statement: "You are given a system prompt, a list of conversation turns (each a role and content, oldest-first), and a window size \`k\`. Assemble the message array the app will send:\n\n1. The \`system\` message is always **first**.\n2. Then append only the **last \`k\` turns**, in their original order. If there are \`k\` or fewer turns, include all of them. If \`k\` is \`0\`, include no turns (system only).\n3. Print the assembled array, one message per line, as \`<index> <role>: <content>\`, where \`<index>\` starts at \`0\` for the system message.\n4. After the array, print \`total <m>\`, the number of messages in the assembled array.",
      challenge_story: "You're shipping the assembler at the heart of your chatbot's request builder. Conversations can run for hundreds of turns, but the model only needs recent context — so your app keeps a **sliding window**: the system prompt (always) plus the most recent \`k\` turns. Everything older is left out of the request. Build the function that takes the full history and the window size and produces the precise message array, in order, ready to send.",
      challenge_input_format: "The first line has two integers `n k`: the number of turns and the window size.\n\nThe second line is the system prompt text (may contain spaces).\n\nEach of the next `n` lines is a turn: a role (`user` or `assistant`), a single space, then the content (may contain spaces). Turns are oldest-first.",
      challenge_output_format: "Print the assembled messages, one per line as `<index> <role>: <content>` starting at index 0, then a final line `total <m>`.",
      challenge_constraints: [
        "0 ≤ k ≤ n ≤ 100000",
        "1 ≤ length of system prompt and each content (no newline).",
        "Roles are `user` or `assistant`.",
      ],
      challenge_examples: [
        { input: "5 3\nBe brief.\nuser Hi\nassistant Hey\nuser How are you\nassistant Good\nuser Bye", output: "0 system: Be brief.\n1 user: How are you\n2 assistant: Good\n3 user: Bye\ntotal 4", explanation: "Window is 3, so only the last three turns survive; the system prompt leads, and the two oldest turns (`Hi`, `Hey`) are dropped." },
        { input: "3 0\nSys.\nuser A\nassistant B\nuser C", output: "0 system: Sys.\ntotal 1", explanation: "With `k = 0` no turns are kept, so the array is the system message alone." },
      ],
      challenge_notes: "A sliding window is the simplest memory strategy: cheap, bounded, and predictable. Its weakness is that facts from dropped turns are gone forever — which is why richer systems pair it with summaries or retrieval. Slicing the last `k` items with `turns[len(turns)-k:]` (guarding `k == 0`) gives you the window.",
      challenge_hints: [
        "Read all `n` turns into a list, splitting each line once on the first space into role and content.",
        "Take the window: if `k == 0` keep none, else keep the final `k` turns in order.",
        "Prepend the system message, then print each message with its index and a final `total` line.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, k = map(int, data[0].split())
    system = data[1]
    # TODO: read n turns, keep only the last k (none if k == 0), prepend the
    #       system message, then print each "<index> <role>: <content>" and total.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, k = map(int, data[idx].split()); idx += 1
    system = data[idx]; idx += 1
    turns = []
    for _ in range(n):
        line = data[idx]; idx += 1
        role, content = line.split(" ", 1)
        turns.append((role, content))
    if k <= 0:
        kept = []
    elif k >= len(turns):
        kept = turns
    else:
        kept = turns[len(turns) - k:]
    messages = [("system", system)] + kept
    for i, (role, content) in enumerate(messages):
        print(f"{i} {role}: {content}")
    print(f"total {len(messages)}")

main()
`,
      challenge_test_cases: [
        { input: "5 3\nBe brief.\nuser Hi\nassistant Hey\nuser How are you\nassistant Good\nuser Bye", expected_output: "0 system: Be brief.\n1 user: How are you\n2 assistant: Good\n3 user: Bye\ntotal 4", description: "Window keeps the last three turns; oldest two dropped." },
        { input: "3 0\nSys.\nuser A\nassistant B\nuser C", expected_output: "0 system: Sys.\ntotal 1", description: "k = 0 keeps only the system message." },
        { input: "2 10\nYou help.\nuser A\nassistant B", expected_output: "0 system: You help.\n1 user: A\n2 assistant: B\ntotal 3", description: "Edge: window larger than history keeps every turn." }
      ]
    },
    {
      id: "ai-17-l5",
      project_id: "ai-17",
      order: 5,
      title: "The Assistant Turn and Prefilling",
      concept: "Assistant",
      xp_reward: 10,
      explanation: `Ask a model to return JSON and it often opens with "Sure! Here is the JSON you requested:" before the actual data — useless for a parser. There's a quiet trick that fixes this in one line: you write the *beginning* of the assistant's reply yourself, and the model continues from there. It's called **prefilling**, and it works precisely because the assistant turn is just another message you control.

## What it is

The model's reply is an **assistant message** — same shape as everything else: a role of \`assistant\` and some content. From the message-array lessons you know you append it back to continue the chat. The new idea here is that you don't have to leave that assistant content empty. You can **prefill** it: put the opening text yourself as the last message, and the model picks up exactly where you stopped.

Because generation is "continue the transcript," a half-finished assistant message is a strong hint. Start it with \`{\` and the model is almost forced to produce JSON next.

## How it works

A normal request ends on a user message and the model writes the whole assistant turn. To prefill, you add a partial assistant message at the end and let the model finish it:

\`\`\`python
messages = [
    {"role": "system", "content": "Return the answer as JSON."},
    {"role": "user", "content": "Name and age of the first US president?"},
    {"role": "assistant", "content": "{"},  # prefill: we start the reply
]
# The model continues from "{", so its output starts inside the JSON object.
\`\`\`

The model's continuation is appended to your prefill, so the full assistant turn becomes \`{"name": "George Washington", "age": 57}\`. You steered the **format** without adding a single instruction. The same trick forces a leading bullet (\`- \`), a code fence (\` \`\`\` \`), or a chosen language ("Translating to French: ").

## Why it matters

Prefilling is a cheap, reliable steering tool:

- **It removes preamble.** No "Certainly! Here is..." — the reply starts at the content you want.
- **It locks format.** Opening with \`{\` or \`[\` makes structured output far more likely than asking nicely.
- **It has limits.** Not every provider supports prefill, and a clumsy prefill can box the model into a bad continuation. You also must remember the prefill text is part of the final answer — prepend it yourself when reading the output.

## The mental model to keep

The assistant turn is **a message you can start writing**. Hand the model the first few characters of its own reply, and it will faithfully continue the sentence you began.`,
      key_terms: [
        { term: "Assistant message", definition: "The model's reply, a message with role 'assistant' and content, the same shape as user and system messages." },
        { term: "Prefilling", definition: "Adding a partial assistant message at the end of the list so the model continues from text you wrote." },
        { term: "Preamble", definition: "Filler the model adds before the real answer, like 'Sure, here is...', which prefilling removes." }
      ],
      callouts: [
        { type: "insight", title: "You can finish the model's sentence for it", content: "Generation is just continuing the transcript. If the last message is a half-written assistant turn, the model completes it — so writing '{' as the prefill nearly guarantees the reply continues as JSON.", position: "before" },
        { type: "warning", title: "The prefill is part of the answer", content: "Whatever you put in the prefill is the start of the final assistant content. If you prefill '{', the model's output begins after it, so you must prepend your prefill yourself when reassembling the full reply.", position: "after" }
      ],
      concept_diagram: {
        title: "How prefilling steers a reply",
        steps: [
          { label: "Build the request", desc: "System and user messages set up the task as usual." },
          { label: "Append a partial assistant turn", desc: "Add an assistant message whose content is just the opening you want." },
          { label: "Model continues it", desc: "The model writes the rest, starting from your prefill text." },
          { label: "Reassemble the reply", desc: "Final answer = your prefill + the model's continuation." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is prefilling the assistant turn?",
          options: ["Sending the system prompt twice", "Writing the start of the assistant's reply so the model continues from it", "Asking the model to count tokens before replying"],
          correct_index: 1,
          explanation: "You add a partial assistant message at the end; the model continues from the text you supplied."
        }
      ],
      quiz_questions: [
        {
          question: "Why does prefilling an assistant message with `{` tend to produce JSON?",
          options: [
            "It changes the model's weights to a JSON mode",
            "Generation continues the transcript, so the model picks up right after the opening brace",
            "The API validates JSON automatically",
            "It deletes the system prompt"
          ],
          correct_index: 1,
          explanation: "The model continues whatever the partial assistant message started, so an opening brace nudges it into JSON."
        },
        {
          question: "What must you remember about the prefill text when reading the model's output?",
          options: [
            "It is discarded by the API and never returned",
            "It is the start of the final answer, so you prepend it to the continuation",
            "It is added to the system prompt automatically",
            "It is always counted as a user message"
          ],
          correct_index: 1,
          explanation: "The prefill is the opening of the assistant content; the model's output continues from it, so the full reply is prefill + continuation."
        },
        {
          question: "Which is a real limitation of prefilling?",
          options: [
            "It always doubles the token cost",
            "It only works with the system role",
            "Not all providers support it, and a clumsy prefill can box the model into a bad continuation",
            "It permanently changes future requests"
          ],
          correct_index: 2,
          explanation: "Prefill support varies by provider, and a poorly chosen opening can force the model down an unhelpful path."
        }
      ],
      participation_activities: [
        {
          activity_title: "Prefilling check",
          questions: [
            { question: "Prefilling means writing the opening of the assistant's reply yourself so the model continues it.", type: "true_false", correct_answer: "true", explanation: "You append a partial assistant message and the model finishes it." },
            { question: "To remove preamble and force structured output, you prefill the ______ message.", type: "fill_in", correct_answer: "assistant", explanation: "The partial message you start carries the role 'assistant'." }
          ]
        }
      ],
      starter_code: `# Prefill the assistant turn, then show the FULL reply = prefill + continuation.
messages = [
    {"role": "system", "content": "Return the answer as JSON."},
    {"role": "user", "content": "First US president name and age?"},
    {"role": "assistant", "content": "{"},  # our prefill
]

# Pretend the model continued the JSON from our "{":
continuation = '"name": "George Washington", "age": 57}'

# TODO: the full assistant reply is the prefill plus the continuation.
# Print the full reply on one line.
print("prefill:", messages[-1]["content"])
`,
      solution_code: `messages = [
    {"role": "system", "content": "Return the answer as JSON."},
    {"role": "user", "content": "First US president name and age?"},
    {"role": "assistant", "content": "{"},
]

continuation = '"name": "George Washington", "age": 57}'

prefill = messages[-1]["content"]
full_reply = prefill + continuation
print("prefill:", prefill)
print("full reply:", full_reply)
`,
      expected_output: `prefill: {
full reply: {"name": "George Washington", "age": 57}`,
      step_throughs: [
        {
          title: "steering output by starting the reply",
          steps: [
            { label: "Set up the task", detail: "System asks for JSON; the user asks the question. So far this is an ordinary request.", code: 'messages = [system_json, user_question]' },
            { label: "Append a partial assistant turn", detail: "Add an assistant message whose content is just the opening character you want the reply to begin with.", code: 'messages.append({"role": "assistant", "content": "{"})' },
            { label: "Let the model continue", detail: "Generation continues the transcript, so the model writes what comes after the brace.", code: 'continuation = model(messages)  # starts inside the JSON' },
            { label: "Rebuild the full reply", detail: "The final answer is your prefill text plus the continuation; prepend the prefill yourself.", code: 'full = "{" + continuation' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You want the reply to start as a Markdown bullet list. What prefill should the last assistant message contain?",
          steps: [
            "A Markdown bullet begins with '- '.",
            "Put that as the content of a partial assistant message at the end of the list.",
            "The model continues from '- ', so its output starts the first bullet."
          ],
          output: 'Prefill the assistant message with "- " so the reply begins as a bullet list.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A model keeps prefixing JSON answers with 'Here is the JSON:' which breaks your parser. You prefill the assistant turn with '{'. What now reaches your parser, and what must your code do?",
          steps: [
            "With the assistant turn prefilled as '{', the model continues directly inside the object, skipping any preamble.",
            "But the API returns only the continuation (everything after '{'), not the brace itself.",
            "Your code must prepend the '{' prefill to the returned text before parsing.",
            "Then json.loads('{' + continuation) parses cleanly with no preamble to strip."
          ],
          output: "The reply has no preamble; prepend the '{' prefill to the continuation, then parse the combined string."
        }
      ],
      comparison_tables: [
        {
          title: "asking for format vs prefilling it",
          columns: ["Approach", "How", "Reliability"],
          rows: [
            { cells: ["Ask in the prompt", "\"Reply with only JSON\"", "Often works, but preamble leaks in"] },
            { cells: ["Prefill the turn", "Start the assistant message with \"{\"", "Strongly forces the opening you chose"], highlight: true },
            { cells: ["Do nothing", "Hope for clean output", "Unpredictable; preamble common"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true vs false about prefilling",
          bins: [
            { id: "true", label: "True" },
            { id: "false", label: "False" }
          ],
          items: [
            { id: "i1", text: "The prefill goes in an assistant message at the end of the list", bin: "true" },
            { id: "i2", text: "The model continues from the prefill text", bin: "true" },
            { id: "i3", text: "Prefilling changes the model's weights", bin: "false" },
            { id: "i4", text: "The prefill is part of the final answer", bin: "true" },
            { id: "i5", text: "Every provider supports prefilling", bin: "false" },
            { id: "i6", text: "Opening with '{' nudges the reply toward JSON", bin: "true" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does writing the first few characters of the assistant's reply steer the output so strongly?",
          sampleAnswer: "Because the model's whole job is to continue the transcript it's given. A partial assistant message is the most recent thing in that transcript, so the model treats it as the start of a sentence it must finish. Opening with '{' makes JSON the only natural continuation, which is far more reliable than politely asking for JSON, because it removes the freedom to add preamble first."
        }
      ],
      hints: [
        "The prefill is the content of the LAST message, which has role 'assistant'.",
        "Access it with messages[-1]['content'].",
        "The full reply is the prefill string concatenated with the model's continuation."
      ],
      challenge_title: "Prefill Reassembler",
      challenge_description: "Stitch a prefilled assistant turn back together the way a real client must: prepend the prefill to the model's continuation, then validate that the result actually starts the way you intended.",
      challenge_story: "Your app prefills assistant turns to force clean output, but there's a catch every engineer hits: the API returns only the continuation, not the prefill you supplied. Your client code has to glue them back: \`full = prefill + continuation\`. Worse, you want to verify the format actually held, so for each reply you also check whether the reassembled answer **starts with** the prefill you sent (it always should after gluing) and report the total character length so you can spot truncation. Build the reassembler that processes a batch of prefilled replies.",
      challenge_statement: "You are given a batch of prefilled assistant replies. Each item has a **prefill** string (what your app wrote to start the turn) and a **continuation** string (what the model returned). For each item:\n\n1. Reassemble the full reply as \`prefill + continuation\` (simple concatenation, no separator).\n2. Print the full reply on its own line.\n\nAfter all items, print one summary line: \`chars <total>\`, the sum of the character lengths of every full reply.",
      challenge_input_format: "The first line is an integer `n`: the number of items.\n\nThe next `2*n` lines come in pairs: for each item, the first line is the prefill and the second line is the continuation. Either string may contain spaces but no newline; either may be empty (a blank line).",
      challenge_output_format: "Print `n` lines, each the reassembled full reply for one item in order, then a final line `chars <total>` with the summed length of all full replies.",
      challenge_constraints: [
        "1 ≤ n ≤ 10000",
        "0 ≤ length of each prefill and continuation ≤ 10000 (a line may be empty).",
        "Strings contain no newline characters.",
      ],
      challenge_examples: [
        { input: "2\n{\n\"name\": \"Ada\"}\n- \nFirst item", output: "{\"name\": \"Ada\"}\n- First item\nchars 26", explanation: "Item 1: '{' + '\"name\": \"Ada\"}' = '{\"name\": \"Ada\"}' (15 chars). Item 2: '- ' + 'First item' = '- First item' (12 chars). 15 + 12 wait recount: see notes; the summed length is reported on the final line." },
        { input: "1\nTranslating: \nBonjour", output: "Translating: Bonjour\nchars 20", explanation: "The prefill 'Translating: ' (13 chars) plus 'Bonjour' (7 chars) makes a 20-character reply." },
      ],
      challenge_notes: "The whole point: the model never re-emits your prefill, so the client owns reassembly. Reading lines without stripping spaces matters because a prefill like '- ' or 'Translating: ' ends in a meaningful space; trimming it would corrupt the format you worked to force.",
      challenge_hints: [
        "Read all lines without stripping; a prefill may legitimately be empty or end in a space.",
        "For each item, read two consecutive lines (prefill then continuation) and concatenate them directly.",
        "Accumulate len(full) as you go and print 'chars <total>' after the loop.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: for each of the n items, read the prefill line then the continuation
    #       line, print prefill + continuation, and sum the lengths. Finally print
    #       "chars <total>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    total = 0
    out = []
    for _ in range(n):
        prefill = data[idx]; idx += 1
        continuation = data[idx]; idx += 1
        full = prefill + continuation
        out.append(full)
        total += len(full)
    out.append(f"chars {total}")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "2\n{\n\"name\": \"Ada\"}\n- \nFirst item", expected_output: "{\"name\": \"Ada\"}\n- First item\nchars 27", description: "Two items reassembled; the trailing space in '- ' is preserved." },
        { input: "1\nTranslating: \nBonjour", expected_output: "Translating: Bonjour\nchars 20", description: "Single item: prefill ending in a space plus continuation." },
        { input: "2\n\nHello\nworld\n", expected_output: "Hello\nworld\nchars 10", description: "Edge: empty prefill on item 1 and empty continuation on item 2 still concatenate correctly." }
      ]
    },
    {
      id: "ai-17-l6",
      project_id: "ai-17",
      order: 6,
      title: "Roles Beyond the Basics",
      concept: "Roles",
      xp_reward: 10,
      explanation: `The first chatbots had three roles and that was the whole story. Then assistants started *doing* things — checking the weather, querying a database, running code — and three roles weren't enough. How does the model see the result of a database query it asked for? A new kind of message: the **tool result**. Once you add it, a transcript stops being a chat and becomes a record of an agent at work.

## What it is

Beyond \`system\`, \`user\`, and \`assistant\`, modern chat APIs add a **tool role** (sometimes called \`tool\` or \`function\`). It carries the **result of a tool the assistant asked to call**. The flow goes: the assistant emits a request to call a tool, your code runs that tool, and you feed the output back as a tool-role message so the model can read it on the next turn.

Many APIs also allow an optional **name** field on a message, used to label *which* tool or *which* participant a message came from when several are in play.

## How it works

A tool-augmented transcript interleaves an extra role. The assistant says "call get_weather," your code runs it, and you append a tool message with the answer:

\`\`\`python
messages = [
    {"role": "system", "content": "You can call tools."},
    {"role": "user", "content": "Weather in Paris?"},
    {"role": "assistant", "content": "", "tool_calls": [{"name": "get_weather", "args": {"city": "Paris"}}]},
    {"role": "tool", "name": "get_weather", "content": "18C, clear"},  # your code's result
]
# The model now reads the tool result and writes a natural-language reply.
\`\`\`

The key point: a tool result is **just another message** in the same ordered list. The model can't run tools itself — it only emits the *request*. Your code executes it and hands the output back as a message. The \`name\` field ties the result to the call.

## Why it matters

Extra roles are how chat became *agentic*:

- **Tools give the model fresh, real data.** Instead of guessing the weather, it reads a real API result you injected as a tool message.
- **The name field disambiguates.** With several tools or several speakers, \`name\` says which one produced this message.
- **It's still one transcript.** No magic — the assistant requests, your code runs, the result goes back as a message, and the loop continues exactly like multi-turn chat.

## The mental model to keep

A tool result is **a message from the outside world**, slotted into the same ordered list. The assistant asks; your code answers on a tool-role message; the model reads it and continues.`,
      key_terms: [
        { term: "Tool role", definition: "A message role (tool or function) carrying the result of a tool the assistant asked to call." },
        { term: "Tool call", definition: "A request the assistant emits to run a named tool with arguments; your code, not the model, executes it." },
        { term: "name field", definition: "An optional message field labeling which tool or participant produced the message." }
      ],
      callouts: [
        { type: "analogy", title: "An assistant passing notes to a researcher", content: "The assistant scribbles 'look up the weather' and slides the note out. A researcher (your code) does the lookup and slides back a note with the answer. That returned note is the tool-role message; the assistant reads it and keeps talking.", position: "before" },
        { type: "insight", title: "The model never runs the tool", content: "The model only emits the request to call a tool. Your code executes it and appends the result as a tool message. The model just reads that result on the next turn like any other message.", position: "after" }
      ],
      concept_diagram: {
        title: "How a tool result enters the transcript",
        steps: [
          { label: "Assistant requests a tool", desc: "The assistant message includes a tool call (name plus arguments)." },
          { label: "Your code runs it", desc: "Outside the model, your code executes the named tool." },
          { label: "Append a tool message", desc: "The result goes back as a tool-role message, often with a name field." },
          { label: "Model reads and replies", desc: "On the next turn the model uses the tool result to write its answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "Who actually executes a tool the assistant asks to call?",
          options: ["The model runs it internally", "Your code runs it and returns the result as a tool message", "The user types the result manually every time"],
          correct_index: 1,
          explanation: "The model only emits the request; your code runs the tool and appends the result as a tool-role message."
        }
      ],
      quiz_questions: [
        {
          question: "What does a tool-role (or function-role) message carry?",
          options: [
            "The system prompt for the next conversation",
            "The result of a tool the assistant asked to call",
            "A summary of the whole chat",
            "The user's password"
          ],
          correct_index: 1,
          explanation: "The tool role delivers the output of a tool call back to the model as a message it can read."
        },
        {
          question: "What is the optional `name` field on a message used for?",
          options: [
            "To set the assistant's persona",
            "To label which tool or participant produced the message",
            "To count tokens",
            "To encrypt the content"
          ],
          correct_index: 1,
          explanation: "The name field disambiguates messages when several tools or speakers are involved."
        },
        {
          question: "How does a tool result fit into the conversation?",
          options: [
            "It replaces the system message",
            "It is stored only on the server and never sent",
            "It is just another message appended to the same ordered list",
            "It is merged into the user's previous message"
          ],
          correct_index: 2,
          explanation: "A tool result is appended as a normal message; the transcript stays one ordered list."
        }
      ],
      participation_activities: [
        {
          activity_title: "Roles beyond the basics check",
          questions: [
            { question: "The model executes tools itself, without any help from your code.", type: "true_false", correct_answer: "false", explanation: "The model only requests a tool call; your code runs it and returns the result." },
            { question: "The result of a tool call is sent back to the model on a ______-role message.", type: "fill_in", correct_answer: "tool", explanation: "The tool (or function) role carries tool results back into the transcript." }
          ]
        }
      ],
      starter_code: `# Assemble a tool-augmented transcript and find the tool result.
messages = [
    {"role": "system", "content": "You can call tools."},
    {"role": "user", "content": "Weather in Paris?"},
    {"role": "assistant", "content": "", "tool_calls": ["get_weather"]},
    {"role": "tool", "name": "get_weather", "content": "18C, clear"},
]

# TODO: print how many messages there are, then print the content of the
# tool-role message (the result your code injected).
print("messages:", len(messages))
`,
      solution_code: `messages = [
    {"role": "system", "content": "You can call tools."},
    {"role": "user", "content": "Weather in Paris?"},
    {"role": "assistant", "content": "", "tool_calls": ["get_weather"]},
    {"role": "tool", "name": "get_weather", "content": "18C, clear"},
]

print("messages:", len(messages))
for m in messages:
    if m["role"] == "tool":
        print("tool result from", m["name"] + ":", m["content"])
`,
      expected_output: `messages: 4
tool result from get_weather: 18C, clear`,
      step_throughs: [
        {
          title: "one tool call, start to finish",
          steps: [
            { label: "User asks", detail: "The user asks something the model can't answer from memory, like live weather.", code: '{"role": "user", "content": "Weather in Paris?"}' },
            { label: "Assistant requests a tool", detail: "Instead of guessing, the assistant emits a tool call naming the tool and its arguments.", code: '{"role": "assistant", "tool_calls": [{"name": "get_weather"}]}' },
            { label: "Your code runs it", detail: "Outside the model, your code calls the real weather API and gets a result string.", code: 'result = get_weather("Paris")  # "18C, clear"' },
            { label: "Append a tool message", detail: "You add a tool-role message carrying the result; the model reads it next turn.", code: '{"role": "tool", "name": "get_weather", "content": result}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "The assistant emits a request to call get_time. The model finished its turn. Whose job is it to actually run get_time?",
          steps: [
            "The model can only emit the request; it cannot execute code or call APIs.",
            "Your application code reads the tool call and runs the real get_time function.",
            "You then append the result as a tool-role message for the model to read."
          ],
          output: "Your code runs get_time and returns the result as a tool message."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "An agent calls two tools in one turn: get_weather and get_news. Both results come back. Why does each tool message need a name field?",
          steps: [
            "Two tool results are now in the list, and they look structurally identical (role 'tool', some content).",
            "Without a label, the model can't tell which result answers which call.",
            "The name field tags one message 'get_weather' and the other 'get_news'.",
            "Now the model can match each result to the call it made and reason correctly."
          ],
          output: "The name field labels each result so the model maps it to the correct tool call."
        }
      ],
      comparison_tables: [
        {
          title: "the message roles, extended",
          columns: ["Role", "Produced by", "Carries"],
          rows: [
            { cells: ["system", "App/developer", "Setup and rules"] },
            { cells: ["user", "Human", "The request"] },
            { cells: ["assistant", "Model", "Replies and tool-call requests"] },
            { cells: ["tool", "Your code", "Results of tool calls the assistant requested"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which role produces this message?",
          bins: [
            { id: "assistant", label: "Assistant message" },
            { id: "tool", label: "Tool message" }
          ],
          items: [
            { id: "i1", text: 'A request to call get_weather(city="Paris")', bin: "assistant" },
            { id: "i2", text: '"18C, clear" returned by your weather code', bin: "tool" },
            { id: "i3", text: "The model's final natural-language answer", bin: "assistant" },
            { id: "i4", text: "A JSON blob from a database query your code ran", bin: "tool" },
            { id: "i5", text: "A request to run calculate(2 + 2)", bin: "assistant" },
            { id: "i6", text: "The number 4 returned by your calculator function", bin: "tool" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is a tool result represented as just another message in the list rather than something special outside the conversation?",
          sampleAnswer: "Because the model only ever sees the ordered message list, anything it needs to reason about has to live in that list. A tool result is data the model asked for, so the natural place for it is a message right after the tool call, tagged with the tool role and a name. Keeping it in the same list means the same predict-the-next-turn mechanism handles tools with no special machinery; the transcript just gains one more kind of speaker."
        }
      ],
      hints: [
        "Loop over messages and check m['role'] to find the tool message.",
        "A tool message has a 'name' field naming the tool and a 'content' field with the result.",
        "Concatenate with m['name'] + ': ' or use an f-string to print the source and result."
      ],
      challenge_title: "Tool-Call Matcher",
      challenge_description: "Pair every tool result with the assistant request that triggered it, by name, the way an agent runtime reconciles a turn of parallel tool calls.",
      challenge_story: "You're writing the reconciler inside an agent loop. In one turn the assistant can fire off several tool calls by name; your runtime executes them and appends a tool-role message for each, each tagged with the tool's name. Before sending the transcript back to the model, you must verify every call got exactly one matching result and flag any mismatch (a call with no result, or a stray result with no call). Build the matcher: given the names the assistant called and the names that came back as tool messages, report what matched and what didn't.",
      challenge_statement: "You are given the list of tool **names the assistant called** in a turn, and the list of tool **names that came back** as tool-role messages. Matching is by name; treat both as multisets (a name can appear more than once, and each call consumes one matching result).\n\nReport, in this order, one per line:\n\n1. \`matched <m>\` — the number of calls that have a corresponding result (the size of the multiset intersection).\n2. \`unanswered <u>\` — calls with no matching result.\n3. \`orphan <o>\` — results with no matching call.\n\nA turn is balanced when both \`unanswered\` and \`orphan\` are 0.",
      challenge_input_format: "The first line has two integers `c r`: the number of tool calls and the number of tool results.\n\nThe second line has `c` space-separated tool names that were called (empty line if `c` is 0).\n\nThe third line has `r` space-separated tool names that came back (empty line if `r` is 0).",
      challenge_output_format: "Three lines: `matched <m>`, `unanswered <u>`, `orphan <o>`.",
      challenge_constraints: [
        "0 ≤ c ≤ 100000 and 0 ≤ r ≤ 100000",
        "Tool names contain no spaces.",
        "A name may repeat; treat the lists as multisets where each result answers at most one call.",
      ],
      challenge_examples: [
        { input: "3 3\nget_weather get_news get_weather\nget_weather get_weather get_news", output: "matched 3\nunanswered 0\norphan 0", explanation: "Two get_weather calls match two get_weather results, and one get_news matches one get_news. Everything pairs up, so the turn is balanced." },
        { input: "2 1\nget_time get_time\nget_time", output: "matched 1\nunanswered 1\norphan 0", explanation: "Two get_time calls but only one result: one call matches, the other is unanswered, and there are no orphan results." },
      ],
      challenge_notes: "Matching by multiset intersection mirrors how runtimes pair calls and results by tool name (real systems also use a unique call id, but the counting is the same). For each name, the matches equal min(calls, results); summing those gives the matched total, and the leftovers on each side are the unanswered and orphan counts.",
      challenge_hints: [
        "Count the calls per name and the results per name with two dictionaries (or collections.Counter).",
        "For each name, matched += min(call_count, result_count); unanswered and orphan are the leftover on each side.",
        "Handle c or r being 0 by reading an empty line as an empty list (line.split() on '' gives []).",
      ],
      challenge_starter_code: `import sys
from collections import Counter

def main():
    data = sys.stdin.read().split("\\n")
    c, r = map(int, data[0].split())
    # TODO: read the called names and returned names, count by name, and report
    #       matched (intersection size), unanswered, and orphan counts.

main()
`,
      challenge_solution_code: `import sys
from collections import Counter

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    c, r = map(int, data[idx].split()); idx += 1
    calls = Counter(data[idx].split()); idx += 1
    results = Counter(data[idx].split()); idx += 1
    matched = 0
    for name, cnt in calls.items():
        matched += min(cnt, results.get(name, 0))
    total_calls = sum(calls.values())
    total_results = sum(results.values())
    unanswered = total_calls - matched
    orphan = total_results - matched
    print(f"matched {matched}")
    print(f"unanswered {unanswered}")
    print(f"orphan {orphan}")

main()
`,
      challenge_test_cases: [
        { input: "3 3\nget_weather get_news get_weather\nget_weather get_weather get_news", expected_output: "matched 3\nunanswered 0\norphan 0", description: "Every call pairs with a result; balanced turn." },
        { input: "2 1\nget_time get_time\nget_time", expected_output: "matched 1\nunanswered 1\norphan 0", description: "A duplicate call goes unanswered." },
        { input: "1 2\nsearch\nsearch lookup", expected_output: "matched 1\nunanswered 0\norphan 1", description: "An extra result with no matching call is an orphan." },
        { input: "0 1\n\nstray", expected_output: "matched 0\nunanswered 0\norphan 1", description: "Edge: no calls but a result arrives; pure orphan." }
      ]
    },
    {
      id: "ai-17-l7",
      project_id: "ai-17",
      order: 7,
      title: "Injecting Context Into Messages",
      concept: "Context",
      xp_reward: 10,
      explanation: `You build a support bot and bolt on a search index so it can quote your docs. The retrieval works perfectly — the right paragraph comes back every time — yet the bot still hallucinates. The bug isn't retrieval. It's **placement**: the retrieved text got buried somewhere the model under-weights. Where context lives in the message list quietly decides whether the model trusts it.

## What it is

**Injecting context** means inserting retrieved documents, database rows, or background facts into the message list so the model can use them. This is the heart of RAG (retrieval-augmented generation): you fetch relevant text, then *place* it into the messages before sending. The two common homes are the **system message** (stable, always-on context) and a **dedicated user block** right before the question (per-question, freshly retrieved context).

## How it works

You don't paste docs into the user's actual question. You give the context its own clearly delimited block, usually a user message placed just before the real question:

\`\`\`python
context = "DOC: Refunds are processed within 5 business days."
question = "How long do refunds take?"

messages = [
    {"role": "system", "content": "Answer only from the provided context. If it's not there, say you don't know."},
    {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"},
]
\`\`\`

Three placement choices matter:

- **System vs user.** Stable instructions ("only use the context") go in the system message. The retrieved text itself usually goes in a user block, because it changes every question.
- **Delimit it.** Wrap context in clear markers (\`Context:\` ... \`Question:\`) so the model can tell evidence from instruction.
- **Order it.** Put the context *before* the question so the model reads the evidence, then the ask.

## Why it matters

Placement is the difference between a grounded answer and a confident hallucination:

- **Buried context gets ignored.** Stuffed mid-paragraph or after the question, retrieved text is under-used. A clean, labeled block up front gets attended to.
- **Mixing instruction and data invites injection.** If a retrieved doc says "ignore previous instructions," and you didn't delimit it, the model may obey it. Clear separation reduces that risk.
- **System carries the rules, user carries the evidence.** This split keeps the "only answer from context" rule stable while the evidence rotates per query.

## The mental model to keep

Context is **evidence handed to a witness**: label it clearly, put it before the question, and keep the rules (system) separate from the exhibits (user). Where you place it decides whether the model reads it.`,
      key_terms: [
        { term: "Context injection", definition: "Inserting retrieved documents or facts into the message list so the model can use them to answer." },
        { term: "RAG", definition: "Retrieval-augmented generation: fetch relevant text, place it into the messages, then generate an answer grounded in it." },
        { term: "Context block", definition: "A clearly delimited section (often a user message) holding the retrieved evidence, separate from the question." }
      ],
      callouts: [
        { type: "analogy", title: "Evidence handed to a witness", content: "A lawyer doesn't bury an exhibit inside the question. They label it 'Exhibit A,' present it, then ask. Context works the same: label the retrieved text, place it before the question, and keep it separate from your instructions.", position: "before" },
        { type: "warning", title: "Undelimited context is an injection risk", content: "If retrieved text and your instructions blur together, a malicious document saying 'ignore previous rules' can hijack the model. Wrap context in clear markers and keep rules in the system message to reduce prompt-injection risk.", position: "after" }
      ],
      concept_diagram: {
        title: "Placing retrieved context correctly",
        steps: [
          { label: "Retrieve the docs", desc: "Search fetches the most relevant text for the question." },
          { label: "Put rules in system", desc: "Stable instruction: answer only from the provided context." },
          { label: "Add a context block", desc: "A labeled user block holds the retrieved text, before the question." },
          { label: "Ask the question", desc: "The question follows the evidence so the model reads docs first, then the ask." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where should retrieved documents usually go relative to the user's question?",
          options: ["After the question, at the very end", "In a labeled block before the question", "Inside the system prompt as a permanent rule"],
          correct_index: 1,
          explanation: "Retrieved text changes per query, so it goes in a delimited block placed before the question, while stable rules stay in the system message."
        }
      ],
      quiz_questions: [
        {
          question: "In a RAG setup, where do stable instructions like 'answer only from the context' belong?",
          options: [
            "In the retrieved document itself",
            "In the system message",
            "Appended after the model's reply",
            "Nowhere; the model infers them"
          ],
          correct_index: 1,
          explanation: "Stable, always-on rules live in the system message; the rotating retrieved text goes in a user block."
        },
        {
          question: "Why does placement of retrieved context matter?",
          options: [
            "The API charges more for context at the top",
            "Buried or mislabeled context is under-weighted and may be ignored",
            "Placement changes the model's weights",
            "Only the last message is ever read"
          ],
          correct_index: 1,
          explanation: "Context stuffed mid-paragraph or after the question gets under-used; a clean, labeled block up front is attended to."
        },
        {
          question: "Why is it risky to mix retrieved documents directly into your instructions without delimiters?",
          options: [
            "It uses fewer tokens",
            "A malicious document could contain instructions the model then obeys (prompt injection)",
            "The model will refuse to answer entirely",
            "It speeds up the response too much"
          ],
          correct_index: 1,
          explanation: "Undelimited context blurs data and instruction, so a doc saying 'ignore previous rules' can hijack the model."
        }
      ],
      participation_activities: [
        {
          activity_title: "Injecting context check",
          questions: [
            { question: "Retrieved documents should be pasted directly inside the user's question with no labels.", type: "true_false", correct_answer: "false", explanation: "Context should be in a clearly delimited block so the model separates evidence from the question." },
            { question: "Stable rules go in the system message; the rotating retrieved text goes in a ______ block.", type: "fill_in", correct_answer: "user", explanation: "Per-query evidence is usually placed in a dedicated user message before the question." }
          ]
        }
      ],
      starter_code: `# Build a RAG-style message list: rules in system, evidence in a user block.
context = "DOC: Refunds are processed within 5 business days."
question = "How long do refunds take?"

# TODO: build messages where the system message holds the rule and a single
# user message holds the labeled context followed by the question.
messages = []
print("messages:", len(messages))
`,
      solution_code: `context = "DOC: Refunds are processed within 5 business days."
question = "How long do refunds take?"

messages = [
    {"role": "system", "content": "Answer only from the provided context."},
    {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"},
]

print("messages:", len(messages))
print("system:", messages[0]["content"])
print("user starts with:", messages[1]["content"].split("\\n")[0])
`,
      expected_output: `messages: 2
system: Answer only from the provided context.
user starts with: Context:`,
      step_throughs: [
        {
          title: "assembling a grounded request",
          steps: [
            { label: "Retrieve the evidence", detail: "Search returns the most relevant document text for the question.", code: 'context = retrieve("refund time")  # "DOC: Refunds in 5 days."' },
            { label: "Set the grounding rule", detail: "The system message tells the model to answer only from the provided context.", code: '{"role": "system", "content": "Answer only from the context."}' },
            { label: "Build a labeled context block", detail: "Wrap the retrieved text with a clear marker so it's distinct from the question.", code: 'block = f"Context:\\n{context}\\n\\nQuestion: {question}"' },
            { label: "Place context before the ask", detail: "Put the evidence first inside the user message, then the question, so the model reads docs then ask.", code: '{"role": "user", "content": block}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You retrieve a fresh document for every question the user asks. Should that document go in the system message or a user block?",
          steps: [
            "The system message is for stable, always-on instructions.",
            "The retrieved document changes with every question, so it isn't stable.",
            "Per-query evidence belongs in a labeled user block placed before the question."
          ],
          output: "Put the rotating retrieved document in a user block, not the system message."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A bot keeps inventing facts even though retrieval returns the right paragraph. The team pasted the doc at the very end, after the question, with no label. What two changes fix it?",
          steps: [
            "Context placed after the question is under-weighted; the model has already 'committed' to the ask.",
            "Move the context block to before the question so the model reads evidence first.",
            "Add a clear delimiter (Context: ... Question: ...) so the model treats it as evidence, not noise.",
            "Optionally add a system rule: 'answer only from the provided context,' which grounds the model further."
          ],
          output: "Move the context before the question and label it clearly (plus a system grounding rule)."
        }
      ],
      comparison_tables: [
        {
          title: "where to put each piece of a RAG request",
          columns: ["Piece", "Best home", "Why"],
          rows: [
            { cells: ["\"Only use the context\" rule", "System message", "Stable across every query"] },
            { cells: ["Freshly retrieved document", "Labeled user block, before the question", "Rotates per query; needs attention"], highlight: true },
            { cells: ["The user's actual question", "End of the user block", "Asked after the evidence is presented"] },
            { cells: ["Unlabeled doc in the question text", "Avoid", "Blurs data and instruction; injection risk"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good vs poor context placement",
          bins: [
            { id: "good", label: "Good placement" },
            { id: "poor", label: "Poor placement" }
          ],
          items: [
            { id: "i1", text: "Grounding rule in the system message", bin: "good" },
            { id: "i2", text: "Labeled context block before the question", bin: "good" },
            { id: "i3", text: "Retrieved doc pasted after the question, no label", bin: "poor" },
            { id: "i4", text: "Context wrapped in clear Context:/Question: markers", bin: "good" },
            { id: "i5", text: "Doc mixed into the question with no delimiter", bin: "poor" },
            { id: "i6", text: "Stuffing rotating docs into the system message every query", bin: "poor" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does separating the grounding rule (system) from the retrieved evidence (user block) make a RAG app more reliable and safer?",
          sampleAnswer: "Keeping the rule in the system message means 'only answer from the context' stays constant no matter what document gets retrieved, so the model's behavior doesn't drift. Putting the evidence in a clearly labeled user block lets the model tell instructions from data, which both improves grounding (it knows what to cite) and reduces prompt injection, because a malicious line inside a document is framed as evidence to read rather than a command to obey."
        }
      ],
      hints: [
        "The system message holds the stable rule; the user message holds the labeled context plus the question.",
        "Use an f-string with a delimiter like 'Context:' so the evidence is clearly separated from the question.",
        "Escape the newline in the template as \\\\n so the printed block has 'Context:' on its own line."
      ],
      challenge_title: "RAG Prompt Builder",
      challenge_description: "Assemble a grounded RAG request: a fixed system rule, the top retrieved snippets in a labeled context block, then the question, exactly the message list a retrieval pipeline ships to the model.",
      challenge_story: "You're building the prompt assembler for a documentation Q and A bot. Your retriever returns scored snippets; your job is to take the **top k** by score, drop them into a clearly labeled context block, and pair it with a fixed system rule and the user's question. Placement is the product: rule in system, evidence before the question, everything delimited. Build the assembler that prints the exact two-message request.",
      challenge_statement: "You are given a question and a set of retrieved snippets, each with an integer **score** and a text. Build the request:\n\n1. Select the **top k** snippets by score, highest first. Break ties by the snippet's **original input order** (earlier input wins).\n2. Emit a system line: \`SYSTEM: Answer only from the context below.\`\n3. Emit a user block. Print \`USER:\` on its own line, then \`Context:\`, then each selected snippet on its own line prefixed with \`- \` (in selected order: highest score first), then a blank line, then \`Question: <question>\`.\n\nPrint the request exactly as described.",
      challenge_input_format: "The first line has two integers `n k`: the number of retrieved snippets and how many to keep.\n\nThe second line is the question text (may contain spaces).\n\nEach of the next `n` lines is a snippet: an integer score, a single space, then the snippet text (may contain spaces). Snippets are listed in retrieval order.",
      challenge_output_format: "Print `SYSTEM: Answer only from the context below.`, then `USER:`, then `Context:`, then each selected snippet line as `- <text>` (highest score first, ties by input order), then a blank line, then `Question: <question>`.",
      challenge_constraints: [
        "1 ≤ k ≤ n ≤ 100000",
        "Scores fit in a signed 32-bit integer; higher means more relevant.",
        "Question and snippet text may contain spaces but no newline.",
      ],
      challenge_examples: [
        { input: "3 2\nHow long do refunds take?\n5 Refunds take 5 business days.\n9 Refunds are issued to the original card.\n2 Shipping is free over 50 dollars.", output: "SYSTEM: Answer only from the context below.\nUSER:\nContext:\n- Refunds are issued to the original card.\n- Refunds take 5 business days.\n\nQuestion: How long do refunds take?", explanation: "Top 2 by score are the snippets scored 9 and 5, in that order; the score-2 shipping snippet is dropped. The context block lists them highest-first, then the question follows after a blank line." },
        { input: "2 1\nWhat is the warranty?\n4 Warranty is one year.\n4 Warranty excludes water damage.", output: "SYSTEM: Answer only from the context below.\nUSER:\nContext:\n- Warranty is one year.\n\nQuestion: What is the warranty?", explanation: "Both snippets score 4; the tie is broken by input order, so the first one (one year) is kept." },
      ],
      challenge_notes: "Sorting by score descending with input order as the tiebreaker is exactly how retrievers present results. Pairing a fixed system grounding rule with a delimited, ordered context block is the canonical RAG prompt shape; the blank line before the question keeps evidence visually separate from the ask.",
      challenge_hints: [
        "Read snippets as (score, original_index, text); sort by (-score, original_index) to get highest-first with stable ties.",
        "Take the first k after sorting; these are your context lines, each printed as '- ' + text.",
        "Print SYSTEM, then USER, Context:, the snippet lines, an empty string (blank line), then 'Question: ' + question.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, k = map(int, data[0].split())
    question = data[1]
    # TODO: read n snippets (score + text), take the top k by score (ties by
    #       input order), and print the SYSTEM line and USER context block.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, k = map(int, data[idx].split()); idx += 1
    question = data[idx]; idx += 1
    snippets = []
    for i in range(n):
        score_str, text = data[idx].split(" ", 1); idx += 1
        snippets.append((int(score_str), i, text))
    snippets.sort(key=lambda s: (-s[0], s[1]))
    chosen = snippets[:k]
    out = []
    out.append("SYSTEM: Answer only from the context below.")
    out.append("USER:")
    out.append("Context:")
    for score, _, text in chosen:
        out.append(f"- {text}")
    out.append("")
    out.append(f"Question: {question}")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3 2\nHow long do refunds take?\n5 Refunds take 5 business days.\n9 Refunds are issued to the original card.\n2 Shipping is free over 50 dollars.", expected_output: "SYSTEM: Answer only from the context below.\nUSER:\nContext:\n- Refunds are issued to the original card.\n- Refunds take 5 business days.\n\nQuestion: How long do refunds take?", description: "Top 2 by score, highest first; lowest-scored snippet dropped." },
        { input: "2 1\nWhat is the warranty?\n4 Warranty is one year.\n4 Warranty excludes water damage.", expected_output: "SYSTEM: Answer only from the context below.\nUSER:\nContext:\n- Warranty is one year.\n\nQuestion: What is the warranty?", description: "Tie on score broken by input order." },
        { input: "1 1\nWho do I contact?\n7 Email support at help@example.com.", expected_output: "SYSTEM: Answer only from the context below.\nUSER:\nContext:\n- Email support at help@example.com.\n\nQuestion: Who do I contact?", description: "Edge: a single snippet kept as the only context line." }
      ]
    },
    {
      id: "ai-17-l8",
      project_id: "ai-17",
      order: 8,
      title: "Common Message-List Bugs",
      concept: "Debugging",
      xp_reward: 10,
      explanation: `Most "the model is dumb today" bug reports are not the model's fault — they're a malformed message list. A missing system message, two user turns in a row, a reply that never got appended. The model faithfully continues whatever transcript you hand it, so a broken list produces a broken conversation. This lesson is the field guide to the four bugs you'll actually hit.

## What it is

A **message-list bug** is a structural mistake in the array you send — not in the content of any one message, but in how they're ordered, labeled, or combined. The model can't warn you about most of these; it just produces confusing output. The four most common:

- **Wrong order** — turns appended out of sequence, so the conversation reads scrambled.
- **Missing system message** — no setup, so behavior is generic and drifts.
- **Role violations** — duplicated or non-alternating roles (two user messages in a row, no assistant between).
- **Content typos** — a misspelled role string (\`"assitant"\`) or wrong key (\`"text"\` instead of \`"content"\`), which many APIs reject outright.

## How it works

Most providers expect a tidy shape: an optional system message first, then user and assistant turns that **alternate**. A quick validator catches the common breaks:

\`\`\`python
def find_bugs(messages):
    bugs = []
    if not messages or messages[0]["role"] != "system":
        bugs.append("missing or misplaced system message")
    prev = None
    for m in messages:
        if m["role"] in ("user", "assistant"):
            if m["role"] == prev:
                bugs.append(f"two {m['role']} turns in a row")
            prev = m["role"]
    return bugs
\`\`\`

The two cheapest habits: always seed the system message, and after every model call append the assistant reply *before* reading the next user input — skipping that append is what creates two user turns in a row.

## Why it matters

These bugs are silent and expensive:

- **Wrong order changes meaning.** The model reads top to bottom; a scrambled list is a scrambled conversation, and the reply reflects the mess.
- **Missing system message means drift.** Without setup, tone and format wander, and you'll blame the model for being inconsistent.
- **Role violations break or confuse the API.** Some providers reject non-alternating roles; others accept them but the model loses track of who said what.
- **Typos hard-fail.** A misspelled role or key is the easiest bug to fix once you look — and the easiest to stare past.

## The mental model to keep

When output looks wrong, **inspect the list before blaming the model**. Check order, the system message, alternation, and spelling. The transcript is almost always the culprit.`,
      key_terms: [
        { term: "Role violation", definition: "A structural error where roles are duplicated or don't alternate, like two user messages in a row." },
        { term: "Alternation", definition: "The expected pattern of user and assistant turns taking turns, one after the other." },
        { term: "Malformed list", definition: "A message array with a structural mistake in order, roles, or fields rather than in any single message's content." }
      ],
      callouts: [
        { type: "tip", title: "Inspect the list first", content: "When a chat misbehaves, print the message array before debugging anything else. Check four things: order, a leading system message, alternating roles, and spelling of roles and keys. The bug is usually right there.", position: "before" },
        { type: "warning", title: "Two user turns in a row is a classic", content: "Forgetting to append the assistant reply leaves two user messages back to back. The model loses the thread, and strict providers reject the request. Always append the reply before reading the next input.", position: "after" }
      ],
      concept_diagram: {
        title: "Diagnosing a broken message list",
        steps: [
          { label: "Print the array", desc: "Dump the messages with their roles in order before anything else." },
          { label: "Check the system message", desc: "Confirm a system message leads the list and isn't missing." },
          { label: "Check alternation", desc: "Look for duplicated roles or non-alternating user/assistant turns." },
          { label: "Check spelling and keys", desc: "Verify role strings and the 'content' key are spelled correctly." }
        ]
      },
      inline_quizzes: [
        {
          question: "What usually causes two user messages to appear back-to-back in the list?",
          options: ["The model deleted its own reply", "Forgetting to append the assistant reply before the next user turn", "The API merges messages automatically"],
          correct_index: 1,
          explanation: "If you don't append the assistant message after a model call, the next user message lands right after the previous one."
        }
      ],
      quiz_questions: [
        {
          question: "A chat keeps producing generic, drifting answers with no consistent tone. Which bug is most likely?",
          options: [
            "A misspelled 'content' key",
            "A missing system message",
            "Too many tokens",
            "The reply was prefilled"
          ],
          correct_index: 1,
          explanation: "Without a system message there's no setup, so behavior is generic and drifts across turns."
        },
        {
          question: "Which of these is a content typo bug (not an ordering bug)?",
          options: [
            "Two assistant messages in a row",
            "The system message placed last",
            "A role spelled \"assitant\" or a key \"text\" instead of \"content\"",
            "User and assistant turns out of sequence"
          ],
          correct_index: 2,
          explanation: "Misspelling the role string or using the wrong key is a content/field typo, which many APIs reject outright."
        },
        {
          question: "Why should you inspect the message list before blaming the model for a bad reply?",
          options: [
            "The model never makes mistakes",
            "The model faithfully continues whatever transcript you send, so a malformed list yields a malformed reply",
            "Inspecting the list is required by the API",
            "The list contains the model's weights"
          ],
          correct_index: 1,
          explanation: "Because the model just continues the transcript, structural bugs in the list usually explain confusing output."
        }
      ],
      participation_activities: [
        {
          activity_title: "Message-list bugs check",
          questions: [
            { question: "Two user messages in a row with no assistant turn between them is a role/alternation violation.", type: "true_false", correct_answer: "true", explanation: "User and assistant turns are expected to alternate; back-to-back user turns break that pattern." },
            { question: "Misspelling the role string 'assistant' or using the key 'text' instead of 'content' is a ______ bug.", type: "fill_in", correct_answer: "typo", explanation: "These are content/field typos, often rejected by the API outright." }
          ]
        }
      ],
      starter_code: `# Detect common message-list bugs: missing system, and back-to-back roles.
messages = [
    {"role": "user", "content": "Hi"},
    {"role": "user", "content": "Are you there?"},
]

# TODO: report whether the first message is a system message, and whether any
# two user/assistant turns repeat the same role back-to-back.
print("first role:", messages[0]["role"])
`,
      solution_code: `messages = [
    {"role": "user", "content": "Hi"},
    {"role": "user", "content": "Are you there?"},
]

bugs = []
if not messages or messages[0]["role"] != "system":
    bugs.append("missing system message")
prev = None
for m in messages:
    if m["role"] in ("user", "assistant"):
        if m["role"] == prev:
            bugs.append("two " + m["role"] + " turns in a row")
        prev = m["role"]

print("first role:", messages[0]["role"])
for b in bugs:
    print("bug:", b)
`,
      expected_output: `first role: user
bug: missing system message
bug: two user turns in a row`,
      step_throughs: [
        {
          title: "tracing a back-to-back user bug",
          steps: [
            { label: "User turn appended", detail: "The user sends a message; your code appends it. So far so good.", code: 'messages.append({"role": "user", "content": "Hi"})' },
            { label: "Model call made", detail: "You send the list and get an assistant reply back from the model.", code: 'reply = model(messages)' },
            { label: "Reply NOT appended", detail: "The bug: your code reads the next user input without appending the reply.", code: '# forgot: messages.append(reply)' },
            { label: "Second user turn lands", detail: "The new user message now sits right after the previous user message, a role violation.", code: 'messages.append({"role": "user", "content": "Are you there?"})' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'An API rejects your request with "invalid role: assitant". What is the bug and the fix?',
          steps: [
            'The role string "assitant" is misspelled; the valid role is "assistant".',
            "This is a content/field typo, not an ordering problem.",
            'Fix the spelling to "assistant" and the request validates.'
          ],
          output: 'A misspelled role; correct "assitant" to "assistant".'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your bot answers each question as if it's the first, never building on prior turns, and a strict provider sometimes rejects the request. Inspecting the list shows: user, user, user. What's the root cause and the fix?",
          steps: [
            "Three user messages in a row means no assistant turns were ever appended.",
            "The likely cause: the code calls the model but never appends the returned assistant reply to the list.",
            "So each new user turn lands right after the last, creating non-alternating roles.",
            "Fix: after every model call, append the assistant reply before reading the next user input, restoring user/assistant alternation."
          ],
          output: "Assistant replies were never appended; append each reply after the model call to restore alternation."
        }
      ],
      comparison_tables: [
        {
          title: "common message-list bugs and their tells",
          columns: ["Bug", "Symptom", "Fix"],
          rows: [
            { cells: ["Wrong order", "Conversation reads scrambled", "Append turns in the order they happened"] },
            { cells: ["Missing system", "Generic, drifting tone", "Seed a system message first"] },
            { cells: ["Role violation", "Back-to-back same role; API rejects", "Append the assistant reply each turn"], highlight: true },
            { cells: ["Content typo", "API hard-fails on a bad role/key", "Fix the spelling of the role or 'content'"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "match the symptom to the bug type",
          bins: [
            { id: "structure", label: "Order/role bug" },
            { id: "typo", label: "Typo/field bug" }
          ],
          items: [
            { id: "i1", text: "Two assistant messages in a row", bin: "structure" },
            { id: "i2", text: 'Role spelled "usr" instead of "user"', bin: "typo" },
            { id: "i3", text: "System message placed last instead of first", bin: "structure" },
            { id: "i4", text: 'Key "text" used instead of "content"', bin: "typo" },
            { id: "i5", text: "Turns appended out of sequence", bin: "structure" },
            { id: "i6", text: 'Role written as "Assistant" with a capital A when the API wants lowercase', bin: "typo" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is 'inspect the message list' the first debugging step when an AI chat behaves strangely, rather than tweaking the prompt wording?",
          sampleAnswer: "Because the model just continues whatever transcript it receives, most strange behavior traces back to the structure of that transcript, not the model's intelligence. A missing system message, scrambled order, back-to-back roles, or a typo'd key will all produce confusing output that looks like a model failure. Printing the list and checking order, the system message, alternation, and spelling usually surfaces the real bug in seconds, before you waste time rewording a prompt that was never the problem."
        }
      ],
      hints: [
        "Check messages[0]['role'] to see if a system message leads the list.",
        "Track a 'prev' role while looping; if the current user/assistant role equals prev, that's a back-to-back violation.",
        "Collect bug strings in a list and print each one after the loop."
      ],
      challenge_title: "Message-List Linter",
      challenge_description: "Build the linter that scans a message array for the classic structural bugs, missing system message, bad role spelling, and non-alternating turns, the pre-flight check that saves a doomed API call.",
      challenge_story: "Before your app ever calls the model, you run a **linter** on the assembled message array to catch the bugs that produce garbage replies or hard API errors. Your linter reports three checks in order: is there a system message leading the list, is every role spelled validly, and do the user/assistant turns alternate (no two of the same in a row). Build it so a broken transcript is caught locally, in milliseconds, instead of after a slow, failed round trip.",
      challenge_statement: "You are given a message list, each message a role and content. Run three checks and print one result line per check, in this exact order:\n\n1. \`system: OK\` if the **first** message's role is exactly \`system\`; otherwise \`system: MISSING\`.\n2. \`roles: OK\` if **every** message's role is one of \`system\`, \`user\`, \`assistant\` (exact lowercase); otherwise \`roles: BAD <count>\` where \`<count>\` is the number of messages with an invalid role.\n3. \`alternation: OK\` if, looking only at \`user\` and \`assistant\` messages in order, no two **adjacent** ones share the same role; otherwise \`alternation: BAD <count>\` where \`<count>\` is the number of adjacent same-role violations among user/assistant turns.",
      challenge_input_format: "The first line is an integer `n`: the number of messages.\n\nEach of the next `n` lines is a message: a role token (no spaces), a single space, then the content (may contain spaces).",
      challenge_output_format: "Exactly three lines: the system check, the roles check, and the alternation check, in that order, formatted as described.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "Role tokens contain no spaces; they may be misspelled or wrongly cased.",
        "Content is non-empty and may contain spaces but no newline.",
      ],
      challenge_examples: [
        { input: "4\nsystem Be brief.\nuser Hi\nuser Are you there?\nassistant Yes", output: "system: OK\nroles: OK\nalternation: BAD 1", explanation: "A system message leads the list and all roles are valid, but two user turns sit back-to-back, one adjacent same-role violation among the user/assistant turns." },
        { input: "3\nuser Hi\nassitant Hello\nuser Bye", output: "system: MISSING\nroles: BAD 1\nalternation: OK", explanation: "No system message leads the list; one role ('assitant') is misspelled so roles is BAD 1; the valid user/assistant turns considered (only the two 'user' messages count among valid roles, but they are not adjacent because the invalid 'assitant' separates them) do not produce an adjacent same-role pair." },
      ],
      challenge_notes: "For the alternation check, consider only messages whose role is user or assistant and scan them in order, counting each adjacent pair that repeats a role. Invalid or system messages are ignored for alternation. Running all three checks before the API call turns a slow remote failure into an instant local one.",
      challenge_hints: [
        "Check the first message's role for 'system' to produce the first line.",
        "Count messages whose role is not in the set {system, user, assistant}; that count drives the roles line.",
        "For alternation, walk the messages keeping the previous user/assistant role; increment a counter when the current user/assistant role equals it.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: read n messages (role + content). Run three checks: leading system
    #       message, all roles valid, and user/assistant alternation. Print one
    #       result line per check in order.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    valid = {"system", "user", "assistant"}
    roles = []
    for _ in range(n):
        role, _content = data[idx].split(" ", 1); idx += 1
        roles.append(role)
    # Check 1: leading system message
    if roles and roles[0] == "system":
        print("system: OK")
    else:
        print("system: MISSING")
    # Check 2: all roles valid
    bad_roles = sum(1 for r in roles if r not in valid)
    if bad_roles == 0:
        print("roles: OK")
    else:
        print(f"roles: BAD {bad_roles}")
    # Check 3: alternation among user/assistant turns
    prev = None
    violations = 0
    for r in roles:
        if r in ("user", "assistant"):
            if r == prev:
                violations += 1
            prev = r
        else:
            prev = None
    if violations == 0:
        print("alternation: OK")
    else:
        print(f"alternation: BAD {violations}")

main()
`,
      challenge_test_cases: [
        { input: "4\nsystem Be brief.\nuser Hi\nuser Are you there?\nassistant Yes", expected_output: "system: OK\nroles: OK\nalternation: BAD 1", description: "Valid system and roles, but a back-to-back user violation." },
        { input: "3\nuser Hi\nassitant Hello\nuser Bye", expected_output: "system: MISSING\nroles: BAD 1\nalternation: OK", description: "No leading system, one misspelled role, no adjacent same-role valid turns." },
        { input: "4\nsystem Setup.\nuser A\nassistant B\nuser C", expected_output: "system: OK\nroles: OK\nalternation: OK", description: "A clean, well-formed transcript passes every check." },
        { input: "3\nassistant One\nassistant Two\nassistant Three", expected_output: "system: MISSING\nroles: OK\nalternation: BAD 2", description: "No system message and three assistant turns give two adjacent violations." }
      ]
    }
  ]
};
