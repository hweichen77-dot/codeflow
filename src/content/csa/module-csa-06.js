// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-06",
    "title": "Array",
    "description": "This unit covers one-dimensional arrays in Java, including declaration, traversal, and the standard algorithms used to process array data.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 206,
    "track": "apcsa",
    "unit": "Unit 6 — Array",
    "tags": [
      "1D arrays",
      "traversals",
      "standard algorithms over arrays"
    ]
  },
  "lessons": [
    {
      "id": "csa-06-l1",
      "project_id": "csa-06",
      "order": 1,
      "title": "One-Dimensional Arrays",
      "explanation": "## What Is an Array?\n\nAn **array** is a fixed-size container that stores multiple values of the **same type** in contiguous memory. Instead of declaring `int a, b, c;`, you declare one array that holds many `int` values, each reachable by an **index**.\n\nIn Java, arrays are **objects**. The variable holds a *reference* to the array, not the data itself.\n\n## Declaring and Creating Arrays\n\nThere are two common ways to make an array:\n\n```java\n// 1. Create with a size, default-filled values\nint[] scores = new int[5];   // {0, 0, 0, 0, 0}\n\n// 2. Create with an initializer list\nint[] primes = {2, 3, 5, 7, 11};\n```\n\nKey points about creation:\n\n- `new int[5]` makes an array of length 5 with **default values**: `0` for numeric types, `false` for `boolean`, `null` for object types.\n- The **length** of an array is fixed once created and cannot change.\n- You read the size with the `.length` field (no parentheses): `scores.length`.\n\n## Indexing\n\nArray indices start at **0** and run to `length - 1`.\n\n```java\nint[] nums = {10, 20, 30};\nSystem.out.println(nums[0]);   // 10\nnums[2] = 99;                  // change last element\nSystem.out.println(nums[2]);   // 99\n```\n\nAccessing an index outside the valid range throws an **ArrayIndexOutOfBoundsException** at runtime. For `nums` above, valid indices are `0`, `1`, `2`; `nums[3]` crashes.\n\n## Reference Semantics\n\nBecause arrays are objects, assigning one array variable to another copies the **reference**, not the contents:\n\n```java\nint[] a = {1, 2, 3};\nint[] b = a;     // b points to SAME array\nb[0] = 99;\nSystem.out.println(a[0]); // 99 -- a changed too\n```\n\nThis aliasing behavior is a frequent AP exam topic. To truly copy data you must create a new array and copy element by element.\n\n## Why Arrays Matter\n\nArrays let you store and process **collections** of data with a single variable name, enabling loops to do repetitive work efficiently. They are the foundation for almost every algorithm you will write next.",
      "challenge_title": "Build and Read an Array",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        // TODO: read n integers into arr, then print the first and last elements\n        // on one line separated by a space\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        System.out.println(arr[0] + \" \" + arr[n - 1]);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n10 20 30 40 50",
          "expected_output": "10 50"
        },
        {
          "input": "1\n7",
          "expected_output": "7 7"
        },
        {
          "input": "3\n-4 0 9",
          "expected_output": "-4 9"
        }
      ],
      "key_terms": [
        {
          "term": "Index",
          "definition": "The integer position of an element in an array, starting at 0 and ending at length - 1."
        },
        {
          "term": "length",
          "definition": "A public final field of every array that gives the number of elements; accessed as arr.length with no parentheses."
        },
        {
          "term": "Reference semantics",
          "definition": "Because arrays are objects, assigning one array variable to another copies the reference, so both variables point to the same underlying data."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does new int[4] produce?",
          "options": [
            "An array of 4 elements all equal to 0",
            "An array of 4 elements all equal to null",
            "A compile error because no values are given",
            "An array of length 5"
          ],
          "correct_index": 0,
          "explanation": "new int[4] creates an int array of length 4 with the default numeric value 0 in every slot."
        }
      ],
      "quiz_questions": [
        {
          "question": "For int[] a = {3, 6, 9, 12}; which expression gives the last element using a.length?",
          "options": [
            "a[a.length]",
            "a[a.length - 1]",
            "a[length - 1]",
            "a.last()"
          ],
          "correct_index": 1,
          "explanation": "Valid indices run 0 to length-1, so the last element is a[a.length - 1]. Using a.length directly is out of bounds."
        },
        {
          "question": "After int[] a = {1,2,3}; int[] b = a; b[1] = 50; what is a[1]?",
          "options": [
            "2",
            "50",
            "0",
            "A compile error occurs"
          ],
          "correct_index": 1,
          "explanation": "b = a copies the reference, not the data, so a and b are the same array. Changing b[1] also changes a[1] to 50."
        }
      ]
    },
    {
      "id": "csa-06-l2",
      "project_id": "csa-06",
      "order": 2,
      "title": "Traversing Arrays",
      "explanation": "## Walking Through Every Element\n\n**Traversal** means visiting each element of an array, usually in order, to read or modify it. Two loop styles dominate AP CSA.\n\n## The Indexed for Loop\n\nThe standard `for` loop gives you the **index**, which you need when you must know the position or change elements.\n\n```java\nint[] nums = {4, 8, 15, 16, 23};\nfor (int i = 0; i < nums.length; i++) {\n    System.out.println(\"Index \" + i + \" = \" + nums[i]);\n}\n```\n\nNote the bound is `i < nums.length`. Using `<=` would read `nums[length]`, which is **out of bounds** and throws `ArrayIndexOutOfBoundsException`. These off-by-one errors are extremely common.\n\nBecause you have the index, this loop can **modify** elements:\n\n```java\nfor (int i = 0; i < nums.length; i++) {\n    nums[i] = nums[i] * 2;   // double each value in place\n}\n```\n\n## The Enhanced for Loop (for-each)\n\nThe **enhanced for loop** reads each element directly into a loop variable. It is cleaner when you only need to *read* values and do not care about the index.\n\n```java\nint sum = 0;\nfor (int value : nums) {\n    sum += value;\n}\nSystem.out.println(sum);\n```\n\nImportant limitations of the enhanced for loop:\n\n- The loop variable is a **copy** of each element. Assigning to it does **not** change the array.\n- You cannot access the index, and you cannot easily compare adjacent elements.\n- You should not use it to add or remove elements (arrays are fixed-size anyway).\n\n```java\nfor (int value : nums) {\n    value = 0;   // does NOTHING to the array\n}\n```\n\n## Choosing a Loop\n\n| Need | Use |\n|------|-----|\n| Read each element only | enhanced for |\n| Modify elements | indexed for |\n| Know the position | indexed for |\n| Look at pairs of elements | indexed for |\n\n## Bounds Safety\n\nAlways traverse from `0` up to `length - 1`. When in doubt, write the condition as `i < arr.length`. Mastering clean traversal sets you up for the standard algorithms in the next lesson.",
      "challenge_title": "Sum and Maximum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // TODO: print the sum and the maximum on one line separated by a space\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int sum = 0;\n        int max = arr[0];\n        for (int value : arr) {\n            sum += value;\n            if (value > max) max = value;\n        }\n        System.out.println(sum + \" \" + max);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 5",
          "expected_output": "15 5"
        },
        {
          "input": "4\n-1 -7 -3 -2",
          "expected_output": "-13 -1"
        },
        {
          "input": "1\n42",
          "expected_output": "42 42"
        }
      ],
      "key_terms": [
        {
          "term": "Traversal",
          "definition": "The process of visiting every element of an array, typically in index order, to read or update each value."
        },
        {
          "term": "Enhanced for loop",
          "definition": "A for-each loop of the form for (Type x : arr) that copies each element into x; ideal for read-only access but cannot modify the array."
        },
        {
          "term": "Off-by-one error",
          "definition": "A common bug where a loop bound is wrong by one, such as using i <= arr.length and reading past the end of the array."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Inside for (int v : arr) { v = 0; }, what happens to the array?",
          "options": [
            "Every element becomes 0",
            "Nothing changes because v is a copy",
            "A compile error occurs",
            "Only the first element becomes 0"
          ],
          "correct_index": 1,
          "explanation": "The enhanced for loop variable holds a copy of each element, so assigning to it does not affect the array contents."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which loop condition correctly traverses every valid index of arr without going out of bounds?",
          "options": [
            "i <= arr.length",
            "i < arr.length",
            "i < arr.length + 1",
            "i <= arr.length - 0"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 to length-1, so the condition must stop before length: i < arr.length."
        },
        {
          "question": "You need to double every element of an int array in place. Which loop works?",
          "options": [
            "An enhanced for loop: for (int v : arr) v = v * 2;",
            "An indexed for loop: for (int i=0;i<arr.length;i++) arr[i] = arr[i]*2;",
            "Both work equally",
            "Neither can modify an array"
          ],
          "correct_index": 1,
          "explanation": "Only the indexed loop can write back into the array via arr[i]; the enhanced loop modifies a copy and leaves the array unchanged."
        }
      ]
    },
    {
      "id": "csa-06-l3",
      "project_id": "csa-06",
      "order": 3,
      "title": "Standard Array Algorithms",
      "explanation": "## Reusable Patterns\n\nMany problems boil down to a handful of **standard algorithms** over arrays. Recognizing the pattern lets you write correct code quickly. All of them are single traversals.\n\n## Accumulation: Sum, Count, Average\n\nKeep a running total or counter as you traverse.\n\n```java\nint sum = 0, evens = 0;\nfor (int v : arr) {\n    sum += v;\n    if (v % 2 == 0) evens++;\n}\ndouble avg = (double) sum / arr.length;\n```\n\nNote the cast to `double` before dividing, otherwise integer division truncates.\n\n## Finding Min and Max\n\nInitialize with the **first element** (not 0, which fails on all-negative data), then compare.\n\n```java\nint max = arr[0];\nfor (int i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n}\n```\n\n## Linear Search\n\nScan until you find a **target**. Return the index, or `-1` if absent.\n\n```java\nint find(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}\n```\n\n## Counting Matches\n\nIncrement a counter for every element meeting a condition.\n\n```java\nint count = 0;\nfor (int v : arr) {\n    if (v > 100) count++;\n}\n```\n\n## Shifting and Building New Arrays\n\nBecause arrays are fixed-size, to \"remove\" or \"insert\" you typically build a **new array** or shift elements. To reverse, swap from the ends inward:\n\n```java\nfor (int i = 0; i < arr.length / 2; i++) {\n    int temp = arr[i];\n    arr[i] = arr[arr.length - 1 - i];\n    arr[arr.length - 1 - i] = temp;\n}\n```\n\n## Algorithm Checklist\n\n- **Min/Max** — seed with first element, then compare.\n- **Search** — return early on match, `-1` otherwise.\n- **Count/Sum** — running accumulator.\n- **Reverse/Shift** — careful index arithmetic with `length - 1 - i`.\n\nThese patterns appear constantly on the AP exam free-response questions, so practice them until they are automatic.",
      "challenge_title": "Count Above Average",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // TODO: compute the average, then print how many elements are strictly\n        // greater than the average\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int sum = 0;\n        for (int v : arr) sum += v;\n        double avg = (double) sum / n;\n        int count = 0;\n        for (int v : arr) {\n            if (v > avg) count++;\n        }\n        System.out.println(count);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 5",
          "expected_output": "2"
        },
        {
          "input": "4\n10 10 10 10",
          "expected_output": "0"
        },
        {
          "input": "6\n1 1 1 1 1 20",
          "expected_output": "1"
        }
      ],
      "key_terms": [
        {
          "term": "Linear search",
          "definition": "A standard algorithm that checks each element in turn until it finds a target, returning its index or -1 if the target is absent."
        },
        {
          "term": "Accumulator",
          "definition": "A variable that builds up a result across a traversal, such as a running sum, count, or product."
        },
        {
          "term": "Integer division",
          "definition": "Division of two int values that discards the fractional part; cast to double first to get a precise average."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why initialize max = arr[0] instead of max = 0 when finding the maximum?",
          "options": [
            "It runs faster",
            "If all elements are negative, max = 0 would be wrong since 0 is larger than every element",
            "0 is not a valid array value",
            "It avoids a compile error"
          ],
          "correct_index": 1,
          "explanation": "Seeding with arr[0] guarantees the starting value is an actual element. Seeding with 0 fails for all-negative arrays because 0 would never be beaten."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does a linear search return when the target is not in the array?",
          "options": [
            "0",
            "-1 (by convention)",
            "The array length",
            "It throws an exception"
          ],
          "correct_index": 1,
          "explanation": "By convention, linear search returns -1 to signal the target was not found, since -1 is never a valid index."
        },
        {
          "question": "Given int sum = 7, count = 2; what is (double) sum / count?",
          "options": [
            "3.0",
            "3.5",
            "3",
            "4.0"
          ],
          "correct_index": 1,
          "explanation": "Casting sum to double before dividing performs floating-point division: 7.0 / 2 = 3.5. Without the cast, integer division would give 3."
        }
      ]
    }
  ]
}
