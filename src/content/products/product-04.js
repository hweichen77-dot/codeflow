const project = {
  id: "prod-04",
  title: "Resume Bullet Booster",
  description:
    "A command-line tool that rewrites plain task descriptions into strong, quantified resume bullets. You build the rewrite prompt, enforce action-verb openings and length limits, then batch a whole list of tasks into polished bullets you can paste straight into a resume.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["resume", "prompting", "rewrite", "action-verbs", "validation", "anthropic"],
  order: 104,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-04-1",
    project_id: "prod-04",
    order: 1,
    title: "The Rewrite Request",
    concept: "the rewrite prompt",
    explanation: `Everyone writes the same weak resume line: "responsible for the front desk." A recruiter skims past it in half a second. Over the next eight lessons you'll build a small tool that takes a limp task description and hands back a strong bullet: "Managed a 40-person front desk, cutting check-in time by 30%." Same job, completely different signal.

## What you're building

The finished tool is one function you can run from a terminal: paste in a plain task, get back a punchy bullet. Under the hood it's the same six-step loop every AI product uses, read a task, wrap it in a prompt, call the model, clean the reply, check it against your rules, print it. This lesson builds step two: the **rewrite prompt**.

## The system prompt is the product

A rewrite tool lives or dies on its prompt. The persona and rules go in the **system** prompt (set once, reused for every task); the actual task the user typed goes in a **user** message. Keeping them separate means you write the rules a single time and only swap the input each call.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line. "
    "Return only the bullet, no preamble."
)

def rewrite(task):
    reply = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=80,
        system=SYSTEM,
        messages=[{"role": "user", "content": "Rewrite this as a resume bullet: " + task}],
    )
    return reply.content[0].text
\`\`\`

## Why the "Return only the bullet" line matters

Left to itself, a chat model is chatty: "Sure! Here's a strong version:…". That preamble breaks everything downstream because your tool expects a bare bullet, not a friendly paragraph. Telling the model the **exact output shape**, one line, verb-first, nothing else, is the cheapest reliability you can buy. You'll still defend against a chatty reply in lesson 2, but a precise prompt means you rarely have to.

## The mental model

The prompt is a function's instructions that will run on a thousand tasks you'll never see. Write it precise and boring: who the model is, what to do, and the exact format to return. Below you'll build the request payload by hand, no network, so the data shape is locked in before you ever make a real call.`,
    starter_code: `# Build the rewrite request payload by hand (no API call yet).
# system holds the rules; the user message holds this task.

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line."
)

def build_rewrite_request(task):
    # TODO: return a dict with keys: model, max_tokens, system, messages
    #       messages is a list with ONE user turn whose content is
    #       "Rewrite this as a resume bullet: " + task
    pass

task = "did the front desk stuff and answered phones"
req = build_rewrite_request(task)
print("system set:", "system" in req)
`,
    solution_code: `# Build the rewrite request payload by hand (no API call yet).
# system holds the rules; the user message holds this task.

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line."
)

def build_rewrite_request(task):
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 80,
        "system": SYSTEM,
        "messages": [
            {"role": "user", "content": "Rewrite this as a resume bullet: " + task},
        ],
    }

task = "did the front desk stuff and answered phones"
req = build_rewrite_request(task)

print("system:", req["system"])
print("model:", req["model"])
print("messages:", len(req["messages"]))
print("user:", req["messages"][0]["content"])
`,
    hints: [
      "build_rewrite_request just returns a dict with model, max_tokens, system, and messages keys.",
      "messages is a list holding one dict: {\"role\": \"user\", \"content\": ...}.",
      "Concatenate the fixed instruction with the task: \"Rewrite this as a resume bullet: \" + task.",
    ],
    challenge_title: "Compose the Rewrite Prompt",
    challenge_description: "Given a system prompt and a raw task, assemble the exact two lines a rewrite request is built from.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    system = data[0]
    task = data[1]
    # TODO: print "system: <system>" then
    #       "user: Rewrite this as a resume bullet: <task>"

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    system = data[0]
    task = data[1]
    print("system: " + system)
    print("user: Rewrite this as a resume bullet: " + task)

main()
`,
    challenge_test_cases: [
      { input: "You rewrite resume bullets.\nmanaged the front desk", expected_output: "system: You rewrite resume bullets.\nuser: Rewrite this as a resume bullet: managed the front desk", description: "System line echoed, task wrapped in the fixed instruction." },
      { input: "Turn tasks into strong bullets.\nhelped plan the company party", expected_output: "system: Turn tasks into strong bullets.\nuser: Rewrite this as a resume bullet: helped plan the company party", description: "Different system and task, same assembly." },
    ],
  },

  {
    id: "prod-04-2",
    project_id: "prod-04",
    order: 2,
    title: "Cleaning the Reply",
    concept: "parsing the model's bullet",
    explanation: `You asked for a bare bullet. Sometimes you get one. Sometimes you get \`- Managed the front desk\`, or \`"Managed the front desk"\`, or \`1. Managed the front desk\`, or a cheerful \`Here's your bullet:\` glued to the front. The model is helpful in ways that break your tool. This lesson builds the cleanup step that turns any of those into one plain bullet.

## Why parsing is a separate step

Never trust the raw reply. Even with a strict prompt, models drift: they wrap text in quotes, add a leading dash because "that's what bullets look like," or number the line. Your downstream code, the action-verb check, the length check, expects a clean string that starts with the actual first word. A stray \`- \` means the "first word" is a dash, and every check misfires. So right after the call, you normalize.

\`\`\`python
def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1]
    return s.strip()
\`\`\`

## The order of operations

Cleanup is a pipeline, and order matters:

1. **Strip whitespace** first, so a leading space doesn't hide the marker.
2. **Remove one bullet marker** (\`- \`, \`* \`, \`• \`, or a numeric \`1. \`) if present. Just one, a real bullet won't start with two.
3. **Strip surrounding quotes** if both ends have them.
4. **Strip again**: because removing a marker can expose new whitespace.

Each step is boring on its own. Together they mean the rest of your tool always sees a predictable string.

## What cleanup does NOT fix

Cleanup handles formatting noise, not bad content. If the model returns "Here is a great bullet for you: Managed the desk," stripping markers won't remove the preamble, that's a prompt problem, and the fix is the "Return only the bullet" line from lesson 1. Cleanup is the second line of defense, not the first. Tighten the prompt, then clean what slips through.

## The mental model

Think of the reply as a package that sometimes arrives with extra tape and a bow. You're not judging the gift yet, just unwrapping it so what's inside is a plain string you can measure. Below you'll write \`clean_bullet\` and run it over a few messy replies.`,
    starter_code: `# Turn a messy model reply into one clean bullet string.

def clean_bullet(raw):
    s = raw.strip()
    # TODO: if s starts with "- ", "* ", or "• ", remove that marker (just one)
    # TODO: if s is wrapped in double quotes on both ends, remove them
    # TODO: return s stripped of surrounding whitespace
    return s

samples = [
    "  - Led the team ",
    '"Increased sales"',
    "• Managed a team of five",
    "Reduced churn by 12%",
]
for r in samples:
    print(clean_bullet(r))
`,
    solution_code: `# Turn a messy model reply into one clean bullet string.

def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    else:
        digits = 0
        while digits < len(s) and s[digits].isdigit():
            digits += 1
        if digits > 0 and s[digits:digits + 2] == ". ":
            s = s[digits + 2:]
    s = s.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1].strip()
    return s

samples = [
    "  - Led the team ",
    '1. "Increased sales"',
    "• Managed a team of five",
    "Reduced churn by 12%",
]
for r in samples:
    print(clean_bullet(r))
`,
    hints: [
      "Strip whitespace before you look for a marker, or a leading space hides it.",
      "Use a for/else: the else runs only if no dash/star/bullet marker matched, so that's where you check for a numeric marker like '1. '.",
      "Only strip quotes when both the first and last character are a double quote.",
    ],
    challenge_title: "Strip the Bullet",
    challenge_description: "Clean one raw model reply: remove a single leading bullet marker (dash, star, dot, or numeric) and surrounding quotes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def clean_bullet(raw):
    s = raw.strip()
    # TODO: remove one leading marker: "- ", "* ", "• ", or "<digits>. "
    # TODO: remove surrounding double quotes if present
    return s.strip()

def main():
    print(clean_bullet(sys.stdin.read()))

main()
`,
    challenge_solution_code: `import sys

def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    else:
        digits = 0
        while digits < len(s) and s[digits].isdigit():
            digits += 1
        if digits > 0 and s[digits:digits + 2] == ". ":
            s = s[digits + 2:]
    s = s.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1].strip()
    return s

