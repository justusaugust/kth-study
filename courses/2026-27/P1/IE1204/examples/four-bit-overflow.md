---
id: 'example:ie1204:four-bit-overflow'
courseId: 'course:ie1204'
slug: four-bit-overflow
title: Detect signed overflow in four bits
conceptIds:
  - 'concept:ie1204:fixed-width-arithmetic-and-overflow'
sourceIds:
  - 'source:ie1204:lecture-2-signed-arithmetic'
lastChecked: '2026-08-27'
confidence: verified
relationships: []
---
In four-bit two's complement, $0111_2=7$ and $0010_2=2$. The adder stores $1001_2$, which decodes as $-7$. The exact sum $9$ lies outside $[-8,7]$, and two positive inputs produced a negative stored result, so signed overflow occurred.
