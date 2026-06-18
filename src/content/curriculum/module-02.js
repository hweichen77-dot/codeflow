export default {
  project: {
    id: "ai-02",
    title: "Your First API Call",
    description: "Send a message to Claude from a Python script and print the reply you get back.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 60,
    lessons_count: 4,
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
    }
  ]
};