def main():
    print(clean_bullet(sys.stdin.read()))

main()
`,
    challenge_test_cases: [
      { input: "  - Led the team ", expected_output: "Led the team", description: "Strips whitespace and a leading dash marker." },
      { input: "1. \"Increased sales\"", expected_output: "Increased sales", description: "Removes a numeric marker and surrounding quotes." },
      { input: "• Managed a team of five", expected_output: "Managed a team of five", description: "Removes a bullet-dot marker." },
      { input: "\"Reduced churn\"", expected_output: "Reduced churn", description: "No marker, just surrounding quotes to strip." },
    ],
  },

  {
    id: "prod-04-3",
    project_id: "prod-04",
    order: 3,
    title: "Demand a Strong Verb",
    concept: "action-verb constraints",
    explanation: `The single biggest tell of a weak resume is the opener. "Responsible for," "Helped with," "Worked on," "Assisted with," "Duties included", these signal a passenger, not a driver. Strong bullets start with a past-tense **action verb** that you owned: Led, Built, Shipped, Cut, Grew, Automated, Negotiated. This lesson makes your tool enforce that.

## Two ways to enforce the verb

You have two levers, and good tools pull both:

1. **Constrain the prompt.** Tell the model to start with a strong past-tense action verb and ban weak openers outright. This is where the quality actually comes from.

