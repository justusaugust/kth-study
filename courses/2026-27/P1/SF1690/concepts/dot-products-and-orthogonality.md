---
id: 'concept:sf1690:dot-products-and-orthogonality'
courseId: 'course:sf1690'
slug: dot-products-and-orthogonality
centralInsight: "The mixed term in a squared vector sum measures alignment; when it vanishes, the Pythagorean identity follows."
title: Dot products and orthogonality
summary: The dot product encodes alignment as a scalar; its square expansion and magnitude bound explain perpendicularity, Pythagoras and distance inequalities.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-29-13']
evidenceStatus: lecture
sourceIds: ['source:sf1690:lecture-13-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## A scalar that measures alignment

For $\mathbf u,\mathbf v\in\mathbb R^n$, multiply corresponding components and add:

$$
\mathbf u\cdot\mathbf v=\sum_{i=1}^n u_iv_i.
$$

The result is a real number, not a vector. In particular, $\mathbf v\cdot\mathbf v=\|\mathbf v\|^2$, so the dot product recovers length and the distance $\|\mathbf v-\mathbf u\|$.

The dot product is symmetric and distributes over addition:
$\mathbf u\cdot\mathbf v=\mathbf v\cdot\mathbf u$ and
$\mathbf u\cdot(\mathbf v+\mathbf w)=\mathbf u\cdot\mathbf v+\mathbf u\cdot\mathbf w$.
A scalar can be moved outside either factor: $(c\mathbf u)\cdot\mathbf v=c(\mathbf u\cdot\mathbf v)$. These rules often avoid long coordinate calculations.

## Find the angle only when both vectors are nonzero

$$
\cos\theta=\frac{\mathbf u\cdot\mathbf v}{\|\mathbf u\|\|\mathbf v\|},
\qquad 0\leq\theta\leq\pi.
$$

For nonzero vectors, the sign tells you where the angle lies before you calculate it: positive means less than $90^\circ$, zero means a right angle, and negative means greater than $90^\circ$. The endpoint cases are $0^\circ$ for the same direction and $180^\circ$ for opposite directions. For instance, $(1,0)$ and $(-1,1)$ have negative dot product and cannot make an acute angle. Use $\arccos$ to recover the angle itself.

The formula follows by expanding $\|\mathbf v-\mathbf u\|^2$ with the dot product and comparing with the cosine rule. It is undefined if either vector is zero; a zero arrow has no direction.

## Orthogonal is different from orthonormal

Vectors are orthogonal when their dot product is zero. This algebraic definition works in any dimension and includes the zero vector, even though its angle is undefined.

An orthogonal set requires zero dot product for every pair of distinct vectors. An orthonormal set also requires every vector to have length one. Checking just one pair, or just the lengths, is insufficient. The standard coordinate vectors form an orthonormal set.

For orthogonal vectors, expanding the square gives Pythagoras:

$$
\|\mathbf u+\mathbf v\|^2
=\|\mathbf u\|^2+2\mathbf u\cdot\mathbf v+\|\mathbf v\|^2
=\|\mathbf u\|^2+\|\mathbf v\|^2.
$$

## Why the angle formula stays within its domain

Cauchy–Schwarz states

$$
|\mathbf u\cdot\mathbf v|\leq\|\mathbf u\|\|\mathbf v\|.
$$

For nonzero vectors, the normalized dot product is therefore between $-1$ and $1$, exactly the domain of $\arccos$. Equality occurs for linearly dependent vectors, including the zero case. For nonzero vectors this means parallel or opposite directions.

Combining this bound with the square expansion proves the triangle inequality:

$$
\|\mathbf u+\mathbf v\|^2
\leq\|\mathbf u\|^2+2\|\mathbf u\|\|\mathbf v\|+\|\mathbf v\|^2
=(\|\mathbf u\|+\|\mathbf v\|)^2.
$$

Both sides have nonnegative square roots, so $\|\mathbf u+\mathbf v\|\leq\|\mathbf u\|+\|\mathbf v\|$. Following two displacements cannot be shorter than the straight displacement joining their endpoints. Lengths add exactly for vectors pointing in the same direction, or when one is zero.
