---
id: 'concept:ie1204:logic-gates-and-truth-tables'
courseId: 'course:ie1204'
slug: logic-gates-and-truth-tables
title: Logic gates and truth tables
summary: >-
  Logic gates turn one or more binary inputs into a binary output, and a truth
  table specifies the output for every possible input combination.
centralInsight: >-
  A truth table is the complete behavioural definition of a logic gate,
  independent of the physical circuit used to implement it.
commonMistake: >-
  Reading XOR as ordinary OR; XOR is one only when an odd number of its inputs
  are one.
verifyPrompt: >-
  Write the four rows of the XOR and XNOR truth tables and explain their
  relationship.
outcomeIds:
  - 'outcome:ie1204:boolean-logic'
  - 'outcome:ie1204:analyse-circuits'
lectureIds:
  - 'lecture:ie1204:2026-08-27-02'
  - 'lecture:ie1204:2026-08-31-03'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-2-signed-arithmetic'
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:logic-gates-and-truth-tables'
    to: 'concept:ie1204:digital-abstraction'
  - type: appears_in
    from: 'concept:ie1204:logic-gates-and-truth-tables'
    to: 'lecture:ie1204:2026-08-27-02'
  - type: appears_in
    from: 'concept:ie1204:logic-gates-and-truth-tables'
    to: 'lecture:ie1204:2026-08-31-03'
  - type: continues_to
    from: 'concept:ie1204:logic-gates-and-truth-tables'
    to: 'concept:ie1204:cmos-transistor-networks'
---
## Gate behaviour

NOT inverts one input; a buffer reproduces it. AND outputs one only when all inputs are one, while OR outputs one when at least one input is one. NAND and NOR are their complements. XOR detects odd parity for two inputs, and XNOR is its complement.

For two inputs $A$ and $B$, a truth table has four rows: $00$, $01$, $10$, and $11$. The output column is the complete finite definition of the gate.
