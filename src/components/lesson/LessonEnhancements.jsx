import React from "react";
import { ConceptCallout, KeyTerms, ConceptDiagram } from "./ConceptCallout";
import InlineQuiz from "./InlineQuiz";
import ConceptVideo from "./ConceptVideo";

/**
 * Renders all light-themed lesson enhancements that sit INSIDE the white reading panel:
 * - Concept video embed
 * - Key terms glossary
 * - Concept flow diagram
 * - Callout boxes (tips, warnings, analogies, insights)
 * - Inline mid-lesson check quizzes
 */
export default function LessonEnhancements({ lesson }) {
  if (!lesson) return null;

  const callouts = lesson.callouts || [];
  const keyTerms = lesson.key_terms || [];
  const diagram = lesson.concept_diagram;
  const inlineQuizzes = lesson.inline_quizzes || [];
  const videoId = lesson.video_id;

  const hasAnything = videoId || keyTerms.length || diagram || callouts.length || inlineQuizzes.length;
  if (!hasAnything) return null;

  return (
    <div className="space-y-0">
      {/* Video embed */}
      {videoId && (
        <ConceptVideo
          youtubeId={videoId}
          title={lesson.video_title}
          caption={lesson.video_caption}
        />
      )}

      {/* Key terms */}
      {keyTerms.length > 0 && <KeyTerms terms={keyTerms} />}

      {/* Callouts before explanation (usually tips/warnings) */}
      {callouts.filter(c => c.position === "before").map((c, i) => (
        <ConceptCallout key={`before-${i}`} type={c.type} title={c.title}>
          {c.content}
        </ConceptCallout>
      ))}

      {/* Callouts after explanation (analogies, insights) */}
      {callouts.filter(c => c.position !== "before").map((c, i) => (
        <ConceptCallout key={`after-${i}`} type={c.type} title={c.title}>
          {c.content}
        </ConceptCallout>
      ))}

      {/* Flow diagram */}
      {diagram?.steps?.length > 0 && (
        <ConceptDiagram steps={diagram.steps} title={diagram.title} />
      )}

      {/* Inline check-your-understanding quizzes */}
      {inlineQuizzes.map((q, i) => (
        <InlineQuiz
          key={i}
          question={q.question}
          options={q.options}
          correctIndex={q.correct_index}
          explanation={q.explanation}
        />
      ))}
    </div>
  );
}