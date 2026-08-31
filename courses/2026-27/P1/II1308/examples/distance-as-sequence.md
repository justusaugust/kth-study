---
id: 'example:ii1308:distance-as-sequence'
courseId: 'course:ii1308'
slug: distance-as-sequence
title: 'Compute a distance as an instruction sequence'
conceptIds:
  - 'concept:ii1308:sequence-selection-iteration'
  - 'concept:ii1308:variables-values-and-types'
sourceIds:
  - 'source:ii1308:concepts-of-computation'
lastChecked: '2026-08-26'
confidence: verified
relationships:
  - type: supports
    from: 'example:ii1308:distance-as-sequence'
    to: 'concept:ii1308:sequence-selection-iteration'
---
The distance between $(x_0,y_0)$ and $(x_1,y_1)$ can be decomposed into a sequence of smaller computations:

```python
xx = (x0 - x1) ** 2
yy = (y0 - y1) ** 2
distance = (xx + yy) ** 0.5
```

Each line depends on values established before it. The sequence exposes intermediate results, making the algorithm easier to inspect than one large expression.
