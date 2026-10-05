---
id: 'example:ie1204:memory-capacity-and-ports'
courseId: 'course:ie1204'
slug: memory-capacity-and-ports
title: 'Separate storage capacity from simultaneous access'
conceptIds: ['concept:ie1204:memory-cell-technologies', 'concept:ie1204:memory-addressing-and-rom']
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

A word-addressed array has 11 address bits and 16 data bits. Its depth is $2^{11}=2048$ words and its capacity is $2048\times16=32768$ bits, or 4096 bytes = 4 KiB. Saying “11 address bits means 2 KiB” would silently assume one byte per address.

Now consider a separate 8-word, 16-bit register file with two independent read ports and one rising-edge write port. Its capacity is $8\times16=128$ bits. Both read addresses and the write address need three bits. Suppose word 2 contains 9 and word 5 contains 12. Setting read addresses to 2 and 5 exposes 9 and 12 simultaneously; it does not double the stored capacity.

Set write enable, write address 6 and write data 21. At the active edge word 6 becomes 21, while words 2 and 5 remain unchanged. Disabling write enable leaves word 6 unchanged at later edges even if the write-data pins change. Reading address 6 after the write has settled returns 21. Reading address 6 during the write itself needs an explicit read-during-write timing contract.

If this array uses SRAM cells, powered idle storage needs no refresh. A DRAM implementation still needs refresh while idle and restoration when read. Neither retains its data after power is removed; persistence would require a different storage mechanism.
