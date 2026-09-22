---
id: 'concept:ie1204:combinational-delay-and-hazards'
courseId: 'course:ie1204'
slug: combinational-delay-and-hazards
title: Propagation delay and glitches
summary: Separate the earliest possible output change from the latest settling time, and recognise hazards from unequal path delays.
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-15-08']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-8-building-blocks']
lastChecked: '2026-09-15'
confidence: supported
relationships: []
---

## A correct truth table does not imply an instantaneous output

After an input changes, the circuit needs time to settle. Propagation delay $t_{pd}$ is an upper bound on settling time; contamination delay $t_{cd}$ is a lower bound on the time before an output can start changing. Between them, the output is not guaranteed to be either its old or final value.

These are bounds, not a promise that a transition occurs at either endpoint. Some input changes leave the logical output unchanged. Loading, temperature, supply voltage and rise/fall direction can affect real delays.

## Follow complete paths

For a simple gate-delay model, add propagation delays along each input-to-output path and choose the largest sum. Add contamination delays and choose the smallest sum for the earliest-change bound. Do not add every gate in the circuit when branches run in parallel.

The longest path is the critical path. A balanced implementation may reduce the number of serial gates, but gate count alone is not a timing specification. The paths must be relevant to the transition, and real timing analysis also considers loads and operating conditions.

## Why a stable logical value can glitch

Consider $F=AB+\overline{A}C$ while $B=C=1$. Logically $F=1$ for both values of $A$. Physically, one product term may fall before the other rises, briefly leaving both zero: a static-1 hazard.

Adding the consensus term $BC$ gives

$$F=AB+\overline{A}C+BC.$$

The Boolean function is unchanged, but $BC$ remains high throughout a single transition of $A$ with $B=C=1$, covering that hazard. This is not a universal cure for arbitrary simultaneous input changes.

## What a timing bound lets you conclude

A combinational output should only be sampled after sufficient settling time. A glitch is especially dangerous if used as a clock, asynchronous control or external pulse. Later sequential-circuit lessons add setup/hold constraints; do not equate $1/t_{pd}$ alone with a complete system clock limit.
