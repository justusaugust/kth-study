---
id: 'example:ie1204:binary-to-decimal'
courseId: 'course:ie1204'
slug: binary-to-decimal
title: 'Convert a binary word by place weights'
conceptIds:
  - 'concept:ie1204:positional-number-systems'
  - 'concept:ie1204:base-conversion-and-range'
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: verified
relationships:
  - type: supports
    from: 'example:ie1204:binary-to-decimal'
    to: 'concept:ie1204:base-conversion-and-range'
---
Convert $1011010_2$ into decimal by aligning every bit with its power of two:

$$
\begin{aligned}
1011010_2
&=1\cdot2^6+0\cdot2^5+1\cdot2^4+1\cdot2^3+0\cdot2^2+1\cdot2^1+0\cdot2^0\\
&=64+16+8+2\\
&=90_{10}.
\end{aligned}
$$

The zero bits still occupy positions; they simply contribute zero to the sum.
