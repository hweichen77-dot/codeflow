// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-csn",
    "title": "Computer Systems & Networks",
    "description": "Trace how the internet moves data through packets, routing, and protocols, why redundancy makes it fault tolerant, and how parallel and distributed computing speed up work.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 105,
    "track": "apcsp",
    "unit": "Big Idea 4 — Computer Systems & Networks",
    "tags": [
      "the internet",
      "packets & routing",
      "parallel computing"
    ]
  },
  "lessons": [
    {
      "id": "csp-csn-l1",
      "project_id": "csp-csn",
      "order": 1,
      "title": "The Internet and IP Addresses",
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
          "question": "Why was IPv6 created?",
          "options": [
            "IPv4 was too fast",
            "IPv4 has only about 4.3 billion addresses, which is not enough for all devices",
            "IPv6 removes the need for DNS",
            "IPv6 makes web pages render faster"
          ],
          "correct_index": 1,
          "explanation": "IPv4's address space (about 4.3 billion) is too small for the number of internet devices, so IPv6 uses far longer addresses to provide many more."
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
      "title": "Packets and Reassembly",
      "explanation": "## Breaking Data into Packets\n\nWhen you send a file over the internet, it is not sent as one big chunk. It is split into small pieces called **packets**. Each packet carries:\n\n- A piece of the **data** (the payload)\n- The **destination** address\n- A **sequence number** so the pieces can be reassembled in order\n\nThis is called **packet switching**. Packets from the same message can take different paths across the network and still arrive correctly.\n\n## Why Packets Can Arrive Out of Order\n\nBecause packets travel independently, packet 5 might arrive before packet 3. The receiving computer uses the **sequence numbers** to reassemble them correctly. If a packet is lost, the protocol can request that it be resent.\n\n## Reassembling a Message\n\nThe receiver collects all packets, sorts them by sequence number, then joins their payloads back into the original message:\n\n```python\n# Reassemble packets given (sequence_number, data) pairs\npackets = [(2, \"world\"), (0, \"hello\"), (1, \"brave\")]\npackets.sort(key=lambda p: p[0])\nmessage = \" \".join(data for _, data in packets)\nprint(message)  # hello brave world\n```\n\n## Why Packet Switching Is Efficient\n\n- **Sharing**: many messages share the same links instead of reserving a private circuit.\n- **Resilience**: if one path is congested, individual packets can take another route.\n- **Granularity**: only the lost packets must be resent, not the whole file.\n\n## The Big Picture\n\nSplitting data into independently addressed packets is the core idea that makes the internet flexible. The sender labels each piece, the network delivers them by any available path, and the receiver puts them back together using the **sequence numbers**. This is the building block we will route, protect, and speed up in later lessons.",
      "key_terms": [
        {
          "term": "Packet",
          "definition": "A small unit of data containing a payload, a destination address, and a sequence number used for reassembly."
        },
        {
          "term": "Packet switching",
          "definition": "Sending data as independent packets that may travel different paths and are reassembled at the destination."
        },
        {
          "term": "Sequence number",
          "definition": "A label on each packet that tells the receiver the correct order in which to reassemble the message."
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
          "question": "In packet switching, packets from the same message...",
          "options": [
            "Always take the exact same path",
            "May take different paths and arrive out of order",
            "Are never lost",
            "Must be sent one at a time"
          ],
          "correct_index": 1,
          "explanation": "Packets are routed independently, so they may follow different paths and arrive out of order, then be reassembled by sequence number."
        },
        {
          "question": "If a single packet is lost during transfer, what usually happens?",
          "options": [
            "The entire file must be resent from the start",
            "Only the missing packet is requested again",
            "The message is delivered with a gap",
            "The connection is permanently dropped"
          ],
          "correct_index": 1,
          "explanation": "Packet switching lets the receiver request only the lost packet to be resent, rather than retransmitting the whole message."
        }
      ],
      "challenge_title": "Reassemble a Packetized Message",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: n, the number of packets.\n# Next n lines: each is \"<seq> <word>\" where seq is the sequence number.\n# Print the words joined by single spaces in order of sequence number.\n\nimport sys\ndata = sys.stdin.read().split('\\n')\nn = int(data[0])\n# TODO: parse each packet, sort by sequence number, join the words\n",
      "challenge_solution_code": "import sys\ndata = sys.stdin.read().split('\\n')\nn = int(data[0])\npairs = []\nfor i in range(1, 1 + n):\n    parts = data[i].split()\n    pairs.append((int(parts[0]), parts[1]))\npairs.sort()\nprint(' '.join(w for _, w in pairs))",
      "challenge_test_cases": [
        {
          "input": "3\n2 world\n0 hello\n1 brave",
          "expected_output": "hello brave world"
        },
        {
          "input": "2\n1 there\n0 hi",
          "expected_output": "hi there"
        },
        {
          "input": "1\n0 only",
          "expected_output": "only"
        }
      ]
    },
    {
      "id": "csp-csn-l3",
      "project_id": "csp-csn",
      "order": 3,
      "title": "Routing: Finding a Path",
      "explanation": "## What Is Routing?\n\n**Routing** is the process of choosing a path for each packet from sender to receiver. Special devices called **routers** read each packet's destination and forward it toward its goal, one **hop** at a time. There is no fixed circuit reserved in advance; routers make decisions dynamically based on the current network.\n\n## The Network as a Graph\n\nWe can model a network as a **graph**: each router is a **node** and each direct link is an **edge**. Finding a route then becomes finding a path between two nodes. The number of links a packet crosses is the **hop count**.\n\n## Breadth-First Search Finds the Fewest Hops\n\nTo find the route with the **fewest hops**, we explore the network level by level using **breadth-first search (BFS)**. BFS visits all nodes one hop away, then two hops away, and so on, so the first time it reaches the destination it has used the shortest path.\n\n```python\nfrom collections import deque, defaultdict\n\nadj = defaultdict(list)\nfor a, b in [(\"A\", \"B\"), (\"B\", \"C\"), (\"A\", \"C\")]:\n    adj[a].append(b)\n    adj[b].append(a)\n\ndist = {\"A\": 0}\nq = deque([\"A\"])\nwhile q:\n    u = q.popleft()\n    for v in adj[u]:\n        if v not in dist:\n            dist[v] = dist[u] + 1\n            q.append(v)\nprint(dist[\"C\"])  # 1 (direct link A-C)\n```\n\n## Why Hop Count Matters\n\n- Fewer hops usually means **lower latency**, because each router adds a small processing delay.\n- Routers exchange information so each can pick a good **next hop** without knowing the whole network.\n- If the shortest path is congested or down, routing can shift packets onto another path.\n\nRouting is what turns a pile of independent links into a working delivery system: given any source and destination, the network can compute a path. In the next lesson we see what happens when part of that path fails.",
      "key_terms": [
        {
          "term": "Router",
          "definition": "A device that reads a packet's destination and forwards it one hop closer toward its target."
        },
        {
          "term": "Hop count",
          "definition": "The number of links (edges) a packet crosses on its path from source to destination."
        },
        {
          "term": "Breadth-first search",
          "definition": "An algorithm that explores a network level by level, finding the path with the fewest hops first."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does breadth-first search find the route with the fewest hops?",
          "options": [
            "It always picks the lowest-numbered node",
            "It explores nodes in order of increasing distance, so it reaches the destination via the shortest path first",
            "It encrypts each packet",
            "It removes failed routers"
          ],
          "correct_index": 1,
          "explanation": "BFS visits all one-hop nodes, then all two-hop nodes, and so on, so the first time it reaches a node it has used the minimum number of hops."
        }
      ],
      "quiz_questions": [
        {
          "question": "How does a router decide where to send a packet?",
          "options": [
            "It reserves a fixed circuit before sending anything",
            "It reads the destination and forwards the packet to the next hop toward it",
            "It stores the whole file and sends it as one piece",
            "It picks a random neighbor every time"
          ],
          "correct_index": 1,
          "explanation": "Routers forward packets hop by hop based on the destination address, choosing a next hop that moves the packet toward its target."
        },
        {
          "question": "Modeling a network as a graph, what do nodes and edges represent?",
          "options": [
            "Nodes are packets and edges are sequence numbers",
            "Nodes are routers/devices and edges are direct links between them",
            "Nodes are protocols and edges are IP addresses",
            "Nodes are files and edges are passwords"
          ],
          "correct_index": 1,
          "explanation": "In the graph model, each node is a router or device and each edge is a direct communication link, so routing becomes finding a path between nodes."
        }
      ],
      "challenge_title": "Shortest Hop Count",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: n m  (number of nodes and number of links).\n# Next m lines: each is \"<a> <b>\", an undirected link between routers a and b.\n# Last line: \"<src> <dst>\".\n# Print the fewest number of hops from src to dst, or -1 if unreachable.\n\nimport sys\ndata = sys.stdin.read().split('\\n')\nn, m = map(int, data[0].split())\n# TODO: build the graph and run BFS from src\n",
      "challenge_solution_code": "import sys\nfrom collections import deque, defaultdict\ndata = sys.stdin.read().split('\\n')\nn, m = map(int, data[0].split())\nadj = defaultdict(list)\nfor i in range(1, 1 + m):\n    a, b = data[i].split()\n    adj[a].append(b)\n    adj[b].append(a)\nsrc, dst = data[1 + m].split()\ndist = {src: 0}\nq = deque([src])\nwhile q:\n    u = q.popleft()\n    for v in adj[u]:\n        if v not in dist:\n            dist[v] = dist[u] + 1\n            q.append(v)\nprint(dist.get(dst, -1))",
      "challenge_test_cases": [
        {
          "input": "3 2\nA B\nB C\nA C",
          "expected_output": "2"
        },
        {
          "input": "4 4\nA B\nB D\nA C\nC D\nA D",
          "expected_output": "2"
        },
        {
          "input": "2 0\nA B",
          "expected_output": "-1"
        }
      ]
    },
    {
      "id": "csp-csn-l4",
      "project_id": "csp-csn",
      "order": 4,
      "title": "Redundancy and Fault Tolerance",
      "explanation": "## Keeping Working When Things Break\n\nA system is **fault-tolerant** if it keeps working even when some parts fail. The internet is built to survive failures of cables, routers, and even whole data centers. The key technique is **redundancy**: providing more than one way to reach a destination.\n\n## Redundant Paths\n\nIf there is only a single path between two points, then one broken link cuts them off. When the network has **multiple independent paths**, a failure on one path can be bypassed by **rerouting** packets along another. The more redundant the connections, the harder it is to disconnect any two points.\n\n## Testing Tolerance by Removing a Node\n\nA simple way to reason about fault tolerance is to ask: *if this router fails, can the source still reach the destination?* We remove the failed node from the graph and check whether a path still exists.\n\n```python\nfrom collections import deque, defaultdict\n\nadj = defaultdict(list)\nfor a, b in [(\"A\", \"B\"), (\"B\", \"C\"), (\"A\", \"C\")]:\n    adj[a].append(b)\n    adj[b].append(a)\n\nfailed = \"B\"\nseen = {\"A\"}\nq = deque([\"A\"])\nwhile q:\n    u = q.popleft()\n    for v in adj[u]:\n        if v != failed and v not in seen:\n            seen.add(v)\n            q.append(v)\nprint(\"C\" in seen)  # True: A-C link survives losing B\n```\n\n## Redundancy Is a Trade-Off\n\n- More paths mean **higher reliability** but also more cables and equipment to maintain.\n- Redundancy applies beyond links: servers, copies of data, and power supplies are often duplicated.\n- A network with no redundancy has **single points of failure**, where one outage breaks everything.\n\n## The Big Picture\n\nFault tolerance is not about preventing every failure; it is about ensuring the system **degrades gracefully**. By building redundant paths and components, the internet stays usable even as individual parts fail, which is exactly why it has scaled to global size without a central controller.",
      "key_terms": [
        {
          "term": "Redundancy",
          "definition": "Providing duplicate paths or components so the system has a backup if one fails."
        },
        {
          "term": "Fault tolerance",
          "definition": "A system's ability to keep functioning even when some of its components fail."
        },
        {
          "term": "Single point of failure",
          "definition": "A component whose failure alone breaks the whole system because there is no backup path."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How does redundancy improve fault tolerance?",
          "options": [
            "It encrypts the data more strongly",
            "It provides alternate paths so packets can be rerouted when a component fails",
            "It reduces the number of routers needed",
            "It makes every packet take the same path"
          ],
          "correct_index": 1,
          "explanation": "Redundancy supplies multiple independent paths, so a failure on one path can be bypassed by rerouting along another."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is a single point of failure?",
          "options": [
            "A router that has redundant backups",
            "A component whose failure alone disconnects the system because no alternate path exists",
            "A packet that arrives out of order",
            "An IP address shared by two devices"
          ],
          "correct_index": 1,
          "explanation": "A single point of failure has no redundancy, so its failure breaks communication entirely."
        },
        {
          "question": "Why might a network designer NOT make every connection fully redundant?",
          "options": [
            "Redundancy makes packets arrive out of order",
            "Extra paths and equipment add cost and maintenance, so redundancy is a trade-off",
            "Redundancy is illegal on the internet",
            "Redundancy slows DNS lookups"
          ],
          "correct_index": 1,
          "explanation": "Redundancy improves reliability but requires more cables, hardware, and upkeep, so designers balance reliability against cost."
        }
      ],
      "challenge_title": "Survive a Router Failure",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: n m  (number of nodes and number of links).\n# Next m lines: each is \"<a> <b>\", an undirected link.\n# Last line: \"<src> <dst> <failed>\" — the failed router is removed.\n# Print \"reachable\" if src can still reach dst without using the failed node,\n# otherwise print \"unreachable\". (If src or dst is the failed node, print \"unreachable\".)\n\nimport sys\ndata = sys.stdin.read().split('\\n')\nn, m = map(int, data[0].split())\n# TODO: build the graph, remove the failed node, and run BFS\n",
      "challenge_solution_code": "import sys\nfrom collections import deque, defaultdict\ndata = sys.stdin.read().split('\\n')\nn, m = map(int, data[0].split())\nadj = defaultdict(list)\nfor i in range(1, 1 + m):\n    a, b = data[i].split()\n    adj[a].append(b)\n    adj[b].append(a)\nsrc, dst, failed = data[1 + m].split()\nif src == failed or dst == failed:\n    print(\"unreachable\")\nelse:\n    seen = {src}\n    q = deque([src])\n    while q:\n        u = q.popleft()\n        for v in adj[u]:\n            if v != failed and v not in seen:\n                seen.add(v)\n                q.append(v)\n    print(\"reachable\" if dst in seen else \"unreachable\")",
      "challenge_test_cases": [
        {
          "input": "3 3\nA B\nB C\nA C\nA C B",
          "expected_output": "reachable"
        },
        {
          "input": "3 2\nA B\nB C\nA C B",
          "expected_output": "unreachable"
        },
        {
          "input": "2 1\nA B\nA B X",
          "expected_output": "reachable"
        }
      ]
    },
    {
      "id": "csp-csn-l5",
      "project_id": "csp-csn",
      "order": 5,
      "title": "Bandwidth and Latency",
      "explanation": "## Two Different Measures of Speed\n\nPeople say a connection is \"fast,\" but speed has two distinct meanings:\n\n- **Bandwidth** is the *rate* of data transfer, measured in **bits per second** (for example, megabits per second, Mbps). It is how much data can flow per unit time, like the width of a pipe.\n- **Latency** is the *delay* before data starts arriving, measured in time (for example, milliseconds). It is how long the first bit takes to make the trip, like the length of the pipe.\n\nA satellite link can have **high bandwidth but high latency**, while a short cable can have low latency but limited bandwidth. They are independent.\n\n## Estimating Transfer Time\n\nA simple model of how long a transfer takes adds the startup delay to the streaming time:\n\n```\ntotal_time = latency + (data_size / bandwidth)\n```\n\nWatch the **units**. Bandwidth is in **bits** per second, but file sizes are often in **bytes**. Since 1 byte = 8 bits, you must convert:\n\n```python\nlatency_ms = 20          # round-trip start-up delay\nbandwidth_mbps = 100     # megabits per second\nsize_MB = 10             # megabytes\n\nbits = size_MB * 8                  # 80 megabits\ntransfer_ms = bits / bandwidth_mbps * 1000  # 800 ms\ntotal = latency_ms + transfer_ms    # 820 ms\nprint(round(total))\n```\n\n## Why Both Matter\n\n- For **large downloads**, bandwidth dominates: a bigger pipe finishes sooner.\n- For **quick back-and-forth** (clicking a link, a game input), latency dominates, because each tiny message still pays the delay.\n- **Throughput**, the actual delivered rate, is usually lower than the rated bandwidth because of overhead and congestion.\n\n## The Big Picture\n\nWhen you evaluate a network, ask *both* questions: how much can flow per second (**bandwidth**) and how long until it starts (**latency**)? Confusing the two leads to bad decisions, like buying more bandwidth to fix a problem that is really caused by delay.",
      "key_terms": [
        {
          "term": "Bandwidth",
          "definition": "The maximum rate of data transfer, measured in bits per second (for example, Mbps)."
        },
        {
          "term": "Latency",
          "definition": "The time delay before transferred data begins to arrive, measured in units of time like milliseconds."
        },
        {
          "term": "Throughput",
          "definition": "The actual rate of successful data delivery, usually lower than the rated bandwidth due to overhead."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A connection has very high bandwidth but also high latency. What does that mean?",
          "options": [
            "It can move a lot of data per second, but there is a noticeable delay before data starts arriving",
            "It is slow in every way",
            "It has no delay at all",
            "It can only send one packet at a time"
          ],
          "correct_index": 0,
          "explanation": "Bandwidth and latency are independent: high bandwidth means a lot of data per second, while high latency means a long start-up delay."
        }
      ],
      "quiz_questions": [
        {
          "question": "For a very large file download, which factor most affects total time?",
          "options": [
            "Latency, because each click is delayed",
            "Bandwidth, because the bulk of the data must stream through",
            "The IP version",
            "The DNS server name"
          ],
          "correct_index": 1,
          "explanation": "For large transfers, the streaming time (data_size / bandwidth) dominates, so higher bandwidth finishes the download sooner."
        },
        {
          "question": "Why must you convert units when combining bandwidth and file size?",
          "options": [
            "Bandwidth is in bits per second but file sizes are often in bytes (1 byte = 8 bits)",
            "Bandwidth uses metric and file size uses imperial",
            "Latency changes the file size",
            "Bytes and bits are identical"
          ],
          "correct_index": 0,
          "explanation": "Bandwidth is measured in bits per second while files are usually in bytes; since 1 byte = 8 bits, you must convert to get a correct time."
        }
      ],
      "challenge_title": "Estimate Transfer Time",
      "challenge_language": "python",
      "challenge_starter_code": "# Input is one line: \"<latency_ms> <bandwidth_mbps> <size_MB>\".\n#   latency_ms     = start-up delay in milliseconds (integer)\n#   bandwidth_mbps = megabits per second (number)\n#   size_MB        = file size in megabytes (number)\n# total_ms = latency_ms + (size_MB * 8 / bandwidth_mbps) * 1000\n# Print total_ms rounded to the nearest whole number.\n\nline = input().split()\n# TODO: convert MB to megabits, compute transfer time, add latency\n",
      "challenge_solution_code": "lat, bw, size = input().split()\nlat = int(lat)\nbw = float(bw)\nsize_MB = float(size)\nbits = size_MB * 8\ntransfer_ms = bits / bw * 1000\ntotal = lat + transfer_ms\nprint(int(round(total)))",
      "challenge_test_cases": [
        {
          "input": "20 100 10",
          "expected_output": "820"
        },
        {
          "input": "50 10 1",
          "expected_output": "850"
        },
        {
          "input": "5 1000 100",
          "expected_output": "805"
        }
      ]
    },
    {
      "id": "csp-csn-l6",
      "project_id": "csp-csn",
      "order": 6,
      "title": "Protocols: TCP/IP and HTTP",
      "explanation": "## Layered Protocols\n\nThe internet works because of **protocols** stacked in layers, where each layer trusts the one below it. The most important pairing is **TCP/IP**:\n\n- **IP** (Internet Protocol) handles **addressing and routing**: it gets packets to the right machine but does not guarantee they arrive or arrive in order.\n- **TCP** (Transmission Control Protocol) runs on top of IP and adds **reliability**: it numbers packets, acknowledges what arrived, retransmits losses, and reassembles the data in order.\n\nThis separation is powerful: IP can stay simple and fast, while TCP handles the messy work of making delivery dependable.\n\n## HTTP: The Web's Protocol\n\nOn top of TCP sits **HTTP** (HyperText Transfer Protocol), the language of the web. A browser sends a **request** and the server returns a **response**. A request begins with a **request line**:\n\n```\nGET /index.html HTTP/1.1\n```\n\nThat line has three parts: the **method** (what to do), the **path** (which resource), and the **version**. Common methods include `GET` (fetch a resource) and `POST` (send data). **HTTPS** is HTTP carried over an encrypted connection for security.\n\n## Parsing a Request Line\n\n```python\nline = \"GET /index.html HTTP/1.1\"\nparts = line.split()\nmethod, path, version = parts\nvalid_methods = {\"GET\", \"POST\", \"PUT\", \"DELETE\"}\nprint(method in valid_methods)  # True\nprint(method, path)             # GET /index.html\n```\n\n## Why Layering Matters\n\n- Each layer has **one job**, so each can be improved independently.\n- HTTP does not worry about lost packets because **TCP** already guarantees delivery.\n- TCP does not worry about finding the machine because **IP** already handles routing.\n\n## The Big Picture\n\nWhen you load a page, your request travels down the stack (HTTP to TCP to IP), across the network, and back up the stack on the server. This clean division of responsibilities is why the same web can run on phones, laptops, and servers from countless vendors.",
      "key_terms": [
        {
          "term": "TCP/IP",
          "definition": "The core protocol pair where IP handles addressing/routing and TCP adds reliable, ordered delivery on top."
        },
        {
          "term": "HTTP",
          "definition": "The HyperText Transfer Protocol, used by browsers and servers to request and return web resources."
        },
        {
          "term": "Request line",
          "definition": "The first line of an HTTP request, containing the method, the path, and the protocol version."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does TCP add that IP alone does not provide?",
          "options": [
            "A way to encrypt every web page",
            "Reliable, in-order delivery through numbering, acknowledgments, and retransmission",
            "The physical cables between routers",
            "The domain name lookup"
          ],
          "correct_index": 1,
          "explanation": "IP only addresses and routes packets; TCP layers on reliability by numbering packets, acknowledging them, and resending losses in order."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is HTTP able to ignore lost or out-of-order packets?",
          "options": [
            "HTTP never loses packets",
            "Because the TCP layer beneath it already guarantees reliable, ordered delivery",
            "Because IP encrypts everything",
            "Because DNS resends the page"
          ],
          "correct_index": 1,
          "explanation": "HTTP runs on top of TCP, which handles reliability, so HTTP can focus on requests and responses without managing packet loss."
        },
        {
          "question": "In the request line `POST /api/login HTTP/1.1`, what is `POST`?",
          "options": [
            "The protocol version",
            "The HTTP method describing the action to perform",
            "The resource path",
            "The server's IP address"
          ],
          "correct_index": 1,
          "explanation": "The first token of a request line is the method; POST sends data to the server, while the path and version follow it."
        }
      ],
      "challenge_title": "Parse an HTTP Request Line",
      "challenge_language": "python",
      "challenge_starter_code": "# Input is one HTTP request line, e.g. \"GET /index.html HTTP/1.1\".\n# A valid request line has exactly 3 tokens: METHOD PATH VERSION,\n# the METHOD is one of GET, POST, PUT, DELETE, HEAD, PATCH,\n# and VERSION starts with \"HTTP/\".\n# If valid, print \"<METHOD> <PATH>\". Otherwise print \"BAD REQUEST\".\n\nline = input()\n# TODO: split into tokens and validate\n",
      "challenge_solution_code": "line = input()\nparts = line.split()\nvalid = {\"GET\", \"POST\", \"PUT\", \"DELETE\", \"HEAD\", \"PATCH\"}\nif len(parts) == 3 and parts[0] in valid and parts[2].startswith(\"HTTP/\"):\n    print(parts[0], parts[1])\nelse:\n    print(\"BAD REQUEST\")",
      "challenge_test_cases": [
        {
          "input": "GET /index.html HTTP/1.1",
          "expected_output": "GET /index.html"
        },
        {
          "input": "FETCH /data HTTP/1.1",
          "expected_output": "BAD REQUEST"
        },
        {
          "input": "POST /api/login HTTP/2",
          "expected_output": "POST /api/login"
        }
      ]
    },
    {
      "id": "csp-csn-l7",
      "project_id": "csp-csn",
      "order": 7,
      "title": "Parallel and Distributed Computing",
      "explanation": "## Doing Work at the Same Time\n\nMost early programs ran **sequentially**: one step finished before the next began. Modern systems often run work **in parallel** to go faster.\n\n- **Parallel computing** uses multiple processors (or cores) on a single machine, each handling part of a problem at the same time.\n- **Distributed computing** spreads work across many separate computers connected by a **network**, such as a data center or a worldwide research project.\n\n## Modeling Parallel Time\n\nWhen tasks run on several workers at once, the job is not finished until the **busiest worker** is done. So:\n\n- **Sequential time** = the sum of all task durations (one worker does everything).\n- **Parallel time** = the load of the **most loaded** worker.\n\n## Balancing the Load\n\nIf tasks are unevenly assigned, one worker can be overloaded while others sit idle. A common heuristic is to assign each task (largest first) to the **currently least-loaded** worker:\n\n```python\ntimes = [5, 2, 1]\nworkers = [0, 0]  # two workers, each starts at 0\nfor t in sorted(times, reverse=True):\n    i = workers.index(min(workers))\n    workers[i] += t\nprint(\"sequential:\", sum(times))   # 8\nprint(\"parallel:\", max(workers))   # 5\n```\n\nHere one worker gets the size-5 task and the other gets 2 + 1 = 3, so the job finishes in 5, not 8.\n\n## Costs of Parallelism\n\n- **Coordination overhead**: splitting work and combining results takes time.\n- **Communication**: distributed workers must send data over a network, which adds latency.\n- **Imbalance**: a single slow worker holds up the whole job.\n\n## The Big Picture\n\nParallel and distributed computing let us tackle problems too big or slow for one processor: rendering films, training models, or serving millions of users. But the gain depends on dividing work **evenly** and keeping coordination cheap. In the next lesson we quantify exactly how much faster parallel work can be.",
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
          "term": "Load balancing",
          "definition": "Distributing tasks across workers so no single worker is overloaded while others sit idle."
        }
      ],
      "inline_quizzes": [
        {
          "question": "When several workers run tasks in parallel, the job finishes when...",
          "options": [
            "The first worker finishes",
            "The busiest (most loaded) worker finishes",
            "The average worker finishes",
            "All tasks have been counted"
          ],
          "correct_index": 1,
          "explanation": "Parallel time equals the load of the most loaded worker, because the job is not done until even the busiest worker completes its tasks."
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
          "explanation": "Parallel computing splits work across cores of a single machine, while distributed computing spreads work across many separate networked computers."
        },
        {
          "question": "Why does uneven task assignment hurt parallel performance?",
          "options": [
            "It makes packets arrive out of order",
            "One overloaded worker holds up the whole job while others sit idle",
            "It uses more IP addresses",
            "It increases the sequential sum"
          ],
          "correct_index": 1,
          "explanation": "Because the job ends when the busiest worker finishes, an overloaded worker increases parallel time even if others are idle."
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
    },
    {
      "id": "csp-csn-l8",
      "project_id": "csp-csn",
      "order": 8,
      "title": "Speedup and Its Limits",
      "explanation": "## Measuring the Benefit of Parallelism\n\nThe whole point of parallel computing is to finish sooner. We measure that benefit as **speedup**:\n\n```\nspeedup = sequential_time / parallel_time\n```\n\nIf a task takes 60 seconds on one processor and 20 seconds when split across processors, the speedup is 3. A speedup of 1 means no improvement; a speedup of 4 means four times faster.\n\n## Why Speedup Has a Ceiling\n\nYou cannot always cut time perfectly, because some parts of a program **must** run in order. You cannot frost a cake before baking it. The portion of work that can be parallelized determines the maximum gain.\n\nThis idea is captured by **Amdahl's Law**. If a fraction **p** of the work can be parallelized across **n** processors and the rest (1 - p) must stay sequential, then:\n\n```\nspeedup = 1 / ((1 - p) + p / n)\n```\n\n```python\np = 0.9   # 90% parallelizable\nn = 4     # 4 processors\nspeedup = 1 / ((1 - p) + p / n)\nprint(round(speedup, 2))  # 3.08\n```\n\n## The Sequential Part Dominates\n\nNotice what happens as **n** grows very large: `p / n` shrinks toward zero, so speedup approaches `1 / (1 - p)`. With 10% sequential work, the speedup can never exceed 10, no matter how many processors you add. The **sequential fraction sets a hard ceiling**.\n\n## Practical Consequences\n\n- Adding processors gives **diminishing returns** once the parallel part is already split thin.\n- **Overhead** from coordination and communication can make real speedup lower than the formula predicts.\n- The best target for optimization is often **reducing the sequential portion**, not just adding hardware.\n\n## The Big Picture\n\nSpeedup tells you whether parallelism is paying off, and Amdahl's Law warns you that it is bounded by the part you cannot parallelize. Understanding this keeps you from the costly mistake of buying more processors to solve a problem that is fundamentally sequential.",
      "key_terms": [
        {
          "term": "Speedup",
          "definition": "The ratio of sequential execution time to parallel execution time, measuring how much faster parallel work is."
        },
        {
          "term": "Amdahl's Law",
          "definition": "A formula showing that the maximum speedup is limited by the fraction of work that must run sequentially."
        },
        {
          "term": "Sequential fraction",
          "definition": "The portion of a program that cannot be parallelized, which sets a hard ceiling on achievable speedup."
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
          "question": "According to Amdahl's Law, if 20% of a program is strictly sequential, the speedup can never exceed...",
          "options": [
            "20",
            "5",
            "2",
            "Unlimited"
          ],
          "correct_index": 1,
          "explanation": "As processors grow, speedup approaches 1 / (1 - p) where p is the parallel fraction (0.8), so 1 / 0.2 = 5 is the ceiling."
        },
        {
          "question": "Why does adding more processors give diminishing returns?",
          "options": [
            "Processors get slower in groups",
            "The sequential portion stays fixed, so the parallel part shrinks per processor but the sequential floor remains",
            "Speedup is always exactly 1",
            "Networks never lose packets"
          ],
          "correct_index": 1,
          "explanation": "The term p/n shrinks as n grows, but the (1 - p) sequential term never goes away, so speedup levels off near 1 / (1 - p)."
        }
      ],
      "challenge_title": "Amdahl's Law Speedup",
      "challenge_language": "python",
      "challenge_starter_code": "# Input is one line: \"<p> <n>\".\n#   p = fraction of work that is parallelizable (0.0 to 1.0)\n#   n = number of processors (integer >= 1)\n# Compute speedup = 1 / ((1 - p) + p / n) and print it rounded to 2 decimals.\n\nline = input().split()\n# TODO: parse p and n, apply Amdahl's Law\n",
      "challenge_solution_code": "p, n = input().split()\np = float(p)\nn = int(n)\nspeedup = 1.0 / ((1 - p) + p / n)\nprint(f\"{speedup:.2f}\")",
      "challenge_test_cases": [
        {
          "input": "0.5 2",
          "expected_output": "1.33"
        },
        {
          "input": "0.9 4",
          "expected_output": "3.08"
        },
        {
          "input": "0.0 8",
          "expected_output": "1.00"
        }
      ]
    }
  ]
}
