---
id: 'question:ie1204:moore-mealy-between-edges'
courseId: 'course:ie1204'
slug: moore-mealy-between-edges
title: 'Can an output change without a state transition?'
conceptIds: ['concept:ie1204:moore-and-mealy-machines']
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
hints: ['Hold q fixed and substitute the new input into each output equation.']
answer: 'A stays 0 and is Moore. B becomes 1 after combinational propagation and is Mealy. A next-state candidate can change between edges, but the state register waits for its specified active edge unless an asynchronous control overrides it.'
---

A state bit $q$ is held at 0 between clock edges. Output A is defined as $A=q$ and output B as $B=q\oplus x$. Input $x$ changes from 0 to 1.

Which output may change before the next edge? Which is Moore and which is Mealy? Does a changing next-state candidate mean that the state register has already updated?
