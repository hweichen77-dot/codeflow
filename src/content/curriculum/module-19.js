export default {
  project: {
    id: "ai-19",
    title: "Temperature & Sampling",
    description: "Learn why the same prompt gives different answers, and how temperature, top-p, and top-k let you dial a model from precise to playful.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
    tags: ["temperature", "sampling", "top-p", "randomness", "fundamentals"],
    order: 5,
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
    },
    {
      id: "ai-19-l5",
      project_id: "ai-19",
      order: 5,
      title: "The Softmax Behind Sampling",
      concept: "Softmax",
      xp_reward: 10,
      explanation: `You've used the word "probability" a lot — \`blue\` has 0.60, \`clear\` has 0.15. But the model never produces those numbers directly. Inside, it emits raw scores that can be any size: 8.2, -3.7, 0.0, even 50. The function that turns that messy pile of scores into clean probabilities that sum to 1 is **softmax**, and it's the exact spot where temperature does its work.

## What it is

A model's final layer outputs one **logit** per token — an unnormalized score. Logits aren't probabilities: they can be negative, they don't sum to anything tidy, and a logit of 4 isn't "twice as likely" as a logit of 2. **Softmax** is the rule that converts logits into a real probability distribution. It does two jobs at once: it makes every value positive (via \`exp\`), and it makes them sum to exactly 1 (by dividing by the total).

The headline property: softmax is *relative*. Only the **gaps between logits** matter, not their absolute size. Logits \`[2, 1, 0]\` and \`[12, 11, 10]\` produce the identical distribution, because the differences are the same.

## How it works

Three steps: exponentiate each logit, sum the results, then divide. Temperature slips in before all of that by scaling every logit by \`1/T\`.

\`\`\`python
import math

def softmax_with_temp(logits, T):
    scaled = [x / T for x in logits]      # temperature scales the logits first
    m = max(scaled)                       # subtract max for numerical safety
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

logits = [2.0, 1.0, 0.5]
print("T=1.0:", softmax_with_temp(logits, 1.0))   # [0.629, 0.231, 0.14]
print("T=0.5:", softmax_with_temp(logits, 0.5))   # sharper: leader grows
print("T=2.0:", softmax_with_temp(logits, 2.0))   # flatter: gaps shrink
\`\`\`

Because softmax exponentiates, gaps get **amplified**: a logit lead of 1.0 becomes a much bigger probability lead. Dividing the logits by a small \`T\` widens those gaps before exp ever runs, so the leader pulls away. Dividing by a large \`T\` squeezes them together, so the leader's edge melts.

## Why it matters

Softmax is the hinge the whole sampling story turns on:

- **Temperature is just a softmax input.** When the last lesson said "temperature reshapes the distribution," this is the literal mechanism: scale the logits, then softmax.
- **The \`exp\` step is why high temperature gets chaotic.** Because exponentials magnify differences, flattening the logits enough lets genuinely unlikely tokens grab real probability mass.
- **The max-subtraction trick is everywhere.** Subtracting the largest scaled logit before \`exp\` never changes the answer (it cancels in the division) but keeps the exponents small so they don't overflow to \`inf\`. Every production inference stack does this.

## The mental model to keep

**Logits are raw scores; softmax is the converter that turns them into odds that sum to 1.** Temperature reaches in *before* the conversion and stretches or squeezes the gaps — and because softmax exponentiates, those gaps decide everything.`,
      key_terms: [
        { term: "Logit", definition: "A raw, unnormalized score the model assigns to a token before it becomes a probability; can be any real number." },
        { term: "Softmax", definition: "The function that exponentiates logits and divides by their sum, producing probabilities that total 1." },
        { term: "Numerical stability", definition: "Subtracting the maximum logit before exponentiating so the exponents stay small and don't overflow to infinity." },
        { term: "Temperature scaling", definition: "Dividing every logit by T before softmax; small T sharpens the distribution, large T flattens it." }
      ],
      callouts: [
        { type: "insight", title: "Only the gaps matter", content: "Softmax cares about differences between logits, not their size. [2,1,0] and [102,101,100] give the exact same probabilities — shifting every logit by a constant cancels out in the division.", position: "before" },
        { type: "tip", title: "Subtract the max, always", content: "Before calling exp, subtract the largest scaled logit from each. The result is identical math but the exponents stay small, so you never get inf. It is the standard 'stable softmax' every inference engine uses.", position: "after" }
      ],
      concept_diagram: {
        title: "Logits to probabilities through softmax",
        steps: [
          { label: "Scale by 1/T", desc: "Divide each logit by temperature; small T widens gaps, large T narrows them." },
          { label: "Exponentiate", desc: "Apply exp to each scaled logit, making everything positive and amplifying gaps." },
          { label: "Sum", desc: "Add all the exponentials to get a normalizing total." },
          { label: "Divide", desc: "Divide each exponential by the total so the probabilities sum to 1." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why do logits [2, 1, 0] and [12, 11, 10] give the same softmax probabilities?",
          options: ["Softmax ignores the first token", "Only the gaps between logits matter, and the gaps are identical", "Softmax rounds large numbers down"],
          correct_index: 1,
          explanation: "Adding a constant to every logit cancels in the division, so only the differences between logits affect the output distribution."
        }
      ],
      quiz_questions: [
        {
          question: "What is a logit?",
          options: [
            "A probability between 0 and 1",
            "A raw, unnormalized score for a token before softmax",
            "The number of tokens in the vocabulary",
            "A type of sampling method"
          ],
          correct_index: 1,
          explanation: "Logits are the model's raw scores; they can be any real number and do not yet sum to 1. Softmax converts them into probabilities."
        },
        {
          question: "Where does temperature act in the softmax pipeline?",
          options: [
            "After softmax, by rounding the probabilities",
            "Before softmax, by dividing every logit by T",
            "It replaces softmax entirely",
            "It is applied to the final sampled token"
          ],
          correct_index: 1,
          explanation: "Temperature scales the logits (logit / T) before they are exponentiated and normalized by softmax."
        },
        {
          question: "Why subtract the maximum logit before exponentiating?",
          options: [
            "It changes the distribution to favor the top token",
            "It keeps the exponents small so they do not overflow to infinity, without changing the result",
            "It removes the least likely token",
            "It is required to make the probabilities sum to 1"
          ],
          correct_index: 1,
          explanation: "Subtracting a constant cancels in the division, so the probabilities are unchanged, but the exponents stay numerically safe."
        }
      ],
      participation_activities: [
        {
          activity_title: "Softmax sense-check",
          questions: [
            { question: "Logits are already probabilities that sum to 1.", type: "true_false", correct_answer: "false", explanation: "Logits are raw scores that can be any value; softmax is what turns them into probabilities summing to 1." },
            { question: "The function that converts logits into a probability distribution is called ______.", type: "fill_in", correct_answer: "softmax", explanation: "Softmax exponentiates the logits and divides by their sum." }
          ]
        }
      ],
      starter_code: `# Convert logits into probabilities with softmax (no temperature yet).
import math

logits = [2.0, 1.0, 0.5]

def softmax(logits):
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

# TODO: print the probabilities and confirm they sum to about 1.
print("logits:", logits)
`,
      solution_code: `import math

logits = [2.0, 1.0, 0.5]

def softmax(logits):
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    total = sum(exps)
    return [round(e / total, 3) for e in exps]

probs = softmax(logits)
print("logits:", logits)
print("probs:", probs)
print("sum:", round(sum(probs), 3))
`,
      expected_output: `logits: [2.0, 1.0, 0.5]
probs: [0.629, 0.231, 0.14]
sum: 1.0`,
      step_throughs: [
        {
          title: "softmax on [2.0, 1.0, 0.5] step by step",
          steps: [
            { label: "Start with logits", detail: "Three raw scores. They are not probabilities yet — they do not sum to 1.", code: "logits = [2.0, 1.0, 0.5]" },
            { label: "Subtract the max", detail: "Subtract 2.0 from each so the largest becomes 0; this keeps exp safe and changes nothing.", code: "shifted = [0.0, -1.0, -1.5]" },
            { label: "Exponentiate", detail: "Apply exp to each. The exp step amplifies the gaps between scores.", code: "exps = [1.0, 0.368, 0.223]" },
            { label: "Normalize", detail: "Divide each by the sum (1.591) so they total 1 — now they are probabilities.", code: "probs = [0.629, 0.231, 0.140]" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Two tokens have logits 1.0 and 1.0. Without computing exp, what are their softmax probabilities?",
          steps: [
            "The two logits are equal, so the gap between them is zero.",
            "Softmax depends only on the gaps; equal logits mean equal probabilities.",
            "Two equal shares that sum to 1 are 0.5 each."
          ],
          output: "Both tokens get probability 0.5."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Logits are [3.0, 1.0]. Explain why the top token's softmax probability is much higher than 'three-quarters', even though 3 is three times 1.",
          steps: [
            "Softmax does not use the ratio of logits; it uses the gap, which is 3 - 1 = 2.",
            "It exponentiates: exp(0) = 1 for the leader (after subtracting the max) and exp(-2) ~ 0.135 for the other.",
            "Normalizing gives roughly 0.88 and 0.12 — the exp step amplifies the gap far beyond a 3:1 ratio.",
            "So a logit lead of 2 turns into a probability lead near 0.88 vs 0.12, not 0.75 vs 0.25."
          ],
          output: "About 0.88 vs 0.12 — exponentiation amplifies the logit gap well past the raw ratio."
        }
      ],
      comparison_tables: [
        {
          title: "logits vs probabilities",
          columns: ["Property", "Logits", "Probabilities (after softmax)"],
          rows: [
            { cells: ["Range", "Any real number", "Between 0 and 1"] },
            { cells: ["Sum", "Anything", "Exactly 1"] },
            { cells: ["What matters", "Gaps between them", "The values themselves"] },
            { cells: ["Where temperature acts", "Scaled by 1/T here", "Already converted"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true of logits vs true of softmax output",
          bins: [
            { id: "logits", label: "Logits" },
            { id: "probs", label: "Softmax output" }
          ],
          items: [
            { id: "i1", text: "Can be negative or large", bin: "logits" },
            { id: "i2", text: "Always sums to 1", bin: "probs" },
            { id: "i3", text: "Raw, unnormalized scores", bin: "logits" },
            { id: "i4", text: "Every value is between 0 and 1", bin: "probs" },
            { id: "i5", text: "Temperature divides these before exp", bin: "logits" },
            { id: "i6", text: "Ready to sample from directly", bin: "probs" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how does softmax connect the abstract idea of 'temperature reshaping the distribution' to actual arithmetic?",
          sampleAnswer: "Temperature reshaping is not magic — it is one division. Each logit gets divided by T before softmax runs. A small T spreads the logits further apart, and because softmax exponentiates, that wider gap turns into a much larger probability lead for the top token (sharper). A large T squeezes the logits together, so after exp the probabilities end up closer (flatter). Softmax is the converter that makes scaling the logits change the shape of the final odds."
        }
      ],
      hints: [
        "Subtract max(logits) from each logit before calling math.exp to stay numerically safe.",
        "exp turns scores into positive numbers; divide each by their sum to normalize.",
        "The probabilities should sum to 1.0 (within rounding) — print the sum to check."
      ],
      challenge_title: "The Probability Oracle",
      challenge_description: "Implement the temperature-aware softmax the sampler uses, then answer queries: at a given temperature, what is the probability of a specific named token?",
      challenge_story: "The observability team wants a debugging endpoint that answers a single precise question: given the model's raw next-token **logits**, what probability does the sampler actually assign to token X at temperature T? Engineers will hit it with the same logits at many temperatures to see how a token's odds rise and fall as the dial moves. You're building the **probability oracle** behind it. The model hands you logits; you scale by temperature, run a numerically-safe softmax, and report the exact probability of whichever token the caller asks about.",
      challenge_statement: "You are given \`n\` tokens, each with a floating-point **logit**, and \`q\` **queries**. Each query is a temperature \`T\` and a target **token name**. For each query, compute the temperature-scaled softmax over all \`n\` logits:\n\n1. Divide every logit by \`T\` to get scaled logits.\n2. Subtract the **maximum** scaled logit from each (numerical safety), then exponentiate.\n3. Divide each exponential by their sum so the probabilities total 1.\n\nThen print the probability of the query's target token, formatted to exactly **4 decimal places**. Token names in queries are guaranteed to exist in the token list. Produce one output line per query, in the order given.",
      challenge_input_format: "The first line has two integers `n q`: the number of tokens and the number of queries.\n\nEach of the next `n` lines has a token (no spaces) and its floating-point `logit`.\n\nEach of the next `q` lines has a floating-point temperature `T` and a target token name.",
      challenge_output_format: "`q` lines. Each is the probability of the queried token at that temperature, formatted to exactly 4 decimal places (e.g. `0.7870`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ q ≤ 1000",
        "-50.0 ≤ logit ≤ 50.0",
        "0.01 ≤ T ≤ 100.0",
        "Every query token appears in the token list.",
      ],
      challenge_examples: [
        { input: "3 3\nblue 2.0\nclear 1.0\ndark 0.0\n0.5 blue\n1.0 clear\n2.0 dark", output: "0.8668\n0.2447\n0.1863", explanation: "Same logits, three temperatures. `blue` is decisive at T=0.5 (0.8668). At higher T the distribution flattens, so `dark` climbs from near-nothing toward 0.1863." },
        { input: "2 2\nhot 1.0\ncold 0.0\n0.5 hot\n2.0 cold", output: "0.8808\n0.3775", explanation: "Low T sharpens `hot` to 0.8808; high T flattens the gap, lifting `cold` to 0.3775." },
      ],
      challenge_notes: "This is the literal mechanism behind 'temperature reshapes the odds': scale the logits by 1/T, then softmax. Subtracting the max before exp is the stable-softmax trick — it never changes the probability, it only stops large logits from overflowing. Notice T only ever appears as `logit / T`.",
      challenge_hints: [
        "Write one helper `softmax_temp(logits, T)` returning the full probability list, then index it by the query token's position.",
        "Build a dict mapping token name to its index once, so each query is an O(1) lookup.",
        "Use an f-string like `f\"{p:.4f}\"` so the probability always shows 4 decimals, including trailing zeros.",
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
    # TODO: for each query (T, target token), print that token's probability
    #       to 4 decimal places.

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

    index = {tok: i for i, tok in enumerate(tokens)}
    out = []
    for j in range(q):
        parts = data[n + 1 + j].split()
        T = float(parts[0])
        target = parts[1]
        probs = softmax_temp(logits, T)
        out.append(f"{probs[index[target]]:.4f}")

    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3 3\nblue 2.0\nclear 1.0\ndark 0.0\n0.5 blue\n1.0 clear\n2.0 dark", expected_output: "0.8668\n0.2447\n0.1863", description: "One token queried at three temperatures; odds shift as T flattens the distribution." },
        { input: "2 2\nhot 1.0\ncold 0.0\n0.5 hot\n2.0 cold", expected_output: "0.8808\n0.3775", description: "Two tokens; low T sharpens the leader, high T lifts the underdog." },
        { input: "1 1\nonly 5.0\n0.7 only", expected_output: "1.0000", description: "A single token always has probability 1 at any temperature." },
        { input: "2 1\nzebra 1.0\napple 1.0\n3.0 apple", expected_output: "0.5000", description: "Equal logits split evenly regardless of temperature." }
      ]
    },
    {
      id: "ai-19-l6",
      project_id: "ai-19",
      order: 6,
      title: "Greedy vs Sampled Decoding",
      concept: "Decoding",
      xp_reward: 10,
      explanation: `Once softmax hands you a probability distribution, you still have to commit to *one* token. There are two fundamentally different ways to do that, and the choice quietly decides whether your model is a calculator or a poet. **Greedy decoding** always grabs the single highest-probability token. **Sampled decoding** rolls the weighted dice. Same distribution, opposite philosophies.

## What it is

**Decoding** is the rule that turns a probability distribution into a chosen token at each step.

- **Greedy decoding:** take the **argmax** — the token with the highest probability — every single time. No randomness. Same input, same output, forever.
- **Sampled decoding:** draw a token at random *in proportion to* its probability (this is the sampling from Lesson 1, with temperature and top-p shaping the odds first). Different runs can pick different tokens.

Greedy is the special case you get when temperature hits 0: the distribution becomes so sharp that the top token has effectively all the mass, so "sample" and "take the max" become the same move.

## How it works

The two strategies diverge in one line of code — argmax versus a weighted draw:

\`\`\`python
import random

tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.25,    0.15]

# Greedy: always the single most probable token
greedy = tokens[probs.index(max(probs))]

# Sampled: a weighted random draw
random.seed(3)
sampled = random.choices(tokens, weights=probs, k=1)[0]

print("greedy: ", greedy)    # always "blue"
print("sampled:", sampled)   # usually "blue", sometimes not
\`\`\`

Greedy looks attractive — always pick the best! — but "best at each step" is not "best overall." By locking onto the local favorite every time, greedy tends to produce flat, generic text and can fall into **repetition loops** ("I think that I think that I think that..."), because the same high-probability continuation keeps winning. Sampling escapes those ruts by occasionally taking the road less traveled.

## Why it matters

The right choice is entirely about the task:

- **Greedy wins when there's one correct answer.** Extraction, classification, math, structured output — you want the same exact result every run, and creativity is a liability.
- **Sampling wins when you want variety or naturalness.** Chat, brainstorming, stories — flat greedy text feels robotic and loops; sampled text feels alive.
- **Greedy can be subtly worse even on "best" grounds.** Locking onto each local maximum can paint the model into a corner, where a slightly-less-likely early token would have led somewhere far better. This is why pure greedy is rarely used for long-form generation.

## The mental model to keep

**Greedy = always the favorite, perfectly repeatable, can loop and feel flat. Sampled = a weighted dice roll, varied and natural, not reproducible.** Reach for greedy when one right answer must come back every time; reach for sampling when you want range.`,
      key_terms: [
        { term: "Decoding", definition: "The rule that selects one token from the probability distribution at each generation step." },
        { term: "Greedy decoding", definition: "Always choosing the argmax — the single highest-probability token — making output deterministic." },
        { term: "Argmax", definition: "The position (token) holding the maximum value in a list; the choice greedy decoding always makes." },
        { term: "Repetition loop", definition: "A failure where greedy decoding keeps picking the same high-probability continuation, repeating a phrase endlessly." }
      ],
      callouts: [
        { type: "insight", title: "Greedy is just temperature 0", content: "Greedy decoding is not a separate machine — it is what sampling becomes when temperature drops to 0. The distribution gets so sharp the top token owns nearly all the mass, so drawing from it always returns the favorite.", position: "before" },
        { type: "warning", title: "Best at each step isn't best overall", content: "Greedy picks the local favorite every step, but a chain of locally-best choices can dead-end. A slightly less likely early token sometimes leads to a far better full answer — which is why pure greedy is rare for long generation.", position: "after" }
      ],
      concept_diagram: {
        title: "Two ways to choose a token",
        steps: [
          { label: "Get the distribution", desc: "Softmax produces a probability for every candidate token." },
          { label: "Greedy path", desc: "Take the argmax — the single highest-probability token." },
          { label: "Sampled path", desc: "Draw a token at random, weighted by its probability." },
          { label: "Outcome", desc: "Greedy is identical every run; sampled varies across runs." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does greedy decoding always do at each step?",
          options: ["Picks a random token with equal odds", "Takes the single highest-probability token (argmax)", "Averages the top two tokens"],
          correct_index: 1,
          explanation: "Greedy decoding always selects the argmax, the most probable token, which makes its output deterministic."
        }
      ],
      quiz_questions: [
        {
          question: "Which property is unique to greedy decoding?",
          options: [
            "It produces different output on every run",
            "It is deterministic — same input always gives same output",
            "It requires a high temperature",
            "It cannot be used for classification"
          ],
          correct_index: 1,
          explanation: "Greedy always takes the top token, so the output is perfectly repeatable for a given input."
        },
        {
          question: "Why can greedy decoding produce repetitive or looping text?",
          options: [
            "It runs out of vocabulary",
            "The same high-probability continuation keeps winning at each step",
            "It samples too randomly",
            "It ignores the prompt after the first token"
          ],
          correct_index: 1,
          explanation: "By always taking the local favorite, greedy can lock onto a phrase whose continuation is itself the favorite, repeating it in a loop."
        },
        {
          question: "For which task is greedy decoding the better fit?",
          options: [
            "Brainstorming many distinct slogans",
            "Writing a whimsical poem",
            "Extracting a single correct date that must be identical every run",
            "Generating varied chat replies"
          ],
          correct_index: 2,
          explanation: "Extraction is a one-right-answer task that needs determinism, exactly what greedy decoding provides."
        }
      ],
      participation_activities: [
        {
          activity_title: "Decoding check",
          questions: [
            { question: "Greedy decoding can give different answers on different runs of the same prompt.", type: "true_false", correct_answer: "false", explanation: "Greedy always takes the argmax, so it is deterministic and repeatable." },
            { question: "Choosing the single highest-probability token at each step is called ______ decoding.", type: "fill_in", correct_answer: "greedy", explanation: "Greedy decoding always takes the argmax." }
          ]
        }
      ],
      starter_code: `# Compare greedy and sampled decoding on the same distribution.
import random

tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.25,    0.15]
random.seed(3)

# TODO: print the greedy pick (argmax) and one sampled pick.
print("distribution:", dict(zip(tokens, probs)))
`,
      solution_code: `import random

tokens = ["blue", "clear", "dark"]
probs  = [0.60,   0.25,    0.15]
random.seed(3)

greedy = tokens[probs.index(max(probs))]
sampled = random.choices(tokens, weights=probs, k=1)[0]

print("distribution:", dict(zip(tokens, probs)))
print("greedy:", greedy)
print("sampled:", sampled)
`,
      expected_output: `distribution: {'blue': 0.6, 'clear': 0.25, 'dark': 0.15}
greedy: blue
sampled: blue`,
      step_throughs: [
        {
          title: "greedy and sampled on the same hat",
          steps: [
            { label: "Start from the distribution", detail: "Softmax gave us probabilities for three tokens. Both strategies start here.", code: "blue 0.60, clear 0.25, dark 0.15" },
            { label: "Greedy: take argmax", detail: "Scan for the maximum probability. 'blue' wins, every single run, no exceptions.", code: "greedy -> 'blue' (always)" },
            { label: "Sampled: weighted draw", detail: "Roll the weighted dice. 'blue' is the heavy favorite but 'clear' or 'dark' can come up.", code: "sampled -> usually 'blue', sometimes not" },
            { label: "Run it again", detail: "Greedy returns 'blue' identically; sampled may return a different token this time.", code: "run 2: greedy='blue', sampled=maybe 'clear'" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A distribution is [yes:0.7, no:0.3]. What does greedy decoding return, and is it ever 'no'?",
          steps: [
            "Greedy always takes the argmax — the highest-probability token.",
            "'yes' has 0.7, the maximum, so greedy returns 'yes'.",
            "Greedy never picks 'no' here, because 'no' is never the maximum."
          ],
          output: "Greedy returns 'yes' every time; it is never 'no'."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You build a chatbot with greedy decoding and users complain it keeps repeating the same canned phrase and feels robotic. Why, and what fix addresses it?",
          steps: [
            "Greedy takes the single most probable token at every step, so it always follows the same highest-probability path.",
            "If that path leads into a phrase whose continuation is itself the favorite, the model loops on it.",
            "The flatness and looping are inherent to always taking the local maximum.",
            "Switch to sampled decoding (with a moderate temperature like 0.7) so the model occasionally varies its path and breaks out of ruts."
          ],
          output: "Greedy's always-the-favorite rule causes loops and flatness; switch to sampling at a moderate temperature to add natural variety."
        }
      ],
      comparison_tables: [
        {
          title: "greedy vs sampled decoding",
          columns: ["Aspect", "Greedy decoding", "Sampled decoding"],
          rows: [
            { cells: ["Selection rule", "Argmax (top token)", "Weighted random draw"] },
            { cells: ["Reproducible?", "Yes, always identical", "No, varies per run"] },
            { cells: ["Typical failure", "Repetitive, can loop", "Occasional off-token"] },
            { cells: ["Best for", "Extraction, code, classification", "Chat, stories, brainstorming"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "describes greedy vs describes sampled",
          bins: [
            { id: "greedy", label: "Greedy decoding" },
            { id: "sampled", label: "Sampled decoding" }
          ],
          items: [
            { id: "i1", text: "Always takes the argmax", bin: "greedy" },
            { id: "i2", text: "Draws a token weighted by probability", bin: "sampled" },
            { id: "i3", text: "Perfectly reproducible output", bin: "greedy" },
            { id: "i4", text: "Can produce repetition loops", bin: "greedy" },
            { id: "i5", text: "Feels natural and varied", bin: "sampled" },
            { id: "i6", text: "Equivalent to temperature 0", bin: "greedy" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is greedy decoding not always the 'best' choice even though it always picks the most likely token?",
          sampleAnswer: "Greedy picks the best token at each individual step, but a sequence of locally-best choices is not guaranteed to be the best sequence overall. By committing to the favorite every time, it can walk into a dead end or a repetition loop that a slightly-less-likely early token would have avoided. It also makes text flat and robotic, because there is never any variation. For one-right-answer tasks that determinism is exactly right, but for natural or creative output sampling usually produces better full results."
        }
      ],
      hints: [
        "Greedy: find max(probs), then use probs.index(...) to get the token at that position.",
        "Sampled: random.choices(tokens, weights=probs, k=1) returns a list; take index [0].",
        "Keep random.seed(3) so the sampled output is reproducible for this exercise."
      ],
      challenge_title: "The Greedy Decoder",
      challenge_description: "Build a greedy decoder: at each generation step, given the token logits, always emit the argmax — and break ties the exact way the spec requires.",
      challenge_story: "Your team ships a structured-extraction feature that must return byte-for-byte identical output every run, so QA can diff it against golden files. Sampling is out — any randomness breaks the tests. You're implementing the **greedy decoder**: at each step the model produces a row of logits, and you emit the single highest-scoring token, deterministically. The only subtlety is ties: when two tokens share the top logit you must pick the lexicographically smallest, so the output is reproducible across machines and library versions.",
      challenge_statement: "You are given a sequence of \`s\` decoding **steps**. At each step there are \`m\` candidate tokens, each with a floating-point **logit**. Apply greedy decoding:\n\n1. For each step, find the token with the **highest logit**.\n2. If two or more tokens tie for the highest logit, choose the **lexicographically smallest** token name.\n3. Emit that token.\n\nAfter processing all steps, print the decoded tokens joined by single spaces on one line. Greedy decoding never looks at probabilities — comparing logits directly gives the same argmax, since softmax preserves order.",
      challenge_input_format: "The first line has one integer `s`: the number of steps.\n\nEach step is given on the next lines: a line with one integer `m` (the candidate count for that step), then `m` lines each with a token (no spaces) and its floating-point `logit`.",
      challenge_output_format: "One line: the `s` greedily-decoded tokens in step order, separated by single spaces.",
      challenge_constraints: [
        "1 ≤ s ≤ 1000",
        "1 ≤ m ≤ 1000 per step",
        "-100.0 ≤ logit ≤ 100.0",
        "Ties on the top logit are broken by lexicographically smallest token.",
      ],
      challenge_examples: [
        { input: "2\n3\nblue 2.0\nclear 1.0\ndark 0.5\n2\nsky 0.3\nsea 0.9", output: "blue sea", explanation: "Step 1: `blue` has the top logit (2.0). Step 2: `sea` (0.9) beats `sky` (0.3). Greedy emits the argmax at each step." },
        { input: "1\n3\nzebra 1.0\napple 1.0\nmango 0.5", output: "apple", explanation: "`zebra` and `apple` tie at logit 1.0; the lexicographic tie-break picks `apple`." },
      ],
      challenge_notes: "Greedy decoding compares logits, not probabilities — that is fine, because softmax is monotonic: the largest logit is always the largest probability. The lexicographic tie-break is what makes the decoder fully deterministic; without a fixed rule, two equal logits could resolve differently across runs and break reproducibility.",
      challenge_hints: [
        "For each step, track the best (logit, token) seen so far; update when you find a strictly larger logit.",
        "On an exact logit tie, update only if the new token string is lexicographically smaller than the current best.",
        "Read the input as a flat token stream and walk an index, since step sizes vary.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    s = int(data[idx]); idx += 1
    result = []
    for _ in range(s):
        m = int(data[idx]); idx += 1
        # TODO: read m (token, logit) pairs, find the greedy argmax with a
        #       lexicographic tie-break, and append it to result.
    print(" ".join(result))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    s = int(data[idx]); idx += 1
    result = []
    for _ in range(s):
        m = int(data[idx]); idx += 1
        best_tok = None
        best_lg = None
        for _ in range(m):
            tok = data[idx]; idx += 1
            lg = float(data[idx]); idx += 1
            if best_lg is None or lg > best_lg + 1e-12:
                best_lg = lg
                best_tok = tok
            elif abs(lg - best_lg) <= 1e-12 and tok < best_tok:
                best_tok = tok
        result.append(best_tok)
    print(" ".join(result))

main()
`,
      challenge_test_cases: [
        { input: "2\n3\nblue 2.0\nclear 1.0\ndark 0.5\n2\nsky 0.3\nsea 0.9", expected_output: "blue sea", description: "Two steps; greedy emits the top-logit token at each." },
        { input: "1\n3\nzebra 1.0\napple 1.0\nmango 0.5", expected_output: "apple", description: "Top-logit tie resolved by lexicographically smallest token." },
        { input: "3\n1\nonly 0.0\n1\nword 5.0\n1\nhere -3.0", expected_output: "only word here", description: "Single-candidate steps always emit that candidate." },
        { input: "1\n4\nb 2.5\na 2.5\nd 2.5\nc 1.0", expected_output: "a", description: "Three-way tie at the top; lexicographic order selects 'a'." }
      ]
    },
    {
      id: "ai-19-l7",
      project_id: "ai-19",
      order: 7,
      title: "Repetition and Frequency Penalties",
      concept: "Penalties",
      xp_reward: 10,
      explanation: `Even with sampling and a sensible top-p, long generations have a nasty habit: they repeat. The model says "very, very, very" or circles back to the same sentence, because once a token appears it often becomes *more* likely to appear again. **Repetition penalties** fight this directly by docking the logits of tokens the model has already used, before sampling. Two flavors do the work: **presence** and **frequency**.

## What it is

A penalty is a number subtracted from a token's logit based on its **history** — how it has already been used in this generation.

- **Presence penalty:** a **flat** subtraction applied once to any token that has appeared *at all*, no matter how many times. It nudges the model toward bringing in *new* topics and words.
- **Frequency penalty:** a subtraction that **scales with the count** — the more often a token has appeared, the harder it gets pushed down. It specifically punishes *overusing* the same token.

Both leave never-seen tokens untouched. They only reshape the odds for words already on the page.

## How it works

You apply the penalties to the logits *before* softmax. For each candidate token, look up its count in the history and adjust:

\`\`\`python
def penalized_logit(logit, count, presence, frequency):
    adj = logit
    if count > 0:
        adj -= presence            # flat: applied once if seen at all
    adj -= frequency * count       # scaled: grows with how often it was used
    return adj

# "the" already used 3 times; it has the top raw logit
tokens = ["the", "a", "cat"]
logits = [3.0, 2.5, 2.0]
counts = {"the": 3}

for tok, lg in zip(tokens, logits):
    c = counts.get(tok, 0)
    print(tok, round(penalized_logit(lg, c, presence=0.0, frequency=0.5), 2))
# the -> 1.5 (3.0 - 0.5*3), now BELOW "a" (2.5): the loop is broken
\`\`\`

With a frequency penalty of 0.5 and a count of 3, \`the\` loses 1.5 from its logit, dropping it below \`a\`. The model is now steered toward a fresh word — without that nudge it would have happily said \`the\` a fourth time.

## Why it matters

- **Presence vs frequency is "any vs how much."** Presence penalizes a token the same whether it appeared once or ten times — good for encouraging topic variety. Frequency ramps up with each reuse — good for stopping a single word from dominating.
- **They usually run together.** A small presence penalty plus a small frequency penalty is a common recipe to keep long outputs fresh.
- **Too high backfires.** Crank the penalties up and the model avoids common, necessary words (like \`the\` or \`is\`), producing stilted or broken text. They are a nudge, not a hammer.

## The mental model to keep

**Penalties tax words you've already used so fresh words can win.** Presence is a flat toll the moment a word shows up at all; frequency is a meter that climbs with every reuse. Both lower logits before sampling to break the model out of repetition.`,
      key_terms: [
        { term: "Presence penalty", definition: "A flat amount subtracted from a token's logit if it has appeared at all, encouraging new words and topics." },
        { term: "Frequency penalty", definition: "An amount subtracted from a token's logit that scales with how many times it has already appeared." },
        { term: "Token history", definition: "The record of which tokens have already been generated, and how often, used to compute penalties." },
        { term: "Repetition", definition: "A failure mode where the model reuses the same token or phrase because reuse becomes self-reinforcing." }
      ],
      callouts: [
        { type: "analogy", title: "A toll booth vs a taxi meter", content: "Presence penalty is a flat toll: you pay it once the moment a word appears, no matter how often. Frequency penalty is a taxi meter: it keeps climbing with every reuse, so the tenth repeat costs far more than the first.", position: "before" },
        { type: "warning", title: "A nudge, not a hammer", content: "Set penalties too high and the model starts dodging essential common words like 'the' and 'is', producing stilted, broken sentences. Keep them small; they should discourage loops, not ban vocabulary.", position: "after" }
      ],
      concept_diagram: {
        title: "How a penalty reshapes a token's logit",
        steps: [
          { label: "Look up history", desc: "Count how many times this token already appeared in the output." },
          { label: "Apply presence", desc: "If the count is above zero, subtract the flat presence penalty once." },
          { label: "Apply frequency", desc: "Subtract the frequency penalty multiplied by the count." },
          { label: "Then softmax", desc: "Convert the penalized logits to probabilities and sample as usual." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the difference between presence and frequency penalties?",
          options: ["Presence scales with count; frequency is flat", "Presence is flat if the token appeared at all; frequency scales with how many times it appeared", "They are identical"],
          correct_index: 1,
          explanation: "Presence applies a fixed subtraction once a token has appeared; frequency grows with the token's count."
        }
      ],
      quiz_questions: [
        {
          question: "When does a presence penalty apply to a token?",
          options: [
            "Only after the token appears five or more times",
            "Once, as a flat amount, if the token has appeared at all",
            "Proportional to how many times the token appeared",
            "Only to tokens that have never appeared"
          ],
          correct_index: 1,
          explanation: "Presence penalty is a flat subtraction applied a single time to any token that has appeared, regardless of count."
        },
        {
          question: "How does a frequency penalty differ from a presence penalty?",
          options: [
            "It is applied before the model sees the prompt",
            "It scales with the number of times the token has already appeared",
            "It only affects the system prompt",
            "It increases a token's logit instead of decreasing it"
          ],
          correct_index: 1,
          explanation: "Frequency penalty multiplies by the token's count, so heavily reused tokens are pushed down harder."
        },
        {
          question: "What happens if you set repetition penalties too high?",
          options: [
            "The model generates faster",
            "The model avoids common necessary words and output becomes stilted or broken",
            "The model ignores the penalties entirely",
            "The output becomes perfectly repetitive"
          ],
          correct_index: 1,
          explanation: "Excessive penalties push down essential words like 'the' and 'is', degrading fluency. Penalties are a small nudge, not a ban."
        }
      ],
      participation_activities: [
        {
          activity_title: "Penalty check",
          questions: [
            { question: "A frequency penalty pushes a token down harder the more times it has already been used.", type: "true_false", correct_answer: "true", explanation: "Frequency penalty scales with the token's count, so repeated tokens are penalized increasingly." },
            { question: "A penalty that is applied once, flatly, to any token that has appeared at all is called a ______ penalty.", type: "fill_in", correct_answer: "presence", explanation: "Presence penalty is the flat, applied-once penalty." }
          ]
        }
      ],
      starter_code: `# Apply a frequency penalty to a token that has been overused.
def penalized_logit(logit, count, presence, frequency):
    adj = logit
    if count > 0:
        adj -= presence
    adj -= frequency * count
    return adj

tokens = ["the", "a", "cat"]
logits = [3.0, 2.5, 2.0]
counts = {"the": 3}

# TODO: print each token's penalized logit with presence=0.0, frequency=0.5.
print("counts:", counts)
`,
      solution_code: `def penalized_logit(logit, count, presence, frequency):
    adj = logit
    if count > 0:
        adj -= presence
    adj -= frequency * count
    return adj

tokens = ["the", "a", "cat"]
logits = [3.0, 2.5, 2.0]
counts = {"the": 3}

print("counts:", counts)
for tok, lg in zip(tokens, logits):
    c = counts.get(tok, 0)
    print(tok, round(penalized_logit(lg, c, presence=0.0, frequency=0.5), 2))
`,
      expected_output: `counts: {'the': 3}
the 1.5
a 2.5
cat 2.0`,
      step_throughs: [
        {
          title: "a frequency penalty breaks a loop",
          steps: [
            { label: "Before penalty", detail: "'the' has the top logit (3.0) and was already used 3 times — greedy/sampling would likely pick it again.", code: "the 3.0, a 2.5, cat 2.0; count(the)=3" },
            { label: "Compute the toll", detail: "Frequency penalty 0.5 times count 3 equals a 1.5 subtraction aimed only at 'the'.", code: "penalty(the) = 0.5 * 3 = 1.5" },
            { label: "Apply it", detail: "'the' drops to 1.5, now below both 'a' (2.5) and 'cat' (2.0). Fresh words moved ahead.", code: "the 1.5, a 2.5, cat 2.0" },
            { label: "Sample fresh", detail: "After softmax, 'a' is now the favorite. The model picks a new word instead of repeating 'the'.", code: "new leader -> 'a'" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A token has logit 2.0 and has appeared 2 times. With a frequency penalty of 0.5 and no presence penalty, what is its penalized logit?",
          steps: [
            "Frequency penalty subtracts frequency times count: 0.5 * 2 = 1.0.",
            "Presence penalty is 0, so nothing extra is subtracted.",
            "Penalized logit = 2.0 - 1.0 = 1.0."
          ],
          output: "1.0"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Token X (logit 4.0) appeared once; token Y (logit 3.0) never appeared. With presence penalty 1.5 and frequency penalty 0.0, which token now has the higher logit?",
          steps: [
            "X has appeared (count 1), so the presence penalty applies once: 4.0 - 1.5 = 2.5.",
            "Frequency penalty is 0, so no count-scaled subtraction happens for X.",
            "Y never appeared (count 0), so no penalty applies: it stays at 3.0.",
            "Compare: X is now 2.5 and Y is 3.0, so Y is higher — the presence penalty flipped the order toward the fresh token."
          ],
          output: "Y is now higher (3.0 vs 2.5); the presence penalty pushed the already-seen X below the fresh Y."
        }
      ],
      comparison_tables: [
        {
          title: "presence penalty vs frequency penalty",
          columns: ["Aspect", "Presence penalty", "Frequency penalty"],
          rows: [
            { cells: ["When it applies", "If the token appeared at all", "Every time, scaled by count"] },
            { cells: ["Scales with count?", "No — flat", "Yes — count times penalty"] },
            { cells: ["Encourages", "New topics and words", "Not overusing one token"] },
            { cells: ["Best at", "Topic variety", "Stopping a word from dominating"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "describes presence vs describes frequency",
          bins: [
            { id: "presence", label: "Presence penalty" },
            { id: "frequency", label: "Frequency penalty" }
          ],
          items: [
            { id: "i1", text: "Flat amount, applied once if seen at all", bin: "presence" },
            { id: "i2", text: "Subtraction scales with the token's count", bin: "frequency" },
            { id: "i3", text: "Penalizes a token the same after 1 or 10 uses", bin: "presence" },
            { id: "i4", text: "The tenth repeat costs far more than the first", bin: "frequency" },
            { id: "i5", text: "Aimed at encouraging new topics", bin: "presence" },
            { id: "i6", text: "Aimed at stopping one word from dominating", bin: "frequency" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why do repetition penalties work on the logits rather than on the final probabilities?",
          sampleAnswer: "Penalties subtract from the logits before softmax because logits are the raw scores that softmax turns into odds. Lowering a logit reshapes the whole distribution in one consistent step: the penalized token's probability drops and every other token's rises proportionally when softmax renormalizes. Doing it at the logit stage means the penalty interacts cleanly with temperature and the rest of the sampling pipeline, all of which also operate on logits. It is the same place temperature acts, so penalties slot naturally into the same pre-softmax step."
        }
      ],
      hints: [
        "Subtract presence once when count > 0, then subtract frequency * count always.",
        "Use counts.get(tok, 0) so tokens that never appeared get a count of 0 and no penalty.",
        "With presence=0.0 only the frequency term changes the logits; 'the' should drop by 0.5*3 = 1.5."
      ],
      challenge_title: "The Penalty Engine",
      challenge_description: "Implement the repetition-penalty stage of a sampler: given a token history plus presence and frequency penalties, adjust the logits and report the new winning token.",
      challenge_story: "Your long-form writing assistant keeps looping — paragraphs that say the same phrase three times, lists that repeat a word into the ground. The fix is a **penalty engine** that sits just before sampling: it reads the tokens generated so far, docks the logit of anything overused, and lets fresh words rise. You're building it. Given the model's next-token logits and a count of how often each token has already appeared, apply a presence penalty (flat, once per seen token) and a frequency penalty (scaled by count), then report which token now wins. Tune it right and the loops disappear without the prose going haywire.",
      challenge_statement: "You are given \`n\` candidate tokens, each with a floating-point **logit** and an integer **count** of how many times it has already appeared. You are also given a **presence** penalty \`P\` and a **frequency** penalty \`F\` (both floats). For each token compute its penalized logit:\n\n1. Start from the raw logit.\n2. If the token's count is **greater than 0**, subtract \`P\` once.\n3. Subtract \`F\` multiplied by the token's count.\n\nThen find the token with the **highest penalized logit**. If two or more tie, choose the **lexicographically smallest** token name. Print that token and its penalized logit, formatted to exactly **2 decimal places**, separated by one space.",
      challenge_input_format: "The first line has an integer `n` and two floats `P F`: the token count, the presence penalty, and the frequency penalty.\n\nEach of the next `n` lines has a token (no spaces), its floating-point `logit`, and an integer `count`.",
      challenge_output_format: "One line: the winning `token` and its penalized logit to exactly 2 decimal places, separated by one space (e.g. `a 2.50`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "-100.0 ≤ logit ≤ 100.0",
        "0 ≤ count ≤ 100000",
        "0.0 ≤ P ≤ 100.0 and 0.0 ≤ F ≤ 100.0",
        "Ties on the penalized logit are broken by lexicographically smallest token.",
      ],
      challenge_examples: [
        { input: "3 0.0 0.5\nthe 3.0 3\na 2.5 0\ncat 2.0 0", output: "a 2.50", explanation: "`the` had the top raw logit but its frequency penalty is 0.5 * 3 = 1.5, dropping it to 1.5. `a` (untouched at 2.5) now wins — the loop on `the` is broken." },
        { input: "2 2.0 0.0\nthe 4.0 1\nfox 3.0 0", output: "fox 3.00", explanation: "`the` appeared once, so the flat presence penalty of 2.0 drops it to 2.0. `fox` is fresh and stays at 3.0, taking the lead." },
      ],
      challenge_notes: "Presence and frequency answer different questions: presence asks 'has this appeared at all?' and charges a flat toll; frequency asks 'how many times?' and charges per use. Applying both on the logits (before softmax) is exactly where temperature also acts, so penalties compose cleanly with the rest of the sampler. Keep them small in practice — large penalties push the model off necessary common words.",
      challenge_hints: [
        "For each token, start from its logit, subtract P only if count > 0, then subtract F * count.",
        "Track the best (penalized logit, token) so far; on an exact tie prefer the lexicographically smaller token.",
        "Format the result with an f-string like `f\"{tok} {val:.2f}\"` so the logit always shows 2 decimals.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    P = float(first[1])
    F = float(first[2])
    # TODO: read each (token, logit, count), compute the penalized logit,
    #       and report the winner (lexicographic tie-break) to 2 decimals.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    first = data[0].split()
    n = int(first[0])
    P = float(first[1])
    F = float(first[2])

    best_tok = None
    best_val = None
    for i in range(1, n + 1):
        parts = data[i].split()
        tok = parts[0]
        logit = float(parts[1])
        count = int(parts[2])
        val = logit
        if count > 0:
            val -= P
        val -= F * count
        if best_val is None or val > best_val + 1e-12:
            best_val = val
            best_tok = tok
        elif abs(val - best_val) <= 1e-12 and tok < best_tok:
            best_tok = tok
            best_val = val

    print(f"{best_tok} {best_val:.2f}")

main()
`,
      challenge_test_cases: [
        { input: "3 0.0 0.5\nthe 3.0 3\na 2.5 0\ncat 2.0 0", expected_output: "a 2.50", description: "Frequency penalty drops the overused 'the' below the fresh 'a'." },
        { input: "2 2.0 0.0\nthe 4.0 1\nfox 3.0 0", expected_output: "fox 3.00", description: "Flat presence penalty knocks the already-seen 'the' below 'fox'." },
        { input: "2 0.0 0.0\nzebra 1.0 0\napple 1.0 0", expected_output: "apple 1.00", description: "No penalties; tie on logit resolved lexicographically to 'apple'." },
        { input: "3 1.0 1.0\nloop 5.0 4\nnew 1.0 0\nmid 2.0 1", expected_output: "new 1.00", description: "Heavily reused 'loop' (5.0 - 1.0 - 4.0 = 0.0) and 'mid' (2.0 - 1.0 - 1.0 = 0.0) both collapse; fresh 'new' at 1.0 wins." }
      ]
    },
    {
      id: "ai-19-l8",
      project_id: "ai-19",
      order: 8,
      title: "Seeds and Reproducibility",
      concept: "Seeds",
      xp_reward: 10,
      explanation: `Sampling is random — that's the whole point. But "random" and "untestable" are not the same thing. If you've ever needed a sampled model to give the *exact same* output twice (to write a unit test, reproduce a bug, or compare two prompts fairly), the tool you reach for is the **seed**. A seed makes randomness *replayable*: same seed, same dice rolls, same output, every time.

## What it is

Computers don't produce true randomness; they run a **pseudo-random number generator (PRNG)** — a deterministic formula that spits out a stream of numbers that *look* random. The **seed** is the starting point of that stream. Give the PRNG the same seed and it produces the identical sequence of "random" numbers, which means the sampler makes the identical draws, which means you get the identical generated text.

So a seed doesn't turn off randomness. It *pins* it. Temperature and top-p still shape the distribution exactly as before; the seed just guarantees the weighted draws come out the same way on a re-run.

## How it works

Seed the generator before you sample, and the sequence of draws is locked:

\`\`\`python
import random

tokens = ["a", "b", "c"]
probs  = [0.34, 0.33, 0.33]

def run(seed):
    random.seed(seed)                       # pin the stream
    return [random.choices(tokens, weights=probs)[0] for _ in range(5)]

print(run(7))    # e.g. ['a', 'c', 'b', 'a', 'a']
print(run(7))    # identical — same seed, same draws
print(run(8))    # different seed -> different sequence
\`\`\`

\`run(7)\` twice gives byte-for-byte the same list. Change to \`run(8)\` and the sequence shifts. Many model APIs expose exactly this: pass a \`seed\` parameter and (with temperature held fixed) you get reproducible sampled output.

## Why it matters

Reproducibility is what makes a random system *engineerable*:

- **Testing.** You can't assert on output that changes every run. Fix the seed and a sampled generation becomes a stable value a test can check.
- **Debugging.** A user reports a bad output. With the seed (and the same prompt and settings), you can reproduce the exact failure instead of chasing a ghost.
- **Fair comparison.** Comparing two prompts or two models? Use the same seed so any difference comes from what you changed, not from luck.
- **A caveat:** reproducibility usually requires the *same everything* — same model version, settings, and often the same hardware. Seeds pin the randomness, but other moving parts can still shift results.

## The mental model to keep

**A seed is the starting line of the random number stream.** Same seed, same sequence of draws, same output — randomness you can replay on demand. It doesn't remove the randomness; it makes it reproducible for tests, debugging, and fair comparisons.`,
      key_terms: [
        { term: "Seed", definition: "The starting value of a pseudo-random generator; the same seed reproduces the same sequence of random draws." },
        { term: "Pseudo-random number generator (PRNG)", definition: "A deterministic formula that produces numbers that look random; its output is fully determined by its seed." },
        { term: "Reproducibility", definition: "Getting the exact same output from the same inputs and seed, which makes a random system testable and debuggable." },
        { term: "Deterministic", definition: "Producing the same result every time for the same inputs; a seeded PRNG is deterministic." }
      ],
      callouts: [
        { type: "analogy", title: "The starting line of the stream", content: "A PRNG is a long fixed track of numbers. The seed is where you drop the runner onto the track. Same starting line means the same numbers come out in the same order, so the sampler makes the same draws every time.", position: "before" },
        { type: "insight", title: "A seed pins randomness, it doesn't remove it", content: "Temperature and top-p still shape the odds exactly as before. The seed only fixes which weighted draws happen, so a creative, high-temperature output becomes reproducible without becoming any less varied within that run.", position: "after" }
      ],
      concept_diagram: {
        title: "How a seed makes sampling reproducible",
        steps: [
          { label: "Choose a seed", desc: "Pick a fixed starting value for the pseudo-random generator." },
          { label: "Generator produces a stream", desc: "The seed determines the entire sequence of pseudo-random numbers." },
          { label: "Sampler draws from it", desc: "Each weighted token draw consumes numbers from that fixed stream." },
          { label: "Re-run with same seed", desc: "Identical stream, identical draws, identical output." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does fixing the seed guarantee for a sampled model (settings held constant)?",
          options: ["It disables sampling entirely", "It produces the same output every run", "It makes the model more accurate"],
          correct_index: 1,
          explanation: "The same seed reproduces the same sequence of random draws, so the sampled output is identical across runs."
        }
      ],
      quiz_questions: [
        {
          question: "Why is computer randomness called 'pseudo-random'?",
          options: [
            "It is generated by a deterministic formula from a seed",
            "It is slower than true randomness",
            "It only works for small numbers",
            "It cannot be used for sampling"
          ],
          correct_index: 0,
          explanation: "A PRNG is a deterministic formula; its entire output sequence is fixed by the seed, so it only looks random."
        },
        {
          question: "What is the main reason to fix a seed when sampling?",
          options: [
            "To make the model run faster",
            "To make the sampled output reproducible for tests and debugging",
            "To increase the temperature automatically",
            "To remove the need for a prompt"
          ],
          correct_index: 1,
          explanation: "A fixed seed makes random output repeatable, which is essential for writing tests and reproducing bugs."
        },
        {
          question: "Does fixing the seed make the output less creative?",
          options: [
            "Yes, it forces greedy decoding",
            "No, it pins which draws happen but temperature and top-p still shape the odds",
            "Yes, it sets temperature to 0",
            "No, because it removes sampling entirely"
          ],
          correct_index: 1,
          explanation: "The seed only fixes the random sequence; the distribution shaping from temperature and top-p is unchanged, so the run is just as varied internally."
        }
      ],
      participation_activities: [
        {
          activity_title: "Seed check",
          questions: [
            { question: "Running a sampled model twice with the same seed and settings gives the same output.", type: "true_false", correct_answer: "true", explanation: "The same seed reproduces the same random draws, so the output is identical." },
            { question: "The deterministic formula that produces seemingly random numbers from a seed is called a ______ (abbreviation).", type: "fill_in", correct_answer: "PRNG", explanation: "A pseudo-random number generator (PRNG) is fully determined by its seed." }
          ]
        }
      ],
      starter_code: `# Show that the same seed reproduces the same sampled sequence.
import random

tokens = ["a", "b", "c"]
probs  = [0.34, 0.33, 0.33]

def run(seed):
    random.seed(seed)
    return [random.choices(tokens, weights=probs)[0] for _ in range(5)]

# TODO: print run(7) twice and run(8) once to compare.
print("seed 7:", run(7))
`,
      solution_code: `import random

tokens = ["a", "b", "c"]
probs  = [0.34, 0.33, 0.33]

def run(seed):
    random.seed(seed)
    return [random.choices(tokens, weights=probs)[0] for _ in range(5)]

r1 = run(7)
r2 = run(7)
r3 = run(8)
print("seed 7:", r1)
print("seed 7 again:", r2)
print("same?", r1 == r2)
print("seed 8 differs?", r1 != r3)
`,
      expected_output: `seed 7: ['a', 'a', 'b', 'a', 'b']
seed 7 again: ['a', 'a', 'b', 'a', 'b']
same? True
seed 8 differs? True`,
      step_throughs: [
        {
          title: "replaying a sampled run with a fixed seed",
          steps: [
            { label: "Seed the generator", detail: "random.seed(7) drops the PRNG onto a fixed point in its number stream.", code: "random.seed(7)" },
            { label: "Draw a sequence", detail: "Five weighted draws consume numbers from that stream, producing a specific token list.", code: "run(7) -> ['a','a','b','a','b']" },
            { label: "Re-seed identically", detail: "Calling random.seed(7) again rewinds to the same starting point in the stream.", code: "random.seed(7)  # rewind" },
            { label: "Get the same draws", detail: "The same stream yields the same five draws — reproducible output for tests.", code: "run(7) -> ['a','a','b','a','b']  (identical)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You call a sampled model with seed 42 and get a slogan. You call it again with seed 42, same prompt and settings. What do you get?",
          steps: [
            "The same seed reproduces the same sequence of random draws.",
            "The prompt and settings are unchanged, so the distribution is identical.",
            "Therefore the model makes the same draws and returns the same slogan."
          ],
          output: "The exact same slogan, because the seed pins the random draws."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A teammate says 'I set the seed but I still get different output sometimes.' Give two reasons this can happen even with a fixed seed.",
          steps: [
            "A seed only pins the randomness if everything else is held constant.",
            "Reason one: the model version or settings (temperature, top-p, penalties) changed between runs, so the distribution itself differs.",
            "Reason two: reproducibility can depend on hardware and library versions; different GPUs or math libraries can produce slightly different results.",
            "So a seed is necessary but not always sufficient — the full environment has to match."
          ],
          output: "Changed model/settings, or different hardware/library versions; a seed pins randomness but not the rest of the environment."
        }
      ],
      comparison_tables: [
        {
          title: "fixed seed vs no fixed seed",
          columns: ["Aspect", "Fixed seed", "No fixed seed"],
          rows: [
            { cells: ["Output across runs", "Identical", "Varies each run"] },
            { cells: ["Testable?", "Yes, assert on exact output", "No, output changes"] },
            { cells: ["Bug reproduction", "Replay the exact failure", "Hard to reproduce"] },
            { cells: ["Best for", "Tests, debugging, fair comparison", "Live, varied production output"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "fixed seed vs no fixed seed",
          bins: [
            { id: "fixed", label: "Fixed seed" },
            { id: "nofixed", label: "No fixed seed" }
          ],
          items: [
            { id: "i1", text: "Same output every run", bin: "fixed" },
            { id: "i2", text: "Output varies each run", bin: "nofixed" },
            { id: "i3", text: "Lets a unit test assert on the result", bin: "fixed" },
            { id: "i4", text: "Good for fresh, varied production replies", bin: "nofixed" },
            { id: "i5", text: "Reproduces a reported bug exactly", bin: "fixed" },
            { id: "i6", text: "Two fair prompt comparisons differ only by the change", bin: "fixed" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how can a sampled model be both random and reproducible at the same time?",
          sampleAnswer: "The randomness in sampling comes from a pseudo-random generator, which is actually a deterministic formula. The seed is its starting point. Within a run the draws look random and the output is varied, shaped by temperature and top-p. But because the generator is deterministic, giving it the same seed replays the exact same sequence of draws, so the same output comes back. So it is random in the sense that you can't predict the draws by hand, yet reproducible because the same seed always produces the same stream."
        }
      ],
      hints: [
        "Call random.seed(seed) at the start of run so each call starts from the same point.",
        "run(7) called twice should return equal lists; compare them with ==.",
        "run(8) uses a different starting point, so its sequence should differ from run(7)."
      ],
      challenge_title: "The Reproducibility Checker",
      challenge_description: "Build the deterministic sampler a test harness relies on, then prove reproducibility: run it under two seeds and report each drawn sequence plus whether they match.",
      challenge_story: "Your QA team needs to certify that the generation endpoint is reproducible: same seed in, same tokens out. You're building the **reproducibility checker** they'll run in CI. It uses a deterministic linear congruential generator (LCG) so the test is identical on every machine. Given a token distribution and two seeds, it draws a sequence under each seed and reports whether the two runs produced the same tokens. When a developer passes the same seed twice it must print MATCH; when they pass different seeds it should (almost always) print DIFFER — and the checker shows the actual sequences so failures are easy to read.",
      challenge_statement: "You are given \`n\` tokens, each with an integer **weight**, a number of **draws**, and two seeds \`seedA\` and \`seedB\`. For each seed, generate a sequence of \`draws\` tokens using this exact deterministic procedure (start \`state = seed\`):\n\n1. Let \`total\` be the sum of all weights.\n2. For each draw, first advance the generator:\n\n   \`\`\`\n   state = (1664525 * state + 1013904223) mod 4294967296\n   \`\`\`\n\n   then compute \`r = state mod total\`.\n3. Walk the tokens **in input order**, accumulating a prefix sum of weights; the drawn token is the **first** whose prefix sum is strictly greater than \`r\`.\n\nPrint the sequence for \`seedA\` (tokens space-separated) on line 1, the sequence for \`seedB\` on line 2, and on line 3 print \`MATCH\` if the two sequences are identical, otherwise \`DIFFER\`.",
      challenge_input_format: "The first line has four integers: `n draws seedA seedB`.\n\nEach of the next `n` lines has a token (no spaces) and its integer `weight`.",
      challenge_output_format: "Three lines: the seedA token sequence (space-separated), the seedB token sequence (space-separated), then `MATCH` or `DIFFER`. If `draws` is 0 the first two lines are empty.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ draws ≤ 100000",
        "0 ≤ seedA, seedB < 4294967296",
        "1 ≤ weight ≤ 1000000",
      ],
      challenge_examples: [
        { input: "3 4 7 7\nrock 1\npaper 1\nscissors 1", output: "rock rock paper paper\nrock rock paper paper\nMATCH", explanation: "Both seeds are 7, so the LCG produces the identical stream and the identical four draws — reproducibility confirmed with MATCH." },
        { input: "3 4 7 99\nrock 1\npaper 1\nscissors 1", output: "rock rock paper paper\npaper scissors scissors paper\nDIFFER", explanation: "Different seeds start the generator at different points, so the two sequences diverge and the checker reports DIFFER." },
      ],
      challenge_notes: "This is the engine behind 'same seed, same output'. The LCG is deterministic, so seeding it identically replays the exact draw sequence — that's what makes a sampled endpoint testable. Note the half-open mapping: `r` ranges over `0 .. total-1` and the comparison is strictly greater-than, so each `r` maps to exactly one token, matching the harness in Lesson 1.",
      challenge_hints: [
        "Write one helper that takes a seed and returns the list of drawn tokens, then call it for seedA and seedB.",
        "Build the prefix-sum (cumulative weight) array once and reuse it for both seeds.",
        "Compare the two token lists with == to decide between MATCH and DIFFER; with draws=0 both are empty and MATCH.",
      ],
      challenge_starter_code: `import sys

def sample_sequence(tokens, cum, total, draws, seed):
    # TODO: run the LCG for draws steps from seed, returning the drawn tokens.
    return []

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    draws = int(data[idx]); idx += 1
    seedA = int(data[idx]); idx += 1
    seedB = int(data[idx]); idx += 1
    tokens, weights = [], []
    for _ in range(n):
        tokens.append(data[idx]); idx += 1
        weights.append(int(data[idx])); idx += 1
    # TODO: build prefix sums, sample under both seeds, print sequences + MATCH/DIFFER.

main()
`,
      challenge_solution_code: `import sys

def sample_sequence(tokens, cum, total, draws, seed):
    out = []
    state = seed
    n = len(tokens)
    for _ in range(draws):
        state = (1664525 * state + 1013904223) % 4294967296
        r = state % total
        for i in range(n):
            if r < cum[i]:
                out.append(tokens[i])
                break
    return out

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    draws = int(data[idx]); idx += 1
    seedA = int(data[idx]); idx += 1
    seedB = int(data[idx]); idx += 1
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

    seqA = sample_sequence(tokens, cum, total, draws, seedA)
    seqB = sample_sequence(tokens, cum, total, draws, seedB)

    print(" ".join(seqA))
    print(" ".join(seqB))
    print("MATCH" if seqA == seqB else "DIFFER")

main()
`,
      challenge_test_cases: [
        { input: "3 4 7 7\nrock 1\npaper 1\nscissors 1", expected_output: "rock rock paper paper\nrock rock paper paper\nMATCH", description: "Identical seeds reproduce the identical sequence." },
        { input: "3 4 7 99\nrock 1\npaper 1\nscissors 1", expected_output: "rock rock paper paper\npaper scissors scissors paper\nDIFFER", description: "Different seeds diverge into different sequences." },
        { input: "2 6 42 42\nyes 3\nno 1", expected_output: "yes yes no yes yes yes\nyes yes no yes yes yes\nMATCH", description: "Weighted distribution; same seed still reproduces exactly." },
        { input: "1 3 0 1\nx 5", expected_output: "x x x\nx x x\nMATCH", description: "A single token absorbs every draw, so any two seeds MATCH." }
      ]
    }
  ]
};
