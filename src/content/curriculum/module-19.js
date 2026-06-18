export default {
  project: {
    id: "ai-19",
    title: "Temperature & Sampling",
    description: "Learn why the same prompt gives different answers, and how temperature, top-p, and top-k let you dial a model from precise to playful.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 4,
    tags: ["temperature", "sampling", "top-p", "randomness", "fundamentals"],
    order: 19,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-19-l1",
      project_id: "ai-19",
      order: 1,
      title: "Why the Same Prompt Gives Different Answers",
      concept: "Sampling",
      xp_reward: 10,
      explanation: `Ask a model "write me a one-line slogan for a coffee shop" twice and you'll often get two different lines. Same prompt, same model, different answer. That isn't a bug or a hidden mood — it's the model doing exactly what it always does: rolling dice over its own predictions.

## What it is

From an earlier lesson you know a model predicts the next token. But it doesn't predict a *single* token — it predicts a **probability distribution**: a score for every token in its vocabulary, all adding up to 1. For the prompt "The sky is" it might assign \`blue\` a 0.60 chance, \`clear\` 0.15, \`dark\` 0.10, and tiny slivers to thousands of others.

Then comes the step people miss. The model does not have to take the top one. It **samples** — it picks a token *according to those probabilities*, like drawing a weighted ticket from a hat. \`blue\` is the fat favorite, but \`clear\` and \`dark\` are still in the hat. Draw again on a different run and a different ticket can come out.

## How it works

The randomness is deliberate. If a model always took the single highest-probability token (that strict mode is called **greedy decoding**), it would be perfectly repeatable — and often dull, repetitive, and prone to getting stuck in loops. Sampling adds variety so answers feel natural and creative.

Here is the core idea in miniature: a weighted draw from a distribution.

\`\`\`python
import random
random.seed(7)

# the model's predicted distribution for the next token
tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.15,    0.10]   # (rest of vocab omitted)

# sample one token according to its weight
choice = random.choices(tokens, weights=probs, k=1)[0]
print(choice)
\`\`\`

Run that with a *different* seed and you can get a different word. The favorite usually wins, but not always — that's the whole point.

## Why it matters

Once you see generation as a weighted draw, the day-to-day behavior stops being spooky:

- **Two runs differ** because each run draws fresh from the distribution. Nothing is broken.
- **A small early difference snowballs.** A different first token changes the context, which changes the next distribution, so answers drift apart — the same compounding you saw with prediction.
- **You can turn the dial.** How "loose" the dice are is itself a setting (temperature, next lesson). Some tasks want repeatable; some want surprise.

## The mental model to keep

The model hands you a hat full of weighted tickets, then **draws one at random.** The favorite ticket usually comes out — but not every time. Same prompt, same hat, different draw. That's why your slogan keeps changing.`,
      key_terms: [
        { term: "Probability distribution", definition: "The full set of scores the model assigns to every possible next token, summing to 1." },
        { term: "Sampling", definition: "Picking the next token at random in proportion to its probability, rather than always taking the top one." },
        { term: "Greedy decoding", definition: "Always choosing the single highest-probability token, which makes output repeatable but often dull." }
      ],
      callouts: [
        { type: "analogy", title: "A hat full of weighted tickets", content: "The model fills a hat with one ticket per token, but the favorite gets way more tickets than the rest. Then it draws one. The favorite usually wins — but a long-shot can still come out, which is why runs differ.", position: "before" },
        { type: "insight", title: "Variety is on purpose", content: "If the model always grabbed the single top token it would be repeatable but boring and loop-prone. Sampling is what makes answers feel fresh and human.", position: "after" }
      ],
      concept_diagram: {
        title: "From prompt to a (varying) next token",
        steps: [
          { label: "Predict distribution", desc: "Model scores every token; scores sum to 1." },
          { label: "Build the hat", desc: "Each token gets tickets in proportion to its score." },
          { label: "Draw one", desc: "A weighted random draw picks the next token." },
          { label: "Append + repeat", desc: "The draw is added; the next draw may differ across runs." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why can the same prompt give two different answers?",
          options: ["The model retrains between requests", "It samples randomly from a distribution instead of always taking the top token", "It has different moods on different days"],
          correct_index: 1,
          explanation: "Each run draws a token at random in proportion to its probability, so different runs can pick different tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What does a model actually predict at each step?",
          options: [
            "A single guaranteed next token",
            "A probability distribution over all possible next tokens",
            "The full sentence at once",
            "A yes/no decision"
          ],
          correct_index: 1,
          explanation: "It outputs a score for every token in its vocabulary, summing to 1 — a distribution it then samples from."
        },
        {
          question: "What is greedy decoding?",
          options: [
            "Always taking the single highest-probability token",
            "Picking a random token with equal odds",
            "Choosing the longest possible word",
            "Sampling twice and averaging"
          ],
          correct_index: 0,
          explanation: "Greedy decoding always grabs the top token. It is repeatable but tends to be repetitive and dull."
        },
        {
          question: "Why can a tiny difference early in an answer lead to a very different ending?",
          options: [
            "The model gets tired over long outputs",
            "Each new token changes the context, which changes every following distribution",
            "Longer answers ignore the prompt",
            "The vocabulary shrinks as it goes"
          ],
          correct_index: 1,
          explanation: "A different early token feeds back into the context, so subsequent distributions and draws shift, and the answers drift apart."
        }
      ],
      participation_activities: [
        {
          activity_title: "Sampling sense-check",
          questions: [
            { question: "A model always returns the single most likely next token.", type: "true_false", correct_answer: "false", explanation: "By default it samples from the distribution, so it can pick lower-probability tokens too." },
            { question: "Picking a token at random in proportion to its probability is called ______.", type: "fill_in", correct_answer: "sampling", explanation: "Sampling is the weighted draw from the predicted distribution." }
          ]
        }
      ],
      starter_code: `# Simulate sampling the next token from a fixed distribution.
import random
random.seed(1)

tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.25,    0.15]

# TODO: draw ONE token in proportion to its probability and print it.
print("distribution:", dict(zip(tokens, probs)))
`,
      solution_code: `import random
random.seed(1)

tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.25,    0.15]

print("distribution:", dict(zip(tokens, probs)))
choice = random.choices(tokens, weights=probs, k=1)[0]
print("sampled:", choice)
`,
      expected_output: `distribution: {'blue': 0.6, 'clear': 0.25, 'dark': 0.15}
sampled: blue`,
      step_throughs: [
        {
          title: "one token, drawn from the hat",
          steps: [
            { label: "Predict a distribution", detail: "The model scores every candidate token. The scores add up to 1 — a probability for each.", code: 'P("blue")=0.60, P("clear")=0.25, P("dark")=0.15' },
            { label: "Fill the hat", detail: "Each token gets tickets in proportion to its score: 60 'blue' tickets, 25 'clear', 15 'dark'.", code: "hat = 60×blue + 25×clear + 15×dark" },
            { label: "Draw one ticket", detail: "A weighted random draw pulls a single ticket. 'blue' is most likely, but not certain.", code: "draw -> usually 'blue', sometimes 'clear'/'dark'" },
            { label: "Repeat next run", detail: "On a new run the model rebuilds the same hat and draws again — possibly a different token.", code: "run 2 -> draw -> maybe 'clear'" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model predicts P("yes")=0.9 and P("no")=0.1. Over many runs, which token comes out more often, and is "no" ever possible?',
          steps: [
            'Sampling draws in proportion to probability, so "yes" should appear about 9 times out of 10.',
            '"no" has a real 0.1 share of the tickets, so it is not impossible.',
            "The favorite dominates but the long shot still occasionally wins."
          ],
          output: '"yes" most of the time, but "no" still shows up about 10% of runs.'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You run the same prompt 5 times and get 5 nearly identical answers, then run it again and get something wildly different. What's going on?",
          steps: [
            "Most draws land on the heavy-favorite tokens, so several runs look alike.",
            "Occasionally an early draw picks a lower-probability token instead.",
            "That different early token changes the context, so every later distribution shifts too.",
            "From that point the answers diverge and compound, producing the one odd-looking run."
          ],
          output: "Sampling usually picks favorites (similar runs), but a rare early draw can snowball into a very different answer."
        }
      ],
      comparison_tables: [
        {
          title: "greedy decoding vs sampling",
          columns: ["Aspect", "Greedy decoding", "Sampling"],
          rows: [
            { cells: ["How it picks", "Always the top token", "Weighted random draw"] },
            { cells: ["Repeatability", "Same answer every time", "Varies run to run"] },
            { cells: ["Feel", "Flat, can loop", "Natural, creative"] },
            { cells: ["Best for", "Strict, factual extraction", "Variety and ideas"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true of greedy vs true of sampling",
          bins: [
            { id: "greedy", label: "Greedy decoding" },
            { id: "sampling", label: "Sampling" }
          ],
          items: [
            { id: "i1", text: "Always returns the single top token", bin: "greedy" },
            { id: "i2", text: "Same prompt can give different answers", bin: "sampling" },
            { id: "i3", text: "Perfectly repeatable output", bin: "greedy" },
            { id: "i4", text: "Draws a token in proportion to its probability", bin: "sampling" },
            { id: "i5", text: "Can get stuck repeating itself", bin: "greedy" },
            { id: "i6", text: "Feels more natural and creative", bin: "sampling" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if a model only ever predicts probabilities, why do its answers feel non-deterministic when you use it?",
          sampleAnswer: "The probabilities themselves are fixed for a given context, but the model then samples — it draws a token at random weighted by those probabilities. Because the draw is random, different runs can pull different tokens, and once an early token differs the whole answer can drift. So the randomness lives in the draw, not in the predictions."
        }
      ],
      hints: [
        "random.choices takes the items, a weights list, and k=how many to draw.",
        "It returns a list, so index [0] to get the single token.",
        "Keep random.seed(1) at the top so the output is reproducible."
      ],
      challenge_title: "The Sampling Harness",
      challenge_description: "Reproduce a model's sampling step deterministically: drive a fixed pseudo-random generator through thousands of weighted token draws and report the empirical counts.",
      challenge_story: "Your inference team is debugging why a generation endpoint feels 'streaky' — sometimes a rare token shows up far more than its probability suggests. Before blaming the model, you build a **sampling harness**: a deterministic replay of the sampler so the same seed always produces the same draws. Real samplers pull from a hardware RNG, but for a reproducible test rig you wire in a classic **linear congruential generator (LCG)** so QA can compare runs byte-for-byte. Feed it a token distribution and a seed, draw many times, and tally the results — if the empirical counts drift from the weights, *that's* a bug worth chasing.",
      challenge_statement: "You are given \`n\` tokens, each with an integer **weight**, a number of **draws**, and a **seed**. Simulate \`draws\` independent samples using this exact deterministic procedure:\n\n1. Let \`total\` be the sum of all weights. Start the generator at \`state = seed\`.\n2. For each draw, first advance the generator:\n\n   \`\`\`\n   state = (1664525 * state + 1013904223) mod 4294967296\n   \`\`\`\n\n   then compute \`r = state mod total\`.\n3. Walk the tokens **in input order**, accumulating their weights into a running prefix sum. The drawn token is the **first** one whose prefix sum is strictly greater than \`r\`.\n\nAfter all draws, print the final count for each token, in input order, separated by single spaces.",
      challenge_input_format: "The first line has three integers: `n draws seed`.\n\nEach of the next `n` lines has a token (no spaces) and its integer `weight`.",
      challenge_output_format: "One line: the `n` counts in input order, separated by single spaces. They sum to `draws`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ draws ≤ 1000000",
        "0 ≤ seed < 4294967296",
        "1 ≤ weight ≤ 1000000",
      ],
      challenge_examples: [
        { input: "3 1000 0\na 70\nb 20\nc 10", output: "703 200 97", explanation: "Total weight 100. Over 1000 deterministic LCG draws, `a` (70%) lands ~703 times, `c` (10%) only ~97 — close to the weights but not exact, which is the whole point of sampling." },
        { input: "2 10000 42\nheads 1\ntails 1", output: "5000 5000", explanation: "Equal weights, and with seed 42 the LCG splits 10000 draws into an exact 5000/5000 here." },
      ],
      challenge_notes: "An LCG is the simplest reproducible RNG: one multiply, one add, one modulo. It's not cryptographically strong, but it's perfect for a *replayable* test harness — same seed, same stream, every machine. Note the half-open interval: `r` ranges over `0 .. total-1`, and the prefix-sum comparison is strictly greater-than, so every `r` maps to exactly one token.",
      challenge_hints: [
        "Build a prefix-sum (cumulative weight) array once, before the loop — recomputing it per draw is wasteful.",
        "Advance `state` *before* using it each draw, exactly as written; the order matters for matching the expected output.",
        "With `draws = 0` the loop never runs, so every count is 0.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    draws = int(data[idx]); idx += 1
    seed = int(data[idx]); idx += 1
    tokens, weights = [], []
    for _ in range(n):
        tokens.append(data[idx]); idx += 1
        weights.append(int(data[idx])); idx += 1
    # TODO: build a prefix-sum table, run the LCG for each draw,
    #       tally counts in input order, and print them space-separated.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    draws = int(data[idx]); idx += 1
    seed = int(data[idx]); idx += 1
    tokens, weights = [], []
    for _ in range(n):
        tokens.append(data[idx]); idx += 1
        weights.append(int(data[idx])); idx += 1

    total = sum(weights)
    cum = []
    running = 0
    for w in weights:
        running += w
        cum.append(running)

    counts = [0] * n
    state = seed
    for _ in range(draws):
        state = (1664525 * state + 1013904223) % 4294967296
        r = state % total
        for i in range(n):
            if r < cum[i]:
                counts[i] += 1
                break

    print(" ".join(str(c) for c in counts))

main()
`,
      challenge_test_cases: [
        { input: "3 1000 0\na 70\nb 20\nc 10", expected_output: "703 200 97", description: "Empirical counts track the 70/20/10 weights over 1000 seeded draws." },
        { input: "2 10000 42\nheads 1\ntails 1", expected_output: "5000 5000", description: "Even split; seed 42 yields an exact 5000/5000 here." },
        { input: "1 5 99\nonly 7", expected_output: "5", description: "Single token absorbs every draw regardless of seed." },
        { input: "3 0 0\na 1\nb 1\nc 1", expected_output: "0 0 0", description: "Zero draws means every count stays 0." }
      ]
    },
    {
      id: "ai-19-l2",
      project_id: "ai-19",
      order: 2,
      title: "Temperature: The Randomness Dial",
      concept: "Temperature",
      xp_reward: 10,
      explanation: `If sampling is drawing weighted tickets from a hat, **temperature** is the knob that decides how lopsided the hat is. Crank it down and the favorite gets almost every ticket — the model becomes focused and repeatable. Crank it up and the long shots get a real chance — the model gets wild and inventive.

## What it is

**Temperature** is a single number (commonly 0 to 2) that *reshapes* the probability distribution before sampling. It doesn't change what the model thinks is likely; it changes how strongly it favors the likely options.

- **Low temperature (→ 0):** sharpen the distribution. The top token's lead grows; everything else shrinks toward zero. At 0 it's effectively greedy — deterministic and focused.
- **High temperature (> 1):** flatten the distribution. Gaps between tokens narrow, so unlikely tokens become genuinely reachable. Output gets creative — and at extremes, incoherent.

## How it works

Under the hood, each token has a raw score (a **logit**). Temperature divides every logit by \`T\` before they're turned into probabilities by **softmax**:

- Dividing by a *small* \`T\` (like 0.5) makes the scores spread further apart -> the leader pulls away -> **sharper**.
- Dividing by a *large* \`T\` (like 2.0) squashes the scores together -> the leader's edge shrinks -> **flatter**.

Here is the reshape on a tiny example:

\`\`\`python
import math

def softmax_with_temp(logits, T):
    scaled = [x / T for x in logits]
    m = max(scaled)                      # subtract max for numerical safety
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

logits = [2.0, 1.0, 0.0]
print("T=0.5 (sharp):", softmax_with_temp(logits, 0.5))
print("T=1.0 (base): ", softmax_with_temp(logits, 1.0))
print("T=2.0 (flat): ", softmax_with_temp(logits, 2.0))
\`\`\`

Watch the top token: its probability is highest at low \`T\` and lowest at high \`T\`. Same model, same logits — only the *shape* changed.

## Why it matters

Temperature is the cheapest, most direct lever you have over a model's "personality":

- **Need the same answer twice?** Drop temperature to 0. Great for extraction, classification, and code where you want determinism.
- **Need ten fresh ideas?** Raise it toward 1.0–1.3. The model explores more of the distribution.
- **Going too high backfires.** Past ~1.5 the distribution is so flat the model picks nonsense tokens and coherence falls apart. Higher is not "smarter," just looser.

## The mental model to keep

**Temperature is a volume knob on randomness.** Low = the favorite shouts over everyone (focused, repeatable). High = everyone talks at once (creative, chaotic). It reshapes the odds; it never adds new knowledge.`,
      key_terms: [
        { term: "Temperature", definition: "A number that reshapes the probability distribution before sampling: low sharpens it, high flattens it." },
        { term: "Logit", definition: "The raw, unnormalized score a model assigns to a token before it becomes a probability." },
        { term: "Softmax", definition: "The function that turns raw logits into probabilities that sum to 1." }
      ],
      callouts: [
        { type: "analogy", title: "A volume knob on randomness", content: "Low temperature is the favorite shouting over everyone else — focused and repeatable. High temperature is the whole room talking at once — creative, surprising, sometimes nonsense.", position: "before" },
        { type: "warning", title: "Higher isn't smarter", content: "Cranking temperature past ~1.5 doesn't make the model more clever — it flattens the odds so much that it starts grabbing nonsense tokens. More heat means more chaos, not more intelligence.", position: "after" }
      ],
      concept_diagram: {
        title: "How temperature reshapes the odds",
        steps: [
          { label: "Raw logits", desc: "Each token has an unnormalized score." },
          { label: "Divide by T", desc: "Small T spreads scores apart; large T squashes them together." },
          { label: "Softmax", desc: "Scaled scores become probabilities summing to 1." },
          { label: "Sample", desc: "Sharper = favorite wins; flatter = long shots get a chance." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does LOW temperature do to the distribution?",
          options: ["Flattens it so all tokens are equally likely", "Sharpens it so the top token dominates", "Adds new tokens to the vocabulary"],
          correct_index: 1,
          explanation: "Low temperature sharpens the distribution, making the highest-probability token dominate — focused and near-deterministic."
        }
      ],
      quiz_questions: [
        {
          question: "Setting temperature to 0 makes a model behave like what?",
          options: [
            "Greedy decoding — deterministic, always the top token",
            "Pure random choice",
            "It refuses to answer",
            "It outputs every token at once"
          ],
          correct_index: 0,
          explanation: "At temperature 0 the distribution is maximally sharp, so the model effectively always takes the top token — greedy and repeatable."
        },
        {
          question: "Mechanically, what does temperature do to the raw logits?",
          options: [
            "Adds a random number to each one",
            "Divides each logit by T before softmax",
            "Removes the lowest-scoring tokens",
            "Sorts them alphabetically"
          ],
          correct_index: 1,
          explanation: "Temperature scales the logits by dividing by T; small T sharpens, large T flattens, then softmax converts to probabilities."
        },
        {
          question: "What typically happens at very high temperature (e.g., 1.8+)?",
          options: [
            "The model becomes more factually accurate",
            "Output gets less coherent because unlikely tokens become too reachable",
            "The model speeds up dramatically",
            "It always returns the same token"
          ],
          correct_index: 1,
          explanation: "A very flat distribution lets nonsense tokens win, so coherence degrades. High temperature means more chaos, not more intelligence."
        }
      ],
      participation_activities: [
        {
          activity_title: "Temperature check",
          questions: [
            { question: "Raising the temperature makes the model more likely to pick lower-probability tokens.", type: "true_false", correct_answer: "true", explanation: "Higher temperature flattens the distribution, giving unlikely tokens a real chance." },
            { question: "Temperature reshapes the logits by dividing them, then converting to probabilities with ______.", type: "fill_in", correct_answer: "softmax", explanation: "After scaling logits by 1/T, softmax turns them into a probability distribution." }
          ]
        }
      ],
      starter_code: `# Apply temperature to logits and watch the top token's probability change.
import math

logits = [2.0, 1.0, 0.0]

def softmax_with_temp(logits, T):
    scaled = [x / T for x in logits]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

# TODO: print the distribution at T=0.5 and at T=2.0.
print("base T=1.0:", softmax_with_temp(logits, 1.0))
`,
      solution_code: `import math

logits = [2.0, 1.0, 0.0]

def softmax_with_temp(logits, T):
    scaled = [x / T for x in logits]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

print("base T=1.0:", softmax_with_temp(logits, 1.0))
print("sharp T=0.5:", softmax_with_temp(logits, 0.5))
print("flat T=2.0:", softmax_with_temp(logits, 2.0))
`,
      expected_output: `base T=1.0: [0.665, 0.245, 0.09]
sharp T=0.5: [0.867, 0.117, 0.016]
flat T=2.0: [0.506, 0.307, 0.186]`,
      step_throughs: [
        {
          title: "the same logits at three temperatures",
          steps: [
            { label: "Start with logits", detail: "The model assigns raw scores. The first token leads, but not by a landslide.", code: "logits = [2.0, 1.0, 0.0]" },
            { label: "Low T sharpens", detail: "Dividing by 0.5 doubles the gaps. After softmax the leader balloons toward ~0.87 — focused.", code: "T=0.5 -> [0.867, 0.117, 0.016]" },
            { label: "Base T", detail: "Dividing by 1.0 leaves scores as-is. The leader sits around 0.665 — the default shape.", code: "T=1.0 -> [0.665, 0.245, 0.09]" },
            { label: "High T flattens", detail: "Dividing by 2.0 halves the gaps. The leader drops to ~0.51 while the long shots climb — creative/chaotic.", code: "T=2.0 -> [0.506, 0.307, 0.186]" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You need a model to extract a date from text and you must get the exact same result every time you run it. What temperature should you use?",
          steps: [
            "Determinism means the distribution must be as sharp as possible.",
            "Temperature 0 makes the model effectively greedy — it always takes the top token.",
            "So the same input yields the same extracted date on every run."
          ],
          output: "Temperature 0 — deterministic and repeatable."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two tokens have logits 3.0 and 2.0. Explain, without exact numbers, how the gap between their probabilities changes as you go from T=0.5 to T=2.0.",
          steps: [
            "At T=0.5 the logits are scaled to 6.0 and 4.0 — a gap of 2.0, which is wider than the original 1.0.",
            "A wider logit gap means softmax pushes the leader's probability much higher: sharp.",
            "At T=2.0 the logits scale to 1.5 and 1.0 — a gap of only 0.5, narrower than the original.",
            "A narrower gap means the two probabilities move closer together: flat. So lower T widens the probability gap, higher T shrinks it."
          ],
          output: "Lower T widens the probability gap (leader dominates); higher T shrinks it (more even)."
        }
      ],
      comparison_tables: [
        {
          title: "low vs high temperature",
          columns: ["Aspect", "Low temperature (→0)", "High temperature (>1)"],
          rows: [
            { cells: ["Distribution shape", "Sharper (peaked)", "Flatter (spread out)"] },
            { cells: ["Behavior", "Focused, repeatable", "Creative, varied"] },
            { cells: ["Risk", "Repetitive, dull", "Incoherent, off-topic"] },
            { cells: ["Good for", "Facts, code, extraction", "Brainstorming, stories"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "low temperature vs high temperature",
          bins: [
            { id: "low", label: "Low temperature" },
            { id: "high", label: "High temperature" }
          ],
          items: [
            { id: "i1", text: "Sharpens the distribution", bin: "low" },
            { id: "i2", text: "Flattens the distribution", bin: "high" },
            { id: "i3", text: "Near-deterministic, repeatable", bin: "low" },
            { id: "i4", text: "More likely to pick long-shot tokens", bin: "high" },
            { id: "i5", text: "Best for factual extraction", bin: "low" },
            { id: "i6", text: "Best for creative brainstorming", bin: "high" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does dividing the logits by a small temperature make the model more focused?",
          sampleAnswer: "Dividing by a small number spreads the logits further apart, so the gap between the top token and the rest grows. When softmax turns those into probabilities, a bigger gap means the leader gets an even larger share and the others shrink toward zero. The distribution becomes sharply peaked, so sampling almost always picks the favorite — focused and nearly deterministic."
        }
      ],
      hints: [
        "Pass a different T to softmax_with_temp for each line you print.",
        "Smaller T (0.5) should make the first probability bigger; larger T (2.0) smaller.",
        "The function already handles the math — you just call it with T=0.5 and T=2.0."
      ],
      challenge_title: "The Temperature Dial",
      challenge_description: "Implement the exact softmax-with-temperature the sampler runs, then report, at each requested temperature, which token leads and how confident the model is in it.",
      challenge_story: "You're tuning the temperature dial on a content-generation service. Product wants one knob users can drag from 'precise' to 'playful', and you need a panel that shows, for a given set of next-token **logits**, how the winning token and its probability shift as temperature changes. Low temperature should make the model look decisive (one fat probability); high temperature should flatten everything toward a coin flip. Build the backend that powers that panel: a numerically-safe softmax that divides logits by temperature before exponentiating.",
      challenge_statement: "You are given \`n\` tokens, each with a floating-point **logit**, and \`q\` **temperatures** to evaluate. For each temperature \`T\`, compute the temperature-scaled softmax:\n\n1. Divide every logit by \`T\` to get scaled logits.\n2. For numerical safety, subtract the **maximum** scaled logit from each before exponentiating.\n3. Exponentiate, then divide by the sum so the probabilities total 1.\n\nFor that temperature, print the token with the **highest probability** and that probability, formatted to exactly **4 decimal places**. If two tokens tie on probability, print the **lexicographically smallest** token.\n\nProduce one output line per temperature, in the order given.",
      challenge_input_format: "The first line has two integers `n q`: the number of tokens and the number of temperatures.\n\nEach of the next `n` lines has a token (no spaces) and its floating-point `logit`.\n\nEach of the next `q` lines has a single floating-point temperature `T`.",
      challenge_output_format: "`q` lines. Each is the winning `token` then its probability to exactly 4 decimal places, separated by one space (e.g. `blue 0.7870`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ q ≤ 100",
        "-50.0 ≤ logit ≤ 50.0",
        "0.01 ≤ T ≤ 100.0",
      ],
      challenge_examples: [
        { input: "3 3\nblue 1.5\nclear 0.5\ndark 0.5\n0.5\n1.0\n2.0", output: "blue 0.7870\nblue 0.5761\nblue 0.4519", explanation: "`blue` always leads, but its probability melts from 0.79 (decisive, T=0.5) toward 0.45 (T=2.0) as temperature flattens the distribution." },
        { input: "4 2\nthe 3.0\na 2.0\nan 2.0\nzebra 0.0\n0.7\n1.5", output: "the 0.6698\nthe 0.4625", explanation: "`the` wins both; higher temperature lets `a` and `an` close the gap, so the leader's share drops." },
      ],
      challenge_notes: "Subtracting the max before `exp` never changes the result — it just keeps the exponents small so they don't overflow to `inf`. This is the standard 'stable softmax' trick every production inference stack uses. Notice T appears only as `logit / T`: shrinking T magnifies differences (sharp), growing T shrinks them (flat).",
      challenge_hints: [
        "Write one helper `softmax_temp(logits, T)` and call it once per temperature.",
        "Find the argmax by tracking the best probability so far; break exact ties by comparing token strings.",
        "Use an f-string like `f\"{p:.4f}\"` so the probability always shows 4 decimals, even trailing zeros.",
      ],
      challenge_starter_code: `import sys, math

def softmax_temp(logits, T):
    # TODO: scale by T, subtract the max, exponentiate, normalize.
    return []

def main():
    data = sys.stdin.read().split("\\n")
    n, q = map(int, data[0].split())
    tokens, logits = [], []
    for i in range(1, n + 1):
        tok, lg = data[i].split()
        tokens.append(tok)
        logits.append(float(lg))
    # TODO: for each of the q temperatures, print the winning token and its
    #       probability to 4 decimals (lexicographic tie-break).

main()
`,
      challenge_solution_code: `import sys, math

def softmax_temp(logits, T):
    scaled = [x / T for x in logits]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    s = sum(exps)
    return [e / s for e in exps]

def main():
    data = sys.stdin.read().split("\\n")
    n, q = map(int, data[0].split())
    tokens, logits = [], []
    for i in range(1, n + 1):
        tok, lg = data[i].split()
        tokens.append(tok)
        logits.append(float(lg))

    out = []
    for j in range(q):
        T = float(data[n + 1 + j].strip())
        probs = softmax_temp(logits, T)
        best = 0
        for i in range(1, n):
            if probs[i] > probs[best] + 1e-12:
                best = i
            elif abs(probs[i] - probs[best]) <= 1e-12 and tokens[i] < tokens[best]:
                best = i
        out.append(f"{tokens[best]} {probs[best]:.4f}")

    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3 3\nblue 1.5\nclear 0.5\ndark 0.5\n0.5\n1.0\n2.0", expected_output: "blue 0.7870\nblue 0.5761\nblue 0.4519", description: "Same logits at three temperatures: the leader's confidence falls as T rises." },
        { input: "4 2\nthe 3.0\na 2.0\nan 2.0\nzebra 0.0\n0.7\n1.5", expected_output: "the 0.6698\nthe 0.4625", description: "Larger vocab; higher T narrows the leader's margin." },
        { input: "1 1\nonly 5.0\n0.7", expected_output: "only 1.0000", description: "A single token always gets probability 1 at any temperature." },
        { input: "2 1\nzebra 1.0\napple 1.0\n5.0", expected_output: "apple 0.5000", description: "Equal logits tie at 0.5; lexicographic tie-break picks `apple`." }
      ]
    },
    {
      id: "ai-19-l3",
      project_id: "ai-19",
      order: 3,
      title: "Top-p and Top-k",
      concept: "Nucleus sampling",
      xp_reward: 10,
      explanation: `Temperature reshapes *how lopsided* the odds are. But there's a separate problem: even after reshaping, the model's hat still contains tens of thousands of junk tokens, each with a tiny sliver of probability. Add up enough slivers and there's a real chance of drawing garbage. **Top-k** and **top-p** fix this by throwing out the junk *before* the draw.

## What they are

Both are **truncation** methods — they shrink the pool of tokens you're allowed to sample from.

- **Top-k:** keep only the \`k\` highest-probability tokens; discard the rest. With \`k=3\`, only the top three are eligible, no matter how the rest look.
- **Top-p (nucleus sampling):** keep the smallest set of top tokens whose probabilities *add up to* \`p\`. With \`p=0.9\`, you keep tokens from the top down until their cumulative probability hits 0.9, then stop.

The key difference: top-k keeps a **fixed count**; top-p keeps a **variable count** that adapts to how confident the model is.

## How it works

After keeping the chosen tokens, you **renormalize** — rescale the survivors so they sum to 1 again — then sample. Here's top-p in code:

\`\`\`python
def top_p(tokens, probs, p):
    pairs = sorted(zip(tokens, probs), key=lambda x: -x[1])  # high to low
    kept, total = [], 0.0
    for tok, pr in pairs:
        kept.append((tok, pr))
        total += pr
        if total >= p:        # cumulative mass reached the threshold
            break
    s = sum(pr for _, pr in kept)
    return [(tok, round(pr / s, 3)) for tok, pr in kept]  # renormalized

tokens = ["blue", "clear", "dark", "green", "loud"]
probs  = [0.55,   0.25,    0.12,   0.05,    0.03]
print(top_p(tokens, probs, 0.9))
\`\`\`

Why top-p adapts: if the model is **very sure** (one token at 0.95), top-p keeps just that one — tight. If the model is **unsure** (probabilities spread thin), top-p keeps many tokens — exploratory. It automatically widens or narrows the net based on confidence. Top-k can't do that; \`k=3\` is always three, whether the model is certain or clueless.

## Why it matters

These run *alongside* temperature, not instead of it. A common recipe is "temperature plus top-p":

- **Top-p ~0.9** is a popular default. It trims the long tail of nonsense while still allowing healthy variety.
- **Top-k** is simpler and predictable, useful when you want a hard cap on how many options exist.
- They mostly cut **garbage**, not creativity. Removing the bottom 0.1% of probability mass rarely costs you a good idea, but it sharply reduces "where did *that* word come from?" moments.

## The mental model to keep

Temperature decides how loose the dice are; **top-k/top-p decide which dice are even on the table.** Top-k keeps a fixed number of options; top-p keeps just enough to cover most of the probability — wide when the model is unsure, narrow when it's confident.`,
      key_terms: [
        { term: "Top-k", definition: "Keep only the k highest-probability tokens, then sample from those." },
        { term: "Top-p (nucleus sampling)", definition: "Keep the smallest set of top tokens whose probabilities sum to at least p, then sample from those." },
        { term: "Renormalize", definition: "Rescale the kept tokens' probabilities so they sum to 1 again before sampling." }
      ],
      callouts: [
        { type: "analogy", title: "Deciding which dice are on the table", content: "Temperature sets how loose the dice are. Top-k/top-p decide which dice are even allowed in the game — top-k keeps a fixed number, top-p keeps just enough to cover most of the odds.", position: "before" },
        { type: "tip", title: "top-p ≈ 0.9 is a safe default", content: "Keeping the top tokens until their probability adds up to ~0.9 trims the long tail of junk while leaving plenty of room for variety. It's a common, sensible starting point.", position: "after" }
      ],
      concept_diagram: {
        title: "How top-p trims the candidate pool",
        steps: [
          { label: "Sort tokens", desc: "Order all tokens from highest to lowest probability." },
          { label: "Accumulate", desc: "Add probabilities from the top until they reach p." },
          { label: "Cut the tail", desc: "Discard every token below that cutoff." },
          { label: "Renormalize + sample", desc: "Rescale survivors to sum to 1, then draw." }
        ]
      },
      inline_quizzes: [
        {
          question: "How does top-p differ from top-k?",
          options: ["Top-p keeps a fixed number of tokens; top-k keeps a variable number", "Top-p keeps a variable number based on cumulative probability; top-k keeps a fixed number", "They are identical"],
          correct_index: 1,
          explanation: "Top-p keeps just enough top tokens to reach cumulative probability p (variable count); top-k always keeps exactly k tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What does top-k do?",
          options: [
            "Keeps the k highest-probability tokens and discards the rest",
            "Keeps tokens until probabilities sum to k",
            "Multiplies every logit by k",
            "Removes the top k tokens"
          ],
          correct_index: 0,
          explanation: "Top-k keeps a fixed count — the k most probable tokens — and samples only from those."
        },
        {
          question: "Why does top-p adapt to the model's confidence?",
          options: [
            "It always keeps exactly the same number of tokens",
            "It keeps few tokens when one is very likely, and many when probabilities are spread out",
            "It ignores probabilities entirely",
            "It raises the temperature automatically"
          ],
          correct_index: 1,
          explanation: "Because it keeps just enough tokens to reach cumulative probability p, a confident distribution needs few tokens and an uncertain one needs many."
        },
        {
          question: "What is the main thing top-k and top-p remove?",
          options: [
            "All creativity from the model",
            "The long tail of very unlikely 'junk' tokens",
            "The most probable token",
            "The system prompt"
          ],
          correct_index: 1,
          explanation: "They truncate the low-probability tail, cutting nonsense tokens while keeping the realistic candidates."
        }
      ],
      participation_activities: [
        {
          activity_title: "Truncation check",
          questions: [
            { question: "Top-k keeps a fixed number of candidate tokens regardless of the model's confidence.", type: "true_false", correct_answer: "true", explanation: "k is a constant count; top-p is the one that varies with confidence." },
            { question: "Keeping the smallest set of top tokens whose probabilities sum to at least p is called ______ sampling.", type: "fill_in", correct_answer: "nucleus", explanation: "Top-p is also known as nucleus sampling." }
          ]
        }
      ],
      starter_code: `# Apply top-k: keep only the k most probable tokens, then renormalize.
tokens = ["blue", "clear", "dark", "green", "loud"]
probs  = [0.55,   0.25,    0.12,   0.05,    0.03]
k = 3

# TODO: keep the top k tokens by probability and print them renormalized (3 decimals).
pairs = sorted(zip(tokens, probs), key=lambda x: -x[1])
print("sorted:", pairs)
`,
      solution_code: `tokens = ["blue", "clear", "dark", "green", "loud"]
probs  = [0.55,   0.25,    0.12,   0.05,    0.03]
k = 3

pairs = sorted(zip(tokens, probs), key=lambda x: -x[1])
kept = pairs[:k]
s = sum(pr for _, pr in kept)
renorm = [(tok, round(pr / s, 3)) for tok, pr in kept]

print("sorted:", pairs)
print("kept top-k:", renorm)
`,
      expected_output: `sorted: [('blue', 0.55), ('clear', 0.25), ('dark', 0.12), ('green', 0.05), ('loud', 0.03)]
kept top-k: [('blue', 0.598), ('clear', 0.272), ('dark', 0.13)]`,
      step_throughs: [
        {
          title: "top-p on a five-token hat (p=0.9)",
          steps: [
            { label: "Sort high to low", detail: "Order tokens by probability so we can accumulate from the most likely down.", code: "blue 0.55, clear 0.25, dark 0.12, green 0.05, loud 0.03" },
            { label: "Accumulate to p", detail: "Add from the top: 0.55, then 0.80, then 0.92. We hit 0.9 after 'dark', so we stop there.", code: "0.55 -> 0.80 -> 0.92 >= 0.9  stop" },
            { label: "Cut the tail", detail: "'green' and 'loud' fall below the cutoff and are discarded — that's the junk-tail trim.", code: "kept = [blue, clear, dark]; dropped = [green, loud]" },
            { label: "Renormalize + sample", detail: "The three survivors (summing to 0.92) are rescaled to sum to 1, then sampled.", code: "blue 0.598, clear 0.272, dark 0.130 -> draw" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "With top-k = 2 and tokens [a:0.5, b:0.3, c:0.15, d:0.05], which tokens can be sampled?",
          steps: [
            "Top-k keeps the k highest-probability tokens. Here k = 2.",
            "Sort high to low: a (0.5), b (0.3), c (0.15), d (0.05).",
            "Keep the top two: a and b. c and d are discarded."
          ],
          output: "Only 'a' and 'b' are eligible."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "The model is extremely confident: one token has probability 0.97. Compare what top-k=5 versus top-p=0.9 keep.",
          steps: [
            "Top-k=5 keeps five tokens no matter what — so four near-zero junk tokens stay in the pool.",
            "Top-p=0.9 accumulates from the top: the 0.97 token alone already exceeds 0.9.",
            "So top-p stops immediately and keeps just that one token.",
            "Result: top-p adapts to the confidence (keeps 1), while top-k blindly keeps 5."
          ],
          output: "Top-k=5 keeps 5 tokens; top-p=0.9 keeps only the single 0.97 token — top-p adapts, top-k doesn't."
        }
      ],
      comparison_tables: [
        {
          title: "top-k vs top-p",
          columns: ["Aspect", "Top-k", "Top-p (nucleus)"],
          rows: [
            { cells: ["What it keeps", "A fixed count of k tokens", "Smallest set summing to p"] },
            { cells: ["Adapts to confidence?", "No — always k", "Yes — fewer when sure, more when unsure"] },
            { cells: ["Typical value", "k = 20–50", "p = 0.9"] },
            { cells: ["Main strength", "Simple, predictable cap", "Confidence-aware trimming"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "describes top-k vs describes top-p",
          bins: [
            { id: "topk", label: "Top-k" },
            { id: "topp", label: "Top-p" }
          ],
          items: [
            { id: "i1", text: "Keeps a fixed number of tokens", bin: "topk" },
            { id: "i2", text: "Keeps tokens until cumulative probability hits a threshold", bin: "topp" },
            { id: "i3", text: "Also called nucleus sampling", bin: "topp" },
            { id: "i4", text: "Count never changes with confidence", bin: "topk" },
            { id: "i5", text: "Keeps fewer tokens when the model is very sure", bin: "topp" },
            { id: "i6", text: "Controlled by a value like 40", bin: "topk" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is top-p often preferred over top-k for general use?",
          sampleAnswer: "Top-p adapts to the model's confidence. When the model is sure, it keeps very few tokens and stays tight; when the model is uncertain, it keeps more and allows exploration. Top-k uses a fixed count, so it can keep junk tokens when the model is confident or cut off good options when the model is unsure. Top-p's confidence-aware trimming usually gives a better balance of quality and variety."
        }
      ],
      hints: [
        "Sort the (token, prob) pairs from highest to lowest first.",
        "For top-k, slice the sorted list with [:k] to keep the first k.",
        "Renormalize: divide each kept probability by the sum of the kept probabilities."
      ],
      challenge_title: "The Nucleus Filter",
      challenge_description: "Build the nucleus (top-p) filter a sampler runs before it draws: keep the smallest set of leading tokens whose probability covers p, drop the long tail, and renormalize what's left.",
      challenge_story: "Your generation service keeps emitting the occasional bizarre word — a token from the deep tail of the distribution that should almost never have been picked. The fix the team agreed on is **nucleus sampling (top-p)**: before sampling, throw away the unlikely tail and only sample from the smallest group of top tokens that together cover a probability mass of \`p\`. You're implementing the filter stage. Given the model's next-token distribution, return exactly which tokens survive and their renormalized probabilities, so the downstream sampler only ever sees plausible options.",
      challenge_statement: "You are given \`n\` tokens, each with a probability, and a threshold \`p\`. Apply top-p filtering:\n\n1. Sort tokens by probability **descending**. Break ties by **lexicographically smallest** token first.\n2. Walk the sorted list, adding tokens to the kept set and accumulating their probability, until the accumulated mass is **at least \`p\`**. Include the token that crosses the threshold, then stop.\n3. **Renormalize** the kept tokens: divide each kept probability by the sum of the kept probabilities so they total 1.\n\nPrint the number of kept tokens, then each kept token (in the sorted order) with its renormalized probability to exactly **4 decimal places**.",
      challenge_input_format: "The first line has an integer `n` and a float `p`: `n p`.\n\nEach of the next `n` lines has a token (no spaces) and its float `probability`. The probabilities sum to 1.",
      challenge_output_format: "First line: the count of kept tokens. Then one line per kept token (in descending-probability order): the `token` and its renormalized probability to exactly 4 decimal places.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0.0 < p ≤ 1.0",
        "Each probability is in (0, 1]; the n probabilities sum to 1.",
        "Renormalized probabilities are printed to 4 decimals.",
      ],
      challenge_examples: [
        { input: "4 0.75\na 0.5\nb 0.3\nc 0.15\nd 0.05", output: "2\na 0.6250\nb 0.3750", explanation: "Cumulative mass: 0.5 (a), then 0.8 (b) which crosses 0.75, so keep {a, b}. Renormalized over 0.8: a → 0.625, b → 0.375. The tail c and d are dropped." },
        { input: "5 0.9\nthe 0.4\nquick 0.25\nbrown 0.2\nfox 0.1\njumps 0.05", output: "4\nthe 0.4211\nquick 0.2632\nbrown 0.2105\nfox 0.1053", explanation: "0.4, 0.65, 0.85, then 0.95 crosses 0.9, so keep the top four. `jumps`, the unlikely tail token, is filtered out." },
      ],
      challenge_notes: "Top-p adapts the candidate pool to the distribution: when the model is confident, one or two tokens cover p and the pool is tiny; when it's unsure, the pool grows. That's the advantage over fixed top-k. Renormalizing matters — after dropping the tail the survivors no longer sum to 1, so you rescale before sampling.",
      challenge_hints: [
        "Sort with a key like `(-prob, token)` so ties fall back to lexicographic order automatically.",
        "Accumulate into the kept list first, then compute the kept sum once at the end for renormalization.",
        "Use a tiny epsilon (e.g. compare `total >= p - 1e-12`) so floating-point sums like 0.8 reliably clear a p of 0.8.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    p = float(first[1])
    pairs = []
    for i in range(1, n + 1):
        tok, pr = data[i].split()
        pairs.append((tok, float(pr)))
    # TODO: sort descending (lexicographic tie-break), keep the smallest set
    #       covering p, renormalize, and print the count then each kept token.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    p = float(first[1])
    pairs = []
    for i in range(1, n + 1):
        tok, pr = data[i].split()
        pairs.append((tok, float(pr)))

    pairs.sort(key=lambda x: (-x[1], x[0]))
    kept = []
    total = 0.0
    for tok, pr in pairs:
        kept.append((tok, pr))
        total += pr
        if total >= p - 1e-12:
            break

    s = sum(pr for _, pr in kept)
    out = [str(len(kept))]
    for tok, pr in kept:
        out.append(f"{tok} {pr / s:.4f}")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "4 0.75\na 0.5\nb 0.3\nc 0.15\nd 0.05", expected_output: "2\na 0.6250\nb 0.3750", description: "Mass 0.8 crosses p=0.75; keep top two and renormalize." },
        { input: "5 0.9\nthe 0.4\nquick 0.25\nbrown 0.2\nfox 0.1\njumps 0.05", expected_output: "4\nthe 0.4211\nquick 0.2632\nbrown 0.2105\nfox 0.1053", description: "Larger nucleus; only the deepest tail token is dropped." },
        { input: "3 1.0\nx 0.6\ny 0.3\nz 0.1", expected_output: "3\nx 0.6000\ny 0.3000\nz 0.1000", description: "p=1.0 keeps every token; renormalization is a no-op." },
        { input: "3 0.4\nx 0.6\ny 0.3\nz 0.1", expected_output: "1\nx 1.0000", description: "The leader alone already covers p=0.4, so the nucleus is a single token." }
      ]
    },
    {
      id: "ai-19-l4",
      project_id: "ai-19",
      order: 4,
      title: "Choosing Settings for the Task",
      concept: "Settings strategy",
      xp_reward: 10,
      explanation: `You now have three dials — temperature, top-p, top-k. The beginner mistake is fiddling with all of them at once. The pro move is simpler: **start from what the task needs, change one thing, and usually leave top-p alone.** This lesson is the cheat sheet.

## What it is

Picking settings is just matching randomness to the goal. Two questions sort almost every task:

1. **Is there one right answer, or many good ones?** One right answer (extract a date, classify sentiment, fix a bug) wants *low* randomness. Many good ones (slogans, story ideas, alt phrasings) wants *higher* randomness.
2. **Do you need the same output every time?** If yes — for tests, caching, reproducibility — push toward determinism.

## How it works

Here's the working playbook. In practice you mostly move **temperature** and leave **top-p ≈ 0.9**.

\`\`\`text
TASK                         temperature   notes
--------------------------   -----------   --------------------------
Data extraction / parsing       0.0        exact, repeatable
Classification / labeling       0.0        one correct bucket
Code generation / fixes      0.0 – 0.3     correctness over flair
Factual Q&A / summarizing    0.2 – 0.4     grounded, low drift
Everyday chat / explaining   0.6 – 0.8     natural but on-track
Brainstorming / ideas        0.8 – 1.1     many distinct options
Poetry / wild creative       1.0 – 1.3     surprise welcome
\`\`\`

A few rules that keep you out of trouble:

- **Move temperature first.** It's the biggest, most intuitive lever. Only touch top-p/top-k if you specifically want to cap the candidate pool.
- **Don't crank both temperature and top-p high together.** That stacks looseness on looseness and tips into incoherence. If temperature is high, a tighter top-p (~0.9) keeps it grounded.
- **For anything verifiable, default low.** Facts, code, and extraction punish randomness — a "creative" date is just a wrong date.
- **For ideation, raise temperature and ask for several options** in one call (e.g., "give me 8 distinct taglines"), which surfaces variety without re-running.

## Why it matters

The single most common cause of "the AI keeps making stuff up" or "the AI is so boring" is a temperature mismatch. A factual task at temperature 1.2 invites hallucination; a brainstorm at temperature 0 returns the same tired idea every time. Matching the dial to the job fixes both — for free, instantly, no prompt rewriting.

## The mental model to keep

**Low temperature for one-right-answer tasks, higher for many-good-answers tasks.** Keep top-p around 0.9 and move temperature first. Match the dial to the job and most "the model is wrong/boring" complaints disappear.`,
      key_terms: [
        { term: "Determinism", definition: "Producing the exact same output for the same input every time, achieved with temperature near 0." },
        { term: "Convergent task", definition: "A task with one correct answer (extraction, classification) that calls for low randomness." },
        { term: "Divergent task", definition: "A task with many good answers (brainstorming, creative writing) that benefits from higher randomness." }
      ],
      callouts: [
        { type: "tip", title: "Move temperature first", content: "Temperature is the biggest, most intuitive lever. Set it for the task, leave top-p around 0.9, and only touch top-k/top-p when you specifically need to cap the candidate pool.", position: "before" },
        { type: "warning", title: "Don't stack looseness", content: "Cranking temperature AND top-p high at the same time piles randomness on randomness and tips into incoherence. If temperature is high, keep top-p tighter (~0.9) to stay grounded.", position: "after" }
      ],
      concept_diagram: {
        title: "Pick settings in four questions",
        steps: [
          { label: "One answer or many?", desc: "Convergent task → low temp; divergent → higher temp." },
          { label: "Need it repeatable?", desc: "If yes, push temperature toward 0." },
          { label: "Set temperature", desc: "Use the playbook range for that task type." },
          { label: "Leave top-p ~0.9", desc: "Adjust only if you need to cap the candidate pool." }
        ]
      },
      inline_quizzes: [
        {
          question: "You need to extract an invoice total from text, exactly and repeatably. What temperature?",
          options: ["1.2 for creativity", "0.0 for determinism", "It doesn't matter"],
          correct_index: 1,
          explanation: "Extraction is a one-right-answer task; temperature 0 makes it exact and repeatable."
        }
      ],
      quiz_questions: [
        {
          question: "Which task is the best fit for a HIGH temperature?",
          options: [
            "Extracting a phone number from a document",
            "Classifying an email as spam or not",
            "Brainstorming 10 distinct product names",
            "Returning a fixed JSON schema"
          ],
          correct_index: 2,
          explanation: "Brainstorming is a many-good-answers (divergent) task, where higher temperature surfaces more variety."
        },
        {
          question: "Which dial should you usually adjust first?",
          options: [
            "Top-k",
            "Temperature",
            "Top-p",
            "The system prompt length"
          ],
          correct_index: 1,
          explanation: "Temperature is the biggest, most intuitive lever; top-p is usually left near 0.9 unless you need to cap the pool."
        },
        {
          question: "Why is a factual Q&A task at temperature 1.2 risky?",
          options: [
            "It runs slower",
            "High randomness invites the model to pick less-likely, often wrong tokens",
            "It uses more tokens",
            "It disables top-p automatically"
          ],
          correct_index: 1,
          explanation: "On verifiable tasks, high temperature increases the chance of plausible-but-wrong output — a 'creative' fact is just a wrong fact."
        }
      ],
      participation_activities: [
        {
          activity_title: "Settings strategy check",
          questions: [
            { question: "For a task with one correct answer, you should generally use a low temperature.", type: "true_false", correct_answer: "true", explanation: "Convergent tasks want low randomness so the model lands on the single right answer." },
            { question: "When you need the exact same output every time, push the temperature toward ______.", type: "fill_in", correct_answer: "0", explanation: "Temperature near 0 makes the model effectively deterministic." }
          ]
        }
      ],
      starter_code: `# Recommend a temperature based on the task type.
def recommend_temp(task):
    convergent = {"extraction", "classification", "code"}
    if task in convergent:
        return 0.0
    return 0.9

# TODO: print a recommendation for "extraction" and for "brainstorm".
print("extraction ->", recommend_temp("extraction"))
`,
      solution_code: `def recommend_temp(task):
    convergent = {"extraction", "classification", "code"}
    if task in convergent:
        return 0.0
    return 0.9

print("extraction ->", recommend_temp("extraction"))
print("brainstorm ->", recommend_temp("brainstorm"))
`,
      expected_output: `extraction -> 0.0
brainstorm -> 0.9`,
      step_throughs: [
        {
          title: "choosing settings for a real task",
          steps: [
            { label: "Name the task", detail: "You need to pull the due date out of an invoice and get it right every time.", code: 'task = "extract due date"' },
            { label: "One answer or many?", detail: "There is exactly one correct date. This is a convergent task — randomness can only hurt.", code: "answers = exactly one correct" },
            { label: "Set temperature low", detail: "Convergent + needs to be repeatable → temperature 0 for deterministic, exact output.", code: "temperature = 0.0" },
            { label: "Leave top-p default", detail: "No need to widen the pool; keep top-p ~0.9 and don't touch top-k. Done.", code: "top_p = 0.9  # unchanged" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You want the model to label customer reviews as positive, negative, or neutral. What temperature and why?",
          steps: [
            "Each review has one correct label — this is a convergent classification task.",
            "Randomness could flip a clear 'positive' into 'neutral' on a re-run.",
            "Use temperature 0 so the label is consistent and repeatable."
          ],
          output: "Temperature 0 — classification is a one-right-answer task."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A user complains: 'I ask for blog title ideas and it gives me the same three every time.' What settings change fixes this, and what's the risk if you overdo it?",
          steps: [
            "Generating title ideas is a divergent task — many good answers exist.",
            "The repetition means temperature is too low, so the model keeps picking the same favorites.",
            "Raise temperature toward 0.9–1.1 to surface more variety, and ask for several titles in one call.",
            "Risk of overdoing it: push past ~1.5 and the titles become incoherent word salad — higher isn't smarter, just looser."
          ],
          output: "Raise temperature to ~0.9–1.1 for variety; going past ~1.5 risks incoherent output."
        }
      ],
      comparison_tables: [
        {
          title: "matching settings to the task",
          columns: ["Task", "Temperature", "Why"],
          rows: [
            { cells: ["Data extraction", "0.0", "Exact, repeatable, one right answer"] },
            { cells: ["Code generation", "0.0–0.3", "Correctness matters more than flair"] },
            { cells: ["Everyday chat", "0.6–0.8", "Natural but stays on track"] },
            { cells: ["Brainstorming", "0.8–1.1", "Many distinct options wanted"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "use low temperature vs higher temperature",
          bins: [
            { id: "low", label: "Low temperature (→0)" },
            { id: "high", label: "Higher temperature (>0.8)" }
          ],
          items: [
            { id: "i1", text: "Extracting a date from an invoice", bin: "low" },
            { id: "i2", text: "Brainstorming startup names", bin: "high" },
            { id: "i3", text: "Classifying reviews as positive/negative", bin: "low" },
            { id: "i4", text: "Writing a whimsical short poem", bin: "high" },
            { id: "i5", text: "Generating a fixed JSON schema", bin: "low" },
            { id: "i6", text: "Listing many alternative slogans", bin: "high" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does matching temperature to the task fix both 'the model keeps making stuff up' and 'the model is so boring' complaints?",
          sampleAnswer: "Both complaints are temperature mismatches. 'Making stuff up' usually means temperature is too high for a factual task — the model is sampling less-likely, sometimes wrong tokens. 'So boring' usually means temperature is too low for a creative task — the model keeps grabbing the same favorites. Lowering it for factual work makes answers exact and grounded; raising it for creative work surfaces variety. The same dial fixes opposite problems by aligning randomness with what the task actually needs."
        }
      ],
      hints: [
        "Define a set of convergent task names that should get temperature 0.",
        "If the task is in that set, return 0.0; otherwise return a higher value like 0.9.",
        "Call recommend_temp twice — once with 'extraction', once with 'brainstorm'."
      ],
      challenge_title: "The Settings Advisor",
      challenge_description: "Build the rules engine that picks temperature and top-p for each job a model is asked to do, downgrading risky high-stakes tasks to safe, near-deterministic settings.",
      challenge_story: "Your platform runs dozens of AI features — extraction, summarization, chat, brainstorming — and engineers keep guessing at sampling settings, sometimes shipping a customer-facing tool at temperature 1.0 (chaos) or a poetry toy at temperature 0 (boring). You're writing the **settings advisor**: a single rules engine that maps each task's category and risk level to a sane \`temperature\` and \`top_p\`. Convergent, single-right-answer tasks get pinned near 0; creative ones get room to roam — but anything flagged **high-risk** gets clamped down hard, because a wrong-but-confident extraction costs more than a dull one.",
      challenge_statement: "You are given \`n\` tasks. Each task has a **category** and an integer **risk** from 0 to 10. For each task, compute a recommendation:\n\n1. The base temperature comes from the category:\n   - \`extraction\`, \`classification\`, \`code\`, \`math\` → **0.0**\n   - \`summary\` → **0.3**\n   - \`chat\` → **0.7**\n   - \`brainstorm\` → **1.0**\n   - \`poetry\` → **1.2**\n   - any **other** category → **0.7**\n2. **Risk clamp:** if \`risk ≥ 7\` and the base temperature is above 0.2, lower it to **0.2**.\n3. Set \`top_p\`: if the resulting temperature is exactly **0.0**, use **1.0** (sampling is off anyway); otherwise use **0.9**.\n\nPrint one line per task: \`temp=<t>, top_p=<tp>\`, each value to exactly **one decimal place**.",
      challenge_input_format: "The first line has an integer `n`: the number of tasks.\n\nEach of the next `n` lines has a category (no spaces) and an integer `risk`.",
      challenge_output_format: "`n` lines. Each: `temp=<t>, top_p=<tp>` with both numbers formatted to exactly one decimal place (e.g. `temp=0.0, top_p=1.0`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ risk ≤ 10",
        "Category is one lowercase word; unknown categories default to temperature 0.7.",
      ],
      challenge_examples: [
        { input: "4\nclassification 2\npoetry 1\nchat 8\nextraction 9", output: "temp=0.0, top_p=1.0\ntemp=1.2, top_p=0.9\ntemp=0.2, top_p=0.9\ntemp=0.0, top_p=1.0", explanation: "`classification` and `extraction` are convergent → temp 0 (and extraction's risk 9 is moot since it's already 0). `poetry` stays at 1.2 (low risk). `chat` at risk 8 gets clamped from 0.7 down to 0.2." },
        { input: "5\ncode 0\nsummary 3\nbrainstorm 0\nchat 9\nmath 5", output: "temp=0.0, top_p=1.0\ntemp=0.3, top_p=0.9\ntemp=1.0, top_p=0.9\ntemp=0.2, top_p=0.9\ntemp=0.0, top_p=1.0", explanation: "`code` and `math` pin to 0. `summary` and `brainstorm` keep their base temps at low risk. `chat` at risk 9 is clamped to 0.2." },
      ],
      challenge_notes: "The risk clamp encodes a real product instinct: a confidently wrong answer on a high-stakes task is worse than a bland one, so you trade creativity for reliability when it matters. Note top_p is set from the *final* temperature, so a clamped task (temp 0.2) still gets top_p 0.9, not 1.0.",
      challenge_hints: [
        "Store the category-to-base-temperature mapping in a dict, with `.get(category, 0.7)` to handle unknown categories.",
        "Apply the risk clamp after looking up the base temperature, before deciding top_p.",
        "Format with f-strings like `f\"temp={t:.1f}, top_p={tp:.1f}\"` so both numbers always show one decimal.",
      ],
      challenge_starter_code: `import sys

def recommend(category, risk):
    # TODO: look up base temperature, apply the risk>=7 clamp,
    #       choose top_p, and return the formatted string.
    return ""

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    out = []
    for i in range(1, n + 1):
        category, risk = data[i].split()
        out.append(recommend(category, int(risk)))
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def recommend(category, risk):
    base = {
        "extraction": 0.0,
        "classification": 0.0,
        "code": 0.0,
        "math": 0.0,
        "summary": 0.3,
        "chat": 0.7,
        "brainstorm": 1.0,
        "poetry": 1.2,
    }
    t = base.get(category, 0.7)
    if risk >= 7 and t > 0.2:
        t = 0.2
    top_p = 1.0 if t == 0.0 else 0.9
    return f"temp={t:.1f}, top_p={top_p:.1f}"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    out = []
    for i in range(1, n + 1):
        category, risk = data[i].split()
        out.append(recommend(category, int(risk)))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "4\nclassification 2\npoetry 1\nchat 8\nextraction 9", expected_output: "temp=0.0, top_p=1.0\ntemp=1.2, top_p=0.9\ntemp=0.2, top_p=0.9\ntemp=0.0, top_p=1.0", description: "Convergent tasks pin to 0; high-risk chat clamps to 0.2." },
        { input: "5\ncode 0\nsummary 3\nbrainstorm 0\nchat 9\nmath 5", expected_output: "temp=0.0, top_p=1.0\ntemp=0.3, top_p=0.9\ntemp=1.0, top_p=0.9\ntemp=0.2, top_p=0.9\ntemp=0.0, top_p=1.0", description: "Mixed categories and risks across five tasks." },
        { input: "1\nweirdtask 0", expected_output: "temp=0.7, top_p=0.9", description: "Unknown category defaults to temperature 0.7." },
        { input: "1\nbrainstorm 10", expected_output: "temp=0.2, top_p=0.9", description: "Even a creative task is clamped to 0.2 at maximum risk." }
      ]
    }
  ]
};
