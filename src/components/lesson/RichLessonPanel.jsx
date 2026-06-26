import React from "react";
import LessonExplanation from "./LessonExplanation";

export default function RichLessonPanel({ lesson }) {
  if (!lesson) return null;

  return (
    <LessonExplanation explanation={lesson.explanation || ""} concept={null} />
  );
}