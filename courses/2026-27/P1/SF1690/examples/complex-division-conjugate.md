---
id: 'example:sf1690:complex-division-conjugate'
courseId: 'course:sf1690'
slug: complex-division-conjugate
title: Divide complex numbers and check the result
conceptIds: ['concept:sf1690:complex-number-basics']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

Write $(3+2i)/(1-i)$ in rectangular form.

Multiply the entire fraction by $(1+i)/(1+i)$:

$$
\frac{3+2i}{1-i}
=\frac{(3+2i)(1+i)}{(1-i)(1+i)}
=\frac{3+5i+2i^2}{1-i^2}
=\frac12+\frac52i.
$$

The denominator is $2$, not zero. Multiplying the answer back by $1-i$ gives $3+2i$.

The squared modulus is $(1/2)^2+(5/2)^2=13/2$. This agrees with $|3+2i|^2/|1-i|^2=13/2$, an independent size check.
