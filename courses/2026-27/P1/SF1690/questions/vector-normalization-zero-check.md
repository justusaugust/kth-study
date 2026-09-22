---
id: 'question:sf1690:vector-normalization-zero-check'
courseId: 'course:sf1690'
slug: vector-normalization-zero-check
title: Normalize a displacement and handle coincident points
conceptIds: ['concept:sf1690:vectors-and-components']
hints: ['Subtract the starting point from the ending point, then calculate the length. Check whether the same division is possible if both points coincide.']
answer: '$B-A=(0,0,-5)$ has length 5, so the unit vector is $(0,0,-1)$. If $A=B$, the displacement is zero and no unit direction can be obtained by normalization because division by its zero length is undefined.'
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

For $A=(1,2,3)$ and $B=(1,2,-2)$, find the unit vector pointing from $A$ to $B$. What happens to this construction if $A$ and $B$ are the same point?
