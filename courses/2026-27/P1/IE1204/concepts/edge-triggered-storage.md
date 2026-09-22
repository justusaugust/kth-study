---
id: 'concept:ie1204:edge-triggered-storage'
courseId: 'course:ie1204'
slug: edge-triggered-storage
title: Edge-triggered storage and clean clocks
summary: Sample data at an edge, use enables and resets correctly, and explain why a toggling flip-flop needs a clean clock.
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-17-09']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

## An edge is an event, not a level

A positive-edge D flip-flop captures $D$ when CLK changes from 0 to 1. It then holds that value through the high interval, falling edge and low interval until another rising edge. A clock triangle denotes edge sensitivity; a bubble at that clock input selects the falling edge. Data changes between the selected edges do not update the stored output.

Two latches controlled on opposite phases explain the idea. For a positive-edge arrangement, the first latch follows $D$ while CLK is low and the second holds. At the rising edge, the first closes and the second opens, transferring the captured value. New changes in $D$ are then blocked by the closed first latch.

Timing exercises normally assume data is stable around each sampling edge and omit propagation delay. Real devices require stable data for their specified setup and hold intervals and update the output after clock-to-output delay. A simultaneous data/clock transition cannot be resolved from the ideal sampling rule alone.

## Registers, enables and resets

A register is several flip-flops sharing a clock. All bits sample on the same selected edge; they do not ripple through one bit at a time.

An enabled D flip-flop captures $D$ at an active edge if EN is high, otherwise it holds. The input mux selects $D$ or feedback $Q$:

$$
D_{\text{internal}}=\mathrm{EN}\,D+\overline{\mathrm{EN}}\,Q.
$$

This reuses the multiplexer from Lecture 8. Enable does not make the output transparent between edges. A synchronous reset acts at the clock edge; an asynchronous reset acts when asserted, without waiting for an edge. Check the specified reset polarity and priority rather than assuming every part behaves alike.

## Toggle once per edge

Connecting $D=\overline Q$ gives $Q^+=\overline Q$ at every selected edge. Starting at zero, the successive stored values are 1, 0, 1, 0. One complete output cycle takes two input-clock periods, so the output frequency is half the input frequency.

The same feedback around a transparent D latch does not give one controlled toggle: while open, each inversion can feed through again. Delay then determines repeated transitions instead of the intended single update. A T flip-flop selects hold for $T=0$ and toggle for $T=1$; a conventional JK flip-flop selects hold, reset, set, toggle for $JK=00,01,10,11$ on its specified edge.

## A pushbutton is not automatically one clock edge

Mechanical contacts can bounce, producing several rising edges from one press. A counter may therefore advance several times even when its logical design is correct. The retained deck recommends an SR-latch two-button clock for Labs 3 and 4: set and reset alternately, keeping the inputs out of the forbidden combination. Reasserting set while already set causes no new rising edge; reset prepares the next one.

The deck explicitly rejects one shown Schmitt-trigger clock arrangement for the lab kit. Follow the current lab instructions and chip data sheet for wiring, power and inactive preset/clear levels; this conceptual guide is not a pin-by-pin wiring instruction or evidence of completed lab work.
