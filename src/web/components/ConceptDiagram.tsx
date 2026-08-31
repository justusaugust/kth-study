import { useId, useState, type PointerEvent as ReactPointerEvent } from "react";
import { liquidRangeStyle } from "../rangeStyle";

type DiagramMode = "preview" | "full";
type Point = [x: number, y: number];

interface Props {
  slug: string;
  mode?: DiagramMode;
}

interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const NUMBER_LINE_MIN = -6;
const NUMBER_LINE_MAX = 6;
const NUMBER_LINE_LEFT = 56;
const NUMBER_LINE_RIGHT = 584;
const NUMBER_LINE_WIDTH = NUMBER_LINE_RIGHT - NUMBER_LINE_LEFT;

const CARTESIAN_X_MIN = -8;
const CARTESIAN_X_MAX = 8;
const CARTESIAN_Y_MIN = -5;
const CARTESIAN_Y_MAX = 5;
const CARTESIAN_LEFT = 80;
const CARTESIAN_TOP = 40;
const CARTESIAN_SCALE = 30;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, step = 0.5) {
  return Math.round(value / step) * step;
}

function trim(value: number, precision = 2) {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function pretty(value: number, precision = 2) {
  return trim(value, precision).replace("-", "−");
}

function lineX(value: number) {
  return (
    NUMBER_LINE_LEFT +
    ((value - NUMBER_LINE_MIN) / (NUMBER_LINE_MAX - NUMBER_LINE_MIN)) *
      NUMBER_LINE_WIDTH
  );
}

function graphX(value: number) {
  return CARTESIAN_LEFT + (value - CARTESIAN_X_MIN) * CARTESIAN_SCALE;
}

function graphY(value: number) {
  return CARTESIAN_TOP + (CARTESIAN_Y_MAX - value) * CARTESIAN_SCALE;
}

function pointerInViewBox(
  event: ReactPointerEvent<SVGSVGElement>,
  width: number,
  height: number,
): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  if (!rect.width || !rect.height) return [0, 0];
  return [
    ((event.clientX - rect.left) / rect.width) * width,
    ((event.clientY - rect.top) / rect.height) * height,
  ];
}

function numberLineValue(event: ReactPointerEvent<SVGSVGElement>) {
  const [x] = pointerInViewBox(event, 640, 240);
  const value =
    NUMBER_LINE_MIN +
    ((x - NUMBER_LINE_LEFT) / NUMBER_LINE_WIDTH) *
      (NUMBER_LINE_MAX - NUMBER_LINE_MIN);
  return snap(clamp(value, NUMBER_LINE_MIN, NUMBER_LINE_MAX));
}

function cartesianValue(event: ReactPointerEvent<SVGSVGElement>): Point {
  const [relativeX, relativeY] = pointerInViewBox(event, 540, 330);
  const x = relativeX + 50;
  const y = relativeY + 25;
  return [
    snap(
      clamp(
        CARTESIAN_X_MIN + (x - CARTESIAN_LEFT) / CARTESIAN_SCALE,
        -7,
        7,
      ),
    ),
    snap(
      clamp(
        CARTESIAN_Y_MAX - (y - CARTESIAN_TOP) / CARTESIAN_SCALE,
        -4,
        4,
      ),
    ),
  ];
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 0.5,
  onChange,
}: RangeControlProps) {
  return (
    <label className="diagram-slider">
      <span>{label}</span>
      <input
        className="liquid-range"
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        style={liquidRangeStyle(value, min, max)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{pretty(value)}</output>
    </label>
  );
}

function NumberLineTicks() {
  return (
    <g aria-hidden="true">
      {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
        <g key={value}>
          <line
            className={value === 0 ? "diagram-tick diagram-tick-origin" : "diagram-tick"}
            x1={lineX(value)}
            x2={lineX(value)}
            y1="118"
            y2="134"
          />
          <text className="diagram-tick-label" x={lineX(value)} y="158">
            {pretty(value)}
          </text>
        </g>
      ))}
    </g>
  );
}

