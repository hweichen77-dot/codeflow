// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-02",
    "title": "Using Objects",
    "description": "Create and use objects, call methods on String, Math, and wrapper classes, and reason about how references differ from primitive values in Java.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 202,
    "track": "apcsa",
    "unit": "Unit 2 — Using Objects",
    "tags": [
      "java",
      "objects",
      "strings"
    ]
  },
  "lessons": [
    {
      "id": "csa-02-l1",
      "project_id": "csa-02",
      "order": 1,
      "title": "Objects vs Primitives",
      "explanation": "## Two Kinds of Data\n\nJava splits all data into two families: **primitive types** and **reference types** (objects). Knowing which is which controls how values are stored, copied, and compared.\n\n## Primitive Types\n\nThe AP CSA Java subset uses three primitives:\n\n- **int** — whole numbers, e.g. `42`\n- **double** — decimal numbers, e.g. `3.14`\n- **boolean** — `true` or `false`\n\nA primitive variable holds the **actual value** directly in its memory slot. When you write `int x = 5;`, the box named `x` literally contains `5`.\n\n## Reference Types (Objects)\n\nEverything else is an **object**: `String`, `Scanner`, arrays, and any class you write. An object variable does **not** hold the object itself. It holds a **reference** — an arrow pointing to where the object lives in memory.\n\n```java\nString s = \"hello\";   // s points to a String object\nint n = 5;            // n holds the value 5 directly\n```\n\nObjects are richer than primitives: they bundle **data** with **methods** (behaviors) you can call using dot notation, like `s.length()`. Primitives have no methods — you cannot write `n.something()`.\n\n## Spotting the Difference\n\n- Object types start with a **capital letter** by convention: `String`, `Integer`, `Math`.\n- Primitive types are **lowercase keywords**: `int`, `double`, `boolean`.\n- The literal `null` is a reference that points to **no object**. Primitives can never be `null`.\n\n## Why It Matters\n\nThe difference shapes the rest of Unit 2:\n\n- You **create** objects with `new` (next lesson), but never primitives.\n- You **compare** primitives with `==` but compare object contents with `.equals()`.\n- Passing them to methods behaves differently (covered later).\n\nFor now, practice classifying a type as primitive or object. This single skill prevents a huge fraction of beginner Java bugs.",
      "key_terms": [
        {
          "term": "Primitive type",
          "definition": "A built-in type (int, double, boolean) whose variable stores the actual value directly."
        },
        {
          "term": "Reference type",
          "definition": "An object type whose variable stores a reference (pointer) to an object in memory rather than the object itself."
        },
        {
          "term": "null",
          "definition": "A special reference value meaning the variable points to no object; only reference types can be null."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which of these is a reference type?",
          "options": [
            "int",
            "boolean",
            "String",
            "double"
          ],
          "correct_index": 2,
          "explanation": "String is a class, so its variables hold references. int, boolean, and double are primitives."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does a variable of an object type actually store?",
          "options": [
            "The object's value copied inline",
            "A reference pointing to the object",
            "Always the number zero",
            "Nothing until garbage collected"
          ],
          "correct_index": 1,
          "explanation": "Object variables store a reference (an arrow) to where the object lives, not the object's bytes directly."
        },
        {
          "question": "Which value can a primitive variable NEVER hold?",
          "options": [
            "0",
            "A negative number",
            "null",
            "true"
          ],
          "correct_index": 2,
          "explanation": "null is a reference value. Primitives store actual values and can never be null."
        }
      ],
      "challenge_title": "Classify the Type",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        // TODO: print \"primitive\" or \"object\" depending on the type name\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        if (type.equals(\"int\") || type.equals(\"double\") || type.equals(\"boolean\")) {\n            System.out.println(\"primitive\");\n        } else {\n            System.out.println(\"object\");\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "int",
          "expected_output": "primitive"
        },
        {
          "input": "String",
          "expected_output": "object"
        },
        {
          "input": "boolean",
          "expected_output": "primitive"
        }
      ]
    },
    {
      "id": "csa-02-l2",
      "project_id": "csa-02",
      "order": 2,
      "title": "Creating Objects with new",
      "explanation": "## The new Keyword\n\nTo bring an object into existence you use the **new** operator, which calls a **constructor**. A constructor is a special method that builds and initializes a fresh object.\n\n```java\nScanner sc = new Scanner(System.in);\nString name = new String(\"Ada\");\n```\n\nReading right to left in `new Scanner(System.in)`:\n\n- **new** allocates memory for a new object.\n- **Scanner(...)** is the constructor call; the value in parentheses is an **argument**.\n- The resulting reference is stored in the variable `sc`.\n\n## Anatomy of a Construction\n\n```java\nClassName variable = new ClassName(arguments);\n```\n\n- The left side **declares** a variable of the object's type.\n- The right side **instantiates** (creates) the object.\n- The `=` stores the reference into the variable.\n\nThe object produced is called an **instance** of the class. Creating it is called **instantiation**.\n\n## Constructor Arguments\n\nConstructors often take arguments that set the object's initial state. Different argument lists call different constructors (**overloading**):\n\n```java\nString a = new String();          // empty string\nString b = new String(\"hello\");   // copies \"hello\"\n```\n\nThe values you pass must match the **types** the constructor expects, in order.\n\n## The String Shortcut\n\nString is special: because it is used so often, Java lets you create one with a **literal** in double quotes, with no `new`:\n\n```java\nString s = \"hello\";   // shortcut, preferred\n```\n\nThis is the everyday way to make Strings. Most other classes still require `new`.\n\n## Why Constructors Matter\n\nA constructor guarantees an object starts in a **valid state**. When you call `new Scanner(System.in)`, the constructor wires the scanner to standard input so it is ready to read. Without `new`, an object reference would point to nothing (`null`), and using it would crash with a `NullPointerException`.",
      "key_terms": [
        {
          "term": "Constructor",
          "definition": "A special method, invoked by new, that creates and initializes a new object of a class."
        },
        {
          "term": "Instance",
          "definition": "A specific object created from a class via new; instantiation is the act of creating it."
        },
        {
          "term": "Argument",
          "definition": "A value passed inside the parentheses of a constructor or method call to supply needed data."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does the new keyword do?",
          "options": [
            "Compares two objects",
            "Allocates and constructs a new object",
            "Deletes an object",
            "Converts a String to int"
          ],
          "correct_index": 1,
          "explanation": "new allocates memory and calls a constructor to build a fresh object instance."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which statement correctly creates a Scanner that reads from standard input?",
          "options": [
            "Scanner sc = Scanner(System.in);",
            "Scanner sc = new Scanner(System.in);",
            "new Scanner sc = System.in;",
            "Scanner sc = new System.in();"
          ],
          "correct_index": 1,
          "explanation": "The correct form is `new Scanner(System.in)` with the constructor argument System.in."
        },
        {
          "question": "Why can a String be created without new?",
          "options": [
            "Strings are primitives",
            "String literals in quotes are a built-in shortcut for creating String objects",
            "new only works for numbers",
            "Strings cannot be created at all"
          ],
          "correct_index": 1,
          "explanation": "Java provides String literals (text in double quotes) as a convenient shortcut that still produces a String object."
        }
      ],
      "challenge_title": "Greeting Builder",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        // TODO: build and print \"Hello, <name>!\"\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        String greeting = \"Hello, \" + name + \"!\";\n        System.out.println(greeting);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "Ada",
          "expected_output": "Hello, Ada!"
        },
        {
          "input": "Bob",
          "expected_output": "Hello, Bob!"
        },
        {
          "input": "Grace",
          "expected_output": "Hello, Grace!"
        }
      ]
    },
    {
      "id": "csa-02-l3",
      "project_id": "csa-02",
      "order": 3,
      "title": "String Length and Substring",
      "explanation": "## Calling Methods on Strings\n\nA **String** is an object, so it carries methods you invoke with **dot notation**: `stringVariable.methodName(arguments)`. Two foundational methods are `length()` and `substring()`.\n\n## length()\n\n`length()` returns the number of characters in the String as an **int**:\n\n```java\nString s = \"hello\";\nint n = s.length();   // n is 5\n```\n\nNote the parentheses — `length()` is a method on String. (Arrays use `.length` with no parentheses; do not confuse them.)\n\n## Indexing\n\nString characters are numbered starting at **0**. For `\"hello\"`:\n\n- index 0 is `'h'`, index 1 is `'e'`, ... index 4 is `'o'`.\n- The last valid index is always `length() - 1`.\n\n## substring()\n\n`substring` extracts part of a String. It has two forms:\n\n```java\nString s = \"computer\";\ns.substring(3);      // \"puter\"  -> from index 3 to the end\ns.substring(3, 6);   // \"put\"    -> index 3 up to BUT NOT including 6\n```\n\nThe two-argument form is **inclusive of the start, exclusive of the end**. The number of characters returned is `end - start`.\n\n## Off-by-One Care\n\nThe exclusive end trips up many students. To grab characters at indices 3, 4, 5 you write `substring(3, 6)` — the end index is one past the last character you want. Asking for an index outside `0..length()` throws a `StringIndexOutOfBoundsException`.\n\n## Strings Are Immutable\n\nThese methods never change the original String. `substring` returns a **new** String; the source is untouched:\n\n```java\nString s = \"hello\";\ns.substring(0, 2);   // returns \"he\"; s is still \"hello\"\n```\n\nBecause Strings are **immutable**, you must capture the result in a variable or use it directly — calling a method alone does nothing visible.",
      "key_terms": [
        {
          "term": "length()",
          "definition": "A String method returning the count of characters in the String as an int."
        },
        {
          "term": "substring(start, end)",
          "definition": "A String method returning the characters from index start up to but not including index end."
        },
        {
          "term": "Immutable",
          "definition": "A property of String objects meaning their contents can never be changed after creation."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does \"banana\".substring(1, 4) return?",
          "options": [
            "\"ban\"",
            "\"anan\"",
            "\"ana\"",
            "\"nana\""
          ],
          "correct_index": 2,
          "explanation": "Indices 1,2,3 are 'a','n','a' (end 4 is excluded), giving \"ana\"."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the value of \"coding\".length()?",
          "options": [
            "5",
            "6",
            "7",
            "0"
          ],
          "correct_index": 1,
          "explanation": "\"coding\" has six characters: c,o,d,i,n,g."
        },
        {
          "question": "Which call returns the last 3 characters of a String s of length n?",
          "options": [
            "s.substring(n-3, n)",
            "s.substring(n-3)",
            "Both of the above",
            "s.substring(3, n)"
          ],
          "correct_index": 2,
          "explanation": "Both s.substring(n-3, n) and s.substring(n-3) start at index n-3 and run to the end, yielding the last 3 characters."
        }
      ],
      "challenge_title": "First and Last Character",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String word = sc.next();\n        // TODO: print the first character, a space, then the last character\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String word = sc.next();\n        int len = word.length();\n        String first = word.substring(0, 1);\n        String last = word.substring(len - 1);\n        System.out.println(first + \" \" + last);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "hello",
          "expected_output": "h o"
        },
        {
          "input": "java",
          "expected_output": "j a"
        },
        {
          "input": "x",
          "expected_output": "x x"
        }
      ]
    },
    {
      "id": "csa-02-l4",
      "project_id": "csa-02",
      "order": 4,
      "title": "indexOf and String Search",
      "explanation": "## Finding Characters and Substrings\n\nThe **indexOf** method searches a String and returns the **index** of the first occurrence of a target. The target can be a single-character String (or char) or a longer substring.\n\n```java\nString s = \"banana\";\ns.indexOf(\"a\");    // 1  (first 'a')\ns.indexOf(\"na\");   // 2  (first \"na\")\ns.indexOf(\"z\");    // -1 (not found)\n```\n\n## The -1 Convention\n\nThe single most important rule: if the target is **not present**, `indexOf` returns **-1**. Since no real index is negative, -1 is a safe \"not found\" signal. Always test for it:\n\n```java\nif (s.indexOf(\"z\") == -1) {\n    System.out.println(\"missing\");\n}\n```\n\n## Searching From a Position\n\nA second form starts the search at a given index, letting you find later occurrences:\n\n```java\nString s = \"banana\";\nint first = s.indexOf(\"a\");        // 1\nint second = s.indexOf(\"a\", 2);   // 3\n```\n\nBy passing `first + 1` as the start, you can step through every match in a loop.\n\n## Combining With substring\n\n`indexOf` and `substring` pair naturally. To grab everything before the first space:\n\n```java\nString full = \"Ada Lovelace\";\nint space = full.indexOf(\" \");      // 3\nString firstName = full.substring(0, space);   // \"Ada\"\n```\n\nGuard against `-1` first; calling `substring(0, -1)` would throw an exception.\n\n## Why This Matters\n\nParsing text — splitting names, reading file paths, finding delimiters — relies on this search-then-slice pattern. Mastering the `-1` check and the start-index overload makes you fluent at extracting structured data from raw Strings, a skill used constantly on the AP exam free-response questions.",
      "key_terms": [
        {
          "term": "indexOf",
          "definition": "A String method returning the index of the first occurrence of a target, or -1 if it is not found."
        },
        {
          "term": "-1 sentinel",
          "definition": "The special return value of indexOf indicating the target does not appear in the String."
        },
        {
          "term": "Start index overload",
          "definition": "The indexOf(target, fromIndex) form that begins searching at the given index to find later occurrences."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does \"apple\".indexOf(\"z\") return?",
          "options": [
            "0",
            "-1",
            "5",
            "It throws an exception"
          ],
          "correct_index": 1,
          "explanation": "'z' is not in \"apple\", so indexOf returns the sentinel value -1."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does \"mississippi\".indexOf(\"s\") return?",
          "options": [
            "1",
            "2",
            "3",
            "0"
          ],
          "correct_index": 1,
          "explanation": "Letters: m(0) i(1) s(2). The first 's' is at index 2."
        },
        {
          "question": "Why check indexOf result against -1 before using it in substring?",
          "options": [
            "substring requires positive arguments and -1 would cause an exception",
            "indexOf is slow",
            "-1 means the string is empty",
            "It is never necessary"
          ],
          "correct_index": 0,
          "explanation": "If the target is absent, indexOf returns -1; passing that to substring throws StringIndexOutOfBoundsException, so guard first."
        }
      ],
      "challenge_title": "Extract First Name",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String full = sc.nextLine();\n        // TODO: print the text before the first space; if no space, print the whole line\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String full = sc.nextLine();\n        int space = full.indexOf(\" \");\n        if (space == -1) {\n            System.out.println(full);\n        } else {\n            System.out.println(full.substring(0, space));\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "Ada Lovelace",
          "expected_output": "Ada"
        },
        {
          "input": "Grace Hopper",
          "expected_output": "Grace"
        },
        {
          "input": "Plato",
          "expected_output": "Plato"
        }
      ]
    },
    {
      "id": "csa-02-l5",
      "project_id": "csa-02",
      "order": 5,
      "title": "Comparing Strings: equals and compareTo",
      "explanation": "## Never Compare Strings With ==\n\nBecause Strings are **objects**, `==` compares **references** (do the two variables point to the same object?), not the text. Two Strings with identical characters can live at different addresses, so `==` may surprisingly return `false`. To compare **contents**, use methods.\n\n## equals\n\n`equals` returns a **boolean**: `true` when both Strings hold exactly the same characters, `false` otherwise. It is **case-sensitive**.\n\n```java\nString a = \"cat\";\nString b = \"cat\";\na.equals(b);          // true\n\"Cat\".equals(\"cat\");  // false (case differs)\n```\n\nUse `equalsIgnoreCase` when case should not matter.\n\n## compareTo\n\n`compareTo` gives **ordering** information, returning an **int**:\n\n- **negative** if the caller comes **before** the argument alphabetically\n- **zero** if they are **equal**\n- **positive** if the caller comes **after** the argument\n\n```java\n\"apple\".compareTo(\"banana\");  // negative (a before b)\n\"dog\".compareTo(\"dog\");        // 0\n\"zebra\".compareTo(\"apple\");    // positive\n```\n\nComparison is **lexicographic**: characters are compared by their Unicode values, left to right, until they differ. Uppercase letters (65-90) come before lowercase (97-122), so `\"Z\".compareTo(\"a\")` is negative.\n\n## Reading the Sign, Not the Number\n\nThe AP exam cares about the **sign** of `compareTo`, not its exact magnitude. Write conditions like:\n\n```java\nif (x.compareTo(y) < 0) { /* x comes first */ }\nif (x.compareTo(y) == 0) { /* equal */ }\n```\n\n## Choosing the Right Tool\n\n- Need a yes/no \"are these the same text?\" -> **equals**.\n- Need to **sort** or decide order -> **compareTo**.\n- Almost never -> **==** for Strings.\n\nMixing these up is one of the most common Java mistakes, so internalize: `==` for primitives, `.equals()` for String equality, `.compareTo()` for String ordering.",
      "key_terms": [
        {
          "term": "equals",
          "definition": "A String method returning true if two Strings contain exactly the same characters (case-sensitive)."
        },
        {
          "term": "compareTo",
          "definition": "A String method returning a negative, zero, or positive int based on lexicographic ordering relative to its argument."
        },
        {
          "term": "Lexicographic order",
          "definition": "Character-by-character comparison using Unicode values, the basis of String ordering."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the sign of \"apple\".compareTo(\"apricot\")?",
          "options": [
            "Negative",
            "Zero",
            "Positive",
            "Undefined"
          ],
          "correct_index": 0,
          "explanation": "Both start \"ap\"; then 'p'(112) vs 'r'(114): 'p' is smaller, so the result is negative (apple comes first)."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is == unreliable for comparing String contents?",
          "options": [
            "== only works on ints",
            "== compares references, not characters, so equal text at different addresses returns false",
            "== always returns true for Strings",
            "== throws an exception on Strings"
          ],
          "correct_index": 1,
          "explanation": "== checks whether two references point to the same object; two Strings with equal text may be different objects."
        },
        {
          "question": "What does \"dog\".compareTo(\"dog\") return?",
          "options": [
            "1",
            "-1",
            "0",
            "true"
          ],
          "correct_index": 2,
          "explanation": "Identical Strings are equal, so compareTo returns 0 (an int, not a boolean)."
        }
      ],
      "challenge_title": "Alphabetical Order",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        // TODO: print the two words on one line separated by a space, in alphabetical order\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        if (a.compareTo(b) <= 0) {\n            System.out.println(a + \" \" + b);\n        } else {\n            System.out.println(b + \" \" + a);\n        }\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "banana apple",
          "expected_output": "apple banana"
        },
        {
          "input": "cat cat",
          "expected_output": "cat cat"
        },
        {
          "input": "apple banana",
          "expected_output": "apple banana"
        }
      ]
    },
    {
      "id": "csa-02-l6",
      "project_id": "csa-02",
      "order": 6,
      "title": "The Math Class",
      "explanation": "## A Toolbox of Static Methods\n\nThe **Math** class provides common mathematical operations. Its methods are **static**, meaning you call them on the **class name** itself, not on an object: `Math.methodName(...)`. You never write `new Math()`.\n\n## Core AP Methods\n\nThe AP CSA subset includes four Math methods you must know:\n\n```java\nMath.abs(-7);          // 7      absolute value\nMath.pow(2, 10);       // 1024.0 (2 to the 10th) -> returns double\nMath.sqrt(144);        // 12.0   square root -> returns double\nMath.random();         // a double in [0.0, 1.0)\n```\n\nKey type details:\n\n- **abs** returns the same type you pass (int -> int, double -> double).\n- **pow** and **sqrt** always return a **double**, even for whole results. `Math.pow(2,3)` is `8.0`, not `8`.\n- **random** returns a `double` that is `>= 0.0` and strictly `< 1.0`.\n\n## Generating Random Integers\n\n`Math.random()` alone gives a fraction. The standard AP formula for a random int in a range `[low, high]` (inclusive) is:\n\n```java\nint range = high - low + 1;\nint value = (int)(Math.random() * range) + low;\n```\n\nThe cast `(int)` **truncates** toward zero. Multiplying by `range` spreads the fraction across `0..range-1`; adding `low` shifts it.\n\n## Casting Math Results\n\nBecause `pow` and `sqrt` give doubles, you often cast back to int when you need a whole number:\n\n```java\nint side = (int) Math.sqrt(64);   // 8\n```\n\nRemember that casting **truncates**, it does not round. `(int) 7.9` is `7`. To round, you would add 0.5 before casting or use rounding logic.\n\n## Why Static?\n\nMath operations need no stored state — `sqrt(9)` is always `3.0`. Static methods belong to the class as shared utilities, so calling `Math.sqrt(...)` is clean and requires no object. This is your first encounter with the static-method pattern you will see again in wrapper classes.",
      "key_terms": [
        {
          "term": "Static method",
          "definition": "A method called on the class name rather than an object, e.g. Math.sqrt(x); it needs no instance."
        },
        {
          "term": "Math.random()",
          "definition": "A static method returning a double in the range [0.0, 1.0), used to generate random values."
        },
        {
          "term": "Truncation",
          "definition": "Casting a double to int drops the fractional part toward zero rather than rounding."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the type and value of Math.pow(3, 2)?",
          "options": [
            "int 9",
            "double 9.0",
            "int 6",
            "double 6.0"
          ],
          "correct_index": 1,
          "explanation": "Math.pow always returns a double, and 3 squared is 9.0."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which expression gives a random int from 1 to 6 inclusive?",
          "options": [
            "(int)(Math.random() * 6)",
            "(int)(Math.random() * 6) + 1",
            "(int)(Math.random() * 7) + 1",
            "Math.random() * 6 + 1"
          ],
          "correct_index": 1,
          "explanation": "Math.random()*6 gives [0,6); casting yields 0-5; adding 1 yields 1-6 inclusive."
        },
        {
          "question": "What does (int) Math.sqrt(50) evaluate to?",
          "options": [
            "7",
            "8",
            "7.07",
            "It does not compile"
          ],
          "correct_index": 0,
          "explanation": "sqrt(50) is about 7.07; casting to int truncates the fraction, giving 7."
        }
      ],
      "challenge_title": "Hypotenuse Floor",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // TODO: print (int) sqrt(a*a + b*b)\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        double h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));\n        System.out.println((int) h);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 4",
          "expected_output": "5"
        },
        {
          "input": "5 12",
          "expected_output": "13"
        },
        {
          "input": "2 2",
          "expected_output": "2"
        }
      ]
    },
    {
      "id": "csa-02-l7",
      "project_id": "csa-02",
      "order": 7,
      "title": "Wrapper Classes: Integer and Double",
      "explanation": "## Objects That Wrap Primitives\n\nSometimes you need a primitive value to behave like an **object** — for example to store it where only objects are allowed. Java provides **wrapper classes**: **Integer** wraps an `int`, and **Double** wraps a `double`.\n\n```java\nInteger boxed = Integer.valueOf(42);  // an Integer object holding 42\nint raw = boxed.intValue();           // back to a primitive int\n```\n\n## Autoboxing and Unboxing\n\nModern Java converts automatically:\n\n- **Autoboxing**: a primitive becomes its wrapper. `Integer x = 5;` quietly calls `Integer.valueOf(5)`.\n- **Unboxing**: a wrapper becomes its primitive. `int y = x;` quietly calls `x.intValue()`.\n\nBecause of this, you can usually mix `int` and `Integer` in arithmetic, and the compiler inserts the conversions for you.\n\n```java\nInteger a = 10;       // autoboxing\nint b = a + 5;        // a is unboxed, result 15\n```\n\n## Useful Static Members\n\nWrapper classes hold handy **static** utilities and constants:\n\n```java\nInteger.parseInt(\"123\");      // String -> int, gives 123\nDouble.parseDouble(\"3.14\");   // String -> double, gives 3.14\nInteger.MIN_VALUE;            // smallest possible int\nInteger.MAX_VALUE;            // largest possible int\n```\n\n`parseInt` and `parseDouble` are essential for turning text (such as input read as a String) into numbers you can compute with.\n\n## Equality Pitfall\n\nSince wrappers are **objects**, `==` compares references, just like Strings. Use `.equals()` or unbox to compare values:\n\n```java\nInteger m = 1000, n = 1000;\nm == n;          // may be false! (different objects)\nm.equals(n);     // true (same value)\n```\n\n## When to Use Wrappers\n\n- Storing numbers in collections like `ArrayList` (Unit 7) requires wrappers.\n- Converting Strings to numbers uses `parseInt` / `parseDouble`.\n- Accessing range constants like `Integer.MAX_VALUE`.\n\nFor plain arithmetic, prefer primitives — they are faster and avoid the `==` trap. Reach for wrappers when an **object** is specifically required.",
      "key_terms": [
        {
          "term": "Wrapper class",
          "definition": "A class (Integer, Double) that holds a primitive value inside an object so it can be used where objects are required."
        },
        {
          "term": "Autoboxing",
          "definition": "Automatic conversion of a primitive to its wrapper object, and unboxing is the reverse."
        },
        {
          "term": "parseInt / parseDouble",
          "definition": "Static wrapper methods that convert a String of digits into an int or double."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does Integer.parseInt(\"45\") + 5 evaluate to?",
          "options": [
            "\"455\"",
            "50",
            "45",
            "It does not compile"
          ],
          "correct_index": 1,
          "explanation": "parseInt converts the String \"45\" to the int 45, and 45 + 5 is 50."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is autoboxing?",
          "options": [
            "Converting an Integer to a String",
            "Automatically wrapping a primitive into its wrapper object",
            "Rounding a double",
            "Comparing two objects"
          ],
          "correct_index": 1,
          "explanation": "Autoboxing is the compiler automatically converting a primitive like int into its wrapper Integer."
        },
        {
          "question": "Which converts the String \"7.5\" to a double?",
          "options": [
            "Integer.parseInt(\"7.5\")",
            "Double.parseDouble(\"7.5\")",
            "Math.sqrt(\"7.5\")",
            "(double) \"7.5\""
          ],
          "correct_index": 1,
          "explanation": "Double.parseDouble parses a numeric String into a double; parseInt would fail on a decimal point."
        }
      ],
      "challenge_title": "Sum of Parsed Numbers",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String first = sc.next();\n        String second = sc.next();\n        // TODO: parse both Strings to ints and print their sum\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String first = sc.next();\n        String second = sc.next();\n        int a = Integer.parseInt(first);\n        int b = Integer.parseInt(second);\n        System.out.println(a + b);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "12 30",
          "expected_output": "42"
        },
        {
          "input": "100 -25",
          "expected_output": "75"
        },
        {
          "input": "0 0",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csa-02-l8",
      "project_id": "csa-02",
      "order": 8,
      "title": "References vs Values in Method Calls",
      "explanation": "## Java Passes Copies\n\nWhen you call a method, Java **passes a copy** of each argument's value. The crucial question is: a copy of *what*?\n\n- For a **primitive**, the copy is the actual value.\n- For an **object**, the copy is the **reference** (the arrow) — both the original and the copy point to the **same object**.\n\n## Primitives Are Independent\n\nChanging a primitive parameter inside a method does **not** affect the caller's variable, because the method has its own copy:\n\n```java\npublic static void bump(int x) { x = x + 1; }\n\nint n = 5;\nbump(n);\nSystem.out.println(n);   // still 5\n```\n\n## Object References Share State\n\nWith objects, the copied reference still points to the original object, so changes to that object's state are visible to the caller. (Strings are immutable, so they cannot be changed this way, but a mutable object like an array can.)\n\n```java\npublic static void zeroFirst(int[] arr) { arr[0] = 0; }\n\nint[] data = {7, 8, 9};\nzeroFirst(data);\nSystem.out.println(data[0]);   // 0 — the shared array changed\n```\n\n## Reassignment Does Not Escape\n\nReassigning the parameter to a **new** object does not affect the caller, because you only changed the local copy of the reference:\n\n```java\npublic static void replace(int[] arr) { arr = new int[]{1, 2}; }\n\nint[] data = {7, 8, 9};\nreplace(data);\nSystem.out.println(data[0]);   // still 7\n```\n\nInside `replace`, the local arrow now points to a brand-new array, but the caller's arrow is untouched.\n\n## The Mental Model\n\n- **Mutating** the object an argument points to -> visible to the caller.\n- **Reassigning** the parameter itself -> invisible to the caller.\n- **Primitives** -> never affect the caller.\n\n## Aliasing\n\nWhen two reference variables point to the same object, they are **aliases**. Modifying through one alias is seen through the other. This explains why comparing Strings needs `.equals()` and why sharing mutable objects demands care. Understanding pass-by-value-of-reference is the key insight that ties Unit 2 together.",
      "key_terms": [
        {
          "term": "Pass by value",
          "definition": "Java copies each argument; for objects it copies the reference, so the method and caller share the same object."
        },
        {
          "term": "Aliasing",
          "definition": "Two reference variables pointing to the same object, so changes through one are visible through the other."
        },
        {
          "term": "Reassignment",
          "definition": "Pointing a parameter at a new object, which affects only the local copy and not the caller's variable."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After passing an int to a method that increments its parameter, the caller's int is...",
          "options": [
            "Incremented",
            "Unchanged",
            "Set to zero",
            "null"
          ],
          "correct_index": 1,
          "explanation": "Primitives are passed by value as a copy, so the caller's variable is unchanged."
        }
      ],
      "quiz_questions": [
        {
          "question": "A method receives an int array and sets arr[0] = 99. What does the caller see?",
          "options": [
            "No change",
            "The first element is now 99",
            "A compile error",
            "The array becomes null"
          ],
          "correct_index": 1,
          "explanation": "The reference is copied but points to the same array, so mutating arr[0] is visible to the caller."
        },
        {
          "question": "Inside a method, reassigning an object parameter to a new object affects the caller how?",
          "options": [
            "The caller's variable points to the new object",
            "The caller is unaffected",
            "It throws an exception",
            "It deletes the original object"
          ],
          "correct_index": 1,
          "explanation": "Reassignment changes only the local copy of the reference; the caller's variable still points to the original object."
        }
      ],
      "challenge_title": "Double Each Element",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void doubleAll(int[] arr) {\n        // TODO: multiply every element by 2 (modifies the shared array)\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        doubleAll(arr);\n        for (int i = 0; i < n; i++) {\n            System.out.print(arr[i]);\n            if (i < n - 1) System.out.print(\" \");\n        }\n        System.out.println();\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void doubleAll(int[] arr) {\n        for (int i = 0; i < arr.length; i++) {\n            arr[i] = arr[i] * 2;\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        doubleAll(arr);\n        for (int i = 0; i < n; i++) {\n            System.out.print(arr[i]);\n            if (i < n - 1) System.out.print(\" \");\n        }\n        System.out.println();\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3\n1 2 3",
          "expected_output": "2 4 6"
        },
        {
          "input": "1\n5",
          "expected_output": "10"
        },
        {
          "input": "4\n0 -1 10 7",
          "expected_output": "0 -2 20 14"
        }
      ]
    }
  ]
}
