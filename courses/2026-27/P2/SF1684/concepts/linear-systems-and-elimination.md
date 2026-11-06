---
{
  "id": "concept:sf1684:linear-systems-and-elimination",
  "courseId": "course:sf1684",
  "slug": "linear-systems-and-elimination",
  "title": "Linear systems and Gaussian elimination",
  "summary": "Elementary row operations preserve the complete solution set.",
  "centralInsight": "A pivot constrains a variable; a free variable describes a whole family of solutions rather than a failed calculation.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-03-04"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-2",
    "source:sf1684:module-2-reading-guide"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Dropping the augmented column during row operations or mistaking a free variable for an inconsistency.",
  "verifyPrompt": "Solve a small system and substitute the result into every original equation."
}
---

## Form an augmented matrix

For $x+y=3$ and $2x-y=0$, align coefficients and constants:

$$\left[\begin{array}{cc|c}1&1&3\\2&-1&0\end{array}\right].$$

A row represents an equation. Swapping rows, multiplying a row by a nonzero scalar, or adding a multiple of another row preserves the solutions. Multiplying a row by zero does not.

## Eliminate, substitute, verify

Apply $R_2\leftarrow R_2-2R_1$ to obtain $-3y=-6$, hence $y=2$. Substitution gives $x=1$. Check both original equations: $1+2=3$ and $2(1)-2=0$.

Gaussian elimination gives echelon form followed by back substitution. Reduced row-echelon form also normalizes each pivot to one and clears its column above and below. Apply every operation to the augmented column as well.

## Read all solutions

A row $[0\;0\mid1]$ means $0=1$: no solution. A zero row adds no constraint. A consistent system has a unique solution if every variable column has a pivot; otherwise free variables parameterize infinitely many real solutions.

For $x+2y=3$ and $z=1$, choose $y=t$. All solutions are $(3-2t,t,1)$ for real $t$. A homogeneous system $A\mathbf{x}=\mathbf{0}$ always has the zero solution; free variables determine whether it also has nonzero solutions.

## Reading and practice

Prepare sections 2.1–2.2 for lecture 4, including examples 6 and 7 in 2.1. The guide excludes stability, roundoff error, and partial pivoting from 2.2. Attempt [workshop 3](https://canvas.kth.se/courses/65269/files/10687614#page=2) before checking its solutions.
