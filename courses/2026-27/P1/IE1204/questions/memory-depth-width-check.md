---
id: 'question:ie1204:memory-depth-width-check'
courseId: 'course:ie1204'
slug: memory-depth-width-check
title: 'How many words, bits and selected rows?'
conceptIds: ['concept:ie1204:memory-addressing-and-rom']
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
hints: ['The address width controls depth. Output width controls the number of bits per word. Selected need not mean HIGH.']
answer: 'There are 32 words and 32 × 12 = 384 bits, equivalent to 48 bytes of capacity. Address 00101 selects row 5, but the stored output cannot be inferred without its contents. In an enabled active-low decoder, the selected row output is LOW and the others are HIGH; exactly one row is selected.'
---

A fully populated ROM has five address inputs and twelve data outputs. Give its depth and capacity in bits and bytes. What word is returned at address 00101? If its decoder outputs are active-low, what level selects that row and how many rows should be selected at once?
