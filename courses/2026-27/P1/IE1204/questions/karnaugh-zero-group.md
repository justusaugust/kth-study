---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "question:ie1204:karnaugh-zero-group"
slug: "karnaugh-zero-group"
title: "Read zeros and optional cells correctly"
conceptIds: ["concept:ie1204:karnaugh-pos-and-dont-cares"]
answer: "The zero group gives $(A+\\overline{C})$: both literals are zero when $A=0,C=1$. No, a don't care outside this group need not be covered; use it only if it helps."
hints: ["A POS factor must evaluate to zero on every cell of its zero group."]
---

A zero group keeps $A=0$ and $C=1$ while $B$ changes. What POS factor does it produce? Must a don't-care cell elsewhere on the map also be grouped?
