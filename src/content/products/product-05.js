const project = {
  id: "prod-05",
  title: "Tone Rewriter",
  description:
    "Build a tool that takes a block of text and rewrites it in a tone you pick, formal, casual, or friendly, without changing what it says. Along the way you'll write a system-prompt template, build reusable tone presets, and work out how to hold the meaning steady while the style shifts.",
  difficulty: "beginner",
  category: "prompting",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["tone-rewriter", "system-prompt", "templating", "presets", "style-transfer", "prompting"],
  order: 105,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-05-1",
    project_id: "prod-05",
    order: 1,
    title: "Rewriting Is a Prompt with a Dial",
    concept: "the rewrite loop",
    explanation: `A tone rewriter takes one piece of text and hands it back saying the same thing in a different voice. "hey can u send that over?" becomes "Could you please send that over when you have a moment?" Same request, different tone. By the end of this project you'll have a tool that does this for any text and any tone you choose.

## The one job, stated precisely

Every rewrite has two halves, and they must never blur together. First, keep the meaning: facts, names, numbers, and intent stay identical. Second, change the style: word choice, formality, warmth, and sentence length are all fair game.

That split is the whole product. A rewriter that changes the meaning is broken. A rewriter that changes nothing is useless. You're building a dial that only moves the *style* axis.

## The same loop as every AI product

Rewriting follows the usual loop. Take input (the text plus a chosen tone), build a prompt, call the model, read the reply, ship it. The one part that's specific to this product is the prompt, where you tell the model exactly what to keep and what to change.

The instructions live in a **system prompt** (the standing rules). The text to rewrite rides in a **user** message:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = "You rewrite text in a formal tone. Keep the meaning exactly. Change only the style."

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=400,
    system=SYSTEM,
    messages=[{"role": "user", "content": "hey can u send that over?"}],
)
print(resp.content[0].text)
\`\`\`

Notice the shape. The *tone* and the *rules* go in \`system\`; the *text to rewrite* is the user turn. Later lessons make that system string swappable so one tool handles every tone.

## Why separate the two channels

They change at different rates. The rules ("keep the meaning, change the style") are constant across every rewrite. The tone changes per request. The text changes on every single call. Put the standing rules in \`system\` and the raw text in \`messages\`, and you write the rules once while swapping only what varies.

## What we'll build first

No network yet. First you'll assemble the exact request by hand, a system string plus a user message, so you can see the data shape the API expects. Once the shape is right, the real call is a one-liner.

## The mental model to keep

A tone rewriter is a volume knob for *style* wired to a lock on *meaning*. You turn the style knob (formal, casual, friendly) while the meaning stays bolted down. The rest of this project is building that knob and making sure the lock holds.`,
    starter_code: `# Assemble a rewrite request by hand (no API yet).
# A request is a system string (the rules + tone) plus a user message (the text).

def build_request(tone, text):
    # TODO: return a dict with two keys:
    #   "system": rules that keep meaning and set the tone
    #   "messages": a list with one user turn holding the text
    pass

req = build_request("formal", "hey can u send that over?")
print(req["system"])
print("messages:", len(req["messages"]))
`,
    solution_code: `# Assemble a rewrite request by hand (no API yet).
# A request is a system string (the rules + tone) plus a user message (the text).

def build_request(tone, text):
    system = (
        f"You rewrite text in a {tone} tone. "
        "Keep the meaning exactly. Change only the style."
    )
    return {
        "system": system,
        "messages": [{"role": "user", "content": text}],
    }

req = build_request("formal", "hey can u send that over?")

print(req["system"])
print("messages:", len(req["messages"]))
print("user:", req["messages"][0]["content"])
`,
    hints: [
      "The system string should mention the tone and the two rules: keep meaning, change style.",
      "Use an f-string so the tone drops into the system text.",
      "messages is a list with one dict: {\"role\": \"user\", \"content\": text}.",
    ],
    challenge_title: "Assemble the Rewrite Request",
    challenge_description:
      "Given a chosen tone and a line of text, print the two-part request payload (system rules + user text) that a tone rewriter would send.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    tone = data[0].strip()
    text = data[1] if len(data) > 1 else ""
    # TODO: print two lines:
    #   system|You are a rewriter. Rewrite the user's text in a <tone> tone. Keep the meaning.
    #   user|<text>

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    tone = data[0].strip()
    text = data[1] if len(data) > 1 else ""
    print(f"system|You are a rewriter. Rewrite the user's text in a {tone} tone. Keep the meaning.")
    print(f"user|{text}")

main()
`,
    challenge_test_cases: [
      {
        input: "formal\nhey whats up",
        expected_output:
          "system|You are a rewriter. Rewrite the user's text in a formal tone. Keep the meaning.\nuser|hey whats up",
        description: "Formal tone drops into the system line; the text is echoed as the user turn.",
      },
      {
        input: "casual\nWe regret to inform you of the delay.",
        expected_output:
          "system|You are a rewriter. Rewrite the user's text in a casual tone. Keep the meaning.\nuser|We regret to inform you of the delay.",
        description: "The tone changes the system line but the text passes through unchanged.",
      },
    ],
  },

  {
    id: "prod-05-2",
    project_id: "prod-05",
    order: 2,
    title: "The Smallest Rewrite That Works",
    concept: "one hardcoded tone",
    explanation: `Now the smallest end-to-end thing: one tone, hardcoded, that returns rewritten text. Get one path working before you make it flexible.

## Call, then read the reply

You've built the request. Sending it returns a response object, and the rewritten text sits one level down inside it. With the Anthropic SDK the text lives at \`resp.content[0].text\`:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def rewrite_formal(text):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        system="You rewrite text in a formal tone. Keep the meaning exactly.",
        messages=[{"role": "user", "content": text}],
    )
    return resp.content[0].text.strip()

