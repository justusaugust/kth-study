import { useState } from "react";

export function StateMachineDiagram({ mode }: { mode: "preview" | "full" }) {
  const [input, setInput] = useState(0);
  const [parity, setParity] = useState(0);
  const [count, setCount] = useState(0);
  const names = ["Even", "Odd"];
  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label="Interactive parity state machine">
    <svg viewBox="0 0 440 210" role="img" aria-label={`Current state ${names[parity]}. Input 1 switches states; input 0 keeps the state.`}>
      <path d="M150 75 Q220 15 290 75 M290 130 Q220 190 150 130" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M280 65 L290 75 L276 75 M163 130 L150 130 L158 142" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="220" y="37" textAnchor="middle" fill="currentColor">1</text>
      <text x="220" y="179" textAnchor="middle" fill="currentColor">1</text>
      {[0, 1].map(state => <g key={state}>
        <circle cx={110 + state * 220} cy="105" r="48" fill="var(--sheet-inset)" stroke={state === parity ? "var(--accent)" : "currentColor"} strokeWidth={state === parity ? 4 : 1} />
        <text x={110 + state * 220} y="100" textAnchor="middle" fill="currentColor">{names[state]}</text>
        <text x={110 + state * 220} y="122" textAnchor="middle" fill="currentColor">Y = {state}</text>
      </g>)}
      <text x="220" y="205" textAnchor="middle" fill="currentColor">Input 0: stay in the current state</text>
    </svg>
    <div className="diagram-choice-row" role="group" aria-label="Parity machine controls">
      <button type="button" aria-pressed={input === 1} onClick={() => setInput(1 - input)}>Next input = {input}</button>
      <button type="button" onClick={() => { setParity(parity ^ input); setCount(count + 1); }}>Clock one bit</button>
      <button type="button" onClick={() => { setInput(0); setParity(0); setCount(0); }}>Reset machine</button>
    </div>
    <output aria-live="polite">Current: {names[parity]} · Y = {parity} · Next: {names[parity ^ input]} · Bits clocked: {count}</output>
    <figcaption>A Moore machine: Y depends only on the current state. Choosing an input does not clock it; repeated clock presses sample that input repeatedly. Reset starts with an even count of ones.</figcaption>
  </figure>;
}
