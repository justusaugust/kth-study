---
{
  "id": "concept:id1022:lists-and-tuples",
  "courseId": "course:id1022",
  "slug": "lists-and-tuples",
  "title": "Lists and tuples",
  "summary": "A list has one element type and variable length; a tuple has a fixed shape.",
  "centralInsight": "Choose a list when the length varies, and a tuple when each fixed position has a distinct role.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-10-30-03"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-3-slides"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Confusing a list index with its one-based position, or treating tuple arity as variable.",
  "verifyPrompt": "Explain why index 2 is valid for a three-element list but index 3 is not."
}
---

## Choose the shape

Use a list for similar things: scores `[3, 5, 8]` have type `[Int]`. List length can vary at runtime, but elements share a type. Indices start at zero; the final valid index is length minus one. An empty list has no valid index.

A tuple groups a fixed number of fields that may have different types. A name and score can have type `(String, Int)`. A pair and a triple have different types even if all fields are integers. Deconstruction binds names to fields in order.

## Check an index

For `[4, 7, 9]`, indices `0`, `1`, and `2` are valid. Index `3` is outside the list. Before a loop reads an element, explain why its index is in range.

The empty-list type `[a]` leaves its element type to be determined by context. It does not permit arbitrary mixing of unrelated types.
