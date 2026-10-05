---
id: 'example:sf1690:dot-angle-and-distance'
courseId: 'course:sf1690'
slug: dot-angle-and-distance
title: Use one dot product for angle and distance
conceptIds: ['concept:sf1690:dot-products-and-orthogonality']
sourceIds: ['source:sf1690:lecture-13-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Let $\mathbf u=(1,1,0)$ and $\mathbf v=(0,1,1)$. Find their angle and the distance between their endpoints when both start at the origin.

First calculate $\mathbf u\cdot\mathbf v=1$ and $\|\mathbf u\|=\|\mathbf v\|=\sqrt2$. Thus

$$
\cos\theta=\frac{1}{2},\qquad\theta=\frac{\pi}{3}.
$$

The positive dot product correctly predicts an acute angle. For the distance, subtract before taking the norm: $\mathbf v-\mathbf u=(-1,0,1)$, with length $\sqrt2$.

As an independent check, $\|\mathbf v-\mathbf u\|^2=\|\mathbf v\|^2+\|\mathbf u\|^2-2\mathbf u\cdot\mathbf v=2+2-2=2$. The distance is $\sqrt2$, not the difference of the two lengths (which would be zero).
