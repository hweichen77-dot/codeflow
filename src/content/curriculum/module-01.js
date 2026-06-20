export default {
  project: {
    id: "ai-01",
    title: "How AI Actually Works",
    description: "Build a real mental model of how language models predict text, why they sometimes lie, and what tokens actually are.",
    difficulty: "beginner",
    category: "foundations",
    estimated_time: 45,
    lessons_count: 8,
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
      challenge_title: "Greedy Decoder",
      challenge_description: "Implement the autocomplete loop a real model runs: from a learned probability table, greedily pick the next token, append it, and repeat until you hit a stop signal or a length cap.",
      challenge_story: "You're building the text-generation core of a tiny language model. Training already produced a **next-token table**: for every context token, it lists the candidate tokens that could follow and an integer score (how likely each is). Now you need the **decoder** — the loop that actually writes text. Your product team chose **greedy decoding**: at each step, emit the single highest-scoring token, glue it on, and feed it back in. Generation stops when the model emits the special \`<END>\` token or when the output reaches its length budget.",
      challenge_statement: "You are given a next-token table and a starting token. Generate text using **greedy decoding**:\n\n1. Begin with the start token already emitted.\n2. Repeatedly look up the **current** (most recently emitted) token in the table. Among its candidate continuations, choose the one with the **highest score**. If two candidates tie on score, choose the one that is **lexicographically smallest**.\n3. If the chosen token is \`<END>\`, stop (do **not** emit \`<END>\`). If the current token has no entry in the table, stop. Otherwise emit the chosen token and continue.\n4. Stop once the generated sequence reaches \`max_len\` tokens total (including the start token).\n\nPrint the generated sequence, space-separated.",
      challenge_input_format: "The first line has two integers `n max_len`: the number of table rows and the maximum sequence length.\n\nEach of the next `n` lines describes one context: a context token followed by one or more `token score` pairs, all space-separated (e.g. `the cat 7 dog 7`).\n\nThe final line is the single start token.",
      challenge_output_format: "One line: the generated tokens separated by single spaces.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ max_len ≤ 1000",
        "1 ≤ score ≤ 1000000",
        "Tokens contain no spaces; the stop token is the literal `<END>`.",
      ],
      challenge_examples: [
        { input: "3 5\nthe cat 7 dog 7\ncat sat 9\ndog ran 4\nthe", output: "the cat sat", explanation: "From `the`, `cat` and `dog` tie at 7, so pick lexicographically smaller `cat`. From `cat`, pick `sat`. `sat` has no row, so stop." },
        { input: "2 6\nhello there 5 world 9\nworld <END> 3 again 2\nhello", output: "hello world", explanation: "From `hello`, `world` (9) beats `there` (5). From `world`, `<END>` (3) beats `again` (2), so generation stops without emitting `<END>`." },
      ],
      challenge_notes: "Greedy decoding is deterministic: same table, same output every time. Real models often *sample* instead, which is why you can get different answers to the same prompt. The lexicographic tie-break keeps this exercise's output unambiguous.",
      challenge_hints: [
        "Parse each table row by reading the first field as the context, then walking the rest two-at-a-time as (token, score) pairs.",
        "To pick the best candidate, track the best score seen and, on a tie, keep the lexicographically smaller token.",
        "Stop the loop on three conditions: chosen token is `<END>`, the current token isn't in the table, or you've reached `max_len` tokens.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_len = map(int, data[idx].split())
    idx += 1
    table = {}
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        context = parts[0]
        candidates = []
        i = 1
        while i < len(parts):
            candidates.append((parts[i], int(parts[i + 1])))
            i += 2
        table[context] = candidates
    start = data[idx].strip()

    # 'table' maps each context token -> list of (candidate_token, score).
    # 'start' is the starting token; 'max_len' caps the total sequence length.
    # TODO: greedily generate from 'start' — at each step pick the highest-score
    #       candidate (ties: lexicographically smallest), stop on <END>, a dead
    #       end, or max_len, then print the sequence space-separated.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_len = map(int, data[idx].split())
    idx += 1
    table = {}
    for _ in range(n):
        parts = data[idx].split()
        idx += 1
        context = parts[0]
        candidates = []
        i = 1
        while i < len(parts):
            candidates.append((parts[i], int(parts[i + 1])))
            i += 2
        table[context] = candidates
    start = data[idx].strip()

    output = [start]
    current = start
    for _ in range(max_len - 1):
        if current not in table:
            break
        best_token = None
        best_prob = -1
        for token, prob in table[current]:
            if prob > best_prob or (prob == best_prob and token < best_token):
                best_prob = prob
                best_token = token
        if best_token == "<END>":
            break
        output.append(best_token)
        current = best_token
    print(" ".join(output))

main()
`,
      challenge_test_cases: [
        { input: "3 5\nthe cat 7 dog 7\ncat sat 9\ndog ran 4\nthe", expected_output: "the cat sat", description: "Score tie resolved lexicographically, then a dead-end stop." },
        { input: "2 6\nhello there 5 world 9\nworld <END> 3 again 2\nhello", expected_output: "hello world", description: "Generation halts on the <END> token without emitting it." },
        { input: "1 2\na b 1 c 9\na", expected_output: "a c", description: "max_len caps the sequence at 2 tokens even though more could follow." },
        { input: "1 5\nx y 1\nz", expected_output: "z", description: "The start token has no table entry, so output is just the start." }
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
      challenge_title: "The Token Meter",
      challenge_description: "Read a request's input and output token counts and print exactly what it costs to bill.",
      challenge_story: "Your team just shipped an AI feature, and finance wants a per-request cost meter before the first invoice lands. Input tokens (your prompt) and output tokens (the model's reply) are billed at **different rates**, and output is the expensive one. Build the meter that turns a token count into dollars.",
      challenge_statement: "Given the number of **input** tokens and **output** tokens used by one API call, compute the total cost.\n\n- Input tokens cost **$3.00 per 1,000,000 tokens**.\n- Output tokens cost **$15.00 per 1,000,000 tokens**.\n\nPrint the total cost as a dollar amount rounded to exactly **6 decimal places**, prefixed with a `$`.",
      challenge_input_format: "A single line with two space-separated integers: `input_tokens output_tokens`.",
      challenge_output_format: "One line: `$` followed by the total cost formatted to exactly 6 decimal places (e.g. `$0.010500`).",
      challenge_constraints: [
        "0 ≤ input_tokens ≤ 100000000",
        "0 ≤ output_tokens ≤ 100000000",
      ],
      challenge_examples: [
        { input: "1000 500", output: "$0.010500", explanation: "Input: 1000/1e6 × $3 = $0.003. Output: 500/1e6 × $15 = $0.0075. Total = $0.0105." },
        { input: "1000000 1000000", output: "$18.000000", explanation: "1M input = $3, 1M output = $15, total $18." },
      ],
      challenge_notes: "Output tokens cost 5× more than input tokens — in real apps the reply, not the prompt, usually dominates the bill. Use an f-string like `f\"\${cost:.6f}\"` to format to 6 decimals.",
      challenge_hints: [
        "Read the line and split it into two integers with `map(int, input().split())`.",
        "cost = input/1_000_000*3 + output/1_000_000*15.",
        "Format with an f-string to 6 decimals and prefix a dollar sign.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `# Input: $3 per 1,000,000 tokens.  Output: $15 per 1,000,000 tokens.
input_tokens, output_tokens = map(int, input().split())

# TODO: compute the total cost (input rate + output rate) and print it as
#       $X.XXXXXX with exactly 6 decimal places, e.g. f"\${cost:.6f}".
`,
      challenge_solution_code: `input_tokens, output_tokens = map(int, input().split())

input_cost = input_tokens / 1_000_000 * 3
output_cost = output_tokens / 1_000_000 * 15
total = input_cost + output_cost

print(f"\${total:.6f}")
`,
      challenge_test_cases: [
        { input: "1000 500", expected_output: "$0.010500", description: "1000 input ($0.003) + 500 output ($0.0075) = $0.0105." },
        { input: "1000000 1000000", expected_output: "$18.000000", description: "1M input + 1M output." },
        { input: "0 0", expected_output: "$0.000000", description: "A free call costs nothing." }
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
      challenge_title: "Gradient Descent Trainer",
      challenge_description: "Run the inner loop of training: repeatedly nudge a weight toward its target and report where it lands after a fixed number of steps. This is the exact update rule that turns raw weights into a finished model.",
      challenge_story: "You're on the team training a model, and you need to predict how a single weight will evolve before kicking off an expensive multi-week run. Each **training step** applies one nudge: it moves the weight a fraction of the way toward the target value it should learn. That fraction is the **learning rate**. Too small and training crawls; too large and it overshoots. Simulate the update for one weight so the team can sanity-check the learning rate before committing GPUs to it.",
      challenge_statement: "You are given a starting weight `w`, a `target` value, a `learning_rate`, and a number of training `steps`.\n\nApply this update exactly `steps` times:\n\n```\nw = w + learning_rate * (target - w)\n```\n\nAfter all steps, print the final weight rounded to exactly **4 decimal places**.",
      challenge_input_format: "A single line with four space-separated values: `w target learning_rate steps`. The first three are floating-point numbers; `steps` is a non-negative integer.",
      challenge_output_format: "One line: the final weight formatted to exactly 4 decimal places (e.g. `0.5500`).",
      challenge_constraints: [
        "-1000.0 ≤ w, target ≤ 1000.0",
        "0.0 ≤ learning_rate ≤ 1.0",
        "0 ≤ steps ≤ 100000",
      ],
      challenge_examples: [
        { input: "0.5 1.0 0.1 1", output: "0.5500", explanation: "One step: 0.5 + 0.1 × (1.0 − 0.5) = 0.55." },
        { input: "0.0 1.0 0.5 3", output: "0.8750", explanation: "Step 1: 0.5. Step 2: 0.75. Step 3: 0.875 — each step closes half the remaining gap." },
      ],
      challenge_notes: "With `steps = 0`, no update happens and the weight stays at its starting value — that's inference, not training. Watch the gap `(target - w)` shrink each step: this is why training shows diminishing returns and never quite reaches the target exactly. Format with an f-string like `f\"{w:.4f}\"`.",
      challenge_hints: [
        "Read the line and unpack it; remember `steps` is an int while the other three are floats.",
        "Loop `steps` times, reassigning `w` with the update rule each iteration.",
        "Format the final value with `f\"{w:.4f}\"` so it always shows four decimals.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    w = float(data[0])
    target = float(data[1])
    learning_rate = float(data[2])
    steps = int(data[3])
    # TODO: apply the update rule w = w + learning_rate * (target - w) exactly
    #       'steps' times, then print w formatted to 4 decimals, e.g. f"{w:.4f}".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split()
    w = float(data[0])
    target = float(data[1])
    learning_rate = float(data[2])
    steps = int(data[3])
    for _ in range(steps):
        w = w + learning_rate * (target - w)
    print(f"{w:.4f}")

main()
`,
      challenge_test_cases: [
        { input: "0.5 1.0 0.1 1", expected_output: "0.5500", description: "A single update step moves the weight from 0.5 to 0.55." },
        { input: "0.0 1.0 0.5 3", expected_output: "0.8750", description: "Three steps, each closing half the remaining gap to the target." },
        { input: "0.5 1.0 0.1 0", expected_output: "0.5000", description: "Zero steps leaves the weight unchanged — inference, not training." },
        { input: "0.2 0.9 0.1 100", expected_output: "0.9000", description: "Over many steps the weight converges to the target." }
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
      challenge_title: "Hallucination Gate",
      challenge_description: "Build the safety filter that sits between a model and your users: decide whether each claim can be trusted, must be human-verified, or should be rejected outright — based on grounding first, confidence second.",
      challenge_story: "Your AI assistant drafts answers, but you've learned the hard way that a high **confidence** score means *plausible*, not *true*. To stop a fabricated answer from reaching a user, you add a **gate**. The rule your team agreed on: if a claim is backed by a **grounded fact** (something you pasted in as a real source), trust it. Otherwise it's coming from the model's fuzzy memory — so if its confidence clears a review threshold, route it to a human to **verify**; if it's below the threshold, **reject** it. Implement the gate and report how many claims were auto-trusted.",
      challenge_statement: "You are given a confidence `threshold`, a set of **grounded facts**, and a list of **claims** (each with an integer confidence and the claim text). For each claim, decide its verdict in this exact priority order:\n\n1. If the claim text exactly matches a grounded fact, the verdict is `TRUST`.\n2. Otherwise, if its confidence is **greater than or equal to** the threshold, the verdict is `VERIFY`.\n3. Otherwise, the verdict is `REJECT`.\n\nPrint each claim and its verdict in input order, then print how many claims were auto-trusted.",
      challenge_input_format: "The first line is the integer `threshold`.\n\nThe second line is an integer `g`, the number of grounded facts. The next `g` lines each contain one grounded fact (full line, may contain spaces).\n\nThe next line is an integer `c`, the number of claims. Each of the next `c` lines starts with an integer confidence, a single space, then the claim text (which may contain spaces).",
      challenge_output_format: "For each claim, in input order, a line `<claim text> -> <VERDICT>`. After all claims, a final line `TRUSTED <count>` giving the number of claims that received the `TRUST` verdict.",
      challenge_constraints: [
        "0 ≤ threshold ≤ 100",
        "0 ≤ g ≤ 1000",
        "1 ≤ c ≤ 1000",
        "0 ≤ confidence ≤ 100",
        "A grounded match must be exact, character for character.",
      ],
      challenge_examples: [
        { input: "80\n2\nwater boils at 100C\nthe sun is a star\n3\n95 the sun is a star\n90 the moon is made of cheese\n40 dragons are real", output: "the sun is a star -> TRUST\nthe moon is made of cheese -> VERIFY\ndragons are real -> REJECT\nTRUSTED 1", explanation: "`the sun is a star` is grounded, so TRUST regardless of confidence. The cheese claim isn't grounded but 90 ≥ 80, so VERIFY. `dragons are real` at 40 < 80, so REJECT." },
        { input: "50\n0\n2\n60 alpha\n30 beta", output: "alpha -> VERIFY\nbeta -> REJECT\nTRUSTED 0", explanation: "With no grounded facts, the gate falls back to the confidence threshold: 60 ≥ 50 VERIFY, 30 < 50 REJECT." },
      ],
      challenge_notes: "Grounding beats confidence on purpose: a real source is a better signal than how sure the model sounds. The threshold is inclusive (`>=`), so a confidence exactly equal to the threshold routes to `VERIFY`, not `REJECT`. Split each claim line only on the **first** space so claim text containing spaces stays intact.",
      challenge_hints: [
        "Read the grounded facts into a `set` so membership checks are fast and exact.",
        "Split each claim line with `line.split(\" \", 1)` to separate the confidence from the (possibly multi-word) claim text.",
        "Check grounding first, then the `>=` threshold; count only the `TRUST` verdicts for the final line.",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    idx = 0
    threshold = int(lines[idx].strip())
    idx += 1
    g = int(lines[idx].strip())
    idx += 1
    grounded = set()
    for _ in range(g):
        grounded.add(lines[idx].strip())
        idx += 1
    c = int(lines[idx].strip())
    idx += 1
    claims = []  # list of (confidence:int, claim_text:str)
    for _ in range(c):
        conf_str, claim = lines[idx].split(" ", 1)
        claims.append((int(conf_str), claim))
        idx += 1

    # 'grounded' is the set of exact trusted facts; 'threshold' is the confidence cutoff.
    # TODO: for each (conf, claim) apply the gate in priority order:
    #       claim in grounded -> TRUST, elif conf >= threshold -> VERIFY, else REJECT.
    #       Print "<claim> -> <VERDICT>" per claim, then "TRUSTED <count>".

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    idx = 0
    threshold = int(lines[idx].strip())
    idx += 1
    g = int(lines[idx].strip())
    idx += 1
    grounded = set()
    for _ in range(g):
        grounded.add(lines[idx].strip())
        idx += 1
    c = int(lines[idx].strip())
    idx += 1
    trusted = 0
    for _ in range(c):
        line = lines[idx]
        idx += 1
        conf_str, claim = line.split(" ", 1)
        conf = int(conf_str)
        if claim in grounded:
            verdict = "TRUST"
            trusted += 1
        elif conf >= threshold:
            verdict = "VERIFY"
        else:
            verdict = "REJECT"
        print(f"{claim} -> {verdict}")
    print(f"TRUSTED {trusted}")

main()
`,
      challenge_test_cases: [
        { input: "80\n2\nwater boils at 100C\nthe sun is a star\n3\n95 the sun is a star\n90 the moon is made of cheese\n40 dragons are real", expected_output: "the sun is a star -> TRUST\nthe moon is made of cheese -> VERIFY\ndragons are real -> REJECT\nTRUSTED 1", description: "Grounding wins over confidence; threshold splits the rest." },
        { input: "50\n0\n2\n60 alpha\n30 beta", expected_output: "alpha -> VERIFY\nbeta -> REJECT\nTRUSTED 0", description: "No grounded facts: pure confidence gating." },
        { input: "70\n1\nknown fact\n2\n70 unknown claim\n69 another claim", expected_output: "unknown claim -> VERIFY\nanother claim -> REJECT\nTRUSTED 0", description: "Threshold is inclusive: exactly 70 routes to VERIFY, 69 to REJECT." }
      ]
    },
    {
      id: "ai-01-l5",
      project_id: "ai-01",
      order: 5,
      title: "Probability Distributions: The Next-Token Lottery",
      concept: "Probability",
      xp_reward: 10,
      explanation: `When the model "picks the next token," it does not pick. It rolls a weighted die. Before any word comes out, the model holds a full **probability distribution** over every token in its vocabulary at once — maybe 50,000 numbers, each saying "this is how likely I am to come next." The word you see is one draw from that lottery.

## What it is

A **probability distribution** is a list of likelihoods that covers every option and sums to exactly 1.0 (100%). For next-token prediction, there is one entry per vocabulary token. " blue" might get 0.62, " green" 0.10, " falling" 0.03, and tens of thousands of others split the rest. The model never outputs just one guess — it always produces the whole spread, and sampling reaches in to pull one out.

But the model does not compute these probabilities directly. It first produces raw, unbounded scores called **logits** — one per token, any real number, positive or negative. A function named **softmax** then squashes those logits into a clean probability distribution.

## How it works

Softmax does two jobs: it makes every number positive (by exponentiating), then it normalizes them to sum to 1. Bigger logit in, bigger probability out — but the gaps get exaggerated, so the top candidate often dominates.

\`\`\`python
import math

logits = {"blue": 8.0, "green": 6.0, "red": 2.0}
exps = {tok: math.exp(v) for tok, v in logits.items()}
total = sum(exps.values())
probs = {tok: e / total for tok, e in exps.items()}
# probs ~ {"blue": 0.88, "green": 0.12, "red": 0.002} -> sums to 1.0
\`\`\`

Then **sampling** draws one token according to those weights, ties back to the prediction loop from lesson 1: predict the distribution, sample a token, append it, repeat. **Temperature** (from lesson 1's worked example) is the dial that flattens or sharpens this distribution before the draw — high temperature evens out the odds and adds variety, low temperature spikes the top token and makes output predictable.

## Why it matters

- **Determinism is a choice.** Always take the single highest-probability token (greedy) and the model is repeatable. Sample, and the same prompt yields different answers — same distribution, different draw.
- **"Confidence" is just a probability.** A token at 0.97 is not *verified*; it is only the model's predicted likelihood. Lesson 4 already warned: plausible is not true.
- **The long tail is real.** Most probability piles onto a few tokens, but a tiny sliver is spread across thousands. Crank temperature up and you start drawing from that weird tail — which is how creative (and unhinged) outputs happen.

## The mental model to keep

The model does not choose a word. **It builds a full distribution over the whole vocabulary, then runs a weighted lottery.** Softmax sets the odds; sampling pulls the ticket.`,
      key_terms: [
        { term: "Probability distribution", definition: "A list of likelihoods over every possible next token that sums to 1.0." },
        { term: "Logits", definition: "Raw, unbounded scores the model produces per token before they become probabilities." },
        { term: "Softmax", definition: "The function that turns logits into a valid probability distribution that sums to 1." },
        { term: "Sampling", definition: "Drawing one token at random according to the distribution's weights." }
      ],
      callouts: [
        { type: "analogy", title: "A weighted raffle, not a choice", content: "Imagine a raffle where 'blue' holds 620 tickets, 'green' 100, and thousands of rare words share the rest. The model doesn't decide the winner — it draws a ticket. Softmax printed the tickets; sampling pulls one.", position: "before" },
        { type: "insight", title: "Logits are the unfair scores", content: "Logits can be any number, even negative. Softmax exponentiates them, so a logit lead of just 2 can turn into a near-total probability win. Big scores don't add up — they blow up.", position: "after" }
      ],
      concept_diagram: {
        title: "From scores to a sampled token",
        steps: [
          { label: "Compute logits", desc: "One raw score per vocabulary token, any real number." },
          { label: "Apply softmax", desc: "Exponentiate and normalize so the scores sum to 1.0." },
          { label: "Get a distribution", desc: "Every token now has a probability; the top few dominate." },
          { label: "Sample one token", desc: "Draw a token by its weight, append it, and predict again." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does softmax take in, and what does it produce?",
          options: ["Words in, words out", "Raw logits in, a probability distribution out", "Tokens in, token IDs out"],
          correct_index: 1,
          explanation: "Softmax converts unbounded logits into positive probabilities that sum to 1.0."
        }
      ],
      quiz_questions: [
        {
          question: "Why must the next-token probabilities sum to exactly 1.0?",
          options: [
            "It makes the numbers prettier to print",
            "They form a probability distribution: one token will be chosen, so the options must cover 100% of the possibilities",
            "Because the vocabulary always has 100 tokens",
            "To keep the logits positive"
          ],
          correct_index: 1,
          explanation: "A distribution assigns likelihoods across all outcomes; since exactly one token is drawn, those likelihoods must total 1."
        },
        {
          question: "How can the same prompt give different answers on different runs?",
          options: [
            "The weights change between runs",
            "Sampling draws a token from the distribution, so a less-likely token can win on some runs",
            "The vocabulary is reshuffled each time",
            "Softmax is random"
          ],
          correct_index: 1,
          explanation: "Greedy decoding is deterministic, but sampling draws by weight, so runs can diverge at any step where a non-top token is picked."
        },
        {
          question: "What does raising the temperature do to the distribution before sampling?",
          options: [
            "Sharpens it so the top token almost always wins",
            "Flattens it, evening out the odds and adding variety",
            "Deletes the rare tokens",
            "Converts probabilities back into logits"
          ],
          correct_index: 1,
          explanation: "Higher temperature flattens the distribution, giving lower-probability tokens a better shot — more creative, less predictable output."
        }
      ],
      participation_activities: [
        {
          activity_title: "Distribution sense-check",
          questions: [
            { question: "The model outputs a single best word, not a probability for every token.", type: "true_false", correct_answer: "false", explanation: "It always produces a full distribution over the whole vocabulary; one token is then sampled." },
            { question: "The function that turns raw logits into probabilities that sum to 1 is called ______.", type: "fill_in", correct_answer: "softmax", explanation: "Softmax exponentiates and normalizes the logits." }
          ]
        }
      ],
      starter_code: `# Turn raw logits into a probability distribution with softmax.
import math

logits = {"blue": 8.0, "green": 6.0, "red": 2.0}

# TODO: exponentiate each logit, sum them, then divide to get probabilities.
# Print each token with its probability rounded to 3 decimals.
print(logits)
`,
      solution_code: `import math

logits = {"blue": 8.0, "green": 6.0, "red": 2.0}

exps = {tok: math.exp(v) for tok, v in logits.items()}
total = sum(exps.values())
probs = {tok: e / total for tok, e in exps.items()}

for tok, p in probs.items():
    print(f"{tok}: {p:.3f}")
print(f"sum: {sum(probs.values()):.3f}")
`,
      expected_output: `blue: 0.879
green: 0.119
red: 0.002
sum: 1.000`,
      step_throughs: [
        {
          title: "one token, drawn from the whole vocabulary",
          steps: [
            { label: "Score every token", detail: "The model emits a logit for each vocabulary token. These are raw, unbounded, and can be negative.", code: "logits = {blue: 8.0, green: 6.0, red: 2.0}" },
            { label: "Exponentiate", detail: "Softmax raises e to each logit, forcing every value positive and stretching the gaps between them.", code: "exp(8)=2981, exp(6)=403, exp(2)=7.4" },
            { label: "Normalize to a distribution", detail: "Divide each by the total so everything sums to 1.0. Now they are real probabilities.", code: "blue=0.88, green=0.12, red=0.002  (sum 1.0)" },
            { label: "Sample one ticket", detail: "Draw a token by its weight. 'blue' usually wins, but on a high-temperature run 'green' can slip through.", code: "draw -> ' blue'  (append, then predict again)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Two tokens have probabilities 0.7 and 0.3. If the model uses greedy decoding (always take the top), which token comes out?",
          steps: [
            "Greedy decoding ignores randomness and picks the single highest-probability token.",
            "0.7 is greater than 0.3, so the first token wins.",
            "And it wins every single run, because greedy is deterministic."
          ],
          output: "The 0.7 token, every time."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A token has logit 4.0 and another has logit 2.0. Roughly what share of probability does the first get after softmax over just these two? (e^2 is about 7.39.)",
          steps: [
            "Softmax compares exponentials: e^4 vs e^2.",
            "e^4 = (e^2)^2 = 7.39^2 = about 54.6, and e^2 = about 7.39.",
            "Share of the first = 54.6 / (54.6 + 7.39) = 54.6 / 61.99.",
            "That is about 0.88 — a logit lead of 2 turns into an 88% probability share."
          ],
          output: "About 88% — softmax exaggerates the gap between logits."
        }
      ],
      comparison_tables: [
        {
          title: "logits vs probabilities",
          columns: ["Aspect", "Logits", "Probabilities (after softmax)"],
          rows: [
            { cells: ["Range", "Any real number, can be negative", "Between 0 and 1"] },
            { cells: ["Sum", "Whatever it happens to be", "Exactly 1.0"] },
            { cells: ["Produced by", "The model's final layer", "Softmax applied to logits"] },
            { cells: ["What you sample from", "No — not a distribution yet", "Yes — this is the lottery"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "logits vs probability distribution",
          bins: [
            { id: "logit", label: "True of logits" },
            { id: "prob", label: "True of the probability distribution" }
          ],
          items: [
            { id: "i1", text: "Can be any real number, even negative", bin: "logit" },
            { id: "i2", text: "Always sums to exactly 1.0", bin: "prob" },
            { id: "i3", text: "Raw scores before softmax", bin: "logit" },
            { id: "i4", text: "Every value sits between 0 and 1", bin: "prob" },
            { id: "i5", text: "What sampling draws a token from", bin: "prob" },
            { id: "i6", text: "Produced by the model's final layer", bin: "logit" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is it more accurate to say the model 'samples' a token than to say it 'knows' the next word?",
          sampleAnswer: "The model never settles on one answer — it produces a probability for every token at once, then a draw selects one according to those weights. Because the choice is a weighted random draw rather than a lookup of a known fact, the same prompt can yield different words, and a high probability only means likely, not correct."
        }
      ],
      hints: [
        "math.exp(x) gives e raised to x; apply it to each logit first.",
        "Sum all the exponentials, then divide each one by that sum.",
        "The probabilities should always add up to 1.0 — print the sum to check."
      ],
      challenge_title: "Softmax Sampler Odds",
      challenge_description: "Build the core of next-token selection: take raw logits, run softmax to get a distribution, and report the probability of the top candidates the way a sampler would weigh them.",
      challenge_story: "You're implementing the decoder's final stage. The model has just produced one **logit** per candidate token — raw scores, no bounds. Before sampling can pick a token, those logits must become a real **probability distribution**. Your team wants the top **k** candidates shown as percentages so they can eyeball how 'peaked' the model is. To keep the simulator deterministic and free of floating-point surprises, you'll use a simplified normalization: treat each logit as its own un-exponentiated weight and report each candidate's share of the total. Sort by weight (highest first), breaking ties alphabetically.",
      challenge_statement: "You are given `n` candidate tokens, each with an integer logit (weight), and an integer `k`.\n\n1. Sort the tokens by logit **descending**; break ties by token text **ascending** (lexicographic).\n2. Keep the top `k` tokens.\n3. Let `S` be the sum of the logits of those top `k` tokens. For each kept token, its probability is `logit / S * 100`.\n4. Print each kept token (in the sorted order) followed by its percentage, rounded to exactly **2 decimal places**.",
      challenge_input_format: "The first line has two integers `n k`. Each of the next `n` lines has a token (no spaces) and its integer logit, separated by a space.",
      challenge_output_format: "`k` lines, each `<token> <percentage>` where the percentage is formatted to exactly 2 decimal places.",
      challenge_constraints: [
        "1 ≤ k ≤ n ≤ 100000",
        "1 ≤ logit ≤ 1000000",
        "Tokens contain no spaces.",
      ],
      challenge_examples: [
        { input: "4 3\ncat 8\ndog 6\nfish 2\nbird 4", output: "cat 44.44\ndog 33.33\nbird 22.22", explanation: "Sorted by logit: cat 8, dog 6, bird 4, fish 2. Top 3 are cat, dog, bird; their sum is 18. cat = 8/18 = 44.44%, dog = 6/18 = 33.33%, bird = 4/18 = 22.22%." },
        { input: "2 2\nyes 3\nno 1", output: "yes 75.00\nno 25.00", explanation: "Sum is 4. yes = 3/4 = 75%, no = 1/4 = 25%." },
      ],
      challenge_notes: "Real softmax exponentiates each logit first, which makes the top token dominate far more sharply than this linear version. We skip the exponential here only to keep the arithmetic clean and deterministic — the idea (normalize so shares sum to 100%) is identical. The tie-break keeps output unambiguous when two tokens share a logit.",
      challenge_hints: [
        "Read all tokens into a list of (token, logit) tuples, then sort with key=lambda x: (-x[1], x[0]).",
        "Slice the first k after sorting, then sum their logits to get S.",
        "Format each share with an f-string like f\"{tok} {logit/S*100:.2f}\".",
      ],
      challenge_difficulty: "intermediate",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, k = map(int, data[idx].split())
    idx += 1
    tokens = []  # list of (token:str, logit:int)
    for _ in range(n):
        tok, logit = data[idx].split()
        tokens.append((tok, int(logit)))
        idx += 1

    # TODO: sort tokens by logit descending (ties: token text ascending), keep the
    #       top k, sum their logits as S, and print "<token> <pct>" where pct is
    #       logit / S * 100 to 2 decimals, e.g. f"{tok} {logit/S*100:.2f}".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, k = map(int, data[idx].split())
    idx += 1
    tokens = []
    for _ in range(n):
        tok, logit = data[idx].split()
        tokens.append((tok, int(logit)))
        idx += 1
    tokens.sort(key=lambda x: (-x[1], x[0]))
    top = tokens[:k]
    s = sum(t[1] for t in top)
    for tok, logit in top:
        pct = logit / s * 100
        print(f"{tok} {pct:.2f}")

main()
`,
      challenge_test_cases: [
        { input: "4 3\ncat 8\ndog 6\nfish 2\nbird 4", expected_output: "cat 44.44\ndog 33.33\nbird 22.22", description: "Top-3 selection then normalize the kept logits to percentages." },
        { input: "2 2\nyes 3\nno 1", expected_output: "yes 75.00\nno 25.00", description: "All tokens kept; simple two-way split." },
        { input: "3 1\na 5\nb 5\nc 1", expected_output: "a 100.00", description: "Tie on logit resolved alphabetically; the single kept token holds 100%." },
        { input: "3 3\nz 1\nm 1\na 1", expected_output: "a 33.33\nm 33.33\nz 33.33", description: "Equal logits split evenly; ties order alphabetically." }
      ]
    },
    {
      id: "ai-01-l6",
      project_id: "ai-01",
      order: 6,
      title: "Weights and Parameters",
      concept: "Weights",
      xp_reward: 10,
      explanation: `"GPT-3 has 175 billion parameters." You've seen numbers like this thrown around like horsepower stats. But what *is* a parameter? It is just a single number. The whole model — everything it knows about grammar, facts, code, and tone — is stored in billions of these plain numbers, and nothing else.

## What it is

A **parameter** (also called a **weight**) is one tunable number inside the model. Lesson 3 mentioned weights as the thing training adjusts; here we open the box. A model is a giant grid of these numbers organized into layers. When you run a prompt through, the model multiplies your token values by these weights, adds them up, and passes the result forward — over and over, through every layer — until logits pop out the other end.

There is no separate "knowledge database." The fact that Paris is the capital of France is not stored as a sentence anywhere. It is smeared across millions of weights as a pattern that makes "Paris" the likely continuation of "The capital of France is."

## How it works

Each weight starts as a random number. Training (lesson 3) nudges every weight, billions of times, until the whole grid predicts text well. A toy version of the multiply-and-sum that weights perform:

\`\`\`python
# a tiny "layer": each input is scaled by a weight, then summed
inputs  = [1.0, 2.0, 3.0]
weights = [0.5, -1.0, 0.25]

output = sum(x * w for x, w in zip(inputs, weights))
# 1.0*0.5 + 2.0*-1.0 + 3.0*0.25 = 0.5 - 2.0 + 0.75 = -0.75
\`\`\`

A real model does this with billions of weights across dozens of layers. **Parameter count** is simply how many of these numbers the model has. More parameters means more capacity to store patterns — but also more memory, more compute, and a bigger training bill.

## Why it matters

- **Size sets the floor on cost and speed.** A 7-billion-parameter model can run on a laptop; a 400-billion one needs a server rack. Parameter count drives memory, latency, and price.
- **More parameters usually means more capable — up to a point.** Bigger models tend to handle subtler patterns and rarer knowledge. But the gains shrink as you scale, which is the whole topic of the next lesson.
- **Parameters are frozen at inference.** Lesson 3 again: when you chat, the weights do not move. You are reading the printed grid, not editing it.
- **The number is marketing-adjacent.** A well-trained 13B model can beat a sloppy 70B one. Parameter count is a rough proxy for capability, not a guarantee.

## The mental model to keep

A model is **billions of dials**, each holding one number. Training spent millions of dollars setting every dial. **Inference just reads the dials** to turn your prompt into a prediction — the dials never move while you use it.`,
      key_terms: [
        { term: "Parameter", definition: "A single tunable number inside the model; billions of them together define its behavior." },
        { term: "Weight", definition: "Another name for a parameter — the value an input gets multiplied by inside a layer." },
        { term: "Parameter count", definition: "How many tunable numbers a model has, often quoted in billions." },
        { term: "Capacity", definition: "How much pattern and knowledge a model can store, tied loosely to its parameter count." }
      ],
      callouts: [
        { type: "analogy", title: "Billions of dials", content: "Picture a mixing board with billions of dials, each set to one number. Training is the months-long session that tuned every dial. Inference is just playing the board as-is — no dial moves while the music plays.", position: "before" },
        { type: "insight", title: "Knowledge has no address", content: "There is no row in the model that says 'Paris = capital of France.' That fact lives as a pattern spread across millions of weights. You can't point to where a fact is stored — only that the dials together make it likely.", position: "after" }
      ],
      concept_diagram: {
        title: "What a parameter does in one pass",
        steps: [
          { label: "Input arrives", desc: "Token values enter a layer as numbers." },
          { label: "Multiply by weights", desc: "Each input is scaled by its parameter." },
          { label: "Sum and pass on", desc: "The scaled values are added and sent forward." },
          { label: "Repeat through layers", desc: "Billions of weights later, logits come out." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is a single parameter in a language model?",
          options: ["A whole sentence of stored knowledge", "One tunable number", "A token in the vocabulary"],
          correct_index: 1,
          explanation: "A parameter is just one number; billions of them together make up the model."
        }
      ],
      quiz_questions: [
        {
          question: "Where is the fact 'Paris is the capital of France' stored in the model?",
          options: [
            "In a labeled fact database inside the model",
            "As a pattern spread across many weights, with no single address",
            "In the context window",
            "In a lookup table of cities"
          ],
          correct_index: 1,
          explanation: "Knowledge is distributed across millions of weights as patterns, not stored as discrete facts you can point to."
        },
        {
          question: "What does a higher parameter count tend to cost you?",
          options: [
            "Nothing — bigger is always free",
            "More memory, more compute, and more latency",
            "Fewer tokens of context",
            "A smaller vocabulary"
          ],
          correct_index: 1,
          explanation: "More parameters need more memory and compute to store and run, which raises cost and slows responses."
        },
        {
          question: "Why can a smaller, well-trained model sometimes beat a larger one?",
          options: [
            "Smaller models cheat",
            "Parameter count is only a rough proxy for capability; training quality and data matter too",
            "Larger models always have corrupted weights",
            "Smaller models have more parameters secretly"
          ],
          correct_index: 1,
          explanation: "Capability depends on data and training quality, not just raw size, so a sharp small model can outperform a sloppy big one."
        }
      ],
      participation_activities: [
        {
          activity_title: "Parameter check",
          questions: [
            { question: "A model's weights keep changing while you chat with it.", type: "true_false", correct_answer: "false", explanation: "Weights are frozen at inference; only training changes them." },
            { question: "Another word for a single tunable number inside the model is a ______.", type: "fill_in", correct_answer: "weight", explanation: "Parameter and weight mean the same thing." }
          ]
        }
      ],
      starter_code: `# A toy 'layer': scale each input by a weight, then sum the results.
inputs  = [1.0, 2.0, 3.0]
weights = [0.5, -1.0, 0.25]

# TODO: multiply each input by its weight and add them all up.
print(inputs)
`,
      solution_code: `inputs  = [1.0, 2.0, 3.0]
weights = [0.5, -1.0, 0.25]

output = sum(x * w for x, w in zip(inputs, weights))
print(f"output: {output}")
`,
      expected_output: `output: -0.75`,
      step_throughs: [
        {
          title: "from billions of numbers to a prediction",
          steps: [
            { label: "Weights start random", detail: "Before training, every parameter is a meaningless random number. The model predicts gibberish.", code: "weights = random grid of billions of numbers" },
            { label: "Training tunes every dial", detail: "Lesson 3's nudge runs billions of times, adjusting each weight so the grid predicts real text.", code: "weight += lr * (target - guess)  # x billions" },
            { label: "Freeze the grid", detail: "Training ends; the dials lock into a fixed file. Parameter count is just how many dials there are.", code: "175,000,000,000 frozen parameters" },
            { label: "Read the dials to predict", detail: "Your prompt flows through the frozen weights — multiply, sum, pass on — until logits come out.", code: "logits = prompt run through frozen weights" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A layer has inputs [2, 4] and weights [1.0, 0.5]. What single number does it pass forward?",
          steps: [
            "Multiply each input by its matching weight: 2 x 1.0 = 2.0 and 4 x 0.5 = 2.0.",
            "Sum the results: 2.0 + 2.0 = 4.0.",
            "That sum is what the layer passes on to the next layer."
          ],
          output: "4.0"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Model A has 7 billion parameters and runs on a laptop. Model B has 400 billion. Your task is simple grammar fixing on a phone. Which is the better pick and why?",
          steps: [
            "Parameter count sets the floor on memory, speed, and cost — 400B needs a server rack, not a phone.",
            "Grammar fixing is a common, well-covered task that does not need rare knowledge or deep reasoning.",
            "A 7B model has plenty of capacity for that, and runs cheaply and fast on-device.",
            "Bigger is not better when the smaller model already clears the task; you'd just pay more for no gain."
          ],
          output: "Model A — its capacity covers the task, at far lower cost and latency."
        }
      ],
      comparison_tables: [
        {
          title: "small model vs large model",
          columns: ["Dimension", "Small (e.g. 7B)", "Large (e.g. 400B)"],
          rows: [
            { cells: ["Memory needed", "Runs on a laptop", "Needs a server rack"] },
            { cells: ["Speed", "Fast responses", "Slower per token"] },
            { cells: ["Knowledge depth", "Good on common tasks", "Better on rare or subtle ones"] },
            { cells: ["Cost per request", "Cheap", "Expensive"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true of parameters vs not true",
          bins: [
            { id: "true", label: "True of parameters" },
            { id: "false", label: "Not true" }
          ],
          items: [
            { id: "i1", text: "Each one is a single tunable number", bin: "true" },
            { id: "i2", text: "They store facts as labeled sentences", bin: "false" },
            { id: "i3", text: "Training sets their values", bin: "true" },
            { id: "i4", text: "They change while you chat", bin: "false" },
            { id: "i5", text: "More of them raises memory and cost", bin: "true" },
            { id: "i6", text: "Knowledge is spread across many of them", bin: "true" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is parameter count only a rough guide to how good a model is?",
          sampleAnswer: "Parameter count measures capacity — how much a model could store — but not how well that capacity was used. A model trained on better data with a smarter process can pack more useful patterns into fewer weights, so a sharp 13B model can beat a carelessly trained 70B one. Size sets the ceiling, but training quality decides how close you get to it."
        }
      ],
      hints: [
        "zip(inputs, weights) pairs each input with its weight.",
        "Multiply each pair (x * w) and sum the products.",
        "A generator inside sum() does the multiply-and-add in one line."
      ],
      challenge_title: "Parameter Budget Report",
      challenge_description: "Add up a model's parameters layer by layer, report each layer's share of the total, and decide whether the whole thing fits in a hardware memory budget.",
      challenge_story: "You're sizing a model for deployment. Every **layer** holds some number of **parameters** (weights), and the full model is just the sum of them all. Before you commit hardware, the team needs a breakdown: how big is each layer relative to the whole, and does the total fit inside the device's parameter **budget**? Build the report so they can see at a glance where the weight lives and whether it will load.",
      challenge_statement: "You are given `n` layers, each with a name and an integer parameter count, followed by an integer `budget`.\n\n1. Compute the total parameter count across all layers.\n2. For each layer, in input order, print its name and its share of the total as a percentage rounded to exactly **1 decimal place**.\n3. Print a line `TOTAL <sum>` with the total parameter count.\n4. Print `FITS` if the total is **less than or equal to** the budget, otherwise `TOO BIG`.",
      challenge_input_format: "The first line is the integer `n`. Each of the next `n` lines has a layer name (no spaces) and its integer parameter count. The final line is the integer `budget`.",
      challenge_output_format: "`n` lines of `<name> <percentage>` (1 decimal place), then `TOTAL <sum>`, then `FITS` or `TOO BIG`.",
      challenge_constraints: [
        "1 ≤ n ≤ 10000",
        "1 ≤ parameter count per layer ≤ 1000000000",
        "1 ≤ budget ≤ 1000000000000",
        "Layer names contain no spaces.",
      ],
      challenge_examples: [
        { input: "3\nembedding 1000\nattention 5000\nmlp 4000\n12000", output: "embedding 10.0\nattention 50.0\nmlp 40.0\nTOTAL 10000\nFITS", explanation: "Total is 10000. embedding = 1000/10000 = 10.0%, attention = 50.0%, mlp = 40.0%. 10000 <= 12000, so FITS." },
        { input: "2\na 600\nb 600\n1000", output: "a 50.0\nb 50.0\nTOTAL 1200\nTOO BIG", explanation: "Total 1200 exceeds the 1000 budget, so TOO BIG, even though each layer is an even 50% share." },
      ],
      challenge_notes: "The budget check is inclusive: a model exactly equal to the budget still FITS. In real life, parameter count is only part of the memory story — each weight also takes 2 or 4 bytes, plus overhead for activations — but counting parameters is the first sizing step every team does.",
      challenge_hints: [
        "Read all layers into a list first so you can sum the total before computing shares.",
        "Each share is count/total*100; format with f\"{share:.1f}\".",
        "Compare total <= budget for the final FITS / TOO BIG line.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    layers = []  # list of (name:str, params:int)
    for _ in range(n):
        name, params = data[idx].split()
        layers.append((name, int(params)))
        idx += 1
    budget = int(data[idx].strip())

    # TODO: compute the total params, print "<name> <share>" (share = params/total*100
    #       to 1 decimal) per layer, then "TOTAL <sum>", then "FITS" if total <= budget
    #       else "TOO BIG".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    total = 0
    layers = []
    for _ in range(n):
        name, params = data[idx].split()
        params = int(params)
        layers.append((name, params))
        total += params
        idx += 1
    budget = int(data[idx].strip())
    for name, params in layers:
        pct = params / total * 100
        print(f"{name} {pct:.1f}")
    print(f"TOTAL {total}")
    print("FITS" if total <= budget else "TOO BIG")

main()
`,
      challenge_test_cases: [
        { input: "3\nembedding 1000\nattention 5000\nmlp 4000\n12000", expected_output: "embedding 10.0\nattention 50.0\nmlp 40.0\nTOTAL 10000\nFITS", description: "Per-layer shares, total, and an in-budget model." },
        { input: "2\na 600\nb 600\n1000", expected_output: "a 50.0\nb 50.0\nTOTAL 1200\nTOO BIG", description: "Total exceeds the budget." },
        { input: "1\nsolo 5000\n5000", expected_output: "solo 100.0\nTOTAL 5000\nFITS", description: "Single layer holds 100%; total exactly equals budget so it FITS." }
      ]
    },
    {
      id: "ai-01-l7",
      project_id: "ai-01",
      order: 7,
      title: "Attention in Plain English",
      concept: "Attention",
      xp_reward: 10,
      explanation: `Read this: "The trophy didn't fit in the suitcase because it was too big." What does "it" mean — the trophy or the suitcase? You knew instantly: the trophy. To predict the next word sensibly, a model has to make the same call — it has to *look back* at the right earlier words. The mechanism that lets it do that is called **attention**, and it is the single idea that made modern LLMs work.

## What it is

**Attention** is how the model decides, for each next-token prediction, which earlier tokens matter most. Not every previous word is equally relevant. When predicting the word after "it was too big," the model needs to weight "trophy" heavily and "suitcase" lightly. Attention assigns each earlier token a **relevance weight**, then blends them by those weights to inform the prediction.

Think of it as the model asking, at every step: *given what I'm trying to predict right now, which words in the context should I pay the most attention to?*

## How it works

For the token it is currently focused on, the model computes a relevance score against every earlier token. Those scores get turned into weights that sum to 1 (yes — softmax again, from lesson 5). Then the earlier tokens are mixed together in proportion to their weights. High-weight tokens dominate the blend; near-zero ones are effectively ignored.

\`\`\`python
# relevance scores for earlier tokens when predicting the next one
context = ["The", "cat", "sat"]
scores  = [1.0,   2.0,   7.0]   # "sat" matters most here

total = sum(scores)
weights = [s / total for s in scores]
# weights ~ [0.10, 0.20, 0.70] -> the model leans hardest on "sat"
\`\`\`

The model does this for every token, in parallel, across many separate **attention heads** — each head learns to track a different kind of relationship (one might follow subject-verb links, another might track quotation marks). Stack this through every layer and the model builds a rich sense of which words depend on which.

## Why it matters

- **It captures long-range meaning.** Attention can link "it" back to a noun many words earlier, which is why models handle pronouns, context, and structure so well.
- **It is the "T" in GPT.** GPT stands for Generative Pre-trained **Transformer**, and the Transformer is the architecture built around attention. No attention, no modern LLM.
- **It explains the context window.** Every token attends to every other, so doubling the context roughly quadruples the attention work — which is why long contexts are expensive (lesson 2's token cost, now you know the deeper reason).

## The mental model to keep

At every step the model asks **"which earlier words matter most for what comes next?"** and weights them accordingly. **Attention is selective focus** — not all context counts equally, and the model learns where to look.`,
      key_terms: [
        { term: "Attention", definition: "The mechanism that weights how relevant each earlier token is for predicting the next one." },
        { term: "Relevance weight", definition: "A number saying how much a given earlier token should influence the current prediction." },
        { term: "Attention head", definition: "One of many parallel attention computations, each learning a different kind of relationship." },
        { term: "Transformer", definition: "The neural network architecture built around attention; the 'T' in GPT." }
      ],
      callouts: [
        { type: "analogy", title: "Reading with a highlighter", content: "Imagine rereading a sentence and highlighting only the words that matter for the next one you'll write. Attention is that highlighter, applied automatically at every step — bright on the relevant words, faint on the rest.", position: "before" },
        { type: "insight", title: "Softmax shows up again", content: "Attention turns relevance scores into weights that sum to 1 using softmax — the same function from lesson 5. The model is constantly normalizing scores into distributions, whether over the vocabulary or over earlier tokens.", position: "after" }
      ],
      concept_diagram: {
        title: "How attention focuses each prediction",
        steps: [
          { label: "Score earlier tokens", desc: "Rate how relevant each past token is right now." },
          { label: "Normalize to weights", desc: "Softmax turns scores into weights summing to 1." },
          { label: "Blend by weight", desc: "Mix earlier tokens in proportion to their weights." },
          { label: "Inform the prediction", desc: "The focused blend shapes the next-token logits." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does attention let the model do?",
          options: ["Store facts permanently", "Weight which earlier tokens matter most for the next prediction", "Translate tokens into letters"],
          correct_index: 1,
          explanation: "Attention assigns relevance to earlier tokens so the model focuses on the words that matter."
        }
      ],
      quiz_questions: [
        {
          question: "When predicting the next word, how does attention treat the earlier tokens?",
          options: [
            "It weights every earlier token equally",
            "It gives each earlier token a relevance weight and blends them accordingly",
            "It ignores all but the most recent token",
            "It only looks at the first token"
          ],
          correct_index: 1,
          explanation: "Attention assigns each earlier token a weight based on relevance, then mixes them by those weights."
        },
        {
          question: "What is the 'T' in GPT?",
          options: [
            "Tokenizer",
            "Transformer, the architecture built around attention",
            "Training",
            "Temperature"
          ],
          correct_index: 1,
          explanation: "GPT means Generative Pre-trained Transformer, and the Transformer is the attention-based architecture."
        },
        {
          question: "Why do longer contexts get expensive so quickly?",
          options: [
            "The vocabulary grows with the context",
            "Every token attends to every other, so cost grows faster than the length itself",
            "Longer contexts use bigger tokens",
            "The model retrains on each request"
          ],
          correct_index: 1,
          explanation: "Attention compares every token against every other, so doubling the length roughly quadruples the work."
        }
      ],
      participation_activities: [
        {
          activity_title: "Attention check",
          questions: [
            { question: "Attention gives every earlier token the same importance when predicting the next one.", type: "true_false", correct_answer: "false", explanation: "It assigns different relevance weights; some tokens matter far more than others." },
            { question: "The architecture built around attention, the 'T' in GPT, is the ______.", type: "fill_in", correct_answer: "transformer", explanation: "GPT stands for Generative Pre-trained Transformer." }
          ]
        }
      ],
      starter_code: `# Turn attention scores into weights and find the most-attended token.
context = ["The", "cat", "sat"]
scores  = [1.0, 2.0, 7.0]

# TODO: normalize the scores into weights that sum to 1,
#       then print each token with its weight.
print(context)
`,
      solution_code: `context = ["The", "cat", "sat"]
scores  = [1.0, 2.0, 7.0]

total = sum(scores)
weights = [s / total for s in scores]

for tok, w in zip(context, weights):
    print(f"{tok}: {w:.2f}")

focus = context[weights.index(max(weights))]
print(f"focus: {focus}")
`,
      expected_output: `The: 0.10
cat: 0.20
sat: 0.70
focus: sat`,
      step_throughs: [
        {
          title: "resolving 'it' with attention",
          steps: [
            { label: "Predicting after a pronoun", detail: "The model reaches 'it was too big' and must figure out what 'it' refers to before predicting onward.", code: 'context = "The trophy did not fit ... because it was too big"' },
            { label: "Score earlier tokens", detail: "Attention rates every earlier token for relevance. 'trophy' (the thing that is big) scores high; 'suitcase' scores low.", code: "trophy: 6.0, suitcase: 1.0, the: 0.2 ..." },
            { label: "Normalize with softmax", detail: "Scores become weights that sum to 1, so 'trophy' captures most of the focus.", code: "trophy: 0.78, suitcase: 0.13, ... (sum 1.0)" },
            { label: "Blend and predict", detail: "The weighted blend leans on 'trophy', so the model continues sensibly about the trophy being too big.", code: "next tokens stay consistent with 'trophy'" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Three earlier tokens have attention scores [1, 1, 8]. Which token does the model focus on most?",
          steps: [
            "Higher score means more relevance, so the third token (score 8) dominates.",
            "Normalized, its weight is 8 / (1+1+8) = 0.8, versus 0.1 each for the others.",
            "The model blends mostly the third token into its prediction."
          ],
          output: "The third token, with about 80% of the attention weight."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "If processing a context of length 100 costs roughly 100x100 attention comparisons, about how much more work is a context of length 200?",
          steps: [
            "Attention compares every token against every other, so cost scales with length squared.",
            "Length 100 costs about 100 x 100 = 10,000 comparisons.",
            "Length 200 costs about 200 x 200 = 40,000 comparisons.",
            "40,000 / 10,000 = 4, so doubling the context roughly quadruples the attention work."
          ],
          output: "About 4x the work — cost grows with the square of the length."
        }
      ],
      comparison_tables: [
        {
          title: "no attention vs attention",
          columns: ["Aspect", "Without attention", "With attention"],
          rows: [
            { cells: ["Token relevance", "All earlier tokens treated equally", "Each earlier token weighted by relevance"] },
            { cells: ["Long-range links", "Struggles to connect distant words", "Links 'it' to a noun many words back"] },
            { cells: ["Pronouns and structure", "Often confused", "Resolved by focusing on the right token"] },
            { cells: ["Powers modern LLMs", "No", "Yes — the Transformer is built on it"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true of attention vs not true",
          bins: [
            { id: "true", label: "True of attention" },
            { id: "false", label: "Not true" }
          ],
          items: [
            { id: "i1", text: "Weights earlier tokens by relevance", bin: "true" },
            { id: "i2", text: "Treats every past token equally", bin: "false" },
            { id: "i3", text: "Uses softmax to make weights sum to 1", bin: "true" },
            { id: "i4", text: "Is the 'T' (Transformer) behind GPT", bin: "true" },
            { id: "i5", text: "Stores facts in a lookup table", bin: "false" },
            { id: "i6", text: "Lets the model link distant words", bin: "true" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is attention better than just looking at the most recent few words?",
          sampleAnswer: "Meaning often depends on words far back in the sentence — a pronoun can refer to a noun introduced many tokens earlier. Looking only at the last few words would miss that link, but attention scores every earlier token for relevance and can put heavy weight on a distant one when it matters. That selective, long-range focus is what lets the model handle pronouns, structure, and context coherently."
        }
      ],
      hints: [
        "Sum the scores, then divide each score by that sum to get weights.",
        "zip(context, weights) lets you print each token with its weight.",
        "max(weights) finds the largest weight; weights.index(...) gives its position."
      ],
      challenge_title: "Attention Focus Finder",
      challenge_description: "Implement the heart of attention: turn relevance scores over earlier tokens into weights that sum to 1, then report which token the model focuses on most.",
      challenge_story: "You're debugging why a model resolved a pronoun a certain way, and you want to *see* its attention. The model has produced a relevance **score** for each earlier token relative to the one it is predicting next. Your job: normalize those scores into **weights** that sum to 1 (the model's focus distribution) and surface the single token it leaned on hardest. This is exactly what attention does at every step, minus the matrix math.",
      challenge_statement: "You are given `n` earlier tokens, each with an integer relevance score.\n\n1. Let `T` be the sum of all scores. Each token's weight is `score / T`.\n2. Print each token, in input order, with its weight as a percentage rounded to exactly **1 decimal place**.\n3. Print a final line `FOCUS <token>` naming the token with the **highest** weight. If two tokens tie on weight, choose the one that appears **earliest** in the input.",
      challenge_input_format: "The first line is the integer `n`. Each of the next `n` lines has a token (no spaces) and its integer relevance score, separated by a space.",
      challenge_output_format: "`n` lines of `<token> <percentage>` (1 decimal place), then `FOCUS <token>`.",
      challenge_constraints: [
        "1 ≤ n ≤ 100000",
        "1 ≤ score ≤ 1000000",
        "At least one score is positive, so the total is never zero.",
        "Tokens contain no spaces.",
      ],
      challenge_examples: [
        { input: "3\nThe 1\ncat 2\nsat 7", output: "The 10.0\ncat 20.0\nsat 70.0\nFOCUS sat", explanation: "Total is 10. The = 1/10 = 10.0%, cat = 20.0%, sat = 70.0%. 'sat' has the highest weight, so FOCUS sat." },
        { input: "4\na 5\nbig 5\nred 3\ndog 7", output: "a 25.0\nbig 25.0\nred 15.0\ndog 35.0\nFOCUS dog", explanation: "Total 20. dog at 7/20 = 35.0% is the highest, so FOCUS dog." },
      ],
      challenge_notes: "This is a single-head, single-step view of attention: real models run many heads across many layers and use softmax (which exponentiates first). The linear normalization here keeps the arithmetic clean while preserving the key idea — relevance scores become a focus distribution that sums to 1. The earliest-wins tie-break makes the FOCUS line deterministic.",
      challenge_hints: [
        "Read all (token, score) pairs first so you can sum the total before computing weights.",
        "Each weight percentage is score/total*100; format with f\"{pct:.1f}\".",
        "Track the best weight as you go and only replace it on a strictly greater value, so the earliest token wins ties.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    tokens = []
    scores = []
    for _ in range(n):
        parts = data[idx].split()
        tokens.append(parts[0])
        scores.append(int(parts[1]))
        idx += 1

    # TODO: let total = sum(scores); print "<token> <pct>" per token where pct is
    #       score/total*100 to 1 decimal, then "FOCUS <token>" for the highest-weight
    #       token (ties: the earliest one in input order).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip())
    idx += 1
    tokens = []
    scores = []
    for _ in range(n):
        parts = data[idx].split()
        tokens.append(parts[0])
        scores.append(int(parts[1]))
        idx += 1
    total = sum(scores)
    weights = []
    for i in range(n):
        w = scores[i] / total
        weights.append(w)
        print(f"{tokens[i]} {w*100:.1f}")
    best_i = 0
    best_w = -1.0
    for i in range(n):
        if weights[i] > best_w:
            best_w = weights[i]
            best_i = i
    print(f"FOCUS {tokens[best_i]}")

main()
`,
      challenge_test_cases: [
        { input: "3\nThe 1\ncat 2\nsat 7", expected_output: "The 10.0\ncat 20.0\nsat 70.0\nFOCUS sat", description: "Scores normalized to weights; highest-weight token is the focus." },
        { input: "4\na 5\nbig 5\nred 3\ndog 7", expected_output: "a 25.0\nbig 25.0\nred 15.0\ndog 35.0\nFOCUS dog", description: "Mixed weights with the focus on the largest." },
        { input: "2\nfirst 4\nsecond 4", expected_output: "first 50.0\nsecond 50.0\nFOCUS first", description: "Tie on weight resolved to the earliest token." },
        { input: "1\nonly 9", expected_output: "only 100.0\nFOCUS only", description: "A single token holds all the attention." }
      ]
    },
    {
      id: "ai-01-l8",
      project_id: "ai-01",
      order: 8,
      title: "Why Bigger Models Got Smarter",
      concept: "Scaling",
      xp_reward: 10,
      explanation: `For years, AI researchers expected progress to come from clever new ideas. Then something almost embarrassing happened: the biggest leaps came mostly from making models *bigger* and feeding them *more data*. Same basic recipe, cranked up. This is the story of **scaling**, and it is why a 2020s chatbot can do things a 2010s one could not dream of.

## What it is

**Scaling laws** are the observed, remarkably smooth relationship between a model's resources and its performance. Pour in more **parameters** (lesson 6), more training **data**, and more **compute**, and prediction error falls in a predictable way. Crucially, these three must grow *together* — a giant model starved of data, or a mountain of data run through a tiny model, both waste the effort.

The surprise is how regular it is. Plot loss against scale and you get a clean downward curve, not a chaotic mess. That predictability let labs forecast that a bigger model *would* be better before spending the millions to build it.

## How it works

As you scale, two things happen at once.

First, prediction loss drops smoothly — but with **diminishing returns**. Each doubling of resources buys a smaller improvement than the last. A toy version of that shrinking-gain curve:

\`\`\`python
# loss falls as a power of model size, but ever more slowly
base, alpha = 10.0, 0.5
for params in [1, 100, 10000]:
    loss = base * params ** (-alpha)
    print(params, round(loss, 3))
# 1 -> 10.0,  100 -> 1.0,  10000 -> 0.1  (100x size for each 10x gain)
\`\`\`

Second — and this is the wild part — some abilities appear **emergently**. Below a certain scale a model simply cannot do multi-step arithmetic or follow complex instructions, and then past a threshold the ability shows up, almost like a phase change. The smooth loss curve hides these sudden capability jumps.

## Why it matters

- **It set the strategy of the whole field.** "Just scale it" became a multi-billion-dollar bet because the curves kept holding. Much of the 2020s AI boom is scaling, not new algorithms.
- **Diminishing returns are real.** Each new tier of capability costs disproportionately more. That is why frontier models are so expensive and why the gap between releases can feel smaller over time.
- **Bigger is not infinitely better.** You eventually run short of high-quality data and hit cost walls. Scaling is powerful, not magic — and lesson 6's lesson still holds: a well-trained smaller model can beat a poorly-trained giant.

## The mental model to keep

**More parameters plus more data plus more compute equals lower error and, past thresholds, new abilities — but every gain costs more than the last.** Scaling is a dependable engine with a rising fuel bill.`,
      key_terms: [
        { term: "Scaling laws", definition: "The smooth, predictable relationship between a model's resources and its prediction error." },
        { term: "Compute", definition: "The total processing power spent training a model, growing alongside parameters and data." },
        { term: "Emergent abilities", definition: "Skills that appear only once a model passes a certain scale, seemingly all at once." },
        { term: "Diminishing returns", definition: "Each added unit of scale buys a smaller improvement than the one before it." }
      ],
      callouts: [
        { type: "insight", title: "Three dials, turned together", content: "Scaling is not just 'more parameters.' Parameters, data, and compute have to grow in step. A huge model fed too little data, or a flood of data run through a tiny model, both waste the spend.", position: "before" },
        { type: "warning", title: "Returns shrink as you climb", content: "Each doubling of resources buys less than the last doubling. That is why frontier models cost so much for gains that can look incremental — you are paying more and more for less and less.", position: "after" }
      ],
      concept_diagram: {
        title: "What scaling buys you",
        steps: [
          { label: "Grow the three dials", desc: "More parameters, more data, more compute together." },
          { label: "Loss falls smoothly", desc: "Prediction error drops along a predictable curve." },
          { label: "Cross thresholds", desc: "Past certain scales, new abilities emerge suddenly." },
          { label: "Returns diminish", desc: "Each further gain costs disproportionately more." }
        ]
      },
      inline_quizzes: [
        {
          question: "What three things must grow together for scaling to pay off?",
          options: ["Tokens, temperature, and vocabulary", "Parameters, data, and compute", "Layers, prompts, and users"],
          correct_index: 1,
          explanation: "Scaling laws require parameters, training data, and compute to increase in balance."
        }
      ],
      quiz_questions: [
        {
          question: "What do scaling laws describe?",
          options: [
            "A random relationship between size and quality",
            "A smooth, predictable drop in prediction error as resources grow",
            "How fast a model types",
            "The size of the vocabulary"
          ],
          correct_index: 1,
          explanation: "Scaling laws are the observed, regular curve linking parameters, data, and compute to lower loss."
        },
        {
          question: "What is an emergent ability?",
          options: [
            "A skill present in every model from the start",
            "A skill that appears only once the model passes a certain scale",
            "A bug that grows with size",
            "A feature you pay extra to unlock"
          ],
          correct_index: 1,
          explanation: "Some capabilities show up suddenly past a scale threshold, even though the loss curve itself is smooth."
        },
        {
          question: "Why do frontier models cost so much for seemingly modest gains?",
          options: [
            "Bigger models waste tokens",
            "Diminishing returns: each tier of capability costs disproportionately more",
            "They retrain on every request",
            "Larger vocabularies are expensive"
          ],
          correct_index: 1,
          explanation: "Each doubling of scale buys a smaller improvement, so pushing the frontier costs ever more for each step."
        }
      ],
      participation_activities: [
        {
          activity_title: "Scaling check",
          questions: [
            { question: "Adding more parameters alone, without more data or compute, reliably makes a model much better.", type: "true_false", correct_answer: "false", explanation: "Parameters, data, and compute must scale together; one alone wastes the others." },
            { question: "Skills that appear only past a certain model scale are called ______ abilities.", type: "fill_in", correct_answer: "emergent", explanation: "Emergent abilities show up suddenly once scale crosses a threshold." }
          ]
        }
      ],
      starter_code: `# Show diminishing returns: loss falls as a power of model size.
base, alpha = 10.0, 0.5

# TODO: for each size, compute loss = base * size ** (-alpha) and print it.
for size in [1, 100, 10000]:
    print(size)
`,
      solution_code: `base, alpha = 10.0, 0.5

for size in [1, 100, 10000]:
    loss = base * size ** (-alpha)
    print(f"{size}: {loss:.3f}")
`,
      expected_output: `1: 10.000
100: 1.000
10000: 0.100`,
      step_throughs: [
        {
          title: "scaling up, gain by gain",
          steps: [
            { label: "Start small", detail: "A tiny model has high loss and lacks complex skills entirely — no multi-step reasoning yet.", code: "params = 1x  ->  loss high, few abilities" },
            { label: "Scale all three dials", detail: "Grow parameters, data, and compute together. Loss drops along the predictable scaling curve.", code: "10x params + 10x data + 10x compute" },
            { label: "Cross a threshold", detail: "Past a certain scale, a new ability suddenly appears — arithmetic or instruction-following emerges.", code: "loss <= threshold  ->  new ability unlocks" },
            { label: "Hit diminishing returns", detail: "Keep scaling and loss still falls, but each gain costs far more than the last. The bill outpaces the benefit.", code: "100x more spend  ->  10x less error" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Loss follows loss = 10 / sqrt(size). What is the loss at size 100 versus size 10000?",
          steps: [
            "At size 100: sqrt(100) = 10, so loss = 10 / 10 = 1.0.",
            "At size 10000: sqrt(10000) = 100, so loss = 10 / 100 = 0.1.",
            "You multiplied size by 100 but only cut loss by 10x — that is diminishing returns."
          ],
          output: "Loss 1.0 at size 100, 0.1 at size 10000 — a 100x size for a 10x gain."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A lab has a giant model but only a small dataset, and it underperforms. Their plan is to make the model even bigger. Why might that not help?",
          steps: [
            "Scaling laws require parameters, data, and compute to grow together.",
            "The model is already starved of data, so it cannot learn enough patterns to use its capacity.",
            "Adding parameters gives the model more room but nothing new to learn from — the bottleneck is data, not size.",
            "The fix is more (and better) data and compute to match the model, not more parameters alone."
          ],
          output: "Data is the bottleneck; growing only the model wastes parameters that have nothing to learn from."
        }
      ],
      comparison_tables: [
        {
          title: "small scale vs large scale",
          columns: ["Aspect", "Small scale", "Large scale"],
          rows: [
            { cells: ["Prediction loss", "Higher", "Lower (smoothly)"] },
            { cells: ["Complex abilities", "Often absent", "Can emerge past thresholds"] },
            { cells: ["Cost", "Cheap", "Very expensive"] },
            { cells: ["Return on each doubling", "Larger early gains", "Diminishing returns"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true of scaling vs not true",
          bins: [
            { id: "true", label: "True of scaling" },
            { id: "false", label: "Not true" }
          ],
          items: [
            { id: "i1", text: "Parameters, data, and compute grow together", bin: "true" },
            { id: "i2", text: "Each gain costs less than the last", bin: "false" },
            { id: "i3", text: "Some abilities emerge past a threshold", bin: "true" },
            { id: "i4", text: "Loss falls along a predictable curve", bin: "true" },
            { id: "i5", text: "More parameters alone always suffices", bin: "false" },
            { id: "i6", text: "Returns diminish as you scale up", bin: "true" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if scaling reliably improves models, why don't labs just keep making them infinitely bigger?",
          sampleAnswer: "Scaling gives diminishing returns, so each new tier of capability costs far more than the last while delivering less improvement. On top of that, the three dials must grow together, and high-quality training data is finite — you eventually run short of it. Combined with hard limits on compute and budget, those rising costs and shrinking gains mean infinite scaling is impractical, even though the curves themselves keep pointing down."
        }
      ],
      hints: [
        "size ** (-alpha) is the same as 1 / size ** alpha.",
        "With alpha = 0.5, size ** (-0.5) is 1 / sqrt(size).",
        "Multiply by base and format the loss to 3 decimals when you print."
      ],
      challenge_title: "Scaling Law Simulator",
      challenge_description: "Model how prediction loss falls as you scale a model up, and flag the point where a new ability emerges once loss drops below a threshold.",
      challenge_story: "Your lab is deciding how big to build the next model. Training is governed by a **scaling law**: loss = base_loss x size raised to the power of negative alpha. As you grow the model `size`, loss falls — but with diminishing returns. Your team has also noticed that a key **emergent ability** (multi-step reasoning) only appears once loss drops to or below a target **threshold**. Simulate several candidate sizes, report each one's loss, mark which ones unlock the ability, and count how many do.",
      challenge_statement: "You are given `base_loss` and `alpha` (floats), then a `threshold` (float), then `q` candidate model sizes.\n\nFor each size `N`, compute `loss = base_loss * N ** (-alpha)`.\n\n- Print the size, its loss rounded to exactly **4 decimal places**, and a status: `EMERGENT` if the loss is **less than or equal to** the threshold, otherwise `BASIC`.\n- After all candidates, print `EMERGENT <count>` giving how many sizes unlocked the ability.",
      challenge_input_format: "The first line has two space-separated floats: `base_loss alpha`. The second line is the float `threshold`. The third line is the integer `q`. Each of the next `q` lines is one integer size `N`.",
      challenge_output_format: "`q` lines of `<N> <loss> <STATUS>` (loss to 4 decimal places), then a final line `EMERGENT <count>`.",
      challenge_constraints: [
        "0.0 < base_loss ≤ 1000.0",
        "0.0 < alpha ≤ 5.0",
        "0.0 < threshold ≤ 1000.0",
        "1 ≤ q ≤ 10000",
        "1 ≤ N ≤ 1000000000",
      ],
      challenge_examples: [
        { input: "10.0 0.5\n1.0\n3\n4\n100\n10000", output: "4 5.0000 BASIC\n100 1.0000 EMERGENT\n10000 0.1000 EMERGENT\nEMERGENT 2", explanation: "loss = 10 / sqrt(N). At N=4: 10/2 = 5.0 > 1.0, BASIC. At N=100: 10/10 = 1.0 <= 1.0, EMERGENT. At N=10000: 10/100 = 0.1, EMERGENT. Two unlocked." },
        { input: "8.0 1.0\n2.0\n2\n2\n8", output: "2 4.0000 BASIC\n8 1.0000 EMERGENT\nEMERGENT 1", explanation: "loss = 8 / N. At N=2: 4.0 > 2.0, BASIC. At N=8: 1.0 <= 2.0, EMERGENT. One unlocked." },
      ],
      challenge_notes: "The threshold is inclusive: a loss exactly equal to the threshold counts as EMERGENT. Notice how much you must grow N for a small loss drop — that is the diminishing-returns reality of scaling. Real scaling laws also depend on data and compute, not size alone, but the power-law shape here is the genuine curve labs observe.",
      challenge_hints: [
        "Read base_loss and alpha from the first line as floats with map(float, ...).",
        "Compute each loss as base_loss * N ** (-alpha); Python handles the negative exponent directly.",
        "Compare loss <= threshold for EMERGENT, and keep a running count to print at the end.",
      ],
      challenge_difficulty: "beginner",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    base_loss, alpha = map(float, data[0].split())
    threshold = float(data[1].strip())
    q = int(data[2].strip())
    sizes = [int(data[3 + i].strip()) for i in range(q)]

    # TODO: for each N in sizes, compute loss = base_loss * N ** (-alpha); print
    #       "<N> <loss> <STATUS>" (loss to 4 decimals, EMERGENT if loss <= threshold
    #       else BASIC), then a final "EMERGENT <count>" of how many were EMERGENT.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    base_loss, alpha = map(float, data[idx].split())
    idx += 1
    threshold = float(data[idx].strip())
    idx += 1
    q = int(data[idx].strip())
    idx += 1
    emergent = 0
    for _ in range(q):
        n = int(data[idx].strip())
        idx += 1
        loss = base_loss * (n ** (-alpha))
        status = "EMERGENT" if loss <= threshold else "BASIC"
        if status == "EMERGENT":
            emergent += 1
        print(f"{n} {loss:.4f} {status}")
    print(f"EMERGENT {emergent}")

main()
`,
      challenge_test_cases: [
        { input: "10.0 0.5\n1.0\n3\n4\n100\n10000", expected_output: "4 5.0000 BASIC\n100 1.0000 EMERGENT\n10000 0.1000 EMERGENT\nEMERGENT 2", description: "Power-law loss with two sizes crossing the threshold." },
        { input: "8.0 1.0\n2.0\n2\n2\n8", expected_output: "2 4.0000 BASIC\n8 1.0000 EMERGENT\nEMERGENT 1", description: "Inverse-size law; threshold reached at the larger model." },
        { input: "5.0 0.5\n0.1\n1\n4", expected_output: "4 2.5000 BASIC\nEMERGENT 0", description: "No size reaches the strict threshold, so nothing emerges." }
      ]
    }
  ]
};
