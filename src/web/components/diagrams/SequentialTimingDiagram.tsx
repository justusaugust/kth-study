import { useState } from "react";
import { liquidRangeStyle } from "../../rangeStyle";

const x = (time: number) => time + 80;
const margin = (slack: number) => slack < 0 ? "violated" : slack === 0 ? "at the limit" : "met";

export function SequentialTimingDiagram({ mode }: { mode: "preview" | "full" }) {
  const [period, setPeriod] = useState(240);
  const [skew, setSkew] = useState(0);
  const capture = period + skew;
  const deadline = capture - 40;
  const holdBoundary = skew + 50;
  const setupSlack = deadline - 170;
  const holdSlack = 65 - holdBoundary;

  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label="Interactive sequential setup and hold timing budget">
    <p>Skew s = capture-clock arrival − launch-clock arrival. Positive s means the capture clock arrives later.</p>
    <svg viewBox="0 0 560 310" role="img" aria-label={`Time in picoseconds relative to launch at 0. Data can change from 65 to 170. Same-cycle capture edge ${skew}, hold boundary ${holdBoundary}. Next capture edge ${capture}, setup deadline ${deadline}.`}>
      {[0, 100, 200, 300, 400].map(time => <g key={time}>
        <path d={`M${x(time)} 25 V260`} stroke="currentColor" opacity={time === 0 ? .5 : .12} strokeDasharray={time === 0 ? "3 4" : undefined} />
        <text x={x(time)} y="283" textAnchor="middle" fill="currentColor" fontSize="15">{time}</text>
      </g>)}
      <g fill="currentColor" fontSize="17">
        <text x="40" y="43">Data arrival: earliest 65 · latest 170 ps</text>
        <text x="40" y="113">Hold window: {skew} to {holdBoundary} ps</text>
        <text x="40" y="183">Setup window: {deadline} to {capture} ps</text>
      </g>
      <path d={`M${x(65)} 70 H${x(170)}`} stroke="var(--accent)" strokeWidth="12" />
      <path d={`M${x(65)} 80 V152 M${x(170)} 80 V222`} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d={`M${x(skew)} 140 H${x(holdBoundary)}`} stroke="currentColor" strokeWidth="9" strokeDasharray="4 3" />
      <path d={`M${x(deadline)} 210 H${x(capture)}`} stroke="currentColor" strokeWidth="9" />
      <path d={`M${x(65)} 60 V80 M${x(170)} 60 V80 M${x(skew)} 128 V152 M${x(holdBoundary)} 128 V152 M${x(deadline)} 198 V222 M${x(capture)} 198 V222`} stroke="currentColor" strokeWidth="2" />
      <text x="40" y="250" fill="currentColor" fontSize="15">Launch = 0 · shared time axis (ps)</text>
    </svg>
    <label className="function-input-control">
      <span>Clock period T = {period} ps</span>
      <input aria-label="Clock period (ps)" className="liquid-range" type="range" min="100" max="400" step="10" value={period} style={liquidRangeStyle(period, 100, 400)} onChange={event => setPeriod(Number(event.target.value))} />
    </label>
    <label className="function-input-control">
      <span>Capture skew s = {skew} ps</span>
      <input aria-label="Capture skew (ps)" className="liquid-range" type="range" min="-30" max="30" step="5" value={skew} style={liquidRangeStyle(skew, -30, 30)} onChange={event => setSkew(Number(event.target.value))} />
    </label>
    <output aria-live="polite">
      Setup slack = {setupSlack} ps ({margin(setupSlack)}). Hold slack = {holdSlack} ps ({margin(holdSlack)}).
    </output>
    <p>Setup: T + s − 50 − 120 − 40. Hold: 30 + 35 − 50 − s. Zero slack meets the ideal bound with no margin.</p>
    <figcaption>Clock-to-Q min/max: 30/50 ps; logic min/max: 35/120 ps; setup: 40 ps; hold: 50 ps. New data must arrive no earlier than the same-cycle hold boundary and no later than the next-cycle setup deadline. Increasing T helps setup but cannot repair hold. These bars show timing bounds, not signal waveforms or a metastability simulation.</figcaption>
  </figure>;
}
