import { useState } from "react";

const initial = { d: 0, clock: 0, latch: 0, flipFlop: 0 };
const signals = [["d", "D"], ["clock", "Clock"], ["latch", "Latch Q"], ["flipFlop", "Flip-flop Q"]] as const;

export function StorageDiagram({ mode }: { mode: "preview" | "full" }) {
  const [history, setHistory] = useState([initial]);
  const current = history[history.length - 1];

  function toggle(input: "d" | "clock") {
    setHistory(previous => {
      const last = previous[previous.length - 1];
      const next = { ...last, [input]: 1 - last[input] };
      next.latch = next.clock ? next.d : last.latch;
      next.flipFlop = !last.clock && next.clock ? next.d : last.flipFlop;
      return [...previous.slice(-7), next];
    });
  }

  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label="Interactive D latch and rising-edge D flip-flop">
    <div className="diagram-choice-row" role="group" aria-label="Storage inputs">
      <button type="button" aria-label="Toggle D" aria-pressed={current.d === 1} onClick={() => toggle("d")}>D = {current.d}</button>
      <button type="button" aria-label="Toggle clock" aria-pressed={current.clock === 1} onClick={() => toggle("clock")}>Clock = {current.clock}</button>
      <button type="button" onClick={() => setHistory([initial])}>Reset example</button>
    </div>
    <svg viewBox="0 0 470 265" role="img" aria-label={`Recent input steps, oldest to newest. D ${history.map(s => s.d).join(", ")}; clock ${history.map(s => s.clock).join(", ")}; latch Q ${history.map(s => s.latch).join(", ")}; flip-flop Q ${history.map(s => s.flipFlop).join(", ")}.`}>
      {signals.map(([key, label], row) => {
        const baseline = 45 + row * 55;
        const path = history.map((state, index) => `${index ? "V" : `M115`} ${baseline - state[key] * 24} H${115 + (index + 1) * 42}`).join(" ");
        return <g key={key}>
          <text x="5" y={baseline - 8} fill="currentColor" fontSize="16">{label}</text>
          <path d={`M115 ${baseline} H451`} stroke="currentColor" opacity=".15" />
          <path d={path} fill="none" stroke={row < 2 ? "currentColor" : "var(--accent)"} strokeWidth="3" />
          <text x={121 + history.length * 42} y={baseline - current[key] * 24 + 5} fill="currentColor" fontSize="15">{current[key]}</text>
        </g>;
      })}
      <text x="115" y="252" fill="currentColor" fontSize="14">Last 8 states · input steps →</text>
    </svg>
    <output aria-live="polite">Latch Q = {current.latch} · {current.clock ? "transparent: follows D" : "holding"}. Flip-flop Q = {current.flipFlop} · captures D only on clock 0 → 1.</output>
    <figcaption>Raise the clock, then change D while it stays high. Only the latch follows. Each click is one input step, not elapsed time. This ideal model starts both outputs at 0 by choice; it does not simulate power-up, propagation delay, setup/hold violations or metastability.</figcaption>
  </figure>;
}
