export default {
  project: {
    id: "ai-08",
    title: "Fine-Tuning & Evals",
    description: "Stop guessing whether your prompt got better — measure it, and learn when fine-tuning actually beats a good prompt.",
    difficulty: "advanced",
    category: "ai_ml",
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
      explanation: `Someone on your team says "the model keeps getting the tone wrong, let's fine-tune it." Nine times out of ten, that's the wrong first move. You probably have a prompt problem, not a model problem.

## What fine-tuning actually is

Fine-tuning takes a base model and nudges its weights using your own examples. You hand it hundreds or thousands of input→output pairs, and it shifts to favor the patterns in your data. The model doesn't gain new knowledge so much as new *habits* — a house style, a rigid output format, a domain vocabulary.

Prompting changes nothing about the model. You just write better instructions at request time. Same weights, different message.

## The honest decision rule

Reach for prompting first. Always. It's faster (minutes vs. days), cheaper (no training run, no dataset to curate), and reversible (edit a string). Try a few-shot prompt with 3–5 good examples before you even think about training.

Fine-tune only when **all** of these are true:

- You've hit a real ceiling with prompting and few-shot examples.
- You have a stable, repetitive task — same shape of input and output every time.
- You can collect at least a few hundred high-quality examples.
- The cost of those examples bloating your prompt (latency + token bill) actually hurts.

## A concrete example

You're classifying support tickets into 12 categories. A few-shot prompt with one example per category works at 84% accuracy but costs 2,000 tokens of examples on every single call. Millions of calls a month. Here fine-tuning earns its keep: bake the 12 patterns into the weights, drop the examples from the prompt, ship a tiny prompt that's faster and cheaper — and often *more* accurate because the model saw way more than 12 examples during training.

Now flip it. You're writing marketing copy in your founder's voice. The task is fuzzy, the "right" answer is subjective, and you have nine examples. Don't fine-tune. Put those nine examples in the prompt and iterate.

\`\`\`python
# Decision in code form
def should_fine_tune(prompt_maxed_out, examples, task_is_stable, high_volume):
    return prompt_maxed_out and examples >= 300 and task_is_stable and high_volume

print(should_fine_tune(True, 500, True, True))   # earns its keep
print(should_fine_tune(False, 9, False, False))  # just prompt it
\`\`\`

Most teams never need to fine-tune. They need a better prompt and a way to measure it — which is the rest of this module.`,
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
      explanation: `You tweaked the prompt. Output *feels* better. Does it? You have no idea — and "feels better" is how teams ship regressions. An eval is the fix: a repeatable test that turns a vague hunch into a number.

## The definition

An eval is just a unit test for an AI system. It's three parts:

1. **A dataset** — inputs paired with what good looks like (the reference, or "ground truth").
2. **A task** — run each input through your model + prompt.
3. **A scorer** — compare the model's output to the reference and produce a score.

Run it, get a number like "87% correct." Change the prompt, run it again, see if the number went up or down. That's the whole game. Without it you're flying blind.

## Why this is harder than normal tests

A normal unit test checks \`add(2, 2) == 4\`. Exact match. AI outputs are fuzzy — "The capital is Paris." and "Paris" are both right. So your scorer has to be smarter than \`==\`. You'll pick a scoring method that fits the task:

- **Exact match** — for classification or structured fields where there's one right token.
- **Contains / keyword** — does the answer include the required fact?
- **Fuzzy / similarity** — for free-form text, compare meaning, not characters.
- **LLM-as-judge** — have a model grade the output against a rubric (next lesson).

## The smallest useful eval

Don't overthink the first one. Ten hand-picked examples beat zero. Here's an eval with exact-match scoring:

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

The model nailed two and missed one (it said the sky is gray). Score: 0.67. Now if you change the prompt and the score climbs to 1.00, you have *evidence*, not vibes.

## Make it a habit

Run your eval on every prompt change, like running tests before a commit. The first time it catches a regression you almost shipped, you'll never go back to eyeballing.`,
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
      explanation: `Your model answers "The capital of France is Paris." Your reference says "Paris." Exact match scores that *wrong*. The answer is perfect. The scorer is dumb. Picking the right scorer is most of the work in evals.

## Three scorers, in order of looseness

**Exact match.** \`output == expected\`. Use it when there's exactly one acceptable string — a label, an ID, a yes/no. Brutal but unambiguous.

**Substring / contains.** Did the output include the required answer? \`expected.lower() in output.lower()\`. This rescues the Paris case: "Paris" is inside "The capital of France is Paris." Great when the model is allowed to be chatty as long as it says the right thing. Watch out — "not Paris" also contains "Paris," so contains-scorers can be fooled by negation.

**Similarity.** For free-form text where wording varies, score how *similar* two strings are. A cheap, dependency-free option is token overlap: split into words, measure how much they share. Real systems use embedding cosine similarity, but the idea is the same — closer meaning, higher score.

## Token overlap (Jaccard)

Jaccard similarity is the size of the word intersection over the size of the union. Identical sentences score 1.0; totally different ones score 0.0.

\`\`\`python
def jaccard(a, b):
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)

ref = "the capital of france is paris"
out = "paris is the capital of france"
print(round(jaccard(ref, out), 2))   # same words, different order

out2 = "the capital of france is lyon"
print(round(jaccard(ref, out2), 2))  # one word off
\`\`\`

The first pair has identical word sets, so 1.0. The second swaps "paris" for "lyon" — five shared words out of seven total, so about 0.71. Order doesn't matter to Jaccard, which is both its strength (robust to rephrasing) and weakness (it'd score "dog bites man" and "man bites dog" identical).

## Pick the loosest scorer that still catches real errors

Too strict (exact match on chatty output) and you'll get false failures that hide real progress. Too loose (contains, fooled by negation) and you'll pass broken outputs. The art is choosing the tightest scorer that doesn't punish acceptable variation. When no string scorer fits — subjective quality, reasoning, tone — you escalate to an LLM judge, which is the next lesson.`,
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
      explanation: `Some answers can't be string-matched. "Was this customer reply empathetic?" "Is this summary faithful to the source?" There's no reference string to compare against. So you do the thing that sounds like cheating but works: you ask a model to grade the output.

## The idea

An LLM judge is a second model call whose only job is scoring. You give it the input, the model's output, and a **rubric**, and you ask for a score. Done well, it correlates surprisingly closely with human raters — and it runs in seconds across thousands of cases.

The trick is the rubric. A vague prompt ("rate this 1–10") gives noisy, drifting scores. A sharp rubric with explicit criteria and a forced output format gives stable ones.

## Anatomy of a good judge prompt

- **Crisp criteria.** Spell out what each score means. "1 = factually wrong, 3 = partially correct, 5 = fully correct and complete." Don't make the judge invent the scale.
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

## Don't trust the judge blindly

A judge is a model, so it has biases. It tends to favor longer answers, can be swayed by confident tone, and may inflate scores for outputs that *sound* right. Before you rely on a judge, **validate it**: grade ~30 cases by hand, then check the judge agrees with you. If it doesn't, tighten the rubric and try again. A judge you haven't calibrated against humans is just a fancy random number.

Used right, an LLM judge is the bridge between "this is too subjective to test" and "here's a number that tracks quality." That's how you eval the fuzzy stuff.`,
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
      explanation: `One eval is a test. An eval *suite* is your safety net — the thing you run before every prompt change so you catch regressions before users do. Let's wire the pieces from this module into one runnable harness.

## What a suite gives you

A single number hides where you broke. A suite reports per-case results *and* an aggregate, so when the score drops you can see exactly which inputs regressed. That's the difference between "something got worse" and "the negation cases broke."

A solid suite has four moving parts:

- **Cases** — each with an input, an expected reference, and which scorer to use.
- **A runner** — loops cases, calls the model, applies the scorer.
- **Per-case output** — pass/fail with the actual vs. expected, for debugging.
- **An aggregate** — overall pass rate, the headline number you track over time.

## A complete mini-suite

This pulls together exact match and contains scoring into one runner, with a stubbed model so it's fully deterministic.

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

## Run it like a test

Drop this in CI or run it before each prompt edit. Set a threshold — say, the suite must stay at or above its last pass rate. If a change drops the number, you don't ship it. Grow the suite by adding every real-world failure you find as a new case, so the same bug can never sneak back. That's a regression test for AI, and it's the single highest-leverage habit in this whole module.`,
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
