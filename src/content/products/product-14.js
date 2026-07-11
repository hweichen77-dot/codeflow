export default {
  project: {
    id: "prod-14",
    title: "Screenshot Describer",
    description:
      "Build a tool that turns a UI screenshot into a structured description or matching starter HTML you can build on. You send an image to the model, prompt it for a structured layout, turn that structure into markup and layout CSS, then guard the pipeline against bad JSON and oversized images.",
    difficulty: "intermediate",
    category: "vision_multimodal",
    estimated_time: 130,
    lessons_count: 8,
    tags: ["vision", "image-input", "multimodal", "ui-parsing", "html-generation", "prompting"],
    order: 114,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-14-1",
      project_id: "prod-14",
      order: 1,
      title: "Sending a Screenshot to the Model",
      concept: "encoding images for the API",
      explanation: `A vision model doesn't take a file path. It takes bytes, turned into text, sitting inside the same message list you already use for text-only prompts. This lesson builds the one new piece every later lesson depends on: getting an image into the request correctly.

## What we're building

By lesson 8 you have a tool. Point it at a screenshot, get back a structured description or matching starter HTML. Every piece stacks on this first one, an image the model can actually read.

## Images ride as content blocks

A text-only user turn is a plain string. An image turn is a **list of content blocks**, an image block and a text block together in one message:

\`\`\`python
import base64
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

with open("screenshot.png", "rb") as f:
    image_bytes = f.read()

b64_data = base64.b64encode(image_bytes).decode("utf-8")

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": b64_data,
                },
            },
            {"type": "text", "text": "Describe this screenshot."},
        ],
    }],
)
print(resp.content[0].text)
\`\`\`

## Why base64

Raw bytes can't travel inside JSON, and JSON is what the API speaks. Base64 re-encodes bytes as plain text characters (letters, digits, a few symbols) that drop safely into a string field. \`base64.b64encode\` does the encoding. \`.decode("utf-8")\` turns the resulting bytes object into a normal Python string you can put in a dict.

## The shape to memorize

Every image turn has the same skeleton. An image block first, with a nested \`source\` dict naming the encoding, the media type, and the data. Then a text block with your instruction. The model doesn't care much about order, but image-then-text is the convention you'll see everywhere.

## Why this matters

Get this shape wrong (wrong key name, forgotten \`decode\`, mismatched \`media_type\`) and the API rejects the call before your prompt even gets read. Get it right once here and every later lesson just reuses \`build_image_message\`.

## The mental model

Text prompts are one string in a dict. Image prompts are two dicts in a list: a picture wrapped in an envelope labeled with its encoding, next to your instruction. Below, build that envelope in pure Python with no network, so you own the exact structure before you spend an API call on it.`,
      starter_code: `# Build the content-block list a vision message needs, no network call.
import base64

def build_image_message(image_bytes, prompt, media_type="image/png"):
    # TODO: base64-encode image_bytes and decode it to a utf-8 string.
    # TODO: return a list with ONE message dict:
    #   {"role": "user", "content": [image_block, text_block]}
    # where image_block is {"type": "image", "source": {"type": "base64",
    #   "media_type": media_type, "data": <b64 string>}}
    # and text_block is {"type": "text", "text": prompt}
    pass

fake_screenshot = b"pretend-these-are-png-bytes"
messages = build_image_message(fake_screenshot, "Describe this screenshot.")
print(messages[0]["role"])
print(len(messages[0]["content"]))
`,
      solution_code: `# Build the content-block list a vision message needs, no network call.
import base64

def build_image_message(image_bytes, prompt, media_type="image/png"):
    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    return [{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": b64_data,
                },
            },
            {"type": "text", "text": prompt},
        ],
    }]

fake_screenshot = b"pretend-these-are-png-bytes"
messages = build_image_message(fake_screenshot, "Describe this screenshot.")

print(messages[0]["role"])
print(len(messages[0]["content"]))
image_block = messages[0]["content"][0]
print(image_block["type"])
print(image_block["source"]["media_type"])
print("b64 length:", len(image_block["source"]["data"]))
`,
      hints: [
        "base64.b64encode(image_bytes) returns bytes; call .decode('utf-8') to get a str.",
        "The content list has exactly two items: the image block, then the text block.",
        "The image block's source dict needs three keys: type, media_type, and data.",
      ],
      challenge_title: "Estimate the Base64 Payload Size",
      challenge_description:
        "Compute how long a base64-encoded string will be for a given raw byte count, without actually encoding anything.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import math

def main():
    n = int(sys.stdin.read().strip())
    # 'n' is the number of raw image bytes.

    # TODO: base64 groups every 3 raw bytes into 4 output characters,
    #       rounding the group count up if the last group is partial.
    # TODO: print the resulting encoded length.

main()
`,
      challenge_solution_code: `import sys
import math

def main():
    n = int(sys.stdin.read().strip())

    groups = math.ceil(n / 3)
    encoded_length = groups * 4

    print(encoded_length)

main()
`,
      challenge_test_cases: [
        { input: "3", expected_output: "4", description: "Exactly one full 3-byte group encodes to 4 characters." },
        { input: "4", expected_output: "8", description: "4 bytes need a second, partial group, padded up to 8 characters." },
        { input: "0", expected_output: "0", description: "Edge: zero bytes encode to an empty string." },
        { input: "10", expected_output: "16", description: "10 bytes need ceil(10/3)=4 groups, so 16 characters." },
      ],
    },

    {
      id: "prod-14-2",
      project_id: "prod-14",
      order: 2,
      title: "Reading the Reply's Content Blocks",
      concept: "parsing the model's response",
      explanation: `You sent the image. Something came back. Now you need the description out of it, in a way that won't break the moment the reply isn't perfectly simple.

## The smallest thing that works

For most calls, the answer is one line you've probably seen before:

\`\`\`python
resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=build_image_message(image_bytes, "Describe this screenshot in one paragraph."),
)
description = resp.content[0].text
print(description)
\`\`\`

That's a working screenshot describer already: image in, one paragraph out. Shipping something small is a fine first milestone.

## But content is a list, not a string

\`resp.content\` is not text. It's a **list of content blocks**, and \`[0].text\` only works because the first block usually is the reply text. A vision reply can include more than one block, for instance the model reasoning in one block before answering in another. Grabbing only \`content[0]\` silently drops anything after it.

The safer version loops over every block and keeps only the text ones:

\`\`\`python
def extract_text(blocks):
    parts = []
    for block in blocks:
        if block.type == "text":
            parts.append(block.text)
    return "".join(parts)

description = extract_text(resp.content)
\`\`\`

This never assumes the reply is exactly one block. It filters by \`type\` and stitches whatever text blocks exist, in order, into one string. A non-text block (a future tool call, an image the model returned) gets skipped instead of crashing the code.

## Why bother when \`[0].text\` "works"

It works until the day it doesn't: some input, some model version, some case where the API adds a block you didn't expect. \`extract_text\` costs four lines and never breaks that way. It's the "handle reality" step applied to the read side instead of the write side. Don't trust the shape of what comes back. Filter it.

## The mental model

Think of \`resp.content\` as an inbox, not a single letter. Most days one letter (a text block) is waiting, so grabbing the first one feels fine. But an inbox can hold more than one item, and code that only ever checks the first slot eventually misses something real. Below, practice reading a content list defensively in pure Python, no network needed.`,
      starter_code: `# The reply's content is a list of blocks. Pull out only the text ones.

def extract_text(blocks):
    # TODO: collect the "text" field from every block whose "type" is "text",
    #       in order, and join them into one string with no separator.
    pass

blocks = [
    {"type": "text", "text": "This looks like a "},
    {"type": "tool_use", "id": "x1", "name": "zoom"},
    {"type": "text", "text": "login screen with an email and password field."},
]
print(extract_text(blocks))
`,
      solution_code: `# The reply's content is a list of blocks. Pull out only the text ones.

def extract_text(blocks):
    parts = []
    for block in blocks:
        if block.get("type") == "text":
            parts.append(block["text"])
    return "".join(parts)

blocks = [
    {"type": "text", "text": "This looks like a "},
    {"type": "tool_use", "id": "x1", "name": "zoom"},
    {"type": "text", "text": "login screen with an email and password field."},
]

description = extract_text(blocks)
print(description)
print("blocks seen:", len(blocks))
print("text blocks used:", sum(1 for b in blocks if b["type"] == "text"))
`,
      hints: [
        "Loop over blocks and check block['type'] == 'text' before touching block['text'].",
        "Skip (don't crash on) any block whose type isn't 'text'.",
        "Join the collected pieces with \"\".join(parts), no space between them.",
      ],
      challenge_title: "Stitch the Text Blocks",
      challenge_description:
        "Concatenate only the text-typed blocks from a simulated model reply, skipping any other block types.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    blocks = []
    for i in range(1, n + 1):
        kind, content = lines[i].split("|", 1)
        blocks.append((kind, content))
    # 'blocks' is a list of (type, content) pairs in order.

    # TODO: concatenate the content of every block whose type is exactly "text",
    #       in order, with no separator, and print the result.
    #       (print an empty line if there are no text blocks.)

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    blocks = []
    for i in range(1, n + 1):
        kind, content = lines[i].split("|", 1)
        blocks.append((kind, content))

    result = "".join(content for kind, content in blocks if kind == "text")
    print(result)

main()
`,
      challenge_test_cases: [
        {
          input: "3\ntext|This is a \ntool_use|ignored\ntext|login screen.",
          expected_output: "This is a login screen.",
          description: "Two text blocks are stitched together; the tool_use block is skipped.",
        },
        {
          input: "2\ntool_use|a\nthinking|b",
          expected_output: "",
          description: "No text blocks at all means an empty result.",
        },
        {
          input: "1\ntext|Just one block.",
          expected_output: "Just one block.",
          description: "A single text block passes through unchanged.",
        },
      ],
    },

    {
      id: "prod-14-3",
      project_id: "prod-14",
      order: 3,
      title: "Prompting for a Structured Description",
      concept: "structured UI JSON output",
      explanation: `A paragraph description is nice to read and useless to a program. Lesson 4 generates HTML from what the model saw, and HTML generation needs data, not prose. This lesson turns the description into JSON your code can walk.

## Design the schema first

Before writing the prompt, decide the shape you want back. Here's a UI schema that works:

\`\`\`json
{
  "layout": "sidebar+main",
  "components": [
    {"type": "heading", "text": "Dashboard"},
    {"type": "button", "text": "Submit"}
  ]
}
\`\`\`

\`layout\` is a short label for the overall arrangement. \`components\` is a list, each entry an element the model spotted, with its \`type\` (button, heading, text, input, image, link) and its visible \`text\`.

## The prompt pins the schema down

\`\`\`python
SYSTEM = """You describe UI screenshots as JSON.
Return ONLY a JSON object, no prose, no code fences, with these keys:
- "layout": a short string describing the arrangement (e.g. "sidebar+main")
- "components": a list of objects, each with "type" (one of: button,
  heading, text, input, image, link) and "text" (the visible label,
  or "" if none)
Do not invent components that aren't visible in the image."""
\`\`\`

Naming the exact keys, and the exact allowed \`type\` values, is what separates a schema the model mostly follows from one where it improvises a new shape every run.

## Parse it defensively

Models still wrap JSON in a sentence or a code fence sometimes, even when told not to. Slice out the object before trusting it:

\`\`\`python
import json

def parse_description(raw_text):
    start = raw_text.index("{")
    end = raw_text.rindex("}") + 1
    return json.loads(raw_text[start:end])
\`\`\`

Finding the first \`{\` and the last \`}\` throws away any wrapper text and hands \`json.loads\` a clean object. It's the same trick you'd use parsing any structured reply.

## Why this matters

Everything from lesson 4 onward reads fields off this dictionary: HTML generation, layout CSS, validation. A vague prompt gives you keys that change shape every run, and every downstream lesson breaks on it. Pin the schema down here, once, and the rest of the build gets to assume it holds.

## The mental model

Prose is for humans. JSON is for the next function in your pipeline. The prompt is where you trade the model's freedom for your code's ability to trust the shape of what it gets. Below, parse a sample structured reply and count what it found, no network call needed.`,
      starter_code: `# Extract and parse a structured UI description from a raw model reply.
import json

def parse_description(raw_text):
    # TODO: find the first "{" and the last "}" in raw_text.
    # TODO: slice that range and json.loads() it, returning the dict.
    pass

raw_reply = """Here is the UI:
{"layout": "sidebar+main", "components": [{"type": "heading", "text": "Dashboard"}, {"type": "button", "text": "Submit"}]}"""

data = parse_description(raw_reply)
print(data["layout"])
print(len(data["components"]))
`,
      solution_code: `# Extract and parse a structured UI description from a raw model reply.
import json

def parse_description(raw_text):
    start = raw_text.index("{")
    end = raw_text.rindex("}") + 1
    return json.loads(raw_text[start:end])

raw_reply = """Here is the UI:
{"layout": "sidebar+main", "components": [{"type": "heading", "text": "Dashboard"}, {"type": "button", "text": "Submit"}]}"""

data = parse_description(raw_reply)

print(data["layout"])
print(len(data["components"]))
print(data["components"][0]["type"])
print(data["components"][1]["text"])
`,
      hints: [
        "raw_text.index('{') finds the first brace; rindex('}') finds the last one.",
        "Add 1 to the rindex result so the slice includes the closing brace.",
        "json.loads on the sliced substring returns a normal Python dict.",
      ],
      challenge_title: "Parse the Structured Reply",
      challenge_description:
        "Extract a JSON object with 'layout' and 'components' keys out of a reply that may have junk text around it.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import json

def main():
    raw = sys.stdin.read()
    # 'raw' may have text before and/or after the JSON object.

    # TODO: slice from the first "{" to the last "}" and json.loads it.
    # TODO: print the "layout" value, then the number of "components".

main()
`,
      challenge_solution_code: `import sys
import json

def main():
    raw = sys.stdin.read()

    start = raw.index("{")
    end = raw.rindex("}") + 1
    data = json.loads(raw[start:end])

    print(data["layout"])
    print(len(data["components"]))

main()
`,
      challenge_test_cases: [
        {
          input: 'Sure, here you go:\n{"layout": "grid", "components": [{"type":"button"},{"type":"input"},{"type":"heading"}]}\nHope that helps!',
          expected_output: "grid\n3",
          description: "Junk text before and after the JSON object is ignored.",
        },
        {
          input: '{"layout": "single-column", "components": []}',
          expected_output: "single-column\n0",
          description: "Edge: an empty components list is valid and counts as zero.",
        },
        {
          input: '```json\n{"layout":"sidebar+main","components":[{"type":"nav"}]}\n```',
          expected_output: "sidebar+main\n1",
          description: "Code-fence markers around the JSON don't stop the extraction.",
        },
      ],
    },

    {
      id: "prod-14-4",
      project_id: "prod-14",
      order: 4,
      title: "From Description to Starter Markup",
      concept: "generating HTML from components",
      explanation: `You have a list of components, each with a type and text. Turn that data into something a browser can render: starter HTML the user can drop into a project and keep building.

## One mapping, one function

Each component \`type\` maps to one HTML tag. Build that mapping once, as a plain dictionary:

\`\`\`python
TAG_MAP = {
    "button": "button",
    "heading": "h2",
    "text": "p",
    "input": "input",
    "image": "img",
    "link": "a",
}

SELF_CLOSING = {"input", "img"}

def component_to_html(component):
    tag = TAG_MAP.get(component["type"], "div")
    if tag in SELF_CLOSING:
        return f"<{tag} />"
    text = component.get("text", "")
    return f"<{tag}>{text}</{tag}>"
\`\`\`

Two small decisions carry the whole function. \`TAG_MAP.get(..., "div")\` means an unrecognized type falls back to a generic \`div\` instead of crashing the generator, so odd model output degrades quietly instead of blowing up the build. And \`input\`/\`img\` are self-closing tags in HTML. They don't wrap text, so they need their own branch.

## Real usage: describe, then render

\`\`\`python
description = parse_description(raw_text)  # from lesson 3

html_lines = [component_to_html(c) for c in description["components"]]
for line in html_lines:
    print(line)
\`\`\`

That loop is the entire "generate starter code" half of this product's name. Everything before it (image in, JSON out) feeds this one small rendering step.

## Why a dictionary beats an if/elif chain

Six \`type\` values today might be twelve next month once you add a nav bar or a dropdown. Adding a row to \`TAG_MAP\` is a one-line change. An if/elif chain needs a new branch each time, and it's easy to forget the \`else\` case, which is exactly the crash \`.get(..., "div")\` prevents for free.

## Why this matters

This step turns "the model described a UI" into "here's a file to edit." A description that only prints prose is a novelty. One that emits structurally correct starter tags is something someone can build on. It doesn't have to produce pixel-perfect final markup, just a sane starting skeleton, which is what "starter code" means.

## The mental model

A component is data. A tag is its rendering. The map is the whole translation layer between them, and a safe default keeps an unexpected \`type\` from becoming a crash instead of a slightly generic \`<div>\`. Below, build that translation in pure Python.`,
      starter_code: `# Map each component's type to an HTML tag and render it.

TAG_MAP = {
    "button": "button",
    "heading": "h2",
    "text": "p",
    "input": "input",
    "image": "img",
    "link": "a",
}
SELF_CLOSING = {"input", "img"}

def component_to_html(component):
    # TODO: look up the tag in TAG_MAP, defaulting to "div" if unknown.
    # TODO: if the tag is in SELF_CLOSING, return "<tag />".
    # TODO: otherwise return "<tag>text</tag>" using component.get("text", "").
    pass

components = [
    {"type": "heading", "text": "Dashboard"},
    {"type": "button", "text": "Submit"},
    {"type": "input", "text": ""},
]
for c in components:
    print(component_to_html(c))
`,
      solution_code: `# Map each component's type to an HTML tag and render it.

TAG_MAP = {
    "button": "button",
    "heading": "h2",
    "text": "p",
    "input": "input",
    "image": "img",
    "link": "a",
}
SELF_CLOSING = {"input", "img"}

def component_to_html(component):
    tag = TAG_MAP.get(component["type"], "div")
    if tag in SELF_CLOSING:
        return f"<{tag} />"
    text = component.get("text", "")
    return f"<{tag}>{text}</{tag}>"

components = [
    {"type": "heading", "text": "Dashboard"},
    {"type": "button", "text": "Submit"},
    {"type": "input", "text": ""},
    {"type": "widget", "text": "Mystery"},
]
for c in components:
    print(component_to_html(c))
`,
      hints: [
        "TAG_MAP.get(component['type'], 'div') handles unknown types automatically.",
        "Check membership with `tag in SELF_CLOSING` before deciding the format.",
        "Use an f-string like f\"<{tag}>{text}</{tag}>\" for the normal case.",
      ],
      challenge_title: "Render Components to HTML",
      challenge_description:
        "Convert a list of UI components into their matching HTML tags, one per line, using a fixed type-to-tag mapping.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    components = []
    for i in range(1, n + 1):
        kind, text = lines[i].split("|", 1)
        components.append((kind, text))
    # 'components' is a list of (type, text) pairs in order.

    # TODO: map button->button, heading->h2, text->p, link->a as normal tags
    #       rendered as "<tag>text</tag>"; input->input and image->img as
    #       self-closing tags rendered as "<tag />" (ignore their text);
    #       any other type falls back to "div".
    # TODO: print one rendered tag per line, in order.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    components = []
    for i in range(1, n + 1):
        kind, text = lines[i].split("|", 1)
        components.append((kind, text))

    tag_map = {
        "button": "button",
        "heading": "h2",
        "text": "p",
        "input": "input",
        "image": "img",
        "link": "a",
    }
    self_closing = {"input", "image"}

    for kind, text in components:
        tag = tag_map.get(kind, "div")
        if kind in self_closing:
            html_tag = tag_map.get(kind, "div")
            print(f"<{html_tag} />")
        else:
            print(f"<{tag}>{text}</{tag}>")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nbutton|Submit\nheading|Dashboard\ntext|Welcome back",
          expected_output: "<button>Submit</button>\n<h2>Dashboard</h2>\n<p>Welcome back</p>",
          description: "Three known types render as their mapped, text-wrapping tags.",
        },
        {
          input: "2\ninput|ignored\nimage|ignored",
          expected_output: "<input />\n<img />",
          description: "input and image are self-closing and ignore their text.",
        },
        {
          input: "1\nwidget|Mystery",
          expected_output: "<div>Mystery</div>",
          description: "An unrecognized type falls back to a plain div.",
        },
      ],
    },

    {
      id: "prod-14-5",
      project_id: "prod-14",
      order: 5,
      title: "Turning Regions into Layout CSS",
      concept: "layout and positioning",
      explanation: `Tags without layout are a pile of elements stacked top to bottom. A screenshot has structure: a header up top, a sidebar on the left, a footer at the bottom. The starter code should hint at that structure instead of throwing it away.

## Add a region to the schema

Extend lesson 3's component schema with one more field: which part of the page the element lives in.

\`\`\`json
{"type": "button", "text": "Submit", "region": "main"}
\`\`\`

A small fixed set of regions keeps this predictable: \`header\`, \`sidebar\`, \`main\`, \`footer\`. You'd add \`region\` to the system prompt's schema right alongside \`type\` and \`text\` from lesson 3.

## CSS Grid speaks the same language

CSS Grid has a feature built for exactly this: \`grid-area\`. Name a region on the container's template, then assign each element to that named area:

\`\`\`python
def css_rule(component, index):
    region = component.get("region") or "main"
    element_id = f"component-{index}"
    return f"#{element_id} {{ grid-area: {region}; }}"
\`\`\`

\`component.get("region") or "main"\` does two jobs at once. It handles a missing \`region\` key *and* an empty-string region, falling back to \`main\` either way. Most of a screenshot is main content, so that's the safest default when the model isn't sure.

## Pairing it with the HTML

Give each rendered tag a matching id, so the CSS rule and the markup line up:

\`\`\`python
html_lines = []
css_lines = []
for i, c in enumerate(description["components"], start=1):
    tag_html = component_to_html(c)  # from lesson 4
    html_lines.append(tag_html.replace(">", f' id="component-{i}">', 1))
    css_lines.append(css_rule(c, i))
\`\`\`

Now the starter bundle has matching parts: an HTML element, an id, and a CSS rule that places it in the right region of a grid.

## Why not compute exact pixel positions

You could ask the model for x/y coordinates and hard-code absolute positions, but that freezes the layout to one screen size and breaks the moment the window resizes. Naming a *region* instead of a *coordinate* is the same idea as writing "sidebar" instead of "the box at x=0, y=140." It survives resizing, content changes, and a human editing it afterward. That's the difference between a screenshot clone and reusable starter code.

## The mental model

A component's type says what it is. Its region says where it roughly belongs. Grid areas are the bridge between "roughly belongs in the sidebar" and working CSS. Below, generate the grid-area rule for a list of components in pure Python, no browser needed to check your work.`,
      starter_code: `# Generate a CSS grid-area rule for each component, based on its region.

def css_rule(component, index):
    # TODO: region = component's "region" field, or "main" if missing/empty.
    # TODO: return "#component-{index} { grid-area: {region}; }"
    pass

components = [
    {"type": "heading", "region": "header"},
    {"type": "text", "region": "main"},
    {"type": "button", "region": ""},
]
for i, c in enumerate(components, start=1):
    print(css_rule(c, i))
`,
      solution_code: `# Generate a CSS grid-area rule for each component, based on its region.

def css_rule(component, index):
    region = component.get("region") or "main"
    return f"#component-{index} {{ grid-area: {region}; }}"

components = [
    {"type": "heading", "region": "header"},
    {"type": "text", "region": "main"},
    {"type": "button", "region": ""},
    {"type": "link"},
]
for i, c in enumerate(components, start=1):
    print(css_rule(c, i))
`,
      hints: [
        "component.get('region') or 'main' handles both a missing key and an empty string.",
        "The output uses literal curly braces around grid-area, so double them: {{ ... }} in an f-string.",
        "IDs are 1-indexed: enumerate(components, start=1).",
      ],
      challenge_title: "Assign Grid Areas",
      challenge_description:
        "Generate a CSS grid-area rule for each component in order, defaulting to 'main' when the region is missing.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    regions = lines[1:1 + n]
    # Each region is a string, or "-" meaning missing (use "main" instead).

    # TODO: for each region (1-indexed), print:
    #   "#component-{i} { grid-area: {region_or_main}; }"

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    n = int(lines[0].strip())
    regions = lines[1:1 + n]

    for i, region in enumerate(regions, start=1):
        resolved = "main" if region == "-" else region
        print(f"#component-{i} {{ grid-area: {resolved}; }}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nheader\nmain\nfooter",
          expected_output: "#component-1 { grid-area: header; }\n#component-2 { grid-area: main; }\n#component-3 { grid-area: footer; }",
          description: "Three explicit regions map straight through.",
        },
        {
          input: "2\n-\nsidebar",
          expected_output: "#component-1 { grid-area: main; }\n#component-2 { grid-area: sidebar; }",
          description: "A missing region ('-') falls back to 'main'.",
        },
        {
          input: "1\nheader",
          expected_output: "#component-1 { grid-area: header; }",
          description: "Edge: a single component still gets id 1.",
        },
      ],
    },

    {
      id: "prod-14-6",
      project_id: "prod-14",
      order: 6,
      title: "Harden: Fixing Broken Descriptions",
      concept: "validating and repairing model output",
      explanation: `Lesson 3's prompt asks nicely for a fixed schema. A nice request isn't a guarantee. Sooner or later the model hands you a description missing \`layout\`, a component missing \`text\`, or a \`type\` value that was never in your allowed list. This lesson stops those from becoming crashes.

## Normalize, don't trust

The fix is one function that takes whatever came back and returns something with every field your renderer needs:

\`\`\`python
ALLOWED_TYPES = {"button", "heading", "text", "input", "image", "link"}

def normalize(description):
    layout = description.get("layout") or "single-column"
    raw_components = description.get("components") or []

    fixed = []
    for c in raw_components:
        kind = c.get("type") or "text"
        if kind not in ALLOWED_TYPES:
            kind = "div"
        fixed.append({"type": kind, "text": c.get("text") or ""})

    return {"layout": layout, "components": fixed}
\`\`\`

Read the defaults carefully. Each one closes a specific way things go wrong:

- No \`layout\` key at all → \`"single-column"\`, a generic fallback.
- No \`components\` key, or it's \`null\` → an empty list, not a crash on the next loop.
- A component missing \`type\` → treated as plain \`"text"\`, the most harmless guess.
- A \`type\` the model invented that isn't in your allowed set (say, \`"navbar-thing"\`) → downgraded to \`"div"\`, the same fallback lesson 4's renderer already uses.
- A component missing \`text\` → empty string, never \`None\` leaking into an f-string as the literal word "None".

## Why normalize once, here

Skip this step and every later function needs its own defensive \`.get(..., default)\` calls scattered around: the HTML renderer, the CSS generator, the CLI. Miss one and it crashes. Normalizing right after parsing lets everything downstream assume a clean shape and use \`description["layout"]\` without flinching.

## Pairing with a retry

If \`json.loads\` fails outright (the model's "JSON" wasn't valid JSON at all), that's not a normalization problem. It's a call you retry, the same pattern as any structured-output tool: try, catch the parse error, ask again with a firmer instruction, give up gracefully after a couple of attempts.

## Why this matters

A description tool that throws a \`KeyError\` on a live screenshot isn't a tool. It's a demo that works on your test image. Normalizing turns "the model's JSON was almost right" into "the JSON is exactly right, and downstream code never has to know it was ever wrong."

## The mental model

Treat the model's structured output the way you'd treat form input from a stranger on the internet: plausible, usually fine, never fully trusted. Normalize once at the door and every room past it is safe. Below, build that normalizer in pure Python.`,
      starter_code: `# Normalize a messy description dict into a guaranteed-clean shape.

ALLOWED_TYPES = {"button", "heading", "text", "input", "image", "link"}

def normalize(description):
    # TODO: layout = description's "layout", or "single-column" if missing/falsy.
    # TODO: raw_components = description's "components", or [] if missing/falsy.
    # TODO: for each raw component: kind = its "type" or "text" if missing;
    #       if kind isn't in ALLOWED_TYPES, use "div" instead.
    #       text = its "text" or "" if missing.
    # TODO: return {"layout": layout, "components": [...]} with the fixed list.
    pass

messy = {"components": [{"type": "widget"}, {"type": "button", "text": "Go"}]}
result = normalize(messy)
print(result["layout"])
for c in result["components"]:
    print(c["type"], repr(c["text"]))
`,
      solution_code: `# Normalize a messy description dict into a guaranteed-clean shape.

ALLOWED_TYPES = {"button", "heading", "text", "input", "image", "link"}

def normalize(description):
    layout = description.get("layout") or "single-column"
    raw_components = description.get("components") or []

    fixed = []
    for c in raw_components:
        kind = c.get("type") or "text"
        if kind not in ALLOWED_TYPES:
            kind = "div"
        fixed.append({"type": kind, "text": c.get("text") or ""})

    return {"layout": layout, "components": fixed}

messy = {"components": [{"type": "widget"}, {"type": "button", "text": "Go"}]}
result = normalize(messy)

print(result["layout"])
for c in result["components"]:
    print(c["type"], repr(c["text"]))

empty = {}
print(normalize(empty))
`,
      hints: [
        "'x or default' returns default when x is missing, None, empty string, or empty list.",
        "Check membership with `kind not in ALLOWED_TYPES` to catch invented types.",
        "Build the fixed components list with a plain for loop and .append().",
      ],
      challenge_title: "Normalize a Broken Description",
      challenge_description:
        "Fill in default values for a UI description missing its layout key, and repair components with missing or unknown types.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    layout_line = lines[0].strip()
    n = int(lines[1].strip())
    components = []
    for i in range(2, 2 + n):
        kind, text = lines[i].split("|", 1)
        components.append((kind, text))
    # layout_line is "NONE" if the layout key was missing (default "single-column").
    # For each component: kind is "NONE" if missing (default "text");
    #   text is "NONE" if missing (default "").
    #   Allowed kinds: button, heading, text, input, image, link; anything else -> "div".

    # TODO: resolve and print the layout on its own line.
    # TODO: for each component, print "kind:text" using the resolved values.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    layout_line = lines[0].strip()
    n = int(lines[1].strip())
    components = []
    for i in range(2, 2 + n):
        kind, text = lines[i].split("|", 1)
        components.append((kind, text))

    allowed = {"button", "heading", "text", "input", "image", "link"}

    layout = "single-column" if layout_line == "NONE" else layout_line
    print(layout)

    for kind, text in components:
        resolved_kind = "text" if kind == "NONE" else kind
        if resolved_kind not in allowed:
            resolved_kind = "div"
        resolved_text = "" if text == "NONE" else text
        print(f"{resolved_kind}:{resolved_text}")

main()
`,
      challenge_test_cases: [
        {
          input: "NONE\n2\nNONE|Hello\nwidget|Mystery",
          expected_output: "single-column\ntext:Hello\ndiv:Mystery",
          description: "Missing layout defaults, a missing type defaults to text, an unknown type becomes div.",
        },
        {
          input: "grid\n1\nbutton|Submit",
          expected_output: "grid\nbutton:Submit",
          description: "A fully valid description passes through unchanged.",
        },
        {
          input: "sidebar+main\n1\nheading|NONE",
          expected_output: "sidebar+main\nheading:",
          description: "Edge: a missing text value resolves to an empty string.",
        },
      ],
    },

    {
      id: "prod-14-7",
      project_id: "prod-14",
      order: 7,
      title: "Harden: Big Screenshots Cost Tokens",
      concept: "image size and token cost",
      explanation: `A screenshot from a modern laptop can be 3000 pixels wide. Send that straight to the model and the request gets slow and the bill for that one call jumps. Images aren't free. They're billed in tokens, just like text.

## Images cost tokens too

Anthropic's models estimate an image's token cost from its pixel area. A rule of thumb: tokens are about (width x height) / 750. A 1024x1024 screenshot costs roughly 1,400 tokens before you've sent a single word of prompt. A full-resolution 4K screenshot can cost tens of thousands of tokens for one image, more than most entire text prompts.

\`\`\`python
def estimate_image_tokens(width, height):
    return (width * height) // 750
\`\`\`

## Downscale before you send

The model doesn't need every pixel to read a button label. Capping the longest side to something like 1024 or 1568 pixels keeps the image sharp enough to describe a UI while cutting the token bill sharply:

\`\`\`python
def resize_dimensions(width, height, max_dim):
    if width <= max_dim and height <= max_dim:
        return width, height
    longest = max(width, height)
    new_width = (width * max_dim) // longest
    new_height = (height * max_dim) // longest
    return new_width, new_height
\`\`\`

This keeps the aspect ratio. Both sides shrink by the same factor, computed with integer math so the result is exact rather than drifting from floating-point rounding. In a real tool you'd hand these dimensions to an image library (Pillow's \`Image.resize\`) before base64-encoding the result.

## The order of operations matters

Resize *before* you base64-encode, not after. Base64 only re-encodes whatever bytes you give it. Shrinking the image first is what actually cuts the token cost. There's no such thing as encoding a giant image efficiently, since the pixels are still the pixels.

\`\`\`python
from PIL import Image

img = Image.open("screenshot.png")
new_w, new_h = resize_dimensions(img.width, img.height, 1024)
img = img.resize((new_w, new_h))
# ...then base64-encode the resized image, as in lesson 1
\`\`\`

## Why this matters

A describer tool that works fine on your 800px test image but silently costs ten times as much (or times out) on a real user's 4K screenshot isn't production-ready. Capping dimensions before every call is a cheap, boring guard that makes the cost predictable no matter what gets uploaded.

## The mental model

Every extra pixel is tokens you pay for and didn't need to read a button label. Resize down to just enough to read, and both your latency and your bill stop depending on what monitor the user happened to screenshot from. Below, compute the resized dimensions and the resulting token estimate. Pure math, no image library needed.`,
      starter_code: `# Cap an image's dimensions and estimate the resulting token cost.

def resize_dimensions(width, height, max_dim):
    # TODO: if both sides already fit, return (width, height) unchanged.
    # TODO: otherwise scale both sides down by the same ratio (integer math)
    #       so the longest side becomes exactly max_dim.
    pass

def estimate_image_tokens(width, height):
    # TODO: return (width * height) // 750
    pass

w, h = resize_dimensions(2000, 1000, 1024)
print(w, h)
print(estimate_image_tokens(w, h))
`,
      solution_code: `# Cap an image's dimensions and estimate the resulting token cost.

def resize_dimensions(width, height, max_dim):
    if width <= max_dim and height <= max_dim:
        return width, height
    longest = max(width, height)
    new_width = (width * max_dim) // longest
    new_height = (height * max_dim) // longest
    return new_width, new_height

def estimate_image_tokens(width, height):
    return (width * height) // 750

w, h = resize_dimensions(2000, 1000, 1024)
print(w, h)
print(estimate_image_tokens(w, h))

w2, h2 = resize_dimensions(800, 600, 1024)
print(w2, h2)
print(estimate_image_tokens(w2, h2))
`,
      hints: [
        "Compare both dimensions to max_dim before doing any scaling math.",
        "Use integer division (//) so results are exact whole pixels, no float drift.",
        "The scale factor is max_dim divided by whichever side is longest.",
      ],
      challenge_title: "Resize and Estimate Token Cost",
      challenge_description:
        "Cap an image's dimensions to a maximum side length, then estimate the token cost of the resized image.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    w, h, max_dim = map(int, sys.stdin.read().split())

    # TODO: if w and h both already fit within max_dim, keep them unchanged.
    # TODO: otherwise scale both down (integer math) so the longer side
    #       becomes exactly max_dim, preserving the aspect ratio.
    # TODO: print the resized "w h" on one line.
    # TODO: print (w * h) // 750 as the estimated token cost on the next line.

main()
`,
      challenge_solution_code: `import sys

def main():
    w, h, max_dim = map(int, sys.stdin.read().split())

    if w <= max_dim and h <= max_dim:
        new_w, new_h = w, h
    else:
        longest = max(w, h)
        new_w = (w * max_dim) // longest
        new_h = (h * max_dim) // longest

    print(new_w, new_h)
    print((new_w * new_h) // 750)

main()
`,
      challenge_test_cases: [
        {
          input: "2000 1000 1024",
          expected_output: "1024 512\n699",
          description: "A wide screenshot is scaled down so its longer side becomes exactly 1024.",
        },
        {
          input: "800 600 1024",
          expected_output: "800 600\n640",
          description: "An image already within bounds is left unchanged.",
        },
        {
          input: "1024 1024 1024",
          expected_output: "1024 1024\n1398",
          description: "Edge: dimensions exactly equal to max_dim count as already fitting.",
        },
      ],
    },

    {
      id: "prod-14-8",
      project_id: "prod-14",
      order: 8,
      title: "Ship the Screenshot Describer",
      concept: "shipping the tool",
      explanation: `Every piece exists now: image encoding, structured parsing, HTML rendering, layout CSS, validation, and a size guard. Lesson 8 wires them into one command someone can run, and finishes by landing the build in your **Portfolio**.

## Two modes, one pipeline

The tool does one of two things depending on what the user wants: a plain-English description, or generated starter code. Both modes share every step up through normalization. Only the last step differs.

\`\`\`python
def render_describe(description):
    n = len(description["components"])
    return f"Layout: {description['layout']}. {n} component(s) detected."

def render_code(description):
    lines = ["<!DOCTYPE html>", "<html>", "<body>"]
    for c in description["components"]:
        lines.append(component_to_html(c))  # from lesson 4
    lines += ["</body>", "</html>"]
    return "\\n".join(lines)

def dispatch(mode, description):
    if mode == "describe":
        return render_describe(description)
    if mode == "code":
        return render_code(description)
    raise ValueError(f"unknown mode: {mode}")
\`\`\`

## The full run, top to bottom

\`\`\`python
import sys

def main():
    image_path = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "describe"

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    messages = build_image_message(image_bytes, SYSTEM_JSON_PROMPT)  # lesson 1 + 3
    resp = client.messages.create(model="claude-sonnet-4-6", max_tokens=800, messages=messages)
    raw_text = extract_text(resp.content)                            # lesson 2

    description = normalize(parse_description(raw_text))             # lesson 3 + 6
    print(dispatch(mode, description))

if __name__ == "__main__":
    main()
\`\`\`

\`python describe.py screenshot.png\` prints a paragraph. \`python describe.py screenshot.png code\` prints starter HTML. Same pipeline, one argument decides the output.

## What "shipped" means here

The same three checks as every product in this track. It runs from a clean start with one command. It survives a broken reply or an oversized image without crashing, which is lessons 6 and 7 doing their job. And someone else could point it at their own screenshot from your instructions alone.

## Into your Portfolio

Finishing this lesson records the Screenshot Describer in your **Portfolio** tab, what it does and that it's built and working. Keep one example screenshot and its output next to it, proof this isn't a demo that only works on the one image you tested.

## The mental model

A shipped tool hides its plumbing behind one flag. The user picks "describe" or "code," and everything about images, JSON, and defaults happens underneath. Below, build that final dispatcher. Last piece, then it's done.`,
      starter_code: `# The final dispatcher: pick describe-text or generated-HTML output.

def render_describe(description):
    # TODO: return "Layout: {layout}. {n} component(s) detected."
    pass

def render_code(description, html_lines):
    # TODO: return a list of lines: "<!DOCTYPE html>", "<html>", "<body>",
    #       then every item in html_lines, then "</body>", "</html>".
    pass

def dispatch(mode, description, html_lines):
    # TODO: "describe" -> render_describe result.
    # TODO: "code" -> the render_code lines, printed one per line.
    # TODO: anything else -> print "INVALID MODE".
    pass

desc = {"layout": "grid", "components": [{"type": "button", "text": "Go"}]}
html = ["<button>Go</button>"]
dispatch("describe", desc, html)
`,
      solution_code: `# The final dispatcher: pick describe-text or generated-HTML output.

def render_describe(description):
    n = len(description["components"])
    return f"Layout: {description['layout']}. {n} component(s) detected."

def render_code(description, html_lines):
    lines = ["<!DOCTYPE html>", "<html>", "<body>"]
    lines.extend(html_lines)
    lines.append("</body>")
    lines.append("</html>")
    return lines

def dispatch(mode, description, html_lines):
    if mode == "describe":
        print(render_describe(description))
    elif mode == "code":
        for line in render_code(description, html_lines):
            print(line)
    else:
        print("INVALID MODE")

desc = {"layout": "grid", "components": [{"type": "button", "text": "Go"}]}
html = ["<button>Go</button>"]

dispatch("describe", desc, html)
dispatch("code", desc, html)
dispatch("weird", desc, html)

print("Screenshot Describer built. Saved to your Portfolio.")
`,
      hints: [
        "render_describe just formats one f-string using layout and len(components).",
        "render_code builds a plain list of strings; use .extend() to add html_lines in the middle.",
        "dispatch prints directly rather than returning, so each mode's branch calls print() itself.",
      ],
      challenge_title: "Dispatch the Final Output",
      challenge_description:
        "Given a mode, layout, and rendered HTML lines, print either a one-line description or a full HTML document.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    mode = lines[0].strip()
    layout = lines[1].strip()
    n = int(lines[2].strip())
    html_lines = lines[3:3 + n]

    # TODO: if mode == "describe": print "Layout: {layout}. {n} component(s) detected."
    # TODO: if mode == "code": print "<!DOCTYPE html>", "<html>", "<body>",
    #       then each line in html_lines, then "</body>", "</html>" (one per line).
    # TODO: any other mode: print "INVALID MODE"

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().splitlines()
    mode = lines[0].strip()
    layout = lines[1].strip()
    n = int(lines[2].strip())
    html_lines = lines[3:3 + n]

    if mode == "describe":
        print(f"Layout: {layout}. {n} component(s) detected.")
    elif mode == "code":
        print("<!DOCTYPE html>")
        print("<html>")
        print("<body>")
        for line in html_lines:
            print(line)
        print("</body>")
        print("</html>")
    else:
        print("INVALID MODE")

main()
`,
      challenge_test_cases: [
        {
          input: "describe\ngrid\n3\n<button>Submit</button>\n<h2>Dashboard</h2>\n<p>Welcome</p>",
          expected_output: "Layout: grid. 3 component(s) detected.",
          description: "Describe mode ignores the HTML lines and summarizes the count.",
        },
        {
          input: "code\nsingle-column\n2\n<button>Go</button>\n<p>Hi</p>",
          expected_output: "<!DOCTYPE html>\n<html>\n<body>\n<button>Go</button>\n<p>Hi</p>\n</body>\n</html>",
          description: "Code mode wraps the rendered components in a full HTML document.",
        },
        {
          input: "weird\ngrid\n0",
          expected_output: "INVALID MODE",
          description: "Edge: an unrecognized mode prints an explicit error instead of guessing.",
        },
      ],
    },
  ],
};
