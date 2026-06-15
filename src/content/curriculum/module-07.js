export default {
  project: {
    id: "ai-07",
    title: "Build a RAG System",
    description: "Stop your LLM from making things up — bolt a real document search onto it and build a Q&A tool that cites its sources.",
    difficulty: "advanced",
    category: "ai_ml",
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
      hints: [
        "naive_answer ignores the docs entirely — it just returns a hardcoded wrong figure to mimic a hallucination.",
        "grounded_answer should look inside the context string before answering, and fall back to 'I don't have that information.' if the fact isn't there.",
        "Pass docs['doc1'] (the relevant doc) as the context to grounded_answer."
      ],
      challenge_title: "Build a grounding checker",
      challenge_description: "Write is_grounded(answer, source_text) that returns True only if every number mentioned in the answer also appears in the source text. This is a simple way to catch hallucinated figures.",
      challenge_starter_code: `def is_grounded(answer, source_text):
    # TODO: pull out every word in 'answer' that contains a digit.
    # Strip trailing punctuation/symbols, then confirm each appears in source_text.
    # Return True only if all numbers are found.
    pass
`,
      challenge_solution_code: `def is_grounded(answer, source_text):
    numbers = [w for w in answer.split() if any(c.isdigit() for c in w)]
    for n in numbers:
        cleaned = n.strip(".,!?$%")
        if cleaned and cleaned not in source_text:
            return False
    return True
`,
      challenge_test_cases: [
        { input: 'is_grounded("Revenue was 4.2 million.", "Q3 revenue of 4.2 million reported")', expected_output: "True", description: "The number 4.2 appears in the source, so the answer is grounded." },
        { input: 'is_grounded("Revenue was 9.9 million.", "Q3 revenue of 4.2 million reported")', expected_output: "False", description: "9.9 is not in the source — likely hallucinated." }
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
      hints: [
        "Split the text into a list of words first with text.split().",
        "step = size - overlap. Loop start over range(0, len(words), step) and slice words[start:start+size].",
        "Break out of the loop once start + size reaches or passes the end, so you don't emit empty trailing chunks."
      ],
      challenge_title: "Chunk on sentence boundaries",
      challenge_description: "Write chunk_by_sentences(text, max_chars) that splits text into sentences (on '.') and greedily packs them into chunks, never exceeding max_chars. This keeps whole sentences together instead of slicing mid-thought.",
      challenge_starter_code: `def chunk_by_sentences(text, max_chars):
    # TODO: split text on '.' into sentences (drop empties, re-add the period).
    # Greedily add sentences to the current chunk until adding one more would
    # exceed max_chars, then start a new chunk. Return the list of chunks.
    pass
`,
      challenge_solution_code: `def chunk_by_sentences(text, max_chars):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks = []
    current = ""
    for s in sentences:
        s = s + "."
        if len(current) + len(s) + 1 <= max_chars:
            current = (current + " " + s).strip()
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks
`,
      challenge_test_cases: [
        { input: 'chunk_by_sentences("First fact here. Second fact here. Third fact here. Fourth fact.", 40)', expected_output: "['First fact here. Second fact here.', 'Third fact here. Fourth fact.']", description: "Sentences pack into chunks under 40 chars without splitting any sentence." }
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
      hints: [
        "Cosine = dot product divided by (magnitude of a times magnitude of b). Guard against divide-by-zero by returning 0.0 when either magnitude is 0.",
        "Build a vectors dict once by embedding every doc, then embed the query separately.",
        "Sort scores.items() by the score with key=lambda x: x[1] and reverse=True to rank highest first."
      ],
      challenge_title: "Return the top-k matches",
      challenge_description: "Write top_k(query_vec, vectors, k) that returns the IDs of the k most similar vectors, highest similarity first. Reuse cosine_similarity. This is the core retrieval call your RAG system makes.",
      challenge_starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

def top_k(query_vec, vectors, k):
    # TODO: score every (doc_id, vector) in 'vectors' against query_vec,
    # sort by score descending, and return the first k doc_ids.
    pass
`,
      challenge_solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

def top_k(query_vec, vectors, k):
    scored = [(doc_id, cosine_similarity(query_vec, v)) for doc_id, v in vectors.items()]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [doc_id for doc_id, _ in scored[:k]]
`,
      challenge_test_cases: [
        { input: 'top_k([1.0, 0.0], {"a": [1.0, 0.0], "b": [0.0, 1.0], "c": [1.0, 1.0]}, 2)', expected_output: "['a', 'c']", description: "'a' is identical to the query (score 1.0); 'c' is at 45 degrees (~0.71); 'b' is perpendicular (0.0)." }
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
      hints: [
        "retrieve should embed the query, sort KB keys by cosine similarity descending, and return the top k as (id, text) tuples.",
        "build_prompt joins the chunk texts into a labeled 'Context:' block, then appends 'Question:' on its own line.",
        "Include both the 'use ONLY the context' constraint and the 'say you don't know' fallback in the prompt string."
      ],
      challenge_title: "Build the messages array",
      challenge_description: "Write build_messages(query, context_chunks) that returns a messages list (the Anthropic Messages API shape) with a single user message embedding the context and question. This is what you'll pass straight into the API next lesson.",
      challenge_starter_code: `def build_messages(query, context_chunks):
    # TODO: join context_chunks with blank lines, then build a user message that
    # contains a 'Context:' block, the 'Question:' line, and an instruction to
    # answer only from the context. Return [{"role": "user", "content": ...}].
    pass
`,
      challenge_solution_code: `def build_messages(query, context_chunks):
    context = "\\n\\n".join(context_chunks)
    user_content = (
        f"Context:\\n{context}\\n\\n"
        f"Question: {query}\\n\\n"
        "Answer using only the context above."
    )
    return [{"role": "user", "content": user_content}]
`,
      challenge_test_cases: [
        { input: 'build_messages("What is the capital?", ["France\'s capital is Paris."])[0]["role"]', expected_output: "user", description: "The single message uses the 'user' role expected by the Messages API." }
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
      hints: [
        "Call retrieve then build_prompt, then put the prompt into a single user message inside messages.",
        "Build the request as a dict with model, max_tokens, and messages so you can either return it or splat it into client.messages.create(**request).",
        "When client is None, return the request dict; otherwise read msg.content[0].text after the API call."
      ],
      challenge_title: "Add a grounded system prompt",
      challenge_description: "Write make_rag_request(query, chunks, model='claude-sonnet-4-6') that returns a Messages API request dict using a system prompt for the grounding rules and a user message for the context + question.",
      challenge_starter_code: `def make_rag_request(query, chunks, model="claude-sonnet-4-6"):
    # TODO: join chunks into a context block.
    # Put the grounding rules ('answer only from context; else say I don't know')
    # in a 'system' field. Put the context + question in a single user message.
    # Return a dict with model, max_tokens=512, system, and messages.
    pass
`,
      challenge_solution_code: `def make_rag_request(query, chunks, model="claude-sonnet-4-6"):
    context = "\\n".join(chunks)
    system = (
        "You are a Q&A assistant. Answer only from the provided context. "
        "If the context lacks the answer, reply exactly: I don't know."
    )
    return {
        "model": model,
        "max_tokens": 512,
        "system": system,
        "messages": [
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"}
        ],
    }
`,
      challenge_test_cases: [
        { input: 'make_rag_request("Who founded it?", ["Acme was founded by Dale in 1999."])["model"]', expected_output: "claude-sonnet-4-6", description: "The request defaults to the claude-sonnet-4-6 model." },
        { input: 'make_rag_request("Who founded it?", ["Acme was founded by Dale in 1999."])["max_tokens"]', expected_output: "512", description: "max_tokens is set to 512 for these scoped Q&A answers." }
      ]
    }
  ]
};
