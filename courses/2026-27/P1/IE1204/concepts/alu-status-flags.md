---
id: 'concept:ie1204:alu-status-flags'
courseId: 'course:ie1204'
slug: alu-status-flags
title: 'ALU operations and status flags'
summary: 'Use result selection and N, Z, C and V to distinguish bit patterns, unsigned arithmetic and signed arithmetic.'
centralInsight: 'A bit pattern has no unique numeric interpretation until width and signedness are declared.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:number-systems']
lectureIds: ['lecture:ie1204:2026-10-06-13']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-13-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

## Compute, then select

An arithmetic logic unit shares arithmetic and logic blocks. Its control selects an operation such as addition, subtraction, AND or OR. A multiplexer selects the result word. The selected operation matters for the flags: a carry wire inside an adder need not be a meaningful flag for a selected logic operation.

For an $N$-bit result, N is its most significant bit, and Z is one exactly when every result bit is zero. N records a bit, not proof that a mathematical signed result was representable.

## Carry is not signed overflow

For addition, C is the unsigned carry-out. Signed overflow V occurs when same-sign operands produce an opposite-sign result. Equivalently, V is the XOR of the carry entering the sign position and the carry leaving it.

Four-bit 0111 plus 0001 gives 1000: signed $7+1$ cannot fit the range $-8$ to $7$, so V is one while C is zero. Four-bit 1111 plus 0001 gives 0000 with C one, but signed $-1+1=0$ is representable, so V is zero. The same bit-level addition answers two different numerical questions.

## Subtraction and comparisons

For $A-B$, signed overflow occurs when the operand signs differ and the result sign differs from A's sign. In two's-complement comparison, signed less-than is $N\oplus V$ for the subtraction result; unsigned less-than follows the borrow convention. Z detects equality in either interpretation.

Do not mix an architecture's flag-update policy with raw arithmetic. Read whether C and V are masked for logic operations, whether subtraction C means borrow or no borrow, and which control encoding selects each operation.
