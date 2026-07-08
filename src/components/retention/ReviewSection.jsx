import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getReviewItems, markReviewed } from "@/lib/retention";
import { getLessonPath } from "@/content";
import { Eyebrow, KIT, Card } from "@/components/ui/kit";
import { Stagger, StaggerItem } from "@/lib/motion";

export default function ReviewSection({ lessons = [], progress = [] }) {
  const items = getReviewItems(lessons, progress, 3);
  if (items.length === 0) return null;

  return (
    <section>
      <Eyebrow color={KIT.amber} className="mb-1.5">Review</Eyebrow>
      <p className="mb-4 text-sm" style={{ color: KIT.dim }}>
        Reinforce what you learned earlier.
      </p>

      <Stagger as="div" className="flex flex-col gap-3">
        {items.map((lesson) => (
          <StaggerItem key={lesson.id}>
            <Card
              as={Link}
              to={getLessonPath(lesson.id) || "#"}
              onClick={() => markReviewed(lesson.id)}
              accent={KIT.amber}
              className="group flex items-center justify-between gap-4 p-4 no-underline"
            >
              <span className="text-sm font-semibold" style={{ color: KIT.text }}>
                {lesson.title}
              </span>
              <span
                className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: KIT.amber, fontFamily: KIT.mono }}
              >
                Review
                <ArrowRight size={13} />
              </span>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
