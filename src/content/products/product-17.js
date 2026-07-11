export default {
  project: {
    id: "prod-17",
    title: "Personal Notes Brain",
    description:
      "Build a question-answering assistant that reads your own notes and cites exactly where each answer came from. You index your notes into searchable chunks, retrieve the right ones for a question, and write a footnoted answer backed by real sources instead of a guess.",
    difficulty: "advanced",
    category: "rag_search",
    estimated_time: 135,
    lessons_count: 8,
    tags: ["rag", "embeddings", "citations", "retrieval", "semantic-search", "grounding"],
    order: 117,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-17-1",
      project_id: "prod-17",
      order: 1,
      title: "Notes Are Too Big to Just Paste In",
      concept: "Split notes into paragraph-sized chunks so retrieval can point at the exact passage that answers a question.",
      explanation: `You have hundreds of markdown files: daily journals, meeting notes, recipe scraps, half-finished project plans. You want to ask "what did I decide about the budget last March?" and get a real answer with a pointer back to the note. Pasting your whole vault into one prompt does not work. It is too big, too expensive, and mostly irrelevant to any single question. The answer is **RAG**, or Retrieval-Augmented Generation.

## The RAG loop

1. **Index** every note once by splitting it into small, retrievable pieces called **chunks**.
2. **Retrieve** only the chunks that relate to the question, at question time.
3. **Synthesize** an answer from those chunks and **cite** which chunk backed which claim.

This lesson builds step 1. The rest of the project builds steps 2 and 3.

## Why chunk at all

A whole note is usually too coarse. One journal entry might cover breakfast, a work decision, and a doctor's appointment. If your question is only about the work decision, retrieving the entire entry wastes tokens on two paragraphs you don't need. Chunking splits each note into paragraph-sized pieces, so retrieval hands back the one paragraph that matters instead of a whole day.

\`\`\`python
def chunk_notes(notes):
    # notes: {"2024-03-04 Standup": "We agreed to cut the budget...\\n\\nAlso, lunch was good."}
    chunks = []
    for title, text in notes.items():
        paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]
        for i, para in enumerate(paragraphs, start=1):
            chunks.append({"note": title, "chunk_id": i, "text": para})
    return chunks
\`\`\`

Each chunk records where it came from in \`note\` and \`chunk_id\`. That metadata is what makes citations possible later. Lose it here and you can never point back to a source.

## What happens to each chunk next

In the next lesson, every chunk gets turned into a vector, called an **embedding**, that captures its meaning. Those vectors get stored next to the chunk's text and metadata. The collection of (text, metadata, vector) triples is your **index**. You build it once and reuse it for every question you ask.

## Why this matters

Without chunking you are stuck between two bad options. Send the whole vault every time and you pay for slow, noisy prompts. Send nothing and the model guesses from thin air, which sounds confident and is often wrong. Chunking is what makes precise search over your own notes possible.

## The mental model

Picture a librarian who cuts every book into index cards instead of shelving it whole, one idea per card, each card labeled with its book and page. When you ask a question she does not hand you a book. She hands you the three cards that answer it. Below you build that card-cutting step in pure Python. No network yet.`,
      starter_code: `# Split multiple notes into numbered chunks (by paragraph).
# Each note is a title mapped to its raw text; paragraphs are
# separated by a blank line.

notes = {
    "Recipes": "Bake bread at 450F.\\n\\nAdd salt to taste.",
    "Travel": "Pack light for Japan.",
}

def chunk_notes(notes):
    chunks = []
    for title, text in notes.items():
        paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]
        # TODO: for each paragraph, append a dict with keys:
        #       "note", "chunk_id" (1-indexed within the note), "text"
        pass
    return chunks

result = chunk_notes(notes)
print("total chunks:", len(result))
`,
      solution_code: `# Split multiple notes into numbered chunks (by paragraph).
# Each note is a title mapped to its raw text; paragraphs are
# separated by a blank line.

notes = {
    "Recipes": "Bake bread at 450F.\\n\\nAdd salt to taste.",
    "Travel": "Pack light for Japan.",
}

def chunk_notes(notes):
    chunks = []
    for title, text in notes.items():
        paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]
        for i, para in enumerate(paragraphs, start=1):
            chunks.append({"note": title, "chunk_id": i, "text": para})
    return chunks

result = chunk_notes(notes)
print("total chunks:", len(result))
for c in result:
    print(f"{c['note']}#{c['chunk_id']}: {c['text']}")
`,
      hints: [
        "Split each note's text on double newlines to get paragraphs.",
        "Use enumerate(paragraphs, start=1) so chunk_id is 1-indexed per note.",
        "Strip blank paragraphs so stray blank lines don't create empty chunks.",
      ],
      challenge_title: "Chunk the Notes",
      challenge_description:
        "Split a batch of notes into numbered chunks so each piece can be retrieved and cited on its own.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    total = 0
    for _ in range(n):
        title = data[idx].strip(); idx += 1
        p = int(data[idx].strip()); idx += 1
        paragraphs = data[idx:idx + p]; idx += p
        # TODO: for each paragraph (1-indexed), print "title#i: paragraph"
        # TODO: add p to the running total chunk count

    # TODO: print "TOTAL <total>"

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx].strip()); idx += 1
    total = 0
    for _ in range(n):
        title = data[idx].strip(); idx += 1
        p = int(data[idx].strip()); idx += 1
        paragraphs = data[idx:idx + p]; idx += p
        for i, para in enumerate(paragraphs, start=1):
            print(f"{title}#{i}: {para}")
        total += p

    print(f"TOTAL {total}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nRecipes\n2\nBake bread at 450F\nAdd salt to taste\nTravel\n1\nPack light for Japan",
          expected_output:
            "Recipes#1: Bake bread at 450F\nRecipes#2: Add salt to taste\nTravel#1: Pack light for Japan\nTOTAL 3",
          description: "Two notes with 2 and 1 paragraphs produce 3 chunks in order.",
        },
        {
          input: "1\nEmpty\n0",
          expected_output: "TOTAL 0",
          description: "Edge: a note with zero paragraphs contributes no chunk lines.",
        },
        {
          input: "1\nNotes\n1\nJust one line here",
          expected_output: "Notes#1: Just one line here\nTOTAL 1",
          description: "A single note with a single paragraph is chunk #1.",
        },
      ],
    },

    {
      id: "prod-17-2",
      project_id: "prod-17",
      order: 2,
      title: "Turning Text Into Numbers You Can Compare",
      concept: "Turn each chunk into an embedding vector and rank chunks by cosine similarity so search matches on meaning, not exact words.",
      explanation: `Two sentences can mean almost the same thing while sharing barely a word. "I need to fix the login bug" and "auth is broken again" point at the same problem, and keyword search misses the match completely. To find notes by meaning, you turn every chunk into a vector of numbers, an **embedding**, and compare vectors instead of text.

## What an embedding is

An embedding is a list of floats, often hundreds or thousands of them, produced by a model trained so that similar meanings land near each other in that number space. You call an embedding model once per chunk when indexing, and once per question at query time.

\`\`\`python
import os, voyageai

vo = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])

result = vo.embed(
    ["I need to fix the login bug", "auth is broken again"],
    model="voyage-3",
    input_type="document",
)
vectors = result.embeddings  # two lists of floats, close together in space
\`\`\`

You embed once and store the vector next to the chunk's text and metadata. A chunk that has not changed never gets re-embedded. That is the reason you build an index instead of embedding on every question.

## Comparing vectors with cosine similarity

To measure how similar two vectors are, use **cosine similarity**, the cosine of the angle between them. It ranges from -1 for opposite meaning to 1 for identical direction. It ignores vector *length* and looks only at *direction*. That matters because a short question and a long chunk can point the same way in meaning-space even when their raw magnitudes differ.

\`\`\`python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)
\`\`\`

The dot product measures raw alignment. Dividing by both magnitudes normalizes it into the -1 to 1 range, so scores stay comparable across chunks of any length.

## Why this matters

Retrieval is only as good as this one number. Rank every chunk's embedding against the question's embedding by cosine similarity, and the highest scores are your most relevant notes, whatever the exact wording was. Get this step wrong, or skip normalizing, and your search turns into noise.

## The mental model

Picture every sentence as an arrow pointing somewhere in a giant idea-space. Similar ideas point roughly the same way. Cosine similarity answers how parallel two arrows are, and it gives you a number you can sort by. Below you implement it in pure Python and use it to rank a few toy vectors. No network call here. The real embedding call is the code you just read above.`,
      starter_code: `import math

def cosine_similarity(a, b):
    # TODO: dot product of a and b
    # TODO: magnitude (norm) of a, and of b
    # TODO: return dot / (norm_a * norm_b)
    pass

def rank_by_similarity(query, vectors):
    # vectors is a list of (chunk_id, vector) pairs.
    # TODO: score every vector against query with cosine_similarity
    # TODO: return them sorted by score, highest first
    pass

query = [1, 0]
vectors = [("c1", [1, 0]), ("c2", [0, 1]), ("c3", [1, 1])]
print(rank_by_similarity(query, vectors))
`,
      solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)

