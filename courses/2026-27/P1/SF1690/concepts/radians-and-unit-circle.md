---
id: 'concept:sf1690:radians-and-unit-circle'
courseId: 'course:sf1690'
slug: radians-and-unit-circle
title: Radians and the unit circle
summary: An angle in radians measures arc length divided by radius; cosine and sine are the coordinates of its point on the unit circle.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-09-06']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-09'
confidence: supported
relationships: []
---

## Radians measure turns geometrically

For an arc of length $s$ on a circle of radius $r$, the angle is $\theta=s/r$ radians. One full circumference gives $2\pi$ radians, so $180^\circ=\pi$ radians. Multiply degrees by $\pi/180$ to convert to radians.

Positive angles turn counterclockwise from the positive horizontal axis. Negative angles turn clockwise. Adding a full turn reaches the same point.

## Coordinates define the functions

On the unit circle, $P=(\cos\theta,\sin\theta)$. This definition extends beyond acute angles: coordinates supply the signs in every quadrant.

| Angle | Radians | cos θ | sin θ |
| --- | --- | --- | --- |
| 0° | $0$ | $1$ | $0$ |
| 30° | $\pi/6$ | $\sqrt{3}/2$ | $1/2$ |
| 45° | $\pi/4$ | $\sqrt{2}/2$ | $\sqrt{2}/2$ |
| 60° | $\pi/3$ | $1/2$ | $\sqrt{3}/2$ |
| 90° | $\pi/2$ | $0$ | $1$ |

Use symmetry to get other quadrants. For example, $150^\circ$ has reference angle $30^\circ$, but its cosine is negative and sine positive.

## Tangent is a ratio, not another coordinate

$$\tan\theta=\frac{\sin\theta}{\cos\theta}.$$

It is undefined wherever $\cos\theta=0$, namely $\theta=\pi/2+k\pi$ for integer $k$. A zero denominator is not a very large valid output.

Since the point lies on the unit circle:

$$\cos^2\theta+\sin^2\theta=1.$$

The square means $(\sin\theta)^2$, not $\sin(\theta^2)$. When solving for sine or cosine from this identity, choose the square-root sign using the quadrant.
