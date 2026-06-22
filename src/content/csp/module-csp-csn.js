// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-csn",
    "title": "Computer Systems & Networks",
    "description": "Explore how the internet moves data through packets and routing, why networks tolerate faults, and how parallel and distributed computing speeds up work.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 105,
    "track": "apcsp",
    "unit": "Big Idea 4 — Computer Systems & Networks",
    "tags": [
      "the internet",
      "packets/routing",
      "parallel & distributed computing"
    ]
  },
  "lessons": [
    {
      "id": "csp-csn-l1",
      "project_id": "csp-csn",
      "order": 1,
      "title": "The Internet and How Data Travels",
      "explanation": "## What Is the Internet?\n\nThe **internet** is a global network of networks. No single computer or company controls it. Instead, billions of devices connect through shared agreements called **protocols** that let very different machines understand each other.\n\n## Addresses and the Domain Name System\n\nEvery device on the internet has an **IP address** (Internet Protocol address), a numeric label that identifies it. The most common form, **IPv4**, looks like `192.168.1.1`: four numbers (each 0-255) separated by dots. Because there are only about 4.3 billion IPv4 addresses, the newer **IPv6** uses much longer addresses to support far more devices.\n\nHumans prefer names like `codeflow.app`, so the **Domain Name System (DNS)** acts like a phone book, translating names into IP addresses.\n\n## Protocols Make It Work\n\nProtocols are agreed-upon rules for communication. Key examples:\n\n- **IP** routes data to the right address.\n- **TCP** (Transmission Control Protocol) ensures data arrives complete and in order.\n- **HTTP/HTTPS** define how web pages are requested and sent.\n\nBecause these protocols are **open standards**, anyone can build a device or app that joins the network. This openness is why the internet is **scalable**: it grows without redesign.\n\n## Checking an IPv4 Address\n\nA valid IPv4 address has exactly four parts, each an integer from 0 to 255. Here is how you might validate one part in Python:\n\n```python\ndef valid_part(part):\n    if not part.isdigit():\n        return False\n    n = int(part)\n    return 0 <= n <= 255\n\nprint(valid_part(\"200\"))  # True\nprint(valid_part(\"999\"))  # False\n```\n\n## Why This Matters\n\nThe internet's design separates **addressing** (where data goes) from **content** (what the data is). This layered approach means a photo, a video call, and a web page can all travel over the same wires using the same addressing rules. Understanding addresses and protocols is the foundation for everything else in networking.",
      "key_terms": [
        {
          "term": "IP address",
          "definition": "A numeric label that uniquely identifies a device on a network, such as 192.168.1.1 in IPv4."
        },
        {
          "term": "Protocol",
          "definition": "An agreed-upon set of rules that lets different devices communicate, like TCP, IP, or HTTP."
        },
        {
          "term": "DNS",
          "definition": "The Domain Name System, which translates human-readable names like example.com into numeric IP addresses."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does DNS do?",
          "options": [
            "Encrypts web traffic",
            "Translates domain names into IP addresses",
            "Splits data into packets",
            "Assigns each device a MAC address"
          ],
          "correct_index": 1,
          "explanation": "DNS works like a phone book, converting human-friendly names such as codeflow.app into the numeric IP addresses computers use to route data."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is the internet considered scalable?",
          "options": [
            "A central server controls all traffic",
            "It uses open standard protocols that let new devices join without redesigning the network",
            "Every device shares one IP address",
            "It only supports a fixed number of computers"
          ],
          "correct_index": 1,
          "explanation": "Open standards mean any compliant device can join, so the network grows without being redesigned."
        },
        {
          "question": "Which protocol is responsible for ensuring data arrives complete and in order?",
          "options": [
            "IP",
            "DNS",
            "TCP",
            "HTML"
          ],
          "correct_index": 2,
          "explanation": "TCP (Transmission Control Protocol) guarantees reliable, ordered delivery, while IP only handles addressing and routing."
        }
      ],
      "challenge_title": "Validate an IPv4 Address",
      "challenge_language": "python",
      "challenge_starter_code": "# Read one IPv4 address from input, e.g. 192.168.1.1\n# Print \"valid\" if it is a correct IPv4 address, otherwise \"invalid\".\n# Rules: exactly 4 parts, each an integer 0-255, no leading zeros (except \"0\" itself).\n\naddr = input()\n# TODO: split on '.' and check each part\n",
      "challenge_solution_code": "ip = input().split('.')\nvalid = len(ip) == 4\nif valid:\n    for part in ip:\n        if not part.isdigit():\n            valid = False\n            break\n        n = int(part)\n        if n < 0 or n > 255:\n            valid = False\n            break\n        if len(part) > 1 and part[0] == '0':\n            valid = False\n            break\nprint(\"valid\" if valid else \"invalid\")",
      "challenge_test_cases": [
        {
          "input": "192.168.1.1",
          "expected_output": "valid"
        },
        {
          "input": "256.1.1.1",
          "expected_output": "invalid"
        },
        {
          "input": "10.0.0",
          "expected_output": "invalid"
        }
      ]
    },
    {
      "id": "csp-csn-l2",
      "project_id": "csp-csn",
      "order": 2,
      "title": "Packets, Routing, and Fault Tolerance",
      "explanation": "## Breaking Data into Packets\n\nWhen you send a file over the internet, it is not sent as one big chunk. It is split into small pieces called **packets**. Each packet carries:\n\n- A piece of the **data** (the payload)\n- The **destination** address\n- A **sequence number** so the pieces can be reassembled in order\n\nThis is called **packet switching**. Packets from the same message can take different paths across the network and still arrive correctly.\n\n## Routing\n\n**Routing** is the process of choosing a path for each packet from sender to receiver. Special devices called **routers** read each packet's destination and forward it toward its goal, one hop at a time. There is no fixed circuit reserved in advance; routers make decisions dynamically based on current network conditions.\n\n## Why Packets Can Arrive Out of Order\n\nBecause packets travel independently, packet 5 might arrive before packet 3. The receiving computer uses the **sequence numbers** to reassemble them correctly. If a packet is lost, **TCP** requests that it be resent.\n\n## Fault Tolerance and Redundancy\n\nA system is **fault-tolerant** if it keeps working even when parts fail. The internet achieves this through **redundancy**: multiple paths connect most points. If one router or cable goes down, packets are **rerouted** along another path.\n\n```python\n# Reassemble packets given (sequence_number, data) pairs\npackets = [(2, \"world\"), (0, \"hello\"), (1, \"brave\")]\npackets.sort(key=lambda p: p[0])\nmessage = \" \".join(data for _, data in packets)\nprint(message)  # hello brave world\n```\n\n## The Big Picture\n\n- **Packet switching** uses the network efficiently because many messages share the same links.\n- **Redundant routing** means no single failure breaks the whole internet.\n- **Sequence numbers** let the receiver rebuild the original message even when packets arrive scrambled.\n\nThis combination of splitting, independent routing, and reassembly is what makes the internet both fast and reliable.",
      "key_terms": [
        {
          "term": "Packet",
          "definition": "A small unit of data containing a payload, a destination address, and a sequence number used for reassembly."
        },
        {
          "term": "Routing",
          "definition": "The process by which routers choose a path for each packet from sender to receiver, hop by hop."
        },
        {
          "term": "Fault tolerance",
          "definition": "A system's ability to keep functioning even when some components fail, often achieved through redundant paths."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does each packet include a sequence number?",
          "options": [
            "To encrypt the data",
            "So the receiver can reassemble packets in the correct order",
            "To choose the fastest router",
            "To compress the payload"
          ],
          "correct_index": 1,
          "explanation": "Packets can arrive out of order because they travel independently; sequence numbers let the receiver put them back in the right order."
        }
      ],
      "quiz_questions": [
        {
          "question": "What makes the internet fault-tolerant?",
          "options": [
            "A single powerful central router",
            "Redundant paths that allow packets to be rerouted when a component fails",
            "Sending all data in one large packet",
            "Using only one fixed path per message"
          ],
          "correct_index": 1,
          "explanation": "Redundancy provides multiple paths, so if one router or cable fails, packets can be rerouted and communication continues."
        },
        {
          "question": "In packet switching, packets from the same message...",
          "options": [
            "Always take the exact same path",
            "May take different paths and arrive out of order",
            "Are never lost",
            "Must be sent one at a time"
          ],
          "correct_index": 1,
          "explanation": "Packets are routed independently, so they may follow different paths and arrive out of order, then be reassembled by sequence number."
        }
      ],
      "challenge_title": "Reassemble Out-of-Order Packets",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: n, the number of packets.\n# Second line: n sequence numbers (0..n-1) in the order they arrived.\n# Print the sequence numbers reordered from smallest to largest, space-separated.\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\n# TODO: read the next n numbers and sort them by sequence number\n",
      "challenge_solution_code": "import sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = data[1:1+n]\nnums.sort(key=lambda x: int(x))\nprint(' '.join(nums))",
      "challenge_test_cases": [
        {
          "input": "3\n2 0 1",
          "expected_output": "0 1 2"
        },
        {
          "input": "5\n4 3 2 1 0",
          "expected_output": "0 1 2 3 4"
        },
        {
          "input": "1\n0",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-csn-l3",
      "project_id": "csp-csn",
      "order": 3,
      "title": "Parallel and Distributed Computing",
      "explanation": "## Doing Work at the Same Time\n\nMost early programs ran **sequentially**: one step finished before the next began. Modern systems often run work **in parallel** to go faster.\n\n- **Parallel computing** uses multiple processors (or cores) on a single machine, each handling part of a problem at the same time.\n- **Distributed computing** spreads work across many separate computers connected by a network, such as a data center or the global volunteers of a research project.\n\n## Speedup\n\nThe benefit of parallelism is measured by **speedup**:\n\n```\nspeedup = sequential_time / parallel_time\n```\n\nIf a task takes 60 seconds on one processor and 20 seconds split across processors, the speedup is 3.\n\n## Why Speedup Is Limited\n\nYou cannot always cut time perfectly. Some parts of a program **must** run in order (you cannot frost a cake before baking it). The portion that can be parallelized determines the maximum gain. This idea is the heart of **Amdahl's reasoning**: the sequential part sets a floor on how fast the whole job can finish.\n\nAlso, splitting and combining work has **overhead**, and if tasks are unevenly sized, one slow worker holds everyone up. Good systems try to **balance the load** evenly.\n\n```python\n# Distribute tasks to workers, always picking the least-loaded worker\ntimes = [5, 2, 1]\nworkers = [0, 0]  # two workers, each starts at 0\nfor t in sorted(times, reverse=True):\n    i = workers.index(min(workers))\n    workers[i] += t\nprint(\"sequential:\", sum(times))   # 8\nprint(\"parallel:\", max(workers))   # 5\n```\n\n## Key Takeaways\n\n- **Parallel** = many cores, one machine; **distributed** = many machines, networked.\n- **Speedup** compares sequential time to parallel time.\n- Parallel time equals the load of the **busiest** worker, not the average.\n- Real speedup is limited by sequential portions and coordination overhead.\n\nUnderstanding these limits helps you decide when adding more processors actually helps and when it just adds complexity.",
      "key_terms": [
        {
          "term": "Parallel computing",
          "definition": "Running multiple parts of a computation at the same time, typically on several cores of one machine."
        },
        {
          "term": "Distributed computing",
          "definition": "Spreading a computation across many separate networked computers that work together."
        },
        {
          "term": "Speedup",
          "definition": "The ratio of sequential execution time to parallel execution time, measuring how much faster parallel work is."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A job takes 40 seconds sequentially and 10 seconds in parallel. What is the speedup?",
          "options": [
            "0.25",
            "4",
            "30",
            "50"
          ],
          "correct_index": 1,
          "explanation": "Speedup = sequential_time / parallel_time = 40 / 10 = 4."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the main difference between parallel and distributed computing?",
          "options": [
            "Parallel uses the internet; distributed uses one core",
            "Parallel uses multiple cores on one machine; distributed uses many networked machines",
            "They are the same thing",
            "Distributed computing cannot fail"
          ],
          "correct_index": 1,
          "explanation": "Parallel computing splits work across cores of a single machine, while distributed computing spreads work across many separate computers connected by a network."
        },
        {
          "question": "Why can't adding more processors always make a program proportionally faster?",
          "options": [
            "Processors get slower in groups",
            "Some parts must run sequentially and coordination adds overhead",
            "Speedup is always exactly 1",
            "Networks never lose packets"
          ],
          "correct_index": 1,
          "explanation": "Sequential portions and the overhead of splitting and combining work limit the achievable speedup, so doubling processors rarely halves the time."
        }
      ],
      "challenge_title": "Compute Sequential vs Parallel Time",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: n, the number of tasks.\n# Second line: n task durations (integers).\n# Third line: k, the number of workers.\n# Assign each task (largest first) to the currently least-loaded worker.\n# Print two integers separated by a space: sequential_time parallel_time\n#   sequential_time = sum of all durations\n#   parallel_time   = load of the busiest worker\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\n# TODO: parse durations and k, then balance the load\n",
      "challenge_solution_code": "import sys\ndata = sys.stdin.read().split()\nn = int(data[0])\ntimes = list(map(int, data[1:1+n]))\nk = int(data[1+n])\nloads = [0]*k\nfor t in sorted(times, reverse=True):\n    idx = loads.index(min(loads))\n    loads[idx] += t\nseq = sum(times)\npar = max(loads)\nprint(seq, par)",
      "challenge_test_cases": [
        {
          "input": "4\n3 3 3 3\n2",
          "expected_output": "12 6"
        },
        {
          "input": "3\n5 2 1\n2",
          "expected_output": "8 5"
        },
        {
          "input": "5\n10 10 10 10 10\n5",
          "expected_output": "50 10"
        }
      ]
    }
  ]
}
