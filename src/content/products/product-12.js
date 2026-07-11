const project = {
  id: "prod-12",
  title: "Caption & Alt-Text Generator",
  description:
    "Build a tool that turns any image into two things at once: a vivid caption for sighted readers and concise, accessible alt text for screen readers. Along the way you'll learn how vision models take image input, how to prompt for two different jobs from one picture, and how to keep the output within real accessibility rules.",
  difficulty: "intermediate",
  category: "vision_multimodal",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["vision", "multimodal", "captioning", "alt-text", "accessibility", "image-encoding"],
  order: 112,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-12-1",
    project_id: "prod-12",
    order: 1,
    title: "Sending an Image to a Vision Model",
    concept: "image encoding for vision APIs",
    explanation:
      "A vision model never \"looks\" at a photo file directly. It reads bytes, base64-encoded into text, packed into a JSON content block right next to your prompt. This lesson builds that one payload, the raw ingredient every lesson in this project reuses.\n\n## What \"multimodal input\" means\n\nA normal text call sends one string. A vision call sends a **list of content blocks** instead: one block holds the image, another holds your text instruction. The model reads both as part of the same message and reasons about them together.\n\n## Turning a file into base64\n\nAPIs can't accept raw binary in a JSON request, JSON is text. So the image bytes get base64-encoded first, turning them into a long string of safe characters.\n\n```python\nimport base64\n\nwith open(\"photo.jpg\", \"rb\") as f:\n    image_bytes = f.read()\n\nimage_b64 = base64.b64encode(image_bytes).decode(\"utf-8\")\n```\n\n## Building the content block\n\nThe block needs three things: the block `type` (\"image\"), a `source` dict describing how the data is encoded, and the base64 string itself.\n\n```python\ncontent = [\n    {\n        \"type\": \"image\",\n        \"source\": {\n            \"type\": \"base64\",\n            \"media_type\": \"image/jpeg\",\n            \"data\": image_b64,\n        },\n    },\n    {\"type\": \"text\", \"text\": \"Describe this image in one sentence.\"},\n]\n```\n\n## Sending it\n\n```python\nimport os\nfrom anthropic import Anthropic\n\nclient = Anthropic(api_key=os.environ[\"ANTHROPIC_API_KEY\"])\n\nresponse = client.messages.create(\n    model=\"claude-sonnet-4-6\",\n    max_tokens=200,\n    messages=[{\"role\": \"user\", \"content\": content}],\n)\nprint(response.content[0].text)\n```\n\n## Why media_type matters\n\n`media_type` tells the model how to decode the bytes: `image/jpeg`, `image/png`, `image/webp`, and `image/gif` are the common formats. Label a PNG as JPEG and decoding silently fails or the model misreads the picture. This is a value you choose from the file's real format, not guess.\n\n## The mental model to keep\n\nEvery vision call is really two payloads riding together: a picture translated into text-safe characters, and a sentence telling the model what to do with it. Captions, alt text, validation, everything else in this project is built on top of this one content block.",
    starter_code: `import base64

SAMPLE_BYTES = bytes(range(32)) * 4  # stand-in for real image file bytes

def build_image_content(image_bytes, media_type):
    # TODO: base64-encode image_bytes and return:
    # {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": <b64 str>}}
    pass

def build_message(image_bytes, media_type, prompt):
    # TODO: return [build_image_content(...), {"type": "text", "text": prompt}]
    pass

content = build_message(SAMPLE_BYTES, "image/png", "Describe this image in one sentence.")
print("blocks:", len(content))
print("first block type:", content[0]["type"])
print("data length:", len(content[0]["source"]["data"]))
`,
    solution_code: `import base64

SAMPLE_BYTES = bytes(range(32)) * 4  # stand-in for real image file bytes

def build_image_content(image_bytes, media_type):
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return {
        "type": "image",
        "source": {"type": "base64", "media_type": media_type, "data": encoded},
    }

def build_message(image_bytes, media_type, prompt):
    return [
        build_image_content(image_bytes, media_type),
        {"type": "text", "text": prompt},
    ]

content = build_message(SAMPLE_BYTES, "image/png", "Describe this image in one sentence.")
print("blocks:", len(content))
print("first block type:", content[0]["type"])
print("data length:", len(content[0]["source"]["data"]))
`,
    hints: [
      "base64.b64encode returns bytes; call .decode('utf-8') to get a plain string.",
      "The content list order is the image block first, then the text block.",
      "media_type is just a string like 'image/png' you pass through unchanged.",
    ],
    challenge_title: "Encode the Image Payload",
    challenge_description:
      "Base64-encode a stand-in for raw image bytes and report the media type and encoded data, exactly as you'd pack them into a content block.",
    challenge_language: "python",
    challenge_starter_code: `import sys, base64

def main():
    data = sys.stdin.read().split("\\n")
    media_type = data[0].strip()
    raw = data[1] if len(data) > 1 else ""
    # TODO: base64-encode raw.encode() and decode it back to a string
    # TODO: print three lines: media_type=..., data_length=..., data=...

main()
`,
    challenge_solution_code: `import sys, base64

def main():
    data = sys.stdin.read().split("\\n")
    media_type = data[0].strip()
    raw = data[1] if len(data) > 1 else ""
    encoded = base64.b64encode(raw.encode()).decode("utf-8")
    print(f"media_type={media_type}")
    print(f"data_length={len(encoded)}")
    print(f"data={encoded}")

main()
`,
    challenge_test_cases: [
      { input: "image/png\nAB", expected_output: "media_type=image/png\ndata_length=4\ndata=QUI=", description: "Two-byte string encodes to a 4-character base64 string." },
      { input: "image/jpeg\nHello", expected_output: "media_type=image/jpeg\ndata_length=8\ndata=SGVsbG8=", description: "Five-byte string encodes to 8 base64 characters with one padding char." },
      { input: "image/webp\n", expected_output: "media_type=image/webp\ndata_length=0\ndata=", description: "Edge: empty payload encodes to an empty string." },
    ],
  },
  {
    id: "prod-12-2",
    project_id: "prod-12",
    order: 2,
    title: "The Smallest Caption Call",
    concept: "request/response round trip",
    explanation:
      "Once the payload is built, the actual round trip is short: send it, get text back, print it. This lesson is the smallest version of the whole product, a caption from one image in about ten lines.\n\n## The request/response shape\n\nYou already know what a message with an image looks like from the last lesson. The reply comes back as a `Message` object, and the text you want lives at `response.content[0].text`, the first content block of the reply.\n\n```python\nresponse = client.messages.create(\n    model=\"claude-sonnet-4-6\",\n    max_tokens=200,\n    messages=[{\n        \"role\": \"user\",\n        \"content\": [\n            {\"type\": \"image\", \"source\": {\"type\": \"base64\", \"media_type\": \"image/jpeg\", \"data\": image_b64}},\n            {\"type\": \"text\", \"text\": \"Describe this image in one sentence.\"},\n        ],\n    }],\n)\n\ncaption = response.content[0].text\nprint(caption)\n```\n\n## Why content[0], not just content\n\nThe reply's `content` is itself a **list** of blocks, mirroring the request. A plain text reply almost always has exactly one block of type \"text\", but the SDK keeps the list shape so replies that mix text with other block types still fit the same structure. Reaching for `content[0].text` is a line you'll write in nearly every product in this track.\n\n## What the raw response actually looks like\n\nUnderneath the SDK object, the API returns JSON shaped roughly like this:\n\n```python\n{\n    \"content\": [{\"type\": \"text\", \"text\": \"A golden retriever runs across a grassy park.\"}],\n    \"usage\": {\"input_tokens\": 1204, \"output_tokens\": 12},\n}\n```\n\nThe SDK parses this for you, but knowing the shape matters, because when things go wrong (a bad key, a malformed reply) you're debugging this exact structure.\n\n## Why this is the whole loop already\n\nNotice this is the same six-step loop from the setup module: input (an image), prompt (the instruction), call (the API), parse (content[0].text), verify (coming in lesson 6), ship (print it). Everything from here refines steps 2 through 5 for this specific product.\n\n## The mental model to keep\n\nA caption is just a text reply where the input happened to include a picture. Once you can extract `content[0].text` from a response, you can build the rest of this product by changing what you ask for, not how you ask for it.",
    starter_code: `import json

MOCK_API_RESPONSE = json.dumps({
    "content": [{"type": "text", "text": "A golden retriever runs across a grassy park."}],
    "usage": {"input_tokens": 1200, "output_tokens": 12},
})

def fake_call(messages):
    # Stands in for client.messages.create(...); returns a raw JSON string.
    return MOCK_API_RESPONSE

def extract_caption(raw_response):
    # TODO: json.loads(raw_response), then return content[0]["text"]
    pass

messages = [{"role": "user", "content": [
    {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "..."}},
    {"type": "text", "text": "Describe this image in one sentence."},
]}]

raw = fake_call(messages)
caption = extract_caption(raw)
print("Caption:", caption)
`,
    solution_code: `import json

MOCK_API_RESPONSE = json.dumps({
    "content": [{"type": "text", "text": "A golden retriever runs across a grassy park."}],
    "usage": {"input_tokens": 1200, "output_tokens": 12},
})

def fake_call(messages):
    return MOCK_API_RESPONSE

def extract_caption(raw_response):
    parsed = json.loads(raw_response)
    return parsed["content"][0]["text"]

messages = [{"role": "user", "content": [
    {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "..."}},
    {"type": "text", "text": "Describe this image in one sentence."},
]}]

raw = fake_call(messages)
caption = extract_caption(raw)
print("Caption:", caption)
`,
    hints: [
      "json.loads turns the raw string back into a dict.",
      "The text lives at parsed['content'][0]['text'], a list of one block.",
      "Keep the mock response shape in mind, it mirrors the real API exactly.",
    ],
    challenge_title: "Parse the Model's Reply",
    challenge_description:
      "Extract the caption text from a raw JSON API response, taking the first text-type content block.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

def main():
    raw = sys.stdin.read()
    obj = json.loads(raw)
    blocks = obj.get("content", [])
    # TODO: find the first block with type == "text" and print its "text" value
    # TODO: if no text block exists, print "NO_CAPTION"

main()
`,
    challenge_solution_code: `import sys, json

def main():
    raw = sys.stdin.read()
    obj = json.loads(raw)
    blocks = obj.get("content", [])
    text = None
    for b in blocks:
        if b.get("type") == "text":
            text = b.get("text")
            break
    print(text if text is not None else "NO_CAPTION")

main()
`,
    challenge_test_cases: [
      { input: '{"content": [{"type": "text", "text": "A dog running in a park."}]}', expected_output: "A dog running in a park.", description: "Single text block extracts directly." },
      { input: '{"content": [{"type":"text","text":"Caption one."},{"type":"text","text":"ignored"}]}', expected_output: "Caption one.", description: "Multiple text blocks: take the first one only." },
      { input: '{"content": []}', expected_output: "NO_CAPTION", description: "Edge: empty content list has no caption to extract." },
    ],
  },
  {
    id: "prod-12-3",
    project_id: "prod-12",
    order: 3,
    title: "Caption vs Alt Text: Two Different Jobs",
    concept: "task-specific prompting",
    explanation:
      "A caption and alt text describe the same picture, but they serve two different readers and two different jobs, so they need two different prompts, not one prompt reused twice.\n\n## Two jobs, one image\n\n- A **caption** is for a sighted reader scanning a page: vivid, a little editorial, meant to add context or personality (\"A golden retriever bounds through morning fog.\").\n- **Alt text** is for a screen reader user who cannot see the image at all: it has to functionally replace the picture, plain, complete, and short enough to be read aloud without wearing out its welcome (\"A dog running through a foggy field.\").\n\nSend the same \"describe this image\" prompt for both jobs and you get one mediocre result trying to do two things. The fix is two distinct instructions, chosen by mode.\n\n## Writing task-specific prompts\n\n```python\nCAPTION_PROMPT = (\n    \"Write one vivid, natural sentence captioning this image, \"\n    \"as if for a photo essay. No hashtags, no emoji.\"\n)\n\nALT_TEXT_PROMPT = (\n    \"Write concise alt text for this image for a screen reader. \"\n    \"Describe only what is visibly present. Do not start with \"\n    \"'image of' or 'picture of'. Keep it under 125 characters.\"\n)\n\ndef get_prompt(mode):\n    if mode == \"caption\":\n        return CAPTION_PROMPT\n    if mode == \"alt_text\":\n        return ALT_TEXT_PROMPT\n    raise ValueError(f\"unknown mode: {mode}\")\n```\n\n## Calling with the right prompt\n\n```python\ndef caption_image(client, image_content, mode):\n    prompt = get_prompt(mode)\n    response = client.messages.create(\n        model=\"claude-sonnet-4-6\",\n        max_tokens=150,\n        messages=[{\"role\": \"user\", \"content\": [image_content, {\"type\": \"text\", \"text\": prompt}]}],\n    )\n    return response.content[0].text\n```\n\n## Why \"do not start with 'image of'\" is in the prompt\n\nScreen reader software already announces \"image\" before reading alt text, so alt text that starts with \"image of\" doubles up and wastes the listener's time. This is a rule a sighted person would never think to ask for, it comes from knowing the audience, not the picture.\n\n## The mental model to keep\n\nThe picture doesn't change between the two calls, the **audience** does. Every time a product needs two different outputs from one input, look for the prompt to branch, not the pipeline. One `get_prompt(mode)` function is cheaper than two near-duplicate call functions.",
    starter_code: `CAPTION_PROMPT = "Write one vivid sentence caption for this image."
ALT_TEXT_PROMPT = "Write alt text under 125 characters for a screen reader."

def get_prompt(mode):
    # TODO: return CAPTION_PROMPT if mode == "caption"
    # TODO: return ALT_TEXT_PROMPT if mode == "alt_text"
    # TODO: raise ValueError(f"unknown mode: {mode}") otherwise
    pass

MOCK_REPLIES = {
    "caption": "A golden retriever bounds through a sunlit park.",
    "alt_text": "A dog running through a grassy park.",
}

def fake_call(mode):
    prompt = get_prompt(mode)
    return prompt, MOCK_REPLIES[mode]

for mode in ("caption", "alt_text"):
    prompt, reply = fake_call(mode)
    print(mode, "->", reply)
`,
    solution_code: `CAPTION_PROMPT = "Write one vivid sentence caption for this image."
ALT_TEXT_PROMPT = "Write alt text under 125 characters for a screen reader."

def get_prompt(mode):
    if mode == "caption":
        return CAPTION_PROMPT
    if mode == "alt_text":
        return ALT_TEXT_PROMPT
    raise ValueError(f"unknown mode: {mode}")

MOCK_REPLIES = {
    "caption": "A golden retriever bounds through a sunlit park.",
    "alt_text": "A dog running through a grassy park.",
}

def fake_call(mode):
    prompt = get_prompt(mode)
    return prompt, MOCK_REPLIES[mode]

for mode in ("caption", "alt_text"):
    prompt, reply = fake_call(mode)
    print(mode, "->", reply)
`,
    hints: [
      "get_prompt is just a branch on the mode string, then a fallback raise.",
      "Keep the two prompt strings as separate constants, don't merge them.",
      "raise ValueError(...) stops execution; it doesn't need a return after it.",
    ],
    challenge_title: "Choose the Right Prompt",
    challenge_description:
      "Given a mode and a subject, fill the correct prompt template, caption or alt text, or report an invalid mode.",
    challenge_language: "python",
    challenge_starter_code: `import sys

CAPTION_TEMPLATE = "Write one vivid sentence caption for: {subject}"
ALT_TEMPLATE = "Write alt text (max 125 chars, no 'image of') for: {subject}"

def main():
    data = sys.stdin.read().split("\\n")
    mode = data[0].strip()
    subject = data[1] if len(data) > 1 else ""
    # TODO: if mode == "caption", print CAPTION_TEMPLATE.format(subject=subject)
    # TODO: if mode == "alt_text", print ALT_TEMPLATE.format(subject=subject)
    # TODO: otherwise print "INVALID_MODE"

main()
`,
    challenge_solution_code: `import sys

CAPTION_TEMPLATE = "Write one vivid sentence caption for: {subject}"
ALT_TEMPLATE = "Write alt text (max 125 chars, no 'image of') for: {subject}"

def main():
    data = sys.stdin.read().split("\\n")
    mode = data[0].strip()
    subject = data[1] if len(data) > 1 else ""
    if mode == "caption":
        print(CAPTION_TEMPLATE.format(subject=subject))
    elif mode == "alt_text":
        print(ALT_TEMPLATE.format(subject=subject))
    else:
        print("INVALID_MODE")

main()
`,
    challenge_test_cases: [
      { input: "caption\na dog running in a park", expected_output: "Write one vivid sentence caption for: a dog running in a park", description: "Caption mode fills the caption template." },
      { input: "alt_text\na red bicycle", expected_output: "Write alt text (max 125 chars, no 'image of') for: a red bicycle", description: "Alt text mode fills the alt text template." },
      { input: "video\nfoo", expected_output: "INVALID_MODE", description: "Edge: an unsupported mode is rejected." },
    ],
  },
  {
    id: "prod-12-4",
    project_id: "prod-12",
    order: 4,
    title: "Alt Text Has Rules",
    concept: "accessibility validation",
    explanation:
      "A model asked for \"alt text under 125 characters\" will sometimes ignore you, screen reader software doesn't check the model's manners, so your product has to. This lesson builds the validator that catches bad alt text before it ships.\n\n## The three rules that matter most\n\n1. **Length.** Screen readers read alt text aloud in full; a widely used guideline caps useful alt text around 125 characters, past that it turns into a monologue.\n2. **No redundant phrasing.** Screen readers already announce \"image\" or \"graphic\" before the alt text plays, so text starting with \"image of\" or \"picture of\" makes the user hear it twice.\n3. **Not empty.** Empty alt text is only correct for a truly decorative image; for a content image it's a broken experience, the reader gets nothing.\n\n## Writing the validator\n\n```python\nMAX_ALT_LENGTH = 125\nREDUNDANT_PHRASES = (\"image of\", \"picture of\", \"photo of\")\n\ndef validate_alt_text(alt_text):\n    issues = []\n    if not alt_text.strip():\n        issues.append(\"empty\")\n        return issues\n    if len(alt_text) > MAX_ALT_LENGTH:\n        issues.append(\"too_long\")\n    lowered = alt_text.lower()\n    if any(p in lowered for p in REDUNDANT_PHRASES):\n        issues.append(\"redundant_phrase\")\n    return issues\n```\n\nAn empty check returns immediately, there's no point measuring length on nothing.\n\n## What you do with a failing validator\n\nA validator that only prints \"bad\" isn't useful in a product. The real move is to **retry with feedback**: call again and check the new attempt.\n\n```python\ndef get_valid_alt_text(client, image_content, retries=2):\n    for _ in range(retries + 1):\n        alt = caption_image(client, image_content, \"alt_text\")\n        if not validate_alt_text(alt):\n            return alt\n    return alt  # last attempt, even if imperfect\n```\n\n## Why validation lives outside the prompt\n\nYou could keep tightening the prompt forever and still get an occasional miss, models are probabilistic, not compilers. A prompt reduces how often the rule gets broken; a validator is what actually guarantees it never ships broken. Treat the prompt as a suggestion and the validator as the contract.\n\n## The mental model to keep\n\nAccessibility rules are numeric and checkable, so don't leave them to hope. Anything you can write as an `if` statement, length, banned phrases, emptiness, belongs in code, not just in the instructions you send the model.",
    starter_code: `MAX_ALT_LENGTH = 125
REDUNDANT_PHRASES = ("image of", "picture of", "photo of")

def validate_alt_text(alt_text):
    # TODO: if alt_text.strip() is empty, return ["empty"] right away
    # TODO: else build a list of issues: "too_long" if over MAX_ALT_LENGTH,
    #       "redundant_phrase" if it contains any REDUNDANT_PHRASES (case-insensitive)
    pass

candidates = [
    "A golden retriever leaps over a fallen log in autumn woods.",
    "",
    "Image of a cat sitting on a windowsill.",
]

for alt in candidates:
    print(repr(alt), "->", validate_alt_text(alt))
`,
    solution_code: `MAX_ALT_LENGTH = 125
REDUNDANT_PHRASES = ("image of", "picture of", "photo of")

def validate_alt_text(alt_text):
    if not alt_text.strip():
        return ["empty"]
    issues = []
    if len(alt_text) > MAX_ALT_LENGTH:
        issues.append("too_long")
    lowered = alt_text.lower()
    if any(p in lowered for p in REDUNDANT_PHRASES):
        issues.append("redundant_phrase")
    return issues

candidates = [
    "A golden retriever leaps over a fallen log in autumn woods.",
    "",
    "Image of a cat sitting on a windowsill.",
]

for alt in candidates:
    print(repr(alt), "->", validate_alt_text(alt))
`,
    hints: [
      "Check emptiness first and return immediately, don't fall through to the other checks.",
      "Use alt_text.lower() once and search it for each redundant phrase.",
      "any(p in lowered for p in REDUNDANT_PHRASES) is a one-line membership check.",
    ],
    challenge_title: "Validate the Alt Text",
    challenge_description:
      "Check a single alt-text string against the empty, length, and redundant-phrase rules, and print every violation found.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    alt = sys.stdin.readline().rstrip("\\n")
    # TODO: if alt is empty, print "EMPTY" and stop
    # TODO: else check len(alt) > 125 -> "TOO_LONG"
    # TODO: check "image of" or "picture of" in alt.lower() -> "REDUNDANT_PHRASE"
    # TODO: print each violation on its own line, in that order; if none, print "OK"

main()
`,
    challenge_solution_code: `import sys

def main():
    alt = sys.stdin.readline().rstrip("\\n")
    if alt == "":
        print("EMPTY")
        return
    violations = []
    if len(alt) > 125:
        violations.append("TOO_LONG")
    lowered = alt.lower()
    if "image of" in lowered or "picture of" in lowered:
        violations.append("REDUNDANT_PHRASE")
    if violations:
        for v in violations:
            print(v)
    else:
        print("OK")

main()
`,
    challenge_test_cases: [
      { input: "A golden retriever leaps over a fallen log in autumn woods.", expected_output: "OK", description: "Short, non-redundant alt text passes with no violations." },
      { input: "", expected_output: "EMPTY", description: "Edge: an empty alt text is reported alone." },
      { input: "Image of a cat sitting on a windowsill", expected_output: "REDUNDANT_PHRASE", description: "Starts with a redundant phrase but is short enough." },
      { input: "Picture of " + "x".repeat(120), expected_output: "TOO_LONG\nREDUNDANT_PHRASE", description: "Both too long and redundant: two violations printed in order." },
    ],
  },
  {
    id: "prod-12-5",
    project_id: "prod-12",
    order: 5,
    title: "Structuring the Output as JSON",
    concept: "parsing structured captions",
    explanation:
      "Two separate calls, one for a caption and one for alt text, is two round trips, twice the latency, twice the cost. This lesson merges them into one call that returns both fields as JSON, and builds the parser that survives the model's habit of wrapping JSON in extra text.\n\n## Asking for both fields at once\n\n```python\nCOMBINED_PROMPT = \"\"\"Look at this image and return ONLY a JSON object with two keys:\n- \"caption\": one vivid sentence for a photo caption\n- \"alt_text\": screen-reader alt text, under 125 characters, not starting with 'image of'\nReturn no other text.\"\"\"\n\nresponse = client.messages.create(\n    model=\"claude-sonnet-4-6\",\n    max_tokens=200,\n    messages=[{\"role\": \"user\", \"content\": [image_content, {\"type\": \"text\", \"text\": COMBINED_PROMPT}]}],\n)\nraw_text = response.content[0].text\n```\n\n## What actually comes back\n\nModels are inconsistent about \"return no other text.\" You'll see clean JSON:\n\n```python\n{\"caption\": \"A dog runs in a park.\", \"alt_text\": \"A brown dog running through green grass.\"}\n```\n\n...or JSON wrapped in a markdown fence, three backticks, the word json, a newline, then the object, then three backticks again. A `json.loads()` call on that wrapped text crashes immediately, the backticks aren't valid JSON.\n\n## The defensive parser\n\nInstead of trusting the wrapper, find the outermost braces and parse only what's between them.\n\n```python\nimport json\n\ndef parse_caption_response(raw_text):\n    start = raw_text.index(\"{\")\n    end = raw_text.rindex(\"}\") + 1\n    return json.loads(raw_text[start:end])\n\nresult = parse_caption_response(raw_text)\nprint(result[\"caption\"])\nprint(result[\"alt_text\"])\n```\n\n`index(\"{\")` finds the first opening brace no matter what came before it (a fence, a sentence of preamble); `rindex(\"}\")` finds the *last* closing brace, so nested structure inside the JSON doesn't confuse it.\n\n## Why one call beats two\n\nEvery request pays a fixed cost for the image tokens, sending the same picture twice to get a caption and then alt text separately doubles that fixed cost for no reason. Asking for both fields in one structured reply is strictly cheaper and faster, the only price is a slightly more careful parser.\n\n## The mental model to keep\n\nTreat the model's raw text as untrusted input, the same way you'd treat a user's typed text. You don't just `json.loads()` and hope, you extract the part that looks like your format first.",
    starter_code: `import json

def parse_caption_response(raw_text):
    # TODO: find the outermost { ... } in raw_text using index("{") and rindex("}")
    # TODO: json.loads that slice and return it
    pass

clean = '{"caption": "A dog runs in a park.", "alt_text": "A brown dog running through green grass."}'
fenced = "\`\`\`json\\n" + clean + "\\n\`\`\`"

for raw in (clean, fenced):
    result = parse_caption_response(raw)
    print(result["caption"], "|", result["alt_text"])
`,
    solution_code: `import json

def parse_caption_response(raw_text):
    start = raw_text.index("{")
    end = raw_text.rindex("}") + 1
    return json.loads(raw_text[start:end])

clean = '{"caption": "A dog runs in a park.", "alt_text": "A brown dog running through green grass."}'
fenced = "\`\`\`json\\n" + clean + "\\n\`\`\`"

for raw in (clean, fenced):
    result = parse_caption_response(raw)
    print(result["caption"], "|", result["alt_text"])
`,
    hints: [
      "raw_text.index('{') gives the position of the first opening brace, no matter what surrounds it.",
      "raw_text.rindex('}') finds the last closing brace, use +1 since slicing is exclusive.",
      "Slice raw_text[start:end] before calling json.loads on it.",
    ],
    challenge_title: "Extract Caption and Alt Text from JSON",
    challenge_description:
      "Pull caption and alt_text out of a raw model reply, even when it's wrapped in a markdown code fence, or report a parse error.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

def main():
    raw = sys.stdin.read()
    # TODO: find the outermost { ... } in raw and json.loads it
    # TODO: print obj["caption"] then obj["alt_text"]
    # TODO: on any failure (no braces, bad json, missing keys), print "PARSE_ERROR"

main()
`,
    challenge_solution_code: `import sys, json

def main():
    raw = sys.stdin.read()
    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        obj = json.loads(raw[start:end])
        print(obj["caption"])
        print(obj["alt_text"])
    except (ValueError, KeyError, json.JSONDecodeError):
        print("PARSE_ERROR")

main()
`,
    challenge_test_cases: [
      { input: '{"caption": "A dog runs in a park.", "alt_text": "A brown dog running through green grass."}', expected_output: "A dog runs in a park.\nA brown dog running through green grass.", description: "Clean JSON parses directly." },
      { input: '```json\n{"caption": "A cat sits.", "alt_text": "A gray cat sitting on a wooden windowsill."}\n```', expected_output: "A cat sits.\nA gray cat sitting on a wooden windowsill.", description: "JSON wrapped in a markdown fence still extracts correctly." },
      { input: "not json at all", expected_output: "PARSE_ERROR", description: "Edge: no braces present at all, reported as a parse error." },
    ],
  },
  {
    id: "prod-12-6",
    project_id: "prod-12",
    order: 6,
    title: "When the Upload or the Reply Breaks",
    concept: "error handling and retries",
    explanation:
      "L1-5 assumed a perfect world: valid images, well-formed JSON. Production images are messy, wrong formats, huge files, and models that occasionally reply with prose instead of JSON. This lesson adds the guardrails.\n\n## Guard the upload before you spend a token\n\nTwo checks that cost nothing but save a wasted (and billed) API call:\n\n```python\nALLOWED_TYPES = {\"image/png\", \"image/jpeg\", \"image/webp\", \"image/gif\"}\nMAX_IMAGE_BYTES = 5_000_000  # 5 MB\n\ndef validate_image(image_bytes, media_type):\n    if len(image_bytes) == 0:\n        raise ValueError(\"empty image\")\n    if media_type not in ALLOWED_TYPES:\n        raise ValueError(f\"unsupported type: {media_type}\")\n    if len(image_bytes) > MAX_IMAGE_BYTES:\n        raise ValueError(\"image too large, resize before sending\")\n```\n\nRun this **before** building the content block. An unsupported format or an oversized file will fail on the API side too, but failing locally is instant and free; failing remotely costs a network round trip and, if you're unlucky, a partial charge.\n\n## Guard the reply after you get it back\n\nThe JSON parser from the last lesson can still fail, a model occasionally ignores the format instruction entirely. Wrap it in a retry, the same pattern from the setup module, adapted for this product:\n\n```python\nimport time\n\ndef get_caption_json(client, image_content, retries=2):\n    for attempt in range(retries + 1):\n        response = client.messages.create(\n            model=\"claude-sonnet-4-6\",\n            max_tokens=200,\n            messages=[{\"role\": \"user\", \"content\": [image_content, {\"type\": \"text\", \"text\": COMBINED_PROMPT}]}],\n        )\n        try:\n            return parse_caption_response(response.content[0].text)\n        except (ValueError, KeyError):\n            if attempt == retries:\n                raise\n            time.sleep(1)\n```\n\n## Fallback, not just failure\n\nIf every retry fails, don't crash the whole tool, hand back something safe: a generic alt text beats no alt text, and a missing caption beats a broken app.\n\n```python\nFALLBACK = {\"caption\": \"An image.\", \"alt_text\": \"Image, description unavailable.\"}\n```\n\nReserve the fallback for true exhaustion of retries, using it too eagerly hides real bugs.\n\n## Why order matters: cheap checks first\n\nValidate the upload before spending a call, validate the reply after receiving one. Doing it in the other order, calling the API on a file you already knew was too big, wastes money on a failure you could have caught in a microsecond.\n\n## The mental model to keep\n\nEvery boundary where untrusted data enters your program (a user's uploaded file, a model's text reply) gets a check. Cheap, local checks go first; retries handle the boundary you can't fully control.",
    starter_code: `ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5_000_000

def validate_image(image_bytes, media_type):
    # TODO: raise ValueError("empty image") if len(image_bytes) == 0
    # TODO: raise ValueError(f"unsupported type: {media_type}") if media_type not allowed
    # TODO: raise ValueError("image too large") if over MAX_IMAGE_BYTES
    pass

def flaky_parse(attempt_counter):
    attempt_counter[0] += 1
    if attempt_counter[0] < 2:
        raise ValueError("malformed json")
    return {"caption": "A cat naps.", "alt_text": "A gray cat sleeping on a couch."}

def get_caption_with_retry(retries=2):
    counter = [0]
    for attempt in range(retries + 1):
        try:
            return flaky_parse(counter)
        except ValueError:
            if attempt == retries:
                raise
    return None

try:
    validate_image(b"", "image/png")
except ValueError as e:
    print("upload error:", e)

try:
    validate_image(b"123", "image/bmp")
except ValueError as e:
    print("upload error:", e)

validate_image(b"123", "image/png")
print("upload ok")

result = get_caption_with_retry()
print("caption after retry:", result["caption"])
`,
    solution_code: `ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5_000_000

def validate_image(image_bytes, media_type):
    if len(image_bytes) == 0:
        raise ValueError("empty image")
    if media_type not in ALLOWED_TYPES:
        raise ValueError(f"unsupported type: {media_type}")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise ValueError("image too large, resize before sending")

def flaky_parse(attempt_counter):
    attempt_counter[0] += 1
    if attempt_counter[0] < 2:
        raise ValueError("malformed json")
    return {"caption": "A cat naps.", "alt_text": "A gray cat sleeping on a couch."}

def get_caption_with_retry(retries=2):
    counter = [0]
    for attempt in range(retries + 1):
        try:
            return flaky_parse(counter)
        except ValueError:
            if attempt == retries:
                raise
    return None

try:
    validate_image(b"", "image/png")
except ValueError as e:
    print("upload error:", e)

try:
    validate_image(b"123", "image/bmp")
except ValueError as e:
    print("upload error:", e)

validate_image(b"123", "image/png")
print("upload ok")

result = get_caption_with_retry()
print("caption after retry:", result["caption"])
`,
    hints: [
      "Check emptiness first, then the allowed-type set, then the size limit, each with its own raise.",
      "media_type not in ALLOWED_TYPES is a set membership check, not a loop.",
      "The retry loop should only re-raise on the final attempt; earlier attempts just try again.",
    ],
    challenge_title: "Guard the Upload",
    challenge_description:
      "Validate an image upload against emptiness, allowed type, and size-limit rules, reporting the first failure found.",
    challenge_language: "python",
    challenge_starter_code: `import sys

ALLOWED = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_BYTES = 5_000_000

def main():
    data = sys.stdin.read().split("\\n")
    media_type = data[0].strip()
    size = int(data[1].strip())
    # TODO: if size <= 0, print "EMPTY_IMAGE"
    # TODO: elif media_type not in ALLOWED, print "UNSUPPORTED_TYPE"
    # TODO: elif size > MAX_BYTES, print "TOO_LARGE"
    # TODO: else print "OK"

main()
`,
    challenge_solution_code: `import sys

ALLOWED = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_BYTES = 5_000_000

def main():
    data = sys.stdin.read().split("\\n")
    media_type = data[0].strip()
    size = int(data[1].strip())
    if size <= 0:
        print("EMPTY_IMAGE")
    elif media_type not in ALLOWED:
        print("UNSUPPORTED_TYPE")
    elif size > MAX_BYTES:
        print("TOO_LARGE")
    else:
        print("OK")

main()
`,
    challenge_test_cases: [
      { input: "image/png\n1024", expected_output: "OK", description: "A small, allowed file type passes every check." },
      { input: "image/bmp\n1024", expected_output: "UNSUPPORTED_TYPE", description: "An unsupported media type is rejected before size is even considered." },
      { input: "image/png\n6000000", expected_output: "TOO_LARGE", description: "A file over the 5 MB limit is rejected." },
      { input: "image/png\n0", expected_output: "EMPTY_IMAGE", description: "Edge: a zero-byte file is rejected first, before the type check." },
    ],
  },
  {
    id: "prod-12-7",
    project_id: "prod-12",
    order: 7,
    title: "Vision Calls Cost More Than Text",
    concept: "image token cost and resizing",
    explanation:
      "An image isn't a fixed price, a phone photo and a thumbnail cost wildly different amounts on the same model call, because vision models charge by pixels, not by file size. This lesson builds the estimator that tells you the bill before you send anything.\n\n## How image tokens are counted\n\nText tokens come from characters; image tokens come from resolution. A widely used approximation is:\n\n```python\ndef estimate_image_tokens(width, height):\n    return (width * height) // 750\n```\n\nA 1000x750 photo costs roughly `750,000 // 750 = 1000` tokens, before you've written a single word of prompt. A 4000x3000 photo from a modern phone costs sixteen times that, about 16,000 tokens, for the exact same picture, just a bigger file.\n\n## Why this matters for a captioning tool\n\nYour product runs on every image a user uploads, and phone cameras default to enormous resolutions the model doesn't need to produce a one-sentence caption. Sending a photo at full resolution to ask \"describe this in one sentence\" is like mailing someone a moving truck to deliver a postcard.\n\n## Deciding when to downscale\n\n```python\nMAX_IMAGE_TOKENS = 1600  # a practical ceiling for this product\n\ndef recommend_resize(width, height):\n    tokens = estimate_image_tokens(width, height)\n    if tokens <= MAX_IMAGE_TOKENS:\n        return None\n    scale = (MAX_IMAGE_TOKENS / tokens) ** 0.5\n    return (int(width * scale), int(height * scale))\n```\n\nScaling both dimensions by the **square root** of the token ratio is the key idea: tokens grow with *area* (width times height), so to cut tokens in half you shrink each side by roughly 71%, not 50%.\n\n## Estimating the full call cost\n\n```python\ndef estimate_total_tokens(width, height, prompt_tokens, reply_tokens=150):\n    return estimate_image_tokens(width, height) + prompt_tokens + reply_tokens\n```\n\nThe image, your instruction, and the model's reply all draw from the same billed total, none of them are free just because they're short.\n\n## The mental model to keep\n\nTreat resolution the way you'd treat a long paragraph you're about to paste into a prompt: bigger isn't more accurate for this job, it's just more expensive. A one-sentence caption task rarely needs more detail than a modestly sized image already provides.",
    starter_code: `MAX_IMAGE_TOKENS = 1600

def estimate_image_tokens(width, height):
    # TODO: return (width * height) // 750
    pass

def recommend_resize(width, height):
    # TODO: if estimate_image_tokens(width, height) <= MAX_IMAGE_TOKENS, return None
    # TODO: otherwise compute scale = (MAX_IMAGE_TOKENS / tokens) ** 0.5
    #       and return (int(width * scale), int(height * scale))
    pass

def estimate_total_tokens(width, height, prompt_tokens, reply_tokens=150):
    # TODO: return estimate_image_tokens(width, height) + prompt_tokens + reply_tokens
    pass

print("tokens for 800x600:", estimate_image_tokens(800, 600))
print("resize for 4000x3000:", recommend_resize(4000, 3000))
print("resize for 800x600:", recommend_resize(800, 600))
print("total for a call:", estimate_total_tokens(800, 600, 40))
`,
    solution_code: `MAX_IMAGE_TOKENS = 1600

def estimate_image_tokens(width, height):
    return (width * height) // 750

def recommend_resize(width, height):
    tokens = estimate_image_tokens(width, height)
    if tokens <= MAX_IMAGE_TOKENS:
        return None
    scale = (MAX_IMAGE_TOKENS / tokens) ** 0.5
    return (int(width * scale), int(height * scale))

def estimate_total_tokens(width, height, prompt_tokens, reply_tokens=150):
    return estimate_image_tokens(width, height) + prompt_tokens + reply_tokens

print("tokens for 800x600:", estimate_image_tokens(800, 600))
print("resize for 4000x3000:", recommend_resize(4000, 3000))
print("resize for 800x600:", recommend_resize(800, 600))
print("total for a call:", estimate_total_tokens(800, 600, 40))
`,
    hints: [
      "Image tokens scale with area: (width * height) // 750.",
      "The resize scale factor is a square root because area, not a single side, drives the token count.",
      "recommend_resize should return None when the image is already under budget.",
    ],
    challenge_title: "Estimate the Vision Call Cost",
    challenge_description:
      "Compute image tokens from resolution, add prompt and reply tokens, and flag when a resize is recommended.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    width, height, prompt_tokens, reply_tokens = map(int, sys.stdin.read().split())
    # TODO: image_tokens = (width * height) // 750
    # TODO: total = image_tokens + prompt_tokens + reply_tokens
    # TODO: print "RESIZE_RECOMMENDED" if image_tokens > 1600 else "OK"
    # TODO: print total on the next line

main()
`,
    challenge_solution_code: `import sys

def main():
    width, height, prompt_tokens, reply_tokens = map(int, sys.stdin.read().split())
    image_tokens = (width * height) // 750
    total = image_tokens + prompt_tokens + reply_tokens
    if image_tokens > 1600:
        print("RESIZE_RECOMMENDED")
    else:
        print("OK")
    print(total)

main()
`,
    challenge_test_cases: [
      { input: "800 600 50 100", expected_output: "OK\n790", description: "A modest 800x600 image stays under the resize threshold." },
      { input: "2000 1500 50 100", expected_output: "RESIZE_RECOMMENDED\n4150", description: "A large image exceeds 1600 image tokens and triggers a resize flag." },
      { input: "1200 1000 0 0", expected_output: "OK\n1600", description: "Edge: exactly at the 1600-token threshold does not trigger a resize." },
    ],
  },
  {
    id: "prod-12-8",
    project_id: "prod-12",
    order: 8,
    title: "Ship the Captioner",
    concept: "packaging and shipping",
    explanation:
      "Everything so far is a function, encode, prompt, call, parse, validate, estimate. Shipping means wiring those functions into one pipeline that takes a raw image and hands back a finished, accessible result, and knowing what \"done\" looks like for this specific tool.\n\n## The full pipeline, end to end\n\n```python\ndef process_image(image_bytes, media_type, client):\n    validate_image(image_bytes, media_type)\n\n    if len(image_bytes) > 2_000_000:\n        print(\"warning: large image, consider resizing for cost\")\n\n    image_content = build_image_content(image_bytes, media_type)\n    result = get_caption_json(client, image_content)\n\n    alt_issues = validate_alt_text(result[\"alt_text\"])\n    if alt_issues:\n        result = get_caption_json(client, image_content)  # one retry with the same prompt\n\n    return result\n```\n\nSix lessons of separate pieces, encoding, prompting, parsing, validating, hardening, cost, collapse into a handful of calls to functions you already wrote. That's what a finished product usually looks like: not new code, but old code assembled in the right order.\n\n## What \"done\" means for this tool\n\n1. It runs on a real image file end to end and returns both a caption and alt text.\n2. A bad upload (wrong type, empty file) fails fast with a clear message, not a stack trace from deep inside the API call.\n3. A malformed model reply gets one retry before falling back, it never just crashes the whole tool.\n4. Someone else could point it at their own photo and get a usable result without reading your source code.\n\nIf those four hold, this is a real deliverable, not a demo script.\n\n## A minimal CLI wrapper\n\n```python\nimport sys\n\nif __name__ == \"__main__\":\n    path = sys.argv[1]\n    with open(path, \"rb\") as f:\n        image_bytes = f.read()\n    media_type = \"image/jpeg\" if path.lower().endswith((\".jpg\", \".jpeg\")) else \"image/png\"\n    result = process_image(image_bytes, media_type, client)\n    print(\"Caption:\", result[\"caption\"])\n    print(\"Alt text:\", result[\"alt_text\"])\n```\n\n## It lands in your Portfolio\n\nFinishing this lesson completes the project, and like every build in this track, it gets saved to your **Portfolio** automatically: a working Caption & Alt-Text Generator, alongside whatever else you've shipped. Keep a sample image and its output handy, that pair is your proof it works.\n\n## The mental model to keep\n\nA finished AI product is rarely one clever trick. It's the same six-step loop from the setup module, each step built carefully and separately, wired together in order. You already did the hard part, one lesson at a time.",
    starter_code: `def validate_image(image_bytes, media_type):
    if len(image_bytes) == 0:
        raise ValueError("empty image")
    if media_type not in {"image/png", "image/jpeg", "image/webp", "image/gif"}:
        raise ValueError(f"unsupported type: {media_type}")

def mock_model_call(image_bytes):
    return {"caption": "A dog runs through a sunny park.", "alt_text": "A brown dog running through green grass."}

def validate_alt_text(alt_text):
    if not alt_text.strip():
        return ["empty"]
    issues = []
    if len(alt_text) > 125:
        issues.append("too_long")
    if "image of" in alt_text.lower() or "picture of" in alt_text.lower():
        issues.append("redundant_phrase")
    return issues

def process_image(image_bytes, media_type):
    # TODO: call validate_image(image_bytes, media_type) first
    # TODO: call mock_model_call(image_bytes) to get the result dict
    # TODO: run validate_alt_text on result["alt_text"]; if issues exist, call mock_model_call again
    # TODO: return the final result dict
    pass

result = process_image(b"fake image bytes", "image/jpeg")
print("Caption:", result["caption"])
print("Alt text:", result["alt_text"])
`,
    solution_code: `def validate_image(image_bytes, media_type):
    if len(image_bytes) == 0:
        raise ValueError("empty image")
    if media_type not in {"image/png", "image/jpeg", "image/webp", "image/gif"}:
        raise ValueError(f"unsupported type: {media_type}")

def mock_model_call(image_bytes):
    return {"caption": "A dog runs through a sunny park.", "alt_text": "A brown dog running through green grass."}

def validate_alt_text(alt_text):
    if not alt_text.strip():
        return ["empty"]
    issues = []
    if len(alt_text) > 125:
        issues.append("too_long")
    if "image of" in alt_text.lower() or "picture of" in alt_text.lower():
        issues.append("redundant_phrase")
    return issues

def process_image(image_bytes, media_type):
    validate_image(image_bytes, media_type)
    result = mock_model_call(image_bytes)
    if validate_alt_text(result["alt_text"]):
        result = mock_model_call(image_bytes)
    return result

result = process_image(b"fake image bytes", "image/jpeg")
print("Caption:", result["caption"])
print("Alt text:", result["alt_text"])
`,
    hints: [
      "process_image is just the earlier functions called in order: validate, call, validate again, maybe retry.",
      "Only re-call the model if validate_alt_text returns a non-empty list of issues.",
      "Return the result dict at the end regardless of which attempt produced it.",
    ],
    challenge_title: "Ship the Captioner Report",
    challenge_description:
      "Run both the caption and alt-text validators on a finished pair of outputs and print a final readiness report.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def validate_caption(caption):
    # TODO: return ["INVALID"] if caption is empty or longer than 300 chars, else []
    pass

def validate_alt(alt):
    # TODO: return ["EMPTY"] if alt is empty
    # TODO: else return a list including "TOO_LONG" if over 125 chars,
    #       and "REDUNDANT_PHRASE" if it contains "image of" or "picture of" (case-insensitive)
    pass

def main():
    lines = sys.stdin.read().split("\\n")
    caption = lines[0] if len(lines) > 0 else ""
    alt = lines[1] if len(lines) > 1 else ""

    cap_issues = validate_caption(caption)
    alt_issues = validate_alt(alt)

    # TODO: print "caption:OK" or "caption:" + comma-joined cap_issues
    # TODO: print "alt_text:OK" or "alt_text:" + comma-joined alt_issues
    # TODO: print "READY" if both lists are empty, else "NOT_READY"

main()
`,
    challenge_solution_code: `import sys

def validate_caption(caption):
    if not caption or len(caption) > 300:
        return ["INVALID"]
    return []

def validate_alt(alt):
    if not alt:
        return ["EMPTY"]
    issues = []
    if len(alt) > 125:
        issues.append("TOO_LONG")
    if "image of" in alt.lower() or "picture of" in alt.lower():
        issues.append("REDUNDANT_PHRASE")
    return issues

def main():
    lines = sys.stdin.read().split("\\n")
    caption = lines[0] if len(lines) > 0 else ""
    alt = lines[1] if len(lines) > 1 else ""

    cap_issues = validate_caption(caption)
    alt_issues = validate_alt(alt)

    print("caption:" + ("OK" if not cap_issues else ",".join(cap_issues)))
    print("alt_text:" + ("OK" if not alt_issues else ",".join(alt_issues)))
    print("READY" if not cap_issues and not alt_issues else "NOT_READY")

main()
`,
    challenge_test_cases: [
      { input: "A dog runs through a sunny park.\nA brown dog running through green grass in a park.", expected_output: "caption:OK\nalt_text:OK\nREADY", description: "Both caption and alt text pass; the tool is ready to ship." },
      { input: "\nA cat.", expected_output: "caption:INVALID\nalt_text:OK\nNOT_READY", description: "Edge: an empty caption fails validation even though alt text is fine." },
      { input: "ok caption here\n", expected_output: "caption:OK\nalt_text:EMPTY\nNOT_READY", description: "Edge: a valid caption paired with empty alt text is not ready to ship." },
    ],
  },
];

export default { project, lessons };
