---
id: 'concept:ii1308:sets-and-dictionaries'
courseId: 'course:ii1308'
slug: sets-and-dictionaries
title: 'Sets and dictionaries'
summary: 'Use sets for distinct members and dictionaries for values addressed by keys.'
outcomeIds: ['outcome:ii1308:programming-concepts', 'outcome:ii1308:simple-programs']
lectureIds: ['lecture:ii1308:2026-09-15-reconstructed']
evidenceStatus: curriculum
sourceIds: ['source:ii1308:python-sets-and-dictionaries']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

## A set answers membership questions

A set contains distinct, hashable elements with no positional order. Repeated values collapse into one member; indexing such as `tags[0]` is not available. Use `set()` for an empty set: `{}` creates an empty dictionary.

```python
left = {"blue", "green", "blue"}
right = {"green", "red"}
assert left == {"blue", "green"}
assert left & right == {"green"}
assert left | right == {"blue", "green", "red"}
assert left - right == {"blue"}
assert left ^ right == {"blue", "red"}
assert {n * n for n in [-2, -1, 1, 2]} == {1, 4}
```

Intersection keeps shared members; union keeps all members; difference removes the right-hand members from the left; symmetric difference keeps members in exactly one set. Difference is directional. Predict membership, not the order in which a printed set displays its elements.

## A dictionary answers a lookup question

A dictionary maps unique keys to values. Assigning an existing key replaces its value; it does not append another entry with that key.

```python
rooms = {"lab": "E2", "study": "Q15"}
rooms["lab"] = "E3"
assert rooms["lab"] == "E3"
assert "lab" in rooms
assert "E3" not in rooms
assert "E3" in rooms.values()
assert list(rooms) == ["lab", "study"]
assert list(rooms.items()) == [("lab", "E3"), ("study", "Q15")]
```

Iteration and `in` operate on keys unless you explicitly use `.values()` or `.items()`. Direct lookup of a missing key raises `KeyError`; `rooms.get("meeting")` instead returns `None` by default.

Modern Python dictionaries preserve insertion order, not sorted order. Replacing an existing value keeps that key in its position. This corrects the older slide description of dictionaries as unordered; sets still do not provide an insertion-order contract.

## Keys and values have different constraints

Keys must be hashable: strings, numbers and tuples containing only hashable elements are common choices. Lists, dictionaries and ordinary sets cannot be keys. A tuple containing a list is not hashable either. Set members follow the same hashability rule.

Values can hold nested structures:

```python
plan = {"lab": {"room": "E2", "equipment": ["gates", "wires"]}}
assert plan["lab"]["equipment"][1] == "wires"
```

Choose a set when only distinct membership matters, a dictionary when a key should retrieve a value, and a list when position or repeated entries matter.