function LineHandle({
  value,
  label,
  open = false,
  onPointerDown,
}: {
  value: number;
  label: string;
  open?: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGGElement>) => void;
}) {
  return (
    <g
      className="diagram-handle"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      transform={`translate(${lineX(value)} 126)`}
    >
      <circle className="diagram-hit" r="25" />
      <circle className={open ? "diagram-open" : "diagram-closed"} r="9" />
      <text className="diagram-point-label" y="-23">
        {label} = {pretty(value)}
      </text>
    </g>
  );
}

function IntervalDiagram({ mode }: { mode: DiagramMode }) {
  const id = useId();
  const [a, setA] = useState(-2);
  const [b, setB] = useState(3);
  const [includeA, setIncludeA] = useState(false);
  const [includeB, setIncludeB] = useState(true);
  const [active, setActive] = useState<"a" | "b" | null>(null);

  const leftSymbol = includeA ? "≤" : "<";
  const rightSymbol = includeB ? "≤" : "<";
  const interval = `${includeA ? "[" : "("}${trim(a)}, ${trim(b)}${includeB ? "]" : ")"}`;
  const inequality = `${pretty(a)} ${leftSymbol} x ${rightSymbol} ${pretty(b)}`;

  function updateActive(value: number) {
    if (active === "a") setA(Math.min(value, b - 0.5));
    if (active === "b") setB(Math.max(value, a + 0.5));
  }

  function reset() {
    setA(-2);
    setB(3);
    setIncludeA(false);
    setIncludeB(true);
  }

  return (
    <figure
      className={`concept-diagram interactive-diagram visual-topic--number interactive-diagram--${mode}`}
      aria-label="Interactive interval on the real line"
    >
      <svg
        className="diagram-stage diagram-stage--number-line"
        viewBox="0 6 640 174"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        onPointerMove={(event) => active && updateActive(numberLineValue(event))}
        onPointerUp={() => setActive(null)}
        onPointerCancel={() => setActive(null)}
      >
        <title id={`${id}-title`}>Interactive interval from a to b</title>
        <desc id={`${id}-desc`}>
          Drag either endpoint or use the controls below. Endpoint inclusion changes both the inequality and interval notation.
        </desc>
        <line className="diagram-axis" x1="40" y1="126" x2="600" y2="126" />
        <path className="diagram-arrow" d="M600 126l-12-7m12 7l-12 7" />
        <line className="diagram-accent" x1={lineX(a)} x2={lineX(b)} y1="126" y2="126" />
        <NumberLineTicks />
        <LineHandle
          value={a}
          label="a"
          open={!includeA}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setActive("a");
          }}
        />
        <LineHandle
          value={b}
          label="b"
          open={!includeB}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setActive("b");
          }}
        />
      </svg>

      <output className="diagram-readout" aria-live="polite">
        <strong>{interval}</strong>
        <span>{inequality}</span>
      </output>

      <div className="diagram-controls diagram-controls--line">
        <RangeControl label="Endpoint a" value={a} min={NUMBER_LINE_MIN} max={b - 0.5} onChange={setA} />
        <RangeControl label="Endpoint b" value={b} min={a + 0.5} max={NUMBER_LINE_MAX} onChange={setB} />
        <button
          type="button"
          className="diagram-toggle"
          aria-label="Include endpoint a"
          aria-pressed={includeA}
          onClick={() => setIncludeA((current) => !current)}
        >
          a {includeA ? "included" : "excluded"}
        </button>
        <button
          type="button"
          className="diagram-toggle"
          aria-label="Include endpoint b"
          aria-pressed={includeB}
          onClick={() => setIncludeB((current) => !current)}
        >
          b {includeB ? "included" : "excluded"}
        </button>
        {mode === "full" ? <button type="button" className="diagram-reset" onClick={reset}>Reset values</button> : null}
      </div>
      <figcaption>Drag the endpoints. Filled points are included; hollow points are not.</figcaption>
    </figure>
  );
}

