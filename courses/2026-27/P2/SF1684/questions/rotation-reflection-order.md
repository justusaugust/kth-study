---
{
  "id": "question:sf1684:rotation-reflection-order",
  "courseId": "course:sf1684",
  "slug": "rotation-reflection-order",
  "title": "Compare two composition orders",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "conceptIds": [
    "concept:sf1684:kernel-image-and-composition"
  ],
  "answer": "$S\\circ R(x,y)=(-y,-x)$ and $R\\circ S(x,y)=(y,x)$. The orthonormal columns give $R^{-1}=R^{\\mathsf T}=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$.",
  "hints": [
    "Apply the rightmost map first. Check whether the columns of the rotation matrix are orthonormal."
  ],
  "sourceIds": [
    "source:sf1684:module-4-reading-guide"
  ]
}
---

Let $R(x,y)=(-y,x)$ and $S(x,y)=(x,-y)$. Compute both $S\circ R$ and $R\circ S$. Give the inverse matrix of $R$ and explain why the transpose works.
