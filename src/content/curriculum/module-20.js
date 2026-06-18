export default {
  project: {
    id: "ai-20",
    title: "Reading Model Outputs",
    description: "Learn to read what a model API hands back: where the text lives, why generation stopped, and how many tokens it cost.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
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
      challenge_title: "Best-Candidate Response Router",
      challenge_description: "Walk the choices array of every API response, throw out anything that didn't finish cleanly, and route each request to its highest-scoring usable answer.",
      challenge_story: "Your inference service is configured to return **several candidate answers per request** (the model samples \`n\` completions and your reranker scores each one). The raw payload comes back as a response object with a \`choices\` array — but not every choice is shippable. A choice whose \`finish_reason\` isn't \`stop\` either got truncated, got filtered, or otherwise can't be trusted, so it must be discarded before scoring. Your job: write the **router** that opens each response, ignores the unusable choices, and forwards the best remaining candidate to the user.",
      challenge_statement: "You are given a batch of API responses. Each response has a request id and a list of **choices**; each choice carries an integer rerank **score**, a **finish_reason**, and the answer **text**.\n\nFor each response, in input order:\n\n1. Consider only choices whose \`finish_reason\` is exactly \`stop\` — every other finish_reason marks the choice unusable.\n2. Among the usable choices, pick the one with the **highest score**. If two usable choices tie on score, pick the one with the **smaller choice index** (the earlier one in the list).\n3. If a usable choice exists, print \`<id>: [<index>] <text>\`. If no choice is usable, print \`<id>: NO_VALID_CHOICE\`.\n\nAfter all responses, print \`VALID <v>/<n>\` where \`v\` is how many responses produced a usable answer and \`n\` is the total number of responses.",
      challenge_input_format: "The first line is the integer `n`: the number of responses.\n\nEach response starts with a line `<id> <k>` (a request id with no spaces, and `k`, the number of choices). The next `k` lines each describe one choice: an integer `score`, a `finish_reason` token, then the answer text (which may contain spaces), all space-separated.",
      challenge_output_format: "One line per response, in input order, as described above. Then a final line `VALID <v>/<n>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ k ≤ 100 choices per response",
        "0 ≤ score ≤ 1000000",
        "finish_reason is one of `stop`, `length`, `content_filter`, `stop_sequence`; only `stop` is usable here.",
        "Answer text is non-empty and may contain spaces; choice indices start at 0.",
      ],
      challenge_examples: [
        { input: "2\nr1 2\n8 stop Use a cache layer.\n5 stop Add an index.\nr2 1\n9 length Streaming the", output: "r1: [0] Use a cache layer.\nr2: NO_VALID_CHOICE\nVALID 1/2", explanation: "For r1 both choices are `stop`; choice 0 scores 8 > 5, so it wins. For r2 the only choice is `length` (truncated), so it's discarded and nothing is usable." },
        { input: "1\nr1 3\n3 length cut off mid\n7 content_filter redacted\n2 stop Final answer here", output: "r1: [2] Final answer here\nVALID 1/1", explanation: "Choices 0 and 1 are unusable (`length`, `content_filter`). Only choice 2 is `stop`, so it wins despite its low score." },
      ],
      challenge_notes: "Filtering on `finish_reason` *before* scoring is the whole point: a high-scoring answer that got truncated is worthless to a user. The index tie-break makes the router deterministic so the same batch always routes the same way. Split each choice line into at most three pieces so answer text containing spaces stays intact.",
      challenge_hints: [
        "Read `k` for each response, then loop `k` times reading one choice per line. Use `split(maxsplit=2)` so the text keeps its spaces.",
        "Skip any choice whose finish_reason isn't `stop` before you compare scores.",
        "Track best score and best index together; on a score tie, keep the smaller index (which you'll already have since you scan in order).",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    # TODO: for each response, read its k choices, keep only finish_reason == "stop",
    #       pick the highest score (smaller index breaks ties), and print the result.
    #       Finish with a "VALID <v>/<n>" line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    results = []
    valid = 0
    for _ in range(n):
        header = data[idx].split(); idx += 1
        rid = header[0]
        k = int(header[1])
        best_text = None
        best_score = None
        best_choice = None
        for ci in range(k):
            parts = data[idx].split(maxsplit=2); idx += 1
            score = int(parts[0])
            finish = parts[1]
            text = parts[2] if len(parts) > 2 else ""
            if finish != "stop":
                continue
            if best_score is None or score > best_score:
                best_score = score
                best_text = text
                best_choice = ci
        if best_text is None:
            results.append(f"{rid}: NO_VALID_CHOICE")
        else:
            valid += 1
            results.append(f"{rid}: [{best_choice}] {best_text}")
    for r in results:
        print(r)
    print(f"VALID {valid}/{n}")

main()
`,
      challenge_test_cases: [
        { input: "2\nr1 2\n8 stop Use a cache layer.\n5 stop Add an index.\nr2 1\n9 length Streaming the", expected_output: "r1: [0] Use a cache layer.\nr2: NO_VALID_CHOICE\nVALID 1/2", description: "Highest-scoring stop choice wins; a length-only response yields NO_VALID_CHOICE." },
        { input: "1\nr1 3\n3 length cut off mid\n7 content_filter redacted\n2 stop Final answer here", expected_output: "r1: [2] Final answer here\nVALID 1/1", description: "Unusable finish_reasons are filtered before scoring, so the lone stop choice wins." },
        { input: "1\nq 2\n5 stop alpha\n5 stop beta", expected_output: "q: [0] alpha\nVALID 1/1", description: "Score tie resolves to the smaller choice index." }
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
      challenge_title: "Continuation Retry Engine",
      challenge_description: "Simulate the retry loop that turns a truncated answer into a finished one: keep issuing continuation calls while finish_reason stays 'length', stop the moment it finishes, give up filtered or budget-blown requests, and tally the call count.",
      challenge_story: "When the model hits its output cap, the API hands back \`finish_reason == \"length\"\` — a half-written answer. Production systems don't surface that to the user; they fire a **continuation call** to resume generation, and repeat until the model emits a real \`stop\`. But continuations cost money, so you cap them at \`max_retries\`. Your team also learned to **bail immediately** on \`content_filter\` (retrying a blocked completion just wastes calls). Build the retry engine that replays a recorded sequence of finish_reasons for each request and reports the outcome.",
      challenge_statement: "You are given a retry budget \`max_retries\` and a list of requests. Each request records the **sequence of finish_reasons** its calls returned, in order: the first is the initial call, each later one is a continuation call.\n\nProcess each request's finish_reasons left to right, counting calls as you go:\n\n1. On \`stop\` or \`stop_sequence\`: the answer is complete → outcome \`DELIVERED\`. Stop.\n2. On \`content_filter\`: the content was blocked → outcome \`BLOCKED\`. Stop.\n3. On \`length\`: the answer was truncated. If you have already used \`max_retries\` continuation calls (i.e. the number of continuation calls made so far equals \`max_retries\`), give up with outcome \`TRUNCATED\` and stop. Otherwise issue the next continuation call and read the next finish_reason.\n4. If the recorded sequence runs out while still \`length\`, the outcome is \`TRUNCATED\`.\n\nFor each request print \`<id> <OUTCOME> <calls>\` where \`calls\` is how many calls were actually made. Then print three summary lines: \`DELIVERED <d>\`, \`FAILED <f>\` (everything not delivered), and \`CALLS <c>\` (total calls across all requests).",
      challenge_input_format: "The first line has two integers `n max_retries`. Each of the next `n` lines describes one request: its id (no spaces) followed by one or more finish_reason tokens, all space-separated.",
      challenge_output_format: "One line per request: `<id> <OUTCOME> <calls>`. Then `DELIVERED <d>`, `FAILED <f>`, and `CALLS <c>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ max_retries ≤ 100",
        "Each request lists 1 to 200 finish_reason tokens.",
        "finish_reason is one of `stop`, `stop_sequence`, `length`, `content_filter`.",
        "The initial call always happens, so calls ≥ 1 for every request.",
      ],
      challenge_examples: [
        { input: "2 2\nA stop\nB length length stop", output: "A DELIVERED 1\nB DELIVERED 3\nDELIVERED 2\nFAILED 0\nCALLS 4", explanation: "A finishes on its first call. B truncates twice (2 continuations, within the cap of 2) then finally returns stop on call 3." },
        { input: "2 1\nC length length length\nD length content_filter", output: "C TRUNCATED 2\nD BLOCKED 2\nDELIVERED 0\nFAILED 2\nCALLS 4", explanation: "C truncates on call 1, retries once (the cap), truncates again on call 2 and is abandoned. D truncates then gets blocked on its continuation, so it bails immediately." },
      ],
      challenge_notes: "The retry cap counts *continuation* calls, not the initial one: with \`max_retries = 0\` a single \`length\` means instant \`TRUNCATED\` after one call. Bailing on \`content_filter\` instead of retrying is a real cost optimization — a filtered completion will just get filtered again. Notice that \`FAILED\` lumps together \`TRUNCATED\` and \`BLOCKED\`: from the user's perspective, both mean no answer.",
      challenge_hints: [
        "Track `calls` per request. After reading a `length`, the number of continuations used so far is `calls - 1`; compare that to `max_retries`.",
        "Break out of the loop on `stop`/`stop_sequence` (DELIVERED) and on `content_filter` (BLOCKED).",
        "If the loop ends without a decisive finish_reason, the outcome is TRUNCATED.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, max_retries = map(int, data[0].split())
    # TODO: for each request, replay its finish_reasons, counting calls and capping
    #       continuations at max_retries. Print "<id> <OUTCOME> <calls>" per request,
    #       then DELIVERED / FAILED / CALLS summary lines.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    n = int(first[0])
    max_retries = int(first[1])
    total_calls = 0
    delivered = 0
    failed = 0
    lines = []
    for _ in range(n):
        toks = data[idx].split(); idx += 1
        rid = toks[0]
        seq = toks[1:]
        calls = 0
        status = "TRUNCATED"
        for fr in seq:
            calls += 1
            if fr in ("stop", "stop_sequence"):
                status = "DELIVERED"
                break
            if fr == "content_filter":
                status = "BLOCKED"
                break
            if calls - 1 >= max_retries:
                status = "TRUNCATED"
                break
        total_calls += calls
        if status == "DELIVERED":
            delivered += 1
        else:
            failed += 1
        lines.append(f"{rid} {status} {calls}")
    for l in lines:
        print(l)
    print(f"DELIVERED {delivered}")
    print(f"FAILED {failed}")
    print(f"CALLS {total_calls}")

main()
`,
      challenge_test_cases: [
        { input: "2 2\nA stop\nB length length stop", expected_output: "A DELIVERED 1\nB DELIVERED 3\nDELIVERED 2\nFAILED 0\nCALLS 4", description: "Clean stop vs two truncations recovered by continuations within the cap." },
        { input: "2 1\nC length length length\nD length content_filter", expected_output: "C TRUNCATED 2\nD BLOCKED 2\nDELIVERED 0\nFAILED 2\nCALLS 4", description: "Cap exhausted -> TRUNCATED; content_filter on a continuation -> BLOCKED." },
        { input: "1 0\nE length stop", expected_output: "E TRUNCATED 1\nDELIVERED 0\nFAILED 1\nCALLS 1", description: "With zero retries, the first length truncates immediately." }
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
      challenge_title: "Multi-Turn Budget Meter",
      challenge_description: "Bill a whole chatbot conversation turn by turn, watching prompt_tokens balloon as the history re-feeds, and pull the plug the instant the next turn would blow the budget.",
      challenge_story: "Your support bot re-sends the entire conversation as context on every turn, so the \`prompt_tokens\` in each \`usage\` block grows as the chat goes on — and finance handed you a hard cost ceiling per session. You need a **budget meter**: replay the conversation, compute each turn's cost from its usage, and stop accepting turns the moment the running total would cross the ceiling. Input tokens bill at **\$3 per 1,000,000**, output tokens at **\$15 per 1,000,000**.",
      challenge_statement: "A session has a system prompt of \`system\` tokens that is always part of the context. Then \`t\` turns happen in order; turn \`i\` adds \`user_i\` new input tokens and produces \`out_i\` output tokens.\n\nThe **prompt tokens** billed for a turn are the entire context fed in: the system prompt, every prior turn's user *and* assistant tokens, plus this turn's new user tokens. After a turn completes, both its user tokens and its output tokens become part of the context for later turns.\n\nA turn's cost in **micro-dollars** (millionths of a dollar) is \`prompt_tokens * 3 + out_tokens * 15\`. You are given a \`budget\` in micro-dollars. Process turns in order; **before** committing each turn, check whether the running total plus this turn's cost would exceed \`budget\`. If it would, halt without running that turn or any later one.\n\nFor each turn you actually run, print \`turn <i>: prompt=<p> completion=<c> cost=$<x>\` where \`<x>\` is that turn's cost in dollars to exactly 6 decimals. Then print \`DELIVERED <count>\`, \`TOTAL $<sum>\` (the committed total to 6 decimals), and either \`WITHIN_BUDGET\` or \`HALTED turn <i>\` for the first turn that was refused.",
      challenge_input_format: "The first line has two integers `t budget` (the turn count and the budget in micro-dollars). The second line is the integer `system` (system-prompt tokens). Each of the next `t` lines has two integers `user_i out_i`.",
      challenge_output_format: "One line per delivered turn, then `DELIVERED <count>`, `TOTAL $<sum>`, and a final status line.",
      challenge_constraints: [
        "0 ≤ t ≤ 1000",
        "0 ≤ system, user_i, out_i ≤ 1000000",
        "0 ≤ budget ≤ 10^15 (micro-dollars)",
        "Costs use exact integer arithmetic in micro-dollars; print dollar amounts to exactly 6 decimals.",
        "A turn is allowed when running_total + turn_cost ≤ budget (the boundary is inclusive).",
      ],
      challenge_examples: [
        { input: "2 1000000\n10\n5 20\n8 30", output: "turn 1: prompt=15 completion=20 cost=$0.000345\nturn 2: prompt=43 completion=30 cost=$0.000579\nDELIVERED 2\nTOTAL $0.000924\nWITHIN_BUDGET", explanation: "Turn 1 prompt = system(10)+user(5) = 15; cost = 15*3 + 20*15 = 345 micro = $0.000345. Context grows to 15+20 = 35, so turn 2 prompt = 35+8 = 43. Both fit the budget." },
        { input: "3 1000\n10\n5 20\n100 200\n50 50", output: "turn 1: prompt=15 completion=20 cost=$0.000345\nDELIVERED 1\nTOTAL $0.000345\nHALTED turn 2", explanation: "Turn 1 costs 345 micro. Turn 2 would cost 135*3 + 200*15 = 3405 micro, pushing the total to 3750 > budget 1000, so the meter halts before running turn 2." },
      ],
      challenge_notes: "Keep all money in integer micro-dollars and only divide by 1,000,000 when you print — that avoids float drift and makes the budget boundary exact. The reason \`prompt_tokens\` climbs every turn is that the assistant's own previous replies get re-fed as context, so you pay for the whole transcript again and again. That is exactly why long chats get expensive and why summarizing old turns is a real cost lever.",
      challenge_hints: [
        "Carry a running `history` token count starting at `system`; a turn's prompt is `history + user_i`.",
        "After committing a turn, set `history = prompt_tokens + out_tokens` so both sides of the exchange persist.",
        "Check `running_total + cost > budget` BEFORE committing; if so, record the halt turn and break.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    t, budget = map(int, data[0].split())
    system = int(data[1])
    # TODO: replay the t turns, growing the context each turn, billing in micro-dollars,
    #       and halting before any turn that would exceed the budget. Print each delivered
    #       turn, then DELIVERED / TOTAL / status lines.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    t = int(first[0])
    budget = int(first[1])
    system = int(data[idx]); idx += 1
    history = system
    total_cost = 0
    delivered = 0
    halted_turn = -1
    for turn in range(1, t + 1):
        parts = data[idx].split(); idx += 1
        user_tokens = int(parts[0])
        out_tokens = int(parts[1])
        prompt_tokens = history + user_tokens
        cost = prompt_tokens * 3 + out_tokens * 15
        if total_cost + cost > budget:
            halted_turn = turn
            break
        total_cost += cost
        delivered += 1
        history = prompt_tokens + out_tokens
        print(f"turn {turn}: prompt={prompt_tokens} completion={out_tokens} cost=\${cost/1_000_000:.6f}")
    print(f"DELIVERED {delivered}")
    print(f"TOTAL \${total_cost/1_000_000:.6f}")
    if halted_turn != -1:
        print(f"HALTED turn {halted_turn}")
    else:
        print("WITHIN_BUDGET")

main()
`,
      challenge_test_cases: [
        { input: "2 1000000\n10\n5 20\n8 30", expected_output: "turn 1: prompt=15 completion=20 cost=$0.000345\nturn 2: prompt=43 completion=30 cost=$0.000579\nDELIVERED 2\nTOTAL $0.000924\nWITHIN_BUDGET", description: "Context grows across turns; both fit the budget." },
        { input: "3 1000\n10\n5 20\n100 200\n50 50", expected_output: "turn 1: prompt=15 completion=20 cost=$0.000345\nDELIVERED 1\nTOTAL $0.000345\nHALTED turn 2", description: "Meter halts before the turn that would exceed the budget." },
        { input: "1 344\n10\n5 20", expected_output: "DELIVERED 0\nTOTAL $0.000000\nHALTED turn 1", description: "A budget one micro-dollar short of the first turn's cost halts immediately." }
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
      challenge_title: "Earliest-Wins Stop Sequence Cutter",
      challenge_description: "Apply a whole set of stop sequences to a generated buffer at once: find the one that fires earliest, slice the output there, and report whether the model stopped on a tripwire or just ran to the end.",
      challenge_story: "You configured your API call with **several stop sequences** — a Q&A turn marker, a code-fence closer, a custom \`<<<END>>>\` sentinel — because any of them should end generation. The model streamed a raw buffer back to you; now you have to post-process it exactly like the API does: scan for **every** configured stop string and cut at whichever one appears **first** in the text. If none appears, the model never hit a tripwire and you'll treat it as having run to the length cap.",
      challenge_statement: "You are given \`k\` stop sequences and one generated \`text\` buffer. In both the stop sequences and the text, the two-character escapes \`\\n\` and \`\\t\` represent a real newline and tab respectively — decode them before searching.\n\nFind, among all stop sequences, the one whose **first occurrence** in the text starts at the smallest index. If two stop sequences first appear at the same index, prefer the **shorter** one (it ends generation sooner). Keep only the text **before** that index.\n\n- If some stop sequence is found, the finish reason is \`stop_sequence\` and the kept text is everything before the match.\n- If no stop sequence appears anywhere, the finish reason is \`length\` and the kept text is the whole buffer.\n\nPrint three lines: the kept text (with real newlines/tabs re-escaped back to \`\\n\`/\`\\t\`), then \`FINISH <reason>\`, then \`KEPT <n>\` where \`n\` is the number of characters kept (counting a real newline/tab as one character).",
      challenge_input_format: "The first line is the integer `k`. The next `k` lines are the stop sequences (one per line, escapes allowed). The line after that is the generated text buffer (escapes allowed).",
      challenge_output_format: "Three lines: the kept text (escaped), `FINISH stop_sequence` or `FINISH length`, and `KEPT <n>`.",
      challenge_constraints: [
        "1 ≤ k ≤ 50",
        "Each stop sequence is 1 to 50 characters after decoding and is non-empty.",
        "The text buffer is 0 to 100000 characters after decoding.",
        "Only `\\n` and `\\t` are escaped; all other characters are literal.",
        "Position ties are broken by the shorter stop sequence.",
      ],
      challenge_examples: [
        { input: "2\n\\nQ:\nEND\nParis.\\nQ: next", output: "Paris.\nFINISH stop_sequence\nKEPT 6", explanation: "Decoded, the text is `Paris.<newline>Q: next`. The stop `<newline>Q:` first appears at index 6 (the literal `END` never appears), so everything before it — `Paris.` (6 chars) — is kept." },
        { input: "1\n###\nplain text no marker", output: "plain text no marker\nFINISH length\nKEPT 20", explanation: "The stop sequence `###` never appears, so nothing is cut: the whole 20-character buffer is kept and the finish reason is `length`." },
      ],
      challenge_notes: "Real APIs apply all your stop sequences simultaneously and cut at the earliest hit — that's why a too-common stop string (like a single space) can chop answers off almost immediately. Decoding \`\\n\`/\`\\t\` lets the test cases express multi-line buffers on a single input line. The shorter-on-tie rule keeps the cut deterministic when one stop sequence is a prefix of another at the same spot.",
      challenge_hints: [
        "Decode `\\n` and `\\t` in every stop sequence and in the text before you search.",
        "Use `text.find(stop)`; it returns the first index or -1. Track the smallest non-negative index, breaking ties by shorter stop length.",
        "Re-escape real newlines/tabs back to `\\n`/`\\t` when printing the kept text, but count characters on the decoded string.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k = int(data[0])
    # TODO: read k stop sequences and the text, decode the \\\\n and \\\\t escapes, find the
    #       earliest stop (shorter wins ties), slice the text, and print the kept text
    #       plus FINISH and KEPT lines.

main()
`,
      challenge_solution_code: `import sys

def dec(s):
    return s.replace("\\\\t", "\\t").replace("\\\\n", "\\n")

def enc(s):
    return s.replace("\\n", "\\\\n").replace("\\t", "\\\\t")

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx]); idx += 1
    stops = []
    for _ in range(k):
        stops.append(dec(data[idx])); idx += 1
    text = dec(data[idx]) if idx < len(data) else ""

    best_idx = -1
    best_len = None
    for s in stops:
        pos = text.find(s)
        if pos == -1:
            continue
        if best_idx == -1 or pos < best_idx or (pos == best_idx and len(s) < best_len):
            best_idx = pos
            best_len = len(s)

    if best_idx == -1:
        kept = text
        reason = "length"
    else:
        kept = text[:best_idx]
        reason = "stop_sequence"

    print(enc(kept))
    print(f"FINISH {reason}")
    print(f"KEPT {len(kept)}")

main()
`,
      challenge_test_cases: [
        { input: "2\n\\nQ:\nEND\nParis.\\nQ: next", expected_output: "Paris.\nFINISH stop_sequence\nKEPT 6", description: "Earliest stop sequence wins; text before it is kept." },
        { input: "1\n###\nplain text no marker", expected_output: "plain text no marker\nFINISH length\nKEPT 20", description: "No stop appears, so the finish reason is length and nothing is cut." },
        { input: "1\nX\nXhello", expected_output: "\nFINISH stop_sequence\nKEPT 0", description: "A stop at index 0 keeps an empty string." }
      ]
    },
    {
      id: "ai-20-l5",
      project_id: "ai-20",
      order: 5,
      title: "Streaming Chunks and Deltas",
      concept: "Streaming",
      xp_reward: 10,
      explanation: `Watch ChatGPT answer and the text appears word by word, like someone typing live. That isn't a UI animation faked on top of a finished answer — the model really is sending the text out in pieces as it generates them. Each piece is called a **delta**, and if you want that live feel in your own app, you have to learn to catch the pieces and glue them back together yourself.

## What it is

In the lessons so far, the API handed you one complete **response object** with the whole answer sitting in \`content\`. **Streaming** flips that: instead of one big response, the API sends a sequence of small **chunks**, each carrying a tiny slice of the answer in a field called a **delta**. Your code receives chunk, chunk, chunk... and assembles the final text as they arrive.

A delta is literally "the new bit since last time." The first chunk might carry "The", the next " capital", the next " of"... and so on. None of them is the full answer. The full answer only exists once you have **concatenated every delta in order**.

## How it works

Each chunk looks a lot like a mini response object, but the text lives under \`delta\` instead of \`message\`, and it holds only the newest fragment. You loop over the chunks and append each fragment to a buffer:

\`\`\`python
chunks = [
    {"choices": [{"delta": {"content": "The "}}]},
    {"choices": [{"delta": {"content": "sky "}}]},
    {"choices": [{"delta": {"content": "is blue."}}]},
    {"choices": [{"delta": {}, "finish_reason": "stop"}]},
]

text = ""
for chunk in chunks:
    delta = chunk["choices"][0]["delta"]
    text += delta.get("content", "")   # append the new slice, if any
print(text)   # The sky is blue.
\`\`\`

Two details matter. First, **order is sacred** — deltas must be joined in the exact sequence they arrive, or the words scramble. Second, **some chunks carry no text at all.** The final chunk often has an empty delta and instead reports the \`finish_reason\`, signaling the stream is done. That is why you use \`delta.get("content", "")\` rather than indexing directly: a missing content key is normal, not an error.

## Why it matters

Streaming changes how you write the receiving code:

- **Perceived speed.** Users see the first words in a fraction of a second instead of waiting for the whole answer. The total time is the same; the *wait* feels far shorter.
- **You own the assembly.** The API will not hand you a finished string — partial-message handling is your job. Forget to concatenate and you display only the last fragment.
- **The end is a separate signal.** The stream finishes with a terminal chunk (empty delta plus a finish_reason), not by the text simply stopping. Watch for it so you know when you have the complete answer.

## The mental model to keep

A streamed answer is a **river of fragments, not a bucket of water.** Each delta is one more drop. Your job is to catch them in order and let them fill the buffer — and to notice the final empty chunk that says the river has run dry.`,
      key_terms: [
        { term: "Streaming", definition: "Receiving a response as a sequence of small chunks as it generates, rather than one complete object at the end." },
        { term: "Delta", definition: "The newest fragment of text carried by a streaming chunk — the bit added since the previous chunk." },
        { term: "Chunk", definition: "One piece of a streamed response, shaped like a mini response object with a delta instead of a full message." }
      ],
      callouts: [
        { type: "analogy", title: "A river, not a bucket", content: "A normal response is a full bucket handed to you at once. A stream is a river of drops — each delta is one drop, and you catch them in order until the buffer is full.", position: "before" },
        { type: "warning", title: "Some chunks carry no text", content: "The final chunk usually has an empty delta and just reports finish_reason. Use delta.get('content', '') so a missing content key is treated as 'nothing to add', not a crash.", position: "after" }
      ],
      concept_diagram: {
        title: "Assembling text from streamed deltas",
        steps: [
          { label: "Start with empty buffer", desc: "Before any chunk arrives, your text string is empty." },
          { label: "Receive a chunk", desc: "Each chunk carries a delta with the newest text fragment." },
          { label: "Append the delta", desc: "Concatenate the fragment onto the buffer, in arrival order." },
          { label: "See the terminal chunk", desc: "An empty delta plus a finish_reason means the stream is complete." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does the delta in a streaming chunk contain?",
          options: ["The entire answer so far", "Only the new fragment added since the last chunk", "The token usage counts"],
          correct_index: 1,
          explanation: "A delta is just the newest slice; you must concatenate all deltas in order to get the full answer."
        }
      ],
      quiz_questions: [
        {
          question: "How do you reconstruct the full answer from a stream?",
          options: [
            "Read the content field of the last chunk only",
            "Concatenate every delta's content in the order the chunks arrive",
            "Sum the token counts across chunks",
            "Take the longest single delta"
          ],
          correct_index: 1,
          explanation: "Each delta is only a fragment, so you append them in arrival order to build the complete text."
        },
        {
          question: "Why does streaming feel faster even though total time is similar?",
          options: [
            "It uses fewer tokens overall",
            "Users see the first words almost immediately instead of waiting for the whole answer",
            "It skips the slower parts of the model",
            "Streaming runs on faster hardware"
          ],
          correct_index: 1,
          explanation: "The first fragment appears in a fraction of a second, so the perceived wait shrinks even though end-to-end time is about the same."
        },
        {
          question: "What is special about the final chunk of a stream?",
          options: [
            "It repeats the entire answer",
            "It usually has an empty delta and reports the finish_reason",
            "It contains the API key",
            "It is always the largest chunk"
          ],
          correct_index: 1,
          explanation: "The terminal chunk typically carries no new text; it signals completion via finish_reason."
        }
      ],
      participation_activities: [
        {
          activity_title: "Streaming check",
          questions: [
            { question: "Each streaming chunk's delta contains the entire answer generated so far.", type: "true_false", correct_answer: "false", explanation: "A delta holds only the newest fragment; you concatenate fragments to build the full text." },
            { question: "To rebuild the answer you must join the deltas in the exact ______ they arrive.", type: "fill_in", correct_answer: "order", explanation: "Order is sacred — out-of-order deltas scramble the words." }
          ]
        }
      ],
      starter_code: `# A simulated streamed response: a list of chunks, each with a delta.
chunks = [
    {"choices": [{"delta": {"content": "Hello"}}]},
    {"choices": [{"delta": {"content": ", "}}]},
    {"choices": [{"delta": {"content": "world!"}}]},
    {"choices": [{"delta": {}, "finish_reason": "stop"}]},
]

# TODO: build the full text by appending each delta's content in order.
text = ""
print(text)
`,
      solution_code: `chunks = [
    {"choices": [{"delta": {"content": "Hello"}}]},
    {"choices": [{"delta": {"content": ", "}}]},
    {"choices": [{"delta": {"content": "world!"}}]},
    {"choices": [{"delta": {}, "finish_reason": "stop"}]},
]

text = ""
for chunk in chunks:
    delta = chunk["choices"][0]["delta"]
    text += delta.get("content", "")
print(text)
`,
      expected_output: `Hello, world!`,
      step_throughs: [
        {
          title: "filling the buffer one delta at a time",
          steps: [
            { label: "Start empty", detail: "Before the stream begins, your text buffer holds nothing.", code: 'text = ""' },
            { label: "First delta arrives", detail: "The first chunk carries the opening fragment. Append it to the buffer.", code: 'text += "The "  # -> "The "' },
            { label: "Keep appending", detail: "Each later chunk adds its fragment in order. The buffer grows piece by piece.", code: 'text += "sky is blue."  # -> "The sky is blue."' },
            { label: "Terminal chunk", detail: "The last chunk has an empty delta and a finish_reason. No text to add; the stream is done.", code: 'delta.get("content", "")  # "" -> stream complete' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Three deltas arrive carrying "Good", " ", and "day". What is the assembled answer?',
          steps: [
            "Start with an empty buffer.",
            'Append each delta in order: "Good" + " " + "day".',
            "The fragments join into one string."
          ],
          output: '"Good day"'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A stream sends deltas 'Hi', then an empty-content chunk, then 'there', then a final chunk with no content and finish_reason 'stop'. What text do you end with, and why doesn't the empty chunk break things?",
          steps: [
            "Append 'Hi' to the buffer.",
            "The empty-content chunk has no content key, so delta.get('content', '') returns '' and adds nothing.",
            "Append 'there', giving 'Hithere'.",
            "The final chunk carries finish_reason 'stop' and empty content, signaling the stream is complete with no further text."
          ],
          output: "'Hithere' — empty deltas safely contribute nothing thanks to .get with a default."
        }
      ],
      comparison_tables: [
        {
          title: "non-streaming vs streaming responses",
          columns: ["Aspect", "Non-streaming", "Streaming"],
          rows: [
            { cells: ["What you receive", "One complete response object", "A sequence of small chunks"] },
            { cells: ["Where text lives", "message.content", "delta.content (a fragment)"] },
            { cells: ["When you see text", "All at once, at the end", "Word by word, as it generates"] },
            { cells: ["Assembly work", "None — it's already whole", "You concatenate the deltas yourself"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "carries new text vs signals the end",
          bins: [
            { id: "text", label: "Carries a text fragment" },
            { id: "end", label: "Signals completion / no text" }
          ],
          items: [
            { id: "i1", text: 'delta with content "The "', bin: "text" },
            { id: "i2", text: "A chunk with an empty delta and finish_reason 'stop'", bin: "end" },
            { id: "i3", text: 'delta with content "answer."', bin: "text" },
            { id: "i4", text: "A chunk whose delta has no content key", bin: "end" },
            { id: "i5", text: 'delta with content " is blue"', bin: "text" },
            { id: "i6", text: "The terminal chunk reporting why generation stopped", bin: "end" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does streaming put the burden of assembling the answer on your code instead of the API?",
          sampleAnswer: "Streaming exists so users see text the instant it's generated, which means the API can't wait until the answer is whole before sending anything — it has to push each fragment out the moment it exists. Since the API never holds the complete string, it can only send you pieces, so reconstructing the full answer by concatenating the deltas in order naturally becomes your job. The trade is a faster-feeling experience in exchange for a little assembly work on your side."
        }
      ],
      hints: [
        "Loop over the chunks and reach into chunk[\"choices\"][0][\"delta\"] each time.",
        "Use delta.get(\"content\", \"\") so chunks with no text safely add nothing.",
        "Append (+=) each fragment to your running text string in order."
      ],
      challenge_title: "Stream Assembler",
      challenge_description: "Reassemble a streamed answer from its deltas in order, halt the moment the stream's end marker arrives, and report how many real text fragments you stitched together.",
      challenge_story: "Your chat UI consumes a model response as a **stream of deltas** — each line is the next fragment of text the model just produced. The stream ends with a special terminal marker, the literal token \`<END>\`, which carries no text and just announces completion. Your assembler must walk the deltas in order, glue the text together exactly as it arrives, and stop the instant it sees \`<END>\` (anything after it is not part of this answer). Then report the assembled text and how many text fragments you actually consumed.",
      challenge_statement: "You are given \`n\` delta lines in order. Process them top to bottom:\n\n1. If a delta is exactly \`<END>\`, the stream is complete — stop immediately and do **not** treat it as text (ignore any deltas after it).\n2. Otherwise, append the delta's text to your running buffer and count it as one fragment.\n\nA delta line may be empty (an empty fragment that contributes nothing but still counts as a fragment, since it was a real chunk). Print the fully assembled text on its own line, then print \`CHUNKS <k>\` where \`k\` is the number of text fragments you appended (not counting the \`<END>\` marker).",
      challenge_input_format: "The first line is the integer `n`: the number of delta lines that follow. Each of the next `n` lines is one delta's text fragment (which may contain spaces, or be empty). The literal `<END>` on a line marks the terminal chunk.",
      challenge_output_format: "First line: the assembled text. Second line: `CHUNKS <k>` where `k` is how many text fragments were appended before the end marker.",
      challenge_constraints: [
        "1 ≤ n ≤ 10000",
        "Each delta line is a text fragment; the terminal marker is the literal `<END>`.",
        "Fragments may contain spaces and may be empty; concatenate them with no added separator.",
        "Deltas after the first `<END>` are ignored.",
      ],
      challenge_examples: [
        { input: "4\nHel\nlo!\n there\n<END>", output: "Hello! there\nCHUNKS 3", explanation: "Three text deltas ('Hel', 'lo!', ' there') concatenate to 'Hello! there'. The <END> marker stops the stream and is not counted." },
        { input: "4\nA\n<END>\nB\nC", output: "A\nCHUNKS 1", explanation: "Only 'A' is appended before <END>; the 'B' and 'C' lines arrive after the end marker and are ignored." },
      ],
      challenge_notes: "Concatenating deltas with no separator is exactly how real streaming works — the model already includes any needed spaces inside the fragments. Stopping at the end marker (rather than reading to EOF) mirrors why you watch for the terminal chunk: it tells you the answer is complete even if more bytes happen to follow on the wire.",
      challenge_hints: [
        "Read n, then iterate over exactly the next n lines in order.",
        "Break out of the loop the moment a line equals \"<END>\"; don't append it or count it.",
        "Keep a counter that increments once per appended fragment, even when the fragment is an empty string.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: append deltas 1..n in order, stopping at "<END>".
    #       Print the assembled text, then "CHUNKS <k>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    text = ""
    count = 0
    for i in range(1, n + 1):
        delta = data[i]
        if delta == "<END>":
            break
        text += delta
        count += 1
    print(text)
    print(f"CHUNKS {count}")

main()
`,
      challenge_test_cases: [
        { input: "4\nHel\nlo!\n there\n<END>", expected_output: "Hello! there\nCHUNKS 3", description: "Three fragments concatenate; the end marker stops and isn't counted." },
        { input: "4\nA\n<END>\nB\nC", expected_output: "A\nCHUNKS 1", description: "Deltas after the first <END> are ignored." },
        { input: "3\nonly\n one\n piece", expected_output: "only one piece\nCHUNKS 3", description: "No end marker present: all n fragments are appended." }
      ]
    },
    {
      id: "ai-20-l6",
      project_id: "ai-20",
      order: 6,
      title: "Refusals and Safety Stops",
      concept: "Refusals",
      xp_reward: 10,
      explanation: `You wire up a model to answer customer questions, ship it, and one day it replies "I'm sorry, but I can't help with that request." Your app proudly displays those words as if they were a real answer — formatted, timestamped, sitting in the chat bubble. The model didn't fail. It **refused**, on purpose, and your code never noticed the difference between a refusal and an answer. Reading that difference is the whole skill.

## What it is

A **refusal** is when the model declines to fulfill a request — usually for safety, policy, or capability reasons — and says so in plain language instead of doing the task. A close cousin is the **safety stop**: the platform's filter blocks the output entirely, and the response signals that the content was withheld rather than completed.

The trap is that a refusal *looks* like a normal answer. It arrives in the same \`content\` field, with the same fluent tone, and often with \`finish_reason == "stop"\` — because from the model's point of view, "I can't help with that" *is* a complete, natural reply. Naively, your code treats it as a successful answer and shows it to the user as if it solved their problem.

## How it works

There are two signals to watch. First, the structured one: some APIs expose an explicit field — a \`refusal\` string on the message, or a \`finish_reason\` of \`content_filter\` — that flags the response as not a real answer. Check that first; it's the reliable path.

\`\`\`python
def classify(resp):
    choice = resp["choices"][0]
    msg = choice["message"]
    # Structured refusal field takes priority when present.
    if msg.get("refusal"):
        return "REFUSAL", msg["refusal"]
    if choice.get("finish_reason") == "content_filter":
        return "BLOCKED", None
    return "ANSWER", msg.get("content", "")

resp = {"choices": [{"message": {"refusal": "I can't help with that."},
                     "finish_reason": "stop"}]}
print(classify(resp))   # ('REFUSAL', "I can't help with that.")
\`\`\`

When no structured field exists, you fall back to **detecting refusal-shaped text** — phrases like "I can't", "I'm unable to", "I won't" at the start of the content. This is fuzzier and can misfire, so prefer the structured signal whenever the API provides it.

## Why it matters

Handling refusals gracefully is what separates a toy from a product:

- **Don't present a refusal as the answer.** A user who asked a legitimate question and got "I can't help" deserves a fallback — rephrase, escalate to a human, or show a helpful message — not a dead end dressed up as a result.
- **Distinguish refusal from blocked.** A refusal has explanatory text you might surface; a content-filter block has *no* usable content at all and must be handled as a hard stop.
- **Don't retry blindly.** Re-sending the exact same request that got refused usually earns the same refusal — and burns tokens. Change the request or route it elsewhere.

## The mental model to keep

A refusal is **a 'no' wearing the costume of an answer.** It fills the same content field, ends with the same 'stop' — so you have to look past the costume, check for the refusal signal, and route a 'no' differently from a 'yes.'`,
      key_terms: [
        { term: "Refusal", definition: "When the model declines a request for safety, policy, or capability reasons and says so instead of doing the task." },
        { term: "Safety stop", definition: "A platform filter blocking the output entirely, signaled by a finish_reason like content_filter, with no usable content." },
        { term: "refusal field", definition: "An explicit field some APIs put on the message to flag that the reply is a refusal rather than a real answer." }
      ],
      callouts: [
        { type: "analogy", title: "A 'no' in an answer's costume", content: "A refusal arrives in the same content field, with the same polite tone and the same 'stop' ending as a real answer. It's a 'no' wearing an answer's costume — you have to look past the costume.", position: "before" },
        { type: "warning", title: "Don't retry a refusal unchanged", content: "Re-sending the identical request that got refused almost always earns the same refusal and wastes tokens. Change the request or route it to a human instead of looping.", position: "after" }
      ],
      concept_diagram: {
        title: "Telling a refusal from a real answer",
        steps: [
          { label: "Response arrives", desc: "The content field is filled and finish_reason is often 'stop'." },
          { label: "Check the refusal signal", desc: "Look for a refusal field or a content_filter finish_reason." },
          { label: "Classify", desc: "Refusal, blocked, or a genuine answer — three different outcomes." },
          { label: "Route accordingly", desc: "Show answers; fall back or escalate on refusals and blocks." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why is a refusal easy to mistake for a real answer?",
          options: ["It comes back as an error code", "It arrives in the same content field and often with finish_reason 'stop'", "It always has zero tokens"],
          correct_index: 1,
          explanation: "A refusal is fluent text in the normal content field and finishes naturally, so it looks like a successful reply unless you check the refusal signal."
        }
      ],
      quiz_questions: [
        {
          question: "What is the most reliable way to detect a refusal when the API supports it?",
          options: [
            "Count the tokens in the reply",
            "Check the structured refusal field or a content_filter finish_reason",
            "Measure how long the response took",
            "Look for an HTTP 500 error"
          ],
          correct_index: 1,
          explanation: "When the API exposes a structured refusal field or a content_filter finish_reason, that signal is far more reliable than scanning the text."
        },
        {
          question: "How does a content-filter block differ from a refusal?",
          options: [
            "They are identical in every way",
            "A block withholds the content entirely, while a refusal has explanatory text you might surface",
            "A block is always temporary",
            "A refusal costs more money"
          ],
          correct_index: 1,
          explanation: "A safety/content-filter stop yields no usable content, whereas a refusal still contains a worded 'no' you can choose to show."
        },
        {
          question: "What should your app do after detecting a refusal?",
          options: [
            "Display it to the user as the final answer",
            "Provide a fallback such as rephrasing, escalating, or a helpful message",
            "Immediately resend the exact same request",
            "Crash with an error"
          ],
          correct_index: 1,
          explanation: "A refusal deserves graceful handling — a fallback path — not being shown as a solved answer or retried unchanged."
        }
      ],
      participation_activities: [
        {
          activity_title: "Refusal handling check",
          questions: [
            { question: "A refusal usually arrives as an error code rather than normal content.", type: "true_false", correct_answer: "false", explanation: "A refusal is fluent text in the normal content field, often with finish_reason 'stop'." },
            { question: "When the platform's filter blocks output entirely with no usable content, that is a ______ stop.", type: "fill_in", correct_answer: "safety", explanation: "A safety (content-filter) stop withholds the content rather than completing an answer." }
          ]
        }
      ],
      starter_code: `# Classify a response as a refusal or a real answer.
resp = {
    "choices": [
        {"message": {"refusal": "I'm sorry, but I can't help with that."},
         "finish_reason": "stop"}
    ]
}

choice = resp["choices"][0]
msg = choice["message"]
# TODO: if msg has a non-empty "refusal", print "REFUSAL"; otherwise print the content.
print(msg)
`,
      solution_code: `resp = {
    "choices": [
        {"message": {"refusal": "I'm sorry, but I can't help with that."},
         "finish_reason": "stop"}
    ]
}

choice = resp["choices"][0]
msg = choice["message"]
if msg.get("refusal"):
    print("REFUSAL:", msg["refusal"])
else:
    print("ANSWER:", msg.get("content", ""))
`,
      expected_output: `REFUSAL: I'm sorry, but I can't help with that.`,
      step_throughs: [
        {
          title: "routing a response by whether it's a refusal",
          steps: [
            { label: "Open the message", detail: "Reach into choices[0].message — both real answers and refusals live here.", code: 'msg = resp["choices"][0]["message"]' },
            { label: "Check the refusal field", detail: "If the message carries a non-empty refusal string, this reply is a 'no', not an answer.", code: 'if msg.get("refusal"): ...' },
            { label: "Check for a block", detail: "If there's no refusal field, a content_filter finish_reason means the output was withheld entirely.", code: 'choice.get("finish_reason") == "content_filter"' },
            { label: "Route the outcome", detail: "Answer -> show it. Refusal -> fallback. Block -> hard stop. Three branches, three behaviors.", code: 'return "ANSWER" / "REFUSAL" / "BLOCKED"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A message is {"content": "The capital is Paris.", "refusal": None}. Is this a refusal?',
          steps: [
            "Check the refusal field first.",
            "It is None (empty), so the model did not decline.",
            "The content holds a real answer, so this is a normal reply."
          ],
          output: "No — it's a genuine answer."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "One response has message.refusal set to 'I won't do that' with finish_reason 'stop'. Another has empty content and finish_reason 'content_filter'. How should your app treat each?",
          steps: [
            "The first has a populated refusal field, so it's a REFUSAL — surface a fallback message or escalate, and you may show its explanatory text.",
            "The second has no content and a content_filter finish_reason, so it's a BLOCKED safety stop — there is nothing usable to display.",
            "Both must NOT be shown as successful answers.",
            "Neither should be retried with the identical request, since the same input will trip the same outcome."
          ],
          output: "First: handle as a refusal (fallback). Second: handle as a hard block (no usable content). Don't show either as an answer."
        }
      ],
      comparison_tables: [
        {
          title: "answer vs refusal vs safety block",
          columns: ["Outcome", "Has usable content?", "Typical signal", "How to handle"],
          rows: [
            { cells: ["Real answer", "Yes", "content filled, no refusal field", "Show it to the user"] },
            { cells: ["Refusal", "A worded 'no'", "refusal field set, often finish_reason 'stop'", "Fallback or escalate; don't present as the answer"] },
            { cells: ["Safety block", "No", "finish_reason 'content_filter'", "Hard stop; nothing to display"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "real answer vs refusal/block",
          bins: [
            { id: "answer", label: "Genuine answer (show it)" },
            { id: "refuse", label: "Refusal or block (handle gracefully)" }
          ],
          items: [
            { id: "i1", text: '"The capital of France is Paris."', bin: "answer" },
            { id: "i2", text: "\"I'm sorry, but I can't help with that.\"", bin: "refuse" },
            { id: "i3", text: "A response with finish_reason 'content_filter'", bin: "refuse" },
            { id: "i4", text: '"Here is the recipe you asked for: ..."', bin: "answer" },
            { id: "i5", text: 'A message with a populated refusal field', bin: "refuse" },
            { id: "i6", text: '"Sure! Here are three options for you."', bin: "answer" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is silently showing a refusal to the user worse than showing an outright error?",
          sampleAnswer: "An error at least signals that something went wrong, so the user knows not to trust the result and can try again. A refusal shown as the answer looks like a real, finished reply — it has the same fluent tone and 'stop' ending — so the user may believe the system genuinely couldn't help or even acted on the non-answer. Detecting the refusal lets you offer a real fallback (rephrase, escalate, explain) instead of leaving the user staring at a polite dead end they mistake for a solution."
        }
      ],
      hints: [
        "Reach into resp[\"choices\"][0][\"message\"] and check the \"refusal\" key first.",
        "Use msg.get(\"refusal\") so a missing key is treated as 'not a refusal'.",
        "If there's no refusal, fall back to printing msg.get(\"content\", \"\")."
      ],
      challenge_title: "Refusal Router",
      challenge_description: "Walk a batch of model replies, separate the genuine answers from the refusals, deliver the answers and hold back the refusals, and report the split.",
      challenge_story: "Your assistant fields a queue of user requests, but not every reply is shippable. Some come back as **refusals** — the model declined, usually with a polite 'I can't help with that.' Showing those to users as if they were answers makes the product look broken, so you add a **router**: deliver real answers untouched, and quietly hold back refusals for a fallback path. Each reply is tagged with whether it's a refusal, so your job is to branch correctly and tally the results.",
      challenge_statement: "You are given \`n\` replies. Each reply has an id, a flag, and the reply text:\n\n- If the flag is exactly \`refusal\`, the model declined — print \`<id>: REFUSED\` and do not deliver the text.\n- Otherwise (the flag is \`ok\`) it's a genuine answer — print \`<id>: <text>\`.\n\nProcess replies in input order. After all replies, print \`DELIVERED <d> REFUSED <r>\` where \`d\` is the number of answers delivered and \`r\` is the number of refusals held back.",
      challenge_input_format: "The first line is the integer `n`. Each of the next `n` lines is one reply: an id (no spaces), a single space, the flag (`ok` or `refusal`), a single space, then the reply text (which may contain spaces).",
      challenge_output_format: "One line per reply in input order (`<id>: <text>` or `<id>: REFUSED`), then a final line `DELIVERED <d> REFUSED <r>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "Each flag is exactly `ok` or `refusal`.",
        "Reply text is non-empty and may contain spaces.",
        "Split each line into at most three pieces so the text keeps its spaces.",
      ],
      challenge_examples: [
        { input: "3\na ok Here is the answer.\nb refusal I cannot help with that.\nc ok Sure thing.", output: "a: Here is the answer.\nb: REFUSED\nc: Sure thing.\nDELIVERED 2 REFUSED 1", explanation: "Replies a and c are tagged ok, so their text is delivered. Reply b is a refusal, so it's held back and shown as REFUSED. Two delivered, one refused." },
        { input: "2\nx refusal nope\ny refusal also nope", output: "x: REFUSED\ny: REFUSED\nDELIVERED 0 REFUSED 2", explanation: "Both replies are refusals, so nothing is delivered and the counts are 0 and 2." },
      ],
      challenge_notes: "Branching on a structured flag (here, the \`ok\`/\`refusal\` tag) is exactly why APIs expose a refusal signal: it lets you route without guessing from the wording. Holding refusals back instead of showing them is the graceful-handling rule from the lesson — a refusal is a 'no', not a result.",
      challenge_hints: [
        "Use \`line.split(\" \", 2)\` to separate the id, the flag, and the (possibly multi-word) text.",
        "Branch on whether the flag equals \"refusal\"; everything else is a delivered answer.",
        "Keep two counters and print the DELIVERED/REFUSED summary after the per-reply lines.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    # TODO: for each reply, deliver answers and hold back refusals,
    #       then print "DELIVERED <d> REFUSED <r>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    delivered = 0
    refused = 0
    lines = []
    for _ in range(n):
        parts = data[idx].split(" ", 2); idx += 1
        rid = parts[0]
        flag = parts[1]
        text = parts[2] if len(parts) > 2 else ""
        if flag == "refusal":
            refused += 1
            lines.append(f"{rid}: REFUSED")
        else:
            delivered += 1
            lines.append(f"{rid}: {text}")
    for l in lines:
        print(l)
    print(f"DELIVERED {delivered} REFUSED {refused}")

main()
`,
      challenge_test_cases: [
        { input: "3\na ok Here is the answer.\nb refusal I cannot help with that.\nc ok Sure thing.", expected_output: "a: Here is the answer.\nb: REFUSED\nc: Sure thing.\nDELIVERED 2 REFUSED 1", description: "Answers delivered, refusal held back, split tallied." },
        { input: "2\nx refusal nope\ny refusal also nope", expected_output: "x: REFUSED\ny: REFUSED\nDELIVERED 0 REFUSED 2", description: "All refusals: nothing delivered." },
        { input: "1\nz ok Final multi word answer here", expected_output: "z: Final multi word answer here\nDELIVERED 1 REFUSED 0", description: "Multi-word answer text is preserved intact." }
      ]
    },
    {
      id: "ai-20-l7",
      project_id: "ai-20",
      order: 7,
      title: "Tool-Call Outputs",
      concept: "ToolCalls",
      xp_reward: 10,
      explanation: `You ask your assistant "what's the weather in Paris?" and the model doesn't answer. Instead it hands back something stranger: a little structured request that says *call the function get_weather with city="Paris"*. That's not a failure — it's the model doing the smartest thing it can. It can't see the weather, so instead of hallucinating a number, it asks *you* to run the tool. Reading that branch in the response is how function calling works.

## What it is

When you give a model **tools** (functions it's allowed to invoke), a single response can come back in one of two shapes. Either the model produces ordinary **text content** — a plain answer — or it produces a **tool call**: a structured request naming a function and the arguments to pass it. The model never runs the function itself; it only *asks*. Your code runs the tool, then feeds the result back so the model can finish.

The key field is \`tool_calls\` on the message. When it's present, the model wants a function executed. When it's absent (and \`content\` is filled), the model is just talking. Your job on every response is to **branch on which one you got.**

## How it works

You inspect the message and route on the presence of a tool call:

\`\`\`python
def handle(resp):
    msg = resp["choices"][0]["message"]
    if msg.get("tool_calls"):
        call = msg["tool_calls"][0]
        name = call["function"]["name"]
        args = call["function"]["arguments"]
        return f"CALL {name} {args}"      # run the tool, then loop back
    return f"TEXT {msg['content']}"        # plain answer, just show it

resp = {"choices": [{"message": {
    "content": None,
    "tool_calls": [{"function": {"name": "get_weather", "arguments": "Paris"}}]
}}]}
print(handle(resp))   # CALL get_weather Paris
\`\`\`

Notice that when there's a tool call, \`content\` is often \`None\` — the model has nothing to *say* yet because it's waiting on the tool's result. The real flow is a loop: model asks for a tool, you run it, you send the result back, the model uses it to produce the final text answer. Reading the response correctly is step one of that loop.

The \`finish_reason\` reinforces the branch: a tool-call response typically reports \`tool_calls\` as its finish_reason instead of \`stop\`, another signal that the model paused to call a function rather than finishing an answer.

## Why it matters

Branching on tool calls is the foundation of every "agent" you'll build:

- **It's a fork, not a value.** A response is either text *or* a tool call. Assuming it's always text — reading \`content\` blindly — crashes the moment \`content\` is \`None\` on a tool call.
- **Tools are how the model acts.** Looking things up, doing math, hitting an API, sending an email — all happen because the model emitted a tool call and your code honored it.
- **The loop depends on it.** Miss the tool-call branch and the conversation stalls: the model is waiting for a result you never ran.

## The mental model to keep

A tool-aware response is **a fork in the road, not a single destination.** One branch is "here's your answer" (text); the other is "please run this for me" (a tool call). Check which branch you're on *before* you reach for the content — because on the tool-call branch, there may be no content to read.`,
      key_terms: [
        { term: "Tool call", definition: "A structured request in the response naming a function and arguments the model wants your code to run." },
        { term: "tool_calls field", definition: "The message field that holds tool calls; its presence means the model wants a function executed rather than giving plain text." },
        { term: "Function calling loop", definition: "The cycle where the model asks for a tool, your code runs it, the result is fed back, and the model finishes the answer." }
      ],
      callouts: [
        { type: "analogy", title: "A fork in the road", content: "A tool-aware response splits two ways: 'here's your answer' (text) or 'please run this for me' (a tool call). You have to check which branch you're on before reaching for the content.", position: "before" },
        { type: "warning", title: "content can be None on a tool call", content: "When the model emits a tool call, content is often None — it has nothing to say yet. Read content blindly and your code crashes. Branch on tool_calls first.", position: "after" }
      ],
      concept_diagram: {
        title: "Branching a tool-aware response",
        steps: [
          { label: "Response arrives", desc: "The message is either plain text or a tool call." },
          { label: "Check tool_calls", desc: "If the tool_calls field is present, the model wants a function run." },
          { label: "Run or show", desc: "Execute the tool on that branch; show the content on the text branch." },
          { label: "Feed result back", desc: "On a tool call, send the result so the model can finish the answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "How do you tell a tool call from a plain-text response?",
          options: ["Count the tokens", "Check whether the message has a tool_calls field", "Look at the temperature setting"],
          correct_index: 1,
          explanation: "A populated tool_calls field means the model wants a function executed; otherwise it's plain text in content."
        }
      ],
      quiz_questions: [
        {
          question: "When a response is a tool call, who actually runs the function?",
          options: [
            "The model runs it internally",
            "Your code runs it and feeds the result back",
            "The API server runs it automatically",
            "Nobody — it's just a suggestion to ignore"
          ],
          correct_index: 1,
          explanation: "The model only asks; your code executes the tool and returns the result so the model can finish."
        },
        {
          question: "Why is reading content blindly dangerous with tools enabled?",
          options: [
            "content is always encrypted",
            "On a tool-call response, content is often None, so assuming text crashes",
            "content costs extra tokens to read",
            "content is only available while streaming"
          ],
          correct_index: 1,
          explanation: "A tool-call response frequently has content == None, so you must branch on tool_calls before using content."
        },
        {
          question: "What finish_reason often signals a tool-call response?",
          options: [
            "stop",
            "tool_calls",
            "length",
            "content_filter"
          ],
          correct_index: 1,
          explanation: "A tool-call response typically reports tool_calls as its finish_reason rather than stop, reinforcing the branch."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tool-call check",
          questions: [
            { question: "When the model emits a tool call, it runs the function itself before replying.", type: "true_false", correct_answer: "false", explanation: "The model only requests the call; your code runs the tool and feeds the result back." },
            { question: "A response is either plain text or a ______ call — you must branch on which one you got.", type: "fill_in", correct_answer: "tool", explanation: "Check the tool_calls field to know which branch the response took." }
          ]
        }
      ],
      starter_code: `# Branch a response: plain text vs a tool call.
resp = {
    "choices": [
        {"message": {
            "content": None,
            "tool_calls": [{"function": {"name": "get_weather", "arguments": "Paris"}}]
        }}
    ]
}

msg = resp["choices"][0]["message"]
# TODO: if msg has tool_calls, print "CALL <name> <arguments>"; else print the content.
print(msg)
`,
      solution_code: `resp = {
    "choices": [
        {"message": {
            "content": None,
            "tool_calls": [{"function": {"name": "get_weather", "arguments": "Paris"}}]
        }}
    ]
}

msg = resp["choices"][0]["message"]
if msg.get("tool_calls"):
    call = msg["tool_calls"][0]["function"]
    print(f"CALL {call['name']} {call['arguments']}")
else:
    print(f"TEXT {msg.get('content', '')}")
`,
      expected_output: `CALL get_weather Paris`,
      step_throughs: [
        {
          title: "routing a tool-aware response",
          steps: [
            { label: "Open the message", detail: "Reach into choices[0].message — it may be text or a tool call.", code: 'msg = resp["choices"][0]["message"]' },
            { label: "Check tool_calls", detail: "If the tool_calls field is present and non-empty, the model wants a function run.", code: 'if msg.get("tool_calls"): ...' },
            { label: "Read the call", detail: "Pull the function name and arguments from the first tool call.", code: 'name = call["function"]["name"]' },
            { label: "Branch the behavior", detail: "Run the tool on this branch; on the text branch just show msg.content.", code: 'run(name, args)  # vs.  show(msg["content"])' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A message is {"content": "It is 20C in Paris.", "tool_calls": None}. Text or tool call?',
          steps: [
            "Check the tool_calls field first.",
            "It is None (absent), so the model isn't asking to run anything.",
            "The content holds a plain answer, so this is the text branch."
          ],
          output: "Plain text — show the content."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A response has content == None and tool_calls naming 'search' with arguments 'best pizza NYC', and finish_reason 'tool_calls'. Walk through what your code does next.",
          steps: [
            "content is None, so you must not try to display it as an answer.",
            "tool_calls is present, so branch into the tool path and read the first call's name ('search') and arguments ('best pizza NYC').",
            "Run the real search function with those arguments to get a result.",
            "Feed that result back to the model in a follow-up call so it can produce the final text answer."
          ],
          output: "Branch to the tool path, run search('best pizza NYC'), then send the result back for the model to finish."
        }
      ],
      comparison_tables: [
        {
          title: "text branch vs tool-call branch",
          columns: ["Aspect", "Text response", "Tool-call response"],
          rows: [
            { cells: ["tool_calls field", "Absent / None", "Present, names a function"] },
            { cells: ["content field", "The answer text", "Often None"] },
            { cells: ["finish_reason", "stop", "tool_calls"] },
            { cells: ["What you do", "Show the content", "Run the tool, feed the result back"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "plain text vs tool call",
          bins: [
            { id: "text", label: "Plain text (show content)" },
            { id: "tool", label: "Tool call (run a function)" }
          ],
          items: [
            { id: "i1", text: '{"content": "Paris is the capital.", "tool_calls": None}', bin: "text" },
            { id: "i2", text: 'A message naming get_weather with city=Paris', bin: "tool" },
            { id: "i3", text: "finish_reason 'tool_calls' with content None", bin: "tool" },
            { id: "i4", text: '{"content": "Here are three ideas...", "tool_calls": None}', bin: "text" },
            { id: "i5", text: 'A message requesting send_email(to=bob)', bin: "tool" },
            { id: "i6", text: "finish_reason 'stop' with a filled content string", bin: "text" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does the model emit a tool call instead of just answering, and what would happen if your code ignored it?",
          sampleAnswer: "The model emits a tool call when it can't produce a trustworthy answer from its own frozen knowledge — it can't see live weather, run a real search, or send an email, so instead of hallucinating it asks your code to do the real action and report back. If your code ignored the tool call and just looked for content, it would find None and either crash or show nothing, and the conversation would stall because the model is paused waiting for a result it never receives. Honoring the branch — running the tool and feeding the result back — is what lets the model finish with a grounded answer."
        }
      ],
      hints: [
        "Check msg.get(\"tool_calls\") before touching content, since content may be None.",
        "The first call is msg[\"tool_calls\"][0]; its function name and arguments live under [\"function\"].",
        "On the text branch, fall back to msg.get(\"content\", \"\")."
      ],
      challenge_title: "Tool-Call Dispatcher",
      challenge_description: "Scan a batch of model responses, send the plain-text ones straight to the user and dispatch the tool-call ones to your function runner, and report how the batch split.",
      challenge_story: "Your agent loop reads each model response and must decide what to do with it. Some responses are **plain text** — just show them. Others are **tool calls** — the model is asking your code to run a function (search, weather, email) and report back. Mixing these up breaks the agent: a tool call shown as text confuses the user, and a text answer sent to the function runner does nothing. Build the **dispatcher** that reads each response's kind, routes it correctly, and tallies the split so you can see how often the model reached for a tool.",
      challenge_statement: "You are given \`n\` responses. Each has an id, a kind, and a payload:\n\n- If the kind is exactly \`tool\`, the payload is a function name plus its arguments — print \`<id>: CALL <payload>\` (dispatch to the tool runner).\n- Otherwise (the kind is \`text\`) the payload is the answer text — print \`<id>: TEXT <payload>\` (show it to the user).\n\nProcess responses in input order. After all of them, print \`TEXT <t> TOOL <c>\` where \`t\` is how many text responses were shown and \`c\` is how many tool calls were dispatched.",
      challenge_input_format: "The first line is the integer `n`. Each of the next `n` lines is one response: an id (no spaces), a single space, the kind (`text` or `tool`), a single space, then the payload (which may contain spaces).",
      challenge_output_format: "One line per response in input order (`<id>: TEXT <payload>` or `<id>: CALL <payload>`), then a final line `TEXT <t> TOOL <c>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "Each kind is exactly `text` or `tool`.",
        "The payload is non-empty and may contain spaces.",
        "Split each line into at most three pieces so the payload keeps its spaces.",
      ],
      challenge_examples: [
        { input: "3\nr1 text The weather is nice.\nr2 tool get_weather city=Paris\nr3 tool send_email to=bob", output: "r1: TEXT The weather is nice.\nr2: CALL get_weather city=Paris\nr3: CALL send_email to=bob\nTEXT 1 TOOL 2", explanation: "r1 is plain text, shown as TEXT. r2 and r3 are tool calls, dispatched as CALL. One text, two tool calls." },
        { input: "1\nq text hello world", output: "q: TEXT hello world\nTEXT 1 TOOL 0", explanation: "A single text response is shown and counted; no tool calls were made." },
      ],
      challenge_notes: "Routing on the response kind *before* using the payload is the whole point of branching on tool_calls in real code: a tool-call response often has no text to show, so blindly treating it as text would break. Counting how often the model reaches for a tool is a useful signal for understanding how 'agentic' a given workload is.",
      challenge_hints: [
        "Use \`line.split(\" \", 2)\` to separate the id, the kind, and the (possibly multi-word) payload.",
        "Branch on whether the kind equals \"tool\"; everything else is the text branch.",
        "Keep two counters and print the TEXT/TOOL summary after the per-response lines.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    # TODO: route each response (text vs tool) and print the TEXT/TOOL summary.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    text_count = 0
    tool_count = 0
    lines = []
    for _ in range(n):
        parts = data[idx].split(" ", 2); idx += 1
        rid = parts[0]
        kind = parts[1]
        payload = parts[2] if len(parts) > 2 else ""
        if kind == "tool":
            tool_count += 1
            lines.append(f"{rid}: CALL {payload}")
        else:
            text_count += 1
            lines.append(f"{rid}: TEXT {payload}")
    for l in lines:
        print(l)
    print(f"TEXT {text_count} TOOL {tool_count}")

main()
`,
      challenge_test_cases: [
        { input: "3\nr1 text The weather is nice.\nr2 tool get_weather city=Paris\nr3 tool send_email to=bob", expected_output: "r1: TEXT The weather is nice.\nr2: CALL get_weather city=Paris\nr3: CALL send_email to=bob\nTEXT 1 TOOL 2", description: "Text shown, tool calls dispatched, split tallied." },
        { input: "1\nq text hello world", expected_output: "q: TEXT hello world\nTEXT 1 TOOL 0", description: "Single text response, no tool calls." },
        { input: "2\na tool search best pizza NYC\nb text done", expected_output: "a: CALL search best pizza NYC\nb: TEXT done\nTEXT 1 TOOL 1", description: "Multi-word tool arguments are preserved intact." }
      ]
    },
    {
      id: "ai-20-l8",
      project_id: "ai-20",
      order: 8,
      title: "Logprobs and Confidence",
      concept: "Logprobs",
      xp_reward: 10,
      explanation: `The model wrote "The capital of Australia is Canberra" and it's right — but was it *sure*? There's a number hiding in the response that answers exactly that: for every token it generated, the model can report how likely it thought that token was. Those numbers are **logprobs**, and they're the closest thing you get to a confidence meter on a model's output.

## What it is

A **logprob** is the log of the probability the model assigned to a token when it chose it. Probabilities run from 0 to 1; their logs run from negative numbers up to 0. A logprob of \`0\` means probability 1 (dead certain); a very negative logprob like \`-5\` means the model thought that token was unlikely yet picked it anyway. **Closer to 0 means more confident; more negative means less confident.**

Why logs instead of plain probabilities? Probabilities of long sequences get vanishingly tiny, and logs turn awkward multiplication into easy addition while keeping the numbers in a readable range. You don't have to love the math — you just have to read the rule: **higher (closer to zero) logprob = the model was more sure.**

## How it works

When you request logprobs, each token in the output comes with its score. You scan them for low-confidence tokens:

\`\`\`python
tokens = [
    {"token": "The", "logprob": -0.01},
    {"token": " capital", "logprob": -0.20},
    {"token": " Canberra", "logprob": -2.80},   # the model hesitated here
]

threshold = -1.0
shaky = [t["token"] for t in tokens if t["logprob"] < threshold]
print(shaky)   # [' Canberra']
\`\`\`

The token the model was *least* sure about — the most negative logprob — is often exactly where a hallucination or a guess lurks. A confident-sounding sentence can hide one wobbly token that flips it from true to false. Logprobs let you find that wobble instead of trusting the fluent surface.

A caution: a high logprob means the token was a **likely continuation**, not that it's **true**. Confidence here is about plausibility, the same trap from the hallucination lesson. Logprobs are a useful *uncertainty signal*, not a truth oracle.

## Why it matters

Logprobs turn a black-box answer into something you can inspect:

- **Flag shaky output.** Tokens below a confidence threshold are worth a second look — surface a warning, ask for verification, or re-ask.
- **Compare candidates.** When the model returns several answers, the one with higher total logprob was, on average, the more confident path.
- **Calibrate automation.** A pipeline can auto-accept high-confidence outputs and route low-confidence ones to a human, instead of treating every answer the same.

## The mental model to keep

A logprob is the model **muttering how sure it was** about each word as it wrote. Closer to zero is a steady voice; deeply negative is a nervous one. Listen for the nervous tokens — but remember confidence is about *plausible*, not *true*.`,
      key_terms: [
        { term: "Logprob", definition: "The log of the probability the model assigned to a chosen token; closer to 0 means more confident, more negative means less." },
        { term: "Confidence signal", definition: "Using logprobs to gauge how sure the model was, flagging low-confidence tokens for review." },
        { term: "Threshold", definition: "A cutoff logprob below which a token is treated as low-confidence and worth a second look." }
      ],
      callouts: [
        { type: "analogy", title: "The model muttering how sure it was", content: "Each logprob is the model's under-the-breath note on a word: a steady voice near zero, a nervous one deep in the negatives. Listen for the nervous tokens — that's where guesses hide.", position: "before" },
        { type: "warning", title: "Confident is not the same as true", content: "A high logprob means the token was a likely continuation, not that it's correct. Logprobs measure plausibility, exactly the hallucination trap. Treat them as an uncertainty signal, never a truth oracle.", position: "after" }
      ],
      concept_diagram: {
        title: "Reading logprobs as a confidence signal",
        steps: [
          { label: "Request logprobs", desc: "Ask the API to attach a logprob to each generated token." },
          { label: "Read each score", desc: "Closer to 0 = more confident; more negative = less confident." },
          { label: "Apply a threshold", desc: "Flag tokens whose logprob falls below your cutoff." },
          { label: "Act on the flags", desc: "Warn, verify, or route low-confidence output to a human." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which logprob indicates the model was MORE confident about a token?",
          options: ["-5.0", "-0.02", "They mean the same thing"],
          correct_index: 1,
          explanation: "Logprobs closer to 0 mean higher probability and more confidence; -0.02 is far more confident than -5.0."
        }
      ],
      quiz_questions: [
        {
          question: "What does a logprob of 0 mean?",
          options: [
            "The model was completely unsure",
            "The token had probability 1 — the model was certain",
            "The token was blocked",
            "The logprob feature was disabled"
          ],
          correct_index: 1,
          explanation: "log(1) = 0, so a logprob of 0 means probability 1 — maximum confidence in that token."
        },
        {
          question: "A confident-sounding sentence has one token with logprob -3.5 while the rest are near 0. What does that suggest?",
          options: [
            "The whole sentence is certainly false",
            "That one token is where the model was least sure — a likely spot for a guess or error",
            "The model ran out of tokens",
            "Logprobs cannot be compared within a sentence"
          ],
          correct_index: 1,
          explanation: "The most negative logprob marks the least-confident token, often exactly where a hallucination hides."
        },
        {
          question: "What is the key caveat about using logprobs as confidence?",
          options: [
            "They measure truth directly",
            "They measure how likely the token was (plausibility), not whether it's correct",
            "They only work while streaming",
            "They are always positive numbers"
          ],
          correct_index: 1,
          explanation: "High confidence means a likely continuation, not a true one — the same plausible-vs-true trap as hallucinations."
        }
      ],
      participation_activities: [
        {
          activity_title: "Logprob check",
          questions: [
            { question: "A logprob closer to 0 means the model was more confident about that token.", type: "true_false", correct_answer: "true", explanation: "log(probability) is 0 at probability 1 and grows more negative as probability shrinks." },
            { question: "A logprob tells you how ______ a token was as a continuation, which is plausibility, not truth.", type: "fill_in", correct_answer: "likely", explanation: "Logprobs measure likelihood/plausibility, not correctness." }
          ]
        }
      ],
      starter_code: `# Flag the low-confidence tokens by their logprobs.
tokens = [
    {"token": "The", "logprob": -0.01},
    {"token": " capital", "logprob": -0.20},
    {"token": " Canberra", "logprob": -2.80},
]

threshold = -1.0
# TODO: print each token that is below the threshold (less confident).
print(tokens)
`,
      solution_code: `tokens = [
    {"token": "The", "logprob": -0.01},
    {"token": " capital", "logprob": -0.20},
    {"token": " Canberra", "logprob": -2.80},
]

threshold = -1.0
for t in tokens:
    if t["logprob"] < threshold:
        print(f"low confidence: {t['token']} ({t['logprob']})")
`,
      expected_output: `low confidence:  Canberra (-2.8)`,
      step_throughs: [
        {
          title: "finding the shaky token in an answer",
          steps: [
            { label: "Get the logprobs", detail: "Each generated token carries its logprob when you request them.", code: 'tokens = [{"token": ..., "logprob": ...}, ...]' },
            { label: "Recall the scale", detail: "Closer to 0 means more confident; deeply negative means the model hesitated.", code: '-0.01 (sure)  vs  -2.80 (unsure)' },
            { label: "Apply a threshold", detail: "Pick a cutoff and flag any token below it as low-confidence.", code: 'if t["logprob"] < -1.0: flag(t)' },
            { label: "Act on the flag", detail: "The least-confident token is the one to verify — often where a guess hides.", code: 'verify(" Canberra")  # most negative logprob' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Two tokens have logprobs -0.05 and -1.90. Which one was the model more confident about?",
          steps: [
            "Logprobs closer to 0 mean higher probability.",
            "-0.05 is much closer to 0 than -1.90.",
            "So the model was far more confident about the -0.05 token."
          ],
          output: "The token with logprob -0.05."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A pipeline auto-accepts an answer only if every token's logprob is at least -1.0, otherwise routes it to a human. Tokens are [-0.1, -0.3, -2.2, -0.05]. What happens, and why is this safer than accepting everything?",
          steps: [
            "Scan each token against the -1.0 cutoff.",
            "Three tokens (-0.1, -0.3, -0.05) clear the bar, but -2.2 falls below it.",
            "Since at least one token is below threshold, the answer is routed to a human, not auto-accepted.",
            "This is safer because the single low-confidence token is exactly where a guess or hallucination is most likely to be — catching it prevents shipping a shaky answer unchecked."
          ],
          output: "Routed to a human, because the -2.2 token falls below the confidence threshold."
        }
      ],
      comparison_tables: [
        {
          title: "reading a logprob value",
          columns: ["Logprob", "Probability (approx)", "Confidence", "What it suggests"],
          rows: [
            { cells: ["0.0", "1.0", "Maximum", "Model was certain"] },
            { cells: ["-0.1", "~0.90", "High", "Solid, trustworthy token"] },
            { cells: ["-1.0", "~0.37", "Moderate", "Worth a glance"] },
            { cells: ["-3.0", "~0.05", "Low", "Likely a guess — verify it"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "high confidence vs low confidence",
          bins: [
            { id: "high", label: "High confidence (near 0)" },
            { id: "low", label: "Low confidence (very negative)" }
          ],
          items: [
            { id: "i1", text: "logprob -0.02", bin: "high" },
            { id: "i2", text: "logprob -4.10", bin: "low" },
            { id: "i3", text: "logprob -0.15", bin: "high" },
            { id: "i4", text: "logprob -2.90", bin: "low" },
            { id: "i5", text: "logprob 0.0", bin: "high" },
            { id: "i6", text: "logprob -3.30", bin: "low" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is a single very-negative logprob in an otherwise confident answer worth paying attention to?",
          sampleAnswer: "A fluent answer can read as completely authoritative while resting on one token the model actually wasn't sure about — and that wobbly token is precisely where a guess or hallucination tends to sit, like a made-up name, date, or number dropped into an otherwise solid sentence. A very-negative logprob is the model quietly admitting it hesitated there, so flagging it lets you verify the one risky word instead of trusting the confident surface. It turns a black-box answer into something you can spot-check at its weakest point."
        }
      ],
      hints: [
        "Loop over the tokens and compare each one's \"logprob\" to the threshold.",
        "Remember more negative = less confident, so flag logprob < threshold.",
        "Print the token text and its logprob for each flagged item."
      ],
      challenge_title: "Confidence Auditor",
      challenge_description: "Audit a generated answer token by token using its logprobs: flag every token below a confidence threshold and pinpoint the single least-confident token where a guess most likely hides.",
      challenge_story: "Your team ships model answers into a high-stakes workflow, so 'it sounded confident' isn't good enough — you want the receipts. Each generated token comes with a **logprob**: closer to zero means the model was sure, deeply negative means it hesitated. You're building a **confidence auditor** that scans every token, flags the ones below a threshold for human review, and calls out the single shakiest token — the most likely spot for a hallucination. To keep the math exact, logprobs are given as integers in hundredths (so -250 means a logprob of -2.50).",
      challenge_statement: "You are given \`n\` tokens and an integer \`threshold\` (both logprobs are in hundredths, e.g. -100 means -1.00). Each token has a text label and an integer logprob.\n\n1. A token is **low-confidence** if its logprob is strictly **less than** \`threshold\`. Count how many tokens are low-confidence.\n2. Find the **least-confident** token: the one with the smallest (most negative) logprob. If two tokens tie on logprob, pick the one whose label is **lexicographically smallest**.\n\nPrint \`FLAGGED <count>\` (the number of low-confidence tokens), then \`LEAST <label> <logprob>\` for the least-confident token.",
      challenge_input_format: "The first line has two integers `n threshold`. Each of the next `n` lines has a token label (no spaces) and an integer logprob (in hundredths), space-separated.",
      challenge_output_format: "Two lines: `FLAGGED <count>` and `LEAST <label> <logprob>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "-100000 ≤ threshold ≤ 0",
        "-100000 ≤ logprob ≤ 0",
        "Token labels contain no spaces; ties on logprob break by lexicographically smaller label.",
      ],
      challenge_examples: [
        { input: "3 -100\nthe -5\nxyzzy -250\ncat -40", output: "FLAGGED 1\nLEAST xyzzy -250", explanation: "Only `xyzzy` (-250) is below the threshold -100, so FLAGGED is 1. It is also the most negative logprob, so it's the least-confident token." },
        { input: "2 -100\na -300\nb -300", output: "FLAGGED 2\nLEAST a -300", explanation: "Both tokens are below -100, so FLAGGED is 2. They tie at -300, so the lexicographically smaller label `a` wins as least-confident." },
      ],
      challenge_notes: "Using integer hundredths keeps the comparison exact and avoids float rounding, but the meaning is the same as real logprobs: more negative = less confident. The least-confident token is highlighted because a fluent answer often hides its single guess in exactly one wobbly token — that's the one worth verifying. Remember the caveat: low confidence flags a likely guess, but high confidence still only means plausible, not true.",
      challenge_hints: [
        "Read \`n\` and \`threshold\` from the first line, then loop over the next \`n\` token lines.",
        "Count a token when its logprob is strictly less than the threshold.",
        "Track the minimum logprob seen; on a tie, keep the lexicographically smaller label.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    threshold = int(first[1])
    # TODO: count tokens below threshold and find the least-confident token,
    #       then print "FLAGGED <count>" and "LEAST <label> <logprob>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    threshold = int(first[1])
    flagged = 0
    min_lp = None
    min_token = None
    for i in range(1, n + 1):
        parts = data[i].split()
        token = parts[0]
        lp = int(parts[1])
        if lp < threshold:
            flagged += 1
        if min_lp is None or lp < min_lp or (lp == min_lp and token < min_token):
            min_lp = lp
            min_token = token
    print(f"FLAGGED {flagged}")
    print(f"LEAST {min_token} {min_lp}")

main()
`,
      challenge_test_cases: [
        { input: "3 -100\nthe -5\nxyzzy -250\ncat -40", expected_output: "FLAGGED 1\nLEAST xyzzy -250", description: "One token below threshold; it's also the least confident." },
        { input: "2 -100\na -300\nb -300", expected_output: "FLAGGED 2\nLEAST a -300", description: "Tie on logprob resolves to the lexicographically smaller label." },
        { input: "4 -50\nThe 0\ncapital -10\nis -8\nCanberra -280", expected_output: "FLAGGED 1\nLEAST Canberra -280", description: "A confident sentence with one shaky token flagged and pinpointed." }
      ]
    }
  ]
};
