---
id: 'example:ie1204:four-word-rom'
courseId: 'course:ie1204'
slug: four-word-rom
title: 'Read a ROM and recover its logic'
conceptIds: ['concept:ie1204:memory-addressing-and-rom']
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

An invented ROM stores these three-bit words, written as $y_2y_1y_0$:

- Address 00 stores 101.
- Address 01 stores 011.
- Address 10 stores 110.
- Address 11 stores 000.

Two address bits select four rows. Each row contains three bits, so the capacity is $4\times3=12$ bits. At address 10 the output is 110, not the address value repeated or converted.

Read each output column as a truth table. For address $a_1a_0$, the high output is one at 00 and 10, giving $y_2=\overline a_0$. The middle output is one at 01 and 10, giving $y_1=a_1\oplus a_0$. The low output is one at 00 and 01, giving $y_0=\overline a_1$.

The ROM and these three logic functions implement the same mapping. If a counter drives addresses 00, 01, 10, 11, the observed output sequence is 101, 011, 110, 000. The counter determines the order; the stored truth table determines the data. Physical diode placement would additionally require the actual decoder and output polarities, which this abstract example deliberately does not specify.
