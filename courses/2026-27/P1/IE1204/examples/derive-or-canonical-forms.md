---
id: 'example:ie1204:derive-or-canonical-forms'
courseId: 'course:ie1204'
slug: derive-or-canonical-forms
title: Derive OR from both canonical forms
conceptIds:
  - 'concept:ie1204:boolean-equations-and-algebra'
sourceIds:
  - 'source:ie1204:lecture-5-boolean-algebra'
lastChecked: '2026-09-01'
confidence: verified
relationships: []
---
OR has output vector $0,1,1,1$. Its one-rows give

$$F=\bar A B+A\bar B+AB.$$

Combine the last two terms: $A\bar B+AB=A$. Then $F=\bar A B+A=A+B$ by covering. The only zero-row is $00$, whose maxterm is already $A+B$, so canonical POS reaches the same expression immediately.
