---
{
  "id": "question:id1022:interface-call-boundary",
  "courseId": "course:id1022",
  "slug": "interface-call-boundary",
  "title": "Read an interface boundary",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "conceptIds": [
    "concept:id1022:interfaces-and-subtyping"
  ],
  "answer": "Rectangle.area runs. Shape does not guarantee perimeter, so an interface-typed caller cannot assume it is available.",
  "hints": [
    "Separate the declared interface from the runtime object."
  ],
  "sourceIds": [
    "source:id1022:lecture-12-slides"
  ]
}
---

Circle and Rectangle implement Shape with area(). Rectangle also defines perimeter(). For a variable typed as Shape that holds a Rectangle, which implementation of area runs, and is perimeter guaranteed by the type?