def rank_by_similarity(query, vectors):
    scored = [(cid, cosine_similarity(query, vec)) for cid, vec in vectors]
    return sorted(scored, key=lambda pair: pair[1], reverse=True)

query = [1, 0]
vectors = [("c1", [1, 0]), ("c2", [0, 1]), ("c3", [1, 1])]

for chunk_id, score in rank_by_similarity(query, vectors):
    print(f"{chunk_id}: {score:.4f}")
`,
      hints: [
        "Dot product is sum(x*y for x, y in zip(a, b)).",
        "Magnitude is math.sqrt of the sum of squares of a vector's components.",
        "sorted(..., key=..., reverse=True) puts the highest similarity first.",
      ],
      challenge_title: "Rank Chunks by Similarity",
      challenge_description:
        "Score a set of chunk vectors against a query vector with cosine similarity and rank them highest first.",
      challenge_language: "python",
      challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    query = list(map(float, data[0].split()))
    n = int(data[1].strip())
    vectors = [list(map(float, data[2 + i].split())) for i in range(n)]
    # parse done: 'query' is the question vector, 'vectors' are the n chunk vectors in order

    # TODO: for each vector, compute cosine similarity to the query
    # TODO: sort by score descending, breaking ties by the original index ascending
    # TODO: print "index score" one per line, score with 4 decimal places

main()
`,
      challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    query = list(map(float, data[0].split()))
    n = int(data[1].strip())
    vectors = [list(map(float, data[2 + i].split())) for i in range(n)]

    def cosine(a, b):
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        return dot / (norm_a * norm_b)

    scored = [(i, cosine(query, v)) for i, v in enumerate(vectors)]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    for idx, score in scored:
        print(f"{idx} {score:.4f}")

main()
`,
      challenge_test_cases: [
        {
          input: "1 0\n3\n1 0\n0 1\n1 1",
          expected_output: "0 1.0000\n2 0.7071\n1 0.0000",
          description: "The exact-direction match ranks first, the diagonal chunk second, the orthogonal chunk last.",
        },
        {
          input: "1 1\n2\n1 1\n1 1",
          expected_output: "0 1.0000\n1 1.0000",
          description: "A tie in score is broken by ascending original index.",
        },
        {
          input: "1 0\n2\n-1 0\n0 1",
          expected_output: "1 0.0000\n0 -1.0000",
          description: "Edge: a directly opposite vector scores -1.0000 and sorts last.",
        },
      ],
    },

    {
      id: "prod-17-3",
      project_id: "prod-17",
      order: 3,
      title: "Retrieval: Picking the Best Notes, and Admitting When None Fit",
      concept: "Cap retrieval at the top k chunks and drop anything below a similarity threshold, so the model gets relevant context or none.",
      explanation: `Ranking every chunk in lesson 2 is not retrieval on its own. It just orders everything. A real retriever also decides how many chunks to hand the model and whether any of them are good enough to send. That second decision matters more than it sounds. Forcing through the best match when even the best match scores 0.1 is how RAG apps confidently answer questions their notes never covered.

