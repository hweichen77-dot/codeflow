// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-crd",
    "title": "Creative Development",
    "description": "Explores how programs are designed, developed, and refined through collaboration, planning, iteration, and systematic error correction.",
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
      "title": "Collaboration and Program Design",
      "explanation": "## Why Collaboration Matters\n\nComputing innovations are rarely built by one person. **Collaboration** is the practice of multiple people working together toward a shared goal, and it is a core skill in the AP CSP Creative Development big idea. Diverse teams produce better software because different backgrounds surface different ideas, edge cases, and user needs.\n\nEffective collaboration relies on a few key behaviors:\n\n- **Communication**: sharing ideas clearly and listening actively.\n- **Consensus building**: reaching agreement on decisions instead of one person dictating.\n- **Conflict resolution**: handling disagreement constructively.\n- **Constructive feedback**: critiquing the work, not the person.\n\nA widely used model is **pair programming**, where two developers share one workstation. One acts as the *driver* (typing code) and the other as the *navigator* (reviewing, thinking ahead). They swap roles regularly.\n\n## Program Design Before Code\n\n**Program design** is the process of planning a program before writing it. Good design starts by understanding the problem and the **users** who will rely on it. Designers gather requirements, sketch the structure, and define what inputs the program accepts and what outputs it produces.\n\nA simple design tool is a list of requirements that the finished program must satisfy. Consider a tool that totals a team's contributions:\n\n```python\n# Design note: input is a count of items per teammate\n# Requirement: output the team total\nparts = input().split()\ntotal = 0\nfor p in parts:\n    total += int(p)\nprint(total)\n```\n\nBy agreeing on the input format and expected output *first*, teammates can work in parallel without stepping on each other.\n\n## Investigating the Problem\n\nBefore designing, teams **investigate**: they study the problem, talk to users, and identify constraints. This reduces wasted effort. Skipping investigation often leads to a program that works but solves the wrong problem.\n\nKey takeaways:\n\n- Collaboration improves quality through diverse perspectives.\n- Design and investigation come *before* coding.\n- Agreeing on input/output contracts lets teams divide work cleanly.\n\nThese habits set up the development process you will study next.",
      "key_terms": [
        {
          "term": "Collaboration",
          "definition": "Multiple people working together toward a shared goal, improving software through diverse perspectives and shared responsibility."
        },
        {
          "term": "Pair programming",
          "definition": "A collaboration technique where two developers share one workstation, alternating between driver (typing) and navigator (reviewing) roles."
        },
        {
          "term": "Program design",
          "definition": "The planning process that defines a program's requirements, structure, inputs, and outputs before code is written."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In pair programming, what does the navigator primarily do?",
          "options": [
            "Types all of the code",
            "Reviews the code and thinks ahead while the driver types",
            "Manages the project schedule",
            "Writes the final documentation only"
          ],
          "correct_index": 1,
          "explanation": "The navigator reviews the driver's code and plans ahead, while the driver does the typing. Roles are swapped regularly."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why do diverse collaborative teams tend to produce better software?",
          "options": [
            "They write code faster than individuals",
            "Different perspectives surface more ideas, edge cases, and user needs",
            "They never have disagreements",
            "They avoid the design phase entirely"
          ],
          "correct_index": 1,
          "explanation": "Diversity brings varied viewpoints that catch more edge cases and better address real user needs."
        },
        {
          "question": "What should typically happen BEFORE writing code for a program?",
          "options": [
            "Deploying it to users",
            "Designing and investigating the problem",
            "Deleting old comments",
            "Optimizing for speed"
          ],
          "correct_index": 1,
          "explanation": "Investigation and design come first so the team builds the right thing and can divide work cleanly."
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
      "title": "The Development Process and Iteration",
      "explanation": "## A Process, Not a Straight Line\n\nThe **development process** is the set of steps used to create a program. AP CSP describes four phases that are repeated, not done once:\n\n- **Investigating**: understand the problem and the users.\n- **Designing**: plan the structure, inputs, and outputs.\n- **Prototyping**: build a working but incomplete version.\n- **Testing**: check whether it meets requirements.\n\nBecause software is hard to get right the first time, this process is **iterative** and **incremental**. *Iterative* means you cycle through the phases repeatedly. *Incremental* means you add a little functionality at a time, testing as you go.\n\n## Prototypes and Minimum Viable Products\n\nA **prototype** is an early, partial version used to test ideas quickly. It does not need every feature; it needs enough to get feedback. Building a small prototype early reduces risk because problems surface sooner, when they are cheaper to fix.\n\nConsider building a doubling tool one step at a time. A first increment might just double a number:\n\n```python\nn = int(input())\nprint(n * 2)\n```\n\nA later increment could double every number in a list, then add validation, then formatting. Each version is tested before the next is added.\n\n## Testing Drives the Cycle\n\n**Testing** compares actual output to expected output. When a test fails, you return to an earlier phase, make a change, and test again. This feedback loop is what makes the process iterative.\n\nGood teams test against many inputs:\n\n- typical cases (ordinary values)\n- boundary cases (the smallest or largest allowed)\n- empty or unusual cases\n\n## Program Documentation\n\nThroughout development, teams write **program documentation**: comments and notes that explain *what* the code does and *why*. Documentation helps collaborators understand the code and helps the original author remember decisions later. It should be updated whenever the program changes.\n\nKey takeaways:\n\n- Development is iterative and incremental, not one pass.\n- Prototypes get feedback early and cheaply.\n- Testing against varied inputs drives each new cycle.\n- Documentation keeps the team aligned over time.",
      "key_terms": [
        {
          "term": "Iterative development",
          "definition": "Repeatedly cycling through investigate, design, prototype, and test phases to refine a program over time."
        },
        {
          "term": "Prototype",
          "definition": "An early, partial version of a program built to test ideas and gather feedback before full implementation."
        },
        {
          "term": "Program documentation",
          "definition": "Comments and written notes describing what code does and why, kept up to date so collaborators can understand it."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does it mean that development is 'incremental'?",
          "options": [
            "The whole program is written at once",
            "Functionality is added a little at a time, testing along the way",
            "Documentation is written only at the end",
            "Each developer works in complete isolation"
          ],
          "correct_index": 1,
          "explanation": "Incremental development adds small pieces of functionality step by step, testing each before moving on."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which best describes the purpose of a prototype?",
          "options": [
            "A polished final product ready for release",
            "An early partial version to test ideas and get feedback quickly",
            "A document listing every requirement",
            "A backup copy of the source code"
          ],
          "correct_index": 1,
          "explanation": "A prototype is an early, incomplete version used to gather feedback before building the full program."
        },
        {
          "question": "When a test fails during development, what should the team typically do?",
          "options": [
            "Ship the program anyway",
            "Return to an earlier phase, make a change, and test again",
            "Delete the failing test",
            "Stop testing entirely"
          ],
          "correct_index": 1,
          "explanation": "Test failures feed the iterative loop: revise an earlier phase, then re-test until requirements are met."
        }
      ],
      "challenge_title": "Double Every Number",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: count of numbers n.\n# Second line: n space-separated integers.\n# Print each number doubled, space-separated, on one line.\nn = int(input())\nnums = input().split()\n# TODO: double each number and print the results space-separated\n",
      "challenge_solution_code": "n = int(input())\nnums = input().split()\nresult = []\nfor x in nums:\n    result.append(str(int(x) * 2))\nprint(\" \".join(result))\n",
      "challenge_test_cases": [
        {
          "input": "3\n1 2 3",
          "expected_output": "2 4 6"
        },
        {
          "input": "1\n10",
          "expected_output": "20"
        },
        {
          "input": "4\n0 5 7 100",
          "expected_output": "0 10 14 200"
        }
      ]
    },
    {
      "id": "csp-crd-l3",
      "project_id": "csp-crd",
      "order": 3,
      "title": "Identifying and Correcting Errors",
      "explanation": "## Errors Are Part of Programming\n\nEvery programmer produces errors, and a key Creative Development skill is finding and fixing them. AP CSP groups program errors into three kinds:\n\n- **Syntax errors**: the code breaks the rules of the language, so it will not run. Example: a missing colon or parenthesis.\n- **Runtime errors**: the program starts but crashes during execution, such as dividing by zero or converting a non-number to an int.\n- **Logic errors**: the program runs without crashing but produces the *wrong* result because the logic is flawed.\n\nLogic errors are the trickiest because nothing announces them; only careful testing reveals them.\n\n## Debugging\n\n**Debugging** is the process of finding and correcting errors. Common techniques include:\n\n- Adding **print statements** to inspect values as the program runs.\n- Testing with inputs whose correct output you already know.\n- Checking **boundary cases** like empty input or the largest allowed value.\n- Reading error messages carefully to locate the failing line.\n\nConsider a program meant to print the average of numbers. A logic error hides here:\n\n```python\nnums = [4, 6]\ntotal = 0\nfor n in nums:\n    total = n        # bug: should be total += n\nprint(total / len(nums))\n```\n\nThis runs without crashing but prints `3.0` instead of `5.0`. Only by testing a known case do you catch it.\n\n## Defensive Practices\n\nTo reduce errors, programmers **validate input** and handle edge cases. For example, guarding against division by zero prevents a runtime error:\n\n```python\nparts = input().split()\nif len(parts) == 0:\n    print(0)\nelse:\n    total = sum(int(p) for p in parts)\n    print(total // len(parts))\n```\n\nKey takeaways:\n\n- Errors are syntax, runtime, or logic.\n- Logic errors need testing to find because the program still runs.\n- Debugging uses print statements, known-answer tests, and boundary checks.\n- Validating input prevents many runtime errors.",
      "key_terms": [
        {
          "term": "Logic error",
          "definition": "A flaw in a program's logic that produces incorrect results even though the program runs without crashing."
        },
        {
          "term": "Runtime error",
          "definition": "An error that occurs while a program is executing, such as dividing by zero, causing it to crash."
        },
        {
          "term": "Debugging",
          "definition": "The process of finding and correcting errors using techniques like print statements, known-answer tests, and boundary checks."
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
            "They produce a crash with a clear message",
            "The program still runs, so only testing reveals the wrong output",
            "They only happen on empty input",
            "They are always caused by missing colons"
          ],
          "correct_index": 1,
          "explanation": "Logic errors give no crash or message; the program runs but returns wrong results, so testing is needed to expose them."
        }
      ],
      "challenge_title": "Safe Average",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers (may be empty).\n# Print the integer average (floor division).\n# If the line is empty, print 0.\nline = input()\nparts = line.split()\n# TODO: handle the empty case, then print the floor-division average\n",
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
    }
  ]
}
