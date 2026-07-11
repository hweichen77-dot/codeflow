export default {
  project: {
    id: "prod-06",
    title: "Structured JSON Extractor",
    description:
      "Build a tool that reads messy free text, a signature block, a pasted receipt, a paragraph of notes, and returns the same strict JSON every time. You'll extract contacts and invoices, parse and repair the model's reply, and validate that every required field is present before you trust it.",
    difficulty: "intermediate",
    category: "prompting",
    estimated_time: 120,
    lessons_count: 8,
    tags: ["json", "extraction", "schema", "validation", "parsing", "prompting"],
    order: 106,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-06-1",
      project_id: "prod-06",
      order: 1,
      title: "Turning Mess into a Fixed Shape",
      concept: "the extraction job",
      explanation: `Raw text is everywhere: a signature block at the bottom of an email, a receipt someone pasted into a chat, a paragraph of meeting notes. A human reads it fine. Software can't do anything with it until it has structure. A **structured extractor** is the bridge: it reads messy free text and returns the same fixed set of fields every time, as JSON your program can trust.

## What we're building

Over eight lessons you'll build a tool that turns messy text into validated structured JSON: **contacts** (name, email, phone) and **invoices** (id, total, line items). The output is never a paragraph, it's a strict object with known keys, ready to drop into a database row or a spreadsheet cell.

## The one idea: a target schema

Everything starts with the **schema**, the exact shape you demand back. For a contact:

\`\`\`python
SCHEMA = {
    "name": "string",
    "email": "string",
    "phone": "string or null",
}
\`\`\`

The schema is a contract. It names every field, so the model knows what to look for and your code knows what to expect. No schema, no reliability: the model returns a slightly different shape on every call and your parser is left guessing.

## The loop, with the work in two steps

It's the same six-step loop from the playbook. The special work lives in **prompt** and **parse**:

1. **Input** — the messy text.
2. **Prompt** — "extract exactly these fields as JSON."
3. **Call** — send it to the model.
4. **Parse** — pull the JSON object out of the reply.
5. **Validate** — are the required fields present and the right type?
6. **Ship** — a clean record.

Here's the real call you're heading toward:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="Extract a contact as JSON with keys name, email, phone.",
    messages=[{"role": "user", "content": "Reach Ada at ada@x.com."}],
)
print(msg.content[0].text)
\`\`\`

## Why "every time" is the hard part

Extracting one clean business card is a demo. Extracting ten thousand, some missing a phone, some with two emails, some where the model wrapped the JSON in chatty text, is the actual product. The schema is what makes that survivable: once you know the exact shape you want, you can check the model against it and repair whatever is off.

## The drill below

No network here. You'll define a schema and write the check that reports which required fields a record is **missing**, the smallest piece of the validation you'll build up over the next seven lessons.`,
      starter_code: `# The smallest piece of validation: which required fields are missing?

SCHEMA = ["name", "email", "phone"]

def missing_fields(record, schema):
    # TODO: return the schema fields that are absent OR present but empty
    pass

record = {"name": "Ada Lovelace", "email": "ada@example.com", "phone": ""}
print("Fields:", ", ".join(SCHEMA))
`,
      solution_code: `# The smallest piece of validation: which required fields are missing?

SCHEMA = ["name", "email", "phone"]

def missing_fields(record, schema):
    return [f for f in schema if record.get(f) in (None, "")]

record = {"name": "Ada Lovelace", "email": "ada@example.com", "phone": ""}

miss = missing_fields(record, SCHEMA)
print("Fields:", ", ".join(SCHEMA))
print("Missing:", ", ".join(miss) if miss else "none")
print("Complete:", not miss)
`,
      hints: [
        "record.get(field) returns None when the key is absent, which you can treat as missing.",
        "An empty string \"\" should count as missing too, so check `in (None, \"\")`.",
        "Build the missing list with a comprehension over the schema, keeping schema order.",
      ],
      challenge_title: "Required Field Audit",
      challenge_description:
        "Given a required-field schema and a batch of extracted records, count how many records are complete (every required field present with a non-empty value).",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    f = int(data[idx]); idx += 1
    fields = [data[idx + i].strip() for i in range(f)]; idx += f
    r = int(data[idx]); idx += 1
    # Each of the next r lines is a record: space-separated key=value pairs.

    # TODO: count records where every required field appears with a non-empty value.
    # TODO: print that count.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    f = int(data[idx]); idx += 1
    fields = [data[idx + i].strip() for i in range(f)]; idx += f
    r = int(data[idx]); idx += 1

    complete = 0
    for i in range(r):
        line = data[idx + i]
        record = {}
        for pair in line.split():
            if "=" in pair:
                k, v = pair.split("=", 1)
                record[k] = v
        if all(record.get(fld, "") != "" for fld in fields):
            complete += 1

    print(complete)

main()
`,
      challenge_test_cases: [
        {
          input: "3\nname\nemail\nphone\n2\nname=Ada email=ada@x.com phone=123\nname=Bob email=bob@x.com",
          expected_output: "1",
          description: "First record has all three fields; second is missing phone, so only one is complete.",
        },
        {
          input: "2\nname\nemail\n2\nname=A email=a@x\nname=B email=b@x",
          expected_output: "2",
          description: "Both records carry every required field, so both count.",
        },
        {
          input: "2\nname\nphone\n1\nname=C phone=",
          expected_output: "0",
          description: "Edge: a field present with an empty value counts as missing.",
        },
      ],
    },

    {
      id: "prod-06-2",
      project_id: "prod-06",
      order: 2,
      title: "Put the Schema in the Prompt",
      concept: "schema-in-the-prompt",
      explanation: `The model will return whatever shape it feels like unless you tell it exactly what you want. "Give me the contact info" gets you a friendly paragraph. The fix is to put the **schema in the prompt**: spell out the exact keys, the exact types, and demand JSON and nothing else.

## Describe the shape, key by key

Don't ask for "the data." Ask for a JSON object with named keys and say what each one holds:

\`\`\`python
SCHEMA = {"name": "string", "email": "string", "phone": "string or null"}

def build_system(schema):
    lines = ["Extract a contact as a JSON object with exactly these keys:"]
    for key, typ in schema.items():
        lines.append(f'- "{key}": {typ}')
    lines.append("Return only the JSON object. No prose, no code fences.")
    return "\\n".join(lines)
\`\`\`

Building the prompt from the schema dict means one source of truth. Change the schema and the instructions change with it, they can't drift apart.

## Show one tiny example

A single example pins down the shape faster than a paragraph of rules. This is **one-shot prompting**: include an input and its ideal JSON output right in the system prompt. The model pattern-matches on it.

## Say what to do with missing data

The most common bug in extraction is invention: no phone in the text, so the model makes one up. Head it off in the prompt: "If a field is not present in the text, use null. Never guess." That one sentence turns a hallucinating extractor into an honest one.

## The real call

\`\`\`python
msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=build_system(SCHEMA),
    messages=[{"role": "user", "content": raw_text}],
)
import json
data = json.loads(msg.content[0].text)   # works only when output is clean
\`\`\`

That \`json.loads\` is the happy path, it works when the model returns bare JSON. Later lessons handle the (frequent) case where it doesn't.

## Why this matters

The prompt is the cheapest reliability you can buy. Every field name you spell out, every "use null when absent," every one-shot example, is a bug you don't have to catch downstream. A vague prompt fails silently: the reply looks plausible and breaks your parser one call in a hundred.

## The drill below

You'll build the system prompt from a schema dict, then parse a clean sample reply with \`json.loads\` and confirm its keys match the schema exactly.`,
      starter_code: `import json

SCHEMA = {"name": "string", "email": "string", "phone": "string or null"}

def build_system(schema):
    # TODO: produce a prompt that lists each key and its type, one per line,
    #       and ends by demanding JSON-only output.
    pass

reply = '{"name": "Grace Hopper", "email": "grace@navy.mil", "phone": null}'
print(build_system(SCHEMA))
`,
      solution_code: `import json

SCHEMA = {"name": "string", "email": "string", "phone": "string or null"}

def build_system(schema):
    lines = ["Extract a contact as a JSON object with exactly these keys:"]
    for key, typ in schema.items():
        lines.append(f'- "{key}": {typ}')
    lines.append("Return only the JSON object. No prose, no code fences.")
    return "\\n".join(lines)

system = build_system(SCHEMA)
print(system)

reply = '{"name": "Grace Hopper", "email": "grace@navy.mil", "phone": null}'
data = json.loads(reply)
print("Parsed name:", data["name"])
print("Keys match:", sorted(data.keys()) == sorted(SCHEMA.keys()))
`,
      hints: [
        "Loop over schema.items() to emit one bullet line per field.",
        "Join the lines with \"\\n\" so the prompt is one multi-line string.",
        "Compare sorted(data.keys()) to sorted(SCHEMA.keys()) to check the shape matches.",
      ],
      challenge_title: "Schema Prompt Builder",
      challenge_description:
        "Given a list of field/type pairs, print the exact schema instruction block a structured extractor would send to the model.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # The next n lines are each "field type" (the type may contain spaces).

    # TODO: print "Extract JSON with keys:", then one '- "field": type' line per field,
    #       then a final line "Return only JSON.".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    print("Extract JSON with keys:")
    for i in range(1, n + 1):
        field, typ = data[i].split(" ", 1)
        print(f'- "{field}": {typ}')
    print("Return only JSON.")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nname string\nphone string or null",
          expected_output:
            'Extract JSON with keys:\n- "name": string\n- "phone": string or null\nReturn only JSON.',
          description: "Two fields; the multi-word type is preserved after the first space.",
        },
        {
          input: "1\nemail string",
          expected_output: 'Extract JSON with keys:\n- "email": string\nReturn only JSON.',
          description: "A single field still gets the header and footer lines.",
        },
      ],
    },

    {
      id: "prod-06-3",
      project_id: "prod-06",
      order: 3,
      title: "Digging the JSON Out of the Reply",
      concept: "robust JSON parsing",
      explanation: `You asked for JSON and only JSON. The model, being helpful, often returns \`Sure! Here is the contact:\` and then the JSON, or wraps it in a Markdown code fence. Feed that straight to \`json.loads\` and it throws. The fix is to stop trusting the reply to be clean and instead **dig the JSON object out** of whatever came back.

## The reply is rarely bare JSON

Three shapes you'll see constantly:

- Chatty prefix: \`Here's what I found:\\n{"name": "Ada"}\`
- Code fence: three backticks, \`json\`, the object, three backticks.
- Trailing note: \`{"name": "Ada"} Let me know if you need more!\`

## Find the object by its braces

A JSON object starts at the first \`{\` and ends at the last \`}\`. Slice between them and you've dropped the prose on either side:

\`\`\`python
def extract_json(text):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("no JSON object found")
    return text[start:end + 1]
\`\`\`

\`find\` gives the first opening brace, \`rfind\` the last closing brace. Everything before \`start\` and after \`end\` is chatter you throw away. This survives the code fence too, backticks live outside the braces, so slicing skips them.

## Then parse the slice

\`\`\`python
import json

raw = msg.content[0].text
data = json.loads(extract_json(raw))
\`\`\`

Parsing the **slice** instead of the raw reply is the whole trick. \`json.loads(raw)\` chokes on the prefix; \`json.loads(extract_json(raw))\` doesn't, because the prefix is gone.

## Why not just ask the model to stop adding text?

You do, in the prompt, and it helps. But "return only JSON" is a strong nudge, not a guarantee. Robust products assume the instruction sometimes fails and handle the mess anyway. Prompt for clean output, parse defensively regardless. Belt and suspenders.

## The mental model to keep

The reply is a haystack; the JSON is the needle. Don't demand a needle-only haystack, learn to find the needle. First brace to last brace is your magnet.

## The drill below

You'll write \`extract_json\` and run it over three messy replies, prefix, code fence, trailing note, parsing each one into a dict.`,
      starter_code: `import json

def extract_json(text):
    # TODO: return the substring from the first "{" to the last "}" (inclusive).
    #       Raise ValueError if there is no object.
    pass

replies = [
    'Sure! Here is the contact:\\n{"name": "Ada", "email": "ada@x.com"}',
    '\`\`\`json\\n{"name": "Bob", "email": "bob@x.com"}\\n\`\`\`',
    '{"name": "Cid", "email": "cid@x.com"} Hope that helps!',
]
for r in replies:
    print(r)
`,
      solution_code: `import json

def extract_json(text):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("no JSON object found")
    return text[start:end + 1]

replies = [
    'Sure! Here is the contact:\\n{"name": "Ada", "email": "ada@x.com"}',
    '\`\`\`json\\n{"name": "Bob", "email": "bob@x.com"}\\n\`\`\`',
    '{"name": "Cid", "email": "cid@x.com"} Hope that helps!',
]

for r in replies:
    obj = json.loads(extract_json(r))
    print(obj["name"], "->", obj["email"])
`,
      hints: [
        "str.find returns the index of the first match; str.rfind returns the last.",
        "Slice text[start:end + 1] so the closing brace is included.",
        "Guard against -1 (no brace found) before slicing so you fail loudly, not silently.",
      ],
      challenge_title: "Dig Out the JSON",
      challenge_description:
        "Given a model reply that may have prose or code fences around it, print just the JSON object, from the first brace to the last, or NONE if there isn't one.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    text = sys.stdin.read()
    # TODO: slice from the first "{" to the last "}" (inclusive) and print it.
    # TODO: if there is no valid pair of braces, print "NONE".

main()
`,
      challenge_solution_code: `import sys

def main():
    text = sys.stdin.read()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        print("NONE")
        return
    print(text[start:end + 1])

main()
`,
      challenge_test_cases: [
        {
          input: 'Here you go: {"a": 1, "b": {"c": 2}} thanks',
          expected_output: '{"a": 1, "b": {"c": 2}}',
          description: "Prose on both sides is stripped; the last brace closes the outer object.",
        },
        {
          input: 'no json in this line at all',
          expected_output: "NONE",
          description: "No braces means nothing to extract.",
        },
        {
          input: '```json\n{"name": "Bob"}\n```',
          expected_output: '{"name": "Bob"}',
          description: "Code-fence backticks sit outside the braces, so the slice skips them.",
        },
      ],
    },

    {
      id: "prod-06-4",
      project_id: "prod-06",
      order: 4,
      title: "Repairing Broken JSON",
      concept: "JSON repair",
      explanation: `Sometimes the slice you dug out still won't parse. The model left a trailing comma, or the whole thing is fenced, or a stray character snuck in. Rather than fail the extraction, you run a small **repair pass**: a few cheap, safe fixes that turn almost-JSON into real JSON before \`json.loads\`.

## The breakages you'll actually see

- **Code fences**: the reply is wrapped in three backticks and \`json\`.
- **Trailing commas**: \`{"a": 1, "b": 2,}\`, legal in Python, illegal in JSON.
- **Leading/trailing whitespace** around the object.

Single quotes and unquoted keys also happen, but repairing those safely is hard (an apostrophe inside a name would break naive fixes), so we leave them to a retry, not a regex.

## A small, safe repair function

\`\`\`python
import re, json

def repair_json(text):
    text = text.strip()
    text = re.sub(r"^\`\`\`[a-zA-Z]*\\n", "", text)   # drop opening fence
    text = re.sub(r"\\n\`\`\`$", "", text)            # drop closing fence
    start, end = text.find("{"), text.rfind("}")
    text = text[start:end + 1]
    text = re.sub(r",(\\s*[}\\]])", r"\\1", text)     # kill trailing commas
    return text
\`\`\`

The trailing-comma regex reads: a comma followed by optional whitespace and then a closing \`}\` or \`]\`, replace it with just the closing bracket. That single line handles the single most common JSON breakage from LLMs.

## Repair, then parse, then know when to quit

\`\`\`python
def parse_or_none(raw):
    try:
        return json.loads(repair_json(raw))
    except (ValueError, json.JSONDecodeError):
        return None
\`\`\`

Return \`None\` on failure rather than crashing. \`None\` is a signal the caller can act on: log it, retry with the model, or flag the record for a human. A crash in the middle of a ten-thousand-row batch loses the other 9,999.

## Don't over-repair

Every repair rule is a small risk of corrupting good data. Keep the set tiny and boring: fences and trailing commas cover the vast majority. When those aren't enough, the right move is to **ask the model again** (next lesson), not to bolt on ten more fragile regexes.

## The drill below

You'll write \`repair_json\`, feed it a fenced object with a trailing comma, and confirm it parses cleanly afterward.`,
      starter_code: `import re, json

def repair_json(text):
    # TODO: strip a leading/trailing code fence, slice to the braces,
    #       and remove trailing commas before } or ]. Return the cleaned string.
    pass

broken = '\`\`\`json\\n{"name": "Ada", "email": "ada@x.com",}\\n\`\`\`'
print(broken)
`,
      solution_code: `import re, json

def repair_json(text):
    text = text.strip()
    text = re.sub(r"^\`\`\`[a-zA-Z]*\\n", "", text)
    text = re.sub(r"\\n\`\`\`$", "", text)
    start, end = text.find("{"), text.rfind("}")
    text = text[start:end + 1]
    text = re.sub(r",(\\s*[}\\]])", r"\\1", text)
    return text

broken = '\`\`\`json\\n{"name": "Ada", "email": "ada@x.com",}\\n\`\`\`'
fixed = repair_json(broken)
print(fixed)
data = json.loads(fixed)
print("ok:", data["name"])
`,
      hints: [
        "Strip whitespace first so the fence anchors ^ and $ line up.",
        "The trailing-comma pattern is r\",(\\s*[}\\]])\" replaced with r\"\\1\".",
        "Wrap the final json.loads in try/except so a still-broken string returns None instead of crashing.",
      ],
      challenge_title: "Strip the Trailing Commas",
      challenge_description:
        "Given an almost-JSON string, remove every comma that sits just before a closing brace or bracket (allowing whitespace between) and print the repaired string.",
      challenge_language: "python",
      challenge_starter_code: `import sys, re

def main():
    text = sys.stdin.read().rstrip("\\n")
    # TODO: delete each comma that is followed by optional whitespace then } or ].
    # TODO: print the repaired text.

main()
`,
      challenge_solution_code: `import sys, re

def main():
    text = sys.stdin.read().rstrip("\\n")
    print(re.sub(r",(\\s*[}\\]])", r"\\1", text))

main()
`,
      challenge_test_cases: [
        {
          input: '{"a": 1,}',
          expected_output: '{"a": 1}',
          description: "A comma directly before the closing brace is removed.",
        },
        {
          input: '{"a": 1, "b": [1, 2,], }',
          expected_output: '{"a": 1, "b": [1, 2] }',
          description: "Trailing commas before ] and } both go; interior commas stay.",
        },
        {
          input: '{"a": 1}',
          expected_output: '{"a": 1}',
          description: "Already-clean JSON is left untouched.",
        },
      ],
    },

    {
      id: "prod-06-5",
      project_id: "prod-06",
      order: 5,
      title: "Validating the Required Fields",
      concept: "field validation",
      explanation: `The JSON parsed. That only means it was well-formed, not that it was **correct**. The extractor's real job is a contract: every required field present, and each value the right type. Parsing is syntax; validation is meaning. This lesson is the spine of the whole tool.

## Parsing success is not correctness

\`json.loads\` happily accepts \`{"name": "Ada"}\` even when your schema demands name, email, and phone. It accepts \`{"amount": "fifty"}\` when amount should be a number. Nothing is wrong with the JSON; everything is wrong with the data. You have to check it yourself.

## Two checks: presence and type

\`\`\`python
SCHEMA = {"name": str, "email": str, "amount": (int, float)}
REQUIRED = ["name", "email", "amount"]

def validate(record, schema, required):
    errors = []
    for key in required:
        if record.get(key) is None:
            errors.append(f"missing: {key}")
    for key, expected in schema.items():
        value = record.get(key)
        if value is not None and not isinstance(value, expected):
            errors.append(f"wrong type: {key}")
    return errors
\`\`\`

Presence first: a required key that's absent or \`null\` is a \`missing\` error. Then type: a present value that isn't the expected Python type is a \`wrong type\` error. An empty error list means the record is valid.

## Normalize while you're here

Extraction output should be predictable. If an optional field is absent, set it to \`None\` explicitly rather than leaving the key off, so every record has the same keys:

\`\`\`python
def finalize(record, schema):
    return {key: record.get(key) for key in schema}
\`\`\`

Now downstream code can write \`record["phone"]\` without a \`KeyError\`, whether the phone was found or not.

## Why this is the product

An extractor without validation is a guess with extra steps. The value isn't that the model returned *something*, it's that you can **prove** what it returned meets the contract before it lands in your database. Validation is the difference between "the model usually gets it right" and "bad records never reach production." When a record fails, you don't ship it, you retry or flag it, which is exactly the next lesson.

## The drill below

You'll validate a parsed record against a schema of required fields and types, and report each error, catching a value that's the wrong type.`,
      starter_code: `SCHEMA = {"name": str, "email": str, "amount": (int, float)}
REQUIRED = ["name", "email", "amount"]

def validate(record, schema, required):
    # TODO: collect "missing: X" for required keys that are absent/None,
    #       and "wrong type: X" for present values of the wrong type.
    pass

record = {"name": "Ada", "email": "ada@x.com", "amount": "50"}
print("record:", record)
`,
      solution_code: `SCHEMA = {"name": str, "email": str, "amount": (int, float)}
REQUIRED = ["name", "email", "amount"]

def validate(record, schema, required):
    errors = []
    for key in required:
        if record.get(key) is None:
            errors.append(f"missing: {key}")
    for key, expected in schema.items():
        value = record.get(key)
        if value is not None and not isinstance(value, expected):
            errors.append(f"wrong type: {key}")
    return errors

record = {"name": "Ada", "email": "ada@x.com", "amount": "50"}
errs = validate(record, SCHEMA, REQUIRED)
print("valid:", not errs)
for e in errs:
    print(e)
`,
      hints: [
        "record.get(key) is None catches both an absent key and an explicit null.",
        "isinstance accepts a tuple of types, so (int, float) means 'either int or float'.",
        "Skip the type check when the value is None so a missing field isn't also flagged as wrong-type.",
      ],
      challenge_title: "Validate Against the Schema",
      challenge_description:
        "Given the required fields and the fields actually present in a record, report whether it's VALID or list the missing fields.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    required = [data[idx + i].strip() for i in range(n)]; idx += n
    m = int(data[idx]); idx += 1
    present = {data[idx + i].strip() for i in range(m)}; idx += m

    # TODO: if every required field is present, print "VALID".
    # TODO: otherwise print "MISSING: " + the absent required fields, sorted, comma-space joined.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    required = [data[idx + i].strip() for i in range(n)]; idx += n
    m = int(data[idx]); idx += 1
    present = {data[idx + i].strip() for i in range(m)}; idx += m

    missing = [f for f in required if f not in present]
    if not missing:
        print("VALID")
    else:
        print("MISSING: " + ", ".join(sorted(missing)))

main()
`,
      challenge_test_cases: [
        {
          input: "3\nname\nemail\nphone\n2\nname\nemail",
          expected_output: "MISSING: phone",
          description: "phone is required but not present.",
        },
        {
          input: "1\nname\n2\nname\nextra",
          expected_output: "VALID",
          description: "Every required field is present; extra fields don't matter.",
        },
        {
          input: "3\na\nb\nc\n0",
          expected_output: "MISSING: a, b, c",
          description: "Edge: an empty record is missing everything, listed sorted.",
        },
      ],
    },

    {
      id: "prod-06-6",
      project_id: "prod-06",
      order: 6,
      title: "When It Fails, Ask Again",
      concept: "retry with feedback",
      explanation: `Real inputs break things. The text is empty. The model returns two fields when you needed three. A value comes back the wrong type. A production extractor doesn't crash on these, it **recovers**: it handles the empty case without a call, and when validation fails it asks the model again, telling it exactly what was wrong.

## Handle the empty case first

The cheapest call is the one you don't make. Empty or whitespace-only input has nothing to extract, so short-circuit it:

\`\`\`python
def extract(text, schema):
    if not text.strip():
        return {key: None for key in schema}, ["empty input"]
    # ... otherwise call the model
\`\`\`

No tokens spent, no hallucinated fields, a predictable all-null record.

## Retry with the error in the prompt

When a parsed record fails validation, don't just retry blindly, tell the model what broke. Feeding the validation errors back sharpens the second attempt:

\`\`\`python
def extract_with_retry(text, schema, required, max_retries=2):
    for attempt in range(max_retries + 1):
        record = call_and_parse(text, schema)
        errors = validate(record, schema, required)
        if not errors:
            return record, attempt + 1, True
        text_hint = text + "\\n\\nYour last answer had: " + "; ".join(errors)
        text = text_hint
    return record, max_retries + 1, False
\`\`\`

Each retry appends the specific problems (\`missing: phone\`) so the model corrects that exact gap instead of guessing again.

## Cap the retries

Retries cost money and time, and some inputs genuinely lack the data, no amount of re-asking will find a phone number that was never in the text. So cap attempts (two retries is a sane default) and, on final failure, return the best record you have with a \`valid: False\` flag. The caller decides: store it flagged, drop it, or send it to a human. What you never do is loop forever.

## Why this matters

The gap between a demo and a tool is exactly this behavior: fails politely, recovers when it can, and gives up cleanly when it can't. An extractor that surfaces "3 records need review" is trustworthy. One that silently writes garbage, or crashes on row 4,000, is not.

## The drill below

You'll simulate the retry loop over a sequence of fake replies, the first invalid, the next fixed, and confirm it stops as soon as a valid one arrives, reporting how many attempts it took.`,
      starter_code: `def validate(record, required):
    return [f"missing: {k}" for k in required if not record.get(k)]

def extract_with_retry(fake_replies, required, max_retries=2):
    # TODO: walk the replies; return (record, attempt_number, True) on the first valid one.
    #       If a reply is invalid and you're past max_retries, return (record, attempt, False).
    pass

required = ["name", "email"]
replies = [
    {"name": "Ada"},
    {"name": "Ada", "email": "ada@x.com"},
]
print("required:", required)
`,
      solution_code: `def validate(record, required):
    return [f"missing: {k}" for k in required if not record.get(k)]

def extract_with_retry(fake_replies, required, max_retries=2):
    for attempt, reply in enumerate(fake_replies, start=1):
        errors = validate(reply, required)
        if not errors:
            return reply, attempt, True
        if attempt > max_retries:
            return reply, attempt, False
    return fake_replies[-1], len(fake_replies), False

required = ["name", "email"]
replies = [
    {"name": "Ada"},
    {"name": "Ada", "email": "ada@x.com"},
]

record, attempts, ok = extract_with_retry(replies, required)
print("attempts:", attempts)
print("valid:", ok)
print("email:", record.get("email"))
`,
      hints: [
        "enumerate(replies, start=1) gives you a 1-indexed attempt number.",
        "Return immediately when validate returns an empty error list.",
        "Only give up (return False) once the attempt number exceeds max_retries.",
      ],
      challenge_title: "Retry Until Valid",
      challenge_description:
        "Given a retry budget and a sequence of attempt outcomes, print the 1-indexed attempt that first succeeded within budget, or FAILED.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k, n = map(int, data[0].split())
    # k = max retries (so k+1 attempts allowed). Next n lines are "valid" or "invalid".

    # TODO: find the first "valid" attempt within the first k+1 attempts; print its 1-index.
    # TODO: if none succeed within budget, print "FAILED".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k, n = map(int, data[0].split())
    budget = k + 1
    for i in range(1, n + 1):
        if i > budget:
            break
        if data[i].strip() == "valid":
            print(i)
            return
    print("FAILED")

main()
`,
      challenge_test_cases: [
        {
          input: "2 3\ninvalid\ninvalid\nvalid",
          expected_output: "3",
          description: "With 3 attempts allowed (2 retries), the third succeeds in budget.",
        },
        {
          input: "1 3\ninvalid\ninvalid\nvalid",
          expected_output: "FAILED",
          description: "Only 2 attempts allowed; both are invalid, so it fails before reaching the valid third.",
        },
        {
          input: "0 1\nvalid",
          expected_output: "1",
          description: "Edge: zero retries still allows the first attempt, which succeeds.",
        },
      ],
    },

    {
      id: "prod-06-7",
      project_id: "prod-06",
      order: 7,
      title: "Invoices, Nesting, and Cost",
      concept: "nested schemas and totals",
      explanation: `Contacts are flat, three string fields. Invoices are the harder, more valuable case: an id, a total, and a **list of line items**, each with its own fields. Nesting brings a new kind of validation you can't do on contacts: the numbers have to add up. And bigger documents bring a new concern: cost.

## Nested schema

An invoice's schema has an array of objects inside it:

\`\`\`python
INVOICE_SCHEMA = {
    "invoice_id": "string",
    "total": "number",
    "items": [{"name": "string", "qty": "number", "price": "number"}],
}
\`\`\`

You spell the item shape out in the prompt too, so the model knows each line needs a name, quantity, and price.

## Validate the arithmetic

The killer check for invoices: the line items must sum to the stated total. If they don't, the extraction is wrong even if every field is present and typed correctly:

\`\`\`python
def validate_invoice(inv):
    errors = []
    for key in ("invoice_id", "total", "items"):
        if key not in inv:
            errors.append(f"missing: {key}")
    if errors:
        return errors
    computed = sum(it["qty"] * it["price"] for it in inv["items"])
    if computed != inv["total"]:
        errors.append(f"total mismatch: stated {inv['total']} vs computed {computed}")
    return errors
\`\`\`

This catches the model dropping a line item or misreading a price, errors that presence-and-type checks alone sail right past. Cross-field validation like this is where extraction earns its trust.

## Watch the cost of big documents

A contact is a sentence; an invoice can be a page. Roughly one token per four characters, and you pay for the input on every call, including every retry. A 4,000-character invoice is ~1,000 input tokens, and if you naively resend the whole thing on two retries you've tripled the bill for that record.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

Practical levers: don't retry more than you must, extract only the fields you actually need, and for a batch, measure the average document size before you run ten thousand of them.

## The drill below

You'll validate an invoice: required top-level fields present, then confirm the line items sum to the stated total, catching the arithmetic, not just the shape.`,
      starter_code: `def validate_invoice(inv):
    # TODO: require invoice_id, total, and items. If any are missing, return those errors.
    # TODO: otherwise check sum(qty * price over items) == total; if not, report the mismatch.
    pass

invoice = {
    "invoice_id": "INV-42",
    "total": 250,
    "items": [
        {"name": "Widget", "qty": 2, "price": 50},
        {"name": "Gadget", "qty": 3, "price": 50},
    ],
}
print("invoice:", invoice["invoice_id"])
`,
      solution_code: `def validate_invoice(inv):
    errors = []
    for key in ("invoice_id", "total", "items"):
        if key not in inv:
            errors.append(f"missing: {key}")
    if errors:
        return errors
    computed = sum(it["qty"] * it["price"] for it in inv["items"])
    if computed != inv["total"]:
        errors.append(f"total mismatch: stated {inv['total']} vs computed {computed}")
    return errors

invoice = {
    "invoice_id": "INV-42",
    "total": 250,
    "items": [
        {"name": "Widget", "qty": 2, "price": 50},
        {"name": "Gadget", "qty": 3, "price": 50},
    ],
}

errs = validate_invoice(invoice)
computed = sum(it["qty"] * it["price"] for it in invoice["items"])
print("valid:", not errs)
print("computed total:", computed)
`,
      hints: [
        "Check the three required keys first and return early if any are missing.",
        "Sum qty * price across the items list to get the computed total.",
        "Compare the computed total to inv['total']; append a mismatch error only when they differ.",
      ],
      challenge_title: "Reconcile the Invoice",
      challenge_description:
        "Given line items and a stated total, print OK if the items sum to the total, otherwise report the stated and computed values.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, total = map(int, data[0].split())
    # Next n lines are each "qty price".

    # TODO: compute sum(qty * price). Print "OK" if it equals total,
    #       else "MISMATCH stated=<total> computed=<sum>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, total = map(int, data[0].split())
    computed = 0
    for i in range(1, n + 1):
        qty, price = map(int, data[i].split())
        computed += qty * price
    if computed == total:
        print("OK")
    else:
        print(f"MISMATCH stated={total} computed={computed}")

main()
`,
      challenge_test_cases: [
        {
          input: "2 250\n2 50\n3 50",
          expected_output: "OK",
          description: "2*50 + 3*50 = 250 matches the stated total.",
        },
        {
          input: "2 300\n2 50\n3 50",
          expected_output: "MISMATCH stated=300 computed=250",
          description: "The line items sum to 250, not the stated 300.",
        },
        {
          input: "0 0",
          expected_output: "OK",
          description: "Edge: no line items sum to 0, which matches a stated total of 0.",
        },
      ],
    },

    {
      id: "prod-06-8",
      project_id: "prod-06",
      order: 8,
      title: "Ship the Extractor",
      concept: "the full pipeline",
      explanation: `Time to assemble the pieces into one function you can point at any messy text and trust the output. Everything you built, schema prompt, brace-slicing, repair, validation, normalization, becomes a single \`extract(text)\` that returns a clean record and a status. This is the deliverable.

## The pipeline, end to end

\`\`\`python
import os, json, re
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
SCHEMA = ["name", "email", "phone"]

def extract(text):
    if not text.strip():
        return {k: None for k in SCHEMA}, "EMPTY"
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system="Extract a contact as JSON with keys name, email, phone. Use null if absent.",
        messages=[{"role": "user", "content": text}],
    )
    record = repair_and_parse(msg.content[0].text)   # slice + repair + json.loads
    if record is None:
        return {k: None for k in SCHEMA}, "PARSE_ERROR"
    clean = {k: record.get(k) for k in SCHEMA}
    missing = [k for k in SCHEMA if clean[k] in (None, "")]
    return clean, ("INCOMPLETE" if missing else "COMPLETE")
\`\`\`

One entry point, three honest outcomes: \`COMPLETE\`, \`INCOMPLETE\`, or \`PARSE_ERROR\`. The caller always gets a full-shaped record and a status, never a crash.

## Make it a real tool

Wrap it in a tiny CLI so anyone can run it:

\`\`\`python
import sys
if __name__ == "__main__":
    text = sys.stdin.read()
    record, status = extract(text)
    print(json.dumps(record, indent=2))
    print("status:", status)
\`\`\`

Now \`cat email.txt | python extractor.py\` prints validated JSON. That's shippable: it runs from a clean start with one command, it handles empty and malformed input without crashing, and its output is documented by the schema.

## What "done" means here

- Every input yields a full-shaped record, never a missing key.
- Bad extractions are labeled (\`INCOMPLETE\`, \`PARSE_ERROR\`), not silently wrong.
- Someone else could run it from your instructions alone.

## It lands in your Portfolio

Finishing this lesson saves the **Structured JSON Extractor** to your **Portfolio** tab: a real tool that turns messy contacts and invoices into JSON you can trust. Keep a sample input and its output next to it, that pair is the proof it works.

## The drill below

You'll run the whole pipeline in pure Python, repair and parse a fenced, trailing-comma reply, normalize to the schema, and print the record plus its status.`,
      starter_code: `import json, re

SCHEMA = ["name", "email", "phone"]

def repair_and_parse(text):
    # TODO: strip a fence, slice to the braces, drop trailing commas, json.loads.
    #       Return the dict, or None if it still won't parse.
    pass

def finalize(record, schema):
    # TODO: return (clean_record_with_all_schema_keys, list_of_missing_keys)
    pass

fake_reply = '\`\`\`json\\n{"name": "Ada Lovelace", "email": "ada@x.com",}\\n\`\`\`'
print(fake_reply)
`,
      solution_code: `import json, re

SCHEMA = ["name", "email", "phone"]

def repair_and_parse(text):
    text = text.strip()
    text = re.sub(r"^\`\`\`[a-zA-Z]*\\n", "", text)
    text = re.sub(r"\\n\`\`\`$", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        return None
    chunk = re.sub(r",(\\s*[}\\]])", r"\\1", text[start:end + 1])
    try:
        return json.loads(chunk)
    except json.JSONDecodeError:
        return None

def finalize(record, schema):
    clean = {}
    missing = []
    for key in schema:
        value = record.get(key)
        if value in (None, ""):
            missing.append(key)
            clean[key] = None
        else:
            clean[key] = value
    return clean, missing

fake_reply = '\`\`\`json\\n{"name": "Ada Lovelace", "email": "ada@x.com",}\\n\`\`\`'
parsed = repair_and_parse(fake_reply)
record, missing = finalize(parsed, SCHEMA)
print("extracted:", json.dumps(record, sort_keys=True))
print("missing:", ", ".join(missing) if missing else "none")
print("status:", "INCOMPLETE" if missing else "COMPLETE")
`,
      hints: [
        "Reuse the fence-strip and trailing-comma repairs from lesson 4 before json.loads.",
        "finalize should give every schema key a value, using None for anything absent or empty.",
        "json.dumps(record, sort_keys=True) makes the printed object deterministic.",
      ],
      challenge_title: "End-to-End Extract",
      challenge_description:
        "Run the whole pipeline: pull JSON out of a messy reply, repair trailing commas, then report COMPLETE, INCOMPLETE with the missing fields, or PARSE_ERROR.",
      challenge_language: "python",
      challenge_starter_code: `import sys, json, re

def main():
    lines = sys.stdin.read().split("\\n")
    required = lines[0].split()
    text = "\\n".join(lines[1:])

    # TODO: slice text from first "{" to last "}"; if none, print "PARSE_ERROR".
    # TODO: remove trailing commas, then json.loads (PARSE_ERROR on failure).
    # TODO: missing = required fields that are None/empty. Print "COMPLETE",
    #       or "INCOMPLETE: <sorted missing>".

main()
`,
      challenge_solution_code: `import sys, json, re

def main():
    lines = sys.stdin.read().split("\\n")
    required = lines[0].split()
    text = "\\n".join(lines[1:])

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        print("PARSE_ERROR")
        return
    chunk = re.sub(r",(\\s*[}\\]])", r"\\1", text[start:end + 1])
    try:
        record = json.loads(chunk)
    except json.JSONDecodeError:
        print("PARSE_ERROR")
        return

    missing = [f for f in required if record.get(f) in (None, "")]
    if missing:
        print("INCOMPLETE: " + ", ".join(sorted(missing)))
    else:
        print("COMPLETE")

main()
`,
      challenge_test_cases: [
        {
          input: 'name email phone\nHere you go:\n{"name": "Ada", "email": "ada@x.com", "phone": null}',
          expected_output: "INCOMPLETE: phone",
          description: "Parses fine, but phone is null, so it's incomplete against the required fields.",
        },
        {
          input: 'name email\n```json\n{"name": "Bob", "email": "bob@x.com",}\n```',
          expected_output: "COMPLETE",
          description: "The fence and trailing comma are handled; both required fields are present.",
        },
        {
          input: "name\nno json here at all",
          expected_output: "PARSE_ERROR",
          description: "No braces in the reply, so extraction fails cleanly instead of crashing.",
        },
      ],
    },
  ],
};
