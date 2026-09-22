---
id: 'question:ii1308:return-or-display'
courseId: 'course:ii1308'
slug: return-or-display
title: 'Separate displayed output from a returned value'
conceptIds:
  - 'concept:ii1308:functions-and-return-values'
hints:
  - 'First evaluate the argument to print, then inspect whether the function has a return statement.'
  - 'A function that reaches its end without returning a value returns None.'
answer: 'The call displays 12, but saved is None. Replace print(number * 3) with return number * 3 to make saved equal 12 without printing inside the function.'
sourceIds:
  - 'source:ii1308:module-b-functions'
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---
What does this call display, and what value does `saved` hold? Change one statement so the caller receives the computed number without the function displaying it.

```python
def triple(number):
    print(number * 3)

saved = triple(4)
```
