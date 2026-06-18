// Competitive Coding — Linear Algebra topic.
// Problems that teach the linear-algebra primitives behind neural networks and
// vector search through exact integer C++ implementation.

export default [
  {
    id: "cp-linalg-1",
    title: "Dot Product Neuron",
    slug: "dot-product-neuron",
    topic: "linalg",
    difficulty: "easy",
    algorithm_focus: "Vector dot product / single-neuron pre-activation",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["linear-algebra", "dot-product", "vectors", "neural-network"],
    story:
      "Strip a neural network down to one neuron and one thing is left: a **dot product**. The neuron holds a weight vector `w`, it receives an input vector `x`, and the number it forwards before any activation is `w · x = sum of w[i]*x[i]`. The very same operation scores a query against a key inside an attention head. Master it in integers and you've mastered the inner loop of modern AI.",
    statement:
      "You are given two integer vectors `a` and `b`, each of length `n`. Compute their **dot product**:\n\n```\na · b = a[0]*b[0] + a[1]*b[1] + ... + a[n-1]*b[n-1]\n```\n\nPrint the single integer result.",
    input_format:
      "Line 1: an integer `n` — the length of each vector.\nLine 2: `n` integers — `a[0..n-1]`.\nLine 3: `n` integers — `b[0..n-1]`.",
    output_format: "Print one integer: the dot product `a · b`.",
    constraints: [
      "1 ≤ n ≤ 100000",
      "-10^6 ≤ a[i], b[i] ≤ 10^6",
      "the result fits in a 64-bit signed integer",
    ],
    examples: [
      {
        input: "3\n1 2 3\n4 5 6",
        output: "32",
        explanation: "1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32.",
      },
      {
        input: "4\n2 -1 0 5\n3 4 9 -2",
        output: "-8",
        explanation: "2*3 + (-1)*4 + 0*9 + 5*(-2) = 6 - 4 + 0 - 10 = -8.",
      },
    ],
    notes:
      "Each product can reach 10^12 and there are up to 10^5 of them, so the accumulator can reach ~10^17 — well within `long long` (64-bit) but far beyond 32-bit `int`. Accumulate in `long long` to avoid overflow.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: read a[0..n-1] and b[0..n-1].\n    // Accumulate sum of a[i]*b[i] in a 64-bit integer and print it.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<long long> a(n), b(n);\n    for (auto &x : a) cin >> x;\n    for (auto &x : b) cin >> x;\n    long long dot = 0;\n    for (int i = 0; i < n; i++) dot += a[i] * b[i];\n    cout << dot << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3\n1 2 3\n4 5 6", expected_output: "32" },
      { input: "4\n2 -1 0 5\n3 4 9 -2", expected_output: "-8" },
    ],
    editorial:
      "The dot product is the atom of linear algebra in machine learning. A dense layer is a stack of dot products (weights · input), an attention score is a dot product (query · key), and cosine similarity is a normalized dot product. The only real engineering trap here is overflow: 32-bit accumulation silently wraps once the running sum passes ~2.1 billion, so you keep the accumulator in 64-bit `long long`. In production this same loop is handled by SIMD/BLAS `sdot`/`ddot` kernels, but the arithmetic is exactly what you wrote.",
  },
  {
    id: "cp-linalg-2",
    title: "Dense Layer Forward Pass",
    slug: "dense-layer-forward-pass",
    topic: "linalg",
    difficulty: "medium",
    algorithm_focus: "Matrix-vector multiply / linear (dense) layer",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["linear-algebra", "matrix-vector", "dense-layer", "neural-network"],
    story:
      "A fully-connected (dense) layer with `M` output units and `N` inputs is nothing more than a **matrix-vector multiply**. The weight matrix `W` has shape `M×N`; feed it an input vector `x` of length `N` and you get the layer's pre-activation output `y = W·x`, a vector of length `M`. Every transformer and MLP is built from millions of these.",
    statement:
      "You are given an integer weight matrix `W` with `M` rows and `N` columns, and an integer input vector `x` of length `N`. Compute the output vector `y` of length `M`, where\n\n```\ny[i] = sum over j of W[i][j] * x[j]   for i = 0..M-1\n```\n\nPrint the `M` entries of `y`.",
    input_format:
      "Line 1: two integers `M N`.\nNext `M` lines: row `i` contains `N` integers — `W[i][0..N-1]`.\nNext line: `N` integers — `x[0..N-1]`.",
    output_format:
      "Print the `M` entries of `y` on a single line, separated by single spaces, followed by a newline. (`y[0]` first, `y[M-1]` last.)",
    constraints: [
      "1 ≤ M, N ≤ 1000",
      "-10^6 ≤ W[i][j], x[j] ≤ 10^6",
      "each y[i] fits in a 64-bit signed integer",
    ],
    examples: [
      {
        input: "2 3\n1 0 2\n0 3 1\n4 5 6",
        output: "16 21",
        explanation:
          "y[0] = 1*4 + 0*5 + 2*6 = 16. y[1] = 0*4 + 3*5 + 1*6 = 21. Output: \"16 21\".",
      },
    ],
    notes:
      "This is just `M` independent dot products — reuse the dot-product idea once per row. Keep each row's accumulator in `long long`: a product can reach 10^12 and a row sums up to 1000 of them (~10^15). Print outputs space-separated with no trailing space (a newline after the last value is fine).",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int M, N;\n    cin >> M >> N;\n    // TODO: read the M*N weight matrix W and the length-N vector x.\n    // For each row i, output the dot product of W[i] with x.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int M, N;\n    cin >> M >> N;\n    vector<vector<long long>> W(M, vector<long long>(N));\n    for (int i = 0; i < M; i++)\n        for (int j = 0; j < N; j++) cin >> W[i][j];\n    vector<long long> x(N);\n    for (int j = 0; j < N; j++) cin >> x[j];\n    for (int i = 0; i < M; i++) {\n        long long s = 0;\n        for (int j = 0; j < N; j++) s += W[i][j] * x[j];\n        cout << s << (i + 1 < M ? ' ' : '\\n');\n    }\n    return 0;\n}\n",
    test_cases: [
      { input: "2 3\n1 0 2\n0 3 1\n4 5 6", expected_output: "16 21" },
      { input: "3 3\n1 0 0\n0 1 0\n0 0 1\n7 8 9", expected_output: "7 8 9" },
      { input: "1 4\n2 2 2 2\n1 -1 1 -1", expected_output: "0" },
    ],
    editorial:
      "Matrix-vector multiplication `y = W·x` is the forward pass of a linear layer: row `i` of `W` is the weight vector of output neuron `i`, and `y[i]` is that neuron's pre-activation. The identity matrix example shows why it's called 'linear': multiplying by `I` returns the input unchanged. Complexity is O(M·N) — one multiply-add per weight — which is why GPUs and BLAS `gemv` kernels exist to parallelize it. Stacking these multiplies with nonlinear activations between them is, quite literally, a neural network. As before, the only correctness hazard is integer overflow, handled by 64-bit accumulation.",
  },
  {
    id: "cp-linalg-3",
    title: "Cosine Nearest Neighbor (Exact)",
    slug: "cosine-nearest-neighbor-exact",
    topic: "linalg",
    difficulty: "hard",
    algorithm_focus: "Cosine similarity search via exact integer cross-multiplication",
    time_limit_ms: 1500,
    memory_limit_mb: 256,
    tags: ["linear-algebra", "cosine-similarity", "vector-search", "int128", "embeddings"],
    story:
      "A vector database answers 'which stored embedding is most like this query?' The standard metric is **cosine similarity** — the angle between vectors, which ignores their length. The textbook formula `cos = (a·q) / (||a|| · ||q||)` drags in square roots and floating point, and floats lie just often enough to flip a tie. This problem demands the **exact** answer over integer vectors: rank candidates by cosine similarity using only integer (and 128-bit) arithmetic, never touching a `double`.",
    statement:
      "You are given `N` candidate integer vectors, each of dimension `D`, and one query vector `q` of dimension `D`. The cosine similarity between a candidate `a` and the query is\n\n```\ncos(a, q) = (a · q) / ( ||a|| * ||q|| )\n```\n\nwhere `a · q` is the dot product and `||v|| = sqrt(v · v)`. Output the **index** (0-based) of the candidate with the **highest** cosine similarity to `q`.\n\nDo **not** use floating point. Because `||q||` is a common positive factor, comparing two candidates `A` and `B` reduces to comparing `(A·q)/||A||` against `(B·q)/||B||`. The norms are non-negative, so:\n\n- The **sign** of a candidate's cosine equals the sign of its dot product `a · q`. A candidate with a positive dot beats any candidate with a zero or negative dot, regardless of magnitude; a zero dot beats any negative dot.\n- When two candidates share the same sign, compare the **squares** of their cosines by cross-multiplication. Candidate `A` has strictly larger `|cos|` than `B` iff\n\n  ```\n  (A·q)^2 * (||B||^2) * (||q||^2)  >  (B·q)^2 * (||A||^2) * (||q||^2)\n  ```\n\n  (the `||q||^2` factor is shown for clarity and cancels). For two **positive**-dot candidates the one with the larger `|cos|` wins; for two **negative**-dot candidates the one with the **smaller** `|cos|` (closer to zero) wins.\n\nIf several candidates tie exactly in cosine similarity, output the one with the **smallest index**. It is guaranteed that at least one candidate has a non-zero norm; assume `||q|| > 0`.",
    input_format:
      "Line 1: two integers `N D`.\nNext `N` lines: line `i` contains `D` integers — candidate vector `i`.\nNext line: `D` integers — the query vector `q`.",
    output_format: "Print one integer: the 0-based index of the candidate with the highest cosine similarity to `q`.",
    constraints: [
      "1 ≤ N ≤ 100000",
      "1 ≤ D ≤ 100",
      "-10^6 ≤ every coordinate ≤ 10^6",
      "||q|| > 0, and at least one candidate has non-zero norm",
      "products of intermediate quantities require 128-bit arithmetic",
    ],
    examples: [
      {
        input: "3 2\n1 0\n0 1\n3 4\n1 0",
        output: "0",
        explanation:
          "Query (1,0). cos with (1,0)=1 (perfectly aligned), with (0,1)=0, with (3,4)=3/5=0.6. Candidate 0 is the most similar.",
      },
      {
        input: "2 2\n-1 0\n-5 -1\n1 0",
        output: "1",
        explanation:
          "Both dots are negative (cosines below zero). Candidate 0 has cos=-1; candidate 1 has cos=-5/sqrt(26) ≈ -0.98, which is closer to zero (less dissimilar), so candidate 1 wins.",
      },
    ],
    notes:
      "Compute `dot = a·q` and `nrm = a·a` for each candidate in `long long`. To compare against the current best, first compare the signs of the two dots (positive > zero > negative). When the signs match and are non-zero, cross-multiply: `(__int128)dot*dot*bestNorm` vs `(__int128)bestDot*bestDot*nrm`. For positive dots the larger side wins; for negative dots the smaller side wins. `dot^2` can reach (10^6·10^6·100)^2 = 10^28, times a norm up to 10^14 → ~10^42, which overflows 64-bit but fits comfortably in `__int128`. Replace only on a strict win so ties keep the smaller index.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, D;\n    cin >> N >> D;\n    // TODO: read N candidate vectors (each length D) and the query q (length D).\n    // For each candidate compute dot = a*q and nrm = a*a (long long).\n    // Compare to the running best by dot sign first, then by cross-multiplied\n    // squared cosines using __int128. Print the best index.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, D;\n    cin >> N >> D;\n    vector<vector<long long>> cand(N, vector<long long>(D));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < D; j++) cin >> cand[i][j];\n    vector<long long> q(D);\n    for (int j = 0; j < D; j++) cin >> q[j];\n\n    int best = -1;\n    long long bestDot = 0, bestNorm = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long dot = 0, nrm = 0;\n        for (int j = 0; j < D; j++) {\n            dot += cand[i][j] * q[j];\n            nrm += cand[i][j] * cand[i][j];\n        }\n        if (best == -1) { best = i; bestDot = dot; bestNorm = nrm; continue; }\n\n        int sigI = (dot > 0) - (dot < 0);\n        int sigB = (bestDot > 0) - (bestDot < 0);\n        bool iWins;\n        if (sigI != sigB) {\n            iWins = sigI > sigB;               // positive > zero > negative\n        } else if (sigI == 0) {\n            iWins = false;                     // both cosine 0: keep smaller index\n        } else {\n            __int128 lhs = (__int128)dot * dot * bestNorm;\n            __int128 rhs = (__int128)bestDot * bestDot * nrm;\n            if (sigI > 0) iWins = lhs > rhs;   // positive: larger |cos| wins\n            else          iWins = lhs < rhs;   // negative: smaller |cos| wins\n        }\n        if (iWins) { best = i; bestDot = dot; bestNorm = nrm; }\n    }\n    cout << best << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3 2\n1 0\n0 1\n3 4\n1 0", expected_output: "0" },
      { input: "2 2\n-1 0\n-5 -1\n1 0", expected_output: "1" },
      { input: "3 2\n1 1 1\n2 2 2\n3 3 3", expected_output: "0" },
      { input: "3 2\n0 5\n3 0\n-1 -1\n1 0", expected_output: "1" },
      { input: "2 2\n2 0\n1 1\n1 1", expected_output: "1" },
    ],
    editorial:
      "This is exact cosine-similarity vector search — the retrieval step of a RAG pipeline or a recommendation engine — done without a single float. Two ideas make it exact. First, since `||a||` and `||q||` are non-negative, the sign of `cos` is the sign of the dot product, so a positive dot always beats a non-positive one before magnitudes even matter. Second, comparing `(A·q)/||A||` to `(B·q)/||B||` for same-sign candidates is, after squaring and cross-multiplying, the integer comparison `(A·q)^2·||B||^2` vs `(B·q)^2·||A||^2`; the shared `||q||^2` cancels. Those products can reach ~10^42, so 64-bit overflows and you promote the multiplications to `__int128`. The negative-dot case flips the comparison: among dissimilar candidates you want the one nearest zero, i.e. the smaller squared cosine. Real systems normalize once and use floats with HNSW indexes, but the exact integer version shows precisely what the metric is comparing — and never loses a tie to rounding.",
  },
];
