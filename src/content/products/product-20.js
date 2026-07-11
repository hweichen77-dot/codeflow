export default {
  project: {
    id: "prod-20",
    title: "Streaming Writing Assistant",
    description:
      "Build a small web app that streams AI-generated writing token by token, so a user watches an essay outline or email draft appear live instead of staring at a spinner. You'll wire a minimal backend endpoint that streams over Server-Sent Events, a front end that renders tokens as they arrive, and the buffering, cost, and cancellation logic that keep it solid under real network conditions.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 135,
    lessons_count: 8,
    tags: ["streaming", "server-sent-events", "fastapi", "web-app", "backend", "frontend"],
    order: 120,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-20-1",
      project_id: "prod-20",
      order: 1,
      title: "What Makes Text Stream Over HTTP",
      concept: "Server-Sent Events (SSE)",
      explanation: `A normal HTTP response is one round trip: the client asks, the server computes everything, then sends it back as a single block. That's fine for a JSON reply, but it's exactly why a naive "AI writing assistant" endpoint feels frozen for several seconds before the whole essay dumps onto the screen at once. This project fixes that by keeping the connection open and sending the reply in pieces as it's generated.

## The protocol we'll use: SSE

**Server-Sent Events (SSE)** is a plain-HTTP way to stream data from server to client, one direction only. No new protocol, no special port, just a response that never quite "finishes": the server keeps the connection open and writes small framed messages to it over time. Browsers and HTTP clients already know how to read this format natively.

An SSE frame has a strict, boring shape: a line starting with \`data: \`, followed by the payload, followed by a **blank line** that marks the end of that event.

\`\`\`
data: Once

data: upon

data: a time

\`\`\`

That trailing blank line (\`\\n\\n\`) is not decoration, it's the delimiter. Without it, a receiver can't tell where one chunk ends and the next begins.

## Why SSE instead of a WebSocket

WebSockets are bidirectional and heavier to set up (a handshake, a different scheme, your own framing). A writing assistant only needs one direction, server to client, so SSE is the lazier, correct tool: it rides on normal HTTP, works through most proxies, and browsers auto-reconnect a dropped SSE connection for you. Save WebSockets for chat-style apps where the client also needs to push data mid-stream.

## What the server actually does

\`\`\`python
def format_sse(data: str) -> str:
    return f"data: {data}\\n\\n"

for token in ["Once", "upon", "a", "time"]:
    chunk = format_sse(token)
    # in a real server this gets written to the response stream, not returned
\`\`\`

Every later lesson builds on this one function: whatever you want to send, you wrap it in \`data: ...\\n\\n\` before it goes out the socket. The content-type header for a real endpoint is \`text/event-stream\`, which tells the browser "don't buffer this, hand me pieces as they arrive."

## The mental model

Think of SSE as a radio broadcast, not a phone call: the server just keeps transmitting frames, and anyone tuned in receives them in order, one at a time, with a clear "end of this message" marker between them. Below, you'll write the framing function by hand and use it on a list of words, no network involved yet, just getting the wire format exactly right, since every bug in later lessons traces back to this shape.`,
      starter_code: `# Format plain strings into the SSE wire format: "data: <text>\\n\\n"

def format_sse(data):
    # TODO: return f"data: {data}\\n\\n"
    pass

tokens = ["Once", "upon", "a", "time"]

stream = ""
for t in tokens:
    stream += format_sse(t)

print(stream, end="")
print("FRAMES:", stream.count("\\n\\n"))
`,
      solution_code: `# Format plain strings into the SSE wire format: "data: <text>\\n\\n"

def format_sse(data):
    return f"data: {data}\\n\\n"

tokens = ["Once", "upon", "a", "time"]

stream = ""
for t in tokens:
    stream += format_sse(t)

print(stream, end="")
print("FRAMES:", stream.count("\\n\\n"))
`,
      hints: [
        "The frame is just an f-string: 'data: ' plus the text plus two newlines.",
        "Each frame must end in a blank line, that's the '\\n\\n', not a single '\\n'.",
        "Concatenate the frames with plain string addition to build the full stream.",
      ],
      challenge_title: "Frame the Stream",
      challenge_description:
        "Format a list of text deltas into SSE data frames and report how many characters of payload were sent.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # parse done: 'lines' holds the n delta strings, in order

    # TODO: for each line, print "data: {line}" followed by a blank line.
    # TODO: after all frames, print "TOTAL <n>" where n is the sum of
    #       len(line) over all lines (payload characters only, no "data: ").

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    total = 0
    for line in lines:
        print(f"data: {line}")
        print("")
        total += len(line)

    print(f"TOTAL {total}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nHello\nworld",
          expected_output: "data: Hello\n\ndata: world\n\nTOTAL 10",
          description: "Two deltas frame cleanly; TOTAL is 5 + 5 = 10 payload characters.",
        },
        {
          input: "1\nAI",
          expected_output: "data: AI\n\nTOTAL 2",
          description: "A single delta still gets its own frame and blank-line terminator.",
        },
        {
          input: "3\na b\n\nc",
          expected_output: "data: a b\n\ndata: \n\ndata: c\n\nTOTAL 4",
          description: "Edge: an empty delta still emits a valid 'data: ' frame with no payload.",
        },
      ],
    },
    {
      id: "prod-20-2",
      project_id: "prod-20",
      order: 2,
      title: "The Smallest Streaming Endpoint",
      concept: "a generator-based route",
      explanation: `You have the wire format. Now build the smallest backend that actually uses it: one route that keeps the connection open and yields SSE frames as a Python generator produces them.

## A generator is the whole trick

A normal route handler builds a full response, then returns it. A streaming route instead returns a **generator**, a function that \`yield\`s pieces over time instead of \`return\`ing one value. The web framework reads from that generator and writes each yielded piece straight to the open socket as soon as it appears.

\`\`\`python
from flask import Flask, Response

app = Flask(__name__)

def token_stream(prompt):
    for word in fake_model_reply(prompt).split(" "):
        yield f"data: {word} \\n\\n"

@app.route("/generate")
def generate():
    prompt = request.args.get("prompt", "")
    return Response(token_stream(prompt), mimetype="text/event-stream")
\`\`\`

FastAPI's version is the same idea with a different name (\`StreamingResponse\`):

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/generate")
def generate(prompt: str):
    return StreamingResponse(token_stream(prompt), media_type="text/event-stream")
\`\`\`

Both frameworks do the same job: hold the connection open, pull the next item from the generator when it's ready, write it out, repeat until the generator is exhausted, then close the connection.

## Where the real model plugs in

In production, \`token_stream\` doesn't split a fake string, it iterates the model's own streaming API and re-wraps each piece as an SSE frame:

\`\`\`python
def token_stream(prompt):
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            yield f"data: {text}\\n\\n"
\`\`\`

Notice the endpoint's job is thin: it doesn't decide *what* to write, it just re-frames whatever the model hands it. That's deliberate, keep the streaming plumbing dumb and reusable, and let the model do the generating.

## Why generators, not lists

If \`token_stream\` built a list of all frames and returned it, you'd be right back to waiting for the whole reply before sending anything, streaming would just be a false label on a blocking call. The generator is what makes "send as it's produced" literally true: each \`yield\` hands one piece to the framework immediately, instead of accumulating.

## The mental model

A streaming endpoint is a pipe, not a bucket. A bucket fills up, then you dump it out all at once. A pipe lets water flow through continuously as it arrives at one end. Below, build the generator and framing together in pure Python: simulate the model's output as a list of words, wrap each in SSE, and print the assembled stream, no network yet, just the shape of the endpoint's core loop.`,
      starter_code: `# Simulate a streaming endpoint's core loop: consume tokens from a
# fake generator, wrap each in the SSE frame, and assemble the stream.

def fake_model_stream(text):
    for word in text.split(" "):
        yield word + " "

def format_sse(data):
    return f"data: {data}\\n\\n"

def run_endpoint(prompt):
    # TODO: build the full SSE stream by calling fake_model_stream(prompt)
    #       and format_sse on each yielded piece, concatenated together.
    pass

stream = run_endpoint("the ship sailed at dawn")
print(stream, end="")
`,
      solution_code: `# Simulate a streaming endpoint's core loop: consume tokens from a
# fake generator, wrap each in the SSE frame, and assemble the stream.

def fake_model_stream(text):
    for word in text.split(" "):
        yield word + " "

def format_sse(data):
    return f"data: {data}\\n\\n"

def run_endpoint(prompt):
    out = ""
    for piece in fake_model_stream(prompt):
        out += format_sse(piece)
    return out

stream = run_endpoint("the ship sailed at dawn")
print(stream, end="")
print("PIECES:", stream.count("data: "))
`,
      hints: [
        "Loop over fake_model_stream(prompt) the same way you'd loop over stream.text_stream.",
        "Wrap each yielded piece with format_sse before adding it to the output string.",
        "The endpoint's job is just re-framing, it never inspects or rewrites the words themselves.",
      ],
      challenge_title: "Consume the Token Stream",
      challenge_description:
        "Reassemble a reply from an ordered list of streamed chunks and report how many chunks it took.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]
    # parse done: 'chunks' holds the n streamed pieces, in arrival order

    # TODO: print the full assembled text (chunks concatenated, no separator).
    # TODO: print "CHUNKS <n>" where n is the number of chunks.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]

    assembled = "".join(chunks)
    print(assembled)
    print(f"CHUNKS {n}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nOnce \nupon \na time",
          expected_output: "Once upon a time\nCHUNKS 3",
          description: "Three chunks concatenate directly into the full reply.",
        },
        {
          input: "1\nHi",
          expected_output: "Hi\nCHUNKS 1",
          description: "A single chunk is already the whole reply.",
        },
        {
          input: "4\nThe\n end.\n\n!",
          expected_output: "The end.!\nCHUNKS 4",
          description: "Edge: an empty chunk in the middle contributes nothing but still counts.",
        },
      ],
    },
    {
      id: "prod-20-3",
      project_id: "prod-20",
      order: 3,
      title: "Chunking the Reply Into Deltas",
      concept: "delta chunking",
      explanation: `Real model APIs don't send you whole words at civilized boundaries. They send **deltas**, small, arbitrary-sized pieces of text that arrive as the model produces them. Sometimes a delta is a whole word, sometimes half a word, sometimes just punctuation. Your job as the client is to not care, and just concatenate everything in order.

## What a delta actually is

A delta is "whatever text arrived in this event." There's no promise it aligns with words, sentences, or anything meaningful on its own:

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=400,
    messages=[{"role": "user", "content": "Write two sentences about rain."}],
) as stream:
    for delta in stream.text_stream:
        print(repr(delta))
\`\`\`

That might print \`'Ra'\`, then \`'in'\`, then \`' falls'\`, then \`' softly'\`, and so on, unpredictable boundaries every run. This is exactly why lesson 2's endpoint just re-frames whatever it receives instead of trying to buffer up to word boundaries: the API already decided the chunking, you just relay it.

## Order is the only thing that matters

Deltas are meaningless individually and only make sense **concatenated in arrival order**. If you drop one, skip one, or reorder two, the final text is corrupted, there's no "close enough." That's the whole contract: receive in order, join with nothing in between, done.

\`\`\`python
def reconstruct(deltas):
    return "".join(deltas)
\`\`\`

No spaces added, no separators, the deltas already contain any spacing the model produced. Adding your own separator between deltas is one of the most common streaming bugs, it silently inserts extra whitespace that wasn't in the original reply.

## Chunk size is a knob, not a rule

If you're chunking text yourself (say, replaying a cached reply, or building a demo without live network calls), you get to pick delta size. Small chunks (a few characters) feel smoother and more "typed live" but mean more frames and slightly more overhead per character sent. Larger chunks are cheaper per byte but feel more like stutter-then-dump. Most production streams don't chunk at a fixed size at all, the model decides, and you just relay; you'll only pick a chunk size yourself when simulating or testing.

## The mental model

A delta is one puzzle piece with no picture printed on the box. You can't tell what the final image looks like from one piece, you can only place pieces down in the order they're handed to you and trust that concatenation reveals the whole picture. Below, you'll split a full string into fixed-size deltas and prove that reconstructing it, in order, with no separators, gives back the exact original.`,
      starter_code: `# Split a full reply into fixed-size deltas, then verify reconstruction
# by concatenating them back together in order.

def split_into_deltas(text, size):
    # TODO: return a list of substrings of length 'size' (the last one
    #       may be shorter), covering all of 'text' in order.
    pass

def reconstruct(deltas):
    # TODO: join the deltas back into one string, no separator.
    pass

text = "hello world"
deltas = split_into_deltas(text, 3)
print(deltas)
print(reconstruct(deltas) == text)
`,
      solution_code: `# Split a full reply into fixed-size deltas, then verify reconstruction
# by concatenating them back together in order.

def split_into_deltas(text, size):
    return [text[i:i + size] for i in range(0, len(text), size)]

def reconstruct(deltas):
    return "".join(deltas)

text = "hello world"
deltas = split_into_deltas(text, 3)
print(deltas)
print(reconstruct(deltas) == text)
print("DELTAS:", len(deltas))
`,
      hints: [
        "A range with a step equal to 'size' walks the string in fixed-size windows.",
        "Slicing past the end of a string is safe in Python, it just returns a shorter piece.",
        "reconstruct is just ''.join(deltas), no separator between pieces.",
      ],
      challenge_title: "Split Into Deltas",
      challenge_description:
        "Chunk a string into fixed-size deltas and print each on its own line, then report how many pieces it took.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    size = int(data[0])
    text = data[1]
    # parse done: 'size' is the max delta length; 'text' is the full string

    # TODO: split text into chunks of length 'size' (last one may be shorter),
    #       print each chunk on its own line, in order.
    # TODO: print "CHUNKS <n>" where n is the number of chunks produced.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    size = int(data[0])
    text = data[1]

    chunks = [text[i:i + size] for i in range(0, len(text), size)]
    for c in chunks:
        print(c)
    print(f"CHUNKS {len(chunks)}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nhello world",
          expected_output: "hel\nlo \nwor\nld\nCHUNKS 4",
          description: "An 11-character string splits into three full 3-char chunks and one 2-char remainder.",
        },
        {
          input: "5\nAI",
          expected_output: "AI\nCHUNKS 1",
          description: "A string shorter than the chunk size becomes exactly one chunk.",
        },
        {
          input: "1\nab",
          expected_output: "a\nb\nCHUNKS 2",
          description: "Edge: a chunk size of 1 splits every character into its own piece.",
        },
      ],
    },
    {
      id: "prod-20-4",
      project_id: "prod-20",
      order: 4,
      title: "The Front End That Renders Live",
      concept: "parsing SSE on the client",
      explanation: `The backend is streaming frames. Now build the other half: a browser page that reads those frames as they arrive and paints each one onto the screen the moment it shows up, no full-page wait.

## Reading a stream in the browser

The plain-JavaScript way uses \`fetch\` with a \`ReadableStream\` reader. You read raw bytes in whatever-sized pieces the network hands you, decode them to text, and split on the frame boundary:

\`\`\`javascript
async function renderStream(prompt, targetEl) {
  const res = await fetch("/generate?prompt=" + encodeURIComponent(prompt));
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let frames = buffer.split("\\n\\n");
    buffer = frames.pop();               // keep the incomplete tail for next read
    for (const frame of frames) {
      if (frame.startsWith("data: ")) {
        targetEl.textContent += frame.slice(6);
      }
    }
  }
}
\`\`\`

Look closely at \`frames.pop()\`. \`buffer.split("\\n\\n")\` may cut a frame in half if the network delivered fewer bytes than a full frame. The last element after splitting is whatever's left over, possibly a complete frame, possibly a fragment. Popping it off and keeping it in \`buffer\` for the next read is what makes this safe: you never render a half-arrived chunk, you only render frames you know are complete.

## The DOM update is the whole point

\`targetEl.textContent += frame.slice(6)\` is the line that makes this feel alive. Each time a frame completes, you append its payload directly onto whatever's already on the page, the essay draft visibly grows word by word instead of appearing as one block after a multi-second wait. \`slice(6)\` strips the \`"data: "\` prefix (6 characters), leaving just the payload.

## Why this mirrors the backend exactly

The client-side parser and the SSE format from lesson 1 are two ends of the same contract: the server promises "every event ends in a blank line," and the client's whole parsing strategy, buffer bytes, split on \`\\n\\n\`, keep the remainder, is built entirely around trusting that promise. Get the framing wrong on either side and the other side's assumptions break.

## The mental model

The reader is a person transcribing a radio broadcast live: they write down each complete sentence the instant they hear it end, but they hold onto an unfinished sentence in their head until the rest of it arrives. Below, you'll write that same parser in pure Python: given raw multi-frame text, split it into individual payloads, exactly what the JavaScript above does one \`fetch\` chunk at a time.`,
      starter_code: `# Parse raw SSE text back into a list of payload strings.
# Frames are separated by a blank line ("\\n\\n"); only "data: " frames count.

def parse_sse(raw):
    # TODO: split raw on "\\n\\n" to get frame candidates.
    # TODO: keep only frames that start with "data: ", stripping that prefix.
    # TODO: return the list of payloads, in order.
    pass

raw = "data: Hello\\n\\ndata: world\\n\\n"
print(parse_sse(raw))
`,
      solution_code: `# Parse raw SSE text back into a list of payload strings.
# Frames are separated by a blank line ("\\n\\n"); only "data: " frames count.

def parse_sse(raw):
    frames = raw.split("\\n\\n")
    payloads = []
    for frame in frames:
        if frame.startswith("data: "):
            payloads.append(frame[6:])
    return payloads

raw = "data: Hello\\n\\ndata: world\\n\\n"
payloads = parse_sse(raw)
print(payloads)
print("EVENTS:", len(payloads))
`,
      hints: [
        "raw.split('\\n\\n') gives you frame candidates, including a trailing empty one to ignore.",
        "Only frames starting with the literal 'data: ' (6 characters) are real events.",
        "frame[6:] strips the prefix and leaves the payload.",
      ],
      challenge_title: "Parse the SSE Wire Format",
      challenge_description:
        "Recover the data payloads from a raw SSE stream, skipping any malformed or non-data frames.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read()
    # 'raw' is the full raw SSE stream, frames separated by "\\n\\n"

    # TODO: split into frames, keep only ones starting with "data: ",
    #       and print each payload (frame with the prefix stripped) on its own line.
    # TODO: print "EVENTS <n>" where n is the number of payloads printed.

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read()
    frames = raw.split("\\n\\n")

    count = 0
    for frame in frames:
        if frame.startswith("data: "):
            print(frame[6:])
            count += 1

    print(f"EVENTS {count}")

main()
`,
      challenge_test_cases: [
        {
          input: "data: Hello\n\ndata: world\n\n",
          expected_output: "Hello\nworld\nEVENTS 2",
          description: "Two well-formed data frames parse into two payloads.",
        },
        {
          input: "data: A\n\nnote: skip\n\ndata: B\n\n",
          expected_output: "A\nB\nEVENTS 2",
          description: "A frame without the 'data: ' prefix is not a valid event and is skipped.",
        },
        {
          input: "data: \n\ndata: X\n\n",
          expected_output: "\nX\nEVENTS 2",
          description: "Edge: a frame with an empty payload still counts as one event.",
        },
      ],
    },
    {
      id: "prod-20-5",
      project_id: "prod-20",
      order: 5,
      title: "Stream to Show, Store to Remember",
      concept: "assembling and saving the draft",
      explanation: `Streaming is a display trick. It changes what the user sees while the reply is being generated, but it does nothing on its own to remember what got written. If your writing assistant needs a "continue this draft" or "regenerate" button, you need the complete text saved somewhere the moment the stream ends, not just painted onto the screen and forgotten.

## Two separate jobs

- **Stream to show**: append each delta to the page as it arrives, so the user watches the draft appear live.
- **Store to remember**: once the stream finishes, take the full assembled text and save it, into a history list, a database row, a file, whatever your app needs next.

\`\`\`python
def generate_and_store(prompt, history):
    full_reply = ""
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=600,
        messages=history + [{"role": "user", "content": prompt}],
    ) as stream:
        for delta in stream.text_stream:
            print(delta, end="", flush=True)   # show
            full_reply += delta                # accumulate

    history.append({"role": "user", "content": prompt})
    history.append({"role": "assistant", "content": full_reply})  # remember
    return full_reply
\`\`\`

Notice \`full_reply\` is built the exact same way as lesson 3's \`reconstruct\`: concatenate deltas, in order, no separators. The printing and the accumulating happen in the same loop, but they're doing different jobs, one is for the user's eyes, one is for your data.

## Why a writing assistant especially needs this

A summarizer or chatbot needs history so the model remembers earlier turns. A writing assistant needs it for a slightly different reason: users iterate. "Make the second paragraph shorter," "give me a punchier opening," these follow-up requests only make sense if the assistant can see the draft it just streamed. Skip the store step and every "regenerate" starts from nothing, the model has no memory of what it just wrote, even though the user watched it happen a second ago.

## The failure mode this prevents

Imagine a UI that streams beautifully, tokens flowing onto the page, users delighted, but the JavaScript never saves the assembled text anywhere. Refresh the page and the draft is gone. Ask for a revision and the model has no prior draft to revise. The stream looked complete, but nothing was ever stored, that gap is invisible until a user hits it.

## The mental model

Streaming is the live performance; storing is the recording. An audience watching a concert live still needs someone to actually hit record if anyone's going to listen to it again. Below, you'll assemble a streamed reply from its chunks and append it as a new turn onto a growing history list, the store half of "stream to show, store to remember."`,
      starter_code: `# Assemble a streamed reply from its chunks, then append it as a new
# assistant turn onto the existing conversation history.

def assemble(chunks):
    # TODO: join the chunks into the full reply text, no separator.
    pass

def store(history, prompt, reply):
    # TODO: append a user turn for 'prompt' and an assistant turn for 'reply'
    #       onto 'history' (mutate the list in place), then return it.
    pass

history = [{"role": "user", "content": "Write me a haiku about the sea"}]
chunks = ["Waves ", "crash ", "softly"]

reply = assemble(chunks)
history = store(history, "Write me a haiku about the sea", reply)
print(len(history), history[-1])
`,
      solution_code: `# Assemble a streamed reply from its chunks, then append it as a new
# assistant turn onto the existing conversation history.

def assemble(chunks):
    return "".join(chunks)

def store(history, prompt, reply):
    history.append({"role": "assistant", "content": reply})
    return history

history = [{"role": "user", "content": "Write me a haiku about the sea"}]
chunks = ["Waves ", "crash ", "softly"]

reply = assemble(chunks)
history = store(history, "Write me a haiku about the sea", reply)
print(len(history), history[-1])
`,
      hints: [
        "assemble is just ''.join(chunks), same as lesson 3's reconstruct.",
        "store only needs to append the assistant turn here, the user turn is already in history.",
        "history.append mutates the list in place; returning it too just makes the flow explicit.",
      ],
      challenge_title: "Assemble and Append the Draft",
      challenge_description:
        "Reassemble a streamed reply from its chunks, append it to a conversation history, and report the final state.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx]); idx += 1
    history = []
    for _ in range(m):
        role, content = data[idx].split(" ", 1); idx += 1
        history.append((role, content))
    n = int(data[idx]); idx += 1
    chunks = data[idx:idx + n]
    # parse done: 'history' holds m prior (role, content) turns;
    #             'chunks' holds the n streamed pieces of the new reply

    # TODO: assemble the chunks into the full reply (no separator).
    # TODO: append ("assistant", reply) onto history.
    # TODO: print "TURNS <len(history)>".
    # TODO: print "LAST assistant <reply>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx]); idx += 1
    history = []
    for _ in range(m):
        role, content = data[idx].split(" ", 1); idx += 1
        history.append((role, content))
    n = int(data[idx]); idx += 1
    chunks = data[idx:idx + n]

    reply = "".join(chunks)
    history.append(("assistant", reply))

    print(f"TURNS {len(history)}")
    print(f"LAST assistant {reply}")

main()
`,
      challenge_test_cases: [
        {
          input: "1\nuser Write me a haiku about the sea\n3\nWaves \ncrash \nsoftly",
          expected_output: "TURNS 2\nLAST assistant Waves crash softly",
          description: "One prior turn plus the newly assembled assistant reply gives two total turns.",
        },
        {
          input: "0\n2\nHi \nthere",
          expected_output: "TURNS 1\nLAST assistant Hi there",
          description: "With no prior history, the assembled reply becomes the only turn.",
        },
        {
          input: "2\nuser draft an email\nassistant Sure, on what topic?\n1\nDone",
          expected_output: "TURNS 3\nLAST assistant Done",
          description: "Edge: appending onto an existing two-turn history yields three turns total.",
        },
      ],
    },
    {
      id: "prod-20-6",
      project_id: "prod-20",
      order: 6,
      title: "Buffers Don't Respect Your Frame Boundaries",
      concept: "partial-frame buffering",
      explanation: `Real networks don't deliver data in tidy, frame-sized packages. A single \`read()\` on the client might return half of an SSE frame, or three and a half frames, cut off wherever the network happened to hand you bytes. If your parser assumes every read boundary lines up with a frame boundary, it will occasionally slice a payload in half or silently drop a frame that arrived split across two reads.

## The buffering rule

Whenever you receive raw bytes from a stream, **append them to a running buffer**, then split that buffer on the frame delimiter (\`\\n\\n\`). Every piece except the very last one is a **complete** frame, safe to process. The last piece is whatever's left over after the final delimiter you found, it might be empty (the stream ended cleanly), or it might be a real frame that hasn't finished arriving yet. Either way, you hold it back and wait for more data before treating it as complete.

\`\`\`python
buffer = ""

def on_network_chunk(raw_bytes_as_text):
    global buffer
    buffer += raw_bytes_as_text
    frames = buffer.split("\\n\\n")
    buffer = frames.pop()          # last piece may be incomplete, keep it
    for frame in frames:
        if frame.startswith("data: "):
            handle(frame[6:])       # only complete frames reach here
\`\`\`

This is the exact same \`frames.pop()\` move from lesson 4's JavaScript reader, now in Python, because it's a network-level problem, not a language-level one. Whatever language you write the client in, the fix is identical: buffer, split, hold the tail.

## Why the tail can't just be processed anyway

Suppose a chunk splits mid-frame: \`"data: hello wo"\` arrives, then \`"rld\\n\\n"\` arrives a moment later. If you process \`"data: hello wo"\` immediately as if it were complete, you've rendered a broken half-word to the user and lost the rest when the second half arrives with no matching frame to attach it to. Holding the incomplete tail and prepending the next chunk to it is what stitches \`"data: hello wo"\` and \`"rld\\n\\n"\` back into the single frame they always were.

## Applying this to a whole finished transcript

If you're handed a complete raw stream all at once (a saved log, a test fixture, a full response body), the same logic still applies: split on \`\\n\\n\`, and treat only the pieces **before** the final split as guaranteed-complete frames. If the stream ends without a trailing \`\\n\\n\`, that last piece is an unfinished frame that was cut off, correctly discarded rather than rendered as garbled text.

## The mental model

You're assembling a jigsaw puzzle from a box that gets refilled while you work. You never place a piece you're not sure is whole, you set uncertain-looking pieces aside and check again once more pieces arrive. Below, you'll implement exactly that: recover every complete frame from a raw stream, and correctly drop anything left dangling at the end.`,
      starter_code: `# Recover complete SSE frames from a raw stream, dropping any
# incomplete trailing frame that hasn't finished arriving.

def recover_frames(raw):
    # TODO: split raw on "\\n\\n". Every piece EXCEPT the last is a
    #       complete frame candidate; drop the last piece entirely.
    # TODO: from the complete frames, keep only ones starting with
    #       "data: ", stripped of that prefix, and return them as a list.
    pass

raw = "data: full\\n\\ndata: partial"
print(recover_frames(raw))
`,
      solution_code: `# Recover complete SSE frames from a raw stream, dropping any
# incomplete trailing frame that hasn't finished arriving.

def recover_frames(raw):
    frames = raw.split("\\n\\n")
    complete = frames[:-1]
    payloads = [f[6:] for f in complete if f.startswith("data: ")]
    return payloads

raw = "data: full\\n\\ndata: partial"
print(recover_frames(raw))

raw2 = "data: A\\n\\ndata: BC\\n\\n"
print(recover_frames(raw2))
`,
      hints: [
        "frames[:-1] drops the last split piece, which may be empty or an unfinished frame.",
        "A stream that ends cleanly with '\\n\\n' just makes that dropped last piece an empty string, harmless.",
        "A stream cut off mid-frame makes that dropped last piece the dangling partial text, correctly discarded.",
      ],
      challenge_title: "Recover the Stream, Drop the Incomplete Tail",
      challenge_description:
        "Parse a raw SSE stream into complete data payloads, discarding any frame left unfinished at the end.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read()
    # 'raw' is the full raw stream received so far; it may or may not
    # end with a complete "\\n\\n" terminator.

    # TODO: split on "\\n\\n"; the LAST piece is never treated as complete
    #       (drop it, whether it's empty or a dangling partial frame).
    # TODO: from the remaining complete pieces, keep only "data: " frames,
    #       print each payload on its own line, then print "EVENTS <n>".

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read()
    frames = raw.split("\\n\\n")
    complete = frames[:-1]

    count = 0
    for frame in complete:
        if frame.startswith("data: "):
            print(frame[6:])
            count += 1

    print(f"EVENTS {count}")

main()
`,
      challenge_test_cases: [
        {
          input: "data: A\n\ndata: BC\n\n",
          expected_output: "A\nBC\nEVENTS 2",
          description: "A stream ending cleanly with '\\n\\n' recovers both complete frames.",
        },
        {
          input: "data: full\n\ndata: partial",
          expected_output: "full\nEVENTS 1",
          description: "The dangling 'data: partial' frame at the end was never finished and is discarded.",
        },
        {
          input: "",
          expected_output: "EVENTS 0",
          description: "Edge: an empty stream (nothing received yet) recovers zero events.",
        },
      ],
    },
    {
      id: "prod-20-7",
      project_id: "prod-20",
      order: 7,
      title: "Streaming Still Costs Tokens",
      concept: "budget-aware streaming",
      explanation: `Streaming changes how a reply *feels*, not what it *costs*. Every token the model generates is still billed, whether you display it all at once or one piece at a time. A writing assistant that lets users generate long drafts on repeat needs a way to cap spend and stop generation early, without waiting for the model to decide it's done on its own.

## The token estimate you already know

Same rough rule as anywhere else in this track: about four characters per token in English.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

As chunks stream in, keep a running total. The moment the next chunk would push you over budget, stop consuming, close the connection, and truncate the draft, rather than let the model keep generating (and billing) past the limit you set.

## Stopping a live stream, for real

With the Anthropic SDK, closing the \`with\` block early ends the request, you don't have to let \`stream.text_stream\` run to exhaustion:

\`\`\`python
def stream_within_budget(prompt, budget_tokens):
    used = 0
    full_reply = ""
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for delta in stream.text_stream:
            cost = estimate_tokens(delta)
            if used + cost > budget_tokens:
                break                      # stop consuming, connection closes
            used += cost
            full_reply += delta
    return full_reply, used
\`\`\`

The \`break\` inside the \`with\` block is what actually stops the spend, once you exit the context manager without draining the stream, the SDK closes the connection instead of paying for tokens you'll never show anyone.

## Why check *before* adding, not after

Notice the check happens before \`used\` is updated: \`if used + cost > budget_tokens\`. That guarantees you never report a total that exceeds the budget, and never include a chunk that would have pushed you over. Checking after the fact ("stop once we're over") means you always slightly overshoot, exactly the kind of off-by-one that turns "budget: 1000 tokens" into "actually billed 1050."

## Why this matters for a writing assistant specifically

Essay drafts, email rewrites, and outline generators are exactly the kind of request users click "regenerate" on repeatedly. Without a budget guard, a single runaway prompt (or a user mashing the button) can quietly rack up a large bill across dozens of long, unwatched generations. A budget check turns "hope it stays cheap" into "guaranteed it stays under this number."

## The mental model

A budget guard is a meter running next to a taxi, not a fixed fare. You don't know the exact final cost in advance, so you watch the running total live and pull over the moment it hits your limit, instead of finding out the damage only after the ride ends. Below, consume a list of chunks against a token budget, stopping the moment the next one would exceed it.`,
      starter_code: `# Consume streamed chunks against a token budget, stopping BEFORE
# any chunk that would push the running total over the limit.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def stream_within_budget(chunks, budget):
    # TODO: walk chunks in order, tracking a running token total.
    # TODO: before adding a chunk, check if used + its cost would exceed
    #       budget; if so, stop (do not include this or later chunks).
    # TODO: return (assembled_text, tokens_used, kept_count).
    pass

chunks = ["abcd", "efgh", "ijkl"]
text, used, kept = stream_within_budget(chunks, 2)
print(text, used, kept)
`,
      solution_code: `# Consume streamed chunks against a token budget, stopping BEFORE
# any chunk that would push the running total over the limit.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def stream_within_budget(chunks, budget):
    used = 0
    kept = 0
    out = ""
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if used + cost > budget:
            break
        used += cost
        out += chunk
        kept += 1
    return out, used, kept

chunks = ["abcd", "efgh", "ijkl"]
text, used, kept = stream_within_budget(chunks, 2)
print(text, used, kept)
print("TRUNCATED:", kept < len(chunks))
`,
      hints: [
        "Check 'used + cost > budget' BEFORE adding, so you never report a total over budget.",
        "Break out of the loop entirely on the first chunk that would exceed budget, don't skip and continue.",
        "A budget of 0 should stop before even the first chunk, since any chunk costs at least 1 token.",
      ],
      challenge_title: "Stop Within the Token Budget",
      challenge_description:
        "Consume streamed chunks against a token budget, stopping before the running total would exceed it, and report the outcome.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    chunks = data[2:2 + n]
    # parse done: 'budget' is the token cap; 'chunks' is the ordered stream

    # TODO: walk chunks in order with a running token total, stopping
    #       BEFORE any chunk that would push the total over budget.
    # TODO: print the assembled text kept so far (may be empty).
    # TODO: print "KEPT <count>", "TOKENS <total>", "TRUNCATED <True/False>"
    #       (True if fewer chunks were kept than were given).

main()
`,
      challenge_solution_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    chunks = data[2:2 + n]

    used = 0
    kept = 0
    out = ""
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if used + cost > budget:
            break
        used += cost
        out += chunk
        kept += 1

    print(out)
    print(f"KEPT {kept}")
    print(f"TOKENS {used}")
    print(f"TRUNCATED {kept < n}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\n3\nabcd\nefgh\nijkl",
          expected_output: "abcdefgh\nKEPT 2\nTOKENS 2\nTRUNCATED True",
          description: "A budget of 2 admits two 1-token chunks, then stops before the third would make it 3.",
        },
        {
          input: "100\n2\nHi \nthere",
          expected_output: "Hi there\nKEPT 2\nTOKENS 2\nTRUNCATED False",
          description: "A generous budget keeps every chunk with no truncation.",
        },
        {
          input: "0\n1\nword",
          expected_output: "\nKEPT 0\nTOKENS 0\nTRUNCATED True",
          description: "Edge: a budget of 0 stops before even the first chunk, since any chunk costs at least 1 token.",
        },
      ],
    },
    {
      id: "prod-20-8",
      project_id: "prod-20",
      order: 8,
      title: "Ship the Streaming Writing Assistant",
      concept: "packaging the full app",
      explanation: `Everything so far has been pieces: framing, a generator route, delta chunking, a client parser, storing the draft, buffering, budget guards. Shipping means wiring all of it into one small, runnable web app. Finish this lesson and the build lands in your **Portfolio**.

## The shape of the finished app

Two files cover it:

- **A backend** (Flask or FastAPI) with one route that streams SSE frames from the model, exactly like lesson 2, wrapped with lesson 7's budget guard.
- **A single \`index.html\`** with a textarea for the writing prompt, a "Generate" button, and a \`<div>\` the JavaScript from lesson 4 appends tokens into live.

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse

app = FastAPI()

@app.get("/")
def index():
    return HTMLResponse(open("index.html").read())

@app.get("/generate")
def generate(prompt: str):
    def stream():
        used = 0
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        ) as s:
            for delta in s.text_stream:
                cost = estimate_tokens(delta)
                if used + cost > TOKEN_BUDGET:
                    break
                used += cost
                yield f"data: {delta}\\n\\n"
    return StreamingResponse(stream(), media_type="text/event-stream")
\`\`\`

Run it with \`uvicorn app:app --reload\`, open \`http://localhost:8000\`, type a prompt, click Generate, and watch the draft appear live. That's the whole product.

## What "shipped" means here

Same three checks as every build in this track: it runs from a clean start with one command (\`uvicorn app:app\`), it survives an empty prompt or a dropped connection without crashing (lessons 6 and 7's guards), and someone else could point their browser at it and use it with no explanation beyond "type a prompt, click Generate."

## Don't skip the harden lessons in the real build

It's tempting to wire the happy path (lessons 1-5) and call it done. The two harden lessons are what keep this from breaking the first time a user's connection hiccups or someone leaves a huge budget-less prompt running: buffer partial frames on the client (lesson 6), and cap spend with a token budget on the server (lesson 7). A demo that only works on a fast, stable connection isn't shipped, it's a screen recording waiting to happen.

## Into your Portfolio

Finishing this lesson records the Streaming Writing Assistant in your **Portfolio** tab, title, what it does, and that it's built. Keep an example prompt and a screenshot of it mid-stream next to it as proof it works; a live-streaming UI is one of the more visually convincing things in your shelf of built products.

## The mental model

A shipped streaming app hides all of this lesson's plumbing behind one button. The user never thinks about SSE frames, buffers, or token budgets, they just watch words appear. Below, wire the pipeline end to end in pure Python: chunk a reply, frame it, parse it back, and enforce the budget, one function that does what your whole app does, the last piece before it's done.`,
      starter_code: `# The full pipeline in one function: chunk a reply, frame it as SSE,
# parse the frames back, and enforce a token budget on what's kept.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def run_pipeline(text, chunk_size, budget):
    # TODO: split 'text' into chunks of length chunk_size (lesson 3).
    # TODO: frame each chunk as "data: {chunk}\\n\\n" and concatenate
    #       into one raw stream string (lesson 1).
    # TODO: parse the raw stream back into payloads, dropping the last
    #       (always-incomplete) split piece (lesson 6).
    # TODO: consume the payloads against the token budget, stopping
    #       BEFORE any payload that would exceed it (lesson 7).
    # TODO: return (assembled_text, chunks_sent, chunks_kept, tokens_used).
    pass

result = run_pipeline("hello world", 4, 2)
print(result)
`,
      solution_code: `# The full pipeline in one function: chunk a reply, frame it as SSE,
# parse the frames back, and enforce a token budget on what's kept.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def run_pipeline(text, chunk_size, budget):
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    raw = ""
    for c in chunks:
        raw += f"data: {c}\\n\\n"

    frames = raw.split("\\n\\n")[:-1]
    payloads = [f[6:] for f in frames if f.startswith("data: ")]

    used = 0
    kept = 0
    out = ""
    for p in payloads:
        cost = estimate_tokens(p)
        if used + cost > budget:
            break
        used += cost
        out += p
        kept += 1

    return out, len(chunks), kept, used

result = run_pipeline("hello world", 4, 2)
print(result)
print("Streaming Writing Assistant built. Saved to your Portfolio.")
`,
      hints: [
        "Reuse the exact same steps from lessons 3, 1, 6, and 7 in order, this lesson just chains them.",
        "Frame every chunk first into one raw string, then parse it back, don't skip straight to the payloads.",
        "The budget loop is identical to lesson 7: check before adding, stop on the first chunk that would exceed it.",
      ],
      challenge_title: "End-to-End Stream Round Trip",
      challenge_description:
        "Chunk a reply, frame it as SSE, parse the frames back, and enforce a token budget, all in one pipeline.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    chunk_size = int(data[0])
    budget = int(data[1])
    text = data[2]
    # parse done: 'chunk_size' for splitting, 'budget' in tokens, 'text' the full reply

    # TODO: split text into chunks of length chunk_size.
    # TODO: frame each as "data: {chunk}\\n\\n", concatenate into one raw stream.
    # TODO: parse the raw stream back into payloads, dropping the last split piece.
    # TODO: consume payloads against the budget, stopping BEFORE any that would exceed it.
    # TODO: print the assembled text, then "CHUNKS_SENT <n>", "CHUNKS_KEPT <k>",
    #       "TOKENS <total>", "TRUNCATED <True/False>".

main()
`,
      challenge_solution_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    chunk_size = int(data[0])
    budget = int(data[1])
    text = data[2]

    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    raw = ""
    for c in chunks:
        raw += f"data: {c}\\n\\n"

    frames = raw.split("\\n\\n")[:-1]
    payloads = [f[6:] for f in frames if f.startswith("data: ")]

    used = 0
    kept = 0
    out = ""
    for p in payloads:
        cost = estimate_tokens(p)
        if used + cost > budget:
            break
        used += cost
        out += p
        kept += 1

    print(out)
    print(f"CHUNKS_SENT {len(chunks)}")
    print(f"CHUNKS_KEPT {kept}")
    print(f"TOKENS {used}")
    print(f"TRUNCATED {kept < len(chunks)}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\n2\nhello world",
          expected_output: "hello wo\nCHUNKS_SENT 3\nCHUNKS_KEPT 2\nTOKENS 2\nTRUNCATED True",
          description: "Three chunks are produced but the budget of 2 only admits the first two before stopping.",
        },
        {
          input: "5\n100\nAI ships",
          expected_output: "AI ships\nCHUNKS_SENT 2\nCHUNKS_KEPT 2\nTOKENS 2\nTRUNCATED False",
          description: "A generous budget keeps every chunk, and the round trip reproduces the original text exactly.",
        },
        {
          input: "3\n0\nhi",
          expected_output: "\nCHUNKS_SENT 1\nCHUNKS_KEPT 0\nTOKENS 0\nTRUNCATED True",
          description: "Edge: a budget of 0 stops before the first chunk is kept, even though one chunk was sent.",
        },
      ],
    },
  ],
};
