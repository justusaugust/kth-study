---
id: 'concept:ii1308:lists-tuples-and-slices'
courseId: 'course:ii1308'
slug: lists-tuples-and-slices
title: 'Lists, tuples and slices'
summary: 'Read and transform ordered collections with indexing, slicing and comprehensions, and recognise which operations mutate a list.'
centralInsight: 'A list can change its elements; a tuple fixes its element references, but an object inside it may still be mutable.'
commonMistake: 'Treating remove as an index operation, expecting sort to return a sorted list, or including the stop index of a slice.'
verifyPrompt: 'Predict a stepped slice and a list mutation, then explain why a tuple containing a list can still expose changing contents.'
outcomeIds:
  - 'outcome:ii1308:programming-concepts'
  - 'outcome:ii1308:simple-programs'
lectureIds: ['lecture:ii1308:2026-09-15-reconstructed']
evidenceStatus: curriculum
sourceIds:
  - 'source:ii1308:module-b-lists-tuples'
lastChecked: '2026-09-21'
confidence: supported
relationships:
  - type: requires
    from: 'concept:ii1308:lists-tuples-and-slices'
    to: 'concept:ii1308:characters-and-strings'
---
## Positions and membership

Lists and tuples are ordered sequences. Index `0` selects the first element; `-1` selects the last. `value in items` tests membership, not a position. An individual index outside the sequence raises `IndexError`.

## Mutate a list deliberately

`items.append(value)` adds one element at the end. `items.pop()` removes and returns the last element; `items.pop(index)` uses a position. `items.remove(value)` removes the first equal value and raises `ValueError` when none exists. `items.sort()` changes the list in place and returns `None`.

```python
items = [8, 3, 8]
items.append(5)
removed = items.pop(1)
items.remove(8)
result = items.sort()
assert removed == 3 and items == [5, 8] and result is None
```

## Slice with a direction and an excluded stop

`items[start:stop:step]` visits indices in the direction of `step`, starting at `start` and stopping before `stop`. With a positive step, omitted bounds cover the sequence from the beginning to the end. `items[::-1]` visits it backwards; a zero step is invalid. Slice bounds may extend past the sequence and are clipped.

```python
values = [10, 20, 30, 40, 50, 60]
assert values[1:6:2] == [20, 40, 60]
assert values[4:0:-2] == [50, 30]
assert values[::-1] == [60, 50, 40, 30, 20, 10]
assert list(range(10)[2:8:2]) == [2, 4, 6]
```

Slicing a list creates a new list, but nested objects are shared rather than deeply copied. Slicing a tuple produces a tuple; slicing a range produces another range.

## Build a list with a comprehension

Read `[expression for item in iterable if condition]` as: visit the iterable, keep items meeting the optional condition, then compute the output expression for each kept item.

```python
doubled = [2 * n for n in range(6) if n % 2 == 1]
assert doubled == [2, 6, 10]
```

## Tuples fix their slots

`point = (2, 7)` is a tuple. `x, y = point` unpacks its two elements; ordinary unpacking needs the matching number of targets. A singleton tuple needs a comma: `(2,)`, whereas `(2)` is just the integer `2`.

You cannot replace a tuple element with `point[0] = 9`. However, `record = ("readings", [2, 7])` contains a mutable list: `record[1].append(9)` is allowed. The tuple still refers to the same list; that list's contents changed.
