export default {
  project: {
    id: "ai-18",
    title: "The Context Window",
    description: "Understand the model's working memory — the token budget that holds your system prompt, chat history, message, and its answer, and what to do when it runs out.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 4,
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
    }
  ]
};
