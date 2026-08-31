---
id: 'concept:ii1308:sequence-selection-iteration'
courseId: 'course:ii1308'
slug: sequence-selection-iteration
title: 'Sequence, selection, and iteration'
summary: >-
  Programs combine instructions in order, choose among paths, and repeat work;
  these three control patterns explain most small algorithms.
centralInsight: >-
  Control flow answers one question at every moment: which instruction runs
  next?
commonMistake: >-
  Reading an if-statement as a loop, forgetting that Python indentation defines
  the controlled block, or assuming range includes its stop value.
verifyPrompt: >-
  Trace a short program line by line and label every transition as sequence,
  selection, or iteration.
outcomeIds:
  - 'outcome:ii1308:programming-concepts'
  - 'outcome:ii1308:simple-programs'
lectureIds:
  - 'lecture:ii1308:2026-08-25-01'
evidenceStatus: lecture
sourceIds:
  - 'source:ii1308:concepts-of-computation'
  - 'source:ii1308:python-control'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: appears_in
    from: 'concept:ii1308:sequence-selection-iteration'
    to: 'lecture:ii1308:2026-08-25-01'
  - type: continues_to
    from: 'concept:ii1308:sequence-selection-iteration'
    to: 'concept:ii1308:variables-values-and-types'
---
## The three shapes of control

**Sequence** executes instructions in order. Each completed step hands control to the next one.

**Selection** evaluates a condition and chooses which block should run. Python expresses this with `if`, optionally followed by `elif` and `else`.

**Iteration** repeats a block. A `while` loop continues while its condition is true; a `for` loop takes one element at a time from a sequence.

## Python makes the controlled block visible

```python
if temperature < 0:
    state = "ice"
else:
    state = "water"
```

The colon begins a block and indentation shows which statements belong to it. The two assignments are alternatives: only one executes.

## Iteration over a sequence

```python
for character in "KTH":
    print(character)
```

The string supplies three elements, so the loop body runs three times. `range(start, stop, step)` supplies integer sequences; the `stop` value is not included.

## Reusable subsequences

A function packages a named sequence of instructions so another instruction can call it. This adds reuse without introducing a new control-flow primitive: execution moves into the function and later returns to the caller.
