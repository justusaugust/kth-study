---
id: 'concept:ie1204:cmos-transistor-networks'
courseId: 'course:ie1204'
slug: cmos-transistor-networks
title: CMOS transistor networks
summary: >-
  CMOS gates pair a pMOS pull-up network with an nMOS pull-down network so a
  stable output is connected to either the supply or ground.
centralInsight: >-
  pMOS turns on for a zero input and passes a strong one; nMOS turns on for a
  one input and passes a strong zero. Their complementary networks implement
  the same Boolean function from opposite directions.
commonMistake: >-
  Giving pMOS and nMOS the same switching rule, or arranging both networks in
  the same topology. NAND uses parallel pMOS and series nMOS; NOR reverses
  those arrangements.
verifyPrompt: >-
  Trace all four input rows of a two-input CMOS NAND gate and identify which
  transistors conduct in each row.
outcomeIds:
  - 'outcome:ie1204:boolean-logic'
  - 'outcome:ie1204:analyse-circuits'
lectureIds:
  - 'lecture:ie1204:2026-08-31-03'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:cmos-transistor-networks'
    to: 'concept:ie1204:logic-gates-and-truth-tables'
  - type: appears_in
    from: 'concept:ie1204:cmos-transistor-networks'
    to: 'lecture:ie1204:2026-08-31-03'
---
## Complementary switches

An nMOS transistor conducts when its gate input is $1$; connect its source to ground and it can pull an output to a strong $0$. A pMOS transistor conducts when its gate input is $0$; connect its source to $V_{DD}$ and it can pull an output to a strong $1$.

A CMOS gate joins the drains of two complementary networks at the output:

$$V_{DD}\longrightarrow\text{pMOS pull-up}\longrightarrow Y\longrightarrow\text{nMOS pull-down}\longrightarrow\text{GND}.$$

For every valid input combination, one network conducts and the other does not.

## Series and parallel encode logic

Series switches require every switch to conduct; parallel switches require at least one conducting branch. A two-input NAND therefore uses parallel pMOS devices above the output and series nMOS devices below it. Only $A=B=1$ completes the pull-down path. A NOR gate uses series pMOS and parallel nMOS, so only $A=B=0$ completes the pull-up path.

AND and OR are commonly built by following NAND or NOR with a CMOS inverter. NOT uses one pMOS and one nMOS; NAND and NOR use four transistors.
