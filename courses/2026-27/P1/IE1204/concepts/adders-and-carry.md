---
id: 'concept:ie1204:adders-and-carry'
courseId: 'course:ie1204'
slug: adders-and-carry
title: 'Adders, carry propagation and comparison'
summary: 'Build multibit arithmetic from full adders and distinguish a numeric result from the carry needed to compute it.'
centralInsight: 'Every sum bit depends on its local operands and the carry from less significant positions.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:number-systems']
lectureIds: ['lecture:ie1204:2026-10-06-13']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-13-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

## One bit at a time

A half adder computes $S=A\oplus B$ and $C=AB$. A full adder includes the incoming carry: $S=A\oplus B\oplus C_{\mathrm{in}}$ and $C_{\mathrm{out}}=AB+AC_{\mathrm{in}}+BC_{\mathrm{in}}$. The sum is the parity of the three inputs; the carry is one when at least two inputs are one.

Chain full adders from the least significant bit upward. Each bit uses its own operand bits and the carry from the previous position. The output word contains the low $N$ bits of the mathematical sum, while the final carry represents the extra unsigned bit.

## Why carry determines delay

A ripple-carry adder may wait for carry to pass through every stage. Define generate $G_i=A_iB_i$ and propagate $P_i=A_i\oplus B_i$. Then $C_{i+1}=G_i+P_iC_i$. Expanding the recurrence expresses later carries directly in terms of earlier generates, propagates and the initial carry. Carry-lookahead reduces sequential carry dependence at the cost of more logic and wiring.

Carry-select computes a block twice, once for carry-in zero and once for carry-in one, then selects the correct result. It trades duplicated hardware for a shorter decision path. Faster arithmetic is not free, and the critical path must include the final selection and sum logic.

## Reuse an adder for subtraction

Compute $A-B$ as $A+\overline B+1$, keeping the same width. Controlled XOR gates invert $B$ only for subtraction, and the subtract control supplies the initial carry. A carry-out from this subtraction convention indicates no unsigned borrow; some architectures expose an inverted borrow instead, so identify the convention before interpreting a flag.

Equality uses XNOR on corresponding bits followed by AND. For unsigned order, inspect the most significant unequal bit or use subtraction and the borrow convention. Signed order needs the signs and signed overflow: the sign of a wrapped subtraction alone is not sufficient.
