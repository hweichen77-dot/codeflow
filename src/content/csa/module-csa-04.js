export default {
  "project": {
    "id": "csa-04",
    "title": "Iteration",
    "description": "Master while and for loops, loop boundaries, nested loops, String traversals, and informal runtime comparison in the AP CSA Java subset.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 204,
    "track": "apcsa",
    "unit": "Unit 4 — Iteration",
    "tags": [
      "while/for loops",
      "nested loops",
      "loop analysis"
    ]
  },
  "lessons": [
    {
      "id": "csa-04-l1",
      "project_id": "csa-04",
      "order": 1,
      "title": "The while Loop",
      "explanation": "## Why Loops Exist\n\n**Iteration** means repeating a block of code. Instead of copying statements over and over, a **loop** runs the same code while a condition stays true. The simplest loop in Java is the **while loop**.\n\n## How a while Loop Works\n\nA `while` loop checks its **boolean condition** *before* each pass. If the condition is `true`, the body runs; then control jumps back to re-check the condition. If the condition is `false` at the start, the body never runs at all.\n\n```java\nint i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    i++;   // update step\n}\n```\n\nThis prints 1 through 5. Every counted loop has three moving parts:\n\n- **Initialization** — `int i = 1;` (before the loop)\n- **Condition** — `i <= 5` (tested each pass)\n- **Update** — `i++` (inside the body)\n\n## The Infinite Loop Trap\n\nYou must change something inside the body so the condition eventually becomes false, or you create an **infinite loop** that never stops:\n\n```java\nint i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    // forgot i++  -> runs forever!\n}\n```\n\nThe fix is always to make **progress** toward ending the loop.\n\n## Sentinel-Controlled Loops\n\nA `while` loop shines when you do **not** know the number of repetitions ahead of time. A **sentinel** is a special value that signals \"stop\":\n\n```java\nint x = sc.nextInt();\nint sum = 0;\nwhile (x != -1) {   // -1 is the sentinel\n    sum += x;\n    x = sc.nextInt();\n}\n```\n\nThis keeps reading numbers and adding them until it sees `-1`. Because the loop condition is tested at the top, choosing the right initial value and update is critical — always trace the first and last pass by hand.",
      "key_terms": [
        {
          "term": "iteration",
          "definition": "Repeating a block of code multiple times, the core idea behind every loop."
        },
        {
          "term": "while loop",
          "definition": "A loop that checks its boolean condition before each iteration and repeats the body while the condition is true."
        },
        {
          "term": "infinite loop",
          "definition": "A loop whose condition never becomes false because the body fails to make progress, so it never stops."
        }
      ],
      "inline_quizzes": [
        {
          "question": "If a while loop's condition is false the very first time it is checked, how many times does the body run?",
          "options": [
            "Once",
            "Zero times",
            "Forever",
            "It is a compile error"
          ],
          "correct_index": 1,
          "explanation": "A while loop tests its condition before each pass, so if it starts false the body runs zero times."
        }
      ],
      "quiz_questions": [
        {
          "question": "In a while loop, when is the condition checked?",
          "options": [
            "After every iteration only",
            "Before each iteration",
            "Only once at the very start",
            "Never; it runs forever"
          ],
          "correct_index": 1,
          "explanation": "A while loop evaluates its condition before each pass; if false at the start, the body never runs."
        },
        {
          "question": "What most commonly causes an infinite while loop?",
          "options": [
            "Using ++ instead of --",
            "Forgetting to update the variable in the condition",
            "Declaring the variable as int",
            "Putting the condition in parentheses"
          ],
          "correct_index": 1,
          "explanation": "If the body never changes the value the condition depends on, the condition stays true forever and the loop never ends."
        }
      ],
      "challenge_title": "Countdown with while",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: use a while loop to print n, n-1, ..., down to 1, each on its own line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int i = n;\n        while (i >= 1) {\n            System.out.println(i);\n            i--;\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "5\n4\n3\n2\n1"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "3",
          "expected_output": "3\n2\n1"
        }
      ]
    },
    {
      "id": "csa-04-l2",
      "project_id": "csa-04",
      "order": 2,
      "title": "The for Loop",
      "explanation": "## A Loop Built for Counting\n\nWhen you know exactly how many times to repeat, the **for loop** is the cleanest choice. It packs all three loop parts onto a single header line.\n\n```java\nfor (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}\n```\n\nThe header has three sections separated by semicolons:\n\n- **Initialization** — `int i = 1` (runs once)\n- **Condition** — `i <= 5` (tested before each pass)\n- **Update** — `i++` (runs after each body)\n\n## Order of Execution\n\nThe parts execute in a precise order:\n\n1. Initialization runs **once**.\n2. The condition is checked. If false, the loop ends.\n3. The body runs.\n4. The update runs.\n5. Go back to step 2.\n\nSo the sequence is *init, (condition, body, update), (condition, body, update), ...* until the condition is false.\n\n## for and while Are Equivalent\n\nEvery `for` loop can be rewritten as a `while` loop and vice versa. These two loops do the same thing:\n\n```java\nfor (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}\n\nint j = 0;\nwhile (j < 3) {\n    System.out.println(j);\n    j++;\n}\n```\n\nUse a `for` loop when the count is known; use a `while` loop when it depends on a condition you cannot predict.\n\n## Variable Scope\n\nA loop variable declared in the **for header** has **scope** limited to the loop. After the loop ends, that variable no longer exists:\n\n```java\nfor (int i = 0; i < 3; i++) { /* ... */ }\n// i is NOT accessible here\n```\n\nIf you need the final value afterward, declare the variable *before* the loop instead. Choosing the right scope keeps your code clean and prevents accidental reuse bugs.",
      "key_terms": [
        {
          "term": "for loop",
          "definition": "A counted loop that combines initialization, condition, and update in one header; best when the number of repetitions is known."
        },
        {
          "term": "update step",
          "definition": "The part of a loop that changes the loop variable after each iteration, such as i++."
        },
        {
          "term": "scope",
          "definition": "The region of code where a variable exists; a for-header variable is only accessible inside the loop."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many times does the body run: for (int i = 0; i < 4; i++) ?",
          "options": [
            "3",
            "4",
            "5",
            "Infinite"
          ],
          "correct_index": 1,
          "explanation": "i takes the values 0, 1, 2, 3 and stops when i reaches 4, so the body runs exactly 4 times."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which part of a for loop runs exactly once?",
          "options": [
            "The condition",
            "The update",
            "The initialization",
            "The body"
          ],
          "correct_index": 2,
          "explanation": "Initialization runs a single time before the loop begins; condition, body, and update may run many times."
        },
        {
          "question": "When should you prefer a for loop over a while loop?",
          "options": [
            "When the number of repetitions is known in advance",
            "When you never want the loop to end",
            "When reading until a sentinel value",
            "for loops are always required by Java"
          ],
          "correct_index": 0,
          "explanation": "A for loop is ideal for counted iteration where the number of passes is known; while loops fit unknown, condition-based counts."
        }
      ],
      "challenge_title": "Sum to N",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: use a for loop to print the sum 1 + 2 + ... + n\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int sum = 0;\n        for (int i = 1; i <= n; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "15"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "10",
          "expected_output": "55"
        }
      ]
    },
    {
      "id": "csa-04-l3",
      "project_id": "csa-04",
      "order": 3,
      "title": "Loop Boundaries and Off-by-One Errors",
      "explanation": "## The Most Common Loop Bug\n\nAn **off-by-one error** happens when a loop runs one time too many or one time too few. It is the single most frequent loop mistake, and it almost always comes from the **boundary** of the loop — the start value and the comparison operator.\n\n## Counting Iterations Precisely\n\nFor a loop `for (int i = a; i < b; i++)`, the body runs `b - a` times. For `for (int i = a; i <= b; i++)`, it runs `b - a + 1` times. The difference between `<` and `<=` changes the count by exactly **one**.\n\n```java\nfor (int i = 0; i < 5; i++) {}   // runs 5 times: 0,1,2,3,4\nfor (int i = 0; i <= 5; i++) {}  // runs 6 times: 0,1,2,3,4,5\nfor (int i = 1; i <= 5; i++) {}  // runs 5 times: 1,2,3,4,5\n```\n\n## Trace the First and Last Pass\n\nThe reliable cure for off-by-one bugs is to **trace by hand** the first and last iterations:\n\n- What is the loop variable on the **first** pass?\n- What is it on the **last** pass that still satisfies the condition?\n- Does the body do the right thing at both ends?\n\n```java\n// Print 1 through n inclusive\nint n = 4;\nfor (int i = 1; i <= n; i++) {\n    System.out.println(i);   // first: 1, last: 4\n}\n```\n\nIf you wrote `i < n` here, the loop would stop at 3 and miss the value 4 — a classic off-by-one.\n\n## Index Boundaries\n\nBoundaries matter even more with positions. Many structures use indices `0` to `length - 1`. Looping with `i <= length` (instead of `i < length`) reaches one past the end and causes an **out-of-bounds** error. Always match your boundary to whether the limit is **inclusive** or **exclusive**.",
      "key_terms": [
        {
          "term": "off-by-one error",
          "definition": "A bug where a loop runs one iteration too many or too few, usually from the wrong boundary or comparison operator."
        },
        {
          "term": "boundary",
          "definition": "The start value and comparison that determine the first and last iterations of a loop."
        },
        {
          "term": "inclusive vs exclusive",
          "definition": "Whether the limit value is itself processed (<=, inclusive) or stopped just before (<, exclusive)."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many times does the body run: for (int i = 2; i <= 6; i++) ?",
          "options": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correct_index": 1,
          "explanation": "i takes 2,3,4,5,6 which is 6 - 2 + 1 = 5 iterations because the bound is inclusive (<=)."
        }
      ],
      "quiz_questions": [
        {
          "question": "Changing a loop condition from i < n to i <= n changes the iteration count by how much?",
          "options": [
            "No change",
            "Exactly one more",
            "Exactly one fewer",
            "It doubles the count"
          ],
          "correct_index": 1,
          "explanation": "<= includes the value n as well, adding exactly one extra iteration compared to <."
        },
        {
          "question": "What is the best way to catch an off-by-one error?",
          "options": [
            "Always use while loops",
            "Trace the first and last iterations by hand",
            "Always use <= instead of <",
            "Avoid the loop variable entirely"
          ],
          "correct_index": 1,
          "explanation": "Manually checking the first and last passes confirms the loop covers exactly the intended range with no extra or missing iteration."
        }
      ],
      "challenge_title": "Print Range Inclusive",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // TODO: print every integer from a to b inclusive, one per line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        for (int i = a; i <= b; i++) {\n            System.out.println(i);\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "1 5",
          "expected_output": "1\n2\n3\n4\n5"
        },
        {
          "input": "3 3",
          "expected_output": "3"
        },
        {
          "input": "-2 1",
          "expected_output": "-2\n-1\n0\n1"
        }
      ]
    },
    {
      "id": "csa-04-l4",
      "project_id": "csa-04",
      "order": 4,
      "title": "Accumulation and Counting Patterns",
      "explanation": "## Loops That Build Up a Result\n\nMost useful loops fall into two patterns: **accumulation** (building a running total or product) and **counting** (tallying how many items match a rule). Recognizing these patterns lets you solve a huge range of problems quickly.\n\n## The Accumulator Pattern\n\nAn **accumulator** is a variable declared *before* the loop that collects a result *inside* the loop. The starting value matters:\n\n- For a **sum**, start the accumulator at `0`.\n- For a **product**, start at `1`.\n\n```java\nint product = 1;\nfor (int i = 1; i <= 5; i++) {\n    product *= i;   // 1*2*3*4*5\n}\n// product is 120 (5 factorial)\n```\n\nStarting a sum at `1` or a product at `0` is a common bug — the **identity value** must match the operation.\n\n## The Counter Pattern\n\nA **counter** starts at `0` and increases only when a condition holds:\n\n```java\nint count = 0;\nint[] dummy = {4, 7, 2, 9, 6};\nfor (int i = 0; i < dummy.length; i++) {\n    if (dummy[i] % 2 == 0) {\n        count++;\n    }\n}\n// count is 3 (the even numbers 4, 2, 6)\n```\n\n## Tracking a Running Best\n\nA close cousin is finding a **maximum** or **minimum**. Initialize a best-so-far variable, then update it whenever you find something better:\n\n```java\nint max = Integer.MIN_VALUE;\nfor (int i = 0; i < n; i++) {\n    int v = sc.nextInt();\n    if (v > max) {\n        max = v;\n    }\n}\n```\n\nStarting `max` at the smallest possible value guarantees the first real number replaces it. These three patterns — accumulate, count, and track-a-best — appear constantly, so practice spotting which one a problem needs.",
      "key_terms": [
        {
          "term": "accumulator",
          "definition": "A variable declared before a loop that collects a running total or product as the loop runs."
        },
        {
          "term": "counter",
          "definition": "A variable that starts at 0 and increases each time a condition is satisfied during iteration."
        },
        {
          "term": "identity value",
          "definition": "The correct starting value for an accumulator: 0 for sums, 1 for products."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What should a product accumulator be initialized to?",
          "options": [
            "0",
            "1",
            "-1",
            "the first value times 2"
          ],
          "correct_index": 1,
          "explanation": "Multiplying by 0 would zero out everything, so a product accumulator must start at the identity value 1."
        }
      ],
      "quiz_questions": [
        {
          "question": "A counter that tallies matching items should be initialized to what value?",
          "options": [
            "1",
            "0",
            "the array length",
            "Integer.MAX_VALUE"
          ],
          "correct_index": 1,
          "explanation": "Counting starts from zero and increments for each match, so 0 is the correct initial value."
        },
        {
          "question": "Why initialize a running maximum to Integer.MIN_VALUE?",
          "options": [
            "It makes the loop faster",
            "So the first real value will always replace it",
            "Because max must be negative",
            "To cause an off-by-one error"
          ],
          "correct_index": 1,
          "explanation": "Starting below every possible value guarantees the first element compared becomes the new maximum."
        }
      ],
      "challenge_title": "Factorial",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: use an accumulator to print n! (n factorial). 0! is 1.\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long product = 1;\n        for (int i = 1; i <= n; i++) {\n            product *= i;\n        }\n        System.out.println(product);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "120"
        },
        {
          "input": "0",
          "expected_output": "1"
        },
        {
          "input": "1",
          "expected_output": "1"
        }
      ]
    },
    {
      "id": "csa-04-l5",
      "project_id": "csa-04",
      "order": 5,
      "title": "String Traversals with Loops",
      "explanation": "## Walking Through a String\n\nA **String traversal** visits each character of a String one at a time using a loop. The two key tools are `length()` (the number of characters) and `charAt(i)` (the character at index `i`). Valid indices run from `0` to `length() - 1`.\n\n```java\nString s = \"code\";\nfor (int i = 0; i < s.length(); i++) {\n    char c = s.charAt(i);\n    System.out.println(c);\n}\n```\n\n## Mind the Boundary\n\nNotice the condition is `i < s.length()`, **not** `<=`. Using `<=` would call `charAt(s.length())`, which throws a **StringIndexOutOfBoundsException** because that index does not exist. This is the off-by-one rule from earlier applied to text.\n\n## Common Traversal Patterns\n\n- **Counting** characters that match a rule (such as vowels).\n- **Building** a new String: `result += s.charAt(i);` accumulates characters.\n- **Searching** for a particular character.\n\n```java\nString s = \"banana\";\nint count = 0;\nfor (int i = 0; i < s.length(); i++) {\n    if (s.charAt(i) == 'a') {\n        count++;\n    }\n}\n// count is now 3\n```\n\n## Reversing a String\n\nTraversing **backward** is just as easy — start at the last index and count down:\n\n```java\nString s = \"abc\";\nString rev = \"\";\nfor (int i = s.length() - 1; i >= 0; i--) {\n    rev += s.charAt(i);\n}\n// rev is \"cba\"\n```\n\nHere the accumulator pattern and a String traversal combine. Because a `char` can be compared with `==` and concatenated with `+`, loops over text feel almost identical to loops over numbers — only the **bounds** and the **access method** change.",
      "key_terms": [
        {
          "term": "String traversal",
          "definition": "Visiting each character of a String in order, typically with charAt(i) for i from 0 to length()-1."
        },
        {
          "term": "charAt",
          "definition": "A String method returning the character at a given index; valid indices are 0 to length()-1."
        },
        {
          "term": "StringIndexOutOfBoundsException",
          "definition": "The error thrown when code accesses a String index below 0 or at length() or higher."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which loop header traverses every character of String s without an out-of-bounds error?",
          "options": [
            "for (int i = 0; i <= s.length(); i++)",
            "for (int i = 0; i < s.length(); i++)",
            "for (int i = 1; i <= s.length(); i++)",
            "for (int i = 1; i < s.length(); i++)"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 to length()-1, so the loop must start at 0 and use the exclusive bound i < s.length()."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does s.charAt(s.length()) do for a non-empty String s?",
          "options": [
            "Returns the last character",
            "Returns the first character",
            "Throws StringIndexOutOfBoundsException",
            "Returns an empty character"
          ],
          "correct_index": 2,
          "explanation": "The last valid index is length()-1, so index length() is out of bounds and throws an exception."
        },
        {
          "question": "To traverse a String backward, what should the loop variable start at?",
          "options": [
            "0",
            "1",
            "s.length()",
            "s.length() - 1"
          ],
          "correct_index": 3,
          "explanation": "The last valid index is length()-1, so a backward traversal starts there and counts down to 0."
        }
      ],
      "challenge_title": "Count Vowels",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // TODO: count and print the number of vowels (a, e, i, o, u) in s\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        int count = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {\n                count++;\n            }\n        }\n        System.out.println(count);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "banana",
          "expected_output": "3"
        },
        {
          "input": "rhythm",
          "expected_output": "0"
        },
        {
          "input": "education",
          "expected_output": "5"
        }
      ]
    },
    {
      "id": "csa-04-l6",
      "project_id": "csa-04",
      "order": 6,
      "title": "Nested Loops",
      "explanation": "## Loops Inside Loops\n\nA **nested loop** is a loop placed inside the body of another loop. The **outer loop** controls how many times the **inner loop** runs from start to finish. For every single pass of the outer loop, the inner loop completes *all* of its iterations.\n\n## Counting Total Iterations\n\nIf the outer loop runs `m` times and the inner loop runs `n` times per outer pass, the inner body executes `m * n` times in total. This multiplication is the central idea of nested loops.\n\n```java\nfor (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 4; col++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();   // newline after each row\n}\n```\n\nThis prints a 3-by-4 grid of stars: the inner body runs `3 * 4 = 12` times.\n\n## Rows and Columns\n\nNested loops naturally model **rows and columns**. By convention the outer variable is the row and the inner variable is the column. A frequent mistake is forgetting the `System.out.println()` *after* the inner loop, which would jam everything onto one line.\n\n## Order of Output\n\nWhen tracing nested loops, remember the inner loop finishes completely before the outer loop advances:\n\n```java\nfor (int a = 1; a <= 2; a++) {\n    for (int b = 1; b <= 2; b++) {\n        System.out.println(a + \" \" + b);\n    }\n}\n// prints: 1 1, then 1 2, then 2 1, then 2 2\n```\n\n## Tracing Tips\n\n- A `for` header **re-initializes** its variable every time the inner loop starts, so the inner counter resets automatically.\n- Track the **order of output** carefully — the inner loop exhausts all its values before the outer advances.\n- Watch where each `print` versus `println` goes, since that controls line breaks.",
      "key_terms": [
        {
          "term": "nested loop",
          "definition": "A loop contained inside the body of another loop; the inner loop completes fully for each iteration of the outer loop."
        },
        {
          "term": "outer loop",
          "definition": "The enclosing loop that controls how many times the inner loop is started over."
        },
        {
          "term": "inner loop",
          "definition": "The loop inside another loop's body that runs to completion on every outer pass."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Outer loop runs 5 times, inner loop runs 3 times each. How many times does the inner body run?",
          "options": [
            "8",
            "15",
            "5",
            "3"
          ],
          "correct_index": 1,
          "explanation": "Total inner-body executions = outer * inner = 5 * 3 = 15."
        }
      ],
      "quiz_questions": [
        {
          "question": "For each single iteration of the outer loop, what happens to the inner loop?",
          "options": [
            "The inner loop runs exactly once",
            "The inner loop runs all of its iterations",
            "The inner loop is skipped",
            "The outer loop restarts"
          ],
          "correct_index": 1,
          "explanation": "Each outer pass triggers the inner loop to run through its full set of iterations from start to finish."
        },
        {
          "question": "Where must System.out.println() go to break a grid into separate rows?",
          "options": [
            "Before the outer loop",
            "Inside the inner loop body",
            "After the inner loop, inside the outer loop",
            "After both loops end"
          ],
          "correct_index": 2,
          "explanation": "Printing a newline after the inner loop completes (but still inside the outer loop) ends each row."
        }
      ],
      "challenge_title": "Multiplication Grid",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print an n x n grid where cell (i, j) is i*j, columns separated by spaces\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (j > 1) {\n                    System.out.print(\" \");\n                }\n                System.out.print(i * j);\n            }\n            System.out.println();\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "1 2 3\n2 4 6\n3 6 9"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "2",
          "expected_output": "1 2\n2 4"
        }
      ]
    },
    {
      "id": "csa-04-l7",
      "project_id": "csa-04",
      "order": 7,
      "title": "Nested Loop Patterns and Dependent Bounds",
      "explanation": "## Beyond Rectangles\n\nWhen the inner loop's bounds **depend on** the outer loop variable, nested loops produce non-rectangular shapes like triangles and staircases. This is one of the most tested ideas in iteration.\n\n## Dependent Inner Bounds\n\nMaking the inner limit grow with the outer variable creates a right triangle:\n\n```java\nfor (int row = 1; row <= 4; row++) {\n    for (int col = 1; col <= row; col++) {\n        System.out.print(\"#\");\n    }\n    System.out.println();\n}\n```\n\nRow 1 prints 1 hash, row 2 prints 2, and so on. The total number of prints is `1 + 2 + 3 + 4 = 10`, *not* a simple rectangle product. When inner bounds depend on the outer variable, you cannot just multiply — you must **add up** the rows.\n\n## Counting Variable Work\n\nThe pattern above does `1 + 2 + ... + n` units of work, which equals `n * (n + 1) / 2`. That is still roughly proportional to `n` squared for large `n`, even though it is about half the work of a full square.\n\n## Avoiding Duplicate Pairs\n\nDependent bounds are also how you generate **unique pairs** without repeats. Starting the inner loop at `i + 1` ensures each pair is counted once:\n\n```java\nfor (int i = 0; i < n; i++) {\n    for (int j = i + 1; j < n; j++) {\n        // each (i, j) pair appears exactly once\n    }\n}\n```\n\n## Tracing Strategy\n\n- Write out the inner range for the first few outer values: when `row = 1`, the inner runs `col = 1`; when `row = 2`, it runs `col = 1, 2`; and so on.\n- Sum those counts to get the total work.\n- Confirm the **last** row produces the widest output, which is the signature of a growing dependent bound.",
      "key_terms": [
        {
          "term": "dependent bound",
          "definition": "An inner loop limit based on the outer loop variable, producing non-rectangular patterns like triangles."
        },
        {
          "term": "triangular number",
          "definition": "The total 1 + 2 + ... + n = n*(n+1)/2 produced by a triangle-shaped nested loop."
        },
        {
          "term": "unique pair",
          "definition": "A combination counted once by starting the inner loop at i + 1 so no pair repeats."
        }
      ],
      "inline_quizzes": [
        {
          "question": "With the inner bound col <= row over rows 1..4, how many characters are printed in total?",
          "options": [
            "4",
            "8",
            "10",
            "16"
          ],
          "correct_index": 2,
          "explanation": "Rows print 1 + 2 + 3 + 4 = 10 characters because each row's width grows with the outer variable."
        }
      ],
      "quiz_questions": [
        {
          "question": "What shape does an inner bound of col <= row create inside a row loop?",
          "options": [
            "A rectangle",
            "A right triangle / staircase",
            "An infinite loop",
            "A single line"
          ],
          "correct_index": 1,
          "explanation": "When the inner limit grows with the outer variable, each row is wider than the last, forming a triangle."
        },
        {
          "question": "Why start the inner loop at j = i + 1 when generating pairs?",
          "options": [
            "To make the loop infinite",
            "So each unordered pair is counted exactly once",
            "To skip the first element entirely",
            "To reverse the output order"
          ],
          "correct_index": 1,
          "explanation": "Starting at i + 1 avoids pairing an element with itself and prevents counting the same pair twice."
        }
      ],
      "challenge_title": "Number Triangle",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print n rows; row i prints the numbers 1..i separated by spaces\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int row = 1; row <= n; row++) {\n            for (int col = 1; col <= row; col++) {\n                if (col > 1) {\n                    System.out.print(\" \");\n                }\n                System.out.print(col);\n            }\n            System.out.println();\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "1\n1 2\n1 2 3"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "4",
          "expected_output": "1\n1 2\n1 2 3\n1 2 3 4"
        }
      ]
    },
    {
      "id": "csa-04-l8",
      "project_id": "csa-04",
      "order": 8,
      "title": "Informal Runtime Comparison",
      "explanation": "## How Much Work Does a Loop Do?\n\n**Loop analysis** means reasoning about how many times a loop runs and how that count grows as the input gets bigger. You do not need formal big-O notation for AP CSA — you just need to compare loops **informally** by counting iterations.\n\n## Single vs Nested Loops\n\n- A **single loop** over `n` items does about `n` units of work.\n- A **nested loop** over `n` items inside `n` items does about `n * n` (that is, `n` squared) units of work.\n\n```java\n// Single loop: about n steps\nfor (int i = 0; i < n; i++) {\n    System.out.println(i);\n}\n\n// Nested loop: about n * n steps\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++) {\n        System.out.println(i + \",\" + j);\n    }\n}\n```\n\n## Why the Difference Matters\n\nDoubling the input has very different effects:\n\n- A **single loop**: doubling `n` roughly **doubles** the work.\n- A **nested loop**: doubling `n` roughly **quadruples** the work, because `(2n) * (2n) = 4 * n * n`.\n\nFor `n = 1000`, a single loop does about 1,000 steps while a nested loop does about 1,000,000 steps — a thousand times more. This is why an accidental nested loop can make a program crawl on large inputs.\n\n## Comparing Two Solutions\n\nWhen two programs solve the same problem, the one with **fewer iterations for large n** is generally faster. Counting loop steps lets you predict this *before* running anything:\n\n```java\n// Counting matches the SLOW way: n * n comparisons\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        if (a[i] == a[j]) count++;\n```\n\nA single-loop solution that does the same job in about `n` steps would scale far better. Always ask: **how does the step count grow as n grows?**",
      "key_terms": [
        {
          "term": "loop analysis",
          "definition": "Informally reasoning about how many times a loop runs and how its work grows with input size."
        },
        {
          "term": "linear work",
          "definition": "Work that grows in direct proportion to n, the signature of a single loop over n items."
        },
        {
          "term": "quadratic work",
          "definition": "Work that grows like n*n, the signature of a nested loop over n items inside n items."
        }
      ],
      "inline_quizzes": [
        {
          "question": "If a single loop over n items does n work, about how much does a nested loop over n inside n do?",
          "options": [
            "n",
            "2n",
            "n * n",
            "n + 1"
          ],
          "correct_index": 2,
          "explanation": "Each of the n outer passes runs the inner loop n times, giving about n * n total units of work."
        }
      ],
      "quiz_questions": [
        {
          "question": "Doubling n roughly does what to the work of a nested (n by n) loop?",
          "options": [
            "Leaves it unchanged",
            "Doubles it",
            "Quadruples it",
            "Halves it"
          ],
          "correct_index": 2,
          "explanation": "(2n) * (2n) = 4 * n * n, so doubling the input quadruples a nested loop's work."
        },
        {
          "question": "For large n, which solution is generally faster?",
          "options": [
            "The one with more nested loops",
            "The one with fewer total iterations as n grows",
            "Whichever uses while instead of for",
            "They always run at the same speed"
          ],
          "correct_index": 1,
          "explanation": "Fewer iterations as n grows means less work, so that solution scales better and runs faster on large inputs."
        }
      ],
      "challenge_title": "Count Iterations: Single vs Nested",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print the step count of a single loop (n) and a nested loop (n*n),\n        //       separated by a space\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long single = 0;\n        for (int i = 0; i < n; i++) {\n            single++;\n        }\n        long nested = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                nested++;\n            }\n        }\n        System.out.println(single + \" \" + nested);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "5 25"
        },
        {
          "input": "1",
          "expected_output": "1 1"
        },
        {
          "input": "10",
          "expected_output": "10 100"
        }
      ]
    }
  ]
}
