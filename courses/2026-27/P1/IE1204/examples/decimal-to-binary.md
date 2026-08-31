---
id: 'example:ie1204:decimal-to-binary'
courseId: 'course:ie1204'
slug: decimal-to-binary
title: 'Convert a decimal integer by repeated division'
conceptIds:
  - 'concept:ie1204:base-conversion-and-range'
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: verified
relationships:
  - type: supports
    from: 'example:ie1204:decimal-to-binary'
    to: 'concept:ie1204:base-conversion-and-range'
---
To convert $53_{10}$ to binary, repeatedly divide by two and record the remainder:

| Quotient step | Remainder |
| --- | ---: |
| $53=26\cdot2+1$ | $1$ |
| $26=13\cdot2+0$ | $0$ |
| $13=6\cdot2+1$ | $1$ |
| $6=3\cdot2+0$ | $0$ |
| $3=1\cdot2+1$ | $1$ |
| $1=0\cdot2+1$ | $1$ |

The first remainder is the least significant bit. Reading upward therefore gives

$$53_{10}=110101_2.$$
