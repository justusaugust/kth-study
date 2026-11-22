---
{
  "id": "concept:sf1684:kernel-image-and-composition",
  "courseId": "course:sf1684",
  "slug": "kernel-image-and-composition",
  "title": "Kernel, image, and composition",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "summary": "Find what a map collapses, what it can reach, and how its matrix changes under composition.",
  "centralInsight": "Kernel constraints live in the domain. Image generators live in the codomain.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-19-12"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-4-reading-guide",
    "source:sf1684:lecture-plan"
  ]
}
---

## Compute both subspaces
For an $m\times n$ matrix, solve $A\mathbf x=0$ to get a kernel basis in $\mathbb R^n$. For a basis of the image in $\mathbb R^m$, find the pivot column numbers by elimination, then take **those columns from the original matrix**. The row operations generally change the column space.

For $A=\begin{pmatrix}1&2&0\\2&4&1\end{pmatrix}$ the kernel is $\operatorname{span}\{(-2,1,0)\}$. Columns 1 and 3 form an image basis. This map reaches all of $\mathbb R^2$ but sends distinct inputs to the same output, so it is surjective and not injective. Injectivity needs a trivial kernel. Surjectivity needs a pivot in each row. The dimensions of the kernel and image sum to the domain dimension.

## Order matters
If $T(\mathbf x)=A\mathbf x$ and $S(\mathbf y)=B\mathbf y$, then $S\circ T$ has matrix $BA$. The rightmost map acts first. Check sizes before multiplying. An invertible map has an inverse matrix $A^{-1}$ and a composition reverses order when inverted.

## Orthogonal maps
An orthogonal square matrix has orthonormal columns, so $Q^{\mathsf T}Q=I$ and $Q^{-1}=Q^{\mathsf T}$. Rotations and reflections preserve lengths and angles. A projection with a nonzero kernel is not invertible and is not an orthogonal matrix, even when it is an *orthogonal projection*.
