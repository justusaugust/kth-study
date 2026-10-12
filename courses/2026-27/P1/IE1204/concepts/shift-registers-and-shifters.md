---
id: 'concept:ie1204:shift-registers-and-shifters'
courseId: 'course:ie1204'
slug: shift-registers-and-shifters
title: 'Shift registers, shifters and multiplication'
summary: 'Track bit movement, fill rules and clocked storage before treating shifts as arithmetic operations.'
centralInsight: 'A clocked shift changes stored state; a combinational shift only maps the current word.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:number-systems']
lectureIds: ['lecture:ie1204:2026-10-08-14']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-14-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

## A shift register advances on a clock

A shift register is a row of flip-flops. At the active edge, each stage samples the old value of its neighbour while the first stage samples the serial input. The outgoing serial bit is the old bit at the far end. All stages update together; shifting does not ripple through the entire register during one edge.

A parallel-load input uses a multiplexer before each flip-flop. Specify whether load or shift has priority, which end accepts the serial input and which end supplies the serial output. Parallel-to-serial conversion begins with a load, then emits one stored bit per shift edge. Serial-to-parallel conversion assembles a word over several edges.

## A shifter computes without storing

A combinational shifter uses selection logic to move bits by an indicated amount. Logical shifts insert zeros. Arithmetic right shift copies the old sign bit into the vacated high positions. A rotation wraps discarded bits around to the other end.

For the five-bit word 10110 shifted right twice: logical shift gives 00101, arithmetic shift gives 11101, and rotate-right gives 10101. State the width before moving bits; an unbounded integer model produces different results.

## Arithmetic effects and limits

Left shift by $k$ corresponds to multiplication by $2^k$ only when the mathematical result is representable at the retained width. High bits are discarded otherwise. Arithmetic right shift of a two's-complement integer rounds toward negative infinity: five-bit 11101 represents $-3$, and one arithmetic right shift yields 11110, or $-2$, not $-1$.

Unsigned multiplication sums shifted partial products. An $N$-bit by $M$-bit unsigned product can require $N+M$ bits. Each multiplier bit selects a shifted copy of the multiplicand or zero; aligned columns are added with carry. Do not reuse the unsigned scheme for signed operands without sign extension or a signed multiplication method.
