---
id: 'concept:sf1690:complex-number-basics'
courseId: 'course:sf1690'
slug: complex-number-basics
title: Complex numbers in algebra and the plane
summary: Calculate with i, conjugates and moduli, then interpret a complex number by its position and angle.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-17-10']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

## Extend the number system with one rule

There is no real solution of $x^2=-1$. Complex numbers add a number $i$ satisfying $i^2=-1$. Every complex number has a unique form $z=a+bi$, where $a,b$ are real. Its real part is $a$ and its imaginary part is the real number $b$, not $bi$.

Two complex numbers are equal exactly when both their real and imaginary parts agree. Add and subtract matching parts; multiply by distributing and replacing $i^2$ with $-1$:

$$
(a+bi)(c+di)=(ac-bd)+(ad+bc)i.
$$

Powers of $i$ repeat every four: $1,i,-1,-i,1,\ldots$. Complex numbers do not have an order compatible with the usual real-number arithmetic, so statements such as $i>0$ are not used.

## Conjugation makes division possible

The conjugate of $z=a+bi$ is $\bar z=a-bi$. In the complex plane, conjugation reflects the point $(a,b)$ across the real axis.

$$
z\bar z=(a+bi)(a-bi)=a^2+b^2.
$$

To divide by $c+di\ne0$, multiply numerator and denominator by $c-di$. The denominator becomes the positive real number $c^2+d^2$. Division by zero remains forbidden. Multiplying only the denominator by the conjugate would change the number.

## Modulus is a distance, not a complex square

The modulus is the distance from the origin:

$$
|z|=\sqrt{a^2+b^2},\qquad |z|^2=z\bar z.
$$

It is a nonnegative real number. Usually $z^2\ne|z|^2$: for $z=i$, these are $-1$ and $1$. More generally, $|z-w|$ is the distance between the two points. Thus $|z-(1+2i)|=3$ describes a circle with centre $(1,2)$ and radius $3$.

Useful checks are $|zw|=|z||w|$ and $|\bar z|=|z|$. They can catch arithmetic errors, but equal moduli alone do not imply equal complex numbers.

## Rectangular and polar descriptions

For $z\ne0$, let $r=|z|>0$ and choose an angle $\theta$ from the positive real axis to $(a,b)$. Then

$$
z=r(\cos\theta+i\sin\theta),\qquad
\cos\theta=a/r,\quad\sin\theta=b/r.
$$

All angles $\theta+2k\pi$, $k\in\mathbb Z$, describe the same point. If a principal argument is needed, this guide uses $(-\pi,\pi]$; check the interval requested in your problem. Zero has modulus zero but no defined argument.

The ratio $b/a$ alone loses quadrant information, and it is undefined on the imaginary axis. Use the signs of both coordinates with the unit circle. For example, $-1+i$ has argument $3\pi/4$, not $-\pi/4$.

## Quadratics and square-root traps

A quadratic with real coefficients and negative discriminant has two conjugate complex roots. From $(z-h)^2=-r^2$ with $r>0$, obtain $z=h\pm ri$.

The symbol $\sqrt{-4}$ conventionally denotes the principal square root $2i$, whereas solving $z^2=-4$ requires both $2i$ and $-2i$. Do not extend $\sqrt{uv}=\sqrt u\sqrt v$ indiscriminately to negative or complex inputs: $\sqrt{-1}\sqrt{-1}=-1$, but $\sqrt{(-1)(-1)}=1$.

This guide covers basic arithmetic and geometric representation. The saved plan assigns de Moivre's theorem and general complex root families to Lecture 11.
