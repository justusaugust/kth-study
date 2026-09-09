import { useId, useState } from "react";
import { CoordinateGrid, GridLabels, unitRange } from "../ConceptDiagram";
import { liquidRangeStyle } from "../../rangeStyle";
import "../../styles/trigonometry.css";

const circleAxes = {
  x: { values: unitRange(-1.25, 1.25, .25), labels: [-1, 1], project: (x: number) => 160 + 108 * x },
  y: { values: unitRange(-1.25, 1.25, .25), labels: [-1, 1], project: (y: number) => 160 - 108 * y },
};
const waveAxes = {
  x: { values: unitRange(0, 2, .25), project: (x: number) => 40 + 220 * x },
  y: { values: unitRange(-1, 1, .5), labels: [-1, 1], project: (y: number) => 110 - 75 * y },
};
const wave = (f: (angle: number) => number) => unitRange(0, 2, .01)
  .map((x) => `${waveAxes.x.project(x)},${waveAxes.y.project(f(x * Math.PI))}`).join(" ");
const sineWave = wave(Math.sin);
const cosineWave = wave(Math.cos);
const number = (x: number) => Math.abs(x) < .0005 ? "0" : String(Number(x.toFixed(3)));

export function TrigonometryDiagram({ mode }: { mode: "preview" | "full" }) {
  const [degrees, setDegrees] = useState(30);
  const controlId = useId();
  const angle = degrees * Math.PI / 180;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const cx = circleAxes.x.project(cosine);
  const cy = circleAxes.y.project(sine);
  const waveX = waveAxes.x.project(degrees / 180);
  return <figure className={`systems-diagram trig-diagram systems-diagram--${mode}`} aria-label="Interactive unit circle and trigonometric graphs">
    <div className="trig-plots">
      <div className="trig-stage">
        <svg viewBox="0 0 320 320" role="img" aria-label={`Unit circle at ${degrees} degrees: cosine ${number(cosine)}, sine ${number(sine)}`}>
          <CoordinateGrid {...circleAxes} drawAxes />
          <circle cx="160" cy="160" r="108" fill="none" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          <path d={`M160 160 L${cx} ${cy}`} fill="none" stroke="var(--ink-secondary)" strokeWidth="2" />
          <path d={`M160 160 H${cx}`} stroke="var(--sage-ink)" strokeWidth="4" />
          <path d={`M${cx} 160 V${cy}`} stroke="var(--accent)" strokeWidth="4" />
          <circle cx={cx} cy={cy} r="5" fill="var(--ink)" />
          <GridLabels {...circleAxes} gap={18} />
          <g fill="var(--ink-secondary)" fontSize="13"><text x="298" y="150">x</text><text x="171" y="22">y</text></g>
        </svg>
      </div>
      <div className="trig-stage">
        <svg viewBox="0 0 520 225" role="img" aria-label="Sine is the solid curve; cosine is dashed. Horizontal axis is the angle in radians from zero to two pi.">
          <CoordinateGrid {...waveAxes} drawAxes />
          <polyline points={sineWave} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          <polyline points={cosineWave} fill="none" stroke="var(--sage-ink)" strokeWidth="2.5" strokeDasharray="6 4" />
          <line x1={waveX} x2={waveX} y1="30" y2="190" stroke="var(--ink-tertiary)" strokeDasharray="3 4" />
          <circle cx={waveX} cy={waveAxes.y.project(sine)} r="4" fill="var(--accent)" />
          <circle cx={waveX} cy={waveAxes.y.project(cosine)} r="4" fill="var(--sage-ink)" />
          <g className="diagram-grid-label" fontSize="14">
            {["0", "π/2", "π", "3π/2", "2π"].map((label, index) => <text key={label} x={40 + 110 * index} y="212" textAnchor="middle">{label}</text>)}
            <text x="20" y="40">1</text><text x="15" y="190">−1</text>
          </g>
        </svg>
        <p>Sine: solid · Cosine: dashed · Angle in radians</p>
      </div>
    </div>
    <label className="function-input-control" htmlFor={controlId}>
      <span>Angle θ (degrees)</span>
      <input className="liquid-range" id={controlId} type="range" min="0" max="360" step="1" value={degrees} style={liquidRangeStyle(degrees, 0, 360)} onChange={(event) => setDegrees(Number(event.target.value))} />
    </label>
    <div className="diagram-choice-row" aria-label="Reference angles">
      {[0, 30, 45, 90, 180, 270, 360].map((value) => <button type="button" key={value} aria-pressed={degrees === value} onClick={() => setDegrees(value)}>{value}°</button>)}
    </div>
    <output className="trig-readout" aria-live="polite">
      <span>θ = {degrees}° = {number(degrees / 180)}π rad</span>
      <span>cos θ = {number(cosine)}</span><span>sin θ = {number(sine)}</span>
      <span>tan θ = {Math.abs(cosine) < 1e-9 ? "undefined" : number(sine / cosine)}</span>
    </output>
    <figcaption>The point is (cos θ, sin θ). The horizontal and vertical projections become the two curves as the angle changes. Decimal readouts are rounded.</figcaption>
  </figure>;
}
