import { useMemo, useState } from "react";
import { liquidRangeStyle } from "../../rangeStyle";

type DiagramMode = "preview" | "full";
export type DigitalArithmeticVariant =
  | "twos-complement"
  | "fixed-width-adder"
  | "logic-gates"
  | "boolean-forms";

interface Props {
  mode: DiagramMode;
  variant: DigitalArithmeticVariant;
}

const minus = "−";

function binary(value: number, width: number) {
  return value.toString(2).padStart(width, "0").slice(-width);
}

function signedValue(bits: string) {
  const unsigned = Number.parseInt(bits, 2);
  return bits[0] === "1" ? unsigned - 2 ** bits.length : unsigned;
}

function decimal(value: number) {
  return value < 0 ? `${minus}${Math.abs(value)}` : String(value);
}

function TwosComplement({ mode }: { mode: DiagramMode }) {
  const [bits, setBits] = useState("1001");
  const width = bits.length;
  const signed = signedValue(bits);

  function toggleBit(index: number) {
    setBits((current) =>
      current
        .split("")
        .map((bit, position) =>
          position === index ? (bit === "1" ? "0" : "1") : bit,
        )
        .join(""),
    );
  }

  function changeWidth() {
    setBits((current) =>
      current.length === 4
        ? `${current[0].repeat(4)}${current}`
        : current.slice(-4),
    );
  }

  return (
    <figure
      className={`systems-diagram digital-diagram digital-diagram--twos visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive two's-complement register"
    >
      <div className="signed-register" role="group" aria-label={`${width}-bit two's-complement word`}>
        {bits.split("").map((bit, index) => {
          const exponent = width - index - 1;
          const weight = index === 0 ? -(2 ** exponent) : 2 ** exponent;
          return (
            <button
              type="button"
              className="signed-bit"
              data-sign={index === 0 ? "true" : undefined}
              data-active={bit === "1" ? "true" : undefined}
              aria-label={`Bit ${index} with weight ${weight} is ${bit}`}
              aria-pressed={bit === "1"}
              key={`${width}-${index}`}
              onClick={() => toggleBit(index)}
            >
              <span>{bit}</span>
              <small>{weight}</small>
            </button>
          );
        })}
      </div>
      <output className="digital-readout" aria-live="polite">
        <strong>{bits}₂</strong>
        <span>{decimal(signed)}₁₀</span>
        <span>{width}-bit range {minus}{2 ** (width - 1)}…{2 ** (width - 1) - 1}</span>
      </output>
      {mode === "full" ? (
        <button type="button" className="diagram-toggle" onClick={changeWidth}>
          {width === 4 ? "Sign extend to 8 bits" : "Return to 4 bits"}
        </button>
      ) : null}
      <figcaption>
        The leading bit has negative weight. Sign extension repeats it, so the value stays fixed while the register grows.
      </figcaption>
    </figure>
  );
}

function FixedWidthAdder({ mode }: { mode: DiagramMode }) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const width = 4;
  const modulus = 2 ** width;
  const raw = a + b;
  const wrappedUnsigned = ((raw % modulus) + modulus) % modulus;
  const wrappedBits = binary(wrappedUnsigned, width);
  const wrapped = signedValue(wrappedBits);
  const overflow = (a >= 0 && b >= 0 && wrapped < 0) || (a < 0 && b < 0 && wrapped >= 0);

  return (
    <figure
      className={`systems-diagram digital-diagram digital-diagram--adder visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive four-bit two's-complement adder"
    >
      <div className="adder-stack" aria-label={`${a} plus ${b} in four bits`}>
        <span><small>A</small><strong>{binary((a + modulus) % modulus, width)}</strong><em>{decimal(a)}</em></span>
        <span><small>B</small><strong>{binary((b + modulus) % modulus, width)}</strong><em>{decimal(b)}</em></span>
        <output><small>4-bit result</small><strong>{wrappedBits}</strong><em>{decimal(wrapped)}</em></output>
      </div>
      <output className="digital-readout digital-readout--adder" aria-live="polite">
        <strong>{wrappedBits}₂ → {decimal(wrapped)}₁₀</strong>
        <span>{overflow ? "Signed overflow" : "Representable result"}</span>
        <span>Exact sum {decimal(raw)}</span>
      </output>
      {mode === "full" ? (
        <div className="digital-sliders">
          {[
            { label: "Operand A", value: a, set: setA },
            { label: "Operand B", value: b, set: setB },
          ].map((operand) => (
            <label key={operand.label}>
              <span>{operand.label}</span>
              <output>{decimal(operand.value)}</output>
              <input
                className="liquid-range"
                type="range"
                min="-8"
                max="7"
                step="1"
                value={operand.value}
                aria-label={operand.label}
                style={liquidRangeStyle(operand.value, -8, 7)}
                onChange={(event) => operand.set(Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      ) : null}
      <figcaption>
        Four-bit addition wraps modulo 16. Overflow is about the signed range, not the carry bit alone.
      </figcaption>
    </figure>
  );
}

const gates = {
  AND: (a: number, b: number) => a & b,
  OR: (a: number, b: number) => a | b,
  XOR: (a: number, b: number) => a ^ b,
  NAND: (a: number, b: number) => 1 - (a & b),
  NOR: (a: number, b: number) => 1 - (a | b),
  XNOR: (a: number, b: number) => 1 - (a ^ b),
} as const;

type GateName = keyof typeof gates;

function LogicGates({ mode }: { mode: DiagramMode }) {
  const [gate, setGate] = useState<GateName>("AND");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const output = gates[gate](a, b);
  const rows = useMemo(
    () => ([0, 1] as const).flatMap((left) =>
      ([0, 1] as const).map((right) => ({ left, right, output: gates[gate](left, right) })),
    ),
    [gate],
  );

  return (
    <figure
      className={`systems-diagram digital-diagram digital-diagram--gates visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive logic gate and truth table"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="Logic gate">
        {(Object.keys(gates) as GateName[]).map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={gate === name}
            key={name}
            onClick={() => setGate(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="gate-stage">
        <div className="gate-inputs">
          {[
            { name: "A", value: a, set: setA },
            { name: "B", value: b, set: setB },
          ].map((input) => (
            <button
              type="button"
              aria-label={`Input ${input.name} is ${input.value}`}
              aria-pressed={input.value === 1}
              key={input.name}
              onClick={() => input.set(1 - input.value)}
            >
              <small>{input.name}</small><strong>{input.value}</strong>
            </button>
          ))}
        </div>
        <span className="gate-body"><small>gate</small><strong>{gate}</strong></span>
        <output><small>output</small><strong>Y = {output}</strong></output>
      </div>
      {mode === "full" ? (
        <div className="truth-table" role="table" aria-label={`${gate} truth table`}>
          {rows.map((row) => (
            <span
              role="row"
              data-current={row.left === a && row.right === b ? "true" : undefined}
              key={`${row.left}-${row.right}`}
            >
              <span role="cell">{row.left}</span>
              <span role="cell">{row.right}</span>
              <strong role="cell">{row.output}</strong>
            </span>
          ))}
        </div>
      ) : null}
      <figcaption>
        Choose a gate and toggle its inputs. The highlighted truth-table row is the circuit's current state.
      </figcaption>
    </figure>
  );
}

const canonicalRows = [
  { a: 0, b: 0, minterm: "¬A·¬B", maxterm: "(A+B)" },
  { a: 0, b: 1, minterm: "¬A·B", maxterm: "(A+¬B)" },
  { a: 1, b: 0, minterm: "A·¬B", maxterm: "(¬A+B)" },
  { a: 1, b: 1, minterm: "A·B", maxterm: "(¬A+¬B)" },
] as const;

const booleanPresets = {
  OR: [0, 1, 1, 1],
  XOR: [0, 1, 1, 0],
  AND: [0, 0, 0, 1],
} as const;

const simplifiedForms: Record<string, string> = {
  "0000": "0",
  "0001": "A·B",
  "0011": "A",
  "0101": "B",
  "0110": "A ⊕ B",
  "0111": "A+B",
  "1000": "¬(A+B)",
  "1001": "A ⊙ B",
  "1010": "¬B",
  "1100": "¬A",
  "1110": "¬(A·B)",
  "1111": "1",
};

function BooleanForms({ mode }: { mode: DiagramMode }) {
  const [outputs, setOutputs] = useState<number[]>([0, 1, 1, 1]);
  const key = outputs.join("");
  const activePreset = Object.entries(booleanPresets).find(([, values]) =>
    values.every((value, index) => value === outputs[index]),
  )?.[0];
  const sop = canonicalRows
    .filter((_, index) => outputs[index] === 1)
    .map((row) => row.minterm)
    .join(" + ") || "0";
  const pos = canonicalRows
    .filter((_, index) => outputs[index] === 0)
    .map((row) => row.maxterm)
    .join("·") || "1";

  function toggleOutput(index: number) {
    setOutputs((current) =>
      current.map((value, position) =>
        position === index ? 1 - value : value,
      ),
    );
  }

  return (
    <figure
      className={`systems-diagram digital-diagram boolean-builder visual-topic--systems systems-diagram--${mode}`}
      aria-label="Interactive Boolean canonical-form builder"
    >
      {mode === "full" ? (
        <div className="diagram-choice-row" role="tablist" aria-label="Example functions">
          {(Object.keys(booleanPresets) as Array<keyof typeof booleanPresets>).map((name) => (
            <button
              type="button"
              role="tab"
              aria-selected={activePreset === name}
              key={name}
              onClick={() => setOutputs([...booleanPresets[name]])}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="boolean-table" role="table" aria-label="Two-input truth table">
        <div className="boolean-table__heading" role="row">
          <span role="columnheader">A</span>
          <span role="columnheader">B</span>
          <span role="columnheader">Y</span>
          <span role="columnheader">Selected term</span>
        </div>
        {canonicalRows.map((row, index) => (
          <div role="row" data-active={outputs[index] === 1 ? "true" : undefined} key={`${row.a}-${row.b}`}>
            <span role="cell">{row.a}</span>
            <span role="cell">{row.b}</span>
            <span role="cell">
              <button
                type="button"
                aria-label={`A ${row.a}, B ${row.b}, output ${outputs[index]}. Toggle output.`}
                aria-pressed={outputs[index] === 1}
                onClick={() => toggleOutput(index)}
              >
                {outputs[index]}
              </button>
            </span>
            <span role="cell">{outputs[index] ? row.minterm : row.maxterm}</span>
          </div>
        ))}
      </div>
      <output className="boolean-equations" aria-live="polite">
        <span><small>Canonical SOP · rows where Y = 1</small><strong>{sop}</strong></span>
        <span><small>Canonical POS · rows where Y = 0</small><strong>{pos}</strong></span>
        <span className="boolean-equations__result">
          <small>Recognised simplification</small>
          <strong>{simplifiedForms[key] ?? "Use Boolean identities to reduce it"}</strong>
        </span>
      </output>
      <figcaption>
        Toggle any output. Ones contribute minterms to SOP; zeros contribute maxterms to POS. Both equations preserve the same truth table.
      </figcaption>
    </figure>
  );
}

export function DigitalArithmeticDiagram({ mode, variant }: Props) {
  if (variant === "twos-complement") return <TwosComplement mode={mode} />;
  if (variant === "fixed-width-adder") return <FixedWidthAdder mode={mode} />;
  if (variant === "boolean-forms") return <BooleanForms mode={mode} />;
  return <LogicGates mode={mode} />;
}
