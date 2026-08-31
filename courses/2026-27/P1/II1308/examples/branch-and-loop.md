---
id: 'example:ii1308:branch-and-loop'
courseId: 'course:ii1308'
slug: branch-and-loop
title: 'Trace selection inside iteration'
conceptIds:
  - 'concept:ii1308:sequence-selection-iteration'
  - 'concept:ii1308:characters-and-strings'
sourceIds:
  - 'source:ii1308:python-control'
  - 'source:ii1308:characters-and-text'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: supports
    from: 'example:ii1308:branch-and-loop'
    to: 'concept:ii1308:sequence-selection-iteration'
---
This loop visits every character but selects only non-space characters for output:

```python
text = "KTH IT"

for character in text:
    if character != " ":
        print(character, end="")
```

The `for` statement provides iteration. The nested `if` provides selection during each iteration. The output is `KTHIT`.
