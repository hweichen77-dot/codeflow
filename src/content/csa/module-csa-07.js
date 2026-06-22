// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-07",
    "title": "ArrayList",
    "description": "Covers the ArrayList class, its core methods, traversal techniques, safe add/remove during iteration, and common list algorithms in Java.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 207,
    "track": "apcsa",
    "unit": "Unit 7 — ArrayList",
    "tags": [
      "ArrayList methods",
      "traversals",
      "algorithms"
    ]
  },
  "lessons": [
    {
      "id": "csa-07-l1",
      "project_id": "csa-07",
      "order": 1,
      "title": "ArrayList Basics and Methods",
      "explanation": "## What Is an ArrayList?\n\nAn **ArrayList** is a resizable list from `java.util`. Unlike a plain array, it grows and shrinks automatically as you add or remove elements, so you never fix the size up front. On the AP CSA exam, `ArrayList` is the only dynamic collection you must know.\n\nBecause an `ArrayList` can only store **objects**, you use **wrapper classes** for primitives: `Integer` for `int`, `Double` for `double`, `Boolean` for `boolean`. Autoboxing converts between them silently.\n\n```java\nimport java.util.*;\n\nArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(10);        // autoboxes int -> Integer\nnums.add(20);\nint first = nums.get(0); // unboxes Integer -> int\n```\n\n## The AP Subset Methods\n\nThese are the **only** `ArrayList` methods tested on the AP exam:\n\n- `int size()` — number of elements.\n- `boolean add(E obj)` — appends `obj` to the end; returns `true`.\n- `void add(int index, E obj)` — inserts at `index`, shifting later elements right.\n- `E get(int index)` — returns the element at `index`.\n- `E set(int index, E obj)` — replaces the element at `index`, returning the old value.\n- `E remove(int index)` — removes and returns the element at `index`, shifting later elements left.\n\n## Indices and Shifting\n\nValid indices run from `0` to `size() - 1`. An out-of-range index throws an `IndexOutOfBoundsException`. The key behavior to remember is **shifting**:\n\n- `add(index, obj)` and `remove(index)` shift every later element by one position.\n- `set` does **not** shift; it just overwrites one slot.\n\n```java\nArrayList<String> list = new ArrayList<String>();\nlist.add(\"a\");           // [a]\nlist.add(\"c\");           // [a, c]\nlist.add(1, \"b\");        // [a, b, c]\nlist.set(0, \"A\");        // [A, b, c]\nString gone = list.remove(2); // [A, b], gone = \"c\"\nSystem.out.println(list.size()); // 2\n```\n\nNote that `add(obj)` returns a `boolean` while `add(index, obj)` returns `void` — a common exam trap. Master `size`, `get`, `set`, `add`, and `remove`, and you can manipulate any list.",
      "challenge_title": "Build and Report a List",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        // TODO: read n integers, add each to the list,\n        // then print the size and the last element\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        System.out.println(list.size());\n        System.out.println(list.get(list.size() - 1));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\n5 8 2",
          "expected_output": "3\n2"
        },
        {
          "input": "1\n42",
          "expected_output": "1\n42"
        },
        {
          "input": "5\n10 20 30 40 50",
          "expected_output": "5\n50"
        }
      ],
      "key_terms": [
        {
          "term": "ArrayList",
          "definition": "A resizable list class in java.util that grows and shrinks automatically and stores object references."
        },
        {
          "term": "Wrapper class",
          "definition": "An object form of a primitive (Integer, Double, Boolean) required because an ArrayList can only hold objects."
        },
        {
          "term": "Shifting",
          "definition": "The automatic movement of later elements by one position when add(index, obj) or remove(index) is called."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After `list.add(1, \"X\")` on a list `[a, b, c]`, what does the list become?",
          "options": [
            "[a, X, b, c]",
            "[X, a, b, c]",
            "[a, b, X, c]",
            "[a, X, c]"
          ],
          "correct_index": 0,
          "explanation": "add(index, obj) inserts X at index 1 and shifts b and c right, giving [a, X, b, c]."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which method replaces an element without changing the list's size?",
          "options": [
            "add(index, obj)",
            "remove(index)",
            "set(index, obj)",
            "add(obj)"
          ],
          "correct_index": 2,
          "explanation": "set(index, obj) overwrites one slot and returns the old value; it does not shift or change size."
        },
        {
          "question": "Why must you write `ArrayList<Integer>` instead of `ArrayList<int>`?",
          "options": [
            "int is too large to store",
            "ArrayList can only store objects, so primitives need wrapper classes",
            "int is not a valid Java type",
            "ArrayList requires final types"
          ],
          "correct_index": 1,
          "explanation": "ArrayList stores object references, so the wrapper class Integer is used; autoboxing converts int to Integer automatically."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-07-l2",
      "project_id": "csa-07",
      "order": 2,
      "title": "Traversing an ArrayList",
      "explanation": "## Two Ways to Traverse\n\nThere are two standard ways to visit every element of an `ArrayList` on the AP exam: an **indexed for loop** and an **enhanced for loop** (for-each).\n\n### Indexed For Loop\n\nUse a counter from `0` to `size() - 1` and call `get(i)`. This gives you access to the **index**, which you need when you must `set`, `remove`, or compare positions.\n\n```java\nimport java.util.*;\n\nArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(3); nums.add(7); nums.add(1);\nint sum = 0;\nfor (int i = 0; i < nums.size(); i++) {\n    sum += nums.get(i);\n}\nSystem.out.println(sum); // 11\n```\n\n### Enhanced For Loop\n\nThe **enhanced for loop** reads each element directly without an index. It is cleaner when you only need to *read* values.\n\n```java\nint sum = 0;\nfor (int val : nums) {\n    sum += val;\n}\n```\n\n## Choosing the Right Loop\n\n- Need the **index** (for `set`, comparing neighbors, or position output)? Use the **indexed loop**.\n- Only **reading** each value? The **enhanced for loop** is simpler and avoids off-by-one errors.\n\n## A Critical Warning\n\nYou must **never** modify the structure of a list (using `add` or `remove`) inside an enhanced for loop. Doing so throws a `ConcurrentModificationException` at runtime. Changing an element with `set` is allowed, but `set` cannot be done through the loop variable alone — the loop variable is a copy, so reassigning it does nothing to the list:\n\n```java\nfor (int val : nums) {\n    val = val * 2;   // does NOT change the list!\n}\n```\n\nTo actually double each value you need indices:\n\n```java\nfor (int i = 0; i < nums.size(); i++) {\n    nums.set(i, nums.get(i) * 2);\n}\n```\n\n## Bounds Matter\n\nThe condition `i < nums.size()` (not `<=`) keeps you in range. Calling `size()` each iteration is safe and reflects the current length, which matters once you start adding or removing elements.",
      "challenge_title": "Sum the Even Values",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        // TODO: traverse the list and print the sum of all even values\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        int sum = 0;\n        for (int val : list) {\n            if (val % 2 == 0) {\n                sum += val;\n            }\n        }\n        System.out.println(sum);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 5",
          "expected_output": "6"
        },
        {
          "input": "4\n10 20 30 40",
          "expected_output": "100"
        },
        {
          "input": "3\n1 3 5",
          "expected_output": "0"
        }
      ],
      "key_terms": [
        {
          "term": "Enhanced for loop",
          "definition": "A for-each loop that reads each element of a list directly without using an index variable."
        },
        {
          "term": "Indexed traversal",
          "definition": "Looping with a counter from 0 to size()-1 and using get(i) so the index is available for set, remove, or comparisons."
        },
        {
          "term": "ConcurrentModificationException",
          "definition": "A runtime error thrown when a list's structure is changed with add or remove during an enhanced for loop."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What happens when you write `for (int val : nums) { val = val * 2; }`?",
          "options": [
            "Every element in nums is doubled",
            "The list is unchanged because val is a copy",
            "It throws a ConcurrentModificationException",
            "It only doubles the first element"
          ],
          "correct_index": 1,
          "explanation": "The loop variable val is a copy of each element, so reassigning it does not affect the list. Use set with an index to modify."
        }
      ],
      "quiz_questions": [
        {
          "question": "When should you prefer an indexed for loop over an enhanced for loop?",
          "options": [
            "When you only need to read values",
            "When you need the index to call set or compare positions",
            "When the list is empty",
            "When the list contains Strings"
          ],
          "correct_index": 1,
          "explanation": "The indexed loop exposes i, which is required for set, remove, or comparing elements by position."
        },
        {
          "question": "Which loop bound correctly traverses every valid index of an ArrayList?",
          "options": [
            "i <= list.size()",
            "i < list.size()",
            "i < list.size() - 1",
            "i <= list.size() - 2"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 through size()-1, so the condition i < list.size() visits each one exactly once."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-07-l3",
      "project_id": "csa-07",
      "order": 3,
      "title": "Add and Remove During Traversal and List Algorithms",
      "explanation": "## Modifying While Traversing\n\nThe trickiest part of `ArrayList` is **removing during a traversal**. Because `remove(index)` shifts every later element left, a naive indexed loop can **skip** elements.\n\n```java\n// BUGGY: skips elements after a removal\nfor (int i = 0; i < list.size(); i++) {\n    if (list.get(i) % 2 == 0) {\n        list.remove(i); // next element slides into index i, then i++ skips it\n    }\n}\n```\n\n### Fix 1: Don't Increment After Removing\n\nWhen you remove at index `i`, the next element now sits at `i`, so re-examine it:\n\n```java\nint i = 0;\nwhile (i < list.size()) {\n    if (list.get(i) % 2 == 0) {\n        list.remove(i);   // do NOT advance i\n    } else {\n        i++;\n    }\n}\n```\n\n### Fix 2: Traverse Backwards\n\nLooping from the end means a removal only shifts elements you have **already** visited, so nothing is skipped:\n\n```java\nfor (int i = list.size() - 1; i >= 0; i--) {\n    if (list.get(i) % 2 == 0) {\n        list.remove(i);\n    }\n}\n```\n\n## Adding During Traversal\n\nInserting with `add(index, obj)` also shifts elements right. To insert without re-processing the new element, advance the index past it. Backward traversal is again the safest pattern for structural changes.\n\n## Common List Algorithms\n\nThe AP exam expects you to implement these from scratch:\n\n- **Finding** a maximum or minimum by tracking the best value seen so far.\n- **Counting** elements that satisfy a condition.\n- **Inserting or removing** elements to keep a list ordered or filtered.\n- **Reversing** or shifting elements.\n\n```java\n// Find the maximum value\nint max = list.get(0);\nfor (int i = 1; i < list.size(); i++) {\n    if (list.get(i) > max) {\n        max = list.get(i);\n    }\n}\n```\n\n**Key takeaways:** never use an enhanced for loop when adding or removing, and when you delete inside an indexed loop, either skip the increment or iterate backwards.",
      "challenge_title": "Remove All Negatives",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        // TODO: remove every negative number, then print the\n        // remaining values space-separated on one line\n        // (print an empty line if none remain)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        for (int i = list.size() - 1; i >= 0; i--) {\n            if (list.get(i) < 0) {\n                list.remove(i);\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            if (i > 0) {\n                sb.append(\" \");\n            }\n            sb.append(list.get(i));\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 -1 4 -2 5",
          "expected_output": "3 4 5"
        },
        {
          "input": "4\n-1 -2 -3 -4",
          "expected_output": ""
        },
        {
          "input": "6\n1 2 -3 4 -5 6",
          "expected_output": "1 2 4 6"
        }
      ],
      "key_terms": [
        {
          "term": "Backward traversal",
          "definition": "Looping from the last index to the first so that removals only shift already-visited elements, preventing skipped items."
        },
        {
          "term": "Skipped element bug",
          "definition": "An error where removing at index i in a forward loop causes the next element to be passed over because it slides into index i before i increments."
        },
        {
          "term": "List algorithm",
          "definition": "A standard procedure such as finding a max, counting matches, or filtering that you implement by traversing the list."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does looping backwards make removal safe?",
          "options": [
            "It runs faster than a forward loop",
            "A removal only shifts elements already visited, so none are skipped",
            "It avoids using the remove method",
            "Backwards loops cannot throw exceptions"
          ],
          "correct_index": 1,
          "explanation": "Removing at index i shifts elements after i left, but going backwards those are elements you have already processed, so nothing is missed."
        }
      ],
      "quiz_questions": [
        {
          "question": "In a forward indexed loop, what should you do after calling remove(i)?",
          "options": [
            "Always increment i",
            "Not increment i so the shifted element is re-checked",
            "Restart the loop from 0",
            "Call size() to reset the loop"
          ],
          "correct_index": 1,
          "explanation": "After remove(i), the next element slides into index i, so you must re-examine i by not incrementing it."
        },
        {
          "question": "Which loop type must you avoid when removing elements from a list?",
          "options": [
            "Indexed for loop",
            "While loop",
            "Enhanced for loop",
            "Backward for loop"
          ],
          "correct_index": 2,
          "explanation": "Structurally modifying a list inside an enhanced for loop throws a ConcurrentModificationException."
        }
      ],
      "xp_reward": 100
    }
  ]
}
