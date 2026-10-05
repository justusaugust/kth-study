---
id: 'concept:ie1204:counter-sequence-synthesis'
courseId: 'course:ie1204'
slug: counter-sequence-synthesis
title: 'Turn an arbitrary sequence into a counter'
summary: 'Derive next-state logic from a cycle instead of assuming that every counter adds one.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-29-12']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## The transition list is the specification

A counter may follow Gray code, visit a selected set of values or move through a completely arbitrary order. Model it as a Moore machine: its visible output depends on its stored state. When the stored bits are themselves the required output, the output encoding is already chosen. A different internal encoding is possible, but would require output decoding.

Write each required value beside its successor, including the return from the final value to the first. Then sort the rows by present-state binary code. Sorting does not change the cycle; it makes missing codes easier to spot and puts the rows in truth-table order.

## Derive one equation per stored bit

For D flip-flops, $D_i=q_i^+$. Read the next-state column for bit $i$ as a Boolean function of the current bits. Simplify it using algebra or a Karnaugh map, remembering that a map uses Gray order rather than ordinary binary order. The separate D functions all evaluate the same current state and are captured together.

If the machine has count/hold input $E$, wrap the chosen next function $f_i$ as $D_i=E f_i+\overline E q_i$. A direction input needs its own forward and reverse successor for every state. Do not insert arithmetic increment logic unless it actually generates the required transitions.

## Verify the circuit in the reverse direction

Evaluate the resulting equations for every physical state code. Walk the desired cycle from reset, confirm its length, and inspect any unused codes. Treating unused rows as don't-cares can simplify gates, but leaves their resulting behaviour to the implementation. If recovery is required, specify recovery rows before simplifying.

Keep reset separate from the ordinary transition function: resetting to a valid code establishes the starting position, but does not prove recovery from an abnormal code. For the interactive parity machine, input one advances a two-state cycle and input zero holds it. Practise that edge-by-edge reasoning before extending it to a larger cycle.
