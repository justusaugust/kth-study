---
{
  "id": "concept:id1022:input-and-branching",
  "courseId": "course:id1022",
  "slug": "input-and-branching",
  "title": "Line input and independent decisions",
  "summary": "Trace input, branch priority and separate checks without losing edge cases.",
  "centralInsight": "An else-if chain chooses one branch; a second if starts a separate decision.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:id1022:proggame-control-flow"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

## Read exactly what the input supplies

`io.read_line()` reads one line without its trailing newline. When the supplied input is exhausted it returns an empty string. An empty string is still a value: two exhausted reads compare equal. Do not assume that a line exists just because the program asks for it.

```text
import io
label = io.read_line()
print("Label:", label)
```

Use `string(value)` when building a string from a value of another type. Keep reading, conversion and decision-making separate so a failed conversion is easy to locate.

## Decide whether checks compete

An `if` / `else if` / `else` chain takes the first true branch. Later branches are skipped even if their conditions are also true. Pyking spells this `else if`, not `elif`.

Two separate `if` statements are different: both can produce output. Before coding a rule, decide whether it selects one result or adds another result independently. Parentheses can make grouped `and` conditions easier to read. Use `==` for equality and `!=` for inequality.

For a new example, suppose a message should receive exactly one category, but an empty-input warning is independent. Put the competing categories in one chain and the warning in its own check. An unconditional warning in the chain's final `else` would miss some cases.

## Bindings and scope

A name is bound to a value. A new binding can shadow an earlier name; it does not rewrite the earlier value. A binding introduced inside a block is visible there, while the enclosing binding remains available after the block. Read [values, types and scope](/courses/id1022/concepts/immutable-values-and-functions) before tracing nested branches.

Use four spaces for indentation in these Pyking examples. A tab that looks like four spaces can still be rejected by the editor.

## Test the boundaries

Predict output for empty input, equal lines, unequal lines and overlapping conditions. For substring checks, `text.contains(message, "cat")` also matches `concatenate`; it is not a whole-word test. Test that behavior deliberately rather than treating every match as a separate command.
