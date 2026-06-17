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
      challenge_title: "Count many draws",
      challenge_description: "Using random.seed(0), draw 1000 samples from tokens ['a','b','c'] with weights [0.7, 0.2, 0.1]. Count how many times each token appears and print the counts as a dict.",
      challenge_starter_code: `import random
random.seed(0)

tokens = ["a", "b", "c"]
probs  = [0.7, 0.2, 0.1]
# TODO: draw 1000 samples, count each token, and print the counts dict.
`,
      challenge_solution_code: `import random
random.seed(0)

tokens = ["a", "b", "c"]
probs  = [0.7, 0.2, 0.1]

counts = {t: 0 for t in tokens}
for _ in range(1000):
    pick = random.choices(tokens, weights=probs, k=1)[0]
    counts[pick] += 1

print(counts)
`,
      challenge_test_cases: [
        { input: "seed=0, 1000 draws, weights [0.7,0.2,0.1]", expected_output: "{'a': 706, 'b': 190, 'c': 104}", description: "Counts track the weights: 'a' dominates, 'c' is rare." }
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
      challenge_title: "Find the most-likely token's probability",
      challenge_description: "Given logits [1.5, 0.5, 0.5] and temperature 0.5, compute the softmax probabilities (rounded to 3 decimals) and print just the highest probability. Use the same numerically-safe softmax (subtract the max before exp).",
      challenge_starter_code: `import math

logits = [1.5, 0.5, 0.5]
T = 0.5
# TODO: compute temperature-scaled softmax and print the max probability (3 decimals).
`,
      challenge_solution_code: `import math

logits = [1.5, 0.5, 0.5]
T = 0.5

scaled = [x / T for x in logits]
m = max(scaled)
exps = [math.exp(x - m) for x in scaled]
total = sum(exps)
probs = [round(e / total, 3) for e in exps]

print(max(probs))
`,
      challenge_test_cases: [
        { input: "logits=[1.5,0.5,0.5], T=0.5", expected_output: "0.787", description: "Scaled logits [3,1,1]; softmax gives ~0.787 for the leader." }
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
      challenge_title: "Implement top-p",
      challenge_description: "Write top_p(tokens, probs, p) that keeps the smallest set of top tokens whose probabilities sum to at least p, then returns them renormalized (rounded to 3 decimals) as a list of (token, prob) tuples. Test with tokens ['a','b','c','d'], probs [0.5,0.3,0.15,0.05], p=0.75.",
      challenge_starter_code: `tokens = ["a", "b", "c", "d"]
probs  = [0.5, 0.3, 0.15, 0.05]
# TODO: define top_p(tokens, probs, p) and print top_p(tokens, probs, 0.75).
`,
      challenge_solution_code: `tokens = ["a", "b", "c", "d"]
probs  = [0.5, 0.3, 0.15, 0.05]

def top_p(tokens, probs, p):
    pairs = sorted(zip(tokens, probs), key=lambda x: -x[1])
    kept, total = [], 0.0
    for tok, pr in pairs:
        kept.append((tok, pr))
        total += pr
        if total >= p:
            break
    s = sum(pr for _, pr in kept)
    return [(tok, round(pr / s, 3)) for tok, pr in kept]

print(top_p(tokens, probs, 0.75))
`,
      challenge_test_cases: [
        { input: "tokens=[a,b,c,d], probs=[0.5,0.3,0.15,0.05], p=0.75", expected_output: "[('a', 0.625), ('b', 0.375)]", description: "0.5 then 0.8 >= 0.75, so keep a and b; renormalized over 0.8." }
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
      challenge_title: "Settings recommender",
      challenge_description: "Write recommend(task) that returns a string. For tasks in {'extraction','classification','code'} return 'temp=0.0, top_p=0.9'; for everything else return 'temp=0.9, top_p=0.9'. Print the recommendation for 'classification' and for 'poetry'.",
      challenge_starter_code: `# TODO: define recommend(task) and print results for 'classification' and 'poetry'.
`,
      challenge_solution_code: `def recommend(task):
    convergent = {"extraction", "classification", "code"}
    if task in convergent:
        return "temp=0.0, top_p=0.9"
    return "temp=0.9, top_p=0.9"

print(recommend("classification"))
print(recommend("poetry"))
`,
      challenge_test_cases: [
        { input: "task='classification' then 'poetry'", expected_output: "temp=0.0, top_p=0.9\ntemp=0.9, top_p=0.9", description: "Convergent task gets temp 0; creative task gets temp 0.9." }
      ]
    }
  ]
};
