import { useState } from "react";
import { liquidRangeStyle } from "../../rangeStyle";
import { SvgTooltip, type SvgTooltipData } from "./SvgTooltip";

type DiagramMode = "preview" | "full";
export type CmosVariant = "cmos-gates" | "cmos-power";

interface Props {
  mode: DiagramMode;
  variant: CmosVariant;
}

type Gate = "NOT" | "NAND" | "NOR";

const gateOutput = {
  NOT: (a: number) => 1 - a,
  NAND: (a: number, b: number) => 1 - (a & b),
  NOR: (a: number, b: number) => 1 - (a | b),
} as const;

function transistorState(kind: "p" | "n", input: number) {
  return kind === "p" ? input === 0 : input === 1;
}

type TooltipData = SvgTooltipData;

function Transistor({ kind, input, value, x, y, top, bottom, onShow, onClear }: {
  kind: "p" | "n";
  input: "A" | "B";
  value: number;
  x: number;
  y: number;
  top: number;
  bottom: number;
  onShow: (tooltip: TooltipData) => void;
  onClear: () => void;
}) {
  const active = transistorState(kind, value);
  const name = `${kind === "p" ? "P" : "N"}${input === "A" ? "ₐ" : "ᵦ"}`;
  const family = kind === "p" ? "pMOS" : "nMOS";
  const trigger = kind === "p" ? "0" : "1";
  const action = kind === "p" ? "pulls toward VDD" : "pulls toward ground";
  const tooltip = {
    x: x > 320 ? x - 218 : x + 24,
    y: y - 32,
    label: `${family} · ${name}`,
    detail: `${active ? "on" : "off"} now · on when ${input} = ${trigger}`,
  };

  return (
    <g
      className="diagram-hotspot cmos-transistor"
      tabIndex={0}
      role="img"
      aria-label={`${family} ${name}, controlled by input ${input}, currently ${active ? "on" : "off"}; turns on at ${input} equals ${trigger} and ${action}`}
      onMouseEnter={() => onShow(tooltip)}
      onMouseLeave={onClear}
      onFocus={() => onShow(tooltip)}
      onBlur={onClear}
    >
      {active ? (
        <rect className="cmos-device-glow" x={x - 13} y={y - 30} width="26" height="60" rx="13" />
      ) : null}
      <line
        className={`cmos-device-lead${active ? " is-active" : ""}`}
        x1={x}
        y1={top}
        x2={x}
        y2={y - 11}
      />
      <line
        className={`cmos-device-lead${active ? " is-active" : ""}`}
        x1={x}
        y1={y + 11}
        x2={x}
        y2={bottom}
      />
      <circle className={`cmos-device-contact${active ? " is-active" : ""}`} cx={x} cy={y - 11} r="4" />
      <circle className={`cmos-device-contact${active ? " is-active" : ""}`} cx={x} cy={y + 11} r="4" />
      <line
        className={`cmos-device-switch${active ? " is-active" : ""}`}
        x1={x}
        y1={y - 11}
        x2={active ? x : x + 13}
        y2={active ? y + 11 : y + 5}
      />
      <line className="cmos-device-gate" x1={x - 34} y1={y} x2={x - 12} y2={y} />
      {kind === "p" ? (
        <circle className="cmos-device-bubble" cx={x - 8} cy={y} r="4" />
      ) : null}
      <text className="cmos-device-label" x={x - 43} y={y - 9}>{name}</text>
      <text className="cmos-device-input" x={x - 43} y={y + 17}>{input}={value}</text>
      <rect
        className="diagram-hotspot-hit"
        x={x - 54}
        y={y - 32}
        width="82"
        height="64"
        rx="12"
      />
    </g>
  );
}

function RailLabel({ x, y, label, detail, tooltipX, tooltipY, onShow, onClear }: {
  x: number;
  y: number;
  label: string;
  detail: string;
  tooltipX: number;
  tooltipY: number;
  onShow: (tooltip: TooltipData) => void;
  onClear: () => void;
}) {
  return (
    <g
      className="diagram-hotspot cmos-rail-label"
      tabIndex={0}
      role="img"
      aria-label={`${label}: ${detail}`}
      onMouseEnter={() => onShow({ x: tooltipX, y: tooltipY, label, detail })}
      onMouseLeave={onClear}
      onFocus={() => onShow({ x: tooltipX, y: tooltipY, label, detail })}
      onBlur={onClear}
    >
      <text x={x} y={y} textAnchor="middle">{label}</text>
      <rect
        className="diagram-hotspot-hit"
        x={x - 42}
        y={y - 23}
        width="84"
        height="30"
        rx="10"
      />
    </g>
  );
}

