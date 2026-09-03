import { useState } from "react";

type DiagramMode = "preview" | "full";
export type LabVariant = "breadboard-wiring" | "lab-workflow";

interface Props {
  mode: DiagramMode;
  variant: LabVariant;
}

const holeGroups = [
  { id: "rail-left", label: "+ rail, left half", rail: true },
  { id: "rail-right", label: "+ rail, right half", rail: true },
  { id: "row-a", label: "terminal row A", rail: false },
  { id: "row-b", label: "terminal row B", rail: false },
] as const;

function BreadboardWiring({ mode }: { mode: DiagramMode }) {
  const [selected, setSelected] = useState(["rail-left", "rail-right"]);
  const [bridged, setBridged] = useState(false);
  const [first, second] = selected;
  const connected = first === second || (bridged && first?.startsWith("rail-") && second?.startsWith("rail-"));

  function probe(id: string) {
    setSelected((current) => current.length === 1 ? [current[0], id] : [id]);
  }

  return (
    <figure className={`systems-diagram lab-diagram lab-diagram--board visual-topic--systems systems-diagram--${mode}`} aria-label="Interactive breadboard continuity tester">
      <div className="breadboard" role="group" aria-label="Breadboard nodes">
        {holeGroups.map((group) => (
          <div className="breadboard__group" data-rail={group.rail || undefined} key={group.id}>
            <span>{group.label}</span>
            <div>
              {[0, 1, 2, 3, 4].map((hole) => (
                <button
                  type="button"
                  key={hole}
                  aria-label={`Probe ${group.label}, hole ${hole + 1}`}
                  aria-pressed={selected.includes(group.id)}
                  onClick={() => probe(group.id)}
                />
              ))}
            </div>
          </div>
        ))}
        <span className="breadboard__groove" aria-label="Centre break">centre break</span>
      </div>
      <output className="lab-meter" data-connected={connected || undefined} aria-live="polite">
        <small>Continuity</small>
        <strong>{selected.length < 2 ? "Choose a second node" : connected ? "Same electrical node" : "Open circuit"}</strong>
        <span>{bridged ? "Power-rail halves are bridged." : "The long rail is interrupted at the centre."}</span>
      </output>
      {mode === "full" ? (
        <button type="button" className="diagram-toggle" aria-pressed={bridged} onClick={() => setBridged((value) => !value)}>
          {bridged ? "Remove rail bridge" : "Bridge the power rail"}
        </button>
      ) : null}
      <figcaption>Probe two holes. Visual proximity does not determine electrical continuity.</figcaption>
    </figure>
  );
}

const workflow = [
  ["Specify", "Truth table or Boolean function"],
  ["Draw", "Complete schematic and IC pin numbers"],
  ["Simulate", "Expected output for every relevant input"],
  ["Wire", "Verified rails, orientation, and connections"],
  ["Test", "Observed output and corrected failures"],
  ["Record", "Demonstration, diagram, results, and photograph"],
] as const;

function LabWorkflow({ mode }: { mode: DiagramMode }) {
  const [step, setStep] = useState(0);

  return (
    <figure className={`systems-diagram lab-diagram lab-diagram--workflow visual-topic--systems systems-diagram--${mode}`} aria-label="Interactive laboratory evidence workflow">
      <ol className="lab-trace">
        {workflow.map(([label], index) => (
          <li key={label}>
            <button type="button" aria-current={step === index ? "step" : undefined} data-complete={index < step || undefined} onClick={() => setStep(index)}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
      <output className="lab-meter" aria-live="polite">
        <small>Evidence at this step</small>
        <strong>{workflow[step][0]}</strong>
        <span>{workflow[step][1]}</span>
      </output>
      {mode === "full" ? (
        <div className="control-stepper">
          <button type="button" className="diagram-reset" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Previous</button>
          <button type="button" className="diagram-toggle" onClick={() => setStep((value) => value === workflow.length - 1 ? 0 : value + 1)}>{step === workflow.length - 1 ? "Start again" : "Next step"}</button>
        </div>
      ) : null}
      <figcaption>A reliable result keeps specification, circuit, observation, and report consistent.</figcaption>
    </figure>
  );
}

export function LabDiagram({ mode, variant }: Props) {
  return variant === "breadboard-wiring" ? <BreadboardWiring mode={mode} /> : <LabWorkflow mode={mode} />;
}
