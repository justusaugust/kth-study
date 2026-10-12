---
id: 'example:ie1204:adder-subtraction-and-flags'
courseId: 'course:ie1204'
slug: adder-subtraction-and-flags
title: 'Subtract with an adder and check both interpretations'
conceptIds: ['concept:ie1204:adders-and-carry', 'concept:ie1204:alu-status-flags']
sourceIds: ['source:ie1204:lecture-13-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

Compute $A-B$ with four-bit operands $A=0100$ and $B=1011$.

Invert B to 0100 and set carry-in to one. The sum is 0100 + 0100 + 1 = 1001, with carry-out zero. The result's most significant bit is one and the word is nonzero, so N=1 and Z=0.

Unsigned interpretation: $4-11=-7$ needs a borrow; the retained word represents 9 modulo 16. Under the adder's no-borrow carry convention, C=0.

Signed interpretation: B represents $-5$, so the mathematical difference is $4-(-5)=9$, outside the signed range $-8$ through $7$. The retained word represents $-7$, hence V=1. Signed less-than uses $N\oplus V=0$, correctly indicating that $4$ is not less than $-5$.

The two interpretations agree on the wires but not on the integers. Name the representation before using a flag to make a numerical conclusion.
