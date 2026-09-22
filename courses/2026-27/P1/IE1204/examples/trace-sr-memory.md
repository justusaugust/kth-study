---
id: 'example:ie1204:trace-sr-memory'
courseId: 'course:ie1204'
slug: trace-sr-memory
title: Trace a request that stays remembered
conceptIds: ['concept:ie1204:feedback-and-latches']
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

A NOR SR latch starts reset, $Q=0$. Apply each input pair long enough for the circuit to settle.

| Step | S | R | Q after settling | Reason |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 0 | Hold the initial state |
| 2 | 1 | 0 | 1 | Store the request |
| 3 | 0 | 0 | 1 | Releasing the request does not erase it |
| 4 | 1 | 0 | 1 | Reasserting set does not toggle |
| 5 | 0 | 1 | 0 | Clear the stored request |
| 6 | 0 | 0 | 0 | Hold the cleared state |

Steps 1, 3 and 6 have identical inputs but different possible outputs. The missing information is the previous state. To reproduce these operations with a NAND latch, complement each control level: hold becomes 11, set becomes 01 and reset becomes 10. Do not complement the intended stored bit.
