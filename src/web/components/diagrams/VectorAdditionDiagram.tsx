import { useId, useState } from "react";
import { CoordinateGrid, GridLabels, unitRange } from "../ConceptDiagram";
import { liquidRangeStyle } from "../../rangeStyle";

const axes = {
  x: { values: unitRange(-5, 5, 1), labels: [-4, -2, 2, 4], project: (x: number) => 220 + 36 * x },
  y: { values: unitRange(-5, 5, 1), labels: [-4, -2, 2, 4], project: (y: number) => 220 - 36 * y },
};

// A vector's name sits beside its midpoint, offset along the normal; `side`
// keeps a and b on the outside of the triangle and the sum on the inside.
// A zero vector is a point, so its name sits diagonally off that point.
function labelPosition(start: number[], end: number[], side: 1 | -1) {
  const [dx, dy] = [end[0] - start[0], end[1] - start[1]];
  const length = Math.hypot(dx, dy);
  const [nx, ny] = length ? [(-dy / length) * side, (dx / length) * side] : [0.7, 0.7];
  const clamp = (value: number) => Math.min(416, Math.max(24, value));
  return {
    x: clamp(axes.x.project((start[0] + end[0]) / 2 + nx * 0.6)),
    y: clamp(axes.y.project((start[1] + end[1]) / 2 + ny * 0.6)),
  };
}

export function VectorAdditionDiagram({ mode }: { mode: "preview" | "full" }) {
  const [b, setB] = useState([1, 2]);
  const id = useId();
  const sum = [2 + b[0], 1 + b[1]];
  const vectors = [
    { name: "sum", label: "a + b", side: 1 as const, start: [0, 0], end: sum, width: 5, dash: undefined },
    { name: "a", label: "a", side: -1 as const, start: [0, 0], end: [2, 1], width: 2, dash: undefined },
    { name: "b", label: "b", side: -1 as const, start: [2, 1], end: sum, width: 2, dash: "7 4" },
  ];

  return <figure className={`systems-diagram systems-diagram--${mode} vector-addition`} aria-label="Interactive vector addition">
    <div className="vector-addition__stage">
      <svg viewBox="0 0 440 440" role="img" aria-label={`Equal-scale coordinate plane. a goes from (0, 0) to (2, 1). b goes from (2, 1) to (${sum.join(", ")}). The sum goes from (0, 0) to (${sum.join(", ")}). Zero vectors are points, with no direction.`}>
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
          </marker>
        </defs>
        <CoordinateGrid {...axes} drawAxes />
        <GridLabels {...axes} gap={16} />
        {vectors.map(({ name, start, end, width, dash }) => start[0] === end[0] && start[1] === end[1]
          ? <circle key={name} data-vector={name} cx={axes.x.project(end[0])} cy={axes.y.project(end[1])} r="5" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
          : <path key={name} data-vector={name} d={`M${axes.x.project(start[0])} ${axes.y.project(start[1])} L${axes.x.project(end[0])} ${axes.y.project(end[1])}`} fill="none" stroke="currentColor" strokeWidth={width} strokeDasharray={dash} markerEnd={`url(#${id}-arrow)`} />)}
        <g className="vector-addition__names" aria-hidden="true">
          {vectors.map(({ name, label, side, start, end }) => {
            const position = labelPosition(start, end, side);
            return <text key={name} x={position.x} y={position.y}>{label}</text>;
          })}
        </g>
        <g className="vector-addition__axis-names" fill="currentColor"><text x="411" y="214">x</text><text x="231" y="28">y</text></g>
      </svg>
    </div>
    <p className="vector-addition__legend">a: thin solid · b: dashed · a + b: thick solid</p>
    <output className="function-readout" aria-live="polite">
      <span className="function-facts">
        <span>a = (2, 1)</span>
        <span>b = ({b.join(", ")})</span>
        <span className="vector-addition__sum">a + b = ({sum.join(", ")})</span>
      </span>
    </output>
    <div className="digital-sliders">
      {b.map((value, index) => <label key={index} className="function-input-control" htmlFor={`${id}-${index}`}>
        <span>{index === 0 ? "Horizontal (bₓ)" : "Vertical (bᵧ)"}</span>
        <span className="vector-addition__value">{value}</span>
        <input id={`${id}-${index}`} aria-label={`Vector b ${index === 0 ? "x" : "y"} component`} className="liquid-range" type="range" min="-2" max="2" step="1" value={value} style={liquidRangeStyle(value, -2, 2)} onChange={event => {
          const next = Number(event.target.value);
          setB(current => current.map((component, i) => i === index ? next : component));
        }} />
      </label>)}
    </div>
    <figcaption>Place the tail of b at the tip of a without changing b’s direction or length. The sum joins the starting point to the final tip: add x to x and y to y. Both axes use the same scale. A zero vector appears as a point because it has no direction.</figcaption>
  </figure>;
}
