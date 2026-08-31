---
id: 'concept:ie1204:signed-integer-encodings'
courseId: 'course:ie1204'
slug: signed-integer-encodings
title: Signed integer encodings
summary: >-
  A fixed bit pattern can represent a signed integer by sign-magnitude or two's
  complement; the encoding rule determines its value and range.
centralInsight: >-
  In two's complement the most significant bit has weight −2^(N−1), so ordinary
  fixed-width addition works for positive and negative values.
commonMistake: >-
  Treating the leading bit as a detached minus sign when decoding two's
  complement, or forgetting that sign-magnitude has both +0 and −0.
verifyPrompt: >-
  Decode 1001 as a four-bit sign-magnitude number and as a four-bit
  two's-complement number, then explain why the answers differ.
outcomeIds:
  - 'outcome:ie1204:number-systems'
lectureIds:
  - 'lecture:ie1204:2026-08-27-02'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-2-signed-arithmetic'
lastChecked: '2026-08-27'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:signed-integer-encodings'
    to: 'concept:ie1204:positional-number-systems'
  - type: appears_in
    from: 'concept:ie1204:signed-integer-encodings'
    to: 'lecture:ie1204:2026-08-27-02'
  - type: continues_to
    from: 'concept:ie1204:signed-integer-encodings'
    to: 'concept:ie1204:fixed-width-arithmetic-and-overflow'
---
## Two rules for the same bits

In an $N$-bit sign-magnitude word, the first bit records the sign and the remaining $N-1$ bits record the magnitude. Its range is $[-(2^{N-1}-1),2^{N-1}-1]$, with two encodings of zero.

In two's complement,

$$D(B)=-b_{N-1}2^{N-1}+\sum_{i=0}^{N-2}b_i2^i.$$

The range is $[-2^{N-1},2^{N-1}-1]$ and zero has one representation. To negate a word, complement every bit and add one. The shortcut is to copy bits from the right through the first $1$, then complement every remaining bit.

## Reading a negative word

For four bits, $1001_2=-8+1=-7$. Equivalently, complement and add one to find the magnitude: $1001\to0110\to0111=7$, so the original word represents $-7$.
