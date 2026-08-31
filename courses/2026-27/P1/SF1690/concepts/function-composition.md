---
id: 'concept:sf1690:function-composition'
courseId: 'course:sf1690'
slug: function-composition
title: Function composition
summary: >-
  The composite $(f\circ g)(x)=f(g(x))$ sends an input through $g$ first and
  then applies $f$ to the intermediate output.
centralInsight: >-
  Composition is an ordered pipeline, so its domain contains exactly the inputs
  that survive every stage in that order.
commonMistake: >-
  Reading $f\circ g$ from left to right and applying $f$ first, or declaring the
  final simplified formula's domain without checking the inner function.
verifyPrompt: >-
  Let $f(u)=\sqrt{u}$ and $g(x)=x+1$. Compute $f\circ g$ and $g\circ f$, state
  both domains, and explain why the results differ.
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
    from: 'concept:sf1690:function-composition'
    to: 'concept:sf1690:function-arithmetic-and-domains'
  - type: appears_in
    from: 'concept:sf1690:function-composition'
    to: 'lecture:sf1690:2026-08-28-04'
  - type: continues_to
    from: 'concept:sf1690:function-composition'
    to: 'concept:sf1690:piecewise-defined-functions'
---
## The inner function acts first

The composition of $f$ after $g$ is

$$(f\circ g)(x)=f(g(x)).$$

Start with $x$, compute $g(x)$, and use that result as the input of $f$. In general $f\circ g$ and $g\circ f$ are different because they run the rules in different orders.

## Domain of a composition

An input $x$ belongs to $D(f\circ g)$ only if $x\in D(g)$ and $g(x)\in D(f)$. For $f(u)=\sqrt{u}$ and $g(x)=x+1$,

$$(f\circ g)(x)=\sqrt{x+1},\qquad D(f\circ g)=[-1,\infty),$$

while

$$(g\circ f)(x)=\sqrt{x}+1,\qquad D(g\circ f)=[0,\infty).$$

The intermediate value, not just the final typography, determines whether the pipeline is legal.
