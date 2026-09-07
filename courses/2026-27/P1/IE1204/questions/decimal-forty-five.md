---
id: 'question:ie1204:decimal-forty-five'
courseId: 'course:ie1204'
slug: decimal-forty-five
hints:
  - 'Divide 45 repeatedly by 2 and record each remainder. Which end of that list contains the most significant bit?'
  - 'Check the result by adding the powers of 2 at the positions containing a 1, starting with weight 1 on the right.'
title: 'Convert and verify a decimal value'
conceptIds:
  - 'concept:ie1204:positional-number-systems'
  - 'concept:ie1204:base-conversion-and-range'
answer: >-
  45₁₀=101101₂ because 32+8+4+1=45. Re-expanding by place weights verifies
  that the converted representation preserves the value.
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: assesses
    from: 'question:ie1204:decimal-forty-five'
    to: 'concept:ie1204:base-conversion-and-range'
---
Convert $45_{10}$ to binary, then verify the result by expanding it as a weighted sum.
