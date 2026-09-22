---
id: 'concept:ie1204:feedback-and-latches'
courseId: 'course:ie1204'
slug: feedback-and-latches
title: Feedback and level-sensitive latches
summary: Explain how feedback stores a bit, distinguish NOR and NAND controls, and trace a transparent D latch.
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-17-09']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

## Why the same inputs can give different outputs

A combinational circuit forgets its history: once it settles, its inputs determine its output. A sequential circuit also has state. Two cross-coupled inverters have two stable arrangements, $Q=0$ and $Q=1$, because each output reinforces the other. Feedback retains a bit; set and reset inputs let us choose it. An uninitialised latch has no guaranteed starting value.

## Read the input polarity first

For a NOR SR latch, $S$ and $R$ are active high. Assert means drive high. $Q^+$ denotes the state after the circuit settles; $Q$ denotes the previous state.

| S | R | $Q^+$ | Meaning |
| --- | --- | --- | --- |
| 0 | 0 | $Q$ | Hold |
| 1 | 0 | 1 | Set |
| 0 | 1 | 0 | Reset |
| 1 | 1 | Invalid | Both outputs forced low |

The last row is not another stored bit: the two outputs cease to be complements. Releasing both controls together does not determine which stable state wins. Do not replace that uncertainty with an arbitrary zero in a timing trace.

A NAND latch uses active-low controls $\overline S,\overline R$. Its hold input is 11, set is 01, reset is 10, and forbidden input is 00. The operation names stay the same while the electrical levels change. A bubble or overbar is part of the specification.

## Gate the updates, then encode the data

A gated SR latch ignores its set/reset requests when enable is low. When enable is high, the ordinary SR table applies. A high-transparent D latch arranges the logical requests as $S=ED$ and $R=E\overline D$. This avoids simultaneously asserting set and reset in the ideal model.

$$
Q^+=\begin{cases}D & E=1,\\Q & E=0.\end{cases}
$$

While $E=1$, every change in $D$ can reach $Q$ after propagation delay. When $E$ becomes zero, the latch keeps the last captured value. A pin labelled CLK on a latch still controls a transparent interval; its name does not make the device edge-triggered. The table describes settled digital behaviour, not analogue behaviour during simultaneous transitions.
