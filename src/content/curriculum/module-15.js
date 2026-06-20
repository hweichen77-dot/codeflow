export default {
  project: {
    id: "ai-15",
    title: "Advanced Prompting Patterns",
    description: "Move past one-shot prompts into reliable patterns: chain of thought, few-shot, self-consistency, ReAct, and decomposition. Each pattern is a tool for squeezing more correctness out of the same model.",
    difficulty: "intermediate",
    category: "prompting",
    estimated_time: 50,
    lessons_count: 8,
    tags: ["prompting", "chain-of-thought", "few-shot", "react", "reasoning"],
    order: 11,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-15-l1",
      project_id: "ai-15",
      order: 1,
      title: "Chain of Thought",
      concept: "CoT",
      xp_reward: 10,
      explanation: `Ask a model "What is 17 times 24?" and it often blurts a wrong number. Add four words — "Let's think step by step" — and the same model quietly works it out and lands on 408. Nothing changed inside the model. You changed what it wrote first, and that changed everything.

## What it is

**Chain of thought (CoT)** is a prompting pattern where you ask the model to write out its intermediate reasoning before giving a final answer. Instead of jumping straight to a conclusion, the model produces a visible trail of steps, and the answer falls out at the end of that trail.

The reason this works comes straight from how models generate text. A model can only "think" by writing tokens — there is no hidden scratchpad. When you force the answer on the first token, the model has done zero computation toward it. When you let it write steps first, each step becomes context the next token can build on. **The reasoning isn't decoration; it is the computation.**

## How it works

There are two flavors:

- **Zero-shot CoT.** You append a trigger phrase like "Let's think step by step." No examples needed. The phrase nudges the model into a step-by-step continuation because that pattern is common in its training data.
- **Few-shot CoT.** You show one or two worked examples that include reasoning, then ask your real question. The model imitates the reasoning style it just saw.

Here is the zero-shot version in a prompt:

\`\`\`python
prompt = (
    "Q: A shop has 3 boxes of 12 apples and sells 17. "
    "How many are left?\\n"
    "A: Let's think step by step."
)
# The model now writes: 3 x 12 = 36, then 36 - 17 = 19, then "Answer: 19"
\`\`\`

The trigger doesn't make the model smarter. It changes the *shape* of the output so that the hard part is computed across several tokens instead of crammed into one.

## Why it matters

CoT moves the needle most on multi-step problems: arithmetic, logic puzzles, word problems, and anything requiring a chain of deductions.

- **It trades tokens for accuracy.** Reasoning text costs output tokens and latency. For a simple lookup it is wasted money; for a multi-step problem it is the difference between right and wrong.
- **It makes errors inspectable.** When the answer is wrong, you can read the steps and see *where* it went off the rails — impossible with a one-word answer.
- **It can be hidden.** Many production systems ask for reasoning, then strip it out and show only the final answer to the user.

The catch: more reasoning is not always better. On trivial tasks CoT can introduce errors by overthinking, and a confidently wrong chain of reasoning still produces a confidently wrong answer.

## The mental model to keep

**The model thinks by writing. Give it room to write the steps, and you give it room to think.**`,
      key_terms: [
        { term: "Chain of thought", definition: "A prompting pattern that asks the model to write intermediate reasoning before its final answer." },
        { term: "Zero-shot CoT", definition: "Triggering step-by-step reasoning with a phrase like 'Let's think step by step', using no examples." },
        { term: "Few-shot CoT", definition: "Showing worked examples that include reasoning so the model imitates that reasoning style." },
        { term: "Reasoning trace", definition: "The visible series of intermediate steps the model writes on its way to the answer." }
      ],
      callouts: [
        { type: "analogy", title: "Show your work", content: "It's the same rule your math teacher had: solve it in your head and you'll fumble; write each step and the answer almost falls out. The model has no scratchpad except the tokens it writes.", position: "before" },
        { type: "insight", title: "Reasoning is the computation", content: "The steps aren't a polite explanation added after the fact. Each step is context the next token computes from. Take the steps away and you take the thinking away.", position: "after" }
      ],
      concept_diagram: {
        title: "How chain of thought produces a better answer",
        steps: [
          { label: "Ask + trigger", desc: "Pose the question and add 'Let's think step by step.'" },
          { label: "Write step 1", desc: "The model commits a first intermediate result to text." },
          { label: "Build on it", desc: "Each later step conditions on the steps already written." },
          { label: "Emit final answer", desc: "The answer falls out at the end of the reasoning trail." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does writing reasoning steps actually help the model?",
          options: ["It looks more professional to the user", "Each step becomes context the next token can compute from", "It makes the model train on your data"],
          correct_index: 1,
          explanation: "A model thinks by writing tokens; the steps are the computation, not decoration."
        }
      ],
      quiz_questions: [
        {
          question: "What is the core difference between zero-shot and few-shot chain of thought?",
          options: [
            "Zero-shot uses a smaller model",
            "Zero-shot uses a trigger phrase with no examples; few-shot supplies worked reasoning examples",
            "Few-shot skips the reasoning entirely",
            "Zero-shot only works on math"
          ],
          correct_index: 1,
          explanation: "Zero-shot CoT relies on a phrase like 'Let's think step by step'; few-shot CoT shows examples that include reasoning to imitate."
        },
        {
          question: "On which kind of task does chain of thought help the LEAST?",
          options: [
            "A multi-step word problem",
            "A logic puzzle with several deductions",
            "A trivial one-step lookup",
            "A multi-stage arithmetic question"
          ],
          correct_index: 2,
          explanation: "For trivial single-step tasks CoT mostly wastes tokens and can even introduce overthinking errors."
        },
        {
          question: "A CoT answer is wrong. What advantage does the reasoning trace give you?",
          options: [
            "It guarantees the next answer will be right",
            "You can read the steps and see where it went off the rails",
            "It refunds the tokens you spent",
            "It hides the mistake from the user automatically"
          ],
          correct_index: 1,
          explanation: "A visible reasoning trail makes errors inspectable; you can locate the faulty step."
        }
      ],
      participation_activities: [
        {
          activity_title: "Chain of thought check",
          questions: [
            { question: "Chain of thought makes the model smarter by changing its internal weights.", type: "true_false", correct_answer: "false", explanation: "The weights are frozen; CoT only changes the shape of the output so computation spreads across tokens." },
            { question: "The zero-shot CoT trigger phrase commonly used is 'Let's think ______ by step.'", type: "fill_in", correct_answer: "step", explanation: "'Let's think step by step' nudges the model into a step-by-step continuation." }
          ]
        }
      ],
      starter_code: `# Compare a "blurt the answer" prompt with a "show your steps" prompt.
question = "A shop has 3 boxes of 12 apples and sells 17. How many are left?"

direct_prompt = question + " Answer with just a number."
# TODO: build a chain-of-thought prompt by appending the trigger phrase.
print(direct_prompt)
`,
      solution_code: `question = "A shop has 3 boxes of 12 apples and sells 17. How many are left?"

direct_prompt = question + " Answer with just a number."
cot_prompt = question + " Let's think step by step."

print(direct_prompt)
print(cot_prompt)
`,
      expected_output: `A shop has 3 boxes of 12 apples and sells 17. How many are left? Answer with just a number.
A shop has 3 boxes of 12 apples and sells 17. How many are left? Let's think step by step.`,
      step_throughs: [
        {
          title: "from question to answer, one step at a time",
          steps: [
            { label: "Pose the question + trigger", detail: "You ask a multi-step problem and append the trigger so the model starts reasoning instead of guessing.", code: '"... How many are left? Let\'s think step by step."' },
            { label: "Write the first step", detail: "The model commits an intermediate result to text. Now that number is in context for the rest.", code: '"There are 3 x 12 = 36 apples."' },
            { label: "Build on what's written", detail: "The next step conditions on the 36 already produced, not on the original question alone.", code: '"After selling 17: 36 - 17 = 19."' },
            { label: "Emit the final answer", detail: "The answer falls out at the end of the trail, computed across several tokens rather than crammed into one.", code: '"Answer: 19"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You ask a model "What is 12 plus 13 plus 14?" and want a reliable answer. Why does adding "Let\'s think step by step" help here?',
          steps: [
            "Summing three numbers is a multi-step task even though it looks small.",
            "Without the trigger, the model must produce the total on the very first token, before any partial sums exist.",
            "With the trigger it writes 12 + 13 = 25, then 25 + 14 = 39, each partial sum available to the next step."
          ],
          output: "The trigger lets the model compute partial sums in text, so the final total is built up instead of guessed."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Your support bot answers 'What's our return window?' from a one-line policy. A teammate wants to add chain of thought to 'improve accuracy.' Good idea?",
          steps: [
            "This is a single-step lookup: find one fact and state it. There is no chain of deductions to make.",
            "CoT spends extra output tokens and latency producing reasoning the task does not need.",
            "Worse, the model may overthink and wander, introducing errors into what was a clean lookup.",
            "Reserve CoT for genuinely multi-step problems; for direct lookups, ask for the answer plainly."
          ],
          output: "No. CoT helps multi-step reasoning, not single-fact lookups, where it wastes tokens and can add errors."
        }
      ],
      comparison_tables: [
        {
          title: "direct answer vs chain of thought",
          columns: ["Aspect", "Direct answer", "Chain of thought"],
          rows: [
            { cells: ["Output tokens", "Few", "Many (the reasoning)"] },
            { cells: ["Multi-step accuracy", "Often wrong", "Usually much better"] },
            { cells: ["Trivial lookups", "Fast and fine", "Wasteful, can overthink"] },
            { cells: ["Debuggability", "Black box", "Steps are inspectable"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "should you reach for chain of thought?",
          bins: [
            { id: "use", label: "CoT helps" },
            { id: "skip", label: "Skip CoT" }
          ],
          items: [
            { id: "i1", text: "A multi-step word problem", bin: "use" },
            { id: "i2", text: "Looking up one fact from a policy line", bin: "skip" },
            { id: "i3", text: "A logic puzzle with chained deductions", bin: "use" },
            { id: "i4", text: "Echoing a value the user already gave", bin: "skip" },
            { id: "i5", text: "Multi-stage arithmetic", bin: "use" },
            { id: "i6", text: "Returning a yes/no on a single condition", bin: "skip" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does forcing the model to answer on the very first token tend to produce worse results on hard problems?",
          sampleAnswer: "A model can only compute by writing tokens, so when you demand the answer immediately it has done no work toward it yet — the answer is a pure guess. Letting it write intermediate steps first turns each step into context the next token can build on, spreading the hard computation across many tokens instead of cramming it into one."
        }
      ],
      hints: [
        "The direct prompt already exists; build the CoT one the same way.",
        "Append the string ' Let's think step by step.' to the question.",
        "Print both prompts so you can compare what changed."
      ],
      challenge_title: "Audit the Scratchpad",
      challenge_description: "Verify a model's chain-of-thought arithmetic and flag the first step where its reasoning breaks.",
      challenge_story: "Your eval harness logs the **scratchpad** a model writes when it reasons step by step. Each line is one reasoning step: it takes the running value from the line above, applies one operation, and claims a result. When the final answer is wrong, you don't just want to know *that* it failed — you want the **exact step** where the reasoning first went off the rails, because that's the line a human reviewer should read. Build the auditor that walks the chain and pinpoints the first broken link.",
      challenge_statement: "A chain of thought starts from a value and applies `n` steps in order. Each step takes the **accumulator** (the result of the previous step, or the start value for step 1), applies one operation against an operand, and *claims* a result.\n\nWalk the chain top to bottom. For each step, recompute the true result from the current accumulator and compare it to the claimed result. If they differ, the chain breaks at that step.\n\n- If every step checks out, print `VALID` followed by the final accumulator.\n- Otherwise print `WRONG` followed by the **1-based index** of the first step whose claimed result is incorrect, and stop.\n\nOperators are `+`, `-`, `*`, and `/`. Division is **integer floor division** (`//`).",
      challenge_input_format: "The first line has two integers `n start`. Each of the next `n` lines is a step in the form `op operand = claimed`, where `op` is one of `+ - * /`.",
      challenge_output_format: "Either `VALID v` where `v` is the final accumulator, or `WRONG i` where `i` is the 1-based index of the first incorrect step.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "-1000000000 ≤ start, operand, claimed ≤ 1000000000",
        "A `/` step never divides by zero",
      ],
      challenge_examples: [
        { input: "3 7\n* 6 = 42\n- 2 = 40\n+ 8 = 48", output: "VALID 48", explanation: "7*6=42 ✓, 42-2=40 ✓, 40+8=48 ✓. Every step holds, final value 48." },
        { input: "2 100\n/ 4 = 25\n+ 5 = 31", output: "WRONG 2", explanation: "100//4=25 ✓, but 25+5=30, not the claimed 31, so the chain first breaks at step 2." },
      ],
      challenge_notes: "This is exactly why chain of thought helps: each step is a small, checkable computation. A direct answer gives you nothing to audit; an exposed chain lets you localize the error. Use `//` for floor division so results stay exact integers — no floats.",
      challenge_hints: [
        "Carry an `acc` variable; for step 1 it starts at `start`, then it becomes each verified claimed value.",
        "Recompute the true result for the step's operator and compare to the claimed value before trusting it.",
        "On the first mismatch, print `WRONG` and the 1-based index, then stop immediately.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, start = map(int, data[0].split())
    steps = []
    for i in range(1, n + 1):
        parts = data[i].split()      # "op operand = claimed"
        steps.append((parts[0], int(parts[1]), int(parts[3])))
    # parse done: 'steps' is a list of (op, operand, claimed); acc starts at 'start'

    acc = start
    # TODO: walk steps in order; recompute the true result from acc for each op
    # (+ - * and // for /), compare to claimed. Print "WRONG i" at the first
    # mismatch (1-based) and stop; otherwise print "VALID acc" at the end.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, start = map(int, data[0].split())
    acc = start
    for i in range(1, n + 1):
        parts = data[i].split()
        op = parts[0]
        b = int(parts[1])
        claimed = int(parts[3])
        if op == "+":
            actual = acc + b
        elif op == "-":
            actual = acc - b
        elif op == "*":
            actual = acc * b
        else:
            actual = acc // b
        if actual != claimed:
            print(f"WRONG {i}")
            return
        acc = claimed
    print(f"VALID {acc}")

main()
`,
      challenge_test_cases: [
        { input: "3 7\n* 6 = 42\n- 2 = 40\n+ 8 = 48", expected_output: "VALID 48", description: "Every step checks out; prints the final accumulator." },
        { input: "2 100\n/ 4 = 25\n+ 5 = 31", expected_output: "WRONG 2", description: "Step 2 claims 31 but 25+5=30." },
        { input: "1 5\n+ 0 = 5", expected_output: "VALID 5", description: "Single-step chain that holds." },
        { input: "4 0\n+ 10 = 10\n* 3 = 30\n- 30 = 0\n+ 7 = 8", expected_output: "WRONG 4", description: "First three steps hold; step 4 claims 8 but 0+7=7." }
      ]
    },
    {
      id: "ai-15-l2",
      project_id: "ai-15",
      order: 2,
      title: "Few-Shot Done Right",
      concept: "FewShot",
      xp_reward: 10,
      explanation: `You ask a model to classify reviews as positive or negative and it keeps replying with paragraphs of analysis. You didn't want an essay — you wanted one word. The fix isn't a longer instruction. It's two examples. Show it the exact input-output shape twice and it locks onto the pattern instantly.

## What it is

**Few-shot prompting** means putting a handful of worked examples — each an input paired with the exact output you want — directly into the prompt before your real input. The model reads the pattern and continues it. Zero-shot is "just tell it what to do." Few-shot is "show it what done looks like."

This is **in-context learning**: the model adapts to your task from examples in the prompt alone, without any training or weight changes. The examples teach format, tone, edge-case handling, and label vocabulary all at once — things that are awkward to describe in words but trivial to demonstrate.

## How it works

A few-shot prompt is built from three parts: an optional instruction, then example pairs, then your real input left open for the model to complete.

\`\`\`python
prompt = (
    "Classify the sentiment as positive or negative.\\n\\n"
    "Review: The food was cold and slow.\\n"
    "Sentiment: negative\\n\\n"
    "Review: Loved every bite, came back twice.\\n"
    "Sentiment: positive\\n\\n"
    "Review: Best meal I've had all year.\\n"
    "Sentiment:"
)
# The model continues the pattern: " positive"
\`\`\`

Notice the model only has to write one more token to fit the established shape. The examples did the heavy lifting of defining the task.

What makes few-shot work *well*:

- **Consistent format.** Every example uses the same labels and layout. Mixed formats confuse the pattern.
- **Cover the edge cases.** If neutral reviews exist, include a neutral example, or the model won't know that label is allowed.
- **Balance the examples.** All-positive examples bias the model toward predicting positive.
- **Order can matter.** Models sometimes lean toward the label of the last example. Shuffle or balance to reduce this.

## Why it matters

Few-shot is the cheapest reliability upgrade you have. No fine-tuning, no infrastructure — just better prompt content.

- **It pins down format** so you can parse the output reliably in code.
- **It teaches by demonstration**, which beats verbose instructions for fuzzy tasks like tone or style.
- **It costs tokens.** Every example sits in the context window on every call, so there is a real trade-off between more examples and prompt size or cost. Two to five good examples usually beats ten mediocre ones.

The classic mistake is unbalanced or sloppy examples. Garbage examples teach the model garbage patterns, confidently.

## The mental model to keep

**Don't describe the task — demonstrate it. A few clean examples are worth a paragraph of instructions.**`,
      key_terms: [
        { term: "Few-shot prompting", definition: "Including several input-output example pairs in the prompt before the real input." },
        { term: "In-context learning", definition: "The model adapting to a task from examples in the prompt, with no weight changes." },
        { term: "Zero-shot prompting", definition: "Asking the model to perform a task from instructions alone, with no examples." },
        { term: "Recency bias", definition: "A model's tendency to lean toward the label or style of the most recent example." }
      ],
      callouts: [
        { type: "analogy", title: "Show, don't tell", content: "Training a new hire, you don't read them a manual on tone. You hand them three good replies you wrote and say 'like these.' Few-shot is exactly that for the model.", position: "before" },
        { type: "tip", title: "Balance and cover", content: "Include every label you expect (don't forget 'neutral'), keep the format identical across examples, and don't stack them all in one category, or you bias the answer.", position: "after" }
      ],
      concept_diagram: {
        title: "Anatomy of a few-shot prompt",
        steps: [
          { label: "Instruction", desc: "One line naming the task and the allowed outputs." },
          { label: "Example pairs", desc: "Several inputs each paired with the exact desired output." },
          { label: "Open real input", desc: "Your actual input, left for the model to complete." },
          { label: "Pattern completion", desc: "The model continues the established shape with one answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the model actually doing when it 'learns' from few-shot examples?",
          options: ["Updating its weights from your examples", "In-context learning: adapting from the prompt with no weight change", "Saving the examples for future users"],
          correct_index: 1,
          explanation: "Few-shot is in-context learning; the examples shape this one response without any training."
        }
      ],
      quiz_questions: [
        {
          question: "Why does few-shot prompting often beat a long written instruction for fuzzy tasks like tone?",
          options: [
            "Instructions are ignored by the model",
            "Demonstrations show format, labels, and style at once, which is hard to describe in words",
            "Examples use fewer tokens than instructions",
            "The model trusts examples more than text"
          ],
          correct_index: 1,
          explanation: "Examples encode format, vocabulary, and style simultaneously by demonstration rather than description."
        },
        {
          question: "Your few-shot examples are all positive reviews. What's the likely problem?",
          options: [
            "The model will refuse to answer",
            "The model is biased toward predicting positive for new inputs",
            "The prompt uses too few tokens",
            "Positive examples are never allowed"
          ],
          correct_index: 1,
          explanation: "Unbalanced examples bias the model toward the over-represented label."
        },
        {
          question: "What is the main cost of adding more few-shot examples?",
          options: [
            "It retrains the model each call",
            "Each example takes context-window space and tokens on every call",
            "It slows down training",
            "It deletes earlier examples"
          ],
          correct_index: 1,
          explanation: "Examples live in the prompt, so they consume tokens and context on every request."
        }
      ],
      participation_activities: [
        {
          activity_title: "Few-shot sense-check",
          questions: [
            { question: "Few-shot prompting changes the model's weights so it remembers your task next time.", type: "true_false", correct_answer: "false", explanation: "It is in-context learning; nothing is stored and the weights never change." },
            { question: "Adapting to a task from examples in the prompt, with no training, is called in-______ learning.", type: "fill_in", correct_answer: "context", explanation: "In-context learning happens entirely within the prompt." }
          ]
        }
      ],
      starter_code: `# Build a few-shot prompt from example pairs and an open question.
examples = [
    ("The food was cold and slow.", "negative"),
    ("Loved every bite, came back twice.", "positive"),
]
new_review = "Best meal I've had all year."

prompt = "Classify the sentiment as positive or negative.\\n\\n"
# TODO: append each example as "Review: ...\\nSentiment: ...\\n\\n", then the open review.
print(prompt)
`,
      solution_code: `examples = [
    ("The food was cold and slow.", "negative"),
    ("Loved every bite, came back twice.", "positive"),
]
new_review = "Best meal I've had all year."

prompt = "Classify the sentiment as positive or negative.\\n\\n"
for review, label in examples:
    prompt += f"Review: {review}\\nSentiment: {label}\\n\\n"
prompt += f"Review: {new_review}\\nSentiment:"

print(prompt)
`,
      expected_output: `Classify the sentiment as positive or negative.

Review: The food was cold and slow.
Sentiment: negative

Review: Loved every bite, came back twice.
Sentiment: positive

Review: Best meal I've had all year.
Sentiment:`,
      step_throughs: [
        {
          title: "assembling a few-shot prompt",
          steps: [
            { label: "State the task", detail: "One instruction line names the task and the allowed labels so the format is unambiguous.", code: '"Classify the sentiment as positive or negative."' },
            { label: "Add example pairs", detail: "Each example shows an input and the exact output, in identical format, teaching the pattern.", code: '"Review: ... \\nSentiment: negative"' },
            { label: "Leave the real input open", detail: "Your actual input ends with the label key but no value, inviting the model to complete it.", code: '"Review: Best meal... \\nSentiment:"' },
            { label: "Model completes the pattern", detail: "It writes just the missing label, matching the shape the examples established.", code: '" positive"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A zero-shot prompt asking for a one-word sentiment keeps returning full paragraphs. How does adding two example pairs fix it?",
          steps: [
            "The examples show input followed immediately by a single-word label and nothing else.",
            "The model continues that established shape, so its natural completion is also one word.",
            "The format is taught by demonstration rather than fought for with extra instructions."
          ],
          output: "The examples pin the output format to one word, so the model stops writing paragraphs."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your classifier handles positive, negative, and neutral, but your three examples are all positive or negative. Real neutral reviews keep getting labeled positive. What's wrong and how do you fix it?",
          steps: [
            "The 'neutral' label never appears in the examples, so the model has no demonstration that it is even an option.",
            "On top of that, the examples may lean toward positive, adding a bias toward that label.",
            "Add at least one clear neutral example so the label is demonstrated, and balance the set across all three labels.",
            "Optionally shuffle example order so the model doesn't just echo the last example's label (recency bias)."
          ],
          output: "Include a neutral example and balance the labels; an unseen label can't be predicted reliably."
        }
      ],
      comparison_tables: [
        {
          title: "zero-shot vs few-shot prompting",
          columns: ["Aspect", "Zero-shot", "Few-shot"],
          rows: [
            { cells: ["What you give", "Instructions only", "Instructions plus example pairs"] },
            { cells: ["Format control", "Loose, often wanders", "Tight, pinned by examples"] },
            { cells: ["Token cost", "Low", "Higher (examples in context)"] },
            { cells: ["Fuzzy tasks (tone, style)", "Hard to specify", "Easy to demonstrate"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good few-shot habit vs mistake",
          bins: [
            { id: "good", label: "Good habit" },
            { id: "bad", label: "Mistake" }
          ],
          items: [
            { id: "i1", text: "Use identical format across all examples", bin: "good" },
            { id: "i2", text: "Make every example the same label", bin: "bad" },
            { id: "i3", text: "Include an example of each expected label", bin: "good" },
            { id: "i4", text: "Mix different output layouts between examples", bin: "bad" },
            { id: "i5", text: "Balance the labels across the example set", bin: "good" },
            { id: "i6", text: "Forget to demonstrate the 'neutral' label", bin: "bad" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a model handle a label correctly only if that label appears in your few-shot examples?",
          sampleAnswer: "The model continues the pattern it sees in the prompt, and a label it never sees demonstrated isn't part of that pattern, so it has no signal that the label is even allowed. To make 'neutral' a real option you have to show at least one neutral example; otherwise the model defaults to whichever labels it did see."
        }
      ],
      hints: [
        "Loop over the examples list, unpacking each (review, label) pair.",
        "Use an f-string to append 'Review: ...\\nSentiment: ...\\n\\n' for each one.",
        "After the loop, append the new review with 'Sentiment:' left open (no label)."
      ],
      challenge_title: "Few-Shot Classifier",
      challenge_description: "Label new inputs the way a few-shot prompt would: by matching each one to the closest labeled example you were shown.",
      challenge_story: "You're prototyping a sentiment classifier before wiring up a real model. The cheap-and-fast stand-in mimics what a **few-shot prompt** actually does: it generalizes from the handful of labeled examples you put in front of it. Each example is a numeric *feature* (say, a sentiment score the pipeline already computed) paired with a label. A new input gets whatever label its **nearest example** carries — the model has no other signal to go on. Build the classifier so you can sanity-check the label set before spending tokens.",
      challenge_statement: "You're given `k` labeled examples, each a feature value (integer) and a label (string). Then you're given `q` query feature values.\n\nFor each query, assign the label of the example whose feature is **closest** in absolute value. If two examples are equally close, prefer the one with the **smaller feature value**.\n\nPrint one label per query, in order.",
      challenge_input_format: "The first line is integer `k`. Each of the next `k` lines has `feature label` (an integer and a one-word label). The next line is integer `q`. Each of the next `q` lines is one integer query feature.",
      challenge_output_format: "`q` lines, the assigned label for each query in input order.",
      challenge_constraints: [
        "1 ≤ k ≤ 100000",
        "1 ≤ q ≤ 100000",
        "-1000000000 ≤ feature, query ≤ 1000000000",
        "Labels are non-empty strings with no spaces",
      ],
      challenge_examples: [
        { input: "3\n10 positive\n50 neutral\n90 negative\n3\n12\n55\n70", output: "positive\nneutral\nneutral", explanation: "12 is closest to 10 (positive). 55 closest to 50 (neutral). 70 is distance 20 from both 50 and 90 — a tie, so the smaller feature 50 wins (neutral)." },
        { input: "2\n0 cold\n100 hot\n1\n50", output: "cold", explanation: "50 is distance 50 from both; the tie breaks toward the smaller feature 0 (cold)." },
      ],
      challenge_notes: "This is nearest-neighbor classification — and it mirrors the central rule of few-shot prompting: the model can only produce a label it has actually seen demonstrated. Forget to include a label among your examples and no query will ever receive it.",
      challenge_hints: [
        "For each query, scan all examples and track the minimum of `(abs(query - feature), feature)`.",
        "Comparing the tuple `(distance, feature)` handles the tie-break automatically — Python compares the second element only on ties.",
        "Read all input at once and index through it; build the output as a list and join with newlines.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx]); idx += 1
    examples = []
    for _ in range(k):
        feat, label = data[idx].split(); idx += 1
        examples.append((int(feat), label))
    q = int(data[idx]); idx += 1
    queries = [int(data[idx + i]) for i in range(q)]; idx += q
    # parse done: 'examples' is (feature, label) pairs; 'queries' is the q query features

    # TODO: for each query, assign the label of the nearest example by |query - feature|.
    #       Ties go to the smaller feature value. Print one label per query, in order.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx]); idx += 1
    examples = []
    for _ in range(k):
        parts = data[idx].split(); idx += 1
        examples.append((int(parts[0]), parts[1]))
    q = int(data[idx]); idx += 1
    out = []
    for _ in range(q):
        x = int(data[idx]); idx += 1
        best = None
        for feat, label in examples:
            key = (abs(x - feat), feat)
            if best is None or key < best[0]:
                best = (key, label)
        out.append(best[1])
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3\n10 positive\n50 neutral\n90 negative\n3\n12\n55\n70", expected_output: "positive\nneutral\nneutral", description: "Nearest-example labeling with a tie resolved toward the smaller feature." },
        { input: "2\n0 cold\n100 hot\n1\n50", expected_output: "cold", description: "Exact midpoint tie breaks toward the smaller feature." },
        { input: "1\n5 only\n2\n-100\n9999", expected_output: "only\nonly", description: "A single example means every query gets that one label." }
      ]
    },
    {
      id: "ai-15-l3",
      project_id: "ai-15",
      order: 3,
      title: "Self-Consistency & Voting",
      concept: "Voting",
      xp_reward: 10,
      explanation: `A model solves a tricky word problem and answers 42. Run the exact same prompt again and it answers 27. Run it five more times: 42, 42, 27, 42, 31. Which do you trust? Count them. Four of seven say 42 — and that majority answer is far more reliable than any single run. This is **self-consistency**, and it can lift accuracy several points for the cost of running the prompt a few more times.

## What it is

**Self-consistency** is a pattern where you sample multiple chain-of-thought answers to the same question, then take the **majority vote** of the final answers. Instead of trusting one reasoning path, you generate several diverse paths and let them vote.

It works because a hard problem has many wrong answers but usually one right one. Correct reasoning tends to converge on the same final answer through different routes, while errors scatter. Sample enough paths and the correct answer clusters at the top while mistakes spread thin.

## How it works

The recipe is short:

1. **Set a non-zero temperature** so each run takes a slightly different reasoning path. At temperature zero every run is identical and voting is pointless.
2. **Sample N reasoning chains** for the same prompt (say N = 5).
3. **Extract each final answer** from its chain.
4. **Count and return the most common answer.**

\`\`\`python
from collections import Counter

# final answers pulled from 5 separate CoT runs
answers = [42, 27, 42, 42, 31]
winner = Counter(answers).most_common(1)[0][0]
print(winner)   # 42 -- the majority, more reliable than any single run
\`\`\`

The reasoning that led to each answer is thrown away after voting; only the final answers compete. You are using disagreement as a signal: when the runs agree, you can be more confident; when they split evenly, the problem is genuinely hard or ambiguous.

## Why it matters

Self-consistency buys accuracy with money and latency rather than a smarter model.

- **It boosts hard-task accuracy** measurably, especially on math and multi-step reasoning where a single chain is fragile.
- **It costs N times the tokens and time.** Five samples means roughly five times the cost. You reserve it for high-value answers, not every query.
- **It needs diversity.** If temperature is too low the paths are near-identical and voting adds nothing; too high and the reasoning degrades. There is a sweet spot.
- **The vote can still be wrong.** If a model has a systematic bias, the majority can be confidently incorrect. Voting reduces random error, not shared bias.

A common upgrade is to weight or filter votes — for example, ignoring runs whose reasoning is obviously malformed before counting.

## The mental model to keep

**Ask the same hard question several times and trust the answer that keeps coming back. Agreement across diverse reasoning paths is a confidence signal.**`,
      key_terms: [
        { term: "Self-consistency", definition: "Sampling multiple reasoning paths for one question and taking the majority vote of the final answers." },
        { term: "Majority vote", definition: "Choosing the answer that appears most often across the sampled runs." },
        { term: "Temperature", definition: "A sampling setting controlling randomness; non-zero values make each run take a different path." },
        { term: "Reasoning path", definition: "One complete chain-of-thought run from question to final answer." }
      ],
      callouts: [
        { type: "analogy", title: "A panel, not one expert", content: "Instead of trusting one expert's answer, you poll several and go with the consensus. Independent reasoners converging on the same answer is far stronger evidence than one confident voice.", position: "before" },
        { type: "warning", title: "Voting fixes random error, not bias", content: "If the model is systematically wrong about something, all the runs may agree on the wrong answer. Majority vote reduces noise, not a shared blind spot.", position: "after" }
      ],
      concept_diagram: {
        title: "How self-consistency picks an answer",
        steps: [
          { label: "Raise temperature", desc: "Set non-zero sampling so runs diverge." },
          { label: "Sample N chains", desc: "Run the same CoT prompt several times." },
          { label: "Extract final answers", desc: "Pull just the conclusion from each chain." },
          { label: "Majority vote", desc: "Return the most frequent final answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why must temperature be non-zero for self-consistency to work?",
          options: ["So the model writes faster", "So each run takes a different reasoning path to vote across", "So the answers are always correct"],
          correct_index: 1,
          explanation: "At temperature zero every run is identical, so there is nothing diverse to vote among."
        }
      ],
      quiz_questions: [
        {
          question: "Why does taking a majority vote across reasoning paths improve accuracy?",
          options: [
            "It makes the model think harder on each run",
            "Correct reasoning tends to converge on one answer while errors scatter, so the right answer clusters",
            "It removes the need for chain of thought",
            "It lowers the temperature automatically"
          ],
          correct_index: 1,
          explanation: "A hard problem has one right answer and many wrong ones; diverse correct paths converge while mistakes spread out."
        },
        {
          question: "What is the main practical cost of self-consistency?",
          options: [
            "It retrains the model",
            "It runs the prompt N times, costing roughly N times the tokens and latency",
            "It permanently raises temperature",
            "It deletes the reasoning traces from disk"
          ],
          correct_index: 1,
          explanation: "Sampling N chains multiplies token cost and time, so it is reserved for high-value answers."
        },
        {
          question: "Self-consistency reliably fixes which kind of error?",
          options: [
            "A systematic bias shared by every run",
            "Random variation between individual reasoning paths",
            "A wrong knowledge cutoff",
            "An undersized context window"
          ],
          correct_index: 1,
          explanation: "Voting averages out random per-run noise but cannot correct a bias all runs share."
        }
      ],
      participation_activities: [
        {
          activity_title: "Voting check",
          questions: [
            { question: "Running a self-consistency prompt at temperature zero gives a useful vote.", type: "true_false", correct_answer: "false", explanation: "At temperature zero all runs are identical, so the vote is meaningless." },
            { question: "Self-consistency takes the ______ vote of the final answers across multiple runs.", type: "fill_in", correct_answer: "majority", explanation: "The most frequent final answer wins." }
          ]
        }
      ],
      starter_code: `# Take a majority vote over several final answers from separate runs.
from collections import Counter

answers = [42, 27, 42, 42, 31]
# TODO: count the answers and print the most common one.
print(answers)
`,
      solution_code: `from collections import Counter

answers = [42, 27, 42, 42, 31]
counts = Counter(answers)
winner = counts.most_common(1)[0][0]

print("answers:", answers)
print("majority answer:", winner)
`,
      expected_output: `answers: [42, 27, 42, 42, 31]
majority answer: 42`,
      step_throughs: [
        {
          title: "voting across five reasoning runs",
          steps: [
            { label: "Sample with diversity", detail: "Run the same CoT prompt five times at non-zero temperature, so each takes a slightly different path.", code: "temperature = 0.7  # paths diverge" },
            { label: "Collect final answers", detail: "Extract only the conclusion from each chain; the reasoning text is discarded for voting.", code: "answers = [42, 27, 42, 42, 31]" },
            { label: "Count occurrences", detail: "Tally how many times each distinct answer appeared across the runs.", code: "Counter(answers)  # {42: 3, 27: 1, 31: 1}" },
            { label: "Return the winner", detail: "The most frequent answer wins; agreement across diverse paths makes it the confident pick.", code: "most_common(1)[0][0]  # 42" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Five runs of a math prompt return [8, 8, 8, 5, 8]. Which answer does self-consistency report, and why is it more trustworthy than run number four?",
          steps: [
            "Count the answers: 8 appears four times, 5 appears once.",
            "The majority answer is 8.",
            "Four independent reasoning paths converged on 8 while only one strayed to 5, so 8 is far better supported than any lone run."
          ],
          output: "8 -- it is the majority, backed by four converging reasoning paths versus one outlier."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You run self-consistency at temperature 0.05 and all five answers are identical and wrong. Then you raise temperature and the vote splits 3-2 with the majority correct. Explain both outcomes.",
          steps: [
            "At temperature 0.05 the sampling is nearly deterministic, so every run follows essentially the same reasoning path.",
            "Identical paths reach the identical answer, so voting just repeats one run and a single mistake gets five 'votes' that are not independent.",
            "Raising temperature injects diversity, letting some runs find a different, correct path.",
            "Now the votes are genuinely independent, and the correct reasoning converges enough to win the majority."
          ],
          output: "Too-low temperature makes runs identical (no real vote); adding diversity lets correct paths converge and win."
        }
      ],
      comparison_tables: [
        {
          title: "single answer vs self-consistency",
          columns: ["Aspect", "Single run", "Self-consistency"],
          rows: [
            { cells: ["Runs per question", "One", "N (e.g. 5)"] },
            { cells: ["Cost", "1x", "About Nx"] },
            { cells: ["Hard-task accuracy", "Fragile", "Higher, more stable"] },
            { cells: ["Confidence signal", "None", "Agreement across paths"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "helps voting vs hurts voting",
          bins: [
            { id: "helps", label: "Helps voting" },
            { id: "hurts", label: "Hurts voting" }
          ],
          items: [
            { id: "i1", text: "Non-zero temperature for diverse paths", bin: "helps" },
            { id: "i2", text: "Temperature of zero (identical runs)", bin: "hurts" },
            { id: "i3", text: "Sampling several independent chains", bin: "helps" },
            { id: "i4", text: "A systematic bias shared by all runs", bin: "hurts" },
            { id: "i5", text: "Extracting just the final answer to count", bin: "helps" },
            { id: "i6", text: "Temperature so high reasoning degrades", bin: "hurts" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does self-consistency reduce random mistakes but fail to fix a bias that every run shares?",
          sampleAnswer: "Voting works by letting many independent reasoning paths cancel out each other's random errors, so the answer that keeps recurring is likely the correct one. But if the model has a systematic blind spot, every run makes the same mistake for the same reason, so they all 'vote' the same wrong way and the majority is confidently incorrect. Voting averages noise, not a shared flaw."
        }
      ],
      hints: [
        "Counter(answers) tallies how many times each value appears.",
        "counts.most_common(1) returns a list like [(value, count)].",
        "Index [0][0] to pull out just the most common value."
      ],
      challenge_title: "Confidence-Weighted Vote",
      challenge_description: "Aggregate many independent reasoning runs into one answer using confidence-weighted self-consistency.",
      challenge_story: "Your agent solves each hard problem by sampling several reasoning chains at non-zero temperature, then voting on the answer. Plain majority vote throws away useful signal: a run that finishes with high **confidence** should count for more than a hesitant one. So you tally each candidate answer by the **sum of confidences** of the runs that produced it, and ship whichever answer carries the most weight. Build the aggregator that turns a pile of runs into the single answer your system returns.",
      challenge_statement: "You ran the model `n` times. Each run produced an integer answer and an integer confidence.\n\nFor every distinct answer, sum the confidences of all runs that produced it. The winning answer is the one with the **largest total confidence**. If two answers tie on total confidence, pick the **smaller answer value**.\n\nPrint the winning answer and its total confidence.",
      challenge_input_format: "The first line is integer `n`. Each of the next `n` lines has two integers: `answer confidence`.",
      challenge_output_format: "One line: `answer total_confidence`, separated by a single space.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "-1000000000 ≤ answer ≤ 1000000000",
        "1 ≤ confidence ≤ 1000000000",
      ],
      challenge_examples: [
        { input: "5\n42 3\n42 1\n7 5\n7 4\n42 2", output: "7 9", explanation: "Answer 42 totals 3+1+2=6; answer 7 totals 5+4=9. 7 carries more weight, so it wins with total 9." },
        { input: "3\n1 10\n2 10\n3 5", output: "1 10", explanation: "Answers 1 and 2 both total 10 — a tie — so the smaller value 1 wins." },
      ],
      challenge_notes: "This is self-consistency with a twist: instead of one-run-one-vote, each run votes with its confidence. It still only cancels *random* error — if every run shares the same systematic bias, they all pile weight onto the same wrong answer and the aggregate is confidently incorrect.",
      challenge_hints: [
        "Accumulate totals in a dict keyed by answer value.",
        "Iterate the answers in sorted order so the first one you accept on a tie is already the smallest.",
        "Keep a running best; replace it only when a strictly larger total appears.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    runs = []
    for i in range(1, n + 1):
        ans, conf = data[i].split()
        runs.append((int(ans), int(conf)))
    # parse done: 'runs' is a list of (answer, confidence) pairs

    # TODO: sum confidence per distinct answer, then pick the answer with the
    # largest total confidence (ties -> smaller answer value). Print "answer total".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    tally = {}
    for i in range(1, n + 1):
        ans_s, conf_s = data[i].split()
        ans = int(ans_s)
        conf = int(conf_s)
        tally[ans] = tally.get(ans, 0) + conf
    best_ans = None
    best_conf = None
    for ans in sorted(tally.keys()):
        c = tally[ans]
        if best_conf is None or c > best_conf:
            best_conf = c
            best_ans = ans
    print(f"{best_ans} {best_conf}")

main()
`,
      challenge_test_cases: [
        { input: "5\n42 3\n42 1\n7 5\n7 4\n42 2", expected_output: "7 9", description: "7's weight (9) beats 42's weight (6)." },
        { input: "3\n1 10\n2 10\n3 5", expected_output: "1 10", description: "Tie on total confidence resolves to the smaller answer." },
        { input: "1\n99 1", expected_output: "99 1", description: "A single run is its own winner." }
      ]
    },
    {
      id: "ai-15-l4",
      project_id: "ai-15",
      order: 4,
      title: "ReAct & Tool Prompts",
      concept: "ReActPrompt",
      xp_reward: 10,
      explanation: `Ask a model "What's the weather in Tokyo right now?" and it cannot know — its weights froze months ago. But give it a way to *act*, and it can write "I should check the weather tool," call that tool, read the result, and answer correctly. The pattern that makes this work is **ReAct**: interleaving reasoning with actions.

## What it is

**ReAct** stands for **Reason + Act**. It is a prompting pattern where the model alternates between two kinds of output: a **Thought** (reasoning about what to do next) and an **Action** (calling a tool, like a search, a calculator, or an API). After each action the environment returns an **Observation**, which the model reads before thinking again. The loop is Thought, Action, Observation, repeat — until the model has enough to give a final answer.

This breaks the model out of its frozen, sealed box. Pure reasoning can only work with what's in the prompt and the weights. ReAct lets the model pull in fresh facts, do exact computation, and ground its answer in real tool output instead of guessing.

## How it works

You prompt the model to follow a strict format, then run a loop in your code that watches for actions:

\`\`\`text
Thought: I need the current population of Tokyo.
Action: search("population of Tokyo")
Observation: About 14 million (2024).
Thought: Now I can answer.
Final Answer: Tokyo has about 14 million people.
\`\`\`

Your code does the real work around the model:

1. The model writes a Thought and an Action.
2. Your code **parses the Action**, runs the matching tool, and captures the result.
3. Your code **feeds that result back** as an Observation appended to the prompt.
4. The model reads the Observation and either acts again or writes a Final Answer.

The model never executes anything itself. It only *requests* actions as text; your code is the hands that carry them out and report back.

## Why it matters

ReAct is the backbone of modern AI **agents** — systems that take real actions, not just chat.

- **It grounds answers in real data.** Live weather, current prices, a database row — anything the model couldn't know is fetched, not hallucinated.
- **It offloads exact work.** Math, code execution, and lookups go to tools that don't make arithmetic mistakes.
- **It makes behavior traceable.** The Thought and Action log shows exactly why the system did what it did, which is invaluable for debugging.
- **It adds failure modes.** Tools can error, return junk, or be called with bad arguments. A robust ReAct loop must handle a failed Observation, cap the number of steps, and avoid infinite loops.

## The mental model to keep

**The model is the brain that decides; your code and its tools are the hands. ReAct is the conversation between them: think, act, observe, repeat.**`,
      key_terms: [
        { term: "ReAct", definition: "A pattern interleaving Reasoning (Thought) and Acting (tool calls) with Observations fed back in." },
        { term: "Action", definition: "A tool call the model requests as text, such as search or calculate." },
        { term: "Observation", definition: "The tool's result, fed back into the prompt for the model to read." },
        { term: "Agent", definition: "An LLM system that takes real actions via tools in a Thought-Action-Observation loop." }
      ],
      callouts: [
        { type: "analogy", title: "Brain and hands", content: "The model is a brain in a jar: it can decide but not touch anything. ReAct gives it hands — your code and tools — that carry out actions and report back what happened.", position: "before" },
        { type: "warning", title: "The model only asks, never does", content: "The model writes 'Action: search(...)' as text. It does not run the search. Your code parses that request, executes the tool, and feeds back the result. Forgetting this is the classic ReAct bug.", position: "after" }
      ],
      concept_diagram: {
        title: "The ReAct loop",
        steps: [
          { label: "Thought", desc: "The model reasons about what to do next." },
          { label: "Action", desc: "It requests a tool call as text." },
          { label: "Observation", desc: "Your code runs the tool and feeds back the result." },
          { label: "Repeat or answer", desc: "The model acts again or writes the final answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "In a ReAct loop, who actually executes the tool the model requests?",
          options: ["The model runs it internally", "Your surrounding code parses the action and runs the tool", "The user runs it by hand"],
          correct_index: 1,
          explanation: "The model only emits an action as text; your code executes it and returns the observation."
        }
      ],
      quiz_questions: [
        {
          question: "What does the 'Observation' step provide in a ReAct loop?",
          options: [
            "The model's internal reasoning",
            "The result of running a tool, fed back into the prompt",
            "The final answer to the user",
            "A summary of the system prompt"
          ],
          correct_index: 1,
          explanation: "After an action, the tool's result is captured as an Observation and appended for the model to read."
        },
        {
          question: "Why is ReAct especially useful for questions about current events or live data?",
          options: [
            "It retrains the model on new data each call",
            "It lets the model fetch fresh facts via tools instead of guessing from frozen weights",
            "It increases the context window",
            "It lowers the temperature"
          ],
          correct_index: 1,
          explanation: "Tools pull in real, current information the frozen model could not otherwise know."
        },
        {
          question: "Which is a real failure mode a robust ReAct loop must handle?",
          options: [
            "The model running out of vocabulary",
            "A tool erroring or returning junk, or the loop never terminating",
            "The user typing too fast",
            "Temperature being exactly 1.0"
          ],
          correct_index: 1,
          explanation: "Tools can fail or return bad data, and loops can run forever, so step caps and error handling are required."
        }
      ],
      participation_activities: [
        {
          activity_title: "ReAct check",
          questions: [
            { question: "In ReAct, the model executes its own tool calls without any surrounding code.", type: "true_false", correct_answer: "false", explanation: "The model only requests actions as text; your code runs the tools and returns observations." },
            { question: "ReAct stands for Reason plus ______.", type: "fill_in", correct_answer: "act", explanation: "It interleaves reasoning (Thought) with acting (tool calls)." }
          ]
        }
      ],
      starter_code: `# Parse an action the model emitted, run a fake tool, return an observation.
def search(query):
    fake_db = {"population of Tokyo": "About 14 million (2024)."}
    return fake_db.get(query, "No result.")

action = 'search("population of Tokyo")'
# TODO: pull the query out of the action string and call search() with it.
print(action)
`,
      solution_code: `def search(query):
    fake_db = {"population of Tokyo": "About 14 million (2024)."}
    return fake_db.get(query, "No result.")

action = 'search("population of Tokyo")'
query = action[action.index('"') + 1 : action.rindex('"')]
observation = search(query)

print("Action:", action)
print("Observation:", observation)
`,
      expected_output: `Action: search("population of Tokyo")
Observation: About 14 million (2024).`,
      step_throughs: [
        {
          title: "one turn of the ReAct loop",
          steps: [
            { label: "Model writes a Thought", detail: "It reasons about what's missing and what to do next, in plain text.", code: '"Thought: I need Tokyo\'s population."' },
            { label: "Model requests an Action", detail: "It emits a tool call as text. It does not run anything itself.", code: '"Action: search(\\"population of Tokyo\\")"' },
            { label: "Your code runs the tool", detail: "You parse the action, execute the real tool, and capture its output as an Observation.", code: 'obs = search("population of Tokyo")' },
            { label: "Observation feeds back", detail: "The result is appended to the prompt; the model reads it and either acts again or answers.", code: '"Observation: About 14 million (2024)."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A user asks for today's exchange rate. Why does a plain prompt fail while a ReAct prompt with a rate tool succeeds?",
          steps: [
            "Today's rate is information after the model's knowledge cutoff, so the frozen weights cannot contain it.",
            "A plain prompt forces the model to guess, producing a plausible but likely wrong number.",
            "ReAct lets the model emit an action to call a live rate tool, then answer from the real observation."
          ],
          output: "ReAct fetches the current rate via a tool; the plain model can only guess at post-cutoff data."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your ReAct agent calls a search tool, the tool times out and returns an error, and the agent then loops calling the same tool forever. What two safeguards fix this?",
          steps: [
            "First, the loop must treat a tool error as a valid Observation, feeding back something like 'Observation: tool error' so the model can react to it.",
            "Given that observation, the model can try a different action or gracefully report it can't complete the task.",
            "Second, add a hard step cap: stop after, say, 6 iterations regardless, to guarantee the loop terminates.",
            "Together, error-aware observations plus a step limit prevent both silent failures and infinite loops."
          ],
          output: "Feed tool errors back as observations and enforce a maximum step count to stop infinite loops."
        }
      ],
      comparison_tables: [
        {
          title: "plain prompting vs ReAct",
          columns: ["Aspect", "Plain prompt", "ReAct"],
          rows: [
            { cells: ["Access to live data", "None (frozen weights)", "Yes, via tools"] },
            { cells: ["Exact computation", "Often wrong", "Offloaded to tools"] },
            { cells: ["Traceability", "Black box", "Thought/Action log"] },
            { cells: ["Failure modes", "Hallucination", "Tool errors, loops (must handle)"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "model's job vs your code's job in ReAct",
          bins: [
            { id: "model", label: "The model does" },
            { id: "code", label: "Your code does" }
          ],
          items: [
            { id: "i1", text: "Write a Thought about what to do next", bin: "model" },
            { id: "i2", text: "Parse the requested action", bin: "code" },
            { id: "i3", text: "Request a tool call as text", bin: "model" },
            { id: "i4", text: "Execute the real tool", bin: "code" },
            { id: "i5", text: "Decide when to give the final answer", bin: "model" },
            { id: "i6", text: "Cap the number of loop steps", bin: "code" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does ReAct let a model answer questions it otherwise couldn't, even though the model's weights never change?",
          sampleAnswer: "The model's frozen weights can't contain live or post-cutoff facts, but ReAct lets it request actions that your code executes, pulling real data back in as observations. The model still only predicts text, but now part of that text is grounded in tool results rather than its fuzzy memory, so it can answer accurately about things it never learned."
        }
      ],
      hints: [
        "The query sits between the two double-quote characters in the action string.",
        "action.index('\"') finds the first quote; action.rindex('\"') finds the last.",
        "Slice between them, then pass that substring to search()."
      ],
      challenge_title: "Run the ReAct Trace",
      challenge_description: "Execute an agent's action trace step by step, dispatching each tool call against a running register.",
      challenge_story: "Your ReAct agent emits a trace of **actions**, each a tool call like `add(\"4\")` or `set(\"3\")`. Between reasoning, your runtime has to actually *execute* these calls: parse the tool name, pull the argument out from between the quotes, dispatch to the right tool, and thread the result forward as state. To debug an agent you need to see the register **after every single action**, not just at the end — that's the trail that tells you where a run went wrong. Build the executor that runs the trace and logs the state at each step.",
      challenge_statement: "An agent emits `n` actions in order. Each action is `tool(\"arg\")` where `arg` is an integer (possibly negative). A single integer **register** starts at `0`. Apply each tool to the register:\n\n- `set(\"x\")` — replace the register with `x`.\n- `add(\"x\")` — add `x` to the register.\n- `sub(\"x\")` — subtract `x` from the register.\n- `mul(\"x\")` — multiply the register by `x`.\n\nPrint the final register value, then on a second line print the register value **after each action**, space-separated, in order.",
      challenge_input_format: "The first line is integer `n`. Each of the next `n` lines is an action of the form `tool(\"arg\")` with `tool` one of `set`, `add`, `sub`, `mul`.",
      challenge_output_format: "Line 1: the final register value. Line 2: the register value after each of the `n` actions, space-separated.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "-1000000000 ≤ arg ≤ 1000000000",
        "The register fits in a normal Python int (arbitrary precision)",
      ],
      challenge_examples: [
        { input: "4\nset(\"3\")\nadd(\"4\")\nmul(\"2\")\nsub(\"5\")", output: "9\n3 7 14 9", explanation: "Register: set→3, +4→7, ×2→14, −5→9. The trail logs every intermediate state." },
        { input: "3\nadd(\"5\")\nmul(\"3\")\nset(\"-7\")", output: "-7\n5 15 -7", explanation: "Starting at 0: +5→5, ×3→15, then set overwrites to −7." },
      ],
      challenge_notes: "The core skill is the same one ReAct runtimes use everywhere: find the tool name before `(`, then slice the argument out between the first and last double-quote. Threading the result forward is what turns isolated tool calls into a coherent agent run.",
      challenge_hints: [
        "`line[:line.index(\"(\")]` gives the tool name; the arg sits between `line.index('\"')` and `line.rindex('\"')`.",
        "Keep one `reg` variable and update it per action, appending its new value to a log list.",
        "Print the final `reg`, then `' '.join(...)` the log on the second line.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    actions = [data[i].rstrip() for i in range(1, n + 1)]  # parse done: the n raw action strings tool("arg")
    reg = 0
    log = []
    # TODO: for each action, pull the tool name (before "(") and the quoted integer arg
    # (between the first and last double-quote), apply it to reg
    # (set/add/sub/mul), and append reg to log. Then print reg and the log.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    reg = 0
    log = []
    for i in range(1, n + 1):
        line = data[i].rstrip()
        name = line[:line.index("(")]
        arg = int(line[line.index('"') + 1 : line.rindex('"')])
        if name == "set":
            reg = arg
        elif name == "add":
            reg += arg
        elif name == "sub":
            reg -= arg
        elif name == "mul":
            reg *= arg
        log.append(reg)
    print(reg)
    print(" ".join(str(v) for v in log))

main()
`,
      challenge_test_cases: [
        { input: "4\nset(\"3\")\nadd(\"4\")\nmul(\"2\")\nsub(\"5\")", expected_output: "9\n3 7 14 9", description: "All four tools exercised; intermediate trail logged." },
        { input: "1\nset(\"100\")", expected_output: "100\n100", description: "Single action; final and trail agree." },
        { input: "3\nadd(\"5\")\nmul(\"3\")\nset(\"-7\")", expected_output: "-7\n5 15 -7", description: "Negative argument and a set that overwrites prior state." }
      ]
    },
    {
      id: "ai-15-l5",
      project_id: "ai-15",
      order: 5,
      title: "Prompt Chaining & Decomposition",
      concept: "Chaining",
      xp_reward: 10,
      explanation: `You ask a model to "read this 20-page report, extract the risks, rank them, and write an executive summary" in one shot. The result is mushy: some risks missed, ranking arbitrary, summary vague. Now split it into four prompts, each doing one job and feeding the next. Suddenly every stage is sharp. That's **prompt chaining** — and it's how serious LLM systems get built.

## What it is

**Prompt chaining** (also called **decomposition**) is breaking a complex task into a sequence of smaller prompts, where the **output of one becomes the input to the next**. Instead of one giant prompt trying to do everything, you build a pipeline of focused steps.

The principle behind it is the same one that makes functions better than one thousand-line script: **a prompt that does one thing does it better.** Each stage has a narrow, clear job, so it's easier to get right, easier to test, and easier to fix when it breaks.

## How it works

Take "summarize the key risks in this report" and decompose it:

\`\`\`text
Step 1  Extract:   "List every risk mentioned in this text." -> raw list
Step 2  Filter:    "Keep only financial and legal risks." -> shorter list
Step 3  Rank:      "Order these risks by severity, worst first." -> ordered list
Step 4  Summarize: "Write a 3-sentence summary of the top 3." -> final output
\`\`\`

In code, you literally feed each result forward:

\`\`\`python
risks   = call_model(extract_prompt(report))
focused = call_model(filter_prompt(risks))
ranked  = call_model(rank_prompt(focused))
summary = call_model(summarize_prompt(ranked))
\`\`\`

Each call is small, inspectable, and independently fixable. If the summary is bad, you can look at \`ranked\` to see whether the problem was the ranking step or the summary step. With one mega-prompt, you'd have no idea which part failed.

Chains can branch and merge too: run several extractions in parallel, then combine them. But the core move is always the same — **split the work, pass the output along.**

## Why it matters

Decomposition is the difference between a demo and a dependable system.

- **Each step is more accurate** because a focused prompt outperforms a sprawling one.
- **The pipeline is debuggable.** You can inspect the intermediate output of every stage and pinpoint exactly where things went wrong.
- **Steps are reusable and swappable.** Improve the ranking prompt without touching the others; reuse the extraction step in a different chain.
- **It costs more calls.** Four prompts mean four round trips, more tokens, and more latency than one. You trade efficiency for reliability and control — usually worth it for anything important.

The risk to watch: **errors compound.** A bad early step poisons everything downstream, so the earliest stages deserve the most care and validation.

## The mental model to keep

**Don't ask one prompt to do five things. Build an assembly line of small prompts, each doing one job and handing its output to the next.**`,
      key_terms: [
        { term: "Prompt chaining", definition: "Breaking a task into a sequence of prompts where each output feeds the next input." },
        { term: "Decomposition", definition: "Splitting a complex task into smaller, focused subtasks." },
        { term: "Pipeline", definition: "The ordered chain of prompt steps from raw input to final output." },
        { term: "Error compounding", definition: "When a mistake in an early step corrupts every step that depends on it." }
      ],
      callouts: [
        { type: "analogy", title: "An assembly line", content: "One worker building a whole car badly versus a line where each station does one part well. Chaining turns a sprawling task into focused stations, each handing its output to the next.", position: "before" },
        { type: "tip", title: "Inspect the intermediates", content: "The whole payoff of chaining is that you can read the output of each stage. When the final result is wrong, walk back through the intermediate outputs to find the exact step that failed.", position: "after" }
      ],
      concept_diagram: {
        title: "Decomposing a task into a chain",
        steps: [
          { label: "Split the task", desc: "Break the goal into focused subtasks." },
          { label: "Run step 1", desc: "A narrow prompt produces a clean intermediate output." },
          { label: "Feed it forward", desc: "That output becomes the input to the next prompt." },
          { label: "Reach the result", desc: "The final step produces the answer; each stage is inspectable." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the defining feature of prompt chaining?",
          options: ["Running the same prompt many times and voting", "The output of one prompt becomes the input to the next", "Adding more examples to a single prompt"],
          correct_index: 1,
          explanation: "Chaining wires focused prompts in sequence, passing each output forward as the next input."
        }
      ],
      quiz_questions: [
        {
          question: "Why does splitting a task into a chain of focused prompts usually beat one mega-prompt?",
          options: [
            "It uses fewer tokens overall",
            "A prompt that does one thing does it better, and each step is testable and fixable",
            "It removes the need for the model entirely",
            "It avoids the context window"
          ],
          correct_index: 1,
          explanation: "Focused prompts are more accurate and the pipeline is inspectable, so you can fix the exact failing step."
        },
        {
          question: "What is the main downside of prompt chaining?",
          options: [
            "The model forgets the task",
            "More calls mean more tokens, latency, and cost than a single prompt",
            "It only works on math problems",
            "It cannot be debugged"
          ],
          correct_index: 1,
          explanation: "Each step is a separate call, so a chain costs more round trips and tokens than one prompt."
        },
        {
          question: "Why do the earliest steps in a chain deserve the most care?",
          options: [
            "They use the most tokens",
            "Errors compound: a bad early step corrupts every step downstream",
            "They run at a higher temperature",
            "They are the only steps that cost money"
          ],
          correct_index: 1,
          explanation: "A mistake early poisons everything that depends on it, so early stages need extra validation."
        }
      ],
      participation_activities: [
        {
          activity_title: "Chaining check",
          questions: [
            { question: "In prompt chaining, each step's output is passed as input to the next step.", type: "true_false", correct_answer: "true", explanation: "That hand-off of output to input is exactly what defines a chain." },
            { question: "When a mistake in an early step corrupts every later step, the errors are said to ______.", type: "fill_in", correct_answer: "compound", explanation: "Error compounding makes early stages the most important to get right." }
          ]
        }
      ],
      starter_code: `# A tiny 3-step chain: each function's output feeds the next.
text = "Risk: lawsuit. Note: lunch. Risk: budget overrun."

def extract(t):
    return [line for line in t.split(". ") if line.startswith("Risk")]

# TODO: feed extract()'s output into a count step, then print the summary.
risks = extract(text)
print(risks)
`,
      solution_code: `text = "Risk: lawsuit. Note: lunch. Risk: budget overrun."

def extract(t):
    return [line for line in t.split(". ") if line.startswith("Risk")]

def count(risks):
    return len(risks)

risks = extract(text)
n = count(risks)
print("risks:", risks)
print("summary: found", n, "risks")
`,
      expected_output: `risks: ['Risk: lawsuit', 'Risk: budget overrun.']
summary: found 2 risks`,
      step_throughs: [
        {
          title: "building a four-step chain",
          steps: [
            { label: "Extract", detail: "A narrow prompt pulls every risk out of the raw report. One job, done cleanly.", code: 'extract_prompt(report) -> raw list of risks' },
            { label: "Filter", detail: "The extracted list feeds a prompt that keeps only the relevant categories.", code: 'filter_prompt(risks) -> financial + legal only' },
            { label: "Rank", detail: "The filtered list feeds a ranking prompt; output is ordered worst-first.", code: 'rank_prompt(focused) -> severity-ordered list' },
            { label: "Summarize", detail: "The ranked list feeds the final prompt, producing the executive summary. Each intermediate stayed inspectable.", code: 'summarize_prompt(ranked) -> 3-sentence summary' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A one-shot prompt 'extract, rank, and summarize the risks' returns a vague summary. How does splitting it into extract then rank then summarize help?",
          steps: [
            "Each of the three jobs becomes its own focused prompt, so none competes for the model's attention.",
            "A focused prompt does its single job more accurately than a prompt juggling three at once.",
            "You can also read the extracted list and the ranked list to confirm each stage before the summary runs."
          ],
          output: "Separate focused steps each do one job well, and the intermediate outputs let you verify the chain."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Your four-step chain produces a wrong final summary. The extract step missed half the risks. Why does this single early bug ruin the whole output, and what does it teach about chain design?",
          steps: [
            "The filter, rank, and summarize steps all operate only on whatever the extract step passed forward.",
            "If extraction missed half the risks, those risks simply do not exist for any later stage; they can't be ranked or summarized.",
            "This is error compounding: a flaw in an early step silently corrupts everything downstream.",
            "The lesson: invest the most validation in early steps, and inspect their intermediate output before trusting the final result."
          ],
          output: "Early errors compound through the chain, so the earliest steps need the most care and validation."
        }
      ],
      comparison_tables: [
        {
          title: "one mega-prompt vs a prompt chain",
          columns: ["Aspect", "Single mega-prompt", "Prompt chain"],
          rows: [
            { cells: ["Per-step accuracy", "Diluted across many goals", "Focused, higher"] },
            { cells: ["Debuggability", "Can't see intermediates", "Inspect each stage"] },
            { cells: ["Cost", "One call", "Several calls (more tokens)"] },
            { cells: ["Reusability", "Monolithic", "Swappable, reusable steps"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "prompt chaining vs self-consistency",
          bins: [
            { id: "chain", label: "Prompt chaining" },
            { id: "vote", label: "Self-consistency" }
          ],
          items: [
            { id: "i1", text: "Output of one step feeds the next", bin: "chain" },
            { id: "i2", text: "Same prompt run many times, then voted", bin: "vote" },
            { id: "i3", text: "Splits a task into focused subtasks", bin: "chain" },
            { id: "i4", text: "Uses majority vote of final answers", bin: "vote" },
            { id: "i5", text: "Intermediate outputs are inspectable stages", bin: "chain" },
            { id: "i6", text: "Relies on diverse reasoning paths agreeing", bin: "vote" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is a chain of focused prompts easier to debug than one prompt that tries to do everything?",
          sampleAnswer: "A chain exposes the output of every stage, so when the final result is wrong you can walk back through the intermediate outputs and see exactly which step produced the bad data. A single mega-prompt is a black box: it does five things internally and emits one result, so when it fails you have no way to tell which part broke or why."
        }
      ],
      hints: [
        "extract() already returns the list of risk strings.",
        "Write a count step that returns len(risks), then call it on the extracted list.",
        "Print the risks and a summary line using the count."
      ],
      challenge_title: "The Risk Triage Pipeline",
      challenge_description: "Run a three-stage extract-rank-summarize chain over a document of scored findings, each stage feeding the next.",
      challenge_story: "A compliance summarizer reads a long report and surfaces the top risks for a human reviewer. Doing it in one giant prompt produces mush, so you decomposed it into a **chain**: stage 1 *extracts* findings whose severity clears a threshold, stage 2 *ranks* what survived, and stage 3 *summarizes* the top few. Each stage consumes the previous stage's output and nothing else — which is exactly why you can inspect the result of every step. Build the pipeline that turns raw findings into a tight, ranked summary.",
      challenge_statement: "You're given `n` findings, each with an integer id and an integer severity score, plus a threshold `T` and a count `K`.\n\nRun three chained stages:\n\n1. **Extract** — keep only findings with `score >= T`.\n2. **Rank** — sort the kept findings by score **descending**; break ties by **smaller id first**.\n3. **Summarize** — take the top `K` of the ranked list.\n\nPrint three lines: how many findings survived extraction, the ids of the top `K` (space-separated, or `-` if none), and the sum of those top `K` scores.",
      challenge_input_format: "The first line has three integers `n T K`. Each of the next `n` lines has two integers: `id score`.",
      challenge_output_format: "Line 1: the count of findings kept after extraction. Line 2: the top-`K` ids space-separated in ranked order, or `-` if the kept set is empty. Line 3: the sum of the top-`K` scores (`0` if none).",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ K ≤ n",
        "-1000000000 ≤ T ≤ 1000000000",
        "-1000000000 ≤ score ≤ 1000000000",
        "ids are distinct integers in [0, 1000000000]",
      ],
      challenge_examples: [
        { input: "5 50 2\n1 80\n2 30\n3 90\n4 50\n5 90", output: "4\n3 5\n180", explanation: "Extract keeps scores ≥ 50: ids 1,3,4,5 (count 4). Rank by score desc: 3(90), 5(90) — tie broken by smaller id — then 1(80), 4(50). Top 2 are ids 3 and 5, scores 90+90=180." },
        { input: "3 100 5\n1 10\n2 20\n3 30", output: "0\n-\n0", explanation: "No finding clears threshold 100, so extraction is empty: count 0, no ids (`-`), sum 0." },
      ],
      challenge_notes: "Each stage is a pure function of the stage before it — extract → rank → summarize. That decomposition is what makes the pipeline debuggable: print any line and you can see exactly where a wrong final answer was born. `K` may exceed the kept set; in that case you simply take everything that survived.",
      challenge_hints: [
        "Stage 1 is a list comprehension filtering `score >= T`.",
        "Stage 2 sorts with key `(-score, id)` so higher scores come first and ties favor the smaller id.",
        "Stage 3 slices `[:K]`; print `-` and `0` when the kept set is empty.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, T, K = map(int, data[0].split())
    items = []
    for i in range(1, n + 1):
        iid, score = map(int, data[i].split())
        items.append((iid, score))
    # parse done: 'items' is a list of (id, score); T is the threshold, K the top count

    # TODO: stage 1 extract (keep score >= T); stage 2 rank by (-score, id);
    # stage 3 take the top K. Print the kept count, then the top-K ids in ranked
    # order (or "-" if none), then the sum of the top-K scores.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, T, K = map(int, data[0].split())
    items = []
    for i in range(1, n + 1):
        parts = data[i].split()
        items.append((int(parts[0]), int(parts[1])))
    kept = [it for it in items if it[1] >= T]
    ranked = sorted(kept, key=lambda it: (-it[1], it[0]))
    top = ranked[:K]
    total = sum(s for _, s in top)
    ids = [str(iid) for iid, _ in top]
    print(len(kept))
    print(" ".join(ids) if ids else "-")
    print(total)

main()
`,
      challenge_test_cases: [
        { input: "5 50 2\n1 80\n2 30\n3 90\n4 50\n5 90", expected_output: "4\n3 5\n180", description: "Full extract-rank-summarize chain with a score tie broken by id." },
        { input: "3 100 5\n1 10\n2 20\n3 30", expected_output: "0\n-\n0", description: "Empty extraction propagates through the chain to `-` and 0." },
        { input: "4 0 2\n7 5\n3 5\n9 1\n1 5", expected_output: "4\n1 3\n10", description: "All survive; equal scores rank by smaller id, so 1 and 3 lead." }
      ]
    },
    {
      id: "ai-15-l6",
      project_id: "ai-15",
      order: 6,
      title: "Tree of Thoughts",
      concept: "ToT",
      xp_reward: 10,
      explanation: `Chain of thought commits to one line of reasoning and rides it to the end. But hard problems often have a first step that *looks* promising and quietly dooms everything after it. **Tree of thoughts (ToT)** fixes that by refusing to commit early: at each step it spawns several candidate continuations, scores them, keeps the best few, and discards the rest. Reasoning stops being a single rope and becomes a branching, self-pruning search.

## What it is

**Tree of thoughts** is a prompting pattern where the model explores **multiple reasoning paths at once**, arranged as a tree. Each node is a partial reasoning state. From any node the model proposes several next "thoughts" — the branches. An evaluator scores how promising each branch is, and only the strongest survive to be expanded further. Weak branches are **pruned** so the search doesn't waste effort on dead ends.

Where chain of thought is depth-first and irreversible (one path, no backtracking), ToT is a deliberate search: it can abandon a bad branch and pour effort into a better one. The width of the search — how many branches you keep at each level — is the **beam width**.

## How it works

The loop is propose, evaluate, prune, expand:

\`\`\`python
def tree_of_thoughts(root, beam_width, depth):
    frontier = [root]
    for _ in range(depth):
        candidates = []
        for node in frontier:
            for thought in propose_next(node):     # branch out
                candidates.append((score(thought), thought))
        candidates.sort(reverse=True)              # best first
        frontier = [t for _, t in candidates[:beam_width]]  # prune to top-k
    return best(frontier)
\`\`\`

Two knobs control the search. **Branching factor** is how many candidates each node proposes. **Beam width** is how many you keep after scoring. A beam width of 1 collapses ToT back into greedy chain of thought — you always follow the single best-looking branch and can never recover from a wrong turn. Widen the beam and the search can carry a slightly-weaker-now branch that pays off later.

## Why it matters

ToT shines exactly where a single chain is fragile: puzzles, planning, math with branch points, and any problem where the first move constrains the rest.

- **It escapes early mistakes.** A greedy chain that takes a bad first step is stuck; ToT keeps alternatives alive and can route around the dead end.
- **It costs a lot more.** You run many partial reasonings and score each, so token and latency cost scale with branching factor times depth. Reserve it for genuinely hard problems.
- **It needs a usable evaluator.** Pruning is only as good as the score. A misleading scorer prunes the right branch, and you're worse off than plain CoT.

## The mental model to keep

**Don't bet everything on the first idea. Sprout several, judge them, keep the best few, and search — reasoning as a pruned tree, not a single rope.**`,
      key_terms: [
        { term: "Tree of thoughts", definition: "A pattern that explores multiple reasoning branches as a tree, scoring and pruning to find the best path." },
        { term: "Branch", definition: "One candidate next thought proposed from a reasoning node." },
        { term: "Pruning", definition: "Discarding low-scoring branches so the search ignores dead ends." },
        { term: "Beam width", definition: "How many branches are kept after scoring at each level of the tree." }
      ],
      callouts: [
        { type: "analogy", title: "A chess player looking ahead", content: "A good player doesn't lock onto the first move that comes to mind. They picture several moves, weigh how each position looks, and explore the promising ones deeper while ignoring the bad ones. ToT is that for reasoning.", position: "before" },
        { type: "insight", title: "Beam width 1 is just greedy CoT", content: "Keep only the single best branch at every step and you have ordinary chain of thought with no recovery. The whole power of ToT comes from keeping more than one candidate alive.", position: "after" }
      ],
      concept_diagram: {
        title: "How tree of thoughts searches",
        steps: [
          { label: "Branch out", desc: "From each live node, propose several candidate next thoughts." },
          { label: "Evaluate", desc: "Score how promising each candidate branch looks." },
          { label: "Prune", desc: "Keep only the top few branches; discard the weak ones." },
          { label: "Expand or finish", desc: "Expand survivors deeper, repeat, then return the best path found." }
        ]
      },
      inline_quizzes: [
        {
          question: "What happens to tree of thoughts when you set the beam width to 1?",
          options: ["It explores every possible branch", "It collapses into greedy chain of thought with no backtracking", "It stops working entirely"],
          correct_index: 1,
          explanation: "Keeping only one branch per step is exactly greedy CoT: you follow the single best-looking path and can never recover from a bad turn."
        }
      ],
      quiz_questions: [
        {
          question: "What is the key difference between chain of thought and tree of thoughts?",
          options: [
            "CoT uses tools while ToT does not",
            "CoT follows one reasoning path; ToT explores several branches, scores them, and prunes the weak ones",
            "ToT changes the model's weights",
            "CoT is always more accurate"
          ],
          correct_index: 1,
          explanation: "ToT is a deliberate, branching search that can abandon bad paths, whereas CoT commits to a single irreversible chain."
        },
        {
          question: "What does pruning accomplish in tree of thoughts?",
          options: [
            "It deletes the model's memory",
            "It discards low-scoring branches so the search stops wasting effort on dead ends",
            "It lowers the temperature",
            "It merges all branches into one"
          ],
          correct_index: 1,
          explanation: "Pruning removes weak branches after scoring so the search concentrates effort on the most promising paths."
        },
        {
          question: "What is the main practical cost of tree of thoughts?",
          options: [
            "It cannot be debugged",
            "Running and scoring many partial reasonings multiplies token and latency cost",
            "It only works on text classification",
            "It permanently raises the beam width"
          ],
          correct_index: 1,
          explanation: "Cost scales with branching factor times depth, so ToT is reserved for genuinely hard problems."
        }
      ],
      participation_activities: [
        {
          activity_title: "Tree of thoughts check",
          questions: [
            { question: "Tree of thoughts can abandon a bad reasoning branch and explore a better one instead.", type: "true_false", correct_answer: "true", explanation: "Unlike a single chain, ToT keeps multiple branches alive and prunes the weak ones, so it can route around dead ends." },
            { question: "Discarding low-scoring branches so the search ignores dead ends is called ______.", type: "fill_in", correct_answer: "pruning", explanation: "Pruning is the step that keeps only the most promising branches." }
          ]
        }
      ],
      starter_code: `# Pick the best branch from a set of scored candidate thoughts (beam width 1 step).
candidates = [
    ("multiply first", 3),
    ("add first", 7),
    ("guess the answer", 1),
]
# TODO: keep only the highest-scoring candidate (the surviving branch).
print(candidates)
`,
      solution_code: `candidates = [
    ("multiply first", 3),
    ("add first", 7),
    ("guess the answer", 1),
]

best = max(candidates, key=lambda c: c[1])

print("candidates:", candidates)
print("kept branch:", best[0], "score:", best[1])
`,
      expected_output: `candidates: [('multiply first', 3), ('add first', 7), ('guess the answer', 1)]
kept branch: add first score: 7`,
      step_throughs: [
        {
          title: "one level of the tree: branch, score, prune",
          steps: [
            { label: "Start at a node", detail: "You hold a partial reasoning state and need to decide the next thought. With ToT you won't commit to just one.", code: 'frontier = ["3 boxes of 12 apples..."]' },
            { label: "Branch out", detail: "Propose several candidate next thoughts from this node instead of a single one.", code: 'proposals = ["multiply 3x12", "add 12+12+12", "guess 30"]' },
            { label: "Evaluate each", detail: "Score how promising each branch looks; a good scorer ranks correct-leaning steps higher.", code: 'scores = [9, 8, 1]  # guess scores low' },
            { label: "Prune to the beam", detail: "Keep only the top branches (here beam width 2); discard the dead ends and expand the survivors next.", code: 'frontier = ["multiply 3x12", "add 12+12+12"]' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "From a node, the model proposes three branches scored 4, 9, and 2. With beam width 1, which branch survives to be expanded?",
          steps: [
            "Beam width 1 means you keep only the single highest-scoring branch.",
            "Compare the scores: 9 is the largest.",
            "The branch scored 9 survives; the others (4 and 2) are pruned."
          ],
          output: "The branch scored 9 — beam width 1 keeps only the top one."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A puzzle's correct solution starts with a first move that scores only second-best at depth 1, but leads to a far better final state. Why might beam width 1 fail here while beam width 2 succeeds?",
          steps: [
            "Beam width 1 keeps only the single best-looking branch at each level, so it prunes the second-best first move immediately.",
            "But that pruned move was the one that paid off later, so greedy search never even explores it.",
            "Beam width 2 keeps the top two first moves alive, including the second-best one.",
            "Expanding that surviving branch reveals its strong downstream states, so the wider beam finds the better overall path."
          ],
          output: "Beam width 1 prunes the second-best-now branch that wins later; a wider beam keeps it alive long enough to pay off."
        }
      ],
      comparison_tables: [
        {
          title: "chain of thought vs tree of thoughts",
          columns: ["Aspect", "Chain of thought", "Tree of thoughts"],
          rows: [
            { cells: ["Reasoning shape", "One linear path", "Branching tree"] },
            { cells: ["Recover from a bad step", "No, it's committed", "Yes, explore other branches"] },
            { cells: ["Cost", "One reasoning pass", "Many branches scored (much higher)"] },
            { cells: ["Best for", "Most multi-step tasks", "Hard search/planning problems"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "tree of thoughts vs chain of thought",
          bins: [
            { id: "tot", label: "Tree of thoughts" },
            { id: "cot", label: "Chain of thought" }
          ],
          items: [
            { id: "i1", text: "Explores several branches per step", bin: "tot" },
            { id: "i2", text: "Follows a single reasoning path", bin: "cot" },
            { id: "i3", text: "Scores and prunes weak branches", bin: "tot" },
            { id: "i4", text: "Commits to its first step irreversibly", bin: "cot" },
            { id: "i5", text: "Has a tunable beam width", bin: "tot" },
            { id: "i6", text: "Cheapest reasoning upgrade for one chain", bin: "cot" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a wider beam width find a correct answer that greedy chain of thought misses?",
          sampleAnswer: "Greedy CoT keeps only the single best-looking step at each point, so if the path to the right answer begins with a move that scores second-best early on, it gets pruned and never explored. A wider beam keeps several branches alive at once, including the one that looks worse now but leads somewhere better, giving the search a chance to discover that the slower-starting path actually wins."
        }
      ],
      hints: [
        "max() with a key picks the element with the largest score.",
        "Use key=lambda c: c[1] so it compares on the score, not the text.",
        "The kept branch is the tuple max() returns; print its label and score."
      ],
      challenge_title: "Prune the Reasoning Tree",
      challenge_description: "Do one level of tree-of-thoughts pruning: from a set of scored candidate branches, keep the top B by score and report them.",
      challenge_story: "Your agent reasons with **tree of thoughts**: from the current node it branches into several candidate next thoughts, a scorer rates each one, and you keep only the most promising few — the **beam** — and prune the rest. This is the single move at the heart of the pattern, exactly what the lesson walks through: branch out, score every candidate, keep the top `B`. Build that one prune step so you can see which branches survive and which dead ends get cut.",
      challenge_statement: "You're given `n` candidate branches proposed from the current reasoning node. Each branch has an integer id and an integer score from the evaluator.\n\nKeep the `B` highest-scoring branches and prune the rest. If two branches tie on score, prefer the one with the **smaller id**. If `B` is larger than `n`, simply keep all `n` branches.\n\nPrint two lines: the ids of the kept branches in **ascending id order**, space-separated, and the **sum of the kept branches' scores**.",
      challenge_input_format: "The first line has two integers `n B`. Each of the next `n` lines has a branch's id and its score, two space-separated integers.",
      challenge_output_format: "Line 1: the kept branch ids in ascending order, space-separated. Line 2: the sum of the kept branches' scores.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ B ≤ n",
        "ids are distinct integers in [0, 1000000000]",
        "-1000000000 ≤ score ≤ 1000000000",
        "On a score tie, the branch with the smaller id is kept.",
      ],
      challenge_examples: [
        { input: "4 2\n1 3\n2 7\n3 1\n4 5", output: "2 4\n12", explanation: "Scores are 3, 7, 1, 5. The top 2 by score are branch 2 (7) and branch 4 (5). Kept ids in order: 2 4; their score sum is 7+5 = 12. Branches 1 and 3 are pruned." },
        { input: "3 2\n10 9\n20 9\n30 4", output: "10 20\n18", explanation: "Branches 10 and 20 tie at score 9, beating branch 30 (4). Both are kept (smaller ids win the tie over 30). Sum is 9+9 = 18." },
      ],
      challenge_notes: "This is one level of the propose-score-prune loop the lesson shows: you do not traverse deeper or accumulate path strength — you simply rank this node's candidates and keep the beam. A beam width of 1 would keep only the single best branch, which is exactly greedy chain of thought. Sort the candidates by score descending (ties by smaller id), slice the first B, then print their ids in ascending order.",
      challenge_hints: [
        "Read each branch as an (id, score) pair into a list.",
        "Sort with key `(-score, id)` so higher scores come first and ties favor the smaller id, then take the first B.",
        "Sort the kept ids ascending for printing, and sum the kept scores separately.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, B = map(int, data[0].split())
    branches = []
    for i in range(1, n + 1):
        bid, score = data[i].split()
        branches.append((int(bid), int(score)))
    # parse done: 'branches' is a list of (id, score); keep the top B by score

    # TODO: keep the B highest-scoring branches (ties -> smaller id).
    # Print the kept ids in ascending order, then the sum of their scores.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, B = map(int, data[0].split())
    branches = []
    for i in range(1, n + 1):
        bid, score = data[i].split()
        branches.append((int(bid), int(score)))

    ranked = sorted(branches, key=lambda b: (-b[1], b[0]))
    kept = ranked[:B]
    kept_ids = sorted(b[0] for b in kept)
    total = sum(b[1] for b in kept)
    print(" ".join(str(i) for i in kept_ids))
    print(total)

main()
`,
      challenge_test_cases: [
        { input: "4 2\n1 3\n2 7\n3 1\n4 5", expected_output: "2 4\n12", description: "Keep the top 2 of four branches by score; prune the rest." },
        { input: "3 2\n10 9\n20 9\n30 4", expected_output: "10 20\n18", description: "A score tie is resolved toward the smaller ids, both kept over the lower-scoring branch." },
        { input: "1 3\n5 8", expected_output: "5\n8", description: "Beam wider than the candidate set keeps the only branch." },
        { input: "5 3\n1 5\n2 5\n3 5\n4 2\n5 2", expected_output: "1 2 3\n15", description: "Three branches tie at the top score; the smallest ids survive the prune." }
      ]
    },
    {
      id: "ai-15-l7",
      project_id: "ai-15",
      order: 7,
      title: "Reflection and Self-Critique",
      concept: "Reflection",
      xp_reward: 10,
      explanation: `A model writes a function, you ask "are there any bugs in what you just wrote?", and it finds the off-by-one error it created seconds ago. Nothing about the model changed. You simply gave it a second pass — a chance to read its own work with fresh eyes and fix it. That second pass is **reflection**, and it is one of the cheapest quality upgrades you can bolt onto any prompt.

## What it is

**Reflection** (or **self-critique**) is a pattern where the model produces a first answer, then critiques that answer against some standard, and finally revises it. Generation and evaluation become separate steps instead of being crammed into one shot. The model wears two hats in sequence: first the **author**, then the **critic**, then the author again with the critique in hand.

It works for the same reason chain of thought works. A single forward pass that must be correct on the first try is fragile. Splitting it into draft, critique, and revise gives the model explicit room to catch what the draft missed — much like a writer who always edits before publishing.

## How it works

The loop is generate, critique, revise, and optionally repeat:

\`\`\`python
draft = model(task)                                   # 1. author writes
critique = model(f"Find every flaw in this:\\n{draft}")  # 2. critic reviews
final = model(f"Rewrite to fix these issues:\\n{critique}\\n{draft}")  # 3. revise
\`\`\`

The critique step is doing the real work. A vague "make it better" yields little; a sharp critique grounded in concrete criteria — "check each constraint, list every violation" — produces fixable, specific feedback. You can run the loop once or iterate until the critic finds nothing left to fix or a step budget runs out.

A crucial detail: the critic should judge against an **external standard** where possible — a spec, a checklist, test results, a tool's output. Asking a model to grade itself with no anchor invites it to rubber-stamp its own work.

## Why it matters

Reflection catches a whole class of errors that one-shot prompting ships straight to the user.

- **It fixes self-made mistakes.** Constraint violations, skipped requirements, sloppy formatting — the critic pass surfaces them before they reach anyone.
- **It costs extra calls.** Draft plus critique plus revise is at least three passes, so reserve it for answers where correctness matters more than latency.
- **It has a ceiling.** The model can only catch flaws it is capable of recognizing. If it didn't know a fact was wrong when it wrote it, it usually won't catch it on review. Reflection sharpens, it does not add knowledge.
- **Anchored critique beats vanity critique.** Grounding the critic in tests, specs, or rules makes the difference between real fixes and the model congratulating itself.

## The mental model to keep

**Never ship the first draft. Make the model put on the critic's hat, judge its own work against a real standard, then revise — author, critic, author again.**`,
      key_terms: [
        { term: "Reflection", definition: "A pattern where the model drafts an answer, critiques it, and revises based on the critique." },
        { term: "Self-critique", definition: "The step where the model evaluates its own draft to find flaws to fix." },
        { term: "Draft-critique-revise loop", definition: "The three-stage cycle of generating, evaluating, and rewriting an answer." },
        { term: "External standard", definition: "An anchor for critique (spec, checklist, tests, tool output) that prevents the model from rubber-stamping itself." }
      ],
      callouts: [
        { type: "analogy", title: "Write, then edit", content: "No good writer publishes the first draft. They write it, set it down, then read it critically and fix what's wrong. Reflection makes the model do the editing pass it would otherwise skip.", position: "before" },
        { type: "warning", title: "Reflection sharpens, it doesn't add knowledge", content: "The model can only catch flaws it is able to recognize. If it didn't know a fact was wrong when it wrote it, asking it to review usually won't surface the error. Anchor the critique in tests or specs.", position: "after" }
      ],
      concept_diagram: {
        title: "The draft-critique-revise loop",
        steps: [
          { label: "Draft", desc: "The model produces a first-pass answer to the task." },
          { label: "Critique", desc: "It reviews that draft against a concrete standard and lists flaws." },
          { label: "Revise", desc: "It rewrites the answer to fix the flaws the critique found." },
          { label: "Repeat or stop", desc: "Loop again, or stop when no flaws remain or the budget runs out." }
        ]
      },
      inline_quizzes: [
        {
          question: "What makes a reflection critique step actually useful?",
          options: ["Telling the model to 'make it better'", "Grounding the critique in concrete criteria or an external standard", "Running it at temperature zero"],
          correct_index: 1,
          explanation: "Vague self-grading invites rubber-stamping; concrete, anchored criteria produce specific, fixable feedback."
        }
      ],
      quiz_questions: [
        {
          question: "What are the three core stages of the reflection pattern?",
          options: [
            "Tokenize, embed, decode",
            "Draft an answer, critique it, then revise it",
            "Train, freeze, infer",
            "Branch, score, prune"
          ],
          correct_index: 1,
          explanation: "Reflection separates generation from evaluation: the model authors a draft, critiques it, then rewrites to fix the flaws."
        },
        {
          question: "Why does grounding the critique in an external standard matter?",
          options: [
            "It makes the answer shorter",
            "Without an anchor, a model tends to rubber-stamp its own work instead of finding real flaws",
            "It removes the need for a revise step",
            "It lowers token cost"
          ],
          correct_index: 1,
          explanation: "A spec, checklist, or test result gives the critic something concrete to judge against, producing genuine fixes rather than self-congratulation."
        },
        {
          question: "Which kind of error is reflection LEAST likely to fix?",
          options: [
            "A skipped requirement from the task",
            "A formatting inconsistency in the draft",
            "A confident factual claim the model never knew was wrong",
            "A constraint the draft violated"
          ],
          correct_index: 2,
          explanation: "Reflection can only catch flaws the model is capable of recognizing; it sharpens existing reasoning but does not add missing knowledge."
        }
      ],
      participation_activities: [
        {
          activity_title: "Reflection check",
          questions: [
            { question: "Reflection improves an answer by retraining the model on its own output.", type: "true_false", correct_answer: "false", explanation: "Nothing is retrained; the model simply drafts, critiques, and revises within the prompt using its frozen weights." },
            { question: "The reflection loop has three stages: draft, ______, and revise.", type: "fill_in", correct_answer: "critique", explanation: "The critique step is where the model evaluates its draft against a standard." }
          ]
        }
      ],
      starter_code: `# Apply a one-pass self-critique: remove words that violate a banned-words rule.
draft = ["the", "bad", "cat", "ugh", "sat"]
banned = {"bad", "ugh"}

# TODO: build the revised answer by dropping any word that is banned.
print(draft)
`,
      solution_code: `draft = ["the", "bad", "cat", "ugh", "sat"]
banned = {"bad", "ugh"}

revised = [w for w in draft if w not in banned]
fixes = len(draft) - len(revised)

print("draft:", draft)
print("revised:", revised)
print("fixes applied:", fixes)
`,
      expected_output: `draft: ['the', 'bad', 'cat', 'ugh', 'sat']
revised: ['the', 'cat', 'sat']
fixes applied: 2`,
      step_throughs: [
        {
          title: "draft, critique, revise in one pass",
          steps: [
            { label: "Author the draft", detail: "The model produces a first answer without worrying about every rule yet.", code: 'draft = "the bad cat ugh sat happily"' },
            { label: "Critique against the rules", detail: "Put on the critic hat: check the draft against concrete criteria (banned words, max length) and list every violation.", code: 'flaws = ["banned word: bad", "banned word: ugh", "too long"]' },
            { label: "Revise to fix flaws", detail: "Rewrite the answer applying each fix the critique found, in order.", code: 'revised = "the cat sat"' },
            { label: "Stop when clean", detail: "Re-check the revised answer; if no flaws remain (or the budget is spent), ship it.", code: 'critique(revised) -> no flaws -> done' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A model drafts a reply that accidentally uses a banned word. How does a single reflection pass fix this?",
          steps: [
            "The critique step checks the draft against the rule that the word is banned and flags it as a violation.",
            "The revise step rewrites the reply with that word removed or replaced.",
            "The result obeys the rule the first draft broke, without changing anything about the model itself."
          ],
          output: "The critique flags the banned word and the revise step removes it, fixing a self-made mistake."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You add a reflection loop and the critique is just 'looks good, maybe improve it.' Quality barely changes. What's wrong and how do you fix it?",
          steps: [
            "A vague critique gives the revise step nothing concrete to act on, so almost nothing changes.",
            "Worse, an unanchored self-review tends to rubber-stamp the draft rather than hunt for flaws.",
            "Anchor the critique in concrete criteria: a checklist, the task constraints, or actual test results.",
            "Ask it to list every specific violation, so the revise step has precise, fixable feedback to apply."
          ],
          output: "The critique was too vague and unanchored; ground it in concrete criteria so it produces specific, fixable feedback."
        }
      ],
      comparison_tables: [
        {
          title: "one-shot answer vs reflection",
          columns: ["Aspect", "One-shot", "Reflection"],
          rows: [
            { cells: ["Passes", "One", "Draft + critique + revise"] },
            { cells: ["Catches self-made errors", "Often misses them", "Surfaces and fixes them"] },
            { cells: ["Cost", "One call", "At least three calls"] },
            { cells: ["Adds missing knowledge", "No", "No (it only sharpens)"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "reflection helps vs reflection won't help",
          bins: [
            { id: "helps", label: "Reflection helps" },
            { id: "wont", label: "Reflection won't help" }
          ],
          items: [
            { id: "i1", text: "A constraint the draft violated", bin: "helps" },
            { id: "i2", text: "A fact the model never knew was wrong", bin: "wont" },
            { id: "i3", text: "A skipped requirement from the task", bin: "helps" },
            { id: "i4", text: "Knowledge missing from training entirely", bin: "wont" },
            { id: "i5", text: "A formatting inconsistency in the draft", bin: "helps" },
            { id: "i6", text: "A self-grade with no anchor (rubber-stamp)", bin: "wont" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does splitting an answer into draft, critique, and revise tend to beat a single one-shot attempt?",
          sampleAnswer: "A one-shot answer has to be right on the first forward pass, with no chance to notice what it missed. Splitting it gives the model explicit room to put on a critic's hat, read its own draft against a concrete standard, and catch self-made errors like skipped requirements or broken constraints, then rewrite to fix them. It mirrors how a writer edits before publishing instead of shipping the first draft."
        }
      ],
      hints: [
        "Use a list comprehension that keeps each word only if it is not in banned.",
        "The number of fixes is the original length minus the revised length.",
        "Print the draft, the revised list, and the fix count."
      ],
      challenge_title: "The Self-Critique Pass",
      challenge_description: "Run a model's draft answer through a two-rule critique-and-revise pass and report the fixes applied.",
      challenge_story: "Your assistant drafts answers fast but sloppily, so you bolt on a **reflection** step before anything ships. The critic enforces two concrete rules against the draft, which is a list of words: first, **no banned words** are allowed; second, the answer must be at most `L` words long. The revise step applies the critique in order — strip every banned word, then if the result is still too long, trim words from the **end** until it fits. Each individual removal counts as one fix. Build the critique-and-revise pass so you can log how much cleanup each draft needed.",
      challenge_statement: "You're given a max length `L`, a set of banned words, and a draft answer (a list of words). Apply the self-critique pass in two ordered stages:\n\n1. **Strip banned words** — remove every word that appears in the banned set. Each removed word counts as one fix.\n2. **Trim to length** — if more than `L` words remain, remove words from the **end** one at a time until exactly `L` remain. Each removal counts as one fix.\n\nPrint the total number of fixes applied on the first line, then the final revised answer (words space-separated) on the second line, or `-` if the answer is empty.",
      challenge_input_format: "Line 1: integer `L`. Line 2: integer `b`, the number of banned words. Line 3: the `b` banned words space-separated (this line is present but empty when `b` is 0). Line 4: the draft answer as space-separated words.",
      challenge_output_format: "Line 1: the total number of fixes applied. Line 2: the revised answer words space-separated, or `-` if empty.",
      challenge_constraints: [
        "0 ≤ L ≤ 100000",
        "0 ≤ b ≤ 100000",
        "1 ≤ number of draft words ≤ 100000",
        "Words are non-empty and contain no spaces",
      ],
      challenge_examples: [
        { input: "3\n2\nbad ugh\nthe bad cat ugh sat happily", output: "3\nthe cat sat", explanation: "Strip banned 'bad' and 'ugh' (2 fixes) leaving [the, cat, sat, happily]. That's 4 words, over L=3, so trim 'happily' from the end (1 fix). Total 3 fixes, final 'the cat sat'." },
        { input: "5\n0\n\nhello there friend", output: "0\nhello there friend", explanation: "No banned words and only 3 words (within L=5), so no fixes are needed and the draft passes unchanged." },
      ],
      challenge_notes: "The order matters: stripping banned words first can drop the length below `L` so no trimming is needed. This mirrors real reflection — the critique enumerates concrete violations and the revise step applies them in a defined order. Reflection only fixes flaws the critic can detect; here the rules are explicit, so every violation is caught.",
      challenge_hints: [
        "Stage 1: build a new list keeping only words not in the banned set; the count dropped is original length minus kept length.",
        "Stage 2: while the kept list is longer than L, pop from the end and increment the fix count.",
        "Track fixes across both stages; print `-` for the answer line if nothing survives.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    L = int(data[0])
    b = int(data[1])
    banned = set(data[2].split()) if b > 0 else set()
    words = data[3].split()
    # parse done: L is the max length, 'banned' the banned-word set, 'words' the draft

    # TODO: stage 1 - drop every word in 'banned' (each removal = 1 fix).
    # TODO: stage 2 - while more than L words remain, pop from the END (each = 1 fix).
    # Print the total fix count, then the final words (space-separated) or "-" if empty.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    L = int(data[0])
    b = int(data[1])
    banned = set(data[2].split()) if b > 0 else set()
    words = data[3].split()

    fixes = 0
    revised = []
    for w in words:
        if w in banned:
            fixes += 1
        else:
            revised.append(w)
    while len(revised) > L:
        revised.pop()
        fixes += 1

    print(fixes)
    print(" ".join(revised) if revised else "-")

main()
`,
      challenge_test_cases: [
        { input: "3\n2\nbad ugh\nthe bad cat ugh sat happily", expected_output: "3\nthe cat sat", description: "Strip two banned words, then trim one from the end to meet the length cap." },
        { input: "5\n0\n\nhello there friend", expected_output: "0\nhello there friend", description: "Clean draft within the length limit needs no fixes." },
        { input: "4\n1\nx\nx x x", expected_output: "3\n-", description: "Every word is banned, so all three are stripped and the answer is empty." },
        { input: "2\n0\n\na b c d e", expected_output: "3\na b", description: "No banned words; trim three words from the end to reach length 2." }
      ]
    },
    {
      id: "ai-15-l8",
      project_id: "ai-15",
      order: 8,
      title: "Meta-Prompting",
      concept: "MetaPrompt",
      xp_reward: 10,
      explanation: `You've spent this module hand-crafting prompts: adding triggers, balancing examples, wiring chains. Now flip the script. What if you let a model write the prompt for you? Hand it your goal and a few examples, and ask it to produce the best prompt for the job. That is **meta-prompting** — using a model to write or optimize prompts for another task — and it turns prompt engineering itself into something you can automate.

## What it is

**Meta-prompting** is using one model call to generate or improve the prompt that a second call will actually run. The first call's *output* is a prompt; the second call *consumes* that prompt to do the real work. You stop writing the instructions by hand and instead describe what you want, letting the model draft the instructions.

The idea leans on a strength models have: they have read enormous numbers of prompts and know what well-structured instructions look like. Often a model can write a clearer, better-organized prompt than a human typing in a hurry — especially for formatting, edge-case handling, and explicit step-by-step structure.

## How it works

A meta-prompt asks for a prompt as its answer:

\`\`\`python
meta = (
    "Write a clear, reliable prompt that classifies a customer email "
    "as billing, technical, or other. Require a one-word answer. "
    "Include two few-shot examples."
)
generated_prompt = model(meta)     # the model writes the task prompt
result = model(generated_prompt + "\\n" + real_email)  # then we run it
\`\`\`

This unlocks **automatic prompt optimization**: generate several candidate prompts, run each against a small set of labeled examples, score how well each performs, and keep the winner. Prompt engineering becomes a search — propose candidates, evaluate against examples, select the best. It is the same propose-evaluate-select loop you saw in tree of thoughts and self-consistency, now applied to the prompts themselves.

## Why it matters

Meta-prompting scales prompt quality past what hand-tuning can reach.

- **It offloads phrasing and structure** to a model that has seen millions of good prompts, freeing you to specify only the goal.
- **It enables systematic optimization.** Instead of guessing which wording works, you measure candidates against real examples and pick the best objectively.
- **It costs extra calls.** Generating and evaluating candidates burns tokens before the real task even runs, so it pays off most when a prompt will be reused many times.
- **You still need an evaluator.** Picking the best candidate requires a way to score them. Garbage scoring picks garbage prompts, confidently.

## The mental model to keep

**Stop hand-writing every prompt. Describe the goal, let a model draft candidate prompts, measure them against real examples, and keep the winner — prompt engineering as a measurable search.**`,
      key_terms: [
        { term: "Meta-prompting", definition: "Using a model to generate or improve the prompt that another model call will run." },
        { term: "Generated prompt", definition: "The prompt produced as the output of a meta-prompt, then used for the real task." },
        { term: "Automatic prompt optimization", definition: "Generating candidate prompts, scoring them against examples, and keeping the best." },
        { term: "Evaluator", definition: "The scoring method that ranks candidate prompts so the best can be selected." }
      ],
      callouts: [
        { type: "analogy", title: "A prompt-writing assistant", content: "Instead of writing the brief yourself, you tell a skilled assistant the goal and let them draft it. The model has read millions of prompts and often structures one better than you would in a rush.", position: "before" },
        { type: "tip", title: "It's the same propose-evaluate-select loop", content: "Optimizing prompts is the same search you saw in tree of thoughts and voting: generate candidates, score them against real examples, keep the winner. The objects being searched are now prompts.", position: "after" }
      ],
      concept_diagram: {
        title: "How meta-prompting optimizes a prompt",
        steps: [
          { label: "Describe the goal", desc: "State the task and constraints to a meta-prompt." },
          { label: "Generate candidates", desc: "The model drafts one or more candidate prompts." },
          { label: "Evaluate", desc: "Score each candidate against a small set of labeled examples." },
          { label: "Select the winner", desc: "Keep the highest-scoring prompt to run on the real task." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the output of a meta-prompt?",
          options: ["The final answer to the user's task", "A prompt that a second call will run", "A set of model weights"],
          correct_index: 1,
          explanation: "A meta-prompt produces a prompt as its output; a separate call then consumes that prompt to do the real work."
        }
      ],
      quiz_questions: [
        {
          question: "What does meta-prompting actually produce?",
          options: [
            "A fine-tuned model",
            "A prompt that another model call will use to do the real task",
            "A larger context window",
            "A majority vote of answers"
          ],
          correct_index: 1,
          explanation: "The first call writes or improves a prompt; the second call consumes that generated prompt to perform the actual task."
        },
        {
          question: "How does automatic prompt optimization choose a prompt?",
          options: [
            "It picks the longest candidate",
            "It generates candidates, scores each against labeled examples, and keeps the best",
            "It always reuses the first prompt written",
            "It lowers the temperature until one works"
          ],
          correct_index: 1,
          explanation: "Optimization is a propose-evaluate-select search: candidates are measured against real examples and the top scorer wins."
        },
        {
          question: "When does meta-prompting pay off the most?",
          options: [
            "For a one-off prompt used a single time",
            "When a prompt will be reused many times, amortizing the extra generation and evaluation cost",
            "Only at temperature zero",
            "When you have no examples to test against"
          ],
          correct_index: 1,
          explanation: "Generating and evaluating candidates costs extra calls up front, so the payoff is largest when the resulting prompt is reused repeatedly."
        }
      ],
      participation_activities: [
        {
          activity_title: "Meta-prompting check",
          questions: [
            { question: "Meta-prompting uses a model to write or improve a prompt that another call will run.", type: "true_false", correct_answer: "true", explanation: "The first call's output is a prompt; a second call consumes it to do the real task." },
            { question: "Generating candidate prompts, scoring them against examples, and keeping the best is called automatic prompt ______.", type: "fill_in", correct_answer: "optimization", explanation: "Automatic prompt optimization turns prompt engineering into a measurable search." }
          ]
        }
      ],
      starter_code: `# Pick the best candidate prompt by its total evaluation score.
candidates = [
    ("promptA", [5, 5, 5]),
    ("promptB", [9, 9, 1]),
    ("promptC", [6, 6, 7]),
]
# TODO: choose the candidate whose scores sum to the most.
print(candidates)
`,
      solution_code: `candidates = [
    ("promptA", [5, 5, 5]),
    ("promptB", [9, 9, 1]),
    ("promptC", [6, 6, 7]),
]

best = max(candidates, key=lambda c: sum(c[1]))

print("candidates:", [(name, sum(scores)) for name, scores in candidates])
print("winner:", best[0], "total:", sum(best[1]))
`,
      expected_output: `candidates: [('promptA', 15), ('promptB', 19), ('promptC', 19)]
winner: promptB total: 19`,
      step_throughs: [
        {
          title: "optimizing a prompt by search",
          steps: [
            { label: "Describe the goal", detail: "You write a meta-prompt stating the task, the required output, and constraints, instead of the task prompt itself.", code: 'meta = "Write a prompt that classifies email as billing/technical/other, one word."' },
            { label: "Generate candidates", detail: "The model drafts several candidate prompts, each phrased and structured differently.", code: 'candidates = [promptA, promptB, promptC]' },
            { label: "Evaluate against examples", detail: "Run each candidate over a small labeled set and score how many it gets right.", code: 'scores = [12, 19, 19]  # correct out of 20' },
            { label: "Select the winner", detail: "Keep the highest-scoring prompt (break ties with a secondary rule) to use on real inputs.", code: 'best = max(candidates, key=score)' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Three candidate prompts score 12, 19, and 15 on the same labeled test set. Which one does automatic optimization keep, and why?",
          steps: [
            "Optimization selects the candidate with the highest evaluation score.",
            "Compare the scores: 19 is the largest.",
            "The prompt scoring 19 is kept and used for the real task; the others are discarded."
          ],
          output: "The prompt scoring 19 — optimization keeps the highest-scoring candidate."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Two candidate prompts tie at the top score, but one is far shorter. Why might you prefer the shorter one, and what does that reveal about needing an evaluator beyond raw accuracy?",
          steps: [
            "A shorter prompt uses fewer tokens on every single call, so it is cheaper to run at scale.",
            "If both score equally on the examples, the shorter one delivers the same quality for less money and latency.",
            "This means raw accuracy alone is not a complete evaluator; cost and length can be tie-breakers.",
            "A good optimization setup encodes those secondary criteria explicitly so the search picks the truly best prompt, not just the most accurate one."
          ],
          output: "Prefer the shorter prompt when scores tie; a real evaluator weighs cost and length, not accuracy alone."
        }
      ],
      comparison_tables: [
        {
          title: "hand-written prompt vs meta-prompting",
          columns: ["Aspect", "Hand-written", "Meta-prompting"],
          rows: [
            { cells: ["Who writes the prompt", "You, by hand", "A model, from your goal"] },
            { cells: ["Selecting the best wording", "Guesswork", "Measured against examples"] },
            { cells: ["Upfront cost", "Low", "Higher (generate + evaluate)"] },
            { cells: ["Best when", "One-off prompt", "Prompt reused many times"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "meta-prompting vs plain prompting",
          bins: [
            { id: "meta", label: "Meta-prompting" },
            { id: "plain", label: "Plain prompting" }
          ],
          items: [
            { id: "i1", text: "A model writes the prompt for another call", bin: "meta" },
            { id: "i2", text: "You type the task instructions yourself", bin: "plain" },
            { id: "i3", text: "Scores candidate prompts against examples", bin: "meta" },
            { id: "i4", text: "One call does the task directly", bin: "plain" },
            { id: "i5", text: "Turns prompt design into a search", bin: "meta" },
            { id: "i6", text: "No extra generation or evaluation calls", bin: "plain" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is automatic prompt optimization described as the same propose-evaluate-select loop you saw in tree of thoughts and self-consistency?",
          sampleAnswer: "All three are searches: you generate several candidates, score each against some standard, and keep the best. Tree of thoughts searches over reasoning branches and self-consistency searches over reasoning paths to vote on; meta-prompting searches over candidate prompts, measuring each against labeled examples and selecting the top scorer. The object being optimized changes, but the propose-evaluate-select structure is identical."
        }
      ],
      hints: [
        "max() with a key lets you compare candidates by a computed value.",
        "Use key=lambda c: sum(c[1]) so it ranks by total evaluation score.",
        "The winner is the tuple max() returns; print its name and total."
      ],
      challenge_title: "The Prompt Optimizer",
      challenge_description: "Select the best candidate prompt from evaluation scores, breaking ties by length then by id.",
      challenge_story: "You're building an **automatic prompt optimizer**. A meta-prompt produced several candidate prompts for the same task, and you've already run each candidate against a shared set of labeled examples, recording one score per example. Now you have to pick the winner the way a real optimizer does: highest total score wins, but when prompts tie on quality you prefer the **shorter** one (cheaper to run on every call), and if they still tie you fall back to the lexicographically smallest **id** for a deterministic choice. Build the selector that turns raw evaluation data into the single prompt your system will ship.",
      challenge_statement: "You're given `n` candidate prompts, each scored on the same `m` evaluation examples. For each candidate you have its id, its length in tokens, and its `m` scores.\n\nSelect the best candidate using these rules in order:\n\n1. **Highest total score** (the sum of its `m` scores) wins.\n2. On a tie, prefer the **smaller length**.\n3. If still tied, prefer the **lexicographically smaller id**.\n\nPrint the winning candidate's id and its total score, space-separated.",
      challenge_input_format: "The first line has two integers `n m`. Each of the next `n` lines describes one candidate: an id (one word, no spaces), an integer length, then `m` integer scores, all space-separated.",
      challenge_output_format: "One line: `id total_score`, separated by a single space.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ m ≤ 100",
        "1 ≤ length ≤ 1000000",
        "-1000000000 ≤ each score ≤ 1000000000",
        "ids are distinct non-empty strings with no spaces",
      ],
      challenge_examples: [
        { input: "3 3\npA 20 5 5 5\npB 10 9 9 1\npC 15 6 6 7", output: "pB 19", explanation: "Totals: pA=15, pB=19, pC=19. pB and pC tie at 19, so length breaks it: pB (10) is shorter than pC (15). pB wins with total 19." },
        { input: "2 1\nzeta 10 8\nalpha 10 8", output: "alpha 8", explanation: "Both total 8 and both length 10, so the lexicographically smaller id 'alpha' wins." },
      ],
      challenge_notes: "This is automatic prompt optimization in miniature: propose candidates, evaluate each against the same examples, and select the best by an explicit objective. The tie-breakers matter because raw accuracy is rarely the only thing you care about — a shorter prompt costs less on every call, so it's the better pick when quality is equal.",
      challenge_hints: [
        "For each candidate compute the total as the sum of its m scores.",
        "Build a comparison key of (-total, length, id) so the smallest key under normal tuple ordering is the winner.",
        "Track the best candidate as you read; replace it whenever a strictly smaller key appears.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, m = map(int, data[0].split())
    candidates = []
    for i in range(1, n + 1):
        parts = data[i].split()
        cid = parts[0]
        length = int(parts[1])
        scores = list(map(int, parts[2:2 + m]))
        candidates.append((cid, length, scores))
    # parse done: each candidate is (id, length, [m scores])

    # TODO: for each candidate compute its total (sum of scores). Pick the best by
    # (highest total, then smaller length, then lexicographically smaller id).
    # Print "id total_score".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, m = map(int, data[0].split())
    best_key = None
    best_id = None
    best_total = None
    for i in range(1, n + 1):
        parts = data[i].split()
        cid = parts[0]
        length = int(parts[1])
        scores = list(map(int, parts[2:2 + m]))
        total = sum(scores)
        key = (-total, length, cid)
        if best_key is None or key < best_key:
            best_key = key
            best_id = cid
            best_total = total
    print(f"{best_id} {best_total}")

main()
`,
      challenge_test_cases: [
        { input: "3 3\npA 20 5 5 5\npB 10 9 9 1\npC 15 6 6 7", expected_output: "pB 19", description: "Tie on total resolved by the shorter prompt length." },
        { input: "2 1\nzeta 10 8\nalpha 10 8", expected_output: "alpha 8", description: "Tie on total and length resolved by lexicographic id." },
        { input: "3 2\npX 30 5 5\npY 12 4 6\npZ 50 1 1", expected_output: "pY 10", description: "pX and pY tie at 10; pY is shorter, so it wins over the higher-length pX." }
      ]
    }
  ]
};
