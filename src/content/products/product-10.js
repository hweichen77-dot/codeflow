export default {
  project: {
    id: "prod-10",
    title: "Tool-Using Agent",
    description:
      "Build an agent that acts instead of only talking. It runs a calculator, checks the weather, and looks up facts by calling real functions and reading their results back into its own answer. You will learn function calling from end to end: defining a tool schema, then running the execute-and-respond loop without letting it crash or run away.",
    difficulty: "intermediate",
    category: "chatbots_agents",
    estimated_time: 130,
    lessons_count: 8,
    tags: ["tool-use", "function-calling", "agents", "json-schema", "anthropic", "python"],
    order: 110,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-10-1",
      project_id: "prod-10",
      order: 1,
      title: "Give the Model a Tool",
      concept: "defining a tool schema",
      explanation: `A plain chatbot can only talk. Ask it "what's 847 times 293?" and it does the arithmetic in its head, sometimes wrong. Ask it "what's the weather in Tokyo right now?" and it has no way to know, because it was trained on old text, not a live feed. Tool use (also called function calling) fixes both problems. You hand the model a menu of functions it is allowed to ask for. When it needs one, it tells you which one and with what arguments, and you run the real function. The model never runs code itself.

## What we're building

By lesson 8 you'll have an agent with three tools: a calculator for real arithmetic, a weather lookup, and a search tool for facts. The model picks the right tool for each question, you run it in Python, and the model folds the real result into its final answer.

## A tool is a JSON schema, not code

You never send the model your Python function. You send a description of it: a name, a plain-English description of what it does, and an \`input_schema\` describing the arguments as JSON Schema.

\`\`\`python
calculator_tool = {
    "name": "calculator",
    "description": "Evaluate a basic arithmetic expression and return the numeric result.",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "A math expression like '847 * 293' or '(3 + 4) / 2'.",
            }
        },
        "required": ["expression"],
    },
}
\`\`\`

You pass a list of these in the \`tools\` parameter of the API call:

\`\`\`python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    tools=[calculator_tool],
    messages=[{"role": "user", "content": "What's 847 * 293?"}],
)
\`\`\`

The model reads the schema like a menu. \`name\` is how it refers to the tool. \`description\` is the only thing that tells it when to reach for this tool over another, so write it like you're briefing a new hire, not scribbling a code comment. \`input_schema\` pins down which arguments it must supply and their types, and \`required\` is what catches the model trying to call a tool with an argument left out.

## Why the schema has to be right

Everything downstream depends on this schema being precise. A vague description like "does math stuff" means the model might skip the tool when it should call it, or call it when it shouldn't. A loose \`input_schema\` with no \`required\` and a wrong \`type\` means you get called with arguments you don't know how to handle. The schema is a contract. You are telling the model exactly what it can ask for and exactly what shape the answer will come back in. Get that contract right before you write a single line of execution logic.

## The mental model to keep

A tool definition is a job posting, not a job. You aren't giving the model the ability to run code. You are giving it the ability to request that you run code, with a precise form to fill out. Below you'll build that job-posting dict by hand and check that it has the shape the API expects. No network call yet.`,
      starter_code: `# Build a tool schema dict by hand, no API call yet.
# The API expects: name, description, input_schema (JSON Schema style).

def build_calculator_tool():
    # TODO: return a dict with keys "name", "description", "input_schema".
    # input_schema must be an object schema with one required string
    # property called "expression".
    pass

tool = build_calculator_tool()
print("name:", tool["name"])
`,
      solution_code: `# Build a tool schema dict by hand, no API call yet.
# The API expects: name, description, input_schema (JSON Schema style).

def build_calculator_tool():
    return {
        "name": "calculator",
        "description": "Evaluate a basic arithmetic expression and return the numeric result.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "A math expression like '847 * 293'.",
                }
            },
            "required": ["expression"],
        },
    }

tool = build_calculator_tool()

print("name:", tool["name"])
print("required args:", tool["input_schema"]["required"])
print("has description:", bool(tool["description"]))
print("property names:", sorted(tool["input_schema"]["properties"].keys()))
`,
      hints: [
        "input_schema always has type 'object' at the top level, with a 'properties' dict inside it.",
        "required is a list of strings naming which properties must be present, here just ['expression'].",
        "Give the description a full sentence, the model uses it to decide whether this tool fits the question.",
      ],
      challenge_title: "Tool Schema Checker",
      challenge_description:
        "Given a tool's required argument names and a proposed call's provided arguments, decide whether the call is valid or missing something.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx]); idx += 1
    required = [data[idx + i].strip() for i in range(r)]; idx += r
    p = int(data[idx]); idx += 1
    provided = {}
    for i in range(p):
        parts = data[idx + i].split(" ", 1)
        provided[parts[0]] = parts[1] if len(parts) > 1 else ""
    idx += p
    # parse done: 'required' is the list of required arg names in order,
    # 'provided' is a dict of arg name -> value the call actually supplied.

    # TODO: find every name in 'required' that is missing from 'provided',
    #       keeping the order they appear in 'required'.
    # TODO: if none are missing, print "VALID".
    # TODO: otherwise print "INVALID" then a second line with the missing
    #       names joined by commas, e.g. "expression,units".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx]); idx += 1
    required = [data[idx + i].strip() for i in range(r)]; idx += r
    p = int(data[idx]); idx += 1
    provided = {}
    for i in range(p):
        parts = data[idx + i].split(" ", 1)
        provided[parts[0]] = parts[1] if len(parts) > 1 else ""
    idx += p

    missing = [name for name in required if name not in provided]

    if not missing:
        print("VALID")
    else:
        print("INVALID")
        print(",".join(missing))

main()
`,
      challenge_test_cases: [
        {
          input: "1\nexpression\n0\n",
          expected_output: "INVALID\nexpression",
          description: "A single required argument with nothing provided is missing it.",
        },
        {
          input: "2\ncity\nunits\n1\ncity Tokyo\n",
          expected_output: "INVALID\nunits",
          description: "city was provided but units was not, so only units is missing.",
        },
        {
          input: "1\nquery\n1\nquery weather\n",
          expected_output: "VALID",
          description: "The one required argument was provided, so the call is valid.",
        },
        {
          input: "0\n0\n",
          expected_output: "VALID",
          description: "Edge case: a tool with no required arguments is always valid.",
        },
      ],
    },

    {
      id: "prod-10-2",
      project_id: "prod-10",
      order: 2,
      title: "The Model Asks for a Tool",
      concept: "reading a tool_use block",
      explanation: `You sent the model a calculator tool and asked "what's 847 * 293?" The model doesn't answer with a number. It answers with a request: run the calculator tool with this expression. This lesson is about reading that request.

## What comes back isn't plain text

When the model decides to use a tool, its reply has \`stop_reason == "tool_use"\`, and its \`content\` list holds one or more blocks of type \`"tool_use"\` next to any \`"text"\` blocks it also wrote:

\`\`\`python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    tools=[calculator_tool],
    messages=[{"role": "user", "content": "What's 847 * 293?"}],
)

print(resp.stop_reason)   # "tool_use"

for block in resp.content:
    if block.type == "tool_use":
        print(block.id)     # a unique id, e.g. "toolu_01AB..."
        print(block.name)   # "calculator"
        print(block.input)  # {"expression": "847 * 293"}
\`\`\`

Three fields matter on a \`tool_use\` block. \`id\` tags this specific request so you can match your answer back to it later. \`name\` tells you which tool it wants. \`input\` is a dict matching the \`input_schema\` you defined, already parsed into real Python types, with no JSON string for you to decode.

## Why stop_reason matters

\`stop_reason\` is how you tell a final answer apart from a request for a tool run. If it is \`"end_turn"\`, print \`resp.content[0].text\` like a normal chatbot reply. If it is \`"tool_use"\`, the model isn't done. It is paused, waiting on you. Checking \`stop_reason\` before you touch the content is the first branch of every agent loop you'll write from here on.

## The model can talk and call in the same turn

Sometimes the model writes a sentence like "Let me calculate that for you" as a text block before the tool_use block. Both live in the same \`content\` list. For running the tool you only care about the tool_use block. The leading text is narration you can show the user or ignore.

## The mental model to keep

A \`tool_use\` block is a filled-out request form: which tool (\`name\`), what to run it with (\`input\`), and a tracking number (\`id\`) so the answer comes back to the right request. Nothing has run yet. Below you'll pull that form out of a message's content list, using a plain Python list in place of what the API would hand you. No network required.`,
      starter_code: `# Simulate a model reply's content blocks (no API call).
# Each block is a dict with a "type", and tool_use blocks also have
# "id", "name", and "input".

content = [
    {"type": "text", "text": "Let me calculate that for you."},
    {"type": "tool_use", "id": "toolu_01", "name": "calculator", "input": {"expression": "847 * 293"}},
]

def find_tool_use(content):
    # TODO: return the first block in content whose "type" is "tool_use",
    #       or None if there isn't one.
    pass

block = find_tool_use(content)
print("name:", block["name"])
`,
      solution_code: `# Simulate a model reply's content blocks (no API call).
# Each block is a dict with a "type", and tool_use blocks also have
# "id", "name", and "input".

content = [
    {"type": "text", "text": "Let me calculate that for you."},
    {"type": "tool_use", "id": "toolu_01", "name": "calculator", "input": {"expression": "847 * 293"}},
]

def find_tool_use(content):
    for block in content:
        if block["type"] == "tool_use":
            return block
    return None

block = find_tool_use(content)

print("name:", block["name"])
print("id:", block["id"])
print("input:", block["input"])
print("expression arg:", block["input"]["expression"])

no_tool = [{"type": "text", "text": "Hi there!"}]
print("no tool found:", find_tool_use(no_tool))
`,
      hints: [
        "Loop over the content list and return the first block where block['type'] == 'tool_use'.",
        "If the loop finishes with no match, return None explicitly.",
        "block['input'] is already a dict, so block['input']['expression'] gets the argument directly.",
      ],
      challenge_title: "First Tool Call Wins",
      challenge_description:
        "The model can ramble in text before it calls a tool. Find the first tool_use block in a message's content blocks and report where it sits.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    blocks = []
    for i in range(1, n + 1):
        parts = lines[i].split(" ", 1)
        blocks.append(parts)
    # parse done: 'blocks' is a list where each entry is either ["text"]
    # or ["tool_use", "<name>"], in the order the model produced them.

    # TODO: scan blocks in order for the first one whose first element is
    #       "tool_use". If found, print "TOOL <name> AT <index>" where
    #       index is 1-based. If none exist, print "NONE".

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    blocks = []
    for i in range(1, n + 1):
        parts = lines[i].split(" ", 1)
        blocks.append(parts)

    for idx, block in enumerate(blocks, start=1):
        if block[0] == "tool_use":
            print(f"TOOL {block[1]} AT {idx}")
            return

    print("NONE")

main()
`,
      challenge_test_cases: [
        {
          input: "3\ntext\ntool_use calculator\ntext\n",
          expected_output: "TOOL calculator AT 2",
          description: "The tool_use block sits second, after a text block.",
        },
        {
          input: "2\ntext\ntext\n",
          expected_output: "NONE",
          description: "No tool_use block appears anywhere.",
        },
        {
          input: "1\ntool_use weather\n",
          expected_output: "TOOL weather AT 1",
          description: "A single block that is itself the tool call.",
        },
        {
          input: "4\ntool_use search\ntext\ntool_use calculator\ntext\n",
          expected_output: "TOOL search AT 1",
          description: "Edge: multiple tool_use blocks exist, only the first one counts.",
        },
      ],
    },

    {
      id: "prod-10-3",
      project_id: "prod-10",
      order: 3,
      title: "Run It and Answer Back",
      concept: "executing a tool and sending tool_result",
      explanation: `The model asked for the calculator. You found the request. Now comes the part that makes this an agent instead of a fancy parser: you run the function, and you send the answer back in a specific shape the model can use.

## Step 1: run your own Python function

The model never executes code. \`input["expression"]\` is a string it wants evaluated, and you write real Python to do that safely. Never run raw \`eval\` on untrusted text; a later lesson covers why:

\`\`\`python
import operator, re

def run_calculator(expression):
    if not re.fullmatch(r"[0-9\\.\\s()+\\-*/]+", expression):
        return "error: unsupported characters in expression"
    return eval(expression, {"__builtins__": {}}, {})
\`\`\`

## Step 2: send the result back as a tool_result

The API needs two messages appended to your history. First the assistant's turn, exactly what it sent you, tool_use block and all. Then a user turn holding a \`tool_result\` block that names which request it answers:

\`\`\`python
messages.append({"role": "assistant", "content": resp.content})

result = run_calculator(block["input"]["expression"])

messages.append({
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": block["id"],
            "content": str(result),
        }
    ],
})

final = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    tools=[calculator_tool],
    messages=messages,
)
print(final.content[0].text)
\`\`\`

## Why the tool_use_id matters

\`tool_result\` is a user-role message, which feels backwards since your code wrote it, not a person. But from the API's side, anything that isn't the assistant is the other side of the conversation. The \`tool_use_id\` is what stitches the result to its request. If the model asks for two tools in one turn, each result has to carry the matching id, or the model can't tell which answer belongs to which question.

## Why this is the whole mechanism

This round trip is all there is to tool use: the assistant asks, you run the function, you answer, the model responds. Three messages appended to a list, one Python function call in between. Everything harder in later lessons, like multiple tools and loops and error handling, is this same pattern repeated and made sturdier.

## The mental model to keep

Think of it as a relay handoff. The model hands you a baton, the tool_use block. You run to the function, get the result, and hand the baton back tagged with the same race number, the \`tool_use_id\`, so the model knows which leg of the race it belongs to.`,
      starter_code: `# Build the assistant + tool_result round trip by hand (no API call).

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

assistant_content = [
    {"type": "tool_use", "id": "toolu_01", "name": "calculator", "input": {"expression": "6 * 7"}},
]

messages = [{"role": "user", "content": "What's 6 times 7?"}]

def append_round_trip(messages, assistant_content, tool_use_id, result):
    # TODO: append an assistant message with content=assistant_content
    # TODO: append a user message whose content is a list with one
    #       tool_result block: {"type": "tool_result", "tool_use_id": ..., "content": str(result)}
    pass

result = run_calculator("6 * 7")
append_round_trip(messages, assistant_content, "toolu_01", result)
print("messages:", len(messages))
`,
      solution_code: `# Build the assistant + tool_result round trip by hand (no API call).

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

assistant_content = [
    {"type": "tool_use", "id": "toolu_01", "name": "calculator", "input": {"expression": "6 * 7"}},
]

messages = [{"role": "user", "content": "What's 6 times 7?"}]

def append_round_trip(messages, assistant_content, tool_use_id, result):
    messages.append({"role": "assistant", "content": assistant_content})
    messages.append({
        "role": "user",
        "content": [
            {"type": "tool_result", "tool_use_id": tool_use_id, "content": str(result)}
        ],
    })

result = run_calculator("6 * 7")
append_round_trip(messages, assistant_content, "toolu_01", result)

print("messages:", len(messages))
print("roles:", [m["role"] for m in messages])
last = messages[-1]["content"][0]
print("tool_result id:", last["tool_use_id"])
print("tool_result content:", last["content"])
`,
      hints: [
        "The assistant message's content is the raw content list the model sent, tool_use block included.",
        "The tool_result message uses role 'user', and its content is a list with one dict, not a plain string.",
        "Always str() the result before putting it in 'content', tool_result content must be text.",
      ],
      challenge_title: "Match Tool Results",
      challenge_description:
        "Given the tool calls the assistant made and the results your code sent back, find any tool call that never got a matching result.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    u = int(data[idx]); idx += 1
    uses = []
    for _ in range(u):
        tid, name = data[idx].split(" ", 1); idx += 1
        uses.append((tid, name))
    r = int(data[idx]); idx += 1
    result_ids = set()
    for _ in range(r):
        rid = data[idx].split(" ", 1)[0]; idx += 1
        result_ids.add(rid)
    # parse done: 'uses' is a list of (tool_use_id, tool_name) in the order
    # requested; 'result_ids' is the set of tool_use_ids that got a result.

    # TODO: find every tool_use in 'uses' whose id is NOT in result_ids,
    #       keeping order. Print the count on the first line, then either
    #       "NONE" or the missing tool names joined by commas.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    u = int(data[idx]); idx += 1
    uses = []
    for _ in range(u):
        tid, name = data[idx].split(" ", 1); idx += 1
        uses.append((tid, name))
    r = int(data[idx]); idx += 1
    result_ids = set()
    for _ in range(r):
        rid = data[idx].split(" ", 1)[0]; idx += 1
        result_ids.add(rid)

    missing = [name for tid, name in uses if tid not in result_ids]

    print(len(missing))
    print(",".join(missing) if missing else "NONE")

main()
`,
      challenge_test_cases: [
        {
          input: "2\n1 calculator\n2 weather\n1\n1 42\n",
          expected_output: "1\nweather",
          description: "The weather call (id 2) never received a matching tool_result.",
        },
        {
          input: "2\n1 calculator\n2 weather\n2\n1 42\n2 sunny\n",
          expected_output: "0\nNONE",
          description: "Every tool call got a matching result.",
        },
        {
          input: "1\n1 search\n0\n",
          expected_output: "1\nsearch",
          description: "A single tool call with zero results returned is missing its match.",
        },
        {
          input: "3\n1 calc\n2 weather\n3 search\n3\n3 x\n1 y\n2 z\n",
          expected_output: "0\nNONE",
          description: "Edge: results arrive out of order, but matching is by id, not by position.",
        },
      ],
    },

    {
      id: "prod-10-4",
      project_id: "prod-10",
      order: 4,
      title: "Choosing Among Several Tools",
      concept: "routing to the right tool",
      explanation: `One tool is a demo. A real agent has a toolbox, and the model has to pick the right tool for each question on its own. This lesson adds a weather tool and a search tool next to the calculator, then shows how you route each request to the matching Python function once the model picks one.

## Register more than one tool

Add more schemas to the same \`tools\` list. Each gets its own name, description, and input_schema:

\`\`\`python
weather_tool = {
    "name": "get_weather",
    "description": "Get the current weather for a named city.",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string", "description": "City name, e.g. 'Tokyo'."}},
        "required": ["city"],
    },
}

search_tool = {
    "name": "web_search",
    "description": "Search the web for a fact or current event and return a short snippet.",
    "input_schema": {
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The search query."}},
        "required": ["query"],
    },
}

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    tools=[calculator_tool, weather_tool, search_tool],
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
)
\`\`\`

The model reads all three descriptions and picks based on the question. Ask about weather and it calls \`get_weather\`. Ask it to multiply two numbers and it calls \`calculator\`. Ask "who won the last World Cup" and it calls \`web_search\`. You never tell it which one. That is the payoff of the good descriptions you wrote in lesson 1.

## Routing the call in your code

Once you get a \`tool_use\` block back, look up \`block["name"]\` in a dispatch table instead of writing a long if/elif chain:

\`\`\`python
TOOLS = {
    "calculator": run_calculator,
    "get_weather": run_weather,
    "web_search": run_search,
}

def execute_tool(block):
    fn = TOOLS[block["name"]]
    return fn(**block["input"])
\`\`\`

\`**block["input"]\` unpacks the dict straight into keyword arguments, so \`run_weather(city="Tokyo")\` gets called correctly whichever tool fired, as long as your function's parameter names match the schema's property names exactly.

## Why a dispatch dict

A dispatch dict scales to ten tools as easily as three, while an if/elif chain gets uglier every time you add one. It also turns an unknown tool name into a single clean check, \`if block["name"] not in TOOLS\`, instead of a silent fall-through. That check matters once you harden the agent in lesson 6.

## The mental model to keep

Think of the model as a customer at an information desk with three counters: math, weather, facts. It reads the signage, your descriptions, and walks to the right counter itself. Your job is to staff each counter with the right clerk, keyed by name, in a dict.`,
      starter_code: `# Route a tool_use block to the right stub function, no API call.

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    fake_data = {"Tokyo": "Sunny, 24C", "Paris": "Rainy, 15C"}
    return fake_data.get(city, "unknown city")

def run_search(query):
    return f"Top result for '{query}': (stubbed snippet)"

TOOLS = {
    "calculator": run_calculator,
    "get_weather": run_weather,
    "web_search": run_search,
}

def execute_tool(block):
    # TODO: look up block["name"] in TOOLS and call it with
    #       block["input"] unpacked as keyword arguments.
    pass

block = {"name": "get_weather", "input": {"city": "Tokyo"}}
print(execute_tool(block))
`,
      solution_code: `# Route a tool_use block to the right stub function, no API call.

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    fake_data = {"Tokyo": "Sunny, 24C", "Paris": "Rainy, 15C"}
    return fake_data.get(city, "unknown city")

def run_search(query):
    return f"Top result for '{query}': (stubbed snippet)"

TOOLS = {
    "calculator": run_calculator,
    "get_weather": run_weather,
    "web_search": run_search,
}

def execute_tool(block):
    fn = TOOLS[block["name"]]
    return fn(**block["input"])

blocks = [
    {"name": "get_weather", "input": {"city": "Tokyo"}},
    {"name": "calculator", "input": {"expression": "12 * 8"}},
    {"name": "web_search", "input": {"query": "capital of France"}},
]

for block in blocks:
    print(block["name"], "->", execute_tool(block))
`,
      hints: [
        "TOOLS[block['name']] gets you the right function object; call it, don't just return it.",
        "Use **block['input'] to unpack the dict into keyword arguments matching the function's parameter names.",
        "Each stub function's parameter name must exactly match the schema's property name, e.g. 'city', not 'City'.",
      ],
      challenge_title: "Route the Question",
      challenge_description:
        "Apply a simple, fixed routing rule to decide which tool a question should go to: numbers go to the calculator, weather words go to the weather tool, everything else falls back to search.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def route(question):
    # TODO: if any character in question is a digit, return "calculator".
    # TODO: else if "weather" appears in question (case-insensitive), return "weather".
    # TODO: otherwise return "search".
    pass

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    for i in range(1, n + 1):
        print(route(lines[i]))

main()
`,
      challenge_solution_code: `import sys

def route(question):
    if any(ch.isdigit() for ch in question):
        return "calculator"
    if "weather" in question.lower():
        return "weather"
    return "search"

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    for i in range(1, n + 1):
        print(route(lines[i]))

main()
`,
      challenge_test_cases: [
        {
          input: "4\nWhat is 2 + 2\nWhat's the weather in Tokyo\nWho won the World Cup in 2018\nFind me articles about penguins\n",
          expected_output: "calculator\nweather\ncalculator\nsearch",
          description: "Digits win the routing check even when the question also mentions an event.",
        },
        {
          input: "1\nIs it raining right now\n",
          expected_output: "search",
          description: "No digits and no 'weather' keyword falls back to search.",
        },
        {
          input: "1\nWhat's the Weather like today\n",
          expected_output: "weather",
          description: "The weather keyword check is case-insensitive.",
        },
        {
          input: "2\nMultiply 9 and 6\nplain question\n",
          expected_output: "calculator\nsearch",
          description: "Edge: a question with digits routes to calculator, one with neither trigger falls to search.",
        },
      ],
    },

    {
      id: "prod-10-5",
      project_id: "prod-10",
      order: 5,
      title: "The Agent Loop",
      concept: "looping until the model is done",
      explanation: `Real questions sometimes need more than one tool call before the model has enough to answer. "What's the weather in Tokyo, and what's that in Fahrenheit if it's given in Celsius" might call \`get_weather\` first, then \`calculator\` once it has a number. A single request/execute/respond round trip won't cover that. You need a loop that keeps running tools until the model says it's done.

## The loop, precisely

Every turn, check \`stop_reason\`. If it is \`"tool_use"\`, run the tool and continue. If it is \`"end_turn"\`, stop and print the final text:

\`\`\`python
messages = [{"role": "user", "content": "Weather in Tokyo, then double the temperature."}]

while True:
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        tools=[calculator_tool, weather_tool, search_tool],
        messages=messages,
    )
    messages.append({"role": "assistant", "content": resp.content})

    if resp.stop_reason != "tool_use":
        final_text = next(b.text for b in resp.content if b.type == "text")
        print(final_text)
        break

    tool_block = next(b for b in resp.content if b.type == "tool_use")
    result = execute_tool({"name": tool_block.name, "input": tool_block.input})

    messages.append({
        "role": "user",
        "content": [{"type": "tool_result", "tool_use_id": tool_block.id, "content": str(result)}],
    })
\`\`\`

Notice the loop's shape. Append the assistant's turn every time, then branch on \`stop_reason\`. If it wants a tool, run it, append the \`tool_result\`, and go around again. The model sees the new result added to \`messages\` and decides what to do next: call another tool, or answer.

## Why a loop, not a fixed number of round trips

You don't know in advance how many tool calls a question needs. Some need zero and are pure chat. Some need one. Some need three chained together. A loop that keeps going until \`stop_reason\` says otherwise handles all of them with the same code. Hard-coding "call once, then always answer" breaks the moment a question needs two tools.

## Why this loop is the agent

Everything before this lesson was pieces: define a tool, read a request, run it, answer once. This lesson assembles them into something that keeps working turn after turn until the model has what it needs. That is the difference between a script that calls a tool and an agent that solves a task.

## The mental model to keep

Picture a research assistant fetching one book at a time from the stacks, coming back to your desk after each one to check whether they have enough now or need another book. Each pass through the loop is one trip to the stacks. The loop ends the moment the assistant says "I have what I need" and starts writing the answer.`,
      starter_code: `# Drive a scripted agent loop, no API call.
# 'script' stands in for a sequence of model responses: each is either
# {"stop_reason": "tool_use", "tool": name, "input": args}
# or {"stop_reason": "end_turn", "text": final_answer}

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    return {"Tokyo": 24}.get(city, 0)

TOOLS = {"calculator": run_calculator, "get_weather": run_weather}

script = [
    {"stop_reason": "tool_use", "tool": "get_weather", "input": {"city": "Tokyo"}},
    {"stop_reason": "tool_use", "tool": "calculator", "input": {"expression": "24 * 9 / 5 + 32"}},
    {"stop_reason": "end_turn", "text": "It's 24C in Tokyo, which is 75.2F."},
]

def run_agent_loop(script):
    # TODO: walk through script in order. For each "tool_use" turn, call the
    #       matching function in TOOLS with turn["input"] unpacked, and keep
    #       going. On the first "end_turn" turn, return turn["text"] right away.
    pass

print(run_agent_loop(script))
`,
      solution_code: `# Drive a scripted agent loop, no API call.
# 'script' stands in for a sequence of model responses: each is either
# {"stop_reason": "tool_use", "tool": name, "input": args}
# or {"stop_reason": "end_turn", "text": final_answer}

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    return {"Tokyo": 24}.get(city, 0)

TOOLS = {"calculator": run_calculator, "get_weather": run_weather}

script = [
    {"stop_reason": "tool_use", "tool": "get_weather", "input": {"city": "Tokyo"}},
    {"stop_reason": "tool_use", "tool": "calculator", "input": {"expression": "24 * 9 / 5 + 32"}},
    {"stop_reason": "end_turn", "text": "It's 24C in Tokyo, which is 75.2F."},
]

def run_agent_loop(script):
    for turn in script:
        if turn["stop_reason"] == "end_turn":
            return turn["text"]
        fn = TOOLS[turn["tool"]]
        result = fn(**turn["input"])
        print(f"  ran {turn['tool']} -> {result}")
    return None

print(run_agent_loop(script))
`,
      hints: [
        "Iterate script in order; check turn['stop_reason'] first thing each pass.",
        "On 'end_turn', return immediately, don't keep looping past it.",
        "On 'tool_use', call TOOLS[turn['tool']](**turn['input']) and just move to the next turn.",
      ],
      challenge_title: "Run the Agent Loop",
      challenge_description:
        "Simulate driving an agent loop over a scripted sequence of turns: count tool calls made and report the final answer, stopping the instant a final turn appears.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    turns = [lines[i] for i in range(1, n + 1)]
    # parse done: each turn is either "TOOL <name>" or "FINAL <text...>"

    # TODO: walk turns in order, counting how many "TOOL" turns you pass.
    # TODO: the moment you hit a "FINAL" turn, print the tool count on one
    #       line and the text after "FINAL " on the next line, then stop
    #       (ignore any turns after it).
    # TODO: if you reach the end with no "FINAL" turn at all, print "NO FINAL".

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0])
    turns = [lines[i] for i in range(1, n + 1)]

    tool_calls = 0
    for turn in turns:
        if turn.startswith("FINAL "):
            print(tool_calls)
            print(turn[len("FINAL "):])
            return
        elif turn.startswith("TOOL"):
            tool_calls += 1

    print("NO FINAL")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nTOOL calculator\nTOOL weather\nFINAL Sunny and warm, sum is 10\n",
          expected_output: "2\nSunny and warm, sum is 10",
          description: "Two tool calls precede the final answer.",
        },
        {
          input: "1\nFINAL Hello\n",
          expected_output: "0\nHello",
          description: "A final answer with zero tool calls needed first.",
        },
        {
          input: "2\nTOOL search\nTOOL search\n",
          expected_output: "NO FINAL",
          description: "The script never produces a final answer.",
        },
        {
          input: "4\nTOOL a\nFINAL done\nTOOL b\nTOOL c\n",
          expected_output: "1\ndone",
          description: "Edge: turns after the FINAL turn are ignored entirely.",
        },
      ],
    },

    {
      id: "prod-10-6",
      project_id: "prod-10",
      order: 6,
      title: "Don't Trust the Arguments",
      concept: "validating tool calls",
      explanation: `The loop works when everything goes right. It doesn't yet handle a model that asks for a tool that doesn't exist, or hands you an argument that's missing or the wrong type. Models are usually good at following a schema, but "usually" is not a word you want near code that runs \`eval()\`. This lesson hardens \`execute_tool\` before it runs anything.

## Three ways a tool call can be bad

1. Unknown tool name. The model, or a bug, or a model update, asks for a tool you never registered.
2. Missing required argument. \`input_schema\` said \`required: ["expression"]\`, but the block's \`input\` dict has no such key.
3. Wrong type. The schema said \`"type": "integer"\` for \`days\`, and you got the string \`"three"\`.

None of these should crash your program, and none should silently do the wrong thing. Each turns into a short, clear error message you send back as the \`tool_result\`, so the model can notice and correct itself on the next turn.

\`\`\`python
def safe_execute(block, tools_registry, schemas):
    name = block["name"]
    if name not in tools_registry:
        return f"error: unknown tool '{name}'"

    schema = schemas[name]["input_schema"]
    args = block["input"]
    for required in schema.get("required", []):
        if required not in args:
            return f"error: missing required argument '{required}'"

    try:
        return str(tools_registry[name](**args))
    except Exception as exc:
        return f"error: tool raised {exc.__class__.__name__}: {exc}"
\`\`\`

That result string, error message and all, goes back through the normal \`tool_result\` message. The model reads \`"error: missing required argument 'city'"\` the same way it reads \`"Sunny, 24C"\`. It is text either way, and a well-behaved model apologizes, fixes its input, and tries again.

## Never eval untrusted text blindly

The calculator's \`eval\` from earlier lessons is a real risk if the "expression" string could ever contain more than arithmetic. Restrict it first by allowing only the characters you expect:

\`\`\`python
import re

def run_calculator(expression):
    if not re.fullmatch(r"[0-9\\.\\s()+\\-*/]+", expression):
        return "error: expression contains disallowed characters"
    return eval(expression, {"__builtins__": {}}, {})
\`\`\`

## Why this matters

An agent that trusts every tool call blindly is one bad model output away from a stack trace in production, or from running an expression that reaches outside the sandbox. Validating before you execute turns a crash into a recoverable error message. The model sees the error and often tries again with corrected input, which beats the whole agent dying in the middle of an answer.

## The mental model to keep

Treat every tool_use block like an unverified form submission from the internet. Check that the tool exists, check the call is complete, check its shape, then run it. The model is usually right, and "usually" is exactly why you check.`,
      starter_code: `# Validate a tool call before executing it, no API call.

TOOLS = {
    "calculator": lambda expression: eval(expression, {"__builtins__": {}}, {}),
    "get_weather": lambda city, days: f"{days}-day forecast for {city}",
}

SCHEMAS = {
    "calculator": {"required": ["expression"]},
    "get_weather": {"required": ["city", "days"]},
}

def safe_execute(name, args):
    # TODO: if name not in TOOLS, return "error: unknown tool '<name>'"
    # TODO: for each required arg in SCHEMAS[name]["required"] missing from
    #       args, return "error: missing required argument '<arg>'" on the
    #       first one found
    # TODO: otherwise call TOOLS[name](**args) and return str(result)
    pass

print(safe_execute("translate", {}))
`,
      solution_code: `# Validate a tool call before executing it, no API call.

TOOLS = {
    "calculator": lambda expression: eval(expression, {"__builtins__": {}}, {}),
    "get_weather": lambda city, days: f"{days}-day forecast for {city}",
}

SCHEMAS = {
    "calculator": {"required": ["expression"]},
    "get_weather": {"required": ["city", "days"]},
}

def safe_execute(name, args):
    if name not in TOOLS:
        return f"error: unknown tool '{name}'"

    for required in SCHEMAS[name]["required"]:
        if required not in args:
            return f"error: missing required argument '{required}'"

    return str(TOOLS[name](**args))

print(safe_execute("translate", {}))
print(safe_execute("get_weather", {"city": "Tokyo"}))
print(safe_execute("get_weather", {"city": "Tokyo", "days": 3}))
print(safe_execute("calculator", {"expression": "6 * 7"}))
`,
      hints: [
        "Check membership in TOOLS first; return the unknown-tool error immediately if it fails.",
        "Loop SCHEMAS[name]['required'] in order and return on the first missing key.",
        "Only call TOOLS[name](**args) once both checks pass, and always str() the result.",
      ],
      challenge_title: "Guard the Tool Call",
      challenge_description:
        "Validate an incoming tool call against a set of known tool schemas: reject unknown tools, missing required arguments, and arguments of the wrong declared type.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def is_int(value):
    try:
        int(value)
        return True
    except ValueError:
        return False

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    t = int(data[idx]); idx += 1
    schemas = {}
    for _ in range(t):
        name, k = data[idx].split(); idx += 1
        k = int(k)
        params = []
        for i in range(k):
            pname, ptype = data[idx].split(); idx += 1
            params.append((pname, ptype))
        schemas[name] = params

    call_name, m = data[idx].split(); idx += 1
    m = int(m)
    call_args = {}
    for i in range(m):
        pname, value = data[idx].split(); idx += 1
        call_args[pname] = value
    # parse done: 'schemas' maps tool name -> list of (param_name, type)
    # pairs in declared order; 'call_name'/'call_args' describe the call.

    # TODO: if call_name not in schemas, print "UNKNOWN_TOOL".
    # TODO: else, in schema param order, find the first param missing from
    #       call_args and print "MISSING <param>".
    # TODO: else, in schema param order, find the first param whose type is
    #       "int" but whose call_args value isn't a valid int, and print
    #       "BAD_TYPE <param>".
    # TODO: else print "OK".

main()
`,
      challenge_solution_code: `import sys

def is_int(value):
    try:
        int(value)
        return True
    except ValueError:
        return False

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    t = int(data[idx]); idx += 1
    schemas = {}
    for _ in range(t):
        name, k = data[idx].split(); idx += 1
        k = int(k)
        params = []
        for i in range(k):
            pname, ptype = data[idx].split(); idx += 1
            params.append((pname, ptype))
        schemas[name] = params

    call_name, m = data[idx].split(); idx += 1
    m = int(m)
    call_args = {}
    for i in range(m):
        pname, value = data[idx].split(); idx += 1
        call_args[pname] = value

    if call_name not in schemas:
        print("UNKNOWN_TOOL")
        return

    params = schemas[call_name]

    for pname, ptype in params:
        if pname not in call_args:
            print(f"MISSING {pname}")
            return

    for pname, ptype in params:
        if ptype == "int" and not is_int(call_args[pname]):
            print(f"BAD_TYPE {pname}")
            return

    print("OK")

main()
`,
      challenge_test_cases: [
        {
          input: "2\ncalculator 1\nexpression str\nweather 2\ncity str\ndays int\ncalculator 1\nexpression 2+2\n",
          expected_output: "OK",
          description: "A valid call to a known tool with its one required string argument.",
        },
        {
          input: "2\ncalculator 1\nexpression str\nweather 2\ncity str\ndays int\nweather 1\ncity Tokyo\n",
          expected_output: "MISSING days",
          description: "The weather call is missing its required 'days' argument.",
        },
        {
          input: "1\ncalculator 1\nexpression str\ntranslate 0\n",
          expected_output: "UNKNOWN_TOOL",
          description: "The tool name isn't in the known schema set at all.",
        },
        {
          input: "1\nweather 2\ncity str\ndays int\nweather 2\ncity Tokyo\ndays abc\n",
          expected_output: "BAD_TYPE days",
          description: "Edge: days is declared int but the value 'abc' can't be parsed as one.",
        },
      ],
    },

    {
      id: "prod-10-7",
      project_id: "prod-10",
      order: 7,
      title: "Stop the Runaway Agent",
      concept: "capping iterations and recovering from tool errors",
      explanation: `A validated tool call still isn't a safe agent. Two failure modes remain, and both are about the loop, not a single call. The loop can run forever, and a tool can raise an exception mid-execution instead of returning a bad result.

## Failure 1: the loop never stops

Nothing in the loop from lesson 5 guarantees the model ever reaches \`stop_reason == "end_turn"\`. A confused model can call tools back to back forever, chasing an answer it never lands on, and every pass costs real tokens and real money. The fix is a hard ceiling:

\`\`\`python
MAX_ITERATIONS = 8

def run_agent(client, tools_schema, tools_registry, user_message):
    messages = [{"role": "user", "content": user_message}]

    for i in range(MAX_ITERATIONS):
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=500,
            tools=tools_schema,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})

        if resp.stop_reason != "tool_use":
            return next(b.text for b in resp.content if b.type == "text")

        block = next(b for b in resp.content if b.type == "tool_use")
        result = safe_execute(block.name, block.input, tools_registry)
        messages.append({
            "role": "user",
            "content": [{"type": "tool_result", "tool_use_id": block.id, "content": result}],
        })

    return "I couldn't finish this in a reasonable number of steps."
\`\`\`

The \`for i in range(MAX_ITERATIONS)\` replaces \`while True\`. If the model still hasn't finished after 8 tool calls, you stop on your own terms with a clear message instead of an unbounded bill.

## Failure 2: the tool itself throws

Lesson 6 caught bad input. But a tool can fail for reasons that have nothing to do with the arguments: a weather API can be down, a network call can time out. \`safe_execute\` should catch exceptions raised during execution, not only reject malformed input beforehand:

\`\`\`python
def safe_execute(name, args, tools_registry):
    try:
        return str(tools_registry[name](**args))
    except Exception as exc:
        return f"error: tool failed ({exc.__class__.__name__}: {exc})"
\`\`\`

That error string flows back as a normal \`tool_result\`. The model sees that the weather tool failed and can apologize, try a different tool, or answer without it, instead of your whole program crashing three tool calls deep into a conversation.

## Why this matters

What you gain here is cost control and reliability at scale, not prettier error messages. An uncapped loop against a paid API is a runaway bill waiting to happen. An unguarded tool call is one flaky dependency away from taking down every conversation that uses it. Both fixes are small, a loop counter and a try/except, and both are the difference between a demo and something you'd trust with real traffic.

## The mental model to keep

Give the agent a leash, \`MAX_ITERATIONS\`, and a helmet, the \`try/except\` around execution. Neither stops it from doing its job. Both stop one bad turn from becoming an unbounded, unrecoverable failure.`,
      starter_code: `# Simulate a capped agent loop with tool-error recovery, no API call.
# Each turn is "TOOL <name>", "ERROR <name>" (tool raised, but is caught),
# or "FINAL <text>".

def run_capped_loop(turns, max_iterations):
    # TODO: process turns one at a time, incrementing an iteration counter
    #       for EVERY turn (TOOL, ERROR, or FINAL) before checking anything.
    # TODO: if the current turn is FINAL, return ("DONE", iterations, text).
    # TODO: otherwise (TOOL or ERROR), if iterations has reached
    #       max_iterations, return ("CAPPED", iterations, None) right away.
    # TODO: if you exhaust all turns with neither condition firing, return
    #       ("NO_FINAL", iterations, None).
    pass

turns = ["TOOL calculator", "ERROR weather", "TOOL search", "FINAL All good"]
print(run_capped_loop(turns, 5))
`,
      solution_code: `# Simulate a capped agent loop with tool-error recovery, no API call.
# Each turn is "TOOL <name>", "ERROR <name>" (tool raised, but is caught),
# or "FINAL <text>".

def run_capped_loop(turns, max_iterations):
    iterations = 0
    for turn in turns:
        iterations += 1
        if turn.startswith("FINAL "):
            return ("DONE", iterations, turn[len("FINAL "):])
        if iterations >= max_iterations:
            return ("CAPPED", iterations, None)
    return ("NO_FINAL", iterations, None)

turns = ["TOOL calculator", "ERROR weather", "TOOL search", "FINAL All good"]
print(run_capped_loop(turns, 5))
print(run_capped_loop(["TOOL a", "TOOL b", "FINAL done"], 2))
print(run_capped_loop(["TOOL a", "ERROR b"], 10))
`,
      hints: [
        "Increment the counter first thing in the loop body, before any branching.",
        "Check FINAL before checking the cap, a FINAL turn on the exact cap iteration still counts as DONE.",
        "If the for loop finishes normally without returning, that's the NO_FINAL case.",
      ],
      challenge_title: "Cap the Runaway Agent",
      challenge_description:
        "Simulate a capped, error-tolerant agent loop: it stops cleanly on a final answer, force-stops once it hits a max-iteration cap, and recovers from tool errors without crashing.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    max_iterations = int(lines[0])
    n = int(lines[1])
    turns = [lines[2 + i] for i in range(n)]
    # parse done: each turn is "TOOL <name>", "ERROR <name>", or "FINAL <text>"

    # TODO: process turns in order. Increment an iteration counter for every
    #       turn processed, THEN check: if this turn is FINAL, print
    #       "DONE <iterations> <text>" and stop.
    # TODO: otherwise (TOOL or ERROR), if iterations has now reached
    #       max_iterations, print "CAPPED <iterations>" and stop, ignoring
    #       any remaining turns.
    # TODO: if you run out of turns without either firing, print "NO_FINAL".

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    max_iterations = int(lines[0])
    n = int(lines[1])
    turns = [lines[2 + i] for i in range(n)]

    iterations = 0
    for turn in turns:
        iterations += 1
        if turn.startswith("FINAL "):
            print(f"DONE {iterations} {turn[len('FINAL '):]}")
            return
        if iterations >= max_iterations:
            print(f"CAPPED {iterations}")
            return

    print("NO_FINAL")

main()
`,
      challenge_test_cases: [
        {
          input: "5\n4\nTOOL calculator\nERROR weather\nTOOL search\nFINAL All good\n",
          expected_output: "DONE 4 All good",
          description: "A tool error is recovered from and the loop still reaches a final answer under the cap.",
        },
        {
          input: "2\n3\nTOOL a\nTOOL b\nFINAL done\n",
          expected_output: "CAPPED 2",
          description: "The cap of 2 is hit on the second turn before the FINAL turn is ever reached.",
        },
        {
          input: "3\n1\nFINAL immediate answer\n",
          expected_output: "DONE 1 immediate answer",
          description: "A final answer on the very first turn still counts as done.",
        },
        {
          input: "10\n2\nTOOL a\nERROR b\n",
          expected_output: "NO_FINAL",
          description: "Edge: the script runs out of turns well under the cap with no final answer ever given.",
        },
      ],
    },

    {
      id: "prod-10-8",
      project_id: "prod-10",
      order: 8,
      title: "Ship the Tool-Using Agent",
      concept: "assembling and shipping the agent",
      explanation: `Every piece is built: schemas, reading a request, execution, routing across tools, the loop, validation, and a hard cap with error recovery. This lesson wires all of it into one script you can run, and finishing it lands the build in your Portfolio.

## The finished shape

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

TOOLS_SCHEMA = [calculator_tool, weather_tool, search_tool]
TOOLS_REGISTRY = {
    "calculator": run_calculator,
    "get_weather": run_weather,
    "web_search": run_search,
}
MAX_ITERATIONS = 8

def run_agent(user_message):
    messages = [{"role": "user", "content": user_message}]

    for _ in range(MAX_ITERATIONS):
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=500,
            tools=TOOLS_SCHEMA,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})

        if resp.stop_reason != "tool_use":
            return next(b.text for b in resp.content if b.type == "text")

        block = next(b for b in resp.content if b.type == "tool_use")
        result = safe_execute(block.name, block.input, TOOLS_REGISTRY)
        messages.append({
            "role": "user",
            "content": [{"type": "tool_result", "tool_use_id": block.id, "content": result}],
        })

    return "Gave up after too many steps."

