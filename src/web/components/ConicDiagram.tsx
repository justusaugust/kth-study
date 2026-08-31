import { useId, useMemo, useState } from "react";
import type { ConicSectionExplainer } from "../../domain/schemas";
import { liquidRangeStyle } from "../rangeStyle";
import { SvgTooltip, type SvgTooltipData } from "./diagrams/SvgTooltip";

type DiagramMode = "preview" | "full";

interface Props {
  variant: ConicSectionExplainer["variant"];
  mode: DiagramMode;
}

function clean(value: number, precision = 2) {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function ConicHotspot({
  x,
  y,
  symbol,
  label,
  detail,
  circleClass,
  radius,
  align = "right",
  symbolDx = 12,
  symbolDy = -10,
  onShow,
  onClear,
}: {
  x: number;
  y: number;
  symbol: string;
  label: string;
  detail: string;
  circleClass: string;
  radius: number;
  align?: "left" | "right";
  symbolDx?: number;
  symbolDy?: number;
  onShow: (tooltip: SvgTooltipData) => void;
  onClear: () => void;
}) {
  const tooltip = {
    x: align === "left" ? x - 204 : x + 14,
    y: y - 54,
    width: 190,
    label,
    detail,
  };
  return (
    <g
      className="diagram-hotspot"
      onMouseEnter={() => onShow(tooltip)}
      onMouseLeave={onClear}
      onFocus={() => onShow(tooltip)}
      onBlur={onClear}
    >
      <circle className={circleClass} cx={x} cy={y} r={radius} />
      <circle
        className="diagram-hotspot-hit"
        cx={x}
        cy={y}
        r="18"
        role="img"
        tabIndex={0}
        aria-label={`${label} at ${detail}`}
      />
      <text className="conic-label conic-hotspot-symbol" x={x + symbolDx} y={y + symbolDy}>{symbol}</text>
    </g>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="diagram-slider">
      <span>{label}</span>
      <input
        className="liquid-range"
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        style={liquidRangeStyle(value, min, max)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{clean(value)}</output>
    </label>
  );
}

function ParabolaDiagram({ mode }: { mode: DiagramMode }) {
  const id = useId();
  const [p, setP] = useState(1);
  const [pointX, setPointX] = useState(2);
  const [tooltip, setTooltip] = useState<SvgTooltipData>();
  const pointY = (pointX * pointX) / (4 * p);
  const focusDistance = Math.sqrt(pointX * pointX + (pointY - p) ** 2);
  const directrixDistance = pointY + p;
  const graphX = (x: number) => 320 + x * 48;
  const graphY = (y: number) => 236 - y * 38;
  const curve = useMemo(() => {
    const points: string[] = [];
    for (let x = -5; x <= 5.001; x += 0.1) {
      const y = (x * x) / (4 * p);
      if (y <= 5.4) points.push(`${graphX(x)},${graphY(y)}`);
    }
    return points.length ? `M${points.join(" L")}` : "";
  }, [p]);

  function reset() {
    setP(1);
    setPointX(2);
  }

  return (
    <figure
      className={`concept-diagram conic-diagram interactive-diagram visual-topic--conic interactive-diagram--${mode}`}
      aria-label="Interactive parabola defined by a focus and directrix"
    >
      <svg
        className="diagram-stage conic-stage"
        viewBox="0 0 640 360"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>Parabola as an equal-distance locus</title>
        <desc id={`${id}-desc`}>
          Point P lies on the parabola. Its distance to focus F equals its perpendicular distance to the directrix at Q.
        </desc>
        <line className="diagram-grid diagram-axis" x1="44" x2="596" y1={graphY(0)} y2={graphY(0)} />
        <line className="diagram-grid diagram-axis" x1={graphX(0)} x2={graphX(0)} y1="24" y2="326" />
        <line className="conic-directrix" x1="58" x2="582" y1={graphY(-p)} y2={graphY(-p)} />
        <path className="conic-curve" d={curve} />
        <line
          className="conic-witness conic-witness--focus"
          x1={graphX(pointX)}
          y1={graphY(pointY)}
          x2={graphX(0)}
          y2={graphY(p)}
        />
        <line
          className="conic-witness conic-witness--directrix"
          x1={graphX(pointX)}
          y1={graphY(pointY)}
          x2={graphX(pointX)}
          y2={graphY(-p)}
        />
        <ConicHotspot
          x={graphX(0)}
          y={graphY(p)}
          symbol="F"
          label="Focus F"
          detail={`(0, ${clean(p)})`}
          circleClass="conic-focus"
          radius={6}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <ConicHotspot
          x={graphX(pointX)}
          y={graphY(pointY)}
          symbol="P"
          label="Point P"
          detail={`(${clean(pointX)}, ${clean(pointY)})`}
          circleClass="conic-point"
          radius={7}
          align={pointX > 2 ? "left" : "right"}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <ConicHotspot
          x={graphX(pointX)}
          y={graphY(-p)}
          symbol="Q"
          label="Directrix foot Q"
          detail={`(${clean(pointX)}, ${clean(-p)})`}
          circleClass="conic-foot"
          radius={5}
          align={pointX > 2 ? "left" : "right"}
          symbolDy={18}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <text className="conic-axis-label" x="66" y={graphY(-p) - 10}>directrix y = −p</text>
        {tooltip ? <SvgTooltip {...tooltip} /> : null}
      </svg>
      <output className="diagram-readout diagram-readout--conic" aria-live="polite">
        <strong>x² = 4py</strong>
        <span>P = ({clean(pointX)}, {clean(pointY)})</span>
        <span>PF = {clean(focusDistance)}</span>
        <span>PQ = {clean(directrixDistance)}</span>
      </output>
      <div className="diagram-controls diagram-controls--conic">
        <Slider label="Focus distance p" value={p} min={0.5} max={2.5} step={0.25} onChange={setP} />
        <Slider label="Point x-coordinate" value={pointX} min={-4} max={4} step={0.25} onChange={setPointX} />
      </div>
      {mode === "full" ? (
        <button type="button" className="diagram-reset" onClick={reset}>Reset construction</button>
      ) : null}
      <figcaption>
        Move P or the focus. The two witness segments stay equal because every point on the curve satisfies the focus–directrix definition.
      </figcaption>
    </figure>
  );
}

function EllipseDiagram({ mode }: { mode: DiagramMode }) {
  const id = useId();
  const [a, setAState] = useState(4);
  const [b, setBState] = useState(2);
  const [angle, setAngle] = useState(45);
  const [tooltip, setTooltip] = useState<SvgTooltipData>();
  const c = Math.sqrt(a * a - b * b);
  const theta = (angle * Math.PI) / 180;
  const point = { x: a * Math.cos(theta), y: b * Math.sin(theta) };
  const distanceOne = Math.hypot(point.x + c, point.y);
  const distanceTwo = Math.hypot(point.x - c, point.y);
  const graphX = (x: number) => 320 + x * 47;
  const graphY = (y: number) => 180 - y * 45;
  const ellipsePath = useMemo(() => {
    const points = Array.from({ length: 121 }, (_, index) => {
      const t = (index / 120) * Math.PI * 2;
      return `${graphX(a * Math.cos(t))},${graphY(b * Math.sin(t))}`;
    });
    return `M${points.join(" L")} Z`;
  }, [a, b]);

  function setA(value: number) {
    setAState(value);
    setBState((current) => Math.min(current, value - 0.5));
  }

  function setB(value: number) {
    setBState(Math.min(value, a - 0.5));
  }

  function reset() {
    setAState(4);
    setBState(2);
    setAngle(45);
  }

  return (
    <figure
      className={`concept-diagram conic-diagram interactive-diagram visual-topic--conic interactive-diagram--${mode}`}
      aria-label="Interactive ellipse defined by two foci"
    >
      <svg
        className="diagram-stage conic-stage"
        viewBox="0 0 640 360"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>Ellipse as a constant-distance-sum locus</title>
        <desc id={`${id}-desc`}>
          Point P moves around an ellipse with semiaxes a and b. Its distances to foci F1 and F2 always add to 2a.
        </desc>
        <line className="diagram-grid diagram-axis" x1="44" x2="596" y1={graphY(0)} y2={graphY(0)} />
        <line className="diagram-grid diagram-axis" x1={graphX(0)} x2={graphX(0)} y1="24" y2="336" />
        <path className="conic-region" d={ellipsePath} />
        <path className="conic-curve" d={ellipsePath} />
        <line className="conic-major-axis" x1={graphX(-a)} x2={graphX(a)} y1={graphY(0)} y2={graphY(0)} />
        <line className="conic-minor-axis" x1={graphX(0)} x2={graphX(0)} y1={graphY(-b)} y2={graphY(b)} />
        <line className="conic-witness conic-witness--focus" x1={graphX(point.x)} y1={graphY(point.y)} x2={graphX(-c)} y2={graphY(0)} />
        <line className="conic-witness conic-witness--directrix" x1={graphX(point.x)} y1={graphY(point.y)} x2={graphX(c)} y2={graphY(0)} />
        <ConicHotspot
          x={graphX(-c)}
          y={graphY(0)}
          symbol="F₁"
          label="Focus F₁"
          detail={`(${clean(-c)}, 0)`}
          circleClass="conic-focus"
          radius={6}
          symbolDx={8}
          symbolDy={24}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <ConicHotspot
          x={graphX(c)}
          y={graphY(0)}
          symbol="F₂"
          label="Focus F₂"
          detail={`(${clean(c)}, 0)`}
          circleClass="conic-focus"
          radius={6}
          align="left"
          symbolDx={8}
          symbolDy={24}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <ConicHotspot
          x={graphX(point.x)}
          y={graphY(point.y)}
          symbol="P"
          label="Point P"
          detail={`(${clean(point.x)}, ${clean(point.y)})`}
          circleClass="conic-point"
          radius={7}
          align={point.x > 1.8 ? "left" : "right"}
          onShow={setTooltip}
          onClear={() => setTooltip(undefined)}
        />
        <text className="conic-axis-label" x={graphX(a) - 18} y={graphY(0) - 12}>a</text>
        <text className="conic-axis-label" x={graphX(0) + 12} y={graphY(b) + 8}>b</text>
        {tooltip ? <SvgTooltip {...tooltip} /> : null}
      </svg>
      <output className="diagram-readout diagram-readout--conic" aria-live="polite">
        <strong>PF₁ + PF₂ = {clean(distanceOne + distanceTwo)} = 2a</strong>
        <span>c = √(a² − b²) = {clean(c)}</span>
        <span>PF₁ = {clean(distanceOne)}</span>
        <span>PF₂ = {clean(distanceTwo)}</span>
      </output>
      <div className="diagram-controls diagram-controls--conic">
        <Slider label="Semimajor axis a" value={a} min={2} max={5} step={0.5} onChange={setA} />
        <Slider label="Semiminor axis b" value={b} min={1} max={Math.max(1, a - 0.5)} step={0.5} onChange={setB} />
        <Slider label="Point angle" value={angle} min={0} max={360} step={5} onChange={setAngle} />
      </div>
      {mode === "full" ? (
        <button type="button" className="diagram-reset" onClick={reset}>Reset construction</button>
      ) : null}
      <figcaption>
        Move P around the ellipse. The individual focal distances change, but their sum remains the major-axis length 2a.
      </figcaption>
    </figure>
  );
}

export function ConicDiagram({ variant, mode }: Props) {
  return variant === "parabola-focus-directrix" ? (
    <ParabolaDiagram mode={mode} />
  ) : (
    <EllipseDiagram mode={mode} />
  );
}
