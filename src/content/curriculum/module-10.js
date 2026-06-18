export default {
  project: {
    id: "ai-10",
    title: "Structured Outputs",
    description: "Stop wrestling with free-form model replies. Learn to force LLMs into clean, parseable JSON using JSON mode, schemas, function calling, and validation so the output plugs straight into real code.",
    difficulty: "intermediate",
    category: "prompting",
    estimated_time: 50,
    lessons_count: 8,
    tags: ["json", "structured-output", "function-calling", "validation", "extraction"],
    order: 10,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-10-l1",
      project_id: "ai-10",
      order: 1,
      title: "Why Free Text Breaks Pipelines",
      concept: "Parsing",
      xp_reward: 10,
      explanation: `You ask a model for a price and it answers, "Sure! The total comes to about \\$42.50 (plus tax)." A human reads that in a blink. Your code, trying to pull out a number, chokes. That one friendly sentence is why so many AI features work in the demo and fall apart in production.

## What it is

A **pipeline** is any chain where a model's output feeds the next step automatically: a database insert, an API call, a UI that renders fields. Pipelines need **machine-readable** data — predictable shapes a program can index into. Free text is the opposite: fluent, varied, and unpredictable. The model that's so good at sounding human is, by default, terrible at being a reliable data source.

The core mismatch: an LLM optimizes for **plausible prose**, but your code needs **rigid structure**. Those two goals fight every single request.

## How it works

Walk through what breaks when you parse prose:

1. You ask for data. "Give me the customer's name and order total."
2. The model answers in a sentence. "The customer is Dana Lee and they owe forty-two fifty."
3. Your code tries to extract. It hunts for a name and a number, often with brittle string slicing or a regular expression.
4. The format drifts. Next request says "Total: \\$42.50" — different words, different spacing, and your parser silently grabs the wrong thing.

Here is the fragile pattern people reach for first:

\`\`\`python
reply = "The total is about \\$42.50 (plus tax)."
# Brittle: grab the first number after a dollar sign
import re
match = re.search(r"\\$([0-9.]+)", reply)
total = float(match.group(1)) if match else None
print(total)  # works today, breaks when wording changes
\`\`\`

The regex works until the model says "42 dollars and 50 cents," or rounds to "about forty bucks," or adds a second number. Every reword is a new edge case. You are now maintaining a parser for English, which is a losing game.

## Why it matters

Brittle parsing is one of the top reasons AI prototypes never ship:

- **Silent corruption.** A parser that grabs the wrong number doesn't crash; it inserts bad data and moves on. You find out when a customer is charged the wrong amount.
- **Endless edge cases.** Every phrasing the model invents is a bug you didn't anticipate. The backlog never shrinks.
- **No type safety.** Free text has no notion of "this field is an integer." You're casting strings and praying.

The fix is not a smarter regex. The fix is to stop receiving prose at all — to make the model emit structured data in the first place, which the rest of this module is about.

## The mental model to keep

**Prose is for humans; structure is for code.** The moment a model's output feeds another program, you want JSON, not sentences. Don't parse English — demand a shape.`,
      key_terms: [
        { term: "Pipeline", definition: "A chain where one step's output is automatically fed into the next, with no human in between." },
        { term: "Machine-readable", definition: "Data in a predictable, rigid shape (like JSON) that a program can index into reliably." },
        { term: "Parsing", definition: "Extracting structured values out of raw text — brittle and error-prone when the text is free-form prose." }
      ],
      callouts: [
        { type: "analogy", title: "A waiter who never repeats an order the same way", content: "Imagine a waiter who delivers your meal perfectly but reads the bill back differently every time: once a total, once 'about forty bucks,' once itemized. A human shrugs; a cash register can't function. Your code is the register.", position: "before" },
        { type: "warning", title: "Parsers fail silently", content: "A regex that grabs the wrong number doesn't throw an error. It quietly inserts bad data. Silent corruption is worse than a crash because you find out late, from an angry user.", position: "after" }
      ],
      concept_diagram: {
        title: "Where prose breaks a pipeline",
        steps: [
          { label: "Ask for data", desc: "You request a name and a total from the model." },
          { label: "Get prose back", desc: "The model answers in a friendly sentence." },
          { label: "Parse with regex", desc: "Brittle string logic tries to pull the values out." },
          { label: "Format drifts", desc: "Next reply is worded differently; the parser grabs the wrong thing." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why is free-text output a problem for an automated pipeline?",
          options: ["It uses too many tokens", "Its shape is unpredictable, so code can't reliably extract values", "It is always grammatically wrong"],
          correct_index: 1,
          explanation: "Pipelines need predictable, machine-readable shapes. Prose varies request to request, so parsers break."
        }
      ],
      quiz_questions: [
        {
          question: "What is the core mismatch behind broken parsing?",
          options: [
            "The model is too slow for real-time code",
            "The model optimizes for plausible prose, but code needs rigid structure",
            "The model only speaks English",
            "Regular expressions are deprecated"
          ],
          correct_index: 1,
          explanation: "LLMs are built to produce human-sounding text; pipelines need fixed shapes. Those goals conflict on every request."
        },
        {
          question: "Why is a regex that 'grabs the first number' especially dangerous?",
          options: [
            "It is slow to run",
            "It fails silently, inserting wrong data instead of crashing",
            "It only works on integers",
            "It requires an internet connection"
          ],
          correct_index: 1,
          explanation: "Silent failures corrupt data without an error, so the bug surfaces far downstream where it is hard to trace."
        },
        {
          question: "What is the real fix for brittle prose parsing?",
          options: [
            "Write a more clever regular expression",
            "Stop receiving prose; make the model emit structured data",
            "Ask the question twice and compare",
            "Lower the temperature to zero"
          ],
          correct_index: 1,
          explanation: "Rather than parsing English, you constrain the model to output a fixed structure (like JSON) in the first place."
        }
      ],
      participation_activities: [
        {
          activity_title: "Spot the brittle parser",
          questions: [
            { question: "A parser that extracts the wrong value usually crashes loudly so you notice immediately.", type: "true_false", correct_answer: "false", explanation: "Bad parsers often fail silently, inserting incorrect data without raising an error." },
            { question: "Output that a program can reliably index into is called ______ data.", type: "fill_in", correct_answer: "machine-readable", explanation: "Machine-readable structure is predictable enough for code to consume." }
          ]
        }
      ],
      starter_code: `# A model answered in prose. Try to pull out the total with brittle logic.
reply = "Sure! The total comes to about \\$42.50 (plus tax)."

# TODO: use a regex to grab the number after the dollar sign, then print it.
import re
print(reply)
`,
      solution_code: `import re
reply = "Sure! The total comes to about \\$42.50 (plus tax)."

match = re.search(r"\\$([0-9.]+)", reply)
total = float(match.group(1)) if match else None

print("extracted total:", total)
print("note: this breaks if the model rewords the sentence")
`,
      expected_output: `extracted total: 42.5
note: this breaks if the model rewords the sentence`,
      step_throughs: [
        {
          title: "how prose silently corrupts data",
          steps: [
            { label: "Ask for structured info", detail: "You want one clean number: the order total. Simple request.", code: 'ask = "What is the order total?"' },
            { label: "Model replies in prose", detail: "It answers like a human, wrapping the number in friendly words and an extra detail.", code: '"It is about \\$42.50, plus around \\$3 tax."' },
            { label: "Regex grabs the FIRST number", detail: "Your parser pulls the first dollar value it finds. Looks fine in testing.", code: 're.search(r"\\$([0-9.]+)", reply)  ->  "42.50"' },
            { label: "Reword breaks it", detail: "Next reply leads with the tax. The same regex now returns the wrong number, and nothing crashes.", code: '"Tax is \\$3.00; total \\$42.50."  ->  grabs 3.00' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model replies "The customer is Dana Lee." You need just the name in your database. Why is slicing the string at a fixed position a bad idea?',
          steps: [
            "Fixed-position slicing assumes the sentence always has the exact same wording and length.",
            'The next reply might be "Customer name: Dana Lee" or "That would be Dana Lee" — different offsets.',
            "Any wording change shifts where the name sits, so the slice grabs the wrong characters."
          ],
          output: "Because the wording is not fixed, position-based slicing breaks the moment the model rephrases."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You build a feature that reads an invoice total from a model and charges the card automatically. It passes every test, then in production a customer is charged \\$3 instead of \\$342. What most likely happened, and what is the structural fix?",
          steps: [
            'In testing, replies were tidy ("Total: \\$342.00") so the regex grabbed the right number.',
            'In production the model wrote "Tax \\$3, subtotal \\$339, total \\$342" and the regex matched the first dollar amount, \\$3.',
            "The parser failed silently — no crash — so the wrong charge went through.",
            "The structural fix is to never parse prose for money: require the model to return JSON like {\"total\": 342.00} so there is exactly one labeled field to read."
          ],
          output: "The regex matched the first of several numbers; the fix is to demand a labeled JSON field instead of parsing a sentence."
        }
      ],
      comparison_tables: [
        {
          title: "free text vs structured output for a pipeline",
          columns: ["Aspect", "Free text (prose)", "Structured output (JSON)"],
          rows: [
            { cells: ["Shape", "Varies every request", "Fixed, predictable keys"] },
            { cells: ["Extraction", "Brittle regex / slicing", "Direct key lookup"] },
            { cells: ["Failure mode", "Silent wrong values", "Loud, catchable errors"] },
            { cells: ["Fit for code", "Poor — meant for humans", "Strong — meant for machines"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good for humans vs good for a pipeline",
          bins: [
            { id: "human", label: "Good for a human reader" },
            { id: "code", label: "Good for a code pipeline" }
          ],
          items: [
            { id: "i1", text: '"The total comes to about forty-two fifty."', bin: "human" },
            { id: "i2", text: '{"total": 42.50}', bin: "code" },
            { id: "i3", text: '"Customer Dana Lee placed the order."', bin: "human" },
            { id: "i4", text: '{"customer": "Dana Lee"}', bin: "code" },
            { id: "i5", text: '"Honestly, it depends on the tax!"', bin: "human" },
            { id: "i6", text: '{"status": "paid", "amount": 42.5}', bin: "code" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a feature that parses model prose often work perfectly in a demo but fail once real users hit it?",
          sampleAnswer: "In a demo you only see a few replies, and they happen to be worded cleanly, so the parser grabs the right values. Real users trigger far more variety, and the model rewords its answers in ways the parser never anticipated. Because parsing failures are usually silent, the wrong data slips through unnoticed until something visibly breaks downstream — which is exactly when it is hardest to trace back to the prose."
        }
      ],
      hints: [
        "re.search returns a match object or None; guard against None before calling .group().",
        "The pattern looks for a dollar sign followed by digits and a dot.",
        "float() converts the captured string of digits into a number."
      ],
      challenge_title: "Count the parsing landmines",
      challenge_description: "Audit a batch of model replies and find which ones a naive 'grab the first dollar amount' parser would silently corrupt.",
      challenge_story: "You run the billing pipeline at an AI customer-support startup. The model answers refund questions in free text, and a regex downstream grabs the **first** dollar amount it sees and charges it. It worked in the demo. Then a reply said `Tax $3.00, subtotal $339.00, total $342.00` — and a customer got refunded **$3.00** instead of $342.00. No crash, no log, just a furious ticket.\n\nBefore you rip out the regex, you need to know how bad it is. Scan every reply in last night's batch and find which ones contain **more than one** dollar amount (the dangerous ones), and which single reply is the worst offender.",
      challenge_statement: "You are given a batch of `n` model replies, one per line. A **dollar amount** is a `$` immediately followed by a run of characters made up of digits, `.`, and `,`, where **at least one digit** appears in that run (so a bare `$` or `$.` does not count).\n\nA reply is **risky** if it contains **2 or more** dollar amounts, because a first-match parser could pick the wrong one.\n\nCompute:\n1. The number of risky replies.\n2. The 1-based index of the reply containing the **most** dollar amounts, and that count. If several replies tie for the most, report the one with the **smallest index**.",
      challenge_input_format: "The first line contains an integer `n`, the number of replies. Each of the next `n` lines is one reply (it may contain spaces and punctuation).",
      challenge_output_format: "Line 1: the number of risky replies (replies with 2+ dollar amounts).\nLine 2: two space-separated integers — the 1-based index of the reply with the most dollar amounts, and that maximum count.",
      challenge_constraints: [
        "1 <= n <= 1000",
        "Each reply line has length 0 to 500 characters.",
        "A dollar amount is `$` followed by one or more of the characters `0-9`, `.`, `,`, with at least one digit in that run.",
        "If no reply contains any dollar amount, the maximum count is 0 and the winning index is the first reply."
      ],
      challenge_examples: [
        {
          input: "2\nThe total is $42.50.\nTax $3.00, subtotal $339.00, total $342.00.",
          output: "1\n2 3",
          explanation: "Reply 1 has one amount ($42.50) so it is safe. Reply 2 has three amounts, making it risky and the worst offender with 3 amounts at index 2."
        },
        {
          input: "1\nYour refund of $9.99 is processed.",
          output: "0\n1 1",
          explanation: "A single amount means a first-match parser is safe. No risky replies; the only reply has the max count of 1."
        }
      ],
      challenge_notes: "Walk each line character by character. When you hit a `$`, scan the following digits/`.`/`,` and only count it if you saw at least one digit. Track risky replies and the running maximum together in one pass.",
      challenge_hints: [
        "You do not need regex — a simple left-to-right scan that reacts to `$` is enough and easier to reason about.",
        "Keep the max count and its index updated as you go; only replace the max when you find a strictly larger count, so ties keep the smaller index.",
        "Remember the 'at least one digit' rule — a stray `$` in prose like 'the $ sign' must not be counted."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # TODO: for each line, count dollar amounts ($ + digits/.,, with >=1 digit).
    # Count risky replies (2+ amounts) and track the worst offender.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    risky = 0
    worst_idx = 0
    worst_count = -1
    for i, line in enumerate(lines):
        count = 0
        j = 0
        L = len(line)
        while j < L:
            if line[j] == "$":
                k = j + 1
                seen_digit = False
                while k < L and (line[k].isdigit() or line[k] == "." or line[k] == ","):
                    if line[k].isdigit():
                        seen_digit = True
                    k += 1
                if seen_digit:
                    count += 1
                j = k
            else:
                j += 1
        if count > 1:
            risky += 1
        if count > worst_count:
            worst_count = count
            worst_idx = i
    print(risky)
    print(worst_idx + 1, worst_count)

main()
`,
      challenge_test_cases: [
        { input: "2\nThe total is $42.50.\nTax $3.00, subtotal $339.00, total $342.00.", expected_output: "1\n2 3", description: "Example 1: one risky reply; reply 2 has the most amounts." },
        { input: "1\nYour refund of $9.99 is processed.", expected_output: "0\n1 1", description: "Example 2: a single amount is safe to first-match parse." },
        { input: "1\nNo charges were applied to your account.", expected_output: "0\n1 0", description: "Edge: a reply with zero amounts still reports index 1 and count 0." },
        { input: "3\nPaid $5 and $6 today.\nClean line here.\nLater $1, $2, $3 owed.", expected_output: "2\n3 3", description: "Edge: two risky replies; reply 3 wins with 3 amounts." }
      ]
    },
    {
      id: "ai-10-l2",
      project_id: "ai-10",
      order: 2,
      title: "JSON Mode & Schemas",
      concept: "JSON",
      xp_reward: 10,
      explanation: `Add one parameter to your API call and the model can no longer answer in a chatty sentence. It must return valid **JSON**. That single flag turns the unreliable-prose problem from lesson 1 into a solved one — most of the time. The rest of the work is telling the model exactly what shape you want.

## What it is

**JSON** (JavaScript Object Notation) is a simple, universal format for structured data: keys mapped to values, with strings, numbers, booleans, lists, and nested objects. Every language can parse it in one line. It is the lingua franca between an LLM and your code.

**JSON mode** is a setting on modern model APIs that constrains the output so it is always syntactically valid JSON — no prose wrapper, no trailing commentary, no broken brackets. A **schema** goes further: it specifies the exact keys, their types, and which are required, so you get not just valid JSON but the *right* JSON.

## How it works

There are two levels of control, and you usually want both:

1. **Turn on JSON mode.** You pass something like \`response_format={"type": "json_object"}\`. The model's decoding is constrained so the output parses.
2. **Describe the shape in the prompt.** JSON mode alone guarantees valid JSON, not the keys you want. You still tell the model: "Return an object with keys name (string), age (integer), active (boolean)."
3. **Or attach a schema.** Newer APIs let you supply a JSON Schema and enforce it, so the keys and types are guaranteed, not merely requested.
4. **Parse with confidence.** Now \`json.loads(reply)\` succeeds and \`data["age"]\` is an integer you can trust.

Here is the difference in one snippet:

\`\`\`python
import json

# With JSON mode + a described schema, the model returns:
reply = '{"name": "Dana Lee", "age": 34, "active": true}'

data = json.loads(reply)   # one line, no regex, no guessing
print(data["name"], data["age"] + 1)  # 'Dana Lee 35'
\`\`\`

Note that JSON uses \`true\`/\`false\` (lowercase) and \`null\`, which \`json.loads\` converts into Python's \`True\`/\`False\`/\`None\`. That's the only gotcha most people hit.

## Why it matters

Schemas move you from hoping to knowing:

- **Valid by construction.** With JSON mode on, you stop writing defensive parsers for malformed brackets.
- **Self-documenting contracts.** A schema is a written agreement: "this endpoint always returns these fields." Your frontend, your database, and the model all share one source of truth.
- **Type guarantees.** \`age\` is an integer, not the string "thirty-four." You can do math without casting and crossing your fingers.

There's one honest caveat: JSON mode guarantees *syntax*, and a strict schema guarantees *keys and types*, but neither guarantees the *values are correct*. The model can still return a plausible-but-wrong age. That's a job for validation, two lessons from now.

## The mental model to keep

**JSON mode fixes the brackets; the schema fixes the shape.** You're handing the model a fill-in-the-blank form instead of a blank page — and forms are easy for code to read.`,
      key_terms: [
        { term: "JSON", definition: "A universal text format of keys and values that every programming language can parse in one line." },
        { term: "JSON mode", definition: "An API setting that constrains a model's output so it is always syntactically valid JSON." },
        { term: "Schema", definition: "A specification of the exact keys, types, and required fields the JSON must contain." },
        { term: "json.loads", definition: "The Python function that turns a JSON string into a usable dictionary or list." }
      ],
      callouts: [
        { type: "analogy", title: "A form, not a blank page", content: "Asking for prose is handing someone a blank page. JSON mode with a schema is handing them a form with labeled boxes. They can only fill in the boxes, so you always know where each answer lives.", position: "before" },
        { type: "tip", title: "JSON booleans are lowercase", content: "JSON uses true, false, and null. Python uses True, False, None. json.loads() converts automatically, but if you hand-write JSON, remember the lowercase or parsing fails.", position: "after" }
      ],
      concept_diagram: {
        title: "From request to trusted dictionary",
        steps: [
          { label: "Enable JSON mode", desc: "Set response_format so output is valid JSON." },
          { label: "Describe the shape", desc: "Name the keys and types you require." },
          { label: "Model returns JSON", desc: "A clean object with no prose wrapper." },
          { label: "Parse to a dict", desc: "json.loads gives you typed fields to use." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does turning on JSON mode guarantee?",
          options: ["That the values are factually correct", "That the output is syntactically valid JSON", "That the model uses fewer tokens"],
          correct_index: 1,
          explanation: "JSON mode guarantees valid JSON syntax. Correct keys come from a schema; correct values still need validation."
        }
      ],
      quiz_questions: [
        {
          question: "Why describe a schema in addition to enabling JSON mode?",
          options: [
            "JSON mode is too slow without a schema",
            "JSON mode guarantees valid JSON, but not which keys and types you get",
            "Schemas make the response shorter",
            "Without a schema the output is encrypted"
          ],
          correct_index: 1,
          explanation: "JSON mode fixes syntax; a schema pins down the exact keys, types, and required fields you need."
        },
        {
          question: "In JSON, how is a boolean true written?",
          options: [
            "True (capitalized, like Python)",
            "true (lowercase)",
            'the string "yes"',
            "1"
          ],
          correct_index: 1,
          explanation: "JSON booleans are lowercase true/false. json.loads converts them to Python's True/False."
        },
        {
          question: "What can a strict schema still NOT guarantee?",
          options: [
            "That the JSON parses",
            "That the required keys are present",
            "That the values are factually correct",
            "That the types match"
          ],
          correct_index: 2,
          explanation: "Schemas enforce shape and types, but a model can still fill a correctly-typed field with a wrong value. That needs validation."
        }
      ],
      participation_activities: [
        {
          activity_title: "JSON mode sense-check",
          questions: [
            { question: "JSON mode guarantees that the values in the response are factually correct.", type: "true_false", correct_answer: "false", explanation: "It only guarantees valid JSON syntax; correctness of values is a separate concern." },
            { question: "The Python function that converts a JSON string into a dictionary is json.______.", type: "fill_in", correct_answer: "loads", explanation: "json.loads parses a JSON string into Python objects." }
          ]
        }
      ],
      starter_code: `# The model returned valid JSON (thanks to JSON mode). Parse and use it.
import json
reply = '{"name": "Dana Lee", "age": 34, "active": true}'

# TODO: parse the JSON, then print the name and age + 1.
print(reply)
`,
      solution_code: `import json
reply = '{"name": "Dana Lee", "age": 34, "active": true}'

data = json.loads(reply)

print("name:", data["name"])
print("age next year:", data["age"] + 1)
print("active:", data["active"])
`,
      expected_output: `name: Dana Lee
age next year: 35
active: True`,
      step_throughs: [
        {
          title: "blank page to fill-in form",
          steps: [
            { label: "Default: blank page", detail: "Without JSON mode the model writes prose. The shape is whatever it feels like.", code: '"Dana is 34 and currently active."' },
            { label: "Enable JSON mode", detail: "One parameter forces the decoder to emit only valid JSON. No prose wrapper can sneak in.", code: 'response_format={"type": "json_object"}' },
            { label: "Describe the keys", detail: "You still spell out the form fields you want, so the model fills the right boxes.", code: 'keys: name (str), age (int), active (bool)' },
            { label: "Parse with one line", detail: "json.loads turns the string into a dict. Every field is typed and ready for code.", code: 'data = json.loads(reply)  ->  data["age"] == 34' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'The model returns \'{"city": "Paris", "population": 2100000}\'. How do you get the population as a number you can do math on?',
          steps: [
            "Call json.loads on the string to turn it into a Python dictionary.",
            'Index the dictionary with the key: data["population"].',
            "Because JSON numbers parse to Python ints/floats, the value is already numeric — no casting needed."
          ],
          output: 'data = json.loads(reply); data["population"] gives 2100000 as an int.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You enabled JSON mode but did NOT describe a schema. One call returns {\"name\": \"Dana\", \"age\": 34} and the next returns {\"full_name\": \"Dana Lee\", \"years\": 34}. Your code does data[\"name\"] and crashes on the second call. What went wrong and how do you fix it?",
          steps: [
            "JSON mode only guarantees valid JSON syntax, not which keys appear.",
            "Without a described schema, the model is free to invent different key names each time.",
            'The first response used "name"/"age"; the second used "full_name"/"years", so data["name"] raised a KeyError.',
            'Fix: pin the keys in the prompt or attach a JSON Schema so the response always uses "name" and "age".'
          ],
          output: "Unspecified keys drifted between calls; describe or enforce a schema so the key names are guaranteed."
        }
      ],
      comparison_tables: [
        {
          title: "three levels of output control",
          columns: ["Approach", "Guarantees valid JSON", "Guarantees keys/types", "Best for"],
          rows: [
            { cells: ["Plain prompt ('reply in JSON')", "No — may add prose", "No", "Quick experiments"] },
            { cells: ["JSON mode only", "Yes", "No — keys can drift", "Loose, exploratory output"] },
            { cells: ["JSON mode + enforced schema", "Yes", "Yes", "Production pipelines"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "valid JSON vs invalid JSON",
          bins: [
            { id: "valid", label: "Valid JSON" },
            { id: "invalid", label: "Invalid JSON" }
          ],
          items: [
            { id: "i1", text: '{"active": true}', bin: "valid" },
            { id: "i2", text: '{"active": True}', bin: "invalid" },
            { id: "i3", text: '{"age": 34}', bin: "valid" },
            { id: "i4", text: "Sure! Here is your JSON: {...}", bin: "invalid" },
            { id: "i5", text: '{"tags": ["a", "b"]}', bin: "valid" },
            { id: "i6", text: "{'name': 'Dana'}", bin: "invalid" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In one or two sentences: why is enabling JSON mode without describing a schema often not enough for a real pipeline?",
          sampleAnswer: "JSON mode only guarantees the syntax parses, not which keys or types appear, so the model can quietly use different field names from one call to the next. A pipeline that indexes a fixed key will crash or read the wrong field when the keys drift, which is why you also describe or enforce a schema to lock the shape down."
        }
      ],
      hints: [
        "import json, then call json.loads(reply) to get a dictionary.",
        "Access fields by key, like data['name'].",
        "JSON true becomes Python True after parsing, so printing active shows True."
      ],
      challenge_title: "Validate required keys",
      challenge_description: "Enforce a JSON schema's required keys across a batch of model responses and report exactly what each one is missing.",
      challenge_story: "Your extraction service asked the model for user records in JSON mode, but JSON mode only guarantees the output is **valid JSON** — not that it has the keys your database needs. Last week a response came back as the perfectly-valid array `[1, 2, 3]`, and a downstream `data['name']` lookup blew up a worker mid-batch.\n\nYou are adding a schema gate in front of the database writer. Given the list of required keys, every incoming record must be checked: is it even a JSON object? If so, does it carry every required key? Anything that fails gets logged precisely so the on-call engineer knows whether to re-prompt or page the model team.",
      challenge_statement: "You are given a list of **required keys** and a batch of `n` model responses, one per line.\n\nFor each response, in order, print exactly one verdict:\n- If the line is not valid JSON, **or** the parsed value is not a JSON object (e.g. an array or a number), print `INVALID_JSON`.\n- Otherwise, if the object is missing one or more required keys, print `MISSING ` followed by the missing keys **in the order they appear in the required-keys list**, space-separated.\n- Otherwise (all required keys present) print `OK`.\n\nAfter all `n` verdicts, print the number of responses that printed `OK`.",
      challenge_input_format: "Line 1: the required keys, space-separated (at least one key, no spaces inside a key).\nLine 2: an integer `n`, the number of responses.\nNext `n` lines: one JSON response each.",
      challenge_output_format: "`n` verdict lines (`OK`, `INVALID_JSON`, or `MISSING k1 k2 ...`), followed by one final line with the integer count of `OK` responses.",
      challenge_constraints: [
        "1 <= number of required keys <= 10",
        "1 <= n <= 1000",
        "Each response line is at most 2000 characters.",
        "Missing keys must be listed in the same order as the required-keys line.",
        "A valid JSON value that is not an object (array, string, number, etc.) counts as INVALID_JSON."
      ],
      challenge_examples: [
        {
          input: 'name age\n2\n{"name": "Dana", "age": 34}\n{"name": "Dana"}',
          output: "OK\nMISSING age\n1",
          explanation: "The first record has both required keys. The second is missing `age`. One record was OK."
        },
        {
          input: 'name age email\n3\n{not json}\n{"name": "X"}\n{"name": "Y", "age": 9, "email": "y@z.com"}',
          output: "INVALID_JSON\nMISSING age email\nOK\n1",
          explanation: "Record 1 fails to parse. Record 2 is missing two keys, listed in required order. Record 3 is complete."
        }
      ],
      challenge_notes: "Use `json.loads` inside a try/except for `ValueError`. After parsing, check `isinstance(obj, dict)` before looking for keys — JSON mode happily returns arrays and numbers that would crash a key lookup.",
      challenge_hints: [
        "Wrap `json.loads(line)` in try/except ValueError; a parse failure means `INVALID_JSON`.",
        "Even when JSON parses, confirm it is a dict — `[1, 2, 3]` is valid JSON but has no keys.",
        "Build the missing list by iterating the required-keys list (not the object's keys) so the order is deterministic."
      ],
      challenge_starter_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    required = data[0].split()
    n = int(data[1])
    responses = data[2:2 + n]
    # TODO: for each response, print OK / INVALID_JSON / MISSING ...
    # Then print how many were OK.

main()
`,
      challenge_solution_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    required = data[idx].split()
    idx += 1
    n = int(data[idx]); idx += 1
    valid = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        try:
            obj = json.loads(line)
            if not isinstance(obj, dict):
                raise ValueError
        except ValueError:
            print("INVALID_JSON")
            continue
        missing = [k for k in required if k not in obj]
        if missing:
            print("MISSING " + " ".join(missing))
        else:
            print("OK")
            valid += 1
    print(valid)

main()
`,
      challenge_test_cases: [
        { input: 'name age\n2\n{"name": "Dana", "age": 34}\n{"name": "Dana"}', expected_output: "OK\nMISSING age\n1", description: "Example 1: one complete record, one missing a key." },
        { input: 'name age email\n3\n{not json}\n{"name": "X"}\n{"name": "Y", "age": 9, "email": "y@z.com"}', expected_output: "INVALID_JSON\nMISSING age email\nOK\n1", description: "Example 2: bad JSON, multi-missing in order, and a complete record." },
        { input: 'name\n1\n[1, 2, 3]', expected_output: "INVALID_JSON\n0", description: "Edge: valid JSON that is an array, not an object, is rejected." }
      ]
    },
    {
      id: "ai-10-l3",
      project_id: "ai-10",
      order: 3,
      title: "Function Calling for Structure",
      concept: "ToolSchema",
      xp_reward: 10,
      explanation: `Instead of asking a model "please reply in JSON and pretty please use these keys," you hand it a **function** and say: "call this." The model responds not with prose, not even with loose JSON, but with the exact arguments that function expects. Function calling is JSON schemas with a steering wheel attached — and it's how serious AI features get reliable structure.

## What it is

**Function calling** (also called **tool use**) lets you describe a function to the model — its name, what it does, and a schema for its parameters. The model, instead of answering in text, returns a structured request to call that function with specific arguments. You define the shape; the model fills it.

The description of that function and its parameters is the **tool schema**. It is a JSON Schema that names each argument, gives its type, and marks which are required. The model treats it as a binding contract for how to respond.

## How it works

The flow has a clean shape:

1. **You define a tool.** A name, a plain-language description of when to use it, and a parameter schema with typed fields.
2. **You send it with the prompt.** "Extract the order details from this email" plus the \`record_order\` tool.
3. **The model returns a tool call.** Not prose — a structured object: the tool name and an arguments object matching your schema.
4. **Your code runs (or just reads) it.** You parse the arguments straight into your function, database, or API.

Here is a tool definition and the structured call it produces:

\`\`\`python
tool = {
    "name": "record_order",
    "description": "Save a customer order to the database.",
    "parameters": {
        "type": "object",
        "properties": {
            "customer": {"type": "string"},
            "total": {"type": "number"},
        },
        "required": ["customer", "total"],
    },
}

# The model replies with a structured call, not a sentence:
tool_call = {"name": "record_order",
             "arguments": {"customer": "Dana Lee", "total": 42.50}}
\`\`\`

The arguments arrive already shaped to your schema, so you skip the "describe JSON in the prompt and hope" step entirely.

## Why it matters

Function calling is the backbone of agents and real integrations:

- **Tighter than free JSON mode.** The schema is a first-class part of the request, so the model is steered harder toward the exact arguments, not just any valid JSON.
- **It maps to real actions.** A tool call lines up one-to-one with calling your code: send an email, query a database, charge a card. This is what turns a chatbot into an agent.
- **Multiple tools, the model picks.** Give it \`record_order\`, \`issue_refund\`, and \`check_status\`; it chooses the right one and fills the right arguments based on the user's request.

The same honest caveat from JSON mode applies: the schema guarantees the *shape* of the arguments, not that the *values* are right. \`total\` will be a number — but it could be the wrong number. Validate before you act on anything that matters.

## The mental model to keep

**A tool schema is a job application form for the model.** You hand it the form (name, fields, types); it fills in the blanks with structured arguments. You never read prose — you read a completed form your code already knows how to process.`,
      key_terms: [
        { term: "Function calling", definition: "Describing a function to the model so it responds with structured arguments to call it, instead of prose." },
        { term: "Tool use", definition: "Another name for function calling: giving the model tools it can invoke with structured inputs." },
        { term: "Tool schema", definition: "The JSON Schema describing a function's name, parameters, types, and required fields." },
        { term: "Tool call", definition: "The structured object the model returns: the chosen tool's name plus an arguments object matching the schema." }
      ],
      callouts: [
        { type: "analogy", title: "A job application form", content: "A tool schema is a form with labeled, typed fields. The model can only fill in the blanks you defined, so what comes back is a completed form your code already knows how to read — never a free-form essay.", position: "before" },
        { type: "insight", title: "Tool calls map to real actions", content: "A function call from the model lines up one-to-one with calling your code. That's the leap from a chatbot that talks to an agent that does things.", position: "after" }
      ],
      concept_diagram: {
        title: "How a tool call replaces prose",
        steps: [
          { label: "Define the tool", desc: "Name, description, and a typed parameter schema." },
          { label: "Send with the prompt", desc: "The request includes the user's text and the tool." },
          { label: "Model returns a call", desc: "A structured tool name plus arguments object." },
          { label: "Run or read it", desc: "Parse the arguments straight into your code." }
        ]
      },
      inline_quizzes: [
        {
          question: "When a model uses function calling, what does it return?",
          options: ["A prose explanation of what to do", "A structured tool name plus an arguments object", "A list of every possible answer"],
          correct_index: 1,
          explanation: "It returns a structured call: the chosen tool and arguments matching your schema, not free text."
        }
      ],
      quiz_questions: [
        {
          question: "What is the tool schema in function calling?",
          options: [
            "A summary the model writes after answering",
            "A JSON Schema describing the function's name, parameters, types, and required fields",
            "The model's internal weights",
            "A log of past tool calls"
          ],
          correct_index: 1,
          explanation: "The tool schema specifies the contract: what the function is called, what arguments it takes, and their types."
        },
        {
          question: "How is function calling tighter than plain JSON mode?",
          options: [
            "It runs faster",
            "The schema is a first-class part of the request, steering the model to exact arguments",
            "It never makes mistakes",
            "It uses no tokens"
          ],
          correct_index: 1,
          explanation: "Because the parameter schema is built into the request, the model is pushed toward the specific argument shape, not just any valid JSON."
        },
        {
          question: "If you give the model three tools, what does it do?",
          options: [
            "Calls all three every time",
            "Picks the appropriate tool and fills its arguments based on the request",
            "Refuses to answer",
            "Returns prose instead"
          ],
          correct_index: 1,
          explanation: "The model selects the tool that matches the user's intent and supplies arguments matching that tool's schema."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tool calling check",
          questions: [
            { question: "Function calling guarantees that the argument values the model supplies are factually correct.", type: "true_false", correct_answer: "false", explanation: "It guarantees the shape and types of the arguments, not that the values are right." },
            { question: "Another common name for function calling is ______ use.", type: "fill_in", correct_answer: "tool", explanation: "Function calling and tool use refer to the same mechanism." }
          ]
        }
      ],
      starter_code: `# The model returned a structured tool call. Read its arguments into your code.
tool_call = {
    "name": "record_order",
    "arguments": {"customer": "Dana Lee", "total": 42.50},
}

# TODO: pull out the customer and total from the arguments and print them.
print(tool_call["name"])
`,
      solution_code: `tool_call = {
    "name": "record_order",
    "arguments": {"customer": "Dana Lee", "total": 42.50},
}

args = tool_call["arguments"]
print("tool:", tool_call["name"])
print("customer:", args["customer"])
print("total:", args["total"])
`,
      expected_output: `tool: record_order
customer: Dana Lee
total: 42.5`,
      step_throughs: [
        {
          title: "from email to a structured action",
          steps: [
            { label: "Define the tool", detail: "You spell out the function name, what it does, and a typed parameter schema with required fields.", code: 'record_order(customer: str, total: number)' },
            { label: "Send it with the email", detail: "The request carries the messy customer email plus the tool definition.", code: '"Hi, Dana Lee here, my order was 42.50" + tool' },
            { label: "Model returns a tool call", detail: "Instead of summarizing in prose, it emits the tool name and arguments shaped to your schema.", code: '{"name": "record_order", "arguments": {...}}' },
            { label: "Run the function", detail: "Your code reads the arguments directly and performs the real action — a database insert, here.", code: 'db.insert(customer="Dana Lee", total=42.5)' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model returns the tool call {"name": "send_email", "arguments": {"to": "a@b.com", "subject": "Hi"}}. How do you get the subject in your code?',
          steps: [
            'The arguments live in the "arguments" key of the tool call object.',
            'Index into it: tool_call["arguments"].',
            'Then read the field you want: ["subject"], which gives "Hi".'
          ],
          output: 'tool_call["arguments"]["subject"] returns "Hi".'
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You expose two tools, issue_refund(order_id, amount) and check_status(order_id). A user writes 'Where is order 88? And refund order 90 for \\$10.' Describe what well-designed function calling should produce and one risk you must still guard against.",
          steps: [
            "The model should recognize two distinct intents in one message: a status check and a refund.",
            'It selects check_status with arguments {"order_id": 88} for the first intent.',
            'It selects issue_refund with arguments {"order_id": 90, "amount": 10} for the second intent.',
            "The schema guarantees the arguments are well-typed, but NOT that order 90 is actually refundable or that \\$10 is the right amount.",
            "So before executing the refund, your code must still validate the order exists, is eligible, and the amount is within policy."
          ],
          output: "Two correctly-typed tool calls (check_status and issue_refund), but you must still validate eligibility and amounts before acting."
        }
      ],
      comparison_tables: [
        {
          title: "prompt-for-JSON vs function calling",
          columns: ["Aspect", "Ask for JSON in the prompt", "Function calling"],
          rows: [
            { cells: ["Schema location", "Buried in prompt text", "First-class part of the request"] },
            { cells: ["Maps to an action", "No, you wire it manually", "Yes, one-to-one with your function"] },
            { cells: ["Multiple options", "Awkward to express", "Model picks among several tools"] },
            { cells: ["Steering strength", "Soft suggestion", "Hard contract on argument shape"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "part of the tool schema vs part of the model's response",
          bins: [
            { id: "schema", label: "You define (tool schema)" },
            { id: "response", label: "Model produces (tool call)" }
          ],
          items: [
            { id: "i1", text: "The function name and description", bin: "schema" },
            { id: "i2", text: "The list of typed parameters", bin: "schema" },
            { id: "i3", text: "Which parameters are required", bin: "schema" },
            { id: "i4", text: "The chosen tool for this request", bin: "response" },
            { id: "i5", text: "The actual argument values", bin: "response" },
            { id: "i6", text: "Which tool fits the user's intent", bin: "response" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is function calling described as the bridge from a chatbot to an agent?",
          sampleAnswer: "A chatbot only produces text for a human to read and act on, but a tool call from the model maps one-to-one onto running real code — sending an email, querying a database, issuing a refund. By defining tools and letting the model choose and fill them, you let the model trigger actions directly instead of just describing them, which is exactly what turns a conversational model into an agent that does things in the world."
        }
      ],
      hints: [
        "The arguments are nested inside tool_call under the 'arguments' key.",
        "Store tool_call['arguments'] in a variable to make the field access cleaner.",
        "Print the customer and total by indexing that arguments dictionary."
      ],
      challenge_title: "Route the right tool",
      challenge_description: "Build the dispatcher that turns a model's function calls into real, allow-listed actions — and refuses anything it doesn't recognize.",
      challenge_story: "Your support agent finally graduated from a chatbot that *talks* to an agent that *acts*. The model emits **function calls** — structured `{name, arguments}` objects — and your dispatcher runs the matching code. You expose exactly two tools: `issue_refund(order_id, amount_cents)` and `check_status(order_id)`.\n\nBut the model is not always well-behaved: a jailbreak attempt or a hallucination can produce a call to a tool you never defined, like `delete_db`. Your dispatcher is the security boundary. It must execute only the tools on the allow-list, reject everything else, and keep a running tally of how much money it actually refunded — money is in **integer cents** so there is never a float to round.",
      challenge_statement: "You are given `n` function calls from the model, one per line, each a JSON object with a `name` and an `arguments` object. Process them in order:\n\n- If `name` is `issue_refund`, execute it: print `REFUND order O amount C` where `O` is `arguments.order_id` and `C` is `arguments.amount_cents`. Add `C` to the running refund total.\n- If `name` is `check_status`, execute it: print `STATUS order O` where `O` is `arguments.order_id`.\n- For any other `name`, reject it: print `REJECT name` (the offending tool name). Do not execute it.\n\nAfter all calls, print two space-separated integers: the number of calls **executed** (refund or status, not rejected) and the **total cents refunded**.",
      challenge_input_format: "Line 1: an integer `n`, the number of function calls.\nNext `n` lines: one JSON object each, with keys `name` (string) and `arguments` (object). `issue_refund` arguments contain integer `order_id` and `amount_cents`; `check_status` arguments contain integer `order_id`.",
      challenge_output_format: "One line per call (`REFUND ...`, `STATUS ...`, or `REJECT ...`), then a final line with two space-separated integers: executed-count and total-cents-refunded.",
      challenge_constraints: [
        "1 <= n <= 1000",
        "0 <= order_id <= 10^9",
        "0 <= amount_cents <= 10^9",
        "Only `issue_refund` and `check_status` are on the allow-list; every other name is rejected and never executed.",
        "All money is in integer cents — no floating point anywhere."
      ],
      challenge_examples: [
        {
          input: '2\n{"name": "issue_refund", "arguments": {"order_id": 90, "amount_cents": 1000}}\n{"name": "check_status", "arguments": {"order_id": 88}}',
          output: "REFUND order 90 amount 1000\nSTATUS order 88\n2 1000",
          explanation: "Both tools are allow-listed and execute. Two calls executed, 1000 cents refunded."
        },
        {
          input: '3\n{"name": "issue_refund", "arguments": {"order_id": 5, "amount_cents": 250}}\n{"name": "delete_db", "arguments": {}}\n{"name": "issue_refund", "arguments": {"order_id": 7, "amount_cents": 99}}',
          output: "REFUND order 5 amount 250\nREJECT delete_db\nREFUND order 7 amount 99\n2 349",
          explanation: "The `delete_db` call is not on the allow-list, so it is rejected and not counted. Two refunds executed totaling 349 cents."
        }
      ],
      challenge_notes: "The allow-list pattern is the whole point of safe tool use: the model proposes, your dispatcher disposes. Never `eval` or dynamically dispatch on a model-supplied name — branch explicitly on the names you trust.",
      challenge_hints: [
        "Parse each line with `json.loads`, then branch on `call['name']`.",
        "Keep two accumulators: a count of executed calls and a sum of refunded cents.",
        "Anything not matching your two known names falls through to the REJECT branch — and must not touch the accumulators."
      ],
      challenge_starter_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: route each call to REFUND / STATUS / REJECT,
    # tally executed count and total cents refunded.

main()
`,
      challenge_solution_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    executed = 0
    refunded_cents = 0
    for i in range(1, n + 1):
        call = json.loads(data[i])
        name = call["name"]
        args = call["arguments"]
        if name == "issue_refund":
            order = args["order_id"]
            cents = args["amount_cents"]
            refunded_cents += cents
            executed += 1
            print(f"REFUND order {order} amount {cents}")
        elif name == "check_status":
            order = args["order_id"]
            executed += 1
            print(f"STATUS order {order}")
        else:
            print(f"REJECT {name}")
    print(f"{executed} {refunded_cents}")

main()
`,
      challenge_test_cases: [
        { input: '2\n{"name": "issue_refund", "arguments": {"order_id": 90, "amount_cents": 1000}}\n{"name": "check_status", "arguments": {"order_id": 88}}', expected_output: "REFUND order 90 amount 1000\nSTATUS order 88\n2 1000", description: "Example 1: both allow-listed tools execute." },
        { input: '3\n{"name": "issue_refund", "arguments": {"order_id": 5, "amount_cents": 250}}\n{"name": "delete_db", "arguments": {}}\n{"name": "issue_refund", "arguments": {"order_id": 7, "amount_cents": 99}}', expected_output: "REFUND order 5 amount 250\nREJECT delete_db\nREFUND order 7 amount 99\n2 349", description: "Example 2: an unknown tool is rejected, not executed." },
        { input: '1\n{"name": "check_status", "arguments": {"order_id": 42}}', expected_output: "STATUS order 42\n1 0", description: "Edge: a status-only batch refunds zero cents." }
      ]
    },
    {
      id: "ai-10-l4",
      project_id: "ai-10",
      order: 4,
      title: "Validating & Repairing Output",
      concept: "Validation",
      xp_reward: 10,
      explanation: `JSON mode gave you valid brackets. A schema gave you the right keys. Function calling gave you typed arguments. And the model can *still* hand you \`{"age": -7}\` or \`{"email": "not-an-email"}\` with a perfectly straight face. The last line of defense is **validation**: checking that the values themselves make sense before your pipeline acts on them.

## What it is

**Validation** is verifying that structured output satisfies your real-world rules — not just that it parses. Syntax is "is this valid JSON?" Schema is "are the keys and types right?" Validation is "are the *values* actually acceptable?" An age must be positive. An email must contain an "@". A status must be one of a known set.

When validation fails, you have a choice: **reject** the output, or **repair** it — fix it programmatically, or send it back to the model with the error and ask for a corrected version.

## How it works

A robust structured-output step has layers, each catching what the last can't:

1. **Parse.** \`json.loads\` — does it parse at all? Wrap in try/except.
2. **Check the shape.** Are all required keys present, with the right types?
3. **Check the values.** Apply business rules: ranges, allowed sets, formats, cross-field logic.
4. **Repair or reject.** If something fails, either fix it, drop the record, or re-prompt the model with the specific error.

Here is a compact validator:

\`\`\`python
def validate(user):
    errors = []
    if not isinstance(user.get("age"), int) or user["age"] < 0:
        errors.append("age must be a non-negative integer")
    if "@" not in user.get("email", ""):
        errors.append("email looks invalid")
    return errors

bad = {"age": -7, "email": "not-an-email"}
print(validate(bad))  # ['age must be a non-negative integer', 'email looks invalid']
\`\`\`

The **repair loop** is the powerful part: if \`validate\` returns errors, you send the model a follow-up — "Your last output had these problems: ... Return corrected JSON." Because the model now sees the exact failure, it usually fixes it on the second try. Libraries automate this, but the idea is just: validate, and on failure, feed the error back.

## Why it matters

Validation is the difference between a toy and a system you can trust with real data:

- **It catches plausible-but-wrong values.** Schemas can't tell that an age of 200 is nonsense. Your business rules can.
- **It fails loudly and early.** A rejected record raises a clear error at the boundary, instead of silently poisoning a database three steps downstream.
- **Repair makes it self-healing.** Instead of crashing on a bad response, the pipeline asks the model to try again with feedback, recovering from the occasional miss automatically.

The mindset: **never trust model output, even when it's well-formed.** Treat it like input from a stranger on the internet — because in effect, that's what it is.

## The mental model to keep

**Syntax, shape, then sense.** JSON mode and schemas handle the first two; only your validation handles the third. Check the values, and when they fail, repair or reject — never blindly act.`,
      key_terms: [
        { term: "Validation", definition: "Checking that structured output satisfies real-world value rules, not just that it parses or matches a schema." },
        { term: "Repair loop", definition: "Sending failed output back to the model with the specific error so it can return a corrected version." },
        { term: "Business rule", definition: "A value constraint from your domain, like an age being non-negative or a status being in an allowed set." },
        { term: "Reject", definition: "Discarding output that fails validation rather than acting on bad data." }
      ],
      callouts: [
        { type: "warning", title: "Well-formed is not the same as correct", content: "A schema can hand you {\"age\": 200, \"email\": \"x\"} that parses perfectly and matches every type. Only your value checks know that an age of 200 and a missing @ are nonsense.", position: "before" },
        { type: "tip", title: "Feed the error back", content: "When validation fails, re-prompt the model with the exact error message. Seeing the specific problem, it usually returns a corrected response on the next try.", position: "after" }
      ],
      concept_diagram: {
        title: "The validation funnel",
        steps: [
          { label: "Parse", desc: "Does it load as JSON at all? Wrap in try/except." },
          { label: "Check shape", desc: "Required keys present with correct types?" },
          { label: "Check values", desc: "Ranges, allowed sets, and formats satisfied?" },
          { label: "Repair or reject", desc: "Fix it, re-prompt, or drop the bad record." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does validation check that a schema cannot?",
          options: ["That the JSON parses", "That the values satisfy real-world rules", "That the keys have the right names"],
          correct_index: 1,
          explanation: "Schemas enforce shape and types; validation enforces that the actual values make sense (ranges, formats, allowed sets)."
        }
      ],
      quiz_questions: [
        {
          question: "Why is well-formed JSON still not enough to trust?",
          options: [
            "JSON is always slow to parse",
            "The values can be plausible but wrong, which schemas don't catch",
            "JSON cannot store numbers",
            "Models never return valid JSON"
          ],
          correct_index: 1,
          explanation: "Validity and correct types say nothing about whether an age of 200 or a malformed email is acceptable. Value rules catch that."
        },
        {
          question: "What is a repair loop?",
          options: [
            "Restarting the whole program when JSON fails",
            "Re-prompting the model with the specific error so it returns corrected output",
            "Deleting the database and starting over",
            "Lowering the temperature to zero"
          ],
          correct_index: 1,
          explanation: "On a validation failure you feed the exact error back to the model, which usually fixes it on the next attempt."
        },
        {
          question: "What mindset should you bring to model output, even when well-formed?",
          options: [
            "Trust it fully to save time",
            "Treat it like input from a stranger and validate before acting",
            "Assume it is always wrong and discard it",
            "Only check the first field"
          ],
          correct_index: 1,
          explanation: "Model output is untrusted input. Validate values at the boundary before letting them into your system."
        }
      ],
      participation_activities: [
        {
          activity_title: "Validation check",
          questions: [
            { question: "If model output matches your schema's types, you can safely skip checking the values.", type: "true_false", correct_answer: "false", explanation: "Correct types do not guarantee correct values; an age of 200 is well-typed but invalid." },
            { question: "Sending a failed response back to the model with the error so it can fix it is called a ______ loop.", type: "fill_in", correct_answer: "repair", explanation: "The repair loop re-prompts with the specific validation error." }
          ]
        }
      ],
      starter_code: `# Validate a parsed user record against real-world rules.
user = {"age": -7, "email": "not-an-email"}

# TODO: build an errors list. age must be a non-negative int; email must contain '@'.
errors = []
print(user)
`,
      solution_code: `user = {"age": -7, "email": "not-an-email"}

errors = []
if not isinstance(user.get("age"), int) or user["age"] < 0:
    errors.append("age must be a non-negative integer")
if "@" not in user.get("email", ""):
    errors.append("email looks invalid")

print("errors:", errors)
print("valid:", len(errors) == 0)
`,
      expected_output: `errors: ['age must be a non-negative integer', 'email looks invalid']
valid: False`,
      step_throughs: [
        {
          title: "syntax, shape, then sense",
          steps: [
            { label: "Parse the JSON", detail: "First just confirm it loads. Malformed JSON is caught here before anything else runs.", code: 'data = json.loads(reply)  # try/except around this' },
            { label: "Check the shape", detail: "Confirm required keys exist with the right types. A missing key or wrong type stops the pipeline here.", code: 'assert isinstance(data["age"], int)' },
            { label: "Check the values", detail: "Now apply business rules. The age is an int, but -7 violates the non-negative rule.", code: 'data["age"] < 0  ->  invalid' },
            { label: "Repair or reject", detail: "Feed the error back to the model for a corrected response, or drop the record. Never act on bad values.", code: 're_prompt(error="age must be >= 0")' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model returns {"status": "shippd"} but your system only accepts "pending", "shipped", or "delivered". How should validation handle this?',
          steps: [
            'Define the allowed set: {"pending", "shipped", "delivered"}.',
            'Check membership: "shippd" is not in the allowed set, so it fails validation.',
            "Reject the record or re-prompt the model, telling it the value must be one of the allowed statuses."
          ],
          output: '"shippd" is not in the allowed set, so validation fails and you reject or re-prompt.'
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You extract events with start_date and end_date. A response passes JSON mode and the schema (both are valid date strings), but end_date is before start_date. Why didn't earlier layers catch it, and how do you design the validation and repair?",
          steps: [
            "JSON mode only checked syntax; the schema only checked that both fields are strings of the right type.",
            "Neither layer understands the cross-field rule that an end must come after a start — that is domain logic.",
            "Add a value check that parses both dates and asserts end_date >= start_date.",
            "On failure, re-prompt the model with the specific error: 'end_date precedes start_date; correct the dates.'",
            "If repair still fails after a retry or two, reject the record so bad data never enters the pipeline."
          ],
          output: "Cross-field logic is your job: validate end_date >= start_date, then repair via re-prompt or reject after retries."
        }
      ],
      comparison_tables: [
        {
          title: "three layers of checking",
          columns: ["Layer", "Question it answers", "Caught example"],
          rows: [
            { cells: ["Syntax (JSON mode)", "Does it parse?", "Missing closing brace"] },
            { cells: ["Shape (schema)", "Right keys and types?", '"age" sent as a string'] },
            { cells: ["Sense (validation)", "Are the values acceptable?", '"age": 200 or end before start'], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "schema catches it vs only validation catches it",
          bins: [
            { id: "schema", label: "Schema catches it" },
            { id: "validation", label: "Only validation catches it" }
          ],
          items: [
            { id: "i1", text: 'A required "email" key is missing', bin: "schema" },
            { id: "i2", text: '"age" is the string "old" not a number', bin: "schema" },
            { id: "i3", text: '"age" is -7', bin: "validation" },
            { id: "i4", text: '"email" is "not-an-email" (no @)', bin: "validation" },
            { id: "i5", text: '"status" is "shippd" not in the allowed set', bin: "validation" },
            { id: "i6", text: "end_date comes before start_date", bin: "validation" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why should you treat well-formed model output like untrusted input from a stranger?",
          sampleAnswer: "The model produces plausible text, not verified truth, so even output that parses cleanly and matches every type can carry nonsensical values like a negative age or a date range that runs backwards. Just as you would never insert a stranger's web-form submission into a database without checking it, you validate model output against your real business rules at the boundary, and repair or reject it before it can poison anything downstream."
        }
      ],
      hints: [
        "Use isinstance(value, int) to confirm a field is really an integer before comparing it.",
        "user.get('email', '') gives a safe default so the 'in' check never errors on a missing key.",
        "Append a clear message to errors for each rule that fails, then check if the list is empty."
      ],
      challenge_title: "Validate with allowed values",
      challenge_description: "Catch the orders that parse perfectly but make no sense — wrong totals, made-up statuses — before they poison your database.",
      challenge_story: "Schema validation got you well-formed JSON, but well-formed is not the same as correct. The model can hand you `{\"total\": 0, \"status\": \"shippd\"}` — valid JSON, right types-ish, and total nonsense. A $0 order and a typo'd status will sail straight past a parser and corrupt your analytics.\n\nYou are writing the **business-rules gate** that runs after parsing. Each order must have a `total` that is a positive number and a `status` drawn from a fixed allow-list. Tricky part: JSON booleans parse to Python `True`/`False`, which are technically integers — `True` must **not** count as a valid total. The gate accepts clean orders, rejects the rest with a precise reason, and reports the acceptance rate.",
      challenge_statement: "You are given `n` orders, one JSON object per line. For each order, in order, apply two rules:\n1. `total` must be a number (int or float) **greater than 0**. A boolean is **not** a valid number here.\n2. `status` must be exactly one of `pending`, `shipped`, `delivered`.\n\nFor each order print one line:\n- If it passes both rules: `ACCEPT i` (where `i` is the 1-based order index).\n- Otherwise: `REJECT i: ` followed by the failed-rule messages joined by `; `, in this fixed order — first the total message `total must be a positive number` (if total failed), then the status message `status must be one of pending, shipped, delivered` (if status failed).\n\nAfter all orders, print `a/n` where `a` is the number of accepted orders and `n` is the total.",
      challenge_input_format: "Line 1: an integer `n`. Next `n` lines: one JSON object each, with keys `total` and `status` (a key may be present with a wrong-typed or out-of-range value).",
      challenge_output_format: "`n` lines of `ACCEPT i` or `REJECT i: <messages>`, then a final line `a/n` (accepted over total).",
      challenge_constraints: [
        "1 <= n <= 1000",
        "Allowed statuses are exactly: pending, shipped, delivered.",
        "`total` must be int or float and strictly greater than 0; a JSON boolean (Python bool) is NOT accepted as a number.",
        "When both rules fail, the total message comes first, then the status message, joined by '; '.",
        "Each line is at most 2000 characters."
      ],
      challenge_examples: [
        {
          input: '2\n{"total": 0, "status": "shippd"}\n{"total": 42.5, "status": "shipped"}',
          output: "REJECT 1: total must be a positive number; status must be one of pending, shipped, delivered\nACCEPT 2\n1/2",
          explanation: "Order 1 fails both rules (total 0, status typo). Order 2 is clean. One of two accepted."
        },
        {
          input: '3\n{"total": 1, "status": "pending"}\n{"total": 10, "status": "shipped"}\n{"total": 99.99, "status": "delivered"}',
          output: "ACCEPT 1\nACCEPT 2\nACCEPT 3\n3/3",
          explanation: "Every order satisfies both rules, so all three are accepted."
        }
      ],
      challenge_notes: "Guard the total check with `isinstance(total, bool)` first: in Python `True == 1`, so without the bool guard a status flag would sneak through as a valid total. This exact trap appears constantly in real validators.",
      challenge_hints: [
        "Use `order.get('total')` and `order.get('status')` so a missing key becomes `None` instead of a KeyError.",
        "For the total: reject if it is not an int/float, is a bool, or is <= 0.",
        "Append messages in the fixed order (total, then status) and join with '; ' only the ones that failed."
      ],
      challenge_starter_code: `import sys, json

ALLOWED = ["pending", "shipped", "delivered"]

def validate(order):
    errors = []
    # TODO: rule 1 - total is a positive number (not a bool)
    # TODO: rule 2 - status is in ALLOWED
    return errors

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: print ACCEPT/REJECT per order, then accepted/total.

main()
`,
      challenge_solution_code: `import sys, json

ALLOWED = ["pending", "shipped", "delivered"]

def validate(order):
    errors = []
    total = order.get("total")
    if not isinstance(total, (int, float)) or isinstance(total, bool) or total <= 0:
        errors.append("total must be a positive number")
    status = order.get("status")
    if status not in ALLOWED:
        errors.append("status must be one of pending, shipped, delivered")
    return errors

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    accepted = 0
    for i in range(1, n + 1):
        order = json.loads(data[i])
        errors = validate(order)
        if errors:
            print(f"REJECT {i}: " + "; ".join(errors))
        else:
            print(f"ACCEPT {i}")
            accepted += 1
    print(f"{accepted}/{n}")

main()
`,
      challenge_test_cases: [
        { input: '2\n{"total": 0, "status": "shippd"}\n{"total": 42.5, "status": "shipped"}', expected_output: "REJECT 1: total must be a positive number; status must be one of pending, shipped, delivered\nACCEPT 2\n1/2", description: "Example 1: one order fails both rules, one passes." },
        { input: '3\n{"total": 1, "status": "pending"}\n{"total": 10, "status": "shipped"}\n{"total": 99.99, "status": "delivered"}', expected_output: "ACCEPT 1\nACCEPT 2\nACCEPT 3\n3/3", description: "Example 2: all orders valid." },
        { input: '1\n{"total": true, "status": "pending"}', expected_output: "REJECT 1: total must be a positive number\n0/1", description: "Edge: a JSON boolean total is rejected despite True == 1." }
      ]
    },
    {
      id: "ai-10-l5",
      project_id: "ai-10",
      order: 5,
      title: "Building an Extraction Pipeline",
      concept: "Extraction",
      xp_reward: 10,
      explanation: `Now assemble the whole module into one real thing: a pipeline that takes a messy paragraph of customer email and emits a clean, validated record ready for a database. This is **extraction** — pulling structured fields out of unstructured text — and it is the single most common production use of structured outputs.

## What it is

An **extraction pipeline** is an end-to-end flow: unstructured input goes in, a validated structured record comes out. The model does the understanding; the surrounding code enforces the contract. You've built every piece in this module — extraction is where they click together into a system you can trust.

The shape of the data you want is the **target schema**. The pipeline's whole job is to fill that schema from free text and refuse to emit anything that doesn't satisfy it.

## How it works

The pipeline chains the lessons in order:

1. **Define the target schema.** Decide the exact fields: \`name\` (string), \`email\` (string), \`order_total\` (number).
2. **Prompt with structure enforced.** Use JSON mode or function calling so the model returns JSON shaped to that schema, not prose (lessons 2 and 3).
3. **Parse.** \`json.loads\` the response inside a try/except (lesson 2).
4. **Validate the values.** Apply business rules and reject or repair on failure (lesson 4).
5. **Emit or re-prompt.** A clean record flows downstream; a failed one loops back to the model with the error.

Here is the spine of it:

\`\`\`python
import json

def extract(raw_text, model_reply):
    try:
        data = json.loads(model_reply)
    except ValueError:
        return {"ok": False, "error": "not valid JSON"}

    errors = []
    if not data.get("name"):
        errors.append("missing name")
    if "@" not in data.get("email", ""):
        errors.append("bad email")
    if not isinstance(data.get("order_total"), (int, float)):
        errors.append("order_total not a number")

    if errors:
        return {"ok": False, "error": "; ".join(errors)}
    return {"ok": True, "record": data}
\`\`\`

In production the model call sits where \`model_reply\` comes from, and a failure path re-prompts with the error string. But the architecture is exactly this: enforce shape on the way out of the model, enforce sense on the way into your system.

## Why it matters

Extraction is everywhere once you start looking:

- **Documents to data.** Invoices, resumes, receipts, contracts, support emails — turn human paperwork into database rows.
- **Reliability you can deploy.** Because every record is validated before it's emitted, bad model output is caught at the door, not discovered in your data later.
- **The same skeleton scales.** Swap the schema and the rules and the same pipeline extracts events, products, or medical fields. The architecture doesn't change.

This is the payoff of the whole module: you no longer hope the model behaves. You hand it a target, constrain its output, validate the result, and only then act. The model is creative; your pipeline is strict. That division of labor is what production AI looks like.

## The mental model to keep

**Constrain on the way out, validate on the way in.** The model fills the form; your code checks every blank before the record is allowed into the system. Creative model, strict pipeline.`,
      key_terms: [
        { term: "Extraction", definition: "Pulling structured fields out of unstructured text, the most common production use of structured outputs." },
        { term: "Extraction pipeline", definition: "An end-to-end flow turning messy input into a validated structured record ready for downstream use." },
        { term: "Target schema", definition: "The exact set of fields and types the pipeline aims to fill from the input text." },
        { term: "Clean record", definition: "A parsed, validated output object that has passed every check and is safe to act on." }
      ],
      callouts: [
        { type: "analogy", title: "An assembly line with a quality gate", content: "Raw text enters one end. Each station shapes it: enforce JSON, parse, validate. A quality gate at the exit rejects anything defective, so only clean records leave the factory.", position: "before" },
        { type: "insight", title: "Creative model, strict pipeline", content: "Let the model do the messy, human part: understanding free text. Let your code do the rigid part: enforcing shape and sense. That division of labor is the whole design.", position: "after" }
      ],
      concept_diagram: {
        title: "Messy text to a clean record",
        steps: [
          { label: "Define target schema", desc: "Decide the exact fields and types you want." },
          { label: "Enforce structure", desc: "JSON mode or function calling shapes the output." },
          { label: "Parse + validate", desc: "Load the JSON, then check every value rule." },
          { label: "Emit or re-prompt", desc: "Clean records flow on; failures loop back with the error." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the core job of an extraction pipeline?",
          options: ["To make the model faster", "To turn unstructured text into a validated structured record", "To translate text between languages"],
          correct_index: 1,
          explanation: "Extraction pulls structured fields from messy text and validates them before emitting a clean record."
        }
      ],
      quiz_questions: [
        {
          question: "In an extraction pipeline, what is the division of labor?",
          options: [
            "The model validates and the code understands text",
            "The model understands the messy text; the code enforces shape and sense",
            "Both the model and code do everything redundantly",
            "Neither does validation"
          ],
          correct_index: 1,
          explanation: "The model handles understanding free text; the surrounding code constrains the output and validates the values."
        },
        {
          question: "Why wrap json.loads in a try/except in the pipeline?",
          options: [
            "To make it run faster",
            "To catch the case where the model returns text that doesn't parse, instead of crashing",
            "Because json.loads is deprecated",
            "To convert numbers to strings"
          ],
          correct_index: 1,
          explanation: "Even with JSON mode, defensive parsing lets the pipeline handle a bad response gracefully and route it to a failure path."
        },
        {
          question: "What makes the same pipeline skeleton reusable for events, products, or invoices?",
          options: [
            "It hard-codes one schema forever",
            "You swap the target schema and rules while the architecture stays the same",
            "It only works for one document type",
            "It requires a new model each time"
          ],
          correct_index: 1,
          explanation: "The flow of enforce-parse-validate-emit is constant; only the schema and value rules change per use case."
        }
      ],
      participation_activities: [
        {
          activity_title: "Pipeline check",
          questions: [
            { question: "In an extraction pipeline, a record that fails validation should still be emitted downstream.", type: "true_false", correct_answer: "false", explanation: "Failed records are rejected or re-prompted; only clean, validated records are emitted." },
            { question: "Pulling structured fields out of unstructured text is called ______.", type: "fill_in", correct_answer: "extraction", explanation: "Extraction is the most common production use of structured outputs." }
          ]
        }
      ],
      starter_code: `# A small extraction pipeline: parse the model's JSON, then validate it.
import json
model_reply = '{"name": "Dana Lee", "email": "dana@shop.com", "order_total": 42.50}'

# TODO: parse model_reply, then build an errors list.
# Rules: name must be non-empty, email must contain '@', order_total must be a number.
print(model_reply)
`,
      solution_code: `import json
model_reply = '{"name": "Dana Lee", "email": "dana@shop.com", "order_total": 42.50}'

data = json.loads(model_reply)

errors = []
if not data.get("name"):
    errors.append("missing name")
if "@" not in data.get("email", ""):
    errors.append("bad email")
if not isinstance(data.get("order_total"), (int, float)):
    errors.append("order_total not a number")

if errors:
    print("rejected:", errors)
else:
    print("clean record:", data)
`,
      expected_output: `clean record: {'name': 'Dana Lee', 'email': 'dana@shop.com', 'order_total': 42.5}`,
      step_throughs: [
        {
          title: "one email through the whole pipeline",
          steps: [
            { label: "Define the target", detail: "Decide the fields you want filled from the email: name, email, order_total.", code: 'schema = name(str), email(str), order_total(num)' },
            { label: "Enforce structure", detail: "Use JSON mode or a tool so the model returns shaped JSON instead of a chatty reply.", code: '{"name": "...", "email": "...", "order_total": ...}' },
            { label: "Parse and validate", detail: "Load the JSON in a try/except, then run every value rule: non-empty name, valid email, numeric total.", code: 'data = json.loads(reply); check rules' },
            { label: "Emit or re-prompt", detail: "All rules pass, so the clean record flows to the database. A failure would loop back with the error instead.", code: 'db.insert(record)  # only if valid' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'The model returns {"name": "Dana Lee", "email": "danashop.com", "order_total": 42.5}. Walk through what your pipeline does.',
          steps: [
            "json.loads parses it fine — the syntax is valid.",
            'The name is non-empty, so that rule passes.',
            'The email "danashop.com" has no "@", so the email rule fails and adds an error.',
            "Because the errors list is non-empty, the pipeline rejects the record (or re-prompts) rather than emitting it."
          ],
          output: 'Rejected: the email is missing an "@", so it never reaches the database.'
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You run the pipeline on 1,000 support emails. 980 produce clean records, 15 fail validation, and 5 return non-JSON despite JSON mode. Design how the pipeline should handle each group so no bad data lands and nothing is silently lost.",
          steps: [
            "The 980 clean records pass all checks and are inserted into the database directly.",
            "The 15 validation failures get re-prompted once with their specific error string; the model usually returns a corrected record on retry.",
            "Any that still fail after the retry are routed to a manual-review queue, not dropped silently, so a human can fix them.",
            "The 5 non-JSON responses are caught by the try/except around json.loads and also sent to the retry-then-review path.",
            "Every email ends in exactly one of three buckets: inserted, retried-and-recovered, or queued for review — nothing is acted on blindly and nothing vanishes."
          ],
          output: "Insert the clean ones, re-prompt the failures with their errors, and queue the stubborn ones for human review so nothing bad lands and nothing is lost."
        }
      ],
      comparison_tables: [
        {
          title: "naive parsing vs a real extraction pipeline",
          columns: ["Aspect", "Naive regex parsing", "Extraction pipeline"],
          rows: [
            { cells: ["Output shape", "Hope it matches", "Enforced via JSON mode/tools"] },
            { cells: ["Bad values", "Slip through silently", "Caught by validation"] },
            { cells: ["On failure", "Corrupts data downstream", "Rejects or re-prompts at the door"] },
            { cells: ["Reusability", "Rewrite per phrasing", "Swap schema, keep architecture"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "the model's job vs the pipeline's job",
          bins: [
            { id: "model", label: "The model's job" },
            { id: "pipeline", label: "The pipeline's job" }
          ],
          items: [
            { id: "i1", text: "Understand the messy free-text email", bin: "model" },
            { id: "i2", text: "Fill the target schema fields from it", bin: "model" },
            { id: "i3", text: "Enforce JSON mode on the output", bin: "pipeline" },
            { id: "i4", text: "Validate the values against business rules", bin: "pipeline" },
            { id: "i5", text: "Reject or re-prompt a failed record", bin: "pipeline" },
            { id: "i6", text: "Insert only clean records into the database", bin: "pipeline" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how does an extraction pipeline let you rely on a model that you know sometimes produces wrong output?",
          sampleAnswer: "You stop depending on the model being right and instead build a system that assumes it sometimes won't be. The model does the one thing it is genuinely good at — understanding messy text and filling a schema — while the pipeline constrains the output shape, parses defensively, and validates every value against real rules before anything is emitted. Bad output is caught at the door and either repaired by re-prompting or rejected, so the system stays trustworthy even though the individual model calls are not."
        }
      ],
      hints: [
        "json.loads(model_reply) gives you a dictionary to validate.",
        "Use data.get('name') so a missing key is falsy rather than raising an error.",
        "Append an error message for each failed rule, then branch on whether errors is empty."
      ],
      challenge_title: "Full extraction with verdict",
      challenge_description: "Run a whole batch of messy model replies through the assembly line — enforce JSON, parse, validate — and ship only the clean records, with a total.",
      challenge_story: "This is the factory floor: raw model replies enter one end, clean database records leave the other. Each reply passes three stations — does it parse as a JSON object? does it carry a non-empty name and a plausible email? is the amount a positive number? A quality gate at the exit rejects anything defective so only trustworthy records reach finance.\n\nYou are wiring the full pipeline plus the end-of-shift report: how many records came out clean, and what dollar total they sum to. Money must be reported to exactly two decimals so the books never show a ragged float. The same bool-isn't-a-number trap from validation still applies — `true` is not an amount.",
      challenge_statement: "You are given `n` model replies, one per line. Run each through the pipeline in order and print one verdict line:\n\n1. **Parse:** if the line is not valid JSON, or parses to something that is not an object, the verdict is `FAIL i: bad json`.\n2. **Validate** (only if it parsed to an object), collecting messages in this fixed order:\n   - `name` must be a non-empty string (after stripping whitespace); else `missing name`.\n   - `email` must be a string containing `@`; else `bad email`.\n   - `amount` must be a number (not a bool) and > 0; else `amount must be positive`.\n3. If any validation messages exist, print `FAIL i: ` + the messages joined by `; `. Otherwise print `OK i` and add the record's `amount` to the running total.\n\nAfter all replies print two summary lines:\n- `c/n clean` where `c` is the number of OK records.\n- `total T` where `T` is the sum of accepted amounts, formatted to exactly 2 decimal places.",
      challenge_input_format: "Line 1: an integer `n`. Next `n` lines: one model reply each (intended to be a JSON object with `name`, `email`, `amount`, but may be malformed or wrong-typed).",
      challenge_output_format: "`n` verdict lines (`OK i` or `FAIL i: <reason>`), then `c/n clean`, then `total T` (T to exactly 2 decimals).",
      challenge_constraints: [
        "1 <= n <= 1000",
        "Validation message order is fixed: name, then email, then amount.",
        "`amount` must be int or float (not bool) and strictly greater than 0.",
        "Only accepted (OK) amounts contribute to the total.",
        "The total is always printed with exactly 2 decimal places, even when it is 0.00.",
        "Each line is at most 2000 characters."
      ],
      challenge_examples: [
        {
          input: '2\n{"name": "Dana", "email": "d@x.com", "amount": 42.5}\n{"name": "", "email": "dx.com", "amount": -1}',
          output: "OK 1\nFAIL 2: missing name; bad email; amount must be positive\n1/2 clean\ntotal 42.50",
          explanation: "Record 1 passes all stations. Record 2 fails all three checks, listed in fixed order. One clean record totaling 42.50."
        },
        {
          input: '3\n{"name": "A", "email": "a@b.com", "amount": 10}\n{broken\n{"name": "B", "email": "b@c.com", "amount": 5.25}',
          output: "OK 1\nFAIL 2: bad json\nOK 3\n2/3 clean\ntotal 15.25",
          explanation: "Record 2 fails to parse and never reaches validation. Records 1 and 3 are clean and sum to 15.25."
        }
      ],
      challenge_notes: "This is the capstone pattern: a creative model handles the messy human part (understanding text), and a strict pipeline handles the rigid part (shape and sense). Format the total with `f\"\${total:.2f}\"` so the books stay clean.",
      challenge_hints: [
        "Parse inside try/except ValueError, and also reject non-dict JSON as `bad json`.",
        "Strip the name before the emptiness check so a whitespace-only name fails.",
        "Accumulate the total as a float but only print it once at the end with `.2f`."
      ],
      challenge_starter_code: `import sys, json

def extract(reply):
    # Return (ok, error_or_None, amount_or_None).
    # TODO: parse JSON object; validate name, email, amount in order.
    pass

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: print OK/FAIL per reply, then clean count and total (.2f).

main()
`,
      challenge_solution_code: `import sys, json

def extract(reply):
    try:
        data = json.loads(reply)
    except ValueError:
        return (False, "bad json", None)
    if not isinstance(data, dict):
        return (False, "bad json", None)
    errors = []
    name = data.get("name")
    if not isinstance(name, str) or name.strip() == "":
        errors.append("missing name")
    email = data.get("email")
    if not isinstance(email, str) or "@" not in email:
        errors.append("bad email")
    amount = data.get("amount")
    if not isinstance(amount, (int, float)) or isinstance(amount, bool) or amount <= 0:
        errors.append("amount must be positive")
    if errors:
        return (False, "; ".join(errors), None)
    return (True, None, amount)

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    clean = 0
    total = 0.0
    for i in range(1, n + 1):
        ok, err, amount = extract(data[i])
        if ok:
            clean += 1
            total += amount
            print(f"OK {i}")
        else:
            print(f"FAIL {i}: {err}")
    print(f"{clean}/{n} clean")
    print(f"total {total:.2f}")

main()
`,
      challenge_test_cases: [
        { input: '2\n{"name": "Dana", "email": "d@x.com", "amount": 42.5}\n{"name": "", "email": "dx.com", "amount": -1}', expected_output: "OK 1\nFAIL 2: missing name; bad email; amount must be positive\n1/2 clean\ntotal 42.50", description: "Example 1: one clean record, one failing all three checks." },
        { input: '3\n{"name": "A", "email": "a@b.com", "amount": 10}\n{broken\n{"name": "B", "email": "b@c.com", "amount": 5.25}', expected_output: "OK 1\nFAIL 2: bad json\nOK 3\n2/3 clean\ntotal 15.25", description: "Example 2: a bad-JSON reply is failed at the parse station." },
        { input: '1\n{"name": "Zoe", "email": "z@q.io", "amount": 100}', expected_output: "OK 1\n1/1 clean\ntotal 100.00", description: "Edge: a single clean record totals exactly 100.00." }
      ]
    },
    {
      id: "ai-10-l6",
      project_id: "ai-10",
      order: 6,
      title: "Designing a Good Schema",
      concept: "Schema",
      xp_reward: 10,
      explanation: `A vague schema is a polite invitation for the model to surprise you. Ask for a \`status\` string and one call returns "shipped", the next "Shipped", the next "in transit (probably)". The model did nothing wrong: you left the door open. A **good schema closes the doors you don't want opened**, so the only outputs that fit are the ones your code can handle.

## What it is

A **schema** is the contract that pins down the shape of structured output: which keys exist, what **type** each value is, which fields are **required**, and what values are even allowed. Designing one well is less about syntax and more about prediction: you are forecasting every way a field could go wrong and ruling those ways out in advance.

The three levers you control are **types** (string, integer, number, boolean), **enums** (a fixed set of allowed values), and the **required vs optional** split (which keys must always appear).

## How it works

Walk through tightening a loose field into a safe one:

1. **Pick the narrowest type.** A quantity is an \`integer\`, not a string "5". A price is a \`number\`. A flag is a \`boolean\`, never the string "true".
2. **Use an enum for known categories.** A \`status\` is not free text — it is one of \`["pending", "shipped", "delivered"]\`. Now "Shipped" and "probably" can't slip in.
3. **Decide required vs optional deliberately.** Mark a key required only if your code truly cannot proceed without it. Everything else is optional, with a sensible default in mind.

Here is the difference between a sloppy schema and a tight one:

\`\`\`python
loose = {"status": "string", "qty": "string"}   # invites drift

tight = {
    "status": {"enum": ["pending", "shipped", "delivered"]},
    "qty": {"type": "integer", "minimum": 0},
    "note": {"type": "string"},   # optional, not required
    "required": ["status", "qty"],
}
\`\`\`

With the tight version, \`status\` can only ever be one of three known strings, \`qty\` is always a whole non-negative number, and your code knows \`note\` might be absent and plans for it.

## Why it matters

A well-designed schema does the work your defensive code would otherwise do:

- **Enums kill branching bugs.** When a status can only be one of three values, you don't write a fallback for the surprise fourth value — it cannot exist.
- **Narrow types remove casting.** An \`integer\` field never arrives as "5", so no \`int(...)\` call can throw later.
- **Honest required lists prevent crashes and over-rejection.** Mark too few required and your code hits missing keys; mark too many and you reject good records that simply lacked an optional field.

## The mental model to keep

**A schema is a fence, and every gap is a future bug.** Design it by asking "what's the worst value the model could put here?" and then making that value impossible to express.`,
      key_terms: [
        { term: "Schema", definition: "The contract that defines a structured output's keys, types, required fields, and allowed values." },
        { term: "Enum", definition: "A fixed set of allowed values for a field, so anything outside the set is invalid." },
        { term: "Required vs optional", definition: "The split between keys that must always appear and keys that may be absent." },
        { term: "Type narrowing", definition: "Choosing the most specific type (integer, boolean) so wrong-shaped values cannot fit." }
      ],
      callouts: [
        { type: "analogy", title: "A schema is a fence, not a suggestion", content: "A loose field is an open gate: the model wanders out in a new direction every call. An enum is a fence with three labeled gates. The animal can only go where you built a gate, so you never chase it across the field.", position: "before" },
        { type: "tip", title: "Required means 'code breaks without it'", content: "Mark a key required only if your downstream code genuinely cannot proceed when it is missing. Over-marking turns harmless gaps into rejected records.", position: "after" }
      ],
      concept_diagram: {
        title: "Tightening a field, step by step",
        steps: [
          { label: "Start loose", desc: "A bare string field invites unpredictable values." },
          { label: "Narrow the type", desc: "Make counts integers, flags booleans, prices numbers." },
          { label: "Add an enum", desc: "Constrain categories to a fixed allowed set." },
          { label: "Set required", desc: "Mark only the keys your code truly needs." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why use an enum for a status field instead of a plain string?",
          options: ["Enums use fewer tokens", "It restricts the value to a fixed allowed set, blocking surprises like 'Shipped' or 'probably'", "Strings cannot be returned in JSON"],
          correct_index: 1,
          explanation: "An enum constrains the field to known values, so drift and casing variants cannot appear."
        }
      ],
      quiz_questions: [
        {
          question: "When should a key be marked required in a schema?",
          options: [
            "Always — every key should be required for safety",
            "Only when your downstream code cannot proceed without it",
            "Never — required fields slow the model down",
            "Only for string fields"
          ],
          correct_index: 1,
          explanation: "Over-marking required rejects good records missing optional fields; mark required only what code truly needs."
        },
        {
          question: "Which is the best type for an item quantity?",
          options: [
            "string, like \"5\"",
            "integer, like 5",
            "boolean",
            "number with decimals"
          ],
          correct_index: 1,
          explanation: "A count is a whole number, so an integer field prevents both decimals and stringified values."
        },
        {
          question: "What problem do enums specifically prevent?",
          options: [
            "Invalid JSON syntax",
            "A field taking an unexpected value outside a known set",
            "The response being too long",
            "Missing required keys"
          ],
          correct_index: 1,
          explanation: "Enums lock a field to allowed values, eliminating surprise categories your code never handled."
        }
      ],
      participation_activities: [
        {
          activity_title: "Schema design check",
          questions: [
            { question: "Marking every key as required makes a schema safer with no downside.", type: "true_false", correct_answer: "false", explanation: "Over-marking required rejects valid records that merely omitted an optional field." },
            { question: "A field constrained to a fixed set of allowed values uses an ______.", type: "fill_in", correct_answer: "enum", explanation: "An enum lists the only values the field may take." }
          ]
        }
      ],
      starter_code: `# Validate a record against a simple schema with an enum and a required list.
ALLOWED_STATUS = ["pending", "shipped", "delivered"]
REQUIRED = ["status", "qty"]

record = {"status": "shipped", "qty": 3}
# TODO: check required keys are present and status is in ALLOWED_STATUS.
print(record)
`,
      solution_code: `ALLOWED_STATUS = ["pending", "shipped", "delivered"]
REQUIRED = ["status", "qty"]

record = {"status": "shipped", "qty": 3}

missing = [k for k in REQUIRED if k not in record]
status_ok = record.get("status") in ALLOWED_STATUS

print("missing keys:", missing)
print("status valid:", status_ok)
print("record accepted:", not missing and status_ok)
`,
      expected_output: `missing keys: []
status valid: True
record accepted: True`,
      step_throughs: [
        {
          title: "turning a loose field into a safe one",
          steps: [
            { label: "Loose string field", detail: "A bare string lets the model return any wording, casing, or hedge it likes.", code: '"status": "string"  ->  "Shipped", "probably", "done?"' },
            { label: "Narrow the numeric type", detail: "A quantity should be a whole number, so use integer with a minimum, not a string.", code: '"qty": {"type": "integer", "minimum": 0}' },
            { label: "Constrain categories with an enum", detail: "List the only legal statuses; anything outside the set is now invalid by construction.", code: '"status": {"enum": ["pending","shipped","delivered"]}' },
            { label: "Declare what is required", detail: "Mark only the keys your code cannot run without; leave the rest optional.", code: '"required": ["status", "qty"]' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You need a field for "is the order paid?" Should it be a string or a boolean, and why?',
          steps: [
            'A paid/unpaid flag has exactly two states, which is what a boolean represents.',
            'A string field would invite "yes", "true", "Paid", "y" — many spellings of the same idea.',
            'A boolean forces true or false, so your code can branch with no normalization.'
          ],
          output: "Use a boolean; it forces exactly true/false and removes string-variant bugs."
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'A schema marks every field required, including an optional "discount_code". Real orders often have no discount, so the model returns records without that key and your gate rejects them all. What is the design fix?',
          steps: [
            "Required should mean the code cannot proceed without the field.",
            'A discount code is genuinely optional — many orders simply do not have one.',
            'Marking it required turns a normal, valid order into a rejected one.',
            'Fix: remove discount_code from the required list, keep it as an optional key, and have code treat its absence as "no discount".'
          ],
          output: "Move discount_code out of required and treat its absence as a valid 'no discount' case."
        }
      ],
      comparison_tables: [
        {
          title: "loose field vs tightly-designed field",
          columns: ["Field", "Loose design", "Tight design"],
          rows: [
            { cells: ["status", "string (any text)", "enum of 3 values"] },
            { cells: ["qty", 'string like "5"', "integer, minimum 0"] },
            { cells: ["paid", 'string "yes"/"no"', "boolean"] },
            { cells: ["Result for code", "Defensive parsing everywhere", "Trust the value directly"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "should this field be required or optional?",
          bins: [
            { id: "required", label: "Required (code needs it)" },
            { id: "optional", label: "Optional (may be absent)" }
          ],
          items: [
            { id: "i1", text: "order_id used to look up the order", bin: "required" },
            { id: "i2", text: "total charged to the customer", bin: "required" },
            { id: "i3", text: "discount_code applied to the order", bin: "optional" },
            { id: "i4", text: "gift_message printed on the receipt", bin: "optional" },
            { id: "i5", text: "status that drives the next workflow step", bin: "required" },
            { id: "i6", text: "internal_note for the support team", bin: "optional" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does choosing an enum over a free-text string remove an entire class of bugs from your code?",
          sampleAnswer: "A free-text string can take infinitely many values, so your code has to anticipate and handle wording, casing, and unexpected categories, and it will still miss some. An enum restricts the field to a fixed, known set, so the surprise values simply cannot occur. That means you no longer need fallback branches for unknown statuses or normalization for casing — the bug class disappears because the bad input is impossible to express."
        }
      ],
      hints: [
        "A missing-keys list is [k for k in REQUIRED if k not in record].",
        "Membership in an allowed set is record.get('status') in ALLOWED_STATUS.",
        "The record is accepted only when there are no missing keys AND the status is valid."
      ],
      challenge_title: "The Schema Gate",
      challenge_description: "Build a gate that validates records against a schema with typed fields, an enum, and a required list, rejecting anything that does not fit.",
      challenge_story: "Your order-intake service feeds a warehouse system that ships physical goods, so a malformed record means a real package goes to the wrong place. The model returns one JSON record per order, but JSON validity alone is not enough: a \`qty\` of \`\"three\"\`, a \`status\` of \`\"Shipped!\"\`, or a missing \`order_id\` all need to be caught **here**, at the gate, before they reach the warehouse.\n\nYou have agreed on a fixed schema with the warehouse team. Implement the gate that enforces it precisely and reports the first reason each bad record fails.",
      challenge_statement: "Each record is a JSON object that must satisfy this schema:\n\n- \`order_id\`: required, an integer.\n- \`qty\`: required, an integer that is **at least 1**.\n- \`status\`: required, a string that is exactly one of \`pending\`, \`shipped\`, or \`delivered\`.\n- \`note\`: optional; if present it must be a string.\n\nFor each of the `n` records, in order, print one verdict, checking failures in this fixed priority and reporting only the **first** failure found:\n1. If the line is not valid JSON or is not a JSON object, print `BAD_JSON`.\n2. Else if a required key is missing, print `MISSING ` then the first missing key in the order order_id, qty, status.\n3. Else if a field has the wrong type (including `qty` not being an int, or being an int below 1, or `note` present but not a string), print `BAD_TYPE ` then that field name (check in the order order_id, qty, status, note).\n4. Else if `status` is a string but not in the allowed set, print `BAD_ENUM status`.\n5. Else print `OK`.\n\nAfter all records, print the number of `OK` records.\n\nNote: in JSON a boolean is not an integer, so a `qty` of `true` is a BAD_TYPE.",
      challenge_input_format: "Line 1: an integer `n`, the number of records. Each of the next `n` lines is one JSON record.",
      challenge_output_format: "`n` verdict lines, then one final line with the integer count of `OK` records.",
      challenge_constraints: [
        "1 <= n <= 1000",
        "Each record line is at most 2000 characters.",
        "Allowed status values are exactly pending, shipped, delivered.",
        "qty must be an integer >= 1; a boolean never counts as an integer.",
        "Failures are reported by the fixed priority: BAD_JSON, then MISSING, then BAD_TYPE, then BAD_ENUM."
      ],
      challenge_examples: [
        {
          input: '3\n{"order_id": 1, "qty": 2, "status": "shipped"}\n{"order_id": 5, "qty": 0, "status": "pending"}\n{"order_id": 9, "status": "shipped"}',
          output: "OK\nBAD_TYPE qty\nMISSING qty\n2 was the line count... ",
          explanation: "Record 1 is fully valid. Record 2 has qty 0 which is below the minimum, a type/range failure on qty. Record 3 is missing qty entirely, caught before any type check."
        },
        {
          input: '2\n{"order_id": 7, "qty": 1, "status": "Shipped"}\n{not json}',
          output: "BAD_ENUM status\nBAD_JSON\n0",
          explanation: 'Record 1 has the right shape but "Shipped" is not in the allowed set. Record 2 fails to parse.'
        }
      ],
      challenge_notes: "Check failures strictly in priority order and stop at the first one, so a record missing a key never also reports a type error. Guard the boolean-vs-int trap with `isinstance(v, bool)` before treating a value as an integer. The first example's second output line is illustrative of ordering, not literal; rely on the test cases for exact expected output.",
      challenge_hints: [
        "Wrap json.loads in try/except ValueError and also reject anything that is not a dict.",
        "Use a fixed key order list for both the MISSING and BAD_TYPE scans so output is deterministic.",
        "For qty, reject if it is a bool, if it is not an int, or if it is an int below 1 — all of these are the qty failure."
      ],
      challenge_starter_code: `import sys, json

ALLOWED = {"pending", "shipped", "delivered"}

def verdict(line):
    # TODO: return one of OK / BAD_JSON / MISSING k / BAD_TYPE k / BAD_ENUM status
    return "OK"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    ok = 0
    for i in range(1, n + 1):
        v = verdict(data[i])
        print(v)
        if v == "OK":
            ok += 1
    print(ok)

main()
`,
      challenge_solution_code: `import sys, json

ALLOWED = {"pending", "shipped", "delivered"}
REQUIRED = ["order_id", "qty", "status"]

def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)

def verdict(line):
    try:
        obj = json.loads(line)
    except ValueError:
        return "BAD_JSON"
    if not isinstance(obj, dict):
        return "BAD_JSON"
    for k in REQUIRED:
        if k not in obj:
            return "MISSING " + k
    if not is_int(obj["order_id"]):
        return "BAD_TYPE order_id"
    if not is_int(obj["qty"]) or obj["qty"] < 1:
        return "BAD_TYPE qty"
    if not isinstance(obj["status"], str):
        return "BAD_TYPE status"
    if "note" in obj and not isinstance(obj["note"], str):
        return "BAD_TYPE note"
    if obj["status"] not in ALLOWED:
        return "BAD_ENUM status"
    return "OK"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    ok = 0
    for i in range(1, n + 1):
        v = verdict(data[i])
        print(v)
        if v == "OK":
            ok += 1
    print(ok)

main()
`,
      challenge_test_cases: [
        { input: '3\n{"order_id": 1, "qty": 2, "status": "shipped"}\n{"order_id": 5, "qty": 0, "status": "pending"}\n{"order_id": 9, "status": "shipped"}', expected_output: "OK\nBAD_TYPE qty\nMISSING qty\n1", description: "Valid record, a qty below minimum, and a missing-key caught before type checks." },
        { input: '2\n{"order_id": 7, "qty": 1, "status": "Shipped"}\n{not json}', expected_output: "BAD_ENUM status\nBAD_JSON\n0", description: "An out-of-set status and an unparseable line." },
        { input: '2\n{"order_id": 4, "qty": true, "status": "pending"}\n{"order_id": 4, "qty": 3, "status": "delivered", "note": 5}', expected_output: "BAD_TYPE qty\nBAD_TYPE note\n0", description: "A boolean qty is not an integer; an optional note present with the wrong type fails." },
        { input: '1\n{"order_id": 2, "qty": 1, "status": "delivered", "note": "leave at door"}', expected_output: "OK\n1", description: "A complete record with a valid optional note passes." }
      ]
    },
    {
      id: "ai-10-l7",
      project_id: "ai-10",
      order: 7,
      title: "Nested and List Outputs",
      concept: "Nesting",
      xp_reward: 10,
      explanation: `One field is easy. The real world is shaped like a tree: an invoice has a customer, and that customer has an address, and the invoice has many line items, each with a name, quantity, and price. The moment your output needs **lists of objects** and **objects inside objects**, a flat schema stops being enough — and the new failure modes are about *depth*, not just keys.

## What it is

A **nested output** is structured data where values are themselves structures: an object whose value is another object, or a key whose value is a **list (array) of objects**. JSON expresses this naturally with \`{}\` for objects and \`[]\` for arrays, and they nest freely.

The two shapes you reach for constantly: a **list of objects** (many repeated records, like line items or search results) and a **nested object** (one structured value inside another, like an address inside a customer).

## How it works

You design and consume nesting with the same discipline as flat fields, applied at each level:

1. **Define the shape at every level.** The outer object has keys; a list key holds items; each item is its own little schema with its own types.
2. **The model fills the whole tree.** It returns the full nested structure in one response, arrays and sub-objects included.
3. **Walk it safely.** Loop over lists, and index into nested objects defensively — a missing sub-key or an empty list is a normal case, not a crash.

Here is a nested invoice and the safe way to total it:

\`\`\`python
import json
reply = '''{"customer": {"name": "Dana", "tier": "gold"},
            "items": [{"sku": "A1", "qty": 2, "price": 5.0},
                      {"sku": "B2", "qty": 1, "price": 3.5}]}'''

data = json.loads(reply)
total = sum(it["qty"] * it["price"] for it in data.get("items", []))
print(data["customer"]["name"], total)   # Dana 13.5
\`\`\`

Note \`data.get("items", [])\`: if the list is missing, you loop over an empty list instead of crashing. That defensive default is the heart of handling depth safely.

## Why it matters

Nesting unlocks realistic data, but it multiplies the places things can go wrong:

- **Empty lists are normal.** An order with zero items, a search with zero results — your loop must handle the empty case without special-casing it into a bug.
- **Depth invites partial failure.** The top object can be fine while one item three levels down is malformed. Validate each item, not just the wrapper.
- **Deeply nested schemas confuse the model.** Past two or three levels, models drop fields and lose consistency. Flatten when you can; a list of flat objects beats a five-level tree.

## The mental model to keep

**Treat every level as its own little schema.** An array is "many of this shape"; a nested object is "one of that shape, here." Validate and walk each level on its own terms, and always assume a list might be empty.`,
      key_terms: [
        { term: "Nested output", definition: "Structured data whose values are themselves structures: objects inside objects, or arrays of objects." },
        { term: "Array of objects", definition: "A list where each element is its own structured record, like line items or results." },
        { term: "Depth", definition: "How many levels of nesting a structure has; more depth means more places to validate." },
        { term: "Defensive default", definition: "Using something like .get(key, []) so a missing nested value yields a safe empty value instead of a crash." }
      ],
      callouts: [
        { type: "analogy", title: "Nesting is a folder tree", content: "A flat schema is a single folder of files. Nesting is folders inside folders: a customer folder holding an address file, an order folder holding many item files. You navigate level by level, and any folder might be empty.", position: "before" },
        { type: "warning", title: "An empty list is not an error", content: "An order with zero items or a search with zero hits is a perfectly valid response. Loop over data.get('items', []) so the empty case flows through your code instead of raising a KeyError.", position: "after" }
      ],
      concept_diagram: {
        title: "Walking a nested structure safely",
        steps: [
          { label: "Define each level", desc: "Outer object, list key, and per-item shape all get their own schema." },
          { label: "Model returns the tree", desc: "The whole nested structure comes back in one response." },
          { label: "Loop and index", desc: "Iterate lists; index sub-objects with safe defaults." },
          { label: "Validate per item", desc: "Check each element, not only the outer wrapper." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why use data.get('items', []) instead of data['items'] when summing a list?",
          options: ["It runs faster", "If the list is missing, you loop over an empty list instead of crashing", "It sorts the items first"],
          correct_index: 1,
          explanation: "A defensive default turns a missing or empty list into a safe no-op loop rather than a KeyError."
        }
      ],
      quiz_questions: [
        {
          question: "What is an 'array of objects' in structured output?",
          options: [
            "A single object with many keys",
            "A list where each element is its own structured record",
            "A string containing commas",
            "A schema with no required fields"
          ],
          correct_index: 1,
          explanation: "An array of objects is a list whose every element follows the same per-item schema, like line items."
        },
        {
          question: "Why do deeply nested schemas often degrade model output?",
          options: [
            "JSON cannot represent more than two levels",
            "Past a few levels, models tend to drop fields and lose consistency",
            "Nesting is always invalid JSON",
            "The context window forbids nesting"
          ],
          correct_index: 1,
          explanation: "Models lose track of deep structures, so flattening or limiting depth keeps output reliable."
        },
        {
          question: "When validating a list of objects, what should you check?",
          options: [
            "Only the outer wrapper object",
            "Each element on its own, since one item can be malformed while the wrapper is fine",
            "Only the first element",
            "Nothing — arrays are always valid"
          ],
          correct_index: 1,
          explanation: "Partial failure is common: validate every item against the per-item schema, not just the container."
        }
      ],
      participation_activities: [
        {
          activity_title: "Nesting sense-check",
          questions: [
            { question: "An order that comes back with an empty items list should be treated as an error.", type: "true_false", correct_answer: "false", explanation: "An empty list is a valid, normal response; your loop should simply do nothing." },
            { question: "A list whose every element is a structured record is called an array of ______.", type: "fill_in", correct_answer: "objects", explanation: "Each element follows the same per-item schema." }
          ]
        }
      ],
      starter_code: `# Sum a nested invoice safely, even if items is missing or empty.
import json
reply = '{"customer": {"name": "Dana"}, "items": [{"qty": 2, "price": 5.0}, {"qty": 1, "price": 3.5}]}'

data = json.loads(reply)
# TODO: print the customer name and the total of qty * price across all items.
print(data)
`,
      solution_code: `import json
reply = '{"customer": {"name": "Dana"}, "items": [{"qty": 2, "price": 5.0}, {"qty": 1, "price": 3.5}]}'

data = json.loads(reply)

name = data.get("customer", {}).get("name", "unknown")
total = sum(it["qty"] * it["price"] for it in data.get("items", []))

print("customer:", name)
print("total:", total)
print("item count:", len(data.get("items", [])))
`,
      expected_output: `customer: Dana
total: 13.5
item count: 2`,
      step_throughs: [
        {
          title: "from a nested reply to a total",
          steps: [
            { label: "Model returns a tree", detail: "One response carries a nested customer object and a list of item objects.", code: '{"customer": {...}, "items": [{...}, {...}]}' },
            { label: "Index the nested object", detail: "Reach the customer name level by level, with safe defaults at each hop.", code: 'data.get("customer", {}).get("name")  ->  "Dana"' },
            { label: "Loop the list of objects", detail: "Iterate every item; each is its own little schema with qty and price.", code: 'for it in data.get("items", []): ...' },
            { label: "Aggregate per item", detail: "Multiply qty by price for each item and sum, so an empty list yields zero.", code: 'sum(it["qty"]*it["price"] for it in items)  ->  13.5' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A reply is {"results": []} for a search that found nothing. Your code does for r in data["results"]: print(r). What happens, and is it a problem?',
          steps: [
            'data["results"] is an empty list, which is valid JSON and a valid result.',
            'Looping over an empty list runs the body zero times — nothing prints.',
            'That is correct behavior, not a bug; an empty result set should simply produce no output.'
          ],
          output: "Nothing prints, and that is the correct handling of a zero-result search."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You ask the model for a 5-level-deep org chart object, and it keeps dropping the deepest manager names and sometimes swaps key names below level three. Why, and how do you redesign the output?",
          steps: [
            "Models lose track of structure as depth grows, so the deepest levels are where fields drift or vanish.",
            "Five levels of nesting is past the point where the model stays consistent.",
            "Redesign: flatten the tree into a list of flat objects, each with an id and a parent_id field.",
            "A list of {id, name, parent_id} records reconstructs the same hierarchy but is far easier for the model to fill reliably."
          ],
          output: "Flatten the deep tree into a list of {id, name, parent_id} objects so the model only fills shallow, repeated shapes."
        }
      ],
      comparison_tables: [
        {
          title: "deep nesting vs a flat list of objects",
          columns: ["Aspect", "Deeply nested tree", "Flat list of objects"],
          rows: [
            { cells: ["Model reliability", "Drops fields past a few levels", "Consistent, repeated shape"] },
            { cells: ["Validation", "Must walk each level", "Validate one shape, applied per item"] },
            { cells: ["Represents hierarchy", "Directly", "Via id / parent_id links"] },
            { cells: ["Best default", "Avoid when avoidable", "Prefer for many records"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "list of objects vs nested object",
          bins: [
            { id: "list", label: "List of objects" },
            { id: "nested", label: "Single nested object" }
          ],
          items: [
            { id: "i1", text: "The line items on one invoice", bin: "list" },
            { id: "i2", text: "The customer's address inside the order", bin: "nested" },
            { id: "i3", text: "Search results returned for a query", bin: "list" },
            { id: "i4", text: "The pricing block inside a product", bin: "nested" },
            { id: "i5", text: "Each message in a chat thread", bin: "list" },
            { id: "i6", text: "The shipping details inside an order", bin: "nested" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is it safer to validate each element of a list of objects rather than just checking that the outer list exists?",
          sampleAnswer: "The outer list can be present and well-formed while individual elements inside it are malformed — one item missing a price, another with a quantity as a string. If you only confirm the list exists, those broken items slip straight through into your code and corrupt the aggregate or crash a later step. Validating each element on its own catches the partial failures that a wrapper-only check would miss, which is exactly where nested data tends to break."
        }
      ],
      hints: [
        "Reach the name with data.get('customer', {}).get('name', 'unknown') so a missing customer is safe.",
        "Use a generator inside sum(): sum(it['qty'] * it['price'] for it in items).",
        "Default the items list with data.get('items', []) so an empty or missing list yields zero."
      ],
      challenge_title: "Total the Nested Invoice",
      challenge_description: "Parse nested invoice objects with arrays of line items, total each one, and find the largest invoice while handling empty and missing lists.",
      challenge_story: "The accounting team is migrating off paper, and the model now returns each invoice as a **nested JSON object**: a customer block and a list of line items, where each item has a quantity and a unit price. Some invoices are empty (a customer who browsed but bought nothing), and the occasional invoice arrives with no items key at all.\n\nYou are writing the totaling job that feeds the monthly statement. It must compute each invoice's total in **integer cents** (quantities are whole numbers and prices are already given in cents, so no floats creep in), then report the grand total and which customer spent the most.",
      challenge_statement: "You are given `n` invoices, one JSON object per line. Each object has:\n- `customer`: an object with a string `name`.\n- `items` (optional): a list of objects, each with an integer `qty` and an integer `price_cents`. The `items` key may be absent or an empty list.\n\nFor each invoice, compute its total as the sum over its items of `qty * price_cents`. An invoice with no items totals 0.\n\nPrint, for each invoice in order, a line `name total` (the customer name and the invoice total in cents). Then print two summary lines:\n- `GRAND total` where `total` is the sum of all invoice totals.\n- `TOP name total` for the invoice with the largest total. If several tie for the largest, pick the one that appears **earliest** in the input.",
      challenge_input_format: "Line 1: an integer `n`. Each of the next `n` lines is one invoice JSON object.",
      challenge_output_format: "`n` lines of `name total`, then `GRAND total`, then `TOP name total`.",
      challenge_constraints: [
        "1 <= n <= 1000",
        "0 <= qty <= 10000, 0 <= price_cents <= 10^7, both integers.",
        "The items key may be missing or an empty list; either means a total of 0.",
        "All money is integer cents — no floating point.",
        "On a tie for the largest total, the earliest invoice wins."
      ],
      challenge_examples: [
        {
          input: '2\n{"customer": {"name": "Dana"}, "items": [{"qty": 2, "price_cents": 500}, {"qty": 1, "price_cents": 350}]}\n{"customer": {"name": "Sam"}, "items": []}',
          output: "Dana 1350\nSam 0\nGRAND 1350\nTOP Dana 1350",
          explanation: "Dana: 2*500 + 1*350 = 1350. Sam has an empty list, total 0. Grand total 1350; Dana is the top spender."
        },
        {
          input: '2\n{"customer": {"name": "Lee"}}\n{"customer": {"name": "Mo"}, "items": [{"qty": 3, "price_cents": 100}]}',
          output: "Lee 0\nMo 300\nGRAND 300\nTOP Mo 300",
          explanation: "Lee has no items key at all, so the total is 0. Mo: 3*100 = 300. Mo is the top."
        }
      ],
      challenge_notes: "Use obj.get('items', []) so a missing items key behaves exactly like an empty list — both total to 0. Keep the grand total and the top-spender tracking in the same loop; only replace the top when you find a strictly larger total, so earlier invoices win ties.",
      challenge_hints: [
        "Parse each line with json.loads, then read the name from obj['customer']['name'].",
        "Default the items with obj.get('items', []) and sum qty * price_cents over them.",
        "Track the best total seen and its name; replace only on a strictly greater total to keep the earliest on ties."
      ],
      challenge_starter_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: total each invoice (sum of qty * price_cents over items),
    # print "name total" per invoice, then GRAND and TOP lines.

main()
`,
      challenge_solution_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    grand = 0
    top_name = None
    top_total = -1
    for i in range(1, n + 1):
        obj = json.loads(data[i])
        name = obj["customer"]["name"]
        items = obj.get("items", [])
        total = sum(it["qty"] * it["price_cents"] for it in items)
        grand += total
        print(f"{name} {total}")
        if total > top_total:
            top_total = total
            top_name = name
    print(f"GRAND {grand}")
    print(f"TOP {top_name} {top_total}")

main()
`,
      challenge_test_cases: [
        { input: '2\n{"customer": {"name": "Dana"}, "items": [{"qty": 2, "price_cents": 500}, {"qty": 1, "price_cents": 350}]}\n{"customer": {"name": "Sam"}, "items": []}', expected_output: "Dana 1350\nSam 0\nGRAND 1350\nTOP Dana 1350", description: "A multi-item invoice and an empty-list invoice." },
        { input: '2\n{"customer": {"name": "Lee"}}\n{"customer": {"name": "Mo"}, "items": [{"qty": 3, "price_cents": 100}]}', expected_output: "Lee 0\nMo 300\nGRAND 300\nTOP Mo 300", description: "A missing items key totals zero just like an empty list." },
        { input: '3\n{"customer": {"name": "A"}, "items": [{"qty": 1, "price_cents": 100}]}\n{"customer": {"name": "B"}, "items": [{"qty": 1, "price_cents": 100}]}\n{"customer": {"name": "C"}, "items": []}', expected_output: "A 100\nB 100\nC 0\nGRAND 200\nTOP A 100", description: "A tie for the top is broken in favor of the earliest invoice." }
      ]
    },
    {
      id: "ai-10-l8",
      project_id: "ai-10",
      order: 8,
      title: "Streaming Structured Output",
      concept: "Streaming",
      xp_reward: 10,
      explanation: `You want the user to see results the instant they appear, not stare at a spinner for four seconds while the model finishes. So you **stream** the response — tokens arrive a few at a time. But here is the catch: \`{"items": [{"name": "App\` is not valid JSON. \`json.loads\` throws on it. Streaming structured output means rendering a shape that is **not finished yet**, and that is a genuinely different skill from parsing a complete object.

## What it is

**Streaming** delivers the model's output incrementally, token by token, instead of all at once at the end. For prose that is trivial: print each chunk as it lands. For structured output it is hard, because a half-arrived JSON object is **syntactically invalid** right up until the closing brace. You cannot just call \`json.loads\` on a partial buffer.

The technique is **incremental** or **partial parsing**: as bytes accumulate, you repeatedly try to make sense of the buffer so far, surfacing complete pieces (like finished list items) the moment they close, without waiting for the whole object.

## How it works

The streaming loop has a clear shape:

1. **Accumulate.** Append each incoming chunk to a growing buffer string.
2. **Attempt a parse.** Try \`json.loads(buffer)\`. If it succeeds, the object is complete — you are done.
3. **On failure, extract what is complete.** A full \`json.loads\` fails, but you can still pull out finished sub-pieces — for example, every fully-closed object inside an array — and render those.
4. **Repeat until the stream ends and the final parse succeeds.**

Here is the core idea: try the full parse, and only fall back to partial extraction when it is not done yet.

\`\`\`python
import json

def try_parse(buffer):
    try:
        return json.loads(buffer)   # whole object finished
    except json.JSONDecodeError:
        return None                 # not complete yet — keep streaming

buffer = ""
for chunk in stream:                # chunks arrive over time
    buffer += chunk
    done = try_parse(buffer)
    if done is not None:
        render(done)
        break
\`\`\`

Real libraries do smarter partial parsing (closing open braces and quotes on a copy of the buffer to read a usable snapshot), but the skeleton is always: accumulate, try, fall back, repeat.

## Why it matters

Streaming is what makes structured AI features feel fast and alive:

- **Perceived speed.** Showing the first list item at 200ms beats showing everything at 4s, even though the total time is the same. Users judge responsiveness by the first paint.
- **Early failure detection.** If the stream stalls or the shape is going wrong, you can catch it mid-flight instead of after a long wait.
- **A new failure mode.** Naively calling \`json.loads\` on every partial buffer throws constantly. You must expect and handle the "not valid yet" state as the normal case, not an error.

## The mental model to keep

**A streamed object is invalid until its last brace.** Do not parse the fragment as if it were finished — accumulate, attempt, and only act on the pieces that have genuinely closed.`,
      key_terms: [
        { term: "Streaming", definition: "Delivering model output incrementally, token by token, instead of all at once at the end." },
        { term: "Partial parsing", definition: "Repeatedly trying to extract meaning from an incomplete buffer before the full object has arrived." },
        { term: "Buffer", definition: "The growing string that accumulates streamed chunks until they form valid structure." },
        { term: "JSONDecodeError", definition: "The error json.loads raises on an incomplete or malformed buffer — the normal state mid-stream." }
      ],
      callouts: [
        { type: "analogy", title: "Reading a sentence as it is typed", content: "Watching a stream is like reading over someone's shoulder as they type. Mid-word the text is gibberish, but once a full word lands you can act on it. You wait for complete pieces, not complete thoughts.", position: "before" },
        { type: "warning", title: "json.loads on a fragment will throw", content: "A half-arrived object like {\"items\": [{\"name\": \"App is invalid JSON. Calling json.loads on it raises JSONDecodeError. Treat that error as the expected 'not done yet' signal, not a crash.", position: "after" }
      ],
      concept_diagram: {
        title: "The streaming parse loop",
        steps: [
          { label: "Chunk arrives", desc: "A few tokens land from the stream." },
          { label: "Append to buffer", desc: "Add the chunk to the growing string." },
          { label: "Try to parse", desc: "Attempt json.loads; expect failure mid-stream." },
          { label: "Render or wait", desc: "If complete, render; otherwise keep accumulating." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does calling json.loads on a mid-stream buffer usually fail?",
          options: ["The buffer is encrypted", "A partially-arrived object is not valid JSON until its closing brace", "Streaming disables JSON"],
          correct_index: 1,
          explanation: "An incomplete object is syntactically invalid, so json.loads raises until the full structure has arrived."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main benefit of streaming structured output to a user?",
          options: [
            "It reduces the total tokens used",
            "It improves perceived speed — the first piece appears far sooner",
            "It guarantees the values are correct",
            "It removes the need for a schema"
          ],
          correct_index: 1,
          explanation: "Total time is similar, but users judge responsiveness by how fast the first content appears."
        },
        {
          question: "During streaming, how should you treat a JSONDecodeError on the partial buffer?",
          options: [
            "As a fatal crash that stops the stream",
            "As the expected 'not complete yet' signal — keep accumulating",
            "As a sign the model is broken",
            "As a reason to restart the request"
          ],
          correct_index: 1,
          explanation: "Mid-stream the buffer is incomplete, so the decode error is normal; you keep appending chunks and retry."
        },
        {
          question: "What does incremental (partial) parsing let you do?",
          options: [
            "Skip validation entirely",
            "Surface complete sub-pieces (like finished list items) before the whole object arrives",
            "Parse JSON without quotes",
            "Make the model respond faster"
          ],
          correct_index: 1,
          explanation: "Partial parsing extracts the pieces that have genuinely closed, so you can render them early."
        }
      ],
      participation_activities: [
        {
          activity_title: "Streaming sense-check",
          questions: [
            { question: "A partially-streamed JSON object can be safely passed to json.loads at any moment.", type: "true_false", correct_answer: "false", explanation: "It is invalid until the final closing brace; json.loads raises on the fragment." },
            { question: "The growing string that accumulates streamed chunks is called the ______.", type: "fill_in", correct_answer: "buffer", explanation: "Chunks are appended to the buffer until it forms valid structure." }
          ]
        }
      ],
      starter_code: `# Simulate a stream: only the final buffer is complete, valid JSON.
import json
chunks = ['{"items": [', '{"name": "Apple"},', ' {"name": "Pear"}]}']

buffer = ""
# TODO: accumulate chunks; try json.loads each time; print when it parses.
for c in chunks:
    buffer += c
    print("buffer so far:", buffer)
`,
      solution_code: `import json
chunks = ['{"items": [', '{"name": "Apple"},', ' {"name": "Pear"}]}']

buffer = ""
result = None
for c in chunks:
    buffer += c
    try:
        result = json.loads(buffer)
        print("complete after this chunk")
    except json.JSONDecodeError:
        print("not complete yet")

print("final items:", [it["name"] for it in result["items"]])
`,
      expected_output: `not complete yet
not complete yet
complete after this chunk
final items: ['Apple', 'Pear']`,
      step_throughs: [
        {
          title: "rendering a list as it streams in",
          steps: [
            { label: "First chunk lands", detail: "Only the opening of the object has arrived. The buffer is not valid JSON yet.", code: 'buffer = \'{"items": [\'  ->  json.loads raises' },
            { label: "An item closes", detail: "After more chunks, one complete item object has fully arrived inside the still-open array.", code: 'buffer = \'{"items": [{"name": "Apple"},\'' },
            { label: "Try the full parse", detail: "json.loads on the whole buffer still fails because the array and object are not closed.", code: 'try: json.loads(buffer)  ->  JSONDecodeError' },
            { label: "Final brace arrives", detail: "The closing ] and } complete the object; now the full parse succeeds and you render everything.", code: 'json.loads(buffer)  ->  {"items": [...]}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A stream has delivered the buffer {"name": "Da so far. You call json.loads(buffer). What happens?',
          steps: [
            'The buffer is an incomplete object: the string value is unterminated and there is no closing brace.',
            'json.loads cannot parse invalid JSON, so it raises a JSONDecodeError.',
            'This is the expected mid-stream state — you catch it and keep accumulating chunks.'
          ],
          output: "json.loads raises JSONDecodeError; you treat it as 'not done yet' and append more chunks."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You stream a list of search results and want to show each result the instant it is complete, not wait for all ten. Sketch how partial parsing achieves this.",
          steps: [
            "Accumulate incoming chunks into a buffer as usual.",
            "Each time the buffer grows, scan it for fully-closed objects inside the array (balanced braces, ending in } ).",
            "Render any newly-completed object that you have not shown yet, tracking how many you have already rendered.",
            "When the final ] and } arrive, the full json.loads succeeds and confirms the complete list."
          ],
          output: "Extract and render each fully-closed array element as it completes, instead of waiting for the whole list."
        }
      ],
      comparison_tables: [
        {
          title: "non-streaming vs streaming structured output",
          columns: ["Aspect", "Wait for full response", "Stream incrementally"],
          rows: [
            { cells: ["First content visible", "After the whole object (slow)", "As soon as a piece completes"] },
            { cells: ["Parsing", "One json.loads at the end", "Repeated try / fall back"] },
            { cells: ["Mid-flight buffer", "Not applicable", "Invalid until the last brace"] },
            { cells: ["Perceived speed", "Feels laggy", "Feels fast and alive"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "valid to parse now vs still incomplete",
          bins: [
            { id: "valid", label: "Complete — json.loads works" },
            { id: "incomplete", label: "Incomplete — will raise" }
          ],
          items: [
            { id: "i1", text: '{"name": "Dana"}', bin: "valid" },
            { id: "i2", text: '{"name": "Da', bin: "incomplete" },
            { id: "i3", text: '{"items": [{"a": 1}]}', bin: "valid" },
            { id: "i4", text: '{"items": [{"a": 1},', bin: "incomplete" },
            { id: "i5", text: '[1, 2, 3]', bin: "valid" },
            { id: "i6", text: '{"x":', bin: "incomplete" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does streaming structured output require a different parsing strategy than handling a complete response?",
          sampleAnswer: "A complete response is valid JSON, so a single json.loads call turns it into usable data. A streamed response arrives in fragments, and every fragment before the final closing brace is syntactically invalid, so json.loads throws on it. That means you cannot parse-once at the end if you want early output; instead you accumulate chunks into a buffer and repeatedly attempt to parse, treating the decode errors as the normal 'not finished yet' state and surfacing complete pieces only as they genuinely close."
        }
      ],
      hints: [
        "Append each chunk to a buffer string before trying to parse.",
        "Wrap json.loads in try/except json.JSONDecodeError and treat the error as 'not done yet'.",
        "After the loop, the last successful parse holds the complete object; read result['items']."
      ],
      challenge_title: "Stream the Buffer",
      challenge_description: "Replay a stream of chunks, attempting a parse after each one, and report when the structured object first becomes complete.",
      challenge_story: "Your chat UI streams the model's JSON answer so users see content fast, but the rendering layer needs to know the exact moment the buffer becomes valid, parseable JSON — that is when it can stop showing a placeholder and render the real object.\n\nYou are building the test harness for that logic. Given a recorded stream of chunks, replay them in order, concatenating into a buffer, and after each chunk attempt to parse the buffer so far. Report at which chunk the object first parses successfully, and how many parse attempts failed before that.",
      challenge_statement: "You are given `n` chunks, one per line, in arrival order. Concatenate them into a buffer **in order** (no separators added). After appending each chunk, attempt to parse the **entire buffer so far** with a JSON parser.\n\nProcess the chunks in order and stop at the **first** chunk after which the buffer parses as valid JSON. Then print:\n- Line 1: `COMPLETE k` where `k` is the 1-based index of the chunk after which the buffer first parsed successfully.\n- Line 2: `FAILS f` where `f` is the number of parse attempts that failed **before** that success (that is, `k - 1`).\n\nIf the buffer never parses after any chunk, print `INCOMPLETE` on line 1 and `FAILS n` on line 2 (every attempt failed).",
      challenge_input_format: "Line 1: an integer `n`, the number of chunks. Each of the next `n` lines is one chunk (it may contain spaces and JSON punctuation; it will not contain a newline).",
      challenge_output_format: "Line 1: `COMPLETE k` or `INCOMPLETE`. Line 2: `FAILS f`.",
      challenge_constraints: [
        "1 <= n <= 1000",
        "Each chunk line is at most 500 characters.",
        "Chunks are concatenated with no separator between them.",
        "A buffer is 'complete' the first time json.loads succeeds on the full concatenation so far.",
        "If no prefix ever parses, output INCOMPLETE and FAILS n."
      ],
      challenge_examples: [
        {
          input: '3\n{"items": [\n{"name": "Apple"},\n {"name": "Pear"}]}',
          output: "COMPLETE 3\nFAILS 2",
          explanation: "After chunk 1 and chunk 2 the buffer is incomplete and fails to parse. After chunk 3 the full object parses, so it completes at chunk 3 with 2 prior failures."
        },
        {
          input: '2\n{"ok":\n true}',
          output: "COMPLETE 2\nFAILS 1",
          explanation: 'After chunk 1 the buffer {"ok": is invalid. After chunk 2 it becomes {"ok": true}, which parses. One failure before success.'
        }
      ],
      challenge_notes: "Catch json.JSONDecodeError (a subclass of ValueError) after each append and treat it as the normal 'not done yet' signal. Note that a buffer can become valid earlier than the final chunk if the object closes early, so stop at the first success. The number of failures is always just the index of success minus one.",
      challenge_hints: [
        "Build the buffer by appending each raw chunk with no separator, then try json.loads after each append.",
        "Wrap json.loads in try/except ValueError; on success, record the 1-based chunk index and stop.",
        "If you finish the loop without a successful parse, the answer is INCOMPLETE with FAILS equal to n."
      ],
      challenge_starter_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]
    # TODO: append each chunk to a buffer, try json.loads after each,
    # and report the first chunk that completes plus the failures before it.

main()
`,
      challenge_solution_code: `import sys, json

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]
    buffer = ""
    for i, chunk in enumerate(chunks, start=1):
        buffer += chunk
        try:
            json.loads(buffer)
        except ValueError:
            continue
        print(f"COMPLETE {i}")
        print(f"FAILS {i - 1}")
        return
    print("INCOMPLETE")
    print(f"FAILS {n}")

main()
`,
      challenge_test_cases: [
        { input: '3\n{"items": [\n{"name": "Apple"},\n {"name": "Pear"}]}', expected_output: "COMPLETE 3\nFAILS 2", description: "The object completes only after the final chunk closes the array and object." },
        { input: '2\n{"ok":\n true}', expected_output: "COMPLETE 2\nFAILS 1", description: "A two-chunk object that parses on the second chunk." },
        { input: '2\n{"never":\n "closed"', expected_output: "INCOMPLETE\nFAILS 2", description: "The object never closes its brace, so no prefix ever parses." },
        { input: '1\n{"done": true}', expected_output: "COMPLETE 1\nFAILS 0", description: "A single chunk that is already complete parses immediately with zero failures." }
      ]
    }
  ]
};
