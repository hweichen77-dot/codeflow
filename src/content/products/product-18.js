export default {
  project: {
    id: "prod-18",
    title: "Codebase Assistant",
    description:
      "Build a tool that ingests a code repository, splits it into function-sized chunks, and retrieves the pieces most relevant to a question using retrieval tuned specifically for code. Every answer it gives cites the exact file and line range it came from, and gets flagged instead of guessed when the codebase doesn't actually contain the answer.",
    difficulty: "advanced",
    category: "rag_search",
    estimated_time: 150,
    lessons_count: 8,
    tags: ["rag", "code-search", "embeddings", "chunking", "retrieval", "citations"],
    order: 118,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-18-1",
      project_id: "prod-18",
      order: 1,
      title: "Walking the Repo, Safely",
      concept: "repo ingestion",
      explanation: `Before you can answer a single question about a codebase, you need to *read* it, all of it, without choking on the junk. This lesson builds the ingestion step: walk a repository, keep the source files, skip everything that isn't code.

## What we're building

By lesson 8 you'll have a command-line tool: point it at a repo, ask a question in English, get back an answer with the exact file and line numbers it came from. Every RAG product starts the same way though: get the raw documents into memory. For a codebase, the "documents" are source files, and most of a repo isn't source at all.

## The problem: repos are mostly noise

A typical repository is full of things you never want to feed to a model: \`.git/\` internals, \`node_modules/\` with tens of thousands of files, compiled artifacts, images, lockfiles. If you naively read every file under a repo root, you'll burn your token budget on a \`package-lock.json\` before you ever reach the function that actually answers the question.

## How real ingestion works

\`\`\`python
import os

SKIP_DIRS = {"node_modules", ".git", "__pycache__", "venv", "dist", "build"}
CODE_EXTENSIONS = {".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".java"}

def list_source_files(root):
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            ext = os.path.splitext(name)[1]
            if ext in CODE_EXTENSIONS:
                files.append(os.path.join(dirpath, name))
    return sorted(files)
\`\`\`

Two details matter. First, \`dirnames[:] = ...\` mutates the list \`os.walk\` is iterating *in place*, which is the only way to stop it from descending into \`node_modules\` at all, rather than descending in and filtering results afterward. Second, filtering by extension up front means you never even open a \`.png\` or a \`.lock\` file.

## Why it matters

Ingestion mistakes are invisible until they're expensive: a repo that "sort of works" in a demo can quietly send megabytes of vendored JavaScript to the model on every question, wasting cost and drowning the actual answer in noise. Getting the file list right, before any chunking or embedding happens, is the cheapest correctness you'll buy in this whole project.

## The mental model to keep

Think of ingestion as **triage at the door**: every file gets a fast yes/no before it's allowed inside, based only on its path, no need to open and read a file just to reject it by name. Below, build that filter by hand on a small fake repo, no real filesystem needed yet, so you can see exactly which files survive and which get turned away.`,
      starter_code: `REPO_FILES = [
    "src/app.py",
    "src/utils.py",
    "src/components/Button.jsx",
    "node_modules/react/index.js",
    "node_modules/react/package.json",
    ".git/config",
    "README.md",
    "dist/bundle.js",
    "tests/test_app.py",
]

SKIP_DIRS = {"node_modules", ".git", "dist", "__pycache__"}
CODE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx"}

def is_source_file(path):
    # TODO: return True if path's filename has an extension in CODE_EXTENSIONS
    #       AND no "/"-separated segment of path is in SKIP_DIRS.
    pass

def list_source_files(paths):
    # TODO: return a sorted list of paths for which is_source_file is True
    pass

sources = list_source_files(REPO_FILES)
print("kept:", len(sources))
for p in sources:
    print(p)
`,
      solution_code: `REPO_FILES = [
    "src/app.py",
    "src/utils.py",
    "src/components/Button.jsx",
    "node_modules/react/index.js",
    "node_modules/react/package.json",
    ".git/config",
    "README.md",
    "dist/bundle.js",
    "tests/test_app.py",
]

SKIP_DIRS = {"node_modules", ".git", "dist", "__pycache__"}
CODE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx"}

def is_source_file(path):
    filename = path.rsplit("/", 1)[-1]
    ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ""
    if ext not in CODE_EXTENSIONS:
        return False
    segments = path.split("/")
    return not any(seg in SKIP_DIRS for seg in segments)

def list_source_files(paths):
    return sorted(p for p in paths if is_source_file(p))

sources = list_source_files(REPO_FILES)
print("kept:", len(sources))
for p in sources:
    print(p)
`,
      hints: [
        "Get the filename first with path.rsplit(\"/\", 1)[-1], then check if it has a dot before building the extension.",
        "Use path.split(\"/\") to get every segment, then any(seg in SKIP_DIRS for seg in segments).",
        "list_source_files should filter with is_source_file, then sort the result before returning.",
      ],
      challenge_title: "Filter the Repo Tree",
      challenge_description:
        "Keep only source files from a list of repo paths, given allowed extensions and directory names to skip anywhere in the path.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    paths = [data[1 + i] for i in range(n)]
    exts = set(e for e in data[1 + n].split(",") if e)
    skip_dirs = set(d for d in data[2 + n].split(",") if d)
    # parse done: 'paths' is the list of file paths, 'exts' allowed extensions
    # (no dot), 'skip_dirs' directory names to exclude anywhere in the path

    # TODO: keep a path if its extension (the part of the filename after the
    #       last '.') is in exts AND no '/'-separated segment of the path is
    #       in skip_dirs.
    # TODO: print the count of kept paths, then each kept path in sorted
    #       order, one per line.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    paths = [data[1 + i] for i in range(n)]
    exts = set(e for e in data[1 + n].split(",") if e)
    skip_dirs = set(d for d in data[2 + n].split(",") if d)

    kept = []
    for path in paths:
        filename = path.rsplit("/", 1)[-1]
        if "." not in filename:
            continue
        ext = filename.rsplit(".", 1)[-1]
        if ext not in exts:
            continue
        segments = path.split("/")
        if any(seg in skip_dirs for seg in segments):
            continue
        kept.append(path)

    kept.sort()
    print(len(kept))
    for p in kept:
        print(p)

main()
`,
      challenge_test_cases: [
        {
          input:
            "5\nsrc/app.py\nsrc/utils.py\nnode_modules/pkg/index.js\nREADME.md\n.git/config\npy,js\nnode_modules,.git",
          expected_output: "2\nsrc/app.py\nsrc/utils.py",
          description:
            "node_modules and .git paths are excluded even when their extension matches; README.md is excluded on extension alone.",
        },
        {
          input: "3\na/b/main.py\na/b/test.pyc\nvendor/lib.py\npy\nvendor",
          expected_output: "1\na/b/main.py",
          description:
            "A .pyc file is excluded by extension; a .py file inside a skipped 'vendor' directory is excluded by path.",
        },
        {
          input: "1\ndocs/readme.md\npy\n",
          expected_output: "0",
          description: "Edge case: no file matches the allowed extensions, so the kept count is 0 with no paths printed.",
        },
      ],
    },

    {
      id: "prod-18-2",
      project_id: "prod-18",
      order: 2,
      title: "Chunk by Function, Not by Character",
      concept: "function-level chunking",
      explanation: `A naive chunker slices code every N characters, and it will happily cut a function in half, leaving one chunk with a signature and no body, and the next with a body and no idea what function it belongs to. Code chunking has to respect syntax, not just length.

## What we're building

This lesson replaces "split every 500 characters" with "split at every function and class." The unit of meaning in code isn't a paragraph, it's a function: everything inside \`def load_config(path):\` belongs together, and mixing it with half of the next function makes retrieval worse, not just uglier.

## Why character-based chunking fails on code

Text chunkers built for prose (split on blank lines, split every N tokens) assume meaning lives in nearby sentences. Code doesn't work that way: a function's signature, its body, and its closing line are one unit whether it's 3 lines or 300. Cut it at a fixed character count and you'll often split a function signature from its logic, so neither half makes sense on its own when it's later retrieved and shown to the model.

## How real chunking works

Python ships a parser for exactly this: the \`ast\` module turns source text into a tree of nodes, and every node knows which lines it spans.

\`\`\`python
import ast

def chunk_by_function(source, path):
    tree = ast.parse(source)
    lines = source.splitlines()
    chunks = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start, end = node.lineno, node.end_lineno
            chunks.append({
                "path": path,
                "start_line": start,
                "end_line": end,
                "text": "\\n".join(lines[start - 1:end]),
            })
    return chunks
\`\`\`

\`node.lineno\` and \`node.end_lineno\` are 1-indexed line numbers \`ast\` computes for you, no manual bracket-counting required. For other languages you'd reach for a tree-sitter parser instead; same idea, let a real parser find function boundaries, don't guess with regex.

## Why it matters

A chunk that's a whole function is a chunk that answers a question on its own. When a user asks "how does the app load its config?", a chunk that IS \`load_config\` end-to-end is exactly the right size to retrieve and to quote back with a citation. A 500-character window covering the last third of one function and the first two-thirds of another answers nothing cleanly.

## The mental model to keep

Chunk at the seams the language already has. A function is a natural, self-contained unit; splitting there instead of at an arbitrary character count is the single highest-leverage decision in a code-RAG pipeline. Below, parse a small file by hand with \`ast\` and confirm each chunk lines up with a real function.`,
      starter_code: `import ast

SOURCE = """import os

def load_config(path):
    with open(path) as f:
        return f.read()

def save_config(path, data):
    with open(path, "w") as f:
        f.write(data)

class ConfigError(Exception):
    pass
"""

def chunk_by_function(source):
    # TODO: parse \`source\` with ast.parse, and for each top-level
    #       FunctionDef / AsyncFunctionDef / ClassDef node in tree.body,
    #       build a dict {"name": node.name, "start_line": node.lineno,
    #       "end_line": node.end_lineno, "text": the source lines from
    #       start_line to end_line joined with a newline}.
    #       Return the list of chunks in order.
    pass

chunks = chunk_by_function(SOURCE)
print("chunks:", len(chunks))
for c in chunks:
    print(c["name"], c["start_line"], c["end_line"])
`,
      solution_code: `import ast

SOURCE = """import os

def load_config(path):
    with open(path) as f:
        return f.read()

def save_config(path, data):
    with open(path, "w") as f:
        f.write(data)

class ConfigError(Exception):
    pass
"""

def chunk_by_function(source):
    tree = ast.parse(source)
    lines = source.splitlines()
    chunks = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start, end = node.lineno, node.end_lineno
            chunks.append({
                "name": node.name,
                "start_line": start,
                "end_line": end,
                "text": "\\n".join(lines[start - 1:end]),
            })
    return chunks

chunks = chunk_by_function(SOURCE)
print("chunks:", len(chunks))
for c in chunks:
    print(c["name"], c["start_line"], c["end_line"])
    print(c["text"])
    print("---")
`,
      hints: [
        "ast.parse(source) returns a tree whose top-level statements live in tree.body.",
        "isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) filters for defs and classes only.",
        "node.lineno and node.end_lineno are already 1-indexed; slice with lines[start - 1:end].",
      ],
      challenge_title: "Find the Function Boundaries",
      challenge_description:
        "Given raw source lines, find where each top-level def or class starts and print the line range it spans.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[1 + i] for i in range(n)]
    # parse done: 'lines' holds the source code, one line per entry
    # (lines[0] is line 1, lines[1] is line 2, and so on)

    # TODO: find every index (1-indexed) where the line starts with "def " or
    #       "class " with NO leading whitespace (a top-level definition).
    # TODO: each chunk ends the line before the next top-level start (or at
    #       line n if it's the final chunk).
    # TODO: if there are no top-level defs/classes, print 0.
    #       Otherwise print the count, then one "start end" line per chunk,
    #       in the order the defs/classes appear.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[1 + i] for i in range(n)]

    starts = [
        i + 1 for i, line in enumerate(lines)
        if line.startswith("def ") or line.startswith("class ")
    ]

    if not starts:
        print(0)
        return

    print(len(starts))
    for idx, start in enumerate(starts):
        end = starts[idx + 1] - 1 if idx + 1 < len(starts) else n
        print(start, end)

main()
`,
      challenge_test_cases: [
        {
          input:
            "7\nimport os\ndef load_config(path):\n    return 1\ndef save_config(path):\n    return 2\nclass ConfigError(Exception):\n    pass",
          expected_output: "3\n2 3\n4 5\n6 7",
          description: "Three top-level definitions; each chunk ends right before the next one starts, the last ends at line 7.",
        },
        {
          input: "2\nimport os\nx = 1",
          expected_output: "0",
          description: "No top-level def or class at all, so the count is 0 and nothing else is printed.",
        },
        {
          input: "3\ndef f():\n    pass\n    return",
          expected_output: "1\n1 3",
          description: "Edge case: a single definition that runs to the last line of the file.",
        },
      ],
    },

    {
      id: "prod-18-3",
      project_id: "prod-18",
      order: 3,
      title: "Tagging Chunks With File and Line Numbers",
      concept: "chunk metadata",
      explanation: `A chunk of code is useless as an answer's evidence unless you know exactly where it came from. This lesson adds the metadata that turns a chunk of text into a citable fact: which file, and which lines.

## What we're building

Every chunk from lesson 2 knows its own start and end line, but only within one file. To answer questions across a whole repo, every chunk needs to be tagged with its file path too, and given a stable ID that uniquely identifies it: \`path:start-end\`. That ID is what eventually shows up in the final answer as \`[src/app.py:12-18]\`.

## Building the corpus

Real RAG systems call this collection of tagged, chunked documents the **corpus**. Building it means walking every source file, chunking each one, and stamping every chunk with its origin:

\`\`\`python
def build_corpus(files):
    corpus = []
    for path, source in files.items():
        for chunk in chunk_by_function(source):
            corpus.append({
                "id": f"{path}:{chunk['start_line']}-{chunk['end_line']}",
                "path": path,
                "start_line": chunk["start_line"],
                "end_line": chunk["end_line"],
                "text": chunk["text"],
            })
    return corpus
\`\`\`

Notice the id is deterministic and human-readable on purpose. You could use a random UUID instead, but a UUID tells a user nothing when it shows up in an answer. \`src/app.py:12-18\` tells them exactly where to look, no lookup table required.

## Why this matters: citations are just IDs, shown

The whole "answer with file and line references" feature you're building toward is really just this: keep the ID attached to every chunk from the moment it's created, all the way through embedding, retrieval, and the final prompt, and then print it back out next to whatever text it produced. If you ever separate a chunk's text from its ID, you cannot recover the citation later. **Metadata has to travel with the chunk everywhere it goes.**

## A common mistake

It's tempting to store chunks as a flat list of strings for simplicity, and keep a separate parallel list of paths. That works until the two lists drift out of sync after one filtering step, and now your citations are silently wrong: confident, specific, and pointing at the wrong file. Keep path, line numbers, and text together in one object per chunk, always.

## The mental model to keep

Every chunk is a **fact with a source**, not just a string. The ID is the footnote number; the path and line range are what that footnote actually says. Below, build a small corpus from a few files by hand and confirm every chunk's ID matches its path and line range exactly.`,
      starter_code: `FILE_CHUNKS = {
    "src/app.py": [
        {"start_line": 3, "end_line": 5, "text": "def load_config(path):\\n    with open(path) as f:\\n        return f.read()"},
        {"start_line": 7, "end_line": 9, "text": "def save_config(path, data):\\n    with open(path, 'w') as f:\\n        f.write(data)"},
    ],
    "src/utils.py": [
        {"start_line": 1, "end_line": 2, "text": "def slugify(text):\\n    return text.lower().replace(' ', '-')"},
    ],
}

def build_corpus(file_chunks):
    # TODO: for every (path, chunks) pair, build one dict per chunk with keys
    #       "id" (f"{path}:{start}-{end}"), "path", "start_line", "end_line",
    #       "text". Return the flat list of all these chunk dicts, in the
    #       order encountered.
    pass

corpus = build_corpus(FILE_CHUNKS)
print("corpus size:", len(corpus))
for doc in corpus:
    print(doc["id"])
`,
      solution_code: `FILE_CHUNKS = {
    "src/app.py": [
        {"start_line": 3, "end_line": 5, "text": "def load_config(path):\\n    with open(path) as f:\\n        return f.read()"},
        {"start_line": 7, "end_line": 9, "text": "def save_config(path, data):\\n    with open(path, 'w') as f:\\n        f.write(data)"},
    ],
    "src/utils.py": [
        {"start_line": 1, "end_line": 2, "text": "def slugify(text):\\n    return text.lower().replace(' ', '-')"},
    ],
}

def build_corpus(file_chunks):
    corpus = []
    for path, chunks in file_chunks.items():
        for chunk in chunks:
            corpus.append({
                "id": f"{path}:{chunk['start_line']}-{chunk['end_line']}",
                "path": path,
                "start_line": chunk["start_line"],
                "end_line": chunk["end_line"],
                "text": chunk["text"],
            })
    return corpus

corpus = build_corpus(FILE_CHUNKS)
print("corpus size:", len(corpus))
for doc in corpus:
    print(doc["id"])

by_id = {doc["id"]: doc for doc in corpus}
print(by_id["src/app.py:3-5"]["text"])
`,
      hints: [
        "Loop file_chunks.items() to get (path, chunks) pairs, then loop chunks for each path.",
        "The id is an f-string: f\"{path}:{chunk['start_line']}-{chunk['end_line']}\".",
        "Append one new flat dict per chunk to the corpus list; don't nest lists inside lists.",
      ],
      challenge_title: "Build the Citation Index",
      challenge_description:
        "Tag chunks from multiple files with file:line IDs, drop exact duplicates, and print the sorted, de-duplicated citation list.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    entries = []
    for _ in range(m):
        path = data[idx].strip(); idx += 1
        k = int(data[idx].strip()); idx += 1
        for _ in range(k):
            start, end = map(int, data[idx].split()); idx += 1
            entries.append((path, start, end))
    # parse done: 'entries' is a list of (path, start, end) tuples, one per
    # chunk, in the order given (duplicates may be present).

    # TODO: build the set of UNIQUE (path, start, end) tuples.
    # TODO: sort them by (path, start, end).
    # TODO: print the count of unique citations, then one "path:start-end"
    #       line per citation in that sorted order.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx].strip()); idx += 1
    entries = []
    for _ in range(m):
        path = data[idx].strip(); idx += 1
        k = int(data[idx].strip()); idx += 1
        for _ in range(k):
            start, end = map(int, data[idx].split()); idx += 1
            entries.append((path, start, end))

    unique = sorted(set(entries))
    print(len(unique))
    for path, start, end in unique:
        print(f"{path}:{start}-{end}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nsrc/app.py\n2\n3 5\n7 9\nsrc/utils.py\n1\n1 1",
          expected_output: "3\nsrc/app.py:3-5\nsrc/app.py:7-9\nsrc/utils.py:1-1",
          description: "Two files with no duplicate chunks; output is sorted by path then by line range.",
        },
        {
          input: "1\nsrc/app.py\n3\n3 5\n3 5\n7 9",
          expected_output: "2\nsrc/app.py:3-5\nsrc/app.py:7-9",
          description: "The same (path, start, end) appears twice; it counts once in the de-duplicated output.",
        },
        {
          input: "1\nsrc/empty.py\n0",
          expected_output: "0",
          description: "Edge case: a file with zero chunks contributes nothing, so the total is 0.",
        },
      ],
    },

    {
      id: "prod-18-4",
      project_id: "prod-18",
      order: 4,
      title: "Retrieval Tuned for Code",
      concept: "hybrid code retrieval",
      explanation: `Plain semantic search, built for prose, has a blind spot on code: an embedding model can miss that a query containing the *exact* function name \`get_user_by_id\` should obviously retrieve the chunk defining \`get_user_by_id\`. Retrieval for code needs a second signal beyond pure semantic similarity: exact identifier matches.

## What we're building

A retriever that combines two scores per chunk: how semantically similar it is to the query (an embedding comparison), and whether the query mentions an identifier, a function or variable name, that appears verbatim in the chunk's name. This is called **hybrid retrieval**, and it's standard practice for code search specifically because identifiers carry more precise meaning in code than in prose.

## Embedding code with a code-aware model

General-purpose text embeddings are trained mostly on prose. For code, use a model trained on code, like Voyage AI's \`voyage-code-2\`:

\`\`\`python
import voyageai

vo = voyageai.Client()
doc_result = vo.embed(
    [chunk["text"] for chunk in corpus],
    model="voyage-code-2",
    input_type="document",
)
query_result = vo.embed([query], model="voyage-code-2", input_type="query")
\`\`\`

Each chunk and the query become vectors of numbers. Similarity between two vectors is measured with **cosine similarity**: the cosine of the angle between them, from -1 (opposite) to 1 (identical direction). Closer to 1 means more semantically related.

\`\`\`python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b)
\`\`\`

## Adding the code-specific boost

Cosine similarity alone still misses exact-match cases: a query like "what does load_config do" should heavily favor the chunk literally named \`load_config\`, even if its embedding similarity is only decent. The fix is a simple bonus added on top:

\`\`\`python
def hybrid_score(cosine_sim, query, chunk_name):
    bonus = 0.25 if chunk_name and chunk_name in query else 0
    return cosine_sim + bonus
\`\`\`

## Why it matters

Pure semantic search is tuned for "these two paragraphs mean similar things." Code search often needs "this literal name was mentioned," which is a precision, not a paraphrase, problem. Blending the two catches both cases: a vague conceptual question still finds the right area of code via embeddings, and a specific "what does X do" question reliably finds X, even when its embedding similarity is mediocre.

## The mental model to keep

Semantic similarity finds code that *means* the same thing; the identifier bonus finds code that *is* the thing being asked about. Below, rank a small set of chunks by a combined score, no network call, using pre-computed similarity numbers so you can see exactly how the bonus changes the ranking.`,
      starter_code: `CHUNKS = [
    {"name": "load_config", "cosine_sim": 0.62},
    {"name": "save_config", "cosine_sim": 0.58},
    {"name": "slugify", "cosine_sim": 0.71},
]

QUERY = "how does load_config work"

def hybrid_score(cosine_sim, query, chunk_name):
    # TODO: return cosine_sim, plus a bonus of 0.25 if chunk_name is truthy
    #       and chunk_name appears as a substring of query, else no bonus.
    pass

def rank_chunks(chunks, query):
    # TODO: return chunks sorted by hybrid_score, highest first. Use
    #       hybrid_score(chunk["cosine_sim"], query, chunk["name"]) as the key.
    pass

ranked = rank_chunks(CHUNKS, QUERY)
for c in ranked:
    print(c["name"], round(hybrid_score(c["cosine_sim"], QUERY, c["name"]), 2))
`,
      solution_code: `CHUNKS = [
    {"name": "load_config", "cosine_sim": 0.62},
    {"name": "save_config", "cosine_sim": 0.58},
    {"name": "slugify", "cosine_sim": 0.71},
]

QUERY = "how does load_config work"

def hybrid_score(cosine_sim, query, chunk_name):
    bonus = 0.25 if chunk_name and chunk_name in query else 0
    return cosine_sim + bonus

def rank_chunks(chunks, query):
    return sorted(
        chunks,
        key=lambda c: hybrid_score(c["cosine_sim"], query, c["name"]),
        reverse=True,
    )

ranked = rank_chunks(CHUNKS, QUERY)
for c in ranked:
    print(c["name"], round(hybrid_score(c["cosine_sim"], QUERY, c["name"]), 2))
`,
      hints: [
        "The bonus check is just chunk_name in query (a substring test), guarded by chunk_name being non-empty.",
        "sorted(..., key=..., reverse=True) sorts the highest score first.",
        "rank_chunks should call the same hybrid_score function the print loop uses, just as the sort key.",
      ],
      challenge_title: "Score and Rank Code Chunks",
      challenge_description:
        "Combine a cosine similarity score with an identifier-match bonus, then rank chunks and return the top K.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    chunks = []
    for i in range(n):
        parts = data[1 + i].split()
        chunk_id, cosine_sim, is_match = parts[0], float(parts[1]), int(parts[2])
        chunks.append((chunk_id, cosine_sim, is_match))
    k = int(data[1 + n].strip())
    # parse done: 'chunks' is a list of (id, cosine_sim, identifier_match) in
    # input order; 'k' is how many top results to return.

    # TODO: compute score = cosine_sim + (0.25 if identifier_match else 0)
    #       for each chunk.
    # TODO: sort DESCENDING by score, keeping the original order for ties
    #       (Python's sort is stable, so sort by the negative score).
    # TODO: print the top k as "id score", score formatted to 3 decimals.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    chunks = []
    for i in range(n):
        parts = data[1 + i].split()
        chunk_id, cosine_sim, is_match = parts[0], float(parts[1]), int(parts[2])
        chunks.append((chunk_id, cosine_sim, is_match))
    k = int(data[1 + n].strip())

    scored = [
        (chunk_id, cosine_sim + (0.25 if is_match else 0))
        for chunk_id, cosine_sim, is_match in chunks
    ]
    scored.sort(key=lambda pair: -pair[1])

    for chunk_id, score in scored[:k]:
        print(f"{chunk_id} {score:.3f}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\nc1 0.50 0\nc2 0.50 1\nc3 0.25 1\nc4 0.75 0\n2",
          expected_output: "c2 0.750\nc4 0.750",
          description: "c2 and c4 tie at 0.750 after the bonus; the tie keeps their original input order.",
        },
        {
          input: "2\nc1 0.50 0\nc2 0.50 1\n5",
          expected_output: "c2 0.750\nc1 0.500",
          description: "Asking for more results than exist (k=5) just returns all n, sorted.",
        },
        {
          input: "3\na 0.10 0\nb 0.10 0\nc 0.10 0\n2",
          expected_output: "a 0.100\nb 0.100",
          description: "Edge case: every chunk ties with no bonus applied, so the top k is simply the first k in input order.",
        },
      ],
    },

    {
      id: "prod-18-5",
      project_id: "prod-18",
      order: 5,
      title: "Answering With Citations",
      concept: "grounded answers with file:line refs",
      explanation: `A code assistant that answers confidently but doesn't say where it got the answer isn't trustworthy, it's a black box. This lesson wires retrieval into a prompt that forces every claim to point at a real file and line range.

## What we're building

Given a user's question and the top-ranked chunks from lesson 4, assemble a context block that labels every chunk with its citation, then instruct the model to answer *only* from that context and cite the file:line range for every fact it states.

## Building the context block

Each retrieved chunk already has an \`id\` like \`src/app.py:3-5\` from lesson 3. Format them into a labeled block the model can read and refer back to:

\`\`\`python
def build_context(chunks):
    blocks = []
    for chunk in chunks:
        blocks.append(f"[{chunk['id']}]\\n{chunk['text']}")
    return "\\n\\n".join(blocks)
\`\`\`

## The system prompt does the grounding

\`\`\`python
SYSTEM = """You are a codebase assistant. Answer ONLY using the code
provided in CONTEXT below. Never guess about code you can't see.
For every claim, cite the exact chunk it came from in square
brackets, like [src/app.py:3-5]. If the context doesn't contain
the answer, say so instead of guessing."""

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system=SYSTEM,
    messages=[{"role": "user", "content": f"CONTEXT:\\n{context}\\n\\nQUESTION: {question}"}],
)
\`\`\`

Two rules do all the work: "answer only from context" stops the model from inventing plausible-sounding code it never actually saw, and "cite in brackets" gives you a citation format you can programmatically check later.

## Parsing citations back out

Once the reply comes back, you need to pull the citations out of the text to display them, or, in a later lesson, to verify them:

\`\`\`python
import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def extract_citations(answer_text):
    return [f"{path}:{start}-{end}" for path, start, end in CITATION_RE.findall(answer_text)]
\`\`\`

## Why it matters

Citations turn a code assistant from "trust me" into "check me." A user reading \`[src/auth.py:40-52]\` in an answer can jump straight to that exact function and verify the claim in seconds, instead of grepping the whole repo hoping to spot what the model meant.

## The mental model to keep

The context block is evidence, the system prompt is the rule that the model may only speak from evidence, and the citation is the receipt. Below, extract citations from a sample reply with plain regex, no network call, so you can see exactly what the parsing step has to handle.`,
      starter_code: `import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

SAMPLE_REPLY = (
    "The app loads its settings in [src/app.py:3-5], which opens the file "
    "and reads it. Saving is handled separately in [src/app.py:7-9]."
)

def extract_citations(answer_text):
    # TODO: use CITATION_RE.findall(answer_text) to get (path, start, end)
    #       tuples, then format each as "path:start-end" and return the
    #       list, in the order they appear.
    pass

citations = extract_citations(SAMPLE_REPLY)
print("found:", len(citations))
for c in citations:
    print(c)
`,
      solution_code: `import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

SAMPLE_REPLY = (
    "The app loads its settings in [src/app.py:3-5], which opens the file "
    "and reads it. Saving is handled separately in [src/app.py:7-9]."
)

def extract_citations(answer_text):
    matches = CITATION_RE.findall(answer_text)
    return [f"{path}:{start}-{end}" for path, start, end in matches]

citations = extract_citations(SAMPLE_REPLY)
print("found:", len(citations))
for c in citations:
    print(c)
`,
      hints: [
        "CITATION_RE.findall returns a list of tuples, one per match, in (path, start, end) order.",
        "Use an f-string to rejoin each tuple into the 'path:start-end' shape.",
        "The character class [\\w./-] covers letters, digits, underscore, dot, slash, and hyphen, everything a file path needs.",
      ],
      challenge_title: "Extract Citations From an Answer",
      challenge_description:
        "Pull every [path:start-end] citation out of a multi-line model reply, in the order it appears.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[1 + i] for i in range(n)]
    # parse done: 'lines' holds the answer text, one line per entry

    # TODO: for each line, find every [path:start-end] citation using
    #       CITATION_RE.findall, in the order lines and matches appear.
    # TODO: print the total count found, then each citation formatted as
    #       "path:start-end" on its own line, in order. If none are found,
    #       print just 0.

main()
`,
      challenge_solution_code: `import sys
import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[1 + i] for i in range(n)]

    citations = []
    for line in lines:
        for path, start, end in CITATION_RE.findall(line):
            citations.append(f"{path}:{start}-{end}")

    print(len(citations))
    for c in citations:
        print(c)

