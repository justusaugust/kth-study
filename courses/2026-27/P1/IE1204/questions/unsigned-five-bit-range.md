---
id: 'question:ie1204:unsigned-five-bit-range'
courseId: 'course:ie1204'
slug: unsigned-five-bit-range
hints:
  - 'Each of the five positions has two independent choices. Multiply those choices to count the bit patterns.'
  - 'The smallest unsigned value uses all zeros. For the largest, sum the five place weights; do not confuse the number of values with the largest value.'
title: 'Find the range of an unsigned word'
conceptIds:
  - 'concept:ie1204:base-conversion-and-range'
answer: >-
  Five bits provide 2^5=32 patterns. The unsigned range is 0 through 31, from
  00000₂ to 11111₂.
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: assesses
    from: 'question:ie1204:unsigned-five-bit-range'
    to: 'concept:ie1204:base-conversion-and-range'
---
How many distinct values fit in an unsigned five-bit word, and what is its decimal range?
