---
{
  "id": "question:id1022:trace-immutable-loop",
  "courseId": "course:id1022",
  "slug": "trace-immutable-loop",
  "title": "Trace a stopping condition",
  "conceptIds": [
    "concept:id1022:immutable-loops-and-state"
  ],
  "answer": "It prints 1, 2, 3. At state 4 it breaks before printing. Each continue supplies a new state.",
  "hints": [
    "Test the break at each loop entry."
  ],
  "sourceIds": [
    "source:id1022:lecture-3-slides"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": []
}
---

A Pyking loop starts at `s = 1`, breaks when `s == 4`, otherwise prints `s` and continues with `s + 1`. What is printed?
