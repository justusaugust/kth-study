import { useMemo, useState } from "react";
import { liquidRangeStyle } from "../../rangeStyle";
import { SvgTooltip, type SvgTooltipData } from "./SvgTooltip";

type DiagramMode = "preview" | "full";
export type FunctionConceptVariant =
  | "function-machine"
  | "vertical-line-test"
  | "function-symmetry"
  | "function-arithmetic"
  | "function-composition"
  | "piecewise-function";

interface Props {
  mode: DiagramMode;
  variant: FunctionConceptVariant;
}

const functionChoices = {
  Square: {
    symbol: "x²",
    domain: "(−∞, ∞)",
    range: "[0, ∞)",
    evaluate: (x: number) => x * x,
  },
  "Square root": {
    symbol: "√x",
    domain: "[0, ∞)",
    range: "[0, ∞)",
    evaluate: (x: number) => (x >= 0 ? Math.sqrt(x) : undefined),
  },
  Reciprocal: {
    symbol: "1/x",
    domain: "(−∞, 0) ∪ (0, ∞)",
    range: "(−∞, 0) ∪ (0, ∞)",
    evaluate: (x: number) => (Math.abs(x) > 1e-9 ? 1 / x : undefined),
  },
  Semicircle: {
    symbol: "√(1−x²)",
    domain: "[−1, 1]",
    range: "[0, 1]",
    evaluate: (x: number) => (Math.abs(x) <= 1 ? Math.sqrt(1 - x * x) : undefined),
  },
} as const;

type FunctionChoice = keyof typeof functionChoices;

function formatValue(value: number) {
  const rounded = Math.abs(value) < 0.0005 ? 0 : Number(value.toFixed(3));
  return String(rounded).replace("-", "−");
}

