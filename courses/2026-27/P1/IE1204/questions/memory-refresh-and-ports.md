---
id: 'question:ie1204:memory-refresh-and-ports'
courseId: 'course:ie1204'
slug: memory-refresh-and-ports
title: 'Does static mean persistent?'
conceptIds: ['concept:ie1204:memory-cell-technologies']
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
hints: ['Separate loss through leakage, disturbance during reading, and loss of the power supply. Ports count access paths.']
answer: 'Powered idle DRAM still needs refresh because its stored charge leaks, and a read also needs restoration. SRAM requires no periodic refresh but loses data without power. Flash retains data without power, with programming/erase and endurance constraints. The register file stores 16 × 8 = 128 bits, not 256; two read ports expose two selected words from the same array. A simultaneous read and write to one address requires the specified timing contract to determine the observed value.'
---

An idle powered DRAM is not being read or written by the user. Can refresh stop? Does SRAM retain data after power-off because it is called static? How does flash differ? Finally, does adding a second read port to a 16-word, eight-bit register file double its capacity, and what must be known before predicting a simultaneous read/write of the same word?