function AbsoluteValueDiagram({ mode }: { mode: DiagramMode }) {
  const id = useId();
  const [a, setA] = useState(-3);
  const [b, setB] = useState(2);
  const [active, setActive] = useState<"a" | "b" | null>(null);
  const distance = Math.abs(a - b);
  const radialDifference = Math.abs(Math.abs(a) - Math.abs(b));
  const sameSide = a === 0 || b === 0 || Math.sign(a) === Math.sign(b);

  function updateActive(value: number) {
    if (active === "a") setA(value);
    if (active === "b") setB(value);
  }

  return (
    <figure
      className={`concept-diagram interactive-diagram visual-topic--number interactive-diagram--${mode}`}
      aria-label="Interactive absolute value as distance"
    >
      <svg
        className="diagram-stage diagram-stage--number-line"
        viewBox="0 6 640 174"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        onPointerMove={(event) => active && updateActive(numberLineValue(event))}
        onPointerUp={() => setActive(null)}
        onPointerCancel={() => setActive(null)}
      >
        <title id={`${id}-title`}>Absolute value as distance from zero</title>
        <desc id={`${id}-desc`}>
          Move a and b to compare their distance from each other with the difference between their distances from zero.
        </desc>
        <line className="diagram-axis" x1="40" y1="126" x2="600" y2="126" />
        <NumberLineTicks />
        <line className="diagram-distance-a" x1={lineX(0)} x2={lineX(a)} y1="64" y2="64" />
        <line className="diagram-distance-b" x1={lineX(0)} x2={lineX(b)} y1="38" y2="38" />
        <line className="diagram-accent" x1={lineX(a)} x2={lineX(b)} y1="126" y2="126" />
        <LineHandle
          value={a}
          label="a"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setActive("a");
          }}
        />
        <LineHandle
          value={b}
          label="b"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setActive("b");
          }}
        />
        <text className="diagram-segment-label" x={(lineX(0) + lineX(a)) / 2} y="52">|a| = {trim(Math.abs(a))}</text>
        <text className="diagram-segment-label" x={(lineX(0) + lineX(b)) / 2} y="26">|b| = {trim(Math.abs(b))}</text>
      </svg>

      <output className="diagram-readout diagram-readout--wide" aria-live="polite">
        <strong>{sameSide ? "Same side of zero" : "Opposite sides of zero"}</strong>
        <span>|a − b| = {trim(distance)}</span>
        <span>||a| − |b|| = {trim(radialDifference)}</span>
        <span>{distance === radialDifference ? "Equality" : `${trim(distance)} ≥ ${trim(radialDifference)}`}</span>
      </output>

      <div className="diagram-controls diagram-controls--line">
        <RangeControl label="Point a" value={a} min={NUMBER_LINE_MIN} max={NUMBER_LINE_MAX} onChange={setA} />
        <RangeControl label="Point b" value={b} min={NUMBER_LINE_MIN} max={NUMBER_LINE_MAX} onChange={setB} />
        {mode === "full" ? (
          <button type="button" className="diagram-reset" onClick={() => { setA(-3); setB(2); }}>Reset values</button>
        ) : null}
      </div>
      <figcaption>
        Move a and b. Their distance is never smaller than the difference between their distances from zero.
      </figcaption>
    </figure>
  );
}

function CartesianGrid() {
  return (
    <g aria-hidden="true">
      {Array.from({ length: 17 }, (_, index) => index - 8).map((value) => (
        <line
          key={`x-${value}`}
          className={value === 0 ? "diagram-grid diagram-axis" : "diagram-grid"}
          x1={graphX(value)}
          x2={graphX(value)}
          y1={graphY(CARTESIAN_Y_MIN)}
          y2={graphY(CARTESIAN_Y_MAX)}
        />
      ))}
      {Array.from({ length: 11 }, (_, index) => index - 5).map((value) => (
        <line
          key={`y-${value}`}
          className={value === 0 ? "diagram-grid diagram-axis" : "diagram-grid"}
          x1={graphX(CARTESIAN_X_MIN)}
          x2={graphX(CARTESIAN_X_MAX)}
          y1={graphY(value)}
          y2={graphY(value)}
        />
      ))}
      {[-6, -4, -2, 2, 4, 6].map((value) => (
        <text key={`xl-${value}`} className="diagram-grid-label" x={graphX(value)} y={graphY(0) + 20}>{pretty(value)}</text>
      ))}
      {[-4, -2, 2, 4].map((value) => (
        <text key={`yl-${value}`} className="diagram-grid-label" x={graphX(0) - 12} y={graphY(value) + 4}>{pretty(value)}</text>
      ))}
    </g>
  );
}

