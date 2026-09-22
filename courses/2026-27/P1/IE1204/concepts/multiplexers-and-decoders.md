---
id: 'concept:ie1204:multiplexers-and-decoders'
courseId: 'course:ie1204'
slug: multiplexers-and-decoders
title: Multiplexers and decoders
summary: Select a data input with a multiplexer, or activate one output from a binary address with a decoder.
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-15-08']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-8-building-blocks']
lastChecked: '2026-09-15'
confidence: supported
relationships: []
---

## Select data with a multiplexer

A 2:1 multiplexer has data inputs $D_0,D_1$, a select input $S$, and one output:

$$Y=\overline{S}D_0+SD_1.$$

When $S=0$, only the first term can contribute and $Y=D_0$. When $S=1$, $Y=D_1$. The select signal is an address, not an extra data input. A $2^n$:1 mux needs $n$ select bits; a bus mux applies the same selection to every bit of a word.

## Build logic by splitting on one input

Choose $S=A$. Evaluate the desired function at $A=0$ to obtain $D_0$, and at $A=1$ to obtain $D_1$. This is the decomposition $F=\overline{A}F(0,B)+AF(1,B)$.

For AND, connect $D_0=0,D_1=B$. For OR, connect $D_0=B,D_1=1$. For XOR, connect $D_0=B,D_1=\overline{B}$. Verify both select cases rather than memorising a drawing.

A 4:1 mux can implement any two-input Boolean function: use the two variables as the address and wire each data input to that row's truth-table value. Larger muxes can be assembled as a tree, but extra levels add delay.

## Decode an address

An active-high 2:4 decoder maps address $AB$ to one asserted output:

$$Y_0=\overline{A}\,\overline{B},\quad Y_1=\overline{A}B,\quad Y_2=A\overline{B},\quad Y_3=AB.$$

For $AB=10$, $Y_2=1$ and the other outputs are zero. Each output represents one minterm, so ORing selected outputs implements a sum of minterms. For example, XOR is $Y_1+Y_2$.

Actual parts may have enables and **active-low outputs**: the selected output is then zero, not one. Check the symbol bubbles and data sheet before applying the ideal active-high equations. A demultiplexer routes data to an addressed output; a decoder identifies the address itself.
