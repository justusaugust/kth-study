---
id: 'concept:ii1308:functions-and-return-values'
courseId: 'course:ii1308'
slug: functions-and-return-values
title: 'Functions and return values'
summary: 'Define reusable operations with parameters, local variables and return values; distinguish computing a result from displaying it.'
centralInsight: 'A return value becomes the value of the function call; printed text does not.'
commonMistake: 'Assigning the result of a function that only prints, then expecting the printed value instead of None.'
verifyPrompt: 'Trace a call from arguments to parameters to return value, and identify what would change if return became print.'
outcomeIds:
  - 'outcome:ii1308:programming-concepts'
  - 'outcome:ii1308:simple-programs'
lectureIds: ['lecture:ii1308:2026-09-15-reconstructed']
evidenceStatus: curriculum
sourceIds:
  - 'source:ii1308:module-b-functions'
lastChecked: '2026-09-21'
confidence: supported
relationships:
  - type: requires
    from: 'concept:ii1308:functions-and-return-values'
    to: 'concept:ii1308:variables-values-and-types'
---
## Define once, call with different inputs

`def` defines a function; its body runs when the function is called. Parameters name the inputs inside the function. Arguments supply their values at a call.

```python
def minutes_to_seconds(minutes):
    seconds = minutes * 60
    return seconds

duration = minutes_to_seconds(4)
assert duration == 240
```

Here `minutes` receives `4`. Both `minutes` and `seconds` are local names belonging to that call; they do not create names in the caller. `return` ends the call and hands its value back, so `duration` becomes `240`.

## Returning and printing do different jobs

`print` displays text. It returns `None`. A function that reaches the end without a `return` also returns `None`; a bare `return` does the same. Displayed text is therefore not a result another calculation can use.

```python
def show_seconds(minutes):
    print(minutes * 60)

result = show_seconds(4)  # displays 240
assert result is None
```

Separate calculation from presentation: let a small function return the value, then print it where the program handles output. That makes the same calculation usable in another function, a test or an expression.

## Reuse methods and modules

A method is called through an object, such as `"  hello  ".strip()`. A module groups reusable functionality: after `import math`, `math.sqrt(81)` returns `9.0`. After `import random`, `random.randint(1, 6)` chooses an integer from 1 through 6, including both endpoints; do not expect a particular result on every call.

Break a larger task into functions with clear inputs and one useful result each. Trace the returned values between the calls, rather than relying on printed output or accidental shared variables.
