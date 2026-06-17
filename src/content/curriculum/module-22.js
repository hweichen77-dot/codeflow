export default {
  project: {
    id: "ai-22",
    title: "Choosing the Right Model",
    description: "Learn to pick the right model tier for each task by trading off cost, latency, and quality instead of always reaching for the biggest one.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 4,
    tags: ["model-selection", "latency", "cost", "quality", "fundamentals"],
    order: 22,
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
      challenge_title: "Find the cheapest tier",
      challenge_description: "Given the tiers dict, write code that finds and prints the name of the tier with the lowest price. Print it as: cheapest tier: <name>.",
      challenge_starter_code: `tiers = {
    "small":  {"smarts": 3, "speed": 9, "price": 1},
    "medium": {"smarts": 6, "speed": 6, "price": 4},
    "large":  {"smarts": 9, "speed": 3, "price": 12},
}
# TODO: find the tier with the lowest "price" and print its name.
`,
      challenge_solution_code: `tiers = {
    "small":  {"smarts": 3, "speed": 9, "price": 1},
    "medium": {"smarts": 6, "speed": 6, "price": 4},
    "large":  {"smarts": 9, "speed": 3, "price": 12},
}

cheapest = min(tiers, key=lambda name: tiers[name]["price"])
print(f"cheapest tier: {cheapest}")
`,
      challenge_test_cases: [
        { input: "(no input)", expected_output: "cheapest tier: small", description: "The small tier has price 1, the lowest of the three." }
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
      challenge_title: "Score the trade-off",
      challenge_description: "Given small and large tiers, write a function value(tier, w_quality, w_cost) that returns tier['quality'] * w_quality - tier['cost'] * w_cost. Using w_quality=1 and w_cost=0.5, print each tier's score and which one wins (higher score).",
      challenge_starter_code: `small = {"name": "small", "cost": 1, "quality": 6}
large = {"name": "large", "cost": 12, "quality": 9}
# TODO: define value(tier, w_quality, w_cost) and print each score, then the winner.
`,
      challenge_solution_code: `small = {"name": "small", "cost": 1, "quality": 6}
large = {"name": "large", "cost": 12, "quality": 9}

def value(tier, w_quality, w_cost):
    return tier["quality"] * w_quality - tier["cost"] * w_cost

s = value(small, 1, 0.5)
l = value(large, 1, 0.5)
print(f"small score: {s}")
print(f"large score: {l}")
winner = small["name"] if s >= l else large["name"]
print(f"winner: {winner}")
`,
      challenge_test_cases: [
        { input: "w_quality=1, w_cost=0.5", expected_output: "small score: 5.5\nlarge score: 3.0\nwinner: small", description: "small: 6 - 0.5 = 5.5; large: 9 - 6 = 3.0; small wins." }
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
      challenge_title: "Build a task router",
      challenge_description: "Write route(task) that returns 'small' for tasks in {'classify','extract'}, 'large' for tasks in {'reason','synthesize'}, and 'medium' otherwise. Then route a list of tasks ['classify','reason','translate'] and print each as 'task -> tier'.",
      challenge_starter_code: `tasks = ["classify", "reason", "translate"]
# TODO: define route(task) and print each "task -> tier".
`,
      challenge_solution_code: `tasks = ["classify", "reason", "translate"]

def route(task):
    if task in {"classify", "extract"}:
        return "small"
    if task in {"reason", "synthesize"}:
        return "large"
    return "medium"

for task in tasks:
    print(f"{task} -> {route(task)}")
`,
      challenge_test_cases: [
        { input: "tasks = ['classify', 'reason', 'translate']", expected_output: "classify -> small\nreason -> large\ntranslate -> medium", description: "classify is easy, reason is hard, translate falls to the medium default." }
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
      challenge_title: "Score and pick the winner",
      challenge_description: "Given an eval_set and a run_model(model_id, text) function, score the models 'small' and 'large' (both answer every case correctly here). Print each as '<id>: X/N', then print 'winner: <id>' choosing the cheaper one (small) when scores tie.",
      challenge_starter_code: `eval_set = [
    {"input": "ping", "expected": "pong"},
    {"input": "hi", "expected": "hello"},
    {"input": "yo", "expected": "sup"},
]

def run_model(model_id, text):
    table = {"ping": "pong", "hi": "hello", "yo": "sup"}
    return table.get(text, "?")

# TODO: score 'small' and 'large', print each "<id>: X/N", then "winner: <id>"
# (pick 'small' when the scores tie, since it is cheaper).
`,
      challenge_solution_code: `eval_set = [
    {"input": "ping", "expected": "pong"},
    {"input": "hi", "expected": "hello"},
    {"input": "yo", "expected": "sup"},
]

def run_model(model_id, text):
    table = {"ping": "pong", "hi": "hello", "yo": "sup"}
    return table.get(text, "?")

scores = {}
for model_id in ["small", "large"]:
    correct = sum(run_model(model_id, c["input"]) == c["expected"] for c in eval_set)
    scores[model_id] = correct
    print(f"{model_id}: {correct}/{len(eval_set)}")

winner = "small" if scores["small"] >= scores["large"] else "large"
print(f"winner: {winner}")
`,
      challenge_test_cases: [
        { input: "(no input)", expected_output: "small: 3/3\nlarge: 3/3\nwinner: small", description: "Both score 3/3; the tie breaks to small because it's cheaper." }
      ]
    }
  ]
};
