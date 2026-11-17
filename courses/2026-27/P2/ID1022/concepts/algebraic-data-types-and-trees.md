---
{
  "id": "concept:id1022:algebraic-data-types-and-trees",
  "courseId": "course:id1022",
  "slug": "algebraic-data-types-and-trees",
  "title": "Algebraic data types and binary trees",
  "summary": "Model alternatives with constructors, handle missing values explicitly, and recurse over binary search trees.",
  "centralInsight": "A datatype describes which shapes a value can have; matching follows those shapes.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-10-08"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-8-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## Products and alternatives

A record combines all its fields: two independent finite fields with 2 and 4 possibilities give 8 combinations. A datatype with two disjoint alternatives carrying 2 and 4 possibilities has 6 values. Constructor tags distinguish the alternatives even when payloads look alike.

Pattern matching identifies a constructor and binds its payload. Cover every constructor. Option represents a present value with Some(value) or an absent value with None. Handle absence rather than pretending it is a valid zero or empty string.

## Recursive trees

The lecture uses Leaf as the empty tree and Node(left, value, right) as a nonempty tree. Define one base case for Leaf and recursive work on both subtrees for Node. A node count is zero for Leaf and one plus the two subtree counts otherwise. A binary tree is not automatically a binary search tree.

## Traversal and search

In-order visits left, node, right. Pre-order visits node, left, right. For root 4 with children 2 and 7, these yield [2, 4, 7] and [4, 2, 7]. In-order is sorted only when the search-tree ordering invariant holds.

In the lecture's search tree, every left-subtree key is smaller and every right-subtree key is larger than the node key. Searching follows one branch after each comparison. Cost depends on height: a balanced tree is logarithmic, but a chain can require linear time. Equal-key insertion returns the existing tree in the supplied example.

## Preserve earlier versions

Immutable insertion creates the nodes along the changed path and reuses untouched subtrees. The old root still describes the old tree. This is structural sharing, not a mutable update to every version.

## Study route

Draw a three-node tree, list both traversals, and search for an absent key until reaching Leaf. Then sketch which nodes insertion rebuilds. Review [recursion](/courses/id1022/concepts/recursion-and-data-structures) if the empty-tree case is unclear.
