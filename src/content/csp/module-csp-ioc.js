// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-ioc",
    "title": "Impact of Computing",
    "description": "Big Idea 5 explores how computing innovations create beneficial and harmful effects, raise issues of access and bias, and demand legal, ethical, and safe behavior.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 106,
    "track": "apcsp",
    "unit": "Big Idea 5 — Impact of Computing",
    "tags": [
      "beneficial/harmful effects",
      "the digital divide",
      "bias"
    ]
  },
  "lessons": [
    {
      "id": "csp-ioc-l1",
      "project_id": "csp-ioc",
      "order": 1,
      "title": "Beneficial and Harmful Effects",
      "explanation": "## Every Innovation Cuts Both Ways\n\nA **computing innovation** is any program, device, or system that uses code to solve a problem. The AP CSP framework stresses one core idea: the same innovation can produce both **beneficial effects** and **harmful effects**, often at the same time and often unintended.\n\n- **Beneficial effect** — a positive outcome for individuals, groups, or society (faster communication, medical diagnosis, accessibility tools).\n- **Harmful effect** — a negative outcome, which may be unintended (privacy loss, addiction, misinformation, job displacement).\n\n## Intended vs. Unintended\n\nWhen people create an innovation they have a goal, but real-world use frequently exceeds that goal. Social media was built to connect people (beneficial) yet also spreads misinformation (harmful). The exam expects you to recognize that **harmful effects are frequently unintended** and that an effect can be beneficial for one group while harmful for another.\n\n## Effects Are Not Symmetric\n\nWhether an effect is judged beneficial or harmful can depend on context, perspective, and time. A useful skill is *counting and comparing* effects to reason about net impact.\n\n```python\n# Tally beneficial vs harmful effects of an innovation\neffects = [\"beneficial\", \"harmful\", \"beneficial\", \"beneficial\"]\nben = effects.count(\"beneficial\")\nharm = effects.count(\"harmful\")\nprint(\"net:\", ben - harm)\n```\n\n## Key Takeaways\n\n- Innovations have **dual effects** — analyze both sides.\n- **Unintended consequences** are a defining theme of Big Idea 5.\n- The *same* innovation can help and harm different stakeholders.\n- Always ask: *beneficial for whom, harmful for whom?*\n\nWhen you write free-response answers, name a specific innovation, then give one concrete beneficial effect and one concrete harmful effect. Vague claims like \"it is bad for society\" earn no credit; specificity does.",
      "key_terms": [
        {
          "term": "Computing innovation",
          "definition": "A program, physical device, or system that includes a program as an integral part of its function."
        },
        {
          "term": "Beneficial effect",
          "definition": "A positive outcome a computing innovation produces for individuals or society."
        },
        {
          "term": "Unintended consequence",
          "definition": "A harmful or unexpected effect that was not the goal of the innovation's creators."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A fitness-tracking app helps users exercise but also leaks their location data. This best illustrates that an innovation can have:",
          "options": [
            "Only beneficial effects",
            "Both beneficial and harmful effects at once",
            "No measurable effect",
            "Only intended effects"
          ],
          "correct_index": 1,
          "explanation": "The same innovation produces a beneficial effect (encouraging exercise) and a harmful, often unintended effect (privacy loss)."
        }
      ],
      "quiz_questions": [
        {
          "question": "According to Big Idea 5, harmful effects of a computing innovation are often:",
          "options": [
            "Intended by the creators",
            "Unintended consequences",
            "Impossible to occur",
            "Always larger than benefits"
          ],
          "correct_index": 1,
          "explanation": "The framework emphasizes that harmful effects are frequently unintended by the people who built the innovation."
        },
        {
          "question": "Which statement about an innovation's effects is most accurate?",
          "options": [
            "An effect is beneficial or harmful for everyone equally",
            "An effect can be beneficial for one group and harmful for another",
            "Effects never change over time",
            "Only physical devices have harmful effects"
          ],
          "correct_index": 1,
          "explanation": "Whether an effect is beneficial or harmful can depend on perspective; one group may benefit while another is harmed."
        }
      ],
      "challenge_title": "Net Effect Counter",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # First token is N, the number of effect labels that follow.\n    # Each label is either \"beneficial\" or \"harmful\".\n    # TODO: count beneficial and harmful, then print the verdict.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    labels = data[1:1+n]\n    ben = labels.count(\"beneficial\")\n    harm = labels.count(\"harmful\")\n    if ben > harm:\n        print(\"net beneficial\")\n    elif harm > ben:\n        print(\"net harmful\")\n    else:\n        print(\"balanced\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "4\nbeneficial harmful beneficial beneficial",
          "expected_output": "net beneficial"
        },
        {
          "input": "3\nharmful harmful beneficial",
          "expected_output": "net harmful"
        },
        {
          "input": "2\nbeneficial harmful",
          "expected_output": "balanced"
        }
      ]
    },
    {
      "id": "csp-ioc-l2",
      "project_id": "csp-ioc",
      "order": 2,
      "title": "The Digital Divide and Bias",
      "explanation": "## The Digital Divide\n\nThe **digital divide** is the unequal access to computing devices and the internet across different groups, defined by factors such as income, geography (rural vs. urban), age, education, and country. People without reliable access are cut off from online education, jobs, healthcare, and government services, which can widen existing inequalities.\n\nThe divide exists at multiple levels:\n\n- **Access** — do you have a device and a connection at all?\n- **Quality** — is the connection fast and reliable?\n- **Skills** — do you know how to use the technology effectively?\n\n## Bias in Computing\n\nComputing innovations can reflect **existing human biases**. Bias enters in several ways:\n\n- **Biased training data** — a hiring model trained mostly on resumes from one group may favor that group.\n- **Biased design choices** — choosing which features matter encodes the designer's assumptions.\n- **Biased use** — even a fair tool can be applied unfairly.\n\nA key exam point: bias is **not always intentional**. It frequently slips in unnoticed, so creators must actively test for it.\n\n```python\n# Simple fairness check: compare approval rates by group\napproved = {\"A\": 30, \"B\": 10}\ntotal = {\"A\": 50, \"B\": 50}\nfor g in approved:\n    rate = approved[g] / total[g]\n    print(g, round(rate, 2))\n```\n\n## Reducing the Gaps\n\n- Expand affordable broadband and public access (libraries, schools).\n- Design with **accessibility** so tools work for people with disabilities.\n- Audit data and outcomes for bias before and after deployment.\n\n## Key Takeaways\n\n- The **digital divide** is about *unequal access*, not just having no internet.\n- Bias can come from **data, design, or use**.\n- Both issues can deepen social inequality if ignored, and both can be reduced with deliberate effort.",
      "key_terms": [
        {
          "term": "Digital divide",
          "definition": "The gap between those who have ready access to computers and the internet and those who do not."
        },
        {
          "term": "Algorithmic bias",
          "definition": "Systematic unfairness in a computing system, often arising from biased data or design choices."
        },
        {
          "term": "Accessibility",
          "definition": "Designing technology so people with a wide range of abilities can use it."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A loan-approval model was trained mostly on data from wealthy applicants and now rejects most low-income applicants. This is an example of:",
          "options": [
            "The digital divide",
            "Bias from training data",
            "Strong encryption",
            "Open access"
          ],
          "correct_index": 1,
          "explanation": "When a model learns from skewed data, it reproduces that skew as algorithmic bias."
        }
      ],
      "quiz_questions": [
        {
          "question": "The digital divide most directly refers to:",
          "options": [
            "The speed of CPUs over time",
            "Unequal access to computing and the internet across groups",
            "Splitting code into functions",
            "Binary vs. decimal numbers"
          ],
          "correct_index": 1,
          "explanation": "The digital divide is the gap in access to technology between different populations."
        },
        {
          "question": "Which is true about bias in computing innovations?",
          "options": [
            "Bias is always intentional",
            "Bias can never be detected",
            "Bias can enter through data, design, or use, often unintentionally",
            "Only hardware can be biased"
          ],
          "correct_index": 2,
          "explanation": "Bias commonly enters through training data, design choices, or how a tool is used, and it is frequently unintentional."
        }
      ],
      "challenge_title": "Access Gap Reporter",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # data[0] = number of people in group A with internet access\n    # data[1] = total people in group A\n    # data[2] = number of people in group B with internet access\n    # data[3] = total people in group B\n    # TODO: print each group's access percentage (integer) and the gap.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    a_acc, a_tot, b_acc, b_tot = (int(x) for x in data[:4])\n    a_pct = a_acc * 100 // a_tot\n    b_pct = b_acc * 100 // b_tot\n    print(\"A\", a_pct)\n    print(\"B\", b_pct)\n    print(\"gap\", abs(a_pct - b_pct))\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "40 50 10 50",
          "expected_output": "A 80\nB 20\ngap 60"
        },
        {
          "input": "25 100 25 100",
          "expected_output": "A 25\nB 25\ngap 0"
        },
        {
          "input": "9 10 1 4",
          "expected_output": "A 90\nB 25\ngap 65"
        }
      ]
    },
    {
      "id": "csp-ioc-l3",
      "project_id": "csp-ioc",
      "order": 3,
      "title": "Legal, Ethical, and Safe Computing",
      "explanation": "## Owning and Sharing Digital Work\n\nDigital content is easy to copy, which raises **legal and ethical** questions about ownership.\n\n- **Copyright** automatically protects original creative work; copying without permission can be infringement.\n- A **Creative Commons** license lets a creator grant specific permissions (e.g., share if you give credit).\n- **Open source / open access** materials are made freely usable, but usually still require attribution.\n- **Plagiarism** is presenting others' work as your own; **citation** avoids it.\n\n## Privacy and Personally Identifiable Information\n\n**Personally Identifiable Information (PII)** is data that can identify a specific person, such as a name, address, Social Security number, or location history. PII has benefits (convenience, personalization) but also serious risks if exposed.\n\nCommon privacy threats include **phishing**, **keylogging**, **malware**, and **data breaches**. Companies collect PII through accounts, cookies, and sensors, sometimes more than users realize.\n\n## Safe Computing\n\nProtecting data is a shared responsibility. Core defenses:\n\n- **Strong, unique passwords** plus **multi-factor authentication**.\n- **Encryption** to scramble data so only authorized parties can read it.\n- Recognizing **phishing** and not clicking suspicious links.\n\n```python\n# Toy strength check (NOT real security):\npw = \"Sk8board!\"\nlong_enough = len(pw) >= 8\nhas_digit = any(c.isdigit() for c in pw)\nprint(long_enough and has_digit)\n```\n\n## Key Takeaways\n\n- Respect **copyright** and licenses; cite sources to avoid **plagiarism**.\n- **PII** is valuable and risky; minimize what you share.\n- **Encryption**, strong authentication, and skepticism toward phishing are essential **safe computing** practices.\n\nThe exam rewards naming a specific safeguard and explaining *why* it protects data, not just listing terms.",
      "key_terms": [
        {
          "term": "Personally Identifiable Information (PII)",
          "definition": "Information that can be used to identify a specific individual, such as name, address, or SSN."
        },
        {
          "term": "Encryption",
          "definition": "The process of encoding data so that only authorized parties with a key can read it."
        },
        {
          "term": "Phishing",
          "definition": "A scam that tricks people into revealing sensitive information by pretending to be a trustworthy source."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which item is considered Personally Identifiable Information (PII)?",
          "options": [
            "A user's home address",
            "The year 2026",
            "A public weather forecast",
            "The number of pixels on a screen"
          ],
          "correct_index": 0,
          "explanation": "A home address can identify a specific person, so it counts as PII; generic public facts do not."
        }
      ],
      "quiz_questions": [
        {
          "question": "Encryption protects data primarily by:",
          "options": [
            "Deleting it permanently",
            "Making it readable only to those with the correct key",
            "Speeding up the internet",
            "Removing all bias from algorithms"
          ],
          "correct_index": 1,
          "explanation": "Encryption scrambles data so that only authorized parties holding the key can decode and read it."
        },
        {
          "question": "Using an image you found online in your project without permission or credit most directly raises a concern about:",
          "options": [
            "The digital divide",
            "Copyright and plagiarism",
            "CPU clock speed",
            "Network bandwidth"
          ],
          "correct_index": 1,
          "explanation": "Reusing others' creative work without permission or attribution can violate copyright and constitute plagiarism."
        }
      ],
      "challenge_title": "Password Safety Checker",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    pw = sys.stdin.readline().strip()\n    # A password is \"strong\" only if ALL are true:\n    #   - length >= 8\n    #   - contains at least one digit\n    #   - contains at least one uppercase letter\n    # Print \"strong\" or \"weak\".\n    # TODO: implement the checks.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    pw = sys.stdin.readline().strip()\n    long_enough = len(pw) >= 8\n    has_digit = any(c.isdigit() for c in pw)\n    has_upper = any(c.isupper() for c in pw)\n    if long_enough and has_digit and has_upper:\n        print(\"strong\")\n    else:\n        print(\"weak\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "Sk8board!",
          "expected_output": "strong"
        },
        {
          "input": "password",
          "expected_output": "weak"
        },
        {
          "input": "Ab1xyz",
          "expected_output": "weak"
        }
      ]
    }
  ]
}
