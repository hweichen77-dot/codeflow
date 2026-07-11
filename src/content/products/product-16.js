const project = {
  id: "prod-16",
  title: "Semantic Search Engine",
  description:
    "Build a search tool that finds results by meaning instead of matching keywords. By lesson 8 you have a working engine that embeds a corpus, ranks it by cosine similarity, and returns the top-k matches with scores.",
  difficulty: "intermediate",
  category: "rag_search",
  estimated_time: 130,
  lessons_count: 8,
  tags: ["embeddings", "semantic-search", "cosine-similarity", "vector-search", "rag", "voyage-ai"],
  order: 116,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-16-1",
    project_id: "prod-16",
    order: 1,
    title: "Search by Meaning, Not Keywords",
    concept: "embeddings and semantic search",
    explanation: `Over the next eight lessons you'll build a search tool that finds results by **meaning**, not by matching keywords. Search "puppy training tips" and it should also surface a document titled "how to teach your dog to sit," even though the two share almost no words in common. By the end you'll have a working engine you can point at any small dataset and query in plain English.

## Keyword search hits a wall

Classic search (grep, SQL \`LIKE\`, a basic search box) matches literal substrings. It can't tell that "car" and "automobile" mean roughly the same thing, or that "return policy" and "how do I send this back" are asking the same question. It's fast and simple, but it's blind to meaning.

## What an embedding is

An **embedding** is a list of floating-point numbers, produced by a model, that represents the meaning of a piece of text as a point in space. Two texts with similar meaning get embeddings that land close together in that space; two unrelated texts land far apart. A real embedding vector is typically hundreds to over a thousand numbers long, but the intuition is the same as a 2D map: closeness in the vector space mirrors closeness in meaning.

## Calling a real embeddings API

Claude's Messages API has no built-in embeddings endpoint. Anthropic's documented recommendation for text embeddings is **Voyage AI**, an embeddings provider Anthropic partners with directly for exactly this purpose:

\`\`\`python
import os
import voyageai

vo = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])

texts = [
    "The cat sat on the mat.",
    "A feline rested on the rug.",
    "Stock prices fell sharply today.",
]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
vectors = result.embeddings
print(len(vectors), len(vectors[0]))
\`\`\`

\`vo.embed\` sends a batch of texts and gets back one vector per text. The first two sentences, both about a cat resting somewhere, will land close together. The third sentence, about stock prices, lands far from both, even though it shares zero words with the others.

## The mental model

Picture every document as a dot dropped onto a giant map, where meaning, not geography, decides its position. A query is just one more dot on that same map. Semantic search is the simple act of asking "which dots sit nearest my query's dot?" Every lesson from here is in service of answering that one question quickly and correctly: how do we get texts onto the map (embedding), how do we measure "nearest" (similarity), and how do we return only the closest few (top-k).

The rest of this lesson builds the smallest possible piece: a corpus that already carries its vectors, so you can see the shape of the data before you worry about computing anything.`,
    starter_code: `# A "corpus" is just a list of documents, each carrying its embedding vector.
# Real vectors come from an API call like vo.embed() (see the explanation
# above); here they are given to you directly so this runs offline.

corpus = [
    {"id": 1, "text": "The cat sat on the mat.", "vector": [0.9, 0.1, 0.0]},
    {"id": 2, "text": "A feline rested on the rug.", "vector": [0.85, 0.15, 0.05]},
    {"id": 3, "text": "Stock prices fell sharply today.", "vector": [0.05, 0.1, 0.9]},
]

# TODO: print the number of documents in the corpus.
# TODO: print the vector dimension (length) of the first document's vector.
# TODO: check that every document's vector has the same dimension; print True/False.
`,
    solution_code: `corpus = [
    {"id": 1, "text": "The cat sat on the mat.", "vector": [0.9, 0.1, 0.0]},
    {"id": 2, "text": "A feline rested on the rug.", "vector": [0.85, 0.15, 0.05]},
    {"id": 3, "text": "Stock prices fell sharply today.", "vector": [0.05, 0.1, 0.9]},
]

print("Documents:", len(corpus))

dim = len(corpus[0]["vector"])
print("Dimension:", dim)

same_dim = all(len(doc["vector"]) == dim for doc in corpus)
print("Consistent dimension:", same_dim)
`,
    hints: [
      "len(corpus) gives the document count; len(corpus[0][\"vector\"]) gives the dimension.",
      "Use all(...) with a generator expression to check every vector matches the first one's length.",
      "This lesson doesn't compute anything about meaning yet, it just confirms the data shape is sane before you embed a real corpus.",
    ],
    challenge_title: "Same Dimension or Bust",
    challenge_description:
      "Validate that every vector in a corpus has the same dimension before you try to search it. A mismatched vector silently breaks every similarity score computed downstream.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    vectors = [list(map(float, data[1 + i].split())) for i in range(n)]

    # TODO: dim = the length of the first vector.
    # TODO: find the index of the first vector whose length differs from dim.
    # TODO: if none differ, print "OK" then dim.
    # TODO: otherwise print "MISMATCH" then the (0-based) index that differs.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    vectors = [list(map(float, data[1 + i].split())) for i in range(n)]

    dim = len(vectors[0])
    mismatch_index = None
    for i, v in enumerate(vectors):
        if len(v) != dim:
            mismatch_index = i
            break

    if mismatch_index is None:
        print("OK")
        print(dim)
    else:
        print("MISMATCH")
        print(mismatch_index)

main()
`,
    challenge_test_cases: [
      {
        input: "3\n1 2 3\n4 5 6\n7 8 9",
        expected_output: "OK\n3",
        description: "All three vectors share dimension 3.",
      },
      {
        input: "3\n1 2 3\n4 5\n7 8 9",
        expected_output: "MISMATCH\n1",
        description: "The second vector (index 1) has dimension 2 instead of 3.",
      },
      {
        input: "1\n1 2 3 4",
        expected_output: "OK\n4",
        description: "Edge: a single vector is trivially consistent with itself.",
      },
      {
        input: "4\n1 2\n3 4\n5 6\n7 8 9",
        expected_output: "MISMATCH\n3",
        description: "The mismatch can appear at the very last vector.",
      },
    ],
  },

  {
    id: "prod-16-2",
    project_id: "prod-16",
    order: 2,
    title: "Turning Text into Vectors",
    concept: "batch embedding a corpus",
    explanation: `Lesson 1 gave you vectors for free. Now you'll actually produce them, and the key decision is doing it in **one batch call** instead of one call per document.

## Batching, not looping

A naive first attempt embeds documents one at a time in a loop, calling the API once per document. That's slow (one network round trip per doc) and, on most providers, more expensive than sending them together. The fix is simple: collect every text you need embedded, then send them as a single batch request.

\`\`\`python
import voyageai

vo = voyageai.Client()

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

texts = [d["text"] for d in docs]
result = vo.embed(texts, model="voyage-3.5", input_type="document")

for doc, vector in zip(docs, result.embeddings):
    doc["vector"] = vector

print(docs[0]["text"], "->", len(docs[0]["vector"]), "dims")
\`\`\`

One request in, one vector per text out, in the same order you sent them. That's the whole shape of building an **index**: a corpus where every document now also carries its vector.

## Documents vs. queries

Notice the \`input_type="document"\` argument. Voyage's models are trained so that documents and search queries are embedded slightly differently, documents anticipate being searched, queries anticipate searching. When you later embed the user's search text, you'll pass \`input_type="query"\` instead. Using the wrong one for a given side of the search doesn't crash anything, it just quietly makes your rankings worse, so it's worth getting right from the start.

## Why batching matters as the corpus grows

A batch call to an embeddings API has a maximum number of texts (and total tokens) it accepts per request, and there's usually a per-minute rate limit too. A 10,000-document corpus isn't one call, it's dozens of calls of a few hundred documents each. You'll build the chunking logic for that in a later lesson; for now, the important habit is: gather all the texts you need first, then embed them together, rather than interleaving embed calls with other work.

## The drill below

Since there's no network in this sandbox, you'll build the exact same pipeline shape, collect texts, embed in one batch, attach vectors back to their documents, using a deterministic pure-Python stand-in for the real embed call. The stand-in turns each text into a tiny 5-number vector by counting its vowels. It's not a real embedding (it knows nothing about meaning), but it lets you practice the batching pattern you'll reuse with a real API for the rest of this build.`,
    starter_code: `# Pure-Python stand-in for a real embeddings API call.
# It turns each text into a small vector by counting vowels, deterministic,
# so it's not a real embedding, but it lets us build and test the batching
# pipeline offline exactly the same shape as a real embed_fn.

VOWELS = "aeiou"

def toy_embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

def build_index(docs, embed_fn):
    # TODO: collect all texts from docs into one list.
    # TODO: embed them in ONE batch call to embed_fn.
    # TODO: return a new list of dicts, each with id, text, and vector.
    pass

index = build_index(docs, toy_embed)
print(len(index))
print(index[0]["vector"])
`,
    solution_code: `VOWELS = "aeiou"

def toy_embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

def build_index(docs, embed_fn):
    texts = [d["text"] for d in docs]
    vectors = embed_fn(texts)
    index = []
    for doc, vector in zip(docs, vectors):
        index.append({"id": doc["id"], "text": doc["text"], "vector": vector})
    return index

index = build_index(docs, toy_embed)
print(len(index))
for entry in index:
    print(entry["id"], entry["vector"])
`,
    hints: [
      "Build the full texts list first (a list comprehension over docs), then call embed_fn ONCE on that whole list.",
      "zip(docs, vectors) pairs each original document with its vector in the same order.",
      "The point of build_index is that embed_fn is called exactly once no matter how many documents there are.",
    ],
    challenge_title: "Batch-Embed the Corpus",
    challenge_description:
      "Embed a corpus in one batch pass using a deterministic vowel-count embedding, then report the index size and each document's vector.",
    challenge_language: "python",
    challenge_starter_code: `import sys

VOWELS = "aeiou"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    texts = [data[1 + i] for i in range(n)]

    # TODO: embed all texts in one batch (vowel counts a,e,i,o,u), producing
    #       one 5-number vector per text, in the same order as texts.
    # TODO: print n, then each vector as 5 space-separated counts.

main()
`,
    challenge_solution_code: `import sys

VOWELS = "aeiou"

def embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    texts = [data[1 + i] for i in range(n)]

    vectors = embed(texts)

    print(n)
    for vector in vectors:
        print(" ".join(map(str, vector)))

main()
`,
    challenge_test_cases: [
      {
        input: "3\nHello World\nData Science\nPython",
        expected_output: "3\n0 1 0 2 0\n2 2 1 0 0\n0 0 0 1 0",
        description: "'Hello World' has 1 e and 2 o's; 'Data Science' has 2 a's, 2 e's, 1 i; 'Python' has 1 o.",
      },
      {
        input: "1\nAEIOU",
        expected_output: "1\n1 1 1 1 1",
        description: "Case-insensitive: one of each vowel.",
      },
      {
        input: "2\nbcdfg\naaa",
        expected_output: "2\n0 0 0 0 0\n3 0 0 0 0",
        description: "Edge: a text with zero vowels produces the zero vector.",
      },
    ],
  },

  {
    id: "prod-16-3",
    project_id: "prod-16",
    order: 3,
    title: "Measuring Similarity with Cosine",
    concept: "cosine similarity",
    explanation: `You now have vectors. The next question is: given a query vector, how "close" is it to a document's vector? The standard answer for embeddings is **cosine similarity**.

## Why not just measure distance?

Your first instinct might be to measure straight-line distance between two vectors. The problem is that embedding vectors can vary in length (magnitude) for reasons that have nothing to do with meaning, longer documents sometimes produce vectors with larger magnitude than short ones, purely as an artifact of the model. If you measured raw distance, a long document about the exact right topic could score worse than a short, only vaguely related one, just because of its magnitude.

## What cosine similarity measures instead

Cosine similarity ignores magnitude entirely and measures the **angle** between two vectors. Two vectors pointing in exactly the same direction score 1.0, no matter how long either one is. Perpendicular (unrelated) vectors score 0.0. Opposite directions score -1.0. Because it only cares about direction, doubling a vector's length doesn't change its similarity to anything, exactly the property you want for comparing meaning regardless of document length.

## The formula

\`\`\`python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)
\`\`\`

- **Dot product** (\`dot\`): multiply matching positions and sum them. It's large when two vectors point the same way and both have big numbers in the same spots.
- **Norm** (\`norm_a\`, \`norm_b\`): each vector's own magnitude, its length if you drew it as an arrow from the origin.
- **Dividing by both norms** is exactly what cancels out magnitude, leaving only the angle.

## Using it on real embeddings

\`\`\`python
query_vector = vo.embed([user_query], model="voyage-3.5", input_type="query").embeddings[0]

for doc in index:
    score = cosine_similarity(query_vector, doc["vector"])
    print(doc["text"], round(score, 3))
\`\`\`

Real embeddings from Voyage are already close to unit length, so scores in practice usually land somewhere between about 0.0 and 1.0, with genuinely relevant matches often scoring 0.7 or higher and unrelated text scoring closer to 0.2-0.4. Don't treat those numbers as universal thresholds, they shift by model, but the ordering (which document scores highest) is what your search actually depends on.

## The mental model

Cosine similarity asks "are these two arrows pointing the same way?", not "are these two arrows the same length?" That's exactly the question you want answered when the arrows represent meaning, and it's the single function every later lesson builds on top of.`,
    starter_code: `import math

def cosine_similarity(a, b):
    # TODO: dot product of a and b (sum of element-wise products).
    # TODO: norm_a = euclidean magnitude of a; norm_b = euclidean magnitude of b.
    # TODO: return dot / (norm_a * norm_b).
    pass

v1 = [1, 0, 1]
v2 = [1, 1, 0]
v3 = [2, 0, 2]

print(round(cosine_similarity(v1, v2), 4))
print(round(cosine_similarity(v1, v3), 4))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b)

v1 = [1, 0, 1]
v2 = [1, 1, 0]
v3 = [2, 0, 2]

print(round(cosine_similarity(v1, v2), 4))
print(round(cosine_similarity(v1, v3), 4))
`,
    hints: [
      "sum(x * y for x, y in zip(a, b)) is the dot product in one line.",
      "math.sqrt(sum(x * x for x in a)) is the norm (magnitude) of a.",
      "v3 is just v1 scaled by 2, same direction, so its similarity to v1 should come out to exactly 1.0.",
    ],
    challenge_title: "Cosine Similarity from Scratch",
    challenge_description:
      "Compute the cosine similarity between two integer vectors read from stdin, guarding against a zero vector so you never divide by zero.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def main():
    lines = sys.stdin.read().split("\\n")
    a = list(map(float, lines[0].split()))
    b = list(map(float, lines[1].split()))

    # TODO: compute norm_a and norm_b.
    # TODO: if either norm is 0, print "0.0000" and stop.
    # TODO: otherwise compute the dot product and the similarity,
    #       and print it formatted to 4 decimal places.

main()
`,
    challenge_solution_code: `import sys, math

def main():
    lines = sys.stdin.read().split("\\n")
    a = list(map(float, lines[0].split()))
    b = list(map(float, lines[1].split()))

    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        print("0.0000")
        return

    dot = sum(x * y for x, y in zip(a, b))
    sim = dot / (norm_a * norm_b)
    print(f"{sim:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "1 0 1\n1 1 0",
        expected_output: "0.5000",
        description: "Two vectors at 60 degrees from each other score 0.5.",
      },
      {
        input: "2 0 2\n1 0 1",
        expected_output: "1.0000",
        description: "Same direction, different magnitude, still scores a perfect 1.0.",
      },
      {
        input: "0 0 0\n1 2 3",
        expected_output: "0.0000",
        description: "Edge: a zero vector returns 0.0000 instead of raising a division error.",
      },
      {
        input: "1 0\n0 1",
        expected_output: "0.0000",
        description: "Perpendicular vectors are unrelated and score 0.0000.",
      },
    ],
  },

  {
    id: "prod-16-4",
    project_id: "prod-16",
    order: 4,
    title: "Ranking the Whole Corpus",
    concept: "scoring and ranking documents",
    explanation: `Cosine similarity scores one pair of vectors. A search engine needs to score a query against **every** document in the corpus, then order them best-first. That's ranking.

## The ranking loop

\`\`\`python
def search(query_vector, index):
    scored = []
    for doc in index:
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc, score))
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return scored

results = search(query_vector, index)
for doc, score in results:
    print(f"{score:.3f}  {doc['text']}")
\`\`\`

Score every document once, then sort. For a corpus of a few thousand documents this is fast; you're doing a handful of multiplications per document, not calling any API. The embedding call is the expensive part, ranking is nearly free arithmetic.

## Ties need a rule

Two documents can legitimately score identically, especially with toy or small-dimension vectors, or when two entries are near-duplicates. If you sort only by score, Python's sort is stable, but "stable" just means ties keep whatever order they arrived in, which is an accident of how you built the corpus, not a real decision. A production search engine should have an explicit, deterministic tie-break, most simply, the smaller document ID wins:

\`\`\`python
scored.sort(key=lambda pair: (-pair[1], pair[0]["id"]))
\`\`\`

Sorting by \`(-score, id)\` sorts descending by score first (the negative sign flips ascending sort into descending), then ascending by ID only among ties. Two searches on the same corpus and query now always return results in the exact same order, which matters for testing, caching, and just not confusing users who search the same thing twice.

## Why you rank before you trim

It's tempting to stop as soon as you've found "enough good" documents, but you can't know a document is in the top 5 until you've compared it against everything else. Score first, sort second, then decide how many to keep (that's the next lesson). Trying to shortcut this by stopping early almost always produces wrong results the moment the corpus order changes.

## The mental model

Ranking turns a pile of independent similarity scores into a single, meaningful ordering, with ties broken the same way every time. It's the bridge between "I can compare two vectors" (lesson 3) and "I can hand a user a numbered list of results" (the next two lessons).`,
    starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

index = [
    {"id": 1, "vector": [1, 0, 1]},
    {"id": 2, "vector": [0, 1, 0]},
    {"id": 3, "vector": [2, 0, 2]},
]
query = [1, 0, 1]

def rank_documents(query_vector, index):
    # TODO: score every document with cosine_similarity.
    # TODO: sort descending by score; break ties by the smaller id first.
    # TODO: return a list of (id, score) tuples in ranked order.
    pass

ranked = rank_documents(query, index)
for doc_id, score in ranked:
    print(doc_id, round(score, 4))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

index = [
    {"id": 1, "vector": [1, 0, 1]},
    {"id": 2, "vector": [0, 1, 0]},
    {"id": 3, "vector": [2, 0, 2]},
]
query = [1, 0, 1]

def rank_documents(query_vector, index):
    scored = [(doc["id"], cosine_similarity(query_vector, doc["vector"])) for doc in index]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored

ranked = rank_documents(query, index)
for doc_id, score in ranked:
    print(doc_id, round(score, 4))
`,
    hints: [
      "Build the scored list first with a list comprehension over index, then sort it once.",
      "Sort key (-score, id) sorts by score descending and breaks ties by id ascending in one pass.",
      "Documents 1 and 3 point the same direction as the query, so they should tie at the top.",
    ],
    challenge_title: "Rank the Corpus",
    challenge_description:
      "Score every document in a corpus against a query vector with cosine similarity, then rank them highest-first, breaking ties by the smaller document id.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    # TODO: score every doc against query with cosine_similarity.
    # TODO: sort descending by score, tie-break by ascending id.
    # TODO: print "id score" (score as %.4f) for every doc, one per line.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    scored = [(doc_id, cosine_similarity(query, vector)) for doc_id, vector in docs]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    for doc_id, score in scored:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "3 3\n1 1 0 1\n2 0 1 0\n3 2 0 2\n1 0 1",
        expected_output: "1 1.0000\n3 1.0000\n2 0.0000",
        description: "Docs 1 and 3 point the same direction as the query and tie at 1.0; doc 2 is perpendicular and scores 0.",
      },
      {
        input: "2 2\n1 0 0\n2 1 1\n1 1",
        expected_output: "2 1.0000\n1 0.0000",
        description: "Doc 1 is the zero vector and scores 0; doc 2 matches the query direction exactly.",
      },
      {
        input: "3 2\n5 1 1\n2 1 1\n9 1 1\n1 1",
        expected_output: "2 1.0000\n5 1.0000\n9 1.0000",
        description: "Edge: all three docs tie at 1.0, so ascending id order (2, 5, 9) decides the ranking.",
      },
    ],
  },

  {
    id: "prod-16-5",
    project_id: "prod-16",
    order: 5,
    title: "Returning Top-K with Scores",
    concept: "top-k selection and result formatting",
    explanation: `A ranked list of every document isn't a search result, it's a wall of text. Real search returns the best few matches, usually called the **top-k**, along with a score so the caller can judge how confident each match is.

## Slicing off the top

Once \`rank_documents\` has produced a fully sorted list, getting the top-k is just a slice:

\`\`\`python
def top_k(ranked, k):
    k = min(k, len(ranked))
    return ranked[:k]
\`\`\`

The \`min(k, len(ranked))\` guard matters: if a caller asks for the top 10 results from a 3-document corpus, you don't want an index error or a padded list of missing entries, you want all 3 documents, no more, no less. Clamping k to the corpus size handles that for free.

## Putting the full pipeline together

\`\`\`python
def semantic_search(query_text, index, k=5):
    query_vector = vo.embed(
        [query_text], model="voyage-3.5", input_type="query"
    ).embeddings[0]

    ranked = rank_documents(query_vector, index)
    top = top_k(ranked, k)

    return [
        {"id": doc_id, "score": round(score, 4)}
        for doc_id, score in top
    ]
\`\`\`

This is the shape of a real semantic search function: embed the query, score and rank the whole corpus, slice to the requested size, and format the result as something a caller (a UI, an API response, another program) can consume directly. Notice the query only gets embedded once per search, no matter how large \`k\` is or how big the corpus is, the cost of a search is one embedding call plus cheap arithmetic.

## Why return the score at all

A bare list of matching documents hides useful information. A score of 0.91 means "this is almost certainly what the user meant." A score of 0.31 for the last item in a top-5 list means "this is a weak match included only because the other four ranked higher," it might not actually be relevant. Returning scores lets the caller decide whether to trust a result, show a "did you mean" fallback, or apply a cutoff of their own.

## The mental model

Top-k is a promise: "here are the k most-relevant documents, ranked, with proof of how relevant each one is." Everything upstream (embedding, scoring, sorting) exists to make that promise trustworthy. The next two lessons make sure the promise holds even when the input is messy.`,
    starter_code: `def top_k(ranked, k):
    # TODO: clamp k to len(ranked) so asking for more than exists is safe.
    # TODO: return the first k entries of ranked.
    pass

ranked = [(1, 0.92), (3, 0.81), (2, 0.40), (4, 0.10)]

print(top_k(ranked, 2))
print(top_k(ranked, 10))
`,
    solution_code: `def top_k(ranked, k):
    k = min(k, len(ranked))
    return ranked[:k]

ranked = [(1, 0.92), (3, 0.81), (2, 0.40), (4, 0.10)]

print(top_k(ranked, 2))
print(top_k(ranked, 10))
`,
    hints: [
      "k = min(k, len(ranked)) is the whole guard, apply it before slicing.",
      "ranked[:k] returns the first k items of an already-sorted list.",
      "Asking for more results than exist should return everything, not raise an error or pad the list.",
    ],
    challenge_title: "Top-K Search Results",
    challenge_description:
      "Given a corpus, a query vector, and k, run the full pipeline: score every document, rank them, then return only the top k results with their scores.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d, k = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    # TODO: score every doc, sort descending (tie-break ascending id),
    #       clamp k to n, print "id score" (%.4f) for the top k only.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d, k = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    scored = [(doc_id, cosine_similarity(query, vector)) for doc_id, vector in docs]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    k = min(k, n)
    for doc_id, score in scored[:k]:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "4 2 2\n1 3 4\n2 4 3\n3 -3 -4\n4 0 0\n3 4",
        expected_output: "1 1.0000\n2 0.9600",
        description: "Top 2 of 4 docs: doc 1 matches the query exactly, doc 2 is a close second at 0.96.",
      },
      {
        input: "3 2 10\n1 1 0\n2 0 1\n3 1 1\n1 0",
        expected_output: "1 1.0000\n3 0.7071\n2 0.0000",
        description: "Asking for k=10 with only 3 docs returns all 3, clamped safely.",
      },
      {
        input: "2 2 1\n5 1 1\n2 2 2\n1 1",
        expected_output: "2 1.0000",
        description: "Edge: both docs tie at 1.0, but only the top 1 is requested, so the smaller id (2) wins.",
      },
    ],
  },

  {
    id: "prod-16-6",
    project_id: "prod-16",
    order: 6,
    title: "Handling Bad Vectors and Empty Results",
    concept: "edge cases: zero vectors, dimension mismatches, empty corpora",
    explanation: `Every piece works on clean input. Real corpora are not clean: a document that failed to embed can leave a zero vector behind, a bug can attach a vector of the wrong length, and a search can run before the corpus has anything in it at all. This lesson hardens the pipeline against all three.

## Zero vectors

You already guard against this in \`cosine_similarity\` (lesson 3): if either vector's norm is 0, dividing would crash, so you return 0.0 instead. But *why* would a zero vector show up at all? In practice it usually means something upstream failed silently, an empty string got embedded, a placeholder document was never actually processed, or a bug zeroed out a field. Scoring it as 0.0 (rather than crashing the whole search) means one bad document doesn't take down every other result.

## Dimension mismatches

Every vector in an index should have the same length, the dimension your embedding model produces. If one doesn't, cosine similarity's \`zip(a, b)\` will silently truncate to the shorter length and produce a meaningless number instead of raising an error, which is worse than crashing: it looks like a valid result. The fix is to check dimension *before* scoring and skip (or flag) anything that doesn't match:

\`\`\`python
def safe_rank(query_vector, index):
    if not index:
        return []

    scored = []
    for doc in index:
        if len(doc["vector"]) != len(query_vector):
            continue  # skip: this doc never got embedded correctly
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc["id"], score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored
\`\`\`

## Empty corpora

If the index is empty, there is nothing to rank, and the correct answer is an empty list, not an error and not a crash on \`index[0]\` somewhere downstream. Check for this first, before touching anything else, so it short-circuits cleanly.

## Why this matters in production

A search engine that crashes on one malformed document, or returns garbage silently instead of skipping it, is worse than one that's a little slower. Real corpora get updated by many processes over time; something will eventually go wrong with one document's embedding. The goal isn't to prevent that, it's impossible to prevent entirely, it's to make sure one bad row degrades gracefully instead of breaking search for everyone.

## The mental model

Treat every document's vector as untrusted until you've checked it. A dimension check and a zero-vector guard cost a few lines of code and turn "the whole search engine is down" into "one document was silently skipped," which is the difference between a bug report and an outage.`,
    starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def safe_rank(query_vector, index):
    # TODO: if index is empty, return [] immediately.
    # TODO: skip any doc whose vector length doesn't match query_vector's length.
    # TODO: score the rest with cosine_similarity, sort desc, tie-break by id.
    pass

index = [
    {"id": 1, "vector": [1, 0]},
    {"id": 2, "vector": [1, 0, 0]},  # wrong dimension, should be skipped
    {"id": 3, "vector": [0, 0]},     # zero vector, should score 0.0
]
query = [1, 0]

print(safe_rank(query, index))
print(safe_rank(query, []))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def safe_rank(query_vector, index):
    if not index:
        return []

    scored = []
    for doc in index:
        if len(doc["vector"]) != len(query_vector):
            continue
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc["id"], score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored

index = [
    {"id": 1, "vector": [1, 0]},
    {"id": 2, "vector": [1, 0, 0]},
    {"id": 3, "vector": [0, 0]},
]
query = [1, 0]

print(safe_rank(query, index))
print(safe_rank(query, []))
`,
    hints: [
      "Check `if not index: return []` before anything else, so an empty corpus never reaches the scoring loop.",
      "`continue` inside the loop skips a mismatched document without stopping the whole function.",
      "The zero-vector guard already lives inside cosine_similarity, so a zero-vector doc still gets scored, just as 0.0.",
    ],
    challenge_title: "Search That Doesn't Crash",
    challenge_description:
      "Rank a corpus safely: skip any document whose vector dimension doesn't match the query, score zero vectors as 0.0 instead of crashing, and handle an empty corpus.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())

    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        dim = int(parts[1])
        vector = list(map(float, parts[2:2 + dim]))
        docs.append((doc_id, vector))

    # TODO: if n == 0, print "EMPTY" and stop (don't try to read a query line).
    # TODO: otherwise read the query vector from the next line.
    # TODO: skip any doc whose vector length != d (the query's dimension).
    # TODO: score the rest with cosine_similarity, sort desc (tie-break asc id),
    #       print "id score" (%.4f) for each, one per line.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())

    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        dim = int(parts[1])
        vector = list(map(float, parts[2:2 + dim]))
        docs.append((doc_id, vector))

    if n == 0:
        print("EMPTY")
        return

    query_line = data[1 + n] if len(data) > 1 + n else ""
    query = list(map(float, query_line.split()))

    scored = []
    for doc_id, vector in docs:
        if len(vector) != d:
            continue
        score = cosine_similarity(query, vector)
        scored.append((doc_id, score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    for doc_id, score in scored:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "3 2\n1 2 1 0\n2 3 1 0 0\n3 2 0 0\n1 0",
        expected_output: "1 1.0000\n3 0.0000",
        description: "Doc 2 has dimension 3 instead of 2 and is skipped; doc 3 is a zero vector and scores 0.0 instead of crashing.",
      },
      {
        input: "0 2\n1 0",
        expected_output: "EMPTY",
        description: "Edge: an empty corpus returns EMPTY instead of erroring on a missing query.",
      },
      {
        input: "3 2\n7 2 0 0\n4 2 0 0\n9 2 2 2\n1 1",
        expected_output: "9 1.0000\n4 0.0000\n7 0.0000",
        description: "Two zero-vector docs tie at 0.0 and are ordered by ascending id (4 before 7) after the real match.",
      },
    ],
  },

  {
    id: "prod-16-7",
    project_id: "prod-16",
    order: 7,
    title: "Cost, Caching, and Batching at Scale",
    concept: "embedding cost, caching duplicates, batching large corpora",
    explanation: `Every embedding call costs tokens, and a real corpus doesn't sit still, documents get added, edited, and re-indexed. This lesson is about not paying to embed the same thing twice, and not sending a batch so large the API rejects it.

## Cache identical texts

If your corpus has duplicate or repeated text, two support articles that happen to share a boilerplate paragraph, the same FAQ synced from two sources, re-embedding both wastes money and time for an identical result. A **cache** keyed by the exact text, kept in memory or in a small database, means each unique string only ever gets embedded once:

\`\`\`python
import voyageai

vo = voyageai.Client()

def embed_corpus(texts, cache, batch_size=128):
    to_embed = [t for t in texts if t not in cache]

    for i in range(0, len(to_embed), batch_size):
        batch = to_embed[i:i + batch_size]
        result = vo.embed(batch, model="voyage-3.5", input_type="document")
        for text, vector in zip(batch, result.embeddings):
            cache[text] = vector

    return [cache[t] for t in texts]
\`\`\`

Note the two things happening here: \`to_embed\` filters out anything already in the cache *before* any API call is made, and the loop below it chunks whatever's left into fixed-size batches. Rebuilding the same corpus a second time with this function makes zero API calls, everything is already cached.

## Batching for API limits, not just cost

Embedding providers cap how many texts (and how many total tokens) a single request can carry. A corpus of 10,000 unique documents isn't one call, it's however many batches of, say, 128 documents it takes to cover them all: \`ceil(10000 / 128)\` = 79 calls. Chunking a list into fixed-size pieces is the same pattern regardless of what's inside it:

\`\`\`python
def batch(items, batch_size):
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]
\`\`\`

## Estimating cost before you spend it

A rough rule of thumb for English text is about 4 characters per token. Before embedding a large corpus for the first time, it's worth estimating the bill:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

total = sum(estimate_tokens(t) for t in unique_texts)
\`\`\`

Summing that estimate over only the *unique* texts (not the duplicates the cache will skip) gives you a realistic number, not an inflated one.

## The mental model

Dedupe first, batch second, estimate third. Each step is cheap arithmetic that prevents an expensive mistake: dedupe stops you from paying twice for the same text, batching stops you from getting a request rejected for being too large, and estimating stops "I built the index" from turning into a surprise bill.`,
    starter_code: `def dedupe_preserve_order(texts):
    # TODO: return a list of the unique texts in texts, in first-seen order.
    pass

def batch(items, batch_size):
    # TODO: return a list of chunks of items, each up to batch_size long.
    pass

texts = ["cat", "dog", "cat", "bird", "dog", "fish"]
unique = dedupe_preserve_order(texts)
print(unique)

batches = batch(unique, 2)
print(batches)
print("Batches needed:", len(batches))
`,
    solution_code: `def dedupe_preserve_order(texts):
    seen = set()
    unique = []
    for t in texts:
        if t not in seen:
            seen.add(t)
            unique.append(t)
    return unique

def batch(items, batch_size):
    chunks = []
    for i in range(0, len(items), batch_size):
        chunks.append(items[i:i + batch_size])
    return chunks

texts = ["cat", "dog", "cat", "bird", "dog", "fish"]
unique = dedupe_preserve_order(texts)
print(unique)

batches = batch(unique, 2)
print(batches)
print("Batches needed:", len(batches))
`,
    hints: [
      "Use a set to track which texts you've already added, and a separate list to preserve the order they first appeared in.",
      "batch() is just slicing items in fixed-size steps: items[i:i+batch_size] for i in range(0, len(items), batch_size).",
      "Always dedupe BEFORE batching, batching duplicates just wastes a slot in some batch for nothing.",
    ],
    challenge_title: "Dedupe, Batch, and Bill",
    challenge_description:
      "Before re-embedding a corpus, dedupe repeated texts (cache hits are free), batch the rest into fixed-size API calls, and estimate the token cost of only the unique texts.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, b = map(int, data[0].split())
    texts = [data[1 + i] for i in range(n)]

    # TODO: dedupe texts, preserving first-seen order.
    # TODO: batches_needed = ceil(unique_count / b).
    # TODO: total_tokens = sum of max(1, len(text)//4) over the UNIQUE texts only.
    # TODO: print unique_count, batches_needed, total_tokens on three lines.

main()
`,
    challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n, b = map(int, data[0].split())
    texts = [data[1 + i] for i in range(n)]

    seen = set()
    unique = []
    for t in texts:
        if t not in seen:
            seen.add(t)
            unique.append(t)

    batches_needed = math.ceil(len(unique) / b)
    total_tokens = sum(max(1, len(t) // 4) for t in unique)

    print(len(unique))
    print(batches_needed)
    print(total_tokens)

main()
`,
    challenge_test_cases: [
      {
        input: "6 2\ncat\ndog\ncat\nbird\ndog\nfish",
        expected_output: "4\n2\n4",
        description: "4 unique texts fit in 2 batches of size 2; each short word costs 1 estimated token.",
      },
      {
        input: "3 5\nhello\nhello\nhello",
        expected_output: "1\n1\n1",
        description: "All three lines are the same text, so the cache reduces it to a single unique embed.",
      },
      {
        input: "5 1\nartificial intelligence\nmachine learning\nartificial intelligence\ndeep learning models\nneural networks",
        expected_output: "4\n4\n17",
        description: "One duplicate is deduped to 4 unique texts; batch size 1 needs 4 batches; token estimate sums only the unique texts.",
      },
    ],
  },

  {
    id: "prod-16-8",
    project_id: "prod-16",
    order: 8,
    title: "Ship the Semantic Search Engine",
    concept: "assembling and shipping the engine",
    explanation: `Every piece is built: batch embedding, cosine similarity, ranking with a tie-break, top-k with clamping, guards against bad vectors, and a cache to keep costs down. This lesson bolts them together into one engine and ships it. Finish this and the project lands in your **Portfolio**.

## The whole thing, assembled

\`\`\`python
import math
import voyageai

class SemanticSearchEngine:
    def __init__(self, api_key=None):
        self.vo = voyageai.Client(api_key=api_key)
        self.index = []
        self.cache = {}

    def add_documents(self, docs, batch_size=128):
        texts = [d["text"] for d in docs]
        to_embed = [t for t in texts if t not in self.cache]

        for i in range(0, len(to_embed), batch_size):
            chunk = to_embed[i:i + batch_size]
            result = self.vo.embed(chunk, model="voyage-3.5", input_type="document")
            for text, vector in zip(chunk, result.embeddings):
                self.cache[text] = vector

        for doc in docs:
            self.index.append({
                "id": doc["id"],
                "text": doc["text"],
                "vector": self.cache[doc["text"]],
            })

    def _cosine(self, a, b):
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def search(self, query_text, k=5):
        if not self.index:
            return []

        query_vector = self.vo.embed(
            [query_text], model="voyage-3.5", input_type="query"
        ).embeddings[0]

        scored = []
        for doc in self.index:
            if len(doc["vector"]) != len(query_vector):
                continue
            score = self._cosine(query_vector, doc["vector"])
            scored.append((doc, score))

        scored.sort(key=lambda pair: (-pair[1], pair[0]["id"]))
        k = min(k, len(scored))

        return [
            {"id": doc["id"], "text": doc["text"], "score": round(score, 4)}
            for doc, score in scored[:k]
        ]
\`\`\`

Read it top to bottom and every lesson is there: \`add_documents\` batches and caches (lessons 2 and 7), \`_cosine\` is the similarity math with its zero-vector guard (lesson 3), \`search\` ranks, ties-breaks, and clamps to top-k (lessons 4-5), and the dimension check plus the empty-index guard is the hardening (lesson 6).

## What "shipped" means here

You don't need a fancy deployment. Shipped means three things are true:

1. It runs from a clean start: point it at a folder of documents, call \`add_documents\`, then \`search\`.
2. It handles an empty corpus, a repeated document, and a weird query without crashing.
3. Someone else could use it from your instructions alone: \`engine.add_documents(docs)\`, then \`engine.search("your question", k=5)\`.

## Your Portfolio

Completing this final lesson records the project in your **Portfolio** with its title and what you built: a working semantic search engine over a real corpus, backed by real embeddings, ranked by cosine similarity, returned as scored top-k results. Keep a one-line description ("finds FAQ answers by meaning, not keyword") and a saved example query and its top result as proof it works.

## The drill below

You'll build a ship-readiness check: given the engine's index size, cache flag, zero-vector guard flag, and estimated token usage, decide if it's ready to ship or list exactly what's missing.`,
    starter_code: `# Ship-readiness check for the finished search engine.
# index_size: number of documents embedded and indexed
# cache_enabled: 1 if repeated texts are deduped/cached, else 0
# handles_zero_vector: 1 if cosine_similarity guards against zero vectors, else 0
# tokens, budget: estimated embedding cost vs the ceiling you set

def ship_check(index_size, cache_enabled, handles_zero_vector, tokens, budget):
    fails = []
    # TODO: "index" if index_size < 1.
    # TODO: "cache" if cache_enabled != 1.
    # TODO: "zero_vector_guard" if handles_zero_vector != 1.
    # TODO: "budget" if tokens > budget.
    return fails

print(ship_check(50, 1, 1, 400, 1000))
`,
    solution_code: `def ship_check(index_size, cache_enabled, handles_zero_vector, tokens, budget):
    fails = []
    if index_size < 1:
        fails.append("index")
    if cache_enabled != 1:
        fails.append("cache")
    if handles_zero_vector != 1:
        fails.append("zero_vector_guard")
    if tokens > budget:
        fails.append("budget")
    return fails

cases = [
    (50, 1, 1, 400, 1000),
    (0, 0, 0, 2000, 1000),
    (30, 1, 0, 500, 400),
]
for index_size, cache, guard, tok, bud in cases:
    fails = ship_check(index_size, cache, guard, tok, bud)
    print("READY" if not fails else ",".join(fails))
`,
    hints: [
      "Check the four conditions in a fixed order: index, cache, zero_vector_guard, budget.",
      "index_size < 1 means nothing has been embedded yet, there's nothing to search.",
      "No failures at all means the engine is READY to ship.",
    ],
    challenge_title: "Ship Checklist",
    challenge_description:
      "Given the finished search engine's index size, cache flag, zero-vector guard flag, and token usage, print READY or list every failing check in order (index, cache, zero_vector_guard, budget).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    parts = sys.stdin.read().split()
    index_size, cache_enabled, handles_zero_vector, tokens, budget = map(int, parts[:5])

    fails = []
    # TODO: append "index" if index_size < 1.
    # TODO: append "cache" if cache_enabled != 1.
    # TODO: append "zero_vector_guard" if handles_zero_vector != 1.
    # TODO: append "budget" if tokens > budget.
    # TODO: print "READY" if no fails, else each failing check on its own line.

main()
`,
    challenge_solution_code: `import sys

def main():
    parts = sys.stdin.read().split()
    index_size, cache_enabled, handles_zero_vector, tokens, budget = map(int, parts[:5])

    fails = []
    if index_size < 1:
        fails.append("index")
    if cache_enabled != 1:
        fails.append("cache")
    if handles_zero_vector != 1:
        fails.append("zero_vector_guard")
    if tokens > budget:
        fails.append("budget")

    if not fails:
        print("READY")
    else:
        for f in fails:
            print(f)

main()
`,
    challenge_test_cases: [
      {
        input: "50 1 1 400 1000",
        expected_output: "READY",
        description: "All four checks pass.",
      },
      {
        input: "0 0 0 2000 1000",
        expected_output: "index\ncache\nzero_vector_guard\nbudget",
        description: "Everything fails; all four checks reported in order.",
      },
      {
        input: "30 1 0 500 400",
        expected_output: "zero_vector_guard\nbudget",
        description: "Index and cache are fine, but the zero-vector guard is missing and the estimate exceeds budget.",
      },
    ],
  },
];

export default { project, lessons };
