import { FormEvent, useEffect, useState } from "react";
import type { PendingAsk, StudyStatus } from "../../domain/api";
import { cancelPendingAsk, createPendingAsk, getPendingAsks, getStudyState, setStudyStatus, undoStudyStatus } from "../api";
import { SectionMarker, StudyIcon } from "./StudyMark";

export function StudyActions({ entityId, sourceUrl, register }: { entityId: string; sourceUrl: string; register?: string }) {
  const [status, setStatus] = useState<StudyStatus>("clear");
  const [undoId, setUndoId] = useState<string>();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [composer, setComposer] = useState(false);
  const [question, setQuestion] = useState("");
  const [asks, setAsks] = useState<PendingAsk[]>([]);

  useEffect(() => {
    getStudyState(entityId).then((result) => setStatus(result.status)).catch(() => setMessage("Unable to load your study status. Try again."));
    getPendingAsks(entityId).then(setAsks).catch(() => undefined);
  }, [entityId]);

  async function choose(next: StudyStatus) {
    setBusy(true);
    try {
      const result = await setStudyStatus(entityId, next);
      setStatus(result.current); setUndoId(result.eventId);
      setMessage(result.current === "clear" ? "Study mark cleared." : result.current === "unclear" ? "Marked as unclear." : "Saved to revisit later.");
    } catch { setMessage("Unable to update the study mark. Try again."); }
    finally { setBusy(false); }
  }

  async function undo() {
    if (!undoId) return;
    setBusy(true);
    try { const result = await undoStudyStatus(entityId, undoId); setStatus(result.current); setUndoId(undefined); setMessage("Previous study mark restored."); }
    catch { setMessage("This change can no longer be undone."); }
    finally { setBusy(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); if (!question.trim()) return;
    setBusy(true);
    try { const ask = await createPendingAsk(entityId, question.trim(), sourceUrl); setAsks((current) => [...current, ask]); setQuestion(""); setComposer(false); setMessage("Question queued for Codex."); }
    catch { setMessage("Unable to queue the question. Try again."); }
    finally { setBusy(false); }
  }

  async function cancel(id: string) {
    setBusy(true);
    try {
      await cancelPendingAsk(id);
      setAsks((current) => current.filter((ask) => ask.id !== id));
      setMessage("Pending question cancelled.");
    } catch {
      setMessage("Unable to cancel the question. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="study-actions registered" aria-labelledby="study-actions-title">
    {register ? <SectionMarker kind="state" number={register} /> : null}
    <h2 id="study-actions-title">Study status</h2>
    <div className="registered-body">
    <p>Mark what needs clarification or another review. You can clear or undo the mark.</p>
    <div className="study-status-controls">
      <button type="button" aria-pressed={status === "unclear"} disabled={busy} onClick={() => choose("unclear")}><StudyIcon kind="question" />Unclear</button>
      <button type="button" aria-pressed={status === "revisit_later"} disabled={busy} onClick={() => choose("revisit_later")}><StudyIcon kind="period" />Revisit later</button>
      {undoId ? <button type="button" disabled={busy} onClick={undo}><StudyIcon kind="undo" />Undo</button> : null}
    </div>
    <div className="ask-codex">
      <button type="button" className="ask-codex-trigger" onClick={() => setComposer((value) => !value)}><StudyIcon kind="ask" />Ask Codex</button>
      {composer ? <form onSubmit={submit}><label htmlFor="codex-question">What should Codex explain?</label><textarea id="codex-question" value={question} onChange={(event) => setQuestion(event.target.value)} autoFocus /><div><button type="submit" disabled={busy || !question.trim()}>Queue question</button><button type="button" onClick={() => setComposer(false)}>Cancel</button></div></form> : null}
      {asks.map((ask) => <div className="pending-ask" key={ask.id}><span>Queued for Codex</span><p>{ask.question}</p><button type="button" disabled={busy} onClick={() => cancel(ask.id)}>Cancel question</button></div>)}
    </div>
    <p className="status-line" aria-live="polite">{message}</p>
    </div>
  </section>;
}
