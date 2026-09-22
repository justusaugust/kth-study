---
id: 'concept:sf1690:de-moivre-and-complex-roots'
courseId: 'course:sf1690'
slug: de-moivre-and-complex-roots
title: De Moivre’s theorem and every complex root
summary: Multiply angles for integer powers and enumerate every complex root without losing branches.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-21-11']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

## Multiplication scales and rotates

For $z=r(\cos\theta+i\sin\theta)$ and $w=s(\cos\phi+i\sin\phi)$, with $r,s>0$, expand the product and apply the angle-addition formulas:

$$
zw=rs\bigl(\cos(\theta+\phi)+i\sin(\theta+\phi)\bigr).
$$

Thus moduli multiply and arguments add. Division reverses this: divide moduli and subtract arguments, provided the divisor is nonzero. Angles describe a direction modulo $2\pi$; adding a full turn changes neither the number nor its products.

This is why polar form is especially useful for repeated multiplication. Rectangular form remains convenient for addition: there is no rule that adds moduli and arguments to add complex numbers.

## De Moivre’s theorem

For an integer $n$,

$$
\bigl(\cos\theta+i\sin\theta\bigr)^n
=\cos(n\theta)+i\sin(n\theta).
$$

Consequently, $z^n=r^n(\cos(n\theta)+i\sin(n\theta))$. For positive $n$, repeated multiplication proves the result; for $n=0$, it gives $z^0=1$ when $z\ne0$. For negative $n$, take the reciprocal first, which requires $z\ne0$. The expression $0^0$ is not assigned a value here.

Always raise the modulus as well as multiplying the angle. For example, a number of modulus $2$ has fourth power of modulus $16$, not $2$.

Do not substitute $n=1/2$ into the integer theorem and assume the resulting value is the only square root. Noninteger powers need a branch choice; solving a root equation requires every branch.

## Recover all roots

To solve $w^n=z$ for a positive integer $n$, first consider $z\ne0$. Write $z=r(\cos\theta+i\sin\theta)$ with $r>0$, and write the unknown as $w=\rho(\cos\alpha+i\sin\alpha)$. Equality requires both

$$
\rho^n=r,\qquad n\alpha=\theta+2k\pi.
$$

The modulus is the positive real root $\rho=r^{1/n}$. The complete list is

$$
w_k=r^{1/n}\left(\cos\frac{\theta+2k\pi}{n}
+i\sin\frac{\theta+2k\pi}{n}\right),
\qquad k=0,1,\ldots,n-1.
$$

There are exactly $n$ distinct roots. Their arguments differ by $2\pi/n$, so they form a regular polygon on a circle of radius $r^{1/n}$. For $n=2$ the roots are opposite; for $n=1$ there is just one point.

Why stop at $n-1$? Increasing $k$ by $n$ adds $2\pi$ to the root angle and repeats the same point. Why are the listed roots distinct? Two indices in this range differ by less than $n$, so their angle difference cannot be a nonzero full turn.

If $z=0$, handle it separately: $w^n=0$ has only the single distinct root $w=0$ (of multiplicity $n$). Zero has no argument, so the polar angle derivation does not apply.

## Principal values are only one choice

Using a principal argument such as $\theta\in(-\pi,\pi]$ makes the starting angle consistent, but it does not remove the other roots. Choosing $\theta+2\pi$ instead merely reorders the same complete root set.

For instance, the principal square root of $-1$ is $i$, but the equation $w^2=-1$ has both $i$ and $-i$. A calculator may display only a principal value.

## A reliable workflow

1. Find the modulus and an argument of the right-hand side; check its quadrant.
2. Divide the argument **including $2k\pi$** by $n$, and take the positive real $n$th root of the modulus.
3. List exactly $n$ roots for a nonzero right-hand side; convert to rectangular form if requested.
4. Check a candidate by raising it to the $n$th power. Check the whole set for equal spacing and repeated points.

All angles in these formulas are radians. If using degrees, replace each full turn $2\pi$ with $360^\circ$ consistently.
