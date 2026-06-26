
export default [
  {
    id: "cp-prob-1",
    title: "Viterbi Decoding",
    slug: "viterbi-decoding",
    topic: "probability",
    difficulty: "hard",
    algorithm_focus: "Viterbi algorithm / most-likely hidden state path (HMM)",
    time_limit_ms: 1500,
    memory_limit_mb: 256,
    tags: ["dynamic-programming", "hmm", "viterbi", "decoding"],
    story:
      "A part-of-speech tagger hides the real grammatical state behind the words you actually see. Given how likely each hidden state emits each observed token, and how likely states follow one another, you want the single **most likely sequence of hidden states**. Searching all S^T paths is hopeless — the **Viterbi algorithm** finds the best one in O(T·S²) with dynamic programming.\n\nTo keep everything exact, this problem uses **integer scores** (think log-probabilities) instead of floating-point probabilities, and you maximize the total score.",
    statement:
      "There are `S` hidden states (numbered `0..S-1`) and `T` observations. You are given:\n\n- `start[s]` — the score of beginning in state `s`.\n- `trans[p][s]` — the score of moving from state `p` to state `s`.\n- `emit[s][k]` — the score of state `s` emitting observation symbol `k`.\n- `obs[0..T-1]` — the observed symbols (each in `0..K-1`).\n\nThe score of a state path `p0, p1, …, p(T-1)` is:\n\n```\nstart[p0] + emit[p0][obs[0]]\n  + sum over t=1..T-1 of ( trans[p(t-1)][pt] + emit[pt][obs[t]] )\n```\n\nFind the **maximum total score** and one path achieving it. If several paths tie, output the one that is lexicographically smallest by state index.",
    input_format:
      "Line 1: two integers `S T`.\nLine 2: `S` integers — `start[0..S-1]`.\nNext `S` lines: row `p` has `S` integers — `trans[p][0..S-1]`.\nNext line: integer `K` (number of observation symbols).\nNext `S` lines: row `s` has `K` integers — `emit[s][0..K-1]`.\nLast line: `T` integers — `obs[0..T-1]`.",
    output_format:
      "Line 1: the maximum total score.\nLine 2: the `T` state indices of an optimal path, space-separated.",
    constraints: [
      "1 ≤ S ≤ 50",
      "1 ≤ T ≤ 1000",
      "1 ≤ K ≤ 50",
      "0 ≤ obs[t] < K",
      "all scores are integers with absolute value ≤ 10^6",
    ],
    examples: [
      {
        input: "2 3\n0 0\n1 0\n0 1\n2\n2 0\n0 2\n0 1 0",
        output: "6\n0 0 0",
        explanation:
          "Staying in state 0 emits obs 0 and 0 strongly (score 2 each) and the self-transition adds 1 each step, beating any path that switches states.",
      },
    ],
    notes:
      "Keep a DP table `dp[t][s]` = best score of any path ending in state `s` at time `t`, plus a parent table to reconstruct the path. Process predecessors in increasing index and only replace on a **strict** improvement so ties resolve to the smallest state index.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int S, T;\n    cin >> S >> T;\n    // TODO: read start[S], trans[S][S], K, emit[S][K], obs[T].\n    // Fill dp[t][s] and a parent table, then reconstruct the best path.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int S, T;\n    cin >> S >> T;\n    vector<long long> st(S);\n    for (auto &x : st) cin >> x;\n    vector<vector<long long>> tr(S, vector<long long>(S));\n    for (int i = 0; i < S; i++)\n        for (int j = 0; j < S; j++) cin >> tr[i][j];\n    int K;\n    cin >> K;\n    vector<vector<long long>> em(S, vector<long long>(K));\n    for (int i = 0; i < S; i++)\n        for (int k = 0; k < K; k++) cin >> em[i][k];\n    vector<int> ob(T);\n    for (auto &o : ob) cin >> o;\n\n    const long long NEG = LLONG_MIN / 4;\n    vector<vector<long long>> dp(T, vector<long long>(S, NEG));\n    vector<vector<int>> par(T, vector<int>(S, -1));\n    for (int s = 0; s < S; s++) dp[0][s] = st[s] + em[s][ob[0]];\n    for (int t = 1; t < T; t++)\n        for (int s = 0; s < S; s++)\n            for (int p = 0; p < S; p++) {\n                long long v = dp[t - 1][p] + tr[p][s] + em[s][ob[t]];\n                if (v > dp[t][s]) { dp[t][s] = v; par[t][s] = p; }\n            }\n    long long best = NEG;\n    int bs = 0;\n    for (int s = 0; s < S; s++)\n        if (dp[T - 1][s] > best) { best = dp[T - 1][s]; bs = s; }\n    vector<int> path(T);\n    path[T - 1] = bs;\n    for (int t = T - 1; t > 0; t--) path[t - 1] = par[t][path[t]];\n    cout << best << \"\\n\";\n    for (int t = 0; t < T; t++) cout << path[t] << (t + 1 < T ? ' ' : '\\n');\n    return 0;\n}\n",
    test_cases: [
      { input: "2 3\n0 0\n1 0\n0 1\n2\n2 0\n0 2\n0 1 0", expected_output: "6\n0 0 0" },
      { input: "2 2\n5 0\n0 0\n0 0\n2\n1 0\n0 1\n0 1", expected_output: "7\n0 1" },
    ],
    editorial:
      "Viterbi is dynamic programming over a trellis: `dp[t][s]` is the best score of any path that ends in state `s` after t observations, and a parent pointer lets you walk the winner back. The complexity is O(T·S²) — quadratic in states, linear in time — versus the S^T cost of brute force. Switching the integer scores to log-probabilities and the additions to log-space sums turns this exact same code into the standard HMM decoder used in speech recognition and POS tagging. Maximizing in log-space avoids the floating-point underflow you'd get multiplying many small probabilities directly.",
  },
  {
    id: "cp-prob-2",
    title: "Next Token Argmax",
    slug: "next-token-argmax",
    topic: "probability",
    difficulty: "easy",
    algorithm_focus: "Maximum-likelihood next-token prediction from an n-gram count table",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["argmax", "n-gram", "language-model", "counting"],
    story:
      "Before transformers, the simplest language models were **n-grams**: to predict the next word you just counted how often each word followed the current context in your training corpus, then picked the most frequent one. That single step — `argmax` over counts — is the maximum-likelihood estimate of the next token.\n\nYou are handed the slice of the count table for one fixed context: a list of candidate next tokens and how many times each was observed. Predict greedily by returning the token with the **highest count**.",
    statement:
      "For a fixed context, you are given `N` candidate next tokens, each with an observed integer count. Output the token with the largest count.\n\nIf two or more tokens share the maximum count, output the one that is **lexicographically smallest** (standard ASCII string comparison).",
    input_format:
      "Line 1: an integer `N` — the number of candidate tokens.\nNext `N` lines: each line has a token (a string of visible non-space characters) and an integer `count`, separated by a space.",
    output_format: "A single line: the predicted next token.",
    constraints: [
      "1 ≤ N ≤ 100000",
      "0 ≤ count ≤ 10^9",
      "each token has length 1..32 and contains no whitespace",
      "tokens are not guaranteed to be distinct in the input",
    ],
    examples: [
      {
        input: "3\ncat 5\ndog 9\nbird 9",
        output: "bird",
        explanation:
          "`dog` and `bird` both appear 9 times, the maximum. The tie is broken lexicographically, and `\"bird\" < \"dog\"`, so `bird` is printed.",
      },
    ],
    notes:
      "One linear scan suffices. Track the best token seen so far; replace it when you see a strictly larger count, or an equal count with a lexicographically smaller token. Counts can reach 10^9 — comfortably inside a 32-bit int, but using `long long` avoids any worry.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: read n (token, count) pairs.\n    // Print the token with the largest count; break ties by smallest token.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    string bestTok;\n    long long bestCnt = -1;\n    for (int i = 0; i < n; i++) {\n        string tok;\n        long long cnt;\n        cin >> tok >> cnt;\n        if (cnt > bestCnt || (cnt == bestCnt && tok < bestTok)) {\n            bestCnt = cnt;\n            bestTok = tok;\n        }\n    }\n    cout << bestTok << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3\ncat 5\ndog 9\nbird 9", expected_output: "bird" },
      { input: "1\nhello 0", expected_output: "hello" },
      { input: "4\nzebra 2\napple 7\nmango 7\nbanana 1", expected_output: "apple" },
    ],
    editorial:
      "An n-gram model estimates P(next | context) by relative frequency: count(context, next) / count(context). Since the denominator is the same for every candidate under a fixed context, the most probable next token is simply the one with the largest raw count — no division needed. That reduces prediction to a single `argmax` over the count column, computable in O(N) with a one-pass scan. The lexicographic tie-break makes the answer deterministic, exactly the kind of stable rule a real decoder needs when probabilities are equal. This greedy pick is also the foundation of greedy decoding in modern LLMs: at each step you take the argmax of the next-token distribution; n-grams just compute that distribution by counting instead of with a neural network.",
  },
  {
    id: "cp-prob-3",
    title: "Naive Bayes Classifier",
    slug: "naive-bayes-classifier",
    topic: "probability",
    difficulty: "medium",
    algorithm_focus: "Maximum a posteriori classification with additive log-scores (Naive Bayes)",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["naive-bayes", "classification", "log-probability", "argmax"],
    story:
      "A **Naive Bayes** classifier assigns a document to the class that maximizes the posterior P(class | features). Because multiplying many small probabilities underflows, real implementations work in **log-space**: the product of probabilities becomes a sum of log-probabilities, and the class score is `log P(class) + sum over features of count(feature) · log P(feature | class)`.\n\nTo keep everything exact, this problem gives you the log-probabilities already scaled to **integers**. You just sum the right integers per class and pick the largest.",
    statement:
      "There are `C` classes (numbered `0..C-1`) and `F` features. For each class `c` you are given:\n\n- `prior[c]` — an integer log-score for choosing class `c`.\n- `feat[c][f]` — an integer log-score contributed by **one** occurrence of feature `f` in class `c`.\n\nA query is described by feature counts `cnt[0..F-1]`, where `cnt[f]` is how many times feature `f` was observed. The total score of class `c` is:\n\n```\nscore[c] = prior[c] + sum over f=0..F-1 of ( feat[c][f] · cnt[f] )\n```\n\nOutput the index of the class with the **maximum** total score. If several classes tie, output the **smallest** such index.",
    input_format:
      "Line 1: two integers `C F`.\nNext `C` lines: line `c` has `1 + F` integers — `prior[c]` followed by `feat[c][0..F-1]`.\nLast line: `F` integers — the query feature counts `cnt[0..F-1]`.",
    output_format: "A single line: the index of the best-scoring class.",
    constraints: [
      "1 ≤ C ≤ 1000",
      "1 ≤ F ≤ 1000",
      "all log-scores `prior[c]` and `feat[c][f]` are integers with absolute value ≤ 10^6",
      "0 ≤ cnt[f] ≤ 10^6",
      "the total score fits in a signed 64-bit integer",
    ],
    examples: [
      {
        input: "2 3\n-5 -2 -3 -1\n-4 -1 -6 -2\n2 1 0",
        output: "0",
        explanation:
          "Class 0: -5 + (-2·2) + (-3·1) + (-1·0) = -12. Class 1: -4 + (-1·2) + (-6·1) + (-2·0) = -12. Both score -12, so the tie is broken toward the smaller index, 0.",
      },
    ],
    notes:
      "Read all `C` rows, then the query counts. For each class accumulate `prior[c] + sum(feat[c][f]·cnt[f])` using `long long` — products like 10^6 · 10^6 already exceed 32 bits. Replace the running best only on a **strict** improvement so equal scores keep the earliest (smallest) class index.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int C, F;\n    cin >> C >> F;\n    // TODO: read prior[c] and feat[c][f] for each class, then cnt[f].\n    // Print the class index with the maximum total log-score.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int C, F;\n    if (!(cin >> C >> F)) return 0;\n    vector<long long> prior(C);\n    vector<vector<long long>> feat(C, vector<long long>(F));\n    for (int c = 0; c < C; c++) {\n        cin >> prior[c];\n        for (int f = 0; f < F; f++) cin >> feat[c][f];\n    }\n    vector<long long> cnt(F);\n    for (int f = 0; f < F; f++) cin >> cnt[f];\n\n    long long bestScore = LLONG_MIN;\n    int bestClass = 0;\n    for (int c = 0; c < C; c++) {\n        long long score = prior[c];\n        for (int f = 0; f < F; f++) score += feat[c][f] * cnt[f];\n        if (score > bestScore) {\n            bestScore = score;\n            bestClass = c;\n        }\n    }\n    cout << bestClass << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "2 3\n-5 -2 -3 -1\n-4 -1 -6 -2\n2 1 0", expected_output: "0" },
      { input: "3 2\n-10 -1 -2\n-3 -4 -5\n-2 -1 -1\n3 0", expected_output: "2" },
      { input: "2 1\n0 -1\n-1 -1\n5", expected_output: "0" },
    ],
    editorial:
      "Naive Bayes picks argmax_c P(c) · prod_f P(f|c)^cnt[f]. Taking logs turns the product into a sum — `log P(c) + sum_f cnt[f]·log P(f|c)` — which both avoids floating-point underflow and makes the comparison a simple integer/real addition. The 'naive' part is the conditional-independence assumption between features given the class, which is what lets the joint likelihood factor into that product. Here the log-probabilities are pre-scaled to integers so the arithmetic is exact: each class score is one dot product between its feature log-weights and the query counts, plus the prior. Scoring all classes is O(C·F), and the strict-improvement tie-break guarantees a deterministic, reproducible label — the same MAP decision rule used in spam filters and text categorizers, just with the probabilities supplied as integers instead of estimated from data.",
  },
];
