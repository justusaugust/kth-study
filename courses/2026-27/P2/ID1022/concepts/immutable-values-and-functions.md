---
{
  "id": "concept:id1022:immutable-values-and-functions",
  "courseId": "course:id1022",
  "slug": "immutable-values-and-functions",
  "title": "Values, types, and immutable bindings",
  "summary": "A new binding does not mutate an existing value.",
  "centralInsight": "Resolve a name in its lexical scope before deciding which value an expression uses.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-10-28-02"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-2-slides",
    "source:id1022:lecture-3-slides"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Treating Pyking shadowing as mutation of an outer binding.",
  "verifyPrompt": "Predict the visible binding and printed output before running a nested block."
}
---

## Expressions and statements

A literal writes a value directly: `12`, `2.5`, or `"hello"`. An expression combines operations and evaluates to a value. A type describes which kind of value it produces and which operations make sense. For `3 + 2 * 4`, multiplication happens first and the result is `11`.

A statement such as printing performs an action. A displayed value and a returned value play different roles. Immutability means an existing value is not changed in place. Creating a new list or introducing another binding is different from mutation.

## Lexical scope in Pyking

The lecture uses block-local shadowing. An inner binding can have the same name without replacing the outer binding:

```text
label = "outside"
if 2 > 0:
    label = "inside"
    print(label)
print(label)
```

This Pyking example prints `inside`, then `outside`. Python has different block-scope behavior; do not transfer its rules to Pyking. Indentation defines the block; use four spaces consistently.

## Trace before running

Write down the value and type of each expression, then list printed output in order. For each name, identify the binding visible at that line. A function can use immutable values and still have effects such as input or output.

## Branches and control flow

An `if` condition must be Boolean. Pyking uses `else if` for another condition and `else` for the fallback. Follow conditions from top to bottom; only the selected branch runs. Distinguish sequential statements after the conditional from statements inside its indented block.
