import { useId, useMemo, useState } from "react";
import type { SystemsDiagramExplainer } from "../../domain/schemas";
import { liquidRangeStyle } from "../rangeStyle";
import {
  DigitalArithmeticDiagram,
  type DigitalArithmeticVariant,
} from "./diagrams/DigitalArithmeticDiagram";
import {
  FunctionConceptDiagram,
  type FunctionConceptVariant,
} from "./diagrams/FunctionConceptDiagram";
import { CmosDiagram, type CmosVariant } from "./diagrams/CmosDiagram";
import { LabDiagram, type LabVariant } from "./diagrams/LabDiagram";

type DiagramMode = "preview" | "full";

interface Props {
  variant: SystemsDiagramExplainer["variant"];
  mode: DiagramMode;
}

const binaryWeights = [128, 64, 32, 16, 8, 4, 2, 1] as const;

function BinaryPlaceValue({ mode }: { mode: DiagramMode }) {
  const [bits, setBits] = useState([0, 1, 0, 1, 1, 0, 1, 0]);
  const decimal = bits.reduce(
    (total, bit, index) => total + bit * binaryWeights[index],
    0,
  );
  const activeTerms = bits
    .map((bit, index) => (bit ? String(binaryWeights[index]) : null))
    .filter(Boolean);

  function toggle(index: number) {
    setBits((current) =>
      current.map((bit, position) =>
        position === index ? (bit === 1 ? 0 : 1) : bit,
      ),
    );
  }

  return (
    <figure
      className={`systems-diagram systems-diagram--binary visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive binary place-value converter"
    >
      <div className="binary-register" role="group" aria-label="Eight-bit word">
        {bits.map((bit, index) => (
          <button
            type="button"
            className="binary-place"
            data-active={bit === 1 ? "true" : undefined}
            aria-pressed={bit === 1}
            aria-label={`Bit with weight ${binaryWeights[index]} is ${bit}. Toggle it.`}
            key={binaryWeights[index]}
            onClick={() => toggle(index)}
          >
            <span className="binary-place__bit">{bit}</span>
            <span className="binary-place__weight">{binaryWeights[index]}</span>
            <span className="binary-place__contribution">
              {bit * binaryWeights[index]}
            </span>
          </button>
        ))}
      </div>
      <output className="systems-equation" aria-live="polite">
        <span className="systems-equation__word">{bits.join("")}₂</span>
        <span aria-hidden="true">=</span>
        <span className="systems-equation__sum">
          {activeTerms.length ? activeTerms.join(" + ") : "0"}
        </span>
        <span aria-hidden="true">=</span>
        <strong>{decimal}₁₀</strong>
      </output>
      {mode === "full" ? (
        <button
          type="button"
          className="diagram-reset systems-reset"
          onClick={() => setBits([0, 1, 0, 1, 1, 0, 1, 0])}
        >
          Restore 90
        </button>
      ) : null}
      <figcaption>
        Toggle any bit. Its column weight either contributes in full or not at
        all.
      </figcaption>
    </figure>
  );
}

function LogicLevels({ mode }: { mode: DiagramMode }) {
  const [voltage, setVoltage] = useState(0.82);
  const logicState = voltage <= 0.3 ? "LOW · 0" : voltage >= 0.7 ? "HIGH · 1" : "Undefined";
  const stateDescription =
    voltage <= 0.3
      ? `${(0.3 - voltage).toFixed(2)} V inside the guaranteed LOW range`
      : voltage >= 0.7
        ? `${(voltage - 0.7).toFixed(2)} V inside the guaranteed HIGH range`
        : "No guaranteed bit value in this region";

  return (
    <figure
      className={`systems-diagram systems-diagram--logic visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive voltage-to-logic-level diagram"
    >
      <div className="logic-scale" aria-hidden="true">
        <div className="logic-scale__zone logic-scale__zone--low">
          <span>LOW</span>
          <small>0.00–0.30 V</small>
        </div>
        <div className="logic-scale__zone logic-scale__zone--undefined">
          <span>undefined</span>
          <small>0.30–0.70 V</small>
        </div>
        <div className="logic-scale__zone logic-scale__zone--high">
          <span>HIGH</span>
          <small>0.70–1.00 V</small>
        </div>
        <span
          className="logic-scale__probe"
          style={{ left: `${voltage * 100}%` }}
        />
      </div>
      <label className="logic-voltage-control">
        <span>Input voltage</span>
        <input
          className="liquid-range"
          type="range"
          aria-label="Input voltage"
          min="0"
          max="1"
          step="0.01"
          value={voltage}
          style={liquidRangeStyle(voltage, 0, 1)}
          onChange={(event) => setVoltage(Number(event.target.value))}
        />
        <output>{voltage.toFixed(2)} V</output>
      </label>
      <output className="systems-equation systems-equation--logic" aria-live="polite">
        <strong>{logicState}</strong>
        <span>{stateDescription}</span>
      </output>
      {mode === "full" ? (
        <button
          type="button"
          className="diagram-reset systems-reset"
          onClick={() => setVoltage(0.82)}
        >
          Restore signal
        </button>
      ) : null}
      <figcaption>
        Move the probe. Digital meaning comes from intervals, not one exact
        voltage.
      </figcaption>
    </figure>
  );
}

const controlModes = {
  sequence: {
    label: "Sequence",
    note: "Each completed instruction hands control to the next.",
    steps: ["read input", "convert value", "print result"],
  },
  selection: {
    label: "Selection",
    note: "A condition chooses one path for this execution.",
    steps: ["test condition", "run matching branch", "continue"],
  },
  iteration: {
    label: "Iteration",
    note: "Control returns to the test or next sequence item.",
    steps: ["take next item", "run loop body", "repeat or exit"],
  },
} as const;

type ControlMode = keyof typeof controlModes;

function ControlStructures({ mode }: { mode: DiagramMode }) {
  const [controlMode, setControlMode] = useState<ControlMode>("selection");
  const [step, setStep] = useState(0);
  const current = controlModes[controlMode];

  function selectMode(next: ControlMode) {
    setControlMode(next);
    setStep(0);
  }

  return (
    <figure
      className={`systems-diagram systems-diagram--control visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive control-flow diagram"
    >
      <div className="control-mode-tabs" role="tablist" aria-label="Control structure">
        {(Object.keys(controlModes) as ControlMode[]).map((key) => (
          <button
            type="button"
            role="tab"
            aria-selected={controlMode === key}
            className="control-mode-tab"
            key={key}
            onClick={() => selectMode(key)}
          >
            {controlModes[key].label}
          </button>
        ))}
      </div>
      <div className="control-path" aria-label={`${current.label} execution path`}>
        {current.steps.map((label, index) => (
          <div className="control-path__segment" key={label}>
            <span
              className="control-path__step"
              data-current={step === index ? "true" : undefined}
              data-complete={step > index ? "true" : undefined}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              {label}
            </span>
            {index < current.steps.length - 1 ? (
              <span className="control-path__arrow" aria-hidden="true">→</span>
            ) : null}
          </div>
        ))}
      </div>
      <output className="systems-equation systems-equation--control" aria-live="polite">
        <strong>{current.steps[step]}</strong>
        <span>{current.note}</span>
      </output>
      <div className="control-stepper" aria-label="Trace controls">
        <button
          type="button"
          className="diagram-reset"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="diagram-toggle"
          onClick={() =>
            setStep((value) =>
              value === current.steps.length - 1 ? 0 : value + 1,
            )
          }
        >
          {step === current.steps.length - 1 ? "Run again" : "Next step"}
        </button>
      </div>
      <figcaption>
        Change the control structure, then step through the route execution
        takes.
      </figcaption>
    </figure>
  );
}

const bindings = [
  { code: "x = 5", value: "5", type: "int", meaning: "whole-number value" },
  { code: "x = 0.7071", value: "0.7071", type: "float", meaning: "floating-point value" },
  { code: 'x = "KTH"', value: '"KTH"', type: "str", meaning: "three-character string" },
] as const;

function VariableBinding({ mode }: { mode: DiagramMode }) {
  const [activeBinding, setActiveBinding] = useState(0);
  const binding = bindings[activeBinding];
  const descriptionId = useId();
  const expression = useMemo(() => bindings.map(({ code }) => code), []);

  return (
    <figure
      className={`systems-diagram systems-diagram--binding visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive Python variable binding diagram"
    >
      <div className="binding-choices" role="group" aria-label="Assignments">
        {expression.map((code, index) => (
          <button
            type="button"
            className="binding-choice"
            aria-pressed={activeBinding === index}
            key={code}
            onClick={() => setActiveBinding(index)}
          >
            <code>{code}</code>
          </button>
        ))}
      </div>
      <div className="binding-map" aria-describedby={descriptionId}>
        <span className="binding-map__name">
          <small>name</small>
          <strong>x</strong>
        </span>
        <span className="binding-map__arrow" aria-hidden="true">refers to →</span>
        <span className="binding-map__value">
          <small>{binding.type}</small>
          <strong>{binding.value}</strong>
        </span>
      </div>
      <output
        id={descriptionId}
        className="systems-equation systems-equation--binding"
        aria-live="polite"
      >
        <strong>{binding.code}</strong>
        <span>The value carries type {binding.type}: {binding.meaning}.</span>
      </output>
      {mode === "full" ? (
        <button
          type="button"
          className="diagram-reset systems-reset"
          onClick={() => setActiveBinding(0)}
        >
          Restore first binding
        </button>
      ) : null}
      <figcaption>
        Rebind the same name. In Python the type travels with the value, not the
        variable name.
      </figcaption>
    </figure>
  );
}

export function StringIndexDiagram({ mode }: { mode: DiagramMode }) {
  const text = "KTH STUDY";
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);

  return (
    <figure
      className={`systems-diagram systems-diagram--string visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive Python string indexing diagram"
    >
      <div className="string-strip" aria-label={`String ${text}`}>
        {[...text].map((character, index) => (
          <span
            className="string-cell"
            data-selected={index >= start && index < end ? "true" : undefined}
            key={`${character}-${index}`}
          >
            <strong>{character === " " ? "␠" : character}</strong>
            <small>{index}</small>
          </span>
        ))}
      </div>
      <div className="string-slice-controls">
        <label>
          <span>Start index <output>{start}</output></span>
          <input
            className="liquid-range"
            type="range"
            aria-label="Start index"
            min="0"
            max={text.length - 1}
            value={start}
            style={liquidRangeStyle(start, 0, text.length - 1)}
            onChange={(event) => setStart(Math.min(Number(event.target.value), end - 1))}
          />
        </label>
        <label>
          <span>Stop index <output>{end}</output></span>
          <input
            className="liquid-range"
            type="range"
            aria-label="Stop index"
            min="1"
            max={text.length}
            value={end}
            style={liquidRangeStyle(end, 1, text.length)}
            onChange={(event) => setEnd(Math.max(Number(event.target.value), start + 1))}
          />
        </label>
      </div>
      <output className="systems-equation systems-equation--string" aria-live="polite">
        <code>text[{start}:{end}]</code>
        <span aria-hidden="true">→</span>
        <strong>“{text.slice(start, end)}”</strong>
      </output>
      {mode === "full" ? (
        <button
          type="button"
          className="diagram-reset systems-reset"
          onClick={() => {
            setStart(0);
            setEnd(3);
          }}
        >
          Restore slice
        </button>
      ) : null}
      <figcaption>
        Move the bounds. Python includes the start index and stops before the end index.
      </figcaption>
    </figure>
  );
}

export function BooleanFormsDiagram({ mode }: { mode: DiagramMode }) {
  return <DigitalArithmeticDiagram mode={mode} variant="boolean-forms" />;
}

export function SystemsDiagram({ variant, mode }: Props) {
  if (variant === "binary-place-value") return <BinaryPlaceValue mode={mode} />;
  if (variant === "logic-levels") return <LogicLevels mode={mode} />;
  if (variant === "control-structures") return <ControlStructures mode={mode} />;
  if (variant === "variable-binding") return <VariableBinding mode={mode} />;
  if (
    variant === "twos-complement" ||
    variant === "fixed-width-adder" ||
    variant === "logic-gates"
  ) {
    return (
      <DigitalArithmeticDiagram
        mode={mode}
        variant={variant as DigitalArithmeticVariant}
      />
    );
  }
  if (variant === "cmos-gates" || variant === "cmos-power") {
    return <CmosDiagram mode={mode} variant={variant as CmosVariant} />;
  }
  if (variant === "breadboard-wiring" || variant === "lab-workflow") {
    return <LabDiagram mode={mode} variant={variant as LabVariant} />;
  }
  return (
    <FunctionConceptDiagram
      mode={mode}
      variant={variant as FunctionConceptVariant}
    />
  );
}
