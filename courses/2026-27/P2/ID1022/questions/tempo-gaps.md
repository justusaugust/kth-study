---
{
  "id": "question:id1022:tempo-gaps",
  "courseId": "course:id1022",
  "slug": "tempo-gaps",
  "title": "Calculate event gaps",
  "conceptIds": [
    "concept:id1022:rhythm-and-timing"
  ],
  "answer": "One beat is 2/3 second. The two internal gaps are 2/3 and 4/3 seconds. The repeating bar needs another 2/3 second after the last event. A finite sequence ending at that event does not need that wrap-around gap.",
  "hints": [
    "Subtract neighboring event positions; then compare the last event with beat 4."
  ],
  "sourceIds": [
    "source:id1022:proggame-loops"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

At 90 BPM, events occur on beats 0, 1 and 3 of a four-beat bar. What delays belong between events, and what additional delay closes a repeating bar?
