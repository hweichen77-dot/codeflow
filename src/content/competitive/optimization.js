// Competitive Coding — Optimization topic.
// Problems that teach the optimization math behind training and serving AI models,
// implemented exactly in integer arithmetic through C++.

export default [
  {
    id: "cp-opt-1",
    title: "Hyperparameter Sweep",
    slug: "hyperparameter-sweep",
    topic: "optimization",
    difficulty: "easy",
    algorithm_focus: "Grid search / argmin over a discrete candidate set",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["optimization", "grid-search", "argmin", "linear-scan"],
    story:
      "Before training the real model you run a **grid search**: a fixed list of candidate hyperparameter settings, each trained briefly and scored by its validation **loss**. Lower loss is better. Your job is to pick the winner — the candidate with the smallest loss — and report which one it is.\n\nThis is the simplest optimizer there is: no gradients, no momentum, just evaluate every option and keep the best. To keep scoring exact, the losses are given as integers (think micro-loss units).",
    statement:
      "You are given `N` candidate hyperparameter settings, indexed `0..N-1`. Setting `i` produced an integer validation loss `loss[i]`.\n\nFind the index of the setting with the **minimum** loss. If several settings tie for the minimum loss, choose the one with the **smallest index** (it was discovered first in the sweep).\n\nOutput both the chosen index and its loss value.",
    input_format:
      "Line 1: a single integer `N` — the number of candidate settings.\nLine 2: `N` integers — `loss[0], loss[1], …, loss[N-1]`, space-separated.",
    output_format:
      "Print two integers separated by a single space: the index of the minimum-loss setting and the loss value at that index.",
    constraints: [
      "1 ≤ N ≤ 200000",
      "-10^9 ≤ loss[i] ≤ 10^9",
      "on ties, the smallest index wins",
    ],
    examples: [
      {
        input: "5\n7 3 9 3 8",
        output: "1 3",
        explanation:
          "The minimum loss is 3, achieved at indices 1 and 3. The smallest such index is 1, and its loss is 3.",
      },
      {
        input: "1\n42",
        output: "0 42",
        explanation:
          "Only one candidate exists, so it is trivially the best with loss 42 at index 0.",
      },
    ],
    notes:
      "A single linear scan is enough: track the best loss seen so far and its index, and only update on a **strict** improvement (`loss[i] < bestVal`). Because you only replace on a strict decrease, the earliest (smallest) index is kept automatically when there is a tie.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: read loss[0..n-1], scan once, track the smallest value and its index.\n    // Print: index value\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<long long> loss(n);\n    for (auto &x : loss) cin >> x;\n    int bestIdx = 0;\n    long long bestVal = loss[0];\n    for (int i = 1; i < n; i++) {\n        if (loss[i] < bestVal) { bestVal = loss[i]; bestIdx = i; }\n    }\n    cout << bestIdx << \" \" << bestVal << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "5\n7 3 9 3 8", expected_output: "1 3" },
      { input: "1\n42", expected_output: "0 42" },
      { input: "6\n10 10 10 2 2 5", expected_output: "3 2" },
    ],
    editorial:
      "Grid search is the baseline of all hyperparameter optimization: you discretize the search space, evaluate every point, and take the argmin of the objective. The whole problem reduces to a single argmin pass in O(N) time and O(1) extra memory. The only subtlety is the tie-break — updating only on a strict improvement preserves the first (smallest) index. Real systems replace this exhaustive scan with smarter optimizers (random search, Bayesian optimization, Hyperband) once the grid grows too large to evaluate fully, but they all answer the same question this problem does: which configuration minimizes the loss.",
  },
  {
    id: "cp-opt-2",
    title: "Learning-Rate Ternary Search",
    slug: "learning-rate-ternary-search",
    topic: "optimization",
    difficulty: "medium",
    algorithm_focus: "Ternary search on a unimodal (convex) integer function",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["optimization", "ternary-search", "convex", "unimodal"],
    story:
      "Tuning a learning rate is a one-dimensional convex optimization. Too small and training crawls; too large and it diverges. The validation cost as a function of the (integer-encoded) learning-rate setting `x` is a **bowl-shaped convex parabola** with a single minimum. Because it is unimodal you do not need to evaluate every point — **ternary search** narrows the bracket by a third each step, finding the minimizer in O(log range) evaluations.\n\nTo stay exact, the cost is the integer parabola `f(x) = a·(x − h)² + c`.",
    statement:
      "The cost function is `f(x) = a·(x − h)² + c`, where `a`, `h`, and `c` are integers and `a ≥ 1` (so `f` is strictly convex). You may only choose **integer** values of `x` within the inclusive range `[lo, hi]`.\n\nFind the integer `x` in `[lo, hi]` that **minimizes** `f(x)`. If two integers achieve the same minimal cost, output the **smaller** `x`. Output that `x` together with its cost `f(x)`.",
    input_format:
      "A single line with five integers: `a h c lo hi`.",
    output_format:
      "Print two integers separated by a single space: the minimizing `x` and the value `f(x)` at that point.",
    constraints: [
      "1 ≤ a ≤ 10^6",
      "-10^6 ≤ h, c ≤ 10^6",
      "-10^6 ≤ lo ≤ hi ≤ 10^6",
      "f(x) fits in a 64-bit signed integer for all x in range",
    ],
    examples: [
      {
        input: "3 7 5 0 10",
        output: "7 5",
        explanation:
          "The parabola is minimized at its vertex x = h = 7, which lies inside [0,10]. There f(7) = 3·0² + 5 = 5.",
      },
      {
        input: "1 20 0 0 10",
        output: "10 100",
        explanation:
          "The vertex x = 20 is outside the range, so on [0,10] the function is still decreasing; the minimum is at the right endpoint x = 10 with f(10) = (10−20)² = 100.",
      },
    ],
    notes:
      "Keep a bracket `[lo, hi]` and shrink it while its width is greater than 2. Probe `m1 = lo + (hi−lo)/3` and `m2 = hi − (hi−lo)/3`; if `f(m1) <= f(m2)` the minimizer cannot be above `m2`, so set `hi = m2 − 1`, otherwise set `lo = m1 + 1`. When at most three candidates remain, evaluate them directly and pick the smallest cost (and on a tie the smallest `x`). Use 64-bit integers — `a·(x−h)²` can be large.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long a, h, c;\nlong long f(long long x) {\n    // TODO: return a*(x-h)*(x-h) + c\n    return 0;\n}\n\nint main() {\n    long long lo, hi;\n    cin >> a >> h >> c >> lo >> hi;\n    // TODO: ternary search on [lo, hi] for the integer minimizer; print: x f(x)\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long a, h, c;\nlong long f(long long x) {\n    long long d = x - h;\n    return a * d * d + c;\n}\n\nint main() {\n    long long lo, hi;\n    cin >> a >> h >> c >> lo >> hi;\n    while (hi - lo > 2) {\n        long long m1 = lo + (hi - lo) / 3;\n        long long m2 = hi - (hi - lo) / 3;\n        if (f(m1) <= f(m2)) hi = m2 - 1;\n        else lo = m1 + 1;\n    }\n    long long bx = lo, bv = f(lo);\n    for (long long x = lo + 1; x <= hi; x++) {\n        long long v = f(x);\n        if (v < bv) { bv = v; bx = x; }\n    }\n    cout << bx << \" \" << bv << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3 7 5 0 10", expected_output: "7 5" },
      { input: "1 20 0 0 10", expected_output: "10 100" },
      { input: "2 -5 3 0 10", expected_output: "0 53" },
      { input: "5 2 1 7 7", expected_output: "7 126" },
      { input: "3 123456 99 -1000000 1000000", expected_output: "123456 99" },
    ],
    editorial:
      "Ternary search exploits **unimodality**: on a strictly convex function the value first decreases then increases, so comparing two interior probes always tells you which third of the bracket cannot contain the minimum. Each iteration discards a third of the range, giving O(log(hi−lo)) evaluations versus O(hi−lo) for a brute scan. Working with strict convexity (`a ≥ 1`) and a strict-improvement tie-break guarantees the smallest minimizing `x`. The same one-dimensional search underlies learning-rate finders and line-search steps inside larger optimizers; switching to floating-point probes and a tolerance-based stop turns this exact integer version into the continuous golden-section / ternary search used in practice. The key correctness invariant is keeping the true minimizer always inside `[lo, hi]` as the bracket shrinks.",
  },
  {
    id: "cp-opt-3",
    title: "Model-Tier Assignment",
    slug: "model-tier-assignment",
    topic: "optimization",
    difficulty: "hard",
    algorithm_focus: "Minimum-cost assignment via bitmask DP over subsets",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["optimization", "assignment", "bitmask-dp", "scheduling"],
    story:
      "You serve `N` incoming **tasks** and have exactly `N` **model tiers** (e.g. a fast small model, a balanced one, a heavyweight one, …). Routing task `i` to tier `j` costs `cost[i][j]` — a blend of latency, GPU time, and quality penalty. Each task must go to a distinct tier and each tier handles exactly one task (a one-to-one **assignment**).\n\nYou want the routing plan with **minimum total cost**. With `N ≤ 8`, the number of tiers is small, so a **bitmask DP over the set of already-used tiers** solves it exactly in O(2^N · N).",
    statement:
      "You are given an `N × N` integer cost matrix `cost`, where `cost[i][j]` is the cost of assigning task `i` to tier `j`.\n\nFind a **perfect matching** — a bijection assigning each task to a distinct tier — that **minimizes** the sum of the chosen costs. Output that minimum total cost.\n\nLet `dp[mask]` be the minimum cost to have assigned the first `popcount(mask)` tasks using exactly the set of tiers in `mask`. Tasks are assigned in index order; the next task to place is `task = popcount(mask)`, and you may route it to any tier not yet in `mask`.",
    input_format:
      "Line 1: a single integer `N`.\nNext `N` lines: row `i` contains `N` integers — `cost[i][0], …, cost[i][N-1]`.",
    output_format: "Print a single integer — the minimum total assignment cost.",
    constraints: [
      "1 ≤ N ≤ 8",
      "0 ≤ cost[i][j] ≤ 10^9",
      "exactly one task per tier and one tier per task",
    ],
    examples: [
      {
        input: "3\n9 2 7\n6 4 3\n5 8 1",
        output: "9",
        explanation:
          "Assign task 0→tier 1 (cost 2), task 1→tier 0 (cost 6), task 2→tier 2 (cost 1): total 9. No other perfect matching is cheaper.",
      },
      {
        input: "2\n1 5\n5 1",
        output: "2",
        explanation:
          "The diagonal assignment 0→0 and 1→1 costs 1 + 1 = 2, beating the off-diagonal 5 + 5 = 10.",
      },
    ],
    notes:
      "Iterate masks from 0 upward. The number of bits set in `mask` equals how many tasks are already placed, so `task = __builtin_popcount(mask)` is the next one to assign. For each free tier `tier` (bit not set), relax `dp[mask | (1<<tier)]` with `dp[mask] + cost[task][tier]`. Use 64-bit accumulation: eight costs near 10^9 sum past the 32-bit range. The answer is `dp[(1<<N)-1]`.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: read cost[n][n].\n    // dp over subsets of tiers; task = popcount(mask). Print dp[(1<<n)-1].\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<vector<long long>> cost(n, vector<long long>(n));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++) cin >> cost[i][j];\n\n    const long long INF = LLONG_MAX / 4;\n    vector<long long> dp(1 << n, INF);\n    dp[0] = 0;\n    for (int mask = 0; mask < (1 << n); mask++) {\n        if (dp[mask] == INF) continue;\n        int task = __builtin_popcount(mask); // assign task `task` next\n        if (task >= n) continue;\n        for (int tier = 0; tier < n; tier++) {\n            if (mask & (1 << tier)) continue;\n            int nm = mask | (1 << tier);\n            long long v = dp[mask] + cost[task][tier];\n            if (v < dp[nm]) dp[nm] = v;\n        }\n    }\n    cout << dp[(1 << n) - 1] << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "3\n9 2 7\n6 4 3\n5 8 1", expected_output: "9" },
      { input: "1\n42", expected_output: "42" },
      { input: "2\n1 5\n5 1", expected_output: "2" },
      {
        input: "4\n10 19 8 15\n10 18 7 17\n13 16 9 14\n12 19 8 18",
        expected_output: "49",
      },
      {
        input:
          "8\n1 9 9 9 9 9 9 9\n9 1 9 9 9 9 9 9\n9 9 1 9 9 9 9 9\n9 9 9 1 9 9 9 9\n9 9 9 9 1 9 9 9\n9 9 9 9 9 1 9 9\n9 9 9 9 9 9 1 9\n9 9 9 9 9 9 9 1",
        expected_output: "8",
      },
    ],
    editorial:
      "Minimum-cost assignment is the classic bipartite matching problem solved in general by the Hungarian algorithm in O(N³). For small N, a **bitmask DP over subsets of used tiers** is simpler and just as exact: `dp[mask]` is the cheapest way to assign the first `popcount(mask)` tasks using precisely the tiers in `mask`, and the next task index is determined by how many bits are already set, so you never double-count an assignment. The transition relaxes each free tier, giving O(2^N · N) time and O(2^N) memory — trivial at N ≤ 8. The 64-bit accumulator matters because eight near-10^9 costs overflow 32 bits. This is the resource-allocation / scheduling core behind routing requests to model tiers, packing jobs onto GPUs, or matching workers to tasks; when N grows beyond ~20 you switch to the Hungarian algorithm or a min-cost-max-flow formulation, but the objective is identical.",
  },
];
