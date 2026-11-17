---
{
  "id": "question:id1022:counter-alias",
  "courseId": "course:id1022",
  "slug": "counter-alias",
  "title": "Trace a receiver and an alias",
  "conceptIds": [
    "concept:id1022:objects-methods-and-events"
  ],
  "answer": "Both observe 5 because all three events update the same object. Separate counters starting at 2 would end at 3 and 4 respectively.",
  "hints": [
    "Count objects separately from variable names."
  ],
  "sourceIds": [
    "source:id1022:lecture-10-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

A mutable counter starts at 2. a and b reference that same counter. a receives one increment event, then b receives two. What do both references observe? How would separate instances differ?
