---
id: 'concept:sf1690:lines-and-slopes'
courseId: 'course:sf1690'
slug: lines-and-slopes
title: Lines and slope
summary: >-
  Two distinct points determine a line; its slope measures signed vertical
  change per unit horizontal change.
centralInsight: >-
  Slope is a ratio of signed changes, so its sign records whether a line rises
  or falls from left to right.
commonMistake: >-
  Using absolute coordinate distances in the slope formula, changing the point
  order in only one difference, or trying to assign a finite slope to a vertical
  line.
verifyPrompt: >-
  Compute a slope twice using the opposite point order and explain why the
  result is unchanged.
outcomeIds:
  - 'outcome:sf1690:solve-and-present'
  - 'outcome:sf1690:read-mathematics'
lectureIds:
  - 'lecture:sf1690:2026-08-24-01'
  - 'lecture:sf1690:2026-08-26-02'
evidenceStatus: lecture
sourceIds:
  - 'source:sf1690:canvas-course-plan-26'
  - 'source:sf1690:lecture-1-board-photos'
  - 'source:sf1690:lecture-2-board-photos'
  - 'source:sf1690:adams-essex-calculus'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: requires
    from: 'concept:sf1690:lines-and-slopes'
    to: 'concept:sf1690:cartesian-distance-circles'
  - type: appears_in
    from: 'concept:sf1690:lines-and-slopes'
    to: 'lecture:sf1690:2026-08-24-01'
  - type: appears_in
    from: 'concept:sf1690:lines-and-slopes'
    to: 'lecture:sf1690:2026-08-26-02'
  - type: continues_to
    from: 'concept:sf1690:lines-and-slopes'
    to: 'concept:sf1690:quadratic-functions'
---
## A line through two points

Two distinct points $P_1=(x_1,y_1)$ and $P_2=(x_2,y_2)$ determine a unique line. Use **signed increments**

$$\Delta x=x_2-x_1,\qquad\Delta y=y_2-y_1.$$

If $x_1\ne x_2$, the slope is

$$m=\frac{\Delta y}{\Delta x}=\frac{y_2-y_1}{x_2-x_1}.$$

Changing the order of the points negates both numerator and denominator, so the ratio stays the same. A positive slope rises from left to right; a negative slope falls.

## Equations of lines

A non-vertical line can be written in slope-intercept form $y=mx+b$. Through a known point $(x_1,y_1)$ it can also be written in point-slope form

$$y-y_1=m(x-x_1).$$

A vertical line has equation $x=c$ and undefined slope because $\Delta x=0$. Two non-vertical lines are parallel exactly when they have the same slope.

## General form and intercepts

Every line can be written

$$Ax+By=C,$$

where $A$ and $B$ are not both zero. This form includes vertical lines ($B=0$), horizontal lines ($A=0$), and lines through the origin ($C=0$).

To find an intercept, restrict the line to the relevant axis:

- set $y=0$ for the $x$-intercept;
- set $x=0$ for the $y$-intercept.

For $4x+6y=15$, the intercept points are $(15/4,0)$ and $(0,5/2)$.
