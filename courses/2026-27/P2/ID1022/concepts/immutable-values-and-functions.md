---
{
  "id": "concept:id1022:immutable-values-and-functions",
  "courseId": "course:id1022",
  "slug": "immutable-values-and-functions",
  "title": "Immutable values and functions",
  "summary": "Evaluate expressions and build new values instead of changing an existing value.",
  "centralInsight": "Creating a new value and rebinding a name are different from mutating an existing value.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-10-28-02"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-10-28",
  "confidence": "supported",
  "relationships": []
}
---

## Values, names, and evaluation

An expression evaluates to a value. A name lets you refer to that value; it is not the value itself. Immutability means that an existing value does not change after creation. A language may still allow a name to be rebound to a different value—rebinding and mutation are different operations.

In language-neutral notation, let `xs = [2, 4]` and define `ys` to be `xs` with `6` appended. An immutable append creates `[2, 4, 6]` for `ys`, while `xs` remains `[2, 4]`. This notation describes the idea, not a specific language's syntax.

## Functions and effects

A function maps arguments to a result. For a pure function, the same arguments give the same result, and evaluating it does not change outside state. Immutable data helps reasoning, but immutability alone does not make every function pure: reading the clock or printing output is still an effect.

For `double(n) = 2 × n`, evaluate `double(3 + 1)` by first computing the argument `4`, then the result `8`. Keep returned values separate from text displayed on screen.

## Check your understanding

If `original = [1, 2]` and an operation returns a new list `[1, 2, 3]`, what must remain unchanged? The original list. Before learning the game's syntax, explain that distinction in your own words.
