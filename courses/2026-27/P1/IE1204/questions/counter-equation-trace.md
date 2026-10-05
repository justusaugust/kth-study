---
id: 'question:ie1204:counter-equation-trace'
courseId: 'course:ie1204'
slug: counter-equation-trace
title: 'Trace a counter from its D equations'
conceptIds: ['concept:ie1204:counter-sequence-synthesis']
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
hints: ['Compute both D values from the same old pair, then replace both state bits together.']
answer: 'The first four post-edge states are 01, 11, 10, 00. The cycle has four states and changes one bit per transition, including the closing transition. All four physical codes belong to the cycle, so none is unused. Ripple-clocked flip-flops would be a different timing structure and would not directly implement these shared-edge equations.'
---

A synchronous two-bit counter resets to 00 and has $D_1=q_0$ and $D_0=\overline q_1$. List the first four states after clock edges. How long is the cycle, how many bits change per transition, and are there unused codes? Could you replace the common clock by clocking the second flip-flop from the first one's output without reanalysing the design?