main()
`,
      challenge_test_cases: [
        {
          input:
            "2\nThe config loader is defined in [src/app.py:12-18] and saved via [src/app.py:20-25].\nSee also [src/utils.py:1-5] for helpers.",
          expected_output: "3\nsrc/app.py:12-18\nsrc/app.py:20-25\nsrc/utils.py:1-5",
          description: "Two citations on the first line and one on the second, all returned in reading order.",
        },
        {
          input: "1\nThis code loads a config file safely.",
          expected_output: "0",
          description: "No bracketed citations at all; the count is 0 and nothing else is printed.",
        },
        {
          input: "1\nDefined in [lib/my_util-v2.py:3-4].",
          expected_output: "1\nlib/my_util-v2.py:3-4",
          description: "Edge case: a path containing an underscore and a hyphen is still matched correctly.",
        },
      ],
    },

    {
      id: "prod-18-6",
      project_id: "prod-18",
      order: 6,
      title: "Budgeting the Retrieval Window",
      concept: "retrieval budget",
      explanation: `Retrieval doesn't stop at "find the best chunks," it has to stop at "find the best chunks that actually fit." Send too many chunks and you blow past the context window or the bill; send too few and the answer misses key code. This lesson adds the budget check.

## What we're building

A function that walks chunks in ranked order (best match first, from lesson 4) and greedily keeps whichever ones fit inside a token budget, skipping any that are exact duplicates of a chunk already included.