\`\`\`python
SYSTEM = (
    "You rewrite tasks into strong resume bullets. Rules:\\n"
    "- Start with a past-tense action verb (Led, Built, Cut, Grew, Automated).\\n"
    "- Never start with a weak phrase: 'Responsible for', 'Helped', "
    "'Worked on', 'Assisted with', 'Duties included'.\\n"
    "- Return only the bullet."
)
\`\`\`

2. **Verify the output.** The prompt is a strong suggestion, not a guarantee. After cleaning the reply, check the opener yourself and reject bullets that still start weak.

\`\`\`python
WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    low = bullet.strip().lower()
    return any(low.startswith(op) for op in WEAK_OPENERS)
\`\`\`

## Why check when you already asked

Because "asked" and "guaranteed" are different words. A model that follows your rule 95% of the time still ships a weak bullet one in twenty runs, and on a resume, one weak line is the one a recruiter notices. The verification is cheap: a lowercase-and-\`startswith\` scan over a short list. When it fails, you'll retry the call (lesson 6). Prompt for quality, verify for reliability, that pairing shows up in every serious AI product.

## Getting the check right

Two details keep the check honest. **Lowercase both sides** so "Responsible" and "responsible" match. And match against **openers**, not any occurrence, a bullet can legitimately contain "helped" mid-sentence ("Led a rewrite that helped cut load time"); it's only weak when it *starts* that way. \`startswith\` on the lowercased bullet gets both right.

## The mental model

The prompt is you telling the model what good looks like. The verifier is you double-checking before it goes on paper. Below you'll build \`starts_weak\` and score a batch of bullets.`,
    starter_code: `# Flag bullets that open with a weak, passive phrase.

WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    # TODO: lowercase and strip the bullet, then return True if it
    #       startswith any phrase in WEAK_OPENERS
    pass

bullets = [
    "Responsible for the monthly budget",
    "Led a team of six engineers",
    "Helped customers with returns",
    "Cut cloud costs by 20%",
]
for b in bullets:
    label = "WEAK" if starts_weak(b) else "STRONG"
    print(label, "-", b)
`,
    solution_code: `# Flag bullets that open with a weak, passive phrase.

WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    low = bullet.strip().lower()
    return any(low.startswith(op) for op in WEAK_OPENERS)

bullets = [
    "Responsible for the monthly budget",
    "Led a team of six engineers",
    "Helped customers with returns",
    "Cut cloud costs by 20%",
]
for b in bullets:
    label = "WEAK" if starts_weak(b) else "STRONG"
    print(label, "-", b)
`,
    hints: [
      "Lowercase AND strip the bullet before comparing, so casing and stray spaces don't fool the check.",
      "any(low.startswith(op) for op in WEAK_OPENERS) returns True if any opener matches.",
      "Match on the start only: a bullet containing 'helped' in the middle is still strong.",
    ],
    challenge_title: "Reject Weak Openers",
    challenge_description: "Given a list of weak opener phrases and a batch of bullets, label each STRONG or WEAK and tally the results.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    idx = 0
    w = int(data[idx]); idx += 1
    weak = [data[idx + i].strip().lower() for i in range(w)]; idx += w
    n = int(data[idx]); idx += 1
    bullets = [data[idx + i] for i in range(n)]; idx += n
    # TODO: print STRONG or WEAK for each bullet (WEAK if it starts with
    #       any weak opener, case-insensitively), then "Strong: X Weak: Y".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    idx = 0
    w = int(data[idx]); idx += 1
    weak = [data[idx + i].strip().lower() for i in range(w)]; idx += w
    n = int(data[idx]); idx += 1
    bullets = [data[idx + i] for i in range(n)]; idx += n

    strong_count = 0
    weak_count = 0
    for b in bullets:
        low = b.strip().lower()
        if any(low.startswith(op) for op in weak):
            print("WEAK")
            weak_count += 1
        else:
            print("STRONG")
            strong_count += 1
    print(f"Strong: {strong_count} Weak: {weak_count}")

main()
`,
    challenge_test_cases: [
      { input: "3\nresponsible for\nhelped\nworked on\n3\nResponsible for the budget\nLed the team\nHelped customers", expected_output: "WEAK\nSTRONG\nWEAK\nStrong: 1 Weak: 2", description: "Two weak openers, one strong verb." },
      { input: "2\nassisted with\nduties included\n2\nBuilt the API\nDesigned the logo", expected_output: "STRONG\nSTRONG\nStrong: 2 Weak: 0", description: "Both open with strong action verbs." },
      { input: "1\nresponsible for\n1\nResponsible for payroll", expected_output: "WEAK\nStrong: 0 Weak: 1", description: "Single weak bullet." },
    ],
  },

  {
    id: "prod-04-4",
    project_id: "prod-04",
    order: 4,
    title: "Make It Count",
    concept: "quantifying bullets",
    explanation: `"Improved the onboarding process" is forgettable. "Cut onboarding from 5 days to 2, raising 30-day retention 18%" is a hire. The difference is **numbers**. A quantified bullet gives a recruiter something concrete to picture and compare. This lesson makes your tool push for metrics and flag the bullets that still don't have any.

