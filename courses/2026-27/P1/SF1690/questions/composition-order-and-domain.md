---
id: 'question:sf1690:composition-order-and-domain'
courseId: 'course:sf1690'
slug: composition-order-and-domain
hints:
  - 'Write the two orders as $f(g(x))$ and $g(f(x))$. Substitute the whole inner expression wherever the outer rule takes its input.'
  - 'For each order, check that the inner function accepts x and the outer function accepts the intermediate value. Where would a denominator become zero?'
title: Build both composition orders
conceptIds:
  - 'concept:sf1690:function-composition'
answer: >-
  $(f\circ g)(x)=1/(x-2)$ with domain $\mathbb R\setminus\{2\}$. $(g\circ
  f)(x)=1/x-2$ with domain $\mathbb R\setminus\{0\}$. The order changes which
  input is forbidden.
sourceIds:
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-28'
confidence: supported
relationships: []
---
For $f(x)=1/x$ and $g(x)=x-2$, calculate $f\circ g$ and $g\circ f$ and state the domain of each.
