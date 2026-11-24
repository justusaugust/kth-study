---
{
  "id": "concept:sf1684:projections-and-least-squares",
  "courseId": "course:sf1684",
  "slug": "projections-and-least-squares",
  "title": "Projections and least squares",
  "summary": "Find the closest vector in a subspace and the best fit to an inconsistent system.",
  "centralInsight": "The projection error is perpendicular to the whole target subspace.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:lecture-plan",
    "source:sf1684:module-5-reading-guide"
  ],
  "lastChecked": "2026-11-24",
  "confidence": "supported",
  "relationships": []
}
---

## Project onto a line or subspace
For a nonzero vector $\mathbf u$, the projection of $\mathbf b$ onto its span is $\mathbf u(\mathbf u^{\mathsf T}\mathbf b)/(\mathbf u^{\mathsf T}\mathbf u)$. For an orthonormal basis $\mathbf q_1,\ldots,\mathbf q_k$, add $(\mathbf q_i^{\mathsf T}\mathbf b)\mathbf q_i$. Check that the residual is orthogonal to every basis vector.

For $U=\operatorname{span}\{(1,1,0),(0,0,1)\}$ and $\mathbf b=(2,1,0)$, the closest vector is $(3/2,3/2,0)$. The residual $(1/2,-1/2,0)$ is orthogonal to both generators. Dotting with one generator alone would not establish orthogonality to an arbitrary higher-dimensional subspace.

## Least squares is a projection problem
When $A\mathbf x=\mathbf b$ is inconsistent, minimize $\|A\mathbf x-\mathbf b\|^2$. The residual must be perpendicular to every column, which gives the normal equations $A^{\mathsf T}A\widehat{\mathbf x}=A^{\mathsf T}\mathbf b$. A unique coefficient vector requires independent columns. Without that condition the fitted vector is still unique, but its coefficients need not be.

For a straight-line fit to $(0,1),(1,2),(2,2)$, use columns $1$ and $t$. The normal equations are $3a+3b=5$ and $3a+5b=6$, giving $a=7/6$ and $b=1/2$. Substituting back produces residual $(-1/6,1/3,-1/6)$, perpendicular to both columns.

This is preparation from the Module 5 guide for the scheduled projection and least-squares lecture, not a transcript of that lecture.
