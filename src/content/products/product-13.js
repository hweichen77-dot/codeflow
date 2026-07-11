const project = {
  id: "prod-13",
  title: "Receipt Scanner",
  description:
    "Turn a photo of a receipt into structured expense JSON: merchant, date, line items, and totals. You'll teach the model to read an image, force its answer into a strict schema, and check the math before you trust it.",
  difficulty: "intermediate",
  category: "vision_multimodal",
  estimated_time: 130,
  lessons_count: 8,
  tags: ["vision", "ocr", "json-extraction", "validation", "expenses", "multimodal"],
  order: 113,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-13-1",
    project_id: "prod-13",
    order: 1,
    title: "Handing the Model a Photo",
    concept: "image content blocks",
    explanation: `A vision model doesn't get a separate "image" parameter. It gets the same \`messages\` list you'd use for plain text, except one of the blocks in that list is a picture instead of words. Once you see that, the whole receipt scanner is just "the usual chat API, with a photo taped into the envelope."

## What an image content block is

A normal text message has \`content\` as a plain string. A multimodal message has \`content\` as a **list of blocks**, where each block has a \`type\`. You can mix an image block and a text block in the same user turn:

\`\`\`python
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_b64,
                },
            },
            {"type": "text", "text": "What store is this receipt from?"},
        ],
    }
]
\`\`\`

The \`source\` dict is the important part: \`type\` says how the bytes are encoded (\`base64\` for a raw upload), \`media_type\` is the real MIME type of the file (\`image/jpeg\`, \`image/png\`, and a few others), and \`data\` is the actual base64 string.

## Getting a photo into base64

Images don't travel over JSON as raw bytes, they travel as base64 text. Reading a file and encoding it is three lines:

\`\`\`python
import base64

with open("receipt.jpg", "rb") as f:
    image_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
\`\`\`

Then you call the API exactly like any other chat call, just with this richer \`content\` list:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=messages,
)
print(response.content[0].text)
\`\`\`

## Why the media_type has to be honest

If the file is actually a PNG but you label it \`image/jpeg\`, decoding can fail or the model can misread the picture. There's no magic detection happening on your side, you're telling the API what format the bytes are in, so get it from the real file extension, not a guess. Also note base64 inflates size by roughly a third, a 3 MB photo becomes about 4 MB of text on the wire, something you'll come back to when this scanner processes a whole batch of receipts.

## The mental model to keep

Nothing here is a special "vision endpoint." It's the same message-list shape you already know, with one block that happens to be a photo instead of a sentence. Everything else, the loop of send-and-parse, still applies exactly as before.`,
    starter_code: `def build_image_message(image_b64, media_type, question):
    # TODO: return a messages list with one user turn whose "content" is
    # a list containing an image block first, then a text block with
    # \`question\`.
    # Image block shape:
    #   {"type": "image", "source": {"type": "base64",
    #                                 "media_type": media_type,
    #                                 "data": image_b64}}
    # Text block shape:
    #   {"type": "text", "text": question}
    pass

fake_b64 = "iVBORw0KGgoAAAANS"  # stand-in, a real one is much longer
messages = build_image_message(fake_b64, "image/jpeg", "What store is this receipt from?")
print(messages[0]["role"])
print(len(messages[0]["content"]))
print(messages[0]["content"][0]["type"])
print(messages[0]["content"][1]["text"])
`,
    solution_code: `def build_image_message(image_b64, media_type, question):
    return [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": image_b64,
                    },
                },
                {"type": "text", "text": question},
            ],
        }
    ]

fake_b64 = "iVBORw0KGgoAAAANS"  # stand-in, a real one is much longer
messages = build_image_message(fake_b64, "image/jpeg", "What store is this receipt from?")
print(messages[0]["role"])
print(len(messages[0]["content"]))
print(messages[0]["content"][0]["type"])
print(messages[0]["content"][1]["text"])
`,
    hints: [
      "content is a list of blocks; each block is its own dict with a type key.",
      "The image block needs a nested source dict with type, media_type, and data.",
      "role stays 'user' at the top level, just like a text-only message.",
    ],
    challenge_title: "Sort the Receipt Inbox",
    challenge_description:
      "Given a batch of uploaded file mime types, split them into valid image types the vision API accepts and everything else.",
    challenge_language: "python",
    challenge_starter_code: `import sys

ALLOWED = {"image/jpeg", "image/png", "image/gif", "image/webp"}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    types = [data[i + 1].strip() for i in range(n)]
    # TODO: split \`types\` into ones in ALLOWED and ones that aren't,
    # keeping the invalid ones in their original order.
    # TODO: print "VALID: <count>", then "INVALID: <count>",
    #       then each invalid mime type on its own line.

main()
`,
    challenge_solution_code: `import sys

ALLOWED = {"image/jpeg", "image/png", "image/gif", "image/webp"}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    types = [data[i + 1].strip() for i in range(n)]

    invalid = [t for t in types if t not in ALLOWED]
    valid_count = n - len(invalid)

    print(f"VALID: {valid_count}")
    print(f"INVALID: {len(invalid)}")
    for t in invalid:
        print(t)

main()
`,
    challenge_test_cases: [
      {
        input: `4\nimage/jpeg\nimage/bmp\nimage/png\napplication/pdf`,
        expected_output: `VALID: 2\nINVALID: 2\nimage/bmp\napplication/pdf`,
        description: "Mixed batch: two valid image types, two rejects.",
      },
      {
        input: `2\nimage/png\nimage/webp`,
        expected_output: `VALID: 2\nINVALID: 0`,
        description: "All valid: no invalid lines printed.",
      },
      {
        input: `1\nimage/tiff`,
        expected_output: `VALID: 0\nINVALID: 1\nimage/tiff`,
        description: "Edge: a single unsupported type.",
      },
    ],
  },

  {
    id: "prod-13-2",
    project_id: "prod-13",
    order: 2,
    title: "Ask for JSON, Not a Paragraph",
    concept: "structured JSON extraction",
    explanation: `The model can describe a receipt in a friendly paragraph. You don't want a paragraph, you want a Python dict with \`merchant\`, \`date\`, and \`total\` you can save to a database. Getting there means writing a prompt that demands JSON, and writing code that survives the model's habit of wrapping JSON in extra chatter anyway.

## Demanding the shape you need

Tell the model exactly what keys you want and exactly what format, in the system prompt:

\`\`\`python
SYSTEM = """Look at the receipt image and return ONLY a JSON object,
no other text, with exactly these keys:
- merchant: string, the store name
- date: string, in YYYY-MM-DD format
- total: number, the final amount paid

If a field is unreadable, use null for it."""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=SYSTEM,
    messages=messages,
)
raw_reply = response.content[0].text
\`\`\`

Naming the exact keys and formats up front is the single biggest lever you have. "Return the date" gets you five different date formats across five receipts. "Return the date as YYYY-MM-DD" gets you one.

## Reality: the model still adds chatter

Even with a strict prompt, replies often look like \`"Sure, here's the data: {...} Let me know if you need more."\` or wrap the JSON in a markdown code fence. Your prompt reduces this, it doesn't eliminate it. So parsing needs to be defensive: find the JSON object embedded in the text, rather than assuming the whole reply *is* JSON.

## Pulling the JSON out of the noise

The trick is simple: find the first \`{\` and the last \`}\` in the reply, slice out everything between them, and hand that slice to \`json.loads\`. Anything before the first brace or after the last one gets thrown away.

\`\`\`python
import json

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])
\`\`\`

\`text.index("{")\` finds the *first* opening brace, and \`text.rindex("}")\` finds the *last* closing brace, which matters because a receipt's JSON might itself contain nested braces (once you add line items in the next lesson). If either brace is missing, or the sliced text still isn't valid JSON, this raises an exception, which is your signal to retry or flag the receipt for review, a pattern you'll build out properly a few lessons from now.

## Checking the fields actually showed up

Extracting JSON isn't the same as extracting the *right* JSON. Even a well-formed object might be missing \`total\` because the model couldn't find it on a smudged receipt. After parsing, check every required key is present before you trust the data:

\`\`\`python
required = ["merchant", "date", "total"]
missing = [k for k in required if k not in data]
\`\`\`

## The mental model to keep

Treat the model's reply as an envelope, not a package. The envelope might have a sticky note attached, a rubber band around it, whatever. Your job is to find the actual package (the JSON object) inside the envelope, open it, and check nothing's missing before you use what's inside.`,
    starter_code: `import json

RAW_REPLY = 'Sure thing! Here is what I found on the receipt: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Let me know if you need anything else.'

REQUIRED = ["merchant", "date", "total"]

def extract_json(text):
    # TODO: find the first "{" and the last "}" in text, slice that
    # substring out, and json.loads it. Return the parsed dict.
    pass

def check_required(data, required):
    # TODO: return a list of keys from \`required\` missing from \`data\`.
    pass

data = extract_json(RAW_REPLY)
missing = check_required(data, REQUIRED)
print(data["merchant"])
print(missing)
`,
    solution_code: `import json

RAW_REPLY = 'Sure thing! Here is what I found on the receipt: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Let me know if you need anything else.'

REQUIRED = ["merchant", "date", "total"]

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def check_required(data, required):
    return [k for k in required if k not in data]

data = extract_json(RAW_REPLY)
missing = check_required(data, REQUIRED)
print(data["merchant"])
print(missing)
`,
    hints: [
      "text.index('{') finds the first opening brace; text.rindex('}') finds the last closing brace.",
      "Slice text[start:end] before calling json.loads on it, don't parse the whole string.",
      "A key is missing if it's not in data.keys(); build the list with a comprehension.",
    ],
    challenge_title: "Pull the JSON Out of the Noise",
    challenge_description:
      "Extract an embedded JSON receipt object from a noisy model reply, then verify the required fields all showed up.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

REQUIRED = ["merchant", "date", "total"]

def main():
    text = sys.stdin.read()
    # TODO: try to locate the first "{" and last "}" in text and parse
    # the JSON between them. If either brace is missing, or json.loads
    # fails, print "PARSE_ERROR" and stop.
    # TODO: if parsing succeeds, check REQUIRED keys are all present.
    #       If any are missing, print "MISSING:" followed by the missing
    #       keys joined with commas, in REQUIRED order.
    # TODO: otherwise print one "key=value" line per REQUIRED key, in
    #       REQUIRED order.

main()
`,
    challenge_solution_code: `import sys, json

REQUIRED = ["merchant", "date", "total"]

def main():
    text = sys.stdin.read()
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        data = json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        print("PARSE_ERROR")
        return

    missing = [k for k in REQUIRED if k not in data]
    if missing:
        print("MISSING:" + ",".join(missing))
        return

    for k in REQUIRED:
        print(f"{k}={data[k]}")

main()
`,
    challenge_test_cases: [
      {
        input: `Sure! Here's the result: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Hope that's helpful!`,
        expected_output: `merchant=Cafe Luna\ndate=2026-07-01\ntotal=12.5`,
        description: "JSON embedded in chatty prose parses and all fields are present.",
      },
      {
        input: `{"merchant": "Joe's Diner", "date": "2026-05-02"}`,
        expected_output: `MISSING:total`,
        description: "total is missing from an otherwise valid object.",
      },
      {
        input: `{"merchant": "Bad Shop", "date": `,
        expected_output: `PARSE_ERROR`,
        description: "Edge: no closing brace at all, extraction fails cleanly.",
      },
    ],
  },

  {
    id: "prod-13-3",
    project_id: "prod-13",
    order: 3,
    title: "Line Items Are a List of Objects",
    concept: "nested schema validation",
    explanation: `A receipt isn't just \`merchant\`, \`date\`, and \`total\`, the useful part is the list of things someone bought. That list has a different shape than the flat fields you validated last lesson: it's a variable-length array of objects, and each object can be wrong in its own way.

## Asking for a list of objects

Extend the schema in your prompt to include an \`items\` array, and show the model exactly what one item looks like:

\`\`\`python
SYSTEM = """Return ONLY JSON with these keys:
- merchant: string
- date: string, YYYY-MM-DD
- items: a list of objects, each with:
    - name: string
    - quantity: integer
    - price: number, the per-item price
- total: number

Example item: {"name": "Latte", "quantity": 2, "price": 4.5}"""
\`\`\`

Showing one concrete example item inside the prompt does more work than describing the shape in words. Models are much better at copying a pattern than following an abstract spec.

## Why line items go wrong more than flat fields

A blurry photo or a cramped receipt can make the model merge two items into one, invent a quantity it can't actually read, or return a price as the string \`"$4.50"\` instead of the number \`4.5\`. A flat field just goes missing; a list field can have *some* good entries and some broken ones mixed together. You need to validate every item independently, not just check that \`items\` exists.

## What "valid" means for one item

Three checks, applied to every entry in the list:

- \`name\` is a non-empty string.
- \`quantity\` is a positive integer.
- \`price\` is a number (int or float) that's zero or more.

\`\`\`python
def is_valid_item(item):
    name = item.get("name")
    quantity = item.get("quantity")
    price = item.get("price")
    return (
        isinstance(name, str) and name.strip() != ""
        and isinstance(quantity, int) and not isinstance(quantity, bool)
        and quantity > 0
        and isinstance(price, (int, float)) and not isinstance(price, bool)
        and price >= 0
    )
\`\`\`

The \`not isinstance(x, bool)\` checks look odd, but they matter: in Python, \`bool\` is a subclass of \`int\`, so \`True\` and \`False\` silently pass an \`isinstance(x, int)\` check. Without excluding \`bool\` explicitly, a stray \`True\` from a malformed reply could sneak through as a "valid quantity of 1."

## Deciding what to do with a mixed bag

Once you know which items are valid and which aren't, you have a choice: drop the bad ones and keep going with what you have, or refuse the whole receipt until it's re-scanned. For this project, keep the valid items and record which indexes failed, that gives you a usable partial result plus a clear list of what a human should double check.

## The mental model to keep

A flat field is either there or it's not. A list of objects is a batch of independent decisions, some pass, some fail, and your validator's job is to sort them, not to give one verdict for the whole receipt.`,
    starter_code: `def validate_items(items):
    valid = []
    invalid = []
    for i, item in enumerate(items):
        # TODO: an item is valid only if:
        #   - "name" is a non-empty string
        #   - "quantity" is an int (not a bool) and > 0
        #   - "price" is an int or float (not a bool) and >= 0
        # Append valid items to \`valid\`, and the 0-based index of any
        # invalid item to \`invalid\`.
        pass
    return valid, invalid

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "", "quantity": 1, "price": 3.0},
    {"name": "Muffin", "quantity": -1, "price": 2.5},
    {"name": "Bagel", "quantity": 1, "price": "2.00"},
]

valid, invalid = validate_items(items)
print("valid:", len(valid))
print("invalid indexes:", invalid)
`,
    solution_code: `def validate_items(items):
    valid = []
    invalid = []
    for i, item in enumerate(items):
        name = item.get("name")
        quantity = item.get("quantity")
        price = item.get("price")

        ok = (
            isinstance(name, str) and name.strip() != ""
            and isinstance(quantity, int) and not isinstance(quantity, bool)
            and quantity > 0
            and isinstance(price, (int, float)) and not isinstance(price, bool)
            and price >= 0
        )

        if ok:
            valid.append(item)
        else:
            invalid.append(i)
    return valid, invalid

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "", "quantity": 1, "price": 3.0},
    {"name": "Muffin", "quantity": -1, "price": 2.5},
    {"name": "Bagel", "quantity": 1, "price": "2.00"},
]

valid, invalid = validate_items(items)
print("valid:", len(valid))
print("invalid indexes:", invalid)
`,
    hints: [
      "Use item.get(key) instead of item[key] so a missing key returns None instead of crashing.",
      "bool is a subclass of int in Python, so exclude it explicitly or True can pass as quantity 1.",
      "invalid should collect the index i, not the item itself.",
    ],
    challenge_title: "Line Item Bouncer",
    challenge_description:
      "Check a batch of raw 'name|quantity|price' lines against the receipt schema rules and report which lines fail.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]
    # TODO: for each line "name|quantity|price", check:
    #   - name (after strip) is non-empty
    #   - quantity parses as an int and is > 0
    #   - price parses as a float and is >= 0
    # A line that fails int()/float() parsing is invalid, not a crash.
    # TODO: print "VALID: <count>" then "INVALID: <count>", then the
    # 1-indexed line numbers of invalid entries, one per line, in order.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]

    invalid_lines = []
    valid_count = 0
    for i, line in enumerate(lines, start=1):
        parts = line.split("|")
        ok = False
        if len(parts) == 3:
            name, qty_s, price_s = parts
            if name.strip() != "":
                try:
                    qty = int(qty_s)
                    price = float(price_s)
                    ok = qty > 0 and price >= 0
                except ValueError:
                    ok = False
        if ok:
            valid_count += 1
        else:
            invalid_lines.append(i)

    print(f"VALID: {valid_count}")
    print(f"INVALID: {len(invalid_lines)}")
    for ln in invalid_lines:
        print(ln)

main()
`,
    challenge_test_cases: [
      {
        input: `4\nLatte|2|4.5\n|1|3.0\nMuffin|-1|2.5\nBagel|1|2.00x`,
        expected_output: `VALID: 1\nINVALID: 3\n2\n3\n4`,
        description: "One clean item, three broken in three different ways.",
      },
      {
        input: `2\nLatte|2|4.5\nMuffin|1|2.5`,
        expected_output: `VALID: 2\nINVALID: 0`,
        description: "All lines valid, no invalid lines printed.",
      },
      {
        input: `1\nBagel|0|2.0`,
        expected_output: `VALID: 0\nINVALID: 1\n1`,
        description: "Edge: quantity of zero is invalid, must be strictly positive.",
      },
    ],
  },

  {
    id: "prod-13-4",
    project_id: "prod-13",
    order: 4,
    title: "Do the Totals Add Up?",
    concept: "totals-check with tolerance",
    explanation: `A receipt scanner that just repeats back whatever the model claims the total is isn't trustworthy, it's a transcription of a guess. The one check that catches most bad reads is arithmetic: the line items should sum to the subtotal, and the subtotal plus tax should equal the total. If they don't, something on the receipt was misread.

## Why you can't compare with ==

Money is stored as floats, and floats don't compare exactly the way you'd expect. \`0.1 + 0.2 == 0.3\` is \`False\` in Python, not because the math is wrong, but because binary floating point can't represent every decimal exactly. On top of that, receipts round to the cent while intermediate math might not, so a computed sum can land a fraction of a cent off from the printed subtotal even when everything was read correctly.

The fix is a **tolerance**: instead of asking "are these exactly equal," ask "are these within a cent or two of each other."

\`\`\`python
def approx_equal(a, b, tolerance=0.01):
    return abs(a - b) <= tolerance
\`\`\`

## Building the totals check

Two comparisons cover the whole receipt: the items should sum to the subtotal, and the subtotal plus tax should equal the total.

\`\`\`python
def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    return {
        "items_sum": items_sum,
        "subtotal_ok": subtotal_ok,
        "total_ok": total_ok,
    }
\`\`\`

Notice \`items_sum\` multiplies price by quantity for every item, not just adding the prices, two lattes at \\$4.50 contribute \\$9.00, not \\$4.50.

## What a mismatch actually tells you

A mismatch doesn't always mean the model hallucinated. It might mean:

- One line item's quantity or price was misread.
- The receipt has a tip or discount line your schema doesn't capture yet.
- The subtotal or total field itself was misread, not the items.

You can't tell which from the numbers alone, so the right move is to **flag it**, not silently accept or silently reject. Mark the receipt \`needs_review\` and surface which check failed, subtotal or total, so a human glancing at it knows exactly where to look.

## Why this check earns its keep

This one arithmetic check catches a large share of misreads for almost no extra API calls, it's pure math on data you already extracted. It's the cheapest reliability you'll add to this whole project, and it's the difference between "a tool that prints numbers" and "a tool that tells you when to double check the numbers."

## The mental model to keep

Trust, but verify with a calculator. The model read the receipt; a few lines of arithmetic double-check that reading against itself before you write it down as fact.`,
    starter_code: `def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    # TODO: compute whether items_sum matches subtotal within \`tolerance\`,
    # and whether subtotal + tax matches total within \`tolerance\`.
    # Return a dict:
    #   {"items_sum": items_sum, "subtotal_ok": ..., "total_ok": ...}
    pass

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "Muffin", "quantity": 1, "price": 3.0},
]
result = check_totals(items, subtotal=12.0, tax=1.0, total=13.0)
print(result)
`,
    solution_code: `def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    return {"items_sum": items_sum, "subtotal_ok": subtotal_ok, "total_ok": total_ok}

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "Muffin", "quantity": 1, "price": 3.0},
]
result = check_totals(items, subtotal=12.0, tax=1.0, total=13.0)
print(result)
`,
    hints: [
      "items_sum should multiply price by quantity, not just add up the prices.",
      "Use abs(a - b) <= tolerance instead of == for float comparisons.",
      "subtotal + tax should be compared to total, using the same tolerance.",
    ],
    challenge_title: "Does the Math Check Out",
    challenge_description:
      "Given a receipt's line items and its stated subtotal/tax/total, verify the arithmetic within a one-cent tolerance.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    items = []
    for i in range(n):
        price_s, qty_s = data[i + 1].split()
        items.append((float(price_s), int(qty_s)))
    subtotal, tax, total = map(float, data[n + 1].split())
    # parse done: items is a list of (price, quantity) tuples

    # TODO: items_sum = sum(price * qty for each item)
    # TODO: subtotal is a MATCH if abs(items_sum - subtotal) <= 0.01, else MISMATCH
    # TODO: total is a MATCH if abs((subtotal + tax) - total) <= 0.01, else MISMATCH
    # TODO: print "SUBTOTAL: <MATCH|MISMATCH>" then "TOTAL: <MATCH|MISMATCH>"

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    items = []
    for i in range(n):
        price_s, qty_s = data[i + 1].split()
        items.append((float(price_s), int(qty_s)))
    subtotal, tax, total = map(float, data[n + 1].split())

    items_sum = sum(price * qty for price, qty in items)
    subtotal_ok = abs(items_sum - subtotal) <= 0.01
    total_ok = abs((subtotal + tax) - total) <= 0.01

    print("SUBTOTAL:", "MATCH" if subtotal_ok else "MISMATCH")
    print("TOTAL:", "MATCH" if total_ok else "MISMATCH")

main()
`,
    challenge_test_cases: [
      {
        input: `2\n4.5 2\n3.0 1\n12.0 1.0 13.0`,
        expected_output: `SUBTOTAL: MATCH\nTOTAL: MATCH`,
        description: "Clean receipt: items, subtotal, and total all agree.",
      },
      {
        input: `1\n5.0 1\n10.0 0.0 10.0`,
        expected_output: `SUBTOTAL: MISMATCH\nTOTAL: MATCH`,
        description: "Items sum to 5.0 but the stated subtotal is 10.0.",
      },
      {
        input: `1\n3.333 3\n10.00 0.0 10.00`,
        expected_output: `SUBTOTAL: MATCH\nTOTAL: MATCH`,
        description: "Edge: tiny rounding drift stays inside the one-cent tolerance.",
      },
    ],
  },

  {
    id: "prod-13-5",
    project_id: "prod-13",
    order: 5,
    title: "Cleaning Up Messy Fields",
    concept: "normalizing amounts and dates",
    explanation: `Ask a vision model for a dollar amount and you might get \`12.5\`, \`"$12.50"\`, or \`"1,234.56"\`. Ask for a date and you might get \`"07/01/2026"\`, \`"2026-07-01"\`, or \`"Jan 5, 2026"\`. All of these are correct readings of the receipt, they just aren't in a single consistent shape yet. Before you can do math on amounts or sort receipts by date, you need to normalize every field into one predictable type.

## Normalizing a currency string

The plan: strip a leading currency symbol, remove thousands-separator commas, then convert to \`float\`. If conversion fails, return \`None\` rather than crashing, a bad field shouldn't take down the whole receipt.

\`\`\`python
import re

def normalize_amount(raw):
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip())
    cleaned = cleaned.replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None
\`\`\`

\`re.sub(r"^[$€£]", "", cleaned)\` removes exactly one currency symbol *if it's at the very start* of the string, the \`^\` anchor is what limits it to the front, so it won't strip a \`$\` that somehow appears mid-string. Stripping commas after that turns \`"1,234.56"\` into \`"1234.56"\`, which \`float()\` can parse.

## Normalizing a date string

Dates are trickier because there's no single separator to strip, the whole *format* varies. The practical fix: try a short list of known formats in order, and use whichever one successfully parses.

\`\`\`python
import datetime

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    for fmt in formats:
        try:
            parsed = datetime.datetime.strptime(raw.strip(), fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None
\`\`\`

Each \`strptime\` attempt either succeeds and returns a \`datetime\`, or raises \`ValueError\` and you move to the next format. Once one succeeds, \`strftime("%Y-%m-%d")\` reformats it to a single consistent output regardless of which input format matched. If none of the formats fit, you get \`None\`, a clean signal that this field needs a human to look at it rather than a silently wrong date.

## Where this fits in the pipeline

Normalize right after extracting the JSON and before running the totals check from the last lesson, comparing \`"$12.00"\` to the float \`12.0\` with \`abs()\` will crash, comparing \`12.0\` to \`12.0\` won't. Every downstream step, math, storage, display, assumes clean types. Do the cleanup once, right after parsing, instead of re-cleaning the same field in five different places.

## The mental model to keep

The model reads receipts the way a human would, in whatever format the receipt happens to print things. Your code has to speak one dialect: floats for money, ISO strings for dates. Normalization is the translator that sits between "however the model wrote it" and "however your program needs it."`,
    starter_code: `import re

def normalize_amount(raw):
    # TODO: strip whitespace, remove a leading currency symbol ($, €, £)
    # and remove thousands separators (commas), then convert to float.
    # Return None if it can't be converted.
    pass

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    import datetime
    # TODO: try each format in \`formats\` with datetime.datetime.strptime.
    # Return the date formatted as "%Y-%m-%d" on the first format that
    # works, or None if none of them parse.
    pass

print(normalize_amount("$1,234.56"))
print(normalize_amount("12.5"))
print(normalize_amount("free"))
print(normalize_date("07/01/2026"))
print(normalize_date("Jan 5, 2026"))
`,
    solution_code: `import re
import datetime

def normalize_amount(raw):
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip())
    cleaned = cleaned.replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    for fmt in formats:
        try:
            parsed = datetime.datetime.strptime(raw.strip(), fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

print(normalize_amount("$1,234.56"))
print(normalize_amount("12.5"))
print(normalize_amount("free"))
print(normalize_date("07/01/2026"))
print(normalize_date("Jan 5, 2026"))
`,
    hints: [
      "re.sub(r'^[$€£]', '', s) removes exactly one leading currency symbol, using ^ to anchor it to the start.",
      "Try each date format in order inside a loop, and return as soon as one strptime call doesn't raise.",
      "Wrap float() and strptime() in try/except ValueError rather than pre-checking the string by hand.",
    ],
    challenge_title: "Normalize the Damn Numbers",
    challenge_description:
      "Clean up a batch of raw receipt amount strings into consistent two-decimal floats, or flag the ones that can't be parsed.",
    challenge_language: "python",
    challenge_starter_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]
    # TODO: for each raw amount, strip a leading currency symbol ($, €, £)
    # and remove commas, then try to convert to float.
    # Print the result formatted to 2 decimals (e.g. "1234.56"), or
    # "ERROR" if it can't be converted.

main()
`,
    challenge_solution_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]

    for raw in lines:
        cleaned = re.sub(r"^[$€£]", "", raw.strip()).replace(",", "")
        try:
            value = float(cleaned)
            print(f"{value:.2f}")
        except ValueError:
            print("ERROR")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n$1,234.56\n12.5\nfree`,
        expected_output: `1234.56\n12.50\nERROR`,
        description: "Currency symbol and comma stripped; an unparsable value flagged.",
      },
      {
        input: `2\n€1,000.00\n£250.5`,
        expected_output: `1000.00\n250.50`,
        description: "Different currency symbols, both cleaned to plain floats.",
      },
      {
        input: `1\n$-5.00`,
        expected_output: `-5.00`,
        description: "Edge: a negative amount (e.g. a refund line) still parses fine.",
      },
    ],
  },

  {
    id: "prod-13-6",
    project_id: "prod-13",
    order: 6,
    title: "When the Photo Is Bad",
    concept: "retries and manual review",
    explanation: `Some receipts are blurry, crumpled, or shot at an angle with half the total cut off. On those, the model sometimes returns malformed JSON, or JSON that parses fine but is missing the fields you need. A production scanner can't just crash on the first bad photo, it needs a plan for "this one didn't work" that doesn't involve a human staring at a stack trace.

## The retry loop

The fix is small: if the reply doesn't parse cleanly, ask again, up to a small capped number of attempts. A slightly reworded follow-up prompt ("Return ONLY the JSON object, nothing else") often succeeds where the first attempt didn't, because you're pushing the model away from whatever formatting habit tripped it up the first time.

\`\`\`python
import time

def scan_receipt(image_b64, media_type, max_retries=3):
    for attempt in range(1, max_retries + 1):
        reply = call_vision_model(image_b64, media_type)
        try:
            return extract_json(reply)
        except (ValueError, json.JSONDecodeError):
            if attempt == max_retries:
                return None  # give up, flag for manual review
            time.sleep(1)
\`\`\`

The cap matters as much as the retry itself. Without \`max_retries\`, a receipt that will *never* parse (a photo of a cat, say) retries forever, burning API calls and money on something that was never going to work.

## Returning None is a feature, not a bug

When every attempt fails, the function returns \`None\` instead of raising an exception. That's deliberate: one bad receipt in a batch of fifty shouldn't crash the other forty-nine. \`None\` is a clean, checkable signal that means "this one needs a human," and the code calling \`scan_receipt\` can act on it: log it, skip it, add it to a "needs manual entry" list, whatever fits the product.

## Asking the model to admit uncertainty

You can also reduce bad extractions at the source. Instead of forcing the model to always fill in every field, explicitly permit \`null\`:

\`\`\`python
SYSTEM = """... If any field is unreadable in the photo, use null
for that field instead of guessing."""
\`\`\`

A model that's allowed to say "I don't know" for one blurry field returns far more trustworthy data than one that feels obligated to invent a plausible-looking total. A guessed \`$47.32\` that's actually wrong is worse than an honest \`null\`, because the wrong guess looks correct until someone checks it by hand.

## The mental model to keep

Every real system that calls an unreliable process needs two things: a bounded number of retries, and a defined "give up" state that downstream code can check for. \`scan_receipt\` either returns a receipt or returns \`None\`; there's no third outcome where it just hangs or crashes, and that's what makes it safe to run unattended on a whole folder of photos.`,
    starter_code: `def parse_attempt(reply):
    # A "successful" reply looks like "OK:<merchant name>".
    # A failed attempt is exactly "BAD".
    # TODO: return the merchant name (str) if reply starts with "OK:",
    # otherwise return None.
    pass

def scan_receipt(replies, max_retries=3):
    # \`replies\` simulates what the model would return on each attempt,
    # in order. Try up to \`max_retries\` attempts; return as soon as one
    # parses successfully.
    # TODO: loop over replies[:max_retries], call parse_attempt, and
    # return (attempt_number, merchant) on the first success (1-indexed).
    # Return None if no attempt within max_retries succeeds.
    pass

print(scan_receipt(["BAD", "BAD", "OK:Cafe Luna", "OK:Should not reach"]))
print(scan_receipt(["BAD", "BAD", "BAD"], max_retries=3))
`,
    solution_code: `def parse_attempt(reply):
    if reply.startswith("OK:"):
        return reply[3:]
    return None

def scan_receipt(replies, max_retries=3):
    for i, reply in enumerate(replies[:max_retries], start=1):
        merchant = parse_attempt(reply)
        if merchant is not None:
            return (i, merchant)
    return None

print(scan_receipt(["BAD", "BAD", "OK:Cafe Luna", "OK:Should not reach"]))
print(scan_receipt(["BAD", "BAD", "BAD"], max_retries=3))
`,
    hints: [
      "Slice replies[:max_retries] so you never look past the retry cap, even if the list is longer.",
      "enumerate(..., start=1) keeps attempt numbers human-readable (1-indexed).",
      "Returning None cleanly signals 'give up, flag for manual review' instead of raising an exception.",
    ],
    challenge_title: "Give Up Gracefully",
    challenge_description:
      "Simulate a bounded retry loop over vision-model attempts, reporting the first success or a clean manual-review flag.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_retries = int(data[0].strip())
    n = int(data[1].strip())
    attempts = [data[i + 2] for i in range(n)]
    # TODO: look at attempts[:max_retries] in order. The first one that
    # starts with "OK:" is a success: print
    #   "SUCCESS attempt=<k> merchant=<name>"
    # where k is the 1-indexed attempt number and name is the text after
    # "OK:". If none of the first max_retries attempts succeed, print
    # "MANUAL_REVIEW".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_retries = int(data[0].strip())
    n = int(data[1].strip())
    attempts = [data[i + 2] for i in range(n)]

    for i, reply in enumerate(attempts[:max_retries], start=1):
        if reply.startswith("OK:"):
            print(f"SUCCESS attempt={i} merchant={reply[3:]}")
            return

    print("MANUAL_REVIEW")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n4\nBAD\nBAD\nOK:Cafe Luna\nOK:Ignored`,
        expected_output: `SUCCESS attempt=3 merchant=Cafe Luna`,
        description: "Succeeds on the third of three allowed attempts.",
      },
      {
        input: `2\n3\nBAD\nBAD\nOK:TooLate`,
        expected_output: `MANUAL_REVIEW`,
        description: "The retry cap of 2 is hit before the (later) successful attempt is reached.",
      },
      {
        input: `1\n1\nOK:Solo Shop`,
        expected_output: `SUCCESS attempt=1 merchant=Solo Shop`,
        description: "Edge: succeeds immediately on the first and only attempt.",
      },
    ],
  },

  {
    id: "prod-13-7",
    project_id: "prod-13",
    order: 7,
    title: "Watching the Cost of Every Photo",
    concept: "image cost and batching",
    explanation: `Text is cheap to send, a few hundred words is a few hundred tokens. Photos are not cheap the same way: a full-resolution image can cost more tokens than a page of text, and if this scanner is meant to process a shoebox full of receipts instead of one at a time, that cost adds up fast. This lesson is about seeing that cost coming and handling a batch without one bad file taking down the rest.

## Roughly estimating image cost

Vision APIs bill image tokens based on pixel count, not file size in bytes. A common rule of thumb some providers use is roughly one token per 750 pixels of the image:

\`\`\`python
import math

def estimate_image_tokens(width, height):
    return math.ceil((width * height) / 750)
\`\`\`

The exact formula varies by provider and model, but the shape of the lesson doesn't: a 4000×3000 photo straight off a phone camera is enormously more expensive than the same receipt resized down to something readable, like 1000×750. Before sending an image, it's worth asking whether you actually need full camera resolution to read a receipt, usually you don't.

## Resizing before you send

A quick resize with an imaging library cuts cost with almost no loss in what the model needs to read:

\`\`\`python
from PIL import Image
import io, base64

def resize_and_encode(path, max_dim=1200):
    img = Image.open(path)
    img.thumbnail((max_dim, max_dim))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return base64.standard_b64encode(buf.getvalue()).decode("utf-8")
\`\`\`

Capping the longest side at 1200 pixels keeps receipt text legible while shrinking the token bill substantially compared to an uncompressed phone photo.

## Batching without one failure taking down the rest

If you're scanning a folder of receipts, the batch loop needs to keep going even when one image fails or comes back malformed, exactly the retry-and-give-up pattern from last lesson, just applied across many files instead of one:

\`\`\`python
results = []
for path in receipt_paths:
    result = scan_receipt(path)  # None if it needed manual review
    results.append(result)
\`\`\`

Note that you still pay for the API call whether or not it produced a usable result. A receipt that needed all three retries before giving up cost you three image-token charges, not zero. That's real money spent on a receipt you still have to review by hand, which is exactly why the retry cap from the last lesson exists, unlimited retries on a bad photo isn't just slow, it's an unbounded bill.

## Tallying the damage

At the end of a batch run, you want two numbers: how many receipts actually succeeded, and how much this batch cost in estimated tokens, success and failure alike. That's the number you'd report if someone asked "what did scanning this month's receipts cost us?"

## The mental model to keep

Every image you send has a price tag before the model even reads it, set by its pixel count, not by whether the extraction eventually works. Resize before you send, cap your retries, and always count the cost of the failures alongside the successes, they're on the same bill.`,
    starter_code: `import math

def estimate_image_tokens(width, height):
    # A common rule of thumb: image tokens scale with pixel count.
    # TODO: return math.ceil((width * height) / 750)
    pass

def batch_cost(receipts):
    # \`receipts\` is a list of dicts:
    #   {"width": int, "height": int, "status": "OK"|"ERROR"}
    # You pay the image-token cost whether or not extraction succeeded,
    # because the call already happened.
    # TODO: return (total_tokens, success_count, error_count)
    pass

receipts = [
    {"width": 900, "height": 1600, "status": "OK"},
    {"width": 300, "height": 300, "status": "ERROR"},
    {"width": 1200, "height": 1200, "status": "OK"},
]
print(estimate_image_tokens(900, 1600))
print(batch_cost(receipts))
`,
    solution_code: `import math

def estimate_image_tokens(width, height):
    return math.ceil((width * height) / 750)

def batch_cost(receipts):
    total_tokens = 0
    success_count = 0
    error_count = 0
    for r in receipts:
        total_tokens += estimate_image_tokens(r["width"], r["height"])
        if r["status"] == "OK":
            success_count += 1
        else:
            error_count += 1
    return (total_tokens, success_count, error_count)

receipts = [
    {"width": 900, "height": 1600, "status": "OK"},
    {"width": 300, "height": 300, "status": "ERROR"},
    {"width": 1200, "height": 1200, "status": "OK"},
]
print(estimate_image_tokens(900, 1600))
print(batch_cost(receipts))
`,
    hints: [
      "math.ceil rounds token estimates up, never down, since providers bill in whole tokens.",
      "A receipt still costs tokens even if status is ERROR, the API call already happened before you knew the result.",
      "Sum tokens across every receipt in the batch, not just the ones that succeeded.",
    ],
    challenge_title: "Batch Bill",
    challenge_description:
      "Estimate the total image-token cost of a batch of receipt photos, regardless of whether each one succeeded.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    success = 0
    error = 0
    for i in range(n):
        w_s, h_s, status = data[i + 1].split()
        w, h = int(w_s), int(h_s)
        # TODO: add ceil((w*h)/750) to total_tokens
        # TODO: bump success or error depending on status
        pass
    # TODO: print total_tokens, then "SUCCESS: <success>", then "ERROR: <error>"

main()
`,
    challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    success = 0
    error = 0
    for i in range(n):
        w_s, h_s, status = data[i + 1].split()
        w, h = int(w_s), int(h_s)
        total_tokens += math.ceil((w * h) / 750)
        if status == "OK":
            success += 1
        else:
            error += 1

    print(total_tokens)
    print(f"SUCCESS: {success}")
    print(f"ERROR: {error}")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n900 1600 OK\n300 300 ERROR\n1200 1200 OK`,
        expected_output: `3960\nSUCCESS: 2\nERROR: 1`,
        description: "Mixed batch: tokens are billed for every photo, success and failure alike.",
      },
      {
        input: `1\n100 100 ERROR`,
        expected_output: `14\nSUCCESS: 0\nERROR: 1`,
        description: "A single failed receipt still costs its estimated tokens.",
      },
      {
        input: `1\n750 1 OK`,
        expected_output: `1\nSUCCESS: 1\nERROR: 0`,
        description: "Edge: pixel count divides evenly by 750, no rounding needed.",
      },
    ],
  },

  {
    id: "prod-13-8",
    project_id: "prod-13",
    order: 8,
    title: "Ship the Scanner",
    concept: "assembling the full pipeline",
    explanation: `Every piece is built: send the photo, force JSON out of the reply, validate the line items, check the totals, normalize the messy fields, retry on failure, and watch the cost. Shipping is just wiring those pieces into one function that takes a photo and hands back a trustworthy result, plus a thin script around it that a person can actually run.

## One function, start to finish

\`\`\`python
import base64, json

def scan_receipt_from_file(path, client, max_retries=3):
    with open(path, "rb") as f:
        image_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
    media_type = "image/jpeg" if path.lower().endswith(("jpg", "jpeg")) else "image/png"

    for attempt in range(1, max_retries + 1):
        messages = build_image_message(image_b64, media_type, EXTRACTION_PROMPT)
        response = client.messages.create(
            model="claude-sonnet-4-6", max_tokens=800,
            system=SYSTEM, messages=messages,
        )
        try:
            data = extract_json(response.content[0].text)
            return process_receipt(data)
        except (ValueError, json.JSONDecodeError):
            if attempt == max_retries:
                return {"status": "manual_review", "path": path}
\`\`\`

Every function called here, \`build_image_message\`, \`extract_json\`, \`process_receipt\`, is something you already wrote in an earlier lesson. Shipping isn't new logic, it's assembly.

## The final validation pass

\`process_receipt\` is where extraction, normalization, and the totals check all come together into one verdict:

\`\`\`python
def process_receipt(data, tolerance=0.01):
    subtotal = normalize_amount(data["subtotal"])
    tax = normalize_amount(data["tax"])
    total = normalize_amount(data["total"])

    items_sum = sum(
        normalize_amount(item["price"]) * item["quantity"] for item in data["items"]
    )
    ok = (
        abs(items_sum - subtotal) <= tolerance
        and abs((subtotal + tax) - total) <= tolerance
    )
    return {
        "merchant": data["merchant"],
        "total": total,
        "status": "ok" if ok else "needs_review",
    }
\`\`\`

The output is small and deliberate: enough to act on (\`merchant\`, \`total\`, \`status\`), with the full itemized receipt still available on \`data\` if you want to store or display more.

## A script someone else can run

The last mile of "shipped" is a command a stranger could run without reading your source code:

\`\`\`bash
python scan_receipt.py path/to/photo.jpg
# writes result.json, prints: {"merchant": "Cafe Luna", "total": 13.0, "status": "ok"}
\`\`\`

That's it: one command in, a JSON file out, a status you can trust because it survived a retry loop and an arithmetic check, not just a single hopeful API call.

## It lands in your Portfolio

Finish this lesson and the Receipt Scanner is recorded in your **Portfolio** tab automatically, alongside the description, and it becomes something you can point to as a real, working tool: point a phone camera at a receipt, get back clean expense data, know when the numbers don't add up. That's the whole arc of this build, from "send one photo, get one string back" in lesson one, to a scanner that catches its own mistakes.

## The mental model to keep

A shipped product is not more code than a rough prototype, it's the same code with the gaps filled in: what happens when a call fails, when a field is missing, when the math doesn't add up. You already wrote all of that. Today you just connected the wires.`,
    starter_code: `import json, re

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def normalize_amount(raw):
    if isinstance(raw, (int, float)):
        return float(raw)
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip()).replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def process_receipt(raw_reply, tolerance=0.01):
    data = extract_json(raw_reply)

    # TODO: normalize data["subtotal"], data["tax"], and data["total"]
    # with normalize_amount, and normalize each item's "price" too.
    # TODO: compute items_sum = sum(price * quantity) over the items.
    # TODO: status is "ok" if BOTH:
    #   abs(items_sum - subtotal) <= tolerance
    #   abs(subtotal + tax - total) <= tolerance
    # else status is "needs_review".
    # TODO: return a dict with keys: merchant, total, status
    pass

RAW = ('{"merchant": "Cafe Luna", "date": "2026-07-01", '
       '"items": [{"name": "Latte", "quantity": 2, "price": 4.5}, '
       '{"name": "Muffin", "quantity": 1, "price": 3.0}], '
       '"subtotal": 12.0, "tax": 1.0, "total": 13.0}')

print(process_receipt(RAW))
`,
    solution_code: `import json, re

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def normalize_amount(raw):
    if isinstance(raw, (int, float)):
        return float(raw)
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip()).replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def process_receipt(raw_reply, tolerance=0.01):
    data = extract_json(raw_reply)

    subtotal = normalize_amount(data["subtotal"])
    tax = normalize_amount(data["tax"])
    total = normalize_amount(data["total"])

    items_sum = 0.0
    for item in data["items"]:
        price = normalize_amount(item["price"])
        items_sum += price * item["quantity"]

    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    status = "ok" if subtotal_ok and total_ok else "needs_review"

    return {"merchant": data["merchant"], "total": total, "status": status}

RAW = ('{"merchant": "Cafe Luna", "date": "2026-07-01", '
       '"items": [{"name": "Latte", "quantity": 2, "price": 4.5}, '
       '{"name": "Muffin", "quantity": 1, "price": 3.0}], '
       '"subtotal": 12.0, "tax": 1.0, "total": 13.0}')

print(process_receipt(RAW))
`,
    hints: [
      "Reuse extract_json and normalize_amount exactly as written in earlier lessons, don't rewrite the parsing logic.",
      "Normalize amounts before comparing them; abs() on a string and a float will crash.",
      "Keep the final dict small and deliberate: merchant, total, status is enough for the shipped output.",
    ],
    challenge_title: "Full Pipeline Check",
    challenge_description:
      "Given a complete parsed receipt, run the final validation pass and report whether it's ready to file or needs a human to check it.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

def main():
    line = sys.stdin.read().strip()
    data = json.loads(line)
    # parse done: data has merchant, subtotal, tax, total, items (list of
    # {"name", "price", "quantity"})

    # TODO: items_sum = sum(item["price"] * item["quantity"] for item in data["items"])
    # TODO: status is "OK" if BOTH match within 0.01:
    #   items_sum vs data["subtotal"]
    #   data["subtotal"] + data["tax"] vs data["total"]
    # else "NEEDS_REVIEW"
    # TODO: print the status, then print data["total"] formatted to 2 decimals

main()
`,
    challenge_solution_code: `import sys, json

def main():
    line = sys.stdin.read().strip()
    data = json.loads(line)

    items_sum = sum(item["price"] * item["quantity"] for item in data["items"])
    subtotal_ok = abs(items_sum - data["subtotal"]) <= 0.01
    total_ok = abs((data["subtotal"] + data["tax"]) - data["total"]) <= 0.01

    status = "OK" if subtotal_ok and total_ok else "NEEDS_REVIEW"
    print(status)
    print(f"{data['total']:.2f}")

main()
`,
    challenge_test_cases: [
      {
        input: `{"merchant": "Cafe Luna", "subtotal": 12.0, "tax": 1.0, "total": 13.0, "items": [{"name": "Latte", "price": 4.5, "quantity": 2}, {"name": "Muffin", "price": 3.0, "quantity": 1}]}`,
        expected_output: `OK\n13.00`,
        description: "Clean receipt: items, subtotal, and total all reconcile.",
      },
      {
        input: `{"merchant": "X", "subtotal": 20.0, "tax": 2.0, "total": 22.0, "items": [{"name": "A", "price": 5.0, "quantity": 1}]}`,
        expected_output: `NEEDS_REVIEW\n22.00`,
        description: "Items sum to 5.0 but the stated subtotal is 20.0, a misread item.",
      },
      {
        input: `{"merchant": "Y", "subtotal": 10.0, "tax": 1.0, "total": 12.0, "items": [{"name": "B", "price": 10.0, "quantity": 1}]}`,
        expected_output: `NEEDS_REVIEW\n12.00`,
        description: "Edge: items match the subtotal fine, but subtotal + tax doesn't reach the stated total.",
      },
    ],
  },
];

export default { project, lessons };
