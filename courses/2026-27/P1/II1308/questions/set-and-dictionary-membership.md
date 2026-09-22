---
id: 'question:ii1308:set-and-dictionary-membership'
courseId: 'course:ii1308'
slug: set-and-dictionary-membership
title: 'Distinguish members from keys'
conceptIds: ['concept:ii1308:sets-and-dictionaries']
sourceIds: ['source:ii1308:python-sets-and-dictionaries']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
hints: ['Sets discard duplicates; dictionary membership tests keys, and replacing a value preserves key order.']
answer: 'The results are 2, False, and ["b", "a"]. The container types are dict and set. The value 7 belongs to counts.values(), not to its keys. Updating b changes only its value and leaves its insertion position intact.'
---

Predict the three results and the two container types. Explain why replacing the value of `"b"` does not move that key.

```python
labels = {"b", "a", "b"}
counts = {"b": 2, "a": 1}
counts["b"] = 7
len(labels), 7 in counts, list(counts)
type({}), type(set())
```
