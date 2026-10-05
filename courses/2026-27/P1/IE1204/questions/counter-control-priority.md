---
id: 'question:ie1204:counter-control-priority'
courseId: 'course:ie1204'
slug: counter-control-priority
title: 'Which counter control wins?'
conceptIds: ['concept:ie1204:synchronous-counters']
sourceIds: ['source:ie1204:lecture-12-counters']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
hints: ['Separate between-edge behaviour from rising-edge behaviour. Check reset, then load, then enables.']
answer: 'Before the edge the state remains 1001. At the rising edge it loads 0110 despite the disabled count input. Asserting active-low master reset between edges clears it to 0000 without waiting for another edge. A synchronous 0-through-5 cycle must decode 5 and load 0 at the following edge; decoding 6 would include an extra state.'
---

A 74HC161 holds 1001 with reset inactive. Its parallel data is 0110, active-low load is asserted, and one count enable is low. What is the state before and after the next rising edge? What happens if master reset is then asserted between edges? Separately, which terminal value should trigger synchronous loading of zero for a six-state cycle beginning at zero?
