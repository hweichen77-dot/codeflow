// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-10",
    "title": "Recursion",
    "description": "Master recursive thinking in Java — base cases, the call stack, tracing, and recursive search and sort.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 210,
    "track": "apcsa",
    "unit": "Unit 10 — Recursion",
    "tags": [
      "recursion",
      "java",
      "apcsa"
    ]
  },
  "lessons": [
    {
      "id": "csa-10-l1",
      "project_id": "csa-10",
      "order": 1,
      "title": "Base Case and Recursive Case",
      "explanation": "## What Is Recursion?\n\n**Recursion** is when a method calls **itself** to solve a smaller version of the same problem. Every recursive method needs two ingredients:\n\n- A **base case** — the simplest input where the answer is known directly, with no further calls. This stops the recursion.\n- A **recursive case** — where the method calls itself on a **smaller** input, moving toward the base case.\n\nIf you forget the base case, or the recursive case never shrinks the problem, you get **infinite recursion** and a `StackOverflowError`.\n\n## A Classic Example: Factorial\n\nThe factorial `n! = n * (n-1) * ... * 1`, and `0! = 1`. Notice that `n! = n * (n-1)!`. That self-reference is the recursive case.\n\n```java\npublic static int factorial(int n) {\n    if (n <= 1) {     // base case\n        return 1;\n    }\n    return n * factorial(n - 1); // recursive case\n}\n```\n\nWhen we call `factorial(4)`:\n\n- `factorial(4)` returns `4 * factorial(3)`\n- `factorial(3)` returns `3 * factorial(2)`\n- `factorial(2)` returns `2 * factorial(1)`\n- `factorial(1)` hits the **base case** and returns `1`\n\nThen the results multiply back up: `2*1=2`, `3*2=6`, `4*6=24`.\n\n## Why the Base Case Matters\n\nThe base case is the **exit door**. Each recursive call must make progress toward it — here, `n` always decreases by 1, so we are guaranteed to reach `n <= 1`. Without that shrinking, recursion never ends.\n\n## Recursion vs. Iteration\n\nAnything a loop can do, recursion can do, and vice versa. Recursion shines when a problem is **naturally self-similar** (trees, divide-and-conquer). For simple counting it can be less efficient than a loop because each call uses memory, but it is often clearer.\n\nKey takeaway: **always write the base case first**, then express the bigger problem in terms of a smaller one.",
      "key_terms": [
        {
          "term": "Base case",
          "definition": "The condition under which a recursive method returns directly without making another recursive call, stopping the recursion."
        },
        {
          "term": "Recursive case",
          "definition": "The part of a method where it calls itself on a smaller or simpler input to make progress toward the base case."
        },
        {
          "term": "Infinite recursion",
          "definition": "Recursion that never reaches a base case, causing repeated calls until the program crashes with a StackOverflowError."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What happens if a recursive method has no reachable base case?",
          "options": [
            "It returns 0",
            "It runs forever until a StackOverflowError",
            "The compiler refuses to build it",
            "It automatically becomes a loop"
          ],
          "correct_index": 1,
          "explanation": "Without a reachable base case, the method keeps calling itself, exhausting the call stack and throwing StackOverflowError."
        }
      ],
      "quiz_questions": [
        {
          "question": "In factorial(n), which line is the base case?",
          "options": [
            "return n * factorial(n - 1);",
            "if (n <= 1) return 1;",
            "factorial(4)",
            "n = n - 1;"
          ],
          "correct_index": 1,
          "explanation": "The base case returns a known value directly. For factorial that is returning 1 when n is 1 or less."
        },
        {
          "question": "Why must each recursive call use a smaller input?",
          "options": [
            "To save memory",
            "So the method eventually reaches the base case",
            "Because Java requires it",
            "To avoid using loops"
          ],
          "correct_index": 1,
          "explanation": "Shrinking the input on each call guarantees the recursion makes progress toward the base case and terminates."
        }
      ],
      "challenge_title": "Recursive Factorial",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static long factorial(int n) {\n        // TODO: base case + recursive case\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static long factorial(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "4",
          "expected_output": "24"
        },
        {
          "input": "0",
          "expected_output": "1"
        },
        {
          "input": "6",
          "expected_output": "720"
        }
      ]
    },
    {
      "id": "csa-10-l2",
      "project_id": "csa-10",
      "order": 2,
      "title": "The Call Stack",
      "explanation": "## How Recursion Actually Runs\n\nWhen a method is called, Java creates a **stack frame** — a small block of memory holding that call's **parameters**, **local variables**, and the spot to return to. These frames pile up on the **call stack**, a last-in-first-out (LIFO) structure.\n\nEach recursive call **pushes** a new frame. When a call finishes (returns), its frame is **popped** off, and control returns to the caller.\n\n## Tracing Through the Stack\n\nConsider counting down:\n\n```java\npublic static void countDown(int n) {\n    if (n == 0) {\n        return;            // base case\n    }\n    System.out.println(n);\n    countDown(n - 1);      // recursive call\n}\n```\n\nCalling `countDown(3)` builds the stack like this:\n\n- Push `countDown(3)` -> prints 3 -> calls `countDown(2)`\n- Push `countDown(2)` -> prints 2 -> calls `countDown(1)`\n- Push `countDown(1)` -> prints 1 -> calls `countDown(0)`\n- Push `countDown(0)` -> base case, returns -> pop\n- `countDown(1)` resumes, returns -> pop\n- `countDown(2)` resumes, returns -> pop\n- `countDown(3)` resumes, returns -> pop\n\nOutput: `3 2 1`.\n\n## Work Before vs. After the Call\n\nThe **position** of your work matters:\n\n- Code **before** the recursive call runs on the way **down** (during pushes).\n- Code **after** the recursive call runs on the way **back up** (during pops).\n\nIf we move the print **after** the call, the numbers come out reversed (`1 2 3`) because each print waits for the deeper call to finish first.\n\n## StackOverflowError\n\nThe stack has limited size. Too-deep recursion (or a missing base case) overflows it. This is the runtime cost of recursion: every pending call occupies memory until it returns.\n\nUnderstanding the stack lets you **predict output order** and explains why recursion uses more memory than a simple loop.",
      "key_terms": [
        {
          "term": "Call stack",
          "definition": "The LIFO structure of stack frames that tracks active method calls and where each should return."
        },
        {
          "term": "Stack frame",
          "definition": "A block of memory holding one method call's parameters, local variables, and return location."
        },
        {
          "term": "LIFO",
          "definition": "Last-in, first-out — the most recently pushed call frame is the first one to finish and be removed."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Code placed AFTER the recursive call executes during which phase?",
          "options": [
            "While calls are being pushed (going down)",
            "While calls are returning (coming back up)",
            "Never",
            "Only in the base case"
          ],
          "correct_index": 1,
          "explanation": "Statements after the recursive call wait until the deeper call returns, so they run as the stack unwinds upward."
        }
      ],
      "quiz_questions": [
        {
          "question": "If you print n AFTER calling countDown(n-1), what order do numbers print for countDown(3)?",
          "options": [
            "3 2 1",
            "1 2 3",
            "0 1 2 3",
            "Nothing prints"
          ],
          "correct_index": 1,
          "explanation": "Each call defers its print until the deeper call finishes, so the deepest (1) prints first: 1 2 3."
        },
        {
          "question": "What causes a StackOverflowError?",
          "options": [
            "Dividing by zero",
            "Too many stack frames from deep or non-terminating recursion",
            "A null value",
            "Using too many loops"
          ],
          "correct_index": 1,
          "explanation": "Each pending recursive call uses a frame; too many frames exhaust the limited call stack memory."
        }
      ],
      "challenge_title": "Print On The Way Up",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void printUp(int n) {\n        // TODO: print 1..n in increasing order using recursion only (no loops)\n        // hint: recurse first, then print\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        printUp(n);\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void printUp(int n) {\n        if (n == 0) {\n            return;\n        }\n        printUp(n - 1);\n        System.out.println(n);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        printUp(n);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "1\n2\n3"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "5",
          "expected_output": "1\n2\n3\n4\n5"
        }
      ]
    },
    {
      "id": "csa-10-l3",
      "project_id": "csa-10",
      "order": 3,
      "title": "Tracing Recursion and Return Values",
      "explanation": "## Following the Values Back Up\n\nMany recursive methods **combine** the result of a smaller call with some local work. To trace them, you must follow values **down** (as arguments shrink) and **back up** (as returns combine).\n\n## The Fibonacci Sequence\n\nThe Fibonacci numbers are `0, 1, 1, 2, 3, 5, 8, ...` where each is the sum of the previous two:\n\n```java\npublic static int fib(int n) {\n    if (n < 2) {\n        return n;            // fib(0)=0, fib(1)=1\n    }\n    return fib(n - 1) + fib(n - 2);\n}\n```\n\nThis has **two** recursive calls per step — a **branching** (tree) recursion. To trace `fib(4)`:\n\n- `fib(4) = fib(3) + fib(2)`\n- `fib(3) = fib(2) + fib(1)`\n- `fib(2) = fib(1) + fib(0) = 1 + 0 = 1`\n- `fib(1) = 1`, `fib(0) = 0`\n\nWorking up: `fib(2)=1`, `fib(3)=fib(2)+fib(1)=1+1=2`, `fib(4)=fib(3)+fib(2)=2+1=3`.\n\n## Trace Tables\n\nA reliable way to trace is a **table** listing each call and what it returns once its sub-calls resolve. Always resolve the **deepest** call first, then substitute upward — exactly how the stack unwinds.\n\n## Watch For Repeated Work\n\nNotice `fib(2)` is computed more than once. Branching recursion can repeat sub-problems, making naive Fibonacci slow for large `n`. That is fine for tracing practice, but be aware it grows roughly exponentially.\n\n## Tips for Hand-Tracing\n\n- Write the base cases first so you instantly recognize them.\n- Replace each call with its returned value, innermost first.\n- Keep parentheses to avoid order mistakes.\n\nTracing is an AP exam staple: given a recursive method and a starting call, predict the **exact** returned value or printed output.",
      "key_terms": [
        {
          "term": "Branching recursion",
          "definition": "A recursive method that makes more than one recursive call per invocation, forming a tree of calls."
        },
        {
          "term": "Trace table",
          "definition": "A hand-written table that records each recursive call and the value it returns, resolved from the deepest call upward."
        },
        {
          "term": "Return value",
          "definition": "The result a recursive call passes back to its caller, often combined with local work to build the final answer."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does fib(5) return for the standard Fibonacci method?",
          "options": [
            "3",
            "5",
            "8",
            "13"
          ],
          "correct_index": 1,
          "explanation": "The sequence is 0,1,1,2,3,5,... so fib(5) = 5."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is naive recursive Fibonacci slow for large n?",
          "options": [
            "It has no base case",
            "It recomputes the same sub-problems many times",
            "It uses too many loops",
            "It returns the wrong values"
          ],
          "correct_index": 1,
          "explanation": "Each call branches into two, recomputing overlapping sub-problems repeatedly, causing exponential growth."
        },
        {
          "question": "When hand-tracing, which call should you resolve first?",
          "options": [
            "The first call made",
            "The deepest (innermost) call",
            "Any call at random",
            "The base case last"
          ],
          "correct_index": 1,
          "explanation": "The deepest call returns first as the stack unwinds, so resolve innermost calls before substituting upward."
        }
      ],
      "challenge_title": "Recursive Fibonacci",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static long fib(int n) {\n        // TODO: base cases fib(0)=0, fib(1)=1; else sum of previous two\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static long fib(int n) {\n        if (n < 2) {\n            return n;\n        }\n        return fib(n - 1) + fib(n - 2);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "0",
          "expected_output": "0"
        },
        {
          "input": "7",
          "expected_output": "13"
        },
        {
          "input": "10",
          "expected_output": "55"
        }
      ]
    },
    {
      "id": "csa-10-l4",
      "project_id": "csa-10",
      "order": 4,
      "title": "Recursion on Strings",
      "explanation": "## Strings Are Recursive Too\n\nA **String** can be viewed as a first character plus the **rest** of the string. That self-similar structure makes strings perfect for recursion. The key tools are:\n\n- `s.length()` — number of characters; `length() == 0` is the natural base case.\n- `s.charAt(0)` — the first character.\n- `s.substring(1)` — everything **except** the first character (the smaller problem).\n\n## Reversing a String\n\nTo reverse, put the first character **last**: reverse the rest, then append the first character.\n\n```java\npublic static String reverse(String s) {\n    if (s.length() <= 1) {\n        return s;                       // base case\n    }\n    return reverse(s.substring(1)) + s.charAt(0);\n}\n```\n\nTrace `reverse(\"cat\")`:\n\n- `reverse(\"cat\") = reverse(\"at\") + 'c'`\n- `reverse(\"at\") = reverse(\"t\") + 'a'`\n- `reverse(\"t\") = \"t\"` (base case)\n- Build up: `\"t\" + \"a\" = \"ta\"`, then `\"ta\" + \"c\" = \"tac\"`\n\n## Counting Occurrences\n\nThe same pattern counts a target character: check the first char, then recurse on the rest.\n\n```java\npublic static int countChar(String s, char c) {\n    if (s.length() == 0) {\n        return 0;\n    }\n    int rest = countChar(s.substring(1), c);\n    return (s.charAt(0) == c) ? 1 + rest : rest;\n}\n```\n\n## Why This Pattern Works\n\nEach call handles **one** character and delegates the remaining `n-1` characters to a recursive call. Because the string shrinks by one each time, it always reaches the empty (or single-char) base case.\n\n## A Note on Performance\n\n`substring(1)` creates a new String each call, so string recursion is not the fastest approach, but it is wonderfully clear and a common AP pattern. The mental model — **first character + smaller string** — transfers directly to arrays in the next lesson.",
      "key_terms": [
        {
          "term": "substring(1)",
          "definition": "Returns the string with its first character removed, producing the smaller sub-problem for recursion."
        },
        {
          "term": "charAt(0)",
          "definition": "Returns the first character of a string, the piece processed by the current recursive call."
        },
        {
          "term": "Empty-string base case",
          "definition": "Stopping recursion when length() reaches 0 (or 1), since an empty or single-char string needs no further work."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is a natural base case for string recursion?",
          "options": [
            "When the string equals \"a\"",
            "When length() is 0 (or 1)",
            "When charAt(0) is a space",
            "Never; strings can't have base cases"
          ],
          "correct_index": 1,
          "explanation": "An empty (or single-character) string has a known result and needs no further recursion, making it the base case."
        }
      ],
      "quiz_questions": [
        {
          "question": "In reverse(s), what does s.substring(1) represent?",
          "options": [
            "The first character",
            "The whole string",
            "Everything except the first character",
            "The last character"
          ],
          "correct_index": 2,
          "explanation": "substring(1) drops index 0, giving the smaller remaining string to recurse on."
        },
        {
          "question": "Why does string recursion always terminate?",
          "options": [
            "Java limits recursion depth",
            "The string shrinks by one character each call toward the empty base case",
            "charAt resets the string",
            "It uses a loop internally"
          ],
          "correct_index": 1,
          "explanation": "Each recursive call removes one character, so the length steadily decreases until it hits the base case."
        }
      ],
      "challenge_title": "Recursive String Reverse",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static String reverse(String s) {\n        // TODO: base case + recurse on substring(1)\n        return s;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(reverse(s));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static String reverse(String s) {\n        if (s.length() <= 1) {\n            return s;\n        }\n        return reverse(s.substring(1)) + s.charAt(0);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(reverse(s));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "cat",
          "expected_output": "tac"
        },
        {
          "input": "hello",
          "expected_output": "olleh"
        },
        {
          "input": "a",
          "expected_output": "a"
        }
      ]
    },
    {
      "id": "csa-10-l5",
      "project_id": "csa-10",
      "order": 5,
      "title": "Recursion on Arrays",
      "explanation": "## Processing Arrays Recursively\n\nUnlike strings, we usually do **not** create smaller arrays (that is wasteful). Instead we pass an **index** that marks where the current sub-problem begins. The array stays the same; the index shrinks the problem.\n\nThe pattern: a helper takes the array plus an index `i`. The **base case** is when `i` reaches `arr.length` (nothing left). Otherwise, combine `arr[i]` with the recursive result for `i + 1`.\n\n## Summing an Array\n\n```java\npublic static int sum(int[] arr, int i) {\n    if (i == arr.length) {\n        return 0;                 // base case: no elements left\n    }\n    return arr[i] + sum(arr, i + 1);\n}\n```\n\nCall it with `sum(arr, 0)`. Trace `{4, 2, 7}`:\n\n- `sum(arr,0) = 4 + sum(arr,1)`\n- `sum(arr,1) = 2 + sum(arr,2)`\n- `sum(arr,2) = 7 + sum(arr,3)`\n- `sum(arr,3) = 0` (base case)\n- Up: `7+0=7`, `2+7=9`, `4+9=13`\n\n## Finding a Maximum\n\nThe same index trick finds the largest element:\n\n```java\npublic static int max(int[] arr, int i) {\n    if (i == arr.length - 1) {\n        return arr[i];            // last element\n    }\n    return Math.max(arr[i], max(arr, i + 1));\n}\n```\n\n## Wrapper Methods\n\nUsers should not have to pass a starting index. A common technique is a **wrapper** (public) method that calls the recursive **helper** with index 0:\n\n```java\npublic static int sum(int[] arr) {\n    return sum(arr, 0);\n}\n```\n\nThis keeps the public interface clean while the helper does the recursion.\n\n## Key Idea\n\n**Index-based recursion** avoids copying data: the array is shared, and only the integer index moves forward. This mirrors how recursive search and sort algorithms operate in the next lessons.",
      "key_terms": [
        {
          "term": "Index-based recursion",
          "definition": "Recursing over an array by passing an integer index that advances each call, instead of copying sub-arrays."
        },
        {
          "term": "Wrapper method",
          "definition": "A public method that hides the helper's extra parameters by calling the recursive helper with a sensible starting value such as index 0."
        },
        {
          "term": "Helper method",
          "definition": "The actual recursive method, usually with extra parameters like an index, invoked by a wrapper."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why pass an index instead of copying a smaller array each call?",
          "options": [
            "Indices are more accurate",
            "To avoid the cost of creating new arrays repeatedly",
            "Java forbids array copies",
            "It changes the base case"
          ],
          "correct_index": 1,
          "explanation": "Copying sub-arrays every call wastes time and memory; a moving index reuses the same array efficiently."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the base case for sum(arr, i)?",
          "options": [
            "i == 0",
            "i == arr.length",
            "arr[i] == 0",
            "i < 0"
          ],
          "correct_index": 1,
          "explanation": "When the index reaches arr.length there are no elements left, so the sum of the empty remainder is 0."
        },
        {
          "question": "What is the purpose of a wrapper method?",
          "options": [
            "To make recursion faster",
            "To hide helper parameters and start recursion with index 0",
            "To replace the base case",
            "To copy the array"
          ],
          "correct_index": 1,
          "explanation": "The wrapper gives a clean public signature and supplies the starting index to the recursive helper."
        }
      ],
      "challenge_title": "Recursive Array Sum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int sum(int[] arr, int i) {\n        // TODO: base case when i reaches arr.length\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        System.out.println(sum(arr, 0));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int sum(int[] arr, int i) {\n        if (i == arr.length) {\n            return 0;\n        }\n        return arr[i] + sum(arr, i + 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        System.out.println(sum(arr, 0));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\n4 2 7",
          "expected_output": "13"
        },
        {
          "input": "1\n99",
          "expected_output": "99"
        },
        {
          "input": "5\n1 2 3 4 5",
          "expected_output": "15"
        }
      ]
    },
    {
      "id": "csa-10-l6",
      "project_id": "csa-10",
      "order": 6,
      "title": "Recursive Binary Search",
      "explanation": "## Searching by Halving\n\n**Binary search** finds a target in a **sorted** array by repeatedly cutting the search range in half. Recursion expresses this beautifully: each call searches a sub-range defined by `low` and `high` indices.\n\n## The Algorithm\n\n- Compute the middle index `mid = (low + high) / 2`.\n- If `arr[mid]` equals the target, return `mid`.\n- If the target is **smaller**, search the **left** half (`low..mid-1`).\n- If the target is **larger**, search the **right** half (`mid+1..high`).\n- **Base case**: if `low > high`, the range is empty — the target is not present, return `-1`.\n\n```java\npublic static int search(int[] arr, int target, int low, int high) {\n    if (low > high) {\n        return -1;                       // not found\n    }\n    int mid = (low + high) / 2;\n    if (arr[mid] == target) {\n        return mid;\n    } else if (target < arr[mid]) {\n        return search(arr, target, low, mid - 1);\n    } else {\n        return search(arr, target, mid + 1, high);\n    }\n}\n```\n\n## Why It Is Fast\n\nEach call eliminates **half** of the remaining elements, so binary search runs in **O(log n)** time. Searching 1,000,000 sorted items takes about 20 comparisons. Linear search would take up to a million.\n\n## Tracing an Example\n\nSearch for `7` in `{1, 3, 5, 7, 9}` with `low=0, high=4`:\n\n- `mid=2`, `arr[2]=5`; `7 > 5` -> search right `low=3, high=4`\n- `mid=3`, `arr[3]=7` -> found, return `3`\n\n## Critical Requirement\n\nBinary search only works on **sorted** data. On unsorted input it gives wrong answers. The base case `low > high` is what guarantees termination: every recursive call strictly shrinks the range, so it cannot loop forever.",
      "key_terms": [
        {
          "term": "Binary search",
          "definition": "A search that repeatedly halves a sorted array's range, achieving O(log n) time."
        },
        {
          "term": "Midpoint",
          "definition": "The index (low + high) / 2 used to split the search range and compare against the target."
        },
        {
          "term": "Empty-range base case",
          "definition": "When low exceeds high the range holds no elements, so the target is absent and the method returns -1."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Binary search requires the array to be...",
          "options": [
            "Reversed",
            "Sorted",
            "All positive",
            "Of even length"
          ],
          "correct_index": 1,
          "explanation": "Halving only makes sense when elements are ordered; on unsorted data binary search gives incorrect results."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the time complexity of binary search?",
          "options": [
            "O(n)",
            "O(log n)",
            "O(n^2)",
            "O(1)"
          ],
          "correct_index": 1,
          "explanation": "Each step discards half the remaining elements, so the number of comparisons grows logarithmically."
        },
        {
          "question": "Which base case signals the target is not present?",
          "options": [
            "arr[mid] == target",
            "low > high",
            "mid == 0",
            "high == arr.length"
          ],
          "correct_index": 1,
          "explanation": "When low passes high the range is empty, meaning the target was never found, so return -1."
        }
      ],
      "challenge_title": "Recursive Binary Search",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int search(int[] arr, int target, int low, int high) {\n        // TODO: base case low > high returns -1; else compare mid\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(search(arr, target, 0, n - 1));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int search(int[] arr, int target, int low, int high) {\n        if (low > high) {\n            return -1;\n        }\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) {\n            return mid;\n        } else if (target < arr[mid]) {\n            return search(arr, target, low, mid - 1);\n        } else {\n            return search(arr, target, mid + 1, high);\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(search(arr, target, 0, n - 1));\n    }\n}\n",
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
    },
    {
      "id": "csa-10-l7",
      "project_id": "csa-10",
      "order": 7,
      "title": "Recursive Sorting: Merge Sort",
      "explanation": "## Divide and Conquer\n\n**Merge sort** is the textbook example of recursive **divide and conquer**. It works in three stages:\n\n- **Divide**: split the array into two halves.\n- **Conquer**: recursively sort each half.\n- **Combine**: **merge** the two sorted halves into one sorted result.\n\nThe **base case** is an array (or sub-array) of length 0 or 1 — it is already sorted, so we stop.\n\n## The Merge Step\n\nMerging two sorted lists is the heart of the algorithm. Walk both lists with pointers, repeatedly taking the **smaller** front element:\n\n```java\npublic static int[] merge(int[] a, int[] b) {\n    int[] result = new int[a.length + b.length];\n    int i = 0, j = 0, k = 0;\n    while (i < a.length && j < b.length) {\n        if (a[i] <= b[j]) result[k++] = a[i++];\n        else result[k++] = b[j++];\n    }\n    while (i < a.length) result[k++] = a[i++];\n    while (j < b.length) result[k++] = b[j++];\n    return result;\n}\n```\n\n## Putting It Together\n\n```java\npublic static int[] mergeSort(int[] arr) {\n    if (arr.length <= 1) {\n        return arr;                       // base case\n    }\n    int mid = arr.length / 2;\n    int[] left = Arrays.copyOfRange(arr, 0, mid);\n    int[] right = Arrays.copyOfRange(arr, mid, arr.length);\n    return merge(mergeSort(left), mergeSort(right));\n}\n```\n\n## Why It Is Efficient\n\nThe array is halved `log n` times, and each level does `O(n)` merging work, giving **O(n log n)** overall — far better than the `O(n^2)` of simple sorts on large inputs. Merge sort is also **stable** (equal elements keep their order) thanks to the `<=` in the merge.\n\n## The Recursive Shape\n\nNotice the two recursive calls (`mergeSort(left)` and `mergeSort(right)`) — branching recursion again — but here each branch handles a **disjoint** half, so there is no wasteful repeated work like naive Fibonacci. This is recursion at its most powerful.",
      "key_terms": [
        {
          "term": "Divide and conquer",
          "definition": "An approach that splits a problem into smaller independent sub-problems, solves them recursively, and combines the results."
        },
        {
          "term": "Merge",
          "definition": "The step that combines two already-sorted arrays into one sorted array by repeatedly taking the smaller front element."
        },
        {
          "term": "O(n log n)",
          "definition": "Merge sort's running time: log n levels of splitting, each doing n work to merge."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the base case of merge sort?",
          "options": [
            "An array of length 0 or 1",
            "An array with duplicates",
            "An empty merge result",
            "An array of length n/2"
          ],
          "correct_index": 0,
          "explanation": "A sub-array of length 0 or 1 is already sorted, so recursion stops there."
        }
      ],
      "quiz_questions": [
        {
          "question": "What are the three stages of merge sort?",
          "options": [
            "Search, swap, repeat",
            "Divide, conquer (sort halves), combine (merge)",
            "Pivot, partition, recurse",
            "Hash, bucket, gather"
          ],
          "correct_index": 1,
          "explanation": "Merge sort divides into halves, recursively sorts each, then merges them back together."
        },
        {
          "question": "Why is merge sort O(n log n) rather than O(n^2)?",
          "options": [
            "It never recurses",
            "There are log n levels, each doing O(n) merge work",
            "It only compares once",
            "It sorts in place with no copies"
          ],
          "correct_index": 1,
          "explanation": "Halving gives log n levels and merging each level costs O(n), so total work is n log n."
        }
      ],
      "challenge_title": "Merge Sort an Array",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int[] merge(int[] a, int[] b) {\n        // TODO: merge two sorted arrays\n        return new int[0];\n    }\n\n    public static int[] mergeSort(int[] arr) {\n        // TODO: base case + divide + merge\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int[] sorted = mergeSort(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < sorted.length; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(sorted[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int[] merge(int[] a, int[] b) {\n        int[] result = new int[a.length + b.length];\n        int i = 0, j = 0, k = 0;\n        while (i < a.length && j < b.length) {\n            if (a[i] <= b[j]) {\n                result[k++] = a[i++];\n            } else {\n                result[k++] = b[j++];\n            }\n        }\n        while (i < a.length) {\n            result[k++] = a[i++];\n        }\n        while (j < b.length) {\n            result[k++] = b[j++];\n        }\n        return result;\n    }\n\n    public static int[] mergeSort(int[] arr) {\n        if (arr.length <= 1) {\n            return arr;\n        }\n        int mid = arr.length / 2;\n        int[] left = Arrays.copyOfRange(arr, 0, mid);\n        int[] right = Arrays.copyOfRange(arr, mid, arr.length);\n        return merge(mergeSort(left), mergeSort(right));\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int[] sorted = mergeSort(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < sorted.length; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(sorted[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n5 2 4 1 3",
          "expected_output": "1 2 3 4 5"
        },
        {
          "input": "1\n42",
          "expected_output": "42"
        },
        {
          "input": "6\n9 9 1 5 1 0",
          "expected_output": "0 1 1 5 9 9"
        }
      ]
    },
    {
      "id": "csa-10-l8",
      "project_id": "csa-10",
      "order": 8,
      "title": "Recursive Insertion and Putting It Together",
      "explanation": "## Insertion Sort, Recursively\n\nWe usually write **insertion sort** with loops, but it also has an elegant recursive form that reinforces the **base case + smaller problem** mindset.\n\nThe idea: to sort the first `n` elements, first **recursively sort the first `n-1`**, then **insert** the `n`-th element into its correct spot among the already-sorted prefix.\n\n```java\npublic static void insertionSort(int[] arr, int n) {\n    if (n <= 1) {\n        return;                      // base case: 0 or 1 element is sorted\n    }\n    insertionSort(arr, n - 1);       // sort first n-1\n    int last = arr[n - 1];           // element to insert\n    int j = n - 2;\n    while (j >= 0 && arr[j] > last) {\n        arr[j + 1] = arr[j];         // shift right\n        j--;\n    }\n    arr[j + 1] = last;               // place it\n}\n```\n\nHere the **recursive call comes first** (sort the prefix), then the **insert** work happens on the way back up the stack.\n\n## Comparing the Two Sorts\n\n- **Merge sort**: divide and conquer, **O(n log n)**, uses extra arrays.\n- **Insertion sort**: builds a sorted prefix one element at a time, **O(n^2)** in the worst case, but fast on nearly-sorted data and sorts in place.\n\nBoth illustrate the same recursive principle: solve a smaller version, then do a little local work.\n\n## The Big Picture of Recursion\n\nAcross this unit you have seen one pattern repeat:\n\n- Identify a **base case** where the answer is trivial.\n- Express the problem in terms of a **smaller** version of itself.\n- Let the **call stack** combine the partial results.\n\nWhether reversing a string, searching a sorted array, or sorting with merge or insertion, recursion turns a hard problem into the **same problem, one step smaller**. Mastering that reframing is the real goal — the specific algorithm is just practice. When you can spot self-similarity, recursion becomes a natural, powerful tool.",
      "key_terms": [
        {
          "term": "Insertion sort",
          "definition": "A sort that grows a sorted prefix by inserting each next element into its correct position; recursively, sort n-1 then insert the n-th."
        },
        {
          "term": "In-place sorting",
          "definition": "Rearranging elements within the original array without allocating significant extra storage, as insertion sort does."
        },
        {
          "term": "Self-similarity",
          "definition": "The property that a problem can be expressed as a smaller instance of itself, which is what makes recursion applicable."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In recursive insertion sort, what happens AFTER the recursive call returns?",
          "options": [
            "Nothing",
            "The current last element is inserted into the sorted prefix",
            "The array is divided in half",
            "The base case runs again"
          ],
          "correct_index": 1,
          "explanation": "The recursive call sorts the first n-1 elements; on the way back up, the n-th element is inserted into place."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the worst-case time complexity of insertion sort?",
          "options": [
            "O(log n)",
            "O(n)",
            "O(n^2)",
            "O(n log n)"
          ],
          "correct_index": 2,
          "explanation": "Inserting each element may shift all earlier ones, leading to O(n^2) comparisons in the worst case."
        },
        {
          "question": "What single idea unifies every recursive algorithm in this unit?",
          "options": [
            "Always use two recursive calls",
            "Solve a smaller version of the same problem and combine via the base case",
            "Avoid loops entirely",
            "Sort the data first"
          ],
          "correct_index": 1,
          "explanation": "Every example reduces the problem to a smaller instance and relies on a base case to terminate and combine results."
        }
      ],
      "challenge_title": "Recursive Insertion Sort",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void insertionSort(int[] arr, int n) {\n        // TODO: base case; sort first n-1; insert arr[n-1]\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        insertionSort(arr, n);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < n; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(arr[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void insertionSort(int[] arr, int n) {\n        if (n <= 1) {\n            return;\n        }\n        insertionSort(arr, n - 1);\n        int last = arr[n - 1];\n        int j = n - 2;\n        while (j >= 0 && arr[j] > last) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = last;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        insertionSort(arr, n);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < n; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(arr[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n5 2 4 1 3",
          "expected_output": "1 2 3 4 5"
        },
        {
          "input": "4\n4 3 2 1",
          "expected_output": "1 2 3 4"
        },
        {
          "input": "3\n7 7 2",
          "expected_output": "2 7 7"
        }
      ]
    }
  ]
}
