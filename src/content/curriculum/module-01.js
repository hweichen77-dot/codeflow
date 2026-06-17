export default {
  project: {
    id: "ai-01",
    title: "How AI Actually Works",
    description: "Build a real mental model of how language models predict text, why they sometimes lie, and what tokens actually are.",
    difficulty: "beginner",
    category: "foundations",
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
      explanation: `Type "I'm running a little" into your phone and it suggests "late." That's the whole trick. A large language model is autocomplete that read most of the internet — and once that clicks, almost everything else about AI stops being magic.

## What it is

A **language model** is a program that does exactly one thing: given some text, it predicts the next chunk of text. That's it. There is no module for "reasoning," no separate "memory bank," no truth-checker. The entire system is a giant function that takes the text so far and outputs a probability for every chunk that could come next.

The key operation has a name: **next-token prediction**. The model scores thousands of candidate continuations, then picks one of the likely ones. Add it to the input. Predict again. This loop is the whole engine.

## How it works

Walk through one answer being built:

1. You send text. Your question becomes the starting input — the **context**.
2. The model predicts. It assigns a likelihood to every possible next chunk and selects from the top candidates.
3. It appends. The chosen chunk is glued onto the input.
4. It repeats — predict, append, predict, append — until it emits a special *stop* signal.

There is no hidden step where the model "decides what to say" and then writes it down. **Writing the next word is the deciding.** The sentence assembles itself one piece at a time, each piece conditioned on everything before it. Here is the loop in miniature:

\`\`\`python
prompt = "I am running a"
while not done:
    next_word = model.predict(prompt)  # score candidates, pick one
    prompt = prompt + " " + next_word  # append, then loop
\`\`\`

Because each step only ever looks at the text in front of it, the model is **stateless** between requests. Nothing is remembered unless it is fed back in.

## Why it matters

Once you see the model as a prediction machine, weird behavior stops being mysterious:

- It sounds confident even when wrong, because confident-sounding text is what usually follows a question online. It imitates the *style*, not the correctness.
- It can write a poem and debug Python with the same machinery — both are just "what text comes next?"
- It has no memory of you between conversations. Each request is a fresh prediction over whatever text you handed it. Chat apps fake memory by resending old messages.

This is also why one wrong word early can derail an entire answer: the model keeps predicting *consistent* continuations of its own mistake.

## The mental model to keep

Picture a ridiculously well-read person who must answer every question by blurting out one word at a time, with no ability to pause and check anything. Fast. Fluent. Often right. Sometimes wrong with a straight face. Don't think "robot brain." Think **the most powerful autocomplete ever built.**`,
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
      step_throughs: [
        {
          title: "one answer, built word by word",
          steps: [
            { label: "You send text", detail: "Your question becomes the starting context. Nothing has been predicted yet.", code: 'prompt = "The sky is"' },
            { label: "Predict the next chunk", detail: "The model scores every candidate continuation and picks a likely one. Here, 'blue' beats 'green', 'falling', and the rest.", code: '"The sky is"->  next = " blue"(most likely)' },
            { label: "Append and loop", detail: "The chosen chunk is glued on, and the whole thing is fed back in to predict again. The sentence grows one piece at a time.", code: 'prompt = "The sky is blue"->  next = " today"' },
            { label: "Emit stop", detail: "Eventually the model predicts a special stop signal instead of a word. The collected chunks are your finished answer.", code: '"The sky is blue today."->  <STOP>' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Given the prompt "Roses are red, violets are", what single word does autocomplete most likely add next?',
          steps: [
            'This phrase appears countless times in training text, almost always finishing the same way.',
            'The model scores candidates; "blue" dominates because that continuation is overwhelmingly common.',
            "It picks the highest-likelihood chunk and appends it."
          ],
          output: '" blue"'
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'You ask the same model the same question twice and get two different answers. How is that possible if it just predicts "the most likely" word?',
          steps: [
            "The model does not always take the single top candidate. It samples from the top few by their probabilities.",
            "A setting called temperature controls how random that sampling is: higher means more variety, lower means more predictable.",
            "So two runs can diverge at the first point where a slightly-less-likely chunk gets picked.",
            "After they diverge, each run keeps predicting consistent continuations of its own path, so the answers drift further apart."
          ],
          output: "Sampling randomness (temperature) means the next chunk isn't always the top one, so runs can differ."
        }
      ],
      comparison_tables: [
        {
          title: "prediction machine vs human brain",
          columns: ["Aspect", "LLM (prediction machine)", "Human brain"],
          rows: [
            { cells: ["Core operation", "Predict the next text chunk", "Understand, reason, recall"] },
            { cells: ["Memory across chats", "None unless text is re-fed", "Persistent and automatic"] },
            { cells: ["Fact-checking", "No built-in verifier", "Can pause and double-check"] },
            { cells: ["What it optimizes for", "Plausible continuation", "Goals, truth, intent"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what an LLM does vs doesn't do",
          bins: [
            { id: "does", label: "What it actually does" },
            { id: "doesnt", label: "What it does NOT do" }
          ],
          items: [
            { id: "i1", text: "Predicts the next chunk of text", bin: "does" },
            { id: "i2", text: "Looks up facts in a live database", bin: "doesnt" },
            { id: "i3", text: "Builds an answer one piece at a time", bin: "does" },
            { id: "i4", text: "Remembers you between separate chats", bin: "doesnt" },
            { id: "i5", text: "Uses the same machinery for poems and code", bin: "does" },
            { id: "i6", text: "Plans the full reply before writing it", bin: "doesnt" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if an LLM only predicts the next chunk of text, why does it still feel like it is 'answering' your question?",
          sampleAnswer: "Because the training text is full of questions followed by sensible answers, the most likely continuation of your question is an answer-shaped piece of text. The model isn't deciding to answer you; producing answer-like text is simply the most probable way to continue the conversation it was given."
        }
      ],
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
"hello world"    -> ["hello", " world"]            (2 tokens)
"antidisestablish" -> ["anti", "dis", "establish"]   (3 tokens)
"Zx9_q4ß!"       -> many tiny pieces           (lots of tokens)
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
      tools: [{ type: "tokenizer" }],
      step_throughs: [
        {
          title: "text → tokens → bill",
          steps: [
            { label: "You write a prompt", detail: "A plain string of characters — what you typed.", code: '"The model sees tokens."' },
            { label: "The tokenizer splits it", detail: "Each chunk is matched against the model's fixed vocabulary. Common words stay whole; rare ones shatter.", code: '["The", " model", " sees", " tokens", "."]  →  5 tokens' },
            { label: "Tokens become IDs", detail: "Every token maps to an integer. The model only ever does math on these numbers.", code: "[464, 2746, 7224, 16326, 13]" },
            { label: "You get billed + limited", detail: "Token count drives the API bill (in and out) and must fit inside the context window.", code: "5 tokens · $3 / 1M in  →  $0.000015" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'How many tokens is "hello world"?',
          steps: [
            "Both words are extremely common, so each stays a single token.",
            'The space before "world" rides along with it as part of that token.',
            'Count the chunks: ["hello"] + [" world"] = 2.'
          ],
          output: "2 tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You send a 1,000-token prompt and get a 600-token answer.\nInput: $3 / 1M tokens.  Output: $15 / 1M tokens.\nWhat does the call cost?",
          steps: [
            "Input cost = 1000 / 1,000,000 × $3 = $0.003.",
            "Output cost = 600 / 1,000,000 × $15 = $0.009.",
            "Output tokens cost 5× more — answers, not prompts, usually dominate the bill.",
            "Total = $0.003 + $0.009 = $0.012."
          ],
          output: "$0.012000 per call"
        }
      ],
      comparison_tables: [
        {
          title: "three ways to split text",
          columns: ["Granularity", "Vocab size", "Tokens for 'unbelievable'", "Trade-off"],
          rows: [
            { cells: ["Character", "~100", "12 (one per letter)", "Tiny vocab, but sequences get very long"] },
            { cells: ["Word", "millions", "1 — if seen, else unknown", "Short sequences, but chokes on rare/new words"] },
            { cells: ["Subword (BPE)", "~50–100k", "3 (un · believ · able)", "The sweet spot every modern LLM uses"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "few tokens vs many tokens",
          bins: [
            { id: "few", label: "Few tokens (cheap)" },
            { id: "many", label: "Many tokens (expensive)" }
          ],
          items: [
            { id: "i1", text: '"the cat sat"', bin: "few" },
            { id: "i2", text: '"pneumonoultramicroscopic"', bin: "many" },
            { id: "i3", text: '"hello there"', bin: "few" },
            { id: "i4", text: '"xq9f3!! Zq"', bin: "many" },
            { id: "i5", text: '"good morning"', bin: "few" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In one or two sentences: why does rare or messy text cost more tokens than plain English?",
          sampleAnswer: "The tokenizer only has whole-chunk symbols for text it saw often. Rare or messy text isn't in that set, so it gets rebuilt from many tiny pieces — and more pieces means more tokens, which means more cost."
        }
      ],
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
      explanation: `A frontier model can cost over one hundred million dollars to build — and then answer your question for a fraction of a cent. That gap isn't a contradiction. It's the difference between the two phases of an AI's life: **training** and **inference**. People mix these up constantly, and getting them straight will save you a hundred confused conversations.

## What it is

Every model lives in two phases. **Training** is building the model: a slow, brutally expensive, one-time process that produces the finished thing. **Inference** is using the model: running your prompt through the finished thing to get an answer. Training happens once, by a team you'll never meet. Inference happens billions of times, every time anyone hits "send."

## How it works

**Training** plays a fill-in-the-blank game at impossible scale. Show the model mountains of text, hide the next token, let it guess, then nudge its internal numbers — its **weights** — slightly toward the right answer. Repeat billions of times. One nudge looks like this:

\`\`\`python
# one training step: move the weight toward the target
weight = weight + learning_rate * (target - weight)
# 0.50  ->  0.55  ->  0.59  ...  the model is changing
\`\`\`

This phase takes weeks to months on thousands of GPUs and costs millions. When it ends, the weights **freeze** into a finished file — the model.

**Inference** never touches those weights. When you send a prompt, the model runs your text through the frozen numbers and predicts tokens — the autocomplete loop from lesson 1. It takes milliseconds, happens on every request, and teaches the model nothing.

The textbook analogy nails it: training is *writing and printing* the book (slow, once, costly); inference is *reading* it (fast, repeatable). Reading never changes what's printed on the pages.

## Why it matters

The freeze has consequences that trip everyone up:

- **The model does not learn from your conversation.** Tell it your name, close the tab, come back tomorrow — it has no idea who you are. Inference leaves the weights untouched, so nothing is stored.
- **Knowledge cutoff.** Its knowledge is frozen at training time. It cannot know about events after the data it trained on, no matter how confidently it talks about them.
- **In-chat "memory" is an illusion.** When a chatbot remembers something you said five messages ago, the app is simply resending those earlier messages as part of each new prompt. Same frozen model, more input text — not learning.

This also explains the cost shape of AI products: a giant up-front bill to train once, then a tiny per-request bill to serve answers forever.

## The mental model to keep

**Training builds the brain, once. Inference uses the brain, constantly, without changing it.**`,
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
      step_throughs: [
        {
          title: "from raw text to a model you can use",
          steps: [
            { label: "Collect data", detail: "Gather enormous amounts of text — books, code, web pages. This happens only during training; inference uses none of it.", code: "corpus = trillions of tokens of text" },
            { label: "Train: guess and nudge", detail: "Hide the next token, let the model guess, then adjust its weights toward the right answer. Repeat billions of times.", code: "weight += lr * (target - guess)  # weights change" },
            { label: "Freeze the weights", detail: "When training ends, the weights are saved into a fixed file. The model stops changing forever.", code: "model.save('weights.bin')  # now read-only" },
            { label: "Infer, again and again", detail: "Every user request runs the frozen weights to predict tokens. No weight is ever updated here.", code: "answer = model(prompt)  # weights unchanged" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You tell ChatGPT your dog's name. The next day, in a brand-new chat, it doesn't remember it. Which phase explains this?",
          steps: [
            "Telling it something happens during inference — you sent a prompt and got a reply.",
            "Inference runs the frozen weights and never updates them, so nothing you said was stored in the model.",
            "A brand-new chat starts with no prior messages, and the model has no memory of its own."
          ],
          output: "Inference doesn't change weights, so the model never learned your dog's name."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A model trained on data up to early 2024 is asked who won an election held in late 2025. It answers confidently but wrongly. Why?",
          steps: [
            "The model's knowledge is frozen at training time — its knowledge cutoff is early 2024.",
            "The 2025 election simply was not in its training data, so it has no real information about it.",
            "But the model still predicts plausible text, so it produces a confident-sounding guess instead of admitting the gap.",
            "Fix: give it the result in the prompt (grounding) rather than relying on its frozen memory."
          ],
          output: "The event is after the knowledge cutoff, so the frozen model can only guess."
        }
      ],
      comparison_tables: [
        {
          title: "training vs inference",
          columns: ["Dimension", "Training", "Inference"],
          rows: [
            { cells: ["When it happens", "Once, before release", "Every single request"] },
            { cells: ["Speed", "Weeks to months", "Milliseconds to seconds"] },
            { cells: ["Cost", "Millions of dollars", "Fractions of a cent"] },
            { cells: ["Effect on weights", "Changes them", "Leaves them frozen"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "sort each fact into the right phase",
          bins: [
            { id: "train", label: "Training" },
            { id: "infer", label: "Inference" }
          ],
          items: [
            { id: "i1", text: "Adjusts the model's weights", bin: "train" },
            { id: "i2", text: "Runs every time you send a prompt", bin: "infer" },
            { id: "i3", text: "Costs millions and happens once", bin: "train" },
            { id: "i4", text: "Leaves the weights completely frozen", bin: "infer" },
            { id: "i5", text: "Plays fill-in-the-blank on huge text", bin: "train" },
            { id: "i6", text: "Takes milliseconds and is cheap", bin: "infer" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: when a chatbot seems to 'remember' what you said earlier in the same conversation, what is actually happening?",
          sampleAnswer: "The model itself isn't remembering anything — its weights are frozen. The app stores the earlier messages and resends them as part of each new prompt, so the conversation history is fed back in as fresh input every time. It looks like memory, but it's just re-supplied context running through the same unchanged model."
        }
      ],
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
      explanation: `In 2023 a New York lawyer asked a model for cases to support his argument. It handed him six perfectly formatted citations — case names, courts, years, judges. All six were invented. He filed them, got caught, and was sanctioned by the court. The model wasn't lying. It was doing its only job: predicting plausible text.

## What it is

**Hallucination** is when a model produces confident output that is wrong or entirely made up. Not a typo, not a refusal — a fluent, authoritative-sounding answer that happens to be false. The unsettling part is *how convincing* it looks. The fake citations were formatted exactly like real ones, because the model learned what real citations look like.

The root cause is a single fact from lesson 1: the model optimizes for **plausible**, not **true**. Most of the time those overlap, which is why the tool is useful. But when they split — when the most natural-sounding continuation isn't factually correct — the model produces the natural-sounding one anyway.

## How it works

Three forces push a model toward making things up:

- **No fact-checker inside.** There is no separate truth-verifier in the model. It generates text; it does not look anything up unless an app explicitly gives it a tool to.
- **Gaps in training.** If the model saw little or conflicting information on a topic, it fills the gap with whatever sounds right. Obscure people, very recent events, and niche APIs are classic hallucination zones.
- **Pressure to answer.** The model is built to *continue* text. After a confident-sounding question, "I don't know" is a rarer continuation in its training data than a confident answer — so it tends to guess rather than refuse.

You can picture the failure path: obscure question -> thin training signal -> predict plausible text -> confident wrong answer.

## Why it matters

You don't need to fear the tool. You need to use it like a fast, fluent intern who is sometimes wrong:

- **Verify anything that matters.** Names, numbers, citations, legal, medical, and financial claims — check them against a real source.
- **Give it the facts (grounding).** Paste the document and ask about *that*, instead of relying on the model's fuzzy memory. This is the core idea behind retrieval, covered in a later module.
- **Watch for over-specific confidence.** Exact page numbers, precise dates, and tidy citations on obscure topics are classic hallucination tells.
- **Ask it to flag uncertainty.** A prompt like the one below reduces, but does not eliminate, fabrication:

\`\`\`text
Answer only from the text I pasted. If the answer isn't there,
reply exactly: "Not stated in the source."
\`\`\`

## The mental model to keep

The fix isn't to make the model stop predicting — that's all it can do. **Put the truth-checking around the model, in how you use it,** not inside the model, where it doesn't exist.`,
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
      step_throughs: [
        {
          title: "how a confident lie slips out",
          steps: [
            { label: "You ask an obscure question", detail: "The topic is niche, recent, or barely covered in training text.", code: 'prompt = "Cite a 2019 case on drone privacy law."' },
            { label: "Thin training signal", detail: "The model has weak or missing real information for this exact request. There's a gap.", code: "relevant_examples_seen = almost none" },
            { label: "Predict plausible text anyway", detail: "It can't say 'no data here'; it continues with what citations usually look like, inventing the specifics.", code: '"Smith v. Aerial Corp., 412 F.3d 88 (9th Cir. 2019)"' },
            { label: "Confident wrong answer", detail: "The output is perfectly formatted and authoritative — and entirely fabricated. Looks real, isn't.", code: "case_exists = False  # hallucination" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A model gives an answer with 0.95 confidence and it turns out to be false. Was the high confidence a useful signal that it was correct?",
          steps: [
            "Confidence reflects how likely the text was as a continuation, not whether it matches reality.",
            "Plausible-sounding falsehoods can score just as high as true statements.",
            "So a high confidence number tells you nothing reliable about correctness."
          ],
          output: "No — confidence measures plausibility, not truth."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You need a model to summarize a contract without inventing clauses that aren't there. What's the most reliable way to set this up?",
          steps: [
            "Relying on the model's memory invites it to fill gaps with plausible-but-fake clauses.",
            "Instead, paste the actual contract text into the prompt — this is grounding.",
            'Constrain it: instruct it to answer only from the pasted text and to say "Not stated in the source" when something is missing.',
            "Then verify any high-stakes clause against the original document yourself."
          ],
          output: "Ground it in the pasted contract, constrain answers to that text, then verify the important parts."
        }
      ],
      comparison_tables: [
        {
          title: "trustworthy answer vs hallucination risk",
          columns: ["Situation", "Lower risk", "Higher risk"],
          rows: [
            { cells: ["Topic", "Common, well-documented", "Obscure, recent, or niche"] },
            { cells: ["Source of facts", "Grounded in pasted text", "From the model's memory"] },
            { cells: ["Specificity", "General, hedged claims", "Exact dates, page numbers, citations"] },
            { cells: ["Your habit", "Verify what matters", "Trust because it sounds confident"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "raises risk vs reduces risk of acting on a hallucination",
          bins: [
            { id: "reduce", label: "Reduces risk" },
            { id: "raise", label: "Raises risk" }
          ],
          items: [
            { id: "i1", text: "Pasting the source document and asking about it", bin: "reduce" },
            { id: "i2", text: "Trusting an answer because it sounds confident", bin: "raise" },
            { id: "i3", text: "Verifying citations against a real source", bin: "reduce" },
            { id: "i4", text: "Asking about an obscure topic from memory", bin: "raise" },
            { id: "i5", text: 'Telling it to say "I am not sure" when unsure', bin: "reduce" },
            { id: "i6", text: "Accepting exact dates on a niche subject", bin: "raise" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can't you fix hallucinations just by telling the model 'only say true things'?",
          sampleAnswer: "The model has no internal way to check truth — it only predicts plausible continuations, and an instruction to be truthful is just more text that nudges its style, not a verifier it can consult. Real reliability comes from grounding it in source material and checking important claims yourself, putting the truth-checking around the model rather than inside it."
        }
      ],
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
