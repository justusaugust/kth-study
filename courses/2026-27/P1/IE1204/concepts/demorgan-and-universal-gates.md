---
id: 'concept:ie1204:demorgan-and-universal-gates'
courseId: 'course:ie1204'
slug: demorgan-and-universal-gates
title: De Morgan and universal gates
summary: Move inversion through a gate by swapping AND and OR and complementing every input; this makes NAND and NOR universal building blocks.
outcomeIds: ['outcome:ie1204:boolean-logic', 'outcome:ie1204:analyse-circuits']
lectureIds: ['lecture:ie1204:2026-09-08-06']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---

## Move the inversion, preserve the function

Here $+$ means OR, juxtaposition means AND, and an overline means NOT.

$$
\overline{AB}=\overline{A}+\overline{B},\qquad
\overline{A+B}=\overline{A}\,\overline{B}.
$$

A NAND is therefore equivalent to an OR with both inputs inverted. A NOR is equivalent to an AND with both inputs inverted. Check all four input rows in the gate explorer below.

When pushing an inversion bubble across a gate, change the gate type and invert **every** input. Two inversions on the same wire cancel. Merely moving a bubble without changing AND to OR (or OR to AND) changes the function.

## Build using one gate family

Write $N(A,B)=\overline{AB}$. Tying the inputs together gives NOT: $N(A,A)=\overline{A}$. Inverting a NAND output gives AND. Inverting both inputs of a NAND gives OR:

$$N(N(A,A),N(B,B))=A+B.$$

Since AND, OR and NOT can express every truth table, NAND alone can too. NOR has the same property by the dual construction.

## SOP becomes NAND–NAND

For $F=AB+CD$, first form $u=\overline{AB}$ and $v=\overline{CD}$. Then $F=\overline{uv}$. That uses three two-input NAND gates, provided the literals are already available.

For POS, use the dual NOR–NOR construction. Count required input inverters and respect gate fan-in limits; do not equate a compact formula with a complete hardware count.
