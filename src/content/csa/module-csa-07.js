export default {
  "project": {
    "id": "csa-07",
    "title": "ArrayList",
    "description": "Master Java's dynamic ArrayList<E>: adding, accessing, traversing, removing, autoboxing, and running standard algorithms for the AP CSA exam.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 207,
    "track": "apcsa",
    "unit": "Unit 7 — ArrayList",
    "tags": [
      "arraylist",
      "java",
      "collections"
    ]
  },
  "lessons": [
    {
      "id": "csa-07-l1",
      "project_id": "csa-07",
      "order": 1,
      "title": "Why ArrayList? Arrays vs ArrayList",
      "explanation": "## The Problem with Arrays\n\nA Java **array** has a fixed length set when you create it. Once you write `int[] a = new int[5];`, the array can hold exactly five elements forever. If you need a sixth, you must allocate a brand new, larger array and copy every element across. This makes arrays awkward whenever the amount of data is unknown until the program runs.\n\n## Enter ArrayList\n\nAn **ArrayList** is a *resizable* list provided by the Java library. It grows and shrinks automatically as you add and remove elements, so you never manage capacity yourself. It lives in `java.util`, so you import it:\n\n```java\nimport java.util.ArrayList;\n\nArrayList<String> names = new ArrayList<String>();\nnames.add(\"Ada\");\nnames.add(\"Linus\");\nSystem.out.println(names.size()); // 2\n```\n\nThe `<String>` is a **type parameter**: it tells the compiler this list holds `String` objects. This is called a **generic** type, written `ArrayList<E>` where `E` is the element type.\n\n## Key Differences\n\n- **Size**: arrays use `.length` (a field); ArrayList uses `.size()` (a method).\n- **Resizing**: arrays are fixed; ArrayList grows automatically.\n- **Access**: arrays use `a[i]`; ArrayList uses `list.get(i)` and `list.set(i, val)`.\n- **Element type**: arrays hold primitives or objects; ArrayList holds **objects only** (more on autoboxing later).\n\n## When to Use Which\n\nUse an **array** when the size is known and fixed, or when you store primitives for speed. Use an **ArrayList** when the size changes, or when you want convenient `add`/`remove` operations. On the AP exam, ArrayList is the standard choice for collections whose size varies.\n\nBoth are **zero-indexed**: the first element is at index 0, the last at index `size() - 1` (or `length - 1` for arrays). Confusing `.length` with `.size()` is one of the most common beginner mistakes, so commit the distinction to memory.",
      "key_terms": [
        {
          "term": "ArrayList",
          "definition": "A resizable list class in java.util that grows and shrinks automatically."
        },
        {
          "term": "Generic type",
          "definition": "A type like ArrayList<E> parameterized by the element type E it stores."
        },
        {
          "term": ".length vs .size()",
          "definition": "Arrays expose length as a field; ArrayList exposes size() as a method."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How do you get the number of elements in an ArrayList named list?",
          "options": [
            "list.length",
            "list.size()",
            "list.count",
            "size(list)"
          ],
          "correct_index": 1,
          "explanation": "ArrayList uses the method size(); only arrays use the length field."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which statement about arrays and ArrayLists is TRUE?",
          "options": [
            "Arrays can grow automatically",
            "ArrayList has a fixed size",
            "ArrayList resizes automatically; arrays are fixed",
            "Both use .length"
          ],
          "correct_index": 2,
          "explanation": "ArrayList resizes automatically while a Java array has a fixed length."
        },
        {
          "question": "What does the <String> mean in ArrayList<String>?",
          "options": [
            "The list can only be 1 element",
            "It is the element type the list stores",
            "It is the list's name",
            "It makes the list immutable"
          ],
          "correct_index": 1,
          "explanation": "The type parameter specifies the element type, here String."
        }
      ],
      "challenge_title": "Count the Words",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: read each line into an ArrayList<String>, then print how many were read\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ArrayList<String> words = new ArrayList<String>();\n        while (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            if (line.length() > 0) {\n                words.add(line);\n            }\n        }\n        System.out.println(words.size());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "apple\nbanana\ncherry\n",
          "expected_output": "3"
        },
        {
          "input": "only\n",
          "expected_output": "1"
        },
        {
          "input": "a\nb\nc\nd\ne\n",
          "expected_output": "5"
        }
      ]
    },
    {
      "id": "csa-07-l2",
      "project_id": "csa-07",
      "order": 2,
      "title": "Adding and Accessing: add, get, size",
      "explanation": "## Building a List\n\nYou start with an empty ArrayList and **add** elements to it. The one-argument `add` appends to the end:\n\n```java\nArrayList<String> list = new ArrayList<String>();\nlist.add(\"a\"); // [a]\nlist.add(\"b\"); // [a, b]\nlist.add(\"c\"); // [a, b, c]\n```\n\nEach call increases `size()` by one. After three adds, `list.size()` returns 3.\n\n## Reading Elements with get\n\nTo read an element, call **`get(index)`**. Indices run from `0` to `size() - 1`:\n\n```java\nString first = list.get(0); // \"a\"\nString last  = list.get(list.size() - 1); // \"c\"\n```\n\nAccessing `get(3)` here throws an **IndexOutOfBoundsException** because valid indices are only 0, 1, 2. Always keep your index strictly less than `size()`.\n\n## Inserting at a Position\n\nThe two-argument form **`add(index, element)`** inserts at a given position and shifts everything from that index onward one slot to the right:\n\n```java\nlist.add(1, \"X\"); // [a, X, b, c]\n```\n\nThis is more expensive than appending because elements must shift, but it is essential when order matters.\n\n## A Classic Loop\n\nUse an indexed loop to visit every element:\n\n```java\nfor (int i = 0; i < list.size(); i++) {\n    System.out.println(list.get(i));\n}\n```\n\nNotice the condition is `i < list.size()`, never `i <= list.size()`. Going one past the end is a frequent off-by-one bug.\n\n## Summary\n\n- `add(e)` appends to the end and grows the list.\n- `add(i, e)` inserts at index `i`, shifting later elements right.\n- `get(i)` returns the element at index `i`.\n- `size()` returns the current element count.\n\nThese four operations are the backbone of nearly every ArrayList program you will write.",
      "key_terms": [
        {
          "term": "add(e)",
          "definition": "Appends element e to the end of the list and increases size by one."
        },
        {
          "term": "get(i)",
          "definition": "Returns the element stored at index i."
        },
        {
          "term": "IndexOutOfBoundsException",
          "definition": "Thrown when accessing an index < 0 or >= size()."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After list.add(0,\"X\") on [a,b], what is the list?",
          "options": [
            "[a,b,X]",
            "[X,a,b]",
            "[a,X,b]",
            "[X,b]"
          ],
          "correct_index": 1,
          "explanation": "add(0,\"X\") inserts at index 0 and shifts a and b right."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the largest valid index for a list of size 5?",
          "options": [
            "5",
            "4",
            "6",
            "0"
          ],
          "correct_index": 1,
          "explanation": "Indices run 0..size()-1, so the largest is 4."
        },
        {
          "question": "What does add(2, \"Z\") do to [p, q, r]?",
          "options": [
            "Replaces r with Z",
            "Appends Z at the end",
            "Inserts Z at index 2, shifting r right",
            "Throws an exception"
          ],
          "correct_index": 2,
          "explanation": "Two-argument add inserts at the index and shifts later elements right, giving [p,q,Z,r]."
        }
      ],
      "challenge_title": "Nth Element",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n words, then read an index k, print the word at index k\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<String> list = new ArrayList<String>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.next());\n        }\n        int k = sc.nextInt();\n        System.out.println(list.get(k));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\nalpha beta gamma\n2\n",
          "expected_output": "gamma"
        },
        {
          "input": "4\nred green blue yellow\n0\n",
          "expected_output": "red"
        },
        {
          "input": "5\na b c d e\n3\n",
          "expected_output": "d"
        }
      ]
    },
    {
      "id": "csa-07-l3",
      "project_id": "csa-07",
      "order": 3,
      "title": "Modifying: set and remove",
      "explanation": "## Replacing with set\n\nThe **`set(index, element)`** method overwrites the element at a position with a new value and **returns the old value**. It does not change the size:\n\n```java\nArrayList<String> list = new ArrayList<String>();\nlist.add(\"a\"); list.add(\"b\"); list.add(\"c\");\nString old = list.set(1, \"B\"); // list is now [a, B, c]; old == \"b\"\n```\n\nUse `set` when an element already exists and you want to change it in place. Contrast this with `add(i, e)`, which *inserts* and grows the list.\n\n## Deleting with remove\n\nThe **`remove(index)`** method deletes the element at that index, shifts every later element one slot left, and returns the removed value:\n\n```java\nString gone = list.remove(0); // list is now [B, c]; gone == \"a\"\n```\n\nAfter removal, `size()` decreases by one. The indices of all elements after the removed one change.\n\n## remove(int) vs remove(Object)\n\nThis is a famous trap. ArrayList has two `remove` methods:\n\n- **`remove(int index)`** removes by position.\n- **`remove(Object o)`** removes the first element equal to `o`.\n\nFor an `ArrayList<Integer>`, `list.remove(2)` removes the element at **index 2**, not the value 2. To remove the value, box it: `list.remove(Integer.valueOf(2))`. On the AP exam this distinction is tested directly.\n\n## Putting It Together\n\n```java\nArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(10); nums.add(20); nums.add(30);\nnums.set(0, 99);          // [99, 20, 30]\nnums.remove(1);           // removes index 1 -> [99, 30]\nSystem.out.println(nums); // [99, 30]\n```\n\n## Summary\n\n- `set(i, e)`: replaces in place, returns old value, size unchanged.\n- `remove(i)`: deletes by index, shifts left, size shrinks by one.\n- Watch the `remove(int)` vs `remove(Object)` overload for Integer lists.",
      "key_terms": [
        {
          "term": "set(i, e)",
          "definition": "Replaces the element at index i with e and returns the previous value; size unchanged."
        },
        {
          "term": "remove(i)",
          "definition": "Removes the element at index i, shifts later elements left, and returns it."
        },
        {
          "term": "remove overload",
          "definition": "remove(int) deletes by index; remove(Object) deletes by value."
        }
      ],
      "inline_quizzes": [
        {
          "question": "list.set(1, \"Z\") on [a,b,c] produces what list?",
          "options": [
            "[a,Z,b,c]",
            "[a,Z,c]",
            "[Z,b,c]",
            "[a,b,Z]"
          ],
          "correct_index": 1,
          "explanation": "set replaces index 1 in place, giving [a,Z,c]."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does remove(1) return and leave for [x,y,z]?",
          "options": [
            "returns y, leaves [x,z]",
            "returns x, leaves [y,z]",
            "returns z, leaves [x,y]",
            "returns y, leaves [x,y,z]"
          ],
          "correct_index": 0,
          "explanation": "remove(1) deletes y and returns it, leaving [x,z]."
        },
        {
          "question": "For ArrayList<Integer> n holding [5,6,7], what does n.remove(1) do?",
          "options": [
            "Removes the value 1",
            "Removes index 1 (the 6)",
            "Throws an exception",
            "Removes the value 6 by searching"
          ],
          "correct_index": 1,
          "explanation": "remove(int) removes by index, so index 1 (value 6) is removed."
        }
      ],
      "challenge_title": "Replace then Remove",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n ints, set index 0 to 0, remove the last element, print remaining ints space-separated\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        list.set(0, 0);\n        list.remove(list.size() - 1);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            if (i > 0) sb.append(\" \");\n            sb.append(list.get(i));\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "4\n7 8 9 10\n",
          "expected_output": "0 8 9"
        },
        {
          "input": "3\n1 2 3\n",
          "expected_output": "0 2"
        },
        {
          "input": "2\n50 60\n",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csa-07-l4",
      "project_id": "csa-07",
      "order": 4,
      "title": "Autoboxing and Wrapper Classes",
      "explanation": "## Objects Only\n\nAn ArrayList can only store **objects**, never primitive types like `int`, `double`, or `boolean`. You cannot write `ArrayList<int>`. Instead Java provides **wrapper classes** that wrap a primitive in an object:\n\n- `int` -> `Integer`\n- `double` -> `Double`\n- `boolean` -> `Boolean`\n\nSo you write `ArrayList<Integer>` or `ArrayList<Double>`.\n\n## Autoboxing\n\n**Autoboxing** is the automatic conversion from a primitive to its wrapper. **Unboxing** is the reverse. The compiler inserts these conversions for you:\n\n```java\nArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(5);            // autoboxing: int 5 -> Integer\nint x = nums.get(0);    // unboxing: Integer -> int 5\nint sum = nums.get(0) + 10; // unboxes, then adds\n```\n\nBecause of autoboxing, you can mostly treat `ArrayList<Integer>` as if it held plain ints. But the values are really `Integer` objects under the hood.\n\n## Pitfalls to Know\n\n- **Comparing with ==**: Comparing two `Integer` objects with `==` may give wrong results because it compares references, not values. Use `.equals()` or unbox to int first.\n- **Null unboxing**: Unboxing a `null` Integer throws a `NullPointerException`.\n- **remove(int) trap**: As seen earlier, `list.remove(5)` on an Integer list removes *index* 5, not the value 5, precisely because the int overload is preferred over autoboxing.\n\n```java\nArrayList<Integer> list = new ArrayList<Integer>();\nlist.add(2); list.add(4); list.add(6);\nint total = 0;\nfor (int i = 0; i < list.size(); i++) {\n    total += list.get(i); // each get() unboxes to int\n}\nSystem.out.println(total); // 12\n```\n\n## Summary\n\n- ArrayList holds objects; use wrapper classes for primitives.\n- Autoboxing/unboxing convert automatically between `int` and `Integer`.\n- Beware `==` on wrappers, null unboxing, and the remove overload.",
      "key_terms": [
        {
          "term": "Wrapper class",
          "definition": "An object type (Integer, Double, Boolean) that wraps a primitive value."
        },
        {
          "term": "Autoboxing",
          "definition": "Automatic conversion from a primitive to its wrapper class."
        },
        {
          "term": "Unboxing",
          "definition": "Automatic conversion from a wrapper object back to a primitive."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which declaration is valid?",
          "options": [
            "ArrayList<int>",
            "ArrayList<Integer>",
            "ArrayList(int)",
            "ArrayList[int]"
          ],
          "correct_index": 1,
          "explanation": "ArrayList stores objects, so you use the wrapper class Integer, not the primitive int."
        }
      ],
      "quiz_questions": [
        {
          "question": "What happens with int x = nums.get(0); when nums is ArrayList<Integer>?",
          "options": [
            "Compile error",
            "Autoboxing of x",
            "Unboxing of the Integer to int",
            "Nothing, it stores an Integer"
          ],
          "correct_index": 2,
          "explanation": "Reading into an int unboxes the Integer to a primitive int."
        },
        {
          "question": "Why can comparing two Integers with == be unreliable?",
          "options": [
            "== is not allowed on objects",
            "It compares references, not values",
            "Integers are always equal",
            "It throws an exception"
          ],
          "correct_index": 1,
          "explanation": "== on objects compares references; use .equals() or unbox to compare values."
        }
      ],
      "challenge_title": "Sum and Average",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n ints into ArrayList<Integer>, print sum and integer-division average\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        int sum = 0;\n        for (int i = 0; i < list.size(); i++) {\n            sum += list.get(i);\n        }\n        System.out.println(sum);\n        System.out.println(sum / n);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "4\n2 4 6 8\n",
          "expected_output": "20\n5"
        },
        {
          "input": "3\n1 2 4\n",
          "expected_output": "7\n2"
        },
        {
          "input": "5\n10 10 10 10 10\n",
          "expected_output": "50\n10"
        }
      ]
    },
    {
      "id": "csa-07-l5",
      "project_id": "csa-07",
      "order": 5,
      "title": "Traversing with the Enhanced For Loop",
      "explanation": "## The for-each Loop\n\nThe **enhanced for loop** (also called the **for-each loop**) visits every element of an ArrayList without using an index. Its form is `for (Type var : collection)`:\n\n```java\nArrayList<String> names = new ArrayList<String>();\nnames.add(\"Ada\"); names.add(\"Grace\"); names.add(\"Linus\");\nfor (String name : names) {\n    System.out.println(name);\n}\n```\n\nRead this as: \"for each `name` in `names`...\". On each pass, `name` is automatically assigned the next element. It is cleaner and less error-prone than an indexed loop because there is no off-by-one risk.\n\n## What You Can and Cannot Do\n\nThe loop variable is a **copy of the reference** to each element. You can read it and call methods on it, but:\n\n- **You cannot reassign** the variable to change the list. `name = \"X\";` only changes the local copy, not the list.\n- **You cannot add or remove** elements during a for-each loop. Doing so throws a `ConcurrentModificationException`. (We cover safe removal next lesson.)\n\nFor changing elements by index, or removing during traversal, fall back to the indexed `for` loop.\n\n## Summing with for-each\n\n```java\nArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(3); nums.add(5); nums.add(7);\nint sum = 0;\nfor (int v : nums) {   // each v unboxes automatically\n    sum += v;\n}\nSystem.out.println(sum); // 15\n```\n\nNotice you can use `int v` because each `Integer` unboxes to an `int` automatically.\n\n## When to Use Which Loop\n\n- **for-each**: best for reading every element in order. Concise and safe.\n- **indexed for**: needed when you require the index, modify by `set`, traverse backward, or remove elements.\n\n## Summary\n\nThe enhanced for loop is the go-to tool for read-only traversal of an ArrayList. Use it whenever you just need each element and not its position.",
      "key_terms": [
        {
          "term": "Enhanced for loop",
          "definition": "A loop of the form for (Type v : collection) that visits each element in order."
        },
        {
          "term": "Loop variable",
          "definition": "A copy of each element's reference; reassigning it does not change the list."
        },
        {
          "term": "ConcurrentModificationException",
          "definition": "Thrown when a list is structurally modified during a for-each traversal."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Inside for (String s : list), does s = \"new\" change the list?",
          "options": [
            "Yes, it replaces the element",
            "No, it only changes the local copy",
            "It throws an exception",
            "It removes the element"
          ],
          "correct_index": 1,
          "explanation": "The loop variable is a copy of the reference; reassigning it does not modify the list."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which task is NOT safe to do inside a for-each over an ArrayList?",
          "options": [
            "Read each element",
            "Call a method on each element",
            "Remove an element from the list",
            "Accumulate a sum"
          ],
          "correct_index": 2,
          "explanation": "Removing during a for-each throws ConcurrentModificationException."
        },
        {
          "question": "Why use for-each instead of an indexed loop for reading?",
          "options": [
            "It is faster always",
            "It avoids off-by-one index errors and is cleaner",
            "It can modify the list safely",
            "It works only on arrays"
          ],
          "correct_index": 1,
          "explanation": "for-each removes index management, avoiding off-by-one errors for read-only traversal."
        }
      ],
      "challenge_title": "Longest Word",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n words, use a for-each loop to find and print the longest word\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<String> words = new ArrayList<String>();\n        for (int i = 0; i < n; i++) {\n            words.add(sc.next());\n        }\n        String longest = \"\";\n        for (String w : words) {\n            if (w.length() > longest.length()) {\n                longest = w;\n            }\n        }\n        System.out.println(longest);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\ncat elephant dog\n",
          "expected_output": "elephant"
        },
        {
          "input": "4\nhi hey hello yo\n",
          "expected_output": "hello"
        },
        {
          "input": "2\nsame size\n",
          "expected_output": "same"
        }
      ]
    },
    {
      "id": "csa-07-l6",
      "project_id": "csa-07",
      "order": 6,
      "title": "Removing Elements During Traversal",
      "explanation": "## The Shifting Problem\n\nWhen you `remove(i)` from an ArrayList, every element after index `i` shifts left to fill the gap. If you are looping forward with an index and you remove an element, the *next* element slides into the slot you just left, so a naive `i++` **skips** it:\n\n```java\n// BUGGY: skips elements\nfor (int i = 0; i < list.size(); i++) {\n    if (shouldRemove(list.get(i))) {\n        list.remove(i); // next element shifts into index i, then i++ skips it\n    }\n}\n```\n\n## Fix 1: Do Not Increment After Removal\n\nOnly advance `i` when you did **not** remove:\n\n```java\nint i = 0;\nwhile (i < list.size()) {\n    if (shouldRemove(list.get(i))) {\n        list.remove(i);   // do NOT increment; stay at i\n    } else {\n        i++;\n    }\n}\n```\n\nAfter a removal you re-examine the same index, which now holds the shifted element.\n\n## Fix 2: Traverse Backward\n\nLooping from the end to the start avoids the shift problem entirely, because removing index `i` only shifts elements at indices greater than `i`, which you have already visited:\n\n```java\nfor (int i = list.size() - 1; i >= 0; i--) {\n    if (shouldRemove(list.get(i))) {\n        list.remove(i);\n    }\n}\n```\n\nThis is often the cleanest fix.\n\n## Why Not for-each?\n\nYou **cannot** remove inside an enhanced for loop. Structurally modifying the list during a for-each throws a `ConcurrentModificationException`. Always use an indexed loop (or an `Iterator`, which is beyond the AP subset) when removing.\n\n## Summary\n\n- Removing shifts later elements left, so forward index loops can skip elements.\n- Either avoid incrementing after a removal, or traverse backward.\n- Never remove inside a for-each loop.",
      "key_terms": [
        {
          "term": "Shifting",
          "definition": "After remove(i), all elements after index i move one slot left."
        },
        {
          "term": "Backward traversal",
          "definition": "Looping from size()-1 down to 0 so removals do not disturb unvisited indices."
        },
        {
          "term": "Skip bug",
          "definition": "Forward index loops that always increment skip the element shifted into the removed slot."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does a forward for loop that always does i++ skip elements when removing?",
          "options": [
            "remove() is random",
            "The next element shifts into index i, then i++ moves past it",
            "Lists cannot be removed from",
            "i++ removes two elements"
          ],
          "correct_index": 1,
          "explanation": "After removal the following element occupies index i; incrementing then skips over it."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which loop direction lets you safely remove with a simple i-- step?",
          "options": [
            "Forward, always incrementing",
            "Backward from size()-1 to 0",
            "for-each",
            "No loop can remove"
          ],
          "correct_index": 1,
          "explanation": "Backward traversal removes only already-visited higher indices, so nothing is skipped."
        },
        {
          "question": "In a forward while loop, when should you increment i?",
          "options": [
            "Always",
            "Only when you removed an element",
            "Only when you did NOT remove an element",
            "Never"
          ],
          "correct_index": 2,
          "explanation": "Increment only when no removal happened; after a removal stay to re-check the shifted element."
        }
      ],
      "challenge_title": "Remove the Evens",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n ints, remove all even values during traversal, print remaining space-separated\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        for (int i = list.size() - 1; i >= 0; i--) {\n            if (list.get(i) % 2 == 0) {\n                list.remove(i);\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            if (i > 0) sb.append(\" \");\n            sb.append(list.get(i));\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 5\n",
          "expected_output": "1 3 5"
        },
        {
          "input": "4\n2 4 6 8\n",
          "expected_output": ""
        },
        {
          "input": "6\n7 7 2 9 4 11\n",
          "expected_output": "7 7 9 11"
        }
      ]
    },
    {
      "id": "csa-07-l7",
      "project_id": "csa-07",
      "order": 7,
      "title": "Standard Algorithms on ArrayList",
      "explanation": "## Library of Patterns\n\nThe AP CSA exam expects you to write common **list algorithms** by hand on an ArrayList. These all build from `get`, `set`, `size`, and loops. Master these patterns.\n\n## Finding a Maximum or Minimum\n\nAssume the first element is the best, then improve:\n\n```java\nint max = list.get(0);\nfor (int i = 1; i < list.size(); i++) {\n    if (list.get(i) > max) {\n        max = list.get(i);\n    }\n}\n```\n\n## Searching\n\nA **linear search** returns the index of a target, or -1 if absent:\n\n```java\nint findIndex(ArrayList<Integer> list, int target) {\n    for (int i = 0; i < list.size(); i++) {\n        if (list.get(i) == target) return i;\n    }\n    return -1;\n}\n```\n\nFor objects like Strings, use `.equals()` instead of `==`.\n\n## Counting and Summing\n\n```java\nint count = 0, sum = 0;\nfor (int v : list) {\n    sum += v;\n    if (v > 0) count++;\n}\n```\n\n## Building a New List\n\nMany problems **filter** or **transform** into a fresh list rather than mutating the original:\n\n```java\nArrayList<Integer> doubled = new ArrayList<Integer>();\nfor (int v : list) {\n    doubled.add(v * 2);\n}\n```\n\n## Detecting Duplicates\n\nA nested loop compares each pair:\n\n```java\nboolean hasDup = false;\nfor (int i = 0; i < list.size(); i++) {\n    for (int j = i + 1; j < list.size(); j++) {\n        if (list.get(i).equals(list.get(j))) hasDup = true;\n    }\n}\n```\n\n## Summary\n\n- Max/min: seed with the first element, then compare.\n- Linear search: return index or -1; use `.equals()` for objects.\n- Count/sum: accumulate in a loop.\n- Filter/transform: append into a new list.\n- Duplicates: nested loops with `i` and `j = i+1`.\n\nThese reusable patterns are the heart of free-response questions.",
      "key_terms": [
        {
          "term": "Linear search",
          "definition": "Scanning a list element by element to find a target, returning its index or -1."
        },
        {
          "term": "Filter",
          "definition": "Building a new list containing only elements that satisfy a condition."
        },
        {
          "term": "Accumulator",
          "definition": "A variable like sum or count updated each loop iteration."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Linear search returns what when the target is not present?",
          "options": [
            "0",
            "null",
            "-1",
            "the list size"
          ],
          "correct_index": 2,
          "explanation": "By convention linear search returns -1 to signal the target was not found."
        }
      ],
      "quiz_questions": [
        {
          "question": "When finding a max, why seed with list.get(0)?",
          "options": [
            "It is always the largest",
            "So the first comparison has a valid starting value",
            "To skip index 0",
            "It is required syntax"
          ],
          "correct_index": 1,
          "explanation": "Seeding with the first element gives a valid baseline so later elements can be compared and replace it."
        },
        {
          "question": "To search an ArrayList<String> for a target, you should compare with:",
          "options": [
            "==",
            ".equals()",
            ".compareTo() only",
            ".length()"
          ],
          "correct_index": 1,
          "explanation": "String content comparison uses .equals(); == compares references."
        }
      ],
      "challenge_title": "Find Max and Its Index",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n ints, print the maximum value and the index of its FIRST occurrence\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        int max = list.get(0);\n        int idx = 0;\n        for (int i = 1; i < list.size(); i++) {\n            if (list.get(i) > max) {\n                max = list.get(i);\n                idx = i;\n            }\n        }\n        System.out.println(max);\n        System.out.println(idx);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 9 4 9 1\n",
          "expected_output": "9\n1"
        },
        {
          "input": "3\n5 5 5\n",
          "expected_output": "5\n0"
        },
        {
          "input": "4\n1 2 3 8\n",
          "expected_output": "8\n3"
        }
      ]
    },
    {
      "id": "csa-07-l8",
      "project_id": "csa-07",
      "order": 8,
      "title": "Putting It Together: Insertion Sort",
      "explanation": "## A Capstone Algorithm\n\nThis lesson combines everything: `get`, `set`, `size`, indexed loops, and in-place modification. **Insertion sort** is a standard sorting algorithm that the AP exam expects you to read and trace, and it maps cleanly onto an ArrayList.\n\n## The Idea\n\nInsertion sort builds a sorted region at the front of the list. For each new element, it slides it leftward past any larger elements until it lands in the correct spot, like sorting playing cards in your hand:\n\n- Treat index 0 as a sorted region of size one.\n- Take the element at index `i` and call it the **key**.\n- Shift every element in the sorted region that is **larger** than the key one slot right.\n- Drop the key into the opened gap.\n\n## Implementation\n\n```java\nfor (int i = 1; i < list.size(); i++) {\n    int key = list.get(i);\n    int j = i - 1;\n    while (j >= 0 && list.get(j) > key) {\n        list.set(j + 1, list.get(j)); // shift right\n        j--;\n    }\n    list.set(j + 1, key);             // place the key\n}\n```\n\nTrace it on `[3, 1, 2]`:\n\n- i=1, key=1: shift 3 right -> `[3, 3, 2]`, place 1 -> `[1, 3, 2]`.\n- i=2, key=2: shift 3 right -> `[1, 3, 3]`, place 2 -> `[1, 2, 3]`.\n\nSorted.\n\n## Why It Matters\n\nInsertion sort is **O(n^2)** in the worst case but efficient for small or nearly sorted lists. More importantly, it exercises the full ArrayList toolkit: index management, `get`/`set`, and a careful inner loop. If you can write and trace this, you understand ArrayList deeply.\n\n## Summary\n\n- Insertion sort grows a sorted prefix one element at a time.\n- Use `set` to shift elements right, then place the key.\n- It ties together every ArrayList skill from this unit.",
      "key_terms": [
        {
          "term": "Insertion sort",
          "definition": "A sort that builds a sorted prefix by inserting each element into its correct position."
        },
        {
          "term": "Key",
          "definition": "The current element being inserted into the already-sorted region."
        },
        {
          "term": "In-place",
          "definition": "An algorithm that rearranges the existing list without creating a new one."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In insertion sort, what does the inner while loop do?",
          "options": [
            "Removes elements",
            "Shifts larger sorted elements right to make room for the key",
            "Adds new elements",
            "Reverses the list"
          ],
          "correct_index": 1,
          "explanation": "The inner loop shifts elements greater than the key one slot right, opening a gap for the key."
        }
      ],
      "quiz_questions": [
        {
          "question": "Where does insertion sort place the key each pass?",
          "options": [
            "At the end of the list",
            "Into the gap opened in the sorted region",
            "At index 0 always",
            "It does not move the key"
          ],
          "correct_index": 1,
          "explanation": "After shifting larger elements right, the key drops into the opened gap at j+1."
        },
        {
          "question": "What is insertion sort's worst-case time complexity?",
          "options": [
            "O(1)",
            "O(n)",
            "O(n log n)",
            "O(n^2)"
          ],
          "correct_index": 3,
          "explanation": "In the worst case each element may shift past all prior ones, giving O(n^2)."
        }
      ],
      "challenge_title": "Insertion Sort",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: read n ints into an ArrayList<Integer>, sort with insertion sort, print ascending space-separated\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<Integer> list = new ArrayList<Integer>();\n        for (int i = 0; i < n; i++) {\n            list.add(sc.nextInt());\n        }\n        for (int i = 1; i < list.size(); i++) {\n            int key = list.get(i);\n            int j = i - 1;\n            while (j >= 0 && list.get(j) > key) {\n                list.set(j + 1, list.get(j));\n                j--;\n            }\n            list.set(j + 1, key);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            if (i > 0) sb.append(\" \");\n            sb.append(list.get(i));\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 1 4 1 5\n",
          "expected_output": "1 1 3 4 5"
        },
        {
          "input": "4\n9 7 8 6\n",
          "expected_output": "6 7 8 9"
        },
        {
          "input": "3\n2 2 1\n",
          "expected_output": "1 2 2"
        }
      ]
    }
  ]
}
