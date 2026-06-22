// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-10",
    "title": "Recursion",
    "description": "Covers how recursive methods solve problems by reducing them to smaller subproblems, including base and recursive cases, recursive traversals, and recursive search and sort algorithms.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 210,
    "track": "apcsa",
    "unit": "Unit 10 — Recursion",
    "tags": [
      "base/recursive case",
      "recursive traversals",
      "recursive search/sort"
    ]
  },
  "lessons": [
    {
      "id": "csa-10-l1",
      "project_id": "csa-10",
      "order": 1,
      "title": "Base Case and Recursive Case",
      "explanation": "## What Is Recursion?\n\n**Recursion** is a technique where a method calls itself to solve a problem by breaking it into smaller versions of the same problem. Every correct recursive method has two essential parts.\n\n## The Two Required Cases\n\n- **Base case**: the simplest input that can be answered directly, with no further recursion. It **stops** the recursion.\n- **Recursive case**: the method calls itself on a **smaller** input, moving toward the base case.\n\nIf the base case is missing or the recursive call does not shrink the problem, the method recurses forever and Java throws a `StackOverflowError`.\n\n## A Classic Example: Factorial\n\nThe factorial of `n` is `n * (n-1) * ... * 1`, with `0! = 1`.\n\n```java\npublic static int factorial(int n) {\n    if (n <= 1) {      // base case\n        return 1;\n    }\n    return n * factorial(n - 1);  // recursive case\n}\n```\n\nWhen `factorial(4)` runs, it computes `4 * factorial(3)`, which computes `3 * factorial(2)`, and so on until `factorial(1)` returns `1` directly. The pending multiplications then resolve back up the chain: `1 -> 2 -> 6 -> 24`.\n\n## The Call Stack\n\nEach recursive call gets its own **stack frame** holding its own copy of the parameters and local variables. Frames pile up as calls are made, and they **unwind** (return values) once the base case is reached. Understanding this stacking and unwinding is key to tracing recursion by hand.\n\n## How to Design a Recursive Method\n\n- Identify the **base case** that needs no recursion.\n- Express the answer in terms of a **smaller** subproblem.\n- Ensure every recursive call moves **toward** the base case.\n\n> Tip: trust that the recursive call works correctly on the smaller input. This \"leap of faith\" lets you reason about one level at a time instead of the whole call tree.\n\nA simple sum example: the sum of `1..n` is `n + sum(n-1)`, with base case `sum(0) = 0`. The same pattern, smaller input plus a combine step, appears throughout recursion.",
      "key_terms": [
        {
          "term": "Base case",
          "definition": "The condition under which a recursive method returns a result directly without calling itself, stopping the recursion."
        },
        {
          "term": "Recursive case",
          "definition": "The part of a recursive method that calls itself on a smaller input, progressing toward the base case."
        },
        {
          "term": "Call stack",
          "definition": "The structure that stores a separate frame of parameters and local variables for each active method call; recursive calls stack up and then unwind."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What happens if a recursive method has no reachable base case?",
          "options": [
            "It returns 0 by default",
            "It recurses indefinitely and causes a StackOverflowError",
            "It runs exactly once",
            "The compiler rejects it"
          ],
          "correct_index": 1,
          "explanation": "Without a reachable base case the method keeps calling itself, the call stack grows without bound, and Java throws a StackOverflowError."
        }
      ],
      "quiz_questions": [
        {
          "question": "In factorial(n) defined as return n * factorial(n-1) with base case n <= 1 returning 1, what is the result of factorial(4)?",
          "options": [
            "12",
            "16",
            "24",
            "4"
          ],
          "correct_index": 2,
          "explanation": "4 * 3 * 2 * 1 = 24. The base case factorial(1) returns 1, then multiplications resolve back up the stack."
        },
        {
          "question": "Which property must the recursive case guarantee for the recursion to terminate?",
          "options": [
            "It must call a different method",
            "It must move the input closer to the base case",
            "It must return void",
            "It must use a loop"
          ],
          "correct_index": 1,
          "explanation": "Each recursive call must reduce the problem toward the base case; otherwise the base case is never reached and recursion never stops."
        }
      ],
      "challenge_title": "Recursive Sum to N",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int sumTo(int n) {\n        // TODO: base case n == 0 returns 0; otherwise n + sumTo(n-1)\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumTo(n));\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int sumTo(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        return n + sumTo(n - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumTo(n));\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "15"
        },
        {
          "input": "0",
          "expected_output": "0"
        },
        {
          "input": "10",
          "expected_output": "55"
        }
      ]
    },
    {
      "id": "csa-10-l2",
      "project_id": "csa-10",
      "order": 2,
      "title": "Recursive Traversals",
      "explanation": "## Traversing Data Recursively\n\nMany problems involve walking through a sequence (a `String` or an array) or building up a result one element at a time. **Recursive traversal** processes one element, then recurses on the rest of the structure.\n\n## The Pattern\n\nA recursive traversal usually looks like this:\n\n- **Base case**: the structure is empty (index reached the end, or string length is 0). Return the identity value (empty string, 0, etc.).\n- **Recursive case**: handle the current element, then combine it with the recursive result on the remainder.\n\n## Example: Reversing a String\n\n```java\npublic static String reverse(String s) {\n    if (s.length() == 0) {   // base case\n        return \"\";\n    }\n    // last char first, then reverse of the rest\n    return s.charAt(s.length() - 1) + reverse(s.substring(0, s.length() - 1));\n}\n```\n\nEach call peels off the last character and prepends it to the reversed remainder. For `\"cat\"` this produces `\"t\" + \"a\" + \"c\" = \"tac\"`.\n\n## Index-Based Traversal\n\nInstead of slicing strings (which is costly), a common AP pattern passes an **index** that advances toward a base case. A helper method carries the extra parameter:\n\n```java\npublic static int countVowels(String s, int i) {\n    if (i == s.length()) {\n        return 0;  // base case\n    }\n    char c = s.charAt(i);\n    int add = \"aeiou\".indexOf(c) >= 0 ? 1 : 0;\n    return add + countVowels(s, i + 1);\n}\n```\n\n## Key Ideas\n\n- A **helper method** with an extra parameter (like an index) is the standard way to thread state through a traversal.\n- The base case is reached when the index equals the length, meaning every element has been visited.\n- The **combine step** decides whether you are counting, summing, building a string, or filtering.\n\n> Recursive traversals mirror loops: anything a `for` loop over a structure can do, a recursive traversal can do by advancing an index and stopping at the end.",
      "key_terms": [
        {
          "term": "Recursive traversal",
          "definition": "Processing a data structure by handling one element and recursing on the remainder until an empty base case is reached."
        },
        {
          "term": "Helper method",
          "definition": "A method with extra parameters (such as an index) used to carry traversal state through recursive calls."
        },
        {
          "term": "Combine step",
          "definition": "The operation that joins the current element's contribution with the result of the recursive call on the rest of the structure."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In an index-based recursive traversal of a string, what is the typical base case?",
          "options": [
            "When the index is 0",
            "When the index equals the string length",
            "When the character is a vowel",
            "When the string is null"
          ],
          "correct_index": 1,
          "explanation": "The traversal advances the index by 1 each call; when the index equals the length, every character has been visited and recursion stops."
        }
      ],
      "quiz_questions": [
        {
          "question": "Given reverse(\"dog\") using the last-char-first pattern, what does it return?",
          "options": [
            "\"dog\"",
            "\"god\"",
            "\"odg\"",
            "\"gdo\""
          ],
          "correct_index": 1,
          "explanation": "It takes 'g' then 'o' then 'd', producing \"god\"."
        },
        {
          "question": "Why is an index-based traversal often preferred over repeated substring slicing?",
          "options": [
            "It uses no base case",
            "It avoids creating many new String objects, which is costly",
            "It cannot reach the end of the string",
            "It only works on arrays"
          ],
          "correct_index": 1,
          "explanation": "Each substring call creates a new String; passing an index advances through the same string without allocating new objects."
        }
      ],
      "challenge_title": "Count Even Digits Recursively",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    // Count how many digits of n are even (0,2,4,6,8)\n    public static int countEven(int n) {\n        // TODO: base case when n == 0; recurse on n / 10\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(countEven(n));\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int countEven(int n) {\n        if (n == 0) {\n            return 0;\n        }\n        int digit = n % 10;\n        int add = (digit % 2 == 0) ? 1 : 0;\n        return add + countEven(n / 10);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(countEven(n));\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "2468",
          "expected_output": "4"
        },
        {
          "input": "13579",
          "expected_output": "0"
        },
        {
          "input": "1234",
          "expected_output": "2"
        }
      ]
    },
    {
      "id": "csa-10-l3",
      "project_id": "csa-10",
      "order": 3,
      "title": "Recursive Search and Sort",
      "explanation": "## Recursion in Algorithms\n\nTwo of the most important AP CSA algorithms are naturally recursive: **binary search** and **merge sort**. Both follow a **divide and conquer** strategy, splitting the problem in half repeatedly.\n\n## Recursive Binary Search\n\nBinary search finds a target in a **sorted** array by examining the middle element and discarding half the array each step.\n\n```java\npublic static int bsearch(int[] a, int target, int lo, int hi) {\n    if (lo > hi) {\n        return -1;            // base case: not found\n    }\n    int mid = (lo + hi) / 2;\n    if (a[mid] == target) {\n        return mid;           // base case: found\n    } else if (a[mid] < target) {\n        return bsearch(a, target, mid + 1, hi);  // search right half\n    } else {\n        return bsearch(a, target, lo, mid - 1);  // search left half\n    }\n}\n```\n\nEach call halves the search range, giving **O(log n)** time. The two base cases are: range empty (`lo > hi`) and target found.\n\n## Merge Sort\n\n**Merge sort** sorts by recursively splitting the array into halves, sorting each half, and **merging** the sorted halves back together.\n\n- **Base case**: an array (or subarray) of length 0 or 1 is already sorted.\n- **Recursive case**: split in half, sort each half recursively, then merge.\n\nMerge sort runs in **O(n log n)** time because there are `log n` levels of splitting and each level does `O(n)` work to merge.\n\n## Why Recursion Fits\n\n- Each problem is expressed in terms of **smaller subproblems** of the same kind.\n- The base case (empty range, single element) is trivial.\n- The combine step (choosing a half, or merging) assembles the answer.\n\n> Divide and conquer is the recursive heart of efficient searching and sorting: split, solve the pieces, combine.\n\nTracing these by hand on small arrays is a common exam task, so practice following the `lo`, `hi`, and `mid` values through each call.",
      "key_terms": [
        {
          "term": "Binary search",
          "definition": "A recursive O(log n) search on a sorted array that compares the middle element to the target and discards half the range each step."
        },
        {
          "term": "Merge sort",
          "definition": "A recursive O(n log n) divide-and-conquer sort that splits the array in half, sorts each half, and merges the sorted halves."
        },
        {
          "term": "Divide and conquer",
          "definition": "An algorithmic strategy that breaks a problem into smaller subproblems of the same type, solves them recursively, and combines the results."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What must be true of the array for binary search to work correctly?",
          "options": [
            "It must be empty",
            "It must be sorted",
            "It must contain only even numbers",
            "It must have an odd length"
          ],
          "correct_index": 1,
          "explanation": "Binary search relies on order to decide which half to discard; on an unsorted array its comparisons are meaningless."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the time complexity of recursive binary search on a sorted array of n elements?",
          "options": [
            "O(n)",
            "O(log n)",
            "O(n^2)",
            "O(1)"
          ],
          "correct_index": 1,
          "explanation": "Each recursive call halves the search range, so the number of steps grows logarithmically with n."
        },
        {
          "question": "Which is the base case of merge sort?",
          "options": [
            "An array with all equal elements",
            "A subarray of length 0 or 1",
            "A subarray of length n",
            "A sorted full array"
          ],
          "correct_index": 1,
          "explanation": "A subarray of length 0 or 1 is already sorted, so it returns without further splitting."
        }
      ],
      "challenge_title": "Recursive Binary Search Index",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int bsearch(int[] a, int target, int lo, int hi) {\n        // TODO: base cases (lo > hi returns -1; found returns mid), then recurse on a half\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(bsearch(a, target, 0, n - 1));\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int bsearch(int[] a, int target, int lo, int hi) {\n        if (lo > hi) {\n            return -1;\n        }\n        int mid = (lo + hi) / 2;\n        if (a[mid] == target) {\n            return mid;\n        } else if (a[mid] < target) {\n            return bsearch(a, target, mid + 1, hi);\n        } else {\n            return bsearch(a, target, lo, mid - 1);\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(bsearch(a, target, 0, n - 1));\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n1 3 5 7 9\n7",
          "expected_output": "3"
        },
        {
          "input": "5\n1 3 5 7 9\n4",
          "expected_output": "-1"
        },
        {
          "input": "6\n2 4 6 8 10 12\n2",
          "expected_output": "0"
        }
      ]
    }
  ]
}
