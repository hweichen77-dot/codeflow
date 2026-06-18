export default {
  project: {
    id: "ai-07",
    title: "Build a RAG System",
    description: "Stop your LLM from making things up — bolt a real document search onto it and build a Q&A tool that cites its sources.",
    difficulty: "advanced",
    category: "rag_search",
    estimated_time: 180,
    lessons_count: 5,
    tags: ["rag", "retrieval", "embeddings", "vector-store", "chunking", "anthropic-api"],
    order: 7,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-07-l1",
      project_id: "ai-07",
      order: 1,
      title: "Why LLMs Make Things Up",
      concept: "Hallucination",
      xp_reward: 10,
      explanation: `Ask an LLM "What was our Q3 revenue?" and it will answer with total confidence. The number might be completely invented.

That's not a bug you can patch. It's how the model works.

## A model is a probability machine, not a database

An LLM generates the next most likely token given everything so far. It learned those probabilities from training data it saw months or years ago. It has no live lookup, no source of truth, no way to say "I checked the file." When it doesn't know, it doesn't go quiet — it produces fluent text that *sounds* right. We call that a hallucination.

Three situations make it worse:

- **Private data.** Your company's revenue was never in the training set. The model has literally nothing to draw on, so it guesses.
- **Recent events.** Anything after the training cutoff doesn't exist to the model.
- **Specifics.** Names, dates, dollar amounts, version numbers — exactly the things a confident wrong answer hurts most.

## The fix: give it the answer first

Here's the whole idea behind retrieval-augmented generation. Instead of asking the model to recall a fact, you *find* the fact yourself, paste it into the prompt, and ask the model to answer **using only that text**.

\`\`\`python
prompt = f"""Use ONLY the context below to answer.

Context:
{retrieved_document}

Question: {user_question}"""
\`\`\`

The model stops being a fact source and becomes a reading-comprehension engine. It's very good at reading comprehension. It's unreliable at recall. RAG plays to the strength.

You're not making the model smarter. You're changing the job. "Remember this number" becomes "summarize this paragraph I just handed you." That swap is the difference between a demo that embarrasses you and one you can ship to customers.

The rest of this module builds the retrieval half: how to chop documents into pieces, store them, search them by meaning, and stitch the best pieces into a prompt. The payoff is a working document Q&A tool that answers from your files and admits when it doesn't know.`,
      key_terms: [
        { term: "Hallucination", definition: "When an LLM generates fluent, confident text that is factually wrong because it's predicting likely words rather than retrieving known facts." },
        { term: "Training cutoff", definition: "The date after which the model saw no data. Anything newer is invisible to it unless you supply it in the prompt." },
        { term: "Grounding", definition: "Constraining a model's answer to specific source text you provide, so claims can be traced back to a document." },
        { term: "RAG", definition: "Retrieval-Augmented Generation: find relevant text, inject it into the prompt, then let the model answer from it." }
      ],
      callouts: [
        { type: "analogy", title: "The open-book exam", content: "A closed-book exam tests memory — and a tired student bluffs answers. An open-book exam lets you look things up first. RAG hands the model the open book before it has to answer.", position: "before" },
        { type: "warning", title: "Confidence is not accuracy", content: "An LLM has no internal signal for 'I'm unsure.' A made-up revenue figure reads exactly as confidently as a real one. Never treat fluency as evidence the answer is correct.", position: "after" }
      ],
      concept_diagram: {
        title: "Plain LLM vs. RAG",
        steps: [
          { label: "User asks a question", desc: "e.g. 'What was Q3 revenue?'" },
          { label: "Plain LLM guesses", desc: "Predicts plausible-sounding tokens from old training data — may invent the number." },
          { label: "RAG retrieves first", desc: "Searches your documents for the relevant passage." },
          { label: "Inject context", desc: "Paste that passage into the prompt." },
          { label: "Model answers from context", desc: "Reads the supplied text instead of recalling — grounded answer." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does an LLM hallucinate specific facts like dollar amounts?",
          options: [
            "It predicts likely tokens and has no live source of truth to check against",
            "It runs out of memory and fills gaps with zeros",
            "The API randomly corrupts numbers in transit"
          ],
          correct_index: 0,
          explanation: "The model generates the next probable token. With no retrieval step, it has nothing to verify against, so it produces fluent guesses."
        }
      ],
      quiz_questions: [
        {
          question: "What core change does RAG make to the model's job?",
          options: [
            "It turns recall ('remember this fact') into reading comprehension ('answer from this text')",
            "It retrains the model on your private data in real time",
            "It increases the model's max token limit so it remembers more",
            "It lowers the temperature so the model stops being creative"
          ],
          correct_index: 0,
          explanation: "RAG supplies the relevant text in the prompt, so the model reads and summarizes instead of recalling from training — its reliable skill, not its weak one."
        },
        {
          question: "Which question is a plain LLM MOST likely to hallucinate on?",
          options: [
            "Your startup's headcount last month",
            "The boiling point of water at sea level",
            "How to reverse a string in Python",
            "What a 'for loop' does"
          ],
          correct_index: 0,
          explanation: "Private, recent, specific data was never in training. The other three are stable, public facts the model saw many times."
        },
        {
          question: "A model returns a wrong answer with total confidence. What does that tell you?",
          options: [
            "Nothing about accuracy — confidence and correctness are unrelated in an LLM",
            "The answer is probably right since the model sounds sure",
            "The model checked its sources and found a match",
            "The temperature was set too high"
          ],
          correct_index: 0,
          explanation: "LLMs have no built-in uncertainty signal in their output. Tone is not evidence; you need grounding to trust a specific claim."
        }
      ],
      participation_activities: [
        {
          activity_title: "Spot the hallucination risk",
          questions: [
            { question: "An LLM with no retrieval can reliably answer questions about events that happened after its training cutoff.", type: "true_false", correct_answer: "false", explanation: "Post-cutoff events don't exist to the model. Without supplied context, it can only guess." },
            { question: "RAG works by injecting relevant source text into the prompt so the model answers from it instead of from ______.", type: "fill_in", correct_answer: "memory", explanation: "RAG replaces unreliable recall from training memory with reading the supplied context." }
          ]
        }
      ],
      starter_code: `# A question about private data the model has never seen.
question = "What was the company's Q3 revenue?"

docs = {
    "doc1": "The company reported Q3 revenue of $4.2 million, up 18% year over year.",
    "doc2": "Our office dog is named Biscuit and he loves the marketing team.",
}

# TODO: write naive_answer(q) that returns a made-up figure (simulating a plain LLM).
# TODO: write grounded_answer(q, context) that answers ONLY from the context string.
# Print both so you can compare.
`,
      solution_code: `question = "What was the company's Q3 revenue?"

docs = {
    "doc1": "The company reported Q3 revenue of $4.2 million, up 18% year over year.",
    "doc2": "Our office dog is named Biscuit and he loves the marketing team.",
}

def naive_answer(q):
    # Simulates a plain LLM guessing without any source.
    return "The Q3 revenue was $5.8 million."

def grounded_answer(q, context):
    # Answers strictly from the supplied context.
    if "4.2 million" in context:
        return "Based on the document, Q3 revenue was $4.2 million."
    return "I don't have that information."

print("No context:", naive_answer(question))

context = docs["doc1"]
print("With context:", grounded_answer(question, context))
`,
      expected_output: `No context: The Q3 revenue was $5.8 million.
With context: Based on the document, Q3 revenue was $4.2 million.`,
      step_throughs: [
        {
          title: "question → retrieve → ground → answer",
          steps: [
            { label: "User asks", detail: "A question about a fact the model never saw in training.", code: '"What was our Q3 revenue?"' },
            { label: "Retrieve the source", detail: "Find the passage from your own documents that holds the fact, instead of trusting the model's memory.", code: 'doc1: "Q3 revenue of $4.2 million, up 18%."' },
            { label: "Stuff it into the prompt", detail: "Paste that passage in as context and tell the model to answer using only it.", code: 'prompt = "Use ONLY this context: " + doc1' },
            { label: "Grounded answer", detail: "The model reads the supplied text and reports the real figure — no guessing.", code: '"Q3 revenue was $4.2 million."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Plain LLM is asked: "What is our refund window?" It was never trained on your policy. What happens?',
          steps: [
            "The fact lives only in your private docs, which were never in the training data.",
            "The model has no live lookup, so it cannot fetch the real number.",
            "It predicts a plausible-sounding continuation — maybe '30 days' — with full confidence.",
            "That answer might be right by luck or wrong by accident; either way it is a guess, not a fact."
          ],
          output: "A confident but unverifiable answer (a hallucination risk)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'Write a grounding check: the answer says "Revenue was $5.8 million." The source doc says "Q3 revenue of $4.2 million." Is the answer grounded?',
          steps: [
            "Pull every number-bearing token out of the answer: ['$5.8', 'million'].",
            "Strip symbols: '5.8'.",
            "Search the source text for '5.8' — it is not present (the source says 4.2).",
            "At least one number is unsupported, so the answer is NOT grounded — flag it as a likely hallucination."
          ],
          output: "is_grounded -> False"
        }
      ],
      comparison_tables: [
        {
          title: "plain LLM vs. RAG",
          columns: ["Aspect", "Plain LLM", "RAG"],
          rows: [
            { cells: ["Source of the answer", "Frozen training memory", "Your live documents"] },
            { cells: ["Private / recent data", "Invisible — must guess", "Retrieved and supplied"] },
            { cells: ["When it lacks the fact", "Bluffs a fluent guess", "Can say 'I don't know'"] },
            { cells: ["Traceable to a source", "No", "Yes — cites the chunk"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "needs retrieval vs. fine without it",
          bins: [
            { id: "retrieve", label: "Needs retrieval" },
            { id: "plain", label: "Fine for a plain LLM" }
          ],
          items: [
            { id: "i1", text: "What was our Q3 revenue?", bin: "retrieve" },
            { id: "i2", text: "What is the boiling point of water?", bin: "plain" },
            { id: "i3", text: "What does our return policy say?", bin: "retrieve" },
            { id: "i4", text: "Write a haiku about autumn", bin: "plain" },
            { id: "i5", text: "Who did we hire last month?", bin: "retrieve" },
            { id: "i6", text: "Reverse a string in Python", bin: "plain" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does giving the model the document first reduce hallucination, when the model itself hasn't changed?",
          sampleAnswer: "The model's weakness is recall — pulling exact facts from fuzzy memory. Its strength is reading comprehension. By pasting the document in, you swap the hard job (remember this number) for the easy one (summarize this paragraph). Same model, easier task, so it stops guessing."
        }
      ],
      hints: [
        "naive_answer ignores the docs entirely — it just returns a hardcoded wrong figure to mimic a hallucination.",
        "grounded_answer should look inside the context string before answering, and fall back to 'I don't have that information.' if the fact isn't there.",
        "Pass docs['doc1'] (the relevant doc) as the context to grounded_answer."
      ],
      challenge_title: "The Hallucination Auditor",
      challenge_description: "Audit a batch of model answers and flag every one whose numbers don't appear anywhere in the retrieved source.",
      challenge_story: "You run trust-and-safety for a financial-research assistant. The LLM drafts answers from retrieved filings, but legal won't sign off until you can prove no answer invents a figure that isn't in its source. A made-up revenue number reads exactly as confidently as a real one, so a human can't eyeball thousands of them. Tonight you're building the nightly **grounding auditor**: it scans every answer, extracts the numeric tokens, and flags any answer that cites a number the source never mentioned.",
      challenge_statement: "You are given a set of **source lines** (the retrieved context) followed by a batch of **answers**. A *numeric token* is any whitespace-separated token that contains at least one digit, after stripping the surrounding punctuation characters `.,!?$%:;()\"'` from both ends.\n\nAn answer is **grounded** if every numeric token it contains also appears as a numeric token somewhere in the source. An answer with no numeric tokens is trivially grounded.\n\nReport how many answers are grounded, then list the 1-based indices of the answers that are **not** grounded (in increasing order).",
      challenge_input_format: "The first line contains an integer `S` — the number of source lines.\nThe next `S` lines are the source text.\nThe next line contains an integer `Q` — the number of answers.\nThe next `Q` lines are the answers, one per line.",
      challenge_output_format: "Line 1: the number of grounded answers.\nLine 2: the 1-based indices of the ungrounded answers, space-separated, in increasing order — or the word `NONE` if every answer is grounded.",
      challenge_constraints: [
        "1 ≤ S ≤ 1000",
        "1 ≤ Q ≤ 1000",
        "Each line has at most 500 characters.",
        "Tokens are compared as exact strings after stripping; `4.2` and `4.20` are different.",
      ],
      challenge_examples: [
        { input: "2\nQ3 revenue of 4.2 million was reported in 2023.\nProfit reached 1.1 million dollars.\n3\nRevenue was 4.2 million.\nRevenue was 9.9 million.\nProfit hit 1.1 million in 2023.", output: "2\n2", explanation: "Answer 1 cites 4.2 (in source) → grounded. Answer 2 cites 9.9 (not in source) → flagged. Answer 3 cites 1.1 and 2023, both in source → grounded. Two grounded; answer 2 is flagged." },
        { input: "1\nThe sky is blue.\n2\nThe sky is blue.\nThe value is 7.", output: "1\n2", explanation: "Answer 1 has no numbers → grounded. Answer 2 cites 7, absent from the source → flagged." },
      ],
      challenge_notes: "This is the real first line of defense in production RAG: cheap, deterministic checks that run on every answer before a human ever sees it. Strip punctuation with `token.strip(\".,!?$%:;()\\\"'\")` so `4.2.` and `4.2` compare equal. Build the set of source numeric tokens once, then test each answer against it.",
      challenge_hints: [
        "Read all source lines first and collect every numeric token into a set for O(1) lookups.",
        "A token is numeric if `any(c.isdigit() for c in token)` after stripping punctuation.",
        "An answer is flagged the moment one of its numeric tokens is missing from the source set.",
        "If the flagged list is empty, print `NONE` on the second line.",
      ],
      challenge_starter_code: `import sys

PUNCT = ".,!?$%:;()\\"'"

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    s = int(data[idx].strip()); idx += 1
    source_tokens = set()
    # TODO: read S source lines, collect numeric tokens into source_tokens.

    q = int(data[idx].strip()); idx += 1
    grounded = 0
    flagged = []
    # TODO: for each answer, flag it if any numeric token is missing from source_tokens.

    print(grounded)
    print(" ".join(map(str, flagged)) if flagged else "NONE")

main()
`,
      challenge_solution_code: `import sys

PUNCT = ".,!?$%:;()\\"'"

def numeric_tokens(line):
    out = []
    for w in line.split():
        cleaned = w.strip(PUNCT)
        if cleaned and any(c.isdigit() for c in cleaned):
            out.append(cleaned)
    return out

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    s = int(data[idx].strip()); idx += 1
    source_tokens = set()
    for _ in range(s):
        line = data[idx]; idx += 1
        for t in numeric_tokens(line):
            source_tokens.add(t)

    q = int(data[idx].strip()); idx += 1
    grounded = 0
    flagged = []
    for i in range(1, q + 1):
        line = data[idx]; idx += 1
        ok = all(t in source_tokens for t in numeric_tokens(line))
        if ok:
            grounded += 1
        else:
            flagged.append(i)

    print(grounded)
    print(" ".join(map(str, flagged)) if flagged else "NONE")

main()
`,
      challenge_test_cases: [
        { input: "2\nQ3 revenue of 4.2 million was reported in 2023.\nProfit reached 1.1 million dollars.\n3\nRevenue was 4.2 million.\nRevenue was 9.9 million.\nProfit hit 1.1 million in 2023.", expected_output: "2\n2", description: "Example 1: answer 2 hallucinates 9.9; the rest are grounded." },
        { input: "1\nThe sky is blue.\n2\nThe sky is blue.\nThe value is 7.", expected_output: "1\n2", description: "Example 2: no-number answer is grounded; the 7 answer is flagged." },
        { input: "1\nWe sold 500 units at 9 dollars each in 2024.\n1\nWe sold 500 units.", expected_output: "1\nNONE", description: "Edge case: every cited number appears in the source, so NONE are flagged." },
        { input: "1\nTotal was 4.2 million.\n2\nIt was 4.2 million.\nIt was 4.20 million.", expected_output: "1\n2", description: "Edge case: 4.20 is a different string token than 4.2, so it is flagged." }
      ]
    },
    {
      id: "ai-07-l2",
      project_id: "ai-07",
      order: 2,
      title: "Chunking: Cutting Documents Down to Size",
      concept: "Chunking",
      xp_reward: 10,
      explanation: `You can't stuff a 50-page PDF into every prompt. It's expensive, it blows past context limits, and burying the one relevant paragraph in 49 pages of noise makes the model's answer *worse*, not better.

So before anything else, you split documents into chunks — small, searchable pieces. Get this step wrong and the rest of your RAG system retrieves garbage.

## Why not one chunk per document?

Because retrieval needs to be precise. If a document is one giant blob, searching it is all-or-nothing: you either dump the whole thing into the prompt or skip it. Chunks let you pull *just* the passage that answers the question and leave the rest behind.

## The tension: too big vs. too small

- **Chunks too big** → each one covers many topics, so similarity search gets fuzzy and you waste tokens shipping irrelevant text.
- **Chunks too small** → you slice a sentence away from the context that gives it meaning. "It costs $4.2M" is useless without the sentence naming what "it" is.

A common starting point is a few hundred words per chunk. Don't agonize over the exact number — measure retrieval quality and adjust.

## Overlap saves split-up ideas

Fixed-size chunking has an ugly failure: an important fact lands right on a chunk boundary and gets cut in half. The fix is **overlap** — let each chunk repeat the last few words of the previous one.

\`\`\`python
def chunk_words(text, size, overlap):
    words = text.split()
    chunks = []
    step = size - overlap
    for start in range(0, len(words), step):
        chunks.append(" ".join(words[start:start + size]))
        if start + size >= len(words):
            break
    return chunks
\`\`\`

With \`size=12, overlap=3\`, each chunk shares its last 3 words with the next chunk's start. A fact straddling a boundary now appears whole in at least one chunk.

## Smarter: split on natural boundaries

Word-count chunking is blunt — it can slice mid-sentence. A better approach respects structure: split on sentences or paragraphs, then pack them into chunks up to a size limit. That keeps related sentences together so context survives. You'll build exactly that in the challenge.

Chunking is unglamorous plumbing, but it's the foundation. Bad chunks mean bad retrieval mean bad answers — no clever prompt downstream can rescue them.`,
      key_terms: [
        { term: "Chunk", definition: "A small piece of a document — typically a few hundred words — sized to be searched and retrieved independently." },
        { term: "Overlap", definition: "Shared text between adjacent chunks so a fact sitting on a boundary still appears whole in at least one chunk." },
        { term: "Chunk size", definition: "How much text goes in each chunk. Too big blurs search; too small strips away context." },
        { term: "Semantic boundary", definition: "A natural break point like a sentence or paragraph end, used to chunk without slicing ideas in half." }
      ],
      callouts: [
        { type: "analogy", title: "Index cards, not a textbook", content: "Searching a whole textbook for one fact is slow and noisy. Index cards — one idea each — let you grab exactly the card you need. Chunks are your index cards.", position: "before" },
        { type: "tip", title: "Overlap is cheap insurance", content: "A 10–20% overlap costs a little extra storage but rescues facts that would otherwise be guillotined by a chunk boundary. Almost always worth it.", position: "after" }
      ],
      concept_diagram: {
        title: "Chunking a document with overlap",
        steps: [
          { label: "Start with full text", desc: "One long document, too big for a prompt." },
          { label: "Pick size + overlap", desc: "e.g. 12 words per chunk, 3 words of overlap." },
          { label: "Slide a window", desc: "Step forward by (size - overlap) each time." },
          { label: "Emit chunks", desc: "Each chunk shares its tail with the next chunk's head." },
          { label: "Store the pieces", desc: "Now each chunk can be searched on its own." }
        ]
      },
      inline_quizzes: [
        {
          question: "What problem does chunk overlap solve?",
          options: [
            "A fact landing on a chunk boundary getting split across two chunks",
            "Chunks being stored in the wrong order",
            "The model running at too high a temperature"
          ],
          correct_index: 0,
          explanation: "Overlap repeats the boundary words, so an idea cut by a fixed-size split still appears intact in at least one chunk."
        }
      ],
      quiz_questions: [
        {
          question: "Why are very large chunks bad for retrieval quality?",
          options: [
            "Each one mixes many topics, so similarity search becomes fuzzy and wastes tokens on irrelevant text",
            "Large chunks are always rejected by the API",
            "They make embeddings impossible to compute",
            "The model refuses to read text longer than one sentence"
          ],
          correct_index: 0,
          explanation: "A big chunk spans multiple topics, diluting its match score and forcing you to ship lots of unrelated text into the prompt."
        },
        {
          question: "What's the downside of chunks that are too small?",
          options: [
            "A sentence gets separated from the context that gives it meaning",
            "They use too much disk space",
            "Small chunks can't be embedded",
            "The model ignores chunks under 100 characters"
          ],
          correct_index: 0,
          explanation: "'It costs $4.2M' means nothing without the nearby sentence naming what 'it' is. Over-slicing strips that context away."
        },
        {
          question: "With chunk size 12 and overlap 3, how far does the window advance each step?",
          options: [
            "9 words (size minus overlap)",
            "12 words (the full size)",
            "3 words (the overlap)",
            "15 words (size plus overlap)"
          ],
          correct_index: 0,
          explanation: "Step = size - overlap = 12 - 3 = 9, so each new chunk starts 9 words after the previous one and shares 3 words with it."
        }
      ],
      participation_activities: [
        {
          activity_title: "Chunking trade-offs",
          questions: [
            { question: "Overlapping chunks share some text with their neighbors to avoid splitting a fact across a boundary.", type: "true_false", correct_answer: "true", explanation: "That shared tail is exactly what overlap provides — boundary facts survive intact." },
            { question: "Splitting on sentence or paragraph ends instead of raw word counts keeps related ideas together; these natural break points are called ______ boundaries.", type: "fill_in", correct_answer: "semantic", explanation: "Semantic boundaries respect the document's structure so chunks don't slice ideas mid-thought." }
          ]
        }
      ],
      starter_code: `text = ("Retrieval-augmented generation grounds answers in real documents. "
        "It works by fetching relevant text before the model writes a reply. "
        "Chunking splits long documents into smaller searchable pieces. "
        "Good chunks keep related sentences together so context survives.")

# TODO: write chunk_words(text, size, overlap) that returns a list of chunks.
# Each chunk is 'size' words; consecutive chunks share 'overlap' words.
# Step forward by (size - overlap) each iteration.
`,
      solution_code: `text = ("Retrieval-augmented generation grounds answers in real documents. "
        "It works by fetching relevant text before the model writes a reply. "
        "Chunking splits long documents into smaller searchable pieces. "
        "Good chunks keep related sentences together so context survives.")

def chunk_words(text, size, overlap):
    words = text.split()
    chunks = []
    step = size - overlap
    for start in range(0, len(words), step):
        chunk = words[start:start + size]
        chunks.append(" ".join(chunk))
        if start + size >= len(words):
            break
    return chunks

chunks = chunk_words(text, size=12, overlap=3)
print(f"Total words: {len(text.split())}")
print(f"Chunks created: {len(chunks)}")
for i, c in enumerate(chunks):
    print(f"[{i}] {c}")
`,
      expected_output: `Total words: 36
Chunks created: 4
[0] Retrieval-augmented generation grounds answers in real documents. It works by fetching relevant
[1] by fetching relevant text before the model writes a reply. Chunking splits
[2] reply. Chunking splits long documents into smaller searchable pieces. Good chunks keep
[3] Good chunks keep related sentences together so context survives.`,
      step_throughs: [
        {
          title: "document → sized window → overlap → chunks",
          steps: [
            { label: "Start with the full text", detail: "One long document, far too big to paste into every prompt.", code: '36 words of source text' },
            { label: "Pick size and overlap", detail: "Decide how many words per chunk and how many to repeat between neighbors.", code: 'size = 12, overlap = 3' },
            { label: "Slide the window", detail: "Advance by (size - overlap) each step so each chunk shares its tail with the next.", code: 'step = 12 - 3 = 9' },
            { label: "Emit searchable chunks", detail: "Each piece is small enough to retrieve on its own, and boundary facts survive in the overlap.", code: '4 chunks, each independently searchable' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Chunk "a b c d e f" with size=3, overlap=1. What chunks come out?',
          steps: [
            "step = size - overlap = 3 - 1 = 2.",
            "Start 0: words[0:3] = 'a b c'.",
            "Start 2: words[2:5] = 'c d e' (shares 'c' with the previous chunk).",
            "Start 4: words[4:6] = 'e f' (shares 'e'); we've reached the end, so stop."
          ],
          output: "['a b c', 'c d e', 'e f']"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'Pack these sentences into chunks of at most 40 chars: "First fact. Second fact. Third fact."',
          steps: [
            "Split on '.' into sentences and re-add the period: ['First fact.', 'Second fact.', 'Third fact.'].",
            "Start empty. Add 'First fact.' (11 chars) — fits.",
            "Try adding 'Second fact.' -> 'First fact. Second fact.' is 24 chars — still under 40, keep it.",
            "Try adding 'Third fact.' -> would reach 36 chars... but checking the +1 separator pushes past 40, so flush the current chunk and start a new one with 'Third fact.'"
          ],
          output: "['First fact. Second fact.', 'Third fact.']"
        }
      ],
      comparison_tables: [
        {
          title: "fixed-size vs. semantic chunking",
          columns: ["Aspect", "Fixed-size (word count)", "Semantic (sentence/paragraph)"],
          rows: [
            { cells: ["Split point", "Every N words, anywhere", "On natural boundaries"] },
            { cells: ["Risk", "Slices mid-sentence", "Keeps ideas intact"] },
            { cells: ["Implementation", "Trivial — slice a list", "Needs sentence detection"] },
            { cells: ["Retrieval quality", "Lower, needs overlap", "Higher, context survives"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good chunk size vs. a problem",
          bins: [
            { id: "good", label: "Reasonable chunk" },
            { id: "bad", label: "Likely a problem" }
          ],
          items: [
            { id: "i1", text: "One paragraph, ~200 words", bin: "good" },
            { id: "i2", text: "A whole 50-page PDF as one chunk", bin: "bad" },
            { id: "i3", text: 'A 4-word fragment: "it costs $4.2M"', bin: "bad" },
            { id: "i4", text: "A few related sentences, ~120 words", bin: "good" },
            { id: "i5", text: "Half a sentence cut at a boundary", bin: "bad" },
            { id: "i6", text: "A complete section under a heading", bin: "good" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain in one or two sentences why both too-big and too-small chunks hurt retrieval, but for opposite reasons.",
          sampleAnswer: "Too-big chunks mix many topics, so similarity search can't tell what they're really about and you waste tokens shipping irrelevant text. Too-small chunks strip a sentence away from the context that gives it meaning, so even a perfect match retrieves something unusable."
        }
      ],
      hints: [
        "Split the text into a list of words first with text.split().",
        "step = size - overlap. Loop start over range(0, len(words), step) and slice words[start:start+size].",
        "Break out of the loop once start + size reaches or passes the end, so you don't emit empty trailing chunks."
      ],
      challenge_title: "The Sentence-Safe Chunker",
      challenge_description: "Pack a document into the fewest chunks possible without ever splitting a sentence across a chunk boundary.",
      challenge_story: "Your RAG ingestion pipeline keeps retrieving garbage. The culprit: a naive fixed-width chunker that guillotines sentences mid-thought, so half a fact lands in one chunk and half in another — and neither matches the query. You're rewriting the chunker to respect **sentence boundaries**. It splits the document on periods, then greedily packs whole sentences into each chunk up to a character budget, so every chunk is a clean set of complete sentences. Fewer, cleaner chunks mean sharper retrieval.",
      challenge_statement: "You are given a character budget `max_chars` and a single line of `text`. Split the text into sentences by splitting on `.`, dropping empty pieces, trimming surrounding whitespace, and re-attaching a single `.` to each sentence.\n\nGreedily build chunks: start a new chunk with the first sentence; for each following sentence, append it to the current chunk (joined by a single space) **only if** the resulting chunk length would be `≤ max_chars`; otherwise close the current chunk and start a new one with that sentence.\n\nA single sentence longer than `max_chars` becomes its own chunk on its own (it cannot be split further).\n\nReport the number of chunks, then each chunk prefixed by its character length.",
      challenge_input_format: "Line 1: an integer `max_chars`.\nLine 2: the document text on a single line.",
      challenge_output_format: "Line 1: the number of chunks `C`.\nThe next `C` lines each describe one chunk in order, formatted as `LEN|CHUNK` where `LEN` is the chunk's character length and `CHUNK` is the chunk text.",
      challenge_constraints: [
        "1 ≤ max_chars ≤ 2000",
        "The text line has at most 5000 characters.",
        "Sentences are separated by `.`; there is no other terminator.",
        "Chunk length is measured after joining sentences with single spaces.",
      ],
      challenge_examples: [
        { input: "40\nFirst fact here. Second fact here. Third fact here. Fourth fact.", output: "2\n34|First fact here. Second fact here.\n29|Third fact here. Fourth fact.", explanation: "\"First... Second...\" is 34 chars (≤40). Adding \"Third fact here.\" would exceed 40, so a new chunk starts. The last two sentences fit in 29 chars." },
        { input: "10\nThis one sentence is quite long indeed.", output: "1\n39|This one sentence is quite long indeed.", explanation: "The single sentence is 39 chars, longer than the 10-char budget, so it stands alone as its own chunk." },
      ],
      challenge_notes: "Real chunkers add 10–20% overlap between chunks as insurance against facts split across boundaries; here we keep it boundary-aligned for a clean, deterministic result. Watch the join math: a chunk of length `len(current)` plus a space plus the next sentence costs `len(current) + 1 + len(s)` characters.",
      challenge_hints: [
        "Build sentences with `[p.strip() + '.' for p in text.split('.') if p.strip()]`.",
        "Track `current` as a string; when empty, the first sentence always starts it (even if oversized).",
        "Only append when `len(current) + 1 + len(s) <= max_chars`; otherwise flush `current` and reset.",
        "Don't forget to flush the final non-empty `current` after the loop.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0].strip())
    text = data[1] if len(data) > 1 else ""
    sentences = [p.strip() + "." for p in text.split(".") if p.strip()]
    chunks = []
    current = ""
    # TODO: greedily pack whole sentences into chunks of length <= max_chars.

    print(len(chunks))
    for c in chunks:
        print(f"{len(c)}|{c}")

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0].strip())
    text = data[1] if len(data) > 1 else ""
    sentences = [p.strip() + "." for p in text.split(".") if p.strip()]
    chunks = []
    current = ""
    for s in sentences:
        if current == "":
            current = s
        elif len(current) + 1 + len(s) <= max_chars:
            current = current + " " + s
        else:
            chunks.append(current)
            current = s
    if current:
        chunks.append(current)

    print(len(chunks))
    for c in chunks:
        print(f"{len(c)}|{c}")

main()
`,
      challenge_test_cases: [
        { input: "40\nFirst fact here. Second fact here. Third fact here. Fourth fact.", expected_output: "2\n34|First fact here. Second fact here.\n29|Third fact here. Fourth fact.", description: "Example 1: four sentences pack into two 40-char-bounded chunks." },
        { input: "10\nThis one sentence is quite long indeed.", expected_output: "1\n39|This one sentence is quite long indeed.", description: "Example 2: an oversized single sentence becomes its own chunk." },
        { input: "50\nOnly one.", expected_output: "1\n9|Only one.", description: "Edge case: a single short sentence produces exactly one chunk." }
      ]
    },
    {
      id: "ai-07-l3",
      project_id: "ai-07",
      order: 3,
      title: "Embeddings and the Vector Store",
      concept: "Embeddings",
      xp_reward: 10,
      explanation: `You've got chunks. Now: when a user asks "How was revenue growth?", how do you find the chunk that answers it?

Keyword matching won't cut it. The question says "revenue growth" but the relevant chunk might say "earnings increased" — zero word overlap, same meaning. You need to search by **meaning**, not by exact words. That's what embeddings give you.

## An embedding is a list of numbers that captures meaning

An embedding model turns a piece of text into a vector — a fixed-length list of floats. The magic property: texts with similar *meaning* land close together in that number-space, even if they share no words. "Revenue growth" and "earnings increased" point in nearly the same direction; "office dog" points somewhere else entirely.

Real embedding models (the production kind) output vectors with hundreds or thousands of dimensions, trained on huge text corpora. The principle is identical to the toy version you'll build here, which just counts keyword occurrences into a small vector.

## Measuring closeness: cosine similarity

To find the closest chunk, you measure the angle between two vectors. **Cosine similarity** does this: 1.0 means pointing the same direction (very similar), 0.0 means perpendicular (unrelated).

\`\`\`python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)
\`\`\`

Why the angle and not raw distance? Because it ignores length. A long chunk and a short query can still be a perfect match in meaning — cosine cares about *direction*, not magnitude.

## The vector store

A vector store is just: every chunk, paired with its embedding. To answer a query you:

1. Embed the query.
2. Compute cosine similarity against every stored chunk vector.
3. Return the top few highest-scoring chunks.

\`\`\`python
scores = {cid: cosine_similarity(q_vec, v) for cid, v in vectors.items()}
ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

In production you'd reach for a real vector database (Pinecone, Chroma, pgvector) that does this similarity search across millions of vectors fast, with indexes. But it's the exact same three steps — embed, compare, rank. Build it by hand once and the libraries stop being magic.`,
      key_terms: [
        { term: "Embedding", definition: "A fixed-length vector of floats representing the meaning of text, where similar meanings produce nearby vectors." },
        { term: "Cosine similarity", definition: "A score from -1 to 1 measuring the angle between two vectors; near 1 means very similar meaning, near 0 means unrelated." },
        { term: "Vector store", definition: "A collection of chunks paired with their embeddings, searched by similarity to a query embedding." },
        { term: "Semantic search", definition: "Finding text by meaning rather than exact keywords, powered by comparing embeddings." }
      ],
      callouts: [
        { type: "analogy", title: "A map of meaning", content: "Picture every chunk as a pin on a map where nearby pins mean similar things. Embedding the query drops a new pin; you just grab the closest existing pins. Cosine similarity is your ruler.", position: "before" },
        { type: "insight", title: "Why direction beats distance", content: "Cosine compares the angle between vectors, not their length. That's why a one-line query can perfectly match a long paragraph — same direction in meaning-space, different magnitude.", position: "after" }
      ],
      concept_diagram: {
        title: "Semantic search with embeddings",
        steps: [
          { label: "Embed each chunk", desc: "Convert every stored chunk into a vector once, up front." },
          { label: "Embed the query", desc: "Turn the user's question into a vector the same way." },
          { label: "Score with cosine", desc: "Compare the query vector to every chunk vector." },
          { label: "Rank by score", desc: "Sort chunks from most to least similar." },
          { label: "Return the top matches", desc: "Hand the best few chunks to the next stage." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a cosine similarity near 1.0 between two embeddings indicate?",
          options: [
            "The two texts have very similar meaning",
            "The two texts are exactly the same length",
            "The two texts share no words at all"
          ],
          correct_index: 0,
          explanation: "Cosine near 1.0 means the vectors point almost the same direction, which embeddings map to similar meaning."
        }
      ],
      quiz_questions: [
        {
          question: "Why is semantic (embedding) search better than keyword matching for retrieval?",
          options: [
            "It matches by meaning, so 'revenue growth' can find a chunk that says 'earnings increased'",
            "It's faster because it skips reading the text",
            "It never returns more than one result",
            "It only works when the query and chunk share identical words"
          ],
          correct_index: 0,
          explanation: "Embeddings place similar meanings near each other, so matching survives different wording — something keyword search can't do."
        },
        {
          question: "Why does cosine similarity use the angle between vectors rather than raw distance?",
          options: [
            "It ignores length, so a short query can still perfectly match a long chunk of the same meaning",
            "Angles are cheaper to compute than distances",
            "Distance can't be calculated for vectors over 3 dimensions",
            "It guarantees every score is a whole number"
          ],
          correct_index: 0,
          explanation: "Cosine measures direction, not magnitude, so differences in text length don't distort the meaning match."
        },
        {
          question: "What are the three steps to answer a query against a vector store?",
          options: [
            "Embed the query, compute similarity to every stored vector, return the top matches",
            "Chunk the query, translate it, then summarize it",
            "Retrain the embedding model, re-index, then sort alphabetically",
            "Lower the temperature, raise max_tokens, then stream"
          ],
          correct_index: 0,
          explanation: "Embed, compare, rank — the same loop whether you write it by hand or use Pinecone, Chroma, or pgvector."
        }
      ],
      participation_activities: [
        {
          activity_title: "Embeddings check",
          questions: [
            { question: "Two sentences with no words in common can still have a high cosine similarity if their meanings are close.", type: "true_false", correct_answer: "true", explanation: "Embeddings capture meaning, so synonymous phrasing lands nearby in vector space regardless of shared words." },
            { question: "A collection of chunks paired with their embeddings, searched by similarity, is called a vector ______.", type: "fill_in", correct_answer: "store", explanation: "A vector store (or vector database) holds the embeddings and serves similarity search." }
          ]
        }
      ],
      starter_code: `import math

# Toy embedding: count occurrences of each vocab word into a vector.
def embed(text):
    vocab = ["revenue", "dog", "office", "growth", "profit", "pet"]
    text = text.lower()
    return [float(text.count(word)) for word in vocab]

store = {
    "doc1": "Quarterly revenue and profit growth update",
    "doc2": "Our office dog is a friendly pet",
}

# TODO: write cosine_similarity(a, b).
# TODO: embed every doc, embed the query, score each doc, and print the ranking.
query = "How was revenue growth?"
`,
      solution_code: `import math

def embed(text):
    vocab = ["revenue", "dog", "office", "growth", "profit", "pet"]
    text = text.lower()
    return [float(text.count(word)) for word in vocab]

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

store = {
    "doc1": "Quarterly revenue and profit growth update",
    "doc2": "Our office dog is a friendly pet",
}
vectors = {k: embed(v) for k, v in store.items()}

query = "How was revenue growth?"
q_vec = embed(query)

scores = {k: cosine_similarity(q_vec, v) for k, v in vectors.items()}
ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

print(f"Query: {query}")
for doc_id, score in ranked:
    print(f"{doc_id}: {score:.3f}")
print(f"Best match: {ranked[0][0]}")
`,
      expected_output: `Query: How was revenue growth?
doc1: 0.816
doc2: 0.000
Best match: doc1`,
      step_throughs: [
        {
          title: "query → embed → score → rank",
          steps: [
            { label: "Embed every chunk once", detail: "Convert each stored chunk into a vector up front and keep it.", code: 'doc1 -> [1, 0, 0, 1, 1, 0]' },
            { label: "Embed the query", detail: "Turn the user's question into a vector the exact same way.", code: '"revenue growth?" -> [1, 0, 0, 1, 0, 0]' },
            { label: "Score with cosine", detail: "Measure the angle between the query vector and each chunk vector — direction, not length.", code: 'cosine(q, doc1) = 0.816' },
            { label: "Rank and return", detail: "Sort highest-to-lowest and hand back the top matches.", code: 'best match -> doc1' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Two unit vectors point the same way: a = [1, 0], b = [1, 0]. What is their cosine similarity?',
          steps: [
            "Dot product = (1)(1) + (0)(0) = 1.",
            "Magnitude of a = sqrt(1 + 0) = 1; magnitude of b = 1.",
            "Cosine = dot / (mag_a * mag_b) = 1 / (1 * 1) = 1.0.",
            "A score of 1.0 means identical direction — the closest possible match."
          ],
          output: "1.0 (maximally similar)"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'Query "revenue growth" embeds to [1, 0, 0, 1] and doc "earnings increased" embeds to [0, 1, 1, 0] (no shared keywords). Will keyword search find it? Will embeddings?',
          steps: [
            "Keyword search compares raw words: 'revenue growth' vs 'earnings increased' share zero words, so keyword match = 0.",
            "But a real embedding model maps both phrases near each other in meaning-space because they mean the same thing.",
            "Cosine on those true embeddings would be high even though the toy keyword-count vectors above show 0.",
            "Lesson: keyword search misses synonyms; embedding search captures meaning, which is why RAG uses it."
          ],
          output: "Keyword search: miss. Embedding search: match."
        }
      ],
      comparison_tables: [
        {
          title: "keyword search vs. semantic (embedding) search",
          columns: ["Aspect", "Keyword search", "Embedding search"],
          rows: [
            { cells: ["Matches on", "Exact words", "Meaning"] },
            { cells: ['"revenue growth" finds "earnings increased"', "No", "Yes"] },
            { cells: ["Handles synonyms / paraphrase", "Poorly", "Well"] },
            { cells: ["Right tool for RAG retrieval", "Rarely enough", "Yes"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "high similarity vs. low similarity",
          bins: [
            { id: "high", label: "High cosine (close in meaning)" },
            { id: "low", label: "Low cosine (unrelated)" }
          ],
          items: [
            { id: "i1", text: '"revenue growth" vs "earnings increased"', bin: "high" },
            { id: "i2", text: '"office dog" vs "quarterly profit"', bin: "low" },
            { id: "i3", text: '"refund policy" vs "money-back terms"', bin: "high" },
            { id: "i4", text: '"shipping times" vs "password reset"', bin: "low" },
            { id: "i5", text: '"car" vs "automobile"', bin: "high" },
            { id: "i6", text: '"banana" vs "database index"', bin: "low" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Why does cosine similarity care about the angle between vectors instead of the straight-line distance? Answer in one or two sentences.",
          sampleAnswer: "Angle measures direction, which is what carries meaning, while ignoring magnitude. That way a one-line query and a long paragraph that mean the same thing still score as a near-perfect match, even though their raw lengths (and distances) differ a lot."
        }
      ],
      hints: [
        "Cosine = dot product divided by (magnitude of a times magnitude of b). Guard against divide-by-zero by returning 0.0 when either magnitude is 0.",
        "Build a vectors dict once by embedding every doc, then embed the query separately.",
        "Sort scores.items() by the score with key=lambda x: x[1] and reverse=True to rank highest first."
      ],
      challenge_title: "The Vector-Store Retriever",
      challenge_description: "Embed a query and pull the k nearest document vectors by cosine similarity — the core retrieval call of every RAG system.",
      challenge_story: "You're building the retrieval engine at the heart of your RAG stack. Every document chunk has already been turned into an embedding vector and stored in a vector store. When a question arrives, you embed it too, then find the chunks whose vectors point in the most similar *direction* — because in embedding space, direction means meaning. Cosine similarity is your ruler. Ship the function that, given the query vector and the store, returns the top-k chunk IDs to stuff into the prompt.",
      challenge_statement: "You are given `N` document vectors (each a `D`-dimensional list of floats with a string ID) and a single `D`-dimensional query vector. Score each document against the query with **cosine similarity**:\n\n`cos(a, b) = (a · b) / (||a|| · ||b||)`, where a vector with zero magnitude scores `0.0`.\n\nReturn the top `k` documents ranked by similarity, **highest first**. Break ties between equal scores by ID in ascending lexicographic order.",
      challenge_input_format: "Line 1: three integers `N D k`.\nThe next `N` lines each contain a document: an ID token followed by `D` floats.\nThe final line contains `D` floats — the query vector.",
      challenge_output_format: "`k` lines (or fewer if `N < k`). Each line is `ID SCORE`, where `SCORE` is the cosine similarity formatted to exactly 4 decimal places. Lines are ordered by descending score, ties broken by ascending ID.",
      challenge_constraints: [
        "1 ≤ N ≤ 5000",
        "1 ≤ D ≤ 256",
        "1 ≤ k ≤ N",
        "Vector components are floats in the range [-1000, 1000].",
        "IDs are non-empty tokens with no spaces.",
      ],
      challenge_examples: [
        { input: "3 2 2\na 1.0 0.0\nb 0.0 1.0\nc 1.0 1.0\n1.0 0.0", output: "a 1.0000\nc 0.7071", explanation: "`a` is identical to the query (cos = 1.0). `c` sits at 45° (cos ≈ 0.7071). `b` is perpendicular (0.0) and falls outside the top 2." },
        { input: "3 2 2\nz 1.0 0.0\na 1.0 0.0\nb 0.0 1.0\n1.0 0.0", output: "a 1.0000\nz 1.0000", explanation: "Both `a` and `z` tie at cos = 1.0; the tie is broken by ascending ID, so `a` comes before `z`." },
      ],
      challenge_notes: "Cosine compares the *angle* between vectors, not their length — which is why a one-line query can perfectly match a long paragraph. Guard against zero-magnitude vectors (return 0.0) so you never divide by zero. Deterministic tie-breaking by ID keeps the output reproducible across runs.",
      challenge_hints: [
        "Compute dot product with `sum(x*y for x, y in zip(a, b))` and magnitude with `math.sqrt(sum(x*x for x in a))`.",
        "If either magnitude is 0, the similarity is 0.0.",
        "Sort with key `lambda t: (-t[1], t[0])` to get descending score then ascending ID.",
        "Format each score with `f\"{score:.4f}\"`.",
      ],
      challenge_starter_code: `import sys, math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    ma = math.sqrt(sum(x * x for x in a))
    mb = math.sqrt(sum(y * y for y in b))
    if ma == 0 or mb == 0:
        return 0.0
    return dot / (ma * mb)

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, d, k = map(int, data[idx].split()); idx += 1
    docs = []
    # TODO: read N documents (ID + D floats) and the query vector,
    # score each doc, sort by (-score, ID), and print the top k as "ID SCORE".

    print("")  # replace with your output loop

main()
`,
      challenge_solution_code: `import sys, math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    ma = math.sqrt(sum(x * x for x in a))
    mb = math.sqrt(sum(y * y for y in b))
    if ma == 0 or mb == 0:
        return 0.0
    return dot / (ma * mb)

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, d, k = map(int, data[idx].split()); idx += 1
    docs = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        doc_id = parts[0]
        vec = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vec))
    query = list(map(float, data[idx].split()[:d])); idx += 1

    scored = [(doc_id, cosine(query, v)) for doc_id, v in docs]
    scored.sort(key=lambda t: (-t[1], t[0]))
    for doc_id, score in scored[:k]:
        print(f"{doc_id} {score:.4f}")

main()
`,
      challenge_test_cases: [
        { input: "3 2 2\na 1.0 0.0\nb 0.0 1.0\nc 1.0 1.0\n1.0 0.0", expected_output: "a 1.0000\nc 0.7071", description: "Example 1: identical vector ranks first, 45° vector second." },
        { input: "3 2 2\nz 1.0 0.0\na 1.0 0.0\nb 0.0 1.0\n1.0 0.0", expected_output: "a 1.0000\nz 1.0000", description: "Example 2: tied scores broken by ascending ID." },
        { input: "2 2 1\na 1.0 0.0\nb 0.0 1.0\n0.0 0.0", expected_output: "a 0.0000", description: "Edge case: a zero-magnitude query scores every doc 0.0; tie broken by ID picks 'a'." }
      ]
    },
    {
      id: "ai-07-l4",
      project_id: "ai-07",
      order: 4,
      title: "Assembling the RAG Pipeline",
      concept: "Pipeline",
      xp_reward: 10,
      explanation: `You have the pieces: chunk, embed, store, search. Now you wire them into one flow and — critically — build the prompt that turns retrieved text into a grounded answer.

## The end-to-end flow

\`\`\`
question -> retrieve top chunks -> build prompt with context -> send to LLM -> answer
\`\`\`

Everything before "send to LLM" you already know how to do. The new skill is the **prompt assembly** in the middle. This is where most RAG systems quietly fail, so it earns real attention.

## A good RAG prompt does three jobs

1. **Supplies the context.** Paste the retrieved chunks in clearly, usually as a labeled block.
2. **Constrains the model to it.** Tell it, in plain words, to answer using *only* the provided context.
3. **Gives it an out.** Tell it to say "I don't know" when the context doesn't contain the answer. Without this, the model falls back to guessing — the exact hallucination you're trying to kill.

\`\`\`python
def build_prompt(query, chunks):
    context = "\\n".join(f"- {text}" for _, text in chunks)
    return (
        "Answer the question using ONLY the context below. "
        "If the answer is not in the context, say you don't know.\\n\\n"
        f"Context:\\n{context}\\n\\n"
        f"Question: {query}"
    )
\`\`\`

That "say you don't know" instruction is not optional polish. It's the safety valve. A RAG system that admits ignorance is trustworthy; one that bluffs when retrieval misses is worse than no system at all.

## Why retrieval and prompting are partners

Retrieval decides *what* the model sees. Prompting decides *how* it's allowed to use it. Get retrieval right but write a sloppy prompt, and the model wanders off into its training memory. Write a tight prompt but retrieve the wrong chunks, and it confidently answers from irrelevant text. You need both.

## Format matters

Notice the prompt labels the context block and separates it from the question. Models follow structure. A wall of undifferentiated text invites the model to blur the line between "given context" and "the actual question." Clear sections — \`Context:\` then \`Question:\` — keep those roles distinct.

In the next lesson you'll plug a real Claude API call onto the end of this pipeline. For now, get the assembly right: retrieve, then build a prompt that grounds and constrains. That prompt *is* your RAG system's quality.`,
      key_terms: [
        { term: "Pipeline", definition: "The ordered RAG flow: retrieve relevant chunks, build a context-grounded prompt, send to the LLM, return the answer." },
        { term: "Prompt assembly", definition: "Combining the user's question with retrieved context into a single, well-structured prompt the model can answer from." },
        { term: "Grounding instruction", definition: "The directive telling the model to answer only from the supplied context, not from its training memory." },
        { term: "Fallback / I-don't-know", definition: "An explicit instruction for the model to admit it can't answer when the context lacks the information, preventing a bluffed guess." }
      ],
      callouts: [
        { type: "analogy", title: "Briefing a witness", content: "A lawyer hands a witness the relevant document and says 'answer only from this, and if it's not in here, say so.' That's your RAG prompt. The context is the document; the instruction keeps the witness from speculating.", position: "before" },
        { type: "warning", title: "Always give the model an out", content: "If your prompt doesn't permit 'I don't know,' the model will invent an answer whenever retrieval misses. The escape hatch is what makes a RAG system safe to ship.", position: "after" }
      ],
      concept_diagram: {
        title: "The RAG request lifecycle",
        steps: [
          { label: "Receive question", desc: "The user asks something." },
          { label: "Retrieve chunks", desc: "Embed + search the vector store for the top matches." },
          { label: "Build the prompt", desc: "Label the context, add the question, add the grounding + I-don't-know instruction." },
          { label: "Call the LLM", desc: "Send the assembled prompt to the model." },
          { label: "Return grounded answer", desc: "The model answers from context, or admits it doesn't know." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why include an explicit 'say you don't know' instruction in a RAG prompt?",
          options: [
            "So the model admits ignorance instead of bluffing when retrieval misses",
            "To make the response shorter on average",
            "Because the API rejects prompts without it"
          ],
          correct_index: 0,
          explanation: "Without an out, the model guesses whenever the context lacks the answer — reintroducing hallucination. The instruction is the safety valve."
        }
      ],
      quiz_questions: [
        {
          question: "What are the three jobs of a well-built RAG prompt?",
          options: [
            "Supply the context, constrain the model to it, and allow an 'I don't know' fallback",
            "Lower temperature, raise max_tokens, and enable streaming",
            "Translate, summarize, and reformat the question",
            "Embed, chunk, and re-rank the documents"
          ],
          correct_index: 0,
          explanation: "Context + grounding constraint + an honest escape hatch together produce trustworthy, grounded answers."
        },
        {
          question: "Retrieval and prompting are described as partners. Why?",
          options: [
            "Retrieval decides what the model sees; prompting decides how it's allowed to use it — both must be right",
            "They are the same step with different names",
            "Prompting replaces retrieval once you have enough data",
            "Retrieval only matters when the prompt is empty"
          ],
          correct_index: 0,
          explanation: "Good retrieval with a sloppy prompt lets the model wander; a tight prompt over wrong chunks answers from junk. You need both correct."
        },
        {
          question: "Why label the context block and separate it from the question in the prompt?",
          options: [
            "Clear structure keeps the model from blurring 'given context' and 'the question' — models follow structure",
            "It reduces the token count of the request",
            "The API requires a 'Context:' header",
            "It makes embeddings more accurate"
          ],
          correct_index: 0,
          explanation: "Distinct, labeled sections preserve the roles of context vs. question; a wall of text invites the model to confuse them."
        }
      ],
      participation_activities: [
        {
          activity_title: "Pipeline order",
          questions: [
            { question: "In a RAG pipeline, you build the prompt before retrieving the relevant chunks.", type: "true_false", correct_answer: "false", explanation: "You retrieve first — the retrieved chunks are what you put into the prompt's context block." },
            { question: "The prompt directive that tells the model to answer using only the supplied context is the ______ instruction.", type: "fill_in", correct_answer: "grounding", explanation: "The grounding instruction constrains the model to the provided context instead of its training memory." }
          ]
        }
      ],
      starter_code: `import math

def embed(text):
    vocab = ["return", "refund", "shipping", "warranty", "password"]
    text = text.lower()
    return [float(text.count(w)) for w in vocab]

def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    ma = math.sqrt(sum(x*x for x in a))
    mb = math.sqrt(sum(y*y for y in b))
    return dot/(ma*mb) if ma and mb else 0.0

KB = {
    "policy1": "You can return any item within 30 days for a full refund.",
    "policy2": "Standard shipping takes 5 to 7 business days.",
    "policy3": "Reset your password from the account settings page.",
}
index = {k: embed(v) for k, v in KB.items()}

# TODO: write retrieve(query, k=2) -> list of (doc_id, text) top matches.
# TODO: write build_prompt(query, chunks) with a grounding + I-don't-know instruction.
# Retrieve for the query below, build the prompt, and print it.
query = "How long do I have to return something for a refund?"
`,
      solution_code: `import math

def embed(text):
    vocab = ["return", "refund", "shipping", "warranty", "password"]
    text = text.lower()
    return [float(text.count(w)) for w in vocab]

def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    ma = math.sqrt(sum(x*x for x in a))
    mb = math.sqrt(sum(y*y for y in b))
    return dot/(ma*mb) if ma and mb else 0.0

KB = {
    "policy1": "You can return any item within 30 days for a full refund.",
    "policy2": "Standard shipping takes 5 to 7 business days.",
    "policy3": "Reset your password from the account settings page.",
}
index = {k: embed(v) for k, v in KB.items()}

def retrieve(query, k=2):
    q = embed(query)
    scored = sorted(KB, key=lambda d: cosine(q, index[d]), reverse=True)
    return [(d, KB[d]) for d in scored[:k]]

def build_prompt(query, chunks):
    context = "\\n".join(f"- {text}" for _, text in chunks)
    return (
        "Answer the question using ONLY the context below. "
        "If the answer is not in the context, say you don't know.\\n\\n"
        f"Context:\\n{context}\\n\\n"
        f"Question: {query}"
    )

query = "How long do I have to return something for a refund?"
chunks = retrieve(query)
prompt = build_prompt(query, chunks)
print("Retrieved:", [d for d, _ in chunks])
print("---")
print(prompt)
`,
      expected_output: `Retrieved: ['policy1', 'policy2']
---
Answer the question using ONLY the context below. If the answer is not in the context, say you don't know.

Context:
- You can return any item within 30 days for a full refund.
- Standard shipping takes 5 to 7 business days.

Question: How long do I have to return something for a refund?`,
      step_throughs: [
        {
          title: "retrieve → stuff context → constrain → grounded answer",
          steps: [
            { label: "Retrieve top chunks", detail: "Embed the question and pull the best-matching passages from the store.", code: 'retrieve(query, k=2) -> [policy1, policy2]' },
            { label: "Stuff them into context", detail: "Format the chunks as a clearly labeled context block.", code: 'Context:\\n- You can return any item within 30 days...' },
            { label: "Add the grounding rules", detail: "Tell the model to answer using ONLY the context, and to admit when it can't.", code: '"...if not in the context, say you don\'t know."' },
            { label: "Send → grounded answer", detail: "The assembled prompt goes to the LLM, which answers from the supplied text.", code: 'Question: How long to return for a refund?' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'A RAG prompt includes context and the question but forgets the "say you don\'t know" line. The retrieved chunks don\'t contain the answer. What happens?',
          steps: [
            "The model is built to continue text, and 'I don't know' is an unlikely continuation after a question.",
            "Without an explicit out, it falls back to its training memory to produce a fluent answer.",
            "That answer is ungrounded — the exact hallucination RAG is meant to prevent.",
            "Adding the 'say you don't know' instruction gives the model a permitted escape hatch."
          ],
          output: "Model bluffs a guess instead of admitting the gap"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'Build a prompt from chunks ["Refunds within 30 days.", "Ships in 5-7 days."] for the question "What is the refund window?". What are the three required parts?',
          steps: [
            "Part 1 — context: join the chunks into a labeled block ('Context:\\n- Refunds within 30 days.\\n- Ships in 5-7 days.').",
            "Part 2 — constraint: 'Answer the question using ONLY the context below.'",
            "Part 3 — fallback: 'If the answer is not in the context, say you don't know.'",
            "Append the question last on its own line so its role stays distinct from the context."
          ],
          output: "A prompt with labeled context + constraint + I-don't-know + question"
        }
      ],
      comparison_tables: [
        {
          title: "grounded prompt vs. naive prompt",
          columns: ["Prompt element", "Naive prompt", "Grounded RAG prompt"],
          rows: [
            { cells: ["Includes retrieved context", "No", "Yes, labeled"] },
            { cells: ['Says "use ONLY this context"', "No", "Yes"] },
            { cells: ['Allows "I don\'t know"', "No", "Yes"] },
            { cells: ["Result when retrieval misses", "Hallucinates", "Admits the gap"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good RAG prompt ingredient vs. anti-pattern",
          bins: [
            { id: "good", label: "Belongs in a RAG prompt" },
            { id: "bad", label: "Anti-pattern" }
          ],
          items: [
            { id: "i1", text: "A labeled Context: block", bin: "good" },
            { id: "i2", text: '"Answer using only the context"', bin: "good" },
            { id: "i3", text: '"Say you don\'t know if it\'s not here"', bin: "good" },
            { id: "i4", text: "Context and question mashed into one paragraph", bin: "bad" },
            { id: "i5", text: '"Use your best judgment if unsure"', bin: "bad" },
            { id: "i6", text: "Question on its own clearly separated line", bin: "good" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Retrieval and prompting are called partners. Explain in your own words what breaks if you get one right but not the other.",
          sampleAnswer: "If retrieval is perfect but the prompt is sloppy, the model ignores the good context and wanders into its training memory. If the prompt is tight but retrieval pulled the wrong chunks, the model obediently answers from irrelevant text. The answer is only trustworthy when both the right context and the right instructions line up."
        }
      ],
      hints: [
        "retrieve should embed the query, sort KB keys by cosine similarity descending, and return the top k as (id, text) tuples.",
        "build_prompt joins the chunk texts into a labeled 'Context:' block, then appends 'Question:' on its own line.",
        "Include both the 'use ONLY the context' constraint and the 'say you don't know' fallback in the prompt string."
      ],
      challenge_title: "Assemble the RAG Pipeline",
      challenge_description: "Wire retrieval to prompt: embed the query, pull the top-k chunks, and stuff them into a grounded user message ready for the model.",
      challenge_story: "Retrieval and chunking are done; now you connect them. You're the engineer who owns the **pipeline glue** — the step that turns a raw question into a model-ready prompt. The query gets embedded, the vector store returns its closest chunks, and you stitch those chunks into a single grounded message: context up top, the question below, and a firm instruction to answer *only* from what's provided. Get this assembly exactly right and the model stops hallucinating; get it sloppy and even perfect retrieval is wasted.",
      challenge_statement: "Build the full retrieve-then-prompt step. You are given `N` chunks — each with an ID, a `D`-dimensional embedding, and its text — plus a question and its query embedding.\n\n1. Rank the chunks by **cosine similarity** to the query (zero magnitude → 0.0), highest first, ties broken by ascending ID.\n2. Take the top `k` chunk IDs **in ranked order**.\n3. Join those chunks' texts (in ranked order) with a blank line between them to form the context block.\n4. Build a single user message with this exact body:\n\n```\nContext:\n<context>\n\nQuestion: <query>\n\nAnswer using only the context above. If the answer is not in the context, say \"I don't know.\"\n```",
      challenge_input_format: "Line 1: three integers `N D k`.\nThen `N` chunk blocks, each spanning 3 lines: the ID, then `D` floats, then the chunk text.\nNext line: the question text.\nFinal line: `D` floats — the query embedding.",
      challenge_output_format: "Line 1: the number of chunks selected `C` (= min(k, N)).\nLine 2: the selected chunk IDs in ranked order, space-separated.\nLine 3: `CHARS ` followed by the integer character length of the assembled user-message content.\nLine 4: a literal `---` separator.\nThe remaining lines: the full assembled user-message content.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "1 ≤ D ≤ 256",
        "1 ≤ k ≤ N",
        "Chunk texts and the question are single lines up to 1000 characters.",
        "The context joins selected chunks with a single blank line (`\\n\\n`).",
      ],
      challenge_examples: [
        { input: "3 2 2\nc1\n1.0 0.0\nParis is the capital of France.\nc2\n0.0 1.0\nThe Eiffel Tower is in Paris.\nc3\n0.9 0.1\nFrance is in Europe.\nWhat is the capital of France?\n1.0 0.0", output: "2\nc1 c3\nCHARS 199\n---\nContext:\nParis is the capital of France.\n\nFrance is in Europe.\n\nQuestion: What is the capital of France?\n\nAnswer using only the context above. If the answer is not in the context, say \"I don't know.\"", explanation: "c1 (cos 1.0) and c3 (cos ≈ 0.995) rank above c2 (cos 0.0). Their texts are joined with a blank line; the final message is 199 characters." },
      ],
      challenge_notes: "The 'answer only from the context, else say I don't know' instruction is the safety valve of RAG — without an explicit out, the model invents an answer whenever retrieval misses. Reuse your cosine-similarity ranking from the previous lesson; the only new work is assembling the prompt string exactly.",
      challenge_hints: [
        "Parse each chunk block as three consecutive lines: ID, vector, text.",
        "Rank with key `lambda t: (-score, id)` and slice the first k.",
        "Join the selected texts in ranked order with `\"\\n\\n\".join(...)`.",
        "Build the content with an f-string, then print its `len(...)` after the `CHARS ` prefix.",
      ],
      challenge_starter_code: `import sys, math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    ma = math.sqrt(sum(x * x for x in a))
    mb = math.sqrt(sum(y * y for y in b))
    if ma == 0 or mb == 0:
        return 0.0
    return dot / (ma * mb)

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, d, k = map(int, data[idx].split()); idx += 1
    vecs, texts = {}, {}
    # TODO: read N chunk blocks (ID, vector, text), then the question and query vector.
    # Rank by cosine, take top-k IDs in order, join their texts, build the user message.

main()
`,
      challenge_solution_code: `import sys, math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    ma = math.sqrt(sum(x * x for x in a))
    mb = math.sqrt(sum(y * y for y in b))
    if ma == 0 or mb == 0:
        return 0.0
    return dot / (ma * mb)

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, d, k = map(int, data[idx].split()); idx += 1
    vecs, texts = {}, {}
    for _ in range(n):
        cid = data[idx].strip(); idx += 1
        vecs[cid] = list(map(float, data[idx].split()[:d])); idx += 1
        texts[cid] = data[idx]; idx += 1
    query = data[idx]; idx += 1
    qvec = list(map(float, data[idx].split()[:d])); idx += 1

    scored = [(cid, cosine(qvec, vecs[cid])) for cid in vecs]
    scored.sort(key=lambda t: (-t[1], t[0]))
    top = [cid for cid, _ in scored[:k]]

    context = "\\n\\n".join(texts[cid] for cid in top)
    content = (
        f"Context:\\n{context}\\n\\n"
        f"Question: {query}\\n\\n"
        "Answer using only the context above. "
        "If the answer is not in the context, say \\"I don't know.\\""
    )

    print(len(top))
    print(" ".join(top))
    print(f"CHARS {len(content)}")
    print("---")
    print(content)

main()
`,
      challenge_test_cases: [
        { input: "3 2 2\nc1\n1.0 0.0\nParis is the capital of France.\nc2\n0.0 1.0\nThe Eiffel Tower is in Paris.\nc3\n0.9 0.1\nFrance is in Europe.\nWhat is the capital of France?\n1.0 0.0", expected_output: "2\nc1 c3\nCHARS 199\n---\nContext:\nParis is the capital of France.\n\nFrance is in Europe.\n\nQuestion: What is the capital of France?\n\nAnswer using only the context above. If the answer is not in the context, say \"I don't know.\"", description: "Example 1: top-2 chunks assembled into the grounded user message." },
        { input: "1 1 1\nonly\n5.0\nThe Moon orbits the Earth.\nWhat orbits the Earth?\n2.0", expected_output: "1\nonly\nCHARS 164\n---\nContext:\nThe Moon orbits the Earth.\n\nQuestion: What orbits the Earth?\n\nAnswer using only the context above. If the answer is not in the context, say \"I don't know.\"", description: "Edge case: a single chunk store still assembles a complete grounded message." }
      ]
    },
    {
      id: "ai-07-l5",
      project_id: "ai-07",
      order: 5,
      title: "Wiring in the Claude API",
      concept: "LLM Call",
      xp_reward: 10,
      explanation: `Time to connect the pipeline to a real model. You've retrieved chunks and assembled a grounded prompt. The last step is sending it to Claude and getting the answer back.

## The Messages API call

The Anthropic SDK uses one endpoint for this: \`client.messages.create\`. You pass a model, a token budget, and your messages list — the same list your pipeline built.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
)
print(response.content[0].text)
\`\`\`

A few things to lock in:

- **The key comes from the environment**, never hardcoded — \`os.environ["ANTHROPIC_API_KEY"]\`. A leaked key in source is a real incident, not a style nit.
- **\`messages\` is a list of role/content dicts.** Your RAG prompt goes in as a single user message. That's exactly what \`build_messages\` produced last lesson.
- **The answer is in \`response.content[0].text\`.** The response is a list of content blocks; for a plain text answer you read the first block's \`text\`.

## Put a system prompt to work

You can sharpen grounding by moving the rules into a \`system\` prompt — the model treats system instructions as higher-authority standing rules, separate from the per-question context:

\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system="Answer only from the provided context. If it's not there, say: I don't know.",
    messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"}],
)
\`\`\`

System for the rules, user message for the context and question. Clean separation.

## The whole system, one function

Wrap it all up and you have a document Q&A tool:

\`\`\`python
def answer_question(query, store, client):
    chunks = retrieve(query, store)
    prompt = build_prompt(query, chunks)
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text
\`\`\`

That's RAG end to end: chunk your docs once, embed them into a store, and every question flows through retrieve -> build prompt -> call Claude -> grounded answer.

You've built the thing. It hallucinates far less than a bare model because it answers from *your* documents, and it can say "I don't know" instead of bluffing. From here it's all upgrades — a real embedding model, a real vector database, smarter chunking — but the architecture you just built is the architecture the big systems use.`,
      key_terms: [
        { term: "Messages API", definition: "Anthropic's endpoint (client.messages.create) that takes a model, max_tokens, and a messages list, and returns content blocks." },
        { term: "System prompt", definition: "A higher-authority instruction block (the 'system' field) holding standing rules like the grounding constraint, separate from the per-turn user message." },
        { term: "content[0].text", definition: "Where a plain text answer lives in the response — the text of the first content block." },
        { term: "Environment variable", definition: "A value read at runtime (e.g. os.environ['ANTHROPIC_API_KEY']) so secrets stay out of source code." }
      ],
      callouts: [
        { type: "insight", title: "System vs. user, two different jobs", content: "The system prompt holds the unchanging rules ('answer only from context'). The user message holds the changing part (this question, these chunks). Keeping them apart makes the model follow the rules more reliably.", position: "before" },
        { type: "warning", title: "Never hardcode the API key", content: "Read it from os.environ['ANTHROPIC_API_KEY']. A key committed to a repo can be scraped and abused within minutes — treat it like a password, because it is one.", position: "after" }
      ],
      concept_diagram: {
        title: "From question to grounded answer",
        steps: [
          { label: "retrieve(query, store)", desc: "Pull the top matching chunks from the vector store." },
          { label: "build_prompt(...)", desc: "Assemble context + question + grounding instruction." },
          { label: "messages.create(...)", desc: "Send the prompt to Claude via the Messages API." },
          { label: "read content[0].text", desc: "Extract the model's answer from the response." },
          { label: "Return to user", desc: "A grounded answer — or an honest 'I don't know.'" }
        ]
      },
      inline_quizzes: [
        {
          question: "Where do you read a plain text answer from in a Messages API response?",
          options: [
            "response.content[0].text",
            "response.answer",
            "response.messages[-1]"
          ],
          correct_index: 0,
          explanation: "The response holds a list of content blocks; the first block's .text contains the text answer."
        }
      ],
      quiz_questions: [
        {
          question: "How should the Anthropic API key be supplied to the client?",
          options: [
            "Read from an environment variable, e.g. os.environ['ANTHROPIC_API_KEY']",
            "Pasted directly into the source file as a string literal",
            "Sent as the first user message",
            "Stored in the system prompt"
          ],
          correct_index: 0,
          explanation: "Keys belong in environment variables, never in source. A committed key is a security incident."
        },
        {
          question: "What's the advantage of putting the grounding rules in a system prompt instead of the user message?",
          options: [
            "The model treats system instructions as higher-authority standing rules, separate from the per-question context",
            "System prompts are free and don't count as tokens",
            "It lets you skip the messages list entirely",
            "Only system prompts can contain the word 'context'"
          ],
          correct_index: 0,
          explanation: "Separating standing rules (system) from the changing question + context (user) makes the model follow the grounding constraint more reliably."
        },
        {
          question: "In the final answer_question function, what flows into client.messages.create as the messages argument?",
          options: [
            "A single user message containing the retrieved context and the question",
            "The raw documents before chunking",
            "Only the user's question with no context",
            "The embedding vectors of every chunk"
          ],
          correct_index: 0,
          explanation: "The assembled prompt — context plus question — goes in as one user message, which is what the whole pipeline was building toward."
        }
      ],
      participation_activities: [
        {
          activity_title: "Wiring the API",
          questions: [
            { question: "client.messages.create returns the text answer directly as a plain string in response.text.", type: "true_false", correct_answer: "false", explanation: "It returns content blocks; you read response.content[0].text for a plain text answer." },
            { question: "The model id used for these RAG calls is claude-______-4-6.", type: "fill_in", correct_answer: "sonnet", explanation: "The lessons use claude-sonnet-4-6 via the Messages API." }
          ]
        }
      ],
      starter_code: `import os

# Pipeline pieces (simplified retrieval by keyword overlap for this demo).
def retrieve(query, store, k=2):
    scored = sorted(
        store.items(),
        key=lambda kv: sum(w in kv[1].lower() for w in query.lower().split()),
        reverse=True,
    )
    return [text for _, text in scored[:k]]

def build_prompt(query, chunks):
    context = "\\n".join(f"- {c}" for c in chunks)
    return f"Context:\\n{context}\\n\\nQuestion: {query}\\n\\nAnswer from the context only."

# TODO: write answer_question(query, store, client=None).
# Retrieve chunks, build the prompt, and assemble the Messages API request dict
# (model="claude-sonnet-4-6", max_tokens=1024, messages=[...]).
# If client is None, RETURN the request dict (no live LLM in this environment).
# If a client is given, call client.messages.create(**request) and return the text.

STORE = {
    "a": "The refund window is 30 days from delivery.",
    "b": "We ship to over 40 countries worldwide.",
}
`,
      solution_code: `import os

def retrieve(query, store, k=2):
    scored = sorted(
        store.items(),
        key=lambda kv: sum(w in kv[1].lower() for w in query.lower().split()),
        reverse=True,
    )
    return [text for _, text in scored[:k]]

def build_prompt(query, chunks):
    context = "\\n".join(f"- {c}" for c in chunks)
    return f"Context:\\n{context}\\n\\nQuestion: {query}\\n\\nAnswer from the context only."

def answer_question(query, store, client=None):
    chunks = retrieve(query, store)
    prompt = build_prompt(query, chunks)
    request = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}],
    }
    if client is None:
        # No live LLM here — return the request we WOULD send.
        return request
    # With a real client:
    #   client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    msg = client.messages.create(**request)
    return msg.content[0].text

STORE = {
    "a": "The refund window is 30 days from delivery.",
    "b": "We ship to over 40 countries worldwide.",
}

req = answer_question("What is the refund window?", STORE)
print("model:", req["model"])
print("max_tokens:", req["max_tokens"])
print("prompt sent:")
print(req["messages"][0]["content"])
`,
      expected_output: `model: claude-sonnet-4-6
max_tokens: 1024
prompt sent:
Context:
- The refund window is 30 days from delivery.
- We ship to over 40 countries worldwide.

Question: What is the refund window?

Answer from the context only.`,
      step_throughs: [
        {
          title: "prompt → messages.create → read text → answer",
          steps: [
            { label: "Read the key from env", detail: "Pull the API key from the environment, never hardcoded in source.", code: 'Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])' },
            { label: "Build the request", detail: "Pass the model, a token budget, and your assembled prompt as one user message.", code: 'model="claude-sonnet-4-6", max_tokens=1024' },
            { label: "Call the Messages API", detail: "Send the request to Claude and wait for the response object.", code: 'response = client.messages.create(**request)' },
            { label: "Read the answer", detail: "The response is a list of content blocks; the text answer is the first block's .text.", code: 'response.content[0].text' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You call client.messages.create(...) and want the plain text answer. Where do you read it from?",
          steps: [
            "The response is not a bare string — it holds a list of content blocks.",
            "For a normal text answer there is one block of type 'text'.",
            "Index the first block and read its .text attribute.",
            "So the answer lives at response.content[0].text."
          ],
          output: "response.content[0].text"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You want the grounding rules to apply to every question without repeating them. Where should they go, and what stays in the user message?",
          steps: [
            "Standing rules that never change ('answer only from context; else say I don't know') go in the system field.",
            "The model treats system instructions as higher-authority, separate from the turn's content.",
            "The changing parts — this question and these retrieved chunks — go in the user message.",
            "Result: system holds the policy, user holds the data; the model follows the rules more reliably."
          ],
          output: "system = rules; messages = [{role: user, content: context + question}]"
        }
      ],
      comparison_tables: [
        {
          title: "rules in system prompt vs. rules in user message",
          columns: ["Aspect", "Rules in user message", "Rules in system prompt"],
          rows: [
            { cells: ["Authority the model gives them", "Same as the question", "Higher, standing"] },
            { cells: ["Repeated every turn", "Yes, mixed with context", "Defined once"] },
            { cells: ["Separation of rules vs. data", "Blurred", "Clean"] },
            { cells: ["Grounding reliability", "Lower", "Higher"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "secure API practice vs. a security mistake",
          bins: [
            { id: "safe", label: "Secure practice" },
            { id: "risk", label: "Security mistake" }
          ],
          items: [
            { id: "i1", text: 'os.environ["ANTHROPIC_API_KEY"]', bin: "safe" },
            { id: "i2", text: 'api_key="sk-ant-abc123" in the source file', bin: "risk" },
            { id: "i3", text: "Committing a .env with the key to git", bin: "risk" },
            { id: "i4", text: "Reading the key from a secrets manager", bin: "safe" },
            { id: "i5", text: "Pasting the key into a public notebook", bin: "risk" },
            { id: "i6", text: "Loading the key from an environment variable at runtime", bin: "safe" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "You've now built RAG end to end. In your own words, summarize why this architecture hallucinates less than a bare model.",
          sampleAnswer: "Instead of asking the model to recall facts from frozen training memory, RAG retrieves the relevant text from my own documents, stuffs it into the prompt, and constrains the model to answer only from that context, with permission to say 'I don't know.' The model's job shifts from unreliable recall to reliable reading comprehension, and every answer can be traced back to a real source."
        }
      ],
      hints: [
        "Call retrieve then build_prompt, then put the prompt into a single user message inside messages.",
        "Build the request as a dict with model, max_tokens, and messages so you can either return it or splat it into client.messages.create(**request).",
        "When client is None, return the request dict; otherwise read msg.content[0].text after the API call."
      ],
      challenge_title: "Wire the Grounded Claude Request",
      challenge_description: "Build the exact Messages API request your RAG service sends to Claude: grounding rules in the system prompt, context and question in the user message.",
      challenge_story: "Your RAG service is one function away from production. Retrieval works; chunking works; now you have to hand the model a request it can't go off the rails with. The trick the team learned the hard way: put the *unchanging rules* (\"answer only from context; if it's not there, say so\") in the **system** prompt, and the *changing part* (these chunks, this question) in the **user** message. Keep them apart and Claude follows the rules far more reliably. Assemble that request — model, token cap, system, messages — and emit a deterministic fingerprint of it for your request-logging audit.",
      challenge_statement: "Construct an Anthropic Messages API request dict for one grounded RAG call.\n\nGiven `N` context chunks, a `max_tokens` budget, a `model` name, and a question, build:\n\n- `model`: the given model name.\n- `max_tokens`: the given integer.\n- `system`: exactly `You are a Q&A assistant. Answer only from the provided context. If the context lacks the answer, reply exactly: I don't know.`\n- `messages`: a single-element list `[{\"role\": \"user\", \"content\": <user>}]` where `<user>` is `Context:\\n<context>\\n\\nQuestion: <query>` and `<context>` is the chunks joined by single newlines.\n\nThen print a fingerprint of the request so it can be logged deterministically.",
      challenge_input_format: "Line 1: two integers `N max_tokens`.\nLine 2: the `model` name.\nThe next `N` lines: the context chunks, one per line.\nThe final line: the question.",
      challenge_output_format: "Print exactly five lines describing the request:\nLine 1: the model name.\nLine 2: max_tokens.\nLine 3: the character length of the system prompt.\nLine 4: the role of the only message (always `user`).\nLine 5: the character length of that message's content.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "1 ≤ max_tokens ≤ 100000",
        "The model name is a non-empty token without spaces.",
        "Chunks and the question are single lines up to 1000 characters.",
        "The system prompt text is fixed and must match exactly.",
      ],
      challenge_examples: [
        { input: "2 512\nclaude-sonnet-4-6\nAcme was founded by Dale in 1999.\nAcme makes rockets.\nWho founded Acme?", output: "claude-sonnet-4-6\n512\n125\nuser\n91", explanation: "model and max_tokens echo the input. The fixed system prompt is 125 chars. The single user message (Context + both chunks + Question) is 91 chars." },
        { input: "1 256\nclaude-opus-4-1\nThe Moon orbits Earth.\nWhat orbits Earth?", output: "claude-opus-4-1\n256\n125\nuser\n61", explanation: "A different model and token cap pass through; the system length stays 125; the shorter context yields a 61-char user message." },
      ],
      challenge_notes: "The system prompt is the contract; the user message is the payload. Hardcoding the rules in `system` (not in the user turn) is what makes the model reliably refuse to speculate. In real code you'd read `os.environ['ANTHROPIC_API_KEY']` and never hardcode it — but this exercise stays offline and just builds the request, so no key or network is involved.",
      challenge_hints: [
        "Join the chunks with `\"\\n\".join(chunks)` to form the context.",
        "The system prompt is a fixed string — copy it exactly, including the period after `I don't know`.",
        "The user content is `f\"Context:\\n{context}\\n\\nQuestion: {query}\"`.",
        "Print `len(system)` and `len(content)` to fingerprint the request deterministically.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_tokens = map(int, data[idx].split()); idx += 1
    model = data[idx].strip(); idx += 1
    chunks = []
    for _ in range(n):
        chunks.append(data[idx]); idx += 1
    query = data[idx]; idx += 1
    # TODO: build the request dict (model, max_tokens, system, messages)
    # and print the five-line fingerprint.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, max_tokens = map(int, data[idx].split()); idx += 1
    model = data[idx].strip(); idx += 1
    chunks = []
    for _ in range(n):
        chunks.append(data[idx]); idx += 1
    query = data[idx]; idx += 1

    context = "\\n".join(chunks)
    system = (
        "You are a Q&A assistant. Answer only from the provided context. "
        "If the context lacks the answer, reply exactly: I don't know."
    )
    request = {
        "model": model,
        "max_tokens": max_tokens,
        "system": system,
        "messages": [
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"}
        ],
    }

    print(request["model"])
    print(request["max_tokens"])
    print(len(request["system"]))
    print(request["messages"][0]["role"])
    print(len(request["messages"][0]["content"]))

main()
`,
      challenge_test_cases: [
        { input: "2 512\nclaude-sonnet-4-6\nAcme was founded by Dale in 1999.\nAcme makes rockets.\nWho founded Acme?", expected_output: "claude-sonnet-4-6\n512\n125\nuser\n91", description: "Example 1: a two-chunk grounded request fingerprint." },
        { input: "1 256\nclaude-opus-4-1\nThe Moon orbits Earth.\nWhat orbits Earth?", expected_output: "claude-opus-4-1\n256\n125\nuser\n61", description: "Example 2: a different model and token cap pass through; system length is constant." }
      ]
    }
  ]
};
