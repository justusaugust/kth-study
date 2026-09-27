---
id: 'question:ie1204:unused-state-recovery-check'
courseId: 'course:ie1204'
slug: unused-state-recovery-check
title: 'Does an unused state recover safely?'
conceptIds: ['concept:ie1204:fsm-circuit-analysis']
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
hints: ['Compute the next code from 11, then repeat the calculation. Reachability and recovery ask different questions.']
answer: 'Code 11 maps to itself and traps the machine unless a separate control such as reset changes it. Unreachability from reset in the ideal model does not prove recovery after abnormal entry. If 11 is redirected to 00, inspect the outputs while still in 11 and during the transition; a safe destination alone does not guarantee acceptable recovery outputs.'
---

A machine uses codes 00, 01 and 10, but its implemented equations also define code 11. Substitution gives $D_1=q_1$, $D_0=q_0$ whenever the current code is 11.

What happens if the register enters 11? Would calling that code “unreachable after reset” prove recovery? What additional output check is needed if you redesign 11 to transition to 00?