function CmosGates() {
  const [gate, setGate] = useState<Gate>("NAND");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData>();
  const output = gate === "NOT" ? gateOutput.NOT(a) : gateOutput[gate](a, b);
  const pA = transistorState("p", a);
  const pB = transistorState("p", b);
  const nA = transistorState("n", a);
  const nB = transistorState("n", b);
  const inputs = gate === "NOT" ? [{ name: "A", value: a, set: setA }] : [
    { name: "A", value: a, set: setA },
    { name: "B", value: b, set: setB },
  ];

  return (
    <figure
      className="systems-diagram cmos-diagram visual-topic--systems"
      aria-label="Interactive CMOS gate network"
    >
      <div className="diagram-choice-row" role="tablist" aria-label="CMOS gate">
        {(["NOT", "NAND", "NOR"] as const).map((name) => (
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
      <div className="cmos-stage">
        <div className="cmos-inputs" role="group" aria-label="Gate inputs">
          {inputs.map((input) => (
            <button
              type="button"
              aria-label={`Input ${input.name} is ${input.value}`}
              aria-pressed={input.value === 1}
              key={input.name}
              onClick={() => input.set(1 - input.value)}
            >
              <small>{input.name}</small>
              <strong>{input.value}</strong>
            </button>
          ))}
        </div>
        <svg viewBox="0 0 560 370" role="img" aria-label={`${gate} CMOS network output ${output}`}>
          <RailLabel x={280} y={24} label="VDD" detail="positive supply rail" tooltipX={304} tooltipY={7} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
          <line className="cmos-rail" x1="130" y1="42" x2="430" y2="42" />
          <line className="cmos-rail" x1="130" y1="326" x2="430" y2="326" />
          <RailLabel x={280} y={360} label="GND" detail="0 V reference rail" tooltipX={304} tooltipY={292} onShow={setTooltip} onClear={() => setTooltip(undefined)} />

          {gate === "NOT" ? (
            <>
              <Transistor kind="p" input="A" value={a} x={280} y={105} top={42} bottom={180} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="n" input="A" value={a} x={280} y={252} top={180} bottom={326} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
            </>
          ) : gate === "NAND" ? (
            <>
              <line className={`cmos-wire${pA ? " is-active" : ""}`} x1="200" y1="180" x2="280" y2="180" />
              <line className={`cmos-wire${pB ? " is-active" : ""}`} x1="280" y1="180" x2="360" y2="180" />
              <Transistor kind="p" input="A" value={a} x={200} y={108} top={42} bottom={180} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="p" input="B" value={b} x={360} y={108} top={42} bottom={180} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="n" input="A" value={a} x={280} y={218} top={180} bottom={252} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="n" input="B" value={b} x={280} y={288} top={252} bottom={326} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
            </>
          ) : (
            <>
              <Transistor kind="p" input="A" value={a} x={280} y={78} top={42} bottom={112} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="p" input="B" value={b} x={280} y={146} top={112} bottom={180} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <line className={`cmos-wire${nA ? " is-active" : ""}`} x1="200" y1="180" x2="280" y2="180" />
              <line className={`cmos-wire${nB ? " is-active" : ""}`} x1="280" y1="180" x2="360" y2="180" />
              <Transistor kind="n" input="A" value={a} x={200} y={252} top={180} bottom={326} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
              <Transistor kind="n" input="B" value={b} x={360} y={252} top={180} bottom={326} onShow={setTooltip} onClear={() => setTooltip(undefined)} />
            </>
          )}
          <line className="cmos-output is-active" x1="280" y1="180" x2="475" y2="180" />
          <circle className="cmos-output is-active" cx="280" cy="180" r="6" />
          <g
            className="diagram-hotspot cmos-output-hotspot"
            tabIndex={0}
            role="img"
            aria-label={`Y: gate output, currently ${output === 1 ? "HIGH" : "LOW"}`}
            onMouseEnter={() => setTooltip({ x: 330, y: 190, label: "Y · output", detail: output ? "HIGH · connected to VDD" : "LOW · connected to ground" })}
            onMouseLeave={() => setTooltip(undefined)}
            onFocus={() => setTooltip({ x: 330, y: 190, label: "Y · output", detail: output ? "HIGH · connected to VDD" : "LOW · connected to ground" })}
            onBlur={() => setTooltip(undefined)}
          >
            <text className="cmos-output-label" x="496" y="186">Y={output}</text>
            <rect className="diagram-hotspot-hit" x="478" y="160" width="70" height="36" rx="10" />
          </g>
          {tooltip ? <SvgTooltip {...tooltip} /> : null}
        </svg>
      </div>
      <div className="cmos-legend" aria-label="CMOS network legend">
        <span><b>pMOS</b> closes at 0 and pulls up</span>
        <span><b>nMOS</b> closes at 1 and pulls down</span>
        <span><i aria-hidden="true" /> conducting now</span>
      </div>
      <output className="digital-readout" aria-live="polite">
        <strong>{gate}: Y = {output}</strong>
        <span>{output ? "Pull-up network conducts" : "Pull-down network conducts"}</span>
        <span>pMOS turns on at 0 · nMOS turns on at 1</span>
      </output>
      <figcaption>
        Toggle the inputs. The highlighted transistors form the conducting path from one supply rail to the output.
      </figcaption>
    </figure>
  );
}

function VisualTerm({ children, meaning }: { children: string; meaning: string }) {
  return (
    <span
      className="visual-term"
      tabIndex={0}
      data-tooltip={meaning}
      aria-label={`${children}: ${meaning}`}
    >
      {children}
    </span>
  );
}

function CmosPower({ mode }: { mode: DiagramMode }) {
  const [voltage, setVoltage] = useState(1.2);
  const [capacitance, setCapacitance] = useState(20);
  const [frequency, setFrequency] = useState(1);
  const [leakage, setLeakage] = useState(20);
  const dynamic = 0.5 * capacitance * voltage ** 2 * frequency;
  const staticPower = leakage * voltage / 1000;
  const total = dynamic + staticPower;

  const controls = [
    { label: "Supply voltage", value: voltage, unit: "V", min: 0.5, max: 5, step: 0.1, set: setVoltage },
    { label: "Capacitance", value: capacitance, unit: "nF", min: 1, max: 40, step: 1, set: setCapacitance },
    { label: "Frequency", value: frequency, unit: "GHz", min: 0.1, max: 3, step: 0.1, set: setFrequency },
    { label: "Leakage current", value: leakage, unit: "mA", min: 0, max: 50, step: 1, set: setLeakage },
  ];

  return (
    <figure
      className="systems-diagram cmos-power visual-topic--systems"
      aria-label="Interactive CMOS power model"
    >
      <div className="power-stage">
        <section className="power-component power-component--dynamic">
          <header>
            <span>Switching power</span>
            <strong>{dynamic.toFixed(3)} W</strong>
          </header>
          <p className="power-formula">
            ½ · <VisualTerm meaning="effective switched capacitance">C</VisualTerm> · <VisualTerm meaning="supply voltage, squared">V²</VisualTerm> · <VisualTerm meaning="switching frequency">f</VisualTerm>
          </p>
          <p>Only while nodes switch · voltage has a squared effect</p>
        </section>
        <section className="power-component power-component--static">
          <header>
            <span>Leakage power</span>
            <strong>{staticPower.toFixed(3)} W</strong>
          </header>
          <p className="power-formula">
            <VisualTerm meaning="leakage current while idle">Iₗₑₐₖ</VisualTerm> · <VisualTerm meaning="supply voltage">V</VisualTerm>
          </p>
          <p>Present even while idle · changes with leakage and voltage</p>
        </section>
      </div>
      <output className="power-equation" aria-live="polite">
        <strong>Total power</strong>
        <span>{total.toFixed(3)} W</span>
      </output>
      <div className="digital-sliders cmos-power-controls">
        {controls.slice(0, mode === "full" ? controls.length : 1).map((control) => (
          <label key={control.label}>
            <span>{control.label}</span>
            <output>{control.value.toFixed(control.step < 1 ? 1 : 0)} {control.unit}</output>
            <input
              className="liquid-range"
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              aria-label={control.label}
              style={liquidRangeStyle(control.value, control.min, control.max)}
              onChange={(event) => control.set(Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <figcaption>
        Change the supply voltage: switching power follows V², while leakage power follows V. In the full visual, the other terms can be varied independently.
      </figcaption>
    </figure>
  );
}

export function CmosDiagram({ mode, variant }: Props) {
  return variant === "cmos-gates" ? <CmosGates /> : <CmosPower mode={mode} />;
}