## Two knobs: k and threshold

- **k** caps how many chunks you send. Keep it small; 3 to 5 is typical. More chunks means more tokens, more cost, and more room for the model to get distracted by a weaker chunk.
- **threshold** is a minimum similarity score. A chunk that ranks first among bad options is still a bad option if its score is 0.12. Anything below the threshold gets dropped, even when it would otherwise make the top k.

\`\`\`python
def retrieve(index, query_vector, k=4, threshold=0.35):
    scored = []
    for entry in index:
        score = cosine_similarity(query_vector, entry["vector"])
        if score >= threshold:
            scored.append({**entry, "score": score})
    scored.sort(key=lambda e: e["score"], reverse=True)
    return scored[:k]
\`\`\`

Filter before you slice to k, not after. Slice first and you might keep three barely-relevant chunks because nothing better existed. Filter first and an empty or short result becomes the honest signal that nothing in the vault matches.

## Tuning the threshold

There is no universal right number. It depends on your embedding model and how tightly your notes are written. Start around 0.3 to 0.4 for cosine similarity, then adjust by testing real questions. Too low drags in noise. Too high starves the model of context it needed.

## Why this matters

An empty result after filtering is not a failure. It is information. It tells the next stage of the pipeline that the vault has nothing on this question, which is the exact signal a later lesson uses to skip the API call and return an honest "I don't know" instead of letting the model improvise from nothing.

## The mental model

A good research assistant hands you the three most relevant books off the shelf. If none of them are actually about your topic, she says she has nothing on this instead of handing you the least-irrelevant book anyway. Below you implement that filter-then-rank-then-cap retriever in pure Python.`,
      starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)

def retrieve(chunks, query, k, threshold):
    # chunks is a list of dicts: {"id": ..., "vector": [...]}.
    # TODO: score every chunk against the query
    # TODO: keep only chunks with score >= threshold
    # TODO: sort by score descending, then return the top k
    pass

chunks = [
    {"id": "c1", "vector": [1, 0]},
    {"id": "c2", "vector": [0, 1]},
    {"id": "c3", "vector": [1, 1]},
]
print(retrieve(chunks, [1, 0], k=2, threshold=0.5))
`,
      solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)

def retrieve(chunks, query, k, threshold):
    scored = []
    for chunk in chunks:
        score = cosine_similarity(query, chunk["vector"])
        if score >= threshold:
            scored.append({**chunk, "score": score})
    scored.sort(key=lambda c: c["score"], reverse=True)
    return scored[:k]

chunks = [
    {"id": "c1", "vector": [1, 0]},
    {"id": "c2", "vector": [0, 1]},
    {"id": "c3", "vector": [1, 1]},
]

hits = retrieve(chunks, [1, 0], k=2, threshold=0.5)
for h in hits:
    print(f"{h['id']}: {h['score']:.4f}")
`,
      hints: [
        "Filter with score >= threshold BEFORE sorting and slicing to k.",
        "sorted(..., reverse=True) then slice [:k] gives the top k above the bar.",
        "An empty result after filtering is a valid, meaningful outcome, not a bug.",
      ],
      challenge_title: "Retrieve the Top-K Above Threshold",
      challenge_description:
        "Score chunks against a query, drop anything below the similarity threshold, and keep only the top k survivors.",
      challenge_language: "python",
      challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    query = list(map(float, data[0].split()))
    n = int(data[1].strip())
    ids = []
    vectors = []
    for i in range(n):
        parts = data[2 + i].split()
        ids.append(parts[0])
        vectors.append(list(map(float, parts[1:])))
    k, threshold = data[2 + n].split()
    k = int(k)
    threshold = float(threshold)
    # parse done: query vector, parallel 'ids'/'vectors' lists, k, threshold

    # TODO: compute cosine similarity of every chunk vector to the query
    # TODO: keep only chunks with score >= threshold
    # TODO: sort by score descending (ties by id ascending), keep top k
    # TODO: print the kept count, then "id score" lines (4 decimal places)

