---
id: 'concept:sf1690:cross-products-and-area'
courseId: 'course:sf1690'
slug: cross-products-and-area
centralInsight: "Swapping the inputs reverses the normal without changing the area, separating orientation from magnitude."
title: Cross products and area
summary: The cross product combines a perpendicular direction with an area magnitude; reversing its inputs flips orientation while preserving the measured area.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-10-05-15']
evidenceStatus: lecture
sourceIds: ['source:sf1690:lecture-15-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## A product whose result is a vector

For vectors in $\mathbb R^3$,

$$
\mathbf u\times\mathbf v
=(u_2v_3-u_3v_2,\ u_3v_1-u_1v_3,\ u_1v_2-u_2v_1).
$$

Unlike the dot product, this produces a vector. Its dot product with each input is zero. For nonparallel inputs it is therefore a nonzero normal to the plane of the two arrows. With parallel inputs, or a zero input, the cross product is zero and supplies no normal direction.

The determinant mnemonic has alternating signs $+,-,+$. In particular, the middle component is $u_3v_1-u_1v_3$, not its negative. A reliable calculation check is to dot your answer with both inputs.

## Order controls orientation

The right-hand rule selects the orientation: curl your right-hand fingers from $\mathbf u$ towards $\mathbf v$ through their smaller angle; your thumb points along $\mathbf u\times\mathbf v$. For the standard coordinate vectors,

$$
\mathbf e_1\times\mathbf e_2=\mathbf e_3,\qquad
\mathbf e_2\times\mathbf e_3=\mathbf e_1,\qquad
\mathbf e_3\times\mathbf e_1=\mathbf e_2.
$$

Reversing order reverses the result: $\mathbf v\times\mathbf u=-(\mathbf u\times\mathbf v)$. Therefore $\mathbf u\times\mathbf u=\mathbf0$.

Cross products distribute over addition and allow scalar factors to move outside. They are not associative: $\mathbf e_1\times(\mathbf e_1\times\mathbf e_2)=-\mathbf e_2$, but $(\mathbf e_1\times\mathbf e_1)\times\mathbf e_2=\mathbf0$. Keep the parentheses.

## The length measures area

For nonzero inputs and the angle $0\leq\theta\leq\pi$ between them,

$$
\|\mathbf u\times\mathbf v\|
=\|\mathbf u\|\|\mathbf v\|\sin\theta.
$$

This is base times perpendicular height: the area of their parallelogram. A useful identity connecting both products is

$$
\|\mathbf u\times\mathbf v\|^2
=\|\mathbf u\|^2\|\mathbf v\|^2-(\mathbf u\cdot\mathbf v)^2.
$$

Reversing the order changes the oriented normal but leaves the area unchanged. Parallel vectors have zero area, including opposite directions.

For triangle vertices $A,B,C$, first form two sides from the same vertex:

$$
\operatorname{Area}(ABC)=\frac12\|(B-A)\times(C-A)\|.
$$

The cross product alone is neither the area nor a unit normal: take its length for parallelogram area, halve that length for triangle area, or divide the nonzero vector by its length for an oriented unit normal. The coordinate formula here is the three-dimensional cross product; do not apply it to arbitrary $n$-component vectors.
