
export default [
  {
    id: "cp-search-1",
    title: "Nearest Neighbor Classifier",
    slug: "nearest-neighbor",
    topic: "search",
    difficulty: "easy",
    algorithm_focus: "1-NN classification / nearest-point search",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["k-nn", "geometry", "linear-scan", "classification"],
    story:
      "Your image app needs to label a new photo's dominant color. You already have a gallery of labeled reference colors plotted in a 2D feature space. The simplest classifier that works: find the single closest labeled point and copy its label. That's **1-nearest-neighbor** — the seed of every k-NN system.",
    statement:
      "You are given `N` labeled points in the plane and one **query point**. Find the labeled point with the smallest Euclidean distance to the query and print its label. It is guaranteed that the nearest point is unique.\n\nEuclidean distance between `(x1,y1)` and `(x2,y2)` is `sqrt((x1-x2)^2 + (y1-y2)^2)`. Because you only need to compare distances, you can compare **squared** distances and avoid floating point entirely.",
    input_format:
      "The first line contains an integer `N`.\nEach of the next `N` lines contains two integers `x y` and a label (a lowercase string with no spaces).\nThe final line contains two integers `qx qy` — the query point.",
    output_format: "Print the label of the nearest point.",
    constraints: [
      "1 ≤ N ≤ 100000",
      "-10000 ≤ x, y, qx, qy ≤ 10000",
      "labels are non-empty lowercase strings of length ≤ 20",
      "the nearest point is unique",
    ],
    examples: [
      {
        input: "3\n0 0 cat\n10 10 dog\n2 1 cat\n3 3",
        output: "cat",
        explanation:
          "Squared distances from (3,3): to (0,0)=18, to (10,10)=98, to (2,1)=5. The closest is (2,1) with label cat.",
      },
      {
        input: "2\n-5 -5 a\n5 5 b\n4 4",
        output: "b",
        explanation: "(5,5) is far closer to (4,4) than (-5,-5).",
      },
    ],
    notes:
      "Use **squared** distance (an integer) for comparisons — taking the square root is unnecessary and introduces precision bugs. A single linear scan is O(N), which is plenty here.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: read n points (x, y, label), then the query (qx, qy).\n    // Track the label of the point with the smallest squared distance.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<long long> X(n), Y(n);\n    vector<string> L(n);\n    for (int i = 0; i < n; i++) cin >> X[i] >> Y[i] >> L[i];\n    long long qx, qy;\n    cin >> qx >> qy;\n\n    long long best = LLONG_MAX;\n    string bestLabel;\n    for (int i = 0; i < n; i++) {\n        long long dx = X[i] - qx, dy = Y[i] - qy;\n        long long d = dx * dx + dy * dy;   // squared distance, exact\n        if (d < best) { best = d; bestLabel = L[i]; }\n    }\n    cout << bestLabel << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3\n0 0 cat\n10 10 dog\n2 1 cat\n3 3", expected_output: "cat" },
      { input: "2\n-5 -5 a\n5 5 b\n4 4", expected_output: "b" },
      { input: "4\n0 0 x\n1 0 y\n0 1 z\n2 2 w\n1 1", expected_output: "y" },
    ],
    editorial:
      "1-NN is the limiting case of k-nearest-neighbors with k=1. The key engineering insight — comparing squared distances instead of true Euclidean distances — keeps the math in integers and removes floating-point error. Real vector databases replace this O(N) linear scan with approximate-nearest-neighbor indexes (HNSW, IVF) once N gets large, but the decision rule is identical: the label of the closest stored vector.",
  },
  {
    "id": "cp-search-2",
    "title": "k-NN Majority Vote",
    "slug": "knn-majority-vote",
    "topic": "search",
    "difficulty": "medium",
    "algorithm_focus": "k-nearest-neighbors classification / majority vote",
    "time_limit_ms": 1000,
    "memory_limit_mb": 256,
    "tags": [
      "k-nn",
      "classification",
      "sorting",
      "majority-vote"
    ],
    "story": "A single nearest neighbor is fragile: one mislabeled outlier next to your query and the prediction flips. The fix that powers real k-NN classifiers is a **vote**. Look at the `k` closest labeled points, count their labels, and predict whichever label appears most. More neighbors smooths out noise — the heart of the k-nearest-neighbors algorithm.",
    "statement": "You are given `N` labeled points in the plane, an integer `k`, and one **query point**. Among the `k` points with the smallest Euclidean distance to the query, output the label that appears **most often**.\n\nDistances are compared using **squared** Euclidean distance (an integer), so no floating point is needed. If two points are equally distant, the one given earlier in the input is considered nearer (stable tie-break) when selecting the k nearest. If two labels are tied for the most votes, output the **lexicographically smallest** label.",
    "input_format": "Line 1: two integers `N k`.\nEach of the next `N` lines: two integers `x y` and a label (a lowercase string with no spaces).\nFinal line: two integers `qx qy` — the query point.",
    "output_format": "Print the predicted label (the majority label among the k nearest neighbors).",
    "constraints": [
      "1 ≤ k ≤ N ≤ 100000",
      "-10000 ≤ x, y, qx, qy ≤ 10000",
      "labels are non-empty lowercase strings of length ≤ 20"
    ],
    "examples": [
      {
        "input": "5 3\n0 0 cat\n1 0 cat\n0 1 dog\n5 5 dog\n6 5 dog\n0 0",
        "output": "cat",
        "explanation": "Squared distances from (0,0): (0,0)=0 cat, (1,0)=1 cat, (0,1)=1 dog, (5,5)=50 dog, (6,5)=61 dog. The 3 nearest are the first three: two cats and one dog, so cat wins 2–1."
      },
      {
        "input": "4 4\n0 0 zeta\n1 0 alpha\n0 1 zeta\n1 1 alpha\n0 0",
        "output": "alpha",
        "explanation": "All 4 points are the k nearest: two zeta and two alpha. The vote ties 2–2, so the lexicographically smallest label, alpha, is printed."
      }
    ],
    "notes": "Compute each squared distance (an exact integer), sort indices by distance with input order as the tie-break, take the first `k`, and tally labels in a `map<string,int>`. Iterating a `std::map` in key order makes the lexicographic label tie-break automatic: keep the first label whose count strictly exceeds the best so far.",
    "starter_cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // TODO: read n points (x, y, label), then the query (qx, qy).\n    // Find the k points with smallest squared distance to the query,\n    // then output the label most common among them.\n    // Tie-break: the lexicographically smallest label.\n\n    return 0;\n}\n",
    "solution_cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    vector<long long> X(n), Y(n);\n    vector<string> L(n);\n    for (int i = 0; i < n; i++) cin >> X[i] >> Y[i] >> L[i];\n    long long qx, qy;\n    cin >> qx >> qy;\n\n    // index by squared distance, tie-break by input order (stable),\n    // we only need k nearest neighbors.\n    vector<int> idx(n);\n    iota(idx.begin(), idx.end(), 0);\n    vector<long long> d(n);\n    for (int i = 0; i < n; i++) {\n        long long dx = X[i] - qx, dy = Y[i] - qy;\n        d[i] = dx * dx + dy * dy;\n    }\n    sort(idx.begin(), idx.end(), [&](int a, int b) {\n        if (d[a] != d[b]) return d[a] < d[b];\n        return a < b;\n    });\n\n    map<string, int> cnt;\n    for (int i = 0; i < k && i < n; i++) cnt[L[idx[i]]]++;\n\n    string best;\n    int bestCount = -1;\n    for (auto &p : cnt) {\n        if (p.second > bestCount) { bestCount = p.second; best = p.first; }\n    }\n    cout << best << \"\\n\";\n    return 0;\n}\n",
    "test_cases": [
      {
        "input": "5 3\n0 0 cat\n1 0 cat\n0 1 dog\n5 5 dog\n6 5 dog\n0 0",
        "expected_output": "cat"
      },
      {
        "input": "4 2\n0 0 apple\n0 0 banana\n10 10 cherry\n10 10 cherry\n1 1",
        "expected_output": "apple"
      },
      {
        "input": "1 1\n7 7 solo\n0 0",
        "expected_output": "solo"
      },
      {
        "input": "4 4\n0 0 zeta\n1 0 alpha\n0 1 zeta\n1 1 alpha\n0 0",
        "expected_output": "alpha"
      }
    ],
    "editorial": "k-NN classification generalizes 1-NN by replacing 'copy the single closest label' with 'take a majority vote over the k closest labels'. Larger k reduces variance (it ignores lone outliers) at the cost of more bias (very large k washes out local structure). The two tie-break rules matter for determinism: a stable distance tie-break makes the chosen neighbor set well-defined, and the lexicographic label tie-break makes the predicted class well-defined. The O(N log N) sort here is replaced in production by a partial selection (nth_element / a size-k heap) or an approximate index, but the voting rule is exactly this."
  },
  {
    "id": "cp-search-3",
    "title": "Beam Search Decoder",
    "slug": "beam-search-decoder",
    "topic": "search",
    "difficulty": "hard",
    "algorithm_focus": "beam search / bounded best-first sequence decoding",
    "time_limit_ms": 1500,
    "memory_limit_mb": 256,
    "tags": [
      "beam-search",
      "decoding",
      "sequence",
      "heuristic-search"
    ],
    "story": "A language model builds a sentence one token at a time, and the score of a token depends on the token before it. Exploring every length-`T` sequence costs `M^T` — impossible. **Beam search** is the workhorse approximation: at each step keep only the `B` highest-scoring partial sequences, expand each by all `M` tokens, and prune back to `B`. A bigger beam explores more and can escape traps a greedy decoder (B=1) falls into.\n\nThis problem uses exact **integer** scores so the answer is unambiguous.",
    "statement": "You decode a sequence of exactly `T` tokens, each in `0..M-1`. Scoring is bigram-style:\n\n- `start[m]` is the score of choosing token `m` as the **first** token.\n- For each later step `t` (`1 ≤ t < T`), `trans[t][p][m]` is the score added by appending token `m` when the **previous** token is `p`.\n\nThe total score of a sequence `s0, s1, …, s(T-1)` is `start[s0] + sum over t=1..T-1 of trans[t][s(t-1)][st]`.\n\nRun **beam search with beam width `B`**: start with one partial sequence per first token; at every step expand each kept sequence by all `M` tokens, then keep only the `B` highest-scoring partial sequences. When more than `B` sequences tie or compete, rank by score (higher first), breaking ties by the **lexicographically smallest token sequence**. Output the total score and the tokens of the best full-length sequence the beam ends with (same ranking rule).\n\nNote: because the beam may prune the globally optimal path, the answer is the best sequence *beam search of width B actually finds*, not necessarily the true maximum.",
    "input_format": "Line 1: three integers `T M B`.\nLine 2: `M` integers — `start[0..M-1]`.\nThen for each `t` from 1 to `T-1`, `M` lines each with `M` integers: line `p` is `trans[t][p][0..M-1]`. (These `(T-1)·M` lines appear in order of increasing `t`.)",
    "output_format": "Line 1: the total score of the best full sequence found by beam search.\nLine 2: the `T` tokens of that sequence, space-separated.",
    "constraints": [
      "1 ≤ T ≤ 200",
      "1 ≤ M ≤ 30",
      "1 ≤ B ≤ 1000",
      "all scores are integers with absolute value ≤ 10^6"
    ],
    "examples": [
      {
        "input": "2 2 2\n3 1\n2 5\n9 0",
        "output": "10\n1 0",
        "explanation": "First-token scores: tok0=3, tok1=1. Step 1 transitions: from tok0 → {2,5}, from tok1 → {9,0}. Full paths: 0→0=5, 0→1=8, 1→0=10, 1→1=1. With B=2 both surviving first tokens are explored, so the winner 1→0 (score 10) is found."
      },
      {
        "input": "3 2 1\n10 8\n0 0\n0 0\n0 0\n100 0",
        "output": "10\n0 0 0",
        "explanation": "With beam width 1 (greedy) the first token is tok0 (10 > 8) and that choice is locked in, dead-ending at score 10. The path 0→1→0 worth 110 needs the previous token to be 1 at the final step, but B=1 already pruned the sequence that ends in 1. A larger beam recovers it."
      }
    ],
    "notes": "Represent each beam entry as `{cumulative_score, token_sequence}`. Each step, generate all `beam_size · M` extensions, sort by (score descending, sequence ascending), and truncate to `B`. The lexicographic sequence tie-break makes the output deterministic. Compare example 2 against a width-2 run to see beam search escape the greedy trap.",
    "starter_cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int T, M, B;\n    cin >> T >> M >> B;\n    // TODO: read start[M] and the transition matrices trans[t][p][m].\n    // Maintain a beam of at most B partial sequences ranked by cumulative\n    // score (tie-break: lexicographically smallest sequence). Expand every\n    // beam entry by all M tokens each step, then keep the top B.\n    // Output the best full-length-T total score and one optimal sequence.\n\n    return 0;\n}\n",
    "solution_cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int T, M, B;\n    cin >> T >> M >> B;\n\n    // start[m] = score of choosing token m as the FIRST token (step 0).\n    vector<long long> start(M);\n    for (int m = 0; m < M; m++) cin >> start[m];\n\n    // trans[t][p][m] = score of appending token m at step t (1..T-1)\n    // when the previous token was p. Bigram-style scoring, so the score of a\n    // sequence depends on the WHOLE path, not just the step — this is what\n    // makes beam width B matter.\n    // Stored for t in 1..T-1, i.e. T-1 matrices of size M x M.\n    vector<vector<vector<long long>>> trans(\n        T, vector<vector<long long>>(M, vector<long long>(M)));\n    for (int t = 1; t < T; t++)\n        for (int p = 0; p < M; p++)\n            for (int m = 0; m < M; m++) cin >> trans[t][p][m];\n\n    struct Entry {\n        long long sc;\n        vector<int> seq;\n    };\n\n    // tie-break: higher score first, then lexicographically smaller sequence.\n    auto cmp = [](const Entry &a, const Entry &b) {\n        if (a.sc != b.sc) return a.sc > b.sc;\n        return a.seq < b.seq;\n    };\n\n    // initial beam: one entry per first-token choice.\n    vector<Entry> beam;\n    for (int m = 0; m < M; m++) beam.push_back({start[m], {m}});\n    sort(beam.begin(), beam.end(), cmp);\n    if ((int)beam.size() > B) beam.resize(B);\n\n    for (int t = 1; t < T; t++) {\n        vector<Entry> cand;\n        cand.reserve(beam.size() * M);\n        for (auto &e : beam) {\n            int p = e.seq.back();\n            for (int m = 0; m < M; m++) {\n                Entry ne;\n                ne.sc = e.sc + trans[t][p][m];\n                ne.seq = e.seq;\n                ne.seq.push_back(m);\n                cand.push_back(move(ne));\n            }\n        }\n        sort(cand.begin(), cand.end(), cmp);\n        if ((int)cand.size() > B) cand.resize(B);\n        beam = move(cand);\n    }\n\n    Entry best = beam.front();\n    for (auto &e : beam) if (cmp(e, best)) best = e;\n\n    cout << best.sc << \"\\n\";\n    for (int i = 0; i < T; i++) cout << best.seq[i] << (i + 1 < T ? ' ' : '\\n');\n    return 0;\n}\n",
    "test_cases": [
      {
        "input": "2 2 2\n3 1\n2 5\n9 0",
        "expected_output": "10\n1 0"
      },
      {
        "input": "3 2 1\n10 8\n0 0\n0 0\n0 0\n100 0",
        "expected_output": "10\n0 0 0"
      },
      {
        "input": "3 2 2\n10 8\n0 0\n0 0\n0 0\n100 0",
        "expected_output": "110\n0 1 0"
      },
      {
        "input": "2 2 2\n5 5\n0 0\n0 0",
        "expected_output": "5\n0 0"
      },
      {
        "input": "3 3 27\n0 0 0\n1 2 3\n4 5 6\n7 8 9\n9 8 7\n6 5 4\n3 2 1",
        "expected_output": "16\n2 0 0"
      }
    ],
    "editorial": "Beam search is bounded best-first search over a sequence trellis. Width B=1 is pure greedy decoding; B = M^T is exhaustive (exact) search. Real values of B trade compute for quality: keeping more hypotheses lets the decoder recover a strong path whose prefix looked mediocre — exactly the trap in example 2, where the locally best first token leads to a dead end. The cost is O(T · B · M · L) where L is sequence length for the comparisons, far below M^T. This is the standard decoder for machine translation and text generation; swapping the integer transition scores for log-probabilities and adding a length penalty gives the production algorithm. Note beam search is a heuristic — it can miss the true optimum, which is why the problem defines the answer as what the width-B beam actually finds."
  },
];
