---
id: 'question:ie1204:flip-flop-toggle-check'
courseId: 'course:ie1204'
slug: flip-flop-toggle-check
title: Count edges, not button presses
conceptIds: ['concept:ie1204:edge-triggered-storage']
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
hints: ['Compute the new state from the old Q once at each rising edge; a falling edge does not capture data in this device.']
answer: 'Starting at 0, the next four rising edges produce 1, 0, 1, 0; the output frequency is half the clock frequency. Three sufficiently separated rising edges from one bouncing press produce three toggles, ending at 1, not one controlled transition. A high-transparent latch permits repeated inversion while open. A synchronous reset waits for the active edge; an asynchronous reset can clear Q between edges.'
---

A positive-edge D flip-flop starts at $Q=0$ and has $D=\overline Q$. List $Q$ after four rising edges and give the output frequency relative to a periodic input clock. What happens if one button press produces three well-separated rising edges? Why cannot a high-transparent D latch replace the flip-flop? Finally, which kind of reset can clear the output between clock edges?
