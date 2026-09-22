---
id: 'concept:sf1690:vectors-and-components'
courseId: 'course:sf1690'
slug: vectors-and-components
title: Vectors, components, and displacement
summary: Describe displacement and direction with components, then calculate sums, scalar multiples, lengths and unit vectors.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-23-12']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

## A vector describes a change

A point tells you where something is. A vector describes a displacement: how far to move along each coordinate axis. In two dimensions write $\mathbf v=(v_1,v_2)$; in three dimensions write $\mathbf v=(v_1,v_2,v_3)$. The components are signed real numbers in a chosen coordinate system.

Two arrows represent the same vector when their displacements agree, even if they start at different points. Moving an arrow without rotating it or changing its length does not change its vector. Two vectors are equal exactly when every corresponding component agrees.

For points $A=(a_1,a_2,a_3)$ and $B=(b_1,b_2,b_3)$, the vector **from $A$ to $B$** is

$$
\overrightarrow{AB}=B-A=(b_1-a_1,b_2-a_2,b_3-a_3).
$$

Subtract the starting point from the ending point. Reversing the order reverses the arrow: $\overrightarrow{BA}=-\overrightarrow{AB}$. The position vector of $B$ is $\overrightarrow{OB}$ from the origin; it coincides numerically with $B$'s coordinates, but an arbitrary displacement to $B$ need not.

## Add displacements component by component

For vectors in the same dimension,

$$
\mathbf u+\mathbf v=(u_1+v_1,u_2+v_2,u_3+v_3),\qquad
\mathbf u-\mathbf v=(u_1-v_1,u_2-v_2,u_3-v_3).
$$

Geometrically, put the tail of $\mathbf v$ at the head of $\mathbf u$. The sum runs from the first tail to the final head. Thus $\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$: the intermediate point cancels.

Addition is commutative and associative. The zero vector $\mathbf0=(0,0,0)$ makes no change, and $\mathbf v+(-\mathbf v)=\mathbf0$. Do not add a two-component vector to a three-component vector unless the problem specifies how the two spaces are related.

The usual coordinate vectors are $\mathbf e_1=(1,0,0)$, $\mathbf e_2=(0,1,0)$ and $\mathbf e_3=(0,0,1)$. Writing $\mathbf v=v_1\mathbf e_1+v_2\mathbf e_2+v_3\mathbf e_3$ expresses its three independent coordinate displacements.

## A scalar changes size and possibly direction

For a real scalar $c$,

$$
c\mathbf v=(cv_1,cv_2,cv_3).
$$

A positive scalar preserves direction, a negative scalar reverses direction, and zero produces the zero vector. Multiplication distributes: $c(\mathbf u+\mathbf v)=c\mathbf u+c\mathbf v$ and $(c+d)\mathbf v=c\mathbf v+d\mathbf v$.

For nonzero vectors, $\mathbf u=c\mathbf v$ means they are parallel. Positive $c$ gives the same direction; negative $c$ gives opposite directions. Every component must use the **same** scalar. Avoid dividing components blindly: a zero component can make a ratio undefined. Instead choose a nonzero component to find a candidate scalar, then check all the others. The zero vector has no direction.

## Length from the Pythagorean theorem

The Euclidean length, or norm, is

$$
\|\mathbf v\|=\sqrt{v_1^2+v_2^2}\quad\text{in 2D},\qquad
\|\mathbf v\|=\sqrt{v_1^2+v_2^2+v_3^2}\quad\text{in 3D}.
$$

Length is a nonnegative scalar, not a vector. Only the zero vector has length zero. The distance between points is $\|B-A\|$, so reversing the displacement does not change the distance.

Scaling gives $\|c\mathbf v\|=|c|\|\mathbf v\|$. The absolute value matters for negative $c$: a reversed arrow still has positive length.

Lengths do not generally add. For $\mathbf u=(1,0)$ and $\mathbf v=(0,1)$, the sum has length $\sqrt2$, whereas the sum of their lengths is $2$. Add components first, then calculate the resulting length.

## Normalize only a nonzero vector

A unit vector has length $1$. Given $\mathbf v\ne\mathbf0$, the unit vector in its direction is

$$
\widehat{\mathbf v}=\frac{\mathbf v}{\|\mathbf v\|}.
$$

Divide every component by the same positive length. To obtain a vector of prescribed length $L>0$ in that direction, use $L\widehat{\mathbf v}$. Its opposite is $-L\widehat{\mathbf v}$.

The zero vector cannot be normalized: its length is zero and it has no direction to preserve. Squaring the unit vector's components and adding should give $1$, a useful check before moving on.

This lesson uses component arithmetic and the Pythagorean theorem. Dot products and orthogonality belong to the next planned lecture.
