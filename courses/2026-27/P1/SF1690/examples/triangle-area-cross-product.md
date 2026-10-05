---
id: 'example:sf1690:triangle-area-cross-product'
courseId: 'course:sf1690'
slug: triangle-area-cross-product
title: Find triangle area from two side vectors
conceptIds: ['concept:sf1690:cross-products-and-area']
sourceIds: ['source:sf1690:lecture-15-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Find the area of the triangle with $A=(1,0,0)$, $B=(3,0,0)$ and $C=(1,3,4)$.

Take both side vectors from $A$:

$$
B-A=(2,0,0),\qquad C-A=(0,3,4).
$$

Their cross product is $(0,-8,6)$, with length $\sqrt{64+36}=10$. This is the parallelogram area, so the triangle area is $10/2=5$.

A geometric check is available: the two sides have dot product zero, hence are perpendicular, with lengths $2$ and $5$. Half of base times height is again $2\cdot5/2=5$.

Using $(C-A)\times(B-A)$ would change the normal to $(0,8,-6)$ but leave the triangle area unchanged. Using the point coordinates directly, without first subtracting a common vertex, would describe a different parallelogram.