main()
`,
      challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    query = list(map(float, data[0].split()))
    n = int(data[1].strip())
    ids = []
    vectors = []
    for i in range(n):
        parts = data[2 + i].split()
        ids.append(parts[0])
        vectors.append(list(map(float, parts[1:])))
    k, threshold = data[2 + n].split()
    k = int(k)
    threshold = float(threshold)

    def cosine(a, b):
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        return dot / (norm_a * norm_b)

    candidates = []
    for cid, vec in zip(ids, vectors):
        score = cosine(query, vec)
        if score >= threshold:
            candidates.append((cid, score))

    candidates.sort(key=lambda pair: (-pair[1], pair[0]))
    kept = candidates[:k]

    print(len(kept))
    for cid, score in kept:
        print(f"{cid} {score:.4f}")

main()
`,
      challenge_test_cases: [
        {
          input: "1 0\n4\nc1 1 0\nc2 0 1\nc3 1 1\nc4 -1 0\n2 0.5",
          expected_output: "2\nc1 1.0000\nc3 0.7071",
          description: "Two chunks clear the 0.5 threshold; both fit within k=2.",
        },
        {
          input: "1 0\n4\nc1 1 0\nc2 0 1\nc3 1 1\nc4 -1 0\n3 0.8",
          expected_output: "1\nc1 1.0000",
          description: "Raising the threshold to 0.8 filters out the 0.7071 match too.",
        },
        {
          input: "1 0\n4\nc1 1 0\nc2 0 1\nc3 1 1\nc4 -1 0\n1 0.0",
          expected_output: "1\nc1 1.0000",
          description: "A low threshold admits three chunks, but k=1 caps the output to the single best.",
        },
        {
          input: "1 1\n2\nc1 1 1\nc2 1 1\n2 0.0",
          expected_output: "2\nc1 1.0000\nc2 1.0000",
          description: "Edge: a tie is broken by ascending id.",
        },
      ],
    },

    {
      id: "prod-17-4",
      project_id: "prod-17",
      order: 4,
      title: "Writing the Cited-Answer Prompt",
      concept: "Number the retrieved chunks and instruct the model to answer only from them, tagging each claim with the source number that backs it.",
      explanation: `You now have the top few relevant chunks. The next job is turning them into a prompt that makes the model answer only from those chunks and mark which chunk backed each part of the answer. That is the difference between a chatbot and a research assistant with footnotes.

## Numbering the sources

Give every retrieved chunk a number, then reference that number in the system prompt's rules. The number becomes the citation marker the model is asked to use: \`[1]\`, \`[2]\`, and so on.

\`\`\`python
def build_context_block(chunks):
    lines = [f"[{i}] {c['note']}: {c['text']}" for i, c in enumerate(chunks, start=1)]
    return "\\n".join(lines)
\`\`\`

## The system prompt does the grounding

\`\`\`python
SYSTEM = """You are a research assistant answering questions using ONLY the
numbered notes provided below. Every claim in your answer must end with the
bracketed number(s) of the note(s) that support it, like [1] or [1][2].
If the notes do not contain the answer, say so plainly instead of guessing.
Never cite a number that isn't in the list you were given."""

def build_messages(question, chunks):
    context = build_context_block(chunks)
    user_turn = f"{context}\\n\\nQuestion: {question}"
    return [{"role": "user", "content": user_turn}]

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system=SYSTEM,
    messages=build_messages(question, retrieved_chunks),
)
\`\`\`

Notice the shape. The system prompt carries the *rule*, which is cite every claim and refuse to guess. The user turn carries the *data*, which is the numbered sources plus the actual question. That separation is the same discipline as every other product in this track: rules and input never mix.

## Why citation numbers, not source names

Numbers are compact and unambiguous. "According to [2]" is one token. "According to your March 4th standup notes" is many, and the model paraphrases it inconsistently from one call to the next. You map the number back to the real title and file path yourself after the model replies. That is the next lesson's job.

## Why this matters

Without an explicit citation rule, a model answering from context still writes fluent, confident prose, and you cannot tell which sentence came from which note, or whether it came from the notes at all instead of the model's general knowledge. The instruction to cite is what turns a plausible-sounding answer into one you can verify by clicking through to the source.

## The mental model

You are handing the model a numbered stack of index cards and one strict rule: every sentence needs a card number, or it does not get written. Below you build the numbered context block and the combined prompt in pure Python. The actual API call is the two lines shown above.`,
      starter_code: `def build_context_block(chunks):
    # chunks is a list of dicts: {"title": ..., "text": ...}, already retrieved.
    # TODO: return a single string with one line per chunk:
    #       "[1] title: text", "[2] title: text", ... (1-indexed)
    pass

def build_messages(question, chunks):
    # TODO: build the context block, then return a messages list with
    #       ONE user turn whose content is the context block + a blank
    #       line + "Question: " + question
    pass

chunks = [
    {"title": "Recipes", "text": "Bake bread at 450F."},
    {"title": "Travel", "text": "Pack light for Japan."},
]
messages = build_messages("What temperature do I bake bread at?", chunks)
print(messages[0]["content"])
`,
      solution_code: `def build_context_block(chunks):
    lines = [f"[{i}] {c['title']}: {c['text']}" for i, c in enumerate(chunks, start=1)]
    return "\\n".join(lines)

def build_messages(question, chunks):
    context = build_context_block(chunks)
    content = f"{context}\\n\\nQuestion: {question}"
    return [{"role": "user", "content": content}]

chunks = [
    {"title": "Recipes", "text": "Bake bread at 450F."},
    {"title": "Travel", "text": "Pack light for Japan."},
]

messages = build_messages("What temperature do I bake bread at?", chunks)
print(messages[0]["content"])
print("---")
print("turns:", len(messages))
`,
      hints: [
        "enumerate(chunks, start=1) gives you the citation numbers [1], [2], ...",
        "Join the numbered lines with a newline to build the context block.",
        "The question goes in the SAME user turn as the context, separated by a blank line.",
      ],
      challenge_title: "Number the Sources",
      challenge_description:
        "Build the numbered context block handed to the model, one bracketed source per line.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    sources = [data[1 + i].split("|", 1) for i in range(n)]
    # parse done: 'sources' is a list of [title, text] pairs, in order

    # TODO: print "SOURCES <n>"
    # TODO: then print "[i] title: text" for each source, 1-indexed

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    sources = [data[1 + i].split("|", 1) for i in range(n)]

    print(f"SOURCES {n}")
    for i, (title, text) in enumerate(sources, start=1):
        print(f"[{i}] {title}: {text}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nRecipes|Bake bread at 450F\nTravel|Pack light for Japan",
          expected_output: "SOURCES 2\n[1] Recipes: Bake bread at 450F\n[2] Travel: Pack light for Japan",
          description: "Two sources are numbered in the order they were retrieved.",
        },
        {
          input: "0",
          expected_output: "SOURCES 0",
          description: "Edge: zero retrieved sources prints only the header line.",
        },
        {
          input: "1\nJournal|Went for a run this morning",
          expected_output: "SOURCES 1\n[1] Journal: Went for a run this morning",
          description: "A single source is still numbered [1].",
        },
      ],
    },

    {
      id: "prod-17-5",
      project_id: "prod-17",
      order: 5,
      title: "Extracting and Verifying Citations",
      concept: "Parse the citation markers out of the answer and check every number against the sources you actually sent, catching hallucinated citations.",
      explanation: `The model replied with something like "You bake bread at 450F [1]." Your job is not done. You need to pull the citation numbers back out of that text, map them to real note titles for display, and check that every number the model used points to a source you actually gave it. Models sometimes cite a number that does not exist, especially in longer answers. A hallucinated citation is worse than no citation, because it *looks* trustworthy.

## Pulling citations out with a regex

\`\`\`python
import re

def extract_citations(text):
    found = re.findall(r"\\[(\\d+)\\]", text)
    return list(dict.fromkeys(int(n) for n in found))  # unique, first-seen order
\`\`\`

\`re.findall\` grabs every \`[n]\` pattern as a string. Converting to \`int\` and deduping with \`dict.fromkeys\` keeps first-appearance order while dropping repeats, since a chunk can get cited several times in one answer.

## Verifying against the real source list

\`\`\`python
def verify_citations(cited, num_sources):
    return sorted(n for n in cited if n < 1 or n > num_sources)

def footnotes(cited, chunks):
    return [f"[{n}] {chunks[n - 1]['note']}" for n in cited if 1 <= n <= len(chunks)]
\`\`\`

If \`verify_citations\` returns anything non-empty, the model referenced a source number that was never in the context you sent. That is a hallucinated citation, and it is your signal to either retry the call with a firmer instruction or strip the bad marker before showing the user anything.

## Why this matters

Citations only build trust if you actually check them. A UI that prints "[1] Recipes" under an answer is honest only when you have verified that \`[1]\` is really what the model pointed at. Skip verification and citations become decoration: numbers that look like proof but were never confirmed to mean anything.

## Two failure modes to catch

- **Out-of-range citation**: the model wrote \`[7]\` when you gave it 3 sources. Always a bug, never valid.
- **No citations at all**: the model answered with zero \`[n]\` markers. That is not automatically wrong, since a "the notes don't say" answer needs none, but for a factual claim it is a red flag worth surfacing to the user or retrying.

## The mental model

You are the fact-checking editor at a magazine. Every footnote in the draft gets checked against the source list before it goes to print. A footnote pointing at a source that does not exist gets caught here, not by the reader. Below you build the extractor and the verifier in pure Python.`,
      starter_code: `import re

def extract_citations(text):
    # TODO: use re.findall to grab every number inside [brackets]
    # TODO: return the UNIQUE numbers as ints, in order of first appearance
    pass

def verify_citations(cited, num_sources):
    # TODO: return the sorted list of citation numbers that are invalid
    #       (less than 1, or greater than num_sources)
    pass

answer = "This is supported by [1] and also [2], see [1] again."
cited = extract_citations(answer)
print(cited)
print(verify_citations(cited, 3))
`,
      solution_code: `import re

def extract_citations(text):
    found = re.findall(r"\\[(\\d+)\\]", text)
    unique = list(dict.fromkeys(int(n) for n in found))
    return unique

def verify_citations(cited, num_sources):
    return sorted(n for n in cited if n < 1 or n > num_sources)

answer = "This is supported by [1] and also [2], see [1] again."
cited = extract_citations(answer)
invalid = verify_citations(cited, 3)

print("cited:", cited)
print("invalid:", invalid)
print("grounded:", len(invalid) == 0)
`,
      hints: [
        "re.findall(r'\\\\[(\\\\d+)\\\\]', text) grabs the digits inside every [n] marker.",
        "dict.fromkeys(...) dedupes a sequence while keeping first-appearance order.",
        "A citation is invalid if it's below 1 or above the number of sources you actually sent.",
      ],
      challenge_title: "Fact-Check the Footnotes",
      challenge_description:
        "Extract the citation numbers from a model's answer and verify each one points to a real, in-range source.",
      challenge_language: "python",
      challenge_starter_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    num_sources = int(data[0].strip())
    answer = data[1] if len(data) > 1 else ""
    # parse done: 'num_sources' is how many sources were given, 'answer' is the model's reply

    # TODO: extract the unique citation numbers, in order of first appearance
    # TODO: print them space-separated, or "NONE" if there were none
    # TODO: print "VALID" if every citation is within [1, num_sources], else "INVALID"
    # TODO: if INVALID, print the invalid numbers (ascending, space-separated) on a third line

main()
`,
      challenge_solution_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    num_sources = int(data[0].strip())
    answer = data[1] if len(data) > 1 else ""

    found = re.findall(r"\\[(\\d+)\\]", answer)
    cited = list(dict.fromkeys(int(n) for n in found))

    print(" ".join(map(str, cited)) if cited else "NONE")

    invalid = sorted(n for n in cited if n < 1 or n > num_sources)
    if invalid:
        print("INVALID")
        print(" ".join(map(str, invalid)))
    else:
        print("VALID")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nThis is supported by [1] and also [2], see [1] again.",
          expected_output: "1 2\nVALID",
          description: "Two unique citations, both within range 1-3.",
        },
        {
          input: "2\nThis claims [1] and [5] but 5 doesn't exist.",
          expected_output: "1 5\nINVALID\n5",
          description: "Citation [5] exceeds the 2 available sources, so it's flagged invalid.",
        },
        {
          input: "2\nThis has no citations at all.",
          expected_output: "NONE\nVALID",
          description: "Edge: an uncited answer prints NONE, and vacuously has no invalid citations.",
        },
      ],
    },

    {
      id: "prod-17-6",
      project_id: "prod-17",
      order: 6,
      title: "When Nothing Matches: Refusing Gracefully",
      concept: "Split the top retrieval score into confidence bands so a no-match question returns an honest refusal instead of a fabricated answer.",
      explanation: `Ask your notes brain for your dentist's phone number when you never wrote it down, and a model handed empty or near-empty context will often still produce a fluent, confident-sounding guess. That is the most damaging failure mode in RAG: an answer that reads like it came from your notes but did not. Hardening a notes brain starts with refusing well.

## Confidence bands from the top retrieval score

Instead of a single yes/no threshold, split retrieval scores into three bands:

- **CONFIDENT**, score above a high bar: answer normally.
- **WEAK**, score in a middle band: the notes barely relate. Still worth trying, but tell the model to hedge and admit uncertainty.
- **NO_MATCH**, score below both: do not call the model at all.

\`\`\`python
def classify_confidence(top_score, confident_t=0.5, weak_t=0.3):
    if top_score >= confident_t:
        return "CONFIDENT"
    if top_score >= weak_t:
        return "WEAK"
    return "NO_MATCH"
\`\`\`

## Skipping the call entirely on NO_MATCH

\`\`\`python
def answer_question(question, index):
    hits = retrieve(index, embed(question), k=4, threshold=0.0)
    top_score = hits[0]["score"] if hits else 0.0
    label = classify_confidence(top_score)

    if label == "NO_MATCH":
        return "I don't have anything in your notes about that.", []

    hedge = ("The notes only weakly match this question. Answer cautiously "
              "and say so if you're not confident.\\n\\n") if label == "WEAK" else ""
    ...  # build the cited prompt from hits and call the model
\`\`\`

NO_MATCH never reaches the API. That is a cost and correctness decision as much as a UX one. Sending a model empty or irrelevant context and asking it to answer anyway invites a hallucination, and you pay for the privilege.

## Why the system prompt's refusal rule still matters

Confidence bands catch the case where nothing obviously matched. But even a CONFIDENT retrieval can be wrong in a quieter way: the top chunk might be tangentially related without actually answering the question. That is why lesson 4's system prompt line, "if the notes don't contain the answer, say so," stays in every prompt whatever the band. It is the model's second line of defense behind your retrieval gate.

## Why this matters

A tool that says "I don't know" when it genuinely does not know is more useful than one that never admits uncertainty. Users learn fast which assistants they can trust, and one confidently wrong answer costs more trust than ten honest "not found in your notes."

## The mental model

A good research assistant has three gears: answer confidently, answer with a hedge, or say she could not find anything on that in your files. She picks the gear before opening her mouth, not after. Below you build the classifier and the fallback dispatcher in pure Python.`,
      starter_code: `def classify_confidence(top_score, confident_threshold, weak_threshold):
    # TODO: top_score >= confident_threshold -> "CONFIDENT"
    # TODO: elif top_score >= weak_threshold  -> "WEAK"
    # TODO: else                              -> "NO_MATCH"
    pass

def build_fallback_or_prompt(label, chunks, question):
    if label == "NO_MATCH":
        return None, "I don't have anything in your notes about that."
    hedge = ("The notes only weakly match this question; answer cautiously "
             "and say so if unsure.\\n\\n") if label == "WEAK" else ""
    # TODO: build a context block from chunks (one per line, "- text"),
    #       then return (hedge + context + "\\n\\nQuestion: " + question, None)
    pass

print(classify_confidence(0.8, 0.5, 0.3))
`,
      solution_code: `def classify_confidence(top_score, confident_threshold, weak_threshold):
    if top_score >= confident_threshold:
        return "CONFIDENT"
    if top_score >= weak_threshold:
        return "WEAK"
    return "NO_MATCH"

def build_fallback_or_prompt(label, chunks, question):
    if label == "NO_MATCH":
        return None, "I don't have anything in your notes about that."
    hedge = ("The notes only weakly match this question; answer cautiously "
             "and say so if unsure.\\n\\n") if label == "WEAK" else ""
    context = "\\n".join(f"- {c}" for c in chunks)
    prompt = f"{hedge}{context}\\n\\nQuestion: {question}"
    return prompt, None

for score in [0.8, 0.4, 0.1]:
    label = classify_confidence(score, 0.5, 0.3)
    prompt, fallback = build_fallback_or_prompt(label, ["Bake bread at 450F."], "How hot for bread?")
    print(label, "->", fallback if fallback else "calls the model")
`,
      hints: [
        "Check the highest bar first (CONFIDENT), then the next (WEAK); NO_MATCH is whatever's left.",
        "A NO_MATCH label should skip the API call entirely, not send an empty-context prompt and hope.",
        "The hedge line only applies to WEAK; CONFIDENT gets a plain prompt.",
      ],
      challenge_title: "Pick the Confidence Band",
      challenge_description:
        "Classify a batch of top retrieval scores into CONFIDENT, WEAK, or NO_MATCH before deciding whether to call the model.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    confident_t, weak_t = map(float, data[0].split())
    n = int(data[1].strip())
    scores = [float(data[2 + i].strip()) for i in range(n)]
    # parse done: thresholds, and 'scores' is the top retrieved score per query

    # TODO: for each score, print CONFIDENT if score >= confident_t,
    #       WEAK if score >= weak_t, otherwise NO_MATCH

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    confident_t, weak_t = map(float, data[0].split())
    n = int(data[1].strip())
    scores = [float(data[2 + i].strip()) for i in range(n)]

    for score in scores:
        if score >= confident_t:
            print("CONFIDENT")
        elif score >= weak_t:
            print("WEAK")
        else:
            print("NO_MATCH")

main()
`,
      challenge_test_cases: [
        {
          input: "0.5 0.3\n3\n0.8\n0.35\n0.1",
          expected_output: "CONFIDENT\nWEAK\nNO_MATCH",
          description: "Three scores land in three different confidence bands.",
        },
        {
          input: "0.5 0.3\n2\n0.5\n0.3",
          expected_output: "CONFIDENT\nWEAK",
          description: "Both thresholds are inclusive boundaries.",
        },
        {
          input: "0.5 0.3\n1\n-0.2",
          expected_output: "NO_MATCH",
          description: "Edge: a negative similarity score is a clear NO_MATCH.",
        },
      ],
    },

    {
      id: "prod-17-7",
      project_id: "prod-17",
      order: 7,
      title: "Cost and Scale: Deduping Notes Before You Pay to Embed",
      concept: "Drop exact-duplicate chunks before embedding and estimate the token bill, so a template-heavy vault does not triple your index cost.",
      explanation: `A real notes vault is messy. Daily journals copy-paste the same template into dozens of entries: "Mood:", "Top priority:", the same boilerplate headers. Every repeated chunk costs an embedding call, takes a slot in your index, and crowds genuinely unique content out of retrieval results. Before you scale to hundreds of notes, dedupe.

## Exact-duplicate detection

The cheapest, most reliable dedup catches chunks that are the same content with different casing or spacing, like "Buy milk" against "BUY MILK" against "Buy   milk", by normalizing before comparing.

\`\`\`python
def normalize(text):
    return " ".join(text.lower().split())

def dedup_chunks(chunks):
    seen = set()
    unique = []
    for chunk in chunks:
        key = normalize(chunk["text"])
        if key not in seen:
            seen.add(key)
            unique.append(chunk)
    return unique
\`\`\`

Keep the first occurrence's original text so display casing looks natural, and use the normalized key only for comparison.

## Near-duplicate detection

Exact-text dedup will not catch two chunks that say almost the same thing in different words. That needs a comparison of their *embeddings*, not their raw text. If two chunks' cosine similarity is above a very high bar, say 0.98, they are near-duplicates even with different wording. That check runs after embedding, as a housekeeping pass over the index, using the same \`cosine_similarity\` function you already built.

## Budgeting the embedding cost before you index

Embedding is billed per token, like any model call. Before indexing a big vault, estimate the bill.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

def estimate_index_cost(chunks, cost_per_1k_tokens):
    total_tokens = sum(estimate_tokens(c["text"]) for c in chunks)
    return total_tokens, (total_tokens / 1000) * cost_per_1k_tokens
\`\`\`

Dedup first, then estimate. Dropping duplicate chunks lowers this number directly, which is why dedup belongs in the hardening lessons. It is a real cost lever on a vault of any size.

## Why this matters

At ten notes, duplication is a curiosity. At a thousand notes with a shared daily template, it can be a third of your entire index. That triples embedding cost and dilutes every retrieval with repeated boilerplate that was never worth searching.

## The mental model

Before shelving a new batch of index cards, a careful librarian checks whether she has already filed this exact card, word for word, and tosses the copy. Below you implement that check in pure Python.`,
      starter_code: `def normalize(text):
    # TODO: lowercase and collapse all whitespace to single spaces
    pass

def dedup_chunks(texts):
    # TODO: keep only the FIRST occurrence of each normalized text,
    #       preserving original text and original order
    pass

def estimate_tokens(text):
    return max(1, len(text) // 4)

texts = ["Buy milk", "BUY MILK", "Buy   milk", "Walk the dog"]
print(dedup_chunks(texts))
`,
      solution_code: `def normalize(text):
    return " ".join(text.lower().split())

def dedup_chunks(texts):
    seen = set()
    unique = []
    for text in texts:
        key = normalize(text)
        if key not in seen:
            seen.add(key)
            unique.append(text)
    return unique

def estimate_tokens(text):
    return max(1, len(text) // 4)

texts = ["Buy milk", "BUY MILK", "Buy   milk", "Walk the dog"]
unique = dedup_chunks(texts)

print("removed:", len(texts) - len(unique))
for t in unique:
    print(t)

total_tokens = sum(estimate_tokens(t) for t in unique)
print("tokens to embed:", total_tokens)
`,
      hints: [
        "normalize should make 'Buy milk' and 'BUY   MILK' compare equal.",
        "Track a 'seen' set of normalized keys; only append when a key is new.",
        "Keep the ORIGINAL text (the first occurrence's casing), not the normalized one, in the output.",
      ],
      challenge_title: "Dedup Before You Pay to Embed",
      challenge_description:
        "Remove exact duplicate notes, ignoring case and extra whitespace, before they get embedded and indexed.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    texts = data[1:1 + n]
    # parse done: 'texts' is the n chunk texts, in order

    # TODO: normalize each text (lowercase, collapse whitespace) to detect duplicates
    # TODO: print how many duplicates were removed
    # TODO: then print the unique texts (original casing), first-occurrence order

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    texts = data[1:1 + n]

    def normalize(text):
        return " ".join(text.lower().split())

    seen = set()
    unique = []
    for text in texts:
        key = normalize(text)
        if key not in seen:
            seen.add(key)
            unique.append(text)

    print(n - len(unique))
    for t in unique:
        print(t)

main()
`,
      challenge_test_cases: [
        {
          input: "4\nBuy milk\nBUY MILK\nBuy   milk\nWalk the dog",
          expected_output: "2\nBuy milk\nWalk the dog",
          description: "Two case/whitespace variants of the same chunk are removed as duplicates.",
        },
        {
          input: "2\nAlpha\nBeta",
          expected_output: "0\nAlpha\nBeta",
          description: "No duplicates present, nothing removed.",
        },
        {
          input: "3\nSame text\nsame text\nSAME TEXT",
          expected_output: "2\nSame text",
          description: "Edge: all three lines normalize identically, keeping only the first.",
        },
      ],
    },

    {
      id: "prod-17-8",
      project_id: "prod-17",
      order: 8,
      title: "Ship the Notes Brain",
      concept: "Wire chunking, retrieval, the cited prompt, citation verification, and the no-match fallback into one command-line tool and ship it.",
      explanation: `Every piece exists now: chunking, embedding, ranked retrieval with a threshold, a citation-aware prompt, citation extraction and verification, a graceful no-match fallback, and dedup to keep the index lean. This lesson wires them into one command-line tool and ships it.

## The end-to-end flow

\`\`\`python
def notes_brain(question, index, confident_t=0.5, weak_t=0.3):
    hits = retrieve(index, embed(question), k=4, threshold=0.0)
    top_score = hits[0]["score"] if hits else 0.0
    label = classify_confidence(top_score, confident_t, weak_t)

    if label == "NO_MATCH":
        return "I don't have anything in your notes about that.", []

    messages = build_messages(question, hits)
    resp = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=500,
        system=SYSTEM, messages=messages,
    )
    answer = resp.content[0].text

    cited = extract_citations(answer)
    invalid = verify_citations(cited, len(hits))
    notes = footnotes(cited, hits)
    return answer, notes if not invalid else []
\`\`\`

Read it top to bottom and you are reading the whole project: retrieve, gate on confidence, prompt with numbered sources, call the model, extract and verify citations, hand back an answer plus a clean footnote list. If verification fails, hand back an empty footnote list, which beats showing a broken citation.

## Cache the index, don't rebuild it every run

Embedding every note on every question would be slow and wasteful. Real tools embed once, save the vectors with a hash of each chunk's text as the cache key, and re-embed only the chunks whose text changed since last time. That one habit is what turns a tool that runs once as a demo into one that runs instantly and cheaply every day on a growing vault.

## Wrap it as a CLI

\`\`\`python
import sys

def main():
    question = " ".join(sys.argv[1:]) or sys.stdin.read().strip()
    index = load_or_build_index("notes/")
    answer, notes = notes_brain(question, index)
    print(answer)
    for n in notes:
        print(n)

if __name__ == "__main__":
    main()
\`\`\`

Now \`python notes_brain.py "what did I decide about the budget?"\` reads your real vault and answers with footnotes, or admits it found nothing.

## What "shipped" means here

It runs from a clean start with one command. It handles an empty vault or an off-topic question without crashing or fabricating. And someone else could point it at their own notes folder from your instructions alone.

## Into your Portfolio

Finishing this lesson records the Personal Notes Brain in your **Portfolio** tab. It joins your shelf of working AI tools. This one is grounded, cited, and honest about what it does not know.

## The mental model

A shipped RAG tool hides all of this behind one question typed at a prompt. Underneath, it indexes, retrieves, gates on confidence, cites, and verifies, with every lesson in this project collapsed into one answer that comes with receipts. Below you build the final report that ties retrieval, citation-checking, and status together.`,
      starter_code: `def classify_confidence(top_score, confident_t, weak_t):
    if top_score >= confident_t:
        return "CONFIDENT"
    if top_score >= weak_t:
        return "WEAK"
    return "NO_MATCH"

def final_report(num_notes, num_dupes, hits, top_score, citations_valid, confident_t, weak_t):
    label = classify_confidence(top_score, confident_t, weak_t)
    lines = [f"Indexed {num_notes} notes ({num_dupes} duplicates removed)"]
    # TODO: if label == "NO_MATCH", append "No relevant notes found"
    # TODO: else append f"Retrieved {hits} relevant chunks"
    # TODO: append "Citations verified" if citations_valid else "Citations INVALID"
    # TODO: append "STATUS: READY" only if label != "NO_MATCH" and hits > 0 and citations_valid,
    #       otherwise append "STATUS: NEEDS_REVIEW"
    return lines

for line in final_report(12, 3, 2, 0.8, True, 0.5, 0.3):
    print(line)
`,
      solution_code: `def classify_confidence(top_score, confident_t, weak_t):
    if top_score >= confident_t:
        return "CONFIDENT"
    if top_score >= weak_t:
        return "WEAK"
    return "NO_MATCH"

def final_report(num_notes, num_dupes, hits, top_score, citations_valid, confident_t, weak_t):
    label = classify_confidence(top_score, confident_t, weak_t)
    lines = [f"Indexed {num_notes} notes ({num_dupes} duplicates removed)"]

    if label == "NO_MATCH":
        lines.append("No relevant notes found")
    else:
        lines.append(f"Retrieved {hits} relevant chunks")

    lines.append("Citations verified" if citations_valid else "Citations INVALID")

    ready = label != "NO_MATCH" and hits > 0 and citations_valid
    lines.append("STATUS: READY" if ready else "STATUS: NEEDS_REVIEW")
    return lines

for line in final_report(12, 3, 2, 0.8, True, 0.5, 0.3):
    print(line)

print()
print("Notes Brain built. Saved to your Portfolio.")
`,
      hints: [
        "Reuse the CONFIDENT/WEAK/NO_MATCH classifier from the hardening lesson; shipping is where the pieces meet.",
        "READY requires all three: a real match (not NO_MATCH), at least one retrieved chunk, and valid citations.",
        "Order matters: index summary line, then retrieval line, then citations line, then the final status.",
      ],
      challenge_title: "Assemble the Final Report",
      challenge_description:
        "Combine indexing stats, retrieval results, and citation verification into the pipeline's final status report.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    num_notes, num_dupes = map(int, data[0].split())
    num_retrieved, threshold_met = map(int, data[1].split())
    citations_valid = int(data[2].strip())
    # parse done: index stats, retrieval stats, and whether citations passed verification

    # TODO: print f"Indexed {num_notes} notes ({num_dupes} duplicates removed)"
    # TODO: if threshold_met == 0, print "No relevant notes found"
    #       else print f"Retrieved {num_retrieved} relevant chunks"
    # TODO: print "Citations verified" if citations_valid else "Citations INVALID"
    # TODO: print "STATUS: READY" only if threshold_met, num_retrieved > 0, and citations_valid
    #       are all true, otherwise print "STATUS: NEEDS_REVIEW"

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    num_notes, num_dupes = map(int, data[0].split())
    num_retrieved, threshold_met = map(int, data[1].split())
    citations_valid = int(data[2].strip())

    print(f"Indexed {num_notes} notes ({num_dupes} duplicates removed)")

    if threshold_met == 0:
        print("No relevant notes found")
    else:
        print(f"Retrieved {num_retrieved} relevant chunks")

    print("Citations verified" if citations_valid else "Citations INVALID")

    ready = threshold_met == 1 and num_retrieved > 0 and citations_valid == 1
    print("STATUS: READY" if ready else "STATUS: NEEDS_REVIEW")

main()
`,
      challenge_test_cases: [
        {
          input: "12 3\n2 1\n1",
          expected_output: "Indexed 12 notes (3 duplicates removed)\nRetrieved 2 relevant chunks\nCitations verified\nSTATUS: READY",
          description: "A clean run: relevant chunks found and citations verified means READY.",
        },
        {
          input: "12 3\n0 0\n0",
          expected_output: "Indexed 12 notes (3 duplicates removed)\nNo relevant notes found\nCitations INVALID\nSTATUS: NEEDS_REVIEW",
          description: "No relevant notes matched, so the report reflects the graceful fallback path.",
        },
        {
          input: "5 0\n3 1\n0",
          expected_output: "Indexed 5 notes (0 duplicates removed)\nRetrieved 3 relevant chunks\nCitations INVALID\nSTATUS: NEEDS_REVIEW",
          description: "Edge: chunks were retrieved but citation verification failed, still NEEDS_REVIEW.",
        },
      ],
    },
  ],
};
