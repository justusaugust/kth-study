---
{
  "id": "concept:id1022:types-and-parametric-polymorphism",
  "courseId": "course:id1022",
  "slug": "types-and-parametric-polymorphism",
  "title": "Types and parametric polymorphism",
  "summary": "Distinguish static checking from annotations, infer generic function signatures, and connect lambdas with functional programming.",
  "centralInsight": "A type variable preserves a relationship between input and output types; it is not permission to use any operation.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-13-09"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-9-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## When is an error detected?

Static checking examines types before execution. Dynamic checking detects incompatible operations when execution reaches them. Type inference and annotations are two ways to supply static type information; omitting an annotation does not imply dynamic typing. Python type hints alone do not enforce a check at runtime.

Static typing does not prove every program safe: an out-of-bounds index or an unreachable base case can still fail. Separate type correctness from runtime conditions and mathematical correctness.

## Read a generic signature

A list-length function can accept a list of any element type because it inspects structure, not element-specific operations. A map signature takes a function from a to b and a list of a, producing a list of b. The same letter means the same type within one use; different letters may denote different types.

A function swapping a pair has input (a, b) and output (b, a). For (3, true), the output is (true, 3). Adding an integer to the first component would constrain a instead of preserving full parametricity. Generic datatypes similarly carry type parameters through their constructors.

## Lambdas and meaning

Lambda abstraction defines an anonymous function; application supplies its argument. Different concrete syntaxes can express the same operation. The abstract syntax distinguishes a variable, an abstraction and an application. Track which occurrence a parameter binds; renaming a bound variable consistently does not change the computation.

## Study route

Predict signatures before running examples. Explain why length is generic, why summing integer elements is more constrained, and why a mapped string conversion changes the output element type. Revisit [higher-order functions](/courses/id1022/concepts/recursion-and-data-structures).
