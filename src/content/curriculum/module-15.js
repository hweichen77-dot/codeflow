export default {
  project: {
    id: "ai-15",
    title: "Advanced Prompting Patterns",
    description: "Move past one-shot prompts into reliable patterns: chain of thought, few-shot, self-consistency, ReAct, and decomposition. Each pattern is a tool for squeezing more correctness out of the same model.",
    difficulty: "intermediate",
    category: "ai_ml",
    estimated_time: 50,
    lessons_count: 5,
    tags: ["prompting", "chain-of-thought", "few-shot", "react", "reasoning"],
    order: 15,
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
      challenge_title: "Add a CoT trigger",
      challenge_description: "Write a function make_cot(question) that returns the question with ' Let's think step by step.' appended. Test it on one question and print the result.",
      challenge_starter_code: `# TODO: define make_cot(question) that appends the trigger phrase, then test it.
`,
      challenge_solution_code: `def make_cot(question):
    return question + " Let's think step by step."

print(make_cot("What is 17 times 24?"))
`,
      challenge_test_cases: [
        { input: '"What is 17 times 24?"', expected_output: "What is 17 times 24? Let's think step by step.", description: "Appends the zero-shot CoT trigger to the question." }
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
      challenge_title: "Build a few-shot prompt",
      challenge_description: "Write a function build_prompt(examples, new_input) where examples is a list of (text, label) tuples. Return a prompt with each example as 'Text: ...\\nLabel: ...\\n\\n' followed by 'Text: <new_input>\\nLabel:'. Print the result for two examples.",
      challenge_starter_code: `examples = [("great service", "positive"), ("rude staff", "negative")]
new_input = "amazing dessert"
# TODO: define build_prompt(examples, new_input) and print the result.
`,
      challenge_solution_code: `examples = [("great service", "positive"), ("rude staff", "negative")]
new_input = "amazing dessert"

def build_prompt(examples, new_input):
    p = ""
    for text, label in examples:
        p += f"Text: {text}\\nLabel: {label}\\n\\n"
    p += f"Text: {new_input}\\nLabel:"
    return p

print(build_prompt(examples, new_input))
`,
      challenge_test_cases: [
        { input: "two examples + new_input", expected_output: "Text: great service\nLabel: positive\n\nText: rude staff\nLabel: negative\n\nText: amazing dessert\nLabel:", description: "Formats each example pair then leaves the new input's label open." }
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
      challenge_title: "Majority vote function",
      challenge_description: "Write a function vote(answers) that returns the most common element of the list. Test it on [3, 3, 7, 3, 7] and print the result.",
      challenge_starter_code: `from collections import Counter
# TODO: define vote(answers) returning the most common element, then test it.
`,
      challenge_solution_code: `from collections import Counter

def vote(answers):
    return Counter(answers).most_common(1)[0][0]

print(vote([3, 3, 7, 3, 7]))
`,
      challenge_test_cases: [
        { input: "[3, 3, 7, 3, 7]", expected_output: "3", description: "3 appears three times, 7 twice, so 3 is the majority." }
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
      challenge_title: "Run one ReAct action",
      challenge_description: "Write a function run_action(action, tool) where action looks like 'calc(\"2+2\")'. Extract the argument between the quotes and pass it to the tool function. Test it with a tool that evaluates simple sums.",
      challenge_starter_code: `def calc(expr):
    a, b = expr.split("+")
    return int(a) + int(b)

action = 'calc("2+2")'
# TODO: define run_action(action, tool) that extracts the arg and calls tool.
`,
      challenge_solution_code: `def calc(expr):
    a, b = expr.split("+")
    return int(a) + int(b)

def run_action(action, tool):
    arg = action[action.index('"') + 1 : action.rindex('"')]
    return tool(arg)

action = 'calc("2+2")'
print(run_action(action, calc))
`,
      challenge_test_cases: [
        { input: "'calc(\"2+2\")'", expected_output: "4", description: "Extracts '2+2' from the action and the calc tool returns 4." }
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
      challenge_title: "Chain three steps",
      challenge_description: "Build a 3-step chain over a list of numbers: step 1 keeps only evens, step 2 doubles each, step 3 sums them. Each step takes the previous step's output. Run it on [1, 2, 3, 4] and print the final total.",
      challenge_starter_code: `nums = [1, 2, 3, 4]
# TODO: step 1 keep evens, step 2 double each, step 3 sum. Chain the outputs.
`,
      challenge_solution_code: `nums = [1, 2, 3, 4]

def keep_evens(xs):
    return [x for x in xs if x % 2 == 0]

def double(xs):
    return [x * 2 for x in xs]

def total(xs):
    return sum(xs)

step1 = keep_evens(nums)
step2 = double(step1)
result = total(step2)
print(result)
`,
      challenge_test_cases: [
        { input: "[1, 2, 3, 4]", expected_output: "12", description: "Evens [2,4] -> doubled [4,8] -> sum 12, each step feeding the next." }
      ]
    }
  ]
};
