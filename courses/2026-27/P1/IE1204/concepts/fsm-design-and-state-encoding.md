---
id: 'concept:ie1204:fsm-design-and-state-encoding'
courseId: 'course:ie1204'
slug: fsm-design-and-state-encoding
title: 'From a specification to an encoded FSM'
summary: 'Build a complete state table before choosing bit codes, deriving equations and checking the implementation.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-22-10']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

## Begin with behaviour, not gates

Identify the input events, output meanings and reset behaviour. Then ask what the circuit must remember. States distinguish histories that need different future behaviour; they are not merely names for whatever outputs happen to be high.

Draw a state diagram and convert it to a transition table. For every present state and every input combination, exactly one next state must be selected. Include self-loops, held requests and simultaneous inputs. If reset has priority, state that explicitly. For a Moore design record one output per state; for Mealy record the output for each state/input case.

## Choose an encoding

For $N$ states, a compact binary encoding needs at least $\lceil\log_2 N\rceil$ state bits. Three states therefore fit in two flip-flops, leaving one unused code. A different assignment of the same three states can change the size of the next-state and output logic without changing the required behaviour.

A Gray ordering changes one bit between neighbouring codes in that ordering. It does not guarantee that every transition in an arbitrary state graph changes just one bit. Check actual transition edges before claiming that property.

Replace the state names with their chosen codes. Derive one Boolean function for each next-state bit; with D flip-flops, that bit's next-state function drives its D input. Derive the output functions separately. Karnaugh maps and the multiplexer decomposition from earlier lectures can simplify or implement those functions.

## Unused is not the same as safely ignored

An unused code is absent from the intended state set, but the physical register can still hold that bit pattern. The deck uses don't-care entries to simplify selected teaching examples. That is a design assumption, not a guaranteed reset or recovery mechanism.

If recovery is required, specify the unused state's next state and outputs before minimising. A truth-table don't-care permits either value; it does not mean the hardware actively detects an error or knows which safe value you intended. Also check that the reset state is actually reachable through the chosen reset wiring.

## Verify against the table

Compare every implemented state/input combination with the encoded table, including required invalid-code behaviour. Then trace multi-edge sequences: reset, idle, one request, a held request and completion. Single-step state outputs alone do not test whether the circuit remembers history correctly.

For traffic-light reasoning, separate a request from the duration of a phase. A transition marked “time” needs a defined timing event, counter or clock convention; a state name does not create seconds by itself. Check that no allowed state commands conflicting green lights, that clearance phases precede changes of right of way, and that a short request is remembered if the specification requires it.

These are general design questions. The assigned lab's exact state table, wiring and demonstration remain separate work; neither this guide nor a simulation establishes a safe real-world traffic controller.
