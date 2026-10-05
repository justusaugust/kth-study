---
id: 'example:ie1204:counter-five-state-interval'
courseId: 'course:ie1204'
slug: counter-five-state-interval
title: 'Make a five-state interval counter'
conceptIds: ['concept:ie1204:synchronous-counters']
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Design an original four-bit synchronous sequence 3, 4, 5, 6, 7, 3, … using count and parallel load. Assume reset is inactive and counting is enabled. The parallel word is 0011, and the active-low load input is asserted when the current count equals 0111.

The equality detector is $T=\overline q_3q_2q_1q_0$, so the active-low load control is $\overline T$. Starting at 0011, four edges count to 0100, 0101, 0110 and 0111. During state 0111, the load signal is asserted but the output remains 0111. The fifth edge loads 0011. There are $7-3+1=5$ visible states per cycle.

Decoding 1000 instead would allow 8 to appear, producing six states. Loading zero instead would change the sequence itself. The boundary state and the loaded value are separate design decisions.

The HC161's master reset clears to 0000, not 0011. To start directly at 3, release reset and perform a synchronous load of 0011 before ordinary operation. Otherwise startup includes 0, 1 and 2 before entering the repeating interval. If enable is low at a nonterminal count, the count holds; if load is asserted, loading still takes priority. This simple interval design is not a general pause-at-any-state interface.
