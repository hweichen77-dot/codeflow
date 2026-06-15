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
      explanation: `Your phone's autocomplete knows "cat" and "kitten" are related but "cat" and "car" aren't, even though "cat" and "car" share more letters. How? It doesn't read letters. It reads numbers.

## A vector is just a list of numbers

Picture every word as a dot on a map. "cat" lives at coordinates \`[4, 1]\`. "kitten" lives nearby at \`[3, 1]\`. "car" is way off at \`[1, 5]\`. That list of coordinates is called a **vector**. The map can have 2 dimensions like here, or 1,536 dimensions like a real embedding model. Same idea, more axes.

The whole game of embeddings: place similar things close together and different things far apart.

## Two ways things can be "close"

You need two tools to compare vectors:

- **Dot product** — multiply matching components, add them up. \`[4,1] · [3,1] = 4*3 + 1*1 = 13\`. Bigger means pointing in a similar direction (roughly).
- **Magnitude** — how long the arrow is. \`|[4,1]| = sqrt(4² + 1²) = sqrt(17) ≈ 4.123\`. This is just the Pythagorean theorem.

Don't memorize the formulas. You'll write them once as helper functions and reuse them forever.

## Why not just use distance?

You could measure straight-line distance between two dots. Sometimes that's fine. But for text, **direction matters more than length**. A long document about cats and a one-line tweet about cats should count as similar even though one vector is "longer." That's why the next lesson uses the angle between vectors, not the gap between their tips.

For now, get comfortable building a vector and crunching it:

\`\`\`python
import math

cat = [4, 1]
kitten = [3, 1]
print(sum(x * y for x, y in zip(cat, kitten)))  # dot product
\`\`\`

That \`zip\` pattern shows up constantly. Lock it in.`,
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
      explanation: `Here's the problem with dot product alone: a vector that's just *longer* scores higher even if it points the same way. A 2,000-word essay about cars and a quick "I love cars" tweet should rank as equally car-ish. Dot product punishes the tweet for being short.

The fix is to ignore length and measure only **direction**. That's cosine similarity.

## The formula, then never again

\`\`\`
cosine(a, b) = dot(a, b) / (magnitude(a) * magnitude(b))
\`\`\`

You already wrote \`dot\` and \`magnitude\` last lesson. Cosine just divides the dot product by both magnitudes, which cancels out length and leaves you with the cosine of the angle between the two arrows.

## Reading the score

- **1.0** — same direction. Basically synonyms.
- **0.0** — perpendicular. Unrelated.
- **-1.0** — opposite. Rare with real text embeddings, which usually land between 0 and 1.

So when you compute \`cosine(die_hard, mad_max) = 0.99\` and \`cosine(die_hard, notebook) = 0.26\`, the model is telling you Die Hard and Mad Max are nearly the same flavor of movie, and The Notebook is a different world.

## Why this is the default

Cosine similarity is the workhorse of search, recommendations, RAG retrieval, and duplicate detection. Almost every "find me things like this" feature you've ever used runs cosine (or its close cousin) under the hood. Learn it once, recognize it everywhere.

\`\`\`python
def cosine(a, b):
    return dot(a, b) / (magnitude(a) * magnitude(b))
\`\`\`

One gotcha: if a vector is all zeros, magnitude is zero and you divide by zero. Real embedding models never return a zero vector, but if you build vectors by hand, guard against it.`,
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
      explanation: `Say you've got 10,000 movies and a user picks one. You want the closest matches. Computing cosine the naive way recalculates two magnitudes for *every* comparison. That's wasteful. There's a trick that production search engines use, and it's worth understanding.

## Normalizing means rescaling to length 1

To **normalize** a vector, divide every component by its magnitude. The result points the exact same direction but has length 1. It's called a **unit vector**.

\`\`\`python
def normalize(v):
    m = magnitude(v)
    return [x / m for x in v]
\`\`\`

Take \`[3, 4]\`. Magnitude is 5. Normalized: \`[0.6, 0.8]\`. Check its length: \`sqrt(0.6² + 0.8²) = sqrt(0.36 + 0.64) = 1\`.

## The payoff

Cosine is \`dot(a, b) / (mag(a) * mag(b))\`. If both vectors are already normalized, their magnitudes are both 1, so the formula collapses to just:

\`\`\`
cosine(a, b) = dot(a, b)
\`\`\`

That's huge. Normalize your whole database once, up front. Then every query is a plain dot product, no square roots in the hot loop. For a million-vector index, that's the difference between snappy and sluggish.

This is why real vector databases store normalized embeddings. Some embedding APIs even return pre-normalized vectors so you can skip the step entirely.

## Watch out

- Normalizing a **zero vector** divides by zero. Same trap as cosine. Guard it.
- After normalizing, the raw numbers look small (all between -1 and 1). That's expected, not a bug.
- The angle between two vectors doesn't change when you normalize. You're only rescaling length, never rotating.

Prove it to yourself: compute cosine the long way, then normalize both and take the dot product. Same answer. That equivalence is the whole reason normalization is worth doing.`,
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
      explanation: `Time to ship the thing. "Because you watched Die Hard..." That row on every streaming service is cosine similarity over movie vectors. You now have every piece to build it.

## The recipe

1. Give each movie a vector. Real systems learn these from viewing data; here we'll hand-craft genre scores so you can read them.
2. To recommend for a movie, compute cosine similarity to every other movie.
3. Sort descending. Take the top N. Done.

Our vectors have five dimensions: \`[action, romance, comedy, scifi, drama]\`, each from 0 to 1. Die Hard is heavy action, light everything else. Interstellar is sci-fi and drama. The math will surface the right neighbors.

\`\`\`python
def recommend(title, n=3):
    target = movies[title]
    scored = [(name, cosine(target, vec))
              for name, vec in movies.items()
              if name != title]
    scored.sort(key=lambda x: -x[1])
    return scored[:n]
\`\`\`

That \`if name != title\` matters. A movie is always perfectly similar to itself (cosine 1.0), and recommending Die Hard to a Die Hard fan is useless. Exclude the seed.

## Why this beats genre tags

You could just filter by a single genre label. But movies are blends. Blade Runner is sci-fi *and* action *and* noir-drama. A vector captures that mix in one shot, so it finds Interstellar (another sci-fi/drama lean) even though their top genre differs. Tags can't do that without a tangle of if-statements.

## Recommending for a whole user

A user likes several movies, not one. The standard move: **average their liked vectors** into a single "taste vector," then find the nearest movies to that average. One vector, one search, captures the blend of everything they enjoy. That's the challenge below.

The pattern you just built, embed, compare with cosine, sort, return top N, is the skeleton of search, RAG retrieval, and dedup too. Same four steps, different data.`,
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
    print("  " + name + " (" + str(round(score, 3)) + ")")

