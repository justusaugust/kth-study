---
id: 'example:ii1308:adjacent-reading-changes'
courseId: 'course:ii1308'
slug: adjacent-reading-changes
title: 'Measure changes between neighbouring readings'
conceptIds: ['concept:ii1308:sequence-processing']
sourceIds: ['source:ii1308:python-working-with-sequences']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

Suppose a sensor produces four readings. Compare each reading with the one immediately before it.

```python
readings = [12, 15, 11, 16]
changes = [after - before for before, after in zip(readings, readings[1:])]
mean = sum(readings) / len(readings)
largest_change = max(changes, key=abs)

assert changes == [3, -4, 5]
assert mean == 13.5
assert largest_change == 5
assert list(zip(readings, readings[1:])) == [(12, 15), (15, 11), (11, 16)]
```

Four readings create three gaps. The sign records direction, while `key=abs` compares magnitudes and returns the original signed change. These readings are known to be non-empty and contain at least two values. With one reading, its mean exists but no adjacent change exists; with no readings, neither calculation is defined by this example.
