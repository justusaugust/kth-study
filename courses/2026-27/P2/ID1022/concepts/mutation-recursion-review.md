---
{
  "id": "concept:id1022:mutation-recursion-review",
  "courseId": "course:id1022",
  "slug": "mutation-recursion-review",
  "title": "Mutation and recursion review",
  "summary": "Trace references, explain a recursive call, and practise tree traversal before returning to the official tasks.",
  "centralInsight": "A reference points to an object; a recursive call reduces a problem until a base case applies.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-04-05",
    "lecture:id1022:2026-11-09-07",
    "lecture:id1022:2026-11-10-08",
    "lecture:id1022:2026-11-16-10"
  ],
  "evidenceStatus": "supplemental",
  "sourceIds": [
    "source:id1022:lecture-5-slides",
    "source:id1022:lecture-7-slides",
    "source:id1022:lecture-8-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## 1. Trace shared state

Start with [mutation and aliasing](/courses/id1022/concepts/mutation-and-aliasing). Draw one box per object and one arrow per reference. After each statement, change either a box's contents or an arrow; say which operation happened.

Check yourself: two names refer to one counter initially holding 2. Increment through one name. Both now observe 3. Rebinding one name to a new counter holding 9 leaves the other observing 3. Explain why before using the interactive reference diagram.

## 2. Trace a recursive call

Read [recursion and data structures](/courses/id1022/concepts/recursion-and-data-structures), then revisit [Lecture 7](/courses/id1022/lectures/2026-11-09-07). For every recursive function identify its base case, its smaller input and what happens after the recursive call returns.

For the product of [2, 3, 4], the empty-list product is 1. Unwind as 4 × 1, then 3 × 4, then 2 × 12. The result is 24. A sum uses a different identity: 0. Do not copy the base value without checking the operation.

## 3. Follow a tree

Read [algebraic data types and trees](/courses/id1022/concepts/algebraic-data-types-and-trees) and [Lecture 8](/courses/id1022/lectures/2026-11-10-08). Preorder visits root, left, right; inorder visits left, root, right; postorder visits left, right, root. Inorder is sorted only when the tree obeys the binary-search-tree invariant.

Try the [interactive tree traversal](/visuals/tree-traversal), then predict a different order before stepping through it.

## 4. Practise without the worked answer

Open [ID1022 practice](/practice?course=id1022). Try the recursive-product and tree-traversal self-checks on paper before revealing solutions. Then explain a fresh example aloud: what is shared, what gets smaller, and what is returned?

These are independent revision examples, not submitted ProgGame solutions. Check [Easter eggs and catch-up](/courses/id1022/concepts/easter-eggs-and-catch-up) for the sourced attendance and prerequisite information.
