// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-aap2",
    "title": "Algorithms, Iteration & Simulation",
    "description": "Build the control-flow core of Big Idea 3: Boolean logic, conditionals, loops, list traversals, searching, simulation, and why some problems are hard or impossible to solve.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 104,
    "track": "apcsp",
    "unit": "Big Idea 3 — Algorithms & Programming II",
    "tags": [
      "iteration",
      "searching",
      "simulation"
    ]
  },
  "lessons": [
    {
      "id": "csp-aap2-l1",
      "project_id": "csp-aap2",
      "order": 1,
      "title": "Boolean Logic and Relational Operators",
      "concept": "Boolean Expressions",
      "xp_reward": 10,
      "explanation": "Before a program can make a decision, it needs a way to ask a yes-or-no question. The answer to such a question is a **Boolean** value: exactly one of `True` or `False`. Every loop that stops, every `if` that fires, and every search that succeeds rests on Boolean logic.\n\n## Relational operators\n\nA **relational operator** compares two values and produces a Boolean:\n\n- `==` equal to (note: two equals signs, not one)\n- `!=` not equal to\n- `<`, `>`, `<=`, `>=` the usual orderings\n\n```python\nprint(7 == 7)    # True\nprint(3 != 3)    # False\nprint(5 > 9)     # False\nprint(4 <= 4)    # True\n```\n\nWatch the difference between `=` (assignment, stores a value) and `==` (comparison, asks a question). Mixing them up is the most common Boolean bug.\n\n## Logical operators\n\nYou combine Boolean values with three **logical operators**:\n\n- `and` — True only if **both** sides are True\n- `or` — True if **at least one** side is True\n- `not` — flips True to False and vice versa\n\n```python\nage = 16\nhas_id = True\nprint(age >= 18 and has_id)   # False (first side fails)\nprint(age >= 18 or has_id)    # True  (second side holds)\nprint(not has_id)             # False\n```\n\nThe AP exam uses the words `AND`, `OR`, `NOT` in pseudocode; the meaning is identical. A handy reference is the **truth table** for `and`: only `True and True` yields `True`; every other combination is `False`. For `or`, only `False or False` yields `False`.\n\n## Short-circuit evaluation\n\nPython stops as soon as the answer is known. In `a and b`, if `a` is False the whole expression is False and `b` is never checked. This **short-circuit** behavior matters when the second test could be slow or unsafe.\n\n## Why it matters\n\nBoolean expressions are the language of conditions. Master comparing values and combining the results, and you can express any rule a decision or loop will ever need.",
      "key_terms": [
        {
          "term": "Boolean",
          "definition": "A value that is exactly one of True or False, used to represent the answer to a yes-or-no question."
        },
        {
          "term": "Relational operator",
          "definition": "An operator such as ==, !=, <, or >= that compares two values and produces a Boolean."
        },
        {
          "term": "Logical operator",
          "definition": "and, or, or not — operators that combine or invert Boolean values."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `5 > 3 and 2 == 2` evaluate to?",
          "options": [
            "True",
            "False",
            "5",
            "An error"
          ],
          "correct_index": 0,
          "explanation": "5 > 3 is True and 2 == 2 is True, so True and True gives True."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the result of `not (4 < 4)`?",
          "options": [
            "True",
            "False",
            "0",
            "4"
          ],
          "correct_index": 0,
          "explanation": "4 < 4 is False, and not False is True."
        },
        {
          "question": "Which operator should you use to TEST whether x equals 10?",
          "options": [
            "x == 10",
            "x = 10",
            "x => 10",
            "x := 10"
          ],
          "correct_index": 0,
          "explanation": "Use == for comparison. A single = is assignment, which stores 10 into x instead of asking a question."
        }
      ],
      "challenge_title": "Both Positive?",
      "challenge_language": "python",
      "challenge_starter_code": "# One line contains two space-separated integers a and b.\n# Print True if BOTH are positive (greater than 0), otherwise print False.\n\nline = input().split()\na = int(line[0])\nb = int(line[1])\n# TODO: print whether both a and b are positive\n",
      "challenge_solution_code": "line = input().split()\na = int(line[0])\nb = int(line[1])\nprint(a > 0 and b > 0)\n",
      "challenge_test_cases": [
        {
          "input": "3 5\n",
          "expected_output": "True"
        },
        {
          "input": "-1 4\n",
          "expected_output": "False"
        },
        {
          "input": "0 0\n",
          "expected_output": "False"
        }
      ]
    },
    {
      "id": "csp-aap2-l2",
      "project_id": "csp-aap2",
      "order": 2,
      "title": "Conditionals: if / elif / else",
      "concept": "Selection",
      "xp_reward": 10,
      "explanation": "A program that always does the same thing is just a calculator. **Conditionals** let code choose a path based on a Boolean condition — this is called **selection**, one of the three pillars of Big Idea 3 alongside sequencing and iteration.\n\n## The if statement\n\n```python\ntemp = int(input())\nif temp > 30:\n    print(\"Hot\")\n```\n\nPython evaluates the condition `temp > 30`. If it is **True**, the indented block runs; if **False**, the block is skipped entirely. Indentation is how Python knows what belongs inside the `if`.\n\n## if / else: two paths\n\nWhen you want one action for True and a different action for False, add `else`:\n\n```python\nif temp > 30:\n    print(\"Hot\")\nelse:\n    print(\"Not hot\")\n```\n\nExactly one branch runs — never both, never neither.\n\n## elif: many paths\n\nFor several mutually exclusive cases, chain `elif` (\"else if\"). Python checks each condition top to bottom and runs the **first** one that is True, then skips the rest:\n\n```python\nscore = int(input())\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")\n```\n\nA score of 95 matches the first test and prints `A`. A score of 82 fails the first test, passes `score >= 80`, prints `B`, and the remaining branches are never examined. **Order matters**: if you wrote `score >= 70` first, every passing grade would print `C`.\n\n## The AP pseudocode form\n\nThe exam writes this as `IF (condition) { ... } ELSE { ... }`. The block structure is the same; Python just uses indentation instead of braces.\n\n## Why it matters\n\nSelection is how software responds to data: validating input, branching on user choices, classifying values. Combined with the Boolean logic from the previous lesson, `if`/`elif`/`else` lets a program react differently to every situation it meets.",
      "key_terms": [
        {
          "term": "Selection",
          "definition": "Choosing which block of code to run based on whether a Boolean condition is True or False."
        },
        {
          "term": "Conditional statement",
          "definition": "An if (optionally with elif/else) that executes a block only when its condition holds."
        },
        {
          "term": "Branch",
          "definition": "One of the alternative blocks of a conditional; exactly one branch of an if/elif/else chain runs."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In an if/elif/else chain, how many branches execute for a single run?",
          "options": [
            "Exactly one",
            "All of them",
            "Zero or more",
            "At most two"
          ],
          "correct_index": 0,
          "explanation": "Python runs the first branch whose condition is True (or else if none match), and exactly one branch runs."
        }
      ],
      "quiz_questions": [
        {
          "question": "If `score = 82`, what does the grade example print?",
          "options": [
            "B",
            "A",
            "C",
            "F"
          ],
          "correct_index": 0,
          "explanation": "82 fails score >= 90 but passes score >= 80, so the B branch runs and the rest are skipped."
        },
        {
          "question": "Why must the `score >= 90` test come before `score >= 80`?",
          "options": [
            "Python runs the first matching branch, so the stricter test must be checked first",
            "elif requires descending order to compile",
            "Otherwise the program crashes",
            "It does not matter; order is irrelevant"
          ],
          "correct_index": 0,
          "explanation": "Since the first true condition wins, a 95 would wrongly match score >= 80 first if that test came earlier."
        }
      ],
      "challenge_title": "Letter Grade",
      "challenge_language": "python",
      "challenge_starter_code": "# Read one integer score (0-100).\n# Print the letter grade:\n#   90+ -> A, 80-89 -> B, 70-79 -> C, below 70 -> F\n\nscore = int(input())\n# TODO: print the correct letter grade\n",
      "challenge_solution_code": "score = int(input())\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")\n",
      "challenge_test_cases": [
        {
          "input": "95\n",
          "expected_output": "A"
        },
        {
          "input": "82\n",
          "expected_output": "B"
        },
        {
          "input": "65\n",
          "expected_output": "F"
        }
      ]
    },
    {
      "id": "csp-aap2-l3",
      "project_id": "csp-aap2",
      "order": 3,
      "title": "Nested Conditionals",
      "concept": "Nested Selection",
      "xp_reward": 10,
      "explanation": "Real decisions often depend on a second question *only after* a first one is answered. Placing one conditional **inside** another creates a **nested conditional**, letting you express layered rules.\n\n## A conditional inside a conditional\n\nImagine a movie ticket. Children under 13 always pay $5. For everyone else, the price depends on whether they are a member:\n\n```python\nage = int(input())\nmember = input().strip()\nif age < 13:\n    price = 5\nelse:\n    if member == \"yes\":\n        price = 8\n    else:\n        price = 12\nprint(price)\n```\n\nThe outer `if` splits people into *child* vs. *everyone else*. Only inside the `else` branch — the adult path — does the program ask the second question about membership. A child never reaches the membership test at all. This is the essence of **nested selection**: the inner decision is reached only when the outer condition has already been settled.\n\n## Reading the indentation\n\nIndentation shows the nesting depth. The inner `if/else` is indented one level further because it lives inside the outer `else`. Trace it carefully:\n\n- `age = 10` -> outer condition True -> `price = 5`, inner block skipped.\n- `age = 30, member = \"yes\"` -> outer False -> inner True -> `price = 8`.\n- `age = 30, member = \"no\"` -> outer False -> inner False -> `price = 12`.\n\n## Nesting vs. elif\n\nMany nested chains can be flattened with `elif`, which is often clearer. But true nesting shines when the inner question is **meaningful only** in one branch — like asking about membership only for non-children. The AP exam draws these as boxes inside boxes; in pseudocode you would see `IF { IF { } ELSE { } }`.\n\n## Why it matters\n\nNested conditionals model the layered logic of the real world: eligibility checks, pricing tiers, game states. Learning to read and write them — and to trace which path the data takes — prepares you for the branching logic at the heart of every nontrivial algorithm.",
      "key_terms": [
        {
          "term": "Nested conditional",
          "definition": "A conditional statement placed inside a branch of another conditional, reached only when the outer condition is settled a certain way."
        },
        {
          "term": "Nesting depth",
          "definition": "How many levels of conditionals a statement is enclosed within, shown by its indentation in Python."
        },
        {
          "term": "Trace",
          "definition": "Stepping through code by hand with specific inputs to determine which branches run and what value results."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In the ticket example, when is the membership test (`member == \"yes\"`) ever evaluated?",
          "options": [
            "Only when age is 13 or older",
            "Always, for every input",
            "Only when age is under 13",
            "Never"
          ],
          "correct_index": 0,
          "explanation": "The membership test lives inside the outer else, which is reached only when age < 13 is False."
        }
      ],
      "quiz_questions": [
        {
          "question": "With `age = 30` and `member = \"no\"`, what price does the example compute?",
          "options": [
            "12",
            "5",
            "8",
            "0"
          ],
          "correct_index": 0,
          "explanation": "Outer condition is False (not a child), inner membership is False, so price = 12."
        },
        {
          "question": "What primarily indicates nesting depth in Python?",
          "options": [
            "Indentation level",
            "The number of variables",
            "Curly braces",
            "Comments"
          ],
          "correct_index": 0,
          "explanation": "Python uses indentation to show which statements are nested inside which blocks."
        }
      ],
      "challenge_title": "Ticket Price",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: an integer age.\n# Line 2: the word yes or no (membership status).\n# Rules: age < 13 -> price 5.\n#        otherwise: member yes -> 8, member no -> 12.\n# Print the price.\n\nage = int(input())\nmember = input().strip()\n# TODO: use a nested conditional to compute and print the price\n",
      "challenge_solution_code": "age = int(input())\nmember = input().strip()\nif age < 13:\n    price = 5\nelse:\n    if member == \"yes\":\n        price = 8\n    else:\n        price = 12\nprint(price)\n",
      "challenge_test_cases": [
        {
          "input": "10\nno\n",
          "expected_output": "5"
        },
        {
          "input": "30\nyes\n",
          "expected_output": "8"
        },
        {
          "input": "30\nno\n",
          "expected_output": "12"
        }
      ]
    },
    {
      "id": "csp-aap2-l4",
      "project_id": "csp-aap2",
      "order": 4,
      "title": "While Loops: Repeat Until Done",
      "concept": "Indefinite Iteration",
      "xp_reward": 10,
      "explanation": "**Iteration** means repeating a block of code. When you do not know in advance how many repetitions you need — you only know a *condition* for stopping — you reach for a **while loop**. This is **indefinite iteration**.\n\n## Anatomy of a while loop\n\n```python\nn = 10\nwhile n > 0:      # condition checked BEFORE each pass\n    print(n)\n    n = n - 1     # update that moves toward stopping\nprint(\"Liftoff\")\n```\n\nA while loop repeats as long as its condition is True. Each pass:\n\n1. Check the condition. If False, exit the loop.\n2. If True, run the body.\n3. Return to step 1.\n\nThe crucial detail is the **update**: `n = n - 1` changes the variable the condition depends on. Without it the condition would stay True forever.\n\n## The infinite loop trap\n\nIf the body never makes the condition False, you get an **infinite loop** — the program runs forever:\n\n```python\nn = 10\nwhile n > 0:\n    print(n)   # forgot to change n -> never stops!\n```\n\nEvery while loop needs three things: a starting value, a condition, and an update inside the body that drives the condition toward False.\n\n## A real example: the Collatz steps\n\nThe **Collatz process** takes a number and repeats: if even, halve it; if odd, triple it and add one. It always reaches 1, but the number of steps is unpredictable — perfect for a while loop:\n\n```python\nn = 6\nsteps = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n = n // 2\n    else:\n        n = 3 * n + 1\n    steps = steps + 1\nprint(steps)   # 8\n```\n\nYou cannot know the step count ahead of time, so a counted loop will not do — but the condition `n != 1` tells you exactly when to stop.\n\n## Why it matters\n\nWhile loops handle the open-ended repetition that fills real software: reading input until a sentinel, retrying until success, simulating until a goal is met. Always pair a condition with an update, or the loop will never end.",
      "key_terms": [
        {
          "term": "Iteration",
          "definition": "The repetition of a block of code; one of the three building blocks of algorithms."
        },
        {
          "term": "While loop",
          "definition": "A loop that repeats its body as long as a Boolean condition remains True, checking the condition before each pass."
        },
        {
          "term": "Infinite loop",
          "definition": "A loop whose condition never becomes False, so it never stops; usually caused by a missing update."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the most common cause of an accidental infinite while loop?",
          "options": [
            "The body never updates the variable the condition depends on",
            "Using elif instead of else",
            "Printing inside the loop",
            "Starting the counter at 0"
          ],
          "correct_index": 0,
          "explanation": "If nothing in the body changes the condition's value, it stays True forever."
        }
      ],
      "quiz_questions": [
        {
          "question": "When is a while loop's condition checked?",
          "options": [
            "Before each pass through the body",
            "Only once at the start",
            "Only after the body runs",
            "Never; it always runs 10 times"
          ],
          "correct_index": 0,
          "explanation": "A while loop tests its condition before every pass; if False at the start, the body never runs."
        },
        {
          "question": "Which kind of loop best fits a task where the number of repetitions is unknown ahead of time?",
          "options": [
            "A while loop driven by a stopping condition",
            "A for loop over a fixed range",
            "A nested if",
            "No loop at all"
          ],
          "correct_index": 0,
          "explanation": "When you only know the stopping condition, not the count, a while loop is the right tool (indefinite iteration)."
        }
      ],
      "challenge_title": "Collatz Steps",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer n (n >= 1).\n# Repeat the Collatz rule until n becomes 1:\n#   if n is even -> n = n // 2\n#   if n is odd  -> n = 3*n + 1\n# Print the NUMBER OF STEPS taken to reach 1 (0 if n starts at 1).\n\nn = int(input())\nsteps = 0\n# TODO: use a while loop to count the steps\n\nprint(steps)\n",
      "challenge_solution_code": "n = int(input())\nsteps = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n = n // 2\n    else:\n        n = 3 * n + 1\n    steps = steps + 1\nprint(steps)\n",
      "challenge_test_cases": [
        {
          "input": "1\n",
          "expected_output": "0"
        },
        {
          "input": "6\n",
          "expected_output": "8"
        },
        {
          "input": "7\n",
          "expected_output": "16"
        }
      ]
    },
    {
      "id": "csp-aap2-l5",
      "project_id": "csp-aap2",
      "order": 5,
      "title": "For Loops and List Traversal",
      "concept": "Definite Iteration",
      "xp_reward": 10,
      "explanation": "When you *do* know how many times to repeat — once per item in a list, or a fixed number of times — a **for loop** is cleaner than a while loop. This is **definite iteration**: the count is known before the loop begins.\n\n## Looping a fixed number of times\n\n```python\nfor i in range(5):    # i takes 0, 1, 2, 3, 4\n    print(i)\n```\n\n`range(5)` produces the sequence 0,1,2,3,4 — five values, starting at 0. The loop variable `i` automatically becomes each value in turn. No manual update is needed, so for loops cannot accidentally run forever the way while loops can.\n\n## Traversing a list\n\nThe most important use of a for loop is the **list traversal** — visiting every element exactly once:\n\n```python\nscores = [88, 92, 75, 100]\ntotal = 0\nfor s in scores:        # s = each value in turn\n    total = total + s\nprint(total)            # 355\n```\n\nThe form `for s in scores` hands you each element directly. To accumulate a result, you keep a variable (here `total`) updated on every pass — this pattern is called an **accumulator**.\n\n## Counting with a condition\n\nTraversal plus a conditional lets you count matching elements:\n\n```python\nnums = [1, 2, 3, 4, 6]\nevens = 0\nfor v in nums:\n    if v % 2 == 0:      # is v even?\n        evens = evens + 1\nprint(evens)            # 3\n```\n\nThe operator `%` is the **modulo** (remainder); `v % 2 == 0` is True exactly when `v` is even.\n\n## When to use which loop\n\n- **for** — known count or \"do this for each element\": definite iteration.\n- **while** — \"repeat until a condition changes\": indefinite iteration.\n\nWhen you need positions instead of values, use `for i in range(len(nums))` and access `nums[i]`.\n\n## Why it matters\n\nNearly every list algorithm — summing, averaging, counting, finding a maximum, filtering — is a traversal. Pair a for loop with an accumulator or a counter, and you can process a data set of any length with a few clear lines.",
      "key_terms": [
        {
          "term": "For loop",
          "definition": "A loop that repeats once for each value in a sequence (such as range(n) or a list), used for definite iteration."
        },
        {
          "term": "List traversal",
          "definition": "Visiting every element of a list exactly once, typically with a for loop."
        },
        {
          "term": "Accumulator",
          "definition": "A variable updated on each pass of a loop to build up a running result, such as a sum or count."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What values does `range(4)` produce?",
          "options": [
            "0, 1, 2, 3",
            "1, 2, 3, 4",
            "0, 1, 2, 3, 4",
            "4"
          ],
          "correct_index": 0,
          "explanation": "range(n) yields 0 up to but not including n, so range(4) gives 0, 1, 2, 3."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which loop is best when you must do something once for every element of a list?",
          "options": [
            "A for loop traversing the list",
            "A while loop with no condition",
            "A nested conditional",
            "An infinite loop"
          ],
          "correct_index": 0,
          "explanation": "A for loop over the list (definite iteration) visits each element exactly once with no manual counter."
        },
        {
          "question": "What does `v % 2 == 0` test?",
          "options": [
            "Whether v is even",
            "Whether v is greater than 2",
            "Whether v equals 2",
            "Whether v is positive"
          ],
          "correct_index": 0,
          "explanation": "% is remainder; a remainder of 0 when divided by 2 means v is even."
        }
      ],
      "challenge_title": "Count the Evens",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: an integer n.\n# Line 2: n space-separated integers.\n# Print how many of them are EVEN.\n\nn = int(input())\nnums = list(map(int, input().split()))\ncount = 0\n# TODO: traverse nums and count the even values\n\nprint(count)\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ncount = 0\nfor v in nums:\n    if v % 2 == 0:\n        count = count + 1\nprint(count)\n",
      "challenge_test_cases": [
        {
          "input": "5\n1 2 3 4 6\n",
          "expected_output": "3"
        },
        {
          "input": "3\n1 3 5\n",
          "expected_output": "0"
        },
        {
          "input": "4\n2 4 6 8\n",
          "expected_output": "4"
        }
      ]
    },
    {
      "id": "csp-aap2-l6",
      "project_id": "csp-aap2",
      "order": 6,
      "title": "Linear Search",
      "concept": "Linear Search",
      "xp_reward": 10,
      "explanation": "Searching — finding whether and where a value lives in a list — is one of the most common tasks in computing. The simplest method is **linear search**: check each element in order until you find the target or run out of elements.\n\n## The algorithm\n\nLinear search is just a list traversal with a goal:\n\n```python\nnums = [4, 8, 15, 16, 23]\ntarget = 15\nfound_index = -1\nfor i in range(len(nums)):\n    if nums[i] == target:\n        found_index = i\n        break          # stop early -- no need to keep looking\nprint(found_index)     # 2\n```\n\nKey ideas:\n\n- Walk the list by **index** with `range(len(nums))` so you can report *where* the match is.\n- Use a sentinel like `-1` to mean \"not found yet.\"\n- When a match is found, record the index and `break` out of the loop — there is no reason to keep checking.\n- If the loop finishes without a match, the sentinel `-1` remains.\n\n## Works on any list\n\nThe great strength of linear search is that it makes **no assumptions** about the data. The list can be in any order, sorted or not, numbers or names. As long as you can compare elements for equality, linear search works.\n\n## Cost and efficiency\n\nHow much work is it? In the **worst case** — the target is last, or absent — linear search examines **all n elements**. We say it does work proportional to `n`; doubling the list roughly doubles the time. For a list of a million items, that is up to a million comparisons. On a short or unsorted list this is perfectly fine, but for large sorted data there is a far faster method, which you will meet in the next lesson.\n\n## Why it matters\n\nLinear search is the baseline every other search is measured against. It is simple, always correct, and works on unsorted data — the trade-off is speed. Understanding *why* it can be slow sets up the central idea of algorithmic efficiency: doing the same job with dramatically less work.",
      "key_terms": [
        {
          "term": "Linear search",
          "definition": "An algorithm that checks each element of a list in order until the target is found or the list ends."
        },
        {
          "term": "Sentinel value",
          "definition": "A special value such as -1 used to signal a condition like 'not found'."
        },
        {
          "term": "Worst case",
          "definition": "The input that makes an algorithm do the most work; for linear search, the target is absent or last, requiring all n checks."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In the worst case, how many elements does linear search examine in a list of n items?",
          "options": [
            "All n of them",
            "About log of n",
            "Exactly 1",
            "Half of them, always"
          ],
          "correct_index": 0,
          "explanation": "If the target is last or absent, linear search must check every one of the n elements."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is a key advantage of linear search over faster methods?",
          "options": [
            "It works on any list, sorted or not",
            "It is always the fastest",
            "It only works on sorted lists",
            "It never examines more than 2 elements"
          ],
          "correct_index": 0,
          "explanation": "Linear search makes no ordering assumptions, so it works on unsorted data where binary search cannot."
        },
        {
          "question": "Why does the example use `-1` as the initial value of `found_index`?",
          "options": [
            "As a sentinel meaning 'not found' if no match occurs",
            "Because lists start at index -1",
            "To make the loop run backwards",
            "Because -1 is the largest index"
          ],
          "correct_index": 0,
          "explanation": "Starting at -1 lets the code report 'not found' when the loop ends without a match."
        }
      ],
      "challenge_title": "Find the Index",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: integer n.\n# Line 2: n space-separated integers (the list).\n# Line 3: an integer target.\n# Print the index of the FIRST occurrence of target, or -1 if absent.\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# TODO: linear search; print the index or -1\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nidx = -1\nfor i in range(len(nums)):\n    if nums[i] == target:\n        idx = i\n        break\nprint(idx)\n",
      "challenge_test_cases": [
        {
          "input": "5\n4 8 15 16 23\n15\n",
          "expected_output": "2"
        },
        {
          "input": "3\n1 2 3\n9\n",
          "expected_output": "-1"
        },
        {
          "input": "4\n7 7 7 7\n7\n",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-aap2-l7",
      "project_id": "csp-aap2",
      "order": 7,
      "title": "Binary Search",
      "concept": "Binary Search",
      "xp_reward": 10,
      "explanation": "Linear search checks every element. But if a list is **already sorted**, you can do dramatically better with **binary search** — the algorithm you use instinctively when looking up a word in a dictionary: open to the middle, decide which half holds your word, and repeat.\n\n## The strategy: halve the search space\n\nBinary search keeps two pointers, `lo` and `hi`, marking the current search range. Each pass it looks at the **middle** element and discards half the remaining list:\n\n```python\nnums = [2, 5, 8, 12, 16, 23]   # MUST be sorted\ntarget = 16\nlo = 0\nhi = len(nums) - 1\nidx = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        idx = mid\n        break\n    elif nums[mid] < target:\n        lo = mid + 1     # target is in the right half\n    else:\n        hi = mid - 1     # target is in the left half\nprint(idx)               # 4\n```\n\nEach comparison has three outcomes:\n\n- **Equal** — found it; stop.\n- **Middle too small** — the target must be to the right, so move `lo` past `mid`.\n- **Middle too big** — the target must be to the left, so move `hi` before `mid`.\n\nWhen `lo` passes `hi`, the range is empty and the target is absent.\n\n## Why it is so fast\n\nEvery pass throws away **half** the remaining elements. A list of 1,000 items is cut to 500, 250, 125, ... reaching one element in only about 10 steps. In general binary search needs about **log base 2 of n** comparisons — for a million items, roughly 20 instead of a million. This is the difference between work proportional to `n` and work proportional to `log n`.\n\n## The one requirement\n\nBinary search only works on a **sorted** list. On unsorted data the \"which half\" decision is meaningless and the result is wrong. That is the trade-off: linear search is universal but slow; binary search is blazing fast but demands sorted input.\n\n## Why it matters\n\nBinary search is the classic illustration of algorithmic efficiency — same problem, exponentially less work, just by exploiting structure in the data. Recognizing when you can halve a search space is a core problem-solving skill in Big Idea 3.",
      "key_terms": [
        {
          "term": "Binary search",
          "definition": "A search algorithm for sorted lists that repeatedly checks the middle element and discards half the remaining range."
        },
        {
          "term": "Sorted list",
          "definition": "A list whose elements are in order; binary search requires this property to work correctly."
        },
        {
          "term": "Logarithmic time",
          "definition": "Work that grows like log n; binary search reaches its answer in about log base 2 of n comparisons."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What must be true about a list for binary search to work correctly?",
          "options": [
            "It must be sorted",
            "It must contain only even numbers",
            "It must have an odd length",
            "It must be unsorted"
          ],
          "correct_index": 0,
          "explanation": "Binary search relies on order to decide which half to discard; on an unsorted list it gives wrong answers."
        }
      ],
      "quiz_questions": [
        {
          "question": "Roughly how many comparisons does binary search need for a sorted list of about 1,000 items?",
          "options": [
            "About 10",
            "About 1,000",
            "About 500",
            "Exactly 1"
          ],
          "correct_index": 0,
          "explanation": "Each step halves the range: 1000 -> 500 -> 250 ... -> 1 takes about log2(1000) ~ 10 steps."
        },
        {
          "question": "After comparing the middle element and finding it is SMALLER than the target, what does binary search do?",
          "options": [
            "Search the right half by moving lo past mid",
            "Search the left half by moving hi before mid",
            "Stop and report not found",
            "Start over from index 0"
          ],
          "correct_index": 0,
          "explanation": "If the middle is too small, the target must be among the larger elements to the right, so lo = mid + 1."
        }
      ],
      "challenge_title": "Binary Search Index",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: integer n.\n# Line 2: n space-separated integers in INCREASING (sorted) order.\n# Line 3: an integer target.\n# Use BINARY SEARCH to print the index of target, or -1 if absent.\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# TODO: implement binary search with lo and hi pointers\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nlo = 0\nhi = len(nums) - 1\nidx = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        idx = mid\n        break\n    elif nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nprint(idx)\n",
      "challenge_test_cases": [
        {
          "input": "6\n2 5 8 12 16 23\n16\n",
          "expected_output": "4"
        },
        {
          "input": "5\n1 3 5 7 9\n4\n",
          "expected_output": "-1"
        },
        {
          "input": "1\n10\n10\n",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-aap2-l8",
      "project_id": "csp-aap2",
      "order": 8,
      "title": "Simulation, Efficiency, and the Limits of Computing",
      "concept": "Simulation and Undecidability",
      "xp_reward": 10,
      "explanation": "You now have the full toolkit — Booleans, conditionals, loops, traversals, and search. This lesson combines them into **simulation** and steps back to ask two big questions of Big Idea 3: how *fast* can a problem be solved, and are there problems no program can solve at all?\n\n## Simulation: modeling a process step by step\n\nA **simulation** uses a program to imitate a real or hypothetical process, advancing it one step at a time inside a loop. Consider a walker on a number line who takes a series of steps left (`L`) or right (`R`):\n\n```python\nsteps = input().split()   # e.g. [\"R\", \"R\", \"L\"]\npos = 0\nfor s in steps:\n    if s == \"L\":\n        pos = pos - 1\n    else:\n        pos = pos + 1\nprint(pos)                # final position\n```\n\nEach loop pass updates the **state** (`pos`) according to a rule. Real simulations model weather, traffic, populations, or games this way — track the state, apply the rules, repeat. When real processes are random, simulations use randomness; here we keep it deterministic so the result is exact.\n\n## Efficiency: not all algorithms are equal\n\nThe search lessons showed two algorithms for one job with wildly different costs — linear search does work proportional to `n`, binary search proportional to `log n`. **Efficiency** measures how an algorithm's work grows as the input grows. Some problems have fast solutions; others (like trying every possible combination) blow up so quickly they are called **intractable** — solvable in principle but not in any practical amount of time for large inputs.\n\n## Undecidability: some problems have no algorithm\n\nFinally, a few problems cannot be solved by *any* program, no matter how clever or fast. The famous example is the **Halting Problem**: there is no general algorithm that can decide, for every possible program and input, whether that program will eventually stop or loop forever. Such problems are called **undecidable**. They mark a hard boundary on what computing can ever do.\n\n## Why it matters\n\n- **Simulation** turns loops and conditionals into a tool for modeling the world.\n- **Efficiency** explains why algorithm choice can mean seconds versus centuries.\n- **Undecidability** reminds us that computing, for all its power, has real limits.\n\nTogether these ideas close out Big Idea 3: you can not only write algorithms, but reason about how good — and how possible — they are.",
      "key_terms": [
        {
          "term": "Simulation",
          "definition": "A program that models a process by tracking its state and applying rules step by step inside a loop."
        },
        {
          "term": "Efficiency",
          "definition": "A measure of how an algorithm's required work grows as its input size grows."
        },
        {
          "term": "Undecidable problem",
          "definition": "A problem, such as the Halting Problem, for which no algorithm can produce a correct answer for every possible input."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the Halting Problem an example of?",
          "options": [
            "An undecidable problem with no general algorithm",
            "A problem binary search solves quickly",
            "A simulation of a random walk",
            "An efficient sorting method"
          ],
          "correct_index": 0,
          "explanation": "The Halting Problem is undecidable: no single algorithm can decide for every program and input whether it halts."
        }
      ],
      "quiz_questions": [
        {
          "question": "In the random-walk simulation, what does the variable `pos` represent?",
          "options": [
            "The current state of the process being modeled",
            "The number of steps remaining",
            "A sentinel for 'not found'",
            "The length of the input list"
          ],
          "correct_index": 0,
          "explanation": "pos holds the walker's current position, the state that the loop updates each step."
        },
        {
          "question": "Why does choosing an efficient algorithm matter for large inputs?",
          "options": [
            "Work that grows like n or worse can become impractical, while log n stays fast",
            "Efficient algorithms always give different answers",
            "Inputs are never large in practice",
            "Efficiency only affects how the code looks"
          ],
          "correct_index": 0,
          "explanation": "As input grows, a slow algorithm's work can explode, so efficiency determines whether a task finishes in time."
        }
      ],
      "challenge_title": "Random Walk Final Position",
      "challenge_language": "python",
      "challenge_starter_code": "# One line contains space-separated steps, each either L or R.\n# Start at position 0. L moves -1, R moves +1.\n# Simulate all the steps and print the final position.\n\nsteps = input().split()\npos = 0\n# TODO: simulate the walk, updating pos for each step\n\nprint(pos)\n",
      "challenge_solution_code": "steps = input().split()\npos = 0\nfor s in steps:\n    if s == \"L\":\n        pos = pos - 1\n    else:\n        pos = pos + 1\nprint(pos)\n",
      "challenge_test_cases": [
        {
          "input": "R R R\n",
          "expected_output": "3"
        },
        {
          "input": "L L R\n",
          "expected_output": "-1"
        },
        {
          "input": "L R L R\n",
          "expected_output": "0"
        }
      ]
    }
  ]
}