## The rewrite prompt should ask for numbers

The model can't invent true numbers, it doesn't know your metrics, but it can prompt you for them and use any you provide. So the rewrite instruction does two things: bake numbers in when the task mentions them, and insert a clear placeholder when it doesn't, so you fill it rather than shipping a vague line.

\`\`\`python
SYSTEM = (
    "You rewrite tasks into strong resume bullets. "
    "Quantify impact wherever possible: team size, %, time saved, dollars, volume. "
    "If the task has no numbers, insert a bracketed placeholder like [X%] "
    "so the user can fill it in. Return only the bullet."
)
\`\`\`

A bullet that comes back as "Reduced ticket backlog by [X%]" is doing its job: it's telling you exactly what fact would make it strong.

## Detecting whether a bullet is quantified

After the rewrite, check whether real numbers made it in. The simplest reliable signal is: does the bullet contain a digit?

\`\`\`python
def has_number(bullet):
    return any(ch.isdigit() for ch in bullet)
\`\`\`

That single line catches percentages, counts, dollar amounts, and time spans, anything with a \`0\`, \`9\` in it. It's a heuristic, not a proof (a bullet could say "doubled" in words), but it correctly flags the overwhelming majority of vague lines so you know which ones still need a metric. When \`has_number\` is False, your tool warns you: "this bullet has no numbers, add one."

## Why a heuristic is enough here

You don't need a perfect grammar of "impact." You need a fast, cheap flag that surfaces the bullets most likely to read as fluff, so a human spends thirty seconds adding the real figure. Perfect is the enemy of shipped; \`any(ch.isdigit())\` is the whole detector, and it earns its keep.

## The mental model

Numbers are the load-bearing wall of a resume bullet. Your tool's job here is a metal detector: sweep each bullet, beep on the ones with no metal in them, and tell you to go find the number. Below you'll build \`has_number\` and sort a batch into quantified vs vague.`,
    starter_code: `# Flag bullets that contain no numbers (likely vague).

def has_number(bullet):
    # TODO: return True if any character in bullet is a digit 0-9
    pass

bullets = [
    "Cut cloud costs by 30%",
    "Improved team morale",
    "Grew signups from 100 to 450",
    "Managed the front desk",
]
for b in bullets:
    label = "QUANTIFIED" if has_number(b) else "VAGUE"
    print(label, "-", b)
`,
    solution_code: `# Flag bullets that contain no numbers (likely vague).

def has_number(bullet):
    return any(ch.isdigit() for ch in bullet)

bullets = [
    "Cut cloud costs by 30%",
    "Improved team morale",
    "Grew signups from 100 to 450",
    "Managed the front desk",
]
quantified = 0
for b in bullets:
    if has_number(b):
        print("QUANTIFIED -", b)
        quantified += 1
    else:
        print("VAGUE -", b)
print(f"Quantified: {quantified} of {len(bullets)}")
`,
    hints: [
      "str method .isdigit() is True for a single digit character.",
      "any(ch.isdigit() for ch in bullet) scans the whole string for at least one digit.",
      "You don't need to detect spelled-out numbers like 'ten'; a digit check flags the vast majority of vague bullets.",
    ],
    challenge_title: "Flag the Vague Bullets",
    challenge_description: "Label each bullet QUANTIFIED if it contains a digit, otherwise VAGUE, and count how many made the cut.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    bullets = [data[1 + i] for i in range(n)]
    # TODO: print QUANTIFIED or VAGUE per bullet (QUANTIFIED if it has a digit),
    #       then "Quantified: X of N".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    bullets = [data[1 + i] for i in range(n)]

    q = 0
    for b in bullets:
        if any(ch.isdigit() for ch in b):
            print("QUANTIFIED")
            q += 1
        else:
            print("VAGUE")
    print(f"Quantified: {q} of {n}")

main()
`,
    challenge_test_cases: [
      { input: "3\nCut costs by 30%\nImproved team morale\nGrew signups from 100 to 450", expected_output: "QUANTIFIED\nVAGUE\nQUANTIFIED\nQuantified: 2 of 3", description: "Two bullets carry digits, one is vague." },
      { input: "2\nManaged the office\nLed weekly standups", expected_output: "VAGUE\nVAGUE\nQuantified: 0 of 2", description: "No numbers anywhere." },
      { input: "1\nReduced load time by 2 seconds", expected_output: "QUANTIFIED\nQuantified: 1 of 1", description: "Single quantified bullet." },
    ],
  },

  {
    id: "prod-04-5",
    project_id: "prod-04",
    order: 5,
    title: "One Line, No More",
    concept: "length limits",
    explanation: `A resume bullet is one line. Not a sentence that wraps three times, not a paragraph disguised as a bullet. Recruiters skim; a bullet that runs long gets read as "didn't edit." This lesson makes your tool enforce a hard **length limit**, in the prompt, and again on the output.

