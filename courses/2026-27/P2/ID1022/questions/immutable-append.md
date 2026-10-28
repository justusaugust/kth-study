---
{
  "id": "question:id1022:immutable-append",
  "courseId": "course:id1022",
  "slug": "immutable-append",
  "title": "Separate a new value from mutation",
  "conceptIds": [
    "concept:id1022:immutable-values-and-functions"
  ],
  "answer": "`xs` remains `[2, 4]`. No: a function can still read the clock or perform output even if its data is immutable. Purity also requires no outside effects and the same result for the same arguments.",
  "hints": [
    "Distinguish creating a new value from changing an existing value."
  ],
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-10-28",
  "confidence": "supported",
  "relationships": []
}
---

In language-neutral notation, an immutable append takes `xs = [2, 4]` and returns a new list `ys = [2, 4, 6]`. What should `xs` contain afterwards? Does immutable data alone guarantee that every function is pure?
