---
{
  "id": "concept:sf1684:vectors-and-length",
  "courseId": "course:sf1684",
  "slug": "vectors-and-length",
  "title": "Vectors, components, and length",
  "summary": "Add displacements component by component and compute length using the Euclidean norm.",
  "centralInsight": "Subtract positions to get a displacement; normalize only when its length is nonzero.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-10-26-01"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:sf1684:lecture-plan",
    "source:sf1684:module-1"
  ],
  "lastChecked": "2026-10-28",
  "confidence": "supported",
  "relationships": []
}
---

## A vector represents a displacement

In $\mathbb{R}^3$, a vector is an ordered triple $\mathbf{v}=(v_1,v_2,v_3)$. To travel from $A=(1,-2,0)$ to $B=(4,2,0)$, use $B-A=(3,4,0)$. Reversing the trip changes the sign.

Add vectors and multiply by scalars component by component:

$$\mathbf{u}+\mathbf{v}=(u_1+v_1,u_2+v_2,u_3+v_3),\qquad c\mathbf{v}=(cv_1,cv_2,cv_3).$$

## Length and normalization

$$\|\mathbf{v}\|=\sqrt{v_1^2+v_2^2+v_3^2}.$$

The displacement $(3,4,0)$ has length $5$. Its unit direction is $(3/5,4/5,0)$: divide every component by the same nonzero length. The zero vector cannot be normalized.

A point specifies a position; a displacement specifies a change in position. Writing $B-A$ produces a vector, not the destination point.

[Revisit the interactive vector explanation](/visuals/vector-addition)
