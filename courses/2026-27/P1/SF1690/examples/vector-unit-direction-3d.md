---
id: 'example:sf1690:vector-unit-direction-3d'
courseId: 'course:sf1690'
slug: vector-unit-direction-3d
title: Build a vector of a chosen length in three dimensions
conceptIds: ['concept:sf1690:vectors-and-components']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

Find the vector of length $10$ pointing from $P=(2,-1,4)$ towards $Q=(0,2,-2)$. Also give the vector of length $10$ in the opposite direction.

The displacement is

$$
\mathbf v=Q-P=(-2,3,-6),\qquad
\|\mathbf v\|=\sqrt{4+9+36}=7.
$$

Since this is nonzero, normalize and scale:

$$
\mathbf w=10\frac{\mathbf v}{7}
=\left(-\frac{20}{7},\frac{30}{7},-\frac{60}{7}\right).
$$

Its length is $\sqrt{(400+900+3600)/49}=10$. The scalar $10/7$ is positive, so $\mathbf w$ points towards $Q$. The opposite vector is $-\mathbf w=(20/7,-30/7,60/7)$.

This asks for a vector, not an endpoint. If an endpoint after moving by $\mathbf w$ from $P$ were required, it would be $P+\mathbf w$.
