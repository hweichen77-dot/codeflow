export default {
  project: {
    id: "ai-06",
    title: "Embeddings & Semantic Search",
    description: "Turn words into numbers, measure how close they are, and build a movie recommender that actually gets your taste.",
    difficulty: "intermediate",
    category: "ai_ml",
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
      challenge_title: "Straight-line distance",
      challenge_description: "Write euclidean(a, b) returning the straight-line distance between two equal-length vectors: sqrt of the sum of squared differences.",
      challenge_starter_code: `import math

def euclidean(a, b):
    # sqrt of sum of (a_i - b_i) squared
    pass

print(round(euclidean([1, 2], [4, 6]), 1))`,
      challenge_solution_code: `import math

def euclidean(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

print(round(euclidean([1, 2], [4, 6]), 1))`,
      challenge_test_cases: [
        { input: "euclidean([1, 2], [4, 6])", expected_output: "5.0", description: "3-4-5 triangle: differences are 3 and 4, distance is 5." },
        { input: "euclidean([0, 0, 0], [0, 0, 0])", expected_output: "0.0", description: "Identical vectors have zero distance." }
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
      challenge_title: "Find the best match",
      challenge_description: "Write most_similar(target, items) that returns the name of the item whose vector has the highest cosine similarity to target. items is a dict of name to vector.",
      challenge_starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def most_similar(target, items):
    # return the name with the highest cosine to target
    pass

items = {"a": [1, 0], "b": [0, 1], "c": [0.9, 0.1]}
print(most_similar([1, 0], items))`,
      challenge_solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def most_similar(target, items):
    best = None
    best_score = -2
    for name, vec in items.items():
        score = cosine(target, vec)
        if score > best_score:
            best_score = score
            best = name
    return best

items = {"a": [1, 0], "b": [0, 1], "c": [0.9, 0.1]}
print(most_similar([1, 0], items))`,
      challenge_test_cases: [
        { input: "most_similar([1, 0], {'a': [1, 0], 'b': [0, 1], 'c': [0.9, 0.1]})", expected_output: "a", description: "Exact match 'a' points the same direction as the target." },
        { input: "most_similar([0, 1], {'a': [1, 0], 'b': [0, 1]})", expected_output: "b", description: "'b' aligns with the target while 'a' is perpendicular." }
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
      challenge_title: "Build normalize",
      challenge_description: "Implement normalize(v) so it returns a unit vector pointing the same direction as v. Assume v is never all zeros.",
      challenge_starter_code: `import math

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def normalize(v):
    # return the unit vector
    pass

print(normalize([3, 4]))`,
      challenge_solution_code: `import math

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def normalize(v):
    m = magnitude(v)
    return [x / m for x in v]

print(normalize([3, 4]))`,
      challenge_test_cases: [
        { input: "normalize([3, 4])", expected_output: "[0.6, 0.8]", description: "Magnitude 5, so each component is divided by 5." },
        { input: "normalize([0, 5])", expected_output: "[0.0, 1.0]", description: "Already axis-aligned: divides by magnitude 5 to length 1." }
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
      challenge_title: "Recommend for a user",
      challenge_description: "Write average_vectors(vecs) that returns the element-wise average of a list of equal-length vectors. This is the taste vector for a user who liked several movies.",
      challenge_starter_code: `def average_vectors(vecs):
    # element-wise average of all vectors in the list
    pass

print(average_vectors([[1.0, 0.0], [0.0, 1.0]]))`,
      challenge_solution_code: `def average_vectors(vecs):
    n = len(vecs)
    dim = len(vecs[0])
    return [sum(v[i] for v in vecs) / n for i in range(dim)]

print(average_vectors([[1.0, 0.0], [0.0, 1.0]]))`,
      challenge_test_cases: [
        { input: "average_vectors([[1.0, 0.0], [0.0, 1.0]])", expected_output: "[0.5, 0.5]", description: "Average of two opposite unit vectors lands in the middle." },
        { input: "average_vectors([[2.0, 4.0], [4.0, 8.0]])", expected_output: "[3.0, 6.0]", description: "Component-wise mean of the two vectors." }
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
      challenge_title: "Top-K results",
      challenge_description: "Write top_k(query_vec, docs, k) that returns a list of just the k document names with the highest cosine similarity to the query, best first.",
      challenge_starter_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def top_k(query_vec, docs, k):
    # return the k closest document names, best first
    pass

docs = {"x": [1, 0], "y": [0, 1], "z": [0.8, 0.2]}
print(top_k([1, 0], docs, 2))`,
      challenge_solution_code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x * x for x in v))

def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))

def top_k(query_vec, docs, k):
    scored = [(doc, cosine(query_vec, vec)) for doc, vec in docs.items()]
    scored.sort(key=lambda x: -x[1])
    return [doc for doc, _ in scored[:k]]

docs = {"x": [1, 0], "y": [0, 1], "z": [0.8, 0.2]}
print(top_k([1, 0], docs, 2))`,
      challenge_test_cases: [
        { input: "top_k([1, 0], {'x': [1, 0], 'y': [0, 1], 'z': [0.8, 0.2]}, 2)", expected_output: "['x', 'z']", description: "'x' matches exactly, 'z' leans the same way, 'y' is perpendicular." },
        { input: "top_k([0, 1], {'x': [1, 0], 'y': [0, 1]}, 1)", expected_output: "['y']", description: "Only the single closest document is returned." }
      ]
    }
  ]
};
