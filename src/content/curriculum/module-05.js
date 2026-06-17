export default {
  project: {
    id: "ai-05",
    title: "Computer Vision Basics",
    description: "Feed an image to a model, get structured data back — the practical way computers see now.",
    difficulty: "intermediate",
    category: "vision_multimodal",
    estimated_time: 120,
    lessons_count: 4,
    tags: ["computer-vision", "cnn", "image-classification", "multimodal", "claude-api"],
    order: 5,
    cover_image: ""
  },
  lessons: [
    {
      id: "ai-05-l1",
      project_id: "ai-05",
      order: 1,
      title: "How Computers See an Image",
      concept: "Pixels",
      xp_reward: 10,
      explanation: `Zoom into any digital photo far enough and the picture dissolves into a checkerboard of tiny colored squares. Each square is a **pixel**, and each pixel is just a number. Take a photo of your cat: to you it's a cat, to a computer it's a grid of numbers. That grid is the whole starting point of computer vision — everything else is math on top of it.

## What an image really is

A grayscale image is a single **2D grid** of brightness values. Every cell holds an integer from **0 (black) to 255 (white)**, with the values in between being shades of gray. A color image is bigger: it's a stack of three grids called **channels** — one for red, one for green, one for blue. Stack them and you get a **3D array** with shape \`(height, width, 3)\`.

Do the arithmetic and the numbers get large fast. A 1920×1080 photo is \`1080 × 1920 × 3 = 6,220,800\` values. So when someone says "the model takes an image as input," what they really mean is "the model takes a big array of integers." Nothing magical — just a lot of numbers arranged in a known shape.

## Why the shape matters

Vision models care about **structure**, not just the raw count of pixels. The value at position (10, 50) in the red channel sits next to (10, 51) for a reason — those points are physically adjacent in the world. A pixel and its neighbors usually describe the same edge, the same patch of fur, the same letter. Shuffle the grid and you destroy the very thing that makes an image an image.

This is the big difference from the text work in earlier modules. **Text is a 1D sequence** — one direction of nearness. **An image is a 2D grid per channel** — the model must respect *two* directions of nearness, vertical and horizontal. That extra dimension is exactly why images need their own kind of model, which the next lesson covers.

## Normalize before you do anything

Raw pixel values run 0–255. Almost every model expects them rescaled to a smaller, centered range — usually 0 to 1, or roughly -1 to 1. The most common move is **normalization**: divide every value by 255, and sometimes subtract a per-channel mean. This isn't a ritual. Large, unscaled inputs push a network's internal math into extreme ranges, which makes training slow and unstable.

\`\`\`python
import numpy as np

# A tiny 2x2 grayscale image (one channel), values 0-255
img = np.array([[0, 128],
                [255, 64]], dtype=np.float32)

normalized = img / 255.0   # every value now lands in 0.0 - 1.0
print(normalized.shape)    # (2, 2)
print(normalized)
\`\`\`

Notice the division applies to the **whole array at once** — that's NumPy doing element-wise math, no loop required.

## Why it matters

You will rarely hand-build pixel arrays. Libraries like Pillow or OpenCV load an image straight into a NumPy array for you. But internalizing that an image is *just numbers in a grid* demystifies everything downstream: convolutions slide over that grid, vision APIs encode that grid, classifiers score that grid. The picture is an illusion your eye assembles; the computer only ever touches the numbers.

## The mental model to keep

**An image is a spreadsheet of brightness, one sheet per color.** Height by width by channels. Normalize it, respect its grid, and the rest of computer vision is operations on that array.`,
      key_terms: [
        { term: "Pixel", definition: "The smallest unit of an image — one cell in the grid, holding a brightness value (0–255 per color channel)." },
        { term: "Channel", definition: "One of the color grids that stack to form an image. Color images have 3 (red, green, blue); grayscale has 1." },
        { term: "Normalization", definition: "Rescaling raw pixel values (0–255) into a smaller centered range like 0–1 so a model trains stably." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A spreadsheet you can't read at a glance",
          content: "An image is like three giant spreadsheets stacked on top of each other — one for red, one for green, one for blue. Each cell is a number. Your eye sees a cat; the computer sees a 6-million-cell spreadsheet.",
          position: "before"
        },
        {
          type: "tip",
          title: "Shape is (height, width, channels)",
          content: "When you print an image array's shape and see something like (1080, 1920, 3), read it as height, then width, then channels. Mixing up height and width is the single most common beginner bug.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "From photo to numbers",
        steps: [
          { label: "Physical scene", desc: "Light hits a camera sensor." },
          { label: "Sampling", desc: "The sensor measures brightness at each pixel location." },
          { label: "Three channels", desc: "Each pixel gets a red, green, and blue value (0–255)." },
          { label: "Array", desc: "Values stored as a height × width × 3 grid of numbers." },
          { label: "Normalize", desc: "Divide by 255 so the model sees values in 0–1." }
        ]
      },
      inline_quizzes: [
        {
          question: "What shape does a 64×64 color image have as an array?",
          options: ["64 × 64", "64 × 64 × 3", "64 × 3"],
          correct_index: 1,
          explanation: "Height (64) × width (64) × 3 color channels. The 3 is what makes it color rather than grayscale."
        }
      ],
      quiz_questions: [
        {
          question: "Why do vision models care about the spatial layout of pixels, not just their values?",
          options: [
            "Adjacent pixels usually describe the same edge or object, so nearness carries meaning",
            "Spatial layout makes the file smaller",
            "Models can only read pixels left to right",
            "It has no effect; only the average pixel value matters"
          ],
          correct_index: 0,
          explanation: "Neighboring pixels are physically related — they share edges, textures, and shapes. Losing the grid structure destroys the information that makes an image recognizable."
        },
        {
          question: "What does dividing pixel values by 255 accomplish?",
          options: [
            "It converts color to grayscale",
            "It rescales values from 0–255 into 0–1 so the model trains stably",
            "It removes the alpha channel",
            "It doubles the resolution"
          ],
          correct_index: 1,
          explanation: "255 is the max pixel value, so dividing by it maps everything into 0–1. Small, centered inputs keep training stable and fast."
        },
        {
          question: "How many numbers represent a single 100×100 grayscale image?",
          options: ["100", "300", "10,000", "30,000"],
          correct_index: 2,
          explanation: "Grayscale has one channel, so 100 × 100 × 1 = 10,000 values. A color version would be 30,000."
        }
      ],
      participation_activities: [
        {
          activity_title: "Check your mental model",
          questions: [
            {
              question: "A grayscale image has 3 color channels.",
              type: "true_false",
              correct_answer: "false",
              explanation: "Grayscale has exactly one channel. Three channels (RGB) is what makes an image color."
            },
            {
              question: "To rescale pixel values into the 0–1 range, you divide each one by ___.",
              type: "fill_in",
              correct_answer: "255",
              explanation: "255 is the maximum possible pixel value, so dividing by it normalizes everything to 0–1."
            }
          ]
        }
      ],
      starter_code: `import numpy as np

# A tiny 2x2 grayscale image, values 0-255
img = np.array([[0, 128],
                [255, 64]], dtype=np.float32)

# TODO: print the shape of the array
# TODO: normalize the values to the 0-1 range and print them
`,
      solution_code: `import numpy as np

# A tiny 2x2 grayscale image, values 0-255
img = np.array([[0, 128],
                [255, 64]], dtype=np.float32)

print("Shape:", img.shape)

normalized = img / 255.0
print("Normalized:")
print(normalized)
`,
      expected_output: `Shape: (2, 2)
Normalized:
[[0.        0.5019608]
 [1.        0.2509804]]`,
      hints: [
        "Every NumPy array has a .shape attribute — print img.shape.",
        "Dividing a whole array by a number applies the division to every element at once.",
        "128 / 255 ≈ 0.502 and 64 / 255 ≈ 0.251 — float32 prints those with extra digits."
      ],
      step_throughs: [
        {
          title: "photo → pixel grid → numbers → normalized",
          steps: [
            { label: "Start with a photo", detail: "A real scene captured by a camera. Your eye sees objects; the file stores light.", code: "cat.png  (a 2x2 corner, zoomed way in)" },
            { label: "Resolve into pixels", detail: "Every position becomes a discrete cell. Each cell will hold one brightness value per channel.", code: "[ dark  mid ]\n[ bright dim ]" },
            { label: "Read the numbers", detail: "Brightness is just an integer 0-255. Here as a grayscale grid — one channel.", code: "[[  0, 128],\n [255,  64]]   shape (2, 2)" },
            { label: "Normalize to 0-1", detail: "Divide the whole grid by 255 so the model sees small, centered values.", code: "[[0.00, 0.50],\n [1.00, 0.25]]" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Normalize the single pixel value 64 into the 0-1 range.",
          steps: [
            "Normalization for 0-255 pixels means dividing by the maximum, 255.",
            "Compute 64 / 255.",
            "64 / 255 = 0.2509..., which rounds to about 0.25."
          ],
          output: "0.25"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "How many numbers store a 256 x 256 RGB color image, and what is its array shape?",
          steps: [
            "Color means 3 channels (red, green, blue), so shape is (height, width, channels) = (256, 256, 3).",
            "Total values = height x width x channels = 256 x 256 x 3.",
            "256 x 256 = 65,536; times 3 = 196,608.",
            "Grayscale would be a third of that: 65,536 values with shape (256, 256)."
          ],
          output: "shape (256, 256, 3), 196,608 numbers"
        }
      ],
      comparison_tables: [
        {
          title: "grayscale vs RGB color",
          columns: ["Property", "Grayscale", "RGB color"],
          rows: [
            { cells: ["Channels", "1", "3 (red, green, blue)"] },
            { cells: ["Array shape", "(H, W)", "(H, W, 3)"] },
            { cells: ["Numbers for 100x100", "10,000", "30,000"] },
            { cells: ["Stores color?", "No — only brightness", "Yes — full color"], highlight: true },
            { cells: ["Value range per cell", "0-255", "0-255 per channel"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "grayscale image vs color image",
          bins: [
            { id: "gray", label: "Grayscale (1 channel)" },
            { id: "rgb", label: "RGB color (3 channels)" }
          ],
          items: [
            { id: "i1", text: "Array shape (480, 640)", bin: "gray" },
            { id: "i2", text: "Array shape (480, 640, 3)", bin: "rgb" },
            { id: "i3", text: "Each pixel is one brightness number", bin: "gray" },
            { id: "i4", text: "Each pixel is a red, green, blue triple", bin: "rgb" },
            { id: "i5", text: "A black-and-white scanned document", bin: "gray" },
            { id: "i6", text: "A photo of a sunset", bin: "rgb" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why must a vision model preserve the grid layout of pixels instead of treating the image as one long flat list of numbers?",
          sampleAnswer: "Neighboring pixels are physically related — they share edges, textures, and shapes. The grid encodes which pixels are next to which. If you flatten the image into a flat list, the model loses the 2D nearness information, so it can no longer tell that a pixel and the one just below it belong to the same edge or object."
        }
      ],
      challenge_title: "Normalize a color pixel",
      challenge_description: "You're given a single RGB pixel as a list of three values (0–255). Write code that prints each value divided by 255, rounded to 2 decimal places, as a list.",
      challenge_starter_code: `pixel = [255, 128, 0]

# TODO: print each value divided by 255, rounded to 2 decimals, as a list
`,
      challenge_solution_code: `pixel = [255, 128, 0]

normalized = [round(v / 255, 2) for v in pixel]
print(normalized)
`,
      challenge_test_cases: [
        {
          input: "pixel = [255, 128, 0]",
          expected_output: "[1.0, 0.5, 0.0]",
          description: "Pure red-ish pixel normalized to 0–1."
        },
        {
          input: "pixel = [0, 0, 0]",
          expected_output: "[0.0, 0.0, 0.0]",
          description: "Black pixel stays all zeros."
        }
      ]
    },

    {
      id: "ai-05-l2",
      project_id: "ai-05",
      order: 2,
      title: "What a CNN Actually Does",
      concept: "Convolution",
      xp_reward: 10,
      explanation: `In 2012 a network called AlexNet won the ImageNet contest by a margin so wide it ended a debate. The architecture behind it — a **convolutional neural network**, or **CNN** — became the engine behind nearly every "is this a dog or a cat" system for the next decade. You won't build one from scratch, but understanding the single idea that makes it work, the **convolution**, unlocks everything that follows.

## The problem CNNs solve

Imagine wiring every pixel of a 224×224 image to every neuron in a layer. That's about 50,000 inputs per neuron, and the network would have to *separately learn* that an edge in the top-left corner looks like an edge in the bottom-right corner. Two flaws: a parameter explosion, and no shared knowledge of what an edge is. The model wastes capacity relearning the same pattern in every location, and it generalizes poorly.

A convolution fixes both problems with one trick: a **small filter that slides across the whole image**.

## A filter is a tiny pattern detector

A **filter** (also called a **kernel**) is a small grid of weights — typically 3×3. You slide it over every position in the image. At each spot you multiply the filter's values by the pixels underneath and add the products into a single number. Slide across the entire image and the outputs collect into a new grid called a **feature map** — a heatmap answering "where did this pattern show up?"

\`\`\`python
import numpy as np

# 3x3 image patch (grayscale)
patch = np.array([[10, 10, 10],
                  [0,  0,  0],
                  [10, 10, 10]])

# A horizontal-edge filter
kernel = np.array([[ 1,  1,  1],
                   [ 0,  0,  0],
                   [-1, -1, -1]])

response = np.sum(patch * kernel)
print(response)  # high magnitude = strong edge here
\`\`\`

The element-wise multiply (\`patch * kernel\`) followed by \`np.sum\` is the entire operation at one position. A bright top row over a dark bottom row produces a large response; a uniform patch produces near zero.

The key insight: **the same filter is reused at every position.** A filter that detects a vertical edge detects it anywhere in the frame. The model learns the filter once and applies it everywhere — a property called **weight sharing**. This is why CNNs need orders of magnitude fewer parameters than a fully connected network.

## Stacking builds up complexity

One layer of filters finds edges and color blobs. Feed those feature maps into another layer and it learns to combine edges into corners and textures. Another layer combines those into shapes — eyes, wheels, leaves. By the final layers, the network responds to whole objects. **Simple parts, composed upward.** You never program any of this; the filters are *learned* from labeled examples through training.

Between convolution layers sits **pooling**, which shrinks each feature map by, say, taking the maximum value in every 2×2 block. Pooling makes the model faster and a little tolerant of small shifts — a cat nudged five pixels to the left is still a cat.

## Why it matters

CNNs slashed image-classification error rates and made vision practical at scale. Even though you'll rarely hand-code one today, every vision API — including the multimodal model in the next lesson — is built on these foundations. Understanding convolution means you understand what those APIs are doing under the hood.

## The mental model to keep

**A convolution is a stencil you drag across the page.** One small pattern, checked at every position, reused everywhere. Stack the stencils and simple edges compose into whole objects.`,
      key_terms: [
        { term: "Filter (kernel)", definition: "A small grid of weights slid across an image to detect a specific pattern like an edge or texture." },
        { term: "Feature map", definition: "The grid of numbers produced when a filter is applied across an image — a heatmap of where that pattern appears." },
        { term: "Weight sharing", definition: "Reusing the same filter at every position in the image, so a pattern learned once is detected everywhere." },
        { term: "Pooling", definition: "Downsampling a feature map (e.g. max over each 2×2 block) to shrink it and add tolerance to small shifts." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "A stencil you drag across the page",
          content: "A filter is like a tiny stencil. You drag it over every part of the image and note where the shape underneath matches the stencil. One stencil, checked everywhere — that's a convolution.",
          position: "before"
        },
        {
          type: "insight",
          title: "Depth = abstraction",
          content: "Early layers see edges. Middle layers see textures and corners. Deep layers see whole objects. The network never gets told what an eye is — it discovers that combining certain edges reliably predicts the label.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "How a convolution layer processes an image",
        steps: [
          { label: "Input image", desc: "A grid of pixel values (one or more channels)." },
          { label: "Slide the filter", desc: "Move a small kernel across every position." },
          { label: "Multiply and sum", desc: "At each spot, multiply overlapping values and add them up." },
          { label: "Feature map", desc: "Collect the results into a new grid showing where the pattern fired." },
          { label: "Pool", desc: "Shrink the feature map and pass it to the next layer." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why does a CNN need far fewer parameters than connecting every pixel to every neuron?",
          options: [
            "It uses smaller images",
            "It reuses the same filter at every position (weight sharing)",
            "It ignores color channels",
            "It only looks at the center of the image"
          ],
          correct_index: 1,
          explanation: "A filter learned once is applied everywhere. That weight sharing means the model learns a small set of filters instead of unique weights for every pixel location."
        }
      ],
      quiz_questions: [
        {
          question: "What is a feature map?",
          options: [
            "A labeled list of the image's objects",
            "The output grid showing where a filter's pattern appears across the image",
            "A compressed version of the original photo",
            "The set of weights inside one filter"
          ],
          correct_index: 1,
          explanation: "Sliding a filter over the whole image produces a feature map — a grid that lights up wherever that pattern (an edge, a texture) is present."
        },
        {
          question: "What do deeper layers of a CNN tend to detect compared to early layers?",
          options: [
            "Deeper layers detect raw pixels; early layers detect objects",
            "Both detect the same thing at different speeds",
            "Early layers detect edges; deeper layers detect whole objects",
            "Deeper layers only detect color"
          ],
          correct_index: 2,
          explanation: "Complexity builds with depth: edges → textures/corners → shapes → whole objects. Each layer composes the patterns found by the previous one."
        },
        {
          question: "What does a pooling step do?",
          options: [
            "Adds more filters to the layer",
            "Downsamples the feature map, shrinking it and adding shift tolerance",
            "Converts the image to grayscale",
            "Labels the detected objects"
          ],
          correct_index: 1,
          explanation: "Pooling (often max-pooling over 2×2 blocks) reduces the feature map's size and makes the network a bit robust to small position changes."
        }
      ],
      participation_activities: [
        {
          activity_title: "Convolution sanity check",
          questions: [
            {
              question: "The same filter is applied at every position in the image.",
              type: "true_false",
              correct_answer: "true",
              explanation: "That's weight sharing — one learned filter detects its pattern anywhere in the image."
            },
            {
              question: "The grid produced by sliding a filter across an image is called a feature ___.",
              type: "fill_in",
              correct_answer: "map",
              explanation: "A feature map shows where the filter's pattern appears across the whole image."
            }
          ]
        }
      ],
      starter_code: `import numpy as np

# 3x3 image patch (grayscale)
patch = np.array([[10, 10, 10],
                  [0,  0,  0],
                  [10, 10, 10]])

# A horizontal-edge filter
kernel = np.array([[ 1,  1,  1],
                   [ 0,  0,  0],
                   [-1, -1, -1]])

# TODO: multiply the patch by the kernel element-wise, sum it, and print the result
`,
      solution_code: `import numpy as np

# 3x3 image patch (grayscale)
patch = np.array([[10, 10, 10],
                  [0,  0,  0],
                  [10, 10, 10]])

# A horizontal-edge filter
kernel = np.array([[ 1,  1,  1],
                   [ 0,  0,  0],
                   [-1, -1, -1]])

response = np.sum(patch * kernel)
print("Filter response:", response)
`,
      expected_output: `Filter response: 0`,
      hints: [
        "patch * kernel multiplies element by element, not matrix multiplication.",
        "np.sum() adds up every value in the resulting grid.",
        "The top row (1·10 each = 30) and bottom row (-1·10 each = -30) cancel out, giving 0."
      ],
      step_throughs: [
        {
          title: "image patch → slide filter → multiply-and-sum → feature map cell",
          steps: [
            { label: "Take a 3x3 patch", detail: "Grab the pixels currently under the filter. Bright on top, dark on the bottom — an edge.", code: "[[100,100,100],\n [ 50, 50, 50],\n [  0,  0,  0]]" },
            { label: "Line up the kernel", detail: "An edge-detecting filter: positive weights on top, negative on the bottom.", code: "[[ 1, 1, 1],\n [ 0, 0, 0],\n [-1,-1,-1]]" },
            { label: "Multiply and sum", detail: "Multiply overlapping cells, then add every product into one number.", code: "(100+100+100) + 0 + (-0-0-0) = 300" },
            { label: "Write one feature-map cell", detail: "300 is large, so this spot lit up — a strong edge here. Slide one step over and repeat.", code: "feature_map[r][c] = 300" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "Apply the horizontal-edge kernel to a flat patch where every pixel is 50. What is the response?",
          steps: [
            "The kernel's top row is all +1 and its bottom row is all -1; the middle row is 0.",
            "Top row contributes (1*50)*3 = 150. Bottom row contributes (-1*50)*3 = -150.",
            "150 + 0 + (-150) = 0.",
            "A flat patch has no edge, so the edge filter correctly returns 0."
          ],
          output: "0"
        },
        {
          number: 2, difficulty: "medium",
          prompt: "A 6x6 image is processed by a convolution layer with a 3x3 filter (stride 1, no padding), then 2x2 max-pooling. What are the two output sizes?",
          steps: [
            "Valid convolution output size = input - filter + 1 in each dimension.",
            "6 - 3 + 1 = 4, so the feature map is 4 x 4.",
            "2x2 pooling halves each dimension: 4 / 2 = 2.",
            "After pooling the map is 2 x 2."
          ],
          output: "feature map 4 x 4, after pooling 2 x 2"
        }
      ],
      comparison_tables: [
        {
          title: "convolutional layer vs dense (fully connected) layer",
          columns: ["Property", "Dense layer", "Convolutional layer"],
          rows: [
            { cells: ["Connectivity", "Every input to every neuron", "Small filter over local patches"] },
            { cells: ["Parameters", "Huge (millions for one image)", "Tiny (just the filter weights)"] },
            { cells: ["Weight sharing", "None", "Same filter reused everywhere"], highlight: true },
            { cells: ["Respects spatial layout", "No — input is flattened", "Yes — slides across the grid"] },
            { cells: ["Best for", "Tabular / final classification", "Images and grid-structured data"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "which CNN component does each job?",
          bins: [
            { id: "conv", label: "Convolution / filter" },
            { id: "pool", label: "Pooling" }
          ],
          items: [
            { id: "i1", text: "Detects edges and textures", bin: "conv" },
            { id: "i2", text: "Shrinks the feature map", bin: "pool" },
            { id: "i3", text: "Reuses the same weights everywhere", bin: "conv" },
            { id: "i4", text: "Adds tolerance to small shifts", bin: "pool" },
            { id: "i5", text: "Produces a feature map", bin: "conv" },
            { id: "i6", text: "Often takes the max of each 2x2 block", bin: "pool" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: explain weight sharing and why it lets a CNN use far fewer parameters than a fully connected network.",
          sampleAnswer: "Weight sharing means the same small filter is slid across every position of the image instead of learning a separate set of weights for each pixel location. Because one filter is reused everywhere, the model only has to store and learn that filter's few weights, not millions of unique connections. A pattern learned once (like a vertical edge) is then detected anywhere in the image for free."
        }
      ],
      challenge_title: "Detect a strong edge",
      challenge_description: "Apply the same horizontal-edge kernel to a different patch where the top is bright and the bottom is dark. Print the filter response. A large magnitude means a strong edge was found.",
      challenge_starter_code: `import numpy as np

patch = np.array([[100, 100, 100],
                  [50,  50,  50],
                  [0,   0,   0]])

kernel = np.array([[ 1,  1,  1],
                   [ 0,  0,  0],
                   [-1, -1, -1]])

# TODO: print the filter response (element-wise multiply, then sum)
`,
      challenge_solution_code: `import numpy as np

patch = np.array([[100, 100, 100],
                  [50,  50,  50],
                  [0,   0,   0]])

kernel = np.array([[ 1,  1,  1],
                   [ 0,  0,  0],
                   [-1, -1, -1]])

response = np.sum(patch * kernel)
print("Filter response:", response)
`,
      challenge_test_cases: [
        {
          input: "Top row 100, bottom row 0",
          expected_output: "Filter response: 300",
          description: "Bright-over-dark patch gives a strong positive response (300)."
        }
      ]
    },

    {
      id: "ai-05-l3",
      project_id: "ai-05",
      order: 3,
      title: "Calling a Multimodal Vision Model",
      concept: "Multimodal API",
      xp_reward: 10,
      explanation: `Five years ago, "make the computer tell me what's in this photo" meant collecting thousands of labeled images, training a CNN, and deploying it — weeks of work for one narrow task. Today it's one API call. You send the image to a **multimodal model** like Claude and ask in plain English: "What's in this picture?" "Is the person wearing a helmet?" "Read the receipt total." It answers in words. That collapse from weeks to minutes is the most important shift in everyday vision work.

## What "multimodal" means

A **multimodal model** accepts more than one kind of input. Claude takes **text and images in the same message**. Under the hood it still converts the image into numbers and runs them through learned vision layers — the CNN ideas from the last lesson didn't disappear, they got absorbed into a much larger model. What changed for *you* is the interface: you talk to it like a person instead of training a custom classifier for every new task.

## The shape of the request

You send a message whose \`content\` is a **list of blocks** — typically one image block and one text block. The image travels as **base64-encoded** bytes tagged with its **media type** (e.g. \`image/png\`). Base64 turns raw binary into text characters so the bytes can ride safely inside a JSON request.

\`\`\`python
import os
import base64
from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

with open("receipt.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data,
                    },
                },
                {"type": "text", "text": "What store is this receipt from?"},
            ],
        }
    ],
)

print(response.content[0].text)
\`\`\`

That's the whole pattern. The image and the question travel together in one \`user\` message. Claude reads both and replies in text, which you pull out of \`response.content[0].text\`.

## Why this is a big deal

The old workflow: collect thousands of labeled images, train a CNN, deploy it, retrain whenever the task changes. The new workflow: **one API call, and you change the task by editing the prompt.** Want to detect something different tomorrow? Rewrite the question. No labeled dataset, no training loop, no redeploy.

The tradeoff is **cost and latency**. An API call per image isn't free, and it's slower than a tiny specialized CNN. For high-volume, fixed tasks — a factory line scanning the same part a million times a day — a dedicated model still wins on price and speed. For the long tail of "I just need to understand this one image" tasks, the multimodal API is the obvious tool.

## Keep the key out of your code

Notice \`Anthropic()\` is called with no arguments — it pulls the key from \`os.environ["ANTHROPIC_API_KEY"]\`. Never paste an API key into source. The moment you push to a repo, a hardcoded key leaks. Set it as an environment variable and let the client read it.

## The mental model to keep

**Calling a vision model is texting a knowledgeable friend a photo with a caption.** The picture and the question go in one message; a written answer comes back. Swap the question, get a new task — no retraining required.`,
      key_terms: [
        { term: "Multimodal model", definition: "A model that accepts more than one input type — here, text and images in the same message." },
        { term: "Content block", definition: "One item in a message's content list. A vision request mixes an image block and a text block." },
        { term: "Base64 encoding", definition: "A text-safe way to represent raw image bytes so they can travel inside a JSON API request." },
        { term: "Media type", definition: "The label telling the API what kind of image you sent, e.g. image/png or image/jpeg." }
      ],
      callouts: [
        {
          type: "analogy",
          title: "Texting a friend a photo with a question",
          content: "Calling a multimodal model is like texting a knowledgeable friend a photo and typing 'what is this?' underneath. The picture and the question go in one message, and you get a written answer back.",
          position: "before"
        },
        {
          type: "warning",
          title: "Never hardcode your API key",
          content: "Anthropic() reads the key from the ANTHROPIC_API_KEY environment variable. Pasting a key into your code risks leaking it the moment you push to a repo. Keep it in the environment.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "One vision request, start to finish",
        steps: [
          { label: "Load image", desc: "Read the file's raw bytes from disk." },
          { label: "Encode", desc: "Base64-encode the bytes so they fit in JSON." },
          { label: "Build message", desc: "Put an image block and a text question in one user message." },
          { label: "Call the API", desc: "Send it to client.messages.create with a model and max_tokens." },
          { label: "Read the answer", desc: "Pull the text out of response.content[0].text." }
        ]
      },
      inline_quizzes: [
        {
          question: "How do the image and the question travel to a multimodal model?",
          options: [
            "In two separate API calls",
            "As two content blocks inside one user message",
            "The image as a URL in the model name field",
            "The question goes in the system prompt, the image in a file upload"
          ],
          correct_index: 1,
          explanation: "Both go in the content list of a single user message — an image block and a text block together."
        }
      ],
      quiz_questions: [
        {
          question: "What's the main advantage of a multimodal API over training a custom CNN for each new task?",
          options: [
            "It's always cheaper per image",
            "You change the task by editing the text prompt — no retraining needed",
            "It doesn't use any vision layers internally",
            "It can only handle one fixed question"
          ],
          correct_index: 1,
          explanation: "The task lives in the prompt. Want to detect something different? Rewrite the question. No labeled dataset, no training loop."
        },
        {
          question: "Why is the image base64-encoded before sending?",
          options: [
            "To compress it smaller than a JPEG",
            "To convert raw bytes into a text-safe form that fits inside a JSON request",
            "To remove the color channels",
            "Because the model can't read PNG files"
          ],
          correct_index: 1,
          explanation: "JSON is text. Base64 turns binary image bytes into characters that can ride safely inside the JSON body."
        },
        {
          question: "When does a small dedicated CNN still beat a multimodal API call?",
          options: [
            "For one-off 'what is this image' questions",
            "When the task changes constantly",
            "For high-volume, fixed tasks where cost and latency per image matter",
            "Never — multimodal always wins"
          ],
          correct_index: 2,
          explanation: "A factory scanning the same part millions of times wants a tiny, fast, cheap specialized model. The API shines for the varied, low-volume long tail."
        }
      ],
      participation_activities: [
        {
          activity_title: "Vision request basics",
          questions: [
            {
              question: "You must retrain a multimodal model every time you want to ask a new question about an image.",
              type: "true_false",
              correct_answer: "false",
              explanation: "You just change the text prompt. No retraining — that's the whole point."
            },
            {
              question: "Anthropic() with no arguments reads the API key from the ___ ANTHROPIC_API_KEY variable.",
              type: "fill_in",
              correct_answer: "environment",
              explanation: "The client pulls the key from the environment variable, keeping it out of your source code."
            }
          ]
        }
      ],
      starter_code: `import os
import base64
from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

with open("receipt.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

# TODO: build a user message with an image block and a text question,
# call client.messages.create with model "claude-sonnet-4-6" and max_tokens=1024,
# then print the answer text
`,
      solution_code: `import os
import base64
from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

with open("receipt.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data,
                    },
                },
                {"type": "text", "text": "What store is this receipt from?"},
            ],
        }
    ],
)

print(response.content[0].text)
`,
      expected_output: `The receipt is from Blue Bottle Coffee.`,
      hints: [
        "The content field is a list. Put the image block first, then the text block.",
        "The image block needs type 'image' and a 'source' with type 'base64', a media_type, and the data.",
        "Claude's text answer lives at response.content[0].text."
      ],
      step_throughs: [
        {
          title: "image file → base64 → message blocks → answer",
          steps: [
            { label: "Read the bytes", detail: "Open the file in binary mode and read its raw bytes from disk.", code: 'raw = open("receipt.png", "rb").read()' },
            { label: "Base64-encode", detail: "Turn binary bytes into text-safe characters so they fit inside JSON.", code: 'image_data = base64.standard_b64encode(raw).decode("utf-8")' },
            { label: "Build the content list", detail: "One image block (with media_type and data) plus one text block (the question) in a single user message.", code: 'content = [image_block, {"type": "text", "text": "What store is this?"}]' },
            { label: "Call and read", detail: "Send to client.messages.create, then pull the text out of the first content block.", code: "print(response.content[0].text)" }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: "You have a JPEG photo. What media_type string goes in the image source block?",
          steps: [
            "The media_type tells the API the image format.",
            "JPEG files use the MIME type image/jpeg (not image/jpg).",
            "PNG would be image/png; this one is a JPEG."
          ],
          output: '"image/jpeg"'
        },
        {
          number: 2, difficulty: "medium",
          prompt: "You need to classify 50,000 identical factory parts per hour, forever, with the same yes/no check. Multimodal API call per image, or a dedicated CNN? Why?",
          steps: [
            "List the workload traits: extremely high volume, one fixed task that never changes.",
            "A multimodal API charges per call and adds network latency every image — costly and slow at this scale.",
            "A dedicated CNN is tiny, fast, and cheap once trained, and the fixed task means no retraining churn.",
            "High-volume + fixed task favors the specialized CNN; the API wins for varied, low-volume work."
          ],
          output: "Dedicated CNN — high volume and a fixed task make per-call cost and latency the deciding factor"
        }
      ],
      comparison_tables: [
        {
          title: "multimodal API vs custom-trained CNN",
          columns: ["Dimension", "Multimodal API", "Custom CNN"],
          rows: [
            { cells: ["Setup to first result", "Minutes (write a prompt)", "Weeks (label data, train)"] },
            { cells: ["Change the task", "Edit the text prompt", "Relabel and retrain"], highlight: true },
            { cells: ["Cost per image", "Higher (per API call)", "Very low once deployed"] },
            { cells: ["Latency", "Network round-trip", "Milliseconds, local"] },
            { cells: ["Best fit", "Varied, low-volume tasks", "High-volume, fixed task"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "where does each piece of the request belong?",
          bins: [
            { id: "image", label: "Image block" },
            { id: "text", label: "Text block" }
          ],
          items: [
            { id: "i1", text: "The base64-encoded data", bin: "image" },
            { id: "i2", text: 'media_type "image/png"', bin: "image" },
            { id: "i3", text: '"What store is this receipt from?"', bin: "text" },
            { id: "i4", text: 'source with type "base64"', bin: "image" },
            { id: "i5", text: '"Answer only yes or no."', bin: "text" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why does editing the text prompt replace an entire retraining cycle when you use a multimodal model?",
          sampleAnswer: "With a custom CNN, the task is baked into the trained weights, so changing what you want to detect means collecting new labeled data and training again. With a multimodal model the perception ability is already general; the specific task lives in the prompt you send. Asking a different question simply points that general ability at a new goal, so you swap the text instead of running a training loop."
        }
      ],
      challenge_title: "Ask a yes/no vision question",
      challenge_description: "Reuse the request pattern but change the question to a safety check: 'Is the person in this photo wearing a helmet? Answer only yes or no.' Print the answer. (Assume the image variable is already loaded as image_data.)",
      challenge_starter_code: `from anthropic import Anthropic

client = Anthropic()
image_data = "...already base64-encoded jpeg..."

# TODO: send the image with the question
# "Is the person in this photo wearing a helmet? Answer only yes or no."
# model "claude-sonnet-4-6", max_tokens 10, then print response.content[0].text
`,
      challenge_solution_code: `from anthropic import Anthropic

client = Anthropic()
image_data = "...already base64-encoded jpeg..."

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=10,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data,
                    },
                },
                {"type": "text", "text": "Is the person in this photo wearing a helmet? Answer only yes or no."},
            ],
        }
    ],
)

print(response.content[0].text)
`,
      challenge_test_cases: [
        {
          input: "Photo of a cyclist wearing a helmet",
          expected_output: "Yes",
          description: "Model returns a one-word answer because the prompt constrains it."
        }
      ]
    },

    {
      id: "ai-05-l4",
      project_id: "ai-05",
      order: 4,
      title: "Getting Structured Data Back",
      concept: "Structured Output",
      xp_reward: 10,
      explanation: `"The receipt is from Blue Bottle Coffee and the total appears to be twelve dollars and fifty cents." Lovely for a human. Useless to a program — you can't add up a sentence, store it in a column, or branch on it. To *do* something with a vision answer you need **structured data**: JSON with known fields. This lesson turns "feed an image, get a paragraph" into "feed an image, get a clean object your code can use."

## Ask for JSON, get a string of JSON

The simplest approach: tell the model **exactly what shape you want**, then parse the reply. You describe the fields in the prompt, the model writes JSON as its text response, and you call \`json.loads()\` to turn that string into a Python dict.

\`\`\`python
import json
import base64
from anthropic import Anthropic

client = Anthropic()

with open("receipt.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

prompt = (
    "Extract the receipt as JSON with exactly these fields: "
    "store (string), total (number), item_count (integer). "
    "Reply with only the JSON, no other text."
)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64",
                 "media_type": "image/png", "data": image_data}},
                {"type": "text", "text": prompt},
            ],
        }
    ],
)

data = json.loads(response.content[0].text)
print(data["store"], "->", data["total"])
\`\`\`

Two things matter in that prompt. First, **name the exact fields and their types** — vague prompts give vague shapes. Second, **say "only the JSON, no other text"** so you don't have to strip a "Here's the JSON:" preamble before parsing.

## Why structured output unlocks real work

Once the answer is a dict, the image becomes a row in a table. Scan 500 receipts, get 500 objects, load them into a spreadsheet, sum the totals. The model did the *seeing*; your code does the *processing*. That division of labor is the whole game in applied vision: let the model handle perception, keep the deterministic logic in plain code.

## Validate — the model can still surprise you

Treat the model's JSON like any untrusted input. It might omit a field, return a string where you expected a number, or — rarely — wrap the JSON in stray text. Wrap \`json.loads()\` in a try/except, check that required keys exist, and coerce types before you rely on them. A one-line guard saves a 2am crash.

\`\`\`python
try:
    data = json.loads(text)
    total = float(data["total"])
except (json.JSONDecodeError, KeyError, ValueError):
    total = None  # handle the miss instead of crashing
\`\`\`

For production, the API also offers a structured-outputs mode that constrains the response to a schema so it can't drift — worth reaching for once you're past prototyping. But the prompt-and-parse pattern above is the foundation, and it's enough to build something real today.

## Why it matters

This pattern is what makes vision *operational*. A pile of photos becomes a queryable table; a stack of invoices becomes a sum; a folder of screenshots becomes filterable records. The expensive, fuzzy perception work goes to the model exactly once per image, and the cheap, exact processing stays in your code where you can test and trust it.

## The mental model to keep

**Structured output is the handoff line between perception and logic.** Tell the model the exact keys and types, demand JSON and nothing else, parse it behind a guard — then your deterministic code takes over.`,
      key_terms: [
        { term: "Structured output", definition: "A model response shaped as data (JSON with known fields) rather than free-form prose, so your code can use it directly." },
        { term: "json.loads()", definition: "The Python function that parses a JSON string into a dict you can index by field name." },
        { term: "Field specification", definition: "Naming the exact keys and their types in the prompt so the model returns a predictable shape." },
        { term: "Validation", definition: "Checking the parsed data for missing keys or wrong types before trusting it, since model output isn't guaranteed." }
      ],
      callouts: [
        {
          type: "insight",
          title: "Model sees, code processes",
          content: "The clean split: the multimodal model handles perception (what's in the image), and your deterministic code handles logic (store it, sum it, branch on it). Structured output is the handoff point between the two.",
          position: "before"
        },
        {
          type: "warning",
          title: "Always wrap json.loads in a guard",
          content: "Model JSON is untrusted input. A missing field or a stray word breaks a naive parse. A try/except around json.loads plus a key check turns a crash into a graceful miss.",
          position: "after"
        }
      ],
      concept_diagram: {
        title: "Image to usable record",
        steps: [
          { label: "Specify fields", desc: "Tell the model the exact JSON keys and types you want." },
          { label: "Constrain output", desc: "Ask for 'only the JSON, no other text.'" },
          { label: "Call the model", desc: "Send the image plus the JSON-shaped prompt." },
          { label: "Parse", desc: "Run json.loads() on the reply to get a dict." },
          { label: "Validate and use", desc: "Check keys and types, then store or compute." }
        ]
      },
      inline_quizzes: [
        {
          question: "Why add 'reply with only the JSON, no other text' to the prompt?",
          options: [
            "It makes the model faster",
            "So the reply parses cleanly without stripping a preamble like 'Here is the JSON:'",
            "It reduces the API cost to zero",
            "It forces the image to grayscale"
          ],
          correct_index: 1,
          explanation: "If the model adds friendly text around the JSON, json.loads() chokes. Constraining the output to pure JSON keeps parsing simple."
        }
      ],
      quiz_questions: [
        {
          question: "What turns a model's text answer into something your program can index by field name?",
          options: [
            "Printing it to the console",
            "Calling json.loads() to parse it into a dict",
            "Base64-encoding it",
            "Saving it as a .png"
          ],
          correct_index: 1,
          explanation: "json.loads() parses a JSON string into a Python dict, so you can access data['store'], data['total'], and so on."
        },
        {
          question: "Why should you wrap json.loads() in a try/except when parsing model output?",
          options: [
            "json.loads() is deprecated",
            "The model's JSON might be malformed, miss a field, or have wrong types — treat it as untrusted",
            "It speeds up the API call",
            "Try/except converts the image to JSON automatically"
          ],
          correct_index: 1,
          explanation: "Model output isn't guaranteed. A guard plus a key/type check turns an occasional bad response into a handled miss instead of a crash."
        },
        {
          question: "In the 'model sees, code processes' split, what does your code handle?",
          options: [
            "Recognizing what's in the image",
            "The deterministic logic: storing, summing, and branching on the data",
            "Encoding the image to base64",
            "Nothing — the model does everything"
          ],
          correct_index: 1,
          explanation: "Perception goes to the model; deterministic processing stays in plain code. Structured output is the clean handoff between the two halves."
        }
      ],
      participation_activities: [
        {
          activity_title: "Structured output checks",
          questions: [
            {
              question: "Naming the exact fields and types in your prompt gives you a more predictable response shape.",
              type: "true_false",
              correct_answer: "true",
              explanation: "Vague prompts produce vague shapes. Specifying keys and types makes the output reliable enough to parse."
            },
            {
              question: "The Python function that parses a JSON string into a dict is json.___().",
              type: "fill_in",
              correct_answer: "loads",
              explanation: "json.loads() converts a JSON string into a Python dictionary you can index by key."
            }
          ]
        }
      ],
      starter_code: `import json

# Pretend this is the model's reply text
text = '{"store": "Blue Bottle Coffee", "total": 12.50, "item_count": 2}'

# TODO: parse the text into a dict and print the store and total
`,
      solution_code: `import json

# Pretend this is the model's reply text
text = '{"store": "Blue Bottle Coffee", "total": 12.50, "item_count": 2}'

data = json.loads(text)
print(data["store"], "->", data["total"])
`,
      expected_output: `Blue Bottle Coffee -> 12.5`,
      hints: [
        "json.loads(text) turns the JSON string into a dict.",
        "Access fields with square brackets: data['store'].",
        "12.50 prints as 12.5 because trailing zeros are dropped from a float."
      ],
      step_throughs: [
        {
          title: "specify fields → constrain output → parse → validate",
          steps: [
            { label: "Name fields and types", detail: "Tell the model the exact keys and their types so the shape is predictable.", code: 'store (string), total (number), item_count (integer)' },
            { label: "Constrain the output", detail: "Demand pure JSON so you don't have to strip a friendly preamble before parsing.", code: '"Reply with only the JSON, no other text."' },
            { label: "Parse the reply", detail: "json.loads turns the JSON string into a Python dict you can index by key.", code: 'data = json.loads(response.content[0].text)' },
            { label: "Validate, then use", detail: "Guard against missing keys or wrong types before relying on the values.", code: 'total = float(data["total"])  # inside try/except' }
          ]
        }
      ],
      worked_examples: [
        {
          number: 1, difficulty: "easy",
          prompt: 'Parse \'{"store": "Philz", "total": 8.25}\' and print the total.',
          steps: [
            "Call json.loads on the string to get a dict.",
            'Index the dict by key: data["total"].',
            "The value is the number 8.25."
          ],
          output: "8.25"
        },
        {
          number: 2, difficulty: "medium",
          prompt: 'You loop over four replies and want the sum of all valid totals: \'{"total": 12.50}\', \'{"total": 8.25}\', \'oops not json\', \'{"store": "X"}\'. What is the sum and why?',
          steps: [
            "Reply 1 parses; total 12.50 adds in.",
            "Reply 2 parses; total 8.25 adds in (running sum 20.75).",
            "Reply 3 is not valid JSON, so json.loads raises JSONDecodeError — skip it.",
            'Reply 4 parses but has no "total" key, so indexing raises KeyError — skip it. Final sum 20.75.'
          ],
          output: "20.75"
        }
      ],
      comparison_tables: [
        {
          title: "free-form prose vs structured JSON output",
          columns: ["Property", "Free-form prose", "Structured JSON"],
          rows: [
            { cells: ["Shape", "A paragraph", "Known keys and types"] },
            { cells: ["Index a field in code", "No — must parse text", "Yes — data['total']"], highlight: true },
            { cells: ["Store in a database", "Awkward", "Drops into a row"] },
            { cells: ["Sum / branch / compute", "Not directly", "Directly"] },
            { cells: ["Good for", "Human reading", "Program processing"] }
          ]
        }
      ],
      drag_to_bins: [
        {
          title: "model job vs your code's job",
          bins: [
            { id: "model", label: "Model handles (perception)" },
            { id: "code", label: "Your code handles (logic)" }
          ],
          items: [
            { id: "i1", text: "Reading the store name off the receipt", bin: "model" },
            { id: "i2", text: "Recognizing the total in the image", bin: "model" },
            { id: "i3", text: "Summing 500 totals", bin: "code" },
            { id: "i4", text: "json.loads on the reply", bin: "code" },
            { id: "i5", text: "Checking that required keys exist", bin: "code" },
            { id: "i6", text: "Describing what objects are in the photo", bin: "model" }
          ]
        }
      ],
      reflections: [
        {
          prompt: "In your own words: why should you treat the model's JSON like untrusted input and wrap json.loads in a try/except?",
          sampleAnswer: "The model generates its JSON by prediction, so it is not guaranteed to be perfect. It might omit a field, return a string where you expected a number, or occasionally wrap the JSON in stray text. If you parse it naively, any of those breaks your program with a crash. Wrapping json.loads in a try/except and checking for required keys turns a rare bad response into a handled miss instead of a 2am outage."
        }
      ],
      challenge_title: "Parse safely and total the receipts",
      challenge_description: "You're given a list of JSON reply strings, one per receipt. Parse each safely (skip any that fail or lack a 'total'), and print the sum of all totals rounded to 2 decimals.",
      challenge_starter_code: `import json

replies = [
    '{"store": "Blue Bottle", "total": 12.50}',
    '{"store": "Philz", "total": 8.25}',
    'oops not json',
    '{"store": "Sightglass"}',
]

# TODO: sum every valid 'total', skipping bad or incomplete entries.
# Print the total rounded to 2 decimals.
`,
      challenge_solution_code: `import json

replies = [
    '{"store": "Blue Bottle", "total": 12.50}',
    '{"store": "Philz", "total": 8.25}',
    'oops not json',
    '{"store": "Sightglass"}',
]

total = 0.0
for reply in replies:
    try:
        data = json.loads(reply)
        total += float(data["total"])
    except (json.JSONDecodeError, KeyError, ValueError):
        continue

print(round(total, 2))
`,
      challenge_test_cases: [
        {
          input: "4 replies: two valid, one bad JSON, one missing 'total'",
          expected_output: "20.75",
          description: "12.50 + 8.25 = 20.75; the bad and incomplete entries are skipped."
        }
      ]
    }
  ]
};
