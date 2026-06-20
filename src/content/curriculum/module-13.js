export default {
  project: {
    id: "ai-13",
    title: "Streaming, Latency & Caching",
    description: "Make AI apps feel fast: stream tokens as they arrive, cache repeated prompts, batch work for throughput, and measure the latency numbers that actually matter.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 50,
    lessons_count: 8,
    tags: ["streaming", "latency", "caching", "throughput", "performance", "sse"],
    order: 20,
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
      challenge_title: "The TTFT Router",
      challenge_description: "Pick the model route that shows the user a word fastest — but only among routes that can still finish the whole reply inside the latency budget.",
      challenge_difficulty: "intermediate",
      challenge_story: "You run the gateway in front of a chat product. Every incoming question can be served by several **routes** — different models or deployments — and each has its own performance profile: a fixed **time to first token (TTFT)** before anything appears, a **per-token cost** in milliseconds while it streams, and the **number of tokens** the reply will take. Users judge a chat by how fast the *first* word shows up, so you want to minimize TTFT. But product set a hard rule: a route is only allowed if its **total** generation time fits inside the latency budget — nobody wants a snappy first word followed by a thirty-second crawl.",
      challenge_statement: "You are given `n` candidate routes and a latency `budget` (milliseconds). For each route you know its `ttft`, its per-token streaming cost `per`, and the number of output tokens `out`. A route's **total time** is `ttft + per * out`.\n\nA route is **eligible** only if its total time is **≤ budget**. Among all eligible routes, print the name of the one with the **smallest TTFT**. Break ties by smallest total time; if still tied, prefer the route that appeared **earlier** in the input. If no route is eligible, print `NONE`.",
      challenge_input_format: "The first line has two integers `n budget`.\n\nEach of the next `n` lines describes a route: a name (no spaces) followed by three integers `ttft per out`.",
      challenge_output_format: "One line: the chosen route's name, or `NONE` if no route fits the budget.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "0 ≤ ttft, per, out, budget ≤ 1000000000",
        "Route names are unique and contain no spaces.",
      ],
      challenge_examples: [
        { input: "3 1000\nfast 200 5 100\nslow 50 9 200\nmid 150 4 150", output: "mid", explanation: "Totals: fast=200+5·100=700 (ok), slow=50+9·200=1850 (>1000, out), mid=150+4·150=750 (ok). Among eligible {fast,mid}, mid has the lower TTFT (150 < 200)." },
        { input: "2 100\na 200 1 50\nb 300 1 10", output: "NONE", explanation: "a's total is 250 and b's is 310, both above the 100 budget, so nothing is eligible." },
      ],
      challenge_notes: "Low TTFT is what makes a stream *feel* instant, but a model that streams slowly can still blow your overall latency. Real routers weigh both, exactly like this gate-then-minimize pattern.",
      challenge_hints: [
        "Compute total = ttft + per * out for each route and filter out anything above the budget first.",
        "Track the best eligible route as you scan, comparing on (ttft, total); keep the first seen on a full tie.",
        "If you never find an eligible route, print NONE.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, budget = map(int, data[idx].split())
    idx += 1
    best = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        ttft = int(parts[1]); per = int(parts[2]); out = int(parts[3])
        total = ttft + per * out
        # TODO: skip routes whose total > budget; among the rest keep the one
        #       with the smallest ttft (tie-break: smaller total, then earlier input).
    print(best[2] if best is not None else "NONE")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, budget = map(int, data[idx].split())
    idx += 1
    best = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        ttft = int(parts[1]); per = int(parts[2]); out = int(parts[3])
        total = ttft + per * out
        if total > budget:
            continue
        if best is None or ttft < best[0] or (ttft == best[0] and total < best[1]):
            best = (ttft, total, name)
    print(best[2] if best is not None else "NONE")

main()
`,
      challenge_test_cases: [
        { input: "3 1000\nfast 200 5 100\nslow 50 9 200\nmid 150 4 150", expected_output: "mid", description: "Slowest-total route excluded; lowest TTFT among the rest wins." },
        { input: "2 100\na 200 1 50\nb 300 1 10", expected_output: "NONE", description: "No route fits the budget." },
        { input: "3 5000\nx 100 2 50\ny 100 1 50\nz 100 3 50", expected_output: "y", description: "All tie on TTFT; smallest total time breaks the tie." },
        { input: "1 700\nonly 200 5 100", expected_output: "only", description: "A single route exactly at the budget is eligible." }
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
      challenge_title: "The SSE Reassembler",
      challenge_description: "Parse a raw Server-Sent Events stream the way a real client does: skip the noise, stop at the sentinel, count the token events, and glue the pieces back into the final answer.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your front-end gets a model's reply as a live **Server-Sent Events** stream over one long HTTP response. The wire format is messy on purpose: there are blank lines between events, `:` comment lines the server sends as keep-alives, and a final `data: [DONE]` sentinel that marks the end. Anything after `[DONE]` is leftover garbage you must ignore. Each real token arrives as a `data:` line whose payload looks like `{\"token\": \"...\"}`. You're writing the client-side reassembler that turns this raw stream into two things product needs: **how many tokens streamed** and **the full reconstructed text**.",
      challenge_statement: "Read the raw SSE stream line by line and process it:\n\n1. Ignore any line that does **not** start with `data:` (blank lines, `:` comments, etc.).\n2. For a `data:` line, strip the `data:` prefix and surrounding whitespace to get the payload.\n3. If the payload is exactly `[DONE]`, **stop immediately** — ignore every line after it.\n4. Otherwise the payload is `{\"token\": \"<text>\"}`. Extract the string between the quotes after `\"token\":` and append it to the running output.\n\nPrint the **number of token events** consumed, then on the next line print the **concatenated text** of all those tokens.",
      challenge_input_format: "The entire stdin is the raw SSE stream: a sequence of lines that may include `data:` lines, blank lines, `:` comment lines, a `data: [DONE]` sentinel, and possibly trailing lines after it.",
      challenge_output_format: "Two lines. Line 1: the integer count of token events. Line 2: the reassembled text (which may be empty).",
      challenge_constraints: [
        "0 ≤ number of token events ≤ 100000",
        "Token text contains no double-quote characters and no newlines.",
        "Exactly one `[DONE]` sentinel may appear; lines after it must be ignored.",
      ],
      challenge_examples: [
        { input: "data: {\"token\": \"Hel\"}\n\ndata: {\"token\": \"lo\"}\n\ndata: [DONE]", output: "2\nHello", explanation: "Two token events, `Hel` + `lo`, joined into `Hello`; the blank lines and the sentinel are not counted." },
        { input: ": keep-alive\ndata: {\"token\": \"Hi\"}\n\ndata: {\"token\": \" there\"}\n\ndata: [DONE]\ndata: {\"token\": \"ignored\"}", output: "2\nHi there", explanation: "The `:` comment is skipped, and the `data:` line after `[DONE]` is dropped." },
      ],
      challenge_notes: "Almost every streaming LLM API speaks this exact dialect of SSE: `data:` lines, blank-line separators, and a `[DONE]` terminator. Robust clients always stop at the sentinel and never trust bytes that arrive after it.",
      challenge_hints: [
        "Read all of stdin and split on newlines; loop over the lines.",
        "Only lines that start with `data:` matter — strip that prefix and `.strip()` the rest.",
        "When the payload equals `[DONE]`, break out of the loop so trailing lines are ignored.",
        "To pull the token text, find `\"token\":` and read the substring between the next two double quotes.",
      ],
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    count = 0
    text = ""
    for line in lines:
        if not line.startswith("data:"):
            continue
        payload = line[len("data:"):].strip()
        if payload == "[DONE]":
            break
        # payload looks like {"token": "<text>"}; pull the text between the quotes.
        key = '"token":'
        pos = payload.find(key)
        if pos == -1:
            continue
        rest = payload[pos + len(key):]
        q1 = rest.find('"')
        q2 = rest.find('"', q1 + 1)
        token = rest[q1 + 1:q2]
        # TODO: append token to text and increment count.
    print(count)
    print(text)

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    count = 0
    text = ""
    for line in lines:
        if not line.startswith("data:"):
            continue
        payload = line[len("data:"):].strip()
        if payload == "[DONE]":
            break
        key = '"token":'
        pos = payload.find(key)
        if pos == -1:
            continue
        rest = payload[pos + len(key):]
        q1 = rest.find('"')
        q2 = rest.find('"', q1 + 1)
        text += rest[q1 + 1:q2]
        count += 1
    print(count)
    print(text)

main()
`,
      challenge_test_cases: [
        { input: "data: {\"token\": \"Hel\"}\n\ndata: {\"token\": \"lo\"}\n\ndata: [DONE]", expected_output: "2\nHello", description: "Two events reassembled, blanks and sentinel ignored." },
        { input: ": keep-alive\ndata: {\"token\": \"Hi\"}\n\ndata: {\"token\": \" there\"}\n\ndata: [DONE]\ndata: {\"token\": \"ignored\"}", expected_output: "2\nHi there", description: "Comment skipped and post-DONE data dropped." },
        { input: "data: [DONE]", expected_output: "0\n", description: "Sentinel only: zero tokens and an empty text line." }
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

system = "You are a helpful assistant."
a = system + " Question: capital of France?"
b = system + " Question: capital of Japan?"

# TODO: print whether the cache hits for prefix=system.
print("system:", system)
`,
      solution_code: `def cache_hits(prefix, prompt_a, prompt_b):
    return prompt_a.startswith(prefix) and prompt_b.startswith(prefix)

system = "You are a helpful assistant."
a = system + " Question: capital of France?"
b = system + " Question: capital of Japan?"

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
      challenge_title: "The Cacheable Prefix",
      challenge_description: "Find the longest prompt prefix every request in a batch shares, then compute the money prompt caching would save by prefilling it only once.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your RAG service answers questions about the same big knowledge base, so every request starts with an identical block: a long system prompt plus the retrieved document. Only the user's question at the very end changes. Right now you pay to prefill that whole shared block on **every** call. Prompt caching can store the processed **common prefix** once and let the rest of the batch reuse it — but first you have to find exactly how much of the prompt is truly shared across **all** requests, because a single differing character at position k means nothing past k can be cached.",
      challenge_statement: "You are given `n` prompts and a `cost` (the price in micro-dollars to prefill **one token**). Do two things:\n\n1. Find the **longest common prefix** of all `n` prompts, measured in characters. Let its length be `L`.\n2. Estimate its token count as `T = ceil(L / 4)` (the usual ~4-chars-per-token rule), with `T = 0` when `L = 0`.\n\nWithout caching, every one of the `n` calls prefills those `T` tokens. With caching, the prefix is prefilled **once** and the other `n - 1` calls reuse it. So the saving is `(n - 1) * T * cost`.\n\nPrint `L` on the first line and the saving on the second line.",
      challenge_input_format: "The first line has two integers `n cost`.\n\nEach of the next `n` lines is one prompt string (it may contain spaces; read the whole line).",
      challenge_output_format: "Two lines. Line 1: the integer length `L` of the common prefix in characters. Line 2: the integer saving `(n - 1) * ceil(L/4) * cost`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ cost ≤ 1000000",
        "Each prompt has length between 0 and 100000 characters.",
      ],
      challenge_examples: [
        { input: "3 50\nYou are a helpful assistant. Q: France?\nYou are a helpful assistant. Q: Japan?\nYou are a helpful assistant. Q: Spain?", output: "32\n800", explanation: "All three share `You are a helpful assistant. Q: ` (32 chars). Tokens = ceil(32/4) = 8. Saving = (3-1)·8·50 = 800." },
        { input: "2 10\nhello\nworld", output: "0\n0", explanation: "The prompts differ at the very first character, so the common prefix is empty and nothing can be cached." },
      ],
      challenge_notes: "Caching only helps the **shared** front of the prompt, which is why best practice is to put the stable system prompt and documents first and the changing question last. One edit inside the prefix invalidates everything after it.",
      challenge_hints: [
        "Start with the first prompt as the candidate prefix and shrink it against each remaining prompt.",
        "To shrink, compare characters position by position and cut at the first mismatch or the shorter length.",
        "Use math.ceil(L / 4) for the token estimate, and remember the saving multiplies by (n - 1), not n.",
      ],
      challenge_starter_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    n, cost = map(int, data[0].split())
    prompts = data[1:1 + n]
    prefix = prompts[0]
    # TODO: shrink prefix against each remaining prompt to the longest common prefix,
    #       then print its length L and the saving (n - 1) * ceil(L / 4) * cost.

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    n, cost = map(int, data[0].split())
    prompts = data[1:1 + n]
    prefix = prompts[0]
    for p in prompts[1:]:
        limit = min(len(prefix), len(p))
        j = 0
        while j < limit and prefix[j] == p[j]:
            j += 1
        prefix = prefix[:j]
    L = len(prefix)
    tokens = math.ceil(L / 4) if L > 0 else 0
    saving = (n - 1) * tokens * cost
    print(L)
    print(saving)

main()
`,
      challenge_test_cases: [
        { input: "3 50\nYou are a helpful assistant. Q: France?\nYou are a helpful assistant. Q: Japan?\nYou are a helpful assistant. Q: Spain?", expected_output: "32\n800", description: "Shared system prefix; saving scales with (n-1) reused calls." },
        { input: "2 10\nhello\nworld", expected_output: "0\n0", description: "No shared prefix means no caching saving." },
        { input: "2 100\nabcdefgh\nabcdXYZ", expected_output: "4\n100", description: "Prefix of 4 chars -> 1 token -> (2-1)*1*100 = 100." },
        { input: "1 500\nlonely prompt", expected_output: "13\n0", description: "A single prompt: nothing to reuse, so the saving is 0 even with a long prefix." }
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
      challenge_title: "The Concurrency Planner",
      challenge_description: "Estimate how long a bulk classification job takes when you cap how many requests run at once, then report the speedup concurrency buys you.",
      challenge_difficulty: "beginner",
      challenge_story: "You have a nightly job that runs `n` documents through a classifier model. Each request takes the same `latency` to come back. Fired one at a time, the job crawls. Your provider lets you keep up to `c` requests in flight at once, so the work runs in **waves**: launch `c` requests, wait for them, launch the next `c`, and so on. The product owner wants a capacity plan: the sequential time, the concurrent wall-clock time at concurrency `c`, and the speedup factor — so they can decide whether to pay for more parallelism.",
      challenge_statement: "You are given the number of requests `n`, the max concurrency `c`, and the per-request `latency` in milliseconds (every request takes exactly `latency`).\n\nCompute three numbers:\n\n1. **Sequential time** = `n * latency` (one after another).\n2. **Concurrent time** = `ceil(n / c) * latency` — the requests run in `ceil(n / c)` full waves, each wave taking `latency`.\n3. **Speedup** = sequential / concurrent, printed to **exactly 2 decimal places**.\n\nPrint the sequential time, the concurrent time, then the speedup.",
      challenge_input_format: "A single line with three integers: `n c latency`.",
      challenge_output_format: "Three lines. Line 1: sequential time (integer). Line 2: concurrent time (integer). Line 3: speedup as a string with exactly 2 decimal places (e.g. `2.33`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000000",
        "1 ≤ c ≤ 1000000",
        "1 ≤ latency ≤ 1000000",
      ],
      challenge_examples: [
        { input: "1000 50 200", output: "200000\n4000\n50.00", explanation: "Sequential = 1000·200 = 200000. Waves = ceil(1000/50) = 20, so concurrent = 20·200 = 4000. Speedup = 200000/4000 = 50.00." },
        { input: "7 3 100", output: "700\n300\n2.33", explanation: "Sequential = 700. Waves = ceil(7/3) = 3, concurrent = 300. Speedup = 700/300 = 2.33 (rounded to 2 places)." },
      ],
      challenge_notes: "Concurrency improves **throughput** (total work per unit time) by overlapping the waits across requests; it does not make any single request faster. The last wave can be partly empty, which is why you round the wave count up.",
      challenge_hints: [
        "Use math.ceil(n / c) for the number of waves — the final wave may not be full.",
        "Sequential is just n * latency; concurrent is waves * latency.",
        "Format the speedup with an f-string like f\"{value:.2f}\" so it always shows 2 decimals.",
      ],
      challenge_starter_code: `import sys
import math

def main():
    n, c, latency = map(int, sys.stdin.read().split())
    # TODO: print sequential time, concurrent time, and the speedup (2 decimals).

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    n, c, latency = map(int, sys.stdin.read().split())
    seq = n * latency
    waves = math.ceil(n / c)
    conc = waves * latency
    speedup = seq / conc
    print(seq)
    print(conc)
    print(f"{speedup:.2f}")

main()
`,
      challenge_test_cases: [
        { input: "1000 50 200", expected_output: "200000\n4000\n50.00", description: "20 full waves; large speedup from high concurrency." },
        { input: "7 3 100", expected_output: "700\n300\n2.33", description: "Uneven last wave; speedup rounded to 2 decimals." },
        { input: "1 8 500", expected_output: "500\n500\n1.00", description: "Fewer requests than the concurrency cap: one wave, no speedup." }
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
      challenge_title: "The Latency SLO Checker",
      challenge_description: "Turn a batch of TTFT measurements into the metric that actually matters — the tail percentile — and decide whether your service meets its latency promise.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your AI feature has a service-level objective (SLO): the **p95 time to first token** must stay under a promised threshold. An on-call engineer keeps quoting the *average*, but the average hides the slow tail — the unlucky users who wait forever and churn. You're building the dashboard check that does it right: given a window of raw TTFT samples, it reports the mean (for context), the requested **percentile** by nearest-rank, and whether the SLO passed.",
      challenge_statement: "You are given `n` latency samples (milliseconds), a percentile `p`, and an SLO `threshold` in milliseconds. Compute:\n\n1. **Mean** = floor of the average, i.e. `sum(samples) // n` (integer division).\n2. **Percentile value** by the **nearest-rank** method: sort ascending, let `rank = ceil(p/100 * n)` (1-indexed, and at least 1), and take the sample at that rank.\n3. **Status**: print `PASS` if the percentile value is **≤ threshold**, otherwise `FAIL`.\n\nPrint the mean, the percentile value, then the status.",
      challenge_input_format: "The first line has three integers `n p threshold`.\n\nThe second line has `n` space-separated integer latency samples.",
      challenge_output_format: "Three lines. Line 1: the integer mean (floor). Line 2: the integer percentile value. Line 3: `PASS` or `FAIL`.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ p ≤ 100",
        "0 ≤ each sample, threshold ≤ 1000000000",
      ],
      challenge_examples: [
        { input: "10 95 500\n100 120 90 800 110 130 95 105 115 125", output: "179\n800\nFAIL", explanation: "Sum is 1790, mean = 1790//10 = 179. Sorted, rank = ceil(0.95·10) = 10, so p95 is the largest sample, 800. Since 800 > 500, the SLO FAILs even though the mean looks fine." },
        { input: "20 90 300\n100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 900", output: "140\n100\nPASS", explanation: "One outlier of 900 drags the mean to 140, but rank = ceil(0.9·20) = 18 lands on a 100, so p90 = 100 ≤ 300 and the SLO PASSes." },
      ],
      challenge_notes: "Percentiles, not averages, are how real teams run latency SLOs: p95 and p99 expose the slow tail that the mean smooths away. Nearest-rank is the simplest correct percentile definition and needs only a sort.",
      challenge_hints: [
        "Sort the samples ascending before indexing.",
        "rank = math.ceil(p / 100 * n); the value is samples[rank - 1] because ranks are 1-indexed.",
        "Use integer division (//) for the mean so the output is an exact integer.",
      ],
      challenge_starter_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    n, p, threshold = map(int, data[0].split())
    samples = list(map(int, data[1].split()))
    # TODO: print the floored mean, the nearest-rank percentile value,
    #       and PASS/FAIL against the threshold.

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    n, p, threshold = map(int, data[0].split())
    samples = list(map(int, data[1].split()))
    samples.sort()
    mean = sum(samples) // n
    rank = math.ceil(p / 100 * n)
    if rank < 1:
        rank = 1
    pval = samples[rank - 1]
    status = "PASS" if pval <= threshold else "FAIL"
    print(mean)
    print(pval)
    print(status)

main()
`,
      challenge_test_cases: [
        { input: "10 95 500\n100 120 90 800 110 130 95 105 115 125", expected_output: "179\n800\nFAIL", description: "Tail sample blows the p95 SLO while the mean looks healthy." },
        { input: "20 90 300\n100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 900", expected_output: "140\n100\nPASS", description: "Outlier inflates the mean but p90 still passes." },
        { input: "1 99 1000\n1500", expected_output: "1500\n1500\nFAIL", description: "Single sample: it is both the mean and the percentile, and it exceeds the SLO." }
      ]
    },
    {
      id: "ai-13-l6",
      project_id: "ai-13",
      order: 6,
      title: "Token Throughput",
      concept: "Throughput",
      xp_reward: 10,
      explanation: `A model with a snappy 200ms time to first token can still take twelve full seconds to answer — because the reply is 1,500 tokens long and the model only emits 130 of them per second. Once the first word lands, the whole rest of the wait is governed by a single number you rarely see on a dashboard: **token throughput**.

## What it is

**Token throughput** is the rate at which a model emits output tokens, measured in **tokens per second (TPS)**. Lesson 4 looked at *job-level* throughput across many requests; this is the throughput *inside one response* — how fast a single answer types itself out after generation begins.

It is the inverse of the inter-token latency from lesson 1: if each token arrives every 8 milliseconds, that is \`1 / 0.008 = 125\` tokens per second. The longer the answer, the more this rate dominates the clock.

## How it works

Total response time splits into two parts: the one-time **TTFT** to produce the first token, and then the steady stream of remaining tokens at the throughput rate.

\`\`\`python
# total seconds = ttft + (output_tokens - 1) / tokens_per_second
ttft = 0.2            # 200ms to first token
tps  = 125            # tokens per second once streaming
out  = 1500           # tokens in the reply

stream_time = (out - 1) / tps      # ~11.99s
total = ttft + stream_time         # ~12.19s
print(round(total, 2))             # 12.19
\`\`\`

The decisive insight is the **mix**. For a 10-token reply, TTFT (0.2s) swamps the 0.07s of streaming, so first-token speed is everything. For a 1,500-token reply, TTFT is a rounding error and throughput owns the wall clock. Two models can have identical TTFT yet wildly different total times purely from TPS.

This is why **output length is the most controllable latency lever you have**. You cannot easily change the model's TPS, but you can ask for a shorter answer, cap \`max_tokens\`, or stop the stream early — each directly shrinks the throughput-dominated portion.

## Why it matters

- **Long outputs dominate total latency.** Summaries, code generation, and long-form drafts spend almost all their time in the throughput phase, not the TTFT phase.
- **TPS picks the model for the job.** A high-TPS model is worth more for verbose tasks; a low-TTFT model wins for short, chatty replies.
- **Capping length is a real speedup.** Halving \`max_tokens\` roughly halves the throughput-bound time, often the single biggest latency win available.

## The mental model to keep

**TTFT is the cost to start talking; throughput is the speed of talking. Short answers are bottlenecked by TTFT, long answers by tokens per second — so for anything verbose, fewer tokens is faster.**`,
      key_terms: [
        { term: "Token throughput", definition: "The rate at which a model emits output tokens, measured in tokens per second (TPS)." },
        { term: "Tokens per second (TPS)", definition: "How many output tokens stream out each second; the inverse of inter-token latency." },
        { term: "Output length", definition: "The number of tokens in the reply; the main lever you control to cut throughput-bound latency." }
      ],
      callouts: [
        { type: "analogy", title: "Reading aloud vs clearing your throat", content: "TTFT is the pause before someone starts reading aloud; throughput is how fast they read once they begin. For a one-line note the pause dominates, but for a ten-page document the reading speed is all that matters.", position: "before" },
        { type: "tip", title: "Cut the tokens, cut the wait", content: "You usually cannot change a model's tokens-per-second, but you can change how many tokens it must emit. Capping max_tokens or asking for brevity is often the biggest latency win you can make.", position: "after" }
      ],
      concept_diagram: {
        title: "Where the time goes in one response",
        steps: [
          { label: "Pay the TTFT once", desc: "A fixed delay before the first token appears." },
          { label: "Stream at the TPS rate", desc: "Remaining tokens arrive at tokens-per-second speed." },
          { label: "Length sets the mix", desc: "Short replies are TTFT-bound; long replies are throughput-bound." },
          { label: "Shorten to speed up", desc: "Fewer output tokens directly shrink the throughput phase." }
        ]
      },
      inline_quizzes: [
        {
          question: "If a model emits a token every 5 milliseconds, what is its throughput?",
          options: ["5 tokens per second", "200 tokens per second", "500 tokens per second"],
          correct_index: 1,
          explanation: "Throughput is the inverse of inter-token latency: 1 / 0.005 = 200 tokens per second."
        }
      ],
      quiz_questions: [
        {
          question: "For a very long (1,500-token) response, which factor dominates the total time?",
          options: [
            "Time to first token (TTFT)",
            "Token throughput (tokens per second)",
            "The size of the context window",
            "The number of cache hits"
          ],
          correct_index: 1,
          explanation: "TTFT is paid once and becomes negligible over a long reply; the steady tokens-per-second rate governs almost all of the wall-clock time."
        },
        {
          question: "Two models have the same TTFT but different tokens-per-second. For a long answer, what happens?",
          options: [
            "Their total times are identical because TTFT is equal",
            "The higher-TPS model finishes noticeably sooner",
            "The lower-TPS model finishes sooner",
            "Throughput has no effect on total time"
          ],
          correct_index: 1,
          explanation: "Once TTFT is equal, the throughput-bound streaming phase decides the total; the model that emits tokens faster finishes the long reply first."
        },
        {
          question: "What is the most controllable lever for reducing throughput-bound latency?",
          options: [
            "Increasing the temperature",
            "Reducing the number of output tokens the model must generate",
            "Enlarging the context window",
            "Switching from SSE to WebSockets"
          ],
          correct_index: 1,
          explanation: "You rarely control a model's raw TPS, but capping max_tokens or asking for a shorter answer directly shrinks the throughput-dominated portion of the response."
        }
      ],
      participation_activities: [
        {
          activity_title: "Throughput sense-check",
          questions: [
            { question: "For a 10-token reply, token throughput usually matters more than TTFT.", type: "true_false", correct_answer: "false", explanation: "Short replies are dominated by TTFT; throughput dominates only as the output grows long." },
            { question: "Token throughput is measured in tokens per ______.", type: "fill_in", correct_answer: "second", explanation: "Tokens per second (TPS) is the rate at which output tokens stream out." }
          ]
        }
      ],
      starter_code: `# Compute total response time from TTFT and token throughput.
ttft = 0.2              # seconds to first token
tps = 125               # tokens per second once streaming
out = 1500              # output tokens

# TODO: stream_time = (out - 1) / tps; total = ttft + stream_time.
# Print throughput-bound stream time and total time.
print("tps:", tps)
`,
      solution_code: `ttft = 0.2              # seconds to first token
tps = 125               # tokens per second once streaming
out = 1500              # output tokens

stream_time = (out - 1) / tps
total = ttft + stream_time

print("tps:", tps)
print("stream_time:", round(stream_time, 2))
print("total:", round(total, 2))
`,
      expected_output: `tps: 125
stream_time: 11.99
total: 12.19`,
      step_throughs: [
        {
          title: "splitting one response into TTFT plus throughput",
          steps: [
            { label: "Pay the TTFT", detail: "A fixed delay before the first token appears. It happens exactly once per response.", code: "ttft = 0.2  # 200ms, paid once" },
            { label: "Find the per-token gap", detail: "Throughput is tokens per second; its inverse is the gap between tokens.", code: "tps = 125  ->  gap = 1/125 = 0.008s" },
            { label: "Stream the rest", detail: "After the first token, the remaining out-1 tokens arrive at the throughput rate.", code: "stream = (1500 - 1) / 125  # 11.99s" },
            { label: "Add them up", detail: "Total is the one-time TTFT plus the throughput-bound streaming time. For a long reply the second term dwarfs the first.", code: "total = 0.2 + 11.99 = 12.19s" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A response streams 240 output tokens in 4 seconds of streaming time. What is its token throughput?",
          steps: [
            "Throughput is output tokens divided by the streaming time.",
            "That is 240 tokens / 4 seconds.",
            "Which equals 60 tokens per second."
          ],
          output: "60 tokens per second"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Model A: TTFT 0.1s, 50 tokens per second. Model B: TTFT 0.5s, 200 tokens per second. For a 1,000-token answer, which is faster, and why does the answer flip for a 5-token answer?",
          steps: [
            "For 1,000 tokens: A's stream time is 999/50 = 19.98s, total ~20.08s. B's is 999/200 = 5.0s, total ~5.5s, so B wins big.",
            "The long reply is throughput-bound, and B's 200 TPS crushes A's 50 TPS.",
            "For 5 tokens: A's stream is 4/50 = 0.08s, total 0.18s. B's is 4/200 = 0.02s, total 0.52s.",
            "Now the reply is TTFT-bound; A's lower 0.1s TTFT beats B's 0.5s, so A wins. The dominant term flips with output length."
          ],
          output: "B wins the 1,000-token reply (throughput-bound); A wins the 5-token reply (TTFT-bound)."
        }
      ],
      comparison_tables: [
        {
          title: "TTFT-bound vs throughput-bound responses",
          columns: ["Aspect", "Short reply (TTFT-bound)", "Long reply (throughput-bound)"],
          rows: [
            { cells: ["Dominant term", "TTFT", "Tokens per second"] },
            { cells: ["Best model trait", "Low TTFT", "High TPS"] },
            { cells: ["Effect of cutting tokens", "Small", "Large"] },
            { cells: ["Where total time lives", "In the startup pause", "In the streaming phase"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what changes total time for long vs short replies",
          bins: [
            { id: "tps", label: "Throughput dominates (long reply)" },
            { id: "ttft", label: "TTFT dominates (short reply)" }
          ],
          items: [
            { id: "i1", text: "Generating a 2,000-token summary", bin: "tps" },
            { id: "i2", text: "Answering yes or no in one token", bin: "ttft" },
            { id: "i3", text: "Writing a long code file", bin: "tps" },
            { id: "i4", text: "A one-line chat reply", bin: "ttft" },
            { id: "i5", text: "Drafting a multi-paragraph email", bin: "tps" },
            { id: "i6", text: "Returning a short classification label", bin: "ttft" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does asking the model for a shorter answer reduce latency more than almost anything else you can control?",
          sampleAnswer: "For any reply beyond a few tokens, most of the wall-clock time is the streaming phase, which is governed by tokens per second times the number of output tokens. You usually cannot change the model's raw throughput, but you can change how many tokens it must emit. Halving the output roughly halves the throughput-bound time, so capping max_tokens or asking for brevity attacks the largest, most controllable part of the total latency."
        }
      ],
      hints: [
        "Throughput in tokens per second is the inverse of the inter-token gap.",
        "There are (out - 1) tokens after the first, so stream_time = (out - 1) / tps.",
        "Total time is ttft + stream_time; round for clean output."
      ],
      challenge_title: "The Throughput SLO Gate",
      challenge_description: "Measure each model's real token throughput from its output size and streaming time, count how many clear a throughput target, and name the slowest streamer.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your platform team is choosing between several model deployments for a verbose feature (long summaries), where token throughput, not first-token speed, decides the experience. Each deployment reports how many **output tokens** it produced and how many **milliseconds** of streaming that took. Product set a throughput SLO in **tokens per second**: a deployment is acceptable only if it streams at least that fast. You're building the gate that computes each deployment's TPS, counts how many pass the SLO, and flags the **slowest** streamer so it can be retired.",
      challenge_statement: "You are given `n` deployments and a throughput `target` in tokens per second. Each deployment reports its output token count `out` and its streaming time `ms` in milliseconds. Compute each one's throughput as **integer** tokens per second using floor division:\n\n```\ntps = out * 1000 // ms\n```\n\nThen:\n\n1. Count how many deployments have `tps >= target` (these PASS the SLO).\n2. Find the deployment with the **smallest** tps. Break ties by the name that is **lexicographically smaller**.\n\nPrint the pass count on the first line, then the slowest deployment's name and its tps separated by a single space on the second line.",
      challenge_input_format: "The first line has two integers `n target`.\n\nEach of the next `n` lines describes a deployment: a name (no spaces) followed by two integers `out ms`.",
      challenge_output_format: "Two lines. Line 1: the integer count of deployments meeting the SLO. Line 2: the slowest deployment's name and its tps, space-separated.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "0 ≤ target ≤ 1000000",
        "1 ≤ out ≤ 1000000000",
        "1 ≤ ms ≤ 1000000000",
        "Deployment names are unique and contain no spaces.",
      ],
      challenge_examples: [
        { input: "3 30\nmodelA 120 4000\nmodelB 200 2000\nmodelC 60 3000", output: "2\nmodelC 20", explanation: "TPS: A=120·1000//4000=30 (pass), B=200·1000//2000=100 (pass), C=60·1000//3000=20 (fail). Two pass; C is the slowest at 20 tps." },
        { input: "2 50\nx 100 1000\ny 100 5000", output: "1\ny 20", explanation: "x=100·1000//1000=100 (pass), y=100·1000//5000=20 (fail). One passes; y is slowest at 20 tps." },
      ],
      challenge_notes: "Token throughput is the inverse of inter-token latency and the number that dominates long replies. Floor division keeps the metric an exact integer; real dashboards usually report a windowed average TPS the same way.",
      challenge_hints: [
        "Read n and target, then loop the n deployment lines parsing name, out, and ms.",
        "Throughput is out * 1000 // ms so the tokens-per-second value stays an integer.",
        "Track both a pass counter and the running minimum tps, breaking ties on the lexicographically smaller name.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, target = map(int, data[0].split())
    passing = 0
    slowest_name = None
    slowest_tps = None
    for i in range(n):
        parts = data[1 + i].split()
        name = parts[0]
        out = int(parts[1]); ms = int(parts[2])
        tps = out * 1000 // ms
        # TODO: count this deployment if tps >= target, and update the slowest
        #       (smallest tps; on a tie keep the lexicographically smaller name).
    print(passing)
    print(f"{slowest_name} {slowest_tps}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, target = map(int, data[0].split())
    passing = 0
    slowest_name = None
    slowest_tps = None
    for i in range(n):
        parts = data[1 + i].split()
        name = parts[0]
        out = int(parts[1]); ms = int(parts[2])
        tps = out * 1000 // ms
        if tps >= target:
            passing += 1
        if slowest_tps is None or tps < slowest_tps or (tps == slowest_tps and name < slowest_name):
            slowest_tps = tps
            slowest_name = name
    print(passing)
    print(f"{slowest_name} {slowest_tps}")

main()
`,
      challenge_test_cases: [
        { input: "3 30\nmodelA 120 4000\nmodelB 200 2000\nmodelC 60 3000", expected_output: "2\nmodelC 20", description: "Two deployments meet the 30 TPS SLO; the 20 TPS one is slowest." },
        { input: "2 50\nx 100 1000\ny 100 5000", expected_output: "1\ny 20", description: "Same output token count, very different streaming time, so very different TPS." },
        { input: "1 1000\nonly 500 1000", expected_output: "0\nonly 500", description: "A single deployment at 500 TPS fails a steep 1000 TPS target but is still the slowest by default." },
        { input: "3 100\na 1000 1000\nb 1000 1000\nc 50 1000", expected_output: "2\nc 50", description: "Two tie at 1000 TPS and pass; c is clearly slowest at 50." }
      ]
    },
    {
      id: "ai-13-l7",
      project_id: "ai-13",
      order: 7,
      title: "Semantic Caching",
      concept: "SemanticCache",
      xp_reward: 10,
      explanation: `Two users ask "How do I reset my password?" and "What's the process for changing my password?" Word for word they share almost nothing, so the exact-match prompt cache from lesson 3 misses both times and you pay for two full model calls. But the *meaning* is identical. A **semantic cache** catches that — it matches by what a query means, not by the letters it is made of.

## What it is

A **semantic cache** stores past queries and their answers keyed by an **embedding** — a vector of numbers that captures meaning. A new query is embedded too, and if its vector is **close enough** to a stored one, you return the cached answer instead of calling the model. Prompt caching (lesson 3) needs a byte-for-byte prefix match; semantic caching tolerates completely different wording as long as the intent lines up.

## How it works

The closeness test is **cosine similarity**: the cosine of the angle between two vectors, ranging from -1 (opposite) to 1 (identical direction). Near 1 means "these mean nearly the same thing." You set a **similarity threshold**; at or above it is a hit, below it is a miss.

\`\`\`python
import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)

q1 = [0.9, 0.1]    # "reset my password"
q2 = [0.88, 0.12]  # "change my password" - different words, similar meaning
print(round(cosine(q1, q2), 4))   # ~0.9997 -> a hit above a 0.95 threshold
\`\`\`

The flow per query: embed it, compare against every cached embedding, take the best similarity. If that best is at or above the threshold, serve the cached answer (a **hit**); otherwise call the model, then store this query's embedding and answer for next time (a **miss**).

The **threshold** is the whole ballgame. Set it too low and you serve the wrong answer to a question that only *seemed* similar (a false hit). Set it too high and almost nothing matches, so you barely save anything. Tuning it trades savings against correctness.

## Why it matters

- **Catches paraphrases.** FAQ-style and support traffic is full of the same question asked a thousand ways. Semantic caching collapses them into one model call.
- **Bigger savings than exact match.** Real user wording varies endlessly, so an exact cache hits rarely; a semantic cache hits far more often.
- **It can be dangerously wrong.** A too-loose threshold returns a confidently wrong cached answer. "Cancel my order" and "Can I change my order?" are close in vector space but need different replies, so the threshold must be conservative.

## The mental model to keep

**Exact caching matches the letters; semantic caching matches the meaning. Embed the query, measure cosine similarity to past queries, and reuse the answer only when the match clears a threshold you have tuned carefully enough to avoid false hits.**`,
      key_terms: [
        { term: "Semantic cache", definition: "A cache that reuses a stored answer when a new query is close in meaning to a past one, judged by embedding similarity." },
        { term: "Embedding", definition: "A vector of numbers that represents the meaning of text, so similar meanings sit close together." },
        { term: "Cosine similarity", definition: "The cosine of the angle between two vectors, from -1 to 1; near 1 means nearly the same direction (meaning)." },
        { term: "Similarity threshold", definition: "The cutoff at or above which two queries count as a match; it trades cache savings against the risk of false hits." }
      ],
      callouts: [
        { type: "analogy", title: "A librarian who knows synonyms", content: "An exact-match cache is a clerk who only finds a book if you quote its title perfectly. A semantic cache is a librarian who hears 'that book about a boy wizard' and fetches the right one. It matches what you mean, not the exact words.", position: "before" },
        { type: "warning", title: "A loose threshold serves wrong answers", content: "Set the similarity bar too low and 'cancel my order' can match 'change my order' and return the wrong cached reply with full confidence. Keep the threshold conservative; a false hit is worse than a miss.", position: "after" }
      ],
      concept_diagram: {
        title: "How a semantic cache decides hit or miss",
        steps: [
          { label: "Embed the query", desc: "Turn the new question into a meaning vector." },
          { label: "Compare to cached vectors", desc: "Compute cosine similarity against every stored query." },
          { label: "Check the threshold", desc: "Best similarity at or above the cutoff is a hit; below is a miss." },
          { label: "Serve or store", desc: "Hit: return the cached answer. Miss: call the model and store this query." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a semantic cache match on, unlike an exact-string prompt cache?",
          options: ["The exact byte sequence of the prompt", "The meaning of the query, via embedding similarity", "The length of the prompt in tokens"],
          correct_index: 1,
          explanation: "A semantic cache compares meaning using embeddings and cosine similarity, so differently worded but equivalent questions can still hit."
        }
      ],
      quiz_questions: [
        {
          question: "Why can a semantic cache hit when an exact-string prompt cache misses?",
          options: [
            "It ignores the query entirely",
            "It matches on meaning via embeddings, so different wording can still be close",
            "It stores answers for every possible question in advance",
            "It lowers the model's temperature"
          ],
          correct_index: 1,
          explanation: "Exact caching needs identical text, but semantic caching compares embedding vectors, so paraphrases with the same meaning land close enough to match."
        },
        {
          question: "What does a cosine similarity near 1 between two query embeddings indicate?",
          options: [
            "The queries are opposite in meaning",
            "The queries point in nearly the same direction, so they mean nearly the same thing",
            "The queries are exactly the same string",
            "The queries are both empty"
          ],
          correct_index: 1,
          explanation: "Cosine similarity measures the angle between vectors; close to 1 means a tiny angle, i.e. nearly the same meaning."
        },
        {
          question: "What is the danger of setting the similarity threshold too low?",
          options: [
            "The cache never hits anything",
            "It serves a cached answer to a question that only seemed similar, returning a wrong answer",
            "Embeddings stop working",
            "It increases the context window"
          ],
          correct_index: 1,
          explanation: "A too-loose threshold produces false hits: it reuses an answer for a query that is merely near in vector space but actually needs a different response."
        }
      ],
      participation_activities: [
        {
          activity_title: "Semantic cache check",
          questions: [
            { question: "A semantic cache requires the new query to match a stored one byte for byte.", type: "true_false", correct_answer: "false", explanation: "It matches on meaning via embedding similarity, so different wording can still hit." },
            { question: "The closeness of two query embeddings is commonly measured with ______ similarity.", type: "fill_in", correct_answer: "cosine", explanation: "Cosine similarity scores how aligned two meaning vectors are, from -1 to 1." }
          ]
        }
      ],
      starter_code: `# Decide if a new query hits a semantic cache by cosine similarity.
import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)

cached = [0.9, 0.1]      # "reset my password"
query = [0.88, 0.12]     # "change my password"
threshold = 0.95

# TODO: compute similarity, then print "HIT" if it is >= threshold else "MISS".
print("similarity:", round(cosine(cached, query), 4))
`,
      solution_code: `import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)

cached = [0.9, 0.1]
query = [0.88, 0.12]
threshold = 0.95

sim = cosine(cached, query)
print("similarity:", round(sim, 4))
print("HIT" if sim >= threshold else "MISS")
`,
      expected_output: `similarity: 0.9997
HIT`,
      step_throughs: [
        {
          title: "checking one query against the cache",
          steps: [
            { label: "Embed the new query", detail: "Convert the question text into a meaning vector. Different wording with the same intent lands nearby.", code: 'query = embed("change my password")  # [0.88, 0.12]' },
            { label: "Score it against a cached query", detail: "Compute cosine similarity between the new vector and a stored one.", code: "sim = cosine(query, cached)  # 0.9997" },
            { label: "Compare to the threshold", detail: "At or above the threshold is a hit; below is a miss. The threshold controls strictness.", code: "0.9997 >= 0.95  ->  HIT" },
            { label: "Serve or store", detail: "On a hit, return the cached answer with no model call. On a miss, call the model and store this query and answer.", code: "return cached_answer  # no model call needed" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A new query has cosine similarity 0.91 to the closest cached query, and the threshold is 0.95. Hit or miss?",
          steps: [
            "Compare the best similarity to the threshold.",
            "0.91 is below 0.95.",
            "Below the threshold means the cache does not match."
          ],
          output: "Miss - the model must be called."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your cache holds 'how do I reset my password' (answer: reset steps). A user asks 'how do I cancel my subscription', whose embedding has similarity 0.93 to the cached query. With a threshold of 0.90 you serve the cached answer. What went wrong, and how do you fix it?",
          steps: [
            "The two questions are loosely related (both account actions) so their embeddings are somewhat close, scoring 0.93.",
            "A threshold of 0.90 treats 0.93 as a hit, so the user asking to cancel gets password-reset steps - a false hit.",
            "The fix is to raise the threshold (for example to 0.97) so only genuinely equivalent paraphrases match.",
            "A higher threshold reduces savings slightly but prevents confidently returning the wrong cached answer."
          ],
          output: "A too-low threshold caused a false hit; raise it so only true paraphrases match."
        }
      ],
      comparison_tables: [
        {
          title: "exact prompt cache vs semantic cache",
          columns: ["Aspect", "Exact prompt cache", "Semantic cache"],
          rows: [
            { cells: ["Match criterion", "Identical byte prefix", "Close embedding meaning"] },
            { cells: ["Catches paraphrases", "No", "Yes"] },
            { cells: ["Hit rate on varied wording", "Low", "Higher"] },
            { cells: ["Main risk", "Misses on tiny edits", "False hits if threshold too low"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "exact-match caching vs semantic caching",
          bins: [
            { id: "exact", label: "Exact prompt cache" },
            { id: "semantic", label: "Semantic cache" }
          ],
          items: [
            { id: "i1", text: "Needs a byte-for-byte prefix match", bin: "exact" },
            { id: "i2", text: "Matches differently worded but equivalent questions", bin: "semantic" },
            { id: "i3", text: "Uses cosine similarity over embeddings", bin: "semantic" },
            { id: "i4", text: "Misses if a single token changes", bin: "exact" },
            { id: "i5", text: "Tuned with a similarity threshold", bin: "semantic" },
            { id: "i6", text: "Can return a wrong answer on a false hit", bin: "semantic" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is choosing the similarity threshold the hardest part of running a semantic cache?",
          sampleAnswer: "The threshold directly trades money against correctness, and the two pull in opposite directions. Set it low and the cache hits often, saving lots of model calls, but it starts matching questions that only look related and returns confidently wrong answers. Set it high and every answer is correct, but the cache barely matches anything beyond near-identical phrasing, so the savings shrink. There is no universal right value; you have to tune it against real traffic to catch true paraphrases without ever serving a false hit."
        }
      ],
      hints: [
        "Cosine similarity is the dot product divided by the product of the two vector magnitudes.",
        "Magnitude of a vector is sqrt of the sum of its squared components.",
        "Compare the similarity to the threshold: >= is a hit, otherwise a miss."
      ],
      challenge_title: "The Semantic Cache Simulator",
      challenge_description: "Replay a stream of query embeddings through a semantic cache: serve a hit when any stored query is similar enough, otherwise miss and store the new query. Report the hit and miss counts.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your support bot gets the same handful of questions phrased a thousand different ways, so you add a **semantic cache** in front of the model. Each incoming query arrives already embedded as a vector. The cache starts empty. For each query you compute its **cosine similarity** to every embedding already stored; if the best similarity is **at or above** a threshold, it is a **hit** and you serve the cached answer with no model call. Otherwise it is a **miss**: you call the model and add this query's embedding to the cache so future paraphrases can hit it. You're building the simulator that, given the stream and the threshold, reports how many calls the cache saved.",
      challenge_statement: "You are given `n` query embeddings, each a `d`-dimensional vector, and a similarity `threshold`. Process the queries **in order** through an initially empty cache:\n\n1. For the current query, compute the **cosine similarity** to every embedding already in the cache. Cosine similarity of vectors a and b is `dot(a,b) / (norm(a) * norm(b))`.\n2. If the cache is non-empty and the **maximum** similarity found is **>= threshold**, count a **hit** and do **not** store the query.\n3. Otherwise count a **miss** and **append** the query's embedding to the cache.\n\nPrint the total number of hits, then the total number of misses.",
      challenge_input_format: "The first line has two integers and one float: `n d threshold`.\n\nEach of the next `n` lines has `d` space-separated floats: one query embedding.",
      challenge_output_format: "Two lines. Line 1: the integer number of hits. Line 2: the integer number of misses.",
      challenge_constraints: [
        "1 ≤ n ≤ 2000",
        "1 ≤ d ≤ 64",
        "-1.0 ≤ threshold ≤ 1.0",
        "Every embedding has a non-zero magnitude.",
      ],
      challenge_examples: [
        { input: "5 2 0.95\n10 0\n9 1\n0 10\n10 1\n1 1", output: "2\n3", explanation: "q1 (10,0) miss, stored. q2 (9,1) is ~0.994 similar to q1, a hit. q3 (0,10) miss, stored. q4 (10,1) is ~0.995 similar to q1, a hit. q5 (1,1) is ~0.707 to both stored vectors, below 0.95, a miss. Hits=2, misses=3." },
        { input: "3 2 0.99\n1 0\n0 1\n1 0\n", output: "1\n2", explanation: "q1 (1,0) miss, stored. q2 (0,1) is 0.0 similar, a miss, stored. q3 (1,0) is exactly 1.0 similar to the first stored vector, a hit. Hits=1, misses=2." },
      ],
      challenge_notes: "This is the core loop inside real semantic-cache libraries, just with a brute-force scan instead of a vector index. The threshold is the dial that trades savings (more hits) against correctness (avoiding false hits), exactly as in production.",
      challenge_hints: [
        "Write a cosine helper: dot product divided by the product of the two magnitudes (sqrt of sum of squares).",
        "Keep a list of stored vectors; for each query take the maximum cosine over that list (treat an empty cache as no match).",
        "If the best similarity is >= threshold count a hit and store nothing; otherwise count a miss and append the query.",
      ],
      challenge_starter_code: `import sys
import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0]); d = int(first[1]); threshold = float(first[2])
    cached = []
    hits = 0
    misses = 0
    for i in range(n):
        vec = list(map(float, data[1 + i].split()))
        # TODO: find the best cosine(vec, c) over cached; if cache is non-empty and
        #       best >= threshold count a hit, else count a miss and append vec.
    print(hits)
    print(misses)

main()
`,
      challenge_solution_code: `import sys
import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0]); d = int(first[1]); threshold = float(first[2])
    cached = []
    hits = 0
    misses = 0
    for i in range(n):
        vec = list(map(float, data[1 + i].split()))
        best = -2.0
        for c in cached:
            sim = cosine(vec, c)
            if sim > best:
                best = sim
        if cached and best >= threshold:
            hits += 1
        else:
            misses += 1
            cached.append(vec)
    print(hits)
    print(misses)

main()
`,
      challenge_test_cases: [
        { input: "5 2 0.95\n10 0\n9 1\n0 10\n10 1\n1 1", expected_output: "2\n3", description: "Near-aligned paraphrases hit; orthogonal and 45-degree queries miss." },
        { input: "3 2 0.99\n1 0\n0 1\n1 0", expected_output: "1\n2", description: "An exact-direction repeat hits; the orthogonal query misses." },
        { input: "1 3 0.5\n1 2 3", expected_output: "0\n1", description: "First query against an empty cache is always a miss." },
        { input: "4 2 0.99\n1 0\n1 0\n1 0\n1 0", expected_output: "3\n1", description: "Identical queries hit after the first is stored." }
      ]
    },
    {
      id: "ai-13-l8",
      project_id: "ai-13",
      order: 8,
      title: "Cost vs Latency Tradeoffs",
      concept: "Tradeoffs",
      xp_reward: 10,
      explanation: `Every technique in this module pulls on the same two dials: how fast the answer feels and how much it costs. A giant model gives the best answers but is slow and expensive. A tiny model is fast and cheap but weaker. Streaming, caching, and model choice are the levers you combine to find the sweet spot — and there is no single right setting, only the right setting for *this* request.

## What it is

A **cost vs latency tradeoff** is the engineering decision of how to balance response speed, dollar cost, and answer quality, given that improving one usually worsens another. The three big dials:

- **Model tier.** Bigger models are smarter but slower and pricier per token; smaller models are faster and cheaper but less capable.
- **Streaming.** Makes a response *feel* faster (lower perceived latency) without changing cost.
- **Caching.** Cuts both cost and latency for repeated or similar requests, but only when there is reuse to exploit.

## How it works

You estimate the **expected** cost and latency of a strategy by weighting the cache-hit path against the cache-miss path. If a request hits the cache, it skips the model entirely: near-zero latency and near-zero cost. If it misses, you pay the full model latency and price.

\`\`\`python
# expected latency = hit_rate * hit_latency + miss_rate * cold_latency
hit_rate = 0.40
cold_latency = 800   # ms: TTFT + streaming the tokens
hit_latency = 5      # ms: served straight from cache

expected = hit_rate * hit_latency + (1 - hit_rate) * cold_latency
print(round(expected, 1))   # 482.0 ms
\`\`\`

This is why the levers stack. A semantic cache raises the hit rate, which pulls the expected cost and latency down. A smaller model lowers the cold-path cost and latency for the misses. Streaming lowers the *perceived* latency on every miss. Combine them and a request that would cost a lot and feel slow becomes cheap and snappy on average — without any single magic setting.

The discipline is matching the strategy to the request. A simple, common question should route to a small cheap model behind an aggressive cache. A rare, hard question should route to the big model, stream the answer, and skip the cache (it would miss anyway).

## Why it matters

- **There is no free lunch.** Push latency down hard and you usually pay more or accept a weaker model; squeeze cost and you usually wait longer.
- **Routing beats one-size-fits-all.** Sending easy requests to a cheap path and hard ones to a strong path beats forcing every request through the same model.
- **The dials compound.** Caching plus a right-sized model plus streaming together can cut both expected cost and felt latency far more than any one lever alone.

## The mental model to keep

**Speed, cost, and quality form a triangle; you cannot max all three at once. Pick the model tier for the job, stream to mask the wait, and cache to dodge repeated work — then route each request to the cheapest path that is still good and fast enough.**`,
      key_terms: [
        { term: "Cost vs latency tradeoff", definition: "The balancing act between response speed, dollar cost, and answer quality, where improving one usually worsens another." },
        { term: "Model tier", definition: "The size or class of model chosen; larger tiers are smarter but slower and costlier per token." },
        { term: "Expected latency", definition: "The hit-rate-weighted average of the fast cache-hit path and the slow cache-miss path." },
        { term: "Routing", definition: "Sending each request to the model and caching strategy best matched to its difficulty." }
      ],
      callouts: [
        { type: "insight", title: "You cannot max all three", content: "Speed, cost, and quality form a triangle. Pushing any corner all the way out drags the others in. Good systems do not seek perfection on one axis; they pick an acceptable point on all three for the request at hand.", position: "before" },
        { type: "tip", title: "Route, do not standardize", content: "Send easy, repeated questions to a small model behind an aggressive cache, and hard, novel ones to a big streamed model. Matching the path to the request beats forcing every call through one setting.", position: "after" }
      ],
      concept_diagram: {
        title: "Stacking the levers to balance cost and latency",
        steps: [
          { label: "Pick the model tier", desc: "Match model size to the difficulty of the request." },
          { label: "Add a cache", desc: "Reuse answers for repeated or similar queries to cut cost and latency." },
          { label: "Stream the misses", desc: "Mask the wait on cache misses with token-by-token output." },
          { label: "Weight the paths", desc: "Expected cost and latency blend the hit path and the miss path by hit rate." }
        ]
      },
      inline_quizzes: [
        {
          question: "With a 40% cache hit rate, a 5ms hit latency, and an 800ms cold latency, what is the expected latency?",
          options: ["402.5 ms", "482.0 ms", "800.0 ms"],
          correct_index: 1,
          explanation: "Expected = 0.40 * 5 + 0.60 * 800 = 2 + 480 = 482.0 ms."
        }
      ],
      quiz_questions: [
        {
          question: "Why is there no single 'best' setting across speed, cost, and quality?",
          options: [
            "Because all three can always be maximized together",
            "Because improving one of the three usually worsens another, so it is a tradeoff",
            "Because cost is the only thing that matters",
            "Because latency is fixed by the network"
          ],
          correct_index: 1,
          explanation: "Speed, cost, and quality form a triangle: pushing one corner out tends to pull the others in, so the right point depends on the request."
        },
        {
          question: "How does raising a cache's hit rate affect expected cost and latency?",
          options: [
            "It raises both because caching is expensive",
            "It lowers both, since more requests skip the model on the cheap fast hit path",
            "It only affects quality, not cost or latency",
            "It has no effect on the expected values"
          ],
          correct_index: 1,
          explanation: "A higher hit rate shifts more requests onto the near-zero-cost, near-zero-latency cache path, pulling the weighted expected cost and latency down."
        },
        {
          question: "Which routing strategy best balances the tradeoffs?",
          options: [
            "Send every request through the largest model with no cache",
            "Route easy, repeated requests to a small cached model and hard, novel ones to a big streamed model",
            "Always use the smallest model regardless of difficulty",
            "Disable streaming and caching to keep things simple"
          ],
          correct_index: 1,
          explanation: "Matching the path to the request - cheap cached small model for easy traffic, strong streamed model for hard traffic - beats forcing every request through one fixed setting."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tradeoff check",
          questions: [
            { question: "Streaming lowers the dollar cost of a response.", type: "true_false", correct_answer: "false", explanation: "Streaming lowers perceived latency but does not change the number of tokens billed." },
            { question: "The hit-rate-weighted average of the fast and slow paths is called the expected ______.", type: "fill_in", correct_answer: "latency", explanation: "Expected latency blends the cache-hit path and cache-miss path by the hit rate." }
          ]
        }
      ],
      starter_code: `# Compute expected latency and cost blending cache hit and miss paths.
hit_rate = 0.40
cold_latency = 800     # ms on a cache miss (full model call)
hit_latency = 5        # ms on a cache hit
cold_cost = 2000       # micro-dollars on a miss
hit_cost = 0           # micro-dollars on a hit (served from cache)

# TODO: expected = hit_rate * hit_value + (1 - hit_rate) * cold_value, for both.
print("hit_rate:", hit_rate)
`,
      solution_code: `hit_rate = 0.40
cold_latency = 800
hit_latency = 5
cold_cost = 2000
hit_cost = 0

exp_latency = hit_rate * hit_latency + (1 - hit_rate) * cold_latency
exp_cost = hit_rate * hit_cost + (1 - hit_rate) * cold_cost

print("hit_rate:", hit_rate)
print("expected_latency:", round(exp_latency, 1))
print("expected_cost:", round(exp_cost, 1))
`,
      expected_output: `hit_rate: 0.4
expected_latency: 482.0
expected_cost: 1200.0`,
      step_throughs: [
        {
          title: "blending the hit and miss paths into an expected cost",
          steps: [
            { label: "Price the miss path", detail: "A cache miss is a full model call: pay its latency and its per-call cost.", code: "cold_latency = 800ms ; cold_cost = 2000" },
            { label: "Price the hit path", detail: "A cache hit skips the model: near-zero latency and near-zero cost.", code: "hit_latency = 5ms ; hit_cost = 0" },
            { label: "Weight by hit rate", detail: "Expected value blends the two paths by how often each occurs.", code: "exp = hit_rate * hit + (1 - hit_rate) * cold" },
            { label: "Read the tradeoff", detail: "Raising the hit rate or shrinking the cold path pulls both expected cost and latency down.", code: "0.4*5 + 0.6*800 = 482ms expected" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A cache has a 50% hit rate. Hits take 0ms and cost 0; misses take 600ms and cost 1000 micro-dollars. What is the expected latency?",
          steps: [
            "Expected latency = hit_rate * hit_latency + (1 - hit_rate) * cold_latency.",
            "That is 0.5 * 0 + 0.5 * 600.",
            "Which equals 300 ms."
          ],
          output: "300 ms expected latency"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You serve a verbose feature. Option A: big model, no cache, 1200ms and 3000 cost per call. Option B: small model behind a 60% semantic cache; misses are 400ms and 500 cost, hits are 5ms and 0 cost. Compare expected latency and cost.",
          steps: [
            "Option A has no cache, so every call is the cold path: 1200ms and 3000 cost.",
            "Option B expected latency = 0.6 * 5 + 0.4 * 400 = 3 + 160 = 163ms.",
            "Option B expected cost = 0.6 * 0 + 0.4 * 500 = 200 micro-dollars.",
            "Option B is far cheaper and faster on average; the only question is whether the small model's quality is acceptable for this feature."
          ],
          output: "B: ~163ms and 200 cost vs A's 1200ms and 3000 - caching plus a smaller model wins on both axes if quality holds."
        }
      ],
      comparison_tables: [
        {
          title: "what each lever changes",
          columns: ["Lever", "Cost", "Actual latency", "Perceived latency", "Quality"],
          rows: [
            { cells: ["Bigger model tier", "Up", "Up", "Up", "Up"] },
            { cells: ["Smaller model tier", "Down", "Down", "Down", "Down"] },
            { cells: ["Streaming", "Same", "Same", "Down", "Same"] },
            { cells: ["Caching (on reuse)", "Down", "Down", "Down", "Same"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which lever to reach for",
          bins: [
            { id: "cache", label: "Reach for caching" },
            { id: "model", label: "Reach for a smaller model tier" }
          ],
          items: [
            { id: "i1", text: "The same FAQ asked thousands of ways", bin: "cache" },
            { id: "i2", text: "A simple classification that a small model nails", bin: "model" },
            { id: "i3", text: "Repeated questions over one fixed document", bin: "cache" },
            { id: "i4", text: "High per-call cost on an easy task", bin: "model" },
            { id: "i5", text: "Many near-duplicate support tickets", bin: "cache" },
            { id: "i6", text: "A latency-sensitive task that does not need the best model", bin: "model" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does routing each request to a different strategy beat picking one model and setting for everything?",
          sampleAnswer: "Requests are not uniform: most traffic is easy and repetitive, while a few are hard and novel. A single fixed setting either overpays and over-waits by sending easy requests through a big model, or underperforms by sending hard requests through a weak one. Routing sends the easy, repeated questions down a cheap cached small-model path and the rare hard ones down a strong streamed path, so each request gets the cheapest, fastest option that is still good enough. That matches spend and speed to actual difficulty instead of paying worst-case prices everywhere."
        }
      ],
      hints: [
        "Expected value weights each path by how often it happens: hit_rate and (1 - hit_rate).",
        "Apply the same weighting to both latency and cost.",
        "Round the results for clean output."
      ],
      challenge_title: "The Strategy Picker",
      challenge_description: "Given several serving strategies and a cache hit rate, compute each one's expected latency, drop the ones that blow the latency budget, and pick the cheapest survivor.",
      challenge_difficulty: "advanced",
      challenge_story: "You run the router in front of an AI feature and must choose one **serving strategy** per request class. Each strategy is a bundle: a model tier (its cold-path TTFT, per-token time, and output length), wrapped in a cache. On a **cache hit** the model is skipped, so latency is just the streaming time with no TTFT and the cost drops to a tenth. On a **miss** you pay the full cold latency and full cost. Given the cache **hit rate**, you weight the two paths into an **expected** latency and an **expected** cost. Product gives you a hard latency budget; among only the strategies whose expected latency fits, you pick the one with the lowest expected cost.",
      challenge_statement: "You are given `n` strategies, a latency `budget` in milliseconds, and an integer `hit_rate` percentage (0 to 100). Each strategy has a name and four integers: cold `ttft` (ms), output tokens `out`, per-token time `per` (ms), and cold per-call `cost` (micro-dollars).\n\nFor each strategy:\n\n- `cold_latency = ttft + per * out` and `hit_latency = per * out` (a hit skips the TTFT prefill).\n- `hit_cost = cost // 10` (a hit costs a tenth) and `cold_cost = cost`.\n- `expected_latency = (hit_rate * hit_latency + (100 - hit_rate) * cold_latency) // 100`.\n- `expected_cost = (hit_rate * hit_cost + (100 - hit_rate) * cold_cost) // 100`.\n\nA strategy is **eligible** only if its `expected_latency <= budget`. Among eligible strategies print the name with the **smallest expected_cost**; break ties by smallest expected_latency, then by the lexicographically smaller name. If none are eligible, print `NONE`.",
      challenge_input_format: "The first line has three integers `n budget hit_rate`.\n\nEach of the next `n` lines describes a strategy: a name (no spaces) followed by four integers `ttft out per cost`.",
      challenge_output_format: "One line: the chosen strategy's name, or `NONE` if none fit the budget.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "0 ≤ budget ≤ 2000000000",
        "0 ≤ hit_rate ≤ 100",
        "0 ≤ ttft, out, per, cost ≤ 100000",
        "Strategy names are unique and contain no spaces.",
      ],
      challenge_examples: [
        { input: "3 1000 50\nbig 300 100 5 2000\nsmall 100 100 2 400\nhuge 500 100 8 5000", output: "small", explanation: "expected_latency: big=(50·500+50·800)//100=650, small=(50·200+50·300)//100=250, huge=(50·800+50·1300)//100=1050 (over budget, dropped). Among {big,small}: expected_cost big=(50·200+50·2000)//100=1100, small=(50·40+50·400)//100=220, so small wins." },
        { input: "2 100 0\na 200 50 1 1000\nb 300 10 1 400", output: "NONE", explanation: "With a 0% hit rate every request is the cold path: a=200+50=250ms, b=300+10=310ms, both above the 100ms budget, so nothing is eligible." },
      ],
      challenge_notes: "This is the gate-then-minimize pattern of a real model router: filter strategies by an expected-latency SLO, then choose the cheapest. Raising the hit rate (a better cache) shifts both expected latency and expected cost downward, often making a smaller, cheaper strategy newly eligible.",
      challenge_hints: [
        "Compute cold_latency = ttft + per*out and hit_latency = per*out; the hit path skips the TTFT.",
        "Blend with integer math: expected = (hit_rate*hit + (100-hit_rate)*cold) // 100 for both latency and cost.",
        "Filter by expected_latency <= budget first, then keep the minimum (expected_cost, expected_latency, name).",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, budget, hit_rate = map(int, data[0].split())
    best = None
    for i in range(n):
        parts = data[1 + i].split()
        name = parts[0]
        ttft = int(parts[1]); out = int(parts[2]); per = int(parts[3]); cost = int(parts[4])
        # TODO: compute cold/hit latency and cost, blend by hit_rate into expected
        #       latency and cost, skip if expected latency > budget, and keep the
        #       minimum (expected_cost, expected_latency, name).
    print(best[2] if best is not None else "NONE")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, budget, hit_rate = map(int, data[0].split())
    best = None
    for i in range(n):
        parts = data[1 + i].split()
        name = parts[0]
        ttft = int(parts[1]); out = int(parts[2]); per = int(parts[3]); cost = int(parts[4])
        cold_latency = ttft + per * out
        hit_latency = per * out
        cold_cost = cost
        hit_cost = cost // 10
        exp_latency = (hit_rate * hit_latency + (100 - hit_rate) * cold_latency) // 100
        exp_cost = (hit_rate * hit_cost + (100 - hit_rate) * cold_cost) // 100
        if exp_latency > budget:
            continue
        key = (exp_cost, exp_latency, name)
        if best is None or key < best:
            best = key
    print(best[2] if best is not None else "NONE")

main()
`,
      challenge_test_cases: [
        { input: "3 1000 50\nbig 300 100 5 2000\nsmall 100 100 2 400\nhuge 500 100 8 5000", expected_output: "small", description: "Over-budget strategy dropped; cheapest expected cost among the rest wins." },
        { input: "2 100 0\na 200 50 1 1000\nb 300 10 1 400", expected_output: "NONE", description: "Zero hit rate forces the cold path; nothing fits the tight budget." },
        { input: "2 2000 100\nx 1000 100 5 9000\ny 1000 100 5 9000", expected_output: "x", description: "Identical strategies at a 100% hit rate tie on cost and latency; lexicographic name breaks it." },
        { input: "3 500 50\np 100 50 2 600\nq 100 50 2 600\nr 50 50 2 200", expected_output: "r", description: "All eligible; the cheapest cold cost gives the lowest expected cost." }
      ]
    }
  ]
};
