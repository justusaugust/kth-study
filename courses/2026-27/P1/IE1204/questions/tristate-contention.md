---
id: 'question:ie1204:tristate-contention'
courseId: 'course:ie1204'
slug: tristate-contention
title: Distinguish a released bus from a conflict
conceptIds: ['concept:ie1204:unknown-and-high-impedance']
answer: 'P drives 1; Q contributes Z, not 0. Ignoring transients and assuming no other drivers, the bus is 1. Enabling Q makes it drive 0 against P: contention, an unreliable value and potentially excessive current. It is not a permitted don’t-care.'
hints: ['A disabled output is disconnected; it does not drive its input.']
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---
Two tri-state buffers share a bus. Driver P is enabled with input 1; driver Q is disabled with input 0. What does each driver contribute and what is the bus value? What changes if Q is enabled too?
