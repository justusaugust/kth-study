---
id: 'example:ii1308:string-slice'
courseId: 'course:ii1308'
slug: string-slice
title: 'Index and slice a character string'
conceptIds:
  - 'concept:ii1308:characters-and-strings'
sourceIds:
  - 'source:ii1308:characters-and-text'
lastChecked: '2026-08-26'
confidence: verified
relationships:
  - type: supports
    from: 'example:ii1308:string-slice'
    to: 'concept:ii1308:characters-and-strings'
---
For `text = "FOOBAR"`, the characters have indices `0` through `5`.

```python
text[2]    # "O"
text[1:3]  # "OO"
len(text)  # 6
```

The slice starts at index `1` and stops before index `3`, so it includes positions `1` and `2`.