if __name__ == "__main__":
    question = input("Ask me anything: ")
    print(run_agent(question))
\`\`\`

That's the whole product. Every function it calls is a lesson you already built: \`safe_execute\`, the three \`run_*\` tool implementations, and the three schema dicts.

## What "shipped" means for an agent

Three checks, from the playbook:

1. It runs from a clean start with one command and a real question.
2. Weird input doesn't crash it. An unknown city, a malformed expression, a tool that errors: each comes back as a graceful message, not a stack trace.
3. Someone else could point it at their own API key and use it right away.

## Watching cost on a tool-using agent

Every extra tool call is another full round trip through the API, system prompt and growing history included. \`MAX_ITERATIONS\` is not only a guard against infinite loops. It is a cost ceiling per question. If real usage keeps hitting the cap, that is a sign to raise it deliberately or tighten your tool descriptions so the model needs fewer calls.

## Into your Portfolio

Finishing this lesson records the Tool-Using Agent in your Portfolio tab next to anything else you've shipped. Keep one example question that needed a tool, like a live weather check, and one that needed none, as proof the routing works both ways.

## The mental model to keep

You built a small, capable employee. It knows three things it's allowed to do, it asks before doing them, it reports back honestly when something goes wrong, and it knows when to stop asking and answer. That is all "agent" means here: a loop with good manners around a handful of real functions.`,
      starter_code: `# Assemble the full agent: dispatch table, validation, and a capped loop
# over a scripted conversation, no real API call.

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    return {"Tokyo": "Sunny, 24C", "Paris": "Rainy, 15C"}.get(city, "unknown city")

TOOLS = {"calculator": run_calculator, "get_weather": run_weather}
SCHEMAS = {
    "calculator": {"required": ["expression"]},
    "get_weather": {"required": ["city"]},
}

def safe_execute(name, args):
    if name not in TOOLS:
        return f"error: unknown tool '{name}'"
    for req in SCHEMAS[name]["required"]:
        if req not in args:
            return f"error: missing required argument '{req}'"
    try:
        return str(TOOLS[name](**args))
    except Exception as exc:
        return f"error: {exc}"

script = [
    {"stop_reason": "tool_use", "name": "get_weather", "input": {"city": "Tokyo"}},
    {"stop_reason": "end_turn", "text": "It's sunny and 24C in Tokyo."},
]

def run_agent(script, max_iterations=8):
    # TODO: walk script, capping at max_iterations turns processed.
    #       For a "tool_use" turn, call safe_execute(turn["name"], turn["input"])
    #       and print "  tool ->" plus the result, then continue.
    #       For an "end_turn" turn, return turn["text"] immediately.
    #       If you hit max_iterations first, return "Gave up after too many steps."
    pass

print(run_agent(script))
print("Agent built. Saved to your Portfolio.")
`,
      solution_code: `# Assemble the full agent: dispatch table, validation, and a capped loop
# over a scripted conversation, no real API call.

def run_calculator(expression):
    return eval(expression, {"__builtins__": {}}, {})

def run_weather(city):
    return {"Tokyo": "Sunny, 24C", "Paris": "Rainy, 15C"}.get(city, "unknown city")

TOOLS = {"calculator": run_calculator, "get_weather": run_weather}
SCHEMAS = {
    "calculator": {"required": ["expression"]},
    "get_weather": {"required": ["city"]},
}

def safe_execute(name, args):
    if name not in TOOLS:
        return f"error: unknown tool '{name}'"
    for req in SCHEMAS[name]["required"]:
        if req not in args:
            return f"error: missing required argument '{req}'"
    try:
        return str(TOOLS[name](**args))
    except Exception as exc:
        return f"error: {exc}"

script = [
    {"stop_reason": "tool_use", "name": "get_weather", "input": {"city": "Tokyo"}},
    {"stop_reason": "end_turn", "text": "It's sunny and 24C in Tokyo."},
]

def run_agent(script, max_iterations=8):
    for i, turn in enumerate(script):
        if i >= max_iterations:
            return "Gave up after too many steps."
        if turn["stop_reason"] == "end_turn":
            return turn["text"]
        result = safe_execute(turn["name"], turn["input"])
        print("  tool ->", result)
    return "Gave up after too many steps."

print(run_agent(script))

bad_script = [{"stop_reason": "tool_use", "name": "translate", "input": {}}] * 3
print(run_agent(bad_script, max_iterations=2))

print("Agent built. Saved to your Portfolio.")
`,
      hints: [
        "Enumerate script so you can compare the index against max_iterations before processing each turn.",
        "safe_execute already returns a string for both success and error cases, just print it either way.",
        "On 'end_turn' return turn['text'] right away, don't let the loop keep going past it.",
      ],
      challenge_title: "Agent Run Report",
      challenge_description:
        "Track a full agent run against a token budget: sum costs turn by turn, stop early if the budget is blown, and report whether the run shipped a final answer.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    budget = int(lines[0])
    n = int(lines[1])
    turns = []
    for i in range(n):
        parts = lines[2 + i].split()
        name, cost, is_final = parts[0], int(parts[1]), int(parts[2])
        turns.append((name, cost, is_final))
    # parse done: 'turns' is a list of (name, cost, is_final) in order,
    # is_final is 1 for the turn that produced the final answer, else 0.

    # TODO: walk turns in order, keeping a running total of cost. Add each
    #       turn's cost to the running total BEFORE checking anything.
    # TODO: if the running total exceeds budget, print "OVER_BUDGET" and the
    #       1-based index of the turn where it happened, then stop.
    # TODO: if a turn has is_final == 1 and the budget wasn't exceeded,
    #       print "SHIPPED", then the count of non-final tool turns seen so
    #       far, then the running total, then stop.
    # TODO: if you finish all turns with no final turn and no overage,
    #       print "INCOMPLETE" then the running total.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    budget = int(lines[0])
    n = int(lines[1])
    turns = []
    for i in range(n):
        parts = lines[2 + i].split()
        name, cost, is_final = parts[0], int(parts[1]), int(parts[2])
        turns.append((name, cost, is_final))

    running_total = 0
    tool_calls = 0
    for idx, (name, cost, is_final) in enumerate(turns, start=1):
        running_total += cost
        if running_total > budget:
            print("OVER_BUDGET")
            print(idx)
            return
        if is_final == 1:
            print("SHIPPED")
            print(tool_calls)
            print(running_total)
            return
        tool_calls += 1

    print("INCOMPLETE")
    print(running_total)

main()
`,
      challenge_test_cases: [
        {
          input: "100\n3\ncalculator 20 0\nweather 30 0\nFINAL 10 1\n",
          expected_output: "SHIPPED\n2\n60",
          description: "Two tool calls run under budget before the final turn ships the answer.",
        },
        {
          input: "40\n2\ncalculator 20 0\nweather 30 0\n",
          expected_output: "OVER_BUDGET\n2",
          description: "The second turn pushes the running total past the 40-token budget.",
        },
        {
          input: "1000\n2\nsearch 5 0\nsearch 5 0\n",
          expected_output: "INCOMPLETE\n10",
          description: "The run finishes all turns without ever reaching a final answer.",
        },
        {
          input: "5\n1\nFINAL 5 1\n",
          expected_output: "SHIPPED\n0\n5",
          description: "Edge: a run that ships on the very first turn, exactly at the budget limit.",
        },
      ],
    },
  ],
};
