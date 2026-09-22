---
id: 'example:ie1204:compare-delay-paths'
courseId: 'course:ie1204'
slug: compare-delay-paths
title: Compare parallel timing paths
conceptIds: ['concept:ie1204:combinational-delay-and-hazards']
sourceIds: ['source:ie1204:lecture-8-building-blocks']
lastChecked: '2026-09-15'
confidence: supported
relationships: []
---

Suppose one input-to-output path crosses two gates with $(t_{cd},t_{pd})=(1,4)$ ns and $(2,6)$ ns. Another path crosses one gate with $(t_{cd},t_{pd})=(2,7)$ ns. Assume these are valid path bounds for the circuit.

The longest propagation sum is $\max(4+6,7)=10$ ns. The shortest contamination sum is $\min(1+2,2)=2$ ns. After a relevant input transition, the output cannot change before 2 ns and must have settled by 10 ns. The interval between is not guaranteed stable; it is not a 12 ns delay.