## Why duplicates happen

It's common for the same exact chunk to surface twice: a query might independently match a function both by embedding similarity and by an identifier bonus, landing it in the ranked list twice with two different scores. Sending the same 40 lines of code to the model twice wastes tokens and adds nothing.

\`\`\`python
def dedupe_and_budget(ranked_chunks, budget):
    seen = set()
    kept = []
    used = 0
    for chunk in ranked_chunks:
        key = (chunk["path"], chunk["start_line"], chunk["end_line"])
        if key in seen:
            continue
        cost = len(chunk["text"]) // 4
        if used + cost > budget:
            continue
        seen.add(key)
        kept.append(chunk)
        used += cost
    return kept, used
\`\`\`

Notice this **keeps going past a chunk that doesn't fit**, instead of stopping the moment one is too big. A high-ranked, expensive chunk might not fit, but the next three lower-ranked, smaller chunks still might, and each one you fit is still useful context. Stopping early would waste budget you could have spent.

## Why the token math matters here specifically

Every chunk you include is code, and code is often denser and more repetitive than prose (whitespace, boilerplate, brackets), so a naive character-count estimate can undercount real token cost on some languages. For a first pass, the same rough "4 characters per token" estimate from earlier lessons works fine; for production accuracy, count with the real tokenizer before you ship.

## Why it matters

Without a budget, a big-repository question ("how does auth work end to end") can retrieve a dozen genuinely relevant functions that together blow past the context window, and the call simply fails. With a budget, you get a deterministic, best-effort selection: the most relevant code that actually fits, guaranteed to make every call succeed.

## The mental model to keep

Ranking answers "what's most relevant"; budgeting answers "how much of that can I actually afford to send." They're separate steps on purpose: keep ranking pure and let budgeting decide the cutoff, so you can tune the budget without ever touching how relevance is scored.`,
      starter_code: `RANKED_CHUNKS = [
    {"path": "src/auth.py", "start_line": 10, "end_line": 30, "text": "x" * 400},
    {"path": "src/auth.py", "start_line": 10, "end_line": 30, "text": "x" * 400},
    {"path": "src/utils.py", "start_line": 1, "end_line": 5, "text": "y" * 80},
    {"path": "src/db.py", "start_line": 5, "end_line": 15, "text": "z" * 120},
]

def dedupe_and_budget(ranked_chunks, budget):
    # TODO: walk ranked_chunks in order. Skip a chunk if its (path,
    #       start_line, end_line) was already kept. Estimate its cost as
    #       len(text) // 4. Keep it only if used + cost <= budget, and keep
    #       checking later chunks even after skipping one that doesn't fit.
    #       Return (kept_list, total_tokens_used).
    pass

kept, used = dedupe_and_budget(RANKED_CHUNKS, 150)
print("kept:", len(kept))
print("used:", used)
`,
      solution_code: `RANKED_CHUNKS = [
    {"path": "src/auth.py", "start_line": 10, "end_line": 30, "text": "x" * 400},
    {"path": "src/auth.py", "start_line": 10, "end_line": 30, "text": "x" * 400},
    {"path": "src/utils.py", "start_line": 1, "end_line": 5, "text": "y" * 80},
    {"path": "src/db.py", "start_line": 5, "end_line": 15, "text": "z" * 120},
]

def dedupe_and_budget(ranked_chunks, budget):
    seen = set()
    kept = []
    used = 0
    for chunk in ranked_chunks:
        key = (chunk["path"], chunk["start_line"], chunk["end_line"])
        if key in seen:
            continue
        cost = len(chunk["text"]) // 4
        if used + cost > budget:
            continue
        seen.add(key)
        kept.append(chunk)
        used += cost
    return kept, used

kept, used = dedupe_and_budget(RANKED_CHUNKS, 150)
print("kept:", len(kept))
print("used:", used)
for c in kept:
    print(c["path"], c["start_line"], c["end_line"])
`,
      hints: [
        "Build the dedupe key from (path, start_line, end_line) as a tuple, not from the chunk's text.",
        "cost = len(chunk['text']) // 4 matches the same rough token estimate used earlier.",
        "Use continue, not break, when a chunk doesn't fit, a smaller one later might still fit.",
      ],
      challenge_title: "Fit Chunks in the Retrieval Budget",
      challenge_description:
        "Greedily keep ranked chunks that fit a token budget, skipping exact-duplicate line ranges already included.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    chunks = []
    for i in range(n):
        parts = data[2 + i].split()
        chunk_id, tokens, path, start, end = parts[0], int(parts[1]), parts[2], int(parts[3]), int(parts[4])
        chunks.append((chunk_id, tokens, path, start, end))
    # parse done: 'chunks' is given in ranked (best-first) order already.

    # TODO: walk chunks in order. Track a set of (path, start, end) already
    #       included. Skip a chunk whose (path, start, end) is already in
    #       that set. Otherwise include it only if the running token total
    #       plus its tokens is <= budget (skip it, but keep checking later
    #       chunks, if it doesn't fit).
    # TODO: print the count included, then each included chunk's id in the
    #       order it was included, then the final token total used.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    chunks = []
    for i in range(n):
        parts = data[2 + i].split()
        chunk_id, tokens, path, start, end = parts[0], int(parts[1]), parts[2], int(parts[3]), int(parts[4])
        chunks.append((chunk_id, tokens, path, start, end))

    seen = set()
    included = []
    used = 0
    for chunk_id, tokens, path, start, end in chunks:
        key = (path, start, end)
        if key in seen:
            continue
        if used + tokens > budget:
            continue
        seen.add(key)
        included.append(chunk_id)
        used += tokens

    print(len(included))
    for cid in included:
        print(cid)
    print(used)

