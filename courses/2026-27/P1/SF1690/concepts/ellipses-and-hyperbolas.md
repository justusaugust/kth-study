---
id: 'concept:sf1690:ellipses-and-hyperbolas'
courseId: 'course:sf1690'
slug: ellipses-and-hyperbolas
title: Ellipses and hyperbolas
summary: >-
  Ellipses and hyperbolas are quadratic loci distinguished by a plus or minus
  sign and by constant sums or differences of distances to two foci.
centralInsight: >-
  An ellipse is a scaled circle: $x^2/a^2+y^2/b^2=1$ records separate
  horizontal and vertical scales, while its two-focus distance sum remains $2a$.
commonMistake: >-
  Calling every oval an ellipse without checking its equation, mixing full axis
  lengths $2a,2b$ with semiaxes $a,b$, or using $c^2=a^2+b^2$ for an ellipse.
verifyPrompt: >-
  For $x^2/25+y^2/9=1$, identify the vertices, foci, major-axis length, and the
  constant sum of distances to the foci.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-26-02'
evidenceStatus: lecture
sourceIds:
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: requires
    from: 'concept:sf1690:ellipses-and-hyperbolas'
    to: 'concept:sf1690:cartesian-distance-circles'
  - type: appears_in
    from: 'concept:sf1690:ellipses-and-hyperbolas'
    to: 'lecture:sf1690:2026-08-26-02'
---
## The standard ellipse

For $a,b>0$,

$$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$$

is an ellipse centred at the origin. It meets the axes at $(\pm a,0)$ and $(0,\pm b)$. If $a>b$, its major axis is horizontal with length $2a$ and its minor axis has length $2b$. If $a=b$, the ellipse is a circle.

When $a\ge b$, define $c$ by

$$c^2=a^2-b^2.$$

The foci are $F_1=(-c,0)$ and $F_2=(c,0)$. Every point $P$ on the ellipse satisfies

$$d(P,F_1)+d(P,F_2)=2a.$$

This is the geometric meaning of the ellipse: the total distance to the two foci is fixed.

## Hyperbola contrast

Changing the sum of squared terms to a difference gives

$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=1.$$

This hyperbola has two branches, vertices $(\pm a,0)$, and asymptotes

$$y=\pm\frac ba x.$$

Its focal property uses a constant **difference** of distances.
