---
id: 'concept:sf1690:real-numbers-and-lines'
courseId: 'course:sf1690'
slug: real-numbers-and-lines
title: 'Real numbers, inequalities, and intervals'
summary: >-
  Real numbers are ordered points on a line; inequalities and interval notation
  describe which points satisfy a condition.
centralInsight: >-
  An inequality is an order statement, so every algebraic manipulation must
  preserve—or deliberately reverse—that order.
commonMistake: >-
  Multiplying or dividing by a negative number without reversing the inequality
  sign, or including a value where a denominator is zero.
verifyPrompt: >-
  Explain why multiplying by a negative reverses order, then translate one
  inequality into interval notation.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-24-01'
evidenceStatus: lecture
sourceIds:
  - 'source:sf1690:canvas-course-plan-26'
  - 'source:sf1690:lecture-1-board-photos'
lastChecked: '2026-08-24'
confidence: supported
relationships:
  - type: appears_in
    from: 'concept:sf1690:real-numbers-and-lines'
    to: 'lecture:sf1690:2026-08-24-01'
  - type: continues_to
    from: 'concept:sf1690:real-numbers-and-lines'
    to: 'concept:sf1690:absolute-value'
---
## Vocabulary and notation

- $x\in\mathbb R$: $x$ **belongs to** the real numbers.
- $P\Rightarrow Q$: $P$ **implies** $Q$.
- $P\iff Q$: $P$ holds **if and only if** $Q$; the statements are equivalent.
- $\{x\in\mathbb R\mid P(x)\}$: the set of real numbers **such that** condition $P(x)$ holds.
- A **solution set** contains every value that makes an equation or inequality true.

## The real-number system

$$\mathbb N\subset\mathbb Z\subset\mathbb Q\subset\mathbb R.$$

Natural numbers are contained in the integers, which are contained in the rational numbers, which are contained in the real numbers. Irrational numbers such as $\sqrt2$ and $\pi$ are real but not rational. On the real line, $a<b$ means that $a$ lies left of $b$.

## Manipulating inequalities

For $a,b,c\in\mathbb R$:

1. Adding or subtracting the same number preserves order: $a<b\Rightarrow a\pm c<b\pm c$.
2. Multiplying by $c>0$ preserves order: $a<b\Rightarrow ac<bc$.
3. Multiplying by $c<0$ reverses order: $a<b\Rightarrow ac>bc$.
4. If $0<a<b$, taking reciprocals reverses order: $1/b<1/a$. This reciprocal rule cannot be used blindly across zero.

## Intervals

Parentheses exclude an endpoint and square brackets include it:

- $(a,b)=\{x\in\mathbb R\mid a<x<b\}$
- $[a,b]=\{x\in\mathbb R\mid a\le x\le b\}$
- $(a,b]=\{x\in\mathbb R\mid a<x\le b\}$
- $[a,b)=\{x\in\mathbb R\mid a\le x<b\}$
- $(a,\infty)=\{x\in\mathbb R\mid x>a\}$
- $(-\infty,a]=\{x\in\mathbb R\mid x\le a\}$

Infinity is a direction, not a real endpoint, so it always takes a parenthesis. For rational inequalities, locate numerator zeros and denominator zeros, split the real line at those critical numbers, and determine the sign on each interval.
