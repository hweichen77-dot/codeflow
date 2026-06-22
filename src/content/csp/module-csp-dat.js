// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-dat",
    "title": "Data",
    "description": "Explores how computers represent information as binary, compress it to save space, and transform large datasets into useful knowledge.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 102,
    "track": "apcsp",
    "unit": "Big Idea 2 — Data",
    "tags": [
      "binary",
      "data compression",
      "extracting information from data"
    ]
  },
  "lessons": [
    {
      "id": "csp-dat-l1",
      "project_id": "csp-dat",
      "order": 1,
      "title": "Binary: How Computers Store Numbers",
      "xp_reward": 50,
      "explanation": "## Why Binary?\n\nComputers are built from billions of tiny switches that can only be **on** or **off**. Because there are only two states, computers count using the **binary** number system (base 2) instead of the decimal system (base 10) that humans use. Each binary digit is called a **bit**, and eight bits grouped together form a **byte**.\n\n## Place Values in Base 2\n\nIn decimal, each place is a power of 10 (1, 10, 100, ...). In binary, each place is a power of 2:\n\n- Place values from right to left: 1, 2, 4, 8, 16, 32, 64, 128\n- A bit set to **1** means \"add this place value\"; a **0** means \"skip it\"\n\nFor example, the binary number `1101` means:\n\n```python\n# 1101 in binary\nvalue = 1*8 + 1*4 + 0*2 + 1*1\nprint(value)  # 13\n```\n\n## Converting Decimal to Binary\n\nTo convert a decimal number to binary, repeatedly divide by 2 and record the remainders, then read them in reverse. Python gives us a shortcut with the built-in `bin()` function, which returns a string prefixed with `0b`:\n\n```python\nn = 13\nprint(bin(n))       # 0b1101\nprint(bin(n)[2:])   # 1101  (slice off the '0b')\n```\n\n## Bits, Range, and Overflow\n\nThe number of bits limits how many values you can represent:\n\n- **1 bit** -> 2 values (0, 1)\n- **n bits** -> 2 to the power of n values\n- **8 bits (1 byte)** -> 256 values (0 to 255)\n\nThis is why a single byte caps at 255. When a value exceeds the available bits, you get **overflow**. Understanding bit-width matters for colors (24-bit RGB), text (Unicode), and memory limits. Everything a computer touches -- numbers, letters, images, sound -- is ultimately stored as patterns of bits.",
      "key_terms": [
        {
          "term": "Bit",
          "definition": "The smallest unit of data, holding a single 0 or 1."
        },
        {
          "term": "Binary (base 2)",
          "definition": "A number system using only digits 0 and 1, where each place is a power of 2."
        },
        {
          "term": "Byte",
          "definition": "A group of 8 bits, able to represent 256 distinct values (0 to 255)."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the decimal value of the binary number 1010?",
          "options": [
            "5",
            "10",
            "12",
            "20"
          ],
          "correct_index": 1,
          "explanation": "1010 = 1*8 + 0*4 + 1*2 + 0*1 = 8 + 2 = 10."
        }
      ],
      "quiz_questions": [
        {
          "question": "How many distinct values can be represented with 8 bits?",
          "options": [
            "8",
            "16",
            "128",
            "256"
          ],
          "correct_index": 3,
          "explanation": "8 bits give 2 to the power of 8 = 256 distinct values (0 through 255)."
        },
        {
          "question": "Why do computers use binary instead of decimal?",
          "options": [
            "Binary numbers are shorter than decimal",
            "Hardware switches have only two stable states: on and off",
            "Binary can store larger numbers",
            "Humans find binary easier to read"
          ],
          "correct_index": 1,
          "explanation": "Physical components (transistors) reliably hold two states, which map naturally to the two binary digits 0 and 1."
        }
      ],
      "challenge_title": "Decimal to Binary",
      "challenge_language": "python",
      "challenge_starter_code": "n = int(input())\n# TODO: print the binary representation of n (no '0b' prefix)\n",
      "challenge_solution_code": "n = int(input())\nprint(bin(n)[2:])\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "101"
        },
        {
          "input": "0",
          "expected_output": "0"
        },
        {
          "input": "13",
          "expected_output": "1101"
        }
      ]
    },
    {
      "id": "csp-dat-l2",
      "project_id": "csp-dat",
      "order": 2,
      "title": "Data Compression: Doing More With Less",
      "xp_reward": 50,
      "explanation": "## What Is Compression?\n\n**Data compression** reduces the number of bits needed to store or transmit information. Smaller files load faster, use less storage, and save bandwidth. The College Board distinguishes two kinds:\n\n- **Lossless compression**: the original data can be perfectly reconstructed. No information is lost. Used for text, code, and ZIP files.\n- **Lossy compression**: some data is permanently discarded to shrink size further. Used for JPEG images, MP3 audio, and streaming video, where small imperfections are acceptable to human eyes and ears.\n\n## Run-Length Encoding\n\nA classic lossless technique is **run-length encoding (RLE)**. It replaces *runs* of repeated characters with the character followed by a count. The string `aaabbc` becomes `a3b2c1`.\n\n```python\ns = \"aaabbc\"\nresult = []\ni = 0\nwhile i < len(s):\n    ch = s[i]\n    count = 1\n    while i + count < len(s) and s[i + count] == ch:\n        count += 1\n    result.append(ch + str(count))\n    i += count\nprint(\"\".join(result))  # a3b2c1\n```\n\n## When Compression Helps (and Hurts)\n\nCompression works by removing **redundancy**. RLE shines on data with long repeated runs (like a solid-color image region) but can actually *grow* data with no repeats: `abcd` becomes `a1b1c1d1`, twice the size. Key trade-offs:\n\n- **Lossless** preserves everything but compresses less aggressively.\n- **Lossy** achieves smaller files but the change is permanent -- you can never recover the discarded detail.\n\n## The Big Picture\n\nNo single algorithm compresses every input -- a truly random file cannot be shrunk at all. Real-world formats combine clever techniques (Huffman coding, dictionaries, transforms) to exploit the specific patterns in text, images, and sound. Choosing **lossless vs. lossy** is a fundamental engineering decision about whether perfect fidelity or smaller size matters more for a given use.",
      "key_terms": [
        {
          "term": "Lossless compression",
          "definition": "Compression where the exact original data can be fully restored."
        },
        {
          "term": "Lossy compression",
          "definition": "Compression that discards some data permanently to achieve smaller sizes."
        },
        {
          "term": "Run-length encoding",
          "definition": "A lossless method that replaces repeated characters with a character and a count."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which compression type is most appropriate for a text document where every character must be preserved exactly?",
          "options": [
            "Lossy compression",
            "Lossless compression",
            "Neither type works for text",
            "Both lose data equally"
          ],
          "correct_index": 1,
          "explanation": "Lossless compression guarantees the original text is perfectly reconstructed, which is essential for documents and code."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does run-length encoding produce for the input 'xxxx'?",
          "options": [
            "x4",
            "xxxx",
            "4x",
            "x1x1x1x1"
          ],
          "correct_index": 0,
          "explanation": "Four repeated x characters compress to the character 'x' followed by the count '4', giving 'x4'."
        },
        {
          "question": "Which statement about lossy compression is TRUE?",
          "options": [
            "It always restores the original data perfectly",
            "It is required for plain text files",
            "Discarded information cannot be recovered",
            "It never reduces file size"
          ],
          "correct_index": 2,
          "explanation": "Lossy compression permanently removes data, so the original cannot be perfectly reconstructed afterward."
        }
      ],
      "challenge_title": "Run-Length Encoding",
      "challenge_language": "python",
      "challenge_starter_code": "s = input()\n# TODO: print the run-length encoding of s, e.g. aaabbc -> a3b2c1\n",
      "challenge_solution_code": "s = input()\nresult = []\ni = 0\nwhile i < len(s):\n    ch = s[i]\n    count = 1\n    while i + count < len(s) and s[i + count] == ch:\n        count += 1\n    result.append(ch + str(count))\n    i += count\nprint(\"\".join(result))\n",
      "challenge_test_cases": [
        {
          "input": "aaabbc",
          "expected_output": "a3b2c1"
        },
        {
          "input": "wwwwwwwwww",
          "expected_output": "w10"
        },
        {
          "input": "abcd",
          "expected_output": "a1b1c1d1"
        }
      ]
    },
    {
      "id": "csp-dat-l3",
      "project_id": "csp-dat",
      "order": 3,
      "title": "Extracting Information From Data",
      "xp_reward": 50,
      "explanation": "## From Raw Data to Insight\n\nRaw data by itself is just numbers and symbols. The power of computing comes from **extracting information** -- finding patterns, summaries, and trends that help people make decisions. A spreadsheet of 10,000 sales rows means little until you compute totals, averages, or spot an outlier.\n\n## Summary Statistics\n\nThe quickest way to understand a dataset is to **summarize** it. Common summaries include:\n\n- **Sum**: the total of all values\n- **Minimum** and **maximum**: the smallest and largest values (the range)\n- **Mean (average)**: the sum divided by how many values there are\n- **Count**: how many data points exist\n\n```python\nnums = [5, 3, 9, 1, 7]\nprint(min(nums))           # 1\nprint(max(nums))           # 9\nprint(sum(nums) / len(nums))  # 5.0  (the mean)\n```\n\n## Cleaning and Reading Data\n\nReal data often arrives as text that must be **parsed**. Numbers may be separated by spaces or newlines. A robust approach reads everything, splits it into tokens, and converts each token to the right type:\n\n```python\nimport sys\ndata = sys.stdin.read().split()   # splits on ANY whitespace\nnums = [int(x) for x in data]\n```\n\nUsing `split()` with no argument handles spaces, tabs, and newlines all at once -- a common technique for messy input.\n\n## Why It Matters\n\nExtracting information scales human ability:\n\n- **Filtering** narrows millions of records to the relevant few.\n- **Aggregating** (sum, average, count) reveals the big picture.\n- **Visualizing** turns numbers into charts the brain reads instantly.\n\nThe same dataset can answer many questions depending on which information you extract. Good analysis depends on **clean data** and choosing summaries that actually answer the question being asked, while staying alert to bias or missing values that could mislead.",
      "key_terms": [
        {
          "term": "Mean (average)",
          "definition": "The sum of all values divided by the number of values."
        },
        {
          "term": "Parsing",
          "definition": "Reading raw text and converting it into structured, usable data such as numbers."
        },
        {
          "term": "Aggregation",
          "definition": "Combining many data points into a single summary like a sum, count, or average."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does Python's split() with no arguments do to the string '4\\n5  6'?",
          "options": [
            "Returns one item '4\\n5  6'",
            "Splits only on the newline",
            "Splits on any whitespace, giving ['4','5','6']",
            "Raises an error"
          ],
          "correct_index": 2,
          "explanation": "split() with no argument splits on any run of whitespace (spaces, tabs, newlines) and ignores empty pieces."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the mean of the values 10, 20, 30?",
          "options": [
            "10",
            "20",
            "30",
            "60"
          ],
          "correct_index": 1,
          "explanation": "(10 + 20 + 30) / 3 = 60 / 3 = 20."
        },
        {
          "question": "Why is summarizing a large dataset useful?",
          "options": [
            "It permanently deletes the original data",
            "It converts numbers into binary",
            "It reveals patterns and the big picture from many data points",
            "It guarantees the data has no errors"
          ],
          "correct_index": 2,
          "explanation": "Summaries like sum, average, and range aggregate many points so people can see trends and make decisions."
        }
      ],
      "challenge_title": "Dataset Summary",
      "challenge_language": "python",
      "challenge_starter_code": "import sys\ndata = sys.stdin.read().split()\nnums = [int(x) for x in data]\n# TODO: print the minimum, maximum, and mean (rounded to 1 decimal),\n# separated by spaces on one line\n",
      "challenge_solution_code": "import sys\ndata = sys.stdin.read().split()\nnums = [int(x) for x in data]\nmn = min(nums)\nmx = max(nums)\nmean = round(sum(nums) / len(nums), 1)\nprint(mn, mx, mean)\n",
      "challenge_test_cases": [
        {
          "input": "5\n3\n9\n1\n7",
          "expected_output": "1 9 5.0"
        },
        {
          "input": "10\n20\n30",
          "expected_output": "10 30 20.0"
        },
        {
          "input": "4 4 4 4",
          "expected_output": "4 4 4.0"
        }
      ]
    }
  ]
}