function PointHandle({
  point,
  label,
  onPointerDown,
}: {
  point: Point;
  label: string;
  onPointerDown: (event: ReactPointerEvent<SVGGElement>) => void;
}) {
  return (
    <g
      className="diagram-handle"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      transform={`translate(${graphX(point[0])} ${graphY(point[1])})`}
    >
      <circle className="diagram-hit" r="25" />
      <circle className="diagram-closed" r="8" />
      <text className="diagram-point-label" x="15" y="-14">{label} ({pretty(point[0])}, {pretty(point[1])})</text>
    </g>
  );
}

function squaredPointTerm(variable: string, value: number) {
  if (value === 0) return `${variable}²`;
  return `(${variable} ${value < 0 ? "+" : "−"} ${trim(Math.abs(value))})²`;
}

function lineEquation(p: Point, q: Point) {
  const run = q[0] - p[0];
  if (run === 0) return `x = ${pretty(p[0])}`;
  const slope = (q[1] - p[1]) / run;
  const intercept = p[1] - slope * p[0];
  if (intercept === 0) return `y = ${pretty(slope)}x`;
  return `y = ${pretty(slope)}x ${intercept < 0 ? "−" : "+"} ${trim(Math.abs(intercept))}`;
}

function CoordinateControls({
  p,
  q,
  setP,
  setQ,
}: {
  p: Point;
  q: Point;
  setP: (point: Point) => void;
  setQ: (point: Point) => void;
}) {
  return (
    <div className="diagram-controls diagram-controls--coordinates">
      <RangeControl label="P x-coordinate" value={p[0]} min={-7} max={7} onChange={(value) => setP([value, p[1]])} />
      <RangeControl label="P y-coordinate" value={p[1]} min={-4} max={4} onChange={(value) => setP([p[0], value])} />
      <RangeControl label="Q x-coordinate" value={q[0]} min={-7} max={7} onChange={(value) => setQ([value, q[1]])} />
      <RangeControl label="Q y-coordinate" value={q[1]} min={-4} max={4} onChange={(value) => setQ([q[0], value])} />
    </div>
  );
}

