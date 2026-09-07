---
id: 'question:sf1690:even-odd-neither'
courseId: 'course:sf1690'
slug: even-odd-neither
hints:
  - 'First check whether the domain contains -x whenever it contains x. Then substitute -x into every occurrence of x.'
  - 'Simplify $f(-x)$ and compare the entire expression with both $f(x)$ and $-f(x)$, not just one term.'
title: Prove a parity classification
conceptIds:
  - 'concept:sf1690:even-odd-function-symmetry'
answer: >-
  $f(-x)=(-x)^3+1/(-x)=-x^3-1/x=-f(x)$, and the domain is symmetric about zero.
  Therefore $f$ is odd.
sourceIds:
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-27'
confidence: supported
relationships: []
---
Classify $f(x)=x^3+1/x$ on $\mathbb R\setminus\{0\}$ as even, odd, or neither and prove it algebraically.
