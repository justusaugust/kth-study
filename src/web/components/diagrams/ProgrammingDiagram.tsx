import { useState } from "react";

export function ProgrammingDiagram({ variant, mode }: {
  variant: "reference-aliasing" | "tree-traversal";
  mode: "preview" | "full";
}) {
  const [value, setValue] = useState(2);
  const [rebound, setRebound] = useState(false);
  const [order, setOrder] = useState("Inorder");
  const [step, setStep] = useState(0);
  const visits = order === "Preorder" ? [4, 2, 6] : order === "Inorder" ? [2, 4, 6] : [2, 6, 4];
  return <figure className={`systems-diagram systems-diagram--${mode}`} aria-label={variant === "reference-aliasing" ? "References and shared mutation" : "Binary tree traversal"}>
    {variant === "reference-aliasing" ? <>
      <div className="binding-map" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="binding-map__name">a → Counter A: <strong>{value}</strong></div>
        <div className="binding-map__name">b → Counter {rebound ? "B: 9" : `A: ${value}`}</div>
      </div>
      <div className="binding-choices">
        <button type="button" className="diagram-reset" onClick={() => setValue(v => v + 1)}>Increment through a</button>
        <button type="button" className="diagram-reset" disabled={rebound} onClick={() => setRebound(true)}>Rebind b to a new counter</button>
      </div>
      <output className="systems-equation" aria-live="polite">{rebound ? "Two objects: changing A leaves B unchanged." : "One shared object: both names observe its value."}</output>
      <button type="button" className="diagram-reset" onClick={() => { setValue(2); setRebound(false); }}>Reset references</button>
      <figcaption>Mutation changes an object. Rebinding points a name at a different object.</figcaption>
    </> : <>
      <div className="binding-choices" role="group" aria-label="Traversal order">
        {["Preorder", "Inorder", "Postorder"].map(name => <button type="button" className="binding-choice" key={name} aria-pressed={order === name} onClick={() => { setOrder(name); setStep(0); }}>{name}</button>)}
      </div>
      <svg viewBox="0 0 320 180" role="img" aria-label="Binary search tree: root 4, left child 2, right child 6" style={{ width: "100%", maxHeight: 240 }}>
        <path d="M160 45L70 130M160 45L250 130" fill="none" stroke="currentColor" opacity=".35" strokeWidth="2" />
        {[[4,160,40],[2,70,135],[6,250,135]].map(([n,x,y]) => <g key={n}>
          <circle cx={x} cy={y} r="27" fill="var(--surface, Canvas)" stroke="currentColor" strokeWidth={visits[step - 1] === n ? 4 : 1} />
          <text x={x} y={y + 7} textAnchor="middle" fill="currentColor" fontSize="22">{n}</text>
        </g>)}
      </svg>
      <output className="systems-equation" aria-live="polite">{step ? `Visited: ${visits.slice(0, step).join(" → ")}` : "Choose an order, then visit the first node."}</output>
      <div className="binding-choices">
        <button type="button" className="diagram-reset" disabled={step === visits.length} onClick={() => setStep(s => s + 1)}>Visit next node</button>
        <button type="button" className="diagram-reset" onClick={() => setStep(0)}>Restart traversal</button>
      </div>
      <figcaption>{order === "Preorder" ? "Root, left, right." : order === "Inorder" ? "Left, root, right. This tree obeys the search-tree invariant, so the result is sorted." : "Left, right, root."}</figcaption>
    </>}
  </figure>;
}
