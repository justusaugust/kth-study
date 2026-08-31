---
id: 'concept:sf1690:cartesian-distance-circles'
courseId: 'course:sf1690'
slug: cartesian-distance-circles
title: 'Cartesian coordinates, distance, and circles'
summary: >-
  Coordinates turn geometry into algebra: the Pythagorean theorem gives
  distance, and fixed-distance equations produce circles.
centralInsight: 'The expression $x^2+y^2$ is the squared distance from $(x,y)$ to the origin.'
commonMistake: >-
  Forgetting the square root in a distance, or confusing the circle $x^2+y^2=1$
  with its interior $x^2+y^2<1$.
verifyPrompt: >-
  Derive the distance formula from a right triangle, then explain the geometric
  meaning of $x^2+y^2<r^2$.
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
    from: 'concept:sf1690:cartesian-distance-circles'
    to: 'concept:sf1690:absolute-value'
  - type: appears_in
    from: 'concept:sf1690:cartesian-distance-circles'
    to: 'lecture:sf1690:2026-08-24-01'
  - type: appears_in
    from: 'concept:sf1690:cartesian-distance-circles'
    to: 'lecture:sf1690:2026-08-26-02'
  - type: continues_to
    from: 'concept:sf1690:cartesian-distance-circles'
    to: 'concept:sf1690:lines-and-slopes'
---
## Cartesian vocabulary

The Cartesian plane is $\mathbb R^2$. A point $P=(a,b)$ is an **ordered pair**: $a$ is its $x$-coordinate, $b$ is its $y$-coordinate, and $(0,0)$ is the origin. The axes divide the plane into four quadrants.

## Distance in $\mathbb R^2$

Let $P_1=(x_1,y_1)$ and $P_2=(x_2,y_2)$. Their horizontal and vertical separations are $|x_2-x_1|$ and $|y_2-y_1|$. These are perpendicular legs of a right triangle, so the Pythagorean theorem gives

$$d(P_1,P_2)^2=(x_2-x_1)^2+(y_2-y_1)^2,$$

and therefore

$$d(P_1,P_2)=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.$$

This is the proof: construct the axis-aligned right triangle between the two points and apply $a^2+b^2=c^2$.

## Graphs and circles

The **graph** of an equation or inequality is the set of all points satisfying it. Since

$$d((x,y),(0,0))=\sqrt{x^2+y^2},$$

the equation $x^2+y^2=1$ describes points at distance one from the origin: the unit circle. Likewise, $x^2+y^2<1$ is its interior and $x^2+y^2>1$ is its exterior. More generally, $(x-h)^2+(y-k)^2=r^2$ is the circle with centre $(h,k)$ and radius $r$.

## Completing the square

An expanded equation

$$x^2+y^2+ux+vy=w$$

can be returned to centre-radius form by completing one square in $x$ and one in $y$. For example,

$$x^2+y^2+2x-3y=3$$

becomes

$$\left(x+1\right)^2+\left(y-\frac32\right)^2=\frac{25}{4}.$$

The centre is therefore $(-1,3/2)$ and the radius is $5/2$.

## Disks and exteriors

The same squared-distance expression describes regions:

$$
\begin{array}{rl}
(x-h)^2+(y-k)^2<r^2 & \text{open disk},\\
(x-h)^2+(y-k)^2\le r^2 & \text{closed disk},\\
(x-h)^2+(y-k)^2>r^2 & \text{exterior}.
\end{array}
$$