print("Because you liked Interstellar:")
for name, score in recommend("Interstellar"):
    print("  " + name + " (" + str(round(score, 3)) + ")")`,
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
      explanation: `Our movie vectors were hand-written. That doesn't scale to 10,000 movies or to free-form text like support tickets. For real text you call an **embedding model**, send it a string, get back a vector of floats. Then your same cosine-and-sort code works on anything.

## Where keyword search breaks

Old-school search matches words. Type "I forgot my password and can't sign in" and a keyword engine finds the doc containing "password." But it completely misses "My login isn't working anymore" because that doc shares *zero* words with your query. Same meaning, different vocabulary. Keyword search is blind to it.

Embeddings fix this. A good model places "sign in," "login," and "log in" near each other in vector space because it learned they mean the same thing. So semantic search retrieves the login doc even with no shared words. That's the entire reason embeddings power modern search and RAG.

## Calling an embedding API

Conceptually, embedding any text is one HTTP call:

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

Never hardcode the key. Read it from \`os.environ\`. The vector that comes back is just a longer version of what you've been using all module.

## The semantic search loop

1. Embed every document once. Store the vectors.
2. Embed the user's query.
3. Cosine-similarity the query against all stored vectors.
4. Sort, return the top results.

The runnable code below uses pre-stored vectors so it produces deterministic output with no network call, but the logic is identical to production. Watch what happens: the query has no words in common with "My login isn't working anymore," yet that doc still ranks second. That's the magic keyword search can never pull off.`,
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
    print("  " + str(round(score, 3)) + "  " + doc)`,
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
