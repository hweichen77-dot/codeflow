export default {
  project: {
    id: "ai-11",
    title: "Multimodal AI: Vision & Images",
    description: "See how models read images, pull text out of documents, and generate pictures from words. Build the mental model for working with vision and the cost of feeding pixels to a model.",
    difficulty: "intermediate",
    category: "vision_multimodal",
    estimated_time: 50,
    lessons_count: 8,
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
      challenge_title: "The Patch Budget",
      challenge_description: "Compute exactly how many image tokens a multimodal model will charge for a batch of uploads, after it resizes each image and slices it into patches.",
      challenge_story: "You run the vision pipeline for a document-AI product. Users upload photos of receipts, contracts, and whiteboards, and the model **doesn't see pixels** — it resizes each image, chops it into a grid of square **patches**, and turns every patch into one token. Finance is panicking because last month's image bill tripled, and nobody can explain why. Your job: build the **patch budgeter** that, given the model's patch size and a batch of uploads, reports the exact token count for each image *before* the request is sent — so the team can cap costs instead of discovering them on the invoice.",
      challenge_statement: "The model processes each image in two stages:\n\n1. **Resize.** Each image has a *detail mode*: \`low\` clamps the **longest side** to **512** pixels; \`high\` clamps the longest side to **1536** pixels. If the longest side already fits within the cap, the image is **left unchanged**. Otherwise both dimensions are scaled by \`cap / longest_side\` and **floored** to whole pixels (the shorter side may round down).\n2. **Patch.** The resized image is tiled by a square patch of side \`P\`. A partial patch at the right or bottom edge still counts as a full patch, so the patch count along a dimension of size \`d\` is \`ceil(d / P)\`. The token count for the image is \`patches_wide * patches_tall\`.\n\nFor each image in the batch, print its token count.",
      challenge_input_format: "The first line has two integers `P q`: the patch side and the number of images.\n\nEach of the next `q` lines describes one image: a detail mode (`low` or `high`), then two integers `w h` (original width and height in pixels), space-separated.",
      challenge_output_format: "Print `q` lines. Line `i` is the integer token count for image `i`, in input order.",
      challenge_constraints: [
        "1 ≤ P ≤ 256",
        "1 ≤ q ≤ 1000",
        "1 ≤ w, h ≤ 100000",
        "Detail mode is always the literal `low` or `high`.",
      ],
      challenge_examples: [
        { input: "16 3\nlow 1024 1024\nhigh 2048 1024\nhigh 100 100", output: "1024\n4608\n49", explanation: "`low 1024 1024`: cap 512, scale to 512x512, 32x32 patches = 1024. `high 2048 1024`: cap 1536, scale to 1536x768, 96x48 = 4608. `high 100 100`: already under 1536, ceil(100/16)=7, 7x7 = 49." },
        { input: "16 1\nlow 4000 3000", output: "768", explanation: "Cap 512, scale by 512/4000: width 512, height floor(3000*512/4000)=384, patches 32x24 = 768." },
      ],
      challenge_notes: "Real models charge by patches, not megabytes, which is why a tall skinny screenshot can cost more than a small square logo. The floor on resize and the ceil on patching pull in opposite directions — getting both rounding rules right is the whole problem. `low` is for 'is there a cat in this photo' questions; `high` is for reading the serial number on a chip.",
      challenge_hints: [
        "Find the longest side first. Only resize when it exceeds the cap; scale both dimensions by the same ratio and floor each.",
        "Use integer math for the resize: `nw = w * cap // longest` avoids float drift entirely.",
        "Patch count along a side of length `d` is `(d + P - 1) // P` — that is ceil division without importing math.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    P = int(data[idx]); idx += 1
    q = int(data[idx]); idx += 1
    # TODO: for each image, read detail, w, h; resize per the cap; count patches.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split()
    idx = 0
    P = int(data[idx]); idx += 1
    q = int(data[idx]); idx += 1
    out = []
    for _ in range(q):
        detail = data[idx]; idx += 1
        w = int(data[idx]); idx += 1
        h = int(data[idx]); idx += 1
        cap = 512 if detail == "low" else 1536
        longest = max(w, h)
        if longest > cap:
            nw = (w * cap) // longest
            nh = (h * cap) // longest
        else:
            nw, nh = w, h
        pw = (nw + P - 1) // P
        ph = (nh + P - 1) // P
        out.append(str(pw * ph))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "16 3\nlow 1024 1024\nhigh 2048 1024\nhigh 100 100", expected_output: "1024\n4608\n49", description: "Resize + patch math across both detail modes." },
        { input: "16 1\nlow 4000 3000", expected_output: "768", description: "Non-square image floors the shorter side after scaling." },
        { input: "16 1\nhigh 7 7", expected_output: "1", description: "Edge case: image smaller than one patch still costs exactly one token." },
        { input: "1 1\nlow 600 600", expected_output: "262144", description: "Patch size 1 with a clamped 512x512 image yields 512*512 tokens." }
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
      challenge_title: "The Attachment Gateway",
      challenge_description: "Build the request builder that decides, per upload, the correct media_type and whether to send it as a URL or as inflated base64 — then reports the total payload it just committed to.",
      challenge_story: "You're writing the **attachment gateway** that sits between your app and a multimodal model's API. Every image a user attaches has to be turned into a content block the model accepts. Two rules govern this. First, the block needs the right \`media_type\` derived from the file, or the API rejects it outright. Second, you choose how to *deliver* the bytes: a **public** image can be referenced by URL (cheap, the bytes never leave their host), but a **private** image must be **base64-encoded** and inlined into the request — which inflates its size. Get the routing wrong and you either leak private data or blow up your request size. Build the gateway that classifies every attachment correctly and totals the base64 weight you're about to ship.",
      challenge_statement: "Process a batch of attachments. For each one:\n\n1. Determine its \`media_type\` from the **lowercased** filename extension: \`.png\` → \`image/png\`; \`.jpg\` or \`.jpeg\` → \`image/jpeg\`; \`.webp\` → \`image/webp\`; \`.gif\` → \`image/gif\`. Any other extension is **unsupported** and the attachment is rejected.\n\n2. If supported, choose delivery by visibility. A \`public\` attachment is sent by **url**. A \`private\` attachment is sent as **base64**; its encoded size in bytes is \`ceil(raw_bytes / 3) * 4\` (base64 turns every 3 raw bytes into 4 characters).\n\nFor each attachment, print one line:\n- rejected: \`<filename> REJECT unsupported\`\n- public + supported: \`<filename> url <media_type>\`\n- private + supported: \`<filename> base64 <media_type> <encoded_bytes>\`\n\nThen print a final summary line: \`SUMMARY <accepted> <rejected> <total_base64_bytes>\`.",
      challenge_input_format: "The first line is an integer `n`: the number of attachments.\n\nEach of the next `n` lines has three space-separated fields: `filename visibility raw_bytes`, where `visibility` is `public` or `private` and `raw_bytes` is the original file size in bytes.",
      challenge_output_format: "Print `n` per-attachment lines in input order, in the formats above, followed by one `SUMMARY` line.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ raw_bytes ≤ 100000000",
        "Filenames contain no spaces; visibility is `public` or `private`.",
      ],
      challenge_examples: [
        { input: "4\nlogo.PNG public 9000\nreceipt.jpeg private 1201\nnotes.txt private 500\nicon.webp private 10", output: "logo.PNG url image/png\nreceipt.jpeg base64 image/jpeg 1604\nnotes.txt REJECT unsupported\nicon.webp base64 image/webp 16\nSUMMARY 3 1 1620", explanation: "PNG is public so it goes by url. The jpeg is private: ceil(1201/3)*4 = 401*4 = 1604 base64 bytes. notes.txt is unsupported. The webp inflates 10 bytes to ceil(10/3)*4 = 16. Two base64 attachments total 1620 bytes." },
        { input: "1\nphoto.GIF public 100", output: "photo.GIF url image/gif\nSUMMARY 1 0 0", explanation: "Extension matching is case-insensitive, and public images never contribute base64 weight." },
      ],
      challenge_notes: "The 4/3 base64 inflation is exactly why inlining big private images is so costly — a 10 MB photo becomes ~13.3 MB of request body. URL delivery sidesteps that entirely but only works when the host is publicly reachable, which is the real-world trade your gateway is encoding.",
      challenge_hints: [
        "Lowercase the filename once, then test suffixes with `.endswith(...)`. Order doesn't matter since the extensions are distinct.",
        "Base64 size is `((raw_bytes + 2) // 3) * 4` — that is `ceil(raw/3)*4` using only integers.",
        "Track three running totals as you go: accepted count, rejected count, and summed base64 bytes (public images add zero).",
      ],
      challenge_starter_code: `import sys

def media_type(name):
    n = name.lower()
    # TODO: return the media_type for .png/.jpg/.jpeg/.webp/.gif, else None.

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: classify each attachment, print its line, and print the SUMMARY.

main()
`,
      challenge_solution_code: `import sys

def media_type(name):
    n = name.lower()
    if n.endswith(".png"):
        return "image/png"
    if n.endswith(".jpg") or n.endswith(".jpeg"):
        return "image/jpeg"
    if n.endswith(".webp"):
        return "image/webp"
    if n.endswith(".gif"):
        return "image/gif"
    return None

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    accepted = 0
    rejected = 0
    base64_total = 0
    lines = []
    for i in range(1, n + 1):
        parts = data[i].split()
        filename = parts[0]
        visibility = parts[1]
        raw = int(parts[2])
        mt = media_type(filename)
        if mt is None:
            rejected += 1
            lines.append(filename + " REJECT unsupported")
            continue
        accepted += 1
        if visibility == "public":
            lines.append(filename + " url " + mt)
        else:
            enc = ((raw + 2) // 3) * 4
            base64_total += enc
            lines.append(filename + " base64 " + mt + " " + str(enc))
    for line in lines:
        print(line)
    print("SUMMARY " + str(accepted) + " " + str(rejected) + " " + str(base64_total))

main()
`,
      challenge_test_cases: [
        { input: "4\nlogo.PNG public 9000\nreceipt.jpeg private 1201\nnotes.txt private 500\nicon.webp private 10", expected_output: "logo.PNG url image/png\nreceipt.jpeg base64 image/jpeg 1604\nnotes.txt REJECT unsupported\nicon.webp base64 image/webp 16\nSUMMARY 3 1 1620", description: "Mixed batch exercising url, base64, and rejection." },
        { input: "1\nphoto.GIF public 100", expected_output: "photo.GIF url image/gif\nSUMMARY 1 0 0", description: "Case-insensitive match; public adds no base64 weight." },
        { input: "1\nbar.bmp private 50", expected_output: "bar.bmp REJECT unsupported\nSUMMARY 0 1 0", description: "Edge case: an unsupported extension is rejected even when private." },
        { input: "1\nempty.png private 0", expected_output: "empty.png base64 image/png 0\nSUMMARY 1 0 0", description: "Edge case: a zero-byte file encodes to zero base64 bytes." }
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
      challenge_title: "The Extraction Auditor",
      challenge_description: "Take the raw fields a document-understanding model pulled off a receipt, scrub the ones that are blank or unreliable, and decide whether the record can be trusted or must go to human review.",
      challenge_story: "Your accounts-payable bot uses a vision model to read receipts and emit structured fields — merchant, date, total, tax. But the model is honest about uncertainty: it attaches a **confidence score** to each field, and sometimes it returns an empty value or the literal word \`unreadable\` when a photo is blurry. If you pipe those straight into the ledger, garbage flows downstream silently. Build the **extraction auditor**: it normalizes every field, blanks out anything untrustworthy, and routes the whole record to a human when any field falls short — turning silent corruption into a visible review queue.",
      challenge_statement: "You are given a confidence threshold and a list of extracted fields. For each field with name, value, and integer confidence:\n\n- A field is **bad** if its value (after trimming surrounding spaces) is the empty string, equals \`unreadable\` (case-insensitive), **or** its confidence is **strictly below** the threshold.\n- A bad field's value becomes missing; a good field keeps its trimmed value.\n\nPrint each field on its own line, in input order:\n- good: \`<name>: <trimmed_value>\`\n- bad: \`<name>: MISSING\`\n\nAfter the fields, print one routing line:\n- if **any** field was bad: \`REVIEW\` followed by the names of all bad fields in input order, space-separated.\n- if **none** were bad: \`OK\`.",
      challenge_input_format: "The first line has two integers `n threshold`: the number of fields and the confidence cutoff.\n\nEach of the next `n` lines is a field encoded as `name|value|confidence`, using `|` as the separator. The value may be empty (nothing between the bars) and never contains a `|`.",
      challenge_output_format: "Print `n` field lines in input order, then one routing line (`REVIEW ...` or `OK`).",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ threshold ≤ 100",
        "0 ≤ confidence ≤ 100",
        "Field names contain no spaces or `|`; values contain no `|`.",
      ],
      challenge_examples: [
        { input: "4 70\nmerchant|Cafe Lux|95\ndate|unreadable|40\ntotal||0\ntax|3.50|72", output: "merchant: Cafe Lux\ndate: MISSING\ntotal: MISSING\ntax: 3.50\nREVIEW date total", explanation: "merchant and tax clear the bar. date is literally 'unreadable'; total is empty. Both are blanked and the record is routed to review." },
        { input: "2 50\nmerchant|Acme|88\ntotal|42.00|60", output: "merchant: Acme\ntotal: 42.00\nOK", explanation: "Every field has a confident, readable value, so nothing needs review." },
      ],
      challenge_notes: "Surfacing uncertainty instead of hiding it is the whole point of confidence scores. A model that quietly guesses '0.00' for a smudged total is far more dangerous than one that says 'MISSING' and asks a human. This is the same pattern behind 'human in the loop' review queues in production document pipelines.",
      challenge_hints: [
        "Split each field on `|` into exactly three parts. The value may be empty, which `split('|')` handles fine.",
        "Trim the value with `.strip()` before testing it, and compare against `unreadable` with `.lower()` for case-insensitivity.",
        "Collect bad field names in a list as you go; if it's non-empty at the end, join it after `REVIEW`, else print `OK`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    # TODO: clean each field, print its line, then print REVIEW <names> or OK.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n, threshold = map(int, data[idx].split()); idx += 1
    flagged = []
    field_lines = []
    for _ in range(n):
        name, value, conf = data[idx].split("|"); idx += 1
        conf = int(conf)
        v = value.strip()
        bad = (v == "" or v.lower() == "unreadable" or conf < threshold)
        if bad:
            flagged.append(name)
            field_lines.append(name + ": MISSING")
        else:
            field_lines.append(name + ": " + v)
    for line in field_lines:
        print(line)
    if flagged:
        print("REVIEW " + " ".join(flagged))
    else:
        print("OK")

main()
`,
      challenge_test_cases: [
        { input: "4 70\nmerchant|Cafe Lux|95\ndate|unreadable|40\ntotal||0\ntax|3.50|72", expected_output: "merchant: Cafe Lux\ndate: MISSING\ntotal: MISSING\ntax: 3.50\nREVIEW date total", description: "Empty, unreadable, and low-confidence fields all flagged." },
        { input: "2 50\nmerchant|Acme|88\ntotal|42.00|60", expected_output: "merchant: Acme\ntotal: 42.00\nOK", description: "All fields trustworthy yields OK." },
        { input: "1 90\nname|Bob|90", expected_output: "name: Bob\nOK", description: "Edge case: confidence exactly at the threshold passes (strictly-below test)." },
        { input: "1 0\nblank| |50", expected_output: "blank: MISSING\nREVIEW blank", description: "Edge case: a whitespace-only value trims to empty and is flagged even with threshold 0." }
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
      challenge_title: "The Denoising Scheduler",
      challenge_description: "Simulate a diffusion model's denoising loop, report the noise left after each requested step count, and find the smallest number of steps needed to hit a quality target.",
      challenge_story: "You're tuning the **sampler** for an image-generation model. Diffusion models start from pure noise and remove a fixed fraction of the **remaining** noise on every denoising step — more steps means a cleaner image but a slower (and pricier) generation. Your design team keeps asking the same two questions: *'how clean is the image after N steps?'* and *'what's the fewest steps that gets us under our noise budget?'* Instead of eyeballing renders, build the **denoising scheduler** that answers both exactly, so the team can pick a step count on evidence instead of vibes.",
      challenge_statement: "A render begins at noise level \`start\`. Each step multiplies the **remaining** noise by \`(100 - removal) / 100\` — i.e. it removes \`removal\` percent of what's left. Noise only ever decreases.\n\nDo two things:\n\n1. **Minimum steps.** Find the smallest number of steps after which the noise level is **less than or equal to** \`target\`. If \`start\` is already ≤ \`target\`, the answer is \`0\`.\n2. **Queries.** For each query step count \`s\`, report the noise level remaining after exactly \`s\` steps, formatted to **exactly 2 decimal places**.\n\nPrint each query result first (in order), then the minimum-steps line.",
      challenge_input_format: "The first line has three integers `start removal target`.\n\nThe second line has an integer `q`: the number of queries.\n\nEach of the next `q` lines has one integer `s`: a step count to evaluate.",
      challenge_output_format: "Print `q` lines, one per query: the remaining noise after `s` steps, formatted to exactly 2 decimals. Then print a final line `MIN_STEPS <k>` where `k` is the minimum steps to reach `target`.",
      challenge_constraints: [
        "1 ≤ start ≤ 100000",
        "1 ≤ removal ≤ 99",
        "0 ≤ target ≤ start",
        "1 ≤ q ≤ 1000",
        "0 ≤ s ≤ 100000",
      ],
      challenge_examples: [
        { input: "100 30 10\n3\n3\n6\n10", output: "34.30\n11.76\n2.82\nMIN_STEPS 7", explanation: "Each step keeps 70% of the noise. After 3 steps: 100*0.7^3 = 34.30; after 6: 11.76; after 10: 2.82. The first step count whose noise ≤ 10 is 7 (0.7^6 → 11.76 is still above, 0.7^7 → 8.24 is at or below)." },
        { input: "50 10 50\n1\n0", output: "50.00\nMIN_STEPS 0", explanation: "After 0 steps the noise is the start value, and since 50 ≤ the target 50 no steps are needed." },
      ],
      challenge_notes: "This geometric decay is why diffusion samplers show steep early gains and diminishing returns — the first few steps strip most of the noise, and later steps polish. Formatting to a fixed 2 decimals keeps the output unambiguous; never print a raw float whose repr can vary.",
      challenge_hints: [
        "Keep the noise as a float and multiply by `(100 - removal) / 100` each step. Don't try to subtract integers — the fraction matters.",
        "For MIN_STEPS, loop multiplying until the noise is ≤ target, counting steps; handle the already-clean case (answer 0) up front.",
        "Print each query with `\"{:.2f}\".format(value)` so 34.3 shows as `34.30` — a bare `round()` would drop the trailing zero.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    start, removal, target = map(int, data[idx].split()); idx += 1
    q = int(data[idx].strip()); idx += 1
    keep = (100 - removal) / 100.0
    # TODO: answer each query, then compute and print MIN_STEPS.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    start, removal, target = map(int, data[idx].split()); idx += 1
    q = int(data[idx].strip()); idx += 1
    keep = (100 - removal) / 100.0

    noise = float(start)
    min_steps = 0
    while noise > target:
        noise = noise * keep
        min_steps += 1

    out = []
    for _ in range(q):
        s = int(data[idx].strip()); idx += 1
        nz = float(start)
        for _ in range(s):
            nz = nz * keep
        out.append("{:.2f}".format(nz))
    out.append("MIN_STEPS " + str(min_steps))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "100 30 10\n3\n3\n6\n10", expected_output: "34.30\n11.76\n2.82\nMIN_STEPS 7", description: "Geometric decay queries plus the minimum-steps search." },
        { input: "50 10 50\n1\n0", expected_output: "50.00\nMIN_STEPS 0", description: "Edge case: already at or below target needs zero steps." },
        { input: "100 50 5\n2\n1\n5", expected_output: "50.00\n3.12\nMIN_STEPS 5", description: "Half-removal schedule; 0.5^5 = 3.125 is the first to dip under 5." }
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
      challenge_title: "The Detail Router",
      challenge_description: "Route a batch of vision requests to low or high detail, bill each one exactly, and prove how much money the routing saves versus sending everything at high detail.",
      challenge_story: "Your vision API is bleeding money. Every request was being sent at **high detail** by default — gorgeous transcriptions of serial numbers nobody needed, at full token price. You're shipping a **detail router**: a question like 'is there a dog in this photo?' goes \`low\`, while 'read the fine print on this contract' needs \`high\`. Each detail level produces a different image-token count, and the model bills input and output tokens at different rates. Build the router that prices every request at its chosen detail and reports, to the exact cent-fraction, how much you save over the old always-high policy — the number that justifies the whole project to finance.",
      challenge_statement: "Input tokens (image + text) are billed at **$3 per 1,000,000 tokens**; output tokens at **$15 per 1,000,000 tokens**. Every cost is reported to **exactly 6 decimal places**, prefixed with \`$\`.\n\nEach request supplies the image-token count it would use at **low** detail and at **high** detail, plus its text and output token counts, and a flag for whether it **needs** high detail.\n\nFor each request, charge it at the detail it needs (\`high\` if the flag is 1, else \`low\`) and print: \`<name> <chosen_detail> <cost>\`.\n\nThen print three summary lines:\n- \`ALL_LOW <cost>\`: total cost if **every** request used low detail.\n- \`ALL_HIGH <cost>\`: total cost if **every** request used high detail.\n- \`SAVINGS <cost>\`: \`ALL_HIGH\` minus \`ALL_LOW\` — the money the router can save by routing to low wherever possible.",
      challenge_input_format: "The first line is an integer `n`: the number of requests.\n\nEach of the next `n` lines has: `name low_img high_img text output needs`, space-separated, where `low_img`/`high_img` are image-token counts at each detail, `text`/`output` are token counts, and `needs` is 1 (must use high) or 0 (low is fine).",
      challenge_output_format: "Print `n` per-request lines (`<name> <chosen_detail> $<cost>`), then `ALL_LOW`, `ALL_HIGH`, and `SAVINGS` lines, each cost as `$` plus exactly 6 decimals.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "0 ≤ low_img ≤ high_img ≤ 1000000",
        "0 ≤ text, output ≤ 1000000",
        "needs is 0 or 1.",
      ],
      challenge_examples: [
        { input: "2\nreceipt 800 4000 40 150 1\nbanner 800 4000 40 150 0", output: "receipt high $0.014370\nbanner low $0.004770\nALL_LOW $0.009540\nALL_HIGH $0.028740\nSAVINGS $0.019200", explanation: "receipt needs high: (4000+40)*3 + 150*15 = 14370 micro-dollars = $0.014370. banner is fine at low: (800+40)*3 + 150*15 = 4770 → $0.004770. All-low totals $0.009540, all-high $0.028740, so routing saves $0.019200." },
        { input: "1\nchip 256 4096 40 150 1", output: "chip high $0.014658\nALL_LOW $0.003138\nALL_HIGH $0.014658\nSAVINGS $0.011520", explanation: "A single high-detail OCR request: (4096+40)*3 + 150*15 = 14658 → $0.014658, and the all-low baseline shows what detail routing would have cost if low were acceptable." },
      ],
      challenge_notes: "Computing the cost in integer **micro-dollars** (`input_tokens*3 + output_tokens*15`, since the rate is per 1,000,000) sidesteps float rounding entirely — the value is already cost times 1,000,000. Splitting it into a whole-dollar part and a 6-digit fractional part gives an exact, unambiguous string every time.",
      challenge_hints: [
        "With rates of $3 and $15 per 1,000,000 tokens, `input*3 + output*15` is exactly the cost in micro-dollars (millionths). No division needed until you format.",
        "To format micro-dollars `m`: dollars = `m // 1_000_000`, fractional 6 digits = `str(m % 1_000_000).zfill(6)`.",
        "Accumulate ALL_LOW and ALL_HIGH totals for every request regardless of its flag; SAVINGS is just their difference.",
      ],
      challenge_starter_code: `import sys

IN_RATE = 3    # $ per 1,000,000 input tokens
OUT_RATE = 15  # $ per 1,000,000 output tokens

def cost_micro(input_tokens, output_tokens):
    return input_tokens * IN_RATE + output_tokens * OUT_RATE

def fmt(micro):
    # TODO: turn integer micro-dollars into "$D.dddddd".
    pass

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    # TODO: route each request, print its line, accumulate totals, print summaries.

main()
`,
      challenge_solution_code: `import sys

IN_RATE = 3    # $ per 1,000,000 input tokens
OUT_RATE = 15  # $ per 1,000,000 output tokens

def cost_micro(input_tokens, output_tokens):
    return input_tokens * IN_RATE + output_tokens * OUT_RATE

def fmt(micro):
    dollars = micro // 1_000_000
    frac = micro % 1_000_000
    return "$" + str(dollars) + "." + str(frac).zfill(6)

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    total_low = 0
    total_high = 0
    lines = []
    for i in range(1, n + 1):
        parts = data[i].split()
        name = parts[0]
        low_img = int(parts[1])
        high_img = int(parts[2])
        text = int(parts[3])
        out_tok = int(parts[4])
        needs = int(parts[5])
        low_cost = cost_micro(low_img + text, out_tok)
        high_cost = cost_micro(high_img + text, out_tok)
        total_low += low_cost
        total_high += high_cost
        if needs == 1:
            lines.append(name + " high " + fmt(high_cost))
        else:
            lines.append(name + " low " + fmt(low_cost))
    for line in lines:
        print(line)
    print("ALL_LOW " + fmt(total_low))
    print("ALL_HIGH " + fmt(total_high))
    print("SAVINGS " + fmt(total_high - total_low))

main()
`,
      challenge_test_cases: [
        { input: "2\nreceipt 800 4000 40 150 1\nbanner 800 4000 40 150 0", expected_output: "receipt high $0.014370\nbanner low $0.004770\nALL_LOW $0.009540\nALL_HIGH $0.028740\nSAVINGS $0.019200", description: "Mixed routing with a savings calculation." },
        { input: "1\nchip 256 4096 40 150 1", expected_output: "chip high $0.014658\nALL_LOW $0.003138\nALL_HIGH $0.014658\nSAVINGS $0.011520", description: "Single high-detail request against its low baseline." },
        { input: "1\nidle 0 0 0 0 0", expected_output: "idle low $0.000000\nALL_LOW $0.000000\nALL_HIGH $0.000000\nSAVINGS $0.000000", description: "Edge case: a zero-token request costs exactly $0.000000 with no savings." }
      ]
    },
    {
      id: "ai-11-l6",
      project_id: "ai-11",
      order: 6,
      title: "Prompting With Images",
      concept: "Prompting",
      xp_reward: 10,
      explanation: `Hand a model a photo of a crowded desk with no instruction and it free-associates: "A wooden desk with a laptop, a coffee mug, some papers..." Hand it the same photo with "How many cables are plugged into the laptop? Answer with just a number." and you get \`3\`. Same pixels, wildly different answers. The image supplies the *facts*; your text decides which facts come out. Learning to aim that text is the whole skill of this lesson.

## What it is

**Image prompting** is combining a text instruction with an image in one request so the words steer what the model reports about the picture. The image is the evidence; the prompt is the question, the format, and the constraints. From earlier lessons you already know both the words and the picture become tokens in one shared context — so the instruction literally sits next to the image and shapes the prediction.

A bare image invites a generic description. A pointed instruction turns the model into a specific tool: a counter, an extractor, a classifier, a grader.

## How it works

Your text does three jobs at once, each pulling the answer in a direction:

1. **Task** — what to do: describe, count, locate, compare, judge.
2. **Scope** — what to look at: "only the price tags," "ignore the background."
3. **Format** — how to answer: "one word," "JSON with keys color and count," "yes or no."

\`\`\`python
content = [
    {"type": "text", "text":
        "Count the red cars only. Reply with just an integer, no words."},
    {"type": "image", "source": image_source}
]
# The image holds the scene; the instruction decides the model
# reports a single number instead of a paragraph.
\`\`\`

Because many models read top to bottom, putting the instruction *before* the image frames how it looks at the picture. A vague prompt leaves the model free to wander; a tight one collapses the answer to exactly the slice you asked for.

## Why it matters

Steering with text is what turns a vision model from a party trick into a reliable component:

- **Specificity beats volume.** "Is the traffic light red, yellow, or green? One word." is more reliable than "tell me about this image."
- **Format instructions make output parseable.** Asking for JSON or a single token means your code can read the answer without fragile string surgery.
- **Constraints curb hallucination.** "If you cannot read it, answer UNKNOWN" stops the model from inventing a confident guess.
- **Negative instructions narrow scope.** "Ignore reflections and watermarks" removes distractors before they pollute the answer.

## The mental model to keep

The picture is the dataset; your prompt is the query. **Aim the words and you choose which facts the image gives up** — a sharp instruction in front of the same pixels is the difference between a rambling caption and the one number you needed.`,
      key_terms: [
        { term: "Image prompting", definition: "Pairing a text instruction with an image so the words steer what the model reports about it." },
        { term: "Instruction scope", definition: "The part of a prompt that limits what the model should look at, like 'only the price tags.'" },
        { term: "Format instruction", definition: "Telling the model the exact shape of the answer, such as one word or JSON." },
        { term: "Grounding constraint", definition: "A rule like 'answer UNKNOWN if you cannot tell' that curbs invented answers." }
      ],
      callouts: [
        { type: "analogy", title: "The image is a dataset, the prompt is the query", content: "A photo holds far more facts than you want. Your instruction is the SQL query against it: ask for one column and you get one column, not the whole table dumped as prose.", position: "before" },
        { type: "tip", title: "Put the instruction first", content: "Many models read top to bottom, so an instruction placed before the image frames how the model looks at it. Lead with the task, then attach the picture.", position: "after" }
      ],
      concept_diagram: {
        title: "How text steers an image answer",
        steps: [
          { label: "State the task", desc: "Describe, count, locate, compare, or judge." },
          { label: "Set the scope", desc: "Name what to look at and what to ignore." },
          { label: "Fix the format", desc: "One word, an integer, or JSON with named keys." },
          { label: "Attach the image", desc: "The model answers exactly the slice you framed." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does adding a specific instruction to an image change the answer so much?",
          options: ["The instruction edits the image pixels", "The text shares context with the image and steers which facts the model reports", "The model ignores the image when text is present"],
          correct_index: 1,
          explanation: "Text and image tokens live in one context, so a pointed instruction collapses the answer to the slice you asked for."
        }
      ],
      quiz_questions: [
        {
          question: "Which prompt is most likely to give a reliable, parseable answer about an image?",
          options: [
            "Tell me about this image",
            "Is the traffic light red, yellow, or green? Reply with one word",
            "What do you think is happening here",
            "Describe everything you see in detail"
          ],
          correct_index: 1,
          explanation: "A specific task plus a tight format constraint produces a single, predictable token your code can read."
        },
        {
          question: "What is the purpose of adding 'answer UNKNOWN if you cannot tell' to an image prompt?",
          options: [
            "It makes the model respond faster",
            "It curbs hallucination by giving the model an honest out instead of forcing a guess",
            "It lowers the token cost of the image",
            "It changes the image resolution"
          ],
          correct_index: 1,
          explanation: "A grounding constraint lets the model admit uncertainty rather than inventing a confident wrong answer."
        },
        {
          question: "Why does instruction placement (before vs after the image) sometimes matter?",
          options: [
            "Images can only appear at the end of a request",
            "Many models read top to bottom, so a leading instruction frames how they look at the picture",
            "Placing text first compresses the image",
            "The API rejects text that follows an image"
          ],
          correct_index: 1,
          explanation: "Because the model reads the sequence in order, an instruction before the image sets the lens it views the picture through."
        }
      ],
      participation_activities: [
        {
          activity_title: "Steering check",
          questions: [
            { question: "A more specific instruction generally produces a more reliable answer than a vague one for the same image.", type: "true_false", correct_answer: "true", explanation: "Specificity narrows the answer to exactly the slice you need." },
            { question: "Telling the model to reply as JSON with named keys is a ______ instruction.", type: "fill_in", correct_answer: "format", explanation: "Format instructions fix the shape of the output so code can parse it." }
          ]
        }
      ],
      starter_code: `# Build an image prompt that steers the answer to a single number.
task = "Count the red cars only."
scope = "Ignore parked cars and reflections."
fmt = "Reply with just an integer, no words."

# TODO: combine task, scope, and format into one instruction string,
#       then build a content list with that text block and an image block.
instruction = ""
print(instruction)
`,
      solution_code: `task = "Count the red cars only."
scope = "Ignore parked cars and reflections."
fmt = "Reply with just an integer, no words."

instruction = task + " " + scope + " " + fmt

content = [
    {"type": "text", "text": instruction},
    {"type": "image", "source": {"type": "url", "url": "https://example.com/street.jpg"}}
]

print(instruction)
print(len(content), "blocks")
print(content[0]["type"], content[1]["type"])
`,
      expected_output: `Count the red cars only. Ignore parked cars and reflections. Reply with just an integer, no words.
2 blocks
text image`,
      step_throughs: [
        {
          title: "turning a vague ask into a steered one",
          steps: [
            { label: "Start vague", detail: "A bare prompt lets the model wander and return a generic paragraph about the whole scene.", code: '"Tell me about this photo." -> long caption' },
            { label: "Add the task", detail: "Name the single operation you want, which collapses the description into an action.", code: '"How many people are wearing hats?"' },
            { label: "Add scope and format", detail: "Limit what to look at and pin the answer shape so the output is predictable and parseable.", code: '"... Count only adults. Reply with one integer."' },
            { label: "Attach the image", detail: "Put the instruction first, then the picture; the model answers exactly the framed slice.", code: 'content = [text_block, image_block] -> "4"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'You send a photo of a single traffic light with the prompt "Describe this image." You actually just need to know if it is safe to go. What is a better prompt?',
          steps: [
            "The vague prompt returns a description of the pole, sky, and street, not the one fact you need.",
            "State the exact task: what color is the light.",
            "Fix the format so the answer is trivial to act on: one word."
          ],
          output: '"What color is the traffic light? Reply with one word: red, yellow, or green."'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You extract prices from shelf photos, but the model keeps describing the whole shelf and occasionally invents a price for a blurry tag. How do you fix the prompt?",
          steps: [
            "Scope the task to only the price tags, telling it to ignore products and signage.",
            "Fix the format as JSON so your code can parse it directly, for example a list of objects with name and price.",
            'Add a grounding constraint: if a tag is unreadable, set its price to null instead of guessing.',
            "Place the instruction before the image so it frames the read."
          ],
          output: 'Scope to price tags only, request JSON, and instruct null for unreadable tags so blurry prices are not invented.'
        }
      ],
      comparison_tables: [
        {
          title: "vague prompt vs steered prompt",
          columns: ["Aspect", "Vague prompt", "Steered prompt"],
          rows: [
            { cells: ["Example", '"Describe this image"', '"How many red cars? One integer."'] },
            { cells: ["Output shape", "Long, unpredictable prose", "One token your code can parse"] },
            { cells: ["Hallucination risk", "Higher, free to wander", "Lower, constrained and scoped"] },
            { cells: ["Usefulness in code", "Needs fragile parsing", "Drops straight into your pipeline"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which instruction part is this?",
          bins: [
            { id: "task", label: "Task" },
            { id: "format", label: "Scope or Format" }
          ],
          items: [
            { id: "i1", text: "Count the people in the photo", bin: "task" },
            { id: "i2", text: "Reply with just an integer", bin: "format" },
            { id: "i3", text: "Identify the dog breed", bin: "task" },
            { id: "i4", text: "Ignore the background", bin: "format" },
            { id: "i5", text: "Return JSON with keys color and count", bin: "format" },
            { id: "i6", text: "Decide if the receipt total exceeds 50", bin: "task" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: if the image already contains the answer, why does the wording of your text instruction matter so much?",
          sampleAnswer: "The image holds far more facts than any one question needs, and the model only reports what your instruction aims it at. Because the text and image share the same context, the prompt acts like a query against the picture: it picks the task, narrows the scope to the relevant part, and fixes the answer's shape. Vague wording leaves the model free to return a generic caption or even guess, while a specific instruction collapses the response to exactly the slice you can use."
        }
      ],
      hints: [
        "Join the task, scope, and format strings with spaces into one instruction.",
        "The content list holds a text block (the instruction) and an image block.",
        "Each block is a dict with a 'type' key, just like earlier lessons."
      ],
      challenge_title: "The Instruction Auditor",
      challenge_description: "Compare what each image prompt asked the model to report against what the model actually returned, score how faithfully it followed the instruction, and flag missing and extra fields.",
      challenge_story: "You run a quality dashboard for a vision pipeline. Every request pairs an image with an instruction listing the exact fields the model should report — say \`merchant\`, \`date\`, \`total\`. The model doesn't always comply: sometimes it omits a requested field, sometimes it volunteers extra fields nobody asked for (chatty drift that bloats your tokens). You need an **instruction auditor** that, for every response, computes a follow-rate score, names the fields that went missing, and names the extras the model threw in — so you can tell which prompts steer cleanly and which need tightening.",
      challenge_statement: "Every request asks the model to report the same set of **requested** fields. For each response, you are given the fields the model actually **reported**.\n\nFor each response, in input order:\n\n1. Compute its **score**: the count of requested fields that appear in the response, times 100, integer-divided by the number of requested fields (\`hits * 100 // R\`).\n2. **missing** = requested fields not reported, in the order they appear in the requested list.\n3. **extra** = reported fields that were not requested, in the order they appear in the response.\n\nPrint one line per response, starting with \`<name> <score>\`. If there are missing fields, append \` MISSING \` and the missing names joined by commas. If there are extra fields, append \` EXTRA \` and the extra names joined by commas (MISSING before EXTRA when both occur).\n\nFinally print \`AVG <a>\` where \`a\` is the integer average of all scores (\`sum_of_scores // n\`).",
      challenge_input_format: "The first line is an integer `n`: the number of responses.\n\nThe second line lists the requested fields, space-separated (this set is the same for all responses).\n\nEach of the next `n` lines is `name|reported`, where `reported` is a space-separated list of fields the model returned. The reported list may be empty (nothing after the `|`).",
      challenge_output_format: "Print `n` per-response lines as described, then one `AVG <a>` line.",
      challenge_constraints: [
        "1 ≤ n ≤ 1000",
        "1 ≤ number of requested fields ≤ 50",
        "Field names contain no spaces or `|`; names are unique within a list.",
      ],
      challenge_examples: [
        { input: "2\ntotal date merchant\nr1|merchant total date tax\nr2|merchant", output: "r1 100 EXTRA tax\nr2 33 MISSING total,date\nAVG 66", explanation: "r1 reports all 3 requested (3*100//3 = 100) plus an unrequested 'tax' (extra). r2 reports only merchant: 1*100//3 = 33, missing total and date. Average = (100+33)//2 = 66." },
        { input: "1\na b\nx|b a", output: "x 100\nAVG 100", explanation: "Both requested fields present and no extras, so a clean 100 with no MISSING or EXTRA segment." },
      ],
      challenge_notes: "Score uses integer division on purpose: 1 of 3 fields is reported as 33, not 33.33, keeping output unambiguous. The MISSING-before-EXTRA ordering and the requested-list ordering for missing fields make the output deterministic so it can be diffed in tests. A high extra count is a real signal: a chatty model that volunteers fields you never asked for is wasting tokens and ignoring your format instruction.",
      challenge_hints: [
        "Build a set of requested fields and a set of reported fields per line for fast membership tests, but iterate the original lists to preserve order.",
        "Split each response line on the single `|`; handle an empty reported part by treating it as an empty list.",
        "Assemble the line in pieces: always `name score`, then conditionally ` MISSING ...`, then conditionally ` EXTRA ...`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    requested = data[idx].split(); idx += 1
    # TODO: for each response, compute score, missing, extra; print the line.
    # Then print AVG <integer average of scores>.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    n = int(data[idx]); idx += 1
    requested = data[idx].split(); idx += 1
    req_set = set(requested)
    R = len(requested)
    total_score = 0
    out = []
    for _ in range(n):
        parts = data[idx].split("|"); idx += 1
        name = parts[0]
        reported = parts[1].split() if parts[1].strip() != "" else []
        rep_set = set(reported)
        hits = sum(1 for f in requested if f in rep_set)
        score = hits * 100 // R
        total_score += score
        missing = [f for f in requested if f not in rep_set]
        extra = [f for f in reported if f not in req_set]
        seg = name + " " + str(score)
        if missing:
            seg += " MISSING " + ",".join(missing)
        if extra:
            seg += " EXTRA " + ",".join(extra)
        out.append(seg)
    out.append("AVG " + str(total_score // n))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "2\ntotal date merchant\nr1|merchant total date tax\nr2|merchant", expected_output: "r1 100 EXTRA tax\nr2 33 MISSING total,date\nAVG 66", description: "A perfect-with-extra response and a mostly-missing one, then the average." },
        { input: "1\na b\nx|b a", expected_output: "x 100\nAVG 100", description: "All requested present, no extras: clean line with no segments." },
        { input: "1\nname\nempty|", expected_output: "empty 0 MISSING name\nAVG 0", description: "Edge case: an empty reported list scores 0 and flags the missing field." },
        { input: "2\ncolor\na|color size\nb|", expected_output: "a 100 EXTRA size\nb 0 MISSING color\nAVG 50", description: "One field requested; extra and missing handled, average rounds with integer division." }
      ]
    },
    {
      id: "ai-11-l7",
      project_id: "ai-11",
      order: 7,
      title: "Multi-Image and Video Frames",
      concept: "Sequences",
      xp_reward: 10,
      explanation: `A model cannot watch a video. It has no eyes and no clock. So how do products "analyze a clip"? They cheat: they pull out still frames at intervals, line them up like a flipbook, and feed that handful of images into the same vision request you already know. A two-minute video becomes maybe twenty pictures. Once you see that trick, "video understanding" stops being a different feature and becomes multi-image prompting with a sampling step in front.

## What it is

**Multi-image prompting** is putting more than one image in a single request so the model can compare, sequence, or reason across them. **Video frame sampling** is the special case where those images are stills pulled from a video at a chosen rate — one frame per second, every tenth frame, or however dense you need.

The model treats the frames as an ordered list of pictures, not as motion. It infers what changed between them the way you would by flipping through photos, not by watching playback.

## How it works

The content list simply holds several image blocks, often interleaved with text that labels them:

\`\`\`python
content = [
    {"type": "text", "text": "These are frames sampled every 2 seconds."},
    {"type": "image", "source": frame_0},
    {"type": "text", "text": "Frame at t=2s:"},
    {"type": "image", "source": frame_2},
    {"type": "text", "text": "What changed between the two frames?"}
]
# Each frame is patched into image tokens, all read in one sequence.
\`\`\`

Two numbers govern everything:

1. **Sampling rate.** How many frames you pull. Sparse sampling is cheap but can miss fast events; dense sampling catches detail but multiplies tokens.
2. **Tokens per frame.** Every frame is patched like any image, so total cost is frames times tokens-per-frame. Ten frames is roughly ten images on the bill.

## Why it matters

Sequences unlock comparison tasks, but the trade-offs are sharp:

- **Sampling rate is a recall vs cost dial.** Too sparse and a one-second event slips between frames; too dense and you pay for near-duplicate stills.
- **Token cost stacks fast.** Frames times tokens-per-frame can dwarf the text. Lower per-frame detail or sample fewer frames to keep the bill sane.
- **Order must be explicit.** The model has no timeline, so label each frame ("t=0s," "before," "after") or it may not know which came first.
- **Context limits cap how many frames fit.** A long video cannot go in all at once; you sample, summarize, or chunk.

## The mental model to keep

A model never watches video; it flips through a stack of stills you chose. **You decide how many frames to send and label their order** — sampling rate trades recall against cost, and without labels the model cannot tell before from after.`,
      key_terms: [
        { term: "Multi-image prompt", definition: "A request containing more than one image so the model can compare or sequence them." },
        { term: "Frame sampling", definition: "Pulling still images from a video at a chosen rate to feed a vision model." },
        { term: "Sampling rate", definition: "How frequently frames are taken; it trades event recall against token cost." },
        { term: "Tokens per frame", definition: "The image-token cost of one frame; total cost is frames times this number." }
      ],
      callouts: [
        { type: "analogy", title: "A flipbook, not a movie", content: "The model flips through the stills you handed it, like reading a flipbook, and infers motion from the differences. It never sees smooth playback, only the frames you sampled.", position: "before" },
        { type: "warning", title: "Sparse sampling misses fast events", content: "If you sample one frame every five seconds, a two-second action can fall entirely between frames and the model will never know it happened. Match the rate to how fast things change.", position: "after" }
      ],
      concept_diagram: {
        title: "From a video to a multi-image request",
        steps: [
          { label: "Pick a sampling rate", desc: "Decide how often to grab a frame." },
          { label: "Extract frames", desc: "Pull stills from the video at that rate." },
          { label: "Label and order them", desc: "Tag each frame so the model knows the sequence." },
          { label: "Send as one request", desc: "All frames become image tokens in one prompt." }
        ]
      },
      inline_quizzes: [
        {
          question: "How does a vision model 'analyze a video'?",
          options: ["It streams and watches the playback in real time", "It reads still frames sampled from the video as an ordered set of images", "It converts the video to audio first"],
          correct_index: 1,
          explanation: "Products sample frames at intervals and feed them as a multi-image prompt; the model never watches motion."
        }
      ],
      quiz_questions: [
        {
          question: "What is the main trade-off when choosing a frame sampling rate?",
          options: [
            "Color accuracy vs file format",
            "Event recall vs token cost: dense catches detail but costs more, sparse is cheap but can miss fast events",
            "Upload speed vs download speed",
            "Image width vs image height"
          ],
          correct_index: 1,
          explanation: "More frames catch brief events but multiply tokens; fewer frames are cheaper but risk missing what happens between them."
        },
        {
          question: "Why should you label each frame with its order or timestamp?",
          options: [
            "Labels make the images load faster",
            "The model has no timeline, so labels tell it which frame came before which",
            "Labels reduce the token cost of each frame",
            "The API requires a caption on every image"
          ],
          correct_index: 1,
          explanation: "Without explicit order cues the model cannot reliably tell before from after; it sees an unordered stack of stills."
        },
        {
          question: "Roughly how does the image-token cost of a 10-frame request compare to a single image of the same detail?",
          options: [
            "About the same, frames are free",
            "About 10 times as much, since each frame is patched like its own image",
            "Half as much, because frames are compressed together",
            "It depends only on the video length, not the frames"
          ],
          correct_index: 1,
          explanation: "Each frame is patched into image tokens independently, so ten frames cost roughly ten times one frame."
        }
      ],
      participation_activities: [
        {
          activity_title: "Sequences check",
          questions: [
            { question: "A vision model watches video playback directly, frame by frame, in real time.", type: "true_false", correct_answer: "false", explanation: "It reads a sampled set of still frames as images; it never watches motion." },
            { question: "Pulling still images from a video at a chosen interval to feed the model is called frame ______.", type: "fill_in", correct_answer: "sampling", explanation: "Frame sampling turns a video into a handful of images." }
          ]
        }
      ],
      starter_code: `# Sample frame indices from a video and estimate the token cost.
total_frames = 120     # frames in the clip
step = 30              # take one frame every 30 frames
tokens_per_frame = 256

# TODO: list the sampled indices (0, step, 2*step, ...) and total tokens.
sampled = []
print("sampled count:", len(sampled))
`,
      solution_code: `total_frames = 120
step = 30
tokens_per_frame = 256

sampled = list(range(0, total_frames, step))
total_tokens = len(sampled) * tokens_per_frame

print("sampled indices:", sampled)
print("sampled count:", len(sampled))
print("total image tokens:", total_tokens)
`,
      expected_output: `sampled indices: [0, 30, 60, 90]
sampled count: 4
total image tokens: 1024`,
      step_throughs: [
        {
          title: "turning a clip into a comparison prompt",
          steps: [
            { label: "Pick the rate", detail: "Decide how dense to sample. One frame every 30 frames of a 120-frame clip gives four stills.", code: "step = 30  # frames between samples" },
            { label: "Extract the frames", detail: "Pull the still images at those indices. These are ordinary images now, not video.", code: "frames = [video[i] for i in range(0, 120, 30)]" },
            { label: "Label the order", detail: "Tag each frame with a timestamp or 'before/after' so the model knows the sequence.", code: 'blocks = ["t=0s", img0, "t=1s", img1, ...]' },
            { label: "Ask across them", detail: "Add a comparison instruction and send all frames in one request; each is patched into image tokens.", code: '"What changed between the first and last frame?"' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "A 60-frame clip is sampled every 20 frames. Which frame indices get sent, and how many images is that?",
          steps: [
            "Start at index 0 and step by 20 while staying under 60.",
            "Indices: 0, 20, 40 (60 is out of range).",
            "That is 3 frames, so 3 images in the request."
          ],
          output: "Frames 0, 20, 40 -> 3 images"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You need to detect a 1-second event in a 30 fps clip, but you currently sample one frame every 2 seconds at 1000 tokens per frame. Why might you miss the event, and what is the cost trade if you fix it?",
          steps: [
            "At one frame per 2 seconds, a 1-second event can occur entirely between two sampled frames and never appear.",
            "To guarantee catching a 1-second event you need at least one frame per second, doubling the sampling rate.",
            "Doubling the frames doubles the image tokens, so cost per clip roughly doubles too.",
            "If budget is tight, keep the denser rate but lower tokens-per-frame, since detecting presence needs less detail than reading text."
          ],
          output: "Sample at least once per second to catch the event; that doubles frames and cost, which you can offset with lower per-frame detail."
        }
      ],
      comparison_tables: [
        {
          title: "sparse vs dense frame sampling",
          columns: ["Aspect", "Sparse sampling", "Dense sampling"],
          rows: [
            { cells: ["Frames sent", "Few", "Many"] },
            { cells: ["Token cost", "Low", "High, scales with frames"] },
            { cells: ["Catches fast events", "May miss them", "Reliably captures them"] },
            { cells: ["Best for", "Slow, steady scenes", "Quick actions or fine timing"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "sample sparsely vs densely",
          bins: [
            { id: "sparse", label: "Sparse is fine" },
            { id: "dense", label: "Sample densely" }
          ],
          items: [
            { id: "i1", text: "A slow time-lapse of a sunset", bin: "sparse" },
            { id: "i2", text: "A fast sports replay to find the foul", bin: "dense" },
            { id: "i3", text: "A static lecture slideshow", bin: "sparse" },
            { id: "i4", text: "A one-second hand gesture to classify", bin: "dense" },
            { id: "i5", text: "A security feed of an empty hallway", bin: "sparse" },
            { id: "i6", text: "A quick magic trick to spot the sleight", bin: "dense" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: a model cannot watch video, so how does sending sampled frames let it answer 'what changed in this clip?'",
          sampleAnswer: "The video is reduced to a handful of still frames pulled at intervals, and those stills are sent as an ordered, labeled list of images in one request. Each frame is patched into image tokens and read in the same context, so the model can compare them the way a person flips through photos and infers what moved or changed between them. It never sees motion; it reasons over the differences between the frames you chose, which is why the sampling rate and the order labels decide what it can possibly notice."
        }
      ],
      hints: [
        "range(0, total_frames, step) gives the sampled indices.",
        "len() of that list is how many frames you send.",
        "Total tokens is the number of frames times tokens_per_frame."
      ],
      challenge_title: "The Frame Sampler",
      challenge_description: "Sample frames from a clip at a fixed interval, report the token cost, detect scene cuts between consecutive sampled frames, and compute the clip's duration.",
      challenge_story: "You're building the **frame sampler** that sits in front of a vision model's video feature. A raw clip is far too many frames to send, so you pull every Nth frame, label them in order, and ship them as a multi-image prompt. Product wants three numbers before each request goes out: how many frames you'll send (and what that costs in image tokens), how many **scene cuts** appear among the sampled frames (a cut is a big jump in brightness between two consecutive samples), and the clip's wall-clock duration. Build the sampler so the team can tune the interval against cost and recall instead of guessing.",
      challenge_statement: "A clip has \`n\` frames, recorded at \`fps\` frames per second. Each frame \`i\` has an integer **brightness** value.\n\nDo all of the following:\n\n1. **Sample** frames at indices \`0, step, 2*step, ...\` while the index is less than \`n\`. Let \`k\` be the number of sampled frames.\n2. **Tokens.** Each sampled frame costs \`tpf\` image tokens; total is \`k * tpf\`.\n3. **Cuts.** For each pair of consecutive sampled frames, if the absolute difference of their brightness values is **strictly greater** than \`thresh\`, count it as a scene cut.\n4. **Duration.** The clip runs \`n / fps\` seconds.\n\nPrint exactly four lines:\n\`SAMPLED <k>\`, \`TOKENS <k*tpf>\`, \`CUTS <cuts>\`, \`DURATION <d>\` where \`d\` is the duration formatted to exactly 2 decimal places.",
      challenge_input_format: "The first line has three integers `fps step tpf`.\n\nThe second line has one integer `thresh`: the brightness-jump cutoff for a scene cut.\n\nThe third line has one integer `n`: the number of frames.\n\nThe fourth line has `n` space-separated integers: the brightness of each frame, in order.",
      challenge_output_format: "Print four lines: `SAMPLED <k>`, `TOKENS <tokens>`, `CUTS <cuts>`, and `DURATION <d>` (duration to exactly 2 decimals).",
      challenge_constraints: [
        "1 ≤ fps ≤ 240",
        "1 ≤ step ≤ 100000",
        "1 ≤ tpf ≤ 100000",
        "0 ≤ thresh ≤ 255",
        "1 ≤ n ≤ 100000",
        "0 ≤ brightness ≤ 255",
      ],
      challenge_examples: [
        { input: "4 2 256\n50\n8\n10 11 20 21 90 91 95 96", output: "SAMPLED 4\nTOKENS 1024\nCUTS 1\nDURATION 2.00", explanation: "Step 2 samples indices 0,2,4,6 -> brightness 10,20,90,95 (k=4, tokens 4*256=1024). Consecutive diffs are 10, 70, 5; only 70 exceeds 50, so 1 cut. Duration 8/4 = 2.00s." },
        { input: "30 1 100\n30\n3\n0 100 0", output: "SAMPLED 3\nTOKENS 300\nCUTS 2\nDURATION 0.10", explanation: "Step 1 samples all 3 frames (300 tokens). Diffs 100 and 100 both exceed 30, so 2 cuts. Duration 3/30 = 0.10s." },
      ],
      challenge_notes: "Sampling at fixed indices is the simplest scheme; real pipelines also sample by timestamp or only on detected motion. The strictly-greater cut test and the 2-decimal duration keep the output deterministic. Notice how a larger step shrinks both the token bill and the chance of catching a fast event between samples -- the recall-vs-cost dial from the lesson, made concrete.",
      challenge_hints: [
        "Get the sampled indices with `range(0, n, step)`; `k` is the length of that range.",
        "For cuts, walk the sampled indices pairwise and test `abs(b[cur] - b[prev]) > thresh`.",
        "Format duration with `\"{:.2f}\".format(n / fps)` so a value like 0.1 prints as `0.10`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    fps, step, tpf = map(int, data[idx].split()); idx += 1
    thresh = int(data[idx].strip()); idx += 1
    n = int(data[idx].strip()); idx += 1
    brightness = list(map(int, data[idx].split())); idx += 1
    # TODO: sample frame indices, count tokens and cuts, compute duration.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    fps, step, tpf = map(int, data[idx].split()); idx += 1
    thresh = int(data[idx].strip()); idx += 1
    n = int(data[idx].strip()); idx += 1
    brightness = list(map(int, data[idx].split())); idx += 1

    sampled = list(range(0, n, step))
    k = len(sampled)
    tokens = k * tpf

    cuts = 0
    for i in range(1, k):
        prev = brightness[sampled[i - 1]]
        cur = brightness[sampled[i]]
        if abs(cur - prev) > thresh:
            cuts += 1

    duration = n / fps

    print("SAMPLED " + str(k))
    print("TOKENS " + str(tokens))
    print("CUTS " + str(cuts))
    print("DURATION " + "{:.2f}".format(duration))

main()
`,
      challenge_test_cases: [
        { input: "4 2 256\n50\n8\n10 11 20 21 90 91 95 96", expected_output: "SAMPLED 4\nTOKENS 1024\nCUTS 1\nDURATION 2.00", description: "Stepped sampling with one scene cut among four frames." },
        { input: "30 1 100\n30\n3\n0 100 0", expected_output: "SAMPLED 3\nTOKENS 300\nCUTS 2\nDURATION 0.10", description: "Every frame sampled; two cuts and a sub-second duration." },
        { input: "24 100 200\n10\n5\n5 6 7 8 9", expected_output: "SAMPLED 1\nTOKENS 200\nCUTS 0\nDURATION 0.21", description: "Edge case: step larger than the clip yields a single frame and zero cuts." },
        { input: "10 2 50\n0\n4\n5 5 5 5", expected_output: "SAMPLED 2\nTOKENS 100\nCUTS 0\nDURATION 0.40", description: "Edge case: identical brightness never exceeds the threshold, so no cuts." }
      ]
    },
    {
      id: "ai-11-l8",
      project_id: "ai-11",
      order: 8,
      title: "Editing and Variations",
      concept: "Editing",
      xp_reward: 10,
      explanation: `Generating a brand-new image from text is easy. Changing one thing in a photo you already have, while leaving everything else untouched, is the hard and useful part. "Remove the trash can from this street photo but keep the building exactly as it is" is not a fresh generation problem; it is an editing problem. The trick is to give the model an existing image to start from instead of pure noise, and to tell it which pixels it is allowed to touch.

## What it is

Three related operations all start from an input image rather than from scratch:

- **Image-to-image** feeds an existing image plus a prompt; the model produces a new image that keeps the input's structure but applies your change. A **strength** dial controls how far it strays from the original.
- **Inpainting** edits only a masked region. A **mask** marks which pixels may change; everything outside the mask is preserved exactly.
- **Variations** generate new images that resemble an input without a text prompt, useful for "give me more like this."

## How it works

Recall the denoising loop from the generation lesson. Editing changes where the loop *starts*. Instead of pure random noise, it begins from a noised version of your input image, so the structure survives the cleanup:

\`\`\`python
# Image-to-image: start from the input, not from pure noise
noised = add_noise(input_image, strength)  # strength 0..1
image = noised
for step in range(num_steps):
    noise = model.predict_noise(image, prompt)
    image = image - small_amount(noise)
# low strength -> close to original; high strength -> bolder change
\`\`\`

For **inpainting**, the mask gates every step: masked pixels are denoised toward the prompt, while unmasked pixels are pinned back to the original after each step, so only the masked area changes. The mask is the contract that keeps the rest of the photo intact.

## Why it matters

Editing is where vision generation earns its keep in real products, with its own pitfalls:

- **Strength is a similarity dial.** Low strength barely changes the image; high strength can drift so far it ignores the original. Tune it to the edit.
- **Mask quality decides the seam.** A sloppy mask leaves visible halos or edits bleeding outside the region. Tight masks give clean edits.
- **Edits compound errors.** Re-editing an already-edited image repeatedly degrades it, like photocopying a photocopy.
- **Provenance and consent.** Editing real photos of real people raises the same rights and misuse concerns as generation, only sharper.

## The mental model to keep

Editing is generation that starts from your image, not from noise. **The strength dial sets how far it drifts, and the mask says which pixels it may touch** — get those two right and you change exactly one thing while the rest of the picture stays put.`,
      key_terms: [
        { term: "Image-to-image", definition: "Generating a new image starting from an existing one plus a prompt, keeping its structure." },
        { term: "Inpainting", definition: "Editing only a masked region of an image while preserving everything outside the mask." },
        { term: "Mask", definition: "A marking of which pixels an edit may change; unmasked pixels stay unchanged." },
        { term: "Strength", definition: "A dial from low to high that sets how far an edit drifts from the original image." }
      ],
      callouts: [
        { type: "analogy", title: "Start from your photo, not from static", content: "Plain generation starts from TV static. Editing starts from a lightly-noised copy of your image, so the model cleans it back up toward your prompt while the original structure survives.", position: "before" },
        { type: "warning", title: "Edits compound like photocopies", content: "Each round of re-editing degrades the image a little, like copying a copy. For multiple changes, prefer one well-masked edit over many stacked passes.", position: "after" }
      ],
      concept_diagram: {
        title: "How an inpainting edit works",
        steps: [
          { label: "Provide the image", desc: "Start from your existing photo, not from noise." },
          { label: "Mark the mask", desc: "Mark which pixels the model may change." },
          { label: "Denoise the masked area", desc: "Regenerate only inside the mask toward the prompt." },
          { label: "Pin the rest", desc: "Pixels outside the mask are kept exactly as before." }
        ]
      },
      inline_quizzes: [
        {
          question: "What does the mask do in an inpainting edit?",
          options: ["It makes the whole image brighter", "It marks which pixels may change while preserving everything outside it", "It deletes the original image"],
          correct_index: 1,
          explanation: "The mask gates the edit: masked pixels are regenerated, unmasked pixels are pinned to the original."
        }
      ],
      quiz_questions: [
        {
          question: "How does image-to-image differ from plain text-to-image generation?",
          options: [
            "It uses no prompt at all",
            "It starts the denoising loop from a noised version of your input image instead of pure noise",
            "It only works on black-and-white images",
            "It is always cheaper because it skips denoising"
          ],
          correct_index: 1,
          explanation: "Editing begins from your image (lightly noised) so its structure survives, rather than starting from random static."
        },
        {
          question: "What does a low strength setting do in image-to-image editing?",
          options: [
            "Makes the output drift far from the original",
            "Keeps the result close to the original, applying only a subtle change",
            "Increases the resolution",
            "Removes the prompt's influence entirely"
          ],
          correct_index: 1,
          explanation: "Low strength stays near the input; high strength allows bolder, larger changes that can ignore the original."
        },
        {
          question: "Why can repeatedly re-editing the same image degrade it?",
          options: [
            "The file format changes each time",
            "Each edit compounds small errors, like photocopying a photocopy",
            "The model runs out of tokens",
            "Editing always lowers the resolution by half"
          ],
          correct_index: 1,
          explanation: "Stacked edits accumulate artifacts; one well-masked edit usually beats many passes."
        }
      ],
      participation_activities: [
        {
          activity_title: "Editing check",
          questions: [
            { question: "Inpainting changes the entire image, not just a selected region.", type: "true_false", correct_answer: "false", explanation: "Inpainting changes only the masked region and preserves everything outside it." },
            { question: "The dial that controls how far an edit drifts from the original image is called ______.", type: "fill_in", correct_answer: "strength", explanation: "Strength trades similarity to the original against the boldness of the change." }
          ]
        }
      ],
      starter_code: `# Simulate inpainting on a tiny grid: fill a masked rectangle with a value,
# leave everything outside the mask unchanged.
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
r0, c0, r1, c1, fill = 1, 1, 2, 2, 0  # mask rows 1..2, cols 1..2

# TODO: set cells inside the mask to fill; count how many actually changed.
changed = 0
print("changed:", changed)
`,
      solution_code: `grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
r0, c0, r1, c1, fill = 1, 1, 2, 2, 0

changed = 0
for r in range(len(grid)):
    for c in range(len(grid[0])):
        if r0 <= r <= r1 and c0 <= c <= c1:
            if grid[r][c] != fill:
                changed += 1
            grid[r][c] = fill

print("changed:", changed)
print("grid:", grid)
`,
      expected_output: `changed: 4
grid: [[1, 2, 3], [4, 0, 0], [7, 0, 0]]`,
      step_throughs: [
        {
          title: "removing an object with a masked edit",
          steps: [
            { label: "Provide the photo", detail: "Start from the real image, not from noise. Its structure is what you want to keep.", code: "image = load('street.jpg')" },
            { label: "Mark the mask", detail: "Mark only the pixels covering the object to remove, for example the trash can.", code: "mask = box(x1, y1, x2, y2)  # only the can" },
            { label: "Denoise inside the mask", detail: "The model regenerates the masked region toward the prompt, painting in plausible background.", code: '"fill with matching sidewalk" -> masked area only' },
            { label: "Pin the rest", detail: "Pixels outside the mask are restored to the original after each step, so the building is untouched.", code: "image[~mask] = original[~mask]  # rest preserved" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You want to slightly warm the colors of a portrait without changing the subject's pose or features. Should you use low or high strength image-to-image?",
          steps: [
            "A subtle color shift means you want to stay very close to the original.",
            "High strength would drift far enough to alter the pose or face.",
            "Low strength keeps the structure and applies only the gentle change."
          ],
          output: "Low strength — it preserves the original while applying a subtle shift."
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You need to remove a logo from a product photo but keep the product pixel-identical. The whole-image image-to-image keeps subtly altering the product. What is the better approach and why?",
          steps: [
            "Whole-image editing lets every pixel change, so the product drifts even when you only meant to touch the logo.",
            "Inpainting with a tight mask over just the logo restricts changes to that region.",
            "Pixels outside the mask are pinned to the original, so the product stays exactly as it was.",
            "Tighten the mask edges to avoid halos where the edit meets the untouched area."
          ],
          output: "Use inpainting with a tight mask over the logo so only that region changes and the product is preserved."
        }
      ],
      comparison_tables: [
        {
          title: "generation vs editing operations",
          columns: ["Operation", "Starts from", "What changes", "Best for"],
          rows: [
            { cells: ["Text-to-image", "Pure noise", "Everything (new image)", "Creating from scratch"] },
            { cells: ["Image-to-image", "Noised input image", "Whole image, guided by strength", "Restyling or nudging a photo"] },
            { cells: ["Inpainting", "Input image + mask", "Only the masked region", "Removing or replacing one part"] },
            { cells: ["Variations", "Input image, no prompt", "A fresh similar image", "More like this"], highlight: true }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which operation fits the task?",
          bins: [
            { id: "inpaint", label: "Inpainting (masked)" },
            { id: "img2img", label: "Image-to-image or variations" }
          ],
          items: [
            { id: "i1", text: "Erase a trash can, keep the rest identical", bin: "inpaint" },
            { id: "i2", text: "Restyle a whole photo as a watercolor", bin: "img2img" },
            { id: "i3", text: "Replace just the sky in a landscape", bin: "inpaint" },
            { id: "i4", text: "Get five more designs like this one", bin: "img2img" },
            { id: "i5", text: "Remove a logo from one corner only", bin: "inpaint" },
            { id: "i6", text: "Slightly warm the colors of an entire image", bin: "img2img" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: how does editing reuse the denoising loop from plain image generation, and what makes it preserve the original?",
          sampleAnswer: "Editing runs the same denoise-step-by-step loop, but instead of starting from pure random static it starts from a lightly noised copy of your input image, so the original structure is already baked into the starting point and survives the cleanup. The strength dial sets how much noise is added, which decides how far the result can drift. For inpainting, a mask pins the unmasked pixels back to the original after each step, so only the masked region is actually regenerated, leaving the rest of the photo untouched."
        }
      ],
      hints: [
        "Loop over every cell; check if its row and column fall inside the mask rectangle.",
        "A cell is inside the mask when r0 <= r <= r1 and c0 <= c <= c1.",
        "Increment changed only when the existing value differs from the fill value, then set it."
      ],
      challenge_title: "The Inpaint Engine",
      challenge_description: "Apply a sequence of masked edits to an image grid, clamp each mask to the image bounds, count the pixels each edit actually changes, and report the final image checksum.",
      challenge_story: "You're building the core of an **inpainting engine**. The image is a grid of integer pixel values, and an editor sends a list of rectangular **masks**, each with a fill value -- 'paint this region to X.' Masks may be dragged partly off-canvas, so you must **clamp** them to the image bounds before applying. Edits are applied in order, and a later edit can overwrite an earlier one (edits compound, exactly like the lesson warned). Your engine must report, per edit, how many pixels actually changed value (painting a pixel to the color it already had does not count), and after all edits, the **checksum** of the final image so the result can be verified.",
      challenge_statement: "You have a grid of \`rows\` x \`cols\` integer pixels. Then \`m\` edits are applied **in order**. Each edit is a rectangle \`r0 c0 r1 c1\` (inclusive corners, with \`r0 <= r1\` and \`c0 <= c1\`) and a \`fill\` value.\n\nFor each edit:\n\n1. **Clamp** the rectangle to the grid: clamp \`r0,c0\` up to 0 and \`r1,c1\` down to \`rows-1, cols-1\`. If the clamped rectangle is empty (lies entirely off-grid), it changes nothing.\n2. For every pixel inside the clamped rectangle, set it to \`fill\`. Count a pixel as **changed** only if its value was different from \`fill\` before this edit.\n3. Print \`EDIT <i> <changed>\` where \`i\` is the 1-based edit number and \`changed\` is how many pixels that edit changed.\n\nAfter all edits, print \`CHECKSUM <s>\` where \`s\` is the sum of every pixel value in the final grid.",
      challenge_input_format: "The first line has two integers `rows cols`.\n\nThe next `rows` lines each have `cols` space-separated integers: the starting pixel values.\n\nThe next line has one integer `m`: the number of edits.\n\nEach of the next `m` lines has five integers `r0 c0 r1 c1 fill`.",
      challenge_output_format: "Print `m` lines `EDIT <i> <changed>` in order, then one `CHECKSUM <s>` line.",
      challenge_constraints: [
        "1 ≤ rows, cols ≤ 200",
        "0 ≤ pixel values, fill ≤ 1000000",
        "1 ≤ m ≤ 1000",
        "-1000 ≤ r0, c0, r1, c1 ≤ 1000, with r0 ≤ r1 and c0 ≤ c1",
      ],
      challenge_examples: [
        { input: "3 3\n1 2 3\n4 5 6\n7 8 9\n1\n1 1 2 2 0", output: "EDIT 1 4\nCHECKSUM 17", explanation: "The mask covers cells (1,1)=5, (1,2)=6, (2,1)=8, (2,2)=9, all set to 0 -- 4 changed. Remaining values 1+2+3+4+7 = 17." },
        { input: "2 2\n9 1\n2 3\n1\n0 0 5 5 9", output: "EDIT 1 3\nCHECKSUM 36", explanation: "The mask clamps to the whole 2x2 grid and fills 9. (0,0) was already 9 so only 3 pixels change, but all four become 9 -> checksum 36." },
      ],
      challenge_notes: "Clamping before applying is the whole trick: an editor's drag can run off the canvas, and a naive loop would crash or skip. Counting only real changes (skipping pixels already equal to fill) mirrors how production editors report 'pixels touched' for undo and cost accounting. Because edits apply in order, a later mask overwriting an earlier one is exactly the compounding-edits effect from the lesson.",
      challenge_hints: [
        "Clamp with `max(0, r0)`, `min(rows-1, r1)` and likewise for columns; if the clamped range is empty, the edit changes nothing.",
        "Loop the clamped rows and columns; increment the counter only when `grid[r][c] != fill`, then assign `fill`.",
        "Compute the checksum at the end with `sum(sum(row) for row in grid)`.",
      ],
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    rows, cols = map(int, data[idx].split()); idx += 1
    grid = []
    for _ in range(rows):
        grid.append(list(map(int, data[idx].split()))); idx += 1
    m = int(data[idx].strip()); idx += 1
    # TODO: apply each clamped masked edit, print EDIT lines, then CHECKSUM.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    rows, cols = map(int, data[idx].split()); idx += 1
    grid = []
    for _ in range(rows):
        grid.append(list(map(int, data[idx].split()))); idx += 1
    m = int(data[idx].strip()); idx += 1
    out = []
    for e in range(1, m + 1):
        r0, c0, r1, c1, fill = map(int, data[idx].split()); idx += 1
        rr0 = max(0, r0)
        cc0 = max(0, c0)
        rr1 = min(rows - 1, r1)
        cc1 = min(cols - 1, c1)
        changed = 0
        if rr0 <= rr1 and cc0 <= cc1:
            for r in range(rr0, rr1 + 1):
                row = grid[r]
                for c in range(cc0, cc1 + 1):
                    if row[c] != fill:
                        changed += 1
                        row[c] = fill
        out.append("EDIT " + str(e) + " " + str(changed))
    checksum = sum(sum(row) for row in grid)
    out.append("CHECKSUM " + str(checksum))
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        { input: "3 3\n1 2 3\n4 5 6\n7 8 9\n1\n1 1 2 2 0", expected_output: "EDIT 1 4\nCHECKSUM 17", description: "A single interior mask fills four cells to zero." },
        { input: "2 2\n9 1\n2 3\n1\n0 0 5 5 9", expected_output: "EDIT 1 3\nCHECKSUM 36", description: "Mask clamps to the whole grid; one pixel already equals the fill so only three change." },
        { input: "2 2\n4 4\n4 4\n1\n0 0 0 0 4", expected_output: "EDIT 1 0\nCHECKSUM 16", description: "Edge case: filling a cell with its existing value counts as zero changes." },
        { input: "2 2\n1 1\n1 1\n2\n0 0 1 1 5\n0 0 0 0 9", expected_output: "EDIT 1 4\nEDIT 2 1\nCHECKSUM 24", description: "Two compounding edits: the second overwrites part of the first; final grid is 9 5 5 5 = 24." }
      ]
    }
  ]
};
