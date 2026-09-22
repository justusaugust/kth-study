---
id: 'example:ii1308:set-difference-and-lookup'
courseId: 'course:ii1308'
slug: set-difference-and-lookup
title: 'Find missing supplies and look up quantities'
conceptIds: ['concept:ii1308:sets-and-dictionaries']
sourceIds: ['source:ii1308:python-sets-and-dictionaries']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

This is original practice using an inventory, not a course exercise solution.

```python
needed = {"wire", "resistor", "switch"}
available = {"wire", "switch", "led"}
quantities = {"wire": 8, "switch": 2, "led": 5}

missing = needed - available
shared = needed & available
counts = {item: quantities[item] for item in sorted(shared)}

assert missing == {"resistor"}
assert counts == {"switch": 2, "wire": 8}
assert list(counts) == ["switch", "wire"]
```

The set difference finds what is absent; the dictionary answers how many of each available item exist. Sorting the shared names makes the dictionary insertion order deliberate. Without that sorting step, iterating the set would not give a promised display order. The lookup is safe here because every member of `available` has a quantity entry.