print(rewrite_formal("hey can u send that over?"))
# -> "Could you please send that over?"
\`\`\`

The \`.strip()\` matters more than it looks. Models often pad replies with a leading space or a trailing newline. If you're going to display or store the result, trim it now so those stray characters don't pile up.

## The reply is not always clean

One reality shapes the rest of this project: the model doesn't always return *only* the rewrite. Sometimes it wraps the text in a preamble like "Here is the rewritten text:" or drops quotes around it. Your parsing step has to reach past that and grab the actual rewrite. A hardcoded first version can trust a clean reply, and you'll harden this properly in lesson 7.

## Why start this small

One tone, one function, one clean return. That's a checkpoint you can run and believe. Every later feature (more tones, presets, validation) hangs off this working core. If you can't rewrite into one tone reliably, adding five tones just multiplies the bug. Prove the smallest slice first.

## What you'll drill

The exercise below simulates a model reply, a plain dict like the SDK gives you, and makes you pull the rewritten text out and clean it. That extract-and-strip step is the exact code you'd run on a real response, minus the network.

## The mental model to keep

The model hands you a *box*, not a *string*. The rewrite is inside the box, sometimes with packing peanuts around it. Your job on every call is the same: open the box, take the rewrite, brush off the peanuts.`,
    starter_code: `# Simulate a model reply and pull the rewritten text out of it.
# The SDK returns an object; here we mimic it with a plain dict.

fake_response = {
    "content": [{"type": "text", "text": "  Could you please send that over?\\n"}]
}

def extract_rewrite(response):
    # TODO: reach into response["content"][0]["text"] and strip whitespace
    pass

print(extract_rewrite(fake_response))
`,
    solution_code: `# Simulate a model reply and pull the rewritten text out of it.
# The SDK returns an object; here we mimic it with a plain dict.

fake_response = {
    "content": [{"type": "text", "text": "  Could you please send that over?\\n"}]
}

def extract_rewrite(response):
    text = response["content"][0]["text"]
    return text.strip()

result = extract_rewrite(fake_response)
print(repr(result))
print(result)
`,
    hints: [
      "The rewrite lives at response[\"content\"][0][\"text\"].",
      "Call .strip() to remove the leading spaces and trailing newline.",
      "repr() shows you the exact characters so you can confirm the whitespace is gone.",
    ],
    challenge_title: "Unwrap the Model's Reply",
    challenge_description:
      "A model reply may start with a 'Rewritten:' label. Strip the label if present and return the clean rewritten text.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    reply = sys.stdin.read().strip()
    # TODO: if reply starts with "Rewritten:", drop that prefix.
    #       print the remaining text, stripped of surrounding spaces.

main()
`,
    challenge_solution_code: `import sys

def main():
    reply = sys.stdin.read().strip()
    prefix = "Rewritten:"
    if reply.startswith(prefix):
        reply = reply[len(prefix):].strip()
    print(reply)

main()
`,
    challenge_test_cases: [
      {
        input: "Rewritten: Good day to you.",
        expected_output: "Good day to you.",
        description: "The 'Rewritten:' label is stripped, leaving the clean text.",
      },
      {
        input: "Hey there, what's up!",
        expected_output: "Hey there, what's up!",
        description: "No label present, so the reply passes through unchanged.",
      },
      {
        input: "Rewritten:    lots of space    ",
        expected_output: "lots of space",
        description: "Extra whitespace after the label and around the text is trimmed.",
      },
    ],
  },

  {
    id: "prod-05-3",
    project_id: "prod-05",
    order: 3,
    title: "One Template, Any Tone",
    concept: "system-prompt templating",
    illustrative: false,
    explanation: `A hardcoded "formal" rewriter is one tone stuck in code. To support formal, casual, friendly, and whatever comes next, you don't write a new function per tone. You write **one template** with a hole where the tone goes.

## The template idea

