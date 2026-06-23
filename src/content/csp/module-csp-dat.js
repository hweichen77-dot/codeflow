// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csp-dat",
    "title": "Data",
    "description": "Explores how computers represent, store, compress, and analyze data using binary, number bases, and how information and bias are extracted from large datasets.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 102,
    "track": "apcsp",
    "unit": "Big Idea 2 — Data",
    "tags": [
      "binary",
      "compression",
      "data analysis"
    ]
  },
  "lessons": [
    {
      "id": "csp-dat-l1",
      "project_id": "csp-dat",
      "order": 1,
      "title": "Binary Numbers and Bits",
      "explanation": "## Everything Is Bits\n\nComputers store and process all data using **binary**, a number system with only two digits: 0 and 1. A single binary digit is called a **bit**. Because hardware is built from switches that are either off (0) or on (1), binary maps directly onto the physical machine.\n\nEight bits grouped together form a **byte**. A byte can represent 256 different values (from 0 to 255) because each of its 8 bits independently doubles the number of possibilities: 2^8 = 256.\n\n## Place Value in Base 2\n\nIn the decimal system you know, each place is a power of 10. In binary, each place is a power of **2**. Reading right to left, the places are 1, 2, 4, 8, 16, 32, and so on:\n\n- The binary number `1011` means 8 + 0 + 2 + 1 = **11**.\n- The binary number `10000` means 16.\n\nTo convert a binary string to a decimal value, add the place value wherever a 1 appears:\n\n```python\nbits = input()          # e.g. \"1011\"\nvalue = 0\nfor ch in bits:\n    value = value * 2 + int(ch)\nprint(value)            # 11\n```\n\nThe trick `value = value * 2 + digit` walks the digits left to right, shifting the running total one place each step. This is exactly how positional notation works.\n\n## Why Binary Matters\n\n- **Reliability**: distinguishing two states (on/off) is easier and less error-prone than ten.\n- **Universality**: numbers, text, images, and sound are all ultimately stored as sequences of bits.\n- **Capacity**: adding one bit *doubles* the number of values you can represent, so storage grows exponentially with bit count.\n\nUnderstanding bits and bytes is the foundation for everything else in this unit: number bases, overflow, compression, and analysis all build on the idea that data is just bits.",
      "key_terms": [
        {
          "term": "Bit",
          "definition": "A binary digit, the smallest unit of data, holding a value of either 0 or 1."
        },
        {
          "term": "Byte",
          "definition": "A group of 8 bits that can represent 256 different values, from 0 to 255."
        },
        {
          "term": "Binary",
          "definition": "A base-2 number system using only the digits 0 and 1, in which each place value is a power of 2."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many distinct values can a single byte (8 bits) represent?",
          "options": [
            "8",
            "16",
            "256",
            "1024"
          ],
          "correct_index": 2,
          "explanation": "Each bit doubles the possibilities, so 8 bits give 2^8 = 256 distinct values (0 to 255)."
        }
      ],
      "quiz_questions": [
        {
          "question": "What decimal value does the binary number 1011 represent?",
          "options": [
            "7",
            "11",
            "13",
            "23"
          ],
          "correct_index": 1,
          "explanation": "Reading place values: 8 + 0 + 2 + 1 = 11."
        },
        {
          "question": "If you add one more bit to a binary number, how does the number of representable values change?",
          "options": [
            "It increases by 1",
            "It increases by 2",
            "It doubles",
            "It stays the same"
          ],
          "correct_index": 2,
          "explanation": "Each additional bit doubles the count of representable values because each place is a power of 2."
        }
      ],
      "challenge_title": "Binary to Decimal",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a binary number as a string of 0s and 1s.\n# Print its decimal (base-10) value.\nbits = input()\n# TODO: convert the binary string to a decimal integer and print it\n",
      "challenge_solution_code": "bits = input()\nvalue = 0\nfor ch in bits:\n    value = value * 2 + int(ch)\nprint(value)\n",
      "challenge_test_cases": [
        {
          "input": "1011",
          "expected_output": "11"
        },
        {
          "input": "10000",
          "expected_output": "16"
        },
        {
          "input": "0",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-dat-l2",
      "project_id": "csp-dat",
      "order": 2,
      "title": "Number Bases and Conversion",
      "explanation": "## Beyond Binary and Decimal\n\nA **number base** (or radix) tells you how many distinct digits a system uses and what each place is worth. **Decimal** is base 10 (digits 0-9). **Binary** is base 2 (digits 0-1). Computing also uses **hexadecimal**, base 16, which has digits 0-9 plus the letters A-F representing values 10 through 15.\n\nHexadecimal is popular because it is a compact shorthand for binary: each hex digit corresponds to exactly **four** bits. So the byte `11111111` becomes just `FF`, and `1010` becomes `A`.\n\n## Place Value in Any Base\n\nThe rule is the same in every base: each place is a power of the base. In base 16 the places are 1, 16, 256, and so on:\n\n- Hex `2A` = 2 * 16 + 10 = **42** in decimal.\n- Hex `FF` = 15 * 16 + 15 = **255**.\n\n## Converting Decimal to Another Base\n\nTo convert a decimal number to base *b*, repeatedly divide by *b* and collect the remainders, reading them in reverse. Here is decimal-to-binary using that method:\n\n```python\nn = int(input())\nif n == 0:\n    print(\"0\")\nelse:\n    digits = []\n    while n > 0:\n        digits.append(str(n % 2))\n        n = n // 2\n    print(\"\".join(reversed(digits)))\n```\n\nThe remainders (`n % 2`) are the binary digits from least significant to most significant, so we reverse them at the end.\n\n## Why Multiple Bases\n\n- **Binary** matches the hardware directly.\n- **Hexadecimal** packs binary into a short, human-readable form used for colors (like `#FF8800`), memory addresses, and byte dumps.\n- **Decimal** is what people read and write every day.\n\nBeing able to move between bases is a core data-representation skill on the AP exam.",
      "key_terms": [
        {
          "term": "Number base",
          "definition": "The count of distinct digits a number system uses; each place value is a power of the base."
        },
        {
          "term": "Hexadecimal",
          "definition": "A base-16 system using digits 0-9 and letters A-F, where each digit represents four bits."
        },
        {
          "term": "Radix",
          "definition": "Another word for the base of a number system, such as 2 for binary or 16 for hexadecimal."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many bits does a single hexadecimal digit represent?",
          "options": [
            "1",
            "2",
            "4",
            "8"
          ],
          "correct_index": 2,
          "explanation": "Hex is base 16 and 2^4 = 16, so one hex digit maps exactly to four bits."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the decimal value of the hexadecimal number 2A?",
          "options": [
            "26",
            "32",
            "42",
            "52"
          ],
          "correct_index": 2,
          "explanation": "2 * 16 + 10 (A) = 32 + 10 = 42."
        },
        {
          "question": "Why is hexadecimal commonly used in computing?",
          "options": [
            "It uses fewer than two digits",
            "It is a compact shorthand for binary, with one hex digit per four bits",
            "Computers store data directly in base 16",
            "It can represent values that binary cannot"
          ],
          "correct_index": 1,
          "explanation": "Each hex digit equals exactly four bits, making it a short, readable way to write binary."
        }
      ],
      "challenge_title": "Decimal to Binary",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a non-negative decimal integer.\n# Print its binary representation (no leading zeros, '0' stays '0').\nn = int(input())\n# TODO: convert n to a binary string and print it\n",
      "challenge_solution_code": "n = int(input())\nif n == 0:\n    print(\"0\")\nelse:\n    digits = []\n    while n > 0:\n        digits.append(str(n % 2))\n        n = n // 2\n    print(\"\".join(reversed(digits)))\n",
      "challenge_test_cases": [
        {
          "input": "11",
          "expected_output": "1011"
        },
        {
          "input": "16",
          "expected_output": "10000"
        },
        {
          "input": "0",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-dat-l3",
      "project_id": "csp-dat",
      "order": 3,
      "title": "Overflow and Round-Off Errors",
      "explanation": "## Limited Bits, Limited Numbers\n\nReal computers store numbers in a **fixed number of bits**. That limit creates two classic problems on the AP exam: **overflow** and **round-off** errors. Both happen because the true value cannot fit in the available space.\n\n## Overflow Errors\n\nAn **overflow error** occurs when a calculation produces a number too large for the allotted bits. Imagine a system that stores values in 4 bits, so the largest value it can hold is `1111` = 15. If you compute 15 + 1, the result 16 needs a fifth bit that does not exist. The number may \"wrap around\" to 0 or produce a wrong value.\n\nWe can simulate a fixed-width counter using the modulo operator, which keeps only the bits that fit:\n\n```python\nbits = int(input())     # width, e.g. 4\nstart = int(input())    # starting value\nadd = int(input())      # amount to add\nlimit = 2 ** bits       # 4 bits -> 16 values (0..15)\nprint((start + add) % limit)\n```\n\nWith `bits = 4`, `start = 15`, `add = 1`, the result wraps to **0** instead of 16. That wraparound is overflow.\n\n## Round-Off Errors\n\nA **round-off error** happens when a value cannot be represented exactly, so the computer stores the closest value it can. This is common with fractions in floating-point numbers. For example, `0.1 + 0.2` in Python prints `0.30000000000000004` because 0.1 and 0.2 have no exact binary representation.\n\nKey points:\n\n- Overflow comes from numbers that are **too big** for the bits available.\n- Round-off comes from numbers that need **more precision** than the bits provide.\n- Using more bits reduces both problems but never fully eliminates round-off for all real numbers.\n\nThese limits explain why choosing data types and bit widths carefully matters in real software.",
      "key_terms": [
        {
          "term": "Overflow error",
          "definition": "An error that occurs when a value is too large to be represented in the available number of bits, often causing wraparound."
        },
        {
          "term": "Round-off error",
          "definition": "An error from storing the closest representable value when a number needs more precision than the bits allow."
        },
        {
          "term": "Fixed-width",
          "definition": "Representing numbers using a set number of bits, which bounds the largest and most precise values that can be stored."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why does the expression 0.1 + 0.2 not produce exactly 0.3 on most computers?",
          "options": [
            "The computer is broken",
            "These decimals cannot be stored exactly in binary, causing round-off error",
            "Addition is not supported for decimals",
            "Overflow occurred"
          ],
          "correct_index": 1,
          "explanation": "0.1 and 0.2 have no exact binary representation, so the stored values are slightly off, a round-off error."
        }
      ],
      "quiz_questions": [
        {
          "question": "An overflow error occurs when...",
          "options": [
            "A number needs more decimal precision than available",
            "A value is too large for the number of bits allotted",
            "Two strings are added together",
            "Input is left empty"
          ],
          "correct_index": 1,
          "explanation": "Overflow happens when a result exceeds the largest value the available bits can represent."
        },
        {
          "question": "Using more bits to store numbers primarily helps by...",
          "options": [
            "Making the program run faster",
            "Allowing larger values and more precision, reducing overflow and round-off",
            "Removing the need for input validation",
            "Converting decimal to hexadecimal automatically"
          ],
          "correct_index": 1,
          "explanation": "More bits raise the maximum representable value and add precision, reducing both overflow and round-off errors."
        }
      ],
      "challenge_title": "Fixed-Width Counter",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: number of bits.\n# Line 2: starting value.\n# Line 3: amount to add.\n# Print the result as it would appear in a fixed-width counter (with wraparound).\nbits = int(input())\nstart = int(input())\nadd = int(input())\n# TODO: compute (start + add) wrapped to fit in 'bits' bits, then print it\n",
      "challenge_solution_code": "bits = int(input())\nstart = int(input())\nadd = int(input())\nlimit = 2 ** bits\nprint((start + add) % limit)\n",
      "challenge_test_cases": [
        {
          "input": "4\n15\n1",
          "expected_output": "0"
        },
        {
          "input": "4\n10\n3",
          "expected_output": "13"
        },
        {
          "input": "3\n7\n2",
          "expected_output": "1"
        }
      ]
    },
    {
      "id": "csp-dat-l4",
      "project_id": "csp-dat",
      "order": 4,
      "title": "Lossless Data Compression",
      "explanation": "## Making Data Smaller\n\n**Data compression** reduces the number of bits needed to store or transmit information. Smaller data loads faster, costs less to store, and saves bandwidth. There are two families of compression: lossless and lossy. This lesson covers **lossless compression**.\n\n## Lossless Means Reversible\n\nIn **lossless compression**, every bit of the original data can be perfectly reconstructed after decompression. Nothing is thrown away. It is ideal for text, code, and spreadsheets, where losing even one character would corrupt the file. Formats like ZIP and PNG use lossless methods.\n\n## Run-Length Encoding\n\nA simple lossless technique is **run-length encoding (RLE)**. It replaces a *run* of repeated characters with the character followed by a count. The string `AAAB` becomes `A3B1`. Because the rule is exact, you can always rebuild the original.\n\n```python\ns = input()\nresult = []\ni = 0\nwhile i < len(s):\n    ch = s[i]\n    count = 0\n    while i < len(s) and s[i] == ch:\n        count += 1\n        i += 1\n    result.append(ch + str(count))\nprint(\"\".join(result))\n```\n\nFor `AAAB`, this prints `A3B1`. For `WWWWWWB`, it prints `W6B1`.\n\n## Trade-Offs\n\n- **Strength**: perfect reconstruction, so no information is ever lost.\n- **Limit**: the size reduction depends on the data. Highly repetitive data compresses a lot; random data may not shrink at all and can even grow.\n\nRun-length encoding is most effective when data has long runs of repeated values, such as simple graphics with large solid-color areas. When data lacks repetition, more advanced lossless schemes (like dictionary coding) do better, but the guarantee is always the same: **decompression restores the original exactly**.",
      "key_terms": [
        {
          "term": "Data compression",
          "definition": "Reducing the number of bits required to represent data so it takes less storage or bandwidth."
        },
        {
          "term": "Lossless compression",
          "definition": "Compression in which the original data can be perfectly reconstructed, with no information lost."
        },
        {
          "term": "Run-length encoding",
          "definition": "A lossless technique that replaces runs of repeated values with the value and a count."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What defines lossless compression?",
          "options": [
            "It always halves the file size",
            "The original data can be perfectly reconstructed",
            "It permanently discards unimportant data",
            "It only works on images"
          ],
          "correct_index": 1,
          "explanation": "Lossless compression guarantees the original data can be fully restored, losing nothing."
        }
      ],
      "quiz_questions": [
        {
          "question": "Run-length encoding works best on data that...",
          "options": [
            "Is completely random",
            "Has long runs of repeated values",
            "Contains only numbers",
            "Is already compressed"
          ],
          "correct_index": 1,
          "explanation": "RLE shrinks data by collapsing repeated runs, so repetitive data benefits most."
        },
        {
          "question": "Why is lossless compression preferred for text and program files?",
          "options": [
            "It is always faster than lossy compression",
            "Losing even one character would corrupt the file, so nothing can be discarded",
            "Text cannot be compressed any other way",
            "It produces smaller files than any lossy method"
          ],
          "correct_index": 1,
          "explanation": "Text and code require exact reconstruction; any lost data would corrupt them, so lossless is needed."
        }
      ],
      "challenge_title": "Run-Length Encode",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a string of characters.\n# Print its run-length encoding: each run as the character followed by its count.\ns = input()\n# TODO: build and print the run-length encoding of s\n",
      "challenge_solution_code": "s = input()\nresult = []\ni = 0\nwhile i < len(s):\n    ch = s[i]\n    count = 0\n    while i < len(s) and s[i] == ch:\n        count += 1\n        i += 1\n    result.append(ch + str(count))\nprint(\"\".join(result))\n",
      "challenge_test_cases": [
        {
          "input": "AAAB",
          "expected_output": "A3B1"
        },
        {
          "input": "WWWWWWB",
          "expected_output": "W6B1"
        },
        {
          "input": "ABC",
          "expected_output": "A1B1C1"
        }
      ]
    },
    {
      "id": "csp-dat-l5",
      "project_id": "csp-dat",
      "order": 5,
      "title": "Lossy Data Compression",
      "explanation": "## Trading Quality for Size\n\n**Lossy compression** reduces data size by permanently discarding information judged less important. Unlike lossless methods, the original data **cannot** be perfectly reconstructed. In exchange, lossy methods often achieve much smaller files. JPEG images, MP3 audio, and most streaming video use lossy compression.\n\n## Why Discard Data?\n\nHuman senses do not notice everything. The human eye is less sensitive to subtle color differences than to brightness, and the ear cannot hear some quiet sounds masked by louder ones. Lossy compression exploits these limits, throwing away detail people are unlikely to miss while keeping the overall experience similar.\n\n## A Simplified Example\n\nImagine compressing a list of brightness values by **rounding** each to the nearest multiple of 10. Many distinct values collapse to the same number, so the data becomes more repetitive and easier to store, but the exact originals are lost forever.\n\n```python\nn = int(input())\nvals = input().split()\nout = []\nfor v in vals:\n    x = int(v)\n    out.append(str(round(x / 10) * 10))\nprint(\" \".join(out))\n```\n\nA value of 47 becomes 50; 12 becomes 10. You cannot recover whether 50 came from 47, 48, or 52, which is exactly why this is lossy.\n\n## Choosing Lossy vs Lossless\n\n- Use **lossy** when small size matters more than perfect fidelity: photos, music, video.\n- Use **lossless** when every bit must survive: text, code, financial records, archival images.\n\nLossy compression usually has a **quality setting**: more aggressive compression means smaller files but more visible or audible loss. The right choice depends on how the data will be used and how much loss is acceptable.",
      "key_terms": [
        {
          "term": "Lossy compression",
          "definition": "Compression that permanently discards some data to achieve smaller sizes, so the original cannot be exactly restored."
        },
        {
          "term": "Fidelity",
          "definition": "How closely compressed data matches the original; lossy compression trades fidelity for smaller size."
        },
        {
          "term": "Quality setting",
          "definition": "A control in lossy compression that balances file size against how much detail is preserved."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the key difference between lossy and lossless compression?",
          "options": [
            "Lossy is always slower",
            "Lossy permanently discards some data and cannot perfectly restore the original",
            "Lossy only works on text",
            "Lossy never reduces file size"
          ],
          "correct_index": 1,
          "explanation": "Lossy compression discards information for smaller size, so the original cannot be exactly reconstructed."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which file type is the best candidate for lossy compression?",
          "options": [
            "A Python source file",
            "A photograph for a website",
            "A bank transaction log",
            "A legal contract"
          ],
          "correct_index": 1,
          "explanation": "Photos tolerate minor quality loss for big size savings, so lossy compression suits them well."
        },
        {
          "question": "Lossy compression achieves smaller files primarily by...",
          "options": [
            "Repeating the data twice",
            "Discarding information that people are unlikely to notice",
            "Converting numbers to hexadecimal",
            "Storing data in more bits"
          ],
          "correct_index": 1,
          "explanation": "Lossy methods drop less-perceptible detail, exploiting the limits of human senses to shrink data."
        }
      ],
      "challenge_title": "Lossy Round to Tens",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: count of values n.\n# Line 2: n space-separated integers (brightness values).\n# Print each value rounded to the nearest multiple of 10, space-separated.\nn = int(input())\nvals = input().split()\n# TODO: round each value to the nearest 10 and print them space-separated\n",
      "challenge_solution_code": "n = int(input())\nvals = input().split()\nout = []\nfor v in vals:\n    x = int(v)\n    out.append(str(round(x / 10) * 10))\nprint(\" \".join(out))\n",
      "challenge_test_cases": [
        {
          "input": "3\n47 12 50",
          "expected_output": "50 10 50"
        },
        {
          "input": "4\n5 14 25 99",
          "expected_output": "0 10 20 100"
        },
        {
          "input": "1\n3",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-dat-l6",
      "project_id": "csp-dat",
      "order": 6,
      "title": "Extracting Information from Data",
      "explanation": "## Data Becomes Information\n\nRaw data by itself is just numbers and symbols. **Information** is the meaning we extract from data through processing and analysis. The AP CSP exam emphasizes that programs can transform large datasets into useful insights: totals, averages, trends, and patterns that no human could spot by hand.\n\n## Common Extraction Operations\n\nTo turn data into information, programs typically:\n\n- **Filter**: keep only the rows that match a condition (for example, sales above a threshold).\n- **Aggregate**: combine many values into one, such as a sum, count, average, maximum, or minimum.\n- **Sort**: order data to reveal rankings and extremes.\n- **Transform**: clean or reshape data so it can be analyzed.\n\nFinding the **maximum** of a dataset is a classic aggregation. Here we read a list and report the largest value:\n\n```python\nn = int(input())\nvals = input().split()\nbest = int(vals[0])\nfor v in vals[1:]:\n    x = int(v)\n    if x > best:\n        best = x\nprint(best)\n```\n\nThe loop keeps a running \"best\" and updates it whenever it finds something larger, a pattern that scales to millions of values.\n\n## Scaling Up\n\nThe power of computing is processing data at a scale humans cannot. A spreadsheet of one billion rows is meaningless to read directly, but a program can compute the average in seconds. **Metadata, filters, and aggregations** combine to answer real questions: Which product sold best? What is the trend over time? Where are the outliers?\n\nKey ideas:\n\n- Data is raw; information is the meaning we derive from it.\n- Filtering, aggregating, sorting, and transforming are core extraction tools.\n- Programs make it possible to find patterns and insights in datasets far too large for manual analysis.",
      "key_terms": [
        {
          "term": "Information",
          "definition": "The meaning or insight extracted from raw data through processing and analysis."
        },
        {
          "term": "Aggregation",
          "definition": "Combining many data values into a single summary such as a sum, count, average, maximum, or minimum."
        },
        {
          "term": "Filtering",
          "definition": "Selecting only the data that meets a specified condition while ignoring the rest."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the difference between data and information?",
          "options": [
            "They are exactly the same thing",
            "Information is the meaning extracted from raw data",
            "Data is always smaller than information",
            "Information can only be stored in binary"
          ],
          "correct_index": 1,
          "explanation": "Data is raw symbols; information is the meaning derived from processing that data."
        }
      ],
      "quiz_questions": [
        {
          "question": "Computing the average of a one-billion-row dataset illustrates which strength of computing?",
          "options": [
            "It can store data in hexadecimal",
            "It can process data at a scale far beyond manual human analysis",
            "It never makes round-off errors",
            "It compresses data losslessly"
          ],
          "correct_index": 1,
          "explanation": "Programs can analyze enormous datasets quickly, revealing information humans could not compute by hand."
        },
        {
          "question": "Keeping only the rows where sales exceed 100 is an example of...",
          "options": [
            "Aggregating",
            "Filtering",
            "Compressing",
            "Overflowing"
          ],
          "correct_index": 1,
          "explanation": "Selecting rows that meet a condition is filtering."
        }
      ],
      "challenge_title": "Find the Maximum",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: count of values n.\n# Line 2: n space-separated integers.\n# Print the largest value.\nn = int(input())\nvals = input().split()\n# TODO: find and print the maximum value\n",
      "challenge_solution_code": "n = int(input())\nvals = input().split()\nbest = int(vals[0])\nfor v in vals[1:]:\n    x = int(v)\n    if x > best:\n        best = x\nprint(best)\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 9 2 7 4",
          "expected_output": "9"
        },
        {
          "input": "3\n-5 -2 -9",
          "expected_output": "-2"
        },
        {
          "input": "1\n42",
          "expected_output": "42"
        }
      ]
    },
    {
      "id": "csp-dat-l7",
      "project_id": "csp-dat",
      "order": 7,
      "title": "Metadata",
      "explanation": "## Data About Data\n\n**Metadata** is data that describes other data. A photo file holds the image itself, but it also stores metadata: the date taken, camera model, resolution, file size, and sometimes GPS location. The picture is the data; the facts about the picture are the metadata.\n\n## Everyday Examples\n\n- A music file: the song is the data; the title, artist, album, and length are metadata.\n- An email: the message body is the data; the sender, recipient, subject, and timestamp are metadata.\n- A web page: the content is the data; the author, language, and last-modified date are metadata.\n\nMetadata makes data **findable, organized, and usable**. Search engines rely on metadata to index pages; photo apps sort by date using metadata; libraries catalog books by author and subject metadata.\n\n## Working With Metadata\n\nMetadata is often stored as labeled fields. Suppose each line of input is a `key=value` pair describing a file, and we want to report just the file's size:\n\n```python\nn = int(input())\nsize = \"unknown\"\nfor _ in range(n):\n    line = input()\n    key, value = line.split(\"=\")\n    if key == \"size\":\n        size = value\nprint(size)\n```\n\nThe program scans the metadata fields and pulls out the one it needs, ignoring the rest.\n\n## Benefits and Concerns\n\n- **Benefit**: metadata lets us search, filter, and organize huge collections quickly without opening every file.\n- **Concern**: metadata can reveal private information. A photo's GPS metadata can expose where you live, and document metadata may show authors or edit history you did not intend to share.\n\nUnderstanding metadata is essential both for building useful systems and for protecting privacy, two themes the AP exam connects directly to the Data big idea.",
      "key_terms": [
        {
          "term": "Metadata",
          "definition": "Data that describes other data, such as a photo's date, size, or location."
        },
        {
          "term": "Field",
          "definition": "A labeled piece of metadata, often stored as a key paired with a value."
        },
        {
          "term": "Indexing",
          "definition": "Using metadata to organize and quickly locate data within a large collection."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Which of these is metadata for a photo file?",
          "options": [
            "The colors of the pixels",
            "The date the photo was taken",
            "The image displayed on screen",
            "The brightness of the subject"
          ],
          "correct_index": 1,
          "explanation": "The date taken describes the photo, making it metadata; the pixels are the actual image data."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is metadata useful for managing large data collections?",
          "options": [
            "It makes the original data smaller",
            "It lets systems search, filter, and organize data without opening every file",
            "It encrypts the data automatically",
            "It converts data to binary"
          ],
          "correct_index": 1,
          "explanation": "Metadata describes data so it can be indexed, searched, and sorted efficiently."
        },
        {
          "question": "What is a privacy concern related to metadata?",
          "options": [
            "It always corrupts the file",
            "GPS or author metadata can reveal information you did not intend to share",
            "It doubles the file size",
            "It cannot be deleted"
          ],
          "correct_index": 1,
          "explanation": "Metadata like GPS location or document authorship can unintentionally expose private details."
        }
      ],
      "challenge_title": "Read a Metadata Field",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: number of metadata lines n.\n# Next n lines: each is key=value.\n# Print the value of the 'size' field, or 'unknown' if it is missing.\nn = int(input())\n# TODO: scan the n lines and print the value paired with key 'size'\n",
      "challenge_solution_code": "n = int(input())\nsize = \"unknown\"\nfor _ in range(n):\n    line = input()\n    key, value = line.split(\"=\")\n    if key == \"size\":\n        size = value\nprint(size)\n",
      "challenge_test_cases": [
        {
          "input": "3\ndate=2024\nsize=1024\nname=cat",
          "expected_output": "1024"
        },
        {
          "input": "2\nname=dog\ndate=2023",
          "expected_output": "unknown"
        },
        {
          "input": "1\nsize=500",
          "expected_output": "500"
        }
      ]
    },
    {
      "id": "csp-dat-l8",
      "project_id": "csp-dat",
      "order": 8,
      "title": "Bias in Data",
      "explanation": "## Data Is Not Always Neutral\n\nIt is tempting to think numbers are objective, but **data bias** means a dataset systematically misrepresents reality. Biased data leads to biased conclusions, and when programs make decisions from that data, the bias is repeated at scale. The AP CSP exam expects you to recognize how bias enters data and why it matters.\n\n## How Bias Enters Data\n\n- **Sampling bias**: the data does not represent the whole population. A survey taken only on a college campus will not reflect retirees.\n- **Collection bias**: how data is gathered skews it. A satisfaction poll sent only to people who finished a purchase ignores those who gave up.\n- **Historical bias**: data reflects past inequities, so a model trained on it can perpetuate them.\n- **Exclusion bias**: leaving out groups, such as a voice system trained only on certain accents.\n\n## Why Bias Matters\n\nBiased data can cause real harm: unfair loan decisions, inaccurate medical predictions, or recommendation systems that exclude groups. Because programs scale, a small bias can affect millions of people quickly.\n\n## Detecting Imbalance\n\nA first step is checking whether groups are represented fairly. Suppose we count responses per group and flag whether the dataset is balanced. Here we report whether the largest group is more than double the smallest:\n\n```python\nn = int(input())\ncounts = [int(x) for x in input().split()]\nhi = max(counts)\nlo = min(counts)\nif hi > 2 * lo:\n    print(\"biased\")\nelse:\n    print(\"balanced\")\n```\n\nIf one group has far more entries than another, the dataset may be skewed.\n\n## Reducing Bias\n\n- Collect data from **representative samples**.\n- Examine **who is missing** from the data.\n- Be transparent about **how data was gathered**.\n\nRecognizing and reducing bias is a responsibility of everyone who builds with data, connecting the Data big idea to its real-world impact.",
      "key_terms": [
        {
          "term": "Data bias",
          "definition": "A systematic distortion in a dataset that causes it to misrepresent reality, leading to skewed conclusions."
        },
        {
          "term": "Sampling bias",
          "definition": "Bias that arises when the data collected does not represent the whole population of interest."
        },
        {
          "term": "Representative sample",
          "definition": "A subset of data chosen to accurately reflect the larger population, reducing bias."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A survey conducted only on a college campus to estimate the whole country's opinions suffers from...",
          "options": [
            "Overflow error",
            "Sampling bias",
            "Lossless compression",
            "Round-off error"
          ],
          "correct_index": 1,
          "explanation": "The sample does not represent the whole population, which is sampling bias."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is bias in data especially dangerous when used by programs?",
          "options": [
            "Programs cannot read biased data",
            "Programs scale decisions, so bias can affect many people quickly",
            "Bias makes programs run faster",
            "Bias only affects compressed files"
          ],
          "correct_index": 1,
          "explanation": "Automated systems apply decisions at scale, so biased data can harm large numbers of people rapidly."
        },
        {
          "question": "Which action best helps reduce bias in a dataset?",
          "options": [
            "Collecting data from a representative sample of the population",
            "Compressing the data losslessly",
            "Converting the data to hexadecimal",
            "Storing it in more bits"
          ],
          "correct_index": 0,
          "explanation": "Using a representative sample helps ensure the data reflects the whole population, reducing bias."
        }
      ],
      "challenge_title": "Detect Imbalanced Data",
      "challenge_language": "python",
      "challenge_starter_code": "# Line 1: number of groups n.\n# Line 2: n space-separated counts of responses per group.\n# Print 'biased' if the largest count is more than double the smallest, else 'balanced'.\nn = int(input())\ncounts = [int(x) for x in input().split()]\n# TODO: compare the largest and smallest counts and print the verdict\n",
      "challenge_solution_code": "n = int(input())\ncounts = [int(x) for x in input().split()]\nhi = max(counts)\nlo = min(counts)\nif hi > 2 * lo:\n    print(\"biased\")\nelse:\n    print(\"balanced\")\n",
      "challenge_test_cases": [
        {
          "input": "3\n10 4 5",
          "expected_output": "biased"
        },
        {
          "input": "3\n10 8 9",
          "expected_output": "balanced"
        },
        {
          "input": "2\n100 10",
          "expected_output": "biased"
        }
      ]
    }
  ]
}
