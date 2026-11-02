---
{
  "id": "question:id1022:staged-snapshot",
  "courseId": "course:id1022",
  "slug": "staged-snapshot",
  "title": "Which snapshot is recorded?",
  "conceptIds": [
    "concept:id1022:shell-and-git-workflow"
  ],
  "answer": "The staged version. Inspect it with `git diff --staged`; `git diff` shows the later unstaged edit.",
  "hints": [
    "Staging selects a snapshot, not all future edits."
  ],
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": []
}
---

You edit a file, stage it, then edit it again without staging the second edit. Which version enters the next commit?
