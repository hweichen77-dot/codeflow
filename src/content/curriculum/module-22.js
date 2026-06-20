export default {
  project: {
    id: "ai-22",
    title: "Choosing the Right Model",
    description: "Learn to pick the right model tier for each task by trading off cost, latency, and quality instead of always reaching for the biggest one.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
    tags: ["model-selection", "latency", "cost", "quality", "fundamentals"],
    order: 8,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-22-l1",
      project_id: "ai-22",
      order: 1,
      title: "Models Aren't One Thing",
      concept: "Model families",
      xp_reward: 10,
      explanation: `You don't drive a moving truck to pick up a coffee. But when people first reach for an AI model, they grab the biggest, newest, most expensive one for every job — including jobs a tiny model would nail in a fraction of the time and cost.

## What it is

There is no single "the AI." Every provider ships a **family** of models, and within that family several **tiers** — usually something like small, medium, and large. They share a lineage but differ wildly in size, speed, price, and how hard a problem they can chew through.

A useful mental split:

- **Small / fast models** — cheap, quick, great at simple, well-defined work.
- **Large / smart models** — pricier, slower, but far stronger on hard reasoning and long, messy tasks.

The key idea: a tier is just a labeled point on a spectrum. You aren't choosing "good vs bad." You're choosing *which trade-offs you want* for *this* task.

## How it works

Picture the tiers as a lineup you can pick from at request time:

\`\`\`python
tiers = {
    "small":  {"smarts": 3, "speed": 9, "price": 1},
    "medium": {"smarts": 6, "speed": 6, "price": 4},
    "large":  {"smarts": 9, "speed": 3, "price": 12},
}
# Same code, same call — you just hand it a different tier name.
choice = "small"
print("using:", choice, tiers[choice])
\`\`\`

Each tier is the *same kind of thing* — text in, text out — so your code barely changes between them. You swap a label, and the cost/speed/smarts profile changes underneath.

## Why it matters

Treating "the AI" as one fixed object leads to expensive, slow apps:

- **Newer isn't automatically right.** A brand-new flagship may be overkill for tagging support tickets. Bigger and newer mostly means *more capable on hard problems*, not *better at everything*.
- **One size fits nothing.** A chat app that labels spam, drafts emails, and reasons over contracts probably wants different tiers for each — not one giant model doing it all.
- **The cheap tier is often plenty.** A huge fraction of real tasks are simple. Reaching for the flagship every time is like trucking your coffee.

## The mental model to keep

Stop thinking "the AI." Think **a menu of tiers**, small to large, each a different bundle of speed, cost, and capability — and your job is to order the right one for the task in front of you.`,
      key_terms: [
        { term: "Model family", definition: "A set of related models from one provider that share a lineage but come in different sizes." },
        { term: "Tier", definition: "A size/capability level within a family — commonly small, medium, and large." },
        { term: "Capability", definition: "How hard a problem a model can reliably handle; larger tiers are generally more capable." }
      ],
      callouts: [
        { type: "analogy", title: "A menu, not a single dish", content: "A provider isn't 'the AI' — it's a menu. Small, medium, large tiers are different dishes for different appetites. You order what the task needs, not the most expensive item every time.", position: "before" },
        { type: "insight", title: "Swapping tiers is swapping a label", content: "Because every tier is text-in, text-out, changing tiers usually means changing one string in your code. That makes experimenting cheap — try a smaller one and see if quality holds.", position: "after" }
      ],
      concept_diagram: {
        title: "From 'the AI' to a menu of tiers",
        steps: [
          { label: "One provider", desc: "A company that trains and serves models." },
          { label: "A family", desc: "Related models sharing a lineage and interface." },
          { label: "Several tiers", desc: "Small, medium, large — different size and price." },
          { label: "You pick one", desc: "Choose the tier whose trade-offs fit the task." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a 'tier' within a model family describe?",
          options: ["A different company's product", "A size/capability level like small, medium, or large", "The programming language the model is written in"],
          correct_index: 1,
          explanation: "Tiers are size/capability levels within one family — usually small, medium, and large."
        }
      ],
      quiz_questions: [
        {
          question: "Why is reaching for the biggest, newest model for every task a mistake?",
          options: [
            "Big models can only answer one question per day",
            "Bigger mostly means stronger on hard problems, not better at everything — and it costs more and runs slower",
            "Newer models forget how to do simple tasks",
            "Small models are always more accurate"
          ],
          correct_index: 1,
          explanation: "Larger tiers excel at hard reasoning but cost more and are slower. For simple tasks a small tier is often just as good and far cheaper."
        },
        {
          question: "Which is the best description of 'small / fast' models?",
          options: [
            "Broken models that should never be used",
            "Cheap, quick models that are great at simple, well-defined work",
            "Models that only run on phones",
            "Older models that no longer get updates"
          ],
          correct_index: 1,
          explanation: "Small tiers trade peak reasoning power for low cost and high speed, which fits simple tasks perfectly."
        },
        {
          question: "How much does your code usually change when you switch from one tier to another in the same family?",
          options: [
            "You must rewrite the whole program",
            "Very little — often just the model/tier name you pass in",
            "You need a different programming language",
            "You can never switch once you start"
          ],
          correct_index: 1,
          explanation: "Tiers share the same text-in, text-out interface, so swapping usually means changing one identifier."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tier sense-check",
          questions: [
            { question: "Every provider offers just one model that handles all tasks equally well.", type: "true_false", correct_answer: "false", explanation: "Providers ship families with multiple tiers (small, medium, large) tuned for different needs." },
            { question: "A size/capability level within a model family is called a ______.", type: "fill_in", correct_answer: "tier", explanation: "Small, medium, and large are tiers within a family." }
          ]
        }
      ],
      starter_code: `# A "menu" of model tiers. Each is a dict of properties.
tiers = {
    "small":  {"smarts": 3, "speed": 9, "price": 1},
    "medium": {"smarts": 6, "speed": 6, "price": 4},
    "large":  {"smarts": 9, "speed": 3, "price": 12},
}

# TODO: loop over the tiers and print each name with its properties.
print("Available tiers:")
`,
      solution_code: `tiers = {
    "small":  {"smarts": 3, "speed": 9, "price": 1},
    "medium": {"smarts": 6, "speed": 6, "price": 4},
    "large":  {"smarts": 9, "speed": 3, "price": 12},
}

print("Available tiers:")
for name, props in tiers.items():
    print(f"{name}: smarts={props['smarts']} speed={props['speed']} price={props['price']}")
`,
      expected_output: `Available tiers:
small: smarts=3 speed=9 price=1
medium: smarts=6 speed=6 price=4
large: smarts=9 speed=3 price=12`,
      step_throughs: [
        {
          title: "narrowing from 'the AI' to one tier",
          steps: [
            { label: "Start with a provider", detail: "A company trains and hosts models. This is not a single product — it's a lineup.", code: 'provider = "ExampleAI"' },
            { label: "Open the family", detail: "Inside the family are several related models sharing one interface.", code: 'family = ["small", "medium", "large"]' },
            { label: "Compare the tiers", detail: "Each tier bundles a different mix of smarts, speed, and price.", code: 'tiers["small"]  # {"smarts": 3, "speed": 9, "price": 1}' },
            { label: "Pick for the task", detail: "Choose the tier whose trade-offs match what the task needs.", code: 'choice = "small"  # simple task -> cheap, fast tier' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You need to label incoming emails as 'spam' or 'not spam' — a simple, well-defined task. Which tier is the natural first pick?",
          steps: [
            "Spam labeling is simple classification with a clear right answer.",
            "Simple, well-defined work is exactly what small / fast tiers are good at.",
            "Choosing the small tier saves cost and latency with little quality loss."
          ],
          output: "The small tier — cheap and fast is plenty for simple classification."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "An app does three jobs: (a) tag support tickets, (b) draft reply emails, (c) reason over a 30-page legal contract. Should one model do all three?",
          steps: [
            "Tagging tickets is simple classification — a small tier fits.",
            "Drafting emails is moderate generation — a medium tier balances quality and cost.",
            "Reasoning over a long contract is hard, long-context work — that wants a large tier.",
            "Forcing one tier on all three either overpays on the easy jobs or underperforms on the hard one."
          ],
          output: "No — route each job to the tier that matches its difficulty (small, medium, large)."
        }
      ],
      comparison_tables: [
        {
          title: "small vs large tiers at a glance",
          columns: ["Aspect", "Small / fast tier", "Large / smart tier"],
          rows: [
            { cells: ["Cost per call", "Very low", "Much higher"] },
            { cells: ["Speed", "Fast", "Slower"] },
            { cells: ["Hard reasoning", "Limited", "Strong"] },
            { cells: ["Best fit", "Simple, high-volume tasks", "Complex, high-stakes tasks"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which tier fits the task",
          bins: [
            { id: "small", label: "Small / fast tier" },
            { id: "large", label: "Large / smart tier" }
          ],
          items: [
            { id: "i1", text: "Tagging a tweet as positive or negative", bin: "small" },
            { id: "i2", text: "Writing a multi-step proof from scratch", bin: "large" },
            { id: "i3", text: "Extracting the date from a short receipt", bin: "small" },
            { id: "i4", text: "Synthesizing a 40-page report into a strategy", bin: "large" },
            { id: "i5", text: "Routing a one-line FAQ to the right department", bin: "small" },
            { id: "i6", text: "Debugging a tricky logic error across files", bin: "large" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is 'just use the biggest model' a bad default for building a real app?",
          sampleAnswer: "Most tasks in a real app are simple, and the biggest model is slow and expensive. Always using it means paying flagship prices and waiting longer for jobs a small tier would handle just as well. Bigger only helps on the genuinely hard tasks, so a good default is to match each task to the cheapest tier that still does it well."
        }
      ],
      hints: [
        "tiers.items() gives you each name and its property dict together.",
        "Inside the loop, props is a dict — read props['smarts'], props['speed'], props['price'].",
        "An f-string makes it easy to print the name and all three numbers on one line."
      ],
      challenge_title: "Tier Selector",
      challenge_description: "Pick the cheapest model tier that is still good enough and fast enough for a production endpoint — the exact decision a routing layer makes on every request.",
      challenge_story: "You run the inference platform behind a customer-support assistant. A provider exposes several **model tiers**, each with a known **quality** score, typical **latency** in milliseconds, and a **cost** in cents per call. Product set two hard rules for this endpoint: the reply must clear a **minimum quality** bar (anything dumber frustrates users) and must come back **within a latency budget** (anything slower breaks the live chat). Among every tier that satisfies *both* rules, finance wants the **cheapest** one — there's no reason to pay for a smarter model than the job needs. Build the selector.",
      challenge_statement: "You are given a quality floor, a latency budget, and a list of tiers. Choose the tier to deploy:\n\n1. A tier is **eligible** if its `quality` is **at least** `min_quality` **and** its `latency` is **at most** `max_latency`.\n2. Among eligible tiers, pick the one with the **lowest cost**. If two eligible tiers tie on cost, pick the one whose name is **lexicographically smallest**.\n3. If no tier is eligible, the endpoint can't be served.\n\nPrint the chosen tier's name and its cost, or `NO TIER` if none qualify.",
      challenge_input_format: "The first line has three integers `n min_quality max_latency`: the number of tiers, the quality floor, and the latency budget.\n\nEach of the next `n` lines describes one tier: a name (no spaces) followed by three integers `quality latency cost`.",
      challenge_output_format: "If at least one tier is eligible, print one line: the chosen tier's name, a space, then its cost (e.g. `medium 4`). Otherwise print `NO TIER`.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ min_quality ≤ 100",
        "1 ≤ max_latency ≤ 100000",
        "1 ≤ quality ≤ 100, 1 ≤ latency ≤ 100000, 1 ≤ cost ≤ 1000000",
      ],
      challenge_examples: [
        { input: "3 6 500\nsmall 3 120 1\nmedium 6 300 4\nlarge 9 900 12", output: "medium 4", explanation: "`small` fails the quality floor (3 < 6); `large` fails the latency budget (900 > 500). Only `medium` is eligible, so it wins at cost 4." },
        { input: "3 6 200\nsmall 3 120 1\nmedium 6 300 4\nlarge 9 900 12", output: "NO TIER", explanation: "`small` is too dumb, and both `medium` (300) and `large` (900) blow the 200 ms budget. Nothing qualifies." },
      ],
      challenge_notes: "This is the core of a real model router: never pay for more capability than the task and the latency SLA require. The quality bound is inclusive (`>=`) and the latency bound is inclusive (`<=`), so a tier sitting exactly on a limit still qualifies. The lexicographic tie-break keeps the answer deterministic when two tiers cost the same.",
      challenge_hints: [
        "Track the best (lowest-cost) eligible tier as you scan, instead of collecting them all first.",
        "A tier qualifies only when BOTH `quality >= min_quality` AND `latency <= max_latency` hold.",
        "On a cost tie, compare names with `<` to keep the lexicographically smaller one; if you never find an eligible tier, print `NO TIER`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, min_quality, max_latency = map(int, data[0].split())
    # TODO: read the next n tiers, keep only those meeting the quality floor
    #       and latency budget, and print the cheapest (name + cost) or "NO TIER".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, min_quality, max_latency = map(int, data[idx].split())
    idx += 1
    best_name = None
    best_cost = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        quality = int(parts[1])
        latency = int(parts[2])
        cost = int(parts[3])
        if quality >= min_quality and latency <= max_latency:
            if best_cost is None or cost < best_cost or (cost == best_cost and name < best_name):
                best_cost = cost
                best_name = name
    if best_name is None:
        print("NO TIER")
    else:
        print(f"{best_name} {best_cost}")

main()
`,
      challenge_test_cases: [
        { input: "3 6 500\nsmall 3 120 1\nmedium 6 300 4\nlarge 9 900 12", expected_output: "medium 4", description: "Quality floor and latency budget each knock out one tier; the survivor wins." },
        { input: "3 6 200\nsmall 3 120 1\nmedium 6 300 4\nlarge 9 900 12", expected_output: "NO TIER", description: "Tightening the latency budget leaves no eligible tier." },
        { input: "4 5 1000\na 7 100 5\nb 8 100 5\nc 9 100 9\nd 5 100 5\nx", expected_output: "a 5", description: "Three tiers tie at cost 5; the lexicographically smallest name wins." },
        { input: "1 1 100\nonly 5 50 7", expected_output: "only 7", description: "A single eligible tier is selected outright." }
      ]
    },
    {
      id: "ai-22-l2",
      project_id: "ai-22",
      order: 2,
      title: "The Three Tradeoffs",
      concept: "Cost, latency, quality",
      xp_reward: 10,
      explanation: `Fast, cheap, good — pick two. Engineers have joked about this triangle for decades, and it describes model selection almost perfectly. With AI models you're balancing three things at once: **cost**, **latency**, and **quality**. Push on any one and at least one other pushes back.

## What it is

The three levers:

- **Cost** — how much money each call burns (driven mostly by tokens and tier).
- **Latency** — how long the user waits for the answer.
- **Quality** — how good and correct the output is.

You rarely get to max all three. A big model gives top quality but costs more and runs slower. A tiny model is cheap and fast but weaker on hard problems. **You usually optimize two at the expense of the third.**

## How it works

Think of it as a budget you spend across three dials. You can model it directly:

\`\`\`python
# Two candidate tiers, scored on the three levers (higher quality = better).
small = {"cost": 1, "latency_ms": 200, "quality": 6}
large = {"cost": 12, "latency_ms": 1500, "quality": 9}

# Want top quality? large wins on quality but loses on cost and latency.
# Want cheap + snappy? small wins on cost and latency but gives up quality.
print("quality gap:", large["quality"] - small["quality"])
print("cost gap:", large["cost"] - small["cost"])
\`\`\`

There's no universally "best" row — only the best *for your priorities*. A live chat UI may weight latency heavily; an overnight batch job may not care about latency at all and lean on quality or cost.

## Why it matters

Naming the trade-off keeps you honest:

- **"Make it better" is ambiguous.** Better quality? Cheaper? Faster? You can't improve all three at once, so decide which one you're allowed to spend.
- **Context sets the weights.** Real-time typing assistant → latency dominates. Bulk nightly summaries → cost dominates. Legal analysis → quality dominates.
- **Small wins compound.** Shaving cost or latency on a high-volume path matters far more than on a once-a-day task. Spend your quality budget where it's actually felt.

## The mental model to keep

There is no free lunch. **Every model choice spends from a budget of cost, latency, and quality — pick the two that matter most for this task and accept the trade on the third.**`,
      key_terms: [
        { term: "Cost", definition: "How much money a call consumes, driven mostly by token count and the tier used." },
        { term: "Latency", definition: "How long the user waits between sending a request and getting the answer." },
        { term: "Quality", definition: "How correct, complete, and useful the model's output is for the task." }
      ],
      callouts: [
        { type: "analogy", title: "Fast, cheap, good — pick two", content: "The classic engineering triangle fits models perfectly. Want the fastest, cheapest call? Quality gives a little. Want top quality fast? You'll pay for it. Something always gives.", position: "before" },
        { type: "tip", title: "Let the use case set the weights", content: "Live chat? Latency rules. Overnight batch? Cost rules. Legal review? Quality rules. Decide which lever matters most before you compare models — otherwise every option looks fine.", position: "after" }
      ],
      concept_diagram: {
        title: "The trade-off triangle",
        steps: [
          { label: "Cost", desc: "Money per call — push it down and quality often follows." },
          { label: "Latency", desc: "Wait time — fast tiers help, big tiers hurt." },
          { label: "Quality", desc: "How good the output is — usually rises with size." },
          { label: "Pick two", desc: "Optimize the two that matter; accept the third gives." }
        ]
      },
      inline_quizzes: [
        {
          question: "What are the three levers you trade off when choosing a model?",
          options: ["Color, sound, and speed", "Cost, latency, and quality", "Tokens, weights, and prompts"],
          correct_index: 1,
          explanation: "Model selection balances cost, latency, and quality — improving one often costs another."
        }
      ],
      quiz_questions: [
        {
          question: "A large model gives the best quality. What do you typically give up to get it?",
          options: [
            "Nothing — bigger is free and instant",
            "Higher cost and slower latency",
            "The ability to send any prompt",
            "Access to the small tier forever"
          ],
          correct_index: 1,
          explanation: "Top quality from a large tier usually comes with higher cost per call and slower responses."
        },
        {
          question: "For a real-time typing assistant that suggests words as you type, which lever matters MOST?",
          options: [
            "Cost — it must be free",
            "Latency — it must respond almost instantly",
            "Quality — it must write award-winning prose",
            "None of them matter"
          ],
          correct_index: 1,
          explanation: "An interactive, real-time experience lives or dies on latency; a slow suggestion is useless even if perfect."
        },
        {
          question: "Why is 'just make it better' an incomplete instruction for model choice?",
          options: [
            "Models cannot be improved at all",
            "'Better' is ambiguous — cheaper, faster, and higher-quality pull against each other",
            "Better always means slower",
            "Only the provider can decide"
          ],
          correct_index: 1,
          explanation: "Because you can't max all three levers at once, 'better' has to specify which lever you're spending on."
        }
      ],
      participation_activities: [
        {
          activity_title: "Trade-off check",
          questions: [
            { question: "You can always maximize cost-savings, speed, and quality at the same time.", type: "true_false", correct_answer: "false", explanation: "The three levers trade against each other; you typically optimize two and accept the third gives." },
            { question: "How long a user waits for a model's answer is called ______.", type: "fill_in", correct_answer: "latency", explanation: "Latency is the response delay — critical for interactive apps." }
          ]
        }
      ],
      starter_code: `# Two candidate tiers scored on the three levers.
small = {"name": "small", "cost": 1, "latency_ms": 200, "quality": 6}
large = {"name": "large", "cost": 12, "latency_ms": 1500, "quality": 9}

# TODO: print the quality gap and the cost gap between large and small.
print("comparing tiers")
`,
      solution_code: `small = {"name": "small", "cost": 1, "latency_ms": 200, "quality": 6}
large = {"name": "large", "cost": 12, "latency_ms": 1500, "quality": 9}

quality_gap = large["quality"] - small["quality"]
cost_gap = large["cost"] - small["cost"]

print("comparing tiers")
print("quality gap (large - small):", quality_gap)
print("cost gap (large - small):", cost_gap)
`,
      expected_output: `comparing tiers
quality gap (large - small): 3
cost gap (large - small): 11`,
      step_throughs: [
        {
          title: "weighing the three levers for one app",
          steps: [
            { label: "Name the levers", detail: "Every option is scored on cost, latency, and quality. None is free.", code: 'levers = ["cost", "latency", "quality"]' },
            { label: "Score the candidates", detail: "Each tier sits at a different point on the triangle.", code: 'large = {"cost": 12, "latency_ms": 1500, "quality": 9}' },
            { label: "Apply your priorities", detail: "A live chat app weights latency heavily; a batch job ignores it.", code: 'priority = "latency"  # interactive UI' },
            { label: "Accept the trade", detail: "Optimizing latency here means living with the large tier's slower call or dropping to a faster, lower-quality tier.", code: 'choice = "small"  # fast wins, quality gives a little' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your nightly job summarizes 10,000 documents while everyone sleeps. Which lever can you mostly ignore, and which should you optimize?",
          steps: [
            "It runs overnight with no user waiting, so latency barely matters.",
            "With 10,000 calls, cost per call multiplies fast, so cost matters a lot.",
            "Pick a cheaper tier and tolerate slower responses — nobody is watching the clock."
          ],
          output: "Ignore latency; optimize cost (and keep quality acceptable)."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You compare two tiers. Small: cost 1, latency 200ms, quality 6. Large: cost 12, latency 1500ms, quality 9. For a customer-facing chat where replies must feel instant, which do you choose and why?",
          steps: [
            "An instant-feel chat is latency-dominated; 1500ms feels sluggish, 200ms feels snappy.",
            "The large tier's +3 quality isn't worth a 7.5x slower response here.",
            "Cost also favors the small tier (1 vs 12), reinforcing the choice.",
            "Start with small; only escalate specific hard messages to large if quality proves insufficient."
          ],
          output: "Choose small — latency and cost both favor it, and quality 6 is enough for chat."
        }
      ],
      comparison_tables: [
        {
          title: "which lever each use case prioritizes",
          columns: ["Use case", "Top priority", "Acceptable to sacrifice"],
          rows: [
            { cells: ["Real-time chat suggestion", "Latency", "A little quality"] },
            { cells: ["Overnight batch summaries", "Cost", "Latency"] },
            { cells: ["Legal / medical analysis", "Quality", "Cost and latency"] },
            { cells: ["High-volume spam tagging", "Cost", "Peak quality"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "sort each factor under the lever it most affects",
          bins: [
            { id: "latency", label: "Mostly about latency" },
            { id: "cost", label: "Mostly about cost" }
          ],
          items: [
            { id: "i1", text: "User watching a spinner waiting for a reply", bin: "latency" },
            { id: "i2", text: "Running 10,000 calls overnight", bin: "cost" },
            { id: "i3", text: "Typeahead suggestions as you type", bin: "latency" },
            { id: "i4", text: "Paying per million tokens at high volume", bin: "cost" },
            { id: "i5", text: "A live voice assistant responding mid-conversation", bin: "latency" },
            { id: "i6", text: "Choosing a cheaper tier to lower the monthly bill", bin: "cost" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does the use case, not the model, decide which trade-off is 'right'?",
          sampleAnswer: "The same model can be a great choice or a terrible one depending on what the task needs. A slow, expensive, high-quality model is perfect for overnight legal analysis but awful for a live chat where speed is everything. Since cost, latency, and quality pull against each other, only the use case can tell you which two to protect and which one you're allowed to spend."
        }
      ],
      hints: [
        "Subtract the small tier's value from the large tier's value for each field.",
        "large['quality'] - small['quality'] gives the quality gap.",
        "Do the same with the 'cost' key for the cost gap, then print both."
      ],
      challenge_title: "Trade-off Scorer",
      challenge_description: "Turn the fuzzy 'fast, cheap, good — pick two' debate into one number per model, then let the weights of the day decide which model your app ships with.",
      challenge_story: "Every model is a different point on the **quality / latency / cost** triangle, and which point is 'best' depends entirely on the app. A live voice assistant weighs latency heavily; an overnight batch job weighs cost; a legal-review tool weighs quality. Rather than argue, your team agreed on a **weighted score**: reward quality, penalize latency and cost, each by a configurable weight. Plug in the weights for the current use case and the score ranks every candidate model objectively. Build the scorer that the model-selection config calls.",
      challenge_statement: "You are given three integer weights `wq wl wc` (for quality, latency, and cost) and a list of candidate models. For each model compute its score:\n\n```\nscore = wq * quality - wl * latency - wc * cost\n```\n\nHigher quality raises the score; higher latency and cost lower it. Then:\n\n1. Print every model and its score in input order.\n2. Print the **best** model — the one with the **highest score**. If two models tie on score, choose the one whose name is **lexicographically smallest**.",
      challenge_input_format: "The first line has three integers `wq wl wc`: the quality, latency, and cost weights.\n\nThe second line has one integer `n`: the number of models.\n\nEach of the next `n` lines describes one model: a name (no spaces) followed by three integers `quality latency cost`.",
      challenge_output_format: "First, `n` lines, one per model in input order: the model name, a space, then its score (e.g. `small 27`). Then a final line `best <name>` naming the highest-scoring model.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ wq, wl, wc ≤ 1000",
        "1 ≤ quality ≤ 100, 1 ≤ latency ≤ 1000, 1 ≤ cost ≤ 1000",
        "All scores fit in a normal integer; they may be negative.",
      ],
      challenge_examples: [
        { input: "10 1 2\n3\nsmall 3 1 1\nmedium 6 3 4\nlarge 9 9 12", output: "small 27\nmedium 49\nlarge 57\nbest large", explanation: "With quality weighted 10×, the smart `large` model wins despite its latency and cost penalties: 10·9 − 1·9 − 2·12 = 57." },
        { input: "1 5 1\n2\nfast 5 1 8\nslow 7 6 2", output: "fast -8\nslow -25\nbest fast", explanation: "Latency is weighted heavily (5×), so the snappy `fast` model (−8) beats the slower but smarter `slow` model (−25)." },
      ],
      challenge_notes: "All weights and fields are integers on purpose, so every score is an exact integer — no float rounding to argue about. Changing the use case is just changing three numbers: crank `wl` for real-time apps, crank `wc` for batch jobs, crank `wq` for high-stakes work. The lexicographic tie-break makes the winner deterministic when two models score the same.",
      challenge_hints: [
        "Read the three weights first, then `n`, then loop over the model lines.",
        "Compute `wq*quality - wl*latency - wc*cost` and print it right away, while you scan.",
        "Track the best score and name as you go; on a tie, keep the lexicographically smaller name.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    wq, wl, wc = map(int, data[0].split())
    n = int(data[1])
    # TODO: for each of the n models, print "name score" where
    #       score = wq*quality - wl*latency - wc*cost, then print "best <name>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    wq, wl, wc = map(int, data[idx].split())
    idx += 1
    n = int(data[idx])
    idx += 1
    best_name = None
    best_score = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        quality = int(parts[1])
        latency = int(parts[2])
        cost = int(parts[3])
        score = wq * quality - wl * latency - wc * cost
        print(f"{name} {score}")
        if best_score is None or score > best_score or (score == best_score and name < best_name):
            best_score = score
            best_name = name
    print(f"best {best_name}")

main()
`,
      challenge_test_cases: [
        { input: "10 1 2\n3\nsmall 3 1 1\nmedium 6 3 4\nlarge 9 9 12", expected_output: "small 27\nmedium 49\nlarge 57\nbest large", description: "Quality-heavy weights crown the smartest model." },
        { input: "1 5 1\n2\nfast 5 1 8\nslow 7 6 2", expected_output: "fast -8\nslow -25\nbest fast", description: "Latency-heavy weights favor the fastest model; scores go negative." },
        { input: "1 0 0\n2\nbeta 5 9 9\nalpha 5 0 0", expected_output: "beta 5\nalpha 5\nbest alpha", description: "Two models tie at score 5; the lexicographically smaller name wins." }
      ]
    },
    {
      id: "ai-22-l3",
      project_id: "ai-22",
      order: 3,
      title: "Matching Model to Task",
      concept: "Task routing",
      xp_reward: 10,
      explanation: `A hospital triage nurse doesn't send every patient to the trauma surgeon. A sniffle gets a quick check; a car crash gets the full team. Good AI systems do the same thing — they **triage tasks to tiers**, sending easy work to cheap fast models and hard work to the heavy hitters.

## What it is

**Task routing** (or model routing) means picking the model tier based on how hard the task is, rather than using one tier for everything. The two ends of the spectrum:

- **Simple work → small tier.** Classification (spam / not spam), extraction (pull the date, pull the email), short formatting, yes/no decisions. Clear inputs, narrow outputs.
- **Hard work → large tier.** Multi-step reasoning, long synthesis, ambiguous open-ended writing, anything where a wrong early step poisons the rest.

Most apps land somewhere in the middle with a few clearly-hard and clearly-easy tasks at the edges. Route the edges, default the middle.

## How it works

A router is just a function from "task" to "tier." It can be as simple as a rule table:

\`\`\`python
def route(task_type):
    easy = {"classify", "extract", "format"}
    hard = {"reason", "synthesize", "long_write"}
    if task_type in easy:
        return "small"
    if task_type in hard:
        return "large"
    return "medium"  # safe default for everything else

print(route("classify"))   # small
print(route("synthesize")) # large
\`\`\`

Notice the router doesn't call any model — it just *decides which one to call*. That separation keeps the logic testable and the cost predictable.

## Why it matters

Routing is where the cost-and-quality savings actually land:

- **You stop overpaying on easy tasks.** If 80% of requests are simple classification, sending them to the small tier slashes the bill with no quality loss.
- **You stop underperforming on hard tasks.** The 20% that need real reasoning still get the large tier, so quality stays high where it counts.
- **It's a knob, not a rewrite.** Because tiers share an interface, the router changes one value; everything downstream stays the same.

## The mental model to keep

Be the triage nurse. **Look at the task, judge its difficulty, and send it to the cheapest tier that can still do it well.** Easy to small, hard to large, unsure to the middle.`,
      key_terms: [
        { term: "Task routing", definition: "Choosing the model tier per task based on how hard the task is." },
        { term: "Classification", definition: "Sorting an input into one of a few categories — a simple task small tiers handle well." },
        { term: "Synthesis", definition: "Combining lots of information into something new and coherent — hard work that favors large tiers." }
      ],
      callouts: [
        { type: "analogy", title: "Triage, not one-size-fits-all", content: "A triage nurse sends sniffles to a quick check and crashes to the trauma team. Route easy tasks to the small tier and hard tasks to the large tier the same way — match the response to the severity.", position: "before" },
        { type: "tip", title: "Route the edges, default the middle", content: "You don't need a perfect rule for every task. Send the clearly-easy ones to small, the clearly-hard ones to large, and let everything in between fall to a sensible medium default.", position: "after" }
      ],
      concept_diagram: {
        title: "How a router picks a tier",
        steps: [
          { label: "Task arrives", desc: "A request with some type or content." },
          { label: "Judge difficulty", desc: "Is it simple classification or hard reasoning?" },
          { label: "Map to a tier", desc: "Easy -> small, hard -> large, unsure -> medium." },
          { label: "Call that tier", desc: "Same interface, just a different model id." }
        ]
      },
      inline_quizzes: [
        {
          question: "A task that just labels text as 'spam' or 'not spam' should usually go to which tier?",
          options: ["The largest, most expensive tier", "The small / fast tier", "A different provider entirely"],
          correct_index: 1,
          explanation: "Simple classification is exactly what small fast tiers handle well and cheaply."
        }
      ],
      quiz_questions: [
        {
          question: "Which task is the BEST fit for a small, fast model tier?",
          options: [
            "Writing a 20-page strategic plan from scattered notes",
            "Extracting the order number from a short confirmation email",
            "Debugging a subtle bug spread across many files",
            "Reasoning step-by-step through a hard math proof"
          ],
          correct_index: 1,
          explanation: "Extraction from a short, clear input is simple, well-defined work — ideal for a small tier."
        },
        {
          question: "What does a 'router' function actually do?",
          options: [
            "It generates the model's final answer",
            "It decides which tier to call based on the task, without calling a model itself",
            "It trains a new model for each task",
            "It deletes tasks that look too hard"
          ],
          correct_index: 1,
          explanation: "A router maps a task to a tier; calling the model happens afterward. Keeping that separate makes it testable."
        },
        {
          question: "Why does routing easy tasks to a small tier save money without hurting quality?",
          options: [
            "Small tiers are secretly the same as large ones",
            "Easy, well-defined tasks don't need a large tier's extra reasoning power, so the cheap tier handles them fine",
            "Quality never matters for any task",
            "Small tiers are free to run"
          ],
          correct_index: 1,
          explanation: "If a task is simple, the large tier's strengths go unused, so the small tier delivers the same result for far less."
        }
      ],
      participation_activities: [
        {
          activity_title: "Routing check",
          questions: [
            { question: "Hard, multi-step reasoning tasks should be routed to a large / smart tier.", type: "true_false", correct_answer: "true", explanation: "Large tiers are stronger on reasoning, so hard tasks belong there." },
            { question: "Choosing a model tier per task based on its difficulty is called task ______.", type: "fill_in", correct_answer: "routing", explanation: "Task routing matches each task to the right tier." }
          ]
        }
      ],
      starter_code: `# A router maps a task type to a tier. It does NOT call a model.
def route(task_type):
    easy = {"classify", "extract", "format"}
    hard = {"reason", "synthesize", "long_write"}
    # TODO: return "small" for easy, "large" for hard, "medium" otherwise.
    return "medium"

print(route("classify"))
print(route("synthesize"))
print(route("translate"))
`,
      solution_code: `def route(task_type):
    easy = {"classify", "extract", "format"}
    hard = {"reason", "synthesize", "long_write"}
    if task_type in easy:
        return "small"
    if task_type in hard:
        return "large"
    return "medium"

print(route("classify"))
print(route("synthesize"))
print(route("translate"))
`,
      expected_output: `small
large
medium`,
      step_throughs: [
        {
          title: "routing one request to a tier",
          steps: [
            { label: "A task comes in", detail: "The system receives a request and knows its type or content.", code: 'task_type = "extract"' },
            { label: "Check the easy set", detail: "Extraction is simple, well-defined work — it lands in the easy bucket.", code: 'task_type in {"classify", "extract", "format"}  # True' },
            { label: "Map to a tier", detail: "Easy tasks route to the small, cheap, fast tier.", code: 'tier = "small"' },
            { label: "Call that tier", detail: "Downstream code calls the model using the chosen tier — same interface, different id.", code: 'response = call_model(tier, prompt)' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A request asks the system to pull the phone number out of a one-line message. Which tier should the router pick, and why?",
          steps: [
            "Pulling a phone number is extraction — a simple, narrow task.",
            "Extraction needs no deep reasoning, just pattern recognition on a short input.",
            "The router maps it to the small tier, which is cheap and fast."
          ],
          output: "Small tier — extraction is simple, well-defined work."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your support app handles 1,000 requests/day: 850 are 'classify the ticket category', 100 are 'draft a reply', 50 are 'analyze a long complaint and recommend an action'. How should you route them and what's the payoff?",
          steps: [
            "Classify (850) is simple -> small tier; this is the bulk of traffic, so big cost savings.",
            "Draft a reply (100) is moderate generation -> medium tier.",
            "Analyze + recommend (50) is hard reasoning over long text -> large tier.",
            "Routing means 85% of traffic uses the cheapest tier, while the hard 5% still gets full quality."
          ],
          output: "Route 850 to small, 100 to medium, 50 to large — cheap on the bulk, high quality where it matters."
        }
      ],
      comparison_tables: [
        {
          title: "task type to tier",
          columns: ["Task", "Why", "Tier"],
          rows: [
            { cells: ["Spam / not-spam classification", "Simple, clear output", "Small"] },
            { cells: ["Extract a field from short text", "Narrow, well-defined", "Small"] },
            { cells: ["Draft a short reply", "Moderate generation", "Medium"] },
            { cells: ["Reason over a long document", "Hard, multi-step", "Large"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "route each task to a tier",
          bins: [
            { id: "small", label: "Route to small tier" },
            { id: "large", label: "Route to large tier" }
          ],
          items: [
            { id: "i1", text: "Detecting the language of a sentence", bin: "small" },
            { id: "i2", text: "Planning a multi-week project from raw notes", bin: "large" },
            { id: "i3", text: "Tagging a product review as 1-5 stars", bin: "small" },
            { id: "i4", text: "Summarizing a 50-page deposition", bin: "large" },
            { id: "i5", text: "Pulling the total from a short invoice", bin: "small" },
            { id: "i6", text: "Writing and reasoning through a legal argument", bin: "large" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is it worth building a router instead of just sending every request to the large tier 'to be safe'?",
          sampleAnswer: "Sending everything to the large tier means paying flagship prices and accepting slower responses for tasks that a small tier handles perfectly. A router lets the cheap tier soak up the bulk of easy traffic while the hard, high-stakes minority still gets the large tier. You keep quality where it matters and cut cost and latency everywhere else — for the price of one small decision function."
        }
      ],
      hints: [
        "Check `if task_type in easy:` first and return 'small'.",
        "Then check `if task_type in hard:` and return 'large'.",
        "If neither matches, fall through to `return 'medium'`."
      ],
      challenge_title: "Routing Engine",
      challenge_description: "Stand up the dispatcher that sends each incoming request to the right model tier, then report the per-tier load and the total bill it ran up — the heart of a cost-aware AI gateway.",
      challenge_story: "Your AI gateway sees a flood of mixed requests: quick classifications, data extractions, heavy reasoning, long syntheses, and plenty of in-between work. Sending everything to the big model is accurate but ruinously expensive; sending everything to the small one is cheap but dumb. So you triage. Tasks on the **easy list** go to the **small** tier, tasks on the **hard list** go to the **large** tier, and anything unrecognized falls to a sensible **medium** default. Each tier charges a fixed cost per call. Process the day's request log, route every request, and report the load on each tier plus the total cost — the numbers your dashboard and finance both need.",
      challenge_statement: "You are given the per-call cost of each tier, an easy-task list, a hard-task list, and a stream of requests. Route each request:\n\n1. If the task name is on the **easy list**, route to `small`.\n2. Otherwise, if it is on the **hard list**, route to `large`.\n3. Otherwise, route to `medium`.\n\nFor each request, print the routing decision. After the log, print how many requests each tier handled, then the total cost (sum of the per-call cost of the chosen tier across all requests).",
      challenge_input_format: "The first line has three integers `cs cm cl`: the per-call cost of the small, medium, and large tiers.\n\nThe next line has an integer `e`, followed by `e` lines, each one easy-task name.\n\nThen a line with an integer `h`, followed by `h` lines, each one hard-task name.\n\nThen a line with an integer `q`, followed by `q` lines, each one request's task name.",
      challenge_output_format: "First, `q` lines in input order, each `<task> -> <tier>`. Then a line `small <a> medium <b> large <c>` giving how many requests each tier handled. Then a final line `total <T>` giving the summed cost.",
      challenge_constraints: [
        "1 ≤ cs, cm, cl ≤ 1000",
        "0 ≤ e, h ≤ 1000",
        "1 ≤ q ≤ 100000",
        "Task names contain no spaces. The easy and hard lists do not overlap.",
      ],
      challenge_examples: [
        { input: "1 4 12\n2\nclassify\nextract\n2\nreason\nsynthesize\n3\nclassify\nreason\ntranslate", output: "classify -> small\nreason -> large\ntranslate -> medium\nsmall 1 medium 1 large 1\ntotal 17", explanation: "`classify` is easy → small (1), `reason` is hard → large (12), `translate` is unknown → medium (4). Total 1 + 12 + 4 = 17." },
        { input: "2 5 20\n1\ntag\n1\nplan\n2\nfoo\nbar", output: "foo -> medium\nbar -> medium\nsmall 0 medium 2 large 0\ntotal 10", explanation: "Neither `foo` nor `bar` is listed, so both fall to the medium default at cost 5 each → 10." },
      ],
      challenge_notes: "Routing the edges and defaulting the middle is exactly how real gateways stay cheap without a hand-written rule for every possible task. Checking the easy list before the hard list makes the priority explicit (though here the lists never overlap). Using sets for the easy and hard lists keeps each lookup O(1), which matters when `q` reaches 100000 requests.",
      challenge_hints: [
        "Build the easy and hard task lists into Python `set`s so membership tests are fast.",
        "Map each tier name to its cost (e.g. a dict) so you can add the right amount per request.",
        "Keep a running count per tier and a running total; print the per-request lines as you go, then the summary lines.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    cs, cm, cl = map(int, data[idx].split())
    idx += 1
    # TODO: read the easy list, the hard list, then route each of the q requests.
    #       Print each "task -> tier", then the per-tier counts, then "total <T>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    cs, cm, cl = map(int, data[idx].split())
    idx += 1
    e = int(data[idx])
    idx += 1
    easy = set()
    for _ in range(e):
        easy.add(data[idx].strip())
        idx += 1
    h = int(data[idx])
    idx += 1
    hard = set()
    for _ in range(h):
        hard.add(data[idx].strip())
        idx += 1
    q = int(data[idx])
    idx += 1
    counts = {"small": 0, "medium": 0, "large": 0}
    cost_of = {"small": cs, "medium": cm, "large": cl}
    total = 0
    out = []
    for _ in range(q):
        task = data[idx].strip()
        idx += 1
        if task in easy:
            tier = "small"
        elif task in hard:
            tier = "large"
        else:
            tier = "medium"
        counts[tier] += 1
        total += cost_of[tier]
        out.append(f"{task} -> {tier}")
    print("\\n".join(out))
    print(f"small {counts['small']} medium {counts['medium']} large {counts['large']}")
    print(f"total {total}")

main()
`,
      challenge_test_cases: [
        { input: "1 4 12\n2\nclassify\nextract\n2\nreason\nsynthesize\n3\nclassify\nreason\ntranslate", expected_output: "classify -> small\nreason -> large\ntranslate -> medium\nsmall 1 medium 1 large 1\ntotal 17", description: "One request per tier; total sums the three per-call costs." },
        { input: "2 5 20\n1\ntag\n1\nplan\n2\nfoo\nbar", expected_output: "foo -> medium\nbar -> medium\nsmall 0 medium 2 large 0\ntotal 10", description: "Unrecognized tasks all fall to the medium default." },
        { input: "1 4 12\n1\nclassify\n1\nreason\n1\nclassify", expected_output: "classify -> small\nsmall 1 medium 0 large 0\ntotal 1", description: "A single easy request routes to small for a total of 1." }
      ]
    },
    {
      id: "ai-22-l4",
      project_id: "ai-22",
      order: 4,
      title: "Testing & Switching Models",
      concept: "Evaluation",
      xp_reward: 10,
      explanation: `Here's the question that ends most model debates: "Did you actually test it?" Opinions about which model is best are cheap. A tiny **eval set** — a handful of real tasks with known good answers — turns the argument into a measurement. Run your candidates, compare the numbers, pick the winner. Then switching is just changing one model id.

## What it is

An **eval** (evaluation) is a small set of test cases you run every candidate model against, then score on what you care about: quality, cost, latency. It doesn't need to be fancy. Ten representative tasks with expected answers beats a thousand vague vibes.

The companion idea is **model-agnostic code**: your app shouldn't hardcode one model deep inside its logic. Keep the model id in one place (a variable or config) so swapping models is a one-line change, not a treasure hunt.

## How it works

You loop your candidates over the eval set and tally results:

\`\`\`python
eval_set = [
    {"input": "ping", "expected": "pong"},
    {"input": "hi", "expected": "hello"},
]

def run_model(model_id, text):
    # stand-in: a real app would call the model here
    table = {"ping": "pong", "hi": "hello"}
    return table.get(text, "?")

for model_id in ["small", "large"]:
    correct = sum(run_model(model_id, c["input"]) == c["expected"] for c in eval_set)
    print(model_id, "scored", correct, "/", len(eval_set))
\`\`\`

The crucial detail: \`model_id\` is a *parameter*. To try a new model you add it to the list — you never rewrite \`run_model\`. That's model-agnostic code in action.

## Why it matters

Evals turn model choice from faith into evidence:

- **You can defend the decision.** "Small scored 9/10 at one-tenth the cost" beats "the big one feels smarter."
- **Switching becomes safe.** A new tier drops? Add it to the eval, run, compare. If it wins on your metrics, change the id and ship.
- **You catch silent regressions.** Re-running the eval after a change tells you if quality slipped — before your users do.
- **You avoid lock-in.** Model-agnostic code means no single provider can trap you; the id is just a string you control.

## The mental model to keep

Don't argue about models — **measure them**. Build a tiny eval, run the candidates, compare quality vs cost vs latency, and keep your code so model-agnostic that switching is one line.`,
      key_terms: [
        { term: "Eval set", definition: "A small collection of test cases with known good answers used to score candidate models." },
        { term: "Model-agnostic code", definition: "Code that keeps the model id in one place so swapping models is a one-line change." },
        { term: "Regression", definition: "A quality drop introduced by a change — caught by re-running the eval and comparing scores." }
      ],
      callouts: [
        { type: "analogy", title: "A taste test, not a debate", content: "Instead of arguing which model is best, run a blind taste test: feed each one the same handful of tasks with known answers and count the wins. Numbers settle what opinions can't.", position: "before" },
        { type: "tip", title: "Keep the model id in one place", content: "If switching models means editing fifty files, you'll never switch. Store the id in one variable or config value so trying a new tier is a single-line change — and you're never locked to one provider.", position: "after" }
      ],
      concept_diagram: {
        title: "Pick a model by measuring",
        steps: [
          { label: "Build a tiny eval", desc: "A few real tasks with known good answers." },
          { label: "Run each candidate", desc: "Score quality, cost, and latency for every model." },
          { label: "Compare the numbers", desc: "See which tier wins on the metrics you care about." },
          { label: "Switch by id", desc: "Change one model id; the rest of the code stays put." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the point of a tiny eval set?",
          options: ["To train a new model from scratch", "To measure and compare candidate models on tasks with known answers", "To store the model's memory between chats"],
          correct_index: 1,
          explanation: "An eval set lets you score candidates on real tasks so you choose with evidence, not vibes."
        }
      ],
      quiz_questions: [
        {
          question: "What does it mean for your code to be 'model-agnostic'?",
          options: [
            "It refuses to use any model",
            "The model id lives in one place, so switching models is a one-line change",
            "It only works with the smallest tier",
            "It hides the model from the user"
          ],
          correct_index: 1,
          explanation: "Model-agnostic code keeps the id centralized, so you can swap tiers without rewriting logic."
        },
        {
          question: "A new tier is released. What's the safe way to decide whether to switch?",
          options: [
            "Switch immediately because newer is always better",
            "Add it to your eval set, run it, and compare quality, cost, and latency",
            "Ask on social media which one feels smarter",
            "Never switch once you've chosen a model"
          ],
          correct_index: 1,
          explanation: "Running the new tier through your existing eval gives evidence on your own tasks before you commit."
        },
        {
          question: "Why re-run your eval after changing a prompt or model?",
          options: [
            "To make the code slower on purpose",
            "To catch silent quality regressions before users do",
            "Evals only work once",
            "To delete the old model"
          ],
          correct_index: 1,
          explanation: "Re-running the eval reveals whether the change quietly dropped quality, before it reaches users."
        }
      ],
      participation_activities: [
        {
          activity_title: "Eval check",
          questions: [
            { question: "A useful eval set needs thousands of cases before it tells you anything.", type: "true_false", correct_answer: "false", explanation: "A handful of representative tasks with known answers already beats vague impressions." },
            { question: "Keeping the model id in one place so swapping is a one-line change is called model-______ code.", type: "fill_in", correct_answer: "agnostic", explanation: "Model-agnostic code avoids hardcoding a single model everywhere." }
          ]
        }
      ],
      starter_code: `# Run two candidate models over a tiny eval set and score them.
eval_set = [
    {"input": "ping", "expected": "pong"},
    {"input": "hi", "expected": "hello"},
]

def run_model(model_id, text):
    table = {"ping": "pong", "hi": "hello"}
    return table.get(text, "?")

# TODO: for each model id, count correct answers and print "<id> scored X / N".
for model_id in ["small", "large"]:
    pass
`,
      solution_code: `eval_set = [
    {"input": "ping", "expected": "pong"},
    {"input": "hi", "expected": "hello"},
]

def run_model(model_id, text):
    table = {"ping": "pong", "hi": "hello"}
    return table.get(text, "?")

for model_id in ["small", "large"]:
    correct = sum(run_model(model_id, c["input"]) == c["expected"] for c in eval_set)
    print(f"{model_id} scored {correct} / {len(eval_set)}")
`,
      expected_output: `small scored 2 / 2
large scored 2 / 2`,
      step_throughs: [
        {
          title: "choosing a model with an eval",
          steps: [
            { label: "Write the eval set", detail: "List a few real tasks, each with the answer you expect.", code: 'eval_set = [{"input": "ping", "expected": "pong"}]' },
            { label: "Run a candidate", detail: "Pass the model id as a parameter and run every case through it.", code: 'run_model("small", "ping")  # -> "pong"' },
            { label: "Score it", detail: "Count how many outputs match the expected answer.", code: 'correct = sum(out == exp for ...)  # 2 / 2' },
            { label: "Compare and switch", detail: "If a cheaper tier matches quality, change one id to switch to it.", code: 'MODEL_ID = "small"  # one-line swap' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You run a 10-case eval. Small scores 9/10 at $1 per run; large scores 10/10 at $12 per run. For a high-volume, low-stakes task, which do you pick?",
          steps: [
            "Small is only one point behind on quality (9 vs 10).",
            "Small costs one-twelfth as much per run, which dominates at high volume.",
            "For low-stakes work, the tiny quality gap isn't worth 12x the cost."
          ],
          output: "Pick small — 9/10 at one-twelfth the cost is the better trade here."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your app hardcodes the model name inside five different functions. A better, cheaper tier comes out. Why is this a problem, and how do you fix it before testing it?",
          steps: [
            "With the name hardcoded in five places, switching means editing all five and risking a missed one.",
            "That friction means you'll avoid testing new tiers at all — exactly the wrong incentive.",
            "Fix: pull the model id into a single variable or config value the functions read.",
            "Now you add the new tier to your eval, run it, and if it wins, flip the one id to ship the switch."
          ],
          output: "Centralize the model id into one variable, then add the new tier to the eval and compare before switching."
        }
      ],
      comparison_tables: [
        {
          title: "guessing vs measuring a model choice",
          columns: ["Aspect", "Guessing by vibes", "Measuring with an eval"],
          rows: [
            { cells: ["Basis for decision", "It 'feels' smarter", "Scores on real tasks"] },
            { cells: ["Catching regressions", "Only when users complain", "On every eval re-run"] },
            { cells: ["Switching cost", "Risky, ad hoc", "One-line id change"] },
            { cells: ["Defensibility", "Hard to justify", "Numbers you can show"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good practice vs bad practice for choosing models",
          bins: [
            { id: "good", label: "Good practice" },
            { id: "bad", label: "Bad practice" }
          ],
          items: [
            { id: "i1", text: "Building a small eval set with known answers", bin: "good" },
            { id: "i2", text: "Hardcoding one model name in many files", bin: "bad" },
            { id: "i3", text: "Keeping the model id in one config value", bin: "good" },
            { id: "i4", text: "Switching tiers because a tweet said it's smarter", bin: "bad" },
            { id: "i5", text: "Re-running the eval after a change to catch regressions", bin: "good" },
            { id: "i6", text: "Never measuring cost or latency, only guessing", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how do a tiny eval set and model-agnostic code work together to make switching models painless?",
          sampleAnswer: "The eval set gives you evidence — run each candidate on the same known tasks and you can see which one wins on quality, cost, and latency. Model-agnostic code gives you the lever — because the model id lives in one place, acting on that evidence is a single-line change. Together they turn switching from a risky rewrite into a quick measure-then-flip, so you can adopt better or cheaper tiers as they appear."
        }
      ],
      hints: [
        "Use a comprehension: sum(run_model(model_id, c['input']) == c['expected'] for c in eval_set).",
        "len(eval_set) gives the total number of cases.",
        "Print with an f-string: f'{model_id} scored {correct} / {len(eval_set)}'."
      ],
      challenge_title: "Eval Harness",
      challenge_description: "Run the blind taste test that decides which model ships: score every candidate against a graded answer key, then pick the winner on accuracy first and cost second — never on vibes.",
      challenge_story: "A new model tier just dropped and three people on Slack swear it's smarter. You don't switch on rumors — you switch on an **eval**. You keep a small set of test cases, each with a known correct answer, and you run every candidate model over all of them. The model that answers the most cases correctly wins. When two models are equally accurate, you take the **cheaper** one, because there's no reason to pay more for the same quality. Build the harness that grades the candidates and names the model to deploy.",
      challenge_statement: "You are given several candidate models (each with a per-call cost), an eval set (each case is an input and its expected answer), and, for each model, the answer it produced on every case in order. Grade and rank them:\n\n1. A model's **score** is the number of cases where its answer **exactly matches** the expected answer.\n2. Print each model's score in input order.\n3. Print the **winner**: the model with the **highest score**. Break ties by **lowest cost**; if cost also ties, break by **lexicographically smallest name**.",
      challenge_input_format: "The first line has an integer `m`: the number of models. Each of the next `m` lines has a model name (no spaces) and an integer `cost`.\n\nThe next line has an integer `k`: the number of eval cases. Each of the next `k` lines has two tokens `input expected` (no spaces).\n\nThen `m` lines, one per model in the same order as the model list: the model name followed by `k` tokens — that model's answer to each case, in case order.",
      challenge_output_format: "First, `m` lines in input order, each `<name>: <score>/<k>`. Then a final line `winner: <name>`.",
      challenge_constraints: [
        "1 ≤ m ≤ 100",
        "1 ≤ k ≤ 1000",
        "1 ≤ cost ≤ 1000000",
        "Inputs, expected answers, and model answers contain no spaces.",
      ],
      challenge_examples: [
        { input: "2\nsmall 1\nlarge 12\n3\nping pong\nhi hello\nyo sup\nsmall pong hello sup\nlarge pong hello sup", output: "small: 3/3\nlarge: 3/3\nwinner: small", explanation: "Both models answer all 3 cases correctly, so the tie breaks to `small` because it costs less (1 < 12)." },
        { input: "2\nsmall 1\nlarge 12\n3\nping pong\nhi hello\nyo sup\nsmall pong WRONG sup\nlarge pong hello sup", output: "small: 2/3\nlarge: 3/3\nwinner: large", explanation: "`small` misses the second case (2/3) while `large` is perfect (3/3). Accuracy beats cost, so the pricier but more accurate `large` wins." },
      ],
      challenge_notes: "This is the whole argument for evals: decisions come from a graded scoreboard, not from who posted most confidently. Accuracy is the primary key and cost is only the tie-break, so you never trade quality for a cheaper bill — you only save money when quality is genuinely equal. Comparing answers with exact string equality keeps grading deterministic and unambiguous.",
      challenge_hints: [
        "Read the models and their costs first, then the `k` eval cases (keep each expected answer), then each model's `k` answers.",
        "Score a model by counting positions where its answer equals the expected answer for that case.",
        "Rank with a tuple key like `(-score, cost, name)` and take the minimum — that gives highest score, then lowest cost, then smallest name.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx])
    idx += 1
    # TODO: read m models (name + cost), k eval cases (input + expected),
    #       then each model's k answers. Print "<name>: score/k" per model,
    #       then "winner: <name>" (highest score, then lowest cost, then name).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx])
    idx += 1
    models = []
    for _ in range(m):
        parts = data[idx].split()
        idx += 1
        models.append((parts[0], int(parts[1])))
    k = int(data[idx])
    idx += 1
    cases = []
    for _ in range(k):
        parts = data[idx].split()
        idx += 1
        cases.append((parts[0], parts[1]))
    answers = {}
    for _ in range(m):
        parts = data[idx].split()
        idx += 1
        answers[parts[0]] = parts[1:1 + k]

    results = []
    for name, cost in models:
        correct = sum(1 for i in range(k) if answers[name][i] == cases[i][1])
        results.append((name, cost, correct))
        print(f"{name}: {correct}/{k}")

    best = None
    for name, cost, correct in results:
        key = (-correct, cost, name)
        if best is None or key < best[0]:
            best = (key, name)
    print(f"winner: {best[1]}")

main()
`,
      challenge_test_cases: [
        { input: "2\nsmall 1\nlarge 12\n3\nping pong\nhi hello\nyo sup\nsmall pong hello sup\nlarge pong hello sup", expected_output: "small: 3/3\nlarge: 3/3\nwinner: small", description: "Equal accuracy breaks the tie to the cheaper model." },
        { input: "2\nsmall 1\nlarge 12\n3\nping pong\nhi hello\nyo sup\nsmall pong WRONG sup\nlarge pong hello sup", expected_output: "small: 2/3\nlarge: 3/3\nwinner: large", description: "Higher accuracy wins even though the model costs more." },
        { input: "3\nsmall 1\nmid 4\nlarge 12\n2\na x\nb y\nsmall x y\nmid x y\nlarge x y", expected_output: "small: 2/2\nmid: 2/2\nlarge: 2/2\nwinner: small", description: "Three-way accuracy tie resolves to the cheapest model." }
      ]
    },
    {
      id: "ai-22-l5",
      project_id: "ai-22",
      order: 5,
      title: "Reading Benchmarks Critically",
      concept: "Benchmarks",
      xp_reward: 10,
      explanation: `A model tops the leaderboard at 92% on a famous reasoning benchmark. You deploy it. On your actual tickets it does worse than the cheap tier you replaced. The benchmark wasn't lying — you just read it like a final grade instead of what it is: one noisy clue, on someone else's tasks, that may already be baked into the model's training data.

## What it is

A **benchmark** is a fixed set of test questions with known answers used to score a model. A **leaderboard** ranks many models by their benchmark scores. They're genuinely useful — they let you compare models on *something* instead of vibes. But a score is a measurement of one specific test, not a promise about *your* workload.

The trap that bites everyone is **data contamination**: if the benchmark's questions (or near-copies) leaked into the model's training data, the model may have effectively *memorized* the answers. A high score then measures recall of seen examples, not real ability.

## How it works

Treat a leaderboard score the way a scientist treats a single experiment — adjust it for what could be inflating it:

\`\`\`python
# Raw score can be misleading. Discount benchmarks you can't trust.
def trusted_score(benchmarks):
    # each benchmark: (raw_score, is_contaminated)
    clean = [s for s, contaminated in benchmarks if not contaminated]
    if not clean:
        return None  # nothing trustworthy to go on
    return sum(clean) / len(clean)

model = [(95, True), (80, False), (70, False)]
print(trusted_score(model))  # 75.0 -- the contaminated 95 is dropped
\`\`\`

A clean benchmark on tasks *like yours* is worth more than a famous one that doesn't resemble your work at all. And a one-point gap between two models is almost always noise, not a real difference.

## Why it matters

Overtrusting leaderboards leads to bad, expensive picks:

- **Contamination inflates scores.** Public benchmarks get scraped into training sets, so yesterday's hard test is today's memorized answer key.
- **The benchmark isn't your task.** A model that aces math olympiad problems may still fumble your support tickets. Relevance beats fame.
- **Tiny gaps are noise.** 89.4 vs 89.1 tells you nothing actionable; treat near-ties as ties.
- **The fix is your own eval.** Your tiny eval set from lesson 4 is contamination-proof by construction — the model never saw it.

## The mental model to keep

A benchmark is a **clue, not a verdict.** Read it skeptically: ask if the test resembles your task, whether the data could be contaminated, and whether the gap is bigger than the noise — then confirm with your own eval.`,
      key_terms: [
        { term: "Benchmark", definition: "A fixed set of questions with known answers used to score a model's ability on some skill." },
        { term: "Leaderboard", definition: "A public ranking of models by their benchmark scores." },
        { term: "Data contamination", definition: "When benchmark questions leak into training data, so a high score reflects memorization rather than real ability." }
      ],
      callouts: [
        { type: "warning", title: "The test may be in the training set", content: "Public benchmarks get scraped into training data all the time. A sky-high score can mean the model memorized the answer key, not that it can reason. Discount benchmarks you can't be sure are clean.", position: "before" },
        { type: "tip", title: "Relevance beats fame", content: "A clean benchmark on tasks that look like yours predicts your results far better than a famous benchmark on tasks you'll never run. Match the test to your job before you trust the number.", position: "after" }
      ],
      concept_diagram: {
        title: "How to read a leaderboard number",
        steps: [
          { label: "See the score", desc: "A model ranks high on a public benchmark." },
          { label: "Check relevance", desc: "Does the test resemble your actual task?" },
          { label: "Check contamination", desc: "Could the questions be in the training data?" },
          { label: "Confirm with your eval", desc: "Run your own clean tasks before committing." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is data contamination on a benchmark?",
          options: ["When the benchmark file is corrupted", "When the test questions leaked into training data, so the model may have memorized the answers", "When two models score exactly the same"],
          correct_index: 1,
          explanation: "Contamination means the benchmark questions were in the training data, inflating the score with memorization rather than real ability."
        }
      ],
      quiz_questions: [
        {
          question: "A model scores 92% on a famous public benchmark but does poorly on your support tickets. What's the most likely explanation?",
          options: [
            "The benchmark is fake",
            "The benchmark tests skills that don't match your task, and/or its questions may be contaminated",
            "Your tickets are written incorrectly",
            "High benchmark scores always transfer perfectly"
          ],
          correct_index: 1,
          explanation: "A benchmark measures one specific test. If it doesn't resemble your work, or its data leaked into training, the score won't predict your results."
        },
        {
          question: "Two models score 89.4 and 89.1 on the same benchmark. How should you treat that gap?",
          options: [
            "The 89.4 model is clearly and reliably better",
            "As noise — a fraction of a point is almost certainly not a real difference",
            "The 89.1 model should be banned",
            "You must always pick the higher number"
          ],
          correct_index: 1,
          explanation: "Tiny gaps are within measurement noise. Treat near-ties as ties and decide on cost, latency, or your own eval instead."
        },
        {
          question: "Why is your own small eval set immune to contamination?",
          options: [
            "It uses more questions than any public benchmark",
            "The model never saw it, so it can't have memorized the answers",
            "It runs faster than a leaderboard",
            "It only tests the largest tier"
          ],
          correct_index: 1,
          explanation: "Because you wrote it privately, your eval can't be in any model's training data, so the score reflects real ability on your tasks."
        }
      ],
      participation_activities: [
        {
          activity_title: "Benchmark skepticism check",
          questions: [
            { question: "A high leaderboard score guarantees the model will do well on your specific task.", type: "true_false", correct_answer: "false", explanation: "A benchmark measures one test; it may not resemble your task or may be contaminated." },
            { question: "When benchmark questions leak into a model's training data, the result is called data ______.", type: "fill_in", correct_answer: "contamination", explanation: "Contamination inflates scores by rewarding memorization." }
          ]
        }
      ],
      starter_code: `# Compute a model's trustworthy score by dropping contaminated benchmarks.
benchmarks = [
    {"score": 95, "contaminated": True},
    {"score": 80, "contaminated": False},
    {"score": 70, "contaminated": False},
]

# TODO: average only the scores where contaminated is False, then print it.
print("scoring model")
`,
      solution_code: `benchmarks = [
    {"score": 95, "contaminated": True},
    {"score": 80, "contaminated": False},
    {"score": 70, "contaminated": False},
]

clean = [b["score"] for b in benchmarks if not b["contaminated"]]
avg = sum(clean) / len(clean)

print("scoring model")
print("clean benchmarks used:", len(clean))
print("trusted score:", avg)
`,
      expected_output: `scoring model
clean benchmarks used: 2
trusted score: 75.0`,
      step_throughs: [
        {
          title: "turning a leaderboard number into a decision",
          steps: [
            { label: "Read the raw score", detail: "A model tops a benchmark at 92%. That's the headline number, not the answer.", code: 'raw = 92  # leaderboard rank #1' },
            { label: "Ask if it matches your task", detail: "The benchmark is math olympiad problems; you run support tickets. Low relevance.", code: 'resembles_my_task = False' },
            { label: "Ask if it could be contaminated", detail: "It's a famous public test, likely scraped into training data. Discount it.", code: 'public_and_old = True  # memorization risk' },
            { label: "Confirm on your own eval", detail: "Run your private 10-case eval. That score is contamination-proof and on-task.", code: 'my_eval_score = run_eval(model)  # the number you trust' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Model A scores 90.2 and Model B scores 90.0 on the same benchmark. Is A meaningfully better?",
          steps: [
            "The gap is 0.2 points, well inside normal measurement noise.",
            "A difference that small does not reliably predict which model wins on real work.",
            "Treat it as a tie and decide on cost, latency, or your own eval instead."
          ],
          output: "No — a 0.2-point gap is noise; treat them as equal and break the tie another way."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A model scores 96% on a famous public coding benchmark from 2021 but only 71% on a brand-new private benchmark of similar problems. What does the gap most likely indicate?",
          steps: [
            "The 2021 public benchmark has had years to leak into training data — high contamination risk.",
            "The private benchmark is new and unseen, so its score reflects genuine ability.",
            "A large drop from the public to the private test is a classic contamination signature.",
            "Trust the 71% as the realistic estimate, and confirm with your own task-specific eval."
          ],
          output: "Likely contamination: the public score is inflated by memorization; the private 71% is the honest number."
        }
      ],
      comparison_tables: [
        {
          title: "trustworthy benchmark signal vs misleading one",
          columns: ["Aspect", "More trustworthy", "More misleading"],
          rows: [
            { cells: ["Test relevance", "Looks like your task", "Unrelated to your task"] },
            { cells: ["Data freshness", "New, private, unseen", "Old, public, widely scraped"] },
            { cells: ["Gap size", "Large, consistent lead", "Fraction of a point"] },
            { cells: ["Confirmation", "Backed by your own eval", "Leaderboard rank alone"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "trust the score more vs trust it less",
          bins: [
            { id: "more", label: "Trust the score more" },
            { id: "less", label: "Trust the score less" }
          ],
          items: [
            { id: "i1", text: "Benchmark tasks closely resemble your real workload", bin: "more" },
            { id: "i2", text: "A famous public test that's been online for years", bin: "less" },
            { id: "i3", text: "A brand-new private benchmark the model never saw", bin: "more" },
            { id: "i4", text: "An 89.4 vs 89.1 difference between two models", bin: "less" },
            { id: "i5", text: "Confirmed by your own clean eval set", bin: "more" },
            { id: "i6", text: "A test on a skill you'll never actually use", bin: "less" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a model with the #1 leaderboard score still be the wrong choice for your app?",
          sampleAnswer: "A leaderboard measures one specific test, which may not resemble your task at all, and its questions may have leaked into the model's training data so the high score reflects memorization rather than real ability. On top of that, tiny gaps between top models are usually noise. The number is a clue, but the only score that truly predicts your results is your own clean eval on tasks like yours."
        }
      ],
      hints: [
        "Use a list comprehension to keep only the scores where contaminated is False.",
        "Sum that filtered list and divide by its length for the average.",
        "Print the count of clean benchmarks and the resulting trusted score."
      ],
      challenge_title: "Contamination-Aware Ranker",
      challenge_description: "Rank models the way a careful engineer reads a leaderboard: throw out the benchmarks that might be contaminated, average only what's trustworthy, and refuse to rank a model with nothing clean left.",
      challenge_story: "Your team is choosing a model and three people keep pasting leaderboard screenshots. You insist on reading them critically. Each model was run on several **benchmarks**, and for each benchmark you've flagged whether it's \`clean\` or \`contaminated\` (its questions may have leaked into training data, inflating the score). The rule: a model's **trustworthy score** is the average of its **clean** benchmark scores only — contaminated ones are dropped entirely. A model with **no** clean benchmarks can't be ranked at all. Build the ranker that turns a wall of leaderboard numbers into one honest score per model and names the best pick.",
      challenge_statement: "You are given several models. For each model you have a list of benchmark results, each a score and a flag (\`clean\` or \`contaminated\`). For every model:\n\n1. Keep only the scores from benchmarks flagged \`clean\`.\n2. If at least one clean benchmark exists, the model's **trusted score** is the **integer average** (floor) of those clean scores. Print \`<name> <trusted_score>\`.\n3. If a model has **no** clean benchmarks, print \`<name> NONE\` and exclude it from ranking.\n\nAfter all models, print \`best <name>\`: the model with the **highest** trusted score. Break ties by **lexicographically smallest name**. If no model has any clean benchmark, print \`NO TRUSTED MODEL\` instead.",
      challenge_input_format: "The first line is an integer `n`: the number of models.\n\nEach of the next `n` lines describes one model: a name (no spaces), then an integer `b` (its number of benchmarks), then `b` pairs `score flag`, where `score` is an integer and `flag` is either `clean` or `contaminated`. All tokens are space-separated.",
      challenge_output_format: "For each model in input order, a line `<name> <trusted_score>` (floor of the clean-score average), or `<name> NONE` if it has no clean benchmarks. Then a final line `best <name>`, or `NO TRUSTED MODEL` if no model has a clean benchmark.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ b ≤ 100",
        "0 ≤ score ≤ 100",
        "Each flag is exactly `clean` or `contaminated`.",
      ],
      challenge_examples: [
        { input: "2\nmodelA 3 90 contaminated 80 clean 70 clean\nmodelB 2 60 clean 50 clean", output: "modelA 75\nmodelB 55\nbest modelA", explanation: "modelA drops the contaminated 90 and averages 80 and 70 to 75. modelB averages 60 and 50 to 55. modelA's 75 wins." },
        { input: "1\nsolo 1 99 contaminated", output: "solo NONE\nNO TRUSTED MODEL", explanation: "solo's only benchmark is contaminated, so it has no trustworthy score and cannot be ranked." },
      ],
      challenge_notes: "Dropping contaminated benchmarks on purpose models real skepticism: a memorized answer key shouldn't count toward a model's credit. Integer floor division keeps the output deterministic with no rounding debate. The `NO TRUSTED MODEL` case mirrors a real outcome — sometimes the honest answer is that the leaderboard gives you nothing you can trust, and you must run your own clean eval.",
      challenge_hints: [
        "Walk each model's benchmark pairs two tokens at a time: read the score, then the flag.",
        "Collect only the scores whose flag is `clean`; if that list is empty, the model is NONE.",
        "Use `sum(clean) // len(clean)` for the floor average, and track the best (highest score, then smallest name) across rankable models.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    # TODO: for each model read its benchmark (score flag) pairs, average only
    #       the clean scores (floor), print "<name> <score>" or "<name> NONE",
    #       then print "best <name>" or "NO TRUSTED MODEL".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    best_name = None
    best_avg = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        b = int(parts[1])
        rest = parts[2:]
        clean_scores = []
        i = 0
        for _ in range(b):
            score = int(rest[i])
            flag = rest[i + 1]
            i += 2
            if flag == "clean":
                clean_scores.append(score)
        if not clean_scores:
            print(f"{name} NONE")
            continue
        avg = sum(clean_scores) // len(clean_scores)
        print(f"{name} {avg}")
        if best_avg is None or avg > best_avg or (avg == best_avg and name < best_name):
            best_avg = avg
            best_name = name
    if best_name is None:
        print("NO TRUSTED MODEL")
    else:
        print(f"best {best_name}")

main()
`,
      challenge_test_cases: [
        { input: "2\nmodelA 3 90 contaminated 80 clean 70 clean\nmodelB 2 60 clean 50 clean", expected_output: "modelA 75\nmodelB 55\nbest modelA", description: "Contaminated benchmarks dropped before averaging; higher clean average wins." },
        { input: "1\nsolo 1 99 contaminated", expected_output: "solo NONE\nNO TRUSTED MODEL", description: "A model with only contaminated benchmarks cannot be ranked." },
        { input: "3\na 2 88 clean 92 clean\nb 2 88 clean 92 clean\nc 1 100 contaminated", expected_output: "a 90\nb 90\nc NONE\nbest a", description: "Two models tie at 90; lexicographically smaller name wins, contaminated-only model excluded." }
      ]
    },
    {
      id: "ai-22-l6",
      project_id: "ai-22",
      order: 6,
      title: "Open vs Closed Models",
      concept: "OpenClosed",
      xp_reward: 10,
      explanation: `Two teams build the same feature. One calls a **closed** model over an API and ships in a day. The other downloads an **open-weight** model and runs it on their own servers — slower to set up, but they own it. Neither is wrong. They made opposite bets on control, cost, and privacy, and the right bet depends entirely on the situation.

## What it is

A **closed (hosted) model** runs on the provider's servers. You send a prompt over an API, you get an answer, you pay per token. You never touch the weights.

An **open-weight model** has its weights published for download. You can run it on your own hardware (or a cloud machine you rent), change how it's served, and keep every byte of data in-house. The capability is yours to host.

The split isn't "good vs bad." It's *who runs the model and who bears the consequences.*

## How it works

The decision often comes down to total cost at your volume. Closed models charge per call; open models charge you fixed infrastructure plus a smaller per-call compute cost:

\`\`\`python
def closed_cost(per_call, volume):
    return per_call * volume                 # pure pay-per-use

def open_cost(fixed_monthly, per_call, volume):
    return fixed_monthly + per_call * volume  # own the box, then run it

# At low volume, closed wins; at high volume, the fixed cost amortizes.
print(closed_cost(5, 1000))         # 5000
print(open_cost(20000, 1, 1000))    # 21000  -> closed cheaper here
print(closed_cost(5, 100000))       # 500000
print(open_cost(20000, 1, 100000))  # 120000 -> open cheaper at scale
\`\`\`

There's a **crossover point**: below it, hosted is cheaper because you skip the fixed cost; above it, self-hosting amortizes that fixed cost across millions of calls.

## Why it matters

Each side wins on different axes:

- **Control.** Open lets you pin a version forever and tune serving; closed can change or deprecate a model under you.
- **Cost shape.** Closed is low fixed, high marginal — great until volume explodes. Open is high fixed, low marginal — great at scale.
- **Privacy.** Open keeps data on hardware you control, which can be decisive for regulated or sensitive data; closed sends prompts to a third party.
- **Effort.** Closed is a one-line API call; open means you run, scale, patch, and monitor the infrastructure yourself.

## The mental model to keep

Closed is **renting** capability; open is **owning** it. Rent when you want speed, low volume, and zero ops; own when you need control, privacy, or scale that makes the fixed cost pay off.`,
      key_terms: [
        { term: "Closed (hosted) model", definition: "A model that runs on the provider's servers; you call it over an API and pay per token." },
        { term: "Open-weight model", definition: "A model whose weights are published, so you can run it on your own hardware and control the data." },
        { term: "Crossover point", definition: "The volume at which self-hosting becomes cheaper than paying per call, because the fixed cost amortizes." }
      ],
      callouts: [
        { type: "analogy", title: "Renting vs owning", content: "Closed models are a rental car: walk up, drive off, pay per trip, zero maintenance. Open models are buying the car: a big upfront cost, then cheap per mile, and every repair is yours. Volume and control decide which makes sense.", position: "before" },
        { type: "insight", title: "Watch for the crossover", content: "Closed is cheap at low volume but its per-call cost never stops. Open has a fixed cost that, once paid, makes each call tiny. There's a request volume where they cross — below it rent, above it own.", position: "after" }
      ],
      concept_diagram: {
        title: "Choosing open vs closed",
        steps: [
          { label: "Estimate volume", desc: "How many calls per month will you make?" },
          { label: "Weigh privacy", desc: "Must data stay on hardware you control?" },
          { label: "Weigh control + ops", desc: "Need to pin a version, or avoid running servers?" },
          { label: "Pick the bet", desc: "Rent (closed) for speed and low volume; own (open) for scale, privacy, control." }
        ]
      },
      inline_quizzes: [
        {
          question: "What mainly distinguishes an open-weight model from a closed one?",
          options: ["Open models are always smarter", "Open models publish their weights so you can run them on your own hardware; closed models run on the provider's servers", "Closed models are free to use"],
          correct_index: 1,
          explanation: "The core difference is who runs the model: with open weights you host it yourself; with closed you call the provider's hosted version."
        }
      ],
      quiz_questions: [
        {
          question: "Your app processes highly sensitive medical data that legally cannot leave your servers. Which option fits best?",
          options: [
            "A closed model, since it's easier to set up",
            "An open-weight model you host yourself, so the data never leaves your hardware",
            "Either one — privacy doesn't depend on hosting",
            "Whichever has the highest benchmark score"
          ],
          correct_index: 1,
          explanation: "Self-hosting an open-weight model keeps prompts and data on hardware you control, which matters when data legally cannot go to a third party."
        },
        {
          question: "You expect very LOW request volume and want to ship tomorrow with no servers to manage. Which is the better bet?",
          options: [
            "Open-weight self-hosting, to avoid per-call fees",
            "A closed hosted model — low fixed cost and a one-line API call",
            "Whichever is newest",
            "Always self-host regardless of volume"
          ],
          correct_index: 1,
          explanation: "At low volume the closed model's per-call cost stays small, and you skip all the infrastructure work — ideal for shipping fast."
        },
        {
          question: "Why does self-hosting an open model get cheaper than a closed model only at high volume?",
          options: [
            "Open models become smarter with more calls",
            "Open hosting has a fixed cost that only pays off when spread across a large number of calls",
            "Closed models raise their price every day",
            "High volume makes APIs stop working"
          ],
          correct_index: 1,
          explanation: "Open hosting trades a high fixed cost for a low per-call cost. That fixed cost only amortizes well once you make enough calls to cross the break-even point."
        }
      ],
      participation_activities: [
        {
          activity_title: "Open vs closed check",
          questions: [
            { question: "With a closed hosted model, your prompts are sent to the provider's servers rather than staying on your own hardware.", type: "true_false", correct_answer: "true", explanation: "Closed models run on the provider's infrastructure, so your data goes to a third party." },
            { question: "The request volume at which self-hosting becomes cheaper than paying per call is called the ______ point.", type: "fill_in", correct_answer: "crossover", explanation: "Below the crossover point closed is cheaper; above it, open wins." }
          ]
        }
      ],
      starter_code: `# Compare monthly cost of a closed (hosted) model vs an open self-hosted one.
volume = 50000  # calls per month

closed_per_call = 5            # cents per call, no fixed cost
open_fixed = 20000             # cents/month for the server
open_per_call = 1              # cents per call once hosted

# TODO: compute both monthly costs and print which is cheaper.
print("comparing hosting options")
`,
      solution_code: `volume = 50000  # calls per month

closed_per_call = 5
open_fixed = 20000
open_per_call = 1

closed_total = closed_per_call * volume
open_total = open_fixed + open_per_call * volume

print("comparing hosting options")
print("closed total:", closed_total)
print("open total:", open_total)
print("cheaper:", "open" if open_total < closed_total else "closed")
`,
      expected_output: `comparing hosting options
closed total: 250000
open total: 70000
cheaper: open`,
      step_throughs: [
        {
          title: "deciding open vs closed for one app",
          steps: [
            { label: "Estimate your volume", detail: "Project the monthly call count — it drives the whole cost comparison.", code: 'volume = 50000  # calls/month' },
            { label: "Price the closed option", detail: "Pure pay-per-use: no fixed cost, but every call costs.", code: 'closed = 5 * volume  # 250000' },
            { label: "Price the open option", detail: "A fixed server cost plus a small per-call compute cost.", code: 'open_ = 20000 + 1 * volume  # 70000' },
            { label: "Factor in privacy and ops", detail: "If data must stay in-house or you want version control, that can tip the choice even when costs are close.", code: 'choice = "open"  # cheaper here, and data stays in-house' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A weekend prototype will make maybe 200 model calls total, and you want to ship it tonight. Closed or open?",
          steps: [
            "200 calls is tiny volume, so per-call fees barely add up.",
            "Self-hosting means buying and configuring a server for almost no traffic — wasted effort.",
            "A closed hosted API is a one-line call with no infrastructure, perfect for shipping tonight."
          ],
          output: "Closed — at trivial volume the hosted API is cheaper in effort and money."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Closed costs 5 cents/call. Open costs 20000 cents/month fixed plus 1 cent/call. At what monthly volume does open become cheaper?",
          steps: [
            "Set the two costs equal: 5 * v = 20000 + 1 * v.",
            "Subtract 1*v from both sides: 4 * v = 20000.",
            "Divide: v = 5000 calls per month is the crossover point.",
            "Below 5000 calls closed is cheaper; above 5000, open's fixed cost has amortized and it wins."
          ],
          output: "At 5000 calls/month they break even; above that, open is cheaper."
        }
      ],
      comparison_tables: [
        {
          title: "open-weight vs closed (hosted) models",
          columns: ["Dimension", "Open-weight (self-host)", "Closed (hosted API)"],
          rows: [
            { cells: ["Who runs it", "You, on your hardware", "The provider's servers"] },
            { cells: ["Cost shape", "High fixed, low per-call", "No fixed, higher per-call"] },
            { cells: ["Data privacy", "Stays on your hardware", "Sent to a third party"] },
            { cells: ["Setup + ops effort", "You run and patch it", "One-line API call"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which hosting fits the situation",
          bins: [
            { id: "open", label: "Favors open / self-host" },
            { id: "closed", label: "Favors closed / hosted" }
          ],
          items: [
            { id: "i1", text: "Sensitive data that legally can't leave your servers", bin: "open" },
            { id: "i2", text: "A weekend prototype with a handful of calls", bin: "closed" },
            { id: "i3", text: "Tens of millions of calls per month at scale", bin: "open" },
            { id: "i4", text: "A tiny team that doesn't want to run servers", bin: "closed" },
            { id: "i5", text: "Needing to pin one exact model version forever", bin: "open" },
            { id: "i6", text: "Wanting to ship today with one API call", bin: "closed" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why might two reasonable teams pick opposite answers on open vs closed for the same kind of feature?",
          sampleAnswer: "Because they're optimizing different things. A team with tiny volume, no ops staff, and a deadline rents a closed model to ship fast with no servers to manage. A team with huge volume, strict data-privacy rules, or a need to pin an exact version owns an open-weight model, because at their scale the fixed hosting cost amortizes and the control and privacy are worth the extra effort. Same feature, different constraints, opposite-but-correct bets."
        }
      ],
      hints: [
        "Closed total is just per_call * volume — there's no fixed cost.",
        "Open total is the fixed monthly cost plus per_call * volume.",
        "Compare the two totals and print 'open' or 'closed' for whichever is smaller."
      ],
      challenge_title: "Hosting Cost Crossover",
      challenge_description: "Run the build-vs-buy math at a given request volume: price every hosting option, closed and open, and name the cheapest one — the call a platform team makes before committing to a model.",
      challenge_story: "Your platform team is choosing how to serve a model, and the debate is the classic one: rent a **closed** hosted model and pay per call, or self-host an **open-weight** model with a fixed monthly server bill plus a small per-call compute cost. The answer depends entirely on your projected **monthly volume**. At low volume the hosted API wins because you skip the fixed cost; at high volume self-hosting wins because that fixed cost amortizes across millions of calls. You've gathered the pricing for every candidate option. Compute each option's total monthly cost at your volume and report the cheapest — the number finance needs to sign off.",
      challenge_statement: "You are given a monthly request `volume` and a list of hosting options. Each option is either:\n\n- \`closed\`, with a per-call cost: total = \`per_call * volume\`.\n- \`open\`, with a fixed monthly cost and a per-call cost: total = \`fixed + per_call * volume\`.\n\nFor each option, print its name and its total monthly cost in input order. Then print the **cheapest** option: \`cheapest <name>\`. If two options tie on total cost, choose the one whose name is **lexicographically smallest**.",
      challenge_input_format: "The first line is an integer `volume`: the monthly number of calls.\n\nThe second line is an integer `n`: the number of options.\n\nEach of the next `n` lines describes one option. A `closed` option is `name closed per_call`. An `open` option is `name open fixed per_call`. All tokens are space-separated; names contain no spaces.",
      challenge_output_format: "For each option in input order, a line `<name> <total>`. Then a final line `cheapest <name>`.",
      challenge_constraints: [
        "0 ≤ volume ≤ 100000000",
        "1 ≤ n ≤ 1000",
        "1 ≤ per_call ≤ 1000",
        "0 ≤ fixed ≤ 1000000000",
      ],
      challenge_examples: [
        { input: "1000\n2\nhosted closed 5\nselfhost open 20000 1", output: "hosted 5000\nselfhost 21000\ncheapest hosted", explanation: "At 1000 calls, hosted costs 5*1000=5000; selfhost costs 20000+1*1000=21000. The fixed cost hasn't amortized yet, so hosted wins." },
        { input: "10000\n2\nhosted closed 5\nselfhost open 20000 1", output: "hosted 50000\nselfhost 30000\ncheapest selfhost", explanation: "At 10000 calls, hosted costs 50000 while selfhost costs 30000. Past the crossover, self-hosting is cheaper." },
      ],
      challenge_notes: "This is the build-vs-buy crossover in one calculation: closed cost grows purely with volume, while open cost starts high and then grows slowly. Cost isn't the only factor in reality — privacy and control can override it — but it's the number that anchors the decision. The lexicographic tie-break keeps the winner deterministic when two options cost exactly the same.",
      challenge_hints: [
        "Read the option's type token first; `closed` lines have one cost number, `open` lines have two.",
        "Closed total is `per_call * volume`; open total is `fixed + per_call * volume`.",
        "Track the lowest total as you scan; on a tie, keep the lexicographically smaller name.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    volume = int(data[idx].strip())
    idx += 1
    n = int(data[idx].strip())
    idx += 1
    # TODO: for each option compute its total (closed: per_call*volume;
    #       open: fixed + per_call*volume), print "<name> <total>", then
    #       print "cheapest <name>" (lowest total, ties by smallest name).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    volume = int(data[idx].strip())
    idx += 1
    n = int(data[idx].strip())
    idx += 1
    best_name = None
    best_cost = None
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        kind = parts[1]
        if kind == "closed":
            per_call = int(parts[2])
            total = per_call * volume
        else:
            fixed = int(parts[2])
            per_call = int(parts[3])
            total = fixed + per_call * volume
        print(f"{name} {total}")
        if best_cost is None or total < best_cost or (total == best_cost and name < best_name):
            best_cost = total
            best_name = name
    print(f"cheapest {best_name}")

main()
`,
      challenge_test_cases: [
        { input: "1000\n2\nhosted closed 5\nselfhost open 20000 1", expected_output: "hosted 5000\nselfhost 21000\ncheapest hosted", description: "Below the crossover, the hosted (closed) option is cheaper." },
        { input: "10000\n2\nhosted closed 5\nselfhost open 20000 1", expected_output: "hosted 50000\nselfhost 30000\ncheapest selfhost", description: "Above the crossover, self-hosting amortizes its fixed cost and wins." },
        { input: "5000\n2\nhosted closed 5\nselfhost open 20000 1", expected_output: "hosted 25000\nselfhost 25000\ncheapest hosted", description: "Exactly at the crossover both cost 25000; the lexicographically smaller name wins." }
      ]
    },
    {
      id: "ai-22-l7",
      project_id: "ai-22",
      order: 7,
      title: "Routing Between Models",
      concept: "Routing",
      xp_reward: 10,
      explanation: `Most support emails are easy: "What are your hours?" A cheap, fast model nails them. Every so often a gnarly multi-part complaint arrives that the cheap model fumbles. Instead of sending *every* email to an expensive model just in case, smart systems try the cheap one first and **escalate** only the hard cases to a stronger model. That's a cascade — and it can cut costs dramatically.

## What it is

A **cascade** (or escalation routing) sends a request to a **cheap-fast model first**. If that model handles it confidently, you're done — cheap and quick. If the input looks too hard, or the cheap model's answer fails a confidence check, you **escalate**: re-run the request on a **stronger, pricier model**.

This builds on lesson 3's task routing, but with a twist. Static routing decides the tier *upfront* by task type. A cascade decides *dynamically*, often after the cheap model has already taken a swing.

## How it works

The pattern is "try cheap, escalate on hard":

\`\`\`python
def cascade(difficulty, threshold, cheap_cost, strong_cost):
    # always pay the cheap model first
    cost = cheap_cost
    if difficulty > threshold:
        # the cheap model can't handle it -> escalate to the strong model
        cost += strong_cost
        return "escalated", cost
    return "cheap", cost

print(cascade(3, 5, 1, 10))  # ('cheap', 1)      -> handled cheaply
print(cascade(8, 5, 1, 10))  # ('escalated', 11) -> cheap try + strong call
\`\`\`

Notice the cost of an escalated request is the cheap call **plus** the strong call — you pay twice when you escalate. The math only works because *most* requests stay cheap, so the rare double-charge averages out tiny.

## Why it matters

Cascades shine when difficulty is uneven:

- **You pay strong-model prices only for hard inputs.** If 90% of traffic is easy, 90% runs at the cheap price.
- **Latency stays low on the common path.** Most users get the fast model's quick reply; only the hard cases wait for the big model.
- **Escalation isn't free.** Every escalated request pays for both models, so a cascade only wins when easy requests dominate. If everything is hard, skip the cheap step and route straight to strong.

## The mental model to keep

Try cheap first, escalate the hard ones. **A cascade bets that most inputs are easy** — when that bet holds, you get big-model quality on the hard cases at small-model cost on average.`,
      key_terms: [
        { term: "Cascade", definition: "A routing pattern that tries a cheap model first and escalates hard inputs to a stronger one." },
        { term: "Escalation", definition: "Re-running a request on a stronger, pricier model when the cheap model can't handle it." },
        { term: "Escalation threshold", definition: "The difficulty level above which a request is sent to the strong model instead of being handled cheaply." }
      ],
      callouts: [
        { type: "analogy", title: "Front-desk triage, then the specialist", content: "A front-desk clerk handles most questions instantly. Only the tricky ones get bumped to the expensive specialist. A cascade does the same: the cheap model takes everything first, and only the hard cases reach the big model.", position: "before" },
        { type: "warning", title: "Escalating costs you twice", content: "An escalated request pays for the cheap attempt AND the strong call. A cascade only saves money when easy requests dominate. If most inputs are hard, the double-charges pile up — route straight to the strong model instead.", position: "after" }
      ],
      concept_diagram: {
        title: "How a cascade routes a request",
        steps: [
          { label: "Request arrives", desc: "Send it to the cheap, fast model first." },
          { label: "Check difficulty", desc: "Is it within the cheap model's ability?" },
          { label: "Easy: done", desc: "Cheap model's answer is good enough — stop here." },
          { label: "Hard: escalate", desc: "Re-run on the strong model; pay for both calls." }
        ]
      },
      inline_quizzes: [
        {
          question: "In a cascade, what happens to a request the cheap model can't handle?",
          options: ["It is dropped", "It is escalated to a stronger, pricier model", "It is sent back to the user unanswered"],
          correct_index: 1,
          explanation: "Hard requests that exceed the cheap model's ability are escalated to a stronger model."
        }
      ],
      quiz_questions: [
        {
          question: "Why does a cascade save money compared to sending every request to the strong model?",
          options: [
            "The strong model is secretly free",
            "Most requests are easy and stay on the cheap model, so only the rare hard ones pay strong-model prices",
            "Cascades skip answering hard requests",
            "Cheap models are always more accurate"
          ],
          correct_index: 1,
          explanation: "When easy requests dominate, the bulk of traffic runs cheaply and only the minority of hard cases incurs the strong model's cost."
        },
        {
          question: "What is the cost of a single ESCALATED request in a cascade?",
          options: [
            "Just the strong model's cost",
            "Just the cheap model's cost",
            "The cheap model's cost plus the strong model's cost",
            "Nothing, because escalation is free"
          ],
          correct_index: 2,
          explanation: "You pay for the cheap attempt first and then the strong call, so an escalated request is charged for both."
        },
        {
          question: "When is a cascade a BAD idea?",
          options: [
            "When almost every request is hard, so most pay the double cheap-plus-strong cost",
            "When most requests are easy",
            "When the cheap model is fast",
            "When you have lots of traffic"
          ],
          correct_index: 0,
          explanation: "If nearly everything escalates, you pay for both models on most requests. Then it's cheaper to route straight to the strong model."
        }
      ],
      participation_activities: [
        {
          activity_title: "Cascade check",
          questions: [
            { question: "A cascade tries the strong, expensive model first and falls back to the cheap one.", type: "true_false", correct_answer: "false", explanation: "It's the reverse: the cheap-fast model goes first, and only hard inputs escalate to the strong model." },
            { question: "Re-running a request on a stronger model when the cheap one can't handle it is called ______.", type: "fill_in", correct_answer: "escalation", explanation: "Escalation sends the hard cases up to a pricier, more capable model." }
          ]
        }
      ],
      starter_code: `# A cascade: try the cheap model, escalate hard inputs to the strong model.
threshold = 5      # difficulty above this escalates
cheap_cost = 1
strong_cost = 10

requests = [3, 8, 5, 9]  # difficulty of each request

# TODO: for each request, decide cheap vs escalated and total the cost.
total = 0
print("running cascade")
`,
      solution_code: `threshold = 5
cheap_cost = 1
strong_cost = 10

requests = [3, 8, 5, 9]

total = 0
print("running cascade")
for difficulty in requests:
    cost = cheap_cost
    if difficulty > threshold:
        cost += strong_cost
        label = "escalated"
    else:
        label = "cheap"
    total += cost
    print(f"difficulty {difficulty}: {label} (cost {cost})")
print("total cost:", total)
`,
      expected_output: `running cascade
difficulty 3: cheap (cost 1)
difficulty 8: escalated (cost 11)
difficulty 5: cheap (cost 1)
difficulty 9: escalated (cost 11)
total cost: 24`,
      step_throughs: [
        {
          title: "one request flowing through a cascade",
          steps: [
            { label: "Send to the cheap model", detail: "Every request hits the cheap-fast model first — you always pay this small cost.", code: 'cost = cheap_cost  # 1' },
            { label: "Judge the difficulty", detail: "Compare the input's difficulty to the escalation threshold.", code: 'difficulty = 8; threshold = 5  # 8 > 5 -> too hard' },
            { label: "Escalate the hard one", detail: "It exceeds the threshold, so re-run on the strong model and add its cost.", code: 'cost += strong_cost  # 1 + 10 = 11' },
            { label: "Return the answer", detail: "The strong model's answer goes back to the user. Easy requests would have stopped at step 1 for cost 1.", code: 'return "escalated", 11' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Cheap cost 1, strong cost 10, threshold 5. A request has difficulty 2. What's its cost and route?",
          steps: [
            "The cheap model runs first, costing 1.",
            "Difficulty 2 is at or below the threshold of 5, so it does not escalate.",
            "The cheap model's answer is accepted; total cost is just 1."
          ],
          output: "Handled cheaply: route 'cheap', cost 1."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "100 requests: 90 are easy (difficulty below threshold), 10 are hard (escalate). Cheap costs 1, strong costs 10. What's the total cost, and how does it compare to sending all 100 straight to the strong model?",
          steps: [
            "All 100 requests pay the cheap cost first: 100 * 1 = 100.",
            "The 10 hard ones also pay the strong cost: 10 * 10 = 100.",
            "Cascade total = 100 + 100 = 200.",
            "Sending all 100 straight to strong = 100 * 10 = 1000, so the cascade costs one-fifth as much."
          ],
          output: "Cascade total 200 vs 1000 for all-strong — about 5x cheaper because easy requests dominate."
        }
      ],
      comparison_tables: [
        {
          title: "always-strong vs cascade (90% easy traffic)",
          columns: ["Aspect", "Always strong model", "Cascade (cheap first)"],
          rows: [
            { cells: ["Cost on easy requests", "Full strong price", "Just the cheap price"] },
            { cells: ["Cost on hard requests", "Strong price", "Cheap + strong price"] },
            { cells: ["Latency on common path", "Slower big model", "Fast cheap model"] },
            { cells: ["Best when", "Most inputs are hard", "Most inputs are easy"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "stays on cheap model vs escalates to strong model",
          bins: [
            { id: "cheap", label: "Handled by cheap model" },
            { id: "escalate", label: "Escalated to strong model" }
          ],
          items: [
            { id: "i1", text: "A one-line FAQ about store hours", bin: "cheap" },
            { id: "i2", text: "A tangled multi-part legal complaint", bin: "escalate" },
            { id: "i3", text: "Detecting the language of a short message", bin: "cheap" },
            { id: "i4", text: "Reasoning through a 30-page contract dispute", bin: "escalate" },
            { id: "i5", text: "Tagging a review as positive or negative", bin: "cheap" },
            { id: "i6", text: "Debugging a subtle bug across many files", bin: "escalate" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a cascade only save money when most requests are easy?",
          sampleAnswer: "In a cascade, every request pays the cheap model first, and the hard ones pay the strong model on top of that — so an escalated request costs more than going straight to the strong model. The savings come entirely from the easy requests that stop at the cheap model. If most requests are easy, the bulk of traffic runs cheaply and the rare double-charges barely matter. But if most requests escalate, you're paying for two models nearly every time, and it would be cheaper to skip the cheap step."
        }
      ],
      hints: [
        "Start each request's cost at cheap_cost — the cheap model always runs first.",
        "If difficulty > threshold, add strong_cost and label it 'escalated'.",
        "Accumulate each request's cost into total, and print the running label per request."
      ],
      challenge_title: "Cascade Router",
      challenge_description: "Run a two-stage cascade over a request stream: try the cheap model on everything, escalate only the hard inputs to the strong model, and report the load split and total bill — then prove the cascade beat going all-strong.",
      challenge_story: "Your gateway fronts two models: a **cheap-fast** one and a **strong-expensive** one. Rather than route by task type upfront, you run a **cascade**: every request hits the cheap model first, and only requests whose **difficulty** exceeds an **escalation threshold** get re-run on the strong model. An escalated request pays for *both* calls; an easy one pays only the cheap call. Process the day's request stream, decide cheap-vs-escalate for each, and report how many escalated and what it all cost — plus what it *would* have cost to send everything straight to the strong model, so the team can see the savings.",
      challenge_statement: "You are given the cheap call cost, the strong call cost, an escalation threshold, and a stream of requests (each a name and a difficulty). For each request:\n\n1. It always pays the **cheap** cost first.\n2. If its difficulty is **strictly greater than** the threshold, it **escalates**: it also pays the strong cost, and you print \`<name> escalated\`.\n3. Otherwise it stays on the cheap model: print \`<name> cheap\`.\n\nAfter the stream, print \`escalations <count>\` (how many requests escalated), then \`total <T>\` (the cascade's total cost), then \`allstrong <S>\` (what it would have cost to send every request straight to the strong model: strong cost times the number of requests).",
      challenge_input_format: "The first line has three integers `cheap strong threshold`: the cheap call cost, the strong call cost, and the escalation threshold.\n\nThe second line has an integer `q`: the number of requests.\n\nEach of the next `q` lines has a request name (no spaces) and an integer difficulty.",
      challenge_output_format: "For each request in input order, a line `<name> cheap` or `<name> escalated`. Then `escalations <count>`, then `total <T>` (cascade cost), then `allstrong <S>` (all-strong cost).",
      challenge_constraints: [
        "1 ≤ cheap ≤ strong ≤ 1000000",
        "0 ≤ threshold ≤ 1000000",
        "1 ≤ q ≤ 100000",
        "0 ≤ difficulty ≤ 1000000",
      ],
      challenge_examples: [
        { input: "1 10 5\n3\nr1 3\nr2 8\nr3 5", output: "r1 cheap\nr2 escalated\nr3 cheap\nescalations 1\ntotal 13\nallstrong 30", explanation: "r1 (3 ≤ 5) and r3 (5 ≤ 5) stay cheap at 1 each. r2 (8 > 5) escalates: 1 + 10 = 11. Cascade total 1+11+1=13. All-strong would be 3*10=30." },
        { input: "2 20 4\n2\na 9\nb 1", output: "a escalated\nb cheap\nescalations 1\ntotal 24\nallstrong 40", explanation: "a (9 > 4) escalates: 2 + 20 = 22. b (1 ≤ 4) stays cheap at 2. Total 24. All-strong would be 2*20=40." },
      ],
      challenge_notes: "The threshold is exclusive (`>`), so a request sitting exactly on the threshold stays on the cheap model — only strictly-harder inputs escalate. The `allstrong` figure is the whole point: comparing it to `total` shows how much the cascade saved by keeping easy traffic cheap. When most requests are hard, you'll notice `total` creeping toward (or past) the all-strong cost — the signal to drop the cheap step.",
      challenge_hints: [
        "Start every request's cost at `cheap`; add `strong` only when difficulty `>` threshold.",
        "Count escalations and accumulate the cascade total as you scan the stream.",
        "The all-strong cost is simply `strong * q` — the strong cost paid on every request.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    cheap, strong, threshold = map(int, data[idx].split())
    idx += 1
    q = int(data[idx].strip())
    idx += 1
    # TODO: for each request, pay cheap first and add strong if difficulty > threshold.
    #       Print "<name> cheap" or "<name> escalated", then the escalation count,
    #       the cascade total, and the all-strong cost (strong * q).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    cheap, strong, threshold = map(int, data[idx].split())
    idx += 1
    q = int(data[idx].strip())
    idx += 1
    total = 0
    escalations = 0
    out = []
    for _ in range(q):
        parts = data[idx].split()
        idx += 1
        name = parts[0]
        difficulty = int(parts[1])
        cost = cheap
        if difficulty > threshold:
            cost += strong
            escalations += 1
            out.append(f"{name} escalated")
        else:
            out.append(f"{name} cheap")
        total += cost
    print("\\n".join(out))
    print(f"escalations {escalations}")
    print(f"total {total}")
    print(f"allstrong {strong * q}")

main()
`,
      challenge_test_cases: [
        { input: "1 10 5\n3\nr1 3\nr2 8\nr3 5", expected_output: "r1 cheap\nr2 escalated\nr3 cheap\nescalations 1\ntotal 13\nallstrong 30", description: "Only the difficulty-8 request escalates; cascade is far cheaper than all-strong." },
        { input: "2 20 4\n2\na 9\nb 1", expected_output: "a escalated\nb cheap\nescalations 1\ntotal 24\nallstrong 40", description: "Mixed traffic: one escalation, cascade total below all-strong." },
        { input: "1 5 3\n3\nx 10\ny 9\nz 8", expected_output: "x escalated\ny escalated\nz escalated\nescalations 3\ntotal 18\nallstrong 15", description: "When everything escalates, the cascade total (18) exceeds all-strong (15) — the signal to skip the cheap step." }
      ]
    },
    {
      id: "ai-22-l8",
      project_id: "ai-22",
      order: 8,
      title: "Staying Swap-Ready",
      concept: "Abstraction",
      xp_reward: 10,
      explanation: `Models improve every few months. A cheaper, smarter tier drops, and the teams that win are the ones who can adopt it in an afternoon instead of a quarter. The difference isn't luck — it's an **abstraction**: a thin layer between your app and whichever model it uses, so swapping providers is a config change, not a rewrite. This is the payoff of everything in this module.

## What it is

A **provider abstraction** is a single interface your whole app talks to — something like \`generate(prompt)\` — instead of calling a specific provider's SDK directly all over the codebase. Behind that interface lives an **adapter** that translates your generic call into whatever the active provider expects.

Combine that with a **registry**: a lookup of available providers, plus one **active** provider id you can change in one place. Your app calls the interface; the registry decides which real model runs.

## How it works

The whole app talks to one interface and never names a provider directly:

\`\`\`python
registry = {
    "fast":  {"cost": 4},   # one adapter per provider
    "smart": {"cost": 7},
}
active = "fast"  # change THIS one line to swap the whole app

def generate(prompt):
    provider = registry[active]   # interface hides which model runs
    return f"[{active}] answered: {prompt}"  # adapter does the real call

print(generate("hi"))  # [fast] answered: hi
active = "smart"        # one-line swap, zero other changes
print(generate("hi"))  # [smart] answered: hi
\`\`\`

The application code calling \`generate\` never changes. To switch models, you flip \`active\`. To add a brand-new provider, you write one adapter and register it — the rest of the app doesn't notice.

## Why it matters

This is what makes lessons 1-7 actually usable:

- **Swapping is one line.** Tiering, routing, and eval-driven switches all become trivial when the model id lives behind an interface.
- **No vendor lock-in.** Because nothing hardcodes a provider, no single company can trap you. The id is just a string you own.
- **New providers slot in.** Adding a model means writing one adapter, not touching every call site.
- **Routing lives here too.** A cascade or task router is just code that picks which registered provider to call — clean because the interface is uniform.

## The mental model to keep

Talk to an **interface, not a model.** Put one thin layer between your app and the provider, keep the active id in one place, and you stay swap-ready — free to adopt whatever's best, whenever it ships.`,
      key_terms: [
        { term: "Provider abstraction", definition: "A single interface your app calls (like generate(prompt)) instead of any specific provider's SDK directly." },
        { term: "Adapter", definition: "A small piece of code that translates your generic call into what one specific provider expects." },
        { term: "Registry", definition: "A lookup of available providers plus one active id, so swapping models is a one-place change." }
      ],
      callouts: [
        { type: "analogy", title: "A universal power outlet", content: "An abstraction is like a wall socket: your laptop plugs into the same outlet anywhere, and the wiring behind it handles the differences. Your app plugs into one generate() call; the adapter behind it deals with each provider's quirks.", position: "before" },
        { type: "tip", title: "One id, one place", content: "Keep the active provider id in a single variable or config value. Then switching models, running an eval, or rolling back is one edit — not a hunt through fifty files. That single line is what keeps you swap-ready.", position: "after" }
      ],
      concept_diagram: {
        title: "How an abstraction keeps you swap-ready",
        steps: [
          { label: "App calls the interface", desc: "Code calls generate(prompt), never a specific SDK." },
          { label: "Registry picks the provider", desc: "The active id selects which adapter runs." },
          { label: "Adapter does the real call", desc: "It translates to that provider's API." },
          { label: "Swap by changing the id", desc: "Flip the active id; the app code is untouched." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the main benefit of putting a provider abstraction between your app and the model?",
          options: ["It makes the model smarter", "Swapping or adding models becomes a small, localized change instead of a rewrite", "It removes the need to pay for the model"],
          correct_index: 1,
          explanation: "An abstraction centralizes the model choice, so switching providers is a config change rather than edits scattered across the codebase."
        }
      ],
      quiz_questions: [
        {
          question: "Your app calls a specific provider's SDK directly in 40 different functions. A better model launches. What's the problem?",
          options: [
            "Nothing — that's the recommended design",
            "Switching means editing all 40 call sites and risking a missed one, so you'll avoid switching at all",
            "The new model won't work with Python",
            "You can never have more than one provider"
          ],
          correct_index: 1,
          explanation: "Hardcoding a provider everywhere makes switching a risky, tedious chore — exactly the friction an abstraction removes."
        },
        {
          question: "With a provider abstraction and a registry, how do you switch the whole app to a new model?",
          options: [
            "Rewrite every function that calls the model",
            "Change the single active provider id; the app code that calls the interface stays the same",
            "Retrain the model from scratch",
            "Delete and rebuild the app"
          ],
          correct_index: 1,
          explanation: "Because the app talks to one interface, swapping is just changing the active id in one place."
        },
        {
          question: "What is an 'adapter' in this design?",
          options: [
            "A cable that connects two computers",
            "Code that translates your generic generate() call into one specific provider's API",
            "The user interface of the app",
            "A benchmark for ranking models"
          ],
          correct_index: 1,
          explanation: "An adapter bridges your uniform interface and a particular provider's SDK, so the rest of the app stays provider-neutral."
        }
      ],
      participation_activities: [
        {
          activity_title: "Abstraction check",
          questions: [
            { question: "Hardcoding one provider's SDK directly across many functions makes switching models easier.", type: "true_false", correct_answer: "false", explanation: "It makes switching harder — you'd have to edit every call site. An abstraction centralizes the choice." },
            { question: "Keeping the model choice behind one interface so you can switch providers easily is called provider ______.", type: "fill_in", correct_answer: "abstraction", explanation: "A provider abstraction lets your app stay swap-ready." }
          ]
        }
      ],
      starter_code: `# A provider registry behind one interface. Swapping is a one-line change.
registry = {
    "fast":  {"cost": 4},
    "smart": {"cost": 7},
}
active = "fast"

def generate(prompt):
    # The app calls this; it never names a provider directly.
    return f"[{active}] {prompt}"

# TODO: call generate once, switch active to "smart", then call it again.
print(generate("hello"))
`,
      solution_code: `registry = {
    "fast":  {"cost": 4},
    "smart": {"cost": 7},
}
active = "fast"

def generate(prompt):
    return f"[{active}] {prompt}"

print(generate("hello"))
active = "smart"
print(generate("hello"))
`,
      expected_output: `[fast] hello
[smart] hello`,
      step_throughs: [
        {
          title: "swapping models behind one interface",
          steps: [
            { label: "App calls the interface", detail: "Every part of the app calls generate(prompt). It never imports or names a specific provider.", code: 'answer = generate("hi")  # provider-neutral' },
            { label: "Registry resolves the active id", detail: "The interface looks up which registered provider is currently active.", code: 'active = "fast"; provider = registry[active]' },
            { label: "Adapter makes the real call", detail: "The adapter for that provider translates the generic call into its API and returns the result.", code: 'return adapter_for(active).call(prompt)' },
            { label: "Swap by flipping the id", detail: "Change active to a different registered provider. Every call site now uses it, untouched.", code: 'active = "smart"  # whole app switched in one line' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your app calls generate(prompt) everywhere, and the active provider is stored in one variable. A cheaper provider launches. How many lines must you change to switch?",
          steps: [
            "Every call site uses the same generate() interface, so none of them mention the provider.",
            "The only place the provider is named is the single active id variable.",
            "Switching is changing that one variable to the new provider's id."
          ],
          output: "One line — flip the active provider id; the rest of the app is untouched."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You want to add a brand-new provider to a swap-ready app and route easy tasks to it. What do you do, and why doesn't the rest of the app change?",
          steps: [
            "Write one adapter for the new provider that implements the same generate() interface.",
            "Register it in the registry under a new id so it's available to select.",
            "Update your router so easy tasks pick the new provider's id — that's just choosing which registered provider to call.",
            "Because every call site talks to the uniform interface, none of them needs to know a new provider exists."
          ],
          output: "Add one adapter, register it, and point the router at its id — the interface keeps the rest of the app unchanged."
        }
      ],
      comparison_tables: [
        {
          title: "hardcoded provider vs abstracted provider",
          columns: ["Aspect", "Hardcoded everywhere", "Behind an abstraction"],
          rows: [
            { cells: ["Switching models", "Edit every call site", "Change one active id"] },
            { cells: ["Adding a provider", "Touch many functions", "Write one adapter, register it"] },
            { cells: ["Vendor lock-in", "High — provider is baked in", "Low — id is a string you own"] },
            { cells: ["Risk of a missed edit", "High", "Near zero"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "keeps you swap-ready vs creates lock-in",
          bins: [
            { id: "ready", label: "Keeps you swap-ready" },
            { id: "lockin", label: "Creates lock-in" }
          ],
          items: [
            { id: "i1", text: "Calling one generate() interface everywhere", bin: "ready" },
            { id: "i2", text: "Importing a provider's SDK directly in 40 files", bin: "lockin" },
            { id: "i3", text: "Storing the active provider id in one config value", bin: "ready" },
            { id: "i4", text: "Sprinkling a provider-specific model name across the code", bin: "lockin" },
            { id: "i5", text: "Adding a new model by writing one adapter", bin: "ready" },
            { id: "i6", text: "Hardcoding response parsing for one provider's exact format", bin: "lockin" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how does a provider abstraction turn every idea from this module (tiering, routing, eval-driven switching) from theory into something you can actually do?",
          sampleAnswer: "All of this module's advice — pick the right tier, route by difficulty, switch when an eval says a model wins — assumes you can change which model runs cheaply. A provider abstraction makes that true: the app talks to one interface, and the active provider lives in one place, so swapping or routing is just choosing an id. Without it, every smart decision would require rewriting scattered call sites, so you'd avoid making them. With it, adopting a better or cheaper model is an afternoon's work, and you're never locked to one vendor."
        }
      ],
      hints: [
        "generate() reads the global 'active' to decide which provider label to use.",
        "Call generate('hello') once before changing anything.",
        "Reassign active = 'smart', then call generate('hello') again to see the swap."
      ],
      challenge_title: "Provider Registry",
      challenge_description: "Build the swap-ready core of a model gateway: a registry of providers behind one interface, where calls always hit the active provider and switching is a single command — the abstraction that makes everything else in this module usable.",
      challenge_story: "You're building the thin layer that keeps your app **swap-ready**. A **registry** holds every available provider and its per-call cost, and one **active** provider handles all traffic. Your app issues two kinds of operations: a **call** (run the active provider on a request, paying its cost) and a **switch** (change the active provider — the one-line swap that, in a real app, redirects the entire system). If someone tries to switch to a provider that isn't registered, you reject it and keep the current one. Process the operation log, report each step, and total the bill — proving the interface let you swap models mid-stream without touching call logic.",
      challenge_statement: "You are given a registry of providers (each a name and a per-call cost), a default **active** provider, and a sequence of operations. Process each operation in order:\n\n- \`call\`: the active provider handles a request. Add its cost to the running total and print \`call <active> <cost>\`.\n- \`switch <name>\`: if \`<name>\` is a registered provider, make it active and print \`switched to <name>\`. If it is **not** registered, print \`unknown <name>\` and leave the active provider unchanged.\n\nAfter all operations, print \`calls <count>\` (how many \`call\` operations ran) and \`total <T>\` (the summed cost of those calls).",
      challenge_input_format: "The first line is an integer `p`: the number of providers. Each of the next `p` lines has a provider name (no spaces) and an integer cost.\n\nThe next line is the default active provider's name.\n\nThe next line is an integer `n`: the number of operations. Each of the next `n` lines is either `call` or `switch <name>`.",
      challenge_output_format: "For each operation in order: `call <active> <cost>`, `switched to <name>`, or `unknown <name>`. Then a line `calls <count>`, then a line `total <T>`.",
      challenge_constraints: [
        "1 ≤ p ≤ 1000",
        "1 ≤ cost ≤ 1000000",
        "1 ≤ n ≤ 100000",
        "The default active provider is always one of the registered providers.",
      ],
      challenge_examples: [
        { input: "2\ngpt 5\nclaude 4\ngpt\n4\ncall\nswitch claude\ncall\ncall", output: "call gpt 5\nswitched to claude\ncall claude 4\ncall claude 4\ncalls 3\ntotal 13", explanation: "First call uses the default gpt (5). After switching to claude, the next two calls each cost 4. Three calls total 5+4+4=13." },
        { input: "2\na 3\nb 7\na\n3\ncall\nswitch zzz\ncall", output: "call a 3\nunknown zzz\ncall a 3\ncalls 2\ntotal 6", explanation: "`zzz` isn't registered, so the switch is rejected and `a` stays active. Both calls use a (3) for a total of 6." },
      ],
      challenge_notes: "This is the whole point of an abstraction: the `call` operations never name a provider — they just hit whatever is active, exactly like an app that talks to one `generate()` interface. Rejecting an unknown `switch` instead of crashing mirrors real safety: a bad config shouldn't take the system down, it should keep serving with the current provider. Storing providers in a dict keeps every lookup O(1), which matters when `n` reaches 100000 operations.",
      challenge_hints: [
        "Store the providers in a dict mapping name to cost so lookups and membership checks are fast.",
        "Track the active provider in a variable; a `switch` only updates it if the target name is in the dict.",
        "On each `call`, add the active provider's cost to a running total and count it; print the per-op lines as you go.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    p = int(data[idx].strip())
    idx += 1
    # TODO: read p providers (name + cost), the default active provider, then
    #       process each operation: "call" pays the active cost; "switch <name>"
    #       changes active if registered else prints "unknown <name>".
    #       Finally print "calls <count>" and "total <T>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    p = int(data[idx].strip())
    idx += 1
    cost_of = {}
    for _ in range(p):
        parts = data[idx].split()
        idx += 1
        cost_of[parts[0]] = int(parts[1])
    active = data[idx].strip()
    idx += 1
    n = int(data[idx].strip())
    idx += 1
    total = 0
    calls = 0
    out = []
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        op = parts[0]
        if op == "switch":
            target = parts[1]
            if target in cost_of:
                active = target
                out.append(f"switched to {target}")
            else:
                out.append(f"unknown {target}")
        else:
            total += cost_of[active]
            calls += 1
            out.append(f"call {active} {cost_of[active]}")
    print("\\n".join(out))
    print(f"calls {calls}")
    print(f"total {total}")

main()
`,
      challenge_test_cases: [
        { input: "2\ngpt 5\nclaude 4\ngpt\n4\ncall\nswitch claude\ncall\ncall", expected_output: "call gpt 5\nswitched to claude\ncall claude 4\ncall claude 4\ncalls 3\ntotal 13", description: "A mid-stream switch redirects later calls without changing call logic." },
        { input: "2\na 3\nb 7\na\n3\ncall\nswitch zzz\ncall", expected_output: "call a 3\nunknown zzz\ncall a 3\ncalls 2\ntotal 6", description: "An unknown switch target is rejected and the active provider stays put." },
        { input: "3\nx 2\ny 9\nz 1\ny\n5\ncall\nswitch z\ncall\nswitch x\ncall", expected_output: "call y 9\nswitched to z\ncall z 1\nswitched to x\ncall x 2\ncalls 3\ntotal 12", description: "Two valid switches change the active provider; three calls total 9+1+2=12." }
      ]
    }
  ]
};
