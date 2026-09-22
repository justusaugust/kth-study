import { useId, useState } from "react";
import { CoordinateGrid, GridLabels, unitRange } from "../ConceptDiagram";
import { liquidRangeStyle } from "../../rangeStyle";
import "../../styles/trigonometry.css";

const axes = {
  x: { values: unitRange(-4, 4), labels: [-4, -2, 2, 4], project: (x: number) => 220 + 45 * x },
  y: { values: unitRange(-4, 4), labels: [-4, -2, 2, 4], project: (y: number) => 220 - 45 * y },
};
const point = (x: number, y: number) => `${axes.x.project(x)},${axes.y.project(y)}`;
const display = (n: number) => Number(n.toFixed(3));

export function InverseFunctionDiagram({ mode }: { mode: "preview" | "full" }) {
  const [negative, setNegative] = useState(false);
  const [distance, setDistance] = useState(1.5);
  const id = useId();
  const sign = negative ? -1 : 1;
  const x = sign * distance;
  const y = x * x;
  const samples = unitRange(0, 2, .025);
  return <figure className={`systems-diagram trig-diagram systems-diagram--${mode}`} aria-label="A function and its inverse">
    <div className="trig-stage">
      <svg viewBox="0 0 440 440" role="img" aria-label={`Square point (${display(x)}, ${display(y)}) reflects to inverse point (${display(y)}, ${display(x)})`}>
        <CoordinateGrid {...axes} drawAxes />
        <line x1="40" y1="400" x2="400" y2="40" stroke="var(--ink-secondary)" strokeDasharray="3 5" />
        <polyline points={samples.map(t => point(sign * t, t * t)).join(" ")} fill="none" stroke="var(--accent)" strokeWidth="3" />
        <polyline points={samples.map(t => point(t * t, sign * t)).join(" ")} fill="none" stroke="var(--sage-ink)" strokeWidth="3" strokeDasharray="7 4" />
        <line x1={axes.x.project(x)} y1={axes.y.project(y)} x2={axes.x.project(y)} y2={axes.y.project(x)} stroke="var(--ink-secondary)" strokeDasharray="4 4" />
        <circle cx={axes.x.project(x)} cy={axes.y.project(y)} r="6" fill="var(--accent)" />
        <circle cx={axes.x.project(y)} cy={axes.y.project(x)} r="6" fill="var(--sage-ink)" />
        <GridLabels {...axes} gap={16} />
      </svg>
      <p>Solid: restricted square · Dashed: inverse · Dotted: y = x</p>
    </div>
    <div className="diagram-choice-row" aria-label="Original domain">
      <button type="button" aria-pressed={!negative} onClick={() => setNegative(false)}>x ≥ 0</button>
      <button type="button" aria-pressed={negative} onClick={() => setNegative(true)}>x ≤ 0</button>
    </div>
    <label className="function-input-control" htmlFor={id}><span>Distance from zero</span>
      <input id={id} className="liquid-range" type="range" min="0" max="2" step=".05" value={distance} style={liquidRangeStyle(distance, 0, 2)} onChange={event => setDistance(Number(event.target.value))} />
    </label>
    <output className="trig-readout" aria-live="polite">({display(x)}, {display(y)}) ↔ ({display(y)}, {display(x)})</output>
    <figcaption>The original domain determines which square-root branch undoes the function.</figcaption>
  </figure>;
}
