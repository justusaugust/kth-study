import { useState } from "react";
import "../../styles/karnaugh.css";

const columns = [0, 1, 3, 2];
const ones = [0, 2, 3, 4, 6, 7];

export function analyseKarnaughGroup(selected: number[]) {
  if (!selected.length) return "Select cells to make one group of 1s.";
  if (selected.some((cell) => !ones.includes(cell))) return "Invalid group: a group of 1s cannot include a 0.";
  const varying = selected.reduce((bits, cell) => bits | (cell ^ selected[0]), 0);
  const variableCount = [4, 2, 1].filter((bit) => varying & bit).length;
  // A complete Boolean subcube is exactly a power-of-two rectangle in Gray-code order.
  if (selected.length !== 2 ** variableCount) return "Invalid group: use a complete rectangle of 1, 2, 4 or 8 cells, including across an edge. Diagonals and L shapes do not count.";
  const term = ["A", "B", "C"].flatMap((name, index) => {
    const bit = 4 >> index;
    return varying & bit ? [] : [selected[0] & bit ? name : `¬${name}`];
  }).join("·") || "1";
  return `Valid ${selected.length}-cell group → ${term}. ${variableCount} changing variable${variableCount === 1 ? "" : "s"} drop out.`;
}

export function KarnaughDiagram({ mode }: { mode: "preview" | "full" }) {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <figure className={`systems-diagram digital-diagram karnaugh-diagram visual-topic--systems systems-diagram--${mode}`} aria-label="Interactive three-variable Karnaugh map">
      <p>Group the 1s. Keep the variables that stay constant.</p>
      <table className="karnaugh-map">
        <caption>Rows: A · Columns: BC in Gray-code order</caption>
        <thead><tr><th scope="col">A ∖ BC</th>{columns.map((bc) => <th scope="col" key={bc}>{bc.toString(2).padStart(2, "0")}</th>)}</tr></thead>
        <tbody>{[0, 1].map((a) => <tr key={a}>
          <th scope="row">{a}</th>
          {columns.map((bc) => {
            const cell = a * 4 + bc;
            const value = Number(ones.includes(cell));
            const pressed = selected.includes(cell);
            return <td key={cell}><button type="button" aria-label={`m${cell}, A ${a}, B ${bc >> 1}, C ${bc & 1}, output ${value}`} aria-pressed={pressed} onClick={() => setSelected((current) => pressed ? current.filter((item) => item !== cell) : [...current, cell])}>
              <strong>{value}</strong><small>m{cell}{pressed ? " ✓" : ""}</small>
            </button></td>;
          })}
        </tr>)}</tbody>
      </table>
      <p className="karnaugh-edge">↔ The first and last columns touch: 00 and 10 differ only in B.</p>
      <div className="diagram-choice-row">
        <button type="button" onClick={() => setSelected([0, 2, 4, 6])}>Show wrap-around group</button>
        <button type="button" onClick={() => setSelected([])}>Clear group</button>
      </div>
      <p role="status">{analyseKarnaughGroup(selected)}</p>
      <figcaption>This checks one group, not a whole simplification. Cover every 1 at least once; groups may overlap. Try the four edge cells for ¬C, then m2, m3, m6 and m7 for B. Together: F = B + ¬C.</figcaption>
    </figure>
  );
}
