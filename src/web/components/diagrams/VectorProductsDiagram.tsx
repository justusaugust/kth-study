import { useId, useState } from "react";
import { CoordinateGrid, GridLabels, unitRange } from "../ConceptDiagram";
import { liquidRangeStyle } from "../../rangeStyle";

const axes = {
  x: { values: unitRange(-5, 5, 1), labels: [-4, -2, 2, 4], project: (x: number) => 220 + 36 * x },
  y: { values: unitRange(-5, 5, 1), labels: [-4, -2, 2, 4], project: (y: number) => 220 - 36 * y },
};

export function VectorProductsDiagram({ mode }: { mode: "preview" | "full" }) {
  const [b, setB] = useState([1, 2]);
  const id = useId();
  const z = 2 * b[1];

  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label="Interactive vector products">
    <svg viewBox="0 0 440 440" role="img" aria-label={`Equal-scale coordinate plane. a = (2, 0), b = (${b.join(", ")}). Shaded parallelogram area ${Math.abs(z)}. Cross product z component ${z}.`}>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>
      <CoordinateGrid {...axes} drawAxes />
      <GridLabels {...axes} gap={16} />
      <polygon data-area={Math.abs(z)} points={[[0, 0], [2, 0], [2 + b[0], b[1]], b].map(([x, y]) => `${axes.x.project(x)},${axes.y.project(y)}`).join(" ")} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
      <path d={`M${axes.x.project(b[0])} ${axes.y.project(b[1])} V220`} fill="none" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="3 4" />
      {[[2, 0], b].map(([x, y], index) => x === 0 && y === 0
        ? <circle key={index} data-vector="b" cx="220" cy="220" r="5" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
        : <path key={index} data-vector={index === 0 ? "a" : "b"} d={`M220 220 L${axes.x.project(x)} ${axes.y.project(y)}`} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={index === 0 ? undefined : "7 4"} markerEnd={`url(#${id}-arrow)`} />)}
      <g fill="currentColor" fontSize="16"><text x="411" y="214">x</text><text x="231" y="28">y</text></g>
    </svg>
    <p>a: solid · b: dashed · shaded region: parallelogram</p>
    {b.map((value, index) => <label key={index} className="function-input-control" htmlFor={`${id}-${index}`}>
      <span>b{index === 0 ? "ₓ" : "ᵧ"} = {value}</span>
      <input id={`${id}-${index}`} aria-label={`Vector b ${index === 0 ? "x" : "y"} component`} className="liquid-range" type="range" min="-3" max="3" step="1" value={value} style={liquidRangeStyle(value, -3, 3)} onChange={event => {
        const next = Number(event.target.value);
        setB(current => current.map((component, i) => i === index ? next : component));
      }} />
    </label>)}
    <output aria-live="polite">
      a = (2, 0) · b = ({b.join(", ")})<br />
      Scalar: a · b = 2bₓ = {2 * b[0]}<br />
      Vector: a × b = (0, 0, {z}) · signed z = {z}<br />
      Parallelogram area = |2bᵧ| = {Math.abs(z)}
    </output>
    <figcaption>Move b horizontally to change the dot product; move it vertically to change the area. For the cross product, embed both vectors in the xy-plane with z = 0: positive z points out of the page, negative z into it. Parallel vectors give zero area. A zero vector appears as a point with no direction.</figcaption>
  </figure>;
}
