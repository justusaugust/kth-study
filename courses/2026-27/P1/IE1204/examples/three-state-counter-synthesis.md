---
id: 'example:ie1204:three-state-counter-synthesis'
courseId: 'course:ie1204'
slug: three-state-counter-synthesis
title: 'Synthesize a three-state cycle with recovery'
conceptIds: ['concept:ie1204:counter-sequence-synthesis']
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

An original two-bit machine must cycle 00 → 10 → 01 → 00. Specify recovery from unused code 11 to 00 and reset to 00. In binary present-state order, the next codes are:

- 00 → 10.
- 01 → 00.
- 10 → 01.
- 11 → 00.

The high next bit is one only in current state 00, so $D_1=\overline q_1\,\overline q_0$. The low next bit is one only in state 10, so $D_0=q_1\overline q_0$. Both equations share the factor $\overline q_0$; no arithmetic adder is needed.

Check the equations in reverse: substituting 00 gives 10, substituting 10 gives 01, and substituting 01 gives 00. Substituting 11 gives 00, establishing the requested one-edge recovery. The intended cycle has three states even though the register can represent four.

Recovery does not prevent code 11 from being visible before the recovery edge. If the outputs directly equal the state bits, downstream logic must tolerate that code or handle it separately. This is why specifying a safe destination does not by itself specify safe recovery outputs.
