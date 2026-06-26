import React from "react";
import { ConceptCallout, KeyTerms, ConceptDiagram } from "./ConceptCallout";
import InlineQuiz from "./InlineQuiz";
import ConceptVideo from "./ConceptVideo";

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
      {videoId && (
        <ConceptVideo
          youtubeId={videoId}
          title={lesson.video_title}
          caption={lesson.video_caption}
        />
      )}

      {keyTerms.length > 0 && <KeyTerms terms={keyTerms} />}

      {callouts.filter(c => c.position === "before").map((c, i) => (
        <ConceptCallout key={`before-${i}`} type={c.type} title={c.title}>
          {c.content}
        </ConceptCallout>
      ))}

      {callouts.filter(c => c.position !== "before").map((c, i) => (
        <ConceptCallout key={`after-${i}`} type={c.type} title={c.title}>
          {c.content}
        </ConceptCallout>
      ))}

      {diagram?.steps?.length > 0 && (
        <ConceptDiagram steps={diagram.steps} title={diagram.title} />
      )}

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