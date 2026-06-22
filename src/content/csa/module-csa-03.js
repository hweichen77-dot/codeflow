// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-03",
    "title": "Boolean Expressions & if Statements",
    "description": "This unit covers relational and logical operators, if/else decision structures, compound boolean expressions, and simplifying conditions with De Morgan's laws in Java.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 203,
    "track": "apcsa",
    "unit": "Unit 3 — Boolean Expressions & if",
    "tags": [
      "relational/logical operators",
      "if/else",
      "compound booleans"
    ]
  },
  "lessons": [
    {
      "id": "csa-03-l1",
      "project_id": "csa-03",
      "order": 1,
      "title": "Relational & Logical Operators",
      "explanation": "## Boolean Expressions\n\nA **boolean expression** evaluates to one of two values: `true` or `false`. In Java these values are stored in the primitive type `boolean`. Boolean expressions are the foundation of every decision your program makes.\n\n## Relational Operators\n\n**Relational operators** compare two values and produce a boolean result:\n\n- `<` less than\n- `<=` less than or equal to\n- `>` greater than\n- `>=` greater than or equal to\n- `==` equal to\n- `!=` not equal to\n\nNote the difference between `=` (assignment) and `==` (comparison). Mixing them up is one of the most common beginner bugs.\n\n```java\nint a = 5;\nint b = 8;\nboolean result = a < b;   // true\nboolean same = (a == b);  // false\n```\n\n## Logical Operators\n\n**Logical operators** combine or invert boolean values:\n\n- `&&` logical AND — true only when **both** sides are true\n- `||` logical OR — true when **at least one** side is true\n- `!` logical NOT — flips true to false and vice versa\n\n```java\nint age = 20;\nboolean canVote = age >= 18;          // true\nboolean teen = age >= 13 && age <= 19; // false (age is 20)\nboolean notTeen = !teen;              // true\n```\n\n## Short-Circuit Evaluation\n\nJava uses **short-circuit evaluation**. With `&&`, if the left side is `false`, the right side is never evaluated because the whole expression cannot be true. With `||`, if the left side is `true`, the right side is skipped. This is useful both for performance and for safety:\n\n```java\nint x = 0;\n// Right side never runs, so no divide-by-zero\nif (x != 0 && 10 / x > 2) {\n    System.out.println(\"big\");\n}\n```\n\n## Operator Precedence\n\nRelational operators evaluate before logical operators, and `&&` binds tighter than `||`. When in doubt, use parentheses to make intent clear and avoid subtle bugs.",
      "key_terms": [
        {
          "term": "boolean expression",
          "definition": "An expression that evaluates to either true or false."
        },
        {
          "term": "relational operator",
          "definition": "An operator such as <, <=, >, >=, ==, or != that compares two values and returns a boolean."
        },
        {
          "term": "short-circuit evaluation",
          "definition": "Java's behavior of skipping the right operand of && or || when the result is already determined by the left operand."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does the expression 7 != 7 evaluate to?",
          "options": [
            "true",
            "false",
            "7",
            "a compile error"
          ],
          "correct_index": 1,
          "explanation": "!= means 'not equal to'. Since 7 is equal to 7, the expression is false."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which operator returns true only when BOTH operands are true?",
          "options": [
            "||",
            "&&",
            "!",
            "=="
          ],
          "correct_index": 1,
          "explanation": "&& is logical AND, which is true only when both operands are true. || is OR, ! is NOT, and == is equality comparison."
        },
        {
          "question": "Given int x = 0;, why does `x != 0 && 10 / x > 2` NOT crash?",
          "options": [
            "Java rounds division by zero to 0",
            "Short-circuit evaluation skips the right side because the left side is false",
            "The && operator catches the exception",
            "Integer division by zero is allowed in Java"
          ],
          "correct_index": 1,
          "explanation": "Because x != 0 is false, short-circuit evaluation means the right operand 10 / x is never evaluated, avoiding the divide-by-zero error."
        }
      ],
      "challenge_title": "Voting Eligibility Check",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        boolean citizen = sc.nextBoolean();\n        // TODO: print true if age >= 18 AND citizen is true, otherwise false\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        boolean citizen = sc.nextBoolean();\n        boolean eligible = age >= 18 && citizen;\n        System.out.println(eligible);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "20 true",
          "expected_output": "true"
        },
        {
          "input": "16 true",
          "expected_output": "false"
        },
        {
          "input": "40 false",
          "expected_output": "false"
        }
      ]
    },
    {
      "id": "csa-03-l2",
      "project_id": "csa-03",
      "order": 2,
      "title": "if / else if / else Statements",
      "explanation": "## Making Decisions\n\nAn **if statement** runs a block of code only when a boolean condition is `true`. This lets a program choose different paths based on its data.\n\n```java\nint score = 85;\nif (score >= 60) {\n    System.out.println(\"Pass\");\n}\n```\n\nIf the condition is `false`, the body is skipped entirely.\n\n## The else Clause\n\nThe **else clause** provides an alternative that runs when the condition is `false`. Exactly one of the two branches executes:\n\n```java\nint num = 7;\nif (num % 2 == 0) {\n    System.out.println(\"even\");\n} else {\n    System.out.println(\"odd\");\n}\n```\n\n## Chaining with else if\n\nTo test several mutually exclusive cases, chain conditions with **else if**. Java checks each condition top to bottom and runs the first block whose condition is true, then skips the rest:\n\n```java\nint grade = 85;\nif (grade >= 90) {\n    System.out.println(\"A\");\n} else if (grade >= 80) {\n    System.out.println(\"B\");\n} else if (grade >= 70) {\n    System.out.println(\"C\");\n} else {\n    System.out.println(\"F\");\n}\n```\n\nOrder matters. Because 85 satisfies `grade >= 80`, the program prints `B` and never tests the lower conditions. If you reversed the order and put `grade >= 70` first, nearly every passing grade would incorrectly print `C`.\n\n## Curly Braces and Style\n\nWhile Java lets you omit braces for a single statement, **always use braces**. Omitting them leads to the classic dangling-statement bug:\n\n- With braces, the scope of each branch is unambiguous.\n- Without braces, only the next single statement belongs to the `if`.\n\n## Nested if Statements\n\nAn `if` can live inside another `if`. This is called **nesting** and is useful when a second decision only matters after the first is true. Often a nested structure can be rewritten with `&&` to flatten the logic and improve readability.",
      "key_terms": [
        {
          "term": "if statement",
          "definition": "A control structure that executes a block of code only when its boolean condition is true."
        },
        {
          "term": "else if",
          "definition": "A chained condition tested only when all previous if/else if conditions were false."
        },
        {
          "term": "nesting",
          "definition": "Placing one if statement inside another to make a second decision after the first condition is true."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In an if / else if / else chain, how many branches execute for a single run?",
          "options": [
            "All of them",
            "At most one",
            "At least two",
            "Exactly two"
          ],
          "correct_index": 1,
          "explanation": "Java runs the first branch whose condition is true and skips the rest. If none match, the else runs. So at most one branch executes."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does this print? int g = 75; if (g >= 70) System.out.println(\"C\"); else if (g >= 80) System.out.println(\"B\");",
          "options": [
            "B",
            "C",
            "Nothing",
            "Both B and C"
          ],
          "correct_index": 1,
          "explanation": "75 >= 70 is true, so 'C' prints and the else if is skipped. This shows why broader conditions should come later in a chain."
        },
        {
          "question": "Why is it recommended to always use curly braces with if statements?",
          "options": [
            "Braces make code run faster",
            "Without braces only the next single statement belongs to the if, causing bugs",
            "Java requires braces or the code will not compile",
            "Braces are required only inside loops"
          ],
          "correct_index": 1,
          "explanation": "Without braces, only the single statement immediately after the condition is part of the if. Adding more lines that look indented but are not in the block is a common source of bugs."
        }
      ],
      "challenge_title": "Letter Grade Classifier",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        // TODO: print A for >=90, B for >=80, C for >=70, else F\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        if (score >= 90) {\n            System.out.println(\"A\");\n        } else if (score >= 80) {\n            System.out.println(\"B\");\n        } else if (score >= 70) {\n            System.out.println(\"C\");\n        } else {\n            System.out.println(\"F\");\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "95",
          "expected_output": "A"
        },
        {
          "input": "82",
          "expected_output": "B"
        },
        {
          "input": "55",
          "expected_output": "F"
        }
      ]
    },
    {
      "id": "csa-03-l3",
      "project_id": "csa-03",
      "order": 3,
      "title": "Compound Booleans & De Morgan's Laws",
      "explanation": "## Compound Boolean Expressions\n\nA **compound boolean expression** combines two or more conditions with `&&`, `||`, and `!`. They let you express rich rules in a single test.\n\n```java\nint temp = 72;\nboolean comfortable = temp >= 68 && temp <= 78; // true\nboolean extreme = temp < 32 || temp > 95;       // false\n```\n\nUse parentheses to control grouping and make intent obvious. Without them, `&&` is evaluated before `||`, which can surprise you:\n\n```java\n// a || b && c  is read as  a || (b && c)\nboolean r = true || false && false; // true\n```\n\n## De Morgan's Laws\n\n**De Morgan's Laws** describe how to distribute a `!` across `&&` and `||`. They are essential for simplifying negated conditions:\n\n- `!(A && B)` is equivalent to `!A || !B`\n- `!(A || B)` is equivalent to `!A && !B`\n\nWhen you push a NOT inward, AND becomes OR and OR becomes AND, and each operand gets negated.\n\n```java\nint x = 5;\nboolean inRange = x >= 1 && x <= 10;\n// !inRange is the same as:\nboolean outOfRange = x < 1 || x > 10; // De Morgan applied\n```\n\nNotice that `!(x >= 1)` becomes `x < 1`, and `!(x <= 10)` becomes `x > 10`. The relational operators flip, and `&&` turns into `||`.\n\n## Why It Matters\n\nDe Morgan's Laws help you:\n\n- **Simplify** tangled negations into readable conditions.\n- **Refactor** an `if/else` so the positive case is clearer.\n- **Avoid bugs** when inverting a complex guard clause.\n\n## Truth Tables\n\nA **truth table** lists every combination of inputs and the resulting output. For `A && B` only the row where both are true yields true; for `A || B` only the row where both are false yields false. Building a quick truth table is the safest way to verify any tricky compound expression.",
      "key_terms": [
        {
          "term": "compound boolean expression",
          "definition": "A boolean expression that combines multiple conditions using &&, ||, or !."
        },
        {
          "term": "De Morgan's Laws",
          "definition": "Rules stating that !(A && B) equals !A || !B, and !(A || B) equals !A && !B."
        },
        {
          "term": "truth table",
          "definition": "A table listing every combination of input values and the resulting output of a boolean expression."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which expression is equivalent to !(a > 0 && b > 0) by De Morgan's Laws?",
          "options": [
            "a <= 0 || b <= 0",
            "a <= 0 && b <= 0",
            "a > 0 || b > 0",
            "a < 0 && b < 0"
          ],
          "correct_index": 0,
          "explanation": "Distributing the NOT: && becomes ||, and each comparison flips. !(a > 0) is a <= 0 and !(b > 0) is b <= 0, joined by ||."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is !(x < 5 || x > 20) simplified using De Morgan's Laws?",
          "options": [
            "x >= 5 && x <= 20",
            "x >= 5 || x <= 20",
            "x < 5 && x > 20",
            "x <= 5 && x >= 20"
          ],
          "correct_index": 0,
          "explanation": "|| becomes && and each comparison flips: !(x < 5) is x >= 5, and !(x > 20) is x <= 20, joined by &&."
        },
        {
          "question": "Without parentheses, how does Java group `true || false && false`?",
          "options": [
            "(true || false) && false",
            "true || (false && false)",
            "It is a compile error",
            "Left to right with equal precedence"
          ],
          "correct_index": 1,
          "explanation": "&& has higher precedence than ||, so the expression is read as true || (false && false), which evaluates to true."
        }
      ],
      "challenge_title": "In-Range Detector",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int lo = sc.nextInt();\n        int hi = sc.nextInt();\n        // TODO: print \"in\" if lo <= x <= hi, otherwise \"out\"\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int lo = sc.nextInt();\n        int hi = sc.nextInt();\n        if (x >= lo && x <= hi) {\n            System.out.println(\"in\");\n        } else {\n            System.out.println(\"out\");\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5 1 10",
          "expected_output": "in"
        },
        {
          "input": "15 1 10",
          "expected_output": "out"
        },
        {
          "input": "1 1 10",
          "expected_output": "in"
        }
      ]
    }
  ]
}
