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
      explanation: `Same question, two different answers. Ask a model "what should I eat?" with no setup and you get a generic list. Ask it the same thing after telling it "You are a no-nonsense sports nutritionist talking to a marathoner two days before a race" and the answer changes completely. That setup is the **system prompt** — the single highest-leverage line of text in all of prompt engineering.

## What a system prompt actually is

Most chat APIs split your input into two channels:

- **System prompt** — standing instructions. Who the model is, how it should behave, what rules it must follow. Set once, applies to the whole conversation.
- **User messages** — the actual back-and-forth.

Think of it like a **job briefing** you give a new hire before their first customer walks in. You don't re-explain the company values on every call. You say it once, up front, and it colors everything after. The model treats the system prompt as the persona it never drops.

## How it works

Internally there is no magic separate brain reading the system prompt. The API stitches your \`system\` text and your \`messages\` into one input stream, but it tags the system portion as authoritative framing. The model then predicts every following token *conditioned on that frame*. So "answer in one sentence" isn't enforced by a rule engine — it just makes one-sentence continuations far more likely.

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

- A **role**: "You are a patient Python tutor for absolute beginners."
- A **format rule**: "Always answer with a numbered list of steps."
- A **boundary**: "If you don't know, say so. Never invent function names."

Don't dump everything in here. A system prompt that's three pages long competes with itself — the model can't follow ten priorities at once. Pick the few rules that matter and state them plainly.

## Why it matters

The system prompt is your cheapest, highest-leverage control. It costs a handful of tokens, applies to every turn, and steers behavior without touching the model at all. Before you reach for fancier techniques like few-shot examples or higher token budgets, get this right. Half the "the model won't behave" problems people have are really "I never told it how to behave" problems. It is also where safety and brand voice live — a support bot that must never promise refunds gets that rule here, once.

## The mental model to keep

The system prompt is the **role you cast the model in before the scene starts**. Get the casting right and the performance follows. State the role, a format, and a boundary in a few plain lines, and stop there.`,
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
      step_throughs: [
        {
          title: "How a system prompt shapes one answer",
          steps: [
            { label: "Set the role once", detail: "The system text defines the persona and rules for the whole conversation. It is sent on every call but you only write it once.", code: 'system="You are a terse senior engineer. One sentence. No fluff."' },
            { label: "User asks a question", detail: "The actual turn arrives in the messages list, separate from the system frame.", code: 'messages=[{"role": "user", "content": "Tabs or spaces?"}]' },
            { label: "Model conditions on the frame", detail: "Every predicted token is biased toward the persona. One-sentence, no-fluff continuations become the most likely.", code: "# bias: terse + decisive + engineer voice" },
            { label: "Shaped response comes back", detail: "The answer obeys the role without you ever repeating the rules in the user message.", code: '"Spaces — they render identically everywhere."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Turn the vague instruction "be helpful" into a concrete system prompt for a beginner Python tutor.',
          steps: [
            'Name the role explicitly: "You are a patient Python tutor for absolute beginners."',
            "Add one behavior rule the model can act on: explain each step and avoid jargon.",
            "Stop there — one role plus one behavior is enough to steer tone."
          ],
          output: '"You are a patient Python tutor for absolute beginners. Explain each step in plain language and avoid jargon."'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A support bot must (a) stay friendly, (b) never promise refunds, and (c) escalate billing questions. Write the system prompt and explain the ordering.",
          steps: [
            "Lead with the role so the persona is set first: a friendly support assistant.",
            "State the hard boundary plainly — never promise refunds — because boundaries are the rules most often violated when buried.",
            "Add the escalation rule as a concrete action, not a vibe: route billing questions to a human.",
            "Keep it to three short lines so no rule competes with another for attention."
          ],
          output: '"You are a friendly customer-support assistant. Never promise refunds or discounts. If a question is about billing, tell the customer you are escalating it to a human agent."'
        }
      ],
      comparison_tables: [
        {
          title: "weak vs strong system prompts",
          columns: ["System prompt", "What the model can act on", "Result"],
          rows: [
            { cells: ['"Be helpful and nice."', "Nothing concrete — tone is undefined", "Generic, inconsistent answers"] },
            { cells: ['"Do a good job."', "No role, no format, no boundary", "Drifts in length and style across turns"] },
            { cells: ['"You are a terse senior engineer. One sentence. No fluff."', "Clear role + format + constraint", "Short, consistent, on-voice replies"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "system prompt vs user message",
          bins: [
            { id: "system", label: "Belongs in system prompt" },
            { id: "user", label: "Belongs in a user message" }
          ],
          items: [
            { id: "i1", text: '"You are a patient math tutor."', bin: "system" },
            { id: "i2", text: '"What is 17 times 4?"', bin: "user" },
            { id: "i3", text: '"Always answer in a numbered list."', bin: "system" },
            { id: "i4", text: '"Translate this sentence for me."', bin: "user" },
            { id: "i5", text: '"Never reveal internal pricing."', bin: "system" },
            { id: "i6", text: '"Here is the paragraph to summarize: ..."', bin: "user" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a focused three-line system prompt often beat a sprawling three-page one?",
          sampleAnswer: "A system prompt steers the model by making certain continuations more likely, not by enforcing rules. When you stack ten priorities the model can't honor them all at once, so they dilute each other. A few clear rules — role, format, boundary — give strong, non-competing signals the model can actually follow on every turn."
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
      explanation: `Paste "ChatGPT" into a tokenizer and it splits into "Chat" + "GPT" — two tokens, not one word. Models don't read words. They read **tokens** — chunks of text that are usually a few characters long. "cat" is one token. "unbelievable" might be three ("un", "believ", "able"). A space is often glued to the front of the next token. This sounds like trivia until you realize tokens are how you get **billed** and how the model's **memory limit** is measured. Every dollar and every length limit in LLM-land is denominated in tokens.

## What a token is

A **token** is a common chunk of text drawn from the model's fixed vocabulary of roughly 50,000 to 100,000 entries. Sometimes a token is a whole word, sometimes a word-piece ("ing"), sometimes a space-plus-word (" the"), sometimes a single punctuation mark. The vocabulary is learned by finding which chunks appear most often, so frequent text packs into few tokens and rare text shatters into many.

## A rough rule of thumb

For typical English, **1 token ≈ 4 characters ≈ 0.75 words**. So 1,000 tokens is roughly 750 words, about a page and a half. Don't memorize exact splits — you'll look them up or count them with a tool. Just internalize the rough conversion so you can sanity-check costs.

\`\`\`python
text = "Tokens are chunks of text."
# Rough estimate: characters / 4
estimate = len(text) // 4
print("Characters:", len(text))
print("Rough token estimate:", estimate)
\`\`\`

## How it works: two limits you'll hit

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

## Why it matters

- **Cost.** You pay per token, usually at different rates for input and output — output is often 4–5x pricier. A bloated system prompt repeated across thousands of calls adds up fast.
- **Truncation.** Set \`max_tokens\` too low and answers get chopped. Too high and you waste headroom (though you're only billed for what's actually generated).
- **Limits.** Long documents can blow the context window. That's when you start chunking or summarizing.
- **Weird failures.** Asking a model to "count the r's in strawberry" trips it up partly because it sees tokens, not individual letters. It literally isn't looking at the letters the way you are.

## The mental model to keep

Tokens are the **currency and the ruler** of LLMs — everything is priced and measured in them. Tight, plain language spends fewer tokens and usually reads clearer to the model too, so saving money and getting better output point the same direction.`,
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
      tools: [{ type: "tokenizer" }],
      step_throughs: [
        {
          title: "From your text to a bill",
          steps: [
            { label: "You write a prompt", detail: "A plain string of characters — exactly what you typed.", code: '"Explain recursion simply."' },
            { label: "The tokenizer splits it", detail: "Each chunk is matched against the model's fixed vocabulary. Common words stay whole; rare ones break into pieces.", code: '["Explain", " recursion", " simply", "."]  ->  4 tokens' },
            { label: "Add the system prompt + history", detail: "Your system text and every prior message count as input tokens too. The total must fit the context window.", code: "system (28) + history (140) + prompt (4) = 172 in" },
            { label: "Billed in and out", detail: "Input tokens are billed at one rate, the generated answer at another (usually higher).", code: "172 in @ $3/1M + 90 out @ $15/1M  ->  $0.00187" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Estimate the tokens in "The quick brown fox" using the rule of thumb.',
          steps: [
            "Count the characters including spaces: 19.",
            "Apply the rule 1 token per 4 characters: 19 / 4 = 4.75.",
            "Round to a whole number — about 5 tokens. (A real tokenizer gives 4 here; the estimate is close enough for budgeting.)"
          ],
          output: "About 5 tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A chatbot resends a 200-token system prompt on every one of 50,000 daily calls. Input is $3 per 1M tokens. How much does just the system prompt cost per day?",
          steps: [
            "Tokens spent on the system prompt = 200 x 50,000 = 10,000,000 per day.",
            "Convert to millions: 10,000,000 / 1,000,000 = 10 million-token units.",
            "Cost = 10 x $3 = $30 per day, purely on the repeated system prompt.",
            "Trimming it to 100 tokens halves that to $15 per day — about $5,400 saved a year."
          ],
          output: "$30 per day (before any user messages or answers)"
        }
      ],
      comparison_tables: [
        {
          title: "context window vs max_tokens",
          columns: ["Limit", "Who sets it", "What it caps", "Symptom when hit"],
          rows: [
            { cells: ["Context window", "The model / API", "Total input + output tokens", "Call errors or oldest messages drop"] },
            { cells: ["max_tokens", "You, per request", "Only the generated output", "Answer cut off mid-sentence"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "few tokens vs many tokens",
          bins: [
            { id: "few", label: "Few tokens (cheap)" },
            { id: "many", label: "Many tokens (expensive)" }
          ],
          items: [
            { id: "i1", text: '"the cat sat down"', bin: "few" },
            { id: "i2", text: '"pneumonoultramicroscopic"', bin: "many" },
            { id: "i3", text: '"good morning team"', bin: "few" },
            { id: "i4", text: '"x9$Qz!! 7vK"', bin: "many" },
            { id: "i5", text: '"please summarize this"', bin: "few" },
            { id: "i6", text: '"aGVsbG8gd29ybGQ= base64 blob"', bin: "many" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In one or two sentences: why does max_tokens=50 not make a long prompt cheaper to send?",
          sampleAnswer: "max_tokens only caps the output the model is allowed to generate; it never touches the input. A long prompt is still tokenized and billed in full as input — setting max_tokens low just chops the answer short, it doesn't shrink what you sent."
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
      explanation: `Ask a model to "name a fruit" ten times at temperature 0 and you'll likely get "apple" ten times. Crank the temperature up and you'll start seeing "dragonfruit," "kumquat," "persimmon." **Temperature** is the dial that controls how adventurous the model gets when picking its next token — and misunderstanding it is one of the most common prompt-engineering mistakes.

## What it is

Temperature is a single number (typically **0 to 1**, some APIs allow higher) that controls **randomness in token selection**. It is NOT a "creativity score" you turn up for better writing. It's a risk knob: low means play it safe, high means take chances. More randomness is not the same as more quality.

## How it works

At each step the model produces a ranked list of likely next tokens with probabilities attached. Temperature reshapes that list *before* a token is sampled:

- **Low temperature (near 0)** — sharpen toward the top choice. The model almost always grabs the most likely token. Output is focused, repeatable, predictable.
- **High temperature (toward 1)** — flatten the odds. Lower-ranked tokens get a real shot. Output is varied, surprising, sometimes off the rails.

Picture the probabilities as a hill. Low temperature makes the hill into a sharp spike — one token dominates. High temperature flattens it into gentle rolling ground — many tokens are plausible.

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

## When to use which

| Goal | Temperature |
|------|-------------|
| Extracting data, classification, math | 0 — you want the same right answer every time |
| Summaries, straightforward Q&A | 0 to 0.3 — mostly stable, a little flexibility |
| Brainstorming, names, varied phrasings | 0.7 to 1.0 — you want range |

## Why it matters: the trap

People reach for high temperature when they're unhappy with output, hoping randomness fixes it. Usually the real fix is a clearer prompt. If you need a *correct* answer, low temperature plus a good prompt beats high temperature every time. Save the high settings for when you genuinely want variety, like generating ten different headline options. Raising temperature on a wrong answer just produces wrong answers in more creative ways.

One more note: even at temperature 0, outputs aren't guaranteed byte-for-byte identical across runs. Low temperature reduces randomness; it doesn't promise perfect determinism.

## The mental model to keep

Temperature is a **risk dial, not a quality dial**. Turn it down when you want one correct answer; turn it up only when you genuinely want range.`,
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
      step_throughs: [
        {
          title: "How temperature reshapes one token choice",
          steps: [
            { label: "Model ranks the next tokens", detail: "After 'Name a fruit:', the model assigns a probability to every candidate.", code: "apple .60  banana .15  kiwi .08  durian .01 ..." },
            { label: "Apply low temperature (0)", detail: "The distribution is sharpened to a spike — the top token swallows almost all the probability.", code: "apple .98  banana .01  kiwi .005 ..." },
            { label: "Apply high temperature (0.9)", detail: "The distribution is flattened — long-shot tokens get a real chance.", code: "apple .30  banana .18  kiwi .14  durian .06 ..." },
            { label: "Sample one token", detail: "At temp 0 you get 'apple' nearly every run; at temp 0.9 you might get 'durian'. Then repeat for the next token.", code: "temp 0 -> apple   |   temp 0.9 -> durian" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You are extracting the total amount from thousands of invoices and need the same answer every time. What temperature, and why?",
          steps: [
            "Extraction has exactly one correct answer per invoice — variety is a bug, not a feature.",
            "You want the model to grab the single most likely (correct) token every time.",
            "Set temperature to 0 so the distribution is sharpened to the top choice."
          ],
          output: "temperature = 0 (consistency over variety)"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A teammate brainstorms 10 product names at temperature 0 and gets the same 2 names repeated. They then crank temperature to 1.4 and get gibberish like 'Zorpity Glonk'. What is going wrong at each extreme, and what should they pick?",
          steps: [
            "At temperature 0 the distribution is a spike, so the model keeps grabbing the same top tokens — almost no variety, which defeats brainstorming.",
            "At temperature 1.4 the distribution is flattened so far that nonsense tokens become likely — variety, but incoherent.",
            "Brainstorming wants range that is still plausible, which lives in the middle.",
            "Pick around 0.8 to 1.0: varied, surprising, but still real words and real names."
          ],
          output: "temperature ~0.9 — variety without falling off the rails"
        }
      ],
      comparison_tables: [
        {
          title: "low vs high temperature at a glance",
          columns: ["Setting", "Distribution effect", "Output character", "Best for"],
          rows: [
            { cells: ["Low (0 - 0.3)", "Sharpened to the top token", "Focused, repeatable, safe", "Extraction, classification, math, factual Q&A"], highlight: true },
            { cells: ["Mid (0.4 - 0.6)", "Mildly flattened", "Some flexibility, mostly stable", "Summaries, conversational replies"] },
            { cells: ["High (0.7 - 1.0)", "Flattened, long-shots viable", "Varied, surprising, sometimes off", "Brainstorming, names, multiple drafts"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "low temperature vs high temperature",
          bins: [
            { id: "low", label: "Use low temperature (0)" },
            { id: "high", label: "Use high temperature (~0.9)" }
          ],
          items: [
            { id: "i1", text: "Pull the invoice total as a number", bin: "low" },
            { id: "i2", text: "Generate 12 tagline options", bin: "high" },
            { id: "i3", text: "Classify an email as spam or not", bin: "low" },
            { id: "i4", text: "Brainstorm quirky startup names", bin: "high" },
            { id: "i5", text: "Solve an arithmetic word problem", bin: "low" },
            { id: "i6", text: "Write five different opening lines for a story", bin: "high" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is calling temperature a 'creativity dial' misleading?",
          sampleAnswer: "Temperature only controls how much randomness goes into picking each token — it flattens or sharpens the probability distribution. It doesn't make the model smarter or more imaginative; it just lets less-likely tokens through. Real creativity comes from the prompt and the model, while high temperature can just as easily produce incoherent or wrong output as interesting output."
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
      explanation: `Telling a model "classify the sentiment" works okay. *Showing* it three labeled examples first works a lot better. That's **few-shot prompting**: you give the model a handful of input-output examples right in the prompt, then ask it to handle a new case the same way. It is often the fastest jump in output quality you can make without changing the model at all.

## What it is

**Few-shot prompting** means demonstrating the task with a few worked examples inside the prompt, then leaving the new input open for the model to complete. "Few" usually means two to five. The opposite is **zero-shot** — describing the task with no examples.

- **Zero-shot** — you describe the task and hope the model figures out the exact format and edge cases. "Translate this to French."
- **Few-shot** — you include examples that pin down format, tone, and edge handling. The model pattern-matches off them.

## How it works

The crucial point: the model **isn't being retrained**. No weights change. It's just reading your examples as context and continuing the demonstrated pattern — the same next-token prediction loop, now strongly biased by the input -> output pairs sitting right there in the prompt. This is sometimes called **in-context learning**: the model "learns" the task only for this one request, then forgets it.

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

## Why it matters

Few-shot is the bridge between "describe it and pray" and full-on fine-tuning. It costs you some tokens but gives you control over format and behavior with zero training. When a zero-shot prompt is *almost* right but the format keeps drifting, examples are usually the fastest fix. The trade-off: every example is re-sent and re-billed on every call, so you balance accuracy against token cost.

## The mental model to keep

Few-shot is **show, don't tell**. The model copies the pattern you demonstrate, so make your examples look exactly like the answer you want back.`,
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
      step_throughs: [
        {
          title: "Building and running a few-shot prompt",
          steps: [
            { label: "State the task once", detail: "A short instruction line tells the model what the examples will demonstrate.", code: '"Classify sentiment as POSITIVE or NEGATIVE."' },
            { label: "Add labeled examples", detail: "Each example uses the exact format you want back: input, separator, label.", code: '"Review: The food was cold. -> NEGATIVE"\n"Review: Loved every bite! -> POSITIVE"' },
            { label: "Leave the new input open", detail: "End with the new case in the same shape, but stop right at the separator so the model fills the label.", code: '"Review: Cozy spot, great coffee. ->"' },
            { label: "Model continues the pattern", detail: "It predicts the most likely continuation of the demonstrated pattern — the missing label.", code: "-> POSITIVE" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Turn this zero-shot prompt into a one-example prompt: 'Make this phrase formal: yo'.",
          steps: [
            'Add one demonstration that shows the transformation you want: "hi => Hello".',
            "Keep the separator consistent (=>) so the model knows the format.",
            'End with the real input open: "yo =>" so the model completes it.'
          ],
          output: '"Make this formal.\\n\\nhi => Hello\\nyo =>"'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your sentiment classifier handles POSITIVE and NEGATIVE fine, but neutral reviews like 'It was okay' get labeled randomly. Fix it with few-shot.",
          steps: [
            "The model never saw a neutral example, so it forces every review into the two labels it was shown.",
            "Add a third label to the task line: POSITIVE, NEGATIVE, or NEUTRAL.",
            'Include at least one neutral demonstration: "Review: It was fine, nothing special. -> NEUTRAL".',
            "Now the pattern covers the edge case, so 'It was okay' maps to NEUTRAL instead of a coin flip."
          ],
          output: "Adding a NEUTRAL example pins down the previously ambiguous case."
        }
      ],
      comparison_tables: [
        {
          title: "zero-shot vs few-shot",
          columns: ["Aspect", "Zero-shot", "Few-shot"],
          rows: [
            { cells: ["Examples in prompt", "None", "2 - 5 input -> output pairs"] },
            { cells: ["Format control", "Loose — model guesses the shape", "Tight — model copies your shape"], highlight: true },
            { cells: ["Token cost", "Lower", "Higher (examples re-sent each call)"] },
            { cells: ["Best when", "Task is simple and format is obvious", "Format drifts or edge cases matter"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good few-shot example vs bad few-shot example",
          bins: [
            { id: "good", label: "Good example to include" },
            { id: "bad", label: "Bad example to include" }
          ],
          items: [
            { id: "i1", text: "Uses the exact -> separator as every other example", bin: "good" },
            { id: "i2", text: "Mixes ':' and '->' across examples", bin: "bad" },
            { id: "i3", text: "Covers a tricky neutral case", bin: "good" },
            { id: "i4", text: "Labels in random capitalization (Positive, NEGATIVE)", bin: "bad" },
            { id: "i5", text: "Matches the output format you actually want", bin: "good" },
            { id: "i6", text: "Twenty near-identical examples that waste tokens", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does few-shot prompting work even though no training happens?",
          sampleAnswer: "The model still does plain next-token prediction, but the examples sitting in the prompt strongly bias what continuation is likely. Seeing two or three 'input -> output' pairs makes the model predict the same pattern for the new input. Nothing is learned permanently — it's in-context pattern matching that lasts only for that one request."
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
      explanation: `A model that replies "Sure! The customer seems happy, sentiment is positive" is useless to your code. Your program can't reliably pull "positive" out of that sentence. What you want is \`{"sentiment": "positive"}\` — clean, parseable, predictable. Getting that consistently is **structured output**, and it's where prompt engineering stops being a chat trick and becomes real software engineering.

## What it is

**Structured output** is model output in a fixed, machine-readable shape — almost always **JSON** — that your code can parse with one line instead of fragile string-hunting. Instead of a sentence, you get \`{"name": "Maria", "age": 34}\`: defined keys, predictable types, no surprises.

## Why plain prose breaks your code

When a model answers in free-form text, every response is shaped a little differently. "She is 34" one time, "Maria, age thirty-four" the next. Parsing that means brittle string-hunting that falls apart the moment the phrasing shifts. Structured output flips this: you tell the model the exact shape you want, and you get back something \`json.loads()\` can swallow every time.

## How it works: asking for JSON

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

## Why it matters: the payoff

Structured output is what lets an LLM live inside a real app instead of just a chat box. Sentiment that becomes a database column, extracted fields that flow into a form, classifications that trigger logic — all of it depends on output your code can trust. Nail the prompt, parse defensively, and the model becomes a dependable component instead of a wildcard.

## The mental model to keep

Free-form prose is an **open-ended interview**; structured output is a **fill-in-the-blank form**. Forms are boring on purpose — and that predictability is exactly why your code can build on them.`,
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
      step_throughs: [
        {
          title: "From prompt to trusted data",
          steps: [
            { label: "Specify the exact shape", detail: "Show a literal JSON example with the keys and value types you want. A concrete schema beats a description.", code: 'Respond with ONLY JSON like {"name": "...", "age": 0}' },
            { label: "Forbid the extras", detail: "Tell the model: no preamble, no markdown, no code fences. This heads off 'Here is the JSON:' and ```json wrappers.", code: '"...and nothing else. No markdown, no code fences."' },
            { label: "Model returns clean JSON", detail: "The output now matches your schema and is ready to parse.", code: '{"name": "Maria", "age": 34}' },
            { label: "Parse defensively", detail: "Wrap json.loads in try/except so one rare malformed response can't crash the pipeline.", code: "data = safe_parse(raw, default={})" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Write the key instruction that turns "tell me the sentiment" into reliable JSON output.',
          steps: [
            'Demand JSON only so the model skips its friendly preamble: "Respond with ONLY valid JSON."',
            'Show the exact shape so the keys are fixed: {"sentiment": "..."}.',
            "Together these two moves are the highest-impact changes for reliability."
          ],
          output: 'Respond with ONLY valid JSON like {"sentiment": "positive"} and nothing else.'
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your pipeline crashes intermittently because the model occasionally returns ```json\\n{...}\\n``` with code fences. Walk through a robust fix.",
          steps: [
            "First, prevent it at the prompt: add 'no markdown, no code fences, no explanation' to the instruction.",
            "Accept that no prompt is perfect 100% of the time, so also harden the parser.",
            "Strip a leading fence line (```json) and a trailing ``` before parsing.",
            "Wrap json.loads in try/except returning a default, so a stray bad response is handled instead of crashing."
          ],
          output: "Prompt forbids fences AND the parser strips fences + catches errors — defense in depth."
        }
      ],
      comparison_tables: [
        {
          title: "free-form prose vs structured JSON",
          columns: ["Aspect", "Free-form prose", "Structured JSON"],
          rows: [
            { cells: ["Shape per response", "Varies every time", "Fixed keys and types"] },
            { cells: ["Parsing", "Brittle string-hunting", "One json.loads() call"], highlight: true },
            { cells: ["Feeds into code", "Unreliable", "Database columns, forms, logic"] },
            { cells: ["Failure mode", "Phrasing drift breaks parser", "Rare malformed JSON, caught defensively"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "reliable JSON habit vs reliability risk",
          bins: [
            { id: "good", label: "Improves JSON reliability" },
            { id: "risk", label: "Risks broken output" }
          ],
          items: [
            { id: "i1", text: 'Saying "ONLY valid JSON, nothing else"', bin: "good" },
            { id: "i2", text: "Showing a literal example of the keys and types", bin: "good" },
            { id: "i3", text: "Wrapping json.loads in try/except", bin: "good" },
            { id: "i4", text: "Letting the model add a friendly preamble", bin: "risk" },
            { id: "i5", text: "Allowing ```json code fences in the output", bin: "risk" },
            { id: "i6", text: "Describing fields in vague prose only", bin: "risk" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why parse defensively even when your prompt reliably produces JSON?",
          sampleAnswer: "Because the model is a probabilistic text predictor, not a guaranteed JSON generator. Even a great prompt slips occasionally and returns a preamble, a code fence, or malformed JSON. Wrapping json.loads in try/except means one bad response returns a safe default instead of crashing the whole pipeline."
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
