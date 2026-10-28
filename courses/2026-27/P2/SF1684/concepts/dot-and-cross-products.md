---
{
  "id": "concept:sf1684:dot-and-cross-products",
  "courseId": "course:sf1684",
  "slug": "dot-and-cross-products",
  "title": "Dot product, angles, and cross product",
  "summary": "Use the dot product for alignment and the cross product for perpendicular direction and area.",
  "centralInsight": "The dot product is a scalar measuring alignment; the cross product is a vector encoding orientation and area.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:sf1684:2026-10-27-02"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:sf1684:lecture-plan",
    "source:sf1684:module-1"
  ],
  "lastChecked": "2026-10-28",
  "confidence": "supported",
  "relationships": []
}
---

## Dot product

$$\mathbf{u}\cdot\mathbf{v}=u_1v_1+u_2v_2+u_3v_3=\|\mathbf{u}\|\|\mathbf{v}\|\cos\theta.$$

For nonzero vectors, a zero dot product means perpendicular directions. With $\mathbf{u}=(1,2,0)$ and $\mathbf{v}=(2,-1,0)$, the result is $2-2=0$. The zero vector has zero dot product with every vector, but has no defined angle.

## Cross product in three dimensions

$$\mathbf{u}\times\mathbf{v}=(u_2v_3-u_3v_2,\ u_3v_1-u_1v_3,\ u_1v_2-u_2v_1).$$

The cross product is a vector perpendicular to both inputs. Its length is the parallelogram area; half that length is the triangle area. Order matters: swapping the inputs reverses its sign.

For the example above, $\mathbf{u}\times\mathbf{v}=(0,0,-5)$, so the parallelogram has area $5$. Check perpendicularity by taking the dot product of the result with each input.
