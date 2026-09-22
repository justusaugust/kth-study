---
id: 'question:ie1204:fsm-encoding-and-recovery'
courseId: 'course:ie1204'
slug: fsm-encoding-and-recovery
title: 'Check an encoding and an unused state'
conceptIds: ['concept:ie1204:fsm-design-and-state-encoding']
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
hints: ['Find the smallest power of two that can represent five states. An unspecified bit allows a logic minimiser to choose either value.']
answer: 'Three bits provide eight codes, so three codes are unused. Unspecified rows do not guarantee recovery: a required recovery destination and outputs must be specified and verified. The example enters Busy, Done, Ready, Busy; a held start is accepted again when sampled in Ready.'
---

A controller needs five states. What is the minimum binary state-register width, and how many codes are unused? A designer marks all unused next-state rows as don't-care, then claims the circuit must recover to reset from them. Is that justified?

Separately, the ready-busy-done example starts in Ready with start held at 1. List the states after its next four edges.
