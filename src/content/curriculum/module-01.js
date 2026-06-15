export default {
  project: {
    id: "ai-01",
    title: "How AI Actually Works",
    description: "Build a real mental model of how language models predict text, why they sometimes lie, and what tokens actually are.",
    difficulty: "beginner",
    category: "ai_ml",
    estimated_time: 45,
    lessons_count: 4,
    tags: ["llm", "intuition", "tokens", "prediction", "fundamentals"],
    order: 1,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-01-l1",
      project_id: "ai-01",
      order: 1,
      title: "Prediction Machines, Not Brains",
      concept: "Prediction",
      xp_reward: 10,
      explanation: `Type "I'm running a little" into your phone and it suggests "late." That's the whole trick. A large language model is autocomplete that read most of the internet.

## What the model actually does

An LLM does exactly one thing: given some text, it guesses the next chunk of text. Then it adds that chunk to the input and guesses again. And again. It keeps going until it decides to stop. That stream of guesses is the "answer" you see.

It is not thinking about your question the way a person does. It is not looking up facts in a database. It is computing, for every possible next chunk, "how likely is this to come next?" — and picking from the top candidates.

Here's the part that surprises people: there's no separate step where the model "decides what to say" and then "writes it." Writing the next word *is* the deciding. The sentence builds itself one piece at a time.

## Why this matters

Once you see the model as a prediction machine, a lot of weird behavior stops being mysterious:

- It sounds confident even when it's wrong, because confident-sounding text is what usually follows a question on the internet.
- It can write a poem and debug Python with the same machinery — both are just "what text comes next?"
- It has no memory of you between conversations unless you feed it that history again. Each request is a fresh prediction over whatever text you handed it.

## The mental model to keep

Picture a ridiculously well-read person who has to answer every question by blurting out one word at a time, with no ability to pause and check anything. Fast. Fluent. Often right. Sometimes makes stuff up with a straight face.

Don't think "robot brain." Think "the most powerful autocomplete ever built." That single swap will make the rest of this module click.`,
      key_terms: [
        { term: "Language model", definition: "A program that predicts the next chunk of text given the text before it." },
        { term: "Next-token prediction", definition: "The core operation: guess what comes next, add it, repeat." },
        { term: "Inference", definition: "Running the trained model to generate a prediction for your input." }
      ],
      callouts: [
        { type: "analogy", title: "It's autocomplete on steroids", content: "Your phone suggests one word. An LLM suggests the next word millions of times, fast, after reading a huge chunk of the internet. Same idea, bigger scale.", position: "before" },
        { type: "insight", title: "Writing is the deciding", content: "There's no hidden 'plan' the model writes out. Each next word is chosen on the spot based on everything so far. That's why a single wrong word can send an answer off a cliff.", position: "after" }
      ],
      concept_diagram: {
        title: "How one answer gets built",
        steps: [
          { label: "You send text", desc: "Your question becomes the starting input." },
          { label: "Predict next chunk", desc: "Model scores likely next pieces and picks one." },
          { label: "Append + repeat", desc: "That piece is added; the model predicts again." },
          { label: "Stop", desc: "Model emits a stop signal; the collected chunks are your answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "At its core, what is a language model doing?",
          options: ["Looking up answers in a fact database", "Predicting the next chunk of text, over and over", "Translating your question into a search query"],
          correct_index: 1,
          explanation: "Everything an LLM produces comes from repeatedly predicting the next chunk of text."
        }
      ],
      quiz_questions: [
        {
          question: "Why can an LLM sound confident even when it's wrong?",
          options: [
            "It double-checks every fact before answering",
            "Confident-sounding text is what usually follows a question in its training data",
            "It refuses to answer unless it is certain",
            "It asks another model to verify first"
          ],
          correct_index: 1,
          explanation: "The model imitates the style of text it learned from. Confident phrasing is common online, so it copies that tone regardless of correctness."
        },
        {
          question: "How does a fresh LLM request relate to your previous conversation?",
          options: [
            "It remembers everything you ever said automatically",
            "It has no memory unless the prior text is fed back in",
            "It stores your history on the model itself",
            "It can read your other open chats"
          ],
          correct_index: 1,
          explanation: "Each request predicts over only the text you provide. Apps create the feeling of memory by resending earlier messages."
        },
        {
          question: "Which mental model is most accurate for a beginner?",
          options: [
            "A robot brain that understands like a human",
            "A search engine with a chat skin",
            "The most powerful autocomplete ever built",
            "A calculator for words"
          ],
          correct_index: 2,
          explanation: "Autocomplete-at-scale captures the prediction loop without implying human-style understanding."
        }
      ],
      participation_activities: [
        {
          activity_title: "Spot the prediction machine",
          questions: [
            { question: "An LLM generates its answer one chunk at a time rather than all at once.", type: "true_false", correct_answer: "true", explanation: "It predicts the next chunk, appends it, and repeats until it stops." },
            { question: "The single thing a language model does is ______ the next chunk of text.", type: "fill_in", correct_answer: "predict", explanation: "Next-token prediction is the entire engine." }
          ]
        }
      ],
      starter_code: `# Toy autocomplete: pick the most likely next word from a tiny table.
# This is NOT a real LLM, but it shows the prediction loop.

next_word = {
    "i am": "running",
    "i am running": "a",
    "i am running a": "little",
    "i am running a little": "late",
}

prompt = "i am"
# TODO: print the prompt, then keep looking up the next word until none is found.
print(prompt)
`,
      solution_code: `# Toy autocomplete: pick the most likely next word from a tiny table.
next_word = {
    "i am": "running",
    "i am running": "a",
    "i am running a": "little",
    "i am running a little": "late",
}

prompt = "i am"
print(prompt)
while prompt in next_word:
    word = next_word[prompt]   # "predict" the next word
    prompt = prompt + " " + word
    print(prompt)
`,
      expected_output: `i am
i am running
i am running a
i am running a little
i am running a little late`,
      hints: [
        "The dictionary maps the text-so-far to the next word. Look up the current prompt.",
        "Use a while loop: keep going as long as the current prompt is a key in next_word.",
        "Each loop: get the next word, glue it onto prompt with a space, then print."
      ],
      challenge_title: "Add a stop signal",
      challenge_description: "Real models keep predicting until they emit a special stop token. Extend the loop so it appends '<END>' once no more words exist, and prints the final string with that marker.",
      challenge_starter_code: `next_word = {
    "hello": "there",
    "hello there": "friend",
}

prompt = "hello"
print(prompt)
# TODO: loop, and when no next word exists, append "<END>" and print once more.
`,
      challenge_solution_code: `next_word = {
    "hello": "there",
    "hello there": "friend",
}

prompt = "hello"
print(prompt)
while prompt in next_word:
    prompt = prompt + " " + next_word[prompt]
    print(prompt)
prompt = prompt + " <END>"
print(prompt)
`,
      challenge_test_cases: [
        { input: "(no input)", expected_output: "hello\nhello there\nhello there friend\nhello there friend <END>", description: "Walks the table then appends the stop marker." }
      ]
    },
    {
      id: "ai-01-l2",
      project_id: "ai-01",
      order: 2,
      title: "Tokens: The Model Doesn't See Words",
      concept: "Tokens",
      xp_reward: 10,
      explanation: `The model never sees the word "unbelievable." It sees something more like \`un\`, \`believ\`, \`able\`. Three pieces. These pieces are called **tokens**, and they're the real units a model reads and writes.

## What a token is

A token is a common chunk of text. Sometimes it's a whole word ("cat"), sometimes part of a word ("ing"), sometimes a space-plus-word (" the"), sometimes just punctuation (","). Models use a fixed vocabulary of roughly 50,000 to 100,000 tokens, learned by finding which chunks show up most often.

Rough rule of thumb for English: **1 token ≈ 4 characters ≈ ¾ of a word.** So 100 words is about 130 tokens. Don't memorize this. You'll look it up when it matters.

## Why you should care

Tokens aren't trivia. They control money, limits, and quality:

- **Cost.** APIs charge per token, input and output. Longer prompts and longer answers cost more.
- **Context limits.** A model can only "see" so many tokens at once — its context window. Stuff too much in and the oldest text falls off the edge.
- **Weird failures.** Tasks like "count the letters in 'strawberry'" trip models up partly because the model sees tokens, not individual letters. It literally isn't looking at the r's the way you are.

## How splitting works

Common text becomes few tokens. Rare or messy text becomes many. A clean English sentence is efficient. A long random string, an unusual name, or lots of emoji burns extra tokens because the model has to fall back to tiny pieces.

\`\`\`
"hello world"      -> ["hello", " world"]            (2 tokens)
"antidisestablish" -> ["anti", "dis", "establish"]   (3 tokens)
"🦄🦄🦄"            -> many tiny pieces               (lots of tokens)
\`\`\`

The takeaway: when you write a prompt, you're spending tokens. Tight, plain language is cheaper and usually clearer to the model too. That's a rare case where saving money and getting better results point the same direction.`,
      key_terms: [
        { term: "Token", definition: "A common chunk of text (word, word-piece, space, or punctuation) that the model reads and writes." },
        { term: "Vocabulary", definition: "The fixed set of tokens a model knows, usually tens of thousands of them." },
        { term: "Context window", definition: "The maximum number of tokens the model can consider in one request." }
      ],
      callouts: [
        { type: "analogy", title: "Tokens are LEGO bricks", content: "The model builds and reads everything out of a fixed box of bricks. Common bricks (' the', 'ing') are big and reusable; weird text has to be assembled from tiny bricks, which takes more of them.", position: "before" },
        { type: "tip", title: "1 token ≈ 4 chars", content: "For English, roughly 1 token per 4 characters, or about 75 words per 100 tokens. Good enough for back-of-the-envelope cost math.", position: "after" }
      ],
      concept_diagram: {
        title: "From your text to tokens to cost",
        steps: [
          { label: "Your text", desc: "A plain string like a prompt or a paragraph." },
          { label: "Tokenizer splits it", desc: "Text is chopped into known vocabulary chunks." },
          { label: "Count tokens", desc: "More chunks = more tokens, in and out." },
          { label: "Billed + limited", desc: "Tokens drive API cost and fit within the context window." }
        ]
      },
      inline_quizzes: [
        {
          question: "Roughly how many tokens is 100 words of English?",
          options: ["About 25 tokens", "About 130 tokens", "About 1,000 tokens"],
          correct_index: 1,
          explanation: "Using ~0.75 words per token, 100 words is roughly 130 tokens."
        }
      ],
      quiz_questions: [
        {
          question: "Why might counting letters in 'strawberry' be hard for an LLM?",
          options: [
            "The word is too long to fit in context",
            "It sees tokens, not individual letters",
            "It cannot read English words at all",
            "Counting is disabled in most models"
          ],
          correct_index: 1,
          explanation: "The model works over tokens (chunks), so individual letters aren't directly visible to it."
        },
        {
          question: "Which text will likely use the MOST tokens for its length?",
          options: [
            "A plain English sentence",
            "A long string of random characters",
            "Common words like 'the' and 'and'",
            "A short greeting"
          ],
          correct_index: 1,
          explanation: "Rare or messy text falls back to many tiny tokens, so it costs more tokens per character."
        },
        {
          question: "What does the context window limit?",
          options: [
            "How fast the model types",
            "How many tokens the model can consider at once",
            "How many users can chat at the same time",
            "The number of languages supported"
          ],
          correct_index: 1,
          explanation: "The context window caps total tokens (your input plus its output) the model sees in one request."
        }
      ],
      participation_activities: [
        {
          activity_title: "Token sense-check",
          questions: [
            { question: "The model reads whole words directly, never breaking them into pieces.", type: "true_false", correct_answer: "false", explanation: "Words are often split into multiple tokens (word-pieces)." },
            { question: "APIs charge you per ______, for both input and output.", type: "fill_in", correct_answer: "token", explanation: "Token count drives the bill in both directions." }
          ]
        }
      ],
      starter_code: `# Estimate token count with the rough 4-characters-per-token rule.
text = "Tokens are how models read text."

# TODO: estimate tokens as the character count divided by 4 (rounded up).
import math
char_count = len(text)
print("characters:", char_count)
`,
      solution_code: `import math
text = "Tokens are how models read text."

char_count = len(text)
est_tokens = math.ceil(char_count / 4)

print("characters:", char_count)
print("estimated tokens:", est_tokens)
`,
      expected_output: `characters: 32
estimated tokens: 8`,
      hints: [
        "len(text) gives the character count.",
        "Divide the character count by 4 to approximate tokens.",
        "Use math.ceil() so a partial token rounds up to a whole one."
      ],
      challenge_title: "Estimate API cost",
      challenge_description: "Given an input of 1000 tokens and an output of 500 tokens, estimate the cost. Input costs $3 per million tokens, output costs $15 per million tokens. Print the total formatted to 6 decimal places.",
      challenge_starter_code: `input_tokens = 1000
output_tokens = 500
# Input: $3 per 1,000,000 tokens. Output: $15 per 1,000,000 tokens.
# TODO: compute total cost and print it to 6 decimal places.
`,
      challenge_solution_code: `input_tokens = 1000
output_tokens = 500

input_cost = input_tokens / 1_000_000 * 3
output_cost = output_tokens / 1_000_000 * 15
total = input_cost + output_cost

print(f"total cost: \${total:.6f}")
`,
      challenge_test_cases: [
        { input: "input=1000, output=500", expected_output: "total cost: $0.010500", description: "1000 input ($0.003) + 500 output ($0.0075) = $0.0105." }
      ]
    },
    {
      id: "ai-01-l3",
      project_id: "ai-01",
      order: 3,
      title: "Training vs Inference",
      concept: "Training",
      xp_reward: 10,
      explanation: `There are two completely different phases in an AI's life, and people mix them up constantly. Getting them straight will save you a hundred confused conversations.

## Training: building the model (once, slow, expensive)

Training is when the model learns. You show it mountains of text and play a fill-in-the-blank game billions of times: hide the next token, let the model guess, then nudge its internal numbers (its **weights**) toward the right answer. Repeat at enormous scale.

This phase:

- Takes weeks to months on thousands of expensive GPUs.
- Costs millions of dollars for a frontier model.
- Happens once. The result is a frozen file of weights — the finished model.

Think of training like writing and printing a textbook. Slow, costly, done by a team you'll never meet. When it's done, the book exists.

## Inference: using the model (every time, fast, cheap-ish)

Inference is what happens when *you* send a prompt. The weights don't change. The model just runs your text through its frozen numbers and predicts tokens. This is the autocomplete loop from lesson 1.

This phase:

- Takes milliseconds to seconds.
- Happens every single time anyone uses the model.
- Does not teach the model anything. Your chat does not update its brain.

Inference is like reading the textbook. Fast, repeatable, and the book itself doesn't change because you read it.

## The consequence that trips everyone up

**The model does not learn from your conversation.** Tell it your name, close the tab, come back tomorrow — it has no idea who you are. Its knowledge is frozen at training time, which also gives it a **knowledge cutoff**: it doesn't know about events after the data it trained on.

When a chatbot "remembers" earlier in the same conversation, that's not learning. The app is just resending the previous messages as part of your prompt every time. Same frozen model, more input text.

So: training builds the brain, once. Inference uses the brain, constantly, without changing it.`,
      key_terms: [
        { term: "Training", definition: "The slow, expensive one-time process of adjusting a model's weights so it predicts text well." },
        { term: "Inference", definition: "Running the finished, frozen model on your prompt to generate output." },
        { term: "Weights", definition: "The internal numbers learned during training that define how the model predicts." },
        { term: "Knowledge cutoff", definition: "The point in time after which the model has no built-in knowledge, because its training data stops there." }
      ],
      callouts: [
        { type: "analogy", title: "Writing the book vs reading it", content: "Training writes and prints the textbook (slow, once, costly). Inference is reading it (fast, repeatable). Reading never changes what's printed on the pages.", position: "before" },
        { type: "warning", title: "Your chat doesn't teach it", content: "Nothing you type updates the model's weights. 'Memory' in a chat is just the app re-feeding old messages into each new request.", position: "after" }
      ],
      concept_diagram: {
        title: "Two phases, two purposes",
        steps: [
          { label: "Collect data", desc: "Gather huge amounts of text (training only)." },
          { label: "Train", desc: "Adjust weights via billions of fill-in-the-blank guesses." },
          { label: "Freeze weights", desc: "The finished model is saved and stops changing." },
          { label: "Infer", desc: "Run prompts through the frozen weights, again and again." }
        ]
      },
      inline_quizzes: [
        {
          question: "When you send a prompt and get an answer, which phase is running?",
          options: ["Training", "Inference", "Both at once"],
          correct_index: 1,
          explanation: "Using the model on your prompt is inference. The weights stay frozen."
        }
      ],
      quiz_questions: [
        {
          question: "Which statement about training is correct?",
          options: [
            "It happens every time you chat",
            "It is slow, expensive, and done before you ever use the model",
            "It is faster than inference",
            "It updates a little each time someone sends a message"
          ],
          correct_index: 1,
          explanation: "Training is the costly, one-time phase that produces the frozen weights you later run inference on."
        },
        {
          question: "Why doesn't a model remember you between separate conversations?",
          options: [
            "It deletes its memory on purpose for privacy",
            "Inference doesn't change the weights, so nothing is stored in the model",
            "It only remembers paying customers",
            "Memory is a premium feature on all models"
          ],
          correct_index: 1,
          explanation: "Inference leaves the weights untouched, so the model itself learns nothing from your chat."
        },
        {
          question: "What causes a model's 'knowledge cutoff'?",
          options: [
            "A timer that disables old answers",
            "Its training data only goes up to a certain date",
            "The context window resetting",
            "Tokens expiring after a year"
          ],
          correct_index: 1,
          explanation: "The model only knows what was in its training data, which ends at some date — the cutoff."
        }
      ],
      participation_activities: [
        {
          activity_title: "Training vs inference check",
          questions: [
            { question: "Sending a prompt to a model changes the model's weights.", type: "true_false", correct_answer: "false", explanation: "Inference does not modify weights; only training does." },
            { question: "The slow, expensive, one-time phase that builds the model is called ______.", type: "fill_in", correct_answer: "training", explanation: "Training produces the frozen weights used during inference." }
          ]
        }
      ],
      starter_code: `# Show that "inference" leaves the model unchanged, but "training" would change it.
weights = 0.5  # pretend this single number is the whole model

def infer(weights, prompt):
    # inference reads weights, returns output, never modifies weights
    return weights * len(prompt)

print("before:", weights)
result = infer(weights, "hi")
# TODO: print the result and the weights again to show they didn't change.
`,
      solution_code: `weights = 0.5  # pretend this single number is the whole model

def infer(weights, prompt):
    return weights * len(prompt)

print("before:", weights)
result = infer(weights, "hi")
print("result:", result)
print("after:", weights)
`,
      expected_output: `before: 0.5
result: 1.0
after: 0.5`,
      hints: [
        "infer() only reads weights; it returns a value and never reassigns the global.",
        "Print result to see the output of inference.",
        "Print weights again afterward — it should be identical to 'before'."
      ],
      challenge_title: "One training step",
      challenge_description: "Write a function train_step that nudges the weight toward a target. Start weight at 0.5, target 1.0, learning rate 0.1. Apply one step: new = weight + 0.1 * (target - weight). Print the old and new weight to show training DOES change it.",
      challenge_starter_code: `weight = 0.5
target = 1.0
lr = 0.1
# TODO: define train_step(weight, target, lr) and apply it once.
`,
      challenge_solution_code: `weight = 0.5
target = 1.0
lr = 0.1

def train_step(weight, target, lr):
    return weight + lr * (target - weight)

new_weight = train_step(weight, target, lr)
print("old weight:", weight)
print("new weight:", round(new_weight, 2))
`,
      challenge_test_cases: [
        { input: "weight=0.5, target=1.0, lr=0.1", expected_output: "old weight: 0.5\nnew weight: 0.55", description: "0.5 + 0.1*(1.0-0.5) = 0.55, showing training moves the weight." }
      ]
    },
    {
      id: "ai-01-l4",
      project_id: "ai-01",
      order: 4,
      title: "Why LLMs Make Things Up",
      concept: "Hallucination",
      xp_reward: 10,
      explanation: `Ask a model for a court case to support your argument and it might hand you a perfectly formatted citation — case name, court, year — that does not exist. A real lawyer did this and got sanctioned. The model wasn't lying. It was doing its only job: predicting plausible text.

## Why it happens

Remember lesson 1: the model predicts what text usually comes next. It optimizes for **plausible**, not **true**. Most of the time plausible and true overlap, which is why it's so useful. But when they split — when the most natural-sounding continuation isn't factually correct — the model will happily produce the natural-sounding one.

This is called **hallucination**: confident output that's wrong or invented.

Three big reasons it shows up:

- **No fact-checker inside.** There's no separate truth-verifier built into the model. It generates; it doesn't look things up (unless an app gives it a tool to).
- **Gaps in training.** If the model saw little or conflicting info on a topic, it fills the gap with whatever sounds right. Obscure people, recent events, niche APIs — common hallucination zones.
- **Pressure to answer.** The model is built to continue text. "I don't know" is a less common continuation after a confident question, so it often guesses instead of refusing.

## How to protect yourself

You don't need to fear the tool. You need to use it like a fast, fluent intern who's sometimes wrong:

- **Verify anything that matters.** Names, numbers, citations, legal/medical/financial claims — check them against a real source.
- **Give it the facts.** Paste the document and ask questions about *that*, instead of relying on its memory. This is the core idea behind retrieval (a later module).
- **Watch for over-specific confidence.** Exact page numbers, precise dates, and tidy citations on obscure topics are classic hallucination tells.
- **Ask it to flag uncertainty.** Prompts like "say 'I'm not sure' if you don't know" reduce, but don't eliminate, made-up answers.

The fix isn't to make the model stop predicting — that's all it can do. The fix is to put truth-checking where it belongs: around the model, in how you use it.`,
      key_terms: [
        { term: "Hallucination", definition: "When a model produces confident output that is wrong or entirely made up." },
        { term: "Plausible vs true", definition: "Models optimize for text that sounds right, which usually but not always matches reality." },
        { term: "Grounding", definition: "Giving the model real source material to answer from, instead of relying on its memory." }
      ],
      callouts: [
        { type: "analogy", title: "A confident intern", content: "Treat the model like a fast, well-read intern who never says 'I don't know.' Brilliant draft generator, terrible final authority. You verify the important parts.", position: "before" },
        { type: "warning", title: "Tidy citations are a red flag", content: "Exact dates, page numbers, and clean-looking references on obscure topics are where hallucinations love to hide. Check them before you trust them.", position: "after" }
      ],
      concept_diagram: {
        title: "How a hallucination slips out",
        steps: [
          { label: "You ask a question", desc: "Especially on an obscure or recent topic." },
          { label: "Thin training signal", desc: "The model has weak or missing info for it." },
          { label: "Predict plausible text", desc: "It generates what sounds right, not what's verified." },
          { label: "Confident wrong answer", desc: "Output looks authoritative but may be invented." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is a hallucination in LLM terms?",
          options: ["A typo in the output", "Confident output that is wrong or made up", "When the model refuses to answer"],
          correct_index: 1,
          explanation: "A hallucination is fabricated or incorrect content delivered confidently."
        }
      ],
      quiz_questions: [
        {
          question: "Why does an LLM produce made-up facts so confidently?",
          options: [
            "It is programmed to deceive users",
            "It optimizes for plausible-sounding text, not verified truth",
            "Its weights are corrupted",
            "It ran out of tokens"
          ],
          correct_index: 1,
          explanation: "The model predicts likely continuations. Plausible and true usually overlap, but when they don't, it still picks the plausible one."
        },
        {
          question: "Which habit best reduces the risk of acting on a hallucination?",
          options: [
            "Trusting answers that sound confident",
            "Verifying anything that matters against a real source",
            "Asking the same question twice",
            "Using a longer prompt every time"
          ],
          correct_index: 1,
          explanation: "Independent verification of important claims is the reliable safeguard."
        },
        {
          question: "Which technique gives the model real material to answer from?",
          options: [
            "Lowering the token count",
            "Grounding: pasting the document and asking about it",
            "Turning off the context window",
            "Asking for shorter answers"
          ],
          correct_index: 1,
          explanation: "Grounding the model in provided source text reduces reliance on its fuzzy internal memory."
        }
      ],
      participation_activities: [
        {
          activity_title: "Hallucination defense",
          questions: [
            { question: "An LLM has a built-in fact-checker that verifies every claim before it answers.", type: "true_false", correct_answer: "false", explanation: "There is no internal truth-verifier; the model only predicts text." },
            { question: "Giving the model source material to answer from, instead of its memory, is called ______.", type: "fill_in", correct_answer: "grounding", explanation: "Grounding anchors answers in real provided text." }
          ]
        }
      ],
      starter_code: `# A confidence score does NOT mean correctness. Show why.
answers = [
    {"text": "Paris is the capital of France.", "confidence": 0.97, "true": True},
    {"text": "The capital of Australia is Sydney.", "confidence": 0.95, "true": False},
]

# TODO: print each answer with its confidence, and flag the false ones.
for a in answers:
    print(a["text"])
`,
      solution_code: `answers = [
    {"text": "Paris is the capital of France.", "confidence": 0.97, "true": True},
    {"text": "The capital of Australia is Sydney.", "confidence": 0.95, "true": False},
]

for a in answers:
    flag = "OK" if a["true"] else "HALLUCINATION"
    print(f"{a['text']} (confidence {a['confidence']}) -> {flag}")
`,
      expected_output: `Paris is the capital of France. (confidence 0.97) -> OK
The capital of Australia is Sydney. (confidence 0.95) -> HALLUCINATION`,
      hints: [
        "Loop over the answers list and read each dict's fields.",
        "Use the 'true' field to decide the label, not the confidence.",
        "An f-string makes it easy to print text, confidence, and the flag together."
      ],
      challenge_title: "Verify before trusting",
      challenge_description: "Write a function check_claim(claim, known_facts) that returns 'verified' if the claim is in the known_facts set, otherwise 'needs verification'. Test it on two claims and print the results.",
      challenge_starter_code: `known_facts = {"water boils at 100C at sea level", "the sun is a star"}

# TODO: define check_claim(claim, known_facts) and test it on two claims.
`,
      challenge_solution_code: `known_facts = {"water boils at 100C at sea level", "the sun is a star"}

def check_claim(claim, known_facts):
    return "verified" if claim in known_facts else "needs verification"

print(check_claim("the sun is a star", known_facts))
print(check_claim("the moon is made of cheese", known_facts))
`,
      challenge_test_cases: [
        { input: "claim in known_facts", expected_output: "verified", description: "A known claim returns 'verified'." },
        { input: "claim not in known_facts", expected_output: "needs verification", description: "An unknown claim returns 'needs verification'." }
      ]
    }
  ]
};
