---
id: 'concept:sf1690:inverse-trigonometric-functions'
courseId: 'course:sf1690'
slug: inverse-trigonometric-functions
title: Inverse trigonometric functions and principal angles
summary: Recover one principal angle from a trigonometric value, then distinguish that angle from all solutions of an equation.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-14-08']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-14'
confidence: supported
relationships: []
---

## Why choose a principal interval?

Sine and cosine repeat, so neither is one-to-one on the whole real line. An inverse must return exactly one angle. Restrict the original function to an interval where it is one-to-one and covers its full range.

- $\arcsin x$: inputs in $[-1,1]$; principal angles in $[-\pi/2,\pi/2]$.
- $\arccos x$: inputs in $[-1,1]$; principal angles in $[0,\pi]$.
- $\arctan x$: inputs in $\mathbb R$; principal angles in $(-\pi/2,\pi/2)$.

All angles here are in radians. The tangent endpoints are excluded: tangent is undefined there. The notation $\sin^{-1}x$ usually means $\arcsin x$, **not** $1/\sin x$.

## Read the unit circle backwards

On the unit circle, a point has coordinates $(\cos\theta,\sin\theta)$. Arcsine asks for an angle with a given vertical coordinate; arccosine asks for an angle with a given horizontal coordinate. The principal interval chooses which point is meant.

Use the angle control below to compare $30^\circ$ and $150^\circ$. Both have sine $1/2$, but $\arcsin(1/2)=\pi/6$, not $5\pi/6$. For cosine, the principal angle always lies on the upper semicircle.

## Cancellation has a direction

For every allowed input, $\sin(\arcsin x)=x$, $\cos(\arccos x)=x$, and $\tan(\arctan x)=x$.

The reverse compositions return the original angle **only inside the principal interval**. For example:

$$
\arcsin(\sin(5\pi/6))=\arcsin(1/2)=\pi/6.
$$

Do not cancel the symbols before checking the interval. Similarly, $\arccos(\cos(-\pi/3))=\pi/3$ and $\arctan(\tan(3\pi/4))=-\pi/4$.

## One inverse value versus all solutions

Let $\alpha=\arcsin a$ with $|a|\le1$. All solutions of $\sin\theta=a$ are

$$
\theta=\alpha+2k\pi\quad\text{or}\quad\theta=\pi-\alpha+2k\pi,\qquad k\in\mathbb Z.
$$

For $\cos\theta=a$, use $\theta=\pm\arccos a+2k\pi$. For $\tan\theta=a$, use $\theta=\arctan a+k\pi$. If the problem gives an interval, keep only solutions in it and remove duplicates at endpoint values.

## Compose without a calculator

Set $\theta=\arcsin x$. Since $\theta\in[-\pi/2,\pi/2]$, cosine is nonnegative there. From $\sin^2\theta+\cos^2\theta=1$:

$$
\cos(\arcsin x)=\sqrt{1-x^2},\qquad -1\le x\le1.
$$

The positive root follows from the principal interval, not from a rule that square roots in trigonometry are always positive. Likewise, $\sin(\arctan x)=x/\sqrt{1+x^2}$, whose sign follows $x$.
