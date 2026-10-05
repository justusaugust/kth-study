---
id: 'concept:ie1204:memory-addressing-and-rom'
courseId: 'course:ie1204'
slug: memory-addressing-and-rom
title: 'An address selects a stored word'
summary: 'Calculate array capacity and understand a ROM as a decoder feeding programmed output columns.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-10-01-15']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## Depth and width answer different questions

With $N$ address bits and $M$ data bits per word, a fully populated array contains $2^N$ words and $2^N M$ bits. Depth is the number of words; width is the number of bits in one word. Address 011 selects row three, regardless of whether that row contains 0000, 1010 or another word.

To convert capacity to bytes, divide the total bits by eight. Do not assume that each address denotes a byte: a word-addressed 16-bit memory returns two bytes per address. Conversely, a processor's data-bus width alone does not tell you the size of its address space.

## A ROM is a stored truth table

An $N$-to-$2^N$ decoder selects one row. The programmed connections between rows and data columns determine the selected word. Viewed as logic, the address bits are inputs and each data column is one Boolean output function. Increasing width adds more output functions; increasing the address width doubles the number of input combinations.

One-hot selection means one row is selected, not necessarily one wire is HIGH. An active-low decoder selects a row by driving it LOW. In a diode matrix, output polarity also depends on diode orientation, bias resistors and any inverter stage. Work out one selected row all the way to the final outputs before deciding which intersections represent stored ones. Unselected rows must not interfere with the selected word.

## Separate sequencing from storage

In a counter-decoder-ROM-display chain, the counter stores the current position, the ROM maps that position to a word and the display driver maps that word to segments. If the address stays fixed, an ordinary asynchronous ROM read settles to the selected word without a new clock event. The clock is needed to advance the counter, not to invent the stored output.

A three-bit address can choose eight four-bit words: only 32 bits of stored information. A four-bit output used as a decimal digit code is distinct from seven individual segment-control wires. Check the interface at each block rather than confusing the number of displayed digits with the memory word width.
