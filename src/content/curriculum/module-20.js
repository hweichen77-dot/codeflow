export default {
  project: {
    id: "ai-20",
    title: "Reading Model Outputs",
    description: "Learn to read what a model API hands back: where the text lives, why generation stopped, and how many tokens it cost.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 4,
    tags: ["response", "finish-reason", "usage", "stop-sequence", "fundamentals"],
    order: 20,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-20-l1",
      project_id: "ai-20",
      order: 1,
      title: "The Response Object",
      concept: "Response anatomy",
      xp_reward: 10,
      explanation: `You call a model API, expecting it to hand you a sentence. Instead it hands you a box inside a box inside a box. The text you want is in there — buried under \`choices\`, then \`message\`, then \`content\`. Once you know the shape of that box, fishing out the answer is a one-liner. Until you do, it's a frustrating treasure hunt.

## What it is

A model API doesn't return a bare string. It returns a **response object** — a structured bundle (JSON over the wire, a dict in your code) that carries the generated text *plus* metadata about the call. The metadata is the point: it tells you why generation stopped, how many tokens you spent, which model answered, and more.

The generated text itself lives in a predictable nested path. For a chat-style API it's: the response has a list called **choices**, each choice has a **message**, and the message has the **content** string. That nesting exists because the API can return more than one candidate answer, and each answer is a structured message, not just raw text.

## How it works

Think of the response as a series of doors you open to reach the text:

\`\`\`python
resp = {
    "choices": [
        {"message": {"role": "assistant", "content": "Paris."},
         "finish_reason": "stop"}
    ],
    "usage": {"prompt_tokens": 8, "completion_tokens": 1, "total_tokens": 9}
}

text = resp["choices"][0]["message"]["content"]
print(text)   # Paris.
\`\`\`

Read that path left to right: \`choices\` (the list of answers) → \`[0]\` (the first answer) → \`message\` (the structured reply) → \`content\` (the actual string). Almost every chat API you'll touch follows this exact shape, so the access pattern \`resp["choices"][0]["message"]["content"]\` becomes muscle memory.

The sibling fields matter too. \`finish_reason\` sits next to \`message\` and explains *why* it stopped. \`usage\` sits at the top level and reports token counts. You'll dig into both in later lessons — for now, just know they ride along in the same box.

## Why it matters

Reaching for the wrong key is the number-one beginner bug:

- **Forgetting \`[0]\`.** \`choices\` is a *list*. Skip the index and you get the whole list, not a message, and the next key lookup explodes.
- **Confusing the layers.** \`resp["content"]\` doesn't exist; the content lives under \`message\`. The error you get ("KeyError") is just telling you which door you skipped.
- **Ignoring the metadata.** The text is only half the response. Real apps read \`finish_reason\` and \`usage\` on every call to stay correct and on budget.

## The mental model to keep

The response is **a wrapper, not a string.** The words you want are real, but they sit at the bottom of a known path: choices → first item → message → content. Learn that path once and every chat API stops being a maze.`,
      key_terms: [
        { term: "Response object", definition: "The structured bundle an API returns: the generated text plus metadata about the call." },
        { term: "choices", definition: "A list of candidate answers in the response; index 0 is the usual one you read." },
        { term: "content", definition: "The actual generated text string, nested inside each choice's message." }
      ],
      callouts: [
        { type: "analogy", title: "Boxes inside boxes", content: "The answer is a gift wrapped in three layers: choices, then message, then content. Open them in order and the text falls out. Skip a layer and you grab packaging instead of the gift.", position: "before" },
        { type: "insight", title: "It's a list, so index it", content: "choices is a list because the API can return several candidate answers. That's why you almost always write choices[0] — grab the first answer before reaching for its message.", position: "after" }
      ],
      concept_diagram: {
        title: "Reaching the text inside a response",
        steps: [
          { label: "Get the response", desc: "The API returns a structured object, not a bare string." },
          { label: "Open choices[0]", desc: "Index into the list of candidate answers; take the first." },
          { label: "Open message", desc: "Each choice holds a structured message with a role and content." },
          { label: "Read content", desc: "The content field is the actual generated text you wanted." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where does the generated text live in a chat-style response?",
          options: ["resp[\"content\"]", "resp[\"choices\"][0][\"message\"][\"content\"]", "resp[\"text\"]"],
          correct_index: 1,
          explanation: "The text is nested: choices is a list, take index 0, then its message, then the content string."
        }
      ],
      quiz_questions: [
        {
          question: "Why is choices a list rather than a single value?",
          options: [
            "To store the conversation history",
            "Because the API can return more than one candidate answer",
            "To hold the token counts",
            "Because lists are faster than dicts"
          ],
          correct_index: 1,
          explanation: "An API can be asked to produce several candidate completions, so choices is a list; you usually read index 0."
        },
        {
          question: "What does the metadata in a response object give you, beyond the text?",
          options: [
            "Nothing useful for normal calls",
            "Why generation stopped and how many tokens it used",
            "A copy of your API key",
            "The full training data of the model"
          ],
          correct_index: 1,
          explanation: "Fields like finish_reason and usage tell you why it stopped and what it cost — essential for correctness and budget."
        },
        {
          question: "You write resp[\"choices\"][\"message\"] and get an error. What's the fix?",
          options: [
            "Use resp[\"message\"] instead",
            "Index the list first: resp[\"choices\"][0][\"message\"]",
            "Convert the response to a string",
            "Add a usage key"
          ],
          correct_index: 1,
          explanation: "choices is a list, so you must index it (with [0]) before reaching the message inside a choice."
        }
      ],
      participation_activities: [
        {
          activity_title: "Response shape check",
          questions: [
            { question: "A chat API returns a bare string containing only the generated text.", type: "true_false", correct_answer: "false", explanation: "It returns a structured object; the text is nested under choices → message → content." },
            { question: "Because the API can return several answers, the field holding them, ______, is a list you must index.", type: "fill_in", correct_answer: "choices", explanation: "choices is a list, so you read choices[0] to get the first candidate." }
          ]
        }
      ],
      starter_code: `# A simulated API response (real APIs return this shape as JSON).
resp = {
    "choices": [
        {"message": {"role": "assistant", "content": "The capital of France is Paris."},
         "finish_reason": "stop"}
    ],
    "usage": {"prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15}
}

# TODO: pull the generated text out of the nested structure and print it.
print(resp)
`,
      solution_code: `resp = {
    "choices": [
        {"message": {"role": "assistant", "content": "The capital of France is Paris."},
         "finish_reason": "stop"}
    ],
    "usage": {"prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15}
}

text = resp["choices"][0]["message"]["content"]
print(text)
`,
      expected_output: `The capital of France is Paris.`,
      step_throughs: [
        {
          title: "opening the response, one layer at a time",
          steps: [
            { label: "Start with the response", detail: "The whole object is a dict. The text you want is not at the top level — it's nested deeper.", code: 'resp = {"choices": [...], "usage": {...}}' },
            { label: "Index choices[0]", detail: "choices is a list of candidate answers. Take the first one with [0] to get a single choice dict.", code: 'choice = resp["choices"][0]' },
            { label: "Open the message", detail: "Each choice holds a message dict with a role ('assistant') and the content string.", code: 'msg = choice["message"]' },
            { label: "Read the content", detail: "The content key holds the actual generated text. That's your answer.", code: 'text = msg["content"]  # "The capital of France is Paris."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Given resp = {"choices": [{"message": {"content": "Hi!"}}]}, what expression returns the string "Hi!"?',
          steps: [
            "choices is a list, so index the first element with [0].",
            "That element is a dict with a message key; open it.",
            "Inside message, the content key holds the string."
          ],
          output: 'resp["choices"][0]["message"]["content"]'
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A response has two candidate answers in choices. How do you read the SECOND one\'s text, and what breaks if you forget the index entirely?',
          steps: [
            "choices is a list, so the second answer is at index 1 (lists start at 0).",
            'Read it with resp["choices"][1]["message"]["content"].',
            'If you forget the index and write resp["choices"]["message"], Python tries to use a string key on a list.',
            "That raises a TypeError (list indices must be integers), telling you the index step was skipped."
          ],
          output: 'Second answer: resp["choices"][1]["message"]["content"]; skipping the index raises a TypeError.'
        }
      ],
      comparison_tables: [
        {
          title: "what each layer of the response holds",
          columns: ["Path piece", "Type", "What it is", "Why it's there"],
          rows: [
            { cells: ["resp", "dict", "The whole response object", "Bundles text plus metadata"] },
            { cells: ["[\"choices\"]", "list", "All candidate answers", "API can return more than one"] },
            { cells: ["[0]", "dict", "The first candidate", "The one you usually want"] },
            { cells: ["[\"message\"][\"content\"]", "str", "The generated text", "The actual answer you read"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "top-level fields vs nested-under-a-choice",
          bins: [
            { id: "top", label: "Lives at the top level of resp" },
            { id: "nested", label: "Lives inside a choice" }
          ],
          items: [
            { id: "i1", text: "choices", bin: "top" },
            { id: "i2", text: "usage", bin: "top" },
            { id: "i3", text: "message", bin: "nested" },
            { id: "i4", text: "content", bin: "nested" },
            { id: "i5", text: "finish_reason", bin: "nested" },
            { id: "i6", text: "model", bin: "top" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does an API wrap the generated text in a nested object instead of just returning the string?",
          sampleAnswer: "Because the text alone isn't the whole story. The API needs to tell you why it stopped, how many tokens you spent, and possibly offer more than one candidate answer. Wrapping the text in a structured object lets all of that ride along in one predictable shape, so you can read both the answer and the metadata from the same response."
        }
      ],
      hints: [
        "choices is a list — start by indexing it with [0].",
        "After choices[0], reach into the message dict, then its content key.",
        "Chain the keys: resp[\"choices\"][0][\"message\"][\"content\"]."
      ],
      challenge_title: "Extract text from two candidates",
      challenge_description: "A response has two answers in choices. Print the content of the first answer, then the content of the second answer, each on its own line.",
      challenge_starter_code: `resp = {
    "choices": [
        {"message": {"content": "Option A"}},
        {"message": {"content": "Option B"}},
    ]
}
# TODO: print the content of the first choice, then the second.
`,
      challenge_solution_code: `resp = {
    "choices": [
        {"message": {"content": "Option A"}},
        {"message": {"content": "Option B"}},
    ]
}

print(resp["choices"][0]["message"]["content"])
print(resp["choices"][1]["message"]["content"])
`,
      challenge_test_cases: [
        { input: "(no input)", expected_output: "Option A\nOption B", description: "Reads content from choice 0 then choice 1." }
      ]
    },
    {
      id: "ai-20-l2",
      project_id: "ai-20",
      order: 2,
      title: "Finish Reasons",
      concept: "Finish reason",
      xp_reward: 10,
      explanation: `Your model spits out a beautiful answer that ends mid-sentence: "...and the three main causes are first," — then nothing. Nobody hit a key. The model didn't crash. It hit a wall called the token limit, and a single field in the response told you exactly that. That field is the **finish_reason**, and reading it turns "why is my output broken?" into "oh, it got cut off."

## What it is

Every response carries a **finish_reason** — a short string explaining *why* generation stopped. The model produces tokens one at a time and needs a reason to quit. There are a handful of standard reasons, and each one means something different for how you should treat the output.

The common values:

- **stop** — the model finished naturally. It decided the answer was complete and emitted its end signal. This is the happy path.
- **length** — generation hit the maximum-length cap (the \`max_tokens\` limit). The answer is **cut off** mid-thought. Nothing is wrong with the model; you simply didn't give it enough room.
- **stop_sequence** — the model produced a string you told it to stop on (covered in lesson 4). It halted on purpose, at a boundary you defined.
- **content_filter** — the output was blocked by a safety filter. The text was withheld, not finished.

## How it works

You check the field that sits right next to the message:

\`\`\`python
resp = {
    "choices": [
        {"message": {"content": "The three causes are: first, supply..."},
         "finish_reason": "length"}
    ]
}

reason = resp["choices"][0]["finish_reason"]
if reason == "length":
    print("WARNING: answer was cut off — raise max_tokens")
else:
    print("OK:", reason)
\`\`\`

The key insight is what **length** means: the model wasn't done talking, it ran out of allowance. If you blindly use that truncated text, you ship a half-finished answer. The fix is to raise \`max_tokens\` and call again, or ask the model to continue.

Contrast that with **stop**: the model chose to end. The answer is whole. You can trust it's a complete thought.

## Why it matters

The finish_reason is your early-warning system:

- **It catches truncation silently.** A "length" answer often *looks* fine until the last line trails off. Checking the reason catches it before a user does.
- **It tells stop from blocked.** "content_filter" means there's no usable answer to show — handle it differently from a normal stop.
- **It guides retries.** "length" → give more room and retry. "stop" → you're done. The reason tells you which branch to take.

## The mental model to keep

The text tells you *what* the model said. The finish_reason tells you *whether to trust that it finished saying it.* Always read it. **"length" is not success — it's a cliff.**`,
      key_terms: [
        { term: "finish_reason", definition: "A short string in the response explaining why the model stopped generating." },
        { term: "stop", definition: "The model finished naturally and the answer is complete — the happy path." },
        { term: "length", definition: "Generation hit the max-token cap, so the answer is cut off mid-thought." }
      ],
      callouts: [
        { type: "analogy", title: "Did it finish, or run out of paper?", content: "Imagine someone writing on a fixed sheet. 'stop' means they finished and put the pen down. 'length' means they ran out of paper mid-sentence. Same handwriting — totally different completeness.", position: "before" },
        { type: "warning", title: "length means truncated", content: "A finish_reason of 'length' is NOT success. The model was still talking when it ran out of room. Raise max_tokens and retry, or you'll ship a chopped-off answer.", position: "after" }
      ],
      concept_diagram: {
        title: "Reading why generation stopped",
        steps: [
          { label: "Model generates tokens", desc: "It produces output one token at a time." },
          { label: "Something halts it", desc: "Natural end, the length cap, a stop string, or a filter." },
          { label: "Read finish_reason", desc: "The response records which of those caused the stop." },
          { label: "Act on it", desc: "stop = done; length = cut off, retry with more room." }
        ]
      },
      inline_quizzes: [
        {
          question: "A response comes back with finish_reason == \"length\". What does that mean?",
          options: ["The answer is complete", "The answer was cut off at the max-token limit", "The model was blocked by a safety filter"],
          correct_index: 1,
          explanation: "\"length\" means generation hit the max_tokens cap, so the output is truncated mid-thought."
        }
      ],
      quiz_questions: [
        {
          question: "Which finish_reason means the model decided the answer was complete?",
          options: ["length", "stop", "content_filter", "stop_sequence"],
          correct_index: 1,
          explanation: "\"stop\" is the natural completion — the model emitted its end signal on its own."
        },
        {
          question: "You see finish_reason == \"length\". What's the right response?",
          options: [
            "Ship the answer as-is; it's complete",
            "Raise max_tokens and call again, since the answer was truncated",
            "Lower the temperature",
            "Switch to a different API key"
          ],
          correct_index: 1,
          explanation: "\"length\" means the answer was cut off by the token cap; give it more room and retry."
        },
        {
          question: "Why should you read finish_reason on every call, not just the text?",
          options: [
            "It contains the API key",
            "It tells you whether the answer actually finished or was cut off / blocked",
            "It is required to print the content",
            "It speeds up the model"
          ],
          correct_index: 1,
          explanation: "The text alone can look fine while being truncated; finish_reason reveals truncation, blocks, and clean stops."
        }
      ],
      participation_activities: [
        {
          activity_title: "Finish reason check",
          questions: [
            { question: "A finish_reason of \"length\" means the model gave a complete, trustworthy answer.", type: "true_false", correct_answer: "false", explanation: "\"length\" means the answer was cut off at the max-token limit." },
            { question: "When the model finishes naturally and the answer is complete, the finish_reason is ______.", type: "fill_in", correct_answer: "stop", explanation: "\"stop\" is the natural-completion happy path." }
          ]
        }
      ],
      starter_code: `# Classify a response by its finish_reason.
resp = {
    "choices": [
        {"message": {"content": "Here are the steps: 1) gather data 2) clean it 3"},
         "finish_reason": "length"}
    ]
}

reason = resp["choices"][0]["finish_reason"]
# TODO: print "complete" if reason is "stop", else "cut off" if it is "length".
print("reason:", reason)
`,
      solution_code: `resp = {
    "choices": [
        {"message": {"content": "Here are the steps: 1) gather data 2) clean it 3"},
         "finish_reason": "length"}
    ]
}

reason = resp["choices"][0]["finish_reason"]
print("reason:", reason)
if reason == "stop":
    print("complete")
elif reason == "length":
    print("cut off")
`,
      expected_output: `reason: length
cut off`,
      step_throughs: [
        {
          title: "deciding whether to trust the output",
          steps: [
            { label: "Generation stops", detail: "The model has stopped producing tokens. You don't yet know if it finished or was interrupted.", code: 'content = "...the main causes are first,"' },
            { label: "Read the reason", detail: "Pull finish_reason from the choice. It sits next to the message.", code: 'reason = resp["choices"][0]["finish_reason"]  # "length"' },
            { label: "Interpret it", detail: "'length' means the token cap stopped it, so the answer is truncated — not a real ending.", code: 'reason == "length"  # answer was cut off' },
            { label: "Take action", detail: "Raise max_tokens and call again (or ask to continue) instead of shipping the partial text.", code: 'retry(max_tokens=512)  # give it more room' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A response has finish_reason == "stop". Is the answer complete?',
          steps: [
            '"stop" is the natural-completion signal.',
            "The model decided on its own that the answer was finished and emitted its end token.",
            "So yes — the text is a complete thought you can trust."
          ],
          output: "Yes, the answer finished naturally and is complete."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You asked for a 1,000-word essay but set max_tokens to 50. The response ends mid-sentence with finish_reason == \"length\". What happened and how do you fix it?",
          steps: [
            "max_tokens caps how many output tokens the model may produce.",
            "50 tokens is far short of a 1,000-word essay, so the model ran out of room mid-sentence.",
            "The finish_reason is 'length', confirming the cap (not a natural end) stopped it.",
            "Fix: raise max_tokens to a value large enough for the requested length, then call again."
          ],
          output: "The max_tokens cap truncated it; raise max_tokens and retry."
        }
      ],
      comparison_tables: [
        {
          title: "what each finish_reason tells you",
          columns: ["finish_reason", "Meaning", "Is the answer complete?", "What to do"],
          rows: [
            { cells: ["stop", "Model ended naturally", "Yes", "Use the answer"] },
            { cells: ["length", "Hit the max-token cap", "No — truncated", "Raise max_tokens, retry"] },
            { cells: ["stop_sequence", "Hit a stop string you set", "Yes, at your boundary", "Use it; trim the stop string if needed"] },
            { cells: ["content_filter", "Blocked by safety filter", "No — withheld", "Handle as a refusal, don't show partial"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "answer is usable vs answer is not complete",
          bins: [
            { id: "usable", label: "Answer is usable / complete" },
            { id: "incomplete", label: "Answer is NOT complete" }
          ],
          items: [
            { id: "i1", text: "finish_reason == \"stop\"", bin: "usable" },
            { id: "i2", text: "finish_reason == \"length\"", bin: "incomplete" },
            { id: "i3", text: "finish_reason == \"stop_sequence\"", bin: "usable" },
            { id: "i4", text: "finish_reason == \"content_filter\"", bin: "incomplete" },
            { id: "i5", text: "Output ended on its own end signal", bin: "usable" },
            { id: "i6", text: "Output trailed off at the token cap", bin: "incomplete" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is a 'length' finish_reason a more dangerous failure than an outright error?",
          sampleAnswer: "An error stops you cold and demands attention, but a 'length' truncation produces text that often looks complete — fluent sentences, a confident tone — right up until the last line trails off. If you don't check the finish_reason, you can silently ship a half-finished answer that the user only discovers when the important part is missing. It fails quietly, which is exactly why you have to look."
        }
      ],
      hints: [
        "finish_reason sits inside the choice, next to message: resp[\"choices\"][0][\"finish_reason\"].",
        "Use an if/elif to branch on the string value.",
        "\"stop\" prints complete; \"length\" prints cut off."
      ],
      challenge_title: "Flag truncated answers",
      challenge_description: "Given a list of responses (each a dict with a finish_reason), print 'OK' for each one whose finish_reason is 'stop', and 'TRUNCATED' for each one whose finish_reason is 'length'. One line per response, in order.",
      challenge_starter_code: `responses = [
    {"finish_reason": "stop"},
    {"finish_reason": "length"},
    {"finish_reason": "stop"},
]
# TODO: print "OK" or "TRUNCATED" for each, one per line.
`,
      challenge_solution_code: `responses = [
    {"finish_reason": "stop"},
    {"finish_reason": "length"},
    {"finish_reason": "stop"},
]

for r in responses:
    if r["finish_reason"] == "length":
        print("TRUNCATED")
    else:
        print("OK")
`,
      challenge_test_cases: [
        { input: "(no input)", expected_output: "OK\nTRUNCATED\nOK", description: "stop -> OK, length -> TRUNCATED, in order." }
      ]
    },
    {
      id: "ai-20-l3",
      project_id: "ai-20",
      order: 3,
      title: "Token Usage",
      concept: "Token usage",
      xp_reward: 10,
      explanation: `You build a chatbot, ship it, and at the end of the month get a bill that makes your stomach drop. Where did the money go? It went into tokens — and the response told you the count of every single one, every call, in a block you probably never read. That block is **usage**, and it's the difference between flying blind and knowing exactly what each request costs.

## What it is

Every response carries a top-level **usage** block: a small dict of token counts for that one call. Three numbers:

- **prompt_tokens** — the **input**: everything you sent (your prompt, system message, and any prior conversation re-fed in).
- **completion_tokens** — the **output**: everything the model generated in reply.
- **total_tokens** — the sum of the two. It should always equal prompt_tokens + completion_tokens.

These counts are the *real, exact* token usage for the call — not an estimate. They are the basis for two things you care about: **cost** (APIs bill per token) and **limits** (the input plus output must fit inside the context window).

## How it works

You read the usage block and do arithmetic on it:

\`\`\`python
resp = {
    "choices": [{"message": {"content": "Sure, here's a haiku..."}}],
    "usage": {"prompt_tokens": 12, "completion_tokens": 18, "total_tokens": 30}
}

usage = resp["usage"]
print("in:", usage["prompt_tokens"])
print("out:", usage["completion_tokens"])
print("total:", usage["total_tokens"])

# cost = input rate + output rate (output is usually pricier)
cost = usage["prompt_tokens"] / 1_000_000 * 3 \
     + usage["completion_tokens"] / 1_000_000 * 15
print(f"cost: \${cost:.6f}")
\`\`\`

Notice the split rates: input and output are billed at **different prices**, and output is usually several times more expensive than input. That's why the breakdown matters — a long answer can cost far more than a long question. Tracking \`completion_tokens\` is often where the real money hides.

## Why it matters

The usage block is your meter:

- **Real cost, not a guess.** Estimating tokens by character count is rough. usage gives you the exact count the provider billed you for.
- **Catch runaway prompts.** If you re-feed a growing conversation each turn, prompt_tokens climbs every call. Watching it spot-checks a ballooning bill before it surprises you.
- **Stay under the limit.** total_tokens must fit the context window. If it creeps toward the cap, you need to trim old messages or summarize.

## The mental model to keep

usage is the **receipt** for each call: input tokens, output tokens, total. Output costs more than input, so the answer — not the question — usually drives the bill. **Read the receipt every call and you'll never be surprised by it.**`,
      key_terms: [
        { term: "usage", definition: "A top-level block in the response reporting exact token counts for the call." },
        { term: "prompt_tokens", definition: "Input tokens: everything you sent the model, including re-fed conversation history." },
        { term: "completion_tokens", definition: "Output tokens: everything the model generated in its reply." }
      ],
      callouts: [
        { type: "analogy", title: "It's an itemized receipt", content: "usage is the receipt for one call: a line for input, a line for output, and a total. You wouldn't ignore the receipt at a store — don't ignore it on an API call either.", position: "before" },
        { type: "tip", title: "Output usually costs more", content: "Input and output are billed at different rates, and output is often 3-5x pricier per token. A short prompt with a long answer can cost more than a long prompt with a short answer.", position: "after" }
      ],
      concept_diagram: {
        title: "From usage block to cost and limits",
        steps: [
          { label: "Call returns usage", desc: "The response includes exact token counts for the call." },
          { label: "Read the three counts", desc: "prompt_tokens (in), completion_tokens (out), total_tokens." },
          { label: "Apply the rates", desc: "Input and output have different per-token prices; output is pricier." },
          { label: "Cost + fit", desc: "Sum gives the bill; total must fit inside the context window." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does completion_tokens count?",
          options: ["The tokens you sent in your prompt", "The tokens the model generated in its reply", "The size of the context window"],
          correct_index: 1,
          explanation: "completion_tokens is the output — everything the model produced in response."
        }
      ],
      quiz_questions: [
        {
          question: "What does prompt_tokens measure?",
          options: [
            "The model's reply length",
            "The input you sent, including any re-fed conversation history",
            "The maximum context window",
            "The number of API calls this month"
          ],
          correct_index: 1,
          explanation: "prompt_tokens is the input side: your prompt, system message, and any prior messages re-fed in."
        },
        {
          question: "Why does the input/output split in usage matter for cost?",
          options: [
            "Input and output are billed at different rates, with output usually pricier",
            "Only input tokens are ever billed",
            "The split has no effect on cost",
            "Output tokens are always free"
          ],
          correct_index: 0,
          explanation: "Providers charge different per-token rates for input and output; output typically costs several times more."
        },
        {
          question: "What must total_tokens stay under to avoid an error?",
          options: [
            "The temperature setting",
            "The model's context window",
            "The number of choices",
            "The finish_reason"
          ],
          correct_index: 1,
          explanation: "Input plus output (total_tokens) must fit inside the model's context window."
        }
      ],
      participation_activities: [
        {
          activity_title: "Usage block check",
          questions: [
            { question: "total_tokens should equal prompt_tokens plus completion_tokens.", type: "true_false", correct_answer: "true", explanation: "total is just the sum of the input and output token counts." },
            { question: "The input side of the usage block — everything you sent — is reported as ______ tokens.", type: "fill_in", correct_answer: "prompt", explanation: "prompt_tokens reports the input you sent to the model." }
          ]
        }
      ],
      starter_code: `# Read the usage block from a response.
resp = {
    "choices": [{"message": {"content": "A short haiku for you."}}],
    "usage": {"prompt_tokens": 12, "completion_tokens": 18, "total_tokens": 30}
}

usage = resp["usage"]
# TODO: print the input tokens, output tokens, and total tokens.
print(usage)
`,
      solution_code: `resp = {
    "choices": [{"message": {"content": "A short haiku for you."}}],
    "usage": {"prompt_tokens": 12, "completion_tokens": 18, "total_tokens": 30}
}

usage = resp["usage"]
print("input tokens:", usage["prompt_tokens"])
print("output tokens:", usage["completion_tokens"])
print("total tokens:", usage["total_tokens"])
`,
      expected_output: `input tokens: 12
output tokens: 18
total tokens: 30`,
      step_throughs: [
        {
          title: "turning a usage block into a cost",
          steps: [
            { label: "Grab the usage block", detail: "It sits at the top level of the response, alongside choices.", code: 'usage = resp["usage"]' },
            { label: "Read input and output", detail: "prompt_tokens is what you sent; completion_tokens is what the model wrote back.", code: 'usage["prompt_tokens"], usage["completion_tokens"]  # 12, 18' },
            { label: "Apply the two rates", detail: "Multiply each count by its own per-token price. Output is billed higher than input.", code: 'in_cost = 12/1e6*3;  out_cost = 18/1e6*15' },
            { label: "Sum to the bill", detail: "Add the input and output costs to get the price of this single call.", code: 'cost = in_cost + out_cost  # the receipt total' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A usage block reads {"prompt_tokens": 40, "completion_tokens": 10}. What is total_tokens?',
          steps: [
            "total_tokens is just the sum of input and output tokens.",
            "Add prompt_tokens (40) and completion_tokens (10).",
            "40 + 10 = 50."
          ],
          output: "total_tokens = 50"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A call uses 200 prompt_tokens and 800 completion_tokens. Input is $3/1M, output is $15/1M. What's the cost, and which side dominates?",
          steps: [
            "Input cost = 200 / 1,000,000 × $3 = $0.0006.",
            "Output cost = 800 / 1,000,000 × $15 = $0.012.",
            "Output is both more tokens AND a higher rate, so it dwarfs the input cost.",
            "Total = $0.0006 + $0.012 = $0.0126."
          ],
          output: "$0.012600 per call; output tokens dominate the bill."
        }
      ],
      comparison_tables: [
        {
          title: "the three numbers in a usage block",
          columns: ["Field", "Side", "What it counts", "Cost role"],
          rows: [
            { cells: ["prompt_tokens", "Input", "Your prompt + re-fed history", "Billed at the input rate"] },
            { cells: ["completion_tokens", "Output", "The model's generated reply", "Billed at the higher output rate"] },
            { cells: ["total_tokens", "Both", "prompt + completion", "Must fit the context window"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "counted as input vs counted as output",
          bins: [
            { id: "input", label: "Counts toward prompt_tokens (input)" },
            { id: "output", label: "Counts toward completion_tokens (output)" }
          ],
          items: [
            { id: "i1", text: "Your typed question", bin: "input" },
            { id: "i2", text: "The system prompt you set", bin: "input" },
            { id: "i3", text: "The model's generated answer", bin: "output" },
            { id: "i4", text: "Earlier messages re-fed each turn", bin: "input" },
            { id: "i5", text: "The poem the model wrote back", bin: "output" },
            { id: "i6", text: "A document you pasted into the prompt", bin: "input" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: in a long multi-turn chatbot, why does prompt_tokens tend to grow every turn, and why should that worry you?",
          sampleAnswer: "Each new turn usually re-sends the whole conversation so far as context, so the input grows with every message — prompt_tokens climbs steadily even if your new message is short. That should worry you because you're paying for that entire history on every single call, so cost per turn keeps rising and the total can eventually bump against the context window. Watching prompt_tokens tells you when to trim or summarize old messages."
        }
      ],
      hints: [
        "The usage block is at the top level: resp[\"usage\"].",
        "Read the three keys: prompt_tokens, completion_tokens, total_tokens.",
        "Print each on its own line with a label."
      ],
      challenge_title: "Compute call cost from usage",
      challenge_description: "Given a usage block, compute the cost of the call. Input is billed at $3 per million tokens, output at $15 per million tokens. Print the total formatted to 6 decimal places, like 'cost: $0.000xyz'.",
      challenge_starter_code: `usage = {"prompt_tokens": 1000, "completion_tokens": 500, "total_tokens": 1500}
# Input: $3 per 1,000,000 tokens. Output: $15 per 1,000,000 tokens.
# TODO: compute the total cost and print it to 6 decimal places.
`,
      challenge_solution_code: `usage = {"prompt_tokens": 1000, "completion_tokens": 500, "total_tokens": 1500}

input_cost = usage["prompt_tokens"] / 1_000_000 * 3
output_cost = usage["completion_tokens"] / 1_000_000 * 15
total = input_cost + output_cost

print(f"cost: \${total:.6f}")
`,
      challenge_test_cases: [
        { input: "prompt=1000, completion=500", expected_output: "cost: $0.010500", description: "1000 input ($0.003) + 500 output ($0.0075) = $0.0105." }
      ]
    },
    {
      id: "ai-20-l4",
      project_id: "ai-20",
      order: 4,
      title: "Stop Sequences",
      concept: "Stop sequence",
      xp_reward: 10,
      explanation: `You ask a model to fill in one Q&A pair, but it cheerfully rolls right past it — inventing a second question, a third, a whole imaginary interview. You only wanted the first answer. The clean fix isn't a longer prompt; it's a tripwire. Tell the API: the moment you generate the string "Q:", stop. That tripwire is a **stop sequence**, and it gives you surgical control over where output ends.

## What it is

A **stop sequence** is a string you hand the API that says: "if you're about to produce this, halt immediately." The moment the model generates that string, generation stops — and (on most APIs) the stop string itself is *not* included in the returned content. You get everything up to it, cleanly cut.

You can supply one or several. They're a deliberate boundary you define, as opposed to the model's own natural ending. When a stop sequence fires, the response's finish_reason becomes \`stop_sequence\` (or similar), telling you the halt was triggered by your tripwire rather than a natural stop or the length cap.

## How it works

Here's the idea simulated in plain Python — split the model's would-be output at the first stop string:

\`\`\`python
def generate_with_stop(full_output, stop):
    # The model would have produced full_output, but we stop at 'stop'.
    idx = full_output.find(stop)
    if idx == -1:
        return full_output, "stop"        # never hit it: natural end
    return full_output[:idx], "stop_sequence"  # cut at the tripwire

raw = "Paris.\\nQ: What is the capital of Spain?"
text, reason = generate_with_stop(raw, "\\nQ:")
print(repr(text))    # 'Paris.'
print(reason)        # stop_sequence
\`\`\`

The model *would* have kept going into a second question, but the stop sequence \`"\\nQ:"\` chopped it off the instant that pattern appeared. You're left with exactly the first answer, and the finish_reason tells you why.

Two classic uses:

- **End output cleanly.** In a "Q: ... A: ..." format, set "\\nQ:" as a stop so the model answers one question and doesn't fabricate the next.
- **Carve structured responses.** When you want just one field, item, or line, a stop sequence trims everything after the boundary you care about.

## Why it matters

Stop sequences buy you precision without post-processing:

- **No runaway generation.** They prevent the model from continuing past the part you actually want.
- **Cleaner parsing.** Output ends exactly at a known marker, so you don't have to strip trailing junk yourself.
- **Cheaper calls.** Stopping early means fewer completion_tokens — you don't pay for text you'd throw away.

The catch: choose a stop string that *won't* appear in the legitimate answer, or you'll cut the output short by accident.

## The mental model to keep

A stop sequence is a **tripwire you plant in the output stream.** The model walks forward generating tokens; the instant it steps on your wire, it halts and hands you everything up to that point. **You decide where the answer ends — not the model.**`,
      key_terms: [
        { term: "Stop sequence", definition: "A string that, when the model is about to generate it, forces generation to halt immediately." },
        { term: "stop_sequence (finish_reason)", definition: "The finish_reason value indicating a stop string you defined triggered the halt." },
        { term: "Structured response", definition: "Output carved into a known shape, often by stopping generation at a defined boundary." }
      ],
      callouts: [
        { type: "analogy", title: "A tripwire in the output", content: "Picture a tripwire stretched across the model's path. It keeps generating tokens until it steps on the wire — then it halts instantly and hands you everything before it. You chose where to plant the wire.", position: "before" },
        { type: "warning", title: "Don't pick a string that appears in the answer", content: "If your stop sequence shows up inside a legitimate answer, generation halts there and chops the output short. Choose a marker the real content won't contain — like a label such as '\\nQ:'.", position: "after" }
      ],
      concept_diagram: {
        title: "How a stop sequence cuts output",
        steps: [
          { label: "You set a stop string", desc: "Hand the API one or more strings to halt on." },
          { label: "Model generates tokens", desc: "It produces output one token at a time as usual." },
          { label: "Stop string appears", desc: "The moment that pattern is about to be produced, generation halts." },
          { label: "Return text before it", desc: "You get everything up to the stop string; finish_reason marks it." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a stop sequence do?",
          options: ["Speeds up token generation", "Forces generation to halt when the model is about to produce that string", "Adds the string to the end of the output"],
          correct_index: 1,
          explanation: "A stop sequence halts generation the moment the model would produce it; the string itself is usually not included."
        }
      ],
      quiz_questions: [
        {
          question: "When a stop sequence fires, what is usually true of the returned content?",
          options: [
            "The stop string is appended to the end",
            "The content stops just before the stop string, which is not included",
            "The content is empty",
            "The content includes the stop string twice"
          ],
          correct_index: 1,
          explanation: "On most APIs the output is cut just before the stop string, and the stop string itself is excluded."
        },
        {
          question: "What finish_reason indicates a stop sequence triggered the halt?",
          options: ["length", "stop_sequence", "content_filter", "prompt_tokens"],
          correct_index: 1,
          explanation: "A stop-string-triggered halt is reported as stop_sequence (distinct from a natural stop or a length cap)."
        },
        {
          question: "What's the risk of a poorly chosen stop sequence?",
          options: [
            "It makes the model slower",
            "It might appear inside a real answer and cut the output short",
            "It increases the token cost",
            "It changes the model's weights"
          ],
          correct_index: 1,
          explanation: "If the stop string occurs in legitimate content, generation halts there and truncates the answer unexpectedly."
        }
      ],
      participation_activities: [
        {
          activity_title: "Stop sequence check",
          questions: [
            { question: "On most APIs, the stop sequence string is included at the end of the returned content.", type: "true_false", correct_answer: "false", explanation: "Generation stops just before the stop string, which is typically excluded from the content." },
            { question: "A string you give the API that forces generation to halt when produced is called a stop ______.", type: "fill_in", correct_answer: "sequence", explanation: "A stop sequence is the tripwire string that halts generation." }
          ]
        }
      ],
      starter_code: `# Simulate a stop sequence by cutting the output at the first occurrence.
def generate_with_stop(full_output, stop):
    idx = full_output.find(stop)
    if idx == -1:
        return full_output
    # TODO: return only the part BEFORE the stop string.
    return full_output

raw = "Blue.\\nQ: What color is grass?"
print(generate_with_stop(raw, "\\nQ:"))
`,
      solution_code: `def generate_with_stop(full_output, stop):
    idx = full_output.find(stop)
    if idx == -1:
        return full_output
    return full_output[:idx]

raw = "Blue.\\nQ: What color is grass?"
print(generate_with_stop(raw, "\\nQ:"))
`,
      expected_output: `Blue.`,
      step_throughs: [
        {
          title: "cutting output at the tripwire",
          steps: [
            { label: "Set the stop string", detail: "You decide the boundary. Here it's '\\nQ:', the start of the next question.", code: 'stop = "\\nQ:"' },
            { label: "Model would keep going", detail: "Left alone, the model would answer, then invent a second question after a newline.", code: 'raw = "Blue.\\nQ: What color is grass?"' },
            { label: "Find the stop string", detail: "Locate where the stop pattern first appears in the output.", code: 'idx = raw.find("\\nQ:")  # position of the tripwire' },
            { label: "Return text before it", detail: "Keep everything up to that index; the stop string and beyond are dropped.", code: 'raw[:idx]  # "Blue."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'The model would produce "Yes.\\nQ: Next?" and your stop sequence is "\\nQ:". What content comes back?',
          steps: [
            "Generation halts the moment the stop string is about to appear.",
            "The stop string '\\nQ:' starts right after 'Yes.'.",
            "So the returned content is everything before it, excluding the stop string."
          ],
          output: '"Yes."'
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'You want only the first list item. The model would output "- Apple\\n- Banana\\n- Cherry". You set the stop sequence to "\\n- ". What do you get, and what subtle bug could a different stop choice cause?',
          steps: [
            'Generation stops the first time "\\n- " is about to be produced.',
            'That occurs right after "- Apple", before the second item.',
            'So you get "- Apple" — exactly the first item, with the rest trimmed.',
            'Subtle bug: if an item itself contained "\\n- " (e.g. a multi-line entry), the stop would fire early inside a legitimate item and cut it short.'
          ],
          output: '"- Apple"; a stop string that can appear inside real content risks truncating it.'
        }
      ],
      comparison_tables: [
        {
          title: "natural stop vs stop sequence",
          columns: ["Aspect", "Natural stop", "Stop sequence"],
          rows: [
            { cells: ["Who decides the end", "The model", "You, via a string"] },
            { cells: ["finish_reason", "stop", "stop_sequence"] },
            { cells: ["Stop marker in output", "No marker", "Excluded (cut before it)"] },
            { cells: ["Main use", "Let the model finish a thought", "Carve / bound structured output"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good stop sequence vs risky stop sequence",
          bins: [
            { id: "good", label: "Good stop sequence choice" },
            { id: "risky", label: "Risky stop sequence choice" }
          ],
          items: [
            { id: "i1", text: 'A label like "\\nQ:" that ends a Q&A turn', bin: "good" },
            { id: "i2", text: 'The word "the", common in normal text', bin: "risky" },
            { id: "i3", text: 'A unique marker like "###END###"', bin: "good" },
            { id: "i4", text: 'A single space character " "', bin: "risky" },
            { id: "i5", text: 'A newline-plus-prefix that starts the next item', bin: "good" },
            { id: "i6", text: 'A common letter like "e"', bin: "risky" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how do a stop sequence and the max-token (length) limit differ as ways to end generation?",
          sampleAnswer: "A stop sequence ends generation at a meaningful boundary you define — when a specific string appears — so the output is cut cleanly at a known marker and the answer is complete up to that point. The max-token limit ends generation when the model runs out of allowance regardless of where it is, which usually chops the answer off mid-thought. One is a precise, intentional cut; the other is a blunt cap that often truncates."
        }
      ],
      hints: [
        "str.find(stop) returns the index where the stop string first appears, or -1 if absent.",
        "Slice the string up to that index with full_output[:idx] to keep only what comes before.",
        "If find returns -1, the stop string never appeared, so return the whole output unchanged."
      ],
      challenge_title: "Apply a stop sequence",
      challenge_description: "Write a function apply_stop(text, stop) that returns the portion of text before the first occurrence of stop. If stop is not found, return text unchanged. Test it on two cases and print each result.",
      challenge_starter_code: `# TODO: define apply_stop(text, stop) and test it on two cases.
`,
      challenge_solution_code: `def apply_stop(text, stop):
    idx = text.find(stop)
    if idx == -1:
        return text
    return text[:idx]

print(apply_stop("Paris.\\nQ: next question", "\\nQ:"))
print(apply_stop("No marker here", "\\nQ:"))
`,
      challenge_test_cases: [
        { input: "text contains the stop string", expected_output: "Paris.\nNo marker here", description: "First case cuts at the stop string; second returns the text unchanged." }
      ]
    }
  ]
};
