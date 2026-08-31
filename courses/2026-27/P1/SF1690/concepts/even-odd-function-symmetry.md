---
id: 'concept:sf1690:even-odd-function-symmetry'
courseId: 'course:sf1690'
slug: even-odd-function-symmetry
title: Even and odd function symmetry
summary: >-
  The identity $f(-x)=f(x)$ gives y-axis symmetry; $f(-x)=-f(x)$ gives origin
  symmetry.
centralInsight: >-
  Parity is an algebraic identity on a domain symmetric about zero, and the
  corresponding graph symmetry is its geometric consequence.
commonMistake: >-
  Checking one convenient value of $x$ instead of proving the identity for every
  input, or calling a function odd merely because it is not even.
verifyPrompt: >-
  Classify $x^4-3x^2+1$, $x^3+1/x$, and $x^2+2x$ as even, odd, or neither by
  substituting $-x$.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-27-03'
evidenceStatus: curriculum
sourceIds:
  - 'source:sf1690:canvas-course-plan-26'
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-27'
confidence: supported
relationships:
  - type: requires
    from: 'concept:sf1690:even-odd-function-symmetry'
    to: 'concept:sf1690:function-graphs-and-vertical-line-test'
  - type: appears_in
    from: 'concept:sf1690:even-odd-function-symmetry'
    to: 'lecture:sf1690:2026-08-27-03'
---
## Algebraic tests

Assume $x\in D(f)$ implies $-x\in D(f)$. The function is even if

$$f(-x)=f(x)$$

for every input, and odd if

$$f(-x)=-f(x)$$

for every input. Even graphs are symmetric about the $y$-axis; odd graphs are symmetric about the origin.

Even powers and $|x|$ are even. Odd powers and $1/x$ are odd on symmetric domains. Sums of even functions stay even, sums of odd functions stay odd, but a sum containing a nonzero even part and a nonzero odd part is usually neither. If an odd function is defined at zero, then $f(0)=0$.
