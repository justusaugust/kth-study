---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "example:ie1204:karnaugh-wrap-around"
slug: "karnaugh-wrap-around"
title: "Four edge cells become one literal"
conceptIds: ["concept:ie1204:karnaugh-grouping"]
---

For $F=\Sigma m(0,2,4,6)$ in input order $ABC$, the four 1s lie in the first and last columns of the map.

Those columns touch across the boundary, so the four cells form one $2\times2$ rectangle. $A$ changes between rows and $B$ changes between columns. $C=0$ everywhere.

$$F=\overline{C}.$$

Check: the even minterm indices have final bit 0, exactly the rows where $\overline{C}=1$. Treating the two edges as separate pairs would give $\overline{A}\,\overline{C}+A\overline{C}$, which simplifies to the same result.
