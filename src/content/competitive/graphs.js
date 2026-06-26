
export default [
  {
    id: "cp-graphs-1",
    title: "Knowledge Graph Hops",
    slug: "knowledge-graph-hops",
    topic: "graphs",
    difficulty: "easy",
    algorithm_focus: "Breadth-first search / shortest hop distance in an unweighted graph",
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    tags: ["bfs", "graph", "shortest-path", "knowledge-graph"],
    story:
      "Your retrieval-augmented assistant stores facts as a **knowledge graph**: each entity is a node, and an edge means two entities are directly related (\"Paris\" — \"France\", \"France\" — \"Europe\"). To answer a multi-hop question, the assistant walks from one entity to another along these relations. The fewer hops between two entities, the tighter their connection.\n\nGiven the graph, find the **minimum number of hops** to travel from a source entity to a target entity. Because every edge counts the same, this is a textbook **breadth-first search**.",
    statement:
      "You are given an undirected knowledge graph with `N` entities (numbered `0..N-1`) and `M` relations. Each relation connects two entities and can be traversed in either direction. Given a `source` entity and a `target` entity, output the **smallest number of edges** on any path from `source` to `target`.\n\nIf `source == target`, the distance is `0`. If the target cannot be reached from the source, output `-1`.",
    input_format:
      "Line 1: two integers `N M` — the number of entities and the number of relations.\nNext `M` lines: each contains two integers `u v` meaning there is an undirected edge between entity `u` and entity `v`.\nLast line: two integers `source target`.",
    output_format:
      "Print a single integer: the minimum number of hops from `source` to `target`, or `-1` if `target` is unreachable.",
    constraints: [
      "1 ≤ N ≤ 200000",
      "0 ≤ M ≤ 400000",
      "0 ≤ u, v, source, target < N",
      "the graph may be disconnected and may contain parallel edges or self-loops",
    ],
    examples: [
      {
        input: "6 5\n0 1\n1 2\n2 3\n0 4\n4 5\n0 3",
        output: "3",
        explanation:
          "The shortest route from 0 to 3 is 0 → 1 → 2 → 3, which uses 3 edges. No shorter path exists.",
      },
      {
        input: "5 2\n0 1\n2 3\n0 4",
        output: "-1",
        explanation:
          "There are 5 entities but only 2 edges (0–1 and 2–3); the last line `0 4` is the query. Entity 4 has no edges at all, so it is isolated and cannot be reached from entity 0. The answer is -1.",
      },
    ],
    notes:
      "BFS explores the graph in layers, so the first time you reach a node you have already found its shortest hop count. Use an explicit queue and a `dist` array initialized to `-1` (meaning unvisited); set `dist[source] = 0` before you start. Build an adjacency list, not an adjacency matrix — `N` can be large.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    // TODO: build an adjacency list from the M undirected edges.\n    // Read source and target, then run BFS and print dist[target] (or -1).\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    vector<vector<int>> adj(N);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        cin >> u >> v;\n        adj[u].push_back(v);\n        adj[v].push_back(u);\n    }\n    int src, dst;\n    cin >> src >> dst;\n\n    vector<int> dist(N, -1);\n    queue<int> q;\n    dist[src] = 0;\n    q.push(src);\n    while (!q.empty()) {\n        int u = q.front();\n        q.pop();\n        for (int w : adj[u]) {\n            if (dist[w] == -1) {\n                dist[w] = dist[u] + 1;\n                q.push(w);\n            }\n        }\n    }\n    cout << dist[dst] << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "6 5\n0 1\n1 2\n2 3\n0 4\n4 5\n0 3", expected_output: "3" },
      { input: "5 2\n0 1\n2 3\n0 4", expected_output: "-1" },
      { input: "4 3\n0 1\n1 2\n2 3\n2 2", expected_output: "0" },
    ],
    editorial:
      "Breadth-first search visits nodes in order of increasing distance from the source, so the moment a node is dequeued for the first time its recorded distance is already optimal. Initializing `dist` to `-1` does double duty: it marks unvisited nodes and provides the exact answer for unreachable targets. The whole search is O(N + M) because each node and edge is processed once. This is precisely how a knowledge-graph reasoner measures \"relational closeness\" between entities, and the layered expansion is the unweighted special case of Dijkstra's algorithm — when every edge weight is 1, a plain queue replaces the priority queue.",
  },
  {
    id: "cp-graphs-2",
    title: "Retrieval Graph Cost",
    slug: "retrieval-graph-cost",
    topic: "graphs",
    difficulty: "medium",
    algorithm_focus: "Dijkstra's algorithm / shortest weighted path with a min-heap",
    time_limit_ms: 1500,
    memory_limit_mb: 256,
    tags: ["dijkstra", "graph", "shortest-path", "priority-queue", "retrieval"],
    story:
      "A vector-retrieval system links chunks of a document corpus into a **similarity graph**. Each edge carries a positive integer **cost** — how expensive it is to \"jump\" between two chunks (lower cost = more similar). To assemble context for an answer, the system hops from a starting chunk to a goal chunk along the cheapest possible route.\n\nWith non-negative edge weights, the cheapest route is found by **Dijkstra's algorithm**: always expand the frontier node with the smallest known cost so far, using a min-heap.",
    statement:
      "You are given an undirected similarity graph with `N` chunks (numbered `0..N-1`) and `M` weighted edges. Each edge `(u, v, w)` means chunks `u` and `v` are connected with traversal cost `w` (a positive integer), traversable in either direction. Given a `source` chunk and a `target` chunk, output the **minimum total cost** of any path from `source` to `target`.\n\nIf `source == target` the cost is `0`. If the target is unreachable, output `-1`.",
    input_format:
      "Line 1: two integers `N M`.\nNext `M` lines: each contains three integers `u v w` — an undirected edge between `u` and `v` with cost `w`.\nLast line: two integers `source target`.",
    output_format:
      "Print a single integer: the minimum total path cost from `source` to `target`, or `-1` if `target` is unreachable.",
    constraints: [
      "1 ≤ N ≤ 100000",
      "0 ≤ M ≤ 300000",
      "1 ≤ w ≤ 10^9",
      "0 ≤ u, v, source, target < N",
      "the graph may be disconnected; multiple edges between the same pair may exist",
    ],
    examples: [
      {
        input: "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0 4",
        output: "7",
        explanation:
          "The cheapest route is 0 → 2 (1) → 1 (2) → 3 (1) → 4 (3) for a total of 7. The direct-looking 0 → 1 edge costs 4, which is worse than going through chunk 2.",
      },
      {
        input: "3 3\n0 1 10\n1 2 10\n0 2 5\n0 2",
        output: "5",
        explanation:
          "The single edge 0 → 2 costs 5, cheaper than the two-hop route 0 → 1 → 2 costing 20.",
      },
    ],
    notes:
      "Use `long long` for distances: with up to 10^5 edges each weighted 10^9, a path can exceed the range of a 32-bit int. Push `(distance, node)` pairs into a min-heap (`priority_queue` with `greater<>`), and skip any popped entry whose stored distance is stale (greater than the best distance already recorded for that node).",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    // TODO: build a weighted adjacency list from the M undirected edges.\n    // Run Dijkstra from source with a min-heap, then print dist[target] or -1.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    vector<vector<pair<int, long long>>> adj(N);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        long long w;\n        cin >> u >> v >> w;\n        adj[u].push_back({v, w});\n        adj[v].push_back({u, w});\n    }\n    int src, dst;\n    cin >> src >> dst;\n\n    const long long INF = LLONG_MAX;\n    vector<long long> dist(N, INF);\n    priority_queue<pair<long long, int>, vector<pair<long long, int>>,\n                   greater<pair<long long, int>>> pq;\n    dist[src] = 0;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top();\n        pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    cout << (dist[dst] == INF ? -1 : dist[dst]) << \"\\n\";\n    return 0;\n}\n",
    test_cases: [
      { input: "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0 4", expected_output: "7" },
      { input: "4 2\n0 1 5\n2 3 7\n0 3", expected_output: "-1" },
      { input: "3 3\n0 1 10\n1 2 10\n0 2 5\n0 2", expected_output: "5" },
    ],
    editorial:
      "Dijkstra's algorithm grows a shortest-path tree by repeatedly settling the unsettled node with the smallest tentative distance. With a binary heap the cost is O((N + M) log N). The correctness hinges on non-negative weights: once a node is popped with its minimum distance, no later (necessarily longer) path can improve it. The 'lazy deletion' trick — pushing duplicates and discarding stale pops with `if (d > dist[u]) continue;` — avoids needing a decrease-key operation. In a real retrieval pipeline these edge costs come from embedding distances, and the cheapest path corresponds to the most semantically coherent chain of context chunks.",
  },
  {
    id: "cp-graphs-3",
    title: "Compute DAG Scheduling",
    slug: "compute-dag-scheduling",
    topic: "graphs",
    difficulty: "hard",
    algorithm_focus: "Topological sort via Kahn's algorithm with a min-heap for lexicographic order",
    time_limit_ms: 1500,
    memory_limit_mb: 256,
    tags: ["topological-sort", "dag", "kahn", "priority-queue", "scheduling"],
    story:
      "A neural network's forward pass is a **directed acyclic graph** of compute steps: a layer can only run once all the layers feeding into it have produced their outputs. The scheduler must pick a linear order in which to execute the steps that respects every dependency — a **topological order**.\n\nWhen several steps are simultaneously ready, the scheduler breaks ties by smallest step ID for deterministic, reproducible runs. This means you must output the **lexicographically smallest** valid topological order. And if the dependency graph accidentally contains a **cycle**, no valid order exists at all.",
    statement:
      "You are given a directed graph of `N` compute steps (numbered `0..N-1`) with `M` dependency edges. A directed edge `u → v` means step `u` must run **before** step `v`.\n\nOutput the **lexicographically smallest** topological ordering of all `N` steps: whenever more than one step has all of its prerequisites already scheduled, choose the one with the **smallest index** next. If the graph contains a cycle (so no topological order exists), output the single word `CYCLE` instead.",
    input_format:
      "Line 1: two integers `N M`.\nNext `M` lines: each contains two integers `u v`, a directed edge `u → v` (step `u` must precede step `v`).",
    output_format:
      "If a topological order exists, print the `N` step indices of the lexicographically smallest valid order, space-separated, on one line.\nOtherwise print `CYCLE`.",
    constraints: [
      "1 ≤ N ≤ 200000",
      "0 ≤ M ≤ 400000",
      "0 ≤ u, v < N",
      "edges are directed; the graph may contain duplicate edges",
    ],
    examples: [
      {
        input: "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1",
        output: "4 5 0 2 3 1",
        explanation:
          "Steps 4 and 5 have no prerequisites; the smaller index 4 goes first, then 5. Removing them frees 0 and 2, so 0 is scheduled, then 2, then 3 (freed by 2), and finally 1 (which needed both 4 and 3).",
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "CYCLE",
        explanation:
          "0 → 1 → 2 → 0 forms a cycle, so no step can ever be the first to run. No valid order exists.",
      },
    ],
    notes:
      "Use **Kahn's algorithm**: repeatedly remove a node with in-degree 0. To get the lexicographically smallest order, store the ready (in-degree 0) nodes in a **min-heap** (`priority_queue` with `greater<>`) and always pop the smallest. If you finish and have emitted fewer than `N` nodes, a cycle blocked the rest, so print `CYCLE`.",
    starter_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    // TODO: build an adjacency list and an in-degree array.\n    // Run Kahn's algorithm with a min-heap of ready nodes.\n    // Print the order, or \"CYCLE\" if fewer than N nodes are emitted.\n\n    return 0;\n}\n",
    solution_cpp:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    cin >> N >> M;\n    vector<vector<int>> adj(N);\n    vector<int> indeg(N, 0);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        cin >> u >> v;\n        adj[u].push_back(v);\n        indeg[v]++;\n    }\n\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < N; i++)\n        if (indeg[i] == 0) pq.push(i);\n\n    vector<int> order;\n    while (!pq.empty()) {\n        int u = pq.top();\n        pq.pop();\n        order.push_back(u);\n        for (int v : adj[u]) {\n            if (--indeg[v] == 0) pq.push(v);\n        }\n    }\n\n    if ((int)order.size() != N) {\n        cout << \"CYCLE\\n\";\n        return 0;\n    }\n    for (int i = 0; i < N; i++)\n        cout << order[i] << (i + 1 < N ? ' ' : '\\n');\n    return 0;\n}\n",
    test_cases: [
      { input: "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1", expected_output: "4 5 0 2 3 1" },
      { input: "3 3\n0 1\n1 2\n2 0", expected_output: "CYCLE" },
      { input: "4 2\n0 1\n0 2", expected_output: "0 1 2 3" },
    ],
    editorial:
      "Kahn's algorithm builds a topological order by repeatedly emitting a node whose in-degree has dropped to zero — every prerequisite already placed. Using a plain queue gives *some* valid order in O(N + M); swapping the queue for a min-heap forces the lexicographically smallest one, at a cost of O((N + M) log N). The cycle check is free: a directed acyclic graph always lets you drain all N nodes, so if the emitted count falls short, the leftover nodes sit inside a cycle that can never reach in-degree 0. This is exactly how ML compilers and dataflow schedulers (TensorFlow, PyTorch's autograd engine, build systems) linearize a dependency DAG before execution.",
  },
];
