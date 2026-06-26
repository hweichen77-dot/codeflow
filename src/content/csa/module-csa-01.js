export default {
  "project": {
    "id": "csa-01",
    "title": "Primitive Types",
    "description": "Master Java's primitive types, literals, arithmetic, casting, operator precedence, and console output to build a rock-solid foundation for AP Computer Science A.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 201,
    "track": "apcsa",
    "unit": "Unit 1 — Primitive Types",
    "tags": [
      "java",
      "primitives",
      "arithmetic"
    ]
  },
  "lessons": [
    {
      "id": "csa-01-l1",
      "project_id": "csa-01",
      "order": 1,
      "title": "Meet the Primitive Types",
      "explanation": "## What Is a Primitive Type?\n\nIn Java every value lives in a **typed** variable. A **primitive type** stores a single, simple value directly in memory — not a reference to an object. The AP Computer Science A exam uses only **three** primitive types:\n\n- **int** — whole numbers like `42`, `-7`, `0`. Range is about ±2.1 billion.\n- **double** — real numbers with a fractional part like `3.14`, `-0.5`, `2.0`.\n- **boolean** — a truth value, either `true` or `false`.\n\nJava is **statically typed**: you must declare a variable's type before using it, and that type never changes.\n\n## Declaring and Initializing\n\nA **declaration** names a variable and its type. **Initialization** gives it a first value. You can combine both:\n\n```java\nint score = 100;        // declaration + initialization\ndouble price = 9.99;    // a real number\nboolean passed = true;  // a truth value\n```\n\nThe **assignment operator** `=` copies the value on the right into the variable on the left. Read `score = 100` as \"score gets 100\", not \"score equals 100\".\n\n## Why Types Matter\n\nThe type controls:\n\n- **What values fit** — you cannot store `3.14` in an `int`.\n- **How much memory** is used and the legal range.\n- **What operations** are allowed (math on numbers, logic on booleans).\n\n## Reading Input with Scanner\n\nTo read values typed by a user, AP CSA uses `Scanner`. Each method matches a type:\n\n```java\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();        // reads an int\n        double gpa = sc.nextDouble();  // reads a double\n        System.out.println(age);\n        System.out.println(gpa);\n    }\n}\n```\n\n`nextInt()` reads an integer; `nextDouble()` reads a decimal. The Scanner skips whitespace and newlines automatically, so values may be on separate lines.\n\nUnderstanding these three types and how to declare them is the bedrock for everything else in Unit 1.",
      "key_terms": [
        {
          "term": "Primitive type",
          "definition": "A basic Java type (int, double, boolean) that stores a single simple value directly, not a reference to an object."
        },
        {
          "term": "Declaration",
          "definition": "A statement that introduces a variable by naming its type and identifier, e.g. int x;"
        },
        {
          "term": "Initialization",
          "definition": "Assigning a variable its first value, often combined with declaration, e.g. int x = 5;"
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which primitive type best stores the value 3.75?",
          "options": [
            "int",
            "double",
            "boolean",
            "String"
          ],
          "correct_index": 1,
          "explanation": "3.75 has a fractional part, so it must be stored in a double; int holds only whole numbers and boolean holds true/false."
        }
      ],
      "quiz_questions": [
        {
          "question": "How many primitive types are used on the AP CSA exam?",
          "options": [
            "Two",
            "Three",
            "Four",
            "Eight"
          ],
          "correct_index": 1,
          "explanation": "AP CSA uses exactly three primitives: int, double, and boolean."
        },
        {
          "question": "What does the statement int x = 5; do?",
          "options": [
            "Compares x to 5",
            "Declares x and initializes it to 5",
            "Prints 5",
            "Creates a boolean"
          ],
          "correct_index": 1,
          "explanation": "It declares an int variable named x and initializes it with the value 5 using the assignment operator."
        }
      ],
      "challenge_title": "Echo Three Types",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read an int, a double, and a boolean, then print each on its own line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        double d = sc.nextDouble();\n        boolean b = sc.nextBoolean();\n        System.out.println(n);\n        System.out.println(d);\n        System.out.println(b);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5 3.5 true",
          "expected_output": "5\n3.5\ntrue"
        },
        {
          "input": "-2 0.0 false",
          "expected_output": "-2\n0.0\nfalse"
        },
        {
          "input": "100\n2.75\ntrue",
          "expected_output": "100\n2.75\ntrue"
        }
      ]
    },
    {
      "id": "csa-01-l2",
      "project_id": "csa-01",
      "order": 2,
      "title": "Literals and Naming",
      "explanation": "## What Is a Literal?\n\nA **literal** is a fixed value written directly in source code. The type of a literal is decided by how you write it:\n\n- **int literal** — digits with no decimal point: `42`, `0`, `-7`.\n- **double literal** — has a decimal point or exponent: `3.14`, `2.0`, `0.5`, `1.5e3`.\n- **boolean literal** — the reserved words `true` and `false`.\n\nThe distinction matters. `5` is an int literal; `5.0` is a double literal. They look similar but behave differently in arithmetic, as later lessons show.\n\n```java\nint count = 10;       // 10 is an int literal\ndouble rate = 0.25;   // 0.25 is a double literal\nboolean ready = true; // true is a boolean literal\n```\n\n## Identifiers and Naming Rules\n\nThe name of a variable is its **identifier**. Java requires:\n\n- Start with a letter, underscore `_`, or `$` (use letters in AP CSA).\n- Followed by letters, digits, or underscores.\n- **No spaces** and no reserved words like `int` or `class`.\n- Identifiers are **case-sensitive**: `total` and `Total` are different.\n\n## Convention: camelCase\n\nBy convention, variable names use **camelCase** — start lowercase, capitalize each later word:\n\n```java\nint studentCount = 30;\ndouble averageScore = 88.5;\nboolean isComplete = false;\n```\n\nGood names describe the data they hold. `numStudents` is far clearer than `x`. The exam rewards readable code, and clear naming reduces bugs.\n\n## final Constants\n\nAdding the keyword **final** makes a variable a **constant** — its value cannot change after initialization. Constants use ALL_CAPS by convention:\n\n```java\nfinal int MAX_SCORE = 100;\nfinal double PI = 3.14159;\n```\n\nAttempting to reassign a `final` variable is a compile-time error. Constants document fixed values and prevent accidental changes.\n\nKnowing how literals carry type and how to name variables cleanly keeps your code correct and readable as programs grow.",
      "key_terms": [
        {
          "term": "Literal",
          "definition": "A fixed value written directly in code, such as 42, 3.14, or true; its type comes from how it is written."
        },
        {
          "term": "Identifier",
          "definition": "The name of a variable, method, or class; case-sensitive and bound by Java's naming rules."
        },
        {
          "term": "final",
          "definition": "A keyword that makes a variable a constant whose value cannot be reassigned after initialization."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What type is the literal 7.0?",
          "options": [
            "int",
            "double",
            "boolean",
            "It depends on the variable"
          ],
          "correct_index": 1,
          "explanation": "A literal with a decimal point is a double, even if the fractional part is zero. 7.0 is a double literal."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is a valid Java identifier following AP CSA conventions?",
          "options": [
            "2score",
            "total score",
            "averageScore",
            "int"
          ],
          "correct_index": 2,
          "explanation": "averageScore is valid camelCase. Names cannot start with a digit, contain spaces, or be the reserved word int."
        },
        {
          "question": "What happens if you try to reassign a final variable?",
          "options": [
            "It silently works",
            "Compile-time error",
            "It prints a warning but runs",
            "The value doubles"
          ],
          "correct_index": 1,
          "explanation": "A final variable is a constant; reassigning it causes a compile-time error."
        }
      ],
      "challenge_title": "Rectangle Constant Area",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read width and height as ints, print their product (area)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int width = sc.nextInt();\n        int height = sc.nextInt();\n        int area = width * height;\n        System.out.println(area);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "4 5",
          "expected_output": "20"
        },
        {
          "input": "7 3",
          "expected_output": "21"
        },
        {
          "input": "10 10",
          "expected_output": "100"
        }
      ]
    },
    {
      "id": "csa-01-l3",
      "project_id": "csa-01",
      "order": 3,
      "title": "Integer Arithmetic and Output",
      "explanation": "## Arithmetic Operators\n\nJava provides five core arithmetic **operators** for numbers:\n\n- `+` addition\n- `-` subtraction\n- `*` multiplication\n- `/` division\n- `%` modulus (remainder)\n\nWhen both operands are `int`, the result is an `int`. This lesson focuses on integer math with `+`, `-`, and `*`; division is covered next.\n\n```java\nint a = 7;\nint b = 3;\nint sum = a + b;   // 10\nint diff = a - b;  // 4\nint prod = a * b;  // 21\n```\n\n## Printing Output\n\nJava has two main ways to send text to the console:\n\n- **System.out.println(x)** prints `x` then moves to a **new line**.\n- **System.out.print(x)** prints `x` and stays on the **same line**.\n\n```java\nSystem.out.print(\"Sum: \");\nSystem.out.println(10);   // Sum: 10\nSystem.out.print(5);\nSystem.out.print(6);      // 56 on one line\n```\n\nNotice how `print` lets you build a line piece by piece, while `println` finishes the line.\n\n## String Concatenation\n\nThe `+` operator does double duty. With numbers it adds; with a **String** on either side it **concatenates** (joins text):\n\n```java\nint total = 25;\nSystem.out.println(\"Total = \" + total);  // Total = 25\n```\n\nHere `total` is converted to text and glued after `\"Total = \"`. Be careful: `\"x\" + 2 + 3` produces `x23` (left to right), but `2 + 3 + \"x\"` produces `5x` because the numeric addition happens first.\n\n## Putting It Together\n\nMost programs read input, compute with arithmetic, and print a result. Mastering integer operators plus `print`/`println` lets you produce exactly the output a problem requires — spacing and newlines included. The exam frequently tests whether you can predict console output precisely, so trace each statement carefully.",
      "key_terms": [
        {
          "term": "Operator",
          "definition": "A symbol such as +, -, *, /, or % that performs a computation on one or more operands."
        },
        {
          "term": "Concatenation",
          "definition": "Joining strings (and converting numbers to text) using the + operator when at least one operand is a String."
        },
        {
          "term": "println",
          "definition": "A method that prints its argument to the console and then advances to a new line."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does System.out.println(\"x\" + 2 + 3); print?",
          "options": [
            "x5",
            "x23",
            "5x",
            "23x"
          ],
          "correct_index": 1,
          "explanation": "Evaluation is left to right. \"x\" + 2 is the String \"x2\", then \"x2\" + 3 is \"x23\"."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the difference between print and println?",
          "options": [
            "println prints faster",
            "println adds a newline after output; print does not",
            "print adds a newline; println does not",
            "They are identical"
          ],
          "correct_index": 1,
          "explanation": "println advances to a new line after printing, while print leaves the cursor on the same line."
        },
        {
          "question": "What does 2 + 3 + \"pts\" evaluate to?",
          "options": [
            "23pts",
            "5pts",
            "pts5",
            "5"
          ],
          "correct_index": 1,
          "explanation": "2 + 3 is computed first as int addition giving 5, then 5 + \"pts\" concatenates to \"5pts\"."
        }
      ],
      "challenge_title": "Labeled Sum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read two ints a and b, print \"Sum: \" followed by a+b on one line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(\"Sum: \" + (a + b));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "7 3",
          "expected_output": "Sum: 10"
        },
        {
          "input": "0 0",
          "expected_output": "Sum: 0"
        },
        {
          "input": "-4 9",
          "expected_output": "Sum: 5"
        }
      ]
    },
    {
      "id": "csa-01-l4",
      "project_id": "csa-01",
      "order": 4,
      "title": "Integer vs Double Division",
      "explanation": "## Division Depends on Types\n\nThe `/` operator behaves very differently depending on the **types** of its operands. This is one of the most tested and most error-prone ideas in Unit 1.\n\n### Integer Division\n\nWhen **both operands are int**, Java performs **integer division**: it divides and **truncates** (throws away) any fractional part — it does not round.\n\n```java\nint a = 7 / 2;   // 3, not 3.5\nint b = 9 / 4;   // 2\nint c = 1 / 2;   // 0\n```\n\nThe remainder is simply discarded. `7 / 2` is `3` because 2 goes into 7 three full times. Truncation always moves toward zero, so `-7 / 2` is `-3`.\n\n### Double Division\n\nIf **at least one operand is a double**, Java performs **floating-point division** and keeps the fractional part:\n\n```java\ndouble x = 7.0 / 2;   // 3.5\ndouble y = 7 / 2.0;   // 3.5\ndouble z = 7.0 / 2.0; // 3.5\n```\n\nEven one double \"promotes\" the whole expression to double arithmetic. This is called **type promotion**.\n\n## A Classic Trap\n\nConsider:\n\n```java\ndouble result = 7 / 2;   // result is 3.0, NOT 3.5\n```\n\nWhy? The right side `7 / 2` is computed **first** using int division (both are ints), giving `3`. Only then is `3` stored into the double, becoming `3.0`. The variable's type does **not** change how the expression is evaluated — the operand types do.\n\nTo get `3.5`, make an operand a double **before** dividing:\n\n```java\ndouble result = 7.0 / 2;  // 3.5\n```\n\n## Why It Matters\n\nComputing averages, percentages, and rates almost always requires double division. Forgetting to promote an operand silently produces wrong, truncated answers. Always ask: are both operands int? If so, expect truncation.",
      "key_terms": [
        {
          "term": "Integer division",
          "definition": "Division where both operands are int; the result is an int with the fractional part truncated toward zero."
        },
        {
          "term": "Truncation",
          "definition": "Discarding the fractional part of a division result without rounding, e.g. 7/2 becomes 3."
        },
        {
          "term": "Type promotion",
          "definition": "When mixing int and double in an expression, the int is converted to double so the whole expression uses double arithmetic."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of (9 / 2) when both are ints?",
          "options": [
            "4.5",
            "5",
            "4",
            "4.0"
          ],
          "correct_index": 2,
          "explanation": "Integer division truncates: 9 / 2 is 4 (the .5 is discarded), and the result is an int, not 4.0."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does double r = 5 / 2; store in r?",
          "options": [
            "2.5",
            "2.0",
            "3.0",
            "2"
          ],
          "correct_index": 1,
          "explanation": "5 / 2 is evaluated first as int division giving 2, then stored as a double, becoming 2.0."
        },
        {
          "question": "How do you make 5 / 2 produce 2.5?",
          "options": [
            "Store it in a double variable",
            "Write 5.0 / 2",
            "Use parentheses (5 / 2)",
            "It is impossible"
          ],
          "correct_index": 1,
          "explanation": "Making an operand a double (5.0 / 2) promotes the expression to double division, yielding 2.5."
        }
      ],
      "challenge_title": "True Average of Two",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read two ints, print their average as a double (e.g. 5 and 2 -> 3.5)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        double avg = (a + b) / 2.0;\n        System.out.println(avg);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5 2",
          "expected_output": "3.5"
        },
        {
          "input": "4 4",
          "expected_output": "4.0"
        },
        {
          "input": "10 3",
          "expected_output": "6.5"
        }
      ]
    },
    {
      "id": "csa-01-l5",
      "project_id": "csa-01",
      "order": 5,
      "title": "The Modulus Operator",
      "explanation": "## What Modulus Computes\n\nThe **modulus operator** `%` returns the **remainder** after integer division. While `/` gives the quotient, `%` gives what is left over.\n\n```java\nint r1 = 7 % 3;   // 1  (7 = 2*3 + 1)\nint r2 = 10 % 5;  // 0  (divides evenly)\nint r3 = 4 % 9;   // 4  (9 goes into 4 zero times, remainder 4)\n```\n\nA helpful identity: for positive ints, `a == (a / b) * b + (a % b)`. The quotient and remainder fit back together perfectly.\n\n## Extremely Common Uses\n\nModulus is one of the most useful operators in all of programming:\n\n- **Even or odd**: `n % 2 == 0` is true exactly when `n` is even.\n- **Divisibility**: `n % k == 0` means `n` is divisible by `k`.\n- **Last digit**: `n % 10` extracts the ones digit of a number.\n- **Wrapping / cycling**: `(i + 1) % size` cycles an index back to 0.\n\n```java\nint n = 47;\nint lastDigit = n % 10;   // 7\nboolean isEven = n % 2 == 0; // false\n```\n\n## Combining / and %\n\nTogether, `/` and `%` let you break a number apart:\n\n```java\nint total = 137;\nint dollars = total / 100;  // 1\nint cents = total % 100;    // 37\n```\n\nThis pattern converts a count of pennies into dollars and cents, or seconds into minutes and seconds.\n\n## Behavior with Negatives\n\nIn Java, the result of `%` takes the **sign of the left operand**:\n\n```java\nint x = -7 % 3;   // -1\nint y = 7 % -3;   //  1\n```\n\nThe AP exam focuses on non-negative operands, but knowing this avoids surprises. Modulus only works with integer types in AP CSA — applying it to typical int values produces an int remainder. Master `%` and a huge family of problems (digit manipulation, cycles, parity checks) becomes straightforward.",
      "key_terms": [
        {
          "term": "Modulus",
          "definition": "The % operator, which returns the integer remainder after dividing the left operand by the right operand."
        },
        {
          "term": "Parity",
          "definition": "Whether a number is even or odd, commonly tested with n % 2 == 0."
        },
        {
          "term": "Quotient",
          "definition": "The whole-number result of integer division, paired with the remainder produced by modulus."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is 23 % 10?",
          "options": [
            "2",
            "3",
            "20",
            "0"
          ],
          "correct_index": 1,
          "explanation": "23 divided by 10 is 2 remainder 3, so 23 % 10 is 3 — this extracts the last digit."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which expression is true only when n is even?",
          "options": [
            "n / 2 == 0",
            "n % 2 == 0",
            "n % 2 == 1",
            "n * 2 == 0"
          ],
          "correct_index": 1,
          "explanation": "An even number has no remainder when divided by 2, so n % 2 == 0 detects evenness."
        },
        {
          "question": "What is 5 % 8?",
          "options": [
            "0",
            "5",
            "1",
            "8"
          ],
          "correct_index": 1,
          "explanation": "8 goes into 5 zero times with remainder 5, so 5 % 8 is 5."
        }
      ],
      "challenge_title": "Split Into Tens and Ones",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read an int n (0..99), print tens digit then ones digit on separate lines\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int tens = n / 10;\n        int ones = n % 10;\n        System.out.println(tens);\n        System.out.println(ones);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "47",
          "expected_output": "4\n7"
        },
        {
          "input": "9",
          "expected_output": "0\n9"
        },
        {
          "input": "80",
          "expected_output": "8\n0"
        }
      ]
    },
    {
      "id": "csa-01-l6",
      "project_id": "csa-01",
      "order": 6,
      "title": "Operator Precedence",
      "explanation": "## Order of Operations\n\nWhen an expression mixes operators, Java evaluates them in a fixed order called **operator precedence** — its version of \"PEMDAS\". Higher-precedence operators are applied first.\n\nFrom highest to lowest for AP CSA arithmetic:\n\n1. **Parentheses** `( )`\n2. **Multiplicative**: `*`, `/`, `%` (same level)\n3. **Additive**: `+`, `-` (same level)\n\n```java\nint x = 2 + 3 * 4;     // 14, not 20 (3*4 first)\nint y = (2 + 3) * 4;   // 20 (parentheses first)\nint z = 10 - 2 - 3;    // 5  (left to right)\n```\n\n## Associativity\n\nWhen operators share the same precedence, Java uses **left-to-right associativity**: it evaluates from left to right.\n\n```java\nint a = 20 / 4 / 2;   // (20 / 4) / 2 = 5 / 2 = 2\nint b = 17 % 5 * 2;   // (17 % 5) * 2 = 2 * 2 = 4\n```\n\nBecause `/`, `*`, and `%` are equal precedence, `17 % 5 * 2` does the modulus first (leftmost), then multiplies.\n\n## Parentheses Make Intent Clear\n\nEven when not strictly required, parentheses improve readability and prevent mistakes:\n\n```java\ndouble avg = (a + b + c) / 3.0;  // sum first, then divide\n```\n\nWithout the parentheses, `a + b + c / 3.0` would divide only `c` by 3.0 — a common bug.\n\n## Tracing an Expression\n\nTo evaluate by hand, repeatedly find the highest-precedence operator (leftmost on ties) and reduce:\n\n```java\nint r = 4 + 6 / 2 * 3 - 1;\n// 6 / 2     -> 3   : 4 + 3 * 3 - 1\n// 3 * 3     -> 9   : 4 + 9 - 1\n// 4 + 9     -> 13  : 13 - 1\n// 13 - 1    -> 12\n```\n\nThe answer is `12`. The exam loves expressions like this, mixing `*`, `/`, `%`, `+`, and `-`. Apply precedence and left-to-right associativity carefully, and use parentheses in your own code to remove all doubt.",
      "key_terms": [
        {
          "term": "Operator precedence",
          "definition": "The fixed ordering that determines which operators are evaluated first in an expression; *, /, % outrank + and -."
        },
        {
          "term": "Associativity",
          "definition": "The rule (left-to-right in Java arithmetic) for evaluating operators of equal precedence."
        },
        {
          "term": "Parentheses",
          "definition": "Grouping symbols that have the highest precedence and force part of an expression to evaluate first."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of 2 + 3 * 4 - 1?",
          "options": [
            "19",
            "13",
            "20",
            "11"
          ],
          "correct_index": 1,
          "explanation": "Multiplication first: 3*4 is 12, then 2 + 12 - 1 evaluates left to right to 13."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does 20 / 4 / 2 evaluate to?",
          "options": [
            "10",
            "2",
            "2.5",
            "5"
          ],
          "correct_index": 1,
          "explanation": "Equal precedence means left-to-right: (20/4) is 5, then 5/2 is 2 with integer truncation."
        },
        {
          "question": "Why use parentheses in (a + b) / 2.0?",
          "options": [
            "They are required by Java",
            "To add a and b before dividing",
            "To make it a double",
            "They have no effect"
          ],
          "correct_index": 1,
          "explanation": "Without parentheses, only b would be divided by 2.0 due to precedence; the parentheses force the sum first."
        }
      ],
      "challenge_title": "Evaluate the Expression",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read ints a, b, c and print a + b * c - a / b (use int arithmetic)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        int result = a + b * c - a / b;\n        System.out.println(result);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "10 2 3",
          "expected_output": "11"
        },
        {
          "input": "6 3 4",
          "expected_output": "16"
        },
        {
          "input": "8 4 5",
          "expected_output": "26"
        }
      ]
    },
    {
      "id": "csa-01-l7",
      "project_id": "csa-01",
      "order": 7,
      "title": "Casting Between Types",
      "explanation": "## Why Cast?\n\nSometimes you need to convert a value from one primitive type to another. A **cast** explicitly tells Java to treat a value as a different type. The syntax is the target type in parentheses before the value:\n\n```java\ndouble d = 9.7;\nint n = (int) d;   // 9  -- fractional part dropped\n```\n\n## int to double (Widening)\n\nConverting an `int` to a `double` is a **widening** conversion. It is safe and Java does it automatically (implicitly), but you may cast explicitly for clarity:\n\n```java\nint count = 7;\ndouble x = count;         // implicit widening -> 7.0\ndouble y = (double) count; // explicit, same result\n```\n\n## double to int (Narrowing)\n\nConverting a `double` to an `int` is a **narrowing** conversion. It can lose information, so Java requires an **explicit cast**. Casting to int **truncates** — it drops the fractional part, it does NOT round:\n\n```java\nint a = (int) 3.99;   // 3, not 4\nint b = (int) 8.2;    // 8\nint c = (int) -2.9;   // -2 (toward zero)\n```\n\n## The Most Important Use: Forcing Double Division\n\nRecall that int / int truncates. Casting one operand to double fixes this:\n\n```java\nint total = 7;\nint count = 2;\ndouble avg = (double) total / count;  // 3.5\n```\n\nThe cast `(double) total` makes the left operand a double, so the division is double division. Watch precedence: a cast binds **tighter** than `/`, so `(double) total / count` casts `total` first, then divides. Compare:\n\n```java\ndouble wrong = (double)(total / count);  // 3.0 -- int division happened first!\ndouble right = (double) total / count;   // 3.5\n```\n\n## Rounding by Hand\n\nSince casting truncates, round a positive double by adding 0.5 first:\n\n```java\ndouble val = 3.7;\nint rounded = (int)(val + 0.5);  // 4\n```\n\nCasting is essential for averages, percentages, and controlling exactly how numbers convert. Always remember: double-to-int truncates toward zero.",
      "key_terms": [
        {
          "term": "Cast",
          "definition": "An explicit conversion of a value from one type to another, written as (type) value."
        },
        {
          "term": "Widening",
          "definition": "A safe conversion to a larger type, such as int to double, performed implicitly by Java."
        },
        {
          "term": "Narrowing",
          "definition": "A potentially lossy conversion to a smaller type, such as double to int, which requires an explicit cast and truncates."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does (int) 7.89 evaluate to?",
          "options": [
            "8",
            "7",
            "7.89",
            "7.0"
          ],
          "correct_index": 1,
          "explanation": "Casting a double to int truncates the fractional part without rounding, so (int) 7.89 is 7."
        }
      ],
      "quiz_questions": [
        {
          "question": "How do you correctly compute the double quotient of int a divided by int b?",
          "options": [
            "(double)(a / b)",
            "(double) a / b",
            "a / (double) b only works",
            "double a / b"
          ],
          "correct_index": 1,
          "explanation": "(double) a / b casts a first (cast binds tighter than /), forcing double division. (double)(a/b) truncates first."
        },
        {
          "question": "What is (int)(2.9 + 0.5)?",
          "options": [
            "2",
            "3",
            "4",
            "3.4"
          ],
          "correct_index": 1,
          "explanation": "2.9 + 0.5 is 3.4, and casting to int truncates to 3 — this is the round-half-up trick for positive values."
        }
      ],
      "challenge_title": "Percentage Score",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read ints earned and total, print the percentage as a double (earned/total*100)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int earned = sc.nextInt();\n        int total = sc.nextInt();\n        double percent = (double) earned / total * 100;\n        System.out.println(percent);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "1 2",
          "expected_output": "50.0"
        },
        {
          "input": "3 4",
          "expected_output": "75.0"
        },
        {
          "input": "1 8",
          "expected_output": "12.5"
        }
      ]
    },
    {
      "id": "csa-01-l8",
      "project_id": "csa-01",
      "order": 8,
      "title": "Compound Assignment Operators",
      "explanation": "## Updating a Variable\n\nPrograms constantly update variables based on their current value — adding to a running total, decreasing a counter, scaling a number. The long form is:\n\n```java\nint score = 10;\nscore = score + 5;   // score is now 15\n```\n\nThis reads the old `score`, adds 5, and stores the result back. Because this pattern is so common, Java offers **compound assignment operators** that do the same thing more concisely.\n\n## The Compound Operators\n\nEach combines an arithmetic operator with `=`:\n\n- `+=` add and assign\n- `-=` subtract and assign\n- `*=` multiply and assign\n- `/=` divide and assign\n- `%=` mod and assign\n\n```java\nint x = 10;\nx += 5;   // x = x + 5  -> 15\nx -= 3;   // x = x - 3  -> 12\nx *= 2;   // x = x * 2  -> 24\nx /= 5;   // x = x / 5  -> 4  (int division!)\nx %= 3;   // x = x % 3  -> 1\n```\n\n`x += 5` is exactly equivalent to `x = x + 5`. The same type rules apply: `x /= 5` uses integer division when `x` is an int.\n\n## Increment and Decrement\n\nFor adding or subtracting exactly 1, Java provides shortcuts:\n\n- `x++` increment by 1 (same as `x += 1`)\n- `x--` decrement by 1 (same as `x -= 1`)\n\n```java\nint count = 0;\ncount++;   // 1\ncount++;   // 2\ncount--;   // 1\n```\n\nThese appear constantly in loops to advance a counter.\n\n## Compound Operators with Doubles\n\nCompound operators work on doubles too, following double arithmetic:\n\n```java\ndouble total = 100.0;\ntotal *= 1.1;   // 110.0\ntotal /= 4;     // 27.5\n```\n\n## Why They Matter\n\nCompound assignment makes accumulation code shorter and clearer, and `++`/`--` are the standard way to step counters. They are heavily used in loops and array processing later in the course. Just remember they inherit the same int-versus-double behavior as their full-form equivalents — `count /= 2` on an int still truncates.\n\nWith primitives, literals, arithmetic, division rules, modulus, precedence, casting, and compound assignment, you now command the full toolkit of Unit 1.",
      "key_terms": [
        {
          "term": "Compound assignment",
          "definition": "An operator like += or *= that combines an arithmetic operation with assignment, so x += 5 means x = x + 5."
        },
        {
          "term": "Increment",
          "definition": "The ++ operator, which adds 1 to a variable; x++ is equivalent to x = x + 1."
        },
        {
          "term": "Accumulation",
          "definition": "Repeatedly updating a variable to build up a running total or product, commonly with compound operators."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After int x = 8; x /= 3; what is x?",
          "options": [
            "2.67",
            "3",
            "2",
            "2.0"
          ],
          "correct_index": 2,
          "explanation": "x /= 3 means x = x / 3, and since x is an int this is integer division: 8 / 3 truncates to 2."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which statement is equivalent to total = total + amount;?",
          "options": [
            "total =+ amount;",
            "total += amount;",
            "total ++ amount;",
            "total =: amount;"
          ],
          "correct_index": 1,
          "explanation": "The compound operator += adds the right side to the variable, so total += amount; is equivalent."
        },
        {
          "question": "After int n = 5; n *= 2; n -= 3; what is n?",
          "options": [
            "7",
            "4",
            "10",
            "13"
          ],
          "correct_index": 0,
          "explanation": "n *= 2 makes n = 10, then n -= 3 makes n = 7."
        }
      ],
      "challenge_title": "Running Total",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: start at 0, read four ints, use += to accumulate, print the total\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int total = 0;\n        total += sc.nextInt();\n        total += sc.nextInt();\n        total += sc.nextInt();\n        total += sc.nextInt();\n        System.out.println(total);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "1 2 3 4",
          "expected_output": "10"
        },
        {
          "input": "10 20 30 40",
          "expected_output": "100"
        },
        {
          "input": "-5 5 -3 3",
          "expected_output": "0"
        }
      ]
    }
  ]
}
