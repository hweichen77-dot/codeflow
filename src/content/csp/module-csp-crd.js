export default {
  "project": {
    "id": "csp-crd",
    "title": "Creative Development",
    "description": "Explores how programs are designed, developed, and refined through collaboration, planning, prototyping, testing, documentation, and systematic error correction.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 101,
    "track": "apcsp",
    "unit": "Big Idea 1 — Creative Development",
    "tags": [
      "collaboration",
      "program design",
      "errors"
    ]
  },
  "lessons": [
    {
      "id": "csp-crd-l1",
      "project_id": "csp-crd",
      "order": 1,
      "title": "Collaboration in Software Teams",
      "explanation": "## Why Collaboration Matters\n\nComputing innovations are rarely built alone. **Collaboration** is the practice of multiple people working together toward a shared goal, and it is a core skill in the AP CSP Creative Development big idea. Diverse teams produce better software because different backgrounds surface different ideas, edge cases, and user needs.\n\nEffective collaboration relies on a few key behaviors:\n\n- **Communication**: sharing ideas clearly and listening actively.\n- **Consensus building**: agreeing on decisions instead of one person dictating.\n- **Conflict resolution**: handling disagreement constructively.\n- **Constructive feedback**: critiquing the work, not the person.\n\n## Pair Programming\n\nA widely used model is **pair programming**, where two developers share one workstation. One acts as the *driver* (typing code) and the other as the *navigator* (reviewing and thinking ahead). They swap roles regularly so both understand the whole program.\n\n## Dividing Work With Contracts\n\nWhen a team splits work, members must agree on an **interface contract**: what data is passed in and what comes out. If everyone agrees on the input format and the expected output *first*, people can build their parts in parallel without conflicts.\n\nConsider a simple shared tool that totals each teammate's contribution count:\n\n```python\nparts = input().split()\ntotal = 0\nfor p in parts:\n    total += int(p)\nprint(total)\n```\n\nBecause the input is agreed to be space-separated integers and the output is their sum, one teammate can write the input reader while another writes the totaling logic.\n\n## Diversity Improves Quality\n\nDifferent perspectives catch problems a single developer might miss. A teammate who thinks about accessibility, another who thinks about edge cases, and another who knows the users all combine to make the result stronger.\n\nKey takeaways:\n\n- Collaboration improves quality through diverse perspectives.\n- Pair programming shares knowledge and reduces bugs.\n- Agreeing on input/output contracts lets teams divide work cleanly.",
      "key_terms": [
        {
          "term": "Collaboration",
          "definition": "Multiple people working together toward a shared goal, improving software through diverse perspectives and shared responsibility."
        },
        {
          "term": "Pair programming",
          "definition": "A technique where two developers share one workstation, alternating between driver (typing) and navigator (reviewing) roles."
        },
        {
          "term": "Interface contract",
          "definition": "An agreement about what input a piece of code receives and what output it produces, letting teammates work in parallel."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In pair programming, what does the navigator primarily do?",
          "options": [
            "Types all of the code",
            "Reviews the code and thinks ahead while the driver types",
            "Manages the project budget",
            "Writes only the final report"
          ],
          "correct_index": 1,
          "explanation": "The navigator reviews the driver's code and plans ahead; roles are swapped regularly so both learn the whole program."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why do diverse collaborative teams tend to produce better software?",
          "options": [
            "They write code faster than individuals",
            "Different perspectives surface more ideas, edge cases, and user needs",
            "They never disagree",
            "They skip the design phase"
          ],
          "correct_index": 1,
          "explanation": "Diversity brings varied viewpoints that catch more edge cases and better address real user needs."
        },
        {
          "question": "What lets teammates divide work and build parts in parallel without conflicts?",
          "options": [
            "Working in total silence",
            "Agreeing on an input/output contract first",
            "Letting one person make every decision",
            "Avoiding all testing"
          ],
          "correct_index": 1,
          "explanation": "A shared interface contract defines what data flows in and out, so members can build pieces independently."
        }
      ],
      "challenge_title": "Team Contribution Total",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers (each teammate's count).\n# Print the team total.\nline = input()\n# TODO: split, convert to ints, sum, and print the total\n",
      "challenge_solution_code": "line = input()\nparts = line.split()\ntotal = 0\nfor p in parts:\n    total += int(p)\nprint(total)\n",
      "challenge_test_cases": [
        {
          "input": "3 5 2",
          "expected_output": "10"
        },
        {
          "input": "10 20 30 40",
          "expected_output": "100"
        },
        {
          "input": "7",
          "expected_output": "7"
        }
      ]
    },
    {
      "id": "csp-crd-l2",
      "project_id": "csp-crd",
      "order": 2,
      "title": "Investigating and Designing a Program",
      "explanation": "## Understanding the Problem First\n\nGood software starts long before any code is written. The first phase of development is **investigating**: studying the problem, talking to the people who will use the program, and identifying constraints. Skipping investigation often produces a program that works but solves the *wrong* problem.\n\nDuring investigation, a team gathers **requirements** — clear statements of what the finished program must do. A requirement is testable, like \"the program must output the total of all entered numbers.\"\n\n## Program Design\n\n**Program design** is the planning that turns requirements into a structure. Designers decide:\n\n- what **inputs** the program accepts,\n- what **outputs** it produces,\n- and the steps that connect them.\n\nA helpful design tool is to describe the steps in plain language before coding. For example: *read a line, split it into words, convert each to a number, keep the largest, then print it.* Writing this plan first prevents confusion later.\n\n## From Design to Code\n\nOnce the design is clear, translating it to Python is direct. Here a design that finds the largest contribution becomes code:\n\n```python\n# Design: read numbers, track the maximum, print it\nparts = input().split()\nlargest = int(parts[0])\nfor p in parts[1:]:\n    value = int(p)\n    if value > largest:\n        largest = value\nprint(largest)\n```\n\nNotice the comment records the *design intent*, while the code carries it out.\n\n## Considering Users\n\nDesign always keeps **users** in mind. What input is realistic? What output do users actually need? Designing for users — not just for the programmer — is a hallmark of strong creative development.\n\nKey takeaways:\n\n- Investigate before designing; design before coding.\n- Requirements are clear, testable statements of what the program must do.\n- A plain-language plan makes the code easier to write correctly.\n- Always design with real users in mind.",
      "key_terms": [
        {
          "term": "Investigating",
          "definition": "The first development phase: studying the problem, talking to users, and identifying constraints before designing."
        },
        {
          "term": "Requirement",
          "definition": "A clear, testable statement of something the finished program must do."
        },
        {
          "term": "Program design",
          "definition": "Planning that turns requirements into a structure of inputs, outputs, and the steps connecting them."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the main risk of skipping the investigation phase?",
          "options": [
            "The code will not compile",
            "You may build a program that solves the wrong problem",
            "Variables will be named poorly",
            "The program will run too fast"
          ],
          "correct_index": 1,
          "explanation": "Without investigation you may misunderstand the need and build something that works but does not solve the real problem."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is a good characteristic of a requirement?",
          "options": [
            "It is vague so it can change",
            "It is clear and testable",
            "It is written only after coding",
            "It describes the programmer's mood"
          ],
          "correct_index": 1,
          "explanation": "Requirements should be clear and testable so the team can check whether the finished program satisfies them."
        },
        {
          "question": "In program design, what should be decided?",
          "options": [
            "The inputs, outputs, and steps connecting them",
            "Only the variable names",
            "The release date",
            "The color of the editor theme"
          ],
          "correct_index": 0,
          "explanation": "Design defines what the program takes in, what it produces, and the steps in between."
        }
      ],
      "challenge_title": "Largest Contribution",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers.\n# Print the largest value.\nparts = input().split()\n# TODO: find and print the maximum integer\n",
      "challenge_solution_code": "parts = input().split()\nlargest = int(parts[0])\nfor p in parts[1:]:\n    value = int(p)\n    if value > largest:\n        largest = value\nprint(largest)\n",
      "challenge_test_cases": [
        {
          "input": "3 5 2",
          "expected_output": "5"
        },
        {
          "input": "40 10 30 20",
          "expected_output": "40"
        },
        {
          "input": "7",
          "expected_output": "7"
        }
      ]
    },
    {
      "id": "csp-crd-l3",
      "project_id": "csp-crd",
      "order": 3,
      "title": "The Iterative Development Process",
      "explanation": "## A Process, Not a Straight Line\n\nThe **development process** is the set of steps used to create a program. AP CSP describes four phases that are repeated, not done once:\n\n- **Investigating**: understand the problem and the users.\n- **Designing**: plan the structure, inputs, and outputs.\n- **Prototyping**: build a working but incomplete version.\n- **Testing**: check whether it meets the requirements.\n\nBecause software is hard to get right the first time, the process is **iterative** and **incremental**. *Iterative* means you cycle through the phases repeatedly. *Incremental* means you add a little functionality at a time, checking as you go.\n\n## Building Up One Step at a Time\n\nImagine a tool that should sum only the *even* numbers in a list. Rather than writing everything at once, you build it incrementally. A first increment might just read and echo the numbers; a second adds the even check; a third adds the sum.\n\nHere is a later increment that keeps even values and totals them:\n\n```python\nparts = input().split()\ntotal = 0\nfor p in parts:\n    value = int(p)\n    if value % 2 == 0:\n        total += value\nprint(total)\n```\n\nEach increment is checked before the next is added, so a mistake is caught while the change is still small.\n\n## Feedback Loops\n\nAfter each increment you gather feedback — from tests, teammates, or users — and feed it back into the next cycle. This **feedback loop** is what makes development iterative rather than a single straight line.\n\nKey takeaways:\n\n- The four phases are investigate, design, prototype, test.\n- Development is iterative (repeat) and incremental (small steps).\n- Each small change is checked before the next is added.\n- Feedback from each cycle guides the next.",
      "key_terms": [
        {
          "term": "Development process",
          "definition": "The repeated set of phases — investigate, design, prototype, test — used to create and refine a program."
        },
        {
          "term": "Iterative development",
          "definition": "Cycling through the development phases repeatedly to refine a program rather than completing it in one pass."
        },
        {
          "term": "Incremental development",
          "definition": "Adding functionality a little at a time, checking each small piece before moving on."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does it mean that development is 'incremental'?",
          "options": [
            "The whole program is written at once",
            "Functionality is added a little at a time, checking along the way",
            "Documentation is written only at the end",
            "Each developer works in isolation"
          ],
          "correct_index": 1,
          "explanation": "Incremental development adds small pieces step by step, checking each before continuing."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which list names the four AP CSP development phases?",
          "options": [
            "Compile, link, run, ship",
            "Investigate, design, prototype, test",
            "Plan, sell, market, support",
            "Read, write, delete, save"
          ],
          "correct_index": 1,
          "explanation": "The four phases are investigating, designing, prototyping, and testing, repeated iteratively."
        },
        {
          "question": "Why build a program incrementally instead of all at once?",
          "options": [
            "It uses less memory",
            "Mistakes are caught while each change is still small",
            "It avoids the need for design",
            "It removes the need for users"
          ],
          "correct_index": 1,
          "explanation": "Small increments are checked individually, so errors surface early when they are easy to fix."
        }
      ],
      "challenge_title": "Sum of Even Numbers",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers.\n# Print the sum of only the even numbers.\nparts = input().split()\n# TODO: add up values that are even and print the total\n",
      "challenge_solution_code": "parts = input().split()\ntotal = 0\nfor p in parts:\n    value = int(p)\n    if value % 2 == 0:\n        total += value\nprint(total)\n",
      "challenge_test_cases": [
        {
          "input": "1 2 3 4 5 6",
          "expected_output": "12"
        },
        {
          "input": "7 9 11",
          "expected_output": "0"
        },
        {
          "input": "10 20 30",
          "expected_output": "60"
        }
      ]
    },
    {
      "id": "csp-crd-l4",
      "project_id": "csp-crd",
      "order": 4,
      "title": "Prototyping to Test Ideas",
      "explanation": "## What a Prototype Is\n\nA **prototype** is an early, partial version of a program built to test ideas quickly. It does not need every feature — it needs *just enough* to get useful feedback. Building a prototype early reduces **risk**, because problems surface sooner, when they are cheaper to fix.\n\nProfessional teams often build a **minimum viable product (MVP)**: the smallest version that still does something useful and can be shown to users.\n\n## A Prototype Has Limits\n\nA prototype intentionally leaves things out. It might handle only the common case, skip fancy formatting, or assume valid input. That is fine — the goal is *learning*, not perfection. Knowing what a prototype does **not** do is part of using it well.\n\nSuppose the final goal is a price calculator with discounts, tax, and currency formatting. A first prototype might apply just a flat 10% discount:\n\n```python\nprice = int(input())\ndiscounted = price - price // 10   # prototype: flat 10% off\nprint(discounted)\n```\n\nThis prototype lets the team show users the discount idea before investing in tax and formatting.\n\n## From Prototype to Product\n\nFeedback on the prototype drives the next iteration. Maybe users want a different discount, or maybe the idea fails entirely — better to learn that from a cheap prototype than a finished product. Successful prototypes grow, increment by increment, into the full program.\n\nKey takeaways:\n\n- A prototype is an early, partial version used to gather feedback.\n- Prototypes reduce risk by exposing problems early and cheaply.\n- An MVP is the smallest useful version you can show to users.\n- Feedback on a prototype guides the next iteration.",
      "key_terms": [
        {
          "term": "Prototype",
          "definition": "An early, partial version of a program built to test ideas and gather feedback before full implementation."
        },
        {
          "term": "Minimum viable product",
          "definition": "The smallest version of a program that still does something useful and can be shown to users for feedback."
        },
        {
          "term": "Risk reduction",
          "definition": "Exposing problems early with cheap prototypes so they can be fixed before much effort is invested."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why build a prototype before the full program?",
          "options": [
            "To ship the final product faster without testing",
            "To expose problems early and gather feedback cheaply",
            "To avoid writing any code",
            "To make the program run faster"
          ],
          "correct_index": 1,
          "explanation": "Prototypes surface problems and gather feedback early, when changes are inexpensive."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which best describes a prototype?",
          "options": [
            "A polished final product ready for release",
            "An early, partial version to test ideas and get feedback",
            "A document listing every requirement",
            "A backup copy of the source code"
          ],
          "correct_index": 1,
          "explanation": "A prototype is an early, incomplete version used to gather feedback before building the full program."
        },
        {
          "question": "What is a minimum viable product (MVP)?",
          "options": [
            "The largest possible version with all features",
            "The smallest useful version you can show to users",
            "A version with no functionality at all",
            "The final release candidate"
          ],
          "correct_index": 1,
          "explanation": "An MVP is the smallest version that still does something useful and can collect real feedback."
        }
      ],
      "challenge_title": "Discount Prototype",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer price.\n# Apply a flat 10% discount using integer (floor) math: price - price // 10.\n# Print the discounted price.\nprice = int(input())\n# TODO: compute and print the discounted price\n",
      "challenge_solution_code": "price = int(input())\ndiscounted = price - price // 10\nprint(discounted)\n",
      "challenge_test_cases": [
        {
          "input": "100",
          "expected_output": "90"
        },
        {
          "input": "55",
          "expected_output": "50"
        },
        {
          "input": "9",
          "expected_output": "9"
        }
      ]
    },
    {
      "id": "csp-crd-l5",
      "project_id": "csp-crd",
      "order": 5,
      "title": "Testing for Correctness",
      "explanation": "## What Testing Means\n\n**Testing** compares a program's **actual output** to its **expected output**. When they match, the test passes; when they differ, the test fails and points to a problem. Testing is how a team gains confidence that a program meets its requirements.\n\n## Choosing Good Test Cases\n\nOne test is never enough. Good testers cover several kinds of input:\n\n- **Typical cases**: ordinary, expected values.\n- **Boundary cases**: the smallest or largest allowed value, or the edge of a range.\n- **Empty or unusual cases**: no input, zero, or surprising values.\n\nChoosing inputs whose correct answer you already know lets you check the program objectively.\n\n## A Testable Program\n\nSuppose a requirement says: *given a number, print PASS if it is at least 60, otherwise FAIL.* The boundary value 60 is the most important test, because off-by-one logic errors often hide there.\n\n```python\nscore = int(input())\nif score >= 60:\n    print(\"PASS\")\nelse:\n    print(\"FAIL\")\n```\n\nGood test cases would include `60` (boundary), `100` (typical pass), and `0` (typical fail). Testing exactly at the boundary catches whether `>=` should have been `>`.\n\n## Testing Drives Iteration\n\nWhen a test fails, the team returns to an earlier phase, makes a change, and tests again. This loop continues until all tests pass. Testing is therefore not a final step but a constant companion to development.\n\nKey takeaways:\n\n- Testing compares actual output to expected output.\n- Cover typical, boundary, and unusual cases.\n- Boundary values catch common off-by-one logic errors.\n- Failed tests feed the iterative development loop.",
      "key_terms": [
        {
          "term": "Testing",
          "definition": "Comparing a program's actual output to its expected output to check whether it meets requirements."
        },
        {
          "term": "Boundary case",
          "definition": "A test at the edge of allowed values, where off-by-one logic errors commonly hide."
        },
        {
          "term": "Test case",
          "definition": "A specific input paired with the known correct output, used to check program behavior."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why is the boundary value (like 60 in a 'pass at 60+' rule) an important test?",
          "options": [
            "It is the easiest number to type",
            "Off-by-one logic errors often hide exactly at the boundary",
            "Boundary values never cause bugs",
            "It makes the program run faster"
          ],
          "correct_index": 1,
          "explanation": "Errors confusing >= with > show up precisely at the boundary, so testing there catches them."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does testing fundamentally compare?",
          "options": [
            "Code length to comment length",
            "Actual output to expected output",
            "Run time to compile time",
            "One programmer to another"
          ],
          "correct_index": 1,
          "explanation": "A test checks whether the program's actual output matches the expected output for a given input."
        },
        {
          "question": "Which set of inputs gives the best test coverage?",
          "options": [
            "Only one typical value",
            "Typical, boundary, and unusual cases",
            "Only the largest possible value",
            "Random values with unknown answers"
          ],
          "correct_index": 1,
          "explanation": "Covering typical, boundary, and unusual inputs exposes the widest range of possible errors."
        }
      ],
      "challenge_title": "Pass or Fail",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer score.\n# Print PASS if the score is at least 60, otherwise print FAIL.\nscore = int(input())\n# TODO: print PASS or FAIL based on the boundary of 60\n",
      "challenge_solution_code": "score = int(input())\nif score >= 60:\n    print(\"PASS\")\nelse:\n    print(\"FAIL\")\n",
      "challenge_test_cases": [
        {
          "input": "60",
          "expected_output": "PASS"
        },
        {
          "input": "100",
          "expected_output": "PASS"
        },
        {
          "input": "59",
          "expected_output": "FAIL"
        }
      ]
    },
    {
      "id": "csp-crd-l6",
      "project_id": "csp-crd",
      "order": 6,
      "title": "Identifying and Classifying Errors",
      "explanation": "## Errors Are Part of Programming\n\nEvery programmer produces errors, and a key Creative Development skill is finding and fixing them. AP CSP groups program errors into three kinds:\n\n- **Syntax errors**: the code breaks the language's rules, so it will not run. Example: a missing colon or unmatched parenthesis.\n- **Runtime errors**: the program starts but crashes during execution, such as dividing by zero or converting a non-number to an int.\n- **Logic errors**: the program runs without crashing but produces the *wrong* result because the reasoning is flawed.\n\nLogic errors are the trickiest because nothing announces them; only testing reveals them.\n\n## Spotting a Logic Error\n\nConsider code meant to compute a sum. A logic error hides inside the loop:\n\n```python\nnums = [4, 6]\ntotal = 0\nfor n in nums:\n    total = n        # bug: should be total += n\nprint(total)\n```\n\nThis runs fine but prints `6` instead of `10`. The fix is `total += n`. Because the program never crashes, only a known-answer test exposes the mistake.\n\n## Reducing Errors\n\nProgrammers reduce errors by **validating input** and handling edge cases. For example, counting how many values are positive must work even when some are zero or negative:\n\n```python\nparts = input().split()\ncount = 0\nfor p in parts:\n    if int(p) > 0:\n        count += 1\nprint(count)\n```\n\nHandling each value carefully — including zero, which is *not* positive — avoids logic errors.\n\nKey takeaways:\n\n- Errors are syntax, runtime, or logic.\n- Syntax errors stop the program from running at all.\n- Logic errors still run but give wrong results, so testing is needed to find them.\n- Careful handling of edge cases like zero prevents many logic errors.",
      "key_terms": [
        {
          "term": "Syntax error",
          "definition": "Code that breaks the language's rules, preventing the program from running until it is fixed."
        },
        {
          "term": "Runtime error",
          "definition": "An error that occurs while a program executes, such as dividing by zero, causing it to crash."
        },
        {
          "term": "Logic error",
          "definition": "A flaw in reasoning that produces incorrect results even though the program runs without crashing."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A program runs to completion but prints the wrong total. What kind of error is this?",
          "options": [
            "Syntax error",
            "Runtime error",
            "Logic error",
            "Compiler error"
          ],
          "correct_index": 2,
          "explanation": "A program that runs without crashing but gives wrong output has a logic error in its reasoning."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which error type prevents the program from running at all?",
          "options": [
            "Logic error",
            "Syntax error",
            "Boundary case",
            "Documentation error"
          ],
          "correct_index": 1,
          "explanation": "Syntax errors violate the language's rules, so the program cannot run until they are fixed."
        },
        {
          "question": "Why are logic errors often the hardest to find?",
          "options": [
            "They always crash with a clear message",
            "The program still runs, so only testing reveals the wrong output",
            "They only happen on empty input",
            "They are always caused by missing colons"
          ],
          "correct_index": 1,
          "explanation": "Logic errors give no crash or message; the program runs but returns wrong results, so testing is needed to expose them."
        }
      ],
      "challenge_title": "Count Positive Numbers",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers.\n# Print how many of them are strictly greater than 0.\n# Remember: 0 is NOT positive.\nparts = input().split()\n# TODO: count and print the positive values\n",
      "challenge_solution_code": "parts = input().split()\ncount = 0\nfor p in parts:\n    if int(p) > 0:\n        count += 1\nprint(count)\n",
      "challenge_test_cases": [
        {
          "input": "1 -2 3 0 5",
          "expected_output": "3"
        },
        {
          "input": "-1 -2 -3",
          "expected_output": "0"
        },
        {
          "input": "4 4 4 4",
          "expected_output": "4"
        }
      ]
    },
    {
      "id": "csp-crd-l7",
      "project_id": "csp-crd",
      "order": 7,
      "title": "Debugging and Documentation",
      "explanation": "## Debugging\n\n**Debugging** is the process of finding and correcting errors. Once you know a bug exists, debugging locates it and fixes it. Common techniques include:\n\n- Adding **print statements** to inspect values while the program runs.\n- Testing with inputs whose correct output you already know.\n- Checking **boundary cases** like empty input or the largest allowed value.\n- Reading error messages carefully to find the failing line.\n\nGuarding against bad input prevents many crashes. For example, computing an average must avoid dividing by zero when the input is empty:\n\n```python\nline = input()\nparts = line.split()\nif len(parts) == 0:\n    print(0)\nelse:\n    total = sum(int(p) for p in parts)\n    print(total // len(parts))\n```\n\nThe empty-input guard turns a potential runtime error into a sensible result.\n\n## Program Documentation\n\nThroughout development, teams write **program documentation**: comments and notes that explain *what* the code does and *why*. Documentation helps collaborators understand the code and helps the original author remember decisions later. Good comments explain intent, not the obvious:\n\n```python\n# Guard against empty input so we never divide by zero\nif len(parts) == 0:\n    print(0)\n```\n\nDocumentation must be **kept up to date** — a comment that no longer matches the code is worse than no comment, because it misleads readers.\n\n## Why It Matters\n\nDebugging and documentation work together. Clear documentation makes bugs easier to locate, and a well-debugged program is easier to document accurately. Both are ongoing habits, not one-time tasks.\n\nKey takeaways:\n\n- Debugging finds and fixes errors using prints, known-answer tests, and boundary checks.\n- Input guards turn potential crashes into sensible behavior.\n- Documentation explains what code does and why.\n- Comments must be updated whenever the code changes.",
      "key_terms": [
        {
          "term": "Debugging",
          "definition": "The process of finding and correcting errors using print statements, known-answer tests, and boundary checks."
        },
        {
          "term": "Program documentation",
          "definition": "Comments and notes describing what code does and why, kept up to date so collaborators can understand it."
        },
        {
          "term": "Input guard",
          "definition": "A check that handles unusual input (like an empty line) to prevent a runtime error such as division by zero."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why must documentation be kept up to date?",
          "options": [
            "Comments slow the program down",
            "An outdated comment misleads readers and is worse than none",
            "Documentation is graded automatically",
            "Comments must match the file size"
          ],
          "correct_index": 1,
          "explanation": "A comment that no longer matches the code misleads whoever reads it, which is more harmful than having no comment."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is a common debugging technique?",
          "options": [
            "Deleting the failing test",
            "Adding print statements to inspect values as the program runs",
            "Removing all comments",
            "Ignoring error messages"
          ],
          "correct_index": 1,
          "explanation": "Print statements reveal the actual values flowing through the program, helping locate the bug."
        },
        {
          "question": "What should good program documentation explain?",
          "options": [
            "Only the programmer's name",
            "What the code does and why",
            "The exact run time in seconds",
            "The price of the computer"
          ],
          "correct_index": 1,
          "explanation": "Documentation describes the purpose and reasoning behind code so others can understand and maintain it."
        }
      ],
      "challenge_title": "Safe Average",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers (the line may be empty).\n# Print the integer average using floor division.\n# If the line is empty, print 0 (guard against dividing by zero).\nline = input()\nparts = line.split()\n# TODO: handle the empty case, then print the floor-division average\n",
      "challenge_solution_code": "line = input()\nparts = line.split()\nif len(parts) == 0:\n    print(0)\nelse:\n    total = 0\n    for p in parts:\n        total += int(p)\n    print(total // len(parts))\n",
      "challenge_test_cases": [
        {
          "input": "4 6",
          "expected_output": "5"
        },
        {
          "input": "10 20 30",
          "expected_output": "20"
        },
        {
          "input": "",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-crd-l8",
      "project_id": "csp-crd",
      "order": 8,
      "title": "Program Functionality and Purpose",
      "explanation": "## What a Program Does\n\nEvery program exists to serve a **purpose** — the problem it solves or the value it provides to users. **Program functionality** is the set of behaviors that fulfill that purpose: the inputs it accepts, the processing it performs, and the outputs it returns. Describing functionality clearly is part of both design and documentation.\n\n## Inputs, Processing, Outputs\n\nMost programs follow an **input → process → output** structure:\n\n- **Input**: data the program receives (from a user, file, or sensor).\n- **Process**: the logic that transforms input into a result.\n- **Output**: what the program produces for the user.\n\nA program's functionality is judged by whether its outputs correctly fulfill its purpose for the expected inputs.\n\n## Bringing the Process Together\n\nThis final lesson combines everything: investigate the need, design the structure, prototype, test, handle errors, and document. Suppose the purpose is a simple grade reporter: read several scores and report the average and whether the class passed (average of at least 60).\n\n```python\n# Purpose: report a class average and pass/fail status\nparts = input().split()\ntotal = 0\nfor p in parts:\n    total += int(p)\naverage = total // len(parts)\nprint(average)\nif average >= 60:\n    print(\"PASS\")\nelse:\n    print(\"FAIL\")\n```\n\nThe input is the scores, the process computes the average, and the output is two lines fulfilling the purpose. Each piece reflects a phase you learned earlier.\n\n## Judging Functionality\n\nA program **functions correctly** when, across typical, boundary, and unusual inputs, its outputs match the requirements. Creative development is the disciplined journey — collaboration, design, prototyping, testing, documentation, and debugging — that gets a program from idea to reliable functionality.\n\nKey takeaways:\n\n- A program's purpose is the problem it solves for users.\n- Functionality is the input-process-output behavior that fulfills the purpose.\n- Correct functionality means outputs match requirements across many inputs.\n- The full development process turns an idea into reliable functionality.",
      "key_terms": [
        {
          "term": "Program functionality",
          "definition": "The set of behaviors — inputs, processing, and outputs — through which a program fulfills its purpose."
        },
        {
          "term": "Purpose",
          "definition": "The problem a program solves or the value it provides to its users."
        },
        {
          "term": "Input-process-output",
          "definition": "The common structure where a program receives input, transforms it through logic, and returns an output."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does 'program functionality' refer to?",
          "options": [
            "The color scheme of the editor",
            "The input-process-output behaviors that fulfill the program's purpose",
            "The number of lines of code",
            "The speed of the internet connection"
          ],
          "correct_index": 1,
          "explanation": "Functionality is the behavior — inputs, processing, and outputs — that makes the program serve its purpose."
        }
      ],
      "quiz_questions": [
        {
          "question": "A program 'functions correctly' when its outputs...",
          "options": [
            "Are produced as fast as possible",
            "Match the requirements across typical, boundary, and unusual inputs",
            "Contain the most code",
            "Avoid using any input"
          ],
          "correct_index": 1,
          "explanation": "Correct functionality means outputs satisfy the requirements across the full range of expected inputs."
        },
        {
          "question": "Which structure do most programs follow?",
          "options": [
            "Output then input then process",
            "Input, then process, then output",
            "Process only, with no input or output",
            "Random order each run"
          ],
          "correct_index": 1,
          "explanation": "Programs typically take input, process it into a result, and produce output."
        }
      ],
      "challenge_title": "Grade Reporter",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integer scores.\n# Compute the integer (floor) average.\n# Print the average on the first line.\n# On the second line print PASS if the average is at least 60, else FAIL.\nparts = input().split()\n# TODO: compute the average, then print it and PASS/FAIL\n",
      "challenge_solution_code": "parts = input().split()\ntotal = 0\nfor p in parts:\n    total += int(p)\naverage = total // len(parts)\nprint(average)\nif average >= 60:\n    print(\"PASS\")\nelse:\n    print(\"FAIL\")\n",
      "challenge_test_cases": [
        {
          "input": "60 60 60",
          "expected_output": "60\nPASS"
        },
        {
          "input": "90 80 100",
          "expected_output": "90\nPASS"
        },
        {
          "input": "50 40 30",
          "expected_output": "40\nFAIL"
        }
      ]
    }
  ]
}