function CoordinateDiagram({ mode, slope }: { mode: DiagramMode; slope: boolean }) {
  const id = useId();
  const initialP: Point = [-1, 0];
  const initialQ: Point = [3, 2];
  const [p, setP] = useState<Point>(initialP);
  const [q, setQ] = useState<Point>(initialQ);
  const [active, setActive] = useState<"p" | "q" | null>(null);
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const distanceSquared = dx * dx + dy * dy;
  const distance = Math.sqrt(distanceSquared);
  const slopeValue = dx === 0 ? undefined : dy / dx;

  function updateActive(point: Point) {
    if (active === "p") setP(point);
    if (active === "q") setQ(point);
  }

  return (
    <figure
      className={`concept-diagram interactive-diagram visual-topic--geometry interactive-diagram--${mode}`}
      aria-label={slope ? "Interactive slope triangle" : "Interactive Cartesian distance and circle"}
    >
      <svg
        className="diagram-stage diagram-stage--cartesian"
        viewBox="50 25 540 330"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        onPointerMove={(event) => active && updateActive(cartesianValue(event))}
        onPointerUp={() => setActive(null)}
        onPointerCancel={() => setActive(null)}
      >
        <title id={`${id}-title`}>{slope ? "Interactive rise-over-run construction" : "Interactive Cartesian distance construction"}</title>
        <desc id={`${id}-desc`}>
          Drag P and Q or use the coordinate sliders below. The triangle and all measurements update immediately.
        </desc>
        <CartesianGrid />
        {!slope ? (
          <circle className="diagram-circle" cx={graphX(p[0])} cy={graphY(p[1])} r={distance * CARTESIAN_SCALE} />
        ) : (
          <line
            className="diagram-line-extension"
            x1={graphX(p[0] - dx * 20)}
            y1={graphY(p[1] - dy * 20)}
            x2={graphX(p[0] + dx * 20)}
            y2={graphY(p[1] + dy * 20)}
          />
        )}
        <polygon
          className="diagram-triangle-fill"
          points={`${graphX(p[0])},${graphY(p[1])} ${graphX(q[0])},${graphY(p[1])} ${graphX(q[0])},${graphY(q[1])}`}
        />
        <line className="diagram-guide" x1={graphX(p[0])} y1={graphY(p[1])} x2={graphX(q[0])} y2={graphY(p[1])} />
        <line className="diagram-guide" x1={graphX(q[0])} y1={graphY(p[1])} x2={graphX(q[0])} y2={graphY(q[1])} />
        <line className="diagram-accent" x1={graphX(p[0])} y1={graphY(p[1])} x2={graphX(q[0])} y2={graphY(q[1])} />
        <text className="diagram-segment-label" x={(graphX(p[0]) + graphX(q[0])) / 2} y={graphY(p[1]) + 20}>
          {slope ? "run" : "Δx"} = {pretty(dx)}
        </text>
        <text className="diagram-segment-label" x={graphX(q[0]) + 12} y={(graphY(p[1]) + graphY(q[1])) / 2}>
          {slope ? "rise" : "Δy"} = {pretty(dy)}
        </text>
        <PointHandle point={p} label="P" onPointerDown={(event) => { event.currentTarget.setPointerCapture?.(event.pointerId); setActive("p"); }} />
        <PointHandle point={q} label="Q" onPointerDown={(event) => { event.currentTarget.setPointerCapture?.(event.pointerId); setActive("q"); }} />
      </svg>

      {slope ? (
        <output className="diagram-readout diagram-readout--wide" aria-live="polite">
          <strong>{lineEquation(p, q)}</strong>
          <span>rise = {pretty(dy)}</span>
          <span>run = {pretty(dx)}</span>
          <span>slope = {slopeValue === undefined ? "undefined" : pretty(slopeValue)}</span>
        </output>
      ) : (
        <output className="diagram-readout diagram-readout--wide" aria-live="polite">
          <strong>{squaredPointTerm("x", p[0])} + {squaredPointTerm("y", p[1])} = {trim(distanceSquared)}</strong>
          <span>Δx = {pretty(dx)}</span>
          <span>Δy = {pretty(dy)}</span>
          <span>d = √{trim(distanceSquared)} ≈ {trim(distance)}</span>
        </output>
      )}

      <CoordinateControls p={p} q={q} setP={setP} setQ={setQ} />
      {mode === "full" ? (
        <button type="button" className="diagram-reset" onClick={() => { setP(initialP); setQ(initialQ); }}>Reset values</button>
      ) : null}
      <figcaption>
        {slope
          ? "Move either point. The triangle exposes rise, run, and the exceptional vertical-line case."
          : "Move either point. The circle is centred at P and passes through Q, so its radius is their distance."}
      </figcaption>
    </figure>
  );
}

export function ConceptDiagram({ slug, mode = "preview" }: Props) {
  if (slug === "real-numbers-and-lines") return <IntervalDiagram mode={mode} />;
  if (slug === "absolute-value") return <AbsoluteValueDiagram mode={mode} />;
  if (slug === "cartesian-distance-circles") return <CoordinateDiagram mode={mode} slope={false} />;
  if (slug === "lines-and-slopes") return <CoordinateDiagram mode={mode} slope />;
  return null;
}
