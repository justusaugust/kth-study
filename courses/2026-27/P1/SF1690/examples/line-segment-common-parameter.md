---
id: 'example:sf1690:line-segment-common-parameter'
courseId: 'course:sf1690'
slug: line-segment-common-parameter
title: Build a line and test a point using one parameter
conceptIds: ['concept:sf1690:vector-lines-and-planes']
sourceIds: ['source:sf1690:lecture-14-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Find the line and segment through $A=(1,2,-1)$ and $B=(3,0,5)$. Decide whether $C=(5,-2,11)$ lies on each.

The direction is $B-A=(2,-2,6)$, so

$$
(x,y,z)=(1,2,-1)+t(2,-2,6).
$$

The full line allows $t\in\mathbb R$; the segment uses $0\leq t\leq1$. For $C$, the first coordinate gives $t=2$. The other coordinates then give $2-2(2)=-2$ and $-1+6(2)=11$, so the same parameter works throughout.

Thus $C$ is on the line but beyond the segment. The midpoint is obtained at $t=1/2$, namely $(2,1,2)$. Scaling the direction to $(1,-1,3)$ describes the same line, but then the segment parameter interval becomes $[0,2]$. Parameter bounds depend on the chosen direction.
