---
id: 'example:ie1204:trace-parity-state'
courseId: 'course:ie1204'
slug: trace-parity-state
title: 'Trace a one-bit parity machine'
conceptIds: ['concept:ie1204:moore-and-mealy-machines']
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

Consider an original Moore machine with two states: **Even** means an even number of sampled ones, and **Odd** means an odd number. Reset selects Even. The output is 1 only in Odd.

- From Even: input 0 keeps Even; input 1 selects Odd. The output in Even is 0.
- From Odd: input 0 keeps Odd; input 1 selects Even. The output in Odd is 1.

Encode Even as $q=0$ and Odd as $q=1$. Then $D=q\oplus x$ and $y=q$. A zero preserves parity; a one toggles it.

1. Sample 1: Even becomes Odd; output becomes 1.
2. Sample 0: Odd stays Odd; output stays 1.
3. Sample 1: Odd becomes Even; output becomes 0.
4. Sample 1: Even becomes Odd; output becomes 1.
5. Sample 0: Odd stays Odd; output stays 1.

The output sequence after the edges is 1, 1, 0, 1, 1. Input changes between edges may change the D input, but not the stored state or ideal Moore output.

If another output were defined as $p=q\oplus x$, it would be Mealy: it predicts the parity obtained by including the current input before sampling. It is not interchangeable with $y=q$ at every instant. For example, with $q=0$, raising $x$ between edges changes $p$ to 1 while $y$ stays 0.
