---
id: 'question:ii1308:sequence-boundaries-and-ties'
courseId: 'course:ii1308'
slug: sequence-boundaries-and-ties
title: 'Check ties, empty inputs and truncated pairs'
conceptIds: ['concept:ii1308:sequence-processing']
sourceIds: ['source:ii1308:python-working-with-sequences']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
hints: ['A tied max returns the first encountered item; zip stops at the shorter input; an empty sum differs from an empty maximum.']
answer: 'The results are "oak", [(2, 20), (5, 50)], [], and 0. max([]) raises ValueError; sum([])/len([]) raises ZeroDivisionError. There is no neighbour pair for a single reading.'
---

Predict each result. Which of the final three expressions raises an exception?

```python
max(["oak", "elm", "fir"], key=len)
list(zip([2, 5, 9], [20, 50]))
list(zip([8], [8][1:]))
sum([])
max([])
sum([]) / len([])
```
