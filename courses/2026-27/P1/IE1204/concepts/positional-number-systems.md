---
id: 'concept:ie1204:positional-number-systems'
courseId: 'course:ie1204'
slug: positional-number-systems
title: 'Positional number systems'
summary: >-
  A digit contributes its value multiplied by a power of the base; binary is
  the same positional idea as decimal with base 2 instead of base 10.
centralInsight: >-
  The written digit is only half the information: its position determines the
  weight that turns it into a contribution to the number.
commonMistake: >-
  Reading a binary string as decimal digits or shifting the exponents so the
  rightmost integer digit is not assigned weight base to the power zero.
verifyPrompt: >-
  Expand one decimal and one binary number as weighted sums and identify the
  most and least significant integer positions.
outcomeIds:
  - 'outcome:ie1204:number-systems'
lectureIds:
  - 'lecture:ie1204:2026-08-25-01'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: appears_in
    from: 'concept:ie1204:positional-number-systems'
    to: 'lecture:ie1204:2026-08-25-01'
  - type: requires
    from: 'concept:ie1204:positional-number-systems'
    to: 'concept:ie1204:digital-abstraction'
  - type: continues_to
    from: 'concept:ie1204:positional-number-systems'
    to: 'concept:ie1204:base-conversion-and-range'
---
## One idea, different bases

In a positional number system of base $b$, each position has a weight that is a power of $b$. For an integer with digits $x_{m-1}\ldots x_1x_0$,

$$N_b=\sum_{i=0}^{m-1}x_i b^i.$$

The allowed digits are $0,1,\ldots,b-1$. Decimal uses ten symbols and powers of $10$; binary uses only $0$ and $1$ and powers of $2$.

## Decimal and binary side by side

$$653_{10}=6\cdot10^2+5\cdot10^1+3\cdot10^0,$$

while

$$1101_2=1\cdot2^3+1\cdot2^2+0\cdot2^1+1\cdot2^0=13_{10}.$$

The rightmost integer digit always has weight $b^0=1$. Moving one place left multiplies the weight by the base.

## Radix fractions

Positions to the right of the radix point use negative exponents:

$$11.01_2=1\cdot2^1+1\cdot2^0+0\cdot2^{-1}+1\cdot2^{-2}=3.25_{10}.$$

The notation changes with the base; the weighted-sum rule does not.
