
export default [
  {
    id: "cp-dp-1",
    title: "Token Edit Distance",
    slug: "edit-distance",
    topic: "dp",
    difficulty: "medium",
    algorithm_focus: "Levenshtein edit distance / sequence alignment",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["dynamic-programming", "strings", "alignment", "diff"],
    story:
      "Your model just rewrote a user's sentence. To highlight what changed — and to score how close the rewrite is to a reference — you need the minimum number of single-character edits that turn one string into the other. This is **edit distance**, the same DP that powers diff tools, spell-checkers, and sequence alignment in NLP.",
    statement:
      "Given two strings `A` and `B`, compute the **Levenshtein edit distance**: the minimum number of single-character **insertions**, **deletions**, or **substitutions** needed to transform `A` into `B`.\n\nLet `dp[i][j]` be the edit distance between the first `i` characters of `A` and the first `j` characters of `B`. Then:\n\n```\ndp[i][0] = i\ndp[0][j] = j\ndp[i][j] = min(\n    dp[i-1][j] + 1,        // delete A[i-1]\n    dp[i][j-1] + 1,        // insert B[j-1]\n    dp[i-1][j-1] + cost    // match/substitute (cost 0 if equal else 1)\n)\n```",
    input_format:
      "The first line contains string `A`.\nThe second line contains string `B`.\nEither string may be empty (a blank line).",
    output_format: "Print a single integer — the edit distance between `A` and `B`.",
    constraints: [
      "0 ≤ |A|, |B| ≤ 2000",
      "strings contain printable ASCII characters without leading/trailing spaces",
    ],
    examples: [
      {
        input: "kitten\nsitting",
        output: "3",
        explanation:
          "kitten → sitten (substitute k→s) → sittin (substitute e→i) → sitting (insert g). Three edits.",
      },
      {
        input: "flaw\nlawn",
        output: "2",
        explanation: "flaw → law (delete f) → lawn (insert n). Two edits.",
      },
    ],
    notes:
      "The classic table is O(|A|·|B|) time and space — fine for these limits. Read lines with `getline` so empty strings are handled correctly.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string a, b;\n    getline(cin, a);\n    getline(cin, b);\n    // TODO: build the (|a|+1) x (|b|+1) DP table and print dp[|a|][|b|].\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string a, b;\n    getline(cin, a);\n    getline(cin, b);\n    int n = a.size(), m = b.size();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1));\n    for (int i = 0; i <= n; i++) dp[i][0] = i;\n    for (int j = 0; j <= m; j++) dp[0][j] = j;\n    for (int i = 1; i <= n; i++)\n        for (int j = 1; j <= m; j++) {\n            int cost = (a[i - 1] == b[j - 1]) ? 0 : 1;\n            dp[i][j] = min({ dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost });\n        }\n    cout << dp[n][m] << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "kitten\nsitting", expected_output: "3" },
      { input: "flaw\nlawn", expected_output: "2" },
      { input: "abc\nabc", expected_output: "0" },
    ],
    editorial:
      "Edit distance is the textbook example of 2D dynamic programming over two sequences. The same recurrence, with a max instead of a min and a similarity score instead of an edit cost, becomes Needleman–Wunsch alignment used in bioinformatics and in evaluating model rewrites. Memory can be reduced to O(min(|A|,|B|)) by keeping only two rows — a useful optimization once the strings get long.",
  },
  {
    id: "cp-dp-2",
    title: "Longest Common Subsequence of Tokens",
    slug: "longest-common-subsequence",
    topic: "dp",
    difficulty: "easy",
    algorithm_focus: "Longest Common Subsequence (LCS) DP",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["dynamic-programming", "sequences", "lcs", "evaluation"],
    story:
      "To score how well your model's output overlaps a reference answer, you tokenize both and measure how much of the reference appears **in order** inside the output — gaps allowed, reordering not. That ordered overlap is the **Longest Common Subsequence**, the metric behind ROUGE-L and the workhorse of diff tools.",
    statement:
      "You are given two token sequences `A` (the model output) and `B` (the reference), each a list of integer token ids. A **subsequence** is obtained by deleting zero or more tokens without changing the order of the rest. Compute the **length of the longest sequence that is a subsequence of both** `A` and `B`.\n\nLet `dp[i][j]` be the LCS length of the first `i` tokens of `A` and the first `j` tokens of `B`. Then:\n\n```\ndp[i][0] = dp[0][j] = 0\nif A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1\nelse:                 dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n```",
    input_format:
      "Line 1: two integers `n m` — the lengths of `A` and `B`.\nLine 2: `n` integers — the tokens of `A`.\nLine 3: `m` integers — the tokens of `B`.\nIf a sequence is empty its line is blank, but the counts on line 1 always tell you how many to read.",
    output_format:
      "Print a single integer — the length of the longest common subsequence of `A` and `B`.",
    constraints: [
      "0 ≤ n, m ≤ 2000",
      "0 ≤ each token id ≤ 10^9",
    ],
    examples: [
      {
        input: "5 4\n1 2 3 4 5\n2 4 5 1",
        output: "3",
        explanation:
          "The tokens 2, 4, 5 appear in this order in both sequences, giving an LCS of length 3.",
      },
      {
        input: "4 3\n7 7 7 7\n7 1 7",
        output: "2",
        explanation:
          "The reference contributes only two 7s in order, so at most two tokens can be matched.",
      },
    ],
    notes:
      "Standard LCS is O(n·m) time and space, comfortable inside the limits. Always read exactly `n` then `m` integers based on line 1 — never infer the count from the data.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<int> a(n), b(m);\n    for (auto &x : a) cin >> x;\n    for (auto &x : b) cin >> x;\n    // TODO: build the (n+1) x (m+1) LCS table and print dp[n][m].\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<int> a(n), b(m);\n    for (auto &x : a) cin >> x;\n    for (auto &x : b) cin >> x;\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    for (int i = 1; i <= n; i++)\n        for (int j = 1; j <= m; j++) {\n            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    cout << dp[n][m] << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "5 4\n1 2 3 4 5\n2 4 5 1", expected_output: "3" },
      { input: "4 3\n7 7 7 7\n7 1 7", expected_output: "2" },
      { input: "3 3\n1 2 3\n4 5 6", expected_output: "0" },
      { input: "3 0\n1 2 3\n", expected_output: "0" },
    ],
    editorial:
      "LCS is the gentler cousin of edit distance: same 2D table over two sequences, but you build matches up rather than counting edits. On a match you extend the diagonal; otherwise you inherit the better of dropping a token from either side. It runs in O(n·m) and can be squeezed to two rows when you only need the length. The same recurrence underlies ROUGE-L for summarization scoring and the longest-matching-block heuristics in diff and merge tools.",
  },
  {
    id: "cp-dp-3",
    title: "Context Budget Knapsack",
    slug: "context-budget-knapsack",
    topic: "dp",
    difficulty: "hard",
    algorithm_focus: "0/1 knapsack DP / bounded subset-sum value maximization",
    time_limit_ms: 1500,
    memory_limit_mb: 256,
    tags: ["dynamic-programming", "knapsack", "optimization", "context-window"],
    story:
      "You are assembling the context for a single LLM call. You have `N` candidate snippets — retrieved passages, tool results, memories — and a hard **token budget** `B` for the prompt. Each snippet costs some tokens and carries an integer **relevance** value. You can include a snippet whole or not at all. Pack the context to maximize total relevance without blowing the budget: classic **0/1 knapsack**.",
    statement:
      "You are given a token budget `B` and `N` snippets. Snippet `i` has a token cost `c[i]` and an integer relevance value `v[i]`. Choose a subset `S` of snippets so that the total cost does not exceed the budget:\n\n```\nsum of c[i] for i in S  ≤  B\n```\n\nand the total relevance `sum of v[i] for i in S` is **maximized**. Output that maximum total value.\n\nLet `dp[w]` be the best achievable value using a budget of at most `w` tokens. Processing each snippet and iterating `w` from `B` down to `c[i]`:\n\n```\ndp[w] = max(dp[w], dp[w - c[i]] + v[i])\n```\n\nensures each snippet is used at most once.",
    input_format:
      "Line 1: two integers `N B` — the number of snippets and the token budget.\nNext `N` lines: snippet `i` is given as two integers `c[i] v[i]` — its token cost and relevance value.",
    output_format:
      "Print a single integer — the maximum total relevance of a subset whose total cost is at most `B`.",
    constraints: [
      "1 ≤ N ≤ 2000",
      "0 ≤ B ≤ 20000",
      "0 ≤ c[i] ≤ 20000",
      "0 ≤ v[i] ≤ 10^6",
    ],
    examples: [
      {
        input: "4 10\n5 10\n4 40\n6 30\n3 50",
        output: "90",
        explanation:
          "Picking the snippets costing 4 and 3 uses 7 of the 10-token budget for value 40 + 50 = 90, which beats every other subset that fits.",
      },
      {
        input: "3 4\n2 3\n3 4\n4 5",
        output: "5",
        explanation:
          "No two snippets fit together within 4 tokens, so the best single snippet (cost 4, value 5) wins.",
      },
    ],
    notes:
      "Use a 1D `dp` array of size `B+1` and iterate the budget **downward** for each snippet so it is counted at most once — iterating upward would allow reusing a snippet (unbounded knapsack). Values can reach 2000·10^6 = 2·10^9, so accumulate in `long long`.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    long long B;\n    cin >> n >> B;\n    vector<long long> cost(n), val(n);\n    for (int i = 0; i < n; i++) cin >> cost[i] >> val[i];\n    // TODO: 1D 0/1 knapsack over the budget; print the max total value.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    long long B;\n    cin >> n >> B;\n    vector<long long> cost(n), val(n);\n    for (int i = 0; i < n; i++) cin >> cost[i] >> val[i];\n    vector<long long> dp(B + 1, 0);\n    for (int i = 0; i < n; i++) {\n        long long c = cost[i], v = val[i];\n        if (c > B) continue;\n        for (long long w = B; w >= c; w--)\n            dp[w] = max(dp[w], dp[w - c] + v);\n    }\n    cout << dp[B] << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "4 10\n5 10\n4 40\n6 30\n3 50", expected_output: "90" },
      { input: "3 4\n2 3\n3 4\n4 5", expected_output: "5" },
      { input: "2 1\n5 100\n3 50", expected_output: "0" },
    ],
    editorial:
      "0/1 knapsack is the canonical resource-allocation DP: maximize value subject to a single capacity constraint where each item is taken whole or skipped. The 1D-array trick collapses the textbook 2D table to O(B) memory; the crucial detail is iterating the weight axis **downward**, which guarantees `dp[w-c]` still refers to the previous item's state so each item is used at most once. Reverse that loop and you get unbounded knapsack, where items repeat. In LLM systems this is exactly the context-packing problem: fit the most-relevant retrieved chunks into a fixed token window, and the same DP underlies budgeted feature selection and prompt compression.",
  },
];
