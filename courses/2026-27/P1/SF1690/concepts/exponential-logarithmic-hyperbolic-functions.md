---
id: 'concept:sf1690:exponential-logarithmic-hyperbolic-functions'
courseId: 'course:sf1690'
slug: exponential-logarithmic-hyperbolic-functions
title: Exponential, logarithmic, and hyperbolic functions
summary: Use inverse functions and exponent laws to solve equations while preserving real domains.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-16-09']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

## Exponentials turn addition into multiplication

For a real exponential $a^x$, take $a>0$ and $a\ne1$. Its domain is $\mathbb R$ and its range is $(0,\infty)$; it passes through $(0,1)$ and never reaches zero. It increases when $a>1$ and decreases when $0<a<1$. Negative bases do not define real powers for every real exponent.

The laws $a^{u+v}=a^ua^v$, $a^{u-v}=a^u/a^v$, and $(a^u)^v=a^{uv}$ let you put both sides of an equation in the same base. Because an exponential is one-to-one, $a^u=a^v$ implies $u=v$. The number $e$ is a particular positive base, approximately $2.71828$; $\exp x=e^x$.

## A logarithm asks for the exponent

The equation $\log_a y=x$ means exactly $a^x=y$. Thus the logarithm has domain $(0,\infty)$ and range $\mathbb R$. Its graph reflects the exponential graph across $y=x$.

$$
\log_a(a^x)=x,\qquad a^{\log_a y}=y\quad(y>0).
$$

Write $\ln y=\log_e y$. For positive $u,v$ and real $r$:

$$
\ln(uv)=\ln u+\ln v,\qquad
\ln(u/v)=\ln u-\ln v,\qquad
\ln(u^r)=r\ln u.
$$

There is no corresponding sum rule: $\ln(u+v)$ is generally not $\ln u+\ln v$. Change base using $\log_a y=\ln y/\ln a$; $a=1$ is excluded because $\ln1=0$.

## Solve the equation and retain its domain

First require every original logarithm argument to be positive. Combine logarithms only after doing this. Solve the resulting algebraic equation, then reject candidates outside the original domain.

For example, $\ln(x^2)=2\ln|x|$ for $x\ne0$. Writing $2\ln x$ instead would silently discard all negative inputs. Similarly, $\ln((x-1)(x+1))$ can exist where $\ln(x-1)+\ln(x+1)$ does not.

For inequalities, remember direction: $\ln$ and $e^x$ preserve order, whereas $\log_a$ and $a^x$ reverse order for $0<a<1$.

## Hyperbolic functions are combinations of exponentials

Define, for every real $x$,

$$
\sinh x=\frac{e^x-e^{-x}}2,\qquad
\cosh x=\frac{e^x+e^{-x}}2,\qquad
\tanh x=\frac{\sinh x}{\cosh x}.
$$

Replacing $x$ by $-x$ shows that $\sinh$ and $\tanh$ are odd and $\cosh$ is even. Their domains are all $\mathbb R$; their ranges are respectively $\mathbb R$, $[1,\infty)$, and $(-1,1)$. In particular, $\cosh x$ is never zero, so $\tanh x$ is always defined.

Expanding the squares gives the central identity:

$$
\cosh^2x-\sinh^2x
=\frac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}{4}=1.
$$

The point $(\cosh x,\sinh x)$ lies on the right branch of a hyperbola. The minus sign distinguishes this identity from the unit-circle identity. Hyperbolic functions are not periodic, and $\cosh^2x+\sinh^2x=1$ is false except at $x=0$.

To solve an equation involving $\sinh$ or $\cosh$, substituting $t=e^x>0$ turns $e^{-x}$ into $1/t$. Solve for $t$, keep only positive values, and recover $x=\ln t$. No derivatives or integrals are needed for this lesson.
