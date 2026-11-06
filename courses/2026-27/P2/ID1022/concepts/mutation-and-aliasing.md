---
{
  "id": "concept:id1022:mutation-and-aliasing",
  "courseId": "course:id1022",
  "slug": "mutation-and-aliasing",
  "title": "Mutation, identity and shared state",
  "summary": "Separate rebinding a name from changing an object that several names can reference.",
  "centralInsight": "An update through one reference can be visible through every alias of the same mutable object.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-04-05"
  ],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": []
}
---

## Compare two kinds of update

A binding associates a name with a value. Rebinding changes which value a name denotes. Mutation changes an existing object's contents. Which operations are permitted depends on the language and the kind of value.

This is a general primer for the published lecture topic, not a transcript or a verified guide to Pyking's mutation syntax. Use the current lecture slides for exact declarations and operators.

## Trace aliases

Suppose two references, `a` and `b`, point to the same mutable box containing 3. Updating that box to contain 8 makes both references observe 8. Creating a distinct box for `b` instead would allow the two boxes to change independently.

For every step, draw the names and the objects separately. If two arrows end at the same object, they are aliases. Merely using two names does not create two copies.

## Order now matters

Reading before an update can return a different result from reading after it. In an independent example, a counter starts at 5, is read, increased by 2, then read again: the two reads yield 5 and 7. Reversing the read and update changes the first observed result.

A function that updates shared state has an effect beyond its returned value. Document that effect and trace it at each call. The [functions and effects guide](/courses/id1022/concepts/functions-and-effects) explains this distinction.

## Keep the invariant visible

A loop invariant describes what is true at each entry. With explicit immutable state, the next state is supplied by the transition. With mutation, inspect each update and verify that the same invariant still holds. An accidentally shared accumulator can make a locally sensible function affect another part of the program.

Review [immutable loop state](/courses/id1022/concepts/immutable-loops-and-state), then compare the two approaches in the official examples. Do not assume that copying a reference copies the object it points to.
