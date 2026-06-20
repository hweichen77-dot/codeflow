export default {
  project: {
    id: "ai-08",
    title: "Fine-Tuning & Evals",
    description: "Stop guessing whether your prompt got better — measure it, and learn when fine-tuning actually beats a good prompt.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 180,
    lessons_count: 8,
    tags: ["fine-tuning", "evals", "prompt-engineering", "testing", "claude-api"],
    order: 19,
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
      challenge_title: "The Fine-Tune Router",
      challenge_description: "Decide fine-tune vs. prompt for a batch of AI tasks, then total the tokens fine-tuning would save.",
      challenge_difficulty: "intermediate",
      challenge_story: "You run the ML platform team at a company shipping dozens of AI features. Every product team wants to fine-tune — it sounds serious and important. Your job is to be the adult in the room. You've codified the decision rule from the playbook into a router that takes each team's task profile and returns a verdict. The CFO also wants one number: across everything you'd actually fine-tune, how many tokens per month does dropping the in-prompt examples save? Build the router that turns hype into a defensible recommendation.",
      challenge_statement: "You are given **N** AI tasks. For each task you know how many clean training examples are available, whether the task shape is **stable**, the projected monthly call volume, and how many tokens of few-shot examples the current prompt carries.\n\nRecommend **FINE-TUNE** for a task only when **all three** hold:\n\n- `examples ≥ 300`\n- the task is stable (`stable = 1`)\n- `monthly_calls ≥ 100000`\n\nOtherwise recommend **PROMPT**.\n\nFor every task you recommend fine-tuning, that prompt can drop its few-shot examples entirely, saving `monthly_calls × example_tokens` tokens per month. Print each task's verdict in order, then a final summary line.",
      challenge_input_format: "The first line is an integer `N`. Each of the next `N` lines describes one task with four space-separated integers: `examples stable monthly_calls example_tokens` (where `stable` is `1` for stable, `0` otherwise).",
      challenge_output_format: "Print `N` lines, one per task in input order: `FINE-TUNE` or `PROMPT`. Then print one final line with two space-separated integers: the number of fine-tune recommendations and the total monthly tokens saved across them.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ examples ≤ 1000000",
        "stable is 0 or 1",
        "0 ≤ monthly_calls ≤ 100000000",
        "0 ≤ example_tokens ≤ 100000"
      ],
      challenge_examples: [
        { input: "3\n500 1 250000 2000\n50 1 250000 2000\n400 0 500000 1500", output: "FINE-TUNE\nPROMPT\nPROMPT\n1 500000000", explanation: "Task 1 clears all three gates → fine-tune, saving 250000×2000 = 500,000,000 tokens/month. Task 2 has only 50 examples; task 3 is not stable. Both stay on prompting." },
        { input: "1\n300 1 100000 1000", output: "FINE-TUNE\n1 100000000", explanation: "Exactly on every threshold (300 examples, stable, 100000 calls) still qualifies. Savings: 100000×1000 = 100,000,000." }
      ],
      challenge_notes: "The thresholds are *floors*: 300 and 100000 both pass at equality. Token savings can exceed 32-bit range — Python ints are arbitrary precision, so no special handling is needed.",
      challenge_hints: [
        "Read N, then loop N times splitting each line into four ints. Treat `stable == 1` as the boolean.",
        "Combine the three gates with `and`. Only when all pass do you add `monthly_calls * example_tokens` to a running total.",
        "Collect the per-task verdict strings in a list, then print them, then print the summary line."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    ft_count = 0
    total_saved = 0
    decisions = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        examples = int(parts[0])
        stable = parts[1] == '1'
        monthly_calls = int(parts[2])
        example_tokens = int(parts[3])
        # TODO: recommend "FINE-TUNE" only when examples >= 300 and stable
        # and monthly_calls >= 100000; otherwise "PROMPT". On a fine-tune,
        # add monthly_calls * example_tokens to total_saved and bump ft_count.
        # Append the verdict string to decisions.
        decisions.append("PROMPT")
    out = decisions[:]
    out.append(f"{ft_count} {total_saved}")
    print('\\n'.join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    ft_count = 0
    total_saved = 0
    decisions = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        examples = int(parts[0])
        stable = parts[1] == '1'
        monthly_calls = int(parts[2])
        example_tokens = int(parts[3])
        if examples >= 300 and stable and monthly_calls >= 100000:
            decisions.append("FINE-TUNE")
            ft_count += 1
            total_saved += monthly_calls * example_tokens
        else:
            decisions.append("PROMPT")
    out = decisions[:]
    out.append(f"{ft_count} {total_saved}")
    print('\\n'.join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\n500 1 250000 2000\n50 1 250000 2000\n400 0 500000 1500", expected_output: "FINE-TUNE\nPROMPT\nPROMPT\n1 500000000", description: "Only the first task clears all three gates." },
        { input: "1\n300 1 100000 1000", expected_output: "FINE-TUNE\n1 100000000", description: "Exactly on every threshold still qualifies." },
        { input: "2\n299 1 100000 1000\n300 1 99999 1000", expected_output: "PROMPT\nPROMPT\n0 0", description: "Edge: one short on examples, one short on calls — neither qualifies." }
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
      challenge_title: "The Regression Gate",
      challenge_description: "Score a model's outputs against ground truth with forgiving normalization, then decide whether the build can ship.",
      challenge_difficulty: "beginner",
      challenge_story: "It's release night. An engineer pushed a 'tiny' system-prompt tweak two hours ago and swears the answers feel better. You don't ship on vibes. Your eval harness has a frozen dataset of inputs with known-good answers; the candidate model has already produced an output for each. You need an exact-match scorer that isn't *brittle* — `\"  Paris \"` and `\"paris\"` are the same answer, and nobody should fail over trailing whitespace or capitalization. Then a release gate compares the pass rate against the team's agreed threshold and prints a single verdict the on-call engineer can trust.",
      challenge_statement: "You are given **N** eval cases. Each case is a pair of lines: the model's **output** then the **expected** answer.\n\nScore a case as a pass when the output and expected match after normalization. Normalization means: strip leading/trailing whitespace, lowercase, and collapse every run of internal whitespace to a single space.\n\nGiven a pass-rate **threshold** (an integer percent), the build ships only when the pass rate is **at least** the threshold. Compare without floating-point error: the build ships when `passed × 100 ≥ threshold × N`.\n\nReport how many cases passed, the pass rate as a percentage to two decimals, and the verdict.",
      challenge_input_format: "Line 1: integer `N`. Line 2: integer `threshold` (a percent, 0–100). Then `2N` lines: for each case, the output line followed by the expected line. Output/expected lines may contain spaces.",
      challenge_output_format: "Three lines:\n1. `passed/N` (e.g. `2/3`).\n2. The pass rate to exactly two decimals followed by `%` (e.g. `66.67%`).\n3. `SHIP` if the pass rate meets the threshold, else `BLOCK`.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ threshold ≤ 100",
        "Each output/expected line has length ≤ 500"
      ],
      challenge_examples: [
        { input: "3\n80\nParis\nparis\nLondon\nParis\n  YES  \nyes", output: "2/3\n66.67%\nBLOCK", explanation: "Case 1: `Paris` vs `paris` match after lowercasing. Case 2: `London` ≠ `Paris`. Case 3: `  YES  ` normalizes to `yes`, matches. 2 of 3 = 66.67%, below the 80% gate → BLOCK." },
        { input: "2\n100\na\nA\nb\nb", output: "2/2\n100.00%\nSHIP", explanation: "Both pass after normalization; 100% meets the 100% gate → SHIP." }
      ],
      challenge_notes: "Use `' '.join(s.strip().lower().split())` to normalize in one line — `.split()` with no argument both trims and collapses whitespace. Comparing `passed*100 ≥ threshold*N` keeps the gate decision in integer arithmetic, dodging float rounding bugs right where they'd hurt.",
      challenge_hints: [
        "Read N and threshold, then loop N times reading two lines per case.",
        "Normalize both strings the same way before comparing; count exact normalized matches.",
        "Format the percentage with `f\"{pct:.2f}%\"` and decide SHIP/BLOCK using integer cross-multiplication."
      ],
      challenge_starter_code: `import sys

def normalize(s):
    # strip, lowercase, collapse internal whitespace
    return ' '.join(s.strip().lower().split())

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    threshold = int(data[idx]); idx += 1
    passed = 0
    for _ in range(n):
        out = data[idx]; idx += 1
        exp = data[idx]; idx += 1
        # TODO: if normalize(out) == normalize(exp), count it as passed.

    pct = passed * 100.0 / n
    # Ship when passed*100 >= threshold*n (integer compare avoids float error).
    verdict = "SHIP" if passed * 100 >= threshold * n else "BLOCK"
    print(f"{passed}/{n}")
    print(f"{pct:.2f}%")
    print(verdict)

main()
`,
      challenge_solution_code: `import sys

def normalize(s):
    return ' '.join(s.strip().lower().split())

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    threshold = int(data[idx]); idx += 1
    passed = 0
    for _ in range(n):
        out = data[idx]; idx += 1
        exp = data[idx]; idx += 1
        if normalize(out) == normalize(exp):
            passed += 1
    pct = passed * 100.0 / n
    verdict = "SHIP" if passed * 100 >= threshold * n else "BLOCK"
    print(f"{passed}/{n}")
    print(f"{pct:.2f}%")
    print(verdict)

main()
`,
      challenge_test_cases: [
        { input: "3\n80\nParis\nparis\nLondon\nParis\n  YES  \nyes", expected_output: "2/3\n66.67%\nBLOCK", description: "Case-insensitive + whitespace-tolerant scoring; below the 80% gate." },
        { input: "2\n100\na\nA\nb\nb", expected_output: "2/2\n100.00%\nSHIP", description: "All pass after normalization; meets a 100% gate." },
        { input: "1\n50\nfoo\nbar", expected_output: "0/1\n0.00%\nBLOCK", description: "Edge: zero passes — must not divide-by-zero and must BLOCK." }
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
      challenge_title: "The Jaccard Scorer",
      challenge_description: "Score fuzzy free-text answers by token overlap, average across the dataset, and count how many clear a quality bar.",
      challenge_difficulty: "intermediate",
      challenge_story: "Exact match keeps failing your RAG QA eval. The model answers 'The capital of France is Paris' and your reference says 'Paris France' — semantically a win, scored a zero. You're escalating to a **Jaccard** token-overlap scorer: treat each answer as a bag of words and measure how much the sets agree. It's loose enough to forgive phrasing, strict enough to catch a wrong fact. You'll run it across the whole eval set, report the average score, and count how many answers clear the quality threshold the product team set.",
      challenge_statement: "You are given **N** eval cases, each a pair of lines: the model **output** then the **expected** reference.\n\nTokenize each string by lowercasing and extracting maximal runs of letters and digits (`a–z`, `0–9`); everything else is a separator. Build a *set* of tokens for each side (duplicates collapse).\n\nThe **Jaccard score** of a case is `|output_tokens ∩ expected_tokens| / |output_tokens ∪ expected_tokens|`. As a special case, if both token sets are empty the score is `1.0` (two empty answers agree perfectly).\n\nCompute the average Jaccard score across all `N` cases, and count how many cases score **at least** the given threshold.",
      challenge_input_format: "Line 1: integer `N`. Line 2: integer `threshold_pct` (0–100); the pass threshold is `threshold_pct / 100`. Then `2N` lines: for each case, the output line then the expected line.",
      challenge_output_format: "Two lines:\n1. The average Jaccard score across all cases, to exactly three decimals.\n2. The integer count of cases scoring at least the threshold.",
      challenge_constraints: [
        "1 ≤ N ≤ 50000",
        "0 ≤ threshold_pct ≤ 100",
        "Each line has length ≤ 1000"
      ],
      challenge_examples: [
        { input: "2\n50\nThe capital of France is Paris\nParis France\nIt is Lyon\nParis France", output: "0.167\n0", explanation: "Case 1 tokens {the,capital,of,france,is,paris} vs {paris,france}: intersection 2, union 6 → 0.333. Case 2 {it,is,lyon} vs {paris,france}: intersection 0 → 0.0. Average = 0.167. Threshold 0.5: neither clears it → 0." },
        { input: "1\n100\nhello world\nhello world", output: "1.000\n1", explanation: "Identical token sets → Jaccard 1.0, which meets the 1.0 threshold." }
      ],
      challenge_notes: "Use `re.findall(r'[a-z0-9]+', s.lower())` to tokenize, then wrap in `set()`. Set operators `&` (intersection) and `|` (union) do the heavy lifting. Guard the both-empty case before dividing so you never hit a zero denominator.",
      challenge_hints: [
        "Write a `tokens(s)` helper returning a set of lowercased alphanumeric runs.",
        "Jaccard = len(a & b) / len(a | b); handle the empty-union case as score 1.0.",
        "Accumulate scores for the average and bump a counter when a score ≥ threshold."
      ],
      challenge_starter_code: `import sys
import re

def tokens(s):
    return set(re.findall(r'[a-z0-9]+', s.lower()))

def jaccard(a, b):
    ta, tb = tokens(a), tokens(b)
    # TODO: return the Jaccard score of the two token sets.
    # Both empty -> 1.0. Otherwise len(ta & tb) / len(ta | tb)
    # (guard against an empty union).
    return 0.0

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    thr = int(data[idx]) / 100.0; idx += 1
    scores = []
    passed = 0
    for _ in range(n):
        out = data[idx]; idx += 1
        exp = data[idx]; idx += 1
        j = jaccard(out, exp)
        scores.append(j)
        if j >= thr:
            passed += 1
    avg = sum(scores) / n
    print(f"{avg:.3f}")
    print(passed)

main()
`,
      challenge_solution_code: `import sys
import re

def tokens(s):
    return set(re.findall(r'[a-z0-9]+', s.lower()))

def jaccard(a, b):
    ta, tb = tokens(a), tokens(b)
    if not ta and not tb:
        return 1.0
    union = len(ta | tb)
    if union == 0:
        return 0.0
    return len(ta & tb) / union

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    thr = int(data[idx]) / 100.0; idx += 1
    scores = []
    passed = 0
    for _ in range(n):
        out = data[idx]; idx += 1
        exp = data[idx]; idx += 1
        j = jaccard(out, exp)
        scores.append(j)
        if j >= thr:
            passed += 1
    avg = sum(scores) / n
    print(f"{avg:.3f}")
    print(passed)

main()
`,
      challenge_test_cases: [
        { input: "2\n50\nThe capital of France is Paris\nParis France\nIt is Lyon\nParis France", expected_output: "0.167\n0", description: "Token-overlap scoring; neither case clears the 0.5 bar." },
        { input: "1\n100\nhello world\nhello world", expected_output: "1.000\n1", description: "Identical answers score a perfect 1.0." },
        { input: "1\n50\n!!!\n???", expected_output: "1.000\n1", description: "Edge: both answers tokenize to empty sets → defined as 1.0." }
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
      challenge_title: "Parsing the Judge",
      challenge_description: "Parse a batch of LLM-judge verdicts, discard malformed or out-of-range scores, and report the average of what survives.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your LLM-as-judge runs over a thousand customer-support replies, emitting one JSON verdict per case on a 1–5 rubric. But judges are messy: sometimes the model wraps prose around the JSON and your parser already handled that, sometimes it hallucinates a score of 9, sometimes it forgets the `score` field entirely, and sometimes it returns flat garbage. A naive `json.loads(...)['score']` crashes on the first bad row and poisons your average on the rest. Build the robust aggregator: keep only verdicts that parse cleanly and fall inside the rubric, average those, and report exactly how many you trusted versus threw out.",
      challenge_statement: "You are given **N** lines, each a candidate JSON verdict from the judge.\n\nA verdict is **valid** only when all of these hold:\n\n- the line parses as a JSON object,\n- it has a `score` key,\n- the value is a JSON integer (not a boolean, not a float, not a string),\n- the integer is in the rubric range `1 ≤ score ≤ 5`.\n\nEvery line failing any condition is **invalid** and excluded. Compute the average of the valid scores (rounded to two decimals) and report the counts of valid and invalid verdicts. If no verdict is valid, report the average as `0.00`.",
      challenge_input_format: "Line 1: integer `N`. Each of the next `N` lines is one candidate verdict (a JSON string, or possibly malformed text).",
      challenge_output_format: "Two lines:\n1. The average of valid scores to exactly two decimals (`0.00` if none are valid).\n2. Two space-separated integers: the count of valid verdicts then the count of invalid verdicts.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "Each line has length ≤ 1000",
        "Scores in the rubric are integers 1 through 5"
      ],
      challenge_examples: [
        { input: "4\n{\"score\": 5}\n{\"score\": 3}\n{\"score\": 9}\nnot json", output: "4.00\n2 2", explanation: "Scores 5 and 3 are valid (avg 4.00). `9` is out of the 1–5 range; `not json` does not parse. Two valid, two invalid." },
        { input: "2\n{\"score\": 4}\n{\"verdict\": \"good\"}", output: "4.00\n1 1", explanation: "The second verdict lacks a `score` key, so it is discarded. Average of the single valid score is 4.00." }
      ],
      challenge_notes: "Wrap the parse in `try/except (ValueError, KeyError, TypeError)`. Reject booleans explicitly — in Python `isinstance(True, int)` is `True`, so check `isinstance(score, bool)` first and skip those. A float like `4.5` should also be rejected since the rubric is integer-valued.",
      challenge_hints: [
        "Use `json.loads(line)` inside a try block; treat any exception as invalid.",
        "Validate the `score` value: reject bools, require `int`, require `1 <= score <= 5`.",
        "Track valid scores in a list and an invalid counter; guard the empty-valid case before averaging."
      ],
      challenge_starter_code: `import sys
import json

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    valid = []
    invalid = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        # TODO: a verdict is valid only when the line parses as a JSON object
        # with a "score" key whose value is an int (NOT a bool/float/str) in
        # the range 1..5. Append valid scores to valid; otherwise invalid += 1.
        # Wrap the parse in try/except (ValueError, KeyError, TypeError).
        pass
    if valid:
        avg = sum(valid) / len(valid)
        print(f"{avg:.2f}")
    else:
        print("0.00")
    print(f"{len(valid)} {invalid}")

main()
`,
      challenge_solution_code: `import sys
import json

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    valid = []
    invalid = 0
    for _ in range(n):
        line = data[idx]; idx += 1
        try:
            obj = json.loads(line)
            score = obj["score"]
            if isinstance(score, bool) or not isinstance(score, int):
                invalid += 1
                continue
            if 1 <= score <= 5:
                valid.append(score)
            else:
                invalid += 1
        except (ValueError, KeyError, TypeError):
            invalid += 1
    if valid:
        avg = sum(valid) / len(valid)
        print(f"{avg:.2f}")
    else:
        print("0.00")
    print(f"{len(valid)} {invalid}")

main()
`,
      challenge_test_cases: [
        { input: "4\n{\"score\": 5}\n{\"score\": 3}\n{\"score\": 9}\nnot json", expected_output: "4.00\n2 2", description: "Out-of-range and unparseable rows are excluded." },
        { input: "2\n{\"score\": 4}\n{\"verdict\": \"good\"}", expected_output: "4.00\n1 1", description: "A verdict missing the score key is discarded." },
        { input: "1\n{\"score\": 0}", expected_output: "0.00\n0 1", description: "Edge: the only verdict is out of range → no valid scores, average defaults to 0.00." }
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
      challenge_title: "The Eval Suite Harness",
      challenge_description: "Run a mixed-scorer eval suite, list the exact cases that failed, and gate the release against the last green baseline.",
      challenge_difficulty: "intermediate",
      challenge_statement: "You are building the harness that runs before every prompt change. Each case names a **scorer**, supplies the model **output**, and the **expected** target. Apply the right scorer:\n\n- `exact` — pass when output equals expected after trimming and lowercasing both.\n- `contains` — pass when the trimmed, lowercased expected appears anywhere in the trimmed, lowercased output.\n- `numeric` — `expected` is two space-separated numbers `target tolerance`; parse the output as a float and pass when `|value − target| ≤ tolerance`. If the output is not a number, fail.\n\nRun all `N` cases in order. Cases are numbered `1..N`. Report how many passed, the pass rate as an integer percent (standard rounding), the list of failing case numbers, and a ship verdict: **SHIP** when the number passed is at least the green **baseline**, else **BLOCK**.",
      challenge_story: "Your safety net is one command: run the suite, read the verdict, ship or don't. Tonight the suite mixes three scorer types — exact-match for canned answers, contains for 'must mention the policy ID', and a numeric scorer for the price-extraction feature with a tolerance band. The harness has to score each case with the *right* tool, surface exactly which case numbers regressed (a single number hides the bug; a list of IDs points at it), and compare the pass count against the last known-green baseline so a 'harmless' tweak that quietly broke a case can't sneak past you.",
      challenge_input_format: "Line 1: integer `N`. Line 2: integer `baseline` (the pass count from the last green run). Then each case is three lines: the scorer name (`exact`, `contains`, or `numeric`), the output line, and the expected line.",
      challenge_output_format: "Four lines:\n1. `passed/N`.\n2. The pass rate as an integer percent followed by `%` (e.g. `75%`).\n3. `FAIL` followed by the failing case numbers in ascending order separated by spaces, or `FAIL none` if all passed.\n4. `SHIP` if passed ≥ baseline, else `BLOCK`.",
      challenge_constraints: [
        "1 ≤ N ≤ 50000",
        "0 ≤ baseline ≤ N",
        "scorer is one of `exact`, `contains`, `numeric`",
        "numeric target and tolerance fit in a double; tolerance ≥ 0"
      ],
      challenge_examples: [
        { input: "3\n3\nexact\nParis\nparis\ncontains\nThe answer is 42\n42\nnumeric\n3.14\n3.0 0.2", output: "3/3\n100%\nFAIL none\nSHIP", explanation: "Exact: `Paris`==`paris` after lowercasing. Contains: `42` is inside the output. Numeric: |3.14−3.0|=0.14 ≤ 0.2. All pass; 3 ≥ baseline 3 → SHIP." },
        { input: "4\n4\nexact\nyes\nyes\nexact\nno\nyes\ncontains\nhello world\nworld\nnumeric\n9.9\n10 0.5", output: "3/4\n75%\nFAIL 2\nBLOCK", explanation: "Case 2 fails (`no` ≠ `yes`); the rest pass. 3 of 4 = 75%. Passed 3 < baseline 4 → BLOCK, and case 2 is named as the regression." }
      ],
      challenge_notes: "Dispatch on the scorer name with a small `if/elif` chain or a dict of functions. For `numeric`, guard the float parse with `try/except ValueError` so a non-numeric output fails cleanly instead of crashing. Percent rounding uses Python's `round`, which rounds 66.5 to the nearest even — but standard cases like 2/3 → 67 behave as expected.",
      challenge_hints: [
        "Read N and baseline, then loop reading three lines (scorer, output, expected) per case.",
        "Write one `score_case(scorer, output, expected)` returning a bool; collect failing 1-based indices.",
        "Compute `round(passed / n * 100)` for the percent and compare `passed >= baseline` for the verdict."
      ],
      challenge_starter_code: `import sys

def score_case(scorer, output, expected):
    o = output.strip()
    e = expected.strip()
    # TODO: dispatch on scorer and return True/False:
    #   "exact"    -> o.lower() == e.lower()
    #   "contains" -> e.lower() in o.lower()
    #   "numeric"  -> e is "target tolerance"; parse o as float (try/except
    #                 ValueError, fail on non-number) and pass when
    #                 abs(val - target) <= tolerance.
    return False

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    baseline = int(data[idx]); idx += 1
    passed = 0
    failed_ids = []
    for i in range(1, n + 1):
        scorer = data[idx].strip(); idx += 1
        output = data[idx]; idx += 1
        expected = data[idx]; idx += 1
        if score_case(scorer, output, expected):
            passed += 1
        else:
            failed_ids.append(i)
    rate = round(passed / n * 100)
    verdict = "SHIP" if passed >= baseline else "BLOCK"
    print(f"{passed}/{n}")
    print(f"{rate}%")
    if failed_ids:
        print("FAIL " + " ".join(map(str, failed_ids)))
    else:
        print("FAIL none")
    print(verdict)

main()
`,
      challenge_solution_code: `import sys

def score_case(scorer, output, expected):
    o = output.strip()
    e = expected.strip()
    if scorer == "exact":
        return o.lower() == e.lower()
    if scorer == "contains":
        return e.lower() in o.lower()
    if scorer == "numeric":
        target_s, tol_s = e.split()
        try:
            val = float(o)
        except ValueError:
            return False
        return abs(val - float(target_s)) <= float(tol_s)
    return False

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    baseline = int(data[idx]); idx += 1
    passed = 0
    failed_ids = []
    for i in range(1, n + 1):
        scorer = data[idx].strip(); idx += 1
        output = data[idx]; idx += 1
        expected = data[idx]; idx += 1
        if score_case(scorer, output, expected):
            passed += 1
        else:
            failed_ids.append(i)
    rate = round(passed / n * 100)
    verdict = "SHIP" if passed >= baseline else "BLOCK"
    print(f"{passed}/{n}")
    print(f"{rate}%")
    if failed_ids:
        print("FAIL " + " ".join(map(str, failed_ids)))
    else:
        print("FAIL none")
    print(verdict)

main()
`,
      challenge_test_cases: [
        { input: "3\n3\nexact\nParis\nparis\ncontains\nThe answer is 42\n42\nnumeric\n3.14\n3.0 0.2", expected_output: "3/3\n100%\nFAIL none\nSHIP", description: "All three scorer types pass; meets baseline → SHIP." },
        { input: "4\n4\nexact\nyes\nyes\nexact\nno\nyes\ncontains\nhello world\nworld\nnumeric\n9.9\n10 0.5", expected_output: "3/4\n75%\nFAIL 2\nBLOCK", description: "One regression named; passed below baseline → BLOCK." },
        { input: "1\n1\nnumeric\nNaNvalue\n5 0.1", expected_output: "0/1\n0%\nFAIL 1\nBLOCK", description: "Edge: non-numeric output fails the numeric scorer cleanly instead of crashing." }
      ]
    },
    {
      id: "ai-08-l6",
      project_id: "ai-08",
      order: 6,
      title: "Building a Training Dataset",
      concept: "Dataset",
      xp_reward: 10,
      explanation: `You finally decided fine-tuning is worth it (lesson 1 told you when). Now comes the part that actually determines whether it works: the dataset. Teams obsess over which base model to pick and then feed it 5,000 sloppy, contradictory examples — and wonder why the fine-tune is worse than the prompt they started with. The model can only learn the patterns you show it. Garbage examples teach garbage habits, faithfully.

## What it is

A **training dataset** for fine-tuning is a list of input→output **examples** that demonstrate the exact behavior you want baked into the weights. Each example is a pair: the input the model will see, and the ideal output it should produce. For a chat-style fine-tune each row is usually a small JSON object — a prompt and the gold completion:

\`\`\`json
{"input": "Refund my order #4421", "output": "billing"}
\`\`\`

The model doesn't learn what you *tell* it to do; it learns what your examples *show* it doing, over and over. So the dataset is the spec. If the spec is inconsistent, the learned behavior is too.

## How it works

Three properties decide whether a dataset teaches the right thing:

- **Quality over quantity.** 300 clean, consistent examples beat 3,000 noisy ones. Every wrong or sloppy label is a lesson the model dutifully memorizes. One mislabeled row isn't a rounding error — it's a counter-example actively fighting your goal.
- **Balance.** If 90% of your examples are one class, the model learns to just guess that class. Roughly even coverage per class keeps it from collapsing onto the majority.
- **Coverage.** Include the edge cases, the rephrasings, the formats real users will actually send — not just the clean happy path. The model can only generalize from variety it has seen.

A quick sanity check before you ever start a training run is to count examples per class and flag any class that is starved:

\`\`\`python
from collections import Counter

dataset = [
    {"input": "charge me twice?", "output": "billing"},
    {"input": "where is my package", "output": "shipping"},
    {"input": "double charged again", "output": "billing"},
]
counts = Counter(row["output"] for row in dataset)
print(counts)                      # Counter({'billing': 2, 'shipping': 1})
weak = [c for c, n in counts.items() if n < 50]
print("under-covered:", weak)      # classes needing more examples
\`\`\`

## Why it matters

Dataset quality has a higher ceiling effect than almost any other knob. A pristine 400-row set routinely beats a careless 4,000-row one, because the careless set quietly teaches contradictions: two near-identical inputs labeled differently tell the model the task is random. **Deduplicate** too — copies don't add signal, they just over-weight whatever they happen to say, skewing balance without you noticing. And watch for leakage of the label into the input (a row that literally contains the answer): the model learns the shortcut, scores great in training, and falls apart on real inputs that lack the tell.

## The mental model to keep

A training set is a stack of worked examples handed to a very literal student. It copies your habits exactly — including your mistakes. Curate ruthlessly: clean, balanced, and covering the real distribution beats big every time.`,
      key_terms: [
        { term: "Training example", definition: "One input→output pair in the dataset that demonstrates the behavior you want the fine-tune to learn." },
        { term: "Class balance", definition: "Having roughly even numbers of examples per category, so the model doesn't collapse onto the majority class." },
        { term: "Coverage", definition: "How well the dataset spans the real range of inputs — edge cases, rephrasings, and formats users actually send." },
        { term: "Deduplication", definition: "Removing duplicate examples so copies don't over-weight a single pattern and quietly skew balance." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A very literal student",
          content: "The model is a student who copies the worked examples you hand it exactly — including any sloppy ones. It can't tell which examples were careless. Every mislabeled row is a lesson it faithfully learns.",
          position: "before"
        },
        {
          type: "warning",
          title: "Watch for label leakage",
          content: "If an input literally contains its own answer, the model learns the shortcut, scores great in training, then fails on real inputs that lack the tell. Strip the answer out of the input before training.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Curating a training set",
        steps: [
          { label: "Collect pairs", desc: "Gather real input→output examples of the target behavior." },
          { label: "Clean + dedup", desc: "Fix bad labels and drop duplicate rows." },
          { label: "Check balance", desc: "Count per class; top up any starved category." },
          { label: "Cover edges", desc: "Add rephrasings and edge cases users really send." }
        ]
      },
      inline_quizzes: [
        {
          question: "You have 4,000 examples but 88% are one class. What's the most likely failure?",
          options: ["The model trains too slowly", "The model learns to just guess the majority class", "The dataset is too small to train on"],
          correct_index: 1,
          explanation: "Severe imbalance lets the model maximize accuracy by always predicting the dominant class, ignoring the rest."
        }
      ],
      quiz_questions: [
        {
          question: "Which dataset is most likely to produce the best fine-tune?",
          options: [
            "4,000 examples with many noisy, inconsistent labels",
            "400 clean, consistent, well-balanced examples",
            "50 perfect examples, all of the same class",
            "10,000 duplicated copies of 100 examples"
          ],
          correct_index: 1,
          explanation: "Quality and balance beat raw size; the clean, balanced 400-row set teaches consistent patterns."
        },
        {
          question: "Why is deduplicating the dataset important?",
          options: [
            "Duplicates make the file too large to upload",
            "Copies over-weight one pattern and skew class balance without adding new signal",
            "Duplicates always contain wrong labels",
            "The model refuses to train on repeated rows"
          ],
          correct_index: 1,
          explanation: "Identical rows add no new information but tilt the effective class distribution toward whatever they say."
        },
        {
          question: "What does 'coverage' mean for a training dataset?",
          options: [
            "The total number of examples",
            "How well examples span the real range of inputs, including edge cases and rephrasings",
            "Whether the file is backed up",
            "The fraction of examples labeled correctly"
          ],
          correct_index: 1,
          explanation: "Coverage is about variety — the model can only generalize to input shapes it actually saw during training."
        }
      ],
      participation_activities: [
        {
          activity_title: "Dataset habits",
          questions: [
            { question: "A few hundred clean, balanced examples can outperform thousands of noisy ones.", type: "true_false", correct_answer: "true", explanation: "Quality and consistency matter more than raw count for fine-tuning." },
            { question: "Removing duplicate rows so they don't over-weight one pattern is called ______.", type: "fill_in", correct_answer: "deduplication", explanation: "Deduplication keeps copies from skewing the effective class balance." }
          ]
        }
      ],
      starter_code: `from collections import Counter

dataset = [
    {"input": "charge me twice?", "output": "billing"},
    {"input": "where is my package", "output": "shipping"},
    {"input": "double charged again", "output": "billing"},
]

# Count examples per class, then flag any class with fewer than 2 examples.
counts = None              # fix: count the output labels
weak = None                # fix: classes with fewer than 2 examples
print(dict(counts))
print("under-covered:", weak)`,
      solution_code: `from collections import Counter

dataset = [
    {"input": "charge me twice?", "output": "billing"},
    {"input": "where is my package", "output": "shipping"},
    {"input": "double charged again", "output": "billing"},
]

counts = Counter(row["output"] for row in dataset)
weak = [c for c, n in counts.items() if n < 2]
print(dict(counts))
print("under-covered:", weak)`,
      expected_output: `{'billing': 2, 'shipping': 1}
under-covered: ['shipping']`,
      step_throughs: [
        {
          title: "turning raw logs into a clean training set",
          steps: [
            { label: "Collect raw pairs", detail: "Pull real inputs and the correct outputs from logs or human labeling. This is the unfiltered starting pile.", code: 'raw = [{"input": "...", "output": "billing"}, ...]  # messy' },
            { label: "Dedup + clean", detail: "Drop exact-duplicate rows and fix mislabeled ones. Every copy and every bad label is a lesson the model will memorize.", code: "rows = dedupe(raw); fix_bad_labels(rows)" },
            { label: "Count per class", detail: "Tally examples by output label to see where coverage is thin before you commit GPU time.", code: "Counter -> {'billing': 280, 'shipping': 12}" },
            { label: "Balance + cover edges", detail: "Top up starved classes and add real rephrasings and edge cases, so the model generalizes instead of memorizing the happy path.", code: "add_examples('shipping', 268)  # bring it up to par" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A 1,000-example dataset has 950 'approve' labels and 50 'deny' labels. Why will a model trained on it struggle on real 'deny' cases?",
          steps: [
            "The dataset is severely imbalanced — 95% of examples are one class.",
            "A model can score 95% just by always predicting 'approve', so it has little pressure to learn 'deny'.",
            "It saw only 50 'deny' examples, far too few to generalize the patterns that distinguish them."
          ],
          output: "The imbalance lets it ignore 'deny'; it needs far more 'deny' examples to learn that class."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You have 600 raw examples. 120 are exact duplicates, and 30 of the unique ones are mislabeled. Roughly how many trustworthy training examples do you actually have, and which problem hurts the fine-tune more?",
          steps: [
            "Remove the 120 duplicates first: 600 - 120 = 480 unique rows.",
            "Of those, 30 carry wrong labels, leaving 480 - 30 = 450 clean, trustworthy examples.",
            "Duplicates mostly waste capacity and skew balance, but mislabeled rows are worse: each one actively teaches the wrong pattern.",
            "Fix the labels before training; a contradictory example fights your goal harder than a redundant one does."
          ],
          output: "About 450 trustworthy examples; the 30 mislabeled rows hurt more because they teach the wrong behavior outright."
        }
      ],
      comparison_tables: [
        {
          title: "what makes a training set good vs bad",
          columns: ["Property", "Weak dataset", "Strong dataset"],
          rows: [
            { cells: ["Size vs quality", "Huge but noisy", "Smaller but clean and consistent"] },
            { cells: ["Class balance", "One class dominates", "Roughly even per class"] },
            { cells: ["Coverage", "Only the happy path", "Edge cases + rephrasings users send"], highlight: true },
            { cells: ["Duplicates", "Many, skewing balance", "Deduplicated"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "helps or hurts the training set?",
          bins: [
            { id: "help", label: "Improves the dataset" },
            { id: "hurt", label: "Harms the dataset" }
          ],
          items: [
            { id: "i1", text: "Roughly even examples per class", bin: "help" },
            { id: "i2", text: "88% of rows in a single class", bin: "hurt" },
            { id: "i3", text: "Including real edge cases and rephrasings", bin: "help" },
            { id: "i4", text: "Hundreds of exact-duplicate rows", bin: "hurt" },
            { id: "i5", text: "Fixing mislabeled examples before training", bin: "help" },
            { id: "i6", text: "Inputs that literally contain their own answer", bin: "hurt" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a smaller, clean dataset beat a much larger noisy one for fine-tuning?",
          sampleAnswer: "Fine-tuning bakes whatever patterns the examples show into the weights, and the model can't tell a careful label from a careless one. A noisy set teaches contradictions — two similar inputs labeled differently make the task look random — and imbalance lets the model cheat by guessing the majority class. A smaller clean, balanced set gives consistent, unambiguous signal, so the model learns the actual rule instead of memorizing noise. More rows only help if every row is trustworthy."
        }
      ],
      hints: [
        "Counter takes an iterable; feed it each row's output label.",
        "Use a comprehension over counts.items() to find classes below the threshold.",
        "Counter behaves like a dict, so dict(counts) prints it cleanly."
      ],
      challenge_title: "The Dataset Auditor",
      challenge_description: "Audit a raw labeled dataset: drop duplicates, count examples per class, and flag any class too starved to fine-tune on.",
      challenge_difficulty: "intermediate",
      challenge_story: "You're about to kick off an expensive fine-tuning run for a support-ticket classifier, and the data team handed you a freshly scraped dataset of labeled examples. Before you burn GPU hours, you need to audit it. Real scraped data is dirty: the same ticket appears multiple times, and some categories barely have any examples while others are flooded. Your job is to deduplicate the rows, count clean examples per class, and flag any class that falls below the minimum the team agreed is trainable. Catch a starved class now, or watch the fine-tune fail to learn it later.",
      challenge_statement: "You are given **N** raw labeled rows. Each row is a label and an example text separated by a single tab character.\n\nTwo rows are **duplicates** when they have the same label AND the same text after normalizing the text (strip leading/trailing whitespace and lowercase it). Keep only the first occurrence of each duplicate; discard the rest.\n\nAfter deduplication, count how many clean examples each label has. A label is **weak** if its count is strictly less than `min_per_class`.\n\nReport the number of rows kept and the number of duplicates dropped, the number of distinct classes, and the weak classes.",
      challenge_input_format: "Line 1: integer `N`. Line 2: integer `min_per_class`. Each of the next `N` lines is one row: a label, a tab character, then the example text (the text may contain spaces).",
      challenge_output_format: "Three lines:\n1. Two space-separated integers: rows kept then duplicates dropped.\n2. The number of distinct classes among the kept rows.\n3. `WEAK` followed by the weak class labels in first-seen order separated by spaces, or `BALANCED` if no class is weak.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "1 ≤ min_per_class ≤ 100000",
        "Each label and text line has length ≤ 500",
        "Labels contain no tab characters"
      ],
      challenge_examples: [
        { input: "3\n2\nbilling\tMy card was charged twice\nbilling\tmy card was charged twice\nshipping\tWhere is my order", output: "2 1\n2\nWEAK billing shipping", explanation: "Rows 1 and 2 are duplicates (same label, text matches after lowercasing), so one is dropped: 2 kept, 1 dup. Two classes remain (billing 1, shipping 1), both below the 2 floor, so both are weak in first-seen order." },
        { input: "5\n2\na\tone\nb\ttwo\na\tthree\nb\tfour\nc\tfive", output: "5 0\n3\nWEAK c", explanation: "No duplicates. Counts: a=2, b=2, c=1. Only c is below 2, so it is the lone weak class." }
      ],
      challenge_notes: "Split each row on the first tab only (`line.split('\\t', 1)`) since the text may itself contain spaces. Normalize text with `text.strip().lower()` for the dedup key, but keep labels as-is. Track first-seen label order with a list so the weak output is deterministic.",
      challenge_hints: [
        "Build a set of (label, normalized_text) keys; skip a row whose key you've already seen and count it as a duplicate.",
        "Tally kept rows per label in a dict, recording each label's first appearance in a separate list for ordering.",
        "After the loop, walk the first-seen list and collect labels whose count is below min_per_class."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    min_per_class = int(data[idx]); idx += 1
    counts = {}
    order = []
    seen = set()
    kept = 0
    dropped = 0
    for _ in range(n):
        parts = data[idx].split('\\t', 1); idx += 1
        label = parts[0]
        text = parts[1] if len(parts) > 1 else ""
        key = (label, text.strip().lower())
        # TODO: if key is already in seen, it's a duplicate (dropped += 1,
        # skip it). Otherwise add the key, count it as kept, and tally the
        # label in counts (recording first-seen labels in order).

    weak = [lbl for lbl in order if counts[lbl] < min_per_class]
    print(f"{kept} {dropped}")
    print(len(counts))
    if weak:
        print("WEAK " + " ".join(weak))
    else:
        print("BALANCED")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    min_per_class = int(data[idx]); idx += 1
    counts = {}
    order = []
    seen = set()
    kept = 0
    dropped = 0
    for _ in range(n):
        parts = data[idx].split('\\t', 1); idx += 1
        label = parts[0]
        text = parts[1] if len(parts) > 1 else ""
        key = (label, text.strip().lower())
        if key in seen:
            dropped += 1
            continue
        seen.add(key)
        kept += 1
        if label not in counts:
            counts[label] = 0
            order.append(label)
        counts[label] += 1
    weak = [lbl for lbl in order if counts[lbl] < min_per_class]
    print(f"{kept} {dropped}")
    print(len(counts))
    if weak:
        print("WEAK " + " ".join(weak))
    else:
        print("BALANCED")

main()
`,
      challenge_test_cases: [
        { input: "3\n2\nbilling\tMy card was charged twice\nbilling\tmy card was charged twice\nshipping\tWhere is my order", expected_output: "2 1\n2\nWEAK billing shipping", description: "Case-insensitive dedup drops the near-duplicate; both small classes flagged weak." },
        { input: "5\n2\na\tone\nb\ttwo\na\tthree\nb\tfour\nc\tfive", expected_output: "5 0\n3\nWEAK c", description: "No duplicates; only the single-example class c is below the floor." },
        { input: "4\n1\nx\thello\nx\tworld\ny\tfoo\ny\tbar", expected_output: "4 0\n2\nBALANCED", description: "Both classes meet a floor of 1, so the dataset is balanced." },
        { input: "1\n5\nspam\tbuy now", expected_output: "1 0\n1\nWEAK spam", description: "Edge: a single row cannot meet a floor of 5, so its class is weak." }
      ]
    },
    {
      id: "ai-08-l7",
      project_id: "ai-08",
      order: 7,
      title: "Overfitting and Generalization",
      concept: "Overfitting",
      xp_reward: 10,
      explanation: `Your fine-tune scores 99% on the data you trained it on. You ship it. In production it scores 71%. Nothing broke — you just measured the wrong thing. A model that aces the exact questions it studied has told you almost nothing about how it handles new ones. That gap between studied and unseen is the single most important idea in evaluating any trained model.

## What it is

**Overfitting** is when a model learns the training examples *too* well — memorizing their specific quirks instead of the general rule. It looks brilliant on data it has seen and falls apart on data it hasn't. **Generalization** is the opposite and the actual goal: performing well on inputs the model was never trained on, because it learned the underlying pattern rather than the answer key.

The only way to tell them apart is to never let the model see its own exam. You split your data:

- **Training set** — the model learns from these.
- **Test set (held-out)** — locked in a vault, never used in training, used *only* to measure real performance.

## How it works

You hold back a slice of data before training — commonly 80% train, 20% test — and you guard it. The model trains on the 80%, then you score it on the untouched 20%. The comparison is the whole signal:

\`\`\`python
def diagnose(train_acc, test_acc):
    gap = train_acc - test_acc
    if gap > 0.10:
        return "overfitting"      # memorized the training set
    if train_acc < 0.70:
        return "underfitting"     # hasn't learned enough
    return "generalizing"         # healthy

print(diagnose(0.99, 0.71))   # overfitting  (gap 0.28)
print(diagnose(0.88, 0.85))   # generalizing (gap 0.03)
print(diagnose(0.55, 0.54))   # underfitting (both low)
\`\`\`

A small gap means the model learned the rule. A large gap — high train, low test — is the textbook fingerprint of overfitting. Both low means **underfitting**: it never learned enough to begin with.

## Why it matters

Train accuracy is a vanity metric. A model can hit 100% on training data by simply memorizing every answer, and that number tells you *nothing* about the inputs your users will actually send. **Test accuracy is the honest number** because those examples were never part of learning — they stand in for the unseen real world. This is why the test set must stay sealed: the instant you tune your prompt or pick a model version based on the test score, that set has leaked into your decisions and stops being held-out. It's now training data with extra steps, and your reported number is inflated. Serious teams keep a third **validation set** for tuning and only touch the test set once, at the very end.

## The mental model to keep

Training accuracy is the practice exam you've already seen the answers to; test accuracy is the real exam with fresh questions. Anyone can ace the practice. Only generalization counts — and you can only see it on data the model never studied.`,
      key_terms: [
        { term: "Overfitting", definition: "When a model memorizes the training data's quirks instead of the general rule, scoring high on seen data and poorly on unseen data." },
        { term: "Generalization", definition: "Performing well on inputs never seen during training — the actual goal of any trained model." },
        { term: "Train/test split", definition: "Reserving a slice of data (the held-out test set) that the model never trains on, used only to measure real performance." },
        { term: "Underfitting", definition: "When a model hasn't learned enough — both training and test accuracy are low." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "Practice exam vs real exam",
          content: "Training accuracy is a practice test you've already seen the answer key for — anyone can ace it. Test accuracy is the real exam with fresh questions. Only the second one tells you whether the model actually learned.",
          position: "before"
        },
        {
          type: "warning",
          title: "Touch the test set and it's burned",
          content: "The moment you tune a prompt or pick a model version based on the test score, that set has leaked into your decisions and is no longer held-out. Keep a separate validation set for tuning; touch the real test set only once, at the end.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Why you need a held-out set",
        steps: [
          { label: "Split the data", desc: "Reserve ~20% as a sealed test set before training." },
          { label: "Train on the rest", desc: "The model learns only from the training portion." },
          { label: "Score on held-out", desc: "Measure accuracy on data the model never saw." },
          { label: "Read the gap", desc: "Big train-minus-test gap means overfitting." }
        ]
      },
      inline_quizzes: [
        {
          question: "A model scores 0.98 on training data and 0.72 on held-out data. What does this signal?",
          options: ["Underfitting — it learned too little", "Overfitting — it memorized the training set", "Perfect generalization"],
          correct_index: 1,
          explanation: "A large gap with high train and low test accuracy is the classic fingerprint of overfitting."
        }
      ],
      quiz_questions: [
        {
          question: "Why is training accuracy a poor measure of real-world performance?",
          options: [
            "It is always lower than test accuracy",
            "A model can hit it by memorizing the answers, which says nothing about unseen inputs",
            "It cannot be computed for fine-tuned models",
            "It only works for classification tasks"
          ],
          correct_index: 1,
          explanation: "Memorizing training data inflates train accuracy without reflecting how the model handles new inputs."
        },
        {
          question: "What is the defining symptom of overfitting?",
          options: [
            "Both train and test accuracy are low",
            "High training accuracy paired with much lower test accuracy",
            "Test accuracy higher than training accuracy",
            "The model trains very slowly"
          ],
          correct_index: 1,
          explanation: "Overfitting shows up as a large gap: strong on seen data, weak on unseen data."
        },
        {
          question: "Why must the test set stay sealed and untouched during development?",
          options: [
            "To save disk space",
            "Because using it to tune choices leaks it into training and inflates the reported number",
            "Because test data is always smaller",
            "So the model trains faster"
          ],
          correct_index: 1,
          explanation: "Once you make decisions based on the test score, it's effectively training data and no longer an honest measure."
        }
      ],
      participation_activities: [
        {
          activity_title: "Split sense-check",
          questions: [
            { question: "A model that scores 100% on training data is guaranteed to perform well in production.", type: "true_false", correct_answer: "false", explanation: "It may have memorized the training set; only held-out test accuracy reflects real performance." },
            { question: "Performing well on inputs the model never saw during training is called ______.", type: "fill_in", correct_answer: "generalization", explanation: "Generalization is the real goal, measured on the held-out test set." }
          ]
        }
      ],
      starter_code: `def diagnose(train_acc, test_acc):
    gap = train_acc - test_acc
    # overfitting: gap > 0.10
    # underfitting: train_acc < 0.70
    # otherwise: generalizing
    return None  # fix

print(diagnose(0.99, 0.71))
print(diagnose(0.88, 0.85))
print(diagnose(0.55, 0.54))`,
      solution_code: `def diagnose(train_acc, test_acc):
    gap = train_acc - test_acc
    if gap > 0.10:
        return "overfitting"
    if train_acc < 0.70:
        return "underfitting"
    return "generalizing"

print(diagnose(0.99, 0.71))
print(diagnose(0.88, 0.85))
print(diagnose(0.55, 0.54))`,
      expected_output: `overfitting
generalizing
underfitting`,
      step_throughs: [
        {
          title: "diagnosing a fine-tune from two numbers",
          steps: [
            { label: "Split before training", detail: "Reserve a held-out slice the model will never learn from. Everything downstream depends on this set staying sealed.", code: "train, test = split(data, 0.8)  # 80/20" },
            { label: "Train, then measure both", detail: "Fit on the training portion, then score on both the training set and the untouched test set.", code: "train_acc = 0.99   test_acc = 0.71" },
            { label: "Compute the gap", detail: "Subtract test from train. The size of the gap is the diagnosis, not either number alone.", code: "gap = 0.99 - 0.71 = 0.28" },
            { label: "Read the verdict", detail: "A large gap with high train accuracy means the model memorized the training set instead of the rule.", code: "gap 0.28 > 0.10  ->  overfitting" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A fine-tune scores 0.92 on the training set and 0.90 on the held-out test set. Is it overfitting?",
          steps: [
            "Compute the gap: 0.92 - 0.90 = 0.02.",
            "A gap of 0.02 is tiny — the model performs almost as well on unseen data as on seen data.",
            "Small gap plus solid test accuracy means it learned the general rule, not the answer key."
          ],
          output: "No — a 0.02 gap with high test accuracy means it's generalizing well."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two candidate fine-tunes: Model A scores train 0.99 / test 0.74; Model B scores train 0.86 / test 0.84. Which would you ship, and why is the higher training score a trap?",
          steps: [
            "Model A's gap is 0.99 - 0.74 = 0.25 — a huge gap, the fingerprint of overfitting.",
            "Model B's gap is 0.86 - 0.84 = 0.02 — it generalizes.",
            "Production performance is predicted by test accuracy, not train accuracy: B's 0.84 beats A's 0.74.",
            "A's higher training number is a trap because it reflects memorization of the training set, which users never send."
          ],
          output: "Ship Model B: its test accuracy (0.84) is higher and its small gap shows it generalizes, while A overfit."
        }
      ],
      comparison_tables: [
        {
          title: "underfitting vs generalizing vs overfitting",
          columns: ["State", "Train accuracy", "Test accuracy", "What to do"],
          rows: [
            { cells: ["Underfitting", "Low", "Low", "Train more / better data; model learned too little"] },
            { cells: ["Generalizing", "High", "High (small gap)", "Ship it — the goal"], highlight: true },
            { cells: ["Overfitting", "Very high", "Much lower", "More/varied data, less training; it memorized"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "sort each signal by what it diagnoses",
          bins: [
            { id: "over", label: "Overfitting" },
            { id: "gen", label: "Healthy generalization" }
          ],
          items: [
            { id: "i1", text: "Train 0.99, test 0.70", bin: "over" },
            { id: "i2", text: "Train 0.87, test 0.85", bin: "gen" },
            { id: "i3", text: "Aces seen data, fails new inputs", bin: "over" },
            { id: "i4", text: "Small gap between train and test", bin: "gen" },
            { id: "i5", text: "Memorized training quirks", bin: "over" },
            { id: "i6", text: "Learned the underlying rule", bin: "gen" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a model with 100% training accuracy tell you almost nothing about how it will perform for real users?",
          sampleAnswer: "A model can reach 100% on training data simply by memorizing every example it was shown, including their specific quirks, without ever learning the general rule. Real users send inputs the model has never seen, so what matters is whether it generalizes — and the training score can't reveal that because those answers were available during learning. Only a held-out test set, untouched during training, stands in for the unseen real world and gives an honest read."
        }
      ],
      hints: [
        "Compute gap = train_acc - test_acc first.",
        "Check the overfitting condition (gap > 0.10) before the underfitting one.",
        "If neither special case fires, the model is generalizing."
      ],
      challenge_title: "The Overfit Detector",
      challenge_description: "Diagnose a batch of fine-tune runs from their train/test gaps and find the run that generalizes best.",
      challenge_difficulty: "beginner",
      challenge_story: "Your team kicked off a sweep of fine-tune experiments overnight, each with different data and training settings, and every run logged its accuracy on both the training set and the sealed held-out test set. Now you have a stack of (train, test) numbers and one decision to make: which run actually generalizes, and which ones just memorized their training data? Build the detector that flags overfitting runs by their train-minus-test gap and surfaces the single run with the best honest performance — the one you'd actually ship.",
      challenge_statement: "You are given **N** fine-tune runs. Each run reports two integer percentages: `train` accuracy and `test` accuracy. Runs are numbered `1..N` in input order.\n\nYou are also given a `gap_threshold` percentage. A run is **overfitting** when `train - test > gap_threshold`.\n\nDo two things:\n\n1. Count how many runs are overfitting.\n2. Find the run with the highest `test` accuracy (the best generalizer). If several tie on test accuracy, pick the one with the **lowest** run number.",
      challenge_input_format: "Line 1: integer `N`. Line 2: integer `gap_threshold` (a percentage). Each of the next `N` lines has two space-separated integer percentages: `train test`.",
      challenge_output_format: "Two lines:\n1. The number of overfitting runs.\n2. Two space-separated integers: the run number of the best generalizer then its test accuracy.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ gap_threshold ≤ 100",
        "0 ≤ train, test ≤ 100"
      ],
      challenge_examples: [
        { input: "3\n10\n98 80\n85 83\n99 70", output: "2\n2 83", explanation: "Gaps: run 1 = 18 (>10, overfit), run 2 = 2 (ok), run 3 = 29 (>10, overfit). Two overfit. Highest test accuracy is run 2 at 83." },
        { input: "2\n5\n90 90\n80 70", output: "1\n1 90", explanation: "Run 1 gap 0, run 2 gap 10 which is >5 → overfitting, so 1 overfit run. Best test accuracy is run 1 at 90." }
      ],
      challenge_notes: "The overfitting test is strict (`>`), so a gap exactly equal to the threshold does not count as overfitting. For the best generalizer, iterate once tracking the max test accuracy seen so far and only replacing on a strictly greater value — that naturally keeps the lowest run number on ties.",
      challenge_hints: [
        "Read N and gap_threshold, then loop N times reading train and test as ints.",
        "Increment an overfit counter whenever `train - test > gap_threshold`.",
        "Track the best test accuracy and its 1-based index; only update when you see a strictly higher test value."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    gap_threshold = int(data[idx]); idx += 1
    overfit = 0
    best_test = -1
    best_id = -1
    for i in range(1, n + 1):
        parts = data[idx].split(); idx += 1
        train = int(parts[0])
        test = int(parts[1])
        # TODO: a run overfits when train - test > gap_threshold (overfit += 1).
        # Track the best generalizer: update best_test/best_id only when this
        # run's test is strictly greater (so ties keep the lowest run number).

    print(overfit)
    print(f"{best_id} {best_test}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    gap_threshold = int(data[idx]); idx += 1
    overfit = 0
    best_test = -1
    best_id = -1
    for i in range(1, n + 1):
        parts = data[idx].split(); idx += 1
        train = int(parts[0])
        test = int(parts[1])
        if train - test > gap_threshold:
            overfit += 1
        if test > best_test:
            best_test = test
            best_id = i
    print(overfit)
    print(f"{best_id} {best_test}")

main()
`,
      challenge_test_cases: [
        { input: "3\n10\n98 80\n85 83\n99 70", expected_output: "2\n2 83", description: "Two runs exceed the gap threshold; run 2 generalizes best." },
        { input: "2\n5\n90 90\n80 70", expected_output: "1\n1 90", description: "A gap exactly above the threshold counts; run 1 has the best test score." },
        { input: "3\n10\n70 70\n60 60\n70 70", expected_output: "0\n1 70", description: "Edge: tie on top test accuracy resolves to the lowest run number; none overfit." },
        { input: "1\n0\n50 50", expected_output: "0\n1 50", description: "Edge: zero gap with a zero threshold is not overfitting (strict greater-than)." }
      ]
    },
    {
      id: "ai-08-l8",
      project_id: "ai-08",
      order: 8,
      title: "Tracking Evals Over Time",
      concept: "Tracking",
      xp_reward: 10,
      explanation: `A single eval score is a snapshot. The real value shows up when you have a hundred of them, lined up by version, and you can finally answer the question every AI team argues about: "did we actually get better, or does it just feel that way?" A prompt change here, a model upgrade there, a new few-shot example — without a record, you're relitigating the same debate every week. Tracking turns scattered runs into a trend line.

## What it is

**Eval tracking** is recording every eval run — tagged with what produced it — so you can compare scores across versions over time. Each entry is a row: which **prompt version** or **model version** was tested, when, and what it scored. Together they form a **regression dashboard**: a history that shows whether each change moved the number up, down, or nowhere.

The unit of comparison is the *version*. You change one thing (the prompt, the model, the temperature), re-run the same frozen eval set, and log the result against that version label. Same yardstick, different version — that's what makes the comparison fair.

## How it works

You keep a list of runs in order and walk it, comparing each score to the one before. A drop from one version to the next is a **regression** — the thing you most want to catch:

\`\`\`python
runs = [
    ("v1.0-prompt", 0.78),
    ("v1.1-prompt", 0.83),
    ("v1.2-model",  0.79),   # regression: dropped from 0.83
    ("v1.3-prompt", 0.88),
]

prev = None
best = max(runs, key=lambda r: r[1])
for version, score in runs:
    flag = ""
    if prev is not None and score < prev:
        flag = f"  REGRESSION (was {prev})"
    print(f"{version}: {score}{flag}")
    prev = score
print(f"best so far: {best[0]} at {best[1]}")
\`\`\`

The dashboard shows v1.2 dipped — a model swap that looked like an upgrade actually hurt the eval — and that v1.3 is the new high-water mark. Without the history, the v1.2 regression sails by unnoticed.

## Why it matters

Memory lies and vibes drift. Three weeks into a project nobody remembers whether the "improved" system prompt actually beat the original or just felt fresher — the trend line settles it with data. Tracking also makes regressions **attributable**: when the number drops, the version tag tells you exactly which change to blame, so you bisect in one glance instead of guessing. It turns the **best score** into a defensible baseline you can gate against (lesson 5), and it exposes slow erosion — the death-by-a-thousand-tweaks decline where each change costs half a point and nobody notices until you're ten points down. A chart of score-by-version is the difference between *managing* an AI system and *hoping*.

## The mental model to keep

One eval score answers "how good is it right now?" A tracked history answers "are we getting better?" — the only question that matters across a project's life. Log every run against its version, watch the trend, and let the dashboard, not your memory, tell you the truth.`,
      key_terms: [
        { term: "Eval tracking", definition: "Recording every eval run tagged with the version that produced it, so scores can be compared across time." },
        { term: "Regression dashboard", definition: "A history of eval scores by version that shows whether each change moved the number up, down, or nowhere." },
        { term: "Version", definition: "A labeled state of the system (prompt, model, or settings) tested against the same eval set for a fair comparison." },
        { term: "Regression", definition: "A drop in the eval score from one version to the next — the thing tracking is built to catch." }
      ],
      callouts: [
        {
          type: "insight",
          title: "Vibes drift, the trend line doesn't",
          content: "Three weeks in, nobody remembers if the 'improved' prompt actually beat the original. A chart of score-by-version settles the argument with data instead of memory.",
          position: "before"
        },
        {
          type: "tip",
          title: "Tag every run with its version",
          content: "A score with no version label is almost useless later. Always record which prompt/model produced it so a regression is attributable to a single change.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "From scattered runs to a trend",
        steps: [
          { label: "Change one thing", desc: "Edit the prompt, swap the model, or tune a setting." },
          { label: "Re-run the eval", desc: "Score against the same frozen eval set." },
          { label: "Log with version", desc: "Record the score tagged with the version label." },
          { label: "Compare over time", desc: "Read the trend; flag any drop as a regression." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why tag each eval score with a version label?",
          options: ["To make the dashboard look busier", "So a score drop is attributable to a specific change", "To make the eval run faster"],
          correct_index: 1,
          explanation: "The version tag tells you exactly which change to blame when the number moves."
        }
      ],
      quiz_questions: [
        {
          question: "What does eval tracking let you answer that a single eval score cannot?",
          options: [
            "How fast the model responds",
            "Whether the system is getting better or worse over time",
            "How many tokens a prompt uses",
            "Which GPU the model runs on"
          ],
          correct_index: 1,
          explanation: "A single score is a snapshot; a tracked history reveals the trend across versions."
        },
        {
          question: "On a regression dashboard, what counts as a regression?",
          options: [
            "Any version with a long name",
            "A version whose score is lower than the previous version's",
            "The first version ever logged",
            "A version that uses a new model"
          ],
          correct_index: 1,
          explanation: "A regression is a drop in the eval score from one version to the next."
        },
        {
          question: "Why must each version be re-run against the same frozen eval set?",
          options: [
            "To save storage space",
            "So the comparison is fair — same yardstick, only the version changes",
            "Because eval sets expire over time",
            "To make older versions look worse"
          ],
          correct_index: 1,
          explanation: "Changing the eval set between runs would make score differences meaningless; the set must stay fixed."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tracking habits",
          questions: [
            { question: "Comparing eval scores across versions requires keeping the eval set the same between runs.", type: "true_false", correct_answer: "true", explanation: "Only a fixed yardstick makes version-to-version score differences meaningful." },
            { question: "A drop in the eval score from one version to the next is called a ______.", type: "fill_in", correct_answer: "regression", explanation: "Catching regressions is the core purpose of an eval-tracking dashboard." }
          ]
        }
      ],
      starter_code: `runs = [
    ("v1.0-prompt", 0.78),
    ("v1.1-prompt", 0.83),
    ("v1.2-model",  0.79),
    ("v1.3-prompt", 0.88),
]

prev = None
best = max(runs, key=lambda r: r[1])
for version, score in runs:
    flag = ""
    # mark a regression when this score is below the previous one
    if None:  # fix this condition
        flag = f"  REGRESSION (was {prev})"
    print(f"{version}: {score}{flag}")
    prev = score
print(f"best so far: {best[0]} at {best[1]}")`,
      solution_code: `runs = [
    ("v1.0-prompt", 0.78),
    ("v1.1-prompt", 0.83),
    ("v1.2-model",  0.79),
    ("v1.3-prompt", 0.88),
]

prev = None
best = max(runs, key=lambda r: r[1])
for version, score in runs:
    flag = ""
    if prev is not None and score < prev:
        flag = f"  REGRESSION (was {prev})"
    print(f"{version}: {score}{flag}")
    prev = score
print(f"best so far: {best[0]} at {best[1]}")`,
      expected_output: `v1.0-prompt: 0.78
v1.1-prompt: 0.83
v1.2-model: 0.79  REGRESSION (was 0.83)
v1.3-prompt: 0.88
best so far: v1.3-prompt at 0.88`,
      step_throughs: [
        {
          title: "reading a regression dashboard",
          steps: [
            { label: "Log each run with its version", detail: "Every eval result is stored as a (version, score) pair in the order it ran, building the history.", code: 'runs.append(("v1.2-model", 0.79))' },
            { label: "Walk versions in order", detail: "Step through the runs one at a time, holding onto the previous score to compare against.", code: "for version, score in runs:" },
            { label: "Flag the drops", detail: "When a score falls below the one before it, that version introduced a regression — tag it.", code: "0.79 < 0.83  ->  REGRESSION at v1.2-model" },
            { label: "Surface the best", detail: "Track the highest score seen; it becomes the baseline you gate future changes against.", code: "best = v1.3-prompt @ 0.88" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Versions score in order: 0.80, 0.84, 0.84, 0.81. How many regressions (a score below the immediately previous one) are there?",
          steps: [
            "Compare each version to the one before it.",
            "0.84 vs 0.80: up. 0.84 vs 0.84: equal, not a drop. 0.81 vs 0.84: down — one regression.",
            "Only the final step is a decrease, so the count is 1."
          ],
          output: "1 regression (the drop from 0.84 to 0.81)."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Five versions score 0.90, 0.88, 0.87, 0.86, 0.85 — each change loses one point. No single drop looks alarming. Why is tracking still essential here, and what's the best score you can gate against?",
          steps: [
            "Each step is only a 0.01–0.02 dip, small enough to dismiss in isolation as noise.",
            "But the trend is monotonically down: cumulatively the system fell from 0.90 to 0.85, a five-point erosion.",
            "This 'death by a thousand tweaks' is invisible without a tracked history — memory excuses each small drop.",
            "The best score logged is the very first, 0.90, so that's the baseline a gate should hold the line at."
          ],
          output: "Tracking exposes the slow 5-point erosion no single drop reveals; the best score to gate against is the original 0.90."
        }
      ],
      comparison_tables: [
        {
          title: "no tracking vs a regression dashboard",
          columns: ["Question", "No tracking (memory/vibes)", "Regression dashboard"],
          rows: [
            { cells: ["Did the change help?", "We think so?", "Score went 0.83 -> 0.88, yes"] },
            { cells: ["Which change broke it?", "Guess and bisect by hand", "The version tag names it instantly"], highlight: true },
            { cells: ["Slow erosion over weeks", "Goes unnoticed", "Visible as a downward trend"] },
            { cells: ["Baseline to gate against", "Unknown", "The best logged score" ] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good tracking practice, or anti-pattern?",
          bins: [
            { id: "good", label: "Good practice" },
            { id: "bad", label: "Anti-pattern" }
          ],
          items: [
            { id: "i1", text: "Tag every eval run with its prompt/model version", bin: "good" },
            { id: "i2", text: "Re-run each version on the same frozen eval set", bin: "good" },
            { id: "i3", text: "Change the eval set between version comparisons", bin: "bad" },
            { id: "i4", text: "Keep a history to spot slow erosion", bin: "good" },
            { id: "i5", text: "Rely on memory of how outputs felt last week", bin: "bad" },
            { id: "i6", text: "Log scores with no version label", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a series of tiny, individually-harmless score drops be more dangerous than one big visible drop?",
          sampleAnswer: "A single large drop is obvious and gets investigated immediately, but a string of small drops each looks like noise, so every one gets waved off as 'probably fine.' Without a tracked history you only ever see the latest change in isolation, never the cumulative slide, so the system can erode many points over weeks while everyone believes it's holding steady. A regression dashboard makes the downward trend visible even when no single step looks alarming, which is exactly when you'd otherwise miss it."
        }
      ],
      hints: [
        "Guard against the first iteration where prev is still None.",
        "A regression is when the current score is strictly less than the previous one.",
        "Update prev to the current score at the end of each loop iteration."
      ],
      challenge_title: "The Regression Dashboard",
      challenge_description: "Walk a version history of eval scores: count regressions, find the worst single drop, and report the best version overall.",
      challenge_difficulty: "intermediate",
      challenge_story: "Your eval suite has been running on every prompt and model change for months, and each run logged a version label and an integer score. Today the team wants a dashboard summary before deciding what to ship next. You need three things from the history: how many times a version scored worse than the one right before it (the regressions), which version caused the single biggest drop (the prime suspect to investigate), and which version holds the all-time best score (the baseline to beat). Build the report that turns a raw log into a decision.",
      challenge_statement: "You are given **N** eval runs in chronological order. Each run is a version label and an integer score, separated by a single space (the label may itself contain spaces, but the score is always the last whitespace-separated field).\n\nWalking the history in order, compute:\n\n1. The number of **regressions** — runs whose score is strictly less than the immediately previous run's score.\n2. The **worst drop**: among regressions, the largest `previous_score - score`, and the label of the version that caused it. If there are no regressions, report `NONE`.\n3. The **best version**: the label with the highest score. If several tie on the highest score, report the **earliest** (first in chronological order).",
      challenge_input_format: "Line 1: integer `N`. Each of the next `N` lines is a run: a version label, then the integer score as the final space-separated field.",
      challenge_output_format: "Three lines:\n1. The best version's label and its score, space-separated.\n2. The number of regressions.\n3. The worst-drop version's label and the drop as `-<amount>` (e.g. `v1.2 -3`), or `NONE` if there were no regressions.",
      challenge_constraints: [
        "1 ≤ N ≤ 100000",
        "0 ≤ score ≤ 100",
        "Each line has length ≤ 200",
        "Version labels are non-empty"
      ],
      challenge_examples: [
        { input: "4\nv1.0 70\nv1.1 75\nv1.2 72\nv1.3 80", output: "v1.3 80\n1\nv1.2 -3", explanation: "Scores 70->75 (up), 75->72 (down by 3, a regression), 72->80 (up). One regression; its drop of 3 is the worst, caused by v1.2. Best score is v1.3 at 80." },
        { input: "5\nv1 60\nv2 50\nv3 55\nv4 40\nv5 90", output: "v5 90\n2\nv4 -15", explanation: "Drops: 60->50 (10 at v2) and 55->40 (15 at v4). Two regressions; the 15-point fall at v4 is worst. Best is v5 at 90." }
      ],
      challenge_notes: "Split each line from the right with `line.rsplit(' ', 1)` so a multi-word version label stays intact while the trailing score peels off. Track the previous score to detect regressions, and for ties on the best score keep the first by only replacing when you find a strictly higher value.",
      challenge_hints: [
        "Use `rsplit(' ', 1)` to separate the trailing integer score from the label.",
        "Hold the previous score; when the current is strictly lower, it's a regression — track the largest drop and its label.",
        "Track the best score and its label, updating only on a strictly greater score so ties keep the earliest version."
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    regressions = 0
    worst_drop = 0
    worst_version = ""
    best_score = -1
    best_version = ""
    prev_score = None
    for _ in range(n):
        parts = data[idx].rsplit(' ', 1); idx += 1
        version = parts[0]
        score = int(parts[1])
        # TODO: a regression is when prev_score is not None and score < prev_score
        # (regressions += 1); track the largest prev_score - score in worst_drop
        # and its worst_version. Also track best_score / best_version, updating
        # only on a strictly higher score so ties keep the earliest version.

        prev_score = score
    print(f"{best_version} {best_score}")
    print(regressions)
    if worst_drop > 0:
        print(f"{worst_version} -{worst_drop}")
    else:
        print("NONE")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split('\\n')
    idx = 0
    n = int(data[idx]); idx += 1
    regressions = 0
    worst_drop = 0
    worst_version = ""
    best_score = -1
    best_version = ""
    prev_score = None
    for _ in range(n):
        parts = data[idx].rsplit(' ', 1); idx += 1
        version = parts[0]
        score = int(parts[1])
        if prev_score is not None and score < prev_score:
            regressions += 1
            drop = prev_score - score
            if drop > worst_drop:
                worst_drop = drop
                worst_version = version
        prev_score = score
        if score > best_score:
            best_score = score
            best_version = version
    print(f"{best_version} {best_score}")
    print(regressions)
    if worst_drop > 0:
        print(f"{worst_version} -{worst_drop}")
    else:
        print("NONE")

main()
`,
      challenge_test_cases: [
        { input: "4\nv1.0 70\nv1.1 75\nv1.2 72\nv1.3 80", expected_output: "v1.3 80\n1\nv1.2 -3", description: "One regression; v1.3 holds the best score." },
        { input: "5\nv1 60\nv2 50\nv3 55\nv4 40\nv5 90", expected_output: "v5 90\n2\nv4 -15", description: "Two regressions; the 15-point fall at v4 is the worst drop." },
        { input: "1\nv1 50", expected_output: "v1 50\n0\nNONE", description: "Edge: a single run has no previous score, so no regressions." },
        { input: "3\nv1 80\nv2 80\nv3 80", expected_output: "v1 80\n0\nNONE", description: "Edge: equal scores are not regressions; ties on best resolve to the earliest version." }
      ]
    }
  ]
};
