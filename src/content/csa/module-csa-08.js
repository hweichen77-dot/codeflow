// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-08",
    "title": "2D Array",
    "description": "Covers declaring, initializing, and traversing two-dimensional arrays in Java, including row-major iteration and nested-loop algorithms.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 208,
    "track": "apcsa",
    "unit": "Unit 8 — 2D Array",
    "tags": [
      "2D arrays",
      "row-major traversal",
      "nested-loop algorithms"
    ]
  },
  "lessons": [
    {
      "id": "csa-08-l1",
      "project_id": "csa-08",
      "order": 1,
      "title": "Declaring and Initializing 2D Arrays",
      "explanation": "## What Is a 2D Array?\n\nA **two-dimensional array** is an array whose elements are themselves arrays. In Java a 2D array is really a **rectangular grid** of values organized into **rows** and **columns**. You can picture it as a table: each row is a list, and the cell at row `r`, column `c` holds one value.\n\nThe declaration uses two pairs of brackets:\n\n```java\nint[][] grid = new int[3][4]; // 3 rows, 4 columns\ngrid[0][0] = 5;                // top-left cell\ngrid[2][3] = 9;                // bottom-right cell\n```\n\nThe first index is the **row**; the second is the **column**. So `grid[r][c]` reads \"row r, column c.\"\n\n## Default Values\n\nLike 1D arrays, a freshly allocated 2D array is filled with **default values**:\n\n- `int[][]` and `double[][]` start at `0` / `0.0`\n- `boolean[][]` starts at `false`\n- Object arrays (like `String[][]`) start at `null`\n\n## Initializer Lists\n\nYou can also create and fill a 2D array in one statement using an **initializer list**. Each inner brace is one row:\n\n```java\nint[][] m = { {1, 2, 3},\n              {4, 5, 6} };\n// m has 2 rows and 3 columns\n```\n\n## Getting the Dimensions\n\nThe key length facts on the AP CSA exam:\n\n- `arr.length` gives the **number of rows**.\n- `arr[r].length` gives the **number of columns in row r**.\n\n```java\nint rows = m.length;       // 2\nint cols = m[0].length;    // 3\n```\n\nBecause AP CSA only tests **rectangular** arrays, every row has the same number of columns, so `arr[0].length` reliably gives the column count.\n\n## Common Pitfalls\n\n- Swapping row and column indices: `grid[c][r]` instead of `grid[r][c]`.\n- Going out of bounds: valid rows are `0` to `arr.length - 1`; valid columns are `0` to `arr[0].length - 1`.\n- Confusing `arr.length` (rows) with `arr[0].length` (columns).\n\nMastering declaration, default values, and dimensions is the foundation for every 2D-array algorithm you will write.",
      "key_terms": [
        {
          "term": "Two-dimensional array",
          "definition": "An array of arrays in Java, representing a grid of values addressed by a row index and a column index."
        },
        {
          "term": "Initializer list",
          "definition": "A brace-enclosed list of rows used to create and fill a 2D array in a single statement, e.g. {{1,2},{3,4}}."
        },
        {
          "term": "arr.length vs arr[0].length",
          "definition": "arr.length returns the number of rows; arr[0].length returns the number of columns in row 0."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For `int[][] g = new int[5][3];`, what does `g.length` evaluate to?",
          "options": [
            "3",
            "5",
            "15",
            "0"
          ],
          "correct_index": 1,
          "explanation": "arr.length gives the number of rows, which is the first dimension: 5. The column count (3) is g[0].length."
        }
      ],
      "quiz_questions": [
        {
          "question": "Given `int[][] m = { {1,2,3}, {4,5,6} };`, what is `m[1][2]`?",
          "options": [
            "3",
            "5",
            "6",
            "Index out of bounds"
          ],
          "correct_index": 2,
          "explanation": "Row index 1 is {4,5,6}; column index 2 of that row is 6."
        },
        {
          "question": "What is the default value of each element in a newly created `boolean[][]` array?",
          "options": [
            "true",
            "false",
            "0",
            "null"
          ],
          "correct_index": 1,
          "explanation": "boolean arrays default to false, just as numeric arrays default to 0 and object arrays default to null."
        }
      ],
      "challenge_title": "Grid Cell Lookup",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        // TODO: read the grid values, then read r and c, and print grid[r][c]\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                grid[r][c] = sc.nextInt();\n            }\n        }\n        int r = sc.nextInt();\n        int c = sc.nextInt();\n        System.out.println(grid[r][c]);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6\n1 2",
          "expected_output": "6"
        },
        {
          "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n0 0",
          "expected_output": "1"
        },
        {
          "input": "2 2\n10 20\n30 40\n1 0",
          "expected_output": "30"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l2",
      "project_id": "csa-08",
      "order": 2,
      "title": "Row-Major Traversal",
      "explanation": "## Visiting Every Cell\n\nTo process all elements of a 2D array you use **nested loops**: an outer loop over rows and an inner loop over columns. When the outer loop chooses the row and the inner loop sweeps across every column before moving to the next row, you are doing a **row-major traversal**. This visits cells in the order `(0,0), (0,1), ..., (0,n-1), (1,0), ...` — left to right, top to bottom, exactly like reading text.\n\n```java\nfor (int r = 0; r < arr.length; r++) {        // each row\n    for (int c = 0; c < arr[r].length; c++) { // each column\n        System.out.print(arr[r][c] + \" \");\n    }\n    System.out.println();\n}\n```\n\nNote the loop bounds: the **outer** loop uses `arr.length` (rows) and the **inner** loop uses `arr[r].length` (columns). The outer variable controls the first index; the inner variable controls the second.\n\n## Column-Major Traversal\n\nIf you swap the loops so the **column** index is on the outside and the **row** index is on the inside, you get a **column-major traversal**, visiting `(0,0), (1,0), (2,0), ...` — top to bottom, then the next column. Only the loop nesting order changes; the indexing inside stays `arr[r][c]`.\n\n## Enhanced for Loops\n\nA 2D array can be traversed with nested **enhanced for (for-each)** loops. The outer loop variable is a whole **row** (a 1D array), and the inner loop variable is one **element**:\n\n```java\nint sum = 0;\nfor (int[] row : arr) {       // row is one 1D array\n    for (int value : row) {   // value is one element\n        sum += value;\n    }\n}\n```\n\nEnhanced for is clean for reading but cannot **modify** the array or give you the indices, so use indexed loops when you need `r` and `c`.\n\n## Why Order Matters\n\n- **Printing a grid** in normal reading order needs row-major.\n- **Summing all cells** gives the same answer regardless of order.\n- **Building a string row by row** requires row-major so the rows print correctly.\n\nUnderstanding traversal order is essential because many AP free-response questions depend on visiting cells in a specific sequence.",
      "key_terms": [
        {
          "term": "Row-major traversal",
          "definition": "Visiting cells with the row loop on the outside and the column loop on the inside, processing each row fully before the next."
        },
        {
          "term": "Column-major traversal",
          "definition": "Visiting cells with the column loop on the outside and the row loop on the inside, processing each column fully before the next."
        },
        {
          "term": "Nested enhanced for",
          "definition": "Two for-each loops where the outer variable is a row (1D array) and the inner variable is a single element."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In a row-major traversal of an int[][], which loop should use `arr[r].length` as its bound?",
          "options": [
            "The outer (row) loop",
            "The inner (column) loop",
            "Both loops",
            "Neither loop"
          ],
          "correct_index": 1,
          "explanation": "The inner loop sweeps columns, so it runs from 0 up to arr[r].length. The outer loop uses arr.length for rows."
        }
      ],
      "quiz_questions": [
        {
          "question": "Using nested enhanced for loops on `int[][] arr`, what is the type of the outer loop variable?",
          "options": [
            "int",
            "int[]",
            "int[][]",
            "String"
          ],
          "correct_index": 1,
          "explanation": "Each element of a 2D int array is a row, which is a 1D int array (int[]). The inner loop variable is then an int."
        },
        {
          "question": "Which traversal visits the cells in the order (0,0), (1,0), (2,0), (0,1), ...?",
          "options": [
            "Row-major",
            "Column-major",
            "Diagonal",
            "Reverse row-major"
          ],
          "correct_index": 1,
          "explanation": "Holding the column fixed while moving down the rows first is column-major traversal (column loop outside, row loop inside)."
        }
      ],
      "challenge_title": "Row Sums",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        // TODO: read the grid, then print the sum of each row on its own line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                grid[r][c] = sc.nextInt();\n            }\n        }\n        for (int r = 0; r < rows; r++) {\n            int sum = 0;\n            for (int c = 0; c < cols; c++) {\n                sum += grid[r][c];\n            }\n            System.out.println(sum);\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "6\n15"
        },
        {
          "input": "3 2\n10 10\n5 5\n0 7",
          "expected_output": "20\n10\n7"
        },
        {
          "input": "1 4\n2 4 6 8",
          "expected_output": "20"
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l3",
      "project_id": "csa-08",
      "order": 3,
      "title": "Nested-Loop Algorithms",
      "explanation": "## Computing Over a Grid\n\nOnce you can traverse a 2D array, you can build **nested-loop algorithms** that compute results across the whole grid: totals, maximums, counts, and transformations. The pattern is always a traversal plus an **accumulator** or comparison updated inside the inner loop.\n\n## Summing All Elements\n\nKeep one running total across both loops:\n\n```java\nint total = 0;\nfor (int r = 0; r < arr.length; r++) {\n    for (int c = 0; c < arr[r].length; c++) {\n        total += arr[r][c];\n    }\n}\n```\n\n## Finding the Maximum\n\nSeed the maximum with the first element, then compare every cell:\n\n```java\nint max = arr[0][0];\nfor (int r = 0; r < arr.length; r++) {\n    for (int c = 0; c < arr[r].length; c++) {\n        if (arr[r][c] > max) {\n            max = arr[r][c];\n        }\n    }\n}\n```\n\n## Counting With a Condition\n\nUse a counter that increments only when a condition holds — for example, counting even values or values above a threshold:\n\n```java\nint count = 0;\nfor (int[] row : arr) {\n    for (int v : row) {\n        if (v % 2 == 0) count++;\n    }\n}\n```\n\n## Working With Special Cells\n\nMany problems target a subset of cells:\n\n- **Main diagonal**: cells where `r == c` (in a square array).\n- **Border cells**: cells where `r == 0`, `r == rows-1`, `c == 0`, or `c == cols-1`.\n- **A single column**: fix `c` and loop `r` over all rows.\n\n```java\nint diagSum = 0;\nfor (int i = 0; i < arr.length; i++) {\n    diagSum += arr[i][i]; // main diagonal of a square array\n}\n```\n\n## Tips for Correctness\n\n- Initialize accumulators **before** the loops, not inside them.\n- For max/min, seed with a real element (`arr[0][0]`), not an arbitrary constant.\n- Place the condition check inside the **inner** loop so every cell is tested.\n\nThese building blocks — sum, max, count, and targeted cells — combine to solve nearly every 2D-array problem on the exam.",
      "key_terms": [
        {
          "term": "Accumulator",
          "definition": "A variable declared before the loops that collects a running result (sum, count, or max) as cells are visited."
        },
        {
          "term": "Main diagonal",
          "definition": "In a square 2D array, the cells where the row index equals the column index (arr[i][i])."
        },
        {
          "term": "Border cell",
          "definition": "A cell on the edge of the grid: its row is 0 or rows-1, or its column is 0 or cols-1."
        }
      ],
      "inline_quizzes": [
        {
          "question": "When finding the maximum of a 2D array, what is the safest way to initialize the `max` variable?",
          "options": [
            "Set it to 0",
            "Set it to arr[0][0]",
            "Set it to Integer.MIN_VALUE only if all values are positive",
            "Leave it uninitialized"
          ],
          "correct_index": 1,
          "explanation": "Seeding max with a real element, arr[0][0], guarantees correctness even when all values are negative."
        }
      ],
      "quiz_questions": [
        {
          "question": "In a square array, which condition selects the main diagonal cells?",
          "options": [
            "r == 0",
            "c == arr[0].length - 1",
            "r == c",
            "r + c == arr.length"
          ],
          "correct_index": 2,
          "explanation": "Main-diagonal cells run from top-left to bottom-right, where the row and column indices are equal: r == c."
        },
        {
          "question": "Where should a counting accumulator be declared so it counts across the entire 2D array?",
          "options": [
            "Inside the inner loop",
            "Inside the outer loop but before the inner loop",
            "Before both loops",
            "After both loops"
          ],
          "correct_index": 2,
          "explanation": "Declaring the counter before both loops keeps a single running count; declaring it inside a loop resets it each iteration."
        }
      ],
      "challenge_title": "Grid Maximum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        // TODO: read the grid and print the largest value in it\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                grid[r][c] = sc.nextInt();\n            }\n        }\n        int max = grid[0][0];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] > max) {\n                    max = grid[r][c];\n                }\n            }\n        }\n        System.out.println(max);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 9 3\n4 5 6",
          "expected_output": "9"
        },
        {
          "input": "3 3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9",
          "expected_output": "-1"
        },
        {
          "input": "2 2\n7 7\n7 8",
          "expected_output": "8"
        }
      ],
      "xp_reward": 100
    }
  ]
}
