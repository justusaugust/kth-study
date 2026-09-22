---
id: 'question:ii1308:tuple-and-list-change'
courseId: 'course:ii1308'
slug: tuple-and-list-change
title: 'Trace a mutable list inside a tuple'
conceptIds:
  - 'concept:ii1308:lists-tuples-and-slices'
hints:
  - 'append changes the list already stored in the second tuple slot.'
  - 'With step -2, start at the final index and move left by two positions; the stop index 0 is excluded.'
answer: 'record is ("samples", [3, 6, 9, 12, 15]) and picked is [15, 9]. The slice visits indices 4 and 2, excluding 0. The tuple keeps the same element references; append mutates the referenced list. Replacing record[1] itself would be forbidden.'
sourceIds:
  - 'source:ii1308:module-b-lists-tuples'
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---
Predict `record` and `picked`. Why does the mutation work even though the outer container is a tuple?

```python
record = ("samples", [3, 6, 9, 12])
record[1].append(15)
picked = record[1][-1:0:-2]
```
