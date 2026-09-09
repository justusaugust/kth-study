---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "example:ie1204:karnaugh-cover-and-pos"
slug: "karnaugh-cover-and-pos"
title: "Two groups cover the function"
conceptIds: ["concept:ie1204:karnaugh-grouping","concept:ie1204:karnaugh-pos-and-dont-cares"]
---

Take $F=\Sigma m(1,3,6,7)$ with input order $ABC$.

The pair $m_1,m_3$ keeps $A=0,C=1$, giving $\overline{A}C$. The pair $m_6,m_7$ keeps $A=1,B=1$, giving $AB$. Every 1 is covered:

$$F=\overline{A}C+AB.$$

The pair $m_3,m_7$ is also valid and gives $BC$, but it adds no uncovered 1. It is redundant in this cover.

For POS, the zeros are $m_0,m_2,m_4,m_5$. Group $m_0,m_2$ to get $(A+C)$; group $m_4,m_5$ to get $(\overline{A}+B)$:

$$F=(A+C)(\overline{A}+B).$$

When $A=0$, both forms reduce to $C$; when $A=1$, both reduce to $B$. This checks all eight inputs without relying on the drawing.
