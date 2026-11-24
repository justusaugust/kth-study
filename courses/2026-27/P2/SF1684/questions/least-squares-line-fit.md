---
{
  "id": "question:sf1684:least-squares-line-fit",
  "courseId": "course:sf1684",
  "slug": "least-squares-line-fit",
  "title": "Fit a line and test orthogonality",
  "conceptIds": [
    "concept:sf1684:projections-and-least-squares"
  ],
  "answer": "$a=7/6$, $b=1/2$. The residual $\\mathbf y-A\\widehat{\\mathbf x}=(-1/6,1/3,-1/6)$ is orthogonal to $(1,1,1)$ and $(0,1,2)$.",
  "hints": [
    "Use a column of ones and a column of input values. Solve the two normal equations."
  ],
  "sourceIds": [
    "source:sf1684:lecture-plan",
    "source:sf1684:module-5-reading-guide"
  ],
  "lastChecked": "2026-11-24",
  "confidence": "supported",
  "relationships": []
}
---

Find the least-squares line $y=a+bt$ for $(0,1),(1,2),(2,2)$. Show that the residual is orthogonal to the two design-matrix columns.
