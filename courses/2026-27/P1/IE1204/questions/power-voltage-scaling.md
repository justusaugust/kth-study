---
id: 'question:ie1204:power-voltage-scaling'
courseId: 'course:ie1204'
slug: power-voltage-scaling
hints:
  - 'Write dynamic power before and after the voltage change, then form the ratio. The fixed capacitance and frequency cancel.'
  - 'The voltage enters the formula squared. Apply that exponent to the voltage ratio before converting to a percentage.'
title: Predict the effect of voltage scaling
conceptIds:
  - 'concept:ie1204:cmos-power-consumption'
answer: >-
  Dynamic power is proportional to V_DD squared, so multiplying the voltage by
  0.75 multiplies dynamic power by 0.75 squared = 0.5625. It falls by 43.75%.
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships: []
---
Capacitance and switching frequency stay fixed while $V_{DD}$ is reduced to $75\%$ of its original value. What fraction of the original dynamic power remains?
