---
{
  "id": "concept:sf1684:modules-3-4-review",
  "courseId": "course:sf1684",
  "slug": "modules-3-4-review",
  "title": "Modules 3–4 review",
  "summary": "A short route through solution sets, determinants and linear maps, with links back to the lessons and practice.",
  "centralInsight": "Connect row reduction, determinant tests and basis images instead of treating them as unrelated procedures.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-10-07",
    "lecture:sf1684:2026-11-11-08",
    "lecture:sf1684:2026-11-12-09",
    "lecture:sf1684:2026-11-17-10",
    "lecture:sf1684:2026-11-18-11",
    "lecture:sf1684:2026-11-19-12"
  ],
  "evidenceStatus": "supplemental",
  "sourceIds": [
    "source:sf1684:module-3-reading-guide",
    "source:sf1684:module-4-reading-guide",
    "source:sf1684:module-3-test-rescheduled"
  ],
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": []
}
---

## 1. Solve and describe the whole set

Read [solution sets and independence](/courses/sf1684/concepts/solution-sets-and-independence) and [Lecture 7](/courses/sf1684/lectures/2026-11-10-07). Row-reduce, check for an inconsistent row, identify free variables, then write a particular solution plus a linear combination of nullspace vectors.

For a homogeneous system, distinguish the zero solution from a free variable: a free variable produces nonzero solutions and therefore dependent columns. Check a proposed nullspace vector by multiplying it by the original matrix.

## 2. Keep a determinant ledger

Read [determinants and volume](/courses/sf1684/concepts/determinants-and-volume), [Lecture 8](/courses/sf1684/lectures/2026-11-11-08) and [Lecture 9](/courses/sf1684/lectures/2026-11-12-09). Record the effect of every row operation before multiplying diagonal entries.

A row swap changes the sign. Scaling one row by $c$ scales the determinant by $c$. Adding a multiple of another row preserves it. A zero determinant means a square matrix is singular; $|\det A|$ is the volume scale factor.

For cross products, check perpendicularity with two dot products. Use the magnitude for parallelogram area and half that for triangle area. A scalar triple product gives signed volume; take its absolute value for geometric volume.

## 3. Recover a linear map

Read [linear transformations](/courses/sf1684/concepts/linear-transformations) and [Lecture 10](/courses/sf1684/lectures/2026-11-17-10). Put the images of the standard basis vectors into the columns. Multiply by a test vector and check against the same linear combination of basis images.

A translation by a nonzero vector is not linear because it moves zero. Mapping zero to zero is necessary, but does not alone prove linearity. Test additivity and scalar multiplication when proving a claim.

## 4. Find eigenvalues, kernel, and image

For an eigenvalue, solve $\det(A-\lambda I)=0$. Substitute each root back and find a basis for its eigenspace. Then work on a rectangular matrix: solve $A\mathbf x=0$ for the kernel, take original pivot columns for the image, and say whether the map is injective or surjective. For composed maps, write the rightmost map first in your working. Read [Lecture 11](/courses/sf1684/lectures/2026-11-18-11) and [Lecture 12](/courses/sf1684/lectures/2026-11-19-12).

## Practise for the two tests

1. **Module 4 first.** Spend 35 minutes on [Module 4 practice](/practice?course=sf1684&work=seminar-test-04). Build a matrix from its basis images, compute two eigenspaces, and find the kernel and image of a rectangular map. Then compose a rotation and reflection in both orders.
2. **Module 3 after a break.** Spend 35 minutes on [Module 3 practice](/practice?course=sf1684&work=seminar-test-03). Test a subspace, compute a determinant with operations, and use a cross product for both area and volume.
3. Use the final 15 minutes to redo mistakes on a blank page. Explain why your method works before rechecking the arithmetic.

Bring valid physical photo ID. On 23 November the 15:00–17:00 seminar starts with Module 4, then a short break, then the rescheduled Module 3 test. The examiner gave no exact start minute for the second test. Use the official workshop problems and solutions in Sources after the practice sets.
