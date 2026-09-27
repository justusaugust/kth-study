---
id: 'example:ie1204:analyse-two-bit-history'
courseId: 'course:ie1204'
slug: analyse-two-bit-history
title: 'Identify a two-sample history circuit'
conceptIds: ['concept:ie1204:fsm-circuit-analysis']
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
---

An original two-bit circuit has a synchronous reset to 00, D inputs $D_1=q_0$ and $D_0=x$, and output $z=q_1\oplus q_0$. All flip-flops use the rising edge.

Evaluate both next bits from the old state:

- From 00: input 0 gives 00; input 1 gives 01. Output $z=0$.
- From 01: input 0 gives 10; input 1 gives 11. Output $z=1$.
- From 10: input 0 gives 00; input 1 gives 01. Output $z=1$.
- From 11: input 0 gives 10; input 1 gives 11. Output $z=0$.

After each edge, $q_0$ holds the latest sample and $q_1$ holds the preceding sample. Thus $z=1$ when the two remembered samples differ. It is a Moore output: a change of $x$ alone between clock edges does not change it.

Starting at reset and sampling 1, 1, 0, 1 gives states 01, 11, 10, 01 and outputs 1, 0, 1, 1. The first comparison uses the reset-initialised zero as its earlier sample. All four codes are reachable; none should be discarded as unused. Updating $q_0$ before calculating $D_1$ would incorrectly store the new input in both bits.
