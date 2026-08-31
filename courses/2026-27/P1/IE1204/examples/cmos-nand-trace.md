---
id: 'example:ie1204:cmos-nand-trace'
courseId: 'course:ie1204'
slug: cmos-nand-trace
title: Trace a two-input CMOS NAND gate
conceptIds:
  - 'concept:ie1204:cmos-transistor-networks'
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships: []
---
For $A=1$ and $B=0$, pMOS $P_A$ is off and $P_B$ is on. nMOS $N_A$ is on and $N_B$ is off. The series pull-down path is therefore broken, while the parallel pull-up network still has a conducting branch through $P_B$. The output is connected to $V_{DD}$, so $Y=1$.

Only $A=B=1$ turns both series nMOS devices on and both parallel pMOS devices off. That row pulls the output to ground and gives $Y=0$, which is the NAND truth table.
