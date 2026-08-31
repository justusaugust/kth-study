---
id: 'concept:ie1204:base-conversion-and-range'
courseId: 'course:ie1204'
slug: base-conversion-and-range
title: 'Base conversion and representable range'
summary: >-
  Weighted sums convert into decimal, repeated division converts decimal
  integers into another base, and an N-bit unsigned word represents 2^N values.
centralInsight: >-
  Conversion changes notation, not value; every step should preserve the same
  quantity while exposing it through different place weights.
commonMistake: >-
  Reading remainders in the order they are produced. Repeated division finds
  the least significant bit first, so the final digits must be reversed.
verifyPrompt: >-
  Convert 45 from decimal to binary, convert the result back by a weighted sum,
  and state the range of an unsigned six-bit word.
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
    from: 'concept:ie1204:base-conversion-and-range'
    to: 'lecture:ie1204:2026-08-25-01'
  - type: requires
    from: 'concept:ie1204:base-conversion-and-range'
    to: 'concept:ie1204:positional-number-systems'
---
## Binary to decimal

Multiply each bit by its place weight and add. For example,

$$1011010_2=1\cdot2^6+0\cdot2^5+1\cdot2^4+1\cdot2^3+0\cdot2^2+1\cdot2^1+0\cdot2^0=90_{10}.$$

## Decimal to binary

Repeatedly divide the integer by $2$. Each remainder is the next binary digit, starting with the least significant bit. Stop when the quotient reaches zero, then read the remainders in reverse order.

## How many values fit?

An unsigned $N$-bit word has $2^N$ distinct patterns. Its range is

$$0\le n\le2^N-1.$$

For three bits, the eight patterns run from $000_2$ to $111_2$, representing $0$ through $7$.

## Octal and hexadecimal as compact binary

Octal groups bits in threes because $8=2^3$. Hexadecimal groups bits in fours because $16=2^4$. A four-bit group is a **nibble**; two nibbles form one eight-bit **byte**. These bases are useful because their digits align exactly with binary groups.
