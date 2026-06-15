export default {
  project: {
    id: "ai-03",
    title: "Prompt Engineering",
    description: "Stop guessing at prompts — learn the dials (system prompts, temperature, tokens, few-shot, structured output) that turn an LLM from a slot machine into a tool.",
    difficulty: "beginner",
    category: "ai_ml",
    estimated_time: 90,
    lessons_count: 5,
    tags: ["prompt-engineering", "llm", "claude", "system-prompts", "structured-output"],
    order: 3,
    cover_image: ""
  },
  lessons: [
    // ------------------------------------------------------------------
    // Lesson 1 — System Prompts
    // ------------------------------------------------------------------
    {
      id: "ai-03-l1",
      project_id: "ai-03",
      order: 1,
      title: "System Prompts: Setting the Stage",
      concept: "System Prompts",
      xp_reward: 10,
      explanation: `Same question, two different answers. Ask a model "what should I eat?" with no setup and you get a generic list. Ask it the same thing after telling it "You are a no-nonsense sports nutritionist talking to a marathoner two days before a race" and the answer changes completely. That setup is the **system prompt**.

## What a system prompt actually is

Most chat APIs split your input into two channels:

- **System prompt** — standing instructions. Who the model is, how it should behave, what rules it must follow. Set once, applies to the whole conversation.
- **User messages** — the actual back-and-forth.

Think of it like a job briefing you give a new hire before their first customer walks in. You don't re-explain the company values on every call. You say it once, up front, and it colors everything after.

## Where it goes in the API

With Claude's Messages API, the system prompt is its own top-level field — it is **not** another message in the list:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="You are a terse senior engineer. Answer in one sentence. No fluff.",
    messages=[{"role": "user", "content": "Should I use tabs or spaces?"}],
)
print(response.content[0].text)
\`\`\`

The \`system\` value steers tone, role, and constraints. The \`messages\` list carries the conversation.

## What to put in it

Good system prompts are concrete. Instead of "be helpful," try:

- A role: "You are a patient Python tutor for absolute beginners."
- A format rule: "Always answer with a numbered list of steps."
- A boundary: "If you don't know, say so. Never invent function names."

Don't dump everything in here. A system prompt that's three pages long competes with itself — the model can't follow ten priorities at once. Pick the few rules that matter and state them plainly.

## Why it matters

The system prompt is your cheapest, highest-leverage control. Before you reach for fancier techniques, get this right. Half the "the model won't behave" problems people have are really "I never told it how to behave" problems.`,
      key_terms: [
        { term: "System prompt", definition: "Standing instructions sent once that define the model's role, tone, and rules for the whole conversation." },
        { term: "User message", definition: "An individual turn in the conversation — the actual question or input from the person." },
        { term: "Role", definition: "The persona you assign the model (e.g. 'patient tutor', 'terse engineer') to shape how it responds." }
      ],
      callouts: [
        { type: "analogy", title: "The job briefing", content: "A system prompt is the briefing you give a new hire before their first shift. You explain the role and rules once — you don't repeat them on every customer call.", position: "before" },
        { type: "tip", title: "Short beats long", content: "A focused 3-line system prompt usually outperforms a sprawling one. Too many competing rules and the model can't honor all of them.", position: "after" }
      ],
      concept_diagram: {
        title: "How a request is assembled",
        steps: [
          { label: "System prompt", desc: "Role + rules, set once" },
          { label: "User message", desc: "The actual question" },
          { label: "Model reads both", desc: "Rules color the answer" },
          { label: "Response", desc: "Shaped by the system prompt" }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the main job of a system prompt?",
          options: [
            "To define the model's role, tone, and rules for the whole conversation",
            "To store the conversation history so the model remembers it",
            "To set the maximum number of tokens the model can output"
          ],
          correct_index: 0,
          explanation: "The system prompt is standing instructions — who the model is and how it should behave. It's not history storage or a token limit."
        }
      ],
      quiz_questions: [
        {
          question: "In Claude's Messages API, where does the system prompt go?",
          options: [
            "As a top-level `system` field, separate from the messages list",
            "As the first item in the `messages` list with role 'system'",
            "Appended to the end of the user's message",
            "In a separate API call made before the main one"
          ],
          correct_index: 0,
          explanation: "Claude's Messages API takes `system` as its own top-level parameter, distinct from the `messages` array."
        },
        {
          question: "Which of these is the strongest system prompt instruction?",
          options: [
            "You are a patient Python tutor for beginners. Explain each step and avoid jargon.",
            "Be helpful and nice.",
            "Do a good job answering questions.",
            "Try your best to be useful to the user."
          ],
          correct_index: 0,
          explanation: "Concrete role + concrete behavior beats vague encouragement. 'Be helpful' gives the model nothing specific to act on."
        },
        {
          question: "Why can a very long, multi-page system prompt backfire?",
          options: [
            "Too many competing rules make it hard for the model to honor all of them",
            "The API rejects system prompts longer than one line",
            "Long system prompts are billed at a higher rate per word",
            "The model ignores the system prompt entirely if it's over 100 words"
          ],
          correct_index: 0,
          explanation: "When a system prompt stacks ten priorities, the model can't satisfy them all. Focus on the few rules that matter."
        }
      ],
      participation_activities: [
        {
          activity_title: "System prompt basics",
          questions: [
            { question: "The system prompt usually only needs to be sent once for a whole conversation, not repeated on every turn.", type: "true_false", correct_answer: "true", explanation: "It's standing context — set it once and it applies throughout the conversation." },
            { question: "The API field that carries the model's standing instructions in Claude's Messages API is called the ____ prompt.", type: "fill_in", correct_answer: "system", explanation: "The `system` field holds the role and rules." }
          ]
        }
      ],
      starter_code: `import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# TODO: write a system prompt that makes the model answer
# like a pirate, in one short sentence.
system_prompt = ""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    system=system_prompt,
    messages=[{"role": "user", "content": "What is the weather like?"}],
)
print(response.content[0].text)`,
      solution_code: `import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

system_prompt = "You are a pirate. Answer in one short sentence, full of pirate slang."

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    system=system_prompt,
    messages=[{"role": "user", "content": "What is the weather like?"}],
)
print(response.content[0].text)
print("System prompt set:", system_prompt != "")`,
      expected_output: `Arrr, the skies be clear and the winds be fair, matey!
System prompt set: True`,
      hints: [
        "The system prompt is a plain string — describe the role and any format rule.",
        "Mention both the persona (pirate) and the length constraint (one short sentence).",
        "Set `system_prompt` to something like 'You are a pirate. Answer in one short sentence...'."
      ],
      challenge_title: "Build a strict JSON-only assistant prompt",
      challenge_description: "Write a function that returns a system prompt string instructing the model to behave as a customer-support bot that ALWAYS replies in valid JSON with the keys 'reply' and 'sentiment'. The function takes the company name and embeds it in the prompt.",
      challenge_starter_code: `def support_system_prompt(company):
    # TODO: return a system prompt string that names the company
    # and demands JSON output with keys "reply" and "sentiment".
    return ""

print(support_system_prompt("Acme"))`,
      challenge_solution_code: `def support_system_prompt(company):
    return (
        f"You are a customer-support assistant for {company}. "
        "Always respond with valid JSON containing exactly two keys: "
        "'reply' (your message to the customer) and "
        "'sentiment' (one of 'positive', 'neutral', 'negative')."
    )

print(support_system_prompt("Acme"))`,
      challenge_test_cases: [
        { input: "support_system_prompt(\"Acme\")", expected_output: "You are a customer-support assistant for Acme. Always respond with valid JSON containing exactly two keys: 'reply' (your message to the customer) and 'sentiment' (one of 'positive', 'neutral', 'negative').", description: "Company name is embedded and JSON keys are specified." },
        { input: "support_system_prompt(\"Globex\")", expected_output: "You are a customer-support assistant for Globex. Always respond with valid JSON containing exactly two keys: 'reply' (your message to the customer) and 'sentiment' (one of 'positive', 'neutral', 'negative').", description: "Works with a different company name." }
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 2 — Tokens
    // ------------------------------------------------------------------
    {
      id: "ai-03-l2",
      project_id: "ai-03",
      order: 2,
      title: "Tokens: How Models Read and Bill",
      concept: "Tokens",
      xp_reward: 10,
      explanation: `Models don't read words. They read **tokens** — chunks of text that are usually a few characters long. "cat" is one token. "unbelievable" might be three ("un", "believ", "able"). A space is often glued to the front of the next token. This sounds like trivia until you realize tokens are how you get billed and how the model's memory limit is measured.

## A rough rule of thumb

For typical English, **1 token ≈ 4 characters ≈ 0.75 words**. So 1,000 tokens is roughly 750 words, about a page and a half. Don't memorize exact splits — you'll look them up or count them with a tool. Just internalize the rough conversion so you can sanity-check costs.

\`\`\`python
text = "Tokens are chunks of text."
# Rough estimate: characters / 4
estimate = len(text) // 4
print("Characters:", len(text))
print("Rough token estimate:", estimate)
\`\`\`

## Two limits you'll hit

1. **Context window** — the total tokens the model can consider at once: your system prompt + all messages + the response. Big models hold a lot, but it's still finite. Stuff too much in and the oldest content falls off or the call errors.
2. **max_tokens** — a cap *you* set on how long the response can be. It does not control the input. If you set \`max_tokens=50\` and ask for an essay, you get a sentence and a half, cut off mid-thought.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=50,  # the OUTPUT cap, not the input
    messages=[{"role": "user", "content": "Explain recursion."}],
)
print(response.content[0].text)
\`\`\`

## Why you care

- **Cost.** You pay per token, usually at different rates for input and output. A bloated system prompt repeated across thousands of calls adds up fast.
- **Truncation.** Set \`max_tokens\` too low and answers get chopped. Too high and you waste headroom (though you're only billed for what's actually generated).
- **Limits.** Long documents can blow the context window. That's when you start chunking or summarizing.

Tokens are the unit everything in LLM-land is priced and measured in. Get a feel for them and the rest of prompt engineering gets less mysterious.`,
      key_terms: [
        { term: "Token", definition: "A chunk of text (often a few characters) that the model reads and generates; the unit used for billing and limits." },
        { term: "Context window", definition: "The maximum total tokens — input plus output — the model can handle in a single request." },
        { term: "max_tokens", definition: "A cap you set on how many tokens the model is allowed to generate in its response." }
      ],
      callouts: [
        { type: "analogy", title: "Tokens are syllables, not words", content: "The model reads in chunks closer to syllables than whole words. 'cat' is one chunk; 'unbelievable' might be three.", position: "before" },
        { type: "warning", title: "max_tokens caps output, not input", content: "Setting max_tokens=50 won't shrink your prompt — it just chops the answer. If responses get cut off mid-sentence, raise it.", position: "after" }
      ],
      concept_diagram: {
        title: "What fills the context window",
        steps: [
          { label: "System prompt", desc: "Counts as input tokens" },
          { label: "Conversation", desc: "All messages count too" },
          { label: "Response", desc: "Capped by max_tokens" },
          { label: "Total ≤ window", desc: "Everything must fit" }
        ]
      },
      inline_quizzes: [
        {
          question: "Roughly how many words is 1,000 tokens of typical English?",
          options: [
            "About 750 words",
            "Exactly 1,000 words",
            "About 4,000 words"
          ],
          correct_index: 0,
          explanation: "The rough rule is 1 token ≈ 0.75 words, so 1,000 tokens is around 750 words — a page and a half."
        }
      ],
      quiz_questions: [
        {
          question: "What does the `max_tokens` parameter control?",
          options: [
            "The maximum length of the model's response",
            "The maximum length of your input prompt",
            "The total size of the context window",
            "How fast the model responds"
          ],
          correct_index: 0,
          explanation: "`max_tokens` caps only the generated output. It does not limit or shrink the input you send."
        },
        {
          question: "Your responses keep getting cut off in the middle of a sentence. What's the most likely fix?",
          options: [
            "Increase max_tokens so the model has room to finish",
            "Shorten your system prompt",
            "Switch to a model with a smaller context window",
            "Lower the temperature to 0"
          ],
          correct_index: 0,
          explanation: "Mid-sentence cutoffs are the classic sign of hitting the output cap. Raise max_tokens."
        },
        {
          question: "Why does a bloated system prompt matter for cost?",
          options: [
            "It's counted as input tokens on every single call, so it adds up across many requests",
            "It permanently increases the model's per-token price",
            "It makes the model respond more slowly forever",
            "It reduces the context window size of the model"
          ],
          correct_index: 0,
          explanation: "The system prompt is re-sent (and re-billed as input) on each call. Across thousands of calls, extra tokens are real money."
        }
      ],
      participation_activities: [
        {
          activity_title: "Token intuition",
          questions: [
            { question: "Setting max_tokens to a small number will shorten the prompt you send to the model.", type: "true_false", correct_answer: "false", explanation: "max_tokens only limits the output; it has no effect on the input." },
            { question: "The total amount of text — input plus output — a model can handle at once is called its context ____.", type: "fill_in", correct_answer: "window", explanation: "The context window is the full input + output budget." }
          ]
        }
      ],
      starter_code: `def estimate_tokens(text):
    # Rough rule: about 1 token per 4 characters.
    # TODO: return an integer estimate of the token count.
    return 0

sample = "Tokens are how models read and bill text."
print("Characters:", len(sample))
print("Estimated tokens:", estimate_tokens(sample))`,
      solution_code: `def estimate_tokens(text):
    # Rough rule: about 1 token per 4 characters.
    return len(text) // 4

sample = "Tokens are how models read and bill text."
print("Characters:", len(sample))
print("Estimated tokens:", estimate_tokens(sample))`,
      expected_output: `Characters: 41
Estimated tokens: 10`,
      hints: [
        "Use len(text) to get the character count.",
        "Divide by 4 for the rough rule. Use integer division // to keep it a whole number.",
        "Return len(text) // 4."
      ],
      challenge_title: "Estimate the cost of a prompt",
      challenge_description: "Write a function that estimates the input cost of a prompt. Given the text and a price per 1,000 tokens (in dollars), estimate tokens at 1 per 4 characters and return the cost rounded to 6 decimal places.",
      challenge_starter_code: `def estimate_cost(text, price_per_1k):
    # TODO: estimate tokens (1 per 4 chars), then compute cost.
    # cost = (tokens / 1000) * price_per_1k, rounded to 6 places.
    return 0.0

print(estimate_cost("hello world this is a test", 3.0))`,
      challenge_solution_code: `def estimate_cost(text, price_per_1k):
    tokens = len(text) // 4
    cost = (tokens / 1000) * price_per_1k
    return round(cost, 6)

print(estimate_cost("hello world this is a test", 3.0))`,
      challenge_test_cases: [
        { input: "estimate_cost(\"hello world this is a test\", 3.0)", expected_output: "0.018", description: "26 chars -> 6 tokens -> (6/1000)*3.0 = 0.018." },
        { input: "estimate_cost(\"\", 3.0)", expected_output: "0.0", description: "Empty text means zero tokens and zero cost." }
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 3 — Temperature
    // ------------------------------------------------------------------
    {
      id: "ai-03-l3",
      project_id: "ai-03",
      order: 3,
      title: "Temperature: Tuning Randomness",
      concept: "Temperature",
      xp_reward: 10,
      explanation: `Ask a model to "name a fruit" ten times at temperature 0 and you'll likely get "apple" ten times. Crank the temperature up and you'll start seeing "dragonfruit," "kumquat," "persimmon." **Temperature** is the dial that controls how adventurous the model gets when picking its next token.

## What's actually happening

At each step the model has a ranked list of likely next tokens with probabilities attached. Temperature reshapes that list before the model picks:

- **Low temperature (near 0)** — sharpen toward the top choice. The model almost always grabs the most likely token. Output is focused, repeatable, predictable.
- **High temperature (toward 1)** — flatten the odds. Lower-ranked tokens get a real shot. Output is varied, surprising, sometimes off the rails.

Temperature usually runs from 0 to 1 (some APIs allow higher). It is NOT a "creativity score" you turn up for better writing — it's a randomness knob, and more randomness is not always better.

## When to use which

| Goal | Temperature |
|------|-------------|
| Extracting data, classification, math | 0 — you want the same right answer every time |
| Summaries, straightforward Q&A | 0 to 0.3 — mostly stable, a little flexibility |
| Brainstorming, names, varied phrasings | 0.7 to 1.0 — you want range |

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=20,
    temperature=0,  # deterministic-leaning: same prompt, similar answer
    messages=[{"role": "user", "content": "Name one primary color."}],
)
print(response.content[0].text)
\`\`\`

## The trap

People reach for high temperature when they're unhappy with output, hoping randomness fixes it. Usually the real fix is a clearer prompt. If you need a *correct* answer, low temperature plus a good prompt beats high temperature every time. Save the high settings for when you genuinely want variety, like generating ten different headline options.

One more note: even at temperature 0, outputs aren't guaranteed byte-for-byte identical across runs. Low temperature reduces randomness; it doesn't promise perfect determinism.`,
      key_terms: [
        { term: "Temperature", definition: "A setting (typically 0–1) that controls how random the model's token choices are — low is focused, high is varied." },
        { term: "Deterministic", definition: "Producing the same or very similar output for the same input; low temperature pushes toward this." },
        { term: "Token probability", definition: "The likelihood the model assigns to each possible next token; temperature reshapes these before selection." }
      ],
      callouts: [
        { type: "analogy", title: "A risk dial, not a quality dial", content: "Temperature is like a chef's willingness to improvise. Low = follows the recipe exactly. High = throws in surprise ingredients. Neither is 'better' — it depends on the dish.", position: "before" },
        { type: "insight", title: "Randomness rarely fixes wrong", content: "If answers are wrong, raising temperature just makes them wrong in more creative ways. Fix the prompt first; reach for temperature only when you actually want variety.", position: "after" }
      ],
      concept_diagram: {
        title: "Temperature reshapes the choices",
        steps: [
          { label: "Model ranks tokens", desc: "Each gets a probability" },
          { label: "Apply temperature", desc: "Low sharpens, high flattens" },
          { label: "Sample a token", desc: "Pick from the reshaped odds" },
          { label: "Repeat", desc: "Token by token to the answer" }
        ]
      },
      inline_quizzes: [
        {
          question: "You're building a tool that extracts dates from invoices and needs the same answer every time. What temperature?",
          options: [
            "0 — you want focused, repeatable output",
            "1 — you want maximum variety",
            "0.7 — a balanced creative setting"
          ],
          correct_index: 0,
          explanation: "Data extraction needs consistency, not variety. Temperature 0 keeps the model on the most likely (correct) answer."
        }
      ],
      quiz_questions: [
        {
          question: "What does raising the temperature do?",
          options: [
            "Makes the model more likely to pick lower-ranked, varied tokens",
            "Makes the model respond faster",
            "Increases the maximum length of the response",
            "Forces the model to always pick the single most likely token"
          ],
          correct_index: 0,
          explanation: "Higher temperature flattens the probability distribution, giving less-likely tokens a real chance — more variety."
        },
        {
          question: "Which task is the BEST fit for a high temperature (around 0.9)?",
          options: [
            "Brainstorming ten different product name ideas",
            "Classifying an email as spam or not spam",
            "Extracting a phone number from text",
            "Solving an arithmetic problem"
          ],
          correct_index: 0,
          explanation: "Brainstorming benefits from variety. The other three need one consistent, correct answer — low temperature."
        },
        {
          question: "A teammate says 'the answers are wrong, let's crank temperature to 1.' Why is this usually a mistake?",
          options: [
            "Randomness doesn't fix correctness — it just makes wrong answers more varied; fix the prompt instead",
            "Temperature 1 is not allowed by any API",
            "High temperature permanently corrupts the model",
            "Temperature only affects speed, not the answer"
          ],
          correct_index: 0,
          explanation: "If output is wrong, the issue is usually the prompt. More randomness produces creatively-wrong answers, not correct ones."
        }
      ],
      participation_activities: [
        {
          activity_title: "Reading the dial",
          questions: [
            { question: "Temperature 0 guarantees the exact same output byte-for-byte on every single run.", type: "true_false", correct_answer: "false", explanation: "Low temperature strongly reduces randomness but does not guarantee perfect determinism." },
            { question: "For tasks where you want varied, surprising output, you should use a ____ temperature.", type: "fill_in", correct_answer: "high", explanation: "High temperature flattens the odds and produces more variety." }
          ]
        }
      ],
      starter_code: `def recommend_temperature(task):
    # Return a temperature for the task.
    # "extraction" or "classification" -> 0.0
    # "brainstorm" -> 0.9
    # anything else -> 0.3
    # TODO: implement the logic.
    return 0.3

print(recommend_temperature("extraction"))
print(recommend_temperature("brainstorm"))
print(recommend_temperature("summary"))`,
      solution_code: `def recommend_temperature(task):
    if task in ("extraction", "classification"):
        return 0.0
    if task == "brainstorm":
        return 0.9
    return 0.3

print(recommend_temperature("extraction"))
print(recommend_temperature("brainstorm"))
print(recommend_temperature("summary"))`,
      expected_output: `0.0
0.9
0.3`,
      hints: [
        "Check for the deterministic tasks first: 'extraction' and 'classification' return 0.0.",
        "Handle 'brainstorm' returning 0.9 as a separate case.",
        "Everything else falls through to the default 0.3."
      ],
      challenge_title: "Pick a temperature with reasoning",
      challenge_description: "Write a function that returns a tuple of (temperature, reason) for a given task name. Extraction/classification -> (0.0, 'needs consistent output'). Brainstorm/creative -> (0.9, 'wants variety'). Everything else -> (0.4, 'balanced').",
      challenge_starter_code: `def temp_with_reason(task):
    # TODO: return (temperature, reason) based on the task.
    return (0.4, "balanced")

print(temp_with_reason("classification"))
print(temp_with_reason("creative"))
print(temp_with_reason("qa"))`,
      challenge_solution_code: `def temp_with_reason(task):
    if task in ("extraction", "classification"):
        return (0.0, "needs consistent output")
    if task in ("brainstorm", "creative"):
        return (0.9, "wants variety")
    return (0.4, "balanced")

print(temp_with_reason("classification"))
print(temp_with_reason("creative"))
print(temp_with_reason("qa"))`,
      challenge_test_cases: [
        { input: "temp_with_reason(\"classification\")", expected_output: "(0.0, 'needs consistent output')", description: "Deterministic task returns 0.0 with reasoning." },
        { input: "temp_with_reason(\"creative\")", expected_output: "(0.9, 'wants variety')", description: "Creative task returns 0.9 with reasoning." }
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 4 — Few-Shot Prompting
    // ------------------------------------------------------------------
    {
      id: "ai-03-l4",
      project_id: "ai-03",
      order: 4,
      title: "Few-Shot Prompting: Teaching by Example",
      concept: "Few-Shot",
      xp_reward: 10,
      explanation: `Telling a model "classify the sentiment" works okay. *Showing* it three labeled examples first works a lot better. That's **few-shot prompting**: you give the model a handful of input-output examples right in the prompt, then ask it to handle a new case the same way.

## Zero-shot vs few-shot

- **Zero-shot** — you describe the task and hope the model figures out the exact format and edge cases. "Translate this to French."
- **Few-shot** — you include examples that pin down format, tone, and edge handling. The model pattern-matches off them.

The model isn't being retrained. It's just reading your examples as context and copying the pattern. This is one of the most reliable ways to get consistent output without touching any model internals.

## What it looks like

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

prompt = (
    "Classify sentiment as POSITIVE or NEGATIVE.\\n\\n"
    "Review: The food was cold and late. -> NEGATIVE\\n"
    "Review: Absolutely loved every bite! -> POSITIVE\\n"
    "Review: Worst service I have had. -> NEGATIVE\\n"
    "Review: Cozy spot, great coffee. ->"
)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=10,
    messages=[{"role": "user", "content": prompt}],
)
print(response.content[0].text)
\`\`\`

Those three examples do the heavy lifting. The model sees the \`Review: ... -> LABEL\` pattern and continues it.

## Tips that actually matter

- **Show the exact format you want.** If you need uppercase labels, your examples should use uppercase labels. The model copies what it sees.
- **Cover the edge cases.** If neutral reviews are tricky, include a neutral example so the model knows how you want them handled.
- **Two to five examples is the sweet spot** for most tasks. One is rarely enough; twenty wastes tokens and rarely helps more than five.
- **Keep examples consistent.** If half use "->" and half use ":", the model gets confused about the format.

## Why bother

Few-shot is the bridge between "describe it and pray" and full-on fine-tuning. It costs you some tokens but gives you control over format and behavior with zero training. When a zero-shot prompt is *almost* right but the format keeps drifting, examples are usually the fastest fix.`,
      key_terms: [
        { term: "Few-shot prompting", definition: "Including several input-output examples in the prompt so the model copies the pattern on a new input." },
        { term: "Zero-shot prompting", definition: "Describing the task with no examples and relying on the model to infer the format and behavior." },
        { term: "Pattern matching", definition: "How the model uses the examples — it continues the demonstrated input→output pattern rather than learning anything new." }
      ],
      callouts: [
        { type: "analogy", title: "Show, don't just tell", content: "Few-shot is like training a new barista by making three drinks in front of them, not just reading the recipe aloud. Examples lock in the format faster than description.", position: "before" },
        { type: "tip", title: "Match your examples to your target format", content: "The model copies exactly what it sees. Want uppercase labels and a '->' separator? Use those in every example.", position: "after" }
      ],
      concept_diagram: {
        title: "Anatomy of a few-shot prompt",
        steps: [
          { label: "Task line", desc: "Brief instruction up top" },
          { label: "Example 1–3", desc: "Input -> desired output" },
          { label: "New input", desc: "Same format, left open" },
          { label: "Model continues", desc: "Copies the pattern" }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the model actually doing with your few-shot examples?",
          options: [
            "Reading them as context and copying the demonstrated pattern",
            "Permanently retraining its weights on them",
            "Saving them to a database for later use"
          ],
          correct_index: 0,
          explanation: "No weights change. The model just pattern-matches off the examples sitting in its context."
        }
      ],
      quiz_questions: [
        {
          question: "What is the key difference between zero-shot and few-shot prompting?",
          options: [
            "Few-shot includes example input-output pairs; zero-shot includes none",
            "Few-shot uses a higher temperature than zero-shot",
            "Zero-shot retrains the model while few-shot does not",
            "Few-shot only works for translation tasks"
          ],
          correct_index: 0,
          explanation: "Few-shot's defining feature is the examples in the prompt. Zero-shot describes the task with no examples."
        },
        {
          question: "Your few-shot labels keep coming out in inconsistent capitalization. What's the most likely cause?",
          options: [
            "Your examples don't use a consistent capitalization, so the model copies the inconsistency",
            "You used too few tokens",
            "The temperature is set to 0",
            "Few-shot prompting can't control capitalization"
          ],
          correct_index: 0,
          explanation: "The model mirrors your examples. Inconsistent examples produce inconsistent output — make the examples uniform."
        },
        {
          question: "Roughly how many examples is the sweet spot for most few-shot tasks?",
          options: [
            "Two to five",
            "Exactly one",
            "Twenty or more",
            "Zero — examples don't help"
          ],
          correct_index: 0,
          explanation: "Two to five usually nails the pattern. One is often too few; twenty wastes tokens for little gain."
        }
      ],
      participation_activities: [
        {
          activity_title: "Few-shot fundamentals",
          questions: [
            { question: "Few-shot prompting changes the model's underlying weights.", type: "true_false", correct_answer: "false", explanation: "It only adds examples to the context; no training or weight change happens." },
            { question: "A prompt that includes example input-output pairs is called a ____-shot prompt.", type: "fill_in", correct_answer: "few", explanation: "Few-shot means several examples are shown before the new input." }
          ]
        }
      ],
      starter_code: `def build_few_shot(new_input):
    examples = [
        ("The food was cold.", "NEGATIVE"),
        ("Loved every bite!", "POSITIVE"),
    ]
    prompt = "Classify sentiment as POSITIVE or NEGATIVE.\\n\\n"
    # TODO: add each example as "Review: <text> -> <label>\\n"
    # then add the new input as "Review: <new_input> ->"
    return prompt

print(build_few_shot("Great coffee here."))`,
      solution_code: `def build_few_shot(new_input):
    examples = [
        ("The food was cold.", "NEGATIVE"),
        ("Loved every bite!", "POSITIVE"),
    ]
    prompt = "Classify sentiment as POSITIVE or NEGATIVE.\\n\\n"
    for text, label in examples:
        prompt += f"Review: {text} -> {label}\\n"
    prompt += f"Review: {new_input} ->"
    return prompt

print(build_few_shot("Great coffee here."))`,
      expected_output: `Classify sentiment as POSITIVE or NEGATIVE.

Review: The food was cold. -> NEGATIVE
Review: Loved every bite! -> POSITIVE
Review: Great coffee here. ->`,
      hints: [
        "Loop over the examples list, unpacking each tuple into text and label.",
        "Use an f-string: f\"Review: {text} -> {label}\\n\" for each example.",
        "After the loop, append the new input line ending in '->' with no label."
      ],
      challenge_title: "Generic few-shot builder",
      challenge_description: "Write a function that builds a few-shot prompt from a task instruction, a list of (input, output) example tuples, and a new input. Format each example as '<input> => <output>' on its own line, and end with '<new_input> =>'.",
      challenge_starter_code: `def few_shot(instruction, examples, new_input):
    # TODO: build the prompt. Start with instruction + two newlines,
    # then each example as "<input> => <output>\\n",
    # then "<new_input> =>".
    return ""

ex = [("hi", "hello"), ("bye", "goodbye")]
print(few_shot("Make it formal.", ex, "yo"))`,
      challenge_solution_code: `def few_shot(instruction, examples, new_input):
    prompt = instruction + "\\n\\n"
    for inp, out in examples:
        prompt += f"{inp} => {out}\\n"
    prompt += f"{new_input} =>"
    return prompt

ex = [("hi", "hello"), ("bye", "goodbye")]
print(few_shot("Make it formal.", ex, "yo"))`,
      challenge_test_cases: [
        { input: "few_shot(\"Make it formal.\", [(\"hi\", \"hello\"), (\"bye\", \"goodbye\")], \"yo\")", expected_output: "Make it formal.\n\nhi => hello\nbye => goodbye\nyo =>", description: "Two examples plus the open new input." },
        { input: "few_shot(\"Translate.\", [(\"cat\", \"chat\")], \"dog\")", expected_output: "Translate.\n\ncat => chat\ndog =>", description: "Works with a single example." }
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 5 — Structured Output
    // ------------------------------------------------------------------
    {
      id: "ai-03-l5",
      project_id: "ai-03",
      order: 5,
      title: "Structured Output: Getting JSON You Can Use",
      concept: "Structured Output",
      xp_reward: 10,
      explanation: `A model that replies "Sure! The customer seems happy, sentiment is positive 😊" is useless to your code. Your program can't reliably pull "positive" out of that sentence. What you want is \`{"sentiment": "positive"}\` — clean, parseable, predictable. Getting that consistently is **structured output**, and it's where prompt engineering meets real software.

## Why plain prose breaks your code

When a model answers in free-form text, every response is shaped a little differently. Parsing it means brittle string-hunting that falls apart the moment the phrasing shifts. Structured output flips this: you tell the model the exact shape you want, and you get back something \`json.loads()\` can swallow.

## Asking for JSON

The simplest approach is to just demand it clearly, ideally with an example of the shape:

\`\`\`python
import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

prompt = (
    "Extract the name and age from the text. "
    "Respond with ONLY valid JSON like "
    '{"name": "...", "age": 0} and nothing else.\\n\\n'
    "Text: Maria is 34 years old."
)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    messages=[{"role": "user", "content": prompt}],
)

raw = response.content[0].text
data = json.loads(raw)
print(data["name"], "is", data["age"])
\`\`\`

The two things that make this reliable: **"ONLY valid JSON"** and **showing the exact shape**. Models love to add a friendly preamble ("Here's the JSON:") — telling it to output nothing else heads that off.

## Making it sturdier

- **Show the schema.** A literal example of the keys and value types beats a description every time.
- **Be strict about extras.** "No markdown, no code fences, no explanation" prevents the model from wrapping JSON in \`\`\`json fences that break \`json.loads()\`.
- **Parse defensively.** Even good prompts occasionally slip. Wrap \`json.loads()\` in a try/except so one malformed response doesn't crash your pipeline.

\`\`\`python
import json

def safe_parse(text, default=None):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return default
\`\`\`

## The payoff

Structured output is what lets an LLM live inside a real app instead of just a chat box. Sentiment that becomes a database column, extracted fields that flow into a form, classifications that trigger logic — all of it depends on output your code can trust. Nail the prompt, parse defensively, and the model becomes a dependable component instead of a wildcard.`,
      key_terms: [
        { term: "Structured output", definition: "Model output in a fixed, machine-readable shape (commonly JSON) that your code can parse reliably." },
        { term: "JSON", definition: "A lightweight text format of keys and values that programs parse easily; the most common target for structured LLM output." },
        { term: "Defensive parsing", definition: "Wrapping parse calls in error handling so a single malformed response doesn't crash your program." }
      ],
      callouts: [
        { type: "analogy", title: "A form, not a conversation", content: "Free-form prose is like an open-ended interview; structured output is like a fill-in-the-blank form. Forms are boring — and that's exactly why your code can trust them.", position: "before" },
        { type: "warning", title: "Watch for code fences", content: "Models often wrap JSON in ```json fences, which break json.loads(). Tell the model 'no markdown, no fences' and still parse defensively.", position: "after" }
      ],
      concept_diagram: {
        title: "From prompt to usable data",
        steps: [
          { label: "Specify the shape", desc: "Show exact JSON keys" },
          { label: "Demand JSON only", desc: "No preamble, no fences" },
          { label: "Model returns JSON", desc: "Matches your schema" },
          { label: "Parse defensively", desc: "json.loads in try/except" }
        ]
      },
      inline_quizzes: [
        {
          question: "Why is free-form prose a bad output format for code to consume?",
          options: [
            "Each response is shaped differently, so parsing it is brittle and error-prone",
            "Prose costs more tokens than JSON always",
            "Models can't produce prose accurately"
          ],
          correct_index: 0,
          explanation: "Prose varies from response to response, so any string-hunting parser breaks when the phrasing shifts. JSON gives a stable shape."
        }
      ],
      quiz_questions: [
        {
          question: "Which two prompt instructions most improve JSON reliability?",
          options: [
            "Saying 'ONLY valid JSON' and showing the exact shape you want",
            "Raising temperature and increasing max_tokens",
            "Using a longer system prompt and a higher token limit",
            "Asking politely and adding more examples of prose"
          ],
          correct_index: 0,
          explanation: "Demanding JSON-only output and providing a literal schema example are the two highest-impact moves."
        },
        {
          question: "Why wrap `json.loads()` in a try/except even with a good prompt?",
          options: [
            "Models occasionally slip and return malformed JSON; defensive parsing keeps one bad response from crashing the pipeline",
            "try/except makes the model respond faster",
            "It forces the model to always return valid JSON",
            "It increases the context window"
          ],
          correct_index: 0,
          explanation: "No prompt is perfect 100% of the time. Catching parse errors lets your program handle the rare bad response gracefully."
        },
        {
          question: "A model keeps wrapping its JSON in ```json ... ``` fences, breaking your parser. What's the fix?",
          options: [
            "Instruct the model to output no markdown or code fences, and strip/parse defensively",
            "Lower the temperature to 0 and try again with no other change",
            "Switch to free-form prose output",
            "Increase max_tokens so the fences fit"
          ],
          correct_index: 0,
          explanation: "Explicitly forbidding markdown and fences usually stops it; combine with defensive parsing for the stragglers."
        }
      ],
      participation_activities: [
        {
          activity_title: "Structured output checks",
          questions: [
            { question: "Showing the model a literal example of the JSON shape works better than just describing the fields in words.", type: "true_false", correct_answer: "true", explanation: "A concrete schema example is the most reliable way to pin down the output shape." },
            { question: "The Python function commonly used to turn a JSON string into a usable object is json.____ .", type: "fill_in", correct_answer: "loads", explanation: "json.loads() parses a JSON string into Python objects." }
          ]
        }
      ],
      starter_code: `import json

def safe_parse(text, default=None):
    # TODO: try to parse text as JSON.
    # On failure (json.JSONDecodeError), return default.
    return default

print(safe_parse('{"sentiment": "positive"}'))
print(safe_parse('not json at all', default={}))`,
      solution_code: `import json

def safe_parse(text, default=None):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return default

print(safe_parse('{"sentiment": "positive"}'))
print(safe_parse('not json at all', default={}))`,
      expected_output: `{'sentiment': 'positive'}
{}`,
      hints: [
        "Use a try block around json.loads(text).",
        "Catch json.JSONDecodeError specifically and return default in that case.",
        "Valid JSON returns a Python dict; invalid input returns whatever default you passed."
      ],
      challenge_title: "Clean and parse fenced JSON",
      challenge_description: "Models sometimes wrap JSON in ```json fences. Write a function that strips leading/trailing markdown code fences (```json and ```), then parses the JSON. Return the parsed object, or None if parsing fails.",
      challenge_starter_code: `import json

def parse_fenced_json(text):
    # TODO: strip the json code fences if present, then json.loads.
    # Return None on failure.
    return None

print(parse_fenced_json('\`\`\`json\\n{"ok": true}\\n\`\`\`'))
print(parse_fenced_json('{"plain": 1}'))
print(parse_fenced_json('broken'))`,
      challenge_solution_code: `import json

def parse_fenced_json(text):
    cleaned = text.strip()
    if cleaned.startswith("\`\`\`"):
        # Drop the first line (e.g. \`\`\`json) and a trailing fence.
        lines = cleaned.split("\\n")
        if lines[0].startswith("\`\`\`"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "\`\`\`":
            lines = lines[:-1]
        cleaned = "\\n".join(lines).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None

print(parse_fenced_json('\`\`\`json\\n{"ok": true}\\n\`\`\`'))
print(parse_fenced_json('{"plain": 1}'))
print(parse_fenced_json('broken'))`,
      challenge_test_cases: [
        { input: "parse_fenced_json('```json\\n{\"ok\": true}\\n```')", expected_output: "{'ok': True}", description: "Strips json fences and parses the object." },
        { input: "parse_fenced_json('broken')", expected_output: "None", description: "Unparseable input returns None." }
      ]
    }
  ]
};