main()
`,
      challenge_test_cases: [
        {
          input: "100\n4\nc1 40 src/app.py 3 5\nc2 50 src/app.py 3 5\nc3 30 src/utils.py 1 4\nc4 20 src/app.py 7 9",
          expected_output: "3\nc1\nc3\nc4\n90",
          description: "c2 is skipped as a duplicate of c1's exact line range; c1, c3, c4 fit within the 100-token budget.",
        },
        {
          input: "25\n3\nc1 30 a.py 1 2\nc2 10 a.py 1 2\nc3 10 b.py 3 4",
          expected_output: "2\nc2\nc3\n20",
          description: "c1 doesn't fit the budget and is skipped without being marked as seen, so c2's identical range is still included.",
        },
        {
          input: "50\n2\nc1 20 x.py 1 1\nc2 20 x.py 1 1",
          expected_output: "1\nc1\n20",
          description: "Edge case: c1 is included first, so c2's identical range is skipped as a duplicate even though it would fit the budget.",
        },
      ],
    },

    {
      id: "prod-18-7",
      project_id: "prod-18",
      order: 7,
      title: "Guarding Against Hallucinated Citations",
      concept: "citation verification",
      explanation: `A citation only means something if it's real. A model can format \`[src/auth.py:200-210]\` with total confidence even when no such chunk was ever retrieved, quietly inventing a location that looks exactly as trustworthy as a correct one. This lesson catches that.

