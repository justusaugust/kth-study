---
id: 'concept:sf1690:piecewise-defined-functions'
courseId: 'course:sf1690'
slug: piecewise-defined-functions
title: Piecewise-defined functions
summary: >-
  A piecewise function uses different formulas on different parts of its domain,
  with interval conditions selecting the active formula.
centralInsight: >-
  Evaluation begins by locating the input in the correct interval; only then do
  you apply that branch's formula.
commonMistake: >-
  Ignoring whether a breakpoint is included, which can apply the wrong branch or
  assign two values to the same input.
verifyPrompt: >-
  Evaluate a three-branch function at points on both sides of each breakpoint
  and at the breakpoints themselves, explaining each branch choice.
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
    from: 'concept:sf1690:piecewise-defined-functions'
    to: 'concept:sf1690:functions-domain-and-range'
  - type: appears_in
    from: 'concept:sf1690:piecewise-defined-functions'
    to: 'lecture:sf1690:2026-08-28-04'
  - type: supports
    from: 'concept:sf1690:piecewise-defined-functions'
    to: 'concept:sf1690:absolute-value'
---
## One function, several local rules

A piecewise function lists a formula together with the inputs for which that formula applies. For example,

$$p(x)=\begin{cases}x+3,&x<-1,\\x^2,&-1\le x\le1,\\2-x,&x>1.\end{cases}$$

To evaluate $p(x)$, first identify which condition contains the input. At $x=-1$, the middle branch applies because it includes the endpoint, so $p(-1)=1$.

## Graph the conditions as carefully as the formulas

A hollow endpoint marks a strict inequality; a filled endpoint marks an included value. Piecewise rules can model switching systems, tiered prices, absolute value, the signum function, and step functions. The intervals must cover the intended domain without giving one input two conflicting outputs.