A system-prompt template is a string with a placeholder you fill at call time. In Python the cleanest tool for that is \`str.format\` with a named field:

\`\`\`python
SYSTEM_TEMPLATE = (
    "You are a skilled editor. Rewrite the user's text in a {tone} tone.\\n"
    "Keep the meaning exactly the same: do not add, remove, or invent facts.\\n"
    "Change only the style, word choice, and phrasing.\\n"
    "Return only the rewritten text, with no preamble or quotes."
)

def build_system(tone):
    return SYSTEM_TEMPLATE.format(tone=tone)

print(build_system("friendly"))
\`\`\`

Call \`build_system("formal")\`, then \`build_system("casual")\`, then \`build_system("friendly")\`, and you get three tailored system prompts from one source of truth. Change the rules once and every tone picks up the change.

## Wiring it into the call

The template feeds straight into the API call. The user message never changes shape; only the system string swaps:

\`\`\`python
def rewrite(text, tone):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        system=build_system(tone),
        messages=[{"role": "user", "content": text}],
    )
    return resp.content[0].text.strip()
\`\`\`

One function, any tone. That's the payoff of templating: the tone becomes a *parameter* instead of a copy-pasted function.

## Why not f-strings everywhere?

You could use an f-string inline. Pulling the template out as a named constant with \`{tone}\` gives you one place to edit the rules, keeps the wording consistent across tones, and lets you test the template on its own (which you'll do below). A prompt reused a thousand times deserves to live in one spot.

## Watch the placeholder trap

\`str.format\` treats every \`{...}\` as a field to fill. If your prompt genuinely contains braces, say you're asking for JSON output, \`format\` will try to fill those too and crash. Tone prompts rarely hit this, but keep it in mind: with \`.format\`, literal braces must be doubled (\`{{\` and \`}}\`).

## The mental model to keep

The template is a rubber stamp with one blank line. You ink in the tone and stamp. The rest of the message, the rules and the format demand, comes out identical every time. One stamp, many tones.`,
    starter_code: `# Fill a system-prompt template with a chosen tone.

SYSTEM_TEMPLATE = (
    "Rewrite the user's text in a {tone} tone. "
    "Keep the meaning; change only the style."
)

def build_system(tone):
    # TODO: return SYSTEM_TEMPLATE with {tone} filled in
    pass

for t in ["formal", "casual", "friendly"]:
    print(build_system(t))
`,
    solution_code: `# Fill a system-prompt template with a chosen tone.

SYSTEM_TEMPLATE = (
    "Rewrite the user's text in a {tone} tone. "
    "Keep the meaning; change only the style."
)

def build_system(tone):
    return SYSTEM_TEMPLATE.format(tone=tone)

for t in ["formal", "casual", "friendly"]:
    print(build_system(t))
`,
    hints: [
      "Use SYSTEM_TEMPLATE.format(tone=tone) to fill the {tone} placeholder.",
      "The field name in the braces must match the keyword you pass to .format().",
      "One template plus a loop gives you every tone's system prompt.",
    ],
    challenge_title: "Fill the Prompt Template",
    challenge_description:
      "Given a tone and an audience, fill a two-placeholder template and print the finished instruction.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    tone = data[0].strip()
    audience = data[1].strip() if len(data) > 1 else ""
    template = "Rewrite in a {tone} tone for a {audience} audience."
    # TODO: fill both placeholders and print the result

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    tone = data[0].strip()
    audience = data[1].strip() if len(data) > 1 else ""
    template = "Rewrite in a {tone} tone for a {audience} audience."
    print(template.format(tone=tone, audience=audience))

main()
`,
    challenge_test_cases: [
      {
        input: "friendly\ncustomer",
        expected_output: "Rewrite in a friendly tone for a customer audience.",
        description: "Both placeholders fill from the two input lines.",
      },
      {
        input: "formal\nexecutive",
        expected_output: "Rewrite in a formal tone for a executive audience.",
        description: "A different tone and audience produce a new instruction from the same template.",
      },
    ],
  },

  {
    id: "prod-05-4",
    project_id: "prod-05",
    order: 4,
    title: "A Menu of Tones: Presets",
    concept: "tone presets",
    explanation: `"Formal" is a vague word. To one model it means stiff legalese; to another, a polite email. If you want consistent results, don't hand the model a bare adjective. Hand it a **preset**: a named tone with a concrete description of what it means.

## What a preset is

A preset pairs a short name with a precise instruction. Store them in a dict where the name is the key and the guidance is the value:

