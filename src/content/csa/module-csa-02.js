// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-02",
    "title": "Using Objects",
    "description": "Covers how to create and use objects in Java by calling methods, working with String and Math methods, wrapper classes, and understanding object references.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 202,
    "track": "apcsa",
    "unit": "Unit 2 — Using Objects",
    "tags": [
      "String methods",
      "Math",
      "references"
    ]
  },
  "lessons": [
    {
      "id": "csa-02-l1",
      "project_id": "csa-02",
      "order": 1,
      "title": "Objects, References, and Calling Methods",
      "explanation": "## Objects and References\n\nIn Java, an **object** is an instance of a class. You create an object with the **`new`** keyword, which calls a **constructor**. The variable does not hold the object itself; it holds a **reference** (the memory address) to the object.\n\n```java\nString a = new String(\"cat\");\nString b = a;   // b refers to the SAME object as a\n```\n\nBoth `a` and `b` point to one object. Variables of class types are called **reference variables**, while `int`, `double`, and `boolean` are **primitive** types that store values directly.\n\n## null\n\nA reference variable that points to no object has the value **`null`**. Calling a method on a `null` reference throws a `NullPointerException`.\n\n```java\nString s = null;\n// s.length(); // would crash: NullPointerException\n```\n\n## Calling Methods\n\nTo use an object's behavior you **call a method** using **dot notation**: `objectReference.methodName(arguments)`.\n\n- A method may take **parameters** (the values you pass are **arguments**).\n- A **non-void** method **returns** a value you can store or use.\n- A **void** method performs an action but returns nothing.\n\n```java\nString name = \"Ada Lovelace\";\nint len = name.length();        // returns 12\nString up = name.toUpperCase(); // returns \"ADA LOVELACE\"\nSystem.out.println(len);        // void method called on System.out\n```\n\nThe object you call the method on is the **calling object** (also called the implicit parameter). Arguments must match the method's parameter types in order and type.\n\n## Key Ideas\n\n- `new` creates an object and returns a reference to it.\n- Two reference variables can **alias** the same object.\n- Strings are **immutable**: methods like `toUpperCase` return a *new* String and never change the original.\n- Always check that a reference is not `null` before calling a method on it.\n\nUnderstanding references is essential: assigning one reference to another copies the *address*, not the object, so changes seen through one alias are visible through the other (for mutable objects).",
      "key_terms": [
        {
          "term": "reference variable",
          "definition": "A variable that stores the memory address of an object rather than the object's data itself."
        },
        {
          "term": "null",
          "definition": "A special value indicating a reference variable points to no object; calling a method on it throws a NullPointerException."
        },
        {
          "term": "dot notation",
          "definition": "The syntax objectReference.methodName(args) used to call a method on an object."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After `String b = a;`, what does `b` store?",
          "options": [
            "A separate copy of the object",
            "The same reference as a",
            "The value null",
            "A primitive int"
          ],
          "correct_index": 1,
          "explanation": "Assigning one reference variable to another copies the reference (address), so b refers to the same object as a."
        }
      ],
      "quiz_questions": [
        {
          "question": "What happens when you call a method on a reference variable whose value is null?",
          "options": [
            "It returns 0",
            "It returns an empty String",
            "It throws a NullPointerException",
            "It silently does nothing"
          ],
          "correct_index": 2,
          "explanation": "Calling any method on a null reference throws a NullPointerException at runtime."
        },
        {
          "question": "Which statement creates a new object?",
          "options": [
            "int x = 5;",
            "String s = new String(\"hi\");",
            "boolean b = true;",
            "double d = 2.5;"
          ],
          "correct_index": 1,
          "explanation": "The new keyword invokes a constructor and creates an object. The others are primitive assignments."
        }
      ],
      "challenge_title": "Greeting Builder",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        // TODO: print the name in uppercase, then its length on the next line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        System.out.println(name.toUpperCase());\n        System.out.println(name.length());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Ada",
          "expected_output": "ADA\n3"
        },
        {
          "input": "hello world",
          "expected_output": "HELLO WORLD\n11"
        },
        {
          "input": "Java",
          "expected_output": "JAVA\n4"
        }
      ]
    },
    {
      "id": "csa-02-l2",
      "project_id": "csa-02",
      "order": 2,
      "title": "String Methods",
      "explanation": "## Working with Strings\n\nA **String** is an object that represents a sequence of characters. Strings are **immutable** — once created, their contents never change. Every String method that seems to modify a String actually returns a **new** String.\n\nString positions (indexes) start at **0**. A String of length `n` has valid indexes `0` through `n - 1`.\n\n## Essential AP CSA String Methods\n\n- **`length()`** — returns the number of characters.\n- **`substring(from)`** — returns the substring from index `from` to the end.\n- **`substring(from, to)`** — returns characters from index `from` up to **but not including** `to`.\n- **`indexOf(str)`** — returns the index of the first occurrence of `str`, or `-1` if not found.\n- **`equals(other)`** — returns `true` if both Strings have the same characters.\n- **`compareTo(other)`** — returns a negative number, `0`, or a positive number for lexicographic order.\n\n```java\nString s = \"computer\";\nint n = s.length();              // 8\nString part = s.substring(0, 4); // \"comp\"\nString tail = s.substring(4);    // \"uter\"\nint idx = s.indexOf(\"put\");      // 3\nboolean same = s.equals(\"computer\"); // true\n```\n\n## Comparing Strings\n\n**Never use `==` to compare String contents.** The `==` operator compares references (whether they are the same object), not characters. Use **`equals`** instead.\n\n```java\nString a = new String(\"hi\");\nString b = new String(\"hi\");\nSystem.out.println(a == b);      // false (different objects)\nSystem.out.println(a.equals(b)); // true  (same characters)\n```\n\n## Watch for Exceptions\n\n- `substring(from, to)` throws a `StringIndexOutOfBoundsException` if an index is out of range or `from > to`.\n- The length of `substring(from, to)` is exactly `to - from`.\n\n## Summary\n\n- Indexes are **zero-based**.\n- Strings are **immutable**; save the returned value.\n- Use **`equals`** (not `==`) for content comparison.\n- `indexOf` returns `-1` when the search string is absent.",
      "key_terms": [
        {
          "term": "immutable",
          "definition": "Describes an object whose state cannot be changed after creation; String methods return new Strings instead of modifying the original."
        },
        {
          "term": "substring",
          "definition": "A String method that returns part of a String; substring(from, to) includes from but excludes to."
        },
        {
          "term": "indexOf",
          "definition": "A String method returning the index of the first occurrence of a substring, or -1 if it is not present."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does \"computer\".substring(2, 5) return?",
          "options": [
            "\"ompu\"",
            "\"mput\"",
            "\"mpu\"",
            "\"ompute\""
          ],
          "correct_index": 2,
          "explanation": "substring(2, 5) takes indexes 2, 3, 4 (m, p, u) and excludes index 5, giving \"mpu\"."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is the correct way to test whether two Strings have the same characters?",
          "options": [
            "a == b",
            "a.equals(b)",
            "a.compareTo(b)",
            "a.indexOf(b)"
          ],
          "correct_index": 1,
          "explanation": "equals compares character contents. == compares references, and compareTo returns an ordering number, not a boolean."
        },
        {
          "question": "What does \"hello\".indexOf(\"z\") return?",
          "options": [
            "0",
            "5",
            "-1",
            "It throws an exception"
          ],
          "correct_index": 2,
          "explanation": "indexOf returns -1 when the search string is not found."
        }
      ],
      "challenge_title": "Initials and Length",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String full = sc.nextLine();\n        // TODO: print the first letter of the first word and first letter of the\n        // second word (the two initials joined), then the total length on a new line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String full = sc.nextLine();\n        int space = full.indexOf(\" \");\n        String first = full.substring(0, space);\n        String last = full.substring(space + 1);\n        String initials = first.substring(0, 1) + last.substring(0, 1);\n        System.out.println(initials);\n        System.out.println(full.length());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "Ada Lovelace",
          "expected_output": "AL\n12"
        },
        {
          "input": "grace hopper",
          "expected_output": "gh\n12"
        },
        {
          "input": "Alan Turing",
          "expected_output": "AT\n11"
        }
      ]
    },
    {
      "id": "csa-02-l3",
      "project_id": "csa-02",
      "order": 3,
      "title": "The Math Class and Wrapper Classes",
      "explanation": "## The Math Class\n\nThe **`Math`** class provides static methods for common math operations. Because they are **static**, you call them on the class itself, not on an object: `Math.methodName(args)`.\n\nKey AP CSA Math methods:\n\n- **`Math.abs(x)`** — absolute value of `x`.\n- **`Math.pow(base, exp)`** — `base` raised to `exp`, returns a `double`.\n- **`Math.sqrt(x)`** — square root, returns a `double`.\n- **`Math.random()`** — a `double` in the range `[0.0, 1.0)`.\n\n```java\nint a = Math.abs(-7);            // 7\ndouble p = Math.pow(2, 10);      // 1024.0\ndouble r = Math.sqrt(144);       // 12.0\n```\n\n### Random Integers\n\nTo generate a random integer in a range, scale `Math.random()`:\n\n```java\n// random int from low to high inclusive\nint value = (int)(Math.random() * (high - low + 1)) + low;\n```\n\n## Wrapper Classes\n\nA **wrapper class** lets you treat a primitive value as an object. The two on the AP exam are **`Integer`** (wraps `int`) and **`Double`** (wraps `double`).\n\n- **Autoboxing**: Java automatically converts a primitive to its wrapper. `Integer n = 5;`\n- **Unboxing**: Java automatically converts a wrapper back to a primitive. `int x = n;`\n\n```java\nInteger boxed = 42;          // autoboxing\nint unboxed = boxed;         // unboxing\nint big = Integer.MAX_VALUE; // useful constant\n```\n\nWrapper classes also provide parsing methods, though on the exam autoboxing/unboxing is the main focus.\n\n## Casting and Truncation\n\nWhen converting a `double` to an `int` with a cast, the value is **truncated** (the fractional part is dropped, not rounded).\n\n```java\ndouble d = 9.99;\nint i = (int) d; // 9, not 10\n```\n\n## Summary\n\n- `Math` methods are **static** — call them on the class.\n- `Math.random()` returns `[0.0, 1.0)`; scale and cast for integer ranges.\n- **Wrapper classes** `Integer` and `Double` box primitives so they can act like objects.\n- Casting a `double` to `int` **truncates**.",
      "key_terms": [
        {
          "term": "static method",
          "definition": "A method that belongs to a class rather than an object, called using ClassName.method(args), such as Math.sqrt."
        },
        {
          "term": "wrapper class",
          "definition": "A class such as Integer or Double that lets a primitive value be used as an object."
        },
        {
          "term": "autoboxing",
          "definition": "Automatic conversion by Java between a primitive type and its corresponding wrapper class object."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the value of (int)(Math.pow(3, 2))?",
          "options": [
            "6",
            "8",
            "9",
            "9.0"
          ],
          "correct_index": 2,
          "explanation": "Math.pow(3, 2) is 9.0 (a double); casting to int gives 9."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which expression generates a random integer from 1 to 6 inclusive?",
          "options": [
            "(int)(Math.random() * 6)",
            "(int)(Math.random() * 6) + 1",
            "(int)(Math.random() * 7)",
            "(int)(Math.random()) + 1"
          ],
          "correct_index": 1,
          "explanation": "Math.random()*6 gives [0,6); casting yields 0-5; adding 1 yields 1-6 inclusive."
        },
        {
          "question": "What does (int) 7.85 evaluate to?",
          "options": [
            "8",
            "7",
            "7.85",
            "7.0"
          ],
          "correct_index": 1,
          "explanation": "Casting a double to int truncates the fractional part, giving 7 (not rounded to 8)."
        }
      ],
      "challenge_title": "Distance and Power",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // TODO: print the absolute difference |a - b|, then print a raised to the\n        // power b as an int on the next line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int diff = Math.abs(a - b);\n        int power = (int) Math.pow(a, b);\n        System.out.println(diff);\n        System.out.println(power);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3 5",
          "expected_output": "2\n243"
        },
        {
          "input": "10 2",
          "expected_output": "8\n100"
        },
        {
          "input": "7 0",
          "expected_output": "7\n1"
        }
      ]
    }
  ]
}
