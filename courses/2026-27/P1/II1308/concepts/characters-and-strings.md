---
id: 'concept:ii1308:characters-and-strings'
courseId: 'course:ii1308'
slug: characters-and-strings
title: 'Characters and strings'
summary: >-
  Computers identify characters by numeric codes and represent text as ordered
  strings whose elements can be indexed, sliced, joined, and counted.
centralInsight: >-
  A character's code identifies the symbol; a font controls only how that same
  symbol is drawn.
commonMistake: >-
  Confusing a character's Unicode code with its appearance, or forgetting that
  Python indices start at zero and a slice excludes its stop index.
verifyPrompt: >-
  Predict three string indexing or slicing expressions before running them and
  explain why the stop position is excluded.
outcomeIds:
  - 'outcome:ii1308:programming-concepts'
  - 'outcome:ii1308:simple-programs'
lectureIds:
  - 'lecture:ii1308:2026-08-25-01'
evidenceStatus: lecture
sourceIds:
  - 'source:ii1308:characters-and-text'
  - 'source:ii1308:python-variables'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: appears_in
    from: 'concept:ii1308:characters-and-strings'
    to: 'lecture:ii1308:2026-08-25-01'
  - type: requires
    from: 'concept:ii1308:characters-and-strings'
    to: 'concept:ii1308:variables-values-and-types'
---
## Character code versus appearance

A computer records a character with an integer code. Unicode code point 65, for example, identifies uppercase `A`. Typeface, weight, size, and font determine how that character is rendered; they do not change its identity.

## A string is an ordered sequence

Text containing several characters is represented as a string. Every position stores one character, so sequence operations apply:

```python
word = "FOOBAR"
len(word)      # 6
word[0]        # "F"
word[1:3]      # "OO"
word + "!"     # "FOOBAR!"
```

Python starts indexing at zero. A slice `text[start:stop]` includes `start` but excludes `stop`, mirroring the behaviour of `range`.

## Strings participate in control flow

Because a string is a sequence, a `for` loop can visit one character at a time. The expression `piece in text` tests whether one string occurs inside another. The same selection and iteration rules used for other sequences therefore apply to characters.
