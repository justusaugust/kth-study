---
id: 'concept:sf1690:vector-lines-and-planes'
courseId: 'course:sf1690'
slug: vector-lines-and-planes
centralInsight: "The dimension comes from the number of independent directions, not the number of parameter symbols."
title: Vector equations of lines and planes
summary: A base point fixes position while independent direction vectors determine which points a parameterization can reach; a normal expresses the same plane as one constraint.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-30-14']
evidenceStatus: lecture
sourceIds: ['source:sf1690:lecture-14-notes']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## One point and one nonzero direction give a line

A line through $P_0$ with direction $\mathbf v\ne\mathbf0$ is

$$
P=P_0+t\mathbf v,\qquad t\in\mathbb R.
$$

The parameter is one shared number for every coordinate. For $P_0=(1,-2,3)$ and $\mathbf v=(2,0,-1)$, this means $x=1+2t$, $y=-2$, $z=3-t$. A zero direction component simply leaves that coordinate fixed; it is not a reason to divide by zero.

For two distinct points $A,B$, choose $\mathbf v=B-A$. Letting $t$ range over all real numbers gives the full line. Restricting $0\leq t\leq1$ gives the segment from $A$ to $B$. At $t=0$ you get $A$, at $t=1$ you get $B$, and at $t=1/2$ you get their midpoint.

Different base points and nonzero multiples of the direction can describe the same line. A candidate point lies on it only if the same parameter satisfies all coordinates.

## A plane can be specified by a normal

A normal vector $\mathbf n=(a,b,c)\ne\mathbf0$ is perpendicular to every displacement within the plane. Through $P_0=(x_0,y_0,z_0)$, the equation is

$$
\mathbf n\cdot(P-P_0)=0,
\qquad
a(x-x_0)+b(y-y_0)+c(z-z_0)=0.
$$

Expanding gives $ax+by+cz=d$, where $d=ax_0+by_0+cz_0$. Check the constant by substituting $P_0$ into the result. Multiplying the whole equation by a nonzero scalar preserves the plane.

The normal must not be zero. The equation $0=0$ describes the whole space, while $0=1$ has no solutions. Also keep the ambient dimension in mind: one nontrivial linear equation defines a line in $\mathbb R^2$, but a plane in $\mathbb R^3$.

## Two independent directions sweep out a plane

Given a base point and two nonzero, nonparallel vectors,

$$
P=P_0+s\mathbf u+t\mathbf v,\qquad s,t\in\mathbb R
$$

describes a plane. Each parameter moves independently along one direction. Parallel direction vectors only sweep out a line; writing two parameters does not by itself guarantee a plane.

For three noncollinear points $A,B,C$, use $\mathbf u=B-A$ and $\mathbf v=C-A$. Noncollinearity is exactly what prevents those directions from being dependent.

To convert a scalar equation to parameters, choose two free coordinates and solve for a coordinate whose coefficient is nonzero. For $2x-y+z=4$, choose $x=s,y=t$, giving $z=4-2s+t$. Hence

$$
P=(0,0,4)+s(1,0,-2)+t(0,1,1).
$$

Both direction vectors have dot product zero with $(2,-1,1)$, which checks that they lie along the plane.

## The parameter description also works in higher dimensions

The expressions $P_0+t\mathbf v$ and $P_0+s\mathbf u+t\mathbf v$ still describe a line and a two-dimensional plane in $\mathbb R^n$, provided their direction vectors are independent as required. A single normal equation in $\mathbb R^n$ instead describes an $(n-1)$-dimensional hyperplane. In $\mathbb R^4$, one normal equation therefore does not specify a two-dimensional plane.
