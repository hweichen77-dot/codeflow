export default {
  "project": {
    "id": "csa-06",
    "title": "Array",
    "description": "Master one-dimensional arrays in Java: declaration, indexing, traversal, and the standard algorithms tested on the AP CS A exam.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 206,
    "track": "apcsa",
    "unit": "Unit 6 — Array",
    "tags": [
      "arrays",
      "java",
      "apcsa"
    ]
  },
  "lessons": [
    {
      "id": "csa-06-l1",
      "project_id": "csa-06",
      "order": 1,
      "title": "Declaring and Creating Arrays",
      "explanation": "## What Is an Array?\n\nAn **array** is a fixed-size, ordered collection of values that all share the same **data type**. Instead of declaring `score1`, `score2`, `score3`, you store every score in one array and refer to each by position.\n\n## Declaration Syntax\n\nIn Java you declare an array reference, then create the array object with `new`:\n\n```java\nint[] scores;            // declaration: scores is a reference\nscores = new int[5];     // creation: 5 int slots, all 0 by default\nint[] ages = new int[3]; // declaration + creation in one line\n```\n\nThe `[]` brackets mark the variable as an array type. `int[]` reads as \"array of int\".\n\n## Default Values\n\nWhen you create an array with `new`, every element gets a **default value**:\n\n- `int`, `double` arrays start filled with `0` (or `0.0`)\n- `boolean` arrays start filled with `false`\n- object arrays (like `String[]`) start filled with `null`\n\nThis matters: a freshly created `int[5]` already holds five zeros before you assign anything.\n\n## Fixed Size\n\nThe **length** of an array is set at creation and **cannot change**. `new int[5]` always has exactly five slots. If you need more room, you create a new, larger array and copy the data over.\n\n## Initializer Lists\n\nWhen you already know the values, an **initializer list** declares and fills in one step:\n\n```java\nint[] primes = {2, 3, 5, 7, 11}; // length 5, no new keyword needed\n```\n\nThe size is inferred from the number of values between the braces.\n\n```java\ndouble[] temps = {98.6, 99.1, 100.4};\nString[] names = {\"Ann\", \"Bo\"};\nSystem.out.println(temps.length); // 3\n```\n\nKeep these two creation styles in mind: `new int[n]` for an empty array of a known size, and `{...}` for known starting values.",
      "key_terms": [
        {
          "term": "Array",
          "definition": "A fixed-size, ordered collection of values that all share the same data type."
        },
        {
          "term": "Initializer list",
          "definition": "Brace syntax like {1, 2, 3} that declares and fills an array in one step, with size inferred."
        },
        {
          "term": "Default value",
          "definition": "The value Java places in each element at creation: 0 for numbers, false for boolean, null for objects."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does new int[4] contain immediately after creation?",
          "options": [
            "Four nulls",
            "Four zeros",
            "Garbage values",
            "Nothing; it must be filled first"
          ],
          "correct_index": 1,
          "explanation": "An int array is filled with the default value 0 when created with new."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which line correctly creates an int array of length 5?",
          "options": [
            "int[5] a;",
            "int a[] = new int(5);",
            "int[] a = new int[5];",
            "int[] a = int[5];"
          ],
          "correct_index": 2,
          "explanation": "new int[5] creates the array object; int[] a declares the reference."
        },
        {
          "question": "What is the length of int[] x = {10, 20, 30};?",
          "options": [
            "2",
            "3",
            "4",
            "0"
          ],
          "correct_index": 1,
          "explanation": "An initializer list has length equal to the number of values listed: 3."
        }
      ],
      "challenge_title": "Create and Print an Array",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: create an int array of size n, read n values, print each on its own line\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n        }\n        for (int i = 0; i < n; i++) {\n            System.out.println(a[i]);\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3\n5 10 15",
          "expected_output": "5\n10\n15"
        },
        {
          "input": "1\n42",
          "expected_output": "42"
        },
        {
          "input": "4\n-1 0 7 7",
          "expected_output": "-1\n0\n7\n7"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l2",
      "project_id": "csa-06",
      "order": 2,
      "title": "Indexing and Modifying Elements",
      "explanation": "## Accessing Elements by Index\n\nEach slot in an array has an **index**, its position number. Java arrays are **zero-indexed**: the first element is at index `0`, the second at index `1`, and so on.\n\n```java\nint[] a = {10, 20, 30, 40};\nSystem.out.println(a[0]); // 10  (first)\nSystem.out.println(a[2]); // 30  (third)\n```\n\nIf an array has length `n`, the **valid indices** run from `0` to `n - 1`. The last element is always `a[a.length - 1]`.\n\n## Reading vs. Writing\n\nThe same `a[i]` notation both reads and writes:\n\n- **Read:** `int x = a[2];` copies the value at index 2 into `x`.\n- **Write:** `a[2] = 99;` stores 99 into index 2, replacing whatever was there.\n\n```java\nint[] a = {10, 20, 30, 40};\na[1] = a[1] + 5;   // a[1] becomes 25\na[3] = a[0];       // a[3] becomes 10\n// a is now {10, 25, 30, 10}\n```\n\n## Indices Can Be Expressions\n\nAn index does not have to be a literal number. Any `int` expression works, which is what makes loops powerful:\n\n```java\nint i = 2;\nSystem.out.println(a[i]);     // a[2]\nSystem.out.println(a[i - 1]); // a[1]\nSystem.out.println(a[a.length - 1]); // last element\n```\n\n## Swapping Two Elements\n\nA common pattern is swapping. You **must** use a temporary variable, or the first assignment overwrites the value you still need:\n\n```java\nint temp = a[0];\na[0] = a[1];\na[1] = temp;\n```\n\nWithout `temp`, doing `a[0] = a[1]; a[1] = a[0];` would leave both slots equal. Mastering index reads, writes, and swaps is the foundation for every array algorithm to come.",
      "key_terms": [
        {
          "term": "Index",
          "definition": "The integer position of an element in an array; Java arrays start at index 0."
        },
        {
          "term": "Zero-indexed",
          "definition": "A numbering scheme where the first element is at position 0 and the last is at length - 1."
        },
        {
          "term": "Swap",
          "definition": "Exchanging two elements' values, which requires a temporary variable to avoid losing data."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For int[] a = {4, 8, 12}; what is the index of the last element?",
          "options": [
            "3",
            "2",
            "1",
            "12"
          ],
          "correct_index": 1,
          "explanation": "Length is 3, so the last valid index is length - 1 = 2."
        }
      ],
      "quiz_questions": [
        {
          "question": "After int[] a = {1,2,3}; a[0] = a[2]; what is a?",
          "options": [
            "{3,2,3}",
            "{1,2,1}",
            "{3,2,1}",
            "{1,2,3}"
          ],
          "correct_index": 0,
          "explanation": "a[0] is assigned the value of a[2], which is 3, giving {3,2,3}."
        },
        {
          "question": "Why does swapping a[i] and a[j] need a temp variable?",
          "options": [
            "Java forbids assigning array elements directly",
            "The first assignment overwrites a value still needed",
            "Arrays are immutable",
            "temp makes the code run faster"
          ],
          "correct_index": 1,
          "explanation": "Without temp, assigning a[i]=a[j] loses the original a[i] before it can be copied to a[j]."
        }
      ],
      "challenge_title": "Swap First and Last",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: swap the first and last elements, then print the array space-separated\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int temp = a[0];\n        a[0] = a[n - 1];\n        a[n - 1] = temp;\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(' ');\n            sb.append(a[i]);\n        }\n        System.out.println(sb.toString());\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4\n1 2 3 4",
          "expected_output": "4 2 3 1"
        },
        {
          "input": "1\n9",
          "expected_output": "9"
        },
        {
          "input": "5\n10 20 30 40 50",
          "expected_output": "50 20 30 40 10"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l3",
      "project_id": "csa-06",
      "order": 3,
      "title": "Array Length and the Standard for Loop",
      "explanation": "## The length Field\n\nEvery array carries a public field named **length** that reports how many elements it holds:\n\n```java\nint[] a = {5, 10, 15, 20};\nSystem.out.println(a.length); // 4\n```\n\nNote: `length` is a **field, not a method**, so there are no parentheses. (Strings use `.length()` with parentheses, arrays use `.length` without. A classic mix-up.)\n\n## Traversing with a for Loop\n\nThe standard way to visit every element is a `for` loop driven by an index that runs from `0` up to `length - 1`:\n\n```java\nfor (int i = 0; i < a.length; i++) {\n    System.out.println(a[i]);\n}\n```\n\nBreak down the three parts:\n\n- **Initialization:** `int i = 0` starts at the first index.\n- **Condition:** `i < a.length` keeps going while `i` is a valid index. Using `<` (not `<=`) is essential.\n- **Update:** `i++` advances to the next slot.\n\n## Why i < a.length, Not i <= a.length\n\nIf an array has length 4, the valid indices are 0, 1, 2, 3. Writing `i <= a.length` would try to access `a[4]`, which does not exist and throws an error. Always pair `<` with `length`.\n\n## Index Variable Reuse\n\nBecause the loop exposes the index `i`, you can do index-dependent work, like printing positions:\n\n```java\nfor (int i = 0; i < a.length; i++) {\n    System.out.println(\"Index \" + i + \" holds \" + a[i]);\n}\n```\n\nUsing `a.length` rather than a hard-coded number means your loop adapts automatically if the array size changes. This is the most important traversal pattern in the AP CS A course, and you will reuse it constantly.",
      "key_terms": [
        {
          "term": "length",
          "definition": "A public field on every array giving its number of elements; written without parentheses."
        },
        {
          "term": "Traversal",
          "definition": "Visiting each element of an array in order, typically with a loop."
        },
        {
          "term": "Loop condition",
          "definition": "The boolean test i < a.length that keeps an index loop within valid bounds."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How do you get the number of elements in int[] a?",
          "options": [
            "a.length()",
            "a.size",
            "a.length",
            "length(a)"
          ],
          "correct_index": 2,
          "explanation": "Arrays use the field a.length with no parentheses; only Strings use length()."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which loop condition correctly traverses every valid index of array a?",
          "options": [
            "i <= a.length",
            "i < a.length",
            "i < a.length - 1",
            "i <= a.length - 0"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 to length-1, so i < a.length visits them all without going out of bounds."
        },
        {
          "question": "What is wrong with for (int i = 0; i <= a.length; i++)?",
          "options": [
            "Nothing, it is correct",
            "It skips the first element",
            "It accesses a[a.length], which is out of bounds",
            "It never enters the loop"
          ],
          "correct_index": 2,
          "explanation": "On the final iteration i equals a.length, an invalid index that throws an exception."
        }
      ],
      "challenge_title": "Sum and Length Report",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: print the array length and the sum of all elements on two lines\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int sum = 0;\n        for (int i = 0; i < a.length; i++) {\n            sum += a[i];\n        }\n        System.out.println(a.length);\n        System.out.println(sum);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3\n1 2 3",
          "expected_output": "3\n6"
        },
        {
          "input": "1\n100",
          "expected_output": "1\n100"
        },
        {
          "input": "5\n2 4 6 8 10",
          "expected_output": "5\n30"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l4",
      "project_id": "csa-06",
      "order": 4,
      "title": "The Enhanced for Loop",
      "explanation": "## A Cleaner Way to Read Elements\n\nThe **enhanced for loop** (also called the *for-each loop*) visits every element of an array without an explicit index. It reads naturally: \"for each value in the array.\"\n\n```java\nint[] a = {5, 10, 15};\nfor (int value : a) {\n    System.out.println(value);\n}\n```\n\nThe variable `value` takes on each element in turn: first 5, then 10, then 15. The colon `:` reads as \"in\".\n\n## Syntax Rules\n\nThe loop header has the form `for (Type var : array)`:\n\n- **Type** must match the array's element type (`int` for `int[]`, `String` for `String[]`).\n- **var** is a fresh **copy** of each element, not the element itself.\n- There is no index, no `length`, and no `i++` to manage.\n\n## The Key Limitation: You Cannot Modify the Array\n\nBecause the loop variable is a copy, assigning to it does **not** change the array:\n\n```java\nint[] a = {1, 2, 3};\nfor (int value : a) {\n    value = value * 10; // changes the copy only\n}\n// a is still {1, 2, 3}\n```\n\nTo modify elements, you must use an indexed `for` loop and write `a[i] = ...`. The enhanced for loop is for **reading and accumulating** (summing, counting, searching), not for changing the array in place.\n\n## When to Use Which\n\n- Use the **enhanced for** when you only need each value and do not care about position: summing, counting, finding a max.\n- Use the **standard for** when you need the index, want to modify elements, or only traverse part of the array.\n\n```java\nint sum = 0;\nfor (int v : a) sum += v; // clean accumulation\n```\n\nKnowing when each loop applies is a frequent AP exam topic.",
      "key_terms": [
        {
          "term": "Enhanced for loop",
          "definition": "A loop of the form for (Type v : array) that visits each element in order without an index."
        },
        {
          "term": "Loop variable copy",
          "definition": "The enhanced for loop's variable holds a copy of each element, so assigning to it cannot change the array."
        },
        {
          "term": "Accumulation",
          "definition": "Building up a running result (such as a sum or count) while traversing an array."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Can you change array elements by assigning to the loop variable in an enhanced for loop?",
          "options": [
            "Yes, it modifies the array directly",
            "No, the variable is only a copy",
            "Only for int arrays",
            "Only if you also use break"
          ],
          "correct_index": 1,
          "explanation": "The enhanced for variable is a copy, so assigning to it leaves the array unchanged."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which loop correctly sums an int[] named nums?",
          "options": [
            "for (int n : nums) sum += n;",
            "for (int i : nums) sum += nums[i];",
            "for (n : nums) sum += n;",
            "for (int n = nums) sum += n;"
          ],
          "correct_index": 0,
          "explanation": "Each iteration n is the element itself, so sum += n accumulates the total correctly."
        },
        {
          "question": "When should you prefer a standard indexed for loop over an enhanced for loop?",
          "options": [
            "When only reading values",
            "When you need to modify elements or use the index",
            "When the array is empty",
            "Never; enhanced for is always better"
          ],
          "correct_index": 1,
          "explanation": "Modifying elements or needing positions requires the index that only the standard for loop provides."
        }
      ],
      "challenge_title": "Count Even Numbers",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: use an enhanced for loop to count how many values are even, then print the count\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int count = 0;\n        for (int v : a) {\n            if (v % 2 == 0) count++;\n        }\n        System.out.println(count);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 6",
          "expected_output": "3"
        },
        {
          "input": "3\n1 3 5",
          "expected_output": "0"
        },
        {
          "input": "4\n2 4 6 8",
          "expected_output": "4"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l5",
      "project_id": "csa-06",
      "order": 5,
      "title": "Finding Maximum and Minimum",
      "explanation": "## A Standard Algorithm\n\nFinding the **maximum** or **minimum** value in an array is one of the *standard algorithms* the AP CS A exam expects you to write fluently. The idea: assume the first element is the best so far, then compare it against every other element.\n\n## The Max Pattern\n\n```java\nint[] a = {4, 9, 2, 7};\nint max = a[0];               // start with the first element\nfor (int i = 1; i < a.length; i++) {\n    if (a[i] > max) {\n        max = a[i];           // found a bigger one\n    }\n}\nSystem.out.println(max);      // 9\n```\n\nKey points:\n\n- **Initialize `max` to `a[0]`**, not to `0`. If you start at 0 and all values are negative, you would wrongly return 0.\n- Start the loop at index `1` since index 0 is already the initial guess.\n- The condition `a[i] > max` updates the running best whenever a larger value appears.\n\n## The Min Pattern\n\nFinding the minimum is identical except the comparison flips to `<`:\n\n```java\nint min = a[0];\nfor (int v : a) {\n    if (v < min) min = v;\n}\n```\n\nNotice this version uses an **enhanced for loop**, which works fine because we are only reading. Comparing `a[0]` against itself on the first iteration is harmless.\n\n## Tracking the Index of the Max\n\nSometimes you need *where* the max is, not just its value. Track an index instead:\n\n```java\nint maxIndex = 0;\nfor (int i = 1; i < a.length; i++) {\n    if (a[i] > a[maxIndex]) {\n        maxIndex = i;\n    }\n}\n```\n\nThen `a[maxIndex]` is the maximum and `maxIndex` tells you its position. This index-tracking variation appears often in free-response questions, so practice both forms.",
      "key_terms": [
        {
          "term": "Standard algorithm",
          "definition": "A common array routine (max, min, sum, count, search) the AP CS A exam expects you to implement."
        },
        {
          "term": "Running maximum",
          "definition": "A variable holding the largest value seen so far, updated as the traversal proceeds."
        },
        {
          "term": "Index tracking",
          "definition": "Storing the position of the best element rather than its value, so you know where it is."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why initialize max to a[0] instead of 0 when finding the maximum?",
          "options": [
            "It is faster",
            "Starting at 0 fails when all elements are negative",
            "0 is not a valid index",
            "It avoids an out-of-bounds error"
          ],
          "correct_index": 1,
          "explanation": "If every value is negative, an initial max of 0 would never be replaced and the result would be wrong."
        }
      ],
      "quiz_questions": [
        {
          "question": "In the max-finding loop, why does i start at 1?",
          "options": [
            "To skip the smallest element",
            "Because a[0] is already used as the initial max",
            "Arrays start at index 1",
            "To avoid an off-by-one error at the end"
          ],
          "correct_index": 1,
          "explanation": "Element a[0] is the initial guess, so the loop only needs to compare the remaining elements."
        },
        {
          "question": "To find the minimum instead of the maximum, what changes?",
          "options": [
            "Start the loop at index 2",
            "Initialize to the last element",
            "Change the comparison from > to <",
            "Use a while loop instead"
          ],
          "correct_index": 2,
          "explanation": "The pattern is identical except the comparison operator flips to < to keep the smallest value."
        }
      ],
      "challenge_title": "Largest Element",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: find and print the maximum value in the array\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int max = a[0];\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] > max) max = a[i];\n        }\n        System.out.println(max);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4\n4 9 2 7",
          "expected_output": "9"
        },
        {
          "input": "3\n-5 -2 -9",
          "expected_output": "-2"
        },
        {
          "input": "1\n42",
          "expected_output": "42"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l6",
      "project_id": "csa-06",
      "order": 6,
      "title": "Linear Search",
      "explanation": "## Searching an Array\n\n**Linear search** (also called sequential search) checks each element one at a time until it finds a **target** value or runs out of elements. It works on any array, sorted or not.\n\n## Returning the Index\n\nThe most useful version reports *where* the target was found, or `-1` if it is absent. By convention, `-1` signals \"not found\" because it is never a valid index.\n\n```java\nint[] a = {7, 3, 9, 4};\nint target = 9;\nint found = -1;\nfor (int i = 0; i < a.length; i++) {\n    if (a[i] == target) {\n        found = i;\n        break;        // stop at the first match\n    }\n}\nSystem.out.println(found); // 2\n```\n\nKey points:\n\n- Initialize the result to **-1** before the loop.\n- Use **`==`** to compare primitives (and `.equals` for objects like Strings).\n- **`break`** exits early once found, saving needless comparisons.\n\n## A Boolean \"Contains\" Variation\n\nWhen you only need to know *whether* a value is present, return a boolean:\n\n```java\nboolean contains = false;\nfor (int v : a) {\n    if (v == target) {\n        contains = true;\n        break;\n    }\n}\n```\n\nThis enhanced-for version is clean because position does not matter.\n\n## Comparing Strings Correctly\n\nFor object arrays, never use `==` to compare contents. Use `.equals`:\n\n```java\nString[] names = {\"Ann\", \"Bo\"};\nString target = \"Bo\";\nint idx = -1;\nfor (int i = 0; i < names.length; i++) {\n    if (names[i].equals(target)) { idx = i; break; }\n}\n```\n\n## Efficiency Note\n\nLinear search makes at most `length` comparisons. It is simple and always correct, but for large **sorted** arrays, binary search (a later topic) is far faster. For the AP subset, linear search is the go-to searching algorithm.",
      "key_terms": [
        {
          "term": "Linear search",
          "definition": "Checking each array element in order until the target is found or the array ends."
        },
        {
          "term": "Target",
          "definition": "The value being searched for in the array."
        },
        {
          "term": "Sentinel -1",
          "definition": "The conventional return value signaling the target was not found, since -1 is never a valid index."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does linear search typically return when the target is not in the array?",
          "options": [
            "0",
            "-1",
            "null",
            "the array length"
          ],
          "correct_index": 1,
          "explanation": "-1 is the standard not-found signal because it is never a valid array index."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why use break once the target is found in a linear search?",
          "options": [
            "It is required by Java syntax",
            "To avoid an out-of-bounds error",
            "To stop early and avoid unnecessary comparisons",
            "To reset the index to 0"
          ],
          "correct_index": 2,
          "explanation": "Once the first match is found there is no need to keep scanning, so break improves efficiency."
        },
        {
          "question": "How should you compare String elements when searching a String[]?",
          "options": [
            "Using ==",
            "Using .equals",
            "Using .compareTo only",
            "Using <"
          ],
          "correct_index": 1,
          "explanation": "== compares references for objects; .equals compares the actual character contents."
        }
      ],
      "challenge_title": "Find the Index",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // TODO: print the index of the first occurrence of target, or -1 if not present\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int found = -1;\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] == target) {\n                found = i;\n                break;\n            }\n        }\n        System.out.println(found);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4\n7 3 9 4\n9",
          "expected_output": "2"
        },
        {
          "input": "3\n1 2 3\n5",
          "expected_output": "-1"
        },
        {
          "input": "5\n8 8 8 8 8\n8",
          "expected_output": "0"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l7",
      "project_id": "csa-06",
      "order": 7,
      "title": "Out-of-Bounds Errors",
      "explanation": "## The Most Common Array Bug\n\nWhen you access an index that does not exist, Java throws an **ArrayIndexOutOfBoundsException** at runtime. This is the single most common array error, and the AP exam tests your ability to spot it.\n\n## Valid Index Range\n\nFor an array of length `n`, the only legal indices are `0` through `n - 1`. Any of these throws the exception:\n\n```java\nint[] a = new int[3]; // valid indices: 0, 1, 2\na[3] = 5;             // ERROR: index 3 too high\na[-1] = 5;            // ERROR: negative index\nint x = a[3];         // ERROR on read, too\n```\n\nBoth **too-high** and **negative** indices are illegal.\n\n## Off-by-One Errors in Loops\n\nMost out-of-bounds bugs come from a loop condition that is off by one:\n\n```java\n// WRONG: i reaches a.length, accessing a[a.length]\nfor (int i = 0; i <= a.length; i++) {\n    System.out.println(a[i]); // crashes on last iteration\n}\n\n// CORRECT\nfor (int i = 0; i < a.length; i++) {\n    System.out.println(a[i]);\n}\n```\n\nThe fix is using `<` instead of `<=`. Remember: the last valid index is `a.length - 1`, never `a.length`.\n\n## Empty Arrays\n\nAn array of length 0 has **no valid indices at all**. Accessing `a[0]` on it throws the exception. Code that assumes at least one element (like `int max = a[0];`) will crash on an empty array, so guard against it when input size could be zero:\n\n```java\nif (a.length > 0) {\n    int max = a[0];\n    // ...\n}\n```\n\n## Looking Ahead Safely\n\nAlgorithms that compare `a[i]` with `a[i + 1]` must stop one early so `i + 1` stays in bounds:\n\n```java\nfor (int i = 0; i < a.length - 1; i++) {\n    if (a[i] == a[i + 1]) { /* adjacent duplicate */ }\n}\n```\n\nUsing `a.length - 1` keeps the look-ahead `a[i + 1]` from ever exceeding the last index.",
      "key_terms": [
        {
          "term": "ArrayIndexOutOfBoundsException",
          "definition": "A runtime error thrown when code accesses an index below 0 or at/above the array's length."
        },
        {
          "term": "Off-by-one error",
          "definition": "A bug where a loop boundary is wrong by one, often using <= instead of < with length."
        },
        {
          "term": "Look-ahead bound",
          "definition": "Stopping a loop at length - 1 so that accessing a[i + 1] stays within the array."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For int[] a = new int[3]; which access is legal?",
          "options": [
            "a[3]",
            "a[-1]",
            "a[2]",
            "a[a.length]"
          ],
          "correct_index": 2,
          "explanation": "Valid indices are 0, 1, 2. Index 2 is the last legal slot; 3 and -1 are out of bounds."
        }
      ],
      "quiz_questions": [
        {
          "question": "What exception results from accessing a[a.length]?",
          "options": [
            "NullPointerException",
            "ArrayIndexOutOfBoundsException",
            "ArithmeticException",
            "No exception; it returns 0"
          ],
          "correct_index": 1,
          "explanation": "a.length is one past the last valid index, so accessing it throws ArrayIndexOutOfBoundsException."
        },
        {
          "question": "When comparing a[i] with a[i+1], what should the loop condition be?",
          "options": [
            "i < a.length",
            "i <= a.length",
            "i < a.length - 1",
            "i < a.length + 1"
          ],
          "correct_index": 2,
          "explanation": "Stopping at length - 1 ensures a[i+1] never exceeds the last valid index."
        }
      ],
      "challenge_title": "Count Adjacent Equal Pairs",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: count how many adjacent pairs a[i], a[i+1] are equal; print the count\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int count = 0;\n        for (int i = 0; i < a.length - 1; i++) {\n            if (a[i] == a[i + 1]) count++;\n        }\n        System.out.println(count);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n1 1 2 2 2",
          "expected_output": "3"
        },
        {
          "input": "4\n1 2 3 4",
          "expected_output": "0"
        },
        {
          "input": "1\n7",
          "expected_output": "0"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-06-l8",
      "project_id": "csa-06",
      "order": 8,
      "title": "Combining Array Algorithms",
      "explanation": "## Putting It All Together\n\nReal problems rarely use a single algorithm. They **combine** traversal, accumulation, max/min, counting, and searching. This capstone lesson practices chaining these standard patterns within one program.\n\n## Computing an Average\n\nAn average needs a **sum** (accumulation) divided by the **count** (length). Watch the data types: integer division truncates, so cast to `double` when you need a decimal result:\n\n```java\nint[] a = {2, 3, 4};\nint sum = 0;\nfor (int v : a) sum += v;\ndouble avg = (double) sum / a.length; // 3.0, not 3\n```\n\n## Counting Values Above a Threshold\n\nA frequent task is counting how many elements satisfy a condition, often relative to a computed value like the average:\n\n```java\ndouble avg = (double) sum / a.length;\nint aboveCount = 0;\nfor (int v : a) {\n    if (v > avg) aboveCount++;\n}\n```\n\nNotice this requires **two passes**: one to compute the average, a second to count against it. Many algorithms need multiple traversals, and that is perfectly normal.\n\n## A Worked Combination\n\nSuppose you want the maximum element *and* how many times it appears:\n\n```java\nint max = a[0];\nfor (int i = 1; i < a.length; i++) {\n    if (a[i] > max) max = a[i];\n}\nint freq = 0;\nfor (int v : a) {\n    if (v == max) freq++;\n}\nSystem.out.println(max + \" \" + freq);\n```\n\nFirst pass finds the max; second pass counts occurrences. Each pass uses a clean, familiar pattern you have already mastered.\n\n## Strategy for Multi-Step Problems\n\n- Break the task into **independent passes**, each doing one job.\n- Compute any value you depend on (like an average or max) **before** the pass that uses it.\n- Reuse the standard patterns: index `for` to modify, enhanced `for` to read.\n\nThinking in composable passes turns intimidating problems into a sequence of small, reliable steps.",
      "key_terms": [
        {
          "term": "Multiple passes",
          "definition": "Traversing an array more than once, where each pass performs one well-defined task."
        },
        {
          "term": "Integer division",
          "definition": "Division of two ints that discards the fractional part; cast to double to keep decimals."
        },
        {
          "term": "Threshold count",
          "definition": "Counting elements that meet a condition, often compared against a computed value like the average."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why cast to double when computing an average of an int array?",
          "options": [
            "To make it run faster",
            "Because int division truncates the decimal part",
            "To avoid an out-of-bounds error",
            "Because length is a double"
          ],
          "correct_index": 1,
          "explanation": "Without a cast, sum / length performs integer division and discards the fractional part."
        }
      ],
      "quiz_questions": [
        {
          "question": "To count elements greater than the array's average, how many passes are needed?",
          "options": [
            "One pass",
            "Two passes: compute the average, then count",
            "Three passes",
            "Zero; it cannot be done with arrays"
          ],
          "correct_index": 1,
          "explanation": "You must finish computing the average before you can compare each element against it, requiring two passes."
        },
        {
          "question": "What does (double) sum / a.length compute when sum is 7 and a.length is 2?",
          "options": [
            "3",
            "3.0",
            "3.5",
            "4"
          ],
          "correct_index": 2,
          "explanation": "Casting sum to double forces double division, giving 3.5 instead of integer 3."
        }
      ],
      "challenge_title": "Count Above Average",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // TODO: compute the average, then print how many elements are strictly greater than it\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int sum = 0;\n        for (int v : a) sum += v;\n        double avg = (double) sum / a.length;\n        int count = 0;\n        for (int v : a) {\n            if (v > avg) count++;\n        }\n        System.out.println(count);\n    }\n}",
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
          "input": "3\n1 2 9",
          "expected_output": "1"
        }
      ],
      "xp_reward": 100
    }
  ]
}
