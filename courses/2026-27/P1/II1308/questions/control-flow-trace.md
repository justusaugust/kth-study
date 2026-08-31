---
id: 'question:ii1308:control-flow-trace'
courseId: 'course:ii1308'
slug: control-flow-trace
title: 'Trace a branch inside a loop'
conceptIds:
  - 'concept:ii1308:sequence-selection-iteration'
answer: >-
  The loop supplies 0, 1, and 2 because range excludes 3. Only 0 and 2 satisfy
  the even-number test, so the program prints 0 and 2.
sourceIds:
  - 'source:ii1308:python-control'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: assesses
    from: 'question:ii1308:control-flow-trace'
    to: 'concept:ii1308:sequence-selection-iteration'
---
What does this practice program print, and which line performs selection?

```python
for number in range(3):
    if number % 2 == 0:
        print(number)
```
