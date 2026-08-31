---
id: 'example:ie1204:negate-twos-complement'
courseId: 'course:ie1204'
slug: negate-twos-complement
title: Negate a binary word with two's complement
conceptIds:
  - 'concept:ie1204:signed-integer-encodings'
sourceIds:
  - 'source:ie1204:lecture-2-signed-arithmetic'
lastChecked: '2026-08-27'
confidence: verified
relationships: []
---
Start with $01010_2=10_{10}$. Complement each bit to get $10101_2$, then add one: $10101_2+1_2=10110_2$. In five-bit two's complement, $10110_2=-16+4+2=-10$.
