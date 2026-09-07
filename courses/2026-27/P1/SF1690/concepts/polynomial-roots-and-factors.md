---
id: 'concept:sf1690:polynomial-roots-and-factors'
courseId: 'course:sf1690'
slug: polynomial-roots-and-factors
title: Polynomial roots and factors
summary: 'A root r of a polynomial corresponds to a factor x − r. Repeated factors determine whether the graph crosses or touches the axis.'
centralInsight: 'Expanded form makes coefficients visible; factored form makes roots and their multiplicities visible. They describe the same polynomial.'
commonMistake: 'Assuming a degree-n polynomial must have n distinct real roots. Some roots repeat, and some are not real.'
verifyPrompt: 'Factor x³ − 3x² + 4 and identify which root the graph crosses and which it touches.'
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-07-05']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-07'
confidence: supported
relationships:
  - {type: requires, from: 'concept:sf1690:polynomial-roots-and-factors', to: 'concept:sf1690:quadratic-functions'}
  - {type: appears_in, from: 'concept:sf1690:polynomial-roots-and-factors', to: 'lecture:sf1690:2026-09-07-05'}
---
## Degree and leading term

A polynomial has the form

$$p(x)=a_nx^n+a_{n-1}x^{n-1}+\cdots+a_1x+a_0,$$

where the exponents are nonnegative integers and $a_n\ne0$. Its degree is $n$, and its domain is all real numbers. The leading term $a_nx^n$ determines the graph's behaviour far to the left and right. For positive $a_n$, an even-degree graph rises at both ends; an odd-degree graph falls on the left and rises on the right. A negative leading coefficient reverses those directions.

## From a root to a factor

Polynomial division gives

$$p(x)=(x-r)q(x)+p(r).$$

The remainder is $p(r)$. In particular, $p(r)=0$ exactly when $x-r$ is a factor. After finding one root, divide by its factor and solve the lower-degree polynomial. Check the result by multiplying the factors back out.

For integer coefficients, a rational root in lowest terms must have a numerator dividing the constant coefficient and a denominator dividing the leading coefficient. These are candidates to test, not guaranteed roots. For instance, $x^2-2$ has irrational roots and $x^2+1$ has no real roots.

## Multiplicity and the graph

If $p(x)=(x-r)^m q(x)$ with $q(r)\ne0$, the root $r$ has multiplicity $m$. An odd multiplicity changes sign across $r$, so the curve crosses the axis. An even multiplicity preserves the sign near $r$, so the curve touches the axis and turns back.

Use the quadratic explorer below as the degree-two case: set $a=1$, $b=0$ and move $c$ from negative to zero to positive. Two distinct real roots merge into a double root and then disappear from the real axis.
