---
id: 'example:ie1204:latch-versus-edge-trace'
courseId: 'course:ie1204'
slug: latch-versus-edge-trace
title: Give a latch and a flip-flop the same signals
conceptIds: ['concept:ie1204:feedback-and-latches', 'concept:ie1204:edge-triggered-storage']
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
---

Initially CLK, D and both outputs are zero. Compare a high-transparent D latch with a positive-edge D flip-flop. Events are separated enough for data and outputs to settle.

| Event | Latch Q | Flip-flop Q | Explanation |
| --- | --- | --- | --- |
| D rises while CLK stays low | 0 | 0 | Latch closed; no sampling edge |
| CLK rises with D=1 | 1 | 1 | Latch opens; flip-flop samples 1 |
| D falls while CLK stays high | 0 | 1 | Latch follows; flip-flop holds |
| CLK falls with D=0 | 0 | 1 | Latch closes; falling edge is inactive for this flip-flop |
| CLK rises again with D=0 | 0 | 0 | Flip-flop finally samples the new zero |

Mark the selected clock edges before tracing a flip-flop. For a latch, mark the whole transparent interval. Confusing those two markings explains the wrong claim that both outputs must follow D during the high interval.