\`\`\`python
TONE_PRESETS = {
    "formal": "Use professional, polished language. Full sentences, no slang, no contractions.",
    "casual": "Keep it relaxed and conversational. Contractions and everyday words are welcome.",
    "friendly": "Be warm and encouraging. Sound like a helpful person who's glad to help.",
}
\`\`\`

Now "formal" isn't a guess; it's a definition. The preset text drops into your template so the system prompt carries the full description rather than just the label:

\`\`\`python
SYSTEM_TEMPLATE = (
    "Rewrite the user's text. Target tone: {tone}.\\n"
    "Tone guidance: {guidance}\\n"
    "Keep the meaning exactly. Return only the rewritten text."
)

def build_system(tone):
    guidance = TONE_PRESETS[tone]
    return SYSTEM_TEMPLATE.format(tone=tone, guidance=guidance)
\`\`\`

## Why presets beat free-text tones

The same preset produces the same style every time, because the model reads the same detailed guidance instead of a lone word it's free to interpret. You also get a menu for free: \`list(TONE_PRESETS)\` is the set of tones a UI can show without hardcoding them anywhere else. And adding "playful" or "urgent" is one new dict entry, no code change, just data.

## Looking one up safely

Reaching for \`TONE_PRESETS[tone]\` crashes if the tone isn't there. Use \`.get\` with a fallback, or check membership first, so an unknown tone degrades gracefully instead of throwing. You'll build that fallback properly in lesson 6. For now, know that the lookup is the one spot where a bad tone name bites.

## The mental model to keep

Presets turn a fuzzy adjective into a recipe. "Formal" is an opinion; a preset is a set of instructions. You're moving the definition of each tone out of the model's imagination and into your own dict, where you control it exactly.`,
    starter_code: `# Look up a tone preset and build the system prompt from it.

TONE_PRESETS = {
    "formal": "Use professional, polished language.",
    "casual": "Keep it relaxed and conversational.",
    "friendly": "Be warm and encouraging.",
}

def build_system(tone):
    # TODO: get the guidance for this tone from TONE_PRESETS
    #       and return: "Tone: <tone>. Guidance: <guidance>"
    pass

print(build_system("casual"))
print("Available:", ", ".join(TONE_PRESETS))
`,
    solution_code: `# Look up a tone preset and build the system prompt from it.

TONE_PRESETS = {
    "formal": "Use professional, polished language.",
    "casual": "Keep it relaxed and conversational.",
    "friendly": "Be warm and encouraging.",
}

def build_system(tone):
    guidance = TONE_PRESETS[tone]
    return f"Tone: {tone}. Guidance: {guidance}"

print(build_system("casual"))
print("Available:", ", ".join(TONE_PRESETS))
`,
    hints: [
      "TONE_PRESETS[tone] gives you the guidance string for that tone.",
      "Build the return with an f-string that includes both the tone name and the guidance.",
      "list(TONE_PRESETS) or ', '.join(TONE_PRESETS) gives you the menu of tone names.",
    ],
    challenge_title: "Look Up the Tone",
    challenge_description:
      "Read a set of tone presets and a query tone; print that tone's guidance, or 'UNKNOWN TONE' if it isn't in the menu.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    presets = {}
    for i in range(1, n + 1):
        name, guidance = data[i].split(":", 1)
        presets[name.strip()] = guidance.strip()
    query = data[n + 1].strip()
    # TODO: print the guidance for 'query', or "UNKNOWN TONE" if it's missing

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    presets = {}
    for i in range(1, n + 1):
        name, guidance = data[i].split(":", 1)
        presets[name.strip()] = guidance.strip()
    query = data[n + 1].strip()
    print(presets.get(query, "UNKNOWN TONE"))

main()
`,
    challenge_test_cases: [
      {
        input: "3\nformal: Use professional language.\ncasual: Keep it relaxed.\nfriendly: Be warm and kind.\ncasual",
        expected_output: "Keep it relaxed.",
        description: "A known tone returns its guidance from the preset menu.",
      },
      {
        input: "2\nformal: Be polished.\nfriendly: Be warm.\nangry",
        expected_output: "UNKNOWN TONE",
        description: "A tone not in the menu returns the fallback string.",
      },
    ],
  },

  {
    id: "prod-05-5",
    project_id: "prod-05",
    order: 5,
    title: "Change the Style, Keep the Meaning",
    concept: "preserving meaning",
    explanation: `This is the lesson that makes a tone rewriter trustworthy. Making text *sound* different is easy. The hard part is making sure it still *says* the same thing. A rewriter that turns "Ship 3 boxes by Friday" into "Please send some boxes soon" has failed: it changed the meaning while chasing a friendlier tone.

## Two levers pull against each other

The tone lever wants to change words. The meaning lock wants to keep facts. When you push tone too hard, the model starts paraphrasing away specifics: numbers go vague, names get dropped, a firm deadline becomes "soon." Your prompt has to hold the meaning lock firmly while the tone lever moves.

## Pin the facts in the prompt

The fix is to spell out what "keep the meaning" concretely forbids. Vague rules get vague obedience:

