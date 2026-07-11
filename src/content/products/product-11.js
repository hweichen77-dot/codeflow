export default {
  project: {
    id: "prod-11",
    title: "Multi-Step Task Agent",
    description:
      "Build an agent that turns a goal into an ordered plan, executes each step with the right tool, and knows when to stop on its own. You'll wire up a tool registry, resolve step-to-step data references, track state as the plan runs, and harden the loop against dependency cycles, tool failures, and infinite loops.",
    difficulty: "advanced",
    category: "chatbots_agents",
    estimated_time: 130,
    lessons_count: 8,
    tags: ["agents", "planning", "tool-use", "task-decomposition", "state-tracking", "stopping-conditions"],
    order: 111,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-11-1",
      project_id: "prod-11",
      order: 1,
      title: "The Plan-Then-Act Loop",
      concept: "plan-then-act architecture",
      explanation: `A chatbot answers one turn at a time. A **multi-step task agent** is different: you hand it a goal like "research three competitors and write a comparison table," and it has to figure out *what steps that takes*, run them in order, and stop when it's actually done. This guide builds the shape everything else hangs on: **plan, then act**.

## What we're building

By lesson 8 you'll have a working agent: give it a goal, it produces an ordered plan, executes each step with the right tool, carries results forward, and knows when to stop. That's four moving parts, plan, execute, track state, and stop, and this lesson is only the first: getting the model to turn a goal into a plan you can actually run.

## Plan-then-act, not act-then-hope

A naive "agent" just asks the model "what should I do next?" one step at a time, with no view of the whole task. That drifts: it repeats work, forgets the goal, or wanders off. A **plan-then-act** agent instead asks the model up front to break the goal into an ordered list of steps, before touching a single tool. Only then does it execute that plan step by step.

\`\`\`python
import json
from anthropic import Anthropic

client = Anthropic()

PLANNER_SYSTEM = """You are a task planner.
Break the user's goal into an ordered list of steps.
Return ONLY a JSON array, no prose, where each item has:
- "step": an integer, starting at 1
- "tool": which tool this step uses (search, calculate, write_file)
- "instruction": what to do in this step
Keep it to 2-6 steps."""

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system=PLANNER_SYSTEM,
    messages=[{"role": "user", "content": "Find the population of Tokyo and double it."}],
)
plan = json.loads(resp.content[0].text)
\`\`\`

That \`plan\` is now a list of dicts like \`{"step": 1, "tool": "search", "instruction": "..."}\`. It's data, not prose, which is exactly what an executor needs to loop over.

## Why a plan first

Planning up front buys you three things an act-then-hope loop doesn't have: you can **validate** the plan before spending a single tool call (are the tool names real? is the step order sane?), you can **show** it to a user for approval on anything risky, and you can **track progress** against it, "on step 3 of 5," instead of guessing whether the agent is almost done or lost.

## The mental model to keep

A plan is a recipe, not a conversation. The planner call happens once, up front; it decides what needs to happen. Everything after that is mechanical: work through the recipe, step by step, checking off each one. Below, you'll validate a plan's shape in pure Python, no network, so you know exactly what a plan step must contain before your executor ever touches it.`,
      starter_code: `# A plan is a list of step dicts. Validate its shape before executing anything.

plan = [
    {"step": 1, "tool": "search", "instruction": "Find Tokyo's population."},
    {"step": 2, "tool": "calculate", "instruction": "Double the population."},
]

REQUIRED_KEYS = {"step", "tool", "instruction"}

def validate_plan(plan):
    # TODO: check plan is a non-empty list
    # TODO: check every item has exactly REQUIRED_KEYS (no missing or extra keys)
    # TODO: check "step" values are 1, 2, 3, ... in order with no gaps
    # TODO: return True if all checks pass, else False
    pass

print(validate_plan(plan))
`,
      solution_code: `# A plan is a list of step dicts. Validate its shape before executing anything.

plan = [
    {"step": 1, "tool": "search", "instruction": "Find Tokyo's population."},
    {"step": 2, "tool": "calculate", "instruction": "Double the population."},
]

REQUIRED_KEYS = {"step", "tool", "instruction"}

def validate_plan(plan):
    if not isinstance(plan, list) or not plan:
        return False
    for i, item in enumerate(plan, start=1):
        if set(item.keys()) != REQUIRED_KEYS:
            return False
        if item["step"] != i:
            return False
    return True

print(validate_plan(plan))

bad_plan = [
    {"step": 1, "tool": "search", "instruction": "Find it."},
    {"step": 3, "tool": "calculate", "instruction": "Double it."},
]
print(validate_plan(bad_plan))
print("empty:", validate_plan([]))
`,
      hints: [
        "Compare set(item.keys()) to REQUIRED_KEYS to catch both missing and extra keys.",
        "Use enumerate(plan, start=1) so the expected step number lines up with the position.",
        "A plan of length zero should fail the 'non-empty' check before you even loop.",
      ],
      challenge_title: "Validate a Plan's Step Order and Tools",
      challenge_description:
        "Check that a plan's steps are numbered sequentially and every tool name is one the agent actually knows.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    ALLOWED = {"search", "calculate", "write_file"}
    # parse done: read n lines, each "step_number tool_name"

    expected = 1
    for i in range(1, n + 1):
        step_str, tool = data[i].split()
        step = int(step_str)
        # TODO: if step != expected OR tool not in ALLOWED, print "INVALID"
        #       then the 1-based position (i) of this line, and stop.
        # TODO: otherwise increment 'expected' and keep going.

    # TODO: if every line passed, print "VALID".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    ALLOWED = {"search", "calculate", "write_file"}

    expected = 1
    for i in range(1, n + 1):
        step_str, tool = data[i].split()
        step = int(step_str)
        if step != expected or tool not in ALLOWED:
            print("INVALID")
            print(i)
            return
        expected += 1

    print("VALID")

main()
`,
      challenge_test_cases: [
        {
          input: "3\n1 search\n2 calculate\n3 write_file",
          expected_output: "VALID",
          description: "Sequential steps with allowed tools pass validation.",
        },
        {
          input: "2\n1 search\n3 calculate",
          expected_output: "INVALID\n2",
          description: "The second line skips from step 1 to step 3, breaking the sequence.",
        },
        {
          input: "2\n1 search\n2 email",
          expected_output: "INVALID\n2",
          description: "'email' is not in the allowed tool set, so line 2 fails.",
        },
        {
          input: "1\n1 search",
          expected_output: "VALID",
          description: "Edge: a single valid step passes.",
        },
      ],
    },

    {
      id: "prod-11-2",
      project_id: "prod-11",
      order: 2,
      title: "Giving the Agent Tools",
      concept: "tool registry and dispatch",
      explanation: `You have a plan, and each step names a tool: "search," "calculate," "write_file." But a tool name is just a string in a JSON blob until you wire it to real code. This lesson builds the **tool registry**, the mapping from a tool's name to the Python function that actually does the work.

## Defining tools for the model

The Anthropic API lets the model choose to call a tool by describing each one with a name, a description, and an input schema:

\`\`\`python
tools = [
    {
        "name": "search",
        "description": "Search the web for a query and return the top result text.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "calculate",
        "description": "Evaluate a simple arithmetic expression.",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string"}},
            "required": ["expression"],
        },
    },
]

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    tools=tools,
    messages=[{"role": "user", "content": "Find the population of Tokyo."}],
)
\`\`\`

When the model decides to use a tool, its reply contains a \`tool_use\` content block with a \`name\` and an \`input\` dict, the model's guess at the arguments. Your job is to take that name and dispatch it to the matching Python function, whether it came from a live tool-choice reply or from a planned step's \`"tool"\` field.

## The registry pattern

A **tool registry** is a plain dict from tool name to function. Dispatching a step is one lookup and one call:

\`\`\`python
TOOL_REGISTRY = {
    "search": search,
    "calculate": calculate,
    "write_file": write_file,
}

def dispatch(tool_name, args):
    if tool_name not in TOOL_REGISTRY:
        return "ERROR: unknown tool"
    tool_fn = TOOL_REGISTRY[tool_name]
    return tool_fn(**args)
\`\`\`

Every step in every plan, no matter what it does, goes through this exact same two-line dispatch. That uniformity is the point: the executor never needs a chain of \`if tool == "search": ... elif tool == "calculate": ...\`, it just looks the name up.

## Why guard the unknown case

A planner can hallucinate a tool name that was never registered, "browse_web" instead of "search." Without the registry check, that crashes with a raw \`KeyError\` deep inside your executor. With it, dispatch returns a clean error string the agent can log, retry with a corrected plan, or treat as a failed step, exactly the kind of graceful failure a real tool needs.

## The mental model

The registry is your agent's toolbox. A plan step is a slip of paper naming a tool; dispatch is the hand that reaches into the toolbox, finds it by name, and hands it the arguments. Below, you'll build that registry and dispatcher in pure Python, and see the unknown-tool guard fire.`,
      starter_code: `def search(query):
    return f"[search result for '{query}']"

def calculate(a, b, op):
    if op == "add":
        return a + b
    if op == "multiply":
        return a * b
    return None

def write_file(name, content):
    return f"wrote {len(content)} chars to {name}"

TOOL_REGISTRY = {
    "search": search,
    "calculate": calculate,
    "write_file": write_file,
}

def dispatch(tool_name, args):
    # TODO: if tool_name isn't a key in TOOL_REGISTRY, return "ERROR: unknown tool"
    # TODO: otherwise look up the function and call it with args as keyword arguments
    pass

print(dispatch("calculate", {"a": 3, "b": 4, "op": "add"}))
print(dispatch("email", {}))
`,
      solution_code: `def search(query):
    return f"[search result for '{query}']"

def calculate(a, b, op):
    if op == "add":
        return a + b
    if op == "multiply":
        return a * b
    return None

def write_file(name, content):
    return f"wrote {len(content)} chars to {name}"

TOOL_REGISTRY = {
    "search": search,
    "calculate": calculate,
    "write_file": write_file,
}

def dispatch(tool_name, args):
    if tool_name not in TOOL_REGISTRY:
        return "ERROR: unknown tool"
    tool_fn = TOOL_REGISTRY[tool_name]
    return tool_fn(**args)

print(dispatch("calculate", {"a": 3, "b": 4, "op": "add"}))
print(dispatch("search", {"query": "Tokyo population"}))
print(dispatch("email", {}))
`,
      hints: [
        "Check membership with 'tool_name not in TOOL_REGISTRY' before doing anything else.",
        "Call the looked-up function with **args to unpack the dict into keyword arguments.",
        "The unknown-tool string must match exactly: 'ERROR: unknown tool'.",
      ],
      challenge_title: "Dispatch to the Tool Registry",
      challenge_description:
        "Route each request line to the matching pure-Python tool and print its result, or flag an unknown tool.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    # Each of the next n lines: "tool_name key1=val1 key2=val2 ..."
    # Known tools: add (args a, b as ints) -> sum
    #              upper (args text)       -> uppercase text
    #              reverse (args text)     -> reversed text
    # Anything else -> print "UNKNOWN_TOOL"

    for i in range(1, n + 1):
        parts = data[i].split()
        tool = parts[0]
        args = dict(kv.split("=", 1) for kv in parts[1:])
        # TODO: dispatch based on 'tool' and print the result for this line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())

    for i in range(1, n + 1):
        parts = data[i].split()
        tool = parts[0]
        args = dict(kv.split("=", 1) for kv in parts[1:])

        if tool == "add":
            print(int(args["a"]) + int(args["b"]))
        elif tool == "upper":
            print(args["text"].upper())
        elif tool == "reverse":
            print(args["text"][::-1])
        else:
            print("UNKNOWN_TOOL")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nadd a=3 b=4\nupper text=hello\nemail x=1",
          expected_output: "7\nHELLO\nUNKNOWN_TOOL",
          description: "Two known tools resolve; the third has no registered tool.",
        },
        {
          input: "1\nreverse text=abcd",
          expected_output: "dcba",
          description: "Reverse flips the characters of the given text.",
        },
        {
          input: "2\nadd a=10 b=-3\nreverse text=claude",
          expected_output: "7\nedualc",
          description: "Negative arguments and reversal both work through the same dispatcher.",
        },
      ],
    },

    {
      id: "prod-11-3",
      project_id: "prod-11",
      order: 3,
      title: "Decomposing a Goal Into Ordered Steps",
      concept: "task decomposition and dependencies",
      explanation: `Not every step in a plan is independent. "Calculate the total" needs the numbers "search for prices" found first. A real plan isn't just a numbered list, it's a small dependency graph, and your executor has to run steps in an order that respects it, even if the planner didn't list them that way.

## Adding dependencies to the plan

Ask the planner to include which earlier steps each step needs:

\`\`\`python
PLANNER_SYSTEM = """Break the goal into steps. Return a JSON array where each
item has: step (int), tool (string), instruction (string), and depends_on
(a list of earlier step numbers this step needs the results of, or an empty list)."""
\`\`\`

A step with \`"depends_on": [1, 2]\` can't run until steps 1 and 2 have both completed. Most steps depend on nothing, or on just the one before them, but some, like a final "write the report" step, might depend on everything that came before it.

## Ordering by dependency: topological order

Running steps "in listed order" breaks the moment a planner lists them slightly out of order, or you want to double-check the plan is even runnable at all. The fix is a **topological sort**: repeatedly find any step whose dependencies are already done, run it, mark it done, and repeat.

\`\`\`python
def topo_order(steps):
    remaining = {s["step"]: s["depends_on"] for s in steps}
    done, order = set(), []
    while remaining:
        ready = [sid for sid, deps in remaining.items() if all(d in done for d in deps)]
        if not ready:
            return None  # a cycle: nothing left is runnable
        for sid in sorted(ready):
            order.append(sid)
            done.add(sid)
            del remaining[sid]
    return order
\`\`\`

If the loop ever finds **no** ready step while steps still remain, that means the remaining steps depend on each other in a circle, step 2 needs step 3, which needs step 2. That's a broken plan, and you should reject it before running a single tool, not discover it mid-execution.

## Why this matters

A flat, listed-order executor is fine for simple plans, but it silently produces wrong results the moment a planner reorders things or you introduce steps that fan in from multiple earlier ones. Sorting by dependency once, up front, means the execution order is always correct no matter what order the JSON array happened to list things in.

## The mental model

Think of the plan as a small assignment with prerequisites, like a course schedule. You can't take the capstone before its prerequisites; a topological sort is exactly "take everything whose prerequisites are satisfied, in any batch, then repeat." Below, you'll implement this ordering and see it catch a circular dependency.`,
      starter_code: `steps = [
    {"step": 1, "depends_on": []},
    {"step": 2, "depends_on": [1]},
    {"step": 3, "depends_on": [1]},
    {"step": 4, "depends_on": [2, 3]},
]

def topo_order(steps):
    # TODO: build a dict of step id -> depends_on list called 'remaining'
    # TODO: repeat: find all ids in 'remaining' whose deps are all in 'done';
    #       if none are found while steps remain, return None (a cycle)
    # TODO: add the ready ids (sorted, for a deterministic order) to 'order' and 'done'
    # TODO: return 'order' once nothing remains
    pass

print(topo_order(steps))
`,
      solution_code: `steps = [
    {"step": 1, "depends_on": []},
    {"step": 2, "depends_on": [1]},
    {"step": 3, "depends_on": [1]},
    {"step": 4, "depends_on": [2, 3]},
]

def topo_order(steps):
    remaining = {s["step"]: s["depends_on"] for s in steps}
    done, order = set(), []
    while remaining:
        ready = [sid for sid, deps in remaining.items() if all(d in done for d in deps)]
        if not ready:
            return None
        for sid in sorted(ready):
            order.append(sid)
            done.add(sid)
            del remaining[sid]
    return order

print(topo_order(steps))

cyclic = [
    {"step": 1, "depends_on": [2]},
    {"step": 2, "depends_on": [1]},
]
print(topo_order(cyclic))
`,
      hints: [
        "A step is 'ready' when every id in its depends_on list is already in 'done'.",
        "Sort the ready ids each round so the order is deterministic, not dict-iteration-order dependent.",
        "If 'ready' comes back empty but 'remaining' is not, that's the cycle case, return None immediately.",
      ],
      challenge_title: "Order the Plan by Dependencies",
      challenge_description:
        "Topologically sort a set of plan steps by their dependencies, or report a cycle if the plan can never fully resolve.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    steps = {}
    for i in range(1, n + 1):
        parts = list(map(int, data[i].split()))
        sid, deps = parts[0], parts[1:]
        steps[sid] = deps
    # parse done: 'steps' maps step id -> list of dependency ids

    # TODO: repeatedly find all ids whose deps are already satisfied (sorted ascending),
    #       add them to the order, mark them done, and remove them from the remaining set.
    # TODO: if a round finds nothing ready while steps remain, print "CYCLE" and stop.
    # TODO: otherwise print the final order as space-separated ids on one line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    remaining = {}
    for i in range(1, n + 1):
        parts = list(map(int, data[i].split()))
        sid, deps = parts[0], parts[1:]
        remaining[sid] = deps

    done = set()
    order = []
    while remaining:
        ready = sorted(sid for sid, deps in remaining.items() if all(d in done for d in deps))
        if not ready:
            print("CYCLE")
            return
        for sid in ready:
            order.append(sid)
            done.add(sid)
        for sid in ready:
            del remaining[sid]

    print(" ".join(map(str, order)))

main()
`,
      challenge_test_cases: [
        {
          input: "4\n1\n2 1\n3 1\n4 2 3",
          expected_output: "1 2 3 4",
          description: "Step 4 waits for both 2 and 3, which both wait for step 1.",
        },
        {
          input: "2\n1 2\n2 1",
          expected_output: "CYCLE",
          description: "Two steps depend on each other; no order can satisfy both.",
        },
        {
          input: "3\n1\n2\n3",
          expected_output: "1 2 3",
          description: "No dependencies at all; steps sort by ascending id in one round.",
        },
      ],
    },

    {
      id: "prod-11-4",
      project_id: "prod-11",
      order: 4,
      title: "Executing Steps and Passing Results Forward",
      concept: "step execution with result references",
      explanation: `A plan is ordered now, but there's still a gap: step 2 needs the actual number step 1 found, not just the *idea* that step 1 ran first. This lesson wires real data from one step's output into the next step's input.

## Referencing an earlier step's result

Give each step's arguments the ability to point at a prior result instead of hard-coding a value:

\`\`\`python
plan = [
    {"step": 1, "tool": "search", "args": {"query": "Tokyo population"}},
    {"step": 2, "tool": "calculate", "args": {"expression": "{{step1.result}} * 2"}},
]
\`\`\`

Before dispatching step 2, you substitute \`{{step1.result}}\` with whatever step 1 actually returned. If you're building a scripted, fixed-plan agent like this one, that substitution is your job in plain Python. If instead you let the model decide each turn using the API's live \`tools\` parameter, this happens differently: you keep every \`tool_result\` block in the growing \`messages\` list, and the model reads earlier results back out of that history itself on its next turn. Same idea, two different mechanisms, one your code resolves explicitly, one the model resolves by re-reading the conversation.

## A resolver for our fixed-plan agent

\`\`\`python
def resolve_args(args, results):
    resolved = {}
    for key, value in args.items():
        if isinstance(value, str) and value.startswith("$step"):
            ref = int(value[len("$step"):])
            if ref not in results:
                return None  # referenced step hasn't run yet
            resolved[key] = results[ref]
        else:
            resolved[key] = value
    return resolved
\`\`\`

This is a simplified reference format, \`"$step1"\` instead of \`"{{step1.result}}"\`, but the mechanics are identical: check whether a value is a reference, look up the referenced step's stored result, and substitute it in. Literal values (numbers, plain strings) pass through untouched.

## Why check for a missing reference

A dependency-ordered execution should never hit a missing reference, that's exactly what the topological sort from the last lesson guarantees. But defending against it anyway catches bugs: a typo in the planner's output referencing a step number that doesn't exist, or a step that failed and never wrote a result. Returning \`None\` here, instead of crashing on a \`KeyError\`, gives your executor a clean signal to abort that step instead of a stack trace.

## The mental model

Think of \`results\` as a running ledger, one row per finished step, keyed by step number. Resolving arguments is reading that ledger just before you dispatch: swap any reference for the real value, then hand off clean, concrete arguments to the tool. Below, you'll build that resolver and see it catch a reference to a step that never ran.`,
      starter_code: `results = {1: 42, 2: "tokyo"}

def resolve_args(args, results):
    # TODO: for each key/value pair in args:
    #   if value is a string starting with "$step", it's a reference like "$step1";
    #   parse out the step id and look it up in results
    #   if the referenced step isn't in results, return None (missing reference)
    #   otherwise keep the value exactly as given (a literal)
    pass

print(resolve_args({"a": "$step1", "b": 10}, results))
print(resolve_args({"city": "$step2"}, results))
print(resolve_args({"x": "$step9"}, results))
`,
      solution_code: `results = {1: 42, 2: "tokyo"}

def resolve_args(args, results):
    resolved = {}
    for key, value in args.items():
        if isinstance(value, str) and value.startswith("$step"):
            ref = int(value[len("$step"):])
            if ref not in results:
                return None
            resolved[key] = results[ref]
        else:
            resolved[key] = value
    return resolved

print(resolve_args({"a": "$step1", "b": 10}, results))
print(resolve_args({"city": "$step2"}, results))
print(resolve_args({"x": "$step9"}, results))
`,
      hints: [
        "value[len('$step'):] slices off the prefix, leaving just the digits to int()-convert.",
        "Return None the instant you hit a missing reference, don't keep resolving the rest.",
        "A plain int or a normal string that doesn't start with '$step' is a literal, copy it as-is.",
      ],
      challenge_title: "Resolve Step References",
      challenge_description:
        "Substitute references to earlier step results into a set of arguments, or flag a reference that can't be resolved yet.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    results = {}
    for _ in range(m):
        sid, val = data[idx].split(); idx += 1
        results[int(sid)] = int(val)
    n = int(data[idx].strip()); idx += 1
    args = []
    for _ in range(n):
        key, val = data[idx].split(); idx += 1
        args.append((key, val))
    # parse done: 'results' maps step id -> int value; 'args' is a list of (key, value) pairs
    # where value is either a plain int or a reference like "$step1"

    # TODO: for each (key, value) pair, in order:
    #   if value starts with "$step", look up the referenced step in results;
    #   if it's missing, print "MISSING_REF" and stop immediately (skip everything else).
    #   otherwise print "key=resolved_value" (an int either way).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    results = {}
    for _ in range(m):
        sid, val = data[idx].split(); idx += 1
        results[int(sid)] = int(val)
    n = int(data[idx].strip()); idx += 1
    args = []
    for _ in range(n):
        key, val = data[idx].split(); idx += 1
        args.append((key, val))

    out = []
    for key, val in args:
        if val.startswith("$step"):
            ref = int(val[len("$step"):])
            if ref not in results:
                print("MISSING_REF")
                return
            out.append(f"{key}={results[ref]}")
        else:
            out.append(f"{key}={int(val)}")

    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        {
          input: "2\n1 42\n2 7\n2\na $step1\nb 10",
          expected_output: "a=42\nb=10",
          description: "One argument references step 1's result, the other is a literal.",
        },
        {
          input: "1\n1 5\n1\nx $step9",
          expected_output: "MISSING_REF",
          description: "Step 9 was never computed, so the reference can't resolve.",
        },
        {
          input: "0\n2\np 3\nq 4",
          expected_output: "p=3\nq=4",
          description: "Edge: no prior results at all, both arguments are literals.",
        },
      ],
    },

    {
      id: "prod-11-5",
      project_id: "prod-11",
      order: 5,
      title: "Tracking State Across Steps",
      concept: "agent state and a bounded scratchpad",
      explanation: `The \`results\` dict from the last lesson is more than plumbing for argument substitution, it's the agent's **state**: everything it has learned so far. This lesson formalizes that state and, just as important, keeps it from growing forever.

## Two flavors of agent, one state problem

A **fixed-plan agent**, the kind this guide builds, plans once and then just executes, referring back to \`results\` only to resolve arguments. A **replanning agent** is more flexible: after every step it hands the model a summary of what's happened so far and asks "given this, what's the next step?" That second style needs a real summary of state to feed back in:

\`\`\`python
def state_summary(state):
    lines = [f"Goal: {state['goal']}"]
    for step_id, result in state["results"].items():
        lines.append(f"Step {step_id} done -> {result}")
    return "\\n".join(lines)

messages = [{"role": "user", "content": f"{state_summary(state)}\\n\\nWhat should the next step be?"}]
\`\`\`

Replanning adapts to surprises, a search coming back empty, an unexpected number, but it costs a planning call on every single step instead of one call up front. That's the trade-off: cheap and rigid versus adaptive and expensive.

## State grows exactly like chat history

Sound familiar? It's the same problem a chatbot's message history has: every step you log grows the record, and eventually the record gets too big to usefully resend, whether to a human reading a trace or a model reading a summary. The fix is the same one too, keep it bounded.

\`\`\`python
def compress_state_log(log, keep):
    if len(log) <= keep:
        return list(log)
    dropped = len(log) - keep
    summary = (0, "summary", f"{dropped} earlier steps omitted")
    return [summary] + log[dropped:]
\`\`\`

Keep the most recent \`keep\` entries verbatim, the ones most likely to matter for the next decision, and collapse everything older into a single "N earlier steps omitted" marker. The agent still knows *something* happened before, without paying to resend the full blow-by-blow.

## Why not just keep everything

On a ten-step plan it doesn't matter. On a fifty-step research agent, resending the full log every time you re-plan means the last plan call pays for the tokens of the first forty-nine steps too. Bounding the log the same way you'd bound chat history keeps a long-running agent from becoming its own worst cost problem.

## The mental model

State is a scratchpad, not a diary. You want the last few entries in full detail, and a one-line note that older entries existed, not a running transcript of everything the agent has ever done. Below, build the compressor and watch it collapse a four-step log down to its most recent entries.`,
      starter_code: `log = [
    (1, "search", "found population 14M"),
    (2, "calculate", "doubled to 28M"),
    (3, "search", "found GDP figures"),
    (4, "write_file", "saved report.txt"),
]

def compress_state_log(log, keep):
    # TODO: if log has 'keep' or fewer entries, return it unchanged (as a list).
    # TODO: otherwise, compute dropped = len(log) - keep, build a summary tuple
    #       (0, "summary", f"{dropped} earlier steps omitted"), and return that
    #       summary followed by the LAST 'keep' entries (use log[dropped:], not
    #       a negative slice, so keep=0 correctly yields no trailing entries).
    pass

for entry in compress_state_log(log, 2):
    print(entry)
`,
      solution_code: `log = [
    (1, "search", "found population 14M"),
    (2, "calculate", "doubled to 28M"),
    (3, "search", "found GDP figures"),
    (4, "write_file", "saved report.txt"),
]

def compress_state_log(log, keep):
    if len(log) <= keep:
        return list(log)
    dropped = len(log) - keep
    summary = (0, "summary", f"{dropped} earlier steps omitted")
    return [summary] + log[dropped:]

for entry in compress_state_log(log, 2):
    print(entry)

print("---")
for entry in compress_state_log(log, 10):
    print(entry)
`,
      hints: [
        "Slice with log[dropped:] rather than log[-keep:], the negative-slice version breaks when keep is 0.",
        "The summary tuple always uses step id 0 and the literal string 'summary' as its tool name.",
        "If keep is 10 and the log only has 4 entries, no compression happens at all, just return log unchanged.",
      ],
      challenge_title: "Compress the Step Log",
      challenge_description:
        "Bound an agent's step log to the most recent entries, summarizing how many older ones were dropped.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    log = []
    for _ in range(n):
        sid, tool, result = data[idx].split(); idx += 1
        log.append((sid, tool, result))
    k = int(data[idx].strip()); idx += 1
    # parse done: 'log' is n (step_id, tool, result) triples in order; 'k' is how many to keep

    # TODO: if len(log) <= k, print every entry as "step_id tool result", nothing else.
    # TODO: otherwise print "<dropped> earlier steps omitted" first, where dropped = len(log) - k,
    #       then print the LAST k entries as "step_id tool result" (use a slice from index
    #       'dropped', not a negative slice, so k=0 correctly prints zero entries).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    log = []
    for _ in range(n):
        sid, tool, result = data[idx].split(); idx += 1
        log.append((sid, tool, result))
    k = int(data[idx].strip()); idx += 1

    if len(log) <= k:
        kept = log
        dropped = 0
    else:
        dropped = len(log) - k
        kept = log[dropped:]

    if dropped > 0:
        print(f"{dropped} earlier steps omitted")
    for sid, tool, result in kept:
        print(f"{sid} {tool} {result}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\n1 search foundA\n2 calc doubledB\n3 search foundC\n4 write savedD\n2",
          expected_output: "2 earlier steps omitted\n3 search foundC\n4 write savedD",
          description: "Only the last two entries are kept; the first two collapse into a summary line.",
        },
        {
          input: "2\n1 a x\n2 b y\n5",
          expected_output: "1 a x\n2 b y",
          description: "The keep window is larger than the log, so nothing is dropped or summarized.",
        },
        {
          input: "3\n1 a x\n2 b y\n3 c z\n0",
          expected_output: "3 earlier steps omitted",
          description: "Edge: keeping zero entries still reports the drop count with no trailing lines.",
        },
      ],
    },

    {
      id: "prod-11-6",
      project_id: "prod-11",
      order: 6,
      title: "Handling Step Failures",
      concept: "retries, and required vs. optional steps",
      explanation: `Tools fail. A search times out, a calculation gets bad input, a file write hits a permissions error. A script crashes on the first failure and calls it a day. An agent that's actually production-ready has to decide, per step, whether a failure is fatal to the whole plan or just a shrug.

## Retry before giving up

Most tool failures are transient, a flaky network, a momentary rate limit, so the first line of defense is simply trying again a couple of times before treating it as a real failure:

\`\`\`python
def run_step_safe(tool_fn, args, required=True, max_tries=3):
    last_error = None
    for attempt in range(1, max_tries + 1):
        try:
            return {"status": "ok", "result": tool_fn(**args), "attempts": attempt}
        except Exception as e:
            last_error = e
    if required:
        raise RuntimeError(f"required step failed after {max_tries} attempts: {last_error}")
    return {"status": "skipped", "result": None, "attempts": max_tries}
\`\`\`

Notice the branch at the end: exhausting retries doesn't always mean the same thing.

## Required steps vs. optional steps

Mark each step in the plan as **required** or **optional**. "Calculate the total" is required, everything downstream needs that number, so if it fails after every retry, the whole plan has to stop and report failure; limping forward with a missing number just produces a wrong answer instead of an honest one. "Post a summary to Slack" is optional, a nice-to-have that later steps don't depend on, so if it fails, the agent logs it, skips it, and keeps going. The plan can still finish successfully overall.

That distinction, one flag on each step, is what keeps a single flaky tool call from taking down an entire multi-step task, while still refusing to silently paper over a failure that actually matters.

## The stopping rule this creates

- A **required** step that exhausts its retries stops the entire plan immediately: overall status is failure, and every step after it never runs.
- An **optional** step that exhausts its retries is marked skipped: the agent moves to the next step, and the plan can still end in overall success.

## Why this matters

Real tool calls fail more often than demos suggest, networks blip, APIs rate-limit, inputs are messier than expected. An agent that treats every failure as fatal is too brittle to trust with anything long; one that treats every failure as ignorable produces confidently wrong results. The required/optional split is the cheapest way to get both: fail loud on what matters, fail quiet on what doesn't.

## The mental model

Think of required steps as load-bearing walls and optional steps as decoration. Losing a wall brings the whole structure down, so you stop and report it. Losing the decoration is a shame, but the building still stands. Below, you'll simulate a plan's step outcomes and compute whether the whole thing ultimately succeeds.`,
      starter_code: `steps = [
    {"required": True, "succeeds_on": 1},
    {"required": False, "succeeds_on": None},
    {"required": True, "succeeds_on": 2},
]
MAX_TRIES = 3

def process_plan(steps, max_tries):
    # TODO: walk the steps in order, tracking total_attempts.
    #   For each step: it succeeds if succeeds_on is not None and succeeds_on <= max_tries;
    #   the attempts it costs are succeeds_on if it succeeds, else max_tries (it used every try).
    #   If it FAILS and is required, stop immediately and return ("FAILURE", total_attempts).
    #   If it FAILS and is optional, just keep going (it's skipped).
    # TODO: if every required step got through, return ("SUCCESS", total_attempts).
    pass

print(process_plan(steps, MAX_TRIES))
`,
      solution_code: `steps = [
    {"required": True, "succeeds_on": 1},
    {"required": False, "succeeds_on": None},
    {"required": True, "succeeds_on": 2},
]
MAX_TRIES = 3

def process_plan(steps, max_tries):
    total_attempts = 0
    for step in steps:
        succeeds_on = step["succeeds_on"]
        ok = succeeds_on is not None and succeeds_on <= max_tries
        attempts = succeeds_on if ok else max_tries
        total_attempts += attempts
        if not ok and step["required"]:
            return "FAILURE", total_attempts
    return "SUCCESS", total_attempts

print(process_plan(steps, MAX_TRIES))
`,
      hints: [
        "succeeds_on being None means the step never succeeds, no matter how many tries you allow.",
        "A failed OPTIONAL step still costs max_tries worth of attempts, it just doesn't stop the plan.",
        "Return the instant a required step fails, don't keep summing attempts for steps that never ran.",
      ],
      challenge_title: "Run the Plan With Retries",
      challenge_description:
        "Simulate a plan's step outcomes under a shared retry limit, stopping the whole run the moment a required step fails.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, max_tries = map(int, data[0].split())
    # Each of the next n lines: "required succeeds_on" where required is 0 or 1,
    # and succeeds_on is the attempt number it first succeeds on, or -1 if it never succeeds.

    total = 0
    for i in range(1, n + 1):
        req, succeeds = map(int, data[i].split())
        required = (req == 1)
        # TODO: ok = succeeds != -1 and succeeds <= max_tries
        # TODO: attempts = succeeds if ok else max_tries; add it to 'total'
        # TODO: if not ok and required, print "FAILURE" then total, and stop immediately.

    # TODO: if the loop finishes without a required failure, print "SUCCESS" then total.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, max_tries = map(int, data[0].split())

    total = 0
    for i in range(1, n + 1):
        req, succeeds = map(int, data[i].split())
        required = (req == 1)
        ok = succeeds != -1 and succeeds <= max_tries
        attempts = succeeds if ok else max_tries
        total += attempts
        if not ok and required:
            print("FAILURE")
            print(total)
            return

    print("SUCCESS")
    print(total)

main()
`,
      challenge_test_cases: [
        {
          input: "3 3\n1 1\n0 -1\n1 2",
          expected_output: "SUCCESS\n6",
          description: "The optional step fails but is skipped; both required steps succeed within the retry limit.",
        },
        {
          input: "2 2\n1 -1\n0 5",
          expected_output: "FAILURE\n2",
          description: "The first step is required and never succeeds, so the plan stops right there.",
        },
        {
          input: "3 2\n0 -1\n0 -1\n1 1",
          expected_output: "SUCCESS\n5",
          description: "Two optional failures are skipped; the final required step still succeeds.",
        },
      ],
    },

    {
      id: "prod-11-7",
      project_id: "prod-11",
      order: 7,
      title: "Knowing When to Stop",
      concept: "stopping conditions and loop detection",
      explanation: `A fixed plan stops naturally, it runs out of steps. But a replanning agent, the kind that looks at results and decides its own next move turn by turn, has no natural finish line. Without an explicit stop rule, it can loop forever: re-searching the same query, always "almost done," burning tokens and money with nothing to show for it. This lesson builds the guard that catches that.

## Three ways to know it's time to stop

1. **A goal-achieved signal.** The cleanest stop condition: the model calls a dedicated \`finish\` tool (or the last action is explicitly a "done" signal) once it believes the goal is met. Always check this first, it's the intended, successful ending.
2. **A step budget.** A hard \`max_steps\` cap, non-negotiable regardless of what the model claims. No matter how confident the agent sounds, it does not get infinite turns.
3. **Loop detection.** If the exact same tool with the exact same arguments repeats too many times in a row, the agent is stuck, not making progress, just spinning. Catching this early saves the rest of the step budget instead of burning it all the way down before giving up.

\`\`\`python
def should_stop(history, max_steps, repeat_limit=3):
    if history and history[-1]["tool"] == "finish":
        return True, "done"
    if len(history) >= max_steps:
        return True, "max_steps"
    last = history[-1]
    count = sum(1 for h in history if h["tool"] == last["tool"] and h["args"] == last["args"])
    if count >= repeat_limit:
        return True, "loop_detected"
    return False, None
\`\`\`

## Why the order of checks matters

Check \`finish\` before anything else, an agent that just succeeded shouldn't get flagged as looping just because its last two actions happened to look similar. Check the step budget next, it's an absolute ceiling that should win over "well, it hasn't technically repeated yet." Loop detection comes last, it's the safety net that catches the case neither of the first two conditions covers.

## Why this matters

A stuck agent doesn't announce itself, it just keeps calling the same tool with the same arguments, each call looking individually reasonable. Without a repeat check, that pattern runs until the step budget is exhausted, wasting every remaining call on a search that already failed twice. Stopping the instant a loop is detected, rather than waiting out the clock, is the difference between a cheap failure and an expensive one.

## The mental model

Three tripwires, checked in a fixed order: did it declare victory, has it run out of turns, is it just spinning its wheels. Any one of them ends the loop. Below, implement that check and watch it catch a repeating action before the step budget would have.`,
      starter_code: `history = [
    ("search", ("tokyo",)),
    ("search", ("tokyo",)),
    ("search", ("tokyo",)),
]

def check_stop(history, max_steps, repeat_limit):
    # TODO: if history is empty, return None (nothing to check yet).
    # TODO: if the last action's tool is "finish", return "DONE".
    # TODO: elif len(history) >= max_steps, return "MAX_STEPS".
    # TODO: elif the last action (same tool AND same args) appears 'repeat_limit'
    #       or more times anywhere in history, return "LOOP_DETECTED".
    # TODO: else return None.
    pass

print(check_stop(history, max_steps=10, repeat_limit=3))
`,
      solution_code: `history = [
    ("search", ("tokyo",)),
    ("search", ("tokyo",)),
    ("search", ("tokyo",)),
]

def check_stop(history, max_steps, repeat_limit):
    if not history:
        return None
    last_tool, last_args = history[-1]
    if last_tool == "finish":
        return "DONE"
    if len(history) >= max_steps:
        return "MAX_STEPS"
    count = sum(1 for tool, args in history if tool == last_tool and args == last_args)
    if count >= repeat_limit:
        return "LOOP_DETECTED"
    return None

print(check_stop(history, max_steps=10, repeat_limit=3))
`,
      hints: [
        "Unpack the last entry once: last_tool, last_args = history[-1].",
        "Check 'finish' and the step budget BEFORE counting repeats, in that exact order.",
        "The repeat count includes the last action itself, so three identical entries means count == 3.",
      ],
      challenge_title: "Detect When the Agent Should Stop",
      challenge_description:
        "Check a running action history against the finish signal, the step budget, and loop detection, in that priority order.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_steps, repeat_limit = map(int, data[0].split())
    n = int(data[1].strip())
    history = []
    for i in range(2, 2 + n):
        tool, args = data[i].split()
        history.append((tool, args))
    # parse done: 'history' is a list of (tool, args) pairs in order

    # TODO: if history is empty, print "CONTINUE" and stop.
    # TODO: if the last tool is "finish", print "DONE" and stop.
    # TODO: elif len(history) >= max_steps, print "MAX_STEPS" and stop.
    # TODO: elif the last (tool, args) pair appears 'repeat_limit' or more times
    #       anywhere in history, print "LOOP_DETECTED" and stop.
    # TODO: else print "CONTINUE".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_steps, repeat_limit = map(int, data[0].split())
    n = int(data[1].strip())
    history = []
    for i in range(2, 2 + n):
        tool, args = data[i].split()
        history.append((tool, args))

    if not history:
        print("CONTINUE")
        return

    last_tool, last_args = history[-1]
    if last_tool == "finish":
        print("DONE")
        return
    if len(history) >= max_steps:
        print("MAX_STEPS")
        return

    count = sum(1 for t, a in history if t == last_tool and a == last_args)
    if count >= repeat_limit:
        print("LOOP_DETECTED")
        return

    print("CONTINUE")

main()
`,
      challenge_test_cases: [
        {
          input: "10 3\n3\nsearch tokyo\nsearch tokyo\nsearch tokyo",
          expected_output: "LOOP_DETECTED",
          description: "The same search repeats three times in a row, hitting the repeat limit.",
        },
        {
          input: "2 5\n2\nsearch a\ncalculate b",
          expected_output: "MAX_STEPS",
          description: "The history has already reached the step budget, even though nothing repeated.",
        },
        {
          input: "10 3\n2\nsearch a\nfinish done",
          expected_output: "DONE",
          description: "The last action is 'finish', which always wins regardless of the other conditions.",
        },
        {
          input: "10 3\n2\nsearch a\nsearch b",
          expected_output: "CONTINUE",
          description: "Different arguments mean this isn't a repeat, and no other condition is triggered.",
        },
      ],
    },

    {
      id: "prod-11-8",
      project_id: "prod-11",
      order: 8,
      title: "Ship the Agent",
      concept: "assembling the full plan-execute-track-stop loop",
      explanation: `Every piece is built: a planner that turns a goal into ordered steps, a tool registry, dependency ordering, result references, a bounded state log, retries with required/optional handling, and stop conditions. This lesson wires all of it into one \`TaskAgent\` and ships it.

## The shape of the finished agent

\`\`\`python
class TaskAgent:
    def __init__(self, client, tools, max_steps=10):
        self.client = client
        self.tools = tools
        self.max_steps = max_steps

    def plan(self, goal):
        resp = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=600,
            system=PLANNER_SYSTEM,
            messages=[{"role": "user", "content": goal}],
        )
        return json.loads(resp.content[0].text)

    def run(self, goal):
        steps = self.plan(goal)
        order = topo_order(steps)
        if order is None:
            return {"status": "FAILURE", "reason": "cyclic plan"}
        results = {}
        for step_id in order:
            step = next(s for s in steps if s["step"] == step_id)
            args = resolve_args(step["args"], results)
            outcome = run_step_safe(self.tools[step["tool"]], args, step.get("required", True))
            if outcome["status"] == "failed":
                return {"status": "FAILURE", "results": results}
            results[step_id] = outcome["result"]
        return {"status": "SUCCESS", "results": results}
\`\`\`

Every line of \`run\` traces back to a lesson you've already built: \`topo_order\` (lesson 3), \`resolve_args\` (lesson 4), \`run_step_safe\` with required/optional handling (lesson 6). The step budget and loop detection from lesson 7 slot into a replanning variant of this same loop, checked once per iteration before deciding whether to plan another step.

## What "shipped" means here

Same three tests as every product in this track: it runs from a clean start with one command, it survives an empty or malformed plan without crashing, and someone else could hand it a goal from your instructions alone. An agent that plans, executes in dependency order, resolves references, tracks bounded state, retries and distinguishes required from optional failures, and knows when to stop, that's not a demo anymore. That's a deliverable.

## Into your Portfolio

Finishing this lesson records the Multi-Step Task Agent in your **Portfolio** tab: the goal it can take, the tools it dispatches to, and proof it plans and executes on its own. It joins the shelf of working products you've been assembling across this track, each one a real, runnable thing rather than a score.

## The mental model

A shipped agent hides its own machinery. From the outside it's one call: hand it a goal, get back a result. Inside, it quietly plans, orders, executes, tracks, retries, and stops, exactly the pipeline you built one lesson at a time. Below, assemble the final integration: a pure-Python \`run_agent\` that plans through a fixed list of steps, dispatches each to a tool, and stops the moment it sees a \`finish\` step.`,
      starter_code: `TOOLS = {
    "search": lambda query: f"result for {query}",
    "calculate": lambda a, b: a + b,
    "finish": lambda: "done",
}

def run_agent(plan, tools, max_steps):
    results = {}
    executed = 0
    for step in plan:
        # TODO: if executed has already reached max_steps, return ("MAX_STEPS", executed)
        # TODO: if step["tool"] isn't a key in tools, return ("FAILURE", executed)
        # TODO: otherwise call the tool with step.get("args", {}), increment 'executed',
        #       and store the result in results[step["step"]]
        # TODO: if the tool that just ran was "finish", return ("SUCCESS", executed)
        pass
    # TODO: if the loop finishes with no finish and no failure, return ("SUCCESS", executed)

plan = [
    {"step": 1, "tool": "search", "args": {"query": "tokyo population"}},
    {"step": 2, "tool": "calculate", "args": {"a": 14, "b": 14}},
    {"step": 3, "tool": "finish", "args": {}},
]

print(run_agent(plan, TOOLS, max_steps=10))
`,
      solution_code: `TOOLS = {
    "search": lambda query: f"result for {query}",
    "calculate": lambda a, b: a + b,
    "finish": lambda: "done",
}

def run_agent(plan, tools, max_steps):
    results = {}
    executed = 0
    for step in plan:
        if executed >= max_steps:
            return ("MAX_STEPS", executed)
        tool_name = step["tool"]
        if tool_name not in tools:
            return ("FAILURE", executed)
        result = tools[tool_name](**step.get("args", {}))
        executed += 1
        results[step["step"]] = result
        if tool_name == "finish":
            return ("SUCCESS", executed)
    return ("SUCCESS", executed)

plan = [
    {"step": 1, "tool": "search", "args": {"query": "tokyo population"}},
    {"step": 2, "tool": "calculate", "args": {"a": 14, "b": 14}},
    {"step": 3, "tool": "finish", "args": {}},
]

print(run_agent(plan, TOOLS, max_steps=10))
print("Agent built. Saved to your Portfolio.")
`,
      hints: [
        "Check the max_steps budget before checking whether the tool is registered, that ordering matters.",
        "Unpack step.get('args', {}) with ** so each tool receives its arguments as keyword arguments.",
        "The 'finish' check happens AFTER incrementing 'executed', so the finish step itself counts.",
      ],
      challenge_title: "Run the Full Agent Loop",
      challenge_description:
        "Execute a plan step by step against a step budget, stopping on an unknown tool, a finish step, or the budget itself.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_steps = int(data[0].strip())
    n = int(data[1].strip())
    KNOWN = {"search", "calculate", "finish"}
    executed = 0

    for i in range(2, 2 + n):
        parts = data[i].split()
        tool = parts[1]
        # TODO: if executed has already reached max_steps, print "MAX_STEPS" then
        #       executed, and stop, this step never runs.
        # TODO: if tool isn't in KNOWN, print "FAILURE" then executed (the failing
        #       step does NOT count as executed), and stop.
        # TODO: otherwise increment executed; if tool == "finish", print "SUCCESS"
        #       then executed, and stop.

    # TODO: if the loop finishes without hitting finish, failure, or the budget,
    #       print "SUCCESS" then executed.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_steps = int(data[0].strip())
    n = int(data[1].strip())
    KNOWN = {"search", "calculate", "finish"}
    executed = 0

    for i in range(2, 2 + n):
        parts = data[i].split()
        tool = parts[1]

        if executed >= max_steps:
            print("MAX_STEPS")
            print(executed)
            return
        if tool not in KNOWN:
            print("FAILURE")
            print(executed)
            return

        executed += 1
        if tool == "finish":
            print("SUCCESS")
            print(executed)
            return

    print("SUCCESS")
    print(executed)

main()
`,
      challenge_test_cases: [
        {
          input: "10\n3\n1 search\n2 calculate\n3 finish",
          expected_output: "SUCCESS\n3",
          description: "All three steps run in order and the plan ends cleanly on 'finish'.",
        },
        {
          input: "2\n3\n1 search\n2 search\n3 finish",
          expected_output: "MAX_STEPS\n2",
          description: "The budget is exhausted after two steps, so the finish step never runs.",
        },
        {
          input: "10\n2\n1 search\n2 email",
          expected_output: "FAILURE\n1",
          description: "'email' isn't a known tool, so the plan fails without counting that step.",
        },
        {
          input: "10\n2\n1 search\n2 calculate",
          expected_output: "SUCCESS\n2",
          description: "Edge: the plan runs to completion without ever hitting an explicit finish step.",
        },
      ],
    },
  ],
};
