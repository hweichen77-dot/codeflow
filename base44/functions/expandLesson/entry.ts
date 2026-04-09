import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, lessonTitle, concept, explanation, starterCode } = await req.json();

    const prompt = `You are an expert programming educator writing a rich, detailed zyBooks-style lesson.

LESSON TITLE: "${lessonTitle}"
CONCEPT: "${concept || lessonTitle}"
CURRENT EXPLANATION:
${explanation || "(none yet)"}
STARTER CODE:
${starterCode || "(none)"}

Write a COMPREHENSIVE, detailed lesson explanation in Markdown that includes:

1. **A clear intro paragraph** explaining WHY this concept matters and what problem it solves
2. **Core concept section** with a thorough but accessible explanation
3. **2-3 concrete code examples** (use \`\`\`js ... \`\`\` blocks) showing progressively complex usage
4. **A "How It Works" breakdown** using numbered steps or bullet points
5. **Common mistakes** section showing what NOT to do (with \`\`\`js bad example\`\`\`) and why
6. **A real-world analogy** that makes the concept click
7. **Quick reference** summary at the bottom with key syntax

Write at a college intro-CS level. Use simple language but don't skip depth. Format it exactly as Markdown.
The explanation should be 600-900 words. Do NOT use emoji in the explanation.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          explanation: { type: "string" },
          quiz_questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correct_index: { type: "number" },
                explanation: { type: "string" }
              }
            }
          },
          participation_activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                activity_title: { type: "string" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      type: { type: "string" },
                      correct_answer: { type: "string" },
                      explanation: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Also update the lesson in the database
    if (lessonId) {
      await base44.asServiceRole.entities.Lesson.update(lessonId, {
        explanation: result.explanation,
        ...(result.quiz_questions?.length > 0 ? { quiz_questions: result.quiz_questions } : {}),
        ...(result.participation_activities?.length > 0 ? { participation_activities: result.participation_activities } : {}),
      });
    }

    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});