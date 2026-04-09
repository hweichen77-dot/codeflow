import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return Response.json({ error: 'projectId required' }, { status: 400 });
    }

    const projects = await base44.asServiceRole.entities.Project.filter({ id: projectId });
    const project = projects[0];
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch the lessons for this project to understand what they cover
    const lessons = await base44.asServiceRole.entities.Lesson.filter({ project_id: projectId }, "order");
    const lessonSummary = lessons.map((l, i) => `  Lesson ${i+1}: ${l.title}${l.concept ? ` (${l.concept})` : ''}`).join('\n');

    const prompt = `You are an expert AI/ML educator writing course catalog content for a hands-on coding platform.

PROJECT TITLE: "${project.title}"
CATEGORY: ${project.category}
DIFFICULTY: ${project.difficulty}
CURRENT DESCRIPTION: "${project.description}"
LESSONS IN THIS PROJECT:
${lessonSummary || '(no lessons yet)'}

Rewrite the project description to be CRYSTAL CLEAR, highly motivating, and beginner-friendly. The description must:
1. Open with exactly what the student will BUILD by the end (concrete, tangible outcome)
2. Explain WHY this project matters in AI/real-world terms (1-2 sentences)
3. Name 3-4 specific skills or concepts they will learn
4. Be encouraging and accessible — assume zero prior experience in this topic
5. Be 2-4 sentences total — punchy, not a wall of text

Also generate an array of clear, descriptive tags (4-6 tags) that accurately describe the skills and technologies covered.

Keep the description under 200 words. Write like a world-class tech educator, not a marketing brochure.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: "object",
        properties: {
          description: { type: "string" },
          tags: { type: "array", items: { type: "string" } }
        }
      }
    });

    await base44.asServiceRole.entities.Project.update(projectId, {
      description: result.description,
      ...(result.tags?.length > 0 ? { tags: result.tags } : {}),
    });

    return Response.json({ success: true, title: project.title });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});