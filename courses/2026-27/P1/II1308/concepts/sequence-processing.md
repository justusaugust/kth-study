---
id: 'concept:ii1308:sequence-processing'
courseId: 'course:ii1308'
slug: sequence-processing
title: 'Processing sequences'
summary: 'Aggregate values, select by a comparison key, and pair neighbouring elements with zip.'
outcomeIds: ['outcome:ii1308:programming-concepts', 'outcome:ii1308:simple-programs']
lectureIds: ['lecture:ii1308:2026-09-15-reconstructed']
evidenceStatus: curriculum
sourceIds: ['source:ii1308:python-working-with-sequences']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

## Reduce several values to one result

`len` counts elements, `sum` adds numeric values, and `min` and `max` select by comparison. For a non-empty numeric sequence, the arithmetic mean is `sum(values) / len(values)`.

```python
values = [4, 8, 6]
assert len(values) == 3
assert min(values) == 4
assert max(values) == 8
assert sum(values) == 18
assert sum(values) / len(values) == 6
```

The operation determines which inputs make sense. `sum([])` is zero, but `min([])` and `max([])` raise `ValueError` without a default. Computing a mean of an empty list divides by zero. Decide how your problem represents missing measurements before calculating. Mixed strings and numbers generally cannot be ordered together or added with `sum`.

## Select the object, using a key

`max(words, key=len)` compares word lengths but returns a word, not a length. If several items share the largest key, the first encountered item wins.

```python
words = ["pear", "plum", "fig"]
assert max(words, key=len) == "pear"
assert max(words) == "plum"
```

Without `key=len`, strings compare lexicographically. A comparison key changes the selection criterion; it does not sort or mutate the input.

## Pair positions with zip

`zip(a, b)` pairs the first elements, then the second, and so on. By default it stops when the shorter input runs out. It produces an iterator; use `list(...)` when you need to inspect all pairs.

```python
assert list(zip(["a", "b", "c"], [10, 20])) == [("a", 10), ("b", 20)]
readings = [4, 8, 6]
assert list(zip(readings, readings[1:])) == [(4, 8), (8, 6)]
assert [after - before for before, after in zip(readings, readings[1:])] == [4, -2]
```

Slicing off the first element shifts the second sequence by one position. Pairing a sequence with that shifted copy gives its neighbours: a sequence of length three produces two pairs. Empty and one-element sequences produce no adjacent pairs. Default truncation is useful here, but can conceal mismatched lengths when every record needs a partner.
