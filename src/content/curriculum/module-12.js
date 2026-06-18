export default {
  project: {
    id: "ai-12",
    title: "Vector Databases & Production Search",
    description: "Learn how vector databases turn embeddings into fast, filterable, production-grade search. Build the pieces of a real retrieval pipeline: ANN indexes, metadata filters, hybrid search, and re-ranking.",
    difficulty: "advanced",
    category: "rag_search",
    estimated_time: 55,
    lessons_count: 5,
    tags: ["vector-db", "ann", "retrieval", "hybrid-search", "reranking", "search"],
    order: 12,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-12-l1",
      project_id: "ai-12",
      order: 1,
      title: "Why a Vector Database?",
      concept: "VectorDB",
      xp_reward: 10,
      explanation: `You embed a million support tickets into 1,536-dimensional vectors, store them in a Python list, and write a loop that compares each one to the query. It works for the demo. Then a real query lands and your "search" takes nine seconds. That gap — between a toy similarity loop and a system that answers in milliseconds at scale — is exactly what a **vector database** exists to close.

## What it is

A **vector database** is a store built to hold high-dimensional **embeddings** and answer one question fast: *which stored vectors are most similar to this query vector?* Regular databases are great at exact matches ("WHERE id = 42") and ranges ("price < 10"). They are useless at "find the 10 rows whose meaning is closest to this one," because meaning lives in the geometry of the vectors, not in any single column.

The core operation is **nearest-neighbor search**: given a query vector, return the stored vectors with the highest similarity (or smallest distance).

## How it works

A vector database wraps three jobs around your embeddings:

1. **Store** the vectors plus an id and optional **metadata** (source, date, author).
2. **Index** them into a structure that avoids comparing the query to every single vector.
3. **Query**: embed the incoming text, search the index, return the top-k ids and scores.

The naive version — compare against everything — is called **brute-force** or **flat** search. Here it is:

\`\`\`python
import numpy as np

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search(query, vectors, k=3):
    scored = [(i, cosine(query, v)) for i, v in enumerate(vectors)]
    scored.sort(key=lambda x: x[1], reverse=True)  # most similar first
    return scored[:k]
\`\`\`

This is correct but **O(n)** per query: double the data, double the time. At a million vectors it falls over. A real vector DB swaps this loop for an **index** (next lesson) that finds close matches without scanning everything.

## Why it matters

- **Scale.** Brute force is fine at thousands, fatal at millions. The index is the whole reason the database exists.
- **It powers RAG.** Retrieval-augmented generation lives or dies on fast, relevant retrieval. The vector DB is the "retrieval" half.
- **More than similarity.** Production systems need filtering, hybrid keyword matching, and re-ranking — features a raw NumPy loop will never give you, and the rest of this module builds.

## The mental model to keep

A vector database is a **search engine for meaning**: it trades a tiny bit of accuracy for an enormous amount of speed, so "find the closest vectors" stays fast no matter how much data you pour in.`,
      key_terms: [
        { term: "Vector database", definition: "A store optimized to hold embeddings and quickly return the vectors most similar to a query vector." },
        { term: "Embedding", definition: "A list of numbers that represents the meaning of a piece of text, where similar meanings sit close together." },
        { term: "Nearest-neighbor search", definition: "Finding the stored vectors with the highest similarity (or smallest distance) to a query vector." },
        { term: "Brute-force search", definition: "Comparing the query against every stored vector; correct but O(n) and slow at scale." }
      ],
      callouts: [
        { type: "analogy", title: "A library by meaning, not by title", content: "A normal database finds books by exact title or call number. A vector database finds books that are about the same thing, even if they share no words. It shelves by meaning.", position: "before" },
        { type: "insight", title: "The index is the point", content: "Storing embeddings is easy. The reason a vector DB exists is the index that finds close matches without scanning all of them. Without it, you just have a slow list.", position: "after" }
      ],
      concept_diagram: {
        title: "From text to a top-k answer",
        steps: [
          { label: "Embed the data", desc: "Turn each document into a vector and store it with an id and metadata." },
          { label: "Build an index", desc: "Organize the vectors so similar ones are reachable without a full scan." },
          { label: "Embed the query", desc: "Convert the incoming question into a vector the same way." },
          { label: "Return top-k", desc: "Search the index and hand back the most similar ids and scores." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the one job a vector database is optimized for?",
          options: ["Exact matches on a primary key", "Finding the stored vectors most similar to a query vector", "Joining tables on shared columns"],
          correct_index: 1,
          explanation: "Vector databases specialize in nearest-neighbor search over embeddings, not exact-match lookups."
        }
      ],
      quiz_questions: [
        {
          question: "Why does a brute-force similarity loop fail in production?",
          options: [
            "It returns the wrong nearest neighbors",
            "It is O(n) per query, so it gets unbearably slow as the data grows",
            "It cannot compute cosine similarity",
            "It only works on integers"
          ],
          correct_index: 1,
          explanation: "Brute force is correct but compares the query to every vector, so its cost scales linearly with the dataset and collapses at millions of vectors."
        },
        {
          question: "What does a vector database store alongside each embedding?",
          options: [
            "Only the raw vector and nothing else",
            "An id and optional metadata such as source, date, or author",
            "A copy of the entire model",
            "The model's weights"
          ],
          correct_index: 1,
          explanation: "Each vector is stored with an id and optional metadata, which later powers filtering."
        },
        {
          question: "Which task is a vector database the right tool for?",
          options: [
            "Looking up a user by their exact email address",
            "Summing all order totals for last month",
            "Finding documents whose meaning is closest to a question",
            "Enforcing a foreign-key constraint"
          ],
          correct_index: 2,
          explanation: "Semantic similarity search is the vector DB's purpose; exact lookups and aggregations belong to a regular database."
        }
      ],
      participation_activities: [
        {
          activity_title: "Vector database sense-check",
          questions: [
            { question: "A vector database is primarily designed for exact-match lookups on a single column.", type: "true_false", correct_answer: "false", explanation: "It is designed for similarity search over embeddings, not exact matches." },
            { question: "Comparing a query against every stored vector is called ______ search.", type: "fill_in", correct_answer: "brute-force", explanation: "Brute-force (or flat) search scans all vectors and is O(n)." }
          ]
        }
      ],
      starter_code: `# A toy vector store: find the most similar vectors by cosine similarity.
import numpy as np

vectors = [
    np.array([1.0, 0.0]),
    np.array([0.9, 0.1]),
    np.array([0.0, 1.0]),
]
query = np.array([1.0, 0.05])

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# TODO: score every vector against the query and print the index of the closest one.
print("query:", query)
`,
      solution_code: `import numpy as np

vectors = [
    np.array([1.0, 0.0]),
    np.array([0.9, 0.1]),
    np.array([0.0, 1.0]),
]
query = np.array([1.0, 0.05])

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

scored = [(i, cosine(query, v)) for i, v in enumerate(vectors)]
scored.sort(key=lambda x: x[1], reverse=True)
best_index, best_score = scored[0]

print("query:", query)
print("closest index:", best_index)
print("score:", round(best_score, 4))
`,
      expected_output: `query: [1.   0.05]
closest index: 0
score: 0.9988`,
      step_throughs: [
        {
          title: "how a vector DB answers one query",
          steps: [
            { label: "Embed the query", detail: "The incoming text is turned into a vector using the same model that embedded the stored data.", code: 'query_vec = embed("how do I reset my password?")' },
            { label: "Search the index", detail: "Instead of scanning every vector, the index narrows to a small set of promising candidates.", code: "candidates = index.search(query_vec, k=10)" },
            { label: "Score the candidates", detail: "Cosine similarity (or distance) ranks the candidates from most to least similar.", code: "ranked = sort_by_similarity(candidates, query_vec)" },
            { label: "Return top-k", detail: "The best ids and their scores go back to the caller, ready to feed an LLM or a UI.", code: "return ranked[:k]  # ids + scores" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You have 5,000 embeddings in a Python list and run a brute-force search. You then grow to 5,000,000. Roughly how does query time change?",
          steps: [
            "Brute force compares the query to every stored vector, so its cost grows linearly with the number of vectors.",
            "Going from 5,000 to 5,000,000 is a 1,000x increase in the data.",
            "So each query does about 1,000x more work and takes roughly 1,000x longer."
          ],
          output: "About 1,000x slower, because brute-force cost is O(n)."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A teammate stores embeddings in a normal SQL table and asks, 'Why can't I just write WHERE similarity(query, vec) > 0.8?' What's the problem at scale?",
          steps: [
            "A SQL WHERE clause with a computed similarity must evaluate that function for every row — that is brute force in disguise.",
            "There is no index that lets the database skip rows, because B-tree indexes work on ordered scalar values, not high-dimensional closeness.",
            "So the query degrades to a full table scan that recomputes similarity for millions of rows.",
            "A vector database fixes this with a specialized approximate index that finds close vectors without scoring all of them."
          ],
          output: "The WHERE clause is a hidden full scan; vector DBs add an ANN index so the engine can skip most vectors."
        }
      ],
      comparison_tables: [
        {
          title: "regular database vs vector database",
          columns: ["Dimension", "Regular (SQL) database", "Vector database"],
          rows: [
            { cells: ["Best at", "Exact matches and ranges", "Similarity / meaning search"] },
            { cells: ["Query example", "WHERE id = 42", "Top-k closest to this vector"] },
            { cells: ["Index type", "B-tree on scalar columns", "ANN index over vectors"] },
            { cells: ["Core strength", "Precise, structured lookups", "Fast nearest-neighbor at scale"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "regular DB job vs vector DB job",
          bins: [
            { id: "sql", label: "Regular database" },
            { id: "vec", label: "Vector database" }
          ],
          items: [
            { id: "i1", text: "Find the user with email a@b.com", bin: "sql" },
            { id: "i2", text: "Find the 5 docs most similar in meaning to a question", bin: "vec" },
            { id: "i3", text: "Sum revenue for March", bin: "sql" },
            { id: "i4", text: "Retrieve passages for a RAG answer", bin: "vec" },
            { id: "i5", text: "Look up an order by its primary key", bin: "sql" },
            { id: "i6", text: "Match a query embedding to nearest neighbors", bin: "vec" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why isn't a NumPy loop over your embeddings 'good enough' for a production search feature?",
          sampleAnswer: "A NumPy loop is brute force: it compares the query to every stored vector, so its cost grows linearly with the data and becomes far too slow at millions of vectors. A vector database replaces that loop with an approximate index that finds close matches without scanning everything, and it also adds filtering, hybrid search, and re-ranking that a raw loop can't provide."
        }
      ],
      hints: [
        "Build a list of (index, score) tuples by calling cosine on the query and each vector.",
        "Sort the list by the score in descending order so the most similar is first.",
        "The first element after sorting is the closest; print its index and rounded score."
      ],
      challenge_title: "Top-k Semantic Search",
      challenge_description: "Build the brute-force nearest-neighbor core of a vector database: embed everything, score by cosine similarity, return the closest k.",
      challenge_story: "You're shipping the retrieval layer for an AI documentation assistant. Every help article has already been turned into an **embedding** — a vector of floats that captures its meaning. When a user types a question, your embedding model turns it into a **query vector**, and your job is to find the \`k\` stored vectors whose meaning is closest. The industry-standard distance for normalized text embeddings is **cosine similarity**: the cosine of the angle between two vectors, where 1.0 means identical direction. Before you reach for a fancy ANN index, you ship the honest baseline — score the query against every vector and keep the best.",
      challenge_statement: "You are given a query vector and \`n\` document vectors, all of dimension \`d\`. Return the **top \`k\`** documents by **cosine similarity** to the query.\n\nCosine similarity between vectors \`a\` and \`b\` is:\n\n\`\`\`\ncos(a, b) = dot(a, b) / (||a|| * ||b||)\n\`\`\`\n\nwhere \`||v||\` is the Euclidean norm. If either vector has zero norm, treat its similarity as \`0.0000\`.\n\nRank documents by similarity **descending**. If two documents tie on similarity (rounded to 4 decimals), the one with the **smaller index** comes first. Print the top \`k\`.",
      challenge_input_format: "The first line has three integers `n d k`: the number of document vectors, the dimension, and how many results to return.\n\nThe second line has `d` space-separated floats: the query vector.\n\nEach of the next `n` lines has `d` space-separated floats: one document vector. Documents are indexed `0` to `n-1` in the order given.",
      challenge_output_format: "Print `k` lines. Each line is the document index and its cosine similarity, space-separated, with the similarity formatted to exactly 4 decimal places (e.g. `0 0.9939`).",
      challenge_constraints: [
        "1 ≤ k ≤ n ≤ 5000",
        "1 ≤ d ≤ 256",
        "Each coordinate is a float with magnitude ≤ 1000.",
        "Compare on similarity rounded to 4 decimals; break ties by smaller index.",
      ],
      challenge_examples: [
        { input: "3 2 2\n0.9 0.1\n1.0 0.0\n0.0 1.0\n0.8 0.2", output: "0 0.9939\n2 0.9910", explanation: "The query points mostly along the first axis. Document 0 ([1,0]) is closest (cos 0.9939), then document 2 ([0.8,0.2]) at 0.9910. Document 1 ([0,1]) is nearly orthogonal and drops out." },
        { input: "4 3 3\n1 2 3\n2 4 6\n1 0 0\n3 2 1\n0 0 5", output: "0 1.0000\n3 0.8018\n2 0.7143", explanation: "Document 0 is an exact scalar multiple of the query, so cosine is 1.0000. The others rank by angle." },
      ],
      challenge_notes: "This is the *exact* search a vector DB approximates. It is O(n·d) per query — perfect for thousands of vectors, hopeless at billions, which is exactly why ANN indexes (the next lesson) exist. Cosine ignores magnitude and only compares direction, which is why a vector and its scalar multiple score 1.0.",
      challenge_hints: [
        "Compute the query norm once, then loop over documents computing each dot product and norm.",
        "Guard against a zero norm before dividing — return 0.0 for that document instead of crashing.",
        "Sort by a key of `(-similarity, index)` so highest similarity wins and ties fall back to the smaller index.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, d, k = map(int, data[0].split())
    query = list(map(float, data[1].split()))
    # TODO: read the n document vectors, score each by cosine similarity
    #       to the query, then print the top k as "index score" (4 decimals).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, d, k = map(int, data[idx].split())
    idx += 1
    query = list(map(float, data[idx].split()))
    idx += 1
    vectors = []
    for _ in range(n):
        vectors.append(list(map(float, data[idx].split())))
        idx += 1

    def dot(a, b):
        return sum(x * y for x, y in zip(a, b))

    def norm(a):
        return sum(x * x for x in a) ** 0.5

    qn = norm(query)
    scored = []
    for i, v in enumerate(vectors):
        vn = norm(v)
        if qn == 0 or vn == 0:
            sim = 0.0
        else:
            sim = dot(query, v) / (qn * vn)
        scored.append((i, sim))

    scored.sort(key=lambda x: (-round(x[1], 4), x[0]))
    for i, sim in scored[:k]:
        print(f"{i} {sim:.4f}")

main()
`,
      challenge_test_cases: [
        { input: "3 2 2\n0.9 0.1\n1.0 0.0\n0.0 1.0\n0.8 0.2", expected_output: "0 0.9939\n2 0.9910", description: "Two closest vectors to a query along the first axis, most similar first." },
        { input: "4 3 3\n1 2 3\n2 4 6\n1 0 0\n3 2 1\n0 0 5", expected_output: "0 1.0000\n3 0.8018\n2 0.7143", description: "A scalar multiple of the query scores exactly 1.0000." },
        { input: "2 2 2\n1.0 0.0\n1.0 0.0\n2.0 0.0", expected_output: "0 1.0000\n1 1.0000", description: "Tie on similarity is broken by the smaller index." },
        { input: "2 2 1\n0.0 0.0\n1.0 1.0\n2.0 2.0", expected_output: "0 0.0000", description: "A zero-norm query yields similarity 0.0000 for every document." }
      ]
    },
    {
      id: "ai-12-l2",
      project_id: "ai-12",
      order: 2,
      title: "Indexing & Approximate Nearest Neighbor",
      concept: "ANN",
      xp_reward: 10,
      explanation: `Finding the *exact* nearest neighbor in a million 1,536-dimensional vectors requires, in the worst case, checking all million. So production systems quietly cheat: they accept "almost the nearest" in exchange for being a hundred times faster. That trade is the entire idea behind **approximate nearest neighbor** search, and it is why your vector DB feels instant.

## What it is

**Approximate nearest neighbor (ANN)** search returns vectors that are *very likely* the closest, without guaranteeing they are *exactly* the closest. You give up a sliver of **recall** — the fraction of true nearest neighbors you actually find — and in return you get an enormous speedup. The structure that makes this possible is the **index**.

The most common modern index is **HNSW** (Hierarchical Navigable Small World): a layered graph you walk to home in on close vectors fast.

## How it works

HNSW builds a graph where each vector is a node connected to some of its near neighbors, arranged in layers:

1. **Top layers are sparse** — a few nodes with long-range links, like an express highway across the dataset.
2. **Lower layers are dense** — many nodes with short links, like local streets.
3. **A search starts at the top**, greedily hops toward the query along the highway, then drops to lower layers to refine.
4. **It stops** when it can't get any closer, returning the best nodes it found.

A knob called **efSearch** controls how many candidates the walk keeps in play:

\`\`\`python
# higher ef  ->  explore more candidates  ->  better recall, slower
# lower  ef  ->  explore fewer            ->  faster, lower recall
results = index.search(query, k=10, ef=64)
\`\`\`

This is the core tuning dial: **ef trades recall for speed.** Crank it up when accuracy matters; lower it when latency matters.

## Why it matters

- **Recall vs latency is a dial, not a default.** Every ANN index lets you pick a point on that curve. The right point depends on your product, not on the library.
- **99% recall is often plenty.** Missing the true #1 result occasionally is fine when the #2 is nearly as relevant — and worth it for a 100x speedup.
- **Index choice has costs.** HNSW gives great recall and speed but uses more memory and is slow to build. Other indexes (IVF, flat) trade differently. There is no free lunch.

## The mental model to keep

An ANN index is a **shortcut map**: instead of visiting every vector, you follow a few good roads toward the answer. You might miss the single closest house, but you'll reliably land on its street — far, far faster.`,
      key_terms: [
        { term: "Approximate nearest neighbor (ANN)", definition: "Search that returns very likely (not guaranteed) closest vectors, trading exactness for speed." },
        { term: "Index", definition: "A data structure over the vectors that lets a query skip most comparisons." },
        { term: "Recall", definition: "The fraction of the true nearest neighbors that the search actually returns." },
        { term: "HNSW", definition: "A layered navigable-graph index that walks from sparse top layers down to dense lower layers to find close vectors fast." },
        { term: "efSearch", definition: "A tuning knob that controls how many candidates the search explores: higher means better recall but slower." }
      ],
      callouts: [
        { type: "analogy", title: "Express train, then local stops", content: "HNSW's top layer is an express train that covers huge distances in a few hops. The lower layers are local stops that fine-tune your arrival. You ride the express most of the way, then walk the last block.", position: "before" },
        { type: "tip", title: "Tune ef, not vibes", content: "If results feel slightly off, raise efSearch to improve recall. If latency is too high, lower it. Measure recall on a labeled set rather than guessing.", position: "after" }
      ],
      concept_diagram: {
        title: "Searching an HNSW graph",
        steps: [
          { label: "Enter at the top", desc: "Start at a sparse top-layer node with long-range links." },
          { label: "Greedy hop", desc: "Move to whichever neighbor is closer to the query." },
          { label: "Drop a layer", desc: "Descend to a denser layer and refine the search locally." },
          { label: "Collect top-k", desc: "Stop when no neighbor is closer; return the best nodes found." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does ANN search trade away for speed?",
          options: ["The ability to store metadata", "A guarantee that results are the exact nearest neighbors", "Support for cosine similarity"],
          correct_index: 1,
          explanation: "ANN gives up the exactness guarantee (a bit of recall) in exchange for a large speedup."
        }
      ],
      quiz_questions: [
        {
          question: "What does raising efSearch do in an HNSW index?",
          options: [
            "Reduces memory usage with no downside",
            "Explores more candidates, improving recall but increasing latency",
            "Disables the lower graph layers",
            "Changes the embedding model"
          ],
          correct_index: 1,
          explanation: "efSearch controls how many candidates the walk keeps in play; higher means better recall at the cost of speed."
        },
        {
          question: "Why is 99% recall often acceptable in production search?",
          options: [
            "Because the missing result is always irrelevant",
            "Because the occasional missed top result is usually nearly as good as the next one, and the speedup is huge",
            "Because recall does not affect users",
            "Because exact search is impossible"
          ],
          correct_index: 1,
          explanation: "When the #2 result is almost as relevant as the true #1, trading a tiny bit of recall for a large speedup is a good deal."
        },
        {
          question: "Which statement about HNSW is accurate?",
          options: [
            "It guarantees the exact nearest neighbor every time",
            "It uses a layered graph: sparse long-range links on top, dense short links below",
            "It uses no extra memory beyond the raw vectors",
            "It only works in two dimensions"
          ],
          correct_index: 1,
          explanation: "HNSW is a hierarchical navigable small-world graph that walks from sparse top layers to dense lower layers."
        }
      ],
      participation_activities: [
        {
          activity_title: "ANN tuning check",
          questions: [
            { question: "An approximate nearest neighbor index guarantees it returns the single exact closest vector.", type: "true_false", correct_answer: "false", explanation: "ANN returns very likely closest vectors, not a guaranteed exact match." },
            { question: "The fraction of the true nearest neighbors a search actually returns is called ______.", type: "fill_in", correct_answer: "recall", explanation: "Recall measures how many of the true neighbors were found." }
          ]
        }
      ],
      starter_code: `# Simulate the recall/speed trade-off of ANN vs exact search.
# "exact" checks all vectors; "approx" only checks a sample, so it may miss the best.
import numpy as np

np.random.seed(0)
vectors = [np.random.rand(4) for _ in range(20)]
query = np.random.rand(4)

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def exact_best(query, vectors):
    scored = [(i, cosine(query, v)) for i, v in enumerate(vectors)]
    return max(scored, key=lambda x: x[1])

# TODO: print the exact best (index, score), rounding the score to 4 places.
print("checked vectors:", len(vectors))
`,
      solution_code: `import numpy as np

np.random.seed(0)
vectors = [np.random.rand(4) for _ in range(20)]
query = np.random.rand(4)

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def exact_best(query, vectors):
    scored = [(i, cosine(query, v)) for i, v in enumerate(vectors)]
    return max(scored, key=lambda x: x[1])

best_index, best_score = exact_best(query, vectors)
print("checked vectors:", len(vectors))
print("exact best index:", best_index)
print("exact best score:", round(best_score, 4))
`,
      expected_output: `checked vectors: 20
exact best index: 8
exact best score: 0.974`,
      step_throughs: [
        {
          title: "the recall/speed dial in action",
          steps: [
            { label: "Pick a target", detail: "Decide what matters: tight latency budget, or maximum accuracy. This sets where you sit on the curve.", code: "goal = 'low latency, recall >= 0.95'" },
            { label: "Set efSearch low", detail: "A small ef explores few candidates. Queries are fast, but the search may miss some true neighbors.", code: "index.search(q, k=10, ef=16)  # fast, lower recall" },
            { label: "Measure recall", detail: "Compare ANN results against exact brute-force results on a labeled sample to get a real recall number.", code: "recall = overlap(approx, exact) / k" },
            { label: "Raise ef until it's enough", detail: "Increase ef until recall hits your target, then stop. Higher ef costs latency, so don't overshoot.", code: "index.search(q, k=10, ef=64)  # slower, recall ~0.99" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Your search returns relevant-but-not-perfect results and you want better accuracy. Which way do you move efSearch, and what's the cost?",
          steps: [
            "efSearch controls how many candidates the index explores during a query.",
            "More candidates means a higher chance of finding the true nearest neighbors, so raise ef to improve recall.",
            "The cost is latency: exploring more candidates makes each query slower."
          ],
          output: "Raise efSearch to improve recall, at the cost of slower queries."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Exact search returns neighbors {3, 7, 9, 2, 5} for a query. Your ANN index returns {3, 7, 9, 2, 8}. What is recall@5, and is this index acceptable for a chat search feature?",
          steps: [
            "Recall@5 is the fraction of the 5 true neighbors that also appear in the approximate results.",
            "The true set is {3, 7, 9, 2, 5}; the approximate set is {3, 7, 9, 2, 8}. The overlap is {3, 7, 9, 2}, which is 4 items.",
            "Recall@5 = 4 / 5 = 0.80.",
            "For a chat search feature, 0.80 means it found 4 of the 5 best passages and substituted one near-miss (8 instead of 5). If item 8 is still relevant, this is usually fine; if recall must be higher, raise efSearch and re-measure."
          ],
          output: "Recall@5 = 0.80; acceptable for many chat features, but tune efSearch up if the missed neighbor matters."
        }
      ],
      comparison_tables: [
        {
          title: "exact (flat) vs ANN (HNSW) search",
          columns: ["Dimension", "Exact / flat", "ANN / HNSW"],
          rows: [
            { cells: ["Result guarantee", "Always the true nearest", "Very likely nearest"] },
            { cells: ["Speed at millions", "Slow (full scan)", "Fast (graph walk)"] },
            { cells: ["Recall", "100%", "Tunable, often 95-99%"] },
            { cells: ["Best for", "Small data or audits", "Production-scale search"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "raises recall vs lowers latency",
          bins: [
            { id: "recall", label: "Raises recall" },
            { id: "latency", label: "Lowers latency" }
          ],
          items: [
            { id: "i1", text: "Increase efSearch", bin: "recall" },
            { id: "i2", text: "Decrease efSearch", bin: "latency" },
            { id: "i3", text: "Explore more candidates per query", bin: "recall" },
            { id: "i4", text: "Explore fewer candidates per query", bin: "latency" },
            { id: "i5", text: "Accept a slightly slower query budget", bin: "recall" },
            { id: "i6", text: "Tighten the latency target", bin: "latency" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why is approximate nearest neighbor search a good trade for production, even though it can miss the true closest vector?",
          sampleAnswer: "Exact search must, in the worst case, compare the query to every vector, which is far too slow at millions of vectors. ANN gives up a guaranteed-exact result for a huge speedup, and in practice the occasional missed top neighbor is usually nearly as relevant as the next-best one. You can also tune efSearch to dial recall up or down, so you pick the speed/accuracy point your product actually needs."
        }
      ],
      hints: [
        "exact_best already returns a (index, score) tuple via max over all vectors.",
        "Unpack the tuple into best_index and best_score.",
        "Round the score to 4 decimal places when you print it."
      ],
      challenge_title: "Recall@k Benchmark",
      challenge_description: "Your ANN index is fast but lossy. Measure how many true neighbors it still finds by computing recall@k across a whole query benchmark.",
      challenge_story: "You swapped your slow brute-force search for a blazing-fast **approximate nearest neighbor (ANN)** index. It is 50x faster — but approximate, so it sometimes misses a true neighbor. Before you ship it, the eval harness must answer one question: *how much accuracy did we trade away?* The standard metric is **recall@k**: for each query, what fraction of the ground-truth top-k neighbors did the index actually return? You run a benchmark of many queries and report both the per-query recall and the **mean recall@k** across the whole set — the single number that decides whether the speedup is worth it.",
      challenge_statement: "You run \`q\` benchmark queries with parameter \`k\`. For each query you have:\n\n- the **exact** top-k neighbor ids (ground truth, from brute-force search), and\n- the **approx** top-k neighbor ids returned by the ANN index.\n\nFor each query, **recall@k** is:\n\n\`\`\`\n(number of exact ids that also appear in approx) / k\n\`\`\`\n\nUse only the **first k** ids of each list if extras are present. Treat the ids as a set (ignore order and duplicates).\n\nPrint each query's recall@k in order, then print the **mean** recall@k over all \`q\` queries. Every value is formatted to exactly 4 decimal places.",
      challenge_input_format: "The first line has two integers `q k`: the number of queries and the cutoff k.\n\nThen each query takes two lines: the first line is the exact top-k neighbor ids (space-separated), the second is the approx top-k neighbor ids (space-separated).",
      challenge_output_format: "Print `q + 1` lines. The first `q` lines are the per-query recall@k values in input order, each to 4 decimal places. The final line is the mean recall@k over all queries, also to 4 decimal places.",
      challenge_constraints: [
        "1 ≤ q ≤ 10000",
        "1 ≤ k ≤ 1000",
        "Neighbor ids are integers; within one list they are distinct.",
        "Each list contains at least k ids.",
      ],
      challenge_examples: [
        { input: "1 5\n3 7 9 2 5\n3 7 9 2 8", output: "0.8000\n0.8000", explanation: "Four of the five true neighbors (3, 7, 9, 2) appear in the approximate result; id 5 was missed and 8 is a false hit. Recall is 4/5 = 0.8000, and with one query the mean equals it." },
        { input: "2 3\n10 11 12\n10 11 99\n5 6 7\n6 5 7", output: "0.6667\n1.0000\n0.8333", explanation: "Query 1 finds 2 of 3 (0.6667); query 2 finds all 3 regardless of order (1.0000). The mean is (0.6667 + 1.0000) / 2 = 0.8333." },
      ],
      challenge_notes: "Recall is set-based: order does not matter, only whether each true neighbor was retrieved. This is precisely the knob you tune when you raise \`efSearch\` in an HNSW index — more candidates explored means higher recall but slower queries. A mean recall@10 of 0.95 is a common production target.",
      challenge_hints: [
        "Convert each list's first k ids to a `set`, then intersect with `&` and take the length.",
        "Accumulate a running total of recalls so you can divide by q at the end for the mean.",
        "Format every number with an f-string like `f\"{value:.4f}\"` so 0.8 prints as 0.8000.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    q, k = map(int, data[0].split())
    # TODO: for each of the q queries, read the exact ids then the approx ids,
    #       compute recall@k = |exact & approx| / k, print each, then the mean.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    q, k = map(int, data[idx].split())
    idx += 1
    total = 0.0
    per_query = []
    for _ in range(q):
        exact = data[idx].split()
        idx += 1
        approx = data[idx].split()
        idx += 1
        exact_set = set(exact[:k])
        approx_set = set(approx[:k])
        found = len(exact_set & approx_set)
        recall = found / k
        per_query.append(recall)
        total += recall
    for r in per_query:
        print(f"{r:.4f}")
    print(f"{total / q:.4f}")

main()
`,
      challenge_test_cases: [
        { input: "1 5\n3 7 9 2 5\n3 7 9 2 8", expected_output: "0.8000\n0.8000", description: "Single query: 4 of 5 true neighbors found, mean equals the per-query recall." },
        { input: "2 3\n10 11 12\n10 11 99\n5 6 7\n6 5 7", expected_output: "0.6667\n1.0000\n0.8333", description: "Two queries; order does not affect recall; mean is averaged." },
        { input: "1 4\n1 2 3 4\n4 3 2 1", expected_output: "1.0000\n1.0000", description: "Perfect recall even though the approximate order is reversed." },
        { input: "1 3\n1 2 3\n4 5 6", expected_output: "0.0000\n0.0000", description: "No overlap at all gives recall 0.0000." }
      ]
    },
    {
      id: "ai-12-l3",
      project_id: "ai-12",
      order: 3,
      title: "Metadata Filtering",
      concept: "Filtering",
      xp_reward: 10,
      explanation: `A user on your German support site asks a question and your retriever confidently returns the perfect answer — in English, from a document marked "internal only," dated three years before the feature existed. The vectors were similar. The result was useless. **Metadata filtering** is how you keep similarity search inside the boundaries reality demands.

## What it is

**Metadata** is the structured data you attach to each vector: language, source, author, date, access level, document type. **Metadata filtering** restricts a similarity search to only the vectors whose metadata matches a condition, so "closest in meaning" is computed *only over the allowed subset*.

The query becomes two-part: a **vector** ("what is this about?") plus a **filter** ("which records are even eligible?").

## How it works

You store metadata next to each embedding, then pass a filter at query time:

\`\`\`python
results = index.search(
    query_vector,
    k=5,
    filter={"language": "de", "access": "public", "year": {"gte": 2023}},
)
\`\`\`

There are two ways a vector DB can apply this, and the difference matters:

- **Pre-filtering** narrows the candidate set *first*, then runs nearest-neighbor search only over the survivors. Accurate, but can be slow if the filter is complex.
- **Post-filtering** runs nearest-neighbor search first, then throws away results that fail the filter. Fast, but risky: if all your top-k happen to fail the filter, you can come back with *nothing* even though good matches existed.

Good systems do filtering *inside* the index walk so you keep both speed and complete results.

## Why it matters

- **Security and access control.** Filtering by access level is often the only thing standing between a user and documents they should never see. This is not optional.
- **Correctness.** Language, date, region, and tenant filters keep answers relevant and current. Similarity alone has no idea a doc is outdated or off-limits.
- **The empty-result trap.** Naive post-filtering can silently return zero rows. You must design for "filter matches nothing in the top-k" or users hit dead ends.

## The mental model to keep

Similarity finds what's *relevant*; metadata filtering decides what's *allowed*. **Search the meaning, but only within the fence** your metadata defines.`,
      key_terms: [
        { term: "Metadata", definition: "Structured fields attached to each vector, such as language, source, date, or access level." },
        { term: "Metadata filtering", definition: "Restricting a similarity search to only the vectors whose metadata matches a condition." },
        { term: "Pre-filtering", definition: "Narrowing to matching records first, then running nearest-neighbor search over the survivors." },
        { term: "Post-filtering", definition: "Running nearest-neighbor search first, then discarding results that fail the filter, which can return nothing." }
      ],
      callouts: [
        { type: "insight", title: "Relevant is not the same as allowed", content: "A vector can be the closest match in meaning and still be the wrong answer: wrong language, expired, or off-limits. Filtering enforces the rules similarity can't see.", position: "before" },
        { type: "warning", title: "Post-filtering can return zero", content: "If you fetch the top-10 by similarity and then drop everything failing the filter, you may end up with no results even though valid matches exist deeper in the list. Filter inside the search or over-fetch.", position: "after" }
      ],
      concept_diagram: {
        title: "A filtered similarity query",
        steps: [
          { label: "Attach metadata", desc: "Store language, date, access, and source with each vector." },
          { label: "Build the filter", desc: "Express the conditions a record must satisfy to be eligible." },
          { label: "Apply the filter", desc: "Restrict the candidate set to records that match before or during the search." },
          { label: "Rank survivors", desc: "Return the most similar vectors from only the allowed subset." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does metadata filtering add to a similarity search?",
          options: ["A faster embedding model", "A restriction so only records matching a condition are eligible", "More dimensions per vector"],
          correct_index: 1,
          explanation: "Filtering limits the search to vectors whose metadata satisfies the given condition."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main risk of naive post-filtering?",
          options: [
            "It always returns too many results",
            "It can return zero results even when valid matches exist deeper in the list",
            "It changes the embedding values",
            "It ignores the query vector"
          ],
          correct_index: 1,
          explanation: "Post-filtering fetches top-k by similarity first, then drops non-matching rows, so if all top-k fail the filter you get nothing."
        },
        {
          question: "Why is access-level metadata filtering security-critical?",
          options: [
            "It speeds up the index build",
            "It can be the only barrier preventing a user from retrieving documents they should not see",
            "It improves embedding quality",
            "It reduces vector dimensionality"
          ],
          correct_index: 1,
          explanation: "Similarity search has no concept of permissions; the filter is what enforces who may retrieve what."
        },
        {
          question: "How does pre-filtering differ from post-filtering?",
          options: [
            "Pre-filtering narrows candidates before the nearest-neighbor search; post-filtering discards after it",
            "Pre-filtering ignores the vector entirely",
            "They are identical in behavior",
            "Pre-filtering only works on numbers"
          ],
          correct_index: 0,
          explanation: "Pre-filtering restricts the candidate set first; post-filtering searches first and then drops non-matching results."
        }
      ],
      participation_activities: [
        {
          activity_title: "Filtering check",
          questions: [
            { question: "A vector that is the closest match in meaning is always a safe result to return to the user.", type: "true_false", correct_answer: "false", explanation: "It may be outdated, in the wrong language, or restricted; filtering enforces those rules." },
            { question: "Running nearest-neighbor search first and then dropping non-matching rows is called ______-filtering.", type: "fill_in", correct_answer: "post", explanation: "Post-filtering can return nothing if all top-k fail the filter." }
          ]
        }
      ],
      starter_code: `# Filter records by metadata before ranking them by similarity score.
docs = [
    {"id": 1, "score": 0.91, "lang": "en", "access": "public"},
    {"id": 2, "score": 0.88, "lang": "de", "access": "public"},
    {"id": 3, "score": 0.95, "lang": "de", "access": "internal"},
    {"id": 4, "score": 0.83, "lang": "de", "access": "public"},
]
query_filter = {"lang": "de", "access": "public"}

# TODO: keep only docs matching every key in query_filter, then sort by score (desc).
print("filter:", query_filter)
`,
      solution_code: `docs = [
    {"id": 1, "score": 0.91, "lang": "en", "access": "public"},
    {"id": 2, "score": 0.88, "lang": "de", "access": "public"},
    {"id": 3, "score": 0.95, "lang": "de", "access": "internal"},
    {"id": 4, "score": 0.83, "lang": "de", "access": "public"},
]
query_filter = {"lang": "de", "access": "public"}

def matches(doc, flt):
    return all(doc.get(key) == value for key, value in flt.items())

eligible = [d for d in docs if matches(d, query_filter)]
eligible.sort(key=lambda d: d["score"], reverse=True)

print("filter:", query_filter)
for d in eligible:
    print(d["id"], d["score"])
`,
      expected_output: `filter: {'lang': 'de', 'access': 'public'}
2 0.88
4 0.83`,
      step_throughs: [
        {
          title: "pre-filter then rank",
          steps: [
            { label: "Start with all candidates", detail: "Every stored vector is a potential match before any rules are applied.", code: "candidates = all_vectors  # 1,000,000 docs" },
            { label: "Apply the metadata filter", detail: "Keep only records whose fields satisfy the filter: right language, public access, recent enough.", code: 'eligible = [d for d in candidates if d.lang == "de" and d.access == "public"]' },
            { label: "Search within the survivors", detail: "Run nearest-neighbor ranking only over the eligible subset, so similarity is computed on allowed docs.", code: "ranked = nearest(query_vec, eligible, k=5)" },
            { label: "Return the allowed top-k", detail: "The results are both similar and permitted, with no off-limits or outdated leaks.", code: "return ranked  # relevant AND allowed" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A doc is the single closest vector to the query but is marked access='internal' while the user is external. Should it be returned?",
          steps: [
            "Similarity only measures how close the meaning is; it knows nothing about permissions.",
            "The access metadata says this document is internal-only, and the user is external.",
            "So the metadata filter must exclude it, regardless of how high its similarity score is."
          ],
          output: "No - the access filter excludes it even though it is the most similar."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You fetch the top-10 by similarity, then post-filter to access='public'. For one query, all 10 happen to be 'internal'. What does the user see, and how do you fix it?",
          steps: [
            "Post-filtering ranks by similarity first, then removes everything failing the filter.",
            "If all 10 top results are 'internal', every one is removed, so the filtered result set is empty.",
            "The user sees no results even though relevant public docs exist further down the similarity ranking.",
            "Fix it by filtering inside the index search, or by over-fetching (e.g. top-100) before post-filtering so enough public docs survive."
          ],
          output: "The user gets zero results; fix with in-index filtering or by over-fetching before post-filtering."
        }
      ],
      comparison_tables: [
        {
          title: "pre-filtering vs post-filtering",
          columns: ["Dimension", "Pre-filtering", "Post-filtering"],
          rows: [
            { cells: ["Order", "Filter, then search", "Search, then filter"] },
            { cells: ["Empty-result risk", "Low", "High (can return nothing)"] },
            { cells: ["Speed with strict filters", "Can be slower", "Fast"] },
            { cells: ["Result completeness", "Reliable", "Risky without over-fetching"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "similarity decides vs metadata filter decides",
          bins: [
            { id: "sim", label: "Decided by similarity" },
            { id: "meta", label: "Decided by metadata filter" }
          ],
          items: [
            { id: "i1", text: "Which doc is closest in meaning", bin: "sim" },
            { id: "i2", text: "Whether the user is allowed to see the doc", bin: "meta" },
            { id: "i3", text: "How relevant a passage is to the question", bin: "sim" },
            { id: "i4", text: "Whether the doc is in the right language", bin: "meta" },
            { id: "i5", text: "Whether the doc is recent enough", bin: "meta" },
            { id: "i6", text: "The ranking order among eligible docs", bin: "sim" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can't you rely on similarity alone, and what does metadata filtering guarantee that similarity cannot?",
          sampleAnswer: "Similarity only measures how close two pieces of meaning are; it has no idea whether a document is outdated, in the wrong language, or restricted. Metadata filtering enforces those rules by restricting the search to records that satisfy structured conditions, so the results are not just relevant but also allowed and correct. Without it, a perfectly similar vector could leak a private or stale document."
        }
      ],
      hints: [
        "Write a helper that checks every key/value in the filter against the doc using all().",
        "Build the eligible list with a comprehension that keeps only matching docs.",
        "Sort the eligible docs by their score in descending order before printing."
      ],
      challenge_title: "Metadata-Filtered Retrieval",
      challenge_description: "Pure similarity isn't enough — a doc must also pass hard business rules. Apply equality filters and a recency floor before ranking.",
      challenge_story: "Your RAG assistant serves a regulated enterprise. Similarity decides *which docs are relevant*, but **metadata** decides *which docs the user is even allowed to see*: the right language, the right product tier, recent enough to be accurate. A pre-filter that the index respects is non-negotiable — surfacing a stale or out-of-scope passage isn't just a bad answer, it's a compliance incident. So your retriever first discards anything that fails the metadata predicates, **then** ranks whatever survives by its semantic score.",
      challenge_statement: "You are given \`n\` candidate documents. Each has an integer **id**, a float similarity **score**, an integer **year**, and zero or more string **metadata** key/value pairs.\n\nApply two filters:\n\n1. **Recency floor:** keep only documents with \`year >= min_year\`.\n2. **Equality filters:** for each given \`(key, value)\` filter, the document's metadata for that key must equal that value. A document missing the key fails.\n\nAmong the survivors, rank by **score descending**. If two survivors tie on score, the one with the **smaller id** comes first. Print the surviving ids in rank order. If nothing survives, print \`NONE\`.",
      challenge_input_format: "The first line is an integer `n`. Each of the next `n` lines describes a document: `id score year` followed by zero or more `key value` metadata pairs, all space-separated (e.g. `2 0.86 2024 lang de`).\n\nThe next line is an integer `min_year`.\n\nThe next line is an integer `f`, the number of equality filters. Each of the following `f` lines is one `key value` pair.",
      challenge_output_format: "One line: the surviving document ids in rank order, space-separated. If no document survives, print `NONE`.",
      challenge_constraints: [
        "0 ≤ n ≤ 100000",
        "0 ≤ f ≤ 20",
        "Scores are floats in [0, 1]; years and ids are integers.",
        "Metadata keys and values contain no spaces.",
      ],
      challenge_examples: [
        { input: "4\n1 0.90 2021 lang de\n2 0.86 2024 lang de\n3 0.93 2024 lang en\n4 0.80 2023 lang de\n2023\n1\nlang de", output: "2 4", explanation: "Doc 1 fails the year floor (2021 < 2023); doc 3 fails the language filter (en ≠ de). The German docs from 2023+ are 2 (0.86) and 4 (0.80), ranked by score." },
        { input: "5\n10 0.95 2024 lang en tier pro\n11 0.91 2024 lang en tier free\n12 0.99 2022 lang en tier pro\n13 0.88 2025 lang en tier pro\n14 0.70 2024 lang de tier pro\n2023\n2\nlang en\ntier pro", output: "10 13", explanation: "Both filters must pass: doc 11 is the free tier, doc 12 is too old, doc 14 is German. Docs 10 (0.95) and 13 (0.88) survive and rank by score." },
      ],
      challenge_notes: "This is *pre-filtering*: cut the candidate set down before ranking. Vector DBs implement exactly this (Pinecone metadata filters, pgvector \`WHERE\` clauses). The ordering still comes from similarity — metadata only decides eligibility, never rank position.",
      challenge_hints: [
        "Write a predicate that returns False the moment any filter fails, so you can drop a doc early.",
        "Use `all(meta.get(key) == value for key, value in filters)` to require every equality filter at once.",
        "Sort survivors with key `(-score, id)` so higher score wins and ties break to the smaller id.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: parse n docs (id, score, year, then key/value metadata pairs),
    #       read min_year and the equality filters, keep docs that pass both
    #       the year floor and every filter, rank by score desc (ties by id),
    #       and print the surviving ids — or NONE.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    docs = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        doc_id = int(parts[0])
        score = float(parts[1])
        year = int(parts[2])
        meta = {}
        i = 3
        while i < len(parts):
            meta[parts[i]] = parts[i + 1]
            i += 2
        docs.append({"id": doc_id, "score": score, "year": year, "meta": meta})

    min_year = int(data[idx]); idx += 1
    f = int(data[idx]); idx += 1
    flt = {}
    for _ in range(f):
        kv = data[idx].split(); idx += 1
        flt[kv[0]] = kv[1]

    def ok(d):
        if d["year"] < min_year:
            return False
        return all(d["meta"].get(key) == val for key, val in flt.items())

    eligible = [d for d in docs if ok(d)]
    eligible.sort(key=lambda d: (-d["score"], d["id"]))
    if eligible:
        print(" ".join(str(d["id"]) for d in eligible))
    else:
        print("NONE")

main()
`,
      challenge_test_cases: [
        { input: "4\n1 0.90 2021 lang de\n2 0.86 2024 lang de\n3 0.93 2024 lang en\n4 0.80 2023 lang de\n2023\n1\nlang de", expected_output: "2 4", description: "Year floor and one language filter; survivors ranked by score." },
        { input: "5\n10 0.95 2024 lang en tier pro\n11 0.91 2024 lang en tier free\n12 0.99 2022 lang en tier pro\n13 0.88 2025 lang en tier pro\n14 0.70 2024 lang de tier pro\n2023\n2\nlang en\ntier pro", expected_output: "10 13", description: "Two equality filters plus the recency floor must all pass." },
        { input: "2\n1 0.9 2020 lang fr\n2 0.8 2021 lang fr\n2023\n1\nlang fr", expected_output: "NONE", description: "Every candidate fails the year floor, so the result is NONE." },
        { input: "2\n1 0.9 2024 lang fr\n2 0.95 2024 lang de\n2024\n0", expected_output: "2 1", description: "No equality filters: pure recency floor, ranked by score (0.95 before 0.90)." }
      ]
    },
    {
      id: "ai-12-l4",
      project_id: "ai-12",
      order: 4,
      title: "Hybrid Search: Keyword + Vector",
      concept: "Hybrid",
      xp_reward: 10,
      explanation: `A user searches for error code "E-4021". Your beautiful semantic search returns documents about *general error handling* — relevant in meaning, useless in fact, because it never anchored on that exact string. Meanwhile a dumb keyword search would have nailed it instantly. The fix isn't to pick a side. It's **hybrid search**: run both and combine them.

## What it is

**Hybrid search** blends two retrieval methods:

- **Keyword (lexical) search** matches exact terms, using classic ranking like **BM25**. It excels at names, codes, IDs, and rare exact strings.
- **Vector (semantic) search** matches meaning. It excels at paraphrases, synonyms, and fuzzy intent ("how do I stop getting charged?" finding a doc titled "Cancel your subscription").

Each is strong exactly where the other is weak. Hybrid search runs both and **fuses** their results into one ranked list.

## How it works

The classic fusion method is **Reciprocal Rank Fusion (RRF)**. Instead of trying to compare a BM25 score to a cosine score (which live on totally different scales), RRF uses only each result's *rank* in each list:

\`\`\`python
def rrf(rank_lists, k=60):
    scores = {}
    for ranked in rank_lists:            # one list per method
        for rank, doc_id in enumerate(ranked):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)
\`\`\`

A document ranked near the top of *either* list gets a strong boost; a document ranked highly in *both* rises to the top. The constant **k** (often 60) damps the influence of any single list so no method dominates. Because RRF only uses ranks, you never have to normalize incompatible score scales.

## Why it matters

- **Exact strings break pure vector search.** Codes, SKUs, error IDs, and proper names are where semantic-only retrieval quietly fails. Keyword search rescues them.
- **Vague intent breaks pure keyword search.** Synonyms and paraphrases share no words with the target. Vector search rescues those.
- **Fusion beats either alone** on mixed real-world queries, which is most of them. Production search is almost always hybrid for this reason.

## The mental model to keep

Keyword search is a **precise scalpel** for exact terms; vector search is a **wide net** for meaning. **Hybrid search uses both tools and merges the catch** so you stop losing queries that only one of them could have answered.`,
      key_terms: [
        { term: "Hybrid search", definition: "Retrieval that runs both keyword and vector search and fuses their results into one ranking." },
        { term: "Keyword (lexical) search", definition: "Exact-term matching and ranking, classically with BM25; strong on names, codes, and rare strings." },
        { term: "BM25", definition: "A standard lexical ranking function that scores documents by exact term overlap with the query." },
        { term: "Reciprocal Rank Fusion (RRF)", definition: "A fusion method that combines result lists using only each item's rank, so incompatible scores never need normalizing." }
      ],
      callouts: [
        { type: "analogy", title: "Scalpel plus net", content: "Keyword search is a scalpel: precise on exact terms like 'E-4021'. Vector search is a wide net: catches meaning even with no shared words. Hybrid carries both and merges what each one caught.", position: "before" },
        { type: "tip", title: "Fuse by rank, not score", content: "BM25 scores and cosine scores live on different scales, so adding them directly is meaningless. RRF sidesteps this by combining ranks instead of raw scores.", position: "after" }
      ],
      concept_diagram: {
        title: "How hybrid search produces one list",
        steps: [
          { label: "Run keyword search", desc: "BM25 ranks documents by exact term overlap." },
          { label: "Run vector search", desc: "Embedding similarity ranks documents by meaning." },
          { label: "Fuse the rankings", desc: "RRF combines both lists using each result's rank." },
          { label: "Return the merged top-k", desc: "Documents strong in either or both methods rise to the top." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does hybrid search combine?",
          options: ["Two different embedding models", "Keyword (lexical) search and vector (semantic) search", "Pre-filtering and post-filtering"],
          correct_index: 1,
          explanation: "Hybrid search fuses exact-term keyword search with meaning-based vector search."
        }
      ],
      quiz_questions: [
        {
          question: "Why does Reciprocal Rank Fusion use ranks instead of raw scores?",
          options: [
            "Ranks are easier to store",
            "BM25 and cosine scores live on different scales, so combining raw scores is meaningless",
            "Ranks make the search faster",
            "Scores are always negative"
          ],
          correct_index: 1,
          explanation: "Lexical and vector scores are not comparable in magnitude, so RRF fuses by rank position, which is scale-free."
        },
        {
          question: "For a query that is an exact error code like 'E-4021', which method is most likely to nail it?",
          options: [
            "Pure vector search",
            "Keyword (lexical) search",
            "A larger embedding model",
            "Post-filtering"
          ],
          correct_index: 1,
          explanation: "Exact strings like codes and IDs are keyword search's strength; pure semantic search often drifts to general matches."
        },
        {
          question: "Why is production search almost always hybrid?",
          options: [
            "Because vector search is broken",
            "Because real queries mix exact terms and vague intent, and each method covers the other's blind spot",
            "Because keyword search is always better",
            "Because it uses less memory"
          ],
          correct_index: 1,
          explanation: "Keyword search handles exact strings and vector search handles paraphrases; fusing them covers the full range of real queries."
        }
      ],
      participation_activities: [
        {
          activity_title: "Hybrid search check",
          questions: [
            { question: "Pure vector search reliably handles exact strings like SKUs and error codes.", type: "true_false", correct_answer: "false", explanation: "Exact strings are a weak spot for semantic search; keyword search handles them." },
            { question: "The fusion method that combines result lists using only each item's rank is called ______ (abbreviation).", type: "fill_in", correct_answer: "RRF", explanation: "Reciprocal Rank Fusion fuses by rank, avoiding score-scale mismatches." }
          ]
        }
      ],
      starter_code: `# Fuse a keyword ranking and a vector ranking with Reciprocal Rank Fusion.
keyword_ranking = ["docB", "docA", "docC"]   # best first
vector_ranking  = ["docA", "docD", "docB"]   # best first

def rrf(rank_lists, k=60):
    scores = {}
    for ranked in rank_lists:
        for rank, doc_id in enumerate(ranked):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return scores

# TODO: compute fused scores, then print doc ids sorted by fused score (desc).
print("fusing two rankings")
`,
      solution_code: `keyword_ranking = ["docB", "docA", "docC"]   # best first
vector_ranking  = ["docA", "docD", "docB"]   # best first

def rrf(rank_lists, k=60):
    scores = {}
    for ranked in rank_lists:
        for rank, doc_id in enumerate(ranked):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return scores

scores = rrf([keyword_ranking, vector_ranking])
fused = sorted(scores, key=scores.get, reverse=True)

print("fusing two rankings")
print(fused)
`,
      expected_output: `fusing two rankings
['docA', 'docB', 'docD', 'docC']`,
      step_throughs: [
        {
          title: "fusing two rankings with RRF",
          steps: [
            { label: "Run both searches", detail: "Keyword search and vector search each return their own ranked list of doc ids for the same query.", code: 'kw = ["docB","docA","docC"]; vec = ["docA","docD","docB"]' },
            { label: "Score by rank position", detail: "Each appearance contributes 1/(k+rank). Higher (earlier) ranks add more; later ranks add less.", code: "contribution = 1 / (60 + rank)" },
            { label: "Sum across lists", detail: "A doc that appears in both lists accumulates from each, so cross-method agreement floats it up.", code: "scores[doc] += contribution  # for every list" },
            { label: "Sort by fused score", detail: "The final ranking favors docs that did well in either method, especially those strong in both.", code: "sorted(scores, key=scores.get, reverse=True)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A user searches for the product code 'SKU-7781'. Pure vector search returns generic 'product catalog' pages. Why, and what fixes it?",
          steps: [
            "Vector search matches meaning, and 'SKU-7781' has little semantic content beyond 'a product code'.",
            "So it drifts to documents that are about products in general rather than that exact code.",
            "Keyword search matches the literal string 'SKU-7781' and finds the exact page; hybrid search adds it back in."
          ],
          output: "Vector search lacks an exact-string anchor; hybrid search adds keyword matching to catch the code."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "With k=60, doc X is rank 0 in the keyword list and absent from the vector list. Doc Y is rank 2 in keyword and rank 0 in vector. Using RRF, which ranks higher?",
          steps: [
            "RRF score for a doc is the sum of 1/(k+rank) over every list it appears in, with k=60.",
            "Doc X: only in keyword at rank 0, so score = 1/(60+0) = 1/60 = 0.016667.",
            "Doc Y: keyword rank 2 gives 1/(60+2) = 1/62 = 0.016129; vector rank 0 gives 1/(60+0) = 1/60 = 0.016667; sum = 0.032796.",
            "Doc Y's total (about 0.0328) is larger than doc X's (about 0.0167), because Y appears strongly in both lists while X appears in only one."
          ],
          output: "Doc Y ranks higher: appearing well in both lists beats being top of just one."
        }
      ],
      comparison_tables: [
        {
          title: "keyword vs vector vs hybrid",
          columns: ["Query type", "Keyword search", "Vector search", "Hybrid"],
          rows: [
            { cells: ["Exact code 'E-4021'", "Excellent", "Often misses", "Excellent"] },
            { cells: ["Paraphrased intent", "Often misses", "Excellent", "Excellent"] },
            { cells: ["Proper names / SKUs", "Excellent", "Weak", "Excellent"] },
            { cells: ["Mixed real-world queries", "Partial", "Partial", "Best overall"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "keyword search wins vs vector search wins",
          bins: [
            { id: "kw", label: "Keyword search wins" },
            { id: "vec", label: "Vector search wins" }
          ],
          items: [
            { id: "i1", text: "Find error code 'E-4021'", bin: "kw" },
            { id: "i2", text: "'how do I stop being charged' -> 'cancel subscription'", bin: "vec" },
            { id: "i3", text: "Look up part number 'SKU-7781'", bin: "kw" },
            { id: "i4", text: "Match a paraphrased question to a how-to doc", bin: "vec" },
            { id: "i5", text: "Find a rare proper name spelled exactly", bin: "kw" },
            { id: "i6", text: "Match synonyms with no shared words", bin: "vec" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does fusing keyword and vector results beat using either method on its own for real-world queries?",
          sampleAnswer: "Real queries are a mix: some hinge on exact strings like codes and names, which keyword search nails but vector search drifts on, and others hinge on paraphrased intent, which vector search nails but keyword search misses. Each method is strong exactly where the other is weak, so fusing their rankings (for example with RRF, which combines ranks to avoid score-scale mismatches) covers both kinds of query and loses far fewer of them than either method alone."
        }
      ],
      hints: [
        "rrf already returns a dict mapping doc id to a fused score.",
        "Call rrf with a list containing both rankings.",
        "Use sorted(scores, key=scores.get, reverse=True) to order ids by fused score."
      ],
      challenge_title: "Weighted Reciprocal Rank Fusion",
      challenge_description: "Keyword search and vector search each return a ranked list. Fuse them into one ranking with weighted Reciprocal Rank Fusion.",
      challenge_story: "Your support search is **hybrid**: a keyword (BM25) engine that nails exact error codes and SKUs, and a vector engine that catches paraphrases and synonyms. Each returns its own ranked list, and neither alone is best. The clean way to merge them — no score normalization, no tuning headaches — is **Reciprocal Rank Fusion (RRF)**: a document's fused score is the sum over every list of \`weight / (k + rank)\`, where rank is 0-based. RRF only cares *where* a doc landed in each list, not the raw scores, which makes it robust across wildly different engines. You give keyword results extra pull by weighting that list higher.",
      challenge_statement: "You are given \`m\` ranked lists of document ids and a constant \`k\`. Each list \`j\` has an integer **weight** \`w_j\`. A document at 0-based **rank** \`r\` in list \`j\` contributes:\n\n\`\`\`\nw_j * (1 / (k + r))\n\`\`\`\n\nto that document's fused score. Sum these contributions across all lists a document appears in.\n\nRank documents by fused score **descending**. If two documents tie on fused score (compared at 9 decimal places of precision), order them **lexicographically by id**.\n\nFirst print the fused order on one line (ids space-separated). Then print each id with its fused score to exactly 6 decimal places, in the same order.",
      challenge_input_format: "The first line has two integers `m k`: the number of ranked lists and the RRF constant.\n\nEach of the next `m` lines is one list: an integer weight followed by the document ids in rank order, all space-separated (e.g. `2 docB docA` means weight 2, with docB at rank 0 and docA at rank 1).",
      challenge_output_format: "The first line is the fused ranking: all ids in fused order, space-separated. Then one line per id, `id score`, with the fused score to exactly 6 decimal places, in the same fused order.",
      challenge_constraints: [
        "1 ≤ m ≤ 20",
        "1 ≤ k ≤ 1000",
        "1 ≤ weight ≤ 1000",
        "Ids contain no spaces; within one list they are distinct.",
      ],
      challenge_examples: [
        { input: "2 60\n2 docB docA\n1 docA docC", output: "docA docB docC\ndocA 0.049454\ndocB 0.033333\ndocC 0.016393", explanation: "docA scores 2/(60+1) from the keyword list plus 1/(60+0) from the vector list = 0.049454, edging out docB at 2/(60+0)=0.033333. docC only appears once at vector rank 1: 1/(60+1)=0.016393." },
        { input: "3 10\n1 a b c\n1 c b a\n2 b", output: "b a c\nb 0.381818\na 0.183333\nc 0.183333", explanation: "b appears at rank 1, rank 1, and rank 0 (weight 2), accumulating the highest fused score. a and c tie exactly, so they order lexicographically: a before c." },
      ],
      challenge_notes: "The constant \`k\` (often 60) dampens the gap between top ranks so no single list can dominate. RRF needs no score calibration — it's why production hybrid search defaults to it. The lexicographic tie-break makes the output deterministic when two docs land in symmetric positions.",
      challenge_hints: [
        "Accumulate scores in a dict: for each list, add `weight * (1 / (k + rank))` for every id at its rank.",
        "Use `enumerate(ids)` to get the 0-based rank of each id in a list.",
        "Sort the ids by key `(-round(score, 9), id)` so the highest score wins and exact ties break lexicographically.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    m, k = map(int, data[0].split())
    # TODO: read m weighted ranked lists, accumulate each doc's fused RRF score
    #       (weight * 1/(k+rank)), then print the fused order and each score
    #       to 6 decimals, breaking ties lexicographically by id.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m, k = data[idx].split()
    m = int(m); k = int(k)
    idx += 1
    scores = {}
    for _ in range(m):
        parts = data[idx].split(); idx += 1
        w = int(parts[0])
        docs = parts[1:]
        for rank, doc_id in enumerate(docs):
            scores[doc_id] = scores.get(doc_id, 0.0) + w * (1.0 / (k + rank))

    order = sorted(scores.keys(), key=lambda d: (-round(scores[d], 9), d))
    print(" ".join(order))
    for d in order:
        print(f"{d} {scores[d]:.6f}")

main()
`,
      challenge_test_cases: [
        { input: "2 60\n2 docB docA\n1 docA docC", expected_output: "docA docB docC\ndocA 0.049454\ndocB 0.033333\ndocC 0.016393", description: "Keyword list weighted double; docA wins by appearing in both lists." },
        { input: "3 10\n1 a b c\n1 c b a\n2 b", expected_output: "b a c\nb 0.381818\na 0.183333\nc 0.183333", description: "A weighted third list lifts b to the top; a and c tie and break lexicographically." },
        { input: "1 60\n1 x y z", expected_output: "x y z\nx 0.016667\ny 0.016393\nz 0.016129", description: "A single list just reflects its own rank order with RRF scores." }
      ]
    },
    {
      id: "ai-12-l5",
      project_id: "ai-12",
      order: 5,
      title: "Re-ranking & Scaling",
      concept: "Reranking",
      xp_reward: 10,
      explanation: `Your vector search returns 50 candidates in 8 milliseconds. Most are roughly right; the truly best three are buried at positions 11, 19, and 34. Re-running the whole index more carefully would be too slow. So you do the smart thing: let the fast index cast a wide net, then spend real compute re-scoring only the handful it caught. That two-stage pattern — **retrieve then re-rank** — is how production search gets both fast *and* accurate.

## What it is

**Re-ranking** is a second pass that re-scores a small candidate set with a heavier, more accurate model, then reorders them. The standard architecture is **two-stage retrieval**:

1. **Retrieve** — a fast ANN search pulls a wide top-k (say 50-100 candidates). Cheap, approximate, high recall.
2. **Re-rank** — a slower **cross-encoder** scores each candidate against the query directly and reorders. Expensive, precise, run only on the survivors.

The key distinction: the retriever uses a **bi-encoder** (embed query and docs separately, compare vectors), while the re-ranker uses a **cross-encoder** (feed query and doc together through a model for a relevance score). Cross-encoders are far more accurate but far too slow to run over millions of docs — which is exactly why you only run them on the retrieved few.

## How it works

\`\`\`python
candidates = vector_index.search(query, k=50)   # stage 1: fast, wide
scored = [(doc, cross_encoder(query, doc)) for doc in candidates]  # stage 2: slow, few
scored.sort(key=lambda x: x[1], reverse=True)
top_results = scored[:5]                          # the final, sharp top-5
\`\`\`

You pay the cross-encoder cost on 50 items, not 50 million. The retriever's job is **recall** (don't miss the good ones); the re-ranker's job is **precision** (put the best ones on top).

## Why it matters

- **Best of both.** Fast retrieval keeps latency low; re-ranking sharpens the final order where it counts — the top few the user actually sees.
- **Scaling levers are real.** Larger datasets push you toward **sharding** (split vectors across machines) and **quantization** (compress vectors to use less memory), each trading a little accuracy or recall for capacity and speed.
- **Recall before precision.** If stage 1 never retrieves a good doc, stage 2 can't rescue it. Tune the retriever for recall first, then let the re-ranker handle precision.

## The mental model to keep

Retrieval is a **fast, generous first sweep**; re-ranking is a **slow, careful final judge** over the short list. **Cast a wide net cheaply, then spend your expensive compute only on what you caught.**`,
      key_terms: [
        { term: "Re-ranking", definition: "A second pass that re-scores a small candidate set with a more accurate model and reorders them." },
        { term: "Two-stage retrieval", definition: "Fast wide retrieval (stage 1) followed by slow precise re-ranking on the candidates (stage 2)." },
        { term: "Bi-encoder", definition: "A model that embeds the query and documents separately so vectors can be precomputed and compared fast." },
        { term: "Cross-encoder", definition: "A model that processes query and document together for an accurate relevance score; too slow to run over everything." },
        { term: "Quantization", definition: "Compressing vectors to fewer bits to save memory and speed search, trading a little accuracy." }
      ],
      callouts: [
        { type: "analogy", title: "Resume screen, then interview", content: "Stage 1 is a fast resume screen that shortlists 50 candidates from millions. Stage 2 is a deep interview that carefully ranks the shortlist. You can't interview everyone, so you screen first.", position: "before" },
        { type: "warning", title: "Re-ranking can't fix bad recall", content: "A cross-encoder only reorders what stage 1 retrieved. If the best document never made the top-50, no re-ranker can surface it. Fix recall in stage 1 first.", position: "after" }
      ],
      concept_diagram: {
        title: "Two-stage retrieve and re-rank",
        steps: [
          { label: "Retrieve wide", desc: "Fast ANN search returns 50-100 candidates with high recall." },
          { label: "Re-score each", desc: "A cross-encoder scores every candidate against the query directly." },
          { label: "Reorder", desc: "Sort candidates by the precise re-ranker scores." },
          { label: "Return the sharp top-k", desc: "Hand back the few best results the user will actually see." }
        ]
      },
      inline_quizzes: [
        {
          question: "In two-stage retrieval, what runs first?",
          options: ["The slow, precise cross-encoder over all documents", "A fast ANN retrieval that returns a wide candidate set", "Metadata filtering only"],
          correct_index: 1,
          explanation: "Stage 1 is fast wide retrieval; the expensive re-ranker runs only on the retrieved candidates."
        }
      ],
      quiz_questions: [
        {
          question: "Why is a cross-encoder used for re-ranking but not for the initial retrieval?",
          options: [
            "It is less accurate than a bi-encoder",
            "It is far more accurate but too slow to run over millions of documents, so it is used only on the retrieved few",
            "It cannot score relevance",
            "It only works on images"
          ],
          correct_index: 1,
          explanation: "Cross-encoders process query and doc together for high accuracy but are too slow for the full corpus, so they re-rank the small candidate set."
        },
        {
          question: "What is the retriever's primary job in a two-stage system?",
          options: [
            "Precision: put the single best result first",
            "Recall: make sure the good documents are in the candidate set",
            "Compressing the vectors",
            "Filtering by metadata only"
          ],
          correct_index: 1,
          explanation: "Stage 1 optimizes recall so the re-ranker has the good candidates to work with; precision is the re-ranker's job."
        },
        {
          question: "Which scaling technique compresses vectors to use less memory?",
          options: [
            "Sharding",
            "Quantization",
            "Re-ranking",
            "Post-filtering"
          ],
          correct_index: 1,
          explanation: "Quantization reduces the bits per vector to save memory and speed search, trading a little accuracy."
        }
      ],
      participation_activities: [
        {
          activity_title: "Re-ranking and scaling check",
          questions: [
            { question: "A re-ranker can surface a great document even if stage-1 retrieval never returned it.", type: "true_false", correct_answer: "false", explanation: "Re-ranking only reorders the retrieved candidates; missed docs cannot be recovered." },
            { question: "The model that processes the query and document together for an accurate score is called a ______-encoder.", type: "fill_in", correct_answer: "cross", explanation: "Cross-encoders are accurate but slow, so they re-rank a small candidate set." }
          ]
        }
      ],
      starter_code: `# Two-stage retrieval: a fast retriever shortlist, then a precise re-rank.
# Stage 1 gives a wide candidate set with rough scores.
# Stage 2 re-scores with a more accurate "cross-encoder" score.
candidates = [
    {"id": "a", "retrieve_score": 0.71, "rerank_score": 0.40},
    {"id": "b", "retrieve_score": 0.69, "rerank_score": 0.92},
    {"id": "c", "retrieve_score": 0.66, "rerank_score": 0.81},
]

# TODO: reorder candidates by rerank_score (desc) and print the ids of the top 2.
print("re-ranking", len(candidates), "candidates")
`,
      solution_code: `candidates = [
    {"id": "a", "retrieve_score": 0.71, "rerank_score": 0.40},
    {"id": "b", "retrieve_score": 0.69, "rerank_score": 0.92},
    {"id": "c", "retrieve_score": 0.66, "rerank_score": 0.81},
]

reranked = sorted(candidates, key=lambda d: d["rerank_score"], reverse=True)
top2 = [d["id"] for d in reranked[:2]]

print("re-ranking", len(candidates), "candidates")
print(top2)
`,
      expected_output: `re-ranking 3 candidates
['b', 'c']`,
      step_throughs: [
        {
          title: "retrieve wide, then re-rank narrow",
          steps: [
            { label: "Retrieve a wide net", detail: "The fast ANN index returns many candidates (here 50). It optimizes recall, not perfect order.", code: "candidates = index.search(query, k=50)" },
            { label: "Re-score with a cross-encoder", detail: "Each candidate is fed through the query together for a precise relevance score. Slow, but only 50 of them.", code: "scores = [cross_encoder(query, c) for c in candidates]" },
            { label: "Reorder by the new scores", detail: "Sort the candidates by the cross-encoder score so the truly best rise to the top.", code: "ranked = sort_by(scores, desc=True)" },
            { label: "Return a sharp top-k", detail: "Hand back the few best results. Fast retrieval kept latency low; re-ranking made the top precise.", code: "return ranked[:5]  # accurate final order" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Stage-1 retrieval ranks doc P above doc Q, but the cross-encoder scores Q higher than P. After re-ranking, which comes first?",
          steps: [
            "Re-ranking reorders candidates using the cross-encoder's more accurate relevance scores.",
            "The cross-encoder scored Q higher than P.",
            "So the final order follows the re-ranker, putting Q ahead of P despite the original retrieval order."
          ],
          output: "Doc Q comes first, because re-ranking uses the more accurate cross-encoder score."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You run a cross-encoder at 5 ms per (query, doc) pair. Re-ranking 50 candidates is fine, but a colleague suggests cross-encoding all 2,000,000 docs per query for 'maximum accuracy'. Estimate the latency and explain the design choice.",
          steps: [
            "Cross-encoding the full corpus means 2,000,000 pairs per query at 5 ms each.",
            "Total time = 2,000,000 x 5 ms = 10,000,000 ms = 10,000 seconds, which is nearly 3 hours per query.",
            "That is completely impractical for an interactive search.",
            "The two-stage design exists precisely to avoid this: a fast bi-encoder retrieves 50 candidates in milliseconds, and the cross-encoder runs only on those 50 (about 250 ms), giving near-cross-encoder accuracy at usable latency."
          ],
          output: "About 10,000 seconds per query - impractical; two-stage retrieval limits the cross-encoder to the retrieved few."
        }
      ],
      comparison_tables: [
        {
          title: "retriever (bi-encoder) vs re-ranker (cross-encoder)",
          columns: ["Dimension", "Retriever / bi-encoder", "Re-ranker / cross-encoder"],
          rows: [
            { cells: ["Speed", "Very fast", "Slow"] },
            { cells: ["Accuracy", "Good", "Higher"] },
            { cells: ["Runs over", "Millions of docs", "Only the candidate few"] },
            { cells: ["Optimizes for", "Recall", "Precision"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "stage 1 (retrieve) vs stage 2 (re-rank)",
          bins: [
            { id: "retrieve", label: "Stage 1: retrieve" },
            { id: "rerank", label: "Stage 2: re-rank" }
          ],
          items: [
            { id: "i1", text: "Fast ANN search over all vectors", bin: "retrieve" },
            { id: "i2", text: "Cross-encoder scores each candidate", bin: "rerank" },
            { id: "i3", text: "Optimizes for recall (don't miss good docs)", bin: "retrieve" },
            { id: "i4", text: "Optimizes for precision (best on top)", bin: "rerank" },
            { id: "i5", text: "Returns a wide top-50 candidate set", bin: "retrieve" },
            { id: "i6", text: "Runs only on the retrieved few", bin: "rerank" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why do production search systems retrieve a wide candidate set first and only then apply an expensive re-ranker, instead of just using the accurate model everywhere?",
          sampleAnswer: "Cross-encoders are far more accurate but must process the query and each document together, which is far too slow to run across millions of documents per query. So the system uses a fast bi-encoder retriever to cheaply pull a wide, high-recall candidate set, then spends the expensive cross-encoder compute only on those few candidates to sharpen the final order. This gives near-cross-encoder precision at retrieval-speed latency, and it works only because stage 1 already captured the good documents - re-ranking can't recover anything stage 1 missed."
        }
      ],
      hints: [
        "Use sorted() with key=lambda d: d['rerank_score'] and reverse=True.",
        "Slice the first two elements of the reranked list.",
        "Build a list of just the 'id' values from those top two candidates."
      ],
      challenge_title: "Retrieve-then-Rerank Pipeline",
      challenge_description: "Cast a wide cheap net, then re-score the finalists with an expensive cross-encoder. Build the two-stage retrieval pipeline.",
      challenge_story: "Your cross-encoder reranker is *accurate* but *slow* — far too slow to run on every document in the corpus. So production search runs in two stages. **Stage 1 (retrieve):** a fast ANN index pulls a wide candidate set, optimized for recall so no good doc is missed. **Stage 2 (rerank):** the heavyweight cross-encoder re-scores only those few candidates, optimized for precision so the very best answer lands on top. The catch: a doc the retriever drops is gone forever, no matter how well the reranker would have scored it. You implement the funnel that turns a cheap recall score and an expensive precision score into a final shortlist.",
      challenge_statement: "You are given \`n\` documents. Each has a string **id**, a float **retrieve_score** (stage-1 ANN score), and a float **rerank_score** (stage-2 cross-encoder score).\n\nRun the two stages:\n\n1. **Retrieve:** keep the top \`retrieve_k\` documents by **retrieve_score** descending. If two tie on retrieve_score, prefer the **lexicographically smaller id**.\n2. **Rerank:** reorder *only those survivors* by **rerank_score** descending. If two tie on rerank_score, prefer the **lexicographically smaller id**. Take the top \`final_k\`.\n\nPrint the final shortlist of ids, space-separated. If \`final_k\` exceeds the number of survivors, print all survivors in reranked order.",
      challenge_input_format: "The first line is an integer `n`. Each of the next `n` lines is `id retrieve_score rerank_score`, space-separated.\n\nThe final line has two integers `retrieve_k final_k`.",
      challenge_output_format: "One line: the final ids after retrieve-then-rerank, space-separated, best first.",
      challenge_constraints: [
        "1 ≤ final_k ≤ retrieve_k ≤ n ≤ 100000",
        "Scores are floats in [0, 1].",
        "Ids contain no spaces and are distinct.",
        "Ties on either score break by lexicographically smaller id.",
      ],
      challenge_examples: [
        { input: "4\na 0.80 0.30\nb 0.75 0.95\nc 0.70 0.60\nd 0.40 0.99\n3 2", output: "b c", explanation: "Stage 1 keeps the top-3 by retrieve_score: a (0.80), b (0.75), c (0.70); d is dropped despite its 0.99 rerank score — the retriever never surfaced it. Stage 2 reorders the survivors by rerank_score: b (0.95), c (0.60), a (0.30). The top-2 are b and c." },
        { input: "5\np 0.99 0.10\nq 0.95 0.90\nr 0.90 0.85\ns 0.85 0.99\nt 0.50 0.99\n4 3", output: "s q r", explanation: "Stage 1 keeps p, q, r, s (top-4 by retrieve; t is cut). Stage 2 reranks them: s (0.99), q (0.90), r (0.85), p (0.10). Top-3 are s, q, r." },
      ],
      challenge_notes: "This funnel is why hybrid search feels both fast and smart: the expensive model only ever sees a handful of candidates. The classic failure mode is setting \`retrieve_k\` too small — a brilliant reranker can't rank a document the retriever already threw away, exactly what happens to doc d above.",
      challenge_hints: [
        "Sort all docs by `(-retrieve_score, id)` and slice the first `retrieve_k` for stage 1.",
        "Sort that survivor list by `(-rerank_score, id)` and slice the first `final_k` for stage 2.",
        "Slicing past the end of a list is safe in Python, so a `final_k` larger than the survivor count just returns them all.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: parse n docs (id, retrieve_score, rerank_score), read retrieve_k
    #       and final_k, keep the top retrieve_k by retrieve_score, rerank those
    #       by rerank_score, and print the top final_k ids (ties by id).

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    docs = []
    for _ in range(n):
        parts = data[idx].split(); idx += 1
        doc_id = parts[0]
        retrieve_score = float(parts[1])
        rerank_score = float(parts[2])
        docs.append({"id": doc_id, "r": retrieve_score, "rr": rerank_score})
    retrieve_k, final_k = map(int, data[idx].split()); idx += 1

    retrieved = sorted(docs, key=lambda d: (-d["r"], d["id"]))[:retrieve_k]
    reranked = sorted(retrieved, key=lambda d: (-d["rr"], d["id"]))[:final_k]
    print(" ".join(d["id"] for d in reranked))

main()
`,
      challenge_test_cases: [
        { input: "4\na 0.80 0.30\nb 0.75 0.95\nc 0.70 0.60\nd 0.40 0.99\n3 2", expected_output: "b c", description: "A high-rerank doc is lost because the retriever dropped it in stage 1." },
        { input: "5\np 0.99 0.10\nq 0.95 0.90\nr 0.90 0.85\ns 0.85 0.99\nt 0.50 0.99\n4 3", expected_output: "s q r", description: "Stage 2 reorders the survivors by rerank score; the top retrieve doc p sinks." },
        { input: "3\nx 0.5 0.9\ny 0.4 0.8\nz 0.3 0.7\n2 5", expected_output: "x y", description: "final_k exceeds the survivor count, so all survivors are returned in reranked order." },
        { input: "3\nm 0.5 0.5\nn 0.5 0.5\no 0.4 0.9\n2 2", expected_output: "m n", description: "Retrieve keeps m and n (o has lower retrieve_score); their rerank tie breaks by id." }
      ]
    }
  ]
};
