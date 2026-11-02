---
{
  "id": "concept:id1022:immutable-loops-and-state",
  "courseId": "course:id1022",
  "slug": "immutable-loops-and-state",
  "title": "Loops and explicit state",
  "summary": "Iteration passes a new state forward without mutating the previous state.",
  "centralInsight": "A loop transition can carry an entire new state; stateful behavior does not require in-place mutation.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-10-30-03"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-3-slides"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Printing before checking the stopping condition when the intended final state should not be printed.",
  "verifyPrompt": "Trace the entry state, stopping test, output, and next state for three iterations."
}
---

## Trace one iteration

In Pyking, `loop` introduces a state binding, `continue` supplies the next state, and `break` exits. This independent example prints `0`, `1`, and `2`:

```text
loop s = 0:
    if s == 3:
        break
    print(s)
    continue s + 1
```

The entry states are `0 → 1 → 2 → 3`. The first three print and continue; state `3` exits without printing.

The stopping test precedes printing. Moving it changes the output. A loop with no reachable break can continue forever.

## Carry compound state

A tuple can carry an index and accumulated result together. State what each field means before updating it. An invariant describes what holds at every loop entry: for a list scan, the accumulated result can describe exactly the elements before the current index.

## Connect to a state machine

The slides introduce a Mealy machine: states $S$, input symbols $\Sigma$, output symbols $\Gamma$, transition $\delta:S\times\Sigma\to S$, output $\lambda:S\times\Sigma\to\Gamma$, and initial state $s_0$. Each state/input pair determines both output and next state.

A finite-state machine has finitely many states. An unrestricted integer counter is not automatically finite-state. A Moore machine associates output with the state instead; keep the conventions separate when reading diagrams.
