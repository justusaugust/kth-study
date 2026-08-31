---
id: 'example:sf1690:reverse-triangle-inequality'
courseId: 'course:sf1690'
slug: reverse-triangle-inequality
title: Prove the reverse triangle inequality on the real line
conceptIds:
  - 'concept:sf1690:absolute-value'
sourceIds: []
lastChecked: '2026-08-24'
confidence: supported
relationships:
  - type: supports
    from: 'example:sf1690:reverse-triangle-inequality'
    to: 'concept:sf1690:absolute-value'
---
We prove

$$
\boxed{|a-b|\ge \bigl||a|-|b|\bigr|}.
$$

Interpret $|a-b|$ as the distance between $a$ and $b$, while
$\bigl||a|-|b|\bigr|$ is the difference between their distances from zero.

### Case 1: $a$ and $b$ are on the same side of zero

If $a,b\ge0$, then $|a|=a$ and $|b|=b$. Hence

$$
\bigl||a|-|b|\bigr|=|a-b|.
$$

If $a,b\le0$, then $a=-|a|$ and $b=-|b|$, so

$$
|a-b|
=\bigl|-|a|+|b|\bigr|
=\bigl||a|-|b|\bigr|.
$$

Thus, whenever the two points lie on the same side of zero,

$$
|a-b|=\bigl||a|-|b|\bigr|.
$$

### Case 2: $a$ and $b$ are on opposite sides of zero

Now zero lies between the two points. The distance from $a$ to $b$ is therefore
the distance from $a$ to zero plus the distance from zero to $b$:

$$
|a-b|=|a|+|b|.
$$

Set $x=|a|$ and $y=|b|$. Both are non-negative. We need the elementary fact

$$
x+y\ge|x-y|.
$$

If $x\ge y$, then $|x-y|=x-y$, and

$$
x+y\ge x-y
$$

because this is equivalent to $2y\ge0$. If $y\ge x$, then
$|x-y|=y-x$, and

$$
x+y\ge y-x
$$

because this is equivalent to $2x\ge0$. Therefore

$$
|a|+|b|\ge\bigl||a|-|b|\bigr|.
$$

Since $|a-b|=|a|+|b|$ in this case, we obtain

$$
|a-b|\ge\bigl||a|-|b|\bigr|.
$$

The two cases prove the result. Geometrically: on the same side of zero, the
two quantities are equal; on opposite sides, the distance between the points
is the sum of their distances from zero, which is at least their difference.
