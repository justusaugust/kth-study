---
id: 'concept:ie1204:synchronous-counters'
courseId: 'course:ie1204'
slug: synchronous-counters
title: 'Count, load, hold and reset'
summary: 'Treat counter controls as a priority rule, then distinguish shared-clock updates from ripple propagation.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-29-12']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## One state change per active edge

An enabled binary counter stores $q^+=(q+1)\bmod 2^n$. For three bits the transition 011 to 100 changes every bit. In a synchronous counter all flip-flops sample their next inputs on the same clock edge; all those inputs were computed from the old state. Real outputs still have propagation delay and need not change at precisely the same instant.

A ripple counter instead clocks one stage from another stage's output. The carry transition propagates through stages, creating intermediate codes. Dividing a clock frequency is useful, but decoding a ripple output as though it changes atomically can produce unwanted pulses. Shared clocks avoid the cumulative ripple-clock delay; they do not remove setup, hold or combinational glitches.

## Read control priority before counting

For the 74HC161, active-low master reset clears the count asynchronously. With reset inactive, a rising clock edge loads the parallel input if active-low load is asserted. Otherwise, counting requires both count enables; if either enable is low the state holds. Load has priority over counting and does not require count enable. Reset can act between edges; loading cannot.

The next-input mux chooses between the loaded word and the count/hold result. With count enable $E$, the four binary next-bit equations are

$$q_0^+=q_0\oplus E,\qquad q_1^+=q_1\oplus(Eq_0),$$
$$q_2^+=q_2\oplus(Eq_1q_0),\qquad q_3^+=q_3\oplus(Eq_2q_1q_0).$$

These apply to the count/hold branch, before the load and reset controls. A bit toggles only when counting is enabled and all lower bits are one. Setting $E=0$ makes every bit hold.

## Choose the final state before wiring a modulus

For a synchronous cycle 0 through $m-1$, decode $m-1$ and make the next edge load zero. That produces exactly $m$ visible states. Decoding $m$ instead would include an extra state before the load. A decoded asynchronous reset is a different circuit with different timing and must not be substituted silently.

For a cycle from $a$ through $b$, load $a$ when the current state equals $b$; the length is $b-a+1$. For two cascaded stages, use the lower stage's terminal condition to enable the upper stage while keeping a common clock. At a lower-stage rollover, both stages compute from the pre-edge values. A shortened lower-stage modulus needs its own terminal condition rather than the unmodified binary all-ones carry.
