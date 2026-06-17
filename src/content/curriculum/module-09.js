export default {
  project: {
    id: "ai-09",
    title: "AI Agents & Tool Use",
    description: "Go beyond chat: learn how language models call tools, loop through reasoning and action, plan multi-step tasks, and where agents break so you can build them safely.",
    difficulty: "intermediate",
    category: "chatbots_agents",
    estimated_time: 55,
    lessons_count: 5,
    tags: ["agents", "tool-use", "react", "planning", "guardrails"],
    order: 9,
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
      challenge_title: "Add a second tool",
      challenge_description: "Extend run_tool so it also handles a 'square' tool that returns arg * arg. Then call run_tool twice: square 5, and double 10, printing each result.",
      challenge_starter_code: `def run_tool(name, arg):
    if name == "double":
        return arg * 2
    # TODO: handle a "square" tool that returns arg * arg

# TODO: call run_tool for square 5 and double 10, printing each result.
`,
      challenge_solution_code: `def run_tool(name, arg):
    if name == "double":
        return arg * 2
    if name == "square":
        return arg * arg

print(run_tool("square", 5))
print(run_tool("double", 10))
`,
      challenge_test_cases: [
        { input: "square 5, double 10", expected_output: "25\n20", description: "square 5 = 25, double 10 = 20." }
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
      challenge_title: "Route to the right tool",
      challenge_description: "Write run_call(call) that takes a dict with 'name' and 'arguments'. If name is 'add', return the sum of arguments a and b. If name is 'multiply', return their product. Test both and print the results.",
      challenge_starter_code: `def run_call(call):
    name = call["name"]
    args = call["arguments"]
    # TODO: handle 'add' and 'multiply' using args["a"] and args["b"]

print(run_call({"name": "add", "arguments": {"a": 3, "b": 4}}))
print(run_call({"name": "multiply", "arguments": {"a": 3, "b": 4}}))
`,
      challenge_solution_code: `def run_call(call):
    name = call["name"]
    args = call["arguments"]
    if name == "add":
        return args["a"] + args["b"]
    if name == "multiply":
        return args["a"] * args["b"]

print(run_call({"name": "add", "arguments": {"a": 3, "b": 4}}))
print(run_call({"name": "multiply", "arguments": {"a": 3, "b": 4}}))
`,
      challenge_test_cases: [
        { input: "add a=3 b=4, multiply a=3 b=4", expected_output: "7\n12", description: "add 3+4 = 7, multiply 3*4 = 12." }
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
      challenge_title: "Build a two-step ReAct trace",
      challenge_description: "Write react(question) that returns a list of trace lines. For 'capital population of Peru', append: a Thought, an Action find_capital('Peru') giving 'Lima', a Thought, an Action find_population('Lima') giving '9700000', and a final Answer line. Print each line.",
      challenge_starter_code: `def find_capital(country):
    return {"Peru": "Lima"}[country]

def find_population(city):
    return {"Lima": "9700000"}[city]

def react(question):
    trace = []
    # TODO: build Thought/Action/Observation lines, end with an Answer line
    return trace

for line in react("capital population of Peru"):
    print(line)
`,
      challenge_solution_code: `def find_capital(country):
    return {"Peru": "Lima"}[country]

def find_population(city):
    return {"Lima": "9700000"}[city]

def react(question):
    trace = []
    trace.append("Thought: find the capital first")
    cap = find_capital("Peru")
    trace.append("Observation: " + cap)
    trace.append("Thought: now find its population")
    pop = find_population(cap)
    trace.append("Observation: " + pop)
    trace.append("Answer: " + cap + " has about " + pop + " people")
    return trace

for line in react("capital population of Peru"):
    print(line)
`,
      challenge_test_cases: [
        { input: "capital population of Peru", expected_output: "Thought: find the capital first\nObservation: Lima\nThought: now find its population\nObservation: 9700000\nAnswer: Lima has about 9700000 people", description: "Two reason-act-observe cycles ending in an answer." }
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
      challenge_title: "Run a dependent plan",
      challenge_description: "Write run_plan(plan, steps) where steps is a dict mapping each step name to a function taking memory and returning a result. Execute the plan in order, saving each result in a memory dict under its name, and return the memory dict.",
      challenge_starter_code: `def run_plan(plan, steps):
    memory = {}
    # TODO: for each step in plan, call steps[step](memory), save in memory
    return memory

steps = {
    "fetch": lambda m: "data",
    "process": lambda m: m["fetch"] + "-clean",
}
print(run_plan(["fetch", "process"], steps))
`,
      challenge_solution_code: `def run_plan(plan, steps):
    memory = {}
    for step in plan:
        memory[step] = steps[step](memory)
    return memory

steps = {
    "fetch": lambda m: "data",
    "process": lambda m: m["fetch"] + "-clean",
}
print(run_plan(["fetch", "process"], steps))
`,
      challenge_test_cases: [
        { input: "plan=[fetch, process]", expected_output: "{'fetch': 'data', 'process': 'data-clean'}", description: "process reads the fetch result from memory, proving results carry forward." }
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
      challenge_title: "Enforce a step limit",
      challenge_description: "Write run_agent(decide, max_steps) that loops at most max_steps times, calling decide(step) each pass. If decide returns 'done', stop and return ('finished', steps_run). If the cap is hit first, return ('stopped', steps_run).",
      challenge_starter_code: `def run_agent(decide, max_steps):
    # TODO: loop up to max_steps; return ('finished', n) if decide=='done',
    #       otherwise ('stopped', n) when the cap is reached.
    pass

print(run_agent(lambda s: "go", 3))       # never finishes
print(run_agent(lambda s: "done", 3))     # finishes immediately
`,
      challenge_solution_code: `def run_agent(decide, max_steps):
    steps_run = 0
    for step in range(max_steps):
        steps_run += 1
        if decide(step) == "done":
            return ("finished", steps_run)
    return ("stopped", steps_run)

print(run_agent(lambda s: "go", 3))
print(run_agent(lambda s: "done", 3))
`,
      challenge_test_cases: [
        { input: "decide always 'go', max_steps=3", expected_output: "('stopped', 3)", description: "Never finishes, so the cap stops it after 3 steps." },
        { input: "decide always 'done', max_steps=3", expected_output: "('finished', 1)", description: "Finishes on the first step, before the cap." }
      ]
    }
  ]
};
