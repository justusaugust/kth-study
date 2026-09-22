---
id: 'example:sf1690:de-moivre-integer-power'
courseId: 'course:sf1690'
slug: de-moivre-integer-power
title: Raise a complex number without a long expansion
conceptIds: ['concept:sf1690:de-moivre-and-complex-roots']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

Find $(-1+i)^6$.

The modulus is $\sqrt2$. The point lies in quadrant II, so choose $\theta=3\pi/4$:

$$
-1+i=\sqrt2\bigl(\cos(3\pi/4)+i\sin(3\pi/4)\bigr).
$$

De Moivre gives modulus $(\sqrt2)^6=8$ and angle $6(3\pi/4)=9\pi/2$. Reducing the angle by $4\pi$ leaves $\pi/2$, so the result is $8i$.

An algebraic check is short: $(-1+i)^2=-2i$, and hence $(-1+i)^6=(-2i)^3=8i$. Using the reference angle $-\pi/4$ without checking the quadrant would misrepresent the original number, even if an even power happened to hide that error.
