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
      "effects",
      "access",
      "ethics"
    ]
  },
  "lessons": [
    {
      "id": "csp-ioc-l1",
      "project_id": "csp-ioc",
      "order": 1,
      "title": "Beneficial and Harmful Effects",
      "explanation": "## Every Innovation Cuts Both Ways\n\nA **computing innovation** is any program, physical device, or system that includes a program as an integral part of its function. The AP CSP framework stresses one core idea: the same innovation can produce both **beneficial effects** and **harmful effects**, often at the same time and often unintended.\n\n- **Beneficial effect** — a positive outcome for individuals, groups, or society (faster communication, medical diagnosis, accessibility tools).\n- **Harmful effect** — a negative outcome, which may be unintended (privacy loss, addiction, misinformation, job displacement).\n\n## Intended vs. Unintended\n\nWhen people create an innovation they have a goal, but real-world use frequently exceeds that goal. Social media was built to connect people (beneficial) yet also spreads misinformation (harmful). The exam expects you to recognize that **harmful effects are frequently unintended** and that an effect can be beneficial for one group while harmful for another.\n\n## Effects Are Not Symmetric\n\nWhether an effect is judged beneficial or harmful depends on context, perspective, and time. A useful reasoning skill is *counting and comparing* effects to estimate net impact.\n\n```python\n# Tally beneficial vs harmful effects of an innovation\neffects = [\"beneficial\", \"harmful\", \"beneficial\", \"beneficial\"]\nben = effects.count(\"beneficial\")\nharm = effects.count(\"harmful\")\nprint(\"net:\", ben - harm)\n```\n\n## Key Takeaways\n\n- Innovations have **dual effects** — analyze both sides.\n- **Unintended consequences** are a defining theme of Big Idea 5.\n- The *same* innovation can help and harm different stakeholders.\n- Always ask: *beneficial for whom, harmful for whom?*\n\nIn free-response answers, name a specific innovation, then give one concrete beneficial effect and one concrete harmful effect. Vague claims like \"it is bad for society\" earn no credit; specificity does.",
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
      "title": "The Digital Divide",
      "explanation": "## What the Digital Divide Is\n\nThe **digital divide** is the unequal access to computing devices and the internet across different groups, shaped by factors such as income, geography (rural vs. urban), age, education, and country. People without reliable access are cut off from online education, jobs, healthcare, and government services, which can widen inequalities that already exist.\n\nThe divide exists at multiple levels:\n\n- **Access** — do you have a device and a connection at all?\n- **Quality** — is the connection fast and reliable?\n- **Skills** — do you know how to use the technology effectively?\n\n## Why It Matters for the Exam\n\nThe framework links the digital divide directly to **equity**. As more services move online, the gap does not stay flat — it compounds. A student without home internet falls behind in ways that affect future income and opportunity. The divide is therefore both a *cause* and an *effect* of inequality.\n\n## Measuring Access Gaps\n\nWe can quantify a divide by comparing access rates between groups. A larger gap means a deeper divide.\n\n```python\n# Access rate per group, then the gap between them\nrural = 60 / 100   # 60 of 100 households connected\nurban = 92 / 100   # 92 of 100 households connected\ngap = urban - rural\nprint(round(gap, 2))  # 0.32\n```\n\n## Closing the Gap\n\n- Expand affordable broadband and public access points (libraries, schools).\n- Subsidize devices for low-income households.\n- Teach digital literacy so access translates into capability.\n\n## Key Takeaways\n\n- The **digital divide** is about *unequal access*, not just having no internet.\n- It operates at access, quality, and skill levels.\n- Left unaddressed, it **deepens social inequality**; deliberate policy can narrow it.",
      "key_terms": [
        {
          "term": "Digital divide",
          "definition": "The gap between those who have ready access to computers and the internet and those who do not."
        },
        {
          "term": "Equity",
          "definition": "Fair access to opportunities; the digital divide undermines equity as services move online."
        },
        {
          "term": "Digital literacy",
          "definition": "The skills needed to use computing tools effectively, beyond merely having access."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A rural town has internet, but speeds are too slow to stream classes. This shows the divide can exist at the level of:",
          "options": [
            "Access only",
            "Quality of connection",
            "Hardware color",
            "Password strength"
          ],
          "correct_index": 1,
          "explanation": "Having a connection is not enough; poor quality (slow speed) still blocks effective use, a separate level of the divide."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which factor is NOT typically associated with the digital divide?",
          "options": [
            "Income",
            "Geography (rural vs. urban)",
            "A person's favorite programming language",
            "Education level"
          ],
          "correct_index": 2,
          "explanation": "The divide is driven by income, geography, age, and education — not personal taste in programming languages."
        },
        {
          "question": "Why is the digital divide an equity concern?",
          "options": [
            "It makes computers cheaper",
            "Lack of access blocks people from online education, jobs, and services",
            "It only affects programmers",
            "It guarantees equal outcomes"
          ],
          "correct_index": 1,
          "explanation": "As essential services move online, those without access lose opportunities, deepening existing inequality."
        }
      ],
      "challenge_title": "Connectivity Gap",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # Input: two integers, the percent of urban and rural households online.\n    # TODO: print the absolute gap between them.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    urban = int(data[0])\n    rural = int(data[1])\n    print(abs(urban - rural))\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "92 60",
          "expected_output": "32"
        },
        {
          "input": "50 50",
          "expected_output": "0"
        },
        {
          "input": "40 75",
          "expected_output": "35"
        }
      ]
    },
    {
      "id": "csp-ioc-l3",
      "project_id": "csp-ioc",
      "order": 3,
      "title": "Computing Bias",
      "explanation": "## Bias Lives in Computing Systems\n\nComputing innovations can reflect **existing human biases** because people build them and people supply their data. A biased system produces systematically unfair outcomes for some groups. The exam calls a key point out clearly: bias is **not always intentional** — it often slips in unnoticed.\n\n## Where Bias Enters\n\n- **Biased training data** — a hiring model trained mostly on resumes from one group learns to favor that group.\n- **Biased design choices** — deciding which features matter encodes the designer's assumptions.\n- **Biased use** — even a fair tool can be applied unfairly by its users.\n\n## Detecting Bias\n\nA common technique is comparing **outcome rates across groups**. If a fair process should approve people at similar rates, a large difference is a red flag worth investigating.\n\n```python\n# Compare approval rates by group\napproved = {\"A\": 30, \"B\": 10}\ntotal = {\"A\": 50, \"B\": 50}\nfor g in approved:\n    rate = approved[g] / total[g]\n    print(g, round(rate, 2))\n# A 0.6   B 0.2  -> a 3x gap signals possible bias\n```\n\n## Reducing Bias\n\n- Audit datasets for representation **before** training.\n- Test outputs across groups **after** deployment.\n- Include diverse perspectives on the design team.\n\nNote that detecting a gap is not proof of bias by itself — real differences can exist — but unexplained, large gaps demand scrutiny.\n\n## Key Takeaways\n\n- Bias can come from **data, design, or use**.\n- It is **frequently unintentional**, so creators must actively test for it.\n- Comparing outcome rates across groups is a practical detection tool.",
      "key_terms": [
        {
          "term": "Computing bias",
          "definition": "Systematic unfairness in a computing system, often arising from biased data, design, or use."
        },
        {
          "term": "Training data",
          "definition": "The examples used to build a model; if unrepresentative, it can encode bias."
        },
        {
          "term": "Bias audit",
          "definition": "Testing a system's outcomes across groups to detect unfair patterns."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A resume screener trained mostly on one group's hires now favors that group. The bias most directly came from:",
          "options": [
            "The screen resolution",
            "Biased training data",
            "Slow internet",
            "Strong passwords"
          ],
          "correct_index": 1,
          "explanation": "Unrepresentative training data taught the model to prefer the over-represented group."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which statement about computing bias is emphasized by the AP framework?",
          "options": [
            "Bias is always intentional",
            "Bias is frequently unintentional and slips in unnoticed",
            "Bias only affects games",
            "Bias cannot be measured"
          ],
          "correct_index": 1,
          "explanation": "The framework stresses that bias is often unintended, which is why active testing matters."
        },
        {
          "question": "A practical way to detect possible bias in a decision system is to:",
          "options": [
            "Compare outcome rates across groups",
            "Increase the font size",
            "Delete all logs",
            "Use a faster CPU"
          ],
          "correct_index": 0,
          "explanation": "Large, unexplained differences in approval or success rates across groups can signal bias."
        }
      ],
      "challenge_title": "Approval Rate Gap",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # Input: aApproved aTotal bApproved bTotal\n    # TODO: print 'biased' if the two approval rates differ by more than 0.20,\n    # otherwise print 'fair'.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    a_app, a_tot, b_app, b_tot = (int(x) for x in data[:4])\n    rate_a = a_app / a_tot\n    rate_b = b_app / b_tot\n    if abs(rate_a - rate_b) > 0.20:\n        print(\"biased\")\n    else:\n        print(\"fair\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "30 50 10 50",
          "expected_output": "biased"
        },
        {
          "input": "25 50 24 50",
          "expected_output": "fair"
        },
        {
          "input": "40 100 70 100",
          "expected_output": "biased"
        }
      ]
    },
    {
      "id": "csp-ioc-l4",
      "project_id": "csp-ioc",
      "order": 4,
      "title": "Crowdsourcing",
      "explanation": "## Harnessing the Crowd\n\n**Crowdsourcing** is the practice of obtaining input, ideas, content, or funding by enlisting the services of a large number of people, typically via the internet. The web makes it possible to coordinate contributions from strangers around the world at very low cost.\n\n## Why Crowdsourcing Works\n\n- **Scale** — thousands of small contributions add up to something no individual could build.\n- **Diversity** — many perspectives surface ideas an expert team would miss.\n- **Speed** — many people working in parallel solve problems quickly.\n\nClassic examples include collaborative encyclopedias, citizen-science projects that classify galaxies or count wildlife, **crowdfunding** platforms that raise money for projects, and product reviews that aggregate many opinions.\n\n## Strengths and Limits\n\nCrowdsourcing can democratize problem-solving, but quality control is a challenge: contributions vary in accuracy, and the crowd can be manipulated. Good systems combine crowd input with **review, voting, or reputation** to keep quality high.\n\n```python\n# Aggregate ratings from many contributors\nratings = [5, 4, 5, 3, 4, 5]\naverage = sum(ratings) / len(ratings)\nprint(round(average, 2))  # 4.33\n```\n\n## Key Takeaways\n\n- **Crowdsourcing** gathers contributions from many people, usually online.\n- It excels at **scale, diversity, and speed**.\n- **Crowdfunding** is crowdsourcing applied to money.\n- Aggregation and review keep crowd contributions trustworthy.\n\nOn the exam, recognize that the *internet* is what makes large-scale crowdsourcing feasible, and that it can produce both high-quality outcomes and low-quality noise.",
      "key_terms": [
        {
          "term": "Crowdsourcing",
          "definition": "Obtaining input or contributions from a large group of people, typically over the internet."
        },
        {
          "term": "Crowdfunding",
          "definition": "Raising money for a project by collecting small amounts from many people online."
        },
        {
          "term": "Aggregation",
          "definition": "Combining many contributions (e.g., averaging ratings) into a single result."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A platform raises $50,000 from 2,000 small donations to fund a game. This is an example of:",
          "options": [
            "A digital divide",
            "Crowdfunding",
            "Phishing",
            "A Creative Commons license"
          ],
          "correct_index": 1,
          "explanation": "Collecting small amounts from many people online to fund a project is crowdfunding, a form of crowdsourcing."
        }
      ],
      "quiz_questions": [
        {
          "question": "What makes large-scale crowdsourcing practical today?",
          "options": [
            "The internet connecting many contributors",
            "Faster printers",
            "Larger hard drives only",
            "Brighter monitors"
          ],
          "correct_index": 0,
          "explanation": "The internet lets large numbers of people contribute and coordinate cheaply and quickly."
        },
        {
          "question": "A drawback of crowdsourcing is that:",
          "options": [
            "It can never scale",
            "Contribution quality varies and the crowd can be manipulated",
            "It always costs millions",
            "It only works offline"
          ],
          "correct_index": 1,
          "explanation": "Crowd input varies in accuracy and can be gamed, so review and aggregation are needed."
        }
      ],
      "challenge_title": "Average the Crowd",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # First token N, then N integer ratings.\n    # TODO: print the average rounded to 2 decimal places.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    ratings = [int(x) for x in data[1:1+n]]\n    avg = sum(ratings) / n\n    print(round(avg, 2))\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "6\n5 4 5 3 4 5",
          "expected_output": "4.33"
        },
        {
          "input": "3\n1 2 3",
          "expected_output": "2.0"
        },
        {
          "input": "4\n5 5 5 5",
          "expected_output": "5.0"
        }
      ]
    },
    {
      "id": "csp-ioc-l5",
      "project_id": "csp-ioc",
      "order": 5,
      "title": "Legal and Ethical Concerns",
      "explanation": "## Legal vs. Ethical\n\nBig Idea 5 separates two ideas that often overlap but are not the same:\n\n- **Legal** concerns ask: *does this follow the law?* Laws govern hacking, data protection, copyright, and more.\n- **Ethical** concerns ask: *is this right, even if it is legal?* Something can be perfectly legal yet still harmful or unfair.\n\nThe exam wants you to weigh both. Collecting user data with a vague consent banner may be legal but still ethically questionable.\n\n## Common Concerns\n\n- **Privacy** — how much personal data should a company gather and keep?\n- **Surveillance** — monitoring can improve safety but erode freedom.\n- **Unauthorized access** — breaking into systems is both illegal and unethical.\n- **Plagiarism and copyright** — using others' work without permission.\n\n## Reasoning About Trade-offs\n\nEthical analysis often weighs benefits against harms across stakeholders. A simple model assigns scores and compares totals, but remember real ethics is richer than arithmetic.\n\n```python\n# Weigh benefit vs harm for a data-collection feature\nbenefit = 7   # better recommendations\nharm = 9      # privacy loss\nverdict = \"reconsider\" if harm > benefit else \"acceptable\"\nprint(verdict)  # reconsider\n```\n\n## Key Takeaways\n\n- **Legal** is about laws; **ethical** is about right and wrong — they can diverge.\n- Privacy, surveillance, unauthorized access, and plagiarism are recurring concerns.\n- Strong answers consider **multiple stakeholders** and weigh harms against benefits.\n\nWhen a free-response prompt asks about a concern, state whether it is legal, ethical, or both, and explain *who* is affected.",
      "key_terms": [
        {
          "term": "Legal concern",
          "definition": "An issue about whether a computing practice complies with the law."
        },
        {
          "term": "Ethical concern",
          "definition": "An issue about whether a practice is right or fair, independent of legality."
        },
        {
          "term": "Surveillance",
          "definition": "Monitoring of people's activity, which can aid safety but threaten privacy."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A company legally sells anonymized user data but never clearly told users. This is best described as:",
          "options": [
            "Illegal but ethical",
            "Legal but ethically questionable",
            "Both illegal and unethical",
            "Neither a concern"
          ],
          "correct_index": 1,
          "explanation": "It may comply with the law yet still be ethically problematic because users were not meaningfully informed."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which best captures the difference between legal and ethical concerns?",
          "options": [
            "They are identical",
            "Legal asks if it follows the law; ethical asks if it is right",
            "Ethical concerns are always illegal",
            "Legal concerns never involve data"
          ],
          "correct_index": 1,
          "explanation": "Legality is about the law; ethics is about right and wrong, and the two can diverge."
        },
        {
          "question": "Gaining access to a computer system without permission is:",
          "options": [
            "Only an ethical concern",
            "Both an ethical and a legal concern",
            "Encouraged by the framework",
            "A form of crowdsourcing"
          ],
          "correct_index": 1,
          "explanation": "Unauthorized access breaks the law and is widely considered unethical."
        }
      ],
      "challenge_title": "Benefit vs Harm Verdict",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # Input: two integers, benefit score and harm score.\n    # TODO: print 'reconsider' if harm > benefit, 'acceptable' if benefit > harm,\n    # else 'debate'.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    benefit = int(data[0])\n    harm = int(data[1])\n    if harm > benefit:\n        print(\"reconsider\")\n    elif benefit > harm:\n        print(\"acceptable\")\n    else:\n        print(\"debate\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "7 9",
          "expected_output": "reconsider"
        },
        {
          "input": "8 3",
          "expected_output": "acceptable"
        },
        {
          "input": "5 5",
          "expected_output": "debate"
        }
      ]
    },
    {
      "id": "csp-ioc-l6",
      "project_id": "csp-ioc",
      "order": 6,
      "title": "Intellectual Property",
      "explanation": "## Owning Ideas and Creations\n\n**Intellectual property (IP)** refers to creations of the mind — software, music, writing, designs — that are legally owned by their creators. Copyright automatically protects original works the moment they are fixed in a tangible form, and others generally need permission to copy or reuse them.\n\n## Licenses Grant Permission\n\nBecause asking each creator is impractical, **licenses** spell out how a work may be used in advance:\n\n- **Creative Commons (CC)** — a family of licenses letting creators allow reuse under conditions (attribution, non-commercial, share-alike).\n- **Open source** — software released with a license permitting others to view, modify, and share the code.\n- **Public domain** — works with no copyright, free for anyone to use.\n\n## Fair Use and Attribution\n\n**Fair use** allows limited use of copyrighted material without permission for purposes like commentary, education, or parody. Even when reuse is allowed, **attribution** (crediting the creator) is often required and is always good practice.\n\n```python\n# Decide if reuse is allowed based on a license tag\nlicense_tag = \"CC-BY\"          # requires attribution\nallowed = license_tag in (\"CC-BY\", \"CC-BY-SA\", \"public-domain\")\nprint(\"reuse allowed:\", allowed)  # True\n```\n\n## Key Takeaways\n\n- **Intellectual property** protects creators' original works, often by copyright.\n- **Licenses** (Creative Commons, open source) define permitted reuse in advance.\n- **Public domain** works are free to use; **fair use** permits limited unlicensed use.\n- Always provide **attribution** when reusing others' work.\n\nOn the exam, recognize that licenses *expand* what users may legally do with a work, and that respecting IP is both a legal and ethical obligation.",
      "key_terms": [
        {
          "term": "Intellectual property",
          "definition": "Creations of the mind, such as software or music, legally owned by their creators."
        },
        {
          "term": "Creative Commons",
          "definition": "A set of licenses letting creators permit reuse under stated conditions like attribution."
        },
        {
          "term": "Open source",
          "definition": "Software whose code is released under a license permitting viewing, modifying, and sharing."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A photo is marked 'public domain'. You may:",
          "options": [
            "Never use it",
            "Use it freely without permission",
            "Use it only after paying a license fee",
            "Use it only if you are the creator"
          ],
          "correct_index": 1,
          "explanation": "Public-domain works carry no copyright, so anyone may use them freely."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the purpose of a Creative Commons license?",
          "options": [
            "To delete a work",
            "To let creators specify how others may reuse their work",
            "To make all software illegal",
            "To hide a work permanently"
          ],
          "correct_index": 1,
          "explanation": "Creative Commons licenses grant reuse rights under conditions chosen by the creator."
        },
        {
          "question": "Fair use allows:",
          "options": [
            "Unlimited copying of any work",
            "Limited use of copyrighted material for purposes like education or commentary",
            "Selling others' work as your own",
            "Ignoring all copyright"
          ],
          "correct_index": 1,
          "explanation": "Fair use permits limited unlicensed use for specific purposes such as education, commentary, or parody."
        }
      ],
      "challenge_title": "License Checker",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    tag = sys.stdin.read().strip()\n    # The tag is a license string.\n    # TODO: print 'reuse allowed' if the tag is CC-BY, CC-BY-SA, or public-domain,\n    # otherwise print 'permission needed'.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    tag = sys.stdin.read().strip()\n    allowed = (\"CC-BY\", \"CC-BY-SA\", \"public-domain\")\n    if tag in allowed:\n        print(\"reuse allowed\")\n    else:\n        print(\"permission needed\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "CC-BY",
          "expected_output": "reuse allowed"
        },
        {
          "input": "all-rights-reserved",
          "expected_output": "permission needed"
        },
        {
          "input": "public-domain",
          "expected_output": "reuse allowed"
        }
      ]
    },
    {
      "id": "csp-ioc-l7",
      "project_id": "csp-ioc",
      "order": 7,
      "title": "Personally Identifiable Information",
      "explanation": "## What Counts as PII\n\n**Personally identifiable information (PII)** is data that can identify a specific individual, on its own or combined with other data. Examples include full name, address, Social Security number, phone number, email, biometric data, and location history. The AP framework stresses that PII can be exploited if it falls into the wrong hands.\n\n## How PII Spreads\n\n- **Directly** — you type it into forms and profiles.\n- **Indirectly** — apps collect device IDs, search history, and location in the background.\n- **By combination** — seemingly harmless data points can be **linked** to re-identify a person even after a name is removed.\n\nThat last point is crucial: removing an obvious identifier does not guarantee anonymity, because combinations of fields (ZIP code + birthdate + gender) can still pinpoint someone.\n\n## Risks and Protections\n\nLeaked PII enables identity theft, stalking, and targeted scams. Sensible protections include sharing the **minimum necessary** data, using privacy settings, and being skeptical of apps that request more than they need.\n\n```python\n# Flag fields that are PII\nfields = [\"name\", \"favorite_color\", \"ssn\", \"email\"]\npii = {\"name\", \"ssn\", \"email\", \"address\", \"phone\"}\nflagged = [f for f in fields if f in pii]\nprint(flagged)  # ['name', 'ssn', 'email']\n```\n\n## Key Takeaways\n\n- **PII** is any data that can identify an individual, alone or combined.\n- Data can be collected **directly, indirectly, or by combination**.\n- Removing a name is **not** the same as true anonymity.\n- Minimize what you share and guard sensitive fields like SSN and location.",
      "key_terms": [
        {
          "term": "Personally identifiable information",
          "definition": "Data that can identify a specific individual on its own or combined with other data."
        },
        {
          "term": "Re-identification",
          "definition": "Linking 'anonymized' data back to a person using combinations of fields."
        },
        {
          "term": "Data minimization",
          "definition": "Sharing or collecting only the data actually needed for a purpose."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A dataset removes names but keeps ZIP code, birthdate, and gender. Why is this still risky?",
          "options": [
            "Those fields are encrypted",
            "The combination can re-identify individuals",
            "ZIP codes are never personal",
            "Birthdates are random"
          ],
          "correct_index": 1,
          "explanation": "Combinations of quasi-identifiers can pinpoint a person even without a name, enabling re-identification."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which of the following is PII?",
          "options": [
            "A Social Security number",
            "The current weather",
            "The number 42",
            "A public stock price"
          ],
          "correct_index": 0,
          "explanation": "An SSN uniquely identifies an individual and is classic PII; the others identify no one."
        },
        {
          "question": "A good practice for protecting PII is to:",
          "options": [
            "Share as much data as possible",
            "Share only the minimum data necessary",
            "Post your address publicly",
            "Reuse one password everywhere"
          ],
          "correct_index": 1,
          "explanation": "Data minimization reduces exposure: share only what a service truly needs."
        }
      ],
      "challenge_title": "PII Filter",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # First token N, then N field names.\n    # PII fields are: name, ssn, email, address, phone.\n    # TODO: print how many of the given fields are PII.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    fields = data[1:1+n]\n    pii = {\"name\", \"ssn\", \"email\", \"address\", \"phone\"}\n    count = sum(1 for f in fields if f in pii)\n    print(count)\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "4\nname favorite_color ssn email",
          "expected_output": "3"
        },
        {
          "input": "3\nweather score temperature",
          "expected_output": "0"
        },
        {
          "input": "5\nphone address name email ssn",
          "expected_output": "5"
        }
      ]
    },
    {
      "id": "csp-ioc-l8",
      "project_id": "csp-ioc",
      "order": 8,
      "title": "Safe Computing",
      "explanation": "## Defending Your Data\n\n**Safe computing** is the set of habits and tools that protect data and systems from misuse. It ties together everything in Big Idea 5: protecting PII, respecting IP, and avoiding harmful effects all depend on safe practices.\n\n## Core Threats\n\n- **Phishing** — fraudulent messages that trick you into revealing credentials or clicking malware.\n- **Malware** — malicious software (viruses, ransomware) that damages or hijacks systems.\n- **Keylogging and weak passwords** — attackers capture or guess credentials.\n- **Unencrypted data** — information sent in plain text can be intercepted.\n\n## Core Defenses\n\n- **Strong, unique passwords** plus **multi-factor authentication (MFA)** — even a stolen password is not enough.\n- **Encryption** — scrambling data so only authorized parties can read it, both in transit (HTTPS) and at rest.\n- **Software updates** that patch known vulnerabilities.\n- **Skepticism** toward unexpected links and permission requests.\n\nThe exam treats security as a *trade-off*: stronger protection often costs convenience, and no system is perfectly secure.\n\n```python\n# Rate password strength by simple rules\npw = \"Sky7!cloud\"\nscore = 0\nif len(pw) >= 8: score += 1\nif any(c.isdigit() for c in pw): score += 1\nif any(not c.isalnum() for c in pw): score += 1\nprint(score)  # 3 -> strong\n```\n\n## Key Takeaways\n\n- **Safe computing** protects data through habits and tools.\n- Threats include **phishing, malware, and weak credentials**.\n- Defenses include **strong passwords, MFA, encryption, and updates**.\n- Security is a trade-off; no system is perfectly secure, so layered defenses matter.\n\nThis lesson closes Big Idea 5: combine awareness of effects, access, bias, ethics, IP, and PII with concrete safe-computing habits.",
      "key_terms": [
        {
          "term": "Phishing",
          "definition": "Fraudulent messages designed to trick users into revealing credentials or installing malware."
        },
        {
          "term": "Multi-factor authentication",
          "definition": "Requiring more than one proof of identity, so a stolen password alone is not enough."
        },
        {
          "term": "Encryption",
          "definition": "Scrambling data so only authorized parties holding a key can read it."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does multi-factor authentication improve security?",
          "options": [
            "It makes passwords shorter",
            "A stolen password alone is not enough to log in",
            "It removes the need for any password",
            "It encrypts the whole internet"
          ],
          "correct_index": 1,
          "explanation": "MFA adds a second factor, so an attacker who steals only the password still cannot access the account."
        }
      ],
      "quiz_questions": [
        {
          "question": "An email claims to be your bank and asks you to 'confirm your password' via a link. This is most likely:",
          "options": [
            "Encryption",
            "Phishing",
            "A Creative Commons license",
            "Crowdsourcing"
          ],
          "correct_index": 1,
          "explanation": "Fraudulent messages that lure you into revealing credentials are phishing attacks."
        },
        {
          "question": "Which is a sound safe-computing practice?",
          "options": [
            "Reusing one simple password everywhere",
            "Using strong unique passwords plus MFA",
            "Disabling all software updates",
            "Emailing your SSN to strangers"
          ],
          "correct_index": 1,
          "explanation": "Strong unique passwords combined with multi-factor authentication greatly reduce account compromise."
        }
      ],
      "challenge_title": "Password Strength Meter",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\n\ndef main():\n    pw = sys.stdin.readline().rstrip(\"\\n\")\n    # Score 1 point each: length >= 8, contains a digit, contains a symbol (non-alphanumeric).\n    # TODO: print 'strong' if score == 3, 'medium' if score == 2, else 'weak'.\n    pass\n\nmain()",
      "challenge_solution_code": "import sys\n\ndef main():\n    pw = sys.stdin.readline().rstrip(\"\\n\")\n    score = 0\n    if len(pw) >= 8:\n        score += 1\n    if any(c.isdigit() for c in pw):\n        score += 1\n    if any(not c.isalnum() for c in pw):\n        score += 1\n    if score == 3:\n        print(\"strong\")\n    elif score == 2:\n        print(\"medium\")\n    else:\n        print(\"weak\")\n\nmain()",
      "challenge_test_cases": [
        {
          "input": "Sky7!cloud",
          "expected_output": "strong"
        },
        {
          "input": "skycloud9",
          "expected_output": "medium"
        },
        {
          "input": "cat",
          "expected_output": "weak"
        }
      ]
    }
  ]
}
