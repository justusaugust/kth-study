---
id: 'example:ii1308:slice-and-transform'
courseId: 'course:ii1308'
slug: slice-and-transform
title: 'Select positions, then transform values'
conceptIds:
  - 'concept:ii1308:lists-tuples-and-slices'
sourceIds:
  - 'source:ii1308:module-b-lists-tuples'
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---
Take every other measurement from index 1, then retain values above 10 and double them.

```python
readings = [7, 12, 9, 16, 11, 20]
selected = readings[1:6:2]
scaled = [2 * reading for reading in selected if reading > 10]
assert selected == [12, 16, 20]
assert scaled == [24, 32, 40]
assert readings == [7, 12, 9, 16, 11, 20]
```

The slice chooses indices `1`, `3` and `5`; index `6` is excluded. The comprehension filters by value, then computes each output. Both operations create lists and leave the original unchanged.
