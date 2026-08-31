---
id: 'question:ii1308:rebinding-types'
courseId: 'course:ii1308'
slug: rebinding-types
title: 'Follow a name through three bindings'
conceptIds:
  - 'concept:ii1308:variables-values-and-types'
answer: >-
  After the final line, value refers to the string "5" and its type is str. The
  earlier integer and floating-point bindings have both been replaced.
sourceIds:
  - 'source:ii1308:python-variables'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: assesses
    from: 'question:ii1308:rebinding-types'
    to: 'concept:ii1308:variables-values-and-types'
---
After these lines execute, what value does `value` refer to and what is its data type?

```python
value = 5
value = 5.0
value = "5"
```
