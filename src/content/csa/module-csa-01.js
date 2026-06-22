// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-01",
    "title": "Primitive Types",
    "description": "An introduction to Java's primitive data types covering int, double, and boolean, type casting, integer division, arithmetic operators, and console output.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 201,
    "track": "apcsa",
    "unit": "Unit 1 — Primitive Types",
    "tags": [
      "int/double/boolean",
      "integer division",
      "casting"
    ]
  },
  "lessons": [
    {
      "id": "csa-01-l1",
      "project_id": "csa-01",
      "order": 1,
      "title": "Primitive Types and Output",
      "explanation": "## What Are Primitive Types?\n\nIn Java, a **primitive type** is a built-in data type that stores a single, simple value directly in memory. Unlike objects, primitives are not built from a class and have no methods. The AP Computer Science A subset focuses on exactly three primitives:\n\n- **int** — stores whole numbers (no fractional part), such as `-5`, `0`, or `42`. The range is roughly -2.1 billion to 2.1 billion.\n- **double** — stores real numbers with a decimal point, such as `3.14` or `-0.5`. Doubles handle fractional values.\n- **boolean** — stores only one of two values: `true` or `false`.\n\n## Declaring and Initializing Variables\n\nA **declaration** tells Java the type and name of a variable. **Initialization** gives it a starting value. You can combine both in one statement:\n\n```java\nint score = 100;\ndouble price = 4.99;\nboolean isReady = true;\n```\n\nEvery statement ends with a semicolon. Variable names follow **camelCase** by convention: start lowercase, capitalize each new word.\n\n## Producing Output\n\nThe most common way to display values is `System.out.println`, which prints its argument and then moves to a new line:\n\n```java\nint age = 17;\nSystem.out.println(age);        // prints 17 then newline\nSystem.out.print(\"Hi\");        // prints Hi, NO newline\nSystem.out.println(\" there\"); // prints  there then newline\n```\n\nUse `System.out.print` (no `ln`) when you do not want a line break. You can join text and values with the `+` operator, which performs **string concatenation** when one side is a String:\n\n```java\nint x = 5;\nSystem.out.println(\"Value: \" + x); // prints Value: 5\n```\n\n## Reading Input\n\nTo read values typed by a user, AP CSA uses the **Scanner** class. You must import it first:\n\n```java\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();        // reads one int\n    double d = sc.nextDouble();  // reads one double\n    System.out.println(n + d);\n  }\n}\n```\n\nKey **Scanner** methods: `nextInt()`, `nextDouble()`, and `nextBoolean()`. Each reads the next value of that type from input. Choosing the correct type for each variable is the foundation of everything else in this course.",
      "key_terms": [
        {
          "term": "primitive type",
          "definition": "A built-in Java type (int, double, boolean) that stores a single simple value directly rather than an object."
        },
        {
          "term": "declaration",
          "definition": "A statement that specifies the type and name of a variable, such as int x;"
        },
        {
          "term": "Scanner",
          "definition": "A class from java.util used to read typed input via methods like nextInt() and nextDouble()."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which primitive type should store the value 3.75?",
          "options": [
            "int",
            "double",
            "boolean",
            "String"
          ],
          "correct_index": 1,
          "explanation": "3.75 has a fractional part, so it must be stored in a double. An int can only hold whole numbers."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does System.out.print(\"A\") followed by System.out.println(\"B\") output?",
          "options": [
            "A then a new line then B",
            "AB on the same line then a newline",
            "B then A",
            "A B with a space between"
          ],
          "correct_index": 1,
          "explanation": "print does not add a newline, so A and B appear together as AB, and then println adds the newline after B."
        },
        {
          "question": "Which declaration is valid for storing the value true?",
          "options": [
            "int flag = true;",
            "double flag = true;",
            "boolean flag = true;",
            "boolean flag = \"true\";"
          ],
          "correct_index": 2,
          "explanation": "A boolean variable holds true or false. It cannot hold an int, double, or a String literal."
        }
      ],
      "challenge_title": "Profile Printer",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        double height = sc.nextDouble();\n        // TODO: read a boolean named isStudent, then print the three lines described\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        double height = sc.nextDouble();\n        boolean isStudent = sc.nextBoolean();\n        System.out.println(\"Age: \" + age);\n        System.out.println(\"Height: \" + height);\n        System.out.println(\"Student: \" + isStudent);\n    }\n}\n",
      "challenge_description": "Read an int (age), a double (height), and a boolean (isStudent) from standard input, each separated by whitespace. Print three lines exactly in this format:\nAge: <age>\nHeight: <height>\nStudent: <isStudent>",
      "challenge_test_cases": [
        {
          "input": "17 5.8 true",
          "expected_output": "Age: 17\nHeight: 5.8\nStudent: true"
        },
        {
          "input": "25 6.0 false",
          "expected_output": "Age: 25\nHeight: 6.0\nStudent: false"
        },
        {
          "input": "8 4.25 true",
          "expected_output": "Age: 8\nHeight: 4.25\nStudent: true"
        }
      ]
    },
    {
      "id": "csa-01-l2",
      "project_id": "csa-01",
      "order": 2,
      "title": "Arithmetic Operators and Integer Division",
      "explanation": "## Arithmetic Operators\n\nJava provides five basic **arithmetic operators** for numeric values:\n\n- `+` addition\n- `-` subtraction\n- `*` multiplication\n- `/` division\n- `%` modulus (remainder)\n\nThese follow standard math **operator precedence**: `*`, `/`, and `%` are evaluated before `+` and `-`. Parentheses override precedence and are evaluated first.\n\n```java\nint result = 2 + 3 * 4;   // 14, not 20\nint forced = (2 + 3) * 4; // 20\n```\n\n## Integer Division\n\nThe most important and trap-filled rule in this unit is **integer division**. When BOTH operands of `/` are of type `int`, Java performs integer division: the result is the whole-number quotient with the fractional part **truncated** (dropped, not rounded).\n\n```java\nint a = 7 / 2;   // 3, not 3.5\nint b = 10 / 4;  // 2\nint c = 5 / 8;   // 0\n```\n\nTruncation always rounds **toward zero**, so `-7 / 2` is `-3`. To get a real-number result, at least one operand must be a `double`:\n\n```java\ndouble d = 7.0 / 2;  // 3.5\ndouble e = 7 / 2.0;  // 3.5\n```\n\n## The Modulus Operator\n\nThe `%` operator returns the **remainder** after integer division. It is extremely useful:\n\n```java\nint r = 17 % 5;  // 2  (17 = 3*5 + 2)\nint even = 8 % 2; // 0  -> 8 is even\nint last = 1234 % 10; // 4 -> last digit\n```\n\nCommon uses include:\n\n- Testing if a number is even: `n % 2 == 0`\n- Extracting the last digit: `n % 10`\n- Wrapping around a range (clock arithmetic)\n\n## Combining Division and Modulus\n\nTogether, `/` and `%` split a number into parts. For example, converting total minutes into hours and minutes:\n\n```java\nint total = 137;\nint hours = total / 60;   // 2\nint mins = total % 60;    // 17\nSystem.out.println(hours + \"h \" + mins + \"m\"); // 2h 17m\n```\n\nMastering when division truncates versus produces a decimal is essential, because mixing up `int` and `double` here is one of the most common AP exam mistakes.",
      "key_terms": [
        {
          "term": "integer division",
          "definition": "Division where both operands are int; the result is the truncated whole-number quotient with no fractional part."
        },
        {
          "term": "modulus",
          "definition": "The % operator, which returns the remainder after integer division."
        },
        {
          "term": "operator precedence",
          "definition": "The order in which operators are evaluated; *, /, and % are applied before + and -."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of 17 / 5 in Java?",
          "options": [
            "3.4",
            "3",
            "4",
            "2"
          ],
          "correct_index": 1,
          "explanation": "Both operands are ints, so integer division truncates 3.4 to 3."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the value of 13 % 4?",
          "options": [
            "3",
            "1",
            "4",
            "0"
          ],
          "correct_index": 1,
          "explanation": "13 divided by 4 is 3 remainder 1, so 13 % 4 equals 1."
        },
        {
          "question": "Which expression evaluates to 2.5?",
          "options": [
            "5 / 2",
            "5 % 2",
            "5.0 / 2",
            "(int)(5 / 2)"
          ],
          "correct_index": 2,
          "explanation": "5.0 / 2 has a double operand, so division produces 2.5. 5 / 2 is integer division giving 2."
        }
      ],
      "challenge_title": "Seconds to Time",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int totalSeconds = sc.nextInt();\n        // TODO: compute hours, minutes, seconds using / and %, then print H:M:S\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int totalSeconds = sc.nextInt();\n        int hours = totalSeconds / 3600;\n        int minutes = (totalSeconds % 3600) / 60;\n        int seconds = totalSeconds % 60;\n        System.out.println(hours + \":\" + minutes + \":\" + seconds);\n    }\n}\n",
      "challenge_description": "Read a single non-negative int representing a total number of seconds. Convert it into hours, minutes, and seconds using integer division and modulus. Print the result on one line in the format H:M:S (for example, 3661 becomes 1:1:1).",
      "challenge_test_cases": [
        {
          "input": "3661",
          "expected_output": "1:1:1"
        },
        {
          "input": "59",
          "expected_output": "0:0:59"
        },
        {
          "input": "7325",
          "expected_output": "2:2:5"
        }
      ]
    },
    {
      "id": "csa-01-l3",
      "project_id": "csa-01",
      "order": 3,
      "title": "Type Casting Between int and double",
      "explanation": "## Why Casting Matters\n\nBecause `int` and `double` behave differently, you often need to convert a value from one type to the other. This conversion is called **casting**. There are two kinds: widening (automatic) and narrowing (explicit).\n\n## Widening Conversion (Automatic)\n\nAssigning an `int` to a `double` is always safe because every whole number fits in a double. Java does this **automatically**, called a **widening conversion**:\n\n```java\nint x = 5;\ndouble y = x;   // y becomes 5.0, no cast needed\n```\n\nThis also happens inside expressions: if one operand of an operation is a `double`, the `int` operand is promoted to `double` first.\n\n## Narrowing Conversion (Explicit Cast)\n\nGoing from `double` to `int` can lose information (the fractional part), so Java requires you to ask for it explicitly with a **cast operator**: the target type in parentheses.\n\n```java\ndouble price = 4.99;\nint dollars = (int) price;  // 4  -> fraction truncated\n```\n\nCasting a double to an int **truncates** toward zero. It does NOT round: `(int) 4.99` is `4`, and `(int) -2.7` is `-2`.\n\n## The Casting Trick for Real Division\n\nRecall that `int / int` truncates. To force real division, cast one operand to `double`:\n\n```java\nint a = 7, b = 2;\ndouble avg = (double) a / b;  // 3.5\n```\n\nBe careful with placement. The cast binds tightly to `a`, so `(double) a / b` casts `a` first, then divides as doubles. But `(double)(a / b)` does integer division FIRST (giving 3), then casts to `3.0`, which is wrong.\n\n## Rounding Instead of Truncating\n\nTo round to the nearest whole number rather than truncate, add `0.5` before casting (for non-negative values):\n\n```java\ndouble value = 4.7;\nint rounded = (int)(value + 0.5);  // 5\n```\n\n- Widening (`int` to `double`): automatic, safe.\n- Narrowing (`double` to `int`): needs `(int)`, truncates.\n- Cast position changes the result, so think about precedence.\n\nUnderstanding casting lets you control exactly when math stays whole and when it keeps decimals.",
      "key_terms": [
        {
          "term": "casting",
          "definition": "Converting a value from one type to another, such as from double to int."
        },
        {
          "term": "widening conversion",
          "definition": "An automatic, safe conversion from a smaller type to a larger one, such as int to double."
        },
        {
          "term": "narrowing conversion",
          "definition": "An explicit conversion that may lose data, such as (int) on a double, which truncates the fraction."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of (int) 8.95?",
          "options": [
            "9",
            "8",
            "8.95",
            "0"
          ],
          "correct_index": 1,
          "explanation": "Casting a double to int truncates the fractional part, leaving 8. It does not round up."
        }
      ],
      "quiz_questions": [
        {
          "question": "Given int a = 9, b = 4; which expression gives 2.25?",
          "options": [
            "a / b",
            "(double) a / b",
            "(double)(a / b)",
            "a % b"
          ],
          "correct_index": 1,
          "explanation": "(double) a / b casts a to 9.0 first, so the division is double division giving 2.25. (double)(a / b) truncates first to 2 then casts to 2.0."
        },
        {
          "question": "Which conversion happens automatically without a cast operator?",
          "options": [
            "double to int",
            "int to double",
            "double to boolean",
            "boolean to int"
          ],
          "correct_index": 1,
          "explanation": "int to double is a widening conversion and happens automatically. Going from double to int requires an explicit (int) cast."
        }
      ],
      "challenge_title": "Average of Three",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        // TODO: print the exact average as a double using casting\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        int sum = a + b + c;\n        double average = (double) sum / 3;\n        System.out.println(average);\n    }\n}\n",
      "challenge_description": "Read three ints from standard input. Compute their average as a double using casting so the fractional part is preserved, then print the average. For example, the inputs 1 2 4 sum to 7, and 7 / 3 as real division is approximately 2.3333333333333335.",
      "challenge_test_cases": [
        {
          "input": "1 2 4",
          "expected_output": "2.3333333333333335"
        },
        {
          "input": "2 2 2",
          "expected_output": "2.0"
        },
        {
          "input": "3 4 5",
          "expected_output": "4.0"
        }
      ]
    }
  ]
}
