---
id: 'concept:sf1690:inverse-functions'
courseId: 'course:sf1690'
slug: inverse-functions
title: Inverse functions and domain restrictions
summary: An inverse exists on the range when each output comes from exactly one input; its domain and range exchange roles.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-11-07']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-13'
confidence: supported
relationships: []
---

## Undo a correspondence

If $f(a)=b$, then $f^{-1}(b)=a$. The notation $f^{-1}$ means the inverse **function**, not the reciprocal $1/f$.

A function is one-to-one (injective) when different inputs have different outputs. It then has an inverse defined on its range. To be invertible onto a specified codomain, it must also reach every member of that codomain: it must be bijective.

## The horizontal-line test

Each horizontal line must meet the graph at most once. Two intersections mean the same output came from two different inputs, so the inverse would have two outputs for one input.

Strictly increasing or strictly decreasing functions on an interval are one-to-one. The whole parabola $y=x^2$ is not: $f(2)=f(-2)=4$.

## Find the formula, then check its domain

Write $y=f(x)$, solve for $x$ in terms of $y$, and rename the independent variable. Carry any original restriction through the rearrangement.

For $f(x)=x^2$ on $[0,\infty)$, the inverse is $\sqrt{x}$ on $[0,\infty)$. On $(-\infty,0]$, the inverse is $-\sqrt{x}$. Writing $\pm\sqrt{x}$ does not give an inverse function.

The inverse's domain is the original range, and its range is the original domain. Swapping $(a,b)$ with $(b,a)$ reflects the graph across $y=x$.

## Verify both compositions

$$
f^{-1}(f(x))=x\quad (x\in\operatorname{dom}f)
$$

$$
f(f^{-1}(y))=y\quad (y\in\operatorname{range}f).
$$

These statements include their domains. For example, $\sqrt{x^2}=|x|$, not $x$ for every real $x$. Restricting to $x\ge0$ is exactly what makes the positive square-root composition work.
