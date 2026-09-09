---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "concept:ie1204:karnaugh-pos-and-dont-cares"
slug: "karnaugh-pos-and-dont-cares"
title: "Group zeros and use don't cares"
summary: "Zero groups produce POS factors; unspecified inputs can enlarge a group without becoming required coverage."
outcomeIds: ["outcome:ie1204:boolean-logic","outcome:ie1204:design-digital-systems"]
lectureIds: ["lecture:ie1204:2026-09-09-07"]
evidenceStatus: "lecture"
---

## Zero groups give product of sums

For POS, cover the 0s with the same rectangle rules. Each group produces a sum that is zero throughout that group. Constant 0 gives an uncomplemented literal; constant 1 gives a complemented literal. This is the reverse of reading a group of 1s.

If every cell in a zero group has $A=0$ and $C=1$, its factor is $(A+\overline{C})$. Inputs that change disappear. AND all required factors. Equivalently, simplify $\overline{F}$ by grouping its 1s and then apply De Morgan.

## A don't care is freedom in the specification

A don't-care cell can be treated as 1 or 0 to make the implementation simpler. Include it in a group only when useful. You must cover every required 1 for SOP (or required 0 for POS), but you never have to cover a don't care.

Suppose $F=\Sigma m(1,3)$ and $d=\{5,7\}$ for input order $ABC$. Without using the don't cares, the pair gives $\overline{A}C$. With both optional cells, all four $C=1$ cells form a group and $F=C$ meets every specified row.

A don't care is justified only when the specification permits either output for that input. It is not the simulator's unknown X from contention or an uninitialised value, and it is not high impedance Z. Do not turn an inconvenient specified 0 into a don't care.