## The failure mode

Everything from lesson 5 makes the model *format* citations correctly. It does not guarantee the citations are *true*. Two ways this breaks in practice:

1. The model paraphrases from its own training knowledge of common code patterns instead of the actual retrieved chunk, and slaps on a citation that looks plausible but doesn't match anything you actually sent it.
2. The model cites a real file in the repo, but a line range that was never part of any chunk you retrieved, close enough to be believable, wrong enough to send someone down the wrong path.

Both look identical to a correct citation until you check them against what was actually retrieved.

## The verification step

You already have the ground truth: the exact set of chunk IDs you put in the context block. Verifying a citation is a membership check against that set, nothing more:

\`\`\`python
def verify_citations(answer_text, retrieved_ids):
    cited = set(extract_citations(answer_text))
    retrieved = set(retrieved_ids)
    fabricated = cited - retrieved
    return fabricated
\`\`\`

If \`fabricated\` is non-empty, the answer contains at least one reference to code that was never actually shown to the model, a strong signal to flag or reject the answer rather than display it as trustworthy.

## The other edge: no citations at all

An answer with zero citations is its own kind of failure: either the model ignored the "always cite" instruction, or it's answering from general knowledge instead of your actual code. Either way, that answer shouldn't be shown to a user as grounded fact without a warning.

\`\`\`python
def classify_answer(answer_text, retrieved_ids):
    cited = extract_citations(answer_text)
    if not cited:
        return "NO_CITATIONS"
    if set(cited) - set(retrieved_ids):
        return "UNGROUNDED"
    return "GROUNDED"
\`\`\`

## Why it matters

For a codebase assistant, a wrong citation is worse than no citation: it sends a developer confidently to the wrong function, wasting their time under the belief the tool is reliable. Verifying every citation against the actual retrieved set before showing an answer is the cheapest trust-repair step available, and it costs nothing beyond a set difference.

## The mental model to keep

Extraction tells you what the model *claimed*. Verification tells you whether the claim is *true*. Never ship the first without the second; a codebase assistant that can't tell you when it's guessing is more dangerous than one that admits it doesn't know.`,
      starter_code: `import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def extract_citations(answer_text):
    return [f"{path}:{start}-{end}" for path, start, end in CITATION_RE.findall(answer_text)]

RETRIEVED_IDS = ["src/app.py:3-5", "src/utils.py:1-4"]
ANSWER = "Config loads in [src/app.py:3-5], and formatting happens in [src/format.py:9-12]."

def classify_answer(answer_text, retrieved_ids):
    # TODO: extract citations from answer_text.
    #       If there are none, return "NO_CITATIONS".
    #       If any cited id is missing from retrieved_ids, return "UNGROUNDED".
    #       Otherwise return "GROUNDED".
    pass

print(classify_answer(ANSWER, RETRIEVED_IDS))
`,
      solution_code: `import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def extract_citations(answer_text):
    return [f"{path}:{start}-{end}" for path, start, end in CITATION_RE.findall(answer_text)]

RETRIEVED_IDS = ["src/app.py:3-5", "src/utils.py:1-4"]
ANSWER = "Config loads in [src/app.py:3-5], and formatting happens in [src/format.py:9-12]."

def classify_answer(answer_text, retrieved_ids):
    cited = extract_citations(answer_text)
    if not cited:
        return "NO_CITATIONS"
    if set(cited) - set(retrieved_ids):
        return "UNGROUNDED"
    return "GROUNDED"

print(classify_answer(ANSWER, RETRIEVED_IDS))
`,
      hints: [
        "Reuse extract_citations to get the list of ids the model actually cited.",
        "An empty list is falsy in Python: check 'if not cited' first, before anything else.",
        "set(cited) - set(retrieved_ids) gives you exactly the fabricated ones; non-empty means UNGROUNDED.",
      ],
      challenge_title: "Catch the Hallucinated Citation",
      challenge_description:
        "Classify a model's answer as GROUNDED, UNGROUNDED, or NO_CITATIONS by checking its citations against what was actually retrieved.",
      challenge_language: "python",
      challenge_starter_code: `import sys
import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    valid = set(data[idx + i].strip() for i in range(k)); idx += k
    m = int(data[idx].strip()); idx += 1
    answer_lines = [data[idx + i] for i in range(m)]
    # parse done: 'valid' is the set of citations that were actually
    # retrieved; 'answer_lines' is the model's answer, one entry per line.

    # TODO: find every [path:start-end] citation across all answer_lines,
    #       IN ORDER of appearance, using CITATION_RE.
    # TODO: if none were found, print "NO_CITATIONS".
    # TODO: else if any found citation is not in 'valid', print "UNGROUNDED"
    #       then the FIRST such invalid citation (in order of appearance).
    # TODO: else print "GROUNDED" then the total count of citations found.

main()
`,
      challenge_solution_code: `import sys
import re

CITATION_RE = re.compile(r"\\[([\\w./-]+):(\\d+)-(\\d+)\\]")

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    valid = set(data[idx + i].strip() for i in range(k)); idx += k
    m = int(data[idx].strip()); idx += 1
    answer_lines = [data[idx + i] for i in range(m)]

    cited = []
    for line in answer_lines:
        for path, start, end in CITATION_RE.findall(line):
            cited.append(f"{path}:{start}-{end}")

    if not cited:
        print("NO_CITATIONS")
        return

    for c in cited:
        if c not in valid:
            print("UNGROUNDED")
            print(c)
            return

    print("GROUNDED")
    print(len(cited))

main()
`,
      challenge_test_cases: [
        {
          input: "2\nsrc/app.py:3-5\nsrc/utils.py:1-4\n1\nSee [src/app.py:3-5] and also [src/utils.py:1-4] for details.",
          expected_output: "GROUNDED\n2",
          description: "Both citations in the answer match the retrieved set exactly.",
        },
        {
          input: "1\nsrc/app.py:3-5\n1\nPer [src/app.py:3-5] and [src/other.py:9-12], done.",
          expected_output: "UNGROUNDED\nsrc/other.py:9-12",
          description: "The second citation was never retrieved, so the answer is flagged with the first fabricated reference.",
        },
        {
          input: "1\na.py:1-2\n1\nThis code loads a config file safely.",
          expected_output: "NO_CITATIONS",
          description: "Edge case: the answer contains no bracketed citations at all.",
        },
      ],
    },

    {
      id: "prod-18-8",
      project_id: "prod-18",
      order: 8,
      title: "Shipping the Codebase Assistant",
      concept: "putting the pipeline together",
      explanation: `Every piece exists: ingestion, function-level chunking, tagged metadata, hybrid retrieval, a citation-forcing prompt, budget limits, and a hallucination guard. This lesson wires them into one pipeline and calls it done.

## The full pipeline, end to end

\`\`\`python
def answer_question(question, corpus, client):
    ranked = rank_chunks(corpus, question)                  # lesson 4
    selected, _ = dedupe_and_budget(ranked, budget=4000)     # lesson 6
    context = build_context(selected)                       # lesson 5
    retrieved_ids = [c["id"] for c in selected]

    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=SYSTEM,
        messages=[{"role": "user", "content": f"CONTEXT:\\n{context}\\n\\nQUESTION: {question}"}],
    )
    answer_text = resp.content[0].text
    status = classify_answer(answer_text, retrieved_ids)     # lesson 7
    return answer_text, status
\`\`\`

Eight lessons compress into roughly ten lines here, because each one only had to solve one small, correct piece; the pipeline is just calling them in order.

## What "shipped" means for this project

1. It runs on a real repo, top to bottom, with one function call.
2. A question with no relevant code in the repo gets \`NO_CITATIONS\`, not a confident guess.
3. Every answer that does get shown carries citations you've verified are real.

If those three hold, you have a genuinely useful tool, not a demo that only works on the one example you tested with.

## A quick pre-ship checklist

- Does ingestion skip \`node_modules\`, \`.git\`, and build output? (lesson 1)
- Are chunks whole functions, not arbitrary character windows? (lesson 2)
- Does every chunk carry its path and line range through the whole pipeline? (lesson 3)
- Does retrieval catch both "what does X mean" and "what does function X do"? (lesson 4)
- Does the system prompt force citations, and can you parse them back out? (lesson 5)
- Is there a hard token budget so large repos can't blow the context window? (lesson 6)
- Do you reject or flag answers whose citations don't match what was retrieved? (lesson 7)

## Why it matters

A tool that answers questions about a codebase is only as trustworthy as its weakest link. Skip the budget step and it crashes on big repos; skip the verification step and it lies convincingly. Shipping means every link holds, not just the happy path you tried in lesson 1.

## You're done, and it's in your Portfolio

Finishing this lesson saves **Codebase Assistant** to your Portfolio automatically: a real tool that ingests a repository, retrieves relevant code, and answers with receipts. That's the shelf you're building toward, one verified, cited answer at a time.`,
      starter_code: `CORPUS = [
    {"id": "src/app.py:3-5", "path": "src/app.py", "start_line": 3, "end_line": 5,
     "text": "def load_config(path):\\n    with open(path) as f:\\n        return f.read()"},
    {"id": "src/utils.py:1-2", "path": "src/utils.py", "start_line": 1, "end_line": 2,
     "text": "def slugify(text):\\n    return text.lower().replace(' ', '-')"},
]

def keyword_overlap(query, text):
    query_words = set(query.lower().split())
    text_words = set(text.lower().replace("(", " ").replace(")", " ").split())
    return len(query_words & text_words)

def answer_question(question, corpus):
    # TODO: score every chunk in corpus with keyword_overlap(question, chunk["text"]).
    #       Track the chunk with the highest score (a later chunk only
    #       replaces it on a STRICTLY greater score, so ties keep the first).
    #       If the best score is 0, return ("NO_MATCH", None).
    #       Otherwise return (chunk["id"], best_score).
    pass

result_id, score = answer_question("how does load_config work", CORPUS)
print(result_id, score)
`,
      solution_code: `CORPUS = [
    {"id": "src/app.py:3-5", "path": "src/app.py", "start_line": 3, "end_line": 5,
     "text": "def load_config(path):\\n    with open(path) as f:\\n        return f.read()"},
    {"id": "src/utils.py:1-2", "path": "src/utils.py", "start_line": 1, "end_line": 2,
     "text": "def slugify(text):\\n    return text.lower().replace(' ', '-')"},
]

def keyword_overlap(query, text):
    query_words = set(query.lower().split())
    text_words = set(text.lower().replace("(", " ").replace(")", " ").split())
    return len(query_words & text_words)

def answer_question(question, corpus):
    best_chunk = None
    best_score = 0
    for chunk in corpus:
        score = keyword_overlap(question, chunk["text"])
        if score > best_score:
            best_score = score
            best_chunk = chunk
    if best_chunk is None:
        return "NO_MATCH", None
    return best_chunk["id"], best_score

result_id, score = answer_question("how does load_config work", CORPUS)
print(result_id, score)
`,
      hints: [
        "keyword_overlap is already given; just call it once per chunk inside the loop.",
        "Only replace best_score on a STRICTLY greater score, so an earlier tied chunk keeps priority.",
        "If no chunk ever beats a score of 0, there's no real match, return NO_MATCH.",
      ],
      challenge_title: "Route the Question to the Right Chunk",
      challenge_description:
        "Score chunks by keyword overlap with a query, pick the best match, and report its citation, or flag when nothing matches at all.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split()
        path, start, end = parts[0], int(parts[1]), int(parts[2])
        keywords = set(w.lower() for w in parts[3:])
        chunks.append((path, start, end, keywords))
    query_words = set(w.lower() for w in lines[1 + n].split())
    # parse done: 'chunks' is a list of (path, start, end, keyword_set) in
    # the order given; 'query_words' is the lowercased query word set.

    # TODO: for each chunk, compute overlap = len(keywords & query_words).
    # TODO: pick the chunk with the HIGHEST overlap; on a tie, keep the
    #       FIRST chunk given (don't replace on equal scores).
    # TODO: if the best overlap is 0, print "NO_MATCH".
    #       Otherwise print "path:start-end" then the overlap count.

main()
`,
      challenge_solution_code: `import sys

def main():
    lines = sys.stdin.read().split("\\n")
    n = int(lines[0].strip())
    chunks = []
    for i in range(n):
        parts = lines[1 + i].split()
        path, start, end = parts[0], int(parts[1]), int(parts[2])
        keywords = set(w.lower() for w in parts[3:])
        chunks.append((path, start, end, keywords))
    query_words = set(w.lower() for w in lines[1 + n].split())

    best = None
    best_overlap = 0
    for path, start, end, keywords in chunks:
        overlap = len(keywords & query_words)
        if overlap > best_overlap:
            best_overlap = overlap
            best = (path, start, end)

    if best is None:
        print("NO_MATCH")
        return

    path, start, end = best
    print(f"{path}:{start}-{end}")
    print(best_overlap)

main()
`,
      challenge_test_cases: [
        {
          input:
            "3\nsrc/app.py 3 5 load config file read\nsrc/utils.py 1 4 helper util format string\nsrc/db.py 10 20 database connection query execute\nload config please",
          expected_output: "src/app.py:3-5\n2",
          description: "The first chunk shares 'load' and 'config' with the query, more than any other chunk.",
        },
        {
          input: "2\na.py 1 2 alpha beta gamma\nb.py 3 4 alpha beta delta\nalpha beta",
          expected_output: "a.py:1-2\n2",
          description: "Both chunks tie with an overlap of 2; the first one given wins the tie.",
        },
        {
          input: "1\nx.py 1 1 foo bar\nbaz qux",
          expected_output: "NO_MATCH",
          description: "Edge case: no keyword overlap at all between the query and any chunk.",
        },
      ],
    },
  ],
}