## Cap it in the prompt first

The cleanest length control is telling the model the budget up front. A word cap is easier for a model to hit reliably than a character cap, and it maps to how bullets actually read.

\`\`\`python
MAX_WORDS = 20

SYSTEM = (
    f"You rewrite tasks into resume bullets of at most {MAX_WORDS} words. "
    "One line, no line breaks. Lead with the action verb; cut filler words "
    "like 'various', 'successfully', 'in order to'. Return only the bullet."
)
\`\`\`

## Enforce it on the output too

Same story as the verb check: asking isn't guaranteeing. After cleaning, count words and, if the bullet blew the budget, trim it at a **word boundary** so you never cut a word in half.

\`\`\`python
def enforce_length(bullet, max_words):
    words = bullet.split()
    if len(words) <= max_words:
        return bullet, False
    return " ".join(words[:max_words]), True
\`\`\`

The function returns the (possibly trimmed) bullet and a flag saying whether it had to cut. That flag matters: a hard truncation can lop off the number at the end ("...by 30%"), so when it trips, your tool should warn you to rewrite shorter rather than silently ship a chopped line.

## Why trim instead of just reject

Rejecting and retrying costs another API call and another few seconds. For length specifically, a local trim is instant and usually fine, the important content is front-loaded because you forced the verb first. Trim locally, flag when you did, and only re-call the model if the trim damaged the meaning. Cheap fixes before expensive ones.

## Watch the boundary

The one bug to avoid: never slice by character count in the middle of a word. \`bullet[:100]\` can produce "Automated the deploy pipeli", worse than the original. Splitting into words and rejoining the first N guarantees clean, readable output every time. \`split()\` also collapses any accidental double spaces for free.

## The mental model

Think of the bullet as a headline with a character budget, like a tweet. When it's over, you don't shrink the font, you cut words from the end, and if cutting hurt, you rewrite. Below you'll build \`enforce_length\` and trim to a limit.`,
    starter_code: `# Enforce a word limit, trimming at a word boundary.

def enforce_length(bullet, max_words):
    words = bullet.split()
    # TODO: if len(words) <= max_words, return (bullet, False)
    # TODO: otherwise return (" ".join(first max_words words), True)
    pass

samples = [
    ("Led a cross-functional team of ten engineers across three global offices", 6),
    ("Cut cloud costs by thirty percent", 6),
]
for bullet, cap in samples:
    trimmed, was_trimmed = enforce_length(bullet, cap)
    print(("TRIMMED" if was_trimmed else "OK"), "->", trimmed)
`,
    solution_code: `# Enforce a word limit, trimming at a word boundary.

def enforce_length(bullet, max_words):
    words = bullet.split()
    if len(words) <= max_words:
        return bullet, False
    return " ".join(words[:max_words]), True

samples = [
    ("Led a cross-functional team of ten engineers across three global offices", 6),
    ("Cut cloud costs by thirty percent", 6),
]
for bullet, cap in samples:
    trimmed, was_trimmed = enforce_length(bullet, cap)
    print(("TRIMMED" if was_trimmed else "OK"), "->", trimmed)
`,
    hints: [
      "bullet.split() gives the list of words; len() of it is the word count.",
      "Return a tuple: the (possibly trimmed) bullet and a bool for whether you cut.",
      "Trim with ' '.join(words[:max_words]) so you never split a word in half.",
    ],
    challenge_title: "Trim to the Limit",
    challenge_description: "Given a max word count and a bullet, print the bullet unchanged if it fits, otherwise trim it at a word boundary; report OK or TRIMMED.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    bullet = data[1] if len(data) > 1 else ""
    # TODO: if the bullet has <= m words, print it then "OK".
    # TODO: otherwise print the first m words joined by spaces, then "TRIMMED".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    bullet = data[1] if len(data) > 1 else ""
    words = bullet.split()
    if len(words) <= m:
        print(bullet)
        print("OK")
    else:
        print(" ".join(words[:m]))
        print("TRIMMED")

main()
`,
    challenge_test_cases: [
      { input: "5\nLed a team of ten engineers across three offices", expected_output: "Led a team of ten\nTRIMMED", description: "Nine words trimmed to the first five." },
      { input: "6\nCut cloud costs by thirty percent", expected_output: "Cut cloud costs by thirty percent\nOK", description: "Exactly at the limit, unchanged." },
      { input: "3\nBuilt the dashboard", expected_output: "Built the dashboard\nOK", description: "Under the limit." },
    ],
  },

  {
    id: "prod-04-6",
    project_id: "prod-04",
    order: 6,
    title: "Guard Every Bullet",
    concept: "validation and retries",
    explanation: `You now have three separate rules: strong opener, has a number, within the word limit. Scattered across your code they're easy to forget. This lesson pulls them into one **validator** that checks every rule at once and, when a bullet fails, tells your tool exactly what to fix, including the edge case everyone forgets: empty input.

