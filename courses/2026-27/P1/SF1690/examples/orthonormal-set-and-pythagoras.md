---
id: 'example:sf1690:orthonormal-set-and-pythagoras'
courseId: 'course:sf1690'
slug: orthonormal-set-and-pythagoras
title: Check an orthonormal pair and use Pythagoras
conceptIds: ['concept:sf1690:dot-products-and-orthogonality']
sourceIds: ['source:sf1690:lecture-13-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Consider $\mathbf a=(1,1,0)/\sqrt2$ and $\mathbf b=(1,-1,0)/\sqrt2$. Are they orthonormal, and what is $\|3\mathbf a-4\mathbf b\|$?

Their dot product is $(1-1+0)/2=0$. Each squared length is $(1+1)/2=1$, so the pair is orthonormal.

The scaled vectors remain orthogonal. Expanding the norm gives

$$
\|3\mathbf a-4\mathbf b\|^2
=9\|\mathbf a\|^2-24\mathbf a\cdot\mathbf b+16\|\mathbf b\|^2
=25.
$$

Hence the length is $5$. The triangle inequality gives the upper bound $3+4=7$, but that is not an equality because the two displacements are perpendicular. Cauchy–Schwarz also checks the pair: $|\mathbf a\cdot\mathbf b|=0\leq1$.
