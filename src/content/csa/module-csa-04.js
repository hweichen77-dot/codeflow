// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-04",
    "title": "Iteration",
    "description": "Master while and for loops, nested loops, String traversals, and basic loop analysis in Java.",
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
      "title": "while and for Loops",
      "explanation": "## Why Loops Exist\n\n**Iteration** means repeating a block of code. Instead of copying statements over and over, a **loop** runs the same code while a condition stays true. Java's two main counted loops are the `while` loop and the `for` loop.\n\n## The while Loop\n\nA **while loop** checks its **boolean condition** *before* each pass. If the condition is true, the body runs; then control jumps back to re-check the condition. You must change something inside the body so the loop eventually stops, or you create an **infinite loop**.\n\n```java\nint i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    i++;   // update step prevents infinite loop\n}\n```\n\nThis prints 1 through 5. The three moving parts are:\n\n- **Initialization** — `int i = 1;`\n- **Condition** — `i <= 5`\n- **Update** — `i++`\n\n## The for Loop\n\nThe **for loop** packs all three parts onto one line, which is ideal when you know how many times to repeat:\n\n```java\nfor (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}\n```\n\nThe parts run in this order: initialization once, then *condition, body, update, condition, body, update...* until the condition is false. A `for` loop and the earlier `while` loop are **equivalent** — pick whichever reads better.\n\n## Common Patterns\n\n- **Accumulation** — keep a running total: `sum += i;`\n- **Counting** — count items that match a rule.\n- **Off-by-one errors** — using `<` vs `<=` changes the count by one. Always test the first and last values mentally.\n\n## Loop Control\n\nThe loop variable's **scope** in a `for` loop is the loop itself; declare it in the header. After the loop ends, that variable no longer exists. If you need the final value later, declare the variable before the loop instead.",
      "key_terms": [
        {
          "term": "while loop",
          "definition": "A loop that checks its boolean condition before each iteration and repeats the body while the condition is true."
        },
        {
          "term": "for loop",
          "definition": "A counted loop that combines initialization, condition, and update in one header; best when the number of repetitions is known."
        },
        {
          "term": "infinite loop",
          "definition": "A loop whose condition never becomes false because the update step fails to make progress, so it never stops."
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
          "explanation": "i takes values 0, 1, 2, 3 (stops when i reaches 4), so the body runs exactly 4 times."
        }
      ],
      "quiz_questions": [
        {
          "question": "In a while loop, when is the condition checked?",
          "options": [
            "After every iteration only",
            "Before each iteration",
            "Only once at the start",
            "Never; it runs forever"
          ],
          "correct_index": 1,
          "explanation": "A while loop evaluates its condition before each pass; if false at the start, the body never runs."
        },
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
        }
      ],
      "challenge_title": "Sum to N",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print the sum 1 + 2 + ... + n\n    }\n}\n",
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
      "id": "csa-04-l2",
      "project_id": "csa-04",
      "order": 2,
      "title": "Nested Loops",
      "explanation": "## Loops Inside Loops\n\nA **nested loop** is a loop placed inside the body of another loop. The **outer loop** controls how many times the **inner loop** runs from start to finish. For every single pass of the outer loop, the inner loop completes *all* of its iterations.\n\n## Counting Iterations\n\nIf the outer loop runs `m` times and the inner loop runs `n` times per outer pass, the inner body executes `m * n` times total. This multiplication is the key insight for nested loops.\n\n```java\nfor (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 4; col++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();   // newline after each row\n}\n```\n\nThis prints a 3-by-4 grid of stars: the inner body runs 3 * 4 = 12 times.\n\n## Building Tables and Grids\n\nNested loops naturally model **rows and columns**. The outer variable is usually the row; the inner variable is the column. A common mistake is forgetting the `System.out.println()` *after* the inner loop, which would put everything on one line.\n\n## Dependent Inner Bounds\n\nThe inner loop's bounds can **depend on** the outer variable. This makes triangle and staircase shapes:\n\n```java\nfor (int row = 1; row <= 4; row++) {\n    for (int col = 1; col <= row; col++) {\n        System.out.print(\"#\");\n    }\n    System.out.println();\n}\n```\n\nHere row 1 prints 1 hash, row 2 prints 2, and so on, producing a right triangle. The total number of prints is 1 + 2 + 3 + 4 = 10, *not* a simple rectangle product.\n\n## Tracing Tips\n\n- Reset inner variables: a `for` header re-initializes each time, but if you use a `while`, reset the counter yourself.\n- Track the **order of output** carefully — inner loop finishes before the outer advances.\n- Watch where each `print` versus `println` goes, since that controls line breaks.",
      "key_terms": [
        {
          "term": "nested loop",
          "definition": "A loop contained inside the body of another loop, where the inner loop completes fully for each iteration of the outer loop."
        },
        {
          "term": "outer loop",
          "definition": "The enclosing loop that controls how many times the inner loop is started over."
        },
        {
          "term": "dependent bound",
          "definition": "An inner loop limit that is based on the outer loop variable, producing non-rectangular patterns like triangles."
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
          "question": "In a nested loop, what happens for each single iteration of the outer loop?",
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
          "question": "What does the inner bound col <= row create when nested in a row loop?",
          "options": [
            "A rectangle",
            "A triangle/staircase shape",
            "An infinite loop",
            "A single line"
          ],
          "correct_index": 1,
          "explanation": "When the inner limit grows with the outer variable, each row prints more characters, forming a triangle."
        }
      ],
      "challenge_title": "Star Triangle",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print a right triangle of stars with n rows\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int row = 1; row <= n; row++) {\n            for (int col = 1; col <= row; col++) {\n                System.out.print(\"*\");\n            }\n            System.out.println();\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "*\n**\n***"
        },
        {
          "input": "1",
          "expected_output": "*"
        },
        {
          "input": "4",
          "expected_output": "*\n**\n***\n****"
        }
      ]
    },
    {
      "id": "csa-04-l3",
      "project_id": "csa-04",
      "order": 3,
      "title": "String Traversals and Loop Analysis",
      "explanation": "## Walking Through a String\n\nA **String traversal** visits each character of a String one at a time using a loop. The key tools are `length()` (number of characters) and `charAt(i)` (the character at index `i`). Indices run from `0` to `length() - 1`.\n\n```java\nString s = \"code\";\nfor (int i = 0; i < s.length(); i++) {\n    char c = s.charAt(i);\n    System.out.println(c);\n}\n```\n\nNote the condition `i < s.length()`, *not* `<=`. Using `<=` would call `charAt(s.length())`, which throws a **StringIndexOutOfBoundsException** because that index does not exist.\n\n## Common Traversal Patterns\n\n- **Counting** characters that match a rule (e.g., vowels).\n- **Building** a new String: `result += s.charAt(i);` accumulates characters.\n- **Searching** for a character or substring.\n\n```java\nString s = \"banana\";\nint count = 0;\nfor (int i = 0; i < s.length(); i++) {\n    if (s.charAt(i) == 'a') {\n        count++;\n    }\n}\n// count is now 3\n```\n\n## Loop Analysis\n\n**Loop analysis** means reasoning about how many times a loop runs and what it produces. To find the **iteration count**, look at the initialization, condition, and update together. A loop `for (int i = 0; i < n; i++)` runs `n` times.\n\n- A **single loop** over `n` items does roughly `n` units of work.\n- A **nested loop** over `n` items inside `n` items does about `n * n` units of work — this grows much faster.\n\nThis difference matters: doubling the input roughly doubles a single loop's work but **quadruples** a nested loop's work. Recognizing this helps you predict performance and avoid accidental slowdowns. Always trace the first and last iterations to confirm your loop covers exactly the values you intend, with no off-by-one error.",
      "key_terms": [
        {
          "term": "String traversal",
          "definition": "Visiting each character of a String in order, typically using a loop with charAt(i) for i from 0 to length()-1."
        },
        {
          "term": "charAt",
          "definition": "A String method that returns the character at a given index; valid indices range from 0 to length()-1."
        },
        {
          "term": "loop analysis",
          "definition": "Reasoning about how many times a loop runs and how its work grows as the input size increases."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For String s, which loop header correctly traverses every character without an out-of-bounds error?",
          "options": [
            "for (int i = 0; i <= s.length(); i++)",
            "for (int i = 0; i < s.length(); i++)",
            "for (int i = 1; i <= s.length(); i++)",
            "for (int i = 1; i < s.length(); i++)"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 to length()-1, so the condition must be i < s.length() starting at i = 0."
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
          "explanation": "The last valid index is length()-1, so accessing index length() is out of bounds and throws an exception."
        },
        {
          "question": "If a single loop over n items does n work, roughly how much work does a nested loop over n items inside n items do?",
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
    }
  ]
}
