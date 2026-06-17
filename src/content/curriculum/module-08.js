export default {
  project: {
    id: "ai-08",
    title: "Fine-Tuning & Evals",
    description: "Stop guessing whether your prompt got better — measure it, and learn when fine-tuning actually beats a good prompt.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 180,
    lessons_count: 5,
    tags: ["fine-tuning", "evals", "prompt-engineering", "testing", "claude-api"],
    order: 8,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-08-l1",
      project_id: "ai-08",
      order: 1,
      title: "Fine-Tune or Just Prompt?",
      concept: "Fine-Tuning",
      xp_reward: 10,
      explanation: `Someone on your team says "the model keeps getting the tone wrong, let's fine-tune it." Nine times out of ten, that's the wrong first move. You probably have a prompt problem, not a model problem — and you're about to spend two weeks and a dataset budget to fix something a paragraph of instructions would have solved in an afternoon.

## What it is

**Fine-tuning** takes a base model and nudges its **weights** using your own examples. You hand it hundreds or thousands of input→output pairs, and it shifts to favor the patterns in your data. The model doesn't gain new knowledge so much as new *habits* — a house style, a rigid output format, a domain vocabulary, a way of refusing.

Contrast that with **prompting**, which changes nothing about the model. You just write better instructions at request time. Same weights, different message. And **few-shot prompting** sits in between: you drop a handful of example input/output pairs straight into the prompt to demonstrate the behavior, no training required.

The mistake teams make is treating fine-tuning as the *default* fix. It's the last resort.

## How it works

The honest decision rule is a ladder — climb it in order, stop at the first rung that works:

1. **Plain prompt.** Write a clear instruction. Test it on real inputs.
2. **Few-shot.** Add 3–5 good examples to the prompt to show, not tell.
3. **Audit the ceiling.** Still failing? Ask: is the task *stable* (same shape every time)? Is volume *high*? Can you collect *300+* clean examples?
4. **Fine-tune.** Only when all of the above are yes, bake the patterns into the weights.

Reach for prompting first. Always. It's faster (minutes vs. days), cheaper (no training run, no dataset to curate), and reversible (edit a string). Fine-tune only when **all** of these hold: you've maxed out prompting, the task is repetitive, you have a few hundred high-quality examples, and example bloat in the prompt (latency + token bill) actually hurts.

\`\`\`python
# Decision in code form
def should_fine_tune(prompt_maxed_out, examples, task_is_stable, high_volume):
    return prompt_maxed_out and examples >= 300 and task_is_stable and high_volume

print(should_fine_tune(True, 500, True, True))   # earns its keep
print(should_fine_tune(False, 9, False, False))  # just prompt it
\`\`\`

## Why it matters

A concrete case where fine-tuning wins: you're classifying support tickets into 12 categories. A few-shot prompt with one example per category hits 84% but costs 2,000 tokens of examples on *every* call, millions of calls a month. Bake those 12 patterns into the weights, drop the examples, and you ship a tiny prompt that's faster, cheaper, and often *more* accurate because the model saw far more than 12 examples during training.

Now flip it: you're writing marketing copy in your founder's voice. The task is fuzzy, "right" is subjective, and you have nine examples. Don't fine-tune. Put those nine in the prompt and iterate. And remember — fine-tuning shifts *habits*, never *facts*. If the model doesn't know your Q3 numbers, no amount of style training will teach them; that's a job for retrieval or just pasting the facts in.

## The mental model to keep

Prompting is writing a memo; fine-tuning is sending someone to a six-month training program. Most teams never need the program — they need a better memo and a way to measure it, which is the rest of this module.`,
      key_terms: [
        { term: "Fine-tuning", definition: "Updating a base model's weights with your own input→output examples so it adopts new habits, formats, or style." },
        { term: "Few-shot prompting", definition: "Putting a handful of example input/output pairs directly in the prompt to steer behavior without training." },
        { term: "Base model", definition: "The general pretrained model you start from before any task-specific adaptation." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "Hiring vs. writing a memo",
          content: "Prompting is writing a clear memo to a smart contractor — instant, editable. Fine-tuning is sending someone to a 6-month training program so they internalize your house style. Worth it for permanent, repetitive jobs. Overkill for a one-off note.",
          position: "before"
        },
        {
          type: "warning",
          title: "Fine-tuning won't add knowledge",
          content: "If the model doesn't know your company's Q3 numbers, fine-tuning on style examples won't teach them. For fresh facts you want retrieval (RAG) or just put the facts in the prompt — not training.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Which lever to pull",
        steps: [
          { label: "Start", desc: "Write a plain prompt and test it." },
          { label: "Add few-shot", desc: "Drop 3–5 examples into the prompt." },
          { label: "Still failing?", desc: "Check: stable task, high volume, 300+ examples available?" },
          { label: "Yes to all", desc: "Fine-tune to bake patterns into weights." },
          { label: "No", desc: "Keep iterating on the prompt — cheaper and faster." }
        ]
      },
      inline_quizzes: [
        {
          question: "Your model lacks knowledge of last week's product launch. What fixes it?",
          options: ["Fine-tuning on style examples", "Putting the launch facts in the prompt (or RAG)", "Lowering the temperature"],
          correct_index: 1,
          explanation: "Fine-tuning changes habits, not knowledge. Fresh facts belong in the prompt or come from retrieval."
        }
      ],
      quiz_questions: [
        {
          question: "When does fine-tuning most clearly earn its keep?",
          options: [
            "A subjective task with 9 examples",
            "A stable, high-volume task where few-shot examples bloat every prompt",
            "Any task where the model makes occasional mistakes",
            "When you want the model to learn new facts"
          ],
          correct_index: 1,
          explanation: "Stable + high-volume + plenty of examples + costly prompt overhead is the sweet spot for fine-tuning."
        },
        {
          question: "What's the main advantage of prompting over fine-tuning?",
          options: [
            "It always produces higher accuracy",
            "It's faster, cheaper, and reversible",
            "It permanently changes the model's weights",
            "It teaches the model new facts"
          ],
          correct_index: 1,
          explanation: "Prompting edits a string at request time — minutes not days, no training cost, instantly undoable."
        },
        {
          question: "Before fine-tuning, what should you try first?",
          options: [
            "Collect 10,000 examples",
            "A clear prompt, then few-shot with 3–5 examples",
            "Switch to a smaller model",
            "Increase max_tokens"
          ],
          correct_index: 1,
          explanation: "Prompting and few-shot are the cheap first moves. Only escalate to training after they're maxed out."
        }
      ],
      participation_activities: [
        {
          activity_title: "Lever check",
          questions: [
            { question: "Fine-tuning is a good way to teach a model facts it has never seen.", type: "true_false", correct_answer: "false", explanation: "It shifts habits and style, not knowledge. Use the prompt or retrieval for facts." },
            { question: "The cheapest, most reversible way to change model behavior is ______.", type: "fill_in", correct_answer: "prompting", explanation: "Editing the prompt costs nothing to train and is instantly undoable." }
          ]
        }
      ],
      starter_code: `# Fill in the rule: when is fine-tuning worth it?
def should_fine_tune(prompt_maxed_out, examples, task_is_stable, high_volume):
    # return True only when ALL conditions hold
    return False

print(should_fine_tune(True, 500, True, True))
print(should_fine_tune(False, 9, False, False))`,
      solution_code: `def should_fine_tune(prompt_maxed_out, examples, task_is_stable, high_volume):
    return prompt_maxed_out and examples >= 300 and task_is_stable and high_volume

print(should_fine_tune(True, 500, True, True))
print(should_fine_tune(False, 9, False, False))`,
      expected_output: `True
False`,
      step_throughs: [
        {
          title: "the fine-tuning loop: data → train → deploy",
          steps: [
            { label: "Collect examples", detail: "Gather hundreds of clean input→output pairs that show the exact behavior you want. Quality and consistency matter more than raw count.", code: 'data = [{"input": "ticket text", "output": "billing"}, ...]  # 300+ rows' },
            { label: "Train the model", detail: "The base model's weights are nudged over your examples so it favors your patterns. This is the slow, costly step — minutes to hours, a real bill.", code: "ft_model = train(base_model, data)  # weights shift toward your data" },
            { label: "Deploy with a tiny prompt", detail: "The habits now live in the weights, so the prompt drops the bulky examples. Shorter prompt → lower latency and token cost on every call.", code: 'reply = ft_model("ticket text")  # no few-shot examples needed' },
            { label: "Re-eval before trusting", detail: "Run the same eval suite you used on the prompted version. Fine-tuning can regress edge cases, so confirm the number actually went up.", code: "score = run_evals(ft_model)  # did it beat the prompt baseline?" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A team has 40 examples of a subjective brand-voice task and wants the model to match it. Prompt or fine-tune?",
          steps: [
            "Check the example count: 40 is far below the ~300 floor where training has enough signal to learn stable patterns.",
            "Check stability: brand voice is subjective and fuzzy, not a fixed-shape task.",
            "Both signals point the same way — there isn't enough data and the task isn't rigid enough for fine-tuning to pay off."
          ],
          output: "Prompt it: put the 40 examples (or the best handful) in a few-shot prompt and iterate."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A classifier runs 4,000,000 calls/month. Few-shot adds 1,800 example tokens per call at $3 / 1M input tokens. What does the example overhead cost monthly, and does that argue for fine-tuning?",
          steps: [
            "Tokens spent on examples per month = 1,800 x 4,000,000 = 7,200,000,000 tokens.",
            "Cost = 7,200,000,000 / 1,000,000 x $3 = $21,600 per month, just to ship the examples.",
            "Fine-tuning bakes those patterns into the weights, so the deployed prompt can drop the examples entirely.",
            "At this volume the recurring savings dwarf a one-time training run, so the prompt overhead clearly hurts."
          ],
          output: "$21,600/month in example overhead — high volume + stable task means fine-tuning earns its keep."
        }
      ],
      comparison_tables: [
        {
          title: "prompting vs few-shot vs fine-tuning",
          columns: ["Lever", "Changes weights?", "Setup time", "Best when"],
          rows: [
            { cells: ["Prompting", "No", "Minutes", "First try; fast iteration; small volume"] },
            { cells: ["Few-shot", "No", "Minutes", "A few examples steer it; task is demonstrable in 3-5 cases"] },
            { cells: ["Fine-tuning", "Yes", "Hours to days", "Stable + high-volume task, 300+ examples, prompt bloat hurts"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which lever should this scenario pull?",
          bins: [
            { id: "prompt", label: "Prompt / few-shot" },
            { id: "ft", label: "Fine-tune" }
          ],
          items: [
            { id: "i1", text: "9 examples of a subjective copywriting voice", bin: "prompt" },
            { id: "i2", text: "12-category ticket classifier, millions of calls/month, 2k example tokens each", bin: "ft" },
            { id: "i3", text: "One-off task you'll run a handful of times", bin: "prompt" },
            { id: "i4", text: "Stable extraction task with 800 clean labeled pairs at high volume", bin: "ft" },
            { id: "i5", text: "You need the model to know last week's product launch", bin: "prompt" },
            { id: "i6", text: "Rigid JSON output format, same shape every call, prompt examples bloat the bill", bin: "ft" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is fine-tuning the wrong fix when the model 'doesn't know' a fresh fact, even though it feels like the model is 'missing knowledge'?",
          sampleAnswer: "Fine-tuning shifts the model's habits and style, not its store of facts. Training on style examples teaches it how to phrase things, not what last week's numbers are. A fact that isn't in the model's training data has to be supplied at request time through the prompt or retrieval; no amount of style training will conjure it."
        }
      ],
      hints: [
        "All four conditions must be true at once — that means the `and` operator.",
        "The example count needs a threshold; 300 is the floor mentioned in the lesson.",
        "Return the combined boolean expression directly, no if/else needed."
      ],
      challenge_title: "Recommend a strategy",
      challenge_description: "Write recommend(examples, stable, high_volume) that returns 'fine-tune' only when there are at least 300 examples AND the task is stable AND volume is high. Otherwise return 'prompt'.",
      challenge_starter_code: `def recommend(examples, stable, high_volume):
    # return 'fine-tune' or 'prompt'
    pass

print(recommend(500, True, True))
print(recommend(50, True, True))`,
      challenge_solution_code: `def recommend(examples, stable, high_volume):
    if examples >= 300 and stable and high_volume:
        return 'fine-tune'
    return 'prompt'

print(recommend(500, True, True))
print(recommend(50, True, True))`,
      challenge_test_cases: [
        { input: "recommend(500, True, True)", expected_output: "fine-tune", description: "All conditions met → fine-tune." },
        { input: "recommend(50, True, True)", expected_output: "prompt", description: "Too few examples → prompt instead." }
      ]
    },
    {
      id: "ai-08-l2",
      project_id: "ai-08",
      order: 2,
      title: "What an Eval Actually Is",
      concept: "Evals",
      xp_reward: 10,
      explanation: `You tweaked the prompt. Output *feels* better. Does it? You have no idea — and "feels better" is exactly how teams ship regressions with a straight face. One engineer "improves" the system prompt, three customer-facing answers quietly get worse, and nobody notices for a week. An **eval** is the fix: a repeatable test that turns a vague hunch into a number.

## What it is

An **eval** is a unit test for an AI system. It has three parts:

1. **A dataset** — inputs paired with what good looks like (the reference, or **ground truth**).
2. **A task** — run each input through your model + prompt.
3. **A scorer** — compare the model's output to the reference and produce a score.

Run it, get a number like "87% correct." Change the prompt, run it again, see if the number went up or down. That's the whole game. Without it you're flying blind, trusting your memory of a handful of outputs to represent the whole distribution.

## How it works

A normal unit test checks \`add(2, 2) == 4\`. Exact match, one right answer. AI outputs are fuzzy — "The capital is Paris." and "Paris" are both correct — so your **scorer** has to be smarter than \`==\`. You pick a scoring method that fits the task:

- **Exact match** — classification or structured fields where there's one right token.
- **Contains / keyword** — does the answer include the required fact?
- **Fuzzy / similarity** — for free-form text, compare meaning, not characters.
- **LLM-as-judge** — have a model grade the output against a rubric (next lesson).

Then you run it. Don't overthink the first one — ten hand-picked examples beat zero:

\`\`\`python
dataset = [
    {"input": "2+2", "expected": "4"},
    {"input": "capital of France", "expected": "Paris"},
    {"input": "color of the sky", "expected": "blue"},
]

def fake_model(prompt):
    answers = {"2+2": "4", "capital of France": "Paris", "color of the sky": "gray"}
    return answers.get(prompt, "")

passed = sum(1 for row in dataset if fake_model(row["input"]) == row["expected"])
score = passed / len(dataset)
print(f"{passed}/{len(dataset)} passed")
print(f"score: {score:.2f}")
\`\`\`

The model nailed two and missed one (it said the sky is gray). Score: 0.67. Change the prompt, watch the number, and now you have *evidence*.

## Why it matters

Evals are the difference between engineering and guessing. Eyeballing three outputs works; eyeballing the effect of a prompt change across 200 cases does not — your brain anchors on the last good example and you fool yourself. A single number across the whole set is the only honest read. It also makes progress *cumulative*: every improvement is measured against the same yardstick, so you can prove a change helped instead of arguing about it. And it scales — the same suite that catches one regression today catches a hundred over the project's life, automatically, on every commit.

## The mental model to keep

An eval is a unit test that returns a *score* instead of pass/fail. Ten good cases you actually run beats a thousand-row set you keep meaning to build.`,
      key_terms: [
        { term: "Eval", definition: "A repeatable test for an AI system: a dataset of inputs + reference answers, run through the model, and scored." },
        { term: "Ground truth", definition: "The reference 'correct' answer for an input, used to score the model's output." },
        { term: "Scorer", definition: "The function that compares model output to the reference and returns a score (e.g. exact match, similarity, or an LLM judge)." }
      ],
      callouts: [
        {
          type: "insight",
          title: "Vibes don't scale",
          content: "Eyeballing 3 outputs works. Eyeballing the effect of a prompt change across 200 cases does not — your brain anchors on the last good example. A number across the whole set is the only honest read.",
          position: "before"
        },
        {
          type: "tip",
          title: "Start with 10 cases",
          content: "Perfect is the enemy of shipped. A 10-row eval you actually run beats a 1,000-row eval you keep meaning to build. Grow the set as real failures show up.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Anatomy of an eval",
        steps: [
          { label: "Dataset", desc: "Inputs paired with reference answers." },
          { label: "Run task", desc: "Send each input through model + prompt." },
          { label: "Score", desc: "Compare output to reference with a scorer." },
          { label: "Aggregate", desc: "Average the scores into one number." },
          { label: "Compare", desc: "Did the number go up after your change?" }
        ]
      },
      inline_quizzes: [
        {
          question: "Why can't you usually score AI outputs with plain `==`?",
          options: ["Strings are always unequal in Python", "Many different outputs can be equally correct", "The model never returns strings"],
          correct_index: 1,
          explanation: "'Paris' and 'The capital is Paris.' are both right. Exact equality misses correct-but-differently-worded answers."
        }
      ],
      quiz_questions: [
        {
          question: "An eval is best described as:",
          options: [
            "A way to make the model faster",
            "A repeatable test: dataset + task + scorer producing a number",
            "A fine-tuning technique",
            "A logging dashboard"
          ],
          correct_index: 1,
          explanation: "Eval = dataset of inputs/references + running the task + a scorer that yields a measurable score."
        },
        {
          question: "Which scoring method fits a strict classification task best?",
          options: ["Exact match", "LLM-as-judge with a fuzzy rubric", "Human gut feel", "Word count"],
          correct_index: 0,
          explanation: "Classification has one right label per input, so exact match is cheap and exactly right."
        },
        {
          question: "What's the recommended size for your very first eval?",
          options: ["At least 10,000 rows", "Around 10 hand-picked cases", "One example", "It must cover every edge case before use"],
          correct_index: 1,
          explanation: "Ten good cases you actually run beats a huge set you never finish building."
        }
      ],
      participation_activities: [
        {
          activity_title: "Eval basics",
          questions: [
            { question: "An eval turns a subjective 'feels better' into a measurable score.", type: "true_false", correct_answer: "true", explanation: "That's the whole point — replacing vibes with a number you can compare." },
            { question: "The reference 'correct' answer used to score output is called the ground ______.", type: "fill_in", correct_answer: "truth", explanation: "Ground truth is the reference each output is compared against." }
          ]
        }
      ],
      starter_code: `dataset = [
    {"input": "2+2", "expected": "4"},
    {"input": "capital of France", "expected": "Paris"},
    {"input": "color of the sky", "expected": "blue"},
]

def fake_model(prompt):
    answers = {"2+2": "4", "capital of France": "Paris", "color of the sky": "gray"}
    return answers.get(prompt, "")

# Count how many outputs exactly match the expected answer
passed = 0  # fix this
score = 0   # fix this
print(f"{passed}/{len(dataset)} passed")
print(f"score: {score:.2f}")`,
      solution_code: `dataset = [
    {"input": "2+2", "expected": "4"},
    {"input": "capital of France", "expected": "Paris"},
    {"input": "color of the sky", "expected": "blue"},
]

def fake_model(prompt):
    answers = {"2+2": "4", "capital of France": "Paris", "color of the sky": "gray"}
    return answers.get(prompt, "")

passed = sum(1 for row in dataset if fake_model(row["input"]) == row["expected"])
score = passed / len(dataset)
print(f"{passed}/{len(dataset)} passed")
print(f"score: {score:.2f}")`,
      expected_output: `2/3 passed
score: 0.67`,
      step_throughs: [
        {
          title: "how an eval scores a model",
          steps: [
            { label: "Load the dataset", detail: "Each row pairs an input with its ground-truth reference answer. This set defines what 'correct' means.", code: 'dataset = [{"input": "2+2", "expected": "4"}, ...]' },
            { label: "Run the task", detail: "Feed every input through the model + prompt and capture the raw output for that row.", code: 'out = model("2+2")  ->  "4"' },
            { label: "Score each row", detail: "Apply the scorer to compare output against the reference. Exact match gives 1 for a hit, 0 for a miss.", code: 'exact("4", "4") -> 1   |   exact("gray", "blue") -> 0' },
            { label: "Aggregate", detail: "Average the per-row scores into one headline number you can compare across prompt versions.", code: "passed / total = 2 / 3 = 0.67" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "An eval has 20 cases. The model gets 17 exactly right under exact-match scoring. What is the accuracy?",
          steps: [
            "Accuracy = correct cases / total cases.",
            "Plug in the numbers: 17 / 20.",
            "17 / 20 = 0.85."
          ],
          output: "0.85 (85% accuracy)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Prompt A scores 0.82 on a 50-case eval. You change the prompt and Prompt B scores 0.88. How many more cases did B get right, and is that enough to be sure B is better?",
          steps: [
            "Cases right under A = 0.82 x 50 = 41. Under B = 0.88 x 50 = 44.",
            "B got 44 - 41 = 3 more cases right.",
            "Three cases on a 50-row set is a small margin — it could be noise, not a real gain.",
            "To trust the difference you'd grow the eval set or check which specific cases flipped, rather than shipping on a 6-point swing alone."
          ],
          output: "3 more cases right; promising but small — verify on a bigger set before declaring B the winner."
        }
      ],
      comparison_tables: [
        {
          title: "ad-hoc eyeballing vs a real eval",
          columns: ["Property", "Eyeballing outputs", "Running an eval"],
          rows: [
            { cells: ["Repeatable", "No — depends on mood/memory", "Yes — same cases every run"] },
            { cells: ["Scales past a few cases", "No — brain anchors on last example", "Yes — averages the whole set"] },
            { cells: ["Catches regressions", "Rarely, by luck", "On every change, automatically"], highlight: true },
            { cells: ["Output", "A vague feeling", "A number you can compare"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "part of an eval, or not?",
          bins: [
            { id: "yes", label: "Core part of an eval" },
            { id: "no", label: "Not part of an eval" }
          ],
          items: [
            { id: "i1", text: "A dataset of inputs with reference answers", bin: "yes" },
            { id: "i2", text: "A scorer that compares output to reference", bin: "yes" },
            { id: "i3", text: "Running each input through model + prompt", bin: "yes" },
            { id: "i4", text: "Lowering the temperature to make answers shorter", bin: "no" },
            { id: "i5", text: "An aggregate score across the set", bin: "yes" },
            { id: "i6", text: "A faster GPU to reduce latency", bin: "no" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a single number across the whole eval set give a more honest read than reviewing a few outputs by hand?",
          sampleAnswer: "When you review a handful of outputs by hand your judgment anchors on the most recent or most memorable example, so you over-weight it and miss what happened across the rest. A score averages every case equally and is computed the same way each run, so it can't be swayed by which output you happened to look at last. That makes comparisons between prompt versions trustworthy instead of subjective."
        }
      ],
      hints: [
        "Loop over the dataset and compare fake_model(row['input']) with row['expected'].",
        "sum(1 for ... if condition) is a clean way to count matches.",
        "Score is passed divided by len(dataset); format with :.2f for two decimals."
      ],
      challenge_title: "Score an eval run",
      challenge_description: "Write accuracy(outputs, expected) where both are lists of strings. Return the fraction that match exactly, rounded to 2 decimals.",
      challenge_starter_code: `def accuracy(outputs, expected):
    # return fraction matching, rounded to 2 decimals
    pass

print(accuracy(["a", "b", "c"], ["a", "x", "c"]))
print(accuracy(["yes", "no"], ["yes", "no"]))`,
      challenge_solution_code: `def accuracy(outputs, expected):
    matches = sum(1 for o, e in zip(outputs, expected) if o == e)
    return round(matches / len(expected), 2)

print(accuracy(["a", "b", "c"], ["a", "x", "c"]))
print(accuracy(["yes", "no"], ["yes", "no"]))`,
      challenge_test_cases: [
        { input: 'accuracy(["a","b","c"], ["a","x","c"])', expected_output: "0.67", description: "Two of three match." },
        { input: 'accuracy(["yes","no"], ["yes","no"])', expected_output: "1.0", description: "All match → 1.0." }
      ]
    },
    {
      id: "ai-08-l3",
      project_id: "ai-08",
      order: 3,
      title: "Scoring Fuzzy Answers",
      concept: "Scorers",
      xp_reward: 10,
      explanation: `Your model answers "The capital of France is Paris." Your reference says "Paris." Exact match scores that *wrong*. The answer is perfect. The scorer is dumb. Picking the right scorer is most of the work in evals — get it wrong and your number lies to you in both directions.

## What it is

A **scorer** is the function that turns a model output and a reference into a score. There's a whole ladder of them, ordered from strictest to loosest:

- **Exact match** — \`output == expected\`. One acceptable string: a label, an ID, a yes/no. Brutal but unambiguous.
- **Substring / contains** — did the output include the required answer? \`expected.lower() in output.lower()\`. This rescues the Paris case. Great when the model is allowed to be chatty as long as it says the right thing. Watch out: "not Paris" also contains "Paris," so a **contains** scorer can be fooled by negation.
- **Similarity** — for free-form text where wording varies, score how *similar* two strings are. **Jaccard similarity** (word overlap) is the cheap, dependency-free version; **cosine similarity** over embeddings is the production version. Closer meaning, higher score.

## How it works

**Jaccard similarity** is the size of the word-set intersection over the size of the union. Identical word sets score 1.0; no overlap scores 0.0:

\`\`\`python
def jaccard(a, b):
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)

ref = "the capital of france is paris"
print(round(jaccard(ref, "paris is the capital of france"), 2))  # 1.0 — same words
print(round(jaccard(ref, "the capital of france is lyon"), 2))   # 0.71 — one word off
\`\`\`

The first pair has identical word sets, so 1.0. The second swaps "paris" for "lyon" — five shared words out of seven total, so about 0.71. Order is invisible to Jaccard, which is both its strength (robust to rephrasing) and its weakness (it scores "dog bites man" and "man bites dog" identical).

## Why it matters

The scorer choice directly controls whether your number is honest. Too **strict** (exact match on chatty output) and you get *false failures* — correct answers marked wrong, hiding real progress and making you chase ghosts. Too **loose** (contains, fooled by negation) and you get *false passes* — broken outputs marked right, so a regression sails through your eval undetected. Both failure modes corrupt the one number you're trusting to make decisions. A miscalibrated scorer is worse than no eval, because it gives you false confidence.

## The mental model to keep

Pick the **loosest scorer that still bites** — the tightest one that doesn't punish acceptable rewording, and no looser. When no string scorer fits (tone, reasoning, subjective quality), you escalate to an LLM judge, the next lesson.`,
      key_terms: [
        { term: "Substring scorer", definition: "Passes if the reference text appears anywhere inside the model output. Tolerant of chatty answers but vulnerable to negation." },
        { term: "Jaccard similarity", definition: "Size of the word-set intersection divided by the union. 1.0 = identical word sets, 0.0 = no overlap; ignores order." },
        { term: "Cosine similarity", definition: "Production way to compare meaning: measure the angle between two text embedding vectors; closer meaning → higher score." }
      ],
      callouts: [
        {
          type: "warning",
          title: "Contains-scorers fall for negation",
          content: '"The answer is not Paris" contains "Paris" and would wrongly pass a substring scorer. If your task has negations, exact match or an LLM judge is safer.',
          position: "before"
        },
        {
          type: "insight",
          title: "Loosest scorer that still bites",
          content: "Every step looser cuts false failures but risks passing junk. Choose the tightest scorer that doesn't penalize acceptable rewording — and no looser.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Scorer escalation ladder",
        steps: [
          { label: "Exact match", desc: "One right string. Strictest." },
          { label: "Contains", desc: "Right fact appears anywhere in output." },
          { label: "Jaccard / overlap", desc: "Share of words in common, order-free." },
          { label: "Embedding cosine", desc: "Compare meaning via vectors." },
          { label: "LLM judge", desc: "Grade against a rubric when no string scorer fits." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does Jaccard give 'dog bites man' and 'man bites dog' the same score?",
          options: ["It counts letters", "It compares word sets and ignores order", "It always returns 1.0"],
          correct_index: 1,
          explanation: "Jaccard works on the set of words, so word order is invisible to it — its main blind spot."
        }
      ],
      quiz_questions: [
        {
          question: "A model returns 'The capital is Paris.' and the reference is 'Paris'. Which scorer passes it correctly?",
          options: [
            "Exact match",
            "Substring/contains scorer",
            "No scorer can pass it",
            "Word count"
          ],
          correct_index: 1,
          explanation: "'Paris' is a substring of the chatty answer, so contains scores it correctly while exact match fails it."
        },
        {
          question: "What does a Jaccard similarity of 1.0 mean?",
          options: [
            "The strings are byte-for-byte identical",
            "The two texts use exactly the same set of words",
            "The texts share no words",
            "The output is twice as long as the reference"
          ],
          correct_index: 1,
          explanation: "Jaccard hits 1.0 when intersection equals union — identical word sets, regardless of order."
        },
        {
          question: "When should you escalate past string scorers to an LLM judge?",
          options: [
            "Whenever the dataset has more than 10 rows",
            "When quality is subjective and no string comparison captures correctness",
            "Only for classification tasks",
            "Never — string scorers always suffice"
          ],
          correct_index: 1,
          explanation: "Tone, reasoning, and open-ended quality resist string matching, so a rubric-based LLM judge is the tool."
        }
      ],
      participation_activities: [
        {
          activity_title: "Choose a scorer",
          questions: [
            { question: "Exact match is the right scorer for a chatty free-form answer.", type: "true_false", correct_answer: "false", explanation: "Chatty answers vary in wording; exact match would falsely fail correct responses." },
            { question: "Jaccard similarity divides the word intersection by the word ______.", type: "fill_in", correct_answer: "union", explanation: "Jaccard = |intersection| / |union| of the two word sets." }
          ]
        }
      ],
      starter_code: `def jaccard(a, b):
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    # compute intersection over union
    intersection = None  # fix
    union = None         # fix
    return len(intersection) / len(union)

ref = "the capital of france is paris"
print(round(jaccard(ref, "paris is the capital of france"), 2))
print(round(jaccard(ref, "the capital of france is lyon"), 2))`,
      solution_code: `def jaccard(a, b):
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)

ref = "the capital of france is paris"
print(round(jaccard(ref, "paris is the capital of france"), 2))
print(round(jaccard(ref, "the capital of france is lyon"), 2))`,
      expected_output: `1.0
0.71`,
      step_throughs: [
        {
          title: "scoring one fuzzy answer with Jaccard",
          steps: [
            { label: "Split into word sets", detail: "Lowercase both strings and split on spaces, then drop duplicates by making each a set.", code: 'ref = {"the","capital","of","france","is","paris"}' },
            { label: "Intersect", detail: "Find the words both share. These are the matches that count toward similarity.", code: 'ref & out = {"the","capital","of","france","is"}  ->  5 words' },
            { label: "Union", detail: "Find every distinct word across both. This is the denominator — the total vocabulary in play.", code: 'ref | out = {..., "paris", "lyon"}  ->  7 words' },
            { label: "Divide", detail: "Intersection over union gives the score. More shared words relative to the total means a higher number.", code: "5 / 7 = 0.71" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A model outputs "The answer is yes." and the reference is "yes". Which scorer correctly passes it: exact match or contains?',
          steps: [
            'Exact match compares the whole strings: "The answer is yes." != "yes", so it fails — a false failure.',
            'Contains checks if "yes" appears inside the output: it does.',
            "The chatty-but-correct answer should pass, so contains is the right scorer here."
          ],
          output: "Contains passes it (1); exact match wrongly fails it (0)."
        },
        {
          number: 2, difficulty: "hard",
          prompt: 'Compute the Jaccard similarity between "fast red car" and "red car fast now". Then explain why a contains scorer would be a poor choice for grading this pair.',
          steps: [
            'Word sets: A = {fast, red, car}, B = {red, car, fast, now}.',
            "Intersection = {fast, red, car} = 3 words. Union = {fast, red, car, now} = 4 words.",
            "Jaccard = 3 / 4 = 0.75.",
            'Contains would check if one full string sits inside the other; neither does, so contains returns 0 even though the texts clearly overlap in meaning — it cannot capture partial similarity.'
          ],
          output: "Jaccard = 0.75; contains returns 0 and misses the strong partial overlap."
        }
      ],
      comparison_tables: [
        {
          title: "string scorers, strictest to loosest",
          columns: ["Scorer", "Passes 'capital is Paris' vs 'Paris'?", "Main weakness", "Use when"],
          rows: [
            { cells: ["Exact match", "No", "False failures on any rewording", "One canonical string (labels, IDs)"] },
            { cells: ["Contains", "Yes", "Fooled by negation ('not Paris')", "Chatty output, single required fact"] },
            { cells: ["Jaccard overlap", "Partial", "Ignores word order", "Free-form text, robust to rephrasing"], highlight: true },
            { cells: ["Embedding cosine", "Yes", "Needs a model + vectors", "Meaning matters more than wording"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "match each task to the right scorer",
          bins: [
            { id: "exact", label: "Exact match" },
            { id: "contains", label: "Contains" },
            { id: "fuzzy", label: "Similarity (Jaccard/cosine)" }
          ],
          items: [
            { id: "i1", text: "Classify a ticket into one of 12 fixed labels", bin: "exact" },
            { id: "i2", text: "Return a yes/no flag", bin: "exact" },
            { id: "i3", text: "Chatty answer that must mention 'Paris'", bin: "contains" },
            { id: "i4", text: "Did the reply include the order number?", bin: "contains" },
            { id: "i5", text: "Grade a paraphrased one-sentence summary", bin: "fuzzy" },
            { id: "i6", text: "Score free-form text that may be reworded", bin: "fuzzy" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is choosing too loose a scorer (like contains) sometimes more dangerous than choosing too strict a one?",
          sampleAnswer: "A too-strict scorer produces false failures, which are annoying but visible — your score looks worse than reality and you go investigate. A too-loose scorer produces false passes, which are invisible: broken outputs get marked correct, so a real regression slips through the eval without ever lowering the number. You ship the bug with full confidence because the dashboard says green, which is worse than a noisy red."
        }
      ],
      hints: [
        "Set intersection uses the & operator; union uses |.",
        "Both inputs are already lowercased and split into word sets.",
        "Divide the length of the intersection by the length of the union, then round."
      ],
      challenge_title: "Build a contains scorer",
      challenge_description: "Write contains_score(output, expected) that returns 1 if the lowercased expected string appears anywhere in the lowercased output, else 0.",
      challenge_starter_code: `def contains_score(output, expected):
    # return 1 or 0
    pass

print(contains_score("The capital is Paris.", "paris"))
print(contains_score("It is Lyon.", "paris"))`,
      challenge_solution_code: `def contains_score(output, expected):
    return 1 if expected.lower() in output.lower() else 0

print(contains_score("The capital is Paris.", "paris"))
print(contains_score("It is Lyon.", "paris"))`,
      challenge_test_cases: [
        { input: 'contains_score("The capital is Paris.", "paris")', expected_output: "1", description: "Expected appears (case-insensitive) → 1." },
        { input: 'contains_score("It is Lyon.", "paris")', expected_output: "0", description: "Expected absent → 0." }
      ]
    },
    {
      id: "ai-08-l4",
      project_id: "ai-08",
      order: 4,
      title: "LLM-as-Judge",
      concept: "LLM Judge",
      xp_reward: 10,
      explanation: `Some answers can't be string-matched. "Was this customer reply empathetic?" "Is this summary faithful to the source?" There's no reference string to compare against — empathy isn't a substring. So you do the thing that sounds like cheating but works: you ask a model to grade the output.

## What it is

An **LLM-as-judge** is a second model call whose only job is scoring. You give it the input, the model's output, and a **rubric** — explicit scoring criteria — and ask for a score. Done well, it correlates surprisingly closely with human raters, and it runs in seconds across thousands of cases where hiring humans to grade would cost a fortune and take days.

The whole game lives in the rubric. A vague prompt ("rate this 1-10") gives noisy, drifting scores that change run to run. A sharp rubric with explicit per-level criteria and a forced output format gives stable, parseable ones.

## How it works

A good judge prompt has four properties:

- **Crisp criteria.** Spell out what each score means: "1 = factually wrong, 3 = partially correct, 5 = fully correct and complete." Don't make the judge invent the scale.
- **Forced structured output.** Demand JSON or a single token so you can parse it. Free-form judge prose is useless at scale.
- **Reasoning before the score.** Let the judge explain first, then commit to a number. Scores are more reliable when the model reasons before answering.
- **One thing at a time.** Judge faithfulness in one call, tone in another. A judge asked to weigh five things at once gets mushy.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

RUBRIC = """You are grading a customer support reply.
Score 1-5 on empathy:
1 = cold or dismissive
3 = polite but generic
5 = warm, acknowledges the customer's feeling
Respond as JSON: {"reasoning": "...", "score": N}"""

def judge(customer_msg, reply):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"{RUBRIC}\\n\\nCustomer: {customer_msg}\\nReply: {reply}",
        }],
    )
    return resp.content[0].text

# print(judge("My order never arrived!", "Sorry to hear that, let's fix it right away."))
\`\`\`

## Why it matters

A judge is a model, so it inherits a model's biases. It tends to favor longer answers, can be swayed by confident tone, and may inflate scores for outputs that merely *sound* right. That makes an uncalibrated judge dangerous: it produces a number that looks rigorous but tracks length and confidence instead of quality. So before you rely on one, **calibrate it** — grade ~30 cases by hand, then check the judge agrees with you. If it doesn't, tighten the rubric and try again. **Judge calibration** is the step everyone skips and the reason most judge-based evals quietly lie. A judge you haven't checked against humans is a fancy random number generator with good PR.

## The mental model to keep

A rubric is a grading key: hand two teachers the same key and their marks converge. Used right, an LLM judge is the bridge between "this is too subjective to test" and "here's a number that tracks quality" — but only after you've confirmed it agrees with you.`,
      key_terms: [
        { term: "LLM-as-judge", definition: "Using a separate model call to score another model's output against a rubric — useful when no reference string exists." },
        { term: "Rubric", definition: "Explicit scoring criteria handed to the judge, defining what each score level means so grades stay consistent." },
        { term: "Judge calibration", definition: "Checking that the judge's scores agree with human ratings on a sample before trusting it at scale." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A rubric is a grading key",
          content: "Two teachers grading essays without a key give wildly different marks. Hand them the same rubric and their scores converge. Your LLM judge is the same — the rubric is what makes its scores repeatable.",
          position: "before"
        },
        {
          type: "warning",
          title: "Judges have biases",
          content: "LLM judges lean toward longer, more confident-sounding answers and can inflate scores. Always calibrate against ~30 human-graded cases before you trust the numbers.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Running an LLM judge",
        steps: [
          { label: "Write rubric", desc: "Define each score level explicitly." },
          { label: "Build prompt", desc: "Include input, output, rubric, forced JSON format." },
          { label: "Reason then score", desc: "Judge explains, then commits to a number." },
          { label: "Parse score", desc: "Pull the number out of structured output." },
          { label: "Calibrate", desc: "Confirm scores match human grading on a sample." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why force the judge to output JSON instead of free-form prose?",
          options: ["JSON is shorter", "So you can reliably parse the score at scale", "It makes the model smarter"],
          correct_index: 1,
          explanation: "Structured output lets you extract the score programmatically across thousands of cases; free prose doesn't parse."
        }
      ],
      quiz_questions: [
        {
          question: "When is an LLM judge the right tool?",
          options: [
            "For exact-match classification",
            "For subjective qualities like empathy or faithfulness with no reference string",
            "To make the model respond faster",
            "Only when you have no dataset"
          ],
          correct_index: 1,
          explanation: "Judges shine where string scorers fail — open-ended, subjective quality that needs a rubric, not equality."
        },
        {
          question: "What makes a judge's scores consistent rather than noisy?",
          options: [
            "Asking it to rate 1–10 with no guidance",
            "A sharp rubric defining each score level plus forced structured output",
            "Using the largest model available",
            "Running the judge twice and averaging randomly"
          ],
          correct_index: 1,
          explanation: "Explicit per-level criteria and a parseable format are what stabilize judge scores."
        },
        {
          question: "What must you do before trusting a judge at scale?",
          options: [
            "Nothing — judges are always accurate",
            "Calibrate it against human-graded examples",
            "Increase max_tokens to 4000",
            "Switch to exact match"
          ],
          correct_index: 1,
          explanation: "Grade ~30 cases by hand and confirm the judge agrees; otherwise its scores may be biased noise."
        }
      ],
      participation_activities: [
        {
          activity_title: "Judge design",
          questions: [
            { question: "A good judge prompt lets the model reason before committing to a score.", type: "true_false", correct_answer: "true", explanation: "Reasoning-then-score yields more reliable grades than score-first." },
            { question: "The explicit scoring criteria you hand the judge is called a ______.", type: "fill_in", correct_answer: "rubric", explanation: "The rubric defines what each score means and keeps grading consistent." }
          ]
        }
      ],
      starter_code: `import json

# A judge returned this raw JSON string. Parse it and print the score.
raw = '{"reasoning": "warm and acknowledges feelings", "score": 5}'

result = None  # parse raw into a dict
score = None   # pull out the score
print(f"Empathy score: {score}")`,
      solution_code: `import json

raw = '{"reasoning": "warm and acknowledges feelings", "score": 5}'

result = json.loads(raw)
score = result["score"]
print(f"Empathy score: {score}")`,
      expected_output: `Empathy score: 5`,
      step_throughs: [
        {
          title: "how an LLM judge scores one output",
          steps: [
            { label: "Assemble the judge prompt", detail: "Combine the rubric, the original input, and the model's output into one message for the judge.", code: 'prompt = RUBRIC + "\\nCustomer: ...\\nReply: ..."' },
            { label: "Judge reasons, then scores", detail: "The judge first explains its assessment against the criteria, which makes the final number more reliable.", code: '"The reply acknowledges the feeling and offers help..."' },
            { label: "Return structured output", detail: "The judge emits parseable JSON with a reasoning field and a numeric score, not free-form prose.", code: '{"reasoning": "...", "score": 5}' },
            { label: "Parse the score", detail: "Pull the number out programmatically so you can aggregate across thousands of cases.", code: 'score = json.loads(raw)["score"]  ->  5' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A judge returns the JSON {"reasoning": "polite but generic", "score": 3}. How do you extract just the score in Python?',
          steps: [
            "The string is JSON, so parse it with json.loads to get a dict.",
            'Access the value under the "score" key.',
            "That yields the integer 3."
          ],
          output: 'json.loads(raw)["score"]  ->  3'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You run a judge on 30 cases and also grade them yourself. The judge gives an average of 4.5 but your human average is 3.1, and the gap is largest on long, confident-sounding replies. What's going wrong and what do you do?",
          steps: [
            "A 1.4-point gap means the judge is systematically inflating scores — it is not calibrated to your standard.",
            "The gap concentrating on long, confident replies is the classic length/confidence bias of LLM judges.",
            "Tighten the rubric: add explicit criteria that penalize empty verbosity and reward concrete substance.",
            "Re-run on the same 30 cases and check the averages converge before trusting the judge at scale."
          ],
          output: "The judge is biased toward long/confident answers; rewrite the rubric to target substance, then re-calibrate against the human grades."
        }
      ],
      comparison_tables: [
        {
          title: "string scorer vs LLM judge",
          columns: ["Aspect", "String scorer", "LLM judge"],
          rows: [
            { cells: ["Handles subjective quality", "No", "Yes (tone, faithfulness, helpfulness)"] },
            { cells: ["Cost per case", "Near zero", "A model call each"] },
            { cells: ["Needs a reference string", "Yes", "No — grades against a rubric"], highlight: true },
            { cells: ["Main risk", "Mis-scores rewording", "Bias toward long/confident answers"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "string scorer or LLM judge?",
          bins: [
            { id: "string", label: "Use a string scorer" },
            { id: "judge", label: "Use an LLM judge" }
          ],
          items: [
            { id: "i1", text: "Classify into one of 5 fixed labels", bin: "string" },
            { id: "i2", text: "Rate whether a support reply is empathetic", bin: "judge" },
            { id: "i3", text: "Check the output equals a known ID", bin: "string" },
            { id: "i4", text: "Judge if a summary is faithful to its source", bin: "judge" },
            { id: "i5", text: "Verify the answer contains a required date", bin: "string" },
            { id: "i6", text: "Grade the overall helpfulness of a long answer", bin: "judge" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is calibrating a judge against ~30 human-graded cases non-negotiable before you trust its scores?",
          sampleAnswer: "An LLM judge has biases that can make its scores look rigorous while actually tracking length or confident tone instead of real quality. Without calibration you have no idea whether its numbers reflect what you actually care about, so a 'high score' might just mean 'longer answer.' Grading a sample by hand and checking the judge agrees is the only way to confirm the score measures quality, not an artifact. Skip it and you build your entire eval on a number that lies."
        }
      ],
      hints: [
        "json.loads turns a JSON string into a Python dict.",
        "Access the value with result['score'].",
        "Print using an f-string so the number is interpolated."
      ],
      challenge_title: "Average judge scores",
      challenge_description: "Write avg_score(json_list) where json_list is a list of JSON strings each containing a 'score' field. Parse each and return the average score rounded to 1 decimal.",
      challenge_starter_code: `import json

def avg_score(json_list):
    # parse each, average the 'score' values, round to 1 decimal
    pass

print(avg_score(['{"score": 5}', '{"score": 3}', '{"score": 4}']))
print(avg_score(['{"score": 2}', '{"score": 2}']))`,
      challenge_solution_code: `import json

def avg_score(json_list):
    scores = [json.loads(s)["score"] for s in json_list]
    return round(sum(scores) / len(scores), 1)

print(avg_score(['{"score": 5}', '{"score": 3}', '{"score": 4}']))
print(avg_score(['{"score": 2}', '{"score": 2}']))`,
      challenge_test_cases: [
        { input: 'avg_score([\'{"score": 5}\', \'{"score": 3}\', \'{"score": 4}\'])', expected_output: "4.0", description: "(5+3+4)/3 = 4.0." },
        { input: 'avg_score([\'{"score": 2}\', \'{"score": 2}\'])', expected_output: "2.0", description: "Both 2 → 2.0." }
      ]
    },
    {
      id: "ai-08-l5",
      project_id: "ai-08",
      order: 5,
      title: "Build an Eval Suite",
      concept: "Eval Suite",
      xp_reward: 10,
      explanation: `One eval is a test. An **eval suite** is your safety net — the thing you run before every prompt change so you catch regressions before users do. The first time it stops you from shipping a "harmless" prompt tweak that quietly broke 8% of your answers, you'll wonder how you ever worked without it. Let's wire the pieces from this module into one runnable harness.

## What it is

An **eval suite** is a collection of scored test cases run together, reporting per-case results *and* an aggregate. A single number hides *where* you broke; the suite shows you exactly which inputs regressed. That's the difference between "something got worse" and "the negation cases broke."

A solid suite has four moving parts:

- **Cases** — each with an input, an expected reference, and which scorer to use.
- **A runner** — loops cases, calls the model, applies the right scorer.
- **Per-case output** — pass/fail with actual vs. expected, for debugging.
- **An aggregate** — the **pass rate**, the headline number you track over time.

## How it works

This pulls exact-match and contains scoring into one runner, with a stubbed model so it's fully deterministic.

\`\`\`python
def model(prompt):
    answers = {
        "2+2": "4",
        "capital of France": "The capital of France is Paris.",
        "opposite of hot": "warm",
    }
    return answers.get(prompt, "")

def exact(output, expected):
    return output == expected

def contains(output, expected):
    return expected.lower() in output.lower()

SCORERS = {"exact": exact, "contains": contains}

suite = [
    {"input": "2+2", "expected": "4", "scorer": "exact"},
    {"input": "capital of France", "expected": "Paris", "scorer": "contains"},
    {"input": "opposite of hot", "expected": "cold", "scorer": "contains"},
]

passed = 0
for case in suite:
    out = model(case["input"])
    ok = SCORERS[case["scorer"]](out, case["expected"])
    passed += ok
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {case['input']!r} -> {out!r}")

rate = passed / len(suite)
print(f"Pass rate: {passed}/{len(suite)} ({rate:.0%})")
\`\`\`

The math case passes (exact "4"). Paris passes (contains, even though the answer is chatty). The opposite-of-hot case fails — the model said "warm," not "cold." So the suite reports 2/3 and points right at the broken case.

## Why it matters

A suite turns evals from a one-off check into a **gate**. Set a threshold — the suite must stay at or above its last pass rate — and wire it into CI or your pre-edit routine. If a change drops the number, you don't ship it. This is what makes AI development feel like software engineering instead of gambling: every change is measured, every regression is caught at the door, and progress compounds because nothing silently backslides. The highest-leverage move is turning each real-world failure into a new case — a **regression test** — so the same bug can never sneak back. Over months your suite becomes a museum of every mistake the system ever made and a guarantee none of them return.

## The mental model to keep

An eval suite is unit tests for an AI system: per-case output to find the break, an aggregate to track health, and a pass-rate gate to block regressions before they reach users.`,
      key_terms: [
        { term: "Eval suite", definition: "A collection of scored test cases run together to produce per-case results and an aggregate pass rate." },
        { term: "Pass rate", definition: "The fraction of suite cases that scored as correct — the headline metric you track across changes." },
        { term: "Regression test", definition: "A case added after a real failure so that the same bug can't reappear unnoticed in future changes." }
      ],
      callouts: [
        {
          type: "insight",
          title: "Per-case beats one number",
          content: "An aggregate tells you something broke; per-case output tells you what. Always print both — when the rate dips you want to land on the failing input in seconds, not bisect by hand.",
          position: "before"
        },
        {
          type: "tip",
          title: "Every bug becomes a case",
          content: "Found a failure in production? Add it to the suite. Over time your eval set becomes a museum of every mistake the system ever made — and a guarantee none of them return.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Eval suite lifecycle",
        steps: [
          { label: "Define cases", desc: "Input, expected, and scorer per case." },
          { label: "Run", desc: "Loop cases through the model and scorer." },
          { label: "Report", desc: "Print per-case pass/fail plus aggregate rate." },
          { label: "Gate", desc: "Block changes that drop the pass rate." },
          { label: "Grow", desc: "Add each new real failure as a case." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why report per-case results, not just the overall pass rate?",
          options: ["It looks more professional", "So you can see exactly which inputs regressed", "It runs faster"],
          correct_index: 1,
          explanation: "Per-case output points you straight at the broken input instead of forcing you to hunt for it."
        }
      ],
      quiz_questions: [
        {
          question: "What's the main job of an eval suite (vs. a single eval)?",
          options: [
            "To make the model train faster",
            "To run many scored cases together and catch regressions before shipping",
            "To replace the need for a model",
            "To generate new training data automatically"
          ],
          correct_index: 1,
          explanation: "A suite is your pre-ship safety net — many cases, an aggregate score, and a gate against regressions."
        },
        {
          question: "How should you handle a real failure found in production?",
          options: [
            "Ignore it if the pass rate is still high",
            "Add it as a new case so the suite guards against it forever",
            "Delete the closest existing case",
            "Lower the pass-rate threshold"
          ],
          correct_index: 1,
          explanation: "Turning every real failure into a case makes the bug a permanent regression test."
        },
        {
          question: "A good way to use the suite during development is to:",
          options: [
            "Run it once at the start of the project only",
            "Run it before each prompt change and block changes that drop the pass rate",
            "Run it only when users complain",
            "Average random scores together"
          ],
          correct_index: 1,
          explanation: "Treat it like unit tests: run on every change and gate on the pass rate not dropping."
        }
      ],
      participation_activities: [
        {
          activity_title: "Suite habits",
          questions: [
            { question: "An eval suite should report both per-case results and an aggregate score.", type: "true_false", correct_answer: "true", explanation: "Per-case finds the break; the aggregate tracks overall health." },
            { question: "The headline fraction of cases that scored correct is the pass ______.", type: "fill_in", correct_answer: "rate", explanation: "Pass rate is the aggregate metric you track across prompt changes." }
          ]
        }
      ],
      starter_code: `def model(prompt):
    answers = {"2+2": "4", "capital of France": "The capital of France is Paris.", "opposite of hot": "warm"}
    return answers.get(prompt, "")

def exact(output, expected):
    return output == expected

def contains(output, expected):
    return expected.lower() in output.lower()

SCORERS = {"exact": exact, "contains": contains}

suite = [
    {"input": "2+2", "expected": "4", "scorer": "exact"},
    {"input": "capital of France", "expected": "Paris", "scorer": "contains"},
    {"input": "opposite of hot", "expected": "cold", "scorer": "contains"},
]

passed = 0
for case in suite:
    out = model(case["input"])
    ok = None  # apply the right scorer for this case
    passed += ok
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {case['input']!r} -> {out!r}")

rate = passed / len(suite)
print(f"Pass rate: {passed}/{len(suite)} ({rate:.0%})")`,
      solution_code: `def model(prompt):
    answers = {"2+2": "4", "capital of France": "The capital of France is Paris.", "opposite of hot": "warm"}
    return answers.get(prompt, "")

def exact(output, expected):
    return output == expected

def contains(output, expected):
    return expected.lower() in output.lower()

SCORERS = {"exact": exact, "contains": contains}

suite = [
    {"input": "2+2", "expected": "4", "scorer": "exact"},
    {"input": "capital of France", "expected": "Paris", "scorer": "contains"},
    {"input": "opposite of hot", "expected": "cold", "scorer": "contains"},
]

passed = 0
for case in suite:
    out = model(case["input"])
    ok = SCORERS[case["scorer"]](out, case["expected"])
    passed += ok
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {case['input']!r} -> {out!r}")

rate = passed / len(suite)
print(f"Pass rate: {passed}/{len(suite)} ({rate:.0%})")`,
      expected_output: `[PASS] '2+2' -> '4'
[PASS] 'capital of France' -> 'The capital of France is Paris.'
[FAIL] 'opposite of hot' -> 'warm'
Pass rate: 2/3 (67%)`,
      step_throughs: [
        {
          title: "the gate: from prompt edit to ship-or-block",
          steps: [
            { label: "Edit the prompt", detail: "You change a system instruction hoping to improve answers. Before this gate existed, you'd ship on a hunch.", code: 'system_prompt = "Be concise and..."# tweaked' },
            { label: "Run the suite", detail: "Every case flows through the new prompt and its scorer. Per-case PASS/FAIL lines show exactly what each input produced.", code: "for case in suite: ok = SCORERS[case[scorer]](out, exp)" },
            { label: "Compare to the baseline", detail: "The aggregate pass rate is compared against the last known-good rate stored from before your change.", code: "new_rate = 0.62   baseline = 0.67" },
            { label: "Gate the change", detail: "If the rate dropped, the change is blocked and the failing cases tell you what broke. If it held or rose, you ship.", code: "0.62 < 0.67  ->  BLOCK: 'opposite of hot' regressed" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A suite of 8 cases passes 6 after a prompt change. What is the pass rate as a percent?",
          steps: [
            "Pass rate = passed / total.",
            "Plug in: 6 / 8 = 0.75.",
            "As a percent, 0.75 = 75%."
          ],
          output: "75%"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your baseline pass rate is 90% on 50 cases. A prompt change lifts 3 previously-failing cases but breaks 5 previously-passing ones. Does the gate ship the change, and what should you do with the 5 broken cases?",
          steps: [
            "Baseline: 90% of 50 = 45 passing, 5 failing.",
            "After the change: +3 fixed and -5 newly broken, so 45 + 3 - 5 = 43 passing.",
            "New rate = 43 / 50 = 86%, which is below the 90% baseline, so the gate blocks the change.",
            "The 5 newly-broken cases are exactly what the per-case output flags — investigate them, and each real failure you confirm stays in the suite as a permanent regression test."
          ],
          output: "New rate 86% < 90% baseline, so the gate blocks it; the 5 broken cases are surfaced per-case and kept as regression guards."
        }
      ],
      comparison_tables: [
        {
          title: "single eval vs full eval suite",
          columns: ["Property", "Single eval", "Eval suite"],
          rows: [
            { cells: ["Output detail", "One score", "Per-case results + aggregate"] },
            { cells: ["Finds which input broke", "No", "Yes, instantly"] },
            { cells: ["Mixed scorers", "Usually one", "Per-case scorer choice"] },
            { cells: ["Blocks regressions in CI", "Hard", "Built for it (pass-rate gate)"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good eval-suite habit, or anti-pattern?",
          bins: [
            { id: "good", label: "Good habit" },
            { id: "bad", label: "Anti-pattern" }
          ],
          items: [
            { id: "i1", text: "Run the suite before every prompt change", bin: "good" },
            { id: "i2", text: "Add each production failure as a new case", bin: "good" },
            { id: "i3", text: "Lower the threshold so a change can ship", bin: "bad" },
            { id: "i4", text: "Print per-case results plus the aggregate", bin: "good" },
            { id: "i5", text: "Delete cases that newly started failing", bin: "bad" },
            { id: "i6", text: "Gate CI on the pass rate not dropping", bin: "good" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does turning every production failure into a new suite case make the system get more reliable over time, not just stay the same?",
          sampleAnswer: "Each real failure you add becomes a permanent regression test, so that exact bug can never silently return — any future change that reintroduces it drops the pass rate and gets blocked at the gate. As you keep adding cases, the suite accumulates coverage of every way the system has ever broken, so the set of mistakes it can catch only grows. The model and prompts may change, but the guardrails keep ratcheting tighter, which means reliability compounds instead of plateauing."
        }
      ],
      hints: [
        "Look up the scorer function by name: SCORERS[case['scorer']].",
        "Call it with the model output and the expected value.",
        "Booleans add like ints in Python, so passed += ok counts True as 1."
      ],
      challenge_title: "Compute a suite pass rate",
      challenge_description: "Write run_suite(results) where results is a list of booleans (one per case). Return the pass rate as an integer percent (0–100).",
      challenge_starter_code: `def run_suite(results):
    # return integer percent of True values
    pass

print(run_suite([True, True, False]))
print(run_suite([True, True, True, True]))`,
      challenge_solution_code: `def run_suite(results):
    return round(sum(results) / len(results) * 100)

print(run_suite([True, True, False]))
print(run_suite([True, True, True, True]))`,
      challenge_test_cases: [
        { input: "run_suite([True, True, False])", expected_output: "67", description: "2 of 3 → 67%." },
        { input: "run_suite([True, True, True, True])", expected_output: "100", description: "All pass → 100%." }
      ]
    }
  ]
};