\`\`\`python
SYSTEM = (
    "Rewrite the text in a {tone} tone.\\n"
    "Preserve every fact exactly:\\n"
    "- Keep all names, numbers, dates, and quantities unchanged.\\n"
    "- Do not add information that isn't in the original.\\n"
    "- Do not drop any information from the original.\\n"
    "- If unsure, keep the original wording for that detail.\\n"
    "Change only tone, phrasing, and word choice."
).format(tone=tone)
\`\`\`

Spelling out "keep all names, numbers, dates" gives the model a checklist instead of a vibe. Specific constraints are the cheapest reliability you can buy.

## Verify, don't just hope

Even a good prompt slips now and then, so a real rewriter *checks* its output. The cheapest useful check is the easy-to-extract facts: numbers, dates, and dollar amounts should all survive the rewrite. If the original mentions "3 boxes" and "5pm" but the rewrite dropped the 5, something went wrong, and you can flag it or retry.

\`\`\`python
import re

def numbers_in(text):
    return set(re.findall(r"\\d+", text))

def meaning_preserved(original, rewrite):
    return numbers_in(original).issubset(numbers_in(rewrite))
\`\`\`

This won't catch every meaning change. Paraphrase can lose nuance a regex will never see. But a dropped number is the single most common and most damaging failure, and it's trivial to detect. Catch the easy cases cheaply and move on.

## The mental model to keep

You're a translator, not an author. A translator carries every fact across the language gap untouched and only changes the words that wrap them. Your rewriter does the same across the *tone* gap: every number, name, and date arrives on the other side intact.`,
    starter_code: `# Check that a rewrite kept all the numbers from the original.
import re

def numbers_in(text):
    return set(re.findall(r"\\d+", text))

def meaning_preserved(original, rewrite):
    # TODO: return True if every number in 'original' also appears in 'rewrite'
    pass

original = "Ship 3 boxes by 5pm to 42 Main St."
rewrite = "Please ship 3 boxes to 42 Main Street by 5 pm."
print("Preserved:", meaning_preserved(original, rewrite))
`,
    solution_code: `# Check that a rewrite kept all the numbers from the original.
import re

def numbers_in(text):
    return set(re.findall(r"\\d+", text))

def meaning_preserved(original, rewrite):
    return numbers_in(original).issubset(numbers_in(rewrite))

original = "Ship 3 boxes by 5pm to 42 Main St."
good = "Please ship 3 boxes to 42 Main Street by 5 pm."
bad = "Please ship some boxes to Main Street soon."

print("Good rewrite preserved:", meaning_preserved(original, good))
print("Bad rewrite preserved:", meaning_preserved(original, bad))
print("Numbers lost by bad:", numbers_in(original) - numbers_in(bad))
`,
    hints: [
      "numbers_in(original).issubset(numbers_in(rewrite)) is True when nothing was dropped.",
      "Set difference (a - b) shows you exactly which numbers went missing.",
      "This catches dropped numbers, the most common meaning failure, not every possible change.",
    ],
    challenge_title: "Did the Rewrite Keep the Facts?",
    challenge_description:
      "Compare an original and its rewrite. If every number from the original survives, print PRESERVED; otherwise print LOST and the missing numbers.",
    challenge_language: "python",
    challenge_starter_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    original = data[0]
    rewrite = data[1] if len(data) > 1 else ""
    orig_nums = re.findall(r"\\d+", original)
    rew_nums = set(re.findall(r"\\d+", rewrite))
    # TODO: collect numbers in original that are missing from rewrite (in order,
    #       without duplicates). If none, print "PRESERVED". Otherwise print
    #       "LOST" then the missing numbers space-separated.