## One function, all the rules

A validator returns the list of things wrong with a bullet. Empty list means it passed.

\`\`\`python
def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    if text == "":
        return ["EMPTY"]
    problems = []
    low = text.lower()
    if any(low.startswith(op) for op in weak_openers):
        problems.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        problems.append("NONUM")
    if len(text.split()) > max_words:
        problems.append("LONG")
    return problems
\`\`\`

Notice the order: **EMPTY short-circuits**. An empty bullet isn't weak or long, it's nothing, and every other check would be noise. Return early. Then collect the rest in a fixed order so the output is predictable.

## Turning failures into a retry

The validator is what makes the "prompt for quality, verify for reliability" loop real. When a bullet fails, you don't give up, you call the model again, and you tell it *why* it failed so the retry is better than a blind redo:

\`\`\`python
def rewrite_valid(task, tries=2):
    for attempt in range(tries + 1):
        bullet = clean_bullet(rewrite(task))
        problems = validate(bullet, WEAK_OPENERS, MAX_WORDS)
        if not problems:
            return bullet
        task = task + f"  (last attempt failed: {', '.join(problems)}. Fix it.)"
    return bullet
\`\`\`

Feeding the failure codes back is the trick: "you started weak and used no numbers" gives the model a concrete correction, so attempt two usually lands. Cap the tries so a stubborn task can't loop forever and burn money, return the best you got and flag it.

## Why empty input matters most

The empty case is the one that crashes tools in the wild: a blank line in the input file, a task that's just whitespace. If \`validate\` didn't check it first, \`text.split()\` returns \`[]\`, "no number" fires, and you'd retry forever on a bullet that can never be filled. Handling empty explicitly turns a crash-or-loop into a clean, honest "EMPTY, skip this one."

## The mental model

The validator is the bouncer at the door: it checks every rule, and either waves the bullet through or hands back the exact list of reasons it's turned away. Below you'll build \`validate\` end to end.`,
    starter_code: `# One validator that checks all the bullet rules at once.

def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    # TODO: if text is empty, return ["EMPTY"] (and nothing else)
    # TODO: build a list of problem codes in this order:
    #       "WEAK"  if it starts with a weak opener (case-insensitive)
    #       "NONUM" if it has no digit
    #       "LONG"  if it has more than max_words words
    # TODO: return the list (empty list means it passed)
    pass

weak = ["responsible for", "helped"]
print(validate("Responsible for the office supplies", weak, 8))
print(validate("Increased revenue 20% in Q3", weak, 8))
print(validate("   ", weak, 8))
`,
    solution_code: `# One validator that checks all the bullet rules at once.

def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    if text == "":
        return ["EMPTY"]
    problems = []
    low = text.lower()
    if any(low.startswith(op) for op in weak_openers):
        problems.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        problems.append("NONUM")
    if len(text.split()) > max_words:
        problems.append("LONG")
    return problems

weak = ["responsible for", "helped"]
print(validate("Responsible for the office supplies", weak, 8))
print(validate("Increased revenue 20% in Q3", weak, 8))
print(validate("   ", weak, 8))
`,
    hints: [
      "Check empty FIRST and return ['EMPTY'] immediately; the other checks would be meaningless.",
      "Append codes in a fixed order (WEAK, NONUM, LONG) so results are predictable.",
      "An empty list of problems is your 'passed' signal.",
    ],
    challenge_title: "The Bullet Validator",
    challenge_description: "Run all rules against one bullet and print PASS or the failure codes in order (EMPTY short-circuits).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    w = int(data[1])
    weak = [data[2 + i].strip().lower() for i in range(w)]
    bi = 2 + w
    bullet = data[bi] if len(data) > bi else ""
    # TODO: text = bullet.strip(); if empty print "EMPTY" and return.
    # TODO: collect codes in order: WEAK, NONUM, LONG.
    # TODO: print "PASS" if none, else the codes space-separated.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    w = int(data[1])
    weak = [data[2 + i].strip().lower() for i in range(w)]
    bi = 2 + w
    bullet = data[bi] if len(data) > bi else ""

    text = bullet.strip()
    if text == "":
        print("EMPTY")
        return

    codes = []
    low = text.lower()
    if any(low.startswith(op) for op in weak):
        codes.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        codes.append("NONUM")
    if len(text.split()) > m:
        codes.append("LONG")

    print(" ".join(codes) if codes else "PASS")

