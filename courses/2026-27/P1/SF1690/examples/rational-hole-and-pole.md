---
id: 'example:sf1690:rational-hole-and-pole'
courseId: 'course:sf1690'
slug: rational-hole-and-pole
title: Separate a hole from a vertical asymptote
conceptIds: ['concept:sf1690:rational-functions-and-cancellation']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-07'
confidence: supported
relationships: []
---
Consider $R(x)=(x^2-1)/(x^2-x-2)$. Factoring the denominator gives $(x-2)(x+1)$, so exclude $-1$ and $2$ before cancelling:

$$R(x)=\frac{(x-1)(x+1)}{(x-2)(x+1)}=\frac{x-1}{x-2}=1+\frac1{x-2},\qquad x\notin\{-1,2\}.$$

At $x=-1$, the reduced expression gives $2/3$, so the graph has a hole at $(-1,2/3)$. At $x=2$, the denominator still vanishes and the reduced numerator does not: this is a vertical asymptote. The only zero is $x=1$; $x=-1$ is not a zero because it is outside the domain.
