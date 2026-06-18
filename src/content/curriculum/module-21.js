export default {
  project: {
    id: "ai-21",
    title: "Cost & Token Budgeting",
    description: "Learn how LLM billing actually works so you can estimate, predict, and cut the cost of every API call.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
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
      challenge_title: "The Billing Meter",
      challenge_description: "Bill a batch of API calls per token, then flag the single most expensive call — the exact report your finance team needs before the first invoice lands.",
      challenge_story: "Your AI feature went live last night and the logs are already filling up. Finance wants two numbers before the billing cycle closes: **what the whole batch cost**, and **which single call was the most expensive** so the team can investigate runaway prompts. Each log line records a call's id, its input tokens (the prompt you sent) and its output tokens (the model's reply). Input and output are billed at **different per-million rates**, and output is the pricey one. Build the meter that turns the raw log into those two numbers — exactly, to the cent and beyond.",
      challenge_statement: "You are given the input and output **per-million** prices and a batch of logged API calls. For each call, its cost in dollars is:\n\n```\ncost = (input_tokens * input_price + output_tokens * output_price) / 1_000_000\n```\n\nDo two things:\n\n1. Print the **total cost of the whole batch**, formatted to exactly **6 decimal places**, prefixed with `$`.\n2. Print the **id of the single most expensive call**. If two calls tie on cost, print the **smaller id**.\n\nUse exact arithmetic — the prices and token counts are integers, so the cost numerator is an integer; divide only at the end to avoid floating-point drift.",
      challenge_input_format: "The first line has three integers: `n input_price output_price` — the number of calls and the two per-million prices (in whole dollars).\n\nEach of the next `n` lines has three integers: `id input_tokens output_tokens`.",
      challenge_output_format: "Two lines. Line 1: `$` followed by the total batch cost to exactly 6 decimal places. Line 2: the id of the most expensive call (smaller id wins ties).",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ input_price ≤ 1000",
        "1 ≤ output_price ≤ 1000",
        "1 ≤ id ≤ 1000000, ids are distinct",
        "0 ≤ input_tokens, output_tokens ≤ 1000000",
      ],
      challenge_examples: [
        { input: "3 3 15\n1 1500 800\n2 500 2000\n3 1000 100", output: "$0.052500\n2", explanation: "Costs (in numerator form): call 1 = 1500·3+800·15 = 16500, call 2 = 31500, call 3 = 4500. Total 52500 → $0.052500. Call 2 is dearest." },
        { input: "2 5 10\n1 100 100\n2 100 100", output: "$0.003000\n1", explanation: "Both calls cost the same (1500 each), so the tie breaks to the smaller id, 1." },
      ],
      challenge_notes: "Output tokens cost more than input tokens — in real apps the reply, not the prompt, usually dominates the bill. Because every price and token count is an integer, the cost numerator `input_tokens*input_price + output_tokens*output_price` is an exact integer; sum those, then divide by 1,000,000 once at the end so rounding can't drift over 100k calls.",
      challenge_hints: [
        "Keep a running integer sum of each call's numerator (input·in_price + output·out_price); divide by 1,000,000 only when you print.",
        "Track the best (largest) numerator seen and its id; on a tie, keep the row with the smaller id.",
        "Format the dollars with an f-string like `f\"\${total:.6f}\"`, or use Decimal for guaranteed exact rounding.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    # TODO: for each of the n calls, accumulate the total cost numerator
    #       and track the most expensive call's id (smaller id wins ties).
    #       Print "$<total to 6 decimals>" then the winning id.

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    best_id = -1
    best_num = -1
    grand_num = 0
    for _ in range(n):
        cid = int(data[idx]); idx += 1
        in_tok = int(data[idx]); idx += 1
        out_tok = int(data[idx]); idx += 1
        num = in_tok * in_price + out_tok * out_price
        grand_num += num
        if num > best_num or (num == best_num and cid < best_id):
            best_num = num
            best_id = cid
    total = (Decimal(grand_num) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${total}")
    print(best_id)

main()
`,
      challenge_test_cases: [
        { input: "3 3 15\n1 1500 800\n2 500 2000\n3 1000 100", expected_output: "$0.052500\n2", description: "Batch total plus the most expensive call (call 2 dominated by output tokens)." },
        { input: "2 5 10\n1 100 100\n2 100 100", expected_output: "$0.003000\n1", description: "Cost tie resolves to the smaller id." },
        { input: "1 3 15\n7 1000000 1000000", expected_output: "$18.000000\n7", description: "Single max-size call: 1M input + 1M output = $18 exactly." },
        { input: "2 1 1\n9 0 0\n4 0 0", expected_output: "$0.000000\n4", description: "Zero-token calls cost nothing; the tie still breaks to the smaller id." }
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
      challenge_title: "The Pre-Flight Estimator",
      challenge_description: "Estimate a batch of calls before you ship — turn raw prompt text into token counts, price the run, and count how many calls would blow a per-call budget cap.",
      challenge_story: "Before your team ships a new AI endpoint, the rule is simple: **estimate the bill first**. You don't have the model's real tokenizer in your planning script, so you use the standard back-of-envelope rule — about **4 characters per token** — and round partial tokens **up**. Each planned call has a known prompt (you wrote it) and a hard cap on the reply length (you set it). Product also handed you a **per-call budget**: any single call estimated to cost *more* than the cap is a red flag worth reviewing before launch. Build the estimator that prices the whole batch and counts the red flags.",
      challenge_statement: "You are given the per-million prices, a per-call budget, and a list of planned calls. For each call:\n\n1. Estimate its **input tokens** as `ceil(len(prompt) / 4)` (round partial tokens up).\n2. Its **output tokens** are exactly the given cap.\n3. Its estimated cost is `(input_tokens * input_price + output_tokens * output_price) / 1_000_000`.\n\nDo two things:\n\n1. Print the **total estimated cost** of the batch to exactly **6 decimal places**, prefixed with `$`.\n2. Print how many calls have an estimated cost **strictly greater than** the budget.",
      challenge_input_format: "The first line has three integers: `n input_price output_price`.\n\nThe second line is the budget as a decimal dollar amount with 6 decimal places (e.g. `0.001000`).\n\nEach of the next `n` lines describes one call: the prompt text (which may contain spaces) followed by a single space and an integer — the output token cap. Split on the **last** space so prompt text stays intact.",
      challenge_output_format: "Two lines. Line 1: `$` followed by the total estimated cost to exactly 6 decimal places. Line 2: the count of calls strictly over budget.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ input_price, output_price ≤ 1000",
        "0 ≤ output token cap ≤ 1000000",
        "1 ≤ len(prompt) ≤ 1000; the prompt contains no leading/trailing spaces",
        "0.000000 ≤ budget ≤ 1000.000000",
      ],
      challenge_examples: [
        { input: "3 3 15\n0.001000\nWhat is the capital of France 50\nSummarize this very long document please now 200\nhi 10", output: "$0.003960\n1", explanation: "Prompts are 29, 44, 2 chars → 8, 11, 1 input tokens. Numerators: 8·3+50·15=774, 11·3+200·15=3033, 1·3+10·15=153 → total 3960 → $0.003960. Only call 2 ($0.003033) exceeds the $0.001 budget." },
        { input: "2 3 15\n0.000000\nabcd 0\nabcdefgh 0", output: "$0.000009\n2", explanation: "1 and 2 input tokens, no output. Numerators 3 and 6 → total 9 → $0.000009. Both exceed a $0 budget." },
      ],
      challenge_notes: "The 4-chars-per-token rule is a planning heuristic, not the real tokenizer — but it's accurate enough to catch budget blowups before you spend a cent. Rounding partial tokens **up** is the safe direction for an estimate: you'd rather over-predict the bill than be surprised by it. Keep the cost numerator as an integer and divide once at the end.",
      challenge_hints: [
        "Read the budget once as a Decimal so you can compare costs exactly without float rounding.",
        "Split each call line with `rsplit(\" \", 1)` so a prompt containing spaces stays in one piece and the trailing integer comes off cleanly.",
        "`math.ceil(len(prompt) / 4)` gives the estimated input tokens; compare each call's cost with `>` (strictly greater) against the budget.",
      ],
      challenge_starter_code: `import sys
import math

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    n = int(first[0]); in_price = int(first[1]); out_price = int(first[2])
    budget_line = data[idx].strip(); idx += 1
    # TODO: for each of the n calls, estimate input tokens from the prompt length,
    #       add output cap, accumulate total cost, and count calls over budget.

main()
`,
      challenge_solution_code: `import sys
import math
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    n = int(first[0]); in_price = int(first[1]); out_price = int(first[2])
    budget = Decimal(data[idx].strip()); idx += 1
    total_num = 0
    over_count = 0
    for _ in range(n):
        parts = data[idx].rsplit(" ", 1); idx += 1
        prompt_text = parts[0]
        max_out = int(parts[1])
        est_in = math.ceil(len(prompt_text) / 4)
        num = est_in * in_price + max_out * out_price
        total_num += num
        cost = Decimal(num) / Decimal(1000000)
        if cost > budget:
            over_count += 1
    total = (Decimal(total_num) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${total}")
    print(over_count)

main()
`,
      challenge_test_cases: [
        { input: "3 3 15\n0.001000\nWhat is the capital of France 50\nSummarize this very long document please now 200\nhi 10", expected_output: "$0.003960\n1", description: "Batch estimate with one call over the per-call budget." },
        { input: "2 3 15\n0.000000\nabcd 0\nabcdefgh 0", expected_output: "$0.000009\n2", description: "Zero output caps; both calls exceed a $0 budget." },
        { input: "1 3 15\n1.000000\na 1", expected_output: "$0.000018\n0", description: "Single tiny call (1 input token, 1 output) well under a generous budget." },
        { input: "1 1000 1000\n0.001000\nabcd 1", expected_output: "$0.002000\n1", description: "High prices push even a tiny call over budget: (1+1)·1000 = 2000 → $0.002000." }
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
      challenge_title: "The Stateless Transcript",
      challenge_description: "Replay a real chat session turn by turn, billing the whole transcript that gets resent every turn — then find the turn where the input bill peaked.",
      challenge_story: "The model is **stateless**: it remembers nothing between turns, so your chat app resends the **entire transcript** as input on every single turn to keep the conversation coherent. That means early messages get re-billed again and again as the session grows — the quiet way long chats blow up a budget. You're profiling a real session for the team. Each turn has a user message of some size and a model reply of some size, and there's a fixed **system prompt** prepended to the input every turn. Walk the session, total the input tokens billed across all turns, and pinpoint the turn where a single request's input was largest.",
      challenge_statement: "A session runs `t` turns. A fixed **system prompt** of `s` tokens is part of the input on every turn. On turn `k` (1-indexed), the input sent to the model is:\n\n```\nsystem prompt  +  all user messages from turns 1..k  +  all model replies from turns 1..k-1\n```\n\n(The current turn's user message is included; that turn's reply hasn't been generated yet, so it isn't.)\n\nDo two things:\n\n1. Print the **cumulative input tokens** billed across all `t` turns (the sum of each turn's input size).\n2. Print the **turn number** whose input was largest. If two turns tie, print the **earlier** turn.",
      challenge_input_format: "The first line has two integers: `t s` — the number of turns and the system-prompt token count.\n\nEach of the next `t` lines has two integers: `user_tokens reply_tokens` for that turn, in order.",
      challenge_output_format: "Two lines. Line 1: the cumulative input tokens billed over all turns. Line 2: the turn number with the largest single-turn input (earliest wins ties).",
      challenge_constraints: [
        "1 ≤ t ≤ 100000",
        "0 ≤ s ≤ 1000000",
        "0 ≤ user_tokens, reply_tokens ≤ 1000000",
        "The cumulative total fits in a 64-bit integer.",
      ],
      challenge_examples: [
        { input: "3 20\n10 30\n15 25\n5 40", output: "210\n3", explanation: "Turn 1: 20+10 = 30. Turn 2: 20+(10+15)+30 = 75. Turn 3: 20+(10+15+5)+(30+25) = 105. Cumulative 30+75+105 = 210. The input grows every turn, so turn 3 is the peak." },
        { input: "2 100\n10 10\n10 10", output: "240\n2", explanation: "Turn 1: 100+10 = 110. Turn 2: 100+20+10 = 130. Total 240; turn 2 carries the heavier transcript." },
      ],
      challenge_notes: "Because the input is monotonically growing in this model, the last turn is usually the peak — but the explicit peak-finding makes the cost of a long session concrete. This is exactly why **trimming or summarizing history** is the first cost lever teams reach for: every token you stop resending is re-saved on every future turn.",
      challenge_hints: [
        "Keep a running sum of user tokens seen and a running sum of replies seen; the input on turn k is `s + running_user + running_reply` computed *before* you add the current reply.",
        "Add the current turn's user tokens to the running user sum first, compute the input, then add that turn's reply to the running reply sum for next turn.",
        "Track the max input and its turn number; only update on a strictly larger value so the earliest peak wins ties.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    t = int(first[0]); s = int(first[1])
    # TODO: walk the t turns, accumulating the resent transcript size each turn.
    #       Print the cumulative input tokens, then the peak turn (earliest wins ties).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    first = data[idx].split(); idx += 1
    t = int(first[0]); s = int(first[1])
    total_input = 0
    running_user = 0
    running_reply = 0
    peak_input = -1
    peak_turn = 0
    for k in range(1, t + 1):
        parts = data[idx].split(); idx += 1
        user_tok = int(parts[0])
        reply_tok = int(parts[1])
        running_user += user_tok
        input_this = s + running_user + running_reply
        total_input += input_this
        if input_this > peak_input:
            peak_input = input_this
            peak_turn = k
        running_reply += reply_tok
    print(total_input)
    print(peak_turn)

main()
`,
      challenge_test_cases: [
        { input: "3 20\n10 30\n15 25\n5 40", expected_output: "210\n3", description: "Growing transcript; cumulative input billed and peak turn." },
        { input: "2 100\n10 10\n10 10", expected_output: "240\n2", description: "Fixed system prompt dominates; turn 2 carries more history." },
        { input: "1 0\n50 50", expected_output: "50\n1", description: "Single turn, no system prompt: only the first user message is billed." },
        { input: "4 0\n0 0\n0 0\n0 0\n0 0", expected_output: "0\n1", description: "All-zero session: cumulative 0, and the earliest turn wins the peak tie." }
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
      challenge_title: "The Optimization Audit",
      challenge_description: "Run a before/after audit on a chat feature: apply two cost levers — trim history to the last K turns and cap the reply length — then report the input tokens, output tokens, and dollars saved.",
      challenge_story: "Your chat feature works, but the bill is climbing, so you run an optimization audit before the next billing cycle. You have two safe levers that don't touch model quality: **trim the resent history** down to the last `K` turns (instead of resending the whole transcript every turn), and **cap each reply** at a fixed output length (instead of letting answers run as long as they want). You project the feature over `t` turns under both the baseline and the optimized plan, then hand the team three numbers: input tokens saved, output tokens saved, and dollars saved. Numbers that justify the change.",
      challenge_statement: "A feature is projected over `t` turns. Each turn adds `m` tokens of history, so under the **baseline** plan turn `k` resends `m * k` input tokens (the full transcript). Under the **optimized** plan, turn `k` resends only the last `K` turns: `m * min(k, K)` input tokens.\n\nFor output: the **baseline** lets each reply run to `out_full` tokens; the **optimized** plan caps each reply at `out_cap` tokens. Every turn produces one reply.\n\nCompute, summed across all `t` turns:\n\n1. `saved_input`  = baseline input tokens − optimized input tokens.\n2. `saved_output` = baseline output tokens − optimized output tokens.\n3. `saved_cost`   = `(saved_input * input_price + saved_output * output_price) / 1_000_000`.\n\nPrint `saved_input`, then `saved_output`, then `$saved_cost` to exactly 6 decimal places.",
      challenge_input_format: "The first line has five integers: `t m K input_price output_price` — turns, tokens added per turn, history window, and the two per-million prices.\n\nThe second line has two integers: `out_full out_cap` — the baseline reply length and the capped reply length.",
      challenge_output_format: "Three lines: `saved_input`, then `saved_output`, then `$` followed by the dollars saved to exactly 6 decimal places.",
      challenge_constraints: [
        "1 ≤ t ≤ 100000",
        "1 ≤ m ≤ 1000000",
        "1 ≤ K ≤ t",
        "1 ≤ input_price, output_price ≤ 1000",
        "0 ≤ out_cap ≤ out_full ≤ 1000000",
      ],
      challenge_examples: [
        { input: "8 120 2 3 15\n300 100", output: "2520\n1600\n$0.031560", explanation: "Baseline input = 120·(1+…+8) = 4320; optimized = 120·(1+2+2+2+2+2+2+2) = 1800 → saved 2520. Output: 300·8 − 100·8 = 1600 saved. Cost: (2520·3 + 1600·15)/1e6 = 31560/1e6 = $0.031560." },
        { input: "3 100 1 3 15\n200 50", output: "300\n450\n$0.007650", explanation: "Baseline input 100·(1+2+3)=600; optimized 100·(1+1+1)=300 → 300 saved. Output 200·3 − 50·3 = 450. Cost (300·3+450·15)/1e6 = 7650/1e6 = $0.007650." },
      ],
      challenge_notes: "Trimming history and capping output are the **first** levers to reach for because they cut cost without changing what the model can do — unlike switching to a smaller model, which risks output quality. Notice how the savings compound: trimming a per-turn history of `m` saves on every future turn beyond the window `K`, which is why long sessions benefit most.",
      challenge_hints: [
        "Baseline input is `m * (1+2+…+t)`; optimized input is `m * sum(min(k, K) for k in 1..t)`. A loop is fine, or use the closed form.",
        "Output is simpler: baseline `out_full * t`, optimized `out_cap * t`.",
        "Build the saved-cost numerator as `saved_input*input_price + saved_output*output_price` (an exact integer), then divide by 1,000,000 once at the end.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    t = int(first[0]); m = int(first[1]); K = int(first[2])
    in_price = int(first[3]); out_price = int(first[4])
    second = data[1].split()
    out_full = int(second[0]); out_cap = int(second[1])
    # TODO: sum baseline vs optimized input/output across t turns,
    #       then print saved_input, saved_output, and "$<saved_cost to 6 decimals>".

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    t = int(first[0]); m = int(first[1]); K = int(first[2])
    in_price = int(first[3]); out_price = int(first[4])
    second = data[1].split()
    out_full = int(second[0]); out_cap = int(second[1])
    base_in = 0
    opt_in = 0
    for k in range(1, t + 1):
        base_in += m * k
        opt_in += m * min(k, K)
    base_out = out_full * t
    opt_out = out_cap * t
    saved_in = base_in - opt_in
    saved_out = base_out - opt_out
    saved_num = saved_in * in_price + saved_out * out_price
    saved_cost = (Decimal(saved_num) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(saved_in)
    print(saved_out)
    print(f"\${saved_cost}")

main()
`,
      challenge_test_cases: [
        { input: "8 120 2 3 15\n300 100", expected_output: "2520\n1600\n$0.031560", description: "Both levers applied over 8 turns; full savings report." },
        { input: "3 100 1 3 15\n200 50", expected_output: "300\n450\n$0.007650", description: "Window of 1 keeps only the current turn's history." },
        { input: "1 50 1 3 15\n100 100", expected_output: "0\n0\n$0.000000", description: "Single turn with no cap change: nothing is saved." },
        { input: "5 200 2 3 15\n400 400", expected_output: "1200\n0\n$0.003600", description: "History trimmed but output cap unchanged: only input savings." }
      ]
    },
    {
      id: "ai-21-l5",
      project_id: "ai-21",
      order: 5,
      title: "Input vs Output Cost",
      concept: "Pricing",
      xp_reward: 10,
      explanation: `Two engineers send the model the same 4,000 tokens. One puts almost all of it in the prompt and asks for a one-word answer. The other sends a tiny prompt and lets the model write a 4,000-token essay. Identical token totals, wildly different bills. The second call can cost five times the first. That gap has a name: **asymmetric pricing**.

## What it is

LLM pricing is **asymmetric**: input tokens and output tokens are billed at *different* rates, and output is almost always the expensive side. A common pattern is something like \\$3 per million input tokens against \\$15 per million output tokens — a clean **5x** gap. The provider charges more to *generate* text than to *read* it.

This means the token total alone tells you almost nothing. A call's cost depends on *which side* the tokens land on. Shift tokens from output to input and the same workload gets cheaper.

## How it works

Cost is two products added together — never one flat per-token rate:

\`\`\`python
input_tokens = 3000
output_tokens = 800
input_price = 3     # dollars per 1,000,000 input tokens
output_price = 15   # dollars per 1,000,000 output tokens

input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost

print(f"input:  \${input_cost:.6f}")
print(f"output: \${output_cost:.6f}")   # bigger, even with fewer tokens
print(f"total:  \${total:.6f}")
\`\`\`

Here 3,000 input tokens cost \\$0.009, but just 800 output tokens cost \\$0.012 — fewer tokens, higher cost, because each output token is priced 5x higher.

## Why it matters

The asymmetry flips your intuition about where to optimize. A bloated prompt feels wasteful, but it's billed on the *cheap* meter. A model that rambles a long answer is billed on the *expensive* meter. So the highest-leverage knob is usually **how much the model writes**, not how much you send. If your bill surprises you, do the input-versus-output split first — it almost always points straight at the output side.

## The mental model to keep

**Same tokens, different sides, different bill. Output is the dear meter — watch it first.**`,
      key_terms: [
        { term: "Asymmetric pricing", definition: "Input and output tokens are billed at different rates, with output usually several times more expensive." },
        { term: "Input cost", definition: "input_tokens / 1,000,000 x input_price. The cheaper of the two meters on a call." },
        { term: "Output cost", definition: "output_tokens / 1,000,000 x output_price. Usually the larger share of the bill even with fewer tokens." },
        { term: "Price ratio", definition: "output_price / input_price, often around 3x-5x. The size of the asymmetry." }
      ],
      callouts: [
        { type: "insight", title: "Same total, different bill", content: "Two calls with identical token totals can cost 5x apart depending on whether the tokens are input or output. The split, not the sum, sets the price.", position: "before" },
        { type: "tip", title: "Move work to the cheap side", content: "If you can phrase a task so the model reads more and writes less (e.g. ask for a label, not an essay), you shift tokens to the cheap input meter and the bill drops.", position: "after" }
      ],
      concept_diagram: {
        title: "Why two equal-token calls cost differently",
        steps: [
          { label: "Count each side", desc: "Separate the call into input tokens and output tokens." },
          { label: "Apply the two rates", desc: "Input rate is low; output rate is often 5x higher." },
          { label: "Multiply per side", desc: "input_cost and output_cost are computed independently." },
          { label: "Output usually wins", desc: "Even with fewer output tokens, that side often dominates." }
        ]
      },
      inline_quizzes: [
        {
          question: "Call A is 3000 input + 500 output. Call B is 500 input + 3000 output. Same total tokens. Which costs more (input $3/1M, output $15/1M)?",
          options: ["Call A", "Call B", "They cost the same since totals match"],
          correct_index: 1,
          explanation: "Call B puts 3000 tokens on the expensive output meter, so it costs several times more despite the equal token total."
        }
      ],
      quiz_questions: [
        {
          question: "What does it mean that LLM pricing is asymmetric?",
          options: [
            "The price changes depending on the time of day",
            "Input and output tokens are billed at different per-token rates",
            "Only the first million tokens are charged",
            "Input is free and output is charged"
          ],
          correct_index: 1,
          explanation: "Asymmetric pricing means input and output have separate rates, with output usually the more expensive side."
        },
        {
          question: "A call has 2000 input and 400 output tokens, input $3/1M, output $15/1M. What is the total cost?",
          options: [
            "$0.006000",
            "$0.012000",
            "$0.012000 ... no, $0.012",
            "$0.012000 total is wrong; it is $0.012000"
          ],
          correct_index: 1,
          explanation: "Input = 2000/1M x 3 = $0.006; output = 400/1M x 15 = $0.006; total = $0.012000."
        },
        {
          question: "Given the asymmetry, what is usually the highest-leverage thing to control?",
          options: [
            "The length of the prompt you send",
            "How many tokens the model generates in its reply",
            "The name of the model",
            "The number of API keys you use"
          ],
          correct_index: 1,
          explanation: "Output is the expensive meter, so controlling how much the model writes usually moves the bill the most."
        }
      ],
      participation_activities: [
        {
          activity_title: "Asymmetry check",
          questions: [
            { question: "Two calls with the same total token count always cost the same amount.", type: "true_false", correct_answer: "false", explanation: "Cost depends on how tokens split between the cheap input meter and the expensive output meter, not just the total." },
            { question: "Because pricing is asymmetric, the ______ side of a call is usually the more expensive one.", type: "fill_in", correct_answer: "output", explanation: "Output tokens are billed at a higher rate than input tokens." }
          ]
        }
      ],
      starter_code: `# Split a call's cost into its input and output sides.
input_tokens = 3000
output_tokens = 800
input_price = 3     # $/1M
output_price = 15   # $/1M

# TODO: compute input_cost, output_cost, and total. Print each to 6 decimals.
print("input tokens:", input_tokens)
`,
      solution_code: `input_tokens = 3000
output_tokens = 800
input_price = 3     # $/1M
output_price = 15   # $/1M

input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost

print(f"input:  \${input_cost:.6f}")
print(f"output: \${output_cost:.6f}")
print(f"total:  \${total:.6f}")
`,
      expected_output: `input:  $0.009000
output: $0.012000
total:  $0.021000`,
      step_throughs: [
        {
          title: "why fewer tokens can cost more",
          steps: [
            { label: "Price the input side", detail: "3000 input tokens at the cheap rate. This is the larger token count but the smaller cost.", code: "input_cost = 3000/1_000_000 * 3  # = 0.009" },
            { label: "Price the output side", detail: "Only 800 output tokens, but at 5x the rate. Fewer tokens, bigger cost.", code: "output_cost = 800/1_000_000 * 15  # = 0.012" },
            { label: "Compare the two", detail: "The output side ($0.012) beats the input side ($0.009) despite having far fewer tokens.", code: "output_cost > input_cost  # True" },
            { label: "Add them up", detail: "Total is both meters summed. The expensive side drove most of it.", code: "total = 0.009 + 0.012  # = 0.021" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Input is $3/1M, output is $15/1M. What is the price ratio between output and input?",
          steps: [
            "Divide output price by input price: $15 / $3.",
            "That equals 5.",
            "So each output token costs 5x what an input token costs."
          ],
          output: "5x (output is five times the input rate)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You have 4000 tokens to spend. Plan A: 3500 input + 500 output. Plan B: 500 input + 3500 output. Input $3/1M, output $15/1M. Cost of each, and the gap?",
          steps: [
            "Plan A: input = 3500/1M x $3 = $0.0105; output = 500/1M x $15 = $0.0075; total = $0.018.",
            "Plan B: input = 500/1M x $3 = $0.0015; output = 3500/1M x $15 = $0.0525; total = $0.054.",
            "Same 4000 tokens both ways, but B leans on the expensive output meter.",
            "Gap: $0.054 / $0.018 = 3x. Plan B costs three times as much."
          ],
          output: "Plan A $0.018, Plan B $0.054 - a 3x gap from the same token budget."
        }
      ],
      comparison_tables: [
        {
          title: "the two meters compared",
          columns: ["Aspect", "Input meter", "Output meter"],
          rows: [
            { cells: ["What it bills", "Tokens the model reads", "Tokens the model writes"] },
            { cells: ["Typical rate", "Low (baseline)", "Often 3-5x the input rate"] },
            { cells: ["Grows when", "Prompt + history get longer", "The model writes longer answers"] },
            { cells: ["Usual bill share", "Smaller", "Larger - watch this first"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "billed on the cheap meter vs the dear meter",
          bins: [
            { id: "input", label: "Cheap (input) meter" },
            { id: "output", label: "Dear (output) meter" }
          ],
          items: [
            { id: "i1", text: "The 2-page document you paste in", bin: "input" },
            { id: "i2", text: "The model's 500-word summary back", bin: "output" },
            { id: "i3", text: "The system prompt you attach", bin: "input" },
            { id: "i4", text: "A long generated code file", bin: "output" },
            { id: "i5", text: "Prior chat history you resend", bin: "input" },
            { id: "i6", text: "Each new token the model produces", bin: "output" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does the token total of a call fail to predict its cost?",
          sampleAnswer: "Because input and output tokens are billed at different rates, the same total can land on the cheap meter or the expensive one. A call that is mostly prompt is billed mostly at the low input rate, while a call that is mostly reply is billed at the high output rate, which is often five times higher. To predict cost you have to know the split between input and output, not just the sum, because the expensive side decides most of the bill."
        }
      ],
      hints: [
        "Compute the two sides separately: input_cost uses input_price, output_cost uses output_price.",
        "Each side is tokens / 1_000_000 * its price.",
        "total is input_cost + output_cost; print each with an f-string and :.6f."
      ],
      challenge_title: "The Asymmetry Auditor",
      challenge_description: "Bill a batch of calls under asymmetric pricing, report the total, and find the call where the output side most dominated the cost - the runaway-answer suspects.",
      challenge_story: "Pricing is **asymmetric**: output tokens cost several times more than input tokens, so a call's bill is driven by *which side* its tokens fall on, not the raw total. Your team wants an audit that surfaces the calls where the **output meter** ran away. For each logged call you know its input and output tokens; input and output have separate per-million prices and output is the dear one. Bill the whole batch, then flag the single call whose **output cost made up the largest share of its own total** - the clearest sign of a model that rambled. Build the auditor.",
      challenge_statement: "You are given the input and output **per-million** prices and a batch of calls. For each call, the cost numerator (in micro-dollars, i.e. cost x 1,000,000) is:\n\n```\nnum = input_tokens * input_price + output_tokens * output_price\n```\n\nDo two things:\n\n1. Print the **total cost of the batch** to exactly **6 decimal places**, prefixed with `$`.\n2. Print the **id of the call whose output cost is the largest fraction of that call's own total cost**. The output fraction is `(output_tokens * output_price) / num`. If a call has `num == 0`, treat its output fraction as 0. On a tie, print the **smaller id**.",
      challenge_input_format: "The first line has three integers: `n input_price output_price`.\n\nEach of the next `n` lines has three integers: `id input_tokens output_tokens`.",
      challenge_output_format: "Two lines. Line 1: `$` followed by the total batch cost to exactly 6 decimal places. Line 2: the id of the call with the largest output cost share (smaller id wins ties).",
      challenge_constraints: [
        "1 <= n <= 100000",
        "1 <= input_price, output_price <= 1000",
        "1 <= id <= 1000000, ids are distinct",
        "0 <= input_tokens, output_tokens <= 1000000",
      ],
      challenge_examples: [
        { input: "3 3 15\n1 1000 1000\n2 100 900\n3 2000 0", output: "$0.037800\n2", explanation: "Output shares: call 1 = 15000/18000 = 0.833, call 2 = 13500/13800 = 0.978, call 3 = 0. Call 2's output dominates its own bill most. Total numerator 18000+13800+6000 = 37800 -> $0.037800." },
        { input: "2 2 10\n5 500 0\n9 0 100", output: "$0.002000\n9", explanation: "Call 5 is pure input (share 0); call 9 is pure output (share 1.0). Total 1000+1000 = 2000 -> $0.002000. Call 9 has the highest output share." },
      ],
      challenge_notes: "Comparing output fractions with floats can misfire on near-ties, so compare them exactly: call A beats call B when `outA * numB > outB * numA` (cross-multiplication avoids division). Keep the cost numerators as integers and divide by 1,000,000 only at the end for the total.",
      challenge_hints: [
        "For each call, num = in*in_price + out*out_price and out_cost = out*out_price; the output share is out_cost/num.",
        "To compare shares without floats, cross-multiply: out_cost_A * num_B vs out_cost_B * num_A. Bigger wins; tie breaks to the smaller id.",
        "Accumulate the total numerator as an integer and divide by 1,000,000 once at the end; use Decimal for exact 6-decimal rounding.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    # TODO: bill the batch and find the call whose output cost is the
    #       largest share of its own total. Print "$<total>" then that id.

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    grand = 0
    best_id = -1
    best_out = 0
    best_num = 1
    for _ in range(n):
        cid = int(data[idx]); idx += 1
        in_tok = int(data[idx]); idx += 1
        out_tok = int(data[idx]); idx += 1
        out_cost = out_tok * out_price
        num = in_tok * in_price + out_cost
        grand += num
        share_out = out_cost
        share_num = num if num != 0 else 1
        if num == 0:
            share_out = 0
        if best_id == -1 or share_out * best_num > best_out * share_num or (share_out * best_num == best_out * share_num and cid < best_id):
            best_id = cid
            best_out = share_out
            best_num = share_num
    total = (Decimal(grand) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${total}")
    print(best_id)

main()
`,
      challenge_test_cases: [
        { input: "3 3 15\n1 1000 1000\n2 100 900\n3 2000 0", expected_output: "$0.037800\n2", description: "Batch total plus the call whose output share is highest." },
        { input: "2 2 10\n5 500 0\n9 0 100", expected_output: "$0.002000\n9", description: "Pure-input vs pure-output call; output-heavy one wins." },
        { input: "1 3 15\n7 1000000 1000000", expected_output: "$18.000000\n7", description: "Single max-size call: $3 input + $15 output = $18 exactly." },
        { input: "2 5 5\n4 100 100\n8 100 100", expected_output: "$0.002000\n4", description: "Identical output shares (0.5 each) tie-break to the smaller id." }
      ]
    },
    {
      id: "ai-21-l6",
      project_id: "ai-21",
      order: 6,
      title: "Caching to Cut Cost",
      concept: "Caching",
      xp_reward: 10,
      explanation: `You ship a support bot with a 2,000-token system prompt: rules, tone, a product FAQ. Every single message resends that same 2,000 tokens as input. Across a million messages you pay full price for the identical text two million... no, a billion times. Prompt caching exists to stop exactly this waste - and it can cut a repeated prefix's cost by **90%**.

## What it is

**Prompt caching** lets the provider store a fixed prefix of your input - usually the long, unchanging part - and bill it at a steep discount on later calls instead of full price. The discount is large: a cached token often costs around **10% of the normal input rate**. The catch is that only a **cacheable prefix** qualifies: the part of the prompt that is byte-for-byte identical, sitting at the very front, call after call.

## How it works

You mark the stable front of the prompt - the system prompt, a fixed document - as cacheable. The first call pays full price (and sometimes a small write fee) to populate the cache. Every later call that starts with the exact same prefix reads it at the discounted rate, and only the *new* part (the user's actual question) is billed at full input price:

\`\`\`python
prefix_tokens = 2000     # the fixed system prompt, sent every call
new_tokens = 50          # the user's question, different each call
input_price = 3          # $/1M, full rate
cache_rate = 0.10        # cached tokens cost 10% of full rate

full = (prefix_tokens + new_tokens) / 1_000_000 * input_price
cached = (prefix_tokens * cache_rate + new_tokens) / 1_000_000 * input_price
print(f"full:   \${full:.6f}")
print(f"cached: \${cached:.6f}")   # the 2000-token prefix is now 90% off
\`\`\`

The bigger and more repeated the prefix, the more caching saves. A tiny prefix that changes every call cannot be cached at all.

## Why it matters

Caching turns a fixed overhead into near-zero. If 90% of your input is a stable instruction block, caching can drop your input bill by most of that block's cost without changing a word of behavior. It is the rare lever that is free to quality: the model sees the exact same prompt either way. The only requirement is keeping that prefix **stable** - reorder or edit it and you bust the cache, paying full price again.

## The mental model to keep

**Pay full price for the fixed prefix once, then read it at a discount forever - as long as you never change it.**`,
      key_terms: [
        { term: "Prompt caching", definition: "Storing a fixed input prefix so repeated calls bill it at a discounted rate instead of full price." },
        { term: "Cacheable prefix", definition: "The unchanging front portion of the prompt (e.g. a system prompt) that qualifies for the cache discount." },
        { term: "Cache rate", definition: "The discounted rate for cached tokens, often around 10% of the normal input rate." },
        { term: "Cache bust", definition: "Changing the prefix so it no longer matches, forcing full-price billing again." }
      ],
      callouts: [
        { type: "insight", title: "Repetition is the whole point", content: "Caching only pays off when the same large prefix is sent again and again. A unique prompt every call has nothing to cache.", position: "before" },
        { type: "warning", title: "Edit the prefix, lose the cache", content: "The cache matches a byte-for-byte identical prefix. Reorder instructions, add a timestamp, or tweak a word and the next call pays full price.", position: "after" }
      ],
      concept_diagram: {
        title: "How a cached call gets billed",
        steps: [
          { label: "Mark the stable prefix", desc: "The system prompt or fixed document at the front of the input." },
          { label: "First call writes the cache", desc: "Paid at full price to store the prefix." },
          { label: "Later calls read the cache", desc: "The prefix is billed at the discounted cache rate." },
          { label: "New text at full price", desc: "Only the changing part (the question) pays the normal input rate." }
        ]
      },
      inline_quizzes: [
        {
          question: "A 2000-token prefix normally costs the input rate. Cached at 10% of that rate, the prefix now costs about what fraction of before?",
          options: ["About 10% (a 90% discount)", "About 90% (a 10% discount)", "Exactly the same"],
          correct_index: 0,
          explanation: "A cache rate of 10% of full means the cached prefix costs a tenth of its old price - a 90% saving on that prefix."
        }
      ],
      quiz_questions: [
        {
          question: "What does prompt caching discount?",
          options: [
            "The output tokens the model generates",
            "A fixed input prefix that repeats across calls",
            "The number of requests per second",
            "The model's training cost"
          ],
          correct_index: 1,
          explanation: "Caching bills a repeated, unchanging input prefix at a reduced rate; it does not touch output."
        },
        {
          question: "When does prompt caching save the most money?",
          options: [
            "When every prompt is completely unique",
            "When a large prefix is identical on many calls",
            "When you only ever make one call",
            "When the output is very long"
          ],
          correct_index: 1,
          explanation: "The bigger and more repeated the cacheable prefix, the larger the savings; uniqueness or single calls gain little."
        },
        {
          question: "Why does editing your system prompt mid-deployment cost money?",
          options: [
            "Editing prompts is billed as output",
            "It busts the cache, so the prefix is billed at full price again until the new one is cached",
            "Edited prompts double the output rate",
            "The provider charges a flat editing fee"
          ],
          correct_index: 1,
          explanation: "The cache matches an exact prefix; any change means the next call no longer matches and pays full input price."
        }
      ],
      participation_activities: [
        {
          activity_title: "Caching check",
          questions: [
            { question: "Prompt caching reduces the cost of a fixed prefix that is sent on many calls.", type: "true_false", correct_answer: "true", explanation: "A repeated, unchanging prefix is billed at the discounted cache rate after the first call." },
            { question: "Caching only helps when the prefix stays byte-for-byte ______ across calls.", type: "fill_in", correct_answer: "identical", explanation: "Any change to the prefix busts the cache and forces full-price billing." }
          ]
        }
      ],
      starter_code: `# Compare full-price input vs caching a fixed prefix.
prefix_tokens = 2000    # the fixed system prompt, sent every call
new_tokens = 50         # the user's question, different each call
input_price = 3         # $/1M full input rate
cache_rate = 0.10       # cached tokens cost 10% of full rate

# TODO: compute full and cached input cost, then the savings. Print all three.
print("prefix tokens:", prefix_tokens)
`,
      solution_code: `prefix_tokens = 2000
new_tokens = 50
input_price = 3
cache_rate = 0.10

full = (prefix_tokens + new_tokens) / 1_000_000 * input_price
cached = (prefix_tokens * cache_rate + new_tokens) / 1_000_000 * input_price
saved = full - cached

print(f"full:   \${full:.6f}")
print(f"cached: \${cached:.6f}")
print(f"saved:  \${saved:.6f}")
`,
      expected_output: `full:   $0.006150
cached: $0.000750
saved:  $0.005400`,
      step_throughs: [
        {
          title: "billing a cached call, step by step",
          steps: [
            { label: "Identify the fixed prefix", detail: "The 2000-token system prompt is identical on every call - the perfect cache candidate.", code: "prefix_tokens = 2000  # unchanging" },
            { label: "Separate the new part", detail: "Only the user's question changes each call. It can never be cached.", code: "new_tokens = 50  # different every time" },
            { label: "Discount the prefix", detail: "Cached tokens bill at 10% of the full rate, so the prefix costs a tenth of before.", code: "prefix_cost = 2000 * 0.10 * 3 / 1_000_000" },
            { label: "Add full-price new text", detail: "The 50 new tokens still pay the normal input rate. Total cached cost is tiny.", code: "cached = prefix_cost + 50 * 3 / 1_000_000" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A 1000-token prefix costs $3/1M at full price. Cached at 10% of that rate, what does the prefix cost per call?",
          steps: [
            "Full prefix cost: 1000/1M x $3 = $0.003.",
            "Cached rate is 10% of full, so multiply by 0.10.",
            "Cached prefix cost: $0.003 x 0.10 = $0.0003."
          ],
          output: "$0.0003 per call (down from $0.003)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A bot sends a 4000-token fixed prefix plus a 100-token question, 50,000 times a day. Input $3/1M, cache rate 10% of full. What is the daily input saving from caching the prefix?",
          steps: [
            "Full prefix cost per call: 4000/1M x $3 = $0.012.",
            "Cached prefix cost per call: $0.012 x 0.10 = $0.0012.",
            "Saving per call: $0.012 - $0.0012 = $0.0108 (the 100-token question is unaffected).",
            "Daily saving: $0.0108 x 50,000 = $540 per day."
          ],
          output: "About $540 saved per day (~$16,200/month) on the prefix alone."
        }
      ],
      comparison_tables: [
        {
          title: "full price vs cached prefix",
          columns: ["Part of the call", "Without caching", "With caching"],
          rows: [
            { cells: ["Fixed prefix (system prompt)", "Full input rate every call", "~10% of input rate after the first call"] },
            { cells: ["New text (the question)", "Full input rate", "Full input rate (cannot be cached)"] },
            { cells: ["Best case", "No savings", "Big savings when prefix is large and stable"] },
            { cells: ["What you must keep", "Nothing special", "The prefix byte-for-byte identical"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "cacheable vs not cacheable",
          bins: [
            { id: "cache", label: "Cacheable (repeats, stable)" },
            { id: "no", label: "Not cacheable" }
          ],
          items: [
            { id: "i1", text: "A fixed 2000-token system prompt", bin: "cache" },
            { id: "i2", text: "The user's unique question this turn", bin: "no" },
            { id: "i3", text: "A standing product FAQ sent every call", bin: "cache" },
            { id: "i4", text: "A timestamp injected into the prefix", bin: "no" },
            { id: "i5", text: "A fixed legal disclaimer at the front", bin: "cache" },
            { id: "i6", text: "Instructions reshuffled on every request", bin: "no" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is prompt caching considered a free lever for quality, unlike switching to a smaller model?",
          sampleAnswer: "Caching does not change what the model sees or does - the exact same prompt is sent either way, just billed at a discount for the repeated prefix. So the model's output is identical with or without the cache, meaning there is no quality risk at all. Switching to a smaller model, by contrast, changes the model's capability and can degrade answers. Caching only requires keeping the prefix stable, which costs nothing, so it is the safe lever to reach for before any change that touches behavior."
        }
      ],
      hints: [
        "full input cost uses (prefix_tokens + new_tokens) at the normal rate.",
        "cached cost charges prefix_tokens at cache_rate of the price, plus new_tokens at full price.",
        "saved is full minus cached; print all three with :.6f."
      ],
      challenge_title: "The Cache Ledger",
      challenge_description: "Bill a batch both ways - full price and with a cached shared prefix - then report what caching saved across the whole run.",
      challenge_story: "Your bot prepends the same **cacheable prefix** of `p` tokens to every request, then adds the user's unique input. Prompt caching bills that prefix at a steep discount on repeats, so you want a ledger that proves the savings before you flip it on. For each logged call you know its **total input tokens** (prefix plus new text) and its output tokens. Compute the batch cost with no caching, the cost with the prefix cached at a given discounted rate, and the dollars saved. Output is billed identically either way - caching only touches the input prefix.",
      challenge_statement: "You are given: `base` (full input price per 1M), `cache_pct` (the cached prefix is billed at `cache_pct` **percent** of `base`), `out_price` (output price per 1M), and `p` (the shared prefix token count, present in every call's input). Then a batch of calls, each with `in_tok` total input tokens (the prefix is the first `p` of them, guaranteed `in_tok >= p`) and `out_tok` output tokens.\n\nFor each call:\n\n- **Full** input cost numerator: `in_tok * base`.\n- **Cached** input: the prefix `p` tokens bill at `cache_pct%` of base, the remaining `in_tok - p` tokens at full base.\n- Output numerator (same both ways): `out_tok * out_price`.\n\nPrint three lines:\n\n1. `$` + the **full** total cost (no caching) to 6 decimals.\n2. `$` + the **cached** total cost to 6 decimals.\n3. `$` + the **dollars saved** (full minus cached) to 6 decimals.",
      challenge_input_format: "The first line has five integers: `n base cache_pct out_price p`.\n\nEach of the next `n` lines has two integers: `in_tok out_tok` (with `in_tok >= p`).",
      challenge_output_format: "Three lines, each `$` followed by a dollar amount to exactly 6 decimal places: full cost, cached cost, then dollars saved.",
      challenge_constraints: [
        "1 <= n <= 100000",
        "1 <= base, out_price <= 1000",
        "0 <= cache_pct <= 100",
        "0 <= p <= 1000000",
        "p <= in_tok <= 2000000, 0 <= out_tok <= 1000000",
      ],
      challenge_examples: [
        { input: "2 3 10 15 1000\n1500 200\n1200 500", output: "$0.018600\n$0.013200\n$0.005400", explanation: "Full: call1 1500*3+200*15=7500, call2 1200*3+500*15=11100, total 18600 -> $0.018600. Cached: prefix 1000 at 10% of 3 = 0.3/token, so call1 input = 1000*0.3+500*3 = 1800, +3000 out = 4800; call2 = 1000*0.3+200*3+7500 = 8400; total 13200 -> $0.013200. Saved 5400 -> $0.005400." },
        { input: "1 4 0 10 500\n500 0", output: "$0.002000\n$0.000000\n$0.002000", explanation: "Whole input is the prefix and cache_pct is 0, so the cached input is free: full 500*4=2000 -> $0.002000, cached $0, saved $0.002000." },
      ],
      challenge_notes: "Keep arithmetic exact by scaling: the cached prefix cost `p * base * cache_pct` is integer if you treat it as hundredths (since cache_pct is a percent), so multiply everything by 100 and divide by 100,000,000 at the end, or use Decimal throughout. The bigger the prefix `p` relative to the new text, the larger the saving - which is why teams push as much fixed instruction as possible into the cacheable front of the prompt.",
      challenge_hints: [
        "Full input per call is in_tok*base. Cached input is p*base*(cache_pct/100) + (in_tok-p)*base.",
        "To stay exact, compute the cached numerator scaled by 100: p*base*cache_pct + (in_tok-p)*base*100, then divide by 100,000,000.",
        "Output (out_tok*out_price) is identical in both totals; saved = full - cached.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    base = int(data[idx]); idx += 1
    cache_pct = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    p = int(data[idx]); idx += 1
    # TODO: accumulate full and cached numerators across the n calls,
    #       then print full cost, cached cost, and dollars saved.

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    base = int(data[idx]); idx += 1
    cache_pct = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    p = int(data[idx]); idx += 1
    full_num = 0
    cached_num_scaled = 0  # scaled by 100
    out_num = 0
    for _ in range(n):
        in_tok = int(data[idx]); idx += 1
        out_tok = int(data[idx]); idx += 1
        full_num += in_tok * base
        rest = in_tok - p
        cached_num_scaled += p * base * cache_pct + rest * base * 100
        out_num += out_tok * out_price
    full_total_num = full_num + out_num
    cached_total_scaled = cached_num_scaled + out_num * 100
    full = (Decimal(full_total_num) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    cached = (Decimal(cached_total_scaled) / Decimal(100000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    saved = (Decimal(full_total_num) - Decimal(cached_total_scaled) / Decimal(100)) / Decimal(1000000)
    saved = saved.quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${full}")
    print(f"\${cached}")
    print(f"\${saved}")

main()
`,
      challenge_test_cases: [
        { input: "2 3 10 15 1000\n1500 200\n1200 500", expected_output: "$0.018600\n$0.013200\n$0.005400", description: "Prefix cached at 10% of base across two calls; full, cached, and savings." },
        { input: "1 4 0 10 500\n500 0", expected_output: "$0.002000\n$0.000000\n$0.002000", description: "Entire input is a free (0%) cached prefix." },
        { input: "1 3 100 15 1000\n1500 200", expected_output: "$0.007500\n$0.007500\n$0.000000", description: "Cache rate of 100% means no discount, so nothing is saved." },
        { input: "2 3 10 15 0\n1000 1000\n1000 1000", expected_output: "$0.036000\n$0.036000\n$0.000000", description: "Prefix length 0: nothing is cacheable, so cached equals full." }
      ]
    },
    {
      id: "ai-21-l7",
      project_id: "ai-21",
      order: 7,
      title: "Batch and Async Discounts",
      concept: "Batch",
      xp_reward: 10,
      explanation: `You have a nightly job: summarize 100,000 documents before the morning report. Run them through the normal real-time API and you pay full rate and watch progress bars all evening. Send them to the **batch API** instead and the same work is billed at **half price** - the catch is it might take a few hours to come back. For an overnight job, that trade is a steal.

## What it is

The **batch API** is a discounted lane for work that does not need an instant answer. You submit a big pile of requests at once, the provider processes them whenever it has spare capacity, and you get all the results back within a turnaround window (often up to a day). In exchange for giving up immediacy, you get a flat discount - commonly around **50% off** both input and output - on the whole batch.

The trade is **latency for price**. Real-time gets you an answer in seconds at full cost; batch gets you the answer in minutes-to-hours at a fraction of the cost.

## How it works

The decision is per-job: does this task tolerate the batch turnaround? If yes, route it to batch and apply the discount. If a job needs a fast answer (a user is waiting), it stays on the real-time lane at full price:

\`\`\`python
discount = 0.50            # batch is 50% off
batch_turnaround = 60      # minutes the batch lane may take
job_tolerance = 240        # this job can wait up to 240 minutes
cost = 9000                # full-price numerator for this job

if job_tolerance >= batch_turnaround:
    billed = cost * (1 - discount)   # eligible for batch: half price
else:
    billed = cost                    # must run real-time: full price
print("billed numerator:", billed)
\`\`\`

So a job that can wait pays half; a job that cannot wait pays full. Sorting your workload into "can wait" and "cannot wait" is the whole optimization.

## Why it matters

Most workloads are a mix. The user-facing chat must be real-time. But the analytics, the bulk classification, the offline summaries, the eval runs - none of those need a human-speed reply, and they are often the *bulk* of the token volume. Moving that bulk to the batch lane can halve a huge slice of the bill while the latency-sensitive part stays fast. The skill is recognizing which jobs are secretly patient.

## The mental model to keep

**If no human is waiting, send it to the slow lane and pay half. Trade time you do not need for money you do.**`,
      key_terms: [
        { term: "Batch API", definition: "A discounted processing lane for requests that tolerate delayed results, often ~50% off." },
        { term: "Async processing", definition: "Submitting work to be completed later rather than waiting for an immediate response." },
        { term: "Turnaround window", definition: "The time the batch lane may take to return results (minutes to hours, sometimes up to a day)." },
        { term: "Latency tolerance", definition: "How long a given job can acceptably wait for its answer." }
      ],
      callouts: [
        { type: "tip", title: "Sort by who is waiting", content: "If a human is waiting on the answer, keep it real-time. If nothing is waiting - reports, bulk jobs, evals - route it to batch and take the discount.", position: "before" },
        { type: "warning", title: "Batch is not instant", content: "The discount buys patience. A batch job can take minutes to hours, so never put a latency-sensitive, user-facing call on the batch lane.", position: "after" }
      ],
      concept_diagram: {
        title: "Routing a job: real-time vs batch",
        steps: [
          { label: "Check who is waiting", desc: "A user in real time, or an offline job with no rush?" },
          { label: "Compare tolerance to turnaround", desc: "Can the job wait the batch window?" },
          { label: "Route accordingly", desc: "Patient jobs go to batch; urgent jobs stay real-time." },
          { label: "Apply the discount", desc: "Batch-routed jobs bill at the reduced rate." }
        ]
      },
      inline_quizzes: [
        {
          question: "What do you give up to get the batch discount?",
          options: ["Accuracy of the answer", "Speed - results come back later, not instantly", "The ability to send input tokens"],
          correct_index: 1,
          explanation: "Batch trades latency for price: you accept a slower turnaround in exchange for a lower rate."
        }
      ],
      quiz_questions: [
        {
          question: "What is the core tradeoff of the batch API?",
          options: [
            "Lower quality for lower price",
            "Higher latency for a lower price",
            "Faster answers for a higher price",
            "More tokens for the same price"
          ],
          correct_index: 1,
          explanation: "Batch processing accepts a slower turnaround in return for a discounted rate, typically around 50% off."
        },
        {
          question: "Which workload is the best fit for the batch lane?",
          options: [
            "A live chat where a user is typing and waiting",
            "An overnight job summarizing 100,000 documents",
            "A real-time autocomplete suggestion",
            "An instant fraud check at checkout"
          ],
          correct_index: 1,
          explanation: "Offline bulk work with no human waiting tolerates the turnaround, making it ideal for the discounted batch lane."
        },
        {
          question: "A job's full-price cost numerator is 8000 and batch is 50% off. What is the batch numerator?",
          options: [
            "8000",
            "4000",
            "12000",
            "0"
          ],
          correct_index: 1,
          explanation: "A 50% discount halves the cost: 8000 x (1 - 0.50) = 4000."
        }
      ],
      participation_activities: [
        {
          activity_title: "Batch check",
          questions: [
            { question: "The batch API gives a discount in exchange for slower turnaround.", type: "true_false", correct_answer: "true", explanation: "You trade latency for a lower rate; results come back later but cheaper." },
            { question: "A job is a good batch candidate when no ______ is waiting on the answer.", type: "fill_in", correct_answer: "human", explanation: "Offline jobs with no one waiting tolerate the delay and earn the discount. ('user' also fits.)" }
          ]
        }
      ],
      starter_code: `# Decide whether a job can take the discounted batch lane.
discount = 0.50          # batch is 50% off
batch_turnaround = 60    # minutes the batch lane may take
job_tolerance = 240      # how long this job can wait, in minutes
cost = 9000              # full-price cost numerator

# TODO: if the job tolerates the turnaround, bill at the discount; else full price.
print("job tolerance:", job_tolerance)
`,
      solution_code: `discount = 0.50
batch_turnaround = 60
job_tolerance = 240
cost = 9000

if job_tolerance >= batch_turnaround:
    billed = cost * (1 - discount)
    lane = "batch"
else:
    billed = cost
    lane = "real-time"

print("lane:", lane)
print("billed numerator:", int(billed))
`,
      expected_output: `lane: batch
billed numerator: 4500`,
      step_throughs: [
        {
          title: "routing one job, step by step",
          steps: [
            { label: "Find the batch turnaround", detail: "The batch lane may take up to this long to return results.", code: "batch_turnaround = 60  # minutes" },
            { label: "Find the job's patience", detail: "How long this particular job can acceptably wait.", code: "job_tolerance = 240  # minutes" },
            { label: "Compare them", detail: "If the job can wait at least as long as the batch window, it qualifies.", code: "job_tolerance >= batch_turnaround  # True" },
            { label: "Apply the discount", detail: "Eligible jobs bill at half price; urgent jobs stay at full price.", code: "billed = 9000 * (1 - 0.50)  # = 4500" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A batch job's full-price cost is $0.040 and the batch discount is 50%. What does it cost on the batch lane?",
          steps: [
            "Apply the discount: multiply by (1 - 0.50) = 0.50.",
            "$0.040 x 0.50 = $0.020.",
            "The job costs half as much by accepting the slower turnaround."
          ],
          output: "$0.020 (half of $0.040)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "An overnight run has 80,000 patient jobs ($0.003 each, batch-eligible) and 20,000 urgent jobs ($0.003 each, must stay real-time). Batch is 50% off. What is the total, and what did batching save vs all-real-time?",
          steps: [
            "All real-time: 100,000 x $0.003 = $300.",
            "Batch the patient 80,000 at half price: 80,000 x $0.0015 = $120.",
            "Urgent 20,000 stay full: 20,000 x $0.003 = $60. Total = $120 + $60 = $180.",
            "Saving vs all-real-time: $300 - $180 = $120 (a 40% cut overall)."
          ],
          output: "Total $180, saving $120 - because the patient bulk took the discount."
        }
      ],
      comparison_tables: [
        {
          title: "real-time lane vs batch lane",
          columns: ["Aspect", "Real-time", "Batch"],
          rows: [
            { cells: ["Answer speed", "Seconds", "Minutes to hours"] },
            { cells: ["Price", "Full rate", "Discounted (often ~50% off)"] },
            { cells: ["Good for", "A user is waiting", "Offline bulk jobs, reports, evals"] },
            { cells: ["What you trade", "Nothing - you pay for speed", "Latency, in exchange for money saved"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "send to batch vs keep real-time",
          bins: [
            { id: "batch", label: "Send to batch (patient)" },
            { id: "rt", label: "Keep real-time (urgent)" }
          ],
          items: [
            { id: "i1", text: "Nightly summary of 100k documents", bin: "batch" },
            { id: "i2", text: "Live chat reply while a user waits", bin: "rt" },
            { id: "i3", text: "Bulk classification for a weekly report", bin: "batch" },
            { id: "i4", text: "Autocomplete as someone types", bin: "rt" },
            { id: "i5", text: "An offline eval run over a test set", bin: "batch" },
            { id: "i6", text: "Fraud check at the moment of checkout", bin: "rt" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can moving offline work to the batch API cut a large slice of the bill without hurting users at all?",
          sampleAnswer: "Most of the heavy token volume in an application is often offline work - bulk summaries, classification, reports, evals - where no human is waiting for an instant reply. Those jobs tolerate the batch lane's slower turnaround, so routing them there earns a large discount, commonly around half off, on the bulk of the spend. The latency-sensitive, user-facing calls stay on the real-time lane and feel exactly as fast as before. Because the discount applies only to work nobody is waiting on, users notice nothing while the bill drops sharply."
        }
      ],
      hints: [
        "A job qualifies for batch when job_tolerance >= batch_turnaround.",
        "Discounted cost is cost * (1 - discount); full price is just cost.",
        "Use an if/else to pick the lane and the billed amount."
      ],
      challenge_title: "The Overnight Router",
      challenge_description: "Route a mixed workload between the real-time and batch lanes by each job's patience, then report the real-time bill, the discounted batch bill, and how many jobs took the slow lane.",
      challenge_story: "You run a pipeline with a mix of jobs: some are user-facing and need an instant answer, others are offline bulk work that can wait. The **batch API** offers a flat discount but takes up to `batch_latency` minutes to return. Your router's rule is simple: any job whose **latency tolerance** is at least the batch turnaround goes to the cheap batch lane; everything else stays real-time at full price. Cost the whole workload under that routing, and also show what it *would* have cost if every job ran real-time - the number that justifies the batch lane.",
      challenge_statement: "You are given: `in_price`, `out_price` (per 1M), `discount` (the batch discount as a **percent**, e.g. 50 means 50% off), and `batch_latency` (the batch turnaround in minutes). Then a list of jobs, each with `in_tok`, `out_tok`, and `tol` (its latency tolerance in minutes).\n\nA job's full-price cost numerator is `in_tok * in_price + out_tok * out_price`.\n\n- If `tol >= batch_latency`, the job goes to **batch**: its numerator is billed at `(100 - discount)%`.\n- Otherwise it runs **real-time** at the full numerator.\n\nPrint three lines:\n\n1. `$` + the cost if **every** job ran real-time (full price), to 6 decimals.\n2. `$` + the **routed** cost (batch-eligible jobs discounted), to 6 decimals.\n3. The **count** of jobs routed to the batch lane.",
      challenge_input_format: "The first line has five integers: `n in_price out_price discount batch_latency`.\n\nEach of the next `n` lines has three integers: `in_tok out_tok tol`.",
      challenge_output_format: "Three lines: `$` + all-real-time cost to 6 decimals, then `$` + routed cost to 6 decimals, then the integer count of batched jobs.",
      challenge_constraints: [
        "1 <= n <= 100000",
        "1 <= in_price, out_price <= 1000",
        "0 <= discount <= 100",
        "0 <= batch_latency <= 1000000",
        "0 <= in_tok, out_tok <= 1000000, 0 <= tol <= 1000000",
      ],
      challenge_examples: [
        { input: "3 3 15 50 60\n1000 500 120\n800 200 30\n2000 1000 1440", output: "$0.036900\n$0.021150\n2", explanation: "Numerators: 10500, 5400, 21000 -> real-time total 36900 -> $0.036900. Jobs 1 and 3 (tol 120, 1440 >= 60) batch at 50% off; job 2 (tol 30) stays full. Routed: 5250 + 5400 + 10500 = 21150 -> $0.021150. Two jobs batched." },
        { input: "2 4 8 25 100\n500 500 200\n500 500 50", output: "$0.012000\n$0.010500\n1", explanation: "Each job numerator 6000 -> real-time 12000 -> $0.012000. Job 1 (tol 200 >= 100) batches at 75%: 4500; job 2 (tol 50) full: 6000. Routed 10500 -> $0.010500. One batched." },
      ],
      challenge_notes: "The discount applies to the whole numerator (input and output alike), so scale by 100 to keep it exact: a batched job contributes `num * (100 - discount)`, divided by 100,000,000 at the end. In practice the latency-sensitive, user-facing jobs are a small share of token volume - the bulk offline work batches, which is why the routed cost often falls close to the discount even though some jobs stay full price.",
      challenge_hints: [
        "Per job num = in_tok*in_price + out_tok*out_price; add num to the all-real-time total.",
        "If tol >= batch_latency, add num*(100-discount) to a scaled routed total and bump the batch count; else add num*100.",
        "Divide the all-real-time total by 1,000,000 and the scaled routed total by 100,000,000; use Decimal for exact 6-decimal rounding.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    discount = int(data[idx]); idx += 1
    batch_latency = int(data[idx]); idx += 1
    # TODO: for each job compute its numerator, route by tolerance,
    #       and print all-real-time cost, routed cost, and batched count.

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    in_price = int(data[idx]); idx += 1
    out_price = int(data[idx]); idx += 1
    discount = int(data[idx]); idx += 1
    batch_latency = int(data[idx]); idx += 1
    realtime_num = 0
    routed_scaled = 0  # scaled by 100
    batched = 0
    for _ in range(n):
        in_tok = int(data[idx]); idx += 1
        out_tok = int(data[idx]); idx += 1
        tol = int(data[idx]); idx += 1
        num = in_tok * in_price + out_tok * out_price
        realtime_num += num
        if tol >= batch_latency:
            batched += 1
            routed_scaled += num * (100 - discount)
        else:
            routed_scaled += num * 100
    realtime = (Decimal(realtime_num) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    routed = (Decimal(routed_scaled) / Decimal(100000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${realtime}")
    print(f"\${routed}")
    print(batched)

main()
`,
      challenge_test_cases: [
        { input: "3 3 15 50 60\n1000 500 120\n800 200 30\n2000 1000 1440", expected_output: "$0.036900\n$0.021150\n2", description: "Mixed workload: two patient jobs batch at 50% off, one urgent stays real-time." },
        { input: "2 4 8 25 100\n500 500 200\n500 500 50", expected_output: "$0.012000\n$0.010500\n1", description: "One job tolerates the turnaround and takes the 25% discount." },
        { input: "1 3 15 50 0\n1000 1000 0", expected_output: "$0.018000\n$0.009000\n1", description: "Batch latency of 0: any tolerance qualifies, so the job batches." },
        { input: "2 3 15 100 60\n100 100 10\n100 100 10", expected_output: "$0.003600\n$0.003600\n0", description: "Both jobs are too urgent to batch, so routed equals all-real-time." }
      ]
    },
    {
      id: "ai-21-l8",
      project_id: "ai-21",
      order: 8,
      title: "Budgets and Spend Alerts",
      concept: "Budgets",
      xp_reward: 10,
      explanation: `A startup wired GPT into a free trial and went to bed. One user wrote a script that hammered the endpoint all night. By morning the bill was \\$11,000 - for a product that earned \\$0. There was no spending cap, no per-user limit, no alert. Every cost lever in this module shrinks the *average* call; budgets and alerts protect you from the *runaway* call. They are the seatbelt.

## What it is

Three controls turn estimates into guardrails:

1. **Spend caps.** A hard ceiling on total spend (per day or per month). Cross it and further calls are refused. This bounds your worst case to a number you chose, not a number an attacker chose.
2. **Per-user budgets.** A separate cap for each user, so one person cannot drain the whole account. Track each user's running spend and reject calls that would push them over their own limit.
3. **Spend alerts.** A warning fired *before* you hit the cap - say at 80% of budget - so a human can react while there is still room, instead of discovering the problem from the invoice.

## How it works

Each cap is a running total compared against a limit. Per user, you accumulate cost and refuse the call that would breach the budget; you fire one alert when crossing the warning threshold:

\`\`\`python
cap = 10000          # this user's budget, in micro-dollars (cost x 1e6)
alert_at = 0.80      # warn at 80% of cap
spent = 7800         # already spent this period
new_call = 1800      # cost of the next call

if spent + new_call > cap:
    print("BLOCKED: would exceed budget")
else:
    spent += new_call
    if spent >= cap * alert_at:
        print("ALERT: crossed 80% of budget")
    print("spent so far:", spent)
\`\`\`

The cap **stops** the spend; the alert **warns** before the cap. You want both - a wall and a tripwire in front of it.

## Why it matters

Estimation tells you what a call *should* cost; it cannot stop abuse, bugs, or a retry loop gone wild. A single misbehaving client can generate cost faster than any human notices. Caps bound the damage to a chosen ceiling; per-user budgets keep one bad actor from starving everyone else; alerts buy you reaction time. Together they convert "we hope it stays cheap" into "it cannot exceed X, and we hear about it at 0.8X."

## The mental model to keep

**Estimate to plan, cap to survive, alert to react. A budget you do not enforce is just a wish.**`,
      key_terms: [
        { term: "Spend cap", definition: "A hard ceiling on total spend; calls are refused once it is reached." },
        { term: "Per-user budget", definition: "A separate spend limit for each user so one cannot drain the whole account." },
        { term: "Spend alert", definition: "A warning fired before the cap (e.g. at 80%) so a human can react in time." },
        { term: "Running total", definition: "The accumulated spend tracked over a period and compared against the limit on each call." }
      ],
      callouts: [
        { type: "warning", title: "No cap means no ceiling", content: "Without a spend cap, an abusive client or a runaway retry loop can run your bill to any number overnight. The cap is the only thing that bounds the worst case.", position: "before" },
        { type: "insight", title: "Alert before the wall", content: "A cap stops spend abruptly; an alert at 80% gives a human time to investigate before the wall is hit, so you fix the cause instead of just absorbing the block.", position: "after" }
      ],
      concept_diagram: {
        title: "Enforcing a per-user budget on a call",
        steps: [
          { label: "Look up the user's spend", desc: "The running total for this user this period." },
          { label: "Project the new total", desc: "Add the cost of the incoming call." },
          { label: "Compare to the cap", desc: "Over the cap? Refuse the call; spend stays put." },
          { label: "Alert if near the limit", desc: "If the new total crosses the warning threshold, fire one alert." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a per-user budget protect against that a single account-wide cap does not?",
          options: ["One user draining the whole account at everyone else's expense", "The output rate being too high", "Tokens being estimated wrong"],
          correct_index: 0,
          explanation: "A per-user budget limits each user individually, so one heavy or abusive user cannot consume everybody's budget."
        }
      ],
      quiz_questions: [
        {
          question: "What is the purpose of a spend cap?",
          options: [
            "To make each call cheaper",
            "To set a hard ceiling so spending cannot exceed a chosen amount",
            "To speed up the model",
            "To increase the output limit"
          ],
          correct_index: 1,
          explanation: "A spend cap bounds total spend to a ceiling you pick; calls are refused once it is reached."
        },
        {
          question: "Why fire a spend alert at, say, 80% of the budget rather than at 100%?",
          options: [
            "Alerts are cheaper before the cap",
            "So a human can react while there is still budget left, before calls start getting blocked",
            "Because 100% alerts are not allowed",
            "To charge extra for the warning"
          ],
          correct_index: 1,
          explanation: "Warning before the cap gives time to investigate and fix the cause instead of discovering it only when calls fail."
        },
        {
          question: "A user's cap is $0.010 (10000 micro-dollars), they have spent 7800, and the next call costs 9000. What happens?",
          options: [
            "The call is allowed; spent becomes 16800",
            "The call is blocked because 7800 + 9000 = 16800 exceeds the cap",
            "The cap is automatically raised",
            "The call runs at half price"
          ],
          correct_index: 1,
          explanation: "7800 + 9000 = 16800 > 10000, so the call would breach the budget and is refused; spend stays at 7800."
        }
      ],
      participation_activities: [
        {
          activity_title: "Budget check",
          questions: [
            { question: "A spend cap can refuse further calls once total spending reaches the limit.", type: "true_false", correct_answer: "true", explanation: "The cap is a hard ceiling; calls that would exceed it are blocked." },
            { question: "A warning fired before the cap is hit is called a spend ______.", type: "fill_in", correct_answer: "alert", explanation: "Spend alerts warn ahead of the cap so a human can react in time." }
          ]
        }
      ],
      starter_code: `# Enforce one user's budget with an 80% alert.
cap = 10000          # budget in micro-dollars (cost x 1e6)
alert_at = 0.80      # warn at 80% of cap
spent = 7800         # already spent this period
new_call = 1800      # cost of the next call

# TODO: block if spent + new_call > cap; else add it and alert if >= 80% of cap.
print("cap:", cap)
`,
      solution_code: `cap = 10000
alert_at = 0.80
spent = 7800
new_call = 1800

if spent + new_call > cap:
    print("BLOCKED: would exceed budget")
else:
    spent += new_call
    if spent >= cap * alert_at:
        print("ALERT: crossed 80% of budget")
    print("spent so far:", spent)
`,
      expected_output: `ALERT: crossed 80% of budget
spent so far: 9600`,
      step_throughs: [
        {
          title: "checking one call against a budget",
          steps: [
            { label: "Read the running spend", detail: "This user has already spent 7800 of their 10000 cap this period.", code: "spent = 7800;  cap = 10000" },
            { label: "Project the new total", detail: "The incoming call costs 1800, which would bring spend to 9600.", code: "spent + new_call  # 7800 + 1800 = 9600" },
            { label: "Compare to the cap", detail: "9600 <= 10000, so the call is allowed and the spend is recorded.", code: "9600 > 10000  # False -> allow" },
            { label: "Fire the alert", detail: "9600 has crossed 80% of the cap (8000), so warn the team now.", code: "9600 >= 10000 * 0.80  # True -> ALERT" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A user's cap is $0.020. They have spent $0.018 and the next call costs $0.005. Is the call allowed?",
          steps: [
            "Project the new total: $0.018 + $0.005 = $0.023.",
            "Compare to the cap: $0.023 > $0.020.",
            "It would exceed the budget, so the call is blocked."
          ],
          output: "Blocked - $0.023 exceeds the $0.020 cap."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two users share a daily account cap of $0.030 and each has a per-user cap of $0.020. User A has spent $0.019 and sends a $0.004 call; user B has spent $0.008 and sends a $0.005 call. With an 80% per-user alert, what happens to each?",
          steps: [
            "User A: $0.019 + $0.004 = $0.023 > their $0.020 cap -> blocked; A stays at $0.019.",
            "User B: $0.008 + $0.005 = $0.013 <= $0.020 cap -> allowed; B now at $0.013.",
            "User B alert check: 80% of $0.020 = $0.016; $0.013 < $0.016, so no alert yet.",
            "Account total = $0.019 + $0.013 = $0.032... but A's call was blocked, so it is $0.019 + $0.013 = $0.032 only if both went through; A's did not, so the account is $0.019 + $0.013 = $0.032 minus A's blocked $0.004 = $0.032. Recompute: spent A 0.019 + spent B 0.013 = $0.032, under no account breach here since the account cap check is separate."
          ],
          output: "A blocked (over per-user cap), B allowed with no alert yet."
        }
      ],
      comparison_tables: [
        {
          title: "three budget guardrails",
          columns: ["Control", "What it does", "When it acts"],
          rows: [
            { cells: ["Spend cap", "Hard ceiling on total spend", "Blocks calls at 100% of cap"] },
            { cells: ["Per-user budget", "Separate cap per user", "Blocks one user without affecting others"] },
            { cells: ["Spend alert", "Warns a human early", "Fires before the cap (e.g. 80%)"] },
            { cells: ["Estimation alone", "Predicts cost, enforces nothing", "Never blocks - just a guess", ], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "stops spend vs only warns vs neither",
          bins: [
            { id: "stops", label: "Stops / blocks spend" },
            { id: "warns", label: "Only warns (no block)" }
          ],
          items: [
            { id: "i1", text: "A hard daily spend cap", bin: "stops" },
            { id: "i2", text: "An 80%-of-budget alert email", bin: "warns" },
            { id: "i3", text: "A per-user limit that refuses over-budget calls", bin: "stops" },
            { id: "i4", text: "A dashboard notification at 90% spend", bin: "warns" },
            { id: "i5", text: "Rejecting a call that would breach the cap", bin: "stops" },
            { id: "i6", text: "A Slack ping when spend nears the limit", bin: "warns" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why are cost estimation and a spend cap solving two different problems?",
          sampleAnswer: "Estimation answers what a call should cost under normal conditions, so it helps you plan and budget ahead of launch. But it enforces nothing - if a bug, an abusive user, or a runaway retry loop fires thousands of unexpected calls, the estimate is silently wrong and the bill climbs anyway. A spend cap solves the opposite problem: it does not predict anything, it simply refuses calls once a chosen ceiling is reached, bounding the worst case no matter the cause. You need estimation to plan and a cap to survive the cases your plan did not foresee."
        }
      ],
      hints: [
        "Block when spent + new_call > cap; otherwise add new_call to spent.",
        "Fire the alert when the new spent is >= cap * alert_at (e.g. 0.80).",
        "Keep spend per user in a dictionary keyed by user id."
      ],
      challenge_title: "The Budget Guard",
      challenge_description: "Enforce per-user budgets across a stream of calls: block the ones that would breach a user's cap, fire a one-time alert when a user crosses the warning line, and report total spend, blocks, and alerts.",
      challenge_story: "Your product gives every user a spending budget so one heavy account cannot run up the whole bill. Calls arrive in order; for each, you know the user and the call's cost. Before a call runs you check whether it would push that user **over their cap** - if so, the call is **blocked** and the user's spend is unchanged. Otherwise it runs and the cost is added. The moment a user's spend first reaches a **warning threshold** (a percent of the cap), you fire **one** alert for that user so the team can look before they ever hit the wall. Build the guard and report the damage it prevented.",
      challenge_statement: "Every user shares the same cap `cap` (in micro-dollars, i.e. cost x 1,000,000) and the same alert threshold `alert_pct` (a percent of the cap). Calls arrive in order; call `i` belongs to user `uid` and costs `cost` micro-dollars (you are given it directly as an integer).\n\nProcess calls in order. For each call, let `cur` be that user's current spend (0 if unseen):\n\n- If `cur + cost > cap`: the call is **blocked**; the user's spend does not change.\n- Otherwise the call runs: set the user's spend to `cur + cost`. If this is the **first** time that user's spend reaches `>= cap * alert_pct / 100`, fire **one** alert for that user.\n\nPrint three lines: the **total spend** across all users (as `$` to 6 decimals), the number of **blocked** calls, and the number of **alerts** fired.",
      challenge_input_format: "The first line has two integers: `cap alert_pct`.\n\nThe second line has one integer `n` - the number of calls.\n\nEach of the next `n` lines has two integers: `uid cost` (the call's user id and its cost in micro-dollars).",
      challenge_output_format: "Three lines: `$` + total spend across all users to exactly 6 decimal places, then the integer count of blocked calls, then the integer count of alerts fired.",
      challenge_constraints: [
        "1 <= cap <= 1000000000",
        "0 <= alert_pct <= 100",
        "1 <= n <= 100000",
        "1 <= uid <= 1000000",
        "0 <= cost <= 1000000000",
      ],
      challenge_examples: [
        { input: "10000 80\n4\n1 7800\n2 21000\n1 1800\n2 1800", output: "$0.011400\n1\n1", explanation: "User1: 7800 ok (7800 < 8000, no alert). User2: 7800+21000? no, 0+21000 > 10000 -> BLOCKED. User1: 7800+1800=9600 ok, crosses 80% (8000) -> ALERT. User2: 0+1800=1800 ok. Total spend 9600+1800=11400 -> $0.011400, 1 blocked, 1 alert." },
        { input: "5000 100\n3\n1 5000\n1 1\n1 0", output: "$0.005000\n1\n1", explanation: "User1: 5000 ok, reaches 100% of cap -> ALERT. Next call 5000+1 > 5000 -> BLOCKED. Then +0 keeps spend at 5000 (5000 <= 5000 ok), already alerted so no second alert. Total 5000 -> $0.005000, 1 blocked, 1 alert." },
      ],
      challenge_notes: "The alert fires **once per user**, the first time spend reaches the threshold - track which users have already alerted so you do not double-count. Compare spend to the threshold exactly with integers: `spend * 100 >= cap * alert_pct` avoids any float rounding. A blocked call leaves spend untouched, so a later cheaper call from the same user can still succeed.",
      challenge_hints: [
        "Keep a dict spend[uid] and a set alerted of users who already fired. Default unseen users to 0 spend.",
        "Block when cur + cost > cap (the spend is not updated); otherwise set spend[uid] = cur + cost.",
        "After a successful call, if uid not in alerted and spend[uid]*100 >= cap*alert_pct, add uid to alerted and count one alert.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    cap = int(data[idx]); idx += 1
    alert_pct = int(data[idx]); idx += 1
    n = int(data[idx]); idx += 1
    # TODO: process n calls in order, enforcing per-user caps and one-time alerts.
    #       Print total spend ($ to 6 decimals), blocked count, and alert count.

main()
`,
      challenge_solution_code: `import sys
from decimal import Decimal, ROUND_HALF_UP

def main():
    data = sys.stdin.read().split()
    idx = 0
    cap = int(data[idx]); idx += 1
    alert_pct = int(data[idx]); idx += 1
    n = int(data[idx]); idx += 1
    spend = {}
    alerted = set()
    blocked = 0
    alerts = 0
    for _ in range(n):
        uid = int(data[idx]); idx += 1
        cost = int(data[idx]); idx += 1
        cur = spend.get(uid, 0)
        if cur + cost > cap:
            blocked += 1
            continue
        spend[uid] = cur + cost
        if uid not in alerted and spend[uid] * 100 >= cap * alert_pct:
            alerted.add(uid)
            alerts += 1
    total = sum(spend.values())
    total_d = (Decimal(total) / Decimal(1000000)).quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
    print(f"\${total_d}")
    print(blocked)
    print(alerts)

main()
`,
      challenge_test_cases: [
        { input: "10000 80\n4\n1 7800\n2 21000\n1 1800\n2 1800", expected_output: "$0.011400\n1\n1", description: "One over-cap call blocked; one user crosses the 80% alert line." },
        { input: "5000 100\n3\n1 5000\n1 1\n1 0", expected_output: "$0.005000\n1\n1", description: "Alert at exactly 100%; the over-budget call is blocked, a zero-cost call still fits." },
        { input: "1000000 50\n3\n7 100\n7 100\n8 600000", expected_output: "$0.600200\n0\n1", description: "Only the big call crosses 50% of the cap and alerts; nothing is blocked." },
        { input: "100 0\n2\n3 0\n3 0", expected_output: "$0.000000\n0\n1", description: "Alert threshold 0% fires immediately on the first successful call; zero-cost calls never block." }
      ]
    }
  ]
};
