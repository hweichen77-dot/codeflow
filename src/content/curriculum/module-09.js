export default {
  project: {
    id: "ai-09",
    title: "AI Agents & Tool Use",
    description: "Go beyond chat: learn how language models call tools, loop through reasoning and action, plan multi-step tasks, and where agents break so you can build them safely.",
    difficulty: "intermediate",
    category: "chatbots_agents",
    estimated_time: 55,
    lessons_count: 8,
    tags: ["agents", "tool-use", "react", "planning", "guardrails"],
    order: 13,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-09-l1",
      project_id: "ai-09",
      order: 1,
      title: "What Is an Agent?",
      concept: "Agents",
      xp_reward: 10,
      explanation: `Ask a plain chatbot "what's the weather in Tokyo right now?" and it will confidently invent a number. Ask an **agent** the same thing and it will pause, call a weather API, read the real answer, and tell you. Same model underneath. The difference is that the agent is allowed to *do things*, not just talk.

## What it is

An **agent** is a language model wrapped in a loop that lets it take actions in the world and react to the results. A plain LLM is a one-shot function: text in, text out, done. An agent adds three pieces around that function — a set of **tools** it can call, a **loop** that runs until the job is finished, and **memory** of what it has done so far.

The crucial shift: a chatbot only ever produces text. An agent produces text *and* decisions about which tool to run next. It can fetch a webpage, query a database, run code, or send an email, then feed the result back to itself and keep going.

## How it works

Every agent cycles through the same four moves:

1. **Observe.** It reads the current state — your goal plus everything that has happened so far.
2. **Decide.** It predicts the next action: either call a tool, or produce a final answer.
3. **Act.** If it chose a tool, the surrounding program actually runs that tool and captures the result.
4. **Loop.** The result is appended to the agent's context, and it observes again — until it decides it is done.

The model itself never runs the tool. It only *requests* it. A piece of ordinary code — the **agent runtime** — executes the request and hands back the output. Here is the skeleton:

\`\`\`python
goal = "Find today's USD to EUR rate"
history = [goal]
while True:
    step = model.decide(history)      # text OR a tool request
    if step.is_final:
        break
    result = run_tool(step.tool, step.args)  # real code runs it
    history.append(result)            # feed the result back in
print(step.answer)
\`\`\`

## Why it matters

Agents close the two biggest gaps in plain LLMs:

- **They can act on fresh, real data.** Instead of guessing from frozen training memory, an agent looks things up. The weather question stops being a hallucination and becomes a lookup.
- **They can chain steps.** "Book me a table near the office for Friday" is many actions: find the office, search restaurants, check availability, reserve. A loop handles that; a single prediction cannot.
- **They cost more and fail in new ways.** Each loop is another model call, so agents are slower and pricier. And because they take real actions, a wrong decision can do real damage, not just produce a wrong sentence.

## The mental model to keep

A plain LLM is a brain in a jar that can only talk. An **agent is that same brain given hands and a to-do list** — it can reach out, touch the world, see what happened, and try again.`,
      key_terms: [
        { term: "Agent", definition: "A language model wrapped in a loop that can call tools, observe results, and keep acting until a goal is met." },
        { term: "Tool", definition: "A function the agent can request — a web search, calculator, database query — that runs outside the model." },
        { term: "Agent runtime", definition: "The ordinary code around the model that executes its tool requests and feeds results back in." },
        { term: "Loop", definition: "The repeat cycle of observe-decide-act that separates an agent from a single prediction." }
      ],
      callouts: [
        { type: "analogy", title: "A brain with hands", content: "A chatbot is a brain in a jar that can only talk. An agent is the same brain given hands and a to-do list: it can reach out, do something, see the result, and decide what to do next.", position: "before" },
        { type: "warning", title: "Actions are real", content: "When an agent 'acts,' actual code runs — an email gets sent, a row gets deleted. A wrong answer from a chatbot is annoying; a wrong action from an agent can be expensive.", position: "after" }
      ],
      concept_diagram: {
        title: "The agent loop, one pass",
        steps: [
          { label: "Observe", desc: "Read the goal plus everything done so far." },
          { label: "Decide", desc: "Predict the next move: call a tool or answer." },
          { label: "Act", desc: "The runtime runs the chosen tool and captures output." },
          { label: "Loop or finish", desc: "Feed the result back in, or stop with the answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the core difference between a plain chatbot and an agent?",
          options: ["The agent uses a bigger model", "The agent can take actions and react to results in a loop", "The agent never makes mistakes"],
          correct_index: 1,
          explanation: "An agent wraps the model in a loop that lets it call tools, see results, and keep going. A chatbot only produces text."
        }
      ],
      quiz_questions: [
        {
          question: "In an agent, who actually executes a tool the model asks for?",
          options: [
            "The language model runs it internally",
            "The agent runtime — ordinary code around the model — runs it",
            "The user copies and runs it by hand",
            "No one; the model only pretends to call tools"
          ],
          correct_index: 1,
          explanation: "The model only requests a tool. The surrounding runtime code executes it and feeds the result back."
        },
        {
          question: "Why can an agent answer 'what is the weather right now?' correctly when a plain LLM cannot?",
          options: [
            "Agents are trained on more recent data",
            "An agent can call a live weather tool instead of guessing from frozen memory",
            "Agents have a built-in fact-checker",
            "The agent asks the user for the answer"
          ],
          correct_index: 1,
          explanation: "The agent fetches real, fresh data through a tool rather than predicting it from stale training memory."
        },
        {
          question: "Which is a genuine downside of agents compared to a single LLM call?",
          options: [
            "They can never use fresh data",
            "Each loop is another model call, so they are slower and more expensive",
            "They cannot produce a final answer",
            "They are unable to call any tools"
          ],
          correct_index: 1,
          explanation: "Every iteration of the loop is a fresh model call, raising cost and latency, and real actions add real risk."
        }
      ],
      participation_activities: [
        {
          activity_title: "Agent vs chatbot",
          questions: [
            { question: "An agent can take real actions, like sending an email, not just produce text.", type: "true_false", correct_answer: "true", explanation: "The defining feature of an agent is acting on the world through tools, then reacting to the results." },
            { question: "The repeating cycle of observe-decide-act that turns an LLM into an agent is called a ______.", type: "fill_in", correct_answer: "loop", explanation: "The loop is what lets the model keep going until the goal is met." }
          ]
        }
      ],
      starter_code: `# A tiny agent loop. The "model" is faked, but the loop structure is real.
goal = "double the number 21"

def fake_model_decide(history):
    # Decide the next step based on what's happened.
    if "result:" not in " ".join(history):
        return ("tool", "double", 21)   # ask to call the 'double' tool
    return ("final", "answer", None)

def run_tool(name, arg):
    if name == "double":
        return arg * 2

history = [goal]
# TODO: loop: decide a step; if it's a tool call, run it and append "result: X".
#       Stop when the decision is "final", then print the last result.
print("goal:", goal)
`,
      solution_code: `goal = "double the number 21"

def fake_model_decide(history):
    if "result:" not in " ".join(history):
        return ("tool", "double", 21)
    return ("final", "answer", None)

def run_tool(name, arg):
    if name == "double":
        return arg * 2

history = [goal]
print("goal:", goal)
last_result = None
while True:
    kind, name, arg = fake_model_decide(history)
    if kind == "final":
        break
    last_result = run_tool(name, arg)
    history.append("result: " + str(last_result))
    print("ran tool", name, "->", last_result)
print("final answer:", last_result)
`,
      expected_output: `goal: double the number 21
ran tool double -> 42
final answer: 42`,
      step_throughs: [
        {
          title: "one trip around the agent loop",
          steps: [
            { label: "Observe the state", detail: "The agent reads the goal and the history so far. On the first pass, history is just the goal.", code: 'history = ["What is the USD to EUR rate?"]' },
            { label: "Decide a move", detail: "The model predicts the next action. It can't know live rates, so it requests a tool instead of answering.", code: 'decision = call_tool("get_fx", {"pair": "USD/EUR"})' },
            { label: "The runtime acts", detail: "Ordinary code, not the model, actually runs the tool and captures the real result.", code: 'result = get_fx("USD/EUR")  # -> 0.92' },
            { label: "Loop with the result", detail: "The result is appended to history and the agent observes again. Now it has enough to give a final answer.", code: 'history.append("rate = 0.92")  ->  final: "1 USD = 0.92 EUR"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You ask an agent "what is 4821 times 79?" and it returns the exact answer instantly. How did it likely get it right when LLMs are bad at arithmetic?',
          steps: [
            "Plain LLMs predict digits as text and often miscalculate large products.",
            "An agent can recognize this is a math task and call a calculator tool instead.",
            "The runtime runs real arithmetic and feeds the exact result back to the agent."
          ],
          output: "It called a calculator tool rather than predicting the digits itself."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A teammate says "let\'s just put everything the agent might need into one giant prompt so it never has to use tools." Why is that usually worse than giving it tools?',
          steps: [
            "Stuffing everything in means guessing in advance exactly what the task will need, which you rarely can.",
            "Live or changing data (prices, weather, a database row) goes stale the instant the prompt is written.",
            "The context window is finite, so a giant static prompt crowds out room and raises cost on every call.",
            "Tools let the agent fetch only what it needs, when it needs it, with fresh data — smaller prompts, fewer guesses."
          ],
          output: "Tools fetch fresh, targeted data on demand; a giant static prompt is stale, bloated, and guesses needs up front."
        }
      ],
      comparison_tables: [
        {
          title: "plain LLM vs agent",
          columns: ["Aspect", "Plain LLM", "Agent"],
          rows: [
            { cells: ["Output", "Text only", "Text plus tool actions"] },
            { cells: ["Number of model calls", "One per request", "One per loop step"] },
            { cells: ["Access to fresh data", "None — frozen memory", "Yes, via tools"] },
            { cells: ["Main capability", "Answer in one shot", "Chain multiple real actions to a goal"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "is this a plain LLM or an agent?",
          bins: [
            { id: "llm", label: "Plain LLM" },
            { id: "agent", label: "Agent" }
          ],
          items: [
            { id: "i1", text: "Answers from training memory in one shot", bin: "llm" },
            { id: "i2", text: "Calls a weather API then reports the result", bin: "agent" },
            { id: "i3", text: "Runs an observe-decide-act loop until done", bin: "agent" },
            { id: "i4", text: "Produces only text, never an action", bin: "llm" },
            { id: "i5", text: "Books a table by chaining several steps", bin: "agent" },
            { id: "i6", text: "Cannot fetch live data on its own", bin: "llm" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: what does wrapping an LLM in a loop with tools let it do that a single LLM call cannot?",
          sampleAnswer: "A single call can only turn the prompt into one block of text using frozen knowledge. Wrapping it in a loop with tools lets the model take an action, see the real result, and decide what to do next — so it can fetch fresh data and chain many steps together instead of guessing everything at once."
        }
      ],
      hints: [
        "Use a while True loop and break when the decision kind is 'final'.",
        "When the decision is a tool call, pass the name and arg to run_tool().",
        "Append 'result: ' plus the value to history so the next decision sees it."
      ],
      challenge_title: "The Tool Dispatcher",
      challenge_description: "Register the agent's tools, then run a batch of tool calls and print each result.",
      challenge_story: "You're building the runtime for a customer-support agent. The model never runs anything itself — it only *names* a tool and hands you an argument. Your dispatcher owns the real table of tools: each one is a tiny operation (\`add\`, \`mul\`, or \`sub\`) bound to a fixed constant. The model then fires off a queue of calls, and your job is to execute each one against the registered tools and report the result. If the model hallucinates a tool you never registered, you must refuse it safely instead of crashing the whole loop.",
      challenge_statement: "First read **N** tool definitions. Each defines a tool by `name`, an operation (`add`, `mul`, or `sub`), and an integer `constant`.\n\n- `add`  → result = `arg + constant`\n- `mul`  → result = `arg * constant`\n- `sub`  → result = `arg - constant`\n\nThen read **Q** tool calls, each a `name` and an integer `arg`. For each call, run the matching registered tool and print its result on its own line. If the call names a tool that was **not** registered, print `ERROR` for that call instead.",
      challenge_input_format: "Line 1: integer `N`, the number of tool definitions.\nNext `N` lines: `name op constant` (op is one of `add`, `mul`, `sub`).\nNext line: integer `Q`, the number of calls.\nNext `Q` lines: `name arg`.",
      challenge_output_format: "Exactly `Q` lines. For each call in order, print the integer result, or `ERROR` if the tool is not registered.",
      challenge_constraints: [
        "1 ≤ N ≤ 100",
        "1 ≤ Q ≤ 1000",
        "-1000000 ≤ constant, arg ≤ 1000000",
        "Tool names are lowercase letters, length 1–20, and unique",
      ],
      challenge_examples: [
        { input: "3\ndouble mul 2\nincrement add 1\nshift sub 5\n4\ndouble 10\nincrement 41\nshift 5\nsquare 9", output: "20\n42\n0\nERROR", explanation: "double=10*2=20, increment=41+1=42, shift=5-5=0, and `square` was never registered so it is ERROR." },
        { input: "1\ndouble mul 2\n2\ndouble 0\nghost 7", output: "0\nERROR", explanation: "double=0*2=0; `ghost` is unknown." },
      ],
      challenge_notes: "The model only requests tools; the runtime (your code) is the only thing that actually executes them. Always validate the requested name against the registry before running — a real agent must survive a model that asks for tools that don't exist.",
      challenge_hints: [
        "Store the tools in a dict: `tools[name] = (op, constant)`.",
        "Read all N definitions before you start processing calls.",
        "For an unknown name, print `ERROR` and continue to the next call — never raise.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    tools = {}
    # TODO: read n tool definitions into tools[name] = (op, constant)

    q = int(data[idx].strip()); idx += 1
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        arg = int(parts[1])
        # TODO: if name not registered -> "ERROR"; else apply add/mul/sub
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    tools = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        op = parts[1]
        const = int(parts[2])
        tools[name] = (op, const)
    q = int(data[idx].strip()); idx += 1
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        arg = int(parts[1])
        if name not in tools:
            out.append("ERROR")
            continue
        op, const = tools[name]
        if op == "add":
            res = arg + const
        elif op == "mul":
            res = arg * const
        elif op == "sub":
            res = arg - const
        else:
            out.append("ERROR")
            continue
        out.append(str(res))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\ndouble mul 2\nincrement add 1\nshift sub 5\n4\ndouble 10\nincrement 41\nshift 5\nsquare 9", expected_output: "20\n42\n0\nERROR", description: "Three valid tool calls plus one unregistered tool." },
        { input: "1\ndouble mul 2\n2\ndouble 0\nghost 7", expected_output: "0\nERROR", description: "Unknown tool name must yield ERROR, not a crash." },
        { input: "2\nadd1 add 1\nmul3 mul 3\n3\nadd1 -5\nmul3 -2\nadd1 0", expected_output: "-4\n-6\n1", description: "Negative args and constants handled correctly." }
      ]
    },
    {
      id: "ai-09-l2",
      project_id: "ai-09",
      order: 2,
      title: "Tool & Function Calling",
      concept: "Tools",
      xp_reward: 10,
      explanation: `The breakthrough that made agents practical sounds almost boring: teach the model to fill out a form. Instead of the model running code, it returns a small structured object that says "call the function get_weather with city=Tokyo." Your code reads that object and runs the real function. This pattern is called **function calling** (or **tool use**), and it is the plumbing under every agent.

## What it is

A **tool** is just a function you make available to the model — a calculator, a web search, a database query. To use it, you describe the tool to the model: its **name**, what it does, and the **parameters** it takes. When the model decides the tool is needed, it does not run it. It emits a structured request naming the tool and its arguments, usually as **JSON**.

The model's only new skill is *deciding when* to call a tool and *filling in the arguments correctly*. The actual execution is plain code you control.

## How it works

The cycle has four clear stages:

1. **Describe** the tools to the model (a schema: name, description, parameters).
2. The model **requests** a tool by returning a structured call, not prose.
3. Your code **executes** the real function with those arguments.
4. You **return** the result back to the model so it can continue or answer.

A tool request the model emits looks like this — note it is data, not a finished sentence:

\`\`\`python
# what the model returns (it does NOT run anything itself)
tool_call = {
    "name": "get_weather",
    "arguments": {"city": "Tokyo", "units": "celsius"}
}
# your code reads it and runs the real function:
result = get_weather(**tool_call["arguments"])   # -> {"temp_c": 18}
\`\`\`

The model never sees the inside of \`get_weather\`. It only knows the tool exists, what it is for, and what arguments it needs. This clean separation is what makes tools safe to wire up: you decide exactly what each function is allowed to do.

## Why it matters

Function calling is what lets a "text predictor" reach into the real world reliably:

- **Structure beats free text.** Because the model returns machine-readable JSON, your code can parse it deterministically instead of guessing from prose.
- **You stay in control.** You write every tool. The model can only request the actions you chose to expose, with arguments you can validate before running.
- **Good descriptions are everything.** The model picks tools based on your written descriptions. A vague description ("does stuff with data") leads to wrong or missed calls. A precise one ("returns current weather for a given city") leads to correct ones.

## The mental model to keep

The model is a smart dispatcher filling out request forms. **You build the tools and check the forms; the model just decides which form to fill and what to write on it.**`,
      key_terms: [
        { term: "Tool / function calling", definition: "The pattern where a model returns a structured request to run a named function with arguments, instead of running it itself." },
        { term: "Tool schema", definition: "The description you give the model: the tool's name, purpose, and parameters." },
        { term: "Arguments", definition: "The specific values the model fills in for a tool's parameters, usually as JSON." },
        { term: "Tool result", definition: "The output your code returns to the model after running the requested function." }
      ],
      callouts: [
        { type: "analogy", title: "Filling out a request form", content: "The model is a clerk who can't touch the machinery. It fills out a form — 'run get_weather, city=Tokyo' — and hands it to you. You run the machine and bring back the result.", position: "before" },
        { type: "tip", title: "Write descriptions like API docs", content: "The model chooses tools from your descriptions alone. Be specific about what each tool does and when to use it, exactly like good function documentation.", position: "after" }
      ],
      concept_diagram: {
        title: "The function-calling round trip",
        steps: [
          { label: "Describe tools", desc: "Give the model each tool's name, purpose, and parameters." },
          { label: "Model requests", desc: "It returns a structured call: tool name plus arguments." },
          { label: "Your code runs it", desc: "You execute the real function with those arguments." },
          { label: "Return the result", desc: "Feed the output back so the model can continue." }
        ]
      },
      inline_quizzes: [
        {
          question: "When a model 'calls a tool,' what does it actually produce?",
          options: ["It runs the function and returns the output", "A structured request naming the tool and its arguments", "A plain English description of what to do"],
          correct_index: 1,
          explanation: "The model emits a structured tool request (usually JSON). Your own code runs the real function."
        }
      ],
      quiz_questions: [
        {
          question: "Why is it useful that tool calls come back as structured JSON rather than prose?",
          options: [
            "JSON is shorter than English",
            "Your code can parse it deterministically instead of guessing from free text",
            "Models can only output JSON",
            "It hides the tool from the user"
          ],
          correct_index: 1,
          explanation: "Structured output lets your runtime reliably extract the tool name and arguments and run the right function."
        },
        {
          question: "What most directly determines whether a model picks the right tool?",
          options: [
            "The color of the tool icon",
            "The quality of the tool's name and description you provide",
            "How many tokens are in the prompt",
            "The order tools appear in memory"
          ],
          correct_index: 1,
          explanation: "The model selects tools from your written descriptions, so clear, specific descriptions drive correct selection."
        },
        {
          question: "Who controls what a tool is actually allowed to do?",
          options: [
            "The model decides at runtime",
            "You do — you write each tool's code and can validate its arguments",
            "The user types the function body",
            "The tool schema runs itself"
          ],
          correct_index: 1,
          explanation: "You author every tool and can validate arguments before running, so the model can only request actions you exposed."
        }
      ],
      participation_activities: [
        {
          activity_title: "Function-calling check",
          questions: [
            { question: "When a model calls a tool, the model itself executes the function's code.", type: "true_false", correct_answer: "false", explanation: "The model only emits a request; your runtime code executes the real function." },
            { question: "The description you give the model of a tool's name, purpose, and parameters is called its ______.", type: "fill_in", correct_answer: "schema", explanation: "The tool schema tells the model what the tool is and how to call it." }
          ]
        }
      ],
      starter_code: `# Simulate function calling: the model returns a request; your code runs the tool.
import json

# The "tool" the model can request.
def get_weather(city, units="celsius"):
    fake = {"Tokyo": 18, "Cairo": 33}
    return {"city": city, "temp": fake.get(city, 0), "units": units}

# What the model returned (a structured call, not a finished answer):
tool_call = '{"name": "get_weather", "arguments": {"city": "Tokyo"}}'

# TODO: parse the JSON, run the matching tool with its arguments, print the result.
call = json.loads(tool_call)
print("model asked for:", call["name"])
`,
      solution_code: `import json

def get_weather(city, units="celsius"):
    fake = {"Tokyo": 18, "Cairo": 33}
    return {"city": city, "temp": fake.get(city, 0), "units": units}

tool_call = '{"name": "get_weather", "arguments": {"city": "Tokyo"}}'

call = json.loads(tool_call)
print("model asked for:", call["name"])
if call["name"] == "get_weather":
    result = get_weather(**call["arguments"])
    print("tool result:", result)
`,
      expected_output: `model asked for: get_weather
tool result: {'city': 'Tokyo', 'temp': 18, 'units': 'celsius'}`,
      step_throughs: [
        {
          title: "from question to tool result",
          steps: [
            { label: "Describe the tool", detail: "You tell the model a tool exists, what it does, and its parameters. The model now knows it can ask for it.", code: 'tools = [{"name": "get_weather", "params": ["city"]}]' },
            { label: "Model emits a request", detail: "Given 'weather in Tokyo?', the model returns a structured call — data, not prose. It does not run anything.", code: '{"name": "get_weather", "arguments": {"city": "Tokyo"}}' },
            { label: "Your runtime executes", detail: "Your code parses the request, validates it, and runs the real function with the given arguments.", code: 'result = get_weather(city="Tokyo")  # -> {"temp": 18}' },
            { label: "Return the result", detail: "The result is fed back to the model, which now writes a normal answer using the real data.", code: '"It is 18 C in Tokyo right now."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model is given a get_time tool and asked "what time is it?" What should it return?',
          steps: [
            "The model recognizes it cannot know the current time from frozen memory.",
            "It matches the request to the get_time tool you described.",
            "It emits a structured call for that tool instead of guessing a time."
          ],
          output: '{"name": "get_time", "arguments": {}}'
        },
        {
          number: 2, difficulty: "hard",
          prompt: 'You expose two tools: search_docs(query) and send_email(to, body). A user says "email the on-call engineer a summary of last night\'s outage." Walk through how function calling handles this safely.',
          steps: [
            "The model can't email from memory, so it first calls search_docs to gather facts about the outage.",
            "Your runtime runs search_docs and returns the retrieved text to the model.",
            "Now the model has content and emits a send_email call with structured 'to' and 'body' arguments.",
            "Before running send_email, your code validates the arguments — for example, confirming 'to' is an allowed address — because you control execution, not the model.",
            "Only after validation does your runtime actually send, then it returns a confirmation to the model."
          ],
          output: "The model chains search_docs then send_email; your runtime validates the email arguments before actually sending, keeping control."
        }
      ],
      comparison_tables: [
        {
          title: "free-text answer vs function calling",
          columns: ["Aspect", "Plain text answer", "Function calling"],
          rows: [
            { cells: ["Format returned", "Prose you must parse", "Structured JSON request"] },
            { cells: ["Who runs the action", "No action is taken", "Your code runs the real function"] },
            { cells: ["Reliability of parsing", "Fragile, guess-based", "Deterministic field access"] },
            { cells: ["Control over what runs", "None", "You author and validate every tool"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "model's job vs your code's job",
          bins: [
            { id: "model", label: "The model does this" },
            { id: "code", label: "Your code does this" }
          ],
          items: [
            { id: "i1", text: "Decides which tool is needed", bin: "model" },
            { id: "i2", text: "Fills in the argument values", bin: "model" },
            { id: "i3", text: "Actually runs the function", bin: "code" },
            { id: "i4", text: "Validates the arguments before running", bin: "code" },
            { id: "i5", text: "Returns the result to continue", bin: "code" },
            { id: "i6", text: "Chooses based on tool descriptions", bin: "model" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is it safer to let a model request tool calls than to let it run code directly?",
          sampleAnswer: "Because the model only fills out a structured request and never executes anything, your own code stays in the middle. You write each tool, decide exactly what it can do, and validate the arguments before running, so the model can only trigger actions you chose to expose rather than running arbitrary code."
        }
      ],
      hints: [
        "Use json.loads() to turn the tool_call string into a dict.",
        "Check call['name'] to find which tool to run.",
        "Use **call['arguments'] to unpack the arguments into the function."
      ],
      challenge_title: "The Tool Router",
      challenge_description: "Route a stream of model-emitted tool calls to the right function and tally the running total.",
      challenge_story: "Your data-analysis agent answers questions by emitting tool calls — the model picks the tool and fills in two numeric arguments, but it's *your* router that actually executes them. Today the agent is crunching a spreadsheet, firing off a sequence of arithmetic tool calls (`add`, `subtract`, `multiply`, `max`). You must dispatch each call to the correct operation, print every intermediate result, and keep a running sum of all results so the agent can report one final aggregate. And because language models drift, an occasional call names a tool you don't support — you must flag it without derailing the rest of the run.",
      challenge_statement: "Read **N** tool calls. Each call is a tool `name` followed by two integers `a` and `b`. Execute each call:\n\n- `add` → `a + b`\n- `subtract` → `a - b`\n- `multiply` → `a * b`\n- `max` → the larger of `a` and `b` (if equal, that value)\n\nFor each call, print the integer result on its own line. If the tool name is none of the four above, print `UNKNOWN_TOOL` for that call and **do not** add anything to the running total. After all calls, print `TOTAL` followed by the sum of every successful result.",
      challenge_input_format: "Line 1: integer `N`.\nNext `N` lines: `name a b`.",
      challenge_output_format: "`N` lines, one per call (the integer result, or `UNKNOWN_TOOL`), followed by one final line `TOTAL X` where X is the sum of all successful results.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "-1000000 ≤ a, b ≤ 1000000",
        "Tool names are lowercase letters",
      ],
      challenge_examples: [
        { input: "3\nadd 3 4\nmultiply 5 6\nsubtract 10 7", output: "7\n30\n3\nTOTAL 40", explanation: "7 + 30 + 3 = 40." },
        { input: "1\ndivide 8 2", output: "UNKNOWN_TOOL\nTOTAL 0", explanation: "`divide` is not a supported tool, so nothing is added and the total stays 0." },
      ],
      challenge_notes: "This is the core of tool use: the model decides *which* tool and *what* arguments; your code owns the dispatch table and the execution. Skipping unsupported tools (rather than crashing) is exactly how production agents stay robust against an unpredictable model.",
      challenge_hints: [
        "Use if/elif on `name` to choose the operation.",
        "Only add to `total` when the call actually succeeds.",
        "Collect output lines in a list and join with newlines at the end.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    total = 0
    out = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        a = int(parts[1]); b = int(parts[2])
        # TODO: route to add/subtract/multiply/max, else UNKNOWN_TOOL
        # add successful results to total
    out.append("TOTAL " + str(total))
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    total = 0
    out = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        a = int(parts[1]); b = int(parts[2])
        if name == "add":
            res = a + b
        elif name == "multiply":
            res = a * b
        elif name == "subtract":
            res = a - b
        elif name == "max":
            res = a if a >= b else b
        else:
            out.append("UNKNOWN_TOOL")
            continue
        total += res
        out.append(str(res))
    out.append("TOTAL " + str(total))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\nadd 3 4\nmultiply 5 6\nsubtract 10 7", expected_output: "7\n30\n3\nTOTAL 40", description: "Three routed tools and their summed total." },
        { input: "1\ndivide 8 2", expected_output: "UNKNOWN_TOOL\nTOTAL 0", description: "Unsupported tool is flagged and excluded from the total." },
        { input: "2\nmax -3 -8\nadd -5 5", expected_output: "-3\n0\nTOTAL -3", description: "max of two negatives and a zero-sum add." }
      ]
    },
    {
      id: "ai-09-l3",
      project_id: "ai-09",
      order: 3,
      title: "The Reason-Act Loop",
      concept: "ReAct",
      xp_reward: 10,
      explanation: `If you ask an agent to "find the population of the third-largest city in France," a naive setup just calls one tool and hopes. The reliable agents do something smarter: they think out loud first. "France's largest cities are Paris, Marseille, Lyon. The third is Lyon. Now I'll look up Lyon's population." Reason, then act, then read the result, then reason again. This pattern has a name: **ReAct**, short for **Reason + Act**.

## What it is

**ReAct** interleaves two kinds of steps. A **Thought** is the model reasoning in plain language about what to do next. An **Action** is a tool call. After each action, the runtime returns an **Observation** — the tool's result — and the cycle repeats. The full trace reads as a chain: Thought, Action, Observation, Thought, Action, Observation, until the model decides it has enough and writes the final answer.

The key insight is that *forcing the model to reason before acting* dramatically improves which tool it picks and which arguments it uses. The thought is not decoration; it is the planning that makes the next action correct.

## How it works

One ReAct iteration looks like this:

1. **Thought.** The model writes a short reasoning step about the current situation and what is missing.
2. **Action.** Based on that thought, it emits a tool call.
3. **Observation.** The runtime runs the tool and returns the result, which is appended to the trace.
4. **Repeat or answer.** The model reads the observation and either reasons toward the next action or produces the final answer.

A trace looks like this — notice how each thought sets up the next action:

\`\`\`text
Thought: I need the third-largest city in France first.
Action: search("largest cities in France")
Observation: Paris, Marseille, Lyon, Toulouse...
Thought: Third is Lyon. Now get Lyon's population.
Action: search("population of Lyon")
Observation: about 520,000
Thought: I have the answer.
Answer: Lyon, about 520,000 people.
\`\`\`

Without the thoughts, the model might call \`search("population of the third-largest city in France")\` directly and get nothing useful, because no single page is phrased that way. Reasoning splits the problem into searchable pieces.

## Why it matters

ReAct is the workhorse pattern for building dependable agents:

- **Better decisions.** Reasoning before acting cuts down on wrong tools and malformed arguments. The thought catches mistakes before they cost a tool call.
- **It self-corrects.** When an observation is empty or surprising, the next thought can notice and try a different approach — an agent that just acts blindly cannot.
- **It is debuggable.** The thought trace is a readable log of *why* the agent did each thing, which is gold when something goes wrong.

The cost: more model calls (every thought is generated text) and longer traces that eat context. ReAct trades tokens for reliability.

## The mental model to keep

Don't let the agent act on reflex. **Make it narrate a plan, take one step, look at what happened, then re-plan.** Thought, action, observation, repeat — that rhythm is what turns a tool-caller into a problem-solver.`,
      key_terms: [
        { term: "ReAct", definition: "An agent pattern that interleaves reasoning steps (Thought) with tool calls (Action) and their results (Observation)." },
        { term: "Thought", definition: "A plain-language reasoning step the model writes before deciding its next action." },
        { term: "Action", definition: "A tool call the agent makes, chosen based on the preceding thought." },
        { term: "Observation", definition: "The result of an action, returned by the runtime and fed back into the agent's reasoning." }
      ],
      callouts: [
        { type: "insight", title: "Thinking out loud makes it smarter", content: "Forcing the model to write a thought before acting isn't decoration — it's the planning step. It catches the wrong tool or bad arguments before a single action runs.", position: "before" },
        { type: "tip", title: "The trace is your debugger", content: "When an agent misbehaves, read its Thought-Action-Observation trace. It shows exactly where the reasoning or a tool result went sideways.", position: "after" }
      ],
      concept_diagram: {
        title: "One ReAct iteration",
        steps: [
          { label: "Thought", desc: "Reason about what is missing and what to do next." },
          { label: "Action", desc: "Emit a tool call based on that reasoning." },
          { label: "Observation", desc: "Runtime returns the tool's result into the trace." },
          { label: "Repeat or answer", desc: "Reason again toward the next step, or finish." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does the 'Re' and 'Act' in ReAct stand for?",
          options: ["Retry and Activate", "Reason and Act", "Reduce and Accept"],
          correct_index: 1,
          explanation: "ReAct interleaves Reasoning (Thought) steps with Acting (tool calls)."
        }
      ],
      quiz_questions: [
        {
          question: "In a ReAct trace, what is an 'Observation'?",
          options: [
            "The model's reasoning about what to do",
            "The result of an action, returned by the runtime",
            "The final answer to the user",
            "A description of an available tool"
          ],
          correct_index: 1,
          explanation: "An observation is the tool's output, fed back so the model can reason about its next step."
        },
        {
          question: "Why does adding a Thought step before each Action improve an agent?",
          options: [
            "It makes the response shorter",
            "Reasoning first leads to better tool choices and arguments, catching mistakes early",
            "It removes the need for tools",
            "It hides the agent's steps from the user"
          ],
          correct_index: 1,
          explanation: "The thought is the planning that makes the next action correct, reducing wrong tools and bad arguments."
        },
        {
          question: "What is a real cost of using ReAct instead of a single tool call?",
          options: [
            "The agent can no longer use tools",
            "More model calls and longer traces that consume context",
            "It cannot produce a final answer",
            "It can only handle one tool total"
          ],
          correct_index: 1,
          explanation: "Each thought is generated text, so ReAct trades extra tokens and calls for higher reliability."
        }
      ],
      participation_activities: [
        {
          activity_title: "ReAct check",
          questions: [
            { question: "In ReAct, the model writes a reasoning step before deciding which tool to call.", type: "true_false", correct_answer: "true", explanation: "The Thought comes before the Action and guides which tool and arguments to use." },
            { question: "The tool result that gets fed back into the agent's reasoning is called the ______.", type: "fill_in", correct_answer: "observation", explanation: "Thought, Action, Observation is the repeating ReAct cycle." }
          ]
        }
      ],
      starter_code: `# Simulate a ReAct trace: Thought -> Action -> Observation, twice.
def search(query):
    db = {
        "largest cities france": "Paris, Marseille, Lyon",
        "population lyon": "520000",
    }
    return db.get(query, "no result")

trace = []
# Step 1: think, then act, then observe.
trace.append("Thought: find the cities first")
obs1 = search("largest cities france")
trace.append("Observation: " + obs1)

# TODO: Step 2 - think about the third city (Lyon), search its population,
#       append that observation, then append a final "Answer:" line.
for line in trace:
    print(line)
`,
      solution_code: `def search(query):
    db = {
        "largest cities france": "Paris, Marseille, Lyon",
        "population lyon": "520000",
    }
    return db.get(query, "no result")

trace = []
trace.append("Thought: find the cities first")
obs1 = search("largest cities france")
trace.append("Observation: " + obs1)

trace.append("Thought: third city is Lyon, get its population")
obs2 = search("population lyon")
trace.append("Observation: " + obs2)
trace.append("Answer: Lyon, about " + obs2 + " people")

for line in trace:
    print(line)
`,
      expected_output: `Thought: find the cities first
Observation: Paris, Marseille, Lyon
Thought: third city is Lyon, get its population
Observation: 520000
Answer: Lyon, about 520000 people`,
      step_throughs: [
        {
          title: "splitting a hard question with ReAct",
          steps: [
            { label: "Thought: decompose", detail: "The model can't answer in one shot, so it reasons about what to find first instead of guessing.", code: 'Thought: "I need the third-largest French city first."' },
            { label: "Action: first search", detail: "Based on the thought, it issues a precise, searchable query rather than the whole convoluted question.", code: 'Action: search("largest cities in France")' },
            { label: "Observation: read result", detail: "The runtime returns a list. The next thought interprets it: the third city is Lyon.", code: 'Observation: "Paris, Marseille, Lyon" -> third = Lyon' },
            { label: "Loop to the answer", detail: "A new thought sets up the next action: look up Lyon's population. With that observation, the model writes the final answer.", code: 'Action: search("population of Lyon") -> Answer' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'In a ReAct trace you see: Thought, Action, Observation. What comes next if the agent is not yet done?',
          steps: [
            "The observation gives the agent new information to work with.",
            "The agent reasons about that result, producing another Thought.",
            "That thought leads to the next Action, continuing the cycle."
          ],
          output: "Another Thought (then Action, then Observation) until it can give the final Answer."
        },
        {
          number: 2, difficulty: "hard",
          prompt: 'An agent searches "weather Springfield" and the Observation is "Did you mean: Springfield, IL / Springfield, MA / Springfield, MO?". A reflex agent would pick one at random. How does ReAct handle this better?',
          steps: [
            "ReAct does not act on the ambiguous observation directly; it generates a Thought about it first.",
            "The thought notices the result is a disambiguation list, not a weather report — the action did not succeed.",
            "Instead of guessing a city, the next thought decides to gather the missing detail: which Springfield does the user mean?",
            "The agent can then ask a clarifying question or use context to choose, then re-issue a precise search.",
            "Because every observation is reasoned about, surprising results trigger correction rather than blind continuation."
          ],
          output: "The Thought step notices the action failed and re-plans to clarify, instead of blindly picking a wrong city."
        }
      ],
      comparison_tables: [
        {
          title: "reflex tool call vs ReAct",
          columns: ["Aspect", "Reflex (act only)", "ReAct (reason then act)"],
          rows: [
            { cells: ["Plans before acting", "No", "Yes, via a Thought"] },
            { cells: ["Handles surprising results", "Continues blindly", "Notices and re-plans"] },
            { cells: ["Debuggability", "Opaque", "Readable thought trace"] },
            { cells: ["Reliability on hard tasks", "Brittle", "Much higher"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "label each line of a trace",
          bins: [
            { id: "thought", label: "Thought" },
            { id: "action", label: "Action" },
            { id: "obs", label: "Observation" }
          ],
          items: [
            { id: "i1", text: '"I should look up the capital first"', bin: "thought" },
            { id: "i2", text: 'search("capital of Peru")', bin: "action" },
            { id: "i3", text: '"Lima"', bin: "obs" },
            { id: "i4", text: '"Now I need Lima\'s population"', bin: "thought" },
            { id: "i5", text: 'get_population("Lima")', bin: "action" },
            { id: "i6", text: '"about 9.7 million"', bin: "obs" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does making the agent reason before each action help it solve harder problems than a single tool call?",
          sampleAnswer: "Hard questions often can't be answered by one tool call because no single source is phrased the right way. Reasoning first lets the agent break the problem into searchable pieces, pick the right tool and arguments, and check each result before moving on. The thought step also lets it notice when an action failed and re-plan, instead of charging ahead with a wrong assumption."
        }
      ],
      hints: [
        "Step 2 mirrors step 1: append a Thought, run search, append the Observation.",
        "Use the query 'population lyon' to match the db key exactly.",
        "End by appending a line that starts with 'Answer:' and includes the population."
      ],
      challenge_title: "The ReAct Trace Walker",
      challenge_description: "Drive a Reason–Act–Observe loop that chases links through a knowledge graph until it reaches the goal.",
      challenge_story: "Your research agent answers multi-hop questions like *\"what continent is the country whose capital is Lima on?\"* It can't leap straight to the answer — each fact only unlocks the next. So it runs a **ReAct** loop: it thinks, fires a `lookup` action against a knowledge graph, observes the single fact that comes back, then repeats with that new fact. You must emit the exact reasoning trace as the agent hops from the starting entity toward the goal — and you must defend against the two classic failures of an unguarded loop: hitting a **dead end** (a fact with no further link) and getting trapped in a **cycle** (looping back to a node it already visited).",
      challenge_statement: "You're given a knowledge graph as **N** directed links, each `from to` meaning a `lookup(from)` returns `to`. Then you're given a `start` entity and a `goal` entity.\n\nRun the ReAct loop from `start`:\n\n1. Print `Thought: start at <start>`.\n2. While the current entity is not the goal, perform a `lookup`:\n   - Print `Action: lookup(<current>)` then `Observation: <result>`.\n   - If the current entity has **no** outgoing link, stop and print `Answer: DEAD_END after <k> steps` (where `k` counts the lookups actually performed).\n   - If the observed result is an entity already visited, stop and print `Answer: LOOP after <k> steps`.\n3. When you reach the goal, print `Answer: reached <goal> in <k> steps`.\n\nIf `start` already equals `goal`, no lookups happen: print only the Thought line and `Answer: reached <goal> in 0 steps`.",
      challenge_input_format: "Line 1: integer `N`.\nNext `N` lines: `from to` (each entity is a unique key with exactly one outgoing link; entities are tokens without spaces).\nNext line: `start`.\nNext line: `goal`.",
      challenge_output_format: "The full trace: a `Thought:` line, alternating `Action:` / `Observation:` lines for each lookup, and a final `Answer:` line describing how the run ended.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "Each `from` key appears at most once (deterministic lookups)",
        "Entity names contain no whitespace, length 1–30",
      ],
      challenge_examples: [
        { input: "3\nPeru Lima\nLima SouthAmerica\nSouthAmerica Earth\nPeru\nEarth", output: "Thought: start at Peru\nAction: lookup(Peru)\nObservation: Lima\nAction: lookup(Lima)\nObservation: SouthAmerica\nAction: lookup(SouthAmerica)\nObservation: Earth\nAnswer: reached Earth in 3 steps", explanation: "Three hops chain Peru → Lima → SouthAmerica → Earth, reaching the goal." },
        { input: "2\nA B\nB A\nA\nC", output: "Thought: start at A\nAction: lookup(A)\nObservation: B\nAction: lookup(B)\nObservation: A\nAnswer: LOOP after 2 steps", explanation: "A → B → A revisits A, so the loop guard fires after 2 lookups." },
      ],
      challenge_notes: "This is the engine inside every ReAct agent: think, act, observe, repeat. The cycle and dead-end guards are not decoration — without them a real agent will spin forever or crash. Counting steps is how you'd later enforce a budget.",
      challenge_hints: [
        "Store links in a dict `nxt[from] = to`; a missing key means a dead end.",
        "Track visited entities in a set so you can detect a revisit (a loop).",
        "Increment your step counter only when you actually perform a lookup.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    nxt = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        nxt[parts[0]] = parts[1]
    start = data[idx].strip(); idx += 1
    goal = data[idx].strip(); idx += 1
    out = []
    current = start
    steps = 0
    seen = set([current])
    out.append("Thought: start at " + current)
    # TODO: run the ReAct loop with dead-end and loop guards
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    nxt = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        nxt[parts[0]] = parts[1]
    start = data[idx].strip(); idx += 1
    goal = data[idx].strip(); idx += 1

    out = []
    current = start
    steps = 0
    seen = set([current])
    out.append("Thought: start at " + current)
    while current != goal:
        if current not in nxt:
            out.append("Answer: DEAD_END after " + str(steps) + " steps")
            print("\\n".join(out))
            return
        nextnode = nxt[current]
        steps += 1
        out.append("Action: lookup(" + current + ")")
        out.append("Observation: " + nextnode)
        if nextnode in seen:
            out.append("Answer: LOOP after " + str(steps) + " steps")
            print("\\n".join(out))
            return
        seen.add(nextnode)
        current = nextnode
    out.append("Answer: reached " + goal + " in " + str(steps) + " steps")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\nPeru Lima\nLima SouthAmerica\nSouthAmerica Earth\nPeru\nEarth", expected_output: "Thought: start at Peru\nAction: lookup(Peru)\nObservation: Lima\nAction: lookup(Lima)\nObservation: SouthAmerica\nAction: lookup(SouthAmerica)\nObservation: Earth\nAnswer: reached Earth in 3 steps", description: "A clean three-hop chain to the goal." },
        { input: "2\nA B\nC D\nA\nD", expected_output: "Thought: start at A\nAction: lookup(A)\nObservation: B\nAnswer: DEAD_END after 1 steps", description: "B has no outgoing link, so the run dead-ends." },
        { input: "2\nA B\nB A\nA\nC", expected_output: "Thought: start at A\nAction: lookup(A)\nObservation: B\nAction: lookup(B)\nObservation: A\nAnswer: LOOP after 2 steps", description: "Revisiting A trips the cycle guard." }
      ]
    },
    {
      id: "ai-09-l4",
      project_id: "ai-09",
      order: 4,
      title: "Multi-Step Tasks & Memory",
      concept: "Planning",
      xp_reward: 10,
      explanation: `"Plan a weekend trip to Lisbon, book a hotel under 150 a night, and add it to my calendar." That is not one action — it is a small project. The agent has to break the goal into steps, do them in order, and remember the hotel it picked when it later writes the calendar event. Two skills carry this: **planning** (decompose then sequence) and **memory** (carry results forward).

## What it is

**Planning** is the agent breaking a big goal into an ordered list of sub-tasks before diving in. **Memory** is how the agent keeps track of what it has already done and learned, so step five can use the result of step two.

There are two flavors of memory, and mixing them up causes bugs. **Short-term (working) memory** is the running context of the current task — the trace of thoughts, actions, and observations so far. **Long-term memory** is information stored outside the context window — in a database or file — that the agent can retrieve later, even in a future session.

## How it works

A multi-step agent runs a plan-then-execute cycle:

1. **Plan.** Turn the goal into ordered sub-tasks.
2. **Execute one step**, using tools and reasoning (the ReAct loop from the last lesson).
3. **Update memory.** Record the result so later steps can use it.
4. **Check progress.** Is the plan done? If not, move to the next step; re-plan if something failed.

Working memory is often just a list the agent reads on every step:

\`\`\`python
goal = "book a hotel under 150, then add it to the calendar"
plan = ["search hotels", "pick under 150", "book it", "add to calendar"]
memory = {}                      # carries results forward

for step in plan:
    result = do_step(step, memory)   # may read earlier results
    memory[step] = result            # remember it for later steps
# the "add to calendar" step reads memory["book it"]
\`\`\`

The "add to calendar" step works only because the booked hotel was saved in \`memory\` earlier. Drop that, and the agent forgets what it booked the moment it moves on.

## Why it matters

Planning and memory are what separate a toy demo from a useful agent:

- **Order matters.** You can't book a hotel before searching, or add to a calendar before booking. A plan enforces dependencies between steps.
- **Context windows are finite.** A long task overflows the window. Long-term memory lets the agent offload finished work and retrieve only what the current step needs.
- **Failures need recovery.** When a step fails — the hotel is sold out — a good agent re-plans from where it is, rather than restarting or charging ahead with stale assumptions.

## The mental model to keep

Treat the agent like a project manager with a notebook. **It writes a plan, does one step, jots the result in the notebook, checks the plan, and continues.** Planning sets the order; memory carries the results between steps.`,
      key_terms: [
        { term: "Planning", definition: "Breaking a large goal into an ordered list of sub-tasks the agent executes in sequence." },
        { term: "Working memory", definition: "The short-term running context of the current task: recent thoughts, actions, and results." },
        { term: "Long-term memory", definition: "Information stored outside the context window, in a database or file, that the agent can retrieve later." },
        { term: "Re-planning", definition: "Revising the plan mid-task when a step fails or a result changes the situation." }
      ],
      callouts: [
        { type: "analogy", title: "A project manager with a notebook", content: "The agent writes a plan, does one step, jots the result in a notebook, checks the plan, and moves on. Planning sets the order; the notebook (memory) carries results between steps.", position: "before" },
        { type: "warning", title: "Forgetting breaks later steps", content: "If the agent doesn't save the hotel it booked, the 'add to calendar' step has nothing to add. Each step's result must be remembered for the steps that depend on it.", position: "after" }
      ],
      concept_diagram: {
        title: "Plan, execute, remember, check",
        steps: [
          { label: "Plan", desc: "Break the goal into ordered sub-tasks." },
          { label: "Execute one step", desc: "Use tools and reasoning to do it." },
          { label: "Update memory", desc: "Record the result for later steps." },
          { label: "Check progress", desc: "Continue, finish, or re-plan on failure." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the difference between working memory and long-term memory for an agent?",
          options: [
            "Working memory is the current task context; long-term memory is stored outside the context window",
            "They are the same thing",
            "Long-term memory is faster than working memory"
          ],
          correct_index: 0,
          explanation: "Working (short-term) memory is the running context now; long-term memory lives in a store the agent retrieves from later."
        }
      ],
      quiz_questions: [
        {
          question: "Why does a multi-step agent need a plan rather than just acting?",
          options: [
            "Plans make the model smaller",
            "Steps have dependencies and an order — you can't book before searching",
            "Planning removes the need for tools",
            "It prevents the agent from using memory"
          ],
          correct_index: 1,
          explanation: "A plan enforces the correct order between dependent steps, like search before book before calendar."
        },
        {
          question: "Why is long-term memory useful when the context window is finite?",
          options: [
            "It makes the model train faster",
            "It lets the agent offload finished work and retrieve only what the current step needs",
            "It removes the context window entirely",
            "It stores the model's weights"
          ],
          correct_index: 1,
          explanation: "Long-term memory keeps information outside the limited window so long tasks don't overflow it."
        },
        {
          question: "A booked hotel sells out mid-task. What should a good agent do?",
          options: [
            "Pretend it booked successfully",
            "Re-plan from where it is, choosing another hotel",
            "Restart the entire task from scratch every time",
            "Stop and refuse to continue"
          ],
          correct_index: 1,
          explanation: "Re-planning lets the agent recover gracefully by adapting the remaining steps to the new situation."
        }
      ],
      participation_activities: [
        {
          activity_title: "Planning and memory check",
          questions: [
            { question: "An agent must remember earlier results so later dependent steps can use them.", type: "true_false", correct_answer: "true", explanation: "The 'add to calendar' step needs the hotel saved by the earlier 'book it' step." },
            { question: "Information stored outside the context window for later retrieval is called ______ memory.", type: "fill_in", correct_answer: "long-term", explanation: "Long-term memory lives in a store the agent can query later, even in a new session." }
          ]
        }
      ],
      starter_code: `# Execute a plan step by step, carrying results forward in memory.
plan = ["search_hotel", "book", "add_calendar"]
memory = {}

def do_step(step, memory):
    if step == "search_hotel":
        return "Hotel Lisboa, 120/night"
    if step == "book":
        return "booked: " + memory["search_hotel"]   # uses earlier result
    if step == "add_calendar":
        return "calendar event for " + memory["book"]  # uses earlier result

# TODO: loop over the plan, run each step with do_step, and save each result
#       in memory under its step name. Print the final calendar result.
print("plan:", plan)
`,
      solution_code: `plan = ["search_hotel", "book", "add_calendar"]
memory = {}

def do_step(step, memory):
    if step == "search_hotel":
        return "Hotel Lisboa, 120/night"
    if step == "book":
        return "booked: " + memory["search_hotel"]
    if step == "add_calendar":
        return "calendar event for " + memory["book"]

print("plan:", plan)
for step in plan:
    result = do_step(step, memory)
    memory[step] = result
    print(step, "->", result)
print("final:", memory["add_calendar"])
`,
      expected_output: `plan: ['search_hotel', 'book', 'add_calendar']
search_hotel -> Hotel Lisboa, 120/night
book -> booked: Hotel Lisboa, 120/night
add_calendar -> calendar event for booked: Hotel Lisboa, 120/night
final: calendar event for booked: Hotel Lisboa, 120/night`,
      step_throughs: [
        {
          title: "carrying a result across steps",
          steps: [
            { label: "Plan the order", detail: "The agent decomposes the goal into dependent steps. Calendar depends on booking, which depends on searching.", code: 'plan = ["search", "book", "add_calendar"]' },
            { label: "Run step one, remember it", detail: "It searches and finds a hotel. That result is written to working memory so later steps can read it.", code: 'memory["search"] = "Hotel Lisboa, 120/night"' },
            { label: "Step two reads memory", detail: "Booking needs the hotel from step one. It pulls it from memory rather than re-deciding.", code: 'book(memory["search"])  ->  memory["book"] = "booked..."' },
            { label: "Final step uses the chain", detail: "Adding to the calendar reads the booked hotel from memory. Drop the memory and this step has nothing to add.", code: 'add_calendar(memory["book"])  # depends on the saved result' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'An agent is told to "summarize this report, then email the summary to Sam." Why must these run in order?',
          steps: [
            "The email step needs the summary as its content.",
            "If the agent emails before summarizing, there is nothing to send.",
            "So summarize must complete first, and its result is carried forward to the email step."
          ],
          output: "Summarize first; the email step depends on the summary it produces."
        },
        {
          number: 2, difficulty: "hard",
          prompt: 'A research agent must read 50 documents and answer a question, but only 10 fit in its context window at once. How do planning and memory make this possible?',
          steps: [
            "It can't load all 50 documents into working memory at once — the window overflows.",
            "Plan: process the documents in batches, extracting the relevant facts from each batch.",
            "After each batch, write the extracted facts to long-term memory (a store outside the window).",
            "Working memory only ever holds the current batch plus a running summary, staying within the limit.",
            "At the end, retrieve the saved facts from long-term memory and reason over just those to answer.",
            "Planning sets the batching order; long-term memory holds the accumulated findings without overflowing context."
          ],
          output: "Plan into batches, push each batch's findings to long-term memory, then retrieve those findings to answer within the window."
        }
      ],
      comparison_tables: [
        {
          title: "working memory vs long-term memory",
          columns: ["Aspect", "Working (short-term)", "Long-term"],
          rows: [
            { cells: ["Where it lives", "In the context window", "In a database or file"] },
            { cells: ["Lifespan", "The current task only", "Across steps and sessions"] },
            { cells: ["Size limit", "Bounded by context window", "Effectively unbounded"] },
            { cells: ["Best for", "The step happening right now", "Offloading and recalling past work"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "working memory vs long-term memory",
          bins: [
            { id: "short", label: "Working (short-term)" },
            { id: "long", label: "Long-term" }
          ],
          items: [
            { id: "i1", text: "The current trace of thoughts and actions", bin: "short" },
            { id: "i2", text: "Facts saved to a database for a future session", bin: "long" },
            { id: "i3", text: "The hotel just booked in this task", bin: "short" },
            { id: "i4", text: "A user preference recalled weeks later", bin: "long" },
            { id: "i5", text: "Limited by the context window size", bin: "short" },
            { id: "i6", text: "Retrieved on demand from outside the window", bin: "long" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why do planning and memory have to work together for a multi-step task to succeed?",
          sampleAnswer: "Planning decides the correct order of dependent steps, but each step usually needs the results of the ones before it. Memory is what carries those results forward, so the plan can actually be carried out. Without planning the steps run in the wrong order, and without memory each step forgets what the last one produced, so a task like 'book a hotel then add it to the calendar' falls apart either way."
        }
      ],
      hints: [
        "Loop over plan and call do_step(step, memory) for each one.",
        "After each step, store the result with memory[step] = result.",
        "The later steps read earlier results out of memory by their step name."
      ],
      challenge_title: "The Dependent Pipeline",
      challenge_description: "Execute a multi-step agent plan where each step reads earlier results out of working memory.",
      challenge_story: "Your agent has decomposed a big task into a pipeline of named steps — `fetch`, `clean`, `summarize`, and so on — and it runs them one at a time, stashing every result in a shared **working memory** dict. The catch is that later steps *depend* on earlier ones: `summarize` can't run until `fetch` and `clean` have each left their results in memory. Each step contributes its own base value plus the sum of the values its dependencies already produced. Run the plan in the given order, recording every step's result, and print the final pipeline output. If a step ever needs a dependency that isn't in memory yet, the plan is broken and must halt safely.",
      challenge_statement: "Read **N** steps in execution order. Each step has a `name`, an integer `base` value, a dependency count `d`, and then `d` dependency names.\n\nExecute the steps in the order given. A step's result is:\n\n```\nresult = base + (sum of the results of all its dependencies)\n```\n\nStore each result in working memory under the step's name and print `name = result`. If any dependency of a step is **not** already in working memory, immediately print `name MISSING_DEP` and stop (print nothing further). If all steps succeed, finally print `FINAL` followed by the result of the **last** step in the plan.",
      challenge_input_format: "Line 1: integer `N`.\nNext `N` lines: `name base d dep1 dep2 ... depd` (when `d` is 0 there are no dependency tokens).",
      challenge_output_format: "One `name = result` line per executed step, then a final `FINAL X` line — unless a missing dependency is hit, in which case the last line is `name MISSING_DEP`.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "-1000000 ≤ base ≤ 1000000",
        "0 ≤ d ≤ N",
        "Step names are unique tokens without whitespace",
      ],
      challenge_examples: [
        { input: "3\nfetch 10 0\nclean 5 1 fetch\nsummarize 2 2 fetch clean", output: "fetch = 10\nclean = 15\nsummarize = 27\nFINAL 27", explanation: "fetch=10; clean=5+10=15; summarize=2+10+15=27; FINAL echoes the last step." },
        { input: "1\nx 5 1 ghost", output: "x MISSING_DEP", explanation: "`x` depends on `ghost`, which was never computed, so the plan halts." },
      ],
      challenge_notes: "Working memory is what turns a list of tool calls into a real plan: each step's output becomes available context for the next. The missing-dependency check models an agent catching its own broken plan instead of feeding a tool a value that doesn't exist.",
      challenge_hints: [
        "Keep a `memory` dict mapping each completed step name to its result.",
        "Before computing a step, verify every dependency is already in `memory`.",
        "The FINAL value is just `memory[<last step's name>]`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    order = []
    defs = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        base = int(parts[1])
        d = int(parts[2])
        deps = parts[3:3+d]
        order.append(name)
        defs[name] = (base, deps)
    memory = {}
    out = []
    # TODO: run steps in order, guarding against missing deps,
    #       then print FINAL <last step result>
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    order = []
    defs = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        base = int(parts[1])
        d = int(parts[2])
        deps = parts[3:3+d]
        order.append(name)
        defs[name] = (base, deps)
    memory = {}
    out = []
    for name in order:
        base, deps = defs[name]
        if any(dep not in memory for dep in deps):
            out.append(name + " MISSING_DEP")
            print("\\n".join(out))
            return
        val = base + sum(memory[dep] for dep in deps)
        memory[name] = val
        out.append(name + " = " + str(val))
    print("\\n".join(out))
    print("FINAL " + str(memory[order[-1]]))

main()
`,
      challenge_test_cases: [
        { input: "3\nfetch 10 0\nclean 5 1 fetch\nsummarize 2 2 fetch clean", expected_output: "fetch = 10\nclean = 15\nsummarize = 27\nFINAL 27", description: "Each step accumulates its dependencies' results from memory." },
        { input: "2\na 3 0\nb 0 1 a", expected_output: "a = 3\nb = 3\nFINAL 3", description: "b inherits a's value through working memory." },
        { input: "1\nx 5 1 ghost", expected_output: "x MISSING_DEP", description: "A dependency never produced halts the plan safely." }
      ]
    },
    {
      id: "ai-09-l5",
      project_id: "ai-09",
      order: 5,
      title: "When Agents Fail",
      concept: "Guardrails",
      xp_reward: 10,
      explanation: `An agent given a credit card and told to "buy the cheapest flight" once kept refreshing prices in an endless loop, never booking, burning API calls until someone killed it. Agents fail in ways plain chatbots cannot, because agents *act*. A wrong sentence is harmless; a wrong action spends money, sends emails, or deletes data. So the most important skill in agent building is designing the **guardrails** that catch failure before it does damage.

## What it is

A **guardrail** is a constraint you put around an agent to limit what it can do and stop it when it goes wrong. Guardrails are not part of the model — they are code and rules you wrap around the agent loop. They exist because agents have signature failure modes:

- **Infinite loops.** The agent repeats the same action forever, never deciding it is done.
- **Cost explosions.** Each loop step is a model call, so a runaway agent can rack up a huge bill fast.
- **Harmful actions.** A misread goal leads to a destructive tool call — deleting the wrong files, emailing the wrong people.
- **Cascading errors.** One bad observation poisons the next thought, which poisons the next action, drifting further from the goal.

## How it works

You install guardrails at four points around the loop:

1. **A step limit.** Cap the number of loop iterations. If the agent hasn't finished in N steps, stop it.
2. **A budget limit.** Track tokens or dollars spent and halt when a ceiling is hit.
3. **Action permissions.** Mark dangerous tools as requiring confirmation or simply forbidding them.
4. **Human-in-the-loop.** For high-stakes actions, pause and ask a person to approve before executing.

The simplest guardrail is a step cap, and every serious agent has one:

\`\`\`python
MAX_STEPS = 10
for step in range(MAX_STEPS):
    decision = agent.decide(history)
    if decision.is_final:
        break
    if decision.tool in DANGEROUS:        # permission guardrail
        if not human_approves(decision):
            break
    history.append(run_tool(decision))
else:
    print("Stopped: hit the step limit")  # loop guardrail
\`\`\`

The \`else\` on the \`for\` loop fires only if the loop never broke — meaning the agent never finished on its own and was stopped by the cap. That single line prevents the infinite-loop disaster.

## Why it matters

Guardrails are the difference between a demo and something you can trust with real access:

- **They bound the blast radius.** A step cap and budget cap mean the worst case is "wasted a few cents," not "drained the account."
- **They keep humans in control of high stakes.** Confirmation on destructive actions means the agent proposes; a person disposes.
- **They make failure observable.** A guardrail that stops and logs *why* turns a silent disaster into a clear, debuggable event.

The trade-off is autonomy: every guardrail is a place the agent must stop or ask. Tighten too far and it can't get anything done; loosen too far and it can hurt you. Good agent design is choosing where on that dial each action belongs.

## The mental model to keep

Never give an agent unbounded freedom to act. **Cap its steps, cap its spend, gate its dangerous actions, and keep a human on the high-stakes ones.** Assume it will fail, and make failure cheap and visible.`,
      key_terms: [
        { term: "Guardrail", definition: "A constraint wrapped around an agent that limits its actions and stops it when something goes wrong." },
        { term: "Step limit", definition: "A cap on how many loop iterations an agent may run, preventing infinite loops." },
        { term: "Human-in-the-loop", definition: "A design where a person approves high-stakes actions before the agent executes them." },
        { term: "Blast radius", definition: "How much damage an agent can do if it fails; guardrails shrink it." }
      ],
      callouts: [
        { type: "warning", title: "A wrong action costs more than a wrong word", content: "When a chatbot is wrong, you read a bad sentence. When an agent is wrong, it may delete files or send the wrong email. Acting raises the stakes, so guardrails are not optional.", position: "before" },
        { type: "tip", title: "Always cap the loop", content: "The single most important guardrail is a step limit. Without it, one stuck agent can loop forever and burn your whole budget on repeated model calls.", position: "after" }
      ],
      concept_diagram: {
        title: "Four places to add guardrails",
        steps: [
          { label: "Step limit", desc: "Cap loop iterations so it can't run forever." },
          { label: "Budget limit", desc: "Halt when token or dollar spend hits a ceiling." },
          { label: "Action permissions", desc: "Forbid or gate dangerous tools." },
          { label: "Human approval", desc: "Pause for a person on high-stakes actions." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the single most essential guardrail for any agent loop?",
          options: ["A bigger model", "A step limit that caps loop iterations", "More tools"],
          correct_index: 1,
          explanation: "A step limit prevents the infinite-loop failure mode where an agent never stops and burns budget."
        }
      ],
      quiz_questions: [
        {
          question: "Why do agents need guardrails that plain chatbots do not?",
          options: [
            "Agents use more tokens to chat",
            "Agents take real actions, so a wrong decision can cause real damage",
            "Chatbots cannot produce text",
            "Guardrails make the model more accurate"
          ],
          correct_index: 1,
          explanation: "Because agents act on the world, failures spend money or cause harm, not just bad sentences."
        },
        {
          question: "What does a 'human-in-the-loop' guardrail do?",
          options: [
            "Replaces the model with a human",
            "Pauses on high-stakes actions for a person to approve before executing",
            "Speeds up the agent",
            "Removes all tools from the agent"
          ],
          correct_index: 1,
          explanation: "The agent proposes a high-stakes action; a human approves or rejects it before it runs."
        },
        {
          question: "What is the main trade-off of adding more guardrails?",
          options: [
            "The agent becomes less safe",
            "The agent loses autonomy and may get less done",
            "The model forgets its tools",
            "Tokens become free"
          ],
          correct_index: 1,
          explanation: "Each guardrail is a stop or a checkpoint, so over-constraining an agent leaves it unable to act usefully."
        }
      ],
      participation_activities: [
        {
          activity_title: "Guardrails check",
          questions: [
            { question: "A step limit on the agent loop helps prevent infinite loops and runaway costs.", type: "true_false", correct_answer: "true", explanation: "Capping iterations stops an agent that never decides it is finished." },
            { question: "Pausing for a person to approve a high-stakes action before it runs is called ______-in-the-loop.", type: "fill_in", correct_answer: "human", explanation: "Human-in-the-loop keeps people in control of the riskiest actions." }
          ]
        }
      ],
      starter_code: `# Add a step-limit guardrail so a stuck agent can't loop forever.
MAX_STEPS = 5

def agent_decide(step):
    # This buggy agent never says it's done — it loops forever without a cap.
    return "keep going"

ran = 0
# TODO: loop up to MAX_STEPS times. Stop early if the decision is "done".
#       After the loop, print how many steps ran and whether the cap stopped it.
print("max steps:", MAX_STEPS)
`,
      solution_code: `MAX_STEPS = 5

def agent_decide(step):
    return "keep going"

print("max steps:", MAX_STEPS)
ran = 0
stopped_by_cap = True
for step in range(MAX_STEPS):
    ran += 1
    if agent_decide(step) == "done":
        stopped_by_cap = False
        break

print("steps run:", ran)
print("stopped by cap:", stopped_by_cap)
`,
      expected_output: `max steps: 5
steps run: 5
stopped by cap: True`,
      step_throughs: [
        {
          title: "a guardrail catching a runaway agent",
          steps: [
            { label: "Agent starts looping", detail: "The agent keeps deciding to act and never marks the task done. Without a cap, this never ends.", code: 'decision = "keep going"  # forever' },
            { label: "Step limit counts down", detail: "A guardrail tracks iterations. Each loop pass uses one of the allowed steps.", code: "for step in range(MAX_STEPS):  # 0..9" },
            { label: "Cap is reached", detail: "After MAX_STEPS iterations the loop ends without the agent ever finishing on its own.", code: "step == MAX_STEPS - 1  # last allowed pass" },
            { label: "Stop and report", detail: "The guardrail halts the agent and logs why, turning a silent infinite loop into a clear, cheap failure.", code: 'print("Stopped: hit the step limit")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'An agent has a tool delete_files. What is a reasonable guardrail before letting it run that tool?',
          steps: [
            "Deleting files is destructive and hard to undo, so it is a high-stakes action.",
            "A guardrail should pause and require explicit approval before running it.",
            "A human reviews the proposed deletion and confirms or rejects it."
          ],
          output: "Require human-in-the-loop confirmation before the agent runs delete_files."
        },
        {
          number: 2, difficulty: "hard",
          prompt: 'A shopping agent with a $50 budget is told to "find a deal." It keeps searching and re-searching without ever buying, and each search is a paid model call. Which guardrails would prevent disaster, and why one alone is not enough?',
          steps: [
            "A step limit caps the number of loop iterations, so the endless re-searching stops after N rounds.",
            "But a tight step limit alone might still allow expensive calls within those steps, so add a budget limit tracking dollars spent.",
            "The budget guardrail halts the moment spend approaches $50, regardless of step count.",
            "Combined, the step cap bounds time and the budget cap bounds money, covering both 'too many steps' and 'too costly per step'.",
            "Layering guardrails matters because a single limit only covers one failure axis; real agents fail along several at once."
          ],
          output: "Use both a step limit and a budget limit; one bounds iterations, the other bounds spend, since failures happen on multiple axes."
        }
      ],
      comparison_tables: [
        {
          title: "agent without vs with guardrails",
          columns: ["Failure", "No guardrails", "With guardrails"],
          rows: [
            { cells: ["Infinite loop", "Runs forever", "Stopped by step limit"] },
            { cells: ["Cost explosion", "Drains the budget", "Halted at budget cap"] },
            { cells: ["Destructive action", "Runs blindly", "Gated by human approval"] },
            { cells: ["Failure visibility", "Silent disaster", "Stopped and logged with a reason"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "guardrail vs failure mode",
          bins: [
            { id: "guard", label: "A guardrail" },
            { id: "fail", label: "A failure mode" }
          ],
          items: [
            { id: "i1", text: "Capping the loop at 10 steps", bin: "guard" },
            { id: "i2", text: "Repeating the same action forever", bin: "fail" },
            { id: "i3", text: "Requiring approval before deleting", bin: "guard" },
            { id: "i4", text: "Draining the budget on model calls", bin: "fail" },
            { id: "i5", text: "Halting when spend hits a ceiling", bin: "guard" },
            { id: "i6", text: "A bad observation poisoning later steps", bin: "fail" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is 'assume the agent will fail' a healthier design stance than 'make the agent never fail'?",
          sampleAnswer: "Because an agent acts in the real world, you can't guarantee it will always reason correctly, so trying to make it perfect is a losing battle. Assuming it will fail pushes you to bound the damage instead: cap its steps and spend, gate its dangerous actions, and keep a human on high-stakes decisions. That way a failure is cheap, visible, and recoverable rather than catastrophic and silent."
        }
      ],
      hints: [
        "Use for step in range(MAX_STEPS) so the loop can run at most MAX_STEPS times.",
        "Increment ran each pass; break early if agent_decide returns 'done'.",
        "Since this agent never returns 'done', it always hits the cap, so stopped_by_cap stays True."
      ],
      challenge_title: "The Guardrailed Agent Loop",
      challenge_description: "Run an agent's action queue under both a step limit and a spend budget, stopping the instant either guardrail trips.",
      challenge_story: "Your autonomous agent is about to run unattended overnight, and an unguarded loop is a liability: it could spin forever, or burn the entire API budget on a runaway plan. So you wrap its action queue in two guardrails. A **step limit** caps how many actions it may ever take. A **budget** caps total spend, where each action costs a known amount. The agent works through its queued actions in order, paying for each before it runs; the special `done` action signals success. Your loop must stop on the *first* condition met — finishing, hitting the step cap, or being about to blow the budget — and report exactly how it ended, how many steps it ran, and how much it spent.",
      challenge_statement: "Line 1 gives two integers: `max_steps` and `budget`. Then read **N** queued actions, each a `name` and an integer `cost`.\n\nProcess actions in order. Before running an action:\n\n- If you have already run `max_steps` actions, stop with outcome `STEP_LIMIT`.\n- If running this action would push total spend **above** `budget` (i.e. `spent + cost > budget`), stop with outcome `OVER_BUDGET` (do **not** run it; spend stays as is).\n\nOtherwise pay `cost` (add to spend), count the step, and run it. If the action's name is `done`, stop with outcome `FINISHED`. If the queue runs out before any stop condition triggers, the outcome is `EXHAUSTED` (unless the step count exactly reached the limit on the last action, in which case it is `STEP_LIMIT`).\n\nPrint three lines: the outcome, then `steps <k>`, then `spent <s>`.",
      challenge_input_format: "Line 1: `max_steps budget` (two integers).\nLine 2: integer `N`.\nNext `N` lines: `name cost`.",
      challenge_output_format: "Three lines: the outcome (`FINISHED`, `STEP_LIMIT`, `OVER_BUDGET`, or `EXHAUSTED`), then `steps <k>`, then `spent <s>`.",
      challenge_constraints: [
        "0 ≤ max_steps ≤ 1000",
        "0 ≤ budget ≤ 1000000",
        "1 ≤ N ≤ 1000",
        "0 ≤ cost ≤ 1000000",
      ],
      challenge_examples: [
        { input: "10 100\n3\nsearch 5\nread 5\ndone 0", output: "FINISHED\nsteps 3\nspent 10", explanation: "Three actions run for a total cost of 10; the `done` action ends the loop successfully." },
        { input: "10 8\n3\ngo 5\ngo 5\ndone 0", output: "OVER_BUDGET\nsteps 1\nspent 5", explanation: "After the first action spend is 5; the second would make 10 > 8, so the budget guard fires before running it." },
      ],
      challenge_notes: "Step limits and budgets are the seatbelts of agent design. The order of the checks matters: you test the guardrails *before* committing to an action, so the agent can never overspend or overstep. This is exactly how production runtimes keep an autonomous loop from running away.",
      challenge_hints: [
        "Track `steps` and `spent` as you go; check both guards at the top of each iteration.",
        "`spent + cost > budget` must block the action *before* you pay for it.",
        "If the loop finishes the queue with no stop, decide between EXHAUSTED and STEP_LIMIT by whether steps reached max_steps.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    max_steps = int(first[0]); budget = int(first[1])
    n = int(data[idx].strip()); idx += 1
    actions = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        actions.append((parts[0], int(parts[1])))

    spent = 0
    steps = 0
    outcome = None
    # TODO: loop actions; check STEP_LIMIT then OVER_BUDGET before running;
    #       FINISHED on 'done'; EXHAUSTED if queue empties.
    print(outcome)
    print("steps " + str(steps))
    print("spent " + str(spent))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    max_steps = int(first[0]); budget = int(first[1])
    n = int(data[idx].strip()); idx += 1
    actions = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        actions.append((parts[0], int(parts[1])))

    spent = 0
    steps = 0
    outcome = None
    for i in range(n):
        name, cost = actions[i]
        if steps >= max_steps:
            outcome = "STEP_LIMIT"
            break
        if spent + cost > budget:
            outcome = "OVER_BUDGET"
            break
        spent += cost
        steps += 1
        if name == "done":
            outcome = "FINISHED"
            break
    if outcome is None:
        if steps >= max_steps:
            outcome = "STEP_LIMIT"
        else:
            outcome = "EXHAUSTED"
    print(outcome)
    print("steps " + str(steps))
    print("spent " + str(spent))

main()
`,
      challenge_test_cases: [
        { input: "10 100\n3\nsearch 5\nread 5\ndone 0", expected_output: "FINISHED\nsteps 3\nspent 10", description: "The `done` action ends the loop successfully under both guards." },
        { input: "2 100\n4\ngo 1\ngo 1\ngo 1\ndone 0", expected_output: "STEP_LIMIT\nsteps 2\nspent 2", description: "The step cap stops the agent before it can finish." },
        { input: "10 8\n3\ngo 5\ngo 5\ndone 0", expected_output: "OVER_BUDGET\nsteps 1\nspent 5", description: "The budget guard blocks the second action before paying for it." }
      ]
    },
    {
      id: "ai-09-l6",
      project_id: "ai-09",
      order: 6,
      title: "Designing Good Tool Schemas",
      concept: "Schemas",
      xp_reward: 10,
      explanation: `Give a model a tool named \`process\` with the description "does stuff" and it will call it at the wrong moments, with the wrong arguments, or not at all. Rename it \`get_weather\`, describe it as "Return current weather for a given city," and the same model suddenly calls it perfectly. Nothing about the model changed. The **schema** did. A tool schema is the only thing the model sees about your tool, so it is the steering wheel for the whole agent.

## What it is

A **tool schema** is the written description you hand the model for each tool: its **name**, a **description** of what it does and when to use it, and a list of **parameters** with their types and which ones are required. The model never sees your function's code. It chooses tools and fills arguments using the schema and nothing else.

That makes the schema a contract. A precise schema gets reliable calls. A vague one produces the classic agent failures: calling the wrong tool, hallucinating arguments, or skipping a tool it should have used.

## How it works

A good schema answers three questions clearly: what is this, when do I use it, and what must I pass. In code, a schema and the validation around it look like this:

\`\`\`python
tools = {
    "get_weather": {"name": "get_weather", "description": "Return current weather for a city.", "required": ["city"]},
}

def validate_call(name, args):
    if name not in tools:
        return "no such tool: " + name
    missing = [p for p in tools[name]["required"] if p not in args]
    if missing:
        return "missing args: " + ", ".join(missing)
    return "OK: ready to run " + name

print(validate_call("get_weather", {"city": "Tokyo"}))   # OK
print(validate_call("get_weather", {}))                   # missing city
\`\`\`

Two rules do most of the work. First, **name and describe by intent**, not implementation: \`search_orders\` beats \`db_query_v2\`, because the model matches the user's goal to the description. Second, **mark required parameters and validate them** before running — the model can and will omit arguments, so your code is the backstop.

## Why it matters

Schema quality is the single biggest lever on agent reliability:

- **Selection.** With clear, distinct descriptions, the model picks the right tool. Two tools with overlapping descriptions ("get info", "fetch data") make it guess.
- **Arguments.** Naming a parameter \`city\` instead of \`q\`, and saying it is required, dramatically cuts missing or malformed arguments.
- **Safety.** Validating against the schema lets you reject bad calls *before* execution, instead of crashing inside the tool.

The cost is discipline: every tool needs documentation as careful as a public API. That work pays back every single call.

## The mental model to keep

The schema is the only window the model has into your tool. **Write it like API docs for a smart but literal new hire: clear name, exact purpose, named parameters, and which ones are mandatory.** Good schema, good calls.`,
      key_terms: [
        { term: "Tool schema", definition: "The model-facing description of a tool: its name, purpose, and parameters with types and requirements." },
        { term: "Description", definition: "The plain-language statement of what a tool does and when to use it, which drives tool selection." },
        { term: "Required parameter", definition: "An argument the tool must receive; your code validates its presence before running." },
        { term: "Argument validation", definition: "Checking the model's supplied arguments against the schema before executing the tool." }
      ],
      callouts: [
        { type: "tip", title: "Name by intent, not plumbing", content: "Call it search_orders, not db_query_v2. The model matches the user's goal to your description, so describe the goal the tool serves, not how it is built inside.", position: "before" },
        { type: "warning", title: "The model will omit arguments", content: "Even with a perfect schema, a model sometimes leaves out a required field. Validate against the schema and reject the call before running, rather than letting the tool crash.", position: "after" }
      ],
      concept_diagram: {
        title: "What the model uses to call a tool",
        steps: [
          { label: "Read the name", desc: "An intent-revealing name like get_weather." },
          { label: "Read the description", desc: "What it does and when to use it." },
          { label: "Read the parameters", desc: "Names, types, and which are required." },
          { label: "Emit a call", desc: "Choose the tool and fill the arguments from the schema." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does the model actually use to decide which tool to call and how?",
          options: ["The tool's source code", "The tool schema: its name, description, and parameters", "The user's previous chats"],
          correct_index: 1,
          explanation: "The model never sees the function body. It selects tools and fills arguments purely from the schema you wrote."
        }
      ],
      quiz_questions: [
        {
          question: "Why is a tool's description so important?",
          options: [
            "It makes the API call faster",
            "The model picks tools based on the description, so a vague one causes wrong or missed calls",
            "It is shown to the end user as a label",
            "Longer descriptions always use fewer tokens"
          ],
          correct_index: 1,
          explanation: "The description is the model's only basis for selecting a tool, so clarity directly drives correct selection."
        },
        {
          question: "What should your code do when the model omits a required argument?",
          options: [
            "Run the tool anyway and hope it works",
            "Validate against the schema and reject the call before executing",
            "Add the model's missing argument by guessing a default silently",
            "Delete the tool from the schema"
          ],
          correct_index: 1,
          explanation: "Validating required parameters before execution catches malformed calls safely instead of crashing inside the tool."
        },
        {
          question: "Which pair of tool names is most likely to cause the model to pick the wrong one?",
          options: [
            "search_orders and refund_order",
            "get_weather and send_email",
            "get_info and fetch_data",
            "create_user and delete_user"
          ],
          correct_index: 2,
          explanation: "Vague, overlapping names and descriptions give the model nothing to distinguish them, so it guesses."
        }
      ],
      participation_activities: [
        {
          activity_title: "Schema design check",
          questions: [
            { question: "The model selects which tool to call based on the tool's schema, not its underlying code.", type: "true_false", correct_answer: "true", explanation: "The function body is invisible to the model; only the schema guides selection and arguments." },
            { question: "An argument the tool must receive, which your code should check before running, is called a ______ parameter.", type: "fill_in", correct_answer: "required", explanation: "Marking parameters required and validating them is the backstop against omitted arguments." }
          ]
        }
      ],
      starter_code: `# A tool schema is all the model sees. Validate a call against it before running.
tools = {
    "get_weather": {"name": "get_weather", "description": "Return current weather for a city.", "required": ["city"]},
}

def validate_call(name, args):
    # TODO: return "no such tool: NAME" if unknown,
    #       "missing args: ..." if a required parameter is absent,
    #       otherwise "OK: ready to run NAME".
    return "?"

print(validate_call("get_weather", {"city": "Tokyo"}))
`,
      solution_code: `tools = {
    "get_weather": {"name": "get_weather", "description": "Return current weather for a city.", "required": ["city"]},
}

def validate_call(name, args):
    if name not in tools:
        return "no such tool: " + name
    missing = [p for p in tools[name]["required"] if p not in args]
    if missing:
        return "missing args: " + ", ".join(missing)
    return "OK: ready to run " + name

print(validate_call("get_weather", {"city": "Tokyo"}))
print(validate_call("get_weather", {}))
print(validate_call("get_stock", {"ticker": "AAPL"}))
`,
      expected_output: `OK: ready to run get_weather
missing args: city
no such tool: get_stock`,
      step_throughs: [
        {
          title: "turning a vague tool into a reliable one",
          steps: [
            { label: "Start with a bad schema", detail: "A name and description this vague give the model nothing to match a goal against, so it calls the tool randomly.", code: '{"name": "process", "description": "does stuff"}' },
            { label: "Fix the name and description", detail: "Rename by intent and state exactly what it does. Now the model can match the user's goal to it.", code: '{"name": "get_weather", "description": "Return current weather for a city."}' },
            { label: "Declare the parameters", detail: "List each parameter, its type, and whether it is required. The model fills arguments from this.", code: '"parameters": {"city": {"type": "string", "required": true}}' },
            { label: "Validate before running", detail: "Your runtime checks the call against the schema and rejects it if a required argument is missing.", code: 'if "city" not in args: reject("missing city")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You have a tool described only as "data tool." The model keeps calling it at the wrong time. What is the cheapest fix?',
          steps: [
            "The model selects tools from descriptions, and this one says nothing about purpose or timing.",
            "Rewrite the description to state exactly what it does and when to use it.",
            'For example: "Look up a customer record by email. Use when the user asks about a specific customer."'
          ],
          output: "Rewrite the description to state the tool's exact purpose and when to use it."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A booking tool has parameters date, guests, and an optional note. The model sometimes calls it with only date. How do you design the schema so this fails safely instead of booking with no guest count?',
          steps: [
            "Mark date and guests as required in the schema, and leave note optional.",
            "Have the runtime validate the call against the required list before executing.",
            "When guests is missing, reject the call and return an error the model can read, rather than running the booking.",
            "The model then sees the error and can re-emit the call with the guest count filled in."
          ],
          output: "Mark date and guests required, validate before running, and reject the call when a required parameter is missing."
        }
      ],
      comparison_tables: [
        {
          title: "weak schema vs strong schema",
          columns: ["Aspect", "Weak schema", "Strong schema"],
          rows: [
            { cells: ["Tool name", "process / do_it", "get_weather / search_orders"] },
            { cells: ["Description", "'does stuff with data'", "'Return current weather for a city'"] },
            { cells: ["Parameters", "Unnamed or untyped", "Named, typed, marked required"] },
            { cells: ["Result", "Wrong tool, bad arguments", "Right tool, valid arguments"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good schema practice vs bad schema practice",
          bins: [
            { id: "good", label: "Good schema practice" },
            { id: "bad", label: "Bad schema practice" }
          ],
          items: [
            { id: "i1", text: "Name the tool by its intent, like refund_order", bin: "good" },
            { id: "i2", text: 'Describe it as "does stuff"', bin: "bad" },
            { id: "i3", text: "Mark which parameters are required", bin: "good" },
            { id: "i4", text: "Give two tools the same vague description", bin: "bad" },
            { id: "i5", text: "State exactly when to use the tool", bin: "good" },
            { id: "i6", text: "Leave parameters untyped and unnamed", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does improving a tool's name and description change how reliably the same model calls it?",
          sampleAnswer: "The model never sees the tool's code; it only sees the schema. So the name and description are the entire basis for deciding whether this tool fits the user's goal and how to fill its arguments. A vague schema forces the model to guess, while a precise, intent-revealing one lets it match the goal to the tool and supply correct arguments, even though the model itself is unchanged."
        }
      ],
      hints: [
        "First check if name is a key in the tools dict; if not, return the 'no such tool' message.",
        "Build a list of required parameters that are not present in args.",
        "If that list is non-empty, join it into the 'missing args' message; otherwise return OK."
      ],
      challenge_title: "The Schema Validator",
      challenge_description: "Validate a stream of model-emitted tool calls against their registered schemas, catching unknown tools and missing required arguments before anything runs.",
      challenge_story: "You're hardening the runtime for a production agent. The model proposes tool calls, but it is not trustworthy: it sometimes invents a tool that was never registered, and it sometimes forgets a required argument. Before any tool executes, your **schema validator** must check each call against its registered schema. Each tool's schema lists exactly which parameters are **required**. A call is only allowed to run if the tool exists and every required parameter was supplied. When a required parameter is missing, you must report *which* ones, sorted, so the model can fix its call on the next turn.",
      challenge_statement: "First read **N** tool schemas. Each schema is a tool `name`, an integer `r`, then `r` required parameter names.\n\nThen read **Q** tool calls. Each call is a tool `name` followed by zero or more parameter names that the call supplied.\n\nFor each call, in order:\n\n- If the tool name was never registered, print `NO_SUCH_TOOL`.\n- Otherwise compute the required parameters that were **not** supplied. If any are missing, print `MISSING ` followed by those parameter names sorted in ascending (lexicographic) order, space-separated.\n- If the tool exists and all required parameters were supplied, print `CALL ` followed by the tool name.",
      challenge_input_format: "Line 1: integer `N`.\nNext `N` lines: `name r p1 p2 ... pr` (the tool name, the count of required params, then that many param names).\nNext line: integer `Q`.\nNext `Q` lines: `name a1 a2 ...` (the tool name, then zero or more supplied param names).",
      challenge_output_format: "Exactly `Q` lines: `NO_SUCH_TOOL`, `MISSING <params...>` (sorted), or `CALL <name>`.",
      challenge_constraints: [
        "1 ≤ N ≤ 100",
        "1 ≤ Q ≤ 1000",
        "0 ≤ r ≤ 10",
        "Parameter and tool names are lowercase tokens without spaces; tool names are unique",
      ],
      challenge_examples: [
        { input: "3\nget_weather 2 city units\nsend_email 3 to subject body\nsearch 1 query\n4\nget_weather city units\nsend_email to body\nsearch query\ntranslate text", output: "CALL get_weather\nMISSING subject\nCALL search\nNO_SUCH_TOOL", explanation: "get_weather has both required args; send_email is missing subject; search is complete; translate was never registered." },
        { input: "1\nbook 2 date guests\n2\nbook guests\nbook date guests party", output: "MISSING date\nCALL book", explanation: "The first book call lacks date; the second supplies both required params (an extra param is fine)." },
      ],
      challenge_notes: "This validator is the schema contract enforced at runtime: a tool runs only when it exists and every required argument is present. Reporting the missing parameters by name, sorted for a stable output, is what lets the model self-correct on its next turn instead of failing blindly.",
      challenge_hints: [
        "Store each schema as a set of required parameter names keyed by tool name.",
        "For a call, build the set of supplied params and subtract it from the required set to find what's missing.",
        "Sort the missing parameter names before printing so the output is deterministic.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    schemas = {}
    # TODO: read n schemas into schemas[name] = set(required_params)

    q = int(data[idx].strip()); idx += 1
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        supplied = set(parts[1:])
        # TODO: NO_SUCH_TOOL / MISSING <sorted> / CALL <name>
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    schemas = {}
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        r = int(parts[1])
        required = set(parts[2:2 + r])
        schemas[name] = required
    q = int(data[idx].strip()); idx += 1
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        supplied = set(parts[1:])
        if name not in schemas:
            out.append("NO_SUCH_TOOL")
            continue
        missing = sorted(schemas[name] - supplied)
        if missing:
            out.append("MISSING " + " ".join(missing))
        else:
            out.append("CALL " + name)
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\nget_weather 2 city units\nsend_email 3 to subject body\nsearch 1 query\n4\nget_weather city units\nsend_email to body\nsearch query\ntranslate text", expected_output: "CALL get_weather\nMISSING subject\nCALL search\nNO_SUCH_TOOL", description: "A complete call, a missing-argument call, another complete call, and an unregistered tool." },
        { input: "1\nbook 2 date guests\n2\nbook guests\nbook date guests party", expected_output: "MISSING date\nCALL book", description: "Missing one required param, then a complete call with a harmless extra param." },
        { input: "2\nping 0\nnotify 1 msg\n3\nping\nnotify\nnotify msg", expected_output: "CALL ping\nMISSING msg\nCALL notify", description: "A tool with no required params always passes; notify needs msg." },
        { input: "1\nwipe 2 target confirm\n1\nwipe target", expected_output: "MISSING confirm", description: "A safety-critical confirm parameter is caught as missing before execution." }
      ]
    },
    {
      id: "ai-09-l7",
      project_id: "ai-09",
      order: 7,
      title: "Planning vs Reacting",
      concept: "Planning",
      xp_reward: 10,
      explanation: `Two agents get the same job: "research three competitors and write a summary." The first writes a full plan up front — list competitors, research each, then summarize — and marches through it. The second takes one step, looks at the result, decides the next step, and repeats. Both can work. They fail differently, cost differently, and shine on different tasks. This is the central design choice in agent building: **plan-then-execute** versus **reactive** looping.

## What it is

**Plan-then-execute** means the agent first turns the goal into a complete ordered plan, then carries it out step by step. The thinking happens up front, in one big burst.

**Reacting** (the ReAct style from earlier) means the agent decides only the *next* step, executes it, observes the result, and decides again. The thinking is spread across the whole task, one step at a time.

The difference is *when* the agent commits. A planner commits to the whole route before moving. A reactor commits to one move, sees what happens, then recommits.

## How it works

You can see the contrast in how each handles the same plan when a step fails:

\`\`\`python
plan = [("search", 1), ("reserve", 0), ("book", 1)]  # (step, succeeds?)

# plan-then-execute: a rigid plan aborts at the first failure
completed = 0
for name, ok in plan:
    if not ok:
        break          # the committed plan can't adapt
    completed += 1
# -> aborted after 1 step

# reactive: skip the failed step, observe, keep going
done = 0
for name, ok in plan:
    if ok:
        done += 1      # adapt around the failure
# -> completes 2 of 3 steps
\`\`\`

The planner is efficient when the world is predictable: it thinks once and executes fast. The reactor is robust when the world surprises it: every step is a fresh decision informed by the latest observation, so it can route around failures the planner would choke on. Many strong agents blend the two — make a rough plan, but re-plan reactively whenever an observation breaks an assumption.

## Why it matters

Picking the wrong style is a common, expensive mistake:

- **Plan-then-execute wins** on well-understood, multi-step tasks with stable inputs: generate a report, run a known pipeline. Fewer model calls, predictable order, easy to audit.
- **Reacting wins** on open-ended, uncertain tasks: web research, debugging, anything where each result changes what to do next. It adapts but costs more calls and can wander.
- **The failure modes differ.** A rigid plan breaks the moment reality diverges from it. A pure reactor can loop, drift, or lose the thread of the overall goal because it never committed to one.

## The mental model to keep

A planner is a chess player who calculates the whole line before touching a piece; a reactor is a boxer reading the opponent punch by punch. **Plan when the path is knowable; react when it is not — and the best agents do a bit of both.**`,
      key_terms: [
        { term: "Plan-then-execute", definition: "An agent strategy that builds a complete ordered plan first, then carries it out step by step." },
        { term: "Reactive (ReAct) looping", definition: "An agent strategy that decides only the next step, observes the result, then decides again." },
        { term: "Commitment point", definition: "When the agent locks in its choices: the whole route up front (planner) versus one move at a time (reactor)." },
        { term: "Re-planning", definition: "Revising or rebuilding the plan mid-task when an observation breaks an assumption; a hybrid of the two styles." }
      ],
      callouts: [
        { type: "analogy", title: "Chess player vs boxer", content: "A planner calculates the whole line before touching a piece. A reactor reads the opponent punch by punch. Both win games, but on very different kinds of opponents.", position: "before" },
        { type: "insight", title: "The best agents blend both", content: "Make a rough plan for direction, but stay ready to re-plan reactively the moment an observation breaks an assumption. Pure planning is brittle; pure reacting wanders.", position: "after" }
      ],
      concept_diagram: {
        title: "Where each style commits",
        steps: [
          { label: "Plan: think once", desc: "Turn the goal into a full ordered plan up front." },
          { label: "Plan: execute fast", desc: "March through the steps with few extra decisions." },
          { label: "React: one step", desc: "Decide and run only the next action." },
          { label: "React: observe, repeat", desc: "Read the result, then decide the next step again." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the core difference between plan-then-execute and reactive looping?",
          options: ["Reactive agents cannot use tools", "When the agent commits: the whole route up front, or one step at a time", "Planners are always faster on every task"],
          correct_index: 1,
          explanation: "A planner commits to the full plan before acting; a reactor commits to one step, observes, then decides again."
        }
      ],
      quiz_questions: [
        {
          question: "On which kind of task does plan-then-execute usually win?",
          options: [
            "Open-ended web research where each result changes the next step",
            "A well-understood, multi-step task with stable inputs, like generating a known report",
            "Tasks where the inputs are completely unknown",
            "Tasks that require no steps at all"
          ],
          correct_index: 1,
          explanation: "Up-front planning shines when the path is predictable: fewer model calls, a fixed order, and an auditable plan."
        },
        {
          question: "Why is a reactive agent more robust when results are surprising?",
          options: [
            "It never makes mistakes",
            "Each step is a fresh decision informed by the latest observation, so it can route around failures",
            "It uses fewer model calls than a planner",
            "It ignores observations entirely"
          ],
          correct_index: 1,
          explanation: "Because it decides one step at a time after seeing each result, a reactor can adapt to outcomes a rigid plan never anticipated."
        },
        {
          question: "What is the typical failure mode of a pure plan-then-execute agent?",
          options: [
            "It loops forever without committing",
            "It breaks the moment reality diverges from the committed plan",
            "It uses too few tokens to finish",
            "It cannot produce a plan at all"
          ],
          correct_index: 1,
          explanation: "A rigid plan assumes the world matches its expectations; when a step's reality differs, the plan has no way to adapt."
        }
      ],
      participation_activities: [
        {
          activity_title: "Planning vs reacting check",
          questions: [
            { question: "A reactive agent decides its entire sequence of steps before taking any action.", type: "true_false", correct_answer: "false", explanation: "A reactor decides only the next step, observes the result, then decides again. The planner is the one that commits up front." },
            { question: "Revising the plan mid-task when an observation breaks an assumption is called ______-planning.", type: "fill_in", correct_answer: "re", explanation: "Re-planning blends the two styles: a plan for direction, with reactive revision when reality diverges." }
          ]
        }
      ],
      starter_code: `# Contrast the two styles: a planner commits a full plan; a reactor decides step by step.
goal = "make tea"
plan = ["boil water", "add tea bag", "pour water", "wait 3 min"]

print("goal:", goal)
print("plan made up front:")
# TODO: print each step with its 1-based number, then "execute" the plan in order
#       and report how many of the steps were completed.
`,
      solution_code: `goal = "make tea"
plan = ["boil water", "add tea bag", "pour water", "wait 3 min"]

print("goal:", goal)
print("plan made up front:")
for i, step in enumerate(plan, 1):
    print(i, step)

done = []
for step in plan:
    done.append(step)
print("executed in order:", len(done), "of", len(plan))
`,
      expected_output: `goal: make tea
plan made up front:
1 boil water
2 add tea bag
3 pour water
4 wait 3 min
executed in order: 4 of 4`,
      step_throughs: [
        {
          title: "the same failure, two strategies",
          steps: [
            { label: "Goal and a plan", detail: "The agent's job is to book a trip. A planner writes the whole ordered plan before acting.", code: 'plan = ["search", "reserve", "book"]' },
            { label: "A step fails", detail: "The reserve step fails: the hotel is sold out. Reality just diverged from the plan.", code: 'reserve() -> "SOLD OUT"' },
            { label: "Planner: abort", detail: "A rigid plan-then-execute agent committed to the route up front. The failed step breaks it and it stops.", code: "plan aborts at step 2 of 3" },
            { label: "Reactor: adapt", detail: "A reactive agent observes the failure and decides a new next step instead of giving up, routing around the problem.", code: 'observe("SOLD OUT") -> search a different hotel' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You need an agent to generate a monthly sales report from a fixed, well-known sequence of steps. Which style fits best and why?',
          steps: [
            "The steps are stable and known in advance, so the path is predictable.",
            "Plan-then-execute thinks once and runs the steps in a fixed order.",
            "That means fewer model calls, a predictable sequence, and an easy-to-audit plan."
          ],
          output: "Plan-then-execute, because the path is known and stable."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'An agent doing open-ended web research keeps following a plan it made at the start, even as searches return surprising results. It produces a confident but wrong summary. What went wrong, and how would a better design fix it?',
          steps: [
            "Open-ended research is uncertain: each result should change what to do next.",
            "A pure plan-then-execute agent committed to its route up front and ignored the surprising observations.",
            "A reactive (ReAct) style would decide one step at a time, reading each result before choosing the next move.",
            "Best is a hybrid: keep a rough plan for direction but re-plan whenever an observation breaks an assumption.",
            "That way the agent adapts to what it actually finds instead of forcing reality into a stale plan."
          ],
          output: "It used rigid up-front planning on an uncertain task; switch to reactive looping, or a plan-plus-re-plan hybrid, so it adapts to each result."
        }
      ],
      comparison_tables: [
        {
          title: "plan-then-execute vs reactive",
          columns: ["Aspect", "Plan-then-execute", "Reactive (ReAct)"],
          rows: [
            { cells: ["When it decides", "Whole plan up front", "One step at a time"] },
            { cells: ["Model calls", "Fewer", "More (one per step)"] },
            { cells: ["Handles surprises", "Brittle, may abort", "Adapts to each result"] },
            { cells: ["Best for", "Known, stable tasks", "Open-ended, uncertain tasks"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which style fits the task?",
          bins: [
            { id: "plan", label: "Plan-then-execute" },
            { id: "react", label: "Reactive looping" }
          ],
          items: [
            { id: "i1", text: "Run a fixed monthly reporting pipeline", bin: "plan" },
            { id: "i2", text: "Debug a failing test where each clue changes the next move", bin: "react" },
            { id: "i3", text: "Generate a document from a known sequence of steps", bin: "plan" },
            { id: "i4", text: "Open-ended research across the live web", bin: "react" },
            { id: "i5", text: "A batch job with stable, predictable inputs", bin: "plan" },
            { id: "i6", text: "Negotiate a multi-turn task where outcomes are uncertain", bin: "react" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why might a hybrid that plans first but re-plans reactively beat either pure strategy?",
          sampleAnswer: "A pure plan is fast and orderly but brittle: it shatters the moment reality differs from what it assumed. A pure reactor adapts but can wander or loop because it never commits to an overall direction. A hybrid gets both strengths: the initial plan gives a clear direction and structure, while reactive re-planning lets the agent adjust whenever an observation breaks an assumption, so it stays on goal without being trapped by a stale plan."
        }
      ],
      hints: [
        "Use enumerate(plan, 1) to print each step with a 1-based number.",
        "Append each step to a 'done' list as you execute the plan in order.",
        "Report len(done) and len(plan) to show all steps completed."
      ],
      challenge_title: "Planner vs Reactor",
      challenge_description: "Run the same ordered plan two ways: a rigid plan-then-execute pass that aborts at the first failure, and a reactive pass that skips failures and keeps going.",
      challenge_story: "You're benchmarking two agent designs on the exact same task so you can pick the right one for production. The task is an ordered list of steps, and each step either **succeeds** or **fails** when attempted. The **plan-then-execute** agent commits to the whole plan up front: it runs steps in order and the instant one fails, the rigid plan aborts — it cannot adapt. The **reactive** agent decides step by step: when a step fails, it observes the failure, skips it, and presses on to the next step, attempting every step in the queue. Your job is to report how each design fares on the same plan so the team can see the trade-off in numbers.",
      challenge_statement: "Read **N** steps. Each step is a `name` and an integer `ok` (`1` means the step succeeds when attempted, `0` means it fails).\n\nSimulate both agents over the steps in order:\n\n- **Plan-then-execute:** count the steps completed from the start until the first failure. If a step has `ok = 0`, the plan aborts immediately and does not complete that step or any after it. The result is `DONE <c>` if all `N` steps completed, otherwise `ABORTED <c>`, where `c` is the number completed.\n- **Reactive:** attempt every step in order. Completed steps are those with `ok = 1`; failures are skipped but still attempted. Report `<completed> <attempts>`, where `attempts` is always `N`.\n\nPrint two lines: `PLAN <DONE|ABORTED> <c>` then `REACT <completed> <attempts>`.",
      challenge_input_format: "Line 1: integer `N`.\nNext `N` lines: `name ok` (ok is 0 or 1).",
      challenge_output_format: "Line 1: `PLAN DONE <c>` or `PLAN ABORTED <c>`.\nLine 2: `REACT <completed> <attempts>`.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "ok is 0 or 1",
        "Step names are tokens without spaces",
      ],
      challenge_examples: [
        { input: "3\nsearch 1\nbook 1\nnotify 1", output: "PLAN DONE 3\nREACT 3 3", explanation: "Every step succeeds, so the rigid plan finishes all 3 and the reactor completes all 3 of 3 attempts." },
        { input: "4\nsearch 1\nreserve 0\nbook 1\nnotify 1", output: "PLAN ABORTED 1\nREACT 3 4", explanation: "The plan aborts at the failed reserve after 1 completed step; the reactor skips reserve and completes the other 3 across 4 attempts." },
      ],
      challenge_notes: "This is the trade-off in numbers: the rigid plan is efficient but brittle (one failure ends it), while the reactor is robust but does more work (it attempts everything). Real agents often blend the two — plan for direction, react around failures.",
      challenge_hints: [
        "For the planner, loop the steps and break the moment you hit an ok of 0; count completions before the break.",
        "For the reactor, attempts is always N; completed is just the count of steps with ok == 1.",
        "PLAN is DONE only when the completed count equals N, otherwise ABORTED.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    plan = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        plan.append((parts[0], int(parts[1])))

    # TODO: plan-then-execute completes until the first failure
    # TODO: reactive attempts every step, completing the ok == 1 ones
    print("PLAN ...")
    print("REACT ...")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    plan = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        plan.append((parts[0], int(parts[1])))

    plan_completed = 0
    for name, ok in plan:
        if ok == 0:
            break
        plan_completed += 1
    plan_result = "DONE" if plan_completed == n else "ABORTED"

    react_completed = 0
    react_attempts = 0
    for name, ok in plan:
        react_attempts += 1
        if ok == 1:
            react_completed += 1

    print("PLAN " + plan_result + " " + str(plan_completed))
    print("REACT " + str(react_completed) + " " + str(react_attempts))

main()
`,
      challenge_test_cases: [
        { input: "3\nsearch 1\nbook 1\nnotify 1", expected_output: "PLAN DONE 3\nREACT 3 3", description: "All steps succeed: both designs complete everything." },
        { input: "4\nsearch 1\nreserve 0\nbook 1\nnotify 1", expected_output: "PLAN ABORTED 1\nREACT 3 4", description: "A mid-plan failure aborts the planner but the reactor routes around it." },
        { input: "2\na 0\nb 1", expected_output: "PLAN ABORTED 0\nREACT 1 2", description: "An immediate failure means the planner completes nothing; the reactor still finishes the later step." }
      ]
    },
    {
      id: "ai-09-l8",
      project_id: "ai-09",
      order: 8,
      title: "Human-in-the-Loop and Approvals",
      concept: "Approvals",
      xp_reward: 10,
      explanation: `In 2024 an experimental coding agent, told to "clean up the project," confidently ran a command that wiped a developer's uncommitted work. The agent did exactly what it decided was right. The problem was that nobody stood between its decision and the irreversible action. The fix is not a smarter model — it is an **approval gate**: a checkpoint where a human says yes before the agent does anything it cannot take back.

## What it is

**Human-in-the-loop** (HITL) means inserting a person's approval into the agent's action loop for high-stakes steps. The agent does not execute a gated action directly. It **proposes** the action, the runtime **pauses**, a human **approves or rejects**, and only an approved action runs.

The key idea is sorting actions by risk. Reading a file, searching the web, doing math — low stakes, run freely. Sending money, deleting data, emailing customers, deploying code — high stakes, gate them. You are drawing a line between actions that are *reversible and cheap* and actions that are *irreversible or expensive*.

## How it works

The runtime keeps a set of risky tools. Before executing any proposed action, it checks: is this tool risky, and if so, did a human approve it?

\`\`\`python
RISKY = {"delete_file", "send_payment"}

def run_with_approval(tool, approved):
    if tool in RISKY and not approved:
        return "BLOCKED: " + tool + " needs approval"
    return "RAN: " + tool

print(run_with_approval("read_file", False))    # RAN: read_file
print(run_with_approval("delete_file", False))  # BLOCKED
print(run_with_approval("delete_file", True))   # RAN: delete_file
\`\`\`

A safe approval gate has three properties. It **defaults to blocking** — an unrecognized or unapproved risky action does not run. It **shows the human the exact action**, including arguments, so they approve what will really happen, not a vague summary. And it **logs the decision**, so there is a record of who approved what.

## Why it matters

Approvals are how you give an agent real power without handing it a loaded gun:

- **They stop irreversible mistakes.** A wrong reversible action wastes a few cents; a wrong irreversible one deletes data or sends money. The gate is exactly where the cost of being wrong is highest.
- **They keep accountability with a person.** When an agent proposes and a human disposes, there is always someone responsible for the consequential action.
- **They are a dial, not a switch.** Gate too many actions and the agent is useless and annoying; gate too few and it is dangerous. Good design gates precisely the irreversible-or-expensive set and lets the rest run.

The trade-off is friction and speed: every gate is a place the agent must stop and wait for a human. You spend that friction only where the downside justifies it.

## The mental model to keep

The agent proposes; the human disposes. **Let it run anything reversible on its own, but put a human's yes in front of every action it cannot take back.** Default to blocking, show the real action, and keep the log.`,
      key_terms: [
        { term: "Human-in-the-loop (HITL)", definition: "A design where a person approves an agent's high-stakes actions before they execute." },
        { term: "Approval gate", definition: "A checkpoint in the agent loop that pauses a risky action until a human approves it." },
        { term: "Risky / irreversible action", definition: "An action that is expensive or cannot be undone, like sending money or deleting data." },
        { term: "Default-deny", definition: "Treating an unrecognized or unapproved risky action as blocked rather than allowed." }
      ],
      callouts: [
        { type: "warning", title: "Irreversible is the line", content: "The actions that most need a gate are the ones you cannot take back: deleting data, sending money, emailing customers. A wrong reversible action is cheap; a wrong irreversible one is a disaster.", position: "before" },
        { type: "tip", title: "Show the exact action", content: "Approve the real call, arguments and all, not a vague summary. 'Send email' is not enough; 'send email to all-customers@ saying X' is what the human must actually see and approve.", position: "after" }
      ],
      concept_diagram: {
        title: "An action passing through an approval gate",
        steps: [
          { label: "Agent proposes", desc: "The agent decides on an action and its arguments." },
          { label: "Classify risk", desc: "Runtime checks if the tool is in the risky set." },
          { label: "Pause for human", desc: "If risky, show the exact action and wait for a yes or no." },
          { label: "Run or block", desc: "Execute only on approval; otherwise block and log it." }
        ]
      },
      inline_quizzes: [
        {
          question: "In a human-in-the-loop design, what happens to a high-stakes action the agent wants to take?",
          options: ["It runs immediately like any other action", "It is proposed and paused until a human approves it", "It is permanently forbidden"],
          correct_index: 1,
          explanation: "The agent proposes the risky action; the runtime pauses and a human approves or rejects before it runs."
        }
      ],
      quiz_questions: [
        {
          question: "Which kind of action most justifies a human approval gate?",
          options: [
            "Reading a file the agent already has access to",
            "An irreversible or expensive action like sending money or deleting data",
            "Doing arithmetic with a calculator tool",
            "Searching the web for public information"
          ],
          correct_index: 1,
          explanation: "Gates belong on actions that cannot be undone or that cost a lot, because that is where being wrong is most costly."
        },
        {
          question: "Why should an approval gate 'default to blocking'?",
          options: [
            "To make the agent run faster",
            "So an unrecognized or unapproved risky action does not run by accident",
            "Because models cannot propose actions",
            "To remove the need for a human entirely"
          ],
          correct_index: 1,
          explanation: "Default-deny means the safe outcome (not running) happens unless a human explicitly approves the risky action."
        },
        {
          question: "What is the main trade-off of adding approval gates?",
          options: [
            "The agent becomes less safe",
            "Friction and speed: every gate is a place the agent must stop and wait for a human",
            "The model loses access to all tools",
            "Approved actions can no longer be logged"
          ],
          correct_index: 1,
          explanation: "Each gate pauses the agent for a human, so gating too much makes it slow and annoying; you gate only where the downside justifies it."
        }
      ],
      participation_activities: [
        {
          activity_title: "Approvals check",
          questions: [
            { question: "A well-designed agent should require human approval before every single action, including reading a file.", type: "true_false", correct_answer: "false", explanation: "Only high-stakes, irreversible or expensive actions need a gate; low-stakes reversible actions can run freely." },
            { question: "Treating an unapproved risky action as blocked rather than allowed is called default-______.", type: "fill_in", correct_answer: "deny", explanation: "Default-deny ensures the safe outcome happens unless a human explicitly approves." }
          ]
        }
      ],
      starter_code: `# Gate risky tools behind human approval; let safe tools run freely.
RISKY = {"delete_file", "send_payment"}

def run_with_approval(tool, approved):
    # TODO: if the tool is risky and not approved, return "BLOCKED: <tool> needs approval".
    #       Otherwise return "RAN: <tool>".
    return "?"

print(run_with_approval("read_file", False))
`,
      solution_code: `RISKY = {"delete_file", "send_payment"}

def run_with_approval(tool, approved):
    if tool in RISKY and not approved:
        return "BLOCKED: " + tool + " needs approval"
    return "RAN: " + tool

print(run_with_approval("read_file", False))
print(run_with_approval("delete_file", False))
print(run_with_approval("delete_file", True))
`,
      expected_output: `RAN: read_file
BLOCKED: delete_file needs approval
RAN: delete_file`,
      step_throughs: [
        {
          title: "a risky action passing through the gate",
          steps: [
            { label: "Agent proposes an action", detail: "The agent decides to delete a file as part of 'cleaning up'. It proposes the action with its arguments.", code: 'propose("delete_file", {"path": "src/"})' },
            { label: "Runtime classifies the risk", detail: "The runtime checks its set of risky tools. delete_file is irreversible, so it is gated.", code: '"delete_file" in RISKY  # True' },
            { label: "Pause and show the human", detail: "Instead of running, the runtime pauses and shows the exact action and arguments for a yes or no.", code: 'ask_human("delete src/ ? [y/N]")' },
            { label: "Run only on approval", detail: "If the human approves, it runs; if not, it is blocked and logged. Default is to block.", code: 'approved -> run; else -> "BLOCKED"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'An agent has tools search_web, read_file, and transfer_money. Which should sit behind a human approval gate?',
          steps: [
            "search_web and read_file are reversible and low-stakes, so they can run freely.",
            "transfer_money is irreversible and expensive, so a wrong call is a disaster.",
            "Gate transfer_money behind human approval; leave the other two ungated."
          ],
          output: "Gate transfer_money; let search_web and read_file run without approval."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A team gates every action behind approval, including reads, to "be safe." Operators are now overwhelmed and start clicking approve on everything without reading. Why did the over-gating backfire, and what is the fix?',
          steps: [
            "Gating low-stakes reversible actions adds friction without reducing real risk.",
            "Flooded with approval prompts, humans stop reading and rubber-stamp them all.",
            "That rubber-stamping defeats the purpose: the truly dangerous actions now slip through unexamined too.",
            "The fix is to gate only the irreversible-or-expensive set, so each approval prompt is rare and worth genuine attention.",
            "Fewer, meaningful gates keep humans actually engaged where it matters."
          ],
          output: "Over-gating caused approval fatigue and rubber-stamping; gate only irreversible or expensive actions so each prompt gets real attention."
        }
      ],
      comparison_tables: [
        {
          title: "ungated agent vs human-in-the-loop",
          columns: ["Aspect", "No approval gate", "Human-in-the-loop"],
          rows: [
            { cells: ["Risky action", "Runs immediately", "Paused until a human approves"] },
            { cells: ["Wrong irreversible action", "Happens silently", "Stopped at the gate"] },
            { cells: ["Accountability", "Unclear", "A person approves each high-stakes step"] },
            { cells: ["Blast radius of a mistake", "Full and irreversible", "Bounded to approved actions"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "gate it or let it run?",
          bins: [
            { id: "gate", label: "Needs human approval" },
            { id: "free", label: "Can run freely" }
          ],
          items: [
            { id: "i1", text: "Delete a production database table", bin: "gate" },
            { id: "i2", text: "Read a public documentation page", bin: "free" },
            { id: "i3", text: "Send a payment to a vendor", bin: "gate" },
            { id: "i4", text: "Run a calculator on two numbers", bin: "free" },
            { id: "i5", text: "Email every customer on the list", bin: "gate" },
            { id: "i6", text: "Search the web for an article", bin: "free" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is gating only the irreversible actions better than gating every action an agent takes?",
          sampleAnswer: "Gating every action floods the human with approval requests, most of them for harmless reversible steps. People stop reading and start rubber-stamping, so the dangerous actions slip through unexamined along with the safe ones. Gating only irreversible or expensive actions keeps the prompts rare and meaningful, so a human actually pays attention exactly where being wrong would be catastrophic, while the agent stays useful by running everything else on its own."
        }
      ],
      hints: [
        "Check membership with `tool in RISKY`.",
        "Block only when the tool is risky AND not approved; otherwise it runs.",
        "Build the return strings by concatenating the tool name into the message."
      ],
      challenge_title: "The Approval Gate",
      challenge_description: "Run a queue of proposed agent actions through an approval gate, executing safe ones freely, gating risky ones on human approval, and tallying the outcome.",
      challenge_story: "Your agent is getting access to real systems, so an approval gate now sits between its decisions and execution. You hold a list of **risky** tools — the irreversible or expensive ones. For every action the agent proposes, the gate decides: if the tool is not risky, it runs immediately; if it is risky, it runs only when a human **approve**s it, and is **BLOCKED** otherwise (default-deny). You must print what happens to each proposed action in order, then a final summary of how many ran and how many were blocked — the audit trail that proves nothing dangerous slipped through unapproved.",
      challenge_statement: "First read **M** risky tool names, one per line. Then read **Q** proposed actions, each a tool `name` and a `decision` (`approve` or `deny`; safe tools may also carry `none`).\n\nFor each proposed action, in order:\n\n- If the tool is **not** in the risky set, print `EXECUTE <name>` (it runs regardless of the decision field).\n- If the tool **is** risky and the decision is `approve`, print `EXECUTE <name>`.\n- If the tool **is** risky and the decision is anything other than `approve`, print `BLOCKED <name>` (default-deny).\n\nAfter all actions, print `SUMMARY <e> executed <b> blocked`, where `e` and `b` count the EXECUTE and BLOCKED lines.",
      challenge_input_format: "Line 1: integer `M`, the number of risky tools.\nNext `M` lines: one risky tool name each.\nNext line: integer `Q`.\nNext `Q` lines: `name decision`.",
      challenge_output_format: "`Q` lines (`EXECUTE <name>` or `BLOCKED <name>`), then a final line `SUMMARY <e> executed <b> blocked`.",
      challenge_constraints: [
        "0 ≤ M ≤ 100",
        "1 ≤ Q ≤ 1000",
        "Tool names are lowercase tokens without spaces",
        "decision is one of approve, deny, or none",
      ],
      challenge_examples: [
        { input: "2\ndelete_file\nsend_payment\n4\nread_file none\ndelete_file approve\nsend_payment deny\ndelete_file none", output: "EXECUTE read_file\nEXECUTE delete_file\nBLOCKED send_payment\nBLOCKED delete_file\nSUMMARY 2 executed 2 blocked", explanation: "read_file is safe so it runs; delete_file with approve runs; send_payment denied and delete_file with no approval are blocked." },
        { input: "1\ndrop_table\n2\nsearch none\ndrop_table deny", output: "EXECUTE search\nBLOCKED drop_table\nSUMMARY 1 executed 1 blocked", explanation: "search is not risky and runs; drop_table is risky and was not approved, so it is blocked." },
      ],
      challenge_notes: "This is the human-in-the-loop pattern as runtime code: safe actions flow through, risky ones need an explicit yes, and the default for a risky action is to block. The summary is the audit trail — proof that every executed risky action was approved.",
      challenge_hints: [
        "Store the risky tools in a set for O(1) membership checks.",
        "An action runs if the tool is not risky, OR it is risky and the decision is exactly 'approve'.",
        "Keep two counters and print the SUMMARY line after processing every action.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    risky = set()
    # TODO: read m risky tool names into the set

    q = int(data[idx].strip()); idx += 1
    executed = 0
    blocked = 0
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        decision = parts[1] if len(parts) > 1 else ""
        # TODO: EXECUTE safe tools and approved risky tools; BLOCKED otherwise
    out.append("SUMMARY " + str(executed) + " executed " + str(blocked) + " blocked")
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    risky = set()
    for _ in range(m):
        risky.add(data[idx].strip()); idx += 1
    q = int(data[idx].strip()); idx += 1
    executed = 0
    blocked = 0
    out = []
    for _ in range(q):
        parts = data[idx].split(); idx += 1
        name = parts[0]
        decision = parts[1] if len(parts) > 1 else ""
        if name in risky and decision != "approve":
            out.append("BLOCKED " + name)
            blocked += 1
        else:
            out.append("EXECUTE " + name)
            executed += 1
    out.append("SUMMARY " + str(executed) + " executed " + str(blocked) + " blocked")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "2\ndelete_file\nsend_payment\n4\nread_file none\ndelete_file approve\nsend_payment deny\ndelete_file none", expected_output: "EXECUTE read_file\nEXECUTE delete_file\nBLOCKED send_payment\nBLOCKED delete_file\nSUMMARY 2 executed 2 blocked", description: "A safe tool, an approved risky tool, and two unapproved risky tools." },
        { input: "1\ndrop_table\n2\nsearch none\ndrop_table deny", expected_output: "EXECUTE search\nBLOCKED drop_table\nSUMMARY 1 executed 1 blocked", description: "Safe action runs; denied risky action is blocked." },
        { input: "0\n3\na none\nb none\nc none", expected_output: "EXECUTE a\nEXECUTE b\nEXECUTE c\nSUMMARY 3 executed 0 blocked", description: "With no risky tools registered, every action runs freely." },
        { input: "1\npay\n3\npay approve\npay approve\npay deny", expected_output: "EXECUTE pay\nEXECUTE pay\nBLOCKED pay\nSUMMARY 2 executed 1 blocked", description: "The same risky tool runs when approved and is blocked when denied." }
      ]
    }
  ]
};
