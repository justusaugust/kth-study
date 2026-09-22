---
id: 'example:ii1308:count-input-lines'
courseId: 'course:ii1308'
slug: count-input-lines
title: Count records without loading the whole stream
conceptIds: ['concept:ii1308:text-files-and-standard-streams']
sourceIds: ['source:ii1308:python-standard-io-2026']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

This original example counts every line, including blank lines:

```python
import sys

count = 0
for line in sys.stdin:
    count += 1
print(count)
```

For the input text `red\\n\\nblue`, the output is `3`. The blank middle line counts, and the final line counts without a trailing newline. Empty input produces `0`. Only one line needs to be retained at a time.
