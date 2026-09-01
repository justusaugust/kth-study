---
id: 'concept:ie1204:boolean-equations-and-algebra'
courseId: 'course:ie1204'
slug: boolean-equations-and-algebra
title: Boolean equations and algebra
summary: >-
  Minterms collect the truth-table rows where the output is one, maxterms collect
  the rows where it is zero, and Boolean identities reduce either canonical
  equation without changing the function.
centralInsight: >-
  Canonical SOP, canonical POS, and a simplified expression are different
  descriptions of the same truth-table behaviour.
commonMistake: >-
  Copying a zero input directly into a minterm. A minterm must evaluate to one
  on its row, so a zero input contributes the complemented literal.
verifyPrompt: >-
  Derive both canonical forms for XOR, then show why neither form changes its
  four-row truth table.
outcomeIds:
  - 'outcome:ie1204:boolean-logic'
  - 'outcome:ie1204:analyse-circuits'
lectureIds:
  - 'lecture:ie1204:2026-09-01-05'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-5-boolean-algebra'
lastChecked: '2026-09-01'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:boolean-equations-and-algebra'
    to: 'concept:ie1204:logic-gates-and-truth-tables'
  - type: appears_in
    from: 'concept:ie1204:boolean-equations-and-algebra'
    to: 'lecture:ie1204:2026-09-01-05'
---
## From a table to an equation

For canonical sum-of-products (SOP), write the minterm that is true on each row with output $1$, then OR those minterms. For canonical product-of-sums (POS), write the maxterm that is false on each row with output $0$, then AND those maxterms.

For the output vector $0,1,1,1$ in row order $00,01,10,11$:

$$F=\bar A B+A\bar B+AB=\prod M(0).$$

## Simplify without changing the function

Boolean algebra has identity, null, idempotent, complement, distributive, covering, combining, and consensus laws. Apply them to remove terms or literals; the reduced equation is valid only if every truth-table output remains unchanged.

For example, $A\bar B+AB=A(\bar B+B)=A$. The combining step replaces two terms that differ only in $B$ with the part they share.

## Duality

Swapping AND with OR and $0$ with $1$ turns a valid Boolean identity into its dual. This is why the laws and the SOP/POS forms arrive in pairs.
