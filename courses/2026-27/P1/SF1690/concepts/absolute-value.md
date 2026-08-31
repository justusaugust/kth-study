---
id: 'concept:sf1690:absolute-value'
courseId: 'course:sf1690'
slug: absolute-value
title: Absolute value
summary: >-
  Absolute value is distance on the real line, turning equations and
  inequalities into statements about how far a point lies from a centre.
centralInsight: Read $|x-a|$ as the distance from $x$ to $a$ before doing algebra.
commonMistake: >-
  Writing only one branch for $|u|=D$, or using $-D<u<D$ when the inequality
  asks for points outside the interval.
verifyPrompt: >-
  Translate an absolute-value equation and an absolute-value inequality into
  distance language before solving them.
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
  - type: requires
    from: 'concept:sf1690:absolute-value'
    to: 'concept:sf1690:real-numbers-and-lines'
  - type: appears_in
    from: 'concept:sf1690:absolute-value'
    to: 'lecture:sf1690:2026-08-24-01'
  - type: continues_to
    from: 'concept:sf1690:absolute-value'
    to: 'concept:sf1690:cartesian-distance-circles'
---
## Definition

$$|x|=\begin{cases}x,&x\ge0,\\-x,&x<0.\end{cases}$$

Thus $|x|\ge0$ for every real $x$. Geometrically, $|x|$ is the distance from $x$ to zero, while $|x-y|$ is the distance between $x$ and $y$.

## Core properties

For $a,b\in\mathbb R$:

- $|a|=|-a|$.
- $|ab|=|a|\,|b|$.
- $|a\pm b|\le|a|+|b|$ (the triangle inequality).

## Equations and inequalities

For $D>0$:

- $|x|=D\iff x=-D$ or $x=D$.
- $|x|<D\iff-D<x<D$.
- $|x|\le D\iff-D\le x\le D$.
- $|x|>D\iff x<-D$ or $x>D$.
- $|x|\ge D\iff x\le-D$ or $x\ge D$.

The same patterns apply to $|u(x)|$: first identify whether the condition describes points inside a distance band or outside it, then solve the resulting branches.
