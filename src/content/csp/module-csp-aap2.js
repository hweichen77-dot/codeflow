// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-aap2",
    "title": "Algorithms, Iteration & Simulation",
    "description": "Big Idea 3 (part II): building algorithms with conditionals, loops, list traversals, linear and binary search, and using simulations to model real-world situations.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 104,
    "track": "apcsp",
    "unit": "Big Idea 3 — Algorithms & Programming II",
    "tags": [
      "conditionals",
      "iteration",
      "linear/binary search"
    ]
  },
  "lessons": [
    {
      "id": "csp-aap2-l1",
      "project_id": "csp-aap2",
      "order": 1,
      "title": "Conditionals & Selection",
      "explanation": "## Making Decisions in Code\n\nAn **algorithm** is a finite, step-by-step set of instructions that solves a problem. Most useful algorithms must *choose* between different actions depending on the data. That choice-making is called **selection**, and in Python it is expressed with **conditional statements**.\n\n## if / elif / else\n\nA conditional runs a block of code only when a **Boolean expression** (something that evaluates to `True` or `False`) is satisfied.\n\n```python\nscore = 72\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"Below C\")\n```\n\nKey rules of the **control flow**:\n\n- Python checks branches **top to bottom** and runs the **first** branch whose condition is `True`.\n- Once a branch runs, the rest are **skipped** entirely.\n- `else` is optional and runs only when every condition above it was `False`.\n- Order matters: if you put `score >= 70` before `score >= 90`, a 95 would wrongly match the first branch.\n\n## Comparison and Logical Operators\n\nConditions are built from comparisons (`==`, `!=`, `<`, `<=`, `>`, `>=`) and **logical operators** that combine Boolean values:\n\n- `and` — `True` only when **both** sides are `True`\n- `or` — `True` when **at least one** side is `True`\n- `not` — flips a Boolean\n\n```python\nage = 16\nhas_permit = True\nif age >= 15 and has_permit:\n    print(\"May drive with supervision\")\n```\n\n## Why Selection Matters on the Exam\n\nThe AP CSP exam frequently asks you to trace which branch executes, or to spot a logic error caused by **branch ordering** or a wrong comparison operator. Practice reading conditionals carefully:\n\n- A common bug is using `=` (assignment) where `==` (comparison) is meant.\n- Another is overlapping ranges where an earlier branch \"steals\" values from a later one.\n\nSelection turns a fixed list of instructions into an algorithm that adapts to its **input**, which is the foundation for everything that follows in this module.",
      "key_terms": [
        {
          "term": "Conditional statement",
          "definition": "A construct (if/elif/else) that runs a block of code only when a Boolean condition is True, enabling selection."
        },
        {
          "term": "Boolean expression",
          "definition": "An expression that evaluates to either True or False, used to decide which branch of a conditional runs."
        },
        {
          "term": "Control flow",
          "definition": "The order in which statements execute; conditionals change this order by choosing among alternative branches."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Given x = 5, what does this print?\nif x > 10:\n    print(\"big\")\nelif x > 3:\n    print(\"mid\")\nelse:\n    print(\"small\")",
          "options": [
            "big",
            "mid",
            "small",
            "Nothing"
          ],
          "correct_index": 1,
          "explanation": "x > 10 is False, so the first branch is skipped. x > 3 is True, so 'mid' prints and the else is skipped."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why does branch order matter in an if/elif/else chain?",
          "options": [
            "Python runs every branch whose condition is True",
            "Python runs only the first branch whose condition is True, so an earlier broad condition can hide a later one",
            "Python runs branches in random order",
            "Branch order never affects output"
          ],
          "correct_index": 1,
          "explanation": "Only the first True branch executes; the rest are skipped. A broad earlier condition can capture values meant for a later branch."
        },
        {
          "question": "Which expression is True only when BOTH conditions hold?",
          "options": [
            "a or b",
            "a and b",
            "not a",
            "a != b"
          ],
          "correct_index": 1,
          "explanation": "The logical operator 'and' returns True only when both operands are True; 'or' needs just one."
        }
      ],
      "challenge_title": "Temperature Classifier",
      "challenge_language": "python",
      "challenge_starter_code": "n = int(input())\ntemps = list(map(int, input().split()))\nhot = 0\ncold = 0\n# TODO: count temps >= 80 as hot and temps < 50 as cold\nprint(hot, cold)\n",
      "challenge_solution_code": "n = int(input())\ntemps = list(map(int, input().split()))\nhot = 0\ncold = 0\nfor t in temps:\n    if t >= 80:\n        hot += 1\n    elif t < 50:\n        cold += 1\nprint(hot, cold)\n",
      "challenge_test_cases": [
        {
          "input": "5\n85 49 80 50 30",
          "expected_output": "2 2"
        },
        {
          "input": "3\n50 60 79",
          "expected_output": "0 0"
        },
        {
          "input": "4\n90 91 92 93",
          "expected_output": "4 0"
        }
      ]
    },
    {
      "id": "csp-aap2-l2",
      "project_id": "csp-aap2",
      "order": 2,
      "title": "Iteration & List Traversal",
      "explanation": "## Repeating Work with Loops\n\n**Iteration** is the repeated execution of a block of instructions. Instead of copying the same line many times, a loop runs it once for each item or until a condition changes. This is how algorithms scale to lists of any size.\n\n## for Loops and Traversal\n\nA **traversal** visits every element of a collection exactly once. The cleanest way to traverse a list in Python is a `for` loop:\n\n```python\nnums = [3, 1, 4, 1, 5]\ntotal = 0\nfor x in nums:      # x takes each value in turn\n    total += x\nprint(total)        # 14\n```\n\nThis pattern, building up a result while visiting each element, is called **accumulation**. Common accumulators:\n\n- a running **sum** or **count**\n- a running **maximum** or **minimum**\n- building a new list\n\n```python\nmx = nums[0]\nfor x in nums:\n    if x > mx:\n        mx = x\nprint(mx)           # 5\n```\n\n## while Loops\n\nA `while` loop repeats as long as a condition stays `True`:\n\n```python\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1      # update is essential\n```\n\nIf the loop variable is never updated toward making the condition `False`, you get an **infinite loop**. Always make sure each pass moves you closer to the stopping condition.\n\n## Choosing for vs while\n\n- Use **for** when you know the items or the number of repetitions in advance (traversing a list).\n- Use **while** when you repeat until some condition occurs and you do not know the count ahead of time.\n\n## On the Exam\n\nThe AP CSP exam loves loop-tracing questions: count how many times a loop body runs, or what an accumulator holds afterward. A subtle point is **off-by-one** behavior, for example `while count < 3` runs for count 0, 1, 2 (three times). Initialize the maximum to the first element (not 0) so negative data is handled correctly. Iteration plus accumulation is the workhorse pattern behind almost every algorithm you will write.",
      "key_terms": [
        {
          "term": "Iteration",
          "definition": "The repeated execution of a block of code using a loop, once per item or until a condition changes."
        },
        {
          "term": "Traversal",
          "definition": "Visiting every element of a collection such as a list exactly once, typically with a for loop."
        },
        {
          "term": "Accumulator",
          "definition": "A variable updated on each loop pass to build a running result like a sum, count, max, or min."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many times does the body run?\ncount = 0\nwhile count < 4:\n    count += 1",
          "options": [
            "3",
            "4",
            "5",
            "Infinite"
          ],
          "correct_index": 1,
          "explanation": "count takes values 0, 1, 2, 3 entering the loop (each < 4) and runs the body four times; at count == 4 the condition is False."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the safest initial value for a running maximum over a list that may contain negatives?",
          "options": [
            "0",
            "The first element of the list",
            "A very large number",
            "An empty string"
          ],
          "correct_index": 1,
          "explanation": "Starting at 0 fails when all values are negative. Initializing to the first element guarantees a valid comparison baseline."
        },
        {
          "question": "When is a while loop preferable to a for loop?",
          "options": [
            "When you already know exactly how many items to visit",
            "When you must repeat until a condition occurs and the count is unknown in advance",
            "While loops are always faster",
            "When traversing a fixed list element by element"
          ],
          "correct_index": 1,
          "explanation": "for loops fit known counts/traversals; while loops fit repetition that continues until a condition becomes False."
        }
      ],
      "challenge_title": "Sum and Maximum",
      "challenge_language": "python",
      "challenge_starter_code": "n = int(input())\nnums = list(map(int, input().split()))\ntotal = 0\nmx = nums[0]\n# TODO: traverse nums to compute total and mx\nprint(total, mx)\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ntotal = 0\nmx = nums[0]\nfor x in nums:\n    total += x\n    if x > mx:\n        mx = x\nprint(total, mx)\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 1 4 1 5",
          "expected_output": "14 5"
        },
        {
          "input": "1\n7",
          "expected_output": "7 7"
        },
        {
          "input": "4\n-2 -5 -1 -9",
          "expected_output": "-17 -1"
        }
      ]
    },
    {
      "id": "csp-aap2-l3",
      "project_id": "csp-aap2",
      "order": 3,
      "title": "Searching & Simulation",
      "explanation": "## Finding Things: Linear vs Binary Search\n\nSearching answers \"is a value present, and where?\" The two algorithms the AP CSP exam expects you to know are **linear search** and **binary search**.\n\n### Linear Search\n\n**Linear search** checks each element one by one until it finds the target or runs out of data. It works on *any* list, sorted or not.\n\n```python\ndef linear_search(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n```\n\nIn the worst case it inspects every element, so for a list of size n it does up to n comparisons.\n\n### Binary Search\n\n**Binary search** is far faster but requires a **sorted** list. It repeatedly checks the middle element and discards half the remaining range:\n\n```python\ndef binary_search(items, target):\n    lo, hi = 0, len(items) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            lo = mid + 1   # target is in the right half\n        else:\n            hi = mid - 1   # target is in the left half\n    return -1\n```\n\nBecause it halves the search space each step, it needs only about **log2(n)** comparisons. For 1,000,000 items that is roughly 20 comparisons instead of a million. This difference in how runtime grows with input size is the heart of **algorithmic efficiency**.\n\n## Simulation\n\nA **simulation** is a program that models a real-world or random process to study its behavior, often using `random`. Simulations let us experiment cheaply when real trials would be slow, costly, or risky (dice games, traffic, disease spread).\n\n```python\nimport random\nheads = 0\nfor _ in range(1000):\n    if random.random() < 0.5:\n        heads += 1\nprint(heads)   # near 500\n```\n\nSimulations are **abstractions**: they leave out details to focus on the essentials, and running many **trials** reveals patterns. Searching and simulation together show two core ideas of Big Idea 3, choosing an efficient algorithm and modeling a process to predict outcomes.",
      "key_terms": [
        {
          "term": "Linear search",
          "definition": "An algorithm that checks list elements one by one until the target is found or the list ends; works on unsorted data."
        },
        {
          "term": "Binary search",
          "definition": "An algorithm that finds a target in a sorted list by repeatedly halving the search range, using about log2(n) comparisons."
        },
        {
          "term": "Simulation",
          "definition": "A program that models a real or random process, often over many trials, to study or predict its behavior."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What must be true of a list before binary search can be used correctly?",
          "options": [
            "It must contain only positive numbers",
            "It must be sorted",
            "It must have an even length",
            "It must contain no duplicates"
          ],
          "correct_index": 1,
          "explanation": "Binary search relies on order to decide which half to discard, so the list must be sorted; linear search has no such requirement."
        }
      ],
      "quiz_questions": [
        {
          "question": "Roughly how many comparisons does binary search need in the worst case for a sorted list of 1,000,000 items?",
          "options": [
            "About 1,000,000",
            "About 1,000",
            "About 20",
            "Exactly 2"
          ],
          "correct_index": 2,
          "explanation": "Binary search halves the range each step, needing about log2(1,000,000) which is roughly 20 comparisons."
        },
        {
          "question": "Why are simulations useful?",
          "options": [
            "They always give the exact theoretical answer in one run",
            "They model processes that may be costly, slow, or risky to test in reality, and patterns emerge over many trials",
            "They remove the need for any randomness",
            "They only work for sorted data"
          ],
          "correct_index": 1,
          "explanation": "Simulations are abstractions that let us model real or random processes cheaply; running many trials reveals likely outcomes."
        }
      ],
      "challenge_title": "Binary Search Index",
      "challenge_language": "python",
      "challenge_starter_code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nresult = -1\n# TODO: binary search nums for target; set result to its index or keep -1\nprint(result)\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nlo = 0\nhi = n - 1\nresult = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        result = mid\n        break\n    elif nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nprint(result)\n",
      "challenge_test_cases": [
        {
          "input": "6\n1 3 5 7 9 11\n7",
          "expected_output": "3"
        },
        {
          "input": "5\n2 4 6 8 10\n5",
          "expected_output": "-1"
        },
        {
          "input": "1\n42\n42",
          "expected_output": "0"
        }
      ]
    }
  ]
}
