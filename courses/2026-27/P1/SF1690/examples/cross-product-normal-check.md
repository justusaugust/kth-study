---
id: 'example:sf1690:cross-product-normal-check'
courseId: 'course:sf1690'
slug: cross-product-normal-check
title: Compute and verify an oriented normal
conceptIds: ['concept:sf1690:cross-products-and-area']
sourceIds: ['source:sf1690:lecture-15-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

For $\mathbf u=(1,2,0)$ and $\mathbf v=(0,1,2)$, calculate $\mathbf u\times\mathbf v$ and a unit normal in that orientation.

Component arithmetic gives

$$
\mathbf u\times\mathbf v=(2\cdot2-0\cdot1,\ 0\cdot0-1\cdot2,\ 1\cdot1-2\cdot0)=(4,-2,1).
$$

Check both perpendicularity conditions: $(4,-2,1)\cdot(1,2,0)=4-4=0$ and $(4,-2,1)\cdot(0,1,2)=-2+2=0$.

Its length is $\sqrt{16+4+1}=\sqrt{21}$, so the oriented unit normal is $(4,-2,1)/\sqrt{21}$. Reversing the inputs produces $(-4,2,-1)$ and the opposite unit normal. Both are normal to the same plane, but their orientations differ.

The magnitude identity provides a further check: each input has squared length $5$, and their dot product is $2$, so the cross product has squared length $5\cdot5-2^2=21$.
