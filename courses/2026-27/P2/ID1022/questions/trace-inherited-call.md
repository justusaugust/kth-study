---
{
  "id": "question:id1022:trace-inherited-call",
  "courseId": "course:id1022",
  "slug": "trace-inherited-call",
  "title": "Trace an inherited call",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "conceptIds": [
    "concept:id1022:inheritance-and-dispatch"
  ],
  "answer": "Report.summary runs first. Its call to title uses SalesReport.title because the actual receiver is a SalesReport.",
  "hints": [
    "Follow the receiver through the second call."
  ],
  "sourceIds": [
    "source:id1022:lecture-11-slides"
  ]
}
---

A base class Report defines title() and summary(), where summary calls self.title(). A SalesReport overrides title and inherits summary. Which bodies run for r.summary() when r refers to a SalesReport?
