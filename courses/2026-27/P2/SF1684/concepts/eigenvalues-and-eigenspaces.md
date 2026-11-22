---
{
  "id": "concept:sf1684:eigenvalues-and-eigenspaces",
  "courseId": "course:sf1684",
  "slug": "eigenvalues-and-eigenspaces",
  "title": "Eigenvalues, eigenvectors, and eigenspaces",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "summary": "Find eigenvalues and describe all directions preserved by a linear map.",
  "centralInsight": "An eigenvector is a nonzero direction that the map only scales.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-18-11"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-4-reading-guide",
    "source:sf1684:lecture-plan"
  ]
}
---

## From a direction to an equation
A nonzero vector $\mathbf v$ is an eigenvector of a square matrix $A$ if $A\mathbf v=\lambda\mathbf v$. The scalar $\lambda$ can be zero, but the vector cannot. The eigenspace for $\lambda$ is $\ker(A-\lambda I)$ and includes the zero vector.

## Find the eigenvalues, then the vectors
Rearrange to $(A-\lambda I)\mathbf v=0$. A nonzero solution exists exactly when $\det(A-\lambda I)=0$. For each real root, row-reduce its own matrix $A-\lambda I$ and report a basis for the resulting nullspace. Check a basis vector in the original equation.

For $A=\begin{pmatrix}4&2\\0&2\end{pmatrix}$ the determinant equation is $(4-\lambda)(2-\lambda)=0$. At $\lambda=4$, $y=0$, giving basis $(1,0)$. At $\lambda=2$, $x+y=0$, giving basis $(-1,1)$. Indeed, $A(-1,1)=(-2,2)$.

A repeated root need not give two independent eigenvectors. For $A=\begin{pmatrix}3&1\\0&3\end{pmatrix}$, $A-3I$ still imposes $y=0$. The eigenspace is a line.
