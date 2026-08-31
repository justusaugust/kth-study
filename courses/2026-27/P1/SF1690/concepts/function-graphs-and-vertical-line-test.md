---
id: 'concept:sf1690:function-graphs-and-vertical-line-test'
courseId: 'course:sf1690'
slug: function-graphs-and-vertical-line-test
title: Function graphs and the vertical-line test
summary: >-
  The graph of a function is the set of input-output points $(x,f(x))$; a curve
  represents a function of x only when no vertical line meets it twice.
centralInsight: >-
  The vertical-line test is the geometric form of the one-output rule in the
  definition of a function.
commonMistake: >-
  Assuming every familiar curve is a function of $x$; a circle assigns two
  $y$-values to many $x$-values.
verifyPrompt: >-
  Apply the vertical-line test to a circle, a sideways parabola, and the upper
  semicircle, and state which are functions of $x$.
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
    from: 'concept:sf1690:function-graphs-and-vertical-line-test'
    to: 'concept:sf1690:functions-domain-and-range'
  - type: appears_in
    from: 'concept:sf1690:function-graphs-and-vertical-line-test'
    to: 'lecture:sf1690:2026-08-27-03'
  - type: supports
    from: 'concept:sf1690:function-graphs-and-vertical-line-test'
    to: 'concept:sf1690:quadratic-functions'
---
## A graph is a set of pairs

The graph of $f$ is

$$\{(x,f(x)):x\in D(f)\}.$$

A point $(x,y)$ belongs to the graph exactly when $x$ is allowed and $y=f(x)$. Tables of values can supply sample points, but the rule determines every point between them.

## Vertical lines test uniqueness

If a vertical line $x=a$ meets a curve more than once, that curve assigns more than one output to input $a$ and is not the graph of a function of $x$. The circle $x^2+y^2=1$ fails, but its upper half $y=\sqrt{1-x^2}$ and lower half $y=-\sqrt{1-x^2}$ are separate functions on $[-1,1]$.

Reference graphs such as $x$, $x^2$, $\sqrt{x}$, $x^3$, $1/x$, and $|x|$ become a visual vocabulary for later shifts, combinations, and inverses.
