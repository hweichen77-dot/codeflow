export default {
  project: {
    id: "prod-15",
    title: "Chat With Your PDF",
    description:
      "Build an app that reads a PDF, breaks it into searchable chunks, and answers questions using only what's actually in the document. Along the way you'll write the chunker, the embedding calls, cosine-similarity retrieval, and the guards that keep the model from making things up when the document stays silent.",
    difficulty: "intermediate",
    category: "rag_search",
    estimated_time: 130,
    lessons_count: 8,
    tags: ["rag", "embeddings", "retrieval", "chunking", "vector-search", "anthropic"],
    order: 115,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-15-1",
      project_id: "prod-15",
      order: 1,
      title: "Turn a PDF Into Text You Can Search",
      concept: "chunking a document",
      explanation: `A chatbot that "reads" your PDF never touches the whole file when you ask a question. It never sees the PDF at all. What it sees are a few small pieces of text you pick out and paste into the prompt. This lesson builds the first piece: turn a document into text, then slice that text into pieces small enough to search and cheap enough to send.

## What we're building

By lesson 8 you'll have a working app. Upload a document, ask a question, get an answer sourced from the document. That is **RAG**, retrieval-augmented generation: pull the relevant pieces of a document, then generate an answer grounded in them. Every RAG app begins by getting clean text out of the source file.

## Extracting the text

A PDF is a page-layout format, not plain text, so you need a library to pull the text out:

\`\`\`python
from pypdf import PdfReader

def extract_text(path):
    reader = PdfReader(path)
    return "\\n".join(page.extract_text() or "" for page in reader.pages)
\`\`\`

The \`or ""\` matters: a scanned image page has no extractable text and returns \`None\`, which would crash a join. Guard it and move on.

## Why you can't just paste the whole thing in

Two reasons. First, the **context window**: the model reads only so many tokens per call, and a real document blows past that limit fast. Second, and this holds even when the document does fit: dumping 40 pages into every question burns tokens you pay for and buries the one paragraph that answers the question under 39 pages that don't. Search the document first. Then hand the model only the slice it needs.

## Chunking: cut it into searchable pieces

**Chunking** splits the full text into overlapping windows of a few hundred to a thousand characters each. Each chunk becomes a separately searchable unit later.

\`\`\`python
def chunk_text(text, size=800, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap
    return chunks
\`\`\`

Two knobs matter. \`size\` sets how big each chunk is: big enough to hold a full idea, small enough to stay precise once retrieved. \`overlap\` repeats a little text between consecutive chunks so an idea sitting right on a boundary doesn't get sliced in half and lost from both windows.

## A way to picture it

Think of the document as a long hallway of paragraphs. Chunking drops a marker every few hundred characters and lets neighboring markers share a bit of hallway so nothing falls in a gap. None of this understands meaning yet. Ranking comes next lesson. Right now the job is exactly one long string in, a list of overlapping windows out. Build that below in pure Python. You don't need a PDF yet.`,
      starter_code: `# Split text into overlapping, fixed-size windows.
# start advances by (size - overlap) each step so windows overlap.

def chunk_text(text, size, overlap):
    chunks = []
    start = 0
    # TODO: while start is still inside the text:
    #   - append text[start:start+size] to chunks
    #   - advance start by (size - overlap)
    return chunks

sample = "the quick brown fox jumps over the lazy dog while the sun sets slowly"
result = chunk_text(sample, size=20, overlap=5)
print("chunks:", len(result))
`,
      solution_code: `# Split text into overlapping, fixed-size windows.
# start advances by (size - overlap) each step so windows overlap.

def chunk_text(text, size, overlap):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap
    return chunks

sample = "the quick brown fox jumps over the lazy dog while the sun sets slowly"
result = chunk_text(sample, size=20, overlap=5)

print("chunks:", len(result))
for i, c in enumerate(result):
    print(i, repr(c))
`,
      hints: [
        "Loop while start < len(text); the loop body doesn't need an index, just the running 'start'.",
        "Slice with text[start:start+size]; Python slicing never crashes even past the end of the string.",
        "Advance with start += size - overlap so the next window shares 'overlap' characters with this one.",
      ],
      challenge_title: "Chunk With Overlap",
      challenge_description:
        "Split text into fixed-size, overlapping character windows, the same way a document gets chunked before retrieval.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    first = sys.stdin.readline().split()
    size, overlap = int(first[0]), int(first[1])
    text = sys.stdin.readline().rstrip("\\n")
    # 'size' is the window length, 'overlap' is the shared chars between windows.

    # TODO: build chunks: start at 0, append text[start:start+size],
    #       advance start by (size - overlap), stop once start >= len(text).
    # TODO: print the number of chunks, then each chunk on its own line.

main()
`,
      challenge_solution_code: `import sys

def main():
    first = sys.stdin.readline().split()
    size, overlap = int(first[0]), int(first[1])
    text = sys.stdin.readline().rstrip("\\n")

    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap

    print(len(chunks))
    for c in chunks:
        print(c)

main()
`,
      challenge_test_cases: [
        {
          input: "5 2\nabcdefgh",
          expected_output: "3\nabcde\ndefgh\ngh",
          description: "8 characters, window 5, overlap 2 produces three overlapping windows.",
        },
        {
          input: "4 0\nabcdefgh",
          expected_output: "2\nabcd\nefgh",
          description: "Zero overlap behaves like plain fixed-size chunking.",
        },
        {
          input: "10 2\nhello",
          expected_output: "1\nhello",
          description: "A window bigger than the text yields exactly one chunk.",
        },
      ],
    },

    {
      id: "prod-15-2",
      project_id: "prod-15",
      order: 2,
      title: "Turning Text Into Numbers: Embeddings",
      concept: "embeddings",
      explanation: `You have a pile of text chunks. To find the ones relevant to a question, you need to compare meaning, and a computer can't compare meaning directly. It compares numbers. An **embedding** is how you turn meaning into numbers it can work with.

## What an embedding is

An embedding model takes a piece of text and returns a **vector**: a fixed-length list of floating-point numbers, often a thousand or more, that places the text's meaning as a point in space. Texts about similar things point in similar directions. "The cat sat on the mat" and "a feline rested on the rug" land close together even though they share no words. That closeness is the whole basis of RAG search.

## Calling an embedding model

Anthropic recommends Voyage AI for embeddings. You call it like any other model API: text goes in, vectors come back.

\`\`\`python
import os
import voyageai

vo = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])

result = vo.embed(
    ["The cat sat on the mat.", "Paris is the capital of France."],
    model="voyage-3",
    input_type="document",
)
vectors = result.embeddings
print(len(vectors), len(vectors[0]))   # e.g. 2 chunks, 1024 numbers each
\`\`\`

You embed every chunk **once**, right after chunking, and store each vector next to its chunk text. At query time you embed the user's *question* with the same model and compare that one vector against every stored chunk vector. Same embedding call, different input.

## Vectors as plain lists of numbers

Strip away the API and a vector is just \`[0.12, -0.87, 0.33, ...]\`. Two measurements carry the rest of this project:

- **Magnitude** (length): how big the vector is, the square root of the sum of its squared components.
- **Direction**: which way it points. This is the part that encodes meaning.

\`\`\`python
def magnitude(v):
    return sum(x * x for x in v) ** 0.5

def normalize(v):
    m = magnitude(v)
    return [x / m for x in v] if m else v
\`\`\`

\`normalize\` rescales a vector to length 1 while keeping its direction. That's handy because next lesson's similarity measure cares about direction, not size.

## What's actually yours to write

You never write the embedding math. The model does that. Your job is the plumbing: embed each chunk once, store the vectors, embed the question at query time, and pass both to a similarity function. Get the vector bookkeeping right here and the retrieval logic next lesson is arithmetic on lists.

## A way to picture it

An embedding is a GPS coordinate for meaning. Two texts about the same topic sit near each other on the map. Two unrelated texts sit far apart. Below, practice the magnitude and normalization math you'll reach for in the next lesson. No network call needed.`,
      starter_code: `# Practice the vector math behind embeddings: magnitude and normalization.

def magnitude(v):
    # TODO: return the square root of the sum of squares of v's entries.
    pass

def normalize(v):
    # TODO: divide every entry by the magnitude; if magnitude is 0, return v unchanged.
    pass

vectors = {
    "chunk_0": [3, 4],
    "chunk_1": [1, 1, 1],
}
for name, v in vectors.items():
    print(name, magnitude(v))
`,
      solution_code: `# Practice the vector math behind embeddings: magnitude and normalization.

def magnitude(v):
    return sum(x * x for x in v) ** 0.5

def normalize(v):
    m = magnitude(v)
    return [x / m for x in v] if m else v

vectors = {
    "chunk_0": [3, 4],
    "chunk_1": [1, 1, 1],
}

for name, v in vectors.items():
    m = magnitude(v)
    n = normalize(v)
    print(name, "magnitude:", m)
    print(name, "normalized:", [round(x, 3) for x in n])
    print(name, "normalized magnitude:", round(magnitude(n), 3))
`,
      hints: [
        "sum(x * x for x in v) ** 0.5 is the whole magnitude function.",
        "Guard the divide-by-zero case: if magnitude is 0, just return v as-is.",
        "A normalized vector should have magnitude 1.0 (check it with magnitude(normalize(v))).",
      ],
      challenge_title: "Rank Vectors by Magnitude",
      challenge_description:
        "Order embedding-like integer vectors by magnitude without floating-point square roots, so rounding never breaks a tie the wrong way.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    vectors = [list(map(int, data[1 + i].split())) for i in range(n)]
    # 'vectors' is a list of n integer vectors, each with d components.

    # TODO: compute each vector's squared magnitude (sum of squares; no sqrt needed
    #       since it preserves the same ordering as the true magnitude).
    # TODO: sort vector indices by squared magnitude descending, ties by
    #       ascending original index.
    # TODO: print the sorted indices, space-separated, on one line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    vectors = [list(map(int, data[1 + i].split())) for i in range(n)]

    mag2 = [sum(x * x for x in v) for v in vectors]
    order = sorted(range(n), key=lambda i: (-mag2[i], i))

    print(" ".join(map(str, order)))

main()
`,
      challenge_test_cases: [
        {
          input: "3 2\n3 4\n1 1\n0 5",
          expected_output: "0 2 1",
          description: "Vectors [3,4] and [0,5] tie at squared magnitude 25 and stay in index order ahead of [1,1].",
        },
        {
          input: "2 3\n1 2 3\n3 2 1",
          expected_output: "0 1",
          description: "Both vectors have squared magnitude 14; ties keep original order.",
        },
        {
          input: "1 1\n0",
          expected_output: "0",
          description: "A single zero vector still produces a valid, trivial ranking.",
        },
      ],
    },

    {
      id: "prod-15-3",
      project_id: "prod-15",
      order: 3,
      title: "Finding the Best Match: Cosine Similarity",
      concept: "cosine similarity retrieval",
      explanation: `You have a vector for every chunk and, in a moment, a vector for the user's question. Now you need one number that answers "how relevant is this chunk to this question." That number is **cosine similarity**. It's what turns a pile of vectors into a ranked search result.

## Why not just compare the raw numbers?

You might reach for the dot product: multiply matching entries, sum the results. The catch is that the dot product grows with vector *length*, not just direction. A long, verbose chunk can score high because its numbers are bigger, not because it answers the question. You want to compare direction and throw away size.

## Cosine similarity

Cosine similarity divides the dot product by the product of both vectors' magnitudes, which cancels out length and leaves only direction:

\`\`\`python
def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return sum(x * x for x in v) ** 0.5

def cosine_similarity(a, b):
    ma, mb = magnitude(a), magnitude(b)
    if ma == 0 or mb == 0:
        return 0.0
    return dot(a, b) / (ma * mb)
\`\`\`

The result always falls between -1 and 1. **1** means the vectors point the same way (near-identical meaning). **0** means unrelated. **-1** means opposite. In practice, relevant chunks for a real question land somewhere around 0.2 to 0.6 and rarely near 1.

## Retrieval is just ranking

Retrieval means: embed the question, compute cosine similarity against every stored chunk vector, and take the highest-scoring ones.

\`\`\`python
def retrieve(question_vector, chunk_vectors):
    scored = [
        (chunk_id, cosine_similarity(question_vector, v))
        for chunk_id, v in chunk_vectors.items()
    ]
    scored.sort(key=lambda pair: -pair[1])
    return scored
\`\`\`

That's the entire search engine underneath a RAG app. No keyword index, no query language, just sorted arithmetic on lists of numbers.

## Where it earns its keep

This one function is why RAG beats keyword search on real questions. A user asks "how much does it cost to cancel early" and matches a chunk that says "early termination incurs a fee." They share no words. The embeddings still land close in meaning-space, so the match holds.

## A way to picture it

Every chunk is a point on a meaning-map, and the question is another point dropped onto the same map. Cosine similarity reads the angle between the question and each chunk from the origin rather than the straight-line distance, so a short chunk and a long chunk that say the same thing score the same. Below, implement cosine similarity and use it to rank a few chunks against a query. No network required.`,
      starter_code: `# Rank fixed vectors by cosine similarity to a query vector.

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return sum(x * x for x in v) ** 0.5

def cosine_similarity(a, b):
    # TODO: return 0.0 if either magnitude is 0.
    # TODO: otherwise return dot(a, b) / (magnitude(a) * magnitude(b))
    pass

query = [1, 0, 0]
chunks = {
    "chunk_a": [5, 0, 0],
    "chunk_b": [0, 5, 0],
    "chunk_c": [3, 0, 3],
}
for name, v in chunks.items():
    print(name, cosine_similarity(query, v))
`,
      solution_code: `# Rank fixed vectors by cosine similarity to a query vector.

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return sum(x * x for x in v) ** 0.5

def cosine_similarity(a, b):
    ma, mb = magnitude(a), magnitude(b)
    if ma == 0 or mb == 0:
        return 0.0
    return dot(a, b) / (ma * mb)

query = [1, 0, 0]
chunks = {
    "chunk_a": [5, 0, 0],
    "chunk_b": [0, 5, 0],
    "chunk_c": [3, 0, 3],
}

ranked = sorted(chunks.items(), key=lambda pair: -cosine_similarity(query, pair[1]))
for name, v in ranked:
    print(name, round(cosine_similarity(query, v), 4))
print("best match:", ranked[0][0])
`,
      hints: [
        "Guard the zero-magnitude case first, before dividing.",
        "cosine_similarity is just dot(a, b) / (magnitude(a) * magnitude(b)).",
        "Sort with key=lambda pair: -cosine_similarity(query, pair[1]) to get highest first.",
      ],
      challenge_title: "Rank Chunks by Similarity",
      challenge_description:
        "Compute cosine similarity between a query vector and several chunk vectors, then rank the chunks from most to least relevant.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    query = list(map(float, data[1].split()))
    vectors = [list(map(float, data[2 + i].split())) for i in range(n)]
    # 'query' is the question vector; 'vectors' are the n chunk vectors.

    # TODO: compute cosine_similarity(query, vectors[i]) for each i
    #       (return 0.0 if either vector has magnitude 0).
    # TODO: rank indices by similarity descending, ties by ascending index.
    # TODO: print the ranking as space-separated indices on one line.
    # TODO: then print one line per ranked index: "<index> <similarity to 4 decimals>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    query = list(map(float, data[1].split()))
    vectors = [list(map(float, data[2 + i].split())) for i in range(n)]

    def magnitude(v):
        return sum(x * x for x in v) ** 0.5

    def cosine_similarity(a, b):
        ma, mb = magnitude(a), magnitude(b)
        if ma == 0 or mb == 0:
            return 0.0
        return sum(x * y for x, y in zip(a, b)) / (ma * mb)

    sims = [cosine_similarity(query, v) for v in vectors]
    order = sorted(range(n), key=lambda i: (-sims[i], i))

    print(" ".join(map(str, order)))
    for i in order:
        print(f"{i} {sims[i]:.4f}")

main()
`,
      challenge_test_cases: [
        {
          input: "3 2\n1 1\n2 2\n1 -1\n-1 -1",
          expected_output: "0 1 2\n0 1.0000\n1 0.0000\n2 -1.0000",
          description: "One chunk points the same direction, one is orthogonal, one is opposite the query.",
        },
        {
          input: "2 3\n1 0 0\n5 0 0\n0 5 0",
          expected_output: "0 1\n0 1.0000\n1 0.0000",
          description: "A chunk aligned with the query scores 1.0; a perpendicular one scores 0.0.",
        },
        {
          input: "2 2\n1 0\n0 0\n1 0",
          expected_output: "1 0\n1 1.0000\n0 0.0000",
          description: "Edge: a zero-magnitude chunk vector scores 0.0 by definition, not an error.",
        },
      ],
    },

    {
      id: "prod-15-4",
      project_id: "prod-15",
      order: 4,
      title: "Retrieve Then Ask: Assembling the RAG Prompt",
      concept: "the RAG prompt",
      explanation: `You can find the chunks most relevant to a question. The next step turns "here are three relevant chunks" into a prompt the model answers from correctly, without inventing anything the chunks never said.

## The RAG prompt has a fixed shape

A RAG prompt always carries three parts: the rules, the retrieved context, and the question.

\`\`\`python
def build_context(chunks):
    return "\\n\\n".join(f"[{i + 1}] {c['text']}" for i, c in enumerate(chunks))

SYSTEM = """You are a helpful assistant that answers using ONLY the provided context.
Cite the source number(s) you used in brackets, like [1] or [2][3].
If the answer is not in the context, say you don't know. Do not guess."""

def build_rag_request(question, chunks):
    context = build_context(chunks)
    user = f"Context:\\n{context}\\n\\nQuestion: {question}"
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 500,
        "system": SYSTEM,
        "messages": [{"role": "user", "content": user}],
    }
\`\`\`

Notice each chunk gets a **number label**: \`[1]\`, \`[2]\`, and so on. That label lets the model cite its source, and it lets you check later that a citation points at a real chunk rather than a number the model invented.

## Why the system prompt is worded this way

Three lines carry most of the weight of a trustworthy RAG app:

1. **"ONLY the provided context"** stops the model from answering out of its own general knowledge when the document doesn't cover the topic. That's the biggest single source of RAG hallucination.
2. **"Cite the source number(s)"** gives you a way to verify the answer is grounded, and gives the user a way to check it too.
3. **"If the answer is not in the context, say you don't know"** hands the model a permitted way to refuse instead of confabulating a plausible wrong answer.

## Calling it

\`\`\`python
resp = client.messages.create(**build_rag_request(question, top_chunks))
answer = resp.content[0].text
\`\`\`

Everything before this call is search. Everything from here is a normal model call, the same shape as any other project in this track. The API call doesn't change for RAG. You just feed it smarter input.

## A way to picture it

A RAG prompt is an open-book exam question. You hand the model the exact pages it's allowed to use, numbered, and tell it to cite the page each fact came from. It can't flip to a page you never handed it. Below, build the context-assembly and prompt-building step in pure Python. No network call needed.`,
      starter_code: `# Assemble retrieved chunks into a numbered context block and a request payload.

def build_context(chunks):
    # TODO: join chunks as "[1] text", "[2] text", ... separated by a blank line.
    pass

def build_rag_request(question, chunks, system):
    # TODO: return a dict with keys model, max_tokens, system, messages.
    #       messages is a single user turn: "Context:\\n<context>\\n\\nQuestion: <question>"
    pass

SYSTEM = "You are a helpful assistant that answers using ONLY the provided context."
chunks = [{"text": "The refund window is 30 days."}, {"text": "Refunds are issued to the original payment method."}]
req = build_rag_request("How long is the refund window?", chunks, SYSTEM)
print(req["messages"][0]["content"])
`,
      solution_code: `# Assemble retrieved chunks into a numbered context block and a request payload.

def build_context(chunks):
    return "\\n\\n".join(f"[{i + 1}] {c['text']}" for i, c in enumerate(chunks))

def build_rag_request(question, chunks, system):
    context = build_context(chunks)
    user = f"Context:\\n{context}\\n\\nQuestion: {question}"
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 500,
        "system": system,
        "messages": [{"role": "user", "content": user}],
    }

SYSTEM = "You are a helpful assistant that answers using ONLY the provided context."
chunks = [{"text": "The refund window is 30 days."}, {"text": "Refunds are issued to the original payment method."}]

req = build_rag_request("How long is the refund window?", chunks, SYSTEM)
print(req["messages"][0]["content"])
print("---")
print("keys:", sorted(req.keys()))
`,
      hints: [
        "enumerate(chunks) with start index i gives you the label i + 1 for each chunk.",
        "Join labeled chunks with '\\n\\n' (a blank line) so they read as distinct blocks.",
        "The user content is an f-string combining 'Context:', the joined block, then the question.",
      ],
      challenge_title: "Assemble the Context Block",
      challenge_description:
        "Greedily pack ranked chunks into a labeled context block without exceeding a character budget, always including at least the top chunk.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    budget = int(lines[0].strip())
    n = int(lines[1].strip())
    chunks = []
    for i in range(n):
        parts = lines[2 + i].split(" ", 1)
        chunks.append((parts[0], parts[1] if len(parts) > 1 else ""))
    # 'chunks' is a list of (id, text) in ranked order (best first).

    # TODO: build entries "[id] text" one per chunk, in order.
    # TODO: always include the first entry, even if it alone exceeds budget.
    # TODO: for each next entry, if total + 2 (blank line) + len(entry) <= budget,
    #       include it and update total; otherwise STOP (don't skip ahead).
    # TODO: print the count included, then the joined block
    #       (entries separated by a blank line).

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    budget = int(lines[0].strip())
    n = int(lines[1].strip())
    chunks = []
    for i in range(n):
        parts = lines[2 + i].split(" ", 1)
        chunks.append((parts[0], parts[1] if len(parts) > 1 else ""))

    included = []
    total = 0
    for idx, (cid, text) in enumerate(chunks):
        entry = f"[{cid}] {text}"
        if idx == 0:
            included.append(entry)
            total = len(entry)
            continue
        extra = 2 + len(entry)
        if total + extra <= budget:
            included.append(entry)
            total += extra
        else:
            break

    print(len(included))
    print("\\n\\n".join(included))

main()
`,
      challenge_test_cases: [
        {
          input: "20\n3\n1 hello world\n2 foo\n3 bar",
          expected_output: "1\n[1] hello world",
          description: "The second entry would push the block past budget 20, so packing stops there.",
        },
        {
          input: "50\n3\n1 hello world\n2 foo\n3 bar",
          expected_output: "3\n[1] hello world\n\n[2] foo\n\n[3] bar",
          description: "A generous budget fits all three labeled chunks.",
        },
        {
          input: "5\n2\n1 hi\n2 yo",
          expected_output: "1\n[1] hi",
          description: "Edge: even the first entry alone exceeds the tiny budget, but it's still included.",
        },
      ],
    },

    {
      id: "prod-15-5",
      project_id: "prod-15",
      order: 5,
      title: "Multiple Chunks: Top-K and Deduplication",
      concept: "top-k retrieval and deduplication",
      explanation: `A real question is often answered by more than one paragraph, spread across the document. So you retrieve the top few chunks, not just the single best one. But the overlapping windows from lesson 1 introduce a new problem: several of your top matches can be near-duplicates of each other, and three copies of the same sentence eat prompt budget without adding a thing.

## Top-k retrieval

**Top-k** means "take the k highest-scoring chunks instead of one." A typical RAG app sets k between 3 and 6.

\`\`\`python
def top_k(scored_chunks, k):
    ranked = sorted(scored_chunks, key=lambda c: -c["score"])
    return ranked[:k]
\`\`\`

That's enough for a document with no overlap. But your chunker used a sliding window, so chunk 4 and chunk 5 can share most of their text by design. If both score high, top-k hands the model the same sentence twice under two different labels.

## Deduplicating near-identical chunks

Here's a cheap check that works: if one chunk's text sits entirely inside another's, they say the same thing, so drop the shorter one.

\`\`\`python
def is_duplicate(candidate, kept):
    return any(
        candidate["text"] in existing["text"] or existing["text"] in candidate["text"]
        for existing in kept
    )
\`\`\`

## Combine them: scan until you have k unique chunks

Don't dedupe after slicing the top k, because that can leave you with fewer than k chunks. Instead, scan in score order, skip duplicates as you go, and stop once you've collected k unique chunks:

\`\`\`python
def retrieve_unique(scored_chunks, k):
    ranked = sorted(scored_chunks, key=lambda c: -c["score"])
    kept = []
    for c in ranked:
        if is_duplicate(c, kept):
            continue
        kept.append(c)
        if len(kept) == k:
            break
    return kept
\`\`\`

This keeps looking past the naive top-k cutoff, so a duplicate at rank 2 doesn't quietly shrink your final context below the k chunks you asked for.

## Where it earns its keep

Without dedup, overlapping chunks eat your context budget. You can send 3 chunks that really cover 2 distinct ideas, paying tokens to repeat one sentence. Scanning past duplicates instead of cutting at a fixed rank means your k chunks are k genuinely different pieces of the document.

## A way to picture it

Top-k picks the highest scores. Dedup makes sure you don't pick the same paragraph twice under two different chunk IDs. Below, implement the scan-and-skip retrieval described above. No network needed, just ranking and substring checks.`,
      starter_code: `# Scan chunks in score order, skipping near-duplicates, until k uniques are kept.

def is_duplicate(candidate, kept):
    # TODO: return True if candidate's text is a substring of any kept chunk's
    #       text, or any kept chunk's text is a substring of candidate's text.
    pass

def retrieve_unique(scored_chunks, k):
    ranked = sorted(scored_chunks, key=lambda c: -c["score"])
    kept = []
    # TODO: walk 'ranked'; skip duplicates via is_duplicate; append unique ones;
    #       stop once len(kept) == k.
    return kept

chunks = [
    {"id": 0, "score": 10, "text": "the cat sat"},
    {"id": 1, "score": 9, "text": "the cat sat on the mat"},
    {"id": 2, "score": 8, "text": "dogs bark loud"},
]
result = retrieve_unique(chunks, 2)
print([c["id"] for c in result])
`,
      solution_code: `# Scan chunks in score order, skipping near-duplicates, until k uniques are kept.

def is_duplicate(candidate, kept):
    return any(
        candidate["text"] in existing["text"] or existing["text"] in candidate["text"]
        for existing in kept
    )

def retrieve_unique(scored_chunks, k):
    ranked = sorted(scored_chunks, key=lambda c: -c["score"])
    kept = []
    for c in ranked:
        if is_duplicate(c, kept):
            continue
        kept.append(c)
        if len(kept) == k:
            break
    return kept

chunks = [
    {"id": 0, "score": 10, "text": "the cat sat"},
    {"id": 1, "score": 9, "text": "the cat sat on the mat"},
    {"id": 2, "score": 8, "text": "dogs bark loud"},
]

result = retrieve_unique(chunks, 2)
print("kept ids:", [c["id"] for c in result])
print("kept count:", len(result))
`,
      hints: [
        "is_duplicate checks 'candidate[\"text\"] in existing[\"text\"]' OR the reverse, against every already-kept chunk.",
        "Sort scored_chunks once by -score before scanning, so you always try the highest score first.",
        "Break out of the loop the moment len(kept) == k; don't keep scanning past that.",
      ],
      challenge_title: "Fill Top-K After Deduping",
      challenge_description:
        "Scan chunks in descending score order, skipping any whose text duplicates an already-kept chunk, until k unique chunks are collected.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n, k = map(int, lines[0].split())
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split(" ", 2)
        chunks.append((int(parts[0]), int(parts[1]), parts[2]))
    # each chunk is (id, score, text)

    # TODO: sort chunks by score descending, ties by ascending id.
    # TODO: scan in that order; a chunk is a duplicate if its text is a substring
    #       of an already-kept chunk's text, or vice versa; skip duplicates.
    # TODO: stop once k unique chunks are kept, or the list runs out.
    # TODO: print the kept ids, in the order they were kept, space-separated.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n, k = map(int, lines[0].split())
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split(" ", 2)
        chunks.append((int(parts[0]), int(parts[1]), parts[2]))

    ranked = sorted(chunks, key=lambda c: (-c[1], c[0]))

    kept = []
    for cid, score, text in ranked:
        if any(text in kt or kt in text for _, kt in kept):
            continue
        kept.append((cid, text))
        if len(kept) == k:
            break

    print(" ".join(str(cid) for cid, _ in kept))

main()
`,
      challenge_test_cases: [
        {
          input: "4 2\n0 10 the cat sat\n1 9 the cat sat on the mat\n2 8 dogs bark loud\n3 7 dogs bark",
          expected_output: "0 2",
          description: "Chunk 1 duplicates chunk 0's text and is skipped; chunk 2 fills the second slot.",
        },
        {
          input: "3 3\n0 5 alpha\n1 4 alpha beta\n2 3 gamma",
          expected_output: "0 2",
          description: "Only two unique chunks exist even though k asked for three.",
        },
        {
          input: "2 2\n0 1 foo\n1 2 bar",
          expected_output: "1 0",
          description: "No duplicates at all; both chunks are kept in score order.",
        },
      ],
    },

    {
      id: "prod-15-6",
      project_id: "prod-15",
      order: 6,
      title: "When the Answer Isn't in the Document",
      concept: "grounding and refusal",
      explanation: `The worst failure in a RAG app is rarely a crash. It's a confident, well-written answer that happens to be wrong because the document never covered the question. This lesson catches that before it reaches the user.

## Two guards, two jobs

- **Before the call**: if nothing retrieved is actually relevant, don't ask the model at all. Say so.
- **After the call**: if the model cites a source, check the citation is real.

## Guard one: the similarity floor

Cosine similarity hands you a warning sign for free. If the *best* chunk still scores low, the document probably doesn't cover the topic, and no amount of clever prompting fixes that. Set a floor and refuse below it:

\`\`\`python
def should_answer(top_score, threshold=0.2):
    return top_score >= threshold

if not should_answer(ranked[0]["score"]):
    print("I don't know based on the document.")
else:
    resp = client.messages.create(**build_rag_request(question, kept_chunks))
    print(resp.content[0].text)
\`\`\`

It also saves money. A question with no relevant match skips the more expensive generation call entirely.

## Guard two: citation validation

Even with good context, a model will sometimes cite a source number that doesn't exist, like "[5]" when you sent only 3 chunks. That's a small but real hallucination. Catch it with a regex:

\`\`\`python
import re

def extract_citations(text):
    return sorted({int(n) for n in re.findall(r"\\[(\\d+)\\]", text)})

def citations_valid(citations, num_chunks):
    return all(1 <= c <= num_chunks for c in citations)
\`\`\`

If \`citations_valid\` fails, treat the answer as untrustworthy. Retry, strip the bad citation, or fall back to "I couldn't verify this answer."

## Where it earns its keep

A RAG app that never says "I don't know" is harder to trust, because you can't tell its confident wrong answers from its confident right ones. The similarity floor and the citation check cost almost nothing. They're what separates a demo that shines on the happy path from a tool people rely on when the document falls short.

## A way to picture it

Treat every answer as a claim that has to show its work. No relevant chunk above the floor means the model shouldn't even try. A citation pointing outside the numbered sources you sent means the model is quoting something you never gave it. Below, implement both checks in pure Python.`,
      starter_code: `# Two grounding guards: a similarity floor, and a citation validator.
import re

def should_answer(top_score, threshold=0.2):
    # TODO: return True only if top_score is at or above threshold.
    pass

def extract_citations(text):
    # TODO: find all "[n]" markers and return the sorted set of unique ints.
    pass

def citations_valid(citations, num_chunks):
    # TODO: return True only if every citation is between 1 and num_chunks inclusive.
    pass

print(should_answer(0.5))
print(should_answer(0.1))
print(extract_citations("Paris is the capital [1] with 2M people [2]."))
`,
      solution_code: `# Two grounding guards: a similarity floor, and a citation validator.
import re

def should_answer(top_score, threshold=0.2):
    return top_score >= threshold

def extract_citations(text):
    return sorted({int(n) for n in re.findall(r"\\[(\\d+)\\]", text)})

def citations_valid(citations, num_chunks):
    return all(1 <= c <= num_chunks for c in citations)

print("should_answer(0.5):", should_answer(0.5))
print("should_answer(0.1):", should_answer(0.1))

answer = "Paris is the capital [1] with 2M people [2]."
cites = extract_citations(answer)
print("citations:", cites)
print("valid against 2 chunks:", citations_valid(cites, 2))
print("valid against 1 chunk:", citations_valid(cites, 1))
`,
      hints: [
        "should_answer is a single comparison: top_score >= threshold.",
        "re.findall(r'\\\\[(\\\\d+)\\\\]', text) returns the digits as strings; wrap each in int().",
        "citations_valid uses all(1 <= c <= num_chunks for c in citations); an empty citations list is trivially valid.",
      ],
      challenge_title: "Validate the Grounded Answer",
      challenge_description:
        "Decide whether a RAG answer is trustworthy: refuse below a similarity floor, and reject citations that point past the chunks actually provided.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import re

def main():
    first = sys.stdin.readline().split()
    threshold, top_score, num_chunks = float(first[0]), float(first[1]), int(first[2])
    answer = sys.stdin.readline().rstrip("\\n")

    # TODO: if top_score < threshold, print "NO_ANSWER" and stop.
    # TODO: otherwise extract citation numbers from 'answer' via "[n]" markers.
    # TODO: if any citation is outside 1..num_chunks, print "INVALID_CITATION".
    # TODO: otherwise print "OK", then a line with the sorted unique citations
    #       space-separated, or "NONE" if there were no citations.

main()
`,
      challenge_solution_code: `import sys
import re

def main():
    first = sys.stdin.readline().split()
    threshold, top_score, num_chunks = float(first[0]), float(first[1]), int(first[2])
    answer = sys.stdin.readline().rstrip("\\n")

    if top_score < threshold:
        print("NO_ANSWER")
        return

    citations = sorted({int(n) for n in re.findall(r"\\[(\\d+)\\]", answer)})

    if any(c < 1 or c > num_chunks for c in citations):
        print("INVALID_CITATION")
        return

    print("OK")
    print(" ".join(map(str, citations)) if citations else "NONE")

main()
`,
      challenge_test_cases: [
        {
          input: "0.2 0.5 3\nParis is the capital [1] and has a population of 2M [2].",
          expected_output: "OK\n1 2",
          description: "Both citations fall within the 3 provided chunks.",
        },
        {
          input: "0.2 0.1 3\nI think it's Paris.",
          expected_output: "NO_ANSWER",
          description: "The top similarity is below the floor, so the app refuses before checking citations.",
        },
        {
          input: "0.2 0.6 2\nIt happened in 1990 [3].",
          expected_output: "INVALID_CITATION",
          description: "Citation [3] points past the 2 chunks that were actually provided.",
        },
        {
          input: "0.2 0.6 2\nI could not verify further details.",
          expected_output: "OK\nNONE",
          description: "A grounded answer with no citation markers is still valid, just uncited.",
        },
      ],
    },

    {
      id: "prod-15-7",
      project_id: "prod-15",
      order: 7,
      title: "Harden: Big PDFs, Embedding Cost, and Bad Input",
      concept: "robustness and cost",
      explanation: `Your app works on the one clean PDF you tested with. A real user uploads a 300-page manual, re-uploads the same file twice, asks a blank question, or loses the network mid-embed. This lesson closes those gaps.

## Embedding costs money, per chunk

Every chunk you embed is an API call (batched or not) that costs tokens. A 300-page manual chunked at 800 characters can produce hundreds of chunks, so hundreds of embedding calls on every upload. That bill climbs fast when users re-upload the same document.

## Cache embeddings by content

The fix is simple. Hash each chunk's exact text and skip any chunk you've already embedded.

\`\`\`python
import hashlib

def chunk_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def embed_new_only(chunks, cache):
    to_embed = [c for c in chunks if chunk_hash(c) not in cache]
    if to_embed:
        vectors = vo.embed(to_embed, model="voyage-3", input_type="document").embeddings
        for text, vec in zip(to_embed, vectors):
            cache[chunk_hash(text)] = vec
    return {chunk_hash(c): cache[chunk_hash(c)] for c in chunks}
\`\`\`

An unchanged re-upload now costs zero new embedding calls. Only new or edited chunks get billed.

## Guard the edges before you spend anything

\`\`\`python
def prepare_upload(text, question):
    text = text.strip()
    if not text:
        raise ValueError("The document had no extractable text.")
    if not question.strip():
        raise ValueError("Ask a question before searching the document.")
\`\`\`

A scanned PDF with no OCR text, or a user hitting "ask" with an empty box, should fail with a clear message. Not a mysterious empty-vector crash three functions later.

## Retry the flaky call, but count every attempt

Embedding and generation calls both time out now and then. Wrap them in a retry. And when you tally cost, remember that every attempt spent input tokens, failed ones included:

\`\`\`python
import time

def call_with_retry(fn, tries=3):
    for attempt in range(tries):
        try:
            return fn()
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(2 ** attempt)
\`\`\`

## Where it earns its keep

RAG apps look cheap in a demo and turn expensive in production, because the embedding step scales with document size and re-uploads, not with how many questions people ask. Caching by content hash is the highest-leverage fix here. Most re-uploads edit a handful of pages, not the whole document.

## A way to picture it

Never pay to embed the same sentence twice. Below, tally the real embedding bill for a batch of chunks where some are exact repeats of earlier ones. Pure Python, mirroring the content-hash cache above.`,
      starter_code: `# Bill only chunks that haven't been seen (embedded) before in this batch.

def token_cost(text):
    return max(1, len(text) // 4)

def bill_batch(chunks):
    seen = set()
    total = 0
    skipped = 0
    for text in chunks:
        # TODO: if text is already in 'seen', increment skipped and continue.
        # TODO: otherwise add it to 'seen' and add token_cost(text) to total.
        pass
    return total, skipped

batch = ["abcdefgh", "abcdefgh", "hello world"]
total, skipped = bill_batch(batch)
print(total, skipped)
`,
      solution_code: `# Bill only chunks that haven't been seen (embedded) before in this batch.

def token_cost(text):
    return max(1, len(text) // 4)

def bill_batch(chunks):
    seen = set()
    total = 0
    skipped = 0
    for text in chunks:
        if text in seen:
            skipped += 1
            continue
        seen.add(text)
        total += token_cost(text)
    return total, skipped

batch = ["abcdefgh", "abcdefgh", "hello world"]
total, skipped = bill_batch(batch)

print("total billed:", total)
print("skipped (cached):", skipped)
`,
      hints: [
        "Use a set() to remember exact text you've already billed for.",
        "A duplicate chunk (already in 'seen') costs nothing and increments 'skipped', not 'total'.",
        "token_cost uses max(1, len(text) // 4), the same estimate-tokens convention from earlier lessons.",
      ],
      challenge_title: "Bill Only New Chunks",
      challenge_description:
        "Compute the true embedding bill for a batch of chunks where exact re-uploads of already-seen text are free, not billed again.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    chunks = lines[1:1 + n]
    # 'chunks' are n chunk texts in upload order; identical text repeats are cached.

    # TODO: for each chunk, if its exact text was already seen earlier in the
    #       batch, skip it (increment a skipped counter, add nothing to total).
    # TODO: otherwise mark it seen and add max(1, len(text) // 4) to the total.
    # TODO: print "<total> <skipped>".

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    chunks = lines[1:1 + n]

    seen = set()
    total = 0
    skipped = 0
    for text in chunks:
        if text in seen:
            skipped += 1
            continue
        seen.add(text)
        total += max(1, len(text) // 4)

    print(total, skipped)

main()
`,
      challenge_test_cases: [
        {
          input: "3\nabcdefgh\nabcdefgh\nhello world",
          expected_output: "4 1",
          description: "The repeated 8-char chunk is cached; only the two unique chunks (2 + 2 tokens) are billed.",
        },
        {
          input: "2\ntest\ndata",
          expected_output: "2 0",
          description: "Two distinct 4-char chunks are both billed once, one token each.",
        },
        {
          input: "1\n\n",
          expected_output: "1 0",
          description: "Edge: an empty chunk still costs the minimum 1 token, since it's new.",
        },
      ],
    },

    {
      id: "prod-15-8",
      project_id: "prod-15",
      order: 8,
      title: "Ship: The Full Chat-With-PDF Pipeline",
      concept: "shipping the RAG app",
      explanation: `Every piece is built. Now wire chunking, embedding, retrieval, dedup, the similarity floor, and the grounded prompt into one pipeline someone else could run from scratch. Finish this lesson and Chat With Your PDF lands in your **Portfolio**.

## The full pipeline, end to end

\`\`\`python
def ingest(path):
    text = extract_text(path)                       # lesson 1
    chunks = chunk_text(text, size=800, overlap=100) # lesson 1
    vectors = embed_new_only(chunks, cache={})       # lesson 7
    return chunks, vectors

def ask(question, chunks, vectors, threshold=0.2, k=4):
    q_vec = vo.embed([question], model="voyage-3", input_type="query").embeddings[0]
    scored = [
        {"text": c, "score": cosine_similarity(q_vec, vectors[chunk_hash(c)])}
        for c in chunks
    ]
    ranked = sorted(scored, key=lambda c: -c["score"])
    if not ranked or not should_answer(ranked[0]["score"], threshold):  # lesson 6
        return "I don't know based on the document."

    kept = retrieve_unique(ranked, k)                # lesson 5
    req = build_rag_request(question, kept, SYSTEM)  # lesson 4
    resp = client.messages.create(**req)
    return resp.content[0].text
\`\`\`

Nothing here is new. It's every earlier lesson's function called in the order you built them: ingest once per document, then \`ask\` once per question. The questions run cheap because the expensive chunking and embedding already happened.

## Wrap it in a small CLI

\`\`\`python
import sys

def main():
    path = sys.argv[1]
    chunks, vectors = ingest(path)
    print(f"Loaded {len(chunks)} chunks from {path}. Ask a question, or Ctrl+C to quit.")
    while True:
        question = input("> ")
        print(ask(question, chunks, vectors))

if __name__ == "__main__":
    main()
\`\`\`

One command, \`python chat_pdf.py report.pdf\`, then a loop of questions. Ingest runs once. Every question after that reuses the same chunks and vectors.

## What "shipped" means here

The same three checks from the playbook. It runs from a clean start with one command. It survives an empty document or a blank question without crashing (lesson 7's guards). And it refuses honestly instead of hallucinating when the document doesn't cover the question (lesson 6). Hit those three and you have a real deliverable.

## Into your Portfolio

Finishing this lesson records Chat With Your PDF in your **Portfolio** tab. Keep one real document and a question-and-answer pair around as proof it retrieves and grounds correctly. That's your demo.

## A way to picture it

A shipped RAG app hides five lessons of machinery behind one loop: ask a question, get back a grounded answer with sources, or an honest "I don't know." Below, wire the final dispatcher together in pure Python. No network required, and then it's done.`,
      starter_code: `# The final dispatcher: rank, floor-check, dedup, and assemble context, all in one pass.

def cosine_similarity(a, b):
    def mag(v):
        return sum(x * x for x in v) ** 0.5
    ma, mb = mag(a), mag(b)
    if ma == 0 or mb == 0:
        return 0.0
    return sum(x * y for x, y in zip(a, b)) / (ma * mb)

def pipeline(question_vec, scored_chunks, threshold, k):
    # scored_chunks is a list of {"text": ..., "vec": [...]}
    # TODO: compute similarity for each chunk against question_vec.
    # TODO: if the best score is below threshold, return "I don't know based on the document."
    # TODO: otherwise scan in score order, skipping substring-duplicates, until k are kept.
    # TODO: return the joined "[i] text" context block for the kept chunks.
    pass

chunks = [
    {"text": "Refunds take 5 business days.", "vec": [1, 0]},
    {"text": "The refund window is 30 days.", "vec": [0.9, 0.1]},
    {"text": "Our office is closed on holidays.", "vec": [0, 1]},
]
print(pipeline([1, 0], chunks, threshold=0.2, k=2))
`,
      solution_code: `# The final dispatcher: rank, floor-check, dedup, and assemble context, all in one pass.

def cosine_similarity(a, b):
    def mag(v):
        return sum(x * x for x in v) ** 0.5
    ma, mb = mag(a), mag(b)
    if ma == 0 or mb == 0:
        return 0.0
    return sum(x * y for x, y in zip(a, b)) / (ma * mb)

def pipeline(question_vec, scored_chunks, threshold, k):
    ranked = sorted(
        scored_chunks,
        key=lambda c: -cosine_similarity(question_vec, c["vec"]),
    )
    if not ranked or cosine_similarity(question_vec, ranked[0]["vec"]) < threshold:
        return "I don't know based on the document."

    kept = []
    for c in ranked:
        if any(c["text"] in k2["text"] or k2["text"] in c["text"] for k2 in kept):
            continue
        kept.append(c)
        if len(kept) == k:
            break

    return "\\n\\n".join(f"[{i + 1}] {c['text']}" for i, c in enumerate(kept))

chunks = [
    {"text": "Refunds take 5 business days.", "vec": [1, 0]},
    {"text": "The refund window is 30 days.", "vec": [0.9, 0.1]},
    {"text": "Our office is closed on holidays.", "vec": [0, 1]},
]

print(pipeline([1, 0], chunks, threshold=0.2, k=2))
print("---")
print("Chat With Your PDF built. Saved to your Portfolio.")
`,
      hints: [
        "Sort scored_chunks by cosine_similarity(question_vec, c['vec']) descending before anything else.",
        "The floor check only looks at the single best score; if it's below threshold, return the fallback string immediately.",
        "Reuse the same scan-and-skip dedup loop from lesson 5 to fill up to k kept chunks.",
      ],
      challenge_title: "Route the Question",
      challenge_description:
        "Decide whether a question can be answered at all, and if so, which unique chunks (deduplicated, up to k) get used to answer it.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    threshold, k, n = lines[0].split()
    threshold = float(threshold)
    k = int(k)
    n = int(n)
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split(" ", 2)
        chunks.append((int(parts[0]), float(parts[1]), parts[2]))
    # each chunk is (id, score, text)

    # TODO: find the best score among all chunks (0 if there are none).
    # TODO: if the best score < threshold, print "NO_ANSWER" and stop.
    # TODO: otherwise sort chunks by score descending (ties by ascending id),
    #       scan and skip substring-duplicates, keep up to k unique chunks.
    # TODO: print "ANSWER", then the kept ids in kept order, space-separated.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    threshold, k, n = lines[0].split()
    threshold = float(threshold)
    k = int(k)
    n = int(n)
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split(" ", 2)
        chunks.append((int(parts[0]), float(parts[1]), parts[2]))

    best = max((score for _, score, _ in chunks), default=0.0)
    if best < threshold:
        print("NO_ANSWER")
        return

    ranked = sorted(chunks, key=lambda c: (-c[1], c[0]))
    kept = []
    for cid, score, text in ranked:
        if any(text in kt or kt in text for _, kt in kept):
            continue
        kept.append((cid, text))
        if len(kept) == k:
            break

    print("ANSWER")
    print(" ".join(str(cid) for cid, _ in kept))

main()
`,
      challenge_test_cases: [
        {
          input: "5 2 4\n0 10 the cat sat\n1 9 the cat sat on the mat\n2 8 dogs bark loud\n3 1 cats meow",
          expected_output: "ANSWER\n0 2",
          description: "Chunk 1 duplicates chunk 0's text and is skipped, so chunk 2 fills the second slot.",
        },
        {
          input: "5 2 2\n0 2 a\n1 1 b",
          expected_output: "NO_ANSWER",
          description: "The best score (2) is below the threshold (5), so the app refuses before ranking anything.",
        },
        {
          input: "5 3 2\n0 10 alpha\n1 9 beta",
          expected_output: "ANSWER\n0 1",
          description: "Edge: fewer unique chunks exist than k asks for, so both available chunks are returned.",
        },
      ],
    },
  ],
};
