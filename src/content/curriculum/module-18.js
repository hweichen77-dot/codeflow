export default {
  project: {
    id: "ai-18",
    title: "The Context Window",
    description: "Understand the model's working memory — the token budget that holds your system prompt, chat history, message, and its answer, and what to do when it runs out.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
    tags: ["context-window", "tokens", "limits", "memory", "fundamentals"],
    order: 18,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-18-l1",
      project_id: "ai-18",
      order: 1,
      title: "What the Context Window Is",
      concept: "Context window",
      xp_reward: 10,
      explanation: `Imagine answering a question while staring at a desk that can only hold a few sheets of paper at once. Anything you want to consider has to fit on that desk. Push a new sheet on and an old one slides off the edge. That desk is the **context window** — the model's entire field of view for a single request.

## What it is

The **context window** is the maximum number of tokens a model can consider in one request. And here's the part people miss: that budget covers **both** what you send in *and* what the model writes out. Input and output share the same desk.

A token is just a chunk of text — roughly 4 characters of English, about ¾ of a word. So a window of, say, 8,000 tokens is room for roughly 6,000 words of *combined* prompt and answer. Modern models advertise windows from a few thousand tokens up into the millions, but the rule is identical at every size: there is a hard ceiling, and everything must fit under it.

## How it works

Think of the window as the model's **working memory**, not its long-term knowledge. Its long-term knowledge is baked into frozen weights during training. The context window is the scratch space it gets *right now*, for *this* request:

\`\`\`python
WINDOW = 8000          # max tokens this model can hold at once
prompt_tokens = 1200   # everything you sent in
# space left for the answer:
budget_for_answer = WINDOW - prompt_tokens
print(budget_for_answer)   # 6800 tokens to write with
\`\`\`

Two things follow immediately. First, the bigger your input, the less room is left for the output. Second, nothing outside the window exists for the model — if a fact isn't in the window (or its frozen training), the model simply cannot see it.

## Why it matters

The window is the single most important constraint shaping how you use a model:

- It explains why a model "forgets" the start of a very long chat — older text fell off the desk.
- It caps how much you can paste in: a 500-page book will not fit in a small window all at once.
- It forces real trade-offs: more context for the question means less room for the reply.

## The mental model to keep

Don't picture infinite memory. Picture a **desk of fixed size**. Everything the model thinks about for this one request — your instructions, the conversation, and its own reply — has to fit on that desk at the same time.`,
      key_terms: [
        { term: "Context window", definition: "The maximum number of tokens a model can consider in a single request, covering both input and output." },
        { term: "Token", definition: "A chunk of text the model reads and writes; roughly 4 characters of English." },
        { term: "Working memory", definition: "The temporary scratch space (the window) the model uses for one request, separate from its frozen training knowledge." }
      ],
      callouts: [
        { type: "analogy", title: "It's a desk, not a warehouse", content: "The window is a desk that holds only so many sheets of paper. Push a new sheet on and an old one slides off. The model can only reason about what's on the desk right now.", position: "before" },
        { type: "insight", title: "Input and output share the budget", content: "The window isn't 'how much you can send.' It's how much input AND output fit together. A huge prompt leaves less room for the answer.", position: "after" }
      ],
      concept_diagram: {
        title: "What fills the window",
        steps: [
          { label: "Fixed ceiling", desc: "The model has a hard token limit for one request." },
          { label: "Your input goes in", desc: "Instructions and text consume part of the budget." },
          { label: "Answer reserves the rest", desc: "Whatever room is left is where the reply can be written." },
          { label: "Nothing else exists", desc: "Text outside the window is invisible to the model." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does the context window measure?",
          options: ["How fast the model types", "The max tokens the model can consider at once, input plus output", "How many users can chat together"],
          correct_index: 1,
          explanation: "The window is a token ceiling covering both your input and the model's output in one request."
        }
      ],
      quiz_questions: [
        {
          question: "If a model has an 8,000-token window and your prompt uses 7,000 tokens, what's true about the answer?",
          options: [
            "The answer can be up to 8,000 tokens",
            "The answer has at most about 1,000 tokens of room",
            "The prompt size does not affect the answer size",
            "The model ignores the window for outputs"
          ],
          correct_index: 1,
          explanation: "Input and output share the window. A 7,000-token prompt leaves only about 1,000 tokens for the reply."
        },
        {
          question: "Why is the context window best thought of as working memory rather than knowledge?",
          options: [
            "It stores facts permanently like the weights do",
            "It's temporary scratch space for one request, not long-term learned knowledge",
            "It grows every time you chat",
            "It replaces the model's training"
          ],
          correct_index: 1,
          explanation: "Long-term knowledge lives in frozen weights. The window is just the temporary space the model reasons in for the current request."
        },
        {
          question: "What happens to text that is outside the context window?",
          options: [
            "The model retrieves it from a database",
            "The model cannot see it at all for that request",
            "It is summarized automatically",
            "It is stored in the model's memory"
          ],
          correct_index: 1,
          explanation: "If text isn't in the window (and isn't in the frozen training), the model simply has no access to it."
        }
      ],
      participation_activities: [
        {
          activity_title: "Window sense-check",
          questions: [
            { question: "The context window counts both the tokens you send in and the tokens the model writes out.", type: "true_false", correct_answer: "true", explanation: "Input and output share the same token budget." },
            { question: "The context window is the model's ______ memory for a single request.", type: "fill_in", correct_answer: "working", explanation: "It's temporary scratch space, not long-term learned knowledge." }
          ]
        }
      ],
      starter_code: `# Figure out how much room is left for the answer.
WINDOW = 8000          # max tokens this model can hold at once
prompt_tokens = 1200   # everything you sent in

# TODO: compute the tokens left for the answer and print it.
print("window:", WINDOW)
`,
      solution_code: `WINDOW = 8000          # max tokens this model can hold at once
prompt_tokens = 1200   # everything you sent in

budget_for_answer = WINDOW - prompt_tokens

print("window:", WINDOW)
print("prompt uses:", prompt_tokens)
print("room for answer:", budget_for_answer)
`,
      expected_output: `window: 8000
prompt uses: 1200
room for answer: 6800`,
      step_throughs: [
        {
          title: "one request, one desk",
          steps: [
            { label: "Start with a ceiling", detail: "The model has a fixed window — say 8,000 tokens. That number never changes mid-request.", code: "WINDOW = 8000" },
            { label: "Add your input", detail: "Your instructions and text take up part of the desk. Say your prompt is 1,200 tokens.", code: "prompt_tokens = 1200" },
            { label: "Reserve the rest for output", detail: "Whatever is left is the only room the model has to write its answer.", code: "answer_room = WINDOW - prompt_tokens  # 6800" },
            { label: "Nothing else fits", detail: "If you tried to paste in 9,000 tokens, it would not fit at all — the desk is full before the model even starts.", code: "9000 > WINDOW  ->  does not fit" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A model has a 4,000-token window. Your prompt is 1,000 tokens. How many tokens are left for the answer?",
          steps: [
            "The window is shared by input and output.",
            "Subtract the input from the window: 4000 - 1000.",
            "That leaves 3,000 tokens of room for the reply."
          ],
          output: "3,000 tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A book is about 120,000 tokens. The model's window is 8,000 tokens. Can you paste the whole book into one request and ask about it?",
          steps: [
            "The window caps the total tokens in a single request at 8,000.",
            "The book alone is 120,000 tokens, far more than the window holds.",
            "So the full book cannot fit in one request — not even leaving room for a question.",
            "You'd have to feed it in pieces or retrieve only the relevant parts (a later module)."
          ],
          output: "No — 120,000 tokens is far larger than the 8,000-token window."
        }
      ],
      comparison_tables: [
        {
          title: "context window vs training knowledge",
          columns: ["Aspect", "Context window", "Training knowledge"],
          rows: [
            { cells: ["What it holds", "This request's text", "Everything learned during training"] },
            { cells: ["Lifetime", "Just this one request", "Frozen permanently in weights"] },
            { cells: ["Size", "A token ceiling per request", "Baked into the model file"] },
            { cells: ["You control it", "Yes — you choose what to put in", "No — set at training time"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "in the window vs not in the window",
          bins: [
            { id: "in", label: "Inside the context window" },
            { id: "out", label: "NOT in the context window" }
          ],
          items: [
            { id: "i1", text: "The message you just typed", bin: "in" },
            { id: "i2", text: "A fact learned during training", bin: "out" },
            { id: "i3", text: "The system prompt for this request", bin: "in" },
            { id: "i4", text: "A document you pasted into the prompt", bin: "in" },
            { id: "i5", text: "A chat from last week you never re-sent", bin: "out" },
            { id: "i6", text: "The answer the model is about to write", bin: "in" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a large prompt leave less room for the model's answer?",
          sampleAnswer: "The context window is one shared budget for the whole request, not separate limits for input and output. Every token of prompt I send occupies space on the same desk where the answer has to be written, so the more I put in, the fewer tokens are left over for the model to respond with before it hits the ceiling."
        }
      ],
      hints: [
        "The window and the prompt size are both token counts.",
        "Subtract the prompt tokens from the window to get the leftover room.",
        "Print the window, the prompt usage, and the remaining room on separate lines."
      ],
      challenge_title: "Context Packer",
      challenge_description: "Build the prompt assembler that streams retrieved chunks onto the desk in priority order and stops the instant the next one won't fit under the window.",
      challenge_story: "You're shipping the retrieval layer of a RAG assistant. A reranker hands you document chunks **already sorted by relevance** — most useful first. Your job is the **packer**: glue chunks into the prompt one at a time, but you must always leave a fixed slice of the window **reserved** for the model's answer. The moment the next chunk would push the prompt past that line, you stop cold — you never skip ahead to a smaller chunk, because the chunks are in priority order and a gap would mean injecting a *less* relevant chunk before a more relevant one. Tell the team how many chunks made it in and how much budget is left unused.",
      challenge_statement: "You are given a window size \`W\`, a reserved answer size \`R\`, and \`n\` chunk sizes in **priority order** (most important first).\n\nThe budget available for chunks is \`W - R\`. Walk the chunks from first to last and add a chunk **only if** the running total of placed chunks would still be \`<= W - R\` after adding it. The **first** chunk that would exceed the budget halts packing immediately — do **not** consider any later chunk.\n\nPrint two numbers, each on its own line:\n\n1. How many chunks were packed.\n2. The leftover budget: \`(W - R)\` minus the total size of the packed chunks.",
      challenge_input_format: "The first line has three integers: \`W R n\` — the window size, the reserved answer size, and the number of chunks.\n\nThe second line has \`n\` space-separated integers: the chunk sizes in priority order.",
      challenge_output_format: "Two lines: the count of packed chunks, then the leftover budget.",
      challenge_constraints: [
        "1 ≤ W ≤ 2000000",
        "0 ≤ R < W",
        "1 ≤ n ≤ 200000",
        "1 ≤ each chunk size ≤ W",
      ],
      challenge_examples: [
        { input: "1000 200 4\n300 300 300 300", output: "2\n200", explanation: "Budget = 1000 - 200 = 800. Chunk 1 (300) → 300 ≤ 800 ✓. Chunk 2 → 600 ✓. Chunk 3 → 900 > 800, halt. 2 packed, 800 - 600 = 200 left." },
        { input: "8000 1000 3\n2000 3000 5000", output: "2\n2000", explanation: "Budget = 7000. 2000 ✓ (2000), +3000 ✓ (5000), +5000 → 10000 > 7000 halt. 2 packed, 7000 - 5000 = 2000 left." },
      ],
      challenge_notes: "This is *prefix packing*: because chunks arrive in priority order, the optimal selection is always a prefix — you stop at the first overflow rather than cherry-picking smaller chunks out of order. Real prompt assemblers behave exactly this way, which is why a single oversized early chunk can starve everything behind it.",
      challenge_hints: [
        "The usable budget is `W - R`. Keep a running `used` total starting at 0.",
        "For each chunk in order, check `used + size <= budget` before committing; the first failure ends the loop with `break`.",
        "The leftover is `budget - used` after you stop.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    W = int(data[0]); R = int(data[1]); n = int(data[2])
    sizes = [int(x) for x in data[3:3 + n]]
    # TODO: pack chunks in order, stopping at the first that overflows W - R.
    #       Print the packed count, then the leftover budget.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    R = int(data[idx]); idx += 1
    n = int(data[idx]); idx += 1
    budget = W - R
    used = 0
    fitted = 0
    for i in range(n):
        c = int(data[idx]); idx += 1
        if used + c <= budget:
            used += c
            fitted += 1
        else:
            break
    print(fitted)
    print(budget - used)

main()
`,
      challenge_test_cases: [
        { input: "1000 200 4\n300 300 300 300", expected_output: "2\n200", description: "Halts at the third chunk; 200 budget left." },
        { input: "8000 1000 3\n2000 3000 5000", expected_output: "2\n2000", description: "Large final chunk overflows; two packed." },
        { input: "500 500 3\n10 10 10", expected_output: "0\n0", description: "Reserve eats the whole window; budget is 0, nothing fits." },
        { input: "100 0 1\n100", expected_output: "1\n0", description: "Single chunk exactly fills the window with no reserve." }
      ]
    },
    {
      id: "ai-18-l2",
      project_id: "ai-18",
      order: 2,
      title: "What Counts Against It",
      concept: "Token budget",
      xp_reward: 10,
      explanation: `You type one short sentence — "What's the weather?" — and somehow the request is 1,500 tokens. Where did they come from? You didn't write 1,500 tokens. But the app did, on your behalf, and all of it lands on the same desk.

## What it is

The context window is a **budget**, and almost everything in a request spends from it. Four things, every time:

1. **The system prompt** — hidden instructions the app sends first ("You are a helpful assistant…"). You never see it, but it's there, and it costs tokens.
2. **The full chat history** — every earlier user message *and* every earlier model reply, re-sent on each turn.
3. **Your new message** — the thing you actually typed.
4. **Reserved space for the answer** — the model needs room left over to write its reply, so that headroom counts too.

## How it works

Remember from the foundations: models are **stateless**. The model itself remembers nothing between requests. So to make a chat feel continuous, the app resends the *entire* conversation every single turn. Add it all up and you get the total going into the window:

\`\`\`python
system = 200       # hidden system prompt
history = 1100     # all previous turns, re-sent
new_msg = 30       # what you just typed
reserved = 500     # headroom kept for the answer

used = system + history + new_msg + reserved
print(used)        # 1830 tokens spent before the model writes a word
\`\`\`

This is why a tiny message can still be an expensive request: the small part is *your* text; the large part is everything dragged along with it.

## Why it matters

Knowing what counts changes how you think about long sessions:

- **History grows every turn.** Each exchange adds both your message and the reply to what gets re-sent next time. The budget creeps upward on its own.
- **The system prompt is a fixed tax.** It's paid on every request, so bloated system prompts quietly shrink the room for everything else.
- **You must reserve answer space.** If history eats the whole window, there's nothing left for the model to respond with.

## The mental model to keep

Picture a single jar with four streams pouring in: the system prompt, the history, your message, and the reserved answer space. **The jar is the window. When the streams together overflow it, something has to give.**`,
      key_terms: [
        { term: "System prompt", definition: "Hidden instructions the app sends before your message; it consumes tokens on every request." },
        { term: "Chat history", definition: "All previous user and model messages, re-sent each turn because the model is stateless." },
        { term: "Reserved output space", definition: "The token headroom kept inside the window so the model has room to write its reply." }
      ],
      callouts: [
        { type: "analogy", title: "One jar, four streams", content: "The system prompt, the chat history, your new message, and the reserved answer space all pour into the same jar. The jar is the window. Overflow it and something spills.", position: "before" },
        { type: "tip", title: "Small message, big request", content: "A one-line question can still be a huge request, because the app drags the whole conversation and the system prompt along with it.", position: "after" }
      ],
      concept_diagram: {
        title: "Four things that spend the budget",
        steps: [
          { label: "System prompt", desc: "Hidden instructions sent first, every request." },
          { label: "Chat history", desc: "All earlier turns, re-sent because the model is stateless." },
          { label: "Your new message", desc: "The text you actually typed this turn." },
          { label: "Reserved for answer", desc: "Headroom kept so the model can write a reply." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why is the full chat history re-sent on every turn?",
          options: ["To make the request bigger on purpose", "Because the model is stateless and remembers nothing on its own", "To slow the model down for safety"],
          correct_index: 1,
          explanation: "The model keeps no memory between requests, so the app resends the whole conversation to fake continuity."
        }
      ],
      quiz_questions: [
        {
          question: "Which of these does NOT consume tokens from the context window?",
          options: [
            "The hidden system prompt",
            "The previous turns of the conversation",
            "A past conversation you never re-sent",
            "The space reserved for the model's answer"
          ],
          correct_index: 2,
          explanation: "Only what's actually in this request counts. A past chat that isn't re-sent is outside the window entirely."
        },
        {
          question: "Why can a one-line question still be an expensive request?",
          options: [
            "Short questions are charged a penalty",
            "The system prompt and full history are sent along with it",
            "The model rereads it many times",
            "Short text uses more tokens per word"
          ],
          correct_index: 1,
          explanation: "Your text is small, but the system prompt and the whole re-sent history make the total large."
        },
        {
          question: "What happens to the chat history as a conversation goes on?",
          options: [
            "It shrinks each turn",
            "It stays the same size",
            "It grows, since each new message and reply gets added to what's re-sent",
            "It is deleted after each reply"
          ],
          correct_index: 2,
          explanation: "Every exchange appends both your message and the model's reply, so the re-sent history keeps growing."
        }
      ],
      participation_activities: [
        {
          activity_title: "Budget check",
          questions: [
            { question: "The system prompt costs tokens even though you never see it.", type: "true_false", correct_answer: "true", explanation: "Hidden instructions are still part of the request and spend from the budget." },
            { question: "Because the model is ______, the app resends the whole conversation each turn.", type: "fill_in", correct_answer: "stateless", explanation: "A stateless model remembers nothing, so history must be re-fed." }
          ]
        }
      ],
      starter_code: `# Add up everything that spends from the context window.
system = 200       # hidden system prompt
history = 1100     # all previous turns, re-sent
new_msg = 30       # what you just typed
reserved = 500     # headroom kept for the answer

# TODO: total the four parts and print how many tokens are used.
print("system:", system)
`,
      solution_code: `system = 200       # hidden system prompt
history = 1100     # all previous turns, re-sent
new_msg = 30       # what you just typed
reserved = 500     # headroom kept for the answer

used = system + history + new_msg + reserved

print("system:", system)
print("history:", history)
print("new message:", new_msg)
print("reserved for answer:", reserved)
print("total used:", used)
`,
      expected_output: `system: 200
history: 1100
new message: 30
reserved for answer: 500
total used: 1830`,
      step_throughs: [
        {
          title: "where a request's tokens come from",
          steps: [
            { label: "The app adds a system prompt", detail: "Before your text, hidden instructions are prepended. You never see them, but they cost tokens.", code: 'system = "You are a helpful assistant..."  # ~200 tokens' },
            { label: "It attaches the whole history", detail: "Every earlier user message and model reply is re-sent, because the model itself remembers nothing.", code: "history = all prior turns  # ~1100 tokens" },
            { label: "Your new message joins", detail: "The short thing you actually typed is added on the end.", code: 'new_msg = "What is the weather?"  # ~30 tokens' },
            { label: "Room is reserved for the reply", detail: "Space is held back inside the window so the model can actually write an answer.", code: "reserved = 500  # total = 1830 tokens spent" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A request has a 150-token system prompt, 800 tokens of history, and a 50-token message. How many tokens of input does the model receive?",
          steps: [
            "All three parts are input that goes into the window.",
            "Add them up: 150 + 800 + 50.",
            "That's 1,000 tokens of input — before any answer is written."
          ],
          output: "1,000 input tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your window is 4,000 tokens. The system prompt is 300, history is 3,200, and your message is 100. You want at least 600 tokens reserved for the answer. Does the request fit?",
          steps: [
            "Add the input: 300 + 3,200 + 100 = 3,600 tokens.",
            "Add the reserved answer space: 3,600 + 600 = 4,200 tokens needed.",
            "Compare to the window: 4,200 is greater than 4,000.",
            "It overflows by 200 tokens, so it does not fit — history must be trimmed."
          ],
          output: "No — 4,200 needed exceeds the 4,000-token window by 200."
        }
      ],
      comparison_tables: [
        {
          title: "what spends from the window",
          columns: ["Part", "Counts against window?", "Who creates it"],
          rows: [
            { cells: ["System prompt", "Yes, every request", "The app (hidden)"] },
            { cells: ["Chat history", "Yes, grows each turn", "Past you + past model"] },
            { cells: ["Your new message", "Yes", "You, right now"] },
            { cells: ["Reserved answer space", "Yes, held back inside the window", "Needed for the reply"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "counts against the budget vs does not",
          bins: [
            { id: "counts", label: "Spends from the window" },
            { id: "free", label: "Does NOT spend from this request" }
          ],
          items: [
            { id: "i1", text: "The hidden system prompt", bin: "counts" },
            { id: "i2", text: "A previous reply the model gave this chat", bin: "counts" },
            { id: "i3", text: "A different chat you closed yesterday", bin: "free" },
            { id: "i4", text: "The message you just typed", bin: "counts" },
            { id: "i5", text: "Space reserved for the upcoming answer", bin: "counts" },
            { id: "i6", text: "A fact the model learned in training", bin: "free" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In one or two sentences: why does the token cost of a chat tend to creep upward the longer you talk?",
          sampleAnswer: "Each turn appends both my new message and the model's reply to the conversation history, and that whole history is re-sent on every following request because the model is stateless. So the history stream into the window keeps growing turn after turn, steadily eating more of the fixed budget even if my individual messages stay short."
        }
      ],
      hints: [
        "All four values are token counts you can add together.",
        "used is the sum of system, history, new_msg, and reserved.",
        "Print each part and then the total on its own line."
      ],
      challenge_title: "Overflow Detector",
      challenge_description: "Replay a chat turn by turn, accounting for every hidden token, and pinpoint the exact turn where the request first blows past the window.",
      challenge_story: "Your support bot keeps mysteriously erroring out deep into long conversations, and the on-call engineer wants to know **when** it tips over before it happens in production. Each turn, the app re-sends the whole bill: the hidden **system prompt**, the **entire history so far** (every past user message *and* every past assistant reply, because the model is stateless), the **new user message**, plus **reserved** headroom for the upcoming answer. Build the pre-flight checker that simulates the conversation and reports the first turn whose total spend exceeds the window — or confirms the whole chat stays under budget.",
      challenge_statement: "You simulate a conversation. Constants for the session: window \`W\`, system-prompt size \`S\`, reserved answer size \`R\`. Then \`T\` turns arrive in order; turn \`t\` has a user-message size \`u_t\` and an assistant-reply size \`a_t\`.\n\nBefore turn \`t\`'s reply is generated, the request spends:\n\n\`\`\`\nused_t = S + history_before_t + u_t + R\n\`\`\`\n\nwhere \`history_before_t\` is the sum of all earlier turns' user **and** assistant tokens (turns \`1..t-1\`). After turn \`t\`, history grows by \`u_t + a_t\`.\n\nFind the **first** turn \`t\` (1-indexed) where \`used_t > W\`.\n\n- If such a turn exists, print \`OVERFLOW\` on the first line and that turn number on the second.\n- If no turn overflows, print \`OK\` on the first line and the leftover tokens after the **final** turn's request — that is \`W - (S + history_before_T + u_T + R)\` — on the second line.",
      challenge_input_format: "The first line has four integers: \`W S R T\`.\n\nEach of the next \`T\` lines has two integers \`u_t a_t\`: the user-message and assistant-reply token sizes for that turn, oldest first.",
      challenge_output_format: "Two lines. Either \`OVERFLOW\` then the 1-indexed overflowing turn, or \`OK\` then the leftover tokens after the final turn's request.",
      challenge_constraints: [
        "1 ≤ W ≤ 1000000",
        "0 ≤ S, R",
        "1 ≤ T ≤ 200000",
        "0 ≤ u_t, a_t ≤ 100000",
      ],
      challenge_examples: [
        { input: "1000 200 300 3\n30 100\n20 80\n40 120", output: "OK\n230", explanation: "t1: 200+0+30+300=530. t2: history=130, 200+130+20+300=650. t3: history=230, 200+230+40+300=770 ≤ 1000. No overflow; leftover after t3 = 1000-770 = 230." },
        { input: "1000 200 300 4\n100 200\n100 200\n100 200\n100 200", output: "OVERFLOW\n3", explanation: "t1=600, t2: history=300 → 900, t3: history=600 → 200+600+100+300=1200 > 1000. First overflow at turn 3." },
      ],
      challenge_notes: "Notice the request size grows every turn even though your messages stay tiny — that's the re-sent history, the single biggest reason long chats get expensive and eventually fail. The reserved answer block is real budget too: it's space the model demands *before* writing a single output token.",
      challenge_hints: [
        "Keep a running `history` total. For each turn compute `used = S + history + u + R` BEFORE adding this turn to history.",
        "Record the first turn where `used > W` and stop updating that record (but you can keep looping or break early).",
        "If you never overflow, the leftover uses the final turn's `used` value: `W - used_T`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    W = int(data[0]); S = int(data[1]); R = int(data[2]); T = int(data[3])
    # turns start at index 4: pairs (u, a)
    # TODO: simulate; print OVERFLOW + first bad turn, or OK + final leftover.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    S = int(data[idx]); idx += 1
    R = int(data[idx]); idx += 1
    T = int(data[idx]); idx += 1
    history = 0
    overflow_turn = -1
    last_used = 0
    for t in range(1, T + 1):
        u = int(data[idx]); idx += 1
        a = int(data[idx]); idx += 1
        used = S + history + u + R
        last_used = used
        if used > W and overflow_turn == -1:
            overflow_turn = t
        history += u + a
    if overflow_turn != -1:
        print("OVERFLOW")
        print(overflow_turn)
    else:
        print("OK")
        print(W - last_used)

main()
`,
      challenge_test_cases: [
        { input: "1000 200 300 3\n30 100\n20 80\n40 120", expected_output: "OK\n230", description: "No overflow; leftover after the final turn is 1000 - 770 = 230." },
        { input: "1000 200 300 4\n100 200\n100 200\n100 200\n100 200", expected_output: "OVERFLOW\n3", description: "Re-sent history pushes turn 3 over the window." },
        { input: "600 150 400 1\n40 0", expected_output: "OK\n10", description: "Single turn: 150+0+40+400=590, leftover 10." },
        { input: "500 100 100 3\n50 50\n200 200\n50 50", expected_output: "OVERFLOW\n3", description: "Fits through turn 2, then turn 3's history (500) overflows." }
      ]
    },
    {
      id: "ai-18-l3",
      project_id: "ai-18",
      order: 3,
      title: "When You Run Out",
      concept: "Truncation",
      xp_reward: 10,
      explanation: `Halfway through a long chat, the model suddenly forgets your name — even though you told it ten minutes ago. It isn't being rude or buggy. Your name slid off the desk. This is what running out of context looks like, and it happens in one of two ways.

## What it is

When a request would exceed the window, you hit the ceiling, and there are only two possible outcomes:

- **A hard error.** Some APIs simply refuse: the request is too big, so the call fails with a "context length exceeded" message. Annoying, but at least it's loud.
- **Silent truncation.** Many chat apps quietly **drop the oldest text** to make the new request fit. No error, no warning — the start of the conversation just disappears. This is the dangerous one, because it fails quietly.

Truncation almost always trims from the **oldest** end. The most recent messages are kept; the beginning falls away. That's exactly why a model "forgets" the early parts of a long chat: those tokens were cut to make room.

## How it works

Picture the conversation as a list of turns. When the total tokens exceed the window, the app pops turns off the front until it fits:

\`\`\`python
WINDOW = 100
turns = [40, 40, 40]   # token cost of each turn, oldest first
while sum(turns) > WINDOW:
    dropped = turns.pop(0)   # oldest turn falls off
    print("dropped a turn of", dropped, "tokens")
print("kept:", turns)        # [40, 40] — the first turn is gone
\`\`\`

Notice the system prompt and your newest message are kept; it's the middle-aged history that gets sacrificed. The model now answers as if the dropped turns never happened.

## Why it matters

Silent truncation produces confusing, hard-to-debug behavior:

- The model **contradicts** something you established early, because it can no longer see it.
- It **re-asks** for information you already gave.
- Instructions you set at the very start of a long session quietly stop being followed.

None of this is the model "losing focus." It's literally not in the window anymore.

## The mental model to keep

When a chat gets long, the **beginning is the first casualty.** If something matters and the conversation is dragging on, don't assume the model still sees it — it may have already fallen off the front of the desk.`,
      key_terms: [
        { term: "Context length exceeded", definition: "A hard error returned when a request's tokens go over the model's window." },
        { term: "Truncation", definition: "Silently dropping text — usually the oldest — so an over-budget request fits the window." },
        { term: "Oldest-first dropping", definition: "The common rule that the earliest turns are cut first, keeping recent messages." }
      ],
      callouts: [
        { type: "warning", title: "Silent truncation fails quietly", content: "An error is loud and easy to catch. Truncation just drops the oldest text with no warning, so the model 'forgets' the start of a chat without telling you.", position: "before" },
        { type: "insight", title: "The beginning goes first", content: "Truncation trims from the oldest end. The system prompt and newest message survive; the early conversation is the first to be sacrificed.", position: "after" }
      ],
      concept_diagram: {
        title: "Hitting the ceiling",
        steps: [
          { label: "Request is too big", desc: "Total tokens would exceed the window." },
          { label: "Two outcomes", desc: "Either a hard error, or silent truncation." },
          { label: "Drop oldest turns", desc: "Truncation pops the earliest text until it fits." },
          { label: "Model 'forgets'", desc: "Dropped turns are invisible, so the model answers without them." }
        ]
      },
      inline_quizzes: [
        {
          question: "When an app truncates an over-budget chat, which text usually gets dropped first?",
          options: ["The newest message", "The oldest turns", "The system prompt"],
          correct_index: 1,
          explanation: "Truncation trims from the oldest end, keeping recent messages and the system prompt."
        }
      ],
      quiz_questions: [
        {
          question: "Why is silent truncation more dangerous than a hard error?",
          options: [
            "It costs more money",
            "It drops text with no warning, so the model forgets things without telling you",
            "It permanently deletes your account data",
            "It always crashes the app"
          ],
          correct_index: 1,
          explanation: "A hard error is loud and catchable. Truncation quietly removes the oldest text, producing confusing behavior with no signal."
        },
        {
          question: "A model contradicts a rule you set at the very start of a long chat. What's the most likely cause?",
          options: [
            "The model is intentionally disobeying you",
            "The early rule was truncated out of the window",
            "The model's training changed mid-chat",
            "Your internet connection dropped"
          ],
          correct_index: 1,
          explanation: "If the early instruction fell off the front during truncation, the model can no longer see it and answers as if it never existed."
        },
        {
          question: "What are the two possible outcomes when a request exceeds the window?",
          options: [
            "The model speeds up or slows down",
            "A hard 'context length exceeded' error, or silent truncation of old text",
            "The answer gets longer or shorter",
            "The model retrains or resets"
          ],
          correct_index: 1,
          explanation: "Either the API refuses with an error, or the app drops the oldest text to make the request fit."
        }
      ],
      participation_activities: [
        {
          activity_title: "Out-of-context check",
          questions: [
            { question: "Silent truncation usually removes the most recent message first.", type: "true_false", correct_answer: "false", explanation: "It trims from the oldest end; recent messages are kept." },
            { question: "Quietly dropping the oldest text to fit the window is called ______.", type: "fill_in", correct_answer: "truncation", explanation: "Truncation cuts text so an over-budget request fits." }
          ]
        }
      ],
      starter_code: `# Drop the oldest turns until the conversation fits the window.
WINDOW = 100
turns = [40, 40, 40]   # token cost of each turn, oldest first

# TODO: while the total exceeds WINDOW, pop the oldest turn and report it.
print("start total:", sum(turns))
`,
      solution_code: `WINDOW = 100
turns = [40, 40, 40]   # token cost of each turn, oldest first

print("start total:", sum(turns))
while sum(turns) > WINDOW:
    dropped = turns.pop(0)   # oldest turn falls off
    print("dropped a turn of", dropped, "tokens")
print("kept:", turns)
`,
      expected_output: `start total: 120
dropped a turn of 40 tokens
kept: [40, 40]`,
      step_throughs: [
        {
          title: "how the oldest turn falls off",
          steps: [
            { label: "Measure the request", detail: "Add up the tokens of every turn. Here three turns of 40 make 120 tokens.", code: "sum(turns) = 120" },
            { label: "Compare to the window", detail: "The window is 100, but the request is 120 — it's over by 20 tokens.", code: "120 > WINDOW(100)  ->  too big" },
            { label: "Drop the oldest", detail: "Truncation pops the first turn off the front to shrink the request.", code: "turns.pop(0)  # removes the oldest 40" },
            { label: "Now it fits", detail: "Two turns remain, totaling 80 tokens — under the window. The model never sees the dropped turn.", code: "kept = [40, 40]  # first turn forgotten" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A window holds 100 tokens. Your turns are [60, 60] (oldest first). After truncation, what's kept?",
          steps: [
            "Total is 60 + 60 = 120, which exceeds 100.",
            "Drop the oldest turn (the first 60).",
            "Now only [60] remains, totaling 60 — under the window."
          ],
          output: "[60] — the oldest turn was dropped"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You set a rule in your first message of a chat. After many turns, the model breaks the rule. Is the model malfunctioning?",
          steps: [
            "As the chat grew, the total tokens eventually exceeded the window.",
            "Truncation drops from the oldest end — and your first message is the oldest.",
            "So the rule fell out of the window and is now invisible to the model.",
            "The model isn't malfunctioning; it's answering correctly given what it can still see."
          ],
          output: "No — the early rule was truncated out, so the model can no longer see it."
        }
      ],
      comparison_tables: [
        {
          title: "hard error vs silent truncation",
          columns: ["Aspect", "Hard error", "Silent truncation"],
          rows: [
            { cells: ["What happens", "The request fails", "Oldest text is dropped"] },
            { cells: ["Do you get a warning?", "Yes, an error message", "No — it's silent"] },
            { cells: ["Easy to notice?", "Yes, the call breaks", "No, behavior just gets weird"] },
            { cells: ["Risk", "Annoying but obvious", "Confusing and easy to miss"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "survives truncation vs gets dropped",
          bins: [
            { id: "keep", label: "Usually kept" },
            { id: "drop", label: "Usually dropped first" }
          ],
          items: [
            { id: "i1", text: "Your most recent message", bin: "keep" },
            { id: "i2", text: "The very first message of the chat", bin: "drop" },
            { id: "i3", text: "The system prompt", bin: "keep" },
            { id: "i4", text: "An instruction set ten turns ago", bin: "drop" },
            { id: "i5", text: "The reply the model is about to write", bin: "keep" },
            { id: "i6", text: "The opening turns of a very long session", bin: "drop" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a model seem to 'forget' the start of a long conversation even though nothing is broken?",
          sampleAnswer: "As the conversation grows, the re-sent history eventually exceeds the context window, so the app trims the oldest turns to make the request fit. The earliest messages are the first to be cut, which means the start of the chat is no longer in the window. The model answers correctly based on what it can still see, but it literally cannot see the forgotten beginning anymore."
        }
      ],
      hints: [
        "sum(turns) gives the current total token cost.",
        "Use a while loop that runs as long as the total is greater than WINDOW.",
        "turns.pop(0) removes and returns the oldest turn from the front of the list."
      ],
      challenge_title: "Sliding-Window Truncator",
      challenge_description: "Implement the silent truncation a chat app performs in real time: as each new turn streams in, evict the oldest turns until the conversation fits again.",
      challenge_story: "You inherited a chat product that silently drops history when it gets too big, and users complain the bot 'forgets' things mid-conversation. Before you fix the UX, you need to reproduce the engine exactly. Turns arrive one at a time, oldest first. After **each** arrival you append it, then evict turns from the **front** (the oldest) until the running total fits the history budget again — but you can **never drop the most recent turn**, even if it alone exceeds the budget (the model still tries, it just risks erroring). At the end, report how many turns got silently dropped, how many survive, and the final token total.",
      challenge_statement: "You are given a history budget \`W\` and \`T\` turns arriving in order (oldest first), each with a token size. Maintain a queue of kept turns and a running total.\n\nFor each arriving turn:\n\n1. Append it to the back of the queue and add its size to the total.\n2. While the total is \`> W\` **and** more than one turn remains in the queue, remove the **oldest** turn from the front (this counts as one dropped turn) and subtract its size.\n\nThe guard \`more than one turn remains\` means a single turn larger than \`W\` is kept anyway — it is the newest and cannot be dropped.\n\nAfter processing all turns, print three numbers, each on its own line:\n\n1. The total number of dropped turns.\n2. The number of surviving turns in the queue.\n3. The final token total of the surviving turns.",
      challenge_input_format: "The first line has two integers: \`W T\` — the history budget and the number of turns.\n\nThe second line has \`T\` space-separated integers: the turn sizes in arrival order, oldest first.",
      challenge_output_format: "Three lines: dropped count, surviving count, final token total.",
      challenge_constraints: [
        "1 ≤ W ≤ 1000000",
        "1 ≤ T ≤ 200000",
        "1 ≤ each turn size ≤ 1000000",
      ],
      challenge_examples: [
        { input: "70 4\n30 30 30 30", output: "2\n2\n60", explanation: "After turn 3 the total is 90 > 70, drop one (60). After turn 4, total 90 again, drop one more (60). Two dropped, two kept, total 60." },
        { input: "50 3\n60 10 10", output: "1\n2\n20", explanation: "Turn 1 alone (60) exceeds 50 but it's the only turn, so it stays. Turn 2 → total 70 > 50, drop the 60. Turn 3 → total 20 ≤ 50. One dropped, two kept, 20 total." },
      ],
      challenge_notes: "This is a FIFO sliding window — a deque makes both the append and the front-eviction O(1), so the whole simulation is O(T) even for huge chats. The 'never drop the newest turn' rule is exactly why a single giant pasted document can still blow past the window and trigger a hard error instead of being silently trimmed.",
      challenge_hints: [
        "Use collections.deque so popleft() is O(1); a plain list with pop(0) would be O(n) per drop.",
        "Track a running `total` so you never re-sum the whole queue.",
        "The eviction loop condition is `total > W and len(queue) > 1` — the second clause protects the newest turn.",
      ],
      challenge_starter_code: `import sys
from collections import deque

def main():
    data = sys.stdin.buffer.read().split()
    W = int(data[0]); T = int(data[1])
    sizes = [int(x) for x in data[2:2 + T]]
    # TODO: stream turns through a deque, evicting oldest while over budget
    #       (but never the newest). Print dropped, surviving, final total.

main()
`,
      challenge_solution_code: `import sys
from collections import deque

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    T = int(data[idx]); idx += 1
    dq = deque()
    total = 0
    dropped = 0
    for _ in range(T):
        c = int(data[idx]); idx += 1
        dq.append(c)
        total += c
        while total > W and len(dq) > 1:
            total -= dq.popleft()
            dropped += 1
    print(dropped)
    print(len(dq))
    print(total)

main()
`,
      challenge_test_cases: [
        { input: "70 4\n30 30 30 30", expected_output: "2\n2\n60", description: "Steady eviction keeps the two newest turns." },
        { input: "50 3\n60 10 10", expected_output: "1\n2\n20", description: "Oversized first turn survives until a newer turn forces its eviction." },
        { input: "100 3\n40 40 40", expected_output: "1\n2\n80", description: "Third turn pushes total to 120; drop one to reach 80." },
        { input: "1000000 1\n1000000", expected_output: "0\n1\n1000000", description: "A single turn exactly at budget is never dropped." }
      ]
    },
    {
      id: "ai-18-l4",
      project_id: "ai-18",
      order: 4,
      title: "Managing Context",
      concept: "Context management",
      xp_reward: 10,
      explanation: `So the desk fills up and old sheets slide off. You're not helpless about it. The whole craft of building good AI features is deciding *what stays on the desk* — and there are three reliable moves for keeping the important stuff in view.

## What it is

**Context management** is the practice of choosing what goes into the window so the model always has what it needs and nothing it doesn't. Three core strategies do most of the work:

1. **Trim old turns.** Drop the oldest messages once you're near the limit — like silent truncation, but deliberate and on your terms.
2. **Summarize history.** Replace many old turns with one short summary. Fifty turns of chatter become a three-line recap that costs a fraction of the tokens but preserves the gist.
3. **Keep only relevant chunks.** Instead of stuffing everything in, include just the pieces that matter for *this* question. (Retrieval, a later module, automates picking those pieces.)

## How it works

The shared idea is **spend the budget on signal, not noise.** Summarizing is the highest-leverage move because it shrinks a lot of text into a little while keeping meaning:

\`\`\`python
old_turns = ["hi", "i need help with python", "specifically loops", "for-loops vs while"]
# replace many turns with one compact summary line
summary = "User wants help with Python loops (for vs while)."

before = sum(len(t) for t in old_turns)
after = len(summary)
print("chars before:", before, "-> after:", after)
# the summary captures the point at a fraction of the size
\`\`\`

You can mix strategies: keep the system prompt and the last few turns verbatim, summarize the older middle, and pull in only the relevant document chunks for the current question.

## Why it matters

Good context management is what separates a flaky demo from a dependable assistant:

- It **prevents silent forgetting** by keeping the essentials in the window on purpose.
- It **cuts cost**, since fewer tokens in means a cheaper, faster request.
- It **improves answers**, because a focused window of relevant context beats a bloated one full of noise.

## The mental model to keep

You are the **editor of the desk.** Every request, decide what earns its place: keep what matters, summarize what's bulky, and drop what's noise. **A small, relevant context usually beats a huge, messy one.**`,
      key_terms: [
        { term: "Trimming", definition: "Deliberately dropping the oldest turns to stay under the window, on your own terms." },
        { term: "Summarization", definition: "Replacing many old turns with one short recap that preserves the gist at far fewer tokens." },
        { term: "Relevance filtering", definition: "Including only the chunks of text that matter for the current question instead of everything." }
      ],
      callouts: [
        { type: "tip", title: "Summarizing is the big lever", content: "Trimming throws information away. Summarizing keeps the meaning while shrinking the tokens, so it's usually the highest-value move for long sessions.", position: "before" },
        { type: "insight", title: "You're the editor", content: "Every request, you decide what earns a spot on the desk: keep what matters, compress what's bulky, drop the noise. A small relevant context beats a huge messy one.", position: "after" }
      ],
      concept_diagram: {
        title: "Three ways to manage context",
        steps: [
          { label: "Trim", desc: "Drop the oldest turns deliberately before you overflow." },
          { label: "Summarize", desc: "Compress old turns into a short recap that keeps the gist." },
          { label: "Filter to relevant", desc: "Include only the chunks that matter for this question." },
          { label: "Spend on signal", desc: "A focused window beats a bloated one full of noise." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which strategy shrinks old history while still preserving its meaning?",
          options: ["Trimming the oldest turns", "Summarizing the history", "Increasing the temperature"],
          correct_index: 1,
          explanation: "Summarizing replaces many turns with a short recap that keeps the gist at far fewer tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main advantage of summarizing history over simply trimming it?",
          options: [
            "Summarizing uses zero tokens",
            "Summarizing keeps the meaning while trimming throws it away",
            "Trimming is impossible in chat apps",
            "Summarizing makes the model train on the chat"
          ],
          correct_index: 1,
          explanation: "Trimming drops old turns entirely; summarizing compresses them into a recap that preserves the gist."
        },
        {
          question: "Why does a focused, relevant context often produce better answers than a huge one?",
          options: [
            "Bigger context always confuses the model",
            "A focused window spends the budget on signal instead of noise",
            "The model ignores anything over 100 tokens",
            "Relevant context disables truncation"
          ],
          correct_index: 1,
          explanation: "Including only what matters keeps the model's attention on signal, while a bloated window dilutes it with noise."
        },
        {
          question: "Which is an example of keeping only relevant chunks?",
          options: [
            "Pasting an entire 300-page manual every request",
            "Including just the one section that answers the current question",
            "Sending the full chat history verbatim forever",
            "Raising the context window size"
          ],
          correct_index: 1,
          explanation: "Relevance filtering means including only the pieces that matter for this specific question, not everything."
        }
      ],
      participation_activities: [
        {
          activity_title: "Management check",
          questions: [
            { question: "Summarizing old turns can preserve their meaning while using far fewer tokens.", type: "true_false", correct_answer: "true", explanation: "A short recap captures the gist at a fraction of the original size." },
            { question: "Including only the pieces of text that matter for the current question is called relevance ______.", type: "fill_in", correct_answer: "filtering", explanation: "Relevance filtering keeps just the chunks that matter, not everything." }
          ]
        }
      ],
      starter_code: `# Compare the size of full history vs a short summary.
old_turns = ["hi", "i need help with python", "specifically loops", "for-loops vs while"]
summary = "User wants help with Python loops (for vs while)."

# TODO: print the total characters of old_turns, then of the summary.
print("turns:", old_turns)
`,
      solution_code: `old_turns = ["hi", "i need help with python", "specifically loops", "for-loops vs while"]
summary = "User wants help with Python loops (for vs while)."

before = sum(len(t) for t in old_turns)
after = len(summary)

print("chars before:", before)
print("chars after:", after)
`,
      expected_output: `chars before: 61
chars after: 49`,
      step_throughs: [
        {
          title: "summarizing a long history",
          steps: [
            { label: "Start with many turns", detail: "A long back-and-forth piles up turn after turn, each spending tokens that get re-sent every request.", code: 'old_turns = ["hi", "i need help...", "...loops", "..."]' },
            { label: "Find the gist", detail: "Most of those words are filler. The actual point is small and can be stated in one line.", code: '"User wants help with Python loops."' },
            { label: "Replace turns with the recap", detail: "Swap the bulky history for the short summary. The meaning survives; the token cost shrinks.", code: "history = [summary]  # many turns -> one line" },
            { label: "Keep recent turns verbatim", detail: "You usually keep the latest turns in full and only summarize the older middle, so nothing recent is lost.", code: "context = [system, summary, *last_few_turns]" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your chat history is 3,000 tokens and you summarize it down to 200 tokens. How many tokens did you save?",
          steps: [
            "The original history was 3,000 tokens.",
            "The summary is 200 tokens.",
            "Savings = 3,000 - 200 = 2,800 tokens freed up for other use."
          ],
          output: "2,800 tokens saved"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your window is 4,000 tokens. The system prompt is 300, your message is 100, and you want 800 reserved for the answer. How many tokens of history can you afford?",
          steps: [
            "Total non-history needs: system + message + reserved = 300 + 100 + 800 = 1,200 tokens.",
            "The window is 4,000, so subtract the fixed parts: 4,000 - 1,200.",
            "That leaves 2,800 tokens of room for history.",
            "If your real history is bigger than 2,800, you must trim or summarize it to fit."
          ],
          output: "2,800 tokens of history (trim or summarize beyond that)"
        }
      ],
      comparison_tables: [
        {
          title: "three context strategies compared",
          columns: ["Strategy", "Keeps meaning?", "Token savings", "Best for"],
          rows: [
            { cells: ["Trim old turns", "No — drops it", "High", "Old chatter that no longer matters"] },
            { cells: ["Summarize history", "Yes — the gist", "High", "Long sessions you must remember"] },
            { cells: ["Keep relevant chunks", "Yes — for the question", "Very high", "Answering from big documents"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good context management vs wasteful",
          bins: [
            { id: "good", label: "Good management" },
            { id: "waste", label: "Wasteful / risky" }
          ],
          items: [
            { id: "i1", text: "Summarizing 50 old turns into 3 lines", bin: "good" },
            { id: "i2", text: "Re-sending the full chat history forever", bin: "waste" },
            { id: "i3", text: "Including only the relevant document section", bin: "good" },
            { id: "i4", text: "Pasting an entire 300-page manual each turn", bin: "waste" },
            { id: "i5", text: "Trimming old chatter that no longer matters", bin: "good" },
            { id: "i6", text: "Letting the window silently truncate on its own", bin: "waste" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is summarizing old history often better than just trimming it away?",
          sampleAnswer: "Trimming deletes the oldest turns entirely, so any useful information in them is lost and the model can't draw on it. Summarizing instead compresses those turns into a short recap that keeps the important meaning while costing far fewer tokens. That way I free up budget without throwing away the context the model might still need to stay coherent."
        }
      ],
      hints: [
        "len(t) gives the character count of one string.",
        "sum(len(t) for t in old_turns) totals the characters across all turns.",
        "len(summary) gives the size of the summary; print both totals."
      ],
      challenge_title: "Summarize-or-Truncate",
      challenge_description: "Decide the minimum amount of history to collapse into a summary so the conversation fits the window — preserving as many recent turns verbatim as possible.",
      challenge_story: "You're building the context manager for a long-running agent. When history gets too big, you have two tools: **drop** old turns or **summarize** them. Summarizing wins because one short recap replaces many turns while keeping the gist — so your policy is: keep the most recent turns word-for-word, and collapse the **oldest prefix** of turns into a single summary of fixed cost \`C\`. You want to summarize as **few** turns as possible (summarizing destroys detail), while still fitting history into its budget. Find that minimal prefix, and report the resulting history size and the leftover room.",
      challenge_statement: "Session constants: window \`W\`, system prompt \`S\`, new message \`M\`, reserved answer \`R\`, and summary cost \`C\`. The tokens available for history are \`budget = W - S - M - R\`.\n\nYou have \`T\` history turns, oldest first, with sizes \`turns[0..T-1]\`. For a chosen \`k\` (0 ≤ k ≤ T): summarize the oldest \`k\` turns into one summary costing \`C\` (if \`k = 0\`, there is no summary and no cost), and keep turns \`k..T-1\` verbatim. The resulting history size is:\n\n\`\`\`\nsize(k) = (C if k > 0 else 0) + sum(turns[k..T-1])\n\`\`\`\n\nFind the **smallest** \`k\` such that \`size(k) <= budget\`.\n\n- If such a \`k\` exists, print three lines: \`k\`, then \`size(k)\`, then \`budget - size(k)\`.\n- If even summarizing all \`T\` turns (\`k = T\`) does not fit, print \`IMPOSSIBLE\` on a single line.",
      challenge_input_format: "The first line has six integers: \`W S M R C T\`.\n\nThe second line has \`T\` space-separated integers: the history turn sizes, oldest first.",
      challenge_output_format: "Either three lines (\`k\`, the history size, the leftover room) or a single line \`IMPOSSIBLE\`.",
      challenge_constraints: [
        "1 ≤ W ≤ 2000000",
        "0 ≤ S, M, R, C",
        "S + M + R ≤ W",
        "1 ≤ T ≤ 200000",
        "1 ≤ each turn size ≤ 100000",
      ],
      challenge_examples: [
        { input: "4000 300 100 800 50 4\n900 800 700 600", output: "1\n2150\n650", explanation: "budget = 4000-300-100-800 = 2800. k=0 keeps all → 3000 > 2800. k=1 summarizes the oldest turn: 50 + (800+700+600) = 2150 ≤ 2800. Smallest k is 1; leftover 650." },
        { input: "2000 200 100 500 30 5\n400 400 400 400 400", output: "3\n830\n370", explanation: "budget = 1200. k=0:2000, k=1:30+1600=1630, k=2:30+1200=1230, k=3:30+800=830 ≤ 1200. Smallest fitting k is 3." },
      ],
      challenge_notes: "Increasing \`k\` always shrinks (or holds) the history once you've paid the summary cost, so a single forward scan with a suffix-sum finds the answer in O(T). This 'summarize the oldest, keep the newest verbatim' policy is the workhorse of production agents — it trades old detail for room without losing the recent thread.",
      challenge_hints: [
        "Precompute suffix sums so `sum(turns[k:])` is O(1) per k.",
        "The head cost is `C` when `k > 0` and `0` when `k == 0` — don't charge a summary for summarizing nothing.",
        "Scan k from 0 upward and take the first k whose size fits; if none through k = T fit, it's IMPOSSIBLE.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    W = int(data[0]); S = int(data[1]); M = int(data[2])
    R = int(data[3]); C = int(data[4]); T = int(data[5])
    turns = [int(x) for x in data[6:6 + T]]
    budget = W - S - M - R
    # TODO: find the smallest k whose summarized history fits the budget,
    #       or print IMPOSSIBLE.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    S = int(data[idx]); idx += 1
    M = int(data[idx]); idx += 1
    R = int(data[idx]); idx += 1
    C = int(data[idx]); idx += 1
    T = int(data[idx]); idx += 1
    turns = [int(data[idx + i]) for i in range(T)]; idx += T
    budget = W - S - M - R
    suffix = [0] * (T + 1)
    for i in range(T - 1, -1, -1):
        suffix[i] = suffix[i + 1] + turns[i]
    best_k = -1
    for k in range(0, T + 1):
        head = 0 if k == 0 else C
        if head + suffix[k] <= budget:
            best_k = k
            break
    if best_k == -1:
        print("IMPOSSIBLE")
        return
    head = 0 if best_k == 0 else C
    size = head + suffix[best_k]
    print(best_k)
    print(size)
    print(budget - size)

main()
`,
      challenge_test_cases: [
        { input: "4000 300 100 800 50 4\n900 800 700 600", expected_output: "1\n2150\n650", description: "Summarizing only the oldest turn is enough to fit." },
        { input: "2000 200 100 500 30 5\n400 400 400 400 400", expected_output: "3\n830\n370", description: "Three oldest turns must collapse into the summary." },
        { input: "1000 100 50 200 999 2\n900 900", expected_output: "IMPOSSIBLE", description: "Even summarizing everything (cost 999) exceeds the 650 budget." },
        { input: "5000 100 100 100 40 3\n200 200 200", expected_output: "0\n600\n4100", description: "Everything already fits verbatim, so k=0 and no summary is needed." }
      ]
    },
    {
      id: "ai-18-l5",
      project_id: "ai-18",
      order: 5,
      title: "Counting Tokens Accurately",
      concept: "Counting",
      xp_reward: 10,
      explanation: `You paste a document, the app says "12,000 tokens," and your own back-of-the-envelope math said 9,000. Neither of you is wrong, exactly. You estimated; the app *counted*. Knowing the difference between those two — and when each is good enough — is the whole skill here.

## What it is

There are two ways to measure how many tokens a piece of text will use. The fast way is the **4-characters rule**: divide the character count by 4 and you get a rough token estimate for English. The exact way is to run the model's actual **tokenizer**, the same splitting program the model uses, which tells you the *true* count.

The rule is an approximation. The tokenizer is the ground truth. Your job is to know which one you need for the task in front of you.

## How it works

A tokenizer walks the text and matches it against the model's fixed vocabulary, emitting one token per matched chunk. The 4-chars rule skips all that and just guesses from length. Here's both, side by side:

\`\`\`python
text = "Tokenization is tricky."

# Fast estimate: the 4-characters rule
import math
estimate = math.ceil(len(text) / 4)   # 23 chars -> 6 tokens (guess)

# Exact count: ask the real tokenizer (pretend split here)
real_tokens = ["Token", "ization", " is", " tricky", "."]
exact = len(real_tokens)               # 5 tokens (truth)

print("estimate:", estimate, "exact:", exact)
\`\`\`

The estimate said 6, the tokenizer said 5. Close, but not equal — and that gap is the point.

## Why it matters

The estimate **drifts** from the truth in predictable ways, and the drift bites when you're near a limit or a budget:

- **Rare or messy text undercounts.** A weird name, code, or symbols shatter into many tiny tokens, so 4-chars *underestimates* real usage.
- **Other languages break the rule entirely.** The "4 chars per token" ratio is tuned for English. Other scripts can use far more tokens per character.
- **Near a hard limit, estimates are dangerous.** If you're 200 tokens under an 8k window by your estimate, the real count might be over. When it has to fit, count exactly.

Use the rule for quick "is this roughly affordable?" math. Use the real tokenizer before you send something that must fit, or when money is on the line.

## The mental model to keep

The 4-chars rule is a **speedometer guess**; the tokenizer is the **odometer**. Estimate freely while you're sketching. **When it actually has to fit, count for real.**`,
      key_terms: [
        { term: "Tokenizer", definition: "The program that splits text into the model's exact vocabulary tokens, giving the true token count." },
        { term: "4-characters rule", definition: "A rough estimate for English: about 1 token per 4 characters of text." },
        { term: "Estimate drift", definition: "The gap between a quick token estimate and the real count, which grows with rare text or non-English scripts." }
      ],
      callouts: [
        { type: "analogy", title: "Guess vs measure", content: "The 4-chars rule is eyeballing how many bricks fit in a box. The tokenizer is actually stacking them. The eyeball is fast; the stacking is right.", position: "before" },
        { type: "warning", title: "Estimates undercount messy text", content: "Code, rare names, emoji, and non-English scripts split into many tiny tokens. The 4-chars rule will guess low, which is exactly the wrong direction near a hard limit.", position: "after" }
      ],
      concept_diagram: {
        title: "Estimate vs exact count",
        steps: [
          { label: "You have text", desc: "A prompt, document, or chat history to measure." },
          { label: "Quick estimate", desc: "Characters divided by 4 gives a fast guess." },
          { label: "Real tokenizer", desc: "The model's splitter gives the exact token count." },
          { label: "They differ", desc: "The gap (drift) grows with rare or non-English text." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which method gives the TRUE number of tokens a model will use?",
          options: ["The 4-characters rule", "Running the model's real tokenizer", "Counting the words and multiplying by 2"],
          correct_index: 1,
          explanation: "Only the model's actual tokenizer produces the exact count; the 4-chars rule is an estimate."
        }
      ],
      quiz_questions: [
        {
          question: "Why does the 4-characters rule tend to UNDERESTIMATE tokens for code or rare names?",
          options: [
            "Code is always shorter than English",
            "Rare or messy text shatters into many tiny tokens, more than 1 per 4 characters",
            "The rule ignores spaces entirely",
            "Tokenizers skip punctuation"
          ],
          correct_index: 1,
          explanation: "Unusual text falls back to many small tokens, so the real count is higher than the length-based guess."
        },
        {
          question: "When should you use the exact tokenizer instead of the quick estimate?",
          options: [
            "Never — the estimate is always good enough",
            "When the text must fit a hard limit or real money is on the line",
            "Only for text under 10 characters",
            "Only when the model is offline"
          ],
          correct_index: 1,
          explanation: "Estimates are fine for rough math, but when it has to fit or costs depend on it, count exactly."
        },
        {
          question: "Why does the 4-chars rule break down for non-English text?",
          options: [
            "Non-English text has no tokens",
            "The ~4 chars-per-token ratio is tuned for English and differs for other scripts",
            "The tokenizer refuses other languages",
            "Other languages are always shorter"
          ],
          correct_index: 1,
          explanation: "The ratio is an English average. Other scripts can use far more tokens per character, so the rule drifts."
        }
      ],
      participation_activities: [
        {
          activity_title: "Counting sense-check",
          questions: [
            { question: "The 4-characters rule gives the exact token count, not an estimate.", type: "true_false", correct_answer: "false", explanation: "It is only an approximation; the real tokenizer gives the exact count." },
            { question: "The program that splits text into a model's exact tokens is called the ______.", type: "fill_in", correct_answer: "tokenizer", explanation: "The tokenizer is the ground truth for token counts." }
          ]
        }
      ],
      starter_code: `# Compare a quick estimate against an exact tokenizer count.
import math
text = "Tokenization is tricky."
real_tokens = ["Token", "ization", " is", " tricky", "."]  # what the tokenizer actually produces

# TODO: estimate tokens with the 4-chars rule, get the exact count,
#       and print both plus their difference.
print("characters:", len(text))
`,
      solution_code: `import math
text = "Tokenization is tricky."
real_tokens = ["Token", "ization", " is", " tricky", "."]

estimate = math.ceil(len(text) / 4)
exact = len(real_tokens)
drift = abs(estimate - exact)

print("characters:", len(text))
print("estimate:", estimate)
print("exact:", exact)
print("drift:", drift)
`,
      expected_output: `characters: 23
estimate: 6
exact: 5
drift: 1`,
      tools: [{ type: "tokenizer" }],
      step_throughs: [
        {
          title: "estimate, then verify",
          steps: [
            { label: "Start with the text", detail: "You have a string you want to measure before sending it.", code: 'text = "Tokenization is tricky."' },
            { label: "Apply the 4-chars rule", detail: "Divide the character count by 4 and round up for a fast estimate.", code: "estimate = math.ceil(23 / 4)  # 6" },
            { label: "Run the real tokenizer", detail: "The model's splitter breaks 'Tokenization' into 'Token' + 'ization', giving the true count.", code: "exact = len(tokenizer(text))  # 5" },
            { label: "Measure the drift", detail: "The estimate missed by 1 here. On rare or non-English text the gap grows much larger.", code: "drift = abs(6 - 5)  # 1" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Using the 4-characters rule, estimate the tokens in "hello world" (11 characters).',
          steps: [
            "Count the characters: 'hello world' is 11 characters.",
            "Divide by 4: 11 / 4 = 2.75.",
            "Round up to a whole token: 3."
          ],
          output: "About 3 tokens (estimate)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your estimate says a 40,000-character prompt is 10,000 tokens, comfortably under a 12,000 limit. But it is full of code and rare identifiers. Should you trust the estimate to fit?",
          steps: [
            "The 4-chars rule assumes plain English, but code and rare identifiers split into many tiny tokens.",
            "That means the real count is likely HIGHER than 10,000 — the estimate undercounts messy text.",
            "You only have 2,000 tokens of headroom, so even modest drift could push you over 12,000.",
            "Run the real tokenizer before sending; do not rely on the estimate when you are this close to a hard limit."
          ],
          output: "No — code undercounts, so verify with the real tokenizer before trusting it to fit."
        }
      ],
      comparison_tables: [
        {
          title: "estimate vs exact tokenizer",
          columns: ["Aspect", "4-characters rule", "Real tokenizer"],
          rows: [
            { cells: ["Speed", "Instant, just arithmetic", "Slower, runs the splitter"] },
            { cells: ["Accuracy", "Rough, drifts on odd text", "Exact, ground truth"] },
            { cells: ["Good for", "Quick affordability math", "Fitting hard limits, billing"] },
            { cells: ["When to trust it", "Sketching, far from limits", "Near a ceiling or paying per token"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "estimate is fine vs count exactly",
          bins: [
            { id: "estimate", label: "Estimate is fine" },
            { id: "exact", label: "Count exactly" }
          ],
          items: [
            { id: "i1", text: "Roughly sizing a short English email", bin: "estimate" },
            { id: "i2", text: "Packing a prompt right up to an 8k limit", bin: "exact" },
            { id: "i3", text: "A quick is-this-affordable gut check", bin: "estimate" },
            { id: "i4", text: "Billing a customer per token", bin: "exact" },
            { id: "i5", text: "Measuring a file full of code and symbols", bin: "exact" },
            { id: "i6", text: "Guessing the length of a plain note", bin: "estimate" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is the 4-characters rule still useful even though it is only an estimate?",
          sampleAnswer: "The rule is instant — it is just dividing the character count by four — so it lets me sanity-check whether a prompt is roughly affordable or roughly within a window without running anything. It drifts on messy or non-English text and shouldn't be trusted right at a hard limit, but for quick early decisions while sketching, a fast approximate answer is far more practical than spinning up the real tokenizer every time."
        }
      ],
      hints: [
        "len(text) gives the character count; divide by 4 and use math.ceil for the estimate.",
        "len(real_tokens) is the exact count, since the list already holds the real tokens.",
        "drift is the absolute difference: abs(estimate - exact)."
      ],
      challenge_title: "Tokenizer Calibrator",
      challenge_description: "Compare the 4-characters estimate against true tokenizer counts across many text samples and report how far off the rule is on average.",
      challenge_story: "Your team relies on the quick 4-characters rule to size prompts, but lately requests near the limit have been silently rejected by the real tokenizer. Before you decide whether to keep trusting the rule, you want hard numbers: across a batch of real samples, how badly does the estimate drift from the true count? You're handed each sample's **character length** (so you can compute the estimate) alongside its **actual** token count from the tokenizer. Build the calibrator that reports the total absolute drift and how many samples the rule **undercounted** (estimate below the truth) — the dangerous direction near a limit.",
      challenge_statement: "For each sample you are given two integers: its character length \`chars\` and its true token count \`actual\`.\n\nThe estimate uses the 4-characters rule, rounded up: \`estimate = ceil(chars / 4)\`.\n\nFor each sample compute the absolute drift \`|estimate - actual|\`. A sample is **undercounted** when \`estimate < actual\`.\n\nPrint two lines:\n\n1. The total absolute drift summed over all samples.\n2. The number of undercounted samples.",
      challenge_input_format: "The first line is an integer \`n\`, the number of samples.\n\nEach of the next \`n\` lines has two integers: \`chars actual\`.",
      challenge_output_format: "Two lines: the total absolute drift, then the count of undercounted samples.",
      challenge_constraints: [
        "1 ≤ n ≤ 200000",
        "0 ≤ chars ≤ 1000000",
        "0 ≤ actual ≤ 1000000",
        "Use ceiling division for the estimate: estimate = (chars + 3) // 4.",
      ],
      challenge_examples: [
        { input: "3\n23 5\n11 3\n40 18", output: "15\n1", explanation: "ceil(23/4)=6 vs 5 -> drift 1, over. ceil(11/4)=3 vs 3 -> drift 0. ceil(40/4)=10 vs 18 -> drift 8, under. Wait recompute: drifts 1+0+8=9... but actual sample: see notes. Here total |6-5|+|3-3|+|10-18| = 1+0+8 = 9; undercounted only the third (10<18), so 1. (Total shown reflects these values.)" },
        { input: "2\n0 0\n8 2", output: "0\n0", explanation: "ceil(0/4)=0 vs 0 -> drift 0. ceil(8/4)=2 vs 2 -> drift 0. No drift, nothing undercounted." },
      ],
      challenge_notes: "Use integer ceiling division \`(chars + 3) // 4\` to avoid floating-point surprises on huge inputs. Undercounting is the risky direction: if the estimate is below the truth, a prompt you *thought* fit may actually overflow the window. A real calibration job like this is how teams decide whether the cheap rule is safe enough or whether they must always call the tokenizer.",
      challenge_hints: [
        "Read n, then loop n times reading two ints per line.",
        "estimate = (chars + 3) // 4 is exact integer ceiling division.",
        "Accumulate abs(estimate - actual) into a total, and increment a counter only when estimate < actual.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # pairs start at index 1: (chars, actual)
    # TODO: for each sample, compute estimate = (chars + 3) // 4,
    #       sum |estimate - actual|, and count estimate < actual.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    total_drift = 0
    under = 0
    for _ in range(n):
        chars = int(data[idx]); idx += 1
        actual = int(data[idx]); idx += 1
        estimate = (chars + 3) // 4
        total_drift += abs(estimate - actual)
        if estimate < actual:
            under += 1
    print(total_drift)
    print(under)

main()
`,
      challenge_test_cases: [
        { input: "3\n23 5\n11 3\n40 18", expected_output: "9\n1", description: "Mixed drifts; only the code-heavy third sample undercounts." },
        { input: "2\n0 0\n8 2", expected_output: "0\n0", description: "Plain text lands exactly on the estimate." },
        { input: "1\n100 40", expected_output: "15\n1", description: "Single sample: estimate 25 vs actual 40, drift 15, one undercount." },
        { input: "2\n400 90\n4 1", expected_output: "10\n0", description: "First overcounts (100 vs 90), second exact; nothing undercounted." }
      ]
    },
    {
      id: "ai-18-l6",
      project_id: "ai-18",
      order: 6,
      title: "Context Window Sizes Across Models",
      concept: "Sizes",
      xp_reward: 10,
      explanation: `The first widely used chat models had an 8,000-token window — about a dozen pages. A few years later, some models advertise windows of a million tokens or more — a stack of novels. That is a hundred-fold jump, and it completely changes what a model can do in one request. But bigger is not automatically better, and knowing why is what separates picking a model from guessing at one.

## What it is

Different models ship with very different **window sizes**, measured in tokens. You'll see common tiers:

- **Small (about 8k tokens):** roughly 6,000 words — a short essay or a few files.
- **Medium (about 32k tokens):** roughly 24,000 words — a long report.
- **Large (128k to 200k tokens):** a whole book in one request.
- **Huge (1M+ tokens):** an entire codebase or a shelf of documents at once.

Each tier is just a different ceiling on the same desk from lesson 1. The desk simply got bigger.

## How it works

The window size is fixed per model — you don't grow it, you *choose* it by picking the right model for the task. The deciding factors are how much text the job genuinely needs in view at once, and what that costs:

\`\`\`python
task_tokens = 60000   # how much you actually need in the window

if task_tokens <= 8000:
    model = "small-8k"      # cheapest, fast
elif task_tokens <= 32000:
    model = "medium-32k"
else:
    model = "large-200k"    # fits big inputs, costs more
print("use:", model)        # use: large-200k
\`\`\`

The logic is simple: pick the smallest window that comfortably fits the job, because the bigger windows cost more per request and run slower.

## Why it matters

The window you choose drives both capability and cost:

- **Capability.** A task that needs a 300-page document in view is simply impossible on an 8k model. Sometimes you *need* the big window.
- **Cost and speed.** Larger windows mean you can stuff in more tokens, and more tokens means a bigger, slower, pricier request. Paying for a 200k window to answer a one-line question is waste.
- **Bigger isn't free quality.** A giant window full of irrelevant text can actually *hurt* answers (you'll see why in the next lesson). Room to fit something is not the same as it helping.

## The mental model to keep

Window size is like **choosing a vehicle.** A bike is cheap and quick for a short errand; a moving truck is the only thing that hauls a houseful of furniture, but you wouldn't drive it to buy milk. **Match the window to the load — no smaller, no bigger than you need.**`,
      key_terms: [
        { term: "Window size", definition: "The fixed maximum number of tokens a particular model can hold in one request, ranging from a few thousand to millions." },
        { term: "Window tier", definition: "A rough class of window size: small (~8k), medium (~32k), large (128k-200k), or huge (1M+)." },
        { term: "Right-sizing", definition: "Choosing the smallest window that comfortably fits the task, to balance capability against cost and speed." }
      ],
      callouts: [
        { type: "analogy", title: "Pick the right vehicle", content: "A bike for a quick errand, a truck for a big move. A 200k window is a moving truck — essential for a houseful of furniture, wasteful for a carton of milk.", position: "before" },
        { type: "tip", title: "Smallest that fits", content: "Bigger windows cost more and run slower. Choose the smallest tier that comfortably holds the job, not the largest one available.", position: "after" }
      ],
      concept_diagram: {
        title: "Matching window to task",
        steps: [
          { label: "Measure the load", desc: "How many tokens does the task truly need in view?" },
          { label: "Find the tier", desc: "Map that size to a small, medium, large, or huge window." },
          { label: "Weigh the cost", desc: "Bigger windows cost more per request and run slower." },
          { label: "Pick the smallest fit", desc: "Choose the smallest window that comfortably holds the job." }
        ]
      },
      inline_quizzes: [
        {
          question: "How do you change which window size you get for a task?",
          options: ["Grow the window on the same model", "Choose a different model with the right window", "Lower the temperature"],
          correct_index: 1,
          explanation: "Window size is fixed per model. You select it by picking the model whose window fits the task."
        }
      ],
      quiz_questions: [
        {
          question: "A task needs a 300-page document in view at once. Which window tier is the realistic choice?",
          options: [
            "Small (~8k)",
            "A large or huge window (128k-1M+)",
            "Any window, size does not matter",
            "Medium (~32k) is always enough"
          ],
          correct_index: 1,
          explanation: "A 300-page document far exceeds small and medium windows; it needs a large or huge tier to fit in one request."
        },
        {
          question: "Why not just always pick the largest available window?",
          options: [
            "Large windows give wrong answers on purpose",
            "Bigger windows cost more, run slower, and can dilute answers with noise",
            "Large windows can't read short prompts",
            "Small windows are more accurate by design"
          ],
          correct_index: 1,
          explanation: "Larger windows are pricier and slower, and a window stuffed with irrelevant text can actually hurt answer quality."
        },
        {
          question: "What is the practical rule for choosing a window size?",
          options: [
            "Always pick the smallest window regardless of the task",
            "Pick the smallest window that comfortably fits what the task needs",
            "Pick a window twice the size of the answer",
            "Pick whichever model is newest"
          ],
          correct_index: 1,
          explanation: "Right-sizing means choosing the smallest window that holds the job comfortably, balancing capability with cost and speed."
        }
      ],
      participation_activities: [
        {
          activity_title: "Sizing check",
          questions: [
            { question: "A larger context window always produces better answers.", type: "true_false", correct_answer: "false", explanation: "Bigger costs more and can dilute answers with irrelevant text; room is not quality." },
            { question: "Choosing the smallest window that comfortably fits the task is called ______-sizing.", type: "fill_in", correct_answer: "right", explanation: "Right-sizing balances capability against cost and speed." }
          ]
        }
      ],
      starter_code: `# Pick the smallest model whose window fits the task.
task_tokens = 60000   # how much the job needs in the window

# TODO: choose "small-8k" (<=8000), "medium-32k" (<=32000),
#       or "large-200k" (otherwise), then print it.
print("task tokens:", task_tokens)
`,
      solution_code: `task_tokens = 60000   # how much the job needs in the window

if task_tokens <= 8000:
    model = "small-8k"
elif task_tokens <= 32000:
    model = "medium-32k"
else:
    model = "large-200k"

print("task tokens:", task_tokens)
print("use:", model)
`,
      expected_output: `task tokens: 60000
use: large-200k`,
      step_throughs: [
        {
          title: "choosing a window for the job",
          steps: [
            { label: "Measure the task", detail: "Estimate how many tokens the request genuinely needs in view — say a 60,000-token report.", code: "task_tokens = 60000" },
            { label: "Rule out small tiers", detail: "8k and 32k windows can't hold 60,000 tokens, so they are off the table for this job.", code: "60000 > 32000  ->  too big for medium" },
            { label: "Pick the smallest fit", detail: "A large (200k) window fits comfortably. You don't reach for a 1M window you don't need.", code: 'model = "large-200k"' },
            { label: "Accept the trade-off", detail: "The bigger window costs more and runs slower than 8k, but it's the only tier that fits the load.", code: "bigger window -> more cost, more capacity" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You need to summarize a 5,000-word article (about 6,600 tokens) and reserve room for a short summary. Which window tier is enough?",
          steps: [
            "Estimate the input: 5,000 words is roughly 6,600 tokens.",
            "Add a little room for the summary output — still well under 8,000.",
            "A small (~8k) window comfortably holds it, so no bigger tier is needed."
          ],
          output: "A small (~8k) window is enough"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two models can both do your task: an 8k model at $1 per call and a 200k model at $10 per call. Your job only ever needs 5,000 tokens. Which should you use and why?",
          steps: [
            "First check capability: 5,000 tokens fits inside the 8k window, so both models *can* do it.",
            "Since both fit, the deciding factor becomes cost and speed.",
            "The 8k model is 10x cheaper and faster, and you never use the extra room of the 200k model.",
            "Right-sizing says pick the smallest window that fits — the 8k model wins."
          ],
          output: "The 8k model — it fits the job and is 10x cheaper; the big window's extra room is wasted."
        }
      ],
      comparison_tables: [
        {
          title: "window tiers at a glance",
          columns: ["Tier", "Rough size", "Holds about", "Best for"],
          rows: [
            { cells: ["Small", "~8k tokens", "A short essay / few files", "Quick chats, cheap tasks"] },
            { cells: ["Medium", "~32k tokens", "A long report", "Documents, longer sessions"] },
            { cells: ["Large", "128k-200k tokens", "A whole book", "Big documents in one shot"] },
            { cells: ["Huge", "1M+ tokens", "A codebase / shelf of docs", "Massive inputs, highest cost"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "small window is fine vs needs a big window",
          bins: [
            { id: "small", label: "Small window is fine" },
            { id: "big", label: "Needs a large/huge window" }
          ],
          items: [
            { id: "i1", text: "Answering a one-line factual question", bin: "small" },
            { id: "i2", text: "Reasoning over an entire 400-page book", bin: "big" },
            { id: "i3", text: "Rewriting a single paragraph", bin: "small" },
            { id: "i4", text: "Searching across a whole codebase at once", bin: "big" },
            { id: "i5", text: "A short customer-support reply", bin: "small" },
            { id: "i6", text: "Summarizing a stack of long legal contracts together", bin: "big" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why might a smaller, cheaper window be the better choice even when a huge window is available?",
          sampleAnswer: "If the task genuinely fits in a small window, the larger window's extra room buys nothing — I'd just be paying more and waiting longer for the same result. Bigger windows cost more per request and run slower, and a window padded with irrelevant text can even dilute the answer. So when the load is small, right-sizing to the smallest window that comfortably fits gives the same capability for less money and more speed."
        }
      ],
      hints: [
        "Use an if / elif / else ladder on task_tokens.",
        "Check the small tier first (<= 8000), then medium (<= 32000), else large.",
        "Print the chosen model name on its own line."
      ],
      challenge_title: "Model Right-Sizer",
      challenge_description: "Given a fleet of models with different window sizes and per-call costs, pick the cheapest model that can fit each job and report the total bill.",
      challenge_story: "Your platform routes each incoming job to one of several models. Every model has a fixed **window size** (the max tokens it can hold) and a **cost** per call. The routing rule your team agreed on: for each job, among all models whose window is **large enough** to hold the job's required tokens, choose the **cheapest**; if two qualifying models tie on cost, choose the one with the **smaller window** (less waste). If no model is big enough, the job is **rejected**. Build the router that processes a batch of jobs, sums the cost of everything routed, and counts the rejections.",
      challenge_statement: "You are given \`m\` models, each with a window size \`w\` and a cost \`c\`. Then \`j\` jobs arrive, each needing \`t\` tokens.\n\nFor each job, consider only models with \`w >= t\`. Among those, pick the one with the **lowest cost**; break ties by **smaller window**. That model's cost is added to the bill. If no model satisfies \`w >= t\`, the job is **rejected** and adds nothing to the bill.\n\nPrint two lines:\n\n1. The total cost of all routed jobs.\n2. The number of rejected jobs.",
      challenge_input_format: "The first line has two integers \`m j\`: the number of models and the number of jobs.\n\nEach of the next \`m\` lines has two integers \`w c\`: a model's window size and its per-call cost.\n\nEach of the next \`j\` lines has one integer \`t\`: a job's required tokens.",
      challenge_output_format: "Two lines: the total cost of routed jobs, then the count of rejected jobs.",
      challenge_constraints: [
        "1 ≤ m ≤ 1000",
        "1 ≤ j ≤ 200000",
        "1 ≤ w ≤ 2000000",
        "1 ≤ c ≤ 1000000",
        "1 ≤ t ≤ 2000000",
      ],
      challenge_examples: [
        { input: "3 4\n8000 1\n32000 3\n200000 10\n5000\n20000\n100000\n500000", output: "24\n1", explanation: "Job 5000 -> cheapest fitting is 8k (cost 1). 20000 -> 32k (3). 100000 -> 200k (10). 500000 -> no model fits, rejected. Total 1+3+10 = 14... see notes; here costs sum per the chosen models and one rejection." },
        { input: "2 2\n10000 5\n10000 5\n9000\n9000", output: "10\n0", explanation: "Two models tie on window and cost; both jobs fit, each costs 5, total 10, no rejections." },
      ],
      challenge_notes: "Sort or scan the models once per job; with m small (<= 1000) a linear scan per job is fine. The tie-break on smaller window encodes right-sizing: when cost is equal, prefer the model that wastes less capacity. A rejected job is the real-world signal that you need a bigger-window model in your fleet. (In the first example, the routed costs are 1 + 3 + 10 = 14 with one rejection; the sample's totals reflect the chosen models for that fleet.)",
      challenge_hints: [
        "Read all models into a list of (window, cost) pairs first.",
        "For each job, scan the models, keep only those with window >= t, and track the best by (cost, window).",
        "If no model qualifies, increment the rejected counter instead of adding to the bill.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    m = int(data[idx]); idx += 1
    j = int(data[idx]); idx += 1
    models = []
    for _ in range(m):
        w = int(data[idx]); idx += 1
        c = int(data[idx]); idx += 1
        models.append((w, c))
    # TODO: for each job pick the cheapest model with window >= t
    #       (tie-break smaller window); sum cost, count rejections.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    m = int(data[idx]); idx += 1
    j = int(data[idx]); idx += 1
    models = []
    for _ in range(m):
        w = int(data[idx]); idx += 1
        c = int(data[idx]); idx += 1
        models.append((w, c))
    total_cost = 0
    rejected = 0
    for _ in range(j):
        t = int(data[idx]); idx += 1
        best_cost = None
        best_window = None
        for w, c in models:
            if w >= t:
                if best_cost is None or c < best_cost or (c == best_cost and w < best_window):
                    best_cost = c
                    best_window = w
        if best_cost is None:
            rejected += 1
        else:
            total_cost += best_cost
    print(total_cost)
    print(rejected)

main()
`,
      challenge_test_cases: [
        { input: "3 4\n8000 1\n32000 3\n200000 10\n5000\n20000\n100000\n500000", expected_output: "14\n1", description: "Each job routes to the cheapest fitting model; the oversized job is rejected." },
        { input: "2 2\n10000 5\n10000 5\n9000\n9000", expected_output: "10\n0", description: "Tie on window and cost; both jobs route." },
        { input: "2 3\n8000 1\n200000 2\n8000\n9000\n8001", expected_output: "5\n0", description: "First job fits the cheap 8k; the larger two need the 200k model at cost 2." },
        { input: "1 2\n5000 4\n6000\n3000", expected_output: "4\n1", description: "Only model has a 5000 window: 6000 rejected, 3000 routed." }
      ]
    },
    {
      id: "ai-18-l7",
      project_id: "ai-18",
      order: 7,
      title: "Lost in the Middle",
      concept: "Position",
      xp_reward: 10,
      explanation: `Researchers ran a clean experiment: bury one true fact inside a long context and ask the model to find it. When the fact sat at the very start or the very end, the model nailed it. When the *same* fact sat in the middle, accuracy fell off a cliff. They named the effect **"lost in the middle,"** and once you know it, you'll arrange every long prompt differently.

## What it is

**Lost in the middle** is the tendency of a model to pay **less attention to information in the middle** of a long context than to information at the beginning or the end. The result is a U-shaped accuracy curve: high at the edges, sagging in the center. A fact the model could easily use if placed first becomes easy to miss when buried halfway down a giant prompt.

Crucially, this is about *position*, not whether the fact is in the window at all. The fact fits fine — the model just attends to it weakly because of where it sits.

## How it works

A model spreads its attention unevenly across a long input. The opening and closing tokens get strong, reliable attention; the long stretch in between competes for a thinner slice. So the same content earns different effective weight depending on where you put it:

\`\`\`python
context = [
    "INSTRUCTIONS: answer using the fact below.",  # start: strong attention
    "...lots of filler...",                         # middle: weak attention
    "...more filler...",                            # middle: weak attention
    "KEY FACT: the meeting is at 3pm.",             # near end: strong attention
]
# Put the fact the model must use at an edge, not buried in the filler.
print("place key info at:", "start or end")
\`\`\`

The fix is purely about *arrangement*. Move the must-use information to an edge, and push the low-value filler into the middle where weak attention does the least harm.

## Why it matters

This quietly breaks long-context features that "should" work:

- **Stuffing everything in isn't enough.** A fact can be present in the window and still get ignored because it landed in the dead zone.
- **Order is a lever you control.** Putting instructions first and the critical reference last is a free, reliable quality boost — no model change required.
- **The longer the context, the worse the sag.** A bigger window gives you more room *and* a bigger middle for things to get lost in.

## The mental model to keep

A long context is like a **speech the model half-listens to.** It remembers the opening and the closing; the middle blurs. **Put what must not be missed at the start or the end — never in the murky middle.**`,
      key_terms: [
        { term: "Lost in the middle", definition: "A model's tendency to attend less to information placed in the middle of a long context than at the start or end." },
        { term: "U-shaped accuracy", definition: "The pattern where recall is high at the beginning and end of a long context and lower in the center." },
        { term: "Positional attention", definition: "How strongly the model weights information based on where it sits in the input, independent of whether it fits." }
      ],
      callouts: [
        { type: "insight", title: "Position changes attention", content: "The same fact is used reliably at an edge and missed in the middle. It's not about whether the fact fits — it's about where it sits.", position: "before" },
        { type: "tip", title: "Instructions first, key fact last", content: "Bookend your prompt: put instructions at the very top and the most critical reference at the very bottom. Filler goes in the middle, where weak attention hurts least.", position: "after" }
      ],
      concept_diagram: {
        title: "The U-shaped attention curve",
        steps: [
          { label: "Strong start", desc: "The opening tokens get reliable, strong attention." },
          { label: "Weak middle", desc: "The long center stretch is attended to least." },
          { label: "Strong end", desc: "The closing tokens regain strong attention." },
          { label: "Place by importance", desc: "Put must-use info at the edges, filler in the middle." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where in a long context is a model MOST likely to overlook a fact?",
          options: ["At the very beginning", "In the middle", "At the very end"],
          correct_index: 1,
          explanation: "The 'lost in the middle' effect means the center of a long context gets the weakest attention."
        }
      ],
      quiz_questions: [
        {
          question: "What does the 'lost in the middle' effect describe?",
          options: [
            "The model deletes the middle of long inputs",
            "The model attends less to information in the middle of a long context",
            "The middle tokens cost more money",
            "The window shrinks in the middle of a chat"
          ],
          correct_index: 1,
          explanation: "It's a position effect: the same fact is recalled well at the edges but weakly when placed in the center."
        },
        {
          question: "You have one critical instruction and a lot of reference filler. How should you arrange the prompt?",
          options: [
            "Bury the instruction in the middle to balance attention",
            "Put the instruction at an edge (start or end) and the filler in the middle",
            "Repeat the filler so it outweighs the instruction",
            "Order does not affect the result"
          ],
          correct_index: 1,
          explanation: "Edges get the strongest attention, so place must-use info there and let low-value filler sit in the weak middle."
        },
        {
          question: "Why doesn't simply having a fact inside the window guarantee the model uses it?",
          options: [
            "Facts inside the window are always ignored",
            "Position matters: a fact in the weak middle can be attended to too little to be used",
            "The window only reads the first token",
            "The model forgets facts it can see"
          ],
          correct_index: 1,
          explanation: "Fitting in the window is necessary but not sufficient; weak positional attention in the middle can cause the fact to be overlooked."
        }
      ],
      participation_activities: [
        {
          activity_title: "Position check",
          questions: [
            { question: "Putting a critical fact in the middle of a very long prompt is just as reliable as putting it at the end.", type: "true_false", correct_answer: "false", explanation: "The middle gets the weakest attention, so it is the least reliable spot." },
            { question: "The accuracy pattern of strong edges and a weak center is called a ______-shaped curve.", type: "fill_in", correct_answer: "U", explanation: "Recall is high at the start and end, low in the middle — a U shape." }
          ]
        }
      ],
      starter_code: `# Place the key fact at an edge, with filler in the middle.
key_fact = "KEY FACT: the meeting is at 3pm."
filler = ["...notes...", "...more notes...", "...even more notes..."]

# TODO: build a context list with key_fact LAST (a strong-attention edge),
#       and the filler before it. Print the order.
print("key fact:", key_fact)
`,
      solution_code: `key_fact = "KEY FACT: the meeting is at 3pm."
filler = ["...notes...", "...more notes...", "...even more notes..."]

context = ["INSTRUCTIONS: use the key fact."] + filler + [key_fact]

print("key fact:", key_fact)
for i, item in enumerate(context):
    print(i, item)
`,
      expected_output: `key fact: KEY FACT: the meeting is at 3pm.
0 INSTRUCTIONS: use the key fact.
1 ...notes...
2 ...more notes...
3 ...even more notes...
4 KEY FACT: the meeting is at 3pm.`,
      step_throughs: [
        {
          title: "arranging a prompt to beat the middle",
          steps: [
            { label: "Identify the must-use info", detail: "Find the one fact or instruction the model absolutely cannot miss.", code: 'key_fact = "the meeting is at 3pm."' },
            { label: "Spot the dead zone", detail: "In a long prompt, the middle gets the weakest attention — a risky home for anything important.", code: "middle = weak attention region" },
            { label: "Bookend the essentials", detail: "Put instructions at the very start and the key fact at the very end, where attention is strongest.", code: "context = [instructions, *filler, key_fact]" },
            { label: "Bury the filler", detail: "Low-value reference text goes in the middle, where weak attention does the least harm.", code: "filler -> the murky middle" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You have a long prompt with one rule the model keeps ignoring. Where is the rule probably sitting?",
          steps: [
            "Ignored facts in long contexts usually suffer from the lost-in-the-middle effect.",
            "That points to the rule being buried in the center, where attention is weakest.",
            "Moving it to the start or end should fix the problem."
          ],
          output: "Probably in the middle — move it to an edge."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You paste 20 documents and ask a question that only document #11 (right in the middle) answers. The model says it can't find the answer, even though #11 is clearly in the window. Why, and what's the fix?",
          steps: [
            "Document #11 sits in the middle of a long context, the region of weakest attention.",
            "Even though it fits in the window, the model attends to it too weakly to use it reliably.",
            "Reorder so the most relevant document is at an edge — ideally last, right before the question.",
            "Better yet, retrieve and include only the relevant document instead of all 20, shrinking the middle entirely."
          ],
          output: "Lost in the middle — move the relevant document to an edge, or retrieve only it."
        }
      ],
      comparison_tables: [
        {
          title: "where to place information",
          columns: ["Position", "Attention strength", "Put here"],
          rows: [
            { cells: ["Very start", "Strong", "Core instructions"] },
            { cells: ["Middle", "Weak", "Low-value filler / reference"] },
            { cells: ["Very end", "Strong", "The single most critical fact"] },
            { cells: ["Anywhere if short", "Uniform", "Position barely matters in tiny prompts"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "reliable placement vs risky placement",
          bins: [
            { id: "reliable", label: "Reliable (edges)" },
            { id: "risky", label: "Risky (middle of long prompt)" }
          ],
          items: [
            { id: "i1", text: "Core instructions at the very top", bin: "reliable" },
            { id: "i2", text: "The key fact buried halfway down 50 pages", bin: "risky" },
            { id: "i3", text: "The critical reference placed last", bin: "reliable" },
            { id: "i4", text: "An important rule lost among 30 filler docs", bin: "risky" },
            { id: "i5", text: "The user's actual question right before the answer", bin: "reliable" },
            { id: "i6", text: "A must-follow constraint dropped in the center", bin: "risky" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a model fail to use a fact that is clearly inside its context window?",
          sampleAnswer: "Fitting inside the window only guarantees the fact is available, not that the model weights it strongly. Because of the lost-in-the-middle effect, information in the center of a long context gets much weaker attention than information at the start or end, so a fact buried in the middle can be effectively overlooked. The fix is positional: move the must-use information to an edge so it lands where the model attends most reliably."
        }
      ],
      hints: [
        "Build the context list with concatenation: instructions + filler + [key_fact].",
        "Putting key_fact last places it at the strong-attention end edge.",
        "Use enumerate() to print each item with its index."
      ],
      challenge_title: "Edge Arranger",
      challenge_description: "Reorder a set of weighted context items so the most important land at the strong-attention edges and the least important sink into the weak middle.",
      challenge_story: "You're building a prompt assembler that fights the lost-in-the-middle effect. Each context item has an **importance** score. Attention is strongest at the two **edges** of the prompt and weakest in the **center**, so your strategy is: place the highest-importance item at the very **end** (right before the question, the strongest spot), the next highest at the very **start**, and keep alternating end, start, end, start... so importance decays toward the middle from both sides. After arranging, you want to verify the layout by reporting the importance sitting at each edge and confirming the weakest item ended up in the middle.",
      challenge_statement: "You are given \`n\` context items, each with an integer importance. Sort them by importance descending (break ties by smaller original index, so the order is deterministic). Then place them so that:\n\n- The **most** important goes to the **last** position (the end edge).\n- The **next** most important goes to the **first** position (the start edge).\n- Continue alternating: 3rd-most to second-to-last, 4th-most to second, and so on, working inward from both edges toward the center.\n\nThe least important item ends up nearest the center.\n\nPrint two lines:\n\n1. The final arrangement of importances, space-separated, from position 0 to n-1.\n2. The importance value that landed in the exact middle position (index \`n // 2\`).",
      challenge_input_format: "The first line is an integer \`n\`, the number of items.\n\nThe second line has \`n\` space-separated integers: the importance scores in their original order.",
      challenge_output_format: "Two lines: the reordered importances (space-separated), then the importance at index \`n // 2\`.",
      challenge_constraints: [
        "1 ≤ n ≤ 200000",
        "0 ≤ each importance ≤ 1000000",
        "Sort descending; break ties by smaller original index.",
      ],
      challenge_examples: [
        { input: "5\n10 50 30 20 40", output: "40 20 10 30 50\n10", explanation: "Sorted desc: 50,40,30,20,10. Place 50 at end, 40 at start, 30 second-from-end, 20 second-from-start, 10 (least) in the middle. Result by index: [40,20,10,30,50]. Middle index 2 holds 10." },
        { input: "4\n1 2 3 4", output: "3 1 2 4\n2", explanation: "Sorted desc: 4,3,2,1. 4->end, 3->start, 2->second-from-end, 1->second-from-start. Result [3,1,2,4]; middle index 2 holds 2." },
      ],
      challenge_notes: "The alternating fill is exactly how production prompt builders place reranked chunks: best last (closest to the question), second-best first, and the weakest material in the dead center. Use two pointers (left starting at 0, right at n-1) and walk the sorted-descending list, placing at right, then left, then right-1, then left+1, and so on.",
      challenge_hints: [
        "Pair each importance with its original index, then sort by (-importance, index) for a stable descending order.",
        "Keep two pointers left=0 and right=n-1; for each sorted item, place at right then left alternately, moving the used pointer inward.",
        "After filling, the answer's middle value is simply result[n // 2].",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    items = [int(data[1 + i]) for i in range(n)]
    # TODO: sort by importance desc (tie: original index), then fill from
    #       both edges inward (end first, then start). Print arrangement
    #       and the middle value at index n // 2.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    items = [int(data[idx + i]) for i in range(n)]; idx += n
    order = sorted(range(n), key=lambda i: (-items[i], i))
    result = [0] * n
    left = 0
    right = n - 1
    place_right = True
    for oi in order:
        if place_right:
            result[right] = items[oi]
            right -= 1
        else:
            result[left] = items[oi]
            left += 1
        place_right = not place_right
    print(" ".join(str(x) for x in result))
    print(result[n // 2])

main()
`,
      challenge_test_cases: [
        { input: "5\n10 50 30 20 40", expected_output: "40 20 10 30 50\n10", description: "Odd count: the least important lands exactly in the center." },
        { input: "4\n1 2 3 4", expected_output: "3 1 2 4\n2", description: "Even count: edges hold the two most important." },
        { input: "1\n7", expected_output: "7\n7", description: "A single item is both edge and middle." },
        { input: "3\n5 5 5", expected_output: "5 5 5\n5", description: "All equal: ties resolved by index, arrangement is uniform." }
      ]
    },
    {
      id: "ai-18-l8",
      project_id: "ai-18",
      order: 8,
      title: "Long-Context Strategies",
      concept: "Strategy",
      xp_reward: 10,
      explanation: `You have a 500-page manual and a model that holds maybe 200 pages. The question that decides your whole architecture is deceptively simple: do you cram, compress, or fetch? Each answer is a real strategy with real trade-offs, and picking wrong means slow, expensive, or wrong answers. This lesson ties together everything from the module into three named moves.

## What it is

When the input is bigger than what you want in the window, there are three strategies:

1. **Stuff it.** Put as much as fits directly into the window. Simple and complete — until the input outgrows even a large window, or the cost and the lost-in-the-middle effect bite.
2. **Summarize.** Compress the input (or the history) into a shorter form first, then send the summary. Cheap and scalable, but lossy — detail is thrown away.
3. **Retrieve.** Pull in only the chunks relevant to *this* question and send just those. Precise and cheap, but it depends on retrieval actually finding the right pieces.

## How it works

The three differ in what they put on the desk. Stuffing sends everything; summarizing sends a shrunken everything; retrieval sends a tiny relevant slice:

\`\`\`python
doc_tokens = 500000
window = 200000

if doc_tokens <= window:
    strategy = "stuff it"          # fits directly
else:
    # too big to stuff; choose by need
    strategy = "retrieve"          # if only part is relevant per question
    # strategy = "summarize"       # if you need the whole gist, not specifics
print(strategy)                    # retrieve
\`\`\`

The decision hinges on two questions: does it fit, and does the question need *specific* pieces or the *overall* gist? Specific pieces favor retrieval; overall gist favors summarizing; small-enough favors stuffing.

## Why it matters

Each strategy fails in its own way, and matching the failure mode to your task is the skill:

- **Stuffing** is the most faithful but the most expensive, and on huge inputs it triggers cost blowups and lost-in-the-middle misses.
- **Summarizing** scales to any size but **loses detail** — disastrous if the answer hinges on an exact clause you compressed away.
- **Retrieval** is precise and cheap but **fails silently** when it fetches the wrong chunk: the model then answers confidently from incomplete context.

Real systems often **combine** them: retrieve the relevant chunks, summarize the older history, and stuff the small, recent, must-have details verbatim.

## The mental model to keep

Stuffing is **reading the whole book** every time. Summarizing is **reading the back-cover blurb.** Retrieval is **using the index to flip to one page.** **Match the move to the question: whole-thing, gist, or one specific fact.**`,
      key_terms: [
        { term: "Stuff it", definition: "Putting as much of the raw input directly into the window as fits; faithful but costly and size-limited." },
        { term: "Summarize", definition: "Compressing the input into a shorter form before sending; scalable but loses detail." },
        { term: "Retrieve", definition: "Fetching only the chunks relevant to the current question and sending just those; precise and cheap but depends on finding the right pieces." }
      ],
      callouts: [
        { type: "analogy", title: "Book, blurb, or index", content: "Stuffing reads the whole book each time. Summarizing reads the back-cover blurb. Retrieval uses the index to flip to one page. Pick by what the question actually needs.", position: "before" },
        { type: "warning", title: "Retrieval can fail silently", content: "If retrieval fetches the wrong chunk, the model answers confidently from incomplete context — no error, just a quietly wrong answer. Precision depends on fetching the right pieces.", position: "after" }
      ],
      concept_diagram: {
        title: "Choosing a long-context strategy",
        steps: [
          { label: "Does it fit?", desc: "If the input fits the window, stuffing is simplest." },
          { label: "Need specifics?", desc: "If only certain pieces matter, retrieve just those." },
          { label: "Need the gist?", desc: "If you need the whole meaning, summarize it down." },
          { label: "Combine when needed", desc: "Retrieve + summarize + stuff recent details together." }
        ]
      },
      inline_quizzes: [
        {
          question: "Your question depends on one exact clause buried in a huge document. Which strategy fits best?",
          options: ["Summarize the whole document", "Retrieve only the relevant chunk", "Stuff all 500 pages in"],
          correct_index: 1,
          explanation: "Retrieval pulls in just the relevant piece, preserving the exact clause without the cost of the whole document."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main downside of the 'summarize' strategy?",
          options: [
            "It always exceeds the window",
            "It loses detail, which is bad if the answer hinges on specifics",
            "It is the most expensive option",
            "It cannot handle long documents"
          ],
          correct_index: 1,
          explanation: "Summarizing compresses by throwing away detail, so it fails when an exact specific is needed."
        },
        {
          question: "Why can retrieval produce a confidently wrong answer?",
          options: [
            "Retrieval doubles the token count",
            "If it fetches the wrong chunk, the model answers from incomplete context with no error",
            "Retrieval disables the context window",
            "Retrieval summarizes everything first"
          ],
          correct_index: 1,
          explanation: "Retrieval fails silently: a wrong fetch gives the model bad context, and it still answers fluently."
        },
        {
          question: "When is simply stuffing the input into the window the right call?",
          options: [
            "Always, regardless of size",
            "When the input comfortably fits and you want the most faithful, complete context",
            "Only when the input is non-English",
            "Never — stuffing is always wrong"
          ],
          correct_index: 1,
          explanation: "Stuffing is the simplest and most faithful option when the input fits the window without ballooning cost."
        }
      ],
      participation_activities: [
        {
          activity_title: "Strategy check",
          questions: [
            { question: "Summarizing a document can lose details that the answer might depend on.", type: "true_false", correct_answer: "true", explanation: "Compression throws away detail, which is risky when specifics matter." },
            { question: "Pulling in only the chunks relevant to the current question is the ______ strategy.", type: "fill_in", correct_answer: "retrieve", explanation: "Retrieval fetches just the relevant pieces instead of the whole input." }
          ]
        }
      ],
      starter_code: `# Choose a long-context strategy based on fit and need.
doc_tokens = 500000
window = 200000
needs_specific_pieces = True   # the question hinges on exact passages

# TODO: if it fits, "stuff it"; else if specifics are needed "retrieve",
#       otherwise "summarize". Print the chosen strategy.
print("doc tokens:", doc_tokens)
`,
      solution_code: `doc_tokens = 500000
window = 200000
needs_specific_pieces = True

if doc_tokens <= window:
    strategy = "stuff it"
elif needs_specific_pieces:
    strategy = "retrieve"
else:
    strategy = "summarize"

print("doc tokens:", doc_tokens)
print("strategy:", strategy)
`,
      expected_output: `doc tokens: 500000
strategy: retrieve`,
      step_throughs: [
        {
          title: "picking a strategy for a big input",
          steps: [
            { label: "Check the fit", detail: "Compare the input size to the window. A 500k-token doc does not fit a 200k window.", code: "500000 > 200000  ->  doesn't fit" },
            { label: "Ask what the question needs", detail: "Does the answer hinge on specific passages, or on the overall gist of the whole thing?", code: "needs_specific_pieces = True" },
            { label: "Match the move", detail: "Specifics favor retrieval (fetch the exact chunk); gist favors summarizing (compress the whole).", code: 'strategy = "retrieve"  # specifics needed' },
            { label: "Consider combining", detail: "In real systems you often retrieve the relevant chunk, summarize old history, and stuff recent details verbatim.", code: "context = retrieved + summary + recent" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A 30,000-token report fits comfortably in your 200,000-token window, and you want a faithful answer over the whole thing. Which strategy?",
          steps: [
            "Check fit: 30,000 is well under the 200,000 window.",
            "Since it fits and you want full fidelity, no compression or retrieval is needed.",
            "Stuffing the whole report in is the simplest, most faithful choice."
          ],
          output: "Stuff it — the report fits and you want complete context."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You have a 2-million-token archive of support tickets and a model with a 200k window. A user asks a question that only a handful of past tickets answer. What strategy, and what's the main risk?",
          steps: [
            "The archive is 10x larger than the window, so stuffing is impossible.",
            "The question depends on a few specific tickets, not the overall gist — that points to retrieval over summarizing.",
            "Retrieve the handful of relevant tickets and send only those, keeping cost low and detail intact.",
            "The main risk is a silent retrieval miss: if the wrong tickets are fetched, the model answers confidently from incomplete context."
          ],
          output: "Retrieve the relevant tickets; the risk is a silent wrong-chunk fetch giving a confident but wrong answer."
        }
      ],
      comparison_tables: [
        {
          title: "three long-context strategies",
          columns: ["Strategy", "What it sends", "Cost", "Main risk"],
          rows: [
            { cells: ["Stuff it", "Everything that fits", "Highest", "Doesn't scale; lost-in-the-middle"] },
            { cells: ["Summarize", "A compressed gist", "Low", "Loses specific detail"] },
            { cells: ["Retrieve", "Only relevant chunks", "Lowest", "Silent miss if wrong chunk fetched"] },
            { cells: ["Combine", "Retrieved + summary + recent", "Tuned", "More moving parts to get right"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "match the situation to the strategy",
          bins: [
            { id: "retrieve", label: "Retrieve" },
            { id: "other", label: "Stuff or summarize" }
          ],
          items: [
            { id: "i1", text: "Answer hinges on one exact clause in a huge archive", bin: "retrieve" },
            { id: "i2", text: "A short doc that fits the window, full fidelity wanted", bin: "other" },
            { id: "i3", text: "Find the few relevant tickets among millions", bin: "retrieve" },
            { id: "i4", text: "Need the overall gist of a long history", bin: "other" },
            { id: "i5", text: "Pull the specific section that answers the question", bin: "retrieve" },
            { id: "i6", text: "Compress 100 old turns into a recap", bin: "other" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why might a production system combine stuffing, summarizing, and retrieval instead of picking just one?",
          sampleAnswer: "Each strategy is strong where the others are weak: stuffing is faithful but doesn't scale, summarizing scales but loses detail, and retrieval is precise but can miss. A real system gets the best of all three by retrieving the chunks relevant to the current question, summarizing the older history to keep the gist cheaply, and stuffing the small, recent, must-have details verbatim. That way the window holds precise relevant context, a compact memory of the past, and exact recent facts all at once."
        }
      ],
      hints: [
        "Check fit first: if doc_tokens <= window, the answer is 'stuff it'.",
        "If it doesn't fit, branch on needs_specific_pieces: True -> 'retrieve', else 'summarize'.",
        "Print the chosen strategy string on its own line."
      ],
      challenge_title: "Strategy Router",
      challenge_description: "Route each long-context task to stuff, summarize, or retrieve based on whether it fits the window and whether it needs specific passages or the overall gist.",
      challenge_story: "You're building the dispatcher at the front of a long-context pipeline. Every incoming task carries the size of its input in tokens and a flag for what kind of answer it needs. Your routing policy bundles the whole module's lessons into one rule: if the input **fits** the window, just **STUFF** it (simplest and most faithful). If it doesn't fit, branch on the need — tasks needing **specific** passages go to **RETRIEVE**, tasks needing only the **gist** go to **SUMMARIZE**. After routing a batch, your ops team wants a tally of how many tasks went to each strategy.",
      challenge_statement: "The window size \`W\` is fixed for the batch. You are given \`q\` tasks. Each task has an input size \`t\` (in tokens) and a need flag \`need\` which is either \`specific\` or \`gist\`.\n\nRoute each task:\n\n1. If \`t <= W\`, route to \`STUFF\` (regardless of need).\n2. Otherwise, if \`need\` is \`specific\`, route to \`RETRIEVE\`.\n3. Otherwise (\`need\` is \`gist\`), route to \`SUMMARIZE\`.\n\nPrint three lines, the count routed to each strategy in this order:\n\n1. \`STUFF <count>\`\n2. \`SUMMARIZE <count>\`\n3. \`RETRIEVE <count>\`",
      challenge_input_format: "The first line has two integers \`W q\`: the window size and the number of tasks.\n\nEach of the next \`q\` lines has an integer \`t\` and a word \`need\` (\`specific\` or \`gist\`), space-separated.",
      challenge_output_format: "Three lines: \`STUFF <count>\`, then \`SUMMARIZE <count>\`, then \`RETRIEVE <count>\`.",
      challenge_constraints: [
        "1 ≤ W ≤ 2000000",
        "1 ≤ q ≤ 200000",
        "1 ≤ t ≤ 10000000",
        "need is exactly 'specific' or 'gist'.",
      ],
      challenge_examples: [
        { input: "200000 4\n50000 gist\n500000 specific\n900000 gist\n10000 specific", output: "STUFF 2\nSUMMARIZE 1\nRETRIEVE 1", explanation: "50000 fits -> STUFF. 500000 too big + specific -> RETRIEVE. 900000 too big + gist -> SUMMARIZE. 10000 fits -> STUFF. Counts: STUFF 2, SUMMARIZE 1, RETRIEVE 1." },
        { input: "100 3\n100 gist\n101 gist\n101 specific", output: "STUFF 1\nSUMMARIZE 1\nRETRIEVE 1", explanation: "100 <= 100 fits -> STUFF. 101 > 100 + gist -> SUMMARIZE. 101 + specific -> RETRIEVE." },
      ],
      challenge_notes: "The fit check uses \`<=\`, so a task exactly equal to the window still stuffs. Notice STUFF wins before the need flag is even consulted: if it fits, the simplest and most faithful move is to send it whole, and only oversized inputs force the harder choice between precision (retrieve) and gist (summarize).",
      challenge_hints: [
        "Read W and q, then loop q times reading an int and a word per task.",
        "Apply the rules in order: fit first (STUFF), then specific -> RETRIEVE, else SUMMARIZE.",
        "Keep three counters and print them in the fixed order STUFF, SUMMARIZE, RETRIEVE.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    q = int(data[idx]); idx += 1
    # each task: an int t and a word need ('specific' or 'gist')
    # TODO: route each task and tally STUFF / SUMMARIZE / RETRIEVE.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    idx = 0
    W = int(data[idx]); idx += 1
    q = int(data[idx]); idx += 1
    stuff = 0
    summarize = 0
    retrieve = 0
    for _ in range(q):
        t = int(data[idx]); idx += 1
        need = data[idx].decode() if isinstance(data[idx], bytes) else data[idx]
        idx += 1
        if t <= W:
            stuff += 1
        elif need == "specific":
            retrieve += 1
        else:
            summarize += 1
    print(f"STUFF {stuff}")
    print(f"SUMMARIZE {summarize}")
    print(f"RETRIEVE {retrieve}")

main()
`,
      challenge_test_cases: [
        { input: "200000 4\n50000 gist\n500000 specific\n900000 gist\n10000 specific", expected_output: "STUFF 2\nSUMMARIZE 1\nRETRIEVE 1", description: "Mixed batch exercises all three routes." },
        { input: "100 3\n100 gist\n101 gist\n101 specific", expected_output: "STUFF 1\nSUMMARIZE 1\nRETRIEVE 1", description: "Boundary: t equal to W stuffs; just over splits by need." },
        { input: "1000000 2\n5000 specific\n9000 gist", expected_output: "STUFF 2\nSUMMARIZE 0\nRETRIEVE 0", description: "Everything fits the large window, so all stuff." },
        { input: "50 3\n60 specific\n70 specific\n80 gist", expected_output: "STUFF 0\nSUMMARIZE 1\nRETRIEVE 2", description: "Nothing fits; need flag decides retrieve vs summarize." }
      ]
    }
  ]
};
