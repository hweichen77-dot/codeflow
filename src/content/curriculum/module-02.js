export default {
  project: {
    id: "ai-02",
    title: "Your First API Call",
    description: "Send a message to Claude from a Python script and print the reply you get back.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 60,
    lessons_count: 8,
    tags: ["api", "json", "python", "claude", "requests"],
    order: 2,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-02-l1",
      project_id: "ai-02",
      order: 1,
      title: "What Even Is an API?",
      concept: "APIs",
      xp_reward: 10,
      explanation: `Open your weather app and pull-to-refresh. In the half-second before the numbers update, your phone just fired a message across the internet to a server it has never met, asked it a question, and got an answer back. That round trip is an **API call**, and your phone makes hundreds of them a day without you noticing.

## What it is

**API** stands for **Application Programming Interface**. Strip the jargon: it's a defined way for your code to ask someone else's code to do something, without you knowing *how* they do it.

The coffee-shop version: you order a latte. You don't walk behind the counter, grind the beans, and pull the shot yourself. You tell the barista what you want, they do the work, they hand you a cup. The counter is the **interface** — the agreed spot where you place an order and receive a result. You never see the espresso machine.

## How it works

When you want Claude to answer a question, you don't run the model on your laptop. You can't — it's hundreds of gigabytes of numbers. Instead your script sends a **request** over the internet to Anthropic's servers. Their code runs the model and sends a **response** back. Your script never touches the machinery.

Every API call is exactly two halves:

- **The request** — what you send. "Here's my question. Here's who I am."
- **The response** — what comes back. "Here's the answer."

That pattern never changes. You send something, you get something back. The whole rest of this module is just learning the precise shape of those two halves for Claude:

\`\`\`text
Your script  --->  request  --->  Anthropic's API
Your script  <---  response <---  Anthropic's API
\`\`\`

## Why it matters

APIs are how modern software is built. Your weather app doesn't own a satellite — it calls a weather API. Your banking app doesn't keep its own copy of the stock market — it calls a finance API. Splitting work across APIs lets each team be great at one thing and lets everyone else borrow that thing with a single call.

For you, that means you can build something that talks to one of the best AI models in the world in about ten lines of Python. No PhD, no data center. You need two things: an **address** to send the request to, and **permission** to send it. The next three lessons hand you both.

There's a cost side too. Because the work happens on someone else's servers, every call travels the network (so it has **latency**, a small delay) and often costs money. That shapes how you design real programs — you batch calls, cache answers, and avoid hammering the API in a tight loop.

## The mental model to keep

An API is a counter, not a kitchen. You place an order, you wait, you get a result — and you never need to know how the kitchen works.`,
      key_terms: [
        { term: "API", definition: "Application Programming Interface — a defined way for one program to ask another program to do something." },
        { term: "Request", definition: "The message your code sends to an API describing what you want." },
        { term: "Response", definition: "The message the API sends back with the result." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "The restaurant",
          content: "You're the customer, your code writes the order, the API is the waiter, and the server's code is the kitchen. You never see the kitchen — you just get the plate.",
          position: "before"
        },
        {
          type: "insight",
          title: "You don't run the model",
          content: "The Claude model lives on Anthropic's servers. Your script sends text over the internet and gets text back. Nothing heavy runs on your machine.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "The shape of every API call",
        steps: [
          { label: "Build the request", desc: "Your code packages up what you want to ask." },
          { label: "Send it", desc: "The request travels over the internet to the API's address." },
          { label: "Server does the work", desc: "Their code runs — in our case, it runs Claude." },
          { label: "Get the response", desc: "The result comes back to your script." }
        ]
      },
      inline_quizzes: [
        {
          question: "When your script calls the Claude API, where does the model actually run?",
          options: ["On your laptop", "On Anthropic's servers", "In your web browser"],
          correct_index: 1,
          explanation: "You send a request over the internet. Anthropic runs the model on their hardware and sends the answer back."
        }
      ],
      quiz_questions: [
        {
          question: "What does API stand for?",
          options: ["Automatic Program Installer", "Application Programming Interface", "Advanced Python Integration", "Applied Protocol Index"],
          correct_index: 1,
          explanation: "API = Application Programming Interface. It's the agreed-upon way for programs to talk to each other."
        },
        {
          question: "An API call always has these two halves:",
          options: ["A login and a logout", "A request and a response", "A file and a folder", "A question and a guess"],
          correct_index: 1,
          explanation: "You send a request, you get a response. That pattern holds for every API you'll ever use."
        },
        {
          question: "Why is it useful that the weather app uses a weather API instead of building everything itself?",
          options: ["It makes the app slower on purpose", "It lets the app borrow data and work it doesn't own, with one call", "APIs are required by law", "It hides the app from users"],
          correct_index: 1,
          explanation: "APIs let each team specialize. The app borrows weather data instead of launching its own satellite."
        }
      ],
      participation_activities: [
        {
          activity_title: "Spot the API",
          questions: [
            {
              question: "A request is the message you send, and a response is what comes back.",
              type: "true_false",
              correct_answer: "true",
              explanation: "That's the core of every API interaction: send a request, receive a response."
            },
            {
              question: "Fill in the blank: An API lets your code ask another program to do something without knowing _____ it does it.",
              type: "fill_in",
              correct_answer: "how",
              explanation: "You only deal with the request and response. The other program's inner workings stay hidden."
            }
          ]
        }
      ],
      starter_code: `# No code to run yet — this lesson is about the idea.
# Describe an API in your own words by filling in the message below.

description = "An API is ..."
print(description)
`,
      solution_code: `# An API in one sentence, then the two halves of every call.
description = "An API is a way for my code to ask another program to do work and send back a result."
print(description)
print("Request: what I send")
print("Response: what comes back")
`,
      expected_output: `An API is a way for my code to ask another program to do work and send back a result.
Request: what I send
Response: what comes back`,
      step_throughs: [
        {
          title: "anatomy of one API call",
          steps: [
            { label: "Build the request", detail: "Your code packages what you want into a structured message: the question plus who you are.", code: 'request = {"question": "What is 2 + 2?"}' },
            { label: "Send it over the network", detail: "The request leaves your machine and travels the internet to the API's address. This hop adds a small delay called latency.", code: "POST https://api.anthropic.com/v1/messages" },
            { label: "Their server does the work", detail: "Anthropic's code receives the request, runs Claude on your question, and produces an answer. Nothing heavy runs on your laptop.", code: "# Claude runs here, not on your machine" },
            { label: "Read the response", detail: "The result travels back and your script reads it. Send something, get something back.", code: 'response = {"answer": "4"}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A music app shows you song lyrics but doesn't store any lyrics itself. How does it get them?",
          steps: [
            "The app needs data it does not own, so it borrows it.",
            "It sends a request to a lyrics API: 'give me the lyrics for this song.'",
            "The lyrics API responds with the text, and the app displays it."
          ],
          output: "The app calls a lyrics API — request out, lyrics back."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You want a Python script to translate text using a translation service.\nList the two halves of that interaction and what each contains.",
          steps: [
            "Identify the request: your script sends the text to translate plus the target language.",
            "Identify the response: the service sends back the translated text.",
            "Notice you never see how the translation model works — only the counter.",
            "This is the same send-then-receive pattern as every other API."
          ],
          output: "Request = {text, target_language}; Response = {translated_text}"
        }
      ],
      comparison_tables: [
        {
          title: "running it yourself vs calling an API",
          columns: ["Aspect", "Run the model yourself", "Call the API"],
          rows: [
            { cells: ["Hardware", "Needs a data center of GPUs", "Just your laptop and internet"] },
            { cells: ["Setup", "Download + host hundreds of GB", "Send ten lines of code"] },
            { cells: ["Cost model", "Buy/rent the machines up front", "Pay per request as you go"], highlight: true },
            { cells: ["Who maintains it", "You", "Anthropic"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "request or response?",
          bins: [
            { id: "req", label: "Part of the request (you send)" },
            { id: "res", label: "Part of the response (you receive)" }
          ],
          items: [
            { id: "i1", text: "Your question for Claude", bin: "req" },
            { id: "i2", text: "Claude's generated answer", bin: "res" },
            { id: "i3", text: "Your API key proving who you are", bin: "req" },
            { id: "i4", text: "The model name you want to use", bin: "req" },
            { id: "i5", text: "How many tokens the reply used", bin: "res" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words, why is it a good thing that you don't run the Claude model on your own computer?",
          sampleAnswer: "The model is enormous and needs expensive hardware to run. By sending a request to Anthropic's servers instead, I borrow that power with a few lines of code — they handle the heavy machinery and I just send a question and read the answer."
        }
      ],
      hints: [
        "An API is about one program talking to another. Keep your sentence simple.",
        "Remember the two halves: a request goes out, a response comes back.",
        "print() each line on its own so the output has three lines."
      ],
      challenge_title: "Gateway Traffic Auditor",
      challenge_description: "Read a raw API-gateway log and count how many lines are request halves versus response halves.",
      challenge_story: "You run the gateway that sits between thousands of apps and Anthropic's servers. Every byte that crosses the wire is logged with a direction tag: \`SEND\` for the request half your apps push out, \`RECV\` for the response half that comes back. Before the on-call engineer can debug a latency spike, they need a clean tally: how much of the traffic was outbound requests, how much was inbound responses. Build the auditor that scans the log and counts the two halves.",
      challenge_statement: "Every API call is exactly two halves: a **request** you send and a **response** you get back. You are given a gateway log of \`n\` entries. Each entry begins with a direction tag:\n\n- \`SEND\` — this line is part of a **request** (outbound).\n- \`RECV\` — this line is part of a **response** (inbound).\n\nAfter the tag there is a label describing the field (e.g. \`model\`, \`content\`). Count how many entries are requests and how many are responses.",
      challenge_input_format: "The first line is an integer \`n\` — the number of log entries. Each of the next \`n\` lines starts with either \`SEND\` or \`RECV\`, followed by a space and a one-word field label.",
      challenge_output_format: "Two lines:\n- \`request R\` where \`R\` is the number of \`SEND\` entries.\n- \`response S\` where \`S\` is the number of \`RECV\` entries.",
      challenge_constraints: [
        "0 ≤ n ≤ 100000",
        "Each entry's direction tag is exactly `SEND` or `RECV`.",
      ],
      challenge_examples: [
        { input: "5\nSEND model\nSEND messages\nRECV content\nSEND max_tokens\nRECV usage", output: "request 3\nresponse 2", explanation: "Three `SEND` lines (model, messages, max_tokens) and two `RECV` lines (content, usage)." },
        { input: "1\nRECV answer", output: "request 0\nresponse 1", explanation: "A lone inbound line is one response half and zero request halves." },
      ],
      challenge_notes: "The request/response split never changes — every call has both halves. Here you're just classifying log lines by their direction tag. Read the count first, then loop exactly that many lines so trailing blank lines never trip you up.",
      challenge_hints: [
        "Read all of stdin, split on newlines, and take the first line as the integer count `n`.",
        "Loop over the next `n` lines; the first whitespace-separated token is the direction tag.",
        "Keep two counters; print `request R` then `response S` on separate lines.",
      ],
      challenge_starter_code: `import sys

data = sys.stdin.read().split("\\n")
n = int(data[0])
# TODO: loop over the next n lines, count SEND vs RECV,
# then print "request R" and "response S".
`,
      challenge_solution_code: `import sys

data = sys.stdin.read().split("\\n")
n = int(data[0])
req = 0
res = 0
for i in range(1, n + 1):
    direction = data[i].strip().split()[0]
    if direction == "SEND":
        req += 1
    else:
        res += 1
print(f"request {req}")
print(f"response {res}")
`,
      challenge_test_cases: [
        {
          input: "5\nSEND model\nSEND messages\nRECV content\nSEND max_tokens\nRECV usage",
          expected_output: "request 3\nresponse 2",
          description: "Three request halves and two response halves."
        },
        {
          input: "1\nRECV answer",
          expected_output: "request 0\nresponse 1",
          description: "A single inbound line counts only as a response."
        },
        {
          input: "2\nSEND a\nSEND b",
          expected_output: "request 2\nresponse 0",
          description: "Edge case: all outbound, zero responses."
        }
      ]
    },
    {
      id: "ai-02-l2",
      project_id: "ai-02",
      order: 2,
      title: "JSON: How Data Travels",
      concept: "JSON",
      xp_reward: 10,
      explanation: `Your Python script holds a dictionary. Anthropic's servers run on different code, maybe a different language, on a machine across the country. How do two strangers agree on the exact shape of a message? They both speak **JSON** — a plain-text format so simple it has a one-page spec, yet it carries nearly every API request on the internet.

## What it is

**JSON** (JavaScript Object Notation, despite the name it's used everywhere, not just JavaScript) is text arranged as **key-value pairs** inside curly braces. If you've ever filled out a form with labeled boxes — name, email, message — you already understand it.

\`\`\`json
{
  "name": "Ada",
  "age": 36,
  "is_admin": true
}
\`\`\`

Each **key** (left of the colon) is a label. Each **value** (right of the colon) is the data. The rules are tight: strings get double quotes, numbers and \`true\`/\`false\` don't, and commas separate pairs. That's 90% of JSON.

## How it works

The other 10%: a value can itself be a **list** or another box. That nesting is what lets JSON describe complex things.

\`\`\`json
{
  "model": "claude-sonnet-4-6",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
\`\`\`

The square brackets \`[ ]\` hold a list. Inside it, another set of curly braces — a box inside a box. This is exactly the shape of a Claude request. Don't memorize it yet; just notice that it's labeled boxes all the way down.

In Python, JSON is pleasant because a JSON object looks almost identical to a Python **dictionary**. Two functions move between them:

\`\`\`python
import json

person = {"name": "Ada", "age": 36}
text = json.dumps(person)   # dict  -> JSON string
print(text)                 # {"name": "Ada", "age": 36}

back = json.loads(text)     # JSON string -> dict
print(back["name"])         # Ada
\`\`\`

\`json.dumps\` **dumps** a dict out as a JSON string to send. \`json.loads\` **loads** a received JSON string back into a dict you can index. Dump to send, load to read.

## Why it matters

Only **text** can travel over a network — not a live Python object. JSON is the agreed text format both sides serialize to and parse from, which is why it's everywhere. The SDK you'll meet in lesson 4 does the dumps/loads for you, but when an error message mentions a malformed body or you print a raw response, knowing what's underneath means you're never lost.

JSON is also strict, and that strictness causes most beginner errors. Keys and string values **must** use double quotes — single quotes break it. A **trailing comma** after the last pair breaks it too. When an API rejects your request with a vague error, check for a stray quote or comma first.

## The mental model to keep

JSON is labeled boxes for data — \`dumps\` to pack them for the trip, \`loads\` to unpack them when they arrive.`,
      key_terms: [
        { term: "JSON", definition: "JavaScript Object Notation — a text format for data, written as key-value pairs inside curly braces." },
        { term: "Key-value pair", definition: "A label and its data, like \"name\": \"Ada\". The key names it; the value is the data." },
        { term: "json.dumps", definition: "A Python function that converts a dictionary into a JSON string you can send." },
        { term: "json.loads", definition: "A Python function that converts a received JSON string back into a Python dictionary." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "Labeled boxes",
          content: "JSON is a stack of labeled boxes. The label is the key, what's inside is the value. Lists are boxes that hold several things in order.",
          position: "before"
        },
        {
          type: "tip",
          title: "Dump to send, load to read",
          content: "json.dumps goes from Python dict to JSON text (outbound). json.loads goes from JSON text to Python dict (inbound). Remember the direction and you're set.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "JSON round trip in Python",
        steps: [
          { label: "Python dict", desc: "You build {\"name\": \"Ada\"} in your code." },
          { label: "json.dumps", desc: "Convert the dict to a JSON string to send over the wire." },
          { label: "JSON text travels", desc: "The string is what actually crosses the internet." },
          { label: "json.loads", desc: "Convert a received JSON string back into a dict you can index." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which function turns a Python dictionary into a JSON string to send?",
          options: ["json.loads", "json.dumps", "json.read"],
          correct_index: 1,
          explanation: "json.dumps DUMPS your dict out as text. json.loads LOADS text back into a dict."
        }
      ],
      quiz_questions: [
        {
          question: "In the pair \"age\": 36, which part is the key?",
          options: ["36", "\"age\"", "the colon", "the comma"],
          correct_index: 1,
          explanation: "The key is the label on the left of the colon. The value (36) is on the right."
        },
        {
          question: "What do the square brackets [ ] mean in JSON?",
          options: ["A comment", "A list of items", "A number", "The end of the file"],
          correct_index: 1,
          explanation: "Square brackets hold a list, like the messages array in a Claude request."
        },
        {
          question: "Your request keeps getting rejected. What's the most common JSON mistake to check first?",
          options: ["Using too many spaces", "Single quotes or a trailing comma", "Writing keys in lowercase", "Putting numbers in quotes is required"],
          correct_index: 1,
          explanation: "JSON needs double quotes and no trailing comma after the last pair. Those two slips cause most errors."
        }
      ],
      participation_activities: [
        {
          activity_title: "Read the JSON",
          questions: [
            {
              question: "In JSON, string values must be wrapped in double quotes.",
              type: "true_false",
              correct_answer: "true",
              explanation: "Single quotes are not valid JSON. Strings always use double quotes."
            },
            {
              question: "Fill in the blank: json._____ converts a received JSON string into a Python dictionary.",
              type: "fill_in",
              correct_answer: "loads",
              explanation: "json.loads loads text back into a usable Python dict."
            }
          ]
        }
      ],
      starter_code: `import json

# Build a Python dict and turn it into a JSON string.
person = {"name": "Ada", "age": 36}

# TODO: convert person to a JSON string and print it
`,
      solution_code: `import json

person = {"name": "Ada", "age": 36}

# dict -> JSON string
text = json.dumps(person)
print(text)

# JSON string -> dict, then read one value
back = json.loads(text)
print(back["name"])
`,
      expected_output: `{"name": "Ada", "age": 36}
Ada`,
      step_throughs: [
        {
          title: "dict → JSON → wire → dict",
          steps: [
            { label: "Start with a Python dict", detail: "A live object in memory. Useful in code, but it can't travel over a network as-is.", code: 'person = {"name": "Ada", "age": 36}' },
            { label: "json.dumps packs it", detail: "The dict becomes a JSON string: double quotes added, ready to send.", code: "text = json.dumps(person)\n# '{\"name\": \"Ada\", \"age\": 36}'" },
            { label: "The text crosses the network", detail: "Plain text is the only thing that can travel. This string is what actually reaches the server.", code: '{"name": "Ada", "age": 36}' },
            { label: "json.loads unpacks it", detail: "On arrival, the JSON string becomes a dict again, so you can index it normally.", code: 'back = json.loads(text)\nback["name"]  # "Ada"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Is this valid JSON?\n{ 'role': 'user' }",
          steps: [
            "Check the quotes: JSON requires double quotes around keys and string values.",
            "Here both 'role' and 'user' use single quotes.",
            "Single quotes are not allowed, so it is invalid."
          ],
          output: 'Invalid — must be {"role": "user"} with double quotes.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You receive this JSON string and need Claude's reply text:\n{\"content\": [{\"type\": \"text\", \"text\": \"Hi there\"}]}\nHow do you reach \"Hi there\" after json.loads?",
          steps: [
            "json.loads turns the string into a dict named data.",
            'data["content"] is a list, so index the first element: data["content"][0].',
            "That element is a box; read its 'text' key.",
            'Full path: data["content"][0]["text"].'
          ],
          output: 'data["content"][0]["text"]  ->  "Hi there"'
        }
      ],
      comparison_tables: [
        {
          title: "json.dumps vs json.loads",
          columns: ["Function", "Direction", "Input", "Output", "When you use it"],
          rows: [
            { cells: ["json.dumps", "Outbound", "Python dict", "JSON string", "Packing data to send"] },
            { cells: ["json.loads", "Inbound", "JSON string", "Python dict", "Reading data you received"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "valid JSON vs broken JSON",
          bins: [
            { id: "ok", label: "Valid JSON" },
            { id: "bad", label: "Broken JSON" }
          ],
          items: [
            { id: "i1", text: '{"name": "Ada"}', bin: "ok" },
            { id: "i2", text: "{'name': 'Ada'}", bin: "bad" },
            { id: "i3", text: '{"age": 36, "ok": true}', bin: "ok" },
            { id: "i4", text: '{"a": 1, "b": 2,}', bin: "bad" },
            { id: "i5", text: '{"items": [1, 2, 3]}', bin: "ok" },
            { id: "i6", text: '{"name": Ada}', bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Why can't you just send a Python dictionary straight across the network — why convert it to JSON first?",
          sampleAnswer: "A network can only carry text, not live Python objects. json.dumps serializes the dict into a plain JSON string both sides agree on, so the server (which may not even run Python) can parse it. On the way back, json.loads turns the JSON text into a dict I can use again."
        }
      ],
      hints: [
        "Use json.dumps(person) to turn the dictionary into a JSON string.",
        "json.dumps keeps the keys in the order you wrote them and uses double quotes.",
        "After json.loads, index the dict with back[\"name\"] to pull a single value."
      ],
      challenge_title: "Parse the Request Body",
      challenge_description: "Decode an incoming JSON request body, estimate its token cost, and emit a compact JSON summary.",
      challenge_story: "Your serverless function sits at the edge of the API. Apps POST a JSON body containing a list of conversation messages, and before you forward anything to the model you want a cheap pre-flight estimate: roughly how many tokens this prompt will cost, and how many user turns it contains (useful for abuse detection). The body arrives as raw JSON text on stdin. Parse it with \`json.loads\`, do the math, and return your summary as JSON with \`json.dumps\` — the exact round trip every API layer performs.",
      challenge_statement: "You receive one JSON object on stdin with a single key \`messages\`, whose value is a list of message objects. Each message has a string \`role\` (\`\"user\"\` or \`\"assistant\"\`) and a string \`content\`.\n\nCompute two values:\n\n- \`tokens\` — a token estimate. Sum the lengths (in characters) of **every** message's \`content\`, then divide by 4 and round **up** to the nearest integer (the classic ~4-chars-per-token rule).\n- \`user_turns\` — how many messages have role \`\"user\"\`.\n\nPrint the result as a single-line JSON object with keys sorted alphabetically and no spaces after separators.",
      challenge_input_format: "A single JSON object on stdin: \`{\"messages\": [{\"role\": ..., \"content\": ...}, ...]}\`. The list may be empty.",
      challenge_output_format: "One line of JSON: \`{\"tokens\":T,\"user_turns\":U}\` with keys sorted and compact separators (no spaces).",
      challenge_constraints: [
        "0 ≤ number of messages ≤ 10000",
        "0 ≤ len(content) ≤ 100000 for each message",
        "Each role is exactly `\"user\"` or `\"assistant\"`.",
      ],
      challenge_examples: [
        { input: "{\"messages\":[{\"role\":\"user\",\"content\":\"What is 2 + 2?\"},{\"role\":\"assistant\",\"content\":\"4\"}]}", output: "{\"tokens\":4,\"user_turns\":1}", explanation: "Content chars: 14 + 1 = 15. ceil(15/4) = 4 tokens. One message has role user." },
        { input: "{\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}", output: "{\"tokens\":1,\"user_turns\":1}", explanation: "2 chars, ceil(2/4) = 1 token, one user turn." },
      ],
      challenge_notes: "Use \`json.load(sys.stdin)\` to read and parse in one step, and \`json.dumps(obj, separators=(\",\", \":\"), sort_keys=True)\` to print compact, deterministic JSON. \`math.ceil\` gives you the round-up. An empty message list yields \`{\"tokens\":0,\"user_turns\":0}\`.",
      challenge_hints: [
        "Parse the body with `data = json.load(sys.stdin)`; the messages are at `data[\"messages\"]`.",
        "Add up `len(m[\"content\"])` across all messages, then `math.ceil(total / 4)`.",
        "Print with `json.dumps(out, separators=(\",\", \":\"), sort_keys=True)` so the format is exact.",
      ],
      challenge_starter_code: `import sys, json, math

data = json.load(sys.stdin)
messages = data["messages"]
# TODO: compute total content chars -> tokens (ceil chars/4),
# count user turns, and print compact sorted JSON.
`,
      challenge_solution_code: `import sys, json, math

data = json.load(sys.stdin)
messages = data["messages"]

total_chars = 0
user_turns = 0
for m in messages:
    total_chars += len(m["content"])
    if m["role"] == "user":
        user_turns += 1

tokens = math.ceil(total_chars / 4)
out = {"tokens": tokens, "user_turns": user_turns}
print(json.dumps(out, separators=(",", ":"), sort_keys=True))
`,
      challenge_test_cases: [
        {
          input: "{\"messages\":[{\"role\":\"user\",\"content\":\"What is 2 + 2?\"},{\"role\":\"assistant\",\"content\":\"4\"}]}",
          expected_output: "{\"tokens\":4,\"user_turns\":1}",
          description: "15 content chars -> 4 tokens, one user turn."
        },
        {
          input: "{\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}",
          expected_output: "{\"tokens\":1,\"user_turns\":1}",
          description: "Tiny prompt rounds up to 1 token."
        },
        {
          input: "{\"messages\":[]}",
          expected_output: "{\"tokens\":0,\"user_turns\":0}",
          description: "Edge case: an empty conversation costs nothing."
        }
      ]
    },
    {
      id: "ai-02-l3",
      project_id: "ai-02",
      order: 3,
      title: "API Keys and Rate Limits",
      concept: "Auth & limits",
      xp_reward: 10,
      explanation: `In 2023 a developer pasted his cloud API key into a public GitHub repo for "just five minutes" while testing. Automated scanners found it in under a minute and ran up a five-figure bill before he noticed. The lesson is brutal and simple: an **API key** is a password, and the internet never stops scanning for leaked ones.

## What it is

An API key tells Anthropic who's calling, so they can check you're allowed and **bill the right account**. A Claude key is a long string like \`sk-ant-...\`, generated in the Anthropic console. Every request includes it, and the server verifies it before doing any work. No valid key, no answer — you get a \`401 Unauthorized\`.

Treat it exactly like a credit card number. Anyone holding your key can spend your money.

## How it works

The rule that saves careers: **never paste your key into your script.** If it ends up in code you push to GitHub, bots will find it and drain your account.

Instead, store the key in an **environment variable** — a value that lives in your computer's environment, outside your source code. You set it once in your terminal:

\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
\`\`\`

Then your script reads it at runtime, and the secret never appears in the file:

\`\`\`python
import os

api_key = os.environ.get("ANTHROPIC_API_KEY")
print("Key loaded:", api_key is not None)
\`\`\`

Now you can share the code freely; the key stays on your machine. (Use \`.get\` rather than \`os.environ["..."]\` so a missing variable returns \`None\` instead of crashing.)

## Why it matters

The second guardrail is **rate limits**. You can't fire a million requests a second — APIs cap how many **requests or tokens** you can use per minute. Go over and the server replies with \`429 Too Many Requests\` instead of an answer.

Limits exist so one user can't hog a shared service or rack up a runaway bill. While learning you'll never come close, but build something that loops over thousands of items and you'll hit them fast. The fix is to slow down, spread requests out, and **retry after waiting** — production code does this automatically with **exponential backoff** (wait 1s, then 2s, then 4s, retrying until it succeeds).

A handful of status codes tell you what happened:

\`\`\`text
200 -> success, here's your answer
401 -> your key is missing or wrong
429 -> you're sending too fast, back off and retry
\`\`\`

## The mental model to keep

Keep your key secret like a password, and respect the speed limit like a road sign. 401 means "who are you?"; 429 means "slow down." Everything else is detail.`,
      key_terms: [
        { term: "API key", definition: "A secret string that identifies and authorizes you to the API. Anyone with it can call on your account." },
        { term: "Environment variable", definition: "A value stored in your system's environment, read by code at runtime, so secrets stay out of your source code." },
        { term: "Rate limit", definition: "A cap on how many requests or tokens you can use in a time window. Exceeding it returns a 429 error." },
        { term: "401 / 429", definition: "Error codes: 401 means your key is missing or invalid; 429 means you're sending requests too fast." }
      ],
      callouts: [
        {
          type: "warning",
          title: "Never hardcode your key",
          content: "A key pasted into code and pushed to GitHub gets stolen within minutes by automated scanners. Always read it from an environment variable.",
          position: "before"
        },
        {
          type: "insight",
          title: "429 isn't a failure, it's a please-wait",
          content: "A 429 means slow down, not stop. Wait a moment and retry. Production code adds automatic backoff to handle this gracefully.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "How a key is used safely",
        steps: [
          { label: "Get key from console", desc: "Generate an sk-ant-... key in the Anthropic dashboard." },
          { label: "Set an env variable", desc: "export ANTHROPIC_API_KEY=... in your terminal, not in code." },
          { label: "Read it at runtime", desc: "os.environ[\"ANTHROPIC_API_KEY\"] pulls it in when the script runs." },
          { label: "Server checks it", desc: "Anthropic verifies the key before running Claude. Bad key returns 401." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where should your API key live?",
          options: ["Pasted directly in your Python file", "In an environment variable, read at runtime", "In a comment so you don't forget it"],
          correct_index: 1,
          explanation: "Keys in code get leaked. Store them in an environment variable and read them with os.environ."
        }
      ],
      quiz_questions: [
        {
          question: "What does a 401 error from the API usually mean?",
          options: ["The server is down", "Your key is missing or invalid", "You sent too many requests", "The model is thinking"],
          correct_index: 1,
          explanation: "401 Unauthorized means the API couldn't verify your key. Check that it's set and correct."
        },
        {
          question: "You get a 429 error. What's the right response?",
          options: ["Give up, the API is broken", "Send the same request 100 more times immediately", "Wait a bit, then retry more slowly", "Delete your API key"],
          correct_index: 2,
          explanation: "429 means you hit the rate limit. Back off, wait, and retry at a slower pace."
        },
        {
          question: "Why do APIs enforce rate limits at all?",
          options: ["To make the API harder to use", "To stop one user from hogging the service or causing a surprise bill", "Because JSON requires it", "To slow down beginners only"],
          correct_index: 1,
          explanation: "Rate limits keep the service fair and protect against runaway usage and cost."
        }
      ],
      participation_activities: [
        {
          activity_title: "Keep it secret",
          questions: [
            {
              question: "It's safe to paste your API key into your code as long as the file is on your own computer.",
              type: "true_false",
              correct_answer: "false",
              explanation: "Code gets shared, pushed, and copied. Keep the key in an environment variable so it never lives in the file."
            },
            {
              question: "Fill in the blank: A 4__ error means you are sending requests too fast (the rate limit).",
              type: "fill_in",
              correct_answer: "429",
              explanation: "429 Too Many Requests is the rate-limit error. Slow down and retry."
            }
          ]
        }
      ],
      starter_code: `import os

# Read the API key from an environment variable instead of hardcoding it.
# (In this sandbox the variable may not be set; that's fine for the exercise.)

# TODO: read ANTHROPIC_API_KEY safely and report whether it was found
`,
      solution_code: `import os

# os.environ.get returns None instead of crashing if the variable is missing.
api_key = os.environ.get("ANTHROPIC_API_KEY")

if api_key:
    print("API key found.")
else:
    print("No API key set. Set ANTHROPIC_API_KEY in your environment.")
`,
      expected_output: `No API key set. Set ANTHROPIC_API_KEY in your environment.`,
      step_throughs: [
        {
          title: "a key's safe journey",
          steps: [
            { label: "Generate it in the console", detail: "Create an sk-ant-... key in the Anthropic dashboard. This is the only time you can copy the full value.", code: "sk-ant-api03-XXXXXXXX..." },
            { label: "Store it in your environment", detail: "Export it in your terminal so it lives outside your code. It never gets typed into a .py file.", code: 'export ANTHROPIC_API_KEY="sk-ant-..."' },
            { label: "Read it at runtime", detail: "Your script pulls the value from the environment when it runs. The source file stays secret-free.", code: 'api_key = os.environ.get("ANTHROPIC_API_KEY")' },
            { label: "Server verifies it", detail: "Anthropic checks the key before running Claude. A bad or missing key returns 401 and no work happens.", code: "# valid -> 200, invalid -> 401" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your script runs and immediately returns a 401 error. What is the most likely cause?",
          steps: [
            "401 means 'Unauthorized' — the server could not verify who you are.",
            "That points to the key, not the request body or rate limits.",
            "Check that ANTHROPIC_API_KEY is set and correct in your environment."
          ],
          output: "The API key is missing, mistyped, or not loaded."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You loop over 5,000 items, one API call each, and start getting 429s after a few hundred.\nDesign a fix using exponential backoff.",
          steps: [
            "429 means you exceeded the rate limit, so the fix is to slow down and retry — not to give up.",
            "On a 429, wait, then retry the same request.",
            "Each retry, double the wait: 1s, then 2s, then 4s. This is exponential backoff.",
            "Cap the number of retries so a truly broken request eventually stops.",
            "Optionally add a small delay between successful calls to stay under the limit from the start."
          ],
          output: "Retry on 429 with delays of 1s, 2s, 4s... up to a max retry count."
        }
      ],
      comparison_tables: [
        {
          title: "401 vs 429 — two very different problems",
          columns: ["Code", "Meaning", "Cause", "What to do"],
          rows: [
            { cells: ["200", "OK", "Request succeeded", "Read the response"] },
            { cells: ["401", "Unauthorized", "Key missing or wrong", "Fix the key, then retry"] },
            { cells: ["429", "Too Many Requests", "Sending too fast", "Back off and retry slower"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "safe vs risky key handling",
          bins: [
            { id: "safe", label: "Safe" },
            { id: "risky", label: "Risky" }
          ],
          items: [
            { id: "i1", text: "Read the key from an environment variable", bin: "safe" },
            { id: "i2", text: "Paste the key directly into your .py file", bin: "risky" },
            { id: "i3", text: "Put the key in a comment so you remember it", bin: "risky" },
            { id: "i4", text: "Keep the key out of version control", bin: "safe" },
            { id: "i5", text: "Commit the key to a public GitHub repo", bin: "risky" },
            { id: "i6", text: "Rotate the key if you suspect it leaked", bin: "safe" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain why storing your API key in an environment variable is safer than writing it directly in your code.",
          sampleAnswer: "Code gets shared, pushed to GitHub, and copied between machines. If the key lives in the file, it travels with the code and can be scraped by bots within minutes. An environment variable keeps the secret on my machine only — the code reads it at runtime, so the file I share never contains the actual key."
        }
      ],
      hints: [
        "Use os.environ.get(\"ANTHROPIC_API_KEY\") — .get returns None instead of raising an error when the variable is missing.",
        "An if/else on api_key lets you print a different message for found vs missing.",
        "In this sandbox the variable isn't set, so the else branch runs."
      ],
      challenge_title: "The Rate Limiter",
      challenge_description: "Simulate a sliding-window rate limiter and report how many requests get 200 OK versus 429 Too Many Requests.",
      challenge_story: "Anthropic's gateway protects the model from overload with a rate limit: only so many requests are allowed inside any rolling 60-second window. Send too fast and you get a \`429 Too Many Requests\` instead of a \`200 OK\` — not a failure, a please-wait. You're building the limiter itself. Requests arrive at known timestamps; you must decide, for each one, whether it slips through (200) or gets throttled (429), using a sliding window of accepted requests.",
      challenge_statement: "A request is **accepted** (\`200\`) if, at its arrival second, **fewer than \`limit\`** previously-accepted requests fall within the trailing 60-second window (i.e. arrived strictly later than \`t - 60\`). Otherwise it is **throttled** (\`429\`) and does **not** occupy a slot.\n\nProcess the requests in arrival order. Count how many get \`200\` and how many get \`429\`.",
      challenge_input_format: "Line 1: integer \`limit\` (max accepted requests per 60-second window).\nLine 2: integer \`n\` (number of requests).\nLine 3: \`n\` space-separated non-decreasing integer arrival times in seconds (omit/blank line if \`n = 0\`).",
      challenge_output_format: "Two lines:\n- \`200 A\` where \`A\` is the number of accepted requests.\n- \`429 B\` where \`B\` is the number of throttled requests.",
      challenge_constraints: [
        "1 ≤ limit ≤ 100000",
        "0 ≤ n ≤ 100000",
        "0 ≤ arrival times ≤ 1000000000, given in non-decreasing order",
      ],
      challenge_examples: [
        { input: "3\n5\n0 1 2 3 4", output: "200 3\n429 2", explanation: "Limit is 3 per 60s. All five arrive within one window, so the first 3 are accepted and the last 2 are throttled." },
        { input: "2\n4\n0 10 70 80", output: "200 4\n429 0", explanation: "By second 70 the request at t=0 has aged out of the 60s window, freeing a slot, so every request fits." },
      ],
      challenge_notes: "Keep a list of accepted timestamps. Before each new request at time \`t\`, drop any accepted time \`x\` with \`x <= t - 60\` (it's outside the window). If the remaining count is below \`limit\`, accept and record \`t\`; otherwise throttle. A throttled request never takes a slot, which is what lets later requests recover.",
      challenge_hints: [
        "Read `limit`, then `n`, then parse the arrivals (guard the case `n == 0` with an empty list).",
        "For each arrival `t`, filter your accepted list to keep only times `> t - 60`.",
        "If `len(accepted) < limit`, append `t` and count a 200; else count a 429.",
      ],
      challenge_starter_code: `import sys

lines = sys.stdin.read().split("\\n")
limit = int(lines[0])
n = int(lines[1])
arrivals = list(map(int, lines[2].split())) if n > 0 else []
# TODO: slide a 60-second window of accepted requests,
# count 200s and 429s, then print "200 A" and "429 B".
`,
      challenge_solution_code: `import sys

lines = sys.stdin.read().split("\\n")
limit = int(lines[0])
n = int(lines[1])
arrivals = list(map(int, lines[2].split())) if n > 0 else []

window = 60
accepted_times = []
ok = 0
limited = 0
for t in arrivals:
    accepted_times = [x for x in accepted_times if x > t - window]
    if len(accepted_times) < limit:
        accepted_times.append(t)
        ok += 1
    else:
        limited += 1

print(f"200 {ok}")
print(f"429 {limited}")
`,
      challenge_test_cases: [
        {
          input: "3\n5\n0 1 2 3 4",
          expected_output: "200 3\n429 2",
          description: "Burst exceeds the per-window limit; extras get 429."
        },
        {
          input: "2\n4\n0 10 70 80",
          expected_output: "200 4\n429 0",
          description: "Old requests age out of the window, freeing slots."
        },
        {
          input: "5\n0\n",
          expected_output: "200 0\n429 0",
          description: "Edge case: no requests at all."
        }
      ]
    },
    {
      id: "ai-02-l4",
      project_id: "ai-02",
      order: 4,
      title: "Call Claude and Print the Reply",
      concept: "Messages API",
      xp_reward: 10,
      explanation: `Everything so far was setup — the counter, the JSON, the key, the limits. Now you walk up and place the order. About ten lines of Python sends a question to Claude and prints the answer. By the end of this lesson, every line of it will make sense.

## What it is

Anthropic ships an **SDK** (Software Development Kit) — a Python library that wraps the raw API so you don't hand-build the JSON. Install it once:

\`\`\`bash
pip install anthropic
\`\`\`

An SDK builds the JSON request, attaches your key, sends it over the network, and hands you back a tidy object. You *could* do all that with the \`requests\` library and a hand-written dict, but the SDK is simply less to get wrong.

## How it works

Here is the whole program:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=200,
    messages=[
        {"role": "user", "content": "Say hello in one short sentence."}
    ],
)

print(response.content[0].text)
\`\`\`

Read it top to bottom:

- **client** — your connection. It reads the key from the environment (lesson 3) and holds it.
- **messages.create** — the call itself. Here the request goes out and the response comes back (lesson 1).
- **model** — which Claude to use. \`claude-sonnet-4-6\` is a fast, capable default.
- **max_tokens** — a cap on how long the reply can be, measured in tokens. 200 is plenty for a sentence; set it too low and the answer gets cut off mid-thought.
- **messages** — a list of **turns**. Each turn has a \`role\` (\`user\` is you) and \`content\` (what you said). Recognize the shape? It's exactly the JSON from lesson 2.

## Why it matters

The reply comes back as an object, and the text lives at \`response.content[0].text\`. Why the \`[0]\`? Because \`content\` is a **list of blocks**. A plain text answer is one block — the first — so you grab \`content[0]\` and read its \`.text\`. (The list exists because richer replies can carry multiple blocks, like tool calls, which you'll meet later.)

This is the full loop from lesson 1, made real: you built a request, sent it, the server ran Claude, and you read the response. Change the \`content\` string and you change the question. Wrap it in a loop and you have a chatbot; feed it a document and you have a summarizer. Every Claude program you ever write is a variation on these ten lines.

## The mental model to keep

\`messages.create\` is the counter from lesson 1 with a real menu: hand it a model, a length cap, and your messages list, and read your answer out of \`content[0].text\`.`,
      key_terms: [
        { term: "SDK", definition: "Software Development Kit — a library that wraps an API so you call simple functions instead of building raw requests." },
        { term: "messages.create", definition: "The Anthropic SDK call that sends your message to Claude and returns the response." },
        { term: "max_tokens", definition: "The maximum length of Claude's reply, measured in tokens (roughly word-pieces)." },
        { term: "role", definition: "Who is speaking in a message. \"user\" is you; Claude's replies come back as \"assistant\"." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "The SDK is a vending machine",
          content: "Raw API: you assemble coins, slots, and the JSON request yourself. The SDK: press one button (messages.create) and the snack drops out. Same machine, fewer ways to fumble.",
          position: "before"
        },
        {
          type: "tip",
          title: "Why content[0].text",
          content: "Claude's reply is a list of content blocks. A plain text answer is one block, so you read the first one with content[0] and pull its .text.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "One call to Claude",
        steps: [
          { label: "Create the client", desc: "Anthropic(api_key=...) reads your key and holds the connection." },
          { label: "Build messages", desc: "A list with one user turn: role + content (your question)." },
          { label: "messages.create", desc: "Send model, max_tokens, and messages. Request goes out." },
          { label: "Read the reply", desc: "response.content[0].text holds Claude's answer. Print it." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where is Claude's text reply in the response object?",
          options: ["response.text", "response.content[0].text", "response.messages.text"],
          correct_index: 1,
          explanation: "content is a list of blocks. The first block's .text holds the answer: response.content[0].text."
        }
      ],
      quiz_questions: [
        {
          question: "What does the SDK do for you that you'd otherwise do by hand?",
          options: ["Run the Claude model locally", "Build the JSON request, attach your key, and send it", "Generate your API key", "Remove the need for an internet connection"],
          correct_index: 1,
          explanation: "The SDK wraps the raw API: it assembles the request, includes your key, sends it, and parses the reply."
        },
        {
          question: "In the messages list, what does role \"user\" mean?",
          options: ["It's Claude's reply", "It's the message coming from you", "It's the system administrator", "It's an error code"],
          correct_index: 1,
          explanation: "\"user\" marks the turn as yours. Claude's responses come back with role \"assistant\"."
        },
        {
          question: "What does max_tokens control?",
          options: ["How fast the reply arrives", "The maximum length of Claude's reply", "How many requests per minute you can send", "The price of your API key"],
          correct_index: 1,
          explanation: "max_tokens caps the reply length in tokens. If it's too small, the answer can get cut off."
        }
      ],
      participation_activities: [
        {
          activity_title: "Trace the call",
          questions: [
            {
              question: "In the messages list, each turn needs both a role and a content field.",
              type: "true_false",
              correct_answer: "true",
              explanation: "Every message has a role (who is speaking) and content (what they said)."
            },
            {
              question: "Fill in the blank: You read Claude's text answer from response.content[0]._____.",
              type: "fill_in",
              correct_answer: "text",
              explanation: "The first content block holds the reply; its .text attribute is the string you print."
            }
          ]
        }
      ],
      starter_code: `import os
from anthropic import Anthropic

# Build the client, send one message to Claude, and print the reply.
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

# TODO: call client.messages.create(...) with a model, max_tokens,
# and a single user message, then print response.content[0].text
`,
      solution_code: `import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=200,
    messages=[
        {"role": "user", "content": "Say hello in one short sentence."}
    ],
)

print(response.content[0].text)
`,
      expected_output: `Hello! It's great to meet you.`,
      step_throughs: [
        {
          title: "ten lines, step by step",
          steps: [
            { label: "Create the client", detail: "Anthropic(api_key=...) reads your key from the environment and holds the connection open.", code: "client = Anthropic(api_key=os.environ[\"ANTHROPIC_API_KEY\"])" },
            { label: "Build the messages list", detail: "One user turn: a role saying who's speaking and content holding your question. Same JSON shape as lesson 2.", code: 'messages=[{"role": "user", "content": "Say hello."}]' },
            { label: "Call messages.create", detail: "Pass the model, max_tokens, and messages. The SDK packs the JSON, attaches your key, and sends the request.", code: "response = client.messages.create(model=..., max_tokens=200, messages=messages)" },
            { label: "Read the reply", detail: "content is a list of blocks; the first block's .text holds Claude's answer. Print it.", code: "print(response.content[0].text)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'In messages=[{"role": "user", "content": "Hi"}], what does "user" mean?',
          steps: [
            "Each message has a role naming who is speaking.",
            "'user' marks this turn as coming from you.",
            "Claude's own replies come back with role 'assistant'."
          ],
          output: '"user" = the message is from you, not from Claude.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You run the program and Claude's answer is cut off halfway through a sentence.\nWhat parameter is to blame and how do you fix it?",
          steps: [
            "A truncated reply means the model hit its length cap before finishing.",
            "That cap is max_tokens — the maximum length of the response.",
            "Raise it (for example from 50 to 500) so the answer has room to complete.",
            "Tokens are roughly word-pieces, so estimate generously for longer replies."
          ],
          output: "Increase max_tokens so the reply isn't truncated."
        }
      ],
      comparison_tables: [
        {
          title: "raw requests vs the SDK",
          columns: ["Step", "Doing it by hand (requests)", "With the SDK"],
          rows: [
            { cells: ["Build JSON body", "You write the dict yourself", "Done for you"] },
            { cells: ["Attach the key", "Set the header manually", "Passed once to the client"] },
            { cells: ["Send + parse", "requests.post then json.loads", "One messages.create call"], highlight: true },
            { cells: ["Read the text", 'resp.json()["content"][0]["text"]', "response.content[0].text"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "request field vs response field",
          bins: [
            { id: "in", label: "You put it in the request" },
            { id: "out", label: "You read it from the response" }
          ],
          items: [
            { id: "i1", text: "model", bin: "in" },
            { id: "i2", text: "max_tokens", bin: "in" },
            { id: "i3", text: "messages", bin: "in" },
            { id: "i4", text: "content[0].text", bin: "out" },
            { id: "i5", text: "role 'assistant' on the reply", bin: "out" },
            { id: "i6", text: "usage (tokens consumed)", bin: "out" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Connect this lesson back to lesson 1: how is messages.create the same request-and-response loop you learned at the start?",
          sampleAnswer: "messages.create is the request half — I package the model, max_tokens, and my messages and send them to Anthropic's servers. The returned object is the response half — Claude's answer, which I read from content[0].text. It's the exact send-something, get-something-back pattern from lesson 1, just with the real Claude shape filled in."
        }
      ],
      hints: [
        "Pass three things to messages.create: model=\"claude-sonnet-4-6\", max_tokens=200, and the messages list.",
        "Each message is a dict with \"role\": \"user\" and \"content\": your question.",
        "Print response.content[0].text — content is a list, so grab the first block and read its .text."
      ],
      challenge_title: "Validate the Conversation",
      challenge_description: "Check whether a sequence of message roles is a legal Messages API conversation before it's sent to Claude.",
      challenge_story: "The Messages API is strict about the shape of a conversation. Before your client library ships a request, it validates the \`messages\` list locally — a rejected call still costs you a round trip and a 400 error. The rules: the list can't be empty, it must **start with a \`user\` turn**, and roles must **strictly alternate** between \`user\` and \`assistant\` (no two user turns in a row, no two assistant turns in a row). Build the pre-flight validator that decides if a conversation is well-formed.",
      challenge_statement: "You're given the ordered list of roles in a \`messages\` array. The conversation is **valid** only if all of these hold:\n\n1. It has at least one message.\n2. The first role is \`user\`.\n3. Roles strictly alternate — no two consecutive messages share the same role.\n\nEvery role is either \`user\` or \`assistant\`. Print \`valid\` if all rules hold, otherwise \`invalid\`.",
      challenge_input_format: "Line 1: integer \`n\` — the number of messages. Each of the next \`n\` lines holds one role, either \`user\` or \`assistant\`.",
      challenge_output_format: "A single line: \`valid\` or \`invalid\`.",
      challenge_constraints: [
        "0 ≤ n ≤ 100000",
        "Each role is exactly `user` or `assistant`.",
      ],
      challenge_examples: [
        { input: "3\nuser\nassistant\nuser", output: "valid", explanation: "Starts with user and alternates user -> assistant -> user. All rules satisfied." },
        { input: "2\nuser\nuser", output: "invalid", explanation: "Two user turns in a row break the strict-alternation rule." },
      ],
      challenge_notes: "These are the real constraints the Messages API enforces. A common mistake is sending two user turns back-to-back after retrying — the API rejects it. An empty list (\`n = 0\`) is invalid because there's nothing to send.",
      challenge_hints: [
        "Read `n`, then read the next `n` lines into a list of roles.",
        "Fail fast: `n == 0` is invalid, and `roles[0] != \"user\"` is invalid.",
        "Loop from index 1 and check `roles[i] == roles[i - 1]` — if so, it's not alternating.",
      ],
      challenge_starter_code: `import sys

lines = sys.stdin.read().split("\\n")
n = int(lines[0])
roles = [lines[i].strip() for i in range(1, n + 1)]
# TODO: print "valid" if non-empty, starts with user, and strictly
# alternates roles; otherwise print "invalid".
`,
      challenge_solution_code: `import sys

lines = sys.stdin.read().split("\\n")
n = int(lines[0])
roles = [lines[i].strip() for i in range(1, n + 1)]

valid = True
if n == 0:
    valid = False
elif roles[0] != "user":
    valid = False
else:
    for i in range(1, n):
        if roles[i] == roles[i - 1]:
            valid = False
            break

print("valid" if valid else "invalid")
`,
      challenge_test_cases: [
        {
          input: "3\nuser\nassistant\nuser",
          expected_output: "valid",
          description: "Starts with user and alternates correctly."
        },
        {
          input: "2\nuser\nuser",
          expected_output: "invalid",
          description: "Two user turns in a row are rejected."
        },
        {
          input: "2\nassistant\nuser",
          expected_output: "invalid",
          description: "Edge case: a conversation must start with a user turn."
        },
        {
          input: "0",
          expected_output: "invalid",
          description: "Edge case: an empty messages list has nothing to send."
        }
      ]
    },
    {
      id: "ai-02-l5",
      project_id: "ai-02",
      order: 5,
      title: "Request Anatomy: Endpoint, Headers, Body",
      concept: "Request",
      xp_reward: 10,
      explanation: `In lesson 4 the SDK built the request for you in one tidy \`messages.create\` call. Pop the hood and that call expands into three separate parts that every HTTP request on the internet shares: an **endpoint**, a set of **headers**, and a **body**. Knowing those three parts is the difference between "the SDK is magic" and "I know exactly what crossed the wire."

## What it is

An HTTP request is a structured envelope with three pieces:

- **Endpoint** — the **URL** you send to, plus the HTTP method. For Claude it's a \`POST\` to \`https://api.anthropic.com/v1/messages\`. The method \`POST\` means "I'm sending data up"; the path \`/v1/messages\` names the exact thing you want.
- **Headers** — labeled metadata *about* the request: who you are and what format you're speaking. The two that matter here are your auth header (the API key from lesson 3) and \`content-type: application/json\` (telling the server "my body is JSON").
- **Body** — the actual payload: the JSON object (lesson 2) holding \`model\`, \`messages\`, and parameters like \`max_tokens\`.

## How it works

Picture mailing a package. The **endpoint** is the address on the box. The **headers** are the labels stuck on the outside — return address, "FRAGILE", "contents: documents". The **body** is what's actually inside. The post office routes by the address and labels without ever opening the box. Here is the same Claude call written as a raw request instead of through the SDK:

\`\`\`python
import os, requests

resp = requests.post(
    "https://api.anthropic.com/v1/messages",          # endpoint
    headers={
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],  # auth
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",            # body format
    },
    json={                                             # body
        "model": "claude-sonnet-4-6",
        "max_tokens": 200,
        "messages": [{"role": "user", "content": "Hi"}],
    },
)
\`\`\`

Three parts, every time: where it goes, the labels on it, the cargo inside. The SDK simply fills these in for you.

## Why it matters

When a request fails, the error usually points at one of the three parts, and naming the part tells you where to look:

- A \`401\` is almost always a **header** problem — a missing or wrong API key.
- A \`404\` is an **endpoint** problem — a typo in the URL or path.
- A \`400\` is usually a **body** problem — malformed JSON, a missing required field, or a value out of range.

Mixing them up wastes hours. Separating endpoint, headers, and body in your head turns a vague "it broke" into a precise "the body is missing \`max_tokens\`."

## The mental model to keep

A request is a package: the **endpoint** is the address, the **headers** are the labels on the outside, and the **body** is the cargo inside.`,
      key_terms: [
        { term: "Endpoint", definition: "The URL plus HTTP method a request is sent to, e.g. POST to /v1/messages." },
        { term: "Header", definition: "Labeled metadata about a request, such as the API key and the content-type." },
        { term: "Body", definition: "The actual payload of the request — the JSON object with model, messages, and parameters." },
        { term: "content-type", definition: "A header that tells the server what format the body is in, e.g. application/json." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A request is a mailed package",
          content: "The endpoint is the address on the box, the headers are the labels stuck on the outside, and the body is what's actually inside. The post office routes by the address and labels without opening the box.",
          position: "before"
        },
        {
          type: "tip",
          title: "Match the error to the part",
          content: "401 points at a header (bad key), 404 at the endpoint (wrong URL), 400 at the body (malformed JSON). Naming the part tells you exactly where to look.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "The three parts of a request",
        steps: [
          { label: "Endpoint", desc: "POST to https://api.anthropic.com/v1/messages — where it goes." },
          { label: "Headers", desc: "Auth key + content-type: labels about the request." },
          { label: "Body", desc: "JSON with model, messages, max_tokens — the cargo." },
          { label: "Sent together", desc: "All three travel as one HTTP request to the server." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which part of a request holds your API key?",
          options: ["The endpoint", "The headers", "The body"],
          correct_index: 1,
          explanation: "The API key rides in a header (metadata about who's calling), not in the URL or the JSON body."
        }
      ],
      quiz_questions: [
        {
          question: "What does the content-type: application/json header tell the server?",
          options: ["The reply must be short", "The request body is formatted as JSON", "The user is authenticated", "The endpoint is correct"],
          correct_index: 1,
          explanation: "content-type announces the format of the body so the server knows how to parse it — here, JSON."
        },
        {
          question: "Where do model, messages, and max_tokens live in the request?",
          options: ["In the endpoint URL", "In the headers", "In the body", "In a separate file"],
          correct_index: 2,
          explanation: "Those are the actual payload, so they go in the JSON body — the cargo of the package."
        },
        {
          question: "A request fails with a 404. Which part should you check first?",
          options: ["The headers (your key)", "The body (your JSON)", "The endpoint (the URL/path)", "Your internet speed"],
          correct_index: 2,
          explanation: "404 Not Found means the address didn't resolve — a typo in the endpoint URL or path is the usual cause."
        }
      ],
      participation_activities: [
        {
          activity_title: "Sort the parts",
          questions: [
            {
              question: "The API key is sent as part of the request body alongside the messages.",
              type: "true_false",
              correct_answer: "false",
              explanation: "The key travels in a header, not the body. The body holds model, messages, and parameters."
            },
            {
              question: "Fill in the blank: The URL and HTTP method together make up the _____ of a request.",
              type: "fill_in",
              correct_answer: "endpoint",
              explanation: "Endpoint = where the request is sent (URL) and how (method, e.g. POST)."
            }
          ]
        }
      ],
      starter_code: `# A request has three parts. Lay them out as plain Python so the shape is clear.
endpoint = "https://api.anthropic.com/v1/messages"
headers = {"x-api-key": "sk-ant-...", "content-type": "application/json"}
body = {"model": "claude-sonnet-4-6", "max_tokens": 200,
        "messages": [{"role": "user", "content": "Hi"}]}

# TODO: print a one-line label for each of the three parts.
`,
      solution_code: `endpoint = "https://api.anthropic.com/v1/messages"
headers = {"x-api-key": "sk-ant-...", "content-type": "application/json"}
body = {"model": "claude-sonnet-4-6", "max_tokens": 200,
        "messages": [{"role": "user", "content": "Hi"}]}

print("endpoint:", endpoint)
print("headers:", len(headers), "header(s)")
print("body keys:", ", ".join(body.keys()))
`,
      expected_output: `endpoint: https://api.anthropic.com/v1/messages
headers: 2 header(s)
body keys: model, max_tokens, messages`,
      step_throughs: [
        {
          title: "building one raw request, part by part",
          steps: [
            { label: "Name the endpoint", detail: "Choose the method and URL. POST means you're sending data up; the path names what you want.", code: 'method, url = "POST", "https://api.anthropic.com/v1/messages"' },
            { label: "Attach the headers", detail: "Add metadata about the request: your API key for auth and content-type to declare the body format.", code: 'headers = {"x-api-key": KEY, "content-type": "application/json"}' },
            { label: "Fill the body", detail: "Pack the JSON payload: which model, how long the reply can be, and the messages list from lesson 2.", code: 'body = {"model": "claude-sonnet-4-6", "max_tokens": 200, "messages": [...]}' },
            { label: "Send all three together", detail: "The endpoint, headers, and body leave as one HTTP request. The SDK does exactly this under the hood.", code: "requests.post(url, headers=headers, json=body)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Which of these belongs in the headers, not the body: the model name, or the content-type?",
          steps: [
            "The body carries the actual payload — model, messages, parameters.",
            "content-type is metadata describing the format of that payload.",
            "Metadata about the request goes in the headers."
          ],
          output: "content-type belongs in the headers; model belongs in the body."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your raw request returns 400 Bad Request even though your key works fine elsewhere.\nWhich part is the problem and how do you narrow it down?",
          steps: [
            "Your key works elsewhere, so the header auth is fine — rule out 401/headers.",
            "400 means the server understood who you are but couldn't accept the payload.",
            "That points at the body: malformed JSON, a missing required field, or a bad value.",
            "Print the body before sending and check for required keys like model and max_tokens and valid JSON."
          ],
          output: "The body is malformed or missing a required field — inspect the JSON payload."
        }
      ],
      comparison_tables: [
        {
          title: "the three parts of a request",
          columns: ["Part", "What it is", "Example", "Typical error if wrong"],
          rows: [
            { cells: ["Endpoint", "URL + method", "POST /v1/messages", "404 Not Found"] },
            { cells: ["Headers", "Metadata labels", "x-api-key, content-type", "401 Unauthorized"] },
            { cells: ["Body", "The JSON payload", "model, messages, max_tokens", "400 Bad Request"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "endpoint, header, or body?",
          bins: [
            { id: "ep", label: "Endpoint" },
            { id: "hd", label: "Header" },
            { id: "bd", label: "Body" }
          ],
          items: [
            { id: "i1", text: "https://api.anthropic.com/v1/messages", bin: "ep" },
            { id: "i2", text: "x-api-key: sk-ant-...", bin: "hd" },
            { id: "i3", text: '"model": "claude-sonnet-4-6"', bin: "bd" },
            { id: "i4", text: "content-type: application/json", bin: "hd" },
            { id: "i5", text: 'the messages list', bin: "bd" },
            { id: "i6", text: "the POST method", bin: "ep" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "When the SDK's messages.create runs, which of the three request parts does each argument (api_key, model, messages) end up in?",
          sampleAnswer: "The api_key you pass to the client becomes an authentication header. The model, messages, and max_tokens become the JSON body. The endpoint (POST /v1/messages) is fixed by the SDK, so you never type it. The SDK simply fills in the same three parts I'd build by hand with requests."
        }
      ],
      hints: [
        "Print the endpoint string directly.",
        "len(headers) gives the number of header entries.",
        'Use ", ".join(body.keys()) to list the body field names on one line.'
      ],
      challenge_title: "Request Linter",
      challenge_description: "Validate the three parts of a raw request and report the first thing that's wrong, mimicking the error a server would return.",
      challenge_story: "Before your gateway forwards a request to Anthropic, it runs a local linter so obvious mistakes never burn a round trip. The linter checks the three parts of every HTTP request in a fixed priority: first the **endpoint** (right method and path), then the **headers** (key present, JSON content-type), then the **body** (required fields present). Whichever part fails first determines the status code you'd get back. Build the linter.",
      challenge_statement: "You are given a request described across three sections: a method and path, a list of headers, and a list of body fields that are present. Validate in this exact priority order and print the FIRST failing check (stop at the first failure):\n\n1. **Endpoint** — the method must be \`POST\` and the path must be \`/v1/messages\`. If not, output \`404\`.\n2. **Headers** — there must be a header named \`x-api-key\` AND a header named \`content-type\` whose value is exactly \`application/json\`. If either is missing, output \`401\`.\n3. **Body** — the body must contain both fields \`model\` and \`messages\`. If either is missing, output \`400\`.\n\nIf all checks pass, output \`200\`.",
      challenge_input_format: "Line 1: the method and path separated by a space (e.g. \`POST /v1/messages\`).\nLine 2: integer \`h\`, the number of headers. Each of the next \`h\` lines is \`name value\` (name and value separated by a single space).\nThe next line: integer \`b\`, the number of body fields present. Each of the next \`b\` lines is one field name.",
      challenge_output_format: "A single line: one status code — \`404\`, \`401\`, \`400\`, or \`200\`.",
      challenge_constraints: [
        "0 ≤ h ≤ 100",
        "0 ≤ b ≤ 100",
        "Header names and field names contain no spaces.",
      ],
      challenge_examples: [
        { input: "POST /v1/messages\n2\nx-api-key sk-ant-xyz\ncontent-type application/json\n2\nmodel\nmessages", output: "200", explanation: "Endpoint, headers, and body all pass, so the request is well-formed." },
        { input: "POST /v1/messages\n1\ncontent-type application/json\n2\nmodel\nmessages", output: "401", explanation: "Endpoint is fine but the x-api-key header is missing, so the header check fails with 401." },
      ],
      challenge_notes: "The priority order matters: a request with a wrong endpoint AND a missing key reports 404, because the endpoint is checked first. Store headers in a dict so you can check both the presence of x-api-key and the exact value of content-type. Body fields go in a set for quick membership tests.",
      challenge_hints: [
        "Parse line 1 with `method, path = lines[0].split()` and compare both to the expected values.",
        "Build a dict of headers, then check `\"x-api-key\" in headers` and `headers.get(\"content-type\") == \"application/json\"`.",
        "Put the body field names in a set and confirm both `\"model\"` and `\"messages\"` are present.",
      ],
      challenge_starter_code: `import sys

lines = sys.stdin.read().split("\\n")
idx = 0
method, path = lines[idx].split()
idx += 1
# TODO: read headers and body fields, then validate endpoint -> headers -> body
# and print the first failing status (404 / 401 / 400) or 200 if all pass.
`,
      challenge_solution_code: `import sys

lines = sys.stdin.read().split("\\n")
idx = 0
method, path = lines[idx].split()
idx += 1

h = int(lines[idx]); idx += 1
headers = {}
for _ in range(h):
    name, value = lines[idx].split(" ", 1)
    headers[name] = value
    idx += 1

b = int(lines[idx]); idx += 1
fields = set()
for _ in range(b):
    fields.add(lines[idx].strip())
    idx += 1

if method != "POST" or path != "/v1/messages":
    print("404")
elif "x-api-key" not in headers or headers.get("content-type") != "application/json":
    print("401")
elif "model" not in fields or "messages" not in fields:
    print("400")
else:
    print("200")
`,
      challenge_test_cases: [
        {
          input: "POST /v1/messages\n2\nx-api-key sk-ant-xyz\ncontent-type application/json\n2\nmodel\nmessages",
          expected_output: "200",
          description: "All three parts valid."
        },
        {
          input: "POST /v1/messages\n1\ncontent-type application/json\n2\nmodel\nmessages",
          expected_output: "401",
          description: "Missing x-api-key header."
        },
        {
          input: "GET /v1/messages\n2\nx-api-key sk-ant-xyz\ncontent-type application/json\n2\nmodel\nmessages",
          expected_output: "404",
          description: "Wrong method is caught first, even though headers and body are fine."
        },
        {
          input: "POST /v1/messages\n2\nx-api-key sk-ant-xyz\ncontent-type application/json\n1\nmodel",
          expected_output: "400",
          description: "Body is missing the required messages field."
        }
      ]
    },
    {
      id: "ai-02-l6",
      project_id: "ai-02",
      order: 6,
      title: "Reading the Full Response Object",
      concept: "Response",
      xp_reward: 10,
      explanation: `In lesson 4 you grabbed one field — \`response.content[0].text\` — and printed it. That's the headline. But the response that comes back from Claude carries a whole receipt of useful information: an ID for support tickets, the exact model that answered, how many tokens you spent, and *why* the reply stopped. Read the whole object and you can debug, bill, and monitor a real app.

## What it is

A Claude **response** is a JSON object (lesson 2) with a handful of top-level fields. The ones you'll use constantly:

- **id** — a unique identifier for this exact call, like \`msg_01ABC...\`. Quote it when reporting a problem to support.
- **model** — the exact model that produced the reply. Useful when you asked for an alias and want to know what actually ran.
- **role** — always \`assistant\` on a reply (Claude is the one speaking).
- **content** — the list of blocks holding the answer. \`content[0].text\` is the text of a plain reply.
- **usage** — a small object: \`input_tokens\` (what your prompt cost) and \`output_tokens\` (what the reply cost). This is your bill.
- **stop_reason** — *why* generation ended: \`end_turn\` (Claude finished naturally), \`max_tokens\` (it hit your length cap and was cut off), and a few others.

## How it works

Reach into the object the same way you'd index a dict. Here's reading the full receipt:

\`\`\`python
response = client.messages.create(...)

print(response.id)                     # msg_01ABC...
print(response.model)                  # claude-sonnet-4-6
print(response.content[0].text)        # the actual answer
print(response.usage.input_tokens)     # e.g. 12
print(response.usage.output_tokens)    # e.g. 45
print(response.stop_reason)            # "end_turn" or "max_tokens"
\`\`\`

The most operationally important field is \`stop_reason\`. If it reads \`max_tokens\`, the reply was **truncated** — Claude wasn't done, it ran out of room. The fix is to raise \`max_tokens\` and call again.

## Why it matters

The headline text is only part of the value:

- **usage** is how you compute cost (recall the per-token math from module 1) and watch for runaway prompts.
- **stop_reason** is how you detect a cut-off answer *programmatically* instead of eyeballing it. A robust app checks \`if response.stop_reason == "max_tokens"\` and reacts.
- **id** and **model** make support and monitoring possible — you can log them and trace any single call later.

Ignoring these fields is how beginners ship apps that silently truncate long answers or quietly blow a token budget.

## The mental model to keep

The response is a receipt, not just an answer. The text is the product; **usage** is the price, **stop_reason** is whether the order was complete, and **id** is the receipt number.`,
      key_terms: [
        { term: "usage", definition: "A response object reporting input_tokens and output_tokens — the cost of the call." },
        { term: "stop_reason", definition: "Why generation ended: end_turn (finished) or max_tokens (cut off at the length cap), among others." },
        { term: "id", definition: "A unique identifier for one API call, useful for logging and support tickets." },
        { term: "input_tokens / output_tokens", definition: "Tokens consumed by your prompt and by Claude's reply, respectively." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "The response is a receipt",
          content: "The text is the product you bought. usage is the price, stop_reason tells you if the order was complete or cut short, and id is the receipt number you'd quote to support.",
          position: "before"
        },
        {
          type: "warning",
          title: "max_tokens means cut off",
          content: "If stop_reason is 'max_tokens', Claude was still talking and got truncated. Don't trust the answer as complete — raise max_tokens and call again.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Fields in a Claude response",
        steps: [
          { label: "id + model", desc: "Which call this was and exactly which model answered." },
          { label: "role + content", desc: "role is 'assistant'; content[0].text holds the answer." },
          { label: "usage", desc: "input_tokens and output_tokens — the cost of the call." },
          { label: "stop_reason", desc: "Why it stopped: end_turn (done) or max_tokens (cut off)." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which response field tells you whether the reply was cut off?",
          options: ["id", "usage", "stop_reason"],
          correct_index: 2,
          explanation: "stop_reason == 'max_tokens' means the reply hit the length cap and was truncated."
        }
      ],
      quiz_questions: [
        {
          question: "What does response.usage contain?",
          options: ["The model's confidence score", "input_tokens and output_tokens for the call", "The user's account balance", "The full text of the reply"],
          correct_index: 1,
          explanation: "usage reports how many tokens the prompt and the reply consumed — that's what you're billed on."
        },
        {
          question: "stop_reason comes back as 'end_turn'. What does that mean?",
          options: ["The reply was cut off at max_tokens", "Claude finished its answer naturally", "Your key expired mid-call", "The request was rejected"],
          correct_index: 1,
          explanation: "end_turn means Claude reached a natural stopping point and the answer is complete."
        },
        {
          question: "On a reply, what is the value of the role field?",
          options: ["user", "system", "assistant", "model"],
          correct_index: 2,
          explanation: "Claude is the one speaking in a reply, so the role is 'assistant'."
        }
      ],
      participation_activities: [
        {
          activity_title: "Read the receipt",
          questions: [
            {
              question: "If stop_reason is 'max_tokens', the reply is guaranteed to be a complete answer.",
              type: "true_false",
              correct_answer: "false",
              explanation: "max_tokens means it was truncated — Claude hit the length cap before finishing."
            },
            {
              question: "Fill in the blank: response.usage.output_tokens tells you how many tokens Claude's _____ consumed.",
              type: "fill_in",
              correct_answer: "reply",
              explanation: "output_tokens counts the tokens in the reply; input_tokens counts the prompt."
            }
          ]
        }
      ],
      starter_code: `# A simulated response object as a dict. Read its fields the way you would in real code.
response = {
    "id": "msg_01ABC",
    "model": "claude-sonnet-4-6",
    "role": "assistant",
    "content": [{"type": "text", "text": "Hello there."}],
    "usage": {"input_tokens": 12, "output_tokens": 4},
    "stop_reason": "end_turn",
}

# TODO: print the answer text, the total tokens used, and the stop_reason.
`,
      solution_code: `response = {
    "id": "msg_01ABC",
    "model": "claude-sonnet-4-6",
    "role": "assistant",
    "content": [{"type": "text", "text": "Hello there."}],
    "usage": {"input_tokens": 12, "output_tokens": 4},
    "stop_reason": "end_turn",
}

text = response["content"][0]["text"]
total = response["usage"]["input_tokens"] + response["usage"]["output_tokens"]
print("answer:", text)
print("total tokens:", total)
print("stop_reason:", response["stop_reason"])
`,
      expected_output: `answer: Hello there.
total tokens: 16
stop_reason: end_turn`,
      step_throughs: [
        {
          title: "unpacking a response, field by field",
          steps: [
            { label: "Pull the headline text", detail: "content is a list of blocks; the first block's text is the answer you usually print.", code: 'answer = response["content"][0]["text"]' },
            { label: "Check why it stopped", detail: "stop_reason tells you whether the answer is complete. Branch on it to detect truncation.", code: 'if response["stop_reason"] == "max_tokens": ...' },
            { label: "Read the cost", detail: "usage holds input_tokens and output_tokens. Add them (or price them separately) to know the bill.", code: 'cost_tokens = usage["input_tokens"] + usage["output_tokens"]' },
            { label: "Log the metadata", detail: "Record id and model so any single call can be traced later in support or monitoring.", code: 'log(response["id"], response["model"])' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A response shows usage of input_tokens=20 and output_tokens=30. How many tokens did the whole call use?",
          steps: [
            "Total tokens for a call is just the prompt plus the reply.",
            "Add input_tokens and output_tokens: 20 + 30.",
            "That sum is what you'd plug into the per-token cost math."
          ],
          output: "50 tokens total."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your app asks for a long summary, but users complain the summary ends abruptly.\nWhich response field confirms the cause, and how do you fix it in code?",
          steps: [
            "An abruptly-ending reply is a classic truncation symptom.",
            "Check response.stop_reason — if it's 'max_tokens', the reply was cut off at the cap.",
            "Fix it by raising max_tokens so the reply has room to finish.",
            "Make it robust: if stop_reason == 'max_tokens', log it or retry with a higher cap automatically."
          ],
          output: "stop_reason == 'max_tokens' confirms truncation; raise max_tokens (and check the field in code)."
        }
      ],
      comparison_tables: [
        {
          title: "what each response field is for",
          columns: ["Field", "What it holds", "When you use it"],
          rows: [
            { cells: ["content[0].text", "The answer text", "Almost always — it's the reply"] },
            { cells: ["usage", "input + output tokens", "Billing and budget monitoring"] },
            { cells: ["stop_reason", "Why generation ended", "Detecting truncated replies"], highlight: true },
            { cells: ["id / model", "Call ID + model used", "Logging, support, tracing"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which field answers the question?",
          bins: [
            { id: "cost", label: "Tells you the cost" },
            { id: "complete", label: "Tells you if it finished" }
          ],
          items: [
            { id: "i1", text: "usage.input_tokens", bin: "cost" },
            { id: "i2", text: "stop_reason == 'end_turn'", bin: "complete" },
            { id: "i3", text: "usage.output_tokens", bin: "cost" },
            { id: "i4", text: "stop_reason == 'max_tokens'", bin: "complete" },
            { id: "i5", text: "input_tokens + output_tokens", bin: "cost" },
            { id: "i6", text: "whether the reply was truncated", bin: "complete" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Why is it risky to read only content[0].text and ignore stop_reason in a real app?",
          sampleAnswer: "If I only read the text, I have no way to know whether Claude actually finished. When stop_reason is 'max_tokens' the reply was cut off mid-thought, but the text still looks like a normal answer. A user could act on an incomplete summary or a half-finished code block. Checking stop_reason lets the app detect truncation and retry with a higher max_tokens instead of silently shipping a broken answer."
        }
      ],
      hints: [
        'The text lives at response["content"][0]["text"].',
        'Add response["usage"]["input_tokens"] and response["usage"]["output_tokens"] for the total.',
        'Print response["stop_reason"] directly.'
      ],
      challenge_title: "Response Inspector",
      challenge_description: "Parse a batch of JSON responses and report total tokens spent plus how many replies were truncated.",
      challenge_story: "Your dashboard ingests every response your app receives from Claude and turns it into two numbers ops cares about: the **total tokens** burned across all calls (the bill) and how many replies came back **truncated** because they hit the token cap. Each response arrives as a JSON object with a \`usage\` block and a \`stop_reason\`. Parse the batch and produce the summary.",
      challenge_statement: "You are given \`n\` responses, one JSON object per line. Each object has a \`usage\` field with integer \`input_tokens\` and \`output_tokens\`, and a string \`stop_reason\`.\n\nCompute two things:\n\n- \`total_tokens\` — the sum of \`input_tokens + output_tokens\` across all \`n\` responses.\n- \`truncated\` — how many responses have \`stop_reason\` exactly equal to \`\"max_tokens\"\`.\n\nPrint \`total <total_tokens>\` on the first line and \`truncated <truncated>\` on the second.",
      challenge_input_format: "Line 1: integer \`n\`. Each of the next \`n\` lines is one JSON object with keys \`usage\` (an object with \`input_tokens\` and \`output_tokens\`) and \`stop_reason\` (a string).",
      challenge_output_format: "Two lines:\n- \`total T\` where \`T\` is the summed input+output tokens.\n- \`truncated C\` where \`C\` is the count of responses with stop_reason \"max_tokens\".",
      challenge_constraints: [
        "0 ≤ n ≤ 10000",
        "0 ≤ input_tokens, output_tokens ≤ 1000000",
        "stop_reason is a non-empty string.",
      ],
      challenge_examples: [
        { input: "2\n{\"usage\": {\"input_tokens\": 10, \"output_tokens\": 5}, \"stop_reason\": \"end_turn\"}\n{\"usage\": {\"input_tokens\": 20, \"output_tokens\": 40}, \"stop_reason\": \"max_tokens\"}", output: "total 75\ntruncated 1", explanation: "Tokens: (10+5) + (20+40) = 75. One response stopped on max_tokens." },
        { input: "1\n{\"usage\": {\"input_tokens\": 3, \"output_tokens\": 3}, \"stop_reason\": \"end_turn\"}", output: "total 6\ntruncated 0", explanation: "6 tokens total, nothing truncated." },
      ],
      challenge_notes: "Parse each line with \`json.loads\`. Reach into the nested usage object with \`obj[\"usage\"][\"input_tokens\"]\`. Only an exact match on \`\"max_tokens\"\` counts as truncated — \`\"end_turn\"\` and other reasons do not. With \`n = 0\` the answer is \`total 0\` and \`truncated 0\`.",
      challenge_hints: [
        "Read `n`, then loop the next `n` lines, calling `json.loads` on each.",
        "Add `obj[\"usage\"][\"input_tokens\"] + obj[\"usage\"][\"output_tokens\"]` to a running total.",
        "Increment a truncated counter only when `obj[\"stop_reason\"] == \"max_tokens\"`.",
      ],
      challenge_starter_code: `import sys, json

lines = sys.stdin.read().split("\\n")
n = int(lines[0])
# TODO: parse each of the next n JSON responses, sum input+output tokens,
# count stop_reason == "max_tokens", then print "total T" and "truncated C".
`,
      challenge_solution_code: `import sys, json

lines = sys.stdin.read().split("\\n")
n = int(lines[0])

total = 0
truncated = 0
for i in range(1, n + 1):
    obj = json.loads(lines[i])
    usage = obj["usage"]
    total += usage["input_tokens"] + usage["output_tokens"]
    if obj["stop_reason"] == "max_tokens":
        truncated += 1

print(f"total {total}")
print(f"truncated {truncated}")
`,
      challenge_test_cases: [
        {
          input: "2\n{\"usage\": {\"input_tokens\": 10, \"output_tokens\": 5}, \"stop_reason\": \"end_turn\"}\n{\"usage\": {\"input_tokens\": 20, \"output_tokens\": 40}, \"stop_reason\": \"max_tokens\"}",
          expected_output: "total 75\ntruncated 1",
          description: "Sums nested usage and counts one truncated reply."
        },
        {
          input: "1\n{\"usage\": {\"input_tokens\": 3, \"output_tokens\": 3}, \"stop_reason\": \"end_turn\"}",
          expected_output: "total 6\ntruncated 0",
          description: "Single completed response, nothing truncated."
        },
        {
          input: "0",
          expected_output: "total 0\ntruncated 0",
          description: "Edge case: no responses to inspect."
        }
      ]
    },
    {
      id: "ai-02-l7",
      project_id: "ai-02",
      order: 7,
      title: "Errors, Timeouts, and Retries",
      concept: "Errors",
      xp_reward: 10,
      explanation: `Your first ten lines of code assumed every call succeeds. Real networks don't. Servers hiccup, keys expire, you send too fast, a request hangs forever. The difference between a toy script and a reliable app is what happens when the call *fails*. The good news: failures come in a small number of named buckets, and each bucket has a standard response.

## What it is

When a request fails, the API returns an **HTTP status code** — a three-digit number that classifies what went wrong. You met a few in lesson 3; here is the working set:

- **200** — success. Your answer is in the response.
- **400** — Bad Request. *Your* fault: malformed JSON, a missing field, a bad parameter. Retrying won't help; fix the request.
- **401** — Unauthorized. Your API key is missing or wrong. Retrying won't help; fix the key.
- **429** — Too Many Requests. You hit the rate limit. Retrying *after a wait* is exactly right.
- **500 / 503** — the server had a problem or is overloaded. Not your fault; retrying after a wait usually works.

A separate failure is a **timeout**: the request takes too long and your client gives up waiting. No status code at all — the answer simply never arrived.

## How it works

The crucial split: **which errors are worth retrying?** A \`400\` or \`401\` is deterministic — the same request will fail the same way forever, so retrying just wastes calls. A \`429\`, \`500\`, \`503\`, or timeout is **transient** — the same request may well succeed a moment later.

For transient errors, the standard tool is **exponential backoff**: wait a little, retry; if it fails again, wait twice as long; repeat up to a cap.

\`\`\`python
import time

def call_with_retry(send, max_retries=5):
    delay = 1
    for attempt in range(max_retries):
        status = send()                 # returns an HTTP status code
        if status == 200:
            return "ok"
        if status in (400, 401):
            return "fatal"              # never retry these
        time.sleep(delay)               # 429/500/503: wait, then retry
        delay *= 2                      # 1s, 2s, 4s, 8s, ...
    return "gave up"
\`\`\`

Doubling the wait keeps you from hammering a struggling server, and the retry cap stops an infinite loop when something is truly broken.

## Why it matters

Retry logic is where reliability lives. Retry a \`401\` and you waste a thousand doomed calls; *don't* retry a \`429\` and a brief traffic spike crashes your whole job. Production SDKs (including Anthropic's) build sensible backoff in for you, but you must still decide what to do on a fatal error: surface it to the user, log it, fall back. **The status code is the instruction — read it before reacting.**

## The mental model to keep

Failures are a triage desk. **400/401 are your bug** (fix it, never retry). **429/500/503/timeout are a hiccup** (wait, then retry with exponential backoff). Read the code, then react.`,
      key_terms: [
        { term: "HTTP status code", definition: "A three-digit number classifying a response: 200 success, 4xx client error, 5xx server error." },
        { term: "Timeout", definition: "When a request takes too long and the client stops waiting; no status code is returned." },
        { term: "Exponential backoff", definition: "Retrying after waits that double each time (1s, 2s, 4s...) up to a cap." },
        { term: "Transient vs fatal", definition: "Transient errors (429/500/503/timeout) may succeed on retry; fatal ones (400/401) will not." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A busy phone line vs a wrong number",
          content: "429/500 is a busy signal — redial in a bit and you'll get through. 401 is dialing the wrong number — redialing the same wrong number a hundred times never connects. Fix the number first.",
          position: "before"
        },
        {
          type: "warning",
          title: "Never retry a 400 or 401",
          content: "These are deterministic — the same request fails identically every time. Retrying burns calls and money without ever succeeding. Fix the request or the key instead.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "What to do with a status code",
        steps: [
          { label: "200 success", desc: "Read the response and move on." },
          { label: "400 / 401", desc: "Your bug. Fix the request or key. Do not retry." },
          { label: "429 / 500 / 503", desc: "Transient. Wait, then retry with backoff." },
          { label: "Timeout", desc: "No answer arrived. Treat like transient: retry after a wait." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which of these errors is worth retrying after a short wait?",
          options: ["401 Unauthorized", "429 Too Many Requests", "400 Bad Request"],
          correct_index: 1,
          explanation: "429 is transient — a brief wait then a retry usually succeeds. 400 and 401 are your bug and will fail identically on retry."
        }
      ],
      quiz_questions: [
        {
          question: "Why is retrying a 401 error pointless?",
          options: ["401s are random and rarely repeat", "The key is wrong, so every identical retry fails the same way", "The server bans you after one 401", "401 means the answer is already cached"],
          correct_index: 1,
          explanation: "401 is deterministic: a bad key fails identically every time. Fix the key instead of retrying."
        },
        {
          question: "What does exponential backoff mean?",
          options: ["Retry instantly as fast as possible", "Wait a fixed 10 seconds between every retry", "Double the wait time after each failed retry", "Give up after the first failure"],
          correct_index: 2,
          explanation: "Each retry waits twice as long as the last (1s, 2s, 4s...), easing pressure on a struggling server."
        },
        {
          question: "A request never returns and your client eventually stops waiting. What is this?",
          options: ["A 400 error", "A timeout", "A 200 success", "A rate limit"],
          correct_index: 1,
          explanation: "A timeout is when the response takes too long and the client gives up; no status code comes back."
        }
      ],
      participation_activities: [
        {
          activity_title: "Retry or not?",
          questions: [
            {
              question: "A 500 Internal Server Error is usually worth retrying after a short wait.",
              type: "true_false",
              correct_answer: "true",
              explanation: "500 is a server-side hiccup and often transient — backoff and retry frequently succeeds."
            },
            {
              question: "Fill in the blank: Retrying with waits that double each time (1s, 2s, 4s) is called exponential _____.",
              type: "fill_in",
              correct_answer: "backoff",
              explanation: "Exponential backoff doubles the delay between retries to ease load on the server."
            }
          ]
        }
      ],
      starter_code: `# Classify a status code: should you retry it, fix it, or are you done?
def decide(status):
    # TODO: return "ok" for 200, "fatal" for 400/401, "retry" for 429/500/503
    pass

for code in [200, 401, 429, 500, 400]:
    print(code, "->", decide(code))
`,
      solution_code: `def decide(status):
    if status == 200:
        return "ok"
    if status in (400, 401):
        return "fatal"
    if status in (429, 500, 503):
        return "retry"
    return "unknown"

for code in [200, 401, 429, 500, 400]:
    print(code, "->", decide(code))
`,
      expected_output: `200 -> ok
401 -> fatal
429 -> retry
500 -> retry
400 -> fatal`,
      step_throughs: [
        {
          title: "handling one failed call",
          steps: [
            { label: "Read the status code", detail: "Every response carries a code. Read it before doing anything else — it's the instruction.", code: "status = response.status_code  # e.g. 429" },
            { label: "Is it fatal?", detail: "400 and 401 are your bug. Stop, surface the error, and fix the request or key. Never retry.", code: "if status in (400, 401): raise FatalError" },
            { label: "Is it transient?", detail: "429, 500, 503, and timeouts may succeed later. Wait before trying again.", code: "if status in (429, 500, 503): time.sleep(delay)" },
            { label: "Back off and retry", detail: "Retry the same request, but double the wait each attempt, up to a retry cap.", code: "delay *= 2  # 1s -> 2s -> 4s, stop after max_retries" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your script gets a 400 Bad Request. Should you wrap it in a retry loop?",
          steps: [
            "400 means the request itself is malformed — your bug.",
            "The same request will fail identically no matter how many times you send it.",
            "Retrying only wastes calls; fix the request body instead."
          ],
          output: "No — fix the request. 400 is deterministic and never succeeds on retry."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You process 10,000 items in a loop and occasionally hit a 429 or a timeout.\nDesign retry behavior that stays reliable without hammering the API.",
          steps: [
            "Classify the failure: 429 and timeout are transient, so retry; a 400/401 would be fatal, so don't.",
            "On a transient failure, wait, then retry the same item.",
            "Use exponential backoff: 1s, then 2s, then 4s, so repeated failures ease off the server.",
            "Cap retries (say 5) so a permanently failing item eventually gives up and gets logged instead of looping forever."
          ],
          output: "Retry transient errors with exponential backoff (1s, 2s, 4s...) and a max retry cap; never retry fatal ones."
        }
      ],
      comparison_tables: [
        {
          title: "status codes and the right reaction",
          columns: ["Code", "Meaning", "Whose fault", "Reaction"],
          rows: [
            { cells: ["200", "Success", "—", "Read the response"] },
            { cells: ["400", "Bad Request", "You", "Fix the body, do not retry"] },
            { cells: ["401", "Unauthorized", "You", "Fix the key, do not retry"] },
            { cells: ["429", "Too Many Requests", "Load", "Wait, then retry (backoff)"], highlight: true },
            { cells: ["500/503", "Server error", "Server", "Wait, then retry (backoff)"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "retry it or don't?",
          bins: [
            { id: "retry", label: "Retry (transient)" },
            { id: "fix", label: "Don't retry (fatal)" }
          ],
          items: [
            { id: "i1", text: "429 Too Many Requests", bin: "retry" },
            { id: "i2", text: "401 Unauthorized", bin: "fix" },
            { id: "i3", text: "500 Internal Server Error", bin: "retry" },
            { id: "i4", text: "400 Bad Request", bin: "fix" },
            { id: "i5", text: "503 Service Unavailable", bin: "retry" },
            { id: "i6", text: "A request timeout", bin: "retry" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Why does retrying with exponential backoff handle a 429 better than retrying instantly in a tight loop?",
          sampleAnswer: "Retrying instantly hammers an already-overloaded endpoint, so you keep getting 429s and may make the congestion worse. Exponential backoff waits longer after each failure (1s, 2s, 4s), which gives the rate-limit window time to clear and the server time to recover. By the time you retry, a slot has usually opened, so the call succeeds without you flooding the API."
        }
      ],
      hints: [
        "Handle 200 first, then the fatal pair (400, 401), then the retry set (429, 500, 503).",
        "Use `status in (400, 401)` to test membership in a group of codes.",
        "Return a clear string label so the loop's output reads cleanly."
      ],
      challenge_title: "Backoff Scheduler",
      challenge_description: "Replay a sequence of call outcomes through retry logic and report whether each call ultimately succeeds and the total wait incurred.",
      challenge_story: "You're building the retry layer for your API client. Each outbound call returns a status code; your layer must decide whether to retry, how long to wait, and when to give up. The agreed policy: \`200\` succeeds immediately. \`400\` and \`401\` are fatal — fail at once, no waiting. \`429\`, \`500\`, and \`503\` are transient — wait and retry with exponential backoff (1s, then 2s, then 4s, ...) up to a retry cap. You're given the exact outcome each attempt would produce, so you can simulate the policy deterministically and report the result.",
      challenge_statement: "You simulate one logical API call. You are given a retry cap \`max_retries\` and the ordered list of status codes that successive attempts return.\n\nApply this policy, attempt by attempt:\n\n1. The first attempt is free (no wait). If it returns \`200\`, the call SUCCEEDS.\n2. If an attempt returns \`400\` or \`401\`, the call FAILS immediately (fatal, no further attempts, no added wait).\n3. If an attempt returns \`429\`, \`500\`, or \`503\`, it is transient: wait, then make another attempt. The wait before retry number \`k\` (1-indexed) is \`2^(k-1)\` seconds, i.e. 1, 2, 4, 8, ... You may perform at most \`max_retries\` retries (so up to \`max_retries + 1\` total attempts).\n4. If you exhaust all retries without a \`200\`, the call FAILS.\n\nPrint \`SUCCESS\` or \`FAIL\` on the first line, and \`waited W\` on the second, where \`W\` is the total seconds spent waiting.",
      challenge_input_format: "Line 1: integer \`max_retries\`.\nLine 2: integer \`m\`, the number of attempt outcomes provided.\nLine 3: \`m\` space-separated status codes, the result each attempt would return in order.",
      challenge_output_format: "Two lines:\n- \`SUCCESS\` or \`FAIL\`.\n- \`waited W\` where \`W\` is the total seconds waited (an integer).",
      challenge_constraints: [
        "0 ≤ max_retries ≤ 30",
        "1 ≤ m ≤ 40",
        "Each status code is one of 200, 400, 401, 429, 500, 503.",
        "There are always at least max_retries + 1 outcomes provided.",
      ],
      challenge_examples: [
        { input: "5\n3\n429 429 200", output: "SUCCESS\nwaited 3", explanation: "Attempt 1: 429 (transient), wait 1s, retry. Attempt 2: 429, wait 2s, retry. Attempt 3: 200 success. Total wait 1 + 2 = 3s." },
        { input: "5\n2\n500 401", output: "FAIL\nwaited 1", explanation: "Attempt 1: 500 (transient), wait 1s, retry. Attempt 2: 401 is fatal, fail immediately. Total wait 1s." },
      ],
      challenge_notes: "The wait happens BEFORE each retry, not after the final failed attempt. So a fatal code costs no extra wait, and exhausting retries adds the waits taken before each retry that was actually attempted. Process the outcome list in order, summing \`2^(k-1)\` for the k-th retry, and stop the moment you hit 200, a fatal code, or the retry cap.",
      challenge_hints: [
        "Track `attempts_used`; the first attempt is free, and you may retry at most `max_retries` more times.",
        "Before each retry (the k-th, 1-indexed), add `2 ** (k - 1)` to the total wait.",
        "Stop immediately on 200 (SUCCESS), on 400/401 (FAIL, no extra wait), or when retries run out (FAIL).",
      ],
      challenge_starter_code: `import sys

lines = sys.stdin.read().split("\\n")
max_retries = int(lines[0])
m = int(lines[1])
outcomes = list(map(int, lines[2].split()))
# TODO: simulate the backoff policy. 200 -> SUCCESS, 400/401 -> fatal FAIL,
# 429/500/503 -> wait 2^(k-1)s then retry up to max_retries. Print result + total wait.
`,
      challenge_solution_code: `import sys

lines = sys.stdin.read().split("\\n")
max_retries = int(lines[0])
m = int(lines[1])
outcomes = list(map(int, lines[2].split()))

transient = {429, 500, 503}
fatal = {400, 401}

total_wait = 0
result = "FAIL"
retries_done = 0
attempt = 0
while attempt < len(outcomes):
    code = outcomes[attempt]
    if code == 200:
        result = "SUCCESS"
        break
    if code in fatal:
        result = "FAIL"
        break
    # transient: retry if we still can
    if retries_done < max_retries:
        retries_done += 1
        total_wait += 2 ** (retries_done - 1)
        attempt += 1
    else:
        result = "FAIL"
        break

print(result)
print(f"waited {total_wait}")
`,
      challenge_test_cases: [
        {
          input: "5\n3\n429 429 200",
          expected_output: "SUCCESS\nwaited 3",
          description: "Two transient retries (wait 1 + 2) then success."
        },
        {
          input: "5\n2\n500 401",
          expected_output: "FAIL\nwaited 1",
          description: "One transient wait, then a fatal 401 stops everything."
        },
        {
          input: "0\n1\n429",
          expected_output: "FAIL\nwaited 0",
          description: "Edge case: no retries allowed, so a transient error fails with zero wait."
        },
        {
          input: "2\n3\n500 503 500",
          expected_output: "FAIL\nwaited 3",
          description: "Retries exhausted after waits of 1 and 2; the call never succeeds."
        }
      ]
    },
    {
      id: "ai-02-l8",
      project_id: "ai-02",
      order: 8,
      title: "Keeping API Keys Safe",
      concept: "Secrets",
      xp_reward: 10,
      explanation: `Lesson 3 told you the one rule: never paste your key into your code. This lesson is the full discipline behind that rule — where secrets actually live, how to stop them ever reaching GitHub, and what to do the moment one leaks. Companies have lost serious money to a single committed key. The habits here are cheap insurance.

## What it is

A **secret** is any value that grants access and must never be public: API keys, database passwords, tokens. The professional way to handle one is an **environment variable** — a name-value pair stored in your operating system's environment, *outside* your source files. Your code reads the value at runtime by name; the value itself never appears in the code.

For convenience during development, secrets often live in a **\`.env\` file** — a tiny text file of \`NAME=value\` lines that a loader reads into environment variables when your program starts.

\`\`\`text
# .env  (this file must NEVER be committed)
ANTHROPIC_API_KEY=sk-ant-your-key-here
\`\`\`

## How it works

The whole pattern is three moves. First, put the secret in a \`.env\` file. Second — the move everyone forgets — add \`.env\` to \`.gitignore\` so Git refuses to track it:

\`\`\`text
# .gitignore
.env
\`\`\`

Third, read it in code by name, never by value:

\`\`\`python
import os

api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise SystemExit("Set ANTHROPIC_API_KEY in your environment.")
\`\`\`

Notice what's shareable: the code (safe, just reads a name), a committed \`.env.example\` listing the *names* with blank values (safe, documents what's needed), and never the real \`.env\` (secret). A teammate copies \`.env.example\` to \`.env\` and fills in their own key.

## Why it matters

Three more practices separate hobby code from production:

- **Rotation.** Keys should be rotated — replaced with fresh ones — periodically, and *immediately* if you suspect a leak. A leaked key you've already rotated is worthless to an attacker. Treat any key that ever touched a commit as compromised, even after you delete it: Git history remembers.
- **Scoping (least privilege).** Give a key only the access it needs. A read-only key, or one capped to a small spending limit, limits the blast radius if it leaks. Never hand a production-grade key to a throwaway script.
- **Never log it.** Printing a key to logs or error traces leaks it just as surely as committing it. Log \`key is set: True\`, never the key itself.

## The mental model to keep

A secret is a house key. You don't tape it to the front door (hardcode it), you don't mail a photo of it to everyone (commit/log it), and if you lose it you change the lock immediately (rotate). Keep it off the code, off GitHub, and out of logs.`,
      key_terms: [
        { term: "Secret", definition: "Any access-granting value that must stay private: API keys, passwords, tokens." },
        { term: ".env file", definition: "A local text file of NAME=value lines holding secrets, loaded into environment variables at startup and never committed." },
        { term: "Rotation", definition: "Replacing a key with a fresh one periodically, or immediately after a suspected leak." },
        { term: "Scoping", definition: "Granting a key only the minimum access it needs (least privilege) to limit damage if it leaks." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A secret is a house key",
          content: "Don't tape it to the front door (hardcode it), don't mail a photo to everyone (commit or log it), and if you lose it, change the lock immediately (rotate it).",
          position: "before"
        },
        {
          type: "warning",
          title: "Git history never forgets",
          content: "Deleting a committed key in a later commit does NOT remove it — it lives in history forever. Any key that ever touched a commit must be treated as compromised and rotated.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "The lifecycle of a safe secret",
        steps: [
          { label: "Store in .env", desc: "Put the key in a local .env file, never in source code." },
          { label: "Gitignore it", desc: "Add .env to .gitignore so it can never be committed." },
          { label: "Read by name", desc: "Code reads os.environ.get('NAME') at runtime, never the literal value." },
          { label: "Rotate on leak", desc: "If a key is exposed, generate a new one and revoke the old immediately." }
        ]
      },
      inline_quizzes: [
        {
          question: "What single line stops a .env file from ever being committed to Git?",
          options: ["Adding .env to .gitignore", "Renaming it to secret.env", "Printing it at startup"],
          correct_index: 0,
          explanation: "Listing .env in .gitignore tells Git to ignore it, so it never gets tracked or pushed."
        }
      ],
      quiz_questions: [
        {
          question: "You accidentally committed your API key and then deleted it in the next commit. Is the key safe?",
          options: ["Yes, the delete removed it", "No, it remains in Git history and must be rotated", "Yes, as long as the repo is private", "Only if you also restart your computer"],
          correct_index: 1,
          explanation: "Git keeps every past commit. The key lives in history forever, so it must be treated as leaked and rotated immediately."
        },
        {
          question: "What is the point of scoping a key to least privilege?",
          options: ["It makes the key longer", "It limits the damage if the key leaks", "It speeds up requests", "It avoids rate limits"],
          correct_index: 1,
          explanation: "A narrowly-scoped or spend-capped key can do far less harm if it's stolen — the blast radius is smaller."
        },
        {
          question: "Which file is SAFE to commit to a public repo?",
          options: [".env with the real key", ".env.example listing key names with blank values", "A log file containing the key", "A backup copy of .env"],
          correct_index: 1,
          explanation: ".env.example documents which variables are needed without containing any real secret values."
        }
      ],
      participation_activities: [
        {
          activity_title: "Secret hygiene check",
          questions: [
            {
              question: "Printing your API key to a log file is a safe way to confirm it loaded correctly.",
              type: "true_false",
              correct_answer: "false",
              explanation: "Logging a key leaks it. Log a boolean like 'key is set: True' instead of the value."
            },
            {
              question: "Fill in the blank: Replacing a key with a fresh one, especially after a suspected leak, is called _____.",
              type: "fill_in",
              correct_answer: "rotation",
              explanation: "Rotation makes a leaked key worthless by revoking it and issuing a new one."
            }
          ]
        }
      ],
      starter_code: `import os

# Confirm a secret is loaded WITHOUT ever printing its value.
api_key = os.environ.get("ANTHROPIC_API_KEY")

# TODO: print "key is set: True" or "key is set: False" — never the key itself.
`,
      solution_code: `import os

api_key = os.environ.get("ANTHROPIC_API_KEY")

# Report presence only, never the value.
print("key is set:", api_key is not None)
`,
      expected_output: `key is set: False`,
      step_throughs: [
        {
          title: "wiring up a secret the safe way",
          steps: [
            { label: "Write the .env file", detail: "Put the key in a local .env as NAME=value. This file stays on your machine only.", code: "ANTHROPIC_API_KEY=sk-ant-your-key-here" },
            { label: "Ignore it in Git", detail: "Add .env to .gitignore so it can never be staged, committed, or pushed.", code: "# .gitignore\n.env" },
            { label: "Read it by name", detail: "Code looks up the variable by name at runtime. The literal key never appears in source.", code: 'api_key = os.environ.get("ANTHROPIC_API_KEY")' },
            { label: "Fail loudly if missing", detail: "If the variable isn't set, stop with a clear message instead of sending a broken request.", code: 'if not api_key: raise SystemExit("Set ANTHROPIC_API_KEY")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A teammate clones your repo and asks which environment variables they need to set. What file tells them, without leaking your key?",
          steps: [
            "The real .env is gitignored, so they never receive your actual key.",
            "A committed .env.example lists the variable names with blank or placeholder values.",
            "They copy .env.example to .env and fill in their own key."
          ],
          output: "A committed .env.example documents the needed variable names safely."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You realize a key was pushed to a public repo two weeks ago, even though you deleted it the next day.\nWhat must you do, and why isn't the delete enough?",
          steps: [
            "Git history retains every past commit, so the key is still recoverable from the old commit.",
            "Assume it has already been scraped by automated scanners — public keys are found within minutes.",
            "Rotate immediately: generate a new key and revoke the leaked one in the console.",
            "Optionally scope the new key tighter and add alerts, so a future leak does less damage."
          ],
          output: "Rotate the key now — the delete doesn't help because the key still lives in Git history and was likely already scraped."
        }
      ],
      comparison_tables: [
        {
          title: "safe storage vs leaky storage",
          columns: ["Approach", "Where the key lives", "Risk"],
          rows: [
            { cells: ["Hardcoded in .py", "In your source code", "Leaks the instant code is shared or pushed"] },
            { cells: ["Printed to logs", "In log files", "Leaks to anyone who can read logs"] },
            { cells: [".env + .gitignore", "Local file, never committed", "Stays on your machine; code reads by name"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "safe habit or leak risk?",
          bins: [
            { id: "safe", label: "Safe habit" },
            { id: "leak", label: "Leak risk" }
          ],
          items: [
            { id: "i1", text: "Store the key in a gitignored .env file", bin: "safe" },
            { id: "i2", text: "Print the full key to confirm it loaded", bin: "leak" },
            { id: "i3", text: "Rotate a key the moment you suspect a leak", bin: "safe" },
            { id: "i4", text: "Commit .env to a public repo", bin: "leak" },
            { id: "i5", text: "Scope a throwaway script's key to least privilege", bin: "safe" },
            { id: "i6", text: "Paste the key into a code comment", bin: "leak" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain why a committed-then-deleted key still needs to be rotated, drawing on what you know about how Git stores history.",
          sampleAnswer: "Git records every commit as a permanent snapshot, so deleting the key in a new commit only removes it from the latest version — the old commit that contained it is still in the repository's history and can be checked out by anyone. Public-repo scanners typically find leaked keys within minutes, so by the time I delete it, it's likely already been copied. The only real fix is rotation: revoke the exposed key and issue a new one, which makes the leaked value useless."
        }
      ],
      hints: [
        'Use os.environ.get(\"ANTHROPIC_API_KEY\") so a missing variable returns None instead of crashing.',
        "Compare to None (api_key is not None) to get a boolean.",
        "Print the boolean, never the key value itself."
      ],
      challenge_title: "Secret Leak Scanner",
      challenge_description: "Scan lines of code and config for leaked secrets, mimicking the automated scanners that find keys within minutes of a push.",
      challenge_story: "Before any commit reaches your public repo, a pre-commit scanner sweeps the staged lines looking for secrets that should never be there. The rule your team uses: a line **leaks** a secret if it contains the token prefix \`sk-ant-\` AND the line is NOT a safe reference. A safe reference is a line that only names the variable rather than embedding its value — specifically, lines that read the key by name (containing \`os.environ\`) or document it as a placeholder (containing \`.env.example\`) are allowed even if they mention the prefix in a comment. Build the scanner that flags the leaking lines and blocks the commit if any are found.",
      challenge_statement: "You are given \`n\` lines of staged content. A line is a LEAK if BOTH of these are true:\n\n1. It contains the substring \`sk-ant-\` (a real key value).\n2. It does NOT contain \`os.environ\` AND does NOT contain \`.env.example\` (i.e. it is not a safe by-name reference or placeholder).\n\nFor each line, in order, print its 1-based line number and \`LEAK\` or \`OK\`. After all lines, print \`BLOCKED\` if at least one leak was found, otherwise \`CLEAN\`.",
      challenge_input_format: "Line 1: integer \`n\`. Each of the next \`n\` lines is one line of staged content (may contain spaces; treat the whole line as-is).",
      challenge_output_format: "For each line, in order: \`<line_number> LEAK\` or \`<line_number> OK\`. Then a final line: \`BLOCKED\` or \`CLEAN\`.",
      challenge_constraints: [
        "1 ≤ n ≤ 10000",
        "Each line has length 0 to 500 characters.",
        "The secret prefix to detect is exactly `sk-ant-`.",
      ],
      challenge_examples: [
        { input: "3\napi_key = \"sk-ant-abc123\"\napi_key = os.environ.get(\"ANTHROPIC_API_KEY\")\nplain config line", output: "1 LEAK\n2 OK\n3 OK\nBLOCKED", explanation: "Line 1 embeds a real sk-ant- value with no safe reference -> LEAK. Line 2 contains sk-ant- nowhere and uses os.environ -> OK. Line 3 has no secret -> OK. A leak was found, so BLOCKED." },
        { input: "2\n# ANTHROPIC_API_KEY=sk-ant-... see .env.example\nname = \"alice\"", output: "1 OK\n2 OK\nCLEAN", explanation: "Line 1 mentions sk-ant- but also contains .env.example, marking it a safe placeholder reference -> OK. Line 2 has no secret. No leaks -> CLEAN." },
      ],
      challenge_notes: "This mirrors real secret scanners: they flag embedded key values but whitelist by-name references and example files. The check is purely substring-based here. Read exactly \`n\` lines after the count so a trailing newline doesn't add a phantom blank line. A line can contain \`sk-ant-\` and still be OK if it also references the environment or the example file.",
      challenge_hints: [
        "Read `n`, then take the next `n` lines exactly (don't strip internal content you need to scan).",
        "A line leaks when `\"sk-ant-\" in line` AND `\"os.environ\" not in line` AND `\".env.example\" not in line`.",
        "Track a boolean for whether any leak was seen; print BLOCKED if it's true, else CLEAN.",
      ],
      challenge_starter_code: `import sys

lines = sys.stdin.read().split("\\n")
n = int(lines[0])
content = lines[1:1 + n]
# TODO: for each line print "<num> LEAK" or "<num> OK"; a leak is a line with
# "sk-ant-" that is not a safe reference (os.environ / .env.example).
# Finally print "BLOCKED" if any leak, else "CLEAN".
`,
      challenge_solution_code: `import sys

lines = sys.stdin.read().split("\\n")
n = int(lines[0])
content = lines[1:1 + n]

any_leak = False
for i, line in enumerate(content, start=1):
    is_leak = ("sk-ant-" in line) and ("os.environ" not in line) and (".env.example" not in line)
    if is_leak:
        any_leak = True
        print(f"{i} LEAK")
    else:
        print(f"{i} OK")

print("BLOCKED" if any_leak else "CLEAN")
`,
      challenge_test_cases: [
        {
          input: "3\napi_key = \"sk-ant-abc123\"\napi_key = os.environ.get(\"ANTHROPIC_API_KEY\")\nplain config line",
          expected_output: "1 LEAK\n2 OK\n3 OK\nBLOCKED",
          description: "An embedded key is flagged; an os.environ reference and a plain line are safe."
        },
        {
          input: "2\n# ANTHROPIC_API_KEY=sk-ant-... see .env.example\nname = \"alice\"",
          expected_output: "1 OK\n2 OK\nCLEAN",
          description: "A .env.example placeholder line is whitelisted even though it mentions the prefix."
        },
        {
          input: "1\nDB_PASSWORD=hunter2",
          expected_output: "1 OK\nCLEAN",
          description: "Edge case: no sk-ant- prefix means no Claude-key leak detected."
        },
        {
          input: "2\nKEY = 'sk-ant-live-9999'\nOTHER = 'sk-ant-test-1'",
          expected_output: "1 LEAK\n2 LEAK\nBLOCKED",
          description: "Multiple embedded keys all flagged; commit blocked."
        }
      ]
    }
  ]
};
