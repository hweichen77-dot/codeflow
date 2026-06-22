import React from "react";
import { trace } from "@/components/lesson/trace/theme";

/**
 * ComparisonTable — GfG-style approach comparison.
 * props:
 *   title, columns: string[], rows: [{ cells: string[], highlight?: bool }]
 */
export default function ComparisonTable({ title, columns = [], rows = [] }) {
  return (
    <div className="my-7" style={{ border: `1px solid ${trace.border}`, background: trace.raised }}>
      {title && (
        <div className="px-5 py-3" style={{ borderBottom: `1px solid ${trace.border}` }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: trace.warn }}>TABLE — {title}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className="text-left font-mono text-xs tracking-widest uppercase px-4 py-3"
                  style={{ color: trace.dim, borderBottom: `1px solid ${trace.border}`, background: trace.surface, whiteSpace: "nowrap" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={{ background: r.highlight ? trace.limeFaint : "transparent" }}>
                {r.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="font-display text-sm px-4 py-3 align-top"
                    style={{
                      color: ci === 0 ? trace.text : trace.dim,
                      fontWeight: ci === 0 ? 600 : 400,
                      borderBottom: `1px solid ${trace.border}`,
                      borderLeft: r.highlight && ci === 0 ? `2px solid ${trace.lime}` : "none",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
