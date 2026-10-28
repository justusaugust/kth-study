---
{
  "id": "concept:sf1684:lines-planes-and-projection",
  "courseId": "course:sf1684",
  "slug": "lines-planes-and-projection",
  "title": "Lines, planes, and projection",
  "summary": "Describe geometry with a point and direction vectors, and find the closest component along a line.",
  "centralInsight": "Projection splits a vector into a component along a direction and a perpendicular remainder.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-10-28-03"
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

## A line needs a point and a nonzero direction

$$\mathbf{x}=\mathbf{p}+t\mathbf{d},\qquad t\in\mathbb{R}.$$

For a line through $(1,0,2)$ in direction $(2,-1,0)$, the point at $t=3$ is $(7,-3,2)$. A candidate point is on the line only if the same parameter satisfies all components.

## A plane needs a point and a nonzero normal

$$\mathbf{n}\cdot(\mathbf{x}-\mathbf{p})=0.$$

With normal $(1,2,-1)$ through $(1,0,2)$, the plane equation is $x+2y-z=-1$. Substitute the given point to check the constant and signs.

## Orthogonal projection onto a vector

For $\mathbf{v}\ne\mathbf{0}$,

$$\operatorname{proj}_{\mathbf{v}}\mathbf{u}=\frac{\mathbf{u}\cdot\mathbf{v}}{\mathbf{v}\cdot\mathbf{v}}\mathbf{v}.$$

Projecting $(3,4,0)$ onto $(1,0,0)$ gives $(3,0,0)$. The residual $(0,4,0)$ is perpendicular to the target direction. In general, verify that $(\mathbf{u}-\operatorname{proj}_{\mathbf{v}}\mathbf{u})\cdot\mathbf{v}=0$.

This formula projects onto a line through the origin. For a line through $\mathbf{p}$, project $\mathbf{x}-\mathbf{p}$, then add $\mathbf{p}$ back.
