---
{
  "id": "concept:id1022:recursion-and-data-structures",
  "courseId": "course:id1022",
  "slug": "recursion-and-data-structures",
  "title": "Recursion, higher-order functions, and structs",
  "summary": "Break a recursive problem into a base case and a smaller problem; pass functions as values and choose immutable or mutable records.",
  "centralInsight": "A recursive definition must explain both when to stop and why each recursive call gets closer to stopping.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-09-07"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-7-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## Read the calls in both directions

A base case returns without another recursive call. A recursive case reduces a measure such as a nonnegative integer or the length of a list. Reaching zero is not enough as a plan: a negative starting value with repeated subtraction never reaches it. State the input domain too.

For an original example, let a product function return 1 on the empty list and otherwise multiply the head by the recursive product of the tail. On [2, 3], the calls descend through [3] to []; returning gives 1, then 3, then 6. Each call has its own local frame. Trace the pending operation as well as the argument.

## Match structure, then rebuild

An empty-list case handles the end. A head-and-tail case binds the first element and a shorter remaining list. Constructing a new output list preserves the original input. Exhaustiveness checking helps catch a missing structural case; it does not prove termination.

## Functions as data

A lambda is an anonymous function. A higher-order function takes a function or returns one. Mapping transforms every element; filtering keeps elements satisfying a predicate. Mapping a squaring function over [2, 4] gives [4, 16] while the input stays [2, 4]. Passing a function differs from calling it and passing its result.

## Choose the record semantics

A tuple gives positional fields; a struct names them. An immutable update constructs a new record, possibly sharing unchanged data. A mutable struct updates the existing object, so aliases can observe the change. A new variable name alone does not copy a mutable object.

## Study route

Trace one empty-list case, one two-element list and one invalid numeric input. Then compare a mapped transformation with an explicit recursive definition. Revisit [aliasing](/courses/id1022/concepts/mutation-and-aliasing) before choosing mutable structs.
