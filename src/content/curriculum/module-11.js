export default {
  project: {
    id: "ai-11",
    title: "Multimodal AI: Vision & Images",
    description: "See how models read images, pull text out of documents, and generate pictures from words. Build the mental model for working with vision and the cost of feeding pixels to a model.",
    difficulty: "intermediate",
    category: "ai_ml",
    estimated_time: 50,
    lessons_count: 5,
    tags: ["multimodal", "vision", "images", "ocr", "generation"],
    order: 11,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-11-l1",
      project_id: "ai-11",
      order: 1,
      title: "Models That Can See",
      concept: "Multimodal",
      xp_reward: 10,
      explanation: `Show a photo of a fridge to a modern model and ask "what can I cook tonight?" It reads the ketchup, the half-onion, the carton of eggs, and gives you an omelette recipe. The model never "sees" pixels the way you do. It turns the image into the same kind of number-tokens it uses for text — and once that clicks, vision stops feeling magic.

## What it is

A **multimodal model** is a model that accepts more than one type of input — typically text plus images — inside a single prompt. The "modes" are the input types: text, images, sometimes audio or video. The word **modality** just means "a kind of input." A text-only model has one modality; a vision model has two.

The crucial idea: the model does not run a separate "image brain." Both your words and your picture are converted into the same internal currency — vectors of numbers — and processed by one network. Text and image meet in the same space.

## How it works

Walk through one vision request:

1. **Your image is split into patches.** The picture is cut into a grid of small squares (often 14x14 or 16x16 pixels each), like tiles.
2. **Each patch becomes an embedding.** A vision encoder turns every tile into a vector of numbers — an **image token**. A 1000x1000 photo can become hundreds of these.
3. **Image tokens join the text tokens.** Your words are tokenized too, and both streams are concatenated into one sequence the model reads together.
4. **The model predicts text as usual.** From this point it is the same next-token prediction from earlier modules. It answers about the image because the image is now part of its context.

\`\`\`python
# Conceptually, a vision request is just: text tokens + image tokens
text_tokens = tokenize("What is in this photo?")
image_tokens = vision_encoder(photo)   # patches -> vectors
context = text_tokens + image_tokens   # one sequence, one model
answer = model.predict(context)
\`\`\`

## Why it matters

Seeing vision as "images turned into tokens" explains the behavior you'll hit:

- **Images cost tokens too.** A photo isn't free — it becomes hundreds of image tokens, and you pay for them like any other tokens.
- **Detail has a price.** Higher resolution means more patches means more tokens. You can often choose a "low detail" mode to save money when fine detail doesn't matter.
- **It is one model, not a pipeline.** Because text and image share the same space, the model can reason across them — "circle the cheapest item on this menu" works because the menu and the instruction live together.

## The mental model to keep

A vision model doesn't have eyes bolted onto a text brain. **It chops your image into tiles, turns each tile into a token, and reads those tokens right alongside your words** — one stream, one model, same prediction loop you already know.`,
      key_terms: [
        { term: "Multimodal model", definition: "A model that accepts more than one input type, typically text plus images, in a single prompt." },
        { term: "Modality", definition: "A kind of input, such as text, image, audio, or video." },
        { term: "Image token", definition: "A vector of numbers produced from a small patch of an image, processed alongside text tokens." },
        { term: "Vision encoder", definition: "The part of the model that turns image patches into embeddings the model can read." }
      ],
      callouts: [
        { type: "analogy", title: "Pictures become words-of-a-kind", content: "Think of the model translating your photo into its own private language of number-tokens, the same language it already uses for text. Once translated, a picture and a sentence sit side by side in the same sentence.", position: "before" },
        { type: "insight", title: "One model, not two", content: "There is no separate image brain handing results to a text brain. Image tokens and text tokens flow through the same network, which is why the model can reason across both at once.", position: "after" }
      ],
      concept_diagram: {
        title: "How a model reads an image",
        steps: [
          { label: "Split into patches", desc: "The image is cut into a grid of small tiles." },
          { label: "Encode each patch", desc: "A vision encoder turns each tile into a vector (image token)." },
          { label: "Merge with text", desc: "Image tokens are concatenated with your tokenized words." },
          { label: "Predict text", desc: "The model answers using the same next-token prediction loop." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does a vision model do with your image before reasoning about it?",
          options: ["Stores it as a JPEG and reads it later", "Splits it into patches and turns each into a token", "Runs a separate image-only network that never touches the text"],
          correct_index: 1,
          explanation: "The image is cut into patches, each patch becomes an image token, and those tokens are read alongside the text tokens."
        }
      ],
      quiz_questions: [
        {
          question: "What does 'multimodal' mean for a model?",
          options: [
            "It runs on multiple servers at once",
            "It accepts more than one type of input, such as text and images",
            "It can speak multiple human languages",
            "It produces multiple answers per request"
          ],
          correct_index: 1,
          explanation: "Multimodal refers to handling multiple input modalities, most commonly text plus images."
        },
        {
          question: "After an image is encoded, how does the model process it?",
          options: [
            "Through a completely separate image-only model",
            "As image tokens read alongside text tokens in one sequence",
            "By converting it back into a text caption first",
            "It ignores the image and only reads the text"
          ],
          correct_index: 1,
          explanation: "Image tokens and text tokens are concatenated into a single sequence the one model reads together."
        },
        {
          question: "Why does sending a high-resolution image cost more?",
          options: [
            "Larger files take longer to upload",
            "More resolution means more patches, which means more image tokens",
            "The model charges extra for color photos",
            "High resolution disables the cheaper text path"
          ],
          correct_index: 1,
          explanation: "Higher resolution produces more patches, each a token, so you pay for more image tokens."
        }
      ],
      participation_activities: [
        {
          activity_title: "Vision basics check",
          questions: [
            { question: "A vision model uses a completely separate brain for images that never connects to the text.", type: "true_false", correct_answer: "false", explanation: "Image tokens and text tokens flow through the same model." },
            { question: "Each small patch of an image is turned into a vector called an image ______.", type: "fill_in", correct_answer: "token", explanation: "Patches become image tokens, processed like text tokens." }
          ]
        }
      ],
      starter_code: `# Estimate how many image tokens a photo becomes.
# The image is split into square patches; each patch is one token.
width = 512
height = 512
patch = 16  # each patch is 16x16 pixels

# TODO: compute patches across, patches down, and total image tokens.
patches_across = width // patch
print("patches across:", patches_across)
`,
      solution_code: `width = 512
height = 512
patch = 16  # each patch is 16x16 pixels

patches_across = width // patch
patches_down = height // patch
image_tokens = patches_across * patches_down

print("patches across:", patches_across)
print("patches down:", patches_down)
print("image tokens:", image_tokens)
`,
      expected_output: `patches across: 32
patches down: 32
image tokens: 1024`,
      step_throughs: [
        {
          title: "from a photo to an answer",
          steps: [
            { label: "Split into patches", detail: "The image is cut into a grid of small tiles, each a fixed pixel size. A larger image makes more tiles.", code: "image -> 32 x 32 grid of 16x16 patches" },
            { label: "Encode each patch", detail: "The vision encoder turns every tile into a vector of numbers — one image token per patch.", code: "patch -> vision_encoder(patch) -> [0.12, -0.8, ...]" },
            { label: "Merge with your words", detail: "Your text is tokenized too, then the image tokens and text tokens are joined into one sequence.", code: 'context = tokens("describe this") + image_tokens' },
            { label: "Predict the answer", detail: "From here it is ordinary next-token prediction. The model writes a reply because the image is part of its context.", code: 'model.predict(context) -> "A red bicycle..."' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "An image is 256x256 pixels and is split into 16x16 patches. How many image tokens does it become?",
          steps: [
            "Patches across = 256 / 16 = 16.",
            "Patches down = 256 / 16 = 16.",
            "Total patches = 16 x 16 = 256, and each patch is one image token."
          ],
          output: "256 image tokens"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You send the same photo at 512x512 and then at 1024x1024, both with 16x16 patches. How many times more image tokens does the larger version use?",
          steps: [
            "512x512 -> (512/16) x (512/16) = 32 x 32 = 1024 tokens.",
            "1024x1024 -> (1024/16) x (1024/16) = 64 x 64 = 4096 tokens.",
            "Doubling each side quadruples the area, so token count grows with the square of the resolution.",
            "4096 / 1024 = 4."
          ],
          output: "4x more tokens — resolution cost grows with area, not width."
        }
      ],
      comparison_tables: [
        {
          title: "text-only vs multimodal models",
          columns: ["Aspect", "Text-only model", "Multimodal (vision) model"],
          rows: [
            { cells: ["Accepted input", "Text tokens only", "Text tokens plus image tokens"] },
            { cells: ["How images are handled", "Cannot accept them", "Patches -> image tokens"] },
            { cells: ["Internal pipeline", "One token stream", "Two streams merged into one"] },
            { cells: ["What it can reason over", "Words", "Words and pictures together"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "true vs false about vision models",
          bins: [
            { id: "true", label: "True" },
            { id: "false", label: "False" }
          ],
          items: [
            { id: "i1", text: "Images are split into patches that become tokens", bin: "true" },
            { id: "i2", text: "A separate image brain works independently of the text", bin: "false" },
            { id: "i3", text: "Higher resolution produces more image tokens", bin: "true" },
            { id: "i4", text: "Images are free and never count toward token cost", bin: "false" },
            { id: "i5", text: "Text and image tokens are read by the same model", bin: "true" },
            { id: "i6", text: "The model sees individual pixels the way humans do", bin: "false" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if a model only predicts the next token, how can it possibly answer a question about a photo?",
          sampleAnswer: "The photo is converted into image tokens — vectors that live in the same space as text tokens — and joined onto your words to form one input sequence. So when the model predicts the next token, the image is already part of the context it is continuing from, which lets the answer reflect what is in the picture even though the underlying operation is still plain text prediction."
        }
      ],
      hints: [
        "Floor division (//) gives whole patches along each side.",
        "Patches across uses width; patches down uses height.",
        "Total image tokens is patches across times patches down."
      ],
      challenge_title: "Detail levels and token cost",
      challenge_description: "A model resizes images to a fixed side before patching. In 'low' detail it uses 256 pixels per side; in 'high' detail it uses 1024. With 16x16 patches, write a function image_tokens(detail) that returns the token count for 'low' or 'high'. Print both.",
      challenge_starter_code: `# 'low' resizes to 256 per side, 'high' to 1024 per side. Patch is 16x16.
# TODO: define image_tokens(detail) and print the count for both.
`,
      challenge_solution_code: `def image_tokens(detail):
    side = 256 if detail == "low" else 1024
    patches_per_side = side // 16
    return patches_per_side * patches_per_side

print("low:", image_tokens("low"))
print("high:", image_tokens("high"))
`,
      challenge_test_cases: [
        { input: "detail='low'", expected_output: "256", description: "256/16 = 16 per side, 16*16 = 256 tokens." },
        { input: "detail='high'", expected_output: "4096", description: "1024/16 = 64 per side, 64*64 = 4096 tokens." }
      ]
    },
    {
      id: "ai-11-l2",
      project_id: "ai-11",
      order: 2,
      title: "Sending an Image to a Model",
      concept: "ImageInput",
      xp_reward: 10,
      explanation: `Your first vision API call almost always fails the same way: you paste a file path and the model says it cannot see anything. The model never opens files. It only reads what is inside the request body. To send a picture you either hand it a public URL or you encode the bytes into text. Get this one detail right and vision "just works."

## What it is

An **image input** is a picture supplied as part of a prompt, in a format the API can carry. There are two standard ways:

- **A URL** — a link to an image the server can fetch over the internet.
- **Base64** — the image's raw bytes encoded into a long plain-text string that rides inside the JSON request.

**Base64** is just a way to write binary data using ordinary text characters, so a picture can travel inside a text-only field. It makes the data about 33 percent larger, but it needs no public hosting.

## How it works

A vision request is a normal chat request whose user message contains a list of content blocks — some text, some image. Each block declares its type:

\`\`\`python
import base64

with open("receipt.png", "rb") as f:
    data = base64.b64encode(f.read()).decode("utf-8")

message = {
    "role": "user",
    "content": [
        {"type": "text", "text": "What is the total on this receipt?"},
        {"type": "image", "source": {"type": "base64",
                                     "media_type": "image/png",
                                     "data": data}}
    ]
}
\`\`\`

The pieces that matter:

1. **content is a list, not a string.** Text and image blocks sit side by side.
2. **media_type must match the real file** — image/png, image/jpeg, image/webp. Lie about it and decoding fails.
3. **Order can matter.** Many models read top to bottom, so put the instruction where it frames the image.

## Why it matters

The format choice has real consequences:

- **URL vs base64 is a trade-off.** A URL keeps the request tiny but requires the image to be publicly reachable. Base64 works for private or local files but inflates the request and counts toward size limits.
- **Wrong media_type is the top beginner bug.** A JPEG labeled image/png often errors out or silently garbles.
- **Huge images get rejected or downscaled.** APIs cap image dimensions and request size, so a 50-megapixel photo may be resized before the model ever sees it.

## The mental model to keep

The model can't reach into your filesystem. **Either give it a link it can fetch, or turn the bytes into base64 text and put them in the message** — and always label the media_type honestly.`,
      key_terms: [
        { term: "Image input", definition: "A picture supplied inside a prompt, either as a URL or as base64-encoded bytes." },
        { term: "Base64", definition: "A way to encode binary data, such as an image, as plain-text characters so it can travel inside a text field." },
        { term: "media_type", definition: "The label declaring an image's format, like image/png or image/jpeg, which must match the real bytes." },
        { term: "Content block", definition: "One item in a message's content list, tagged with a type such as text or image." }
      ],
      callouts: [
        { type: "tip", title: "URL when public, base64 when private", content: "If the image is already hosted somewhere reachable, a URL keeps your request small. For local or private files, base64 embeds the bytes directly so nothing has to be hosted.", position: "before" },
        { type: "warning", title: "media_type must be honest", content: "Labeling a JPEG as image/png is the most common first-call failure. The decoder trusts your label, so a mismatch errors out or corrupts the image.", position: "after" }
      ],
      concept_diagram: {
        title: "Getting a picture into a request",
        steps: [
          { label: "Pick a method", desc: "URL for a hosted image, base64 for a local one." },
          { label: "Build the content list", desc: "Add a text block and an image block." },
          { label: "Label the format", desc: "Set media_type to match the real file bytes." },
          { label: "Send and decode", desc: "The API fetches or decodes the image into tokens." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why can't you just send the model a local file path like /photos/cat.png?",
          options: ["File paths are too long for the API", "The model cannot open files; it only reads what is inside the request", "Paths must be uppercase"],
          correct_index: 1,
          explanation: "The model never touches your filesystem. You must supply a fetchable URL or embed the bytes as base64 in the request."
        }
      ],
      quiz_questions: [
        {
          question: "What is base64 used for when sending an image?",
          options: [
            "Compressing the image to be smaller than the original",
            "Encoding binary image bytes as plain text so they fit in a text field",
            "Translating the image into a caption",
            "Encrypting the image so others cannot see it"
          ],
          correct_index: 1,
          explanation: "Base64 turns binary data into text characters so an image can ride inside a JSON request body."
        },
        {
          question: "What is the most common first-call mistake with image inputs?",
          options: [
            "Sending too few text tokens",
            "Setting media_type to a format that does not match the real file",
            "Using a list for the content field",
            "Including an instruction before the image"
          ],
          correct_index: 1,
          explanation: "The decoder trusts the media_type label, so a mismatched type errors out or garbles the image."
        },
        {
          question: "When is a URL a better choice than base64 for an image?",
          options: [
            "When the image is private and only on your laptop",
            "When the image is already hosted somewhere the server can fetch",
            "When you need to keep the image secret",
            "When the file is corrupted"
          ],
          correct_index: 1,
          explanation: "A URL keeps the request small but needs the image to be publicly reachable; base64 suits private or local files."
        }
      ],
      participation_activities: [
        {
          activity_title: "Image request check",
          questions: [
            { question: "The content field of a vision message is a list that can hold both text and image blocks.", type: "true_false", correct_answer: "true", explanation: "Text and image blocks sit side by side in the content list." },
            { question: "Encoding image bytes as plain text so they fit in a JSON field is called ______.", type: "fill_in", correct_answer: "base64", explanation: "Base64 represents binary data using text characters." }
          ]
        }
      ],
      starter_code: `# Build the content list for a vision message.
import base64

# Pretend these are the raw bytes of a PNG.
raw_bytes = b"\\x89PNG fake image bytes"
encoded = base64.b64encode(raw_bytes).decode("utf-8")

# TODO: build a content list with a text block and an image block.
content = []
print(len(content), "blocks")
`,
      solution_code: `import base64

raw_bytes = b"\\x89PNG fake image bytes"
encoded = base64.b64encode(raw_bytes).decode("utf-8")

content = [
    {"type": "text", "text": "What is in this image?"},
    {"type": "image", "source": {"type": "base64",
                                 "media_type": "image/png",
                                 "data": encoded}}
]

print(len(content), "blocks")
print(content[0]["type"], content[1]["type"])
`,
      expected_output: `2 blocks
text image`,
      step_throughs: [
        {
          title: "base64-encoding a local image",
          steps: [
            { label: "Open the file as bytes", detail: "Read the raw binary contents of the image. This is not text yet — it is the actual file bytes.", code: 'data = open("receipt.png", "rb").read()' },
            { label: "Encode to base64", detail: "Convert the bytes into base64 characters so they can sit inside a text field. The result is a long string.", code: 'b64 = base64.b64encode(data).decode("utf-8")' },
            { label: "Wrap in an image block", detail: "Declare the type and the real media_type, then attach the base64 string as the data.", code: '{"type": "image", "source": {"media_type": "image/png", "data": b64}}' },
            { label: "Add it to the message", detail: "Put a text instruction and the image block into the content list, then send the request.", code: 'content = [text_block, image_block]' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You have a public link to a logo at https://example.com/logo.png. Should you base64-encode it, or send it as a URL?",
          steps: [
            "The image is already hosted at a reachable address.",
            "A URL keeps the request small and avoids inflating it by 33 percent.",
            "Base64 is only needed when the image is private or local."
          ],
          output: "Send it as a URL — it is already public and fetchable."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A 2 MB JPEG on your laptop fails when you label it image/png in a base64 request. What two things should you fix?",
          steps: [
            "First, the media_type is wrong: a JPEG must be labeled image/jpeg, not image/png.",
            "Base64 inflates the 2 MB file to roughly 2.7 MB, which may approach the request size limit.",
            "If it is still too large, downscale the image before encoding so it fits comfortably.",
            "Fix the label and shrink if needed, then resend."
          ],
          output: "Set media_type to image/jpeg and downscale the file if the inflated base64 nears the size limit."
        }
      ],
      comparison_tables: [
        {
          title: "URL vs base64 image input",
          columns: ["Aspect", "URL", "Base64"],
          rows: [
            { cells: ["Request size", "Tiny (just a link)", "Inflated ~33 percent"] },
            { cells: ["Needs hosting?", "Yes, must be reachable", "No, bytes are embedded"] },
            { cells: ["Works for private files", "No", "Yes"] },
            { cells: ["Best when", "Image already public", "Image is local or private"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "URL input vs base64 input",
          bins: [
            { id: "url", label: "Use a URL" },
            { id: "b64", label: "Use base64" }
          ],
          items: [
            { id: "i1", text: "Image already hosted on a public website", bin: "url" },
            { id: "i2", text: "Screenshot saved only on your laptop", bin: "b64" },
            { id: "i3", text: "You want the smallest possible request", bin: "url" },
            { id: "i4", text: "A private receipt that cannot be public", bin: "b64" },
            { id: "i5", text: "A product photo on your CDN", bin: "url" },
            { id: "i6", text: "A local file with no hosting", bin: "b64" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does the API need either a URL or base64, instead of just letting you point at a file on your computer?",
          sampleAnswer: "The model runs on a remote server that has no access to your local filesystem, so a path like /photos/cat.png means nothing to it. The image bytes have to actually reach the server, which means either giving it a link it can fetch over the internet or embedding the bytes directly in the request as base64 text. Both get the real pixel data to the model; a file path does not."
        }
      ],
      hints: [
        "A content list holds dictionaries, each with a 'type' key.",
        "The text block uses type 'text'; the image block uses type 'image'.",
        "The image block's source includes media_type and the base64 data string."
      ],
      challenge_title: "Pick the right media_type",
      challenge_description: "Write a function media_type_for(filename) that returns the correct media_type based on the file extension: .png -> image/png, .jpg or .jpeg -> image/jpeg, .webp -> image/webp. Return 'unsupported' for anything else. Test it on three filenames.",
      challenge_starter_code: `# Map file extensions to media types for an image request.
# TODO: define media_type_for(filename) and test it.
`,
      challenge_solution_code: `def media_type_for(filename):
    name = filename.lower()
    if name.endswith(".png"):
        return "image/png"
    if name.endswith(".jpg") or name.endswith(".jpeg"):
        return "image/jpeg"
    if name.endswith(".webp"):
        return "image/webp"
    return "unsupported"

print(media_type_for("receipt.PNG"))
print(media_type_for("photo.jpeg"))
print(media_type_for("notes.txt"))
`,
      challenge_test_cases: [
        { input: "receipt.PNG", expected_output: "image/png", description: "Extension match is case-insensitive." },
        { input: "photo.jpeg", expected_output: "image/jpeg", description: "Both .jpg and .jpeg map to image/jpeg." },
        { input: "notes.txt", expected_output: "unsupported", description: "Unknown extensions return 'unsupported'." }
      ]
    },
    {
      id: "ai-11-l3",
      project_id: "ai-11",
      order: 3,
      title: "OCR & Document Understanding",
      concept: "OCR",
      xp_reward: 10,
      explanation: `For decades, "read the text in this photo" was its own brittle industry: scan, threshold, segment, guess each letter, pray the table lines up. A vision model collapses that pipeline into one prompt — and it can do something the old tools never could: not just read the receipt, but tell you the tip percentage. The leap from reading characters to understanding documents is the heart of this lesson.

## What it is

**OCR** — optical character recognition — is pulling the text out of an image: a scanned page, a screenshot, a photo of a sign. Classic OCR stops there; it hands you a wall of characters.

**Document understanding** goes further: it reads the image and interprets its structure and meaning — which number is the total, which cell is the date, what the form is asking. A vision model does both in one step because it treats the words it reads as ordinary text it can then reason over.

## How it works

A document request is just a vision request with an instruction that asks for the text or for facts drawn from it:

\`\`\`python
content = [
    {"type": "text", "text": "Extract the merchant, date, and total as JSON."},
    {"type": "image", "source": image_source}
]
# Model reads the receipt's pixels, recognizes the characters,
# then reasons over them to fill the requested fields.
\`\`\`

Two stages happen inside that single call:

1. **Recognition.** The vision encoder turns the page into image tokens; the model reads the glyphs as text.
2. **Interpretation.** Because that text now lives in the same context as your instruction, the model can locate the total, normalize the date, or output structured JSON — the same reasoning it does over typed text.

This is why asking for **structured output** ("return JSON with these keys") works so well: you are reading and parsing in one shot.

## Why it matters

Document understanding is one of the highest-value vision uses, but it has sharp edges:

- **Quality decides accuracy.** Blurry, skewed, low-light, or low-resolution images cause misreads. Garbage pixels in, garbage text out.
- **It can hallucinate fields.** If a value is unreadable, the model may invent a plausible one rather than admit it can't see it. Tell it to return null or "unreadable" for missing fields.
- **Handwriting and dense tables are hard.** Messy handwriting and tightly packed spreadsheets trip even strong models. Verify the numbers that matter.

## The mental model to keep

A vision model doesn't just transcribe — it reads and understands in one pass. **Treat OCR results like any model output: powerful, fast, and worth verifying when the number on the line is the one that matters.**`,
      key_terms: [
        { term: "OCR", definition: "Optical character recognition: extracting the text contained inside an image." },
        { term: "Document understanding", definition: "Reading an image and interpreting its structure and meaning, not just its raw characters." },
        { term: "Structured output", definition: "Asking the model to return results in a fixed shape, such as JSON with named fields." },
        { term: "Recognition vs interpretation", definition: "First reading the glyphs as text, then reasoning over that text to extract facts." }
      ],
      callouts: [
        { type: "insight", title: "Reading and parsing in one shot", content: "Old OCR gave you characters and stopped. A vision model reads the characters and then reasons over them in the same call, so you can ask for the total or a clean JSON record directly.", position: "before" },
        { type: "warning", title: "Unreadable can become invented", content: "When a field is blurry, the model may guess a plausible value instead of saying it cannot read it. Instruct it to return null or 'unreadable' so gaps stay visible.", position: "after" }
      ],
      concept_diagram: {
        title: "From a photo of a document to clean data",
        steps: [
          { label: "Send image + instruction", desc: "Attach the document and ask for the fields you need." },
          { label: "Recognize the text", desc: "The model reads the glyphs as characters." },
          { label: "Interpret structure", desc: "It locates the total, date, and other fields." },
          { label: "Return structured output", desc: "It emits JSON or a clean answer you can use." }
        ]
      },
      inline_quizzes: [
        {
          question: "How does document understanding go beyond plain OCR?",
          options: ["It prints the text in a larger font", "It reads the text and interprets structure and meaning, like finding the total", "It only works on PDFs"],
          correct_index: 1,
          explanation: "Plain OCR returns raw characters; document understanding also reasons over them to extract meaning."
        }
      ],
      quiz_questions: [
        {
          question: "What does OCR do?",
          options: [
            "Generates a new image from a description",
            "Extracts the text contained inside an image",
            "Compresses an image for faster upload",
            "Translates an image into another language only"
          ],
          correct_index: 1,
          explanation: "OCR is optical character recognition: pulling the text out of an image."
        },
        {
          question: "Why might a vision model report a wrong total from a receipt?",
          options: [
            "It always rounds numbers down",
            "If the image is blurry or skewed, it can misread or invent the value",
            "It refuses to read receipts for privacy",
            "It can only read printed books"
          ],
          correct_index: 1,
          explanation: "Poor image quality causes misreads, and the model may fill an unreadable field with a plausible guess."
        },
        {
          question: "What instruction best reduces invented field values?",
          options: [
            "Ask for the answer in all capital letters",
            "Tell it to return null or 'unreadable' when a field cannot be read",
            "Ask it to answer as fast as possible",
            "Request a longer explanation"
          ],
          correct_index: 1,
          explanation: "Telling the model to mark unreadable fields keeps gaps visible instead of letting it guess."
        }
      ],
      participation_activities: [
        {
          activity_title: "OCR reliability check",
          questions: [
            { question: "A blurry or skewed image can cause a vision model to misread text.", type: "true_false", correct_answer: "true", explanation: "Image quality directly affects recognition accuracy." },
            { question: "Asking the model to return results as JSON with named fields is called ______ output.", type: "fill_in", correct_answer: "structured", explanation: "Structured output returns data in a fixed, parseable shape." }
          ]
        }
      ],
      starter_code: `# Simulate parsing a model's OCR JSON result from a receipt.
import json

ocr_result = '{"merchant": "Cafe Lux", "date": "2026-06-15", "total": 18.50}'

# TODO: parse the JSON and print each field clearly.
data = json.loads(ocr_result)
print(data["merchant"])
`,
      solution_code: `import json

ocr_result = '{"merchant": "Cafe Lux", "date": "2026-06-15", "total": 18.50}'

data = json.loads(ocr_result)
print("merchant:", data["merchant"])
print("date:", data["date"])
print("total:", data["total"])
`,
      expected_output: `merchant: Cafe Lux
date: 2026-06-15
total: 18.5`,
      step_throughs: [
        {
          title: "extracting fields from a receipt photo",
          steps: [
            { label: "Send image and ask for fields", detail: "Attach the receipt and instruct the model to return the merchant, date, and total as JSON.", code: '"Extract merchant, date, total as JSON."' },
            { label: "Recognize the characters", detail: "The vision encoder turns the receipt into image tokens, and the model reads the printed glyphs as text.", code: 'pixels -> "Cafe Lux ... TOTAL 18.50"' },
            { label: "Interpret the structure", detail: "Because the text shares context with the instruction, the model locates which number is the total and which string is the date.", code: 'total = 18.50, date = "2026-06-15"' },
            { label: "Return clean JSON", detail: "It emits a structured record you can parse directly in code, no regex pipeline needed.", code: '{"merchant": "Cafe Lux", "total": 18.50}' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You photograph a printed sign and ask the model to type out exactly what it says. Is that closer to OCR or to document understanding?",
          steps: [
            "You only asked for the literal text, with no interpretation of meaning or structure.",
            "Reading characters out of an image is the definition of OCR.",
            "Document understanding would be asking what the sign means or extracting a specific fact from it."
          ],
          output: "OCR — it is plain text extraction."
        },
        {
          number: 2, difficulty: "hard",
          prompt: "You batch-process 500 receipt photos into JSON. About 30 come back with totals that look too clean, like 20.00, on receipts that were blurry. What is likely happening, and how do you make the failures visible?",
          steps: [
            "Blurry receipts are hard to read, so the model may be guessing plausible totals rather than reading them.",
            "A suspiciously round value on a blurry image is a classic sign of an invented field.",
            "Add an instruction to return null for any field it cannot read with confidence, instead of guessing.",
            "Also ask it to return a confidence flag, then route low-confidence or null results to human review.",
            "Finally, verify a sample of the clean-looking values against the original images."
          ],
          output: "The model is likely inventing totals for unreadable receipts; force null on low confidence and route those to review."
        }
      ],
      comparison_tables: [
        {
          title: "classic OCR vs vision-model document understanding",
          columns: ["Aspect", "Classic OCR", "Vision-model understanding"],
          rows: [
            { cells: ["Output", "Raw characters", "Characters plus interpreted fields"] },
            { cells: ["Layout reasoning", "Brittle, rule-based", "Handles varied layouts"] },
            { cells: ["Structured extraction", "Needs separate parsing", "Can return JSON directly"] },
            { cells: ["Failure mode", "Garbled text", "May invent plausible values"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "plain OCR vs document understanding",
          bins: [
            { id: "ocr", label: "Plain OCR" },
            { id: "doc", label: "Document understanding" }
          ],
          items: [
            { id: "i1", text: "Type out every character on a sign", bin: "ocr" },
            { id: "i2", text: "Return the tip percentage from a receipt", bin: "doc" },
            { id: "i3", text: "Transcribe a scanned page word for word", bin: "ocr" },
            { id: "i4", text: "Extract merchant, date, and total as JSON", bin: "doc" },
            { id: "i5", text: "Copy the text from a screenshot", bin: "ocr" },
            { id: "i6", text: "Decide which line of an invoice is the subtotal", bin: "doc" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a vision model extract the total from a receipt when old OCR tools could only hand you a wall of characters?",
          sampleAnswer: "The old tools stopped at recognition — turning pixels into raw characters — and left any meaning for a separate, brittle parsing step. A vision model reads the characters and then keeps reasoning over them in the same call, because the recognized text now sits in the same context as your instruction. That lets it locate which number is the total and even return it as structured JSON, combining reading and understanding in one pass."
        }
      ],
      hints: [
        "json.loads turns a JSON string into a Python dictionary.",
        "Access fields by key, like data['merchant'].",
        "The total parses as a number, so 18.50 prints as 18.5."
      ],
      challenge_title: "Flag unreadable fields",
      challenge_description: "Write a function clean_record(record) that takes a dict of extracted fields and replaces any value equal to '' or 'unreadable' with None, so missing fields are visible. Print the cleaned record.",
      challenge_starter_code: `record = {"merchant": "Cafe Lux", "date": "unreadable", "total": ""}
# TODO: define clean_record(record) that turns '' or 'unreadable' into None.
`,
      challenge_solution_code: `record = {"merchant": "Cafe Lux", "date": "unreadable", "total": ""}

def clean_record(record):
    cleaned = {}
    for key, value in record.items():
        if value == "" or value == "unreadable":
            cleaned[key] = None
        else:
            cleaned[key] = value
    return cleaned

print(clean_record(record))
`,
      challenge_test_cases: [
        { input: "{'merchant': 'Cafe Lux', 'date': 'unreadable', 'total': ''}", expected_output: "{'merchant': 'Cafe Lux', 'date': None, 'total': None}", description: "Both '' and 'unreadable' become None." }
      ]
    },
    {
      id: "ai-11-l4",
      project_id: "ai-11",
      order: 4,
      title: "Image Generation Basics",
      concept: "Generation",
      xp_reward: 10,
      explanation: `Reading an image and making one are opposite jobs done by opposite machines. A vision model takes pixels and gives you text. An image generator takes text and gives you pixels. It does not "paint" — it starts with pure visual static and removes the noise, step by step, until a picture that matches your words emerges. Understanding that backwards-from-noise idea is the key to this whole lesson.

## What it is

**Image generation** is producing a new picture from a text **prompt**. The dominant approach today is the **diffusion model**: it learns to turn random noise into an image that fits a description. You type "a red bicycle in the rain, watercolor," and it conjures a matching image that never existed before.

The trick is counterintuitive. During training the model watches clean images get destroyed into static, and it learns to reverse that destruction. At generation time it runs the reversal: start from noise, denoise toward your prompt.

## How it works

Generation runs as a loop of small cleanups, each guided by your text:

1. **Start from noise.** Begin with a canvas of random static — no picture yet.
2. **Predict the noise to remove.** Guided by your prompt, the model estimates what part of the current image is "just noise."
3. **Subtract a little.** Remove a slice of that noise, nudging the canvas toward a coherent image.
4. **Repeat for many steps.** After dozens of passes, a sharp image consistent with the prompt remains.

\`\`\`python
image = random_noise()
for step in range(num_steps):
    noise = model.predict_noise(image, prompt)  # text guides the guess
    image = image - small_amount(noise)         # denoise one step
# after the loop, image matches the prompt
\`\`\`

More steps usually means more detail but more time and cost. The prompt steers every step, which is why specific, descriptive prompts beat vague ones.

## Why it matters

Generation has its own rules and limits, different from vision-reading:

- **Prompt detail controls the result.** Subject, style, lighting, and composition all belong in the prompt. "A logo" gives chaos; "a minimalist flat fox logo, two colors, white background" gives something usable.
- **Text inside images is weak.** Generators famously mangle words and letters on signs, because they synthesize shapes, not type.
- **Same prompt, different images.** A random **seed** starts the noise, so the same prompt yields different pictures unless you fix the seed for reproducibility.
- **Rights and safety matter.** Generated images raise copyright, likeness, and misuse questions that text rarely does.

## The mental model to keep

An image generator is a noise-remover, not a painter. **It begins with random static and, guided by your words, subtracts noise step by step until a matching picture appears** — so the clearer your words, the better the steering.`,
      key_terms: [
        { term: "Image generation", definition: "Producing a new picture from a text prompt." },
        { term: "Diffusion model", definition: "A generator that learns to turn random noise into an image matching a description." },
        { term: "Denoising", definition: "Repeatedly removing predicted noise to reveal a coherent image." },
        { term: "Seed", definition: "The starting randomness; fixing it makes the same prompt reproduce the same image." }
      ],
      callouts: [
        { type: "analogy", title: "Sculpting away static", content: "Picture a block of TV static instead of marble. Each step the model chips away the noise that does not belong, guided by your description, until a picture is left standing.", position: "before" },
        { type: "warning", title: "Generators are bad at letters", content: "Asking for a sign or logo with specific words often produces garbled text, because the model synthesizes shapes rather than typing characters. Add real text afterward in a design tool.", position: "after" }
      ],
      concept_diagram: {
        title: "How a picture emerges from noise",
        steps: [
          { label: "Start from noise", desc: "Begin with a canvas of random static." },
          { label: "Predict the noise", desc: "Guided by the prompt, estimate what is noise." },
          { label: "Subtract a slice", desc: "Remove some noise, nudging toward an image." },
          { label: "Repeat many steps", desc: "After many passes a sharp, on-prompt image remains." }
        ]
      },
      inline_quizzes: [
        {
          question: "How does a diffusion model create an image?",
          options: ["It paints stroke by stroke like an artist", "It starts from random noise and removes noise step by step, guided by the prompt", "It copies the nearest image from its training set"],
          correct_index: 1,
          explanation: "Diffusion begins with noise and denoises toward a picture that matches the text prompt."
        }
      ],
      quiz_questions: [
        {
          question: "What is a diffusion model's core trick?",
          options: [
            "Searching the web for a matching photo",
            "Learning to reverse the destruction of an image, turning noise into a picture",
            "Stitching together cropped training images",
            "Drawing outlines and filling them in"
          ],
          correct_index: 1,
          explanation: "A diffusion model learns to reverse noise into a coherent image guided by the prompt."
        },
        {
          question: "Why does the same prompt often produce different images?",
          options: [
            "The model forgets the prompt between runs",
            "A random seed starts the noise differently each time unless you fix it",
            "Image generators ignore prompts entirely",
            "The model picks a random training image"
          ],
          correct_index: 1,
          explanation: "The starting noise depends on a seed; without fixing it, each run begins differently and diverges."
        },
        {
          question: "What is image generators' well-known weakness?",
          options: [
            "They cannot use color",
            "They often garble text and letters inside the image",
            "They only work in black and white",
            "They refuse abstract styles"
          ],
          correct_index: 1,
          explanation: "Generators synthesize shapes rather than type, so words inside an image often come out mangled."
        }
      ],
      participation_activities: [
        {
          activity_title: "Generation check",
          questions: [
            { question: "A diffusion model paints an image stroke by stroke from a blank canvas.", type: "true_false", correct_answer: "false", explanation: "It starts from random noise and removes noise step by step." },
            { question: "Fixing the starting randomness so a prompt reproduces the same image means fixing the ______.", type: "fill_in", correct_answer: "seed", explanation: "The seed controls the starting noise and thus reproducibility." }
          ]
        }
      ],
      starter_code: `# Simulate the denoising loop with simple numbers.
# Start "noise" high and reduce it each step toward a clean image (0).
noise = 100.0
steps = 5

# TODO: each step, remove 40 percent of the remaining noise. Print after each step.
for step in range(steps):
    pass
print("final noise:", round(noise, 2))
`,
      solution_code: `noise = 100.0
steps = 5

for step in range(steps):
    noise = noise - noise * 0.4   # remove 40 percent of remaining noise
    print(f"step {step + 1}: noise {round(noise, 2)}")

print("final noise:", round(noise, 2))
`,
      expected_output: `step 1: noise 60.0
step 2: noise 36.0
step 3: noise 21.6
step 4: noise 12.96
step 5: noise 7.78
final noise: 7.78`,
      step_throughs: [
        {
          title: "one image, denoised into being",
          steps: [
            { label: "Start from pure noise", detail: "The canvas is random static with no picture in it. The prompt is set but nothing has formed yet.", code: 'image = random_noise(); prompt = "a red bike"' },
            { label: "Predict what is noise", detail: "Guided by the prompt, the model estimates which part of the current canvas is noise that does not belong.", code: "noise = model.predict_noise(image, prompt)" },
            { label: "Subtract a slice", detail: "Remove a small amount of that noise, nudging the canvas slightly toward a coherent, on-prompt image.", code: "image = image - small_amount(noise)" },
            { label: "Repeat to sharpness", detail: "After many passes the static resolves into a clear picture matching the words. More steps usually means more detail.", code: "for step in range(40): ... # image sharpens" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You run the prompt 'a cat' three times and get three different cats. Is the model broken?",
          steps: [
            "Each run starts from a different random seed, so the initial noise differs.",
            "Different starting noise denoises into a different image even with the same prompt.",
            "To get the same cat every time, fix the seed."
          ],
          output: "Not broken — different seeds produce different images; fix the seed to reproduce one."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You need a clean storefront logo that reads 'BLOOM' under a flower. The generator keeps producing a nice flower but garbled letters like 'BL00N'. What is the right workflow?",
          steps: [
            "Generators synthesize shapes, not type, so embedded words come out mangled.",
            "Generate only the visual element: a clean, minimalist flower mark with no text.",
            "Add the word 'BLOOM' afterward in a design tool using a real font.",
            "This plays to each tool's strength: the model for imagery, typography software for crisp text."
          ],
          output: "Generate the flower without text, then add 'BLOOM' in a design tool with a real font."
        }
      ],
      comparison_tables: [
        {
          title: "reading images vs generating images",
          columns: ["Aspect", "Vision (reading)", "Generation (making)"],
          rows: [
            { cells: ["Input", "Image plus text", "Text prompt"] },
            { cells: ["Output", "Text", "A new image"] },
            { cells: ["Core method", "Encode image to tokens", "Denoise from random static"] },
            { cells: ["Direction", "Pixels in, words out", "Words in, pixels out"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "good vs weak prompts for generation",
          bins: [
            { id: "good", label: "Strong prompt" },
            { id: "weak", label: "Weak prompt" }
          ],
          items: [
            { id: "i1", text: "Minimalist flat fox logo, two colors, white background", bin: "good" },
            { id: "i2", text: "A logo", bin: "weak" },
            { id: "i3", text: "Watercolor red bicycle in the rain, soft light", bin: "good" },
            { id: "i4", text: "Make it nice", bin: "weak" },
            { id: "i5", text: "Isometric cozy cafe, warm palette, top-down view", bin: "good" },
            { id: "i6", text: "Something cool", bin: "weak" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does a more detailed prompt usually produce a better generated image?",
          sampleAnswer: "The prompt guides every denoising step, telling the model which parts of the current static count as noise to remove. A vague prompt gives weak, ambiguous guidance, so the model has freedom to drift anywhere and the result is unpredictable. A detailed prompt that names the subject, style, lighting, and composition steers each step more precisely toward the picture you actually want, so the final denoised image lands much closer to your intent."
        }
      ],
      hints: [
        "Each step: subtract 40 percent of the current noise from itself.",
        "noise = noise - noise * 0.4 reduces it by 40 percent.",
        "Print inside the loop to see the noise shrink each step."
      ],
      challenge_title: "Steps versus quality",
      challenge_description: "Write a function denoise(start, steps) that begins at the given noise level and removes 30 percent of the remaining noise each step, returning the final noise level rounded to 2 decimals. Show that more steps leaves less noise by printing denoise(100, 3) and denoise(100, 6).",
      challenge_starter_code: `# More steps -> less remaining noise -> a cleaner image.
# TODO: define denoise(start, steps) removing 30 percent each step.
`,
      challenge_solution_code: `def denoise(start, steps):
    noise = start
    for _ in range(steps):
        noise = noise - noise * 0.3
    return round(noise, 2)

print(denoise(100, 3))
print(denoise(100, 6))
`,
      challenge_test_cases: [
        { input: "denoise(100, 3)", expected_output: "34.3", description: "100 * 0.7^3 = 34.3." },
        { input: "denoise(100, 6)", expected_output: "11.76", description: "100 * 0.7^6 = 11.76, less noise with more steps." }
      ]
    },
    {
      id: "ai-11-l5",
      project_id: "ai-11",
      order: 5,
      title: "Costs & Limits of Vision",
      concept: "VisionCost",
      xp_reward: 10,
      explanation: `A founder wired a vision model into a "snap a photo of your fridge" app, shipped it, and watched the bill explode. The culprit was not traffic. Every user was uploading 12-megapixel phone photos, and each one quietly became thousands of image tokens. The app worked perfectly and lost money on every scan. Vision is powerful, but pixels are not free — and knowing the cost math is what separates a demo from a product.

## What it is

**Vision cost** is the extra token spend an image adds to a request. An image isn't billed as "one image." It is converted to **image tokens** — recall the patches from lesson 1 — and those tokens are billed like any input tokens. The higher the resolution, the more patches, the more tokens, the bigger the bill.

Most APIs expose a **detail level** (often "low" and "high"). Low detail downscales the image to a small fixed size, capping its token count cheaply. High detail keeps more resolution and costs far more.

## How it works

The cost of a vision request is text tokens plus image tokens plus the output:

\`\`\`python
# Rough shape of a vision bill
image_tokens = patches_from(resolution, detail)   # the big variable
input_tokens = text_tokens + image_tokens
cost = input_tokens / 1_000_000 * input_price \\
     + output_tokens / 1_000_000 * output_price
\`\`\`

Three levers control the bill:

1. **Resolution.** Token count grows with area, so doubling each side roughly quadruples image tokens.
2. **Detail level.** "Low" caps tokens for coarse tasks (is this a cat or a dog?); "high" pays for fine tasks (read this tiny serial number).
3. **Number of images.** Each image in the prompt adds its own token load, and multi-image prompts add up fast.

## Why it matters

Vision economics shape what is worth building:

- **Match detail to the task.** Classifying or describing usually works at low detail; reading fine print or counting small objects needs high. Defaulting everything to high quietly multiplies your bill.
- **Downscale before you send.** Resizing a 12-megapixel photo to what the model actually needs can cut image tokens dramatically with no loss in answer quality.
- **Latency, not just money.** More image tokens also mean slower responses, which hurts real-time apps.
- **Hard limits exist.** APIs cap image dimensions, file size, and images per request, so plan around them.

## The mental model to keep

An image is just a pile of tokens in disguise. **Send the smallest image and lowest detail that still answers the question** — that single habit is the difference between a vision feature that scales and one that bankrupts the demo.`,
      key_terms: [
        { term: "Vision cost", definition: "The extra token spend an image adds to a request, billed as image tokens." },
        { term: "Detail level", definition: "An API setting, often low or high, trading image quality for token cost." },
        { term: "Downscaling", definition: "Shrinking an image before sending it to reduce its image-token count." },
        { term: "Image limit", definition: "A cap on dimensions, file size, or number of images the API will accept per request." }
      ],
      callouts: [
        { type: "tip", title: "Low detail is your default", content: "Most describe-or-classify tasks work fine at low detail, which caps tokens cheaply. Reach for high detail only when the task truly needs fine resolution, like reading small print.", position: "before" },
        { type: "warning", title: "Raw phone photos are expensive", content: "A 12-megapixel upload can become thousands of image tokens. Downscale to what the task needs before sending, or the per-request cost balloons.", position: "after" }
      ],
      concept_diagram: {
        title: "What drives a vision bill",
        steps: [
          { label: "Pick resolution", desc: "Higher resolution means more patches and tokens." },
          { label: "Pick detail level", desc: "Low caps tokens; high keeps resolution at a price." },
          { label: "Count images", desc: "Each image adds its own token load." },
          { label: "Sum the tokens", desc: "Image tokens plus text plus output set the cost." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does a higher-resolution image cost more in a vision request?",
          options: ["The file takes longer to upload", "It becomes more patches, which means more image tokens", "The model charges a flat fee per photo"],
          correct_index: 1,
          explanation: "More resolution means more patches, each an image token, so the input token count rises."
        }
      ],
      quiz_questions: [
        {
          question: "How is an image billed in a vision request?",
          options: [
            "As a flat fee of one image per request",
            "Converted into image tokens that are billed like input tokens",
            "Free, because only text is charged",
            "By file size in megabytes only"
          ],
          correct_index: 1,
          explanation: "Images become image tokens, which are billed at the input token rate."
        },
        {
          question: "When is 'low' detail the right choice?",
          options: [
            "When reading tiny serial numbers",
            "For coarse tasks like deciding if a photo shows a cat or a dog",
            "Never, high detail is always better",
            "Only for black-and-white images"
          ],
          correct_index: 1,
          explanation: "Low detail caps tokens cheaply and is plenty for coarse classification or description."
        },
        {
          question: "What is the simplest way to cut vision cost without hurting answer quality?",
          options: [
            "Send the full-resolution photo every time",
            "Downscale the image to what the task actually needs before sending",
            "Add more text to the prompt",
            "Ask for a shorter answer only"
          ],
          correct_index: 1,
          explanation: "Downscaling reduces image tokens directly, often with no loss in answer quality for the task."
        }
      ],
      participation_activities: [
        {
          activity_title: "Vision cost check",
          questions: [
            { question: "Sending a full 12-megapixel photo always costs the same as a downscaled version.", type: "true_false", correct_answer: "false", explanation: "More pixels mean more image tokens, so it costs more." },
            { question: "Shrinking an image before sending it to reduce token count is called ______.", type: "fill_in", correct_answer: "downscaling", explanation: "Downscaling lowers the image-token count and the bill." }
          ]
        }
      ],
      starter_code: `# Estimate the cost of a vision request.
image_tokens = 1024
text_tokens = 50
output_tokens = 200
input_price = 3    # dollars per 1,000,000 input tokens
output_price = 15  # dollars per 1,000,000 output tokens

# TODO: compute total cost and print it to 6 decimal places.
input_tokens = image_tokens + text_tokens
print("input tokens:", input_tokens)
`,
      solution_code: `image_tokens = 1024
text_tokens = 50
output_tokens = 200
input_price = 3
output_price = 15

input_tokens = image_tokens + text_tokens
input_cost = input_tokens / 1_000_000 * input_price
output_cost = output_tokens / 1_000_000 * output_price
total = input_cost + output_cost

print("input tokens:", input_tokens)
print(f"total cost: \${total:.6f}")
`,
      expected_output: `input tokens: 1074
total cost: $0.006222`,
      step_throughs: [
        {
          title: "where the money goes in a vision call",
          steps: [
            { label: "Resolution sets patches", detail: "The image is patched, and resolution decides how many patches there are. A bigger image means many more image tokens.", code: "1024x1024 / 16 -> 4096 image tokens" },
            { label: "Detail caps or keeps tokens", detail: "Low detail downscales to a small fixed size, capping tokens; high detail keeps resolution and its token cost.", code: 'detail="low" -> ~85 tokens; "high" -> thousands' },
            { label: "Add text and output", detail: "Your instruction tokens and the model's reply tokens stack on top of the image tokens.", code: "input = image_tokens + text_tokens" },
            { label: "Multiply by price", detail: "Total cost is input tokens times the input price plus output tokens times the output price.", code: "cost = input/1e6*in_price + output/1e6*out_price" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "An image becomes 800 image tokens. Input is priced at $3 per 1,000,000 tokens. What do just the image tokens cost?",
          steps: [
            "Cost = tokens / 1,000,000 * price.",
            "Cost = 800 / 1,000,000 * 3.",
            "= 0.0008 * 3 = 0.0024."
          ],
          output: "$0.0024 for the image tokens"
        },
        {
          number: 2, difficulty: "hard",
          prompt: "An app processes 100,000 fridge photos a day. At high detail each photo is 4000 image tokens; at low detail it is 800. The task is just 'list the visible items,' and input costs $3 per 1,000,000 tokens. How much does switching from high to low detail save per day?",
          steps: [
            "High detail per photo: 4000 / 1,000,000 * 3 = $0.012.",
            "Low detail per photo: 800 / 1,000,000 * 3 = $0.0024.",
            "Savings per photo: 0.012 - 0.0024 = $0.0096.",
            "Across 100,000 photos: 0.0096 * 100000 = $960 per day.",
            "Listing visible items is a coarse task, so low detail is enough — the savings come with no quality loss."
          ],
          output: "About $960 saved per day by using low detail for a task that does not need fine resolution."
        }
      ],
      comparison_tables: [
        {
          title: "low detail vs high detail",
          columns: ["Aspect", "Low detail", "High detail"],
          rows: [
            { cells: ["Image tokens", "Capped, small", "Large, scales with resolution"] },
            { cells: ["Cost", "Cheap", "Much higher"] },
            { cells: ["Good for", "Classify, describe, scene gist", "Read fine print, count small items"] },
            { cells: ["Default choice", "Yes, for coarse tasks", "Only when truly needed"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "low detail vs high detail tasks",
          bins: [
            { id: "low", label: "Low detail is enough" },
            { id: "high", label: "Needs high detail" }
          ],
          items: [
            { id: "i1", text: "Is this photo indoors or outdoors?", bin: "low" },
            { id: "i2", text: "Read the tiny serial number on a chip", bin: "high" },
            { id: "i3", text: "Describe the overall scene", bin: "low" },
            { id: "i4", text: "Transcribe small print on a contract", bin: "high" },
            { id: "i5", text: "Is there a dog in the picture?", bin: "low" },
            { id: "i6", text: "Count the dozens of screws in a tray", bin: "high" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why can a working vision app still lose money, and what one habit fixes it?",
          sampleAnswer: "The app can be correct on every request yet unprofitable because each image is silently converted into image tokens, and full-resolution phone photos at high detail become thousands of tokens that are billed like any input. Across many users that token load dominates the bill even though the feature works. The fixing habit is to send the smallest image and lowest detail that still answers the question, downscaling before upload and reserving high detail for tasks that genuinely need fine resolution."
        }
      ],
      hints: [
        "Input tokens are image tokens plus text tokens.",
        "Cost for a group is tokens / 1,000,000 * price.",
        "Add input cost and output cost, then format with :.6f."
      ],
      challenge_title: "Compare detail levels",
      challenge_description: "Write a function vision_cost(image_tokens, text_tokens, output_tokens) returning total cost, with input at $3 and output at $15 per 1,000,000 tokens, rounded to 6 decimals. Compare a high-detail call (image_tokens=4000) and a low-detail call (image_tokens=800), both with text_tokens=40 and output_tokens=150. Print both.",
      challenge_starter_code: `# Input: $3 / 1,000,000 tokens. Output: $15 / 1,000,000 tokens.
# TODO: define vision_cost(image_tokens, text_tokens, output_tokens).
`,
      challenge_solution_code: `def vision_cost(image_tokens, text_tokens, output_tokens):
    input_tokens = image_tokens + text_tokens
    input_cost = input_tokens / 1_000_000 * 3
    output_cost = output_tokens / 1_000_000 * 15
    return round(input_cost + output_cost, 6)

print("high:", vision_cost(4000, 40, 150))
print("low:", vision_cost(800, 40, 150))
`,
      challenge_test_cases: [
        { input: "image_tokens=4000, text=40, output=150", expected_output: "0.014370", description: "(4040*3 + 150*15)/1e6 = 0.012120 + 0.002250 = 0.014370." },
        { input: "image_tokens=800, text=40, output=150", expected_output: "0.004770", description: "(840*3 + 150*15)/1e6 = 0.002520 + 0.002250 = 0.004770." }
      ]
    }
  ]
};
