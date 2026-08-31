import { useEffect, useRef, useState } from "react";
import {
  Coordinates,
  Line,
  Mafs,
  Plot,
  Point,
  Theme,
  useTransformContext,
  vec,
} from "mafs";
import type { FunctionPlotExplainer } from "../../domain/schemas";
import { liquidRangeStyle } from "../rangeStyle";

export interface RendererProps<T extends FunctionPlotExplainer> {
  spec: T;
  mode: "preview" | "full";
  /** Frame width override, primarily for tests; measured from the DOM otherwise. */
  frameWidth?: number;
}

const LABEL_STEPS = [1, 2, 5, 10, 20];
const MIN_LABEL_SPACING_PX = 48;
const EDGE_MARGIN_PX = 14;
const EPSILON = 1e-9;

const coefficientRoles = {
  a: "opening",
  b: "axis shift",
  c: "vertical shift",
};

function formatNumber(value: number) {
  const rounded = Math.abs(value) < 0.0005 ? 0 : Number(value.toFixed(2));
  return String(rounded).replace("-", "−");
}

function equationText(a: number, b: number, c: number) {
  const terms = [
    { coefficient: a, variable: "x²" },
    { coefficient: b, variable: "x" },
    { coefficient: c, variable: "" },
  ].filter(({ coefficient }) => Math.abs(coefficient) > EPSILON);

  if (terms.length === 0) return "f(x) = 0";

  const expression = terms
    .map(({ coefficient, variable }, index) => {
      const magnitude = Math.abs(coefficient);
      const value =
        variable && Math.abs(magnitude - 1) < EPSILON
          ? variable
          : `${formatNumber(magnitude)}${variable}`;
      if (index === 0) return coefficient < 0 ? `−${value}` : value;
      return `${coefficient < 0 ? "−" : "+"} ${value}`;
    })
    .join(" ");

  return `f(x) = ${expression}`;
}

function quadraticFacts(a: number, b: number, c: number) {
  if (Math.abs(a) <= EPSILON) {
    const roots = Math.abs(b) <= EPSILON ? [] : [-c / b];
    return {
      discriminant: undefined,
      roots,
      vertex: undefined,
      axis: undefined,
      rootLabel:
        roots.length === 1
          ? `Linear root x = ${formatNumber(roots[0])}`
          : "No isolated root",
    };
  }

  const discriminant = b * b - 4 * a * c;
  const axis = -b / (2 * a);
  const vertex: [number, number] = [axis, a * axis * axis + b * axis + c];
  const roots =
    discriminant < -EPSILON
      ? []
      : Math.abs(discriminant) <= EPSILON
        ? [axis]
        : [
            (-b - Math.sqrt(discriminant)) / (2 * a),
            (-b + Math.sqrt(discriminant)) / (2 * a),
          ].sort((left, right) => left - right);

  return {
    discriminant,
    roots,
    vertex,
    axis,
    rootLabel:
      roots.length === 0
        ? "No real roots"
        : roots.length === 1
          ? `Double root x = ${formatNumber(roots[0])}`
          : `Roots x = ${roots.map(formatNumber).join(", ")}`,
  };
}

function plotHeight(width: number, mode: "preview" | "full") {
  const minimum = mode === "full" && width >= 480 ? 360 : 280;
  const maximum = mode === "full" ? 520 : 420;
  return Math.round(Math.min(maximum, Math.max(minimum, width * 0.62)));
}

function labelStep(pxPerUnit: number): number {
  return (
    LABEL_STEPS.find((step) => step * pxPerUnit >= MIN_LABEL_SPACING_PX) ?? 20
  );
}

// A label is kept only when its centre sits at least EDGE_MARGIN_PX inside
// the frame edge — Mafs generates labels across full panes, which extend past
// the viewport, and the frame's overflow crops them mid-glyph otherwise.
// Checking the transformed screen position keeps this correct after pan/zoom.
function keepLabel(
  value: number,
  step: number,
  positionPx: number,
  frameExtent: number | undefined,
): boolean {
  if (value % step !== 0) return false;
  if (frameExtent === undefined) return true;
  return Math.abs(positionPx) <= frameExtent / 2 - EDGE_MARGIN_PX;
}

// The visible range grows with the frame's aspect ratio, so labelling every
// integer collides at shallow heights. Label only multiples that leave at
// least MIN_LABEL_SPACING_PX between labels at the rendered scale.
function AdaptiveCartesian({
  frameWidth,
  frameHeight,
}: {
  frameWidth: number | undefined;
  frameHeight: number;
}) {
  const { viewTransform } = useTransformContext();
  const origin = vec.transform([0, 0], viewTransform);
  const pxPerUnitX = Math.abs(
    vec.transform([1, 0], viewTransform)[0] - origin[0],
  );
  const pxPerUnitY = Math.abs(
    vec.transform([0, 1], viewTransform)[1] - origin[1],
  );
  const stepX = labelStep(pxPerUnitX);
  const stepY = labelStep(pxPerUnitY);
  return (
    <Coordinates.Cartesian
      subdivisions={2}
      xAxis={{
        labels: (x) =>
          keepLabel(
            x,
            stepX,
            vec.transform([x, 0], viewTransform)[0],
            frameWidth,
          )
            ? x
            : "",
      }}
      yAxis={{
        labels: (y) =>
          keepLabel(
            y,
            stepY,
            vec.transform([0, y], viewTransform)[1],
            frameHeight,
          )
            ? y
            : "",
      }}
    />
  );
}

