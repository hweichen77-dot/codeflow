export default {
  project: {
    id: "prod-22",
    title: "Ship & Monitor an LLM App (Capstone)",
    description:
      "The capstone build: package your model-calling code into a real HTTP endpoint, deploy it somewhere real, and wrap it in structured logging, per-call cost tracking, and a usage dashboard. By the end you have a live, monitored LLM service with error handling and a budget guard, not just a script that worked once on your laptop.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 140,
    lessons_count: 8,
    tags: ["deployment", "observability", "cost-tracking", "dashboards", "fastapi", "capstone"],
    order: 122,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
  {
    id: "prod-22-1",
    project_id: "prod-22",
    order: 1,
    title: "Package the Model Call as One Function",
    concept: "packaging for deployment",
    explanation: `Every project you've built so far has been a script: run it, watch the terminal, done. Shipping is different, someone else's browser, curl command, or front-end hits a URL and your code has to answer without you standing next to it. The first move toward that is **packaging**: pull every place you call the model into one function with one clear job, so the rest of your app (a route, a CLI, a test) just calls that function and never touches the API directly.

## What "packaging" means here

Right now your model-calling code is probably scattered: a system prompt here, a \`client.messages.create(...)\` there, some parsing after it. Packaging means collecting all of that into a single entry point, usually called something like \`handle_request\`, that takes one plain input (a dict) and returns one plain output (a dict). Everything downstream, a web route, a test, a CLI, calls this one function and never touches the Anthropic client directly.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def call_model(prompt, max_tokens=300):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.content[0].text

def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "error": "missing prompt"}
    max_tokens = payload.get("max_tokens", 300)
    reply = call_model(prompt, max_tokens)
    return {"ok": True, "reply": reply}
\`\`\`

## Why one entry point matters

Every layer you add for the rest of this capstone, the web route in the next lesson, the logger, the cost calculator, the budget guard, wraps around \`handle_request\`. If your model call is scattered across five files, you'd patch five places every time you add a feature. With one entry point, you patch once and every caller gets the improvement for free.

It also makes your app testable without a network. \`handle_request({"prompt": "hi"})\` is a plain function call with a plain dict in and a plain dict out. You can call it from a test, a CLI, or an HTTP route and it behaves identically every time, which is exactly what you want before you start deploying anything.

## Validate before you spend money

Packaging is also your first line of defense: check the input *before* you call the model. A missing or empty prompt should never reach the API, you'd be paying to fail. Return a structured \`{"ok": False, "error": ...}\` instead of calling the model on garbage, and give the caller a real reason instead of a stack trace.

## The mental model

Think of \`handle_request\` as the front door to your whole app. Everyone, the web server, a test, future-you debugging at 2am, walks through that same door with a dict and gets a dict back. Below, build that validation gate in pure Python: no network yet, just the contract every layer after this depends on.`,
    starter_code: `def call_model(prompt):
    return f"[stub reply to: {prompt}]"


def handle_request(payload):
    # TODO: get "prompt" from payload, default to "", and strip it
    # TODO: if prompt is empty, return {"ok": False, "error": "missing prompt"}
    # TODO: otherwise call call_model(prompt) and return {"ok": True, "reply": reply}
    pass


print(handle_request({"prompt": "Hello there"}))
print(handle_request({}))
print(handle_request({"prompt": "   "}))`,
    solution_code: `def call_model(prompt):
    return f"[stub reply to: {prompt}]"


def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "error": "missing prompt"}
    reply = call_model(prompt)
    return {"ok": True, "reply": reply}


print(handle_request({"prompt": "Hello there"}))
print(handle_request({}))
print(handle_request({"prompt": "   "}))`,
    hints: [
      "payload.get(\"prompt\", \"\") never raises even if the key is missing; strip() then handles whitespace-only input.",
      "Check the stripped prompt for truthiness before calling call_model, an empty string is falsy.",
      "Return a plain dict; do not raise exceptions from handle_request, callers should get {\"ok\": False, ...} instead.",
    ],
    challenge_title: "Validate the Request Envelope",
    challenge_description: "Gate a batch of incoming requests before they ever reach the model: reject missing prompts and out-of-range token limits.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        has_prompt, max_tokens = map(int, data[i].split())
        # has_prompt: 1 if the request has a non-empty prompt, 0 if missing
        # max_tokens: -1 if the field was not sent, otherwise the requested value

        # TODO: if has_prompt is 0, print "ERROR: missing prompt"
        # TODO: else if max_tokens != -1 and it's not between 1 and 4096 inclusive,
        #       print "ERROR: max_tokens out of range"
        # TODO: else print "OK"

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        has_prompt, max_tokens = map(int, data[i].split())
        if has_prompt == 0:
            print("ERROR: missing prompt")
        elif max_tokens != -1 and not (1 <= max_tokens <= 4096):
            print("ERROR: max_tokens out of range")
        else:
            print("OK")

main()`,
    challenge_test_cases: [
      { input: "3\n1 -1\n0 100\n1 5000", expected_output: "OK\nERROR: missing prompt\nERROR: max_tokens out of range", description: "One clean request, one missing prompt, one over the 4096 token ceiling." },
      { input: "1\n1 4096", expected_output: "OK", description: "Edge: max_tokens exactly at the 4096 ceiling is still valid." },
      { input: "1\n1 0", expected_output: "ERROR: max_tokens out of range", description: "Edge: max_tokens of 0 is below the minimum of 1." },
    ],
  },
  {
    id: "prod-22-2",
    project_id: "prod-22",
    order: 2,
    title: "Stand Up the Endpoint",
    concept: "deploying an HTTP endpoint",
    explanation: `The function from last lesson is solid, but nobody can hit a Python function from a browser. This lesson wraps \`handle_request\` in an actual HTTP server and gets one route live: \`POST /generate\` in, JSON out. That's the smallest deployable unit, one endpoint, one job, running as a real process listening on a port.

## Picking a framework

FastAPI is the standard choice for a small Python API today: it's fast, it validates requests for you, and it pairs with \`uvicorn\` to run as a real server process.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 300

@app.post("/generate")
def generate(req: GenerateRequest):
    return handle_request(req.model_dump())

@app.get("/health")
def health():
    return {"status": "ok"}
\`\`\`

Notice \`generate\` is a thin wrapper: FastAPI parses and validates the JSON body into \`req\`, then hands it straight to the \`handle_request\` function you already built. You didn't rewrite your model logic for the web; you exposed the function you already had.

## Running it for real

\`\`\`bash
pip install fastapi uvicorn[standard]
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

\`uvicorn\` is the process that actually listens on a port and forwards requests into your FastAPI app. \`--host 0.0.0.0\` means "accept connections from outside this machine," not just \`localhost\`. That's the difference between "runs on my laptop" and "reachable from the internet" once it's deployed somewhere.

## Where it actually runs

"Deploying" just means running that same \`uvicorn\` command on a machine that stays on and has a public address, instead of your laptop. Small managed platforms (Render, Fly.io, Railway) do this for you: you push code, they run the process and give you a URL. A Dockerfile like this works on any of them:

\`\`\`dockerfile
FROM python:3.12-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## Why a health route

\`/health\` isn't optional decoration. Every deployment platform, load balancer, and monitor pings a health route to decide "is this instance alive?" Returning a fast, dependency-free \`{"status": "ok"}\`, no model call inside it, lets infrastructure check you're up without spending a token every few seconds.

## The mental model

A web framework is a router: it matches an incoming method and path to a Python function, and hands back whatever that function returns. Below, build that same routing logic in pure Python, no network, no framework: a dict of registered routes and a dispatcher that decides 200 or 404 for each request. That's the concept a real deployed server runs on; here we build it offline first.`,
    starter_code: `routes = {}

def add_route(method, path, handler):
    # TODO: store handler in routes keyed by (method, path)
    pass


def route_request(method, path, body):
    # TODO: look up (method, path) in routes
    # TODO: if found, return {"status": 200, "body": handler(body)}
    # TODO: if not found, return {"status": 404, "body": {"error": "not found"}}
    pass


add_route("POST", "/generate", lambda body: {"reply": f"echo: {body['prompt']}"})
add_route("GET", "/health", lambda body: {"status": "ok"})

print(route_request("POST", "/generate", {"prompt": "hi"}))
print(route_request("GET", "/health", {}))
print(route_request("GET", "/generate", {}))`,
    solution_code: `routes = {}

def add_route(method, path, handler):
    routes[(method, path)] = handler


def route_request(method, path, body):
    handler = routes.get((method, path))
    if handler is None:
        return {"status": 404, "body": {"error": "not found"}}
    return {"status": 200, "body": handler(body)}


add_route("POST", "/generate", lambda body: {"reply": f"echo: {body['prompt']}"})
add_route("GET", "/health", lambda body: {"status": "ok"})

print(route_request("POST", "/generate", {"prompt": "hi"}))
print(route_request("GET", "/health", {}))
print(route_request("GET", "/generate", {}))`,
    hints: [
      "Use a tuple (method, path) as the dict key so GET and POST on the same path never collide.",
      "routes.get((method, path)) returns None cleanly instead of raising KeyError when there is no match.",
      "route_request should never call a handler for a route that is not registered.",
    ],
    challenge_title: "Route the Requests",
    challenge_description: "Simulate a minimal HTTP router: register a set of exact-match routes, then answer 200 or 404 for a batch of incoming requests.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx].strip()); idx += 1
    registered = set()
    for _ in range(r):
        method, path = data[idx].split(" ", 1); idx += 1
        registered.add((method, path))

    m = int(data[idx].strip()); idx += 1
    # TODO: for each of the next m lines ("METHOD PATH"), print 200 if that
    #       exact (method, path) pair is in 'registered', else print 404.

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx].strip()); idx += 1
    registered = set()
    for _ in range(r):
        method, path = data[idx].split(" ", 1); idx += 1
        registered.add((method, path))

    m = int(data[idx].strip()); idx += 1
    for i in range(m):
        method, path = data[idx].split(" ", 1); idx += 1
        print(200 if (method, path) in registered else 404)

main()`,
    challenge_test_cases: [
      { input: "2\nPOST /generate\nGET /health\n3\nPOST /generate\nGET /generate\nGET /health", expected_output: "200\n404\n200", description: "Exact method+path matches return 200; a registered path with the wrong method returns 404." },
      { input: "1\nPOST /generate\n1\nPOST /status", expected_output: "404", description: "Path was never registered, so the router falls through to 404." },
      { input: "0\n1\nGET /anything", expected_output: "404", description: "Edge: with zero registered routes, every request 404s." },
    ],
  },
  {
    id: "prod-22-3",
    project_id: "prod-22",
    order: 3,
    title: "Log Every Request",
    concept: "structured request logging",
    explanation: `Once your endpoint is live, \`print()\` statements stop being useful, nobody is watching the terminal of a server running on someone else's machine. The fix is **structured logging**: for every request, write one record with a fixed shape (timestamps, token counts, latency, status) that a machine can read back later. This is the raw material every later lesson in this capstone builds on: cost tracking, the dashboard, and error monitoring all start by reading these records.

## What one log record looks like

A good request log answers the same questions every time, in the same shape:

\`\`\`python
import time, json, uuid

def make_log_record(model, input_tokens, output_tokens, latency_ms, status="ok"):
    return {
        "id": str(uuid.uuid4())[:8],
        "timestamp": time.time(),
        "model": model,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "latency_ms": latency_ms,
        "status": status,
    }
\`\`\`

Note what's *not* in there: the full prompt or reply text. Logging every character of every conversation is a privacy and storage liability you don't need for monitoring; token counts and timing tell you almost everything about cost and health without storing what people actually said.

## Timing the call

\`latency_ms\` comes from wrapping the real call in a timer, not guessing:

\`\`\`python
start = time.perf_counter()
reply = call_model(prompt)
latency_ms = int((time.perf_counter() - start) * 1000)
\`\`\`

\`time.perf_counter()\` is a high-resolution clock meant exactly for measuring "how long did this take," unlike \`time.time()\` which is meant for wall-clock timestamps and can jump around.

## Where records go

For a small service, appending one JSON line per request to a file (\`log.jsonl\`, one record per line) is enough, and it's the industry-standard "JSON Lines" format: easy to append, easy to stream, easy to parse one line at a time later without loading the whole file. Production systems swap the file for a database table or a logging service, but the record shape stays identical.

\`\`\`python
def write_log(record, path="log.jsonl"):
    with open(path, "a") as f:
        f.write(json.dumps(record) + "\\n")
\`\`\`

## Why it matters

Without this, "how many requests did we serve today" and "why did the bill spike" are unanswerable questions after the fact. With it, every later feature, cost totals, the dashboard, error rates, budget alerts, is just arithmetic over a list of these records. Logging isn't a nice-to-have bolted on at the end; it's the data source everything else in this capstone reads from.

## The mental model

Every request should leave a receipt behind, even if nobody looks at it that day. Below, build the record shape and a tiny in-memory log, no file or network yet, just the structure you'll aggregate in the coming lessons.`,
    starter_code: `def make_log_record(input_tokens, output_tokens, latency_ms, status="ok"):
    # TODO: return a dict with keys: input_tokens, output_tokens,
    #       total_tokens (input + output), latency_ms, status
    pass


LOG = []
LOG.append(make_log_record(120, 45, 850))
LOG.append(make_log_record(80, 30, 600))
LOG.append(make_log_record(200, 0, 120, status="error"))

print("records:", len(LOG))`,
    solution_code: `def make_log_record(input_tokens, output_tokens, latency_ms, status="ok"):
    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "latency_ms": latency_ms,
        "status": status,
    }


LOG = []
LOG.append(make_log_record(120, 45, 850))
LOG.append(make_log_record(80, 30, 600))
LOG.append(make_log_record(200, 0, 120, status="error"))

print("records:", len(LOG))
total_tokens = sum(r["total_tokens"] for r in LOG)
avg_latency = sum(r["latency_ms"] for r in LOG) / len(LOG)
errors = sum(1 for r in LOG if r["status"] == "error")
print("total tokens:", total_tokens)
print("avg latency:", avg_latency)
print("errors:", errors)`,
    hints: [
      "total_tokens is just input_tokens + output_tokens computed once and stored, not recomputed everywhere later.",
      "Give status a default of \"ok\" so most calls to make_log_record do not need to mention it.",
      "Aggregates like total tokens or average latency are just sum()/len() over the list of records, no new state needed.",
    ],
    challenge_title: "Parse the Access Log",
    challenge_description: "Read a batch of request log lines and compute the totals a monitoring dashboard would show: request count, error count, token usage, and worst-case latency.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    errors = 0
    max_latency = 0
    for i in range(1, n + 1):
        parts = data[i].split()
        in_tok, out_tok, latency, status = int(parts[0]), int(parts[1]), int(parts[2]), parts[3]
        # TODO: add in_tok + out_tok to total_tokens
        # TODO: if status == "error", increment errors
        # TODO: track the maximum latency seen

    # TODO: print n, then errors, then total_tokens, then max_latency (one per line)

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    errors = 0
    max_latency = 0
    for i in range(1, n + 1):
        parts = data[i].split()
        in_tok, out_tok, latency, status = int(parts[0]), int(parts[1]), int(parts[2]), parts[3]
        total_tokens += in_tok + out_tok
        if status == "error":
            errors += 1
        if latency > max_latency:
            max_latency = latency

    print(n)
    print(errors)
    print(total_tokens)
    print(max_latency)

main()`,
    challenge_test_cases: [
      { input: "3\n10 20 100 ok\n5 5 50 error\n0 0 200 ok", expected_output: "3\n1\n40\n200", description: "Three requests, one error; tokens sum to 40 and the slowest call took 200ms." },
      { input: "1\n100 200 300 ok", expected_output: "1\n0\n300\n300", description: "Single clean request; totals equal that one record." },
      { input: "2\n0 0 5 error\n0 0 5 error", expected_output: "2\n2\n0\n5", description: "Edge: both calls failed with zero tokens, error count and max latency still tracked correctly." },
    ],
  },
  {
    id: "prod-22-4",
    project_id: "prod-22",
    order: 4,
    title: "Compute the Cost of Every Call",
    concept: "token pricing and cost calculation",
    explanation: `Every log record already has token counts; this lesson turns those counts into money. Model providers charge per token, and input and output tokens are priced *differently*, usually output costs several times more than input, because generating text is more expensive than reading it. Get this calculation wrong and your dashboard will confidently show a number that's wrong by a multiple.

## The pricing shape

Providers publish price per million tokens, split by input and output:

\`\`\`python
PRICING = {
    "claude-haiku-4-5":  {"input": 0.80,  "output": 4.00},
    "claude-sonnet-4-6": {"input": 3.00,  "output": 15.00},
}

def cost_for_call(model, input_tokens, output_tokens):
    rates = PRICING[model]
    input_cost = (input_tokens / 1_000_000) * rates["input"]
    output_cost = (output_tokens / 1_000_000) * rates["output"]
    return input_cost + output_cost
\`\`\`

Notice output is priced roughly 5x input here. A summarizer that reads a huge document but writes three sentences is cheap; a code generator that writes a thousand lines from a short prompt is not. The ratio matters more than either number alone.

## Attaching cost to the log record

Cost belongs on the same record as everything else, computed once, right after the call:

\`\`\`python
record = make_log_record(model, input_tokens, output_tokens, latency_ms)
record["cost_usd"] = cost_for_call(model, input_tokens, output_tokens)
\`\`\`

Now every downstream aggregate, daily spend, per-model spend, "how much did this one request cost", is just reading a field, not recomputing pricing math in five different places.

## Why per-request cost, not just a monthly total

Your provider's dashboard will eventually show you a monthly bill, but by then it's too late to catch a bug. Computing cost per request, live, lets you catch problems immediately: a prompt that's accidentally including a whole document on every call, a loop calling the model far more than intended, a model swapped to a pricier tier by mistake. The per-call number is what makes the usage dashboard in the next lesson actually useful instead of a surprise at the end of the month.

## A note on precision

Money math with floats can drift by fractions of a cent over millions of calls. For this lesson we work in plain floats since the scale is small, but production billing systems typically track cost in integer cents to avoid rounding surprises compounding over time. Keep that in your back pocket if this ever needs to reconcile against a real invoice.

## The mental model

Token counts are the ingredients; the pricing table is the recipe; cost is what falls out when you combine them. Below, compute cost per call in pure Python using fixed integer prices (cents per 1,000 tokens) so the arithmetic is exact, no floating point rounding to fight with.`,
    starter_code: `PRICING = {
    "haiku": {"input": 25, "output": 125},
    "sonnet": {"input": 300, "output": 1500},
}


def cost_for_call(model, input_tokens, output_tokens):
    # Prices are cents per 1000 tokens. TODO:
    # input_cost = input_tokens * price_in // 1000
    # output_cost = output_tokens * price_out // 1000
    # return their sum
    pass


calls = [
    ("haiku", 4000, 1000),
    ("sonnet", 2000, 2000),
]

total = 0
for model, in_tok, out_tok in calls:
    c = cost_for_call(model, in_tok, out_tok)
    total += c
    print(model, c)

print("total:", total)`,
    solution_code: `PRICING = {
    "haiku": {"input": 25, "output": 125},
    "sonnet": {"input": 300, "output": 1500},
}


def cost_for_call(model, input_tokens, output_tokens):
    rates = PRICING[model]
    input_cost = input_tokens * rates["input"] // 1000
    output_cost = output_tokens * rates["output"] // 1000
    return input_cost + output_cost


calls = [
    ("haiku", 4000, 1000),
    ("sonnet", 2000, 2000),
]

total = 0
for model, in_tok, out_tok in calls:
    c = cost_for_call(model, in_tok, out_tok)
    total += c
    print(model, c)

print("total:", total)`,
    hints: [
      "Use integer floor division (//) with cents-per-1000-tokens pricing to avoid floating point rounding entirely.",
      "Look up rates once with PRICING[model], then compute the input and output halves separately before adding them.",
      "Output tokens are usually priced several times higher than input tokens, do not reuse one rate for both.",
    ],
    challenge_title: "Bill the Session",
    challenge_description: "Given a pricing table and a batch of model calls, compute each call's cost and the grand total for the session.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    pricing = {}
    for _ in range(k):
        name, price_in, price_out = data[idx].split(); idx += 1
        pricing[name] = (int(price_in), int(price_out))

    n = int(data[idx].strip()); idx += 1
    costs = []
    for _ in range(n):
        model, in_tok, out_tok = data[idx].split(); idx += 1
        in_tok, out_tok = int(in_tok), int(out_tok)
        # TODO: look up (price_in, price_out) for 'model' from pricing
        # TODO: cost = in_tok * price_in // 1000 + out_tok * price_out // 1000
        # TODO: append cost to 'costs'

    # TODO: print n, then sum(costs), then each individual cost in order

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    pricing = {}
    for _ in range(k):
        name, price_in, price_out = data[idx].split(); idx += 1
        pricing[name] = (int(price_in), int(price_out))

    n = int(data[idx].strip()); idx += 1
    costs = []
    for _ in range(n):
        model, in_tok, out_tok = data[idx].split(); idx += 1
        in_tok, out_tok = int(in_tok), int(out_tok)
        price_in, price_out = pricing[model]
        cost = in_tok * price_in // 1000 + out_tok * price_out // 1000
        costs.append(cost)

    print(n)
    print(sum(costs))
    for c in costs:
        print(c)

main()`,
    challenge_test_cases: [
      { input: "2\nhaiku 25 125\nsonnet 300 1500\n2\nhaiku 4000 1000\nsonnet 2000 2000", expected_output: "2\n3825\n225\n3600", description: "Two calls across two models; total cost is the sum of each call's own input+output cost." },
      { input: "1\nhaiku 10 10\n1\nhaiku 1000 1000", expected_output: "1\n20\n20", description: "Single call; cost matches manual math (10 cents input + 10 cents output)." },
      { input: "1\nhaiku 25 125\n1\nhaiku 0 0", expected_output: "1\n0\n0", description: "Edge: a zero-token call costs nothing." },
    ],
  },
  {
    id: "prod-22-5",
    project_id: "prod-22",
    order: 5,
    title: "Build the Usage Dashboard",
    concept: "aggregating logs into a dashboard",
    explanation: `A pile of individual log records isn't a dashboard, it's a haystack. This lesson turns the raw log into the rolled-up numbers a dashboard actually shows: requests and cost broken down by model, plus the totals across everything. The core technique is a single pass over your records, grouping as you go.

## Group, don't re-scan

The naive way to build "total cost for sonnet" is to filter the whole log every time you need a number: \`sum(r["cost_usd"] for r in log if r["model"] == "sonnet")\`. That works for one number, but a dashboard needs a dozen numbers, and re-scanning the whole log for each one is wasteful and easy to get subtly inconsistent. The better way: **one pass, grouped**.

\`\`\`python
from collections import defaultdict

def build_dashboard(records):
    by_model = defaultdict(lambda: {"count": 0, "tokens": 0, "cost_usd": 0.0})
    for r in records:
        bucket = by_model[r["model"]]
        bucket["count"] += 1
        bucket["tokens"] += r["total_tokens"]
        bucket["cost_usd"] += r["cost_usd"]

    return {
        "by_model": dict(by_model),
        "total_requests": len(records),
        "total_cost_usd": sum(r["cost_usd"] for r in records),
    }
\`\`\`

\`defaultdict\` is the trick that makes this clean: the first time you touch \`by_model["sonnet"]\`, it silently creates a fresh \`{"count": 0, ...}\` bucket instead of raising a \`KeyError\`. You never have to check "have I seen this model before?", the dict handles it.

## Serving it

The simplest real dashboard is one more route that returns this same dict as JSON, which any front-end can render as a table or chart:

\`\`\`python
@app.get("/dashboard")
def dashboard():
    return build_dashboard(read_all_logs())
\`\`\`

You don't need a fancy charting library to start. A JSON summary endpoint, or even a plain HTML table generated with an f-string, is a real dashboard. Polish comes later; the numbers being *correct* comes first.

## What a dashboard is actually for

The point isn't the visual, it's catching problems early: a spike in requests from one model, a cost total climbing faster than usual, an error rate creeping up. Every one of those is a question you can only answer if the aggregation is right. Get the grouping logic solid here, and rendering it prettier later is just formatting.

## The mental model

One pass over the log, one bucket per group, running totals updated as you go, that's every "dashboard" you'll ever build, whether it renders as a table, a JSON blob, or a chart. Below, build the same grouped aggregation in pure Python over a small in-memory record list.`,
    starter_code: `def build_dashboard(records):
    by_model = {}
    for r in records:
        model = r["model"]
        # TODO: if model not in by_model, create {"count": 0, "tokens": 0, "cost": 0}
        # TODO: increment count by 1, tokens by r["tokens"], cost by r["cost"]
        pass

    total_requests = len(records)
    total_cost = sum(r["cost"] for r in records)
    return {"by_model": by_model, "total_requests": total_requests, "total_cost": total_cost}


records = [
    {"model": "haiku", "tokens": 100, "cost": 20},
    {"model": "sonnet", "tokens": 500, "cost": 300},
    {"model": "haiku", "tokens": 200, "cost": 40},
]

dash = build_dashboard(records)
print(dash["total_requests"], dash["total_cost"])
print(dash["by_model"]["haiku"])
print(dash["by_model"]["sonnet"])`,
    solution_code: `def build_dashboard(records):
    by_model = {}
    for r in records:
        model = r["model"]
        if model not in by_model:
            by_model[model] = {"count": 0, "tokens": 0, "cost": 0}
        by_model[model]["count"] += 1
        by_model[model]["tokens"] += r["tokens"]
        by_model[model]["cost"] += r["cost"]

    total_requests = len(records)
    total_cost = sum(r["cost"] for r in records)
    return {"by_model": by_model, "total_requests": total_requests, "total_cost": total_cost}


records = [
    {"model": "haiku", "tokens": 100, "cost": 20},
    {"model": "sonnet", "tokens": 500, "cost": 300},
    {"model": "haiku", "tokens": 200, "cost": 40},
]

dash = build_dashboard(records)
print(dash["total_requests"], dash["total_cost"])
print(dash["by_model"]["haiku"])
print(dash["by_model"]["sonnet"])`,
    hints: [
      "Check `if model not in by_model` before touching it the first time, or use collections.defaultdict to skip that check entirely.",
      "Update all three fields (count, tokens, cost) inside the same loop pass, do not re-scan records for each one.",
      "total_cost is a plain sum() over the flat records list; it does not need the by_model grouping at all.",
    ],
    challenge_title: "Aggregate by Model",
    challenge_description: "Group a batch of request records by model and print per-model totals plus the grand total cost, for the usage dashboard.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    groups = {}
    for i in range(1, n + 1):
        model, tokens, cost, latency = data[i].split()
        tokens, cost, latency = int(tokens), int(cost), int(latency)
        # TODO: if model is new, create a bucket with count, tokens, cost, latency_sum
        # TODO: update the bucket's count, tokens, cost, latency_sum

    # TODO: for each model sorted alphabetically, print:
    #   "model count tokens cost avg_latency"
    # where avg_latency = latency_sum // count (integer floor division)
    # TODO: on the last line, print the sum of every model's cost

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    groups = {}
    for i in range(1, n + 1):
        model, tokens, cost, latency = data[i].split()
        tokens, cost, latency = int(tokens), int(cost), int(latency)
        if model not in groups:
            groups[model] = {"count": 0, "tokens": 0, "cost": 0, "latency_sum": 0}
        g = groups[model]
        g["count"] += 1
        g["tokens"] += tokens
        g["cost"] += cost
        g["latency_sum"] += latency

    total_cost = 0
    for model in sorted(groups):
        g = groups[model]
        avg_latency = g["latency_sum"] // g["count"]
        print(model, g["count"], g["tokens"], g["cost"], avg_latency)
        total_cost += g["cost"]

    print(total_cost)

main()`,
    challenge_test_cases: [
      { input: "4\nhaiku 100 20 50\nsonnet 500 300 200\nhaiku 200 40 70\nsonnet 300 150 100", expected_output: "haiku 2 300 60 60\nsonnet 2 800 450 150\n510", description: "Two models, two calls each; per-model totals plus the grand total cost across both." },
      { input: "1\nhaiku 100 10 5", expected_output: "haiku 1 100 10 5\n10", description: "Single record; the group equals that one record exactly." },
      { input: "2\nzeta 10 5 3\nalpha 20 8 4", expected_output: "alpha 1 20 8 4\nzeta 1 10 5 3\n13", description: "Edge: models print alphabetically sorted regardless of input order." },
    ],
  },
  {
    id: "prod-22-6",
    project_id: "prod-22",
    order: 6,
    title: "Handle Failures Without Taking Down the Dashboard",
    concept: "error handling and status codes",
    explanation: `A deployed endpoint will fail in ways your laptop never showed you: the model provider times out, you hit a rate limit, or a caller sends garbage. An unhandled exception in a web route doesn't just fail that one request, it can crash the worker process serving *other* users' requests too. This lesson wraps the whole request path in defense so one bad call degrades gracefully instead of taking the service down.

## Catch specific things, not everything

Blanket \`except Exception\` hides real bugs. Catch the failure modes you actually expect and map each to the right response:

\`\`\`python
import anthropic

def safe_generate(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_model(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except anthropic.RateLimitError:
        return {"ok": False, "status": 429, "error": "rate limited, retry shortly"}
    except anthropic.APITimeoutError:
        return {"ok": False, "status": 504, "error": "upstream timed out"}
    except anthropic.APIError as e:
        return {"ok": False, "status": 502, "error": f"upstream error: {e}"}
\`\`\`

Each branch returns the same shape (\`ok\`, \`status\`, plus either \`reply\` or \`error\`), so every caller, the web route, the logger, a test, handles success and failure identically. That consistency is what keeps error handling from turning into a maze of special cases.

## Status codes carry meaning

- **400**: the caller's fault (bad input); don't retry without fixing the request.
- **429**: you're being rate limited; the caller should back off and retry later.
- **502/504**: the upstream model provider failed or timed out; often safe to retry once.

Picking the right code isn't pedantry, it's what lets a caller (or a monitoring system) react correctly without reading your error string.

## Log the failure too

An error is still a request that happened. Write a log record for it with \`status="error"\` and \`cost_usd=0\` (a failed call before the model responds usually isn't billed), so your error rate on the dashboard reflects reality instead of only counting successes.

## Why it matters

Without this, one flaky upstream response takes your whole service down, or worse, half-crashes it in a way that's hard to reproduce. With it, a bad request gets a clear 400, a busy provider gets a clear 429 or 504, and your dashboard's error-rate number actually means something instead of silently under-counting failures nobody logged.

## The mental model

Every failure mode gets caught, classified, and returned in the same shape as success, never left to crash the process. Below, build that classification logic in pure Python: given a fake call function that raises different exception types, map each to the right status code.`,
    starter_code: `class RateLimitError(Exception):
    pass


class TimeoutError_(Exception):
    pass


def safe_handle(payload, call_fn):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_fn(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except RateLimitError:
        # TODO: return {"ok": False, "status": 429, "error": "rate limited"}
        pass
    except TimeoutError_:
        # TODO: return {"ok": False, "status": 504, "error": "upstream timed out"}
        pass
    except Exception as e:
        # TODO: return {"ok": False, "status": 502, "error": str(e)}
        pass


def flaky_call(kind):
    def call_fn(prompt):
        if kind == "rate_limit":
            raise RateLimitError()
        if kind == "timeout":
            raise TimeoutError_()
        if kind == "crash":
            raise ValueError("boom")
        return f"reply to {prompt}"
    return call_fn


print(safe_handle({"prompt": "hi"}, flaky_call("ok")))
print(safe_handle({"prompt": "hi"}, flaky_call("rate_limit")))
print(safe_handle({"prompt": "hi"}, flaky_call("timeout")))
print(safe_handle({"prompt": "hi"}, flaky_call("crash")))
print(safe_handle({"prompt": ""}, flaky_call("ok")))`,
    solution_code: `class RateLimitError(Exception):
    pass


class TimeoutError_(Exception):
    pass


def safe_handle(payload, call_fn):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_fn(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except RateLimitError:
        return {"ok": False, "status": 429, "error": "rate limited"}
    except TimeoutError_:
        return {"ok": False, "status": 504, "error": "upstream timed out"}
    except Exception as e:
        return {"ok": False, "status": 502, "error": str(e)}


def flaky_call(kind):
    def call_fn(prompt):
        if kind == "rate_limit":
            raise RateLimitError()
        if kind == "timeout":
            raise TimeoutError_()
        if kind == "crash":
            raise ValueError("boom")
        return f"reply to {prompt}"
    return call_fn


print(safe_handle({"prompt": "hi"}, flaky_call("ok")))
print(safe_handle({"prompt": "hi"}, flaky_call("rate_limit")))
print(safe_handle({"prompt": "hi"}, flaky_call("timeout")))
print(safe_handle({"prompt": "hi"}, flaky_call("crash")))
print(safe_handle({"prompt": ""}, flaky_call("ok")))`,
    hints: [
      "Order matters: catch the specific exception types (RateLimitError, TimeoutError_) before the generic Exception fallback.",
      "Every branch, success or failure, should return the same shape: ok, status, and either reply or error.",
      "Validate the prompt before entering the try block, a missing prompt is a 400, not something call_fn should ever see.",
    ],
    challenge_title: "Classify the Failure",
    challenge_description: "Map a batch of call outcomes to HTTP-style status codes and tally how many requests landed in each bucket.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    counts = {}
    for i in range(1, n + 1):
        outcome = data[i].strip()
        # TODO: map outcome to a status code:
        #   "ok" -> 200, "bad_request" -> 400, "rate_limit" -> 429,
        #   "timeout" -> 504, anything else -> 500
        # TODO: increment counts[status] by 1

    # TODO: print "code count" for each status code that appeared,
    #       sorted by code ascending, then print n on the last line

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    counts = {}
    for i in range(1, n + 1):
        outcome = data[i].strip()
        if outcome == "ok":
            status = 200
        elif outcome == "bad_request":
            status = 400
        elif outcome == "rate_limit":
            status = 429
        elif outcome == "timeout":
            status = 504
        else:
            status = 500
        counts[status] = counts.get(status, 0) + 1

    for code in sorted(counts):
        print(code, counts[code])
    print(n)

main()`,
    challenge_test_cases: [
      { input: "5\nok\nbad_request\nrate_limit\ntimeout\nok", expected_output: "200 2\n400 1\n429 1\n504 1\n5", description: "Five outcomes across four status buckets, sorted ascending by code." },
      { input: "3\nok\nok\nok", expected_output: "200 3\n3", description: "All successful calls collapse into a single 200 bucket." },
      { input: "2\nok\nweird", expected_output: "200 1\n500 1\n2", description: "Edge: an unrecognized outcome string falls back to 500." },
    ],
  },
  {
    id: "prod-22-7",
    project_id: "prod-22",
    order: 7,
    title: "Guard the Budget",
    concept: "cost caps and spend guardrails",
    explanation: `Logging and cost tracking tell you what happened. A budget guard stops something *before* it happens: it refuses a call that would push total spend over a limit you set, instead of finding out at the end of the month. This is the last piece standing between "the demo works" and "someone accidentally racked up a bill running it in a loop overnight."

## A guard that tracks and enforces

\`\`\`python
class BudgetGuard:
    def __init__(self, limit_cents):
        self.limit_cents = limit_cents
        self.spent_cents = 0

    def charge(self, cost_cents):
        if self.spent_cents + cost_cents > self.limit_cents:
            return False
        self.spent_cents += cost_cents
        return True
\`\`\`

The order matters: check *before* you update \`spent_cents\`. If the check fails, nothing is charged and the call never reaches the model. This is a hard cap, not a warning, once you're at the limit, \`charge()\` returns \`False\` every time until the window resets (daily, monthly, whatever you choose).

## Wiring it into the request path

\`\`\`python
budget = BudgetGuard(limit_cents=5000)  # $50/day

def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    estimated_cost = estimate_cost(prompt)
    if not budget.charge(estimated_cost):
        return {"ok": False, "status": 402, "error": "daily budget exceeded"}

    return safe_generate({"prompt": prompt})
\`\`\`

\`402 Payment Required\` is the (rarely used, but semantically perfect) status code for exactly this situation. The guard sits *before* the model call, right after input validation, so a request that would blow the budget never spends a token.

## Rate limiting is the same idea, different resource

Budget guards a dollar amount; a rate limiter guards a request count over a time window (say, 60 requests per minute). Both are the same pattern: track a running counter, compare it to a limit, allow or reject, reset the counter on a schedule. If you build one, the other is a small variation.

## Alerting, briefly

A guard that silently rejects is only half the job, you also want to know *before* you hit the wall. In production this usually means firing a Slack or email webhook when spend crosses 80% of the cap, so a human can look before requests start getting rejected. The mechanism (an HTTP POST to a webhook URL) is simple; the important part is picking a threshold below 100% so you have time to react.

## The mental model

Every dollar spent has to clear the guard first. No exceptions, no "just this once", the guard's whole job is saying no consistently so a bug or a loop can't turn into a surprise invoice. Below, build the guard and run it against a sequence of charges.`,
    starter_code: `class BudgetGuard:
    def __init__(self, limit):
        self.limit = limit
        self.spent = 0

    def charge(self, cost):
        # TODO: if self.spent + cost > self.limit, return False (don't charge)
        # TODO: otherwise add cost to self.spent and return True
        pass


guard = BudgetGuard(100)
for cost in [30, 50, 25, 10]:
    allowed = guard.charge(cost)
    print(cost, allowed, guard.spent)`,
    solution_code: `class BudgetGuard:
    def __init__(self, limit):
        self.limit = limit
        self.spent = 0

    def charge(self, cost):
        if self.spent + cost > self.limit:
            return False
        self.spent += cost
        return True


guard = BudgetGuard(100)
for cost in [30, 50, 25, 10]:
    allowed = guard.charge(cost)
    print(cost, allowed, guard.spent)`,
    hints: [
      "Compare self.spent + cost against self.limit BEFORE mutating self.spent, or a rejected charge would still get counted.",
      "A denied charge changes nothing: spent stays exactly where it was.",
      "The guard is a hard cap: once spent is at the limit, every future charge() call returns False until you reset it.",
    ],
    challenge_title: "Enforce the Daily Cap",
    challenge_description: "Process a stream of request costs against a fixed budget, allowing or denying each one in order, and report how many landed on each side.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    spent = 0
    allowed = 0
    denied = 0
    for i in range(2, 2 + n):
        cost = int(data[i].strip())
        # TODO: if spent + cost <= budget: allow it, add cost to spent, increment allowed
        # TODO: else: deny it, spent stays the same, increment denied
        # TODO: print "ALLOW <spent>" or "DENY <spent>" for this request

    # TODO: on the last line, print "<allowed> <denied>"

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    spent = 0
    allowed = 0
    denied = 0
    for i in range(2, 2 + n):
        cost = int(data[i].strip())
        if spent + cost <= budget:
            spent += cost
            allowed += 1
            print("ALLOW", spent)
        else:
            denied += 1
            print("DENY", spent)

    print(allowed, denied)

main()`,
    challenge_test_cases: [
      { input: "100\n4\n30\n50\n25\n10", expected_output: "ALLOW 30\nALLOW 80\nDENY 80\nALLOW 90\n3 1", description: "Four requests against a 100-cent budget; the third would overshoot so it is denied while spend holds steady." },
      { input: "0\n1\n0", expected_output: "ALLOW 0\n1 0", description: "Edge: a zero-cost request against a zero budget is still allowed." },
      { input: "10\n1\n20", expected_output: "DENY 0\n0 1", description: "Edge: a single request that alone exceeds the budget is denied immediately." },
    ],
  },
  {
    id: "prod-22-8",
    project_id: "prod-22",
    order: 8,
    title: "Ship the Endpoint and the Dashboard",
    concept: "final deployment and the finished capstone",
    explanation: `Every piece is built: a packaged request handler, a live HTTP route, structured logs, per-call cost, an aggregated dashboard, graceful error handling, and a budget guard. This lesson wires them into one running service, deploys it somewhere real, and calls the capstone done. Finishing this lesson lands the whole build in your **Portfolio** as a live, monitored LLM service you can point anyone to.

## Wiring it all together

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
budget = BudgetGuard(limit_cents=5000)

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 300

@app.post("/generate")
def generate(req: GenerateRequest):
    result = safe_generate(req.model_dump())
    if result["ok"] and not budget.charge(result.get("cost_cents", 0)):
        return {"ok": False, "status": 402, "error": "daily budget exceeded"}
    write_log(make_log_record(result))
    return result

@app.get("/dashboard")
def dashboard():
    return build_dashboard(read_all_logs())

@app.get("/health")
def health():
    return {"status": "ok"}
\`\`\`

Each route is thin on purpose, it calls the functions built in earlier lessons instead of reimplementing anything. That's the payoff of packaging everything as reusable functions from lesson 1 onward: the "app" is really just three routes gluing existing pieces together.

## Deploying it

Push the code to a small platform (Render, Fly.io, Railway) or a VPS with the Dockerfile from lesson 2, set \`ANTHROPIC_API_KEY\` as an environment variable (never in code), and start the process. You now have a public URL. \`https://your-app.onrender.com/generate\` is a real endpoint anyone can \`curl\`, and \`/dashboard\` shows real usage.

## The "done" checklist

Before calling it shipped, the same three questions from every project in this track, now with teeth:

1. **Runs from a clean start**: a fresh clone, one install command, one run command, no manual steps you forgot to write down.
2. **Survives bad input**: a missing prompt, a huge prompt, a burst of requests, none of them should crash the process (lessons 6-7 exist for exactly this).
3. **Someone else could use it**: a README with the URL, an example \`curl\` command, and what the dashboard shows.

## What actually got built

Trace the arc: lesson 1 packaged the model call into one function; lesson 2 put an HTTP route in front of it; lessons 3-5 built logging, cost, and the dashboard; lessons 6-7 hardened it against failures and runaway spend. None of that was throwaway scaffolding, it's the exact shape of a small production LLM service.

## Into your Portfolio

Finishing this lesson records **Ship & Monitor an LLM App** in your Portfolio: a live URL, what it does, and the fact that it's monitored, not just running blind. This is the capstone project of the track, the shelf of tools you've built all led here: a real, deployed, observable AI product with your name on it.

Below, build the final piece: a plain-text render of the dashboard, the same numbers a \`/dashboard\` route would hand back as JSON, just formatted for a human to read.`,
    starter_code: `def render_dashboard(summary):
    requests = summary["requests"]
    errors = summary["errors"]
    cost_cents = summary["cost_cents"]
    budget_cents = summary["budget_cents"]

    # TODO: error_rate = round(errors / requests * 100) if requests else 0
    # TODO: budget_used = round(cost_cents / budget_cents * 100) if budget_cents else 0
    # TODO: return a multi-line string with these four lines, in this exact order:
    #   f"Requests: {requests}"
    #   f"Errors: {errors} ({error_rate}%)"
    #   f"Cost: {cost_cents} cents"
    #   f"Budget used: {budget_used}%"
    pass


summary = {"requests": 20, "errors": 2, "cost_cents": 450, "budget_cents": 500}
print(render_dashboard(summary))`,
    solution_code: `def render_dashboard(summary):
    requests = summary["requests"]
    errors = summary["errors"]
    cost_cents = summary["cost_cents"]
    budget_cents = summary["budget_cents"]

    error_rate = round(errors / requests * 100) if requests else 0
    budget_used = round(cost_cents / budget_cents * 100) if budget_cents else 0

    lines = [
        f"Requests: {requests}",
        f"Errors: {errors} ({error_rate}%)",
        f"Cost: {cost_cents} cents",
        f"Budget used: {budget_used}%",
    ]
    return "\\n".join(lines)


summary = {"requests": 20, "errors": 2, "cost_cents": 450, "budget_cents": 500}
print(render_dashboard(summary))`,
    hints: [
      "Guard both percentage calculations against division by zero with an `if requests else 0` style check.",
      "round() on a float gives you a clean integer percent instead of something like 9.999999.",
      "Join the four lines with \"\\n\".join(lines) so render_dashboard returns one string, not four separate prints.",
    ],
    challenge_title: "Final Health Check",
    challenge_description: "Run the go/no-go gate on a smoke test before flipping the deployed service live: it must clear both an error-rate ceiling and the cost budget.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    errors = 0
    total_cost = 0
    for i in range(1, n + 1):
        status, cost = data[i].split()
        cost = int(cost)
        # TODO: if status == "error", increment errors
        # TODO: add cost to total_cost

    budget = int(data[n + 1].strip())
    # TODO: error_rate = errors * 100 // n  (integer floor percent)
    # TODO: ready = error_rate <= 20 and total_cost <= budget
    # TODO: print "READY" or "NOT READY", then error_rate, then total_cost

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    errors = 0
    total_cost = 0
    for i in range(1, n + 1):
        status, cost = data[i].split()
        cost = int(cost)
        if status == "error":
            errors += 1
        total_cost += cost

    budget = int(data[n + 1].strip())
    error_rate = errors * 100 // n
    ready = error_rate <= 20 and total_cost <= budget

    print("READY" if ready else "NOT READY")
    print(error_rate)
    print(total_cost)

main()`,
    challenge_test_cases: [
      { input: "5\nok 10\nok 10\nok 10\nerror 5\nok 10\n50", expected_output: "READY\n20\n45", description: "1 of 5 calls failed (20% error rate, right at the ceiling) and total cost stays within the 50-cent budget." },
      { input: "4\nok 10\nerror 5\nerror 5\nok 10\n30", expected_output: "NOT READY\n50\n30", description: "Error rate of 50% blows past the 20% ceiling even though cost is within budget." },
      { input: "2\nok 40\nok 40\n50", expected_output: "NOT READY\n0\n80", description: "Zero errors but total cost of 80 exceeds the 50-cent budget." },
    ],
  },
  ],
}
