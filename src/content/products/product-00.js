const project = {
  id: "prod-00",
  title: "How to Build with AI: The Playbook",
  description:
    "An optional warm-up before the build track. You learn the loop every AI product follows, set up Python and your API key once, and see how each project guide is laid out. By the end nothing in the track feels unfamiliar.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 60,
  lessons_count: 6,
  tags: ["setup", "workflow", "python", "api-key", "getting-started"],
  order: 100,
  cover_image: "",
  track: "ai",
  kind: "product",
  optional: true,
};

const lessons = [
  {
    id: "prod-00-1",
    project_id: "prod-00",
    order: 1,
    title: "Every AI Product Is the Same Loop",
    concept: "the build loop",
    illustrative: true,
    explanation:
      "Before you build twenty-two products, learn the one shape they all share. Every AI product, from a text summarizer to a research agent, is the same six-step loop in different clothes.\n\n## The loop\n\n1. **Input**: get something from the user (text, a file, an image, a question).\n2. **Prompt**: turn that input into clear instructions for the model.\n3. **Call**: send it to the model and wait for a reply.\n4. **Parse**: pull the useful part out of the reply (a summary, a JSON object, an answer).\n5. **Verify**: check the reply is good, and retry or repair it if not.\n6. **Ship**: do something real with the result. Print it, save it, show it in a UI.\n\nThat's it. A chatbot loops steps 1-6 forever. A summarizer runs them once. A RAG app adds a search step between input and prompt. The skeleton never changes.\n\n## Where projects differ\n\nBeginners get lost because every tutorial looks different. Once you see the loop, every project turns into one question: which step is special here? A vision app changes step 1, since the input is an image. A structured-data tool changes step 4 and parses into JSON. An agent repeats steps 2-5 in a cycle. You are never learning a brand-new thing. You are swapping one step of a loop you already know.\n\n## What a \"real deliverable\" means\n\nEvery guide in this track ends with something you can run and show. Not a quiz score. An artifact: a script, a tool, a small app. When you finish a project, it gets saved to your **Portfolio** tab automatically. By the end you have a shelf of working things, not a certificate.\n\n## The mental model to keep\n\nAn AI product is a plain program with one unusual function call in the middle. You already know how to read input, call a function, and print output. The model is just a very powerful, slightly unreliable function. The rest of this track is how to call it well and handle it when it misbehaves.",
  },
  {
    id: "prod-00-2",
    project_id: "prod-00",
    order: 2,
    title: "Set Up Once, Build Forever",
    concept: "environment and API key",
    illustrative: true,
    explanation:
      "You set this up one time, then stop thinking about it. The goal of this lesson is one Python file that makes a real model call and prints a reply.\n\n## What you need\n\n- **Python 3.10+** installed. Check with `python --version` in a terminal.\n- **A code editor** (VS Code is free and fine).\n- **An API key** from a model provider. This track uses simple HTTP calls, so any provider works. You paste your key once.\n\n## Install the basics\n\n```bash\npip install requests\n```\n\nThat's the only library you need to start. `requests` makes HTTP calls. Provider SDKs are nice later, but plain HTTP shows you exactly what's happening.\n\n## The one rule about keys: never hard-code them\n\nA key is a password that can spend money. Do **not** paste it into your code, where it could end up on GitHub. Put it in an environment variable instead:\n\n```bash\nexport AI_API_KEY=\"your-key-here\"      # macOS / Linux\n```\n\nThen read it in Python:\n\n```python\nimport os\n\nkey = os.environ[\"AI_API_KEY\"]\nif not key:\n    raise SystemExit(\"Set AI_API_KEY first.\")\nprint(\"Key loaded, length:\", len(key))\n```\n\nIf that prints a length instead of an error, you are ready. If it crashes, the variable isn't set in this terminal, so set it again.\n\n## Why bother\n\nHard-coded keys are the most common way beginners leak credentials and rack up surprise bills. Reading from the environment costs you three lines now and removes that whole class of problem. Every project in this track assumes your key lives in `AI_API_KEY`.",
  },
  {
    id: "prod-00-3",
    project_id: "prod-00",
    order: 3,
    title: "How to Read a Project Guide",
    concept: "the 8-lesson structure",
    illustrative: true,
    explanation:
      "Every build guide in this track has the same eight-lesson shape. Know the shape and you always know where you are and what's next.\n\n## The arc of a project\n\n- **Lessons 1-2, Setup:** the smallest version that does one real thing. You get an early win.\n- **Lessons 3-5, Core:** the actual product logic, one piece at a time.\n- **Lessons 6-7, Harden:** the boring part that keeps it working: errors, edge cases, cost.\n- **Lesson 8, Ship:** package it, run it for real, and it lands in your Portfolio.\n\nThe momentum is deliberate. A rough thing that works early, a real thing that works well by the end.\n\n## What's in each lesson\n\n- **Explanation**: the concept and the plan, in plain language. Read this first.\n- **Starter code**: a scaffold with `TODO`s. You fill the gaps.\n- **Solution code**: the worked answer. Peek if stuck, but don't copy blind.\n- **Hints**: nudges when you're close but not there.\n- **Challenge**: a small graded problem that proves you understood, before you move on.\n\n## How to actually use it\n\n1. Read the explanation once, top to bottom, no coding.\n2. Open the starter and try the `TODO`s from memory.\n3. Stuck for more than a few minutes? Read one hint, not the whole solution.\n4. Run it. Broken output teaches faster than a correct explanation.\n5. Do the challenge. If it passes, you earned the next lesson.\n\n## Getting unstuck\n\nWhen something breaks, read the error's **last line** first. It usually names the problem. Then print the thing right before it fails. Nine times out of ten the model returned a slightly different shape than you expected, and one `print()` shows you exactly what.",
  },
  {
    id: "prod-00-4",
    project_id: "prod-00",
    order: 4,
    title: "The Reusable Prompt Skeleton",
    concept: "writing prompts for products",
    illustrative: true,
    explanation:
      "A prompt inside a product is not a chat message. It's a function's instructions. It runs a thousand times on inputs you'll never see, so it has to be precise and boring. Here's a skeleton you'll reuse in almost every project.\n\n## System vs user\n\nMost APIs take two kinds of message:\n\n- **System**: the standing rules. Who the model is, what to do, what format to return. Set once.\n- **User**: the actual input for this run.\n\nSeparate them and you write the rules once and swap only the input each call.\n\n## The skeleton\n\n```python\nSYSTEM = \"\"\"You are a {role}.\nYour job: {task}.\nRules:\n- {constraint 1}\n- {constraint 2}\nReturn: {exact output format}.\"\"\"\n\ndef build_messages(user_input):\n    return [\n        {\"role\": \"system\", \"content\": SYSTEM},\n        {\"role\": \"user\", \"content\": user_input},\n    ]\n```\n\nFill the braces per product. A summarizer's `task` is \"summarize the text in 3 sentences.\" An extractor's `Return` is \"a JSON object with keys name, email, phone.\"\n\n## The rules that fix most bad output\n\n1. **Say the format exactly.** \"Return JSON\" beats \"give me the data.\" \"Three bullet points\" beats \"be concise.\"\n2. **Show, don't just tell.** One tiny example in the system prompt is worth a paragraph of rules.\n3. **Constrain the scope.** \"If the text has no email, return null\" stops the model from inventing one.\n\n## Why specific prompts win\n\nVague prompts fail silently. The model returns something plausible that breaks your parsing step. A specific prompt is the cheapest reliability you'll ever buy. When a project later says \"write the system prompt,\" reach for this skeleton first.",
  },
  {
    id: "prod-00-5",
    project_id: "prod-00",
    order: 5,
    title: "From Script to Tool: Handling Reality",
    concept: "errors, retries, cost",
    illustrative: true,
    explanation:
      "A script works once on your machine. A tool works every time, on inputs you didn't expect. Closing that gap is this lesson, and it's why every guide has a \"harden\" section.\n\n## Three things that will go wrong\n\n1. **The network fails.** Calls time out or return errors. Wrap them and retry.\n2. **The output is malformed.** You asked for JSON, and the model wrapped it in chatty text or a code fence. Parse defensively.\n3. **It costs money.** Every call spends tokens. Long inputs and long histories add up.\n\n## A safe call\n\n```python\nimport json, time\n\ndef safe_json_call(call_fn, retries=2):\n    for attempt in range(retries + 1):\n        text = call_fn()\n        try:\n            start = text.index(\"{\")\n            end = text.rindex(\"}\") + 1\n            return json.loads(text[start:end])\n        except (ValueError, json.JSONDecodeError):\n            if attempt == retries:\n                raise\n            time.sleep(1)\n```\n\nThis does two jobs at once. It retries on failure, and it pulls out the JSON object even when the model added text around it. You'll reuse this pattern constantly.\n\n## Watching cost\n\nA rough rule: one token is about four characters. Before shipping, ask how big your input is and how often it runs. A tool that resends a huge document on every call is a tool with a big bill. Later projects trim, cache, and summarize to keep cost sane. For now, just know that length equals money.\n\n## The mindset\n\nAssume the model will sometimes return garbage and the network will sometimes drop. A good AI product fails politely and recovers instead of falling over. Every `try/except` you add is the difference between a demo and a tool someone can rely on.",
  },
  {
    id: "prod-00-6",
    project_id: "prod-00",
    order: 6,
    title: "Ship It, and It Lands in Your Portfolio",
    concept: "finishing and shipping",
    illustrative: true,
    explanation:
      "The last lesson of every project is \"ship,\" and finishing it does something real. The project gets saved to your **Portfolio** tab. This lesson is about what \"done\" means and how to make your builds show well.\n\n## What \"shipped\" means here\n\nYou don't need a fancy deployment for most projects. Shipped means:\n\n1. It runs from a clean start with one command.\n2. It handles an empty or weird input without crashing.\n3. Someone else could use it from your instructions alone.\n\nIf those three are true, it's a real deliverable.\n\n## Your Portfolio\n\nWhen you complete the final lesson of a build guide, CodeFlow records it in your Portfolio, with the project's title and what you built. Over the track this becomes a visible shelf of working products: your summarizer, your chatbot, your RAG app, your deployed capstone. That shelf is the point of this track. A score is forgettable. A portfolio of things you built is not.\n\n## Make each build show well\n\n- Keep a one-line description of what it does and who it's for.\n- Save an example input and its output as proof it works.\n- For the projects that produce a web app or an endpoint, keep the link. It becomes your live demo.\n\n## You're ready\n\nYou know the loop. Your key is set. You know how each guide is laid out, you have a prompt skeleton, and you know how to make a script survive contact with reality. That's the whole framework. Everything from here is applying it to build one real thing at a time. Pick the first project and go. You're not being dropped in the deep end, you've got the playbook.",
  },
];

export default { project, lessons };
