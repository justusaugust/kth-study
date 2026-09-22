import { useState } from "react";

export function MultiplexerDiagram({ mode }: { mode: "preview" | "full" }) {
  const [bits, setBits] = useState([0, 1, 0]);
  const [d0, d1, select] = bits;
  const output = select ? d1 : d0;
  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label="Interactive 2-to-1 multiplexer">
    <svg viewBox="0 0 440 230" role="img" aria-label={`S=${select} selects D${select}; output Y=${output}`}>
      <path d="M175 35 L275 65 L275 165 L175 195 Z" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
      {[d0, d1].map((bit, index) => <g key={index}>
        <path d={`M80 ${75 + index * 80} H175`} stroke={select === index ? "var(--accent)" : "currentColor"} opacity={select === index ? 1 : .35} strokeWidth={select === index ? 4 : 2} />
        <text x="15" y={80 + index * 80} fill="currentColor" fontSize="17">D{index} = {bit}</text>
        <text x="190" y={80 + index * 80} fill="currentColor" fontSize="16">{index}</text>
      </g>)}
      <path d={`M175 ${75 + select * 80} L275 115 H330`} fill="none" stroke="var(--accent)" strokeWidth="4" />
      <text x="342" y="121" fill="currentColor" fontSize="19">Y = {output}</text>
      <text x="225" y="224" textAnchor="middle" fill="currentColor" fontSize="17">S = {select}</text>
    </svg>
    <div className="diagram-choice-row" role="group" aria-label="Multiplexer input bits">
      {["D0", "D1", "S"].map((label, index) => <button type="button" key={label} aria-label={`Toggle ${label}`} aria-pressed={bits[index] === 1} onClick={() => setBits(current => current.map((bit, i) => i === index ? 1 - bit : bit))}>{label} = {bits[index]}</button>)}
    </div>
    <output aria-live="polite">S = {select}: Y = D{select} = {output}</output>
    <figcaption>The highlighted path carries the selected bit. This shows settled logic, not physical switching delay.</figcaption>
  </figure>;
}
