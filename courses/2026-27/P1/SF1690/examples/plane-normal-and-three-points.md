---
id: 'example:sf1690:plane-normal-and-three-points'
courseId: 'course:sf1690'
slug: plane-normal-and-three-points
title: Describe the same plane from points and a normal
conceptIds: ['concept:sf1690:vector-lines-and-planes']
sourceIds: ['source:sf1690:lecture-14-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

Let $A=(1,0,2)$, $B=(2,1,2)$ and $C=(1,1,3)$. Find parametric and scalar equations of their plane.

The directions $\mathbf u=B-A=(1,1,0)$ and $\mathbf v=C-A=(0,1,1)$ are not scalar multiples. The plane is therefore

$$
(x,y,z)=(1,0,2)+s(1,1,0)+t(0,1,1).
$$

To find a normal without using a cross product, solve $\mathbf n\cdot\mathbf u=0$ and $\mathbf n\cdot\mathbf v=0$. With $\mathbf n=(a,b,c)$, these are $a+b=0$ and $b+c=0$. Choose $b=-1$, giving $\mathbf n=(1,-1,1)$.

The point-normal equation becomes

$$
(x-1)-y+(z-2)=0,\qquad x-y+z=3.
$$

All three original points satisfy this equation. Substituting the parametric coordinates also gives $(1+s)-(s+t)+(2+t)=3$ for every $s,t$, confirming that both descriptions match.
