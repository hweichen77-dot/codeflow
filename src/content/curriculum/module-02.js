export default {
  project: {
    id: "ai-02",
    title: "Your First API Call",
    description: "Send a message to Claude from a Python script and print the reply you get back.",
    difficulty: "beginner",
    category: "ai_ml",
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
      explanation: `You order a coffee. You don't walk behind the counter, grind the beans, and pull the shot yourself. You tell the barista what you want, they do the work, and they hand you a cup. That's an API.

## The counter, not the kitchen

API stands for Application Programming Interface. Strip the jargon: it's a way for your code to ask someone else's code to do something, without you knowing how they do it.

When you want Claude to answer a question, you don't run the model on your laptop. You can't — it's enormous. Instead you send a request over the internet to Anthropic's servers. Their code runs the model and sends an answer back. Your script never sees the machinery. It just sends the order and waits for the cup.

## A request and a response

Every API call is two halves:

- **The request** — what you send. "Here's my question. Here's who I am."
- **The response** — what comes back. "Here's the answer."

That's it. You'll spend the rest of this module learning the exact shape of those two halves for the Claude API, but the pattern never changes. Send something, get something back.

## Why APIs are everywhere

Your weather app doesn't own a satellite. It calls a weather API. Your banking app doesn't store its own copy of the stock market. It calls a finance API. Splitting work across APIs lets each team be great at one thing and lets everyone else borrow that thing with a single call.

For you, that means you can build something that talks to one of the best AI models in the world in about ten lines of Python. You don't need a PhD or a data center. You need an address to send the request to and permission to send it.

\`\`\`text
Your script  --->  request  --->  Anthropic's API
Your script  <---  response <---  Anthropic's API
\`\`\`

Don't overthink it. An API is a counter. You place an order, you get a result. Next up: the format that order is written in.`,
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
      hints: [
        "An API is about one program talking to another. Keep your sentence simple.",
        "Remember the two halves: a request goes out, a response comes back.",
        "print() each line on its own so the output has three lines."
      ],
      challenge_title: "Name the two halves",
      challenge_description: "Print exactly two lines: the first naming the message you send, the second naming the message you get back.",
      challenge_starter_code: `# Print the two halves of an API call, one per line.
`,
      challenge_solution_code: `print("request")
print("response")
`,
      challenge_test_cases: [
        {
          input: "(no input)",
          expected_output: "request\nresponse",
          description: "Two lines naming the halves of an API call."
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
      explanation: `APIs don't speak English to each other. They speak JSON. If you've ever filled out a form with labeled boxes — name, email, message — you already understand JSON. It's labeled boxes for data.

## What JSON looks like

JSON (JavaScript Object Notation) is just text arranged as **key-value pairs** inside curly braces:

\`\`\`json
{
  "name": "Ada",
  "age": 36,
  "is_admin": true
}
\`\`\`

Each key (left of the colon) is a label. Each value (right of the colon) is the data. Strings get double quotes. Numbers and \`true\`/\`false\` don't. Pairs are separated by commas.

That's 90% of it. The other 10%: values can themselves be lists or more boxes.

\`\`\`json
{
  "model": "claude-sonnet-4-6",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
\`\`\`

See the square brackets? That's a **list**. Inside it, another set of curly braces — a box inside a box. When you call Claude, your request is shaped exactly like this. Don't memorize it yet. Just notice the pattern.

## JSON in Python

Here's the part that makes JSON pleasant in Python: a JSON object looks almost identical to a Python dictionary.

\`\`\`python
import json

person = {"name": "Ada", "age": 36}
text = json.dumps(person)   # dict  -> JSON string
print(text)                 # {"name": "Ada", "age": 36}

back = json.loads(text)     # JSON string -> dict
print(back["name"])         # Ada
\`\`\`

\`json.dumps\` turns a Python dict into a JSON string to send. \`json.loads\` turns a JSON string you received back into a dict you can read. Dump to send, load to read. The SDK you'll use later does this for you, but knowing what's happening underneath means you'll never be confused by a response again.

## Why double quotes matter

JSON is strict. Keys and string values **must** use double quotes — single quotes break it. A trailing comma after the last pair breaks it too. When an API rejects your request with a vague error, a quote or a comma is the usual culprit. Look there first.`,
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
      hints: [
        "Use json.dumps(person) to turn the dictionary into a JSON string.",
        "json.dumps keeps the keys in the order you wrote them and uses double quotes.",
        "After json.loads, index the dict with back[\"name\"] to pull a single value."
      ],
      challenge_title: "Round trip a message",
      challenge_description: "Build a dict with the key \"content\" set to \"Hello\", dump it to JSON, load it back, and print just the content value.",
      challenge_starter_code: `import json

# Build the dict, dump it, load it, print the content value.
`,
      challenge_solution_code: `import json

msg = {"content": "Hello"}
text = json.dumps(msg)
loaded = json.loads(text)
print(loaded["content"])
`,
      challenge_test_cases: [
        {
          input: "(no input)",
          expected_output: "Hello",
          description: "Round-trips a dict through JSON and prints the content value."
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
      explanation: `An API key is your password to the counter. It tells Anthropic who's calling, so they can check you're allowed and bill the right account. Lose it, leak it, and someone else can run up your tab. Treat it like a credit card number.

## What a key looks like

A Claude API key is a long string, something like \`sk-ant-...\`. You get it from the Anthropic console. Every request you send includes it, and the server checks it before doing any work. No valid key, no answer — you'll get a \`401 Unauthorized\` error.

## Never put your key in your code

This is the rule that saves careers: **do not paste your key into your script.** If you do, and you push that code to GitHub, bots will find it within minutes and drain your account. It happens constantly.

Instead, store the key in an **environment variable** — a value that lives in your computer's environment, outside your code. Your script reads it at runtime:

\`\`\`python
import os

api_key = os.environ["ANTHROPIC_API_KEY"]
print("Key loaded:", api_key is not None)
\`\`\`

You set the variable once in your terminal:

\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
\`\`\`

Now your code says \`os.environ["ANTHROPIC_API_KEY"]\` and never contains the actual secret. Share the code freely; the key stays on your machine.

## Rate limits: there's a speed limit

You can't fire a million requests a second. APIs enforce **rate limits** — caps on how many requests or tokens you can use per minute. Go over and the server replies with \`429 Too Many Requests\` instead of an answer.

Limits exist so one user can't hog the service or rack up a surprise bill. For learning, you'll never come close. But when you build something real that loops over thousands of items, you'll hit them. The fix is simple: slow down, spread requests out, and retry after waiting.

\`\`\`text
401 -> your key is missing or wrong
429 -> you're sending too fast, back off and retry
200 -> success, here's your answer
\`\`\`

Two numbers, two rules. Keep your key secret. Respect the speed limit. Everything else is detail.`,
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
      hints: [
        "Use os.environ.get(\"ANTHROPIC_API_KEY\") — .get returns None instead of raising an error when the variable is missing.",
        "An if/else on api_key lets you print a different message for found vs missing.",
        "In this sandbox the variable isn't set, so the else branch runs."
      ],
      challenge_title: "Classify the status code",
      challenge_description: "Given a status code stored in a variable, print \"unauthorized\" for 401, \"rate limited\" for 429, and \"ok\" for anything else.",
      challenge_starter_code: `status = 429

# Print the right label for this status code.
`,
      challenge_solution_code: `status = 429

if status == 401:
    print("unauthorized")
elif status == 429:
    print("rate limited")
else:
    print("ok")
`,
      challenge_test_cases: [
        {
          input: "status = 429",
          expected_output: "rate limited",
          description: "429 maps to the rate-limited message."
        },
        {
          input: "status = 401",
          expected_output: "unauthorized",
          description: "401 maps to the unauthorized message."
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
      explanation: `Everything so far was setup. Now you make the call. Ten lines of Python sends a question to Claude and prints the answer. Here they are.

## Install the SDK

Anthropic ships a Python library so you don't have to build the JSON request by hand. Install it once:

\`\`\`bash
pip install anthropic
\`\`\`

An SDK is a wrapper around the raw API. It builds the JSON, attaches your key, sends the request, and hands you back a tidy object. You could do all that with the \`requests\` library and a hand-written dict — but the SDK is less to get wrong.

## The whole thing

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

- **client** — your connection, holding the key it reads from the environment.
- **messages.create** — the call itself. This is where the request goes out and the response comes back.
- **model** — which Claude to use. \`claude-sonnet-4-6\` is a solid, fast default.
- **max_tokens** — the cap on how long the reply can be. A token is roughly a word-piece; 200 is plenty for a sentence.
- **messages** — a list of turns. Each turn has a \`role\` (\`user\` is you) and \`content\` (what you said). Recognize the shape? It's the JSON from lesson 2.

## Reading the response

The reply comes back as an object. The text lives at \`response.content[0].text\`. Why the \`[0]\`? Because \`content\` is a list of blocks, and for a simple text reply there's one block — the first one. Grab its \`.text\` and print it.

That's the full loop you learned in lesson 1, made real: you built a request, sent it, the server ran Claude, and you read the response. Change the \`content\` string and you change the question. You now know how to talk to an AI from code.`,
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
      hints: [
        "Pass three things to messages.create: model=\"claude-sonnet-4-6\", max_tokens=200, and the messages list.",
        "Each message is a dict with \"role\": \"user\" and \"content\": your question.",
        "Print response.content[0].text — content is a list, so grab the first block and read its .text."
      ],
      challenge_title: "Build the messages list",
      challenge_description: "Create a messages list with a single user turn whose content is \"What is 2 + 2?\", then print the role of that one message.",
      challenge_starter_code: `# Build a one-message list and print the role of the first message.
`,
      challenge_solution_code: `messages = [
    {"role": "user", "content": "What is 2 + 2?"}
]
print(messages[0]["role"])
`,
      challenge_test_cases: [
        {
          input: "(no input)",
          expected_output: "user",
          description: "The single message's role is printed."
        },
        {
          input: "(no input)",
          expected_output: "user",
          description: "A user turn is the standard way to ask Claude a question."
        }
      ]
    }
  ]
};