main()
`,
    challenge_solution_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    original = data[0]
    rewrite = data[1] if len(data) > 1 else ""
    orig_nums = re.findall(r"\\d+", original)
    rew_nums = set(re.findall(r"\\d+", rewrite))

    missing = []
    seen = set()
    for x in orig_nums:
        if x not in rew_nums and x not in seen:
            missing.append(x)
            seen.add(x)

    if not missing:
        print("PRESERVED")
    else:
        print("LOST")
        print(" ".join(missing))

main()
`,
    challenge_test_cases: [
      {
        input: "Ship 3 boxes by 5pm to 42 Main St.\nPlease ship 3 boxes to 42 Main Street by 5 pm.",
        expected_output: "PRESERVED",
        description: "All three numbers (3, 5, 42) survive the friendlier rewrite.",
      },
      {
        input: "Charge $50 to the account today.\nWe will charge your account soon.",
        expected_output: "LOST\n50",
        description: "The amount 50 was dropped, so the rewrite lost a fact.",
      },
      {
        input: "No numbers here at all.\nStill nothing numeric to see.",
        expected_output: "PRESERVED",
        description: "Edge: with no numbers to lose, the check passes.",
      },
    ],
  },

  {
    id: "prod-05-6",
    project_id: "prod-05",
    order: 6,
    title: "When the Tone Isn't on the Menu",
    concept: "validating input, fallback",
    explanation: `Your rewriter works when you feed it "formal" and a paragraph of text. Now feed it "  FORMAL " with trailing spaces, or "sarcastic" which has no preset, or an empty string. A script assumes clean input. A tool defends against messy input, because real users type messily.

## Two inputs, two failure modes

A rewrite request has a tone and a text, and each breaks in its own way. The tone might be mis-cased ("Formal"), padded (" formal "), or unknown ("sarcastic"), and none of those should crash the tool. The text might be empty or whitespace-only, in which case there's nothing to rewrite and calling the API just wastes money on a nonsense reply.

## Normalize the tone before you look it up

Lowercase it and strip the whitespace so "  FORMAL " and "formal" hit the same preset. Then, if it's still not a known tone, fall back to a sensible default instead of crashing:

\`\`\`python
DEFAULT_TONE = "neutral"

def resolve_tone(raw_tone, presets):
    tone = raw_tone.strip().lower()
    if tone in presets:
        return tone
    return DEFAULT_TONE
\`\`\`

Falling back beats erroring here. The user still gets a rewrite, just in the safe default tone, and you can tell them "unknown tone, used neutral." Better to degrade gracefully than to hard-stop.

## Reject empty text early

Empty text is the one case where you should *not* call the model. Guard it before the request:

\`\`\`python
def validate_text(text):
    if not text or not text.strip():
        raise ValueError("Nothing to rewrite: text is empty.")
    return text.strip()
\`\`\`

Catching this early saves an API call, a token bill, and a confusing empty reply. The cheapest call is the one you never make.

## Order matters

Check text first (fatal, stop), then resolve tone (recoverable, fall back). Validate in that order and the tool fails fast on the unrecoverable problem while quietly patching the recoverable one. Get the order wrong and you land somewhere between a helpful error and mysterious empty output.

## The mental model to keep

Input validation is the bouncer at the door. Empty text doesn't get in at all. A weird tone gets in but is handed the house default. Everything past the door is clean, so the rest of your code never has to wonder whether the tone is real or the text exists.`,
    starter_code: `# Validate a rewrite request: reject empty text, fall back on unknown tones.

ALLOWED = {"formal", "casual", "friendly"}
DEFAULT_TONE = "neutral"

def clean_request(raw_tone, raw_text):
    # TODO:
    #   1. If raw_text is empty or whitespace-only, return ("ERROR", "empty text")
    #   2. Otherwise normalize the tone (strip + lowercase); if it's not in
    #      ALLOWED, use DEFAULT_TONE.
    #   3. Return (tone, stripped_text)
    pass

print(clean_request("  FORMAL ", "Hello world"))
print(clean_request("sarcastic", "Hello world"))
print(clean_request("casual", "   "))
`,
    solution_code: `# Validate a rewrite request: reject empty text, fall back on unknown tones.

ALLOWED = {"formal", "casual", "friendly"}
DEFAULT_TONE = "neutral"

def clean_request(raw_tone, raw_text):
    text = raw_text.strip()
    if not text:
        return ("ERROR", "empty text")
    tone = raw_tone.strip().lower()
    if tone not in ALLOWED:
        tone = DEFAULT_TONE
    return (tone, text)

print(clean_request("  FORMAL ", "Hello world"))
print(clean_request("sarcastic", "Hello world"))
print(clean_request("casual", "   "))
`,
    hints: [
      "Check the text first: if raw_text.strip() is falsy, return the error tuple.",
      "Normalize the tone with raw_tone.strip().lower() before comparing to ALLOWED.",
      "An unknown but non-empty tone should become DEFAULT_TONE, not raise.",
    ],
    challenge_title: "Guard the Rewrite Request",
    challenge_description:
      "Normalize a tone and reject empty text. Print an error for empty text; otherwise print the resolved tone (falling back to neutral) and the trimmed text.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    raw_tone = data[0] if data else ""
    raw_text = data[1] if len(data) > 1 else ""
    allowed = {"formal", "casual", "friendly"}
    # TODO:
    #   - trimmed text empty? print "ERROR: empty text" and stop.
    #   - normalize tone (strip + lowercase); if not allowed, use "neutral".
    #   - print "tone=<tone>" then "text=<trimmed text>".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    raw_tone = data[0] if data else ""
    raw_text = data[1] if len(data) > 1 else ""
    allowed = {"formal", "casual", "friendly"}

    text = raw_text.strip()
    if not text:
        print("ERROR: empty text")
        return

    tone = raw_tone.strip().lower()
    if tone not in allowed:
        tone = "neutral"

    print(f"tone={tone}")
    print(f"text={text}")

main()
`,
    challenge_test_cases: [
      {
        input: "  FORMAL \nHello world",
        expected_output: "tone=formal\ntext=Hello world",
        description: "A padded, upper-case tone normalizes to a known preset.",
      },
      {
        input: "shouty\nHi there",
        expected_output: "tone=neutral\ntext=Hi there",
        description: "An unknown tone falls back to neutral instead of crashing.",
      },
      {
        input: "casual\n    ",
        expected_output: "ERROR: empty text",
        description: "Whitespace-only text is rejected before any rewrite happens.",
      },
    ],
  },

  {
    id: "prod-05-7",
    project_id: "prod-05",
    order: 7,
    title: "Cheap, Clean, and Unbreakable",
    concept: "cost and defensive parsing",
    explanation: `Two things stand between a working demo and a tool you'd let other people use. The model's reply is messier than you hope, and every call costs money. This lesson hardens both.

## The model wraps the rewrite

You asked for "only the rewritten text." The model, trying to be helpful, sometimes returns this instead:

\`\`\`
Here is the rewritten text:
\\\`\\\`\\\`
Could you please send that over?
\\\`\\\`\\\`
\`\`\`

Display that raw and your user sees code fences and a chatty preamble wrapped around their rewrite. Clean it defensively: drop fence lines, strip a leading label, trim the blank edges:

\`\`\`python
def clean_reply(text):
    lines = text.split("\\n")
    lines = [ln for ln in lines if not ln.strip().startswith("\\\`\\\`\\\`")]
    while lines and lines[0].strip() == "":
        lines.pop(0)
    while lines and lines[-1].strip() == "":
        lines.pop()
    return "\\n".join(lines).strip()
\`\`\`

The rule is simple: never trust the reply to be exactly what you asked for. Strip the wrapper every time. It's cheap insurance against ugly output.

## Cost is length times frequency

Every call spends tokens on the *input* (system prompt plus text) and the *output* (the rewrite). A rough rule of thumb is one token per four characters. Two habits keep the bill sane:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

MAX_INPUT_TOKENS = 3000

def guard_cost(text):
    if estimate_tokens(text) > MAX_INPUT_TOKENS:
        raise ValueError("Text too long; split it into chunks first.")
\`\`\`

- **Cap the input.** A user pasting a whole book shouldn't trigger one giant, expensive call. Set a ceiling and refuse (or chunk) anything past it.
- **Set \`max_tokens\` sanely.** A rewrite runs about the same length as the input, so a two-line email doesn't need \`max_tokens=4000\`. Right-size it.

## Fail politely, not silently

Networks drop and models occasionally return junk. Wrap the call so a failure hands the user their original text back with a note rather than a stack trace. A rewriter that returns the original when it fails is still useful. One that crashes is not.

## The mental model to keep

Treat the reply like produce from a market and rinse it before serving. Treat every call like it's on your credit card, because it is. Clean what comes back, cap what goes out, and the tool stays both presentable and affordable.`,
    starter_code: `# Clean a messy model reply: strip code fences and blank edges.

def clean_reply(text):
    lines = text.split("\\n")
    # TODO:
    #   1. drop any line whose stripped form starts with the triple-backtick fence
    #   2. remove leading and trailing blank lines
    #   3. return the remaining lines joined by newlines, stripped
    pass

raw = "\`\`\`\\nCould you please send that over?\\n\`\`\`"
print(clean_reply(raw))
`,
    solution_code: `# Clean a messy model reply: strip code fences and blank edges.

def clean_reply(text):
    lines = text.split("\\n")
    lines = [ln for ln in lines if not ln.strip().startswith("\`\`\`")]
    while lines and lines[0].strip() == "":
        lines.pop(0)
    while lines and lines[-1].strip() == "":
        lines.pop()
    return "\\n".join(lines).strip()

raw = "\`\`\`\\nCould you please send that over?\\n\`\`\`"
print(clean_reply(raw))

raw2 = "\`\`\`text\\nHello there!\\n\`\`\`"
print(clean_reply(raw2))
`,
    hints: [
      "A list comprehension keeps only lines whose stripped form does not start with the fence.",
      "Pop blank lines from both ends with two while-loops.",
      "Join what's left with newlines and strip the result.",
    ],
    challenge_title: "Scrub the Fenced Reply",
    challenge_description:
      "Strip triple-backtick fence lines and surrounding blank lines from a model reply, leaving only the rewritten text.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    # TODO:
    #   - drop lines whose stripped form starts with the triple-backtick fence
    #   - drop leading and trailing blank lines
    #   - print the remaining lines joined by newlines

main()
`,
    challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    cleaned = [ln for ln in lines if not ln.strip().startswith("\`\`\`")]
    while cleaned and cleaned[0].strip() == "":
        cleaned.pop(0)
    while cleaned and cleaned[-1].strip() == "":
        cleaned.pop()
    print("\\n".join(cleaned))

main()
`,
    challenge_test_cases: [
      {
        input: "```\nGood day to you.\nIt was a pleasure.\n```",
        expected_output: "Good day to you.\nIt was a pleasure.",
        description: "Both fence lines are removed, leaving the two-line rewrite.",
      },
      {
        input: "Just plain text, no fences.",
        expected_output: "Just plain text, no fences.",
        description: "A reply with no fences passes through unchanged.",
      },
      {
        input: "```text\nHello there!\n```",
        expected_output: "Hello there!",
        description: "A language-tagged fence line is also stripped.",
      },
    ],
  },

  {
    id: "prod-05-8",
    project_id: "prod-05",
    order: 8,
    title: "Ship the Tone Rewriter",
    concept: "finishing and shipping",
    explanation: `Time to assemble the pieces into one tool you can run and hand to someone else. You have every part: presets, a system-prompt template, meaning checks, input validation, and reply cleaning. Shipping is wiring them into a single, predictable pipeline.

## The whole pipeline, in order

Each request flows through the same steps, and the order is the design.

\`\`\`python
import os, re
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

TONE_PRESETS = {
    "formal": "Use professional, polished language. No slang or contractions.",
    "casual": "Keep it relaxed and conversational. Contractions welcome.",
    "friendly": "Be warm and encouraging, like a helpful person glad to help.",
}
TEMPLATE = (
    "Rewrite the user's text in a {tone} tone.\\n"
    "Tone guidance: {guidance}\\n"
    "Preserve every fact: keep all names, numbers, and dates unchanged.\\n"
    "Return only the rewritten text, no preamble or quotes."
)

def rewrite(text, tone):
    text = text.strip()
    if not text:
        raise ValueError("Nothing to rewrite.")
    tone = tone.strip().lower()
    guidance = TONE_PRESETS.get(tone)
    if guidance is None:
        raise ValueError(f"Unknown tone: {tone}. Try {list(TONE_PRESETS)}.")

    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system=TEMPLATE.format(tone=tone, guidance=guidance),
        messages=[{"role": "user", "content": text}],
    )
    return clean_reply(resp.content[0].text)
\`\`\`

Validate, resolve the preset, template the system prompt, call, clean the reply. That's the tool. Wrap it in a tiny CLI (\`input()\` for the text and tone, \`print()\` for the result) and a human can use it.

## What "shipped" means here

By now you've built all three parts of it. The tool runs from a clean start: pick a tone, paste text, get a rewrite. It handles bad input, both empty text and an unknown tone, without crashing. And someone else could pick it up from a one-line description: "rewrites text into a tone you choose."

## It lands in your Portfolio

Finishing this final lesson saves the **Tone Rewriter** to your Portfolio tab automatically, with the title and deliverable recorded. Keep an example alongside it. A scrappy original note next to its formal rewrite shows the tool working at a glance, and that before/after pair is your demo.

## The mental model to keep

You didn't build eight features. You built one pipeline and hardened each stage. Input goes in dirty, flows through validate, resolve, template, call, and clean, and comes out as a tone-shifted rewrite that still means what the original meant. That pipeline is the product. Ship it.`,
    starter_code: `# Run the full rewrite pipeline offline (simulated model, no network).

TONE_PRESETS = {
    "formal": "Use professional, polished language.",
    "casual": "Keep it relaxed and conversational.",
    "friendly": "Be warm and encouraging.",
}

def rewrite_request(tone, text):
    # TODO: build the final pipeline result.
    #   - trimmed text empty -> return "ERROR: empty text"
    #   - tone (stripped + lowercased) not a preset -> return "ERROR: unknown tone"
    #   - otherwise return "tone: <tone>\\nrule: <guidance>\\ninput: <text>"
    pass

print(rewrite_request("Formal", "hey can u send the report"))
`,
    solution_code: `# Run the full rewrite pipeline offline (simulated model, no network).

TONE_PRESETS = {
    "formal": "Use professional, polished language.",
    "casual": "Keep it relaxed and conversational.",
    "friendly": "Be warm and encouraging.",
}

def rewrite_request(tone, text):
    text = text.strip()
    if not text:
        return "ERROR: empty text"
    tone = tone.strip().lower()
    if tone not in TONE_PRESETS:
        return "ERROR: unknown tone"
    guidance = TONE_PRESETS[tone]
    return f"tone: {tone}\\nrule: {guidance}\\ninput: {text}"

print(rewrite_request("Formal", "hey can u send the report"))
print("---")
print(rewrite_request("sarcastic", "hey"))
print("---")
print(rewrite_request("casual", "   "))
`,
    hints: [
      "Check empty text first, then the tone, then build the success string.",
      "Normalize the tone with .strip().lower() so 'Formal' matches the 'formal' preset.",
      "The success output is three lines: tone, rule (the preset guidance), and input.",
    ],
    challenge_title: "Run the Full Pipeline",
    challenge_description:
      "Read tone presets, a chosen tone, and text, then run the whole rewrite pipeline: reject empty text, reject unknown tones, else print the resolved request.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    presets = {}
    for i in range(1, n + 1):
        name, guidance = data[i].split(":", 1)
        presets[name.strip()] = guidance.strip()
    tone = data[n + 1].strip().lower()
    text = data[n + 2].strip() if len(data) > n + 2 else ""
    # TODO:
    #   - empty text -> print "ERROR: empty text"
    #   - tone not in presets -> print "ERROR: unknown tone"
    #   - else print three lines: "tone: <tone>", "rule: <guidance>", "input: <text>"

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    presets = {}
    for i in range(1, n + 1):
        name, guidance = data[i].split(":", 1)
        presets[name.strip()] = guidance.strip()
    tone = data[n + 1].strip().lower()
    text = data[n + 2].strip() if len(data) > n + 2 else ""

    if not text:
        print("ERROR: empty text")
        return
    if tone not in presets:
        print("ERROR: unknown tone")
        return

    print(f"tone: {tone}")
    print(f"rule: {presets[tone]}")
    print(f"input: {text}")

main()
`,
    challenge_test_cases: [
      {
        input: "2\nformal: Use professional language.\ncasual: Keep it relaxed.\nformal\nhey can u send the report",
        expected_output: "tone: formal\nrule: Use professional language.\ninput: hey can u send the report",
        description: "A valid tone and text flow through the whole pipeline to a resolved request.",
      },
      {
        input: "2\nformal: Use professional language.\ncasual: Keep it relaxed.\nangry\nfix this now",
        expected_output: "ERROR: unknown tone",
        description: "A tone with no preset is rejected before any rewrite.",
      },
      {
        input: "1\nfriendly: Be warm.\nfriendly\n    ",
        expected_output: "ERROR: empty text",
        description: "Empty text is caught even when the tone is valid.",
      },
    ],
  },
];

export default { project, lessons };
