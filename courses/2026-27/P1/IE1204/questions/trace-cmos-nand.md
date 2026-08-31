---
id: 'question:ie1204:trace-cmos-nand'
courseId: 'course:ie1204'
slug: trace-cmos-nand
title: Trace a CMOS NAND row
conceptIds:
  - 'concept:ie1204:cmos-transistor-networks'
answer: >-
  Both pMOS devices are off and both nMOS devices are on. The parallel pull-up
  network cannot reach VDD, while the series pull-down network completes a path
  to ground, so Y = 0.
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships: []
---
For a two-input CMOS NAND gate with $A=B=1$, state whether each pMOS and nMOS transistor conducts, identify the complete network, and determine $Y$.
