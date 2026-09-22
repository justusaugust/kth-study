---
id: 'example:sf1690:hyperbolic-exponential-substitution'
courseId: 'course:sf1690'
slug: hyperbolic-exponential-substitution
title: Solve a hyperbolic equation through a positive variable
conceptIds: ['concept:sf1690:exponential-logarithmic-hyperbolic-functions']
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

Solve $\cosh x=5/4$ for real $x$.

Set $t=e^x>0$, so $e^{-x}=1/t$. Then

$$
\frac{t+1/t}{2}=\frac54
\quad\Longrightarrow\quad 2t^2-5t+2=0
\quad\Longrightarrow\quad (2t-1)(t-2)=0.
$$

Both $t=1/2$ and $t=2$ are positive, so $x=-\ln2$ or $x=\ln2$. This matches the even symmetry of $\cosh$.

At $x=\ln2$, $\sinh x=(2-1/2)/2=3/4$ and $\tanh x=3/5$. At $x=-\ln2$ their signs reverse. The identity check is $(5/4)^2-(3/4)^2=1$.
