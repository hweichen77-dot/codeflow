export default {
  "project": {
    "id": "csa-03",
    "title": "Boolean Expressions & if Statements",
    "description": "Master relational and logical operators, conditional control flow, nested and compound boolean logic, short-circuit evaluation, and De Morgan's Law in Java for the AP CSA exam.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 203,
    "track": "apcsa",
    "unit": "Unit 3 — Boolean Expressions & if",
    "tags": [
      "java",
      "booleans",
      "conditionals"
    ]
  },
  "lessons": [
    {
      "id": "csa-03-l1",
      "project_id": "csa-03",
      "order": 1,
      "title": "Relational Operators & boolean Values",
      "explanation": "## What Is a Boolean Expression?\n\nA **boolean expression** is any expression that evaluates to one of two values: `true` or `false`. In Java these values have the primitive type **boolean**. Boolean expressions are the engine behind every decision a program makes.\n\n## Relational Operators\n\nA **relational operator** compares two values and produces a boolean. Java provides six:\n\n- `<` less than\n- `>` greater than\n- `<=` less than or equal to\n- `>=` greater than or equal to\n- `==` equal to\n- `!=` not equal to\n\nThese work on numeric types like `int` and `double`. For example:\n\n```java\nint a = 7;\nint b = 10;\nboolean result = a < b;   // true\nSystem.out.println(a >= b); // false\nSystem.out.println(a == 7); // true\nSystem.out.println(a != b); // true\n```\n\n## Common Pitfall: == vs =\n\nA frequent beginner mistake is confusing **assignment** (`=`) with the **equality test** (`==`). The single `=` stores a value into a variable; the double `==` asks a question and returns a boolean. Writing `if (a = b)` is a compile error in Java when `a` and `b` are `int`, which actually protects you here.\n\n## Storing the Result\n\nBecause the result is a `boolean`, you can store it in a variable and reuse it:\n\n```java\nboolean isAdult = age >= 18;\nSystem.out.println(isAdult);\n```\n\nWhen you print a boolean, Java outputs the literal text `true` or `false`.\n\n## Comparing Doubles\n\nWith **floating-point** numbers, exact `==` comparisons can be unreliable due to rounding, but on the AP exam comparisons like `3.0 == 3.0` behave as expected. For now, just know relational operators accept mixed numeric types: `5 < 5.5` is `true`.\n\nMastering these six operators is the foundation for everything else in this unit.",
      "key_terms": [
        {
          "term": "boolean",
          "definition": "A Java primitive type whose only values are true and false."
        },
        {
          "term": "relational operator",
          "definition": "An operator (<, >, <=, >=, ==, !=) that compares two values and yields a boolean."
        },
        {
          "term": "equality operator",
          "definition": "The == operator that tests whether two values are equal, distinct from the = assignment operator."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does the expression 7 != 7 evaluate to?",
          "options": [
            "true",
            "false",
            "7",
            "compile error"
          ],
          "correct_index": 1,
          "explanation": "!= means 'not equal'. Since 7 equals 7, 'not equal' is false."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which operator tests equality in Java?",
          "options": [
            "=",
            "==",
            "=>",
            ":="
          ],
          "correct_index": 1,
          "explanation": "== tests equality; a single = is assignment."
        },
        {
          "question": "What is the type of the expression (5 < 8)?",
          "options": [
            "int",
            "double",
            "boolean",
            "String"
          ],
          "correct_index": 2,
          "explanation": "Relational operators always produce a boolean value."
        }
      ],
      "challenge_title": "Compare Two Integers",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // TODO: print whether a is less than b (true/false),\n        // then whether a equals b (true/false), each on its own line\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a < b);\n        System.out.println(a == b);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 5",
          "expected_output": "true\nfalse"
        },
        {
          "input": "5 5",
          "expected_output": "false\ntrue"
        },
        {
          "input": "9 2",
          "expected_output": "false\nfalse"
        }
      ]
    },
    {
      "id": "csa-03-l2",
      "project_id": "csa-03",
      "order": 2,
      "title": "The if Statement",
      "explanation": "## Making Decisions\n\nAn **if statement** runs a block of code only when a boolean expression is `true`. This is the simplest form of **conditional control flow**: the program chooses whether to execute a section based on a condition.\n\n## Syntax\n\n```java\nif (condition) {\n    // body runs only when condition is true\n}\n```\n\nThe **condition** inside the parentheses must be a boolean expression. If it evaluates to `true`, the body in braces executes; if `false`, the body is skipped entirely and the program continues after the closing brace.\n\n## A Concrete Example\n\n```java\nint score = 85;\nif (score >= 60) {\n    System.out.println(\"You passed!\");\n}\nSystem.out.println(\"Done\");\n```\n\nIf `score` is 85, the condition `score >= 60` is `true`, so it prints `You passed!` then `Done`. If `score` were 40, the condition is `false`, the print is skipped, and only `Done` appears.\n\n## Braces and the Single-Statement Trap\n\nYou may omit the braces when the body is a single statement, but the AP exam and good style strongly favor **always using braces**:\n\n```java\nif (x > 0)\n    System.out.println(\"positive\");\n    System.out.println(\"this ALWAYS runs\"); // NOT part of the if!\n```\n\nThe indentation here is misleading. Only the first println is controlled by the `if`. The second runs unconditionally because it is outside the (invisible) single-statement body. Braces prevent this bug.\n\n## No Semicolon After the Condition\n\nWatch for an **empty statement** bug:\n\n```java\nif (x > 0);   // BUG: the ; ends the if with an empty body\n{\n    System.out.println(\"always runs\");\n}\n```\n\nThe stray semicolon makes the `if` do nothing, and the block then runs every time. Always connect the condition directly to a brace.\n\n## Flow of Control\n\nThink of an `if` as a **gate**: the boolean decides whether execution passes through. Mastering this single-branch decision prepares you for the two-way `if/else` next.",
      "key_terms": [
        {
          "term": "if statement",
          "definition": "A control structure that executes its body only when its boolean condition is true."
        },
        {
          "term": "condition",
          "definition": "The boolean expression inside an if's parentheses that determines whether the body runs."
        },
        {
          "term": "control flow",
          "definition": "The order in which statements execute, which conditionals can alter."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What runs when the condition of an if statement is false?",
          "options": [
            "The body runs anyway",
            "The body is skipped",
            "A compile error occurs",
            "The program halts"
          ],
          "correct_index": 1,
          "explanation": "When the condition is false, the if's body is skipped and execution continues after it."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is 'if (x > 0);' usually a bug?",
          "options": [
            "x must be a double",
            "The semicolon makes the if body empty",
            "if cannot use >",
            "Parentheses are missing"
          ],
          "correct_index": 1,
          "explanation": "The semicolon terminates the if with an empty statement, so the following block runs unconditionally."
        },
        {
          "question": "What must the condition inside an if's parentheses evaluate to?",
          "options": [
            "An int",
            "A String",
            "A boolean",
            "Any value"
          ],
          "correct_index": 2,
          "explanation": "Java requires the condition to be a boolean expression."
        }
      ],
      "challenge_title": "Pass or Silent",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        // TODO: if score is 60 or higher, print PASS\n        // always print the line DONE at the end\n        System.out.println(\"DONE\");\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        if (score >= 60) {\n            System.out.println(\"PASS\");\n        }\n        System.out.println(\"DONE\");\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "85",
          "expected_output": "PASS\nDONE"
        },
        {
          "input": "60",
          "expected_output": "PASS\nDONE"
        },
        {
          "input": "42",
          "expected_output": "DONE"
        }
      ]
    },
    {
      "id": "csa-03-l3",
      "project_id": "csa-03",
      "order": 3,
      "title": "if / else and else if",
      "explanation": "## Two-Way Decisions with else\n\nAn **if/else** statement chooses between exactly two paths. When the condition is `true`, the `if` body runs; otherwise the `else` body runs. Exactly one branch executes.\n\n```java\nint n = 7;\nif (n % 2 == 0) {\n    System.out.println(\"even\");\n} else {\n    System.out.println(\"odd\");\n}\n```\n\nHere `7 % 2` is `1`, so the condition is `false` and `odd` prints. The `else` has no condition of its own; it is the catch-all for when the `if` is false.\n\n## Multi-Way Decisions with else if\n\nTo choose among more than two options, chain conditions using **else if**. Java evaluates each condition in order and runs the body of the **first one that is true**, then skips the rest:\n\n```java\nint grade = 82;\nif (grade >= 90) {\n    System.out.println(\"A\");\n} else if (grade >= 80) {\n    System.out.println(\"B\");\n} else if (grade >= 70) {\n    System.out.println(\"C\");\n} else {\n    System.out.println(\"F\");\n}\n```\n\nWith `grade = 82`, the first test `>= 90` is false, the second `>= 80` is true, so it prints `B` and **stops**. The remaining branches are never checked.\n\n## Order Matters\n\nBecause only the first true branch runs, **order is critical**. If you reversed the conditions to put `>= 70` first, then 82 would match it and incorrectly print `C`. Always arrange ranges from most restrictive to least, or vice versa consistently.\n\n## The else Is Optional\n\nA chain may end without an `else`. If no condition is true and there is no final `else`, no branch runs at all:\n\n- `if` alone: zero or one branch runs.\n- `if/else`: exactly one of two runs.\n- `if/else if/.../else`: exactly one runs (the final `else` guarantees coverage).\n\nThis structure lets you express clean, mutually exclusive categories.",
      "key_terms": [
        {
          "term": "else clause",
          "definition": "The branch of an if statement that runs when the condition is false."
        },
        {
          "term": "else if",
          "definition": "A chained condition checked only when all preceding conditions were false."
        },
        {
          "term": "mutually exclusive",
          "definition": "Branches where exactly one can execute because the first true condition wins."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In an if/else if/else chain, how many branches execute?",
          "options": [
            "All of them",
            "At most one",
            "At least two",
            "Exactly two"
          ],
          "correct_index": 1,
          "explanation": "Only the first true condition's body runs; if none is true and an else exists, the else runs. So at most one (exactly one if a final else is present)."
        }
      ],
      "quiz_questions": [
        {
          "question": "Given grade = 95 in the lesson's grading chain, what prints?",
          "options": [
            "A",
            "B",
            "C",
            "F"
          ],
          "correct_index": 0,
          "explanation": "95 >= 90 is true, so the first branch runs and prints A; the rest are skipped."
        },
        {
          "question": "Why must else-if conditions be ordered carefully?",
          "options": [
            "Java sorts them automatically",
            "Only the first true branch runs",
            "else cannot follow else if",
            "Conditions run in parallel"
          ],
          "correct_index": 1,
          "explanation": "Because the first true condition wins, a too-broad earlier condition can mask later ones."
        }
      ],
      "challenge_title": "Letter Grade",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int g = sc.nextInt();\n        // TODO: print A for g>=90, B for g>=80, C for g>=70, else F\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int g = sc.nextInt();\n        if (g >= 90) {\n            System.out.println(\"A\");\n        } else if (g >= 80) {\n            System.out.println(\"B\");\n        } else if (g >= 70) {\n            System.out.println(\"C\");\n        } else {\n            System.out.println(\"F\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "93",
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
      "id": "csa-03-l4",
      "project_id": "csa-03",
      "order": 4,
      "title": "Logical Operators: && || !",
      "explanation": "## Combining Conditions\n\n**Logical operators** combine or invert boolean expressions so a single `if` can test several conditions at once. Java has three:\n\n- `&&` logical **AND** — true only when **both** operands are true\n- `||` logical **OR** — true when **at least one** operand is true\n- `!` logical **NOT** — flips true to false and false to true\n\n## Truth Tables\n\nFor AND and OR:\n\n- `true && true` is `true`; any other combination is `false`.\n- `false || false` is `false`; any other combination is `true`.\n- `!true` is `false`; `!false` is `true`.\n\n```java\nint age = 25;\nboolean hasLicense = true;\nif (age >= 18 && hasLicense) {\n    System.out.println(\"May drive\");\n}\n```\n\nBoth `age >= 18` and `hasLicense` must be true for the message to print. Change either to false and the body is skipped.\n\n## OR Example\n\n```java\nint day = 7;\nif (day == 6 || day == 7) {\n    System.out.println(\"Weekend\");\n}\n```\n\nOnly one side needs to be true. Day 7 makes the right operand true, so it prints `Weekend`.\n\n## NOT Example\n\nThe `!` operator negates:\n\n```java\nboolean raining = false;\nif (!raining) {\n    System.out.println(\"Go outside\");\n}\n```\n\nSince `raining` is false, `!raining` is true.\n\n## Precedence\n\nWhen mixing operators, Java applies **precedence**: `!` binds tightest, then `&&`, then `||`. So `a || b && c` means `a || (b && c)`. Use **parentheses** to make intent explicit and avoid mistakes:\n\n```java\nif ((a || b) && c) { ... }\n```\n\nParentheses also improve readability. Combining relational and logical operators lets you express rich real-world rules in one clear condition.",
      "key_terms": [
        {
          "term": "logical AND (&&)",
          "definition": "An operator that yields true only when both boolean operands are true."
        },
        {
          "term": "logical OR (||)",
          "definition": "An operator that yields true when at least one boolean operand is true."
        },
        {
          "term": "logical NOT (!)",
          "definition": "A unary operator that inverts a boolean value."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does (false || true) && !false evaluate to?",
          "options": [
            "true",
            "false",
            "depends on input",
            "compile error"
          ],
          "correct_index": 0,
          "explanation": "(false || true) is true; !false is true; true && true is true."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which precedence order is correct (tightest first)?",
          "options": [
            "||, &&, !",
            "!, &&, ||",
            "&&, ||, !",
            "!, ||, &&"
          ],
          "correct_index": 1,
          "explanation": "! binds tightest, then &&, then ||."
        },
        {
          "question": "When is a && b false?",
          "options": [
            "Only when both are false",
            "When at least one operand is false",
            "Never",
            "Only when both are true"
          ],
          "correct_index": 1,
          "explanation": "AND is true only when both are true, so it is false whenever at least one operand is false."
        }
      ],
      "challenge_title": "Eligible to Vote and Drive",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        // TODO: print YES if age is at least 18 AND at most 65, else NO\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        if (age >= 18 && age <= 65) {\n            System.out.println(\"YES\");\n        } else {\n            System.out.println(\"NO\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "30",
          "expected_output": "YES"
        },
        {
          "input": "17",
          "expected_output": "NO"
        },
        {
          "input": "70",
          "expected_output": "NO"
        }
      ]
    },
    {
      "id": "csa-03-l5",
      "project_id": "csa-03",
      "order": 5,
      "title": "Nested if Statements",
      "explanation": "## What Is Nesting?\n\nA **nested if** is an `if` statement placed inside the body of another `if` (or `else`). Nesting lets you refine a decision in stages: the inner condition is only checked when the outer condition is already true.\n\n```java\nint age = 20;\nboolean member = true;\nif (age >= 18) {\n    if (member) {\n        System.out.println(\"Full access\");\n    } else {\n        System.out.println(\"Adult guest\");\n    }\n} else {\n    System.out.println(\"Minor\");\n}\n```\n\nHere the `member` check happens **only** for adults. A minor never reaches the inner test.\n\n## Nesting vs Compound Conditions\n\nMany nested structures can be rewritten with logical operators. The two adult outcomes above could partly use `&&`:\n\n```java\nif (age >= 18 && member) {\n    System.out.println(\"Full access\");\n}\n```\n\nUse **nesting** when different outer branches need different follow-up logic; use a **compound condition** when you simply need several things true at once. Choosing the clearer form is a judgment call the AP exam rewards.\n\n## The Dangling else Problem\n\nWhen braces are omitted, an `else` attaches to the **nearest unmatched if**, not by indentation. This is the **dangling else**:\n\n```java\nif (a)\n    if (b)\n        System.out.println(\"both\");\n    else\n        System.out.println(\"a but not b\"); // pairs with if(b), not if(a)!\n```\n\nThe `else` belongs to `if (b)`, even though indentation might suggest otherwise. Always use braces to make the pairing explicit and avoid this classic bug.\n\n## Readability\n\nDeeply nested ifs become hard to follow. Keep nesting shallow, use braces consistently, and consider compound conditions or early returns to flatten logic. Clear structure is as important as correctness.",
      "key_terms": [
        {
          "term": "nested if",
          "definition": "An if statement contained within the body of another if or else."
        },
        {
          "term": "dangling else",
          "definition": "An ambiguity where an else attaches to the nearest unmatched if rather than by indentation."
        },
        {
          "term": "outer condition",
          "definition": "The enclosing if whose truth must hold before an inner if is evaluated."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In a nested if, when is the inner condition checked?",
          "options": [
            "Always",
            "Only when the outer condition is true",
            "Only when the outer condition is false",
            "Never"
          ],
          "correct_index": 1,
          "explanation": "The inner if is inside the outer if's body, so it runs only when the outer condition is true."
        }
      ],
      "quiz_questions": [
        {
          "question": "Without braces, an else attaches to which if?",
          "options": [
            "The outermost if",
            "The nearest unmatched if",
            "Whichever indentation suggests",
            "None of them"
          ],
          "correct_index": 1,
          "explanation": "Java pairs else with the nearest preceding unmatched if, regardless of indentation."
        },
        {
          "question": "When is nesting preferable to a compound && condition?",
          "options": [
            "Never",
            "When different outer branches need different follow-up logic",
            "When testing equality",
            "When using doubles"
          ],
          "correct_index": 1,
          "explanation": "Nesting shines when each outer branch leads to distinct further decisions."
        }
      ],
      "challenge_title": "Ticket Pricing",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        int isMember = sc.nextInt(); // 1 = member, 0 = not\n        // TODO: if age < 13 print CHILD\n        // else if member (isMember==1) print MEMBER else print ADULT\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        int isMember = sc.nextInt();\n        if (age < 13) {\n            System.out.println(\"CHILD\");\n        } else {\n            if (isMember == 1) {\n                System.out.println(\"MEMBER\");\n            } else {\n                System.out.println(\"ADULT\");\n            }\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "8 1",
          "expected_output": "CHILD"
        },
        {
          "input": "30 1",
          "expected_output": "MEMBER"
        },
        {
          "input": "30 0",
          "expected_output": "ADULT"
        }
      ]
    },
    {
      "id": "csa-03-l6",
      "project_id": "csa-03",
      "order": 6,
      "title": "Short-Circuit Evaluation",
      "explanation": "## Lazy Evaluation\n\nJava's `&&` and `||` use **short-circuit evaluation**: they stop as soon as the result is determined and skip evaluating the rest of the expression. This is both a performance feature and a powerful safety tool.\n\n## How && Short-Circuits\n\nFor `a && b`, if `a` is `false`, the whole expression is already `false` no matter what `b` is, so **`b` is never evaluated**:\n\n```java\nint x = 0;\nif (x != 0 && 10 / x > 2) {\n    System.out.println(\"big\");\n}\n```\n\nWhen `x` is 0, the left side `x != 0` is false, so Java never computes `10 / x`. This avoids a **divide-by-zero** crash. Reorder the operands and you would get an `ArithmeticException`.\n\n## How || Short-Circuits\n\nFor `a || b`, if `a` is `true`, the whole expression is already `true`, so **`b` is never evaluated**:\n\n```java\nString s = null;\nif (s == null || s.length() == 0) {\n    System.out.println(\"empty\");\n}\n```\n\nBecause `s == null` is true, Java skips `s.length()` and avoids a `NullPointerException`. The order is what protects you.\n\n## Why Order Matters\n\nThe **guard condition** must come first:\n\n- `&&`: put the cheap/safe check that can rule things out on the **left**.\n- `||`: put the check that can confirm things early on the **left**.\n\n## Observable Side Effects\n\nShort-circuiting changes whether side-effecting operands run. If the right operand calls a method that prints or modifies state, it may be skipped:\n\n```java\nif (false && expensive()) { } // expensive() never called\n```\n\nFor the AP exam, you must be able to trace exactly which operands get evaluated. Remember: `false && X` skips X; `true || X` skips X. This lazy behavior is the default in Java and is essential for writing correct, crash-resistant conditions.",
      "key_terms": [
        {
          "term": "short-circuit evaluation",
          "definition": "Stopping evaluation of && or || as soon as the overall result is determined."
        },
        {
          "term": "guard condition",
          "definition": "A leading check placed first to prevent a later operand from causing an error."
        },
        {
          "term": "side effect",
          "definition": "An observable change (like printing) caused by evaluating an operand, which short-circuiting may skip."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In 'false && method()', is method() called?",
          "options": [
            "Yes, always",
            "No, it is skipped",
            "Only if it returns true",
            "It causes an error"
          ],
          "correct_index": 1,
          "explanation": "Since the left operand is false, && short-circuits and the right operand is never evaluated."
        }
      ],
      "quiz_questions": [
        {
          "question": "For a || b, when is b skipped?",
          "options": [
            "When a is false",
            "When a is true",
            "Always",
            "Never"
          ],
          "correct_index": 1,
          "explanation": "If a is true, the OR is already true, so b is not evaluated."
        },
        {
          "question": "Why put 'x != 0' before '10 / x > 2' with &&?",
          "options": [
            "Style only",
            "To short-circuit and avoid divide-by-zero",
            "Java requires it",
            "To speed up output"
          ],
          "correct_index": 1,
          "explanation": "If x is 0, the false left operand short-circuits so 10/x is never computed, avoiding a crash."
        }
      ],
      "challenge_title": "Safe Average Check",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int total = sc.nextInt();\n        int count = sc.nextInt();\n        // TODO: print HIGH if count != 0 AND total/count > 50 (use short-circuit)\n        // otherwise print LOW\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int total = sc.nextInt();\n        int count = sc.nextInt();\n        if (count != 0 && total / count > 50) {\n            System.out.println(\"HIGH\");\n        } else {\n            System.out.println(\"LOW\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "300 5",
          "expected_output": "HIGH"
        },
        {
          "input": "100 5",
          "expected_output": "LOW"
        },
        {
          "input": "100 0",
          "expected_output": "LOW"
        }
      ]
    },
    {
      "id": "csa-03-l7",
      "project_id": "csa-03",
      "order": 7,
      "title": "De Morgan's Laws & Negating Conditions",
      "explanation": "## Negating Compound Conditions\n\nSometimes you need the **opposite** of a compound boolean. **De Morgan's Laws** tell you exactly how to distribute a `!` across `&&` and `||`. They are two algebraic identities:\n\n- `!(a && b)` is equivalent to `!a || !b`\n- `!(a || b)` is equivalent to `!a && !b`\n\nThe pattern: **negate each operand and flip the operator** (`&&` becomes `||`, and `||` becomes `&&`).\n\n## Why This Matters\n\nConsider a rule: \"reject if NOT (age >= 18 AND citizen)\". Applying De Morgan's Law:\n\n```java\n// original\nboolean reject = !(age >= 18 && citizen);\n// equivalent, often clearer\nboolean reject = (age < 18) || !citizen;\n```\n\nNotice `!(age >= 18)` becomes `age < 18` because the negation of `>=` is `<`. Negating relational operators is part of the skill:\n\n- `!(a < b)` is `a >= b`\n- `!(a > b)` is `a <= b`\n- `!(a == b)` is `a != b`\n- `!(a != b)` is `a == b`\n\n## A Full Example\n\n```java\nint hour = 14;\nboolean weekend = false;\n// \"closed\" means NOT (open hours AND a weekday)\nboolean open = (hour >= 9 && hour < 17) && !weekend;\nif (!open) {\n    System.out.println(\"Closed\");\n} else {\n    System.out.println(\"Open\");\n}\n```\n\nYou could rewrite `!open` using De Morgan's Laws into a positive form, but the law guarantees the two versions behave identically for every input.\n\n## Verifying Equivalence\n\nThe safest way to confirm two boolean expressions are **equivalent** is a **truth table**: list every combination of the variables and check both expressions yield the same result. De Morgan's Laws are proven this way and never fail. They are a core AP CSA topic for simplifying and rewriting conditions cleanly.",
      "key_terms": [
        {
          "term": "De Morgan's Laws",
          "definition": "Identities stating !(a && b) equals !a || !b, and !(a || b) equals !a && !b."
        },
        {
          "term": "negation",
          "definition": "Applying ! to reverse a boolean value or relational comparison."
        },
        {
          "term": "truth table",
          "definition": "A table of all input combinations used to verify two boolean expressions are equivalent."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is !(a || b) equivalent to?",
          "options": [
            "!a || !b",
            "!a && !b",
            "a && b",
            "a || b"
          ],
          "correct_index": 1,
          "explanation": "By De Morgan's Law, negating an OR gives the AND of the negations: !a && !b."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is equivalent to !(x >= 5)?",
          "options": [
            "x > 5",
            "x <= 5",
            "x < 5",
            "x == 5"
          ],
          "correct_index": 2,
          "explanation": "The negation of >= is <, so !(x >= 5) is x < 5."
        },
        {
          "question": "!(a && b) is equivalent to:",
          "options": [
            "!a && !b",
            "!a || !b",
            "a || b",
            "!(a) && b"
          ],
          "correct_index": 1,
          "explanation": "De Morgan's Law turns !(a && b) into !a || !b."
        }
      ],
      "challenge_title": "Outside the Range",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        // The value is IN range when (x >= 10 && x <= 20).\n        // TODO: using De Morgan's Law, print OUT if x is NOT in range, else IN\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        if (x < 10 || x > 20) {\n            System.out.println(\"OUT\");\n        } else {\n            System.out.println(\"IN\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "15",
          "expected_output": "IN"
        },
        {
          "input": "5",
          "expected_output": "OUT"
        },
        {
          "input": "25",
          "expected_output": "OUT"
        }
      ]
    },
    {
      "id": "csa-03-l8",
      "project_id": "csa-03",
      "order": 8,
      "title": "Equivalent Boolean Expressions & FRQ Practice",
      "explanation": "## Recognizing Equivalence\n\nTwo boolean expressions are **equivalent** if they produce the same result for every possible combination of inputs. Recognizing equivalence lets you **simplify** conditions, fix bugs, and answer AP multiple-choice questions that ask which expression is the same as another.\n\n## Tools for Proving Equivalence\n\n- **Truth tables**: enumerate all input combinations and compare outputs.\n- **De Morgan's Laws**: rewrite negated AND/OR expressions.\n- **Algebraic identities**: `a && true` is `a`; `a || false` is `a`; `a || true` is `true`; `a && false` is `false`; `!!a` is `a`.\n\n## Putting It All Together\n\nThis capstone combines relational operators, `&&`/`||`/`!`, if/else if/else, nesting, short-circuiting, and De Morgan's reasoning. Consider classifying a number:\n\n```java\nint n = -4;\nif (n == 0) {\n    System.out.println(\"ZERO\");\n} else if (n > 0 && n % 2 == 0) {\n    System.out.println(\"POS-EVEN\");\n} else if (n > 0) {\n    System.out.println(\"POS-ODD\");\n} else {\n    System.out.println(\"NEGATIVE\");\n}\n```\n\nEach branch is **mutually exclusive**, and the order ensures `0` is handled before sign checks. The compound condition `n > 0 && n % 2 == 0` short-circuits: if `n` is not positive, the modulo test is skipped.\n\n## Simplification Example\n\nThe condition `!(a) || a` is always `true` (a tautology), and `a && !a` is always `false` (a contradiction). Spotting these saves work:\n\n```java\nif (score >= 60 || score < 60) {\n    // always runs — the condition is a tautology\n}\n```\n\n## FRQ Strategy\n\nOn free-response questions: read the specification carefully, identify the distinct cases, order conditions so earlier ones do not swallow later ones, and use braces everywhere. Test your logic mentally against boundary values (like exactly 0 or the range endpoints). Mastering equivalence ties the whole unit together and prepares you for clean, correct conditional code.",
      "key_terms": [
        {
          "term": "equivalent expressions",
          "definition": "Boolean expressions that yield identical results for all input combinations."
        },
        {
          "term": "tautology",
          "definition": "A boolean expression that is always true regardless of inputs, like a || !a."
        },
        {
          "term": "contradiction",
          "definition": "A boolean expression that is always false regardless of inputs, like a && !a."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of (a && !a) for any boolean a?",
          "options": [
            "Always true",
            "Always false",
            "Equal to a",
            "Depends on a"
          ],
          "correct_index": 1,
          "explanation": "An operand and its negation cannot both be true, so the AND is always false (a contradiction)."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which expression is equivalent to 'b || true'?",
          "options": [
            "b",
            "!b",
            "true",
            "false"
          ],
          "correct_index": 2,
          "explanation": "OR with true is always true regardless of b."
        },
        {
          "question": "How can you definitively prove two boolean expressions are equivalent?",
          "options": [
            "Run it once",
            "Build a truth table covering all inputs",
            "Check indentation",
            "Count the operators"
          ],
          "correct_index": 1,
          "explanation": "A truth table enumerates every input combination, confirming the outputs always match."
        }
      ],
      "challenge_title": "Classify the Integer",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: print ZERO if n==0;\n        // POS-EVEN if n>0 and even; POS-ODD if n>0 and odd; else NEGATIVE\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) {\n            System.out.println(\"ZERO\");\n        } else if (n > 0 && n % 2 == 0) {\n            System.out.println(\"POS-EVEN\");\n        } else if (n > 0) {\n            System.out.println(\"POS-ODD\");\n        } else {\n            System.out.println(\"NEGATIVE\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "0",
          "expected_output": "ZERO"
        },
        {
          "input": "8",
          "expected_output": "POS-EVEN"
        },
        {
          "input": "-4",
          "expected_output": "NEGATIVE"
        }
      ]
    }
  ]
}
