---
id: 'example:ie1204:logic-family-noise-margins'
courseId: 'course:ie1204'
slug: logic-family-noise-margins
title: Calculate LVCMOS noise margins
conceptIds:
  - 'concept:ie1204:digital-abstraction'
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships: []
---
For the $3.3\,\mathrm{V}$ LVCMOS values in the lecture, $V_{OH}=2.7\,\mathrm{V}$, $V_{IH}=1.8\,\mathrm{V}$, $V_{IL}=0.9\,\mathrm{V}$, and $V_{OL}=0.36\,\mathrm{V}$. Therefore,

$$NM_H=V_{OH}-V_{IH}=2.7-1.8=0.9\,\mathrm{V},$$

$$NM_L=V_{IL}-V_{OL}=0.9-0.36=0.54\,\mathrm{V}.$$

The high side can tolerate $0.9\,\mathrm{V}$ of degradation and the low side $0.54\,\mathrm{V}$ before the receiving gate is no longer guaranteed to interpret the signal correctly.
