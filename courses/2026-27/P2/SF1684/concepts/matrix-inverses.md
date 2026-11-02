---
{
  "id": "concept:sf1684:matrix-inverses",
  "courseId": "course:sf1684",
  "slug": "matrix-inverses",
  "title": "Matrix inverses and solving systems",
  "summary": "An inverse undoes a square matrix; row reduction constructs it or reveals that it does not exist.",
  "centralInsight": "Apply row operations to the identity alongside the matrix to record the transformation that undoes it.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-2",
    "source:sf1684:module-2-reading-guide"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Writing an inverse for a singular matrix or reversing factors in the wrong order.",
  "verifyPrompt": "Verify a proposed inverse by multiplication and use it to solve a small system."
}
---

## Define and verify

An inverse satisfies $AA^{-1}=A^{-1}A=I$. Not every square matrix is invertible. For example,

$$ A=\begin{pmatrix}1&2\\0&1\end{pmatrix},\qquad A^{-1}=\begin{pmatrix}1&-2\\0&1\end{pmatrix}. $$

Both products give the identity. If $A\mathbf{x}=\mathbf{b}$ and $A$ is invertible, left-multiplication gives $\mathbf{x}=A^{-1}\mathbf{b}$. With $\mathbf{b}=(5,2)$ here, the solution is $(1,2)$. Verify it in the original system.

## Build the inverse

Augment $A$ with the identity and perform the same row operations on both halves:

$$ [A\mid I]\longrightarrow[I\mid A^{-1}]. $$

If a pivot is missing on the left, $A$ is singular and has no inverse. Do not discard the right half or apply different operations to each half. An elementary matrix records one row operation.

## Undo a product in reverse order

For invertible matrices, $(AB)^{-1}=B^{-1}A^{-1}$. Do not distribute an inverse over addition. When solving a system, elimination often avoids constructing a whole inverse.

Read sections 3.2–3.3 for lecture 6 and attempt [workshop 4](https://canvas.kth.se/courses/65269/files/10687614#page=4).
