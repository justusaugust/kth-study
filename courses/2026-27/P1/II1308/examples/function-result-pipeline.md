---
id: 'example:ii1308:function-result-pipeline'
courseId: 'course:ii1308'
slug: function-result-pipeline
title: 'Use a returned value in another call'
conceptIds:
  - 'concept:ii1308:functions-and-return-values'
sourceIds:
  - 'source:ii1308:module-b-functions'
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---
A timer accepts minutes, but its display uses seconds. Keep the conversion separate from the label.

```python
def seconds_for(minutes):
    return minutes * 60

def timer_label(seconds):
    return str(seconds) + " seconds"

label = timer_label(seconds_for(3))
assert label == "180 seconds"
```

The inner call returns `180`. That value becomes the argument to `timer_label`, which returns a string. Neither call prints anything; the caller can choose to display `label` later. Replacing the first `return` with `print` would display `180` immediately but pass `None` to `timer_label`, producing the wrong label, `"None seconds"`.
