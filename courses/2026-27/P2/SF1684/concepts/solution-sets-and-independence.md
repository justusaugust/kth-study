---
{
  "id": "concept:sf1684:solution-sets-and-independence",
  "courseId": "course:sf1684",
  "slug": "solution-sets-and-independence",
  "title": "Solution sets and linear independence",
  "summary": "Describe every solution to a system and use homogeneous equations to test independence.",
  "centralInsight": "An inhomogeneous solution set is a particular solution plus the nullspace.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-10-07"
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

## Separate existence from freedom

Row-reduce the augmented matrix. A contradictory row makes the system inconsistent. Otherwise pivot columns constrain variables and nonpivot columns give free parameters. Count variable columns, not the augmented column, when counting unknowns.

If $A\mathbf{x}=\mathbf{b}$ has one solution $\mathbf{x}_p$, every solution is $\mathbf{x}_p+\mathbf{z}$ with $A\mathbf{z}=\mathbf{0}$. Substituting verifies both directions: subtracting two particular solutions gives a homogeneous solution, and adding any homogeneous solution preserves the right-hand side.

## Worked family

For $x+2y=5$, set $y=t$:

$$\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}5\\0\end{pmatrix}+t\begin{pmatrix}-2\\1\end{pmatrix}.$$

The direction vector belongs to the homogeneous system. The whole affine line need not pass through the origin, so it need not be a vector subspace.

## Independence is a homogeneous test

Put the proposed vectors into the columns of a matrix and solve $A\mathbf{c}=\mathbf{0}$. They are independent exactly when only the zero coefficient vector works. A nonzero coefficient vector gives an explicit dependence relation. For $(1,2)$ and $(2,4)$, coefficients $(-2,1)$ give zero; the second vector adds no new direction.

## Practice

Read sections 3.4–3.5. Use the Module 3 reading guide for workshop problems. Explain the difference between a free parameter, an inconsistent equation and a dependence relation before doing another elimination.