main()
`,
    challenge_test_cases: [
      { input: "8\n1\nresponsible for\nResponsible for the office supplies", expected_output: "WEAK NONUM", description: "Weak opener and no number." },
      { input: "8\n1\nresponsible for\nIncreased revenue 20% in Q3", expected_output: "PASS", description: "Strong, quantified, short enough." },
      { input: "4\n1\nhelped\nBuilt a fast reliable scalable analytics pipeline", expected_output: "NONUM LONG", description: "No number and over the word cap." },
      { input: "8\n1\nhelped\n   ", expected_output: "EMPTY", description: "Whitespace-only input short-circuits to EMPTY." },
    ],
  },

  {
    id: "prod-04-7",
    project_id: "prod-04",
    order: 7,
    title: "Batch and Budget",
    concept: "batching, dedup, and cost",
    explanation: `Nobody rewrites one bullet. You paste in a whole job's worth of tasks, fifteen, twenty lines, often with duplicates and blanks. This lesson turns your single-bullet tool into a **batch** tool that dedupes the input and estimates what the run will cost, so a big paste doesn't quietly become a big bill.

## Deduplicate before you spend

Every rewrite is an API call, and every call costs tokens. If your input has "Managed staff" three times (people repeat themselves), rewriting it three times is wasted money. Dedupe first, keeping the first occurrence and matching case-insensitively so "Managed staff" and "managed staff" collapse into one:

\`\`\`python
def dedupe(tasks):
    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(t.strip())
    return unique
\`\`\`

The \`seen\` set holds the lowercased keys; \`unique\` keeps the original text of the first time each appeared. Blank lines drop out for free because \`if key\` is False for an empty string.

## Estimate the cost before you run

Before firing off twenty calls, estimate the tokens. The rule of thumb is about four characters per token, so a whole batch's input cost is a sum of \`len(task) // 4\`:

\`\`\`python
def estimate_tokens(tasks):
    return sum(max(1, len(t) // 4) for t in tasks)
\`\`\`

This is deliberately rough, it ignores the system prompt and the output tokens, but it's enough to answer the only question that matters at this stage: is this a 200-token run or a 20,000-token run? A quick estimate lets your tool print "About N tokens, continue?" before spending anything, which is the difference between a tool people trust and one they're afraid to paste into.

## Why this is the "harden" step

A demo rewrites the one bullet you tested. A tool survives the messy real input: duplicates, blank lines, a paste of thirty tasks. Deduping and cost-estimating aren't glamorous, but they're what stop your tool from doing redundant work and handing someone a surprise bill. Cheap guards, big payoff.

## The mental model

Think of the batch as a shopping cart. Before checkout you remove the duplicate items and glance at the total. Dedupe trims the cart; the token estimate is the price tag you read before you swipe. Below you'll build both and produce a batch report.`,
    starter_code: `# Dedupe a batch of tasks (case-insensitive) and estimate token cost.

def process_batch(tasks):
    seen = set()
    unique = []
    # TODO: keep the first occurrence of each task (compare .strip().lower()),
    #       skipping blanks; store the stripped original text in 'unique'
    total = 0
    # TODO: sum max(1, len(t) // 4) over the unique tasks into 'total'
    return unique, total

tasks = ["Managed staff", "managed staff", "Led sales", "  "]
unique, total = process_batch(tasks)
print("Unique:", len(unique))
print("Tokens:", total)
`,
    solution_code: `# Dedupe a batch of tasks (case-insensitive) and estimate token cost.

def process_batch(tasks):
    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(t.strip())
    total = sum(max(1, len(t) // 4) for t in unique)
    return unique, total

tasks = ["Managed staff", "managed staff", "Led sales", "  "]
unique, total = process_batch(tasks)
print("Unique:", len(unique))
for t in unique:
    print(" -", t, "(~" + str(max(1, len(t) // 4)) + " tokens)")
print("Tokens:", total)
`,
    hints: [
      "Use a set of lowercased keys to detect duplicates, and a list to keep first-seen originals.",
      "An empty stripped string is falsy, so 'if key and key not in seen' skips blanks automatically.",
      "Token estimate per task is max(1, len(task) // 4); sum it over the unique tasks.",
    ],
    challenge_title: "Batch Cost Report",
    challenge_description: "Dedupe a batch of tasks case-insensitively, then report the unique count and the estimated token cost.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    tasks = [data[1 + i] for i in range(n)]
    # TODO: dedupe case-insensitively, keeping the first occurrence's text.
    # TODO: token cost per unique task = max(1, len(task) // 4).
    # TODO: print "Unique: <count>" then "Tokens: <total>".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    tasks = [data[1 + i] for i in range(n)]

    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key not in seen:
            seen.add(key)
            unique.append(t)

    total = sum(max(1, len(t) // 4) for t in unique)
    print(f"Unique: {len(unique)}")
    print(f"Tokens: {total}")

main()
`,
    challenge_test_cases: [
      { input: "3\nManaged staff\nmanaged staff\nLed sales", expected_output: "Unique: 2\nTokens: 5", description: "Case-insensitive duplicate collapses; tokens 3 + 2." },
      { input: "2\nBuilt the API\nBuilt the API", expected_output: "Unique: 1\nTokens: 3", description: "Exact duplicate removed." },
      { input: "1\nx", expected_output: "Unique: 1\nTokens: 1", description: "Tiny task still costs at least one token." },
    ],
  },

  {
    id: "prod-04-8",
    project_id: "prod-04",
    order: 8,
    title: "Ship the Booster",
    concept: "assembling and shipping",
    explanation: `Every piece exists: the rewrite prompt, the cleanup, the verb check, the number check, the length cap, the validator with retries, and batch handling with a cost estimate. Shipping is wiring them into one command and running it on a real list. When you finish, this build lands in your **Portfolio**.

## The whole pipeline, one function

Shipping isn't new code, it's the assembly. Read tasks, dedupe, rewrite each with retries, validate, and print a clean resume section:

\`\`\`python
def boost(tasks):
    unique = dedupe(tasks)
    print(f"Rewriting {len(unique)} tasks (~{estimate_tokens(unique)} tokens)...")
    bullets = []
    for task in unique:
        bullet = rewrite_valid(task)
        problems = validate(bullet, WEAK_OPENERS, MAX_WORDS)
        if problems:
            print(f"  [check] {task}: {', '.join(problems)}")
        bullets.append(bullet)
    print("\\nYOUR RESUME BULLETS")
    for b in bullets:
        print("- " + b)
    return bullets
\`\`\`

Read it top to bottom and you can see the loop from lesson 1 of the whole track: input (tasks), prompt+call (rewrite), parse (clean), verify (validate), ship (print). Every project in this track is that same skeleton with different middles.

## What "done" means here

Shipped doesn't mean deployed to the cloud. It means:

1. It runs from a clean start on a whole list, not just your one test task.
2. It handles the messy input, blanks, duplicates, a bullet that fails validation, without crashing.
3. Someone else could paste their tasks in and get usable bullets from your instructions alone.

If those three hold, it's a real deliverable, not a demo.

## It lands in your Portfolio

Finishing this final lesson records the build in your **Portfolio** tab: the title, what it does, and that you built it. That shelf, your summarizer, your chatbot, this bullet booster, is the actual point of the track. Keep a one-line description and one example (a raw task in, a strong bullet out) so the entry proves it works.

## Ship it well

Two finishing touches make it show: print the cost estimate before running so users aren't surprised, and flag any bullet that failed validation instead of hiding it, an honest "[check] add a number here" is more useful than a silently weak line. Below you'll assemble the final section: dedupe, drop blanks, and print the clean list.`,
    starter_code: `# Ship: assemble a clean resume section from final bullets.
# Drop blanks, dedupe case-insensitively, print a numbered-free bullet list.

def assemble(bullets):
    seen = set()
    kept = []
    # TODO: for each bullet: strip it; skip if empty; skip if its lowercase
    #       was already seen; otherwise keep the stripped text
    return kept

raw = ["Led the team", "", "led the team", "Cut costs 10%"]
kept = assemble(raw)
for b in kept:
    print("- " + b)
print("Bullets:", len(kept))
`,
    solution_code: `# Ship: assemble a clean resume section from final bullets.
# Drop blanks, dedupe case-insensitively, print a clean bullet list.

def assemble(bullets):
    seen = set()
    kept = []
    for b in bullets:
        t = b.strip()
        if t == "":
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        kept.append(t)
    return kept

raw = ["Led the team", "", "led the team", "Cut costs 10%"]
kept = assemble(raw)
print("YOUR RESUME BULLETS")
for b in kept:
    print("- " + b)
print("Bullets:", len(kept))
`,
    hints: [
      "Strip each bullet first; a stripped empty string means skip it.",
      "Track lowercased text in a set to drop case-insensitive duplicates.",
      "Keep the original stripped text (not the lowercase key) in your output list.",
    ],
    challenge_title: "Assemble the Resume Section",
    challenge_description: "Build the final bullet list: drop blank lines, remove case-insensitive duplicates, print each with a dash, then the count.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    raw = [data[1 + i] if 1 + i < len(data) else "" for i in range(n)]
    # TODO: drop blanks (after strip) and case-insensitive duplicates.
    # TODO: print each kept bullet as "- <bullet>", then "Bullets: <count>".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    raw = [data[1 + i] if 1 + i < len(data) else "" for i in range(n)]

    seen = set()
    kept = []
    for b in raw:
        t = b.strip()
        if t == "":
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        kept.append(t)

    for b in kept:
        print("- " + b)
    print(f"Bullets: {len(kept)}")

main()
`,
    challenge_test_cases: [
      { input: "4\nLed the team\n\nled the team\nCut costs 10%", expected_output: "- Led the team\n- Cut costs 10%\nBullets: 2", description: "Blank dropped, case-insensitive duplicate removed." },
      { input: "2\nBuilt the app\nBuilt the app", expected_output: "- Built the app\nBullets: 1", description: "Exact duplicate collapses to one." },
      { input: "1\n   ", expected_output: "Bullets: 0", description: "Only a blank line; nothing kept." },
    ],
  },
];

export default { project, lessons };
