---
id: 'example:ie1204:check-an-and-gate-build'
courseId: 'course:ie1204'
slug: check-an-and-gate-build
title: Bring up a 74HC08 AND gate safely
conceptIds:
  - 'concept:ie1204:breadboard-and-safe-wiring'
sourceIds:
  - 'source:ie1204:lecture-4-lab-introduction'
lastChecked: '2026-09-03'
confidence: verified
relationships: []
---
Place the 74HC08 across the centre groove with its notch matching the schematic. Connect VCC and ground, then use two switches to give the selected gate definite inputs $A$ and $B$. Connect its output to a current-limited indicator.

Before power, check for a rail short and confirm that no output is connected to another output. After power, test $00$, $01$, $10$, and $11$. The indicator should be on only for $11$; any other pattern points to wiring, pin selection, or input-level trouble.
