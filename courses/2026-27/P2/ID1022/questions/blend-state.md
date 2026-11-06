---
{
  "id": "question:id1022:blend-state",
  "courseId": "course:id1022",
  "slug": "blend-state",
  "title": "Trace a persistent drawing effect",
  "conceptIds": [
    "concept:id1022:canvas-graphics"
  ],
  "answer": "Restore normal blending on that canvas. Blend mode persists and otherwise affects the later label too.",
  "hints": [
    "A library can retain state even when your bindings are immutable."
  ],
  "sourceIds": [
    "source:id1022:proggame-canvas"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

You enable additive blending for overlapping circles, then draw an ordinary label. What should you restore before the label, and why?
