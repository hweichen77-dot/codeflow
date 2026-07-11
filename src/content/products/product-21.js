export default {
  project: {
    id: "prod-21",
    title: "AI Evals Harness",
    description:
      "Build a harness that runs a test set of inputs through an AI feature and grades each result automatically, using rule-based checks and an LLM as judge. By the end you have a script that scores pass rates by category, catches regressions against a baseline, and prints a report you can wire into CI.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 135,
    lessons_count: 8,
    tags: ["evals", "test-set", "llm-as-judge", "grading", "regression-testing", "production-ops"],
    order: 121,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-21-1",
      project_id: "prod-21",
      order: 1,
      title: "The Shape of an Eval",
      concept: "test cases and a scored loop",
      explanation: `Ship an AI feature and someone will ask "does it actually work?" Eyeballing five examples in a notebook doesn't answer that at scale. An eval harness does: you run a test set through your feature, grade every result automatically, and "does it work" becomes a number you can watch instead of a feeling you have to trust.

## What we're building

By lesson 8 you have a script. Point it at a test set and a function that calls your AI feature, and it prints a scored report with no manual review. It has three parts. A **test set** holds inputs plus what a correct answer looks like. A **grader** decides pass or fail for one case. A **runner** loops the test set through your feature and the grader, then tallies the results.

## The anatomy of a test case

The smallest useful test case is an input and an expected outcome:

\`\`\`python
test_cases = [
    {"id": "t1", "input": "I love this product!", "expected": "positive"},
    {"id": "t2", "input": "This is terrible.", "expected": "negative"},
]
\`\`\`

In a real harness, "input" gets sent to your actual AI feature:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def run_model(input_text):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=20,
        system="Classify the sentiment as positive, negative, or neutral. Reply with one word.",
        messages=[{"role": "user", "content": input_text}],
    )
    return resp.content[0].text.strip().lower()
\`\`\`

The harness compares that output to \`expected\`, case by case, and records a pass or a fail.

## Why this matters

Prompts drift. You tweak a system prompt to fix one bad answer and quietly break two others you never re-checked. Without a harness you find out when a user complains. With one you re-run the whole test set in seconds and see exactly what changed before it ships.

## The mental model to keep

An eval harness is a test suite where the assertions come from comparing model output to an expected answer. The real engineering lives in the grader, not the loop. Below, wire up the loop against a stand-in for the model so you can see the whole shape before any network call enters the picture.`,
      starter_code: `# Simulated AI feature: a canned lookup standing in for a real API call.

FAKE_MODEL_OUTPUTS = {
    "I love this product!": "positive",
    "This is terrible.": "negative",
    "It's okay I guess.": "neutral",
}

def run_model(input_text):
    return FAKE_MODEL_OUTPUTS.get(input_text, "unknown")

test_cases = [
    {"id": "t1", "input": "I love this product!", "expected": "positive"},
    {"id": "t2", "input": "This is terrible.", "expected": "negative"},
    {"id": "t3", "input": "It's okay I guess.", "expected": "neutral"},
]

# TODO: loop over test_cases, call run_model(case["input"]),
#       compare to case["expected"], and print "<id> PASS" or "<id> FAIL"
# TODO: after the loop, print "Passed: X/Y"
`,
      solution_code: `# Simulated AI feature: a canned lookup standing in for a real API call.

FAKE_MODEL_OUTPUTS = {
    "I love this product!": "positive",
    "This is terrible.": "negative",
    "It's okay I guess.": "neutral",
}

def run_model(input_text):
    return FAKE_MODEL_OUTPUTS.get(input_text, "unknown")

test_cases = [
    {"id": "t1", "input": "I love this product!", "expected": "positive"},
    {"id": "t2", "input": "This is terrible.", "expected": "negative"},
    {"id": "t3", "input": "It's okay I guess.", "expected": "neutral"},
]

passed = 0
for case in test_cases:
    actual = run_model(case["input"])
    ok = actual == case["expected"]
    if ok:
        passed += 1
    print(f"{case['id']} {'PASS' if ok else 'FAIL'}")

print(f"Passed: {passed}/{len(test_cases)}")
`,
      hints: [
        "run_model(case[\"input\"]) gives you the actual output for that case.",
        "Compare actual == case[\"expected\"] to decide PASS or FAIL.",
        "Track a running count of passes and print it after the loop finishes.",
      ],
      challenge_title: "Run the Test Set",
      challenge_description:
        "Grade a batch of already-run test cases by comparing each expected output to the actual output, then report the pass count.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    passed = 0
    # TODO: for each of the next n lines, split on "|" into expected and actual
    # TODO: print "case i: PASS" or "case i: FAIL" (1-indexed)
    # TODO: count the passes, then print "Passed: X/N"

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    passed = 0
    for i in range(1, n + 1):
        expected, actual = data[i].split("|")
        expected = expected.strip()
        actual = actual.strip()
        ok = expected == actual
        if ok:
            passed += 1
        print(f"case {i}: {'PASS' if ok else 'FAIL'}")
    print(f"Passed: {passed}/{n}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\npositive|positive\nnegative|positive\nneutral|neutral",
          expected_output: "case 1: PASS\ncase 2: FAIL\ncase 3: PASS\nPassed: 2/3",
          description: "Two of three cases match, one grader mismatch is reported as FAIL.",
        },
        {
          input: "2\nyes|yes\nno|no",
          expected_output: "case 1: PASS\ncase 2: PASS\nPassed: 2/2",
          description: "A fully passing test set reports every case as PASS.",
        },
        {
          input: "0\n",
          expected_output: "Passed: 0/0",
          description: "Edge: an empty test set prints no case lines, just the summary.",
        },
      ],
    },

    {
      id: "prod-21-2",
      project_id: "prod-21",
      order: 2,
      title: "Your First Pass Rate",
      concept: "aggregate scoring and a threshold gate",
      explanation: `A dozen PASS/FAIL lines is progress, but nobody wants to read a hundred of them to decide whether a feature is ready. The next step turns those lines into one number, a **pass rate**, and one decision, a **gate**. Did the feature clear the bar or not.

## From lines to a number

Once every case has a boolean result, the pass rate is arithmetic:

\`\`\`python
results = [run_model(c["input"]) == c["expected"] for c in test_cases]
pass_rate = sum(results) / len(results)
\`\`\`

\`sum(results)\` works because \`True\` counts as 1 and \`False\` as 0 in Python, so summing a list of booleans gives you the pass count directly.

## The gate

A pass rate alone doesn't tell you whether to ship. You need a **threshold**, the minimum rate you've decided is acceptable for this feature. Below it, the build fails. At or above it, it ships.

\`\`\`python
THRESHOLD = 0.8

def gate(rate, threshold=THRESHOLD):
    return rate >= threshold
\`\`\`

This is the same idea as a unit test suite failing the build when coverage drops. The assertion here is just fuzzier. It's model output compared to expected output, aggregated across many cases instead of one exact assert.

## Why a number, not a vibe

"It seemed fine when I tried it" doesn't survive a prompt change six weeks later. A pass rate does. Run the harness, get 82%, change the prompt, run it again, get 71%, and you know immediately that something broke, without re-reading a single transcript by hand. The threshold turns that number into an automatic decision instead of a judgment call someone has to remember to make.

## Picking a threshold

There's no universal number. A feature where mistakes are cheap, like a fun chatbot persona, can ship at 70%. A feature where mistakes are expensive, like extracting refund amounts, might need 98%. The threshold is a product decision you encode once, so every future run is judged by the same bar you chose deliberately, not whatever felt okay that day.

## The mental model to keep

Per-case grading tells you *what* broke. The pass rate and gate tell you *whether to ship*. Below, build both pieces in pure Python. Turn a list of results into a percentage, then turn that percentage into a pass or fail verdict against a threshold.`,
      starter_code: `results = [True, True, False, True, True, False, True, True, True, True]  # 8 of 10 passed

def pass_rate(results):
    # TODO: return the fraction of True values as a float (passed / total)
    pass

def gate(rate, threshold=0.8):
    # TODO: return "HARNESS PASSED" if rate >= threshold else "HARNESS FAILED"
    pass

rate = pass_rate(results)
print(f"Pass rate: {rate:.0%}")
print(gate(rate))
`,
      solution_code: `results = [True, True, False, True, True, False, True, True, True, True]  # 8 of 10 passed

def pass_rate(results):
    return sum(results) / len(results)

def gate(rate, threshold=0.8):
    return "HARNESS PASSED" if rate >= threshold else "HARNESS FAILED"

rate = pass_rate(results)
print(f"Pass rate: {rate:.0%}")
print(gate(rate))
`,
      hints: [
        "sum(results) counts the Trues directly since True behaves like 1 in Python.",
        "Divide by len(results) to get a fraction between 0 and 1.",
        "The gate is a simple comparison: rate >= threshold.",
      ],
      challenge_title: "Gate the Build",
      challenge_description:
        "Compute an integer pass percentage from a set of pass/fail flags and decide whether it clears a threshold.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    n, threshold = map(int, sys.stdin.readline().split())
    flags = list(map(int, sys.stdin.readline().split()))
    passed = sum(flags)
    # TODO: percent = passed * 100 // n  (integer floor percentage)
    # TODO: print percent as "<percent>%"
    # TODO: print "PASS" if passed * 100 >= threshold * n else "FAIL"

main()
`,
      challenge_solution_code: `import sys

def main():
    n, threshold = map(int, sys.stdin.readline().split())
    flags = list(map(int, sys.stdin.readline().split()))
    passed = sum(flags)
    percent = passed * 100 // n
    print(f"{percent}%")
    print("PASS" if passed * 100 >= threshold * n else "FAIL")

main()
`,
      challenge_test_cases: [
        {
          input: "10 80\n1 1 0 1 1 0 1 1 1 1",
          expected_output: "80%\nPASS",
          description: "8 of 10 pass exactly meets the 80% threshold.",
        },
        {
          input: "5 90\n1 1 1 1 0",
          expected_output: "80%\nFAIL",
          description: "80% falls short of a 90% threshold.",
        },
        {
          input: "1 0\n0",
          expected_output: "0%\nPASS",
          description: "Edge: a threshold of 0 always passes, even at a 0% rate.",
        },
      ],
    },

    {
      id: "prod-21-3",
      project_id: "prod-21",
      order: 3,
      title: "Writing a Good Test Set",
      concept: "test case design and categories",
      explanation: `A pass rate is only as honest as the test set behind it. Ten easy, hand-picked examples will always score well and tell you nothing. The real skill in evals isn't the grading loop. It's building a test set that would actually catch a regression.

## What a real test set contains

A good test set is not a pile of your favorite examples. It mixes three kinds of case on purpose. **Typical cases** are the everyday inputs you expect most of the time. **Edge cases** are empty input, very long input, weird formatting, ambiguous phrasing. **Known failure cases** are real mistakes the model made in production, turned into permanent regression tests so that bug can never silently come back.

Where do these come from? The best source is real usage. Pull a sample of actual production inputs, including the ones that got complaints, and turn them into golden test cases with a human-verified expected answer.

## Tagging by category

A single overall pass rate hides where the failures live. Tag each case with a **category** and you can see that your 90% overall score is really 100% on greetings and 40% on refund requests, the category that matters most:

\`\`\`python
test_cases = [
    {"id": "r1", "category": "refund_request", "input": "...", "expected": "..."},
    {"id": "g1", "category": "greeting", "input": "...", "expected": "..."},
]
\`\`\`

\`\`\`python
def report_by_category(results):
    by_cat = {}
    for r in results:
        passed, total = by_cat.get(r["category"], (0, 0))
        by_cat[r["category"]] = (passed + r["ok"], total + 1)
    return by_cat
\`\`\`

## Why this matters

An overall pass rate can hide exactly the thing you need to see. A feature that's great at small talk and bad at the one task customers actually rely on can still post an impressive-looking 85%. Category breakdowns are how you find that before a customer does.

## The mental model to keep

Think of your test set as a map of the territory your feature has to survive, not a highlight reel of what it's good at. Categories keep the map honest. They turn "it works" into "it works here, and not yet there." Below, build the category breakdown in pure Python over a small set of already-graded results.`,
      starter_code: `test_cases = [
    {"id": "t1", "category": "greeting", "expected": "hello", "actual": "hello"},
    {"id": "t2", "category": "greeting", "expected": "hi", "actual": "hi"},
    {"id": "t3", "category": "refund", "expected": "yes", "actual": "no"},
    {"id": "t4", "category": "refund", "expected": "no", "actual": "no"},
    {"id": "t5", "category": "edge_case", "expected": "empty", "actual": "error"},
]

def report_by_category(cases):
    # TODO: build a dict mapping category -> [passed_count, total_count]
    # TODO: return it
    pass

report = report_by_category(test_cases)
for category in sorted(report):
    passed, total = report[category]
    print(f"{category}: {passed}/{total}")
`,
      solution_code: `test_cases = [
    {"id": "t1", "category": "greeting", "expected": "hello", "actual": "hello"},
    {"id": "t2", "category": "greeting", "expected": "hi", "actual": "hi"},
    {"id": "t3", "category": "refund", "expected": "yes", "actual": "no"},
    {"id": "t4", "category": "refund", "expected": "no", "actual": "no"},
    {"id": "t5", "category": "edge_case", "expected": "empty", "actual": "error"},
]

def report_by_category(cases):
    report = {}
    for c in cases:
        passed, total = report.get(c["category"], (0, 0))
        ok = 1 if c["expected"] == c["actual"] else 0
        report[c["category"]] = (passed + ok, total + 1)
    return report

report = report_by_category(test_cases)
for category in sorted(report):
    passed, total = report[category]
    print(f"{category}: {passed}/{total}")
`,
      hints: [
        "Use a dict where each value is a (passed, total) tuple you rebuild each time you see the category.",
        "A case passes when case[\"expected\"] == case[\"actual\"].",
        "sorted(report) gives you the category names in alphabetical order for a stable report.",
      ],
      challenge_title: "Find the Weak Category",
      challenge_description:
        "Compute a per-category pass rate for a graded test set and identify the weakest category.",
      challenge_language: "python",
      challenge_starter_code: `import sys
from collections import defaultdict

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    stats = defaultdict(lambda: [0, 0])
    for i in range(1, n + 1):
        category, expected, actual = data[i].split()
        # TODO: increment stats[category][1] (total) always
        # TODO: increment stats[category][0] (passed) when expected == actual

    # TODO: for each category in sorted order, print "category passed/total percent%"
    #       (percent = passed * 100 // total)
    # TODO: track the category with the lowest percent (first one wins ties)
    #       and print "Weakest: <category>" last

main()
`,
      challenge_solution_code: `import sys
from collections import defaultdict

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    stats = defaultdict(lambda: [0, 0])
    for i in range(1, n + 1):
        category, expected, actual = data[i].split()
        stats[category][1] += 1
        if expected == actual:
            stats[category][0] += 1

    weakest = None
    weakest_rate = None
    for category in sorted(stats):
        passed, total = stats[category]
        percent = passed * 100 // total
        print(f"{category} {passed}/{total} {percent}%")
        if weakest_rate is None or percent < weakest_rate:
            weakest = category
            weakest_rate = percent

    print(f"Weakest: {weakest}")

main()
`,
      challenge_test_cases: [
        {
          input: "5\ngreeting hello hello\ngreeting hi hi\nrefund yes no\nrefund no no\nedge_case empty error",
          expected_output: "edge_case 0/1 0%\ngreeting 2/2 100%\nrefund 1/2 50%\nWeakest: edge_case",
          description: "edge_case has the lowest pass rate at 0%, so it's reported as weakest.",
        },
        {
          input: "2\nmath 5 5\nmath 3 3",
          expected_output: "math 2/2 100%\nWeakest: math",
          description: "A single category with a perfect rate is still reported as the weakest by default.",
        },
        {
          input: "4\na x y\na x x\nb p q\nb p p",
          expected_output: "a 1/2 50%\nb 1/2 50%\nWeakest: a",
          description: "Edge: a tie between categories goes to the alphabetically first one.",
        },
      ],
    },

    {
      id: "prod-21-4",
      project_id: "prod-21",
      order: 4,
      title: "Rule-Based Graders",
      concept: "grader functions for different task types",
      explanation: `"Compare to the expected string" only works when there's one correct answer. A classifier has one right label. A chatbot reply, an extracted number, and a JSON blob each need their own way of deciding pass or fail. That's a **grader**: a small function with the signature \`grader(actual, expected) -> bool\`, swapped in per test case.

## Four graders that cover most tasks

\`\`\`python
def exact_match(actual, expected):
    return actual == expected

def contains(actual, expected):
    return expected in actual

def in_range(actual, expected, tolerance=0.5):
    return abs(actual - expected) <= tolerance

def has_keys(actual_dict, required_keys):
    return all(k in actual_dict for k in required_keys)
\`\`\`

- \`exact_match\` for classifiers and short structured labels.
- \`contains\` for free-form text where you only need one fact present, like a support reply that has to mention the refund amount somewhere.
- \`in_range\` for numeric extraction, where the model might say "9.8" and you meant "10.0". A small tolerance forgives rounding without letting real errors through.
- \`has_keys\` for JSON-shaped output where you care that the schema was respected, not the exact wording.

## Routing to the right grader

A real test case records which grader it needs, and the runner looks it up:

\`\`\`python
GRADERS = {"exact": exact_match, "contains": contains, "range": in_range}

def grade(case):
    grader_fn = GRADERS[case["grader"]]
    return grader_fn(case["actual"], case["expected"])
\`\`\`

That one dictionary lookup lets a single harness grade a sentiment classifier, a support-reply generator, and a price extractor through the same runner loop. Only the grader entry per case changes.

## Why this matters

A harness that only does exact match will reject perfectly good free-form answers for being too strict, or get quietly replaced with something looser that lets real bugs through. Naming the grader per test case, instead of hard-coding one comparison everywhere, makes the harness reusable across an entire product rather than one endpoint.

## The mental model to keep

The runner doesn't know what "correct" means for a given case. It calls whichever grader that case declares. Below, wire up the dispatcher and three of these graders over a small mixed test set.`,
      starter_code: `def exact_match(actual, expected):
    return actual == expected

def contains(actual, expected):
    return expected in actual

def in_range(actual, expected, tolerance=0.5):
    return abs(actual - expected) <= tolerance

GRADERS = {"exact": exact_match, "contains": contains, "range": in_range}

test_cases = [
    {"id": "t1", "grader": "exact", "actual": "yes", "expected": "yes"},
    {"id": "t2", "grader": "contains", "actual": "The total is $42.50 today", "expected": "$42.50"},
    {"id": "t3", "grader": "range", "actual": 9.8, "expected": 10.0},
    {"id": "t4", "grader": "range", "actual": 7.0, "expected": 10.0},
]

# TODO: for each case, look up its grader function in GRADERS by case["grader"]
# TODO: call it with (case["actual"], case["expected"]) and print "<id> PASS" or "<id> FAIL"
`,
      solution_code: `def exact_match(actual, expected):
    return actual == expected

def contains(actual, expected):
    return expected in actual

def in_range(actual, expected, tolerance=0.5):
    return abs(actual - expected) <= tolerance

GRADERS = {"exact": exact_match, "contains": contains, "range": in_range}

test_cases = [
    {"id": "t1", "grader": "exact", "actual": "yes", "expected": "yes"},
    {"id": "t2", "grader": "contains", "actual": "The total is $42.50 today", "expected": "$42.50"},
    {"id": "t3", "grader": "range", "actual": 9.8, "expected": 10.0},
    {"id": "t4", "grader": "range", "actual": 7.0, "expected": 10.0},
]

for case in test_cases:
    grader_fn = GRADERS[case["grader"]]
    ok = grader_fn(case["actual"], case["expected"])
    print(f"{case['id']} {'PASS' if ok else 'FAIL'}")
`,
      hints: [
        "GRADERS[case[\"grader\"]] gives you the right function object for that case.",
        "Every grader in GRADERS takes (actual, expected) in that order.",
        "in_range uses the default tolerance of 0.5 since no tolerance is passed here.",
      ],
      challenge_title: "Route to the Right Grader",
      challenge_description:
        "Grade a mixed batch of test cases by dispatching each one to the correct rule-based grader.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    passed = 0
    for i in range(1, n + 1):
        tokens = data[i].split()
        kind = tokens[0]
        # TODO: if kind == "exact": tokens[1] is actual, tokens[2] is expected
        # TODO: if kind == "contains": tokens[1] is the haystack, tokens[2] is the needle
        # TODO: if kind == "range": tokens[1], tokens[2], tokens[3] are actual, expected, tolerance (floats)
        # TODO: print "case i: PASS" or "case i: FAIL", then count passes
    print(f"Passed: {passed}/{n}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    passed = 0
    for i in range(1, n + 1):
        tokens = data[i].split()
        kind = tokens[0]
        if kind == "exact":
            ok = tokens[1] == tokens[2]
        elif kind == "contains":
            ok = tokens[2] in tokens[1]
        elif kind == "range":
            actual, expected, tolerance = map(float, tokens[1:4])
            ok = abs(actual - expected) <= tolerance
        else:
            ok = False
        if ok:
            passed += 1
        print(f"case {i}: {'PASS' if ok else 'FAIL'}")
    print(f"Passed: {passed}/{n}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\nexact yes yes\ncontains The_total_is_42.50_today 42.50\nrange 9.8 10.0 0.5\nrange 7.0 10.0 0.5",
          expected_output: "case 1: PASS\ncase 2: PASS\ncase 3: PASS\ncase 4: FAIL\nPassed: 3/4",
          description: "Three graders each route correctly; the range check outside tolerance fails.",
        },
        {
          input: "2\nexact cat dog\ncontains hello xyz",
          expected_output: "case 1: FAIL\ncase 2: FAIL\nPassed: 0/2",
          description: "A mismatched exact grader and a missing substring both fail.",
        },
        {
          input: "1\nrange 5.0 5.5 0.5",
          expected_output: "case 1: PASS\nPassed: 1/1",
          description: "Edge: the difference exactly equals the tolerance, which still counts as a pass.",
        },
      ],
    },

    {
      id: "prod-21-5",
      project_id: "prod-21",
      order: 5,
      title: "LLM-as-Judge",
      concept: "using a model to grade subjective quality",
      explanation: `Some outputs have no single correct string to compare against. "Is this customer reply polite and helpful?" isn't an exact-match question. For tasks like that, you grade with a second model call, the **judge**. You show it the input, the output, and a rubric, and ask it to return a structured verdict.

## The judge prompt

A judge system prompt pins down what to score and what shape to return, the same discipline as any other structured-output prompt:

\`\`\`python
JUDGE_SYSTEM = """You are grading a customer support reply for quality.
Score it 1 (bad) to 5 (excellent) on politeness and helpfulness.
Return ONLY a JSON object: {"score": <int 1-5>, "reasoning": "<one sentence>"}.
Do not wrap it in code fences."""

def judge(customer_message, reply):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=150,
        system=JUDGE_SYSTEM,
        messages=[{"role": "user", "content": f"Customer said: {customer_message}\\nReply: {reply}"}],
    )
    return resp.content[0].text
\`\`\`

## Parsing the verdict defensively

The judge is still an LLM, so its reply can arrive with a stray preamble or a code fence around the JSON, like any other structured-output call. You extract and validate it the way you would any model JSON. You also check the score is in range, because a judge that returns "score": 9 on a 1-5 scale gave you a broken verdict, not a real one:

\`\`\`python
import json

def parse_judgment(raw_reply):
    try:
        start = raw_reply.index("{")
        end = raw_reply.rindex("}") + 1
        data = json.loads(raw_reply[start:end])
    except (ValueError, json.JSONDecodeError):
        return None
    score = data.get("score")
    if not isinstance(score, int) or not (1 <= score <= 5):
        return None
    return data
\`\`\`

## Why this matters, and its limits

An LLM judge lets you grade tone, helpfulness, or faithfulness to a source document, things a rule can't cleanly check. But the judge is not ground truth. It can be miscalibrated, inconsistent, or fooled by a confident-sounding wrong answer. Treat it as a second opinion you spot-check against a handful of human ratings now and then, not an oracle you trust blindly.

## The mental model to keep

A rule-based grader answers "did it match a pattern?" A judge answers "would a careful reader say this is good?" Both hand your harness the same thing in the end, a pass/fail or a score, just computed differently. Below, build the defensive parser and watch it reject a malformed verdict the way a real one would.`,
      starter_code: `import json

def parse_judgment(raw_reply):
    # raw_reply is what a judge model would return; it may have preamble or fences.
    # TODO: find the first "{" and last "}", slice the string, and json.loads it
    #       (wrap this in a try/except for ValueError and json.JSONDecodeError)
    # TODO: if parsing fails, or "score" isn't an int from 1 to 5, return None
    # TODO: otherwise return the parsed dict
    pass

replies = [
    '{"score": 4, "reasoning": "Clear and polite."}',
    'Here is my verdict:\\n{"score": 2, "reasoning": "Too terse."}',
    '{"score": 9, "reasoning": "invalid scale"}',
    'not json at all',
]

for r in replies:
    print(parse_judgment(r))
`,
      solution_code: `import json

def parse_judgment(raw_reply):
    try:
        start = raw_reply.index("{")
        end = raw_reply.rindex("}") + 1
        data = json.loads(raw_reply[start:end])
    except (ValueError, json.JSONDecodeError):
        return None
    score = data.get("score")
    if not isinstance(score, int) or not (1 <= score <= 5):
        return None
    return data

replies = [
    '{"score": 4, "reasoning": "Clear and polite."}',
    'Here is my verdict:\\n{"score": 2, "reasoning": "Too terse."}',
    '{"score": 9, "reasoning": "invalid scale"}',
    'not json at all',
]

for r in replies:
    print(parse_judgment(r))
`,
      hints: [
        "Reuse the slice-from-first-brace-to-last-brace trick you've used for JSON extraction before.",
        "json.loads can raise json.JSONDecodeError; str.index/rindex can raise ValueError if there's no brace at all.",
        "isinstance(score, int) rejects a missing or out-of-range value cleanly.",
      ],
      challenge_title: "Parse the Judge's Verdict",
      challenge_description:
        "Extract and validate a judge's score from a batch of raw model replies, some malformed or out of range.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import json

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    for i in range(1, n + 1):
        reply = lines[i]
        # TODO: try to find the first "{" and last "}", slice, and json.loads it
        # TODO: valid only if parsing succeeds AND "score" is an int from 1 to 5
        # TODO: print "<i>: <score>" if valid, otherwise "<i>: INVALID"

main()
`,
      challenge_solution_code: `import sys
import json

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    for i in range(1, n + 1):
        reply = lines[i]
        valid = False
        score = None
        try:
            start = reply.index("{")
            end = reply.rindex("}") + 1
            data = json.loads(reply[start:end])
            score = data.get("score")
            if isinstance(score, int) and 1 <= score <= 5:
                valid = True
        except (ValueError, json.JSONDecodeError):
            valid = False
        print(f"{i}: {score if valid else 'INVALID'}")

main()
`,
      challenge_test_cases: [
        {
          input: '4\n{"score": 4, "reasoning": "ok"}\njunk {"score": 2, "reasoning": "meh"} trailing\n{"score": 7, "reasoning": "bad"}\nno json here',
          expected_output: "1: 4\n2: 2\n3: INVALID\n4: INVALID",
          description: "Valid embedded JSON is extracted even with surrounding text; out-of-range and non-JSON replies are rejected.",
        },
        {
          input: '2\n{"score": 1, "reasoning": "a"}\n{"score": 5, "reasoning": "b"}',
          expected_output: "1: 1\n2: 5",
          description: "Both boundary scores, 1 and 5, are valid.",
        },
        {
          input: '1\n{"score": 3.5, "reasoning": "x"}',
          expected_output: "1: INVALID",
          description: "Edge: a non-integer score like 3.5 is rejected even though it's numeric.",
        },
      ],
    },

    {
      id: "prod-21-6",
      project_id: "prod-21",
      order: 6,
      title: "Harden: Flaky Judges and Retries",
      concept: "majority vote and graceful degradation",
      explanation: `The judge is itself an LLM, so it inherits every unreliability you've learned to guard against elsewhere. It can time out, return malformed JSON, or disagree with itself on two runs of the exact same case. A harness that trusts a single judge call at face value produces a noisy score nobody trusts. Two hardening moves fix that.

## Retry, and record failure as its own outcome

If a judge reply fails to parse, don't silently count it as a fail, and don't crash the whole run. Retry it a couple of times, and if it still won't parse, record a distinct **judge error** so you can tell "the feature failed" apart from "the judge glitched":

\`\`\`python
def judge_with_retry(customer_message, reply, tries=3):
    for attempt in range(tries):
        raw = judge(customer_message, reply)
        parsed = parse_judgment(raw)
        if parsed is not None:
            return parsed
    return None  # judge error, not a score
\`\`\`

## Vote out the noise

Even a well-formed judge can wobble between a 3 and a 4 on the same input across runs, especially near your pass threshold. Instead of trusting one call, run the judge a handful of times and take the **median**. The median barely moves when one call comes back an outlier, where an average would drag toward it:

\`\`\`python
import statistics

def aggregate_judge_scores(scores):
    valid = [s for s in scores if s is not None]
    if not valid:
        return "NO_VERDICT"
    return round(statistics.median(valid))
\`\`\`

If every attempt for a case comes back \`None\`, that case gets \`"NO_VERDICT"\`. That's a visible signal the judge is broken for this input, worth investigating on its own rather than as a quality failure.

## Why this matters

An eval harness that crashes on a malformed judge reply, or reports a false regression because one noisy judge call landed low, trains people to ignore it. The point of automating grading is that people can trust the number without re-checking it by hand. That trust depends on the harness handling its own failure modes as carefully as it grades the feature under test.

## The mental model to keep

Never let the grader's own flakiness look like the feature's flakiness. Retry judge calls before giving up, vote across repeats to smooth real noise, and label total failure as \`NO_VERDICT\` rather than a silent zero. Below, build the aggregator over a small batch of repeated judge scores, some of them missing entirely.`,
      starter_code: `import statistics

def aggregate_judge_scores(scores):
    # scores may include None entries for judge calls that never parsed
    # TODO: filter out the None values; if nothing is left, return "NO_VERDICT"
    # TODO: otherwise return round(statistics.median(valid_scores))
    pass

cases = {
    "email_1": [4, 5, None, 4],
    "email_2": [2, None, None],
    "email_3": [None, None, None],
}

for case_id, scores in cases.items():
    print(case_id, "->", aggregate_judge_scores(scores))
`,
      solution_code: `import statistics

def aggregate_judge_scores(scores):
    valid = [s for s in scores if s is not None]
    if not valid:
        return "NO_VERDICT"
    return round(statistics.median(valid))

cases = {
    "email_1": [4, 5, None, 4],
    "email_2": [2, None, None],
    "email_3": [None, None, None],
}

for case_id, scores in cases.items():
    print(case_id, "->", aggregate_judge_scores(scores))
`,
      hints: [
        "A list comprehension like [s for s in scores if s is not None] filters out the failed attempts.",
        "statistics.median needs at least one value, which is exactly why you check for an empty list first.",
        "round() on the median gives you a clean integer score to report.",
      ],
      challenge_title: "Vote Out the Noise",
      challenge_description:
        "Aggregate repeated judge scores per test case into a median verdict, treating all-failed attempts as no verdict at all.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        tokens = data[i].split()
        name = tokens[0]
        k = int(tokens[1])
        scores = tokens[2:2 + k]
        # TODO: keep only the tokens that are NOT "ERR", converted to int, as 'valid'
        # TODO: if 'valid' is empty, print "<name>: NO_VERDICT"
        # TODO: otherwise sort 'valid'; for an odd count print the middle value;
        #       for an even count print the floor average of the two middle values
        # TODO: print "<name>: <median>"

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        tokens = data[i].split()
        name = tokens[0]
        k = int(tokens[1])
        scores = tokens[2:2 + k]
        valid = [int(t) for t in scores if t != "ERR"]
        if not valid:
            print(f"{name}: NO_VERDICT")
            continue
        valid.sort()
        m = len(valid)
        if m % 2 == 1:
            median = valid[m // 2]
        else:
            median = (valid[m // 2 - 1] + valid[m // 2]) // 2
        print(f"{name}: {median}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nemail_1 5 4 4 5 ERR 4\nemail_2 3 2 ERR ERR\nemail_3 3 ERR ERR ERR",
          expected_output: "email_1: 4\nemail_2: 2\nemail_3: NO_VERDICT",
          description: "One case has four valid scores (even median), one has a single valid score, one has none at all.",
        },
        {
          input: "2\nq1 4 2 4 5 3\nq2 2 ERR ERR",
          expected_output: "q1: 3\nq2: NO_VERDICT",
          description: "An even-count median floors down, and an all-failed case reports NO_VERDICT.",
        },
        {
          input: "1\nsolo 1 5",
          expected_output: "solo: 5",
          description: "Edge: a single valid score is its own median.",
        },
      ],
    },

    {
      id: "prod-21-7",
      project_id: "prod-21",
      order: 7,
      title: "The Weighted Report and Regression Gate",
      concept: "combining graders and catching regressions",
      explanation: `A real feature usually gets both kinds of grading at once, a cheap rule check plus a nuanced judge score, and neither one alone tells the whole story. This lesson combines them into one number per case, then compares today's overall number against yesterday's. A single run in isolation can't tell you whether you just made things worse.

## One composite score per case

Blend the rule result and the judge score into a single 0-to-1 composite, weighted by how much you trust each signal:

\`\`\`python
def composite_score(rule_pass, judge_score, rule_weight=0.4, judge_weight=0.6):
    rule_part = 1.0 if rule_pass else 0.0
    judge_part = judge_score / 5 if judge_score is not None else rule_part
    return rule_weight * rule_part + judge_weight * judge_part
\`\`\`

When a case has no judge score, maybe it's cheap enough to skip judging on every run, the composite falls back to the rule result instead of silently zeroing it out.

## Sampling the judge to control cost

Judge calls are extra API calls, and running one on every case on every commit adds up fast on a large test set. A common pattern runs the cheap rule grader on the full set every time, but only runs the judge on a random sample in CI, and on the full set nightly or before a release. You trade a little precision for a much smaller bill on the runs that happen most often.

## Catching a regression

An overall score by itself doesn't tell you whether it's better or worse than last time. Store the last known-good score as a **baseline** and fail the build when today's score drops by more than a small tolerance. Don't fail on any drop at all, since a point or two of noise is expected:

\`\`\`python
def check_regression(overall, baseline, tolerance=0.05):
    return baseline - overall > tolerance
\`\`\`

## Why this matters

Without a baseline, "68%" is a number with no context. With one, it's a decision: better, about the same, or a real regression worth blocking on. That's the difference between an eval harness you run once out of curiosity and one that guards a shipped feature over time.

## The mental model to keep

Composite scoring answers "how good was this run overall, across every signal we have?" The regression gate answers "is that worse than what we already trusted?" Below, compute both over a small batch of graded cases.`,
      starter_code: `cases = [
    {"id": "c1", "rule_pass": True, "judge_score": 5},
    {"id": "c2", "rule_pass": True, "judge_score": 3},
    {"id": "c3", "rule_pass": False, "judge_score": 2},
]

def composite_score(rule_pass, judge_score, rule_weight=0.4, judge_weight=0.6):
    # TODO: rule_part is 1.0 if rule_pass else 0.0
    # TODO: judge_part is judge_score / 5 if judge_score is not None, else rule_part
    # TODO: return rule_weight * rule_part + judge_weight * judge_part
    pass

def overall_score(cases):
    # TODO: return the average composite_score across all cases
    pass

BASELINE = 0.85
score = overall_score(cases)
print(f"Overall: {score:.2f}")
print("REGRESSION" if BASELINE - score > 0.05 else "OK")
`,
      solution_code: `cases = [
    {"id": "c1", "rule_pass": True, "judge_score": 5},
    {"id": "c2", "rule_pass": True, "judge_score": 3},
    {"id": "c3", "rule_pass": False, "judge_score": 2},
]

def composite_score(rule_pass, judge_score, rule_weight=0.4, judge_weight=0.6):
    rule_part = 1.0 if rule_pass else 0.0
    judge_part = judge_score / 5 if judge_score is not None else rule_part
    return rule_weight * rule_part + judge_weight * judge_part

def overall_score(cases):
    scores = [composite_score(c["rule_pass"], c["judge_score"]) for c in cases]
    return sum(scores) / len(scores)

BASELINE = 0.85
score = overall_score(cases)
print(f"Overall: {score:.2f}")
print("REGRESSION" if BASELINE - score > 0.05 else "OK")
`,
      hints: [
        "composite_score is a weighted sum of rule_part and judge_part, each already scaled to 0-1.",
        "overall_score is just the mean of composite_score across every case.",
        "The regression check compares BASELINE minus the current score against the tolerance, not the raw scores directly.",
      ],
      challenge_title: "Composite Score and Regression Gate",
      challenge_description:
        "Combine per-case rule and judge results into a weighted overall score and decide whether it's a regression against a baseline.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    baseline, tolerance = map(float, data[0].split())
    n = int(data[1].strip())
    composites = []
    for i in range(2, 2 + n):
        rule_pass, judge_score = map(int, data[i].split())
        # judge_score of -1 means "no judge score for this case"
        # TODO: rule_part = 1.0 if rule_pass == 1 else 0.0
        # TODO: judge_part = judge_score / 5 if judge_score != -1 else rule_part
        # TODO: composite = 0.4 * rule_part + 0.6 * judge_part; append it to composites

    overall = sum(composites) / len(composites)
    print(f"Overall: {overall:.2f}")
    print("REGRESSION" if baseline - overall > tolerance else "OK")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    baseline, tolerance = map(float, data[0].split())
    n = int(data[1].strip())
    composites = []
    for i in range(2, 2 + n):
        rule_pass, judge_score = map(int, data[i].split())
        rule_part = 1.0 if rule_pass == 1 else 0.0
        judge_part = judge_score / 5 if judge_score != -1 else rule_part
        composite = 0.4 * rule_part + 0.6 * judge_part
        composites.append(composite)

    overall = sum(composites) / len(composites)
    print(f"Overall: {overall:.2f}")
    print("REGRESSION" if baseline - overall > tolerance else "OK")

main()
`,
      challenge_test_cases: [
        {
          input: "0.85 0.05\n3\n1 5\n1 3\n0 2",
          expected_output: "Overall: 0.67\nREGRESSION",
          description: "Overall drops well below the baseline minus tolerance, flagging a real regression.",
        },
        {
          input: "0.5 0.1\n2\n1 -1\n1 5",
          expected_output: "Overall: 1.00\nOK",
          description: "A case with no judge score falls back to its rule result; overall clears the baseline.",
        },
        {
          input: "0.85 0.05\n2\n1 5\n0 5",
          expected_output: "Overall: 0.80\nOK",
          description: "Edge: the drop lands right at the tolerance boundary, which does not count as a regression.",
        },
      ],
    },

    {
      id: "prod-21-8",
      project_id: "prod-21",
      order: 8,
      title: "Ship the Harness",
      concept: "the final report and shipping",
      explanation: `Every piece is built: test cases, rule graders, an LLM judge, retries and majority voting, weighted scoring, and a regression gate. The last step packages it all into one report a person or a CI pipeline can read in five seconds. Finish this lesson and the AI Evals Harness lands in your **Portfolio**.

## What the final report needs

A report earns its keep by answering three questions immediately, without anyone opening a log file. **Overall** is one number, the composite pass rate across the whole test set. **By category** is where the failures actually live, not just that some exist. **Pass or fail** is the gate verdict against your threshold, plus whether it's a regression against the last known-good baseline.

\`\`\`python
def build_report(cases):
    total = len(cases)
    passed = sum(1 for c in cases if c["passed"])
    by_category = {}
    for c in cases:
        p, t = by_category.get(c["category"], (0, 0))
        by_category[c["category"]] = (p + (1 if c["passed"] else 0), t + 1)
    return {
        "overall": round(passed / total, 2) if total else 0.0,
        "total": total,
        "passed": passed,
        "categories": {cat: f"{p}/{t}" for cat, (p, t) in by_category.items()},
    }
\`\`\`

## Wrapping it as a runnable tool

You invoke a real harness with one command, against a test-set file and a function reference to whatever's under test:

\`\`\`python
def run_harness(test_cases, run_model, grade_fn, baseline=None, tolerance=0.05):
    graded = []
    for case in test_cases:
        actual = run_model(case["input"])
        passed = grade_fn(actual, case)
        graded.append({**case, "passed": passed})
    report = build_report(graded)
    if baseline is not None:
        report["regression"] = baseline - report["overall"] > tolerance
    return report
\`\`\`

One function call, one report, run on every commit or nightly, your choice.

## What "shipped" means here

The same three checks as always. It runs from a clean start with one command. An empty test set doesn't crash it, since \`build_report\` above guards the zero-total division. And someone else could point it at their own test cases and function from your instructions alone.

## Into your Portfolio

Finishing this lesson records the AI Evals Harness in your **Portfolio** tab. It's the tool that answers "does it still work?" for every other project you've built in this track, and any AI feature you ship after it.

## The mental model to keep

A finished harness hides its machinery behind one clean report. Underneath sit a test set, graders, a judge with retries and voting, a weighted composite, and a baseline comparison. The person reading the output sees a pass rate, a category breakdown, and a verdict. Below, build that final report function, the last piece.`,
      starter_code: `cases = [
    {"id": "c1", "category": "refunds", "passed": True},
    {"id": "c2", "category": "refunds", "passed": False},
    {"id": "c3", "category": "greetings", "passed": True},
    {"id": "c4", "category": "greetings", "passed": True},
]

def build_report(cases):
    # TODO: total = len(cases); passed = count of cases with passed True
    # TODO: overall = round(passed / total, 2)
    # TODO: categories = dict mapping category -> "passed/total" string, per category
    # TODO: return {"overall": overall, "total": total, "passed": passed, "categories": categories}
    pass

report = build_report(cases)
print(f"Overall: {report['overall']}")
print(f"Passed: {report['passed']}/{report['total']}")
for cat in sorted(report["categories"]):
    print(f"  {cat}: {report['categories'][cat]}")
print("AI Evals Harness built. Saved to your Portfolio.")
`,
      solution_code: `cases = [
    {"id": "c1", "category": "refunds", "passed": True},
    {"id": "c2", "category": "refunds", "passed": False},
    {"id": "c3", "category": "greetings", "passed": True},
    {"id": "c4", "category": "greetings", "passed": True},
]

def build_report(cases):
    total = len(cases)
    passed = sum(1 for c in cases if c["passed"])
    by_category = {}
    for c in cases:
        p, t = by_category.get(c["category"], (0, 0))
        by_category[c["category"]] = (p + (1 if c["passed"] else 0), t + 1)
    categories = {cat: f"{p}/{t}" for cat, (p, t) in by_category.items()}
    return {
        "overall": round(passed / total, 2) if total else 0.0,
        "total": total,
        "passed": passed,
        "categories": categories,
    }

report = build_report(cases)
print(f"Overall: {report['overall']}")
print(f"Passed: {report['passed']}/{report['total']}")
for cat in sorted(report["categories"]):
    print(f"  {cat}: {report['categories'][cat]}")
print("AI Evals Harness built. Saved to your Portfolio.")
`,
      hints: [
        "Build a per-category (passed, total) dict first, the same pattern you used back in lesson 3.",
        "round(passed / total, 2) gives a clean overall score; guard the total == 0 case.",
        "Format each category value as an f-string \"p/t\" only when you build the final categories dict.",
      ],
      challenge_title: "Build the Final Report",
      challenge_description:
        "Produce a full harness report from a graded test set: a per-category breakdown and one overall pass percentage.",
      challenge_language: "python",
      challenge_starter_code: `import sys
from collections import defaultdict

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    stats = defaultdict(lambda: [0, 0])
    total_passed = 0
    for i in range(1, n + 1):
        category, passed = data[i].split()
        passed = int(passed)
        # TODO: increment stats[category][1] (total) always
        # TODO: increment stats[category][0] (passed) and total_passed when passed == 1

    # TODO: for each category in sorted order, print "category: passed/total"
    # TODO: print "Overall: X%" where X = total_passed * 100 // n

main()
`,
      challenge_solution_code: `import sys
from collections import defaultdict

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    stats = defaultdict(lambda: [0, 0])
    total_passed = 0
    for i in range(1, n + 1):
        category, passed = data[i].split()
        passed = int(passed)
        stats[category][1] += 1
        if passed == 1:
            stats[category][0] += 1
            total_passed += 1

    for category in sorted(stats):
        p, t = stats[category]
        print(f"{category}: {p}/{t}")

    overall = total_passed * 100 // n
    print(f"Overall: {overall}%")

main()
`,
      challenge_test_cases: [
        {
          input: "4\nrefunds 1\nrefunds 0\ngreetings 1\ngreetings 1",
          expected_output: "greetings: 2/2\nrefunds: 1/2\nOverall: 75%",
          description: "Two categories are broken out alphabetically, and the overall rate reflects all four cases.",
        },
        {
          input: "3\nmath 0\nmath 0\nmath 0",
          expected_output: "math: 0/3\nOverall: 0%",
          description: "A fully failing category produces a 0% overall score.",
        },
        {
          input: "1\nsolo 1",
          expected_output: "solo: 1/1\nOverall: 100%",
          description: "Edge: a single passing case reports a perfect 100% overall.",
        },
      ],
    },
  ],
};
