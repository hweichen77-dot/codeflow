// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-aap1",
    "title": "Variables, Lists & Procedures",
    "description": "Big Idea 3 introduction: store data in variables, group it in lists, and package reusable logic into procedures that take parameters and return values.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 103,
    "track": "apcsp",
    "unit": "Big Idea 3 — Algorithms & Programming I",
    "tags": [
      "variables",
      "lists",
      "procedures/parameters"
    ]
  },
  "lessons": [
    {
      "id": "csp-aap1-l1",
      "project_id": "csp-aap1",
      "order": 1,
      "title": "Variables and Assignment",
      "concept": "Variables and Assignment",
      "xp_reward": 10,
      "explanation": "Every program needs a way to remember things — a player's score, a user's name, the running total of a bill. In AP CSP that memory comes from **variables**. A variable is a named box that holds a single value, and the value can change as the program runs.\n\n## Assignment\n\nYou put a value into a variable using an **assignment statement**. In Python the operator is `=`, read as \"gets\" or \"is set to\" — not \"equals\" in the math sense.\n\n```python\nscore = 0        # create score, store 0\nscore = score + 10   # read old score (0), add 10, store 15... no, store 10\nname = \"Ada\"     # a variable can hold text too\n```\n\nThe right side is evaluated **first**, then the result is stored in the name on the left. So `score = score + 10` looks at the current value of `score`, adds 10, and writes the new value back. The old value is overwritten.\n\nOn the AP exam the equivalent pseudocode is `a ← expression`. The arrow makes the direction obvious: the box on the left receives the value.\n\n## Naming and data types\n\n- **Variable name** — a label you choose. Use clear names like `total`, `userAge`, `firstName`.\n- A variable's value has a **data type**. Common ones: integers (`42`), floating-point numbers (`3.14`), strings (`\"hi\"`), and Booleans (`True`/`False`).\n- Reassigning a variable replaces its value; the variable does not remember its history.\n\n## Reading input\n\nPrograms become useful when they react to data they did not know in advance. `input()` reads one line of text from the user. Because it always returns a **string**, you convert it when you need a number:\n\n```python\nraw = input()        # e.g. the user types \"7\"\nn = int(raw)         # convert string \"7\" to the integer 7\nprint(n * 2)         # 14\n```\n\nForgetting the `int()` conversion is the single most common beginner bug: `\"7\" * 2` gives `\"77\"` (string repetition), not `14`.\n\n## Why it matters\n\nVariables are the foundation of every algorithm. Loops count with them, conditionals test them, and procedures pass them around. Master assignment — value flows **right to left** into a named box that you can overwrite at any time — and the rest of programming builds cleanly on top.",
      "key_terms": [
        {
          "term": "Variable",
          "definition": "A named storage location that holds a single value, which can change as the program runs."
        },
        {
          "term": "Assignment",
          "definition": "An operation that evaluates the expression on the right and stores the result in the variable named on the left (Python `=`, AP pseudocode `←`)."
        },
        {
          "term": "Data type",
          "definition": "The kind of value a variable holds, such as integer, floating-point number, string, or Boolean."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After running `x = 5` then `x = x + 3`, what is the value of `x`?",
          "options": [
            "8",
            "5",
            "3",
            "53"
          ],
          "correct_index": 0,
          "explanation": "The right side `x + 3` is evaluated using the current value 5, giving 8, which is then stored back into x."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why does `int()` appear in `n = int(input())`?",
          "options": [
            "Because input() returns a string, and int() converts it to a number for arithmetic",
            "Because input() can only read one character at a time",
            "Because int() prints the value to the screen",
            "Because variables must always be integers"
          ],
          "correct_index": 0,
          "explanation": "input() always returns a string. To do math on it you must convert with int() (or float())."
        },
        {
          "question": "In AP CSP pseudocode, what does the statement `a ← 7` mean?",
          "options": [
            "Store the value 7 in the variable a",
            "Test whether a is equal to 7",
            "Move a to the left side of the screen",
            "Create a list named a with 7 elements"
          ],
          "correct_index": 0,
          "explanation": "The left-arrow is the assignment operator; it places the value on the right into the variable on the left."
        }
      ],
      "challenge_title": "Running Total",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer n, then read n more integers (one per line).\n# Print their sum.\n\nn = int(input())\ntotal = 0\n# TODO: loop n times, read each integer, add it to total\n\nprint(total)\n",
      "challenge_solution_code": "n = int(input())\ntotal = 0\nfor _ in range(n):\n    value = int(input())\n    total = total + value\nprint(total)\n",
      "challenge_test_cases": [
        {
          "input": "3\n10\n20\n30\n",
          "expected_output": "60"
        },
        {
          "input": "1\n5\n",
          "expected_output": "5"
        },
        {
          "input": "4\n-2\n2\n-3\n3\n",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-aap1-l2",
      "project_id": "csp-aap1",
      "order": 2,
      "title": "Lists: Storing Many Values",
      "concept": "Lists and Indexing",
      "xp_reward": 10,
      "explanation": "A single variable holds one value. But what if you have 30 test scores or a class roster? Creating `score1`, `score2`, ... `score30` is hopeless. The answer is a **list**: one named variable that holds an ordered sequence of values.\n\n## Creating and indexing\n\nIn Python you write a list with square brackets:\n\n```python\nscores = [88, 92, 75, 100]\nprint(scores[0])   # 88  -> the FIRST element\nprint(scores[3])   # 100 -> the LAST element here\nprint(len(scores)) # 4   -> how many elements\n```\n\nEach value sits at a numbered position called an **index**. Python lists are **zero-indexed**: the first element is at index `0`, the second at `1`, and the last at `len(list) - 1`. Reaching past the end (here `scores[4]`) raises an error.\n\n> Note: AP exam pseudocode lists are **one-indexed** — `LIST[1]` is the first element. The idea of ordered, numbered access is identical; only the starting number differs. In runnable Python, always start from 0.\n\n## Common operations\n\n- **Access**: `scores[i]` reads the element at index `i`.\n- **Change**: `scores[0] = 90` overwrites the first element.\n- **Append**: `scores.append(64)` adds a new element to the end.\n- **Length**: `len(scores)` returns the count of elements.\n\n## Traversing a list\n\nMost list work is a **traversal** — visiting every element once, usually with a loop:\n\n```python\nscores = [88, 92, 75, 100]\ntotal = 0\nfor s in scores:        # s takes each value in turn\n    total = total + s\nprint(total)            # 355\nprint(total / len(scores))  # 88.75  (the average)\n```\n\nThe `for s in scores` form hands you each value directly. When you need positions instead, use `for i in range(len(scores))` and access `scores[i]`.\n\n## Why it matters\n\nLists turn a pile of related data into something a single loop can process. Almost every algorithm you will write — summing, searching, finding a maximum, filtering — is built on a list traversal. Once you can store many values together and walk through them, you can manage data sets of any size with the same short block of code.",
      "key_terms": [
        {
          "term": "List",
          "definition": "An ordered collection of values stored under one variable name, accessible by position."
        },
        {
          "term": "Index",
          "definition": "The numbered position of an element in a list; Python lists start at index 0."
        },
        {
          "term": "Traversal",
          "definition": "Visiting each element of a list in order, typically using a loop."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Given `nums = [4, 8, 15, 16]`, what does `nums[2]` evaluate to?",
          "options": [
            "15",
            "8",
            "16",
            "2"
          ],
          "correct_index": 0,
          "explanation": "Python is zero-indexed, so index 0 is 4, index 1 is 8, and index 2 is 15."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does `len(x)` return for the list `x = [10, 20, 30]`?",
          "options": [
            "3",
            "2",
            "30",
            "60"
          ],
          "correct_index": 0,
          "explanation": "len() returns the number of elements, which is 3, regardless of their values."
        },
        {
          "question": "Which loop visits every value in `data` and adds it to `total`?",
          "options": [
            "for v in data: total = total + v",
            "for v in data: total = v",
            "if data: total = total + data",
            "while data: total = total + len(data)"
          ],
          "correct_index": 0,
          "explanation": "`for v in data` is a traversal that binds v to each element in turn; adding v each pass accumulates the sum."
        }
      ],
      "challenge_title": "Largest in the List",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: an integer n.\n# Second line: n space-separated integers.\n# Print the largest of those integers.\n\nn = int(input())\nnums = list(map(int, input().split()))\n# TODO: find and print the largest value (do not use max())\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\nlargest = nums[0]\nfor v in nums:\n    if v > largest:\n        largest = v\nprint(largest)\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 9 2 7 4\n",
          "expected_output": "9"
        },
        {
          "input": "1\n42\n",
          "expected_output": "42"
        },
        {
          "input": "4\n-5 -1 -8 -3\n",
          "expected_output": "-1"
        }
      ]
    },
    {
      "id": "csp-aap1-l3",
      "project_id": "csp-aap1",
      "order": 3,
      "title": "Procedures, Parameters, and Return Values",
      "concept": "Procedures and Return Values",
      "xp_reward": 10,
      "explanation": "As programs grow, copying the same block of code in five places becomes a maintenance nightmare. A **procedure** (called a *function* in Python) solves this: you write a named, reusable chunk of logic once and **call** it whenever you need it.\n\n## Defining and calling\n\n```python\ndef greet():\n    print(\"Hello!\")\n\ngreet()   # the call -> prints Hello!\ngreet()   # call again -> prints Hello! again\n```\n\n`def` defines the procedure; `greet()` runs it. This is **abstraction**: the caller uses the name and does not care how the body works.\n\n## Parameters and arguments\n\nProcedures get flexible when you pass data in. A **parameter** is a placeholder named in the definition; an **argument** is the actual value you supply at the call.\n\n```python\ndef square(num):     # num is the parameter\n    print(num * num)\n\nsquare(5)            # 5 is the argument -> prints 25\nsquare(9)            # prints 81\n```\n\nThe argument `5` is copied into the parameter `num` for that one call. Different arguments produce different behavior from the same code.\n\n## Return values\n\nPrinting is a dead end — the result vanishes to the screen. A **return value** sends a result back to the caller so the program can use it:\n\n```python\ndef square(num):\n    return num * num     # hand the result back\n\nresult = square(6)       # result now holds 36\nprint(result + 4)        # 40 -- we can keep computing\n```\n\nWhen Python hits `return`, the procedure ends immediately and the call expression *becomes* that value. A procedure with no `return` hands back `None`. The AP pseudocode equivalent is `PROCEDURE square(num) { RETURN(num * num) }` — same parameter-in, value-out shape.\n\n## Why it matters\n\nProcedures are how programmers manage complexity. They let you:\n\n- **Reuse** logic instead of duplicating it.\n- **Name** an idea so code reads like its intent (`average(scores)` vs. a blob of math).\n- **Hide detail** behind a clean interface — the heart of abstraction in Big Idea 3.\n\nCombine all three lessons and you have the core toolkit: variables hold values, lists group them, and procedures with parameters and return values package the algorithms that work on them.",
      "key_terms": [
        {
          "term": "Procedure",
          "definition": "A named, reusable block of code (a function in Python) defined once and called when needed."
        },
        {
          "term": "Parameter",
          "definition": "A named placeholder in a procedure's definition that receives an argument value when the procedure is called."
        },
        {
          "term": "Return value",
          "definition": "The result a procedure hands back to its caller, allowing the call to be used in further computation."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `result` hold after `def f(x): return x + 1` and `result = f(7)`?",
          "options": [
            "8",
            "7",
            "None",
            "x + 1"
          ],
          "correct_index": 0,
          "explanation": "7 is passed in as x, the procedure returns x + 1 = 8, and that value is stored in result."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the difference between a parameter and an argument?",
          "options": [
            "A parameter is the placeholder in the definition; an argument is the actual value passed at the call",
            "They are two words for exactly the same thing",
            "A parameter is returned; an argument is printed",
            "An argument is defined with def; a parameter is not"
          ],
          "correct_index": 0,
          "explanation": "The definition lists parameters; the call supplies arguments that are copied into those parameters."
        },
        {
          "question": "What does a Python function return if it has no `return` statement?",
          "options": [
            "None",
            "0",
            "An empty string",
            "It causes an error"
          ],
          "correct_index": 0,
          "explanation": "A function without an explicit return hands back the special value None."
        }
      ],
      "challenge_title": "Average Score Procedure",
      "challenge_language": "python",
      "challenge_starter_code": "# Define a procedure average(values) that returns the average of a list.\n# Read n, then n space-separated integers, and print their average\n# rounded to 2 decimal places.\n\ndef average(values):\n    # TODO: return the average of the numbers in values\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\nprint(round(average(nums), 2))\n",
      "challenge_solution_code": "def average(values):\n    total = 0\n    for v in values:\n        total = total + v\n    return total / len(values)\n\nn = int(input())\nnums = list(map(int, input().split()))\nprint(round(average(nums), 2))\n",
      "challenge_test_cases": [
        {
          "input": "4\n88 92 75 100\n",
          "expected_output": "88.75"
        },
        {
          "input": "3\n10 20 30\n",
          "expected_output": "20.0"
        },
        {
          "input": "2\n5 2\n",
          "expected_output": "3.5"
        }
      ]
    }
  ]
}
