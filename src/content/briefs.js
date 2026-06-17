export default {
  "ai-01": {
    tagline: "Demystify the math and magic behind modern AI.",
    overview:
      "This project builds the foundational mental model for how neural networks and large language models actually work, from tokens and weights to next-token prediction. You will leave able to reason about why models behave the way they do instead of treating them as black boxes.",
    whatYouBuild: [
      "A plain-language explainer of how an LLM turns text into tokens and predicts the next one",
      "A tiny from-scratch next-token predictor (bigram/n-gram) you can run and inspect",
      "A diagram mapping the path from input prompt to output token probabilities",
    ],
    milestones: [
      { title: "Tokens & vocab", detail: "Understand how raw text is split into tokens and mapped to ids." },
      { title: "Weights & layers", detail: "Learn what parameters are and how layers transform a representation." },
      { title: "Next-token prediction", detail: "See how a probability distribution over the vocab produces output." },
      { title: "Build a mini predictor", detail: "Implement and run a small statistical model that completes text." },
    ],
    skills: ["tokenization", "neural-network basics", "probability", "model intuition", "Python"],
    rubric: [
      { criterion: "Conceptual accuracy", description: "Explanations correctly describe tokens, weights, and prediction without hand-waving." },
      { criterion: "Working demo", description: "The mini predictor runs and produces sensible next-token completions." },
      { criterion: "Clarity", description: "A non-expert could follow the explainer and diagram end to end." },
    ],
    estimatedHours: 3,
  },

  "ai-02": {
    tagline: "Send your first request to a real LLM and read the response.",
    overview:
      "This project gets you hands-on with calling a hosted model API: authentication, request shape, and parsing the response. It is the practical gateway to everything else, turning AI from a website into something you can program against.",
    whatYouBuild: [
      "A working script that sends a prompt to an LLM API and prints the completion",
      "Secure handling of an API key via environment variables",
      "A small wrapper function with basic error handling and retries",
    ],
    milestones: [
      { title: "Get a key", detail: "Obtain an API key and store it safely in an environment variable." },
      { title: "First call", detail: "Send a single prompt and print the model's text response." },
      { title: "Parse the response", detail: "Read tokens used, finish reason, and the message content from the JSON." },
      { title: "Harden it", detail: "Wrap the call with try/except, timeouts, and a simple retry." },
    ],
    skills: ["HTTP/REST", "API keys", "JSON parsing", "environment variables", "error handling"],
    rubric: [
      { criterion: "Successful call", description: "Script reliably returns a valid model completion from a real prompt." },
      { criterion: "Secret hygiene", description: "API key is never hardcoded and is loaded from the environment." },
      { criterion: "Robustness", description: "Failed or slow requests are handled gracefully rather than crashing." },
    ],
    estimatedHours: 2,
  },

  "ai-03": {
    tagline: "Get dramatically better outputs by writing better prompts.",
    overview:
      "This project teaches the core levers of prompt design: clear instructions, role and context, examples, and output formatting. You will learn to systematically improve model quality without touching any model internals.",
    whatYouBuild: [
      "A before/after prompt library showing measurable quality improvements",
      "A reusable prompt template with role, task, constraints, and format sections",
      "A few-shot example set that steers the model toward a desired style",
    ],
    milestones: [
      { title: "Clear instructions", detail: "Rewrite vague prompts into specific, unambiguous tasks." },
      { title: "Role & context", detail: "Add persona and background to ground the model's responses." },
      { title: "Few-shot examples", detail: "Provide examples to lock in tone, format, and behavior." },
      { title: "Control the output", detail: "Constrain length, format, and structure for predictable results." },
    ],
    skills: ["prompt design", "few-shot learning", "instruction tuning", "output formatting", "iteration"],
    rubric: [
      { criterion: "Measurable lift", description: "Revised prompts produce clearly better outputs than the originals on the same task." },
      { criterion: "Reusability", description: "The template generalizes across multiple tasks with minimal edits." },
      { criterion: "Format control", description: "Outputs reliably match the requested structure and length." },
    ],
    estimatedHours: 3,
  },

  "ai-04": {
    tagline: "Build a conversational chatbot that remembers context.",
    overview:
      "This project assembles a multi-turn chatbot by managing a running message history and a system prompt. You will understand how conversational memory works and why context windows and message roles matter.",
    whatYouBuild: [
      "A command-line chatbot that holds a coherent multi-turn conversation",
      "A system prompt that defines the bot's persona and rules",
      "Message-history management that respects the context window",
    ],
    milestones: [
      { title: "Message roles", detail: "Structure system, user, and assistant messages correctly." },
      { title: "Conversation loop", detail: "Read user input, call the model, and print the reply in a loop." },
      { title: "Memory", detail: "Append each turn to history so the bot remembers earlier context." },
      { title: "Trim the window", detail: "Truncate or summarize history to stay within token limits." },
    ],
    skills: ["conversation state", "system prompts", "message roles", "context windows", "CLI design"],
    rubric: [
      { criterion: "Coherence", description: "The bot maintains context across many turns without losing the thread." },
      { criterion: "Persona", description: "Behavior consistently reflects the configured system prompt." },
      { criterion: "Window safety", description: "Long conversations are managed so requests never exceed the context limit." },
    ],
    estimatedHours: 4,
  },

  "ai-05": {
    tagline: "Make machines see: classify and detect objects in images.",
    overview:
      "This project introduces computer vision fundamentals using a pretrained image model to classify and describe images. You will learn how pixels become predictions and how to apply vision models without training from scratch.",
    whatYouBuild: [
      "An image classifier that labels photos using a pretrained model",
      "A script that runs inference on your own images and reports confidence",
      "A simple comparison of model predictions across a small test set",
    ],
    milestones: [
      { title: "Load an image", detail: "Read and preprocess an image into the model's expected input format." },
      { title: "Run inference", detail: "Pass the image through a pretrained classifier and get labels." },
      { title: "Interpret scores", detail: "Read confidence scores and pick the top predictions." },
      { title: "Test on real data", detail: "Evaluate the model on your own images and note failure cases." },
    ],
    skills: ["image preprocessing", "pretrained models", "inference", "classification", "confidence scores"],
    rubric: [
      { criterion: "Correct pipeline", description: "Images are preprocessed and fed to the model in the right shape and format." },
      { criterion: "Useful output", description: "Predictions include sensible labels with calibrated confidence values." },
      { criterion: "Critical eval", description: "Learner identifies where and why the model misclassifies." },
    ],
    estimatedHours: 4,
  },

  "ai-06": {
    tagline: "Turn text into vectors and search by meaning, not keywords.",
    overview:
      "This project teaches embeddings: dense vector representations that capture semantic meaning. You will build a semantic search that finds relevant text even when the words do not match, the cornerstone of modern retrieval.",
    whatYouBuild: [
      "An embedding pipeline that converts a corpus of text into vectors",
      "A semantic search function ranking results by cosine similarity",
      "A small searchable knowledge base you query in natural language",
    ],
    milestones: [
      { title: "Generate embeddings", detail: "Convert documents and queries into embedding vectors via an API." },
      { title: "Measure similarity", detail: "Compute cosine similarity between query and document vectors." },
      { title: "Rank results", detail: "Return the top-k most semantically similar documents." },
      { title: "Compare to keywords", detail: "Show where semantic search beats simple keyword matching." },
    ],
    skills: ["embeddings", "cosine similarity", "vector math", "semantic search", "retrieval"],
    rubric: [
      { criterion: "Relevant retrieval", description: "Queries return semantically appropriate results, including paraphrases." },
      { criterion: "Correct similarity", description: "Similarity is computed and normalized correctly for ranking." },
      { criterion: "Demonstrated advantage", description: "Learner shows a concrete case where semantic beats keyword search." },
    ],
    estimatedHours: 5,
  },

  "ai-07": {
    tagline: "Ground an LLM in your own documents with retrieval.",
    overview:
      "This project builds a Retrieval-Augmented Generation system that answers questions from a custom document set with citations. You will learn the full pipeline: chunking, embedding, retrieval, and prompt assembly that reduces hallucination.",
    whatYouBuild: [
      "A document ingestion pipeline that chunks and embeds source material",
      "A retriever that pulls the most relevant chunks for a question",
      "A RAG chat interface that answers with grounded, cited responses",
    ],
    milestones: [
      { title: "Chunk documents", detail: "Split sources into overlapping, retrievable chunks." },
      { title: "Index embeddings", detail: "Embed chunks and store them for fast similarity search." },
      { title: "Retrieve & augment", detail: "Fetch top chunks and inject them into the model prompt." },
      { title: "Cite sources", detail: "Return answers that reference which chunks they came from." },
    ],
    skills: ["chunking", "embeddings", "retrieval", "prompt augmentation", "grounding", "citations"],
    rubric: [
      { criterion: "Grounded answers", description: "Responses draw from retrieved context rather than model memory." },
      { criterion: "Retrieval quality", description: "The correct supporting chunks are surfaced for each question." },
      { criterion: "Traceability", description: "Every answer cites the sources it was built from." },
    ],
    estimatedHours: 6,
  },

  "ai-08": {
    tagline: "Specialize a model and prove it actually got better.",
    overview:
      "This project covers fine-tuning a model on task-specific data and, crucially, building evaluations to measure whether it improved. You will learn when fine-tuning is worth it and how to avoid shipping regressions.",
    whatYouBuild: [
      "A curated and formatted fine-tuning dataset for a specific task",
      "A fine-tuned model checkpoint produced via a training job",
      "An eval harness that scores base vs. fine-tuned on held-out cases",
    ],
    milestones: [
      { title: "Prepare data", detail: "Collect and format examples into the required training schema." },
      { title: "Run fine-tuning", detail: "Launch a fine-tune job and retrieve the resulting model." },
      { title: "Build evals", detail: "Define metrics and a held-out test set to score quality." },
      { title: "Compare & decide", detail: "Measure base vs. fine-tuned and judge if the gain is worth it." },
    ],
    skills: ["dataset curation", "fine-tuning", "evaluation design", "metrics", "regression testing"],
    rubric: [
      { criterion: "Clean dataset", description: "Training data is well-formatted, deduplicated, and representative of the task." },
      { criterion: "Honest evals", description: "Metrics are run on held-out data and capture real task performance." },
      { criterion: "Sound conclusion", description: "Learner correctly judges whether fine-tuning improved results." },
    ],
    estimatedHours: 7,
  },

  "ai-09": {
    tagline: "Let the model call tools and take real actions.",
    overview:
      "This project builds an AI agent that decides when to call external tools, executes them, and incorporates results into its reasoning loop. You will learn the agentic loop that powers assistants which search, compute, and act.",
    whatYouBuild: [
      "Tool definitions the model can invoke with structured arguments",
      "An agent loop that calls tools, feeds results back, and continues",
      "A working agent that completes a multi-step task using its tools",
    ],
    milestones: [
      { title: "Define tools", detail: "Describe each tool's name, purpose, and parameter schema for the model." },
      { title: "Detect tool calls", detail: "Parse when the model requests a tool and with what arguments." },
      { title: "Execute & return", detail: "Run the tool and feed the result back into the conversation." },
      { title: "Loop to completion", detail: "Iterate tool calls until the task is fully resolved." },
    ],
    skills: ["tool use", "function calling", "agent loops", "schema design", "orchestration"],
    rubric: [
      { criterion: "Correct invocation", description: "The model calls the right tool with valid, well-formed arguments." },
      { criterion: "Result integration", description: "Tool outputs are fed back and influence the next step correctly." },
      { criterion: "Task completion", description: "The agent reliably finishes multi-step tasks without getting stuck." },
    ],
    estimatedHours: 6,
  },

  "ai-10": {
    tagline: "Get reliable JSON out of an LLM, every time.",
    overview:
      "This project teaches structured outputs: forcing models to return data that matches a schema so it can be consumed by code. You will learn schema definition, validation, and recovery for production-grade reliability.",
    whatYouBuild: [
      "A JSON schema describing the exact output shape you need",
      "A call that constrains the model to emit schema-valid JSON",
      "A validation and retry layer that rejects and re-requests bad output",
    ],
    milestones: [
      { title: "Define a schema", detail: "Specify required fields, types, and constraints for the output." },
      { title: "Constrain output", detail: "Use structured-output features to force schema-conformant JSON." },
      { title: "Validate", detail: "Parse and validate responses against the schema in code." },
      { title: "Recover", detail: "Retry or repair when the model returns invalid data." },
    ],
    skills: ["JSON schema", "structured outputs", "validation", "type safety", "parsing"],
    rubric: [
      { criterion: "Schema conformance", description: "Outputs reliably match the defined schema and parse without errors." },
      { criterion: "Validation", description: "Invalid responses are detected programmatically, not assumed valid." },
      { criterion: "Resilience", description: "The system recovers from malformed output instead of crashing downstream." },
    ],
    estimatedHours: 4,
  },

  "ai-11": {
    tagline: "Work with models that see images and generate them.",
    overview:
      "This project explores multimodal AI: passing images into a vision-language model for understanding and generating images from text. You will learn how to combine text and visual inputs in a single application.",
    whatYouBuild: [
      "A vision call that describes, analyzes, or answers questions about an image",
      "A text-to-image generation request with prompt control",
      "A small app that combines image understanding and generation",
    ],
    milestones: [
      { title: "Send an image", detail: "Encode and pass an image into a vision-language model." },
      { title: "Ask about it", detail: "Get structured answers or descriptions about image content." },
      { title: "Generate images", detail: "Produce images from text prompts and control the style." },
      { title: "Combine modalities", detail: "Chain understanding and generation into one workflow." },
    ],
    skills: ["multimodal input", "vision-language models", "image generation", "prompt control", "encoding"],
    rubric: [
      { criterion: "Accurate vision", description: "The model correctly understands and describes the provided images." },
      { criterion: "Controlled generation", description: "Generated images reflect the intent and constraints of the prompt." },
      { criterion: "Integrated flow", description: "Understanding and generation are combined into a coherent application." },
    ],
    estimatedHours: 5,
  },

  "ai-12": {
    tagline: "Scale semantic search to millions of vectors in production.",
    overview:
      "This project moves embeddings into a real vector database with indexing, metadata filtering, and persistence. You will learn the infrastructure that makes retrieval fast and reliable at production scale.",
    whatYouBuild: [
      "A populated vector database with an ANN index over your embeddings",
      "Filtered queries combining semantic search with metadata constraints",
      "A benchmark comparing recall and latency across index settings",
    ],
    milestones: [
      { title: "Stand up a store", detail: "Initialize a vector database and define the collection schema." },
      { title: "Index at scale", detail: "Insert embeddings with an approximate-nearest-neighbor index." },
      { title: "Filter & query", detail: "Combine vector search with metadata filters for precise results." },
      { title: "Benchmark", detail: "Measure latency and recall and tune index parameters." },
    ],
    skills: ["vector databases", "ANN indexing", "metadata filtering", "scaling", "benchmarking"],
    rubric: [
      { criterion: "Correct indexing", description: "Vectors are stored and indexed so queries return relevant results quickly." },
      { criterion: "Hybrid queries", description: "Semantic search and metadata filters combine correctly in one query." },
      { criterion: "Performance awareness", description: "Learner measures and reasons about the recall/latency trade-off." },
    ],
    estimatedHours: 7,
  },

  "ai-13": {
    tagline: "Make LLM apps feel instant with streaming and caching.",
    overview:
      "This project tackles production performance: streaming tokens for perceived speed, caching to cut cost and latency, and measuring the trade-offs. You will learn to make AI features feel responsive under real load.",
    whatYouBuild: [
      "A streaming response handler that renders tokens as they arrive",
      "A caching layer that serves repeated or similar requests instantly",
      "A latency dashboard tracking time-to-first-token and total time",
    ],
    milestones: [
      { title: "Stream tokens", detail: "Consume a streaming API and display output incrementally." },
      { title: "Measure latency", detail: "Track time-to-first-token and end-to-end response time." },
      { title: "Add caching", detail: "Cache responses to avoid recomputing identical requests." },
      { title: "Tune trade-offs", detail: "Balance freshness, cost, and speed across the system." },
    ],
    skills: ["streaming", "caching", "latency optimization", "performance measurement", "cost control"],
    rubric: [
      { criterion: "Smooth streaming", description: "Output renders progressively with low time-to-first-token." },
      { criterion: "Effective cache", description: "Repeated requests are served from cache with correct invalidation." },
      { criterion: "Measured impact", description: "Learner quantifies the latency and cost improvements achieved." },
    ],
    estimatedHours: 6,
  },

  "ai-14": {
    tagline: "Keep AI safe, on-policy, and resistant to abuse.",
    overview:
      "This project builds guardrails around an LLM: input and output filtering, prompt-injection defense, and policy enforcement. You will learn to ship AI features that resist misuse and stay within defined boundaries.",
    whatYouBuild: [
      "Input validation that blocks unsafe or out-of-scope requests",
      "Output moderation that screens responses before they reach users",
      "Prompt-injection defenses protecting system instructions",
    ],
    milestones: [
      { title: "Filter inputs", detail: "Detect and block disallowed or malicious user requests." },
      { title: "Moderate outputs", detail: "Screen model responses against safety and policy rules." },
      { title: "Resist injection", detail: "Harden prompts so user content cannot override instructions." },
      { title: "Enforce policy", detail: "Apply consistent rules and log violations for review." },
    ],
    skills: ["content moderation", "prompt-injection defense", "input validation", "safety policy", "logging"],
    rubric: [
      { criterion: "Input safety", description: "Unsafe or out-of-scope requests are reliably caught before model calls." },
      { criterion: "Output safety", description: "Policy-violating responses are blocked or rewritten before delivery." },
      { criterion: "Injection resistance", description: "Adversarial prompts fail to override system instructions." },
    ],
    estimatedHours: 6,
  },

  "ai-15": {
    tagline: "Unlock harder tasks with chain-of-thought and beyond.",
    overview:
      "This project covers advanced prompting patterns: chain-of-thought, self-consistency, ReAct, and decomposition. You will learn techniques that meaningfully boost reasoning quality on complex, multi-step problems.",
    whatYouBuild: [
      "A chain-of-thought prompt that improves multi-step reasoning",
      "A self-consistency setup that samples and votes on answers",
      "A ReAct-style prompt interleaving reasoning and actions",
    ],
    milestones: [
      { title: "Chain-of-thought", detail: "Prompt the model to reason step by step before answering." },
      { title: "Decompose tasks", detail: "Break complex problems into ordered sub-prompts." },
      { title: "Self-consistency", detail: "Sample multiple reasoning paths and select the consensus answer." },
      { title: "ReAct pattern", detail: "Interleave thought and action to solve interactive tasks." },
    ],
    skills: ["chain-of-thought", "task decomposition", "self-consistency", "ReAct", "reasoning"],
    rubric: [
      { criterion: "Reasoning gain", description: "Advanced patterns measurably outperform naive prompting on hard tasks." },
      { criterion: "Correct pattern fit", description: "Learner selects the appropriate pattern for each problem type." },
      { criterion: "Reliability", description: "Techniques like self-consistency reduce variance in final answers." },
    ],
    estimatedHours: 5,
  },

  "ai-16": {
    tagline: "Ship and operate an LLM app users can depend on.",
    overview:
      "This project takes an AI feature to production: deployment, logging, monitoring, cost tracking, and alerting on quality drift. You will learn the operational discipline that separates a demo from a real product.",
    whatYouBuild: [
      "A deployed API endpoint serving an LLM-backed feature",
      "Structured logging of prompts, responses, latency, and cost",
      "Monitoring with alerts on errors, cost spikes, and quality drift",
    ],
    milestones: [
      { title: "Deploy", detail: "Package and deploy the LLM app behind a stable endpoint." },
      { title: "Log everything", detail: "Capture requests, responses, tokens, and latency for each call." },
      { title: "Monitor", detail: "Build dashboards for cost, error rate, and response quality." },
      { title: "Alert", detail: "Trigger alerts on failures, cost spikes, and drift." },
    ],
    skills: ["deployment", "observability", "logging", "cost tracking", "monitoring", "alerting"],
    rubric: [
      { criterion: "Reliable deploy", description: "The feature is reachable, stable, and configured for production use." },
      { criterion: "Full observability", description: "Logs and metrics make every request traceable and debuggable." },
      { criterion: "Proactive alerts", description: "Operational issues surface via alerts before users are widely affected." },
    ],
    estimatedHours: 7,
  },

  "ai-17": {
    tagline: "See chat for what it really is: an ordered list of role-tagged messages.",
    overview:
      "This project reveals the structure behind every chat interface: a request is not a paragraph but an ordered list of messages, each tagged with a role (system, user, or assistant) and content. You will learn how system prompts set behavior, how multi-turn memory is really the app resending the full history each turn, and how to assemble the message array in code — the exact pattern every chatbot is built on.",
    whatYouBuild: [
      "A transcript printer that walks a list of role-tagged message dicts and labels each speaker",
      "Two system prompts that visibly reshape the same assistant's persona and output format",
      "A growing conversation history that appends user and assistant turns and resends the whole list each turn",
      "A reusable build_chat helper that assembles an ordered message array from a system prompt and turns",
    ],
    milestones: [
      { title: "The message list", detail: "Model a chat request as an ordered list of {role, content} dicts the model continues." },
      { title: "System prompts", detail: "Place a system message first to set persona, rules, and output format for the whole chat." },
      { title: "Multi-turn memory", detail: "Append each user and assistant turn to history and resend the full transcript every turn." },
      { title: "Build the array", detail: "Assemble and grow the message array in code, keeping it flat and in order." },
    ],
    skills: ["message roles", "system prompts", "conversation history", "statelessness", "Python lists & dicts"],
    rubric: [
      { criterion: "Correct structure", description: "Messages are well-formed role/content dicts assembled as a flat, ordered list." },
      { criterion: "Behavior control", description: "A system prompt is placed first and demonstrably changes the assistant's persona and format." },
      { criterion: "History handling", description: "Both user and assistant turns are appended in order and the full list is resent each turn." },
    ],
    estimatedHours: 3,
  },

  "ai-18": {
    tagline: "Master the model's working memory — the token budget behind every request.",
    overview:
      "This project builds a precise mental model of the context window: the fixed token budget a model can consider in one request, shared between your input and its output. You will learn exactly what consumes that budget, what happens when you exceed it, and the strategies for keeping the right information in view so your AI features stay coherent, cheap, and reliable.",
    whatYouBuild: [
      "A token-budget calculator that shows how much room is left for the answer after the system prompt, history, and message",
      "A truncation simulator that drops the oldest turns until a conversation fits the window",
      "A context manager that trims and summarizes history to keep long sessions inside the limit",
    ],
    milestones: [
      { title: "Define the window", detail: "Understand the window as a shared token ceiling for input plus output." },
      { title: "Account the budget", detail: "Tally how the system prompt, chat history, message, and reserved answer space all spend from it." },
      { title: "Handle overflow", detail: "See how exceeding the window causes hard errors or silent oldest-first truncation." },
      { title: "Manage context", detail: "Trim, summarize, and filter history to keep what matters inside the limit." },
    ],
    skills: ["context windows", "token budgeting", "truncation", "history summarization", "Python"],
    rubric: [
      { criterion: "Conceptual accuracy", description: "Correctly explains that the window is a shared input-plus-output token ceiling, not long-term memory." },
      { criterion: "Budget reasoning", description: "Accurately accounts for every part of a request and computes the room left for history or the answer." },
      { criterion: "Management strategy", description: "Applies trimming, summarization, and relevance filtering to keep long sessions within the limit." },
    ],
    estimatedHours: 3,
  },

  "ai-19": {
    tagline: "Dial a model from precise to playful by controlling how it samples.",
    overview:
      "This project demystifies why the same prompt gives different answers and teaches the three levers that govern an LLM's randomness: temperature, top-p, and top-k. You will leave able to deliberately choose settings that make a model deterministic for facts and code, or creative for brainstorming and writing, instead of accepting whatever defaults you're handed.",
    whatYouBuild: [
      "A weighted-sampling simulator that draws next tokens from a probability distribution",
      "A temperature-scaled softmax that visibly sharpens or flattens the same logits",
      "A working top-k and top-p (nucleus) truncation implementation with renormalization",
      "A task-to-settings recommender that maps goals onto temperature and top-p values",
    ],
    milestones: [
      { title: "Sampling vs greedy", detail: "See why a model samples from a distribution instead of always taking the top token." },
      { title: "Temperature dial", detail: "Reshape logits with temperature and watch the distribution sharpen or flatten." },
      { title: "Top-p and top-k", detail: "Truncate the candidate pool by fixed count or cumulative probability, then renormalize." },
      { title: "Match settings to task", detail: "Pick temperature and top-p based on whether a task has one right answer or many." },
    ],
    skills: ["sampling", "temperature", "softmax", "nucleus sampling (top-p)", "Python"],
    rubric: [
      { criterion: "Conceptual accuracy", description: "Correctly explains distributions, temperature scaling, and the difference between top-k and top-p." },
      { criterion: "Working demos", description: "The sampling, softmax, and truncation scripts run and produce the expected outputs." },
      { criterion: "Applied judgment", description: "Learner chooses sensible settings for convergent vs divergent tasks and justifies why." },
    ],
    estimatedHours: 3,
  },

  "ai-20": {
    tagline: "Crack open an API response and read what the model actually handed back.",
    overview:
      "This project teaches you to parse a model API's response object end to end: where the generated text is nested, why generation stopped, and how many tokens the call spent. You will leave able to pull the answer out cleanly, detect truncated or blocked output, track cost from the usage block, and bound generation with stop sequences.",
    whatYouBuild: [
      "A parser that reaches the content text through the choices → message → content path",
      "A finish-reason check that flags truncated ('length') and blocked outputs before you ship them",
      "A cost calculator that reads the usage block and applies separate input/output token rates",
      "A stop-sequence simulator that cuts generation at a boundary you define",
    ],
    milestones: [
      { title: "Reach the content", detail: "Index choices[0] and read message.content out of the nested response." },
      { title: "Read the finish reason", detail: "Tell a natural stop from a length cut-off, stop sequence, or content filter." },
      { title: "Account for tokens", detail: "Pull prompt, completion, and total tokens from usage and turn them into cost." },
      { title: "Bound the output", detail: "Use a stop sequence to halt generation cleanly at a defined marker." },
    ],
    skills: ["response parsing", "JSON/dict navigation", "finish reasons", "token accounting", "stop sequences"],
    rubric: [
      { criterion: "Correct extraction", description: "Code reliably reaches the content string through the choices/message/content path." },
      { criterion: "Robust handling", description: "Truncated and blocked responses are detected via finish_reason rather than shipped blindly." },
      { criterion: "Cost awareness", description: "The usage block is read correctly and converted to an accurate per-call cost." },
    ],
    estimatedHours: 3,
  },

  "ai-21": {
    tagline: "Estimate, predict, and slash the cost of every LLM call.",
    overview:
      "This project builds a working intuition for how language model billing actually works — per-token pricing with input and output charged separately, why output dominates, and how chat history compounds cost by being resent every turn. You will move from being surprised by an invoice to estimating any feature's cost before you ship it and knowing exactly which levers cut the bill.",
    whatYouBuild: [
      "A per-call cost calculator that prices input and output tokens separately",
      "A pre-launch estimator that turns a prompt into expected tokens, dollars, and a daily bill at scale",
      "A history-cost simulator showing how resent transcripts compound, plus a trimming/capping tool that measures the savings",
    ],
    milestones: [
      { title: "How pricing works", detail: "Understand per-token billing with separate input and output rates quoted per million." },
      { title: "Estimate before you call", detail: "Approximate tokens from text (chars/4) and compute expected cost ahead of time." },
      { title: "Find the cost drivers", detail: "See why long outputs and compounding chat history dominate real bills." },
      { title: "Cut the bill", detail: "Apply trimming, output caps, prompt caching, and model choice to lower spend." },
    ],
    skills: ["token estimation", "cost modeling", "pricing math", "context management", "Python"],
    rubric: [
      { criterion: "Accurate cost math", description: "Calculations correctly price input and output tokens separately and format money precisely." },
      { criterion: "Sound estimation", description: "Learner estimates per-call and at-scale cost before making a call." },
      { criterion: "Effective optimization", description: "Learner identifies the dominant cost drivers and applies the right levers to reduce them." },
    ],
    estimatedHours: 3,
  },

  "ai-22": {
    tagline: "Stop reaching for the biggest model and learn to pick the right tier for each task.",
    overview:
      "This project builds the practical judgment behind model selection: how providers ship families of small, medium, and large tiers, how cost, latency, and quality trade against each other, how to route easy tasks to cheap fast models and hard tasks to large ones, and how to choose between candidates with a tiny eval set. You will leave able to defend a model choice with evidence and switch models by changing a single id.",
    whatYouBuild: [
      "A tier 'menu' that scores small, medium, and large models on cost, latency, and quality",
      "A task router that maps each request to the cheapest tier that can still do it well",
      "A tiny eval harness that runs candidate models on known tasks and picks a winner",
    ],
    milestones: [
      { title: "Tiers, not 'the AI'", detail: "See a model family as a menu of small/medium/large tiers with different trade-offs." },
      { title: "The three trade-offs", detail: "Balance cost, latency, and quality, optimizing two at the expense of the third." },
      { title: "Route by difficulty", detail: "Send simple classification/extraction to small tiers and hard reasoning to large ones." },
      { title: "Measure and switch", detail: "Build an eval set, compare candidates, and keep code model-agnostic for one-line swaps." },
    ],
    skills: ["model selection", "cost/latency/quality trade-offs", "task routing", "evaluation", "Python"],
    rubric: [
      { criterion: "Right-sized choices", description: "Tasks are matched to the cheapest tier that meets quality needs, not the biggest by default." },
      { criterion: "Trade-off reasoning", description: "Decisions explicitly weigh cost, latency, and quality against the use case." },
      { criterion: "Evidence over vibes", description: "Model choices are backed by a runnable eval comparing candidates on real tasks." },
    ],
    estimatedHours: 3,
  },
};
