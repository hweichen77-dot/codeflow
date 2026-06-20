export default {
  project: {
    id: "ai-16",
    title: "Deploying & Monitoring LLM Apps",
    description: "Take an LLM prototype from a notebook to a reliable production service: deploy it, trace every call, gate releases with evals, watch the cost, and survive failures with fallbacks.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 55,
    lessons_count: 8,
    tags: ["deployment", "observability", "evals", "cost", "reliability", "production"],
    order: 22,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-16-l1",
      project_id: "ai-16",
      order: 1,
      title: "From Notebook to Production",
      concept: "Deploy",
      xp_reward: 10,
      explanation: `The demo worked on the first try in a notebook. Two weeks later the same code is paging an engineer at 2 a.m. because a hardcoded API key leaked, a 30-second model call hung the web server, and one user's prompt crashed the whole process. Nothing about the model changed. Everything about the **environment** did.

## What it is

**Deployment** is the work of turning a one-off script into a service that strangers can hit, all day, without you watching. A notebook runs once, for you, with your secrets typed inline and failures you can see. Production runs continuously, for everyone, with secrets hidden, failures logged, and load you don't control.

The model call is the easy 10 percent. The other 90 percent is the wrapper around it: a request comes in, you validate it, call the model, handle the things that go wrong, and return a clean response.

## How it works

A minimal production wrapper has a shape that almost never changes:

\`\`\`python
import os
from fastapi import FastAPI, HTTPException

app = FastAPI()
API_KEY = os.environ["LLM_API_KEY"]   # from env, never hardcoded

@app.post("/chat")
def chat(prompt: str):
    if not prompt.strip():                      # 1. validate input
        raise HTTPException(400, "empty prompt")
    try:
        answer = call_model(prompt, API_KEY)    # 2. call the model
    except Exception:
        raise HTTPException(502, "model error")  # 3. fail cleanly
    return {"answer": answer}                    # 4. return JSON
\`\`\`

The four moves are always the same: read config from the **environment**, validate the input, call the model inside a try/except, and return a structured response instead of crashing. The notebook version skips every one of these because it only ever runs in your hands.

## Why it matters

The gap between "works in a notebook" and "works in production" is where most LLM projects die:

- **Secrets leak.** A key pasted in a cell ends up in git history. Production reads keys from environment variables that never touch source control.
- **One bad request takes everyone down.** No input validation means a malformed prompt can throw deep inside your code and kill the worker handling other users.
- **Hangs are invisible.** A model call with no timeout can stall for a minute; under load, stalled workers pile up until the service stops responding.
- **You can't roll back what you can't version.** Production code ships as a tagged, reproducible build, not "the version that happened to be open in my editor."

## The mental model to keep

A notebook is a conversation with yourself; production is a contract with strangers. **Ship the wrapper, not the cell** — the model is the small, easy part, and the boring code around it is what keeps the lights on.`,
      key_terms: [
        { term: "Deployment", definition: "Turning a script into a continuously running service that handles requests from real users." },
        { term: "Environment variable", definition: "A configuration value (like an API key) read from the environment at runtime instead of hardcoded in source." },
        { term: "Endpoint", definition: "A named URL path, like /chat, that accepts requests and returns a structured response." },
        { term: "Input validation", definition: "Checking a request is well-formed before doing any work, so bad input fails fast and cleanly." }
      ],
      callouts: [
        { type: "analogy", title: "A food truck vs a restaurant", content: "Cooking one meal for yourself (the notebook) is nothing like running a kitchen that serves a line of strangers all day (production). Same recipe, totally different operation: health codes, inventory, staff, a line out the door.", position: "before" },
        { type: "warning", title: "Never hardcode the key", content: "A key typed into a cell gets committed to git and is effectively public forever. Read it from os.environ and keep it out of source control entirely.", position: "after" }
      ],
      concept_diagram: {
        title: "What wraps the model in production",
        steps: [
          { label: "Read config", desc: "Pull API keys and settings from environment variables." },
          { label: "Validate input", desc: "Reject empty or malformed requests before any model call." },
          { label: "Call the model", desc: "Run the request inside a try/except with a timeout." },
          { label: "Return structured response", desc: "Send clean JSON or a proper error code, never a crash." }
        ]
      },
      inline_quizzes: [
        {
          question: "Where should a production service get its API key from?",
          options: ["Hardcoded in the source file", "An environment variable read at runtime", "Pasted into each request"],
          correct_index: 1,
          explanation: "Reading from an environment variable keeps the secret out of git history and out of source control."
        }
      ],
      quiz_questions: [
        {
          question: "Why does code that works in a notebook often break in production?",
          options: [
            "The model gets worse when deployed",
            "Production runs continuously for many users with hidden secrets and uncontrolled load",
            "Notebooks use a different model than production",
            "Production cannot run Python"
          ],
          correct_index: 1,
          explanation: "The model is unchanged; the environment is. Continuous, multi-user, secret-hidden, load-heavy conditions expose gaps the notebook never had."
        },
        {
          question: "What is the main risk of skipping input validation on an endpoint?",
          options: [
            "Responses become slightly slower",
            "One malformed request can crash the worker and affect other users",
            "The model bills you twice",
            "The endpoint URL changes"
          ],
          correct_index: 1,
          explanation: "Without validation, a bad prompt can throw deep in your code and take down the worker serving everyone else."
        },
        {
          question: "Which of these is the small, easy part of an LLM service?",
          options: [
            "Reading config from the environment",
            "Validating and sanitizing input",
            "The single model call itself",
            "Handling and logging failures"
          ],
          correct_index: 2,
          explanation: "The model call is roughly 10 percent of the work; the wrapper that validates, handles errors, and returns clean responses is the rest."
        }
      ],
      participation_activities: [
        {
          activity_title: "Notebook vs production check",
          questions: [
            { question: "A notebook is designed to serve thousands of concurrent strangers reliably.", type: "true_false", correct_answer: "false", explanation: "Notebooks run once, for you. Serving strangers reliably is what production deployment adds." },
            { question: "Production services read secrets like API keys from ______ variables instead of hardcoding them.", type: "fill_in", correct_answer: "environment", explanation: "Environment variables keep secrets out of source control and out of git history." }
          ]
        }
      ],
      starter_code: `# Turn a bare model call into a minimal production-style handler.
import os

def call_model(prompt):
    # pretend this hits a real model
    return "echo: " + prompt

def handle_request(prompt):
    # TODO: read the API key from the environment, validate the prompt,
    # call the model inside try/except, and return a dict response.
    answer = call_model(prompt)
    return {"answer": answer}

print(handle_request("hello"))
`,
      solution_code: `import os

def call_model(prompt):
    return "echo: " + prompt

def handle_request(prompt):
    api_key = os.environ.get("LLM_API_KEY", "")
    if not api_key:
        return {"error": "missing API key"}
    if not prompt or not prompt.strip():
        return {"error": "empty prompt"}
    try:
        answer = call_model(prompt)
    except Exception:
        return {"error": "model error"}
    return {"answer": answer}

os.environ["LLM_API_KEY"] = "test-key"
print(handle_request("hello"))
print(handle_request("   "))
`,
      expected_output: `{'answer': 'echo: hello'}
{'error': 'empty prompt'}`,
      step_throughs: [
        {
          title: "one request through a production handler",
          steps: [
            { label: "Read config", detail: "The handler pulls the API key from the environment. If it is missing, the service fails fast instead of calling the model with no credentials.", code: 'api_key = os.environ["LLM_API_KEY"]' },
            { label: "Validate input", detail: "An empty or whitespace-only prompt is rejected before any expensive work. Bad input fails cheaply and clearly.", code: 'if not prompt.strip(): return error("empty prompt")' },
            { label: "Call the model safely", detail: "The model call sits inside try/except so an upstream failure becomes a clean 502, not a process crash that drops other users.", code: "try:\n    answer = call_model(prompt, api_key)\nexcept Exception:\n    return error(\"model error\")" },
            { label: "Return structured output", detail: "The handler always returns a predictable shape — a JSON object with answer or error — so callers never have to parse a stack trace.", code: 'return {"answer": answer}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A teammate ships an endpoint that pastes the API key directly in the code: api_key = \"sk-abc123\". Why is this a problem the moment it is committed?",
          steps: [
            "Anything committed to git lives in the repository's history forever, even if you delete the line later.",
            "Anyone with access to the repo (or a leaked clone) can read the key and run up charges on your account.",
            "The fix is to read the key from os.environ at runtime and store it as a deployment secret, never in source."
          ],
          output: "The key is now effectively public in git history; read it from an environment variable instead."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Under load, your service slowly stops responding to everyone, even though the model API is still up. Each model call has no timeout. Explain the failure and the fix.",
          steps: [
            "Without a timeout, a slow model call can hold a worker for 30-plus seconds doing nothing.",
            "Your server has a fixed pool of workers; each stuck call removes one from circulation.",
            "As more slow calls arrive, every worker ends up blocked, so new requests queue and eventually time out at the edge — the whole service appears down.",
            "Fix: set a per-call timeout (for example 10s) so a stalled model call is abandoned and the worker returns to the pool, plus a fallback or error for the affected request only."
          ],
          output: "Untimed calls exhaust the worker pool under load; add per-call timeouts so one slow call cannot starve the service."
        }
      ],
      comparison_tables: [
        {
          title: "notebook vs production service",
          columns: ["Aspect", "Notebook", "Production service"],
          rows: [
            { cells: ["Runs", "Once, by you", "Continuously, for everyone"] },
            { cells: ["Secrets", "Typed inline in a cell", "Read from environment variables"] },
            { cells: ["Bad input", "You see and fix it", "Must be validated and rejected safely"] },
            { cells: ["A failure", "Prints a stack trace", "Logged, returned as a clean error code"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "notebook habit vs production requirement",
          bins: [
            { id: "notebook", label: "Notebook habit" },
            { id: "prod", label: "Production requirement" }
          ],
          items: [
            { id: "i1", text: "Hardcode the API key in a cell", bin: "notebook" },
            { id: "i2", text: "Read the key from an environment variable", bin: "prod" },
            { id: "i3", text: "Let a bad prompt throw a stack trace", bin: "notebook" },
            { id: "i4", text: "Validate input and return a 400 error", bin: "prod" },
            { id: "i5", text: "Call the model with no timeout", bin: "notebook" },
            { id: "i6", text: "Wrap the model call in try/except with a timeout", bin: "prod" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if the model call is only about 10 percent of the work, what is the other 90 percent and why does it matter?",
          sampleAnswer: "The other 90 percent is the wrapper around the model: reading secrets from the environment, validating incoming requests, catching and logging failures, enforcing timeouts, and returning a predictable response shape. It matters because production runs for many strangers under uncontrolled load, so the failure modes the notebook never hit — leaked keys, crashing workers, hung calls — are exactly what determine whether the service stays up."
        }
      ],
      hints: [
        "Use os.environ.get('LLM_API_KEY', '') so a missing key returns an empty string instead of raising.",
        "Validate the prompt with `not prompt.strip()` to catch both empty and whitespace-only input.",
        "Wrap call_model in try/except and return a dict with an 'error' key instead of letting it raise."
      ],
      challenge_title: "The Production Gate",
      challenge_description: "Run a batch of incoming requests through a validation gate and report how many pass, how many are rejected, and why.",
      challenge_difficulty: "beginner",
      challenge_story: "Your team is promoting a notebook prototype to a real \`/chat\` endpoint. Before any request reaches the model, it must clear the **validation gate** — the boring wrapper code that keeps one bad request from taking down the worker serving everyone else. Overnight, a replay of production traffic is queued against your new gate. Build the gate, run the batch, and hand ops a clean tally of accepted vs. rejected requests so they can sign off on the deploy.",
      challenge_statement: "Process \`N\` requests in order. Each request carries three integers: whether an API key is present, the prompt length, and the requested timeout in milliseconds.\n\nApply the gate's rules **in this exact priority order** and reject on the first rule that fails (a request fails for at most one reason):\n\n1. **missing_key** — the key is absent (\`key_present == 0\`).\n2. **empty_prompt** — the prompt has zero length (\`prompt_len == 0\`).\n3. **timeout_too_long** — the requested timeout exceeds **30000** ms.\n\nA request that clears all three rules is **accepted**. Report the accepted and rejected totals, then the count of rejections for each reason.",
      challenge_input_format: "The first line contains a single integer `N`, the number of requests.\nEach of the next `N` lines contains three space-separated integers: `key_present prompt_len timeout_ms` (`key_present` is 0 or 1).",
      challenge_output_format: "Five lines:\n- `accepted <count>`\n- `rejected <count>`\n- `missing_key <count>`\n- `empty_prompt <count>`\n- `timeout_too_long <count>`",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "key_present is 0 or 1",
        "0 ≤ prompt_len ≤ 1000000",
        "0 ≤ timeout_ms ≤ 1000000",
        "Rules are checked in the fixed order key → prompt → timeout; a request counts toward exactly one reason."
      ],
      challenge_examples: [
        { input: "5\n1 12 5000\n0 8 5000\n1 0 5000\n1 20 45000\n1 5 30000", output: "accepted 2\nrejected 3\nmissing_key 1\nempty_prompt 1\ntimeout_too_long 1", explanation: "Request 1 (key, prompt 12, 5s) and request 5 (timeout exactly 30000, allowed) pass. Request 2 has no key, request 3 has an empty prompt, request 4 asks for 45s > 30000." },
        { input: "3\n1 10 1000\n1 7 25000\n1 3 30000", output: "accepted 3\nrejected 0\nmissing_key 0\nempty_prompt 0\ntimeout_too_long 0", explanation: "All three have a key, a non-empty prompt, and a timeout at or below 30000 ms, so every one is accepted." }
      ],
      challenge_notes: "The boundary is **inclusive**: a timeout of exactly 30000 ms is allowed; only `> 30000` is rejected. Because rules are checked in priority order, a request that is both missing a key and has an empty prompt counts only as `missing_key`.",
      challenge_hints: [
        "Read N, then loop N times reading three ints per line with `map(int, input().split())`.",
        "Use an if/elif/elif/else chain so each request triggers at most one reason, matching the priority order.",
        "Keep a small dict of reason counts and print them in the fixed order at the end."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    accepted = 0
    rejected = 0
    counts = {"missing_key": 0, "empty_prompt": 0, "timeout_too_long": 0}
    for _ in range(n):
        key_present, prompt_len, timeout_ms = map(int, data[idx].split()); idx += 1
        # TODO: check key, then prompt, then timeout (in that order).
        # Increment accepted, or rejected + the matching reason count.
        pass

    print(f"accepted {accepted}")
    print(f"rejected {rejected}")
    print(f"missing_key {counts['missing_key']}")
    print(f"empty_prompt {counts['empty_prompt']}")
    print(f"timeout_too_long {counts['timeout_too_long']}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    accepted = 0
    rejected = 0
    counts = {"missing_key": 0, "empty_prompt": 0, "timeout_too_long": 0}
    for _ in range(n):
        key_present, prompt_len, timeout_ms = map(int, data[idx].split()); idx += 1
        if key_present == 0:
            rejected += 1
            counts["missing_key"] += 1
        elif prompt_len == 0:
            rejected += 1
            counts["empty_prompt"] += 1
        elif timeout_ms > 30000:
            rejected += 1
            counts["timeout_too_long"] += 1
        else:
            accepted += 1

    print(f"accepted {accepted}")
    print(f"rejected {rejected}")
    print(f"missing_key {counts['missing_key']}")
    print(f"empty_prompt {counts['empty_prompt']}")
    print(f"timeout_too_long {counts['timeout_too_long']}")

main()
`,
      challenge_test_cases: [
        { input: "5\n1 12 5000\n0 8 5000\n1 0 5000\n1 20 45000\n1 5 30000", expected_output: "accepted 2\nrejected 3\nmissing_key 1\nempty_prompt 1\ntimeout_too_long 1", description: "Mixed batch: one of each rejection reason plus two accepts; 30000 ms is allowed." },
        { input: "3\n1 10 1000\n1 7 25000\n1 3 30000", expected_output: "accepted 3\nrejected 0\nmissing_key 0\nempty_prompt 0\ntimeout_too_long 0", description: "All valid; the 30000 ms boundary passes." },
        { input: "1\n0 0 99999", expected_output: "accepted 0\nrejected 1\nmissing_key 1\nempty_prompt 0\ntimeout_too_long 0", description: "Edge case: missing key AND empty prompt AND long timeout, but priority order counts it only as missing_key." }
      ]
    },
    {
      id: "ai-16-l2",
      project_id: "ai-16",
      order: 2,
      title: "Logging & Tracing",
      concept: "Tracing",
      xp_reward: 10,
      explanation: `A user reports: "the bot gave me a garbage answer this morning." You open your logs and find one line: \`INFO: request handled\`. No prompt, no model output, no timing, no way to tell which of the 40,000 requests that morning was theirs. The bug is real and you are completely blind to it. The model was fine; your **observability** was not.

## What it is

**Tracing** is recording enough about each request to reconstruct what happened after the fact. For an LLM call that means, at minimum: the prompt, the model and settings used, the output, the token counts, the latency, and a **trace ID** that ties them together. A **log** is a single timestamped event; a **trace** is the connected story of one request, often across several steps.

The discipline is simple to state and easy to skip: never make a model call you cannot reconstruct later. If you can't see the input and output, you can't debug, evaluate, or improve anything.

## How it works

You wrap the model call so every invocation emits a structured record:

\`\`\`python
import time, uuid, json

def traced_call(prompt, model="default"):
    trace_id = str(uuid.uuid4())
    start = time.time()
    output = call_model(prompt, model)       # the real call
    latency_ms = round((time.time() - start) * 1000)
    record = {
        "trace_id": trace_id,
        "model": model,
        "prompt": prompt,
        "output": output,
        "latency_ms": latency_ms,
    }
    print(json.dumps(record))   # ship this to your log store
    return output, trace_id
\`\`\`

Two details make this useful. First, the record is **structured** (JSON), so you can search and aggregate it — "show me all calls over 5 seconds" — instead of grepping prose. Second, the **trace_id** is returned to the caller and shown to the user, so a bug report can name the exact request.

## Why it matters

Tracing is the foundation every other production practice stands on:

- **Debugging.** A user's complaint becomes "look up trace abc-123" instead of an unsolvable mystery.
- **Latency hunting.** Per-call timing reveals the slow model, the slow prompt, or the slow step in a chain.
- **Evals and improvement.** You cannot measure quality on traffic you never recorded. Real production traces are the raw material for the evals in the next lesson.
- **Cost and abuse.** Token counts per call feed cost monitoring and expose the one user sending novel-length prompts.

One caution: prompts and outputs can contain personal data. Mask or redact sensitive fields before logging, and set a retention window — observability is not an excuse to hoard private text forever.

## The mental model to keep

If a request happened and you didn't record it, **it might as well not have happened** — you can neither debug it nor learn from it. Trace first; you can always sample down later, but you can never recover what you never wrote.`,
      key_terms: [
        { term: "Tracing", definition: "Recording enough detail about each request to reconstruct what happened later." },
        { term: "Trace ID", definition: "A unique identifier attached to one request so all its logs and steps can be tied together." },
        { term: "Structured log", definition: "A log written as machine-readable fields (like JSON) so it can be searched and aggregated." },
        { term: "Latency", definition: "How long a call took, usually measured in milliseconds, recorded per request." }
      ],
      callouts: [
        { type: "analogy", title: "A flight recorder for every call", content: "A black box on a plane records everything so investigators can reconstruct a flight after the fact. A trace does the same for one request: prompt, output, timing, IDs — so any complaint becomes a replay, not a guess.", position: "before" },
        { type: "warning", title: "Logs can leak private data", content: "Prompts and outputs often contain personal information. Redact or mask sensitive fields and set a retention window before you start logging full text.", position: "after" }
      ],
      concept_diagram: {
        title: "Anatomy of one traced call",
        steps: [
          { label: "Assign a trace ID", desc: "Generate a unique ID and attach it to the request." },
          { label: "Record the inputs", desc: "Capture prompt, model, and settings used." },
          { label: "Time the call", desc: "Measure latency and capture the output and token counts." },
          { label: "Ship a structured record", desc: "Emit JSON to a searchable store and return the ID." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why attach a unique trace ID to each request?",
          options: ["To make logs look professional", "So a specific request can be looked up and reconstructed later", "To speed up the model call"],
          correct_index: 1,
          explanation: "A trace ID ties all of a request's records together so you can find and replay exactly that one."
        }
      ],
      quiz_questions: [
        {
          question: "A user reports a bad answer but your logs only say 'request handled'. What is the core problem?",
          options: [
            "The model is broken",
            "You lack tracing, so you cannot reconstruct that specific request",
            "The user is wrong",
            "The log store is too slow"
          ],
          correct_index: 1,
          explanation: "Without the prompt, output, timing, and an ID, there is no way to find or debug the request the user is describing."
        },
        {
          question: "Why prefer structured (JSON) logs over plain prose lines?",
          options: [
            "They take less disk space",
            "They can be searched and aggregated by field, like 'all calls over 5 seconds'",
            "They are required by Python",
            "They hide sensitive data automatically"
          ],
          correct_index: 1,
          explanation: "Structured fields let you query and aggregate (filter by latency, model, token count) instead of grepping free text."
        },
        {
          question: "What extra responsibility comes with logging full prompts and outputs?",
          options: [
            "Nothing, log everything forever",
            "Redacting sensitive data and setting a retention window",
            "Encrypting the model weights",
            "Disabling the trace ID"
          ],
          correct_index: 1,
          explanation: "Prompts and outputs can contain personal data, so you must mask sensitive fields and limit how long records are kept."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tracing fundamentals",
          questions: [
            { question: "A single timestamped log line and a full trace of a request are the same thing.", type: "true_false", correct_answer: "false", explanation: "A log is one event; a trace is the connected story of a request, often across several steps." },
            { question: "Recording latency, prompt, output, and an ID for each call is the practice of ______.", type: "fill_in", correct_answer: "tracing", explanation: "Tracing captures enough to reconstruct any request after the fact." }
          ]
        }
      ],
      starter_code: `# Add tracing to a model call: record id, latency, and output.
import time, uuid

def call_model(prompt):
    return "answer to: " + prompt

def traced_call(prompt):
    trace_id = str(uuid.uuid4())[:8]
    start = time.time()
    output = call_model(prompt)
    # TODO: compute latency in ms and build a structured record dict.
    record = {"trace_id": trace_id, "prompt": prompt, "output": output}
    return record

print(sorted(traced_call("hi").keys()))
`,
      solution_code: `import time, uuid

def call_model(prompt):
    return "answer to: " + prompt

def traced_call(prompt):
    trace_id = str(uuid.uuid4())[:8]
    start = time.time()
    output = call_model(prompt)
    latency_ms = round((time.time() - start) * 1000)
    record = {
        "trace_id": trace_id,
        "prompt": prompt,
        "output": output,
        "latency_ms": latency_ms,
    }
    return record

print(sorted(traced_call("hi").keys()))
`,
      expected_output: `['latency_ms', 'output', 'prompt', 'trace_id']`,
      step_throughs: [
        {
          title: "turning a bare call into a traced call",
          steps: [
            { label: "Assign a trace ID", detail: "A unique ID is generated up front so every record for this request can be tied together and surfaced to the user in a bug report.", code: 'trace_id = str(uuid.uuid4())' },
            { label: "Start the clock", detail: "Capture the start time immediately before the model call so the measured latency reflects only the work that matters.", code: "start = time.time()" },
            { label: "Capture inputs and output", detail: "Record the prompt, model, settings, and the returned output together. This is the input-output pair you will later debug and evaluate on.", code: "output = call_model(prompt, model)" },
            { label: "Emit a structured record", detail: "Compute latency, assemble a JSON object, and ship it to a searchable store. Return the trace_id so the caller can quote it.", code: 'print(json.dumps(record))' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Two log formats: (A) 'request handled' and (B) {\"trace_id\":\"a1\",\"latency_ms\":4200,\"model\":\"big\"}. A user complains a request was slow. Which log lets you act, and what do you learn?",
          steps: [
            "Format A has no identifier, timing, or model, so the slow request is indistinguishable from every other.",
            "Format B records latency_ms of 4200 and the model used, so you can confirm the request was genuinely slow.",
            "You also learn which model was responsible, pointing you at the fix."
          ],
          output: "Format B: it shows the request took 4.2s on the 'big' model, giving you a concrete lead."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A multi-step agent calls the model three times to answer one user request. Step 2 produces a bad intermediate result, derailing the final answer. Your logs assign a fresh random ID to each model call. Why can't you find the culprit, and how do you fix the tracing?",
          steps: [
            "Each of the three calls has an unrelated random ID, so nothing links them back to the single user request.",
            "You can see three calls happened somewhere, but not that they belong together or in what order.",
            "Fix: assign one trace_id at the start of the user request and pass it into all three steps as a shared field, plus a per-step span_id and order index.",
            "Now you can pull all records with that trace_id, sort by step order, and see step 2's bad intermediate output directly."
          ],
          output: "Use one shared trace_id across all steps (with per-step span IDs) so the whole request is reconstructable end to end."
        }
      ],
      comparison_tables: [
        {
          title: "blind logging vs real tracing",
          columns: ["Capability", "Blind logging", "Real tracing"],
          rows: [
            { cells: ["Find one request", "Impossible", "Look up by trace ID"] },
            { cells: ["Spot slow calls", "No timing recorded", "Filter by latency_ms"] },
            { cells: ["Feed evals", "Nothing to replay", "Replay real prompt/output pairs"] },
            { cells: ["Debug a complaint", "Guesswork", "Reconstruct the exact call"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "useful trace field vs noise",
          bins: [
            { id: "trace", label: "Belongs in a trace" },
            { id: "noise", label: "Not useful (or unsafe)" }
          ],
          items: [
            { id: "i1", text: "trace_id of the request", bin: "trace" },
            { id: "i2", text: "latency in milliseconds", bin: "trace" },
            { id: "i3", text: "the prompt and the model output", bin: "trace" },
            { id: "i4", text: "input and output token counts", bin: "trace" },
            { id: "i5", text: "a raw, unredacted credit card number", bin: "noise" },
            { id: "i6", text: "the literal string 'request handled' with nothing else", bin: "noise" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is tracing the foundation that evals and cost monitoring depend on?",
          sampleAnswer: "Evals need real input-output pairs to score, and cost monitoring needs per-call token counts to add up. Both can only measure traffic that was actually recorded. If you never traced a request, there is nothing to evaluate and no token count to bill against, so tracing has to come first; everything downstream is built on the records it produces."
        }
      ],
      hints: [
        "Capture start = time.time() before the call and subtract after to get elapsed seconds.",
        "Multiply elapsed seconds by 1000 and round() to get whole milliseconds.",
        "Add the latency_ms field to the record dict alongside trace_id, prompt, and output."
      ],
      challenge_title: "The Trace Digest",
      challenge_description: "Roll up a morning of request traces into the five numbers an on-call engineer actually needs: volume, average and tail latency, token spend, and error rate.",
      challenge_difficulty: "intermediate",
      challenge_story: "A user reports a garbage answer 'sometime this morning.' Right now your logs say \`INFO: request handled\` and nothing else — useless. You wire up real **tracing**: every request now emits a record with its latency, token count, and status. The first batch of traces just landed. Turn that raw stream into a digest the dashboard can show, including the **p95 latency** that the average always hides.",
      challenge_statement: "Given \`N\` trace records, each with a latency (ms), a token count, and a status (\`0\` = ok, \`1\` = error), compute the digest:\n\n- **requests** — the total count `N`.\n- **avg_latency_ms** — mean latency, rounded to **1 decimal place**.\n- **p95_latency_ms** — the 95th-percentile latency using the **nearest-rank** method: sort latencies ascending, take the value at rank `ceil(0.95 * N)` (1-indexed).\n- **total_tokens** — sum of all token counts.\n- **error_rate_pct** — percentage of records with status `1`, rounded to **1 decimal place**.",
      challenge_input_format: "The first line contains a single integer `N`.\nEach of the next `N` lines contains three space-separated integers: `latency_ms tokens status`.",
      challenge_output_format: "Five lines:\n- `requests <N>`\n- `avg_latency_ms <avg to 1 decimal>`\n- `p95_latency_ms <integer>`\n- `total_tokens <sum>`\n- `error_rate_pct <rate to 1 decimal>`",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ latency_ms ≤ 1000000",
        "0 ≤ tokens ≤ 1000000",
        "status is 0 or 1",
        "p95 uses nearest-rank: rank = ceil(0.95 × N), 1-indexed into the ascending-sorted latencies."
      ],
      challenge_examples: [
        { input: "4\n100 50 0\n300 80 1\n200 60 0\n400 70 0", output: "requests 4\navg_latency_ms 250.0\np95_latency_ms 400\ntotal_tokens 260\nerror_rate_pct 25.0", explanation: "Average = (100+300+200+400)/4 = 250.0. Sorted = [100,200,300,400]; rank = ceil(0.95×4) = 4, so p95 = 400. Tokens sum to 260. One of four is an error = 25.0%." },
        { input: "1\n250 100 1", output: "requests 1\navg_latency_ms 250.0\np95_latency_ms 250\ntotal_tokens 100\nerror_rate_pct 100.0", explanation: "A single trace: it is its own average and p95, and being an error makes the error rate 100.0%." }
      ],
      challenge_notes: "p95 is the number you page on, not the average — one slow request hides in a healthy-looking mean but jumps out at the tail. Nearest-rank avoids floating-point interpolation: rank `ceil(0.95 × N)` always lands on a real data point, so the output is an exact integer.",
      challenge_hints: [
        "Collect latencies in a list, sum tokens, and count statuses equal to 1 in one pass.",
        "For p95: `s = sorted(latencies)` then `p95 = s[math.ceil(0.95 * n) - 1]` (subtract 1 for 0-indexing).",
        "Format avg and error rate with `f\"{value:.1f}\"`."
      ],
      challenge_starter_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    latencies = []
    errors = 0
    total_tokens = 0
    for _ in range(n):
        latency, tokens, status = map(int, data[idx].split()); idx += 1
        latencies.append(latency)
        total_tokens += tokens
        if status == 1:
            errors += 1

    count = n
    s = sorted(latencies)
    rank = math.ceil(0.95 * count)   # nearest-rank: 1-indexed rank for p95
    p95 = s[rank - 1]                # subtract 1 for 0-indexing into s
    # TODO: compute avg (mean latency) and error_rate (percent of status==1),
    #       then print the five lines: requests, avg_latency_ms (1 decimal),
    #       p95_latency_ms, total_tokens, error_rate_pct (1 decimal).

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    latencies = []
    errors = 0
    total_tokens = 0
    for _ in range(n):
        latency, tokens, status = map(int, data[idx].split()); idx += 1
        latencies.append(latency)
        total_tokens += tokens
        if status == 1:
            errors += 1

    count = n
    avg = sum(latencies) / count
    s = sorted(latencies)
    rank = math.ceil(0.95 * count)
    p95 = s[rank - 1]
    error_rate = errors / count * 100

    print(f"requests {count}")
    print(f"avg_latency_ms {avg:.1f}")
    print(f"p95_latency_ms {p95}")
    print(f"total_tokens {total_tokens}")
    print(f"error_rate_pct {error_rate:.1f}")

main()
`,
      challenge_test_cases: [
        { input: "4\n100 50 0\n300 80 1\n200 60 0\n400 70 0", expected_output: "requests 4\navg_latency_ms 250.0\np95_latency_ms 400\ntotal_tokens 260\nerror_rate_pct 25.0", description: "Four traces: avg 250.0, p95 lands on 400, 25% error rate." },
        { input: "5\n120 30 0\n90 40 0\n300 20 1\n150 35 0\n80 25 0", expected_output: "requests 5\navg_latency_ms 148.0\np95_latency_ms 300\ntotal_tokens 150\nerror_rate_pct 20.0", description: "The single 300 ms outlier is the p95 even though the average is only 148.0." },
        { input: "1\n250 100 1", expected_output: "requests 1\navg_latency_ms 250.0\np95_latency_ms 250\ntotal_tokens 100\nerror_rate_pct 100.0", description: "Edge case: a single error trace gives a 100.0% error rate." }
      ]
    },
    {
      id: "ai-16-l3",
      project_id: "ai-16",
      order: 3,
      title: "Evals in CI",
      concept: "CIEvals",
      xp_reward: 10,
      explanation: `You tweak one line of your prompt to fix a formatting bug. It ships. Two days later you discover the tweak quietly broke 12 percent of answers on a different task that you never thought to re-test. With normal code, a unit test would have caught the regression in seconds. With prompts, most teams have no test at all — they ship on vibes. **Evals** are how you stop doing that.

## What it is

An **eval** is an automated test for an LLM's behavior. Instead of asserting \`add(2,3) == 5\`, you run the model on a fixed set of example inputs, score each output against a rule or expected answer, and compute a pass rate. Run that whole suite automatically on every change — in **CI**, your continuous integration pipeline — and a prompt change that drops the score below a threshold fails the build before it reaches users.

The hard part is that LLM output is not exactly equal to a golden string. So evals use **graders**: checks like "does the output contain the required field," "is it valid JSON," "does it match this regex," or even "does a second model judge it as correct."

## How it works

A minimal eval suite is a list of cases plus a grader plus a threshold:

\`\`\`python
cases = [
    {"input": "2+2",      "expect": "4"},
    {"input": "capital of France", "expect": "Paris"},
]

def grade(output, expected):
    return expected.lower() in output.lower()   # a simple contains grader

def run_evals(cases, threshold=0.8):
    passed = sum(grade(call_model(c["input"]), c["expect"]) for c in cases)
    score = passed / len(cases)
    if score < threshold:
        raise SystemExit(f"FAIL: {score:.0%} < {threshold:.0%}")
    print(f"PASS: {score:.0%}")
\`\`\`

In CI, \`raise SystemExit\` makes the pipeline red, which blocks the merge. The threshold encodes your quality bar: maybe 80 percent passing is fine for a brainstorming feature but 99 percent is required for an extraction task.

## Why it matters

Evals turn prompt engineering from guesswork into engineering:

- **Catch regressions automatically.** A change that helps one task and silently breaks another gets flagged before merge, not by an angry user.
- **Compare models and prompts objectively.** Swapping to a cheaper model is a one-number decision: did the eval score hold?
- **Make quality a gate, not a hope.** "Don't merge if the score drops" is enforceable in CI; "please test your prompt" is not.

Two pitfalls to respect. Evals are only as good as their cases, so build them from **real production traces** (the previous lesson), not toy inputs. And a single flaky example can make a green suite go red randomly — keep graders deterministic where you can, and treat model-as-judge graders as noisier than rule-based ones.

## The mental model to keep

A prompt is code, and **code without tests rots silently.** An eval suite in CI is the unit-test safety net that lets you change prompts and models without praying.`,
      key_terms: [
        { term: "Eval", definition: "An automated test that runs a model on fixed inputs and scores the outputs against rules or expected answers." },
        { term: "CI (continuous integration)", definition: "A pipeline that automatically runs checks on every change and can block a merge if they fail." },
        { term: "Grader", definition: "The logic that decides if one output passes: contains-text, regex, JSON-valid, or model-as-judge." },
        { term: "Threshold", definition: "The minimum pass rate a suite must hit; falling below it fails the build." }
      ],
      callouts: [
        { type: "analogy", title: "Unit tests for behavior", content: "A unit test pins down what a function should return. An eval pins down what a prompt should produce — same safety net, applied to fuzzy text output instead of exact return values.", position: "before" },
        { type: "tip", title: "Build cases from real traces", content: "The strongest eval cases are real prompts your users actually sent, pulled from your traces. Toy inputs pass while real traffic quietly fails.", position: "after" }
      ],
      concept_diagram: {
        title: "An eval suite gating a merge",
        steps: [
          { label: "Collect cases", desc: "Gather real inputs with expected results or rules." },
          { label: "Run the model", desc: "Generate an output for every case in the suite." },
          { label: "Grade and score", desc: "Apply graders, compute the pass rate." },
          { label: "Gate on threshold", desc: "Below the bar, fail CI and block the merge." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does an eval do that a plain unit test usually does not?",
          options: ["Run faster", "Grade fuzzy text output against a rule instead of an exact equality", "Replace the model entirely"],
          correct_index: 1,
          explanation: "LLM output is not an exact golden string, so evals use graders like contains, regex, or model-as-judge rather than ==."
        }
      ],
      quiz_questions: [
        {
          question: "How does an eval suite in CI prevent a bad prompt change from reaching users?",
          options: [
            "It rewrites the prompt automatically",
            "If the pass rate drops below the threshold, it fails the build and blocks the merge",
            "It emails the user for approval",
            "It deletes the change"
          ],
          correct_index: 1,
          explanation: "CI runs the suite on every change; a score below the threshold makes the pipeline fail, which blocks the merge."
        },
        {
          question: "Why can't most evals just check output == expected_string?",
          options: [
            "Strings are too slow to compare",
            "LLM output varies in wording, so graders like contains, regex, or JSON-valid are needed",
            "Python cannot compare strings",
            "Expected answers are secret"
          ],
          correct_index: 1,
          explanation: "Model output is not byte-identical to a golden answer, so flexible graders judge correctness instead of exact equality."
        },
        {
          question: "Where should the strongest eval cases come from?",
          options: [
            "Random made-up inputs",
            "Real production traces of prompts users actually sent",
            "The model's own suggestions",
            "Only the happy-path example from the docs"
          ],
          correct_index: 1,
          explanation: "Cases built from real traffic catch the failures that matter; toy inputs can pass while real prompts break."
        }
      ],
      participation_activities: [
        {
          activity_title: "Evals in CI check",
          questions: [
            { question: "An eval suite that passes at 100 percent on toy inputs guarantees production quality.", type: "true_false", correct_answer: "false", explanation: "Evals are only as good as their cases; toy inputs can pass while real traffic fails." },
            { question: "The minimum pass rate a suite must hit before CI lets a change merge is called the ______.", type: "fill_in", correct_answer: "threshold", explanation: "Falling below the threshold fails the build and blocks the merge." }
          ]
        }
      ],
      starter_code: `# Run a tiny eval suite and compute a pass rate.
def call_model(prompt):
    answers = {"2+2": "the answer is 4", "capital of France": "It is Paris."}
    return answers.get(prompt, "unknown")

cases = [
    {"input": "2+2", "expect": "4"},
    {"input": "capital of France", "expect": "Paris"},
]

def grade(output, expected):
    return expected.lower() in output.lower()

def run_evals(cases):
    # TODO: count how many cases pass and return the fraction passing.
    pass

print(run_evals(cases))
`,
      solution_code: `def call_model(prompt):
    answers = {"2+2": "the answer is 4", "capital of France": "It is Paris."}
    return answers.get(prompt, "unknown")

cases = [
    {"input": "2+2", "expect": "4"},
    {"input": "capital of France", "expect": "Paris"},
]

def grade(output, expected):
    return expected.lower() in output.lower()

def run_evals(cases):
    passed = sum(grade(call_model(c["input"]), c["expect"]) for c in cases)
    return passed / len(cases)

print(run_evals(cases))
`,
      expected_output: `1.0`,
      step_throughs: [
        {
          title: "one eval run, from cases to a gate",
          steps: [
            { label: "Load the cases", detail: "Each case pairs an input with an expected result or rule. The best cases come from real production traces, not invented examples.", code: 'cases = [{"input": "2+2", "expect": "4"}, ...]' },
            { label: "Run the model on each", detail: "Generate an output for every input. This is the same model and settings you run in production, so the test reflects reality.", code: "output = call_model(case[\"input\"])" },
            { label: "Grade each output", detail: "Apply a grader — here a case-insensitive contains check — to turn each fuzzy output into a pass or fail boolean.", code: 'passed = expect.lower() in output.lower()' },
            { label: "Score and gate", detail: "Divide passes by total to get a rate, then compare to the threshold. Below it, raise SystemExit so CI turns red and the merge is blocked.", code: 'if score < 0.8: raise SystemExit("FAIL")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "An eval suite has 10 cases. After a prompt change, 7 pass. The threshold is 0.8. Does CI pass or fail, and what should happen to the change?",
          steps: [
            "Pass rate = 7 / 10 = 0.7.",
            "The threshold is 0.8, and 0.7 is below it.",
            "CI fails the build, which blocks the merge until the change is fixed or the regression understood."
          ],
          output: "0.7 < 0.8, so CI fails and the change is blocked from merging."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your extraction eval uses an exact-match grader and is stuck at 60 percent, even though humans say most outputs are actually correct. The model returns valid JSON but with keys in a different order and extra whitespace. Diagnose and fix the eval design.",
          steps: [
            "Exact string match treats {\"a\":1,\"b\":2} and {\"b\":2, \"a\":1} as different, even though they are the same object.",
            "So the grader is failing correct answers on cosmetic differences — the eval is measuring formatting, not correctness.",
            "Fix: parse both the output and the expected answer as JSON and compare the resulting objects, which ignores key order and whitespace.",
            "If outputs are sometimes near-misses, add a stricter schema/field-level grader rather than relying on string equality."
          ],
          output: "Parse and compare as JSON objects, not raw strings, so key order and whitespace stop causing false failures."
        }
      ],
      comparison_tables: [
        {
          title: "shipping on vibes vs evals in CI",
          columns: ["Question", "Ship on vibes", "Evals in CI"],
          rows: [
            { cells: ["Catch regressions", "Only when a user complains", "Automatically, before merge"] },
            { cells: ["Compare two prompts", "Subjective argument", "Compare two scores"] },
            { cells: ["Swap to a cheaper model", "Risky guess", "One-number decision"] },
            { cells: ["Quality enforcement", "A hope", "A gate that blocks merges"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "valid grader vs not a real grader",
          bins: [
            { id: "grader", label: "Valid grader" },
            { id: "notgrader", label: "Not a real grader" }
          ],
          items: [
            { id: "i1", text: "Output contains the required substring", bin: "grader" },
            { id: "i2", text: "Output is valid, parseable JSON", bin: "grader" },
            { id: "i3", text: "Output matches a regex pattern", bin: "grader" },
            { id: "i4", text: "A second model judges the answer correct", bin: "grader" },
            { id: "i5", text: "The output simply looks nice to whoever glances at it", bin: "notgrader" },
            { id: "i6", text: "Nobody checks; it ships if the demo felt fine", bin: "notgrader" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is treating a prompt 'like code' the key idea behind putting evals in CI?",
          sampleAnswer: "A prompt determines behavior just like a function does, so a change to it can introduce regressions exactly the way a code change can. Code is protected by unit tests that run automatically and block merges when they fail; treating the prompt as code means giving it the same safety net. Evals in CI are that net, turning prompt changes from untested vibes into changes gated by a measurable quality bar."
        }
      ],
      hints: [
        "Use sum(...) over a generator of grade() booleans, since True counts as 1.",
        "Divide the number passed by len(cases) to get the fraction.",
        "Return the fraction directly; the contains-grader is case-insensitive via .lower()."
      ],
      challenge_title: "The CI Eval Gate",
      challenge_description: "Run a prompt's eval suite in CI: grade every case with a substring check, compute the pass rate, and gate the deploy against a threshold.",
      challenge_difficulty: "beginner",
      challenge_story: "You changed one line of a prompt to fix a formatting bug. With normal code a unit test would catch any regression — with prompts, most teams ship on vibes. Not yours. You've built an **eval suite**: a frozen set of cases, each with an expected answer fragment, run automatically in **CI** on every change. A run just kicked off. Grade each case, compute the pass rate, and decide whether this build is allowed to merge.",
      challenge_statement: "An eval run has \`N\` cases and a pass-rate \`threshold\` (an integer percent). Each case provides an **expected** fragment and the model's **actual** output, separated by the literal delimiter \`|||\`.\n\nGrade each case with a **case-insensitive substring** check: the case **passes** if the expected fragment appears anywhere in the actual output, ignoring letter case. Then:\n\n- count how many cases passed,\n- compute the pass rate as a percentage, rounded to **1 decimal place**,\n- output \`PASS\` if the pass rate is **at least** the threshold, otherwise \`FAIL\`.",
      challenge_input_format: "The first line contains two space-separated integers: `N threshold`.\nEach of the next `N` lines is one case formatted as `expected|||actual` (the delimiter is three literal pipe characters). Either side may contain spaces; neither side contains `|||`.",
      challenge_output_format: "Three lines:\n- `passed <p>/<N>`\n- `pass_rate <rate to 1 decimal>`\n- `PASS` or `FAIL`",
      challenge_constraints: [
        "1 ≤ N ≤ 10000",
        "0 ≤ threshold ≤ 100",
        "Grading is case-insensitive substring containment of expected within actual.",
        "The gate passes when pass_rate ≥ threshold (inclusive)."
      ],
      challenge_examples: [
        { input: "4 75\nparis|||The capital is Paris.\n4|||2 plus 2 equals 4\nyes|||Absolutely, yes!\nblue|||The sky is gray today", output: "passed 3/4\npass_rate 75.0\nPASS", explanation: "'paris' matches 'Paris' case-insensitively, '4' and 'yes' match too; only 'blue' is absent. 3/4 = 75.0%, which meets the 75 threshold." },
        { input: "5 80\njson|||valid json output\nok|||status ok\nrefund|||processing your refund now\nyes|||no\ndone|||all done here", output: "passed 4/5\npass_rate 80.0\nPASS", explanation: "Four of five fragments appear; only 'yes' is missing from 'no'. 4/5 = 80.0%, exactly the threshold, so it passes." }
      ],
      challenge_notes: "The gate is **inclusive**: a pass rate exactly equal to the threshold still passes — CI should not block a build that meets the bar. Case-insensitive matching mirrors real graders, where 'Paris' and 'paris' are the same correct answer.",
      challenge_hints: [
        "Split the first line into N and threshold with `map(int, ...)`.",
        "For each case, `expected, actual = line.split('|||')`, then test `expected.lower() in actual.lower()`.",
        "pass_rate = passed / N * 100; print `PASS` when `pass_rate >= threshold`."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    passed = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        expected, actual = line.split("|||")
        # TODO: case-insensitive substring grade; increment passed when it matches
        pass

    # TODO: compute pass_rate, print the three lines, gate against threshold.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    passed = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        expected, actual = line.split("|||")
        if expected.lower() in actual.lower():
            passed += 1

    total = n
    pass_rate = passed / total * 100
    verdict = "PASS" if pass_rate >= threshold else "FAIL"

    print(f"passed {passed}/{total}")
    print(f"pass_rate {pass_rate:.1f}")
    print(verdict)

main()
`,
      challenge_test_cases: [
        { input: "4 75\nparis|||The capital is Paris.\n4|||2 plus 2 equals 4\nyes|||Absolutely, yes!\nblue|||The sky is gray today", expected_output: "passed 3/4\npass_rate 75.0\nPASS", description: "Case-insensitive match lets 'paris' pass against 'Paris'; 3/4 meets the threshold." },
        { input: "5 80\njson|||valid json output\nok|||status ok\nrefund|||processing your refund now\nyes|||no\ndone|||all done here", expected_output: "passed 4/5\npass_rate 80.0\nPASS", description: "Pass rate exactly equals the threshold and still passes (inclusive)." },
        { input: "1 100\nhello|||say HELLO world", expected_output: "passed 1/1\npass_rate 100.0\nPASS", description: "Single case, uppercase HELLO matches lowercase expected at a 100 threshold." }
      ]
    },
    {
      id: "ai-16-l4",
      project_id: "ai-16",
      order: 4,
      title: "Cost Monitoring",
      concept: "CostMonitor",
      xp_reward: 10,
      explanation: `A startup launched a free AI feature on a Friday. It went mildly viral over the weekend. On Monday they opened a five-figure model bill — one script in a retry loop had hammered the API thousands of times, and nobody was watching. The model did exactly what it was told. There was simply no **cost monitoring** to catch it, and no limit to stop it.

## What it is

**Cost monitoring** is tracking what your LLM usage is spending, in real time, and alerting or cutting it off before a surprise becomes a disaster. Because APIs bill **per token**, cost is fully computable from data you already trace: input tokens times the input price, plus output tokens times the output price. The trick is to compute it continuously, attribute it (per user, per feature), and put a ceiling on it.

A useful cost record for each call is just \`input_tokens\`, \`output_tokens\`, and the prices — multiply and you have the exact spend.

## How it works

You attach a cost calculation to the traced call from lesson 2:

\`\`\`python
PRICES = {  # dollars per 1,000,000 tokens
    "small": {"in": 0.15, "out": 0.60},
    "big":   {"in": 3.00, "out": 15.00},
}

def call_cost(model, in_tokens, out_tokens):
    p = PRICES[model]
    return (in_tokens * p["in"] + out_tokens * p["out"]) / 1_000_000

# accumulate per user, and enforce a daily ceiling
def charge(user_budget, cost):
    if user_budget["spent"] + cost > user_budget["limit"]:
        raise RuntimeError("budget exceeded")  # stop before spending more
    user_budget["spent"] += cost
\`\`\`

Three moves matter. **Compute** cost from token counts on every call. **Attribute** it to a user or feature so you know where the money goes. **Cap** it with a budget that refuses the call once a limit is hit, so a runaway loop dies instead of draining your account.

## Why it matters

Cost is the variable that ends LLM projects that otherwise work:

- **Output tokens dominate.** Output usually costs several times more than input, so a verbose model or an unbounded \`max_tokens\` is where bills explode. Cap output length.
- **Model choice is a money lever.** A "big" model can be 10 to 20 times the price of a "small" one. Routing easy requests to the cheap model is often the single biggest savings.
- **Abuse and bugs are unbounded.** A retry loop, a malicious user, or a prompt that pastes a whole book can multiply spend without limit unless a ceiling stops it.
- **Per-user budgets protect the business.** Without attribution, one heavy user can quietly consume the margin from a thousand light ones.

A caution: do not optimize cost blind to quality. Cutting to the cheapest model or the shortest output can tank your eval score, so watch cost and the evals from the previous lesson together.

## The mental model to keep

Every token is a coin. **Count the coins as you spend them and set a ceiling** — because an LLM will happily spend at machine speed until something tells it to stop.`,
      key_terms: [
        { term: "Cost monitoring", definition: "Continuously tracking LLM spend and alerting or stopping before it overruns." },
        { term: "Per-token pricing", definition: "APIs charge per input and output token, so cost is computable from token counts." },
        { term: "Attribution", definition: "Assigning spend to a specific user or feature so you know where the money goes." },
        { term: "Budget cap", definition: "A spending ceiling that refuses further calls once a limit is reached." }
      ],
      callouts: [
        { type: "analogy", title: "A water meter with a shutoff", content: "You meter water as it flows so a hidden leak shows up on the bill, and a shutoff valve stops a burst pipe from flooding the house. Cost monitoring meters tokens; the budget cap is the shutoff valve.", position: "before" },
        { type: "warning", title: "Output tokens cost the most", content: "Output is typically several times the price of input, so an unbounded max_tokens or a chatty model is where bills explode. Cap output length deliberately.", position: "after" }
      ],
      concept_diagram: {
        title: "From tokens to a guarded budget",
        steps: [
          { label: "Count tokens", desc: "Read input and output token counts per call." },
          { label: "Compute cost", desc: "Multiply tokens by the model's prices." },
          { label: "Attribute spend", desc: "Add it to the right user or feature tally." },
          { label: "Enforce the cap", desc: "Refuse the call once the budget limit is hit." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which usually costs more per token?",
          options: ["Input tokens", "Output tokens", "They always cost the same"],
          correct_index: 1,
          explanation: "Output tokens typically cost several times more than input, so verbose answers dominate the bill."
        }
      ],
      quiz_questions: [
        {
          question: "Why is LLM cost fully computable without a separate billing system?",
          options: [
            "The model reports its own dollar cost",
            "APIs bill per token, so cost is input and output token counts times their prices",
            "Cost is a fixed monthly fee",
            "It cannot be computed in advance"
          ],
          correct_index: 1,
          explanation: "Per-token pricing means cost is just token counts multiplied by the per-token prices you already know."
        },
        {
          question: "What does a per-user budget cap protect against?",
          options: [
            "The model getting slower",
            "A runaway loop or heavy user draining the account before anyone notices",
            "The prompt being too short",
            "Logs filling up the disk"
          ],
          correct_index: 1,
          explanation: "A cap refuses further calls once a limit is hit, so a bug or abusive user cannot spend without bound."
        },
        {
          question: "What is the danger of optimizing cost without watching evals?",
          options: [
            "Nothing, cheaper is always better",
            "Cutting to the cheapest model or shortest output can tank answer quality",
            "Evals make cost go up",
            "It violates the API terms"
          ],
          correct_index: 1,
          explanation: "Cost and quality trade off, so the cheapest choice can wreck your eval score; watch both together."
        }
      ],
      participation_activities: [
        {
          activity_title: "Cost monitoring check",
          questions: [
            { question: "Because APIs bill per token, you can compute the exact cost of a call from its token counts.", type: "true_false", correct_answer: "true", explanation: "Cost equals input tokens times input price plus output tokens times output price." },
            { question: "A spending ceiling that refuses further calls once a limit is reached is called a budget ______.", type: "fill_in", correct_answer: "cap", explanation: "The cap stops a runaway loop or heavy user from draining the account." }
          ]
        }
      ],
      starter_code: `# Compute the dollar cost of one model call from token counts.
PRICES = {
    "small": {"in": 0.15, "out": 0.60},   # per 1,000,000 tokens
    "big":   {"in": 3.00, "out": 15.00},
}

def call_cost(model, in_tokens, out_tokens):
    # TODO: cost = (in_tokens*in_price + out_tokens*out_price) / 1,000,000
    pass

print(round(call_cost("big", 1000, 500), 6))
`,
      solution_code: `PRICES = {
    "small": {"in": 0.15, "out": 0.60},
    "big":   {"in": 3.00, "out": 15.00},
}

def call_cost(model, in_tokens, out_tokens):
    p = PRICES[model]
    return (in_tokens * p["in"] + out_tokens * p["out"]) / 1_000_000

print(round(call_cost("big", 1000, 500), 6))
`,
      expected_output: `0.0105`,
      step_throughs: [
        {
          title: "from a call to an enforced budget",
          steps: [
            { label: "Read token counts", detail: "The traced call already recorded input and output token counts. Cost monitoring reuses exactly those numbers — no new measurement needed.", code: "in_tokens, out_tokens = record[\"in\"], record[\"out\"]" },
            { label: "Compute the cost", detail: "Multiply each token count by its per-token price and divide by a million. Output is priced higher, so it dominates the total.", code: "cost = (in_t * p_in + out_t * p_out) / 1_000_000" },
            { label: "Attribute it", detail: "Add the cost to the spending tally for this user or feature, so you can see who is consuming the budget.", code: 'budgets[user]["spent"] += cost' },
            { label: "Enforce the cap", detail: "Before the next call, check the tally against the limit. Once exceeded, refuse the request so a runaway loop cannot keep spending.", code: 'if spent + cost > limit: raise RuntimeError("budget exceeded")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A call on the 'big' model uses 1,000 input tokens and 500 output tokens. Input is $3 per million, output is $15 per million. What does it cost?",
          steps: [
            "Input cost = 1000 / 1,000,000 * 3 = $0.003.",
            "Output cost = 500 / 1,000,000 * 15 = $0.0075.",
            "Total = 0.003 + 0.0075 = $0.0105."
          ],
          output: "$0.0105 per call"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A feature makes 2,000,000 calls a month, each averaging 800 input and 400 output tokens. Compare the monthly bill on the 'big' model ($3 in / $15 out per million) vs routing all of it to 'small' ($0.15 in / $0.60 out per million). What is the savings?",
          steps: [
            "Per call on big = (800*3 + 400*15) / 1,000,000 = (2400 + 6000)/1e6 = $0.0084.",
            "Monthly on big = 0.0084 * 2,000,000 = $16,800.",
            "Per call on small = (800*0.15 + 400*0.60) / 1,000,000 = (120 + 240)/1e6 = $0.00036.",
            "Monthly on small = 0.00036 * 2,000,000 = $720, a savings of $16,080 — but only worth it if the small model still passes your evals."
          ],
          output: "Big costs $16,800/mo, small costs $720/mo: about $16,080 saved, if quality holds on evals."
        }
      ],
      comparison_tables: [
        {
          title: "no cost monitoring vs monitored and capped",
          columns: ["Scenario", "No monitoring", "Monitored + capped"],
          rows: [
            { cells: ["Runaway retry loop", "Unbounded bill", "Stopped at the cap"] },
            { cells: ["Heavy single user", "Drains shared budget", "Limited by per-user cap"] },
            { cells: ["Knowing the spend", "Found out on the invoice", "Tracked per call in real time"] },
            { cells: ["Reaction time", "After the damage", "Before it overruns"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "raises cost vs lowers cost",
          bins: [
            { id: "raise", label: "Raises cost" },
            { id: "lower", label: "Lowers cost" }
          ],
          items: [
            { id: "i1", text: "Unbounded max_tokens on every answer", bin: "raise" },
            { id: "i2", text: "Routing easy requests to a small model", bin: "lower" },
            { id: "i3", text: "A retry loop with no limit", bin: "raise" },
            { id: "i4", text: "Capping output length deliberately", bin: "lower" },
            { id: "i5", text: "Pasting a whole book into every prompt", bin: "raise" },
            { id: "i6", text: "Caching repeated identical requests", bin: "lower" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does cost monitoring depend on the tracing you set up earlier, and why isn't computing cost enough on its own?",
          sampleAnswer: "Cost monitoring reuses the per-call token counts that tracing already records, so without tracing there is nothing to multiply by the prices. But computing cost alone only tells you what you already spent; to actually protect the business you also need attribution, so you know which user or feature is responsible, and a budget cap that refuses calls once a limit is hit, so a runaway loop or abusive user is stopped before the bill explodes rather than discovered on the invoice."
        }
      ],
      hints: [
        "Look up the model's prices in PRICES[model] to get the 'in' and 'out' rates.",
        "Multiply in_tokens by the in price and out_tokens by the out price, then add them.",
        "Divide the total by 1,000,000 because prices are quoted per million tokens."
      ],
      challenge_title: "The Budget Throttle",
      challenge_description: "Meter a live stream of model calls against a hard spend cap: serve each request only if it keeps you under budget, and report the final ledger.",
      challenge_difficulty: "intermediate",
      challenge_story: "A free AI feature went viral over a weekend and a retry loop quietly rang up a five-figure bill — because nobody was watching the meter. Never again. You add a **budget throttle** in front of the model: every request's cost is computed up front, and a request is only served if it keeps cumulative spend at or under the day's cap. The throttle never blocks the whole stream — a request that would bust the budget is skipped, but a cheaper one later can still slip through. Run today's traffic and produce the ledger.",
      challenge_statement: "You are given \`N\` requests, a \`budget\`, and two prices — all amounts in **micro-dollars** (millionths of a dollar) to keep the math exact. The prices are **per 1000 tokens**:\n\n- \`in_price\` — micro-dollars per 1000 input tokens.\n- \`out_price\` — micro-dollars per 1000 output tokens.\n\nFor each request with \`in_tok\` input tokens and \`out_tok\` output tokens, its cost in micro-dollars is:\n\n\`cost = in_tok * in_price // 1000 + out_tok * out_price // 1000\`  (integer floor division per term).\n\nProcess requests in order. Serve a request only if **cumulative spent + cost ≤ budget**; otherwise reject it (do not add its cost) and keep going. Report the totals and the spend converted to dollars.",
      challenge_input_format: "The first line contains four space-separated integers: `N budget in_price out_price` (budget and prices in micro-dollars).\nEach of the next `N` lines contains two space-separated integers: `in_tok out_tok`.",
      challenge_output_format: "Four lines:\n- `served <count>`\n- `rejected <count>`\n- `spent $<dollars to 6 decimals>`\n- `remaining $<dollars to 6 decimals>`\nwhere dollars = micro-dollars / 1,000,000, formatted to exactly 6 decimal places.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ budget ≤ 1000000000",
        "0 ≤ in_price, out_price ≤ 1000000",
        "0 ≤ in_tok, out_tok ≤ 1000000",
        "Per-request cost uses integer floor division per term; the budget check is inclusive (spent + cost ≤ budget serves)."
      ],
      challenge_examples: [
        { input: "4 50000 3000 15000\n1000 500\n2000 1000\n500 200\n100 800", output: "served 4\nrejected 0\nspent $0.048300\nremaining $0.001700", explanation: "Costs (micro-$): 3000+7500=10500, 6000+15000=21000, 1500+3000=4500, 300+12000=12300. Running total 48300 ≤ 50000 at every step, so all four serve. Spent = $0.048300, remaining $0.001700." },
        { input: "4 40000 3000 15000\n1000 500\n5000 2000\n200 100\n1000 1000", output: "served 3\nrejected 1\nspent $0.030600\nremaining $0.009400", explanation: "Request 1 costs 10500 (total 10500). Request 2 costs 45000 → 55500 > 40000, rejected. Request 3 costs 2100 → 12600, served. Request 4 costs 18000 → 30600, served. The throttle skipped the expensive call but still let later cheap calls through." }
      ],
      challenge_notes: "Working in integer micro-dollars sidesteps floating-point drift entirely — you only convert to dollars at the very end. Note the throttle is per-request, not stop-on-first-overflow: a single huge request can be skipped while smaller ones after it still succeed.",
      challenge_hints: [
        "Keep `spent` as an integer in micro-dollars; only divide by 1,000,000 when printing.",
        "Compute each cost as `in_tok * in_price // 1000 + out_tok * out_price // 1000`.",
        "For exact 6-decimal output, use Decimal: `(Decimal(spent) / Decimal(1000000)).quantize(Decimal('0.000001'))`."
      ],
      challenge_starter_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, budget, in_price, out_price = map(int, data[idx].split()); idx += 1
    spent = 0
    served = 0
    rejected = 0
    for _ in range(n):
        in_tok, out_tok = map(int, data[idx].split()); idx += 1
        cost = in_tok * in_price // 1000 + out_tok * out_price // 1000
        # TODO: serve if spent + cost <= budget (add cost), else reject
        pass

    print(f"served {served}")
    print(f"rejected {rejected}")
    dollars = (Decimal(spent) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"spent \${dollars}")
    remaining = (Decimal(budget - spent) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"remaining \${remaining}")

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, budget, in_price, out_price = map(int, data[idx].split()); idx += 1
    spent = 0
    served = 0
    rejected = 0
    for _ in range(n):
        in_tok, out_tok = map(int, data[idx].split()); idx += 1
        cost = in_tok * in_price // 1000 + out_tok * out_price // 1000
        if spent + cost <= budget:
            spent += cost
            served += 1
        else:
            rejected += 1

    print(f"served {served}")
    print(f"rejected {rejected}")
    dollars = (Decimal(spent) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"spent \${dollars}")
    remaining = (Decimal(budget - spent) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"remaining \${remaining}")

main()
`,
      challenge_test_cases: [
        { input: "4 50000 3000 15000\n1000 500\n2000 1000\n500 200\n100 800", expected_output: "served 4\nrejected 0\nspent $0.048300\nremaining $0.001700", description: "Every request fits under the cap; spend lands just below budget." },
        { input: "4 40000 3000 15000\n1000 500\n5000 2000\n200 100\n1000 1000", expected_output: "served 3\nrejected 1\nspent $0.030600\nremaining $0.009400", description: "The expensive request 2 is throttled, but cheaper later requests still serve." },
        { input: "1 100 3000 15000\n1000 1000", expected_output: "served 0\nrejected 1\nspent $0.000000\nremaining $0.000100", description: "Edge case: a single request that exceeds the tiny budget is rejected and nothing is spent." }
      ]
    },
    {
      id: "ai-16-l5",
      project_id: "ai-16",
      order: 5,
      title: "Failures & Fallbacks",
      concept: "Fallbacks",
      xp_reward: 10,
      explanation: `Your app worked perfectly for a month. Then the model provider had a 40-minute outage, and because every request called that one API with no plan B, your entire product showed a spinning wheel and then an error to every single user. The outage was theirs. The total failure was yours — you depended on something that will, eventually, fail, and you had no **fallback**.

## What it is

A **fallback** is what your system does when the primary path fails. LLM calls fail in many ways: the provider is down, the request times out, you hit a rate limit, or the model returns malformed output. A production app treats every one of these as expected, not exceptional, and has a degraded-but-working answer ready.

The two core tools are **retries** (try again, because many failures are transient) and **fallbacks** (switch to a backup when retries won't help). The art is knowing which failure deserves which response.

## How it works

A resilient call layers retry, timeout, and a backup:

\`\`\`python
import time

def robust_call(prompt, retries=2):
    for attempt in range(retries + 1):
        try:
            return call_primary(prompt, timeout=10)   # main model
        except RateLimitError:
            time.sleep(2 ** attempt)   # exponential backoff, then retry
        except TimeoutError:
            continue                   # transient, retry
        except Exception:
            break                      # not retryable, stop early
    return call_backup(prompt)         # fallback model or cached answer
\`\`\`

Notice the decisions. A **rate limit** gets **exponential backoff** — wait longer each try — because hammering a throttled API makes it worse. A **timeout** is retried because it is often transient. A hard error breaks out immediately rather than wasting retries. When the primary path is exhausted, the **fallback** runs: a cheaper backup model, a cached response, or an honest "service is busy, try again."

## Why it matters

The difference between a toy and a product is what happens on a bad day:

- **Everything fails eventually.** Providers have outages, networks blip, rate limits trigger. Designing as if the model is always up guarantees a total outage when it isn't.
- **Retry the retryable, not the rest.** Retrying a timeout is smart; retrying a malformed-output bug just burns money and time on the same failure. Match the response to the cause.
- **Backoff prevents a stampede.** When a provider wobbles, every client retrying instantly at once can keep it down. Exponential backoff with jitter spreads the load and lets it recover.
- **Degrade gracefully.** A slower backup model or a cached answer keeps users served. A clear "we are busy, retry shortly" beats a stack trace. Failing softly retains users; failing hard loses them.

One caution: retries multiply cost and latency, and infinite retries can turn a brief blip into a self-inflicted outage. Cap the attempts, add a timeout, and pair this with the cost monitoring from the previous lesson.

## The mental model to keep

Production is not "make it work." Production is **decide what happens when it breaks** — because it will. Layer retries for transient faults, fallbacks for the rest, and always leave the user with a working, if humbler, answer.`,
      key_terms: [
        { term: "Fallback", definition: "A backup path (cheaper model, cache, or honest message) used when the primary call fails." },
        { term: "Retry", definition: "Trying a failed call again, useful when the failure is transient like a timeout." },
        { term: "Exponential backoff", definition: "Waiting progressively longer between retries so a struggling service can recover." },
        { term: "Graceful degradation", definition: "Continuing to serve a reduced-but-working result instead of failing completely." }
      ],
      callouts: [
        { type: "analogy", title: "A backup generator", content: "A hospital does not assume the grid never fails; it wires in a generator that kicks on automatically. A fallback is that generator for your LLM call: the lights stay on with a backup when the main source goes dark.", position: "before" },
        { type: "warning", title: "Don't retry what won't recover", content: "Retrying a transient timeout is smart; retrying a malformed-output or auth error just wastes money and time on the same guaranteed failure. Match the response to the cause.", position: "after" }
      ],
      concept_diagram: {
        title: "How a resilient call handles failure",
        steps: [
          { label: "Try the primary", desc: "Call the main model with a timeout." },
          { label: "Classify the failure", desc: "Is it transient (retry) or permanent (stop)?" },
          { label: "Retry with backoff", desc: "Wait longer each attempt, up to a cap." },
          { label: "Fall back", desc: "Use a backup model, cache, or honest message." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which failure is the best candidate for a simple retry?",
          options: ["A transient network timeout", "An invalid API key", "Malformed output from a buggy prompt"],
          correct_index: 0,
          explanation: "A timeout is often transient, so retrying may succeed. A bad key or a prompt bug will fail again identically."
        }
      ],
      quiz_questions: [
        {
          question: "Why use exponential backoff when retrying after a rate limit?",
          options: [
            "To make the code shorter",
            "Waiting longer each attempt lets a throttled service recover instead of being hammered",
            "It guarantees the call succeeds",
            "Rate limits require it by law"
          ],
          correct_index: 1,
          explanation: "Retrying instantly and repeatedly keeps a struggling service overloaded; backoff spreads the load and gives it room to recover."
        },
        {
          question: "What is graceful degradation?",
          options: [
            "Shutting down the whole app on any error",
            "Serving a reduced-but-working result, like a backup model or cached answer, instead of failing completely",
            "Retrying forever until it works",
            "Hiding all errors from logs"
          ],
          correct_index: 1,
          explanation: "Degrading gracefully keeps users served with a humbler answer rather than showing a total failure."
        },
        {
          question: "What is the risk of uncapped, instant retries during a provider wobble?",
          options: [
            "Nothing, more retries are always safer",
            "Every client retrying at once can keep the service down and multiply your cost",
            "The model forgets the prompt",
            "Retries disable logging"
          ],
          correct_index: 1,
          explanation: "A synchronized retry stampede can prolong the outage, and uncapped retries multiply latency and cost."
        }
      ],
      participation_activities: [
        {
          activity_title: "Failures and fallbacks check",
          questions: [
            { question: "In production you should assume the model provider never has an outage.", type: "true_false", correct_answer: "false", explanation: "Everything fails eventually; resilient systems plan for outages, timeouts, and rate limits." },
            { question: "Switching to a backup model or cached answer when the primary call fails is called a ______.", type: "fill_in", correct_answer: "fallback", explanation: "The fallback keeps users served when retries cannot help." }
          ]
        }
      ],
      starter_code: `# Decide whether a failure should be retried.
RETRYABLE = {"timeout", "rate_limit", "server_error"}

def should_retry(failure_type):
    # TODO: return True only if the failure is in RETRYABLE.
    pass

print(should_retry("timeout"))
print(should_retry("invalid_api_key"))
`,
      solution_code: `RETRYABLE = {"timeout", "rate_limit", "server_error"}

def should_retry(failure_type):
    return failure_type in RETRYABLE

print(should_retry("timeout"))
print(should_retry("invalid_api_key"))
`,
      expected_output: `True
False`,
      step_throughs: [
        {
          title: "one request surviving a primary failure",
          steps: [
            { label: "Try the primary", detail: "Call the main model with a timeout so a hang cannot block forever. Most of the time this returns and you are done.", code: "return call_primary(prompt, timeout=10)" },
            { label: "Classify the failure", detail: "When it throws, decide: a timeout or rate limit is transient and worth retrying; a bad key or malformed-output bug is not and should stop immediately.", code: "if failure in RETRYABLE: retry else: break" },
            { label: "Retry with backoff", detail: "For retryable failures, wait an exponentially growing delay (2, 4, 8 seconds) before trying again, up to a capped number of attempts.", code: "time.sleep(2 ** attempt)" },
            { label: "Fall back", detail: "If retries are exhausted, run the backup path: a cheaper model, a cached answer, or an honest 'service is busy' message. The user still gets something.", code: "return call_backup(prompt)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A call fails with 'invalid_api_key'. Your retry logic retries it 3 times anyway. What happens, and what should the logic do instead?",
          steps: [
            "An invalid API key is not transient — the key is wrong on every attempt.",
            "So all 3 retries fail identically, wasting time and adding latency for no benefit.",
            "The logic should recognize this as non-retryable, stop immediately, and surface a clear configuration error."
          ],
          output: "All retries fail the same way; treat invalid_api_key as non-retryable and fail fast instead."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "During a provider hiccup, 10,000 clients all hit a rate limit and instantly retry in lockstep every 100ms. The provider stays overloaded and never recovers. Explain the failure pattern and the fix.",
          steps: [
            "All clients fail at the same instant and retry at the same instant, so every retry wave is as large as the original load.",
            "The provider, already struggling, is hit by synchronized bursts and can never catch up — a 'thundering herd'.",
            "Fix 1: exponential backoff so each client waits longer (2s, 4s, 8s) between attempts, shrinking the wave size over time.",
            "Fix 2: add random jitter to each delay so clients spread out instead of retrying in lockstep, letting the provider drain the backlog and recover."
          ],
          output: "Synchronized instant retries create a thundering herd; add exponential backoff with jitter to spread the load and let it recover."
        }
      ],
      comparison_tables: [
        {
          title: "no resilience vs retries and fallbacks",
          columns: ["Event", "No plan B", "Retries + fallbacks"],
          rows: [
            { cells: ["Provider outage", "Total app outage", "Serve from backup or cache"] },
            { cells: ["Transient timeout", "Request fails", "Retry, usually succeeds"] },
            { cells: ["Rate limit hit", "Hammered, stays throttled", "Backoff lets it recover"] },
            { cells: ["User experience", "Stack trace or spinner", "Humbler but working answer"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "retry it vs fall back / fail fast",
          bins: [
            { id: "retry", label: "Retry (transient)" },
            { id: "stop", label: "Fall back or fail fast (not retryable)" }
          ],
          items: [
            { id: "i1", text: "Network timeout", bin: "retry" },
            { id: "i2", text: "Temporary 503 server error", bin: "retry" },
            { id: "i3", text: "Rate limit (with backoff)", bin: "retry" },
            { id: "i4", text: "Invalid API key", bin: "stop" },
            { id: "i5", text: "Malformed output from a prompt bug", bin: "stop" },
            { id: "i6", text: "Provider in a multi-hour outage", bin: "stop" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does production design mean 'deciding what happens when it breaks' rather than just 'making it work'?",
          sampleAnswer: "Making it work covers the happy path, but in production the model provider will eventually have outages, requests will time out, and rate limits will trigger — failure is not exceptional, it is guaranteed over time. So the real engineering is in the failure path: classifying each failure, retrying the transient ones with backoff, falling back to a backup model or cached answer for the rest, and capping retries so resilience doesn't multiply cost. A system designed only to work on a good day fails totally on a bad one."
        }
      ],
      hints: [
        "A set membership test, failure_type in RETRYABLE, returns a boolean directly.",
        "Return that membership check as the function's result.",
        "'timeout' is in the set so it returns True; 'invalid_api_key' is not, so it returns False."
      ],
      challenge_title: "The Resilient Caller",
      challenge_description: "Drive a batch of requests through a retry-then-fallback policy and report how many recovered, how many fell back, and how many total attempts the provider absorbed.",
      challenge_difficulty: "beginner",
      challenge_story: "A 40-minute provider outage once took your whole product down because every request hit one API with no plan B. You fix that with a **retry-then-fallback** policy: each request gets up to \`max_attempts\` tries against the flaky primary; if one succeeds you're done, and if all of them fail you serve a degraded **fallback** instead of an error page. A queue of requests is replayed against the policy. Each request is described by which attempt (if any) would have succeeded. Run the policy and report the outcome.",
      challenge_statement: "You are given \`N\` requests and a retry limit \`max_attempts\`. Each request provides \`succeed_on\`: the **1-indexed** attempt number on which the primary would succeed, or \`0\` if the primary never succeeds.\n\nFor each request, make attempts \`1, 2, ..., max_attempts\` in order, counting **every attempt made**. Stop and mark the request \`succeeded\` the moment attempt number `succeed_on` is reached (when `succeed_on` is between 1 and `max_attempts`). If you exhaust all `max_attempts` without hitting `succeed_on` (including when `succeed_on` is 0 or larger than `max_attempts`), the request **falls back**.\n\nReport how many requests succeeded, how many fell back, and the total number of attempts made across all requests.",
      challenge_input_format: "The first line contains two space-separated integers: `N max_attempts`.\nEach of the next `N` lines contains one integer `succeed_on` (0 means the primary never succeeds).",
      challenge_output_format: "Three lines:\n- `succeeded <count>`\n- `fell_back <count>`\n- `total_attempts <count>`",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "1 ≤ max_attempts ≤ 1000",
        "0 ≤ succeed_on ≤ 1000000",
        "Attempts are counted up to and including the successful one; a fallback consumes all max_attempts tries.",
        "succeed_on of 0, or greater than max_attempts, always falls back."
      ],
      challenge_examples: [
        { input: "3 3\n2\n0\n1", output: "succeeded 2\nfell_back 1\ntotal_attempts 6", explanation: "Request 1 succeeds on attempt 2 (2 attempts). Request 2 never succeeds, so it uses all 3 attempts then falls back. Request 3 succeeds on attempt 1 (1 attempt). Total = 2+3+1 = 6, with 2 successes and 1 fallback." },
        { input: "1 2\n5", output: "succeeded 0\nfell_back 1\ntotal_attempts 2", explanation: "succeed_on is 5 but only 2 attempts are allowed, so the request exhausts both attempts and falls back." }
      ],
      challenge_notes: "A retry that exhausts its budget still costs you every attempt — retries trade latency and load for reliability, so unbounded retries are their own outage. Counting attempts exactly is how you'd later size a circuit breaker or a per-request timeout budget.",
      challenge_hints: [
        "For each request loop `for a in range(1, max_attempts + 1)` and count `total_attempts` on every iteration.",
        "If `succeed_on != 0 and a == succeed_on`, mark success and break out of the loop.",
        "If the loop finishes without a success, increment the fallback counter."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_attempts = map(int, data[idx].split()); idx += 1
    succeeded = 0
    fell_back = 0
    total_attempts = 0
    for _ in range(n):
        succeed_on = int(data[idx].strip()); idx += 1
        # TODO: try attempts 1..max_attempts, counting each; succeed on succeed_on, else fall back.
        pass

    print(f"succeeded {succeeded}")
    print(f"fell_back {fell_back}")
    print(f"total_attempts {total_attempts}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_attempts = map(int, data[idx].split()); idx += 1
    succeeded = 0
    fell_back = 0
    total_attempts = 0
    for _ in range(n):
        succeed_on = int(data[idx].strip()); idx += 1
        result = "fallback"
        for a in range(1, max_attempts + 1):
            total_attempts += 1
            if succeed_on != 0 and a == succeed_on:
                result = "ok"
                break
        if result == "ok":
            succeeded += 1
        else:
            fell_back += 1

    print(f"succeeded {succeeded}")
    print(f"fell_back {fell_back}")
    print(f"total_attempts {total_attempts}")

main()
`,
      challenge_test_cases: [
        { input: "3 3\n2\n0\n1", expected_output: "succeeded 2\nfell_back 1\ntotal_attempts 6", description: "A success on attempt 2, a never-succeed fallback (3 attempts), and a first-try success." },
        { input: "1 2\n5", expected_output: "succeeded 0\nfell_back 1\ntotal_attempts 2", description: "Edge case: succeed_on beyond max_attempts exhausts retries and falls back." },
        { input: "4 2\n1\n2\n3\n0", expected_output: "succeeded 2\nfell_back 2\ntotal_attempts 7", description: "Edge case: succeed_on of 3 and 0 both exceed the 2-attempt budget and fall back (1+2+2+2 = 7 attempts)." }
      ]
    },
    {
      id: "ai-16-l6",
      project_id: "ai-16",
      order: 6,
      title: "Versioning Prompts and Models",
      concept: "Versioning",
      xp_reward: 10,
      explanation: `Quality dropped 8 percent overnight and nobody touched the code. A teammate had edited the system prompt directly in the dashboard, and the provider had silently rolled \`gpt-4o\` from one snapshot to a newer one. Two invisible changes, zero record of either. You cannot fix what you cannot pin down, and you had pinned down nothing. The missing discipline is **versioning**.

## What it is

**Versioning** means recording exactly which prompt and which model produced every response, so any behavior is reproducible. A prompt is not a loose string you tweak in a text box; it is an artifact with a **version** — a hash or a tag — that you can name, diff, and roll back to. The model is the same: \`gpt-4o\` is a moving target, but \`gpt-4o-2024-08-06\` is a frozen one. Pin both, log both, and "why did the answer change?" becomes answerable.

The rule is blunt: if you cannot say which prompt version and which model version generated a given output, you are running an experiment you cannot repeat.

## How it works

You give each prompt a stable version derived from its content, then stamp every traced call with that version plus the pinned model id:

\`\`\`python
import hashlib

def prompt_version(template):
    # content hash: same text -> same version, any edit -> new version
    return hashlib.sha256(template.encode()).hexdigest()[:8]

PROMPT = "You are a support agent. Answer in one sentence."
MODEL = "gpt-4o-2024-08-06"   # pinned snapshot, not the floating alias

record = {
    "prompt_version": prompt_version(PROMPT),
    "model": MODEL,
    "output": call_model(PROMPT, MODEL),
}
\`\`\`

Two ideas carry the weight. A **content hash** means the version changes the instant the prompt text changes, so an untracked edit is impossible to hide. A **pinned model snapshot** means the provider cannot swap the model out from under you without you choosing to bump the id. Stored together in the trace from lesson 2, they let you replay any past request against the exact prompt and model that produced it.

## Why it matters

Versioning is what makes every other practice trustworthy:

- **Reproducibility.** A bug report names a \`prompt_version\` and \`model\`; you reproduce the output exactly instead of guessing.
- **Clean rollback.** When v7 of a prompt regresses, you redeploy v6 by id in seconds, not by trying to remember what it said.
- **Honest evals.** An eval score is meaningless unless you know which prompt and model earned it. Versions tie the score to the artifact.
- **Attribution of change.** When quality shifts, the first question is "what version changed?" Without versions there is no answer, only blame.

One caution: a floating alias like \`gpt-4o\` is a convenience that quietly breaks reproducibility, because the provider repoints it over time. Pin the dated snapshot in production and bump it deliberately.

## The mental model to keep

Treat a prompt like a commit, not a sticky note. **If it shipped, it has a version** — and so does the model — because the only behavior you can fix is the behavior you can name and reproduce.`,
      key_terms: [
        { term: "Prompt version", definition: "A stable identifier (often a content hash or tag) for an exact prompt, so changes are tracked and reproducible." },
        { term: "Model pinning", definition: "Using a fixed dated snapshot (gpt-4o-2024-08-06) instead of a floating alias (gpt-4o) so the model cannot change underneath you." },
        { term: "Content hash", definition: "A hash of the prompt text; identical text yields the same version, any edit yields a new one." },
        { term: "Reproducibility", definition: "The ability to regenerate a past output by replaying the exact prompt version and model that produced it." }
      ],
      callouts: [
        { type: "analogy", title: "A git commit, not a sticky note", content: "Source code is versioned so you can diff, blame, and revert any line. A prompt deserves the same: a versioned artifact you can name and roll back to, not a sticky note someone quietly rewrites in a dashboard.", position: "before" },
        { type: "warning", title: "Floating aliases break reproducibility", content: "An alias like gpt-4o silently repoints to newer snapshots over time. Pin the dated id (gpt-4o-2024-08-06) in production so behavior only changes when you decide it does.", position: "after" }
      ],
      concept_diagram: {
        title: "Pinning a response to its exact inputs",
        steps: [
          { label: "Hash the prompt", desc: "Derive a stable version from the prompt's exact text." },
          { label: "Pin the model", desc: "Choose a dated snapshot, not a floating alias." },
          { label: "Stamp the trace", desc: "Record prompt_version and model on every call." },
          { label: "Replay on demand", desc: "Reproduce or roll back any output by its versions." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why pin a dated model snapshot like gpt-4o-2024-08-06 instead of the alias gpt-4o?",
          options: ["The snapshot is cheaper", "The alias can silently change behavior when the provider repoints it", "The alias is slower"],
          correct_index: 1,
          explanation: "A floating alias is repointed to newer snapshots over time, so pinning the dated id keeps behavior reproducible."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main benefit of deriving a prompt version from a content hash?",
          options: [
            "It makes the prompt shorter",
            "Any edit to the prompt text produces a new version, so untracked changes are impossible to hide",
            "It encrypts the prompt",
            "It speeds up the model call"
          ],
          correct_index: 1,
          explanation: "A content hash changes the instant the text changes, so every edit is recorded as a distinct, reproducible version."
        },
        {
          question: "A bug report says an answer was wrong yesterday. How does versioning help you fix it?",
          options: [
            "It deletes the bad answer",
            "It lets you reproduce the exact output by replaying the recorded prompt_version and model",
            "It retrains the model",
            "It hides the error from users"
          ],
          correct_index: 1,
          explanation: "With the prompt version and pinned model recorded in the trace, you can replay the exact request that produced the bad output."
        },
        {
          question: "Why is an eval score untrustworthy without versioning?",
          options: [
            "Scores are always wrong",
            "You cannot tie the score to a specific prompt and model, so you do not know what earned it",
            "Evals require a database",
            "Versioning makes evals run faster"
          ],
          correct_index: 1,
          explanation: "A score only means something when bound to the exact prompt version and model that produced it; otherwise it cannot be reproduced or compared."
        }
      ],
      participation_activities: [
        {
          activity_title: "Versioning check",
          questions: [
            { question: "Using the floating alias gpt-4o in production guarantees the model never changes behavior.", type: "true_false", correct_answer: "false", explanation: "Aliases are repointed to newer snapshots over time; only a pinned dated id keeps behavior fixed." },
            { question: "Recording exactly which prompt and model produced each output so it can be reproduced is called ______.", type: "fill_in", correct_answer: "versioning", explanation: "Versioning ties every response to a reproducible prompt version and pinned model." }
          ]
        }
      ],
      starter_code: `# Stamp each call with a stable prompt version (content hash) and pinned model.
import hashlib

def prompt_version(template):
    # TODO: return the first 8 hex chars of the sha256 of the template text.
    pass

PROMPT = "You are a support agent. Answer in one sentence."
MODEL = "gpt-4o-2024-08-06"
print(prompt_version(PROMPT) == prompt_version(PROMPT))
`,
      solution_code: `import hashlib

def prompt_version(template):
    return hashlib.sha256(template.encode()).hexdigest()[:8]

PROMPT = "You are a support agent. Answer in one sentence."
MODEL = "gpt-4o-2024-08-06"

v1 = prompt_version(PROMPT)
v2 = prompt_version(PROMPT)
v3 = prompt_version(PROMPT + " Be polite.")
print(v1 == v2)   # same text -> same version
print(v1 == v3)   # edited text -> different version
`,
      expected_output: `True
False`,
      step_throughs: [
        {
          title: "binding one response to its exact inputs",
          steps: [
            { label: "Hash the prompt text", detail: "Run the exact prompt template through a content hash. Identical text always yields the same short version string.", code: 'pv = hashlib.sha256(PROMPT.encode()).hexdigest()[:8]' },
            { label: "Pin the model snapshot", detail: "Pick a dated model id rather than a floating alias, so the provider cannot swap the model without you bumping the id.", code: 'MODEL = "gpt-4o-2024-08-06"' },
            { label: "Stamp the traced call", detail: "Attach prompt_version and model to the same trace record from lesson 2, alongside the output and token counts.", code: 'record = {"prompt_version": pv, "model": MODEL, "output": out}' },
            { label: "Reproduce or roll back", detail: "Given a past record, look up the prompt by its version and replay against the pinned model to get the exact behavior again.", code: "old = lookup(record[\"prompt_version\"]); call_model(old, record[\"model\"])" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Quality dropped overnight with no code change. The trace shows yesterday's calls used model 'gpt-4o-2024-05-13' and today's used 'gpt-4o-2024-08-06'. What happened, and how does versioning explain it?",
          steps: [
            "The team used the floating alias, so the provider repointed it to a newer snapshot between the two days.",
            "Because the trace records the resolved dated snapshot, you can see the model id actually changed.",
            "That pins the regression to a model change, not a prompt edit, so you pin the old snapshot to confirm and decide whether to roll forward."
          ],
          output: "The model snapshot changed under a floating alias; the versioned trace makes the swap visible and diagnosable."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You want to A/B two prompt variants but your traces only store the raw prompt text, which sometimes includes a user's name interpolated in. Why is raw text a poor version key, and what is the fix?",
          steps: [
            "Interpolated values make every call's text slightly different, so the same template hashes to thousands of distinct 'versions'.",
            "You can no longer group calls by the template that produced them, which breaks both A/B grouping and rollback.",
            "Fix: version the template (with placeholders) separately from the filled-in values, and hash only the template.",
            "Now all calls from the same template share one prompt_version, and the user data lives in separate fields you can redact."
          ],
          output: "Hash the template (with placeholders), not the fully interpolated string, so one template maps to one stable version."
        }
      ],
      comparison_tables: [
        {
          title: "unversioned vs versioned prompts and models",
          columns: ["Question", "Unversioned", "Versioned"],
          rows: [
            { cells: ["Which prompt shipped?", "Whatever was in the box", "A named version you can diff"] },
            { cells: ["Did the model change?", "Invisible under an alias", "Pinned snapshot id in the trace"] },
            { cells: ["Roll back a regression", "Rewrite from memory", "Redeploy the old version by id"] },
            { cells: ["Reproduce a bad output", "Guesswork", "Replay the exact version and model"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "reproducible vs unreproducible practice",
          bins: [
            { id: "repro", label: "Keeps behavior reproducible" },
            { id: "norepro", label: "Breaks reproducibility" }
          ],
          items: [
            { id: "i1", text: "Pinning gpt-4o-2024-08-06", bin: "repro" },
            { id: "i2", text: "Hashing the prompt template for a version", bin: "repro" },
            { id: "i3", text: "Editing the system prompt live in a dashboard", bin: "norepro" },
            { id: "i4", text: "Storing prompt_version and model in the trace", bin: "repro" },
            { id: "i5", text: "Using the floating gpt-4o alias in production", bin: "norepro" },
            { id: "i6", text: "Keeping no record of which prompt produced an output", bin: "norepro" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does versioning have to come before you can trust an eval score or perform a clean rollback?",
          sampleAnswer: "An eval score and a rollback both refer to a specific artifact: the score was earned by some exact prompt and model, and a rollback means returning to some exact previous prompt and model. Without versioning there is no stable name for that artifact, so the score floats free of what produced it and a rollback becomes a guess about what the prompt used to say. Versioning binds every output to a reproducible prompt version and pinned model, which is what gives the score meaning and makes the rollback exact."
        }
      ],
      hints: [
        "hashlib.sha256 needs bytes, so call template.encode() before hashing.",
        "Use .hexdigest() to get a hex string, then slice [:8] for a short, stable version.",
        "The same input text always produces the same hash, so two calls with identical text compare equal."
      ],
      challenge_title: "Release Fingerprints",
      challenge_description: "Fingerprint every release by content-hashing its prompt and model, then detect which deploys are unchanged redeploys (duplicates) versus genuinely new versions.",
      challenge_difficulty: "beginner",
      challenge_story: "Quality dropped overnight and nobody admits to a change, because the prompt was edited live and there was no record of what actually shipped. You fix the blindness with **release fingerprints**: every deploy is reduced to a short content hash of its prompt template and pinned model. Identical text and model produce the identical fingerprint, so an unchanged redeploy is obvious — and any edit, even one character, produces a brand-new fingerprint. Run today's deploy log through the fingerprinter and tell ops which releases were real changes and which were just the same thing shipped again.",
      challenge_statement: "You are given \`N\` releases, processed in order. Each release is one line: a \`model\` token (no spaces), then a single space, then the prompt \`template\` (the rest of the line, which may itself contain spaces).\n\nFor each release, compute its **version fingerprint** as the first 8 hex characters of the SHA-256 hash of the canonical string \`model + \"|\" + template\` (the model, a literal pipe, then the template).\n\nA release is a **duplicate** (an unchanged redeploy) if its fingerprint has already appeared in an earlier release; otherwise it is **new**. For each release in order, print \`NEW <hash>\` or \`DUP <hash>\`. Then print one summary line with the count of distinct versions and the count of duplicate redeploys.",
      challenge_input_format: "The first line contains a single integer `N`, the number of releases.\nEach of the next `N` lines is one release: `model template`, where `model` is the first space-separated token and `template` is everything after the first space (it may contain spaces).",
      challenge_output_format: "N + 1 lines:\n- For each release in order: `NEW <hash>` if its fingerprint is seen for the first time, otherwise `DUP <hash>` (`<hash>` is the 8-char hex fingerprint).\n- A final summary line: `distinct <d> duplicates <r>`, where `d` is the number of distinct fingerprints and `r` is the number of duplicate redeploys.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "The fingerprint is the first 8 hex chars of sha256 of the string `model + \"|\" + template`.",
        "Identical (model, template) pairs always produce the identical fingerprint; any edit produces a new one.",
        "A release is a duplicate when its fingerprint already appeared in an earlier release.",
        "distinct + duplicates equals N."
      ],
      challenge_examples: [
        { input: "3\ngpt-4o-2024-08-06 You are a support agent. Answer in one sentence.\ngpt-4o-2024-08-06 You are a support agent. Answer in one sentence.\ngpt-4o-2024-08-06 You are a support agent. Answer in two sentences.", output: "NEW 928cbea1\nDUP 928cbea1\nNEW e5a72c01\ndistinct 2 duplicates 1", explanation: "Releases 1 and 2 have the identical model and template, so they share fingerprint 928cbea1; release 2 is an unchanged redeploy (DUP). Release 3 changes 'one' to 'two', producing a different fingerprint (NEW). Two distinct versions, one duplicate." },
        { input: "4\nsmall-v1 Summarize the text.\nbig-v2 Summarize the text.\nsmall-v1 Summarize the text.\nsmall-v1 Translate to French.", output: "NEW a14cef42\nNEW d7541545\nDUP a14cef42\nNEW 44e0bcec\ndistinct 3 duplicates 1", explanation: "Release 1 and 3 share the same model AND template, so release 3 is a DUP of a14cef42. Release 2 uses a different model (big-v2) so it hashes differently even with the same template. Release 4 changes the template. Three distinct fingerprints, one duplicate." }
      ],
      challenge_notes: "Because the fingerprint is a content hash, the same text and model always map to the same 8 hex characters, while any edit — even one character — flips it to a new value. That is exactly what makes an unchanged redeploy detectable: same bytes in, same fingerprint out. Including the model in the canonical string means swapping the pinned snapshot counts as a new version even if the prompt text is unchanged.",
      challenge_hints: [
        "Split each line once with `line.split(' ', 1)`: the first part is the model, the second is the template.",
        "Build the canonical string `model + '|' + template`, then `hashlib.sha256(canonical.encode()).hexdigest()[:8]`.",
        "Keep a `set` of fingerprints seen so far: if the new fingerprint is already in it, print DUP and count a duplicate, else add it, print NEW, and count a distinct version."
      ],
      challenge_starter_code: `import sys
import hashlib

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    seen = set()
    distinct = 0
    duplicates = 0
    out = []
    for _ in range(n):
        line = data[idx]; idx += 1
        parts = line.split(" ", 1)
        model = parts[0]
        template = parts[1] if len(parts) > 1 else ""
        canonical = model + "|" + template
        # TODO: compute the 8-char sha256 fingerprint of canonical, then
        #       if it was seen before -> append "DUP <hash>" and count a duplicate,
        #       else -> add it to seen, append "NEW <hash>", and count a distinct version.
        pass

    out.append(f"distinct {distinct} duplicates {duplicates}")
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys
import hashlib

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    seen = set()
    distinct = 0
    duplicates = 0
    out = []
    for _ in range(n):
        line = data[idx]; idx += 1
        parts = line.split(" ", 1)
        model = parts[0]
        template = parts[1] if len(parts) > 1 else ""
        canonical = model + "|" + template
        version = hashlib.sha256(canonical.encode()).hexdigest()[:8]
        if version in seen:
            duplicates += 1
            out.append("DUP " + version)
        else:
            seen.add(version)
            distinct += 1
            out.append("NEW " + version)

    out.append(f"distinct {distinct} duplicates {duplicates}")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\ngpt-4o-2024-08-06 You are a support agent. Answer in one sentence.\ngpt-4o-2024-08-06 You are a support agent. Answer in one sentence.\ngpt-4o-2024-08-06 You are a support agent. Answer in two sentences.", expected_output: "NEW 928cbea1\nDUP 928cbea1\nNEW e5a72c01\ndistinct 2 duplicates 1", description: "An identical redeploy is flagged DUP; a one-word edit produces a NEW fingerprint." },
        { input: "4\nsmall-v1 Summarize the text.\nbig-v2 Summarize the text.\nsmall-v1 Summarize the text.\nsmall-v1 Translate to French.", expected_output: "NEW a14cef42\nNEW d7541545\nDUP a14cef42\nNEW 44e0bcec\ndistinct 3 duplicates 1", description: "Same template but a different model hashes differently; only the exact (model, template) repeat is a DUP." },
        { input: "5\nm1 Be brief.\nm1 Be brief.\nm1 Be brief.\nm2 Be brief.\nm1 Be concise.", expected_output: "NEW 36303ce0\nDUP 36303ce0\nDUP 36303ce0\nNEW 4c87eaca\nNEW af7a43e8\ndistinct 3 duplicates 2", description: "Edge case: one fingerprint redeployed twice gives two duplicates; a model swap and a template edit are each new." }
      ]
    },
    {
      id: "ai-16-l7",
      project_id: "ai-16",
      order: 7,
      title: "A/B Testing LLM Changes",
      concept: "ABTest",
      xp_reward: 10,
      explanation: `A team was certain their new prompt was better. The eval suite agreed, the demo looked sharper, everyone shipped it to 100 percent of traffic. A week later the thumbs-up rate had quietly fallen and support tickets ticked up. Offline scores said one thing; real users said another. The fix is not a better opinion — it is an **A/B test** that lets live traffic decide.

## What it is

An **A/B test** splits live traffic between two versions — a **control** (A, the current prompt or model) and a **variant** (B, the proposed change) — and compares them on a real metric. Instead of arguing about which is better, you measure: send half the users to A, half to B, and watch a number that matters, like the rate of helpful answers, successful task completions, or thumbs-up.

The key word is **live**. An eval (lesson 3) measures quality on a frozen set of cases; an A/B test measures it on the messy distribution of real requests, including the ones you never thought to put in your eval. The two are complementary: evals gate the merge, A/B tests gate the rollout.

## How it works

You assign each request deterministically to a bucket, run the matching version, and tally outcomes per bucket:

\`\`\`python
import hashlib

def bucket(user_id, split=0.5):
    h = int(hashlib.sha256(user_id.encode()).hexdigest(), 16)
    return "B" if (h % 100) / 100 < split else "A"   # stable per user

results = {"A": [0, 0], "B": [0, 0]}   # [successes, total]

def record(user_id, success):
    b = bucket(user_id)
    results[b][1] += 1            # total
    results[b][0] += int(success) # successes
\`\`\`

Two details make this trustworthy. The bucket is **deterministic per user** (hash the user id), so the same person always sees the same version and the experience is consistent. And you compare **rates**, not raw counts, because the two buckets rarely get identical traffic. The winner is the version whose success rate is meaningfully higher once each side has enough samples.

## Why it matters

A/B testing is how a change earns 100 percent of traffic instead of assuming it:

- **Offline and online disagree.** A prompt can lift your eval score and still annoy real users, because your cases never covered their requests. Only live traffic reveals that.
- **Avoid betting the whole product.** Rolling a risky change to 5 percent first caps the blast radius; if B is worse, you saw it on a sliver of users, not everyone.
- **Sample size guards against noise.** A 70 percent vs 60 percent gap on ten requests each is noise; on ten thousand it is signal. Decide only when each arm has enough data and the gap clears a margin.
- **One metric, agreed up front.** Pick the success metric before you look, or you will rationalize whichever result you wanted.

A caution: do not peek and stop the instant B looks good. Early data is noisy, and stopping at the first favorable wobble manufactures false winners. Fix the sample size and margin in advance.

## The mental model to keep

Opinions and offline scores propose; **live traffic decides.** An A/B test is the controlled experiment that turns "I think B is better" into "B wins by this much, on this metric, with this much data."`,
      key_terms: [
        { term: "A/B test", definition: "Splitting live traffic between a control (A) and a variant (B) to compare them on a real metric." },
        { term: "Control vs variant", definition: "A is the current version; B is the proposed change being tested against it." },
        { term: "Deterministic bucketing", definition: "Assigning each user to A or B by hashing their id, so they always see the same version." },
        { term: "Sample size", definition: "How many observations each arm has; too few makes any difference statistical noise rather than signal." }
      ],
      callouts: [
        { type: "analogy", title: "A taste test, not a chef's opinion", content: "A chef can swear the new recipe is better, but a blind taste test with real diners settles it. An A/B test is that taste test: real users, a measured outcome, no chef's pride on the scale.", position: "before" },
        { type: "warning", title: "Do not peek and stop early", content: "Early data is noisy. Stopping the moment B looks good manufactures false winners. Fix the sample size and the margin before you start, then decide.", position: "after" }
      ],
      concept_diagram: {
        title: "How an A/B test decides a winner",
        steps: [
          { label: "Split traffic", desc: "Deterministically bucket each user into A or B." },
          { label: "Run the matching version", desc: "Serve control to A, variant to B." },
          { label: "Tally the metric", desc: "Count successes and totals per bucket." },
          { label: "Decide on rates", desc: "Pick the winner once samples and margin suffice." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why bucket each user deterministically by hashing their id?",
          options: ["It is faster than random", "So the same user always sees the same version, keeping their experience consistent", "It uses less memory"],
          correct_index: 1,
          explanation: "Deterministic bucketing means a given user is always in the same arm, avoiding a flickering experience and clean per-user attribution."
        }
      ],
      quiz_questions: [
        {
          question: "How does an A/B test differ from an offline eval?",
          options: [
            "It is the same thing with a different name",
            "An eval scores a frozen case set; an A/B test measures the metric on live, real traffic",
            "An A/B test does not need a metric",
            "Evals run on users and A/B tests run offline"
          ],
          correct_index: 1,
          explanation: "Evals gate the merge using fixed cases; A/B tests gate the rollout using the real distribution of live requests."
        },
        {
          question: "Why compare success rates instead of raw success counts between A and B?",
          options: [
            "Counts are harder to compute",
            "The two buckets rarely get identical traffic volume, so rates make them comparable",
            "Rates are required by the API",
            "Counts cannot be logged"
          ],
          correct_index: 1,
          explanation: "Because traffic splits are never perfectly equal, rates normalize for volume so the comparison is fair."
        },
        {
          question: "What is the danger of declaring B the winner after only a handful of requests each?",
          options: [
            "Nothing, faster decisions are always better",
            "Small samples are noisy, so an early gap can be random and produce a false winner",
            "The model forgets the test",
            "It costs extra tokens"
          ],
          correct_index: 1,
          explanation: "With too few samples a difference is statistical noise; you need enough data and a clear margin before deciding."
        }
      ],
      participation_activities: [
        {
          activity_title: "A/B testing check",
          questions: [
            { question: "A change that improves your offline eval score is guaranteed to improve real user outcomes.", type: "true_false", correct_answer: "false", explanation: "Offline and online can disagree; only live traffic reveals whether the change actually helps users." },
            { question: "The current, unchanged version that the new variant is tested against is called the ______.", type: "fill_in", correct_answer: "control", explanation: "A is the control; B is the variant being tested against it." }
          ]
        }
      ],
      starter_code: `# Tally A/B outcomes and compute each variant's success rate.
results = {"A": [0, 0], "B": [0, 0]}  # [successes, total]

events = [("A", 1), ("A", 0), ("B", 1), ("B", 1), ("A", 1)]

def tally(events):
    # TODO: for each (variant, success), add to that variant's totals and successes.
    pass

tally(events)
for v in ("A", "B"):
    s, t = results[v]
    rate = (s / t * 100) if t else 0.0
    print(v, f"{rate:.1f}")
`,
      solution_code: `results = {"A": [0, 0], "B": [0, 0]}  # [successes, total]

events = [("A", 1), ("A", 0), ("B", 1), ("B", 1), ("A", 1)]

def tally(events):
    for variant, success in events:
        results[variant][1] += 1
        results[variant][0] += success

tally(events)
for v in ("A", "B"):
    s, t = results[v]
    rate = (s / t * 100) if t else 0.0
    print(v, f"{rate:.1f}")
`,
      expected_output: `A 66.7
B 100.0`,
      step_throughs: [
        {
          title: "running one request through an A/B test",
          steps: [
            { label: "Bucket the user", detail: "Hash the user id to a stable bucket so the same person always lands in the same arm, A or B, for the whole experiment.", code: 'b = "B" if (hash(user) % 100) / 100 < 0.5 else "A"' },
            { label: "Serve the matching version", detail: "Bucket A runs the control prompt or model; bucket B runs the proposed variant. Everything else about the request is identical.", code: "out = call_model(prompt_for[b], model_for[b])" },
            { label: "Record the outcome", detail: "Log a success metric for this request under its bucket: a thumbs-up, a completed task, a passing grader, whatever you agreed to measure.", code: "results[b][1] += 1; results[b][0] += int(success)" },
            { label: "Compare rates", detail: "Once each arm has enough samples, compute success rates and pick the winner only if the gap clears your margin.", code: "rate_A = sA / tA; rate_B = sB / tB" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Arm A had 80 successes out of 100; arm B had 90 successes out of 100. Which has the higher success rate, and by how much?",
          steps: [
            "Rate A = 80 / 100 = 80.0%.",
            "Rate B = 90 / 100 = 90.0%.",
            "B is higher by 10 percentage points, and both arms have a healthy 100 samples."
          ],
          output: "B at 90.0% beats A at 80.0% by 10 points."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Arm A: 6 of 8 succeed (75%). Arm B: 5 of 6 succeed (83%). B looks better. Should you ship B to everyone? Explain.",
          steps: [
            "The raw rates favor B (83% vs 75%), but each arm has only a handful of observations.",
            "With 8 and 6 samples, flipping one or two outcomes would reverse the result, so the gap is well within noise.",
            "Declaring a winner now would be peeking at noisy early data and risks a false positive.",
            "Keep the test running until each arm has enough samples and the gap clears a pre-set margin before deciding."
          ],
          output: "No: the samples are far too small, so the 8-point gap is noise; keep collecting data before deciding."
        }
      ],
      comparison_tables: [
        {
          title: "ship on opinion vs decide with an A/B test",
          columns: ["Question", "Ship on opinion", "A/B test"],
          rows: [
            { cells: ["Who decides", "Loudest voice in the room", "Live traffic on a metric"] },
            { cells: ["Blast radius of a bad change", "All users at once", "A small bucket first"] },
            { cells: ["Offline vs online gap", "Invisible until complaints", "Measured directly on users"] },
            { cells: ["Result", "A guess that feels right", "A number with a margin"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "strengthens an A/B test vs undermines it",
          bins: [
            { id: "good", label: "Strengthens the test" },
            { id: "bad", label: "Undermines the test" }
          ],
          items: [
            { id: "i1", text: "Deterministic per-user bucketing", bin: "good" },
            { id: "i2", text: "Agreeing on the success metric up front", bin: "good" },
            { id: "i3", text: "Comparing success rates, not raw counts", bin: "good" },
            { id: "i4", text: "Stopping the moment B looks good", bin: "bad" },
            { id: "i5", text: "Deciding on ten samples per arm", bin: "bad" },
            { id: "i6", text: "Changing the metric after seeing results", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why are offline evals and live A/B tests both needed, rather than one replacing the other?",
          sampleAnswer: "Evals run on a frozen set of cases, so they catch regressions cheaply and quickly before a change ever merges, gating the merge. But that case set can never cover the full, messy distribution of real requests, so a change can pass evals and still hurt real users. An A/B test measures the real metric on live traffic, gating the rollout and revealing the offline-versus-online gap. They sit at different stages: evals protect the merge, A/B tests protect the rollout, and you want both."
        }
      ],
      hints: [
        "results[variant][1] is the total for that variant; increment it once per event.",
        "results[variant][0] is the successes; add the success value (0 or 1) to it.",
        "Compute the rate as successes / total * 100, guarding against a zero total."
      ],
      challenge_title: "The Experiment Readout",
      challenge_description: "Roll up a stream of A/B outcomes into a readout: each arm's success rate, and a verdict that respects minimum sample size and a decision margin.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your team was sure the new prompt was better — the demo sparkled, the offline eval agreed — so they shipped it to everyone, and a week later real engagement had quietly slipped. Never decide on vibes again. You stand up an **A/B test**: live traffic is split between control A and variant B, and each request logs whether it succeeded. The experiment just closed. Compute each arm's success rate and produce an honest verdict that refuses to crown a winner on too little data or too thin a margin.",
      challenge_statement: "You are given \`N\` outcome events and a \`min_samples\` requirement. Each event names a variant (\`A\` or \`B\`) and an outcome (\`1\` = success, \`0\` = failure).\n\nFor each variant compute its success rate as a percentage, rounded to **1 decimal place** (a variant with zero events has a rate of \`0.0\`). Then decide the verdict:\n\n- If **either** arm has fewer than \`min_samples\` events, output \`INCONCLUSIVE\`.\n- Otherwise, if the absolute difference between the two rates is **less than 1.0** percentage points, output \`INCONCLUSIVE\`.\n- Otherwise output \`WINNER A\` or \`WINNER B\` for whichever arm has the higher rate.",
      challenge_input_format: "The first line contains two space-separated integers: `N min_samples`.\nEach of the next `N` lines contains a variant token (`A` or `B`) and an outcome (`0` or `1`), space-separated.",
      challenge_output_format: "Three lines:\n- `A <successes>/<total> <rate to 1 decimal>`\n- `B <successes>/<total> <rate to 1 decimal>`\n- one of `WINNER A`, `WINNER B`, or `INCONCLUSIVE`",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "1 ≤ min_samples ≤ 100000",
        "Each variant is exactly 'A' or 'B'; each outcome is 0 or 1.",
        "A variant with zero events has rate 0.0 and counts as below min_samples.",
        "The decision margin is 1.0 percentage point: a gap < 1.0 is INCONCLUSIVE."
      ],
      challenge_examples: [
        { input: "6 2\nA 1\nA 0\nB 1\nB 1\nA 1\nB 1", output: "A 2/3 66.7\nB 3/3 100.0\nWINNER B", explanation: "A: 2 of 3 = 66.7%. B: 3 of 3 = 100.0%. Both arms meet min_samples 2, and the 33.3-point gap clears the margin, so B wins." },
        { input: "3 5\nA 1\nB 0\nA 1", output: "A 2/2 100.0\nB 0/1 0.0\nINCONCLUSIVE", explanation: "A has only 2 events and B only 1, both below min_samples 5, so the result is INCONCLUSIVE regardless of the rates." }
      ],
      challenge_notes: "The min_samples gate is what stops you from crowning a winner on noise: a 100%-vs-0% split on a couple of requests is meaningless. The 1.0-point margin guards against calling a near-tie a victory. Real tests use proper statistical significance, but a sample floor plus a margin captures the same intuition.",
      challenge_hints: [
        "Keep a [successes, total] pair per variant and update both as you read each event.",
        "Compute each rate as successes / total * 100, treating a zero total as 0.0.",
        "Check the min_samples gate on both totals first, then the margin, then compare rates."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, min_samples = map(int, data[idx].split()); idx += 1
    counts = {"A": [0, 0], "B": [0, 0]}  # [successes, total]
    for _ in range(n):
        variant, outcome = data[idx].split(); idx += 1
        counts[variant][1] += 1
        if outcome == "1":
            counts[variant][0] += 1

    rates = {}
    for v in ("A", "B"):
        s, t = counts[v]
        rates[v] = (s / t * 100) if t > 0 else 0.0
        print(f"{v} {s}/{t} {rates[v]:.1f}")

    # TODO: decide the verdict and print it on the third line:
    #   - INCONCLUSIVE if either arm has fewer than min_samples events,
    #   - else INCONCLUSIVE if abs(rates["A"] - rates["B"]) < 1.0,
    #   - else WINNER A or WINNER B for the higher rate.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, min_samples = map(int, data[idx].split()); idx += 1
    counts = {"A": [0, 0], "B": [0, 0]}  # [successes, total]
    for _ in range(n):
        variant, outcome = data[idx].split(); idx += 1
        counts[variant][1] += 1
        if outcome == "1":
            counts[variant][0] += 1

    rates = {}
    for v in ("A", "B"):
        s, t = counts[v]
        rates[v] = (s / t * 100) if t > 0 else 0.0
        print(f"{v} {s}/{t} {rates[v]:.1f}")

    if counts["A"][1] < min_samples or counts["B"][1] < min_samples:
        print("INCONCLUSIVE")
    elif abs(rates["A"] - rates["B"]) < 1.0:
        print("INCONCLUSIVE")
    elif rates["A"] > rates["B"]:
        print("WINNER A")
    else:
        print("WINNER B")

main()
`,
      challenge_test_cases: [
        { input: "6 2\nA 1\nA 0\nB 1\nB 1\nA 1\nB 1", expected_output: "A 2/3 66.7\nB 3/3 100.0\nWINNER B", description: "Both arms meet the sample floor and B's higher rate clears the margin." },
        { input: "3 5\nA 1\nB 0\nA 1", expected_output: "A 2/2 100.0\nB 0/1 0.0\nINCONCLUSIVE", description: "Too few samples in each arm forces INCONCLUSIVE despite a huge raw gap." },
        { input: "4 2\nA 1\nA 0\nB 1\nB 0", expected_output: "A 1/2 50.0\nB 1/2 50.0\nINCONCLUSIVE", description: "Equal rates: the gap is under the 1.0-point margin, so no winner is declared." }
      ]
    },
    {
      id: "ai-16-l8",
      project_id: "ai-16",
      order: 8,
      title: "Incident Response for LLM Apps",
      concept: "Incidents",
      xp_reward: 10,
      explanation: `At 2:14 a.m. the error rate spiked. A prompt change shipped that afternoon had slowly poisoned a fraction of answers, and by night a third of requests were failing. The on-call engineer was paged, stared at a dashboard with no playbook, and spent forty frantic minutes guessing before someone said the words that fixed it: "just roll back the last deploy." It worked in ninety seconds. The outage was not the bug. The outage was the **lack of a plan** for the bug.

## What it is

**Incident response** is the prepared, repeatable process for when your LLM app misbehaves in production: detect it, mitigate it fast, then learn from it. It rests on three pillars. **Rollback** is the fastest mitigation — return to the last known-good version (the versioning from lesson 6 is what makes this possible). **On-call** is the human who is paged and the playbook they follow. The **postmortem** is the blameless write-up afterward that turns one painful night into a permanent fix.

The guiding instinct: during an incident, **stop the bleeding first, understand it later.** Roll back now; root-cause in daylight.

## How it works

Detection comes from the metrics you already trace (lessons 2 and 4): when a signal like error rate crosses a threshold, an alert fires and a human is paged. The first move is almost always rollback:

\`\`\`python
def on_alert(metric, value, threshold):
    if value >= threshold:
        page_oncall(metric, value)          # wake the human
        rollback_to_last_good()             # mitigate FIRST
        # only after the bleeding stops do you investigate
        open_incident(metric, value)

# rolling back is cheap because deploys are versioned
def rollback_to_last_good():
    deploy(previous_version_id)             # seconds, by id
\`\`\`

The sequence matters. You page, you mitigate (usually by rolling back to the previous version id), and only then do you diagnose. Trying to root-cause a live outage while users suffer is how a ten-minute incident becomes an hour. After recovery, you write a **postmortem**: a timeline, the root cause, and concrete action items, with no finger-pointing — the goal is a system that cannot fail the same way twice.

## Why it matters

How you handle the bad night is what separates a hobby project from a service:

- **Time to detect and recover is the real metric.** Everything fails eventually (lesson 5); the question is how long until you notice and how fast you recover. Alerts shrink the first; rollback shrinks the second.
- **Rollback beats a hotfix under fire.** Patching a live bug at 2 a.m. is slow and risky. Returning to a known-good version is fast and safe — fix forward later, calmly.
- **Blameless postmortems make you better.** Blaming a person hides the systemic gap (no alert, no rollback button) that actually caused the slow response. Blameless write-ups surface those gaps.
- **Practice before the fire.** Teams that rehearse rollback and run game-days respond in minutes; teams seeing the runbook for the first time at 2 a.m. flail.

A caution: an LLM incident is not always a crash. A subtle quality regression — politer but wrong answers, a creeping refusal rate — can do real damage while every server returns 200 OK. Alert on quality signals, not just errors.

## The mental model to keep

You will have a bad night; the only choice is whether you have a plan for it. **Detect fast, roll back first, postmortem without blame** — turn each incident into the reason the next one is shorter.`,
      key_terms: [
        { term: "Incident response", definition: "The prepared process to detect, mitigate, and learn from a production failure." },
        { term: "Rollback", definition: "Returning to the last known-good version as the fastest way to stop an active incident." },
        { term: "On-call", definition: "The engineer who is paged when an alert fires, following a defined playbook." },
        { term: "Postmortem", definition: "A blameless write-up after an incident: timeline, root cause, and action items to prevent a recurrence." }
      ],
      callouts: [
        { type: "analogy", title: "A fire drill, not a fire fight", content: "You do not invent an evacuation route while the building burns; you rehearse it cold so the real fire is muscle memory. A runbook and a practiced rollback are that drill for your service.", position: "before" },
        { type: "warning", title: "200 OK can still be an incident", content: "An LLM can fail by quietly returning wrong-but-polite answers while every health check passes. Alert on quality signals, not only on error codes and crashes.", position: "after" }
      ],
      concept_diagram: {
        title: "The path from spike to fix",
        steps: [
          { label: "Detect", desc: "A traced metric crosses a threshold and fires an alert." },
          { label: "Page on-call", desc: "A human is woken with the signal and a playbook." },
          { label: "Roll back", desc: "Return to the last known-good version to stop the bleeding." },
          { label: "Postmortem", desc: "Write a blameless timeline, root cause, and action items." }
        ]
      },
      inline_quizzes: [
        {
          question: "During a live incident, what is usually the correct first action?",
          options: ["Root-cause the bug before doing anything", "Roll back to the last known-good version to stop the bleeding", "Wait to see if it resolves itself"],
          correct_index: 1,
          explanation: "Mitigate first: rolling back to a known-good version stops user impact quickly; diagnosis comes after recovery."
        }
      ],
      quiz_questions: [
        {
          question: "Why is rollback usually preferred over a live hotfix during an incident?",
          options: [
            "Hotfixes are illegal",
            "Returning to a known-good version is fast and safe, while patching under fire is slow and risky",
            "Rollback fixes the root cause permanently",
            "Hotfixes always make things worse"
          ],
          correct_index: 1,
          explanation: "Rollback restores known-good behavior in seconds; a 2 a.m. hotfix is error-prone, so you fix forward later in daylight."
        },
        {
          question: "What makes a postmortem 'blameless', and why does that matter?",
          options: [
            "It names who caused the outage",
            "It focuses on systemic gaps rather than individuals, surfacing the missing alert or rollback that slowed response",
            "It is kept secret from the team",
            "It skips the timeline"
          ],
          correct_index: 1,
          explanation: "Blaming a person hides the real cause (a missing safeguard); a blameless write-up exposes the systemic gap so it can be fixed."
        },
        {
          question: "Why must LLM incident detection watch quality signals, not just error codes?",
          options: [
            "Error codes are never useful",
            "An LLM can return wrong-but-polite answers with a 200 OK, so a quality regression hides behind healthy status codes",
            "Quality signals are cheaper to log",
            "The provider requires it"
          ],
          correct_index: 1,
          explanation: "A subtle quality regression damages users while every server responds normally, so you need quality-based alerts to catch it."
        }
      ],
      participation_activities: [
        {
          activity_title: "Incident response check",
          questions: [
            { question: "The first priority during a live incident is to find the root cause before mitigating.", type: "true_false", correct_answer: "false", explanation: "Stop the bleeding first, usually by rolling back; root-cause analysis comes after recovery." },
            { question: "The blameless write-up after an incident, with a timeline and action items, is called a ______.", type: "fill_in", correct_answer: "postmortem", explanation: "A postmortem turns one incident into a permanent fix without blaming individuals." }
          ]
        }
      ],
      starter_code: `# Decide the on-call response based on a metric crossing its threshold.
def respond(error_rate, threshold):
    # TODO: if error_rate >= threshold, return "page+rollback", else return "ok".
    pass

print(respond(35.0, 20.0))
print(respond(5.0, 20.0))
`,
      solution_code: `def respond(error_rate, threshold):
    if error_rate >= threshold:
        return "page+rollback"
    return "ok"

print(respond(35.0, 20.0))
print(respond(5.0, 20.0))
`,
      expected_output: `page+rollback
ok`,
      step_throughs: [
        {
          title: "one incident, from spike to recovery",
          steps: [
            { label: "Detect the spike", detail: "A traced metric like error rate crosses its threshold. This is why lessons 2 and 4 mattered: you can only alert on signals you record.", code: "if error_rate >= threshold: alert()" },
            { label: "Page on-call", detail: "An alert wakes the on-call engineer with the metric, the value, and a link to the runbook, so they start with context, not a cold dashboard.", code: 'page_oncall(metric="error_rate", value=33.0)' },
            { label: "Roll back first", detail: "Mitigate before diagnosing: redeploy the previous known-good version by id. Because deploys are versioned (lesson 6), this takes seconds.", code: "deploy(previous_version_id)  # stop the bleeding" },
            { label: "Postmortem in daylight", detail: "Once recovered, write the timeline, root cause, and action items with no blame, so the same failure cannot recur.", code: "write_postmortem(timeline, root_cause, action_items)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "An alert fires at 2 a.m.: error rate is 33% against a 20% threshold. The on-call engineer wants to read the code and find the bug first. What should they do instead, and why?",
          steps: [
            "Reading code while a third of requests fail keeps users in the outage for as long as the investigation takes.",
            "The fastest mitigation is to roll back to the last known-good version, which restores normal behavior in seconds.",
            "Only after recovery should they diagnose the root cause, calmly, without users suffering."
          ],
          output: "Roll back to the last known-good version first to stop the impact, then root-cause after recovery."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Every server returns 200 OK and latency is normal, yet users complain the assistant has started refusing reasonable requests. Error-rate alerts never fired. Diagnose the gap and the fix.",
          steps: [
            "The failure is a quality regression, not a crash, so HTTP-level health checks all pass and the error-rate alert stays silent.",
            "Without a quality signal, no alert fires, so detection time balloons and you only learn from complaints.",
            "Fix detection: track a quality metric (refusal rate, thumbs-up rate, or an online eval score) and alert when it degrades.",
            "Then the same incident response applies: page, roll back the prompt or model version that introduced it, and postmortem."
          ],
          output: "It is a quality incident masked by healthy status codes; add quality-signal alerts, then page, roll back, and postmortem."
        }
      ],
      comparison_tables: [
        {
          title: "no incident plan vs prepared incident response",
          columns: ["When it breaks", "No plan", "Prepared response"],
          rows: [
            { cells: ["Detection", "A user complaint, hours later", "An alert on a traced metric"] },
            { cells: ["First action", "Guess and hotfix live", "Roll back to last known-good"] },
            { cells: ["Recovery time", "Long and frantic", "Minutes, by rehearsed runbook"] },
            { cells: ["Afterward", "Blame and forget", "Blameless postmortem and a fix"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good incident response vs anti-pattern",
          bins: [
            { id: "good", label: "Good incident response" },
            { id: "bad", label: "Anti-pattern" }
          ],
          items: [
            { id: "i1", text: "Roll back to last known-good first", bin: "good" },
            { id: "i2", text: "Alert on quality signals, not just errors", bin: "good" },
            { id: "i3", text: "Write a blameless postmortem with action items", bin: "good" },
            { id: "i4", text: "Root-cause the live bug before mitigating", bin: "bad" },
            { id: "i5", text: "Blame the engineer who shipped the change", bin: "bad" },
            { id: "i6", text: "Have no runbook and improvise at 2 a.m.", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how do the earlier lessons (tracing, cost monitoring, versioning, fallbacks) all feed into incident response?",
          sampleAnswer: "Incident response depends on everything before it. Tracing and cost monitoring produce the metrics you alert on, so you can detect an incident instead of waiting for complaints. Versioning makes rollback possible, because you can only return to a known-good state if past deploys are pinned and identifiable. Fallbacks reduce how often a provider failure even becomes a user-facing incident. So incident response is not a separate system; it is the moment all the production discipline you built earlier pays off, letting you detect fast, roll back cleanly, and learn without blame."
        }
      ],
      hints: [
        "Compare error_rate to threshold with >= so the boundary counts as an incident.",
        "Return the string 'page+rollback' when the threshold is met or exceeded.",
        "Return 'ok' otherwise, since the metric is within healthy range."
      ],
      challenge_title: "The Incident Timeline",
      challenge_description: "Replay a minute-by-minute error stream through an alert-and-rollback policy: detect when the error rate crosses the threshold, then measure how long the incident lasted before recovery.",
      challenge_difficulty: "intermediate",
      challenge_story: "A bad deploy once poisoned a third of answers overnight, and the on-call engineer burned forty minutes guessing before someone said 'just roll back.' Now you have a plan. Your monitoring reports the error rate every minute, and an alert fires the moment it crosses the threshold, triggering a rollback. You want to measure the incident the way a postmortem does: when did it start, how many minutes did the degradation last, and did it recover. Replay the minute stream through the policy and produce that timeline.",
      challenge_statement: "You are given \`N\` minutes of monitoring and an integer error-rate \`threshold\` (a percent). Each minute reports \`errors\` and \`total\` requests; that minute's error rate is \`errors / total * 100\` (a minute with zero total requests has a rate of \`0.0\`).\n\nFind the **first** minute (0-indexed) whose error rate is **at or above** the threshold — that is when the incident is detected. From that minute onward, count the **consecutive** minutes that stay at or above the threshold; that is the downtime. The incident **recovers** if a later minute drops below the threshold.\n\nIf no minute ever reaches the threshold, report no incident.",
      challenge_input_format: "The first line contains two space-separated integers: `N threshold`.\nEach of the next `N` lines contains two space-separated integers: `errors total`.",
      challenge_output_format: "Three lines:\n- `detected <minute index, or -1 if none>`\n- `downtime <consecutive minutes at or above threshold from detection, 0 if none>`\n- `recovered <1 if a later minute dropped below threshold, else 0>`",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ threshold ≤ 100",
        "0 ≤ errors ≤ total ≤ 1000000",
        "A minute with total = 0 has an error rate of 0.0.",
        "Detection uses the first minute with rate ≥ threshold; downtime is the consecutive run from there."
      ],
      challenge_examples: [
        { input: "5 20\n0 100\n30 100\n40 100\n5 100\n2 100", output: "detected 1\ndowntime 2\nrecovered 1", explanation: "Minute 0 is 0% (healthy). Minute 1 is 30% >= 20%, so detection is minute 1. Minutes 1 and 2 (30%, 40%) stay above, so downtime is 2. Minute 3 is 5% < 20%, so it recovered." },
        { input: "3 50\n10 100\n5 100\n0 50", output: "detected -1\ndowntime 0\nrecovered 0", explanation: "No minute reaches 50% (rates are 10%, 5%, 0%), so there is no incident: detected -1, no downtime, no recovery." }
      ],
      challenge_notes: "Detection time and recovery time are the metrics a postmortem cares about, not the bug itself. Counting the consecutive at-or-above run mirrors how a rollback would end the incident once the healthy version takes over; a minute back below the threshold marks recovery.",
      challenge_hints: [
        "Compute each minute's rate as errors / total * 100, treating total = 0 as 0.0.",
        "Scan for the first index where rate >= threshold to set the detection minute.",
        "From detection, count consecutive minutes at or above threshold; stop and set recovered = 1 at the first minute below."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    minutes = []
    for _ in range(n):
        errors, total = map(int, data[idx].split()); idx += 1
        minutes.append((errors, total))

    # TODO: find first minute with rate >= threshold (detection),
    #       count consecutive minutes at/above from there (downtime),
    #       and whether a later minute drops below (recovered).
    detected = -1
    downtime = 0
    recovered = 0

    print(f"detected {detected}")
    print(f"downtime {downtime}")
    print(f"recovered {recovered}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    minutes = []
    for _ in range(n):
        errors, total = map(int, data[idx].split()); idx += 1
        minutes.append((errors, total))

    def rate(errors, total):
        return (errors / total * 100) if total > 0 else 0.0

    detected = -1
    for i, (e, t) in enumerate(minutes):
        if rate(e, t) >= threshold:
            detected = i
            break

    downtime = 0
    recovered = 0
    if detected != -1:
        for i in range(detected, n):
            e, t = minutes[i]
            if rate(e, t) >= threshold:
                downtime += 1
            else:
                recovered = 1
                break

    print(f"detected {detected}")
    print(f"downtime {downtime}")
    print(f"recovered {recovered}")

main()
`,
      challenge_test_cases: [
        { input: "5 20\n0 100\n30 100\n40 100\n5 100\n2 100", expected_output: "detected 1\ndowntime 2\nrecovered 1", description: "Incident detected at minute 1, lasts 2 minutes, then recovers." },
        { input: "3 50\n10 100\n5 100\n0 50", expected_output: "detected -1\ndowntime 0\nrecovered 0", description: "No minute crosses the threshold, so there is no incident." },
        { input: "4 25\n1 100\n50 100\n60 100\n80 100", expected_output: "detected 1\ndowntime 3\nrecovered 0", description: "Edge case: incident detected at minute 1 and never recovers within the window." }
      ]
    }
  ]
};
