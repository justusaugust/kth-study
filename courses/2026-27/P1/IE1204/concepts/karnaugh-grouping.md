---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "concept:ie1204:karnaugh-grouping"
slug: "karnaugh-grouping"
title: "Karnaugh maps: adjacency and grouping"
summary: "Arrange a truth table in Gray order, group complete rectangles of 1s, and keep only constant literals."
outcomeIds: ["outcome:ie1204:boolean-logic","outcome:ie1204:design-digital-systems"]
lectureIds: ["lecture:ie1204:2026-09-09-07"]
evidenceStatus: "lecture"
---

## Put the right row in the right cell

Use $A$ for the row and $BC$ for the column. The column order is **00, 01, 11, 10**, not ordinary binary order. The top row contains $m_0,m_1,m_3,m_2$; the bottom contains $m_4,m_5,m_7,m_6$.

Horizontal or vertical neighbours differ in exactly one input. First and last columns are neighbours too: 00 and 10 differ only in $B$. Diagonal cells are not neighbours. For four inputs, label both axes 00, 01, 11, 10; all four corners can form one group.

## A rectangle removes changing variables

For sum of products (SOP), select only 1s, plus optional don't cares. A group is a complete rectangle whose width and height are powers of two. It can cross the map boundary. Four cells in an L shape are not a group, even though four is a power of two.

Keep the inputs that are constant throughout the group: constant 1 gives the ordinary literal; constant 0 gives its complement. Drop every changing input. For example:

$$
\overline{A}B\overline{C}+\overline{A}BC
=\overline{A}B(\overline{C}+C)=\overline{A}B.
$$

In a three-input map, groups of 1, 2, 4 and 8 leave 3, 2, 1 and 0 literals respectively. A group covering the whole map means $F=1$.

## Cover the function

Every required 1 must belong to at least one group. Overlap is allowed and often useful. Prefer larger groups, but retain enough groups to cover every 1. A **prime implicant** is a valid group that cannot be enlarged; it need not be the single largest group anywhere on the map. A prime implicant is **essential** when it covers a 1 that no other prime implicant covers.

A valid group is only one product term. OR the necessary terms together, then check all specified rows. A shorter SOP does not by itself establish minimum physical delay or gate count.
