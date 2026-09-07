---
id: 'concept:sf1690:rational-functions-and-cancellation'
courseId: 'course:sf1690'
slug: rational-functions-and-cancellation
title: Rational functions and cancellation
summary: 'A quotient of polynomials is defined only where its denominator is nonzero. Cancelling a common factor does not restore an excluded input.'
centralInsight: 'Simplify the formula only after recording the original domain.'
commonMistake: 'Cancelling terms across addition, or silently filling a hole after cancelling a common factor.'
verifyPrompt: 'Simplify (x² − 1)/(x − 1). Is the result the same function as x + 1 on all real numbers?'
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-07-05']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-07'
confidence: supported
relationships:
  - {type: requires, from: 'concept:sf1690:rational-functions-and-cancellation', to: 'concept:sf1690:polynomial-roots-and-factors'}
  - {type: appears_in, from: 'concept:sf1690:rational-functions-and-cancellation', to: 'lecture:sf1690:2026-09-07-05'}
---
## Domain first

A rational function is $R(x)=p(x)/q(x)$, where $p$ and $q$ are polynomials and $q$ is not the zero polynomial. Its natural real domain excludes every real zero of $q$.

Factor both polynomials, record the exclusions, and cancel only common **factors**, not individual terms in a sum. For example, $(x+2)/x$ is $1+2/x$, not $2$.

## A cancelled factor leaves a hole

$$\frac{x^2-1}{x-1}=\frac{(x-1)(x+1)}{x-1}=x+1,\qquad x\ne1.$$

The graph follows the line $y=x+1$ but omits $(1,2)$. The simplified rule is useful, but the original expression still cannot be evaluated at $1$. The unrestricted line and this rational function are different functions because their domains differ.

## An uncancelled denominator factor

For $R(x)=(x+1)/(x-2)$, the denominator vanishes at $2$ while the numerator does not. Values become unbounded as $x$ approaches $2$; the graph has a vertical asymptote there. Division rewrites it as

$$R(x)=1+\frac{3}{x-2}.$$

This also shows why the graph approaches the horizontal line $y=1$ for large positive or negative inputs. In general, reduce common factors before deciding whether an excluded input produces a hole or a vertical asymptote.
