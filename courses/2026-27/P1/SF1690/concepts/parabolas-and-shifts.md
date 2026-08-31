---
id: 'concept:sf1690:parabolas-and-shifts'
courseId: 'course:sf1690'
slug: parabolas-and-shifts
title: Parabolas and graph shifts
summary: >-
  A parabola is a distance locus; completing the square exposes its vertex,
  direction, and relationship to a shifted standard graph.
centralInsight: >-
  Expanding the equality between distance to a focus and distance to a
  directrix gives $x^2=4py$.
commonMistake: >-
  Confusing the focus parameter $p$ with the coefficient in $y=ax^2$, or
  reversing the direction of the shift in expressions such as $(x-h)^2$.
verifyPrompt: >-
  Starting only from $d(P,F)=d(P,L)$, re-derive $x^2=4py$ and identify the
  focus and directrix of $y=x^2/8$.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-26-02'
evidenceStatus: lecture
sourceIds:
  - 'source:sf1690:lecture-2-board-photos'
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-26'
confidence: verified
relationships:
  - type: requires
    from: 'concept:sf1690:parabolas-and-shifts'
    to: 'concept:sf1690:cartesian-distance-circles'
  - type: appears_in
    from: 'concept:sf1690:parabolas-and-shifts'
    to: 'lecture:sf1690:2026-08-26-02'
  - type: continues_to
    from: 'concept:sf1690:parabolas-and-shifts'
    to: 'concept:sf1690:quadratic-functions'
---
## A parabola is a locus

Fix a point $F$ and a line $L$ that does not contain $F$. The parabola is the set of points $P$ for which

$$d(P,F)=d(P,L).$$

The point $F$ is the **focus**, $L$ is the **directrix**, and the point halfway between them is the **vertex**.

## Deriving the standard equation

Take $F=(0,p)$ and directrix $y=-p$. For $P=(x,y)$, the closest point on the directrix is $Q=(x,-p)$. Hence

$$\sqrt{x^2+(y-p)^2}=|y+p|.$$

Squaring and cancelling common terms gives

$$x^2=4py,\qquad y=\frac{x^2}{4p}.$$

The sign of $p$ determines whether the parabola opens upward or downward. Interchanging $x$ and $y$ gives $y^2=4px$, a sideways parabola.

## Shifts and vertex form

Replacing $x$ by $x-h$ shifts a graph horizontally by $h$; replacing $y$ by $y-k$ shifts it vertically by $k$. Completing the square rewrites

$$y=ax^2+bx+c$$

as

$$y-k=a(x-h)^2,$$

which exposes the vertex $(h,k)$ and the axis $x=h$.
