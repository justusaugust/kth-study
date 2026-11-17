---
{
  "id": "concept:sf1684:determinants-and-volume",
  "courseId": "course:sf1684",
  "slug": "determinants-and-volume",
  "title": "Determinants and oriented volume",
  "summary": "Compute determinants efficiently and track their response to row operations.",
  "centralInsight": "A determinant records oriented volume scaling and detects singularity for square matrices.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-11-08"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-3",
    "source:sf1684:module-3-reading-guide",
    "source:sf1684:lecture-plan"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## Start with two dimensions

$$\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc.$$

For $A=\begin{pmatrix}2&1\\1&3\end{pmatrix}$, $\det A=5$. The absolute value is the area scaling factor; the sign records orientation. A determinant of zero means a square matrix is singular. A rectangular matrix has no determinant in this course's usual definition.

## Reduce while keeping a ledger

Swapping two rows reverses the sign. Scaling a row by $k$ multiplies the determinant by $k$. Adding a multiple of one row to another leaves it unchanged. A triangular matrix's determinant is its diagonal product. Track every swap and scaling rather than confusing the determinant of the reduced matrix with the original one.

For the example above, subtract half the first row from the second. The diagonal entries become 2 and $5/2$, whose product is 5. No scaling correction is needed because the row replacement preserved the determinant.

## Cofactors and identities

Cofactor expansion along row $i$ uses $(-1)^{i+j}a_{ij}$ times the minor determinant. Choose a sparse row or column when possible. The alternating sign is part of each cofactor, not an optional final adjustment.

$$\det(AB)=\det A\det B,\qquad\det(A^{\mathsf T})=\det A.$$

For invertible $A$, $\det(A^{-1})=1/\det A$. In general $\det(A+B)$ is not $\det A+\det B$. Scaling every row of an $n$ by $n$ matrix by $k$ yields the factor $k^n$.

## Practice

Read sections 4.1–4.2. Compute a small determinant using both elimination and cofactor expansion, then explain the sign and absolute value geometrically.