const plotColors = {
  blue: Theme.blue,
  amber: Theme.orange,
  graphite: Theme.foreground,
};

export function FunctionPlot({
  spec,
  mode,
  frameWidth,
}: RendererProps<FunctionPlotExplainer>) {
  const initial = spec.functions[0].coefficients;
  const [coefficients, setCoefficients] = useState(initial);
  const frameRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>();
  const testMode = import.meta.env.MODE === "test";
  const resolvedFrameWidth = testMode ? frameWidth ?? 640 : measuredWidth;
  const sizingWidth = resolvedFrameWidth ?? (mode === "full" ? 760 : 580);
  const height = plotHeight(sizingWidth, mode);
  const facts = quadraticFacts(coefficients.a, coefficients.b, coefficients.c);
  const equation = equationText(coefficients.a, coefficients.b, coefficients.c);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      setMeasuredWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      className={`function-plot visual-topic--function function-plot--${mode}`}
    >
      <div
        ref={frameRef}
        className="plot-frame"
        role="img"
        aria-label={spec.accessibleSummary}
      >
        <Mafs
          width={testMode ? resolvedFrameWidth : "auto"}
          height={height}
          pan={mode === "full"}
          zoom={mode === "full" ? { min: 0.5, max: 2 } : false}
          viewBox={{ x: [-6, 6], y: [-6, 6], padding: 0.5 }}
        >
          <AdaptiveCartesian
            frameWidth={resolvedFrameWidth}
            frameHeight={height}
          />
          {spec.functions.map((fn, index) => {
            const values = index === 0 ? coefficients : fn.coefficients;
            return (
              <Plot.OfX
                key={fn.id}
                y={(x) => values.a * x * x + values.b * x + values.c}
                color={plotColors[fn.color]}
              />
            );
          })}
          <g className="plot-landmarks">
            {facts.vertex ? (
              <>
                <Line.Segment
                  point1={[facts.axis ?? 0, -6]}
                  point2={[facts.axis ?? 0, 6]}
                  color={Theme.violet}
                  style="dashed"
                  weight={1.5}
                  opacity={0.45}
                />
                <Point
                  x={facts.vertex[0]}
                  y={facts.vertex[1]}
                  color={Theme.violet}
                  svgCircleProps={{
                    className: "plot-landmark plot-landmark--vertex",
                    "aria-label": `Vertex at ${formatNumber(facts.vertex[0])}, ${formatNumber(facts.vertex[1])}`,
                  }}
                />
              </>
            ) : null}
            {facts.roots.map((root, index) => (
              <Point
                key={`${root}-${index}`}
                x={root}
                y={0}
                color={Theme.orange}
                svgCircleProps={{
                  className: "plot-landmark plot-landmark--root",
                  "aria-label": `Root at x equals ${formatNumber(root)}`,
                }}
              />
            ))}
          </g>
        </Mafs>
      </div>

      <output className="function-readout" aria-live="polite">
        <strong className="function-equation">{equation}</strong>
        {facts.vertex ? (
          <span>
            Vertex ({formatNumber(facts.vertex[0])}, {formatNumber(facts.vertex[1])})
          </span>
        ) : (
          <span>Linear case</span>
        )}
        {facts.axis !== undefined ? (
          <span>Axis x = {formatNumber(facts.axis)}</span>
        ) : null}
        <span>{facts.rootLabel}</span>
        {facts.discriminant !== undefined ? (
          <span className="function-discriminant">
            Δ = {formatNumber(facts.discriminant)}
          </span>
        ) : null}
      </output>

      <div className={`coefficient-controls coefficient-controls--${mode}`}>
        {spec.controls.map((control) => (
          <label key={control.coefficient}>
            <span className="coefficient-name">
              <var>{control.coefficient}</var>
              <small>{coefficientRoles[control.coefficient]}</small>
            </span>
            <input
              className="liquid-range"
              type="range"
              aria-label={`Coefficient ${control.coefficient}`}
              min={control.min}
              max={control.max}
              step={control.step}
              value={coefficients[control.coefficient]}
              style={liquidRangeStyle(
                coefficients[control.coefficient],
                control.min,
                control.max,
              )}
              onChange={(event) =>
                setCoefficients((current) => ({
                  ...current,
                  [control.coefficient]: Number(event.target.value),
                }))
              }
            />
            <output>{coefficients[control.coefficient]}</output>
          </label>
        ))}
      </div>
      <figcaption>{spec.caption}</figcaption>
    </figure>
  );
}
