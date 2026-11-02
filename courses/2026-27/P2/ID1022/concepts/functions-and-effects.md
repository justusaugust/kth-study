---
{
  "id": "concept:id1022:functions-and-effects",
  "courseId": "course:id1022",
  "slug": "functions-and-effects",
  "title": "Functions, arguments, and results",
  "summary": "Separate what a function receives, what it returns, and what it displays or changes.",
  "centralInsight": "A returned value can feed another expression; printed output cannot substitute for that return value.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-02-04"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Using printed output as though it were a value returned to the caller.",
  "verifyPrompt": "Trace a nested call and identify its arguments, returned values, and effects."
}
---

## Give a function a contract

Describe its inputs, result, and assumptions first. In language-neutral notation, `double(n) = 2 × n` receives one number and returns another. `double(3 + 1)` first evaluates the argument to `4`, then returns `8`.

A parameter is the name in the definition; an argument is a value supplied at a call. Trace local bindings in their scope rather than assuming they replace names in the caller.

## Return versus print

Returning supplies a value to the caller, which can use it in another expression. Printing produces an effect. A function that only prints a number is not interchangeable with one that returns it.

A pure function gives the same result for the same inputs and has no outside effects. Reading input, accessing a clock, and writing output add effects even if data values are immutable.

## Compose and test

If `increment(n) = n + 1`, then `double(increment(3))` gives `8`, while `increment(double(3))` gives `7`. Evaluate the inner call first. Test a normal input and a boundary input, and identify inputs excluded by the contract. This notation describes behavior; use the course's actual function syntax when published.
