import { useId, useState } from "react";
import { CoordinateGrid, GridLabels, unitRange } from "../ConceptDiagram";
import { liquidRangeStyle } from "../../rangeStyle";
import "../../styles/trigonometry.css";

const axes = {
  x: { values: unitRange(-4, 4), labels: [-4, -2, 2, 4], project: (x: number) => 220 + 45 * x },
  y: { values: unitRange(-4, 4), labels: [-4, -2, 2, 4], project: (y: number) => 220 - 45 * y },
};
const rounded = (n: number) => Number(n.toFixed(3));

export function ComplexPlaneDiagram({ mode }: { mode: "preview" | "full" }) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const id = useId();
  const magnitude = Math.hypot(a, b);
  return <figure className={`systems-diagram trig-diagram systems-diagram--${mode}`} aria-label="Interactive complex plane">
    <div className="trig-stage">
      <svg viewBox="0 0 440 440" role="img" aria-label={`z at (${a}, ${b}); conjugate at (${a}, ${-b})`}>
        <CoordinateGrid {...axes} drawAxes />
        <path d={`M220 220 L${axes.x.project(a)} ${axes.y.project(b)}`} stroke="var(--accent)" strokeWidth="3" />
        <path d={`M220 220 L${axes.x.project(a)} ${axes.y.project(-b)}`} stroke="var(--sage-ink)" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx={axes.x.project(a)} cy={axes.y.project(b)} r="6" fill="var(--accent)" />
        <circle cx={axes.x.project(a)} cy={axes.y.project(-b)} r="9" fill="none" stroke="var(--sage-ink)" strokeWidth="2" />
        <GridLabels {...axes} gap={16} />
        <text x="408" y="206" fill="currentColor" fontSize="15">Re</text>
        <text x="230" y="25" fill="currentColor" fontSize="15">Im</text>
      </svg>
      <p>Solid point: z · Ring and dashed line: conjugate</p>
    </div>
    {([{ label: "Real part", value: a, set: setA }, { label: "Imaginary part", value: b, set: setB }]).map((control, index) =>
      <label className="function-input-control" htmlFor={id + index} key={control.label}>
        <span>{control.label}: {control.value}</span>
        <input id={id + index} className="liquid-range" type="range" min="-4" max="4" step=".25" value={control.value} style={liquidRangeStyle(control.value, -4, 4)} onChange={event => control.set(Number(event.target.value))} />
      </label>
    )}
    <output className="trig-readout" aria-live="polite">
      z = {a} {b < 0 ? "−" : "+"} {Math.abs(b)}i · |z| = {rounded(magnitude)} · Arg z = {magnitude === 0 ? "undefined" : `${rounded(Math.atan2(b, a))} rad`}
    </output>
    <figcaption>Conjugation reflects across the real axis and preserves distance from zero. The principal argument uses (−π, π]; zero has no argument.</figcaption>
  </figure>;
}
