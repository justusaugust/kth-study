---
{
  "id": "concept:sf1684:bases-dimension-and-rank",
  "courseId": "course:sf1684",
  "slug": "bases-dimension-and-rank",
  "title": "Bases, dimension, and rank",
  "summary": "Choose independent generators and relate a matrix’s four fundamental spaces.",
  "centralInsight": "A basis both spans the space and has no redundant vector.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-24-13"
  ],
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

## Spanning is only half the test
A basis of a subspace is a linearly independent spanning set. Its size is the dimension. To test proposed basis vectors, put them in columns and solve the homogeneous system. A nontrivial relation means at least one vector is redundant. A basis of the zero subspace is the empty set, and its dimension is zero.

For $U=\operatorname{span}\{(1,0,1),(2,0,2),(1,1,2)\}$, the second generator is twice the first. The first and third are independent: their second components force the coefficient of the third to vanish, then the first coefficient vanishes. They form a basis, so $\dim U=2$.

## Read the right space from elimination
For an $m\times n$ matrix $A$, the column space lies in $\mathbb R^m$ and the null space lies in $\mathbb R^n$. Row-reduce to locate pivots, but use the **original pivot columns** as a column-space basis. Use the nonzero rows of a row-echelon matrix for a row-space basis. Solve $A\mathbf x=0$ to get a null-space basis.

The row rank and column rank agree. If that rank is $r$, then $\dim\ker A=n-r$: rank plus nullity equals the number of input coordinates, not the number of rows. Full column rank gives injectivity; full row rank gives surjectivity onto $\mathbb R^m$.

## Coordinates depend on the basis
In the basis $\mathcal B=((1,1),(1,-1))$, the vector $(5,1)$ has coordinates $(3,2)$ because $3(1,1)+2(1,-1)=(5,1)$. The coordinate pair records coefficients relative to $\mathcal B$; it is not a new geometric vector in the standard basis.
