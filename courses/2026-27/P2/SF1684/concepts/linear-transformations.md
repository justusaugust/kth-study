---
{
  "id": "concept:sf1684:linear-transformations",
  "courseId": "course:sf1684",
  "slug": "linear-transformations",
  "title": "Linear transformations and geometry",
  "summary": "Recognise linear maps and build their standard matrices from basis-vector images.",
  "centralInsight": "A linear map is determined by what it does to basis vectors.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-11-17-10"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:sf1684:module-4",
    "source:sf1684:module-4-reading-guide",
    "source:sf1684:lecture-plan"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## Test the definition

A map is linear if it preserves vector addition and scalar multiplication. Together these imply $T(\mathbf{0})=\mathbf{0}$, a useful rejection test but not a sufficient proof. A nonzero translation fails this test; squaring coordinates may preserve zero and still fail additivity.

## Build the columns

If $T:\mathbb{R}^2\to\mathbb{R}^2$, write a vector as $x\mathbf{e}_1+y\mathbf{e}_2$. Linearity gives $T(x,y)=xT(\mathbf{e}_1)+yT(\mathbf{e}_2)$. The images become the columns, not the rows, of the standard matrix.

For $T(1,0)=(2,1)$ and $T(0,1)=(-1,3)$,

$$A=\begin{pmatrix}2&-1\\1&3\end{pmatrix},\qquad T(3,2)=(4,9).$$

Verify by taking three copies of the first image and two of the second. A map from $\mathbb{R}^n$ to $\mathbb{R}^m$ has an $m$ by $n$ matrix.

## Read the geometry

Scaling changes lengths, reflections reverse an axis or direction, rotations turn directions, and projections collapse one or more directions. In two dimensions, projection onto the x-axis has diagonal entries 1 and 0: it sends $(x,y)$ to $(x,0)$ and loses the vertical component.

For counterclockwise rotation by $\theta$,

$$R=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}.$$

At a right angle the first basis vector maps upward and the second maps left. Test basis vectors to catch a sign or column-order mistake.

## Practice

Read sections 6.1–6.2 and use the Module 4 guide. Give a counterexample to linearity for a translation; then recover a matrix from two independent input-output pairs by solving for its basis images.
