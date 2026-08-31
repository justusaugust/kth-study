---
id: 'concept:sf1690:function-arithmetic-and-domains'
courseId: 'course:sf1690'
slug: function-arithmetic-and-domains
title: Function arithmetic and shared domains
summary: >-
  Sums, differences, products, and quotients combine the values of two functions
  at the same input, wherever both functions are defined.
centralInsight: >-
  The algebra is pointwise, but the domain is structural: start with the
  intersection of both domains and remove any input that makes a quotient
  denominator zero.
commonMistake: >-
  Simplifying a formula and then forgetting restrictions inherited from the
  original functions, especially a denominator that was zero before
  cancellation.
verifyPrompt: >-
  For $f(x)=\sqrt{x}$ and $g(x)=\sqrt{1-x}$, find the domains of $f+g$, $fg$,
  $f/g$, and $g/f$.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-28-04'
evidenceStatus: curriculum
sourceIds:
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-28'
confidence: supported
relationships:
  - type: requires
    from: 'concept:sf1690:function-arithmetic-and-domains'
    to: 'concept:sf1690:functions-domain-and-range'
  - type: appears_in
    from: 'concept:sf1690:function-arithmetic-and-domains'
    to: 'lecture:sf1690:2026-08-28-04'
  - type: continues_to
    from: 'concept:sf1690:function-arithmetic-and-domains'
    to: 'concept:sf1690:function-composition'
---
## Combine values at one input

For functions $f$ and $g$, define

$$(f+g)(x)=f(x)+g(x),\qquad (fg)(x)=f(x)g(x),\qquad \left(\frac fg\right)(x)=\frac{f(x)}{g(x)}.$$

Differences work in the same way, and a constant multiple satisfies $(cf)(x)=c\,f(x)$. These rules combine outputs after the same input $x$ has been accepted by both functions.

## Carry the domain through the construction

The domain of a sum, difference, or product is the intersection $D(f)\cap D(g)$. A quotient needs one more restriction: remove every $x$ for which $g(x)=0$.

For $f(x)=\sqrt{x}$ and $g(x)=\sqrt{1-x}$, the shared domain is $[0,1]$. Hence $f+g$ and $fg$ use $[0,1]$, while $f/g$ uses $[0,1)$ and $g/f$ uses $(0,1]$.
