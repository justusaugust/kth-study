---
{
  "id": "question:id1022:recursive-product",
  "courseId": "course:id1022",
  "slug": "recursive-product",
  "title": "Trace a recursive product",
  "conceptIds": [
    "concept:id1022:recursion-and-data-structures"
  ],
  "answer": "The result is 15: the empty case returns 1, then 5 × 1, then 3 × 5. One is the multiplicative identity, so ending recursion does not change the accumulated product.",
  "hints": [
    "Write the pending multiplication at each call."
  ],
  "sourceIds": [
    "source:id1022:lecture-7-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

A product function returns 1 for [] and head × product(tail) otherwise. Trace it on [3, 5]. Why is the empty-list result 1?
