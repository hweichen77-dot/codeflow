export default {
  project: {
    id: "ai-13",
    title: "Streaming, Latency & Caching",
    description: "Make AI apps feel fast: stream tokens as they arrive, cache repeated prompts, batch work for throughput, and measure the latency numbers that actually matter.",
    difficulty: "advanced",
    category: "ai_ml",
    estimated_time: 50,
    lessons_count: 5,
    tags: ["streaming", "latency", "caching", "throughput", "performance", "sse"],
    order: 13,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-13-l1",
      project_id: "ai-13",
      order: 1,
      title: "Why Streaming Matters (Time To First Token)",
      concept: "Streaming",
      xp_reward: 10,
      explanation: `A user waits eight seconds staring at a spinner, then a full paragraph appears at once. The same answer, streamed, shows its first word in 400 milliseconds and feels instant. The total time barely changed. The *perceived* time collapsed. That gap is the entire reason streaming exists.

## What it is

**Streaming** means sending the model's output to the user token by token as it is generated, instead of waiting for the whole response and shipping it in one block. The model already produces text one token at a time (that autocomplete loop), so streaming just stops hiding that process behind a wall.

The number that captures the win is **time to first token (TTFT)**: how long from sending the request until the very first token shows up. With streaming, TTFT is small. Without it, TTFT equals the total generation time, because nothing appears until the end.

## How it works

A non-streaming call blocks until done, then returns everything. A streaming call opens a connection and pushes each token as the model emits it:

\`\`\`python
# non-streaming: one big wait, then everything
response = client.create(prompt="Explain TTFT")
print(response.text)        # nothing until fully done

# streaming: tokens arrive as they're generated
for chunk in client.stream(prompt="Explain TTFT"):
    print(chunk.text, end="", flush=True)   # prints as it comes
\`\`\`

Two latency numbers now matter instead of one:

1. **TTFT** — time until the first token. Dominated by the model "thinking" about your prompt before it can speak.
2. **Inter-token latency** — the gap between each following token. This sets the *typing speed* the user sees.

Total time is roughly \`TTFT + (tokens - 1) * inter_token_latency\`. Streaming does not shrink the total; it surfaces output during it.

## Why it matters

- **Perceived speed.** Humans tolerate a long task far better when they see progress. A 6-second streamed answer feels faster than a 3-second blocked one.
- **Early exit.** If the first sentence already answers the question, the user (or your code) can stop reading and cancel the rest, saving output tokens and money.
- **Failure visibility.** A stalled stream is obvious immediately; a blocked call just looks like a slow spinner until it times out.

The trade-off: streaming is harder to handle. You must parse a live event stream, deal with partial tokens, and decide what to do if the connection drops mid-answer.

## The mental model to keep

**Streaming doesn't make the answer faster. It makes the wait feel faster by showing the work as it happens — and TTFT is the number your users actually feel.**`,
      key_terms: [
        { term: "Streaming", definition: "Sending model output token by token as it is generated, rather than all at once at the end." },
        { term: "Time to first token (TTFT)", definition: "The delay between sending a request and receiving the first token of the response." },
        { term: "Inter-token latency", definition: "The time gap between consecutive tokens, which sets the visible typing speed." }
      ],
      callouts: [
        { type: "analogy", title: "A waiter who talks while cooking", content: "Non-streaming is a waiter who vanishes into the kitchen and returns only when the whole meal is plated. Streaming is a waiter who brings each dish out the moment it's ready. Same total kitchen time, very different experience at the table.", position: "before" },
        { type: "insight", title: "Total time barely moves", content: "Streaming rarely changes the end-to-end duration. It just stops hiding it behind a spinner. The win is perception and the option to bail out early, not raw speed.", position: "after" }
      ],
      concept_diagram: {
        title: "Blocked response vs streamed response",
        steps: [
          { label: "Send prompt", desc: "Your request reaches the model in both modes." },
          { label: "Model starts generating", desc: "First token is ready after the TTFT delay." },
          { label: "Blocked: keep waiting", desc: "Non-streaming buffers every token silently until the last one." },
          { label: "Streamed: push each token", desc: "Streaming forwards each token immediately, so output appears during generation." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does time to first token (TTFT) measure?",
          options: ["The total time to generate the whole answer", "The delay until the first token of the response appears", "The number of tokens in the prompt"],
          correct_index: 1,
          explanation: "TTFT is the gap from sending the request to seeing the very first token, which is what users feel as responsiveness."
        }
      ],
      quiz_questions: [
        {
          question: "How does streaming change the total end-to-end time of a response?",
          options: [
            "It roughly halves the total time",
            "It barely changes the total time but surfaces output during it",
            "It always makes the total time longer",
            "It removes inter-token latency entirely"
          ],
          correct_index: 1,
          explanation: "Streaming shows tokens as they are produced. The total generation time is about the same; the perceived wait drops because progress is visible."
        },
        {
          question: "In a non-streaming call, what does TTFT effectively equal?",
          options: [
            "Zero, because nothing is generated",
            "The inter-token latency of a single token",
            "The total generation time, since nothing appears until the end",
            "The size of the prompt in tokens"
          ],
          correct_index: 2,
          explanation: "Without streaming, the first visible output is the whole response, so TTFT collapses into the total time."
        },
        {
          question: "Which benefit is unique to streaming, not blocked responses?",
          options: [
            "Lower API cost per token",
            "The ability to stop early once the answer is good enough",
            "A larger context window",
            "Guaranteed correctness of the output"
          ],
          correct_index: 1,
          explanation: "Because tokens arrive incrementally, a user or program can cancel mid-stream and avoid paying for the rest of the output."
        }
      ],
      participation_activities: [
        {
          activity_title: "Streaming sense-check",
          questions: [
            { question: "Streaming reduces the total time the model spends generating the answer.", type: "true_false", correct_answer: "false", explanation: "Streaming surfaces output during generation but does not meaningfully shorten total generation time." },
            { question: "The delay until the first token appears is called time to ______ token.", type: "fill_in", correct_answer: "first", explanation: "Time to first token (TTFT) is the responsiveness metric users feel most." }
          ]
        }
      ],
      starter_code: `# Model the latency of a response and compute TTFT vs total time.
ttft = 0.4              # seconds until first token
inter_token = 0.02      # seconds between each later token
num_tokens = 100

# TODO: total = ttft + (num_tokens - 1) * inter_token
# Print TTFT and the total time.
print("ttft:", ttft)
`,
      solution_code: `ttft = 0.4              # seconds until first token
inter_token = 0.02      # seconds between each later token
num_tokens = 100

total = ttft + (num_tokens - 1) * inter_token

print("ttft:", ttft)
print("total:", round(total, 2))
`,
      expected_output: `ttft: 0.4
total: 2.38`,
      step_throughs: [
        {
          title: "one request, streamed token by token",
          steps: [
            { label: "Send the prompt", detail: "Your request reaches the model. The clock starts now; nothing is visible yet.", code: 'stream = client.stream(prompt="Explain streaming")' },
            { label: "First token arrives (TTFT)", detail: "After the model processes your prompt, the first token is pushed. This delay is the TTFT the user feels.", code: 'chunk -> "Stream"   # t = 0.4s, this is TTFT' },
            { label: "More tokens flow in", detail: "Each following token arrives after a small inter-token gap. The text appears to type itself.", code: 'chunk -> "ing"  chunk -> " sends"  chunk -> " tokens"' },
            { label: "Stop signal ends the stream", detail: "The model emits its stop token; the loop ends. Total time is TTFT plus all the inter-token gaps.", code: "chunk -> <STOP>   # total = 2.38s" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A response has TTFT of 0.5s and produces 51 tokens with 0.01s between tokens. What is the total time?",
          steps: [
            "There are 51 tokens, so there are 50 inter-token gaps after the first token.",
            "Gap time = 50 * 0.01 = 0.5s.",
            "Total = TTFT + gap time = 0.5 + 0.5 = 1.0s."
          ],
          output: "1.0 seconds total"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two designs answer the same question. A is non-streaming with total time 3.0s. B streams with TTFT 0.4s and the same 3.0s total. The answer is fully decided by the first sentence (about 20 tokens). Which design lets the user act sooner, and by roughly how much?",
          steps: [
            "Non-streaming A shows nothing until 3.0s, so the user can only act at 3.0s.",
            "Streaming B shows the first token at 0.4s and keeps typing; if the answer is clear after ~20 tokens, the user reads it well before the full 3.0s.",
            "Even at a slow 0.05s per token, 20 tokens finish around 0.4 + 19 * 0.05 = 1.35s.",
            "So B lets the user act at roughly 1.35s instead of 3.0s, saving about 1.6s of perceived wait and allowing an early exit."
          ],
          output: "Streaming B; the user can act around 1.35s vs 3.0s, roughly 1.6s sooner."
        }
      ],
      comparison_tables: [
        {
          title: "blocked response vs streamed response",
          columns: ["Aspect", "Non-streaming (blocked)", "Streaming"],
          rows: [
            { cells: ["First visible output", "After full generation", "After TTFT (first token)"] },
            { cells: ["Total generation time", "Same", "Same"] },
            { cells: ["Early exit possible", "No", "Yes, cancel mid-stream"] },
            { cells: ["Perceived responsiveness", "Slow spinner", "Feels instant and alive"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what streaming changes vs what it does not",
          bins: [
            { id: "changes", label: "Streaming improves this" },
            { id: "same", label: "Streaming does NOT change this" }
          ],
          items: [
            { id: "i1", text: "Time until the first token appears", bin: "changes" },
            { id: "i2", text: "Total tokens the model must generate", bin: "same" },
            { id: "i3", text: "Ability to stop reading early", bin: "changes" },
            { id: "i4", text: "Perceived responsiveness for the user", bin: "changes" },
            { id: "i5", text: "Correctness of the final answer", bin: "same" },
            { id: "i6", text: "Total end-to-end generation time", bin: "same" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if streaming barely changes the total time, why is it worth the extra engineering complexity?",
          sampleAnswer: "Because users experience time, not stopwatch time. Seeing the answer start within a few hundred milliseconds makes the app feel alive, keeps people from abandoning the request, and lets them stop once they have what they need. The total may be identical, but the perceived wait and the option to bail out early are real wins that justify the harder stream-parsing code."
        }
      ],
      hints: [
        "There are (num_tokens - 1) gaps after the first token.",
        "total = ttft + (num_tokens - 1) * inter_token.",
        "Use round(total, 2) so the printed number is clean."
      ],
      challenge_title: "Compare two responses by TTFT",
      challenge_description: "Write a function faster_first(a_ttft, b_ttft) that returns 'A' if response A has the lower TTFT, 'B' if B is lower, and 'tie' if they are equal. Test it on (0.4, 0.9) and print the result.",
      challenge_starter_code: `# TODO: define faster_first(a_ttft, b_ttft) returning 'A', 'B', or 'tie'.
# Then print the result for (0.4, 0.9).
`,
      challenge_solution_code: `def faster_first(a_ttft, b_ttft):
    if a_ttft < b_ttft:
        return "A"
    if b_ttft < a_ttft:
        return "B"
    return "tie"

print(faster_first(0.4, 0.9))
`,
      challenge_test_cases: [
        { input: "a_ttft=0.4, b_ttft=0.9", expected_output: "A", description: "A has the lower TTFT, so it feels faster." },
        { input: "a_ttft=0.5, b_ttft=0.5", expected_output: "tie", description: "Equal TTFT returns 'tie'." }
      ]
    },
    {
      id: "ai-13-l2",
      project_id: "ai-13",
      order: 2,
      title: "Server-Sent Events",
      concept: "SSE",
      xp_reward: 10,
      explanation: `Open the network tab while a chat app types out an answer and you will see one long-lived HTTP response, not a flood of separate requests. Each line of it starts with \`data:\`. That is **Server-Sent Events (SSE)** — the simple, text-based protocol almost every streaming LLM API uses to push tokens to you.

## What it is

**Server-Sent Events** is a one-way streaming channel: the server holds an HTTP connection open and keeps sending small text **events** down it until it is done. The client does not poll and does not send anything back over this channel — it just reads events as they arrive. It is plain HTTP, so it works through normal proxies and needs no special handshake like WebSockets do.

For LLMs, each event carries one chunk of the response, usually a token or a few tokens packaged as JSON.

## How it works

The body is a stream of text with a strict, tiny format. Each event is one or more lines, and a blank line separates events:

\`\`\`text
data: {"token": "Hello"}

data: {"token": " world"}

data: [DONE]
\`\`\`

The rules you must handle:

- Lines beginning with \`data:\` carry the payload. Strip the prefix and parse the rest (often JSON).
- A **blank line** marks the end of one event.
- A sentinel like \`[DONE]\` signals the stream is finished, so you stop reading.

Parsing it in Python looks like this:

\`\`\`python
for line in response.iter_lines():
    if not line:
        continue                      # blank line: event boundary
    if line.startswith("data:"):
        payload = line[len("data:"):].strip()
        if payload == "[DONE]":
            break                     # stream finished
        chunk = json.loads(payload)
        print(chunk["token"], end="", flush=True)
\`\`\`

You accumulate the tokens to rebuild the full message, while showing each one the instant it lands.

## Why it matters

- **It is the standard.** OpenAI, Anthropic, and most providers stream over SSE, so knowing the format means you can read any of them.
- **It is robust and simple.** Being plain HTTP, it survives most corporate proxies and load balancers that block fancier protocols.
- **You must handle partial and broken streams.** A dropped connection can leave you with half an answer. Real clients buffer, detect the missing \`[DONE]\`, and decide whether to retry or surface what they have.

## The mental model to keep

**SSE is a one-way firehose of \`data:\` lines. Read line by line, strip the prefix, watch for the blank-line boundary and the done sentinel, and you can consume any LLM stream on the planet.**`,
      key_terms: [
        { term: "Server-Sent Events (SSE)", definition: "A one-way protocol where the server pushes a stream of text events over a single open HTTP connection." },
        { term: "Event", definition: "One unit in an SSE stream, typically a 'data:' line carrying a token or chunk, ended by a blank line." },
        { term: "Done sentinel", definition: "A marker like [DONE] that tells the client the stream is finished and it can stop reading." }
      ],
      callouts: [
        { type: "analogy", title: "A ticker tape, not a phone call", content: "SSE is like a stock ticker tape printing one line at a time from the server to you. It only goes one direction. WebSockets are a two-way phone call; SSE is just the tape reeling out updates.", position: "before" },
        { type: "warning", title: "Always handle a broken stream", content: "Connections drop. If the [DONE] sentinel never arrives, you may be holding a half-finished answer. Production clients detect this and decide to retry or show the partial result clearly.", position: "after" }
      ],
      concept_diagram: {
        title: "How a client consumes an SSE stream",
        steps: [
          { label: "Open the connection", desc: "Client makes one HTTP request; the server keeps the response open." },
          { label: "Read a line", desc: "Each 'data:' line carries one chunk of the response." },
          { label: "Parse the payload", desc: "Strip the 'data:' prefix and parse the JSON token inside." },
          { label: "Stop at the sentinel", desc: "When a [DONE] marker arrives, the client closes the loop." }
        ]
      },
      inline_quizzes: [
        {
          question: "In an SSE stream, what marks the boundary between two events?",
          options: ["A comma", "A blank line", "A closing brace"],
          correct_index: 1,
          explanation: "Each SSE event ends with a blank line, which separates it from the next event in the stream."
        }
      ],
      quiz_questions: [
        {
          question: "Which best describes the direction of communication in SSE?",
          options: [
            "Two-way: both client and server send messages freely",
            "One-way: the server pushes events to the client over an open connection",
            "Client polls the server repeatedly with new requests",
            "Peer-to-peer between two clients"
          ],
          correct_index: 1,
          explanation: "SSE is one-directional. The server streams events down a single held-open HTTP response; the client only reads."
        },
        {
          question: "When reading an SSE line that begins with 'data:', what should the client do?",
          options: [
            "Ignore it because it is metadata",
            "Strip the 'data:' prefix and parse the remaining payload",
            "Close the connection immediately",
            "Send it back to the server"
          ],
          correct_index: 1,
          explanation: "The payload follows the 'data:' prefix; the client strips the prefix and parses the rest, often as JSON."
        },
        {
          question: "Why is SSE often preferred over WebSockets for streaming LLM responses?",
          options: [
            "It is faster than every other protocol",
            "It is plain HTTP, so it is simple and survives most proxies",
            "It encrypts data automatically without TLS",
            "It allows the client to push tokens to the server"
          ],
          correct_index: 1,
          explanation: "SSE rides on ordinary HTTP, needs no special handshake, and passes through most proxies and load balancers that block WebSockets."
        }
      ],
      participation_activities: [
        {
          activity_title: "SSE parsing check",
          questions: [
            { question: "In SSE, the client sends tokens back to the server over the same connection.", type: "true_false", correct_answer: "false", explanation: "SSE is one-way; the server pushes events and the client only reads them." },
            { question: "A marker like ______ tells the client the SSE stream is finished.", type: "fill_in", correct_answer: "[DONE]", explanation: "The done sentinel signals end of stream so the client stops reading." }
          ]
        }
      ],
      starter_code: `# Parse a simulated SSE stream into the full message.
import json

lines = [
    'data: {"token": "Hello"}',
    '',
    'data: {"token": " world"}',
    '',
    'data: [DONE]',
]

message = ""
# TODO: loop over lines. Skip blanks. For 'data:' lines, strip the prefix,
# stop at [DONE], otherwise parse JSON and append the token to message.
print(message)
`,
      solution_code: `import json

lines = [
    'data: {"token": "Hello"}',
    '',
    'data: {"token": " world"}',
    '',
    'data: [DONE]',
]

message = ""
for line in lines:
    if not line:
        continue
    if line.startswith("data:"):
        payload = line[len("data:"):].strip()
        if payload == "[DONE]":
            break
        chunk = json.loads(payload)
        message += chunk["token"]

print(message)
`,
      expected_output: `Hello world`,
      step_throughs: [
        {
          title: "consuming an SSE stream line by line",
          steps: [
            { label: "Read a data line", detail: "The first non-blank line starts with 'data:'. Strip that prefix to expose the JSON payload.", code: "line = 'data: {token: Hello}'  ->  payload = '{token: Hello}'" },
            { label: "Parse and append", detail: "Parse the JSON and append the token to your growing message buffer.", code: 'message += json.loads(payload)["token"]  # "Hello"' },
            { label: "Hit a blank line", detail: "A blank line is just an event boundary. Skip it and keep reading the next event.", code: 'if not line: continue  # event boundary' },
            { label: "Reach the sentinel", detail: "The [DONE] payload means the stream is finished. Break out of the loop and use the assembled message.", code: 'if payload == "[DONE]": break  # message = "Hello world"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'An SSE stream sends: data: {"token": "AI"} then a blank line then data: {"token": " rocks"}. What full message do you assemble?',
          steps: [
            'Parse the first data line: the token is "AI". Message is now "AI".',
            "The blank line is an event boundary, so skip it.",
            'Parse the next data line: the token is " rocks". Append it.',
            'Message becomes "AI rocks".'
          ],
          output: '"AI rocks"'
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A stream sends three valid token events, then the connection drops before any [DONE] sentinel arrives. How should a robust client behave, and what does it have?",
          steps: [
            "The client has accumulated three tokens of a partial message, but never saw the [DONE] marker.",
            "Because the loop ends due to the connection closing rather than the sentinel, the client should flag the result as incomplete.",
            "A robust client distinguishes a clean finish (saw [DONE]) from a truncated one (stream ended without it).",
            "It then decides policy: retry the request, or surface the partial answer clearly labeled as incomplete rather than pretending it is whole."
          ],
          output: "It holds a partial, unterminated message and should mark it incomplete, then retry or surface it as partial."
        }
      ],
      comparison_tables: [
        {
          title: "SSE vs WebSockets for LLM streaming",
          columns: ["Aspect", "SSE", "WebSockets"],
          rows: [
            { cells: ["Direction", "One-way (server to client)", "Two-way"] },
            { cells: ["Transport", "Plain HTTP", "Upgraded connection"] },
            { cells: ["Proxy friendliness", "High", "Often blocked"] },
            { cells: ["Fit for streaming tokens", "Ideal and standard", "Overkill for one-way"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what is true of SSE vs WebSockets",
          bins: [
            { id: "sse", label: "Server-Sent Events" },
            { id: "ws", label: "WebSockets" }
          ],
          items: [
            { id: "i1", text: "One-way server-to-client stream", bin: "sse" },
            { id: "i2", text: "Full two-way communication", bin: "ws" },
            { id: "i3", text: "Plain HTTP, no special handshake", bin: "sse" },
            { id: "i4", text: "Uses 'data:' lines and a blank-line boundary", bin: "sse" },
            { id: "i5", text: "Requires a connection upgrade", bin: "ws" },
            { id: "i6", text: "The default for most LLM streaming APIs", bin: "sse" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does the simple text-and-blank-line format of SSE make it a good fit for streaming LLM tokens?",
          sampleAnswer: "LLM output is naturally a one-way stream of small chunks, which is exactly what SSE delivers. Its plain-HTTP, line-by-line format is trivial to parse and passes through proxies that block fancier protocols, and the blank-line boundary plus a done sentinel give the client clear signals for where each token ends and when the whole response is complete. The protocol matches the shape of the data without adding unnecessary two-way complexity."
        }
      ],
      hints: [
        "Skip empty lines with 'if not line: continue'.",
        "Use line.startswith('data:') and line[len('data:'):].strip() to get the payload.",
        "Break the loop when the payload equals '[DONE]'; otherwise json.loads it and append the token."
      ],
      challenge_title: "Count tokens in an SSE stream",
      challenge_description: "Write a function count_tokens(lines) that returns how many token events an SSE stream contains. Count only lines that start with 'data:' and are not the [DONE] sentinel. Test it on a stream with two token events plus a [DONE] line.",
      challenge_starter_code: `lines = [
    'data: {"token": "a"}',
    '',
    'data: {"token": "b"}',
    '',
    'data: [DONE]',
]

# TODO: define count_tokens(lines) and print the count.
`,
      challenge_solution_code: `lines = [
    'data: {"token": "a"}',
    '',
    'data: {"token": "b"}',
    '',
    'data: [DONE]',
]

def count_tokens(lines):
    count = 0
    for line in lines:
        if line.startswith("data:"):
            payload = line[len("data:"):].strip()
            if payload != "[DONE]":
                count += 1
    return count

print(count_tokens(lines))
`,
      challenge_test_cases: [
        { input: "stream with 2 token events + [DONE]", expected_output: "2", description: "Counts the two token data lines and ignores the sentinel and blanks." }
      ]
    },
    {
      id: "ai-13-l3",
      project_id: "ai-13",
      order: 3,
      title: "Prompt Caching",
      concept: "Caching",
      xp_reward: 10,
      explanation: `You send a 4,000-token system prompt and a long document to a model, then ask ten follow-up questions about it. Without caching, the model re-processes those 4,000 tokens ten times and you pay for them ten times. With **prompt caching**, it processes them once, stores the result, and the next nine calls reuse it — often 90 percent cheaper and noticeably faster. The trick is structuring the prompt so the cache can actually hit.

## What it is

**Prompt caching** stores the model's internal processing of a fixed **prefix** of your prompt so that repeated requests sharing that prefix skip the work. The expensive part of inference is reading the prompt (the "prefill"); caching saves that prefill for the parts that do not change between calls.

A cache entry is keyed on the **exact prefix** of tokens. Reuse only happens when the start of the new prompt matches the cached prefix byte for byte.

## How it works

The cache reuses a prefix only up to the first point where the new prompt differs. So the order of your prompt parts is everything: put the stable, reusable content first, and the changing content last.

\`\`\`text
[ system instructions ]  <- stable, cache this
[ big reference document ]  <- stable, cache this
--- cache breakpoint ---
[ user's new question ]  <- changes every call, after the cached part
\`\`\`

If you instead put the changing question at the top, the prefix differs on every call and the cache never hits. The mechanics:

1. **First call** writes the cache. You pay a normal (sometimes slightly higher) price to process and store the prefix.
2. **Later calls** within the cache lifetime read it. The shared prefix is billed at a steep discount and processed almost instantly.
3. The entry **expires** after a short time-to-live (often a few minutes), so caching helps bursts of related calls, not requests spread hours apart.

\`\`\`python
# stable prefix first, variable part last -> cache hits
prompt = system_prompt + reference_doc + user_question
#         \\_____________ cached _____________/   \\__ varies __/
\`\`\`

## Why it matters

- **Cost.** Cached input tokens are billed at a fraction of the normal rate, so a long shared context becomes cheap to reuse.
- **Latency.** Skipping the prefill of a huge prefix cuts TTFT noticeably on follow-up calls.
- **It is order-sensitive and fragile.** Change one token in the prefix, reorder sections, or even tweak whitespace, and the cache misses. You must design prompts deliberately to keep the cacheable part identical.

## The mental model to keep

**Caching pays to read a fixed prefix once and then rents it out cheaply. Put everything stable first, everything variable last, and keep the cached part byte-for-byte identical — otherwise you pay full price every time.**`,
      key_terms: [
        { term: "Prompt caching", definition: "Storing the model's processing of a fixed prompt prefix so repeated requests that share it skip the work and cost." },
        { term: "Prefix", definition: "The beginning portion of a prompt; caching reuses it only up to the first token that differs." },
        { term: "Time-to-live (TTL)", definition: "How long a cache entry stays valid before it expires and must be recomputed." }
      ],
      callouts: [
        { type: "analogy", title: "Pre-heated oven", content: "Re-reading a long system prompt every call is like reheating a cold oven for each dish. Caching keeps the oven hot: the expensive warm-up happens once, and every following dish cooks fast and cheap.", position: "before" },
        { type: "tip", title: "Stable first, variable last", content: "Order your prompt so the unchanging parts (system instructions, reference docs) come first and the per-request question comes last. The cache reuses the prefix only up to the first difference.", position: "after" }
      ],
      concept_diagram: {
        title: "How a cached prefix saves work",
        steps: [
          { label: "Build a stable prefix", desc: "Put system instructions and reference text at the front." },
          { label: "First call writes cache", desc: "The prefix is processed once and stored, at normal price." },
          { label: "Later calls read cache", desc: "Matching prefixes are billed at a steep discount and skip prefill." },
          { label: "Entry expires by TTL", desc: "After the time-to-live, the cache clears and must be rebuilt." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where should the part of a prompt that changes every request go to allow caching?",
          options: ["At the very start, before the system prompt", "At the end, after the stable cached content", "It does not matter where it goes"],
          correct_index: 1,
          explanation: "The cache reuses the prefix only up to the first difference, so changing content must come last to keep the stable prefix identical."
        }
      ],
      quiz_questions: [
        {
          question: "What does prompt caching actually store and reuse?",
          options: [
            "The final answer text for a question",
            "The model's processing of a fixed prompt prefix",
            "The user's account preferences",
            "A random sample of past prompts"
          ],
          correct_index: 1,
          explanation: "Caching saves the expensive prefill work for a stable prefix so later calls sharing that prefix skip it."
        },
        {
          question: "Why does putting the variable question at the TOP of the prompt break caching?",
          options: [
            "The model refuses prompts that start with questions",
            "The prefix differs on every call, so nothing reusable matches",
            "Questions cannot be tokenized",
            "Caching only works on output, not input"
          ],
          correct_index: 1,
          explanation: "The cache matches an exact prefix. If the first thing differs each time, there is no shared prefix to reuse."
        },
        {
          question: "Which pair of benefits does prompt caching primarily deliver?",
          options: [
            "Higher accuracy and longer context windows",
            "Lower cost on shared input and lower TTFT on follow-up calls",
            "Automatic fact-checking and grounding",
            "Stronger encryption and privacy"
          ],
          correct_index: 1,
          explanation: "Cached input tokens are billed at a discount and skip the prefill, cutting both cost and time to first token for repeated prefixes."
        }
      ],
      participation_activities: [
        {
          activity_title: "Caching design check",
          questions: [
            { question: "Changing a single token in the cached prefix still lets the cache hit.", type: "true_false", correct_answer: "false", explanation: "Cache matching is exact; any change in the prefix causes a miss." },
            { question: "A cache entry clears after its time-to-______ expires.", type: "fill_in", correct_answer: "live", explanation: "Time-to-live (TTL) governs how long a cached prefix stays valid." }
          ]
        }
      ],
      starter_code: `# Decide whether two prompts share a cacheable prefix.
def cache_hits(prefix, prompt_a, prompt_b):
    # A cache built from prompt_a hits for prompt_b only if both
    # start with the same cached prefix.
    return prompt_a.startswith(prefix) and prompt_b.startswith(prefix)

system = "You are a helpful assistant. "
a = system + "Question: capital of France?"
b = system + "Question: capital of Japan?"

# TODO: print whether the cache hits for prefix=system.
print("system:", system)
`,
      solution_code: `def cache_hits(prefix, prompt_a, prompt_b):
    return prompt_a.startswith(prefix) and prompt_b.startswith(prefix)

system = "You are a helpful assistant. "
a = system + "Question: capital of France?"
b = system + "Question: capital of Japan?"

print("system:", system)
print("cache hits:", cache_hits(system, a, b))
`,
      expected_output: `system: You are a helpful assistant.
cache hits: True`,
      step_throughs: [
        {
          title: "a cached prefix across follow-up calls",
          steps: [
            { label: "Assemble stable prefix", detail: "Concatenate the system instructions and reference document first. This block will not change between questions.", code: "prefix = system_prompt + reference_doc  # stable" },
            { label: "First call writes the cache", detail: "Append the first question and send. The model processes the whole prefix once and stores it at normal price.", code: "send(prefix + q1)  # cache written, full price" },
            { label: "Follow-up call reads the cache", detail: "The next question shares the identical prefix, so the prefill is reused at a steep discount and TTFT drops.", code: "send(prefix + q2)  # prefix reused, ~90% cheaper" },
            { label: "TTL expires", detail: "After a few minutes of inactivity, the entry clears. The next call must recompute and rewrite the prefix.", code: "wait > ttl  ->  next call rewrites cache" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You send the same 1,000-token system prompt with 5 different questions appended. With caching, how many times is that system prompt fully processed?",
          steps: [
            "The system prompt is the stable prefix, identical across all 5 calls.",
            "The first call processes and caches it once.",
            "The next 4 calls reuse the cached prefix instead of reprocessing it.",
            "So the system prompt is fully processed exactly one time."
          ],
          output: "Once, then reused for the other four calls."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A prefix of 4,000 input tokens is reused across 10 calls. Normal input is $3 per million tokens; cached input is $0.30 per million. Ignoring the per-call question, what does the prefix cost with caching vs without?",
          steps: [
            "Without caching: 10 calls each pay full price for 4,000 tokens = 40,000 tokens * $3 / 1,000,000 = $0.12.",
            "With caching: the first call writes the cache at full price: 4,000 * $3 / 1,000,000 = $0.012.",
            "The other 9 calls read the cached prefix: 9 * 4,000 = 36,000 tokens * $0.30 / 1,000,000 = $0.0108.",
            "Cached total = $0.012 + $0.0108 = $0.0228, versus $0.12 without caching."
          ],
          output: "About $0.023 with caching vs $0.12 without, roughly an 81% saving on the prefix."
        }
      ],
      comparison_tables: [
        {
          title: "cache hit vs cache miss",
          columns: ["Factor", "Cache hit", "Cache miss"],
          rows: [
            { cells: ["Prefix match", "Exact, byte for byte", "Differs somewhere in the prefix"] },
            { cells: ["Variable part location", "At the end", "Near the start"] },
            { cells: ["Input cost", "Steeply discounted", "Full price"] },
            { cells: ["TTFT on follow-up", "Much lower", "Same as a cold call"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "helps caching vs breaks caching",
          bins: [
            { id: "helps", label: "Helps the cache hit" },
            { id: "breaks", label: "Breaks the cache" }
          ],
          items: [
            { id: "i1", text: "Putting the system prompt first", bin: "helps" },
            { id: "i2", text: "Editing one word in the cached prefix", bin: "breaks" },
            { id: "i3", text: "Appending the changing question at the end", bin: "helps" },
            { id: "i4", text: "Reordering sections of the prefix each call", bin: "breaks" },
            { id: "i5", text: "Sending follow-ups within the TTL window", bin: "helps" },
            { id: "i6", text: "Inserting a timestamp at the top of every prompt", bin: "breaks" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is the ORDER of the parts of your prompt the single most important factor for prompt caching?",
          sampleAnswer: "Caching reuses a prefix only up to the first token where two prompts differ, so anything stable has to come before anything that changes. If the variable question or a timestamp sits at the top, the very first bytes differ on every call and the cache never matches, even though most of the prompt is identical. Putting the system prompt and reference material first keeps that long prefix byte-for-byte the same, which is exactly what the cache needs to hit and discount it."
        }
      ],
      hints: [
        "str.startswith(prefix) tells you if a prompt begins with the cached prefix.",
        "The cache only hits if BOTH prompts share that exact prefix.",
        "Combine the two checks with 'and'."
      ],
      challenge_title: "Find the shared cacheable prefix",
      challenge_description: "Write a function shared_prefix(a, b) that returns the longest common starting substring of two prompts. This is the part a cache could reuse. Test it on 'You are helpful. Q: France?' and 'You are helpful. Q: Japan?' and print the result.",
      challenge_starter_code: `# TODO: define shared_prefix(a, b) returning the longest common prefix string.
a = "You are helpful. Q: France?"
b = "You are helpful. Q: Japan?"
`,
      challenge_solution_code: `def shared_prefix(a, b):
    i = 0
    limit = min(len(a), len(b))
    while i < limit and a[i] == b[i]:
        i += 1
    return a[:i]

a = "You are helpful. Q: France?"
b = "You are helpful. Q: Japan?"
print(shared_prefix(a, b))
`,
      challenge_test_cases: [
        { input: "two prompts sharing 'You are helpful. Q: '", expected_output: "You are helpful. Q: ", description: "Returns the common starting substring that a cache could reuse." }
      ]
    },
    {
      id: "ai-13-l4",
      project_id: "ai-13",
      order: 4,
      title: "Batching & Concurrency",
      concept: "Throughput",
      xp_reward: 10,
      explanation: `You have 1,000 documents to classify. Sent one at a time, each waiting for the last to finish, the job takes an hour. Sent with 50 requests in flight at once, it finishes in a couple of minutes — same model, same total work, completely different wall-clock time. The difference is **throughput**, and the levers are **batching** and **concurrency**.

## What it is

**Throughput** is how much work you finish per unit of time — requests per second, or tokens per second across a whole job. It is a different question from **latency**, which is how long a single request takes. A model can have high latency per call yet enormous throughput if it handles many calls in parallel.

Two ways to raise throughput:

- **Concurrency**: send many independent requests at the same time so their wait times overlap instead of stacking up.
- **Batching**: hand the model several inputs in one request (or one internal batch) so it processes them together far more efficiently than one by one.

## How it works

Most of a request's latency is spent waiting on the network and the model, not on your CPU. So while one request waits, you can have dozens of others waiting too. Serial code wastes that idle time:

\`\`\`python
# serial: total time = sum of every request's latency
results = []
for doc in docs:
    results.append(classify(doc))     # each one blocks the next

# concurrent: requests overlap, total approaches the SLOWEST single one
import asyncio
results = await asyncio.gather(*[classify(doc) for doc in docs])
\`\`\`

With \`N\` requests each taking \`t\` seconds:

- Serial time is about \`N * t\`.
- Fully concurrent time approaches \`t\` (the longest single request), bounded by limits below.

You cannot fire infinite requests, though. Real limits force a ceiling:

1. **Rate limits.** Providers cap requests per minute and tokens per minute. Exceed them and you get throttled or rejected.
2. **Concurrency caps.** Too many in-flight requests can overwhelm your own client or the server. A common fix is a **semaphore** that allows only K at a time.
3. **Cost and fairness.** Bursting hard can spike spend and starve other jobs sharing the quota.

Batch APIs take this further: submit a big job offline, get results back later at a discount, trading latency for cheaper, higher throughput.

## Why it matters

- **Wall-clock time.** Concurrency turns hour-long bulk jobs into minutes without changing the model.
- **Cost efficiency.** Batch endpoints often cost less per token because the provider can schedule the work efficiently.
- **You must respect limits.** Naive "send everything at once" code hits rate limits and fails. Controlled concurrency with retries and a cap is the professional pattern.

## The mental model to keep

**Latency is one request's clock; throughput is the whole job's clock. Overlap independent requests up to a safe cap to make a slow-per-call model finish a huge job fast.**`,
      key_terms: [
        { term: "Throughput", definition: "How much work is completed per unit of time, such as requests or tokens per second across a job." },
        { term: "Concurrency", definition: "Running multiple independent requests at the same time so their wait times overlap." },
        { term: "Semaphore", definition: "A limiter that allows only a fixed number of requests to run at once, capping concurrency safely." }
      ],
      callouts: [
        { type: "analogy", title: "Many checkout lanes, not one", content: "Serving customers one at a time through a single lane is serial. Opening 20 lanes lets people check out in parallel. Each customer still takes the same time, but the whole store empties far faster. That is concurrency raising throughput.", position: "before" },
        { type: "warning", title: "Do not fire everything at once", content: "Launching thousands of simultaneous requests trips rate limits and crashes clients. Cap concurrency with a semaphore and add retries with backoff. Controlled parallelism beats a naive flood.", position: "after" }
      ],
      concept_diagram: {
        title: "Serial vs concurrent processing of a job",
        steps: [
          { label: "Many independent inputs", desc: "A bulk job of requests that do not depend on each other." },
          { label: "Serial waits stack", desc: "Each request blocks the next, so total time is the sum." },
          { label: "Overlap the waits", desc: "Launch several at once so their network waits run together." },
          { label: "Cap with a semaphore", desc: "Limit in-flight requests to stay under rate limits." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the difference between latency and throughput?",
          options: ["They mean the same thing", "Latency is one request's time; throughput is total work finished per unit time", "Throughput is how fast a single token arrives"],
          correct_index: 1,
          explanation: "Latency measures a single request's duration, while throughput measures how much total work completes per unit of time."
        }
      ],
      quiz_questions: [
        {
          question: "For N independent requests each taking t seconds, what is the approximate total time when run fully concurrently (ignoring limits)?",
          options: [
            "About N * t, the same as serial",
            "About t, the time of the slowest single request",
            "About t / N",
            "Exactly zero"
          ],
          correct_index: 1,
          explanation: "When requests overlap, their waits run together, so total time approaches the duration of the longest single request rather than the sum."
        },
        {
          question: "Why can't you simply launch unlimited concurrent requests?",
          options: [
            "Concurrency always lowers accuracy",
            "Providers enforce rate limits and clients can be overwhelmed",
            "Each request must wait for the previous to cache",
            "Tokens expire if sent in parallel"
          ],
          correct_index: 1,
          explanation: "Rate limits, server capacity, and your own client constrain concurrency, so you cap in-flight requests and handle throttling."
        },
        {
          question: "What is a semaphore used for in concurrent request code?",
          options: [
            "To encrypt requests in transit",
            "To allow only a fixed number of requests to run at once",
            "To cache the model's prefix",
            "To stream tokens to the client"
          ],
          correct_index: 1,
          explanation: "A semaphore caps the number of simultaneous in-flight requests, keeping concurrency under rate limits and client capacity."
        }
      ],
      participation_activities: [
        {
          activity_title: "Throughput check",
          questions: [
            { question: "Running requests concurrently reduces the time each individual request takes.", type: "true_false", correct_answer: "false", explanation: "Concurrency overlaps requests to raise throughput; each request's own latency is unchanged." },
            { question: "A limiter that allows only K requests in flight at once is called a ______.", type: "fill_in", correct_answer: "semaphore", explanation: "A semaphore caps concurrency to stay within rate limits." }
          ]
        }
      ],
      starter_code: `# Estimate serial vs concurrent wall-clock time for a bulk job.
num_requests = 100
latency_each = 2.0      # seconds per request
max_concurrent = 10     # cap on in-flight requests

# Serial time = num_requests * latency_each
# Concurrent time (capped) = ceil(num_requests / max_concurrent) * latency_each
import math
serial = num_requests * latency_each
# TODO: compute the concurrent time and print both.
print("serial seconds:", serial)
`,
      solution_code: `import math
num_requests = 100
latency_each = 2.0      # seconds per request
max_concurrent = 10     # cap on in-flight requests

serial = num_requests * latency_each
waves = math.ceil(num_requests / max_concurrent)
concurrent = waves * latency_each

print("serial seconds:", serial)
print("concurrent seconds:", concurrent)
`,
      expected_output: `serial seconds: 200.0
concurrent seconds: 20.0`,
      step_throughs: [
        {
          title: "turning a serial bulk job concurrent",
          steps: [
            { label: "Start with serial code", detail: "A simple loop calls the model once per item, each blocking the next. Total time is the sum of every request.", code: "for doc in docs: classify(doc)  # N * t" },
            { label: "Spot the idle waiting", detail: "Almost all of each request's time is spent waiting on the network and model, not on your CPU. That idle time can overlap.", code: "# 95% of latency is just waiting" },
            { label: "Launch requests concurrently", detail: "Use asyncio.gather to start many requests at once so their waits run together instead of stacking.", code: "await asyncio.gather(*[classify(d) for d in docs])" },
            { label: "Cap with a semaphore", detail: "Wrap each call in a semaphore so only K run at once, keeping you under rate limits while still parallel.", code: "sem = asyncio.Semaphore(10)  # at most 10 in flight" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You have 20 requests, each taking 1 second, run one after another. How long does the serial job take?",
          steps: [
            "Serial means each request waits for the previous to finish.",
            "Total time is the sum: 20 requests * 1 second each.",
            "That is 20 seconds."
          ],
          output: "20 seconds"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You must process 1,000 requests at 0.5s each, but the provider allows at most 25 in flight at once. Roughly how long does the capped-concurrent job take, and why is it not 0.5s?",
          steps: [
            "Fully unlimited concurrency would approach 0.5s, but the cap of 25 forces the work into waves.",
            "Number of waves = ceil(1000 / 25) = 40 waves.",
            "Each wave runs 25 requests in parallel and takes about 0.5s.",
            "Total is about 40 * 0.5 = 20 seconds, far better than the serial 1000 * 0.5 = 500 seconds, but bounded by the concurrency cap."
          ],
          output: "About 20 seconds: 40 waves of 25 at 0.5s, not 0.5s because the cap limits parallelism."
        }
      ],
      comparison_tables: [
        {
          title: "latency vs throughput",
          columns: ["Dimension", "Latency", "Throughput"],
          rows: [
            { cells: ["What it measures", "Time for one request", "Work finished per unit time"] },
            { cells: ["Improved by", "Faster model, smaller prompt", "Concurrency and batching"] },
            { cells: ["Matters most for", "A single interactive reply", "Bulk and offline jobs"] },
            { cells: ["Key lever", "Cut per-call delay", "Overlap many calls safely"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "improves latency vs improves throughput",
          bins: [
            { id: "latency", label: "Improves single-request latency" },
            { id: "throughput", label: "Improves bulk throughput" }
          ],
          items: [
            { id: "i1", text: "Shrinking one prompt to fewer tokens", bin: "latency" },
            { id: "i2", text: "Running 50 requests concurrently", bin: "throughput" },
            { id: "i3", text: "Submitting an offline batch job", bin: "throughput" },
            { id: "i4", text: "Caching the prefix to cut one call's TTFT", bin: "latency" },
            { id: "i5", text: "Overlapping network waits across requests", bin: "throughput" },
            { id: "i6", text: "Choosing a smaller, faster model for one reply", bin: "latency" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a model with high per-request latency still process a huge batch job quickly?",
          sampleAnswer: "Most of each request's latency is idle waiting on the network and the model, not work your machine is doing. Because the requests are independent, you can have many of them waiting at the same time instead of one after another, so their delays overlap. The slow per-call latency stays the same, but the whole job's throughput rises dramatically, finishing in roughly the time of one wave rather than the sum of every call, as long as you stay under the rate-limit cap."
        }
      ],
      hints: [
        "Serial time is just num_requests * latency_each.",
        "With a cap, work runs in waves: math.ceil(num_requests / max_concurrent).",
        "Concurrent time is the number of waves times the per-request latency."
      ],
      challenge_title: "Estimate concurrent job time",
      challenge_description: "Write a function job_time(num_requests, latency_each, max_concurrent) that returns the capped-concurrent wall-clock time: ceil(num_requests / max_concurrent) * latency_each. Test it on (100, 2.0, 10) and print the result.",
      challenge_starter_code: `import math
# TODO: define job_time(num_requests, latency_each, max_concurrent)
# returning ceil(num_requests / max_concurrent) * latency_each.
# Then print job_time(100, 2.0, 10).
`,
      challenge_solution_code: `import math

def job_time(num_requests, latency_each, max_concurrent):
    waves = math.ceil(num_requests / max_concurrent)
    return waves * latency_each

print(job_time(100, 2.0, 10))
`,
      challenge_test_cases: [
        { input: "num_requests=100, latency_each=2.0, max_concurrent=10", expected_output: "20.0", description: "10 waves of 10 requests at 2.0s each equals 20.0 seconds." }
      ]
    },
    {
      id: "ai-13-l5",
      project_id: "ai-13",
      order: 5,
      title: "Measuring Latency",
      concept: "Metrics",
      xp_reward: 10,
      explanation: `An engineer reports "our average latency is 800 milliseconds, we are fine." Meanwhile one in twenty users waits four seconds and churns. The average hid them. To actually run a fast AI product, you measure the right numbers — and the average is rarely one of them.

## What it is

**Latency metrics** are the specific numbers you track to know how responsive your system is. For streaming LLMs, three matter most:

- **TTFT** — time to first token, the responsiveness users feel first.
- **Total latency** — time from request to the final token.
- **Tokens per second** — the streaming throughput, total output tokens divided by total time.

And one statistical idea changes everything: you summarize these with **percentiles**, not averages.

## How it works

A **percentile** answers "what value is X percent of requests at or below?" The **p50** (median) is the typical experience; the **p95** and **p99** are the slow tail that frustrates real users. You sort your measurements and read off the value at that position:

\`\`\`python
def percentile(values, p):
    s = sorted(values)
    # index of the p-th percentile (nearest-rank method)
    import math
    rank = math.ceil(p / 100 * len(s))
    return s[rank - 1]

latencies = [0.2, 0.3, 0.3, 0.4, 5.0]   # one slow outlier
print(percentile(latencies, 50))   # 0.3  -> typical
print(percentile(latencies, 95))   # 5.0  -> the painful tail
\`\`\`

The average of that list is 1.24s, which describes nobody: most requests are far faster, and the worst is far slower. The **p95** of 5.0s is what your unhappiest users actually live with. That is why teams set targets like "p95 TTFT under 500ms" rather than averaging.

To measure well:

1. **Time the right boundaries.** Start the clock when the request is sent; record TTFT at the first token and total at the last.
2. **Collect many samples.** Percentiles are meaningless on a handful of points. Gather hundreds.
3. **Watch the tail, not the mean.** Optimize p95 and p99, because averages hide the slow requests that cause churn.

## Why it matters

- **Averages lie.** A single slow tail can wreck user experience while the average looks healthy.
- **Targets must be concrete.** "Fast" is not a spec; "p95 TTFT < 500ms" is testable and enforceable.
- **You measure to improve.** Streaming, caching, and concurrency from this module are only worth shipping if you can prove they moved the percentiles you care about.

## The mental model to keep

**Track TTFT, total latency, and tokens per second, and judge them by percentiles like p95 and p99 — never the average. The tail is the user experience that decides whether they stay.**`,
      key_terms: [
        { term: "Percentile", definition: "The value below which a given percent of measurements fall, like p95 meaning 95 percent are at or under it." },
        { term: "p95 / p99", definition: "Tail latency percentiles that capture the slow requests most responsible for user frustration." },
        { term: "Tokens per second", definition: "Streaming throughput, computed as total output tokens divided by total response time." }
      ],
      callouts: [
        { type: "insight", title: "The average is the wrong number", content: "One slow request can pull the average up or hide in it entirely. Percentiles separate the typical user (p50) from the suffering tail (p95, p99), which is what you must actually fix.", position: "before" },
        { type: "tip", title: "Set targets as percentiles", content: "Write SLOs like 'p95 TTFT under 500ms', not 'fast'. A percentile target is concrete, testable, and tells you exactly when you have regressed.", position: "after" }
      ],
      concept_diagram: {
        title: "From raw timings to a latency target",
        steps: [
          { label: "Time each request", desc: "Record TTFT and total latency for many requests." },
          { label: "Collect many samples", desc: "Gather hundreds of measurements, not a handful." },
          { label: "Compute percentiles", desc: "Sort and read off p50, p95, and p99." },
          { label: "Set and check a target", desc: "Define an SLO like p95 TTFT under 500ms and watch it." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why are percentiles like p95 preferred over the average for latency?",
          options: ["They are easier to compute", "They reveal the slow tail of requests that the average hides", "They always equal the average"],
          correct_index: 1,
          explanation: "The average can hide a slow tail. Percentiles like p95 expose the worst experiences that actually drive user frustration."
        }
      ],
      quiz_questions: [
        {
          question: "What does the p95 of a set of latency measurements tell you?",
          options: [
            "The fastest 5 percent of requests",
            "The value at or below which 95 percent of requests fall",
            "The exact average latency",
            "The total number of requests"
          ],
          correct_index: 1,
          explanation: "The p95 is the value 95 percent of requests are at or under, capturing the slow tail just above the typical case."
        },
        {
          question: "For the list [0.2, 0.3, 0.3, 0.4, 5.0], why is the average misleading?",
          options: [
            "The average is the same as the p50",
            "The single 5.0 outlier pulls the average to 1.24s, describing no real request",
            "Averages cannot be computed on latencies",
            "The list is too short to have an average"
          ],
          correct_index: 1,
          explanation: "The outlier drags the mean to 1.24s, far from both the typical 0.3s and the worst 5.0s, so the average represents nobody."
        },
        {
          question: "Which is the best way to write a latency target?",
          options: [
            "Make the model feel fast",
            "Keep the average reasonable",
            "p95 TTFT under 500 milliseconds",
            "Reduce tokens when possible"
          ],
          correct_index: 2,
          explanation: "A concrete percentile target is testable and enforceable, unlike vague goals or an average that hides the tail."
        }
      ],
      participation_activities: [
        {
          activity_title: "Metrics check",
          questions: [
            { question: "The average latency reliably reflects what your slowest users experience.", type: "true_false", correct_answer: "false", explanation: "A slow tail can hide in the average; you need percentiles like p95 to see it." },
            { question: "Streaming throughput is measured in tokens per ______.", type: "fill_in", correct_answer: "second", explanation: "Tokens per second is total output tokens divided by total response time." }
          ]
        }
      ],
      starter_code: `# Compute the p50 and p95 of a list of latencies (nearest-rank method).
import math

def percentile(values, p):
    s = sorted(values)
    rank = math.ceil(p / 100 * len(s))
    return s[rank - 1]

latencies = [0.2, 0.3, 0.3, 0.4, 5.0]
# TODO: print the p50 and p95 of latencies.
print("count:", len(latencies))
`,
      solution_code: `import math

def percentile(values, p):
    s = sorted(values)
    rank = math.ceil(p / 100 * len(s))
    return s[rank - 1]

latencies = [0.2, 0.3, 0.3, 0.4, 5.0]
print("count:", len(latencies))
print("p50:", percentile(latencies, 50))
print("p95:", percentile(latencies, 95))
`,
      expected_output: `count: 5
p50: 0.3
p95: 5.0`,
      step_throughs: [
        {
          title: "turning raw timings into a p95",
          steps: [
            { label: "Record each latency", detail: "Time many requests and collect their durations into a list. One sample is not enough.", code: "latencies = [0.2, 0.3, 0.3, 0.4, 5.0]" },
            { label: "Sort the values", detail: "Percentiles are positional, so sort ascending first.", code: "s = sorted(latencies)  # [0.2, 0.3, 0.3, 0.4, 5.0]" },
            { label: "Find the rank for p95", detail: "Nearest-rank index is ceil(p/100 * n). For p95 over 5 values, that is ceil(4.75) = 5.", code: "rank = math.ceil(95/100 * 5)  # 5" },
            { label: "Read off the tail value", detail: "The value at that rank is the p95, the slow experience your unhappiest users feel.", code: "s[rank - 1]  # s[4] = 5.0  -> p95" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A streamed response produces 120 output tokens in 4 seconds total. What is its tokens-per-second throughput?",
          steps: [
            "Tokens per second is total output tokens divided by total time.",
            "That is 120 tokens / 4 seconds.",
            "Which equals 30 tokens per second."
          ],
          output: "30 tokens per second"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Two services both report a 1.0s average TTFT. Service A's values are tightly around 1.0s; Service B is mostly 0.3s but with a slow tail spiking to 6s. Which is the better user experience, and what metric proves it?",
          steps: [
            "The averages are equal, so the mean alone cannot distinguish them.",
            "Service A is consistent: its p95 is near 1.0s, so almost everyone gets a similar, predictable wait.",
            "Service B looks great at the median (p50 around 0.3s) but its p95 and p99 reach toward 6s, so a meaningful slice of users suffers badly.",
            "Whether A or B is better depends on the product, but the point is that p95 and p99 reveal the difference the average hides; B's heavy tail likely causes more churn despite the identical mean."
          ],
          output: "The averages tie; only p95/p99 reveal B's painful tail, which the mean completely hides."
        }
      ],
      comparison_tables: [
        {
          title: "average vs percentiles for latency",
          columns: ["Question", "Average", "Percentiles (p50/p95/p99)"],
          rows: [
            { cells: ["Shows the typical user", "Roughly, if no outliers", "Yes, that is the p50"] },
            { cells: ["Shows the slow tail", "No, it hides it", "Yes, p95 and p99"] },
            { cells: ["Survives outliers", "No, they skew it", "Yes, the tail is explicit"] },
            { cells: ["Good for SLO targets", "Misleading", "Concrete and testable"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good latency practice vs bad latency practice",
          bins: [
            { id: "good", label: "Good practice" },
            { id: "bad", label: "Bad practice" }
          ],
          items: [
            { id: "i1", text: "Setting an SLO of p95 TTFT under 500ms", bin: "good" },
            { id: "i2", text: "Judging health by the average alone", bin: "bad" },
            { id: "i3", text: "Collecting hundreds of samples before computing percentiles", bin: "good" },
            { id: "i4", text: "Optimizing p95 and p99 tail latency", bin: "good" },
            { id: "i5", text: "Reporting a percentile from just three data points", bin: "bad" },
            { id: "i6", text: "Ignoring the slow tail because the mean looks fine", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is a 'p95 TTFT under 500ms' target more useful than 'average TTFT under 500ms'?",
          sampleAnswer: "An average can sit comfortably under 500ms while a slow tail of users waits seconds, because a few very fast requests cancel out the painful slow ones in the mean. A p95 target says that 95 percent of requests must be under 500ms, which directly constrains the tail and protects the users who would otherwise churn. It is concrete and testable, and it forces you to fix the slow requests the average lets you ignore."
        }
      ],
      hints: [
        "Sort the values before indexing into them.",
        "Nearest-rank index is math.ceil(p / 100 * len(values)).",
        "Return the element at rank - 1 since lists are zero-indexed."
      ],
      challenge_title: "Compute tokens per second",
      challenge_description: "Write a function tokens_per_second(num_tokens, total_seconds) that returns the streaming throughput, rounded to 1 decimal place. Test it on (120, 4.0) and print the result.",
      challenge_starter_code: `# TODO: define tokens_per_second(num_tokens, total_seconds)
# returning num_tokens / total_seconds rounded to 1 decimal.
# Then print tokens_per_second(120, 4.0).
`,
      challenge_solution_code: `def tokens_per_second(num_tokens, total_seconds):
    return round(num_tokens / total_seconds, 1)

print(tokens_per_second(120, 4.0))
`,
      challenge_test_cases: [
        { input: "num_tokens=120, total_seconds=4.0", expected_output: "30.0", description: "120 tokens over 4 seconds is 30.0 tokens per second." }
      ]
    }
  ]
};
