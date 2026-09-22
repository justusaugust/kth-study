---
id: 'example:sf1690:logarithm-equation-domain'
courseId: 'course:sf1690'
slug: logarithm-equation-domain
title: Reject a root excluded by the original logarithms
conceptIds: ['concept:sf1690:exponential-logarithmic-hyperbolic-functions']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

Solve $\ln(x-1)+\ln(x+1)=\ln8$ over the reals.

Both arguments must be positive, so $x>1$. On this domain, combine the logarithms:

$$
\ln((x-1)(x+1))=\ln8
\quad\Longrightarrow\quad x^2-1=8.
$$

The algebra gives $x=\pm3$. Only $x=3$ satisfies $x>1$. Substitution confirms $\ln2+\ln4=\ln8$.

The candidate $-3$ makes the product positive but makes both original arguments negative. Checking the product alone would admit an invalid solution.
