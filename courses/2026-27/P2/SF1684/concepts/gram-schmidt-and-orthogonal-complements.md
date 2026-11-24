---
{
  "id": "concept:sf1684:gram-schmidt-and-orthogonal-complements",
  "courseId": "course:sf1684",
  "slug": "gram-schmidt-and-orthogonal-complements",
  "title": "Gram–Schmidt and orthogonal complements",
  "summary": "Build an orthonormal basis while preserving the span.",
  "centralInsight": "Subtract earlier projections before normalizing the next direction.",
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

## Remove the directions already accounted for
Start with linearly independent vectors. Set $\mathbf u_1=\mathbf v_1$. At step $k$, subtract from $\mathbf v_k$ its projections onto all earlier orthogonal $\mathbf u_i$. Normalize the nonzero result to obtain $\mathbf q_k$. Equivalently, subtract $(\mathbf q_i^{\mathsf T}\mathbf v_k)\mathbf q_i$ using the already normalized vectors.

For $\mathbf v_1=(1,1,0)$ and $\mathbf v_2=(1,0,1)$, one obtains $\mathbf q_1=(1,1,0)/\sqrt2$ and $\mathbf q_2=(1,-1,2)/\sqrt6$. Check both unit lengths and their zero dot product, then verify that the new vectors span the old plane. If a residual is zero, the input direction was dependent; never divide by its length.

## Find an orthogonal complement
Put spanning vectors of $U$ into the rows of a matrix. Solving the homogeneous system gives $U^\perp$. For a subspace of $\mathbb R^n$, $\dim U+\dim U^\perp=n$. This is different from taking a complement with no orthogonality requirement.

This preparation follows the Module 5 guide. The scheduled Gram–Schmidt lecture has not been represented as already delivered.
