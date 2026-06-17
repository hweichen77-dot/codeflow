export default {
  project: {
    id: "ai-16",
    title: "Deploying & Monitoring LLM Apps",
    description: "Take an LLM prototype from a notebook to a reliable production service: deploy it, trace every call, gate releases with evals, watch the cost, and survive failures with fallbacks.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 55,
    lessons_count: 5,
    tags: ["deployment", "observability", "evals", "cost", "reliability", "production"],
    order: 16,
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
      challenge_title: "Harden the handler",
      challenge_description: "Write validate_request(prompt, api_key) that returns 'ok' only when api_key is non-empty AND prompt has non-whitespace content. Return 'missing key' when the key is empty, and 'empty prompt' when the prompt is blank. Check the key first.",
      challenge_starter_code: `def validate_request(prompt, api_key):
    # TODO: check api_key first, then prompt. Return 'ok', 'missing key', or 'empty prompt'.
    pass

print(validate_request("hi", "sk-1"))
print(validate_request("   ", "sk-1"))
print(validate_request("hi", ""))
`,
      challenge_solution_code: `def validate_request(prompt, api_key):
    if not api_key:
        return "missing key"
    if not prompt or not prompt.strip():
        return "empty prompt"
    return "ok"

print(validate_request("hi", "sk-1"))
print(validate_request("   ", "sk-1"))
print(validate_request("hi", ""))
`,
      challenge_test_cases: [
        { input: "prompt='hi', api_key='sk-1'", expected_output: "ok", description: "Valid key and prompt return ok." },
        { input: "prompt='   ', api_key='sk-1'", expected_output: "empty prompt", description: "Whitespace-only prompt is rejected." },
        { input: "prompt='hi', api_key=''", expected_output: "missing key", description: "Missing key is caught before the prompt check." }
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
      challenge_title: "Summarize a batch of traces",
      challenge_description: "Given a list of trace records (each a dict with 'latency_ms'), write summarize(traces) that returns a dict with 'count' and 'avg_latency' (rounded to 1 decimal). Print the summary for the sample list.",
      challenge_starter_code: `traces = [
    {"trace_id": "a", "latency_ms": 100},
    {"trace_id": "b", "latency_ms": 300},
    {"trace_id": "c", "latency_ms": 200},
]

def summarize(traces):
    # TODO: return {"count": N, "avg_latency": rounded average}
    pass

print(summarize(traces))
`,
      challenge_solution_code: `traces = [
    {"trace_id": "a", "latency_ms": 100},
    {"trace_id": "b", "latency_ms": 300},
    {"trace_id": "c", "latency_ms": 200},
]

def summarize(traces):
    count = len(traces)
    avg = sum(t["latency_ms"] for t in traces) / count
    return {"count": count, "avg_latency": round(avg, 1)}

print(summarize(traces))
`,
      challenge_test_cases: [
        { input: "three traces of 100, 300, 200 ms", expected_output: "{'count': 3, 'avg_latency': 200.0}", description: "Average of 100, 300, 200 is 200.0 over a count of 3." }
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
      challenge_title: "Add a threshold gate",
      challenge_description: "Write gate(score, threshold) that returns 'PASS' if score >= threshold, else 'FAIL'. Then call it for a score of 0.7 with threshold 0.8 and a score of 0.9 with threshold 0.8, printing each result.",
      challenge_starter_code: `def gate(score, threshold):
    # TODO: return 'PASS' if score >= threshold else 'FAIL'
    pass

print(gate(0.7, 0.8))
print(gate(0.9, 0.8))
`,
      challenge_solution_code: `def gate(score, threshold):
    return "PASS" if score >= threshold else "FAIL"

print(gate(0.7, 0.8))
print(gate(0.9, 0.8))
`,
      challenge_test_cases: [
        { input: "score=0.7, threshold=0.8", expected_output: "FAIL", description: "0.7 is below 0.8, so the gate fails." },
        { input: "score=0.9, threshold=0.8", expected_output: "PASS", description: "0.9 meets the threshold, so the gate passes." }
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
      challenge_title: "Enforce a budget",
      challenge_description: "Write charge(spent, limit, cost) that returns the new total when spent + cost stays at or under limit, otherwise returns the string 'budget exceeded'. Test: charge(0.40, 0.50, 0.05) and charge(0.48, 0.50, 0.05).",
      challenge_starter_code: `def charge(spent, limit, cost):
    # TODO: if spent + cost <= limit, return the new total; else 'budget exceeded'
    pass

print(charge(0.40, 0.50, 0.05))
print(charge(0.48, 0.50, 0.05))
`,
      challenge_solution_code: `def charge(spent, limit, cost):
    new_total = spent + cost
    if new_total <= limit:
        return round(new_total, 2)
    return "budget exceeded"

print(charge(0.40, 0.50, 0.05))
print(charge(0.48, 0.50, 0.05))
`,
      challenge_test_cases: [
        { input: "spent=0.40, limit=0.50, cost=0.05", expected_output: "0.45", description: "0.45 stays under the limit, so the new total is returned." },
        { input: "spent=0.48, limit=0.50, cost=0.05", expected_output: "budget exceeded", description: "0.53 exceeds 0.50, so the charge is refused." }
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
      challenge_title: "Retry then fall back",
      challenge_description: "Write robust_call(attempts, succeed_on) that simulates calling a flaky service: it 'succeeds' on attempt number succeed_on (1-indexed). Try up to `attempts` times; return 'ok' if an attempt succeeds, otherwise return 'fallback'. Test with attempts=3, succeed_on=2 and attempts=2, succeed_on=5.",
      challenge_starter_code: `def robust_call(attempts, succeed_on):
    # TODO: loop attempts times; if the current 1-indexed try == succeed_on, return 'ok'.
    # If no attempt succeeds, return 'fallback'.
    pass

print(robust_call(3, 2))
print(robust_call(2, 5))
`,
      challenge_solution_code: `def robust_call(attempts, succeed_on):
    for i in range(1, attempts + 1):
        if i == succeed_on:
            return "ok"
    return "fallback"

print(robust_call(3, 2))
print(robust_call(2, 5))
`,
      challenge_test_cases: [
        { input: "attempts=3, succeed_on=2", expected_output: "ok", description: "The second of three attempts succeeds." },
        { input: "attempts=2, succeed_on=5", expected_output: "fallback", description: "Success never lands within 2 attempts, so the fallback runs." }
      ]
    }
  ]
};
