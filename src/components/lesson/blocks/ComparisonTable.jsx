import React from "react";

/**
 * ComparisonTable — GfG-style approach comparison.
 * props:
 *   title, columns: string[], rows: [{ cells: string[], highlight?: bool }]
 */
export default function ComparisonTable({ title, columns = [], rows = [] }) {
  return (
    <div className="my-7" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
      {title && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#f0c000" }}>TABLE — {title}</span>
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
                  style={{ color: "#888", borderBottom: "1px solid #1f1f1f", background: "#0a0a0a", whiteSpace: "nowrap" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={{ background: r.highlight ? "#b8ff0008" : "transparent" }}>
                {r.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="font-display text-sm px-4 py-3 align-top"
                    style={{
                      color: ci === 0 ? "#e8e8e8" : "#aaa",
                      fontWeight: ci === 0 ? 600 : 400,
                      borderBottom: "1px solid #151515",
                      borderLeft: r.highlight && ci === 0 ? "2px solid #b8ff00" : "none",
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
