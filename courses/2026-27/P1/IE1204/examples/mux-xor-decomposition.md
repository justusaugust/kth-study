---
id: 'example:ie1204:mux-xor-decomposition'
courseId: 'course:ie1204'
slug: mux-xor-decomposition
title: Implement XOR with a 2:1 mux
conceptIds: ['concept:ie1204:multiplexers-and-decoders']
sourceIds: ['source:ie1204:lecture-8-building-blocks']
lastChecked: '2026-09-15'
confidence: supported
relationships: []
---

Let $F=A\oplus B$ and select on $A$. For $A=0$, $F=B$, so connect $D_0=B$. For $A=1$, $F=\overline{B}$, so connect $D_1=\overline{B}$.

The mux equation becomes $F=\overline{A}B+A\overline{B}$. Inputs 00 and 11 produce 0; inputs 01 and 10 produce 1. A single inverter supplies $\overline{B}$ if it is not already available.
