---
id: 'question:ie1204:delay-hazard-check'
courseId: 'course:ie1204'
slug: delay-hazard-check
title: Distinguish delay bounds and hazards
conceptIds: ['concept:ie1204:combinational-delay-and-hazards']
sourceIds: ['source:ie1204:lecture-8-building-blocks']
lastChecked: '2026-09-15'
confidence: supported
relationships: []
hints: ['A lower bound on the first possible change is different from an upper bound on settling.']
answer: 'No: 3 ns is only the earliest possible change; settling is guaranteed by 11 ns. A truth table describes settled values, so unequal internal path delays can still create a transient glitch.'
---

A circuit has $t_{cd}=3$ ns and $t_{pd}=11$ ns. Is its output guaranteed to be the new correct value 4 ns after an input transition? Can it glitch even when the initial and final truth-table outputs match?
