export default {
  project: {
    id: "ai-06",
    title: "Embeddings & Semantic Search",
    description: "Turn words into numbers, measure how close they are, and build a movie recommender that actually gets your taste.",
    difficulty: "intermediate",
    category: "rag_search",
    estimated_time: 150,
    lessons_count: 5,
    tags: ["embeddings", "vectors", "cosine-similarity", "semantic-search", "recommender"],
    order: 6,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-06-l1",
      project_id: "ai-06",
      order: 1,
      title: "Words as Coordinates",
      concept: "Vectors",
      xp_reward: 10,
      explanation: `Your phone's autocomplete knows "cat" and "kitten" are related but "cat" and "car" aren't, even though "cat" and "car" share more letters. How? It doesn't read letters. It reads numbers. The word "cat" becomes something like \`[4, 1]\` and the machine compares those numbers, not the spelling.

## What a vector is

A **vector** is just an ordered list of numbers. Picture every word as a dot on a map. "cat" lives at coordinates \`[4, 1]\`. "kitten" lives nearby at \`[3, 1]\`. "car" is way off at \`[1, 5]\`. That list of coordinates is the vector. The map can have 2 dimensions like here, or 1,536 dimensions like a real embedding model. Same idea, more axes.

The whole game of embeddings is one sentence: **place similar things close together and different things far apart.** Once meaning lives as coordinates, "find related words" turns into "find nearby dots," which is just arithmetic.

## How you compare two vectors

You need two tools, and you build each one once:

- **Dot product** — multiply matching components, then add them up. \`[4,1] · [3,1] = 4*3 + 1*1 = 13\`. A bigger result roughly means the two arrows point in a similar direction.
- **Magnitude** — the length of the arrow from the origin to the dot. \`|[4,1]| = sqrt(4² + 1²) = sqrt(17) ≈ 4.123\`. This is just the Pythagorean theorem, extended to any number of axes.

Both reduce to the same Python pattern: walk two lists in lockstep with \`zip\`, do a little math per pair, and \`sum\` the result.

\`\`\`python
import math

cat = [4, 1]
kitten = [3, 1]
print(sum(x * y for x, y in zip(cat, kitten)))  # dot product -> 13
\`\`\`

That \`zip\` pattern shows up constantly across this whole module. Lock it in now.

## Why it matters

Representing words as coordinates is what makes meaning *computable*. Search, recommendations, spam filters, and retrieval for chatbots all start by turning text into vectors so a CPU can rank "closeness" billions of times a second. You could instead store raw spelling, but spelling tells you nothing: "cat" and "car" differ by one letter yet mean unrelated things, while "cat" and "feline" share zero letters yet mean almost the same thing. Numbers placed by meaning fix that.

There is a subtlety, though. You could measure plain straight-line distance between two dots, and sometimes that is fine. But for text, **direction usually matters more than length**. A long document about cats and a one-line tweet about cats should count as similar even though one vector is much "longer." That tension is exactly what the next lesson resolves with the angle between vectors.

## The mental model to keep

A vector is a word's address on a map of meaning. Comparing words is just measuring how their addresses relate, and you only ever need two tools to do it: dot product and magnitude.`,
      key_terms: [
        { term: "Vector", definition: "An ordered list of numbers that locates a thing in space. For text, it represents meaning as coordinates." },
        { term: "Dot product", definition: "Multiply matching components of two vectors and sum the results. A rough measure of how aligned they are." },
        { term: "Magnitude", definition: "The length of a vector's arrow, computed as the square root of the sum of its squared components." },
        { term: "Dimension", definition: "One axis of the vector. Real embedding models use hundreds or thousands of them." }
      ],
      callouts: [
        { type: "analogy", title: "A map of meaning", content: "Think of a city map. Coffee shops cluster downtown, factories cluster by the river. Embeddings do the same with words: similar meanings end up in the same neighborhood.", position: "before" },
        { type: "tip", title: "zip is your friend", content: "sum(x * y for x, y in zip(a, b)) is the cleanest dot product in Python. You'll type it dozens of times this module.", position: "after" }
      ],
      concept_diagram: {
        title: "From word to comparison",
        steps: [
          { label: "Word", desc: "Start with a piece of text like 'cat'." },
          { label: "Vector", desc: "Represent it as coordinates, e.g. [4, 1]." },
          { label: "Dot product", desc: "Multiply and sum against another vector." },
          { label: "Magnitude", desc: "Measure each vector's length with sqrt of squares." }
        ]
      },
      inline_quizzes: [
        {
          question: "What is the dot product of [2, 3] and [4, 1]?",
          options: ["11", "8", "14"],
          correct_index: 0,
          explanation: "2*4 + 3*1 = 8 + 3 = 11."
        }
      ],
      quiz_questions: [
        {
          question: "Why do embeddings represent words as vectors instead of just storing the spelling?",
          options: [
            "Numbers let you measure how similar meanings are with math",
            "Vectors take up less disk space than text",
            "Spelling is too hard for computers to store",
            "Vectors are required by the Python language"
          ],
          correct_index: 0,
          explanation: "The point of vectors is geometry: you can compute distance and angle to find related meanings. Spelling tells you nothing about meaning."
        },
        {
          question: "What is the magnitude of the vector [3, 4]?",
          options: ["5", "7", "12", "25"],
          correct_index: 0,
          explanation: "sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5. The classic 3-4-5 triangle."
        },
        {
          question: "A real text embedding model typically outputs a vector with how many dimensions?",
          options: ["Hundreds to thousands", "Exactly 2", "Exactly 26, one per letter", "Always 10"],
          correct_index: 0,
          explanation: "Models like text embedding APIs commonly produce 768, 1536, or more dimensions. The toy 2D examples here are just for intuition."
        }
      ],
      participation_activities: [
        {
          activity_title: "Sanity-check your intuition",
          questions: [
            { question: "The dot product of two vectors can be larger when they point in similar directions.", type: "true_false", correct_answer: "true", explanation: "Aligned vectors reinforce each other component by component, producing a larger sum." },
            { question: "Magnitude is calculated using the ____ theorem (square root of sum of squares).", type: "fill_in", correct_answer: "Pythagorean", explanation: "Magnitude generalizes the Pythagorean theorem to any number of dimensions." }
          ]
        }
      ],
      step_throughs: [
        {
          title: "word → vector → dot product → score",
          steps: [
            { label: "Start with a word", detail: "Pick the text you want to locate on the map of meaning.", code: '"cat"' },
            { label: "Look up its vector", detail: "An embedding assigns coordinates. Similar words get nearby coordinates.", code: "cat = [4, 1]   kitten = [3, 1]" },
            { label: "Multiply component by component", detail: "Pair up matching axes with zip and multiply each pair.", code: "4*3 = 12   and   1*1 = 1" },
            { label: "Sum into one score", detail: "Add the products. A larger sum means the arrows lean the same way.", code: "12 + 1 = 13   (cat . kitten)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Compute the dot product of [2, 3] and [4, 1] by hand.",
          steps: [
            "Pair the matching components: (2,4) and (3,1).",
            "Multiply each pair: 2*4 = 8, then 3*1 = 3.",
            "Add the products: 8 + 3 = 11."
          ],
          output: "dot = 11"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Compute the magnitude of [6, 8], then explain why it does NOT tell you the vector's direction.",
          steps: [
            "Square every component: 6² = 36 and 8² = 64.",
            "Sum the squares: 36 + 64 = 100.",
            "Take the square root: sqrt(100) = 10.",
            "Direction is unchanged if you scale the vector — [3, 4] points the same way but has magnitude 5. So magnitude measures length only, never which way the arrow points."
          ],
          output: "magnitude = 10 (length only, says nothing about direction)"
        }
      ],
      comparison_tables: [
        {
          title: "dot product vs magnitude",
          columns: ["Tool", "What it measures", "Formula", "Uses two vectors?"],
          rows: [
            { cells: ["Dot product", "How aligned two arrows are", "sum(a_i * b_i)", "Yes — needs a pair"] },
            { cells: ["Magnitude", "Length of one arrow", "sqrt(sum(x_i²))", "No — one vector"] },
            { cells: ["Combined (next lesson)", "Pure direction, length removed", "dot / (mag * mag)", "Yes — the workhorse"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "needs two vectors or just one?",
          bins: [
            { id: "two", label: "Needs two vectors" },
            { id: "one", label: "Works on one vector" }
          ],
          items: [
            { id: "i1", text: "Dot product", bin: "two" },
            { id: "i2", text: "Magnitude (length)", bin: "one" },
            { id: "i3", text: "Straight-line distance", bin: "two" },
            { id: "i4", text: "Normalizing to length 1", bin: "one" },
            { id: "i5", text: "Cosine similarity", bin: "two" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why store a word as a vector of numbers instead of just storing its spelling?",
          sampleAnswer: "Spelling tells you nothing about meaning — 'cat' and 'car' look similar but mean different things, while 'cat' and 'feline' share no letters but mean almost the same. A vector places each word by meaning, so you can do arithmetic (dot product, distance) to measure how related two words are."
        }
      ],
      starter_code: `import math

# Two word vectors on a tiny 2D "meaning map"
cat = [4, 1]
kitten = [3, 1]
car = [1, 5]

def dot(a, b):
    # TODO: multiply matching components and sum them
    pass

def magnitude(v):
    # TODO: sqrt of the sum of squares
    pass

print("cat . kitten =", dot(cat, kitten))
print("|cat| =", round(magnitude(cat), 3))`,
      solution_code: `import math

cat = [4, 1]
kitten = [3, 1]
car = [1, 5]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

print("cat . kitten =", dot(cat, kitten))
print("|cat| =", round(magnitude(cat), 3))
print("cat . car =", dot(cat, car))`,
      expected_output: `cat . kitten = 13
|cat| = 4.123
cat . car = 9`,
      hints: [
        "dot: zip(a, b) pairs up components. Multiply each pair, then wrap it in sum(...).",
        "magnitude: square every component with x * x, sum them, then take math.sqrt.",
        "Round only for display: round(value, 3) keeps three decimals."
      ],
      challenge_title: "Nearest Neighbor in Embedding Space",
      challenge_description: "Given a query embedding and a catalog of named embeddings, print the one closest by Euclidean distance.",
      challenge_story: "You are building the retrieval layer of an AI photo-tagging service. Every image has already been turned into an embedding vector by an upstream model, and so has the user's query image. The whole product hinges on one operation: *which stored image sits closest to this query in embedding space?* Closest dot on the map wins. You measure closeness the most literal way there is — straight-line (Euclidean) distance — and return the winning tag so the rest of the pipeline can act on it.",
      challenge_statement: "You are given a **query vector** and a catalog of **N named vectors**, all of dimension **D**. Find the catalog entry whose vector has the **smallest Euclidean distance** to the query.\n\nThe Euclidean distance between vectors `a` and `b` is `sqrt(sum((a_i - b_i)^2))`.\n\nIf two or more entries tie for the smallest distance, choose the one whose **name is lexicographically smallest**. Print that name and its distance.",
      challenge_input_format: "The first line holds two integers `N` and `D`.\nThe second line holds `D` integers: the query vector.\nEach of the next `N` lines holds a name (a string with no spaces) followed by `D` integers: that catalog entry's vector.",
      challenge_output_format: "One line: the winning name, a single space, then the Euclidean distance to the query formatted to exactly **4 decimal places**.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "1 ≤ D ≤ 64",
        "-1000 ≤ each coordinate ≤ 1000",
        "Names are non-empty, contain no whitespace, and are unique"
      ],
      challenge_examples: [
        { input: "3 2\n0 0\ncat 3 4\nkitten 1 1\ncar 6 8", output: "kitten 1.4142", explanation: "Distances from (0,0): cat = 5, kitten = sqrt(2) ≈ 1.4142, car = 10. Kitten is closest." },
        { input: "1 2\n7 7\nonly 0 0", output: "only 9.8995", explanation: "With one entry it always wins; distance = sqrt(49+49) = sqrt(98) ≈ 9.8995." }
      ],
      challenge_notes: "Compare squared distances while searching to avoid needless `sqrt` calls, then take the square root only once for the final print. The lexicographic tie-break makes the answer deterministic when two vectors are equally close.",
      challenge_hints: [
        "Read all tokens at once with `sys.stdin.read().split()` and walk an index, since vectors span the line in fixed-size chunks of D.",
        "Track the best distance as a squared value; only the relative order matters during the search.",
        "On a tie (equal squared distance), keep the entry whose name compares smaller with `<`.",
        "Format the final distance with an f-string: `f\"{dist:.4f}\"`."
      ],
      challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    d = int(data[idx]); idx += 1
    query = [int(data[idx + i]) for i in range(d)]; idx += d
    # TODO: scan the N catalog entries, find the nearest by Euclidean distance,
    # break ties by smallest name, then print "name distance" (4 decimals).

main()`,
      challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    d = int(data[idx]); idx += 1
    query = [int(data[idx + i]) for i in range(d)]; idx += d
    best_name = None
    best_dist_sq = None
    for _ in range(n):
        name = data[idx]; idx += 1
        vec = [int(data[idx + i]) for i in range(d)]; idx += d
        dist_sq = sum((a - b) ** 2 for a, b in zip(query, vec))
        if (best_dist_sq is None
                or dist_sq < best_dist_sq
                or (dist_sq == best_dist_sq and name < best_name)):
            best_dist_sq = dist_sq
            best_name = name
    print(f"{best_name} {math.sqrt(best_dist_sq):.4f}")

main()`,
      challenge_test_cases: [
        { input: "3 2\n0 0\ncat 3 4\nkitten 1 1\ncar 6 8", expected_output: "kitten 1.4142", description: "Example 1: kitten is closest to the origin query." },
        { input: "1 2\n7 7\nonly 0 0", expected_output: "only 9.8995", description: "Example 2: single entry always wins." },
        { input: "4 3\n2 2 2\nalpha 2 2 2\nbeta 5 5 5\ngamma 0 0 0\ndelta 3 3 3", expected_output: "alpha 0.0000", description: "Edge: an exact match yields distance 0." },
        { input: "2 2\n0 0\nfar 3 0\nnear 2 0", expected_output: "near 2.0000", description: "Edge: straightforward 1-D-style separation along one axis." }
      ]
    },
    {
      id: "ai-06-l2",
      project_id: "ai-06",
      order: 2,
      title: "Cosine Similarity",
      concept: "Cosine",
      xp_reward: 10,
      explanation: `Here is the problem with dot product alone: a vector that is just *longer* scores higher even when it points the same way. A 2,000-word essay about cars and a quick "I love cars" tweet should rank as equally car-ish. Raw dot product punishes the tweet for being short. The fix is to throw away length and keep only **direction**. That is cosine similarity.

## What it is

**Cosine similarity** is the cosine of the angle between two vectors. Two arrows pointing the same way have a 0-degree angle, and cos(0) = 1. Two arrows at right angles have a 90-degree angle, and cos(90) = 0. The score tells you alignment, and alignment is exactly what "similar meaning" looks like on the map.

## How it works

You already wrote \`dot\` and \`magnitude\` last lesson. Cosine glues them together:

\`\`\`
cosine(a, b) = dot(a, b) / (magnitude(a) * magnitude(b))
\`\`\`

Dividing the dot product by both magnitudes cancels out the length of each vector. What survives is purely the angle between them. Step by step: compute the raw alignment with the dot product, then divide away how long each arrow happens to be, and you are left with the cosine of the angle.

\`\`\`python
def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))
\`\`\`

Reading the score is simple:

- **1.0** — same direction. Basically synonyms.
- **0.0** — perpendicular. Unrelated.
- **-1.0** — opposite. Rare with real text embeddings, which usually land between 0 and 1.

So when you compute \`cosine(die_hard, mad_max) = 0.99\` and \`cosine(die_hard, notebook) = 0.26\`, the model is telling you Die Hard and Mad Max are nearly the same flavor of movie, and The Notebook is a different world.

## Why it matters

Cosine similarity is the workhorse of search, recommendations, RAG retrieval, and duplicate detection. Almost every "find me things like this" feature you have ever used runs cosine, or a close cousin, under the hood. It wins over plain dot product because real text varies wildly in length: a product description, a one-line review, and a full article about the same item should all match a query, and only an angle-based measure treats them fairly. Learn it once, recognize it everywhere.

One gotcha to respect: if a vector is all zeros, its magnitude is zero and you divide by zero. Real embedding models never return a zero vector, but hand-built vectors can, so guard against it when you craft vectors yourself.

## The mental model to keep

Dot product asks "how much do these overlap, length included?" Cosine asks "ignoring size, are they pointing the same way?" For meaning, the second question is almost always the one you want answered.`,
      key_terms: [
        { term: "Cosine similarity", definition: "Dot product divided by both magnitudes. Measures the angle between vectors, ignoring their length. Ranges from -1 to 1." },
        { term: "Direction vs length", definition: "Cosine cares only about which way a vector points, not how long it is, so document size stops skewing results." },
        { term: "Similarity score", definition: "A single number where higher means more alike. Cosine outputs one for any pair of vectors." }
      ],
      callouts: [
        { type: "insight", title: "Length is noise here", content: "Two pieces of text about the same topic can have very different vector lengths just because one is longer. Cosine throws that length away so meaning is all that's left.", position: "before" },
        { type: "warning", title: "Don't divide by zero", content: "A zero vector has magnitude 0, which crashes cosine. Real models never return zeros, but hand-built vectors can. Guard it if you're unsure.", position: "after" }
      ],
      concept_diagram: {
        title: "How cosine works",
        steps: [
          { label: "Dot product", desc: "Measure raw alignment of the two vectors." },
          { label: "Divide by magnitudes", desc: "Cancel out the length of each vector." },
          { label: "Get the angle", desc: "What's left is the cosine of the angle between them." },
          { label: "Score 0 to 1", desc: "1 means same direction, 0 means unrelated." }
        ]
      },
      inline_quizzes: [
        {
          question: "Two movie vectors give cosine similarity 0.99. What does that mean?",
          options: ["They are nearly the same kind of movie", "They are completely unrelated", "One is the opposite of the other"],
          correct_index: 0,
          explanation: "A cosine near 1 means the vectors point almost the same direction, so the movies are very similar."
        }
      ],
      quiz_questions: [
        {
          question: "Why is cosine similarity often preferred over plain dot product for text?",
          options: [
            "It ignores vector length so long and short texts compare fairly",
            "It is faster to compute than a dot product",
            "It always returns a whole number",
            "It works without computing a dot product at all"
          ],
          correct_index: 0,
          explanation: "Dividing by both magnitudes removes length, so a long document and a short one about the same topic still score high."
        },
        {
          question: "What cosine similarity would you expect between two perpendicular (unrelated) vectors?",
          options: ["0", "1", "-1", "100"],
          correct_index: 0,
          explanation: "Perpendicular vectors have a 90-degree angle, and the cosine of 90 degrees is 0."
        },
        {
          question: "What happens if you pass a zero vector to cosine(a, b)?",
          options: [
            "Division by zero, because its magnitude is 0",
            "It returns 1.0 safely",
            "It returns the dot product unchanged",
            "Nothing, zero vectors are ignored automatically"
          ],
          correct_index: 0,
          explanation: "Magnitude of a zero vector is 0, and dividing by it raises an error. Guard against this when building vectors by hand."
        }
      ],
      participation_activities: [
        {
          activity_title: "Cosine reality check",
          questions: [
            { question: "Cosine similarity can range from -1 to 1.", type: "true_false", correct_answer: "true", explanation: "It's the cosine of an angle, so it spans -1 (opposite) through 0 (perpendicular) to 1 (aligned)." },
            { question: "Cosine divides the dot product by the product of the two ____.", type: "fill_in", correct_answer: "magnitudes", explanation: "Dividing by both magnitudes is what removes length from the comparison." }
          ]
        }
      ],
      step_throughs: [
        {
          title: "two vectors → dot → divide by lengths → similarity",
          steps: [
            { label: "Start with two vectors", detail: "Toy genre vectors for two movies on the [action, romance] map.", code: "a = [3, 1]   b = [4, 2]" },
            { label: "Dot product (raw alignment)", detail: "Multiply matching components and sum them.", code: "3*4 + 1*2 = 12 + 2 = 14" },
            { label: "Divide by both magnitudes", detail: "Cancel out how long each arrow is.", code: "|a| = sqrt(10) ≈ 3.162   |b| = sqrt(20) ≈ 4.472" },
            { label: "Read the similarity", detail: "What remains is the cosine of the angle: near 1 means nearly the same direction.", code: "14 / (3.162 * 4.472) ≈ 0.99" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Compute cosine similarity of [1, 0] and [0, 1] by hand.",
          steps: [
            "Dot product: 1*0 + 0*1 = 0.",
            "Magnitudes: |[1,0]| = 1 and |[0,1]| = 1.",
            "Cosine = 0 / (1 * 1) = 0 — the vectors are perpendicular, so completely unrelated."
          ],
          output: "cosine = 0.0 (unrelated)"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "Compute cosine similarity of [2, 1] and [4, 2], then explain the result.",
          steps: [
            "Dot product: 2*4 + 1*2 = 8 + 2 = 10.",
            "Magnitudes: |[2,1]| = sqrt(5) ≈ 2.236, |[4,2]| = sqrt(20) ≈ 4.472.",
            "Cosine = 10 / (2.236 * 4.472) = 10 / 10.0 = 1.0.",
            "It is exactly 1.0 because [4, 2] is just [2, 1] scaled by 2 — same direction, double the length. Cosine ignores length, so it reports a perfect match."
          ],
          output: "cosine = 1.0 (same direction, length doesn't matter)"
        }
      ],
      comparison_tables: [
        {
          title: "dot product vs cosine similarity",
          columns: ["Property", "Dot product", "Cosine similarity"],
          rows: [
            { cells: ["Affected by length", "Yes — longer vectors score higher", "No — length divided out"] },
            { cells: ["Range", "Unbounded", "-1 to 1"] },
            { cells: ["Fair across text sizes", "No", "Yes"] },
            { cells: ["Used for semantic search", "Only after normalizing", "The default choice"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "what cosine score would these pairs get?",
          bins: [
            { id: "high", label: "Near 1 (similar)" },
            { id: "low", label: "Near 0 (unrelated)" }
          ],
          items: [
            { id: "i1", text: "[1, 0] and [0.9, 0.1]", bin: "high" },
            { id: "i2", text: "[1, 0] and [0, 1]", bin: "low" },
            { id: "i3", text: "[2, 2] and [5, 5]", bin: "high" },
            { id: "i4", text: "[1, 0] and [0.1, 0.99]", bin: "low" },
            { id: "i5", text: "[3, 4] and [6, 8]", bin: "high" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain in your own words why a long article and a one-line tweet about the same topic get a high cosine score even though their vectors have very different lengths.",
          sampleAnswer: "Cosine divides the dot product by both magnitudes, which removes length entirely and leaves only the angle between the vectors. Since both texts point the same direction on the map of meaning, the angle is tiny and the cosine is near 1 — the model judges them by topic, not by how many words they happen to have."
        }
      ],
      starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    # TODO: dot product divided by both magnitudes
    pass

# Toy genre vectors: [action, romance, comedy]
movies = {
    "Die Hard":     [0.9, 0.1, 0.2],
    "The Notebook": [0.1, 0.9, 0.2],
    "Mad Max":      [0.95, 0.05, 0.1],
    "Bridesmaids":  [0.2, 0.4, 0.9],
}

target = movies["Die Hard"]
for name, vec in movies.items():
    if name == "Die Hard":
        continue
    print(name, round(cosine(target, vec), 3))`,
      solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

movies = {
    "Die Hard":     [0.9, 0.1, 0.2],
    "The Notebook": [0.1, 0.9, 0.2],
    "Mad Max":      [0.95, 0.05, 0.1],
    "Bridesmaids":  [0.2, 0.4, 0.9],
}

target = movies["Die Hard"]
scores = []
for name, vec in movies.items():
    if name == "Die Hard":
        continue
    scores.append((name, cosine(target, vec)))

scores.sort(key=lambda x: -x[1])
for name, s in scores:
    print(name + ":", round(s, 3))`,
      expected_output: `Mad Max: 0.992
Bridesmaids: 0.429
The Notebook: 0.256`,
      hints: [
        "cosine is one line: dot(a, b) / (magnitude(a) * magnitude(b)).",
        "Collect (name, score) tuples in a list so you can sort them.",
        "Sort descending with scores.sort(key=lambda x: -x[1]) so the closest match prints first."
      ],
      challenge_title: "Closest by Angle",
      challenge_description: "Pick the catalog vector most aligned with a query by cosine similarity, ignoring length entirely.",
      challenge_story: "Your semantic search backend keeps surfacing long documents over short ones simply because longer text produces longer vectors, and raw dot product rewards length. Product is furious: a three-word support ticket that perfectly answers the query keeps losing to a rambling, half-relevant FAQ. The fix is to rank by **direction, not length** — cosine similarity. Re-rank the candidates so the one pointing most truly at the query wins, no matter how long or short its vector is.",
      challenge_statement: "You are given **N** named candidate vectors and one **query** vector, all of dimension **D**. Print the candidate with the **highest cosine similarity** to the query.\n\nCosine similarity is `dot(a, b) / (magnitude(a) * magnitude(b))`, the cosine of the angle between the two vectors.\n\nIf two candidates tie for the highest similarity, choose the one whose **name is lexicographically smallest**. Print that name and its cosine similarity.",
      challenge_input_format: "The first line holds two integers `N` and `D`.\nEach of the next `N` lines holds a name (no spaces) followed by `D` numbers: that candidate's vector.\nThe final line holds `D` numbers: the query vector.",
      challenge_output_format: "One line: the winning name, a single space, then the cosine similarity formatted to exactly **4 decimal places**.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "1 ≤ D ≤ 64",
        "Coordinates are real numbers with magnitude up to 1000",
        "No candidate vector and no query vector is all zeros",
        "Names are non-empty, contain no whitespace, and are unique"
      ],
      challenge_examples: [
        { input: "3 3\nDieHard 0.9 0.1 0.2\nNotebook 0.1 0.9 0.2\nMadMax 0.95 0.05 0.1\n0.9 0.1 0.2", output: "DieHard 1.0000", explanation: "The query is exactly DieHard's vector, so DieHard scores a perfect 1.0000 — same direction." },
        { input: "2 2\nalpha 2 0\nbeta 4 0\n1 0", output: "alpha 1.0000", explanation: "Both alpha and beta point along the x-axis, so both score 1.0000; the lexicographic tie-break picks alpha." }
      ],
      challenge_notes: "Cosine ignores magnitude, which is exactly why alpha (length 2) and beta (length 4) tie above: only their shared direction matters. Compute `dot` and `magnitude` as small helpers and combine them — you will reuse this pattern in every later lesson.",
      challenge_hints: [
        "Read line by line so each candidate's name and numbers stay together.",
        "cosine(a, b) = dot(a, b) / (magnitude(a) * magnitude(b)); build dot and magnitude as helpers.",
        "Track the best score with a small epsilon so floating-point ties are detected, then break ties by smaller name.",
        "Print with `f\"{name} {score:.4f}\"`."
      ],
      challenge_starter_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    n, d = map(int, lines[0].split())
    # TODO: parse N candidates, then the query line, rank by cosine,
    # break ties by smallest name, print "name score" (4 decimals).

main()`,
      challenge_solution_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    pos = 0
    n, d = map(int, lines[pos].split()); pos += 1
    items = []
    for _ in range(n):
        parts = lines[pos].split(); pos += 1
        name = parts[0]
        vec = [float(x) for x in parts[1:1 + d]]
        items.append((name, vec))
    query = [float(x) for x in lines[pos].split()[:d]]
    best_name = None
    best_score = None
    for name, vec in items:
        score = cosine(query, vec)
        if (best_score is None
                or score > best_score + 1e-12
                or (abs(score - best_score) <= 1e-12 and name < best_name)):
            best_score = score
            best_name = name
    print(f"{best_name} {best_score:.4f}")

main()`,
      challenge_test_cases: [
        { input: "3 3\nDieHard 0.9 0.1 0.2\nNotebook 0.1 0.9 0.2\nMadMax 0.95 0.05 0.1\n0.9 0.1 0.2", expected_output: "DieHard 1.0000", description: "Example 1: identical direction scores 1.0." },
        { input: "2 2\nalpha 2 0\nbeta 4 0\n1 0", expected_output: "alpha 1.0000", description: "Example 2: cosine ignores length; tie broken by name." },
        { input: "2 2\na 1 0\nb 0 1\n1 0", expected_output: "a 1.0000", description: "Edge: 'a' aligns, 'b' is perpendicular (score 0)." },
        { input: "4 3\nA 1 2 2\nB 2 1 2\nC 0 0 5\nD 3 0 0\n2 2 1", expected_output: "A 0.8889", description: "Edge: best alignment is a non-trivial angle." }
      ]
    },
    {
      id: "ai-06-l3",
      project_id: "ai-06",
      order: 3,
      title: "Normalize Once, Compare Fast",
      concept: "Normalization",
      xp_reward: 10,
      explanation: `Say you have got 10,000 movies and a user picks one. You want the closest matches, fast. Computing cosine the naive way recalculates two square-root magnitudes for *every* comparison. That is wasteful, and it gets brutal at a million vectors. Production search engines all use the same trick, and once you see it you cannot unsee it.

## What it is

To **normalize** a vector, divide every component by its magnitude. The result points the exact same direction but has length 1. A vector with length exactly 1 is called a **unit vector**.

\`\`\`python
def normalize(v):
    m = magnitude(v)
    return [x / m for x in v]
\`\`\`

Take \`[3, 4]\`. Its magnitude is 5. Normalized, it becomes \`[0.6, 0.8]\`. Check the length: \`sqrt(0.6² + 0.8²) = sqrt(0.36 + 0.64) = sqrt(1) = 1\`. Same direction, length rescaled to one.

## How it works (and why it speeds things up)

Recall cosine is \`dot(a, b) / (mag(a) * mag(b))\`. If both vectors are already normalized, both magnitudes are 1, so dividing by them changes nothing. The whole formula collapses:

\`\`\`
cosine(a, b) = dot(a, b)        # when a and b are unit vectors
\`\`\`

That is the payoff. **Normalize your entire database once, up front, at index time.** After that, every query is a plain dot product — no square roots in the hot loop, no per-comparison magnitude work. For a million-vector index, that is the difference between snappy and sluggish. This is precisely why real vector databases store normalized embeddings, and some embedding APIs even return pre-normalized vectors so you can skip the step entirely.

## Why it matters

Normalization is a classic **precompute** move: do the expensive work once and store the result so repeated queries stay cheap. A few things to keep straight:

- Normalizing a **zero vector** divides by zero — the same trap as cosine. Guard it.
- After normalizing, the raw numbers look small (all between -1 and 1). That is expected, not a bug.
- The angle between two vectors does not change when you normalize. You are only rescaling length, never rotating, so all your similarity scores stay identical.

Prove it to yourself: compute cosine the long way, then normalize both vectors and take a bare dot product. Same answer. That equivalence is the entire reason normalization is worth doing.

## The mental model to keep

Normalize once at index time so every search becomes a single fast dot product. You trade a bit of upfront work for cheap queries forever after.`,
      key_terms: [
        { term: "Normalize", definition: "Divide a vector by its magnitude so it keeps direction but has length 1." },
        { term: "Unit vector", definition: "A vector with magnitude exactly 1. The output of normalizing." },
        { term: "Precompute", definition: "Do expensive work once and store the result, so repeated queries stay cheap." }
      ],
      callouts: [
        { type: "insight", title: "Normalized dot = cosine", content: "Once both vectors have length 1, the magnitude divisions become divisions by 1. Cosine simplifies to a bare dot product, which is much faster at scale.", position: "before" },
        { type: "tip", title: "Do it at index time", content: "Normalize every vector when you load your database, not when you query. The user-facing search then skips all the square roots.", position: "after" }
      ],
      concept_diagram: {
        title: "Normalize then compare",
        steps: [
          { label: "Compute magnitude", desc: "Find the vector's current length." },
          { label: "Divide each component", desc: "Scale every number by 1 / magnitude." },
          { label: "Unit vector", desc: "Same direction, length now exactly 1." },
          { label: "Dot product = cosine", desc: "Comparing two unit vectors needs only a dot product." }
        ]
      },
      inline_quizzes: [
        {
          question: "After you normalize [3, 4], what is its magnitude?",
          options: ["1", "5", "7", "0"],
          correct_index: 0,
          explanation: "Normalizing always produces a vector of length 1 (a unit vector)."
        }
      ],
      quiz_questions: [
        {
          question: "If two vectors are both normalized, cosine similarity simplifies to what?",
          options: [
            "Just the dot product",
            "Just the magnitude of one vector",
            "The Euclidean distance",
            "Always 1"
          ],
          correct_index: 0,
          explanation: "Both magnitudes are 1, so dividing by them changes nothing. Cosine becomes a plain dot product."
        },
        {
          question: "Why do vector databases store normalized embeddings?",
          options: [
            "So each query is a fast dot product with no square roots",
            "To make the vectors take up zero disk space",
            "Because un-normalized vectors cannot be searched at all",
            "To change the meaning encoded in each vector"
          ],
          correct_index: 0,
          explanation: "Precomputing the normalization once means every search is a cheap dot product instead of a full cosine calculation."
        },
        {
          question: "Does normalizing a vector change the angle between it and another vector?",
          options: [
            "No, normalizing only changes length, not direction",
            "Yes, it rotates the vector by 90 degrees",
            "Yes, it reverses the direction",
            "Only if the vector has more than 2 dimensions"
          ],
          correct_index: 0,
          explanation: "Normalization rescales length while preserving direction, so all the angles stay the same."
        }
      ],
      participation_activities: [
        {
          activity_title: "Normalization facts",
          questions: [
            { question: "A unit vector always has a magnitude of 1.", type: "true_false", correct_answer: "true", explanation: "That's the definition of a unit vector: length exactly 1." },
            { question: "Normalizing a ____ vector causes a division-by-zero error.", type: "fill_in", correct_answer: "zero", explanation: "A zero vector has magnitude 0, and you can't divide by 0." }
          ]
        }
      ],
      step_throughs: [
        {
          title: "vector → magnitude → divide → unit vector",
          steps: [
            { label: "Start with a raw vector", detail: "Any non-zero vector; its length is whatever it happens to be.", code: "v = [3, 4]" },
            { label: "Compute its magnitude", detail: "Square the components, sum, take the square root.", code: "sqrt(3² + 4²) = sqrt(25) = 5" },
            { label: "Divide each component", detail: "Scale every number by 1 / magnitude.", code: "[3/5, 4/5] = [0.6, 0.8]" },
            { label: "Confirm length is 1", detail: "The unit vector points the same way but now has length exactly 1, so cosine reduces to a plain dot product.", code: "sqrt(0.6² + 0.8²) = 1.0" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Normalize the vector [0, 5] by hand.",
          steps: [
            "Magnitude: sqrt(0² + 5²) = sqrt(25) = 5.",
            "Divide each component by 5: [0/5, 5/5].",
            "Result: [0.0, 1.0], which has length 1."
          ],
          output: "[0.0, 1.0]"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "Show that the cosine of [3, 4] and [4, 3] equals the dot product of their normalized versions.",
          steps: [
            "Cosine the long way: dot = 3*4 + 4*3 = 24; magnitudes are both 5; cosine = 24 / (5*5) = 0.96.",
            "Normalize each: [3,4] → [0.6, 0.8] and [4,3] → [0.8, 0.6].",
            "Dot of the unit vectors: 0.6*0.8 + 0.8*0.6 = 0.48 + 0.48 = 0.96.",
            "Both routes give 0.96 — proof that a normalized dot product IS cosine similarity."
          ],
          output: "0.96 either way"
        }
      ],
      comparison_tables: [
        {
          title: "raw cosine vs precomputed normalized dot",
          columns: ["Step", "Naive cosine per query", "Normalize-once then dot"],
          rows: [
            { cells: ["Work per comparison", "1 dot + 2 magnitudes (2 sqrt)", "1 dot, no sqrt"] },
            { cells: ["When sqrt happens", "Every single query", "Once, at index time"] },
            { cells: ["Score returned", "Cosine similarity", "Cosine similarity (identical)"] },
            { cells: ["Cost at 1M vectors", "Slow", "Fast"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "is this vector already normalized?",
          bins: [
            { id: "unit", label: "Unit vector (length 1)" },
            { id: "raw", label: "Not normalized" }
          ],
          items: [
            { id: "i1", text: "[0.6, 0.8]", bin: "unit" },
            { id: "i2", text: "[3, 4]", bin: "raw" },
            { id: "i3", text: "[1, 0]", bin: "unit" },
            { id: "i4", text: "[0.0, 1.0]", bin: "unit" },
            { id: "i5", text: "[5, 0]", bin: "raw" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why do vector databases normalize embeddings once when they are loaded instead of computing full cosine on every search?",
          sampleAnswer: "Full cosine requires two square-root magnitudes per comparison, which is expensive when you run it across millions of vectors per query. If every vector is normalized to length 1 ahead of time, both magnitudes are 1 and cosine collapses to a bare dot product. The square roots are paid once at load time, so each user search becomes a cheap, fast dot product."
        }
      ],
      starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def normalize(v):
    # TODO: divide each component by the magnitude
    pass

v = [3.0, 4.0]
unit = normalize(v)
print("unit vector =", unit)
print("unit magnitude =", magnitude(unit))`,
      solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def normalize(v):
    m = magnitude(v)
    return [x / m for x in v]

v = [3.0, 4.0]
print("magnitude =", magnitude(v))
unit = normalize(v)
print("unit vector = [" + str(unit[0]) + ", " + str(unit[1]) + "]")
print("unit magnitude =", magnitude(unit))

# Prove normalized dot product equals cosine
a = [3.0, 4.0]
b = [4.0, 3.0]
ua = normalize(a)
ub = normalize(b)
print("normalized dot =", round(dot(ua, ub), 4))
print("cosine(a,b) =", round(cosine(a, b), 4))`,
      expected_output: `magnitude = 5.0
unit vector = [0.6, 0.8]
unit magnitude = 1.0
normalized dot = 0.96
cosine(a,b) = 0.96`,
      hints: [
        "normalize: compute m = magnitude(v) first, then return [x / m for x in v].",
        "A correctly normalized vector should report magnitude 1.0.",
        "The last two prints should match: that's the proof that normalized dot equals cosine."
      ],
      challenge_title: "Pre-Normalize the Index",
      challenge_description: "Convert a batch of embeddings into unit vectors so query time can skip the square roots.",
      challenge_story: "Your vector database is about to serve millions of queries a second, and every query currently pays for two magnitude computations (two square roots) per comparison. A senior engineer points out the classic trick: **normalize every vector once at index time**, store the unit vectors, and cosine similarity collapses into a plain dot product at query time. Your job is the offline batch step — take the raw embeddings being ingested and emit their normalized forms. A zero vector (rare, but it happens with corrupt rows) has no direction, so it stays all zeros.",
      challenge_statement: "You are given **N** vectors of dimension **D**. For each one, output its **normalized (unit) vector**: divide every component by the vector's magnitude `sqrt(sum(x_i^2))`.\n\nIf a vector is **all zeros**, its magnitude is 0 and it has no direction — output it unchanged as a vector of zeros.",
      challenge_input_format: "The first line holds two integers `N` and `D`.\nEach of the next `N` lines holds `D` numbers: one vector.",
      challenge_output_format: "Output `N` lines. Line `i` holds the `D` components of the `i`-th normalized vector, space-separated, each formatted to exactly **4 decimal places**.",
      challenge_constraints: [
        "1 ≤ N ≤ 1000",
        "1 ≤ D ≤ 64",
        "Coordinates are real numbers with magnitude up to 1000"
      ],
      challenge_examples: [
        { input: "3 2\n3 4\n0 5\n0 0", output: "0.6000 0.8000\n0.0000 1.0000\n0.0000 0.0000", explanation: "(3,4) has magnitude 5 → (0.6, 0.8). (0,5) has magnitude 5 → (0, 1). (0,0) has no direction, so it stays zero." },
        { input: "1 3\n2 3 6", output: "0.2857 0.4286 0.8571", explanation: "Magnitude is sqrt(4+9+36)=7, so divide each component by 7." }
      ],
      challenge_notes: "Once vectors are unit-length, `cosine(a, b)` simplifies to `dot(a, b)` because both magnitudes are 1 — that is the whole point of normalizing the index ahead of time. Guard the zero vector explicitly so you never divide by zero.",
      challenge_hints: [
        "magnitude(v) = sqrt(sum(x*x for x in v)).",
        "If the magnitude is exactly 0, emit a row of zeros instead of dividing.",
        "Otherwise each component becomes x / magnitude.",
        "Build each output line with `' '.join(f\"{u:.4f}\" for u in unit)`."
      ],
      challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    d = int(data[idx]); idx += 1
    # TODO: for each of the N vectors, print its unit vector (4 decimals),
    # leaving an all-zero vector unchanged.

main()`,
      challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    d = int(data[idx]); idx += 1
    out_lines = []
    for _ in range(n):
        vec = [float(data[idx + i]) for i in range(d)]; idx += d
        m = math.sqrt(sum(x * x for x in vec))
        if m == 0.0:
            unit = [0.0] * d
        else:
            unit = [x / m for x in vec]
        out_lines.append(" ".join(f"{u:.4f}" for u in unit))
    print("\\n".join(out_lines))

main()`,
      challenge_test_cases: [
        { input: "3 2\n3 4\n0 5\n0 0", expected_output: "0.6000 0.8000\n0.0000 1.0000\n0.0000 0.0000", description: "Example 1: includes the zero-vector edge case." },
        { input: "1 3\n2 3 6", expected_output: "0.2857 0.4286 0.8571", description: "Example 2: magnitude 7." },
        { input: "2 2\n-3 4\n5 0", expected_output: "-0.6000 0.8000\n1.0000 0.0000", description: "Edge: negative components keep their sign after scaling." }
      ]
    },
    {
      id: "ai-06-l4",
      project_id: "ai-06",
      order: 4,
      title: "Build the Movie Recommender",
      concept: "Recommender",
      xp_reward: 10,
      explanation: `Time to ship the thing. "Because you watched Die Hard..." — that row on every streaming service is cosine similarity over movie vectors. You now have every piece to build it.

## What a recommender is

A **recommender** ranks items by similarity to something a user already likes. There is no magic: it turns "what should I watch next?" into "which vectors point closest to the vector of what you just watched?" The seed is the item you are finding neighbors for, and the answer is the nearest few vectors.

## How it works

The recipe is four steps:

1. Give each movie a vector. Real systems learn these from viewing data; here we hand-craft genre scores so you can read them.
2. To recommend for a movie, compute cosine similarity from its vector to every other movie.
3. Sort the results descending.
4. Take the top N — that is the list.

Our vectors have five dimensions: \`[action, romance, comedy, scifi, drama]\`, each from 0 to 1. Die Hard is heavy action, light everything else. Interstellar leans sci-fi and drama. The math surfaces the right neighbors.

\`\`\`python
def recommend(title, n=3):
    target = movies[title]
    scored = [(name, cosine(target, vec))
              for name, vec in movies.items()
              if name != title]
    scored.sort(key=lambda x: -x[1])
    return scored[:n]
\`\`\`

That \`if name != title\` is not optional. A movie is always perfectly similar to itself (cosine 1.0), so recommending Die Hard to a Die Hard fan would top the list while being useless. Always exclude the **seed item**.

## Why it matters

You could instead just filter by a single genre label, but movies are blends. Blade Runner is sci-fi *and* action *and* noir-drama at once. A vector captures that mix in one shot, so it finds Interstellar (another sci-fi/drama lean) even though their top genre tag differs. Tags cannot do that without a tangle of if-statements, and the tangle grows with every new genre. Vectors scale; rule-based tags do not.

There is one more move that makes this production-ready. A real user likes several movies, not one. The standard trick: **average their liked vectors** into a single **taste vector**, then find the nearest movies to that average. One vector, one search, captures the blend of everything they enjoy — that is the challenge below.

## The mental model to keep

Embed, compare with cosine, sort, return top N. That same four-step skeleton powers movie recommendations, document search, RAG retrieval, and duplicate detection. Different data, identical machinery.`,
      key_terms: [
        { term: "Recommender", definition: "A system that ranks items by similarity to something a user already likes." },
        { term: "Seed item", definition: "The movie or item you're finding neighbors for. Exclude it from its own results." },
        { term: "Taste vector", definition: "The average of a user's liked vectors, used as a single query that captures their overall preference." }
      ],
      callouts: [
        { type: "analogy", title: "A blended smoothie", content: "Averaging a user's liked movie vectors is like blending their favorite fruits into one smoothie, then finding the movie that tastes most like that blend.", position: "before" },
        { type: "warning", title: "Drop the seed", content: "Every item scores cosine 1.0 against itself. If you forget to exclude the seed movie, your top recommendation will always be the movie the user already picked.", position: "after" }
      ],
      concept_diagram: {
        title: "Recommendation pipeline",
        steps: [
          { label: "Vectorize", desc: "Each movie becomes a genre vector." },
          { label: "Score", desc: "Cosine similarity from the seed to every other movie." },
          { label: "Sort", desc: "Order matches from highest similarity down." },
          { label: "Top N", desc: "Return the best few, excluding the seed itself." }
        ]
      },
      inline_quizzes: [
        {
          question: "When recommending movies similar to Die Hard, why exclude Die Hard from the results?",
          options: ["It scores 1.0 against itself and isn't a useful suggestion", "It has no vector", "Cosine can't handle it", "It would crash the sort"],
          correct_index: 0,
          explanation: "A movie is always maximally similar to itself, so it would top the list while being a pointless recommendation."
        }
      ],
      quiz_questions: [
        {
          question: "How do you recommend movies for a user who likes several films at once?",
          options: [
            "Average their liked vectors into one taste vector, then find nearest movies",
            "Pick a random liked movie and ignore the rest",
            "Add the magnitudes of all liked vectors together",
            "Recommend only movies with the exact same genre tag"
          ],
          correct_index: 0,
          explanation: "Averaging the liked vectors produces a single query that captures the blend of everything the user enjoys."
        },
        {
          question: "Why can a vector recommender beat filtering by a single genre tag?",
          options: [
            "Vectors capture a blend of genres, so mixed-genre movies still match well",
            "Tags are slower to read from a database",
            "Vectors are always exactly one genre",
            "Genre tags cannot be stored in Python"
          ],
          correct_index: 0,
          explanation: "A movie like Blade Runner is sci-fi, action, and drama at once. A vector encodes that mix; a single tag can't."
        },
        {
          question: "After scoring every movie, what is the final step to produce recommendations?",
          options: [
            "Sort by similarity descending and take the top N (minus the seed)",
            "Return every movie in alphabetical order",
            "Pick the movie with the lowest cosine score",
            "Average all the scores into one number"
          ],
          correct_index: 0,
          explanation: "Recommendations are the highest-similarity items, so you sort descending and slice off the top few."
        }
      ],
      participation_activities: [
        {
          activity_title: "Recommender logic",
          questions: [
            { question: "A movie always has cosine similarity 1.0 with itself.", type: "true_false", correct_answer: "true", explanation: "Identical vectors point the same direction, giving a cosine of exactly 1." },
            { question: "To recommend for a multi-movie user, you ____ their liked vectors into one taste vector.", type: "fill_in", correct_answer: "average", explanation: "Averaging blends all their preferences into a single query vector." }
          ]
        }
      ],
      step_throughs: [
        {
          title: "seed → score all → sort → top N",
          steps: [
            { label: "Pick the seed movie", detail: "The movie the user just watched becomes the query vector.", code: 'target = movies["Die Hard"]' },
            { label: "Score every other movie", detail: "Cosine similarity from the seed to each candidate, skipping the seed itself.", code: "[(name, cosine(target, vec)) for name, vec in movies.items() if name != title]" },
            { label: "Sort by similarity, descending", detail: "Highest cosine first so the closest matches rise to the top.", code: "scored.sort(key=lambda x: -x[1])" },
            { label: "Return the top N", detail: "Slice the best few — that is the recommendation row.", code: "scored[:3]  ->  Mad Max, Blade Runner, Interstellar" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "With seed Die Hard = [1, 0] (pure action) and candidates Mad Max = [0.9, 0.1] and The Notebook = [0, 1], which is recommended first?",
          steps: [
            "cosine(Die Hard, Mad Max) = (1*0.9 + 0*0.1) / (1 * sqrt(0.82)) ≈ 0.9 / 0.906 ≈ 0.994.",
            "cosine(Die Hard, The Notebook) = (1*0 + 0*1) / (1 * 1) = 0.",
            "Mad Max scores far higher, so it is recommended first."
          ],
          output: "Mad Max (0.994) ranks above The Notebook (0.0)"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A user liked Die Hard = [1, 0] and The Notebook = [0, 1]. Build their taste vector, then score Bridesmaids = [0.5, 0.5] against it.",
          steps: [
            "Average the liked vectors component-wise: [(1+0)/2, (0+1)/2] = [0.5, 0.5].",
            "That [0.5, 0.5] is the taste vector — equal pull toward action and romance.",
            "cosine(taste, Bridesmaids) = (0.5*0.5 + 0.5*0.5) / (sqrt(0.5) * sqrt(0.5)) = 0.5 / 0.5 = 1.0.",
            "Bridesmaids points the exact same direction as the blended taste, so it is a perfect match for this mixed user."
          ],
          output: "taste = [0.5, 0.5]; cosine to Bridesmaids = 1.0"
        }
      ],
      comparison_tables: [
        {
          title: "single genre tag vs vector recommender",
          columns: ["Aspect", "Filter by one genre tag", "Cosine over vectors"],
          rows: [
            { cells: ["Mixed-genre movies", "Forced into one bucket", "Captured as a blend"] },
            { cells: ["Adding a new genre", "More if-statements", "Just another dimension"] },
            { cells: ["Multi-movie users", "Hard to combine", "Average into one taste vector"] },
            { cells: ["Ranking quality", "Coarse", "Fine-grained and scalable"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "part of the recommend pipeline, or not?",
          bins: [
            { id: "yes", label: "In the pipeline" },
            { id: "no", label: "Not part of it" }
          ],
          items: [
            { id: "i1", text: "Compute cosine to every movie", bin: "yes" },
            { id: "i2", text: "Sort scores descending", bin: "yes" },
            { id: "i3", text: "Exclude the seed movie", bin: "yes" },
            { id: "i4", text: "Sort movie titles alphabetically", bin: "no" },
            { id: "i5", text: "Return the lowest-scoring movie", bin: "no" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "Explain in your own words why averaging a user's liked movie vectors into one taste vector is better than recommending based on just their single most-recent movie.",
          sampleAnswer: "A single movie only captures one slice of taste. Averaging all the liked vectors produces one query that blends every preference, so a user who likes both action and romance gets recommendations that lean toward the middle instead of being dragged toward whichever movie they happened to watch last. One taste vector, one search, captures the whole pattern."
        }
      ],
      starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

# [action, romance, comedy, scifi, drama]
movies = {
    "Die Hard":          [0.9, 0.1, 0.3, 0.1, 0.4],
    "Mad Max: Fury Road":[0.95, 0.1, 0.1, 0.6, 0.3],
    "The Notebook":      [0.1, 0.95, 0.2, 0.0, 0.8],
    "Bridesmaids":       [0.2, 0.4, 0.95, 0.0, 0.3],
    "Blade Runner":      [0.6, 0.2, 0.1, 0.95, 0.7],
    "Interstellar":      [0.4, 0.3, 0.1, 0.9, 0.85],
    "Notting Hill":      [0.1, 0.9, 0.7, 0.0, 0.5],
}

def recommend(title, n=3):
    # score every other movie, sort, return top n
    pass

for name, score in recommend("Die Hard"):
    print(name, round(score, 3))`,
      solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

movies = {
    "Die Hard":          [0.9, 0.1, 0.3, 0.1, 0.4],
    "Mad Max: Fury Road":[0.95, 0.1, 0.1, 0.6, 0.3],
    "The Notebook":      [0.1, 0.95, 0.2, 0.0, 0.8],
    "Bridesmaids":       [0.2, 0.4, 0.95, 0.0, 0.3],
    "Blade Runner":      [0.6, 0.2, 0.1, 0.95, 0.7],
    "Interstellar":      [0.4, 0.3, 0.1, 0.9, 0.85],
    "Notting Hill":      [0.1, 0.9, 0.7, 0.0, 0.5],
}

def recommend(title, n=3):
    target = movies[title]
    scored = [(name, cosine(target, vec))
              for name, vec in movies.items()
              if name != title]
    scored.sort(key=lambda x: -x[1])
    return scored[:n]

print("Because you liked Die Hard:")
for name, score in recommend("Die Hard"):
    print("" + name + " (" + str(round(score, 3)) + ")")

print("Because you liked Interstellar:")
for name, score in recommend("Interstellar"):
    print("" + name + " (" + str(round(score, 3)) + ")")`,
      expected_output: `Because you liked Die Hard:
  Mad Max: Fury Road (0.883)
  Blade Runner (0.692)
  Interstellar (0.611)
Because you liked Interstellar:
  Blade Runner (0.979)
  Mad Max: Fury Road (0.775)
  Die Hard (0.611)`,
      hints: [
        "Build scored as a list of (name, cosine) tuples, skipping the seed with if name != title.",
        "Sort descending: scored.sort(key=lambda x: -x[1]).",
        "Slice the top n with scored[:n] and return it."
      ],
      challenge_title: "Recommend From a Taste Profile",
      challenge_description: "Average a user's liked-movie vectors into a taste profile, then recommend the unseen movie closest to it.",
      challenge_statement: "You are building the core of a movie recommender. A user has rated some movies, and you have an embedding for every movie in the catalog.\n\nBuild the user's **taste vector** as the **element-wise average** of the vectors of the movies they liked. Then score every movie the user has **not** liked by cosine similarity to the taste vector, and recommend the highest-scoring one.\n\nNever recommend a movie the user already liked (it would score near-perfectly against a taste vector built partly from itself). If two unseen movies tie for the top score, choose the one whose **name is lexicographically smallest**.",
      challenge_story: "It is launch week for the recommendations tab. The model team handed you embeddings for the whole catalog; your job is the logic that turns *\"movies this user loved\"* into *\"one movie to suggest next.\"* The trick everyone uses: blend the liked movies into a single **taste vector** (just average them), then find the unseen movie whose vector points most the same way. Skip anything they have already seen — recommending a movie back to the person who just rated it is the fastest way to look broken.",
      challenge_input_format: "The first line holds two integers `N` and `D` — the catalog size and embedding dimension.\nEach of the next `N` lines holds a movie name (no spaces) followed by `D` numbers: that movie's vector.\nThe final line holds the space-separated names of the movies the user liked (at least one).",
      challenge_output_format: "One line: the recommended movie's name, a single space, then its cosine similarity to the taste vector formatted to exactly **4 decimal places**.",
      challenge_constraints: [
        "1 ≤ number of liked movies < N ≤ 1000",
        "1 ≤ D ≤ 64",
        "Coordinates are real numbers with magnitude up to 1000",
        "No catalog vector is all zeros, and the taste vector is never all zeros",
        "Every liked name appears in the catalog; names are unique"
      ],
      challenge_examples: [
        { input: "4 3\nDieHard 0.9 0.1 0.2\nNotebook 0.1 0.9 0.2\nMadMax 0.95 0.05 0.1\nBridesmaids 0.2 0.4 0.9\nDieHard MadMax", output: "Bridesmaids 0.3705", explanation: "Taste = average of DieHard and MadMax = (0.925, 0.075, 0.15). DieHard and MadMax are excluded as already liked, so the recommender ranks the two remaining films; Bridesmaids edges out Notebook." },
        { input: "3 2\nA 1 0\nB 0 1\nC 0.9 0.1\nA", output: "C 0.9939", explanation: "Taste is just A's vector (1, 0). Of the unseen movies, C points almost the same way (score 0.9939) while B is perpendicular." }
      ],
      challenge_notes: "The taste vector is a blended 'smoothie' of everything the user liked; cosine then finds the unseen movie that 'tastes' most like that blend. Excluding the seed movies is the single most common bug in a first recommender — guard it with a set lookup.",
      challenge_hints: [
        "Store the catalog as a dict name → vector, and remember insertion order for deterministic iteration.",
        "taste[i] = average of liked_vec[i] over all liked movies.",
        "Put the liked names in a set and `continue` past them while scoring.",
        "Rank by cosine with an epsilon tie-check, breaking ties on the smaller name."
      ],
      challenge_starter_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    n, d = map(int, lines[0].split())
    # TODO: read the catalog, read the liked names, build the average taste
    # vector, then recommend the best unseen movie (exclude liked ones).

main()`,
      challenge_solution_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    pos = 0
    n, d = map(int, lines[pos].split()); pos += 1
    catalog = {}
    order = []
    for _ in range(n):
        parts = lines[pos].split(); pos += 1
        name = parts[0]
        catalog[name] = [float(x) for x in parts[1:1 + d]]
        order.append(name)
    liked = lines[pos].split(); pos += 1
    liked_vecs = [catalog[name] for name in liked]
    k = len(liked_vecs)
    taste = [sum(v[i] for v in liked_vecs) / k for i in range(d)]
    liked_set = set(liked)
    best_name = None
    best_score = None
    for name in order:
        if name in liked_set:
            continue
        score = cosine(taste, catalog[name])
        if (best_score is None
                or score > best_score + 1e-12
                or (abs(score - best_score) <= 1e-12 and name < best_name)):
            best_score = score
            best_name = name
    print(f"{best_name} {best_score:.4f}")

main()`,
      challenge_test_cases: [
        { input: "4 3\nDieHard 0.9 0.1 0.2\nNotebook 0.1 0.9 0.2\nMadMax 0.95 0.05 0.1\nBridesmaids 0.2 0.4 0.9\nDieHard MadMax", expected_output: "Bridesmaids 0.3705", description: "Example 1: two liked movies excluded; best of the rest recommended." },
        { input: "3 2\nA 1 0\nB 0 1\nC 0.9 0.1\nA", expected_output: "C 0.9939", description: "Example 2: single liked movie, C is the closest unseen one." },
        { input: "5 2\nm1 1 0\nm2 0 1\nm3 1 1\nm4 2 0\nm5 0 2\nm1 m2", expected_output: "m3 1.0000", description: "Edge: taste (0.5, 0.5) aligns perfectly with diagonal m3." }
      ]
    },
    {
      id: "ai-06-l5",
      project_id: "ai-06",
      order: 5,
      title: "Real Embeddings & Semantic Search",
      concept: "Semantic search",
      xp_reward: 10,
      explanation: `Our movie vectors were hand-written. That does not scale to 10,000 movies or to free-form text like support tickets. For real text you call an **embedding model**: send it a string, get back a vector of floats. Then the exact same cosine-and-sort code you have been writing all module works on anything.

## What it is

An **embedding model** converts text into a fixed-length vector of floats that represents its meaning. **Semantic search** is finding documents by meaning rather than exact words, using those vectors and cosine similarity. The two ideas are inseparable: the model gives you the coordinates, cosine ranks the closeness.

## How it works — and where keyword search breaks

Old-school search matches literal words. Type "I forgot my password and can't sign in" and a keyword engine finds the doc containing "password." But it completely misses "My login isn't working anymore" because that doc shares *zero* words with your query. Same meaning, different vocabulary, and keyword search is blind to it.

Embeddings fix this. A good model places "sign in," "login," and "log in" near each other in vector space because it learned from data that they mean the same thing. So semantic search retrieves the login doc even with no shared words. Calling the model is conceptually one HTTP request:

\`\`\`python
import os
import requests

def embed(text):
    resp = requests.post(
        "https://api.example-embeddings.com/v1/embed",
        headers={"Authorization": "Bearer " + os.environ["EMBEDDING_API_KEY"]},
        json={"model": "text-embedding-3", "input": text},
    )
    return resp.json()["data"][0]["embedding"]  # e.g. 1536 floats
\`\`\`

**Never hardcode the key.** Read it from \`os.environ\`. Committed keys get scraped off GitHub within minutes. The vector that comes back is just a longer version of what you have used all module.

From there the loop is four steps:

1. Embed every document once, up front. Store the vectors.
2. Embed the user's query when it arrives.
3. Cosine-similarity the query against every stored vector.
4. Sort and return the top results.

## Why it matters

This is the engine behind modern search and **RAG** (Retrieval-Augmented Generation): you embed your documents, retrieve the relevant ones by similarity, and feed them to an LLM as grounded context. Done once at index time, document embeddings are reused across every query, so only the short query is embedded fresh — that is what keeps it fast and cheap at scale. The runnable code below uses pre-stored vectors so it is deterministic with no network call, but the logic is identical to production. Watch the payoff: the query has no words in common with "My login isn't working anymore," yet that doc still ranks second. Keyword search can never pull that off.

## The mental model to keep

The model turns text into coordinates; cosine ranks the coordinates. Embed once, query forever, and you have semantic search that understands meaning instead of matching spelling.`,
      key_terms: [
        { term: "Embedding model", definition: "A model that converts text into a fixed-length vector of floats representing its meaning." },
        { term: "Semantic search", definition: "Finding documents by meaning rather than exact words, using embedding vectors and cosine similarity." },
        { term: "RAG", definition: "Retrieval-Augmented Generation: embed documents, retrieve the relevant ones by similarity, feed them to an LLM as context." }
      ],
      callouts: [
        { type: "insight", title: "Meaning beats spelling", content: "Embeddings can match 'login isn't working' to a query about 'sign in' with no shared words. Keyword search physically cannot do that.", position: "before" },
        { type: "warning", title: "Keys live in the environment", content: "Read API keys from os.environ['EMBEDDING_API_KEY'], never paste them into source. Committed keys get scraped from GitHub within minutes.", position: "after" }
      ],
      concept_diagram: {
        title: "Semantic search end to end",
        steps: [
          { label: "Embed docs", desc: "Convert every document to a vector, once, and store them." },
          { label: "Embed query", desc: "Convert the user's question to a vector." },
          { label: "Cosine + sort", desc: "Score the query against every stored vector and rank them." },
          { label: "Return top hits", desc: "Surface the most semantically similar documents." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why can semantic search find 'My login isn't working' for the query 'I can't sign in' when keyword search can't?",
          options: ["Embeddings place similar meanings near each other even with different words", "It secretly does a string match", "It searches by spelling", "Keyword search is just slower"],
          correct_index: 0,
          explanation: "Embeddings encode meaning, so synonyms land close in vector space. Keyword search only matches shared words."
        }
      ],
      quiz_questions: [
        {
          question: "What does an embedding model return when you send it a string of text?",
          options: [
            "A fixed-length vector of floats representing the meaning",
            "A summary sentence",
            "A single true or false value",
            "The text with synonyms substituted in"
          ],
          correct_index: 0,
          explanation: "Embedding models output a numeric vector, often hundreds or thousands of dimensions, capturing the text's meaning."
        },
        {
          question: "In semantic search, which step should you do once up front rather than per query?",
          options: [
            "Embedding all the documents and storing their vectors",
            "Embedding the user's query",
            "Sorting the results",
            "Computing cosine similarity"
          ],
          correct_index: 0,
          explanation: "Document vectors don't change, so embed them once and reuse. Only the query is embedded fresh each search."
        },
        {
          question: "Where should an embedding API key come from in your code?",
          options: [
            "An environment variable like os.environ['EMBEDDING_API_KEY']",
            "A string literal pasted into the source file",
            "A comment at the top of the file",
            "The git commit message"
          ],
          correct_index: 0,
          explanation: "Keys belong in the environment, never in source. Hardcoded keys leak the moment the code is shared or committed."
        }
      ],
      participation_activities: [
        {
          activity_title: "Semantic search facts",
          questions: [
            { question: "Semantic search can match documents that share no words with the query.", type: "true_false", correct_answer: "true", explanation: "Because it compares meaning vectors, not literal words, synonyms still match." },
            { question: "The pattern of embedding docs, retrieving by similarity, and feeding them to an LLM is called ____.", type: "fill_in", correct_answer: "RAG", explanation: "Retrieval-Augmented Generation grounds an LLM's answers in retrieved documents." }
          ]
        }
      ],
      step_throughs: [
        {
          title: "query text → embed → cosine vs docs → top hit",
          steps: [
            { label: "User types a query", detail: "Free-form text, possibly sharing no words with any stored doc.", code: '"I forgot my password and can\'t sign in"' },
            { label: "Embed the query", detail: "The model returns a vector capturing the meaning, not the words.", code: "query_vec = embed(query)  # e.g. [0.88, 0.14, 0.06]" },
            { label: "Cosine against every stored doc", detail: "Score the query vector against each pre-embedded document.", code: "[(doc, cosine(query_vec, vec)) for doc, vec in docs.items()]" },
            { label: "Sort and surface the top hits", detail: "The login doc ranks high despite zero shared words — that is semantic matching.", code: "0.998  \"My login isn't working anymore\"" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Query vector [1, 0]. Docs: A = [0.99, 0.1], B = [0.1, 0.99]. Which doc is the top semantic hit?",
          steps: [
            "cosine([1,0], A) = (1*0.99 + 0*0.1) / (1 * sqrt(0.99²+0.1²)) ≈ 0.99 / 0.995 ≈ 0.995.",
            "cosine([1,0], B) = (1*0.1 + 0*0.99) / (1 * sqrt(0.1²+0.99²)) ≈ 0.1 / 0.995 ≈ 0.10.",
            "A scores far higher, so A is returned first."
          ],
          output: "Doc A (0.995) beats Doc B (0.10)"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "A query about 'sign in' shares no words with a doc about 'login.' Explain step by step how semantic search still ranks that doc near the top.",
          steps: [
            "The embedding model was trained on huge text where 'sign in,' 'login,' and 'log in' appear in the same contexts.",
            "It therefore places all three near each other in vector space — their vectors point almost the same direction.",
            "When the query is embedded, its vector lands in that same neighborhood.",
            "Cosine between the query vector and the login doc's vector is high (small angle), so it ranks near the top — even though they share zero literal words. Keyword search, comparing words, would score them 0."
          ],
          output: "High cosine from shared meaning, not shared words"
        }
      ],
      comparison_tables: [
        {
          title: "keyword search vs semantic search",
          columns: ["Property", "Keyword search", "Semantic search"],
          rows: [
            { cells: ["Matches on", "Exact shared words", "Meaning (vectors)"] },
            { cells: ["Handles synonyms", "No", "Yes"] },
            { cells: ["'sign in' finds 'login' doc", "Misses it", "Finds it"] },
            { cells: ["Needs an embedding model", "No", "Yes"] },
            { cells: ["Powers modern RAG", "No", "Yes"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which search approach handles each case?",
          bins: [
            { id: "kw", label: "Keyword search is fine" },
            { id: "sem", label: "Needs semantic search" }
          ],
          items: [
            { id: "i1", text: "Find docs containing the exact SKU 'XQ-441'", bin: "kw" },
            { id: "i2", text: "Match 'can't log in' to a 'sign-in failure' doc", bin: "sem" },
            { id: "i3", text: "Match 'refund' query to 'money back' article", bin: "sem" },
            { id: "i4", text: "Grep for the literal error code 'E_504'", bin: "kw" },
            { id: "i5", text: "Match 'how to cancel' to 'ending your subscription'", bin: "sem" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why must the embedding API key come from an environment variable instead of being written directly in the source code?",
          sampleAnswer: "A key pasted into source travels everywhere the code goes — into git history, shared files, and public repos. Bots scrape GitHub for leaked keys within minutes and run up charges or steal access. Reading it from os.environ keeps the secret out of the code entirely, so the same source can be shared or committed safely while the key stays on the machine that runs it."
        }
      ],
      starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

# Pre-stored embedding vectors (stand-ins for a real API response)
docs = {
    "How do I reset my password?":           [0.91, 0.10, 0.05],
    "The checkout page is throwing an error": [0.10, 0.88, 0.20],
    "Can I get a refund for my order?":       [0.15, 0.30, 0.90],
    "My login isn't working anymore":         [0.85, 0.18, 0.08],
}

# Embedding of: "I forgot my password and can't sign in"
query_vec = [0.88, 0.14, 0.06]

def search(query_vec, docs):
    # score every doc, sort, return list of (doc, score)
    pass

for doc, score in search(query_vec, docs):
    print(round(score, 3), doc)`,
      solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

docs = {
    "How do I reset my password?":           [0.91, 0.10, 0.05],
    "The checkout page is throwing an error": [0.10, 0.88, 0.20],
    "Can I get a refund for my order?":       [0.15, 0.30, 0.90],
    "My login isn't working anymore":         [0.85, 0.18, 0.08],
}

query_vec = [0.88, 0.14, 0.06]

def search(query_vec, docs):
    scored = [(doc, cosine(query_vec, vec)) for doc, vec in docs.items()]
    scored.sort(key=lambda x: -x[1])
    return scored

print('Query: "I forgot my password and can\\'t sign in"')
print("Top matches (semantic):")
for doc, score in search(query_vec, docs):
    print("" + str(round(score, 3)) + "" + doc)`,
      expected_output: `Query: "I forgot my password and can't sign in"
Top matches (semantic):
  0.999  How do I reset my password?
  0.998  My login isn't working anymore
  0.275  The checkout page is throwing an error
  0.266  Can I get a refund for my order?`,
      hints: [
        "Build scored as [(doc, cosine(query_vec, vec)) for doc, vec in docs.items()].",
        "Sort descending with key=lambda x: -x[1] so the closest doc is first.",
        "Notice the 'login' doc ranks 2nd despite sharing no words with the query: that's semantic matching."
      ],
      challenge_title: "Top-K Semantic Retrieval",
      challenge_description: "Return the K documents most semantically similar to a query embedding, best first — the retrieval core of a RAG system.",
      challenge_story: "You are wiring up the retrieval step of a RAG (retrieval-augmented generation) assistant. Before the language model answers, your code has to pull the **K most relevant document chunks** out of the knowledge base and hand them over as context. Keyword search would miss a chunk about 'sign in' when the user types 'login isn't working' — but embeddings match on meaning, not spelling. Each chunk is already an embedding; so is the query. Rank by cosine similarity and return the top K, highest first.",
      challenge_statement: "You are given **N** document embeddings, a positive integer **K**, and one **query** embedding, all of dimension **D**. Return the **K documents with the highest cosine similarity** to the query, ordered from highest to lowest.\n\nIf two documents have equal cosine similarity, order them by **lexicographically smallest name first**. It is guaranteed that `K ≤ N`.",
      challenge_input_format: "The first line holds three integers `N`, `D`, and `K`.\nEach of the next `N` lines holds a document name (no spaces) followed by `D` numbers: that document's embedding.\nThe final line holds `D` numbers: the query embedding.",
      challenge_output_format: "Output `K` lines, best match first. Each line holds a document name, a single space, then its cosine similarity to the query formatted to exactly **4 decimal places**.",
      challenge_constraints: [
        "1 ≤ K ≤ N ≤ 1000",
        "1 ≤ D ≤ 64",
        "Coordinates are real numbers with magnitude up to 1000",
        "No document vector and no query vector is all zeros",
        "Names are non-empty, contain no whitespace, and are unique"
      ],
      challenge_examples: [
        { input: "4 3 3\nlogin_help 0.9 0.1 0.0\nreset_password 0.85 0.15 0.0\nbilling_faq 0.0 0.1 0.9\nsearch_tips 0.1 0.8 0.1\n0.9 0.1 0.0", output: "login_help 1.0000\nreset_password 0.9980\nsearch_tips 0.2311", explanation: "The query matches login_help exactly (1.0000). reset_password is nearly identical in direction (0.9980). search_tips edges out billing_faq for the third slot." },
        { input: "3 2 2\nx 1 0\ny 0 1\nz 0.8 0.2\n1 0", output: "x 1.0000\nz 0.9701", explanation: "x is an exact direction match; z leans the same way; y is perpendicular and falls outside the top 2." }
      ],
      challenge_notes: "This is the retrieval half of RAG: the K rows you print become the context the language model reads. Sorting by `(-score, name)` gives both 'best first' and a deterministic tie-break in a single key. At real scale you would precompute normalized vectors (last lesson) so each comparison is a bare dot product.",
      challenge_hints: [
        "Score every document with cosine, collecting (name, score) pairs.",
        "Sort with `key=lambda t: (-t[1], t[0])` so higher scores come first and ties break by name.",
        "Slice the first K results after sorting.",
        "Print each kept pair as `f\"{name} {score:.4f}\"`."
      ],
      challenge_starter_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    n, d, k = map(int, lines[0].split())
    # TODO: read N documents and the query, rank by cosine similarity,
    # break ties by name, and print the top K as "name score" (4 decimals).

main()`,
      challenge_solution_code: `import sys, math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def main():
    lines = sys.stdin.read().split("\\n")
    pos = 0
    n, d, k = map(int, lines[pos].split()); pos += 1
    docs = []
    for _ in range(n):
        parts = lines[pos].split(); pos += 1
        name = parts[0]
        vec = [float(x) for x in parts[1:1 + d]]
        docs.append((name, vec))
    query = [float(x) for x in lines[pos].split()[:d]]
    scored = [(name, cosine(query, vec)) for name, vec in docs]
    scored.sort(key=lambda t: (-t[1], t[0]))
    out = [f"{name} {score:.4f}" for name, score in scored[:k]]
    print("\\n".join(out))

main()`,
      challenge_test_cases: [
        { input: "4 3 3\nlogin_help 0.9 0.1 0.0\nreset_password 0.85 0.15 0.0\nbilling_faq 0.0 0.1 0.9\nsearch_tips 0.1 0.8 0.1\n0.9 0.1 0.0", expected_output: "login_help 1.0000\nreset_password 0.9980\nsearch_tips 0.2311", description: "Example 1: top 3 of 4 support docs, best first." },
        { input: "3 2 2\nx 1 0\ny 0 1\nz 0.8 0.2\n1 0", expected_output: "x 1.0000\nz 0.9701", description: "Example 2: perpendicular doc excluded from top 2." },
        { input: "4 2 2\nbeta 2 0\nalpha 4 0\ngamma 0 1\ndelta 0 3\n1 0", expected_output: "alpha 1.0000\nbeta 1.0000", description: "Edge: alpha and beta tie at 1.0; lexicographic tie-break puts alpha first." }
      ]
    }
  ]
};
