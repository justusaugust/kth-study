---
id: 'concept:ie1204:fixed-width-arithmetic-and-overflow'
courseId: 'course:ie1204'
slug: fixed-width-arithmetic-and-overflow
title: Fixed-width arithmetic and overflow
summary: >-
  An N-bit register keeps only N result bits; two's-complement arithmetic
  therefore wraps modulo 2^N and needs a separate signed-overflow test.
centralInsight: >-
  The discarded carry belongs to the representation width, while signed overflow
  asks whether the exact mathematical result fits the signed range.
commonMistake: >-
  Calling every carry-out an overflow, or missing overflow when two equal-sign
  operands produce a result with the opposite sign.
verifyPrompt: >-
  Add 0111 and 0010 in four-bit two's complement, decode the stored result, and
  explain why the operation overflowed.
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
    from: 'concept:ie1204:fixed-width-arithmetic-and-overflow'
    to: 'concept:ie1204:signed-integer-encodings'
  - type: appears_in
    from: 'concept:ie1204:fixed-width-arithmetic-and-overflow'
    to: 'lecture:ie1204:2026-08-27-02'
---
## Arithmetic in a register

Binary addition uses the same column-and-carry procedure as decimal addition. With a fixed width, keep the low $N$ bits and discard a carry beyond the register. Two's-complement subtraction uses

$$A-B=A+(\text{two's complement of }B).$$

For signed addition, overflow occurs only when two operands with the same sign produce a stored result with the opposite sign. Equivalently, the carry into the sign bit differs from the carry out.

## Widening a word

Sign extension repeats the sign bit and preserves a two's-complement value. Zero extension adds leading zeros and preserves an unsigned value; applying it to a negative signed word changes the interpretation.
