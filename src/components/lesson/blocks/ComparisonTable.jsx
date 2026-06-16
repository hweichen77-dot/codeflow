import React from "react";

/**
 * ComparisonTable — GfG-style approach comparison.
 * props:
 *   title, columns: string[], rows: [{ cells: string[], highlight?: bool }]
 */
export default function ComparisonTable({ title, columns = [], rows = [] }) {
  return (
    <div className="my-7" style={{ border: "1px solid #e4e4e7", background: "#ffffff" }}>
      {title && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #ececef" }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b45309" }}>TABLE — {title}</span>
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
                  style={{ color: "#52525b", borderBottom: "1px solid #e4e4e7", background: "#fafafa", whiteSpace: "nowrap" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={{ background: r.highlight ? "#4d7c0f0d" : "transparent" }}>
                {r.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="font-display text-sm px-4 py-3 align-top"
                    style={{
                      color: ci === 0 ? "#18181b" : "#3f3f46",
                      fontWeight: ci === 0 ? 600 : 400,
                      borderBottom: "1px solid #e4e4e7",
                      borderLeft: r.highlight && ci === 0 ? "2px solid #4d7c0f" : "none",
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
