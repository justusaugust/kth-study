---
id: 'concept:ie1204:moore-and-mealy-machines'
courseId: 'course:ie1204'
slug: moore-and-mealy-machines
title: 'State transitions, Moore outputs and Mealy outputs'
summary: 'Separate stored state from combinational next-state and output logic, then trace the machine across clock edges.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-22-10']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

## State is the relevant part of the past

A finite-state machine remembers enough history to decide what happens next. A state name describes that memory: for example, “no request pending” and “request being served” are different situations even if the external button currently reads zero.

A synchronous FSM contains a state register, combinational next-state logic and output logic. Let $q$ be the present state and $x$ the inputs:

$$
q^+=f(q,x).
$$

The combinational circuit continuously computes the candidate $q^+$. The register copies that candidate into $q$ at the active clock edge. Until then, calculating a new candidate does not mean that the machine has changed state. All state bits sample together; do not update one bit and then use its new value to calculate the others.

The simple synchronous model uses a shared clock and puts a register in every feedback cycle. It assumes valid input levels and adequate settling time around the sampling edge.

## Moore and Mealy describe output dependencies

- Moore: $y=g(q)$. Write the output inside the state.
- Mealy: $y=g(q,x)$. Write the input condition and output on the transition.

Both models use current state and input to determine the next state. Their difference is the output logic, not whether their state register has a clock.

For a Moore machine, changing an input while holding the state fixed cannot change the ideal output. A Mealy output may change after input propagation delay without a clock edge. Mealy designs can use fewer states for some specifications, but there is no universal rule that they are better or that every Mealy machine saves exactly one state.

Moore does not guarantee physically glitch-free outputs: decoding several changing state bits may create a transient hazard. Likewise, adding an output register to a Mealy design changes its timing contract. Distinguish the functional model from propagation delays and output registration.

## Trace one event at a time

Start from the specified reset state. Before each selected edge, record the present state and the input to be sampled. Use exactly one matching table entry to obtain the next state. At the edge, update the state, then determine the outputs according to their dependencies.

An input-labelled arrow is a condition, not a command that fires repeatedly while you look at it. A held input may cause another transition at the next clock edge, but not a chain of state changes within the same edge.

Reset establishes a known starting state. A synchronous reset takes effect at the active edge; an asynchronous reset can act independently of it. The word “reset” alone does not specify its polarity, timing or priority over other inputs.
