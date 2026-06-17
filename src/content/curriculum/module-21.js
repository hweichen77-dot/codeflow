export default {
  project: {
    id: "ai-21",
    title: "Cost & Token Budgeting",
    description: "Learn how LLM billing actually works so you can estimate, predict, and cut the cost of every API call.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 4,
    tags: ["cost", "tokens", "pricing", "budgeting", "fundamentals"],
    order: 21,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-21-l1",
      project_id: "ai-21",
      order: 1,
      title: "How Pricing Works",
      concept: "Pricing",
      xp_reward: 10,
      explanation: `You send a model a one-line question and a dense three-page answer comes back. When the bill arrives, those three pages cost far more than your one line — and not just because they're longer. Once you see how LLM pricing actually works, you stop being surprised by your invoice.

## What it is

An LLM API doesn't charge per request or per minute. It charges **per token** — the little chunks of text the model reads and writes. Every call has two token counts: the **input tokens** (your prompt, plus any history) and the **output tokens** (the model's reply). They are priced *separately*, and that split is the whole game.

Prices are quoted **per million tokens**. You'll see a model listed like "$3 / 1M input, $15 / 1M output." Don't let the "million" scare you — most single calls use a few hundred to a few thousand tokens, so a call costs a fraction of a cent. The per-million number is just a tidy way to write a very small per-token price.

## How it works

Two facts drive every bill:

1. **Input and output are billed at different rates.** The same provider that charges \\$3 per million input tokens might charge \\$15 per million output tokens. Reading your prompt is cheap; generating new text is expensive.
2. **Output is usually several times more expensive than input.** A 3x to 5x gap is common. The model works harder to *produce* tokens than to *read* them, and pricing reflects that.

To find a call's cost, compute each side and add them:

\`\`\`python
input_tokens = 1000
output_tokens = 500
input_price = 3   # dollars per 1,000,000 input tokens
output_price = 15  # dollars per 1,000,000 output tokens

input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost
print(f"total: \${total:.6f}")
\`\`\`

## Why it matters

Because output is the pricey side, a chatty model that writes long answers can cost more than a model with a longer, denser prompt. If you want to control spend, the first lever is almost always *the length of the answer*, not the length of the question.

## The mental model to keep

**Two meters run on every call: one cheap (input), one expensive (output).** Watch the expensive meter first.`,
      key_terms: [
        { term: "Input tokens", definition: "The tokens in your prompt (and any history) that the model reads. Usually the cheaper side." },
        { term: "Output tokens", definition: "The tokens the model generates in its reply. Usually several times more expensive than input." },
        { term: "Price per million tokens", definition: "The standard way prices are quoted, e.g. $3 / 1M tokens, which is a tiny per-token cost." }
      ],
      callouts: [
        { type: "analogy", title: "Two meters, not one", content: "Think of a taxi with two fare meters running at once: a cheap one for distance you read off the map (input) and an expensive one for the driver narrating the whole trip (output). Your bill is both added together.", position: "before" },
        { type: "insight", title: "Output is where it adds up", content: "Input and output are priced separately, and output usually costs 3-5x more per token. If your bill feels high, look at how much the model is writing, not how much you're asking.", position: "after" }
      ],
      concept_diagram: {
        title: "How one call gets priced",
        steps: [
          { label: "Count input tokens", desc: "Your prompt plus any history is measured in tokens." },
          { label: "Count output tokens", desc: "The model's reply is measured separately." },
          { label: "Apply two rates", desc: "Input rate and output rate, each per million tokens." },
          { label: "Add them up", desc: "input_cost + output_cost = what the call costs." }
        ]
      },
      inline_quizzes: [
        {
          question: "On a typical LLM API, which costs more per token?",
          options: ["Input (your prompt)", "Output (the model's reply)", "They always cost exactly the same"],
          correct_index: 1,
          explanation: "Output tokens are usually billed at several times the input rate, because generating text is the expensive part."
        }
      ],
      quiz_questions: [
        {
          question: "What unit do LLM APIs bill you in?",
          options: [
            "Per request, a flat fee each call",
            "Per token, with input and output priced separately",
            "Per minute the model spends thinking",
            "Per character of your prompt only"
          ],
          correct_index: 1,
          explanation: "Billing is per token, and input tokens and output tokens are charged at their own separate rates."
        },
        {
          question: "A model is listed at \"$3 / 1M input, $15 / 1M output.\" What does that tell you?",
          options: [
            "Each call costs at least $3",
            "Input and output have different per-token prices, and output is more expensive",
            "You are billed $18 for every request",
            "The prices only apply after the first million calls"
          ],
          correct_index: 1,
          explanation: "The two numbers are separate per-million rates. Output ($15) costs 5x the input rate ($3) here."
        },
        {
          question: "Why is output usually more expensive than input?",
          options: [
            "Providers want to discourage long prompts",
            "Generating new tokens is more work than reading existing ones",
            "Output tokens are physically larger",
            "Input is free on every model"
          ],
          correct_index: 1,
          explanation: "Reading your prompt is cheap; producing each new token of a reply is the costly part, so output is priced higher."
        }
      ],
      participation_activities: [
        {
          activity_title: "Pricing sense-check",
          questions: [
            { question: "Input tokens and output tokens are billed at the same rate on a typical LLM API.", type: "true_false", correct_answer: "false", explanation: "They are priced separately, and output is usually several times more expensive." },
            { question: "LLM prices are most commonly quoted per ______ tokens.", type: "fill_in", correct_answer: "million", explanation: "Rates like '$3 / 1M tokens' are stated per million tokens." }
          ]
        }
      ],
      starter_code: `# Cost of one call. Input and output are priced separately.
input_tokens = 1000
output_tokens = 500
input_price = 3    # dollars per 1,000,000 input tokens
output_price = 15  # dollars per 1,000,000 output tokens

# TODO: compute input_cost, output_cost, and total, then print total to 6 decimals.
print("input tokens:", input_tokens)
`,
      solution_code: `input_tokens = 1000
output_tokens = 500
input_price = 3    # dollars per 1,000,000 input tokens
output_price = 15  # dollars per 1,000,000 output tokens

input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost

print(f"input cost: \${input_cost:.6f}")
print(f"output cost: \${output_cost:.6f}")
print(f"total: \${total:.6f}")
`,
      expected_output: `input cost: $0.003000
output cost: $0.007500
total: $0.010500`,
      step_throughs: [
        {
          title: "pricing one call, step by step",
          steps: [
            { label: "Count the two sides", detail: "Your prompt is the input; the reply is the output. They are measured in tokens separately.", code: "input_tokens = 1000;  output_tokens = 500" },
            { label: "Look up the two rates", detail: "Prices are quoted per million tokens. Input and output each have their own.", code: "input_price = 3  # /1M;  output_price = 15  # /1M" },
            { label: "Convert per-million to actual cost", detail: "Divide the token count by one million, then multiply by the rate.", code: "input_cost = 1000 / 1_000_000 * 3  # = 0.003" },
            { label: "Add the two sides", detail: "Total is input cost plus output cost. Output dominates here because its rate is 5x higher.", code: "total = 0.003 + 0.0075  # = 0.0105" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A model charges $2 per 1M input tokens. You send a 500-token prompt. What does the input cost?",
          steps: [
            "Convert tokens to millions: 500 / 1,000,000 = 0.0005 million tokens.",
            "Multiply by the rate: 0.0005 x $2 = $0.001.",
            "That's the input side only; an answer would add output cost on top."
          ],
          output: "$0.001000"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Input is $3 / 1M and output is $15 / 1M. Call A sends 4000 input + 200 output tokens. Call B sends 200 input + 4000 output tokens. Which call costs more?",
          steps: [
            "Call A: input = 4000/1M x $3 = $0.012; output = 200/1M x $15 = $0.003; total = $0.015.",
            "Call B: input = 200/1M x $3 = $0.0006; output = 4000/1M x $15 = $0.060; total = $0.0606.",
            "Same total tokens (4200) in both calls, but B writes far more output.",
            "Because output is 5x pricier, B costs about 4x as much as A."
          ],
          output: "Call B costs more ($0.0606 vs $0.015) because output tokens dominate."
        }
      ],
      comparison_tables: [
        {
          title: "input vs output pricing",
          columns: ["Aspect", "Input tokens", "Output tokens"],
          rows: [
            { cells: ["What it is", "Your prompt + history the model reads", "The reply the model generates"] },
            { cells: ["Typical relative price", "Cheaper baseline", "Usually 3-5x the input rate"] },
            { cells: ["How to shrink it", "Trim prompt and history", "Cap the answer length"] },
            { cells: ["Usual bill impact", "Smaller share", "Often the dominant share"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "input cost vs output cost",
          bins: [
            { id: "input", label: "Counts as INPUT" },
            { id: "output", label: "Counts as OUTPUT" }
          ],
          items: [
            { id: "i1", text: "The question you typed", bin: "input" },
            { id: "i2", text: "The model's generated answer", bin: "output" },
            { id: "i3", text: "Prior chat history you resend", bin: "input" },
            { id: "i4", text: "A long essay the model writes back", bin: "output" },
            { id: "i5", text: "A system prompt you attach", bin: "input" },
            { id: "i6", text: "Tokens the model produces token-by-token", bin: "output" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does quoting a price like '$15 per million tokens' not mean a single call is expensive?",
          sampleAnswer: "A normal call only uses a few hundred or a few thousand tokens, not a million. The per-million figure is just a readable way to state an extremely small per-token price, so one call still costs a tiny fraction of a cent. You only approach a full dollar of output cost when you generate tens of thousands of tokens."
        }
      ],
      hints: [
        "Divide each token count by 1_000_000 before multiplying by its price.",
        "input_cost uses input_price; output_cost uses output_price; total is their sum.",
        "Use an f-string with :.6f to print money to six decimal places."
      ],
      challenge_title: "Price a single call",
      challenge_description: "Given 1500 input tokens and 800 output tokens, with input at $3 per million and output at $15 per million, compute the total cost and print it to 6 decimal places as 'total cost: $X'.",
      challenge_starter_code: `input_tokens = 1500
output_tokens = 800
input_price = 3    # dollars per 1,000,000 tokens
output_price = 15  # dollars per 1,000,000 tokens
# TODO: compute total cost and print it to 6 decimal places.
`,
      challenge_solution_code: `input_tokens = 1500
output_tokens = 800
input_price = 3    # dollars per 1,000,000 tokens
output_price = 15  # dollars per 1,000,000 tokens

input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost

print(f"total cost: \${total:.6f}")
`,
      challenge_test_cases: [
        { input: "input=1500, output=800", expected_output: "total cost: $0.016500", description: "1500 input ($0.0045) + 800 output ($0.012) = $0.0165." }
      ]
    },
    {
      id: "ai-21-l2",
      project_id: "ai-21",
      order: 2,
      title: "Estimating Cost Before You Call",
      concept: "Estimation",
      xp_reward: 10,
      explanation: `You're about to wire an AI feature into your app that fires on every page load. Before you ship it, one question should keep you up at night: what will this cost when ten thousand people use it? You don't need to guess. You can estimate the cost of a call *before* you ever make it.

## What it is

Cost estimation is a two-step trick. First, **estimate the token count** from the text you have. Second, **plug those tokens into the price** to get an expected dollar figure. Do this before launch and the invoice never surprises you.

The token estimate uses the rough rule from the basics: **about 1 token per 4 characters** of English. It isn't exact — the real tokenizer is — but it's close enough to budget with. Count characters, divide by four, round up.

## How it works

Say you have a prompt and an expected answer length:

\`\`\`python
import math

prompt = "Summarize this paragraph in one sentence."
est_input_tokens = math.ceil(len(prompt) / 4)   # ~chars / 4
est_output_tokens = 60                            # you decide a budget for the reply

input_price = 3    # $/1M
output_price = 15  # $/1M
cost = (est_input_tokens / 1_000_000 * input_price
        + est_output_tokens / 1_000_000 * output_price)
print(f"estimated cost: \${cost:.6f}")
\`\`\`

For output you usually can't measure ahead of time, so you **assume a budget** — "I'll cap the answer at 200 tokens" — and price against that. That assumption is also a spending limit you can later enforce.

## Why it matters

The real power is multiplying by scale. One call at \\$0.0002 sounds free. The same call **100,000 times a day** is \\$20 a day, \\$600 a month. Estimating per-call cost and multiplying by expected volume turns a vague worry into a number you can plan around — and a number you can compare against alternatives before you commit.

## The mental model to keep

**Tokens first, then dollars, then multiply by volume.** A five-line estimate beats a five-figure surprise.`,
      key_terms: [
        { term: "Token estimate", definition: "An approximate token count from text, using roughly 1 token per 4 characters of English." },
        { term: "Output budget", definition: "An assumed cap on reply length you price against, since you can't measure output before the call." },
        { term: "Expected cost", definition: "Estimated tokens turned into dollars, optionally multiplied by expected call volume." }
      ],
      callouts: [
        { type: "tip", title: "chars / 4 ≈ tokens", content: "For English, divide the character count by 4 and round up to estimate tokens. It's a back-of-the-envelope figure, but plenty accurate for budgeting.", position: "before" },
        { type: "warning", title: "Per call looks free; at scale it isn't", content: "A call costing $0.0002 feels like nothing until it runs 100,000 times a day. Always multiply your per-call estimate by expected volume before you ship.", position: "after" }
      ],
      concept_diagram: {
        title: "From text to a budget number",
        steps: [
          { label: "Measure characters", desc: "len(text) of your prompt." },
          { label: "Estimate tokens", desc: "characters / 4, rounded up, plus an output budget." },
          { label: "Convert to dollars", desc: "Apply input and output rates per million." },
          { label: "Multiply by volume", desc: "Per-call cost x calls per day = your real bill." }
        ]
      },
      inline_quizzes: [
        {
          question: "Roughly how many tokens is a 200-character English prompt?",
          options: ["About 50 tokens", "About 200 tokens", "About 800 tokens"],
          correct_index: 0,
          explanation: "Using 1 token per 4 characters, 200 / 4 is about 50 tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What is the rough rule for estimating tokens from English text?",
          options: [
            "About 1 token per word, always",
            "About 1 token per 4 characters",
            "About 4 tokens per character",
            "Exactly 1 token per sentence"
          ],
          correct_index: 1,
          explanation: "Roughly 1 token per 4 characters of English is the standard back-of-the-envelope estimate."
        },
        {
          question: "Why do you assume an output budget instead of measuring output tokens?",
          options: [
            "Output tokens are free, so they don't matter",
            "You can't know the reply length before the model writes it, so you cap and price against an assumption",
            "Output is always exactly the same length as input",
            "The API hides output token counts"
          ],
          correct_index: 1,
          explanation: "Output length isn't known in advance, so you pick a budget (a cap) and estimate cost against it."
        },
        {
          question: "A call costs $0.0003 and runs 50,000 times a day. About what is the daily cost?",
          options: [
            "About $0.30",
            "About $1.50",
            "About $15",
            "About $150"
          ],
          correct_index: 2,
          explanation: "0.0003 x 50,000 = $15 per day. Scale turns a tiny per-call cost into a real bill."
        }
      ],
      participation_activities: [
        {
          activity_title: "Estimation check",
          questions: [
            { question: "You can estimate a call's cost before ever sending it to the model.", type: "true_false", correct_answer: "true", explanation: "Estimate tokens from your text, apply the price, and you have an expected cost." },
            { question: "To go from per-call cost to a daily bill, multiply by the expected ______.", type: "fill_in", correct_answer: "volume", explanation: "Per-call cost x number of calls (volume) gives the real spend." }
          ]
        }
      ],
      starter_code: `# Estimate the cost of a call before making it.
import math

prompt = "Summarize the meeting notes into three bullet points."
est_output_tokens = 80   # assumed cap on the reply
input_price = 3          # $/1M
output_price = 15        # $/1M

# TODO: estimate input tokens (chars / 4, rounded up), then compute expected cost.
print("characters:", len(prompt))
`,
      solution_code: `import math

prompt = "Summarize the meeting notes into three bullet points."
est_output_tokens = 80   # assumed cap on the reply
input_price = 3          # $/1M
output_price = 15        # $/1M

est_input_tokens = math.ceil(len(prompt) / 4)
cost = (est_input_tokens / 1_000_000 * input_price
        + est_output_tokens / 1_000_000 * output_price)

print("estimated input tokens:", est_input_tokens)
print(f"estimated cost: \${cost:.6f}")
`,
      expected_output: `estimated input tokens: 14
estimated cost: $0.001242`,
      step_throughs: [
        {
          title: "estimating a call you haven't made yet",
          steps: [
            { label: "Count characters", detail: "Measure the text you already have — your prompt string.", code: 'len("Summarize this.")  # = 15 characters' },
            { label: "Divide by four, round up", detail: "The rough rule: about 1 token per 4 characters. Round up so a partial token counts.", code: "math.ceil(15 / 4)  # = 4 input tokens" },
            { label: "Add an output budget", detail: "You can't measure the reply yet, so assume a cap and treat it as the output token count.", code: "est_output_tokens = 80  # your chosen cap" },
            { label: "Turn tokens into dollars", detail: "Apply the input and output rates per million and add. That's your expected cost.", code: "cost = 4/1M*3 + 80/1M*15  # ~= $0.001212" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your prompt is 400 characters of English. Estimate its input token count.",
          steps: [
            "Use the rule: about 1 token per 4 characters.",
            "Divide: 400 / 4 = 100.",
            "No rounding needed since it's whole; the estimate is about 100 tokens."
          ],
          output: "About 100 input tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You plan a feature: ~600-char prompt, 150-token answer budget, run 20,000 times/day. Input $3/1M, output $15/1M. What's the daily cost?",
          steps: [
            "Estimate input tokens: 600 / 4 = 150 tokens.",
            "Per-call input cost: 150/1M x $3 = $0.00045. Per-call output cost: 150/1M x $15 = $0.00225.",
            "Per-call total: $0.00045 + $0.00225 = $0.0027.",
            "Multiply by volume: $0.0027 x 20,000 = $54 per day."
          ],
          output: "About $54 per day (≈$1,620/month)."
        }
      ],
      comparison_tables: [
        {
          title: "estimating input vs output tokens",
          columns: ["Side", "How you estimate it", "Why"],
          rows: [
            { cells: ["Input", "Measure the text: chars / 4", "You already have the prompt, so you can count it"] },
            { cells: ["Output", "Assume a budget / cap", "The reply doesn't exist yet, so you pick a limit"] },
            { cells: ["Both", "Convert tokens to dollars", "Apply each side's per-million rate"] },
            { cells: ["At scale", "Multiply per-call cost by volume", "Tiny costs add up across many calls"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "known before the call vs assumed",
          bins: [
            { id: "known", label: "Can measure beforehand" },
            { id: "assumed", label: "Must assume / budget" }
          ],
          items: [
            { id: "i1", text: "Length of your prompt", bin: "known" },
            { id: "i2", text: "Length of the model's reply", bin: "assumed" },
            { id: "i3", text: "Character count of the system prompt", bin: "known" },
            { id: "i4", text: "How many output tokens the answer will use", bin: "assumed" },
            { id: "i5", text: "Size of the history you resend", bin: "known" },
            { id: "i6", text: "The cap you set on the reply length", bin: "assumed" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is multiplying a per-call estimate by expected volume the most important step in budgeting an AI feature?",
          sampleAnswer: "A single call almost always looks negligible — a fraction of a cent — so judging cost per call hides the real risk. The danger lives in volume: the same tiny cost repeated tens of thousands of times a day becomes hundreds or thousands of dollars a month. Multiplying by expected volume converts a number that feels like nothing into a budget figure you can actually plan and defend."
        }
      ],
      hints: [
        "len(prompt) gives the character count of your prompt.",
        "math.ceil(len(prompt) / 4) estimates input tokens, rounding partials up.",
        "Cost = est_input/1_000_000*input_price + est_output/1_000_000*output_price."
      ],
      challenge_title: "Estimate before you ship",
      challenge_description: "You have a 240-character prompt and plan to cap the answer at 100 output tokens. Input is $3/1M, output is $15/1M. Estimate input tokens with chars/4 rounded up, compute the expected per-call cost, and print it to 6 decimal places as 'estimated cost: $X'.",
      challenge_starter_code: `import math

prompt_chars = 240
est_output_tokens = 100
input_price = 3    # $/1M
output_price = 15  # $/1M
# TODO: estimate input tokens, compute expected cost, print to 6 decimals.
`,
      challenge_solution_code: `import math

prompt_chars = 240
est_output_tokens = 100
input_price = 3    # $/1M
output_price = 15  # $/1M

est_input_tokens = math.ceil(prompt_chars / 4)
cost = (est_input_tokens / 1_000_000 * input_price
        + est_output_tokens / 1_000_000 * output_price)

print(f"estimated cost: \${cost:.6f}")
`,
      challenge_test_cases: [
        { input: "240 chars, 100 output tokens", expected_output: "estimated cost: $0.001680", description: "60 input tokens ($0.00018) + 100 output ($0.0015) = $0.00168." }
      ]
    },
    {
      id: "ai-21-l3",
      project_id: "ai-21",
      order: 3,
      title: "Where the Money Goes",
      concept: "Cost Drivers",
      xp_reward: 10,
      explanation: `A team launches a chatbot, watches the first few messages cost almost nothing, and relaxes. Three weeks later the bill is ten times what they modeled. Nothing broke. They just didn't see where the money actually goes in a real conversation — and it's almost never where beginners expect.

## What it is

Two things dominate a real LLM bill, and neither is the obvious "the prompt is long."

1. **Long outputs.** Output tokens cost several times more than input, so an answer that rambles is the single biggest controllable cost on any one call.
2. **Chat history that compounds.** This is the sneaky one. A model is stateless — it remembers nothing between calls. To fake a conversation, the app **resends the entire transcript every single turn**. Turn 10 doesn't just send your latest message; it re-sends turns 1 through 9 as input, plus the new message.

## How it works

That resending makes input cost grow with every turn. If each turn adds about the same number of tokens, the running input total climbs like 1, then 1+2, then 1+2+3 — the transcript gets re-billed again and again:

\`\`\`python
tokens_per_turn = 100  # rough size of each message
total_input_tokens = 0
for turn in range(1, 6):
    # the whole transcript so far is resent as input this turn
    history_tokens = tokens_per_turn * turn
    total_input_tokens += history_tokens
    print(f"turn {turn}: resend {history_tokens} input tokens")
print("cumulative input tokens:", total_input_tokens)
\`\`\`

By turn 20 of a long chat, you might be paying to resend nineteen earlier messages on every reply. The conversation didn't get smarter; it just got more expensive to carry.

## Why it matters

This explains the two classic bill shocks: a feature that lets the model write long answers, and a chat product where long sessions cost far more than short ones. Both are fixable — but only once you can name the culprit. Spotting *where* the money goes is the prerequisite for cutting it, which is the next lesson.

## The mental model to keep

**Output is expensive per token; history is expensive by repetition.** Watch the answers you allow and the transcript you keep resending.`,
      key_terms: [
        { term: "Stateless model", definition: "The model keeps no memory between calls, so the app must resend prior context every turn." },
        { term: "Transcript resend", definition: "Sending the whole conversation history as input on every new turn, which compounds input cost." },
        { term: "Cost driver", definition: "The part of a workload that dominates the bill — here, long outputs and growing history." }
      ],
      callouts: [
        { type: "insight", title: "History is billed over and over", content: "Because the model is stateless, the app resends the full transcript every turn. Turn 10 pays to re-read turns 1-9. Long chats get expensive even if each message is short.", position: "before" },
        { type: "warning", title: "Long answers, not long questions", content: "Beginners blame long prompts. The bigger culprits are long outputs (priced high) and history that compounds (re-billed each turn). Watch those two first.", position: "after" }
      ],
      concept_diagram: {
        title: "Why a long chat gets expensive",
        steps: [
          { label: "Model is stateless", desc: "It remembers nothing between calls." },
          { label: "App resends history", desc: "The whole transcript is sent as input each turn." },
          { label: "Input grows every turn", desc: "Turn N re-bills turns 1..N-1 plus the new message." },
          { label: "Output adds on top", desc: "Each reply's output tokens, priced high, stack with it." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does input cost grow as a chat conversation gets longer?",
          options: ["The model charges extra for old users", "The app resends the whole transcript as input every turn", "Tokens get more expensive over time"],
          correct_index: 1,
          explanation: "The model is stateless, so each turn re-sends the entire history as input, and that resent history is billed again."
        }
      ],
      quiz_questions: [
        {
          question: "What are the two things that usually dominate a real LLM bill?",
          options: [
            "Network latency and the number of users",
            "Long outputs and chat history that compounds",
            "The model's name and the time of day",
            "The programming language and the operating system"
          ],
          correct_index: 1,
          explanation: "Long outputs (priced high) and resent chat history (re-billed each turn) are the main cost drivers."
        },
        {
          question: "Because a model is stateless, what must a chat app do every turn?",
          options: [
            "Retrain the model on the new message",
            "Resend the prior conversation as input",
            "Delete the previous messages to save space",
            "Switch to a different model"
          ],
          correct_index: 1,
          explanation: "With no built-in memory, the app re-sends the whole transcript so the model can 'see' the conversation."
        },
        {
          question: "In a long chat, why is the early conversation re-billed many times?",
          options: [
            "The provider charges interest on old tokens",
            "Each new turn includes the entire earlier transcript as input again",
            "Old messages are stored on the model permanently",
            "Output tokens convert into input tokens"
          ],
          correct_index: 1,
          explanation: "Every turn resends turns 1..N-1 as input, so the same early messages are paid for again and again."
        }
      ],
      participation_activities: [
        {
          activity_title: "Cost-driver check",
          questions: [
            { question: "A chat app resends the whole conversation history as input on every new turn.", type: "true_false", correct_answer: "true", explanation: "The model is stateless, so history must be re-supplied each turn, which compounds input cost." },
            { question: "Output tokens are usually more expensive than input, so long ______ are a top cost driver.", type: "fill_in", correct_answer: "outputs", explanation: "Long outputs (answers) are priced high and dominate per-call cost." }
          ]
        }
      ],
      starter_code: `# Show how resending history compounds input cost across turns.
tokens_per_turn = 100  # rough size of each message
total_input_tokens = 0

# TODO: for turns 1..5, the resent history is tokens_per_turn * turn.
# Add it to the running total and print each turn, then the cumulative total.
for turn in range(1, 6):
    print("turn", turn)
`,
      solution_code: `tokens_per_turn = 100  # rough size of each message
total_input_tokens = 0

for turn in range(1, 6):
    history_tokens = tokens_per_turn * turn  # whole transcript resent this turn
    total_input_tokens += history_tokens
    print(f"turn {turn}: resend {history_tokens} input tokens")

print("cumulative input tokens:", total_input_tokens)
`,
      expected_output: `turn 1: resend 100 input tokens
turn 2: resend 200 input tokens
turn 3: resend 300 input tokens
turn 4: resend 400 input tokens
turn 5: resend 500 input tokens
cumulative input tokens: 1500`,
      step_throughs: [
        {
          title: "watching history compound",
          steps: [
            { label: "Turn 1: just your message", detail: "The first turn sends only the opening message as input.", code: "history = 100 tokens  # turn 1" },
            { label: "Turn 2: message 1 + message 2", detail: "The app resends turn 1 plus the new message, so input doubles.", code: "history = 100 + 100 = 200 tokens" },
            { label: "Turn 3: the whole transcript again", detail: "Now three messages are resent. The early turns are being paid for a third time.", code: "history = 300 tokens  # turns 1-3" },
            { label: "Add it all up", detail: "Across 5 turns the resent input totals 100+200+300+400+500 = 1500, far more than the 500 tokens actually typed.", code: "cumulative = 1500 input tokens" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Each message is about 50 tokens. On turn 4 of a chat, roughly how many input tokens does the app resend?",
          steps: [
            "Turn 4 resends the whole transcript: messages 1, 2, 3, and 4.",
            "That's 4 messages x 50 tokens each.",
            "4 x 50 = 200 input tokens for that single turn."
          ],
          output: "About 200 input tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A chat has 10 turns, each message about 100 tokens, and history is resent every turn. How many cumulative input tokens get billed over the whole chat?",
          steps: [
            "Turn N resends N messages, so input per turn is 100, 200, ..., 1000 tokens.",
            "Cumulative input = 100 x (1 + 2 + ... + 10).",
            "The sum 1+2+...+10 = 55.",
            "So cumulative input = 100 x 55 = 5,500 tokens — versus only 1,000 tokens actually typed."
          ],
          output: "5,500 cumulative input tokens (vs 1,000 typed) — history is re-billed ~5.5x."
        }
      ],
      comparison_tables: [
        {
          title: "what beginners blame vs what actually dominates",
          columns: ["Suspect", "Real impact", "Why"],
          rows: [
            { cells: ["A single long prompt", "Modest", "Input is the cheap side and sent once"] },
            { cells: ["Long outputs", "High", "Output is priced several times higher per token"] },
            { cells: ["Growing chat history", "High and sneaky", "The whole transcript is re-billed every turn"] },
            { cells: ["The model's name length", "Zero", "Names aren't billed; only tokens are"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "big cost driver vs not really",
          bins: [
            { id: "big", label: "Big cost driver" },
            { id: "small", label: "Not a real driver" }
          ],
          items: [
            { id: "i1", text: "A model that writes very long answers", bin: "big" },
            { id: "i2", text: "Resending a 30-turn transcript each reply", bin: "big" },
            { id: "i3", text: "The variable names in your code", bin: "small" },
            { id: "i4", text: "Long, growing conversation history", bin: "big" },
            { id: "i5", text: "How the response JSON is indented", bin: "small" },
            { id: "i6", text: "Capping output low to keep replies short", bin: "small" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a chat product cost far more in long sessions than short ones, even when every individual message is small?",
          sampleAnswer: "The model is stateless, so to maintain a conversation the app resends the entire transcript as input on every turn. Each new turn pays again for all the earlier messages, so even tiny messages get re-billed many times as the session grows. A long session quietly multiplies input cost through repetition, while each new answer also adds high-priced output on top — so length, not message size, is what blows up the bill."
        }
      ],
      hints: [
        "On turn N, the resent history is tokens_per_turn * N.",
        "Add history_tokens to total_input_tokens inside the loop.",
        "Print each turn's resend, then the cumulative total after the loop."
      ],
      challenge_title: "Sum the resent history",
      challenge_description: "A chat runs 6 turns. Each message is 50 tokens, and the whole transcript is resent every turn (turn N resends N*50 tokens). Compute the cumulative input tokens billed over all 6 turns and print 'cumulative input tokens: N'.",
      challenge_starter_code: `tokens_per_turn = 50
turns = 6
# TODO: sum the resent history across all turns and print the cumulative total.
`,
      challenge_solution_code: `tokens_per_turn = 50
turns = 6

total_input_tokens = 0
for turn in range(1, turns + 1):
    total_input_tokens += tokens_per_turn * turn

print(f"cumulative input tokens: {total_input_tokens}")
`,
      challenge_test_cases: [
        { input: "50 tokens/turn, 6 turns", expected_output: "cumulative input tokens: 1050", description: "50*(1+2+3+4+5+6) = 50*21 = 1050." }
      ]
    },
    {
      id: "ai-21-l4",
      project_id: "ai-21",
      order: 4,
      title: "Cutting Costs",
      concept: "Optimization",
      xp_reward: 10,
      explanation: `You've found where the money goes: long outputs and a transcript that gets re-billed every turn. Now the satisfying part — there are a handful of simple levers that can quietly cut a bill by half or more, without making the product worse. Most teams reach for an expensive model when a few of these would have done it.

## What it is

Four practical levers, roughly in order of how often they help:

1. **Trim or summarize history.** Don't resend the entire transcript forever. Keep the last few turns, or replace old turns with a short summary. This directly attacks the compounding-input problem from the last lesson.
2. **Cap max output.** Set a limit on how many tokens the reply can use. Since output is the expensive side, a sensible cap is the highest-leverage single setting.
3. **Use prompt caching.** If the same big chunk (a long system prompt, a fixed document) is sent on every call, providers can **cache** it so repeats are billed at a steep discount instead of full price.
4. **Choose a smaller, cheaper model.** When the task is easy — classification, short rewrites, simple extraction — a smaller model often does it fine for a fraction of the price. Save the big model for when quality truly needs it.

## How it works

These levers reduce the token counts (or their price) on each side of the bill. For example, trimming history from 10 resent turns down to the last 3:

\`\`\`python
tokens_per_turn = 100
full_history = tokens_per_turn * 10   # resend everything
trimmed_history = tokens_per_turn * 3 # keep only the last 3 turns
saved = full_history - trimmed_history
print(f"saved {saved} input tokens this turn")  # saved 700 input tokens this turn
\`\`\`

## Why it matters

The order matters: history trimming and an output cap are free to apply and hit the two biggest drivers head-on. Caching helps when you repeat a large fixed prefix. Model choice is the heaviest hammer — huge savings, but only when the smaller model's quality is good enough for the job. Reach for the cheap levers first; downgrade the model last, and only after checking it still works.

## The mental model to keep

**Cut what you resend, cap what you generate, cache what repeats, and downgrade the model only when quality allows.**`,
      key_terms: [
        { term: "History trimming", definition: "Keeping only recent turns (or a summary) instead of resending the whole transcript, to cut input cost." },
        { term: "Max output cap", definition: "A limit on how many tokens a reply may use, controlling the expensive output side." },
        { term: "Prompt caching", definition: "Reusing a repeated large prompt prefix at a discounted rate instead of paying full price each call." }
      ],
      callouts: [
        { type: "tip", title: "Cap output first", content: "Setting a max output limit is the single highest-leverage move, because output is the priciest side. It's one setting and it caps your worst case.", position: "before" },
        { type: "insight", title: "Downgrade the model last", content: "Switching to a smaller model saves the most but risks quality. Try the free levers — trim history, cap output, cache repeats — before reaching for a different model.", position: "after" }
      ],
      concept_diagram: {
        title: "Four levers, cheapest effort first",
        steps: [
          { label: "Trim history", desc: "Resend recent turns or a summary, not everything." },
          { label: "Cap output", desc: "Limit reply length to control the expensive side." },
          { label: "Cache repeats", desc: "Discount a fixed prompt prefix sent every call." },
          { label: "Pick a smaller model", desc: "Use a cheaper model when quality still holds." }
        ]
      },
      inline_quizzes: [
        {
          question: "Which single setting most directly controls the expensive side of the bill?",
          options: ["A cap on max output tokens", "A longer system prompt", "A bigger context window"],
          correct_index: 0,
          explanation: "Output tokens are the pricey side, so capping max output is the highest-leverage single setting."
        }
      ],
      quiz_questions: [
        {
          question: "Which lever directly attacks the compounding cost of chat history?",
          options: [
            "Capping max output",
            "Trimming or summarizing old turns instead of resending all of them",
            "Using a longer system prompt",
            "Asking the model more questions"
          ],
          correct_index: 1,
          explanation: "Resending the whole transcript compounds input cost; trimming or summarizing it cuts that directly."
        },
        {
          question: "When is prompt caching most useful?",
          options: [
            "When every prompt is completely different",
            "When the same large chunk (e.g., a long system prompt) is sent on every call",
            "When you never reuse any text",
            "Only for output tokens"
          ],
          correct_index: 1,
          explanation: "Caching discounts a repeated fixed prefix, so it pays off when you resend the same large chunk each call."
        },
        {
          question: "What's the right time to switch to a smaller, cheaper model?",
          options: [
            "Always, for every task, regardless of quality",
            "Never, bigger is always better",
            "When the task is simple enough that the smaller model's quality is still good enough",
            "Only when the bigger model is unavailable"
          ],
          correct_index: 2,
          explanation: "A smaller model saves a lot but risks quality, so use it when the task is easy and quality still holds."
        }
      ],
      participation_activities: [
        {
          activity_title: "Cost-cutting check",
          questions: [
            { question: "Capping the maximum output length lowers cost because output is the expensive side.", type: "true_false", correct_answer: "true", explanation: "Output tokens are priced highest, so limiting them directly reduces the bill." },
            { question: "Reusing a repeated large prompt prefix at a discount is called prompt ______.", type: "fill_in", correct_answer: "caching", explanation: "Prompt caching bills a repeated fixed prefix at a reduced rate." }
          ]
        }
      ],
      starter_code: `# Compare resending full history vs only the last few turns.
tokens_per_turn = 100
turns_so_far = 10
keep_recent = 3

# TODO: compute full_history, trimmed_history, and the input tokens saved this turn.
print("turns so far:", turns_so_far)
`,
      solution_code: `tokens_per_turn = 100
turns_so_far = 10
keep_recent = 3

full_history = tokens_per_turn * turns_so_far
trimmed_history = tokens_per_turn * keep_recent
saved = full_history - trimmed_history

print("full history tokens:", full_history)
print("trimmed history tokens:", trimmed_history)
print("saved input tokens:", saved)
`,
      expected_output: `full history tokens: 1000
trimmed history tokens: 300
saved input tokens: 700`,
      step_throughs: [
        {
          title: "trimming history to cut cost",
          steps: [
            { label: "Measure the full resend", detail: "Without trimming, every one of the 10 turns is resent as input this turn.", code: "full_history = 100 * 10 = 1000 tokens" },
            { label: "Decide what to keep", detail: "Keep only the last few turns; older ones get dropped or summarized.", code: "keep_recent = 3" },
            { label: "Measure the trimmed resend", detail: "Now only 3 turns are resent, slashing the input for this turn.", code: "trimmed_history = 100 * 3 = 300 tokens" },
            { label: "Count the savings", detail: "The difference is pure savings, repeated on every future turn of the chat.", code: "saved = 1000 - 300 = 700 tokens" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A reply normally uses 800 output tokens, but you cap it at 200. Output is $15/1M. How much do you save per call on output?",
          steps: [
            "Tokens saved: 800 - 200 = 600 output tokens.",
            "Convert to dollars: 600 / 1,000,000 x $15 = $0.009.",
            "That's saved on every single call the cap applies to."
          ],
          output: "$0.009 saved per call"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A task currently uses a model at $15/1M output for a 300-token reply. A smaller model at $0.60/1M output handles it fine. What's the per-call output cost before and after, and the saving?",
          steps: [
            "Before: 300 / 1,000,000 x $15 = $0.0045 per call.",
            "After: 300 / 1,000,000 x $0.60 = $0.00018 per call.",
            "Saving per call: $0.0045 - $0.00018 = $0.00432.",
            "That's about a 96% cut on output cost — but only valid because the smaller model's quality was good enough."
          ],
          output: "Before $0.0045, after $0.00018, saving $0.00432 (~96%) when quality allows."
        }
      ],
      comparison_tables: [
        {
          title: "the four cost-cutting levers",
          columns: ["Lever", "What it cuts", "Risk / when to use"],
          rows: [
            { cells: ["Trim/summarize history", "Compounding input", "Low risk; use whenever chats get long"] },
            { cells: ["Cap max output", "Expensive output", "Low risk; set a sensible default"] },
            { cells: ["Prompt caching", "Repeated prefix cost", "Use when a big chunk repeats every call"] },
            { cells: ["Smaller model", "Everything (rate)", "Highest savings, but check quality first"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "cuts cost vs raises cost",
          bins: [
            { id: "cut", label: "Cuts cost" },
            { id: "raise", label: "Raises cost" }
          ],
          items: [
            { id: "i1", text: "Summarizing old turns instead of resending them", bin: "cut" },
            { id: "i2", text: "Setting a max output token cap", bin: "cut" },
            { id: "i3", text: "Resending the entire transcript every turn", bin: "raise" },
            { id: "i4", text: "Caching a fixed system prompt", bin: "cut" },
            { id: "i5", text: "Letting replies run as long as they want", bin: "raise" },
            { id: "i6", text: "Using a smaller model on an easy task", bin: "cut" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why should switching to a smaller model usually be the last lever you reach for, not the first?",
          sampleAnswer: "Changing the model is the only lever that risks the quality of the output — a smaller model might handle an easy task fine but fail on a hard one, and you won't know until you check. The other levers (trimming history, capping output, caching a repeated prefix) cut cost without changing what the model is capable of, so they're safe to apply first. You downgrade the model only after the cheap, risk-free levers, and only once you've confirmed the smaller model still meets your quality bar."
        }
      ],
      hints: [
        "full_history = tokens_per_turn * turns_so_far.",
        "trimmed_history = tokens_per_turn * keep_recent.",
        "saved is the difference between the full and trimmed history."
      ],
      challenge_title: "Measure the savings from trimming",
      challenge_description: "A chat resends history at 120 tokens per turn. After 8 turns you switch from resending all turns to keeping only the last 2. Compute the input tokens saved this turn and print 'saved input tokens: N'.",
      challenge_starter_code: `tokens_per_turn = 120
turns_so_far = 8
keep_recent = 2
# TODO: compute full vs trimmed history and the tokens saved this turn.
`,
      challenge_solution_code: `tokens_per_turn = 120
turns_so_far = 8
keep_recent = 2

full_history = tokens_per_turn * turns_so_far
trimmed_history = tokens_per_turn * keep_recent
saved = full_history - trimmed_history

print(f"saved input tokens: {saved}")
`,
      challenge_test_cases: [
        { input: "120 tokens/turn, 8 turns, keep 2", expected_output: "saved input tokens: 720", description: "full 120*8=960, trimmed 120*2=240, saved 960-240=720." }
      ]
    }
  ]
};
