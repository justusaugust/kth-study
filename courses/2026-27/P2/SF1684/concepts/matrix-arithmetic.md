---
{
  "id": "concept:sf1684:matrix-arithmetic",
  "courseId": "course:sf1684",
  "slug": "matrix-arithmetic",
  "title": "Matrix arithmetic",
  "summary": "Dimensions determine whether a product exists; multiplication follows row-by-column order.",
  "centralInsight": "Read each product entry as one row paired with one column, and check dimensions before multiplying.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-04-05"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-2",
    "source:sf1684:module-2-reading-guide"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Multiplying entries in matching positions instead of taking row-by-column products.",
  "verifyPrompt": "Check the dimensions, calculate one entry, and explain why reversing the factors can change the result."
}
---

## Check the dimensions

An $m\times n$ matrix has $m$ rows and $n$ columns. Addition requires the same shape and acts entry by entry. If $A$ is $m\times n$ and $B$ is $n\times p$, then $AB$ is $m\times p$, with

$$ (AB)_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}. $$

The inner dimensions must agree. Matrix multiplication is not entrywise multiplication.

## Order matters

Let

$$ A=\begin{pmatrix}1&1\\0&1\end{pmatrix},\qquad B=\begin{pmatrix}1&0\\1&1\end{pmatrix}. $$

Then

$$ AB=\begin{pmatrix}2&1\\1&1\end{pmatrix},\qquad BA=\begin{pmatrix}1&1\\1&2\end{pmatrix}. $$

Both products exist but differ. Associativity and distributivity hold for compatible dimensions; commutativity generally does not.

## Transpose and identity

Transposition swaps rows and columns: $(A^T)_{ij}=a_{ji}$. It reverses product order: $(AB)^T=B^TA^T$. The identity $I_n$ leaves compatible vectors and matrices unchanged. A zero matrix has all entries zero; its shape still matters.

For lecture 5, read section 3.1, excluding the inner-and-outer-product discussion specified in the [reading guide](https://canvas.kth.se/courses/65269/files/10687614).