function FunctionMachine({ mode }: { mode: DiagramMode }) {
  const [choice, setChoice] = useState<FunctionChoice>("Square");
  const [x, setX] = useState(2);
  const selected = functionChoices[choice];
  const value = selected.evaluate(x);

  return (
    <figure
      className={`systems-diagram function-concept function-concept--machine visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive function, domain, and range machine"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Function rule">
        {(Object.keys(functionChoices) as FunctionChoice[]).map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={choice === name}
            key={name}
            onClick={() => setChoice(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="function-machine-stage">
        <span><small>input</small><strong>x = {formatValue(x)}</strong></span>
        <span aria-hidden="true">→</span>
        <span className="function-machine-rule"><small>rule</small><strong>f(x) = {selected.symbol}</strong></span>
        <span aria-hidden="true">→</span>
        <output>
          <small>output</small>
          <strong>{value === undefined ? "Outside the domain" : `f(x) = ${formatValue(value)}`}</strong>
        </output>
      </div>
      <div className="function-set-readout">
        <span>Domain {selected.domain}</span>
        <span>Range {selected.range}</span>
      </div>
      {mode === "full" ? (
        <label className="function-input-control">
          <span>Input x</span>
          <output>{formatValue(x)}</output>
          <input
            className="liquid-range"
            type="range"
            min="-4"
            max="4"
            step="0.25"
            value={x}
            aria-label="Input x"
            style={liquidRangeStyle(x, -4, 4)}
            onChange={(event) => setX(Number(event.target.value))}
          />
        </label>
      ) : null}
      <figcaption>
        A formula becomes a function only together with its allowed inputs. Move x and watch the domain gate the output.
      </figcaption>
    </figure>
  );
}

const verticalLineChoices = [
  "Parabola",
  "Circle",
  "Sideways parabola",
  "Upper semicircle",
] as const;

type VerticalLineChoice = (typeof verticalLineChoices)[number];

const verticalLineEquations: Record<VerticalLineChoice, string> = {
  Parabola: "y = x²",
  Circle: "x² + y² = 1",
  "Sideways parabola": "x = y² / 1.7",
  "Upper semicircle": "y = √(1 − x²),  −1 ≤ x ≤ 1",
};

const verticalPlot = {
  width: 720,
  height: 340,
  originX: 360,
  originY: 176,
  xScale: 190,
  yScale: 76,
};

function verticalPoint(x: number, y: number) {
  return [
    verticalPlot.originX + x * verticalPlot.xScale,
    verticalPlot.originY - y * verticalPlot.yScale,
  ] as const;
}

function linePath(points: ReadonlyArray<readonly [number, number]>, close = false) {
  const path = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  return close ? `${path} Z` : path;
}

function verticalCurvePath(choice: VerticalLineChoice) {
  if (choice === "Circle") {
    return linePath(
      Array.from({ length: 97 }, (_, index) => {
        const angle = (index / 96) * Math.PI * 2;
        return verticalPoint(Math.cos(angle), Math.sin(angle));
      }),
      true,
    );
  }

  if (choice === "Sideways parabola") {
    return linePath(
      Array.from({ length: 81 }, (_, index) => {
        const y = -1.6 + index * 0.04;
        return verticalPoint((y * y) / 1.7, y);
      }),
    );
  }

  if (choice === "Upper semicircle") {
    const [leftX, y] = verticalPoint(-1, 0);
    const [rightX] = verticalPoint(1, 0);
    return `M${leftX} ${y} A${verticalPlot.xScale} ${verticalPlot.yScale} 0 0 1 ${rightX} ${y}`;
  }

  return linePath(
    Array.from({ length: 81 }, (_, index) => {
      const x = -1.45 + index * 0.03625;
      return verticalPoint(x, x * x);
    }),
  );
}

function verticalIntersections(choice: VerticalLineChoice, x: number) {
  const epsilon = 0.001;
  if (choice === "Circle") {
    if (Math.abs(x) > 1 + epsilon) return [];
    const y = Math.sqrt(Math.max(0, 1 - x * x));
    return y < epsilon ? [[x, 0] as const] : [[x, y] as const, [x, -y] as const];
  }
  if (choice === "Sideways parabola") {
    if (x < -epsilon) return [];
    const y = Math.sqrt(Math.max(0, 1.7 * x));
    return y < epsilon ? [[x, 0] as const] : [[x, y] as const, [x, -y] as const];
  }
  if (choice === "Upper semicircle") {
    return Math.abs(x) <= 1 + epsilon
      ? [[x, Math.sqrt(Math.max(0, 1 - x * x))] as const]
      : [];
  }
  return [[x, x * x] as const];
}

function VerticalLineTest({ mode }: { mode: DiagramMode }) {
  const [choice, setChoice] = useState<VerticalLineChoice>("Parabola");
  const [x, setX] = useState(0.5);
  const [tooltip, setTooltip] = useState<SvgTooltipData>();
  const path = useMemo(() => verticalCurvePath(choice), [choice]);
  const intersections = verticalIntersections(choice, x);
  const testX = verticalPoint(x, 0)[0];
  const result =
    intersections.length === 0
      ? "No intersection at this input"
      : intersections.length === 1
        ? "One intersection — this is a function of x"
        : "Two intersections — not a function of x";

  return (
    <figure
      className={`systems-diagram function-concept function-concept--vertical-test visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive vertical-line test"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Curve">
        {verticalLineChoices.map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={choice === name}
            key={name}
            onClick={() => setChoice(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <output className="function-curve-equation" aria-live="polite">
        <span>{choice}</span>
        <strong>{verticalLineEquations[choice]}</strong>
      </output>
      <div
        className="function-vertical-stage"
        role="img"
        aria-label={`${choice} crossed by the vertical line x equals ${formatValue(x)} at ${intersections.length} points`}
      >
        <svg viewBox={`0 0 ${verticalPlot.width} ${verticalPlot.height}`} aria-hidden="true">
          <path className="function-axis" d={`M36 ${verticalPlot.originY} H684 M${verticalPlot.originX} 24 V316`} />
          <path className="function-curve" d={path} />
          <path className="vertical-test-line" d={`M${testX} 28 V312`} />
          {intersections.map(([pointX, pointY], index) => {
            const [cx, cy] = verticalPoint(pointX, pointY);
            const showTooltip = () => setTooltip({
              x: Math.max(4, Math.min(verticalPlot.width - 144, cx - 70)),
              y: Math.max(8, cy - 55),
              width: 140,
              label: `intersection ${index + 1}`,
              detail: `(${formatValue(pointX)}, ${formatValue(pointY)})`,
            });
            return (
              <g
                className="diagram-hotspot"
                tabIndex={0}
                role="img"
                aria-label={`Intersection ${index + 1} at ${formatValue(pointX)}, ${formatValue(pointY)}`}
                key={`${pointX}-${pointY}-${index}`}
                onMouseEnter={showTooltip}
                onMouseLeave={() => setTooltip(undefined)}
                onFocus={showTooltip}
                onBlur={() => setTooltip(undefined)}
              >
                <circle className="function-point" cx={cx} cy={cy} r="7" />
                <circle className="diagram-hotspot-hit" cx={cx} cy={cy} r="20" />
              </g>
            );
          })}
          {tooltip ? <SvgTooltip {...tooltip} /> : null}
        </svg>
      </div>
      <output className="function-symmetry-readout" aria-live="polite">
        <strong>{result}</strong>
        <span>x = {formatValue(x)}</span>
      </output>
      <label className="function-input-control">
        <span>Sweep the test line</span>
        <output>{formatValue(x)}</output>
        <input
          className="liquid-range"
          type="range"
          min="-1.2"
          max="1.2"
          step="0.1"
          value={x}
          aria-label="Test line x"
          style={liquidRangeStyle(x, -1.2, 1.2)}
          onChange={(event) => setX(Number(event.target.value))}
        />
      </label>
      <figcaption>
        Sweep one vertical line across the curve. A second intersection means one input would have two outputs.
      </figcaption>
    </figure>
  );
}

const symmetryChoices = {
  "Even · x²": {
    kind: "even",
    relation: "f(−x) = f(x)",
    symmetry: "Y-axis symmetry",
    evaluate: (x: number) => x * x,
  },
  "Odd · x³": {
    kind: "odd",
    relation: "f(−x) = −f(x)",
    symmetry: "Origin symmetry",
    evaluate: (x: number) => x * x * x,
  },
  "Neither · x² + 2x": {
    kind: "neither",
    relation: "No parity identity",
    symmetry: "Neither standard symmetry",
    evaluate: (x: number) => x * x + 2 * x,
  },
} as const;

type SymmetryChoice = keyof typeof symmetryChoices;

const plot = {
  width: 720,
  height: 340,
  xScale: 112,
  yScale: 8,
  originX: 360,
  originY: 170,
};

function point(x: number, y: number) {
  return [plot.originX + x * plot.xScale, plot.originY - y * plot.yScale] as const;
}

function SymmetryExplorer({ mode }: { mode: DiagramMode }) {
  const [choice, setChoice] = useState<SymmetryChoice>("Even · x²");
  const [x, setX] = useState(1.5);
  const [tooltip, setTooltip] = useState<SvgTooltipData>();
  const selected = symmetryChoices[choice];
  const y = selected.evaluate(x);
  const mirroredY = selected.evaluate(-x);
  const path = useMemo(() => {
    const samples = Array.from({ length: 105 }, (_, index) => -2.6 + index * 0.05);
    return samples
      .map((value, index) => {
        const [screenX, screenY] = point(value, selected.evaluate(value));
        return `${index === 0 ? "M" : "L"}${screenX.toFixed(2)} ${screenY.toFixed(2)}`;
      })
      .join(" ");
  }, [selected]);
  const [x1, y1] = point(x, y);
  const [x2, y2] = point(-x, mirroredY);

  return (
    <figure
      className={`systems-diagram function-concept function-concept--symmetry visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive even and odd function symmetry explorer"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Symmetry type">
        {(Object.keys(symmetryChoices) as SymmetryChoice[]).map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={choice === name}
            key={name}
            onClick={() => setChoice(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="function-symmetry-stage" role="img" aria-label={`Graph of ${choice} with paired inputs x and negative x`}>
        <svg viewBox={`0 0 ${plot.width} ${plot.height}`} aria-hidden="true">
          <path className="function-axis" d={`M36 ${plot.originY} H684 M${plot.originX} 24 V316`} />
          <path className="function-curve" d={path} />
          {[[x1, y1, `x = ${formatValue(x)}`, `f(x) = ${formatValue(y)}`], [x2, y2, `−x = ${formatValue(-x)}`, `f(−x) = ${formatValue(mirroredY)}`]].map(([cx, cy, label, value]) => {
            const showTooltip = () => setTooltip({
              x: Math.max(4, Math.min(plot.width - 144, Number(cx) - 70)),
              y: Math.max(8, Number(cy) - 55),
              width: 140,
              label: String(label),
              detail: String(value),
            });
            return (
            <g
              className="diagram-hotspot"
              tabIndex={0}
              role="img"
              aria-label={`${label}, ${value}`}
              key={String(label)}
              onMouseEnter={showTooltip}
              onMouseLeave={() => setTooltip(undefined)}
              onFocus={showTooltip}
              onBlur={() => setTooltip(undefined)}
            >
              <circle className="function-point" cx={Number(cx)} cy={Number(cy)} r="7" />
              <circle className="diagram-hotspot-hit" cx={Number(cx)} cy={Number(cy)} r="20" />
            </g>
            );
          })}
          {tooltip ? <SvgTooltip {...tooltip} /> : null}
        </svg>
      </div>
      <output className="function-symmetry-readout" aria-live="polite">
        <strong>{selected.relation}</strong>
        <span>{selected.symmetry}</span>
        <span>At x = {formatValue(x)}: {formatValue(y)} and {formatValue(mirroredY)}</span>
      </output>
      {mode === "full" ? (
        <label className="function-input-control">
          <span>Paired input ±x</span>
          <output>{formatValue(x)}</output>
          <input
            className="liquid-range"
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={x}
            aria-label="Paired input x"
            style={liquidRangeStyle(x, 0.25, 2)}
            onChange={(event) => setX(Number(event.target.value))}
          />
        </label>
      ) : null}
      <figcaption>
        Compare the outputs at x and −x. Equal values reveal even symmetry; opposite values reveal odd symmetry.
      </figcaption>
    </figure>
  );
}

const arithmeticChoices = {
  Sum: {
    symbol: "+",
    formula: "√x + √(1−x)",
    evaluate: (f: number, g: number) => f + g,
  },
  Difference: {
    symbol: "−",
    formula: "√x − √(1−x)",
    evaluate: (f: number, g: number) => f - g,
  },
  Product: {
    symbol: "×",
    formula: "√(x(1−x))",
    evaluate: (f: number, g: number) => f * g,
  },
  Quotient: {
    symbol: "÷",
    formula: "√x / √(1−x)",
    evaluate: (f: number, g: number) => (Math.abs(g) < 1e-9 ? undefined : f / g),
  },
} as const;

type ArithmeticChoice = keyof typeof arithmeticChoices;

function FunctionArithmetic({ mode }: { mode: DiagramMode }) {
  const [choice, setChoice] = useState<ArithmeticChoice>("Sum");
  const [x, setX] = useState(0.5);
  const operation = arithmeticChoices[choice];
  const f = Math.sqrt(Math.max(0, x));
  const g = Math.sqrt(Math.max(0, 1 - x));
  const value = operation.evaluate(f, g);
  const domain = choice === "Quotient" ? "[0, 1)" : "[0, 1]";

  return (
    <figure
      className={`systems-diagram function-concept function-combination visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive arithmetic with functions"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Function operation">
        {(Object.keys(arithmeticChoices) as ArithmeticChoice[]).map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={choice === name}
            key={name}
            onClick={() => setChoice(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="function-flow" aria-label={`${choice} of f and g at x equals ${formatValue(x)}`}>
        <span><small>f(x)</small><strong>√x = {formatValue(f)}</strong></span>
        <b aria-hidden="true">{operation.symbol}</b>
        <span><small>g(x)</small><strong>√(1−x) = {formatValue(g)}</strong></span>
        <b aria-hidden="true">=</b>
        <output>
          <small>{operation.formula}</small>
          <strong>{value === undefined ? `Undefined: g(${formatValue(x)}) = 0` : formatValue(value)}</strong>
        </output>
      </div>
      <div className="function-set-readout">
        <span>Shared domain {domain}</span>
        <span>{choice === "Quotient" ? "The quotient removes x = 1 because g(x) is zero." : "Both formulas must be defined at the same input."}</span>
      </div>
      {mode === "full" ? (
        <label className="function-input-control">
          <span>Shared input x</span>
          <output>{formatValue(x)}</output>
          <input
            className="liquid-range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={x}
            aria-label="Shared input x"
            style={liquidRangeStyle(x, 0, 1)}
            onChange={(event) => setX(Number(event.target.value))}
          />
        </label>
      ) : null}
      <figcaption>
        Combine outputs at one shared input. The domain is the overlap of the original domains, with zero denominators removed.
      </figcaption>
    </figure>
  );
}

type CompositionOrder = "f-after-g" | "g-after-f";

function FunctionComposition({ mode }: { mode: DiagramMode }) {
  const [order, setOrder] = useState<CompositionOrder>("f-after-g");
  const [x, setX] = useState(1);
  const isFAfterG = order === "f-after-g";
  const firstValue = isFAfterG ? x + 1 : x >= 0 ? Math.sqrt(x) : undefined;
  const finalValue = firstValue === undefined
    ? undefined
    : isFAfterG
      ? firstValue >= 0 ? Math.sqrt(firstValue) : undefined
      : firstValue + 1;
  const firstName = isFAfterG ? "g" : "f";
  const secondName = isFAfterG ? "f" : "g";
  const firstRule = isFAfterG ? "g(x) = x + 1" : "f(x) = √x";
  const secondRule = isFAfterG ? "f(u) = √u" : "g(u) = u + 1";
  const domain = isFAfterG ? "[−1, ∞)" : "[0, ∞)";

  return (
    <figure
      className={`systems-diagram function-concept function-composition visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive function composition pipeline"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Composition order">
        <button type="button" role="tab" aria-selected={isFAfterG} onClick={() => setOrder("f-after-g")}>f after g</button>
        <button type="button" role="tab" aria-selected={!isFAfterG} onClick={() => setOrder("g-after-f")}>g after f</button>
      </div>
      <div className="function-flow function-flow--composition">
        <span><small>input</small><strong>x = {formatValue(x)}</strong></span>
        <span><small>{firstName} first</small><strong>{firstRule}</strong><em>{firstValue === undefined ? "Input rejected" : formatValue(firstValue)}</em></span>
        <span><small>{secondName} second</small><strong>{secondRule}</strong><em>{finalValue === undefined ? "No output" : formatValue(finalValue)}</em></span>
        <output>
          <small>{isFAfterG ? "f ∘ g" : "g ∘ f"}</small>
          <strong>{finalValue === undefined ? "Outside the domain of f" : `${isFAfterG ? "f(g(x))" : "g(f(x))"} = ${formatValue(finalValue)}`}</strong>
        </output>
      </div>
      <div className="function-set-readout">
        <span>Domain {domain}</span>
        <span>The inner function runs first.</span>
      </div>
      {mode === "full" ? (
        <label className="function-input-control">
          <span>Composition input x</span>
          <output>{formatValue(x)}</output>
          <input
            className="liquid-range"
            type="range"
            min="-2"
            max="4"
            step="0.25"
            value={x}
            aria-label="Composition input x"
            style={liquidRangeStyle(x, -2, 4)}
            onChange={(event) => setX(Number(event.target.value))}
          />
        </label>
      ) : null}
      <figcaption>
        Reverse the machines and the rule changes. An input is allowed only when it survives every stage in order.
      </figcaption>
    </figure>
  );
}

function PiecewiseFunction({ mode }: { mode: DiagramMode }) {
  const [x, setX] = useState(0);
  const branch = x < -1 ? "left" : x <= 1 ? "middle" : "right";
  const value = branch === "left" ? x + 3 : branch === "middle" ? x * x : 2 - x;

  return (
    <figure
      className={`systems-diagram function-concept piecewise-function visual-topic--function systems-diagram--${mode}`}
      aria-label="Interactive piecewise function"
    >
      <div className="piecewise-rule" aria-label="Definition of p of x">
        <strong>p(x) =</strong>
        <div>
          <span aria-current={branch === "left" ? "true" : undefined}><b>x + 3</b><small>x &lt; −1</small></span>
          <span aria-current={branch === "middle" ? "true" : undefined}><b>x²</b><small>−1 ≤ x ≤ 1</small></span>
          <span aria-current={branch === "right" ? "true" : undefined}><b>2 − x</b><small>x &gt; 1</small></span>
        </div>
      </div>
      <output className="piecewise-readout" aria-live="polite">
        <small>{branch === "left" ? "left branch" : branch === "middle" ? "middle branch" : "right branch"}</small>
        <strong>p({formatValue(x)}) = {formatValue(value)}</strong>
      </output>
      {mode === "full" ? (
        <label className="function-input-control">
          <span>Piecewise input x</span>
          <output>{formatValue(x)}</output>
          <input
            className="liquid-range"
            type="range"
            min="-3"
            max="3"
            step="0.25"
            value={x}
            aria-label="Piecewise input x"
            style={liquidRangeStyle(x, -3, 3)}
            onChange={(event) => setX(Number(event.target.value))}
          />
        </label>
      ) : null}
      <figcaption>
        Move x across the breakpoints. Endpoint symbols decide exactly which formula owns a boundary value.
      </figcaption>
    </figure>
  );
}

export function FunctionConceptDiagram({ mode, variant }: Props) {
  if (variant === "function-machine") return <FunctionMachine mode={mode} />;
  if (variant === "vertical-line-test") return <VerticalLineTest mode={mode} />;
  if (variant === "function-symmetry") return <SymmetryExplorer mode={mode} />;
  if (variant === "function-arithmetic") return <FunctionArithmetic mode={mode} />;
  if (variant === "function-composition") return <FunctionComposition mode={mode} />;
  return <PiecewiseFunction mode={mode} />;
}
