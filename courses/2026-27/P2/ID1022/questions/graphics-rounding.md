---
{
  "id": "question:id1022:graphics-rounding",
  "courseId": "course:id1022",
  "slug": "graphics-rounding",
  "title": "Use the computed dimension",
  "conceptIds": [
    "concept:id1022:graphics-layout-and-grids"
  ],
  "answer": "Independent integer divisions can round at different points, giving inconsistent pixel positions. Deriving vertical geometry from the actual height keeps the chosen reference dimension consistent.",
  "hints": [
    "Integer truncation does not commute with every sequence of arithmetic operations."
  ],
  "sourceIds": [
    "source:id1022:proggame-canvas"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

An integer canvas height is computed from a proportional width and truncated. Why should a vertical feature use that actual height rather than independently recomputing everything from the width?
