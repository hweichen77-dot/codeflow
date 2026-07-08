import React from "react";
import StepThrough from "./blocks/StepThrough";
import InteractiveTokenizer from "./blocks/InteractiveTokenizer";
import DragToBin from "./blocks/DragToBin";
import WorkedExample from "./blocks/WorkedExample";
import ComparisonTable from "./blocks/ComparisonTable";
import Reflection from "./blocks/Reflection";

const TOOL_REGISTRY = {
  tokenizer: InteractiveTokenizer,
};

function Label({ children, accent = "#9A6A1F" }) {
  return (
    <div className="font-sans text-xs tracking-widest uppercase mt-10 mb-2" style={{ color: "#FFFFFF" }}>
      <span style={{ color: accent }}>//</span> {children}
    </div>
  );
}

export default function LessonBlocks({ lesson, onActivity }) {
  if (!lesson) return null;
  const { tools, step_throughs, worked_examples, comparison_tables, drag_to_bins, reflections } = lesson;

  const has =
    tools?.length || step_throughs?.length || worked_examples?.length ||
    comparison_tables?.length || drag_to_bins?.length || reflections?.length;
  if (!has) return null;

  return (
    <div>
      {tools?.map((t, i) => {
        const Tool = TOOL_REGISTRY[t.type];
        if (!Tool) return null;
        return (
          <div key={`tool-${i}`}>
            <Label>Try the tool</Label>
            <Tool {...(t.props || {})} />
          </div>
        );
      })}

      {step_throughs?.map((s, i) => (
        <div key={`step-${i}`}>
          <Label accent="#C2643C">Watch it happen</Label>
          <StepThrough title={s.title} steps={s.steps} onComplete={() => onActivity?.("step")} />
        </div>
      ))}

      {worked_examples?.length > 0 && (
        <>
          <Label>Worked examples</Label>
          {worked_examples.map((w, i) => (
            <WorkedExample key={`we-${i}`} {...w} number={w.number ?? i + 1} />
          ))}
        </>
      )}

      {comparison_tables?.map((c, i) => (
        <div key={`cmp-${i}`}>
          <Label accent="#b45309">Compare the approaches</Label>
          <ComparisonTable title={c.title} columns={c.columns} rows={c.rows} />
        </div>
      ))}

      {drag_to_bins?.map((d, i) => (
        <div key={`dtb-${i}`}>
          <Label accent="#9333ea">Sort it</Label>
          <DragToBin title={d.title} bins={d.bins} items={d.items} onComplete={() => onActivity?.("sort")} />
        </div>
      ))}

      {reflections?.map((r, i) => (
        <div key={`ref-${i}`}>
          <Label accent="#C2643C">Reflect</Label>
          <Reflection prompt={r.prompt} sampleAnswer={r.sampleAnswer} onComplete={() => onActivity?.("reflect")} />
        </div>
      ))}
    </div>
  );
}
