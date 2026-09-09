---
id: 'concept:ie1204:unknown-and-high-impedance'
courseId: 'course:ie1204'
slug: unknown-and-high-impedance
title: Unknown values, high impedance, and bus contention
summary: X marks an unknown value or a context-specific don't-care; Z means a driver is disconnected, not that the wire is a third Boolean value.
outcomeIds: ['outcome:ie1204:boolean-logic', 'outcome:ie1204:analyse-circuits']
lectureIds: ['lecture:ie1204:2026-09-08-06']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---

## X is not a value you can rely on

An unknown signal is often written $X$. Conflicting output drivers can cause an unknown voltage and excessive current. In minimisation tables, the same symbol may instead mean **don't care**: the specification permits either output on that row. These meanings are different.

A don't-care row may be chosen as zero or one to simplify a circuit only when the specification really allows it. An unexpected measurement cannot simply be declared a don't-care.

## Z means not driving

A disabled tri-state buffer has high output impedance, written $Z$. An enabled non-inverting buffer drives its input:

| Enable | Input | Output |
| --- | --- | --- |
| 0 | 0 or 1 | Z |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

High impedance does not guarantee zero volts. Another driver or a pull resistor may determine the line; with neither, the line can float.

## Share a bus safely

Only one ordinary push-pull driver should be enabled on a shared bus at a time. Other drivers remain high impedance. One driving zero while another drives one is contention, not a valid Boolean operation.

A priority circuit can select the highest-priority asserted request. For requests $A_3$ through $A_0$, one-hot grants are:

$$
Y_3=A_3,\quad Y_2=\overline{A_3}A_2,\quad
Y_1=\overline{A_3}\,\overline{A_2}A_1,\quad
Y_0=\overline{A_3}\,\overline{A_2}\,\overline{A_1}A_0.
$$

Thus input 0111 produces 0100, not 0111. This describes steady-state logic; it does not by itself prove a glitch-free physical bus handover.
