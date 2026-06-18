export default {
  project: {
    id: "ai-10",
    title: "Structured Outputs",
    description: "Stop wrestling with free-form model replies. Learn to force LLMs into clean, parseable JSON using JSON mode, schemas, function calling, and validation so the output plugs straight into real code.",
    difficulty: "intermediate",
    category: "prompting",
    estimated_time: 50,
    lessons_count: 5,
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
    }
  ]
};
