---
id: 'concept:sf1690:functions-domain-and-range'
courseId: 'course:sf1690'
slug: functions-domain-and-range
title: 'Functions, domain, and range'
summary: >-
  A function assigns one output to each allowed input; the domain records the
  allowed inputs and the range records the outputs actually attained.
centralInsight: >-
  A formula alone does not finish the definition of a function: its domain
  determines which inputs the rule is allowed to process.
commonMistake: >-
  Calling every real number an allowed input even when the formula divides by
  zero or takes an even root of a negative number.
verifyPrompt: >-
  Find the domain and range of the upper semicircle $f(x)=\sqrt{1-x^2}$ and
  explain why the full circle is not the graph of one function.
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
    from: 'concept:sf1690:functions-domain-and-range'
    to: 'concept:sf1690:real-numbers-and-lines'
  - type: appears_in
    from: 'concept:sf1690:functions-domain-and-range'
    to: 'lecture:sf1690:2026-08-27-03'
  - type: continues_to
    from: 'concept:sf1690:functions-domain-and-range'
    to: 'concept:sf1690:function-graphs-and-vertical-line-test'
---
## One input, one output

A function $f$ on a set $D$ assigns one specific value $f(x)$ to every $x\in D$. The domain $D(f)$ is the input set, and the range is

$$R(f)=\{f(x):x\in D(f)\}.$$

The notation $y=f(x)$ distinguishes the independent input $x$ from the dependent output $y$.

## The real-domain convention

If a real formula is given without a domain, take the largest set of real inputs for which the formula has a real value. Exclude zero denominators and negative radicands under even roots. Thus $\sqrt{x}$ has domain $[0,\infty)$, while $x/(x^2-4)$ excludes $x=\pm2$.

The range must be derived from outputs, not copied from the domain. For $f(x)=x^2$ on $\mathbb R$, $D(f)=\mathbb R$ but $R(f)=[0,\infty)$.
